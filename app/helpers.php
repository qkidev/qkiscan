<?php
/**
 * Created by PhpStorm.
 * User: woshi
 * Date: 2018/7/6
 * Time: 17:44
 */
function format_qki($amount,$unit='cqki')
{
    if($unit == 'cQKI' || $unit == 'cqki')
    {
        $amount = bcmul($amount , 100,6);
        $unit = 'cQKI';
    }elseif($unit == 'mQKI' || $unit == 'mqki')
    {
        $amount = bcmul($amount , 10000,4);
        $unit = 'mQKI';
    }else{
        $unit = 'QKI';
    }

    if($amount != 0)
    {
        $amount = float_format($amount);
    }

    return $amount.' '.$unit;
}

function getMultiple($unit)
{
    $multiple = '';
    if($unit == 'qki')
    {
        $multiple = 1;
    }elseif($unit == 'cqki')
    {
        $multiple = 100;
    }elseif($unit == 'mqki')
    {
        $multiple = 10000;
    }

    return $multiple;
}

/**小数小于0.0001并去掉多余0问题
 * @param $num
 * @return mixed
 */
function float_format($num){

    $temp = explode ( '.', $num );

    if (sizeof ( $temp ) > 1) {
        $num = rtrim($num,'0');
    }
    $temp1 = explode ( '.', $num );

    if(isset($temp1[1]) && $temp1[1]==null){
        $num = rtrim($num,'.');
    }

    return $num;
}