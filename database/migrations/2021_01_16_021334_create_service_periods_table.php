<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateServicePeriodsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_service_periods', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('volunteer_id');
            $table->string('month_from');
            $table->string('month_to');
            $table->string('year_from');
            $table->string('year_to');
            $table->string('status');
            $table->timestamps();
            $table->softDeletes();
            
            
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('tbl_service_periods');
    }
}
