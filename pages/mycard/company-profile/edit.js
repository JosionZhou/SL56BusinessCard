import FileHelper from '../../../utils/FileHelper';
const app = getApp();
Page({
  data: {
    formats: {},
    readOnly: false,
    placeholder: '开始输入...',
    editorHeight: 300,
    keyboardHeight: 0,
    isIOS: false,
    delta: null,
    profileIndex: 0
  },
  readOnlyChange() {
    this.setData({
      readOnly: !this.data.readOnly
    });
  },
  onLoad(options) {
    this.FileHelper = new FileHelper();
    const platform = wx.getSystemInfoSync().platform
    const isIOS = platform === 'ios'
    this.setData({
      isIOS,
      profileIndex: options.index
    })
    const that = this
    this.updatePosition(0)
    let keyboardHeight = 0
    wx.onKeyboardHeightChange(res => {
      if (res.height === keyboardHeight) return
      const duration = res.height > 0 ? res.duration * 1000 : 0
      keyboardHeight = res.height
      setTimeout(() => {
        wx.pageScrollTo({
          scrollTop: 0,
          success() {
            that.updatePosition(keyboardHeight)
            that.editorCtx.scrollIntoView()
          }
        })
      }, duration)

    })
  },
  updatePosition(keyboardHeight) {
    const toolbarHeight = 50
    const {
      windowHeight,
      platform
    } = wx.getSystemInfoSync()
    let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
    this.setData({
      editorHeight,
      keyboardHeight
    })
  },
  calNavigationBarAndStatusBar() {
    const systemInfo = wx.getSystemInfoSync()
    const {
      statusBarHeight,
      platform
    } = systemInfo
    const isIOS = platform === 'ios'
    const navigationBarHeight = isIOS ? 44 : 48
    return statusBarHeight + navigationBarHeight
  },
  onEditorReady() {
    const that = this
    let editor = wx.createSelectorQuery().select('#editor');
    console.log(editor);
    wx.createSelectorQuery().select('#editor').context(function (res) {
      console.log("editor:", res);
      that.editorCtx = res.context;
      that.getData();
    }).exec()
  },
  blur() {
    this.editorCtx.blur()
  },
  format(e) {
    let {
      name,
      value
    } = e.target.dataset
    if (!name) return
    // console.log('format', name, value)
    this.editorCtx.format(name, value)

  },
  onStatusChange(e) {
    const formats = e.detail
    this.setData({
      formats
    })
  },
  insertDivider() {
    this.editorCtx.insertDivider({
      success: function () {
        console.log('insert divider success')
      }
    })
  },
  clear() {
    this.editorCtx.clear({
      success: function (res) {
        console.log("clear success")
      }
    })
  },
  removeFormat() {
    this.editorCtx.removeFormat()
  },
  insertDate() {
    const date = new Date()
    const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
    this.editorCtx.insertText({
      text: formatDate
    })
  },
  insertImage() {
    const that = this
    let id = "img" + new Date().getTime();
    console.log("img-Id:", id);
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let imgUrl = 'data:image/png;base64,' + wx.arrayBufferToBase64(wx.getFileSystemManager().readFileSync(res.tempFilePaths[0]));
        that.editorCtx.insertImage({
          src: imgUrl,
          data: {
            id: id
          },
          width: '100%'
        })
      }
    })
  },
  submit() {
    const that = this;
    this.editorCtx.getContents({
      success: function (res) {
        console.log(res.delta);
        that.data.delta = res.delta;
        wx.showModal({
          title: "提示",
          content: "确定提交更改吗？",
          success: function (res1) {
            if (res1.confirm) {
              let data = {
                url: app.globalData.serverAddress + (that.data.profileIndex==0?"/BusinessCard/SetCompanyProfile" :("/BusinessCard/SetCompanyProfile?index="+that.data.profileIndex)),
                contentType: "application/json",
                data: res.delta,
                success: function (res2) {
                  if (res2.length > 0) {
                    wx.showModal({
                      showCancel: false,
                      title: "保存失败",
                      content: res2
                    });
                  } else {
                    wx.showModal({
                      showCancel: false,
                      title: "提示",
                      content: "保存成功"
                    });
                  }
                }
              }
              app.NetRequest(data);
            }
          }
        });
      }
    });
  },
  getData() {
    const that = this;
    let data = {
      url: app.globalData.serverAddress + (that.data.profileIndex==0?"/BusinessCard/GetCompanyProfile":("/BusinessCard/GetCompanyProfile?index=" + that.data.profileIndex)),
      method: "GET",
      success: function (res) {
        console.log("Content:", res);
        if (res != null && res.length>0) {
          that.editorCtx.setContents({
            delta: JSON.parse(res)
          });
        }
      }
    }
    app.NetRequest(data);
  }
})