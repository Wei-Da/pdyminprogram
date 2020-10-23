// pages/personalInfo/personalInfo.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userName: "",
    userPhone: "",
    userRole:""
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
    var userName = wx.getStorageSync("userInfo").userName;
    var userPhone = wx.getStorageSync("userInfo").mobile;
    var userRole = wx.getStorageSync("appRole");
    this.setData({
      userName: userName == '' ? '--' : userName,
      userPhone: userPhone == '' ? '--' : userPhone,
      userRole: userRole == '1' ? '甲方工程师' : userRole == '2' ? '乙方工程师' : userRole == '3' ? '服务台' : userRole == '4' ?'甲方领导':'乙方领导'
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
  
  }
})