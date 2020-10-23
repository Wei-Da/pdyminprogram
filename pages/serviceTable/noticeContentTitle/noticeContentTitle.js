// pages/serviceTable/noticeContentTitle/noticeContentTitle.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList: [],
    scrolltop: null, //滚动位置
    page: 0, //分页
    lastTime: 0,
    noticeType:'',
    isFinishRequest: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      noticeType: options.noticeType,
    });
    wx.setNavigationBarTitle({
      title: options.noticeTitle
      });
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
    this.fetchServiceData();
  },

  scrollLoading: function () { //滚动加载
    this.fetchServiceData();
  },

  fetchServiceData: function () {  //获取服务数据
    var nowTime = new Date().getTime();
    if ((nowTime - this.data.lastTime) < 500) {
      console.log("重复提交")
      return;
    }
    this.setData({
      lastTime: nowTime
    })
    var that = this;
    const perpage = 10;
    this.setData({
      page: this.data.page + 1
    })
    const page = this.data.page;
    // const newlist = [];
    var param = { "page": this.data.page, "rows": perpage, "sn.type": this.data.noticeType, "sn.state": 4, "sn.uid": wx.getStorageSync('userInfo').id};
    console.log(wx.getStorageSync('userInfo').id);
    app.webCall(app.serviceCode["GET_NOTICE_CONTENT"], param,
      function onSuccess(res) {
        console.log(res.root)
        that.setData({
          serviceList: that.data.serviceList.concat(res.root),
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

      "POST");

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
    this.setData({
      page: 0,
      serviceList: []
    })
    this.fetchServiceData();
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

/**
 * 避免url参数中含有？影响数据传输
 */
  bindtapTurnto:function(e){
    var msg = this.data.serviceList[e.currentTarget.dataset.index];
    wx.setStorageSync('noticeTitle', msg.noticeTitle);
    wx.setStorageSync('noticeContent', msg.noticeContentForAndroid);
    wx.setStorageSync('endDate', msg.endDate);
    wx.navigateTo({
      url: "../noticeContentDetail/noticeContentDetail",
    })
  }
})