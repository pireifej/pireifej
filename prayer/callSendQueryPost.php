<?php
$command = $_POST['command'];

$params = "";
foreach ($_POST as $key => $value) {
  $params = $params . "$key=$value ";
}

//$ret = exec("sudo node /var/www/html/prayer/nodejs/sendQuery.js $params 2>&1", $out, $err);
$ret = exec("node /home/pireifej/pireifej/prayer/nodejs/sendQuery.js $params 2>&1", $out, $err);
$json = json_decode($out[0], true);

$arr['error'] = $err;
$arr['command'] = $command;
$arr['result'] = $json['result'];
$arr['query'] = $json['query'];

//echo "(".json_encode($arr) . ");";
echo $_POST['callback']."(".json_encode($arr).");";
?>