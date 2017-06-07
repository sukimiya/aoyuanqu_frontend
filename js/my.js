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
    if (me != null) {
        if (me.nodeName == "img")
            me.attr("src", rsstr);
    }
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
    mythis.request = function (mothed, module, data, onSeccess, onError, post = "GET", dataType = "json") {
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
            success: onSeccess,
            error: onError
        });
    }
    return mythis;
}())

//-----------------------------微信---------------------------
var myweixin = (function () {
    var authurl = "https://open.weixin.qq.com/connect/oauth2/";
    var appid = "wx7a6967db884b7058";
    var mythis = {};
    mythis.yxName = "廊下经济园区";
    mythis.openid = "";
    mythis.requestRoot = "http://119.29.153.19:8082/";
    mythis.apilist = ["wx.previewImage", "wx.chooseImage"];
    mythis.redictlocation = window.location.href.split("#")[0];
    var mylocation = encodeURIComponent(mythis.redictlocation);
    wx.error(function (res) {
        if (mythis.onError) mythis.onError(res)
    });
    mythis.initial = function () {
        console.log("微信配置初始化中");
        debugger;
        mythis.requestOpenid();
    };
    mythis.config = function (wxticket) {
        var wxjsapi_ticket = wxticket;
        var mytimestamp = Date.parse(new Date());
        var mynonceStr = sha1.hash(String(mytimestamp)).substring(0,16);
        debugger;
        var mysignature = mynonceStr + wxjsapi_ticket + mytimestamp + window.location.href.split("#")[0];
        console.log(mynonceStr+"::"+wxjsapi_ticket+"::"+mytimestamp+"::"+window.location.href.split("#")[0]);
        var signatureSHA1 = sha1.hash(mysignature);
        debugger;
        wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId: appid, // 必填，公众号的唯一标识
            timestamp: mytimestamp, // 必填，生成签名的时间戳
            nonceStr: mynonceStr, // 必填，生成签名的随机串
            signature: signatureSHA1, // 必填，签名，见附录1
            jsApiList: ['checkJsApi',
                        'chooseImage',
                        'previewImage',
                        'uploadImage',
                        'getNetworkType']
        });
        if (mythis.onInitial) mythis.onInitial();
    };
    mythis.requestOpenid = function (wxcode) {
        var openid = localStorage.getItem("wxopenid");
        if (openid != null && openid != undefined) {
            console.log("wxopenid:"+openid);
        } else {
            if (GetRequest()["code"] != null && GetRequest()["code"] != undefined)
                wxcode = GetRequest()["code"];

            if (wxcode != null && wxcode != undefined) {
                var myapi = restapis;
                myapi.request("getOppen_id", null, "code=" + wxcode, function (result) {
                        debugger;
                        mythis.openid = result.openid;
                        localStorage.setItem("wxopenid", result.openid);
                        localStorage.setItem("wxwebtoken", result.access_token);
                        localStorage.setItem("wxwebrefreshtoken", result.refresh_token);
                        localStorage.setItem("wxwebtokenexpires", (new Date().getTime()) + result.expires_in);
                        if (mythis.onOpenid) mythis.onOpenid();
                        mythis.requestToken();
                    },
                    function (req, e, data) {
                        (errorHandler).onWXError(req, e, data);
                    }
                );
            } else {
                mythis.requestCode();
            }
        }
    }
    mythis.requestToken = function () {
        var myapi = restapis;
        myapi.request("getAccessToken", null, "yxName=" + mythis.yxName, function (result) {
            debugger;
            mythis.openid = result.openid;
            localStorage.setItem("wxtoken", result.accessToken);
            localStorage.setItem("wxtokenexpires", (new Date().getTime()) + result.expiresIn);
            window.location=window.location.href.split("?")[0];
        }, function (req, e, data) {
            (errorHandler).onWXError(req, e, data);
        });
    };
    mythis.requestTicket = function (mytoken = null) {
        /*if (mytoken == null)
            mytoken = localStorage.getItem("wxtoken");
        if (mytoken != null && mytoken != undefined) {
            if (localStorage.getItem("wxticket") != null & localStorage.getItem("wxticket") != undefined) {
                if (mythis.onTicketGet) mythis.onTicketGet();
                mythis.config(localStorage.getItem("wxticket"));
            } else {
                $.ajax({
                    type: "GET",
                    dataType: "json",
                    url: "https://api.weixin.qq.com/cgi-bin/ticket/getticket",
                    data: "access_token=" + mytoken + "&type=jsapi",
                    success: function (data) {
                        if (data.errcode == 0) {
                            localStorage.setItem("wxticket", data.ticket);
                            localStorage.setItem("wxticketexpires", (new Date().getTime()) + data.expires_in);
                            mythis.config(data.ticket);
                        } else {
                            (errorHandler).onWXError(null, null, data);
                        }
                    },
                    error: function (req, e, data) {
                        (errorHandler).onWXError(req, e, data);
                    }
                });
            }
        } else {
            mythis.requestOpenid();
        }*/
        var myapi = restapis;
        myapi.request("getJSApiTicket", null, "yxName=" + mythis.yxName, function (result) {
            if (result.errcode == 0) {
                localStorage.setItem("wxticket", result.ticket);
                localStorage.setItem("wxticketexpires", (new Date().getTime()) + result.expires_in);
                mythis.config(result.ticket);
            } else {
                (errorHandler).onWXError(null, null, result);
            }
        }, function (req, e, data) {
            (errorHandler).onWXError(req, e, data);
        });
    }
    mythis.requestCode = function () {
        window.location = authurl + "authorize" + "?" + "appid=" + appid + "&redirect_uri=" + mylocation + "&response_type=code&scope=snsapi_base&state=0#wechat_redirect";
    }
    mythis.login = function () {

    }
    mythis.onInitial = null;
    mythis.onTicketGet = null;
    mythis.onOpenid = null;
    mythis.onError = null;
    return mythis;
}());

function previewImagebyWX(theimg) {
    wx.previewImage({
        current: theimg, // 当前显示图片的http链接
        urls: [theimg] // 需要预览的图片http链接列表
    });
}

function uploadImgWithName(picname, theimg) {
    var imgpath = "";
    debugger;
    var mywx = myweixin;

    wx.checkJsApi({
        jsApiList: ['chooseImage'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function (res) {
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
            debugger;
            
            if (res.errMsg == "checkJsApi:ok"&&res.checkResult.hasOwnProperty("chooseImage")&&res.checkResult["chooseImage"]) {
                wx.chooseImage({
                    count: 1, // 默认9
                    sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
                    sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
                    success: function (res) {
                        var localIds = res.localIds;
                        imgpath = localIds[0];
                        $(theimg).attr("src", imgpath);
                        console.log("本地图片id:" + imgpath);
                        $.ajax({
                            type: "POST",
                            url: "json/uploadfiles.json",
                            dataType: "json",
                            enctype: 'multipart/form-data',
                            data: {
                                file: imgpath
                            },
                            success: function (ret) {
                                if (ret == 0) {
                                    $(picname).val(ret.picid);
                                }
                            },
                            error: function (e) {
                                debugger;
                                console.log("上传失败了");
                            }

                        });
                    }
                });
            } else {
                mywx.onTicketGet = function () {
                    debugger;
                    wx.chooseImage({
                        count: 1,
                        sizeType: ['original', 'compressed'],
                        sourceType: ['album', 'camera'],
                        success: function (res) {
                            var localIds = res.localIds;
                            imgpath = localIds;
                            $(theimg).attr("src", imgpath);
                            console.log("本地图片id:" + imgpath);
                            $.ajax({
                                type: "POST",
                                url: "json/uploadfiles.json",
                                dataType: "json",
                                enctype: 'multipart/form-data',
                                data: {
                                    file: imgpath
                                },
                                success: function (ret) {
                                    if (ret == 0) {
                                        $(picname).val(ret.picid);
                                    }
                                },
                                fail: function (e) {
                                    debugger;
                                    console.log("上传失败了");
                                }

                            });
                        }
                    });
                }
                mywx.requestTicket();
            }

        }
    });


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
    debugger;
    for (var i = 0; i < aform.length; i++) {
        if (aform[i].hasOwnProperty("disabled"))
            aform[i].disabled = toDisabled;
    }
}

/*---------------------------上传文件----------------------*/
//policy 要经过base64编码， signature 还要进一步处理，可以查阅官方文档

function OssUpload(param, file, fileName, callBack) {
    var policyBase64 = Base64.encode(param.policy);
    var signature = param.signature.split(':')[1];
    var filePathName = param.filePath + "/" + param.fileName;
    var fileFullName = param.contentHostName + "/" + filePathName;
    var request = new FormData();
    request.append('OSSAccessKeyId', param.accessKeyId);
    request.append('policy', policyBase64);
    request.append('Signature', signature);
    request.append('key', filePathName);
    for (var i in param.metaDatas) {
        request.append(i, param.metaDatas[i]);
    }
    request.append('file', file);
    request.append('submit', "Upload to OSS");
    $.ajax({
        url: param.contentHostName,
        data: request,
        processData: false,
        cache: false,
        async: false,
        contentType: false,
        //关键是要设置contentType 为false，不然发出的请求头 没有boundary
        //该参数是让jQuery去判断contentType
        type: "POST",
        success: function (data, textStatus, request) {
            if (textStatus === "nocontent") {
                callBack(fileFullName);
                alert("success!");
            } else {
                alert(textStatus);
            }
        }
    });
}
//------------------------------------------session

function logins(logincallbackFn) {
    $.ajax({
        type: "POST",
        url: "json/u_login.json",
        dataType: "json",
        success: function (data, textStatus, request) {
            debugger;
            if (data.result == 0) {
                var rsobj = {};
                rsobj["userid"] = data.userid;
                rsobj["name"] = data.name;
                rsobj["charactor"] = data.charactor;
                sessionStorage.setItem("userid", data.userid);
                sessionStorage.setItem("name", data.name);
                sessionStorage.setItem("charactor", data.charactor);
                //如果角色大于10就是管理员
                if (ret.charactor > 10) {
                    sessionStorage.setItem("pri_ee_u_1", data.pri_ee_u_1);
                    sessionStorage.setItem("pri_ee_u_2", data.pri_ee_u_2);
                    sessionStorage.setItem("pri_ee_u_3", data.pri_ee_u_3);
                }
                if (logincallbackFn)
                    logincallbackFn(true);
                console.log("登录成功");
            } else {
                if (logincallbackFn)
                    logincallbackFn(false);
                console.log("登录失败");
            }
        }
    });
}

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