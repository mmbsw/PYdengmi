import config from '../../utils//config'
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    speech:'',
    mihao:'',
    time:'',
    topic_id:'',
  },
  //去登录
  toLogin:function(){
    console.log('aaa')
    wx.navigateTo({
      url: '../logins/logins',
    })
  },
  //添加帖子
  addForum:function (options) {

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

    let speech = options.detail.value.speech;

    wx.request({
      url: config.mobileHost+'/addForum',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'speech': speech,
        'publisher': this.data.mihao,       
      },
      success : function(res){
        wx.showToast({
          title: '发布成功',
          duration: 2000,
          icon: 'success',
          success:function(){
            setTimeout(function(){
              wx.switchTab({
                url: '../userInfo/userInfo',
              })
            },500);
          }
        }); 
        
      },
      fail:function(res){
        wx.showToast({
          title: '不为空',
          icon:'error',
          duration: 2000
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // var TIME = util.formatTime(new Date());
    // console.log(TIME),
    // this.setData({
    //   time: TIME,
    // });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
   
  },

  /**
   * 生命周期函数--监听页面显示
   * 获得缓存的谜号
   */
  onShow: function () {
    //获得缓存的谜号
    let that = this;
    wx.getStorage({
      key: 'mihao',
      success (res) {
        console.log(res)
        that.setData({
          mihao:res.data
        })
      }
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