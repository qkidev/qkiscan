<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\AddressNotes
 *
 * @property int $id
 * @property string $address 地址
 * @property string $name 地址名
 * @property string $notes 备注
 */
class AddressNotes extends Model
{
    protected $table = "address_notes";
}
