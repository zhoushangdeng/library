<template>
  <div class="Menu">
    <div class="menu">
      <el-menu :uniqueOpened="true" :default-active="defaultActive" class="el-menu-vertical-demo" @open="handleOpen" background-color="#2e3035" text-color="#fff" active-text-color="#ffd04b" :collapse="isCollapse" :collapse-transition="true" style="height: calc(100vh - 40px)">
        <el-submenu v-for="item1 in state.menusTree" :key="item1.id" :index="item1.id">
          <template #title>
            <i :class="item1.icon"></i>
            <span>{{ item1.title || '' }}</span>
          </template>
          <el-menu-item-group>
            <el-menu-item @click="clickRoute(item2, item2.index)" v-for="(item2) in item1.children" :key="item2.id" :index="item2.id">
              <i :class="item2.icon"></i>{{ item2.title }}
            </el-menu-item>
          </el-menu-item-group>
        </el-submenu>
      </el-menu>
    </div>
    <div class="footer">
      <el-button :icon="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" @click="isCollapse = !isCollapse" size="medium" />
    </div>
  </div>
</template>

<script lang="ts" >
import { defineComponent, ref, onBeforeMount, computed, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { getMenusTree } from '@/api/menus'
import { getToken } from '@/util/auth'
export default defineComponent({
  name: 'Menu',
  components: {},
  setup() {
    const state = reactive({ menusTree: [], tableData: [] })
    const store = useStore()
    const isCollapse = ref(false)
    const defaultActive = ref('1')
    const handleOpen = (index: any) => {}

    const router = useRouter()
    const clickRoute = (item: any) => {
      item = {
        path: '/' + item.menusName,
        name: item.title,
        meta: {
          title: item.title,
          keepAlive: true,
        },
        component: item.path,
        id: item.id,
      }
      const existence = store.state.userInfo.cachedMenu.filter(
        (item2: any) => item.name === item2.name
      )
      if (existence.length == 0 && item.name !== '首页') {
        store.dispatch('addKeepAlive', item)
      }
      store.dispatch('asyncClickRoute', item)
      store.dispatch('asyncgetdefaultActive', item.id)
      router.push(item.path)
    }

    const getInfos = async () => {
      const data = await getMenusTree({ roleId: getToken().roleId })
      state.menusTree = data
    }
    getInfos()
    return {
      isCollapse,
      handleOpen,
      clickRoute,
      state,
      defaultActive: computed(() => store.state.userInfo.defaultActive),
    }
  },
})
</script>
<style lang="scss">
.Menu {
  background: #2e3035;
  height: 100vh;
  display: flex;
  flex-direction: column; /* 垂直显示 */
  .menu {
    flex: 1;
  }
  .footer {
    height: 40px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      background: #fff0;
      border: 0px;
    }
  }
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    min-width: 201px;
    margin-bottom: 0px;
  }
  .el-menu {
    border-right: 1px solid #2e3035;
  }
}
</style>
