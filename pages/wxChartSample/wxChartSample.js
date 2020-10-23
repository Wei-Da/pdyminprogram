// pages/wxChartSample/wxChartSample.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    countTypeIndex:0,
    countTypes:[],
    reportTypeIndex:0,
    reportTypes:['请选择'],
    reportTypeDatas:[],
    countTypeData:[],
    countTypeColumn:[],
    countTypeCategories:[],
    popErrorMsg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.initPicker();
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

  bindPickerChange:function(e){
    const eindex = e.detail.value;
    const name = e.currentTarget.dataset.pickername;
    var role = wx.getStorageSync("appRole");
    console.log("选择picker");
    console.log(e);
    switch (role){
      case '1':
        switch (name) {
          case 'countType':
            this.setData({
              countTypeIndex: eindex,
              reportTypeIndex: 0,
              reportTypes: this.data.reportTypeDatas[eindex],
            });
            switch (eindex) {
              case '1':
                this.requestEnginnerChartData();
                break
              case '2':
                this.requestChartData();
                break
            }
            break;
          case 'reportType':
            this.setData({
              reportTypeIndex: eindex
            });
            if (parseInt(eindex) > 0) {
              wx.setStorageSync("chartDatas", this.data.countTypeData[parseInt(eindex) - 1])
              wx.setStorageSync("columnData", this.data.countTypeColumn[parseInt(eindex) - 1])
            }
            switch (parseInt(eindex)) {
              case 1:
                wx.setStorageSync("chartTitle", '工单数');
                wx.setStorageSync("barTitle", '工单数报表');
                break;
              case 2:
                wx.setStorageSync("chartTitle", '及时率');
                wx.setStorageSync("barTitle", '及时率报表');
                break;
              case 3:
                wx.setStorageSync("chartTitle", '好评率');
                wx.setStorageSync("barTitle", '好评率报表');
                break;
              case 4:
                wx.setStorageSync("chartTitle", '平均费用');
                wx.setStorageSync("barTitle", '平均费用报表');
                break;
              case 5:
                wx.setStorageSync("chartTitle", '总费用');
                wx.setStorageSync("barTitle", '总费用报表');
                break;
              case 6:
                wx.setStorageSync("chartTitle", '服务目录');
                wx.setStorageSync("barTitle", '服务目录报表');
                break;
              case 7:
                wx.setStorageSync("chartTitle", '资产数');
                wx.setStorageSync("barTitle", '资产数报表');
                break;
            }
            break;
        }
        break;
      case '2':
        switch (name) {
          case 'countType':
            this.setData({
              countTypeIndex: eindex,
              reportTypeIndex: 0,
              reportTypes: this.data.reportTypeDatas[eindex],
            });
            switch (eindex) {
              case '1':
                this.requestEnginnerChartData();
                break
            }
            break;
          case 'reportType':
            this.setData({
              reportTypeIndex: eindex
            });
            if (parseInt(eindex) > 0) {
              wx.setStorageSync("chartDatas", this.data.countTypeData[parseInt(eindex) - 1])
              wx.setStorageSync("columnData", this.data.countTypeColumn[parseInt(eindex) - 1])
            }
            switch (parseInt(eindex)) {
              case 1:
                wx.setStorageSync("chartTitle", '工单数');
                wx.setStorageSync("barTitle", '工单数报表');
                break;
              case 2:
                wx.setStorageSync("chartTitle", '及时率');
                wx.setStorageSync("barTitle", '及时率报表');
                break;
              case 3:
                wx.setStorageSync("chartTitle", '好评率');
                wx.setStorageSync("barTitle", '好评率报表');
                break;
              case 4:
                wx.setStorageSync("chartTitle", '平均费用');
                wx.setStorageSync("barTitle", '平均费用报表');
                break;
              case 5:
                wx.setStorageSync("chartTitle", '总费用');
                wx.setStorageSync("barTitle", '总费用报表');
                break;
              case 6:
                wx.setStorageSync("chartTitle", '服务目录');
                wx.setStorageSync("barTitle", '服务目录报表');
                break;
              case 7:
                wx.setStorageSync("chartTitle", '资产数');
                wx.setStorageSync("barTitle", '资产数报表');
                break;
            }
            break;
        }
        break;
      case '3':
        break;
      case '4':
      case '5':
        console.log("选择内部picker");
        console.log(e);
        switch (name) {
          case 'countType':
            this.setData({
              countTypeIndex: eindex,
              reportTypeIndex: 0,
              reportTypes: this.data.reportTypeDatas[eindex],
            });
            console.log("选择统计类型");
            console.log(this.data.countTypeIndex);
            switch (eindex) {
              case '1':
                this.requestEnginnerChartData();
                break
              case '2':
                // this.requestEnginnerChartData();
                this.requestCatalogChartData();
                break
              case '3':
                // this.requestEnginnerChartData();
                this.requestAssetChartData();
                break
              case '4':
                // this.requestEnginnerChartData();
                this.requestProjectChartData();
                break
              case '5':
                this.requestChartData();
                break
            }
            break;
          case 'reportType':
            this.setData({
              reportTypeIndex: eindex
            });
            console.log("选择报表类型");
            console.log(this.data.reportTypeIndex);
            console.log(this.data.countTypeData[parseInt(eindex) - 1]);
            if (parseInt(eindex) > 0 && this.data.countTypeData[parseInt(eindex) - 1].length!=0) {
              console.log("数据不为空");
              wx.setStorageSync("chartDatas", this.data.countTypeData[parseInt(eindex) - 1])
              wx.setStorageSync("columnData", this.data.countTypeColumn[parseInt(eindex) - 1])
            }
            if (this.data.countTypeIndex == 1 || this.data.countTypeIndex == 5){
              switch (parseInt(eindex)) {
                case 1:
                  wx.setStorageSync("chartTitle", '工单数');
                  wx.setStorageSync("barTitle", '工单数报表');
                  break;
                case 2:
                  wx.setStorageSync("chartTitle", '及时率');
                  wx.setStorageSync("barTitle", '及时率报表');
                  break;
                case 3:
                  wx.setStorageSync("chartTitle", '好评率');
                  wx.setStorageSync("barTitle", '好评率报表');
                  break;
                case 4:
                  wx.setStorageSync("chartTitle", '平均费用');
                  wx.setStorageSync("barTitle", '平均费用报表');
                  break;
                case 5:
                  wx.setStorageSync("chartTitle", '总费用');
                  wx.setStorageSync("barTitle", '总费用报表');
                  break;
                case 6:
                  wx.setStorageSync("chartTitle", '服务目录');
                  wx.setStorageSync("barTitle", '服务目录报表');
                  break;
                case 7:
                  wx.setStorageSync("chartTitle", '资产数');
                  wx.setStorageSync("barTitle", '资产数报表');
                  break;
              }
                    
            } else if (this.data.countTypeIndex == 2){
              switch (parseInt(eindex)) {
                case 1:
                  wx.setStorageSync("chartTitle", '工单数');
                  wx.setStorageSync("barTitle", '工单数报表');
                  break;
                case 2:
                  wx.setStorageSync("chartTitle", '及时率');
                  wx.setStorageSync("barTitle", '及时率报表');
                  break;
                case 3:
                  wx.setStorageSync("chartTitle", '好评率');
                  wx.setStorageSync("barTitle", '好评率报表');
                  break;
                case 4:
                  wx.setStorageSync("chartTitle", '平均费用');
                  wx.setStorageSync("barTitle", '平均费用报表');
                  break;
                case 5:
                  wx.setStorageSync("chartTitle", '总费用');
                  wx.setStorageSync("barTitle", '总费用报表');
                  break;
                case 6:
                  wx.setStorageSync("chartTitle", '资产数');
                  wx.setStorageSync("barTitle", '资产数报表');
                  break;
              }
            } else if (this.data.countTypeIndex == 3) {
              switch (parseInt(eindex)) {
                case 1:
                  wx.setStorageSync("chartTitle", '工单数');
                  wx.setStorageSync("barTitle", '工单数报表');
                  break;
                case 2:
                  wx.setStorageSync("chartTitle", '及时率');
                  wx.setStorageSync("barTitle", '及时率报表');
                  break;
                case 3:
                  wx.setStorageSync("chartTitle", '好评率');
                  wx.setStorageSync("barTitle", '好评率报表');
                  break;
                case 4:
                  wx.setStorageSync("chartTitle", '平均费用');
                  wx.setStorageSync("barTitle", '平均费用报表');
                  break;
                case 5:
                  wx.setStorageSync("chartTitle", '总费用');
                  wx.setStorageSync("barTitle", '总费用报表');
                  break;
              }
            } else if (this.data.countTypeIndex == 4) {
              switch (parseInt(eindex)) {
                case 1:
                  wx.setStorageSync("chartTitle", '工单数');
                  wx.setStorageSync("barTitle", '工单数报表');
                  break;
                case 2:
                  wx.setStorageSync("chartTitle", '及时率');
                  wx.setStorageSync("barTitle", '及时率报表');
                  break;
                case 3:
                  wx.setStorageSync("chartTitle", '好评率');
                  wx.setStorageSync("barTitle", '好评率报表');
                  break;
                case 4:
                  wx.setStorageSync("chartTitle", '总费用');
                  wx.setStorageSync("barTitle", '总费用报表');
                  break;
              }
            }
        }
            break;
    }
    
  },

/**
 * 事件来源
 */
  requestChartData: function () {
    var that = this;
    var param = {
      // "faultReportDTO.sysUserId": wx.getStorageSync("userInfo").id
    };
    // if (role == "2" || role == "5") {
    //   param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    // } else if (role == "1" || role == "4") {
    //   param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    // }
    var role = wx.getStorageSync("appRole");

    if (role == "2" || role == "5") {
      param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    } else if (role == "1" || role == "4") {
      param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    }

    app.webCall(app.serviceCode["GET_EVENT_FEOM_CHART_DATA"], param,
      function onSuccess(res) {
        console.log(res)
        var accountDatas = new Array(res.info.length);
        var inTimeDatas = new Array(res.info.length);
        var goodEvalDatas = new Array(res.info.length);
        var averageDatas = new Array(res.info.length);
        var totalDatas = new Array(res.info.length);
        var catalogDatas = new Array(res.info.length);
        var assetDatas = new Array(res.info.length);
        var accountColumn = [];
        var inTimeColumn = [];
        var goodEvalColumn = [];
        var averageColumn = [];
        var totalColumn = [];
        var catalogColumn = [];
        var assetColumn = [];
        var tempcategories = [];
        for (var i = 0; i < res.info.length; i++) {
          accountDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].gdscount) };
          inTimeDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].jslff) }; 
          goodEvalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].hplff) }; 
          averageDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].pjfycount) };
          totalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zfycount) };
          catalogDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].fwmlscount) };
          assetDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zcscount) };
          accountColumn[i] = res.info[i].gdscount;
          inTimeColumn[i] = parseInt(res.info[i].jslff);
          goodEvalColumn[i] = parseInt(res.info[i].hplff);
          averageColumn[i] = res.info[i].pjfycount;
          totalColumn[i] = res.info[i].zfycount;
          catalogColumn[i] = res.info[i].fwmlscount;
          assetColumn[i] = res.info[i].zcscount;
          tempcategories[i] = res.info[i].uname
        }

        that.setData({
          countTypeData: [accountDatas, inTimeDatas, goodEvalDatas, averageDatas, totalDatas, catalogDatas, assetDatas],
          countTypeColumn: [accountColumn, inTimeColumn, goodEvalColumn, averageColumn, totalColumn, catalogColumn, assetColumn],
          // countTypeCategories: tempcategories
        });
        wx.setStorageSync("categories", tempcategories)
        console.log(that.data.countTypeData);
        console.log(that.data.countTypeColumn);
        console.log(that.data.countTypeCategories);

      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

/**
 * 工程师报表数据
 */
  requestEnginnerChartData: function () {
    var that = this;
    var role = wx.getStorageSync("appRole");
    var param = {
      // "faultReportDTO.sysUserId": wx.getStorageSync("userInfo").id
    }

    // if (role=="2"){
    //   param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    // } else if (role == "1"){
    //   param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    // }

    if (role == "2" || role == "5") {
      param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    } else if (role == "1" || role == "4") {
      param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    }

    app.webCall(app.serviceCode["GET_ENGINNER_CHART_DATA"], param,
      function onSuccess(res) { 
        console.log(res)
        var accountDatas = new Array(res.info.length);
        var inTimeDatas = new Array(res.info.length);
        var goodEvalDatas = new Array(res.info.length);
        var averageDatas = new Array(res.info.length);
        var totalDatas = new Array(res.info.length);
        var catalogDatas = new Array(res.info.length);
        var assetDatas = new Array(res.info.length);
        var accountColumn = [];
        var inTimeColumn = [];
        var goodEvalColumn = []; 
        var averageColumn = [];
        var totalColumn = [];
        var catalogColumn = [];
        var assetColumn = [];
        var tempcategories = [];
        for (var i = 0; i < res.info.length; i++) {
          accountDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].gdscount) };
          inTimeDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].jslff) };
          goodEvalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].hplff) };
          averageDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].pjfycount) };
          totalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zfycount) };
          catalogDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].fwmlscount) };
          assetDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zcscount) };
          accountColumn[i] = res.info[i].gdscount;
          inTimeColumn[i] = parseInt(res.info[i].jslff);
          goodEvalColumn[i] = parseInt(res.info[i].hplff);
          averageColumn[i] = res.info[i].pjfycount;
          totalColumn[i] = res.info[i].zfycount;
          catalogColumn[i] = res.info[i].fwmlscount;
          assetColumn[i] = res.info[i].zcscount;
          tempcategories[i] = res.info[i].uname
        }

        that.setData({
          countTypeData: [accountDatas, inTimeDatas, goodEvalDatas, averageDatas, totalDatas, catalogDatas, assetDatas],
          countTypeColumn: [accountColumn, inTimeColumn, goodEvalColumn, averageColumn, totalColumn, catalogColumn, assetColumn],
          // countTypeCategories: tempcategories
        });
        wx.setStorageSync("categories", tempcategories)
        console.log(tempcategories);
        console.log(that.data.countTypeColumn);
        console.log(that.data.countTypeData[1]);
      },
      function onErrorBefore(res) {
        console.log(res)
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

/**
 * 服务目录数据
 */
  requestCatalogChartData: function () {
    var that = this;
    var role = wx.getStorageSync("appRole");
    var param = {
      // "faultReportDTO.sysUserId": wx.getStorageSync("userInfo").id
    }

    // if (role == "2" || role == "5") {
    //   param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    // } else if (role == "1" || role == "4") {
    //   param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    // }

    if (role == "2" || role == "5") {
      param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    } else if (role == "1" || role == "4") {
      param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    }

    app.webCall(app.serviceCode["GET_SERVICE_CATALOG_CHART_DATA"], param,
      function onSuccess(res) {
        console.log(res)
        var accountDatas = new Array(res.info.length);
        var inTimeDatas = new Array(res.info.length);
        var goodEvalDatas = new Array(res.info.length);
        var averageDatas = new Array(res.info.length);
        var totalDatas = new Array(res.info.length);
        var assetDatas = new Array(res.info.length);
        var accountColumn = [];
        var inTimeColumn = [];
        var goodEvalColumn = [];
        var averageColumn = [];
        var totalColumn = [];
        var assetColumn = [];
        var tempcategories = [];
        for (var i = 0; i < res.info.length; i++) {
          accountDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].gdscount) };
          inTimeDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].jslff) };
          goodEvalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].hplff) };
          averageDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].pjfycount) };
          totalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zfycount) };
          assetDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zcscount) };
          accountColumn[i] = res.info[i].gdscount;
          inTimeColumn[i] = parseInt(res.info[i].jslff);
          goodEvalColumn[i] = parseInt(res.info[i].hplff);
          averageColumn[i] = res.info[i].pjfycount;
          totalColumn[i] = res.info[i].zfycount;
          assetColumn[i] = res.info[i].zcscount;
          tempcategories[i] = res.info[i].uname;
          console.log(res.info[i].uname);
        }

        that.setData({
          countTypeData: [accountDatas, inTimeDatas, goodEvalDatas, averageDatas, totalDatas, assetDatas],
          countTypeColumn: [accountColumn, inTimeColumn, goodEvalColumn, averageColumn, totalColumn, assetColumn],
          // countTypeCategories: tempcategories
        });
        console.log(tempcategories);
        wx.setStorageSync("categories", tempcategories)
        // console.log(that.data.countTypeData);
        // console.log(that.data.countTypeColumn);
        // console.log(that.data.countTypeCategories);
        console.log(wx.getStorageSync("categories"));

      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

/**
 * 资产数据
 */
  requestAssetChartData: function () {
    console.log("资产请求");
    var that = this;
    var role = wx.getStorageSync("appRole");
    var param = {
      // "faultReportDTO.sysUserId": wx.getStorageSync("userInfo").id
    }
    // if (role == "2" || role == "5") {
    //   param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    // } else if (role == "1" || role == "4") {
    //   param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    // }

    if (role == "2" || role == "5") {
      param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    } else if (role == "1" || role == "4") {
      param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    }

    app.webCall(app.serviceCode["GET_ASSET_CHART_DATA"], param,
      function onSuccess(res) {
        console.log(res)
        var accountDatas = new Array(res.info.length);
        var inTimeDatas = new Array(res.info.length);
        var goodEvalDatas = new Array(res.info.length);
        var averageDatas = new Array(res.info.length);
        var totalDatas = new Array(res.info.length);
        var accountColumn = [];
        var inTimeColumn = [];
        var goodEvalColumn = [];
        var averageColumn = [];
        var totalColumn = [];
        var tempcategories = [];
        for (var i = 0; i < res.info.length; i++) {
          accountDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].gdscount) };
          inTimeDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].jslff) };
          goodEvalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].hplff) };
          averageDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].pjfycount) };
          totalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zfycount) };
          accountColumn[i] = res.info[i].gdscount;
          inTimeColumn[i] = parseInt(res.info[i].jslff);
          goodEvalColumn[i] = parseInt(res.info[i].hplff);
          averageColumn[i] = res.info[i].pjfycount;
          totalColumn[i] = res.info[i].zfycount;
          tempcategories[i] = res.info[i].uname
        }

        that.setData({
          countTypeData: [accountDatas, inTimeDatas, goodEvalDatas, averageDatas, totalDatas],
          countTypeColumn: [accountColumn, inTimeColumn, goodEvalColumn, averageColumn, totalColumn],
          // countTypeCategories: tempcategories
        });
        wx.setStorageSync("categories", tempcategories)
        // console.log(that.data.countTypeData);
        // console.log(that.data.countTypeColumn);
        // console.log(that.data.countTypeCategories);

      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

/**
 * 项目数据
 */
  requestProjectChartData: function () {
    var that = this;
    var role = wx.getStorageSync("appRole");
    var param = {
      // "faultReportDTO.sysUserId": wx.getStorageSync("userInfo").id
    }
    // if (role == "2" || role == "5") {
    //   param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    // } else if (role == "1" || role == "4") {
    //   param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    // }

    if (role == "2" || role == "5") {
      param["faultReportDTO.sysUserId"] = wx.getStorageSync("userInfo").id;
    } else if (role == "1" || role == "4") {
      param["faultReportDTO.personId"] = wx.getStorageSync("userInfo").id;
    }

    app.webCall(app.serviceCode["GET_PROJECT_CHART_DATA"], param,
      function onSuccess(res) {
        console.log(res)
        var accountDatas = new Array(res.info.length);
        var inTimeDatas = new Array(res.info.length);
        var goodEvalDatas = new Array(res.info.length);
        var averageDatas = new Array(res.info.length);
        var totalDatas = new Array(res.info.length);
        var catalogDatas = new Array(res.info.length);
        var assetDatas = new Array(res.info.length);
        var accountColumn = [];
        var inTimeColumn = [];
        var goodEvalColumn = [];
        var averageColumn = [];
        var totalColumn = [];
        var catalogColumn = [];
        var assetColumn = [];
        var tempcategories = [];
        for (var i = 0; i < res.info.length; i++) {
          accountDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].gdscount) };
          inTimeDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].jslff) };
          goodEvalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].hplff) };
          totalDatas[i] = { 'name': res.info[i].uname, 'data': parseInt(res.info[i].zfycount) };
          accountColumn[i] = res.info[i].gdscount;
          inTimeColumn[i] = parseInt(res.info[i].jslff);
          goodEvalColumn[i] = parseInt(res.info[i].hplff);
          totalColumn[i] = res.info[i].zfycount;
          tempcategories[i] = res.info[i].uname
        }

        that.setData({
          countTypeData: [accountDatas, inTimeDatas, goodEvalDatas,totalDatas],
          countTypeColumn: [accountColumn, inTimeColumn, goodEvalColumn,totalColumn],
          // countTypeCategories: tempcategories
        });
        wx.setStorageSync("categories", tempcategories)
        console.log(that.data.countTypeData);
        console.log(that.data.countTypeColumn);
        console.log(that.data.countTypeCategories);

      },
      function onErrorBefore(res) {
        console.log(res)

      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  initPicker:function(){
    console.log("角色");
    console.log(wx.getStorageSync("appRole"));
    var role = wx.getStorageSync("appRole");
    if (role == '1') {
      // this.customerData();
      console.log("甲方工程师");
      this.setData({
        countTypes: ["请选择", "工程师", "服务来源"],
        reportTypeDatas: [["请选择"],["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "服务目录", "资产数"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "服务目录", "资产数"]],
      })
    } else if (wx.getStorageSync("appRole") == '2') {
      // this.serviceData();
      console.log("乙方工程师");
      this.setData({
        countTypes: ["请选择", "工程师"],
        reportTypeDatas: [["请选择"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "服务目录", "资产数"]],
      })
    } else if (role == '3') {
      // this.serviceTableData();
      console.log("服务台");
      this.setData({
        countTypes: ["请选择"],
        reportTypeDatas: ["请选择"]
      })
    } else if (role == '4') {
      console.log("甲方领导");
      this.setData({
        countTypes: ["请选择", "工程师", "服务目录", "资产", "项目", "服务来源"],
        reportTypeDatas: [["请选择"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "服务目录", "资产数"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "资产数"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用"], ["请选择", "工单数", "及时率", "好评率", "总费用"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "服务目录", "资产数"]],
      })
      // this.customerLeaderData();
    } else if (role == '5') {
      console.log("乙方领导页面");
      this.setData({
        countTypes: ["请选择", "工程师", "服务目录", "资产", "项目", "服务来源"],
        reportTypeDatas: [["请选择"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "服务目录", "资产数"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "资产数"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用"], ["请选择", "工单数", "及时率", "好评率", "总费用"], ["请选择", "工单数", "及时率", "好评率", "平均费用", "总费用", "服务目录", "资产数"]],
      })
      // this.companyLeader();
    }
  },


  turntoChartPage:function(){
    if (this.data.countTypeIndex == 0) {
      this.setData({
        popErrorMsg: '请选择统计类型',
      })
      this.ohShitfadeOut();
      return;
    };
    if (this.data.reportTypeIndex == 0) {
      this.setData({
        popErrorMsg: '请选择报表类型',
      })
      this.ohShitfadeOut();
      return;
    }
    wx.navigateTo({
      url: '../dataChart/dataChart/dataChart',
    })
  },

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
  },
})