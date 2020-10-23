// pages/dataChart/companyDate/companyDate.js
var wxCharts = require('../../../utils/wxcharts.js');
var app = getApp();
var lineChart = null;
var startPos = null;
var columnChart = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mType: '',

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getChartData(options.type);
    this.setData({
      mType: options.type,
    });


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

  touchHandler: function (e) {
    lineChart.scrollStart(e);
  },
  moveHandler: function (e) {
    lineChart.scroll(e);
  },
  touchEndHandler: function (e) {
    lineChart.scrollEnd(e);
    lineChart.showToolTip(e, {
      format: function (item, category) {
        return item.name + ':  ' + item.data
      }
    });
  },

  touchHandlerLine: function (e) {
    columnChart.scrollStart(e);
  },
  moveHandlerLine: function (e) {
    columnChart.scroll(e);
  },
  touchEndHandlerLine: function (e) {
    columnChart.scrollEnd(e);
    // columnChart.showToolTip(e, {
    //   format: function (item, category) {
    //     return category + ' ' + item.name + ':' + item.data
    //   }
    // });
  },

  getChartData: function (mType) {
    var that = this;
    var param = {
      "type": mType,
      // "companyId": wx.getStorageSync("userInfo").companyId,
    };
    if (wx.getStorageSync("userInfo").appRole == '1' || wx.getStorageSync("userInfo").appRole == '2' || wx.getStorageSync("userInfo").appRole == '3') {
      param.companyId = wx.getStorageSync("userInfo").companyId;
    }
    app.webCall(app.serviceCode['GET_BAR_CHART'], param,
      function onSuccess(res) {
        console.log(res);
        if (res.detail!=''){
          var details = res.detail;
          var categories = [];
          var datas = { 10: [], 15: [], 20: [] };
          for (var i = 0; i < details.length; i++) {
            categories[i] = details[i].faultDate;
          };
          for (var j = 0; j < details.length; j++) {
            for (var k = 0; k < details[j].data.length; k++) {
              if (details[j].data[k].reportName == 10) {
                datas[10][j] = parseInt(details[j].data[k].account);
                datas[15][j] = parseInt('0');
                datas[20][j] = parseInt('0');
              } else if (details[j].data[k].reportName == 15) {
                datas[10][j] = parseInt('0');
                datas[15][j] = parseInt(details[j].data[k].account);
                datas[20][j] = parseInt('0');
              } else if (details[j].data[k].reportName == 20) {
                datas[10][j] = parseInt('0');
                datas[15][j] = parseInt('0');
                datas[20][j] = parseInt(details[j].data[k].account);
              }

            }

          }

          var windowWidth = 320;
          try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
          } catch (e) {
            console.error('getSystemInfoSync failed!');
          }

          lineChart = new wxCharts({
            canvasId: 'lineCanvas',
            type: 'line',
            categories: categories,
            animation: false,
            series: [{
              name: '一般',
              data: datas[10]
            }, {
              name: '严重',
              data: datas[15]
            }, {
              name: '紧急',
              data: datas[20]
            },
            ],
            xAxis: {
              disableGrid: false
            },
            yAxis: {
              title: '服务数量 (条数)',
              format: function (val) {
                return val.toFixed(2);
              },
              min: 0
            },
            width: windowWidth,
            height: 200,
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
          });

          columnChart = new wxCharts({
            canvasId: 'columnCanvas',
            type: 'column',
            animation: true,
            categories: categories,
            series: [{
              name: '一般',
              data: datas[10],
            }, {
              name: '严重',
              data: datas[15],
            }, {
              name: '紧急',
              data: datas[20],
            }],
            yAxis: {
              format: function (val) {
                return val;
              },
              title: '服务数量 (条数)',
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
            dataLabel: true,
            dataPointShape: true,
            enableScroll: true,
            extra: {
              lineStyle: 'curve'
            }
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
  }
})