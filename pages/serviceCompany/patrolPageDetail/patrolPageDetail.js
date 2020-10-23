// pages/serviceCompany/patrolPageDetail/patrolPageDetail.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadPicture:'./../../../images/add_image.png',
    originalimgs:[],
    uploadPatrolimgs:[],
    faultId:'',
    deviceId:'',
    state:'',
    patrolStandard:'',
    serviceDescribe: '请输入描述',
    patrolResult: [
      { name: "设备正常", value: "1", checked: true },
      { name: "设备异常", value: "2" },
    ],
    patrolResultValue:'1',
    instanceId:'',
    activiInstanceId:'',
    companyId:'',
    patrolImageInfo:[],
    isNewImage:false,
    imageWidth: '',
    popErrorMsg: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    var that = this;
    if (getApp().screenWidth != '') {
      this.setData({
        imageWidth: getApp().screenWidth / 6 - 10,
        faultId: options.faultId,
        state: options.state,
        instanceId: options.instanceId,
        deviceId: options.deviceId,
        activiInstanceId: options.activiInstanceId,
        companyId: options.companyId
      })
    } else {
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            imageWidth: res.windowWidth / 6 - 10,
            faultId: options.faultId,
            state: options.state,
            instanceId: options.instanceId,
            deviceId: options.deviceId,
            activiInstanceId: options.activiInstanceId,
            companyId: options.companyId
          })
        }
      });
    }
    if (this.data.state == '0') { 
      this.getPatrolStandard();
    } else {
      this.getPatrolRecord();
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
    var serviceDescribe = wx.getStorageSync('serviceDescribe');
    this.setData({
      serviceDescribe: serviceDescribe == '' ? '请输入描述' : serviceDescribe.length < 10 ? serviceDescribe : serviceDescribe.substring(0, 10) + '...',
    })

  
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
    wx.setStorageSync("serviceDescribe", "");
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

  choosePatrolImage: function () {
    var that = this;
    wx.chooseImage({
      count: 4, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var tempFilePaths = res.tempFilePaths;
        var canAddPaths = [];
        console.log(4 - that.data.uploadPatrolimgs.length);
        var addPicSize = 4 - that.data.uploadPatrolimgs.length;
        if (addPicSize>0){
          if (tempFilePaths.length < addPicSize+1){
            that.setData({
              uploadPatrolimgs: that.data.uploadPatrolimgs.concat(tempFilePaths),
              isNewImage:true
            })
          }else{
            for (var i = 0; i < addPicSize;i++){
              canAddPaths[i] = tempFilePaths[i]
            }
            that.setData({
              uploadPatrolimgs: that.data.uploadPatrolimgs.concat(canAddPaths),
              isNewImage: true
            })
          }

        }
      }
    })
  },

  previewImage: function (e) {
    console.log(e)
    // var index = e.currentTarget.dataset.index;
    var pictures = this.data.originalimgs;
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: pictures, // 需要预览的图片http链接列表
    })
  },

  previewPatrolImage: function (e) {
    console.log(e)
    // var index = e.currentTarget.dataset.index;
    var pictures = this.data.uploadPatrolimgs;
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: pictures, // 需要预览的图片http链接列表
    })
  },

  transferDescribe: function () {
    wx.navigateTo({
      url: '../../serviceDescribe/serviceDescribe',
    })
  },


  getPatrolStandard: function () {
    var that = this;
    var param = { "faultId": that.data.faultId, "deviceId": that.data.deviceId  };
    app.webCall(app.serviceCode["GET_PATROL_RECORD"], param,
      function onSuccess(res) {
        console.log(res);
        var temOriginal=[];
        for (var i = 0; i < res.listEquImage.length; i++) {
          temOriginal[i] = app.apiHost + app.serviceCode["ORIGINAL_IMAGE"] + '?imageName=' + res.listEquImage[i].url;
        }
        that.setData({
          patrolStandard: res.inspStandard,
          originalimgs: temOriginal,
        })
        console.log(that.data.patrolStandard);
      },
      function onErrorBefore(res) {
        console.log(res);
      },
      function onComplete(res) {
        console.log(res);
      },

      "POST")


  },

  getPatrolRecord: function () {
    var that = this;
    var tempFilePath = [];
    var temOriginal = [];
    var imageInfo = [];
    var param = { "reportId": that.data.companyId, "deviceId": that.data.deviceId };
    app.webCall(app.serviceCode["GET_PATROL_COMPLETE_RECORD"], param,
      function onSuccess(res) {
        console.log(res);
        for (var i = 0; i < res.listImage.length;i++){
          tempFilePath[i] = app.apiHost + app.serviceCode["PATROL_IMAGE"] + '?imageName=' + res.listImage[i].imagePath;
          imageInfo[i] = { path: tempFilePath[i], imageId: res.listImage[i].imageId};
        }
        for (var i = 0; i < res.listEquImage.length; i++) {
          temOriginal[i] = app.apiHost + app.serviceCode["ORIGINAL_IMAGE"] + '?imageName=' + res.listEquImage[i].url;
        }
        wx.setStorageSync('serviceDescribe', res.listReport[0].reportRemark);
        that.setData({
          patrolStandard: res.inspStandard,
          serviceDescribe: res.listReport[0].reportRemark,
          uploadPatrolimgs: tempFilePath, 
          originalimgs: temOriginal,        
          patrolResult: res.listReport[0].status == '1' ? [
            { name: "设备正常", value: "1", checked: true },
            { name: "设备异常", value: "2" },
          ] : [
              { name: "设备正常", value: "1" },
              { name: "设备异常", value: "2", checked: true },
            ],
          patrolImageInfo: imageInfo
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

  uploadImageAndData: function (i, length) {
    wx.showLoading({
      title: '加载中...',
    })
    // console.log("图片路径");
    // console.log(this.data.uploadPatrolimgs[i]);
    // console.log(this.data.uploadPatrolimgs[i].lastIndexOf('.'));
    // console.log(this.data.uploadPatrolimgs[i].substring(this.data.uploadPatrolimgs[i].lastIndexOf('.')+1));
    wx.uploadFile({
      url: app.apiHost + app.serviceCode["SUBMIT_PATROL_RESULT"],
      filePath: this.data.uploadPatrolimgs.length == 0 ? '' : this.data.uploadPatrolimgs[i],
      name: 'attachment',
      formData: {
        'status': this.data.patrolResultValue,
        'faultId': this.data.faultId,
        'deviceId': this.data.deviceId,
        'userId': wx.getStorageSync("userInfo").id,
        'reportId': '',
        // 'instanceId': this.data.instanceId,
        'textAreaVal': this.data.serviceDescribe == '请输入描述' ? '' : this.data.serviceDescribe,
        'imageNum':i, 
        // 'taskId': this.data.taskId
        'imgFormat': this.data.uploadPatrolimgs.length == 0 ? '' :this.data.uploadPatrolimgs[i].substring(this.data.uploadPatrolimgs[i].lastIndexOf('.') + 1),
        'routerCompany': wx.getStorageSync("serial"),
        'sessionId': wx.getStorageSync("sessionId"),
      },
      success: (res) => {
        console.log('成功');
        console.log(res);
      },
      fail: (res) => {
        console.log('失败');
        console.log(res);
      },

      complete: () => {
        if(length>0){
          i++;
          if (i == length) {
            wx.hideLoading();
            wx.navigateBack({

            })
          } else {
            this.uploadImageAndData(i, length);
          }
        }else{
          wx.hideLoading();
          wx.navigateBack({

          })
        }
        
      },
    })
  },

  resultChange:function(e){
    this.setData({
      patrolResultValue: e.detail.value
    });
  },

  applySubmit:function(e){
    console.log(e);
    if (this.data.uploadPatrolimgs.length==0){
      this.setData({
        popErrorMsg: '请加入巡检图片',
      })
      this.ohShitfadeOut();
      return;
    }
    this.uploadImageAndData(0, this.data.uploadPatrolimgs.length) ;
  },

  deleteImage:function(e){
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var images = this.data.uploadPatrolimgs;
    this.removeImage(images[index], index)
  },

  removeImage: function (imagePath,index) {
    var that = this;
    var param = { "imageId": '' };
    for (var i = 0; i < that.data.patrolImageInfo.length;i++){
      if (that.data.patrolImageInfo[i].path == imagePath){
        param = { "imageId": that.data.patrolImageInfo[i].imageId }
      }
    } 
    if (param.imageId!=''){
      app.webCall(app.serviceCode["REMOV_PATROL_IMAGE"], param,
        function onSuccess(res) {
          console.log(res);
          var images = that.data.uploadPatrolimgs;
          images.splice(index, 1);
          that.setData({
            uploadPatrolimgs: images
          });
        },
        function onErrorBefore(res) {
          console.log(res);
        },
        function onComplete(res) {
          console.log(res);
        },

        "POST")
    }else{
      var images = that.data.uploadPatrolimgs;
      images.splice(index, 1);
      that.setData({
        uploadPatrolimgs: images
      });
    }
    


  },
  /**
   * 回看巡检时更新数据
   */
  updateRecord:function(){
    if (this.data.isNewImage){
        this.uploadImageAndData(0, this.data.uploadPatrolimgs.length);
    }else{
      this.uploadNoImageAndData();
    }
  },

  uploadNoImageAndData: function () {
    var that = this;
    var param = {
      'status': this.data.patrolResultValue,
      'faultId': this.data.faultId,
      'deviceId': this.data.deviceId,
      'userId': wx.getStorageSync("userInfo").id,
      'reportId': '',
      // 'instanceId': this.data.instanceId,
      'textAreaVal': this.data.serviceDescribe == '请输入描述' ? '' : this.data.serviceDescribe,
      'imageNum': '', 
      // 'taskId': this.data.taskId,
      'uploadType':'1'};
    app.webCall(app.serviceCode["SUBMIT_PATROL_RESULT"], param,
      function onSuccess(res) {
        console.log(res);
        wx.navigateBack({

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

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
  }, 

  


})