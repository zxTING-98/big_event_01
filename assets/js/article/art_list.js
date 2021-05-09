$(function () {
    // 0.日期函数

    template.defaults.imports.dataFormat = function (dtStr) {
        let dt = new Date(dtStr);
        let y = dt.getFullYear();
        let m = padZero(dt.getMonth() + 1);
        let d = padZero(dt.getDate());
        let HH = padZero(dt.getHours());
        let MM = padZero(dt.getMinutes());
        let SS = padZero(dt.getSeconds());
        return `${y}-${m}-${d} ${HH}:${MM}:${SS}`;
    }
    // 补0
    function padZero(n) {
        return n < 10 ? '0' + n : n;
    }


    // 1.定义查询参数(往后要用)
    let q = {
        pagenum: 1,       // 页码值
        pagesize: 2,     // 每页显示多少条数据
        cate_id: '',      // 文章分类的 Id
        state: '',        // 文章的状态，可选值有：已发布、草稿
    }

    // 渲染文章列表
    // 先定义 再调用
    let layer = layui.layer;
    let form = layui.form;
    initTable();

    function initTable() {
        $.ajax({
            method: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                // console.log(res);
                // 校验
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 传对象用属性
                let str = template('tpl-table', { data: res.data });
                $('tbody').html(str);
                // 做分页
                renderPage(res.total)
            }
        });
    }

    // 3.初始化文章分类
    initCate();
    function initCate() {
        $.ajax({
            url: "/my/article/cates",
            success: function (res) {
                // console.log(res);
                if (res.status != 0) {
                    return layer.msg(res.message)
                }
                // 成功后渲染
                let str = template('tpl-cate', res);
                $('[name=cate_id]').html(str);
                // console.log(str);
                // 页面中的select 单选框 复选框样式不好更改,框架会以li dl等模拟以上的功能
                form.render();
            }
        });
    }


    // 4.筛选
    $('#search').on('submit', function (e) {
        e.preventDefault();
        // 修改参数
        //  点击任意一个option,option的value会赋值给select
        // 修改q里的值
        q.cate_id = $('[name=cate_id]').val();
        q.state = $('[name=state]').val();
        // 调用方法
        initTable();
    })


    // 5.分页
    function renderPage(total) {
        var laypage = layui.laypage;
        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            limit: q.pagesize,  //每页显示的条数
            curr: q.pagenum, //启示页面
            // 自定义排版
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 20],  // 每页多少选择框
            // 跳转页面到的回调函数
            jump: function (obj, first) {
                //obj包含了当前分页的所有参数，比如：
                //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                //console.log(obj.limit); //得到每页显示的条数

                // 改变当前页
                q.pagenum = obj.curr;
                // 改变一页显示多少
                q.pagesize = obj.limit;
                //首次不执行
                if (!first) {
                    initTable();
                }
            }
        });
    }

    // 6.删除 事件委托
    $('tbody').on('click', '.btn-del', function () {
        // 弹窗之外
        let Id = $(this).attr('data-id');
        layer.confirm('是否确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + Id,
                success: function (res) {
                    // console.log(res);
                    if (res.status != 0) {
                        return layer.msg(res.message)
                    }
                    layer.msg('删除成功')

                    // 删除最后一条时会出现bug ,不显示调整页的数据,因为最后发送的是删除那页的ajax
                    // 在重新渲染之前,被删除的元素依然存在(后台没有了)
                    // 判断删除后数据渲染前为最后一个元素,表示当前页面没有数据了,但没渲染
                    // 利用删除按钮判断,并且只剩一页时不允许减1;
                    if ($('.btn-del').length == 1 && q.pagenum > 1) {
                        q.pagenum--;
                    }

                    // 重新渲染列表
                    initTable();
                    // 关闭对话框
                    layer.close(index);
                }
            })
        });

    })

})