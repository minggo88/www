setTimeout(function() {
    $("#title_2").hide()
    $("#title_2_on").show()
}, 500);

function showTab(tabNumber) {
    // 모든 탭 내용을 숨김
    for (let i = 1; i <= 3; i++) {
        document.getElementById(`tab${i}`).style.display = 'none';
    }

    // 선택한 탭 내용을 표시
    document.getElementById(`tab${tabNumber}`).style.display = 'block';
}

// 초기에 첫 번째 탭을 표시
showTab(1);