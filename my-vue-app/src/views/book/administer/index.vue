<template>
  <el-container>
    <el-main>
      <el-table :data="state.tableData" style="width: 99.5%" border stripe size="mini" height="calc(100vh - 180px)">
        <el-table-column prop="book_name" label="作品名称"> </el-table-column>
        <el-table-column prop="writer" label="作者" width="100" align="center"></el-table-column>
        <el-table-column prop="sort_name" label="类型" align="center" width="100"></el-table-column>
        <el-table-column prop="price" label="价格" align="center" width="60"> </el-table-column>
        <el-table-column prop="pub_company" label="出版社" align="center"> </el-table-column>
        <el-table-column label="出版日期" align="center">
          <template #default="{row}">
            {{moment(row.pub_date).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column prop="total_num" label="总数/本" width="80" align="center"> </el-table-column>
        <el-table-column prop="current_num" label="库存/本" width="80" align="center"></el-table-column>
        <el-table-column label="购进日期">
          <template #default="{row}">
            {{moment(row.buy_date).format('YYYY-MM-DD')}}
          </template>
        </el-table-column>
        <el-table-column prop="brief" label="简介"></el-table-column>
        <el-table-column label="操作" align="center" width="180">
          <template #default="{ row, $index }">
            <div>
              <el-button type="info" icon="el-icon-edit" size="mini" @click="edit(row, $index)"></el-button>
              <el-popconfirm confirmButtonText="确定" cancelButtonText="取消" icon="el-icon-info" iconColor="red" title="确定删除吗？" @confirm="delBooks(row, $index)">
                <template #reference>
                  <el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
                </template>
              </el-popconfirm>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <el-dialog :close-on-click-modal="false" title="书籍编辑" v-model="dialogVisible" width="50%" :before-close="handleClose">
        <el-form class="bookDialog" ref="form" :model="state.form" label-width="110px">
          <el-form-item label="作品名称">
            <el-input v-model="state.from.bookName"></el-input>
          </el-form-item>
          <el-form-item label="作者">
            <el-input v-model="state.from.writer"></el-input>
          </el-form-item>
          <el-form-item label="类别">
            <el-input v-model="state.from.sortName"></el-input>
          </el-form-item>
          <el-form-item label="价格">
            <el-input v-model="state.from.price"></el-input>
          </el-form-item>
          <el-form-item label="出版社">
            <el-input v-model="state.from.pubCompany"></el-input>
          </el-form-item>
          <el-form-item label="出版日期">
            <el-date-picker v-model="state.from.pubDate" type="date" placeholder="Pick a day" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled-date="disabledDate" :shortcuts="shortcuts" />
          </el-form-item>
          <el-form-item label="书籍总数/本">
            <el-input v-model="state.from.totalNum"></el-input>
          </el-form-item>
          <el-form-item label="库存/本">
            <el-input v-model="state.from.currentNum"></el-input>
          </el-form-item>
          <el-form-item label="购进日期">
            <el-date-picker v-model="state.from.buyDate" type="date" placeholder="Pick a day" format="YYYY-MM-DD" value-format="YYYY-MM-DD" :disabled-date="disabledDate" :shortcuts="shortcuts" />
          </el-form-item>
          <el-form-item label="简介">
            <el-input v-model="state.from.brief"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="state.status === '修改' ? updateBooks() : insertBooks()">确 定</el-button>
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
      <el-pagination :currentPage="currentPage" :page-size="pageSize" :page-sizes="[100, 200, 300, 400]" small background layout="sizes, prev, pager, next" :total="1000" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </el-footer>
  </el-container>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, onBeforeMount } from 'vue'
import { ElMessage } from 'element-plus'
import { getBook, insertBook, delBook, updateBook } from '@/api/book'
import moment from 'moment'
export default defineComponent({
  setup() {
    const state = reactive({
      tableData: [],
      from: {
        bookName: '',
        writer: '',
        sortName: '',
        price: '',
        pubCompany: '',
        pubDate: '',
        totalNum: '',
        currentNum: '',
        buyDate: '',
        brief: '',
      },
      status: '修改',
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
    const addMenus = (parentID) => {
      console.log('id', parentID)
      state.status = '新增'
      state.from = {
        bookName: '',
        writer: '',
        sortName: '',
        price: '',
        pubCompany: '',
        pubDate: '',
        totalNum: '',
        currentNum: '',
        buyDate: '',
        brief: '',
      }
      dialogVisible.value = true
    }
    const insertBooks = async () => {
      const { code } = await insertBook(state.from)
      code === 200 ? ElMessage.success('添加成功') : ElMessage.error('添加失败')
      getBooks()
      dialogVisible.value = false
    }
    const giveUp = (row: any, index: number) => {
      if (row.ParentID === 0 && !row.MenusID) {
        state.tableData.splice(index, 1)
      }
    }
    const edit = (row: any, index: number) => {
      state.from = {
        id: row.id,
        writer: row.writer,
        price: row.price,
        brief: row.brief,
        bookName: row.book_name,
        sortName: row.book_name,
        pubCompany: row.pub_company,
        pubDate: row.pub_date,
        totalNum: row.total_num,
        currentNum: row.current_num,
        buyDate: row.buy_date,
      }
      state.status = '修改'
      dialogVisible.value = true
    }
    const delBooks = async (row: any, index: number) => {
      await delBook({ id: row.id })
      getBooks()
    }
    const input = ref('')
    const getBooks = async () => {
      const data = await getBook({ keyword: '', currentPage: 0, total: 10 })
      state.tableData = data
    }
    const dialogVisible = ref(false)
    const updateBooks = async () => {
      const { code } = await updateBook(state.from)
      code === 200 ? ElMessage.success('修改成功') : ElMessage.error('修改成功')
      getBooks()
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

    const handleSizeChange = (val) => {
      console.log({ val })
    }
    const handleCurrentChange = (val) => {
      console.log({ val })
    }
    getBooks()
    onBeforeMount(() => {})
    return {
      state,
      giveUp,
      edit,
      delBooks,
      input,
      dialogVisible,
      updateBooks,
      addMenus,
      insertBooks,
      disabledDate,
      shortcuts,
      moment,
      handleSizeChange,
      handleCurrentChange,
    }
  },
})
</script>
<style lang="scss">
.bookDialog {
  height: 50vh !important;
  overflow: auto;
}
.el-header,
.el-main {
  margin: 0px;
  padding: 0px;
}
.el-footer {
  display: flex;
  height: 40px !important;
  .el-pagination{
    margin-top: 5px;
  }
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0px !important;
  }
}
.el-main {
  height: calc(100vh - 180px);
}
</style>