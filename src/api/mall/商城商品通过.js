
/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinymallcommodity/delete
 * description:
 * summary: 删除 商品 - 根据id删除
 * tags: 商城 - 商品(通过)
 */

export function monitorTinymallcommodityDelete_Delete(  data ) {
    return request({
         url:`/monitor/tinymallcommodity/delete`,
         method:'delete',
      data:data


})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallcommodity/update
 * description:
 * summary: 修改 商品 - 根据id更新非空值
 * tags: 商城 - 商品(通过)
 */
let monitorTinymallcommodityUpdate_Body = {
      heat: null,   /** 热度 integer required: */
      image: null,   /** 商品的图片url string required: */
      mallId: null,   /** 商店id integer required: */
      name: null,   /** 商品名 string required: */
      remark: null,   /** 备注 string required: */
      commodityId: null,   /** $property.description integer required: */
      type: null,   /** 商品类型=1-虚拟商品,2-实体商品 integer required: */
      content: null,   /** 商品介绍 string required: */
      status: null,   /** 状态=1-在售,0-停售 integer required: */
      isShow: null,   /** 是否显示=1-显示,0-不显示 integer required: */
    }

export function monitorTinymallcommodityUpdate_Put(   monitorTinymallcommodityUpdate_Body) {
    return request({
         url:`/monitor/tinymallcommodity/update`,
         method:'put',

                 data: monitorTinymallcommodityUpdate_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallcommodity/save
 * description:
 * summary: 新增 商品
 * tags: 商城 - 商品(通过)
 */
let monitorTinymallcommoditySave_Body = {
      image: null,   /** 商品的图片url string required: */
      mallId: null,   /** 商店id integer required: */
      name: null,   /** 商品名 string required: */
      type: null,   /** 商品类型=1-虚拟商品,2-实体商品 integer required: */
      content: null,   /** 商品介绍 string required: */
    }

export function monitorTinymallcommoditySave_Post(   monitorTinymallcommoditySave_Body) {
    return request({
         url:`/monitor/tinymallcommodity/save`,
         method:'post',

                 data: monitorTinymallcommoditySave_Body
})
}
/**  =========================================================================== ***/
