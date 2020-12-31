<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
    >
      <el-table-column prop="title" label="活动名称" sortable width="180"></el-table-column>
     
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="primary" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
  <script>
import { mapActions, mapGetters } from "vuex";
import {reqSeckillDel} from "../../../utils/http"
import {successalert} from "../../../utils/alert"
export default {
  props:["info"],
  data() {
    return {};
  },
  computed: {
    ...mapGetters({
      list: "seckill/list",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "seckill/reqList",
    }),
   del(id){
        reqSeckillDel({id:id}).then(res=>{
            if(res.data.code==200){
                successalert(res.data.msg);
                this.reqList();
                
            }
        })
    },
    edit(id) {
        this.$emit("edit",id);
    }
  },
  mounted() {
     this.reqList();
  },
};
</script>

  <style scoped>
</style>