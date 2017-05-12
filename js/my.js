function GetRequest() {
    var url = location.search;
    var theReq = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        var strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            theReq[strs[i].split("=")[0] = unescape(strs[i].split("=")[1])];
        }
    }
    return theReq;
}
