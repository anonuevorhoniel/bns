<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAccomplishmentsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_accomplishments', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('volunteer_id');
            $table->bigInteger('quarter_id');
            $table->string('month');
            $table->string('year');
            $table->integer('status');
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
        Schema::dropIfExists('tbl_accomplishments');
    }
}
