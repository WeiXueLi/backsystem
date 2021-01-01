<template>
  <div>
    <el-dialog :title="info.isadd?'活动添加':'活动修改'" :visible.sync="info.isshow" @closed="cancel">
      <!-- Form -->
      <el-form :model="user">
        <el-form-item label="活动名称" label-width="100px">
          <el-input v-model="user.title" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 时间 -->
        <el-form-item label="活动期限" label-width="100px">
          <template>
            <div class="block">
              <span class="demonstration"></span>
              <el-date-picker
                v-model="time"
                type="datetimerange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
              ></el-date-picker>
            </div>
          </template>
        </el-form-item>
        <!-- 一级分类 -->
        <el-form-item label="一级分类" label-width="100px">
          <el-select v-model="user.first_cateid" @change="changeFirstCateId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 二级分类 -->
        <el-form-item label="二级分类" label-width="100px">
          <el-select v-model="user.second_cateid" @change="changeSecondCateId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 商品分类 -->
        <el-form-item label="商品" label-width="100px">
          <el-select v-model="user.goodsid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in threeGoodsList"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" label-width="100px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
        {{user}} {{time}}
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
import { mapActions, mapGetters } from "vuex";
import {
  reqGoodsList,
  reqSeckillAdd,
  reqSeckillUpdate,
  reqSeckillDetail,
  reqCateList,
} from "../../../utils/http";
import { successalert, erroralert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      //初始值
      user: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
      //二级分类
      secondCateList: [],
      //三级分类
      threeGoodsList: [],

      //时间戳
      time: [],
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      seckillList: "seckill/list",
    }),
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqList",
      reqList: "goods/reqList",
      reqList: "seckill/reqList",
    }),
    //验证封装方法
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.title === "") {
          erroralert("活动名称不能为空");
          return;
        }
       //时间类型的验证ok,因为time是个数组所以定义成undefined
       console.log(this.time)
        if (this.time[0] === undefined) {
          erroralert("活动期限不能为空");
          return;
        }
 
        if (this.user.first_cateid=== "") {
          erroralert("一级分类不能为空");
          return;
        }

        if (this.user.second_cateid === "") {
          erroralert("二级分类不能为空");
          return;
        }

        if (this.user.goodsid === "") {
          erroralert("商品不能为空");
          return;
        }

        resolve();
      });
    },
    add() {
      this.checkProps().then(() => {
        this.user.begintime = this.time[0];
        this.user.endtime = this.time[1];
        reqSeckillAdd(this.user).then((res) => {
          if (res.data.code == 200) {
            this.cancel();
            this.empty();
            successalert(res.data.msg);
            this.reqList();
          }
        });
      });
    },
    getOne(id) {
      reqSeckillDetail({ id: id }).then((res) => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //补ID
          this.user.id = id;
          //添加时间
          this.time.push(this.user.begintime);
          this.time.push(this.user.endtime);
          //重新获取二级分类的list
          this.getSecondList();
          this.getThreeList();
        }
      });
    },

    //修改一级分类
    changeFirstCateId() {
      this.user.second_cateid = "";
      this.getSecondList();
    },
    //根据一级分类，计算出二级分类的list
    getSecondList() {
      reqCateList({ pid: this.user.first_cateid }).then((res) => {
        if (res.data.code == 200) {
          this.secondCateList = res.data.list;
        }
      });
    },
    //修改二级分类
    changeSecondCateId() {
      this.user.goodname = "";
      this.getThreeList();
    },
    //根据二级分类，计算出三级分类的list
    getThreeList() {
      reqGoodsList({
        fid: this.user.first_cateid,
        sid: this.user.second_cateid,
      }).then((res) => {
        if (res.data.code == 200) {
          this.threeGoodsList = res.data.list;
        }
      });
    },
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    empty() {
      this.time = [];
      this.user = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
      this.secondCateList = [];
      this.threeGoodsList = [];
    },
    update() {
      this.checkProps().then(() => {
        this.user.begintime = this.time[0];
        this.user.endtime = this.time[1];
        reqSeckillUpdate(this.user).then((res) => {
          if (res.data.code == 200) {
            this.cancel();
            this.empty();
            successalert(res.data.msg);
            this.reqList();
          }
        });
      });
    },
  },

  mounted() {
    if (this.cateList.length === 0) {
      this.reqCateList();
    }
  },
};
</script>

  <style scoped>
</style>