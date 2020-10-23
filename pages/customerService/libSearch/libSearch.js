// pages/keySearch/keySearch.js
var app = getApp();
var path = 'record';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    deleteHidden: true,
    searchTitleHidden: false,
    keyWords: '',
    keyWordList: '',
    serviceList: null,
    libList:null,
    knowledges:null,
    currentItem:0,
    clickItem: 0,
    hotWordList:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      keyWordList: wx.getStorageSync(path),
    });
    console.log(this.data.mRole);
    this.getHotSearch();
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
    }
  },

  clearInputData: function () {
    this.setData({
      deleteHidden: true,
      keyWords: '',
    })
  },

  cancelBack: function () {
    wx.switchTab({
      url: '../../customerPage/customerPage',
    })
  },

  searchResult: function () {
    if (this.data.keyWords == '') {
      return;
    }
    var temp = wx.getStorageSync(path);
    var isAdd = true;
    if (temp == '') {
      wx.setStorageSync(path, [{ 'keyWord': this.data.keyWords, 'account': 1 }]);
    } else {
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].keyWord == this.data.keyWords) {
          temp[i].account++;
          isAdd = false;
        }
      }
      if (isAdd) {
        temp.push({ 'keyWord': this.data.keyWords, 'account': 1 });
      }
      if (!isAdd) {
        this.sortData(temp);
      } else {
        wx.setStorageSync(path, temp)
      }

    }

    var that = this;
    var param = {
      "contents": this.data.keyWords, 
    };
    app.webCall(app.serviceCode['SEARCH_KNOW_LIB'], param,
      function onSuccess(res) {
        if (res.info != '') {
          that.setData({
            knowledges: res.listKnowledge,
            searchTitleHidden: true,
          });
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

  sortData: function (data) {
    var temp;
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < data.length - i - 1; j++) {
        if (data[j].account < data[j + 1].account) {
          temp = data[j + 1];
          data[j + 1] = data[j];
          data[j] = temp;
        }
      }
    }
    wx.setStorageSync(path, data);
    console.log(data);
  },

  clearRecord: function () {
    wx.removeStorageSync(path);
    this.setData({
      keyWordList: '',
    })
  },

  keywordSearch: function (e) {
    console.log(e);
    console.log(e.target.dataset.current);
    var that = this;
    var param = {
      "contents": this.data.keyWordList[e.target.dataset.current].keyWord,
    };
    app.webCall(app.serviceCode['SEARCH_KNOW_LIB'], param,
      function onSuccess(res) {
        console.log('成功');
        console.log(res.knowledges);
        if (res.info != '') {
          that.setData({
            knowledges: res.listKnowledge,
            searchTitleHidden: true,
          })
        }
      },
      function onErrorBefore(res) {
        console.log(res)
      },
      function onComplete(res) {
        console.log('onComplete');
        // console.log(res)
      },

      "POST")
  },

  hotwordSearch: function (e) {
    var that = this;
    var param = {
      "contents": this.data.hotWordList[e.target.dataset.current].keyword,
    };
    app.webCall(app.serviceCode['SEARCH_KNOW_LIB'], param,
      function onSuccess(res) {
        console.log('成功');
        console.log(res.knowledges);
        if (res.info != '') {
          that.setData({
            knowledges: res.listKnowledge,
            searchTitleHidden: true,
          })
        }
      },
      function onErrorBefore(res) {
        console.log(res)
      },
      function onComplete(res) {
        console.log('onComplete');
      },

      "POST")
  },

  clickLib: function (e) {
    console.log(e);
    console.log(e.target.dataset.current);
    if (this.data.clickItem == e.target.dataset.current) {
      this.setData({
        currentItem: e.target.dataset.current,
        clickItem: -1,
      })
    } else {
      this.setData({
        currentItem: e.target.dataset.current,
        clickItem: e.target.dataset.current,
      })

    }
  },

  getHotSearch: function () {
    var that = this;
    app.webCall(app.serviceCode['GET_HOT_SEARCH'], '',
      function onSuccess(res) {
        console.log(res);
        that.setData({
          hotWordList: res.info
        })
      },
      function onErrorBefore(res) {
        console.log(res)
      },
      function onComplete(res) {
        console.log('onComplete');
        // console.log(res)
      },

      "POST")
  },




})