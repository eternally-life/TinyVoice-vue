
/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinymallcommoditysku/getSku
 * description:
 * summary: 通过商品ID 获取商品规格参数
 * tags: 商城 - 商品规格(通过)
 */
let monitorTinymallcommodityskuGetSku_Param = {
     commodityId: null,   /** 商品ID string required:false */
   }

export function monitorTinymallcommodityskuGetSku_Get(monitorTinymallcommodityskuGetSku_Param   ) {
    return request({
         url:`/monitor/tinymallcommoditysku/getSku`,
         method:'get',
                     params:monitorTinymallcommodityskuGetSku_Param

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallcommoditysku/update
 * description:
 * summary: 修改 商品规格 - 根据id更新非空值
 * tags: 商城 - 商品规格(通过)
 */
let monitorTinymallcommodityskuUpdate_Body = {
      price: null,   /** 价格=单位分 integer required: */
      specification: null,   /** 规格名 string required: */
      inventory: null,   /** 库存 integer required: */
      skuId: null,   /** $property.description integer required: */
      isShow: null,   /** 价格=单位分 integer required: */
    }

export function monitorTinymallcommodityskuUpdate_Put(   monitorTinymallcommodityskuUpdate_Body) {
    return request({
         url:`/monitor/tinymallcommoditysku/update`,
         method:'put',

                 data: monitorTinymallcommodityskuUpdate_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallcommoditysku/save
 * description:
 * summary: 新增 商品规格
 * tags: 商城 - 商品规格(通过)
 */
let monitorTinymallcommodityskuSave_Body = {
      price: null,   /** 价格=单位分 integer required: */
      specification: null,   /** 规格名 string required: */
      commodityId: null,   /** 商品ID integer required: */
      inventory: null,   /** 库存 integer required: */
    }

export function monitorTinymallcommodityskuSave_Post(   monitorTinymallcommodityskuSave_Body) {
    return request({
         url:`/monitor/tinymallcommoditysku/save`,
         method:'post',

                 data: monitorTinymallcommodityskuSave_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallcommoditysku/delete
 * description:
 * summary: 删除 商品规格 - 根据id删除
 * tags: 商城 - 商品规格(通过)
 */

export function monitorTinymallcommodityskuDelete_Delete( data  ) {
    return request({
         url:`/monitor/tinymallcommoditysku/delete`,
         method:'delete',
          data: data

})
}
/**  =========================================================================== ***/
export function monitorTinymallcommodityskuSaveBatch_Post(   data) {
  return request({
    url:`/monitor/tinymallcommoditysku/saveBatch`,
    method:'post',
    data: data
  })
}

