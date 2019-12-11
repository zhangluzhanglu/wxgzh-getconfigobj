# 此模块用于获取微信公众号调用js-sdk时的配置对象

   * 函数名：getConfigObj
   * 作用：根据传入的参数获取权限验证配置对象
   * 参数：baseObj,res
   * baseObj:表示公众号配置信息的基础对象
      {
        url:"",//使用此对象的前端网页的URL
        appid:"",//微信公众号的appid
        secret:"",微信公众号的开发者密码
      }
   * res:
      此次前端请的响应对象,用于把配置对象返回给前端的.
      如果此参数没有传，那么就把配置对象作为函数返回值返回出去

# 使用示例
``` javascript
//获取调用js-sdk时需要的配置对象
router.get('/getConfigObj', function (req, res, next) {
  wxgzh_getconfigobj(
    {
      url: "http://zlabcd.****.com/",//使用此对象的前端网页的URL
      appid: "******",//微信公众号的appid
      secret: "********",//微信公众号的开发者密码
    },
    res,//传入响应对象
  )
});
```