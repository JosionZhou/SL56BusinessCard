const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight: null,
    empId: null,
    titles: ["升蓝物流名片", "升蓝物流公司荣誉", "升蓝物流产品介绍", "升蓝物流公司优势", "升蓝物流企业介绍", "升蓝物流联系我们"],
    allBarActions: [{
      name: "首页",
      index: 0
    }, {
      name: "公司资质",
      index: 1
    }, {
      name: "产品介绍",
      index: 2
    }, {
      name: "公司优势",
      index: 3
    }, {
      name: "企业介绍",
      index: 4
    }, {
      name: "联系我们",
      index: 5
    }],
    currentBarActions: [],
    profileCount: 6,
    current: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    let that = this;
    this.setData({
      empId: options.empId
      // empId: 112
    });
    this.changeBottomBar(0);
    wx.showLoading({
      title: '请稍候',
    })
    var data = {
      url: app.globalData.serverAddress + "/BusinessCard/GetData?id=" + this.data.empId,
      method: "GET",
      success: function (res) {
        wx.hideLoading();
        console.log(res);
        that.data.Latitude = res.Address.split("|")[1].split(",")[0];
        that.data.Longitude = res.Address.split("|")[1].split(",")[1];
        let nameArray = res.ObjectName.split('');
        let phoneArray = res.Phone.split('');
        let nameArray1 = new Array();
        let phoneArray1 = new Array();
        nameArray.forEach((element, index) => {
          nameArray1.push(element);
          if (index != nameArray.length - 1) {
            nameArray1.push(" ");
          }
        });
        phoneArray.forEach((element, index) => {
          phoneArray1.push(element);
          if (index == 2 || index == 6) {
            phoneArray1.push(" ");
          }
        });
        console.log(nameArray1);
        that.setData({
          name: nameArray1.toString().replaceAll(",", ""),
          phone: phoneArray1.toString().replaceAll(",", ""),
          email: res.Email,
          registeredResidence: res.RegisteredResidence,
          post:res.Post
        });
      },
      fail: function (err) {
        wx.hideLoading();
        wx.showModal({
          title: "获取用户数据失败",
          content: err.data.Message,
          showCancel: false
        })
      }
    };
    app.NetRequest(data);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // let isShowHomeButton = app.globalData.showHomeButton;
    // console.log("isShowHomeButton:",isShowHomeButton);
    // if(isShowHomeButton===false){
    //   wx.hideHomeButton();
    // }
    
    let systemInfo = wx.getSystemInfoSync();
    this.setData({
      windowHeight: systemInfo.windowHeight
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {
    // this.setData({
    //   current:0
    // });
    return {
      title: "　"+"　"+this.data.name.replaceAll(" ", "") + "　" +"　" +"　" + this.data.post,
      path: '/pages/home/company-profile?empId=' + this.data.empId,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  changeBottomBar(currentSwiperIndex) {
    let currentBarActions = this.data.allBarActions.map(p => p);
    currentBarActions.splice(currentSwiperIndex, 1);
    this.setData({
      currentBarActions: currentBarActions
    });
  },
  onEditorReady() {
    this.getCompanyProfile();
  },
  getCompanyProfile() {
    const that = this;
    for (let i = 1; i <= that.data.profileCount; i++) {
      let data = {
        url: app.globalData.serverAddress + "/BusinessCard/GetCompanyProfile?index=" + i,
        method: "GET",
        success: function (res) {
          // editorCtx.setContents({
          //   delta:JSON.parse(res)
          // });
          console.log("Contents:", res);
            wx.createSelectorQuery().select('#editor' + i).context(function (editorRes) {
              if (res == null) return;
              console.log("editorCtx:", editorRes);
              let contentStr = res;
              if (i == 1) {
                contentStr = contentStr.replaceAll("[名字]", that.data.name).replaceAll("[户籍]", that.data.registeredResidence);
              }
              let content = JSON.parse(contentStr);
              editorRes.context.setContents({
                delta: content
              });
            }).exec();
        }
      }
      app.NetRequest(data);
    }
  },
  swiperItemChange(event) {
    console.log(event);
    let that = this;
    let current = event.detail.current;
    let title = that.data.titles[current];
    console.log("current:", current, ";title:", title);
    // wx.setNavigationBarTitle({
    //   title: that.data.titles[current],
    // });
    this.changeBottomBar(current);
  },
  changeCurrentSwiperItem(event) {
    console.log(event);
    let current = event.target.dataset.index;
    this.setData({
      current: current
    });
  },
  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.phone.replaceAll(" ", ""),
    })
  },
  copyPhoneToWechatNumber() {
    wx.setClipboardData({
      data: this.data.phone.replaceAll(" ", ""),
      complete: function (res) {
        wx.hideToast();
        wx.showToast({
          icon: 'none',
          title: '号码已复制，请到添加好友界面粘贴搜索添加',
          duration: 3000
        });
      }
    });
  },
  openMap: function () {
    let main = this;
    let mapContext = wx.createMapContext('map', this);
    mapContext.openMapApp({
      longitude: parseFloat(main.data.Longitude),
      latitude: parseFloat(main.data.Latitude),
      destination: "升蓝物流"
    });
  }
})