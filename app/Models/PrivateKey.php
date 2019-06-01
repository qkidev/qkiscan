<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\PrivateKey
 *
 * @property int $id
 * @property string $address 地址
 * @property string $private_key 私钥
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\PrivateKey whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\PrivateKey whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\PrivateKey whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\PrivateKey wherePrivateKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\PrivateKey whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class PrivateKey extends Model
{
    protected $table = 'private_key';
}
