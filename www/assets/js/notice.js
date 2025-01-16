function waitForElement(selector, callback, interval = 10) {
    const checkExist = setInterval(() => {
        const element = $(selector);
        if (element.length) {
            console.log(`${selector} found!`);
            clearInterval(checkExist); // 타이머 중지
            callback(element); // 콜백 실행
        }
    }, interval);
}

// 사용 예제
waitForElement('#title_4', function (element) {
    element.hide(); // #title_2 숨김
    console.log('#title_4 is now hidden');
	$("#title_4").hide();
    $("#title_4_on").show();
});
