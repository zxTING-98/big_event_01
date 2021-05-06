// 开发环境服务器地址
let baseURL = 'http://api-breakingnews-web.itheima.net'
// 测试环境服务器地址
// 生产环境服务器地址


// $.ajaxPrefilter() 在发送和接收ajax的时候都会优先触动($.ajax $.get $.post)
$.ajaxPrefilter(function (params) {
    // 需求1: 在每次ajax发送请求之前,添加路径前缀
    params.url = baseURL + params.url;
    // console.log(params.url);
})