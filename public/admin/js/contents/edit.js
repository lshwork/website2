/**
 * Created by wjc on 2016/4/15.
 */
$(function(){
    var kingEditorParams ={
        filePostName  : "file",
        uploadJson :'/admin/pic/upload',  //http://upload.qiniu.com/ /admin/pic/uploadKindEditor/'+$("#imageType").val()
        dir : "image",
        extraFileUploadParams:{
            kingEditor: "kingEditor"
        }
    };
    var newsAddEditor=KindEditor.create("#contentsForm [name=content]", kingEditorParams);
});

