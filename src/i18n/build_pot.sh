# www/api/lib 폴더와 www/api/v1.0 폴더에서만 번역 대상 문구 추출합니다.

echo '' > file_list.txt
# 대상 파일 목록 생성
# 하위폴더 제외합니다.
#ls ../lib/*.php >> file_list.txt
# 하위폴더 포함 검색
#find ../member/ -iname "*.php" >> file_list.txt
#find ../member/ -iname "*.php" >> file_list.txt
ls ../assets/js/*.js >> file_list.txt
ls ../*.html >> file_list.txt


# 번역 데이터 생성
# xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot --join-existing -f file_list.txt --language=PHP 
# 이전 번역 데이터 남기고 POT 만들려면 --join-existing  옵션 추가 필요.
# 새로 생성 번역 처리 없는건 삭제
xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot -f file_list.txt --language=PHP
xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot -f file_list.txt --language=PHP --keyword=_e --join-existing
xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot -f file_list.txt --language=PHP --keyword=__ --join-existing
xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot -f file_list.txt --keyword=_e --join-existing
xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot -f file_list.txt --keyword=__ --join-existing
# xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot -f file_list.txt --language=html --keyword=_e --join-existing
# xgettext --from-code=UTF-8 --default-domain=WWW --output-dir=. --output=WWW.pot -f file_list.txt --language=html --keyword=__ --join-existing

# HTML 파일에서 i18n 적용 글자 추출하기
php add_html_tags.php

# 대상 파일 목록 삭제
# rm file_list.txt