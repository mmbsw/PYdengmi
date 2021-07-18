import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    age: '',
    gender: '',
    phone: ''
  },

  register: function(e){
    console.log(e.detail.value); 
    var that = e.detail.value;
    wx.request({  
      url: config.mobileHost+'/addUser', 
      method: 'POST',  
      header: { 'content-type': 'application/x-www-form-urlencoded' }, 
      data: {
        'username': that.username,
        'password': that.password,
        'age':  that.age,
        'gender':  that.gender,
        'phone':  that.phone,
      },  //请求参数
      success: function (res) {   //接受后台的回调函数
        var resData = res.data;
        console.log(res);
        console.log("???:"+resData);
        //存谜号	
        wx.setStorage({
          key: 'mihao',
          data: that.username,
        })
        if (resData.status == 500) {
          wx.showToast({    //这是微信小程序里面自带的成功弹窗
            title: '注册成功',  //弹窗里面的内容
            icon: 'success',  //图标
            duration: 5000,   //弹窗延迟的时间
            success: function () {
              wx.navigateBack({
                delta: 2,
              })
            }
          })
        } else {
          wx.showToast({
            title: resData.message,
            icon: 'none',
            duration: 2000,
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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

  }
})