import axios from "axios"
import qs from "qs"
import Vue from "vue"
import router from "../router"
import {
  erroralert
} from "./alert"
import store from "../store"
// import {successalert} from "./alert"
//开发环境使用 8080
let baseUrl = "/api"
Vue.prototype.$pre = "http://localhost/:3000"
//  Vue.prototype.$pre = "http://10.10.18.49:3000"
//生产环境  3000  打包
// let baseUrl = ""
// Vue.prototype.$pre = ""

//请求拦截，设置请求头
axios.interceptors.request.use(config => {
  if (config.url !== baseUrl + "/api/userlogin") {
    config.headers.authorization = store.state.userInfo.token
  }
  return config
})

//响应拦截
axios.interceptors.response.use(res => {
  console.group("本次请求地址是：" + res.config.url)
  console.log(res);
  console.groupEnd()
  //失败处理
  if (res.data.code !== 200) {
    erroralert(res.data.msg)
  }
  //统一处理list是null的情况
  if (!res.data.list) {
    res.data.list = []
  }
//登录时间限制
  if (res.data.msg === "登录已过期或访问权限受限") {
    //清除用户登录的信息 userInfo
    store.dispatch("changeUser", {})
    //跳到登录页面
    router.push("/login")
  }
  return res
})



//登录接口
export let reqLogin = (user) => {
  return axios({
    url: baseUrl + "/api/userlogin",
    method: "post",
    data: qs.stringify(user)
  })
}


//菜单管理
//菜单添加接口
export const reqMenuAdd = (user) => {
  return axios({
    url: baseUrl + "/api/menuadd",
    method: "post",
    data: qs.stringify(user)
  })
}

//菜单列表接口
export let reqMenuList = () => {
  return axios({
    url: baseUrl + "/api/menulist",
    params: {
      istree: true
    }
  })
}

//菜单删除接口
export let reqMenuDel = (obj) => {
  return axios({
    url: baseUrl + "/api/menudelete",
    method: "post",
    data: qs.stringify(obj)
  })
}

//获取一条菜单接口
export let reqMenuDetail = (obj) => {
  return axios({
    url: baseUrl + "/api/menuinfo",
    method: "get",
    params: obj
  })
}

//菜单修改接口
export let reqMenuUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/menuedit",
    method: "post",
    data: qs.stringify(user)
  })
}

//角色管理
//角色添加接口
export let reqRoleAdd = (user) => {
  return axios({
    url: baseUrl + "/api/roleadd",
    method: "post",
    data: qs.stringify(user)
  })
}

//角色列表接口
export let reqRoleList = () => {
  return axios({
    url: baseUrl + "/api/rolelist",


  })
}

//角色一条数据获取接口
export let reqRoleDetail = (user) => {
  return axios({
    url: baseUrl + "/api/roleinfo",
    method: "get",
    params: user

  })
}

//角色修改接口
export let reqRoleUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/roleedit",
    method: "post",
    data: qs.stringify(user)
  })
}
//角色删除接口
export let reqRoleDel = (user) => {
  return axios({
    url: baseUrl + "/api/roledelete",
    method: "post",
    data: qs.stringify(user)
  })
}

//管理员管理 
//管理员添加接口
export let reqManageAdd = (user) => {
  return axios({
    url: baseUrl + "/api/useradd",
    method: "post",
    data: qs.stringify(user)
  })
}

//管理员列表接口
export let reqManageList = (obj) => {
  return axios({
    url: baseUrl + "/api/userlist",
    method: "get",
    params: obj

  })
}

//管理员获取一条
export let reqManageDetail = (user) => {
  return axios({
    url: baseUrl + "/api/userinfo",
    method: "get",
    params: user
  })
}

//管理员修改接口
export let reqManageUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/useredit",
    method: "post",
    data: qs.stringify(user)
  })
}

//管理员删除接口
export let reqManageDel = (user) => {
  return axios({
    url: baseUrl + "/api/userdelete",
    method: "post",
    data: qs.stringify(user)
  })
}

//管理列表分页接口
export let reqManageCount = () => {
  return axios({
    url: baseUrl + "/api/usercount",
  })
}

//管理员登录接口
export let reqManageLogin = () => {
  return axios({
    url: baseUrl + "/api/userlogin",

  })
}

//post带有文件，参数转换
function dataToFormData(user) {
  let data = new FormData()
  for (let i in user) {
    data.append(i, user[i])
  }
  return data
}

//商品分类
//商品分类添加接口
export let reqCateAdd = (user) => {
  return axios({
    url: baseUrl + "/api/cateadd",
    method: "post",
    data: dataToFormData(user)
  })
}

//商品分类列表接口
export let reqCateList = (obj) => {
  return axios({
    url: baseUrl + "/api/catelist",
    method: "get",
    params: obj

  })
}

//商品分类获取一条
export let reqCateDetail = (user) => {
  return axios({
    url: baseUrl + "/api/cateinfo",
    method: "get",
    params: user
  })
}

//商品分类修改接口
export let reqCateUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/cateedit",
    method: "post",
    data: dataToFormData(user)
  })
}

//商品分类删除接口
export let reqCateDel = (user) => {
  return axios({
    url: baseUrl + "/api/catedelete",
    method: "post",
    data: qs.stringify(user)
  })
}

//轮播图管理
//轮播图添加接口
export let reqBannerAdd = (user) => {
  return axios({
    url: baseUrl + "/api/banneradd",
    method: "post",
    data: dataToFormData(user)
  })
}

//轮播图列表接口
export let reqBannerList = (obj) => {
  return axios({
    url: baseUrl + "/api/bannerlist",
    method: "get",
    params: obj

  })
}

//轮播图获取一条
export let reqBannerDetail = (user) => {
  return axios({
    url: baseUrl + "/api/bannerinfo",
    method: "get",
    params: user
  })
}

//轮播图修改接口
export let reqBannerUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/banneredit",
    method: "post",
    data: dataToFormData(user)
  })
}

//轮播图删除接口
export let reqBannerDel = (user) => {
  return axios({
    url: baseUrl + "/api/bannerdelete",
    method: "post",
    data: qs.stringify(user)
  })
}

//会员管理
//会员列表接口
export let reqMemberList = (obj) => {
  return axios({
    url: baseUrl + "/api/memberlist",
    method: "get",
    params: obj

  })
}

//会员获取一条
export let reqMemberDetail = (user) => {
  return axios({
    url: baseUrl + "/api/memberinfo",
    method: "get",
    params: user
  })
}

//会员修改
export let reqMemberUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/memberedit",
    method: "post",
    data: qs.stringify(user)
  })
}

//商品规格
//商品规格添加接口
export let reqSpecsAdd = (user) => {
  return axios({
    url: baseUrl + "/api/specsadd",
    method: "post",
    data: qs.stringify(user)
  })
}

//商品规格总数接口
export let reqSpecsCount = () => {
  return axios({
    url: baseUrl + "/api/specscount",


  })
}

//商品规格列表接口
export let reqSpecsList = (obj) => {
  return axios({
    url: baseUrl + "/api/specslist",
    method: "get",
    params: obj
  })
}

//商品规格获取一条接口
export let reqSpecsDetail = (user) => {
  return axios({
    url: baseUrl + "/api/specsinfo",
    method: "get",
    params: user
  })
}

//商品规格修改接口
export let reqSpecsUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/specsedit",
    method: "post",
    data: qs.stringify(user)
  })
}

//商品规格删除接口
export let reqSpecsDel = (user) => {
  return axios({
    url: baseUrl + "/api/specsdelete",
    method: "post",
    data: qs.stringify(user)
  })
}

//商品管理
//商品管理添加接口
export let reqGoodsAdd = (user) => {
  return axios({
    url: baseUrl + "/api/goodsadd",
    method: "post",
    data: dataToFormData(user)
  })
}

//商品管理列表接口
export let reqGoodsList = (obj) => {
  return axios({
    url: baseUrl + "/api/goodslist",
    method: "get",
    params: obj

  })
}

//商品管理获取一条
export let reqGoodsDetail = (user) => {
  return axios({
    url: baseUrl + "/api/goodsinfo",
    method: "get",
    params: user
  })
}

//商品管理修改接口
export let reqGoodsUpdate = (user) => {
  return axios({
    url: baseUrl + "/api/goodsedit",
    method: "post",
    data: dataToFormData(user)
  })
}

//商品管理删除接口
export let reqGoodsDel = (user) => {
  return axios({
    url: baseUrl + "/api/goodsdelete",
    method: "post",
    data: qs.stringify(user)
  })
}

//商品管理分页接口
export let reqGoodsCount = () => {
  return axios({
    url: baseUrl + "/api/goodscount"
  })
}

//限时秒杀活动管理
//限时秒杀添加接口
export let reqSeckillAdd = (user)=>{
  return axios({
    url:baseUrl+"/api/seckadd",
    method:"post",
    data:qs.stringify(user)
  })
} 

//限时秒杀列表接口
export let reqSeckillList = (user)=>{
  return axios({
    url:baseUrl+"/api/secklist",
    method:"get",
    params:user
  })
} 

//限时秒杀获取接口
export let reqSeckillDetail = (user)=>{
  return axios({
    url:baseUrl+"/api/seckinfo",
    method:"get",
    params:user
  })
} 

//限时秒杀修改接口
export let reqSeckillUpdate = (user)=>{
  return axios({
    url:baseUrl+"/api/seckedit",
    method:"post",
    data:qs.stringify(user)
  })
} 

//限时秒杀删除接口
export let reqSeckillDel = (user)=>{
  return axios({
    url:baseUrl+"/api/seckdelete",
    method:"post",
    data:qs.stringify(user)
  })
} 