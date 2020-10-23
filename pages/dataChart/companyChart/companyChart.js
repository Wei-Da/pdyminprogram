// pages/dataChart/companyChart/companyChart.js
var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
var columnChart = null;


Page({

  /**
   * 页面的初始数据
   */
  data: {
    isMainChartDisplay: true,
    chartList:null,
    nowStartDate:'',
    startDate:'',
    endDate:'',
    nowEndDate:'',
    closeStartDate:'',
    closeEndDate:'',
    mType: '',
    columnData:null,
    categories:null,
    title:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var startTime = this.getYearFormatDate(true);
    var endTime = this.getYearFormatDate(false);
    this.setData({
      startDate: startTime,
      endDate: endTime,
      nowStartDate: this.getNowFormatDate(false),
      closeStartDate: startTime,
      closeEndDate: endTime,
      nowEndDate: this.getNowFormatDate(true),
      mType: options.type,
      title:options.title,
    });
    this.getChartData(options.type);
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

  getChartData:function(mType){
    var that = this;
    var param = {
      "startTime": this.data.nowStartDate,
      "endTime": this.data.nowEndDate,
      "type": mType,
      // "companyId": wx.getStorageSync("userInfo").companyId,
    };
    if (wx.getStorageSync("userInfo").appRole == '1' || wx.getStorageSync("userInfo").appRole == '2' || wx.getStorageSync("userInfo").appRole == '3'){
      param.companyId = wx.getStorageSync("userInfo").companyId;
    }
    app.webCall(app.serviceCode['GET_BAR_CHART'], param,
      function onSuccess(res) {
        console.log(res);
        if (res.detail!=''){
          that.setData({
            chartList: res.detail,
          });
          var chartDatas = new Array(res.detail.length);
          var tempcolumnData = [];
          var tempcategories = [];
          if (mType != '7') {
            for (var i = 0; i < res.detail.length; i++) {
              chartDatas[i] = { 'name': res.detail[i].reportName, 'data': parseInt(res.detail[i].total) };
              tempcolumnData[i] = res.detail[i].total;
              tempcategories[i] = res.detail[i].reportName;
            }
          } else {
            var level = { '10': '一般', '15': '严重', '20': '紧急' };
            for (var i = 0; i < res.detail.length; i++) {
              chartDatas[i] = { 'name': level[res.detail[i].reportName], 'data': parseInt(res.detail[i].total) };
              tempcolumnData[i] = res.detail[i].total;
              tempcategories[i] = level[res.detail[i].reportName];
            }
          }

          that.initChartData(chartDatas, tempcolumnData, tempcategories);
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

  initChartData: function (chartDatas, columnData, categories){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: true,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: chartDatas,
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });

    

    columnChart = new wxCharts({
      canvasId: 'columnCanvas',
      type: 'column',
      animation: true,
      categories: categories,
      series: [{
        name: this.data.title,
        data: columnData,
        // format: function (val, name) {
        //   return val.toFixed(2);
        // }
      }],
      yAxis: {
        format: function (val) {
          return val;
        },
        title: '服务数量',
        min: 0
      },
      xAxis: {
        disableGrid: false,
        type: 'calibration'
      },
      extra: {
        column: {
          width: 15
        }
      },
      width: windowWidth,
      height: 200,
    });

  },

  bindDateChange: function (e) {
      switch (e.currentTarget.dataset.current){
        case 'start':
          this.setData({
            nowStartDate:e.detail.value,
          })
          break;
        case 'end':
          this.setData({
            nowEndDate: e.detail.value,
          })
          break;
      }
  },

  getNowFormatDate: function (isNowMonth) {
    var date = new Date();
    if (!isNowMonth){
        date.setMonth(date.getMonth() - 1);
    }
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  }, 

  getYearFormatDate: function (isPastMonth) {
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = isPastMonth ? date.getFullYear() - 5 + seperator1 + month + seperator1 + strDate: date.getFullYear() + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  searchData:function(){
    this.getChartData(this.data.mType);
  }



})