<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="站点ID" prop="stationId">
        <el-input
          v-model="queryParams.stationId"
          placeholder="请输入快递站点id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="收货姓名" prop="nickName">
        <el-input
          v-model="queryParams.nickName"
          placeholder="请输入收货地址自定义姓名"
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
      <el-form-item label="送货员ID" prop="deliverymanUserId">
        <el-input
          v-model="queryParams.deliverymanUserId"
          placeholder="请输入送货人员的用户id"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="取件码" prop="pickupCode">
        <el-input
          v-model="queryParams.pickupCode"
          placeholder="请输入快递取件码"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="流水号" prop="serialNumber">
        <el-input
          v-model="queryParams.serialNumber"
          placeholder="请输入快递单32位流水号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系方式" prop="phonenumber">
        <el-input
          v-model="queryParams.phonenumber"
          placeholder="请输入联系方式=电话"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
<!--      <el-form-item label="付款时间戳" prop="payTime">-->
<!--        <el-input-->
<!--          v-model="queryParams.payTime"-->
<!--          placeholder="请输入付款时间戳"-->
<!--          clearable-->
<!--          @keyup.enter.native="handleQuery"-->
<!--        />-->
<!--      </el-form-item>-->
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
          v-hasPermi="['${moduleName}:order:add']"
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
          v-hasPermi="['${moduleName}:order:edit']"
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
          v-hasPermi="['${moduleName}:order:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['${moduleName}:order:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="订单ID" align="center" prop="orderId" />
<!--      <el-table-column label="快递类型id" align="center" prop="typeId" />-->
      <el-table-column label="站点ID" align="center" prop="stationId" />
      <el-table-column label="付款用户ID" align="center" prop="payUserId" />
<!--      <el-table-column label="收获地址id" align="center" prop="addrId" />-->
      <el-table-column label="真实姓名" align="center" prop="name" />
      <el-table-column label="收货地址自定义姓名" align="center" prop="nickName" />
      <el-table-column label="快递站名" align="center" prop="stationName" />
      <el-table-column label="送货人昵称" align="center" prop="deliverymanNickName" />
      <el-table-column label="送货人姓名" align="center" prop="deliverymanName" />
      <el-table-column label="送货人id" align="center" prop="deliverymanUserId" />
      <el-table-column label="送货人电话" align="center" prop="deliverymanPhonenumber" />
<!--      <el-table-column label="收货地址json" align="center" prop="addressJson" />-->
      <el-table-column :filters="[{text: '配送', value: 1}, {text: '定点取货', value: 2}]"
                       :filter-method="filterHandler"
                       label="送货类型" align="center" prop="deliveryType" />
      <el-table-column label="快递取件码" align="center" prop="pickupCode" />
      <el-table-column label="快递单流水号" align="center" prop="serialNumber" />
      <el-table-column label="微信付款订单号" align="center" prop="wxPayNumber" />
      <el-table-column label="总价-单位分" align="center" prop="totalPrice" />
      <el-table-column label="联系方式" align="center" prop="phonenumber" />
      <el-table-column label="订单购买数量" align="center" prop="quantity" />
      <el-table-column :filters="[{text: '下单未付款', value: 1}, {text: '已付款待取件', value: 2},
                                  {text: '已取出-未配送', value: 3}, {text: '已送达-订单完成', value: 4},
                                  {text: '退款-关闭订单', value: 5}]"
                       :filter-method="filterHandler"
                       label="订单状态" align="center" prop="status" />
<!--      <el-table-column label="订单状态" align="center" prop="statusValue" />-->
      <el-table-column label="取货时间" align="center" prop="receiptTime" />
      <el-table-column label="付款时间" align="center" prop="payTime" />
      <el-table-column label="备注" align="center" prop="remark" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['${moduleName}:order:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['${moduleName}:order:remove']"
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

    <!-- 添加或修改快递订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="快递站点id" prop="stationId">
          <el-input v-model="form.stationId" placeholder="请输入快递站点id" />
        </el-form-item>
        <el-form-item label="收获地址id" prop="addrId">
          <el-input v-model="form.addrId" placeholder="请输入收获地址id" />
        </el-form-item>
        <el-form-item label="真实姓名" prop="name">
          <el-input v-model="form.name" placeholder="请输入真实姓名" />
        </el-form-item>
        <el-form-item label="收货地址自定义姓名" prop="nickName">
          <el-input v-model="form.nickName" placeholder="请输入收货地址自定义姓名" />
        </el-form-item>
        <el-form-item label="快递站名" prop="stationName">
          <el-input v-model="form.stationName" placeholder="请输入快递站名" />
        </el-form-item>
        <el-form-item label="送货人员昵称" prop="deliverymanNickName">
          <el-input v-model="form.deliverymanNickName" placeholder="请输入送货人员昵称" />
        </el-form-item>
        <el-form-item label="送货人姓名" prop="deliverymanName">
          <el-input v-model="form.deliverymanName" placeholder="请输入送货人姓名" />
        </el-form-item>
        <el-form-item label="送货人员的用户id" prop="deliverymanUserId">
          <el-input v-model="form.deliverymanUserId" placeholder="请输入送货人员的用户id" />
        </el-form-item>
        <el-form-item label="送货人电话" prop="deliverymanPhonenumber">
          <el-input v-model="form.deliverymanPhonenumber" placeholder="请输入送货人电话" />
        </el-form-item>
        <el-form-item label="收货地址json" prop="addressJson">
          <el-input v-model="form.addressJson" type="textarea" placeholder="请输入内容" />
        </el-form-item>
        <el-form-item label="快递取件码" prop="pickupCode">
          <el-input v-model="form.pickupCode" placeholder="请输入快递取件码" />
        </el-form-item>
        <el-form-item label="快递单32位流水号" prop="serialNumber">
          <el-input v-model="form.serialNumber" placeholder="请输入快递单32位流水号" />
        </el-form-item>
        <el-form-item label="微信付款订单号" prop="wxPayNumber">
          <el-input v-model="form.wxPayNumber" placeholder="请输入微信付款订单号" />
        </el-form-item>
        <el-form-item label="联系方式=电话" prop="phonenumber">
          <el-input v-model="form.phonenumber" placeholder="请输入联系方式=电话" />
        </el-form-item>
        <el-form-item label="订单购买数量" prop="quantity">
          <el-input v-model="form.quantity" placeholder="请输入订单购买数量" />
        </el-form-item>
        <el-form-item label="订单状态=文字描述" prop="statusValue">
          <el-input v-model="form.statusValue" placeholder="请输入订单状态=文字描述" />
        </el-form-item>
        <el-form-item label="付款时间戳" prop="payTime">
          <el-input v-model="form.payTime" placeholder="请输入付款时间戳" />
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
//import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/${moduleName}/order";

export default {
  name: "Order",
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
      // 快递订单表格数据
      orderList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        typeId: null,
        stationId: null,
        payUserId: null,
        addrId: null,
        name: null,
        nickName: null,
        stationName: null,
        deliverymanNickName: null,
        deliverymanName: null,
        deliverymanUserId: null,
        deliverymanPhonenumber: null,
        addressJson: null,
        deliveryType: null,
        pickupCode: null,
        serialNumber: null,
        wxPayNumber: null,
        totalPrice: null,
        phonenumber: null,
        quantity: null,
        status: null,
        statusValue: null,
        receiptTime: null,
        payTime: null,
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
        stationId: [
          { required: true, message: "快递站点id不能为空", trigger: "blur" }
        ],
        payUserId: [
          { required: true, message: "付款用户id不能为空", trigger: "blur" }
        ],
        addrId: [
          { required: true, message: "收获地址id不能为空", trigger: "blur" }
        ],
        stationName: [
          { required: true, message: "快递站名不能为空", trigger: "blur" }
        ],
        addressJson: [
          { required: true, message: "收货地址json不能为空", trigger: "blur" }
        ],
        pickupCode: [
          { required: true, message: "快递取件码不能为空", trigger: "blur" }
        ],
        serialNumber: [
          { required: true, message: "快递单32位流水号不能为空", trigger: "blur" }
        ],
        totalPrice: [
          { required: true, message: "总价-单位分不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询快递订单列表 */
    getList() {
      this.loading = true;
      listOrder(this.queryParams).then(response => {
        this.orderList = response.rows;
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
        orderId: null,
        typeId: null,
        stationId: null,
        payUserId: null,
        addrId: null,
        name: null,
        nickName: null,
        stationName: null,
        deliverymanNickName: null,
        deliverymanName: null,
        deliverymanUserId: null,
        deliverymanPhonenumber: null,
        addressJson: null,
        deliveryType: null,
        pickupCode: null,
        serialNumber: null,
        wxPayNumber: null,
        totalPrice: null,
        phonenumber: null,
        quantity: null,
        status: 0,
        statusValue: null,
        receiptTime: null,
        payTime: null,
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
      this.ids = selection.map(item => item.orderId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加快递订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const orderId = row.orderId || this.ids
      getOrder(orderId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改快递订单";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.orderId != null) {
            updateOrder(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrder(this.form).then(response => {
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
      const orderIds = row.orderId || this.ids;
      this.$modal.confirm('是否确认删除快递订单编号为"' + orderIds + '"的数据项？').then(function() {
        return delOrder(orderIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('${moduleName}/order/export', {
        ...this.queryParams
      }, `order_${new Date().getTime()}.xlsx`)
    }
  }
};
</script>
