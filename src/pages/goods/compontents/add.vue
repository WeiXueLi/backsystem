<template>
  <div>
    <el-dialog
      :title="info.isadd?'添加商品':'编辑商品'"
      :visible.sync="info.isshow"
      @closed="cancel"
      @opened="opened"
    >
      <!-- 2.v-model绑定user -->
      <el-form :model="user">
        {{user}}
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
        <el-form-item label="二级分类" label-width="100px">
          <el-select v-model="user.second_cateid">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in secondCateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" label-width="100px">
          <el-input v-model="user.goodsname"></el-input>
        </el-form-item>
        <el-form-item label="价格" label-width="100px">
          <el-input v-model="user.price"></el-input>
        </el-form-item>
        <el-form-item label="市场价格" label-width="100px">
          <el-input v-model="user.market_price"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="100px">
          <div class="my-upload">
            <div class="add">+</div>
            <img v-if="imgUrl" class="img" :src="imgUrl" alt />
            <input v-if="info.isshow" type="file" class="ipt" @change="changeImg" />
          </div>
        </el-form-item>
        <el-form-item label="商品规格" label-width="100px">
          <el-select v-model="user.specsid" @change="changeSpecsId">
            <el-option label="--请选择--" value disabled></el-option>
            <el-option
              v-for="item in specsList"
              :key="item.id"
              :label="item.specsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="规格属性" label-width="100px">
          <el-select v-model="user.specsattr" multiple>
            <el-option label="--请选择--" value disabled></el-option>
            <el-option v-for="item in showSpecsAttr" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="是否新品" label-width="100px">
          <el-radio v-model="user.isnew" :label="1">是</el-radio>
          <el-radio v-model="user.isnew" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否热卖" label-width="100px">
          <el-radio v-model="user.ishot" :label="1">是</el-radio>
          <el-radio v-model="user.ishot" :label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="状态" label-width="100px">
          <el-switch v-model="user.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>

        <!-- 富文本编辑器 -->
        <el-form-item label="商品描述" label-width="100px">
          <!-- 富文本编辑器 -->
          <div id="editor" v-if="info.isshow"></div>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isadd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
  <script>
import E from "wangeditor";
import { mapActions, mapGetters } from "vuex";
import {
  reqGoodsList,
  reqGoodsAdd,
  reqCateList,
  reqGoodsUpdate,
  reqGoodsDetail
} from "../../../utils/http";
import { erroralert, successalert } from "../../../utils/alert";
export default {
  props: ["info"],
  data() {
    return {
      imgUrl: "",
      user: {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //字符串类型的数组
        isnew: 1,
        ishot: 1,
        status: 1,
      },
      secondCateList: [],
      showSpecsAttr: [],
    };
  },
  computed: {
    ...mapGetters({
      cateList: "cate/list",
      specsList: "specs/list",
    }),
  },
  methods: {
    ...mapActions({
      reqCateList: "cate/reqList",
      reqSpecsList: "specs/reqList",
      reqList: "goods/reqList",
      reqTotal: "goods/reqTotal",
    }),
    //验证封装方法
    checkProps() {
      return new Promise((resolve, reject) => {
        if (this.user.first_cateid === "") {
          erroralert("一级分类不能为空");
          return;
        }

        if (this.user.second_cateid === "") {
          erroralert("二级分类不能为空");
          return;
        }

        if (this.user.goodsname === "") {
          erroralert("商品名称不能为空");
          return;
        }

        if (this.user.price === "") {
          erroralert("商品价格不能为空");
          return;
        }

        if (this.user.market_price === "") {
          erroralert("商品市场价格不能为空");
          return;
        }

        if (!this.user.img) {
          erroralert("请上传图片");
          return;
        }

        if (this.user.specsList === "") {
          erroralert("商品规格不能为空");
          return;
        }

        if (this.user.specsattr.length === "") {
          erroralert("请选择规格属性");
          return;
        }

        if (this.editor.txt.html() === "") {
          erroralert("请输入商品描述");
          return;
        }
        resolve();
      });
    },

    opened() {
      //创建编辑器
      this.editor = new E("#editor");
      this.editor.create();
      //赋值
      this.editor.txt.html(this.user.description);
    },
    add() {
      this.checkProps().then(() => {
        this.user.description = this.editor.txt.html();
        let data = {
          ...this.user,
          specsattr: JSON.stringify(this.user.specsattr),
        };
        reqGoodsAdd(data).then((res) => {
          if (res.data.code == 200) {
            this.cancel();
            this.empty();
            successalert(res.data.msg);
          }
        });
      });
    },
    changeImg(e) {
      let file = e.target.files[0];
      this.imgUrl = URL.createObjectURL(file);
      this.user.img = file;
    },
    cancel() {
      if (!this.info.isadd) {
        this.empty();
      }
      this.info.isshow = false;
    },
    empty() {
      this.user = {
        first_cateid: "",
        second_cateid: "",
        goodsname: "",
        price: "",
        market_price: "",
        img: null,
        description: "",
        specsid: "",
        specsattr: [], //后端要的是数组字符串，所以在发请求之前，需要JSON.stringify()
        isnew: 1,
        ishot: 1,
        status: 1,
      };
      this.imgUrl = "";
      //二级分类的列表
      this.secondCateList = [];
      // 规格属性展示的所有选项的列表
      this.showSpecsAttr = [];
    },
  
    getOne(id) {
      console.log(id)
      reqGoodsDetail({ id: id }).then((res) => {
        if (res.data.code == 200) {
          this.user = res.data.list;
          //重新获取二级分类的list
          this.getSecondList();
          this.imgUrl = this.$pre + this.user.img;
          //规格属性展示list
          this.getShowSpecsAttr();
          //规格属性选中的list
          this.user.specsattr = JSON.parse(this.user.specsattr);
          this.user.id = id;
          if (this.editor) {
            this.editor.txt.html(this.user.description);
          }
        }
      });
    },
      update() {
      this.checkProps().then(() => {
        this.user.description = this.editor.txt.html();
        let data = {
          ...this.user,
          specsattr: JSON.stringify(this.user.specsattr),
        };
        reqGoodsUpdate(data).then((res) => {
          if (res.data.code == 200) {
            this.cancel();
            this.empty();
            successalert(res.data.msg);
            this.reqList();
          }
        });
      });
    },
    //修改一级分类
    changeFirstCateId() {
      this.user.second_cateid = "";
     this.getSecondList();
    },
     //根据一级分类，计算出二级分类的list
    getSecondList() {
      reqCateList({ pid: this.user.first_cateid }).then(res => {
        if (res.data.code == 200) {
          this.secondCateList = res.data.list;
        }
      });
    },
    //规格改变
    changeSpecsId() {
      this.user.specsattr = [];
     this.getShowSpecsAttr();
    },
    //获取规格属性的展示列表
    getShowSpecsAttr() {
      let obj = this.specsList.find(item => item.id == this.user.specsid); 
      this.showSpecsAttr = obj ? obj.attrs : [];
    },

  },
  mounted() {
    if (this.cateList.length === 0) {
      this.reqCateList();
    }
    this.reqSpecsList(true);
  },
};
</script>

<style scoped>
.my-upload {
  width: 100px;
  height: 100px;
  border: 1px dashed #999;
  position: relative;
}
.my-upload .add {
  width: 100px;
  height: 100px;
  text-align: center;
  line-height: 100px;
  font-size: 30px;
  color: #666;
}
.my-upload .ipt {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
  cursor: pointer;
}
img {
  width: 100px;
  height: 100px;
  position: absolute;
  left: 0;
  top: 0;
}
</style>