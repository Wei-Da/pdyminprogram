// pages/serviceTable/deviceDetail/deviceDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    companyName:'--',
    deptName:'--',
    machineRoom:'--',
    cabinet:'--',
    deviceType:'--',
    deviceName:'--',
    deviceIP:'--',
    deviceMark:'--',
    deviceModel:'--',
    lineLocation:'--',
    deviceSN:'--',
    devicePN:'--',
    operateSystem:'--',
    useTime:'--',
    inchargeName:'--',
    inchargePhone:'--',
    productNum:'--',
    address:'--',
    note:'--',
    isDeviceInfoDetail:true,
    currentTab:0,
    repairRecords:[],
    page: 0, //分页,
    equipmentId:'',
    isFirst:true,//用于判断页面切换时是否刷新数据
    isScannerPage:true,
    lastTime:0,
    isNewScanner:true,//用于判断重新扫描时刷新设备记录
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.scannerData();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("上拉动作");
    this.setData({
      page: 0,
      repairRecords: []
    })
    this.getEquipmentRecord(this.data.equipmentId, this);
  },

  scrollLoading: function () { //滚动加载
    console.log(this.data.page);
    this.getEquipmentRecord(this.data.equipmentId, this);
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

  scannerData: function () {
    var that = this;
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        that.setData({
          equipmentId: JSON.parse(res.result).eId
        })
        if (res.result != null) {
          that.setData({
            isNewScanner:true,
            isFirst:true
          })
          if (that.data.isDeviceInfoDetail){
            that.getScannerContent(JSON.parse(res.result).eId, that);
          }else{
            that.getEquipmentRecord(JSON.parse(res.result).eId, that);
          }
          
        }
      },
      fail: (res) => {
        console.log("扫描失败")
      }
    })
  },

  getScannerContent: function (id, that) {
    var param = {
      "equipmentInfo.id": id,
      "personId": wx.getStorageSync('userInfo').id
    }
    app.webCall(app.serviceCode["GET_SCANNER_CONTENT"], param,
      function onSuccess(res) {
        console.log(res);
        if(res.info!=''){
          that.setData({
            companyName: res.info[0].companyName == '' ? '--' : res.info[0].companyName,
            deptName: res.info[0].deptName == '' ? '--' : res.info[0].deptName,
            machineRoom: res.info[0].machineRoom == '' ? '--' : res.info[0].machineRoom,
            cabinet: res.info[0].equipmentCabinet == '' ? '--' : res.info[0].equipmentCabinet,
            deviceType: res.info[0].deviceType == '' ? '--' : res.info[0].deviceType,
            deviceName: res.info[0].deviceName == '' ? '--' : res.info[0].deviceName,
            deviceIP: res.info[0].deviceIP == '' ? '--' : res.info[0].deviceIP,
            deviceMark: res.info[0].deviceBrand == '' ? '--' : res.info[0].deviceBrand,
            deviceModel: res.info[0].deviceModel == '' ? '--' : res.info[0].deviceModel,
            lineLocation: res.info[0].position == '' ? '--' : res.info[0].position,
            deviceSN: res.info[0].deviceSN == '' ? '--' : res.info[0].deviceSN,
            devicePN: res.info[0].devicePN == '' ? '--' : res.info[0].devicePN,
            operateSystem: res.info[0].operatingSystem == '' ? '--' : res.info[0].operatingSystem,
            useTime: res.info[0].inTime == '' ? '--' : res.info[0].inTime,
            inchargeName: res.info[0].personName == '' ? '--' : res.info[0].personName,
            inchargePhone: res.info[0].personPhone == '' ? '--' : res.info[0].personPhone,
            productNum: res.info[0].serialNumber == '' ? '--' : res.info[0].serialNumber,
            address: res.info[0].installationLocation == '' ? '--' : res.info[0].installationLocation,
            note: res.info[0].remarks == '' ? '--' : res.info[0].remarks,
          })
        }

      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  chooseCatalog:function(e){
    console.log(e);
    var currentTab = e.currentTarget.dataset.current;
    if (currentTab==0){
      if (this.data.equipmentId != "") {
        if (this.data.isFirst) {
          this.getScannerContent(this.data.equipmentId, this);
          this.setData({
            isFirst: false,
          })
        }
      }
      this.setData({
        isDeviceInfoDetail: true,
        currentTab: currentTab,
      })
    }else{
      if (this.data.equipmentId!=""){
        if(this.data.isFirst){
          this.getEquipmentRecord(this.data.equipmentId,this);
          this.setData({
            isFirst: false,
          })
        }
      }
      this.setData({
        isDeviceInfoDetail: false,
        currentTab: currentTab,
      })
        
    }
    
  },

  getEquipmentRecord: function (id, that) {
    if (this.data.isNewScanner){
      this.setData({
        page: 0,
        isNewScanner:false,
        repairRecords:[]
      }) 
    }
    var nowTime = new Date().getTime();
    if ((nowTime - this.data.lastTime) < 500) {
      console.log("重复提交")
      return;
    }
    this.setData({
      lastTime: nowTime,
      page: this.data.page + 1
    }) 
    var param = {
      "equipmentInfoId": id,
      "personId": wx.getStorageSync('userInfo').id,
      "page": this.data.page, 
      "rows": 10 
    }
    app.webCall(app.serviceCode["GET_SCANNER_EQUIPMENT_RECORD"], param,
      function onSuccess(res) {
        console.log(res);
        if(res.info!=''){
            that.setData({
              repairRecords: that.data.repairRecords.concat(res.info)
            })
        }

      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res)
      },

      "POST")
  },

  scannerPage:function(){
    var that = this;
    wx.scanCode({
      scanType: 'qrCode',
      success: (res) => {
        that.setData({
          equipmentId: JSON.parse(res.result).eId,
          isScannerPage:false
        })
        if (res.result != null) {
          if (that.data.isDeviceInfoDetail) {
            that.getScannerContent(JSON.parse(res.result).eId, that);
          } else {
            that.getEquipmentRecord(JSON.parse(res.result).eId, that);
          }

        }
      },
      fail: (res) => {
        console.log("扫描失败")
      }
    })
  },



})