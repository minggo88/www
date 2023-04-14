jQuery(function () { 

    // let page = window.location.hash.replace('#','')

    // 해시이동 중지
    //230309 로고 a링크문제로 삭제
    /*$('section a').on('click', function(){
        return false;
    });*/

    let USER_INFO = {}
    API.getMyInfo((resp) => {
        if(resp.success) {
            const payload = resp.payload

            USER_INFO = {
                ...USER_INFO,
                userno: payload.userno,
                userid: payload.userid,
                phone: payload.phone,
                mobile: payload.mobile,
                bool_email: payload.bool_email,
                bool_sms: payload.bool_sms,
                regdate: payload.regdate,
                bank_name: payload.bank_name,
                bank_account: payload.bank_account,
                bank_owner: payload.bank_owner,
            }

            if(USER_INFO.userno) {
                // $('.nav--side .btn--login').hide()
                // $('.profile').show()
                // $('.wallet').show()
                // $('.profile .dropdown').text(USER_INFO.userid)
            }
        }
    })

    const show_section = function(page){
        $('#inquiry_write').hide();
        $('#inquiry_detail').hide();
        $('#inquiry').hide();

        page = page=='list' ? '' : page;
        page = page ? '_'+page : '';
        $('#inquiry'+page).show();
    }

    let selected_item = null;

    let pagination = {
        point: 0,
    }
    let currentPage = 1
    let totalPage = 1
    const pageCount = 10
    const fetchList = (page = 1) => {
        $('.board--list').addClass('loading')
        API.getM2MList(page, (resp) => {
            $('.board--list').removeClass('loading')
            // console.log(resp)
            if(resp.success && resp?.payload?.data && resp?.payload?.data?.length>0) {
                $('.board--list tbody').empty()
                $('.notification--list').empty()
                
                $('.inquiry--body tbody tr td').empty()
                $('.inquiry--reply tbody tr td').empty()
                let no = resp.payload.total - ((page - 1)*pageCount);
                console.log(pageCount)
                console.log(no)
                resp.payload.data.map((item) => {

                    // 상세보기버튼
                    const view_post = function(){
                        console.log(item)
                        selected_item = item;
                        show_section('detail');
                        $("#pcTitle").html(`${item.subject}`);
                        $("#pcRgdate").html(item.regdate?date('Y-m-d H:i', item.regdate):'')
                        $("#pcContents").html(`${item.contents}`);
                        $("#pcRplDate").html(item.rpldate?date('Y-m-d H:i', item.rpldate):'')
                        $("#pcRplcontents").html(`${item.rplcontents}`);
                        
                        $("#mTitle").html(`${item.subject}`);
                        $("#mauthor").html(`${item.author}`);
                        $("#mRgdate").html(item.regdate?date('Y-m-d', item.regdate):'')
                        $("#mContents").html(`${item.contents}`);
                        $("#mRplDate").html(item.rpldate?date('Y-m-d H:i', item.rpldate):'')
                        $("#mRplcontents").html(`${item.rplcontents}`);

                        if(item?.rplcontents) {
                            $('[name="btn-modify"]').attr('disabled',true).hide();
                        } else {
                            $('[name="btn-modify"]').attr('disabled',false).show();
                        }
                    }
                    // 수정하기 버튼
                    const edit_post = function(){
                        console.log(item.contents);
                        $('#inquiry_write [name=idx]').val(item.idx)
                        $('#inquiry_write [name=subject]').val(item.subject)
                        $('#inquiry_write [name=contents]').val(item.contents)
                        show_section('write');
                        return false;
                    }

                    // PC 화면 용

                    const tr = $('<tr>')
                    const inquiry = $("#inquiry tbody tr")
                    const inquiryDetail = $("#inquiry_detail .inquiry--body tbody tr")
                    const icon = ''
                    const regDate = new Date(parseInt(item.regdate) * 1000)
                    const regDate_ymd = date('Y-m-d', item.regdate);
                    const regDate_ymdhi = date('Y-m-d H:i', item.regdate);
                    const rplDate = new Date(parseInt(item.rpldate) * 1000)
                    const rplDate_str = date('Y-m-d H:i', item.rpldate);
                    tr.append(`<td>${no}</td>`)

                    const v_btn = '<a data-idx="'+item.idx+'">'+item.subject+'</a>';
                    let aLink = $('<td>'+v_btn+'</td>').on('click', view_post);
                    tr.append(aLink);

                    let status_class = ''
                    let status_str = ''
                    if( `${item.rplcontents}` !== "" &&  `${item.rpldate}` !== "" && `${item.rpldate}` !== "0"){
                            status_class = "text-red"
                            status_str = __("답변완료")
                    }else{
                        status_class = "text--gray005"
                        status_str = __("답변대기중")
                    }

                    tr.append(`<td class="${status_class}">${status_str}</td>`);
                    tr.append(`<td>${regDate_ymd}</td>`);
                    
                    const m_btn = item?.rplcontents ? '' : '<a data-idx="'+item.idx+'" class="btn btn--gray btn--rounded btn--modify">'+__('수정하기')+'</a>';
                    const eLink = $('<td>'+m_btn+'</td>').on('click', edit_post);
                    tr.append(eLink);
                    tr.appendTo('.board--list tbody')

                    // 모바일 화면 용

                    const $li = $('<li>')
                    const $div = $('<div class="notification--header"></div>');
                    const $title = $(`<div class="number">[ <span>${no}</span>] </div>`)
                    let aLink_m = $('<span>'+v_btn+'</span>').on('click', view_post);
                    $title.append(aLink_m);
                    $div.append($title)
                        .append(`<div class="date"><p class="day" style="padding-right:20px">${regDate_ymdhi}</p><p class="${status_class}">${status_str}</p></div>`)
                    $li.append($div)
                    const eLink_m = $('<div class="notification--content">'+m_btn+'</div>').on('click', edit_post);
                    $li
                    .append(eLink_m)
                    .appendTo('.notification--list')

                    no--;
                })
                    
                // $('.board--pagination > ul').empty()
                pagination.point = 0
                if(page > 1) {
                    $('<li>').addClass('pagination--prev').append(`<a href="#${page}-${page - 1}">이전 페이지</a>`).appendTo('.board--pagination > ul')
                }

                totalPage = Math.ceil(resp.total / 10)
                while(pagination.point < pageCount && currentPage + pagination.point <= totalPage) {
                    const page = currentPage + pagination.point
                    pagination.point++
                    $('<li>').append(`<a href="#${page}-${page}">${page}</a>`).appendTo('.board--pagination > ul')
                }
                if(page < totalPage) {
                    $('<li>').addClass('pagination--next').append(`<a href="#${page}-${page + 1}">다음 페이지</a>`).appendTo('.board--pagination > ul')
                }
                    if(!resp.payload.total) {
                    $('<tr>').addClass('board--empty').append('<td colspan="5">문의 내용이 없습니다</td>').appendTo('.board--list tbody')
                }
            } else {
                // alert(resp.error.message)

                $('.board--search').hide();
                $('.board--empty').show();

            }
        })
    }
    fetchList(currentPage)
    $('.board--pagination').on('click', 'a', (e) => {
        e.preventDefault()
        const page = $(e.target).attr('href').replaceAll(/#page-/g, '')
        fetchList(page)
        return false
    })

    // 새 문의하기
    $('[name="btn-write"]').on('click', function(e){
        if(!USER_INFO || !USER_INFO.userno) {
            e.preventDefault()
            alert(__('로그인 해주세요.'));
            return false;
        } 
        $('#inquiry_write [name=idx]').val('')
        $('#inquiry_write [name=subject]').val('')
        $('#inquiry_write [name=contents]').val('')
        show_section('write');
    })
    // 수정하기
    $('[name="btn-modify"]').on('click', function(e){
        if(!USER_INFO || !USER_INFO.userno) {
            e.preventDefault()
            alert(__('로그인 해주세요.'));
            return false;
        } 
        if(selected_item?.rplcontents) {
            return false;
        }
        $('#inquiry_write [name=idx]').val(selected_item?.idx||'')
        $('#inquiry_write [name=subject]').val(selected_item?.subject||'')
        $('#inquiry_write [name=contents]').val(selected_item?.contents||'')
        show_section('write');
    })

    // 목록 이동 버튼
    $('[name=btn_list]').on('click',function(){
        show_section('list');
        return false;
    })

    // 글 쓰기/수정
    $('.board--write').on('submit', (e) => {
        e.preventDefault()
        if(!USER_INFO || !USER_INFO.userno) {
            alert(__('로그인 해주세요.'));
            return false;
        } 
        const subject = $.trim($('#subject').val());
        if(!subject) {
            alert(__('제목을 입력하세요'));
            return false;
        }
        const contents = $.trim($('#contents').val());
        if(!contents) {
            alert(__('문의내용을 입력하세요'));
            return false;
        }
        API.putM2M(subject, contents, $('#idx').val(), (resp) => {
            if(resp?.success) {
                location.href = 'inquiry.html'
            }
            else {
                msg = resp?.error?.message || __('등록하지 못했습니다.')
                alert(msg)
            }
        })
        return false
    })

    // 글쓰기, 글 수정, 글 보기에서 백버튼은 목록으로 이동
    // $('.navigation--back').click(() => {
    // 	window.history.back()
    // })
    console.log('----------2-------------');
    $('.navigation--back') // , '#inquiry_detail, #inquiry_write'
    .off('click')
    .on('click', function(){
        show_section('list');
        return false;
    })

})
