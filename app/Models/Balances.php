<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Balances extends Model
{
    protected $table = 'balances';

    protected $fillable = [
        'address_id',
        'name',
        'amount',
    ];

    public function address(){
        return $this->belongsTo(Address::class, 'address_id');
    }
}
