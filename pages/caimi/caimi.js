import config from '../../utils/config'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user: '',//登录的用户名
    mymidi: '',
    riddleUUID: '',
    mihao: '',
    mimian: '',
    mimu: '',
    midi: '',
    remark: '',
    allList: [],
    allMihao: [],
  },

  // 获得灯谜输入
  inputRiddle:function(event){
    var type = event.currentTarget.id;
    this.setData({
      [type]:event.detail.value,
    })
  },
  //管理员提交灯谜
  submitRiddle:function(){
    var that = this;
    let {mihao,mimian,mimu,midi,remark} = this.data;
    if(!(mihao.length>0&&mimian.length>0&&mimu.length>0&&midi.length>0)){
      wx.showToast({
        title: '将谜填写完整',
        icon: 'none',
      })
      return;
    }
    // 给用户一个机会
    wx.showModal({
      title:'确认操作将发布新的“每日一猜”',
      content: '确认发布吗？',
      success (res) {
        if (res.confirm){
          //发送请求
          that.send();
        }else if(res.cancel){
          return;
        }
      }
    });
  },
  //提交新的灯谜
  send:function(){
    var that = this;
    let {mihao,mimian,mimu,midi,remark} = this.data;
    wx.request({
      url: config.mobileHost+'/addRiddleQuestion',
      data:{
        mihao,
        mimian,
        mimu,
        midi,
        remark,
      },
      success(res){
        wx.showToast({
          title: '提交成功',
          duration: 1000,
          success: function() {
            
              that.setData({
                allMihao: [],
                allList:[]
              })
          },
        });
      }
    })
  },
  //提交灯谜谜底
  submitMidi:function(){
    let user = this.data.user;
    let allMihao = this.data.allMihao;
    //判断用户是否登录
    if(!user){
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
    //判断用户是否已经猜对
    if(allMihao.indexOf(user)>-1){
      wx.showToast({
        title: '请勿重复提交',
        icon: 'none',
        duration: 500,
      });
      return;
    }
    var that = this;
    if(!(this.data.midi === this.data.mymidi)){
      wx.showToast({
        title: '没猜对，继续猜吧！！',
        icon: 'none',
      })
      console.log(that.data.riddleUUID);
      return;
    }
    that.setData({
      allMihao: allMihao.concat(user)
    });
    wx.request({
      url: config.mobileHost+'/addMihao',
      data:{
        mihao: that.data.user,
        riddleUUID: that.data.riddleUUID,
      },
      success(res){
        wx.showToast({
          title: '猜对了！！！',
          success: function() {
            setTimeout(function() {
              wx.redirectTo({
                url: '../caimi/caimi',
              })
              
            }, 1000)
          },
        });
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      allMihao: [],
      allList:[]
    })
    //设置标题栏
    wx.setNavigationBarTitle({
      title: '每日一猜',
    });
    wx.setNavigationBarColor({
      backgroundColor: '#3389d9',
      frontColor: '#000000',
    })
    var that = this;
    //获得管理员设置的题的谜题相关
    wx.request({
      url: config.mobileHost+'/getRiddleQuestion',
      success(res){
        that.setData({
          mihao: res.data.mihao,
          mimian: res.data.mimian,
          mimu: res.data.mimu,
          midi: res.data.midi,
          remark: res.data.remark,
          riddleUUID: res.data.riddleUUID,
        });
        wx.setStorageSync('riddleUUID', res.data.riddleUUID);
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   * 获得全部猜中用户谜号
   */
  onReady: function () {
    var that = this;
    var riddleUUID = wx.getStorageSync('riddleUUID')
    wx.request({
      url: config.mobileHost+'/getAllMihao',
      data:{
        riddleUUID,
      },
      success(res){
        //防止断网出现返回值无效问题
        var allList = res.data;
        var allMihao = that.data.allMihao;
        for(let index = 0; index < allList.length; index++){
          allList[index].id = allList[index].id + 1 -1 ;
          allMihao[index] = allList[index].mihao ;
        }
        that.setData({
          allList,
          allMihao,
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取登录用户名
    //放在onshow中，登录跳转回来就能存入谜号
    var user = wx.getStorageSync('mihao');
    this.setData({
      user,
    });
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
    this.onReady();
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