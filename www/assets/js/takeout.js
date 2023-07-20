/*setTimeout(function() {
    $("#title_4").hide()
    $("#title_4_on").show()
}, 500);
*/

$(document).ready(function(){
    
});

window.onload = function() {
    fn_wallet();
};
var data = [];
var selected_list = [];
var total_num = 0;
const fn_wallet = function () {
    check_login();
    force_rander('user_info', Model.user_info);

    // set default exchange currency symbol
    const exchange = 'KRW';

    const withdrawable_symbols = ['KRW']; // , 'USD', 'ETH'
    var dataArray = [];
    API.getBalance('ALL', '', (resp) => {
        resp.payload.filter(function(item) {
            if (item.crypto_currency === 'N') {
                return false; // skip
            }
            return true;
        }).map((item) => {
            if(item.symbol ==='USD' || item.symbol ==='ETH' || item.symbol ==='KRW'|| item.symbol ===''){
                return;
            }
            var d_item = {name: item.name,
                confirmed: item.confirmed,
                symbol: item.symbol,
                userno: item.userno};
            dataArray.push(item);
            
            //dataArray.push(d_item);

        });
        //console.log(dataArray.length);  
        //console.log(dataArray[0]);  

        dataArray.sort(function(a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        
        

        dataArray.forEach(function(item, index) {
          // 여기에 처리 로직을 작성하세요.
          //console.log(index + 1 + '. ' + item.name);
            data.push({name: dataArray[index].name,
                confirmed: dataArray[index].confirmed,
                symbol: dataArray[index].symbol,
                userno: dataArray[index].userno});
        });

        //console.log(data);


        var selectElement = $("#test_op");
        var selectWebElement = document.querySelector(".custom-select-list");
        var listContainer = $(".list");
        var cartBtn = document.querySelector('.cart-btn');

        //Web------------------------------------------------------------------------
        data.forEach(function(item, index) {
            /*var liElement = document.createElement('li');
            liElement.className = 'custom-select-option';
            liElement.setAttribute('data-value', item.symbol);
            liElement.textContent = item.name+'   (' + Math.floor(item.confirmed)+'개) ';*/
            var newLiElements = '<li value="' + item.symbol + '" class="custom-select-option onClick=test()">' + item.name + '(' + Math.floor(item.confirmed) + '개) </li>';
            //var newLiElements = $('<li>').addClass('custom-select-option').attr('value', item.symbol).text(item.name + '(' + Math.floor(item.confirmed) + '개)');
            
            // li 요소를 selectWebElement에 추가합니다.
            //selectWebElement.appendChild(liElement);
            $('.custom-select-list').append(newLiElements);

            
        });
        $('.custom-select-option').on('click', function() {
            var selectedIndex = $(this).index()+1;
            //console.log('선택한 옵션의 인덱스: ' + selectedIndex);
            $('.custom-select-list').hide();
            //console.log('click111111111');
            selectElement.val(selectElement.find('option:eq('+selectedIndex+')').val());
            selectElement.trigger('change');
            
            
            $(this).removeClass('selected');
        });

        //mobile----------------------------------------------------------------------
        // 기본 선택 옵션 추가
        selectElement.append($('<option>').attr('value', '').text('선택하세요'));
    
        // 데이터를 기반으로 옵션 추가
        data.forEach(function(option) {
            var value = option.symbol;
            var text = option.name + ' ( ' + Math.floor(option.confirmed) + '개)';
    
            selectElement.append($('<option>').attr('value', value).text(text));
        });
    
        // select 요소 변경 시 이벤트 핸들러
        selectElement.on('change', function() {
            var selectedValue = $(this).val();
    
            // 이미 추가된 경우 경고 표시
            if (selected_list.includes(selectedValue)) {
                alert('이미 추가된 옵션입니다.');
                return;
            } else {
                selected_list.push(selectedValue); // 선택한 옵션의 symbol 값을 배열에 추가
            }
    
            // 선택된 값이 data에 존재하는 경우
            var selectedOption = data.find(function(option) {
                return option.symbol === selectedValue;
            });
    
            if (selectedOption) {
                var optionHtml = `
                    <div class="options">
                        <label for="option1">${selectedOption.name}</label>
                        <div class="input-group">
                            <button class="minus-btn" type="button" name="button" disabled>-</button>
                            <input type="text" name="quantity" value="0" min="0" max="${selectedOption.confirmed}" pattern="[0-9]*" inputmode="numeric">
                            <button class="plus-btn" type="button" name="button">+</button>
                            <button class="remove-btn" type="button" name="button">x</button>
                        </div>
                    </div>
                `;
    
                listContainer.append(optionHtml);
            }
            selectElement.val('');
            ////----------------------------------------------------------------------
            
        });
        
    });
    
}

const check_login = function (msg) {
    if (!Model.user_info || !Model.user_info.userid && !Model.user_info.userno) {
        if (msg) alert(msg);
        window.location.href = LOGIN_PAGE;
    }
}
const check_logout = function (msg) {
    if (Model.user_info && Model.user_info.userid && Model.user_info.userno) {
        if (msg) alert(msg);
        window.location.href = "/";
    }
}
/*
//데이터 만들기
const fn_wallet = function () {
    check_login();
    force_rander('user_info', Model.user_info);

    // set default exchange currency symbol
    const exchange = 'KRW';

    const withdrawable_symbols = ['KRW']; // , 'USD', 'ETH'

    API.getBalance('ALL', '', (resp) => {
        $('.wallet--grid').removeClass('loading')
    })
};
*/

    
///-------------------------------------------------------------------------------------------
$(document).ready(function() {
    $("#confirm-btn").click(function(){
        let cookie_check = $.cookie(Model.user_info.userid);

        if(PIN_NUMBER_ON <1) {
            
                $('#modal-buy-button').attr('data-target','#modal-buy-pin');
                //console.log('3333333 : ' + PIN_NUMBER_ON);
           
        }else{
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
    
                //console.log(name + " / " + qty + " (최대값: " + maxQty + ")");
            });
        }
        
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
    
    
    //버튼이벤트

    var selectElement = $("#test_op");
    var listContainer = $(".list");
    var cartBtn = document.querySelector('.cart-btn');   

    $(cartBtn).prop('disabled', true);

    // + 버튼 클릭 시 이벤트 핸들러
    listContainer.on('click', '.plus-btn', function() {
        var inputElement = $(this).siblings('input[name="quantity"]');
        var currentValue = parseInt(inputElement.val(), 10);

        if (!isNaN(currentValue)) {
            var maxValue = parseFloat(inputElement.attr('max'));

            if (currentValue < maxValue) {
                inputElement.val(currentValue + 1);
                total_num = total_num + 1;
                $('.total_cnt').text(total_num);
            }
            $(this).siblings('.minus-btn').prop('disabled', false);
            $(cartBtn).prop('disabled', false);
            cartBtn.style.backgroundColor = '#E21A32';
        }
    });

    // - 버튼 클릭 시 이벤트 핸들러
    listContainer.on('click', '.minus-btn', function() {
        var inputElement = $(this).siblings('input[name="quantity"]');
        var currentValue = parseInt(inputElement.val(), 10);

        if (!isNaN(currentValue)) {
            var minValue = parseFloat(inputElement.attr('min'));

            if (currentValue > minValue) {
                inputElement.val(currentValue - 1);
                total_num = total_num - 1;
                $('.total_cnt').text(total_num);

                if(total_num<1){
                    $(cartBtn).prop('disabled', true);
                    cartBtn.style.backgroundColor = '#999999';
                }
            }

            if (currentValue - 1 === minValue) {
                $(this).prop('disabled', true);
                $(cartBtn).prop('disabled', true);
            }
        }
    });

    // x 버튼 클릭 시 이벤트 핸들러
    listContainer.on('click', '.remove-btn', function() {
        var optionDiv = $(this).closest('.options');
        var optionLabel = optionDiv.find('label');
        var optionName = optionLabel.text();
        var inputValue = $(this).siblings('input[name="quantity"]').val();

        // 선택된 옵션 배열에서 삭제
        selected_list = selected_list.filter(function(value) {
            return value !== optionName;
        });

        // 선택한 옵션의 symbol 값을 찾습니다.
        var selectedOption = data.find(function(option) {
            return option.name === optionName;
        });
        
        if (selectedOption) {
            var selectedSymbol = selectedOption.symbol;
        
            // selected_list 배열에서 선택한 옵션의 symbol 값을 제거합니다.
            selected_list = selected_list.filter(function(value) {
            return value !== selectedSymbol;
            });
        }

        //총 반출량 빼기
        total_num = total_num - inputValue;
        $('.total_cnt').text(total_num);
        if(total_num<1){
            $(cartBtn).prop('disabled', true);
            cartBtn.style.backgroundColor = '#999999';
        }

        // 해당 옵션 div 삭제
        optionDiv.remove();
    });

    
    cartBtn.addEventListener('click', function() {
        
        // pin Number popup 띄우기
        $('#pin_number').addClass('modal--open');
       
        //modal 작업
        $('#pin_number').submit((e) =>  { 
			e.preventDefault();
			let check = true;
			let pin = '';

			$('#pin_number .grid--code input[type=number]').each((_index, elem) => {
				if(!$(elem).val()) {
					check = false;
					$(elem).focus();
					return false;
				}
				pin += $(elem).val();
			});


            if(check) {
				API.checkPin(pin, (resp) => {
					if(resp.success) {
						//최종
                        let message = '';
                        var scrollableDiv = document.querySelector('.scrollable-div');
                        var newOption = document.createElement('div');
                        newOption.classList.add('s_options');
                        
                        document.querySelectorAll('.options input[type=text]').forEach(function(input) {
                            const name = input.parentElement.previousElementSibling.textContent.trim();
                            const quantity = parseInt(input.value);
                            if (!isNaN(quantity) && quantity > 0) {
                                message += `${name}-${quantity}\n`;

                                
                                newOption.innerHTML = `<label for="s_option1">`+name+`</label>
                                <div class="input-group">
                                    <label>`+quantity+`개</label>
                                </div>`;
                                scrollableDiv.appendChild(newOption);
                            }                            
                        });
                        if (message != '') {
                            alert(`반출신청\n${message}`);
                            
                            //메일보내기
                            /*API.takeOutEmailConfirmCode("flyminggo@naver.com", (resp) => {
                                if (resp.success) {
                                    sended_email = email.val();
                                    //	$('#create-account-info').hide()
                                    $('#create-account-info').parent("section").hide()
                                    $('#create-account-mail-auth').show().find('.grid--code>input:eq(0)').focus()
                    
                                    $('#create-account-mail-auth').parent("section").show().find('.grid--code>input:eq(0)').focus()
                                    //$('#create-account-password-confirm').parent("section").show()
                                } else {
                                    $('#create-account-info input[type=submit]').prop('disabled', false)
                    
                                    alert(resp.error.message)
                                }
                            })*/
                            $('#pin_number2').addClass('modal--open');
                        }
					} else {
						alert(resp.error.message);
					}
                    
                    var inputElements = document.querySelectorAll('input[name="pincode"]');
                    inputElements.forEach(function(inputElement) {
                        inputElement.value = '';
                    });
                    $('#pin_number').removeClass('modal--open'); //모달 창 닫아주기
				})
			}
			return false
        });        
    });

    $('.custom-select').on('click', function() {
      $(this).toggleClass('selected');
      if($(this).hasClass('selected')) {
        $('.custom-select-list').show();
      } else {
        $('.custom-select-list').hide();
      }
    })  
    
    $('.custom-select-option').on('click', function() {
        let value = $(this).attr('value');
        
        $('.custom-select-text').text($(this).text());
        $('.select-origin').val(value);
        $('.custom-select-list').hide();

    });
});


