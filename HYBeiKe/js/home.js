$(function () {

    var $searchHouseTnput = $('.header .house-search')
    var $seacrhList = $('.header .search-list')
    var $seacrhTips = $('.header .search-tips')
    var $seacrhMenuUL = $('.header .search-menu > ul')
    var $searchArrow = $('.header .arrow')
    //缓存

    var cacheSearchListData = [] //缓存数据
    var homePageInfoData = {} //首页所有数据

    var currentSearchPlaceHolder = '请输入区域,商圈或小区名开始找房'//input默认显示
    var currentSearchBarSelector = 'site'
    //初始化页面函数
    initPage()



    $searchHouseTnput.on('focus', function () {
        //有输入就检索
        var value = $(this).val()
        if (value.trim()) {
            //搜索房子(通过代码模拟用户的输入事件)
            $(this).trigger('input')
            return
        }
        //如果没有输入就默认热门推荐
        if (cacheSearchListData.length) {
            renderHeaderList(cacheSearchListData)
        }

        HYHReq.get(HYHApi.HOT_RECOMMEND)
            .then(function (res) {
                // console.log(res);
                var searchListData = res.rent_house_list.list || []

                searchListData = searchListData.map((item) => {
                    return {
                        title: item.app_house_title
                    }
                })


                cacheSearchListData = searchListData


                renderHeaderList(cacheSearchListData)
                // var htmlString = `<li><span>热门搜索</span></li>`
                // searchListData.forEach(item => {
                //     htmlString += `<li><span>${item.title}</span></li>`
                // });


                // $seacrhList.empty().append(htmlString)
                // 
            })
    })

    $searchHouseTnput.on('blur', function () {
        $seacrhTips.css('display', 'none')
    })

    $searchHouseTnput.on('input', debounce(
        function () {
            var value = $(this).val()
            // console.log(value);
            var curLocation = homePageInfoData.curLocation
            HYHReq.get(HYHApi.HOME_SEARCH, {
                cityId: curLocation.cityCode,
                cityName: curLocation.city,
                channel: currentSearchBarSelector,
                keyword: value,
                query: value
            })
                .then(function (res) {
                    console.log(res);
                    var searchData = res.data.result || []
                    searchListData = searchData.map(function (item) {
                        return {
                            title: item.hlsText || item.text
                        }
                    })
                    renderHeaderList(searchListData)
                })
        }
    ))

    $seacrhMenuUL.on('click', 'li', function () {
        //切换高亮
        var $li = $(this)
        $li.addClass('active').siblings().removeClass('active')

        //移动箭头
        var liWidth = $li.width()
        var position = $li.position()//相对与父亲的定位
        var leftL = liWidth / 2 + position.left
        $searchArrow.css('left', leftL)

        //修改placeholder
        $searchHouseTnput.prop({
            placeholder: currentSearchPlaceHolder + $li.text()
        })

        //拿到li中绑定的key
        // console.log($li.data('key'));
        currentSearchBarSelector = $li.data('key')

    })

    //初始化渲染
    function initPage() {
        //首页数据

        HYHReq.get(HYHApi.HOME_PAGE_INFO)
            .then(function (res) {
                homePageInfoData = res
                //渲染头部地址
                renderHeaderAddress(res)
                //渲染搜索栏2
                renderSearchBar(res)
            })
    }

    //渲染搜索栏
    function renderSearchBar(res) {
        var searchBarData = res.searchMenus || []
        // console.log(searchBarData);
        var htmlString = ''
        searchBarData.forEach(function (item, index) {
            var active = index === 0 ? 'active' : ''
            htmlString += `<li class="item ${active}" data-key="${item.key}"><span>${item.title}</span></li>`
        })
        $seacrhMenuUL.empty().append(htmlString)
    }


    // 渲染列表
    function renderHeaderList(searchListData = []) {

        var htmlString = `<li><span>热门搜索</span></li>`
        searchListData.forEach(item => {
            htmlString += `<li><span>${item.title}</span></li>`
        });


        $seacrhList.empty().append(htmlString)
        $seacrhTips.css('display', 'block')
    }

    //更新地址
    function renderHeaderAddress(res) {
        let addr = res.curLocation || '焦作'
        $('.header .address').text(addr.city)
    }
})