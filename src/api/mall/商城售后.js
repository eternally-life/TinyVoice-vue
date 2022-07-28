
/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinymallafter/update
 * description: 
 * summary: 完成售后 - 根据id更新非空值
 * tags: 商城 - 售后
 */
let monitorTinymallafterUpdate_Param = {
     afterId: null,   /**  string required:false */
   }
    
export function monitorTinymallafterUpdate_Put(monitorTinymallafterUpdate_Param   ) {
    return request({
         url:`/monitor/tinymallafter/update`,
         method:'put',
                     params:monitorTinymallafterUpdate_Param  
                
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallafter/delete
 * description: 
 * summary: 删除 售后 - 根据id删除
 * tags: 商城 - 售后
 */
    
export function monitorTinymallafterDelete_Delete(   ) {
    return request({
         url:`/monitor/tinymallafter/delete`,
         method:'delete',
                      
                
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymallafter/page
 * description: 
 * summary: 分页获取 售后信息
 * tags: 商城 - 售后
 */
let monitorTinymallafterPage_Param = {
     pageNum: null,   /** 第几页 string required:false */
     pageSize: null,   /** 页码大小 string required:false */
     status: null,   /** 售后状态=1-完成,0-进行中 string required:false */
   }
    
export function monitorTinymallafterPage_Get(monitorTinymallafterPage_Param   ) {
    return request({
         url:`/monitor/tinymallafter/page`,
         method:'get',
                     params:monitorTinymallafterPage_Param  
                
})
}
/**  =========================================================================== ***/
