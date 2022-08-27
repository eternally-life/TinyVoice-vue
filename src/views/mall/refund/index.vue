<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="售后状态" prop="status">
        <el-select  @keyup.enter.native="handleQuery" v-model="queryParams.status"  placeholder="请选择">
          <el-option
            v-for="item in dict.type.tiny_mall_after_status"
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
          :disabled=true
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['mall:refund:add']"
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
          v-hasPermi="['mall:refund:update']"
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
          v-hasPermi="['mall:refund:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['mall:refund:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="afterList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="售后ID" align="center" prop="afterId" />
      <el-table-column label="订单ID" align="center" prop="orderId" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="原因" align="center" prop="reason" />
      <el-table-column label="需求" align="center" prop="demand" />
      <el-table-column :filters="dict.type.tiny_mall_after_status"
                       :filter-method="filterHandler"
                       label="售后状态" align="center" prop="status">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tiny_mall_after_status" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['mall:refund:update']"
          >完成售后</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['mall:refund:remove']"
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

    <!-- 添加或修改售后对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单ID" prop="orderId">
          <el-input v-model="form.orderId" placeholder="请输入订单ID" />
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="form.userId" placeholder="请输入用户ID" />
        </el-form-item>
        <el-form-item label="原因" prop="reason">
          <el-input v-model="form.reason" placeholder="请输入原因" />
        </el-form-item>
        <el-form-item label="需求" prop="demand">
          <el-input v-model="form.demand" placeholder="请输入需求" />
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
//import { listAfter, getAfter, delAfter, addAfter, updateAfter } from "@/api/${moduleName}/after";

import {
  monitorTinymallafterDelete_Delete,
  monitorTinymallafterPage_Get,
  monitorTinymallafterUpdate_Put
} from "@/api/mall/商城售后";

export default {
  name: "After",
  dicts: ['tiny_mall_after_status'],
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
      // 售后表格数据
      afterList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        status: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询售后列表 */
    getList() {
      this.loading = true;
      monitorTinymallafterPage_Get(this.queryParams).then(response => {
        this.afterList = response.data.records;
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
        afterId: null,
        orderId: null,
        userId: null,
        reason: null,
        demand: null,
        status: 0,
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
      this.ids = selection.map(item => item.afterId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加售后";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      const afterIds = row.afterId || this.ids;
      this.$modal.confirm('是否确认完成售后编号为"' + afterIds + '"的数据项？').then(function() {
        let monitorTinymallafterUpdate_Param = {
          afterId: afterIds,   /**  string required:false */
        }
        return monitorTinymallafterUpdate_Put(monitorTinymallafterUpdate_Param);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("确认完成售后成功");
      }).catch(() => {});
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.afterId != null) {
            let monitorTinymallafterUpdate_Param = {
              afterId: this.form.afterId,   /**  string required:false */
            }
            monitorTinymallafterUpdate_Put(monitorTinymallafterUpdate_Param).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const afterIds = row.afterId || this.ids;
      this.$modal.confirm('是否确认删除售后编号为"' + afterIds + '"的数据项？').then(function() {
        return monitorTinymallafterDelete_Delete([afterIds]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/after/export', {
        ...this.queryParams
      }, `after_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
