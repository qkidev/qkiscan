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

    if($num<0.0001 && $num>0){

        $num = number_format($num,8);

        $num = rtrim($num,'0');

    }else{


        $num = floatval($num);

    }

    return $num;
}