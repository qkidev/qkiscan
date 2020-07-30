<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 *
 * Class NodeStatistics
 * @package App\Models
 */
class NodeStatistics extends Model
{
    protected $table = "node_statistics";


    protected $casts = [
        'protocol' => 'array',
    ];
    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'node_id',
        'ip',
        'port',
        'os',
        'protocol',
        'network_id',
        'currentBlock',
        'genesis_block_hash',
        'protocol_version',
    ];
}
