/**
 * Created by johnny - zhaoe
 * Date: 2019/4/11
 * Time: 11:26
 */
globe.namespace('ze.form.validate');
globe.ze.form.validate.parseFormatNum = function (number, n) {
    if(number==undefined||number=='') return;
    if (isNaN(number)) return;
    if (n != 0) {
        n = (n > 0 && n <= 20) ? n : 2;
    }
    number = parseFloat((number + "").replace(/[^\d\.-]/g, "")).toFixed(n) + "";
    var sub_val = number.split(".")[0].split("").reverse();
    var sub_xs = number.split(".")[1];
    var show_html = "";
    for (i = 0; i < sub_val.length; i++) {
        show_html += sub_val[i] + ((i + 1) % 3 == 0 && (i + 1) != sub_val.length ? "," : "");
    }
    if (n == 0) {
        return show_html.split("").reverse().join("");
    } else {
        return show_html.split("").reverse().join("") + "." + sub_xs;
    }
};

globe.ze.form.validate.isNumber=function (number) {
    if (new RegExp(/^-?(?:\d+|\d{1,3}(?:,\d{3})+)?(?:\.\d+)?$/).test(number)) {
        return true;
    }else {
        return false;
    }
};
