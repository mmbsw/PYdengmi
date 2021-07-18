import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mihao:'',

  },

  logout:function(){
    var that = this;
    wx.removeStorageSync('mihao');
    wx.showToast({ 
      title: '退出成功',
      icon: 'success', 
      duration: 1000, 
    });
    that.onLoad();
  },
  
  myInfo:function(){
    //判断用户是否登录
    if(!this.data.mihao){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success:function(){
          setTimeout(function(){
            wx.navigateTo({
              url: '../logins/logins',
            })
          },500);
        }
      });
      return;
    }
    wx.navigateTo({
      url: '../myInfo/myInfo',
     })
  },
  mymi:function(){
    wx.navigateTo({
      url: '../mymi/mymi',
     })
  },
  addRiddle:function(){
    wx.reLaunch({
      url: '../addRiddle/addRiddle'
    })
  },
  myforum:function(){
    wx.navigateTo({
      url: '../myforum/myforum',
     })
  },
  addForum:function(){
    wx.navigateTo({
      url: '../addForum/addForum'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let mihao = wx.getStorageSync('mihao')
    this.setData({
      mihao:mihao,
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
    this.onLoad();
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