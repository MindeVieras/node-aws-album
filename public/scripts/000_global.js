// tinyMCE.baseURL = "/assets/deps/tinymce";

var ModalData;
var ModalList = [];
var Album = (function() {
    "use strict";
    return {
        makeModalTarget: function(id) {
            if (!id) {
                id = UUID.generate();
            }
            if (id[0] == '#') {
                id = id.substring(1);
            }
            $("#modaltemplate").clone().attr('id', id).insertAfter("#modaltemplate");
            return '#' + id;
        },
        populateModalDataFields: function(btn) {
            ModalData = JSON.parse(JSON.stringify($(btn).data()));
            delete ModalData.loading;
            delete ModalData.remote;
            delete ModalData.style;
            delete ModalData.target;
            delete ModalData.toggle;
            delete ModalData.size;
            delete ModalData.type;
            delete ModalData.function;
            delete ModalData.functiondelay;
        }
    }
})();

$(document).ready(function() {

    //Dropzone.autoDiscover = false;

    $(document.body).on('click', "[data-remote!=''][data-remote]", function(event) {
        event.preventDefault();
        var options = JSON.parse(JSON.stringify($(this).data()));
        Album.openModal(options, this);
    });
    $(document.body).on('click', "[data-function!=''][data-function]", function (event) {
        event.preventDefault();
        var btn = this;
        var functionName = $(this).data('function');
        var fn = getFunctionFromString(functionName);
        var sleep = 0;
        var info = $(this).data();
        for (k in info) {
            info[k] = $(this).attr('data-' + k);
        }
        if (typeof fn === 'function') {

            if ($(this).data('functionDelay')) {
                var sleep = parseInt($(this).data('functionDelay'));
            }

            setTimeout(function () {
                console.log('Executing function: ' + functionName + ' after delay of ' + sleep + ' milliseconds');
                fn(info, btn);
            }, sleep);
        } else {
            console.log('No such function: ' + functionName);
        }
    });

    $(document).on('show.bs.modal', '.modal', function() {
        var modal = this;
        var hash = modal.id;
        window.location.hash = hash;
        window.onhashchange = function() {
          if (!location.hash){
            $(modal).modal('hide');
          }
        }

        var zIndex = 1040 + (10 * $('.modal:visible').length);
        $(this).css('z-index', zIndex);
        setTimeout(function() {
            $('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
        }, 0);
    });

    $(document).on('hide.bs.modal', function() {
        var hash = this.id;
        history.pushState('', document.title, window.location.pathname);
    });

    $(document).on('hidden.bs.modal', function() {
        $(ModalList.pop()).remove();
    });

    //Album.initView();

    window.getFunctionFromString = function (string) {
        var scope = window;
        var scopeSplit = string.split('.');
        for (i = 0; i < scopeSplit.length - 1; i++) {
            scope = scope[scopeSplit[i]];
            if (scope == undefined) return;
        }
        return scope[scopeSplit[scopeSplit.length - 1]];
    };


});

// $.fn.serializeObject = function () {
//     var o = {};
//     var a = this.serializeArray();
//     $.each(a, function () {
//         if (o[this.name] !== undefined) {
//             if (!o[this.name].push) {
//                 o[this.name] = [o[this.name]];
//             }
//             o[this.name].push(this.value || '');
//         } else {
//             o[this.name] = this.value || '';
//         }
//     });
//     return o;
// };
