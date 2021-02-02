<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTransactionsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->increments('id');
            $table->string('from',42)->comment('转出地址');
            $table->string('to',42)->comment('转入地址');
            $table->string('hash',66)->unique()->comment('转账hash');
            $table->string('block_hash',66)->comment('区块hash');
            $table->unsignedInteger('block_number')->comment('区块高度');
            $table->unsignedDecimal('gas_price',18,8)->comment('手续费');
            $table->unsignedDecimal('amount',18,8)->default(0.00000000)->comment('数量');
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
        Schema::dropIfExists('transactions');
    }
}
