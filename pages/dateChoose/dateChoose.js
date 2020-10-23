var dateTimePicker = require('../../utils/dateTimePicker.js');
const date = new Date()
const mData = dateTimePicker.dateTimePicker(date.getFullYear() - 10, date.getFullYear() + 5, null)




var helloDate = {
  year: mData['dateTimeArray'][0][mData['dateTime'][0]],
  month: mData['dateTimeArray'][1][mData['dateTime'][1]],
  day: mData['dateTimeArray'][2][mData['dateTime'][2]],
  value: [mData['dateTime'][0], mData['dateTime'][1], mData['dateTime'][2]],
  valueHour: [mData['dateTime'][3], mData['dateTime'][4], mData['dateTime'][5]],
  hour: mData['dateTimeArray'][3][mData['dateTime'][3]],
  minute: mData['dateTimeArray'][4][mData['dateTime'][4]],
  second: mData['dateTimeArray'][5][mData['dateTime'][5]],
  dateTimeArray: mData['dateTimeArray'],
  dateTime: mData['dateTime'],
  monthDay: mData['dateTimeArray'][2]
}


Page({

  /**
   * 页面的初始数据
   */
  data: helloDate,

  changeName: function () {
    this.setData({
      name: 'mine'
    })
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

  

  bindChange: function (e) {
    const val = e.detail.value;
    console.log(val);
    this.setData({
      year: this.data.dateTimeArray[0][val[0]],
      month: this.data.dateTimeArray[1][val[1]],
      day: this.data.dateTimeArray[2][val[2]],
      monthDay: dateTimePicker.getMonthDay(this.data.dateTimeArray[0][val[0]], this.data.dateTimeArray[1][val[1]])
    })
  },

  bindChangeHour: function (e) {
    const val = e.detail.value;
    console.log(e);
    this.setData({
      hour: this.data.dateTimeArray[3][val[0]],
      minute: this.data.dateTimeArray[4][val[1]],
      second: this.data.dateTimeArray[5][val[2]]
    })
  },

  confirm:function(){
    var month = this.data.month;
    var day = this.data.day;
    var hour = this.data.hour;
    var minute = this.data.minute;
    var second = this.data.second;
    var time = this.data.year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    var timeType = wx.getStorageSync("timeType");
    if ("Y" == timeType){
      wx.setStorageSync("createTime", time);
      console.log(timeType);
    }else{
      wx.setStorageSync("endTime", time);
    }
    wx.navigateBack({
      url: '../createService/createService?chooseTime=' + time
    })
  }


})

