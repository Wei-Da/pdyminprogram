//app.js
App({
  onLaunch: function () {
    var that = this;
    // 设备信息
    wx.getSystemInfo({
      success: function (res) {
        that.screenWidth = res.windowWidth;
        that.screenHeight = res.windowHeight;
        that.pixelRatio = res.pixelRatio;
      }
    });
    // console.log("创建服务");
    // 展示本地存储能力
    // var logs = wx.getStorageSync('logs') || []
    // logs.unshift(Date.now())
    // wx.setStorageSync('logs', logs)
    // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     console.log("获取code");
    //     console.log(res.code);
    //     wx.setStorageSync("weixinCode", res.code)
        
    //     var address = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + 'wx1d34fa1ea70c25d7' + '&secret=' + 'acfae52d560532c15c5c32d2451983cd' + '&js_code=' + res.code +'&grant_type=authorization_code';
    //     wx.request({
    //         url: address,
    //         data:{},
    //         method:'GET',
    //         success:function(res){
    //           wx.setStorageSync('openId', res.data.openid);
    //           console.log(res.data.openid);
    //         }
    //     })

    //   }
    // })
    // wx.getUserInfo({
    //   success: function (res) {
        // var userInfo = res.userInfo
        // var nickName = userInfo.nickName
        // var avatarUrl = userInfo.avatarUrl
        // var gender = userInfo.gender //性别 0：未知、1：男、2：女
        // var province = userInfo.province
        // var city = userInfo.city
        // var country = userInfo.country
        
    //   }
    // })
    // 获取用户信息
    // wx.getSetting({
    //   success: res => {
    //     if (res.authSetting['scope.userInfo']) {
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           // 可以将 res 发送给后台解码出 unionId
    //           this.globalData.userInfo = res.userInfo

    //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //           // 所以此处加入 callback 以防止这种情况
    //           if (this.userInfoReadyCallback) {
    //             this.userInfoReadyCallback(res)
    //           }
    //         }
    //       })
    //     }
    //   }
    // })

  },

  getPhoneNumber: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.iv)
    console.log(e.detail.encryptedData)
  },


  onShow:function(){
    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("提交formid地址");
    console.log(this.globalData.gloabalFomIds.length);
    if (this.globalData.gloabalFomIds.length != 0) {
      console.log("是否踢出：");
      console.log(this.globalData.isForceLoginout);
      if (this.globalData.isForceLoginout || this.globalData.isLoginTimeOut){
            this.submitFormid();
      }else{
        this.globalData.gloabalFomIds = [];
      }
    }
  },

  submitFormid: function () {
    var that = this;
    var param = {
      'userId': wx.getStorageSync('userInfo').id,
      'formJson': JSON.stringify(this.globalData.gloabalFomIds)
    }
    this.webCall(this.serviceCode["SUBMIT_FORMIT_ID"], param,
      function onSuccess(res) {
        console.log("formid提交完成");
        that.globalData.gloabalFomIds = [];
      },
      function onErrorBefore(res) {
        console.log(res)
      },

      "POST")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () { 
    
  },
  globalData: {
    userInfo: null,
    num:1,
    gloabalFomIds:[],
    isForceLoginout:false,  //判断是否踢出登录
    isLoginTimeOut:false,
    isFirstNote:true
  },
  serviceCode:{
    LOGIN: 'androidLogin.adr',//登录接口
    TABLE_QUERY_SERVICE: 'findFaultInfoFromSelfByAndroid.adr',//服务台查询服务
    GET_SERVICE_DETAIL:'findHandleProcessingDetailsByAndroid.adr',//获取服务详情
    QUERY_IMAGE_URL: 'findImageUrlByFaultIdByAndroid.adr',//图片地址查询
    IMAGE_URL: 'getImageByImageName.adr?routerCompany=' + wx.getStorageSync('serial')+'&imageName=',//图片加载
    CHECK_IMAGE_URL: 'getImageByImagePath.adr?routerCompany=' + wx.getStorageSync('serial') + '&imageName=',//图片加载
    ADD_FAULT_INFO:'', 
    QUERY_COMPANY_NAME:'getCompany.adr',//服务台服务公司名获取
    QUERY_COMPANY_DEPARTMENT:'getDept.adr',//服务公司获取部门
    QUERY_COMPANY_MEMBER:'getUserInfo.adr',//公司人员查询
    WAIT_CONFIRM:'findFaultInfoEngineerSerComfirmByAndroid.adr',
    GET_WAIT_SERVICE:'findFaultInfoEngineerHandleByAndroid.adr',
    HISTORY_RECORD:'findFaultInfoHistoryByStaffByAndroid.adr',
    COMPANY_CREATE_SERVICE:'addFaultInfoByAndroid.adr',
    SERVICE_DEALING:'findFaultInfoCurrency.adr',//服务进行中
    ENGINEER_HISTORY_RECORD:'findFaultInfoNewsletterByAndroid.adr',//甲方报修记录
    SERVICE_CLOSE_QUERY:'findFaultInfoFromServiceCloseByAndroid.adr',//甲方服务关闭查询
    CUSTOMER_SERVICE_EVALUATE:'addCheckInfoByAEngineerByAndroid.adr',//甲方服务客评
    CREATE_SERVICE:'addFaultInfoByAndroid.adr',//创建服务
    ADD_SERVICE_RECORD:'signByWeixin.adr',
    CLOSE_SERVICE:'updateFaultInfo7ByWorkerByAndroid.adr',
    SERVICE_CONFIRM:'updateFaultInfo5ByWorkerByAndroid.adr',
    SEARCH_KNOW_LIB:'findKnowledgeBycontentsByAndroid.adr',
    GET_BAR_CHART:'getReportInfo.adr',
    GET_SERVICE_CATALOG:'findServiceListByAndroidEstablish.adr',
    GET_SERVICE_CATALOG_DETAIL:'findServiceListByAndroidByPid.adr',
    DEAL_SERVICE:'findFaultInfoFromProcessByAndroid.adr',
    WAIT_SERVICE_CHANGE:'findChangeInfoByType1or2ByAndroid.adr',
    SERVICE_DISTRIBUTE:'updateFaultInfo3ByAndroid.adr',
    GET_REPAIR_NAMES:'findUserByUserIdUserDeptByAndroid.adr',
    SERVICE_CHANGE:'addChangeInfoByAndroid.adr',
    SERVICE_CLOSE:'updateFaultInfo7ByAndroid.adr',
    GET_SERVICE_NAME:'getUserInfo.adr',
    SERVICE_EVALUATE:'addCheckInfoByAndroid.adr',
    WAIT_SERVICE_CHANGE_PASS_OR_REJECT:'updateChangeInfoByAndroid.adr',
    SERVICE_TABLE_ACCOUNT:'findCountFaultInfoByReception.adr',
    SERVICE_ACCOUNT_CUSTOMER:'findCountFaultInfoByAEngineer.adr',
    SERVICE_ACCOUNT:'findCountFaultInfoByBEngineer.adr',
    GET_DEVICE_NAME:'findEqumentInfoByDeptIdByAndroid.adr',
    COMPANY_GET_DEVICE_NAME:'findEqumentInfoByCompanyIdByAndroid.adr',
    GET_SCANNER_CONTENT:'findEquipmentInfoByEidByAndroid.adr',
    GET_PROJECT_AND_FEE_DETAIL:'findProInfoAndCostByFIdByAndroid.adr',
    GET_MEMBER_BY_COMPANY:'findUserByCompanyAndType1ByAndroid.adr',
    GET_NOTICE_CONTENT:'findNoticesByAndriod.adr',
    GET_SCANNER_EQUIPMENT_RECORD: 'findMaintenanceRecordByAndroid.adr',
    SUBMIT_FORMIT_ID:'addUserForm.adr',
    GET_SERVICE_FILE:'findFaultInfoFromServiceFileByAndroid.adr',
    GET_EVENT_FEOM_CHART_DATA:'countTotalSysuserAndroid.adr',
    GET_ENGINNER_CHART_DATA:'countTotalPersonAndroid.adr',
    GET_SERVICE_CATALOG_CHART_DATA:'countTotalServiceListAndroid.adr',
    GET_ASSET_CHART_DATA:'countTotalDeviceAndroid.adr',
    GET_PROJECT_CHART_DATA:'countTotalProjectAndroid.adr',
    GET_DYNAMIC_MENU:'findSysMenuByRidByAndroid.adr',
    GET_PATROL_TASK:'getEquipmentTaskByUser.adr',
    GET_PATROL_TASK_DETAIL:'getEquipByDeloyMentId.adr',
    COMPLETE_TASK:'completeTask.adr',
    GET_PATROL_RECORD:'getScheduleInstanceById.adr',
    GET_PATROL_COMPLETE_RECORD:'getReportImageByReportId.adr',
    SUBMIT_PATROL_RESULT:'saveReportImageWeixin.adr',
    PATROL_IMAGE:'getImageByImagePath.adr',
    ORIGINAL_IMAGE: 'getImageByImageName.adr',
    REMOV_PATROL_IMAGE:'deleteReportImageById.adr',
    GET_NOTICE_TYPE:'findNoticeType.adr',
    UPDATE_SERVICE_TRANSFER:'saveOrUpdateFaultUserByAndroid.adr',
    GET_TRANSFER_PERSON_NAME: 'getUserInfoByAndroid.adr',
    GET_SERVICE_DETAIL_JIA:'findHandleProcessingDetailsByAndroidByJia.adr',//获取详情甲
    GET_SERVICE_DETAIL_YI:'findHandleProcessingDetailsByAndroidByYi.adr',//获取详情乙
    GET_PATROL_REPORT:'getSummarizeByActivitiId.adr',
    SAVE_SUMMARY_RESULT:'saveSummarizeResult.adr',
    GET_HISTORY_EQUIPMENT_REPORT:'getHistoryEquipMentReport.adr',
    MODIFY_PWD:'androidUpdateUserPassword.adr',
    MODIFY_MOBILE: 'androidUpdateMobile.adr',
    SAVE_CHECK_IMAGE:'saveFaultReportImageWeixin.adr',
    QUERY_CHECK_PICTURE:'findFaultReport.adr',
    DELETE_CHECK_PICTURE:'deleteFaultReportImage.adr',
    GET_HOT_SEARCH:'getKnowledgeTopThree.adr',
    GET_PERSON_ORDER_COUNT:'countTotalPersonForA.adr',
    REQUEST_OBSERVE:'findFaultInfoForObserverForA.adr'
  },
  requestCount:{
    'androidLogin.adr':0,
    'findFaultInfoFromSelfByAndroid.adr':0,
    'findHandleProcessingDetailsByAndroid.adr':0,
    'findImageUrlByFaultIdByAndroid.adr':0,
    'getImageByImageName.adr?imageName=':0,
    'getCompany.adr':0,
    'getDept.adr':0,
    'getUserInfo.adr':0,
    'findFaultInfoEngineerSerComfirmByAndroid.adr':0,
    'findFaultInfoEngineerHandleByAndroid.adr':0,
    'findFaultInfoHistoryByStaffByAndroid.adr':0,
    'findFaultInfoCurrency.adr':0,
    'findFaultInfoNewsletterByAndroid.adr':0,
    'findFaultInfoFromServiceCloseByAndroid.adr':0,
    'addCheckInfoByAEngineerByAndroid.adr':0,
    'updateFaultInfo7ByWorkerByAndroid.adr':0,
    'updateFaultInfo5ByWorkerByAndroid.adr':0,
    'findKnowledgeBycontentsByAndroid.adr':0,
    'getReportInfo.adr':0,
    'findServiceListByAndroidByPid.adr':0,
    'findFaultInfoFromProcessByAndroid.adr':0,
    'findChangeInfoByType1or2ByAndroid.adr':0,
    'findUserByUserIdUserDeptByAndroid.adr':0,
    'addChangeInfoByAndroid.adr':0,
    'updateFaultInfo7ByAndroid.adr':0,
    'getUserInfo.adr':0,
    'addCheckInfoByAndroid.adr':0,
    'updateChangeInfoByAndroid.adr':0,
    'findCountFaultInfoByReception.adr':0,
    'findCountFaultInfoByAEngineer.adr':0,
    'findCountFaultInfoByBEngineer.adr':0,
    'findEqumentInfoByDeptIdByAndroid.adr':0,
    'findEqumentInfoByCompanyIdByAndroid.adr':0,
    'findEquipmentInfoByEidByAndroid.adr':0,
    'findProInfoAndCostByFIdByAndroid.adr':0,
    'findUserByCompanyAndType1ByAndroid.adr':0,
    'findNoticesByAndriod.adr':0,
    'findMaintenanceRecord.adr':0,
    'addUserForm.adr':0,
    'findFaultInfoFromServiceFileByAndroid.adr':0,
    'findSysMenuByRidByAndroid.adr':0,
    'getEquipmentTaskByUser.adr':0,
    'getEquipByDeloyMentId.adr':0,
    'completeTask.adr':0,
    'getReportImageByReportId.adr':0,
    'saveReportImage.adr':0,
    'findNoticeType.adr':0,
    'saveOrUpdateFaultUserByAndroid.adr':0,
    'getUserInfoByAndroid.adr':0,
    'findHandleProcessingDetailsByAndroidByJia.adr':0,
    'findHandleProcessingDetailsByAndroidByYi.adr':0,
    'getSummarizeByActivitiId.adr':0,
    'saveSummarizeResult.adr':0,
    'getHistoryEquipMentReport.adr':0,
    'androidUpdateUser.adr':0,
    'androidUpdateUserPassword.adr':0,
    'androidUpdateUserName.adr':0,
    'androidUpdateMobile.adr':0,
    'saveFaultReportImageWeixin.adr':0,
    'findFaultReport.adr':0,
    'deleteFaultReportImage.adr':0,
    'getKnowledgeTopThree.adr':0,
    'countTotalPersonForA.adr':0,
    'findFaultInfoForObserverForA.adr':0
  },

  //  apiHost:"http://192.168.1.118:8080/serviceintegration/",
  // apiHost: "http://192.168.1.92:9090/serviceintegration/",
  // apiHost: "http://192.168.1.117:9090/serviceintegration/",
  // apiHost: "http://192.168.1.114:8899/serviceintegration/",
  // apiHost: "http://192.168.1.191:9090/serviceintegration/",
  apiHost: "https://www.njbhhelp.com/",
  //  apiHost: "https://www.fuwuonline.com/",
    //  apiHost: "http://192.168.1.118:8080/router/",
  // apiHost: "http://120.27.94.6:9002/serviceintegration/",
 

  /**
   * 接口公共访问方法
   * @param {Object} urlPath 访问路径
   * @param {Object} params 访问参数（json格式）
   * @param {Object} requestCode 访问码，返回处理使用
   * @param {Object} onSuccess 成功回调 
   * @param {Object} onErrorBefore 失败回调
   * @param {Object} onComplete 请求完成（不管成功或失败）回调
   * @param {Object} isVerify 是否验证重复提交
   * @param {Object} requestType 请求类型（默认POST）
   * @param {Object} retry 访问失败重新请求次数（默认1次）
   */
  webCall: function (urlPath, params,onSuccess, onErrorBefore, onComplete,requestType) {
    var params = arguments[1] ? arguments[1] : {};
    var onSuccess = arguments[2] ? arguments[2] : function () { };
    var onErrorBefore = arguments[3] ? arguments[3] : function () { };
    var onComplete = arguments[4] ? arguments[4] : function () { };
    // var isVerify = arguments[6] ? arguments[6] : false;
    var requestType = arguments[5] ? arguments[5] : "POST";
    // var retry = arguments[8] ? arguments[8] : 1;
    var that = this;

    //防止重复提交，相同请求间隔时间不能小于500毫秒
    var nowTime = new Date().getTime();

    //添加公共参数
    params["routerCompany"] = wx.getStorageSync("serial");
    params["sessionId"] = wx.getStorageSync("sessionId");
    console.log(this.requestCount[urlPath]);
    if ((nowTime - this.requestCount[urlPath]) < 500) {
      return;
    }
    this.requestCount[urlPath] = nowTime;
    //是否验证重复提交
    // if (isVerify) {
    //   if (this.verifyCount[urlPath]) {
    //     return;
    //   }
    //   this.verifyCount[urlPath] = true; //重复验证开关开启
    // }

    console.log("发起网络请求, 路径:" + (that.apiHost + urlPath) + ", 参数:" + JSON.stringify(params));
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: that.apiHost + urlPath,
      data: params,
      method: requestType, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'content-type': requestType == 'POST' ?
          'application/x-www-form-urlencoded;charset=utf-8' : 'application/json'
          // 'multipart/form-data' : 'application/json'
      }, // 设置请求的 header
      success: function (res) {
        console.log("返回结果：" + JSON.stringify(res.data));
        if (res.data) {
          if (res.data.encode == 200) { //访问成功
            onSuccess(res.data);
          } else if (res.data.encode == 300){//登录踢出标记
            that.globalData.isForceLoginout = true;
            if (that.globalData.isFirstNote){
              that.globalData.isFirstNote = false;
              var pages = getCurrentPages();
              var routes = pages[pages.length - 1].route.split("/");
              var toPage = '';
              if (routes[1] == 'customerService' || routes[1] == 'serviceTable' || routes[1] == 'serviceCompany'){
                toPage = "../../login/login"
              }else{
                toPage = "../login/login"
              }
              wx.reLaunch({
                url: toPage,
              })
            }
            onErrorBefore("请求失败 , 请重试");
          } else if (res.data.encode == 310){//登录超时
            that.globalData.isLoginTimeOut = true;
            if (that.globalData.isFirstNote) {
              that.globalData.isFirstNote = false;
              var pages = getCurrentPages();
              var routes = pages[pages.length - 1].route.split("/");
              var toPage = '';
              if (routes[1] == 'customerService' || routes[1] == 'serviceTable' || routes[1] == 'serviceCompany') {
                toPage = "../../login/login"
              } else {
                toPage = "../login/login"
              }
              wx.reLaunch({
                url: toPage,
              })
            }
            onErrorBefore("请求失败 , 请重试");
          }else {
            that.isLogin = false;
            onErrorBefore(res.data == null ? "请求失败 , 请重试" : res.data);
          }
        } else {
          onErrorBefore("请求失败 , 请重试");
        }
      },
      fail: function (res) {
        onErrorBefore(res.data == null ? "请求失败 , 请重试" : res.data);
        // retry--;
        console.log("网络访问失败：" + JSON.stringify(res));
        // if (retry > 0) return that.webCall(urlPath, params,onSuccess, onErrorBefore, onComplete, requestType, retry);
      },
      complete: function (res) {
        wx.hideLoading();
        
        
        // console.log("onComplete是："+onComplete)
        //请求完成后，2秒后重复验证的开关关闭
        // if (isVerify) {
        //   setTimeout(function () {
        //     that.verifyCount[urlPath] = false;
        //   }, 2000);
        // }
      }
    })
  },

  

})