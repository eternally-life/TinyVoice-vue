
/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinyserveresourcereply/delete
 * description:
 * summary: 删除 资源回复 - 根据id删除
 * tags: 资源回复表(通过)
 */

export function monitorTinyserveresourcereplyDelete_Delete( data  ) {
    return request({
         url:`/monitor/tinyserveresourcereply/delete`,
         method:'delete',
          data:data

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserveresourcereply/audit
 * description:
 * summary: 过审 回复 - 根据id过审
 * tags: 资源回复表(通过)
 */

export function monitorTinyserveresourcereplyAudit_Put(  data ) {
    return request({
         url:`/monitor/tinyserveresourcereply/audit`,
         method:'put',
         data:data

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserveresourcereply/page
 * description:
 * summary: 分页获取 资源回复
 * tags: 资源回复表(通过)
 */
let monitorTinyserveresourcereplyPage_Param = {
     pageNum: null,   /** 第几页 string required:false */
     pageSize: null,   /** 页码大小 string required:false */
   }

export function monitorTinyserveresourcereplyPage_Get(monitorTinyserveresourcereplyPage_Param   ) {
    return request({
         url:`/monitor/tinyserveresourcereply/page`,
         method:'get',
                     params:monitorTinyserveresourcereplyPage_Param

})
}
/**  =========================================================================== ***/
