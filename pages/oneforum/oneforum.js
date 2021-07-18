import config from '../../utils/config'
var util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    topic_id:'',
    forumList:'',
    mihao:'',
    inputValue:'',
    autoRefresh:'',
    ifRefresh:false,
  },
  //下拉刷新
  refresh:function(){
    this.onReady();
  },
  //获取输入框的值
  input:function(e){
    this.setData({
      inputValue:e.detail.value
    })
  },
  //发表言论
  submit:function(e){
    //判断登录
    if(!this.data.mihao){
      wx.showToast({
        title: '请先登录',
        icon: 'none',
        success:function(){
          wx.navigateTo({
            url: '../logins/logins',
          })
        }
      });
      return;
    }
    var that = this;
    var speech = that.data.inputValue;
    wx.request({
      url: config.mobileHost+'/addSpeech',
      method: 'post',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data:{
        'speech': speech, 
        'publisher': this.data.mihao,
        'topic_id': this.data.topic_id,
      },
      success : function(res){
       that.reset();
        wx.showToast({
          title: '发布成功',
          duration: 2000,
          icon: 'success',
          success:function(){
            setTimeout(function(){
              that.onReady();             
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
      },
    })
  },
  //重置输入框
  reset:function(){
    this.setData({
      inputValue:'',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取帖子id 
    var that = this;
    wx.getStorage({
      key: 'topic_id',
      success (res) {
        that.setData({
          'topic_id':res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this;
    wx.request({
      url: config.mobileHost+'/getOneForum',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      data:{
        'topic_id':that.data.topic_id,
      },
      success:function(res){
        var list = res.data;
        for (let index = 0; index < list.length; index++) {
          var TIME = util.formatTime(new Date(list[index].time));
          list[index].time = TIME;
          that.setData({
            forumList:res.data,
            ifRefresh:false,
          });
        }
      },
      fail:function(err){
      }
    });
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    //获取谜号
    wx.getStorage({
      key: 'mihao',
      success (res) {
        that.setData({
          mihao:res.data
        })
      }
    })
  //   0.5秒刷新  
  //   var _this = this;
  //   this.setData({
  //     autoRefresh : setInterval(function(){
  //       _this.onReady();
  //      },500
  //    )
  //  })
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
    clearInterval(this.data.autoRefresh);
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