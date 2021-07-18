import util from '../../utils/util'
import config from '../../utils/config'
Page({
  data: {
    mihao:'',
    forumList: [],
    startX: 0, //开始坐标
    startY: 0
  },
  
  //手指触摸动作开始 记录起点X坐标
  touchstart: function (e) {
    //开始触摸时 重置所有删除
    this.data.forumList.forEach(function (v, i) {
      if (v.isTouchMove)//只操作为true的
        v.isTouchMove = false;
    })
    this.setData({
      startX: e.changedTouches[0].clientX,
      startY: e.changedTouches[0].clientY,
      // forumList: this.data.forumList
    })
  },
  //滑动事件处理
  touchmove: function (e) {
    var that = this,
      index = e.currentTarget.dataset.index,//当前索引
      startX = that.data.startX,//开始X坐标
      startY = that.data.startY,//开始Y坐标
      touchMoveX = e.changedTouches[0].clientX,//滑动变化坐标
      touchMoveY = e.changedTouches[0].clientY,//滑动变化坐标
      //获取滑动角度
      angle = that.angle({ X: startX, Y: startY }, { X: touchMoveX, Y: touchMoveY });
      that.data.forumList.forEach(function (v, i) {
      v.isTouchMove = false
      //滑动超过30度角 return
      if (Math.abs(angle) > 30) return;
      if (i == index) {
        if (touchMoveX > startX) //右滑
          v.isTouchMove = false
        else //左滑
          v.isTouchMove = true
      }
    })
      //更新数据
      that.setData({
        forumList: that.data.forumList
      })
    },
  /**
   * 计算滑动角度
   * @param {Object} start 起点坐标
   * @param {Object} end 终点坐标
   */
  angle: function (start, end) {
    var dX = end.X - start.X,
      dY = end.Y - start.Y
    //返回角度 /Math.atan()返回数字的反正切值
    return 360 * Math.atan(dY / dX) / (2 * Math.PI);
  },
  //删除事件
  delete: function (e) {
    var that = this
    var topic_id = e.target.dataset.index;
    wx.request({
      url: config.mobileHost+'/deleteForum',
      data:{
        'topic_id':topic_id
      },
      method:'get',
      header:{
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("删除成功" , res.data);
        wx.showToast({
          title: '删除成功',
          duration: 2000,
          icon: 'success',
          success:function(){
            setTimeout(function(){
              wx.reLaunch({
                url: '../allForum/allForum',
              })
            },500);
          }
        })
      },
      fail: function (err) {
      }
    })
    },
  look:function(e){
    var id = e.target.dataset.id;
    this.setData({
      topic_id:id,
    })
    wx.setStorage({
      key: 'topic_id',
      data: id,
    })
    console.log(e);
    wx.navigateTo({
      url: '../oneforum/oneforum?',
    })
  },
    /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var tips =  [{publisher: "提示", speech: "暂时还没有人发过帖子"}];
    var mihao = wx.getStorageSync('mihao'); 
      that.setData({
        mihao: mihao,
      })
      wx.request({
      url: config.mobileHost+'/getForumTitle',
      success:function(res){
        //转换时间戳格式
        var list = res.data;
        for (let index = 0; index < list.length; index++) {
          var TIME = util.formatTime(new Date(list[index].time));
          list[index].time = TIME;
        };
        that.setData({
          forumList:list.length > 0 ? list : tips
        });
        //隐藏loading 提示框
        wx.hideLoading();
        //隐藏导航条加载动画
        wx.hideNavigationBarLoading();
        //停止下拉刷新
        wx.stopPullDownRefresh();
      },
    });
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
    //在当前页面显示导航条加载动画
    wx.showNavigationBarLoading(); 
    //显示 loading 提示框。需主动调用 wx.hideLoading 才能关闭提示框
    wx.showLoading({
      title: '刷新中...',
    });
    this.onLoad();
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