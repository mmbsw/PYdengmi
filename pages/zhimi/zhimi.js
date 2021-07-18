import config from '../../utils/config'
import util from '../../utils/util'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lock: false,//允许点赞
    mihao: '',
    titlevalue:'',
    allWork:[],
    zhimiUUID:'',
    mimian:'',
    mimu:'',
    midi:'',
    remark:'',
    votes: '',  //票数
    vote: false,  //投票
    voteList: [], //自己投过的票
  },

  // 获得获得管理员设置的谜题
  getTitle:function(){
    var that = this;
    return new Promise((reslove, reject) => {
      wx.request({
        url: config.mobileHost+'/getTitle',
        success(res){
          that.setData({
            titlevalue:res.data.midi,
            zhimiUUID:res.data.zhimiUUID,
          });
          reslove(res.data);
        }
      });
    })
  },
  //获得全部作品
  getAllWorks:function(zhimiUUID){
    var that = this;
    return new Promise((reslove, reject) => {
      wx.request({
        url: config.mobileHost+'/getAllWork',
        data:{
          zhimiUUID,
        },
        success(res){
          var allWork = res.data;
          for(let index = 0; index < allWork.length; index++){
            allWork[index].id = allWork[index].id + 1 -1 ;
            //给所以作品添加字符ifVote，自己是否给这个作品点过赞，默认为无。
            allWork[index].ifVote = false;
          }
          reslove(allWork)
        },
      });
    });
  },
  // 获得用户的点赞列表
  getvoteList:function(zhimiUUID,mihao){
    return new Promise((reslove,reject) => {
      // 获得用户点过赞的作品
    wx.request({
      url: config.mobileHost + '/getVotes',
      data: {
        zhimiUUID,
        mihao,
      },
      success(res){
        reslove(res.data);
      }
    })
    })
  },

   // 修改全部列表中的ifVote值
   changeAllWork(allWork,voteList){
    let newAllWork = allWork;
    let newVoteList = voteList;
    for(let i = 0; i < newAllWork.length; i ++){
      for(let j = 0; j < newVoteList.length; j++){
        if(newAllWork[i].id === newVoteList[j].miID ){
          newAllWork[i].ifVote = newVoteList[j].vote;
        }
      }
    }
    this.setData({
      allWork: newAllWork
    })
    console.log(newAllWork);
  },

  //获取输入框的值
  inputTopic:function(e){
    var titlevalue = e.detail.value;
    this.setData({titlevalue});
  },
  //发送请求,添加题目之前，给管理员一个机会
  submitTopic:function(){
    // 给管理员一个机会
    var that = this;
    wx.showModal({
      title:'底为“' + that.data.titlevalue + "”",
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
  //发送请求,添加题目
  send:function(){
    var that = this;
    wx.request({
      url: config.mobileHost+'/addTopic',
      data:{
        midi:that.data.titlevalue,
        mihao:that.data.mihao,
      },
      success:function(res){
        wx.showToast({
          title: '发布成功',
          success: function() {
            setTimeout(function() {
              that.onLoad();
              that.setData({
                allWork:[]
              })
            }, 500)
          },
        })
      }
    })
  },

  // 获得灯谜输入
  inputRiddle:function(event){
    var type = event.currentTarget.id;
    this.setData({
      [type]:event.detail.value,
    })
  },

  //提交灯谜
  submitRiddle:function(){
    var that = this;
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
    let {mihao,zhimiUUID,mimian,mimu,midi,remark} = this.data;
    if(!(mimian.length>0&&mimu.length>0&&midi.length>0)){
      wx.showToast({
        title: '将谜填写完整',
        icon: 'none',
      })
      return;
    }
    wx.request({
      url: config.mobileHost+'/addWork',
      data:{
        mihao,
        zhimiUUID,
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
            setTimeout(function() {
              that.onLoad();
            }, 1000);
          },
        });
      }
    })
    // 成功之后将页面输入框清空
    that.setData({
      mimian: '',
      mimu: '',
      midi: '',
      remark: '',
    })
  },
  //前去点赞
  toVote: util.throttle(function(event){
    console.log('11111111')
    let index = event.currentTarget.id;
    if(!this.data.lock){
      this.vote(index);
    }
  },1000),
  // toVote:function(event){
  //   let index = event.currentTarget.id;
  //   console.log(this.data.lock)
  //   if(!this.data.lock){
  //     this.vote(index);
  //   }
  // },
  // 点赞
  vote:function(index){
    this.setData({
      lock: true,
    })
    var that = this;
    var work = this.data.allWork[index];
    var _ifVote = work.ifVote;
    wx.request({
      url: config.mobileHost + '/vote',
      data:{
        miID: work.id,
        zhimiUUID: work.zhimiUUID,
        mihao: that.data.mihao,
        vote: !work.ifVote,
      },
      success(res){
        that.setData({
          _ifVote: !_ifVote,
          lock: false,
        });
        that.onLoad()
      },
      fail(res){
        that.setData({
          lock: false,
        })
      },
    })
  
  },
  /**
   * 生命周期函数--监听页面加载
   */
  async onLoad(options) {
    // 获得登录谜号
    var mihao = wx.getStorageSync('mihao');
    this.setData({
      mihao,
    });
    var miti = await this.getTitle();
    var allWork = await this.getAllWorks(miti.zhimiUUID);
    var voteList = await this.getvoteList(miti.zhimiUUID,mihao);
    this.changeAllWork(allWork,voteList);

    //隐藏loading 提示框
    wx.hideLoading();
    //隐藏导航条加载动画
    wx.hideNavigationBarLoading();
    //停止下拉刷新
    wx.stopPullDownRefresh();
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
    //放在onshow中，登录跳转回来就能存入谜号
    var mihao = wx.getStorageSync('mihao');
    this.setData({
      mihao,
    });
    //设置标题栏
    wx.setNavigationBarTitle({
      title: '与虎谋皮',
    });
    wx.setNavigationBarColor({
      backgroundColor: '#3389d9',
      frontColor: '#000000',
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
    })
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