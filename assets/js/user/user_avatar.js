$(function () {
    // 1.1 获取裁剪区域的 DOM 元素
    var $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }

    // 1.3 创建裁剪区域
    $image.cropper(options)

    // 2. 点击按钮触发input
    $('#btnChooseImg').on('click', function () {
        $('#file').click();
    })

    // 3.选择图片渲染到页面
    let layer = layui.layer
    $('#file').on('change', function () {
        // 获取文件
        let file = this.files[0];
        // 非空校验
        if (file === undefined) {
            return layer.msg('必须设置头像!')
        }
        // 根据文件创建虚拟路径
        let newImgURL = URL.createObjectURL(file);
        $image
            .cropper('destroy')//销毁预览区域内容
            .attr('src', newImgURL) //设置路径
            .cropper(options); // 重新渲染
    })

    // 4.上传头像(base64)
    $('#btnUpload').on("click", function () {
        var dataURL = $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 100,
                height: 100
            })
            .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
        $.ajax({
            method: "POST",
            url: "/my/update/avatar",
            data: {
                avatar: dataURL
            },
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('头像修改成功')
                // 刷新页面
                window.parent.getUserInfo();
            }
        });
    })
})