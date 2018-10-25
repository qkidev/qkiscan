<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\TokenTx
 *
 * @property int $id
 * @property int $token_id 索引表id
 * @property int $form_address_id 转入地址id
 * @property int $to_address_id 转出地址id
 * @property float $amount 数量
 * @property int $tx_id 交易ID
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereFormAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereToAddressId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereTokenId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereTxId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\TokenTx whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class TokenTx extends Model
{
    protected $table = "token_tx";
}
