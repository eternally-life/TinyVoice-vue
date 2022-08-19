<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="服务ID" prop="tinyServeId">
        <el-input
          v-model="queryParams.tinyServeId"
          placeholder="请输入服务ID"
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
          v-hasPermi="['${moduleName}:serve:add']"
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
          v-hasPermi="['${moduleName}:serve:edit']"
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
          v-hasPermi="['${moduleName}:serve:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['${moduleName}:serve:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="serveList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="服务ID" align="center" prop="serveId" />
      <el-table-column label="工具名" align="center" prop="name" />
      <el-table-column label="图片图标" align="center" prop="image" width="100">
        <template slot-scope="scope">
          <image-preview :src="scope.row.image" :width="50" :height="50"/>
        </template>
      </el-table-column>
      <el-table-column :filters="dict.type.tiny_serve_icon_type"
                      :filter-method="filterHandler"
                      label="图标类型" align="center" prop="iconType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tiny_serve_icon_type" :value="scope.row.iconType"/>
        </template>
      </el-table-column>
      <el-table-column show-tooltip-when-overflow label="Param" align="center" prop="param" />
      <el-table-column label="icon图标" align="center" prop="icon" />
      <el-table-column label="跳转地址" align="center" prop="jumpUrl" />
      <el-table-column :filters="dict.type.tiny_serve_jump_type"
                      :filter-method="filterHandler"
                      label="跳转类型" align="center" prop="jumpType">
        <template slot-scope="scope">
          <dict-tag :options="dict.type.tiny_serve_jump_type" :value="scope.row.jumpType"/>
        </template>
      </el-table-column>
            <el-table-column label="appid" align="center" prop="appId" />
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
      <el-table-column label="创建时间" align="center" prop="createTime" width="180">
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
            v-hasPermi="['${moduleName}:serve:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['${moduleName}:serve:remove']"
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

    <!-- 添加或修改服务管理对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item v-if="form.serveId !=null" label="服务ID" prop="serveId">
          <el-input v-model="form.serveId" placeholder="请输入工具名" />
        </el-form-item>
        <el-form-item label="工具名" prop="name">
          <el-input v-model="form.name" placeholder="请输入工具名" />
        </el-form-item>
        <el-form-item label="图片图标">
          <image-upload v-model="form.image"/>
        </el-form-item>
        <el-form-item label="图标类型" prop="iconType">
          <el-select v-model="form.iconType" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.tiny_serve_icon_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="icon图标" prop="icon">
          <el-input v-model="form.icon" placeholder="请输入icon图标" />
        </el-form-item>
        <el-form-item label="跳转地址" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" placeholder="请输入跳转地址" />
        </el-form-item>
        <el-form-item label="跳转类型" prop="jumpType">
          <el-select v-model="form.jumpType" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.tiny_serve_jump_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="form.jumpType==4" label="AppId" prop="appId">
          <el-input v-model="form.appId" placeholder="请输入appid" />
        </el-form-item>
        <el-form-item v-if="form.serveId !=null" label="是否显示" prop="isShow">
          <el-select v-model="form.isShow" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.common_is_show"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="this.form.jumpType===3" label="param" prop="param">
          <el-input v-model="form.param" placeholder="请输入param" />
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
  monitorTinyserveById_Get, monitorTinyserveDelete_Delete,
  monitorTinyservePage_Get,
  monitorTinyserveSave_Post,
  monitorTinyserveUpdate_Put
} from "@/api/服务管理";

export default {
  name: "Serve",
  dicts: ['common_is_show','tiny_serve_jump_type','tiny_serve_icon_type'],
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
      // 服务管理表格数据
      serveList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tinyServeId: null
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
    /** 查询服务管理列表 */
    getList() {
      this.loading = true;
      monitorTinyservePage_Get(this.queryParams).then(response => {
        this.serveList = response.data.records;
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
        serveId: null,
        name: null,
        image: null,
        iconType: null,
        icon: null,
        jumpUrl: null,
        jumpType: null,
        isShow: null,
        createTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      // this.queryParams.pageNum = 1;
      // this.getList();
      monitorTinyserveById_Get({tinyServeId: this.queryParams.tinyServeId}).then(response => {
        this.serveList = [response.data];
        this.total = 1;
      })
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.serveId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加服务管理";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      let serveId = row.serveId || this.ids
      let monitorTinyserveById_Param = {
        tinyServeId: serveId,   /**  string required:false */
      }
      if (this.ids.length > 0){
        monitorTinyserveById_Param.tinyServeId = this.ids[0]
      }
      if(row.serveId != null){
        monitorTinyserveById_Param.tinyServeId = row.serveId
      }
      monitorTinyserveById_Get(monitorTinyserveById_Param).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改服务管理";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.serveId != null) {
            let monitorTinyserveUpdate_Body = {
              jumpType: this.form.jumpType,   /** 跳转类型=1-普通页面,2-tabbar页面,3-网页,4-小程序 integer required: */
              image: this.form.image,   /** 图片图标 string required: */
              iconType: this.form.iconType,   /** 图标类型-1icon图标,2图片图标 string required: */
              name: this.form.name,   /** 工具名 string required: */
              icon: this.form.icon,   /** icon图标 string required: */
              serveId: this.form.serveId,   /** $property.description integer required: */
              jumpUrl: this.form.jumpUrl,   /** 跳转地址 string required: */
              isShow: this.form.isShow,   /** 是否显示=1-显示,0-隐藏 integer required: */
              param: this.form.param
            }
            monitorTinyserveUpdate_Put(monitorTinyserveUpdate_Body).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let monitorTinyserveSave_Body = {
              jumpType: this.form.jumpType,   /** 跳转类型=1-普通页面,2-tabbar页面,3-网页,4-小程序 integer required: */
              image: this.form.image,   /** 图片图标 string required: */
              iconType: this.form.iconType,   /** 图标类型-1icon图标,2图片图标 string required: */
              name: this.form.name,   /** 工具名 string required: */
              icon: this.form.icon,   /** icon图标 string required: */
              jumpUrl: this.form.jumpUrl,   /** 跳转地址 string required: */
              appId:this.form.appId,
              param: this.form.param
            }
            monitorTinyserveSave_Post(monitorTinyserveSave_Body).then(response => {
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
      let serveIds = row.serveId || this.ids;
      if (this.ids.length > 0){
        serveIds = this.ids
      }
      if(row.serveId != null){
        serveIds = [row.serveId]
      }
      this.$modal.confirm('是否确认删除服务管理编号为"' + serveIds + '"的数据项？').then(function() {
        return monitorTinyserveDelete_Delete(serveIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/serve/export', {
        ...this.queryParams
      }, `serve_${new Date().getTime()}.xlsx`)
    },
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    handleIsShowChange(index,row){
      let monitorTinyserveUpdate_Body = {
        serveId: row.serveId,   /** $property.description integer required: */
        isShow: row.isShow   /** 是否显示=1-显示,0-隐藏 integer required: */
      }
      monitorTinyserveUpdate_Put( monitorTinyserveUpdate_Body).then( response => {
        this.$modal.msgSuccess("修改成功")
        this.getList();
      })
    }
  }
};
</script>
