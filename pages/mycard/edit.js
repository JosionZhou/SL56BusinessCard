import FileHelper from '../../utils/FileHelper';
var app = getApp();
const fs = wx.getFileSystemManager();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAddress: "",
    showAvatarUrl:"",
    cameraLeft: 0,
    headImgWidth: 0,
    rightBoxWidth: 0,
    phoneFocus: false,
    textCount: 0,
    nameWarning: true,
    phoneWarning: true,
    positionWarning: true,
    titleWarning: true,
    businessCardInfo: null,
    showPage: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: "请稍后",
    });
    var main = this;
    var headImgWidth = parseInt(wx.getSystemInfoSync().windowWidth * 0.15);
    var cameraLeft = parseInt(headImgWidth / 2) - 5;
    this.FileHelper = new FileHelper();
    this.setData({
      headImgWidth: headImgWidth,
      rightBoxWidth: wx.getSystemInfoSync().windowWidth - headImgWidth - 10,
      cameraLeft: cameraLeft
    });
    var data = {
      url: app.globalData.serverAddress + "/BusinessCard/GetData?id=" + app.globalData.id,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        res.ShowAddress = res.Address.split("|")[0];
        res.Latitude = res.Address.split("|")[1].split(",")[0];
        res.Longitude = res.Address.split("|")[1].split(",")[1];
        main.setData({
          businessCardInfo: res,
          nameWarning: res.ObjectName == null || res.ObjectName.length == 0,
          phoneWarning: res.Phone == null || res.Phone.length == 0,
          positionWarning: res.Post == null || res.Post.length == 0,
          titleWarning: res.Title == null || res.Title.length == 0,
          showPage: true
        });
        main.loadAvatar(main);
      },
      fail: function (res) {
        wx.hideLoading();
        wx.showModal({
          title: "获取用户数据失败",
          content: res,
        })
      }
    };
    app.NetRequest(data);
  },
  //加载头像，如果是微信头像则直接显示，如果是上传的图片，则先下载到本地再显示
  loadAvatar:function(context){
    if (context.data.businessCardInfo.AvatarUrl.indexOf("UploadFiles") != -1) {
      let avatarUrl = context.data.businessCardInfo.AvatarUrl;
      avatarUrl = avatarUrl.replaceAll("/", "%2F");
      context.FileHelper.downloadFile(avatarUrl, function (res) {
        context.setData({
          showAvatarUrl: res.tempFilePath
        });
      });
    }else{
      context.setData({
        showAvatarUrl:context.data.businessCardInfo.AvatarUrl,
      });
    }
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
      case "title":
        if (value.trim().length > 0) {
          this.setData({
            titleWarning: false
          });
        } else {
          this.setData({
            titleWarning: true
          });
        }
        break;
    }
  },
  save: function (e) {
    var isValid = !this.data.nameWarning && !this.data.phoneWarning && !this.data.positionWarning && !this.data.titleWarning;
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
    var obj = this.data.businessCardInfo;
    obj.ObjectName=e.detail.value.name;
    obj.Phone = e.detail.value.phone;
    obj.Position = e.detail.value.position;
    obj.Email = e.detail.value.email;
    obj.Title=e.detail.value.title;
    obj.Brief = e.detail.value.brief;
    obj.Post = e.detail.value.position;
    obj.Profile = e.detail.value.brief;
    // obj.QQ = e.detail.value.qq;
    // obj.Wechat = e.detail.value.wechat;
    var data = {
      url: app.globalData.serverAddress + "/BusinessCard/Save",
      data: obj,
      success: function (res) {
        wx.hideLoading();
        if (res) {
          wx.navigateBack({
            delta: 0,
            fail:function(res){//因为跳转到当前页面有两种方式，第一种是登录时检测到未设置名片信息，此时使用redirect跳转；第二种是主动编辑修改名片信息时，使用navigate跳转；所以使用navigateback返回失败时，使用redirect
              wx.redirectTo({
                url: '/pages/mycard/index',
              });
            }
          });
        } else {
          wx.showModal({
            title: "保存失败",
            content: "请重试",
          });
        }
      },
      fail: function (res) {
        wx.showModal({
          title: "保存失败",
          content: res,
        });
      }
    };
    app.NetRequest(data);
  },
  chooseAvatar: function () {
    var main = this;
    wx.showActionSheet({
      // itemList: [ '选择图片','获取微信头像'],
      itemList: ['选择图片'],
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 1) {
            main.refreshAvatar();
          } else {
            wx.chooseImage({
              count: 1,
              success: function (res) {
                let loaclFilePath = res.tempFilePaths[0]
                fs.readFile({
                  filePath: loaclFilePath,
                  success(res) {
                    main.FileHelper.uploadFile(loaclFilePath, function (data) {
                      console.log("serverFilePath:", data);
                      main.data.businessCardInfo.AvatarUrl = data;
                      main.setData({
                        showAvatarUrl:loaclFilePath
                      });
                    });
                  }
                });
                wx.uploadFile({
                  url: '',
                  filePath: res.tempFilePaths[0],
                  name: '',
                })
              },
            });
          }
        }
      }
    });
  },
  refreshAvatar: function () {
    let main = this;
    wx.getUserProfile({
      desc: 'desc',
      success: function (res) {
        main.data.businessCardInfo.AvatarUrl = res.userInfo.avatarUrl;
        console.log(res.userInfo.avatarUrl);
        main.setData({
          showAvatarUrl:res.userInfo.avatarUrl
        });
      }
    });
  },
  tapAddress: function () {
    let main = this;
    console.log("tap Address");
    wx.chooseLocation({
      latitude: main.data.businessCardInfo.Latitude,
      longitude: main.data.businessCardInfo.Longitude,
      success: res => {
        let businessCardInfo = main.data.businessCardInfo;
        businessCardInfo.Latitude = res.latitude;
        businessCardInfo.Longitude = res.longitude;
        businessCardInfo.Address = res.address + "|" + res.latitude + "," + res.longitude;
        businessCardInfo.ShowAddress = res.address;
        main.setData({
          businessCardInfo: businessCardInfo
        });
      }
    });
  },
  chooseCardType(){
    let main=this;
    wx.navigateTo({
      url: './choose-card-type/index',
      events:{
        "apply":function(res){
          console.log(res);
          main.data.businessCardInfo.Format=res.type;
          main.data.businessCardInfo.BackgroundImg=res.bgImage;
          console.log(main.data.businessCardInfo);
        }
      },
      success:function(res){
        res.eventChannel.emit("editCardType",{type:main.data.businessCardInfo.Format,bgImage:main.data.businessCardInfo.BackgroundImg});
      }
    })
  }
})