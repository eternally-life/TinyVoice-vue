<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="用户ID" prop="userId">-->
<!--        <el-input-->
<!--          v-model="queryParams.userId"-->
<!--          placeholder="请输入上传用户ID"-->
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
          v-hasPermi="['community:resource:add']"
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
          v-hasPermi="['community:resource:update']"
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
          v-hasPermi="['community:resource:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['community:resource:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="resourceList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="资源ID" align="center" prop="resourceId" />
      <el-table-column label="上传用户ID" align="center" prop="userId" />
      <el-table-column label="资源名" align="center" prop="name" />
      <el-table-column label="资源描述" align="center" prop="describe" />
      <el-table-column label="资源地址" align="center" prop="url" />
      <el-table-column sortable label="所需积分" align="center" prop="integral" />
      <el-table-column sortable label="文件大小(MB)" align="center" prop="size" />
      <el-table-column sortable label="下载量" align="center" prop="downNum" />
      <el-table-column label="文件后缀名" align="center" prop="suffix" />
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
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:resource:update']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:resource:remove']"
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

    <!-- 添加或修改资源共享对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="上传用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入上传用户ID" />
        </el-form-item>
        <el-form-item label="资源名" prop="name">
          <el-input v-model="form.name" placeholder="请输入资源名" />
        </el-form-item>
        <el-form-item label="资源描述" prop="describe">
          <el-input v-model="form.describe" placeholder="请输入资源描述" />
        </el-form-item>
        <el-form-item label="资源地址" prop="url">
          <el-input v-model="form.url" placeholder="请输入资源地址" />
        </el-form-item>
        <el-form-item label="所需积分" prop="integral">
          <el-input v-model="form.integral" placeholder="请输入所需积分" />
        </el-form-item>
        <el-form-item label="文件大小=单位MB" prop="size">
          <el-input v-model="form.size" placeholder="请输入文件大小=单位MB" />
        </el-form-item>
        <el-form-item label="下载量" prop="downNum">
          <el-input v-model="form.downNum" placeholder="请输入下载量" />
        </el-form-item>
        <el-form-item label="文件后缀名" prop="suffix">
          <el-input v-model="form.suffix" placeholder="请输入文件后缀名" />
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-input v-model="form.isShow" placeholder="请输入是否显示=1-显示,0-不显示" />
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
//import { listResource, getResource, delResource, addResource, updateResource } from "@/api/${moduleName}/resource";

import {
  monitorTinyserveresourceAudit_Put,
  monitorTinyserveresourceDelete_Delete,
  monitorTinyserveresourcePage_Get
} from "@/api/资源共享测通";

export default {
  name: "Resource",
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
      // 资源共享表格数据
      resourceList: [],
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
        userId: [
          { required: true, message: "上传用户ID不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询资源共享列表 */
    getList() {
      this.loading = true;
      monitorTinyserveresourcePage_Get(this.queryParams).then(response => {
        this.resourceList = response.data.records;
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
        resourceId: null,
        userId: null,
        name: null,
        describe: null,
        url: null,
        integral: null,
        size: null,
        downNum: null,
        suffix: null,
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
      this.ids = selection.map(item => item.resourceId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加资源共享";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const resourceIds = row.resourceId || this.ids;
      this.$modal.confirm('是否确认审核通过资源共享编号为"' + resourceIds + '"的数据项？').then(function() {
        return monitorTinyserveresourceAudit_Put([resourceIds]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("审核通过成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.resourceId != null) {
            updateResource(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addResource(this.form).then(response => {
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
      const resourceIds = row.resourceId || this.ids;
      let deleteBody = []
      if (resourceIds instanceof Array){
        deleteBody = resourceIds
      }else {
        deleteBody = [resourceIds]
      }
      this.$modal.confirm('是否确认删除资源共享编号为"' + resourceIds + '"的数据项？').then(function() {
        return monitorTinyserveresourceDelete_Delete(deleteBody);
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
      this.download('${moduleName}/resource/export', {
        ...this.queryParams
      }, `resource_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
