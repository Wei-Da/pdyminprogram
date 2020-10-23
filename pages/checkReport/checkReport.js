// pages/checkReport/checkReport.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uploadPicture: './../../../images/add_image.png',
    uploadPatrolimgs: [],
    faultId: '',
    patrolStandard: '',
    patrolResultValue: '1',
    patrolImageInfo: [],
    isNewImage: false,
    imageWidth: '',
    popErrorMsg: '',
    imageInfo:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (getApp().screenWidth!=''){
      this.setData({
        faultId: options.faultId,
        imageWidth: getApp().screenWidth / 6 - 10,
      })
    }else{
      wx.getSystemInfo({
        success: function (res) {
          that.setData({
            faultId: options.faultId,
            imageWidth: res.windowWidth / 6 - 10,
          })
        }
      });
    }
    this.getPatrolStandard();
    
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
        var addPicSize = 4 - that.data.uploadPatrolimgs.length;
        if (addPicSize > 0) {
          if (tempFilePaths.length < addPicSize + 1) {
            that.setData({
              uploadPatrolimgs: that.data.uploadPatrolimgs.concat(tempFilePaths),
              isNewImage: true
            })
          } else {
            for (var i = 0; i < addPicSize; i++) {
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


  previewPatrolImage: function (e) {
    var pictures = this.data.uploadPatrolimgs;
    wx.previewImage({
      current: e.target.dataset.src, // 当前显示图片的http链接
      urls: pictures, // 需要预览的图片http链接列表
    })
  },



  uploadImageAndData: function (i, length) {
    wx.showLoading({
      title: '加载中...',
    })
    wx.uploadFile({
      url: app.apiHost + app.serviceCode["SAVE_CHECK_IMAGE"],
      filePath: this.data.uploadPatrolimgs.length == 0 ? '' : this.data.uploadPatrolimgs[i],
      name: 'attachment',
      formData: {
        'faultId': this.data.faultId,
        'imageNum': i,
        'imgFormat': this.data.uploadPatrolimgs.length == 0 ? '' : this.data.uploadPatrolimgs[i].substring(this.data.uploadPatrolimgs[i].lastIndexOf('.') + 1),       'routerCompany': wx.getStorageSync("serial"),
        'sessionId': wx.getStorageSync("sessionId")
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
        if (length > 0) {
          i++;
          if (i == length) {
            wx.hideLoading();
            wx.navigateBack({

            })
          } else {
            this.uploadImageAndData(i, length);
          }
        } else {
          wx.hideLoading();
          wx.navigateBack({

          })
        }

      },
    })
  },


  applySubmit: function (e) {
    console.log(e);
    if (this.data.uploadPatrolimgs.length == 0) {
      this.setData({
        popErrorMsg: '请加入巡检图片',
      })
      this.ohShitfadeOut();
      return;
    }
    this.uploadImageAndData(0, this.data.uploadPatrolimgs.length);
  },

  deleteImage: function (e) {
    console.log(e);
    var index = e.currentTarget.dataset.index;
    var images = this.data.uploadPatrolimgs;
    this.removeImage(images[index], index);
  },

  removeImage: function (imagePath, index) {
    var that = this;
    var param = { "faultReportId": '' };
    for (var i = 0; i < that.data.imageInfo.length; i++) {
      console.log("seldId: "+that.data.imageInfo[i].seldId);
      if (app.apiHost + app.serviceCode["CHECK_IMAGE_URL"] + that.data.imageInfo[i].imagePath == imagePath) {
        param = { "faultReportId": that.data.imageInfo[i].seldId }
      }
    }
    if (param.faultReportId != '') {
      app.webCall(app.serviceCode["DELETE_CHECK_PICTURE"], param,
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
    } else {
      var images = that.data.uploadPatrolimgs;
      images.splice(index, 1);
      that.setData({
        uploadPatrolimgs: images
      });
    }



  },

  

  //定时器提示框3秒消失  
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({ popErrorMsg: '' });

    }, 3000);
  },

  getPatrolStandard: function () {
    var that = this;
    var param = { "faultId": that.data.faultId };
    app.webCall(app.serviceCode["QUERY_CHECK_PICTURE"], param,
      function onSuccess(res) {
        console.log(res);
        var temOriginal = [];
        for (var i = 0; i < res.listFaultImage.length; i++) {
          temOriginal[i] = app.apiHost + app.serviceCode["CHECK_IMAGE_URL"] + res.listFaultImage[i].imagePath;
        }
        that.setData({
          imageInfo: res.listFaultImage,
          uploadPatrolimgs: temOriginal,
        })
        // console.log(that.data.patrolStandard);
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