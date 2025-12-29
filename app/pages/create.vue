<template>
  <div class="card-modern max-w-3xl mx-auto">
    <div class="card-body">
      
      <!-- Household Selection Section -->
      <div class="form-section">
        <div class="form-section-title">
          <div class="icon">
            <Home class="w-5 h-5" />
          </div>
          <span>เลือกครัวเรือน</span>
        </div>
        
        <div class="form-control">
          <div v-if="households.length > 0" class="input-group-modern">
            <Home class="input-icon w-5 h-5" />
            <select 
              v-model="form.householdId" 
              class="select-modern"
              @change="onHouseholdChange"
            >
              <option value="" disabled>-- กรุณาเลือกครัวเรือน --</option>
              <option v-for="h in households" :key="h.id" :value="h.id">
                {{ h.houseName }} ({{ h.ownerName }})
              </option>
            </select>
          </div>
          <div v-else class="alert-modern alert-modern-warning">
            <AlertCircle class="w-6 h-6 flex-shrink-0" />
            <div class="flex-1">
              <p class="font-medium">กรุณาเพิ่มข้อมูลครัวเรือนก่อนทำรายการบันทึก</p>
            </div>
            <NuxtLink to="/households" class="btn-modern text-sm px-4 py-2">
              <span>ไปหน้าจัดการ</span>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Date Selection Section -->
      <div class="form-section">
        <div class="form-section-title">
          <div class="icon">
            <Calendar class="w-5 h-5" />
          </div>
          <span>ระบุเดือนและปี</span>
        </div>
        
        <div class="form-grid">
          <div class="form-control input-animated">
            <label class="label">
              <span class="label-text">เดือน</span>
            </label>
            <select v-model="form.month" class="select-modern">
              <option value="" disabled>เลือกเดือน</option>
              <option v-for="(m, i) in thaiMonths" :key="i" :value="i + 1">
                {{ m }}
              </option>
            </select>
          </div>

          <div class="form-control input-animated">
            <label class="label">
              <span class="label-text">ปี (พ.ศ.)</span>
            </label>
            <input 
              type="number" 
              v-model="form.year" 
              class="input-modern input-number text-center"
            />
          </div>
        </div>
      </div>

      <!-- Meter Readings Section -->
      <div class="form-section">
        <div class="form-section-title">
          <div class="icon">
            <Gauge class="w-5 h-5" />
          </div>
          <span>อ่านค่ามิเตอร์</span>
        </div>
        
        <div class="form-grid">
          <div class="form-control input-animated">
            <label class="label">
              <span class="label-text">เลขมิเตอร์ครั้งก่อน</span>
            </label>
            <input 
              type="number" 
              v-model="form.previousReading" 
              class="input-modern input-number text-right"
              placeholder="0"
            />
          </div>

          <div class="form-control input-animated">
            <label class="label">
              <span class="label-text">เลขมิเตอร์ปัจจุบัน</span>
            </label>
            <input 
              type="number" 
              v-model="form.currentReading" 
              class="input-modern input-number text-right"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      <!-- Price Configuration -->
      <div class="form-control input-animated mb-8">
        <label class="label">
          <span class="label-text flex items-center gap-2">
            <Banknote class="w-4 h-4 text-emerald-500" />
            ราคาต่อหน่วย (บาท)
          </span>
        </label>
        <input 
          type="number" 
          v-model="form.pricePerUnit" 
          class="input-modern input-number"
        />
      </div>

      <!-- Preview Calculation -->
      <div class="preview-card">
        <div class="preview-card-content">
          <h4 class="text-indigo-900 font-semibold mb-6 text-lg">สรุปยอดที่ต้องชำระ</h4>
          <div class="grid grid-cols-2 gap-6">
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-5 text-center">
              <p class="text-sm text-slate-600 mb-2">ปริมาณน้ำที่ใช้</p>
              <p class="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {{ calculatedUnits }}
              </p>
              <p class="text-sm text-slate-500 mt-1">หน่วย</p>
            </div>
            <div class="bg-white/60 backdrop-blur-sm rounded-xl p-5 text-center">
              <p class="text-sm text-slate-600 mb-2">ยอดรวมทั้งสิ้น</p>
              <p class="text-4xl font-bold bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                {{ formatCurrency(calculatedUnits * form.pricePerUnit) }}
              </p>
              <p class="text-sm text-slate-500 mt-1">บาท</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="flex justify-end mt-8">
        <button 
          @click="submitRecord" 
          class="btn-modern btn-modern-success min-w-[180px]"
          :disabled="isSubmitting || calculatedUnits < 0 || !form.month || !form.householdId"
        >
          <span>
            <PlusCircle class="w-5 h-5" />
            {{ isSubmitting ? 'กำลังบันทึก...' : 'บันทึกข้อมูล' }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AlertCircle, PlusCircle, Home, Calendar, Gauge, Banknote } from 'lucide-vue-next'

definePageMeta({
  title: 'บันทึกมิเตอร์ใหม่',
  subtitle: 'เพิ่มข้อมูลการอ่านมิเตอร์ประจำเดือน'
})

const router = useRouter()
const { 
  form, 
  households, 
  records, 
  thaiMonths, 
  loadData, 
  addRecord, 
  formatCurrency 
} = useWaterData()

const isSubmitting = ref(false)

const calculatedUnits = computed(() => {
  if (form.value.currentReading > 0 && form.value.previousReading >= 0) {
    return Math.max(0, form.value.currentReading - form.value.previousReading)
  }
  return 0
})

// Auto-fill previous reading when household changes
const onHouseholdChange = () => {
  if (!form.value.householdId) return
  
  // Find last record for this household
  const householdRecords = records.value
    .filter(r => r.householdId === form.value.householdId)
    .sort((a, b) => b.currentReading - a.currentReading)
  
  if (householdRecords.length > 0) {
    form.value.previousReading = householdRecords[0]?.currentReading ?? 0
  } else {
    form.value.previousReading = 0
  }
  form.value.currentReading = 0
}

const submitRecord = async () => {
  if (!form.value.month || !form.value.householdId) return
  
  isSubmitting.value = true
  
  // Calculate total price
  const totalPrice = calculatedUnits.value * form.value.pricePerUnit
  
  const newRecord = {
    id: crypto.randomUUID(),
    householdId: form.value.householdId,
    month: Number(form.value.month),
    year: Number(form.value.year),
    previousReading: Number(form.value.previousReading),
    currentReading: Number(form.value.currentReading),
    pricePerUnit: Number(form.value.pricePerUnit),
    unitsUsed: calculatedUnits.value,
    totalPrice: totalPrice,
    createdAt: new Date().toISOString()
  }
  
  addRecord(newRecord)
  
  // Reset form but keep year and price
  form.value.month = ''
  form.value.currentReading = 0
  form.value.previousReading = Number(newRecord.currentReading) // Set next previous to current
  
  isSubmitting.value = false
    
  // Navigate to history
  router.push('/history')
}

onMounted(() => {
  loadData()
  // Set default household if only one exists
  if (households.value.length === 1) {
    const firstHousehold = households.value[0]
    if (firstHousehold) {
      form.value.householdId = firstHousehold.id
      onHouseholdChange()
    }
  }
})
</script>
