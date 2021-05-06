// 入口函数
$(function () {
    // $() == DOMContentLoaded
    // 需求1:点击a链接,显示隐藏指定区域
    $('#link_reg').on('click', function () {
        // 登录区域隐藏 注册区域显示
        $('.login-box').hide();
        $('.reg-box').show();
    })
    $('#link_login').on('click', function () {
        // 登录区域显示 注册区域隐藏
        $('.login-box').show();
        $('.reg-box').hide();
    })

    // 需求2:自定义校验规则
    console.log(layui);
    // 导出form属性
    let form = layui.form;
    // 通过form中的verify方法定义校验规则
    // 参数是对象
    form.verify({
        // 属性是校验规则名称,值就是校验规则
        pwd: [
            /^[\S]{6,16}$/,
            "密码必须6-16位,且不能输入空格"
        ],

        // 定义确认密码规则
        repwd: function (value) {
            // value 获取的是确认密码的值
            // 验证密码和确认密码是否相同
            let pwd = $('.reg-box input[name=password]').val().trim()
            if (value != pwd) {
                return '两次输入的密码不一致';
            }
        }
    });

    // 需求3:注册
    let layer = layui.layer
    $('#form_reg').on('submit', function (e) {
        //阻止表单默认提交
        e.preventDefault();
        //发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#form_reg input[name=username]').val(),
                password: $('#form_reg input[name=password]').val(),
            },
            success: function (res) {
                // console.log(res);
                // 返回状态判断
                if (res.status != 0) {
                    // return alert(res.message);
                    return layer.msg(res.message, { icon: 5 });
                }
                // 提交成功后处理代码
                layer.msg(res.message, { icon: 6 });
                // 优化: 跳转到登录窗口,美化弹窗,清空表单
                $('#link_login').click();
                $('#form_reg')[0].reset();
            }
        })
    })

    // 需求4:登录
    $('#form_login').on('submit', function (e) {
        // 阻止表单默认提交
        e.preventDefault();
        // 发送ajax
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),
            success: function (res) {
                // console.log(res);
                // 状态校验
                if (res.status != 0) {
                    return layer.msg(res.message, { icon: 5 });
                }
                // 成功后,保存token,页面跳转,弹窗(可不写)
                layer.msg(res.message, { icon: 6 });
                localStorage.setItem('token', res.token);
                // BOM中跳转
                window.location.href = '/index.html'
            }
        })
    })

});