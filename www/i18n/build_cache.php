<?php
echo "다국어빌드 작업 시작 ".PHP_EOL;
$i18n_path  = __DIR__;
include $i18n_path.'/library.php';
$i18n = new i18n;
if($dh = opendir($i18n_path)) {
	while(($dir = readdir($dh)) !== false) {
		$lang_path = $i18n_path.'/'.$dir;
		if ($dir == "." || $dir == ".." || is_file($lang_path)) {
			continue;
		}
		$i18n->gen_i18n_file($lang_path.'/LC_MESSAGES/WWW.po');
	}
}
echo "다국어빌드 작업 끝 ".PHP_EOL;
