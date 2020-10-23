// pages/modifyLoginName/modifyLoginName.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    originalMobile: '',
    popErrorMsg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.setData({
        originalMobile: wx.getStorageSync('mobile'),
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

  modifyLoginName: function (e) {
    this.dealFormIds(e.detail.formId);
    var that = this;
    var newMobile = e.detail.value.newMobile;
    if (newMobile == '') {
      this.setData({
        popErrorMsg: '请输入新的电话号码',
      })
      this.ohShitfadeOut();
      return;
    }
    var param = {
      "userId": wx.getStorageSync('userInfo').id,
      "mobile": newMobile,
    }

    app.webCall(app.serviceCode["MODIFY_MOBILE"], param,
      function onSuccess(res) {
        console.log(res)
        if (res.resultcode == '1') {
          wx.navigateBack({

          })
          wx.setStorageSync('mobile', newMobile);
        } else {
          that.setData({
            popErrorMsg: '电话号码修改失败',
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
  }
})