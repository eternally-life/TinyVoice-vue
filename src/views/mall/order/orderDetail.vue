<template> 
  <div class="detail-container">
    <div>
      <el-steps :active="order.status" finish-status="success" align-center>
        <el-step title="已下单未付款" :description="1"></el-step>
        <el-step title="已付款" :description="2"></el-step>
        <el-step title="出库" :description="3"></el-step>
        <el-step title="订单完成" :description="4"></el-step>
        <el-step v-if="order.status > 4" title="退款关闭订单" :description="4"></el-step>
        <el-step v-if="order.status > 4" title="售后" :description="4"></el-step>
        <el-step v-if="order.status > 4" title="售后完成" :description="4"></el-step>
      </el-steps>
    </div>
    <el-card shadow="never" style="margin-top: 15px">
      <div class="operate-container">
        <i class="el-icon-warning color-danger" style="margin-left: 20px"></i>
        <span class="color-danger">当前订单状态：{{order.statusValue}}</span>
        <div class="operate-button-container">
          <el-button v-hasPermi="['mall:order:refund']" v-if="order.status > 2" size="mini" @click="handleRefund(order)">申请退款</el-button>
          <el-button v-hasPermi="['mall:order:update']" size="mini" @click="handleUpdate(order)">修改订单</el-button>
          <el-button v-hasPermi="['mall:order:remove']" size="mini" type="danger" @click="handleDelete(order)">删除订单</el-button>
        </div>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="form" style="color: #606266"></svg-icon>
        <span class="font-small">基本信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="4" class="table-cell-title">订单编号</el-col>
          <el-col :span="7" class="table-cell-title">流水号</el-col>
          <el-col :span="3" class="table-cell-title">订单用户ID</el-col>
          <el-col :span="2" class="table-cell-title">取货码</el-col>
          <el-col :span="4" class="table-cell-title">微信付款订单号</el-col>
          <el-col :span="4" class="table-cell-title">订单备注</el-col>
        </el-row>
        <el-row>
          <el-col :span="4" class="table-cell">{{order.orderId}}</el-col>
          <el-col :span="7" class="table-cell">{{order.serialNumber}}</el-col>
          <el-col :span="3" class="table-cell">{{order.payUserId}}</el-col>
          <el-col v-if="order.commodityNumber !== null" :span="2" class="table-cell">{{order.commodityNumber}}</el-col>
          <el-col v-else :span="4" class="table-cell">暂无</el-col>
          <el-col v-if="order.wxPayNumber !== null" :span="4" class="table-cell">{{order.wxPayNumber}}</el-col>
          <el-col v-else :span="4" class="table-cell">暂无</el-col>
          <el-col :span="4" class="table-cell">{{order.remark}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="user" style="color: #606266"></svg-icon>
        <span class="font-small">收货人信息</span>
      </div>
      <div class="table-layout">
        <el-row>
          <el-col :span="6" class="table-cell-title">收货人</el-col>
          <el-col :span="6" class="table-cell-title">手机号码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址编码</el-col>
          <el-col :span="6" class="table-cell-title">收货地址JSON</el-col>
        </el-row>
        <el-row>
          <el-col :span="6" class="table-cell">{{order.addrName}}</el-col>
          <el-col :span="6" class="table-cell">{{order.addrPhone}}</el-col>
          <el-col :span="6" class="table-cell">{{order.addrId}}</el-col>
          <el-col :span="6" class="table-cell">{{order.addrJson}}</el-col>
        </el-row>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="shopping" style="color: #606266"></svg-icon>
        <span class="font-small">商品信息</span>
      </div>
      <el-table
        ref="orderItemTable"
        :data="order.orderDataList"
        style="width: 100%;margin-top: 20px" border>
        <el-table-column label="商店ID" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.mallId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品ID" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.commodityId}}</p>
          </template>
        </el-table-column>
        <el-table-column label="商品图片" width="120" align="center">
          <template slot-scope="scope">
            <image-preview :src="scope.row.image" :width="50" :height="50"/>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.commodityName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="单价(分)" width="120" align="center">
          <template slot-scope="scope">
            <p>{{scope.row.unitPrice}}</p>
          </template>
        </el-table-column>
        <el-table-column label="规格" width="120" align="center">
          <template slot-scope="scope">
           <p>规格ID:{{scope.row.skuId}}</p>
            <p>规格名：{{scope.row.specificationName}}</p>
          </template>
        </el-table-column>
        <el-table-column label="数量" width="120" align="center">
          <template slot-scope="scope">
            {{scope.row.quantity}}
          </template>
        </el-table-column>
        <el-table-column label="总计(分)" width="120" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.totalPrice}}</span>
          </template>
        </el-table-column>
      </el-table>
      <div style="float: right;margin: 20px">
        合计：<span style="color: red">{{order.totalPrice}}(分)</span>
      </div>
      <div style="margin-top: 20px">
        <svg-icon icon-class="job" style="color: #606266"></svg-icon>
        <span class="font-small">操作信息</span>
      </div>
      <el-table style="margin-top: 20px;width: 100%"
                ref="orderHistoryTable"
                :data="order.lastOperationUser" border>
        <el-table-column label="描述" align="center">
          <template slot-scope="scope">
            {{this.order.lastOperationUser}}
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加或修改商店订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单ID" prop="orderId">
          <el-input :disabled=true v-model="form.orderId" placeholder="请输入订单ID" />
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="form.status" placeholder="请选择">
            <el-option
              v-for="dict in dict.type.tiny_mall_order_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态描述" prop="status">
          <el-input v-model="form.statusValue" placeholder="请输入状态描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <el-dialog :title="title" :visible.sync="refundFrom.refundFromOpen" width="500px">
      <el-form ref="refundFrom" :model="refundFrom" :rules="rules" label-width="80px">
        <el-form-item label="订单id" prop="orderId">
          <el-input v-model="refundFrom.orderId" :disabled="true" placeholder="请输入订单id" />
        </el-form-item>
        <el-form-item label="订单金额" prop="orderId">
          <el-input v-model="refundFrom.totalPrice" :disabled="true">
            <template slot="append">(分)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="退款金额" prop="refund">
          <el-input v-model="refundFrom.refund" placeholder="请输入退款金额">
            <template slot="append">(分)</template>
          </el-input>
        </el-form-item>
        <el-form-item label="状态描述" prop="statusValue">
          <el-input v-model="refundFrom.statusValue" placeholder="请输入订单状态描述" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitRefundFrom">确 定</el-button>
        <el-button @click="refundFrom.refundFromOpen = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  monitorTinymallorderDelete_Delete,
  monitorTinymallorderRefund_Put,
  monitorTinymallorderUpdate_Put
} from "@/api/mall/商城订单通过";

export default {
  name: 'orderDetail',
  dicts: ['tiny_mall_order_status'],
  data() {
    return {
      refundFrom:{
        totalPrice: null,
        refundFromOpen: false,
        orderId: null,
        refund: null,
        statusValue: null
      },
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 表单参数
      form: {},
      id: null,
      order: {
        orderId: null,
        payUserId: null,
        addrId: null,
        addrName: null,
        addrPhone: null,
        addrJson: null,
        lastOperationUser: null,
        serialNumber: null,
        wxPayNumber: null,
        commodityNumber: null,
        totalPrice: null,
        phonenumber: null,
        status: null,
        statusValue: null,
        remark: null,
        payTime: null,
        createTime: null,
        orderDataList: []
      }
    }
  },
  created() {
    this.order = this.$route.query.order
  },
  methods: {
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        orderId: null,
        status: null,
        statusValue: null
      };
      this.resetForm("form");
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const orderId = row.orderId;
      this.form = row;
      this.open = true;
      this.title = "修改商店订单";
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId;
      this.$modal.confirm('是否确认删除商店订单编号为"' + orderIds + '"的数据项？').then(function() {
        return monitorTinymallorderDelete_Delete([orderIds]);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.orderId != null) {
            let monitorTinymallorderUpdate_Body = {
              orderId: this.form.orderId,   /** 订单id-主键 string required: */
              statusValue: this.form.statusValue,   /** 订单状态=文字描述 string required: */
              status: this.form.status,   /** 订单状态=1-已下单未付款,2-已付款,3-出库,4-订单完成,5-退款关闭订单,6-售后,7-售后完成 integer required: */
            }
            monitorTinymallorderUpdate_Put(monitorTinymallorderUpdate_Body).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    handleRefund(order){
      this.title = '申请退款'
      this.refundFrom.orderId = order.orderId
      this.refundFrom.totalPrice = order.totalPrice
      this.refundFrom.refund = null;
      this.refundFrom.statusValue = null;
      this.refundFrom.refundFromOpen = true
    },
    submitRefundFrom(){
      let monitorTinymallorderRefund_Body = {
        orderId: this.refundFrom.orderId,   /** 订单id-主键 string required: */
        statusValue: this.refundFrom.statusValue,   /** 订单状态=文字描述 string required: */
        refund: Number(this.refundFrom.refund)   /** 退款金额 integer required: */
      }
      monitorTinymallorderRefund_Put(monitorTinymallorderRefund_Body).then(response => {
        this.$modal.msgSuccess("退款成功");
        this.refundFrom.refundFromOpen = false;
        this.getList();
      });
    }
  }
}
</script>
<style scoped>
.detail-container {
  width: 80%;
  padding: 20px 20px 20px 20px;
  margin: 20px auto;
}

.operate-container {
  background: #F2F6FC;
  height: 80px;
  margin: -20px -20px 0;
  line-height: 80px;
}

.operate-button-container {
  float: right;
  margin-right: 20px
}

.table-layout {
  margin-top: 20px;
  border-left: 1px solid #DCDFE6;
  border-top: 1px solid #DCDFE6;
}

.table-cell {
  height: 60px;
  line-height: 40px;
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  font-size: 14px;
  color: #606266;
  text-align: center;
  overflow: hidden;
}

.table-cell-title {
  border-right: 1px solid #DCDFE6;
  border-bottom: 1px solid #DCDFE6;
  padding: 10px;
  background: #F2F6FC;
  text-align: center;
  font-size: 14px;
  color: #303133;
}
</style>


