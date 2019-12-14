#### 作用

此模块用于获取微信公众号调用js-sdk时的配置对象

#### 安装命令
``` javascript
 cnpm i wxgzh-getconfigobj -S
```
#### 使用方式一 : 将配置对象作为返回值返回
``` javascript
//引入此模块
var wxgzh_getConfigObj=require("wxgzh-getconfigobj");

//获取调用js-sdk时需要的配置对象
var configObj = wxgzh_getConfigObj(
  {
    url: "http://******.com/",//使用此对象的前端网页的URL
    appid: "wxfe0******07d707",//微信公众号的appid
    secret: "a8b5******091a1c727",//微信公众号的开发者密码
  },
  null,//是否将配置对象响应到前端，null表示返回不响应，只作为返回值返回
  true,//是否打印出日志，true表示打印，默认为true
)

//将返回的配置对象显示出来
configObj.then(function (val) {
  console.log("configObj:\n", val)
})
```
#### 使用方式二 : 将配置对象直接响应到前端
``` javascript
//引入此模块
var wxgzh_getConfigObj=require("wxgzh-getconfigobj");

//定义路由接口，直接将配置对象返回到前端
router.get('/getConfigObj', function (req, res, next) {
 wxgzh_getconfigobj(//获取调用js-sdk时需要的配置对象
    {
      url: "http://******.com/",//使用此对象的前端网页的URL
      appid: "wxfe0******07d707",//微信公众号的appid
      secret: "a8b5******091a1c727",//微信公众号的开发者密码
    },
    res,//传入响应对象！！！！
    false,//生成配置对象的过程中不打印日志
  )
});

```