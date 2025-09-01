let scrollWidth = (function () {
    let div = document.createElement('div');
    let scrollWidth;
    div.style.overflowY = 'scroll';
    div.style.width = '50px';
    div.style.height = '50px';
    document.body.append(div);
    scrollWidth = div.offsetWidth - div.clientWidth;
    div.remove();
    return scrollWidth;
}());

function TogglePopup(type) {
    if ( type === 'hide' ) {
        $('html').removeClass().css('padding-right', 0);
        $('.popup-wrap').css('padding-left', scrollWidth);
    } else {
        $('.popup').hide().filter(`.${type}`).show().parents('html').addClass(`popup ${type}`);
        $('html').css('padding-right', scrollWidth);
        $('.popup-wrap').css('padding-left', 0);
    }
}

$(() => {
    $('[data-popup]').click(function(e) {
        let $this = $(e.currentTarget),
            popup = $this.data('popup'),
            tariff = $this.data('tariff');
        if ( e.currentTarget === e.target || e.currentTarget.tagName == 'A' ) {
            $('input[name="tariff"]').val(tariff ? tariff : '');
            TogglePopup(popup);
            return false;
        }
    });

    $(window).scroll(e => {
        $('.header').toggleClass('blurred', e.currentTarget.scrollY >= 45);
        $('.top-btn').toggleClass('visible', e.currentTarget.scrollY >= 750);
    });

    $('input[name="phone"]').mask('+7 (999) 999-99-99');

    Fancybox.bind("[data-fancybox]");

    new Swiper('.cases__slider', {
        spaceBetween: 150,
        autoHeight: true,
        navigation: {
            prevEl: '.cases__slider-btn.l',
            nextEl: '.cases__slider-btn.r'
        }
    });

    new Swiper('.partner__slider', {
        spaceBetween: 30,
        autoHeight: true,
        navigation: {
            prevEl: '.partner__slider-btn.l',
            nextEl: '.partner__slider-btn.r'
        },
        slidesPerView: 2,
        breakpoints: {  
            330: {
                slidesPerView: 1,
            },
            767: {
                slidesPerView: 2,
            },
        },
    });

    new Swiper('.cost__slider', {
        spaceBetween: 20,
        slidesPerView: 'auto',
        navigation: {
            prevEl: '.cost__slider-btn.l',
            nextEl: '.cost__slider-btn.r'
        },
        breakpoints: {
            1310: {
                allowTouchMove: false
            }
        }
    });

    new Swiper('.reviews__slider', {
        spaceBetween: 20,
        slidesPerView: 'auto',
        navigation: {
            prevEl: '.reviews__slider-btn.l',
            nextEl: '.reviews__slider-btn.r'
        }
    });

    new Swiper('.contents__frags-slider', {
        spaceBetween: 20,
        navigation: {
            prevEl: '.contents__frags-btn.l',
            nextEl: '.contents__frags-btn.r'
        }
    });

    $('.contents__module').click(e => {
        let $this = $(e.currentTarget);
        $this.toggleClass('opened').siblings().removeClass('opened').find('.contents__module-text').slideUp();
        $this.find('.contents__module-text').slideToggle();
    });

    $('.faq__item').click(e => {
        let $this = $(e.currentTarget);
        $this.toggleClass('opened').siblings().removeClass('opened').find('.faq__item-text').slideUp();
        $this.find('.faq__item-text').slideToggle();
    });

    $('.header__menu-btn, .mob-menu__btn, .shadow, .mob-menu__link').click(() => $('.mob-menu').toggleClass('opened'));

    let player = $('.about__video-inner iframe')[0],
        playBtn = $('.about__video-play');
    playBtn.click(e => {
        let $this = $(e.currentTarget);
        $this.addClass('hidden');
        player.contentWindow.postMessage(JSON.stringify({type:'player:setCurrentTime', data:{time:0}}), '*');
        player.contentWindow.postMessage(JSON.stringify({type:'player:play', data:{}}), '*');
    });

    let playerPartner = $('.partner__video-inner iframe')[0],
        playPartnerBtn = $('.partner__video-play');
    playPartnerBtn.click(e => {
        let $this = $(e.currentTarget);
        $this.addClass('hidden');
        playerPartner.contentWindow.postMessage(JSON.stringify({type:'player:setCurrentTime', data:{time:0}}), '*');
        playerPartner.contentWindow.postMessage(JSON.stringify({type:'player:play', data:{}}), '*');
    });

    $('form').submit(e => {
        let formData = new FormData(e.currentTarget);
        $.ajax({
            method: 'POST',
            url: '/send.php',
            data: formData,
            processData: false,
            contentType: false,
            success: response => {
                TogglePopup('hide');
                setTimeout(() => TogglePopup('msg'), 750);
                setTimeout(() => TogglePopup('hide'), 2750);
                if ( JSON.parse(response).result.success ) {
                    $('.popup.msg .popup__title').html('<span>Заявка</span><br> отправлена!');
                    e.currentTarget.reset();
                } else
                    $('.popup.msg .popup__title').html('<span>Ошибка</span><br> отправки');
            }
        });
        return false;
    });

    $('.contents__frags-play').click(e => {
        let $this = $(e.currentTarget);
        $this.fadeOut().prev()[0].play();
    });

    $('.contents__frags-item video').on('click ended', e => {
        let $this = $(e.currentTarget);
        e.currentTarget.load();
        $this.siblings('.contents__frags-play').fadeIn();
    })

    $('.reviews__item-play').click(e => {
        let $this = $(e.currentTarget);
        $this.fadeOut().prev()[0].play();
        $('.reviews__item').not($this.parent()).find('video').trigger('click');
    });

    $('.reviews__item video')
        .click(e => {
            let $this = $(e.currentTarget);
            e.currentTarget.pause();
            e.currentTarget.currentTime = 0;
            $this.siblings('.reviews__item-play').fadeIn();
        })
        .on('ended', e => {
            let $this = $(e.currentTarget);
            e.currentTarget.currentTime = 0;
            $this.siblings('.reviews__item-play').fadeIn();
        })

    $('.form-promo__link').click(e => {
        let $this = $(e.currentTarget);
        $this.parent().addClass('visible');
    });

    $('.form-promo__btn').click(e => {
        let $this = $(e.currentTarget),
            code = $this.prev().val();
        $.ajax({
            type: 'POST',
            url: '/promo.php',
            dataType: 'json',
            data: {
                code: code
            },
            success: r => $('.form-promo').toggleClass('success', r.success === 'true')
        });
    });

    const targetDate = new Date(2025, 7, 15, 23, 59, 59);

    function updateCountdown() {
        const now = new Date();
        const diff = targetDate - now;

        if (diff <= 0) {
            $('.cost__deadline-time').text("00:00:00");
            $('.cost__deadline, .cost__item-price--new').hide();
            $('.cost__item-price--old').removeClass('cost__item-price--old');
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const formattedTime =
            String(hours).padStart(2, '0') + ":" +
            String(minutes).padStart(2, '0') + ":" +
            String(seconds).padStart(2, '0');

        $('.cost__deadline-time').text(formattedTime);
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
});