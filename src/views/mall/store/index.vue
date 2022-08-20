<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--学校数据-->
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
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="学校名" prop="schoolName">
            <el-select @change="changeSchoolId" v-model="queryParams.schoolId"  placeholder="请选择">
              <el-option
                v-for="item in dict.type.sys_common_school"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商店名" prop="name">
            <el-input
              v-model="queryParams.name"
              placeholder="请输入商店名"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="是否显示" prop="isShow">
            <el-select v-model="queryParams.isShow"  placeholder="请选择">
              <el-option
                v-for="item in dict.type.tiny_mall_is_show"
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
              v-hasPermi="['${moduleName}:mall:add']"
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
              v-hasPermi="['${moduleName}:mall:edit']"
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
              v-hasPermi="['${moduleName}:mall:remove']"
            >删除</el-button>
          </el-col>
          <el-col :span="1.5">
            <el-button
              type="warning"
              plain
              icon="el-icon-download"
              size="mini"
              @click="handleExport"
              v-hasPermi="['${moduleName}:mall:export']"
            >导出</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="mallList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="商店编号" align="center" prop="mallId" />
          <el-table-column label="学校ID" align="center" prop="schoolId" />
          <el-table-column label="学校名" align="center" prop="schoolName" />
          <el-table-column sortable label="余额(分)" align="center" prop="balance" />
          <el-table-column label="商店名" align="center" prop="name" />
          <el-table-column label="店铺描述" align="center" prop="content" />
          <el-table-column label="商店图片" align="center" prop="avatar" />
          <el-table-column label="商店地址" align="center" prop="address" />
          <el-table-column label="手机号" align="center" prop="phonenumber" />
          <el-table-column label="其他联系方式" align="center" prop="otherContact" />
          <el-table-column :filters="dict.type.tiny_mall_is_show"
                           :filter-method="filterHandler"
                           label="是否显示" align="center" prop="isShow">
            <template slot-scope="scope">
              <p>
                <el-switch
                  @change="handleMallStatusChange(scope.$index, scope.row)"
                  :active-value="1"
                  :inactive-value="0"
                  v-model="scope.row.isShow">
                </el-switch>
              </p>
            </template>
          </el-table-column>
          <el-table-column sortable label="热度指数" align="center" prop="hotNum" />
          <el-table-column sortable label="订单数" align="center" prop="orderNum" />
          <el-table-column
            :filters="dict.type.tiny_mall_status"
            :filter-method="filterHandler"
            label="营业状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tiny_mall_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column :filters="dict.type.tiny_mall_type"
                           :filter-method="filterHandler"
                           label="商店类型" align="center" prop="type">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tiny_mall_type" :value="scope.row.type"/>
            </template>
          </el-table-column>
          <el-table-column :filters="dict.type.tiny_mall_sort"
                           :filter-method="filterHandler"
                           label="排序等级" align="center" prop="sort">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tiny_mall_sort" :value="scope.row.sort"/>
            </template>
          </el-table-column>
          <el-table-column :filters="dict.type.tiny_mall_send_type"
                           :filter-method="filterHandler"
                           label="配送" align="center" prop="sendType">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tiny_mall_send_type" :value="scope.row.sendType"/>
            </template>
          </el-table-column>
          <el-table-column label="开始营业时间" align="center" prop="startTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.startTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="结束营业时间" align="center" prop="endTime" width="180">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.endTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
                v-hasPermi="['${moduleName}:mall:edit']"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
                v-hasPermi="['${moduleName}:mall:remove']"
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
    <!-- 添加或修改商店/分类对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校ID" prop="schoolId">
          <el-input
            placeholder=""
            v-model="form.schoolId"
            :disabled="true">
          </el-input>
        </el-form-item>
        <el-form-item label="学校名" prop="schoolName">
          <el-select @change="changeSchoolId" v-model="form.schoolName"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.sys_common_school"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="分类名" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名" />
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow" v-if="form.isShow !== null">
          <el-select v-model="form.isShow"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.tiny_mall_is_show"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
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
  monitorTinymallDelete_Delete,
  monitorTinymallPageMall_Get,
  monitorTinymallPageMallType_Get,
  monitorTinymallSave_Post, monitorTinymallUpdate_Put
} from "@/api/mall/商城商店分类通过";

export default {
  name: "Mall",
  dicts: ['tiny_mall_status','tiny_mall_type','tiny_mall_is_show',
    'tiny_mall_sort','tiny_mall_send_type','sys_common_school'],
  data() {
    return {
      schoolName: undefined,
      schoolOptions: undefined,
      defaultProps: {
        children: "children",
        label: "dictLabel"
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
      mallList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schoolId: null,
        name: null,
        isShow: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        schoolId: [
          { required: true, message: "学校id不能为空", trigger: "blur" }
        ],
        schoolName: [
          { required: true, message: "学校名不能为空", trigger: "blur" }
        ],
        name: [
          { required: true, message: "商店名不能为空", trigger: "blur" }
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
    /** 查询商店/分类列表 */
    getList() {
      this.loading = true;
      monitorTinymallPageMall_Get(this.queryParams).then(response => {
        this.mallList = response.data.records;
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
        mallId: null,
        userId: null,
        schoolId: null,
        schoolName: null,
        balance: null,
        name: null,
        content: null,
        avatar: null,
        address: null,
        phonenumber: null,
        otherContact: null,
        hotNum: null,
        orderNum: null,
        remark: null,
        status: "0",
        type: null,
        isShow: null,
        sort: null,
        sendType: null,
        startTime: null,
        endTime: null,
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
      this.ids = selection.map(item => item.mallId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加商店/分类";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const mallIds = row.mallId || this.ids
      let monitorTinymallPageMall_Param = {
        pageNum: 1,   /** 第几页 string required:false */
        pageSize: 1,   /** 页码大小 string required:false */
        mallId: row.mallId,   /** 根据商店ID筛选 string required:false */
      }
      if (this.ids.length > 0){
        monitorTinymallPageMall_Param.mallId = mallIds[0]
      }
      if(row.mallId != null){
        monitorTinymallPageMall_Param.mallId = row.mallId
      }
      monitorTinymallPageMallType_Get(monitorTinymallPageMall_Param).then(response => {
        this.form = response.data.records[0];
        this.open = true;
        this.title = "修改商店信息";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.mallId != null) {
            let monitorTinymallUpdate_Body = {
              mallId: this.form.mallId,   /** $property.description integer required: */
              schoolId: this.form.schoolId,   /** 学校ID integer required: */
              name: this.form.name,   /** 商店名 string required: */
              schoolName: this.form.schoolName,   /** 学校名 string required: */
              isShow: this.form.isShow   /** 是否显示 integer required: */
            }
            monitorTinymallUpdate_Put(monitorTinymallUpdate_Body).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let monitorTinymallSave_Body = {
              schoolId: this.form.schoolId,   /** 学校ID integer required: */
              name: this.form.name,   /** 商店名 string required: */
              schoolName: this.form.schoolName,   /** 学校名 string required: */
            }
            monitorTinymallSave_Post(monitorTinymallSave_Body).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/mall/export', {
        ...this.queryParams
      }, `mall_${new Date().getTime()}.xlsx`)
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const mallIds = row.mallId || this.ids;
      if (this.ids.length > 0){
        this.$modal.confirm('是否确认删除商店/分类编号为"' + mallIds + '"的数据项？').then(function() {
          return monitorTinymallDelete_Delete(mallIds);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }else {
        this.$modal.confirm('是否确认删除商店/分类编号为"' + mallIds + '"的数据项？').then(function() {
          return monitorTinymallDelete_Delete([mallIds]);
        }).then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        }).catch(() => {});
      }
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.dictLabel.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.schoolId = Number(data.dictValue);
      this.handleQuery();
    },
    /** 查询学校下拉树结构 */
    getTreeselect() {
      this.getDicts("sys_common_school").then(response => {
        this.schoolOptions = response.data;
      });
    },
    /** 筛选器 */
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    /** 商店显示开关 */
    handleMallStatusChange(index, row){
      let monitorTinymallUpdate_Body = {
        mallId: row.mallId,   /** $property.description integer required: */
        isShow: row.isShow   /** 是否显示 integer required: */
      }
      monitorTinymallUpdate_Put(monitorTinymallUpdate_Body).then(response => {
        this.$modal.msgSuccess("修改成功");
      });
    },
    /** 二级联动 */
    changeSchoolId(data){
      this.schoolOptions.forEach(item => {
        if (item.dictValue === String(data)){
          this.form.schoolName = item.dictLabel
        }
      })
      this.form.schoolId = data
    }
  }
};
</script>
