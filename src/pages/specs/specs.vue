<template>
  <div>
    <el-button type="primary" @click="willAdd()">添加</el-button>
    <v-list :list="list" @edit="edit($event)"></v-list>
    <v-add :info="info" :list="list" ref="add"></v-add>
  </div>
</template>

<script>
import vList from "./compontents/list";
import vAdd from "./compontents/add";
export default {
  data() {
    return {
      info: {
        isshow: false,
        isadd: true,
      },
      list: [],  
    };
  },
  components: {
    vList,
    vAdd,
  },
  methods: {
    willAdd() {
      this.info.isshow = true;
      this.info.isadd = true;
    },
   
    edit(id) {
      this.info.isshow = true;
      this.info.isadd = false;
      this.$refs.add.getOne(id);
    }, 
  },
  mounted() {},
};
</script>

<style>
</style>