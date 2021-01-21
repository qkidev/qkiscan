<?php
/**
 * Created by PhpStorm.
 * User: woshi
 * Date: 2018/7/6
 * Time: 17:44
 */
function format_qki($amount, $unit = 'cqki')
{
    if ($unit == 'cQKI' || $unit == 'cqki') {
        $amount = bcmul($amount, 100, 6);
        $unit = 'cQKI';
    } elseif ($unit == 'mQKI' || $unit == 'mqki') {
        $amount = bcmul($amount, 10000, 4);
        $unit = 'mQKI';
    } else {
        $unit = 'QKI';
    }

    if ($amount != 0) {
        $amount = float_format($amount);
    }

    return $amount . ' ' . $unit;
}

function getMultiple($unit)
{
    $multiple = '';
    if ($unit == 'qki') {
        $multiple = 1;
    } elseif ($unit == 'cqki') {
        $multiple = 100;
    } elseif ($unit == 'mqki') {
        $multiple = 10000;
    }

    return $multiple;
}

/**小数小于0.0001并去掉多余0问题
 * @param $num
 * @return mixed
 */
function float_format($num)
{

    $temp = explode('.', $num);

    if (sizeof($temp) > 1) {
        $num = rtrim($num, '0');
    }
    $temp1 = explode('.', $num);

    if (isset($temp1[1]) && $temp1[1] == null) {
        $num = rtrim($num, '.');
    }

    return $num;
}

/**
 * 16进制转10进制
 * @param string $hex
 * @return int|string
 */
function HexDec2(string $hex)
{
    $dec = 0;
    $hex = str_replace('0x','',$hex);
    $len = strlen($hex);
    for ($i = 1; $i <= $len; $i++) {
        $dec = bcadd($dec, bcmul(strval(hexdec($hex[$i - 1])), bcpow('16', strval($len - $i))));
    }
    return $dec;
}

/**
 *  转化为东八区时间
 * @param string $time
 * @param int $type 1 16进制，2 格式化时间
 * @return false|string
 */
function formatTime(string $time, $type = 1)
{
    $t = "";
    if ($type == 1) {
        $t = date("Y-m-d H:i:s", base_convert($time, 16, 10) + 28800);
    } else if ($type == 2) {
        $t = date("Y-m-d H:i:s", strtotime($time) + 28800);
    }
    return $t;
}

/**
 * 协议字符替换
 *
 * @param string $str
 * @return mixed|string
 */
function replaceStr(string $str)
{
    if (strpos($str, "eth") !== false) {
        return str_replace("eth", "全", $str);
    } elseif (strpos($str, "les") !== false) {
        return str_replace("les", "轻", $str);
    } else {
        return $str;
    }
}


