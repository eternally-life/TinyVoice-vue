
/*** glowxq glowxq@163.com  2022-08-28 20:31:28  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /tinytabbar/byId
 * description:
 * summary: 获取单个 tabbar页面 - 根据id获取
 * tags: tabbar页面
 */
let tinytabbarById_Param = {
  tinyTabbarId: null,   /**  string required:false */
   }

export function tinytabbarById_Get(tinytabbarById_Param   ) {
    return request({
         url:`/monitor/tinytabbar/byId`,
         method:'get',
          params:tinytabbarById_Param

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /tinytabbar/save
 * description:
 * summary: 新增 tabbar页面
 * tags: tabbar页面
 */
let tinytabbarSave_Body = {
      path: null,   /** 路劲 string required: */
      unCheckedIcon: null,   /** 未选择时候的icon string required: */
      checkedIcon: null,   /** 选择的icon string required: */
      createTime: null,   /** 创建的时间戳 integer required: */
      name: null,   /** 名字 string required: */
      id: null,   /** $property.description integer required: */
      isShow: null,   /** 1显示,0隐藏 integer required: */
    }

export function tinytabbarSave_Post(   tinytabbarSave_Body) {
    return request({
         url:`/monitor/tinytabbar/save`,
         method:'post',

                 data: tinytabbarSave_Body
})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /tinytabbar/delete
 * description:
 * summary: 删除 tabbar页面 - 根据id删除
 * tags: tabbar页面
 */

export function tinytabbarDelete_Delete( data  ) {
    return request({
         url:`/monitor/tinytabbar/delete`,
         method:'delete',
          data:data


})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /tinytabbar/page
 * description:
 * summary: 分页获取 tabbar页面
 * tags: tabbar页面
 */
let tinytabbarPage_Param = {
     pageNum: null,   /** 第几页 string required:false */
     pageSize: null,   /** 页码大小 string required:false */
   }

export function tinytabbarPage_Get(tinytabbarPage_Param   ) {
    return request({
         url:`/monitor/tinytabbar/page`,
         method:'get',
                     params:tinytabbarPage_Param

})
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /tinytabbar/update
 * description:
 * summary: 修改 tabbar页面 - 根据id更新非空值
 * tags: tabbar页面
 */
let tinytabbarUpdate_Body = {
      path: null,   /** 路劲 string required: */
      unCheckedIcon: null,   /** 未选择时候的icon string required: */
      checkedIcon: null,   /** 选择的icon string required: */
      createTime: null,   /** 创建的时间戳 integer required: */
      name: null,   /** 名字 string required: */
      id: null,   /** $property.description integer required: */
      isShow: null,   /** 1显示,0隐藏 integer required: */
    }

export function tinytabbarUpdate_Put(   tinytabbarUpdate_Body) {
    return request({
         url:`/monitor/tinytabbar/update`,
         method:'put',

                 data: tinytabbarUpdate_Body
})
}
/**  =========================================================================== ***/
