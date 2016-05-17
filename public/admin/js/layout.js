/**
 * Created by wjc on 2016/4/15.
 */
$(function(){
    var i=0;
    var financeOn=$("#financeOn").val();
    if(financeOn){
        $(this).find(".ui-son").show();
    }
    $(".sidebar-menu li").click(function(){
        if(i==0){
            $(this).find(".ui-son").show();
            $(this).siblings().find(".ui-son").hide();
            i=1;
        }else{
            $(this).find(".ui-son").hide();
            i=0;
        }
    });
});

function deleteData(id,dataType) {
    var params = {"id": id, "deleted": true};
    if(confirm('你确定删除吗?')){
        $.ajax({
            type: "POST",
            url: "/admin/"+dataType+"/delete",
            data: params,
            success: function () {
                window.location.reload();
            },
            error: function () {
                alert('删除失败!');
            }
        });
    }
}

var lesnho = lesnho || {};
lesnho.locale = lesnho.locale || {};
lesnho.locale.daterangepicker = {
    "format": "YYYY-MM-DD",
    "separator": " ~ ",
    "applyLabel": "确定",
    "cancelLabel": "清除",
    "fromLabel": "从",
    "toLabel": "到",
    "customRangeLabel": "定制",
    "daysOfWeek": [
        "日",
        "一",
        "二",
        "三",
        "四",
        "五",
        "六"
    ],
    "monthNames": [
        "1月",
        "2月",
        "3月",
        "4月",
        "5月",
        "6月",
        "7月",
        "8月",
        "9月",
        "10月",
        "11月",
        "12月"
    ],
    "firstDay": 1
};

