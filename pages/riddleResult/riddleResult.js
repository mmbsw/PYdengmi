import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    currentPage: 1,
    totalPage:'',
    searchRiddleList:[],
    riddlesList:[],
    start: 0 ,  //灯谜数组的起始下标
    end : 19 ,  //灯谜数组的结束下标
    top_id:'',
  },

  toRiddleDetail:function(res){
    var index = res.currentTarget.id;
    var riddle = JSON.stringify(this.data.riddlesList[index]);
    wx.navigateTo({
      url: '../riddleDetail/riddleDetail?riddle='+riddle,
    })
  },
  //点击上一页
  lastPage:function(){
    var prePage =  this.data.currentPage-1;
    if(prePage < 1){
      return;
    }
    this.setData({
      start: this.data.start-20,
      end: this.data.end-20,
      currentPage: this.data.currentPage-1,
      riddlesList: this.data.searchRiddleList.slice(this.data.start-20,this.data.end-20),
      top_id: 'top_view',
    });
  },
  //点击下一页
  nextPage:function(){
    var nextPage =  this.data.currentPage+1;
    if(nextPage > this.data.totalPage){
      return;
    }
    this.setData({
      start: this.data.start+20,
      end: this.data.end+20,
      currentPage: this.data.currentPage+1,
      riddlesList: this.data.searchRiddleList.slice(this.data.start+20,this.data.end+20),
      top_id: 'top_view',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var radiovalue = options.radiovalue;
    var searchvalue = options.riddlevalue ? options.riddlevalue : '字';
    var that = this;
    wx.request({
      url: config.mobileHost+'/getSearchRiddle',
      data:{
        radiovalue,
        searchvalue,
      },
      success:function(res){
        that.setData({
          searchRiddleList:res.data,
          riddlesList:res.data.slice(0,19),
          totalPage:Math.ceil((res.data.length)/20)
        })
      }
    })
    //设置标题栏
    var type = '谜目';
    if(radiovalue === 'mihao'){
      type = '谜号';
    }else if(radiovalue === 'mimian'){
      type = '谜面';
    }else if(radiovalue === 'midi'){
      type = '谜底';
    }
    wx.setNavigationBarTitle({
      title: '“' + type + '”包含“' + searchvalue + '”',
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