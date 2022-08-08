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

$(function() {
    const modalStack = []


    $.alert = (msg) => {

    }

    $.fn.modal = (action) => {

        const modal = $(this[0])

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
                    modalStack.push(modal)
                } else {
                    modalStack.pop(modal)
                }
        
                break
        }


        return this
    }
    $('test').modal()


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

        if($(modal).hasClass('modal--open')) {
            modalStack.push(modal)
        } else {
            modalStack.push(modal)
        }

        $(modal).toggleClass('modal--open')

        return false
    })

    $('.accordion .accordion--header').click((e) => {
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
        console.log(e.key)
        console.log(modalStack)
        if(e.key === 'Escape' && modalStack.length) {
            const lastModal = modalStack.pop()

            $(lastModal).removeClass('modal--open')
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

    $.fn.dropdown = (action) => {
        switch(action) {
            case 'select':
                break;
            case 'selected':
                return $(this).data('selected')
        }

        return this
    }

    $('.dropdown-wrapper').dropdown('selected')
    $('.dropdown-wrapper').on('click', '.dropdown--item > ul > li', (e) => {
        const text = $(e.target).text()

        const wrapper = $(e.target).closest('.dropdown-wrapper')
        wrapper.data('selected', text)
        wrapper.find('.dropdown--selected').removeClass('dropdown--selected')
        wrapper.find('.dropdown').text(text).removeClass('dropdown--open')
        $(e.target).closest('li').addClass('dropdown--selected')
        $(e.target).closest('.dropdown--item').find('>span').text(text)

        wrapper.trigger('change', [ text ])
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
})