<?
echo '<header>
		<div class="header_inner">
			<h1 class="logo"><a href="index.html">ASSETTEA</a></h1>
			<nav class="nav">
				<ul>
					<li>
						<a href="exchange.html" data-i18n>거래소</a>
					</li>
					<!-- <li><a href="group-buying.html" data-i18n>공동구매</a></li> -->
					<!-- <li><a href="auction.html" data-i18n>경매</a></li> -->
					<li>
						<a href="wallet.html" data-login data-i18n>입출금</a>
					</li>
					<!-- <li><a href="tea-ceremony-culture_.html" data-i18n>다도 문화</a></li> -->
					<li>
						<a href="notice.html" data-i18n>공지사항</a>
					</li>
				</ul>
			</nav>
			<div class="nav--side">
				<div name="box_logedin" class="profile dropdown-wrapper">
					<button type="button" class="dropdown btn btn--mypage" name="btn-papage" data-i18n>마이페이지</button>
					<div class="dropdown--item" style="width: 134px;left: -32px;">
						<ul>
							<li><a href="member-account.html" data-login data-i18n>정보 수정</a></li>
							<li><a href="my-verification.html" data-login data-i18n>ID 인증 관리</a></li>
							<li><a href="change-pin-number.html" data-login data-i18n>보안비밀번호변경</a></li>
							<li><a href="change-account-number.html" data-login data-i18n>출금계좌 변경</a></li>
							<!-- <li><a href="transaction.html" data-login data-i18n>거래 내역</a></li> -->
							<li><a href="notification.html" data-login data-i18n>알림</a></li>
						</ul>
					</div>
				</div>
				<div name="box_logedin" style="display: none"><button class="btn btn--logout" name="btn-logout" data-i18n>로그아웃</button></div>
				<div name="box_unlogedin" style="display: none"><a href="login.html" data-logout class="btn--login" data-i18n>로그인</a></div>
				<div class="language dropdown-wrapper">
					<button type="button" class="dropdown">한국어</button>
					<div class="dropdown--item" style="width: 81px">
						<span>한국어</span>
						<ul></ul>
					</div>
				</div>
			</div>
		</div>
		<div class="box-mobile-menu">
			<a href="#" class="btn hamburger" name="btn-hamburger">☰</a>
		</div>
		<ul class="gnb box-menu" name="box-menu">
			<li>
				<a href="exchange.html" data-i18n>거래소</a>
			</li>
			<!-- <li><a href="group-buying.html" data-i18n>공동구매</a></li> -->
			<!-- <li><a href="auction.html" data-i18n>경매</a></li> -->
			<li>
				<a href="wallet.html" data-login data-i18n>입출금</a>
			</li>
			<!-- <li><a href="tea-ceremony-culture_.html" data-i18n>다도 문화</a></li> -->
			<li>
				<a href="notice.html" data-i18n>공지사항</a>
			</li>
		</ul>
	</header>';
?>
