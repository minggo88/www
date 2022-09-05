<?php
require __DIR__.'/SimpleHtmlDom.php';

$pot_file = __DIR__.'/WWW.pot';



$pot_text = file_get_contents($pot_file);
$split_position = strpos($pot_text, 'msgid "', strpos($pot_text, 'msgid "')+1); // 두번째 msgid " 이전과 이후로 분리.
$memo = substr($pot_text, 0, $split_position);
$data = substr($pot_text, $split_position);
$data = preg_replace('/"\n"/','',$data); // 문자열이 길면 여러줄로 나눠서 저장된 곳을 한줄로 변경
$data = preg_replace('/^#:.*\n/m','',$data); // POT 파일 주석 제거
$pot_text = $memo.PHP_EOL.$data;
file_put_contents($pot_file, $pot_text); 

// 번역 대상 파일별로 번역처리된곳 찾기
$files = file(__dir__.'/file_list.txt');
foreach($files as $f) {
    $f = trim($f);
    if(!$f) {continue;}
    $file = realpath(__DIR__.'/'.$f);
    // var_dump($file, preg_match('/.html$/', $file));
    if($file && preg_match('/.html$/', $file) ) {
        $html = file_get_contents($file);
        // $placeholde 
        // $alt
        // $title

        $html = str_get_html($html);
        // $pot_text = file_get_contents($pot_file);
        $placeholder = $html->find('[placeholder]');
        foreach($placeholder as $tr) {
            $inner_html = trim($tr->placeholder);
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
                $pot_text .= $new_pot_text.PHP_EOL;
            }
        }
        // $pot_text = file_get_contents($pot_file);
        $alt = $html->find('[alt]');
        foreach($alt as $tr) {
            $inner_html = trim($tr->alt);
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
                $pot_text .= $new_pot_text.PHP_EOL;
            }
        }
        // $pot_text = file_get_contents($pot_file);
        $title = $html->find('[title]');
        foreach($title as $tr) {
            $inner_html = trim($tr->title);
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
                $pot_text .= $new_pot_text.PHP_EOL;
            }
        }
        // $pot_text = file_get_contents($pot_file);
        $translates = $html->find('[data-i18n]');
        foreach($translates as $tr) {
            $inner_html = $tr->innertext();
            $inner_html = trim($inner_html);
            // if(strpos($f, 'notice')!==false) {var_dump($inner_html);            }
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
                $pot_text .= $new_pot_text.PHP_EOL;
            }
        }
    }
}
