<?php

namespace App\Services\Payrolls;

use DateTime;
use App\Models\Rate;
use App\Models\Signatory;
use App\Models\Municipality;

use Illuminate\Support\Facades\DB;

use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;

class PayrollDownloadService
{
    public function main($payroll, $filePath)
    {
        $scholars = $this->getScholars($payroll);
        $rate = Rate::find($payroll->rate_id);
        $municipality = Municipality::where('code', $payroll->municipality_code)->get();

        $payroll_period = $this->payrollPeriod($payroll);
        $signatories = $this->signatories();
        $head = $signatories['head'];
        $governor = $signatories['governor'];

        $reader = new Xlsx();
        $spreadsheet = $reader->load(public_path('/templates/BVW_Payroll_Template.xlsx'));
        $sheet = $spreadsheet->getActiveSheet();
        $this->setDrawing($spreadsheet);

        #Append Values to Sheets
        $sheet->setCellValue('G5', $payroll_period);
        $sheet->setCellValue('A8', strtoupper($municipality[0]->name) . ", LAGUNA");
        $this->scholarMap($spreadsheet, $rate, $payroll, $head, $governor, $scholars);

        $spreadsheet->removeSheetByIndex(0); //template
        $spreadsheet->setActiveSheetIndex(0);

        $this->sheetSetProps($spreadsheet);
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save($filePath);
    }

    private function getScholars($payroll)
    {
        $data = DB::table('tbl_payroll_details as pd')
            ->leftJoin('tbl_scholars as s', 'pd.scholar_id', 's.id')
            ->leftjoin('tbl_payrolls as py', 'pd.payroll_id', 'py.id')
            ->where('pd.payroll_id', $payroll->id)
            ->select('pd.*', 's.*', 'py.month_from as payroll_month_from', 'py.month_to as payroll_month_to', 'py.year_from', 'py.year_to')
            ->orderBy('s.last_name', 'asc')
            ->get();

        return $data;
    }

    private function payrollPeriod($payroll)
    {
        if ($payroll->month_from == $payroll->month_to) {
            $payroll_period = DateTime::createFromFormat('!m', $payroll->month_from)->format('F') . ' 2025';
        } else {
            $payroll_period = DateTime::createFromFormat('!m', $payroll->month_from)->format('F')
                . ' - ' . DateTime::createFromFormat('!m', $payroll->month_to)->format('F') . ' '
                . $payroll->year_from;
        }

        return $payroll_period;
    }

    private function signatories()
    {
        $head = Signatory::where('status', 1)
            ->where('designation_id', Signatory::HEAD)
            ->get();

        $governor = Signatory::where('status', 1)
            ->where('designation_id', Signatory::GOVERNOR)
            ->get();

        return compact('head', 'governor');
    }

    private function setDrawing($spreadsheet)
    {
        $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
        $drawing->setName('Paid');
        $drawing->setDescription('Paid');
        $drawing->setPath(public_path('/templates/audit_sticker.png')); // put your path and image here
        $drawing->setCoordinates('F42');
        $drawing->setOffsetX(200);
        $drawing->setWidth(345);
        $drawing->getShadow()->setVisible(true);
        $drawing->getShadow()->setDirection(45);
        $drawing->setWorksheet($spreadsheet->getActiveSheet());
    }

    private function scholarMap($spreadsheet,  $rate,  $payroll, $head, $governor, $scholars)
    {
        $last_page = ceil($scholars->count() / 25);
        $scholars = $scholars->toArray();
        $chunks = array_chunk($scholars, 25, true);
        $count = 0;
        $sub_total_array = [];

        foreach ($chunks as  $key => $chunk) {
            $rate_final = number_format($rate->rate, 2);
            $styleArray = styleArray();

            $page_number = $key + 1;
            $title = "Page $page_number of $last_page";
            $sheet = clone $spreadsheet->getSheet(0);
            $row_start = '8';
            $subtotal = 0;

            $sheet->setTitle($title);
            $spreadsheet->addsheet($sheet);


            foreach ($chunk as $key => $scholar) {
                $subtotal += $scholar->total;
                $row_start++;
                $count++;

                $service_period = $this->formatServicePeriod($scholar);

                $this->setPayrollHead($sheet,  $title, $count, $row_start, $service_period, $rate_final, $scholar);
                $this->setPayrollBody($sheet, $subtotal, $page_number, $last_page, $payroll, $head, $governor);
                $sheet->getStyle('A' . $row_start)->applyFromArray($styleArray);
                // $sub_total_array[$key] = $subtotal;
            }

            unset($sheet);
        }
    }

    private function formatServicePeriod($scholar)
    {
        if ($scholar->payroll_month_from == $scholar->payroll_month_to) {
            $service_period = DateTime::createFromFormat('!m', $scholar->payroll_month_from)->format('F') . ' ' . $scholar->year_from;
        } else {
            $service_period = DateTime::createFromFormat('!m', $scholar->payroll_month_from)->format('F') . ' - ' . DateTime::createFromFormat('!m', $scholar->payroll_month_to)->format('F') . ", " . $scholar->year_from;
        }

        return $service_period;
    }

    private function setPayrollHead($sheet, $title, $count, $row_start, $service_period, $rate_final, $scholar)
    {
        $full_name = $scholar->last_name . ', ' . $scholar->first_name . ' ' . $scholar->middle_name . ' ' . $scholar->name_extension;
        $sheet->setCellValue('J1', $title);
        $sheet->setCellValue('A' . $row_start, $count);
        $sheet->setCellValue('B' . $row_start, strtoupper($full_name));
        $sheet->setCellValue('C' . $row_start, $service_period);
        $sheet->setCellValue('D' . $row_start, $rate_final);
        $sheet->setCellValue('E' . $row_start, $scholar->total);
    }

    private function setPayrollBody($sheet, $subtotal, $page_number, $last_page, $payroll, $head, $governor)
    {
        $sheet->setCellValue('E36', $subtotal);

        if ($page_number == $last_page) {
            $sheet->setCellValue('E37', $payroll->grand_total);
            $sheet->setCellValue('B37', "TOTAL");
        }

        $sheet->setCellValue('B36', "SUB-TOTAL $page_number");
        $sheet->setCellValue('A43', $head[0]->name);
        $sheet->setCellValue('A44', $head[0]->description);
        $sheet->setCellValue('D43', $governor[0]->name);
        $sheet->setCellValue('D44', $governor[0]->description);
    }

    private function sheetSetProps($spreadsheet)
    {
        $spreadsheet->getProperties()
            ->setTitle('BNS: SYSTEM GENERATED REPORT')
            ->setSubject('BNS: SYSTEM GENERATED REPORT')
            ->setKeywords('PAYROLL') //Tags
            ->setCategory('BNS Report')
            ->setDescription('This is a system generated report.') //Comment
            ->setCreator('Barangay Nutritional Scholar System') //Author
            ->setLastModifiedBy('Developer - Rhoniel L. Añonuevo');
    }
}
