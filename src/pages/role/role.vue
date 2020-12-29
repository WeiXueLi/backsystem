<template>
  <div>
    <el-button type="primary" @click="willAdd()">添加</el-button>
     <v-list :info="info" :list="list" @init="init"  @edit="edit($event)"></v-list>
    <v-add :info="info" :list="list" @init="init($event)" ref="add"></v-add>
   
  </div>
</template>

<script>
import { reqRoleList } from "../../utils/http";
import vAdd from "../role/compontents/add";
import vList from "../role/compontents/list";

export default {
  components: {
    vAdd,
    vList,
  },
  data() {
    return {
      info: {
        isshow: false,
        isadd: true,
      },
     
      list:[]
    };
  },
  methods: {
    willAdd() {
      this.info.isshow = true;
      this.info.isadd = true;
    },
    init() {
      reqRoleList().then((res) => {
        if (res.data.code === 200) {
          this.list = res.data.list;
        }
      });
    },
    edit(id) {
     this.info.isshow=true;
      this.info.isadd=false;

      this.$refs.add.getOne(id)

    }
  },
  mounted() {
    this.init();
  },
};
</script>

<style>
</style>