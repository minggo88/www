<?php
require __DIR__.'/SimpleHtmlDom.php';

$pot_file = __DIR__.'/WWW.pot';
$pot_text = file_get_contents($pot_file);

$files = file(__dir__.'/file_list.txt');
foreach($files as $f) {
    $f = trim($f);
    if(!$f) {continue;}
    $file = realpath(__DIR__.'/'.$f);
    if($file && preg_match('/.html$/', $file) && preg_match('/index.html$/', $file) ) {
        $html = file_get_contents($file);
        // $placeholde 
        // $alt
        // $title


        $html = str_get_html($html);
        $placeholder = $html->find('[placeholder]');
        foreach($placeholder as $tr) {
            $inner_html = $tr->placeholder;
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
            }
        }
        $alt = $html->find('[alt]');
        foreach($alt as $tr) {
            $inner_html = $tr->alt;
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
            }
        }
        $title = $html->find('[title]');
        foreach($title as $tr) {
            $inner_html = $tr->title;
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
            }
        }
        $translates = $html->find('[data-i18n]');
        foreach($translates as $tr) {
            $inner_html = $tr->innertext();
            $pot_msgid = 'msgid "'.str_replace('"', '\"', $inner_html).'"';
            $pot_msgstr = 'msgstr ""';
            $new_pot_text = "\n#: {$f}\n{$pot_msgid}\n{$pot_msgstr}\n";
            if(strpos($pot_text, $pot_msgid)===false) {
                file_put_contents($pot_file, $new_pot_text, FILE_APPEND);
            }
        }
    }
}
