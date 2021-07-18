import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mihao:'',
    signed: 0,
  },
  //去登录
  toLogin:function(){
    console.log('aaa')
    wx.navigateTo({
      url: '../logins/logins',
    })
  },
  ifShare:function(e){
    console.log(e);
    this.setData({
      signed : e.detail.value,
    })
  },

  addRiddle:function (options) {
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

    let riddle = options.detail.value;
    let mihao = this.data.mihao;
    let signed = this.data.signed;

    //添加灯谜
    wx.request({
      url: config.mobileHost+'/addRiddle',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'mihao': mihao,
        'mimian': riddle.mimian,
        'mimu': riddle.mimu,
        'midi': riddle.midi,
        'remark': riddle.remark,
        signed: signed,
      },
      success : function(res){
        if(res.data.status == 500){
          wx.navigateTo({
            url: '../mymi/mymi',
          })
        }else{
          wx.showToast({
            title: res.data.message,
            duration: 2000,
            icon: 'error',
            mask: false,
          })
        }
      },
      fail:function(res){
        wx.showToast({
          title: '网络错误',
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
    let that = this;
    wx.getStorage({
      key: 'mihao',
      success (res) {
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
    this.setData({
      mihao:'',
    })
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