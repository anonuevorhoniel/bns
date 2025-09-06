<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_scholars', function (Blueprint $table) {
            $table->id();
            $table->string('first_name');
            $table->string('middle_name')->nullable();
            $table->string('last_name');
            $table->string('name_extension')->nullable();
            $table->string('name_on_id')->nullable();       
            $table->string('id_no')->nullable();
            $table->string('citymuni_id');
            $table->string('barangay_id')->nullable();
            $table->longText('complete_address')->nullable();
            $table->string('sex')->nullable();
            $table->date('birth_date')->nullable();
            $table->string('civil_status')->nullable();
            $table->string('educational_attainment')->nullable();
            $table->string('benificiary_name')->nullable();
            $table->string('relationship')->nullable();
            $table->string('district_id')->nullable();
            $table->string('classification')->nullable();
            $table->string('philhealth_no')->nullable();
            $table->date('first_employment_date')->nullable();
            $table->date('end_employment_date')->nullable();
            $table->string('contact_number')->nullable();
            $table->string('status')->nullable();
            $table->string('place_of_assignment')->nullable();
            $table->string('fund')->nullable();
            $table->string('bns_type')->nullable();
            $table->integer('incentive_prov')->nullable();
            $table->integer('incentive_mun')->nullable();
            $table->integer('incentive_brgy')->nullable();
            $table->date('replacement_date')->nullable();
            $table->integer('replaced');
            $table->unsignedBigInteger('replaced_scholar_id')->nullable();

            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_scholars');
    }
};
