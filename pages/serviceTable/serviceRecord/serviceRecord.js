// pages/serviceRecord/serviceRecord.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // serviceList: [
    //   { state: "1", content: "网络连接失败", companyName: "南京碧慧电子技术有限公司", createTime:"2017-10-21 05:03:13" }, 
    //   { state: "2", content: "设备抓取不到失败", companyName: "东方国信", createTime: "2017-11-28 15:32:23"}, 
    //   { state: "3", content: "网络连接失败", companyName: "上海屹通", createTime: "2017-12-28 15:24:37"}],
    serviceList:[],
    scrolltop: null, //滚动位置
    page: 0 , //分页
    lastTime:0,
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
    this.fetchServiceData();
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
      // setTimeout(()=>{wx.stopPullDownRefresh()},3000)
    // console.log("onPullDownRefresh")
    this.fetchServiceData();
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

  scrollHandle: function (e) { //滚动事件
    this.setData({
      scrolltop: e.detail.scrollTop
    })
  },
  goToTop: function () { //回到顶部
    this.setData({
      scrolltop: 0
    })
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
    lastTime:nowTime
    })
    var that = this;
    const perpage = 10;
    this.setData({
      page: this.data.page + 1
    })
    const page = this.data.page;
    // const newlist = [];
    var param = { "page": this.data.page, "rows": perpage };
    console.log("page:" + this.data.page)
    app.webCall(app.serviceCode["TABLE_QUERY_SERVICE"], param,
      function onSuccess(res) {
        console.log(res.info)
        that.setData({
          serviceList: that.data.serviceList.concat(res.info),
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