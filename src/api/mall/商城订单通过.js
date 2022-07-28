
/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinymallorder/delete
 * description:
 * summary: 删除 商店订单 - 根据id删除
 * tags: 商城 - 订单(通过)
 */

export function monitorTinymallorderDelete_Delete( data  ) {
    return request({
         url:`/monitor/tinymallorder/delete`,
         method:'delete',
         data: data

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallorder/pageOrder
 * description:
 * summary: 分页获取 订单
 * tags: 商城 - 订单(通过)
 */
let monitorTinymallorderPageOrder_Param = {
     pageNum: null,   /** 第几页 string required:false */
     pageSize: null,   /** 页码大小 string required:false */
     mallId: null,   /** 商店ID string required:false */
     commodityId: null,   /** 商品ID string required:false */
     status: null,   /** 订单状态=1-已下单未付款,2-已付款,3-出库,4-订单完成,5-退款关闭订单,6-售后,7-售后完成 string required:false */
     screenTime: null,   /** 时间筛选-可为空 默认筛选3天 值为筛选第 n 天内微音 string required:false */
   }

export function monitorTinymallorderPageOrder_Get(monitorTinymallorderPageOrder_Param   ) {
    return request({
         url:`/monitor/tinymallorder/pageOrder`,
         method:'get',
                     params:monitorTinymallorderPageOrder_Param

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallorder/refund
 * description:
 * summary: 订单退款
 * tags: 商城 - 订单(通过)
 */
let monitorTinymallorderRefund_Body = {
      orderId: null,   /** 订单id-主键 string required: */
      statusValue: null,   /** 订单状态=文字描述 string required: */
      refund: null,   /** 退款金额 integer required: */
    }

export function monitorTinymallorderRefund_Put(   monitorTinymallorderRefund_Body) {
    return request({
         url:`/monitor/tinymallorder/refund`,
         method:'put',

                 data: monitorTinymallorderRefund_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallorder/update
 * description:
 * summary: 修改 商店订单 - 根据id更新非空值
 * tags: 商城 - 订单(通过)
 */
let monitorTinymallorderUpdate_Body = {
      orderId: null,   /** 订单id-主键 string required: */
      statusValue: null,   /** 订单状态=文字描述 string required: */
      status: null,   /** 订单状态=1-已下单未付款,2-已付款,3-出库,4-订单完成,5-退款关闭订单,6-售后,7-售后完成 integer required: */
    }

export function monitorTinymallorderUpdate_Put(   monitorTinymallorderUpdate_Body) {
    return request({
         url:`/monitor/tinymallorder/update`,
         method:'put',

                 data: monitorTinymallorderUpdate_Body
})
}
/**  =========================================================================== ***/
