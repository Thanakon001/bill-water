<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-4xl font-bold text-blue-900 mb-2 flex items-center justify-center gap-3">
          <Droplets class="w-10 h-10" />
          ระบบบันทึกมิเตอร์น้ำ
        </h1>
        <p class="text-gray-600">จัดการและบันทึกค่าน้ำประปารายเดือน</p>
      </div>

      <!-- Dashboard Stats -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div class="card bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl">
          <div class="card-body">
            <div class="flex items-center gap-3">
              <BarChart3 class="w-8 h-8 opacity-80" />
              <div>
                <h2 class="card-title text-white/90 text-sm">หน่วยที่ใช้ทั้งหมด</h2>
                <p class="text-3xl font-bold">{{ totalUnitsUsed.toLocaleString('th-TH') }}</p>
                <p class="text-sm opacity-80">หน่วย</p>
              </div>
            </div>
          </div>
        </div>

        <div class="card bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-xl">
          <div class="card-body">
            <div class="flex items-center gap-3">
              <Wallet class="w-8 h-8 opacity-80" />
              <div>
                <h2 class="card-title text-white/90 text-sm">ค่าใช้จ่ายทั้งหมด</h2>
                <p class="text-3xl font-bold">{{ formatCurrency(totalCost) }}</p>
                <p class="text-sm opacity-80">บาท</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Input Form -->
      <div class="card bg-white shadow-xl mb-8">
        <div class="card-body">
          <h2 class="card-title text-2xl text-blue-900 mb-4 flex items-center gap-2">
            <PlusCircle class="w-6 h-6" />
            บันทึกมิเตอร์ใหม่
          </h2>

          <form @submit.prevent="addRecord" class="space-y-4">
            <!-- Month/Year Selection -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">เดือน</span>
                </label>
                <select v-model="form.month" class="select select-bordered" required>
                  <option value="">เลือกเดือน</option>
                  <option v-for="(month, index) in thaiMonths" :key="index" :value="index + 1">
                    {{ month }}
                  </option>
                </select>
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">ปี พ.ศ.</span>
                </label>
                <input 
                  v-model.number="form.year" 
                  type="number" 
                  placeholder="2567" 
                  class="input input-bordered" 
                  :min="2500"
                  :max="2600"
                  required 
                />
              </div>
            </div>

            <!-- Meter Readings -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">เลขมิเตอร์ครั้งก่อน</span>
                </label>
                <input 
                  v-model.number="form.previousReading" 
                  type="number" 
                  placeholder="0" 
                  class="input input-bordered" 
                  min="0"
                  required 
                />
              </div>

              <div class="form-control">
                <label class="label">
                  <span class="label-text font-semibold">เลขมิเตอร์ครั้งนี้</span>
                </label>
                <input 
                  v-model.number="form.currentReading" 
                  type="number" 
                  placeholder="0" 
                  class="input input-bordered" 
                  :class="{ 'input-error': validationError }"
                  min="0"
                  required 
                />
                <label v-if="validationError" class="label">
                  <span class="label-text-alt text-error flex items-center gap-1">
                    <AlertCircle class="w-4 h-4" />
                    {{ validationError }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Price Per Unit -->
            <div class="form-control">
              <label class="label">
                <span class="label-text font-semibold">ราคาต่อหน่วย (บาท)</span>
              </label>
              <input 
                v-model.number="form.pricePerUnit" 
                type="number" 
                step="0.01"
                placeholder="18.00" 
                class="input input-bordered" 
                min="0"
                required 
              />
            </div>

            <!-- Calculated Results -->
            <div v-if="form.currentReading > 0 && form.previousReading >= 0" 
                 class="alert bg-blue-50 border-blue-200">
              <div class="w-full">
                <div class="flex justify-between items-center mb-2">
                  <span class="font-semibold text-blue-900">หน่วยที่ใช้:</span>
                  <span class="text-xl font-bold text-blue-700">{{ calculatedUnits }} หน่วย</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="font-semibold text-blue-900">ยอดชำระ:</span>
                  <span class="text-xl font-bold text-emerald-600">{{ formatCurrency(calculatedPrice) }}</span>
                </div>
              </div>
            </div>

            <!-- Submit Button -->
            <button 
              type="submit" 
              class="btn btn-primary w-full text-white"
              :disabled="!isFormValid"
            >
              <Save class="w-5 h-5" />
              บันทึกข้อมูล
            </button>
          </form>
        </div>
      </div>

      <!-- History List -->
      <div class="card bg-white shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-2xl text-blue-900 mb-4 flex items-center gap-2">
            <History class="w-6 h-6" />
            ประวัติการบันทึก
          </h2>

          <div v-if="records.length === 0" class="text-center py-12 text-gray-400">
            <FileText class="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p class="text-lg">ยังไม่มีข้อมูลการบันทึก</p>
            <p class="text-sm">เริ่มต้นด้วยการเพิ่มบันทึกใหม่ด้านบน</p>
          </div>

          <!-- Mobile Cards -->
          <div class="block md:hidden space-y-4">
            <div 
              v-for="record in sortedRecords" 
              :key="record.id"
              class="card bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100"
            >
              <div class="card-body p-4">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <h3 class="font-bold text-lg text-blue-900">
                      {{ getThaiMonth(record.month) }} {{ record.year }}
                    </h3>
                    <p class="text-sm text-gray-600">{{ formatDate(record.createdAt) }}</p>
                  </div>
                  <button 
                    @click="deleteRecord(record.id)" 
                    class="btn btn-sm btn-ghost btn-circle text-error"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>

                <div class="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span class="text-gray-600">มิเตอร์ก่อน:</span>
                    <p class="font-semibold">{{ record.previousReading.toLocaleString('th-TH') }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">มิเตอร์นี้:</span>
                    <p class="font-semibold">{{ record.currentReading.toLocaleString('th-TH') }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">จำนวนหน่วย:</span>
                    <p class="font-semibold text-blue-700">{{ record.unitsUsed.toLocaleString('th-TH') }}</p>
                  </div>
                  <div>
                    <span class="text-gray-600">ยอดชำระ:</span>
                    <p class="font-semibold text-emerald-600">{{ formatCurrency(record.totalPrice) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Desktop Table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="table table-zebra">
              <thead>
                <tr class="bg-blue-100">
                  <th class="text-blue-900">เดือน/ปี</th>
                  <th class="text-blue-900">มิเตอร์ก่อน</th>
                  <th class="text-blue-900">มิเตอร์นี้</th>
                  <th class="text-blue-900">จำนวนหน่วย</th>
                  <th class="text-blue-900">ราคา/หน่วย</th>
                  <th class="text-blue-900">ยอดชำระ</th>
                  <th class="text-blue-900"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="record in sortedRecords" :key="record.id" class="hover">
                  <td class="font-semibold">{{ getThaiMonth(record.month) }} {{ record.year }}</td>
                  <td>{{ record.previousReading.toLocaleString('th-TH') }}</td>
                  <td>{{ record.currentReading.toLocaleString('th-TH') }}</td>
                  <td class="font-semibold text-blue-700">{{ record.unitsUsed.toLocaleString('th-TH') }}</td>
                  <td>{{ formatCurrency(record.pricePerUnit) }}</td>
                  <td class="font-semibold text-emerald-600">{{ formatCurrency(record.totalPrice) }}</td>
                  <td>
                    <button 
                      @click="deleteRecord(record.id)" 
                      class="btn btn-sm btn-ghost btn-circle text-error"
                    >
                      <Trash2 class="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { 
  Droplets, 
  BarChart3, 
  Wallet, 
  PlusCircle, 
  Save, 
  History, 
  FileText, 
  Trash2,
  AlertCircle
} from 'lucide-vue-next'

// ========================================
// Types & Interfaces
// ========================================

interface WaterRecord {
  id: string
  month: number
  year: number
  previousReading: number
  currentReading: number
  pricePerUnit: number
  unitsUsed: number
  totalPrice: number
  createdAt: string
}

interface RecordForm {
  month: number | string
  year: number
  previousReading: number
  currentReading: number
  pricePerUnit: number
}

// ========================================
// Constants
// ========================================

const thaiMonths = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
]

const STORAGE_KEY = 'water-meter-records'

// ========================================
// Reactive State
// ========================================

const records = ref<WaterRecord[]>([])

const form = ref<RecordForm>({
  month: '',
  year: new Date().getFullYear() + 543, // Convert to Buddhist year
  previousReading: 0,
  currentReading: 0,
  pricePerUnit: 18
})

// ========================================
// Computed Properties
// ========================================

// Calculate units used from form
const calculatedUnits = computed(() => {
  if (form.value.currentReading > 0 && form.value.previousReading >= 0) {
    return Math.max(0, form.value.currentReading - form.value.previousReading)
  }
  return 0
})

// Calculate total price from form
const calculatedPrice = computed(() => {
  return calculatedUnits.value * form.value.pricePerUnit
})

// Validation error message
const validationError = computed(() => {
  if (form.value.currentReading > 0 && form.value.previousReading > 0) {
    if (form.value.currentReading < form.value.previousReading) {
      return 'เลขมิเตอร์ครั้งนี้ต้องมากกว่าหรือเท่ากับครั้งก่อน'
    }
  }
  return ''
})

// Check if form is valid
const isFormValid = computed(() => {
  return form.value.month !== '' &&
         form.value.year > 0 &&
         form.value.currentReading >= 0 &&
         form.value.previousReading >= 0 &&
         form.value.pricePerUnit > 0 &&
         !validationError.value
})

// Sort records by year and month (newest first)
const sortedRecords = computed(() => {
  return [...records.value].sort((a, b) => {
    if (a.year !== b.year) {
      return b.year - a.year
    }
    return b.month - a.month
  })
})

// Calculate total units used (all time)
const totalUnitsUsed = computed(() => {
  return records.value.reduce((sum, record) => sum + record.unitsUsed, 0)
})

// Calculate total cost (all time)
const totalCost = computed(() => {
  return records.value.reduce((sum, record) => sum + record.totalPrice, 0)
})

// ========================================
// Methods
// ========================================

/**
 * Load records from localStorage
 */
const loadRecords = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      records.value = JSON.parse(saved)
      
      // Auto-fill previous reading from most recent record
      if (records.value.length > 0) {
        const mostRecent = sortedRecords.value[0]
        form.value.previousReading = mostRecent.currentReading
      }
    }
  } catch (error) {
    console.error('Error loading records:', error)
  }
}

/**
 * Save records to localStorage
 */
const saveRecords = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
  } catch (error) {
    console.error('Error saving records:', error)
  }
}

/**
 * Add a new water meter record
 */
const addRecord = () => {
  if (!isFormValid.value) {
    return
  }

  const newRecord: WaterRecord = {
    id: Date.now().toString(),
    month: Number(form.value.month),
    year: form.value.year,
    previousReading: form.value.previousReading,
    currentReading: form.value.currentReading,
    pricePerUnit: form.value.pricePerUnit,
    unitsUsed: calculatedUnits.value,
    totalPrice: calculatedPrice.value,
    createdAt: new Date().toISOString()
  }

  records.value.push(newRecord)
  saveRecords()

  // Reset form and auto-fill previous reading
  form.value = {
    month: '',
    year: new Date().getFullYear() + 543,
    previousReading: newRecord.currentReading,
    currentReading: 0,
    pricePerUnit: 18
  }

  // Show success feedback
  alert('✅ บันทึกข้อมูลเรียบร้อยแล้ว!')
}

/**
 * Delete a record by ID
 */
const deleteRecord = (id: string) => {
  if (confirm('คุณต้องการลบบันทึกนี้หรือไม่?')) {
    records.value = records.value.filter(record => record.id !== id)
    saveRecords()
    
    // Update previous reading if needed
    if (records.value.length > 0) {
      const mostRecent = sortedRecords.value[0]
      form.value.previousReading = mostRecent.currentReading
    } else {
      form.value.previousReading = 0
    }
  }
}

/**
 * Get Thai month name
 */
const getThaiMonth = (month: number): string => {
  return thaiMonths[month - 1] || ''
}

/**
 * Format currency in Thai Baht
 */
const formatCurrency = (amount: number): string => {
  return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}

/**
 * Format date to Thai format
 */
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  const day = date.getDate()
  const month = thaiMonths[date.getMonth()]
  const year = date.getFullYear() + 543
  return `${day} ${month} ${year}`
}

// ========================================
// Lifecycle Hooks
// ========================================

onMounted(() => {
  loadRecords()
})
</script>

<style>
/* Ensure smooth transitions and responsive behavior */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom scrollbar for better UX */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
