/*** glowxq glowxq@163.com  2022-07-22 15:36:57  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinymall/delete
 * description:
 * summary: 删除 商店/分类 - 根据id删除
 * tags: 商城 - 商店/分类(通过)
 */

export function monitorTinymallDelete_Delete(data) {
    return request({
        url: `/monitor/tinymall/delete`,
        method: 'delete',
        data: data

    })
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymall/pageMall
 * description:
 * summary: 分页获取 分类及其商品
 * tags: 商城 - 商店/分类(通过)
 */
let monitorTinymallPageMall_Param = {
    pageNum: null,
    /** 第几页 string required:false */
    pageSize: null,
    /** 页码大小 string required:false */
    schoolId: null,
    /** 根据商店ID筛选 string required:false */
    name: null,
    /** 根据名字筛选 string required:false */
}

export function monitorTinymallPageMall_Get(monitorTinymallPageMall_Param) {
    return request({
        url: `/monitor/tinymall/pageMall`,
        method: 'get',
        params: monitorTinymallPageMall_Param

    })
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymall/save
 * description:
 * summary: 新增 商店/分类
 * tags: 商城 - 商店/分类(通过)
 */
let monitorTinymallSave_Body = {
    schoolId: null,
    /** 学校ID integer required: */
    name: null,
    /** 商店名 string required: */
    schoolName: null,
    /** 学校名 string required: */
}

export function monitorTinymallSave_Post(monitorTinymallSave_Body) {
    return request({
        url: `/monitor/tinymall/save`,
        method: 'post',

        data: monitorTinymallSave_Body
    })
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinymall/update
 * description:
 * summary: 修改 商店/分类 - 根据id更新非空值
 * tags: 商城 - 商店/分类(通过)
 */
let monitorTinymallUpdate_Body = {
    mallId: null,
    /** $property.description integer required: */
    schoolId: null,
    /** 学校ID integer required: */
    name: null,
    /** 商店名 string required: */
    schoolName: null,
    /** 学校名 string required: */
    isShow: null,
    /** 是否显示 integer required: */
}

export function monitorTinymallUpdate_Put(monitorTinymallUpdate_Body) {
    return request({
        url: `/monitor/tinymall/update`,
        method: 'put',

        data: monitorTinymallUpdate_Body
    })
}
/**  =========================================================================== ***/
/***  ===========================================================================
 * path: /monitor/tinymall/pageMallType
 * description:
 * summary: 分页获取 商品分类
 * tags: 商城 - 商店/分类
 */
let monitorTinymallPageMallType_Param = {
    pageNum: null,
    /** 第几页 string required:false */
    pageSize: null,
    /** 页码大小 string required:false */
    schoolId: null,
    /** 根据学校ID筛选 string required:false */
    isShow: null,
    /** 显示筛选 1 显示 0 不显示 string required:false */
    name: null,
    /** 根据名字筛选 string required:false */
}

export function monitorTinymallPageMallType_Get(monitorTinymallPageMallType_Param) {
    return request({
        url: `/monitor/tinymall/pageMallType`,
        method: 'get',
        params: monitorTinymallPageMallType_Param

    })
}
/**  =========================================================================== ***/
/***  ===========================================================================
 * path: /monitor/tinymall/pageMallCommodity
 * description:
 * summary: 分页获取 商品
 * tags: 商城 - 商店/分类
 */
let monitorTinymallPageMallCommodity_Param = {
    pageNum: null,
    /** 第几页 string required:false */
    pageSize: null,
    /** 页码大小 string required:false */
    isShow: null,
    /** 显示筛选 1 显示 0 不显示 string required:false */
    status: null,
    /**  string required:false */
    mallIdList: null,
    /** 根据商店ID数组筛选 string required:false */
    name: null,
    /** 根据名字筛选 string required:false */
}

export function monitorTinymallPageMallCommodity_Get(monitorTinymallPageMallCommodity_Param) {
    return request({
        url: `/monitor/tinymall/pageMallCommodity`,
        method: 'get',
        params: monitorTinymallPageMallCommodity_Param

    })
}
/**  =========================================================================== ***/