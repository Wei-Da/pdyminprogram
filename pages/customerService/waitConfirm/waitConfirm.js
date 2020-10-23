// pages/serviceCompany/waitConfirm/waitConfirm.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceList: [],
    scrolltop: null, //滚动位置
    page: 0, //分页
    lastTime: 0,
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
    this.setData({
      page: 0,
      serviceList: [],
      isFinishRequest: false
    })
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
      lastTime: nowTime
    })
    var that = this;
    const perpage = 10;
    this.setData({
      page: this.data.page + 1
    })
    const page = this.data.page;
    // const newlist = [];
    var param = { "page": this.data.page, "rows": perpage, 'faultInfo.personid': wx.getStorageSync('userInfo').id };
    console.log(wx.getStorageSync('userInfo').id)
    app.webCall(app.serviceCode["WAIT_CONFIRM"], param,
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

  keyWordsSearch: function () {
    wx.navigateTo({
      url: "../../keySearch/keySearch?path=customerWaitConfirm&&param=faultInfo.personid&&mUrl=WAIT_CONFIRM&&type=''&&role=1",
    })
  },

  applySubmit: function (e) {
    console.log(e);
    this.dealFormIds(e.detail.formId);
  },

  dealFormIds: function (formId) {
    let formIds = app.globalData.gloabalFomIds;//获取全局数据中的推送码gloabalFomIds数组
    if (!formIds) formIds = [];
    let data = {
      formId: formId,
      expire: parseInt(new Date().getTime()) + 604800000 //计算7天后的过期时间时间戳
    }
    formIds.push(data);//将data添加到数组的末尾
    app.globalData.gloabalFomIds = formIds; //保存推送码并赋值给全局变量
  }
})