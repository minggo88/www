Array.prototype.remove = function() {
    var what, a = arguments, L = a.length, ax;
    while (L && this.length) {
        what = a[--L];
        while ((ax = this.indexOf(what)) !== -1) {
            this.splice(ax, 1);
        }
    }
    return this;
}
// 숫자 타입에서 쓸 수 있도록 format() 함수 추가
Number.prototype.format = function(){
    if(this==0) return 0;
    var reg = /(^[+-]?\d+)(\d{3})/;
    var n = (this + '');
    while (reg.test(n)) n = n.replace(reg, '$1' + ',' + '$2');
    return n;
};
// 문자열 타입에서 쓸 수 있도록 format() 함수 추가
String.prototype.format = function(){
    var num = parseFloat(this);
    if( isNaN(num) ) return "0";
    return num.format();
};

$(function() {
    $.fn.extend({
        dropdown: function() {
            let list = this.data('list')

            if(typeof(list) === 'undefined') {
                list = []
            }

            if(typeof(arguments[0]) === 'string') {
                const action = arguments[0]
                switch (action) {
                    // 작업중... 선택이 안됨.
                    // case 'value':
                    //     console.log(arguments, arguments[1], this.find('button[value=' + (arguments[1]) + ']'), 'button[value=' + (arguments[1]) + ']', $(this).get(0))
                    //     this.find('button[value=' + (arguments[1]) + ']').trigger('click');
                    //     break
                    case 'select':
                        this.find('.dropdown').html(list[arguments[1]]).end().find('.dropdown--item>span').html(list[arguments[1]])
                        this.data('selected', arguments[1])
                        console.log('change trigger');
                        this.trigger('change');
                        break
                    case 'selected':
                        return this.data('selected')
                    case 'open':
                        break
                    case 'add_search':
                        this.find('.dropdown--item').prepend('<input type="text" name="search" autocomplete="off" placeholder="' + __('검색어를 입력해주세요.') + '">');
                        const $options = this.find('.dropdown--item').find('>ul').find('>li');
                        this.find('[name=search]').on('keyup', function () { 
                            const skey = $(this).val();
                            $options.each(function () { 
                                const text = $(this).text();
                                if (text.search(new RegExp(skey, 'i')) > -1) {
                                    $(this).show();
                                } else {
                                    $(this).hide();
                                }
                            })
                        })
                        break
                    case 'add':
                         if(typeof(arguments[1]) === 'string') {
                            const li = $('<li>')

                            list[arguments[1]] = arguments[1]
        
                            const button = $('<button>').attr('type', 'button').text(arguments[1])
            
                            //button.appendTo(li)
        
                            //this.find('.dropdown--item').find('>ul').append(li)
                        }
                        else if(typeof(arguments[1]) === 'object') {
                            list[arguments[1].value] = arguments[1].text

                            const li = $('<li>')

                            const button = $('<button>').attr('type', 'button').val(arguments[1].value).html(arguments[1].text)
            
                            button.appendTo(li)

                            li.data('value', arguments[1].value)
                            li.appendTo(this.find('.dropdown--item').find('>ul'))
                        }
                }
            }
            else if(typeof(arguments[0]) === 'object') {
                if(arguments.length === 1) {
                    this.data('options', arguments[0])
                }
            }


            this.data('list', list)

            return this
        },
        tab: function() {
            
            if(typeof(arguments[0]) === 'string') {
                const action = arguments[0]

                switch(action) {
                    case 'show':
                        break
                    case 'hide':
                        break
                }
            }
            if(typeof(arguments[0]) === 'object') {
                if(arguments.length === 1) {
                    this.data('options', arguments[0])
                }
            }
        },
    })

    let modalStack = []
    let LAST_MODAL_ANCHOR

    $.alert = (msg) => {
        alert(msg)
    }

    $('.navigation--back').click(() => {
        if (window.location.href.indexOf('exchange.html')<0){ //거래소에서는 비활성화
			window.history.back();
			return false;
		} 
    })
    $('.navigation').click(() => {
        /**** 메인에서 제대로 작동하지 않아 재 입력  ***/
        const user_info = Model.user_info;
        if (user_info.userno && user_info.userid) {
            $('[name=box_logedin]').show();
            $('[name=box_unlogedin]').hide();
        } else {
            $('[name=box_logedin]').hide();
            $('[name=box_unlogedin]').show();
        }

        let mobile_screenWidth = window.innerWidth;
        // 요소를 가져옵니다.
        var box = document.getElementsByName("box_logedin")[0];
        // 요소의 display 속성 값을 가져옵니다.
        var m_login_displayValue = box.style.display;

        //if(windowHeight < 650 && mobile_screenWidth < 801){
        if(mobile_screenWidth < 801){//모바일의 경우로 수정
            $('.nav--side.mobile').hide();
            $('.mobile_side_login').show();

            if (m_login_displayValue == "block") { //로그아웃이 표시되었다면
                $('[name=m_login]').hide(); //로그인 표시
                $('[name=m_logout]').show(); //로그아웃 표시
            } else {
                $('[name=m_login]').show(); //로그인 표시
                $('[name=m_logout]').hide();//로그아웃 표시
            }

        }else{
            $('.nav--side.mobile').show();
            $('.mobile_side_login').hide();
        }

	$('.mobile-panel').show()
    })

    $.fn.myModal = function(action) {
        const modal = $(this)
        window.myModal_stop_event = false; // 이벤트 중단이 필요할때 true로 변경.

        if(!modal.hasClass('modal')) {
            return
        }

        switch(action) {
            case 'show':
                modal.trigger('beforeOpen', [ LAST_MODAL_ANCHOR ])
                if (window.myModal_stop_event) {
                    window.myModal_stop_event = false;
                } else {
                    modalStack = modalStack.filter(e => e !== modal)
                    modalStack.push(modal)
                    modal.addClass('modal--open')
                    modal.trigger('open')
                }
                break
            case 'hide':
                modal.trigger('beforeClose')
                if (window.myModal_stop_event) {
                    stop_event = false;
                } else {
                    modalStack.remove(modal)
                    modal.removeClass('modal--open')
                    modal.trigger('close')
                }
                break
            case 'toggle':
                if(modal.hasClass('modal--open')) {
                    modal.myModal('hide')
                } else {
                    modal.myModal('show')
                }
                break
            case 'beforeOpen':
                modal.on('beforeOpen', arguments[1])
                break
            case 'beforeClose':
                modal.on('beforeClose', arguments[1])
                break
            case 'stopEvent':
                window.myModal_stop_event = true;
                break
        }


        return this
    }

    // Language Selector
    // 우선 한국어만
    $('.nav--side .language').dropdown('add', { value: 'ko', text: '한국어' })
    // API.getLanguageList((resp) => {
    //     if(resp.success) {
    //         resp.payload.map((lang) => {
    //             $('.nav--side .language').dropdown('add', { value: lang.code, text: lang.name })
    //         })

    //         $('.nav--side .language').dropdown('select', window.localStorage.locale)
    //     }
    // })

    // Tab
    $('.tabs').on('click', 'li', (e) => {
        const btn = $(e.target).closest('li')
        const tab = btn.closest('.tabs')
        const tabIndex = btn.index()
        const target = btn.data('target')

        tab.trigger('beforeShow', [ tabIndex, target ])

        tab.find('.tab--active').removeClass('tab--active')
        btn.addClass('tab--active')

        tab.closest('.tab-wrapper').find('.tab-content').hide()
        $(target).show()

        tab.trigger('show', [ tabIndex, target ] )
    })

    // Modal Anchor
    $(document).on('click', '[data-toggle=modal]', (e) => {
        const anchor = $(e.target)

        const modal = anchor.attr('data-target')

        LAST_MODAL_ANCHOR = anchor

        $(modal).myModal('toggle')

        return false
    })

    $(document).on('click', '.accordion .accordion--header', (e) => {
        const $this = $(e.target)

        const accordionElem = $this.closest('.accordion')

        e.preventDefault()

        if($this.closest('.accordion--item').hasClass('accordion--open')) {
            $this.closest('.accordion--item').removeClass('accordion--open')
            return
        }

        accordionElem.find('.accordion--item.accordion--open').removeClass('accordion--open')
        $this.closest('.accordion--item').toggleClass('accordion--open')
    })

    $(window).on('keyup', (e) => {
        // ESC 누르면 열린 모달창이 닫히도록
        if(e.key === 'Escape' && modalStack.length) {
            $(modalStack.pop()).removeClass('modal--open')

            LAST_MODAL_ANCHOR.focus()
        }
    })

    // 드롭다운 메뉴의 바깥을 클릭할 경우
    $(document).on('click', ':not(.dropdown)', (e) => {
        if($(e.target).closest('.dropdown-wrapper').length) {
            $(e.target).closest('.dropdown--wrapper').find('.dropdown--open').toggleClass('dropdown--open')
            return
        }
        if(!$(e.target).closest('.dropdown').hasClass('dropdown--item')) {
            $('.dropdown--open').removeClass('dropdown--open')
			// $('.background').removeClass('active')
        }
    })

	/////////////////////////////////////////////////
	$(document).on('click', ':not(.tab_header .dropdown--wrapper .dropdown)', (e) => {
        if($(e.target).closest('.dropdown-wrapper').length) {
            $(e.target).closest('.dropdown--wrapper').find('.dropdown--open').toggleClass('dropdown--open')
            return
        }
        if(!$(e.target).closest('.dropdown').hasClass('dropdown--item')) {
            $('.dropdown--open').removeClass('dropdown--open')
			$('.background').removeClass('active')
        }
    })

	$(document).on('click', '.tab_header .dropdown--wrapper .dropdown', (e) => {
        e.stopPropagation()

        $('.dropdown--open').removeClass('dropdown--open')
		$('.background').toggleClass('active');
        $(e.target).toggleClass('dropdown--open');
        
        $(e.target).parent().find('[name=search]').focus();
    })

	////////////////////////////////////////////////////////
	// 드롭다운 메뉴의 바깥을 클릭할 경우
    $(document).on('click', '.dropdown', (e) => {
        e.stopPropagation()

        $('.dropdown--open').removeClass('dropdown--open')
		// $('.background').toggleClass('active');
        $(e.target).toggleClass('dropdown--open');
        
        $(e.target).parent().find('[name=search]').focus();
    })

    $(document).on('click', '.dropdown-wrapper .dropdown--item > ul > li', (e) => {
        const self = $(e.target).closest('li')
        const text = $(e.target).text()
        const value = self.data('value')

        const wrapper = $(e.target).closest('.dropdown-wrapper')
		// const Background = $('tab_bar').closest('.dropdown-wrapper')

        wrapper.dropdown('select', value)
        wrapper.data('selected', value)
        wrapper.find('.dropdown--selected').removeClass('dropdown--selected')
        wrapper.find('.dropdown').removeClass('dropdown--open')
		// Background.removeClass('active')

        $(e.target).closest('li').addClass('dropdown--selected')
        $(e.target).closest('.dropdown--item').find('>span').text(text)

        wrapper.trigger('change', [ value ])
    })

    $('.language').on('change', (_event, code) => {
        if (window.localStorage.locale != code) {
            API.setLanguage(code, (resp) => {
                if(resp.success) {
                    window.localStorage.locale = code
                    window._c(code);
                    location.reload()
                } else {
                    alert(resp.error.message)
                }
            })
        }
    })

    $('input[type=number]').on('keypress', (e) => {
        const self = $(e.target)

        const maxLength = parseInt(self.attr('maxlength'), 10)

        if(maxLength > 0) {
            if(self.val().length >= maxLength) {
                if(!window.getSelection().toString()) {
                    e.preventDefault()
                }
            }
        }
    })

    $('.input--spiner .spiner-plus').click((e) => {
        const input = $(e.target).closest('.input--spiner').find('input')

        let val = Math.max(Number(input.val()) + 1, 1)

        if (input.val() >= input.attr('max')) { val = input.attr('max') }

        input.val(val).trigger('input')
    })

    $('.input--spiner .spiner-minus').click((e) => {
        const input = $(e.target).closest('.input--spiner').find('input')

        let val = Math.max(Number(input.val()) - 1, 1)

        input.val(val).trigger('input')
    })


    $('.grid--code').on('input', 'input[type=number]', (e) => {
        if(e.target.value && $(e.target).next().length) {
            $(e.target).next().focus()
        }
    })

    $('.grid--code').on('keypress', 'input[type=number]', (e) => {
    })

    $('.details').on('click', '.btn--buy', () => {
        $('#modal-buy').addClass('modal--open')
    })
    $('.details').on('click', '.btn--sell', () => {
        $('#modal-sell').addClass('modal--open')
    })

    $('.modal').on('click', (e) => {
        const modal = $(e.target).closest('.modal')
        const self = $(e.target)

        if(modal.get(0) == self.get(0)) {
            self.myModal('hide')
            return
        }

        if(self.hasClass('btn--close')) {
            modal.myModal('hide')
        }
    })

    $('.btn--logout').click(() => {
        API.logout((resp) => {
            if(resp.success) {
                location.reload()
            } else {
                alert(resp.error.message)
            }
        })
    })

    // if(USER_INFO && USER_INFO.userno) {

    // }
})
