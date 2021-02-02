<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateBlocksTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('blocks', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedBigInteger('difficulty')->default(0)->comment('难度');
            $table->string('extra_data',1280)->nullable()->comment('额外数据');
            $table->unsignedBigInteger('gas_limit');
            $table->unsignedBigInteger('gas_used');
            $table->char('hash', 66)->unique();
            $table->text('logs_bloom')->nullable();
            $table->char('miner', 42)->comment('矿工');
            $table->char('mix_hash', 66);
            $table->unsignedBigInteger('nonce');
            $table->unsignedBigInteger('number')->unique()->comment('高度');
            $table->char('parent_hash', 66);
            $table->char('receipts_root', 66);
            $table->char('sha3_uncles', 66);
            $table->unsignedInteger('size')->default(0)->comment('大小，单位: Byte字节');
            $table->char('state_root', 66);
            $table->unsignedBigInteger('total_difficulty')->default(0);
            $table->unsignedInteger('transaction_count')->default(0)->comment('交易笔数');
            $table->timestamp('timestamp');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('blocks');
    }
}
