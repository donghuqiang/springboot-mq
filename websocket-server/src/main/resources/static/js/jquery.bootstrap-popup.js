(function ($) {
    $.extend({
        showPopup: function (option) {
            var defaults = {
                width: 640,
                height: 0,
                title: " ",
                innerHTML: '',
                footerHTML: null,
                remote: null,
                remoteInnerHTML: false,
                id: 'zlPopup',
                overflow: 'auto',
                backdrop: 'static',
                modalClass: "",
                inlineStyle:"",//行内样式.可以设置距离上面的高度等.--谭海兵 2016.9.21
                onclosed: function () { },
                beforeclosed: function () { },
                onloaded: function () { }  //远程页面请求完毕执行的函数。
            };

            var opt = $.extend(defaults, option);
            var width = opt.width + 'px';
            var height = opt.height ? opt.height + 'px' : 'auto';
            var createHtml = function () {
                var html;
                if (opt.remoteInnerHTML) {
                    html = '<div class="modal" id="' + opt.id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>';
                }
                else {
                    html = '<div class="modal" id="' + opt.id + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">'
                            + '<div style="width:' + width + ';' + opt.inlineStyle + '" class="modal-dialog ' + opt.modalClass + '">'
                            + '<div class="modal-content"><div class="modal-header">'
                            + '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
                            + '<h5 class="modal-title" id="myModalLabel">' + opt.title + '</h5></div>'
                            + '<div class="modal-body" style="height:' + height + '; width:auto; overflow-y:' + opt.overflow + ';">' + (opt.innerHTML || '') + '</div>'
                            + (opt.footerHTML ? ('<div style="margin-top: 0;" class="modal-footer">' + opt.footerHTML + '</div>') : '')
                            + '</div></div></div>';
                }
                return html;
            };

            $('#' + opt.id).modal('hide');

            $('body').append(createHtml());
            $('#' + opt.id).on('hidden.bs.modal', function (e) {
                if (opt.beforeclosed && typeof opt.beforeclosed == 'function') {
                    opt.beforeclosed();
                }
                $('#' + opt.id).remove();
                if (opt.onclosed && typeof opt.onclosed == 'function') {
                    opt.onclosed();
                }
            });
            if (opt.remote) { // 加载远程页面
                var modalLoadId = opt.remoteInnerHTML ? opt.id  : opt.id + ' .modal-body';
                $('#' + modalLoadId).load(opt.remote, "", function () {
                    $('#' + opt.id).modal({
                        backdrop: opt.backdrop
                    });
                    if (opt.onloaded && typeof opt.onloaded == 'function') {
                        opt.onloaded();
                    }
                });
            } else {
                $('#' + opt.id).modal({
                    backdrop: opt.backdrop
                });
            }
        },
        hidePopup: function (fn, id) {  // 关闭弹出窗
            if (fn && typeof (fn) == 'function') {
                fn();
            }

            id = id || 'zlPopup';
            if ($('#' + id).length > 0) {
                $('#' + id).modal('hide');
            }
        }
    });
})(jQuery)