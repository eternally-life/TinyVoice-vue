<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="TabbarId" prop="tinyTabbarId">
        <el-input
          v-model="queryParams.tinyTabbarId"
          placeholder="请输入名字"
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
          v-hasPermi="['community:tabbar:add']"
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
          v-hasPermi="['community:tabbar:update']"
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
          v-hasPermi="['community:tabbar:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['community:tabbar:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="tabbarList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="ID" align="center" prop="id" />
      <el-table-column label="路径" align="center" prop="path" />
      <el-table-column label="名字" align="center" prop="name" />
      <el-table-column label="未选择时Icon" align="center" prop="unCheckedIcon" />
      <el-table-column label="选择时icon" align="center" prop="checkedIcon" />
      <el-table-column :filters="dict.type.common_is_isShow"
                       :filter-method="filterHandler"
                       label="微信是否显示" align="center" prop="wxShow">
        <template slot-scope="scope">
          <p>
            <el-switch
              @change="handleIsShowChange('wxShow', scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.wxShow">
            </el-switch>
          </p>
        </template>
      </el-table-column>
      <el-table-column :filters="dict.type.common_is_isShow"
                       :filter-method="filterHandler"
                       label="QQ是否显示" align="center" prop="qqShow">
        <template slot-scope="scope">
          <p>
            <el-switch
              @change="handleIsShowChange('qqShow', scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.qqShow">
            </el-switch>
          </p>
        </template>
      </el-table-column>
      <el-table-column :filters="dict.type.common_is_isShow"
                       :filter-method="filterHandler"
                       label="是否显示" align="center" prop="isShow">
        <template slot-scope="scope">
          <p>
            <el-switch
              @change="handleIsShowChange('isShow', scope.row)"
              :active-value="1"
              :inactive-value="0"
              v-model="scope.row.isShow">
            </el-switch>
          </p>
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['community:tabbar:update']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['community:tabbar:remove']"
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

    <!-- 添加或修改tabbar页面对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="TabbarId" prop="id">
          <el-input v-model="form.id" placeholder="请输入TabbarId" />
        </el-form-item>
        <el-form-item label="路径" prop="path">
          <el-input v-model="form.path" placeholder="请输入路径" />
        </el-form-item>
        <el-form-item label="名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入名字" />
        </el-form-item>
        <el-form-item label="未选择时Icon" prop="unCheckedIcon">
          <el-input v-model="form.unCheckedIcon" placeholder="请输入未选择时候的icon" />
        </el-form-item>
        <el-form-item label="选择时Icon" prop="checkedIcon">
          <el-input v-model="form.checkedIcon" placeholder="请输入选择的icon" />
        </el-form-item>
        <el-form-item label="QQ是否显示" prop="isShow">
          <el-select v-model="form.qqShow"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.common_is_show"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="微信是否显示" prop="isShow">
          <el-select v-model="form.wxShow"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.common_is_show"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="是否显示" prop="isShow">
          <el-select v-model="form.isShow"  placeholder="请选择">
            <el-option
              v-for="item in dict.type.common_is_show"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="form.remark" placeholder="请输入备注" />
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
  tinytabbarById_Get,
  tinytabbarDelete_Delete,
  tinytabbarPage_Get,
  tinytabbarSave_Post,
  tinytabbarUpdate_Put
} from "@/api/tabbar页面";

export default {
  name: "Tabbar",
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
      // tabbar页面表格数据
      tabbarList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tinyTabbarId: null
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
    /** 查询tabbar页面列表 */
    getList() {
      this.loading = true;
      tinytabbarPage_Get(this.queryParams).then(response => {
        this.tabbarList = response.data.records;
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
        id: null,
        path: null,
        name: null,
        unCheckedIcon: null,
        checkedIcon: null,
        isShow: null,
        qqShow: null,
        wxShow:null,
        createTime: null,
        remark: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      // this.getList();
      tinytabbarById_Get({tinyTabbarId: this.queryParams.tinyTabbarId}).then(response => {
        this.tabbarList = [response.data];
        this.total = 1;
      });
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加Tabbar";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      let tinytabbarById_Param = {
        tinyTabbarId: null,   /**  string required:false */
      }
      if (this.ids.length > 0){
        tinytabbarById_Param.tinyTabbarId = id[0]
      }
      if(row.id != null){
        tinytabbarById_Param.tinyTabbarId = row.id
      }
      tinytabbarById_Get(tinytabbarById_Param).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改Tabbar";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.createTime != null) {
            this.form.createTime = Number(new Date())
            let tinytabbarUpdate_Body = {
              path: this.form.path,   /** 路劲 string required: */
              unCheckedIcon: this.form.unCheckedIcon,   /** 未选择时候的icon string required: */
              checkedIcon: this.form.checkedIcon,   /** 选择的icon string required: */
              createTime: this.form.createTime,   /** 创建的时间戳 integer required: */
              name: this.form.name,   /** 名字 string required: */
              id: this.form.id,   /** $property.description integer required: */
              isShow: this.form.isShow,   /** 1显示,0隐藏 integer required: */
              qqShow: this.form.qqShow,
              wxShow: this.form.wxShow,
              remark: this.form.remark
            }
            tinytabbarUpdate_Put(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            this.form.createTime = Number(new Date())
            let tinytabbarSave_Body = {
              path: this.form.path,   /** 路劲 string required: */
              unCheckedIcon: this.form.unCheckedIcon,   /** 未选择时候的icon string required: */
              checkedIcon: this.form.checkedIcon,   /** 选择的icon string required: */
              createTime: this.form.createTime,   /** 创建的时间戳 integer required: */
              name: this.form.name,   /** 名字 string required: */
              id: this.form.id,   /** $property.description integer required: */
              isShow: this.form.isShow,   /** 1显示,0隐藏 integer required: */
              qqShow: this.form.qqShow,
              wxShow: this.form.wxShow,
              remark: this.form.remark
            }
            tinytabbarSave_Post(this.form).then(response => {
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
      const ids = row.id || this.ids;
      let deleteBody = []
      if (ids instanceof Array){
        deleteBody = ids
      }else {
        deleteBody = [ids]
      }
      this.$modal.confirm('是否确认删除Tabbar编号为"' + ids + '"的数据项？').then(function() {
        return tinytabbarDelete_Delete(deleteBody);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/tabbar/export', {
        ...this.queryParams
      }, `tabbar_${new Date().getTime()}.xlsx`)
    },
    /** 筛选器 */
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleIsShowChange(item,row){
      let tinytabbarUpdate_Body = {
        id: row.id,   /** $property.description integer required: */
      }
      if (item === 'isShow'){
        tinytabbarUpdate_Body.isShow = row.isShow
      }else if (item === 'qqShow'){
        tinytabbarUpdate_Body.qqShow = row.qqShow
      }else if (item === 'wxShow'){
        tinytabbarUpdate_Body.wxShow = row.wxShow
      }
      tinytabbarUpdate_Put(tinytabbarUpdate_Body).then(response => {
        this.$modal.msgSuccess("修改成功");
        this.getList();
      });
    }
  }
};
</script>

