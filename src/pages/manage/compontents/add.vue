<template>
  <div>
    <el-dialog :title="info.isadd?'用户添加':'用户修改'" :visible.sync="info.isshow" @closed="cancel">
      <!-- Form -->
      <el-form :model="user">
        <el-form-item label="所属角色" label-width="100px">
          <el-select v-model="user.roleid">
            <el-option label="----请选择----" :value="0" disabled></el-option>
            <el-option
              v-for="item in rolelist"
              :key="item.id"
              :value="item.id"
              :label="item.rolename"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="100px">
          <el-input v-model="user.username" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="100px">
          <el-input v-model="user.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        {{user}}
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isadd">添加</el-button>
        <el-button type="primary" @click="update" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqRoleList,
  reqManageAdd,
  reqManageDetail,
  reqManageUpdate,
} from "../../../utils/http";
import { successalert,erroralert } from "../../../utils/alert";
export default {
  props: ["info", "list"],
  data() {
    return {
      rolelist: [],
      user: {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      },
    };
  },
  methods: {
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        roleid: "",
        username: "",
        password: "",
        status: 1,
      };
    },
    //验证封装方法
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.rolename === "") {
          erroralert("所属角色不能为空");
          return;
        }

        if (this.user.username === "") {
          erroralert("用户名不能为空");
          return;
        }

        if (this.user.password === "") {
          erroralert("密码不能为空");
          return;
        }

        resolve();
      });
    },
    add() {
      this.checkProps().then(() => {
        reqManageAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            this.cancel();
            this.empty();
            this.$emit("init");
          }
        });
      });
    },

    getOne(id) {
      reqManageDetail({ uid: id }).then((res) => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          this.user.password = "";
        }
      });
    },
    update() {
      this.checkProps().then(() => {
        reqManageUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            this.cancel();
            this.empty();
            this.$emit("init");
          }
        });
      });
    },
  },
  mounted() {
    reqRoleList().then((res) => {
      if (res.data.code === 200) {
        this.rolelist = res.data.list;
      }
    });
  },
};
</script>

<style>
</style>