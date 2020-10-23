// pages/modifyPwd/modifyPwd.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    popErrorMsg: '', 
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

  modifyPwd: function (e) {
    this.dealFormIds(e.detail.formId);
    var that = this;
    var originalPwd = e.detail.value.originalPwd;
    var newPwd = e.detail.value.newPwd;
    var confirmPwd = e.detail.value.confirmPwd;
    if(originalPwd==''){
      this.setData({
        popErrorMsg: '请输入原密码',
      })
      this.ohShitfadeOut();
      return;
    }
    if (newPwd == '') {
      this.setData({
        popErrorMsg: '请输入新密码',
      })
      this.ohShitfadeOut();
      return;
    }
    if (confirmPwd == '') {
      this.setData({
        popErrorMsg: '请输入确认密码',
      })
      this.ohShitfadeOut();
      return;
    }
    if (newPwd!=confirmPwd){
      this.setData({
        popErrorMsg: '两次密码不一致，请重新确认',
      })
      this.ohShitfadeOut();
      return;
    }
    var param = {
      "userId": wx.getStorageSync('userInfo').id,    
      "password": confirmPwd, 
      "oldPassword": originalPwd
    }

    app.webCall(app.serviceCode["MODIFY_PWD"], param,
      function onSuccess(res) {
        console.log(res)
        if(res.resultcode=='1'){
          wx.navigateBack({
            
          })
        }else{
          that.setData({
            popErrorMsg: '密码修改失败',
          })
          that.ohShitfadeOut();
        }

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