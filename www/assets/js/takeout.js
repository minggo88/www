setTimeout(function() {
    $("#title_4").hide()
    $("#title_4_on").show()
}, 500);

$(document).ready(function(){
    $("#confirm-btn").click(function(){
        $("input[name='chk[]']:checked").each(function(){
            var name = $(this).closest("tr").find("td:eq(1)").text();
            var maxQty = $(this).closest("tr").find("td:eq(7)").text();
            var qtyInput = $(this).closest("tr").find("input[name='qty[]']");
            var qty = qtyInput.val();

            if (Number(qty) > Number(maxQty)) {
                alert(name + "의 수량 입력 값이 보유 수량을 초과합니다.");
                //return;
                qtyInput.val(maxQty);
            }

            console.log(name + " / " + qty + " (최대값: " + maxQty + ")");
            
            
        });
    });

    $("input[name='chk[]']").change(function(){
        var checkbox = $(this);
        var input_qty = checkbox.closest("tr").find("input[name='qty[]']");

        if(checkbox.prop("checked")){
            input_qty.prop("disabled", false);
        } else {
            input_qty.prop("disabled", true);
            input_qty.val('');
        }
    });
});