<?php

namespace App\Http\Controllers;


class BlockController extends Controller
{
    public function index()
    {

        return view("block.index");
    }

    /**
     * 区块详细页
     */
    public function detail()
    {

        return view("block.detail");
    }




}
