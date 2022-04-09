<template>
  <el-container>
    <el-main>
      <el-table :data="state.tableData" style="width: 99.5%" border stripe size="mini" height="calc(100vh - 180px)">
        <el-table-column prop="book_name" align="center" label="作品名称"> </el-table-column>
        <el-table-column prop="writer" align="center" label="作者"> </el-table-column>
        <el-table-column prop="student_code" label="借书人学号" align="center"></el-table-column>
        <el-table-column prop="name" label="借书人姓名" align="center"></el-table-column>
        <el-table-column label="借出日期" align="center">
          <template #default="{row}">
            {{moment(row.borrow_date).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="还书日期" align="center">
          <template #default="{row}">
            {{moment(row.return_date).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template #default="{row}">
            {{row.state == 'Notyet'?"未还":"已还"}}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template #default="{ row, $index }">
            <div>
              <el-button type="info" icon="el-icon-edit" size="mini" @click="edit(row, $index)"></el-button>
              <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="确定删除吗？" @confirm="delBorrows(row, $index)">
                <template #reference>
                  <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" title="书籍编辑" v-model="dialogVisible" width="50%" :before-close="handleClose">
        <el-form class="BorrowDialog" ref="form" :model="state.form" label-width="110px">
          <el-form-item label="选择作品">
            <el-select v-model="state.from.bookId" placeholder="请选择">
              <el-option v-for="item in state.books" :key="item.id" :label="item.book_name" :value="item.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="借书人学号">
            <el-input v-model="state.from.studentCode"></el-input>
          </el-form-item>
          <el-form-item label="借出日期">
            <el-date-picker v-model="state.from.borrowDate" type="date" placeholder="Pick a day" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled-date="disabledDate" :shortcuts="shortcuts" />
          </el-form-item>
          <el-form-item label="还书日期">
            <el-date-picker v-model="state.from.returnDate" type="date" placeholder="Pick a day" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :shortcuts="shortcuts" />
          </el-form-item>
          <el-form-item label="是否已还书">
            <el-radio v-model="state.from.state" label="Returned" size="large" border>已还</el-radio>
            <el-radio v-model="state.from.state" label="Notyet" size="large" border>未还</el-radio>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="state.status === '修改' ? updateBorrows() : insertBorrows()">确 定</el-button>
          </span>
        </template>
      </el-dialog>
    </el-main>
    <el-footer>
      <el-form :inline="true" class="demo-form-inline">
        <el-form-item>
          <el-button type="primary" icon="el-icon-plus" size="mini" @click="addMenus(0)" plain>新增</el-button>
        </el-form-item>
      </el-form>
    </el-footer>
  </el-container>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus'
import { getBorrow, insertBorrow, delBorrow, updateBorrow } from '@/api/Borrow'
import { getBook } from '@/api/book'
import moment from 'moment'
export default defineComponent({
  setup() {
    const state = reactive({
      tableData: [],
      books: [],
      from: {
        bookId: '',
        borrowDate: '',
        returnDate: '',
        studentCode: '',
        state: 'Returned',
      },
      status: '修改',
    })
    const addMenus = (parentID) => {
      console.log('id', parentID)
      state.status = '新增'
      state.from = {
        id: '',
        bookId: '',
        borrowDate: '',
        studentCode: '',
        returnDate: '',
        state: 'Returned',
      }
      dialogVisible.value = true
    }
    const insertBorrows = async () => {
      const { code } = await insertBorrow(state.from)
      code === 200 ? ElMessage.success('添加成功') : ElMessage.error('添加失败')
      getBorrows()
      dialogVisible.value = false
    }
    const giveUp = (row: any, index: number) => {
      if (row.ParentID === 0 && !row.MenusID) {
        state.tableData.splice(index, 1)
      }
    }
    const edit = (row: any, index: number) => {
      state.from = {
        bookId: row.book_id,
        studentCode: row.student_code,
        borrowDate: row.borrow_date,
        returnDate: row.return_date,
        id: row.id,
        state: row.state,
      }
      state.status = '修改'
      dialogVisible.value = true
    }
    const delBorrows = async (row: any, index: number) => {
      await delBorrow({ id: row.id })
      getBorrows()
    }
    const input = ref('')
    const getBorrows = async () => {
      const data = await getBorrow({
        start: '1970-12-10 21:38:39',
        end: moment().format('yyyy-MM-DD HH:mm:ss'),
      })
      state.tableData = data
    }
    const dialogVisible = ref(false)
    const updateBorrows = async () => {
      state.from.borrowDate = moment(state.from.borrowDate).format('YYYY-MM-DD')
      state.from.returnDate = moment(state.from.returnDate).format('YYYY-MM-DD')
      const { code } = await updateBorrow(state.from)
      code === 200 ? ElMessage.success('修改成功') : ElMessage.error('修改成功')
      getBorrows()
      dialogVisible.value = false
    }
    const disabledDate = (time: Date) => {
      return time.getTime() > Date.now()
    }
    const shortcuts = [
      { text: 'Today', value: new Date() },
      {
        text: 'Yesterday',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24)
          return date
        },
      },
      {
        text: 'A week ago',
        value: () => {
          const date = new Date()
          date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
          return date
        },
      },
    ]
    const getBooks = async () => {
      const data = await getBook({ keyword: '', currentPage: 0, total: 10 })
      state.books = data
    }
    getBooks()
    getBorrows()
    onBeforeMount(() => {})
    return {
      state,
      giveUp,
      edit,
      delBorrows,
      input,
      dialogVisible,
      updateBorrows,
      addMenus,
      insertBorrows,
      disabledDate,
      shortcuts,
      moment,
    }
  },
})
</script>
<style lang="scss">
.BorrowDialog {
  height: 50vh !important;
  overflow: auto;
}
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