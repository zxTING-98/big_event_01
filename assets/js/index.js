// 入口函数
$(function () {
    // 需求1: 获取用户信息,并渲染头像
    getUserInfo();

    // 需求4:退出
    let layer = layui.layer
    $('#btnLogout').on('click', function () {
        // 弹出对话框
        layer.confirm('确定退出登录', { icon: 3, title: '提示' }, function (index) {
            // 关闭对话框
            layer.close(index);
            // 跳转到login.html
            location.href = '/login.html'
            // 消除token
            localStorage.removeItem('token');
        });
    })
});

// 函数的封装要写到入口函数的外面,其他页面也要用到这个方法
// 因为跨越了页面,所以必须为全局函数
function getUserInfo() {
    // 发送ajax
    $.ajax({
        method: "GET",
        url: "/my/userinfo",
        // 所有的头信息都可以用过这个属性配置
        /* headers: {
            // 拿不到获取空字符串
            Authorization: localStorage.getItem('token') || ""
        }, */
        success: function (res) {
            // console.log(res);
            // 状态校验
            if (res.status != 0) {
                return layui.layer.msg(res.message);
            }
            // 成功不用提示,但要渲染头像和名称
            renderAvatar(res.data);

        },
        // ajax接收数据完成
        /* complete: function (res) {
             console.log(res);
             let obj = res.responseJSON;
             if (obj.status == 1 && obj.message == "身份认证失败！") {
                 // 强制跳转到登录页面
                 location.href = '/login.html';
                 // 清除token
                 localStorage.removeItem('token');
             }
     } */
    })
};

// 封装渲染方法
function renderAvatar(user) {
    // 1.昵称渲染 
    // 如果有nickname用(优先获取昵称) ,没有用username
    let name = user.nickname || user.username
    $('#welcom').html('欢迎&emsp;' + name)
    // 2.头像渲染
    // user_pic != null
    if (user.user_pic) {
        // 有图片头像: 显示图片头像,赋值src,隐藏图片头像
        $('.text-avatar').hide();
        $('.layui-nav-img').show().attr('src', user.user_pic);
    } else {
        // 没有图片头像: 显示文字头像,赋值html(),隐藏图片头像
        // 取名称的第一个并大写
        $('.layui-nav-img').hide();
        let text = name[0].toUpperCase();
        $('.text-avatar').show().html(text);
    }
}