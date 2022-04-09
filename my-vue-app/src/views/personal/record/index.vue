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
      </el-table>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus'
import { getBorrow, insertBorrow, delBorrow, updateBorrow } from '@/api/Borrow'
import { getBook } from '@/api/book'
import { getToken } from '@/util/auth'

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
        start: '2011-12-10 21:38:39',
        end: '2022-12-10 21:38:39',
        userId: getToken().id,
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