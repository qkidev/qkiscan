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

Route::get('/', 'IndexController@index');
Route::get('search', 'IndexController@search');

Route::get('/block', 'BlockController@index');

Route::get('/address/{address}', 'AddressController@index');

Route::get('/block/detail', 'BlockController@detail');

Route::get('/tx/{hash}', 'TxController@index');

//合约地址
Route::get('/token/{address}', 'TokenController@index');
