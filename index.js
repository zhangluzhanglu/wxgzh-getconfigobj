(function (factory) {
  typeof define === 'function' && define.amd ? define(factory) :
  factory();
}((function () { 'use strict';

  var sha1 = require('sha1');
  var request = require("request");

  /**
   * 函数名：getConfigObj
   * 作用：根据传入的参数获取权限验证配置对象
   * 参数：baseObj,res
   * baseObj:表示公众号配置信息的基础对象
      {
        url:"",//使用此对象的前端网页的URL
        appid:"",//微信公众号的appid
        secret:"",微信公众号的开发者密码
      }
   * res:此次前端请的响应对象,用于把配置对象返回给前端的
   */

  function wxgzh_getConfigObj(baseObj, res) {
    if (!baseObj) {  //如果没有传入baseObj，则给一个默认值
      baseObj = {
        url: "",//使用此对象的前端网页的URL
        appid: "",//微信公众号的appid
        secret: "", //微信公众号的开发者密码
      };
    }

    //准备需要的参数（除了签名ticket外，其他都可以直接获取）
    var configObj = {
      jsapi_ticket: "",
      noncestr: "zlabcd",//随机字符串
      timestamp: new Date().getTime(),
      url: baseObj.url
    };
    // --------------------------获取签名【ticket】的流程----------------------------
    //对access_token，jsapi_ticket做缓存
    var access_token = "";
    var getAccessTokenTime = 0; //获取access_token的时刻，用于判断是否需要重新获取
    var getJsapi_ticket = 0; //获取jsapi_ticket的时刻，用于判断是否需要重新获取

    //先获取 access_token
    var rq1 = new Promise(function (resolve, reject) {
      //计算当前时间与上一次获取access_token的时间差
      var currentTime = new Date().getTime() / 1000;
      if (access_token === "" || currentTime - getAccessTokenTime >= 6900) {  //大于6900表示在两个小时前5分钟重新获取token
        request.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + baseObj.appid + "&secret=" + baseObj.secret, function (err, response, body) {
          console.info("response:", response.body);
          access_token = JSON.parse(response.body).access_token;//默认是字符串，需要手动转换下
          getAccessTokenTime = new Date().getTime() / 1000; //设置此时的时间，单位为秒
          // console.info("access_token1:", access_token);
          resolve(access_token);
        });
      }
      else {
        // console.info("access_token2:", access_token);
        resolve(access_token);
      }
    });
    //使用access_token获取jsapi_ticket
    var rq2 = rq1.then(d => {
      var currentTime = new Date().getTime() / 1000;
      {
        return new Promise(function (resolve, reject) {
          request.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + d + "&type=jsapi", function (err, response, body) {
            var jsapi_ticket = JSON.parse(response.body).ticket;
            getJsapi_ticket = new Date().getTime() / 1000; //设置此时的时间，单位为秒
            // console.info("ticket1:", jsapi_ticket);
            resolve(jsapi_ticket);
          });
        })
      }
    });
    //--------根据jsapi_ticket，noncestr，timestamp，url生成签名--------------
    rq2.then(function (d) {
      if (d !== undefined) {
        configObj.jsapi_ticket = d;
        //先对所有待签名参数按照字段名的ASCII 码从小到大排序（字典序）后,使用URL键值对的格式（即key1=value1&key2=value2…）拼接成字符串string1
        var str1 = "";
        for (let key in configObj) {
          str1 += key + "=" + configObj[key] + "&";
        }
        var str1 = str1.slice(0, -1);
        console.log("str1", str1);
        //对string1进行sha1签名，得到 signature
        let signature = sha1(str1);
        configObj.signature = signature;
        //打印最后的configObj对象
        console.log("configObj", configObj);
        if(res) res.send({ ...configObj, appId: baseObj.appid, });
        else return { ...configObj, appId: baseObj.appid}
      }
    });

  }

  module.exports = wxgzh_getConfigObj;

})));
