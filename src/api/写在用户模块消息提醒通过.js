
/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/sysmsg/save
 * description: 
 * summary: 新增 消息提醒
 * tags: 写在用户模块-消息提醒(通过)
 */
let monitorSysmsgSave_Body = {
      oppositeUserId: null,   /** 接收方用户ID integer required: */
      type: null,   /** 消息类型=1-官方,2-微音,3-商城,4-快递,5-个人,6-其他 integer required: */
      content: null,   /** 消息内容 string required: */
    }
    
export function monitorSysmsgSave_Post(   monitorSysmsgSave_Body) {
    return request({
         url:`/monitor/sysmsg/save`,
         method:'post',
                      
                 data: monitorSysmsgSave_Body
})
}
/**  =========================================================================== ***/
