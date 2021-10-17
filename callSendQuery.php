<?php

foreach ($argv as $arg) {
    $e=explode("=",$arg);
    if(count($e)==2)
        $_GET[$e[0]]=$e[1];
    else   
        $_GET[$e[0]]=0;
}

$command = $_GET['command'];

$params = "";
foreach ($_GET as $key => $value) {
  $params = $params . "$key=$value ";
}

$ret = exec("node /home/pireifej/pireifej/nodejs/sendQuery.js $params 2>&1", $out, $err);
$json = json_decode($out[0], true);

$arr['error'] = $err;
$arr['command'] = $command;
$arr['result'] = $json['result'];
$arr['query'] = $json['query'];

//echo "(".json_encode($arr) . ");";
echo $_GET['callback']."(".json_encode($arr).");";
?>