<?php
include 'library.php';

$dirs = scandir(__DIR__);
foreach($dirs as $dir) {
    $lang = $dir;
    if($lang && strlen($lang)==2 && is_dir($lang) && $lang!='..') {
        $i18n = new i18n($lang); // 자동으로 캐시파일 생성합니다.
        echo "{$lang} ".$i18n->__('번역자료 생성완료').PHP_EOL;
    }
}

