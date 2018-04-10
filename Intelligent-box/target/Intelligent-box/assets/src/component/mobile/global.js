define(function (require, exports, module) {
    var parseQueryString = require('parseQueryString');
    var getParam = function (key) {
        var href = location.href;
        var queryString = href.slice(href.indexOf('?') + 1);
        var params = parseQueryString.parseQueryString(queryString);

        return params[key] || '';
    };

    window.G = {
        userId: getParam('userId'),
        companyId: getParam('companyId')
    };
});
