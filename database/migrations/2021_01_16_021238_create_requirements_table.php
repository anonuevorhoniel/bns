<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRequirementsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('tbl_requirements', function (Blueprint $table) {
            $table->id();
            $table->bigInteger('quarter_id');
            $table->bigInteger('volunteer_id');
            $table->bigInteger('voters_id');
            $table->boolean('cedula');
            $table->boolean('signature_bvw');
            $table->boolean('signature_mr');
            $table->boolean('completed');
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
        Schema::dropIfExists('tbl_requirements');
    }
}
