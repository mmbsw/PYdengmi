import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mihao:'',
    riddlesList: [],
    currentPage: 1,
    total: '',//总条数
    totalPage: '',//总页数
  },

  
  toRiddleDetail:function(res){
    var index = res.currentTarget.id;
    var riddle = JSON.stringify(this.data.riddlesList[index]);
    wx.navigateTo({
      url: '../riddleDetail/riddleDetail?riddle='+riddle,
    })
  },
  /**
   * 点击上一页
   */
  lastPage: function(){
    console.log('触发上一页');
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
      url: config.mobileHost+'/getAllRiddlesBymihao',
      data:{
        'mihao':that.data.mihao,
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
        });
      },
      fail: function (err) {
      }
    })
    this.nextPage;
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
      url: config.mobileHost+'/getAllRiddlesBymihao',
      data:{
        'mihao':that.data.mihao,
        'currentPage': that.data.currentPage,
      },
      success: function (res) {
        //防止断网出现返回值无效问题
        var riddlesList = res.data;
        for(let index = 0; index < riddlesList.length; index++){
          riddlesList[index].mi_id = riddlesList[index].mi_id + 1 -1 ;
        }
        that.setData({
          riddlesList,
        });
      },
      fail: function (err) {
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var mihao = wx.getStorageSync('mihao'); 
    that.setData({
      mihao: mihao,
    })
    console.log(that.data.mihao);
    wx.request({
      url: config.mobileHost+'/getAllRiddlesBymihao',
      data:{
        'mihao':that.data.mihao,
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
        });
      },
      fail: function (err) {
      }
    })
    wx.request({
      url: config.mobileHost+'/getTotal',
      method: 'post',
      data:{
        mihao: mihao
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        
        console.log("成功" , res.data);
        that.setData({
          total: res.data,
          totalPage:Math.ceil(res.data/20),
        });
        console.log("成功" , Math.ceil(res.data/20));
      },
      fail: function (err) {
        console.log(err);
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