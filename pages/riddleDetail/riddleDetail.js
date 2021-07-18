import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user:'',
    mi_id:'',
    mihao:'',
    mimian:'',
    mimu:'',
    midi:'',
    remark:'',
    signed:''
  },

  inputeidt:function(e){
    var that = this;
    that.data.mimian = e.detail.value;
  },

  ifShare:function(e){
    console.log("是否分享",e.detail.value);
    this.setData({
      signed:e.detail.value,
    })
  },
  updateRiddle:function(e){
    e.detail.value.mimian = this.data.mimian;
    console.log(e.detail.value);
    var that = e.detail.value;
    var signed = this.data.signed;
    wx.request({
      url: config.mobileHost+'/updateRiddle',
      method: 'get', 
      header: { 'content-type': 'application/x-www-form-urlencoded' }, //
      data: {
        mi_id:  that.mi_id,
        'mimian': that.mimian,
        'mimu': that.mimu,
        'midi':  that.midi,
        'remark':  that.remark,
        signed: signed,
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

  deleteRiddle:function(){
    console.log(this.data.mi_id);
    var that = this;
    console.log(that.data.mi_id);
    wx.request({
      url: config.mobileHost+'/deleteRiddle',
      data:{
        mi_id :that.data.mi_id
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
    let user_mihao = wx.getStorageSync('mihao');
    let riddle = JSON.parse(options.riddle);
    this.setData({
      mi_id:riddle.mi_id,
      mihao:riddle.mihao,
      mimian:riddle.mimian,
      mimu:riddle.mimu,
      midi:riddle.midi,
      remark:riddle.remark,
      signed:riddle.signed,
      user:user_mihao,
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