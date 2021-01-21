<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Block extends Model
{
    protected $table = 'blocks';

    public $timestamps = false;
    protected $fillable = [
        'difficulty',
        'extra_data',
        'gas_limit',
        'gas_used',
        'hash',
        'logs_bloom',
        'miner',
        'mix_hash',
        'nonce',
        'number',
        'parent_hash',
        'receipts_root',
        'sha3_uncles',
        'size',
        'state_root',
        'total_difficulty',
        'transaction_count',
        'timestamp',
    ];
}
