<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Address
 *
 * @property int $id
 * @property string $address 地址
 * @property float $amount 余额
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Address whereAddress($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Address whereAmount($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Address whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Address whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Address whereUpdatedAt($value)
 * @mixin \Eloquent
 */
class Address extends Model
{
    protected $table = "address";

    /**
     * 保存地址
     * @param $address
     * @return bool
     */
    public static function saveAddress($address)
    {
        if(!$address)
        {
            return true;
        }
        $is_exist = self::where('address',$address)->count();
        if(!$is_exist)
        {
            $addressModel = new Address();
            $addressModel->address = $address;
            $addressModel->amount = 0;
            return $addressModel->save();
        }

        return true;
    }
}
