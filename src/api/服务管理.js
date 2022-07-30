
/*** glowxq glowxq@163.com  2022-07-31 00:26:14  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinyserve/update
 * description:
 * summary: 修改 服务管理 - 根据id更新非空值
 * tags: 服务管理
 */
let monitorTinyserveUpdate_Body = {
      jumpType: null,   /** 跳转类型=1-普通页面,2-tabbar页面,3-网页,4-小程序 integer required: */
      image: null,   /** 图片图标 string required: */
      iconType: null,   /** 图标类型-1icon图标,2图片图标 string required: */
      name: null,   /** 工具名 string required: */
      icon: null,   /** icon图标 string required: */
      serveId: null,   /** $property.description integer required: */
      jumpUrl: null,   /** 跳转地址 string required: */
      isShow: null,   /** 是否显示=1-显示,0-隐藏 integer required: */
    }

export function monitorTinyserveUpdate_Put(   monitorTinyserveUpdate_Body) {
    return request({
         url:`/monitor/tinyserve/update`,
         method:'put',

                 data: monitorTinyserveUpdate_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserve/delete
 * description:
 * summary: 删除 服务管理 - 根据id删除
 * tags: 服务管理
 */

export function monitorTinyserveDelete_Delete( data  ) {
    return request({
         url:`/monitor/tinyserve/delete`,
         method:'delete',
         data: data

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserve/byId
 * description:
 * summary: 获取单个 服务管理 - 根据id获取
 * tags: 服务管理
 */
let monitorTinyserveById_Param = {
     tinyServeId: null,   /**  string required:false */
   }

export function monitorTinyserveById_Get(monitorTinyserveById_Param   ) {
    return request({
         url:`/monitor/tinyserve/byId`,
         method:'get',
                     params:monitorTinyserveById_Param

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserve/page
 * description:
 * summary: 分页获取 服务管理
 * tags: 服务管理
 */
let monitorTinyservePage_Param = {
     pageNum: null,   /** 第几页 string required:false */
     pageSize: null,   /** 页码大小 string required:false */
   }

export function monitorTinyservePage_Get(monitorTinyservePage_Param   ) {
    return request({
         url:`/monitor/tinyserve/page`,
         method:'get',
                     params:monitorTinyservePage_Param

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinyserve/save
 * description:
 * summary: 新增 服务管理
 * tags: 服务管理
 */
let monitorTinyserveSave_Body = {
      jumpType: null,   /** 跳转类型=1-普通页面,2-tabbar页面,3-网页,4-小程序 integer required: */
      image: null,   /** 图片图标 string required: */
      iconType: null,   /** 图标类型-1icon图标,2图片图标 string required: */
      name: null,   /** 工具名 string required: */
      icon: null,   /** icon图标 string required: */
      jumpUrl: null,   /** 跳转地址 string required: */
    }

export function monitorTinyserveSave_Post(   monitorTinyserveSave_Body) {
    return request({
         url:`/monitor/tinyserve/save`,
         method:'post',

                 data: monitorTinyserveSave_Body
})
}
/**  =========================================================================== ***/
