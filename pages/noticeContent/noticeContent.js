// pages/noticeContent/noticeContent.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noticeTypes:[],
    isFinishRequest: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
    this.requestNoticeType();
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

  requestNoticeType: function () {
    var that = this;

    app.webCall(app.serviceCode["GET_NOTICE_TYPE"], '',
      function onSuccess(res) {
        console.log(res)
        that.setData({
          noticeTypes: res.info,
          isFinishRequest: true
        })

      },
      function onErrorBefore(res) {
        console.log(res)
        that.setData({
          isFinishRequest: true
        })
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },
})