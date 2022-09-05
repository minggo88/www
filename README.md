# kkikda2_www
for kkikda2 website

## 다국어 처리

다국어 처리를 위해서 HTML 에서 사용하는 방법과 Javascript에서 사용하는 방법 2가지가 있습니다.

### Javascript

```
var translated_text = __('번역이 필요한 원문'); // 영어 번역이 없으면 '번역이 필요한 원문'이 그대로 리턴됨.
```
Javascript에서 번역이 필요한 문장을 __() 함수의 인자로 전달하면 해당 문장으로 번역된 데이터가 있으면 번역문이 나오고 없으면 일자로 전달한 글 그대로 표시됩니다.

### HTML

```
<p data-i18n>번역이 필요한 원문</p>
```
HTML에서는 번역이 필요한 tag에 data-i18n Attribute를 추가하면 해당 태그의 Inner HTML을 번역 원문으로 사용해 번역문이 있는지 찾아 있으면 바꾸고 없으면 원문 그대로 표시합니다.


```
<input placeholder="번역이 필요한 원문" title="번역이 필요한 원문" alt="번역이 필요한 원문">
```
HTML에서 사용하는 placeholder, title, alt 태그는 자동 번역 처리 합니다.


## 배포버전 빌드

배포버전을 만들려면 최상위 폴더에 있는 build.php 파일을 실행시킵니다.
그러면 src 폴더 속의 소스를 www로 복사하고 불필요한 파일을 삭제하며 html 파일을 minify 합니다.
```
$ php build.php
```
