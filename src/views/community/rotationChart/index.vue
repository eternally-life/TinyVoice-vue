<template>
  <div class="app-container">
<!--    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">-->
<!--      <el-form-item label="轮播图名字" prop="name" label-width="100px">-->
<!--        <el-input-->
<!--          v-model="queryParams.name"-->
<!--          placeholder="请输入轮播图名字"-->
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
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['${moduleName}:carousel:add']"
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
          v-hasPermi="['${moduleName}:carousel:edit']"
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
          v-hasPermi="['${moduleName}:carousel:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['${moduleName}:carousel:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="carouselList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="轮播图ID" align="center" prop="carouselId" />
      <el-table-column show-overflow-tooltip label="轮播图url" align="center" prop="url"/>
      <el-table-column label="轮播图" align="center" prop="url">
          <template slot-scope="scope">
            <image-preview :src="scope.row.url" :width="50" :height="50"/>
          </template>
      </el-table-column>
      <el-table-column label="轮播图名字" align="center" prop="name" />
      <el-table-column label="轮播图文字介绍" align="center" prop="content" />
      <el-table-column label="跳转URL" align="center" prop="jumpUrl" />
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
            v-hasPermi="['${moduleName}:carousel:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['${moduleName}:carousel:remove']"
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

    <!-- 添加或修改轮播图对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="轮播图ID" prop="name" v-if="form.carouselId !=null">
          <el-input :disabled=true v-model="form.carouselId" placeholder="请输入轮播图ID" />
        </el-form-item>
        <el-form-item label="轮播图" prop="url">
          <image-upload v-model="form.url"/>
        </el-form-item>
        <el-form-item label="轮播图名字" prop="name">
          <el-input v-model="form.name" placeholder="请输入轮播图名字" />
        </el-form-item>
        <el-form-item label="轮播图文字介绍">
          <editor v-model="form.content" :min-height="192"/>
        </el-form-item>
        <el-form-item label="跳转URL" prop="jumpUrl">
          <el-input v-model="form.jumpUrl" placeholder="请输入跳转url" />
        </el-form-item>
        <el-form-item v-if="form.carouselId !=null" label="是否显示" prop="isShow">
          <el-select v-model="form.isShow" clearable placeholder="请选择">
            <el-option
              v-for="dict in dict.type.common_is_show"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
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
//import { listCarousel, getCarousel, delCarousel, addCarousel, updateCarousel } from "@/api/${moduleName}/carousel";

import {
  monitorSyscarouselDelete_Delete,
  monitorSyscarouselPage_Get,
  monitorSyscarouselSave_Post,
  monitorSyscarouselUpdate_Put
} from "@/api/轮播图通过";

export default {
  name: "Carousel",
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
      // 轮播图表格数据
      carouselList: [],
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
        url: [
          { required: true, message: "轮播图url不能为空", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询轮播图列表 */
    getList() {
      this.loading = true;
      monitorSyscarouselPage_Get(this.queryParams).then(response => {
        this.carouselList = response.data.records;
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
        carouselId: null,
        url: null,
        name: null,
        content: null,
        jumpUrl: null,
        isShow: null
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
      this.ids = selection.map(item => item.carouselId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加轮播图";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const carouselId = row.carouselId || this.ids
      this.form = row;
      this.open = true;
      this.title = "修改轮播图";
      // getCarousel(carouselId).then(response => {
      //   this.form = response.data;
      //   this.open = true;
      //   this.title = "修改轮播图";
      // });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.carouselId != null) {
            let monitorSyscarouselUpdate_Body = {
              carouselId: this.form.carouselId,   /** 主键 integer required: */
              name: this.form.name,   /** 轮播图名字 string required: */
              url: this.form.url,   /** 轮播图url string required: */
              content: this.form.content,   /** 轮播图文字介绍 string required: */
              jumpUrl: this.form.jumpUrl,   /** 跳转url string required: */
              isShow: this.form.isShow,   /** 是否显示=1-显示,0隐藏 integer required: */
            }
            monitorSyscarouselUpdate_Put(monitorSyscarouselUpdate_Body).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            let monitorSyscarouselSave_Body = {
              name: this.form.name,   /** 轮播图名字 string required: */
              url: this.form.url,   /** 轮播图url string required: */
              content: this.form.content,   /** 轮播图文字介绍 string required: */
              jumpUrl: this.form.jumpUrl,   /** 跳转url string required: */
            }
            monitorSyscarouselSave_Post(monitorSyscarouselSave_Body).then(response => {
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
      const carouselIds = row.carouselId || this.ids;
      let deleteBody = []
      if (carouselIds instanceof Array){
        deleteBody = carouselIds
      }else {
        deleteBody = [carouselIds]
      }
      this.$modal.confirm('是否确认删除轮播图编号为"' + carouselIds + '"的数据项？').then(function() {
        return monitorSyscarouselDelete_Delete(deleteBody);
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
      this.download('${moduleName}/carousel/export', {
        ...this.queryParams
      }, `carousel_${new Date().getTime()}.xlsx`)
    },
    // 修改是否显示
    handleIsShowChange(index,row){
      let monitorSyscarouselUpdate_Body={
              carouselId: row.carouselId,
              name: row.name,
              url: row.url,
              content: row.content,
              jumpUrl: row.jumpUrl,
              isShow: row.isShow,
      }
      monitorSyscarouselUpdate_Put(monitorSyscarouselUpdate_Body).then(response => {
              console.log(monitorSyscarouselUpdate_Body);
              this.$modal.msgSuccess("修改成功");
              this.getList();
            });

    }
  }
};
</script>
