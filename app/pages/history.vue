<template>
  <div class="space-y-6">
    <!-- Filters -->
    <div class="flex flex-col sm:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg shadow-sm">
      <div class="flex items-center gap-2 w-full sm:w-auto">
        <span class="text-sm font-medium text-gray-700">กรองตามครัวเรือน:</span>
        <select v-model="selectedHousehold" class="select select-bordered select-sm w-full sm:w-56">
          <option value="all">ทั้งหมด</option>
          <option v-for="h in households" :key="h.id" :value="h.id">
            {{ h.houseName }}
          </option>
        </select>
      </div>
      
      <div class="text-sm text-gray-500">
        ทั้งหมด {{ filteredRecords.length }} รายการ
      </div>
    </div>

    <!-- History List -->
    <div class="bg-white rounded-xl shadow-lg overflow-hidden">
      <!-- Mobile View (Cards) -->
      <div class="md:hidden divide-y divide-gray-100">
        <div v-if="filteredRecords.length === 0" class="p-8 text-center text-gray-400">
          <p>ไม่มีประวัติการบันทึก</p>
        </div>
        <div 
          v-for="record in filteredRecords" 
          :key="record.id" 
          class="p-4 space-y-3"
        >
          <div class="flex justify-between items-start">
            <div>
              <div class="font-bold text-lg text-gray-900">
                {{ getThaiMonth(record.month) }} {{ record.year }}
              </div>
              <div class="text-sm font-medium text-blue-600">
                {{ getHouseholdName(record.householdId) }}
              </div>
              <div class="text-xs text-gray-500 mt-1">
                จดเมื่อ {{ formatDate(record.createdAt) }}
              </div>
            </div>
            <div class="text-right">
              <div class="font-bold text-xl text-emerald-600">
                {{ formatCurrency(record.totalPrice) }}
              </div>
              <div class="text-sm text-gray-600">
                {{ record.unitsUsed }} หน่วย
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-2 text-sm bg-gray-50 p-3 rounded-lg">
            <div>
              <span class="text-gray-500">มิเตอร์เดิม:</span>
              <span class="ml-2 font-mono">{{ record.previousReading }}</span>
            </div>
            <div>
              <span class="text-gray-500">มิเตอร์ใหม่:</span>
              <span class="ml-2 font-mono font-bold">{{ record.currentReading }}</span>
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button 
              @click="confirmDelete(record.id)"
              class="btn btn-ghost btn-xs text-red-500 hover:bg-red-50"
            >
              <Trash2 class="w-4 h-4 mr-1" />
              ลบรายการ
            </button>
          </div>
        </div>
      </div>

      <!-- Desktop View (Table) -->
      <table class="hidden md:table table w-full">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-200">
            <th class="font-semibold text-gray-600">ครัวเรือน</th>
            <th class="font-semibold text-gray-600">เดือน/ปี</th>
            <th class="font-semibold text-gray-600 text-right">เลขมิเตอร์</th>
            <th class="font-semibold text-gray-600 text-right">จำนวนหน่วย</th>
            <th class="font-semibold text-gray-600 text-right">ค่าใช้จ่าย</th>
            <th class="font-semibold text-gray-600 text-center">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="filteredRecords.length === 0">
            <td colspan="6" class="text-center py-8 text-gray-400">
              ไม่มีข้อมูลประวัติการบันทึก
            </td>
          </tr>
          <tr 
            v-for="record in filteredRecords" 
            :key="record.id" 
            class="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0"
          >
            <td class="font-medium text-blue-900">
              {{ getHouseholdName(record.householdId) }}
            </td>
            <td>
              <div class="font-medium">{{ getThaiMonth(record.month) }} {{ record.year }}</div>
              <div class="text-xs text-gray-500">{{ formatDate(record.createdAt) }}</div>
            </td>
            <td class="text-right">
              <div class="font-mono">
                <span class="text-gray-400">{{ record.previousReading }}</span>
                <span class="mx-2">→</span>
                <span class="font-bold">{{ record.currentReading }}</span>
              </div>
            </td>
            <td class="text-right font-medium">
              {{ record.unitsUsed.toLocaleString() }}
            </td>
            <td class="text-right">
              <div class="font-bold text-emerald-600">
                {{ formatCurrency(record.totalPrice) }}
              </div>
            </td>
            <td class="text-center">
              <button 
                @click="confirmDelete(record.id)"
                class="btn btn-ghost btn-sm text-red-500 hover:bg-red-50 tooltip tooltip-left"
                data-tip="ลบรายการ"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Trash2 } from 'lucide-vue-next'

definePageMeta({
  title: 'ประวัติการบันทึก',
  subtitle: 'ดูประวัติการบันทึกทั้งหมด'
})

const { 
  records, 
  households, 
  loadData, 
  deleteRecord, 
  getThaiMonth, 
  formatCurrency, 
  formatDate 
} = useWaterData()

const selectedHousehold = ref('all')

const filteredRecords = computed(() => {
  let result = [...records.value].sort((a, b) => {
    if (a.year !== b.year) return b.year - a.year
    return b.month - a.month
  })

  if (selectedHousehold.value !== 'all') {
    result = result.filter(r => r.householdId === selectedHousehold.value)
  }

  return result
})

const getHouseholdName = (id: string) => {
  const household = households.value.find(h => h.id === id)
  return household ? household.houseName : 'ไม่ระบุ'
}

const confirmDelete = (id: string) => {
  if (confirm('คุณแน่ใจหรือไม่ที่จะลบรายการนี้?')) {
    deleteRecord(id)
  }
}

onMounted(() => {
  loadData()
})
</script>
