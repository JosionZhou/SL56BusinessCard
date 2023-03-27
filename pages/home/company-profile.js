const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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

  },
  onEditorReady() {
    const that = this
    let editor=wx.createSelectorQuery().select('#editor');
    console.log(editor)
    wx.createSelectorQuery().select('#editor').context(function (res) {
      if(res==null) return;
      console.log("editorCtx:",res);
      that.editorCtx = res.context;
      that.getCompanyProfile();
    }).exec()
  },
  getCompanyProfile(){
    const that =this;
    let data={
      url:app.globalData.serverAddress + "/BusinessCard/GetCompanyProfile",
      method:"GET",
      success:function(res){
        that.editorCtx.setContents({
          delta:JSON.parse(res)
        });
      }
    } 
    app.NetRequest(data);
  }
})