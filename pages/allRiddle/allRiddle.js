import config from '../../utils/config'
//import request from '../../utils/request'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    riddlesList: [],
    currentPage: 1,
    total: '',//总条数
    totalPage: '',//总页数
    mihao:'',
    isTriggered: false,
    top_id:'',
  },

  toRiddleDetail:function(res){
    var index = res.currentTarget.id;
    var riddle = JSON.stringify(this.data.riddlesList[index]);
    wx.navigateTo({
      url: '../riddleDetail/riddleDetail?riddle='+riddle,
    })
  },

  scrollTop: function () {
    var that = this;
      that.setData({
        top_id: 'top_view',
      })
  },
   /**
   * 点击上一页
   */
  lastPage: function(){
    console.log('当前页码',this.data.currentPage);
    if(this.data.currentPage == 1){
      return;
    }
    this.setData({
      currentPage: this.data.currentPage-1,
    });
    console.log(this.data.currentPage);
    var that = this;
    wx.request({
      url: config.mobileHost+'/getAllRiddles',
      data:{
        'currentPage': that.data.currentPage,
      },
      success: function (res) {
        //防止断网出现返回值无效问题
        var riddlesList = res.data;
        for(let index = 0; index < riddlesList.length; index++){
          riddlesList[index].mi_id = riddlesList[index].mi_id + 1 -1 ;
        }
        console.log("成功" , res.data);
        that.setData({
          riddlesList,
          top_id: 'top_view',
        });
      },
      fail: function (err) {
      }
    })
  },

  /**
   * 点击下一页
   */
  nextPage: function(){
    console.log('点击下一页前页码',this.data.currentPage);
    if(this.data.currentPage == this.data.totalPage){
      return;
    }
    this.setData({
      currentPage: this.data.currentPage+1,
    });
    console.log('点击下一页后页码',this.data.currentPage);
    var that = this;
    wx.request({
      url: config.mobileHost+'/getAllRiddles',
      data:{
        'currentPage': that.data.currentPage,
      },
      success: function (res) {
         //防止断网出现返回值无效问题
        var riddlesList = res.data;
        for(let index = 0; index < riddlesList.length; index++){
          riddlesList[index].mi_id = riddlesList[index].mi_id + 1 -1 ;
        }
        console.log("成功" , res.data);
        that.setData({
          riddlesList,
          top_id: 'top_view',
        });
      },
      fail: function (err) {
      }
    })
  },

  //刷新
  refresher:function(){
    this.onLoad();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad:  function (options) {
    // let bannerListData =  request('/getAllRiddles');
    // console.log(bannerListData),
    // this.setData({
    //   riddlesList: bannerListData.data
    // })
    var that = this;
    console.log(this.data.currentPage);
    wx.request({
      url: config.mobileHost+'/getAllRiddles',
      data:{
        'currentPage': that.data.currentPage,
      },
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //防止断网出现返回值无效问题
        var riddlesList = res.data;
        for(let index = 0; index < riddlesList.length; index++){
          riddlesList[index].mi_id = riddlesList[index].mi_id + 1 -1 ;
        }
        console.log("成功" , res.data);
        that.setData({
          riddlesList,
          isTriggered: false,
        });
      },
      fail: function (err) {
        console.log(err);
      }
    })
    wx.request({
      url: config.mobileHost+'/getTotal',
      method: 'get',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log("成功，共有" + res.data+"条");
        that.setData({
          total: res.data,
          totalPage: Math.ceil(res.data/20),
        });
        console.log("成功，共有" + Math.ceil(res.data/20)+"页");
      },
      fail: function (err) {
        console.log(err);
      }
    })
    wx.pageScrollTo({
      scrollTop: 100,
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
  onShareAppMessage: function ({from}) {
    console.log(from)
  }
})