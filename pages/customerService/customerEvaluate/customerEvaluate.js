// pages/customerService/customerEvaluate/customerEvaluate.js
var app = getApp();
var map = { '有待提高': "1", '一般': "2", '较满意': "4", '非常好': "5" }
Page({

  /**
   * 页面的初始数据
   */
  data: {
    serviceAttitudes: [
      { name: "非常好", value: "5", checked: true },
      { name: "较满意", value: "4" },
      { name: "一般", value: "2" },
      { name: "有待提高", value: "1" },
    ],
    jobQualitys: [
      { name: "非常好", value: "5", checked: true },
      { name: "较满意", value: "4" },
      { name: "一般", value: "2" },
      { name: "有待提高", value: "1" },
    ],
    evaluateContent:'',
    serviceAttitude:'5',
    jobQuality:'5',
    faultId:''

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      faultId: options.faultId,
    })
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

  bindPickerChange: function (e) {
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    switch (name) {
      case "serviceName":
        this.setData({
          serviceNameIndex: eindex,
        })
        break;
    }
  },

  doEvaluate:function(e){
    this.dealFormIds(e.detail.formId);
    var evaluateContent = e.detail.value.evaluateContent;
    // if (evaluateContent == '') {
    //   this.setData({
    //     popErrorMsg: '请输入评价内容',
    //   })
    //   this.ohShitfadeOut();
    //   return;
    // }
    var param = {
      'checkInfo.serviceAttitude': this.data.serviceAttitude,
      'checkInfo.serviceQuality': this.data.jobQuality,
      'checkInfo.serviceContent': evaluateContent,
      'checkInfo.faultId': this.data.faultId,
      'userId': wx.getStorageSync('userInfo').id,
    }
    app.webCall(app.serviceCode["CUSTOMER_SERVICE_EVALUATE"], param,
      function onSuccess(res) {
        console.log(res)
        wx.navigateBack({
          url:'../../customerService/customerServiceClose/customerServiceClose',
        })
      },
      function onErrorBefore(res) {
        console.log(res)
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")


  },

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
  }, 

  attitudeChange:function(e){
    console.log('态度：')
    console.log(map[e.detail.value])
    this.setData({
      serviceAttitude: map[e.detail.value]
    })
  },

  qualityChange: function (e) {
    console.log('质量：' + e.detail.value)
    this.setData({
      jobQuality: map[e.detail.value]
    })
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