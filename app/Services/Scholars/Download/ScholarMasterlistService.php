<?php

namespace App\Services\Scholars\Download;

use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class ScholarMasterlistService
{
    public function main($municipality, $request, $months, $filePath)
    {
        $reader = new Xlsx();
        $spreadsheet = $reader->load(public_path('/templates/BNS_Masterlist_Template.xlsx'));
        $activeWorksheet = $spreadsheet->getActiveSheet();

        $scholars = DB::table('tbl_scholars as tbl_scholars')
            ->leftjoin('tbl_barangays as b', 'b.code', '=', 'tbl_scholars.barangay_id')
            ->leftJoin('tbl_service_periods', function ($join) {
                //kunin lang isang service period na latest
                $join->on('tbl_service_periods.scholar_id', '=', 'tbl_scholars.id')
                    ->on('tbl_service_periods.id', '=', DB::raw("(SELECT MAX(id) from tbl_service_periods WHERE tbl_service_periods.scholar_id = tbl_scholars.id)"));
            })
            ->where('citymuni_id', $municipality->code)
            ->where('fund', 'like', "$request->fund%")
            // ->where('tbl_scholars.status', '!=', 'INACTIVE')
            ->where('tbl_service_periods.year_from', '<=', $request->year)
            ->where(function ($query) use ($request) {
                //logic lang neto ay kelangan pasok sa range ng year from at year to yung requested year
                $query->where('tbl_service_periods.year_to', '>=', $request->year)
                    ->orWhere('tbl_service_periods.year_to', 0);
            })
            ->select(
                'tbl_scholars.*',
                'b.name as barangay_name',
                'tbl_service_periods.*',
                'tbl_scholars.status as status',
                DB::raw('CONCAT(tbl_scholars.last_name, ", ", tbl_scholars.first_name, " " ,  COALESCE(tbl_scholars.middle_name, "")) AS full_name')
            )
            ->get();


        $signatories = DB::table('tbl_signatories')->get();
        $action_officer_name = $signatories->where('status', 1)->where('designation_id', 1)->first()->name;
        $action_officer_position = $signatories->where('status', 1)->where('designation_id', 1)->first()->description;
        $chairman_name = $signatories->where('status', 1)->where('designation_id', 5)->first();

        if (!$chairman_name) {
            return response()->json(['message' => 'Missing Provincial Nutrition Action Officer Signatory'], 422);
        }
        if ($scholars->count() == 0) {
            return response()->json(['message' => "No $request->fund Scholars For $municipality->name in year $request->year"], 422);
        }
        $styleArray = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'], // Black border color
                ],
            ],
        ];
        $scholar_count = $scholars->count();
        $scholars = $scholars->toArray();
        $scholars = array_chunk($scholars, 25, true);

        // $activeWorksheet->setCellValue('F3', 'Municipality of ' . $municipality->name);
        // $activeWorksheet->setCellValue('F5', 'LIST OF BNS  for the year ' . $request->year);
        $municity_type = "";
        $municity_name = str_contains($municipality->name, 'City') ? strtoupper(str_replace("City", "", $municipality->name)) : strtoupper($municipality->name);
        str_contains($municipality->name, 'City') ? $municity_type = "CITY OF " : $municity_type  = "MUNICIPALITY OF ";
        $activeWorksheet->setCellValue('A1', "$request->year BARANGAY NUTRITION SCHOLAR MASTERLIST -  $municity_type $municity_name");

        $page = 1;
        $total_page = ceil($scholar_count / 25);
        $current_no = 1;


        foreach ($scholars as $key => $sc) {

            $cellrow = 5;
            $title = "Page $page of $total_page";
            $clone_sheet = clone $spreadsheet->getSheet(0);
            $clone_sheet->setTitle("Page $page");
            $spreadsheet->addSheet($clone_sheet);
            $spreadsheet->setActiveSheetIndex($page); // Set the new sheet as active
            $clone_sheet = $spreadsheet->getActiveSheet(); // Now modify the correct sheet

            foreach ($sc as $key => $scholar) {
                $age = 0;

                if (intval(date('m')) < intval(date('m', strtotime($scholar->birth_date)))) {
                    $age = date('Y') - date('Y', strtotime($scholar->birth_date)) - 1;
                } elseif (intval(date('m')) >= intval(date('m', strtotime($scholar->birth_date)))) {
                    $age = date('Y') - date('Y', strtotime($scholar->birth_date));
                }
                $eligibility_all = "";
                $scholar_eligibility = DB::table('tbl_eligibilities')->where('scholar_id', $scholar->id)->get();

                $service_period_from = $months[intval($scholar->month_from) - 1] . ' ' . $scholar->year_from;
                $service_period_to =  $scholar->month_to != 0 ? $months[intval($scholar->month_to) - 1] . ' ' . $scholar->year_to : 'To Present';
                $clone_sheet->setCellValue("A$cellrow", $current_no);
                $clone_sheet->setCellValue("B$cellrow", $scholar->id_no);
                $clone_sheet->setCellValue("C$cellrow", $scholar->first_name);
                $clone_sheet->setCellValue("D$cellrow", $scholar->middle_name);
                $clone_sheet->setCellValue("E$cellrow", $scholar->middle_name ? substr($scholar->middle_name, 0, 1) . "." : "");
                $clone_sheet->setCellValue("F$cellrow", $scholar->last_name);
                $clone_sheet->setCellValue("G$cellrow", $scholar->name_on_id);
                $clone_sheet->setCellValue("H$cellrow", "LAGUNA");
                $clone_sheet->setCellValue("I$cellrow", $municipality->name);
                $clone_sheet->setCellValue("K$cellrow", $scholar->sex);
                $clone_sheet->setCellValue("J$cellrow", $scholar->barangay_name);
                $clone_sheet->setCellValue("K$cellrow", $scholar->sex);
                $clone_sheet->setCellValue("L$cellrow", $scholar->birth_date ? date('m/d/Y', strtotime($scholar->birth_date)) : "");
                $clone_sheet->setCellValue("M$cellrow", $age);
                $clone_sheet->setCellValue("N$cellrow", $scholar->status);
                $clone_sheet->setCellValue("O$cellrow", $scholar->fund);
                $clone_sheet->setCellValue("P$cellrow", $scholar->benificiary_name);
                $clone_sheet->setCellValue("Q$cellrow", $scholar->relationship);
                $clone_sheet->setCellValue("R$cellrow", $scholar->first_employment_date ? date('F j, Y', strtotime($scholar->first_employment_date)) : "");
                $clone_sheet->setCellValue("S$cellrow", $service_period_from);
                $clone_sheet->setCellValue("T$cellrow", $service_period_to);

                foreach ($scholar_eligibility as $se) {
                    $eligibility_all .= $se->name . "\n";
                }

                $clone_sheet->getStyle("A$cellrow:N$cellrow")->applyFromArray($styleArray);

                $cellrow++;
                $current_no++;
            }

            $clone_sheet->setCellValue("T40", $title);

            $page++;
        }
        $spreadsheet->removeSheetByIndex(0); //template

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $activeWorksheet->getPageSetup()->setScale(75); // Adjust the scale to your preference, e.g., 85%
        $activeWorksheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE);

        $writer->save($filePath);
    }
}
