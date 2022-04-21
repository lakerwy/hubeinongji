<template>
  <!-- 登录页 -->
  <div class="user-login">
    <div class="content">
      <div class="title"></div>
      <div class="form-container">
        <div class="login-form">
          <div class="models">
            <div v-for="item in tabs" :key="item.name"
            :class="{'active': model == item.name}"
            @click="changemodel(item.name)"
            >{{item.label}}</div>
          </div>
          <div class="login">
            <el-form
            class="form my-height"
            :model="form"
            label-position="left"
            :rules="rules"
            ref="form"
          >
            <el-form-item prop="username">
              <el-input v-model="form.username" placeholder="请输入用户名">
                <template #prefix>
                  <img
                    style="vertical-align: middle; margin: 0 13px"
                    :src="form.username?'img/username-active.png':'img/username.png'"
                    alt=""
                  />
                  <div class="border"></div>
                </template>
              </el-input>
            </el-form-item>
            <el-form-item prop="password">
              <el-input
                type="password"
                v-model="form.password"
                placeholder="请输入密码"
                @keyup.enter="login"
              >
                <template #prefix>
                  <img
                    style="vertical-align: middle; margin: 0 13px;"
                    :src="form.password?'img/password-active.png':'img/password.png'"
                    alt=""
                  />
                  <div class="border"></div>
                </template>
              </el-input>
            </el-form-item>
            <!-- <el-form-item>
              <el-input v-model="model"
                        placeholder="请输入图形验证码"
                        class="code">
                <template #prefix>
                  <img
                    style="vertical-align: middle; margin: 0 13px"
                    src="img/code.png"
                    alt=""
                  />
                </template>
              </el-input>
              <div class="code-image-container"><img src="" alt=""></div>

            </el-form-item> -->
            <el-form-item style="margin:0">
              <Verify
                @success="verifySuccess"
                :mode="'pop'"
                :captchaType="'blockPuzzle'"
                :imgSize="{ width: '330px', height: '155px' }"
                ref="verify"
              />
            </el-form-item>
            <el-form-item>
              <el-button
                style="width: 100%; background: #1981ec; border-color: #1981ec"
                type="primary"
                @click="login"
                >登录</el-button
              >
            </el-form-item>
            </el-form>
            <div>
                <el-checkbox label="记住账号" name="remenber" v-model="remenberAccount"></el-checkbox>
                <el-checkbox label="记住密码" name="remenber" v-model="remenberPassword"></el-checkbox>
                <span style="float:right">忘记密码</span>
            </div>
          </div>
          <!-- <div class="register">
          <span @click="register">立即注册</span> | <span @click="resetPwd">忘记密码？</span>
        </div> -->
        </div>
      </div>
    </div>

    <Footer style="background: transparent; color: #fff" />
  </div>
</template>

<script>
import Verify from "../../components/verifition/Verify";
import { getLoginSmsCode, getUserInfo } from "../../api/loginAndRegister";
import Footer from "_com/footer/index.vue";
import {setCookie,getCookie,delCookie} from "../../util/util"
export default {
  components: {
    Verify,
    Footer,
  },
  data() {
    return {
      model:0,
      tabs: [
        { label: "账号密码登录", name: "0" },
        { label: "手机号登录", name: "1" },
      ],
      form: { randomStr: "blockPuzzle" },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      currentIndex: 0,
      flag: false,
      max: 60,
      current: 60,
      decreseInterval: null,
      remenberAccount:false,
      remenberPassword:false,
    };
  },
  created() {
    console.log(this.isLogin);
  },
  methods: {
    handleClick(item, index) {
      // 选择登录类型
      this.currentIndex = index;
      this.form = { randomStr: "blockPuzzle" };
      this.$refs.form.resetFields();
    },
    async getSmsCode() {
      // 获取短信验证码
      if (this.form.mobile) {
        let res = await getLoginSmsCode(this.form.mobile);
        let { code, data, msg } = res;
        if (code == 0) {
          this.$message.success(msg);
          this.current = this.max;
          this.decreseInterval = setInterval(() => {
            if (this.current <= this.max && this.current > 0) {
              this.current--;
              this.flag = true;
            } else if (this.current <= 0) {
              this.current = 0;
              this.flag = false;
              clearInterval(this.decreseInterval);
            }
          }, 1000);
        } else {
          this.$message.error(msg);
        }
      } else {
        this.$message.error("请先输入手机号！");
      }
    },
    login() {
      // 用户名登录
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$refs.verify.show();
        }
      });
    },
    verifySuccess(params) {
      this.form.code = params.captchaVerification;
      console.log(this.form, "form");
      this.$store
        .dispatch("LoginByUsername", this.form)
        .then(() => {
          console.log("验证成功", this.form.username, "username");
          // this.$store.dispatch('GetUserInfo', this.form).then((res) => {
          // this.$router.push({ name: 'memberCenter' });
          // this.getInfo();
          // console.log(res, 'res')
          sessionStorage.setItem("navIndex", 0);
          this.$router.push({ path: "/onemap" });
          // })
        })
        .catch((err) => {
          console.error(err)
          this.$message.error(err);
        }); 
    },
    changemodel(param){
      console.log(param)
      if(param != this.model){
        this.model = param
      }
    }
  },
};
</script>

<style lang="less" scoped>
@vw: 19.2vw;
@vh: 10.8vh;
.user-login {
  width: 100%;
  height: calc(100% - 7vh);
  position: relative;
  z-index: 3;
  // padding-top: 10%;
  background: url("../../assets/images/login_bottom.png") no-repeat bottom,
    url("../../assets/images/login_background.png") no-repeat bottom,
    url("../../assets/images/login_background_left.png") no-repeat 0% 10%,
    #0b4286;
  padding-top: 7vh;
  .content {
    position: absolute;
    right: 280px;
    // bottom: 400px;
    top:20%;
    width: 600px;
    display: flex;
    flex-direction: column;
    align-items: center;
    .title {
      height: 55px;
      width: 600px;
      font-size: 32px;
      color: #ffffff;
      background: url("../../assets/images/login-title.png") no-repeat;
    }
  }
  .form-container {
    margin-top: 10px;
    background: rgba(44, 118, 195, 0.4);
    width: 434px;
    // height: 515px;
    padding: 10px;
    border-radius: 8px;
    .login-form {
      padding-top: 20px;

      .models {
        padding: 0 50px 0 50px;
        height: 32px;
        display: flex;
        font-family: "siyuanyahei_yingwen_shuzi";
        border-bottom: 1px solid #dcdcdc;
        div {
          flex-grow: 1;
          cursor: pointer;
        }
        .active{
          font-weight: 900;
        }
      }
      .login{
        padding: 0 50px 20px 50px;
      }

      // width: 100%;
      // padding: 40px 53px 0 53px;
      background-color: rgba(255, 255, 255, 1);
      border-radius: 10px;
      overflow-y: auto;
      .tabs {
        width: calc(100% - 100px);
        padding: 0 50px;
        height: 64 / @vh;
        display: flex;
        justify-content: space-around;
        align-items: center;
        border-bottom: solid 1px #cccccc;
      }
      .form {
        margin-top: 32px;
        .el-form-item {
          margin-bottom: 23px;
        }
        .btn {
          width: 132px;
          height: 46px;
          margin-left: 15px;
        }
        .code{
          width: 60%;
            // /deep/ .el-input__inner {
            //   width: 60%;
            // }
        }
        .code-image-container{
          // display: inline-block;
          float: right;
          // background: red;
          height: 40px;
          width: 125px ;
          border:1px solid #eeeeee;
        }
        /deep/ .el-input__inner {
          border: solid 1px #bfbfbf;
          // border-radius: 0;
          padding-left: 50px;
        }
        /deep/ .el-input__inner:focus{
          box-shadow: 0px 0px 5px #2e8cee;
          border-color: #2e8cee;
        }
      }
      .register {
        color: #00a0e9;
        text-align: right;
        span {
          cursor: pointer;
        }
      }
      .form2 {
        .el-form-item {
          margin-bottom: 15px;
        }
      }
    }
  }
}

.border{
  width: 1px;
  height: 14px;
  margin-bottom: -2px;
  background-color: #eeeeee;
  display: inline-block;
}
</style>

<style lang="less" scoped>
.my-height {
  .el-input__inner {
    height: 48px;
  }
}
</style>
