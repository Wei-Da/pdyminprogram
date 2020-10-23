// pages/searchCompanyName/searchCompanyName.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyWords: '',
    keyWordList: '',
    deviceList: [],
    deleteHidden: true,
    searchDeviceList: [],
    searchHiddlen: false,
    recordHistory: [],
    hasRecord: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var temDeviceList = [];
    var passData = options.deviceNames.split('_');
    for (var i = 1; i < passData.length; i++) {
      temDeviceList[i - 1] = passData[i];
    }
    this.setData({
      deviceList: temDeviceList
    })
    // console.log(this.data.searchDeviceList);
    if (wx.getStorageSync('recordCompanyName') != "") {
      this.setData({
        recordHistory: wx.getStorageSync('recordCompanyName'),
        hasRecord: true
      })
    }
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

  onInputListener: function (e) {
    console.log(e);
    if (e.detail.value != '') {
      this.setData({
        deleteHidden: false,
        keyWords: e.detail.value,
      })
    } else {
      this.setData({
        deleteHidden: true,
      })
    }
  },

  clearInputData: function () {
    this.setData({
      deleteHidden: true,
      keyWords: '',
      searchHiddlen: false
    })
  },



  sortData: function (keyword) {
    var recordHistory = this.data.recordHistory;
    var arrangRecord = [];
    var newKeyword = true;
    if (recordHistory.length == 3) {
      for (var i = 0; i < recordHistory.length; i++) {
        if (keyword == recordHistory[i]) {
          if (i == 0) {
            arrangRecord = recordHistory;
          } else if (i == 1) {
            arrangRecord[0] = recordHistory[i];
            arrangRecord[1] = recordHistory[0];
            arrangRecord[2] = recordHistory[2];
          } else if (i == 2) {
            arrangRecord[0] = recordHistory[i];
            arrangRecord[1] = recordHistory[0];
            arrangRecord[2] = recordHistory[1];
          }
          newKeyword = false
          break
        }
      }
      if (newKeyword) {
        arrangRecord[0] = keyword;
        for (var i = 0; i < recordHistory.length - 1; i++) {
          arrangRecord[i + 1] = recordHistory[i];
        }
      }
    } else {
      arrangRecord[0] = keyword;
      for (var i = 0; i < recordHistory.length; i++) {
        arrangRecord[i + 1] = recordHistory[i];
      }
    }
    wx.setStorageSync('recordCompanyName', arrangRecord);
    this.setData({
      recordHistory: arrangRecord,
      hasRecord: true
    })

  },

  clearRecord: function () {
    wx.removeStorageSync(this.data.path);
    this.setData({
      keyWordList: '',
    })
  },

  keywordSearch: function () {
    if (this.data.keyWords == '') {
      return;
    }
    var deviceList = this.data.deviceList;
    var searchDevice = [];
    this.sortData(this.data.keyWords);
    for (var i = 0; i < deviceList.length; i++) {
      if (deviceList[i].indexOf(this.data.keyWords) >= 0) {
        var tempDevice = { name: deviceList[i], index: i };
        searchDevice.push(tempDevice);
      }
    }
    if (searchDevice.length != 0) {
      this.sortData(this.data.keyWords);
      this.setData({
        searchDeviceList: searchDevice,
        searchHiddlen: true
      })
    }
  },

  chooseKeyword: function (e) {
    console.log(e);
    console.log(e.currentTarget.dataset.pickername);
    this.setData({
      keyWords: e.currentTarget.dataset.pickername,
      deleteHidden: false,
    });
    this.keywordSearch();
  },

  chooseDevice: function (e) {
    wx.setStorageSync("companyNameIndex", e.currentTarget.dataset.index)
    wx.navigateBack({

    })
  },

  chooseSerachDevice: function (e) {
    wx.setStorageSync("companyNameIndex", this.data.searchDeviceList[e.currentTarget.dataset.index].index)
    wx.navigateBack({

    })
  }
})