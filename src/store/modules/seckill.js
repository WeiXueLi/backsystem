import {reqSeckillList} from "../../utils/http"
let state={
    //1.初始化
    list:[]
}
let mutations={
    //2.修改list
    changeList(state,arr) {
        state.list=arr;
    }
}
let getters={
    //导出list
    list(state){
        return state.list;
    }

}
let actions={
    reqList(context){
        reqSeckillList().then(res=>{
            if(res.data.code==200){
                context.commit("changeList",res.data.list)
            }
        })
    }
}

export default {
    state,
    mutations,
    actions,
    getters,
    namespaced:true
}