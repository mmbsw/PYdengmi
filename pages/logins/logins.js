import config from '../../utils/config'
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    //定义初始化变量值
    mihao: '',
    password: '',
  },
 
  /**
   * 点击登录按钮
   */
  formSubmit: function (e) {
    var that = e.detail.value;
    console.log("登录获取的参数：" + e.detail.value.mihao + "," + e.detail.value.password);
    wx.request({
      url: config.mobileHost+'/login', 
      method: 'POST', 
      header: { 'content-type': 'application/x-www-form-urlencoded' }, 
      data: {
        'mihao': that.mihao,
        'password': that.password,
      }, 
      success: function (res) { 
        var resData = res.data;
        console.log(res);
        console.log("???:"+resData);
        if (resData == true) {
          console.log(resData);
          wx.setStorage({
            key: 'mihao',
            data: that.mihao,
          })
          
          wx.showToast({    //这是微信小程序里面自带的成功弹窗
            title: '登录成功',  //弹窗里面的内容
            icon: 'success',  //图标
            duration: 1000,   //弹窗持续的时间
            success: function () {
              wx.navigateBack({  //保留当前页面，跳转到应用内的某个页面
              })
            }
          })
        } else {
          wx.showToast({
            title: '登录失败',
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