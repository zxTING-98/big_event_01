$(function () {
    // 1.定义3个校验规则
    let form = layui.form;
    form.verify({
        // 密码规则
        pwd: [
            /^[\S]{6,16}$/
            , '密码必须6到16位，且不能出现空格'
        ],
        // 新密码规则
        samePwd: function (value) {
            // value为新密码,获取原密码,相同就返回错误信息
            let v1 = $('input[name=oldPwd]').val();
            if (value == v1) {
                return '新密码与原密码相同,请重新输入!'
            }
        },
        // 确认新密码必须与新密码相同
        rePwd: function (value) {
            // 不相同报错
            let v2 = $('input[name=newPwd]').val();
            if (value != v2) {
                return '两次密码输入不一致'
            }
        }
    })

    // 修改密码
    $('#formPwd').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: "POST",
            url: "/my/updatepwd",
            // 多传了一个值
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layui.layer.msg(res.message)
                }
                layui.layer.msg('修改密码成功')
                // 重置form表单
                $('#formPwd')[0].reset();
                // 跳转页面 但在父页面跳转
                // window.parent.location.href = '/login.html';
            }
        });
    })
})