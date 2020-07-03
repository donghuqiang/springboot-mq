//设置皮肤默认路径
try{
    if(styleUrl){}
}catch(e){
    styleUrl = "../../";
}

jQuery(window).load(function () {

    "use strict";

    // Page Preloader
    jQuery('#preloader').delay(350).fadeOut(function () {
        jQuery('body').delay(350).css({'overflow': 'visible'});
    });
});

jQuery(document).ready(function () {
    //加载头部导航
    if(styleUrl == "../../"){
        /*
         判断非首页时加载外部导航页面，范例首页因为静态资源问题已写死代码，不需要加载，实际开发过程中全为动态加载，开发人员请自行修改
         无分栏页面结构跟其他页面不同，因此也不动态加载，开发人员可根据项目情况自行修改
         */
        $(".headerbar").load("../header/header.html");
    }else if(styleUrl == "no"){
        styleUrl = "../../"
    }

    "use strict";

    // Toggle Left Menu
    jQuery('.leftpanel .nav-parent > a').live('click', function () {

        var parent = jQuery(this).parent();
        var sub = parent.find('> ul');

        // Dropdown works only when leftpanel is not collapsed
        if (!jQuery('body').hasClass('leftpanel-collapsed')) {
            if (sub.is(':visible')) {
                sub.slideUp(200, function () {
                    parent.removeClass('nav-active');
                    jQuery('.mainpanel').css({height: ''});
                    adjustmainpanelheight();
                });
            } else {
                closeVisibleSubMenu();
                parent.addClass('nav-active');
                sub.slideDown(200, function () {
                    adjustmainpanelheight();
                });
            }
        }
        return false;
    });

    function closeVisibleSubMenu() {
        jQuery('.leftpanel .nav-parent').each(function () {
            var t = jQuery(this);
            if (t.hasClass('nav-active')) {
                t.find('> ul').slideUp(200, function () {
                    t.removeClass('nav-active');
                });
            }
        });
    }

    function adjustmainpanelheight() {
        // Adjust mainpanel height
        var docHeight = jQuery(document).height();
        if (docHeight > jQuery('.mainpanel').height())
            jQuery('.mainpanel').height(docHeight);
    }

    adjustmainpanelheight();


    // Tooltip
    jQuery('.tooltips').tooltip({container: 'body'});

    // Popover
    jQuery('.popovers').popover();

    // Close Button in Panels
    jQuery('.panel .panel-close').click(function () {
        jQuery(this).closest('.panel').fadeOut(200);
        return false;
    });


    var scColor1 = '#428BCA';
    if (jQuery.cookie('change-skin') && jQuery.cookie('change-skin') == 'bluenav') {
        scColor1 = '#fff';
    }

    // Minimize Button in Panels
    jQuery('.minimize').click(function () {
        var t = jQuery(this);
        var p = t.closest('.panel');
        if (!jQuery(this).hasClass('maximize')) {
            p.find('.panel-body, .panel-footer').slideUp(200);
            t.addClass('maximize');
            t.html('+');
        } else {
            p.find('.panel-body, .panel-footer').slideDown(200);
            t.removeClass('maximize');
            t.html('−');
        }
        return false;
    });


    // Add class everytime a mouse pointer hover over it
    jQuery('.nav-bracket > li').hover(function () {
        jQuery(this).addClass('nav-hover');
    }, function () {
        jQuery(this).removeClass('nav-hover');
    });

    reposition_topnav();
    reposition_searchform();

    jQuery(window).resize(function () {

        if (jQuery('body').css('position') == 'relative') {

            jQuery('body').removeClass('leftpanel-collapsed chat-view');

        } else {

            jQuery('body').removeClass('chat-relative-view');
            jQuery('body').css({left: '', marginRight: ''});
        }


        reposition_searchform();
        reposition_topnav();

    });


    /* This function will reposition search form to the left panel when viewed
     * in screens smaller than 767px and will return to top when viewed higher
     * than 767px
     */
    function reposition_searchform() {
        if (jQuery('.searchform').css('position') == 'relative') {
            jQuery('.searchform').insertBefore('.leftpanelinner .userlogged');
        } else {
            jQuery('.searchform').insertBefore('.header-right');
        }
    }


    /* This function allows top navigation menu to move to left navigation menu
     * when viewed in screens lower than 1024px and will move it back when viewed
     * higher than 1024px
     */
    function reposition_topnav() {
        if (jQuery('.nav-horizontal').length > 0) {

            // top navigation move to left nav
            // .nav-horizontal will set position to relative when viewed in screen below 1024
            if (jQuery('.nav-horizontal').css('position') == 'relative') {

                if (jQuery('.leftpanel .nav-bracket').length == 2) {
                    jQuery('.nav-horizontal').insertAfter('.nav-bracket:eq(1)');
                } else {
                    // only add to bottom if .nav-horizontal is not yet in the left panel
                    if (jQuery('.leftpanel .nav-horizontal').length == 0)
                        jQuery('.nav-horizontal').appendTo('.leftpanelinner');
                }

                jQuery('.nav-horizontal').css({display: 'block'})
                    .addClass('nav-pills nav-stacked nav-bracket');

                jQuery('.nav-horizontal .children').removeClass('dropdown-menu');
                jQuery('.nav-horizontal > li').each(function () {

                    jQuery(this).removeClass('open');
                    jQuery(this).find('a').removeAttr('class');
                    jQuery(this).find('a').removeAttr('data-toggle');

                });

                if (jQuery('.nav-horizontal li:last-child').has('form')) {
                    jQuery('.nav-horizontal li:last-child form').addClass('searchform').appendTo('.topnav');
                    jQuery('.nav-horizontal li:last-child').hide();
                }

            } else {
                // move nav only when .nav-horizontal is currently from leftpanel
                // that is viewed from screen size above 1024
                if (jQuery('.leftpanel .nav-horizontal').length > 0) {

                    jQuery('.nav-horizontal').removeClass('nav-pills nav-stacked nav-bracket')
                        .appendTo('.topnav');
                    jQuery('.nav-horizontal .children').addClass('dropdown-menu').removeAttr('style');
                    jQuery('.nav-horizontal li:last-child').show();
                    jQuery('.searchform').removeClass('searchform').appendTo('.nav-horizontal li:last-child .dropdown-menu');
                    jQuery('.nav-horizontal > li > a').each(function () {

                        jQuery(this).parent().removeClass('nav-active');

                        if (jQuery(this).parent().find('.dropdown-menu').length > 0) {
                            jQuery(this).attr('class', 'dropdown-toggle');
                            jQuery(this).attr('data-toggle', 'dropdown');
                        }

                    });
                }

            }

        }
    }


    // Sticky Header
    if (jQuery.cookie('sticky-header'))
        jQuery('body').addClass('stickyheader');

    // Sticky Left Panel
    if (jQuery.cookie('sticky-leftpanel')) {
        jQuery('body').addClass('stickyheader');
        jQuery('.leftpanel').addClass('sticky-leftpanel');
    }

    // Left Panel Collapsed
    if (jQuery.cookie('leftpanel-collapsed')) {
        jQuery('body').addClass('leftpanel-collapsed');
        //jQuery('.menutoggle').addClass('menu-collapsed');
    }

    // Changing Skin
    var c = jQuery.cookie('change-skin');
    if(c==null){
        c = "bluenav";
    }
    var cssSkin = styleUrl + 'static/css/style.' + c + '.css';
    if (jQuery('body').css('direction') == 'rtl') {
        cssSkin = styleUrl + 'static/css/style.' + c + '.css';
        jQuery('html').addClass('rtl');
    }
    if (c) {
        //jQuery('head').append('<link id="skinswitch" rel="stylesheet" href="' + cssSkin + '" />');
    }
    // Changing Font
    var fnt = jQuery.cookie('change-font');
    if (fnt) {
        //jQuery('head').append('<link id="fontswitch" rel="stylesheet" href="css/font.' + fnt + '.css" />');
    }

    // Check if leftpanel is collapsed
    if (jQuery('body').hasClass('leftpanel-collapsed'))
        jQuery('.nav-bracket .children').css({display: ''});


    // Handles form inside of dropdown
    jQuery('.dropdown-menu').find('form').click(function (e) {
        e.stopPropagation();
    });


    // This is not actually changing color of btn-primary
    // This is like you are changing it to use btn-orange instead of btn-primary
    // This is for demo purposes only
    var c = jQuery.cookie('change-skin');
    if (c && c == 'greyjoy') {
        $('.btn-primary').removeClass('btn-primary').addClass('btn-orange');
        $('.rdio-primary').addClass('rdio-default').removeClass('rdio-primary');
        $('.text-primary').removeClass('text-primary').addClass('text-orange');
    }

    /*
     * 左侧菜单高亮方法
     * ze
     */
    $('ul.index-nav a').on('click', function (e) {
        globe.ze.destroy.fn();
        var $this = $(this), $liParent = $("ul.index-nav li.nav-parent");
        if(!$this.next("ul.children").length){
            _removeClass()
            $this.parent().addClass("active");
        }
        if($this.closest("ul.children").length){
            _removeClass();
            $("ul.index-nav ul.children li").siblings().removeClass("active");
            $this.closest(".nav-parent").addClass("active");
            $this.parent().addClass("active");
        }
        function _removeClass(){
            $liParent.removeClass("active nav-active");
        }
        //加载页面
        var ops = globe.ze.parseOptions(this);
        if (!ops.url) return;
        var file = ops.url.replace(/.html/, "") + '/';
        globe.ze.panelRef('#center', {
            url: file + ops.url,
            data: {},
            fn: function (h) {
                $('.preloader').delay(350).fadeOut(function () {
                    $('body').delay(350).css({'overflow': 'visible'});
                });
            }
        });
    });

    /*
     * 首页监听事件
     * ze
     */
    $("#index-welcome").on("click",function () {
        globe.ze.destroy.fn();
        globe.ze.panelRef('#center', {
            url: "index_welcome.html",
            data: {},
            fn: function (h) {
                $('.preloader').delay(350).fadeOut(function () {
                    $('body').delay(350).css({'overflow': 'visible'});
                });
            }
        });
    });
    $("#index-welcome").trigger('click');

    /*
     * 系统菜单初始化
     * ze
     */
    /*var curMenu = null, zTree_Menu = null;
    var setting = {
        view: {
            showLine: false,
            selectedMulti: false,
            dblClickExpand: false
        },
        data: {
            simpleData: {
                enable: true
            }
        },
        callback: {
            beforeClick: indexTreebeforeClick,
            onClick: indexTreeClick
        }
    };
    var zNodes = [
        {
            id: "1",
            name: "工作任务",
            attributes: {
                url: ""
            },
            children: [
                {
                    id: "11",
                    name: "个人工作任务",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "12",
                    name: "中心年度工作任务表",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "13",
                    name: "工作动态",
                    attributes: {
                        url: "work_status/work_status.html"
                    }
                },
                {
                    id: "14",
                    name: "“一张网”日志查看",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "15",
                    name: "“12315”日志查看",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "16",
                    name: "“商标”日志查看",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "17",
                    name: "“网监”日志查看",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "18",
                    name: "工商信息化动态",
                    attributes: {
                        url: ""
                    }
                }
            ]
        },
        {
            id: "2",
            name: "规章制度",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "3",
            name: "党建工作",
            attributes: {
                url: ""
            },
            children: [
                {
                    id: "31",
                    name: "文件·材料", open: true,
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "32",
                    name: "交流·活动",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "33",
                    name: "红板报(理想信念)",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "34",
                    name: "红板报(感人瞬间)", open: true,
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "35",
                    name: "红板报(专题互动)",
                    attributes: {
                        url: ""
                    }
                },
                {
                    id: "36",
                    name: "红板报(文章赏读)",
                    attributes: {
                        url: ""
                    }
                }
            ]
        },
        {
            id: "4",
            name: "信息公示",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "5",
            name: "会议纪要",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "6",
            name: "大事记",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "7",
            name: "财务报销",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "8",
            name: "公共活动室使用",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "9",
            name: "办公用品管理",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "10",
            name: "考勤管理",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "11",
            name: "人事管理",
            attributes: {
                url: ""
            },
            isParent: true
        },
        {
            id: "12",
            name: "资料共享",
            attributes: {
                url: ""
            },
            isParent: true
        }
    ];
    //节点初始化
    function indexTreebeforeClick(treeId, node) {
        var $aObj = $("#" + node.tId + "_a");
        if (node.isParent) {
            if (node.level === 0) {
                var pNode = curMenu;
                if (pNode !== node) {
                    var a = $("#" + pNode.tId + "_a");
                    a.removeClass("active");
                    zTree_Menu.expandNode(pNode, false);
                }
                $aObj.addClass("active");
                zTree_Menu.expandNode(node, true);
                curMenu = node;
            } else {
                zTree_Menu.expandNode(node);
            }
        }
    }
    //节点跳转URL
    function indexTreeClick(e, treeId, node) {
        globe.ze.destroy.fn();
        //加载页面
        if (!node.attributes.url) return;
        globe.ze.panelRef('#center', {
            url: node.attributes.url,
            data: {id: node.id},
            fn: function (h) {
                $('.preloader').delay(350).fadeOut(function () {
                    $('body').delay(350).css({'overflow': 'visible'});
                });
            }
        });
    }
    //初始化树
    $.fn.zTree.init($("#index-tree"), setting, zNodes);
    zTree_Menu = $.fn.zTree.getZTreeObj("index-tree");
    curMenu = zTree_Menu.getNodes()[0];*/
});

/* Ui jqxGrid
 * 设备全局主题样式
 * ze
 */
$.jqx = $.jqx || {};
$.jqx.theme = 'bootstrap';

/* Ui dataTable
 * 显示中文语言，所有表格引用
 * ze
 */
var dataTable_language = {
    "processing": "玩命加载中...",
    "lengthMenu": "显示 _MENU_ 项结果",
    "zeroRecords": "没有匹配结果",
    "info": "第_START_至_END_项，共_TOTAL_项",
    "infoEmpty": "第0至0项，共0项",
    "infoFiltered": "(由 _MAX_ 项结果过滤)",
    "infoPostFix": "",
    "search": "搜索:",
    "url": "",
    "paginate": {
        "first":    "首页",
        "previous": "上页",
        "next":     "下页",
        "last":     "末页"
    }
};
/* 表单动态赋值
 * 通过json对象动态对表单项进行赋值操作
 * mag
 */
$.fn.extend({
    initForm:function(options){
        //默认参数
        var defaults = {
            jsonValue:options,
            isDebug:false   //是否需要调试，这个用于开发阶段，发布阶段请将设置为false，默认为false,true将会把name value打印出来
        }
        //设置参数
        var setting = defaults;
        var form = this;
        jsonValue = setting.jsonValue;
        //如果传入的json字符串，将转为json对象
        if($.type(setting.jsonValue) === "string"){
            jsonValue = $.parseJSON(jsonValue);
        }
        //如果传入的json对象为空，则不做任何操作
        if(!$.isEmptyObject(jsonValue)){
            var debugInfo = "";
            $.each(jsonValue,function(key,value){
                //是否开启调试，开启将会把name value打印出来
                if(setting.isDebug){
                    console.log("name:"+key+"; value:"+value);
                    //debugInfo += "name:"+key+"; value:"+value+" || ";
                }
                var formField = form.find("[name='"+key+"']");
                if($.type(formField[0]) === "undefined"){
                    if(setting.isDebug){
                        console.log("can not find name:["+key+"] in form!!!");    //没找到指定name的表单
                    }
                } else {
                    var fieldTagName = formField[0].tagName.toLowerCase();
                    if(fieldTagName == "input"){
                        if(formField.attr("type")== "radio" || formField.attr("type")== "checkbox") {
                            formField.each(function () {
                                $(this).removeAttr("checked");
                                if (Object.prototype.toString.apply(value) == '[object Array]') {//是复选框，并且是数组
                                    for (var i = 0; i < value.length; i++) {
                                        if ($(this).val() == value[i])
                                            $(this).attr("checked", "checked");
                                    }
                                } else {
                                    if ($(this).val() == value)
                                        $(this).attr("checked", "checked");
                                }
                            });
                        }else {
                            formField.val(value);
                        }

                    } else if(fieldTagName == "select"){
                        //do something special
                        formField.val(value);
                    } else if(fieldTagName == "textarea"){
                        //do something special
                        formField.val(value);
                    } else {
                        formField.val(value);
                    }

                }
            })
            if(setting.isDebug){
                console.log(debugInfo);
            }
        }
        return form;//返回对象，提供链式操作
    }
});


