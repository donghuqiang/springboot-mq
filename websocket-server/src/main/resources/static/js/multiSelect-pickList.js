/**
 * Created by Hover on 2018/5/25.
 */
(function($) {
    $.fn.pickList = function(options) {
        var opts = $.extend({}, $.fn.pickList.defaults, options);
        //初始化待选值
        this.setListSelect = function(dataObj) {
            var option = '';
            if(dataObj==null||dataObj==undefined){
                var d = this.dataDuplicate(opts.data,opts.dataResult);
                if(d==[]){
                    return;
                }
                $.each(d, function(key, val) {
                    option += '<option data-id=' + val.id + '>' + val.text + '</option>';
                });
                this.find('.pickData').append(option);
            }else{
                var d = this.dataDuplicate(dataObj,opts.dataResult);
                if(d==[]){
                    return;
                }
                $.each(d, function(key, val) {
                    option += '<option data-id=' + val.id + '>' + val.text + '</option>';
                });
                this.find('.pickData').html("").append(option);
            }
        };
        //初始化已选值
        this.setListResult = function(dataObj) {
            var option = '';
            if(dataObj==null||dataObj==undefined){
                if(opts.dataResult==undefined||opts.dataResult==null||opts.dataResult==[]){
                    return;
                }
                $.each(opts.dataResult, function(key, val) {
                    option += '<option data-id=' + val.id + '>' + val.text + '</option>';
                });
                this.find('.pickListResult').append(option);
            }else{
                $.each(dataObj, function(key, val) {
                    option += '<option data-id=' + val.id + '>' + val.text + '</option>';
                });
                this.find('.pickListResult').html("").append(option);
                opts.dataResult = dataObj;
            }
        };
        //已选变更同时更新对象中已选结果数据
        this.changeDataResultFn = function() {
            var objResult = [];
            this.find(".pickListResult option").each(function() {
                objResult.push({
                    id: $(this).data('id'),
                    text: this.text
                });
            });
            opts.dataResult = objResult;
        };
        //初始化按钮方法
        this.controll = function() {
            var pickThis = this;

            pickThis.find(".pAdd").on('click', function() {
                var p = pickThis.find(".pickData option:selected");
                p.clone().appendTo(pickThis.find(".pickListResult"));
                p.remove();
                pickThis.changeDataResultFn();
            });

            pickThis.find(".pAddAll").on('click', function() {
                var p = pickThis.find(".pickData option");
                p.clone().appendTo(pickThis.find(".pickListResult"));
                p.remove();
                pickThis.changeDataResultFn();
            });

            pickThis.find(".pRemove").on('click', function() {
                var p = pickThis.find(".pickListResult option:selected");
                p.clone().appendTo(pickThis.find(".pickData"));
                p.remove();
                pickThis.changeDataResultFn();
            });

            pickThis.find(".pRemoveAll").on('click', function() {
                var p = pickThis.find(".pickListResult option");
                p.clone().appendTo(pickThis.find(".pickData"));
                p.remove();
                pickThis.changeDataResultFn();
            });

            pickThis.find(".upBtn").on('click', function() {
                var p = pickThis.find(".pickListResult option:selected").each(function (index, item) {
                    var $item = $(item);
                    var $target = $item.prev();
                    $item.insertBefore($target);
                });
            });
            pickThis.find(".downBtn").on('click', function() {
                var p = pickThis.find(".pickListResult option:selected").each(function (index, item) {
                    var $item = $(item);
                    var $target = $item.next();
                    $item.insertAfter($target);
                });
            });
        };

        //数据去重合并返回新数组
        this.dataDuplicate = function(fromData,toData){
            if(fromData==undefined||fromData==null||fromData.length==0){
                return [];
            }
            var fromData = fromData;
            //初始化第一步数组去重方法
            function unique(arr) {
                var res = [arr[0]];
                for (var i = 0; i < arr.length; i++) {
                    var repeat = false;
                    for (var j = 0; j < res.length; j++) {
                        if (isObjectValueEqual(arr[i], res[j])) {
                            repeat = true;
                            break;
                        }
                    }
                    if (!repeat) {
                        res.push(arr[i]);
                    }
                }
                return res;
            }
            //判断两对象是否相等
            function isObjectValueEqual(a, b) {
                var aProps = Object.getOwnPropertyNames(a);
                var bProps = Object.getOwnPropertyNames(b);
                if (aProps.length != bProps.length) {
                    return false;
                }
                for (var i = 0; i < aProps.length; i++) {
                    var propName = aProps[i];
                    if (a[propName] !== b[propName]) {
                        return false;
                    }
                }
                return true;
            }
            fromData = unique(fromData);

            var arr = [],
                temp = {},//用于id判断重复
                result_final = fromData;//最后的新数组
            var testTemp1 = {};
            var result1 = [];
            if(toData==undefined||toData==null||toData==[]){
                arr = fromData;//合并成一个数组
            }else{
                arr = fromData.concat(toData)//合并成一个数组
            }
            //遍历arr数组，将每个item.id在temp中是否存在值做判断，如不存在则对应的item赋值给新数组，并将temp中item.id对应的key赋值，下次对相同值做判断时便不会走此分支，达到判断重复值的目的；
            arr.map(function(item,index){
                if(!temp[item.id]){
                    temp[item.id] = true;
                }else{
                    result1.push(item);
                }
            });
            result1.map(function(item,index){
                result_final.forEach(function (item_res, index_res) {
                    if(item_res.id==item.id){
                        result_final.splice(index_res,1);
                    }
                });
            });
            return result_final;
        }
        //获取已选值，如果传递参数splite，则以此参数为分隔符拼接字符串返回，不传递则返回json对象
        this.getValues = function(splite) {
            if(splite==null||splite==undefined){
                var objResult = [];
                this.find(".pickListResult option").each(function() {
                    objResult.push({
                        id: $(this).data('id'),
                        text: this.text
                    });
                });
                return objResult;
            }else{
                var objResult = {"id":"","text":""};
                var selValue = "" , selText = "";
                this.find(".pickListResult option").each(function() {
                    var op = $(this);
                    selValue += op.data('id')+splite;
                    selText += op.text()+splite;
                });
                selValue = selValue.substring(0,selValue.length-1);
                selText = selText.substring(0,selText.length-1);
                objResult.id = selValue;
                objResult.text = selText;
                return objResult;
            }

        };
        //初始化DOM
        this.init = function() {
            var pickListHtml =
                "<div class='row'>" +
                "  <div class='col-sm-5'>" + opts.leftTitle +
                "	 <select class='form-control pickListSelect pickData' multiple></select>" +
                " </div>" +
                " <div class='col-sm-1 pickListButtons btn-box'>" +
                "	<button type='button' class='pAdd btn btn-default btn-sm' title=" + opts.add + "><i class='glyphicon glyphicon-arrow-right'></i></button>" +
                "   <button type='button' class='pAddAll btn btn-default btn-sm' title=" + opts.addAll + "><i class='glyphicon glyphicon-arrow-right'></i> <i class='glyphicon glyphicon-arrow-right'></i></button>" +
                "<p class='clearfix' style='margin-bottom:20px'></p>" +
                "	<button type='button' class='pRemove btn btn-default btn-sm' title=" + opts.remove + "><i class='glyphicon glyphicon-arrow-left'></i></button>" +
                "	<button type='button' class='pRemoveAll btn btn-default btn-sm' title=" + opts.removeAll + "><i class='glyphicon glyphicon-arrow-left'></i> <i class='glyphicon glyphicon-arrow-left'></i></button>" +
                " </div>" +
                " <div class='col-sm-5'>" + opts.rightTitle +
                "    <select class='form-control pickListSelect pickListResult' multiple></select>" +
                " </div>" +
                "<div class='col-sm-1 settingUp-btns'>" +
                "  <button type='button' class='btn upBtn btn-default btn-sm' title=" + opts.up + "> <i class='glyphicon glyphicon-arrow-up'></i> </button>" +
                "  <button type='button' class='btn downBtn btn-default btn-sm' title=" + opts.down + "> <i class='glyphicon glyphicon-arrow-down'></i> </button>" +
                "</div>" +
                "</div>";

            this.append(pickListHtml);
            this.setListSelect();
            this.setListResult();
            this.controll();
        };
        this.init();
        return this;
    };
    $.fn.pickList.defaults = {
        leftTitle: '待选列表',
        rightTitle: '已选列表',
        add: '添加',
        addAll: '添加全部',
        remove: '移除',
        removeAll: '移除全部',
        up: '上移',
        down: '下移'
    };
}(jQuery));