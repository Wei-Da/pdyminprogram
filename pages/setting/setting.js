// pages/setting/setting.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    modalHidden:true,
    
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
    console.log("个人中心页面显示");
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
    console.log("卸载设置页面");
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

  loginOut:function(e){
    console.log(e);
    this.setData({
      modalHidden:false
    })
  },

  modalChange:function(){
    var that =this;
    wx.setStorageSync('appRole', '');
    wx.reLaunch({
      url: '../login/login',
      success: function (e) {
        modalHidden: true
      }
    })
    // if (this.modalHidden==false){
    //   wx.redirectTo({
    //     url: '../login/login',
    //   })
    // }
    // this.setData({
    //   modalHidden: true
    // })
  },

  modalCancel:function(){
    this.setData({
      modalHidden: true,
    })
  }



})