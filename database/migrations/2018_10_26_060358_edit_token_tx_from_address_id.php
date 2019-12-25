<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class EditTokenTxFromAddressId extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('token_tx', function (Blueprint $table) {
            $table->unsignedInteger('from_address_id')->comment('转入地址id');
            $table->dropColumn('form_address_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('token_tx', function (Blueprint $table) {
            $table->dropColumn('from_address_id');
            $table->unsignedInteger('form_address_id')->comment('转入地址id');
        });
    }
}
