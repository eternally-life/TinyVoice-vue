<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="用户id" prop="userId">
        <el-input
          v-model="queryParams.userId"
          placeholder="请输入用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键词"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="微音ID" prop="targetId">
        <el-input
          v-model="queryParams.targetId"
          placeholder="请输入微音ID"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-select v-model="queryParams.isShow"  placeholder="请选择">
          <el-option value="显示">
          </el-option>
            <el-option value="不显示">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="微音类型" prop="type">
        <el-select v-model="queryParams.type"  placeholder="请选择">
          <el-option
            v-for="item in dict.type.tiny_bbs_type"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="排序类型" prop="sort">
        <el-select v-model="queryParams.sort"  placeholder="请选择">
          <el-option
            v-for="item in dict.type.tiny_bbs_sort"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="近期天数" prop="screenTime">
        <el-input
          v-model="queryParams.screenTime"
          placeholder="请输入近期天数"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['${moduleName}:bbs:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['${moduleName}:bbs:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['${moduleName}:bbs:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['${moduleName}:bbs:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="bbsList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="帖子编号" align="center" prop="bbsId" />
      <el-table-column label="用户编号" align="center" prop="userId" />
      <el-table-column label="账号" align="center" prop="userName" />
      <el-table-column label="昵称" align="center" prop="nickName" />
      <el-table-column label="用户头像链接" align="center" prop="avatar">
        <template slot-scope="scope">
          <!-- <div  @click="temp(scope.row)">  <image-preview :src="scope.row.avatar" :width="50" :height="50"/></div> -->
      <img :src="scope.row.avatar" :width="50" :height="50"/>
        

        </template>
      </el-table-column>
      <el-table-column :filters="dict.type.tiny_bbs_type"
                      :filter-method="filterHandler"
                      label="微音类型" align="center" prop="type">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tiny_bbs_type" :value="scope.row.type"/>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="微音内容" align="center" prop="content" >
      <template slot-scope="scope">
        <div v-text="scope.row.content">
          <!-- {{scope.row.content}} -->
        </div>
      </template>
      </el-table-column>
      <!-- <el-table-column sortable label="热度值" align="center" prop="hotNum" /> -->
       <el-table-column sortable label="热度值" align="center" prop="hotNum" >
          <template slot-scope="scope">
          <div class="cell-input-wrap">
            <el-input v-if="editdes === scope.row.bbsId+'hotNum'" v-model.lazy ="scope.row.hotNum"  @blur="levelDesIt(scope.row)" ></el-input>
                <div v-else @click="switchDesState(scope.row,'hotNum')" class="default-span">{{scope.row.hotNum}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column sortable label="点赞量" align="center" prop="likeNum" >
          <template slot-scope="scope">
          <div class="cell-input-wrap">
            <el-input v-if="editdes === scope.row.bbsId+'likeNum'" v-model.lazy ="scope.row.likeNum"  @blur="levelDesIt(scope.row)" ></el-input>
                <div v-else @click="switchDesState(scope.row,'likeNum')" class="default-span">{{scope.row.likeNum}}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column sortable label="回复量" align="center" prop="replyNum" /> -->
            <el-table-column sortable label="回复量" align="center" prop="replyNum" >
          <template slot-scope="scope">
          <div class="cell-input-wrap">
            <el-input v-if="editdes === scope.row.bbsId+'replyNum'" v-model="scope.row.replyNum"  @blur="levelDesIt(scope.row)" ></el-input>
                <div v-else @click="switchDesState(scope.row,'replyNum')" class="default-span">{{scope.row.replyNum}}</div>
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column sortable label="浏览量" align="center" prop="pageView" /> -->
       <el-table-column sortable label="浏览量" align="center" prop="pageView" >
          <template slot-scope="scope">
          <div class="cell-input-wrap">
            <el-input v-if="editdes === scope.row.bbsId+'pageView'" v-model="scope.row.pageView"  @blur="levelDesIt(scope.row)" ></el-input>
                <div v-else @click="switchDesState(scope.row,'pageView')" class="default-span">{{scope.row.pageView}}</div>
          </div>
        </template>
      </el-table-column>
      <el-table-column :filters="dict.type.common_is_show"
                      :filter-method="filterHandler"
                      label="是否显示" align="center" prop="isShow">
        <template slot-scope="scope">
          <p>
            <el-switch
              @change="handleIsShowChange(scope.$index, scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isShow">
            </el-switch>
          </p>
        </template>
      </el-table-column>
      <el-table-column :filters="dict.type.tiny_bbs_is_book"
                      :filter-method="filterHandler"
                      label="是否书籍" align="center" prop="isBook" />
      <el-table-column sortable label="价格(分)" align="center" prop="price" />
      <el-table-column label="联系方式" align="center" prop="contact" />
      <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-zoom-in"
            @click="handleCheck(scope.row)"
            v-hasPermi="['${moduleName}:bbs:edit']"
          >查看帖子</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['${moduleName}:bbs:edit']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['${moduleName}:bbs:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <el-drawer
      :title="drawerTitle"
      :visible.sync="drawer"
      direction="ltr">
      <div class="demo-drawer__content">
        <el-card class="box-card">
          <el-row>
            <el-col :span="10">昵称：{{bbsForm.nickName}}({{bbsForm.userName}})</el-col>
            <el-col :span="4" :offset="10"><image-preview :src="bbsForm.avatar" :width="50" :height="50"/></el-col>
          </el-row>
          <el-divider><dict-tag :options="dict.type.tiny_bbs_type" :value="bbsForm.type"/></el-divider>
          <el-row>
          <el-col v-html="bbsForm.content" :span="24">
            <!-- {{bbsForm.content}} -->
            </el-col>
          </el-row>
          <el-divider>附图</el-divider>
          <el-row>
            <el-col :span="24"><image-preview v-for="img in bbsForm.imgList" :src="img.url" :width="50" :height="50"/></el-col>
          </el-row>
          <el-divider v-if="bbsForm.isBook === 1"></el-divider>
          <el-row>
            <el-col :span="24">
              <p v-if="bbsForm.isBook === 1">价格：{{bbsForm.price}}</p>
              <p v-if="bbsForm.isBook === 1">联系方式：{{bbsForm.contact}}</p>
            </el-col>
        </el-row>
        <el-row type="flex" class="row-bg" justify="end">
          <el-col :span="7">
            <div class="icon-btn">
            <i class="el-icon-view" />
            {{ bbsForm.hotNum }}
            <i class="el-icon-chat-dot-square" />
            {{ bbsForm.replyNum }}
            <i v-if="bbsForm.likeEd === true" class="iconfont el-icon-star-on " />
            <i v-else class="iconfont el-icon-star-off" />
            {{ bbsForm.likeNum }}
            </div>
          </el-col>
        </el-row>
        </el-card>
        <el-divider v-if="bbsForm.replyList != null">回复</el-divider>
        <el-card v-for="item in bbsForm.replyList" class="box-card">
          <div slot="header" class="clearfix">
            <span>来自{{item.nickName}}({{item.userId}})的回复：</span>
          </div>
          <div class="text item">
            内容：{{item.content}}
          </div>
          <div class="text item">
            <P>附图：<image-preview v-for="img in item.imgList" :src="img.url" :width="50" :height="50"/></P>
          </div>
          <el-card v-if="item.item !=null" v-for="item in item.replyList" class="box-card">
            <div slot="header" class="clearfix">
              <span>来自{{item.nickName}}({{item.userId}})的回复：</span>
            </div>
            <div class="text item">
              内容：{{item.content}}
            </div>
            <div class="text item">
              <P>附图：<image-preview v-for="img in item.imgList" :src="img.url" :width="50" :height="50"/></P>
            </div>
          </el-card>
        </el-card>
      </div>
    </el-drawer>

    <!-- 添加或修改微音论坛对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="微音类型" prop="type">
          <el-select @change="typeChang" v-model="form.type" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.tiny_bbs_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微音内容文本" prop="content">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入昵称" />
        </el-form-item>
        <el-form-item label="用户头像" prop="avatar">
          <image-upload v-model="form.avatar"/>
        </el-form-item>
        <el-form-item label="点赞数量" prop="likeNum">
          <el-input v-model="form.likeNum" placeholder="请输入点赞数量" />
        </el-form-item>
        <el-form-item label="是否书籍" prop="isBook">
          <el-select v-model="form.isBook" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.tiny_bbs_is_book"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-show="typeChangShow" label="价格" prop="price">
          <el-input v-model="form.price" placeholder="请输入价格-二手市场字段-单位元" />
        </el-form-item>
        <el-form-item v-show="typeChangShow" label="联系方式" prop="contact">
          <el-input v-model="form.contact" placeholder="请输入联系方式-二手市场,失物招领字段" />
        </el-form-item>
        <el-form-item label="图片列表" prop="imgList">
          <image-upload v-model="form.imgList"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  monitorTinybbsAudit_Post,
  monitorTinybbsDelete_Delete,
  monitorTinybbsPage_Get,
  monitorTinybbsSave_Post,
  monitorTinybbsUpdate_Post
} from "@/api/微音论坛通过";

export default {
  name: "Bbs",
  dicts: ['common_is_show','tiny_bbs_is_book','tiny_bbs_type','tiny_bbs_sort'],
  data() {
    return {
      drawerTitle: '',
      drawer: false,
      bbsForm: {
        // userName: null,
        // nickName: null,
        // type: null,
        // content: null,
        // isBook: null,
        // price: null,
        // contact: null,
        // replyList: [],
        // likeList: [],
        // imgList:[],
        //
      },
      editdes: null, //标识处于编辑状态的单元格ref
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 微音论坛表格数据
      bbsList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      typeChangShow: false,
      //是否显示输入框
      isinput:false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        userId: null,
        keyword: null,
        targetId: null,
        // isShow:null,
        type: null,
        sort: null,
        screenTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        nickName: [
          { required: true, message: "昵称不能为空", trigger: "change" }
        ],
        type: [
          { required: true, message: "类型不能为空", trigger: "change" }
        ],
        content: [
          { required: true, message: "微音内容文本不能为空", trigger: "blur" }
        ],
        imgList: [
          { required: true, message: '请至少上传一个图片', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询微音论坛列表 */
    getList() {
      this.loading = true;
      monitorTinybbsPage_Get(this.queryParams).then(response => {
        this.bbsList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        bbsId: null,
        userId: null,
        userName: null,
        nickName: null,
        avatar: null,
        type: null,
        content: null,
        hotNum: null,
        likeNum: null,
        replyNum: null,
        pageView: null,
        isShow: null,
        isBook: null,
        price: null,
        contact: null,
        createTime: null,
        likeEd: null,
        replyList: [],
        likeList: [],
        imgList:[]
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.bbsId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加微音论坛";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const bbsIds = row.bbsId || this.ids
      this.$modal.confirm('是否审核通过微音论坛编号为"' + bbsIds + '"的数据项？').then(function() {
        return monitorTinybbsAudit_Post([bbsIds]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审核通过成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.bbsId != null) {
            updateBbs(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let monitorTinybbsSave_Body = {
              nickName: this.form.nickName,
              avatar: this.form.avatar,
              likeNum: this.form.likeNum,
              isBook: this.form.isBook,   /** 是否书籍=1是,0否 integer required: */
              price: this.form.price,   /** 价格-二手市场字段-单位元 number required: */
              contact: this.form.contact,   /** 联系方式-二手市场,失物招领字段 string required: */
              type: this.form.type,   /** 微音类型-1-微音,2-二手市场,3-失物招领,4-表白,5-官方,6-匿名 integer required: */
              content: this.form.content,   /** 微音内容文本 string required: */
              imgList: this.form.imgList.includes(',') ? this.form.imgList.split(',') : [this.form.imgList],   /** 图片列表 array required: */
            }
            monitorTinybbsSave_Post(monitorTinybbsSave_Body).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleSuccess(res){
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const bbsIds = row.bbsId || this.ids;
      this.$modal.confirm('是否确认删除微音论坛编号为"' + bbsIds + '"的数据项？').then(function() {
        return monitorTinybbsDelete_Delete([bbsIds]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/bbs/export', {
        ...this.queryParams
      }, `bbs_${new Date().getTime()}.xlsx`)
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    typeChang(data){
      if (data === 2){
        this.typeChangShow = true
      }else {
        this.typeChangShow = false
      }
    },
    handleCheck(row){
      this.drawerTitle = '帖子编号：' + row.bbsId
      this.bbsForm = row
  
      this.drawer = true
    },
    //点击弹出input
    switchDesState(row,val){
      let a=row.bbsId+''+val;
      this.editdes=a;
      this.isinput=true;
      this.inputmodel=row.likeNum;
    },
    //失去焦点
    levelDesIt(row){
      this.isinput=false;
      this.editdes=null;
      let changList={
        bbsId:row.bbsId,
        hotNum:row.hotNum,
        likeNum:row.likeNum,
        replyNum:row.replyNum,
        pageView:row.pageView,
        isShow:row.isShow
      }
      monitorTinybbsUpdate_Post(changList).then(response => {
                this.$modal.msgSuccess("修改成功");
              });
    },
    temp(row){
      console.log(row);
    }

  }
};
</script>
