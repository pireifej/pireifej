<?php
$command = $_GET['command'];

$params = "";
foreach ($_GET as $key => $value) {
  $params = $params . "$key=$value ";
}

$ret = exec("node /home/pireifej/pireifej/prayer/nodejs/sendQuery.js $params 2>&1", $out, $err);
$json = json_decode($out[0], true);

$arr['error'] = $err;
$arr['command'] = $command;
$arr['result'] = $json['result'];
$arr['query'] = $json['query'];

//echo "(".json_encode($arr) . ");";
echo $_GET['callback']."(".json_encode($arr).");";
?>