//app.js
App({
  onLaunch: function (options) {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function (options) {
    console.log(options.scene);
    if (options.scene == 1007 || options.scene == 1008){
      this.globalData.showEdit=false;
      this.globalData.showHomeButton=false;
    }else{
      this.globalData.showEdit = true;
      this.globalData.showHomeButton=true;
    }
  },
  globalData: {
    userInfo: null,
    // serverAddress: 'http://192.168.0.30:8033/api',
    // authServerAddress: 'http://192.168.0.30:8032',
    serverAddress: 'https://api.sl56.com/api',
    authServerAddress: 'https://www.sl56.com',
  },
  NetRequest: function ({ url, data, success, fail, complete, method = "POST",contentType='application/x-www-form-urlencoded' }) {

    var session_id = wx.getStorageSync('ASPSESSID');//本地取存储的sessionID
    var auth = wx.getStorageSync('ASPAUTH');
    var header;
    if (session_id != null && session_id != "") {
      header = { 'content-type': contentType, 'Cookie': 'ASP.NET_SessionId=' + session_id + ';sl56Auth=' + auth + ';OpenId=' + this.globalData.openId }
    } else {
      header = { 'content-type': contentType }
    }
    this.globalData.header = header;
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: res => {
        var data = res.data
        res['statusCode'] === 200 ? success(data) : fail(res)
      },
      fail: res => {
      },
      complete: complete
    })
  }
})