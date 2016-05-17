/**
 * Created by wjc on 2016/4/15.
 */
$(function(){
    $('#enabled').bootstrapSwitch({
        onText: '开启',
        offText: '关闭',
        onColor: 'info'
    });
    var kingEditorParams ={
        filePostName  : "file",
        uploadJson :'/admin/pic/upload',  //http://upload.qiniu.com/ /admin/pic/uploadKindEditor/'+$("#imageType").val()
        dir : "image",
        extraFileUploadParams:{
            kingEditor: "kingEditor"
        }
    };
    var newsAddEditor=KindEditor.create("#newsForm [name=content]", kingEditorParams);
    var src=$("#imageUrl").val();
    if(src){
        $("#image").fileinput({
            language: 'zh', //设置语言
            allowedFileExtensions: ['JPEG', 'jpeg', 'JPG','jpg','GIF','gif','BMP','bmp','png','PNG'],//接收的文件后缀//.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png
            maxFileCount: 1, //表示允许同时上传的最大文件个数
            initialPreview: [
                "<img style='height:160px' src='"+src+"'>",
            ],
            initialPreviewConfig: [
                {caption: "", width: "120px", url: "/admin/image/delete", key: src},
            ],
            autoReplace:true,
            showClose: false,
            showRemove: false,
            showCaption: false,
            uploadUrl: '/admin/pic/upload'
        }).on("fileuploaded",function(event, data, previewId, index) {
            $("#imageUrl").val(data.response.key);
        }).on("filepredelete", function(event,key) {
            var abort = true;
            if (confirm("你确定要删除这张图片?")) {
                abort = false;
                $("#imageUrl").val('');
            }
            return abort;
        });
    }else{
        $("#image").fileinput({
            uploadUrl:  '/admin/pic/upload',
            language: 'zh', //设置语言
            allowedFileExtensions:['JPEG', 'jpeg', 'JPG','jpg','GIF','gif','BMP','bmp','png','PNG'],//接收的文件后缀
            maxFileCount: 5,//表示允许同时上传的最大文件个数
            showClose: false,
            showRemove: false,
            showCaption: false,
            autoReplace: true,
            maxFileSize: 1024,
        }).on("fileuploaded",function(event, data, previewId, index) {
            $("#imageUrl").val(data.response.key);
        }).on('filepredelete', function(event,key) {
            var abort = true;
            if (confirm("你确定要删除这张图片?")) {
                abort = false;
                $("#imageUrl").val('');
            }
            return abort;
        });
    }
});

