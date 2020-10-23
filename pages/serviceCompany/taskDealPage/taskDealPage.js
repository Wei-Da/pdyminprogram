// pages/serviceCompany/taskDealPage/taskDealPage.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    taskDetail:[]
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
    this.getPatrolTask();
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

  getPatrolTask: function () {
    var that = this;
    var param = { "userId": wx.getStorageSync("userInfo").id };
    app.webCall(app.serviceCode["GET_PATROL_TASK"], param,
      function onSuccess(res) {
        console.log(res);
        if (res.info!=""){
            that.setData({
              taskDetail: res.info
            })
        }
      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res);
      },

      "POST")


  },

  
})