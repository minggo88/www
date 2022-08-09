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


                switch(action) {
                    case 'select':
                        this.find('.dropdown').html(list[arguments[1]]).end().find('.dropdown--item>span').html(list[arguments[1]])
                        this.data('selected', arguments[1])
                        break
                    case 'selected':
                        return this.data('selected')
                    case 'open':
                        
                    case 'add':
                        if(typeof(arguments[1]) === 'string') {
                            const li = $('<li>')

                            list[arguments[1]] = arguments[1]
        
                            const button = $('<button>').attr('type', 'button').text(arguments[1])
            
                            button.appendTo(li)
        
                            this.find('.dropdown--item').find('>ul').append(li)
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
            else if(typeof(arguments[1]) === 'object') {
                if(arguments.length === 1) {

                }
            }


            this.data('list', list)

            return this
        }
    })

    const modalStack = []
    let LAST_MODAL_ANCHOR


    $.alert = (msg) => {
        alert(msg)
    }

    $.fn.myModal = function(action) {
        const modal = $(this)

        if(!modal.hasClass('modal')) {
            return
        }

        switch(action) {
            case 'show':
                modalStack = arr.filter(e => e !== 'seven')

                modalStack.push(modal)

                modal.addClass('modal--open')
                break
            case 'hide':
                modalStack.remove(modal)

                modal.removeClass('modal--open')
                break
            case 'toggle':
                if(modal.hasClass('modal--open')) {
                    modalStack.remove(modal)
                } else {
                    modalStack.push(modal)
                }

                modal.toggleClass('modal--open')
                break
        }


        return this
    }

    // Language Selector
    API.getLanguageList((resp) => {
        if(resp.success) {
            resp.payload.map((lang) => {
                $('.nav--side .language').dropdown('add', { value: lang.code, text: lang.name })
            })

            $('.nav--side .language').dropdown('select', window.localStorage.locale)

        }
    })

    // Tab
    $('.tabs').on('click', 'li', (e) => {
        const btn = $(e.target).closest('li')
        const tab = btn.closest('.tabs')

        tab.find('.tab--active').removeClass('tab--active')
        btn.addClass('tab--active')

        $('.tab-content').hide()
        $(btn.data('target')).show()
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

        }
    })

    $(document).on('click', '.dropdown', (e) => {
        e.stopPropagation()

        $('.dropdown--open').removeClass('dropdown--open')

        $(e.target).toggleClass('dropdown--open');
    })

    $(document).on('click', '.dropdown-wrapper .dropdown--item > ul > li', (e) => {
        const self = $(e.target).closest('li')
        const text = $(e.target).text()
        const value = self.data('value')

        const wrapper = $(e.target).closest('.dropdown-wrapper')

        wrapper.dropdown('select', value)
        wrapper.data('selected', value)
        wrapper.find('.dropdown--selected').removeClass('dropdown--selected')
        wrapper.find('.dropdown').removeClass('dropdown--open')

        $(e.target).closest('li').addClass('dropdown--selected')
        $(e.target).closest('.dropdown--item').find('>span').text(text)

        wrapper.trigger('change', [ value ])
    })

    $('.language').on('change', (_event, code) => {
        API.setLanguage(code, (resp) => {
            if(resp.success) {
                window.localStorage.locale = code
                location.reload()
            } else {
                alert(resp.error.message)
            }
        })
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

    $('.input--spiner .spiner-minus').click((e) => {
        const input = $(e.target).closest('.input--spiner').find('input')

        let val = Math.max(Number(input.val()) - 1, 1)

        input.val(val)
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
            self.removeClass('modal--open')
            return
        }

        if(self.hasClass('btn--close')) {
            modal.removeClass('modal--open')
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

    if(USER_INFO.userno) {
        alert('logged')
    }
})