<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      :tree-props="{children: 'children'}"
    >
      <!-- :tree-props="{children: 'child'} 用来判断是否有下一层-->
      <el-table-column prop="id" label="用户编号" sortable width="180"></el-table-column>
      <el-table-column prop="username" label="用户名" sortable width="180"></el-table-column>
      <el-table-column prop="rolename" label="所属角色">
       
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status===1">启用</el-button>
          <el-button type="primary" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
         <template slot-scope="scope">
        <el-button type="primary" @click="edit(scope.row.uid)">编辑</el-button>
        <del-btn @confirm="del(scope.row.uid)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import { reqManageDel,reqManageList } from "../../../utils/http";
import { successalert } from "../../../utils/alert";
export default {
  props: ["list"],
 
  methods: {
    del(uid) {
          reqManageDel({ uid: uid }).then((res) => {
            if (res.data.code === 200) {
              successalert(res.data.msg);
              this.$emit("init");
            }
        }).catch(() => {});
    },
    edit(id) {
      this.$emit("edit", id);
    },
  },
};
</script>

<style>
</style>