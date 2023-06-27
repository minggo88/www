setTimeout(function() {
    $("#title_4").hide()
    $("#title_4_on").show()
}, 500);

$(document).ready(function(){
    $("#confirm-btn").click(function(){
        $("input[name='chk[]']:checked").each(function(){
            var name = $(this).closest("tr").find("td:eq(1)").text();
            var qty = $(this).closest("tr").find("td:eq(7)").text();
            console.log(name + " / " + qty);
        });
    });

    $("input[name='chk[]']").change(function(){
        var checkbox = $(this);
        var input_qty = checkbox.closest("tr").find("input[name='qty[]']");

        if(checkbox.prop("checked")){
            input_qty.prop("disabled", false);
        } else {
            input_qty.prop("disabled", true);
        }
    });
});