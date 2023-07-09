; (function (window, jQuery) {
    function request(config) {
        return $.ajax({ //ajax底层是promise,直接返回promise对象
            url: config.url || '',
            method: config.method || 'GET',
            timeout: config.timeout || 5000,
            data: config.data || {},
            headers: config.headers || {},
            //实现默认值
            ...config
        })
    }
    //get-->$get
    function get(url, data, config) {
        return request({
            url,
            method: 'GET',
            data,
            ...config
        })
    }

    //post-->$post
    function post(url, data, config) {
        return request({
            url,
            method: 'POST',
            data,
            ...config
        })
    }

    window.HYHReq = {
        request,
        get,
        post
    }
})(window, jQuery)