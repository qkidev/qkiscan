<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/
//首页
Route::get('/', 'IndexController@index');
//openSearch xml输出
Route::get('/open-search-xml', 'IndexController@openSearchXml');
//搜索
Route::get('search', 'IndexController@search');
//区块列表
Route::get('/block', 'BlockController@index');
//区块详情
Route::get('/block/detail', 'BlockController@detail');
//地址详情
Route::get('/address/{address}', 'AddressController@index');
Route::get('/address/{address}/token', 'AddressController@token');
//交易列表
Route::get('/tx-list/{type}', 'TxController@list');
//交易详情
Route::get('/tx/{hash}', 'TxController@index');
//未打包交易列表
Route::get('/unpacked-tx-list', 'TxController@unpackedTxList');
//合约地址
Route::get('/token/{address}', 'TokenController@index');
//api页面
Route::get('/apis', 'IndexController@api');
//qki排行榜
Route::get('/qki-page', 'TxController@qkiPage');
//cct排行榜
Route::get('/cct-page', 'TxController@cctPage');
Route::get('/bp', 'IndexController@bp');

