<template>
  <div>
    <el-table
      :data="list"
      style="width: 100%;margin-bottom: 20px;"
      row-key="id"
      border
      default-expand-all
      :tree-props="{children: 'children'}"
    >
      <el-table-column prop="id" label="角色编号" sortable width="180"></el-table-column>
      <el-table-column prop="rolename" label="角色名称" sortable width="180"></el-table-column>
      <el-table-column label="状态">
        <el-button type="primary">启用</el-button>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary"  @click="edit(scope.row.id)">编辑</el-button>
         <del-btn @confirm="del(scope.row.id)"></del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
import {reqRoleDel,reqRoleList} from "../../../utils/http"
import {successalert} from "../../../utils/alert"
export default {
  props: ["list"],
  methods:{
    del(id){
        reqRoleDel({id:id}).then((res)=>{
          this.$emit("init")
        }).catch(()=>{})
    },
    edit(id){
      this.$emit("edit",id);
    },
   

  }
};
</script>

<style>
</style>