<?php
$source_dir = __DIR__.'/src';
$target_dir = __DIR__.'/www';


echo "다국어빌드 작업 시작 ".PHP_EOL;
$i18n_path  = $source_dir.'/i18n';
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
// $i18n->gen_i18n_file('www/i18n/en/LC_MESSAGES/WWW.po');
// $i18n->gen_i18n_file('www/i18n/ko/LC_MESSAGES/WWW.po');
// $i18n->gen_i18n_file('www/i18n/zh/LC_MESSAGES/WWW.po');
echo "다국어빌드 작업 끝 ".PHP_EOL;

// 소스 복사
echo "복사 시작 ".PHP_EOL;
// 수정된 파일만 갱신.
if(stripos(PHP_OS, 'linux')!==false) {
	exec("rsync -a --delete --exclude=www/assets/img/resource --exclude=.git --exclude=.gitignore --exclude=.vscode --exclude=.idea --exclude=README.md --exclude=.DS_Store '{$source_dir}/' '{$target_dir}'"); 
} elseif(stripos(PHP_OS, 'windows')!==false || stripos(PHP_OS, 'WINNT')!==false) {
	$source_dir = str_replace('/','\\',$source_dir);
	$target_dir = str_replace('/','\\',$target_dir);
	exec('ROBOCOPY /MIR "'.$source_dir.'" "'.$target_dir.'" /XD DIRS "'.$source_dir.'\assets\img\resource"'); 
} else {
    exec("rsync -a --delete --exclude=www/assets/img/resource --exclude=.git --exclude=.gitignore --exclude=.vscode --exclude=.idea --exclude=README.md --exclude=.DS_Store '{$source_dir}/' '{$target_dir}'");
//	exit('지원하지 않는 OS입니다.');
}

unlink($target_dir.'/i18n/build_pot.sh');
unlink($target_dir.'/i18n/library.php');
unlink($target_dir.'/i18n/po2json.php');
unlink($target_dir.'/i18n/readme.txt');
unlink($target_dir.'/i18n/WWW.pot');

echo "복사 완료 ".PHP_EOL;

echo "html 작업시작 ".PHP_EOL;

// 배포본 생성
if($dh = opendir($source_dir)) {
	while(($file = readdir($dh)) !== false) {
		if ($file == "." || $file == ".." || strpos($file, '.html')===false) {
			continue;
		}
		$_file = $source_dir.'/'.$file;
		if(is_file($_file) && strpos($_file, '.html')!==false) {
			$html = file_get_contents($_file);

			//버전 관리 파일 찾기
			preg_match_all("/'(.[^']*\?t={version})'/", $html, $fs1);
			preg_match_all('/"(.[^"]*\?t={version})"/', $html, $fs2);
			$fs = array_merge($fs1[1], $fs2[1]);

			// 파일 생성날짜 및 버전 수정
			foreach($fs as $f) {
				$_f = $source_dir.'/'.str_replace('?t={version}','',$f);
				if(file_exists($_f)) {
					$t = filemtime($_f);
				} else {
					echo "파일이 없습니다. 소스를 수정하거나 파일을 생성해주세요. {$_f}\n";
				}
				// $_f_min = str_replace(array('.js','.css'), array('.min.js','.min.css'), $_f);
				// if(file_exists($_f_min)) {
				// 	$f_min = str_replace(array('.js','.css'), array('.min.js','.min.css'), $f);
				// } else {
					$f_min = $f;
				// }
				$html = str_replace($f, str_replace('{version}',$t,$f_min), $html);
			}

            // 다국어 처리
			/*
			$html = preg_replace("/<\?=__\('(.*?)'\);\?>/", '<span data-bind="LANG_DATA.$1">$1</span>', $html);
			$html = preg_replace('/<\?=__\("(.*?)"\);\?>/', '<span data-bind="LANG_DATA.$1">$1</span>', $html);
			$html = preg_replace("/<\?_e\('(.*?)'\);\?>/", '<span data-bind="LANG_DATA.$1">$1</span>', $html);
			$html = preg_replace('/<\?_e\("(.*?)"\);\?>/', '<span data-bind="LANG_DATA.$1">$1</span>', $html);
			*/

			// minify
			// $html = preg_replace('/\/\/.*$/', '', $html);
			// $html = preg_replace('/\/\*.*\*\//', '', $html);
			// $html = preg_replace('/<!--.*-->/', '', $html);
			// $html = preg_replace('/\s+/', ' ', $html);
			// $html = preg_replace('/>\s+</', '><', $html);

			file_put_contents($target_dir.'/'.$file, $html);
		}

	}
	closedir($dh);
}

echo "html 작업종료 ".PHP_EOL;






