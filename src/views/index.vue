<template>
  <div class="app-container home">
    <el-row :gutter="20">
      <el-col :sm="24" :lg="12" style="padding-left: 20px">
        <h2>校园微音-开发者的念念碎（彩蛋）</h2>
        <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="revise1(15)"
        >修改</el-button>
        <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="碎碎念" name="first">
                  <editor v-if="isshow1" v-model="content1">
              </editor>
              <el-col  v-else v-html="content1"> </el-col> 
              <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          v-show="isshow1"
          @click="submit(15)"
        >提交</el-button>
              <el-button 
        size="mini"
        v-show="isshow1"
        @click="cancel(15)"
        >取 消</el-button>
              
          </el-tab-pane>
    <el-tab-pane label="遇到的挫折" name="second">
<editor v-if="isshow2" v-model="content2">
              </editor>
              <el-col  v-else v-html="content2"> </el-col> 
                <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          v-show="isshow2"
          @click="submit(16)"
        >提交</el-button>
        <el-button 
        size="mini"
        v-show="isshow2"
        @click="cancel(16)"
        >取 消</el-button>
    </el-tab-pane>
  </el-tabs>
      </el-col>

      <el-col :sm="24" :lg="12" style="padding-left: 50px">
        <el-row>
          <el-col :span="12">
            <h2>鸣谢列表</h2>
            <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          @click="revise2(17)"
        >修改</el-button>

          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <editor v-if="isshow3" v-model="content3">
              </editor>
              <el-col  v-else v-html="content3"> </el-col> 
              <el-button
          type="primary"
          plain
          icon="el-icon-edit"
          size="mini"
          v-show="isshow3"
          @click="submit(17)"
        >提交</el-button>
        <el-button 
        size="mini"
        v-show="isshow3"
        @click="cancel(17)"
        >取 消</el-button>
          </el-col>
        </el-row>
      </el-col>
    </el-row>
    <el-divider />
    <el-row :gutter="20">
      <el-col :xs="24" :sm="24" :md="12" :lg="8">
        <el-card class="update-log">
          <div slot="header" class="clearfix">
            <span>联系信息</span>
          </div>
          <div class="body">
            <p>
              <i class="el-icon-s-promotion"></i> 电话:17376085263
            </p>
            <p>
              <i class="el-icon-user-solid"></i> QQ：2790881899
            </p>
            <!-- <p>
              <i class="el-icon-chat-dot-round"></i> 微信：<a
                href="javascript:;"
                >/ *若依</a
              >
            </p>
            <p>
              <i class="el-icon-money"></i> 支付宝：<a
                href="javascript:;"
                class="支付宝信息"
                >/ *若依</a>
            </p> -->
          </div>
        </el-card>
      </el-col>

    </el-row>
  </div>
</template>

<script>
import {getNotice,updateNotice } from "@/api/system/notice";

export default {
  name: "Index",
  data() {
    return {
      // 版本号
      version: "3.5.0",
      activeName: 'first',
      content1:'',
      content2:'',
      content3:'',
      // 碎碎念是否展示
      isshow1:false,
      // 遇到的挫折是否展示
      isshow2:false,
      //鸣谢列表是否展示
      isshow3:false,
       // 表单参数
      form: {},
    };
  },
  created() {
    this.gitcontent();
  },
  methods: {
    gitcontent(){
      //获取念念碎的数据  15为通知公告中的序号
      getNotice(15).then(response => {
        this.content1 = response.data.noticeContent;
      });
      //获取遇到挫折的数据  16为通知公告中的序号
      getNotice(16).then(response => {
        this.content2 = response.data.noticeContent;
      });
      //获取鸣谢列表的数据  17为通知公告中的序号
      getNotice(17).then(response => {
        this.content3 = response.data.noticeContent;
      });
    },
    goTarget(href) {
      window.open(href, "_blank");
    },
    handleClick(tab, event) {

      },
 
    // 念念碎修改按钮
    revise1(val){

      this.isshow1=true;
      this.isshow2=true;
    },
    //鸣谢列表修改按钮
    revise2(val){
      this.isshow3=true;
    },
    // 提交按钮
    submit(val){
      getNotice(val).then(response => {
        this.form=response.data;
        if (val==15) {
          this.form.noticeContent=this.content1;
        }
        if (val==16) {
        this.form.noticeContent=this.content2;
        }
        if (val==17) {
          this.form.noticeContent=this.content3;
        }
        updateNotice(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.gitcontent();
      });
    this.isshow1=false;
    this.isshow2=false;
    this.isshow3=false;
    })
  },
  // 取消按钮
  cancel(val){
    if (val==15) {
    this.isshow1=false;
        }
    if (val==16) {
    this.isshow2=false;
        }
    if (val==17) {
    this.isshow3=false;
        }
  }
  },
};
</script>

<style scoped lang="scss">
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

