<?php

$pot = file_get_contents('WWW.pot');
$memo = substr($pot, 0, strpos($pot, 'msgid "', strpos($pot, 'msgid "')+1));
var_dump($memo); exit;
$data = substr($pot, strpos($pot, 'msgid "', 1));
$data = preg_replace('/"\n"/','',$data);
$pot = $memo.PHP_EOL.$data;
file_put_contents('WWW.pot', $pot) ;