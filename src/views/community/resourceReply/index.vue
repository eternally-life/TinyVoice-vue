<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="资源ID" prop="resourceId">-->
<!--        <el-input-->
<!--          v-model="queryParams.resourceId"-->
<!--          placeholder="请输入资源ID"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item label="回复用户姓名" prop="replyName">-->
<!--        <el-input-->
<!--          v-model="queryParams.replyName"-->
<!--          placeholder="请输入回复用户姓名"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
<!--      <el-form-item>-->
<!--        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>-->
<!--        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>-->
<!--      </el-form-item>-->
<!--    </el-form>-->

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          :disabled=true
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['${moduleName}:reply:add']"
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
          v-hasPermi="['${moduleName}:reply:edit']"
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
          v-hasPermi="['${moduleName}:reply:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['${moduleName}:reply:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="replyList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资源回复ID" align="center" prop="replyId" />
      <el-table-column label="资源ID" align="center" prop="resourceId" />
      <el-table-column label="回复用户姓名" align="center" prop="replyName" />
      <el-table-column label="回复用户头像" align="center" prop="avatar">
        <template slot-scope="scope">
          <image-preview :src="scope.row.avatar" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="回复文本" align="center" prop="content" />
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
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['${moduleName}:reply:edit']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['${moduleName}:reply:remove']"
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

    <!-- 添加或修改资源回复对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="资源ID" prop="resourceId">
          <el-input v-model="form.resourceId" placeholder="请输入资源ID" />
        </el-form-item>
        <el-form-item label="回复用户姓名" prop="replyName">
          <el-input v-model="form.replyName" placeholder="请输入回复用户姓名" />
        </el-form-item>
        <el-form-item label="回复用户头像" prop="avatar">
          <template slot-scope="scope">
            <image-preview :src="scope.row.avatar" :width="50" :height="50"/>
          </template>
        </el-form-item>
        <el-form-item label="回复文本">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-input v-model="form.isShow" placeholder="请输入是否显示=1-显示,0-隐藏" />
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
//import { listReply, getReply, delReply, addReply, updateReply } from "@/api/${moduleName}/reply";

import {
  monitorTinyserveresourcereplyAudit_Put,
  monitorTinyserveresourcereplyDelete_Delete,
  monitorTinyserveresourcereplyPage_Get
} from "@/api/资源回复表通过";

export default {
  name: "Reply",
  dicts: ['common_is_show'],
  data() {
    return {
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
      // 资源回复表格数据
      replyList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        resourceId: [
          { required: true, message: "资源ID不能为空", trigger: "blur" }
        ],
        replyName: [
          { required: true, message: "回复用户姓名不能为空", trigger: "blur" }
        ],
        content: [
          { required: true, message: "回复文本不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资源回复列表 */
    getList() {
      this.loading = true;
      monitorTinyserveresourcereplyPage_Get(this.queryParams).then(response => {
        this.replyList = response.data.records;
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
        replyId: null,
        resourceId: null,
        replyName: null,
        avatar: null,
        content: null,
        isShow: null,
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
      this.ids = selection.map(item => item.replyId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资源回复";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const replyIds = row.replyId || this.ids;
      this.$modal.confirm('是否确认审核通过回复编号为"' + replyIds + '"的数据项？').then(function() {
        return monitorTinyserveresourcereplyAudit_Put([replyIds]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审核通过成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.replyId != null) {
            updateReply(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReply(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const replyIds = row.replyId || this.ids;
      this.$modal.confirm('是否确认删除资源回复编号为"' + replyIds + '"的数据项？').then(function() {
        return monitorTinyserveresourcereplyDelete_Delete([replyIds]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/reply/export', {
        ...this.queryParams
      }, `reply_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
