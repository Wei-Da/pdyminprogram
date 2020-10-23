// pages/serviceCompany/serviceSign/serviceSign.js
var amapFile = require('../../../libs/amap-wx.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    latitude:'',
    longitude:'',
    markers: [{
      // iconPath: "/images/red_mark.png",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 20,
      height: 27,
    }],

    signExplain:'',
    faultId: '',
    address:'',
    processId:'',
    processPerId:'',
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({ key: '376e754a845d53e4b90f005382a984c8' });
    myAmapFun.getRegeo({
      success: function (data) {
        //成功回调
        console.log('成功回调');
        console.log(data);
        that.getMyLocation(data[0].name);
        that.setData({
          address: data[0].name,
        });
      },
      fail: function (info) {
        //失败回调
        console.log('失败回调');
        console.log(info)
      }
    });
    this.setData({
      faultId: options.faultId,
      processId: options.processId,
      processPerId: options.processPerId,
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

  getMyLocation:function(address){
    var that =this;
    wx.getLocation({
      type:'gcj02',
      success: function(res) {
        console.log(res);
        that.setData({
          latitude:res.latitude,
          longitude:res.longitude,
          markers: [{
            // iconPath: "/images/red_mark.png",
            // width: 20,
            // height: 27,
            latitude: res.latitude,
            longitude: res.longitude,
            callout:{
                content: address,
                bgColor: '#49B2F2',
                textAlign: 'center',
                borderRadius: '6',
                padding: '3',
                color: '#FFFFFF',
                display:'ALWAYS'
              }
            }]
        })
      },
    });

    

  },


  uploadSignData() {
    if (this.data.signExplain == '') {
      this.setData({
        popErrorMsg: '请输入签到说明',
      })
      this.ohShitfadeOut();
      return;
    }

      var param = {
        'signRecord.addr': this.data.address,
        'signRecord.userId': wx.getStorageSync('userInfo').id,
        'signRecord.time': this.getNowFormatDate(),
        'signRecord.explain': this.data.signExplain,
        'signRecord.faultId': this.data.faultId,
        "stamp": '5',
        'state': '2',
        'attachment': '',
        'userId': wx.getStorageSync('userInfo').id,
        'processId': this.data.processId,
        'processPerId': this.data.processPerId,
      }
      app.webCall(app.serviceCode["ADD_SERVICE_RECORD"], param,
        function onSuccess(res) {
          console.log('成功'),
            console.log(res)
          wx.navigateBack({
            url: '../waitServiceDetail/waitServiceDetail',
          })
        },
        function onErrorBefore(res) {
          console.log('失败'),
            console.log(res)
        },
        function onComplete(res) {
          console.log(res)
        },

        "POST")
  },

  getInputValue:function(e){
    console.log(e.detail.value)
    this.setData({
      signExplain:e.detail.value
    })
  },

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
  },


  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    if (hour >= 0 && hour <= 9) {
      hour = "0" + hour;
    }
    if (minutes >= 0 && minutes <= 9) {
      minutes = "0" + minutes;
    }
    if (seconds >= 0 && seconds <= 9) {
      seconds = "0" + seconds;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
      + " " + hour + seperator2 + minutes
      + seperator2 + seconds;
    return currentdate;
  }  

  

})