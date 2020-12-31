<template>
  <div>
    <el-dialog :title="info.isadd?'规格添加':'规格修改'" :visible.sync="info.isshow" @closed="cancel">
      <!-- Form -->
      <el-form :model="user">
        <el-form-item label="规格名称" label-width="100px">
          <el-input v-model="user.specsname" autocomplete="off"></el-input>
        </el-form-item>

        <el-form-item
          label="规格属性"
          label-width="100px"
          v-for="(item,index) in attrsArr"
          :key="index"
        >
          <div class="my">
            <el-input class="myinput" v-model="item.value"></el-input>
            <el-button type="primary" class="mybtn" v-if="index==0" @click="addAttr">新增规格属性</el-button>
            <el-button type="danger" class="mybtn" v-else @click="delAttr(index)">删除</el-button>
          </div>
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
import path from "path";
import { mapActions, mapGetters } from "vuex";
import {
  reqSpecsAdd,
  reqSpecsDetail,
  reqSpecsUpdate,
} from "../../../utils/http";
import { erroralert, successalert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      imgUrl: "",
      user: {
        specsname: "",
        attrs: "[]",
        status: 1,
      },
      attrsArr: [{ value: "" }],
    };
  },

  computed: {
    ...mapGetters({
      list: "specs/list",
      total: "specs/total",
      size: "specs/size",
    }),
  },
  methods: {
    ...mapActions({
      reqList: "specs/reqList",
      reqTotal: "specs/reqTotal",
      changePage: "specs/changePage",
    }),
    //取消
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    //新增属性
    addAttr() {
      this.attrsArr.push({ value: "" });
    },
    //删除属性
    delAttr(index) {
      this.attrsArr.splice(index, 1);
    },
    //清空
    empty() {
      this.user = {
        specsname: "",
        attrs: "[]",
        status: 1,
      };
      this.attrsArr = [{ value: "" }];
    },
    //验证封装方法
    checkProps() {
      return new Promise(resolve => {
        if (this.user.specsname === "") {
          erroralert("规格名称不能为空");
          return;
        }
        if (this.attrsArr.some(item => item.value === "")) {
          erroralert("请输入所有的规格属性");
          return;
        }
        resolve();
      });
    },

    //点了添加
    add() {
      this.checkProps().then(() => {
        this.user.attrs = JSON.stringify(
          this.attrsArr.map((item) => item.value)
        );
        //发请求
        reqSpecsAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            this.cancel();
            this.empty();
            successalert(res.data.msg);
            this.reqList();
            this.reqTotal();
          }
        });
      });
    },
    getOne(id) {
      reqSpecsDetail({ id: id }).then((res) => {
        if (res.data.code == 200) {
          this.user = res.data.list[0];
          this.user.attrs = JSON.parse(this.user.attrs);

          this.attrsArr = this.user.attrs.map((item) => ({ value: item }));
        }
      });
    },
    update() {
      this.checkProps().then(() => {
        this.user.attrs = JSON.stringify(this.attrs.map((item) => item.value));
        reqSpecsUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            successalert(res.data.msg);
            this.cancel();
            this.empty();
            this.reqList();
          }
        });
      });
    },
  },
  mounted() {},
};
</script>

<style scoped>
.my {
  display: flex;
}
.my .mybtn {
  width: auto;
}
.my .myinput {
  flex: 1;
}
</style>