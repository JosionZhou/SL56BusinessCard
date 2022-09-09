// pages/mycard/index.js
var app = getApp();
const updateManager = wx.getUpdateManager()

updateManager.onCheckForUpdate(function (res) {
  // 请求完新版本信息的回调
  console.log(res.hasUpdate)
})

updateManager.onUpdateReady(function () {
  wx.showModal({
    title: '更新提示',
    content: '新版本已经准备好，是否重启应用？',
    success: function (res) {
      if (res.confirm) {
        // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
        updateManager.applyUpdate()
      }
    }
  })
})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageHeight: 0,
    headImgWidth: 0,
    item: null,
    address: "深圳宝安兴围鸿通物流城A区一栋",
    companyName: "升蓝物流",
    title: "职位",
    images: [],
    addressStyle: "",
    showEdit: false,
    showPage:false,
    id:null,
    width:0,
    timestamp:new Date().getTime(),
    establishYears:new Date().getFullYear()-2012
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "请稍后",
    })
    this.setData({
      imageHeight: parseInt(wx.getSystemInfoSync().windowWidth * 0.4),
      headImgWidth: parseInt(wx.getSystemInfoSync().windowWidth * 0.2),
      width: wx.getSystemInfoSync().windowWidth
    });
    var images = new Array();
    var picIndexs = new Array(1,0,2,5,15,3,7,16,17,18,19,8,10,11);
    for (var i = 0; i < picIndexs.length; i++) {
      var imgUrl = "p" + (picIndexs[i])+".jpg";
      var imgObj = {
        url: imgUrl
      }
      images.push(imgObj);
    }
    this.setData({
      images: images
    });
    if(options.id!=null){
      this.data.id=options.id;
    }else{
      this.data.id=app.globalData.id;
    }
    // var id = options.id;
    // this.getCardInfo(id);
  },
  getCardInfo:function(){
    if(this.data.showEdit){
      this.data.id=app.globalData.id;
    }
    var main = this;
    var data = {
      url: app.globalData.serverAddress + "/BusinessCard/GetData?id=" + this.data.id,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        if(res.Email==null || res.Email.trim().length==0){
          res.Email="暂无邮箱";
        }
        main.setData({
          item: res
        });
        console.log(res)
        if (!main.data.showEdit) {
          wx.setNavigationBarTitle({
            title: res.Name + "的名片"
          });
        } else {
          wx.setNavigationBarTitle({
            title: "我的名片"
          });
          main.setData({
            addressStyle: "padding-right:0px;padding-bottom:0px"
          });
        }
        main.setData({
          showPage: true
        });
      }
    };
    app.NetRequest(data);
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      showEdit: app.globalData.showEdit
    });
    if(app.globalData.showEdit){
      this.setData({
        addressStyle: "padding-right:0px;padding-bottom:0px"
      });
    } else {
      this.setData({
        addressStyle: ""
      });
    }
    this.getCardInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (res) {
    return {
      title: "升蓝物流-"+this.data.item.Name + "的名片，望惠存",
      path: '/pages/mycard/index?id=' + this.data.item.Id,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  openMap: function () {
    wx.navigateTo({
      url: '/pages/map/index',
    })
  },
  call: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.item.Phone,
    })
  },
  saveContact: function () {
    var name1 = this.data.item.Name.substr(0, 1);
    var name2 = this.data.item.Name.replace(name1, "");
    var mobilePhoneNumber = this.data.item.Phone;
    wx.addPhoneContact({
      firstName: name2,
      lastName: name1,
      mobilePhoneNumber: mobilePhoneNumber,
      workAddressStreet: this.data.address,
      organization: this.data.companyName,
      title: this.data.item.Position,
      url: "https://www.sl56.com",
      email:this.data.item.Email
    })
  },
  preview: function (e) {
    var current = e.currentTarget.dataset.index;
    console.log(current)
    var images = this.data.images;
    var urls = new Array();
    for (var i = 0; i < images.length; i++) {
      urls.push("https://www.sl56.com/showimages/" + images[i].url)
    }
    wx.previewImage({
      urls: urls,
      current: "https://www.sl56.com/showimages/" + images[current-1].url
    })
  },
  edit: function () {
    wx.navigateTo({
      url: 'edit',
    })
  },
  unBind: function () {
    wx.showModal({
      title: '提示',
      content: '是否切换账号',
      success:function(res){
        if (res.confirm) {
          wx.showLoading({
            title: '请稍后',
          });
          var data = {
            url: app.globalData.serverAddress + "/BusinessCard/Unbind?id=" + app.globalData.id,
            success: function (res) {
              wx.hideLoading();
              if (res) {
                wx.removeStorageSync("ASPSESSID");//移除保存的会话id
                wx.removeStorageSync("ASPAUTH");//移除保存的凭证
                wx.redirectTo({
                  url: '/pages/login/index',
                })
              } else {
                wx.showModal({
                  title: "解绑失败",
                  showCancel: false
                })
              }

            },
            fail: function (res) {
              wx.hideLoading();
              wx.showModal({
                title: "操作异常",
                content: res,
                showCancel: false
              })
            }
          };
          app.NetRequest(data);
        }
      }
    });
  }
})