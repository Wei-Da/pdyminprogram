// pages/customerPage/customerPage.js
var app = getApp();
var configWarn = {
  title: '警告',
  content: '您的帐号在其它设备登录，请点击退出',
  showCancel: false,
  confirmText: '确定',
  success: function (res) {
    if (res.confirm) {
      wx.setStorageSync('appRole', '');
      wx.reLaunch({
        url: '../login/login',
        success: function (e) {

        }
      })
    } else {
      wx.showModal(configWarn);
    }
  }
};
var configLoginOut = {
  title: '警告',
  content: '您的帐号登录超时，请重新登录',
  showCancel: false,
  confirmText: '确定',
  success: function (res) {
    if (res.confirm) {
      wx.setStorageSync('appRole', '');
      wx.reLaunch({
        url: '../login/login',
        success: function (e) {

        }
      })
    } else {
      wx.showModal(configLoginOut);
    }
  }
};
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: ['https://www.njbhhelp.com/biHuiImage/njbh_image_01.png',
      'https://www.njbhhelp.com/biHuiImage/njbh_image_02.png',
      'https://www.njbhhelp.com/biHuiImage/njbh_image_03.png',],
    indexmenu: [],
    appRole: '',
    waitAllocationAccount:'',
    waitChangeAccount: '',
    waitEvaluateAccount: '',
    todayAddAccount:'',
    dealingAccount:'',
    myserviceAccount:'',
    waitConfirmAccount:'',
    waitServiceAccount:'',
    imgheights: [],
    current: 0,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      appRole: wx.getStorageSync('appRole'),
    });
    this.getDynamicMenu();
    
  },

  customerData: function () {
    this.setData({
      indexmenu: [
        {
          'icon': './../../images/menu5.png',
          'text': '我要报修',
          'pakage': 'customerService',
          'url': 'customerCreateService'
        },
        {
          'icon': './../../images/menu2.png',
          'text': '待确认',
          'pakage': 'customerService',
          'url': 'waitConfirm'
        },
        {
          'icon': './../../images/menu3.png',
          'text': '待服务',
          'pakage': 'customerService',
          'url': 'waitService'
        },
        {
          'icon': './../../images/menu7.png',
          'text': '维修记录',
          'pakage': 'customerService',
          'url': 'repairRecord'
        },
        {
          'icon': './../../images/menu4.png',
          'text': '未分配',
          'pakage': 'customerService',
          'url': 'customerWaitAllocation'
        },
        {
          'icon': './../../images/menu10.png',
          'text': '进行中',
          'pakage': 'customerService',
          'url': 'customerDealingService'
        },
        {
          'icon': './../../images/menu6.png',
          'text': '报修记录',
          'pakage': 'customerService',
          'url': 'faultRecord'
        },
        {
          'icon': './../../images/menu9.png',
          'text': '服务客评',
          'pakage': 'customerService',
          'url': 'customerServiceClose'
        },
        {
          'icon': './../../images/menu13.png',
          'text': '知识帮助',
          'pakage': 'customerService',
          'url': 'libSearch'
        },
      ]
    })
  },

  customerLeaderData: function () {
    this.setData({
      indexmenu: [
        {
          'icon': './../../images/menu5.png',
          'text': '我要报修',
          'pakage': 'customerService',
          'url': 'customerCreateService'
        },
        {
          'icon': './../../images/menu2.png',
          'text': '待确认',
          'pakage': 'customerService',
          'url': 'waitConfirm'
        },
        {
          'icon': './../../images/menu3.png',
          'text': '待服务',
          'pakage': 'customerService',
          'url': 'waitService'
        },
        {
          'icon': './../../images/menu1.png',
          'text': '维修记录',
          'pakage': 'customerService',
          'url': 'repairRecord'
        },
        {
          'icon': './../../images/menu4.png',
          'text': '未分配',
          'pakage': 'customerService',
          'url': 'customerWaitAllocation'
        },
        {
          'icon': './../../images/menu10.png',
          'text': '进行中',
          'pakage': 'customerService',
          'url': 'customerDealingService'
        },
        {
          'icon': './../../images/menu6.png',
          'text': '报修记录',
          'pakage': 'customerService',
          'url': 'faultRecord'
        },
        {
          'icon': './../../images/menu9.png',
          'text': '服务客评',
          'pakage': 'customerService',
          'url': 'customerServiceClose'
        },
        {
          'icon': './../../images/menu7.png',
          'text': '公司记录',
          'pakage': 'customerService',
          'url': 'customerCompanyRecord'
        },
        {
          'icon': './../../images/menu13.png',
          'text': '知识帮助',
          'pakage': 'customerService',
          'url': 'libSearch'
        },

      ]
    })
  },


  serviceData: function () {
    this.setData({
      indexmenu: [
        {
          'icon': './../../images/menu5.png',
          'text': '我要报修',
          'pakage': 'serviceCompany',
          'url': 'mineCreateService'
        },
        {
          'icon': './../../images/menu2.png',
          'text': '待确认',
          'pakage': 'serviceCompany',
          'url': 'waitConfirm'
        },
        {
          'icon': './../../images/menu3.png',
          'text': '待服务',
          'pakage': 'serviceCompany',
          'url': 'waitService'
        },
        {
          'icon': './../../images/menu6.png',
          'text': '我的服务',
          'pakage': 'serviceCompany',
          'url': 'myService'
        },
        {
          'icon': './../../images/menu4.png',
          'text': '历史记录',
          'pakage': 'serviceCompany',
          'url': 'serviceHistoryRecord'
        },
        // {
        //   'icon': './../../images/menu14.png',
        //   'text': '设备详情',
        //   'pakage': 'serviceTable',
        //   'url': 'deviceDetail'
        // },
        {
          'icon': './../../images/menu13.png',
          'text': '知识帮助',
          'pakage': 'customerService',
          'url': 'libSearch'
        },
        
      ]
    })
  },

  companyLeader: function () {
    this.setData({
      indexmenu: [
        {
          'icon': './../../images/menu5.png',
          'text': '我要报修',
          'pakage': 'serviceCompany',
          'url': 'mineCreateService'
        },
        {
          'icon': './../../images/menu2.png',
          'text': '待确认',
          'pakage': 'serviceCompany',
          'url': 'waitConfirm'
        },
        {
          'icon': './../../images/menu3.png',
          'text': '待服务',
          'pakage': 'serviceCompany',
          'url': 'waitService'
        },
        {
          'icon': './../../images/menu6.png',
          'text': '我的服务',
          'pakage': 'serviceCompany',
          'url': 'myService'
        },
        {
          'icon': './../../images/menu4.png',
          'text': '历史记录',
          'pakage': 'serviceCompany',
          'url': 'serviceHistoryRecord'
        },
        {
          'icon': './../../images/menu7.png',
          'text': '公司记录',
          'pakage': 'serviceCompany',
          'url': 'companyRecord'
        },
        {
          'icon': './../../images/menu13.png',
          'text': '知识帮助',
          'pakage': 'customerService',
          'url': 'libSearch'
        },
        
      ]
    })
  },

  serviceTableData: function () {
    this.setData({
      indexmenu: [
        {
          'icon': './../../images/menu11.png',
          'text': '服务创建',
          'pakage': 'serviceTable',
          'url': 'createService'
        },
        {
          'icon': './../../images/menu8.png',
          'text': '服务处理',
          'pakage': 'serviceTable',
          'url': 'serviceTableDeal'
        },
        {
          'icon': './../../images/menu12.png',
          'text': '服务查询',
          'pakage': 'serviceTable',
          'url': 'serviceQuery'
        },
        {
          'icon': './../../images/menu16.png',
          'text': '服务档案',
          'pakage': 'serviceTable',
          'url': 'serviceFile'
        },
        {
          'icon': './../../images/menu13.png',
          'text': '知识帮助',
          'pakage': 'customerService',
          'url': 'libSearch'
        },
        {
          'icon': './../../images/menu7.png',
          'text': '服务分配',
          'pakage': 'serviceTable',
          'url': 'serviceSelfHelp'
        },
        {
          'icon': './../../images/menu10.png',
          'text': '变更审核',
          'pakage': 'serviceTable',
          'url': 'serviceChange'
        },
      
        {
          'icon': './../../images/menu9.png',
          'text': '服务评价',
          'pakage': 'serviceTable',
          'url': 'serviceTableClose'
        }
      ]
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
    this.getServiceAccount();
    if (app.globalData.gloabalFomIds.length != 0) {
      this.submitFormid();
    }

    
    
    // var role = wx.getStorageSync('appRole');
    // if (role == '1') {
    //   this.customerData();
    // } else if (role == '2') {
    //   this.serviceData();
    // } else if (role == '3'){
    //   this.serviceTableData();
    // } else if (role == '4'){
    //   this.customerLeaderData();
    // } else if (role == '5') {
    //   this.companyLeader();
    // }
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

  getServiceAccount:function(){
    var that = this;
    var param = {};
    if (that.data.appRole == '3'){
      app.webCall(app.serviceCode["SERVICE_TABLE_ACCOUNT"], param,
        function onSuccess(res) {
          that.setData({
            waitAllocationAccount: res.info[0].receptionWaitDistribution,
            waitChangeAccount: res.info[0].receptionWaitChange,
            waitEvaluateAccount: res.info[0].receptionWaitCheck,
          })
        },
        function onErrorBefore(res) {
          console.log(res)
          that.setData({
            waitAllocationAccount:'--',
            waitChangeAccount: '--',
            waitEvaluateAccount: '--',
          });
          // if (app.globalData.isForceLoginout) {
          //   wx.showModal(configWarn);
          //   return;
          // }
          // if (app.globalData.isLoginTimeOut) {
          //   wx.showModal(configLoginOut);
          //   return;
          // }

        },
        function onComplete(res) {
          console.log(res)
        },

        "POST")
    }
    if (this.data.appRole == '1' || this.data.appRole == '4'){
      param["faultInfo.sysuserid"] = wx.getStorageSync('userInfo').id;
      param["faultInfo.companyid"] = wx.getStorageSync('userInfo').companyId;
      app.webCall(app.serviceCode["SERVICE_ACCOUNT_CUSTOMER"], param,
        function onSuccess(res) {
          that.setData({
            waitAllocationAccount: res.info[0].waitDistribution,
            todayAddAccount: res.info[0].todayAdd,
            dealingAccount: res.info[0].doing,
            myserviceAccount: res.info[0].repair,
          })

        },
        function onErrorBefore(res) {
          console.log(res)
          that.setData({
            waitAllocationAccount: '--',
            todayAddAccount: '--',
            dealingAccount: '--',
            myserviceAccount: '--',
          });
          // if (app.globalData.isForceLoginout) {
          //   wx.showModal(configWarn);
          //   return;
          // }
          // if (app.globalData.isLoginTimeOut) {
          //   wx.showModal(configLoginOut);
          //   return;
          // }

        },
        function onComplete(res) {
          console.log(res)
        },

        "POST")
    }
    if (this.data.appRole == '2' || this.data.appRole == '5') {
      param['faultInfo.sysuserid'] = wx.getStorageSync('userInfo').id;
      param['faultInfo.personid'] = wx.getStorageSync('userInfo').id;
      app.webCall(app.serviceCode["SERVICE_ACCOUNT"], param,
        function onSuccess(res) {
          that.setData({
            waitConfirmAccount: res.info[0].waitHandle,
            waitServiceAccount: res.info[0].waitService,
            myserviceAccount: res.info[0].myRepair,
            todayAddAccount: res.info[0].todayAdd,
          })

        },
        function onErrorBefore(res) {
          console.log(res)
          // if (app.globalData.isForceLoginout) {
          //   wx.showModal(configWarn);
          //   return;
          // }
          // if (app.globalData.isLoginTimeOut) {
          //   wx.showModal(configLoginOut);
          //   return;
          // }

        },
        function onComplete(res) {
          console.log(res);
          
        },

        "POST")
      
    }
   
  },

  applySubmit: function (e) {//url="../customerService/customerTodayAdd/customerTodayAdd?isMyService=2"
    this.dealFormIds(e.detail.formId);
    // wx.navigateTo({
    //   url: '../customerService/customerTodayAdd/customerTodayAdd?isMyService=2',
    // })
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
    console.log('formIds', formIds);
  },

  submitFormid: function () {
    var param = {
      'userId': wx.getStorageSync('userInfo').id,
      'formJson': JSON.stringify(app.globalData.gloabalFomIds)
    }
    app.webCall(app.serviceCode["SUBMIT_FORMIT_ID"], param,
      function onSuccess(res) {
        console.log("formid提交完成");
        app.globalData.gloabalFomIds = [];
      },
      function onErrorBefore(res) {
        console.log(res)
      },

      "POST")


  },

  imageLoad: function (e) {//获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    console.log(imgwidth, imgheight)
    //计算的高度值  
    var viewHeight = 750 / ratio;
    var imgheight = viewHeight;
    var imgheights = this.data.imgheights;
    //把每一张图片的对应的高度记录到数组里  
    imgheights[e.target.dataset.id] = imgheight;
    this.setData({
      imgheights: imgheights
    })
  },
  bindchange: function (e) {
    // console.log(e.detail.current)
    this.setData({ current: e.detail.current })
  },

  getDynamicMenu: function () {
    var that = this;
    var param = { "rid": wx.getStorageSync('userInfo').appRole};
    app.webCall(app.serviceCode["GET_DYNAMIC_MENU"], param,
      function onSuccess(res) {
        var temMenu = [];
        for(var i=0;i<res.info.length;i++){
          temMenu[i] = { icon: res.info[i].icon, text: res.info[i].name, pakage: res.info[i].pkg, url: res.info[i].path};
        }
        that.setData({
          indexmenu: temMenu
        })
      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res);
      },

      "POST")
    

  },

})