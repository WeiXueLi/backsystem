import Vue from "vue"
import Vuex from "vuex"
Vue.use(Vuex)
import {actions} from "./actions"
import {state,getters,mutations} from "./mutations"
import cate from "./modules/cate"
import specs from "./modules/specs"
import banner from "./modules/banner"
import goods from "./modules/goods"
import seckill from "./modules/seckill"
export default new Vuex.Store({
    state,
    getters,
    mutations,
    actions,
    modules:{
        cate,
        specs,
        banner,
        goods,
        seckill
    }
})