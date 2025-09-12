<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\IOFactory;
use PhpOffice\PhpSpreadsheet\Reader\Xlsx;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

use App\Models\Volunteer;
use App\Models\Quarter;
use App\Models\Municipality;
use App\Models\District;
use App\Models\Signatory;
use App\Models\ServicePeriod;
use Carbon\Carbon;
use DateTime;

class ReportController extends Controller
{   


    public function getMunicipalityVolunteers(Request $request, $code)
    {	
        $page = [
            'name'      =>  'Dashboard',
            'title'     =>  'List of Active Volunteers',
            'crumb'     =>  array('Dashboard' => '/')
        ];

 
        $municipality = Municipality::where('code', $code)->get();
        $district = District::find($municipality[0]->district_no);

        $volunteers = DB::table('tbl_volunteers as v')
        ->select('v.id as id', 'v.*', 'b.name')
        ->leftJoin('tbl_barangays as b', 'v.barangay_code', 'b.code')
        ->where('v.municipality_code', $code)
        ->where('v.deleted_at', null)
        ->orderBy('v.last_name')
        ->get();

        $now = Carbon::now();
        $from = ($request->filled('from')) ? $request->from : $now->year.'-'.$now->month;
        $to = ($request->filled('to')) ? $request->to : $now->year.'-'.$now->month;
        $results = array();
        foreach($volunteers as $volunteer){
            $parameters = array(
                "scholar_id" => $volunteer->id, 
                "from" => $from, 
                "to" => $to
            );
            $service_period = Volunteer::getServicePeriodPerRange($parameters);
            if(sizeOf($service_period) > 0){
                $results[] = array(
                    "scholar_id" => $volunteer->id,
                    "barangay" => $volunteer->name,
                    "mobile" => $volunteer->mobile,
                    "name" => $volunteer->last_name.', '.$volunteer->first_name.' '.$volunteer->middle_name,
                    "service_period" => $service_period
                );
            }
        }
        $months = Quarter::months();
        return view('reports.municipality_volunteers', compact(
            'page', 'code', 'volunteers', 'municipality', 
            'district', 'months', 'from', 'to', 'results'
        ));
    }

    public function downloadMunicipalityVolunteers(Request $request, $code)
    {
        $volunteers = DB::table('tbl_volunteers as v')
        ->select('v.id as id', 'v.*', 'b.name')
        ->leftJoin('tbl_barangays as b', 'v.barangay_code', 'b.code')
        ->where('v.municipality_code', $code)
        ->where('v.deleted_at', null)
        ->orderBy('v.last_name')
        ->get();

        if($volunteers->count() > 0){

            $municipality = Municipality::where('code', $code)->get();
            $district = District::find($municipality[0]->district_no);
            $now = Carbon::now();
            $from = ($request->filled('from')) ? $request->from : $now->year.'-'.$now->month;
            $to = ($request->filled('to')) ? $request->to : $now->year.'-'.$now->month;
            $results = array();
            $months = Quarter::months();
            $period = $months[(int) explode('-', $from)[1]].' - '. $months[(int) explode('-', $to)[1]] .' '.explode('-', $to)[0];
            
            // Checking of Volunteer's Service Period
            foreach($volunteers as $volunteer){
                $parameters = array(
                    "scholar_id" => $volunteer->id, 
                    "from" => $from, 
                    "to" => $to
                );
                $service_period = Volunteer::getServicePeriodPerRange($parameters);
                if(sizeOf($service_period) > 0){
                    $results[] = array(
                        "scholar_id" => $volunteer->id,
                        "barangay" => $volunteer->name,
                        "mobile" => $volunteer->mobile,
                        "name" => $volunteer->last_name.', '.$volunteer->first_name.' '.$volunteer->middle_name,
                        "service_period" => $service_period
                    );
                }
            }

            #Payroll Details -> signatories
            $head = Signatory::where('status', 1)
                ->where('designation_id', Signatory::HEAD)
                ->get();

            $admin = Signatory::where('status', 1)
                ->where('designation_id', Signatory::ADMINISTRATOR)
                ->get();

            $governor = Signatory::where('status', 1)
                ->where('designation_id', Signatory::GOVERNOR)
                ->get();

            $rep = Volunteer::where('municipality_code', $code)
                ->where('position_id', 2)
                ->get();
            $representative = 'Representative: ';

            if($rep->count() == 0){
                $representative = $representative.'No representative.';
            }else{
                foreach ($rep as $key => $value) {
                    $name = $value->first_name.' '.$value->middle_name.' '.$value->last_name.' '.$value->suffix.',';
                    $representative = $representative.' '.$name;
                }
            }
                
            
            $reader = new Xlsx();
            $spreadsheet = $reader->load( public_path('/templates/BVW_Masterlist_Template.xlsx') );
            $sheet = $spreadsheet->getActiveSheet();
            
            $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
            $drawing->setName('Paid');
            $drawing->setDescription('Paid');
            $drawing->setPath(public_path('/images/masterlist_header.png')); // put your path and image here
            $drawing->setCoordinates('A2');
            $drawing->setWidth(345);
         
            $drawing->setWorksheet($spreadsheet->getActiveSheet());

            $total_volunteers = sizeOf($results);
            $chunks = array_chunk($results, 30, true);
            $count = 1;

            foreach ($chunks as $key => $chunk) {
                $row_start = '9';

                // setting Sheet - 30 entry per page
                $page_number = $key+1;
                $title = "Page-".$page_number;
                $sheet = clone $spreadsheet->getSheet(0);
                $sheet->setTitle($title);
                $spreadsheet->addsheet($sheet);
          
                foreach ($chunk as $volunteer) {

                  

                    $sheet->setCellValue('A'.$row_start, $volunteer['barangay']);
                    $sheet->setCellValue('E'.$row_start, $volunteer['name']);
                    $sheet->setCellValue('I'.$row_start, '0'.$volunteer['mobile']);
                    $row_start++;
                    
                    $sheet->setCellValue('J4',  $period);   
                    $sheet->setCellValue('A7', 'DISTRICT : '.$district->description);
                    $sheet->setCellValue('E7',  $municipality[0]->name);  
                    $sheet->setCellValue('I7',  $representative);   

                    $sheet->setCellValue('A43', "MS. ANASTACIA H. ADRIANO");
                    $sheet->setCellValue('A44', "OIC Field Operations Unit");
                    $sheet->setCellValue('D43', $head[0]->name);
                    $sheet->setCellValue('D44', $head[0]->description);
                    $sheet->setCellValue('G43', $admin[0]->name);
                    $sheet->setCellValue('G44', $admin[0]->description);
                    $sheet->setCellValue('J43', $governor[0]->name);
                    $sheet->setCellValue('J44', $governor[0]->description);
                    $sheet->setCellValue('J5', "Total of ".$total_volunteers." Volunteers");
                }

                unset($sheet);
            }
            #Tentative Variable
           
            $spreadsheet->removeSheetByIndex(0); //template
            $spreadsheet->setActiveSheetIndex(0);

            // $sheet->setCellValue('E'.$row_start, '***Nothing Follows***');

            /* Setting of workbook properties */
            $spreadsheet->getProperties()
                    ->setTitle('BVWIS: SYSTEM GENERATED REPORT')
                    ->setSubject('BVWIS: SYSTEM GENERATED REPORT')
                    ->setKeywords('PAYROLL') //Tags
                    ->setCategory('BVWIS Report')
                    ->setDescription('This is a system generated report.') //Comment
                    ->setCreator('Barangay Volunteer Worker Information System') //Author
                    ->setLastModifiedBy('Developer - Glenn Nerrie A. Afurong');

            $filename = $municipality[0]->name.' - Masterlist';

            /* Remove the template sheet and 
             * set first sheet as active sheet
             */
            // $spreadsheet->removeSheetByIndex(0); //template
            // $spreadsheet->setActiveSheetIndex(0);
             
            /* Redirect output to a client's web browser (Xlsx) 
             */
            header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
            header('Content-Disposition: attachment;filename="' . $filename . '.xlsx"');
            header('Cache-Control: max-age=0');

            /* NOTE: If you're serving to IE 9, then the 
             * following may be needed 
             */
            header('Cache-Control: max-age=1');
             
            /* NOTE: If you're serving to IE over SSL, then the 
             * following may be needed 
             */
            header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
            header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // Date modified
            header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
            header('Pragma: public');  // HTTP/1.0
             
            /* Download/Export as xlsx */
            $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
            $writer->save('php://output');
        }else{
            return back()->withErrors("No data found!");
        }
        

    }



    public function downloadCountVolunteers()
    {
        $breakdowns = Municipality::countVolunteers();
        $period = Quarter::currentMonth().'-'.Quarter::currentYear();

        #Payroll Details -> signatories
            $head = Signatory::where('status', 1)
                ->where('designation_id', Signatory::HEAD)
                ->get();

            $admin = Signatory::where('status', 1)
                ->where('designation_id', Signatory::ADMINISTRATOR)
                ->get();

            $governor = Signatory::where('status', 1)
                ->where('designation_id', Signatory::GOVERNOR)
                ->get();

            
        
        $reader = new Xlsx();
        $spreadsheet = $reader->load( public_path('/templates/BVW_Count_Template.xlsx') );
        $sheet = $spreadsheet->getActiveSheet();
        
        $drawing = new \PhpOffice\PhpSpreadsheet\Worksheet\Drawing();
        $drawing->setName('Paid');
        $drawing->setDescription('Paid');
        $drawing->setPath(public_path('/images/masterlist_header.png')); // put your path and image here
        $drawing->setCoordinates('A2');
        $drawing->setWidth(345);
     
        $drawing->setWorksheet($spreadsheet->getActiveSheet());
        
        #Tentative Variable
        $row_start = '8';
        
        foreach ($breakdowns as $row) {

            $sheet->setCellValue('A'.$row_start, $row['municipality']);
            $sheet->setCellValue('G'.$row_start, $row['count']);
            $row_start++;
        }

        
        $sheet->setCellValue('J4',  $period);   

        $sheet->setCellValue('A42', Auth::user()->name);
        $sheet->setCellValue('A43', "BVW / Field Operation Unit.");
        $sheet->setCellValue('D42', $head[0]->name);
        $sheet->setCellValue('D43', $head[0]->description);
        $sheet->setCellValue('G42', $admin[0]->name);
        $sheet->setCellValue('G43', $admin[0]->description);
        $sheet->setCellValue('J42', $governor[0]->name);
        $sheet->setCellValue('J43', $governor[0]->description);

        /* Setting of workbook properties */
        $spreadsheet->getProperties()
                ->setTitle('BVWIS: SYSTEM GENERATED REPORT')
                ->setSubject('BVWIS: SYSTEM GENERATED REPORT')
                ->setKeywords('PAYROLL') //Tags
                ->setCategory('BVWIS Report')
                ->setDescription('This is a system generated report.') //Comment
                ->setCreator('Barangay Volunteer Worker Information System') //Author
                ->setLastModifiedBy('Developer - Glenn Nerrie A. Afurong');

        $filename = $period.' - Total Volunteers Per Municipality';

        /* Remove the template sheet and 
         * set first sheet as active sheet
         */
        // $spreadsheet->removeSheetByIndex(0); //template
        // $spreadsheet->setActiveSheetIndex(0);
         
        /* Redirect output to a client's web browser (Xlsx) 
         */
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="' . $filename . '.xlsx"');
        header('Cache-Control: max-age=0');

        /* NOTE: If you're serving to IE 9, then the 
         * following may be needed 
         */
        header('Cache-Control: max-age=1');
         
        /* NOTE: If you're serving to IE over SSL, then the 
         * following may be needed 
         */
        header('Expires: Mon, 26 Jul 1997 05:00:00 GMT'); // Date in the past
        header('Last-Modified: ' . gmdate('D, d M Y H:i:s') . ' GMT'); // Date modified
        header('Cache-Control: cache, must-revalidate'); // HTTP/1.1
        header('Pragma: public');  // HTTP/1.0
         
        /* Download/Export as xlsx */
        $writer = IOFactory::createWriter($spreadsheet, 'Xlsx');
        $writer->save('php://output');

    }
  
}
