<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
<!--      <el-form-item label="学校id" prop="schoolId">-->
<!--        <el-input-->
<!--          v-model="queryParams.schoolId"-->
<!--          placeholder="请输入学校id"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="学校名" prop="schoolName">
        <el-input
          v-model="queryParams.schoolName"
          placeholder="请输入学校名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递站名" prop="stationName">
        <el-input
          v-model="queryParams.stationName"
          placeholder="请输入快递站名"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="快递站地址" prop="stationAddress">
        <el-input
          v-model="queryParams.stationAddress"
          placeholder="请输入快递站地址"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入联系电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="其余联系方式" prop="otherContact">-->
<!--        <el-input-->
<!--          v-model="queryParams.otherContact"-->
<!--          placeholder="请输入其余联系方式"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
      <el-form-item label="负责人" prop="principal">
        <el-input
          v-model="queryParams.principal"
          placeholder="请输入负责人"
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
          v-hasPermi="['${moduleName}:station:add']"
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
          v-hasPermi="['${moduleName}:station:edit']"
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
          v-hasPermi="['${moduleName}:station:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['${moduleName}:station:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="stationList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="快递站ID" align="center" prop="stationId" />
<!--      <el-table-column label="学校ID" align="center" prop="schoolId" />-->
      <el-table-column label="学校名" align="center" prop="schoolName" />
      <el-table-column label="快递站名" align="center" prop="stationName" />
      <el-table-column label="快递站地址" align="center" prop="stationAddress" />
      <el-table-column label="联系电话" align="center" prop="phonenumber" />
      <el-table-column label="其余联系方式" align="center" prop="otherContact" />
      <el-table-column label="负责人" align="center" prop="principal" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['${moduleName}:station:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['${moduleName}:station:remove']"
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

    <!-- 添加或修改快递站对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学校id" prop="schoolId">
          <el-input v-model="form.schoolId" placeholder="请输入学校id" />
        </el-form-item>
        <el-form-item label="学校名" prop="schoolName">
          <el-input v-model="form.schoolName" placeholder="请输入学校名" />
        </el-form-item>
        <el-form-item label="快递站名" prop="stationName">
          <el-input v-model="form.stationName" placeholder="请输入快递站名" />
        </el-form-item>
        <el-form-item label="快递站地址" prop="stationAddress">
          <el-input v-model="form.stationAddress" placeholder="请输入快递站地址" />
        </el-form-item>
        <el-form-item label="联系电话" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入联系电话" />
        </el-form-item>
        <el-form-item label="其余联系方式" prop="otherContact">
          <el-input v-model="form.otherContact" placeholder="请输入其余联系方式" />
        </el-form-item>
        <el-form-item label="负责人" prop="principal">
          <el-input v-model="form.principal" placeholder="请输入负责人" />
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
//import { listStation, getStation, delStation, addStation, updateStation } from "@/api/${moduleName}/station";

export default {
  name: "Station",
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
      // 快递站表格数据
      stationList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        schoolId: null,
        schoolName: null,
        stationName: null,
        stationAddress: null,
        phonenumber: null,
        otherContact: null,
        principal: null,
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
    /** 查询快递站列表 */
    getList() {
      this.loading = true;
      listStation(this.queryParams).then(response => {
        this.stationList = response.rows;
        this.total = response.total;
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
        stationId: null,
        schoolId: null,
        schoolName: null,
        stationName: null,
        stationAddress: null,
        phonenumber: null,
        otherContact: null,
        principal: null,
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
      this.ids = selection.map(item => item.stationId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加快递站";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const stationId = row.stationId || this.ids
      getStation(stationId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改快递站";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.stationId != null) {
            updateStation(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addStation(this.form).then(response => {
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
      const stationIds = row.stationId || this.ids;
      this.$modal.confirm('是否确认删除快递站编号为"' + stationIds + '"的数据项？').then(function() {
        return delStation(stationIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/station/export', {
        ...this.queryParams
      }, `station_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
