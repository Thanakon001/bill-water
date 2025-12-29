export interface Household {
  id: string
  houseName: string
  ownerName: string
  address?: string
  phoneNumber?: string
  createdAt: string
}

export interface WaterRecord {
  id: string
  householdId: string
  month: number
  year: number
  previousReading: number
  currentReading: number
  pricePerUnit: number
  unitsUsed: number
  totalPrice: number
  createdAt: string
}

export interface RecordForm {
  householdId: string
  month: number | string
  year: number
  previousReading: number
  currentReading: number
  pricePerUnit: number
}

export const useWaterData = () => {
  // Constants
  const STORAGE_KEY = 'water-meter-records'
  const HOUSEHOLDS_KEY = 'water-meter-households'
  
  const thaiMonths = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]

  // State
  const records = useState<WaterRecord[]>('records', () => [])
  const households = useState<Household[]>('households', () => [])
  const form = useState<RecordForm>('recordForm', () => ({
    householdId: '',
    month: '',
    year: new Date().getFullYear() + 543,
    previousReading: 0,
    currentReading: 0,
    pricePerUnit: 18
  }))

  // Computed
  const sortedRecords = computed(() => {
    return [...records.value].sort((a, b) => {
      if (a.year !== b.year) return b.year - a.year
      return b.month - a.month
    })
  })

  const totalUnitsUsed = computed(() => {
    return records.value.reduce((sum, record) => sum + record.unitsUsed, 0)
  })

  const totalCost = computed(() => {
    return records.value.reduce((sum, record) => sum + record.totalPrice, 0)
  })

  // Actions
  const loadData = () => {
    if (import.meta.client) {
      try {
        const savedRecords = localStorage.getItem(STORAGE_KEY)
        if (savedRecords) records.value = JSON.parse(savedRecords)
        
        const savedHouseholds = localStorage.getItem(HOUSEHOLDS_KEY)
        if (savedHouseholds) households.value = JSON.parse(savedHouseholds)
      } catch (error) {
        console.error('Error loading data:', error)
      }
    }
  }

  const saveData = () => {
    if (import.meta.client) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records.value))
        localStorage.setItem(HOUSEHOLDS_KEY, JSON.stringify(households.value))
      } catch (error) {
        console.error('Error saving data:', error)
      }
    }
  }

  const addRecord = (record: WaterRecord) => {
    records.value.push(record)
    saveData()
  }

  const deleteRecord = (id: string) => {
    records.value = records.value.filter(r => r.id !== id)
    saveData()
  }

  const addHousehold = (household: Household) => {
    households.value.push(household)
    saveData()
  }

  const deleteHousehold = (id: string) => {
    households.value = households.value.filter(h => h.id !== id)
    saveData()
  }

  const getThaiMonth = (month: number) => thaiMonths[month - 1] || ''
  
  const formatCurrency = (amount: number) => {
    return `฿${amount.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const day = date.getDate()
    const month = thaiMonths[date.getMonth()]
    const year = date.getFullYear() + 543
    return `${day} ${month} ${year}`
  }

  return {
    thaiMonths,
    records,
    households,
    form,
    sortedRecords,
    totalUnitsUsed,
    totalCost,
    loadData,
    saveData,
    addRecord,
    deleteRecord,
    addHousehold,
    deleteHousehold,
    getThaiMonth,
    formatCurrency,
    formatDate
  }
}
