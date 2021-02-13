<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateRpcNodeTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('rpc_node', function (Blueprint $table) {
            $table->id();
            $table->string("name",32)->unique();
            $table->string("url",128)->unique();
            $table->bigInteger("success")->default(0);
            $table->bigInteger("failure")->default(0);
            $table->integer("last_success_time")->default(0)->comment("上次成功时间");
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
        Schema::dropIfExists('rpc_node');
    }
}
