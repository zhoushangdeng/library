<template>
  <el-container class="login">
    <el-header>
      <h2 style="text-align: center;color:black;">图书管理系统</h2>
    </el-header>
    <el-main>
      <div style="height: 400px; width: 300px; margin: 0px auto;" v-show="loginOrRejister">
        <el-form label-position="top" style="margin-top: 5em" ref="formRef" :rules="loginRules" :model="formState">
          <el-form-item label="用户名/学号" prop="username">
            <el-input v-model.trim="formState.username" placeholder="请输入用户名/学号"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model.trim="formState.password" type="password" placeholder="请输入密码，六位数以上" @keyup.enter="goLogin">
            </el-input>
          </el-form-item>
          <el-form-item>
            <div style="display: flex; justify-content: center">
              <el-button @click="goLogin" type="success" round @keyup.enter="goLogin" :disabled="disabled">登录</el-button>
            </div>
            <div style="display: flex; justify-content: flex-end">
              <p>
                还没注册？<span style="color: white;cursor: pointer;" type="success" @click="goRegister">点击这里
                </span>
              </p>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <div style="height: 400px; width: 300px; margin: 0px auto;" v-show="!loginOrRejister">
        <el-form label-position="top" style="margin-top: 5em" ref="formRegis" :rules="registerRules" :model="formRegister">
          <el-form-item prop="name">
            <el-input v-model.trim="formRegister.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item prop="studentCode">
            <el-input v-model.trim="formRegister.studentCode" placeholder="请输入学号"></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model.trim="formRegister.password" type="password" placeholder="请输入密码，六位数以上" @keyup.enter="goLogin">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="formRegister.major" placeholder="请输入专业" @keyup.enter="goLogin">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="formRegister.className" placeholder="请输入班级" @keyup.enter="goLogin">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-input v-model.trim="formRegister.email" placeholder="请输入邮箱" @keyup.enter="goLogin">
            </el-input>
          </el-form-item>
          <el-form-item>
            <el-select v-model="formRegister.sex" placeholder="请选择性别">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item>
            <div style="display: flex; justify-content: center">
              <el-button @click="insertUsers" type="success" round @keyup.enter="insertUsers">注册</el-button>
            </div>
            <div style="display: flex; justify-content: flex-end">
              <p>
                点击这里>><span style="color: white;cursor: pointer;" type="success" @click="toLogin">返回登录
                </span>
              </p>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <el-footer class="login-footer">
      <p style="text-align: center">
        服务热线：12345678912<br />
        Email：123456789@qq.com<br />
      </p>
    </el-footer>
  </el-container>
</template>
<script lang="ts">
import { ref, defineComponent, reactive } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'
import { setToken } from '@/util/auth'
import { login } from '@/api/user/login'
import { register } from '@/api/user/register'
export default defineComponent({
  setup: () => {
    interface FormState {
      username: string
      password: string
    }
    const router = useRouter()
    const formRef = ref()
    const formRegis = ref()
    const loginOrRejister = ref(true)
    const disabled = ref(false)
    const formState: FormState = reactive({
      username: '',
      password: '',
    })
    const formRegister = reactive({
      name: '',
      password: '',
      email: '',
      studentCode: '',
      major: '',
      className: '',
      sex: '男',
      roleId: '2002',
    })
    const loginRules = reactive({
      name: [{ required: true, message: '请输入姓名或账号', trigger: 'blur' }],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
      ],
    })
    const registerRules = reactive({
      name: [{ required: true, message: '请输入姓名或账号', trigger: 'blur' }],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
      ],
      studentCode: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    })
    const goRegister = () => {
      loginOrRejister.value = false
    }
    const toLogin = () => {
      loginOrRejister.value = true
    }
    const goLogin = async () => {
      await formRef.value.validate(async (valid: any) => {
        disabled.value = true
        let loadingInstance = ElLoading.service({
          fullscreen: true,
          background: '#2c3e5000',
        })
        try {
          if (valid) {
            const { code, data } = await login({
              ...formState,
              email: formState.username,
              studentCode: formState.username,
            })
            if (code == 200) {
              setToken(data.token, data.id, data.roleId, data.name)
              router.push('/Home')
              disabled.value = false
            } else {
              disabled.value = false
              ElMessage.error(data)
            }
          }
        } catch (error) {
          console.log(error)
          disabled.value = false
        }
        loadingInstance.close()
        disabled.value = false
      })
    }
    const insertUsers = async () => {
      disabled.value = true
      await formRegis.value.validate(async (valid: any) => {
        disabled.value = true
        let loadingInstance = ElLoading.service({
          fullscreen: true,
          background: '#2c3e5000',
        })
        if (valid) {
          return register(formRegister)
            .then(() => {
              ElMessage.success('注册成功！')
              setTimeout(() => {
                loginOrRejister.value = true
              }, 1000)
              loadingInstance.close()
              disabled.value = false
            })
            .catch(() => {
              disabled.value = false
            })
        }
      })
    }
    return {
      formRef,
      formRegis,
      formState,
      loginRules,
      registerRules,
      goLogin,
      toLogin,
      goRegister,
      loginOrRejister,
      formRegister,
      insertUsers,
      disabled,
    }
  },
})
</script>
<style lang="scss">
.login {
  margin: 0;
  width: 100%;
  height: 100vh;
  color: #fff;
  background-image: url('@/assets/back_one.jpg');
  /*背景颜色设置渐变*/
  // background: linear-gradient(0deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  // background-size: 400% 400%;
  // animation: gradientBG 15s ease infinite;
  .el-form-item__label {
    color: black !important;
  }
  .el-header,
  .el-footer {
    margin: 0;
    padding: 0;
    height: 46px;
    color: white;
    p {
      margin: 0px;
    }
  }
  .el-main {
    margin: 0;
    padding: 0;
    height: calc(100vh - 120px);
    /* background-image: url('@/assets/莫哈韦沙漠晚上.jpg'); */
  }
  p,
  .el-form-item__label {
    color: white;
  }
}
@keyframes gradientBG {
  0% {
    background-position: 50% 50%;
  }
  50% {
    background-position: 100% 100%;
  }
  100% {
    background-position: 50% 50%;
  }
}

.el-loading-spinner {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  -webkit-animation: typing 2s linear infinite alternate;
  -moz-animation: typing 1s linear infinite alternate;
  animation: typing 2s linear infinite alternate;
  margin: 10px auto;
  position: relative;
  left: 50px;
}
@keyframes typing {
  75% {
    background-color: rgb(2, 243, 130);
    box-shadow: 40px 0px 0px 0px rgb(2, 243, 130),
      80px 0px 0px 0px rgb(2, 243, 130);
  }
}
.el-loading-spinner .circular {
  display: none; //隐藏之前element-ui默认的loading动画
}
</style>