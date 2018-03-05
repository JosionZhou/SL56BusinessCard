// pages/mycard/index.js
var app = getApp()
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
    id:null
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
      headImgWidth: parseInt(wx.getSystemInfoSync().windowWidth * 0.2)
    });
    var images = new Array();
    for (var i = 0; i <= 8; i++) {
      var imgUrl = "show0" + i + ".jpg";
      var float = "left";
      if (i > 0 && (i + 1) % 2 == 0) {
        float = "right";
      }
      var imgObj = {
        url: imgUrl,
        float: float
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
    var current = e.currentTarget.dataset.url;
    var images = this.data.images;
    var urls = new Array();
    for (var i = 0; i < images.length; i++) {
      urls.push("https://www.sl56.com/showimages/" + images[i].url)
    }
    wx.previewImage({
      urls: urls,
      current: "https://www.sl56.com/showimages/" + current
    })
  },
  edit: function () {
    wx.navigateTo({
      url: 'edit',
    })
  }
})