<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePayrollsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_payrolls', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('rate_id');
            $table->bigInteger('municipality_code');
            $table->string('year_from');
            $table->string('year_to');
            // $table->bigInteger('quarter_id');
            $table->integer('status')->default(0);
            $table->string('month_from');
            $table->string('month_to');
            $table->string('grand_total')->nullable();
            $table->string('signatories');
            $table->string('fund')->nullable();
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
        Schema::dropIfExists('tbl_payrolls');
    }
}
