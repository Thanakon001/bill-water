<template>
  <aside 
    class="fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out"
    :class="isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
  >
    <div class="flex flex-col h-full">
      <!-- Sidebar Header -->
      <div class="p-6 border-b border-gray-100">
        <div class="flex items-center justify-between">
          <NuxtLink to="/" class="flex items-center gap-3">
            <div class="p-2 bg-blue-50 rounded-lg">
              <Droplets class="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h1 class="text-lg font-semibold text-gray-900">ระบบมิเตอร์น้ำ</h1>
            </div>
          </NuxtLink>
          <button 
            @click="$emit('close')" 
            class="lg:hidden btn btn-ghost btn-sm btn-circle text-gray-600 hover:bg-gray-100"
          >
            <X class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Sidebar Content -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- Navigation Menu -->
        <nav class="space-y-1">
          <NuxtLink 
            to="/" 
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            <LayoutDashboard class="w-5 h-5" />
            <span>แดชบอร์ด</span>
          </NuxtLink>

          <NuxtLink 
            to="/households" 
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            <Home class="w-5 h-5" />
            <span>จัดการครัวเรือน</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/create" 
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            <PlusCircle class="w-5 h-5" />
            <span>บันทึกใหม่</span>
          </NuxtLink>
          
          <NuxtLink 
            to="/history" 
            class="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-gray-700 hover:bg-gray-50"
            active-class="bg-blue-50 text-blue-700 hover:bg-blue-50"
          >
            <History class="w-5 h-5" />
            <span>ประวัติการบันทึก</span>
          </NuxtLink>
        </nav>
      </div>

      <!-- Sidebar Footer -->
      <div class="p-4 border-t border-gray-100">
        <p class="text-xs text-gray-500 text-center">
          © 2025 ระบบมิเตอร์น้ำ
        </p>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { 
  Droplets, 
  LayoutDashboard, 
  PlusCircle, 
  History, 
  X,
  Home
} from 'lucide-vue-next'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>
