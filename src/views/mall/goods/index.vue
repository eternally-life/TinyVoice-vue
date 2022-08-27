<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--分类数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="schoolName"
            placeholder="输入关键字进行过滤"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="schoolOptions"
            :props="defaultProps"
            show-checkbox
            @check="handleCheckChange"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            highlight-current
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="商品ID" prop="name">
            <el-input
              v-model="queryParams.commodityId"
              placeholder="请输入商品名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商品名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入商品名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商店" prop="mallIdList">
            <el-cascader
              :options="treeList"
              :props="props"
              collapse-tags
              @change="cascaderChange"
              clearable></el-cascader>
          </el-form-item>
          <el-form-item label="是否显示" prop="isShow">
            <el-select v-model="queryParams.isShow"  placeholder="请选择">
              <el-option
                v-for="item in dict.type.tiny_mall_commodity_is_show"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态" prop="status">
            <el-select v-model="queryParams.status"  placeholder="请选择">
              <el-option
                v-for="item in dict.type.tiny_mall_commodity_status"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
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
              v-hasPermi="['mall:goods:add']"
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
              v-hasPermi="['mall:goods:update']"
            >修改</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="danger"
              plain
              icon="el-icon-delete"
              size="mini"
              :disabled="multiple"
              @click="commodityHandleDelete"
              v-hasPermi="['mall:goods:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['mall:goods:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="commodityList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="商品编号" align="center" prop="commodityId" />
          <el-table-column label="商店编号" align="center" prop="mallId" />
          <el-table-column label="商店名称" align="center" prop="mallName" />
          <el-table-column label="商品图" align="center" prop="image" width="100">
            <template slot-scope="scope">
              <image-preview :src="scope.row.image" :width="50" :height="50"/>
            </template>
          </el-table-column>
          <el-table-column label="商品名" align="center" prop="name" />
          <el-table-column show-overflow-tooltip label="商品介绍" align="center">
          <template slot-scope="scope">
            <div @click="changeCenterDialogVisible(scope.row)">{{scope.row.content}}</div>
            </template>
              </el-table-column>
          <el-table-column label="SKU库存" width="100" align="center">
            <template slot-scope="scope">
              <el-button v-hasPermi="['mall:sku:update']" type="primary" icon="el-icon-edit" @click="handleShowSkuEditDialog(scope.$index, scope.row)" circle></el-button>
            </template>
          </el-table-column>
          <el-table-column :filters="dict.type.tiny_mall_commodity_status"
                          :filter-method="filterHandler"
                          label="状态" align="center" prop="status">
            <template slot-scope="scope">
              <p>
                <el-switch
                  @change="handleCommodityStatusChange(scope.$index, scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.status">
                </el-switch>
              </p>
            </template>
                </el-table-column>
                <el-table-column :filters="dict.type.tiny_mall_commodity_is_show"
                                :filter-method="filterHandler"
                                label="是否显示" align="center" prop="isShow">
                  <template slot-scope="scope">
                    <p>
                      <el-switch
                        @change="handleCommodityStatusChange(scope.$index, scope.row)"
                        :active-value="1"
                        :inactive-value="0"
                        v-model="scope.row.isShow">
                      </el-switch>
                    </p>
                  </template>
                </el-table-column>
                <el-table-column :filters="dict.type.tiny_mall_commodity_type"
                                :filter-method="filterHandler"
                                label="商品类型" align="center" prop="type">
                  <template slot-scope="scope">
                    <dict-tag :options="dict.type.tiny_mall_commodity_type" :value="scope.row.type"/>
                  </template>
                </el-table-column>
                <el-table-column label="热度" align="center" prop="heat" />
                <el-table-column label="排序等级" align="center" prop="sort" />
          <el-table-column label="创建时间" align="center" prop="createTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
                <el-table-column label="备注" align="center" prop="remark" />
                <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-edit"
                      @click="commodityHandleUpdate(scope.row)"
                      v-hasPermi="['mall:goods:update']"
                    >修改</el-button>
                    <el-button
                      size="mini"
                      type="text"
                      icon="el-icon-delete"
                      @click="commodityHandleDelete(scope.row)"
                      v-hasPermi="['mall:goods:remove']"
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
      </el-col>
    </el-row>
    <!--添加商品对话框-->
    <el-dialog :title="title" :visible.sync="commodityFromOpen" width="500px">
      <el-form ref="commodityFrom" :model="commodityFrom" :rules="addRules" label-width="80px">
        <el-form-item label="学校名" prop="schoolId">
          <el-select @change="changeSchoolId"  v-model="commodityFrom.schoolId" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.sys_common_school"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商店名" prop="mallId">
          <el-select v-model="commodityFrom.mallId" clearable placeholder="请选择">
            <el-option
              v-for="item in mallList"
              :key="item.mallId"
              :label="item.name"
              :value="item.mallId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品图" prop="image">
          <image-upload v-model="commodityFrom.image"/>
        </el-form-item>
        <el-form-item label="商品名" prop="name">
          <el-input v-model="commodityFrom.name" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="商品介绍" prop="content">
          <editor v-model="commodityFrom.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="commodityFrom.type" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.tiny_mall_commodity_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCommodityAddForm">确 定</el-button>
        <el-button @click="commodityFromCancel">取 消</el-button>
      </div>
    </el-dialog>
    <!--商品修改对话框-->
    <el-dialog :title="title" :visible.sync="commodityEditFromOpen" width="500px">
      <el-form ref="commodityEditFrom" :model="commodityEditFrom" :rules="rules" label-width="80px">
        <el-form-item label="商品ID" prop="commodityId">
          <el-input :disabled=true v-model="commodityEditFrom.commodityId" placeholder="请输入商品ID" />
        </el-form-item>
        <el-form-item label="商店ID" prop="mallId">
          <el-input :disabled=true v-model="commodityEditFrom.mallId" placeholder="请输入商店ID" />
        </el-form-item>
        <el-form-item label="商品图片" prop="image">
          <image-upload v-model="commodityEditFrom.image"/>
        </el-form-item>
        <el-form-item label="商品介绍" prop="content">
          <editor v-model="commodityEditFrom.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="商品名" prop="name">
          <el-input v-model="commodityEditFrom.name" placeholder="请输入商品名" />
        </el-form-item>
        <el-form-item label="商品类型" prop="type">
          <el-select v-model="commodityEditFrom.type"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.tiny_mall_commodity_type"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="热度" prop="heat">
          <el-input v-model="commodityEditFrom.heat" placeholder="请输入热度" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="commodityEditFrom.status"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.tiny_mall_commodity_status"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-select v-model="commodityEditFrom.isShow"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.tiny_mall_commodity_is_show"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="commodityEditFrom.remark" placeholder="请输入备注" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitCommodityEditForm">确 定</el-button>
        <el-button @click="commodityEditFromOpen = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--商品规格对话框-->
    <el-dialog
      :title="title"
      :visible.sync="editSkuInfo.skuOpen"
      width="500px">
      <span>商品货号：</span>
      <span>{{editSkuInfo.commodityId}}</span>
      <el-input :disabled="true" placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <!-- <el-button slot="append" icon="el-icon-search" @click="">123</el-button> -->
      </el-input>
      <el-button
        size="mini"
        type="text"
        style="margin-left: 30px"
        icon="el-icon-circle-plus-outline"
        @click="addLine()"
        v-hasPermi="['${moduleName}:mall:edit']"
      >新增规格</el-button>
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.skuList"
                v-loading="loading"
                border>
        <el-table-column
          label="SKU编号"
          align="center">
          <template slot-scope="scope">
            <el-input :disabled="scope.row.skuId === null" v-model="scope.row.skuId"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="规格名"
          align="center">
          <template slot-scope="scope">
            <el-input v-model="scope.row.specification"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="价格(分)"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.price"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="80"
          align="center">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.inventory"></el-input>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="操作"
          width="120">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-check"
              @click="handleEditSkuConfirm(scope.row)"
              v-hasPermi="['${moduleName}:mall:edit']"
            >保存</el-button>
            <el-button
              size="mini"
              type="text"
              icon="el-icon-circle-close"
              @click="handleDeleteSkuConfirm(scope.$index, scope.row)"
              v-hasPermi="['${moduleName}:mall:remove']"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.skuOpen = false">取 消</el-button>
        <el-button type="primary" @click="submitEditSkuInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 商品详情提示框 -->
        <el-dialog
          title="商品介绍"
          :visible.sync="centerDialogVisible"
          width="40%"
          center
          >
          <div class="goodsIntroduction" v-html="goodsIntroduction"></div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
          </span>

        </el-dialog>
  </div>
</template>

<script>
import {
  monitorTinymallPageMallCommodity_Get,
  monitorTinymallPageMallType_Get
} from "@/api/mall/商城商店分类通过";
import request from "@/utils/request";
import item from "@/layout/components/Sidebar/Item";
import {
  monitorTinymallcommodityskuGetSku_Get,
  monitorTinymallcommodityskuDelete_Delete,
  monitorTinymallcommodityskuSaveBatch_Post,
  monitorTinymallcommodityskuUpdate_Put
} from "@/api/mall/商城商品规格通过";
import {
  monitorTinymallcommodityDelete_Delete,
  monitorTinymallcommoditySave_Post,
  monitorTinymallcommodityUpdate_Put
} from "@/api/mall/商城商品通过";

export default {
  name: "Mall",
  dicts: ['tiny_mall_commodity_type',
    'tiny_mall_commodity_status','tiny_mall_commodity_is_show','sys_common_school'],
  data() {
    return {
      props: {
        checkStrictly: true,
        value: 'mallId',
        label: "name",
        children: "children",
        multiple: true
      },
      treeList: [],
      schoolName: undefined,
      schoolOptions: null,
      defaultProps: {
        children: "children",
        label: "name"
      },
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
      // 商店/分类表格数据
      commodityList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      //商品介绍弹出层
      centerDialogVisible:false,
      //商品介绍内容
      goodsIntroduction:'',
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
        name: null,
        isShow: null,
        mallIdList: null,
        commodityId: null
      },
      commodityFromOpen: false,
      schoolId: null,
      mallList:[],
      commodityFrom: {
        schoolId:1,
        mallId: null,
        image: null,
        name: null,
        content: null,
        type: 2
      },
      commodityEditFromOpen: false,
      commodityEditFrom: {
        commodityId: null,
        mallId: null,
        image: null,
        content: null,
        isShow: null,
        status: null,
        heat: null,
        type: null,
        name: null,
        remark: null
      },
      preSkuList:'',
      editSkuInfo:{
        skuOpen: false,
        commodityId:'',
        skuList:[],
        keyword:null
      },
      // 表单参数
      form: {},
      // 表单校验
      addRules: {
        mallId: [
          { required: true, message: "商店ID不能为空", trigger: "blur" }
        ],
        image: [
          { required: true, message: '请至少上传一个图片', trigger: 'change' }
        ],
        name: [
          { required: true, message: "商品名不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "商品介绍不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "学校名不能为空", trigger: "change" }
        ],
      },
      rules: {
        commodityId: [
          { required: true, message: "商品ID不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "学校名不能为空", trigger: "change" }
        ],
        isShow: [
          { required: true, message: "是否显示不能为空", trigger: "change" }
        ],
        name: [
          { required: true, message: "商品名不能为空", trigger: "blur" }
        ],
        image: [
          { required: true, message: '请至少上传一个图片', trigger: 'change' }
        ]
      }
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    /** 查询商品列表 */
    getList() {
      this.loading = true;
      monitorTinymallPageMallCommodity_Get(this.queryParams).then(response => {
        this.commodityList = response.data.records;
        // console.log(response.data.records);
        this.total = response.data.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    commodityFromCancel(){
      this.commodityFromOpen = false;
      this.resetForm('commodityFrom');
    },
    // 表单重置
    reset() {
      this.form = {
        commodityId: null,
        mallId: null,
        userId: null,
        mallName: null,
        image: null,
        name: null,
        content: null,
        type: null,
        heat: null,
        sort: null,
        status: null,
        isShow: null,
        remark: null,
        createTime: null
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
      this.ids = selection.map(item => item.commodityId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.resetForm('commodityFrom');
      this.changeSchoolId();
      // console.log(this.commodityFrom.mallId);
      this.commodityFromOpen = true;
      this.title = "添加商品"
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.resetForm('commodityEditFrom')
      const commodityIds = row.commodityId || this.ids
      let monitorTinymallPageMallCommodity_Param = {
        pageNum: 1,   /** 第几页 string required:false */
        pageSize: 1,   /** 页码大小 string required:false */
        commodityId: row.commodityId,   /** 根据商店ID筛选 string required:false */
      }
      if (this.ids.length > 0){
        monitorTinymallPageMallCommodity_Param.commodityId = commodityIds[0]
      }
      if(row.commodityId != null){
        monitorTinymallPageMallCommodity_Param.commodityId = row.commodityId
      }
      // console.log(monitorTinymallPageMallCommodity_Param)
      monitorTinymallPageMallCommodity_Get(monitorTinymallPageMallCommodity_Param).then(response => {
        this.commodityEditFrom = response.data.records[0];
        this.commodityEditFromOpen = true
        this.title = "修改商品信息";
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/mall/export', {
        ...this.queryParams
      }, `mall_${new Date().getTime()}.xlsx`)
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    /** 查询学校下拉树结构 */
    getTreeselect() {
      let treeList=[]
      this.getDicts("sys_common_school").then(response => {
        this.schoolOptions = response.data;
        this.schoolOptions.forEach(function(value,index,array){
          let treeNode = {}
          treeNode.id = response.data[index].dictCode
          treeNode.schoolId =  Number(response.data[index].dictValue)
          treeNode.name = response.data[index].dictLabel

          let monitorTinymallPageMallType_Param = {
            pageNum: 1,   /** 第几页 string required:false */
            pageSize: 999,   /** 页码大小 string required:false */
            schoolId: treeNode.schoolId,   /** 根据学校ID筛选 string required:false */
          }
          monitorTinymallPageMallType_Get(monitorTinymallPageMallType_Param).then(response => {
            treeNode.children = response.data.records
            treeList.push(treeNode)
          })
        })
        this.schoolOptions = treeList
        this.treeList = treeList
      });
    },
    /** 打开添加商品表单 */
    handleAddCommodity(row){
      this.resetForm('commodityFrom');
      this.commodityFromOpen = true;
      this.commodityFrom.mallId = row.mallId
      this.title = "添加商品"
    },
    /** 确认提交修改商品表单 */
    submitCommodityEditForm(){
      let monitorTinymallcommodityUpdate_Body = {
        heat: this.commodityEditFrom.heat,   /** 热度 integer required: */
        image: JSON.stringify(this.commodityEditFrom.image.split(',')),   /** 商品的图片url string required: */
        mallId: this.commodityEditFrom.mallId,   /** 商店id integer required: */
        name: this.commodityEditFrom.name,   /** 商品名 string required: */
        remark: this.commodityEditFrom.remark,   /** 备注 string required: */
        commodityId: this.commodityEditFrom.commodityId,   /** $property.description integer required: */
        type: this.commodityEditFrom.type,   /** 商品类型=1-虚拟商品,2-实体商品 integer required: */
        content: this.commodityEditFrom.content,   /** 商品介绍 string required: */
        status: this.commodityEditFrom.status,   /** 状态=1-在售,0-停售 integer required: */
        isShow: this.commodityEditFrom.isShow,   /** 是否显示=1-显示,0-不显示 integer required: */
      }
      monitorTinymallcommodityUpdate_Put(monitorTinymallcommodityUpdate_Body).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.commodityEditFromOpen = false;
        this.getList();
      })
    },
    /** 新增商品 */
    async submitCommodityAddForm(){
      let monitorTinymallcommoditySave_Body = {
        schoolId:this.commodityFrom.schoolId,
        image: JSON.stringify(this.commodityFrom.image.split(',')),   /** 商品的图片url string required: */
        mallId: this.commodityFrom.mallId,   /** 商店id integer required: */
        name: this.commodityFrom.name,   /** 商品名 string required: */
        type: this.commodityFrom.type,   /** 商品类型=1-虚拟商品,2-实体商品 integer required: */
        content: this.commodityFrom.content,   /** 商品介绍 string required: */
      }
      // monitorTinymallcommoditySave_Post(monitorTinymallcommoditySave_Body).then(response => {
      //   this.$modal.msgSuccess("新增成功");
      //   this.commodityFromOpen = false;
      //   this.getList();
      // // this.editSkuInfo.skuOpen = true;
      // this.handleShowSkuEditDialog();
      // });
      await monitorTinymallcommoditySave_Post(monitorTinymallcommoditySave_Body)
        this.$modal.msgSuccess("新增成功");
        this.commodityFromOpen = false;
        this.getList();
        let monitorTinymallPageMallCommodity_Param = {
                pageNum: 1,
                /** 第几页 string required:false */
                pageSize: 50,
                /** 页码大小 string required:false */
                isShow: null,
                /** 显示筛选 1 显示 0 不显示 string required:false */
                status: 1,
                /**  string required:false */
                mallIdList: this.commodityFrom.mallId,
                /** 根据商店ID数组筛选 string required:false */
                name: this.commodityFrom.name,
                /** 根据名字筛选 string required:false */
            }
        //(注意:有概率触发bug) 查询商品id,用搜素的接口获取到表单数据,再取数据中第一个 再调用handleShowSkuEditDialog方法
        monitorTinymallPageMallCommodity_Get(monitorTinymallPageMallCommodity_Param).then(response => {
        // console.log(response.data.records);
        // console.log(response.data.records[0]);
        this.handleShowSkuEditDialog(1,response.data.records[0])
      });
    },
    /** 添加库存新行 */
    addLine() {
      //添加新的行数
      this.editSkuInfo.skuList.push({
        skuId: null,
        specification: null,
        price: null,
        inventory:null,
        commodityId: null
      });
      // console.log(this.editSkuInfo.skuList)
    },
    /** 编辑保存库存 */
    handleEditSkuConfirm(row){
      if(this.editSkuInfo.skuList==null||this.editSkuInfo.skuList.length<=0){
        this.$message({
          message: '暂无sku信息',
          type: 'warning',
          duration: 1000
        });
        return
      }
      if (row.skuId === null){
        this.$confirm('是否要进行新增规格并保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let monitorTinymallcommodityskuSave_Body = {
            price: row.price,   /** 价格=单位分 integer required: */
            specification: row.specification,   /** 规格名 string required: */
            commodityId: this.editSkuInfo.commodityId,   /** 商品ID integer required: */
            inventory: row.inventory,   /** 库存 integer required: */
          }
          monitorTinymallcommodityskuSaveBatch_Post({skuVOS: [monitorTinymallcommodityskuSave_Body]}).then(response=>{
            this.$modal.msgSuccess("保存成功");
            monitorTinymallcommodityskuGetSku_Get({commodityId: this.editSkuInfo.commodityId}).then(response => {
              this.editSkuInfo.skuList = response.data;
            });
          })
        })
      }else {
        this.$confirm('规格编号"' + row.skuId + '"是否要进行修改并保存？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let monitorTinymallcommodityskuUpdate_Body = {
            price: row.price, /** 价格=单位分 integer required: */
            specification: row.specification, /** 规格名 string required: */
            inventory: row.inventory, /** 库存 integer required: */
            skuId: row.skuId, /** $property.description integer required: */
            isShow: row.isShow,   /** 价格=单位分 integer required: */
          }
          monitorTinymallcommodityskuUpdate_Put(monitorTinymallcommodityskuUpdate_Body).then(response=>{
            this.$modal.msgSuccess("修改成功");
            monitorTinymallcommodityskuGetSku_Get({commodityId: this.editSkuInfo.commodityId}).then(response => {
              this.editSkuInfo.skuList = response.data;
            });
          });
        });
      }
    },
    /** 删除库存 */
    handleDeleteSkuConfirm(index,row){
      if (row.skuId === null){
        return this.editSkuInfo.skuList.splice(index, 1);
      }
      this.$modal.confirm('是否确认规格编号为"' + row.skuId + '"的数据项？').then(function() {
        // console.log(row.skuId);
        return monitorTinymallcommodityskuDelete_Delete([row.skuId]);
      }).then(() => {
        monitorTinymallcommodityskuGetSku_Get({commodityId: this.editSkuInfo.commodityId}).then(response => {
          this.editSkuInfo.skuList = response.data;
        });
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 显示库存表单 */
    handleShowSkuEditDialog(index,row){
      this.editSkuInfo.skuOpen = true;
      this.editSkuInfo.commodityId = row.commodityId;
      this.editSkuInfo.keyword=null;
      let monitorTinymallcommodityskuGetSku_Param = {
        commodityId: row.commodityId,   /** 商品ID string required:false */
      }
      monitorTinymallcommodityskuGetSku_Get(monitorTinymallcommodityskuGetSku_Param).then(response => {
        this.editSkuInfo.skuList = response.data;
        this.preSkuList = JSON.stringify(this.editSkuInfo.skuList);
      });
    },
    /** 删除商品  删除按钮操作 */
    commodityHandleDelete(row){
      const commodityIds = row.commodityId || this.ids;
      if (this.ids.length > 0){
        this.$modal.confirm('是否确认删除商品为"' + commodityIds + '"的数据项？').then(function() {
          return monitorTinymallcommodityDelete_Delete(commodityIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }else {
        this.$modal.confirm('是否确认删除商品为"' + commodityIds + '"的数据项？').then(function () {
          return monitorTinymallcommodityDelete_Delete([commodityIds]);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {
        });
      }
    },
    /** 筛选器 */
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    /** 修改商品状态/显示开关 */
    handleCommodityStatusChange(index, row){
      let monitorTinymallcommodityUpdate_Body = {
        image: row.image,   /** 商品的图片url string required: */
        name: row.name,   /** 商品名 string required: */
        commodityId: row.commodityId,   /** $property.description integer required: */
        status: row.status,   /** 状态=1-在售,0-停售 integer required: */
        isShow: row.isShow,   /** 是否显示=1-显示,0-不显示 integer required: */
      }
      monitorTinymallcommodityUpdate_Put(monitorTinymallcommodityUpdate_Body).then(response => {
        this.$modal.msgSuccess("修改成功");
      })
    },
    /** 二级联动 */
    changeSchoolId(data){
      this.schoolId = data
      this.commodityFrom.mallId = null
      let monitorTinymallPageMall_Param = {
        pageNum: 1,   /** 第几页 string required:false */
        pageSize: 999,   /** 页码大小 string required:false */
        schoolId: data,   /** 根据商店ID筛选 string required:false */
      }
      monitorTinymallPageMallType_Get(monitorTinymallPageMall_Param).then(response => {
        this.mallList = response.data.records;
      });
    },
    /** 提交Sku确认 */
    submitEditSkuInfo(){
      Array.prototype.notempty = function() {
        var arr = [];
        this.map(function(item, index) {
          if (item.skuId != null ) {
            arr.push(item);
          }
        });
        return arr;
      }
      if (this.preSkuList === JSON.stringify(this.editSkuInfo.skuList)) {
        this.editSkuInfo.skuOpen = false
      } else {
        let arr1 = eval(this.preSkuList);
        let arr2 = this.editSkuInfo.skuList.notempty();
        let editSkuList = [];
        for(let j = 0; j < arr1.length; j++) {
          if (arr1[j].specification !== arr2[j].specification || arr1[j].inventory !== arr2[j].inventory || arr1[j].price !== arr2[j].price){
            editSkuList.push(arr2[j]);
          }
        }
        // console.log(editSkuList);
        let addSkuList = [];
        this.editSkuInfo.skuList.forEach(item => {
          if (item.skuId === null && item.specification != null && item.inventory != null && item.price != null){
            addSkuList.push({
              price: item.price,   /** 价格=单位分 integer required: */
              specification: item.specification,   /** 规格名 string required: */
              commodityId: this.editSkuInfo.commodityId,   /** 商品ID integer required: */
              inventory: item.inventory,   /** 库存 integer required: */
            })}
        });
        if (addSkuList.length > 0 || editSkuList.length > 0){
          this.$modal.confirm('存在'+addSkuList.length+'条新增数据,'+editSkuList.length+'条修改数据未保存，是否保存？"').then(function () {
            return monitorTinymallcommodityskuSaveBatch_Post({skuVOS: addSkuList,updateSkuS: editSkuList});
          }).then(() => {
            this.$modal.msgSuccess("保存成功");
             this.editSkuInfo.skuOpen = false;
          }).catch(() => {
          });
        }else {
          this.editSkuInfo.skuOpen = false
        }
      }
    },
    cascaderChange(value){
      const s = new Set();
      value.forEach(item => {
        item.forEach(item => {
          if (item != undefined){
            s.add(item)
          }
        })
      })
      this.queryParams.mallIdList = Array.from(s).join(',') === '' ? null : Array.from(s).join(',')
    },
    /** 修改商品 */
    commodityHandleUpdate(row) {
      this.resetForm('commodityEditFrom')
      this.commodityEditFrom = row
      this.title = '修改商品';
      this.commodityEditFromOpen = true
    },
    handleCheckChange(node,data){
      let mallIds = []
      if (data.checkedNodes.length === 1){
        this.queryParams.mallIdList = data.checkedNodes[0].mallId
        this.handleQuery();
      }else if (data.checkedNodes.length > 1){
        data.checkedNodes.forEach(item => {
          mallIds.push(item.mallId)
        })
        this.queryParams.mallIdList = mallIds.join(',')
        this.handleQuery();
      }else if (data.checkedNodes.length < 1){
        this.queryParams.mallIdList = null
        this.handleQuery();
      }
    },
    changeCenterDialogVisible(row){
      this.centerDialogVisible=true,
      this.goodsIntroduction=row.content;
      console.log(this.goodsIntroduction);
    }
  }
};
</script>
<style>
.goodsIntroduction p img{
width: 45%;
}
</style>
