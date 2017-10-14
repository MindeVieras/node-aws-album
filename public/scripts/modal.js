
Album.openModal = function (opts, btn) {
    opts.ladda = typeof opts.ladda !== 'undefined' ? opts.ladda : 1;
    opts.size = typeof opts.size !== 'undefined' ? opts.size : 'normal';
    opts.ident = typeof opts.ident !== 'undefined' ? opts.ident : 'album-modal';
    opts.backgroundClass = typeof opts.backgroundClass !== 'undefined' ? opts.backgroundClass : '';
    opts.loaderHTML = typeof opts.loaderHTML !== 'undefined' ? opts.loaderHTML : '<p class="text-center"><i class="modalspinner fa fa-refresh fa-spin fa-5x"></i></p>';
    var target = Album.makeModalTarget(opts.ident);
    var backdrop = $('.modal-backdrop');

    ModalList.push(target);
    //console.log(target);
    $(target).addClass('modal-' + opts.size);
    backdrop.addClass('modal-' + opts.size);
    if (btn) {
        Album.populateModalDataFields($(btn));
    }

    $(target).find('.modal-content').empty().addClass(opts.backgroundClass).html(opts.loaderHTML);
    $(target).modal('show');

    // var l = opts.ladda ? Ladda.create(btn) : Album.dummyLadda.create();


    // l.start();
    $.ajax({
        type: "GET",
        url: opts.remote,
        data: ModalData,
        success: function (data) {
            $(target).find('.modal-content').html(data);
            Album.initView();
            //window.history.forward();
        },
        error: function () {
            $(target).modal('hide');
        }
    }).always(function () {
        // l.stop();
    });
};

Album.closeModal = function(refresh){
    target = ModalList[ModalList.length - 1];
    $(target).modal('hide');
    if (refresh === true) {
        location.reload();
    }
};

Album.closeAllModals = function(refresh){
    for (var i in ModalList) {
        $(ModalList[i]).modal('hide');
    }
    if (refresh === true) {
        location.reload();
    }
};

Album.scrollToTopOfModal = function() {
    target = ModalList[ModalList.length - 1];

    $(window).animate({ scrollTop: 0 });
    $(target).animate({ scrollTop: 0 });
};