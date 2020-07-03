/**
 * jQuery工具方法
 * Created by donghuqiang on 2019/2/25.
 */
(function (win, $, undefined) {
    $.extend(String, {
        format: function () {
            if (arguments.length == 0) return '';
            if (arguments.length == 1) return arguments[0];
            var reg = /{(\d+)?}/g;
            var args = [];
            for (var i = 0; i < arguments.length; i++) {
                if (arguments[i] instanceof Array) {
                    for (var j = 0; j < arguments[i].length; j++)
                        args.push(arguments[i][j]);
                }
                else args.push(arguments[i]);
            }
            var result = arguments[0].replace(reg, function ($0, $1) {
                return args[parseInt($1) + 1];
            });
            return result;
        },
        trimS: function () {
            return this.replace("/(^\s*)|(\s*$))/g", '');
        }
    });

    $.extend(String.prototype, {
        replaceAll: function (oldStr, replaceStr, ignoreCase) {
            //替换所有字符 ignoreCase：是否忽略大小写
            if (!RegExp.prototype.isPrototypeOf(oldStr)) {
                return this.replace(new RegExp(oldStr, (ignoreCase ? "gmi" : "gm")), replaceStr);
            } else {
                return this.replace(oldStr, replaceStr);
            }
        },
        toDecimal: function (num) {
            /**
             * 字符串转换为 decimal
             * @num {String} 小数点后几位
             */
            var x = this;
            var f = parseFloat(x);
            if (isNaN(f)) {
                return 0;
            }
            if (num != undefined && num != null) {
                return f.tofixed(num);
            } else {
                f = f.tofixed(6);//Math.round(x*100)/100;
                return f;
            }
        },
        trimEnd: function (c) {
            if (c == null || c == "") {
                var str = this;
                var rg = /s/;
                var i = str.length;
                while (rg.test(str.charAt(--i))) ;
                return str.slice(0, i + 1);
            }
            else {
                var str = this;
                var rg = new RegExp(c);
                var i = str.length;
                while (rg.test(str.charAt(--i))) ;
                return str.slice(0, i + 1);
            }
        }
    });

    $.extend($, {
        isNull: function (obj) {
            return obj == undefined || obj == null || obj == '' || obj == 'undefined' || obj == 'null';
        },
        isNullOrWhiteSpace: function (obj) {
            return obj == undefined || obj == null || obj == '' || obj == ' ' || obj == 'undefined' || obj == 'null';
        },
        isNotNull: function (obj) {
            return !$.isNull(obj);
        },
        isInArray: function (value, arr) {
            /**
             * 判断数组是否包含某值
             * arr：数组
             * value：某值
             */
            var index = $.inArray(value, arr);
            if (index >= 0) {
                return true;
            }
            return false;
        },
        toDecimal: function (x, num) {
            /**
             * 字符串转换为 decimal
             * @x 需要转换的值
             * @num {String} 小数点后几位
             */
            if (!$.isNumeric(x)) return 0;
            var f = new Number(x);
            if (isNaN(f)) {
                return 0;
            }
            if (arguments[1] != undefined && arguments[1] != null) {
                return new Number(f.toFixed(num));
            } else {
                f = f.toFixed(4);//Math.round(x*100)/100;
                return new Number(f);
            }
        },
        showPercent: function (elementId, fiedlName) {
            /**
             * 百分比数据，展示 20%
             * elementId：展示元素ID id="txt_zd"
             * fiedlName：展示字段名 ${fieldName}
             */
            var _obj = $('input[name="' + fiedlName + '"]');
            //如果隐藏域不为空，则给展示百分比赋值
            if (_obj.val() != '' && _obj.val() != undefined) {
                $('#' + elementId).val(_obj.val() + '%');
            }
            $('#' + elementId).unbind('focus');
            $('#' + elementId).unbind('blur');

            $('#' + elementId).focus(function () {
                //如果隐藏域
                if (_obj.val() != undefined && _obj.val() != '') {
                    $(this).val(_obj.val());
                }
            })
            $('#' + elementId).blur(function () {
                _obj.val($(this).val());
                if (_obj.val() != undefined && _obj.val() != '') {
                    $(this).val(_obj.val() + '%');
                }
            })
        },
        radioType: function (eleName, entityName) {
            /**
             * 描述：单选按钮类型文本框，选择后给隐藏域赋值，用法如：
             * <input type="hidden" name="单据相符" value="${model.单据相符}">
             * <input value="1" name="raddjxf" checked="checked" type="radio">是
             * <input value="2" name="raddjxf" type="radio">否
             * @name 单元按钮的name属性
             * @entityName 隐藏域的name属性
             */
            var entityVal = $('input[name="' + entityName + '"]').val();
            if ($.isNotNull(entityVal) && entityVal != '0') {
                $("input[type='radio'][name='" + eleName + "'][value='" + entityVal + "']").attr("checked", 'checked')
            } else {
                var chkVal = $("input[type='radio'][name='" + eleName + "']:checked").val();
                $('input[name="' + entityName + '"]').val(chkVal);
            }
            $('input[name="' + eleName + '"]').click(function () {
                var that = $(this);
                if (that.is(':checked')) {
                    $('input[name="' + entityName + '"]').val(that.val());
                }
            })
        },
        //单点登录，跳转
        formJump: function (url, kv) {
            var $form = $('<form  style="display:none;" target="_blank" method="post" ></form>');
            $form.attr('action', url);
            $("body").append($form);
            $.each(kv, function () {
                $form.append($("<input type='hidden'/>").attr('name', this.k).val(this.v));
            });
            $form.submit();//表单提交
        },
        formatMoney: function (s, n) {
            // n = n > 0 && n <= 20 ? n : 2;
            // if($.isNull(s)) return '';
            // if(s==0) return '';
            // if($.isNumeric(s) && s.toString().indexOf('E')>0){
            //     var num=new Number(s);
            //     s=num.toString();
            // }
            // s = parseFloat((s + '').replace(/[^\d\.-]/g, '')).toFixed(n) + '';
            // var l = s.split('.') [0].split('').reverse(),
            //     r = s.split('.') [1];
            // var t = '';
            // for (var i = 0; i < l.length; i++)
            // {
            //     t += l[i] + ((i + 1) % 3 == 0 && (i + 1) != l.length ? ',' : '');
            // }
            // return t.split('').reverse().join('') + '.' + r;
            $.formatThousand(s);
        },
        formatThousand: function (num) { //格式化千分符
            if ($.isNumeric(num) && num.toString().indexOf('E') > 0) {
                num = new Number(num);
            }
            var source = String(num).split(".");//按小数点分成2部分
            source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{3})+$)', 'ig'), "$1,");//只将整数部分进行都好分割
            return source.join(".");//再将小数部分合并进来
        },
        cutZero: function (old) {
            if ($.isNull(old)) return "";
            if (typeof old === 'number') {
                old = old.toString();
            }
            //拷贝一份 返回去掉零的新串
            var newstr = old;
            //循环变量 小数部分长度
            var leng = old.length - old.indexOf('.') - 1;
            //判断是否有效数
            if (old.indexOf(".") > -1) {
                //循环小数部分
                for (i = leng; i > 0; i--) {
                    //如果newstr末尾有0
                    if (newstr.lastIndexOf("0") > -1 && newstr.substr(newstr.length - 1, 1) == 0) {
                        var k = newstr.lastIndexOf("0");
                        //如果小数点后只有一个0 去掉小数点
                        if (newstr.charAt(k - 1) == ".") {
                            return newstr.substring(0, k - 1);
                        } else {
                            //否则 去掉一个0
                            newstr = newstr.substring(0, k);
                        }
                    } else {
                        //如果末尾没有0
                        return newstr;
                    }
                }
            }
            return old;
        }
    });

    //表单序列化为json对象
    $.fn.serializeObject = function () {
        /**
         * 序列化表单为json对象
         * 用法 $('#form').serializeObject()
         * @type {{}}
         */
        var o = {};
        var a = this.serializeArray();
        $.each(a, function () {
            if (o[this.name] !== undefined) {
                if (!o[this.name].push) {
                    o[this.name] = [o[this.name]];
                }
                o[this.name].push(this.value || '');
            } else {
                o[this.name] = this.value || '';
            }
        });
        return o;
    };
    //表单序列化为json字符串
    $.fn.serializeJson = function () {
        var o = this.serializeObject();
        return JSON.stringify(o);
    };
    //table序列化
    $.fn.tableSerialize = function () {
        var r = [];
        var that = this;
        that.find("tr").each(function (i, obj) {
            var o = {};
            $(obj).find('input[name="userweight"]').val(i);

            $(obj).find("input").each(function (j, inputObj) {
                var n = $(inputObj).attr("name");//名称
                var v = $(inputObj).val();//值

                if (o[n] !== undefined) {
                    if (!o[n].push) {
                        o[n] = [o[n]];
                    }
                    o[n].push(v || '');
                } else {
                    o[n] = v || '';
                }
            });
            if (!$.isEmptyObject(o)) r.push(o);
        });
        return r;
    };

    //附件排序table序列化
    $.fn.attachTableSerialize = function () {
        var r = [];
        var that = this;
        that.find("tr").each(function (i, obj) {
            var o = {};
            var weight=i*5;
            $(obj).find('input[name="weight"]').val(weight);

            $(obj).find("input").each(function (j, inputObj) {
                var n = $(inputObj).attr("name");//名称
                var v = $(inputObj).val();//值

                if (o[n] !== undefined) {
                    if (!o[n].push) {
                        o[n] = [o[n]];
                    }
                    o[n].push(v || '');
                } else {
                    o[n] = v || '';
                }
            });
            if (!$.isEmptyObject(o)) r.push(o);
        });
        return r;
    };

    //数字靠右显示
    $.fn.formatNum = function () {
        $(this).find(".num,.number").each(function () {
            var that = $(this);
            var $text = that.find(":text");
            var val = '';
            if ($text.length > 0) {
                // 单元格下找到文本框
                val = $text.val();
                $text.css("text-align", "right");
                if ($.isNumeric(val) && val.toString().indexOf('E') > 0) {
                    var num = new Number(val);
                    $text.val(num.toString());
                }
            } else if (that[0].tagName == 'INPUT') {
                var val = that.val();
                that.css("text-align", "right");
                if ($.isNumeric(val) && val.toString().indexOf('E') > 0) {
                    var num = new Number(val);
                    that.val(num.toString());
                }
            } else {
                val = that.text();
                that.css("text-align", "right");
                if ($.isNumeric(val) && val.toString().indexOf('E') > 0) {
                    var num = new Number(val);
                    that.text(num.toString());
                }
            }
        });

        //含有 thousandNum 样式的，数字格式为千分符
        $(this).find('.thousandNum').each(function () {
            //查找 千分符 的 td
            var $that = $(this);
            var hiddenInput = $that.find('input:hidden');
            var showinput = $that.find('input:text');
            var hiddenVal = hiddenInput.val();//正常数值
            //showinput.val($.formatMoney(hiddenVal));
            showinput.val($.formatThousand(hiddenVal));

            showinput.unbind('focus');
            showinput.unbind('blur');

            showinput.focus(function () {
                var that = $(this);
                var hidVal = hiddenInput.val();
                if ($.isNumeric(hidVal) && hidVal.toString().indexOf('E') > 0) {
                    var num = new Number(hidVal);
                    that.val(num.toString());
                } else {
                    that.val(hidVal);
                }

            });
            showinput.blur(function () {
                var currentVal = $(this).val();
                //是否是数字
                if (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(currentVal)) {
                    if (!new RegExp("^((?!,).)*$").test(currentVal)) {
                        //如果输入含有千分符的数字，则将千分符去除
                        currentVal = currentVal.replaceAll(',', '');
                    }
                    hiddenInput.val($.cutZero(currentVal));
                    //$(this).val($.formatMoney(currentVal));
                    $(this).val($.formatThousand(currentVal));
                } else {
                    alert("请输入合法的数字！");
                    $(this).val('');
                }
            });

        });
    };

    //#region 表单验证
    $.extend({
        Validate: {
            message: {
                required: "必输字段",
                remote: "请修正该字段",
                email: "请输入正确格式的电子邮件",
                url: "请输入合法的网址",
                date: "请输入合法的日期",
                dateISO: "请输入合法的日期 (ISO).",
                number: "请输入合法的数字",
                digits: "只能输入大于0的整数",
                ints: "只能输入整数",
                creditcard: "请输入合法的信用卡号",
                equalTo: "请再次输入相同的值",
                accept: "请输入拥有合法后缀名的字符串",
                year: "请输入正确的4位数年份",
                maxlength: "请输入一个长度最多是 {0} 的字符串",
                minlength: "请输入一个长度最少是 {0} 的字符串",
                rangelength: "请输入一个长度介于 {0} 和 {1} 之间的字符串",
                range: "请输入一个介于 {0} 和 {1} 之间的值",
                max: "请输入一个最大为 {0} 的值",
                min: "请输入一个最小为 {0} 的值",
                ip: "请输入合法的IP地址",
                cn: "只能输入中文",
                en: "只能输入英文",
                login: "请输入大于等于5，小于等于16位的数字与字母的组合",
                tel: "请输入合法的电话号码",
                telPhone: "请输入合法的手机号码",
                idcard: '请输入合法的身份证号码',
                password: '请输入包含字母+数字+字符组合的密码'
            },
            checkInputs: function (container, isShowErr, alertMsg, show) {
                $(window).unbind('resize');
                if (typeof arguments[2] === 'boolean') {
                    show = arguments[2];
                    alertMsg = null;
                }
                var self = this;

                if (container.length == 0) {
                    return false;
                }
                var valid = true;
                container.find('span.error').remove();
                container.find('[data-rule]').each(function () {
                    var $el = $(this);
                    if ($el.is(':hidden')) {
                        $el = $el.next(':visible');
                        if ($el.length == 0)
                            $el = $(this);
                    }
                    if ($el.is(':hidden')) return true;
                    $el.removeClass('error');
                    $el.css('background-color', '');
                    var elType = $el.attr("type");
                    if(elType!=undefined && elType=='radio'){
                        $el.next().css('background-color', '');
                    }
                    $el.attr('title', '');
                    var rst = self.checkRules($(this));
                    if (rst !== '') { //验证不通过
                        valid = false;
                        $el.css('background-color', '#ffd2d2');
                        var elType = $el.attr("type");
                        if(elType!=undefined && elType=='radio'){
                            $el.next().css('background-color', '#ffd2d2');
                        }
                        var errorMsg='';
                        try{
                            errorMsg = rst.replace(/^\S*/, '').trim()
                        }catch (err){
                            errorMsg=$.trim(rst.replace(/^\S*/, ''))
                        }
                        self.showError($el, errorMsg, show, isShowErr);
                    }
                });
                if (!valid) {
                    if (alertMsg !== 'resize') {
                        //if (!alertMsg) alertMsg = "操作失败，数据格式不符合要求，请修改后重新操作！";
                        if (!alertMsg) alertMsg = "必填项未填或数据格式不符合要求，请修改后重新操作！";
                        alert(alertMsg);
                    }
                }
                $(window).resize(function () {
                    $.Validate.checkInputs(container, false, 'resize', show);
                });
                return valid;
            },
            checkRules: function (element) {
                var self = this;
                var data_rule = element.attr('data-rule');
                if (data_rule == undefined || data_rule == "") {
                    return "";
                }
                var rules = data_rule.split(',');
                var val = this.elementVal(element);
                var rst = "";
                for (var i = 0; i < rules.length; i++) {
                    var rule;
                    var param;
                    if (rules[i].split(':').length > 1) {
                        rule = rules[i].split(':')[0];
                        if (rules[i].indexOf('[') != -1 && rules[i].indexOf(']') != -1) {
                            if (rules[i].indexOf('|') == -1) {
                                throw Error('多个参数必须用[]将数据扩起，并且用|分隔')
                            }
                            param = rules[i].split(':')[1].toString().replace('[', '').replace(']', '').split('|');
                        } else {
                            param = rules[i].split(':')[1];
                        }
                    } else {
                        rule = rules[i];
                    }

                    for (var j in self.methods) {
                        if (rule == j) {
                            if (self.methods[j](val, param, element) === false) {
                                rst = rule + ' ' + String.format(self.message[j], param);
                            }
                            break;
                        }
                    }
                    if (rst !== '') break;
                }
                return rst;
            },
            showError: function (element, errMsg, fixed, isAfter) {
                fixed = fixed == undefined ? true : fixed;
                var $el = $(element);
                var $parent = $el.offsetParent();
                var left, top, $error, scrollWidth;
                if (fixed) {
                    left = $el.position().left + $el.outerWidth(true) + $parent.scrollLeft();
                    top = $el.position().top + $parent.scrollTop();
                    scrollWidth = $parent.width();

                    // $error = $('<span class="show-block error" \
                    //                style="line-height:' + ($el.innerHeight()) + 'px">' + errMsg + "</span>");
                    // $(document.body).append($error);

                    //$el.after($error.css({ left: left, top: top, width: $error.width() }));
                    //是否在元素后追加显示
                    // if (isAfter) {
                    //     if ((scrollWidth - left) > $error.width())
                    //         $el.after($error.css({left: left, top: top}));
                    //     else
                    //         $el.after($error.css({left: left, top: top, width: $error.width()}));
                    // } else {
                    //     $el.attr('title', errMsg);
                    // }
                    $el.attr('title', errMsg);

                }
                else {
                    $error = $('<span class="show-block-float error" \
                                   style="display:none;line-height:' + $el.innerHeight() + 'px">' + errMsg + "</span>");
                    $(document.body).append($error);
                    $el.after($error.css({width: $error.width()}));
                    $el.mouseover(function () {
                        var el = $(this), parent = $(this).offsetParent();
                        var top = el.position().top + parent.scrollTop();
                        var left = el.position().left + el.outerWidth(true) + parent.scrollLeft();
                        //if ((left + el.outerWidth(false)) > $(document.body).width()) {
                        //    left = left - el.outerWidth(true) - $error.width() - 6;
                        //}
                        $error.css({left: left + 6, top: top}).fadeIn();
                    }).mouseout(function () {
                        $error.fadeOut();
                    });
                }
            },
            elementVal: function (element) {
                if (element.is("span") || element.is("label")) {
                    return element.html().trim();
                }
                var type = element.attr("type"),
                    val = element.val();
                if (type === "radio" || type === "checkbox") {
                    var array = new Array();
                    $("input[name='" + element.attr("name") + "']:checked").each(function () {
                        array.push($(this).val());
                    })
                    return array.join(',');
                }

                if (typeof val === "string") {
                    return val.replace(/\r/g, "");
                }
                return val;
            },
            methods: {
                required: function (value) {
                    return $.trim(value).length > 0;
                },
                email: function (value) {
                    if (this.required(value)) {
                        return /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(value);
                    } else {
                        return "";
                    }
                },
                url: function (value) {
                    if (this.required(value)) {
                        return /^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(value);
                    } else {
                        return "";
                    }
                },
                date: function (value) {
                    if (this.required(value)) {
                        return value.isDate();
                    } else {
                        return "";
                    }
                },
                dateISO: function (value) {
                    if (this.required(value)) {
                        return /^\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2}$/.test(value);
                    } else {
                        return "";
                    }
                },
                number: function (value) {
                    if (this.required(value)) {
                        return /^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/.test(value);
                    } else {
                        return "";
                    }
                },
                digits: function (value) {
                    if (this.required(value)) {
                        return /^\d+$/.test(value);
                    } else {
                        return "";
                    }
                },
                ints: function (value) {
                    if (this.required(value)) {
                        return parseInt(value) == value;
                    } else {
                        return "";
                    }
                },
                creditcard: function (value) {
                    if (this.required(value)) {
                        if (/[^0-9 \-]+/.test(value)) {
                            return false;
                        }
                        var nCheck = 0,
                            nDigit = 0,
                            bEven = false;

                        value = value.replace(/\D/g, "");

                        for (var n = value.length - 1; n >= 0; n--) {
                            var cDigit = value.charAt(n);
                            nDigit = parseInt(cDigit, 10);
                            if (bEven) {
                                if ((nDigit *= 2) > 9) {
                                    nDigit -= 9;
                                }
                            }
                            nCheck += nDigit;
                            bEven = !bEven;
                        }

                        return (nCheck % 10) === 0;
                    } else {
                        return "";
                    }
                },
                minlength: function (value, param) {
                    if (this.required(value)) {
                        var length = $.isArray(value) ? value.length : value.toString().trim().length;
                        return length >= param;
                    } else {
                        return "";
                    }
                },
                maxlength: function (value, param) {
                    if (this.required(value)) {
                        var valStr=$.trim(value.toString());
                        var length = $.isArray(value) ? value.length : valStr.length;
                        return length <= param;
                    } else {
                        return "";
                    }
                },
                rangelength: function (value, param) {
                    if (this.required(value)) {
                        var length = $.isArray(value) ? value.length : value.toString().trim().length;
                        return (length >= param[0] && length <= param[1]);
                    } else {
                        return "";
                    }
                },
                min: function (value, param) {
                    if (this.required(value)) {
                        return value >= param;
                    } else {
                        return "";
                    }
                },
                max: function (value, param) {
                    if (this.required(value)) {
                        return value <= param;
                    } else {
                        return "";
                    }
                },
                range: function (value, param) {
                    if (this.required(value)) {
                        return (value >= parseFloat(param[0]) && value <= parseFloat(param[1]));
                    } else {
                        return "";
                    }
                },
                equalTo: function (value, param) {
                    if (this.required(value)) {
                        var target = $(param);
                        return value === target.val();
                    } else {
                        return "";
                    }
                },
                remote: function (value, param) {
                    if (this.required(value)) {
                        var rst = false;
                        var data = {};
                        data["data"] = value;
                        $.ajax({
                            async: false,
                            type: "POST",
                            url: param,
                            dataType: 'json',
                            data: data,
                            success: function (rst) {
                                rst = rst;
                            }
                        });
                        return rst;
                    } else {
                        return "";
                    }
                },
                year: function (value) {
                    if (this.required(value)) {
                        return /^\d{4}$/g.test(value);
                    }
                    else {
                        return "";
                    }
                },
                ip: function (value) {
                    if (this.required(value)) {
                        if ("/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g".test(value)) {
                            if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) {
                                return true;
                            }
                        }
                        return false;
                    } else {
                        return "";
                    }
                },
                cn: function (value) {
                    if (this.required(value)) {
                        return /^[\u4e00-\u9fa5]*$/.test(value);
                    } else {
                        return "";
                    }
                },
                en: function (value) {
                    if (this.required(value)) {
                        return /^[a-zA-Z]*$/.test(value);
                    } else {
                        return "";
                    }
                },
                login: function (value) {
                    if (this.required(value)) {
                        return /^(?=\S*?[a-zA-Z])(?=\S*?[0-9])\S{5,16}$/.test(value);
                    } else {
                        return "";
                    }
                },
                tel: function (value) {
                    if (this.required(value)) {
                        return /^(?:\d{11}|(?:\d{3,4}-?)?\d{7,8})$/.test(value);
                    } else {
                        return "";
                    }
                },
                telPhone: function (value) {
                    if (this.required(value)) {
                        return /^1[3|4|5|7|8]\d{9}$/.test(value);
                    } else {
                        return "";
                    }
                },
                idcard: function (value) {
                    if (this.required(value)) {
                        return /(^\d{15}$)|(^\d{17}([0-9]|X)$)/.test(value);
                    } else {
                        return "";
                    }
                },
                password: function (value) {
                    if (this.required(value)) {
                        return /^(?=\S*?[a-zA-Z])(?=\S*?[`~!@#$%^&*()_+\-=\[\]{}\\|;:'"<,>.?/])(?=\S*?[0-9])\S+$/.test(value);
                    } else {
                        return "";
                    }
                }
            }
        }
    });
    //#endregion

    //region dropDownList
    var guid;//opts配置key
    var opts = [];//保存页面所有的下拉树配置
    $.fn.extend({
        dropdownTree: function (setting) {
            var opt;
            var $this = $(this);

            if (typeof setting == 'string') {

                guid = $this.attr('guid');
                opt = opts[guid];
                switch (setting) {
                    case "setValue":
                        if (typeof (arguments[1]) == "undefined") {
                            return;
                        }
                        var val = arguments[1].toString();
                        setVal(opt.tableName, opt.colName, val);
                        break;
                }
            }

            var self = $.extend({}, {
                render: $(document.body),
                url: '',
                tableName: '',//字典所属表名
                colName: '',//列名
                onClick: null,
                onDblClick: null,
                defaultVal: undefined,
                hiddenId: ''//隐藏域Id
            }, setting);

            guid = $this.attr('guid') || newGuid();  // 有guid的情况下不需要再生成
            opts[guid] = self;
            $this.attr('guid', guid);

            if (!$this.is('input[type="text"]')) {
                console.warn('初始化对象类型不符');
            }

            var nameId = $this.attr('id');
            if ($.isNull(nameId)) {
                nameId == $this.attr('guid');
                if ($.isNull(nameId)) nameId = newGuid();
                //$this.attr('id',nameId);
            }

            var contentId = nameId + '_content', treeId = nameId + '_tree';
            var hiddenId = self.hiddenId;//隐藏域Id
            var defaultVal = self.defaultVal;//默认值

            var contentWd = $this.parent().outerWidth();//当前元素宽度
            var innerHtml = '<div id="' + contentId + '" class="menuContent noselect" style="display:none; position: absolute;background-color:#f0f6e4;border: 1px solid rgb(178, 178, 178);"><ul id="' + treeId + '" style="margin-top:0px; width:' + contentWd + 'px;"></ul></div>';
            self.render.after(innerHtml);

            $this.bind('click', function () {
                showMenu();
            });

            if ($.isNotNull(defaultVal)) {
                //加载默认值
                setVal(self.tableName, self.colName, defaultVal);
            }

            var requestUrl = '';
            if ($.isNotNull(self.url)) {
                requestUrl = self.url;
            } else if ($.isNull(requestUrl) && $.isNotNull(self.tableName)) {
                requestUrl = encodeURI("/公共/树形控件/getTreeData?type=" + self.tableName);
            }
            $.isNotNull(requestUrl)
            {
                $("#" + treeId).tree({
                    url: requestUrl,
                    animate: false,
                    onClick: function (node) {
                        if (node && node.id) {
                            if ($.isNotNull(self.onClick) && typeof self.onClick == 'function') {
                                return self.onClick(node, treeId);
                            } else {
                                onclick(node);
                            }
                        }
                    },
                    onDblClick: function (node) {
                        if (node && node.id) {
                            if (node.state != "open") {
                                $(this).tree('expand', node.target);
                            } else {
                                $(this).tree('collapse', node.target);
                            }
                            try {
                                if ($.isNotNull(self.onDblClick) && typeof self.onDblClick == 'function') {
                                    return self.onDblClick(node, $("#" + treeId));
                                }
                            } catch (e) {
                            }
                        }
                    }
                });
            }

            //默认点击事件
            function onclick(selNode) {
                if (selNode == null) {
                    selNode = $('#' + treeId).tree('getSelected');
                }
                if (selNode) {
                    if (selNode.children == null) {
                        $this.val(selNode.text);//名称
                        if ($.isNotNull(hiddenId)) {
                            $("#" + hiddenId).val(selNode.id);//编号
                        }
                        hideMenu();
                    } else {
                        //jBoxTip(selNode.text+"节点不是最小节点");
                        return;
                    }
                }
            }

            function setVal(tableName, colName, defVal) {

            }

            //显示
            function showMenu() {
                var thisOffset = $this.offset();
                $("#" + contentId).css({
                    left: thisOffset.left + "px",
                    top: thisOffset.top + $this.outerHeight() + "px",
                    width: $this.width()
                }).slideDown("fast");

                $("body").bind("mousedown", onBodyDown);
            }

            //隐藏
            function hideMenu() {
                $("#" + contentId).fadeOut("fast");
                $("body").unbind("mousedown", onBodyDown);
            }

            //鼠标点击下拉树其他区域时隐藏
            function onBodyDown(event) {
                if (!(event.target.id == contentId || $(event.target).parents("#" + contentId).length > 0)) {
                    hideMenu();
                }
            }
        }
    });
    //endregion
})(window, jQuery)