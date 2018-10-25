<?php

namespace App\Models;

use EthereumRPC\EthereumRPC;
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
 * @property int $type 地址类型，1普通地址，2合约地址
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Address whereType($value)
 */
class Address extends Model
{
    protected $table = "address";

    const TYPE_NORMAL_ADDRESS = 1;
    const TYPE_CONTRACT_ADDRESS = 2;

    /**
     * 保存地址
     * @param $address
     * @return bool
     * @throws \EthereumRPC\Exception\ConnectionException
     * @throws \EthereumRPC\Exception\GethException
     * @throws \HttpClient\Exception\HttpClientException
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
            //判断是否为合约地址
            $geth = new EthereumRPC(env('ETH_RPC_HOST'), env('ETH_RPC_PORT'));
            $request = $geth->jsonRPC("eth_getCode",null,[$address,"latest"]);
            $res = $request->get("result");
            if($res == "0x")
            {
                $addressModel->type = self::TYPE_NORMAL_ADDRESS;
            }else{
                $addressModel->type = self::TYPE_CONTRACT_ADDRESS;
            }
            $addressModel->address = $address;
            $addressModel->amount = 0;
            return $addressModel->save();
        }

        return true;
    }
}
