
/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinyserveresource/delete
 * description:
 * summary: 删除 资源共享 - 根据id删除
 * tags: 资源共享(测通)
 */

export function monitorTinyserveresourceDelete_Delete(  data ) {
    return request({
         url:`/monitor/tinyserveresource/delete`,
         method:'delete',
          data:data

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserveresource/audit
 * description:
 * summary: 过审 资源共享 - 根据id过审
 * tags: 资源共享(测通)
 */

export function monitorTinyserveresourceAudit_Put( data  ) {
    return request({
         url:`/monitor/tinyserveresource/audit`,
         method:'put',
        data:data

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserveresource/page
 * description:
 * summary: 分页获取 资源共享
 * tags: 资源共享(测通)
 */
let monitorTinyserveresourcePage_Param = {
     pageNum: null,   /** 第几页 string required:false */
     pageSize: null,   /** 页码大小 string required:false */
   }

export function monitorTinyserveresourcePage_Get(monitorTinyserveresourcePage_Param   ) {
    return request({
         url:`/monitor/tinyserveresource/page`,
         method:'get',
                     params:monitorTinyserveresourcePage_Param

})
}
/**  =========================================================================== ***/
