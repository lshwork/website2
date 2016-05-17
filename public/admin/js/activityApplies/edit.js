/**
 * Created by wjc on 2016/4/15.
 */
$(function(){
    $('#birthday').datepicker({
        format: 'yyyy-mm-dd',
        language: 'zh-CN',
        autoclose: true,
        todayHighlight: true
    });
    $('#sex').bootstrapSwitch({
        onText: '男',
        offText: '女',
        onColor: 'info'
    });
});