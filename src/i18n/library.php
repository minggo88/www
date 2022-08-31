<?php
class i18n
{

	private $i18n_lang = "ko"; // default language
	private $i18n_folder = __DIR__;
	private $i18n_domain = "WWW";
	private $i18n_data = array();
	private $i18n_support_lang = array('ko','en','zh','ja','th','vi');

	public function __construct($p_lang = '')
	{
		$lang = $this->i18n_lang;
		if(isset($_SERVER['HTTP_ACCEPT_LANGUAGE'])) {
			$brwserlang = $_SERVER['HTTP_ACCEPT_LANGUAGE'];
			if(trim($brwserlang)) {
				$brwserlang = explode(',', trim($brwserlang))[0];
				$brwserlang = explode(';', $brwserlang)[0];
			} else {
				$brwserlang = '';
			}
			if ($brwserlang && trim($brwserlang) != '') {
				$lang = $brwserlang;
			} 
		}
		if (isset($_REQUEST['lang']) && trim($_REQUEST['lang']) != '') {
			$lang = $_REQUEST['lang'];
		} 
		if (isset($_COOKIE['lang']) && trim($_COOKIE['lang']) != '') {
			$lang = $_COOKIE['lang'];
		} 
		if (isset($_SESSION['lang']) && trim($_SESSION['lang']) != '') {
			$lang = $_SESSION['lang'];
		}
		if (trim($p_lang)) {
			$lang = $p_lang;
		}
		// var_dump($brwserlang, $_REQUEST['lang'], $_COOKIE['lang'], $_SESSION['lang'], $lang); exit;

		if ($lang == 'kr') {
			$lang = 'ko';
		}
		if ($lang == 'cn') {
			$lang = 'zh';
		}
		// 언어 한국어로 고정
		$lang = 'ko';
		// 언어파일
		$pofile = $this->i18n_folder . "/{$lang}/LC_MESSAGES/" . $this->i18n_domain . ".po";
		if (!file_exists($pofile)) {
			$lang = 'ko';
			$pofile = $this->i18n_folder . "/{$lang}/LC_MESSAGES/" . $this->i18n_domain . ".po";
		}

		$this->i18n_lang = $lang;
		@$_REQUEST['lang'] = $lang;

		$c = $this->get_cache($pofile);
		$c = $c ? json_decode($c) : false;
		if (file_exists($pofile)) {
			if (isset($c->gentime) && $c->gentime >= filemtime($pofile)) { // 캐시 생성 시간이 파일 수정시간보다 크면 캐시 사용. 
				$this->i18n_data = (array) $c->data;
			} else {
				// $i18n_data = $this->gen_i18n_data($pofile);
				// if ($i18n_data) {
				// 	$data = array(
				// 		'gentime' => time(),
				// 		'data' => $i18n_data
				// 	);
				// 	$c = $this->set_cache($pofile, json_encode($data), 31536000); // 1년 캐시
				// }
				// $this->i18n_data = (array) $data['data'];
				$this->i18n_data = $this->gen_i18n_file($pofile);
			}
		} else {
			$this->i18n_data = array();
		}
	}

	public function gen_i18n_file($pofile)
	{
		$i18n_data = $this->gen_i18n_data($pofile);
		if ($i18n_data) {
			$data = array(
				'gentime' => time(),
				'data' => $i18n_data
			);
			$c = $this->set_cache($pofile, json_encode($data), 31536000); // 1년 캐시
		}
		return $i18n_data;
	}

	/**
	 * po 파일에서 원문과 번역문을 추출해 원문을 키로하고 번역문을 값으로 하는 배열을 생성합니다.
	 *
	 * @param String $pofile pofile의 파일명포함 경로
	 * 
	 * @return Array 번역 데이터
	 * 
	 */
	public function gen_i18n_data($pofile) 
	{
		$data = array();
		// 언어파일
		if (file_exists($pofile)) {
			$con = file_get_contents($pofile);
			$con = preg_replace('/^#(.*)/m', '', $con); // remove comment
			$con = preg_replace('/^\"(Project-Id-Version|Report-Msgid-Bugs-To|POT-Creation-Date|PO-Revision-Date|Last-Translator|Language-Team|Language|MIME-Version|Content-Type|Content-Transfer-Encoding|X-Generator|Plural-Forms):(.*)\"$/m', '', $con); // remove header
			$con = str_replace('"' . "\n" . '"', '', $con); // concat multiline string
			$con = explode("\n", $con);
			$msgid = array();
			$msgstr = array();
			foreach ($con as $row) {
				if (trim($row) != '' && (strpos($row, 'msgid') !== false || strpos($row, 'msgstr') !== false)) { // 빈줄 재외, msgid, msgstr 없는것 제외
					preg_match('/^(.*)\s"(.*)"$/', $row, $matches); // 키 "값" 으로 추출
					if (trim($matches[1]) != '') {
						$key = $matches[1];
						$val = $matches[2] ? $matches[2] : '';
						if ($key == 'msgid' || $key == 'msgstr') {
							$$key[] = $val;
						}
					}
				}
			}
			if (count($msgid) == count($msgstr)) {
				for ($i = 0; $i < count($msgid); $i++) {
					$data[$msgid[$i]] = $msgstr[$i];
				}
			}
		}
		return $data;
	}

	public function get_i18n_lang()
	{
		return $this->i18n_lang;
	}

	/**
	 * 캐시 내용 가져오기. 
	 * @param String id cache id
	 * @param Number sec cache time(sec.)
	 */
	public function get_cache($id)
	{
		$r = '';
		$_cache_file = $this->get_cache_file_path($id);
		if (file_exists($_cache_file)) {
			$r = unserialize(gzuncompress(file_get_contents($_cache_file)));
			if ($r['time'] > time()) {
				$r = $r['contents'];
			} else {
				$r = '';
			}
		}
		return $r;
	}

	public function set_cache($id, $contents, $sec = 60)
	{
		// php 용 캐시파일
		@file_put_contents($this->get_cache_file_path($id), gzcompress(serialize(array('time' => time() + $sec, 'contents' => $contents))));
		// javascript 용 캐시파일
		@file_put_contents($this->get_json_file_path($id), $contents);
		return $contents;
	}

	function get_cache_file_path($id)
	{
		return str_replace('.po', '.cache', $id);
	}

	function get_json_file_path($id)
	{
		return str_replace('.po', '.json', $id);
	}

	function __($s)
	{
		return isset($this->i18n_data[$s]) && $this->i18n_data[$s] ? $this->i18n_data[$s] : $s;
	}
}

$i18n = new i18n();

function __($s)
{
	global $i18n;
	return $i18n->__($s);
}

function _e($s)
{
	echo __($s);
}