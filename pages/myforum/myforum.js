import config from '../../utils/config'
import util from '../../utils/util'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mihao:'',
    forumList:[],
    topic_id:'',
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
  delete:function(e){
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
        wx.showToast({
          title: '删除成功',
          duration: 2000,
          icon: 'success',
          success:function(){
            setTimeout(function(){
              wx.redirectTo({
                url: '../myforum/myforum',
              })
            },500);
          }
        })
      },
      fail: function (err) {}
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
    var tips =  [{publisher: "提示", speech: "您暂时还没有发过帖子"}];
    var mihao = wx.getStorageSync('mihao'); 
    that.setData({
      mihao: mihao,
    })
    wx.request({
      url: config.mobileHost+'/getForumTitleBymihao',
      data:{
        'mihao':that.data.mihao,
      },
      method:'get',
      header:{
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("成功" , res.data);
        var list = res.data;
        //时间戳格式转换
        for (let index = 0; index < list.length; index++) {
          var TIME = util.formatTime(new Date(list[index].time));
          list[index].time = TIME;
        }
        that.setData({
          forumList:list.length > 0 ? list : tips
        });

      },
      fail: function (err) {
      }
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