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

    // 모든 탭 버튼의 선택 상태를 초기화
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => button.classList.remove("selected"));

    // 선택한 탭 버튼에 선택 상태를 추가
    const selectedTabButton = document.querySelector(`.tab-button:nth-child(${tabNumber})`);
    selectedTabButton.classList.add("selected");
}
