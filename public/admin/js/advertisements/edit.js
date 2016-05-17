/**
 * Created by wjc on 2016/4/15.
 */
var LSH={
    kingEditorParams : {
        filePostName  : "image",
        uploadJson : '/admin/pic/upload/'+$("#imageType").val(),
        dir : "image"
    },
    init : function(data){
        this.initOnePicUpload();
    },
    /**
     * 初始化单图片上传组件 <br/>
     * 选择器为：.onePicUpload <br/>
     * 上传完成后会设置input内容以及在input后面追加<img>
     */
    initOnePicUpload : function(){
        var count=0;
        $(".onePicUpload").click(function(){
            var _self = $(this);
            KindEditor.editor(LSH.kingEditorParams).loadPlugin('image', function() {
                this.plugin.imageDialog({
                    showRemote : false,
                    clickFn : function(url, title, width, height, border, align) {
                       // var input = _self.siblings("input");
                        var upload=$("#upload");
                        //input.parent().find("img").remove();
                        var imgId="image"+count;
                        var inputId="input"+count;
                        //input.val(url);
                        upload.after("<li id='"+imgId+"' style='list-style:none'><a href='"+url+"' style='display:block;float:left;margin-left:10px' target='_blank'><img  src='"+url+"' width='80' height='50'/></a>"+"<a  href='javascript:void(0);' onClick=deleteImage("+count+",'"+url+"') style='display: block;float: left;' >"+"<img alt='删除' src='/public/admin/img/delete.jpg' style='width:15px;height:15px;' ></a></li>");
                        count++;
                        $("#imageType").after("<input id='"+inputId+"' type='hidden' name='images' value='"+url+"'>");
                        this.hideDialog();
                    }
                });
            });
        });
    }
};
function deleteImage(count,url){
    if(confirm('你确定删除吗?')){
        $("#image"+count).remove();
        $("#input"+count).remove();
        var params = {url: "."+url};
        $.ajax({
            type: "POST",
            url: "/admin/advertisements/deleteImage",
            data: params,
            success: function () {
            },
            error: function () {
            }
        });
    }
};
/*function changeInputFile(imageName) {
    var reg=/^[a-zA-Z]:(\\.+)(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png)$/;
    if(!reg.test($(imageName).val())){
        alert('文件格式不正确!只能上传图片');
        $(imageName).val('');
    }
};*/

function fileChange(target) {
    var fileSize = 0;
    if (!target.files) {
        var filePath = target.value;
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile (filePath);
        fileSize = file.Size;
    } else {
        fileSize = target.files[0].size;
    }
    var size = fileSize / 1024;
    if(size>1000){
        alert("附件不能大于2M");
        target.value="";
        return
    }
    var name=target.value;
    var fileName = name.substring(name.lastIndexOf(".")+1).toLowerCase();
    if(fileName !="jpg" && fileName !="jpeg" && fileName !="pdf" && fileName !="png" && fileName !="dwg" && fileName !="gif" ){
        alert("请选择图片格式文件上传(jpg,png,gif,dwg,pdf,gif等)！");
        target.value="";
        return
    }
}
$(function(){
    /*LSH.init({fun:function(node){
    }});*/
    var images=$("input[name='images']");
    var initialPreview=new Array();
    var initialPreviewConfig=new Array();
    images.each(function(){
        var url=$(this).val();
        /*var path=url.substr(domain.length,url.length);*/
        initialPreview.push("<img style='height:160px' src='"+$(this).val()+"'>");
        initialPreviewConfig.push({caption: "", width: "120px", url: "/admin/image/delete", key: $(this).val()});
    });
    if(images.length>0){
        $("#image").fileinput({
            language: 'zh', //设置语言
            allowedFileExtensions: ['JPEG', 'jpeg', 'JPG','jpg','GIF','gif','BMP','bmp','png','PNG'],//接收的文件后缀//.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png
            maxFileCount: 5, //表示允许同时上传的最大文件个数
            initialPreview: initialPreview,
            initialPreviewConfig: initialPreviewConfig,
            showClose: false,
            showRemove: false,
            showCaption: false,
            uploadUrl: '/admin/pic/upload',
            uploadExtraData: {
            }
        }).on("fileuploaded",function(event, data, previewId, index) {
            alert(data.response);
            $("#image").after("<input type='hidden' name='images' value='"+data.response.url+"' >");
        }).on("filepredelete", function(event,key) {
            var abort = true;
            if (confirm("图片删除以后无法恢复,确定删除吗?")) {
                abort = false;
                $("input[value*='"+key+"']").remove();
                $("input[value*='undefined']").remove();
            }
            return abort;
        });
    }else{
        $("#image").fileinput({
            uploadUrl: '/admin/pic/upload',
            language: 'zh', //设置语言
            allowedFileExtensions:  ['JPEG', 'jpeg', 'JPG','jpg','GIF','gif','BMP','bmp','png','PNG'],//接收的文件后缀
            maxFileCount: 5, //表示允许同时上传的最大文件个数
            showCaption: false,
            showClose: false,
            showRemove: false,
            uploadExtraData: {
            }
        }).on("fileuploaded",function(event, data, previewId, index) {
            $("#image").after("<input type='hidden' name='images' value='"+data.response.url+"' >");
        }).on('filepredelete', function(event, key) {
            alert(key)
            $("input[value*='"+key+"']").remove();
            $("input[value*='undefined']").remove();
        });
    }
   /* var images=$("input[name='images']");
    var initialPreview=new Array();
    var initialPreviewConfig=new Array();
    images.each(function(){
        var url=$(this).val();
        var path="."+url.substr(url.indexOf('/public'),url.length);
        initialPreview.push("<img style='height:160px' src='"+$(this).val()+"'>");
        initialPreviewConfig.push({caption: "", width: "120px", url: "/admin/pic/deleteImage", key: path});
    });
    if(images.length>0){
        alert(1);
        $("#image").fileinput({
            uploadUrl:  '/admin/pic/upload/'+$("#imageType").val(),
            language: 'zh', //设置语言
            allowedFileExtensions: ['JPEG', 'jpeg', 'JPG','jpg','GIF','gif','BMP','bmp','png','PNG'],//接收的文件后缀//.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png
            maxFileCount: 5, //表示允许同时上传的最大文件个数
            initialPreview: initialPreview,
            initialPreviewConfig: initialPreviewConfig,
            showCaption: false,
            showClose: false,
            showRemove: false
        }).on("fileuploaded",function(event, data, previewId, index) {
            alert(data.response.url);
            images.each(function(){
                var url=$(this).val();
                var path="."+url.substr(url.indexOf('/public'),url.length);
                var params = {url: path};
                $.ajax({
                    type: "POST",
                    url: "/admin/advertisements/deleteImage",
                    data: params,
                    success: function () {
                    },
                    error: function () {
                    }
                });
            });
            images.remove();

            $("#image").after("<input type='hidden' name='images' value='"+data.response.url+"' >");
        }).on("filepredelete", function(event,key) {
            var path=key.substr(key.indexOf('/public'),key.length);
            $("input[value*='"+path+"']").remove();
        });
    }else{
        alert(2);
    }*/
});
