<template>
  <div class="flex h-screen bg-gray-100 overflow-hidden">
    <!-- Sidebar -->
    <AppSidebar 
      :is-open="sidebarOpen" 
      @close="sidebarOpen = false"
    />

    <!-- Overlay for mobile -->
    <div 
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    ></div>

    <!-- Main Content -->
    <main class="flex-1 overflow-y-auto">
      <!-- Top Bar -->
      <div class="bg-white shadow-sm sticky top-0 z-30">
        <div class="flex items-center justify-between px-6 py-4">
          <div class="flex items-center gap-4">
            <button 
              @click="sidebarOpen = true"
              class="lg:hidden btn btn-ghost btn-sm btn-circle"
            >
              <Menu class="w-5 h-5" />
            </button>
            <div>
              <h2 class="text-xl font-bold text-gray-900">
                {{ pageTitle }}
              </h2>
              <p v-if="pageSubtitle" class="text-sm text-gray-600">{{ pageSubtitle }}</p>
            </div>
          </div>
          
          <div class="flex items-center gap-2">
            <div class="hidden sm:flex items-center gap-2 text-sm text-gray-600">
              <Calendar class="w-4 h-4" />
              <span>{{ currentDate }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Page Content -->
      <div class="p-6">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { Menu, Calendar } from 'lucide-vue-next'

const { formatDate } = useWaterData()
const route = useRoute()
const sidebarOpen = ref(false)

// Close sidebar on route change (mobile)
watch(() => route.path, () => {
  sidebarOpen.value = false
})

const pageTitle = computed(() => route.meta.title as string || 'ระบบมิเตอร์น้ำ')
const pageSubtitle = computed(() => route.meta.subtitle as string || '')

const currentDate = computed(() => {
  return formatDate(new Date().toISOString())
})
</script>
