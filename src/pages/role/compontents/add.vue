<template>
  <div>
    <el-dialog :title="info.isadd?'添加角色':'编辑角色'" :visible.sync="info.isshow" @closed="cancel">
      {{user}}
      <el-form :model="user">
        <el-form-item label="角色名称" label-width="100px">
          <el-input v-model="user.rolename" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item label="角色权限" label-width="100px">
          <el-tree :data="menulist" show-checkbox node-key="id" ref="tree" :props="defaultProps"></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button @click="add" v-if="info.isadd">添加</el-button>
        <el-button type="primary" @click="update" v-else>修改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  reqMenuList,
  reqRoleAdd,
  reqRoleDetail,
  reqRoleUpdate,
} from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";
export default {
  props: ["info", "list"],

  data() {
    return {
      menulist: [],
      user: {
        rolename: "",
        menus: "",
        status: 1,
      },

      value: true,
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },

  methods: {
    //验证封装方法
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.rolename === "") {
          erroralert("角色名称不能为空");
          return;
        }
        resolve();
      });
    },
    add() {
      this.checkProps().then(() => {
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            this.empty();
            this.$emit("init");
          }
        });
      });
    },
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        rolename: "",
        menus: "",
        status: 1,
      };
      this.$refs.tree.setCheckedKeys([]);
    },
    getOne(id) {
      reqRoleDetail({ id: id }).then((res) => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          this.user.id = id;

          this.$refs.tree.setCheckedKeys(JSON.parse(this.user.menus));
        }
      });
    },

    update() {
      this.checkProps().then(() => {
        this.info.isshow = false;
        this.user.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
        reqRoleUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            if (this.user.id == this.userInfo.roleid) {
              this.changeUser({});
              this.$router.push("/login");
              return;
            }
            this.cancel();
            this.empty();
            this.$emit("init");
          }
        });
      });
    },
  },
  mounted() {
    reqMenuList(this.menulist).then((res) => {
      if (res.data.code === 200) {
        this.menulist = res.data.list;
      }
    });
  },
};
</script>

<style>
</style>



