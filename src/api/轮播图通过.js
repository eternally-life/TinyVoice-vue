
/*** glowxq glowxq@163.com  2022-07-22 15:36:58  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/syscarousel/page
 * description:
 * summary: 分页获取 轮播图
 * tags: 轮播图(通过)
 */
let monitorSyscarouselPage_Param = {
     pageNum: null,   /** 第几页 string required:false */
     pageSize: null,   /** 页码大小 string required:false */
   }

export function monitorSyscarouselPage_Get(monitorSyscarouselPage_Param   ) {
    return request({
         url:`/monitor/syscarousel/page`,
         method:'get',
                     params:monitorSyscarouselPage_Param

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/syscarousel/save
 * description:
 * summary: 新增 轮播图
 * tags: 轮播图(通过)
 */
let monitorSyscarouselSave_Body = {
      name: null,   /** 轮播图名字 string required: */
      url: null,   /** 轮播图url string required: */
      content: null,   /** 轮播图文字介绍 string required: */
      jumpUrl: null,   /** 跳转url string required: */
    }

export function monitorSyscarouselSave_Post(   monitorSyscarouselSave_Body) {
    return request({
         url:`/monitor/syscarousel/save`,
         method:'post',

                 data: monitorSyscarouselSave_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/syscarousel/update
 * description:
 * summary: 修改 轮播图 - 根据id更新非空值
 * tags: 轮播图(通过)
 */
let monitorSyscarouselUpdate_Body = {
      carouselId: null,   /** 主键 integer required: */
      name: null,   /** 轮播图名字 string required: */
      url: null,   /** 轮播图url string required: */
      content: null,   /** 轮播图文字介绍 string required: */
      jumpUrl: null,   /** 跳转url string required: */
      isShow: null,   /** 是否显示=1-显示,0隐藏 integer required: */
    }

export function monitorSyscarouselUpdate_Put(   monitorSyscarouselUpdate_Body) {
    return request({
         url:`/monitor/syscarousel/update`,
         method:'put',

                 data: monitorSyscarouselUpdate_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/syscarousel/upload
 * description:
 * summary: 文件上传请求
 * tags: 轮播图(通过)
 */

export function monitorSyscarouselUpload_Post(   ) {
    return request({
         url:`/monitor/syscarousel/upload`,
         method:'post',


})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/syscarousel/delete
 * description:
 * summary: 删除 轮播图 - 根据id删除
 * tags: 轮播图(通过)
 */

export function monitorSyscarouselDelete_Delete( data  ) {
    return request({
         url:`/monitor/syscarousel/delete`,
         method:'delete',
      data:data


})
}
/**  =========================================================================== ***/
