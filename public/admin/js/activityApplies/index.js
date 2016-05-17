/**
 * Created by wjc on 2016/4/15.
 */
function downloadExcel(){
    var data=$("#activityApply_form").serialize();
    var url="/admin/activityApplies/exportExcel?"+data;
    window.location=url;
};