<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateTableBalances extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('balances', function (Blueprint $table) {
            $table->increments('id');
            $table->integer('address_id')->comment('地址id');
            $table->char('name')->comment('资源名称');
//            $table->integer('token_id')->comment('通证id');
            $table->decimal('amount', 26, 18)
                ->default(0)
                ->comment('余额');
            $table->unique(['address_id', 'name']);
//            $table->unique(['uid', 'token_id']);
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
        Schema::dropIfExists('balances');
    }
}
