$(function() {
    const modalStack = []

    $('.tabs').on('click', 'li', (e) => {
        const btn = $(e.target).closest('li')
        const tab = btn.closest('.tabs')

        tab.find('.tab--active').removeClass('tab--active')
        btn.addClass('tab--active')

        $('.tab-content').hide()
        console.log(btn.attr('data-target'))
        $(btn.data('target')).show()
    })

    $(document).on('click', '[data-toggle=modal]', (e) => {
        const anchor = $(e.target)

        const modal = anchor.attr('data-target')

        if($(modal).hasClass('modal--open')) {
            modalStack.push(modal)
        } else {
            modalStack.push(modal)

        }
        console.log($(modal))

        $(modal).toggleClass('modal--open')
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