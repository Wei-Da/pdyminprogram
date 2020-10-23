// pages/login/login.js
var app = getApp()
var configWarn = {
  title: '警告',
  content: '您的帐号在其它设备登录，请重新登录',
  showCancel: false,
  confirmText: '确定',
  success: function (res) {
    if (res.confirm) {
      wx.setStorageSync('appRole', '');
      
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
    warnning: true,
    tipContent: '',
    check: false,
    pwdCheck:false,
    account: '',
    pwd: '',
    serial:'',
    popErrorMsg: '',
    LoginTypeValue:'1',
    LoginType: [ 
      { name: "0", value: "快速报修登录"},
      { name: "1", value: "正常登录", checked: true  },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setStorageSync("userInfo", "");
    var name = wx.getStorageSync("name");
    var serialNum = wx.getStorageSync("serialNum");
    var pwd = wx.getStorageSync("pwd");
    if (name != "") {
      this.setData({
        check: true,
        account: name,
        serial: serialNum
      })
    };
    if (pwd!=""){
      this.setData({
        pwdCheck: true,
        pwd: pwd
      })
    }
    if(wx.getStorageSync('loginType')=='1'){
      this.setData({
        LoginTypeValue:'1',
        LoginType: [
          { name: "0", value: "快速报修登录" },
          { name: "1", value: "正常登录", checked: true },
        ],
      })
    }

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log("获取code");
        console.log(res.code);
        wx.setStorageSync("weixinCode", res.code);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(this.data.account);
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    app.globalData.isFirstNote = true;
    if (app.globalData.isForceLoginout){
      app.globalData.isForceLoginout = false;
      wx.showModal(configWarn);
    }
    if (app.globalData.isLoginTimeOut) {
      app.globalData.isLoginTimeOut = false;
      wx.showModal(configLoginOut);
    }
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


  doLogin: function (e) {
    console.log("点击登录");
    var name = e.detail.value.name;
    var pwd = e.detail.value.pwd;
    var serial = e.detail.value.serial;
    var wxCode = wx.getStorageSync("weixinCode");
    this.dealFormIds(e.detail.formId);
    // this.sendNote(e.detail.formId);
    // console.log('formid为：'+formid);
    // wx.setStorageSync('formid', formid);
    
    var that = this;
    if (name == "") {
      this.setData({
        popErrorMsg: '用户名不能为空',
      })
      this.ohShitfadeOut();
      return;
    }
    if (pwd == "") {
      this.setData({
        popErrorMsg: '请输入密码',
      })
      this.ohShitfadeOut();
      return;
    }
    if (serial == "") {
      this.setData({
        popErrorMsg: '请输入公司编号',
      })
      this.ohShitfadeOut();
      return;
    }

    this.setData({
      account: name,
      pwd: pwd
    })

    var check = this.data.check;
    if (check == true) {
      wx.setStorageSync("name", this.data.account);
      wx.setStorageSync("serialNum", serial);
    }

    if (this.data.pwdCheck){
      wx.setStorageSync("pwd", this.data.pwd);
    }

    wx.setStorageSync("serial", serial);
    app.serviceCode["IMAGE_URL"] = 'getImageByImageName.adr?routerCompany=' + serial + '&imageName=';
    app.serviceCode["CHECK_IMAGE_URL"] = 'getImageByImagePath.adr?routerCompany=' + serial + '&imageName=';
    
    

    var param = {
      username: this.data.account,
      password: this.data.pwd,
      weixinCode: wxCode
    }

    app.webCall(app.serviceCode["LOGIN"], param,
      function onSuccess(res) {
        console.log(res.roleId)
        if (res.resultcode=='2'){
          wx.setStorageSync("userInfo", { "companyId": res.companyId, "appRole": res.roleId, "id": res.id, "mobile": res.mobile, "userName": res.userName, "deptId": res.deptId, "isRepair": res.isRepair, "loginName": res.loginName });
          wx.setStorageSync('mobile', res.mobile);
          wx.setStorageSync('sessionId', res.sessionId);
              if (res.mouleId == '7') {
                wx.setStorageSync('appRole', '2');
                if (that.data.LoginTypeValue == '0') {
                  wx.redirectTo({
                    url: '../serviceCompany/mineCreateService/mineCreateService',
                  })
                } else {
                  wx.switchTab({
                    url: '../customerPage/customerPage',
                  })
                }
              } else if (res.mouleId == '8') {
                wx.setStorageSync('appRole', '3');
                if (that.data.LoginTypeValue == '0') {
                  //wx.setStorageSync('LoginType', '0');
                  wx.redirectTo({
                    url: '../serviceTable/createService/createService',
                  })
                } else {
                  wx.switchTab({
                    url: '../customerPage/customerPage',
                  })
                }
              } else if (res.mouleId == '1' || res.mouleId == '3') {
                wx.setStorageSync('appRole', '1');
                if (that.data.LoginTypeValue == '0') {
                  wx.redirectTo({
                    url: '../customerService/customerCreateService/customerCreateService',
                  })
                } else {
                  wx.switchTab({
                    url: '../customerPage/customerPage',
                  })
                }
              } else if (res.mouleId == '2') {//甲方领导
                wx.setStorageSync('appRole', '4');
                if (that.data.LoginTypeValue == '0') {
                  wx.redirectTo({
                    url: '../customerService/customerCreateService/customerCreateService',
                  })
                } else {
                  wx.switchTab({
                    url: '../customerPage/customerPage',
                  })
                }
              } else if (res.mouleId == '6') {//乙方领导
                wx.setStorageSync('appRole', '5');
                if (that.data.LoginTypeValue == '0') {
                  wx.redirectTo({
                    url: '../serviceCompany/mineCreateService/mineCreateService',
                  })
                } else {
                  wx.switchTab({
                    url: '../customerPage/customerPage',
                  })
                }
              } else if (res.mouleId == '13'){
                wx.setStorageSync('appRole', '3');
                if (that.data.LoginTypeValue == '0') {
                  //wx.setStorageSync('LoginType', '0');
                  wx.redirectTo({
                    url: '../serviceTable/createService/createService',
                  }) 
                } else {
                  wx.switchTab({
                    url: '../customerPage/customerPage',
                  })
                }
              }

        } else if (res.resultcode == '1'){
          that.setData({
            popErrorMsg: res.detail,
          })
          that.ohShitfadeOut();
          wx.login({
            success: res => {
              // 发送 res.code 到后台换取 openId, sessionKey, unionId
              console.log("获取code");
              console.log(res.code);
              wx.setStorageSync("weixinCode", res.code);
            }
          });
        }
        

      },
      function onErrorBefore(res) {
        console.log(res)
        that.setData({
          popErrorMsg: '用户名错误或者密码错误',
        })
        that.ohShitfadeOut();
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log("获取code");
            console.log(res.code);
            wx.setStorageSync("weixinCode", res.code);
          }
        });
        
      },
      function onComplete(res) {
        console.log("完成：onComplete");
        console.log(res);
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            console.log("获取code");
            console.log(res.code);
            wx.setStorageSync("weixinCode", res.code);
          }
        });
      },

      "POST")

    
    

  },

  checkboxChange: function (e) {
    console.log(e);
    if (e.detail.value.length == 1) {
      this.setData({
        check: true,
      })
    } else {
      this.setData({
        check: false,
      })
    }
    // console.log(e.target.dataset.checks);
  },

  checkpwdChange:function(e){
    console.log(e);
    if (e.detail.value.length == 1) {
      this.setData({
        pwdCheck: true,
      })
    } else {
      this.setData({
        pwdCheck: false,
      })
    }
  },

  typeChange: function (e) {
    wx.setStorageSync('loginType', e.detail.value);
    this.setData({
      LoginTypeValue: e.detail.value
    })
  },



  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
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
    console.log(formIds);
    // console.log(JSON.stringify(formIds));
  },

  sendNote: function (formid) {
    console.log("发送消息");
    var address = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=8_ppl6WXhy3-pLo81inyZ21JJm3ziiBlDPZxd7PB-j9JokbEbj6iETdHo-k6D0yP7uzED8q5JvGeQ-eV6E_2kvPMkkd4o66LauXWLlnBB5WY0RoVDF4Kn60gy84ehm6MpuS2xTTDjyg9Dd1cGnYKJiAGADPO';
    var mdata = {
      "data": {
        "keyword1": {
          "value": "ip:192.168.1.64,通道名Camera 05,录像天数不满1实际录像天数0",
          "color": "#173177"
        },
        "keyword2": {
          "value": "2018年04月11日 17：15",
          "color": "#173177"
        }

      },
      "touser": wx.getStorageSync('openId'),
      "template_id": "uwq9JKqqO7893QO_hRaB_ewLWuC1FKBIjLVHL5v5c8M",
      "form_id": formid,
      "page":"pages/splashPage/splashPage",
      // "emphasis_keyword": "keyword1.DATA"

    };

    console.log(mdata);

    wx.request({
      url: address,
      data: mdata,
      method: 'POST',
      success: function (res) {
        console.log('成功');
        console.log(res);

      },
      fail: function (res) {
        console.log('失败');
        console.log(res);
      }
    })

  },

  





})