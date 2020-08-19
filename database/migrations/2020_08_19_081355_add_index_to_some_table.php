<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddIndexToSomeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('token_tx', function (Blueprint $table) {
            //添加联合索引
            $table->index(['token_id', 'tx_status']);
        });
        Schema::table('transactions', function (Blueprint $table) {
            //添加索引
            $table->index('updated_at');
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
            //
            $table->dropIndex(['token_id', 'tx_status']);
        });
        Schema::table('transactions', function (Blueprint $table) {
            //
            $table->dropIndex('updated_at');
        });
    }
}
