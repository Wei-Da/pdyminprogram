// pages/dataChart/companyChart/companyChart.js
var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var pieChart = null;
var columnChart = null;

// var chartDatas = [{ 'name': "b2", 'data': 50 }, { 'name': "a2", 'data': 100 }];
// var columnData = ['50','100'];
// var categories = ['b2','a2'];




Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoData:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var chartDatas = wx.getStorageSync('chartDatas');
    var columnData = wx.getStorageSync('columnData');
    var categories = wx.getStorageSync('categories');
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('barTitle'),
    });
    if (chartDatas != "" && columnData != "" && categories!=""){
        this.initChartData(chartDatas, columnData, categories);
        this.setData({
          isNoData:false
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
    // this.requestEnginnerChartData();
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


  initChartData: function (chartDatas, columnData, categories){
    var windowWidth = 320;
    try {
      var res = wx.getSystemInfoSync();
      windowWidth = res.windowWidth;
    } catch (e) {
      console.error('getSystemInfoSync failed!');
    }

    pieChart = new wxCharts({
      animation: false,
      canvasId: 'pieCanvas',
      type: 'pie',
      series: chartDatas,
      width: windowWidth,
      height: 300,
      dataLabel: true,
    });

    this.delayTimeInit(columnData, categories, windowWidth);
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

  delayTimeInit(columnData, categories, windowWidth) {
    var fadeOutTimeout = setTimeout(() => {
      columnChart = new wxCharts({
        canvasId: 'columnCanvas',
        type: 'column',
        animation: false,
        categories: categories,
        series: [{
          name: wx.getStorageSync('chartTitle'),
          data: columnData,
        }],
        yAxis: {
          format: function (val) {
            return val;
          },
          title: wx.getStorageSync('chartTitle'),
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

    }, 1000);
  },



})