<?php

namespace App\Services\Scholars\Download;

use Illuminate\Support\Facades\DB;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Border;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class ScholarDirectoryDownloadService
{
    public function main($request, $municipality, $filePath)
    {
        $templatePath = public_path('templates/BNS_Directory.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $activeWorksheet = $spreadsheet->getActiveSheet();

        $municity_type = "";
        $municity_name = str_contains($municipality->name, 'City') ? strtoupper(str_replace("City", "", $municipality->name)) : strtoupper($municipality->name);
        str_contains($municipality->name, 'City') ? $municity_type = "CITY OF " : $municity_type  = "MUNICIPALITY OF ";
        $activeWorksheet->setCellValue('A1', "BARANGAY NUTRITION SCHOLAR DIRECTORY -  $municity_type $municity_name  $request->year");
        $cellrow = 5;
        $current_no = 1;

        $scholars = $this->scholarQuery($municipality, $request);
        $styleArray = $this->arrayStyle();

        foreach ($scholars as $key => $scholar) {

            $scholar_eligibility = DB::table('tbl_eligibilities')->where('scholar_id', $scholar->id)->get();
            $eligibility_all = "";
            $age = $this->getAge($scholar);

            foreach ($scholar_eligibility as $se) {
                $eligibility_all .= "$se->name\n";
            }

            $scholar_replacement_date = $this->replacementDate($scholar);
            $this->setCellValues($cellrow, $scholar, $current_no, $activeWorksheet, $age, $scholar_replacement_date, $styleArray);

            $cellrow++;
            $current_no++;
        }
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $activeWorksheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_LANDSCAPE);
        $writer->save($filePath);
    }
    
    private function scholarQuery($municipality, $request)
    {
        $data = DB::table('tbl_scholars')
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
                'tbl_scholars.status as status'
            )
            ->get();

        return $data;
    }

    private function arrayStyle()
    {
        $array = [
            'borders' => [
                'allBorders' => [
                    'borderStyle' => Border::BORDER_THIN,
                    'color' => ['argb' => 'FF000000'], // Black border color
                ],
            ],
        ];

        return $array;
    }

    private function getAge($scholar)
    {
        $age = 0;

        if (intval(date('m')) < intval(date('m', strtotime($scholar->birth_date)))) {
            $age = date('Y') - date('Y', strtotime($scholar->birth_date)) - 1;
        } elseif (intval(date('m')) >= intval(date('m', strtotime($scholar->birth_date)))) {
            $age = date('Y') - date('Y', strtotime($scholar->birth_date));
        }
        return $age;
    }

    private function replacementDate($scholar)
    {
        $replacement = 'N';
        if ($scholar->first_employment_date == null && $scholar->replacement_date == null) {
            $replacement = "N/A";
        } elseif ($scholar->first_employment_date && $scholar->replacement_date == null) {
            $replacement = "Present";
        } else {
            $replacement = date("F j, Y", strtotime($scholar->replacement_date));
        }

        return $replacement;
    }

    private function setCellValues($cellrow, $scholar, $current_no, $activeWorksheet, $age, $scholar_replacement_date, $styleArray)
    {
        $activeWorksheet->setCellValue('A' . $cellrow, $current_no);
        $activeWorksheet->setCellValue('B' . $cellrow, $scholar->id_no);
        $activeWorksheet->setCellValue('C' . $cellrow, $scholar->first_name);
        $activeWorksheet->setCellValue('D' . $cellrow, $scholar->middle_name);
        $activeWorksheet->setCellValue('E' . $cellrow, $scholar->middle_name ? substr($scholar->middle_name, 0, 1) . '.' : '');
        $activeWorksheet->setCellValue('F' . $cellrow, $scholar->last_name);
        $activeWorksheet->setCellValue('G' . $cellrow, $scholar->name_on_id);
        $activeWorksheet->setCellValue('H' . $cellrow, 'IV-A');
        $activeWorksheet->setCellValue('I' . $cellrow, 'LAGUNA');
        $activeWorksheet->setCellValue('J' . $cellrow, $scholar->barangay_name);
        $activeWorksheet->setCellValue('K' . $cellrow, $scholar->complete_address);
        $activeWorksheet->setCellValue('L' . $cellrow, $scholar->sex);
        $activeWorksheet->setCellValue('M' . $cellrow, str_replace('-', '/', date('m-d-Y', strtotime($scholar->birth_date))));
        $activeWorksheet->setCellValue('N' . $cellrow, $age);
        // $activeWorksheet->setCellValue('K' . $cellrow, $municipality->name);
        $activeWorksheet->setCellValue('O' . $cellrow, $scholar->civil_status);
        $activeWorksheet->setCellValue('P' . $cellrow, $scholar->status);
        $activeWorksheet->setCellValue('Q' . $cellrow, $scholar->fund);
        $activeWorksheet->setCellValue('R' . $cellrow, $scholar->educational_attainment);
        $activeWorksheet->setCellValue('S' . $cellrow, $scholar->benificiary_name);
        $activeWorksheet->setCellValue('T' . $cellrow, $scholar->relationship);
        $activeWorksheet->setCellValue('U' . $cellrow, $scholar->first_employment_date ? date('F Y', strtotime($scholar->first_employment_date)) : "N/A");
        $activeWorksheet->setCellValue('V' . $cellrow, $scholar_replacement_date);
        $activeWorksheet->setCellValue('W' . $cellrow, $scholar->philhealth_no ? '✓' : '');
        $activeWorksheet->setCellValue('X' . $cellrow, $scholar->classification);
        $activeWorksheet->setCellValue('Y' . $cellrow, $scholar->philhealth_no ? $scholar->philhealth_no : '');
        $activeWorksheet->getStyle('A' . $cellrow . ':X' . $cellrow)->applyFromArray($styleArray);
    }
    
}
