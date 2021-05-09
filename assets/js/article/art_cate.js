// 入口函数
$(function () {
    // 1.渲染文章分类列表
    initArtCateList();
    // 封装
    let layer = layui.layer;
    function initArtCateList() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                // 校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 利用模板引擎渲染
                // 传的是对象,用的是属性
                let str = template('tpl-art-cate', res);
                $('tbody').html(str)
            }
        });
    }

    // 添加窗口展示
    let indexAdd;
    $('#btnAdd').on('click', function () {
        indexAdd = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edd').html()
        });
    })

    // 3.添加文章分类,事件委托
    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('添加成功')
                // 重新渲染列表
                initArtCateList();
                // 关闭对话框
                layer.close(indexAdd);
            }
        });
    })

    // 4.修改内容, 事件委托
    let indexEdit;
    // 渲染数据
    let form = layui.form;
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $('#dialog-edit').html()
        });
        // 弹窗后立即赋值 属性获取和ajax要写到带点击事件里面
        let Id = $(this).attr('data-id');
        $.ajax({
            method: "GET",
            // 删除冒号,不删除斜线
            url: "/my/article/cates/" + Id,
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                form.val("form-edit", res.data)
            }
        });
    })

    // 5.修改,事件委托
    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                layer.msg('修改成功')
                // 重新渲染列表
                initArtCateList();
                // 关闭对话框
                layer.close(indexEdit);
            }
        });
    })

    // 6.删除,事件委托
    $('tbody').on('click', '.btn-delete', function () {
        let Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + Id,
                data: $(this).serialize(),
                success: function (res) {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')
                    // 重新渲染列表
                    initArtCateList();
                    // 关闭对话框
                    layer.close(index);
                }
            })
        });
    })
});