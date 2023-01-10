<template>
  <el-container class="home">
    <el-main>
      <div style="display: flex; width: 100%; height: 100%; flex-direction: column">
        <div id="echartsRef" style="flex: 1"></div>
        <div>
          <el-table :data="tableData" border style="width: 100%; height: 200px !important" size="mini">
            <el-table-column prop="book_name" align="center" label="作品名称">
            </el-table-column>
            <el-table-column prop="lend_sum" align="center" label="借出次数" />
            <el-table-column prop="total_num" align="center" label="总数" />
            <el-table-column prop="current_num" align="center" label="库存" />
          </el-table>
        </div>
      </div>
    </el-main>
  </el-container>
</template>
<script lang="ts">
import { ref, defineComponent, reactive, onMounted } from 'vue'
import * as echarts from 'echarts'
import { getStatistics } from '@/api/statistics';

export default defineComponent({
  setup: () => {
    const tableData = ref([])
    const state = reactive({
      seriesData: [],
      xAxisData: [],
    })
    onMounted(async () => {
      const datas = await getStatistics()
      tableData.value = datas
      datas.map((item) => {
        state.xAxisData.push(item.book_name)
        state.seriesData.push(item.lend_sum)
      })
      const echartsRefs = echarts.init(document.getElementById('echartsRef'))
      const option = {
        title: {
          text: '书籍借出次数前十排行',
        },
        xAxis: {
          type: 'category',
          data: state.xAxisData,
        },
        yAxis: {
          type: 'value',
        },
        series: [
          {
            data: state.seriesData,
            type: 'bar',
            showBackground: true,
            backgroundStyle: {
              color: 'rgba(180, 180, 180, 0.2)',
            },
          },
        ],
      }
      echartsRefs.setOption(option)
    })
    return {
      tableData,
    }
  },
})
</script>
<style lang="scss">
.home {
  width: 100%;
  .el-header,
  .el-footer {
    margin: 0;
    padding: 0;
    height: 35px !important;
  }
  .el-main {
    margin: 0px;
    padding: 0px;
    height: calc(100vh - 170px);
    .content {
      height: 100%;
      min-width: 400px;
      background: rgba(73, 73, 69, 0.601);
    }
    p {
      text-align: start;
      padding: 10px 0px 0px 20px;
      font-weight: 700;
      font-size: 16px;
    }
  }
  .el-loading-spinner {
    width: 30px;
    height: 30px;
    border-radius: 50%;
    -webkit-animation: typing 1s linear infinite alternate;
    -moz-animation: Typing 1s linear infinite alternate;
    animation: typing 1s linear infinite alternate;
    margin: 0px auto; /* Not necessary- its only for layouting*/
    position: relative;
    left: -40px;
  }
  @-webkit-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
        80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
        80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
        80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }

  @-moz-keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
        80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
        80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
        80px 0px 0px 0px rgba(247, 111, 73, 1);
    }
  }
  @keyframes typing {
    0% {
      background-color: rgba(247, 111, 73, 1);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 0.2),
        80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    25% {
      background-color: rgba(247, 111, 73, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(247, 111, 73, 2),
        80px 0px 0px 0px rgba(247, 111, 73, 0.2);
    }
    75% {
      background-color: rgba(0, 184, 220, 0.4);
      box-shadow: 40px 0px 0px 0px rgba(249, 54, 0, 0.2),
        80px 0px 0px 0px rgb(2, 243, 130);
    }
  }
}
</style>