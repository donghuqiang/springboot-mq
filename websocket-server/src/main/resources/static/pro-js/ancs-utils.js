/**
 * Created by ancs - zhaoen
 * Date: 2016/5/16
 * Time: 16:57
 */

/**
 * Ajax默认属性
 */
$.ajaxSetup({
    cache: false
});

/**
 *  全局对象
 */
var globe = $.extend({}, globe);

/**
 * 自定义命名空间
 * @author zhaoen
 * @reliant jQuery
 */
globe.namespace = function () {
    var i = 0, j = 0, arr, o;
    for (j; j < arguments.length; j++) {
        arr = arguments[j].split('.');
        o = globe;
        for (i = arr[0] == 'globe' ? 1 : 0; i < arr.length; i++) {
            o[arr[i]] = o[arr[i]] || {};
            o = o[arr[i]];
        }
    }
    return globe;
};

/**
 *  申明ze的全局对象
 *  @author zhaoen
 */
globe.namespace('ze.dataGrid', 'ze.message', 'ze.destroy', 'pages','ze.form');

/**
 *  记录销毁组件对象的数据
 *  @author zhaoen
 */
globe.ze.destroy.plusObj = [];

/**
 * jquery扩展，将form表单序列化成对象object
 * @author mag
 * @reliant jQuery
 */
$.fn.serializeObject=function(){
    var obj=new Object();
    $.each(this.serializeArray(),function(index,param){
        if(!(param.name in obj)){
            obj[param.name]=param.value;
        }
    });
    return obj;
};

/**
 * 刷新面板
 * @author zhaoen
 * @reliant jQuery
 * @param {string or target}
 * @param {object}
 */
globe.ze.panelRef = function (target, options) {
    var opts = $.extend({
        url: '',
        data: {},
        fn: function () {
        }
    }, options);
    var $target = jQuery.type(target) ? $(target) : target;
    $target.load(opts.url, opts.data, opts.fn);
};

/**
 * 销毁组件
 * @author zhaoen
 * @reliant jQuery
 * @param {object}
 */
globe.ze.destroy.fn = function (obj) {
    var arr = obj ? obj : globe.ze.destroy.plusObj;
    //查重
    var $b = [];
    var tem = arr;
    var len = tem.length;
    var i = 0;
    var arr_test = [];
    for (; i < len; i++) {
        var t = tem[i];
        if (arr_test.indexOf(t['jqObj']) == -1) {
            arr_test.push(t['jqObj']);
            $b.push(t);
        }

    }
    arr = $b;

    if (!arr.length) return;
    if (obj) {//自定义删除指定对象
        $.each(arr, function (i, n) {
            var golbeArr = globe.ze.destroy.plusObj;
            _destroy(n['jqObj'], n['type']);
            //删除全局变量里的指定的对象
            $.each(golbeArr, function (x, y) {
                if (y['jqObj'] == n['jqObj']) {
                    golbeArr.splice(x, 1);
                    return false;
                }
            });
        });
    } else {//删除全局对象
        $.each(arr, function (i, n) {
            var length_arr = arr.length - 1;
            _destroy(n['jqObj'], n['type']);
            if (length_arr == 0) {
                globe.ze.destroy.plusObj.length = 0;
                return;
            } else if (length_arr == i) {
                globe.ze.destroy.plusObj.length = 0;
                return;
            }
        });
    }
    function _destroy(obj, type) {
        switch (type) {
            case "zTree":
                $.fn.zTree.getZTreeObj(obj).destroy();
                $("#" + obj).parents("div.hasTreeList").remove();
                break
            case "jqxGrid":
                //$(obj).jqxGrid('destroy');
                break
            default:
                return;
        }
    }
};

/**
 * 自定义属性
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 */
globe.ze.parseOptions = function (target) {
    var t = $(target);
    var options = {};
    var s = $.trim(t.attr('data-options'));
    if (s) {
        if (s.substring(0, 1) != '{') {
            s = '{' + s + '}';
        }
        options = (new Function('return ' + s))();
    }
    return options;
};


/**
 * 消息窗口
 * @author zhaoen
 * @reliant jQuery
 * @param {object}
 * 一共四种消息：success、info、warning、danger
 */
globe.ze.message.alert = function (type, str) {
    var ops = {
        type: type ? type : 'success',
        message: str ? str : ''
    };
    var modal = '<div class="modal fade" tabindex="-1" role="dialog" data-backdrop="static"><div class="modal-dialog modal-sm"><div class="modal-content"><div class="alert alert-' + ops.type + '" style="line-height: 26px;margin: 0;"><span class="ancs-message ancs-message-' + ops.type + '-icon"></span>' + ops.message + '<div style="text-align: center;margin-top: 10px;"><a aria-label="Close" data-dismiss="modal" class="btn btn-xs btn-default" href="javascript:void(0);">关闭</a></div></div></div></div></div>';
    $(modal).modal().on('hide.bs.modal', function (e) {
        $(this).remove();
    });
};
/**
 * 消息确认窗口
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 * @param {function}
 */
globe.ze.message.confirm = function (str, fn) {
    var ops = {
        message: str,
        fn: function () {
            $modal.modal('hide');
            if (fn) {
                fn(true);
                return false;
            }
        }
    }
    var $modal = $('<div class="modal fade" tabindex="-1" role="dialog" data-backdrop="static"/>');
    var modalDialog = '<div class="modal-dialog modal-sm"><div class="modal-content"><div class="alert alert-info" style="line-height: 26px;"><span class="ancs-message ancs-message-question-icon"></span>' + ops.message + '<div class="bt" style="text-align: center;margin-top: 10px;"><a aria-label="Close" data-dismiss="modal" class="btn btn-xs btn-default" href="javascript:void(0);">关闭</a></div></div></div></div>';
    $modal.append(modalDialog);
    var btOk = $('<a class="btn btn-xs btn-default mr10" href="javascript:void(0);">确定</a>').bind('click', ops.fn);
    $modal.find('div.bt').prepend(btOk);
    $modal.modal().on('hide.bs.modal', function (e) {
        $(this).remove();
    });
};
/**
 * 创建模态窗口
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 * @param {function}
 */
/*
 globe.ze.model = function (options) {
 var opts = $.extend({
 url: '',
 data: {},
 width: 800,
 fn: function () {},
 onClose: function(){
 $(this).remove();
 }
 }, options);
 var $modal = $('<div class="modal fade" tabindex="-1" role="dialog" data-backdrop="static"><div class="modal-dialog" style="width:' + opts.width + 'px;"><div class="modal-content"></div></div></div>');
 $modal.find('div.modal-content').empty().load(opts.url, opts.data);
 $modal.modal().on('shown.bs.modal', opts.fn).on('hide.bs.modal', opts.onClose);
 };*/
/**
 * datatables控件监听全选按钮
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 * @param {function}
 */
globe.ze.dataGrid.selectAllFn = (function () {
    $("body").on("click", "table.dataTable thead .select-checkbox", function (e) {
        var tableId = $(this).parents("div.dataTables_wrapper").attr("id");
        tableId = tableId.substring(0, tableId.length - 8);
        var tableObj = $("#" + tableId).DataTable();
        $(this).toggleClass('selected');
        var hasCls = $(this).hasClass('selected');
        if (hasCls) {
            tableObj.rows().select();
        } else {
            tableObj.rows().deselect();
        }
    });
})();
/**
 * dataGrid表格方法-表格数据搜索公用方法
 * @author mag
 * @reliant jQuery
 * @param {string}
 * @param {string}
 */
globe.ze.dataGrid.searchDataFn = function (obj, formId) {
    var pageNum = 1;
    if(obj.start!=0){
        if(obj.start > obj.length){
            pageNum += obj.start/obj.length;
        }else{
            pageNum += obj.length/obj.start;
        }
    }
    obj.page = pageNum;
    obj.limit = obj.length;
    obj.order = obj.orderName;
    obj.direction = obj.orderDir;
    if(formId==""||formId==undefined){
        return obj;
    }
    var params = $(formId).serializeObject();
    $.each(params,function(index,value){
        if(value!=""){
            obj[index] = value;
        }else{
            delete obj[index];
        }
    });
    return obj;
};
/**
 * dataGrid表格方法-得到表格选中的一条记录对象
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 */
globe.ze.dataGrid.getGridRecord = function (GridId) {
    var $grid = $(GridId);
    return $grid.DataTable().row('.selected').data();
};

/**
 * dataGrid表格方法-得到表格选中的单条记录对象的属性值
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 * @param {string}
 */
globe.ze.dataGrid.getGridData = function (GridId, dataName) {
    var record = globe.ze.dataGrid.getGridRecord(GridId);
    if (record == undefined) {
        return " ";
    }
    return eval("record." + dataName);
};

/**
 * dataGrid表格方法-得到表格选中的记录对象
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 */
globe.ze.dataGrid.getGridRecords = function (GridId) {
    var $grid = $(GridId);
    return $grid.DataTable().rows('.selected').data();
}
/**
 * dataGrid表格方法-得到表格选中的记录对象的属性值
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 * @param {string}
 * @param {string}
 */
globe.ze.dataGrid.getGridDatas = function (GridId, dataName, separator) {
    var val = "";
    var al = globe.ze.dataGrid.getGridRecords(GridId);
    if (al == undefined) {
        return val;
    }
    for (var i = 0; i < al.length; i++) {
        val += eval("al[i]." + dataName) + separator;
    }
    if (al.length > 0) {
        return val.substring(0, val.length - 1);
    } else {
        return val;
    }
}
/**
 * dataGrid表格方法-验证表格选择单条或多条
 * @author zhaoen
 * @reliant jQuery
 * @param {string}
 * @param {string}
 */
globe.ze.dataGrid.validateGridSelected = function (GridId, isMulit) {
    var $grid = $(GridId);
    var al = $grid.DataTable().rows('.selected').data();
    if (al.length == 0) {
        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_WARNING,
            title: '提示',
            message: "您未在复选框中选择记录，请重新选择！",
            buttons: [{
                label: '关闭',
                cssClass: 'btn-sm',
                action: function (dialogRef) {
                    dialogRef.close();
                }
            }]
        });
        return false;
    }
    if (!isMulit) {
        if (al.length > 1) {
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_WARNING,
                title: '提示',
                message: "您只能在复选框中选择一条记录，请重新选择！",
                buttons: [{
                    label: '关闭',
                    cssClass: 'btn-sm',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }]
            });
            return false;
        }
    }
    return true;
};
/**
 * 下拉列表初始化.
 * 参数值:obj:组件.
 * 参数值:url:请示地址.
 * 返回值:data:请示的参数.
 * 函数:fn:回调函数.
 */
globe.ze.form.selectLoad = function (obj, url, data ,fn){
    $.ajax({
        url: url,
        type: "GET",
        success: function (data) {
            $.each(data.content, function (i, v) {
                $(obj).append("<option value='" + v.id + "'>" + v.name + "</option>");
            });
            if(jQuery.isFunction(fn)) fn(data.content);
        }
    });
};
/**
 * 表单验证公用方法.
 * 参数值:表单对象string ：jquery查询form对象需要的条件，如#id, .class等.
 * 返回值:true或false.
 */
globe.ze.form.validateFormFn = function (formElement){
    var isValidate = $(formElement).validate().form();
    return isValidate;
};

/**
 * 自定义表格-上/下移动.
 * 参数值:
 * 返回值:
 */
globe.ze.form.rowUpDownFn = function (even, trIdIndex) {
    var trId="#tr"+trIdIndex;
    var $tab = $(trId).parents("table"),
        tabId = $tab.attr("id"),
        $index = $(trId).index(),
        $length = $("#" + tabId + " tr").length - 1,
        $obj = $(trId),
        $cloneObj = $(trId).clone(true);
    debugger
    if (even == 'up') {
        if ($index == 1) return;
        var currentIndex=parseInt($index - 1);
        $cloneObj.insertBefore("#" + tabId + " tr:eq(" + currentIndex + ")");
        // $cloneObj.find('input[name="userweight"]').val(currentIndex);
        $obj.remove();
    } else {
        if ($index == $length) return;
        var currentIndex=parseInt($index + 1);
        $cloneObj.insertAfter("#" + tabId + " tr:eq(" + currentIndex + ")");
        // $cloneObj.find('input[name="userweight"]').val(currentIndex);
        $obj.remove();
    }
};

globe.ze.form.rowUpDownFnUtil = function (even, trId) {
    var trId="#"+trId;
    var $tab = $(trId).parents("table"),
        tabId = $tab.attr("id"),
        $index = $(trId).index(),
        $length = $("#" + tabId + " tr").length - 1,
        $obj = $(trId),
        $cloneObj = $(trId).clone(true);
    debugger
    if (even == 'up') {
        if ($index == 1) return;
        var currentIndex=parseInt($index - 1);
        $cloneObj.insertBefore("#" + tabId + " tr:eq(" + currentIndex + ")");
        // $cloneObj.find('input[name="userweight"]').val(currentIndex);
        $obj.remove();
    } else {
        if ($index == $length) return;
        var currentIndex=parseInt($index + 1);
        $cloneObj.insertAfter("#" + tabId + " tr:eq(" + currentIndex + ")");
        // $cloneObj.find('input[name="userweight"]').val(currentIndex);
        $obj.remove();
    }
};

/**
 * 展示附件
 * @param containerId 容器ID
 * @param attachIds 附件值
 * @param onCompleted 删除完成（暂时去掉）
 * @param isHiddenDelete 是否隐藏删除按钮，false：默认值，显示删除，true：隐藏删除
 * @param dataId 业务数据ID，删除时使用
 */
globe.ze.form.showAttachments = function (containerId, attachIds,isHiddenDelete,dataId) {

    $("#" + containerId).html("");
    if (attachIds==undefined||attachIds==null||attachIds=="") {
        $("#" + containerId).html('<p style="margin:8px;">没有附件</p>');
        return;
    }

    $.ajax({
        url:'/attachment/index',
        data:{
            attachIds: attachIds
        },
        type:'post',
        success:function (data) {
            var attachments = data.data;
            var ids = '';
            if (attachments.length == 0) {
                $("#" + containerId).html('<span>没有附件</span>');
                return;
            }
            var htmla="";
            //附件加载之前清除附件
            $("#" + containerId).empty();
            var myArray=new Array();
            // 加载附件信息（图片、名称等）
            $.each(attachments,function (i,v) {
                if(!v) return true;
                myArray.push(v.id);
                var cid = v.id;
                var cname = v.filename;
                var method = "/attachment/downloadFile?id=";
                var delHref='';//删除链接
                if(!isHiddenDelete){
                    // delHref="<a attachment='" + cid + "' class='del-attach text-danger mr10' style='margin-left:8px;cursor: pointer;'>删除</a>";
                    delHref="<a id='del_"+cid+"' attachment='" + cid + "' href='javascript:void(0);' class='del-attach text-danger mr10' style='margin-left:8px;cursor: pointer;'>删除</a>";
                }
                htmla += "<p class='zl-attachment' id='att" + cid + "'>"
                    + "<span class='glyphicon glyphicon-paperclip' />"
                    + "<a  href='"+method + cid +"' >" + cname + "</a>"
                    + delHref
                    + "</p>";
            });
            ids = myArray.join(',');

            $("#" + containerId).append(htmla);
            $('#' + containerId).attr('ids', ids);

            if(!isHiddenDelete) {
                $.each(myArray,function (i,v) {
                    debugger
                    $('#del_'+v).click(function () {
                        var attach = $(this);
                        var bid = v;//attach.attr('attachment');
                        // var url="/attachment/delete";//检查附件在业务中是否已用，已用则不删除
                        var url="/attachment/consDelete";//不检查附件是否已用，直接删除
                        debugger
                        var mymessage = confirm( "确定删除该附件？" );
                        if (mymessage == true) {
                            $.post(url, {id: bid, dataId: dataId}, function (data) {
                                if (data.code == 200) {
                                    if ($('.del-attach').length > 1) {
                                        attach.parent().remove();
                                    } else {
                                        $("#" + containerId).html('');
                                    }
                                    var value = $('#' + containerId).attr('ids');
                                    var arrValue = value.split(',');
                                    if (arrValue.indexOf(bid) > -1) {
                                        arrValue.splice(arrValue.indexOf(bid), 1);
                                        value = arrValue.join(',');
                                        $('#' + containerId).attr('ids', value);
                                    }
                                }
                                else {
                                    alert(data.data);
                                }
                            });
                        }
                    });
                });

            }
        }
    })
};

//返回到主页
globe.ze.form.returnHome=function () {
    // debugger
    var referrer=$('#referrer').val();
    var referrerUrl = sessionStorage.getItem("referrerUrl");
    if(referrer!=undefined&&referrer!=null&&referrer!='') {
        top.location.href = referrer;
    }else if(referrerUrl!=undefined&&referrerUrl!=null&&referrerUrl!='') {
        //var referrerUrl = sessionStorage.getItem("referrerUrl");
        top.location.href = referrerUrl;
    }else {
    }
    // window.opener=null;
    // window.open("","_self");
    // window.close();
};
//返回到外事管理编辑页面
globe.ze.form.returnIndex=function (userId) {
    // top.location.href= '/index/' + userId;
    window.location= '/index/' + userId;
};
//返回到外事管理编辑页面
globe.ze.form.returnEdit=function (id,userId) {
    // top.location.href= '/edit/' + id;
    window.location='/edit/' + id+'/'+userId;
};
//跳转到公示页面
globe.ze.form.returnPub=function (id,isBefore) {
    // window.location = '/publicity/' + id + '/' + isBefore;
    window.open('/publicity/' + id + '/' + isBefore);
};
//跳转到回国（境）后公示页面
globe.ze.form.returnBackPub=function (id) {
    window.location='/backLandPubInfo/'+id;
    // window.open('/backLandPubInfo/'+id);
};
//关闭页面
globe.ze.form.closePage=function () {
    // window.location='';
    // window.close();
    window.opener=null;
    window.open("","_self");
    window.close();
};
//关闭页面
globe.ze.form.closeCurPage=function (id) {
    window.location='/edit/' + id;
};

globe.ze.form.openHangBan=function () {
    var url='/hangbanByTeamId/'+$('#hiddenTeamid').val();
    window.open(url);
};
//窗口最大化
globe.ze.form.resizeWindow=function(){
    if (window.screen) {//判断浏览器是否支持window.screen判断浏览器是否支持screen
        var myw = screen.availWidth; //定义一个myw，接受到当前全屏的宽
        var myh = screen.availHeight; //定义一个myw，接受到当前全屏的高
        window.moveTo(0, 0); //把window放在左上脚
        window.resizeTo(myw, myh); //把当前窗体的长宽跳转为myw和myh
    }
};
//region 页面公共参数
globe.pages.processDefinitionId='waishi:21:920006';//老版本流程
globe.pages.hezuosi ='570';//国际合作司ID
globe.pages.paichufaqidanwei='1792,39807815,42407910';//可发起预公示和预审的司局，排除以下司局单位
globe.pages.shenBaoTaskDefinitionKey='sid-43DE76E0-64BC-4A2D-9498-3C1DB9BA9666';//用于判断当前节点是否是 申报单位（送司局领导）节点
globe.pages.shenBaoChushiTaskDefinitionKey='sid-BD31DB60-92D7-42BC-94E7-C7AC369F08C6';//申报单位（外事审核部门负责人）
globe.pages.guojisiTaskDefinitionKey='sid-C584F62D-7071-468C-97D0-6F5E24197771';//用于判断当前节点是否是 国际司司局领导（送司局领导）节点

//region 文件办理页面参数
globe.pages.zhubanchushiKey = 'sid-7277ECDB-EA40-4755-85E5-0529E44ED1CD';//送主办处室，只能单选
globe.pages.endNodeKey = 'sid-45DF13DE-436B-4F0D-86F7-2B68635EA367';//流程整体结束节点的Key，等于该节点时，名称修改为“同意，请退回拟稿人分发或结束”
globe.pages.yewufenguanjuzhang = 'sid-15C6400D-F9B5-42A7-9101-010432342FFA';//业务分管局长Key，等于该节点时，名称修改为“业务分管局长审批”
globe.pages.guojisizonghechu = 'sid-EF8B0885-0CF7-490A-9EF0-7AF8C2064B3D';//国际司综合处Key，等于该节点时，名称修改为“国际司综合处”
//region 会签节点Key
globe.pages.chushihuiqian = 'sid-33451452-66E0-4994-BCD5-A442BB9DFFB1';//处室会签节点Key，会签节点
globe.pages.chuneirenyuan = 'sid-31896D52-AC7E-4538-AC2B-6A116E113C83';//送处内人员Key，会签节点

globe.pages.xiebanchushi = 'sid-40AB5361-C0B6-4EC1-AA76-81155165ACF6';//送协办处室会签节点Key，会签节点
globe.pages.sijuchuneirenyuan = 'sid-51814417-012E-42DE-8DB3-B37146C00DAF';//司局内会签子流程：送处内人员节点Key，会签节点
globe.pages.zhengqiulingdaoyijian = 'sid-3944B63C-23FC-4751-A82B-1E95EE02161A';//征求司局领导意见节点Key，会签节点
globe.pages.sineirenyuan = 'sid-7F03CDEB-D5B9-4FFE-A108-3D5869F9AD85';//送司内人员Key，会签节点
globe.pages.waishifenguanjuzhang = 'sid-315D4B0D-A792-4431-A12F-7B65A19F1D4D';//外事分管局长
globe.pages.zongjuzhang = 'sid-F19F9BE2-546D-492E-841D-7CD5BDC5BD88';//外事分管局长


//endregion
//endregion
//endregion