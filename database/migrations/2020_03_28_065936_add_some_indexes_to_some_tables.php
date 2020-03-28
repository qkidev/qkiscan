<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class AddSomeIndexesToSomeTables extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->index(['tx_status', 'updated_at']);
            $table->index('amount');
            $table->index('from');
            $table->index('to');
            $table->index('payee');
        });

        Schema::table('balances', function (Blueprint $table) {
            $table->index(['name', 'amount']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropIndex(['tx_status', 'updated_at']);
            $table->dropIndex(['amount']);
            $table->dropIndex(['from']);
            $table->dropIndex(['to']);
            $table->dropIndex(['payee']);
        });

        Schema::table('balances', function (Blueprint $table) {
            $table->dropIndex(['name', 'amount']);
        });

    }
}
