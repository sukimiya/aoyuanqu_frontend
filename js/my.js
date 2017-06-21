//
/**
 * Copyright (c) 2012 T. Michael Keesey
 * LICENSE: http://opensource.org/licenses/MIT
 */
var sha1;
(function (sha1) {
    var POW_2_24 = Math.pow(2, 24);
    var POW_2_32 = Math.pow(2, 32);

    function hex(n) {
        var s = "",
            v;
        for (var i = 7; i >= 0; --i) {
            v = (n >>> (i << 2)) & 15;
            s += v.toString(16);
        }
        return s;
    }

    function lrot(n, bits) {
        return ((n << bits) | (n >>> (32 - bits)));
    }
    var Uint32ArrayBigEndian = (function () {
        function Uint32ArrayBigEndian(length) {
            this.bytes = new Uint8Array(length << 2);
        }
        Uint32ArrayBigEndian.prototype.get = function (index) {
            index <<= 2;
            return (this.bytes[index] * POW_2_24) + ((this.bytes[index + 1] << 16) | (this.bytes[index + 2] << 8) | this.bytes[index + 3]);
        };
        Uint32ArrayBigEndian.prototype.set = function (index, value) {
            var high = Math.floor(value / POW_2_24),
                rest = value - (high * POW_2_24);
            index <<= 2;
            this.bytes[index] = high;
            this.bytes[index + 1] = rest >> 16;
            this.bytes[index + 2] = (rest >> 8) & 255;
            this.bytes[index + 3] = rest & 255;
        };
        return Uint32ArrayBigEndian;
    })();

    function string2ArrayBuffer(s) {
        s = s.replace(/[\u0080-\u07ff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(192 | code >> 6, 128 | code & 63);
        });
        s = s.replace(/[\u0080-\uffff]/g, function (c) {
            var code = c.charCodeAt(0);
            return String.fromCharCode(224 | code >> 12, 128 | code >> 6 & 63, 128 | code & 63);
        });
        var n = s.length,
            array = new Uint8Array(n);
        for (var i = 0; i < n; ++i) {
            array[i] = s.charCodeAt(i);
        }
        return array.buffer;
    }

    function hash(bufferOrString) {
        var source;
        if (bufferOrString instanceof ArrayBuffer) {
            source = bufferOrString;
        } else {
            source = string2ArrayBuffer(String(bufferOrString));
        }
        var h0 = 1732584193,
            h1 = 4023233417,
            h2 = 2562383102,
            h3 = 271733878,
            h4 = 3285377520,
            i, sbytes = source.byteLength,
            sbits = sbytes << 3,
            minbits = sbits + 65,
            bits = Math.ceil(minbits / 512) << 9,
            bytes = bits >>> 3,
            slen = bytes >>> 2,
            s = new Uint32ArrayBigEndian(slen),
            s8 = s.bytes,
            j, w = new Uint32Array(80),
            sourceArray = new Uint8Array(source);
        for (i = 0; i < sbytes; ++i) {
            s8[i] = sourceArray[i];
        }
        s8[sbytes] = 128;
        s.set(slen - 2, Math.floor(sbits / POW_2_32));
        s.set(slen - 1, sbits & 4294967295);
        for (i = 0; i < slen; i += 16) {
            for (j = 0; j < 16; ++j) {
                w[j] = s.get(i + j);
            }
            for (; j < 80; ++j) {
                w[j] = lrot(w[j - 3] ^ w[j - 8] ^ w[j - 14] ^ w[j - 16], 1);
            }
            var a = h0,
                b = h1,
                c = h2,
                d = h3,
                e = h4,
                f, k, temp;
            for (j = 0; j < 80; ++j) {
                if (j < 20) {
                    f = (b & c) | ((~b) & d);
                    k = 1518500249;
                } else {
                    if (j < 40) {
                        f = b ^ c ^ d;
                        k = 1859775393;
                    } else {
                        if (j < 60) {
                            f = (b & c) ^ (b & d) ^ (c & d);
                            k = 2400959708;
                        } else {
                            f = b ^ c ^ d;
                            k = 3395469782;
                        }
                    }
                }
                temp = (lrot(a, 5) + f + e + k + w[j]) & 4294967295;
                e = d;
                d = c;
                c = lrot(b, 30);
                b = a;
                a = temp;
            }
            h0 = (h0 + a) & 4294967295;
            h1 = (h1 + b) & 4294967295;
            h2 = (h2 + c) & 4294967295;
            h3 = (h3 + d) & 4294967295;
            h4 = (h4 + e) & 4294967295;
        }
        return hex(h0) + hex(h1) + hex(h2) + hex(h3) + hex(h4);
    }
    sha1.hash = hash;
})(sha1 || (sha1 = {}));
//_______________________________________________________________________
function GetRequest() {
    return QueryString.data;
    //添加数据$.session.set('key', 'value')删除数据$.session.remove('key');获取数据$.session.get('key');清除数据$.session.clear();
}
QueryString = {
    data: {},
    Initial: function () {
        var aPairs, aTmp;
        var queryString = new String(window.location.search);
        queryString = queryString.substr(1, queryString.length); //remove   "?"     
        aPairs = queryString.split("&");
        for (var i = 0; i < aPairs.length; i++) {
            aTmp = aPairs[i].split("=");
            this.data[aTmp[0]] = aTmp[1];
        }
    },
    GetValue: function (key) {
        return this.data[key];
    }
}
QueryString.Initial();

function getRemotePic(picid, me = null) {
    var rsstr = "uploads/" + picid; //remoteaddress+"/"+picid
    if (me) me.attr("src", rsstr);
    return rsstr;
}
//------------------------------------------------------
var errorHandler = (function () {
    var mythis = {};
    mythis.onAuthError = function (e = null) {
        //权限问题处理
    };
    mythis.onWXError = function (e = null) {
        //微信问题处理
    };
    mythis.onConnectError = function (e = null) {
        //连接问题处理
    };
    mythis.onDataError = function (e = null) {
        //数据问题处理
    };
}());
//--------------------restful apis-----------------------
var restapis = (function () {
    var requestRoot = "http://119.29.153.19:8082/";
    var appid = "wx7a6967db884b7058";
    var mythis = {};
    mythis.yxName = "廊下经济园区";
    mythis.openid = "";
    mythis.requestRoot = "http://119.29.153.19:8082/";
    mythis.redictlocation = window.location.href.split("#")[0];
    /**
     *function(mothed,module,data,onSeccess,onError,post="GET",dataType="json")
     */
    mythis.request = function (mothed, module, data, onSeccess, onError, post = "GET", dataType = "json", cacherequest = false) {
        var theurl = requestRoot;
        if (module) {
            theurl += module + "/";
        }
        if (mothed) {
            theurl += mothed
        }
        $.ajax({
            type: post,
            dataType: dataType,
            url: theurl,
            data: data,
            cache: cacherequest,
            contentType: "application/json; charset=utf-8",
            success: onSeccess,
            error: onError
        });
    }
    mythis.getRoot = function () {
        return "http://119.29.153.19:8082/";
    }
    return mythis;
}())
//-----------------------------微信---------------------------
var myweixin = (function () {
    var authurl = "https://open.weixin.qq.com/connect/oauth2/";
    var appid = "wx7a6967db884b7058";
    var mythis = {};
    var myerror = errorHandler;
    mythis.yxName = "廊下经济园区";
    mythis.openid = localStorage.getItem("wxopenid");
    mythis.isConfiged = false;
    mythis.requestRoot = "http://119.29.153.19:8082/";
    mythis.apilist = ['checkJsApi'
                        , 'chooseImage'
                        , 'previewImage'
                        , 'uploadImage'
                        , 'getLocalImgData'
                        , 'getNetworkType'];
    mythis.redictlocation = window.location.href.split("#")[0];
    var mylocation = encodeURIComponent(mythis.redictlocation);
    if (this.hasOwnProperty("wx")) wx.error(function (res) {
        if (mythis.onError) mythis.onError(res)
    });
    mythis.initial = function () {
        console.log("微信配置初始化中");
        if (GetRequest()["code"] != null && GetRequest()["code"] != undefined) {
            mythis.code = GetRequest()["code"];
            if (localStorage.getItem("wxopenid") == undefined || localStorage.getItem("wxopenid") == null) {
                mythis.requestOpenid(mythis.code);
            }
        } else {
            var thewxcode = GetRequest()["code"];
            var openid = localStorage.getItem("wxopenid");
            debugger;
            if (localStorage.getItem("wxopenid")) {
                mythis.openid = localStorage.getItem("wxopenid");
                mythis.webtoken = localStorage.getItem("wxwebtoken");
                mythis.webrefreshtoken = localStorage.getItem("wxwebrefreshtoken");
                mythis.webtokenexpires = localStorage.getItem("wxwebtokenexpires");
                mythis.wxhead_img_url = localStorage.getItem("wxhead_img_url");
                if (parseInt(mythis.webtokenexpires) > (new Date().getTime())) {
                    console.log("web token expired");
                    mythis.requestCode();
                } else {
                    if (mythis.onOpenid) mythis.onOpenid();
                    if (mythis.onUser) mythis.onUser();
                }
            } else {
                mythis.requestCode();
            }
        }
    };
    mythis.config = function (wxticket) {
        var wxjsapi_ticket = wxticket;
        var mytimestamp = (Date.parse(new Date())) / 1000;
        var mynonceStr = sha1.hash(String(mytimestamp)).substring(0, 16);
        var mysignature = "jsapi_ticket=" + wxjsapi_ticket + "&noncestr=" + mynonceStr + "&timestamp=" + mytimestamp + "&url=" + window.location.href.split("#")[0];
        console.log(mynonceStr + "::" + wxjsapi_ticket + "::" + mytimestamp + "::" + window.location.href.split("#")[0]);
        var signatureSHA1 = sha1.hash(mysignature);
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appid, // 必填，公众号的唯一标识
            timestamp: mytimestamp, // 必填，生成签名的时间戳
            nonceStr: mynonceStr, // 必填，生成签名的随机串
            signature: signatureSHA1, // 必填，签名，见附录1
            jsApiList: mythis.apilist
        });
        mythis.isConfiged = true;
        if (mythis.onConfig) mythis.onConfig();
        if (mythis.onInitial) mythis.onInitial();
    };
    mythis.requestOpenid = function (wxcode) {
        if (localStorage.getItem("wxopenid")) {
            if (mythis.onOpenid) mythis.onOpenid();
            if (mythis.onUser) mythis.onUser();
            mythis.requestTicket();
            return localStorage.getItem("wxopenid");
        }
        if (wxcode != null && wxcode != undefined) {
            var myapi = restapis;
            myapi.request("getOppen_id", null, "code=" + wxcode + "&yxName=" + mythis.yxName, function (result) {
                debugger;
                console.log("getOppen_id result" + result);
                mythis.openid = result.openid;
                localStorage.setItem("wxopenid", result.openid);
                localStorage.setItem("wxwebtoken", result.access_token);
                localStorage.setItem("wxwebrefreshtoken", result.refresh_token);
                localStorage.setItem("wxwebtokenexpires", (new Date().getTime()) + parseInt(result.expires_in));
                localStorage.setItem("userid", result.username);
                localStorage.setItem("wxname", result.realname);
                localStorage.setItem("wxhead_img_url", result.head_img_url);
                if (result.hasOwnProperty("roleid")) localStorage.setItem("roleid", result.roleid);
                window.location.replace(window.location.href.split("?")[0]);
            }, function (req, e, data) {
                if (myerror && myerror.hasOwnProperty(onWXError)) myerror.onWXError(req, e, data);
            });
        }
    }
    mythis.getUserInfo = function () {
        var user = {};
        user.userid = localStorage.getItem("userid");
        user.wxname = localStorage.getItem("wxname");
        user.wxhead_img_url = localStorage.getItem("wxhead_img_url");
        user.roleid = localStorage.getItem("roleid").split(",");
        user.hasPri = function (pri) {
            if (user.hasOwnProperty("roleid") && user.roleid != undefined)
                for (var i = 0; i < user.roleid.length; i++) {
                    if (pri == user.roleid[i])
                        return true;
                }
            return false;
        }
        return user;
    }
    mythis.requestTicket = function (mytoken = null) {
        var myapi = restapis;
        myapi.request("getJSApiTicket", null, "yxName=" + mythis.yxName + "&timestamp=" + (new Date().getTime()), function (result) {
            if (result.errcode == 0) {
                localStorage.setItem("wxticket", result.ticket);
                localStorage.setItem("wxticketexpires", (new Date().getTime()) + result.expires_in);
            } else {
                if (myerror && myerror.hasOwnProperty(onWXError)) myerror.onWXError(null, null, result);
            }
            if (mythis.onTicketGet) mythis.onTicketGet(result.ticket);
            mythis.config(result.ticket);
        }, function (req, e, data) {
            if (myerror && myerror.hasOwnProperty(onWXError)) myerror.onWXError(req, e, data);
        });
    }
    mythis.requestCode = function () {
        window.location = authurl + "authorize" + "?" + "appid=" + appid + "&redirect_uri=" + mylocation + "&response_type=code&scope=snsapi_base&state=0#wechat_redirect";
    }
    mythis.checkapi = function (theapis, successCallback, errorCallback, toConfig = true) {
        if (mythis.isConfiged) {
            wx.checkJsApi({
                jsApiList: theapis, // 需要检测的JS接口列表，所有JS接口列表见附录2,
                success: function (res) {
                    if (res.errMsg == "checkJsApi:ok") {
                        for (var i = 0; i < theapis.length; i++) {
                            if (res.checkResult.hasOwnProperty(theapis[i]) && res.checkResult[theapis[i]]) {
                                //check ok
                            } else {
                                console.log("checkapi fail");
                                console.log(res);
                                if (errorCallback) errorCallback();
                                return;
                            }
                        }
                        if (successCallback) successCallback();
                        return;
                    }
                }
            });
        } else {
            console.log("checkapi fail no wx.config");
            if (errorCallback) errorCallback();
        }
    }
    mythis.onInitial = null;
    mythis.onTicketGet = null;
    mythis.onOpenid = null;
    mythis.onError = null;
    mythis.onConfig = null;
    mythis.onUser = null;
    //
    return mythis;
}());

function previewImagebyWX(theimg) {
    myweixin;
    myweixin.checkapi(['chooseImage'], function () {
        wx.previewImage({
            current: theimg, // 当前显示图片的http链接
            urls: [theimg] // 需要预览的图片http链接列表
        });
    }, function () {
        setTimeout(function () {
            previewImagebyWX(theimg);
        }, 200);
    });
}

function uploadImage(thetarget, targetInput) {
    setTimeout(onuploadComponentChangeHandler(thetarget, targetInput, null, null, true, true), 50);
}

function onuploadComponentChangeHandler(thetarget, targetInput, callback = null, onerrorhandler = null, showprogress = true, isshow = false) {
    //http://www.cnblogs.com/yanqin/p/5684320.html
    debugger;
    //initial
    var theparent = thetarget.parentNode
    if (theparent == undefined || theparent == null) {
        if (thetarget.hasOwnProperty("length") && thetarget.length > 0)
            thetarget = thetarget[0];
        else
        if (onerrorhandler) onerrorhandler();
    }
    var thefiles = thetarget.files;
    if (thefiles == undefined || thefiles == null || thefiles.length == 0) {
        if (onerrorhandler) onerrorhandler();
        throw new Error("fileuploader there no file!");
        return;
    }
    var tmpFormData = new FormData();
    tmpFormData.append("file", thetarget.files[0]);
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "cacheimg.php", true);
    var fillimg = thetarget.parentNode.getElementsByTagName("img")[0];
    var cav = thetarget.parentNode.getElementsByTagName("canvas")[0];
    cav.classList = [];
    //progress
    if (showprogress) {
        var cav2d = cav.getContext("2d");
        var theheight = cav2d.height = thetarget.parentNode.clientHeight;
        var thewidth = cav2d.width = thetarget.parentNode.clientWidth;
        cav2d.fillStyle = "#5066b4";
        xhr.upload.onprogress = function (event) {
            var persently = event.loaded / event.total;
            cav2d.fillRect(0, 0, thewidth * persently, theheight);
        }
        //onstart
        xhr.upload.onloadstart = function () { //上传开始执行方法
            ot = new Date().getTime(); //设置上传开始时间
            oloaded = 0; //设置上传开始时，以上传的文件大小为0
        };
    }
    //onload
    xhr.onload = function (event) {
        debugger;
        var jobj = JSON.parse(event.currentTarget.responseText);
        var theurl = "uploads/" + jobj.fileName;
        if (xhr.status == 200) {
            if (targetInput) $(targetInput).val(jobj.fileName);
            if (isshow) fillimg["src"] = getRemotePic(jobj.fileName);
            if (callback) callback(jobj);
        } else {
            if (onerrorhandler) onerrorhandler(event);
        }
        cav.classList = "hide";
    };
    //action send
    xhr.send(tmpFormData);
}
// 对Date的扩展，将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符， 
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) 
// 例子： 
// (new Date()).Format("yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423 
// (new Date()).Format("yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18 
Date.prototype.Format = function (fmt) { //author: meizz 
    var o = {
        "M+": this.getMonth() + 1, //月份 
        "d+": this.getDate(), //日 
        "h+": this.getHours(), //小时 
        "m+": this.getMinutes(), //分 
        "s+": this.getSeconds(), //秒 
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度 
        "S": this.getMilliseconds() //毫秒 
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}
//Disable Form
function setFromDisabled(formname, toDisabled) {
    var aform = $("form");
    for (var i = 0; i < aform.length; i++) {
        if (aform[i].id == formname) {
            aform = aform[i];
            break;
        }
    }
    for (var i = 0; i < aform.length; i++) {
        if (aform[i].hasOwnProperty("disabled"))
            if (toDisabled) {
                aform[i].disabled = toDisabled;
            } else {
                if (afor[i].hasOwnProperty("removeAttr")) aform[i].removeAttr("disabled");
            }
    }
}

function checkInputFileImg() {
    debugger;
    var inputs = $("input");
    if (inputs)
        for (var i = 0; i < inputs.length; i++) {
            var node = inputs[i];
            for (var a = 0; a < node.attributes.length; a++) {
                var attr = node.attributes[a];
                if (attr.name == "capture") {
                    if (browser.versions.ios)
                        node.attributes.removeNamedItem(attr.name);
                    break;
                }
            }
        }
}
/*---------------------------上传文件----------------------*/
//policy 要经过base64编码， signature 还要进一步处理，可以查阅官方文档
//https://help.aliyun.com/document_detail/31848.html
//function OssUpload(param, file, fileName, callBack) 
//------------------------------------------session

function mygetsessioninfo() {
    var rsobj = {};
    var tempuid = sessionStorage.getItem("userid");
    if (tempuid != null) {
        rsobj["userid"] = sessionStorage.getItem("userid");
        rsobj["name"] = sessionStorage.getItem("name");
        rsobj["charactor"] = sessionStorage.getItem("charactor");
        var pri_ee_u_1 = sessionStorage.getItem("pri_ee_u_1");
        var pri_ee_u_2 = sessionStorage.getItem("pri_ee_u_2");
        var pri_ee_u_3 = sessionStorage.getItem("pri_ee_u_3");
        if (pri_ee_u_1) {
            rsobj["pri_ee_u_1"] = pri_ee_u_1;
            rsobj["pri_ee_u_2"] = pri_ee_u_2;
            rsobj["pri_ee_u_3"] = pri_ee_u_3;
        }
        console.log("成功获取session信息");
        return rsobj;
    }
    console.log("mygetsessioninfo：请先登陆");
    return {};
}

function isManager() {
    if (getsessioninfo()["charactor"] > 10) {
        return true;
    }
    return false;
}

function getDatePickerTime(datastr) {
    if (datastr) {
        debugger;
        var harr = datastr.split(" ");
        var darr = harr[0].split("-");
        var theyear = Math.round(darr[0]);
        var themonth = Math.round(darr[1]) - 1;
        var theday = Math.round(darr[2]);
        datastr = harr[1];
        var thehour = Math.round(datastr.split(":")[0]);
        var them = Math.round(datastr.split(":")[1]);
        var today = new Date(theyear, themonth, theday, thehour, them);
        today.setFullYear(theyear);
        today.setMonth(themonth);
        today.setDate(theday);
        today.setHours(thehour);
        today.setMinutes(them);
        return today;
    }
}
//--------------------------------browser---------------------
var browser = {
    versions: function () {
        var u = navigator.userAgent,
            app = navigator.appVersion;
        return {
            trident: u.indexOf('Trident') > -1, //IE内核
            presto: u.indexOf('Presto') > -1, //opera内核
            webKit: u.indexOf('AppleWebKit') > -1, //苹果、谷歌内核
            gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1, //火狐内核
            mobile: !!u.match(/AppleWebKit.*Mobile.*/), //是否为移动终端
            ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/), //ios终端
            android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1, //android终端
            iPhone: u.indexOf('iPhone') > -1, //是否为iPhone或者QQHD浏览器
            iPad: u.indexOf('iPad') > -1, //是否iPad
            webApp: u.indexOf('Safari') == -1, //是否web应该程序，没有头部与底部
            weixin: u.indexOf('MicroMessenger') > -1, //是否微信 （2015-01-22新增）
            qq: u.match(/\sQQ/i) == " qq" //是否QQ
        };
    }(),
    language: (navigator.browserLanguage || navigator.language).toLowerCase()
}
//--------------------JPEGEncoder------------------------
function JPEGEncoder(quality) {
    var self = this;
    var fround = Math.round;
    var ffloor = Math.floor;
    var YTable = new Array(64);
    var UVTable = new Array(64);
    var fdtbl_Y = new Array(64);
    var fdtbl_UV = new Array(64);
    var YDC_HT;
    var UVDC_HT;
    var YAC_HT;
    var UVAC_HT;

    var bitcode = new Array(65535);
    var category = new Array(65535);
    var outputfDCTQuant = new Array(64);
    var DU = new Array(64);
    var byteout = [];
    var bytenew = 0;
    var bytepos = 7;

    var YDU = new Array(64);
    var UDU = new Array(64);
    var VDU = new Array(64);
    var clt = new Array(256);
    var RGB_YUV_TABLE = new Array(2048);
    var currentQuality;

    var ZigZag = [
             0, 1, 5, 6, 14, 15, 27, 28,
             2, 4, 7, 13, 16, 26, 29, 42,
             3, 8, 12, 17, 25, 30, 41, 43,
             9, 11, 18, 24, 31, 40, 44, 53,
            10, 19, 23, 32, 39, 45, 52, 54,
            20, 22, 33, 38, 46, 51, 55, 60,
            21, 34, 37, 47, 50, 56, 59, 61,
            35, 36, 48, 49, 57, 58, 62, 63
        ];

    var std_dc_luminance_nrcodes = [0, 0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
    var std_dc_luminance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var std_ac_luminance_nrcodes = [0, 0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d];
    var std_ac_luminance_values = [
            0x01, 0x02, 0x03, 0x00, 0x04, 0x11, 0x05, 0x12,
            0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07,
            0x22, 0x71, 0x14, 0x32, 0x81, 0x91, 0xa1, 0x08,
            0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0,
            0x24, 0x33, 0x62, 0x72, 0x82, 0x09, 0x0a, 0x16,
            0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28,
            0x29, 0x2a, 0x34, 0x35, 0x36, 0x37, 0x38, 0x39,
            0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49,
            0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58, 0x59,
            0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69,
            0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78, 0x79,
            0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89,
            0x8a, 0x92, 0x93, 0x94, 0x95, 0x96, 0x97, 0x98,
            0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7,
            0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4, 0xb5, 0xb6,
            0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5,
            0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2, 0xd3, 0xd4,
            0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2,
            0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9, 0xea,
            0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
            0xf9, 0xfa
        ];

    var std_dc_chrominance_nrcodes = [0, 0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0];
    var std_dc_chrominance_values = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
    var std_ac_chrominance_nrcodes = [0, 0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77];
    var std_ac_chrominance_values = [
            0x00, 0x01, 0x02, 0x03, 0x11, 0x04, 0x05, 0x21,
            0x31, 0x06, 0x12, 0x41, 0x51, 0x07, 0x61, 0x71,
            0x13, 0x22, 0x32, 0x81, 0x08, 0x14, 0x42, 0x91,
            0xa1, 0xb1, 0xc1, 0x09, 0x23, 0x33, 0x52, 0xf0,
            0x15, 0x62, 0x72, 0xd1, 0x0a, 0x16, 0x24, 0x34,
            0xe1, 0x25, 0xf1, 0x17, 0x18, 0x19, 0x1a, 0x26,
            0x27, 0x28, 0x29, 0x2a, 0x35, 0x36, 0x37, 0x38,
            0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48,
            0x49, 0x4a, 0x53, 0x54, 0x55, 0x56, 0x57, 0x58,
            0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68,
            0x69, 0x6a, 0x73, 0x74, 0x75, 0x76, 0x77, 0x78,
            0x79, 0x7a, 0x82, 0x83, 0x84, 0x85, 0x86, 0x87,
            0x88, 0x89, 0x8a, 0x92, 0x93, 0x94, 0x95, 0x96,
            0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5,
            0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2, 0xb3, 0xb4,
            0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3,
            0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9, 0xca, 0xd2,
            0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda,
            0xe2, 0xe3, 0xe4, 0xe5, 0xe6, 0xe7, 0xe8, 0xe9,
            0xea, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8,
            0xf9, 0xfa
        ];

    function initQuantTables(sf) {
        var YQT = [
                16, 11, 10, 16, 24, 40, 51, 61,
                12, 12, 14, 19, 26, 58, 60, 55,
                14, 13, 16, 24, 40, 57, 69, 56,
                14, 17, 22, 29, 51, 87, 80, 62,
                18, 22, 37, 56, 68, 109, 103, 77,
                24, 35, 55, 64, 81, 104, 113, 92,
                49, 64, 78, 87, 103, 121, 120, 101,
                72, 92, 95, 98, 112, 100, 103, 99
            ];

        for (var i = 0; i < 64; i++) {
            var t = ffloor((YQT[i] * sf + 50) / 100);
            if (t < 1) {
                t = 1;
            } else if (t > 255) {
                t = 255;
            }
            YTable[ZigZag[i]] = t;
        }
        var UVQT = [
                17, 18, 24, 47, 99, 99, 99, 99,
                18, 21, 26, 66, 99, 99, 99, 99,
                24, 26, 56, 99, 99, 99, 99, 99,
                47, 66, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99,
                99, 99, 99, 99, 99, 99, 99, 99
            ];
        for (var j = 0; j < 64; j++) {
            var u = ffloor((UVQT[j] * sf + 50) / 100);
            if (u < 1) {
                u = 1;
            } else if (u > 255) {
                u = 255;
            }
            UVTable[ZigZag[j]] = u;
        }
        var aasf = [
                1.0, 1.387039845, 1.306562965, 1.175875602,
                1.0, 0.785694958, 0.541196100, 0.275899379
            ];
        var k = 0;
        for (var row = 0; row < 8; row++) {
            for (var col = 0; col < 8; col++) {
                fdtbl_Y[k] = (1.0 / (YTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                fdtbl_UV[k] = (1.0 / (UVTable[ZigZag[k]] * aasf[row] * aasf[col] * 8.0));
                k++;
            }
        }
    }

    function computeHuffmanTbl(nrcodes, std_table) {
        var codevalue = 0;
        var pos_in_table = 0;
        var HT = new Array();
        for (var k = 1; k <= 16; k++) {
            for (var j = 1; j <= nrcodes[k]; j++) {
                HT[std_table[pos_in_table]] = [];
                HT[std_table[pos_in_table]][0] = codevalue;
                HT[std_table[pos_in_table]][1] = k;
                pos_in_table++;
                codevalue++;
            }
            codevalue *= 2;
        }
        return HT;
    }

    function initHuffmanTbl() {
        YDC_HT = computeHuffmanTbl(std_dc_luminance_nrcodes, std_dc_luminance_values);
        UVDC_HT = computeHuffmanTbl(std_dc_chrominance_nrcodes, std_dc_chrominance_values);
        YAC_HT = computeHuffmanTbl(std_ac_luminance_nrcodes, std_ac_luminance_values);
        UVAC_HT = computeHuffmanTbl(std_ac_chrominance_nrcodes, std_ac_chrominance_values);
    }

    function initCategoryNumber() {
        var nrlower = 1;
        var nrupper = 2;
        for (var cat = 1; cat <= 15; cat++) {
            //Positive numbers
            for (var nr = nrlower; nr < nrupper; nr++) {
                category[32767 + nr] = cat;
                bitcode[32767 + nr] = [];
                bitcode[32767 + nr][1] = cat;
                bitcode[32767 + nr][0] = nr;
            }
            //Negative numbers
            for (var nrneg = -(nrupper - 1); nrneg <= -nrlower; nrneg++) {
                category[32767 + nrneg] = cat;
                bitcode[32767 + nrneg] = [];
                bitcode[32767 + nrneg][1] = cat;
                bitcode[32767 + nrneg][0] = nrupper - 1 + nrneg;
            }
            nrlower <<= 1;
            nrupper <<= 1;
        }
    }

    function initRGBYUVTable() {
        for (var i = 0; i < 256; i++) {
            RGB_YUV_TABLE[i] = 19595 * i;
            RGB_YUV_TABLE[(i + 256) >> 0] = 38470 * i;
            RGB_YUV_TABLE[(i + 512) >> 0] = 7471 * i + 0x8000;
            RGB_YUV_TABLE[(i + 768) >> 0] = -11059 * i;
            RGB_YUV_TABLE[(i + 1024) >> 0] = -21709 * i;
            RGB_YUV_TABLE[(i + 1280) >> 0] = 32768 * i + 0x807FFF;
            RGB_YUV_TABLE[(i + 1536) >> 0] = -27439 * i;
            RGB_YUV_TABLE[(i + 1792) >> 0] = -5329 * i;
        }
    }

    // IO functions
    function writeBits(bs) {
        var value = bs[0];
        var posval = bs[1] - 1;
        while (posval >= 0) {
            if (value & (1 << posval)) {
                bytenew |= (1 << bytepos);
            }
            posval--;
            bytepos--;
            if (bytepos < 0) {
                if (bytenew == 0xFF) {
                    writeByte(0xFF);
                    writeByte(0);
                } else {
                    writeByte(bytenew);
                }
                bytepos = 7;
                bytenew = 0;
            }
        }
    }

    function writeByte(value) {
        byteout.push(clt[value]); // write char directly instead of converting later
    }

    function writeWord(value) {
        writeByte((value >> 8) & 0xFF);
        writeByte((value) & 0xFF);
    }

    // DCT & quantization core
    function fDCTQuant(data, fdtbl) {
        var d0, d1, d2, d3, d4, d5, d6, d7;
        /* Pass 1: process rows. */
        var dataOff = 0;
        var i;
        const I8 = 8;
        const I64 = 64;
        for (i = 0; i < I8; ++i) {
            d0 = data[dataOff];
            d1 = data[dataOff + 1];
            d2 = data[dataOff + 2];
            d3 = data[dataOff + 3];
            d4 = data[dataOff + 4];
            d5 = data[dataOff + 5];
            d6 = data[dataOff + 6];
            d7 = data[dataOff + 7];

            var tmp0 = d0 + d7;
            var tmp7 = d0 - d7;
            var tmp1 = d1 + d6;
            var tmp6 = d1 - d6;
            var tmp2 = d2 + d5;
            var tmp5 = d2 - d5;
            var tmp3 = d3 + d4;
            var tmp4 = d3 - d4;

            /* Even part */
            var tmp10 = tmp0 + tmp3; /* phase 2 */
            var tmp13 = tmp0 - tmp3;
            var tmp11 = tmp1 + tmp2;
            var tmp12 = tmp1 - tmp2;

            data[dataOff] = tmp10 + tmp11; /* phase 3 */
            data[dataOff + 4] = tmp10 - tmp11;

            var z1 = (tmp12 + tmp13) * 0.707106781; /* c4 */
            data[dataOff + 2] = tmp13 + z1; /* phase 5 */
            data[dataOff + 6] = tmp13 - z1;

            /* Odd part */
            tmp10 = tmp4 + tmp5; /* phase 2 */
            tmp11 = tmp5 + tmp6;
            tmp12 = tmp6 + tmp7;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5 = (tmp10 - tmp12) * 0.382683433; /* c6 */
            var z2 = 0.541196100 * tmp10 + z5; /* c2-c6 */
            var z4 = 1.306562965 * tmp12 + z5; /* c2+c6 */
            var z3 = tmp11 * 0.707106781; /* c4 */

            var z11 = tmp7 + z3; /* phase 5 */
            var z13 = tmp7 - z3;

            data[dataOff + 5] = z13 + z2; /* phase 6 */
            data[dataOff + 3] = z13 - z2;
            data[dataOff + 1] = z11 + z4;
            data[dataOff + 7] = z11 - z4;

            dataOff += 8; /* advance pointer to next row */
        }

        /* Pass 2: process columns. */
        dataOff = 0;
        for (i = 0; i < I8; ++i) {
            d0 = data[dataOff];
            d1 = data[dataOff + 8];
            d2 = data[dataOff + 16];
            d3 = data[dataOff + 24];
            d4 = data[dataOff + 32];
            d5 = data[dataOff + 40];
            d6 = data[dataOff + 48];
            d7 = data[dataOff + 56];

            var tmp0p2 = d0 + d7;
            var tmp7p2 = d0 - d7;
            var tmp1p2 = d1 + d6;
            var tmp6p2 = d1 - d6;
            var tmp2p2 = d2 + d5;
            var tmp5p2 = d2 - d5;
            var tmp3p2 = d3 + d4;
            var tmp4p2 = d3 - d4;

            /* Even part */
            var tmp10p2 = tmp0p2 + tmp3p2; /* phase 2 */
            var tmp13p2 = tmp0p2 - tmp3p2;
            var tmp11p2 = tmp1p2 + tmp2p2;
            var tmp12p2 = tmp1p2 - tmp2p2;

            data[dataOff] = tmp10p2 + tmp11p2; /* phase 3 */
            data[dataOff + 32] = tmp10p2 - tmp11p2;

            var z1p2 = (tmp12p2 + tmp13p2) * 0.707106781; /* c4 */
            data[dataOff + 16] = tmp13p2 + z1p2; /* phase 5 */
            data[dataOff + 48] = tmp13p2 - z1p2;

            /* Odd part */
            tmp10p2 = tmp4p2 + tmp5p2; /* phase 2 */
            tmp11p2 = tmp5p2 + tmp6p2;
            tmp12p2 = tmp6p2 + tmp7p2;

            /* The rotator is modified from fig 4-8 to avoid extra negations. */
            var z5p2 = (tmp10p2 - tmp12p2) * 0.382683433; /* c6 */
            var z2p2 = 0.541196100 * tmp10p2 + z5p2; /* c2-c6 */
            var z4p2 = 1.306562965 * tmp12p2 + z5p2; /* c2+c6 */
            var z3p2 = tmp11p2 * 0.707106781; /* c4 */
            var z11p2 = tmp7p2 + z3p2; /* phase 5 */
            var z13p2 = tmp7p2 - z3p2;

            data[dataOff + 40] = z13p2 + z2p2; /* phase 6 */
            data[dataOff + 24] = z13p2 - z2p2;
            data[dataOff + 8] = z11p2 + z4p2;
            data[dataOff + 56] = z11p2 - z4p2;

            dataOff++; /* advance pointer to next column */
        }

        // Quantize/descale the coefficients
        var fDCTQuant;
        for (i = 0; i < I64; ++i) {
            // Apply the quantization and scaling factor & Round to nearest integer
            fDCTQuant = data[i] * fdtbl[i];
            outputfDCTQuant[i] = (fDCTQuant > 0.0) ? ((fDCTQuant + 0.5) | 0) : ((fDCTQuant - 0.5) | 0);
            //outputfDCTQuant[i] = fround(fDCTQuant);

        }
        return outputfDCTQuant;
    }

    function writeAPP0() {
        writeWord(0xFFE0); // marker
        writeWord(16); // length
        writeByte(0x4A); // J
        writeByte(0x46); // F
        writeByte(0x49); // I
        writeByte(0x46); // F
        writeByte(0); // = "JFIF",'\0'
        writeByte(1); // versionhi
        writeByte(1); // versionlo
        writeByte(0); // xyunits
        writeWord(1); // xdensity
        writeWord(1); // ydensity
        writeByte(0); // thumbnwidth
        writeByte(0); // thumbnheight
    }

    function writeSOF0(width, height) {
        writeWord(0xFFC0); // marker
        writeWord(17); // length, truecolor YUV JPG
        writeByte(8); // precision
        writeWord(height);
        writeWord(width);
        writeByte(3); // nrofcomponents
        writeByte(1); // IdY
        writeByte(0x11); // HVY
        writeByte(0); // QTY
        writeByte(2); // IdU
        writeByte(0x11); // HVU
        writeByte(1); // QTU
        writeByte(3); // IdV
        writeByte(0x11); // HVV
        writeByte(1); // QTV
    }

    function writeDQT() {
        writeWord(0xFFDB); // marker
        writeWord(132); // length
        writeByte(0);
        for (var i = 0; i < 64; i++) {
            writeByte(YTable[i]);
        }
        writeByte(1);
        for (var j = 0; j < 64; j++) {
            writeByte(UVTable[j]);
        }
    }

    function writeDHT() {
        writeWord(0xFFC4); // marker
        writeWord(0x01A2); // length

        writeByte(0); // HTYDCinfo
        for (var i = 0; i < 16; i++) {
            writeByte(std_dc_luminance_nrcodes[i + 1]);
        }
        for (var j = 0; j <= 11; j++) {
            writeByte(std_dc_luminance_values[j]);
        }

        writeByte(0x10); // HTYACinfo
        for (var k = 0; k < 16; k++) {
            writeByte(std_ac_luminance_nrcodes[k + 1]);
        }
        for (var l = 0; l <= 161; l++) {
            writeByte(std_ac_luminance_values[l]);
        }

        writeByte(1); // HTUDCinfo
        for (var m = 0; m < 16; m++) {
            writeByte(std_dc_chrominance_nrcodes[m + 1]);
        }
        for (var n = 0; n <= 11; n++) {
            writeByte(std_dc_chrominance_values[n]);
        }

        writeByte(0x11); // HTUACinfo
        for (var o = 0; o < 16; o++) {
            writeByte(std_ac_chrominance_nrcodes[o + 1]);
        }
        for (var p = 0; p <= 161; p++) {
            writeByte(std_ac_chrominance_values[p]);
        }
    }

    function writeSOS() {
        writeWord(0xFFDA); // marker
        writeWord(12); // length
        writeByte(3); // nrofcomponents
        writeByte(1); // IdY
        writeByte(0); // HTY
        writeByte(2); // IdU
        writeByte(0x11); // HTU
        writeByte(3); // IdV
        writeByte(0x11); // HTV
        writeByte(0); // Ss
        writeByte(0x3f); // Se
        writeByte(0); // Bf
    }

    function processDU(CDU, fdtbl, DC, HTDC, HTAC) {
        var EOB = HTAC[0x00];
        var M16zeroes = HTAC[0xF0];
        var pos;
        const I16 = 16;
        const I63 = 63;
        const I64 = 64;
        var DU_DCT = fDCTQuant(CDU, fdtbl);
        //ZigZag reorder
        for (var j = 0; j < I64; ++j) {
            DU[ZigZag[j]] = DU_DCT[j];
        }
        var Diff = DU[0] - DC;
        DC = DU[0];
        //Encode DC
        if (Diff == 0) {
            writeBits(HTDC[0]); // Diff might be 0
        } else {
            pos = 32767 + Diff;
            writeBits(HTDC[category[pos]]);
            writeBits(bitcode[pos]);
        }
        //Encode ACs
        var end0pos = 63; // was const... which is crazy
        for (;
            (end0pos > 0) && (DU[end0pos] == 0); end0pos--) {};
        //end0pos = first element in reverse order !=0
        if (end0pos == 0) {
            writeBits(EOB);
            return DC;
        }
        var i = 1;
        var lng;
        while (i <= end0pos) {
            var startpos = i;
            for (;
                (DU[i] == 0) && (i <= end0pos); ++i) {}
            var nrzeroes = i - startpos;
            if (nrzeroes >= I16) {
                lng = nrzeroes >> 4;
                for (var nrmarker = 1; nrmarker <= lng; ++nrmarker)
                    writeBits(M16zeroes);
                nrzeroes = nrzeroes & 0xF;
            }
            pos = 32767 + DU[i];
            writeBits(HTAC[(nrzeroes << 4) + category[pos]]);
            writeBits(bitcode[pos]);
            i++;
        }
        if (end0pos != I63) {
            writeBits(EOB);
        }
        return DC;
    }

    function initCharLookupTable() {
        var sfcc = String.fromCharCode;
        for (var i = 0; i < 256; i++) { ///// ACHTUNG // 255
            clt[i] = sfcc(i);
        }
    }

    this.encode = function (image, quality, toRaw) // image data object
    {
        var time_start = new Date().getTime();

        if (quality) setQuality(quality);

        // Initialize bit writer
        byteout = new Array();
        bytenew = 0;
        bytepos = 7;

        // Add JPEG headers
        writeWord(0xFFD8); // SOI
        writeAPP0();
        writeDQT();
        writeSOF0(image.width, image.height);
        writeDHT();
        writeSOS();

        // Encode 8x8 macroblocks
        var DCY = 0;
        var DCU = 0;
        var DCV = 0;

        bytenew = 0;
        bytepos = 7;

        this.encode.displayName = "_encode_";

        var imageData = image.data;
        var width = image.width;
        var height = image.height;

        var quadWidth = width * 4;
        var tripleWidth = width * 3;

        var x, y = 0;
        var r, g, b;
        var start, p, col, row, pos;
        while (y < height) {
            x = 0;
            while (x < quadWidth) {
                start = quadWidth * y + x;
                p = start;
                col = -1;
                row = 0;

                for (pos = 0; pos < 64; pos++) {
                    row = pos >> 3; // /8
                    col = (pos & 7) * 4; // %8
                    p = start + (row * quadWidth) + col;

                    if (y + row >= height) { // padding bottom
                        p -= (quadWidth * (y + 1 + row - height));
                    }

                    if (x + col >= quadWidth) { // padding right
                        p -= ((x + col) - quadWidth + 4)
                    }

                    r = imageData[p++];
                    g = imageData[p++];
                    b = imageData[p++];

                    /* // calculate YUV values dynamically
                    YDU[pos]=((( 0.29900)*r+( 0.58700)*g+( 0.11400)*b))-128; //-0x80
                    UDU[pos]=(((-0.16874)*r+(-0.33126)*g+( 0.50000)*b));
                    VDU[pos]=((( 0.50000)*r+(-0.41869)*g+(-0.08131)*b));
                    */

                    // use lookup table (slightly faster)
                    YDU[pos] = ((RGB_YUV_TABLE[r] + RGB_YUV_TABLE[(g + 256) >> 0] + RGB_YUV_TABLE[(b + 512) >> 0]) >> 16) - 128;
                    UDU[pos] = ((RGB_YUV_TABLE[(r + 768) >> 0] + RGB_YUV_TABLE[(g + 1024) >> 0] + RGB_YUV_TABLE[(b + 1280) >> 0]) >> 16) - 128;
                    VDU[pos] = ((RGB_YUV_TABLE[(r + 1280) >> 0] + RGB_YUV_TABLE[(g + 1536) >> 0] + RGB_YUV_TABLE[(b + 1792) >> 0]) >> 16) - 128;

                }

                DCY = processDU(YDU, fdtbl_Y, DCY, YDC_HT, YAC_HT);
                DCU = processDU(UDU, fdtbl_UV, DCU, UVDC_HT, UVAC_HT);
                DCV = processDU(VDU, fdtbl_UV, DCV, UVDC_HT, UVAC_HT);
                x += 32;
            }
            y += 8;
        }

        ////////////////////////////////////////////////////////////////

        // Do the bit alignment of the EOI marker
        if (bytepos >= 0) {
            var fillbits = [];
            fillbits[1] = bytepos + 1;
            fillbits[0] = (1 << (bytepos + 1)) - 1;
            writeBits(fillbits);
        }

        writeWord(0xFFD9); //EOI

        if (toRaw) {
            var len = byteout.length;
            var data = new Uint8Array(len);

            for (var i = 0; i < len; i++) {
                data[i] = byteout[i].charCodeAt();
            }

            //cleanup
            byteout = [];

            // benchmarking
            var duration = new Date().getTime() - time_start;
            console.log('Encoding time: ' + duration + 'ms');

            return data;
        }

        var jpegDataUri = 'data:image/jpeg;base64,' + btoa(byteout.join(''));

        byteout = [];

        // benchmarking
        var duration = new Date().getTime() - time_start;
        console.log('Encoding time: ' + duration + 'ms');

        return jpegDataUri
    }

    function setQuality(quality) {
        if (quality <= 0) {
            quality = 1;
        }
        if (quality > 100) {
            quality = 100;
        }

        if (currentQuality == quality) return // don't recalc if unchanged

        var sf = 0;
        if (quality < 50) {
            sf = Math.floor(5000 / quality);
        } else {
            sf = Math.floor(200 - quality * 2);
        }

        initQuantTables(sf);
        currentQuality = quality;
        console.log('Quality set to: ' + quality + '%');
    }

    function init() {
        var time_start = new Date().getTime();
        if (!quality) quality = 50;
        // Create tables
        initCharLookupTable()
        initHuffmanTbl();
        initCategoryNumber();
        initRGBYUVTable();

        setQuality(quality);
        var duration = new Date().getTime() - time_start;
        console.log('Initialization ' + duration + 'ms');
    }

    init();

};
