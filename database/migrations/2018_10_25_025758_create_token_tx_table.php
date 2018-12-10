<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTokenTxTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('token_tx', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('token_id')->comment('索引表id');
            $table->unsignedInteger('form_address_id')->comment('转入地址id');
            $table->unsignedInteger('to_address_id')->comment('转出地址id');
            $table->unsignedDecimal('amount',28,8)->comment('数量');
            $table->unsignedInteger('tx_id')->comment('交易ID');
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
        Schema::dropIfExists('rpc_transactions');
    }
}
