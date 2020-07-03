$(function() {
});

function save() {
    var formJson = $("#infoForm").serializeJson();
    $.ajax({
        url: '/news/update',
        data: formJson,
        contentType: "application/json;charset=utf-8",
        dataType: "json",
        type: 'post',
        async: false,
        success: function (result) {
            var code = result.code;
            if (code == 200) {
                var data=result.data;
                // $('#txt_id').val(data.id);
                $('#info_h3').text(data);
            }
        }
    });
}