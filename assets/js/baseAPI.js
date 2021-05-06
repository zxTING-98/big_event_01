// 开发环境服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net'
// 测试环境服务器地址
// 生产环境服务器地址


// $.ajaxPrefilter() 在发送和接收ajax的时候都会优先触动($.ajax $.get $.post)
$.ajaxPrefilter(function (params) {
    // 需求1: 在每次ajax发送请求之前,添加路径前缀
    params.url = baseURL + params.url;
    // console.log(params.url);

    // 需求2: url包含/my的设置头信息
    if (params.url.indexOf('/my/') !== -1) {
        params.headers = {
            Authorization: localStorage.getItem('token') || ""
        }
    }

    // 需求3: 登录拦截,ajax中有一个 complete(ajax无论接收成功还是失败都会触发这个方法)
    params.complete = function (res) {
        // console.log(res);
        let obj = res.responseJSON;
        if (obj.status == 1 && obj.message == "身份认证失败！") {
            // 强制跳转到登录页面
            location.href = '/login.html';
            // 清除token
            localStorage.removeItem('token');
        }
    }
})