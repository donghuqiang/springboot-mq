// document.write('<script type="text/javascript" src="/js/webuploader.0.1.5/webuploader.js"><\/script>');

function newGuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });
}

/**
 * 初始化上传控件
 * @param options
 */
function initWebUpload(options) {
    //创建默认参数
    var defaults = {
        auto:true,
        fileType:1,//文件存储路径的类别
        thelistId:undefined,
        containerId:undefined,
        pickId:undefined,
        hiddenInputId: undefined, // input hidden id
        deleteServer:'/attachment/delete',//删除文件service地址
        onAllComplete: function (event) { }, // 当所有file都上传后执行的回调函数
        onComplete: function (event) { },// 每上传一个file的回调函数
        innerOptions: {},
        fileNumLimit: undefined,//验证文件总数量, 超出则不允许加入队列
        fileSizeLimit: undefined,//验证文件总大小是否超出限制, 超出则不允许加入队列。
        fileSingleSizeLimit: undefined,//验证单个文件大小是否超出限制, 超出则不允许加入队列
        PostbackHold: false
    };

    var opts = $.extend(defaults, options);
    var hdFileData = $("#" + opts.hiddenInputId);//隐藏域元素对象
    var target = $('#'+opts.containerId);//容器
    var pickerid = opts.pickId;//给一个唯一ID
    var thelistId = opts.thelistId;//给一个唯一ID


    //region 拼接上传面板
    if (!opts.auto) {
        var uploaderStrdiv = '<div class="webuploader">';
        var btnId = newGuid();//给一个唯一ID
        uploaderStrdiv =
            '<div id="' + thelistId + '" class="uploader-list"></div>' +
            '<div class="btns">' +
            '<div id="' + pickerid + '">选择文件</div>' +
            '<button id="'+btnId+'" class="webuploadbtn">开始上传</button>' +
            '</div>';

        uploaderStrdiv +='</div>';
        target.html(uploaderStrdiv);
    }

    var uploadHiddenDiv= '<div style="display:none" class="UploadhiddenInput" ></div>';
    target.append(uploadHiddenDiv);

    //endregion

    var $list = target.find('#'+thelistId),
        //$btn = target.find('.webuploadbtn'),//手动上传按钮备用
        state = 'pending',
        $hiddenInput = target.find('.UploadhiddenInput'),
        uploader;
    var jsonData = {
        fileList: []
    };
    uploader = WebUploader.create({
        // 不压缩image
        resize: false,
        // swf文件路径
        swf:  '/js/webuploader.0.1.5/Uploader.swf',
        // 文件接收服务端。
        server: '/attachment/upload?type=1',

        auto:true,//启用自动上传
        // 选择文件的按钮。可选。
        // 内部根据当前运行是创建，可能是input元素，也可能是flash.
        pick: '#'+opts.pickId,
        fileNumLimit: opts.fileNumLimit,
        fileSizeLimit: opts.fileSizeLimit,
        fileSingleSizeLimit: opts.fileSingleSizeLimit
    });

    //回发时还原hiddenfiled的保持数据
    // var fileDataStr = hdFileData.val();
    // if (fileDataStr && opts.PostbackHold) {
    //     jsonData = JSON.parse(fileDataStr);
    //     $.each(jsonData.fileList, function (index, fileData) {
    //         var newid = SuiJiNum();
    //         fileData.queueId = newid;
    //         $list.append('<div id="' + newid + '" class="item">' +
    //             '<div class="info">' + fileData.name + '</div>' +
    //             '<div class="state">已上传</div>' +
    //             '<div class="del"></div>' +
    //             '</div>');
    //     });
    //     hdFileData.val(JSON.stringify(jsonData));
    // }

    if (opts.auto) {

        uploader.on('fileQueued', function (file) {
            debugger;
            $list.append('<div id="' + target[0].id + file.id + '" class="item">' +
                '<span class="webuploadinfo" style="margin:0 10px 10px 0;">' + file.name + '</span>' +
                '<span class="webuploadstate" style="margin:0 10px 10px 0;">正在上传...</span>' +
                '<a href="javascript:void(0);" class="webuploadDelbtn">删除</a><br />' +
                '</div>');
            uploader.upload();
        });
    } else {
        uploader.on('fileQueued', function (file) {//队列事件
            $list.append('<div id="' + target[0].id + file.id + '" class="item">' +
                '<span class="webuploadinfo" style="margin:0 10px 10px 0;">' + file.name + '</span>' +
                 '<span class="webuploadstate" style="margin:0 10px 10px 0;">等待上传...</span>' +
                '<a href="javascript:void(0);" class="webuploadDelbtn">删除</a><br />' +
                '</div>');
        });
    }

    // 当有文件添加进来的时候
    // uploader.on( 'fileQueued', function( file ) {
    //     $list.append( '<div id="' + file.id + '" class="item">' +
    //         '<h4 class="info" style="margin:0 0 10px 0;">' + file.name + '<span class="state"></span></h4>' +
    //         // '<p class="state">等待上传...</p>' +
    //         '</div>' );
    // });

    // 文件上传过程中创建进度条实时显示。
    uploader.on( 'uploadProgress', function( file, percentage ) {
        // var $li = $( '#'+file.id ),
        //     $percent = $li.find('.progress .progress-bar');
        var $li = target.find('#' + target[0].id + file.id),
            $percent = $li.find('.progress .bar');

        // 避免重复创建
        if ( !$percent.length ) {
            $percent = $('<span class="progress">' +
                '<span  class="percentage"><span class="text"></span>' +
                '<span class="bar" role="progressbar" style="width: 0%">' +
                '</span></span>' +
                '</span>').appendTo($li).find('.bar');
        }

        $li.find('span.webuploadstate').html('上传中');
        $li.find(".text").text(Math.round(percentage * 100) + '%');
        $percent.css('width', percentage * 100 + '%');
    });

    var fileList=new Array();//上传文件列表
    uploader.on( 'uploadSuccess', function( file,response ) {
        debugger
        //target.find('#' + target[0].id + file.id).find('span.webuploadstate').html('已上传');
        //上传成功记录上传信息
        fileList.push(response);

        if (response.state == "error") {
            target.find('#' + target[0].id + file.id).find('span.webuploadstate').html(response.message);
        } else {
            target.find('#' + target[0].id + file.id).find('span.webuploadstate').html('已上传');
            $hiddenInput.append('<input type="text" id="hiddenInput'+target[0].id + file.id + '" class="hiddenInput" value="' + response.id + '" />');
        }
    });
    uploader.on('error',function (errorType,size,file) {
        if(errorType=="F_EXCEED_SIZE"){
            // jBoxTip("当前文件大小("+(file.size/1024/1024).toFixedZL(1)+"MB)超出限制!单个文件最大10MB","error");
            alert("当前文件大小("+(file.size/1024/1024)+"MB)超出限制!单个文件最大50MB");
        }
    });
    uploader.on( 'uploadError', function( file ) {
        $( '#'+file.id ).find('p.state').text('上传出错');
    });

    //删除时执行的方法
    uploader.on('fileDequeued', function (file) {
        debugger
        var attId = $("#hiddenInput" + target[0].id + file.id).val();
        if (attId!=null) {
            $.post(defaults.deleteServer, { id: attId }, function (data) {
                var ids = '';   // 上传返回的ids
                //删除成功，隐藏域值去除该删除的 附件ID，fileList移除该附件
                for (var i = 0; i < fileList.length; i++) {
                    if(fileList[i].id==attId){
                        fileList.remove(fileList[i]);
                    }
                }
                //隐藏域重新赋值
                for (var i = 0; i < fileList.length; i++) {
                    if (ids.length > 0) ids += ",";
                    ids += fileList[i].id;
                }
                $('#' + opts.hiddenInputId).val(ids);//隐藏域赋值
            });
        }
        $("#"+ target[0].id + file.id).remove();
        $("#hiddenInput" + target[0].id + file.id).remove();
        $('#'+opts.thelistId).find('#' + target[0].id + file.id).remove();
        $('#'+opts.thelistId).find('#' + file.id).remove();
    });

    //执行完成后事件
    uploader.on( 'uploadComplete', function( file ) {
        debugger
        var attId = $("#hiddenInput" + target[0].id + file.id).val();
        target.find('#' + target[0].id + file.id).find('.progress').fadeOut();
        // var ids = '';   // 上传返回的ids
        // for (var i = 0; i < fileList.length; i++) {
        //     if (ids.length > 0) ids += ",";
        //     ids += fileList[i].id;
        // }
        var myArray=new Array();
        $.each(fileList,function (i,v) {
            myArray.push(v.id);
        });

        var oldVal = $('#' + opts.hiddenInputId).val();//原附件ID
        if(oldVal!=undefined&&oldVal!=''){
            $.each(oldVal.split(','),function (i,v) {
                myArray.push(v);
            });
        }
        var ids=myArray.join(',');//上传返回的ids
        $('#' + opts.hiddenInputId).val(ids);//隐藏域赋值
    });

    //多文件点击上传的方法
    // $btn.on('click', function () {
    //     if (state === 'uploading') {
    //         uploader.stop();
    //     } else {
    //         uploader.upload();
    //     }
    // });

    //删除
    $list.on("click", ".webuploadDelbtn", function () {
        debugger
        var $ele = $(this);
        var id = $ele.parent().attr("id");
        id = id.replace(target[0].id, "");

        var file = uploader.getFile(id);
        uploader.removeFile(file);
    });

    return uploader;
}

//数组拓展函数
Array.prototype.indexOf = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function (val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};

/**
 * 展示附件
 * @param containerId 容器ID
 * @param attachIds 附件值
 * @param onCompleted 删除完成（暂时去掉）
 * @param isHiddenDelete 是否隐藏删除按钮，false：默认值，显示删除，true：隐藏删除
 */
function showAttachments(containerId, attachIds,isHiddenDelete) {
    $("#" + containerId).html("");
    if (!attachIds) {
        $("#" + containerId).html('<p style="margin:8px;">没有附件</p>');
        return;
    }

    $.post("/attachment/index", {
        attachIds: attachIds
    }, function (data) {
        var attachments = data.data;
        var ids = '';

        if (attachments.length == 0) {
            $("#" + containerId).html('<span>没有附件</span>');
            return;
        }
        //附件加载之前清除附件
        $("#" + containerId).empty();
        // 加载附件信息（图片、名称等）
        for (var i = 0; i < attachments.length; i++) {
            if (ids.length > 0) ids += ',';
            var cid = attachments[i].id;
            ids += cid;
            var cname = attachments[i].filename;
            var method = "/attachment/downloadFile?id=";

            var delHref='';//删除链接
            if(!isHiddenDelete){
                delHref="<a attachment='" + cid + "' class='del-attach text-danger mr10' style='margin-left:6px;'>删除</a>";
            }
            $("#" + containerId).append("<p class='zl-attachment' id='att" + cid + "'>"
                + "<span class='glyphicon glyphicon-paperclip' />"
                // + "<a  href='javascript:void(0);' onclick='window.open(\"" + method + cid + "\")' >" + cname + "</a>"
                + "<a  href='"+method + cid +"' >" + cname + "</a>"
                + delHref
                + "</p>");
        }
        $('#' + containerId).attr('ids', ids);

        if(!isHiddenDelete) {
            $('.del-attach').bind('click', function () {
                var attach = $(this);
                var bid = attach.attr('attachment');
                var url="/attachment/delete";

                $.post(url, {id: bid}, function (data) {
                    if(data.code==200) {
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
                    }else{
                        alert('error');
                    }
                });
            });
        }


    });
}