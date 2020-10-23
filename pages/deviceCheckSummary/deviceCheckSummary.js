// pages/deviceCheckSummary/deviceCheckSummary.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    faultId:'',
    serviceDescribe:'',
    instanceName:'',
    totalCount:'',
    normalCount:'',
    abNormalCount:'',
    abDetectionCount:'',
    time:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      faultId: options.faultId,
    })
    this.requestPatrolTaskReport();
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
    var serviceDescribe = wx.getStorageSync('serviceDescribe');
    this.setData({
      serviceDescribe: serviceDescribe == '' ? '请输入描述' : serviceDescribe.length < 10 ? serviceDescribe : serviceDescribe.substring(0, 10) + '...',
    })
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
    wx.setStorageSync('serviceDescribe', '');
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

  requestPatrolTaskReport: function () {
    var that = this;
    var param = {
      'faultId': this.data.faultId,
    }
    app.webCall(app.serviceCode["GET_PATROL_REPORT"], param,
      function onSuccess(res) {
        that.setData({
          instanceName: res.instanceName,
          totalCount: res.totalCount,
          normalCount: res.normalCount,
          abNormalCount: res.abNormalCount,
          abDetectionCount: res.abDetectionCount,
          time: res.time,
        })
      },
      function onErrorBefore(res) {
        console.log('失败');
        console.log(res);
          
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  savePatrolTaskReport: function () {
    var serviceDescribe = wx.getStorageSync('serviceDescribe');
    if(serviceDescribe==""){
      this.setData({
        popErrorMsg:'请输入总结描述'
      })
      this.tipfadeOut();
      return;
    }
    var that = this;
    var param = {
      'faultId': this.data.faultId,
      'abNormalCount': this.data.abNormalCount,
      'detectionCount':'',
      'instanceName': this.data.instanceName,
      'normalCount': this.data.normalCount,
      'totalCount': this.data.totalCount,
      'abDetectionCount': this.data.abDetectionCount,
      'summarizeText': serviceDescribe
    }
    app.webCall(app.serviceCode["SAVE_SUMMARY_RESULT"], param,
      function onSuccess(res) {
        console.log(res);
        if (res.resultcode=='2'){
          wx.navigateBack({
            
          })
        }
      },
      function onErrorBefore(res) {
        console.log('失败');
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  transferDescribe:function(){
    wx.navigateTo({
      url: '../serviceDescribe/serviceDescribe',
    })
  },

  tipfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });
    }, 3000);
  },
})