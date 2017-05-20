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
    //添加数据$.session.set('key', 'value')删除数据$.session.remove('key');获取数据$.session.get('key');清除数据$.session.clear();
}

function getRemotePic(picid, me = null) {
    var rsstr = "uploads/" + picid; //remoteaddress+"/"+picid
    if (me != null) {
        if (me.nodeName == "img")
            me.attr("src", rsstr);
    }
    return rsstr;
}

function previewImagebyWX(theimg) {
    wx.previewImage({
        current: theimg, // 当前显示图片的http链接
        urls: [theimg] // 需要预览的图片http链接列表
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
    $.ajax {
        url: "json/u_login.json",
        success: function (ret) {
            if (ret.result == 0) {
                var rsobj = {};
                rsobj["userid"] = ret.userid;
                rsobj["name"] = ret.name;
                rsobj["charactor"] = ret.charactor;
                sessionStorage.setItem("userid", ret.userid);
                sessionStorage.setItem("name", ret.name);
                sessionStorage.setItem("charactor", ret.charactor);
                //如果角色大于10就是管理员
                if (ret.charactor > 10) {
                    sessionStorage.setItem("pri_ee_u_1", ret.pri_ee_u_1);
                    sessionStorage.setItem("pri_ee_u_2", ret.pri_ee_u_2);
                    sessionStorage.setItem("pri_ee_u_3", ret.pri_ee_u_3);
                }
                logincallbackFn(true);
                console.log("登录成功");
            }else{
                logincallbackFn(false);
                console.log("登录失败");
            }
        }
    }
}

function getsessioninfo() {
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
    return null;
}

function isManager() {
    if (getsessioninfo()["charactor"] > 10) {
        return true;
    }
    return false;
}
