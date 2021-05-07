// 入口函数
$(function () {
    // 1.定义校验规则
    let form = layui.form;
    form.verify({
        // 用户昵称 1-6位
        nickname: function (value) {
            // 判断错误的情况
            if (value.length > 6) {
                return '昵称长度必须在1~6位之间'
            }
        }
    });

    // 2.把用户信息渲染到form表单中
    initUserInfo();
    let layer = layui.layer;
    function initUserInfo() {
        $.ajax({
            method: "GET",
            url: "/my/userinfo",
            success: function (res) {
                console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // res.data的值赋值给某个form
                // 属性名要一一对应
                form.val("formUserInfo", res.data);
            }
        });
    }

    // 3.重置按钮是按照html中表单的默认值进行设置的
    // 需要的是用户原来的数据
    $('#btnReset').on('click', function (e) {
        e.preventDefault();
        // 重新渲染用户
        initUserInfo();
    })

    // 4.修改用户信息
    $('#formUserInfo').on('submit', function (e) {
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status != 0) {
                    return layer.msg(res.message);
                }
                // 成功提示
                layer.msg('用户信息修改成功')
                // 调用父页面的头像渲染方法
                //  window.parent 父页面的window
                window.parent.getUserInfo();
            }
        });
    })

});