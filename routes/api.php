<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['namespace' => 'Api'], function () {
    Route::get('get-token-balance', 'BalanceController@getTokenBalance');//获取通证余额
    Route::get('get-qki-balance', 'BalanceController@getQkiBalance');//获取QKI余额
    Route::get('get-token-tx', 'TransactionsController@getTokenTx');//获取通证交易记录
    Route::get('get-qki-tx', 'TransactionsController@getTransactions');//获取QKI交易记录
    Route::get('get-tx', 'TransactionsController@getTx');//获取交易详情
    Route::get('get-block', 'BlockController@getBlock');//获取区块列表
    Route::get('block', 'BlockController@blockDetail');//获取区块详情
    Route::get('token-tx-info', 'TransactionsController@getTokenTxInfo');//获取通证交易详情
    Route::get('get-balance', 'BalanceController@getBalance');//获取余额列表
    Route::get('get-address-info', 'AddressController@getAddressInfo');//获取地址详情
    Route::get('get-contract-address-info', 'AddressController@getTokenAddressInfo');//获取合约地址详情
    Route::get('get-contract-address-top', 'AddressController@getTokenTop');//获取合约资产Top100
    Route::get('search', 'IndexController@search');//搜索接口
    Route::get('abi', 'IndexController@abi');//abi
});
