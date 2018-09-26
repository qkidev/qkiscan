<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * App\Models\Settings
 *
 * @property int $id
 * @property string $key 名称
 * @property string $value 值
 * @property \Illuminate\Support\Carbon|null $created_at
 * @property \Illuminate\Support\Carbon|null $updated_at
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Settings whereCreatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Settings whereId($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Settings whereKey($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Settings whereUpdatedAt($value)
 * @method static \Illuminate\Database\Eloquent\Builder|\App\Models\Settings whereValue($value)
 * @mixin \Eloquent
 */
class Settings extends Model
{
    public $table = 'settings';

    /**
     * 根据名称获取值
     * @param $key
     * @return null
     */
    public static function getValueByKey($key)
    {
        $data = self::where('key',$key)->first();
        return $data->value ?? null;
    }
}
