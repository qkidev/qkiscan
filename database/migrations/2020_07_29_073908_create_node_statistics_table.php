<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNodeStatisticsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('node_statistics', function (Blueprint $table) {
            $table->increments('id');
            $table->string('node_id', 128)->unique()->comment('节点ID');
            $table->string('ip')->comment('IP地址');
            $table->integer('port')->comment('端口');
            $table->char('os', 32)->nullable()->comment('操作系统');
            $table->text('protocol')->comment('支持协议');
            $table->string('network_id')->comment('字符串类型');
            $table->string('currentBlock')->comment('当前同步的高度');
            $table->string('genesis_block_hash')->nullable()->comment('创世区块高度');
            $table->integer('protocol_version')->comment('协议版本');
//            $table->text('remark')->comment('备注');
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
        Schema::dropIfExists('node_statistics');
    }
}
