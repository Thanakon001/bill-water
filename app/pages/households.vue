<template>
  <div class="space-y-8">
    <!-- Add Household Form -->
    <div class="card-modern">
      <div class="card-body">
        <div class="form-section-title mb-6">
          <div class="icon">
            <PlusCircle class="w-5 h-5" />
          </div>
          <span>เพิ่มครัวเรือนใหม่</span>
        </div>
        
        <div class="form-grid">
          <div class="form-control input-animated">
            <label class="label">
              <span class="label-text">
                ชื่อบ้าน/เลขที่บ้าน 
                <span class="text-red-500">*</span>
              </span>
            </label>
            <div class="input-group-modern">
              <Home class="input-icon w-5 h-5" />
              <input 
                type="text" 
                v-model="newHousehold.houseName" 
                placeholder="เช่น บ้านเลขที่ 12/3" 
                class="input-modern" 
              />
            </div>
          </div>
          
          <div class="form-control input-animated">
            <label class="label">
              <span class="label-text">
                ชื่อเจ้าของ/หัวหน้าครัวเรือน 
                <span class="text-red-500">*</span>
              </span>
            </label>
            <div class="input-group-modern">
              <User class="input-icon w-5 h-5" />
              <input 
                type="text" 
                v-model="newHousehold.ownerName" 
                placeholder="ชื่อ-นามสกุล" 
                class="input-modern" 
              />
            </div>
          </div>

          <div class="form-control input-animated md:col-span-2">
            <label class="label">
              <span class="label-text">เบอร์โทรศัพท์</span>
            </label>
            <div class="input-group-modern">
              <Phone class="input-icon w-5 h-5" />
              <input 
                type="tel" 
                v-model="newHousehold.phoneNumber" 
                placeholder="08x-xxx-xxxx" 
                class="input-modern" 
              />
            </div>
          </div>
        </div>

        <div class="flex justify-end mt-6">
          <button 
            @click="submitHousehold" 
            class="btn-modern min-w-[160px]"
            :disabled="!newHousehold.houseName || !newHousehold.ownerName"
          >
            <span>
              <PlusCircle class="w-5 h-5" />
              บันทึกข้อมูล
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- Households List -->
    <div class="card-modern">
      <div class="card-body">
        <div class="flex items-center justify-between mb-6">
          <div class="form-section-title !mb-0">
            <div class="icon bg-gradient-to-br from-emerald-500 to-teal-600 !shadow-emerald-500/30">
              <Home class="w-5 h-5" />
            </div>
            <span>รายชื่อครัวเรือน</span>
          </div>
          <div class="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1.5 rounded-full text-sm font-semibold">
            {{ households.length }} รายการ
          </div>
        </div>
        
        <div v-if="households.length === 0" class="text-center py-12">
          <div class="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
            <Home class="w-10 h-10 text-slate-400" />
          </div>
          <p class="text-slate-600 font-medium">ยังไม่มีข้อมูลครัวเรือน</p>
          <p class="text-sm text-slate-400 mt-1">กรุณาเพิ่มข้อมูลครัวเรือนเพื่อเริ่มใช้งาน</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div 
            v-for="house in households" 
            :key="house.id" 
            class="group relative bg-gradient-to-br from-white to-slate-50 border-2 border-slate-100 
                   rounded-2xl p-5 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/10 
                   transition-all duration-300 hover:-translate-y-1"
          >
            <!-- Delete Button -->
            <button 
              @click="confirmDelete(house.id)"
              class="absolute top-3 right-3 w-8 h-8 rounded-lg bg-red-50 text-red-400 
                     flex items-center justify-center opacity-0 group-hover:opacity-100 
                     hover:bg-red-100 hover:text-red-600 transition-all duration-200"
            >
              <Trash2 class="w-4 h-4" />
            </button>

            <div class="flex items-start gap-4 mb-4">
              <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 
                          flex items-center justify-center text-white shadow-lg shadow-indigo-500/30 
                          flex-shrink-0">
                <Home class="w-6 h-6" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="font-bold text-slate-800 text-lg truncate">{{ house.houseName }}</h4>
                <p class="text-slate-500 truncate">{{ house.ownerName }}</p>
              </div>
            </div>

            <div class="space-y-2 pt-4 border-t border-slate-100">
              <div v-if="house.phoneNumber" class="flex items-center gap-3 text-sm text-slate-500">
                <div class="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <Phone class="w-3.5 h-3.5 text-emerald-500" />
                </div>
                <span>{{ house.phoneNumber }}</span>
              </div>
              <div class="flex items-center gap-3 text-sm text-slate-500">
                <div class="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center">
                  <Calendar class="w-3.5 h-3.5 text-blue-500" />
                </div>
                <span>เพิ่มเมื่อ {{ formatDate(house.createdAt) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Home, PlusCircle, Trash2, Phone, Calendar, User } from 'lucide-vue-next'

definePageMeta({
  title: 'จัดการครัวเรือน',
  subtitle: 'เพิ่มและแก้ไขข้อมูลครัวเรือน'
})

const { 
  households, 
  records, 
  loadData, 
  addHousehold, 
  deleteHousehold, 
  formatDate 
} = useWaterData()

const newHousehold = ref({
  houseName: '',
  ownerName: '',
  phoneNumber: ''
})

const submitHousehold = () => {
  if (!newHousehold.value.houseName || !newHousehold.value.ownerName) return

  addHousehold({
    id: crypto.randomUUID(),
    houseName: newHousehold.value.houseName,
    ownerName: newHousehold.value.ownerName,
    phoneNumber: newHousehold.value.phoneNumber,
    createdAt: new Date().toISOString()
  })

  // Reset form
  newHousehold.value = {
    houseName: '',
    ownerName: '',
    phoneNumber: ''
  }
}

const confirmDelete = (id: string) => {
  // Check if household has records
  const hasRecords = records.value.some(r => r.householdId === id)
  
  if (hasRecords) {
    alert('ไม่สามารถลบครัวเรือนนี้ได้เนื่องจากมีประวัติการบันทึกอยู่')
    return
  }

  if (confirm('คุณแน่ใจหรือไม่ที่จะลบข้อมูลครัวเรือนนี้?')) {
    deleteHousehold(id)
  }
}

onMounted(() => {
  loadData()
})
</script>
