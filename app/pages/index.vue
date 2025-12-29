<template>
  <div class="space-y-6">
    <!-- Summary Stats Cards -->
    <div>
      <h3 class="text-lg font-semibold text-gray-900 mb-4">สรุปภาพรวม</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- Total Units Card -->
        <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div class="card-body p-5">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm text-blue-100 mb-2">หน่วยที่ใช้ทั้งหมด</p>
                <p class="text-3xl font-bold mb-1">{{ totalUnitsUsed.toLocaleString('th-TH') }}</p>
                <p class="text-xs text-blue-100">หน่วย</p>
              </div>
              <div class="p-2.5 bg-white/20 rounded-lg">
                <BarChart3 class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Total Cost Card -->
        <div class="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div class="card-body p-5">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm text-emerald-100 mb-2">ค่าใช้จ่ายทั้งหมด</p>
                <p class="text-3xl font-bold mb-1">{{ formatCurrency(totalCost) }}</p>
                <p class="text-xs text-emerald-100">บาท</p>
              </div>
              <div class="p-2.5 bg-white/20 rounded-lg">
                <Wallet class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        <!-- Total Records Card -->
        <div class="card bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div class="card-body p-5">
            <div class="flex items-start justify-between">
              <div class="flex-1">
                <p class="text-sm text-purple-100 mb-2">จำนวนบันทึก</p>
                <p class="text-3xl font-bold mb-1">{{ records.length }}</p>
                <p class="text-xs text-purple-100">รายการ</p>
              </div>
              <div class="p-2.5 bg-white/20 rounded-lg">
                <FileText class="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Records -->
    <div class="card bg-white shadow-lg">
      <div class="card-body">
        <h3 class="card-title text-xl mb-4">บันทึกล่าสุด</h3>
        <div v-if="records.length === 0" class="text-center py-12 text-gray-400">
          <FileText class="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p class="text-lg">ยังไม่มีข้อมูลการบันทึก</p>
        </div>
        <div v-else class="space-y-3">
          <div 
            v-for="record in sortedRecords.slice(0, 5)" 
            :key="record.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div>
              <p class="font-semibold text-gray-900">{{ getThaiMonth(record.month) }} {{ record.year }}</p>
              <p class="text-sm text-gray-600">{{ record.unitsUsed.toLocaleString('th-TH') }} หน่วย</p>
            </div>
            <div class="text-right">
              <p class="font-bold text-emerald-600">{{ formatCurrency(record.totalPrice) }}</p>
              <p class="text-xs text-gray-500">{{ formatDate(record.createdAt) }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { BarChart3, Wallet, FileText } from 'lucide-vue-next'

definePageMeta({
  title: 'แดชบอร์ด',
  subtitle: 'ภาพรวมการใช้น้ำและค่าใช้จ่าย'
})

const { 
  records, 
  sortedRecords, 
  totalUnitsUsed, 
  totalCost, 
  getThaiMonth, 
  formatCurrency, 
  formatDate,
  loadData 
} = useWaterData()

onMounted(() => {
  loadData()
})
</script>
