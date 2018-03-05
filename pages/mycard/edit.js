// pages/mycard/edit.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatar: "/img/avatar.png",
    address: "深圳宝安兴围鸿通物流城A区一栋",
    cameraLeft: 0,
    headImgWidth: 0,
    rightBoxWidth: 0,
    phoneFocus: false,
    textCount: 0,
    nameWarning: true,
    phoneWarning: true,
    positionWarning: true,
    item: null,
    showPage:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "请稍后",
    });
    var main = this;
    var headImgWidth = parseInt(wx.getSystemInfoSync().windowWidth * 0.2);
    var cameraLeft = parseInt(headImgWidth / 2) - 5;
    this.setData({
      headImgWidth: headImgWidth,
      rightBoxWidth: wx.getSystemInfoSync().windowWidth - headImgWidth - 10,
      cameraLeft: cameraLeft,
      avatar: app.globalData.userInfo.avatarUrl
    });
    var data = {
      url: app.globalData.serverAddress + "/BusinessCard/GetData?id=" + app.globalData.id,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        main.setData({
          item: res,
          nameWarning: res.Name == null || res.Name.length == 0,
          phoneWarning: res.Phone == null || res.Phone.length == 0,
          positionWarning: res.Position == null || res.Position.length == 0,
          showPage:true
        });
      },
      fail:function(res){
        wx.hideLoading();
        wx.showModal({
          title: "获取用户数据失败",
          content: res,
        })
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
  onShareAppMessage: function () {

  },
  next: function () {
    this.setData({
      phoneFocus: true
    });
  },
  inputSynopsis: function (e) {
    this.setData({
      textCount: e.detail.value.length
    });
  },
  inputInfo: function (e) {
    var sign = e.currentTarget.dataset.sign;
    var value = e.detail.value;
    switch (sign) {
      case "name":
        if (value.trim().length > 0) {
          this.setData({
            nameWarning: false
          });
        } else {
          this.setData({
            nameWarning: true
          });
        }
        break;
      case "phone":
        if (value.trim().length > 0) {
          this.setData({
            phoneWarning: false
          });
        } else {
          this.setData({
            phoneWarning: true
          });
        }
        break;
      case "position":
        if (value.trim().length > 0) {
          this.setData({
            positionWarning: false
          });
        } else {
          this.setData({
            positionWarning: true
          });
        }
        break;
    }
  },
  save: function (e) {
    var isValid = !this.data.nameWarning && !this.data.phoneWarning && !this.data.positionWarning;
    if (!isValid) {
      wx.showModal({
        title: "警告",
        content: "必填项不能为空",
        showCancel: false
      });
      return;
    }
    wx.showLoading({
      title: "请稍后",
    })
    var obj = this.data.item;
    obj.Phone = e.detail.value.phone;
    obj.Position = e.detail.value.position;
    obj.Email = e.detail.value.email;
    obj.Brief = e.detail.value.brief;
    obj.AvatarUrl = this.data.avatar;
    var data = {
      url: app.globalData.serverAddress + "/BusinessCard/Save",
      data: obj,
      success: function (res) {
        wx.hideLoading();
        if (res) {
          wx.navigateBack({
            url: "index",
          });
        } else {
          wx.showModal({
            title: "保存失败",
            content: "请重试",
          })
        }
      }
    };
    app.NetRequest(data);
  },
  chooseAvatar: function () {
    var main = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        main.setData({
          avatar: res.tempFilePaths[0]
        });
        wx.uploadFile({
          url: '',
          filePath: res.tempFilePaths[0],
          name: '',
        })
      },
    })
  }
})