<template>
  <div>
      <el-button type="primary" @click="willAdd()">添加</el-button>
      <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
      <v-add :info="info"  @init="init" :list="list" ref="add" ></v-add>
  </div>
</template>

<script>
import vList from "./compontents/list"
import vAdd from "./compontents/add"
import {reqMenuList} from "../../utils/http"
export default {
  data(){
    return {
      info:{
       isshow:false,
       isadd:true
      },
      list:[],
    } 
  },
components:{
    vList,
    vAdd
},
methods:{
    willAdd(){
      this.info.isshow=true;
      this.info.isadd=true;
    },
    init(){
      reqMenuList().then(res=>{
     if(res.data.code===200){
       this.list=res.data.list;
     }
      })
    },
  
    edit(id){
      this.info.isshow=true;
      this.info.isadd=false;
      this.$refs.add.getOne(id)
    }
},
mounted(){
  this.init()
}
}
</script>

<style>

</style>