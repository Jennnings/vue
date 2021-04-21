<template>
  <div class="loginContainer">
    <div class="userInfo">
      <div class="header">
        <span>用户登录</span>
      </div>
      <div class="userLogin">
        <div class="inputItem">
          <span>账号:</span>
          <a-input
            style="width: 200px;margin-left:10px"
            placeholder="用户名"
            v-model="userName"
          />
        </div>
        <div class="inputItem">
          <span>密码:</span>
          <a-input-password
            style="width: 200px;margin-left:10px"
            placeholder="请输入密码"
            v-model="passWord"
            @keyup.enter.native="onEnterPress"
          />
        </div>
        <div class="inputItemButton">
          <a-button type="primary" @click="login" style="width:110px">
            登录
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import request from "@/utils/request";
import { Modal } from "ant-design-vue";
export default {
  data() {
    return {
      userName: "",
      passWord: "",
      loginInfo: "",
      ip: "",
    };
  },
  methods: {
    error() {
      this.$error({
        title: "登录失败",
        content: "请确认用户名与密码是否正确",
      });
    },
    async login() {
      this.loginInfo = await request.get("/cxch/login", {
        params: { username: this.userName, password: this.passWord },
      });
      console.log(this.loginInfo.data);
      if (this.loginInfo.data === "wrong") {
        this.error();
      } else {
        sessionStorage.setItem(
          "userToken",
          JSON.stringify(this.loginInfo.data[0])
        );
        sessionStorage.setItem(
          "userInfo",
          JSON.stringify({ userName: this.userName })
        );
        this.$router.push("/home");
      }
      //   sessionStorage.setItem("userToken", "xxxx");
      //   this.$router.replace("/home");
    },
    onEnterPress() {
      console.log("enter express");
      this.login();
    },
    getUserIP(onNewIP) {
      let MyPeerConnection =
        window.RTCPeerConnection ||
        window.mozRTCPeerConnection ||
        window.webkitRTCPeerConnection;

      let pc = new MyPeerConnection({
        iceServers: [],
      });

      let noop = () => {};

      let localIPs = {};

      let ipRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/g;

      let iterateIP = (ip) => {
        if (!localIPs[ip]) onNewIP(ip);

        localIPs[ip] = true;
      };

      pc.createDataChannel("");

      pc.createOffer()
        .then((sdp) => {
          sdp.sdp.split("\n").forEach(function(line) {
            if (line.indexOf("candidate") < 0) return;

            line.match(ipRegex).forEach(iterateIP);
          });

          pc.setLocalDescription(sdp, noop, noop);
        })
        .catch((reason) => {});

      pc.onicecandidate = (ice) => {
        if (
          !ice ||
          !ice.candidate ||
          !ice.candidate.candidate ||
          !ice.candidate.candidate.match(ipRegex)
        )
          return;

        ice.candidate.candidate.match(ipRegex).forEach(iterateIP);
      };
    },
  },
  mounted: function() {
    this.getUserIP((ip) => {
      this.ip = ip;
      console.log(this.ip);
    });
  },
};
</script>
<style lang="scss">
.loginContainer {
  width: 100%;
  height: 100%;
  background: url("../../assets/img/login-background.jpg");
  .userInfo {
    width: 300px;
    height: 400px;
    background: #eeee;
    //border: #eeee 1px solid;
    border-radius: 5px;
    position: absolute;
    left: calc(50% - 150px);
    top: 150px;
    .header {
      height: 40px;
      font-size: 20px;
      padding-top: 3px;
      background-color: #3c70f5;
      text-align: center;
      color: white;
      border-radius: 5px 5px 0 0;
    }
    .userLogin {
      margin-top: 80px;
      width: 100%;
      height: fit-content;
      display: flex;
      flex-direction: column;
      align-content: center;
      justify-content: center;
      flex-wrap: wrap;
      .inputItem {
        width: fit-content;
        margin-top: 10px;
      }
      .inputItemButton {
        padding-top: 20px;
        margin: auto;
      }
    }
  }
}
</style>
