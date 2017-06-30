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

function getRemotePic(picid, meimg = null) {
    var rsstr = "uploads/" + picid; //remoteaddress+"/"+picid
    debugger;
    if (meimg) meimg.attr("src", rsstr);
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
        var contentType = "text/plain";
        if (dataType == "json") contentType = "application/json; charset=utf-8"
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
        debugger;
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
                    if (mythis.onConfig) mythis.onConfig();
                    if (mythis.onInitial) mythis.onInitial();
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

function previewImgWithSelf(targetId) {
    previewImagebyWX($(targetId)[0].getElementsByTagName("img")[0].src);
}

function previewImgWithName(tagName, imgTagName) {
    previewImageWithHidden(tagName, imgTagName);
}

function previewImageWithHidden(tagName, imgTagName) {
    if (tagName)
        previewImagebyWX(getRemotePic($(tagName).val()));
    else
        previewImagebyWX($(imgTagName).attr("src"));
}

function previewImagebyWX(theimg) {
    var imgurl = "http://www.aoyuanqu.cn/lily/";
    var purl = imgurl + theimg;
    if (theimg.indexOf(imgurl) != -1) {
        purl = theimg;
    }
    console.log("previewImagebyWX:" + theimg);
    var mypreviewRun = function () {
        wx.previewImage({
            current: purl, // 当前显示图片的http链接
            urls: [purl] // 需要预览的图片http链接列表
        });
    }
    myweixin.checkapi(['previewImage'], mypreviewRun, function () {
        myweixin.onConfig = function () {
            mypreviewRun();
        }
        myweixin.requestTicket();
    });
}

function uploadImage(thetarget, targetInput) {
    setTimeout(onuploadComponentChangeHandler(thetarget, targetInput, null, null, true, true), 50);
}

function uploadSmallImage(thetarget, targetInput) {
    UploadCompressedImage(thetarget, targetInput, null, null, true, true);
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
//----------------线程-------------------------
var queues = [];
var queny = function (fnaction) {
    var mythis = {};
    mythis.uid = queues.length;
    mythis.action = fnaction;
    queues.push(mythis);
    mythis.action();
    console.log("proccess[" + mythis.uid + "] has been run.");
};

function UploadCompressedImage(thetarget, targetInput, callback = null, onerrorhandler = null, showprogress = true, isshow = false, quality = 80) {
    var maxWidth = 750;
    var maxHeight = 1136;
    //initial
    var theparent = thetarget.parentNode
    if (theparent == undefined || theparent == null) {
        if (thetarget.hasOwnProperty("length") && thetarget.length > 0)
            thetarget = thetarget[0];
        else
        if (onerrorhandler) onerrorhandler();
    }
    var thefiles = thetarget.files;
    if (thefiles == undefined || thefiles == null) {
        if (onerrorhandler) onerrorhandler();
        //throw new Error("fileuploader there no file!");
        return;
    }

    var files = thetarget.files;
    for (var i = 0, f; i < files.length; i++) {
        f = files[i];
        // Only process image files.
        if (!f.type.match('image.*')) {
            continue;
        }
        debugger;
        queny(function () {
            var fillimg = thetarget.parentNode.getElementsByTagName("img")[i];
            var cav = thetarget.parentNode.getElementsByTagName("canvas")[i];
            var theheight = cav.height = thetarget.parentNode.clientHeight;
            var thewidth = cav.width = thetarget.parentNode.clientWidth;
            var target = thetarget;
            var theinput = targetInput;
            var thecallback = callback;
            var theerror = onerrorhandler;
            var isprogress = showprogress;
            var show = isshow;
            var ql = quality;
            cav.classList = [];
            target.setAttribute("disabled", "yes"); //disabled input
            var reader = new FileReader();
            var jmyimg = document.createElement("img");
            jmyimg.setAttribute("maxWidth", maxWidth);
            jmyimg.setAttribute("maxHeight", maxHeight);
            jmyimg.maxHeight = 1136;
            var canvas = document.createElement("canvas");
            var ctx = canvas.getContext('2d');
            var f_type = f.type;
            f_type = f_type.replace(".", "/");
            jmyimg.onload = function () {
                var w = jmyimg.naturalWidth,
                    h = jmyimg.naturalHeight;
                rate = 1;
                if (w > maxWidth) {
                    rate = jmyimg.naturalWidth / maxWidth;
                } else if (h > maxHeight) {
                    rate = jmyimg.naturalHeight / maxHeight;
                }
                canvas.width = w / rate;
                canvas.height = h / rate;
                ctx.setTransform(1 / rate, 0, 0, 1 / rate, 0, 0);
                ctx.drawImage(jmyimg, 0, 0, w, h, 0, 0, w, h);
                console.log("compress w[" + w / rate + "] h[" + h / rate + "]");
                var data = canvas.toDataURL(f_type, ql * 2);
                var myapi = restapis;
                var darr = data.split(",");
                var requestData = darr[1];
                var filetype = darr[0].split(":")[1].split(";")[0];
                debugger;
                jmyimg.onload = null;
                var tmpFormData = new FormData();
                tmpFormData.append("fileType", filetype);
                tmpFormData.append("fileData", requestData);
                var xhr = new XMLHttpRequest();
                xhr.open("POST", "cacheImgBase64.php", true);
                xhr.upload.onprogress = function (event) {
                    var persently = event.loaded / event.total;
                    cav2d.fillStyle = "#5066b4";
                    cav2d.fillRect(0, 0, thewidth * persently, theheight);
                    cav2d.fillStyle = "#FFFFFF";
                    cav2d.fillText(parseInt(persently * 100) + "%", thewidth / 2 - 18, theheight / 2 - 7);
                }
                //onload
                xhr.onload = function (event) {
                    debugger;
                    var result = JSON.parse(event.currentTarget.responseText);
                    var theurl = "uploads/" + result.fileName;
                    if (xhr.status == 200) {
                        if (theinput) $(theinput).val(result.fileName);
                        if (show) fillimg["src"] = getRemotePic(result.fileName);
                        target.removeAttribute("disabled");
                        if (thecallback) thecallback(result);
                    } else {
                        target.removeAttribute("disabled");
                        if (theerror) theerror(event);
                    }
                    cav.classList = ["hide"];
                };
                if (isprogress) {
                    var cav2d = cav.getContext("2d");
                    cav2d.font = "14px Arial";
                }
                //action send
                xhr.send(tmpFormData);
            }
            reader.onload = function (event) {
                jmyimg.src = this.result;
                jmyimg.classList = ["img-responsive"];

            };
            reader.readAsDataURL(f);
        });

    }
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
    if (inputs) {
        for (var i = 0; i < inputs.length; i++) {
            var node = inputs[i];
            var nodetype = node.type;
            if ($(node).attr("capture")) {
                if (browser.versions.ios)
                    $(node).removeAttr("capture");
            } else if (nodetype == "date" ||
                nodetype == "month" ||
                nodetype == "week" ||
                nodetype == "time" ||
                nodetype == "datetime" ||
                nodetype == "datetime-local") {
                debugger;
                node.curSelectDate = node.value;
                $("#" + node.id).on("change", function () {
                    debugger;
                    var mindate = new Date($(this).attr("min"));
                    var maxdate = new Date($(this).attr("max"));
                    var thisdate = new Date(this.valueAsNumber);
                    if (mindate > thisdate) {
                        console.log("date low");
                        if (this.curSelectDate) this.value = this.curSelectDate;
                        this.style.borderColor = "#ff0000";
                        return;
                    } else if (maxdate < thisdate) {
                        console.log("date height");
                        if (this.curSelectDate) this.value = this.curSelectDate;
                        this.style.borderColor = "#ff0000";
                        return;
                    } else {
                        this.style.borderColor = "";
                        this.curSelectDate = this.value;
                    }
                    debugger;
                });
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
//-----------------------------id card validate--------------------
function validateIdCard(idCard) {
    //15位和18位身份证号码的正则表达式
    var regIdCard = /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;

    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(idCard)) {
        if (idCard.length == 18) {
            var idCardWi = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2); //将前17位加权因子保存在数组里
            var idCardY = new Array(1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2); //这是除以11后，可能产生的11位余数、验证码，也保存成数组
            var idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
            for (var i = 0; i < 17; i++) {
                idCardWiSum += idCard.substring(i, i + 1) * idCardWi[i];
            }

            var idCardMod = idCardWiSum % 11; //计算出校验码所在数组的位置
            var idCardLast = idCard.substring(17); //得到最后一位身份证号码

            //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
            if (idCardMod == 2) {
                if (idCardLast == "X" || idCardLast == "x") {
                    return true;
                } else {
                    alert("身份证号码错误！");
                }
            } else {
                //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
                if (idCardLast == idCardY[idCardMod]) {
                    return true;
                } else {
                    alert("身份证号码错误！");
                }
            }
        }
    } else {
        alert("身份证格式不正确!");
    }
    return false;
}
