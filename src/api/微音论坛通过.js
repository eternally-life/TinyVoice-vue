/*** glowxq glowxq@163.com  2022-07-22 15:36:58  生成模板  ***/
import request from '@/utils/request'


/***  ===========================================================================
 * path: /monitor/tinybbs/save
 * description:
 * summary: 新增 微音论坛
 * tags: 微音论坛(通过)
 */
let monitorTinybbsSave_Body = {
    isBook: null,
    /** 是否书籍=1是,0否 integer required: */
    price: null,
    /** 价格-二手市场字段-单位元 number required: */
    contact: null,
    /** 联系方式-二手市场,失物招领字段 string required: */
    type: null,
    /** 微音类型-1-微音,2-二手市场,3-失物招领,4-表白,5-官方,6-匿名 integer required: */
    content: null,
    /** 微音内容文本 string required: */
    imgList: null,
    /** 图片列表 array required: */
}

export function monitorTinybbsSave_Post(monitorTinybbsSave_Body) {
    return request({
        url: `/monitor/tinybbs/save`,
        method: 'post',

        data: monitorTinybbsSave_Body
    })
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinybbs/delete
 * description:
 * summary: 删除 微音论坛 - 根据id删除
 * tags: 微音论坛(通过)
 */

export function monitorTinybbsDelete_Delete(data) {
    return request({
        url: `/monitor/tinybbs/delete`,
        method: 'delete',
        data: data


    })
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinybbs/audit
 * description:
 * summary: 审核 微音论坛 - 根据id通过
 * tags: 微音论坛(通过)
 */

export function monitorTinybbsAudit_Post(data) {
    return request({
        url: `/monitor/tinybbs/audit`,
        method: 'post',
        data: data
    })
}
/**  =========================================================================== ***/

/***  ===========================================================================
 * path: /monitor/tinybbs/page
 * description:
 * summary: 分页获取 微音论坛
 * tags: 微音论坛(通过)
 */
let monitorTinybbsPage_Param = {
    pageNum: null,
    /** 第几页 string required:false */
    pageSize: null,
    /** 页码大小 string required:false */
    keyword: null,
    /**  string required:false */
    userId: null,
    /** 根据用户ID筛选,可为空默认不筛选 可用于查询自己的微音,别人的微音 string required:false */
    targetId: null,
    /** 根据微音ID筛选,用于跳转目标 string required:false */
    type: null,
    /** 微音类型,可为空 默认不筛选 1-微音,2-二手市场,,3-失物招领,4-表白,5-官方,6-匿名 string required:false */
    sort: null,
    /** 排序类型,可为空 默认不筛选 1-热度,2-点赞,3-回复,4-时间 string required:false */
    screenTime: null,
    /** 时间筛选-可为空 默认筛选3天 值为筛选第 n 天内微音 string required:false */
}

export function monitorTinybbsPage_Get(monitorTinybbsPage_Param) {
    return request({
        url: `/monitor/tinybbs/page`,
        method: 'get',
        params: monitorTinybbsPage_Param

    })
}
/**  =========================================================================== ***/

export function monitorTinybbsUpdate_Post(data) {
    return request({
        url: `/monitor/tinybbs/update`,
        method: 'post',
        data: data
    })
}