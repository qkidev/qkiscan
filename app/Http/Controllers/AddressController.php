<?php

namespace App\Http\Controllers;

use App\Model\TxOut;
use Illuminate\Http\Request;
use App\Service\AccountService;
use App\Service\TransactionService;

class AddressController extends Controller
{
    /**
     * 地址详情
     */
    public function index()
    {
        return view("address.index");
    }
}
