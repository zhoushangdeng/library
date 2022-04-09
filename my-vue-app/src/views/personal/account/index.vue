<template>
  <el-main class="account">
    <div class="form">
      <el-form label-position="top" style="margin-top: 5em；width:200px" ref="formRegis" :rules="registerRules" :model="formRegister">
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
            <el-button @click="insertUsers" type="success" round @keyup.enter="insertUsers">提交更新</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
  </el-main>
</template>

<script lang="ts">
import { ref, defineComponent, reactive } from 'vue'
import { ElMessage, ElLoading } from 'element-plus'
import { useRouter } from 'vue-router'
import { register } from '@/api/user/register'
import { getUser, updateUser } from '@/api/user/index'
import { getToken } from '@/util/auth'

export default defineComponent({
  setup: () => {
    const formRef = ref()
    const formRegis = ref()
    const loginOrRejister = ref(true)
    const disabled = ref(false)
    const formRegister = ref({
      id: 0,
      name: '',
      password: '',
      email: '',
      studentCode: '',
      major: '',
      className: '',
      sex: '男',
      roleId: '2002',
    })
    let registerRules = reactive({
      name: [{ required: true, message: '请输入姓名或账号', trigger: 'blur' }],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 8, max: 16, message: '长度在 8 到 16 个字符', trigger: 'blur' },
      ],
      studentCode: [{ required: true, message: '请输入学号', trigger: 'blur' }],
    })
    const getUserData = getUser({ id: getToken().id }).then((res) => {
      const {
        id,
        name,
        password,
        email,
        student_code,
        major,
        class_name,
        sex,
        role_id,
      } = res[0]
      formRegister.value = {
        id,
        name,
        password,
        email,
        studentCode: student_code,
        major,
        className: class_name,
        sex,
        roleId: role_id,
      }
    })

    const insertUsers = async () => {
      disabled.value = true
      await formRegis.value.validate(async (valid: any) => {
        disabled.value = true
        let loadingInstance = ElLoading.service({
          fullscreen: true,
          background: '#2c3e5000',
        })
        if (valid) {
          return updateUser(formRegister.value)
            .then(() => {
              ElMessage.success('更新成功！')
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
      registerRules,
      loginOrRejister,
      formRegister,
      insertUsers,
      disabled,
      getUserData,
    }
  },
})
</script><style lang="scss">
.account {
  margin: 0;
  width: 100%;
  height: 100vh;
  color: #fff;
  //   background-image: url('@/assets/back_one.jpg');
  /*背景颜色设置渐变*/
  // background: linear-gradient(0deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
  // background-size: 400% 400%;
  // animation: gradientBG 15s ease infinite;
  .form {
    width: 500px !important;
  }
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