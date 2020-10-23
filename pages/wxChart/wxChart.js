// pages/wxChart/wxChart.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
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

  turnToChart:function(e){
    this.dealFormIds(e.detail.formId);
    console.log(e);
    switch (e.detail.target.dataset.name){
      case 'companyChart':
        console.log('companyChart')
        wx.navigateTo({
          url: '../../../../dataChart/companyChart/companyChart?type=1&&title=各公司服务',
        })
        break;
      case 'serviceTimeout':
        console.log('serviceTimeout')
        wx.navigateTo({
          url: '../../../../dataChart/companyChart/companyChart?type=2&&title=超时服务',
        })
        break;
      case 'serviceAttitude':
        console.log('serviceAttitude')
        wx.navigateTo({
          url: '../../../../dataChart/companyChart/companyChart?type=3&&title=服务态度',
        })
        break;
      case 'serviceCatalog':
        console.log('serviceCatalog')
        wx.navigateTo({
          url: '../../../../dataChart/companyChart/companyChart?type=4&&title=服务目录',
        })
        break;
      case 'serviceEnginner':
        console.log('serviceEnginner')
        wx.navigateTo({
          url: '../../../../dataChart/companyChart/companyChart?type=5&&title=工程师服务',
        })
        break;
      case 'companyDate':
        console.log('companyDate')
        wx.navigateTo({
          url: '../../../../dataChart/companyDate/companyDate?type=6',
        })
        break;
      case 'faultLevel':
        console.log('faultLevel')
        wx.navigateTo({
          url: '../../../../dataChart/companyChart/companyChart?type=7&&title=故障等级',
        })
        break;
      case 'faultDate':
        console.log('faultDate')//companyLevel
        wx.navigateTo({
          url: '../../../../dataChart/faultDate/faultDate?type=8',
        })
        break;

    }
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
  },

  
})