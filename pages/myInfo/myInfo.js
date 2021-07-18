import config from '../../utils/config'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    mihao:'',
    password:'',
    age:'',
    gender:'',
    phone:'',
  },

  updateUser:function(e){
    console.log(e.detail.value);
    var that = e.detail.value;
    wx.request({
      url: config.mobileHost+'/updateUser',
      method: 'get', 
      header: { 'content-type': 'application/x-www-form-urlencoded' }, //
      data: {
        'username': this.data.mihao,
        'password': that.password,
        'age':  that.age,
        'gender':  that.gender,
        'phone': that.phone,
      },  //请求参数
      success: function (res) {   //接受后台的回调函数
        var resData = res.data;
        console.log("???:"+resData);
        if (resData == true) {
          wx.showToast({    //这是微信小程序里面自带的成功弹窗
            title: '修改成功',  //弹窗里面的内容
            icon: 'success',  //图标
            //duration: 5000,   //弹窗延迟的时间
            success: function () {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'error',
            duration: 1000,
          })
        }
      }
    })
  },

  deleteUser:function(){
    var that = this;
    wx.request({
      url: config.mobileHost+'/deleteUser',
      data:{
        'username' :that.data.mihao
      },
      header: {
        'content-type': 'application/json'
      },
      method:'get',
      success:function(res){
        var resData = res.data;
        console.log("delete:"+resData);
        if (resData == true) {
          wx.showToast({    //这是微信小程序里面自带的成功弹窗
            title: '删除成功',  //弹窗里面的内容
            icon: 'success',  //图标
            success: function () {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        } else {
          wx.showToast({
            title: '删除失败',
            icon: 'error',
            duration: 1000,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getStorage({
      key: 'mihao',
      success (res) {
        console.log(res)
        that.setData({
          mihao:res.data
        })
      }
    });
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var _this = this;
    wx.request({
      url: config.mobileHost+'/getUser',
      data:{
        username: this.data.mihao,
      },
      success:function(res){
        console.log(res.data)
        _this.setData({
          'password' : res.data.password,
          'age' : res.data.age,
          'gender' : res.data.gender,
          'phone' : res.data.phone,
        })
      },
    })
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

  }
})