<template>
  <div>
    <el-button type="primary" @click="willAdd()">添加</el-button>
    <v-list :list="list" @init="init" @edit="edit($event)"></v-list>
    <v-add :info="info" @init="init" :list="list" ref="add"></v-add>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import vList from "./compontents/list";
import vAdd from "./compontents/add";
import { reqManageCount, reqManageList } from "../../utils/http";
export default {
  data() {
    return {
      info: {
        isshow: false,
        isadd: true,
      },
      list: [],
      pageSize: 2,
      total: 0,
      page: 1,
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
    init() {
       this.getTotal();
      this.getList();
      reqManageList({ page: 1, size: 50 }).then((res) => {
        if (res.data.code === 200) {
          this.list = res.data.list;
        }
      });
     
    },

    edit(id) {
      this.info.isshow = true;
      this.info.isadd = false;
      this.$refs.add.getOne(id);
    },
    getTotal() {
      reqManageCount().then((res) => {
        if (res.data.code == 200) {
          this.total = res.data.list[0].total;
        }
      });
    },
    getList() {
      reqManageList({page: this.page,size: this.pageSize}).then((res) => {
        if (res.data.code == 200) {
          if (res.data.list.length == 0 && this.page > 1) {
            this.page--;
            this.getList();
            return;
          }
          this.list = res.data.list;
        }
      });
    },
    changePage(e) {
      this.page = e;
      this.getList();
    },
  },
  mounted() {
    this.init();
    this.changePage(1);
  },
};
</script>

<style>
</style>