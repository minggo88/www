번역 도구는 https://poedit.net/download 에서 다운로드 하거나 https://localise.biz/free/poeditor 에서 사용합니다.

[번역 작업 순서]

1. 현 파일을 실행해 번역이 필요한 문구를 추출 및 정리합니다. window 에서는 git bash 프로그램에서 실행하시면 됩니다.
   www/api/i18n/build_pot.sh

2. pot 파일을 poedit 프로그램으로 열어서 번역합니다. 그리고 저장할때 번역언어별로 저장합니다. 
   저장경로는 번역 언어명 폴더입니다. 언어_국가코드 형식으로 사용할 수 있습니다.

3. 신규 번역 글 반영
   기존 po 파일에 새로 생성된 pot 파일을 반영하려면 poedit 프로그램에서 po 파일을 열고 상단 매뉴 > 카탈로그 > POT파일에서 업데이트 를 클릭하고 pot 파일을 선택하면 두 파일이 합쳐집니다.

4. mo파일 생성
   실재로 PHP에서 사용하는 번역 파일은 .mo파일입니다. .po 파일을 poedit 프로그램으로 열고 저장하면 .mo 파일도 함깨 생성됩니다. 
   매뉴 > MO로 컴파일 매뉴를 누르면 따로 .mo 파일을 만들 수 있습니다.

5. json파일 생성
	https://localise.biz/free/converter/po-to-json 에서 PO 파일을 JSON 파일로 변환합니다. JSON 포맷은 Simple(key/value pairs)를 사용합니다.
   또는 build_cache.php 파일을 실행해서 php와 javascript용 번역 캐시파일을 만듧니다.
