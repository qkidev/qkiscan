<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddIndexTokentx extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('token_tx', function (Blueprint $table) {
            $table->index(['id', 'to_address_id','from_address_id']);
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
            $table->dropIndex(['id', 'to_address_id','from_address_id']);
        });
    }
}
