<template>
  <el-container>
    <el-main>
      <el-table :data="state.tableData" style="width: 99.5%" border stripe size="mini" height="calc(100vh - 180px)">
        <el-table-column prop="name" label="用户名称" align="center"> </el-table-column>
        <!-- <el-table-column prop="id" label="ID" width="100" align="center"> </el-table-column> -->
        <el-table-column prop="email" label="邮箱" align="center"></el-table-column>
        <el-table-column prop="student_code" label="学号" align="center"> </el-table-column>
        <el-table-column prop="major" label="专业" align="center" width="100"></el-table-column>
        <el-table-column prop="sex" label="性别" width="50" align="center"></el-table-column>
        <el-table-column label="角色" width="80" align="center">
          <template #default="{ row }">
            {{row.roleId==2001?'管理员':'学生'}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template #default="{ row, $index }">
            <div>
              <el-button type="info" icon="el-icon-edit" size="mini" @click="edit(row, $index)"></el-button>
              <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="确定删除吗？" @confirm="deleteMenus(row, $index)">
                <template #reference>
                  <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog title="添加用户" v-model="dialogVisible" width="40%" :before-close="handleClose">
        <el-form ref="form" :model="state.form" label-width="110px">
          <el-form-item label="用户名称">
            <el-input v-model="state.from.name"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="state.from.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="state.from.email"></el-input>
          </el-form-item>
          <el-form-item label="学号">
            <el-input v-model="state.from.studentCode"></el-input>
          </el-form-item>
          <el-form-item label="专业">
            <el-input v-model="state.from.major"></el-input>
          </el-form-item>
          <el-form-item label="性别">
            <el-select v-model="state.from.sex" placeholder="请选择">
              <el-option label="男" value="男" />
              <el-option label="女" value="女" />
            </el-select>
          </el-form-item>
          <el-form-item label="角色">
            <el-select v-model="state.from.roleId" placeholder="请选择">
              <el-option v-for="item in state.role" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="state.status === '修改' ? updateUsers() : insertUsers()">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addUsers()" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus'
import { getUser, insertUser, delUser, updateUser } from '@/api/user/index'
import { getRole } from '@/api/role'
export default defineComponent({
  setup() {
    const state = reactive({
      tableData: [],
      from: {
        name: '',
        password: '',
        email: '',
        studentCode: '',
        major: '',
        sex: '',
        roleId: '',
      },
      status: '修改',
      role: [],
      optRole: {},
      roleId: '',
    })
    interface dataType {
      title: string
      menusID: string
      parentID: number
      menusName: string
      conponent: string
      path: string
      icon: string
      type: 1
    }
    const addUsers = (parentID) => {
      state.status = '新增'
      state.from = {
        name: '',
        password: '',
        email: '',
        studentCode: '',
        major: '',
        sex: '',
        roleId: '',
      }
      dialogVisible.value = true
    }
    const insertUsers = async () => {
      const { code } = await insertUser({ ...state.optRole, ...state.from })
      code === 200 ? ElMessage.success('添加成功') : ElMessage.error('添加失败')
      getUsers()
      dialogVisible.value = false
    }
    const giveUp = (row: any, index: number) => {
      if (row.ParentID === 0 && !row.MenusID) {
        state.tableData.splice(index, 1)
      }
    }
    const edit = (row: any, index: number) => {
      row.roleId = parseInt(row.roleId) || ''
      state.from = row
      state.status = '修改'
      dialogVisible.value = true
    }
    const deleteMenus = async (row: any, index: number) => {
      await delUser({ id: row.id })
      getUsers()
    }
    const input = ref('')
    const getUsers = async () => {
      const data = await getUser({ keyword: '', currentPage: 0, total: 10 })
      state.tableData = data
    }
    const getRoles = async () => {
      const result = await getRole()
      state.role = result
    }
    const dialogVisible = ref(false)
    const updateUsers = async () => {
      const { code } = await updateUser(state.from)
      code === 200 ? ElMessage.success('修改成功') : ElMessage.error('修改失败')
      getUsers()
      dialogVisible.value = false
    }
    getUsers()
    getRoles()
    onBeforeMount(() => {})
    return {
      state,
      giveUp,
      edit,
      deleteMenus,
      input,
      dialogVisible,
      updateUsers,
      addUsers,
      insertUsers,
    }
  },
})
</script>
<style lang="scss">
.el-header,
.el-main {
  margin: 0px;
  padding: 0px;
}
.el-footer {
  height: 40px !important;
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }
}
.el-main {
  height: calc(100vh - 180px);
}
</style>