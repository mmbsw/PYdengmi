import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    radiovalue:'mimu',
    riddlevalue:'字',
    forumvalue:'字',
    recommendList:[],
  },
  //与虎谋皮
  zhimi:function(){
    wx.navigateTo({
      url: '../zhimi/zhimi',
    })
  },
  //每日一猜
  caimi:function(){
    wx.navigateTo({
      url: '../caimi/caimi'
    })
  },
  //获得单选框的值
  getradio:function(e){
    let radiovalue = e.detail.value;
    this.setData({
      radiovalue ,
    });
  },
  //获得输入框的值
  getRiddle:function(e){
    let riddlevalue = e.detail.value;
    this.setData({
      riddlevalue,
    });
  },
  getForum:function(e){
    let forumvalue = e.detail.value;
    this.setData({
      forumvalue,
    });
  },
  //灯谜搜索跳转
  searchRiddle :function(){
    var radiovalue  = this.data.radiovalue;
    var riddlevalue  = this.data.riddlevalue ? this.data.riddlevalue : '字';
    wx.navigateTo({
      url: '../riddleResult/riddleResult?radiovalue=' + radiovalue + '&riddlevalue=' + riddlevalue
    })
  },
    //进入灯谜库
    tomiku:function(){
      wx.switchTab({			
        url: '/pages/allRiddle/allRiddle',
      })
    },
  //帖子搜索跳转
  searchForum :function(){
    var forumvalue  = this.data.forumvalue ? this.data.forumvalue : '字';
    wx.navigateTo({
      url: '../forumResult/forumResult?forumvalue=' + forumvalue 
    })
  },
  //进入论坛
  toluntan:function(){
    wx.switchTab({			
      url: '/pages/allForum/allForum',
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
    var that = this;
    wx.request({
      url: config.mobileHost+'/getRecommend',
      method: 'get', 
      header: { 'content-type': 'application/x-www-form-urlencoded' }, 
      success:function(res){
        //防止断网出现返回值无效问题
        var recommendList = res.data;
        for(let index = 0; index < recommendList.length; index++){
          recommendList[index].mi_id = recommendList[index].mi_id + 1 -1 ;
        }
        that.setData({
          recommendList,
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