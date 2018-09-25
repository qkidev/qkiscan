<?php

namespace App\Http\Controllers;

use App\Model\Account;
use App\Model\Transaction;
use App\Model\Block;
use App\Model\TxOut;
use App\Service\txService;
use BitcoinPHP\BitcoinECDSA\BitcoinECDSA;
use GuzzleHttp\Client;
use Illuminate\Http\Request;
use App\Service\TransactionService;
use App\Service\BlockService;
use App\Model\TxIn;
class TxController extends Controller
{
    public function index()
    {


        return view("tx.index");
    }


}
