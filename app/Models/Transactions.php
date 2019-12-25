<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Transactions
 *
 * @property int $id
 * @property string $from 转出地址
 * @property string $to 转入地址
 * @property string $hash 转账hash
 * @property string $block_hash 区块hash
 * @property int $block_number 区块高度
 * @property float $gas_price 手续费
 * @property float $amount 数量
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereBlockHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereBlockNumber($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereFrom($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereGasPrice($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereHash($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereTo($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereUpdatedAt($value)
 * @mixin \Eloquent
 * @property int $tx_status 交易状态，1成功，2失败
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Transactions whereTxStatus($value)
 */
class Transactions extends Model
{
    protected $table = "transactions";
    protected $fillable = [
        'from',
        'to',
        'hash',
        'block_hash',
        'block_number',
        'gas_price',
        'amount',
        'created_at',
        'updated_at',
        'tx_status',
        'payee',
    ];

    public function tokenTx(){
        return $this->hasOne(TokenTx::class, 'tx_id', 'id');
    }
}
