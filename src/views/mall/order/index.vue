<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--分类数据-->
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
            show-checkbox
            @check="handleCheckChange"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            highlight-current
          />
        </div>
      </el-col>
      <el-col :span="20" :xs="24">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
          <el-form-item label="订单ID" prop="orderId">
            <el-input
              v-model="queryParams.orderId"
              placeholder="请输入订单ID"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="商店" prop="mallId">
            <el-cascader
              :options="treeList"
              :props="props"
              collapse-tags
              @change="cascaderChange"
              clearable></el-cascader>
          </el-form-item>
          <el-form-item label="商品ID" prop="commodityId">
            <el-input
              v-model="queryParams.commodityId"
              placeholder="请输入商品ID"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="近期天数" prop="screenTime">
            <el-input
              v-model="queryParams.screenTime"
              placeholder="请输入近期天数"
              clearable
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>
          <el-form-item label="订单状态" prop="status">
            <el-select v-model="queryParams.status"  placeholder="请选择">
              <el-option
                v-for="item in dict.type.tiny_mall_order_status"
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

        <el-table v-loading="loading" :data="orderList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center" />
          <el-table-column label="商店ID" align="center" prop="mallIdList" />
          <el-table-column label="订单ID" align="center" prop="orderId" />
          <el-table-column label="购买的用户id" align="center" prop="payUserId" />
          <el-table-column label="地址ID" align="center" prop="addrId" />
          <el-table-column label="地址填的姓名" align="center" prop="addrName" />
          <el-table-column label="地址填的电话" align="center" prop="addrPhone" />
          <el-table-column show-overflow-tooltip label="地址json" align="center" prop="addrJson" />
          <!-- <el-table-column label="地址json" align="center" prop="addrJson" /> -->
          <el-table-column label="订单最后操作信息" align="center" prop="lastOperationUser" />
          <el-table-column label="商品32位流水号" align="center" prop="serialNumber" />
          <el-table-column label="微信付款订单号" align="center" prop="wxPayNumber" />
          <el-table-column label="四位取货码" align="center" prop="commodityNumber" />
          <el-table-column label="总价(分)" align="center" prop="totalPrice" />
          <el-table-column label="联系方式" align="center" prop="phonenumber" />
          <el-table-column :filters="dict.type.tiny_mall_order_status"
                           :filter-method="filterHandler"
                           label="订单状态" align="center" prop="status">
            <template slot-scope="scope">
              <dict-tag :options="dict.type.tiny_mall_order_status" :value="scope.row.status"/>
            </template>
          </el-table-column>
          <el-table-column label="订单状态描述" align="center" prop="statusValue" />
          <el-table-column label="备注" align="center" prop="remark" />
          <el-table-column label="付款时间" align="center" prop="payTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.payTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" prop="createTime">
            <template slot-scope="scope">
              <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
            </template>
          </el-table-column>
          <el-table-column label="支付验证数据" align="center" prop="payJson" />
          <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-zoom-in"
                @click="handleViewOrder(scope.$index, scope.row)"
                v-hasPermi="['${moduleName}:order:edit']"
              >查看订单</el-button>
              <!-- <el-button
                v-if="scope.row.status > 2"
                size="mini"
                type="text"
                icon="el-icon-sell"
                @click="handleRefund(scope.$index, scope.row)"
                v-hasPermi="['${moduleName}:order:edit']"
              >申请退款</el-button> -->
              <el-button
                size="mini"
                type="text"
                icon="el-icon-sell"
                @click="handleRefund(scope.$index, scope.row)"
                v-hasPermi="['${moduleName}:order:edit']"
              >申请退款</el-button>
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
      </el-col>
    </el-row>

    <!-- 添加或修改商店订单对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="editMallRules" label-width="80px">
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
    <!--申请退款对话框-->
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
//import { listOrder, getOrder, delOrder, addOrder, updateOrder } from "@/api/${moduleName}/order";

import {
  monitorTinymallorderDelete_Delete,
  monitorTinymallorderPageOrder_Get, monitorTinymallorderRefund_Put,
  monitorTinymallorderUpdate_Put
} from "@/api/mall/商城订单通过";
import {monitorTinymallPageMallType_Get} from "@/api/mall/商城商店分类通过";

export default {
  name: "Order",
  dicts: ['tiny_mall_order_status'],
  data() {
    return {
      props: {
        checkStrictly: true,
        value: 'mallId',
        label: "name",
        children: "children",
        multiple: true
      },
      treeList: [],
      schoolName: undefined,
      schoolOptions: null,
      defaultProps: {
        children: "children",
        label: "name"
      },
      refundFrom:{
        totalPrice:null,
        refundFromOpen: false,
        orderId: null,
        refund: null,
        statusValue: null
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
      // 商店订单表格数据
      orderList: [],
      orderList_addrsJson:[],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        mallId: null,
        commodityId: null,
        status: null,
        screenTime: null,
        orderId: null
      },
      // 表单参数
      form: {},
      editMallRules:{
        orderId: [
          { required: true, message: "订单ID不能为空", trigger: "blur" }
        ],
        status: [
          { required: true, message: "订单状态不能为空", trigger: "blur" }
        ],
        statusValue: [
          { required: true, message: "订单状态描述不能为空", trigger: "blur" }
        ]
      },
      // 表单校验
      rules: {
        payUserId: [
          { required: true, message: "购买的用户id不能为空", trigger: "blur" }
        ],
        serialNumber: [
          { required: true, message: "商品32位流水号不能为空", trigger: "blur" }
        ],
        totalPrice: [
          { required: true, message: "总价-单位分不能为空", trigger: "blur" }
        ],
      }
    };
  },
  created() {
    this.getList();
    this.getTreeselect();
  },
  methods: {
    /** 查询商店订单列表 */
    getList() {
      this.loading = true;
      monitorTinymallorderPageOrder_Get(this.queryParams).then(response => {
        this.orderList = response.data.records;
        for (let i = 0; i < this.orderList.length; i++) {
          const element="ID:"+JSON.parse(this.orderList[i].addrJson).addrId
                    +"; 姓名:"+JSON.parse(this.orderList[i].addrJson).name
                    +"; 手机号:"+JSON.parse(this.orderList[i].addrJson).phonenumber
                    +"; 学校名称:"+JSON.parse(this.orderList[i].addrJson).school
                    +"; 公寓楼:"+JSON.parse(this.orderList[i].addrJson).apartment
                    +"; 宿舍号:"+JSON.parse(this.orderList[i].addrJson).dormitoryNumber;
          this.orderList[i].addrJson=element;

        }

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
        orderId: null,
        status: null,
        statusValue: null
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
      this.title = "添加商店订单";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const orderId = row.orderId || this.ids
      if (this.ids.length > 0){
        this.queryParams.orderId = orderId[0]
      }
      if(row.orderId != null){
        this.queryParams.orderId = row.orderId
      }
      monitorTinymallorderPageOrder_Get(this.queryParams).then(response => {
        this.form = response.data.records[0];
        this.open = true;
        this.title = "修改商店订单";
      });
    },
    /** 提交按钮 */
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
    /** 筛选器 */
    filterHandler(value, row, column) {
      const property = column['property'];
      return row[property] === value;
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const orderIds = row.orderId || this.ids;
      this.$modal.confirm('是否确认删除商店订单编号为"' + orderIds + '"的数据项？').then(function() {
        return monitorTinymallorderDelete_Delete([orderIds]);
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
    },
    /** 提交申请退款对话框 */
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
    },
    /** 打开申请退款对话框 */
    handleRefund(index,row){
      this.resetForm('refundFrom')
      this.title = '申请退款'
      this.refundFrom.orderId = row.orderId
      this.refundFrom.totalPrice = row.totalPrice
      this.refundFrom.refundFromOpen = true
    },
    /** 跳转订单详情 */
    handleViewOrder(index, row){
      this.$router.push({path:'/mall/orderDetail',query:{order:row}})
    },
    /** 查询学校下拉树结构 */
    getTreeselect() {
      let treeList=[]
      this.getDicts("sys_common_school").then(response => {
        this.schoolOptions = response.data;
        this.schoolOptions.forEach(function(value,index,array){
          let treeNode = {}
          treeNode.id = response.data[index].dictCode
          treeNode.schoolId =  Number(response.data[index].dictValue)
          treeNode.name = response.data[index].dictLabel

          let monitorTinymallPageMallType_Param = {
            pageNum: 1,   /** 第几页 string required:false */
            pageSize: 999,   /** 页码大小 string required:false */
            schoolId: treeNode.schoolId,   /** 根据学校ID筛选 string required:false */
          }
          monitorTinymallPageMallType_Get(monitorTinymallPageMallType_Param).then(response => {
            treeNode.children = response.data.records
            treeList.push(treeNode)
          })
        })
        this.schoolOptions = treeList
        this.treeList = treeList
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    handleCheckChange(node,data){
      let mallIds = []
      if (data.checkedNodes.length === 1){
        this.queryParams.mallId = data.checkedNodes[0].mallId
        this.handleQuery();
      }else if (data.checkedNodes.length > 1){
        data.checkedNodes.forEach(item => {
          mallIds.push(item.mallId)
        })
        this.queryParams.mallId = mallIds.join(',')
        this.handleQuery();
      }else if (data.checkedNodes.length < 1){
        this.queryParams.mallId = null
        this.handleQuery();
      }
    },
    cascaderChange(value){
      const s = new Set();
      value.forEach(item => {
        item.forEach(item => {
          if (item != undefined){
            s.add(item)
          }
        })
      })
      this.queryParams.mallId = Array.from(s).join(',') === '' ? null : Array.from(s).join(',')
    }
  }
};
</script>
