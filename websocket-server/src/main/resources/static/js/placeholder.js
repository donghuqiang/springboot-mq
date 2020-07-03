/**
 * 源码名称：placeholder.js
 * 实现功能：让低版本的浏览器(主要是IE8)支持placeholder
 * 作者主页：http://www.miaoqiyuan.cn/
 * 联系邮箱：mqycn@126.com
 * 使用说明：http://www.miaoqiyuan.cn/p/placeholder-js
 * 最新版本：https://gitee.com/mqycn/placeholder.js
 */

(function() {
    //仅在不支持 placeholder 的时候执行
    if (!('placeholder' in document.createElement('input'))) {

        var listenerName = 'attachEvent';
        var listenerPrefix = 'on';
        if ('addEventListener' in window) {
            listenerName = 'addEventListener';
            listenerPrefix = '';
        }

        window[listenerName](listenerPrefix + 'load', function() {
            var placeholderListener = {
                //添加输入项
                add: function(tagName) {
                    var list = document.getElementsByTagName(tagName);
                    for (var i = 0; i < list.length; i++) {
                        this.render(list[i]);
                    }
                    return this;
                },
                //渲染
                render: function(input) {
                    var text = input.getAttribute('placeholder');
                    if (!!text) {
                        this.attachEvent(input, this.getPlaceholderDiv(input, text));
                    }
                },
                //设置样式
                getPlaceholderDiv: function(input, text) {
                    var placeholderDiv = document.createElement('div');

                    placeholderDiv.style.position = 'absolute';
                    placeholderDiv.style.width = this.getPosition(input, 'Width') + 'px';
                    placeholderDiv.style.height = this.getPosition(input, 'Height') + 'px';
                    placeholderDiv.style.color = '#91D3F8';
                    placeholderDiv.style.textIndent = '5px';
                    placeholderDiv.style.zIndex = 999;
                    placeholderDiv.style.background = input.style.background;
                    placeholderDiv.style.border = input.style.border;
                    placeholderDiv.style.cursor = 'text';
                    placeholderDiv.innerHTML = text;

                    if ('TEXTAREA' == input.tagName.toUpperCase()) {
                        placeholderDiv.style.lineHeight = '35px';
                    } else {
                        placeholderDiv.style.lineHeight = placeholderDiv.style.height;
                    }
                    document.getElementsByTagName('body')[0].appendChild(placeholderDiv);
                    
                    //窗口改变大小时自动调整位置
                    placeholderDiv.resize = (function(that){
                        return function(){
                            placeholderDiv.style.left = that.getPosition(input, 'Left') + 'px';
                            placeholderDiv.style.top = that.getPosition(input, 'Top') + 'px';
                        }
                    })(this);
                    window[listenerName](listenerPrefix + 'resize', placeholderDiv.resize);
                    placeholderDiv.resize();
                    
                    return placeholderDiv;
                },
                //计算当前输入项目的位置
                getPosition: function(input, name, parentDepth) {
                    var offsetName = 'offset' + name;
                    var offsetVal = input[offsetName];
                    var parentDepth = parentDepth || 0;
                    if (!offsetVal && parentDepth < 3) {
                        offsetVal = this.getPosition(input.parentNode, name, ++parentDepth);
                    }
                    return offsetVal;
                },
                //添加事件
                attachEvent: function(input, placeholderDiv) {

                    //激活时，隐藏 placeholder
                    input[listenerName](listenerPrefix + 'focus', function() {
                        placeholderDiv.style.display = 'none';
                    });

                    //失去焦点时，隐藏 placeholder
                    input[listenerName](listenerPrefix + 'blur', function(e) {
                        if (e.srcElement.value == '') {
                            placeholderDiv.style.display = '';
                        }
                    });

                    //placeholder 点击时，对应的输入框激活
                    placeholderDiv[listenerName](listenerPrefix + 'click', function(e) {
                        e.srcElement.style.display = 'none';
                        input.focus();
                    });
                    
                    if( input.value !== '' ){
                        placeholderDiv.style.display = 'none';
                    }
                },

            };

            //防止在 respond.min.js和html5shiv.min.js之前执行
            setTimeout(function() {
                placeholderListener.add('input').add('textarea');
            }, 0);
        });
    }
})();