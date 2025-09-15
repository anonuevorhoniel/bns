<?php

namespace App\Services\Payrolls;

use App\Models\Municipality;
use App\Models\Scholar;
use App\Models\Signatories;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Worksheet\PageSetup;

class PayrollMasterlistService
{
    public function main($payroll, $request, $filePath)
    {
        $months = months();
        $municipality = Municipality::where('code', $payroll->municipality_code)->first();
        $templatePath = public_path('templates/BNS_Masterlist_Payroll_Template.xlsx');
        $spreadsheet = IOFactory::load($templatePath);
        $activeWorksheet = $spreadsheet->getActiveSheet();
        $scholars = $this->scholarQuery($payroll);

        $activeWorksheet->setCellValue('A1', 'MASTERLIST OF BNS FOR ' . strtoupper($months[intVal($payroll->month_from) - 1]) . ' TO ' . strtoupper($months[intVal($payroll->month_to) - 1]) . ', ' . $payroll->year_from);
        $activeWorksheet->setCellValue('A2', strtoupper($municipality->name) . ', LAGUNA');

        $this->processScholarChunks($scholars, $spreadsheet);

        if ($scholars->count() == 0) {
            return response()->json(['error' => 'No Scholars For ' .  $municipality->name . ' in year ' . $request->masterlist_payroll_year], 422);
        }
        $spreadsheet->removeSheetByIndex(0); //template
        $spreadsheet->setActiveSheetIndex(0);

        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $activeWorksheet->getPageSetup()->setScale(83); // Adjust the scale to your preference, e.g., 85%
        $activeWorksheet->getPageSetup()->setOrientation(PageSetup::ORIENTATION_PORTRAIT);

        $writer->save($filePath);
    }

    private function header($page, $scholars, $activeWorksheet, $spreadsheet)
    {
        $last_page = $scholars->count();

        $pageNumber = $page + 1;
        $current_no = 1;
        $cellrow = 6;
        $title = "Page $pageNumber of $last_page";
        $activeWorksheet->setTitle($title);
        $spreadsheet->addsheet($activeWorksheet);
        $activeWorksheet->setCellValue("C4", $title);

        return [$current_no, $cellrow];
    }

    private function processScholarChunks($scholars, $spreadsheet)
    {

        foreach ($scholars as $page => $chunk) {
            $activeWorksheet = clone $spreadsheet->getSheet(0);
            [$current_no, $cellrow] = $this->header($page, $scholars, $activeWorksheet, $spreadsheet);

            foreach ($chunk as $key => $scholar) {
                $this->setBody($scholar, $activeWorksheet, $cellrow, $current_no);
                $cellrow++;
                $current_no++;
            }

            $signatories = $this->signatories();
            $chairman_name = $signatories['chairman_name'];

            if (!$chairman_name) {
                return redirect()->back()->withErrors('Missing Provincial Nutrition Action Officer Signatory');
            }

            $this->setFooter($cellrow, $activeWorksheet);
            $this->styleFooter($activeWorksheet, $cellrow);

            unset($sheet);
        }
    }

    private function scholarQuery($payroll)
    {
        $data =  Scholar::with(['payrollDetails' => function ($query) use ($payroll) {
            $query->where('payroll_id', $payroll->id);
            //optional lang, para di magload lahat ng payrolldetails per scholar
        }])
            ->whereHas('payrollDetails', function ($query) use ($payroll) {
                $query->where('payroll_id', $payroll->id);
            })
            ->get();
        $data = $data->chunk(25, true);

        return $data;
    }

    private function setBody($scholar, $activeWorksheet, $cellrow, $current_no)
    {
        $styleArray = styleArray();
        $full_name = "$scholar->last_name, $scholar->first_name $scholar->middle_name $scholar->name_extension";
        $activeWorksheet->setCellValue('A' . $cellrow, $current_no);
        $activeWorksheet->setCellValue('B' . $cellrow, strtoupper($full_name));
        $activeWorksheet->setCellValue('C' . $cellrow, $scholar->barangay->name);

        $activeWorksheet->getStyle('A' . $cellrow . ':C' . $cellrow)->applyFromArray($styleArray);
    }

    private function signatories()
    {
        $signatories = Signatories::all();
        $action_officer_name = $signatories->where('status', 1)->where('designation_id', 1)->first()->name;
        $action_officer_position = $signatories->where('status', 1)->where('designation_id', 1)->first()->description;
        $chairman_name = $signatories->where('status', 1)->where('designation_id', 5)->first();

        return compact('action_officer_name', 'action_officer_position', 'chairman_name');
    }

    private function certifiedAndNoted($cellrow)
    {
        $certified_correct = 'A' . $cellrow + 2;
        $certified_correct2 = 'B' . $cellrow + 2;
        $certified_correct3 = 'A' . $cellrow + 6;
        $certified_correct4 = 'B' . $cellrow + 6;
        $certified_correct5 = 'A' . $cellrow + 7;
        $certified_correct6 = 'B' . $cellrow + 7;

        $noted_by = 'C' . $cellrow + 2;
        $noted_by2 = 'C' . $cellrow + 6;
        $noted_by3 = 'C' . $cellrow + 7;

        return [
            $certified_correct,
            $certified_correct2,
            $certified_correct3,
            $certified_correct4,
            $certified_correct5,
            $certified_correct6,
            $noted_by,
            $noted_by2,
            $noted_by3,

        ];
    }

    private function setFooter($cellrow, $activeWorksheet)
    {
        $signatories = $this->signatories();
        $chairman_name = $signatories['chairman_name'];
        $action_officer_name = $signatories['action_officer_name'];
        $action_officer_position = $signatories['action_officer_position'];
        [
            $certified_correct,
            $certified_correct2,
            $certified_correct3,
            $certified_correct4,
            $certified_correct5,
            $certified_correct6,
            $noted_by,
            $noted_by2,
            $noted_by3,
        ] = $this->certifiedAndNoted($cellrow);
        // $noted_by2 = 'B' . $cellrow + 2;

        //all merge
        $activeWorksheet->mergeCells("$certified_correct:$certified_correct2");
        $activeWorksheet->mergeCells("$certified_correct3:$certified_correct4");
        $activeWorksheet->mergeCells("$certified_correct5:$certified_correct6");

        //all set
        $activeWorksheet->setCellValue($certified_correct, 'Certified Correct:');
        $activeWorksheet->setCellValue($certified_correct3, $action_officer_name);
        $activeWorksheet->setCellValue($certified_correct5, $action_officer_position);

        $activeWorksheet->setCellValue($noted_by, 'Noted by:');
        $activeWorksheet->setCellValue($noted_by2, $chairman_name->name);
        $activeWorksheet->setCellValue($noted_by3, $chairman_name->description);
    }

    private function styleFooter($activeWorksheet, $cellrow)
    {
        [$certified_correct, $certified_correct3, $certified_correct5, $noted_by, $noted_by2, $noted_by3] = $this->certifiedAndNoted($cellrow);
        $activeWorksheet->getStyle($certified_correct)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $activeWorksheet->getStyle($certified_correct3)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $activeWorksheet->getStyle($certified_correct5)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        $activeWorksheet->getStyle($noted_by)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $activeWorksheet->getStyle($noted_by2)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);
        $activeWorksheet->getStyle($noted_by3)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_LEFT);

        $activeWorksheet->getStyle($noted_by2)->getFont()->setBold(true);
        $activeWorksheet->getStyle($certified_correct3)->getFont()->setBold(true);
        $activeWorksheet->getStyle('A1')->getFont()->setBold(true);
        $activeWorksheet->getStyle('A2')->getFont()->setBold(true);
        $activeWorksheet->getStyle('A3')->getFont()->setBold(true);
        $activeWorksheet->getStyle('B3')->getFont()->setBold(true);
        $activeWorksheet->getStyle('C3')->getFont()->setBold(true);
    }
}
