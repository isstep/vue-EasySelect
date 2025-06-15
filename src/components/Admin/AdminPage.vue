<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import axios from 'axios'

const authStore = useAuthStore()
const router = useRouter()
const loading = ref(true)
const currentStep = ref(1)
const bases = ref([])
const vehicles = ref([])
const newBaseNameInput = ref('')
const newBaseAddressInput = ref('')
const vehicleInput = ref('')
const routePlanningStage = ref('configure')
const selectedStartBaseId = ref(null)
const selectedStartBaseGeo = ref(null)
const addressInput = ref('')
const addressSuggestions = ref([])
const points = ref([])
const mapInstance = ref(null)
const routeDataForTable = ref([])
const fuelCostResult = ref(null)
const showResultTable = ref(false)
const apiError = ref(null)
const processingOrder = ref(false)
const processingStatusUpdate = ref(false)
const adminPendingOrders = ref([])
const activityLogData = ref([])
const reportYear = ref(new Date().getFullYear())
const reportMonth = ref(new Date().getMonth() + 1)
const reportLoading = ref(false)
const userDisplayName = computed(() => authStore.getUserDisplayName)
const userInitial = computed(() => {
  if (userDisplayName.value && userDisplayName.value.length > 0) {
    return userDisplayName.value[0].toUpperCase()
  }
  return '?'
})
const logisticsApiBaseUrl = `${import.meta.env.VITE_URL_SERVER}/api/logistics`
let pointMarkersOnMap = []
let routePolylineOnMap = null
onMounted(async () => {
  if (!authStore.isAuthenticated || !authStore.isAdmin) {
    router.push({ name: 'home' })
    return
  }
  await loadInitialDataForCurrentStep()
  loading.value = false
})
watch(currentStep, async (newStep, oldStep) => {
  await loadInitialDataForCurrentStep(newStep)
  if (newStep === 2 && oldStep !== 2) {
    routePlanningStage.value = 'configure'
  }
})
watch(selectedStartBaseId, async (newBaseId) => {
  selectedStartBaseGeo.value = null
  if (mapInstance.value && mapInstance.value.startBaseMarker) {
    mapInstance.value.removeLayer(mapInstance.value.startBaseMarker)
    mapInstance.value.startBaseMarker = null
  }
  if (newBaseId) {
    const base = bases.value.find((b) => b.id === newBaseId)
    if (base && base.lat && base.lon) {
      selectedStartBaseGeo.value = {
        lat: base.lat,
        lon: base.lon,
        address: base.geocodedAddress || base.addressString,
        name: base.name
      }
      if (mapInstance.value && (currentStep.value === 2 || currentStep.value === 3)) {
        mapInstance.value.startBaseMarker = L.marker([
          selectedStartBaseGeo.value.lat,
          selectedStartBaseGeo.value.lon
        ])
          .addTo(mapInstance.value)
          .bindPopup(
            `Стартовая база: ${selectedStartBaseGeo.value.name} (${selectedStartBaseGeo.value.address})`
          )
          .openPopup()
        updateMapBounds()
      }
    } else if (base && base.addressString) {
      try {
        apiError.value = null
        const suggestions = await geocodeAddress(base.addressString)
        if (suggestions && suggestions.length > 0) {
          selectedStartBaseGeo.value = {
            lat: suggestions[0].lat,
            lon: suggestions[0].lon,
            address: suggestions[0].address,
            name: base.name
          }
          if (mapInstance.value && (currentStep.value === 2 || currentStep.value === 3)) {
            mapInstance.value.startBaseMarker = L.marker([
              selectedStartBaseGeo.value.lat,
              selectedStartBaseGeo.value.lon
            ])
              .addTo(mapInstance.value)
              .bindPopup(
                `Стартовая база: ${selectedStartBaseGeo.value.name} (${selectedStartBaseGeo.value.address})`
              )
              .openPopup()
            updateMapBounds()
          }
        } else {
          apiError.value = `Не удалось геокодировать адрес базы: ${base.addressString}`
        }
      } catch (error) {
        apiError.value = `Ошибка геокодирования адреса базы: ${base.addressString}`
      }
    }
  } else {
    updateMapBounds()
  }
})
const loadInitialDataForCurrentStep = async (step = currentStep.value) => {
  apiError.value = null
  try {
    if (step === 1) {
      await Promise.all([fetchBases(), fetchVehicles()])
    } else if (step === 2 || step === 3) {
      if (!mapInstance.value) {
        await initMapWithRetry()
      } else {
        setTimeout(() => {
          if (mapInstance.value) {
            mapInstance.value.invalidateSize()
            updateMapBounds()
          }
        }, 50)
      }
    } else if (step === 4) {
      await fetchAdminPendingOrders()
    } else if (step === 5) {
      await fetchActivityLog()
    }
  } catch (error) {
    apiError.value = 'Ошибка при загрузке данных для текущего шага.'
    console.error('Ошибка загрузки данных для шага:', step, error)
  }
}
const signOut = () => {
  authStore.logout()
  router.push({ name: 'login' })
}
const initMapWithRetry = async (retries = 5, delay = 200) => {
  if (mapInstance.value) return
  for (let i = 0; i < retries; i++) {
    const mapElement = document.getElementById('adminLogisticsMap')
    if (mapElement && mapElement.offsetParent !== null) {
      try {
        mapInstance.value = L.map(mapElement).setView([53.905, 27.558], 12)
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '© OpenStreetMap contributors'
        }).addTo(mapInstance.value)
        updateMapBounds()
        return
      } catch (error) {
        console.error(`Попытка ${i + 1} инициализации карты не удалась:`, error)
      }
    }
    await new Promise((resolve) => setTimeout(resolve, delay))
  }
  console.error('Не удалось инициализировать карту после нескольких попыток.')
  apiError.value = 'Не удалось загрузить карту. Попробуйте обновить страницу.'
}
const geocodeAddress = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&addressdetails=1&limit=5&countrycodes=by,ru`
    )
    if (!response.ok) {
      throw new Error(`Nominatim error: ${response.status} ${response.statusText}`)
    }
    const data = await response.json()
    return data.length > 0
      ? data.map((item) => ({
          address: item.display_name,
          lat: parseFloat(item.lat),
          lon: parseFloat(item.lon)
        }))
      : []
  } catch (error) {
    console.error('Ошибка геокодирования:', error)
    addressSuggestions.value = []
    throw error
  }
}
const fetchAddressSuggestions = async () => {
  apiError.value = null
  const query = addressInput.value
  if (query.length < 3) {
    addressSuggestions.value = []
    return
  }
  try {
    addressSuggestions.value = await geocodeAddress(query)
  } catch (error) {
    apiError.value = 'Не удалось получить предложения адресов. Попробуйте снова.'
  }
}
const addPoint = (suggestion) => {
  const { lat, lon, address } = suggestion
  points.value.push({
    address,
    lat,
    lon,
    id: Date.now() + Math.random().toString(36).substring(2)
  })
  if (mapInstance.value) {
    const newMarker = L.marker([lat, lon]).addTo(mapInstance.value)
    newMarker.bindPopup(`Точка назначения: ${address}`)
    pointMarkersOnMap.push(newMarker)
    updateMapBounds()
  }
  addressInput.value = ''
  addressSuggestions.value = []
}
const removePoint = (pointId) => {
  const index = points.value.findIndex((p) => p.id === pointId)
  if (index !== -1) {
    points.value.splice(index, 1)
    if (pointMarkersOnMap[index] && mapInstance.value) {
      mapInstance.value.removeLayer(pointMarkersOnMap[index])
      pointMarkersOnMap.splice(index, 1)
    }
    updateMapBounds()
  }
}
const updateMapBounds = () => {
  if (!mapInstance.value) return
  let allMapPointsCoords = points.value.map((p) => [p.lat, p.lon])
  if (selectedStartBaseGeo.value) {
    allMapPointsCoords.unshift([selectedStartBaseGeo.value.lat, selectedStartBaseGeo.value.lon])
  }
  if (allMapPointsCoords.length > 0) {
    const bounds = L.latLngBounds(allMapPointsCoords)
    mapInstance.value.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 })
  } else if (mapInstance.value.startBaseMarker && selectedStartBaseGeo.value) {
    mapInstance.value.setView([selectedStartBaseGeo.value.lat, selectedStartBaseGeo.value.lon], 13)
  } else {
    mapInstance.value.setView([53.905, 27.558], 6)
  }
}
const getRandomColor = () =>
  `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, '0')}`
const processOrderAndGoToResults = async () => {
  processingOrder.value = true
  const finalPointsForAPI = []
  if (selectedStartBaseGeo.value) {
    finalPointsForAPI.push({
      lat: selectedStartBaseGeo.value.lat,
      lon: selectedStartBaseGeo.value.lon,
      address: `${selectedStartBaseGeo.value.name} (Старт)`
    })
  }
  points.value.forEach((p) => {
    finalPointsForAPI.push({ lat: p.lat, lon: p.lon, address: p.address })
  })
  if (finalPointsForAPI.length < 2) {
    alert(
      'Для построения маршрута необходимо как минимум две точки (например, стартовая база и одно место назначения, или два места назначения если база не выбрана).'
    )
    processingOrder.value = false
    return
  }
  apiError.value = null
  showResultTable.value = false
  routeDataForTable.value = []
  fuelCostResult.value = null
  if (routePolylineOnMap && mapInstance.value) {
    mapInstance.value.removeLayer(routePolylineOnMap)
    routePolylineOnMap = null
  }
  try {
    const response = await axios.post(
      `${logisticsApiBaseUrl}/process-route`,
      { points: finalPointsForAPI },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    const data = response.data
    if (data.routePlan && Array.isArray(data.routePlan)) {
      routeDataForTable.value = data.routePlan.map((segment) => ({
        from: segment.from.address,
        to: segment.to.address,
        distance: segment.distance
      }))
    }
    fuelCostResult.value = data.fuelCost
    showResultTable.value = true
    currentStep.value = 3
    if (data.geometry && Array.isArray(data.geometry) && mapInstance.value) {
      const routeCoordinates = data.geometry.map(([lng, lat]) => [lat, lng])
      const routeColor = getRandomColor()
      routePolylineOnMap = L.polyline(routeCoordinates, { color: routeColor, weight: 5 }).addTo(
        mapInstance.value
      )
      mapInstance.value.fitBounds(routePolylineOnMap.getBounds(), { padding: [50, 50] })
    } else if (!data.geometry) {
      console.warn('Геометрия маршрута не получена от сервера.')
    }
  } catch (error) {
    console.error('Ошибка при обработке маршрута:', error)
    apiError.value =
      error.response?.data?.error || 'Не удалось обработать маршрут. Попробуйте позже.'
    showResultTable.value = false
  } finally {
    processingOrder.value = false
  }
}
const fetchBases = async () => {
  try {
    const response = await axios.get(`${logisticsApiBaseUrl}/bases`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    bases.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки баз:', error)
    if (currentStep.value === 1) apiError.value = 'Не удалось загрузить список баз.'
  }
}
const addBase = async () => {
  if (!newBaseNameInput.value.trim()) {
    alert('Введите название базы.')
    return
  }
  if (!newBaseAddressInput.value.trim()) {
    alert('Введите адрес базы.')
    return
  }
  try {
    const response = await axios.post(
      `${logisticsApiBaseUrl}/bases`,
      { name: newBaseNameInput.value.trim(), address: newBaseAddressInput.value.trim() },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    bases.value.push(response.data)
    newBaseNameInput.value = ''
    newBaseAddressInput.value = ''
    apiError.value = null
  } catch (error) {
    console.error('Ошибка добавления базы:', error)
    apiError.value =
      error.response?.data?.error ||
      'Не удалось добавить базу. Возможно, адрес не удалось геокодировать.'
  }
}
const fetchVehicles = async () => {
  try {
    const response = await axios.get(`${logisticsApiBaseUrl}/vehicles`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    vehicles.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки ТС:', error)
    if (currentStep.value === 1) apiError.value = 'Не удалось загрузить список ТС.'
  }
}
const addVehicle = async () => {
  if (!vehicleInput.value.trim()) {
    alert('Введите данные автомобиля.')
    return
  }
  try {
    const response = await axios.post(
      `${logisticsApiBaseUrl}/vehicles`,
      { name: vehicleInput.value.trim() },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    vehicles.value.push(response.data)
    vehicleInput.value = ''
  } catch (error) {
    console.error('Ошибка добавления ТС:', error)
    if (currentStep.value === 1)
      apiError.value = error.response?.data?.error || 'Не удалось добавить ТС.'
  }
}
const fetchAdminPendingOrders = async () => {
  apiError.value = null
  try {
    const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/admin/orders`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    adminPendingOrders.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error)
    apiError.value = 'Не удалось загрузить список заявок.'
    adminPendingOrders.value = []
  }
}
const markOrderAsDelivered = async (orderDocId, orderId) => {
  if (!orderDocId) {
    alert('Ошибка: ID документа заказа не найден.')
    return
  }
  if (!confirm(`Вы уверены, что хотите отметить заказ #${orderId} как "Доставлен"?`)) {
    return
  }
  processingStatusUpdate.value = true
  apiError.value = null
  try {
    await axios.put(
      `${import.meta.env.VITE_URL_SERVERl}/api/admin/orders/${orderDocId}/status`,
      { status: 'delivered' },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    alert(`Заказ #${orderId} успешно отмечен как "Доставлен".`)
    await fetchAdminPendingOrders()
  } catch (error) {
    console.error('Ошибка обновления статуса заказа:', error)
    apiError.value = error.response?.data?.error || 'Не удалось обновить статус заказа.'
  } finally {
    processingStatusUpdate.value = false
  }
}
const addOrderAddressToRoutePlanner = async (orderAddress) => {
  apiError.value = null
  if (!orderAddress) {
    alert('Адрес заказа не найден.')
    return
  }
  try {
    const suggestions = await geocodeAddress(orderAddress)
    if (suggestions && suggestions.length > 0) {
      addPoint(suggestions[0])
      alert(`Адрес "${orderAddress}" добавлен в точки назначения.`)
      if (currentStep.value !== 2) goToStep(2)
      routePlanningStage.value = 'configure'
    } else {
      alert(`Не удалось геокодировать адрес: ${orderAddress}. Попробуйте добавить вручную.`)
    }
  } catch (error) {
    apiError.value = `Ошибка геокодирования адреса ${orderAddress}.`
    console.error(apiError.value, error)
  }
}
const fetchActivityLog = async () => {
  apiError.value = null
  try {
    const response = await axios.get(`${import.meta.env.VITE_URL_SERVER}/api/admin/activity-log`, {
      headers: { Authorization: `Bearer ${authStore.token}` }
    })
    activityLogData.value = response.data
  } catch (error) {
    console.error('Ошибка загрузки журнала:', error)
    apiError.value = 'Не удалось загрузить журнал активности.'
    activityLogData.value = []
  }
}
const downloadWordReport = async () => {
  apiError.value = null
  reportLoading.value = true
  try {
    const url = `${import.meta.env.VITE_URL_SERVER}/api/reports/orders-word?year=${reportYear.value}&month=${reportMonth.value}`
    const response = await axios.get(url, {
      headers: { Authorization: `Bearer ${authStore.token}` },
      responseType: 'blob'
    })
    const blob = new Blob([response.data], { type: response.headers['content-type'] })
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    const contentDisposition = response.headers['content-disposition']
    let fileName = `Отчет_заказы_${reportYear.value}_${String(reportMonth.value).padStart(2, '0')}.docx`
    if (contentDisposition) {
      const fileNameMatch =
        contentDisposition.match(/filename\*?=UTF-8''([^"]+)"?/i) ||
        contentDisposition.match(/filename="?([^"]+)"?/i)
      if (fileNameMatch && fileNameMatch.length > 1) {
        fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''))
      }
    }
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(link.href)
  } catch (error) {
    console.error('Ошибка скачивания отчета:', error)
    apiError.value =
      error.response?.data?.message ||
      error.response?.data?.error ||
      'Не удалось скачать отчет. Возможно, нет данных за указанный период.'
  } finally {
    reportLoading.value = false
  }
}
const goToStep = async (stepNumber) => {
  currentStep.value = stepNumber
}
const startNewRouteConfiguration = () => {
  points.value = []
  pointMarkersOnMap.forEach((marker) => mapInstance.value?.removeLayer(marker))
  pointMarkersOnMap = []
  selectedStartBaseId.value = null
  addressInput.value = ''
  addressSuggestions.value = []
  apiError.value = null
  routePlanningStage.value = 'configure'
  if (routePolylineOnMap && mapInstance.value) {
    mapInstance.value.removeLayer(routePolylineOnMap)
    routePolylineOnMap = null
  }
  showResultTable.value = false
  routeDataForTable.value = []
  fuelCostResult.value = null
  updateMapBounds()
}
</script>
<template>
  <div class="app">
    <aside class="sidebar">
      <div class="user-info">
        <div class="avatar">
          {{ userInitial }}
        </div>
        <span class="user-name">{{ userDisplayName }}</span>
      </div>
      <nav class="sidebar-links">
        <div
          @click="goToStep(2)"
          :class="['sidebar-link', { active: currentStep === 2 || currentStep === 3 }]"
        >
          Мои маршруты
        </div>
        <div @click="goToStep(4)" :class="['sidebar-link', { active: currentStep === 4 }]">
          Заявки
        </div>
        <div @click="goToStep(5)" :class="['sidebar-link', { active: currentStep === 5 }]">
          Журнал
        </div>
        <div @click="goToStep(6)" :class="['sidebar-link', { active: currentStep === 6 }]">
          Отчёты
        </div>
        <div @click="goToStep(1)" :class="['sidebar-link', { active: currentStep === 1 }]">
          Справочники
        </div>
        <router-link to="/ProductCreate" class="sidebar-link-router">
          <div :class="['sidebar-link']">База товаров</div>
        </router-link>
      </nav>
      <button @click="signOut" class="logout-btn">Выход</button>
    </aside>
    <main class="main-content-area">
      <div v-if="loading" class="text-center p-10">Загрузка интерфейса администратора...</div>
      <div v-else class="flex flex-col h-full">
        <div v-if="apiError" class="error-message mb-4">{{ apiError }}</div>
        <div v-show="currentStep === 1" class="step-content">
          <h1 class="section-title">Справочники</h1>
          <div class="grid md:grid-cols-2 gap-6">
            <div>
              <h2 class="text-lg font-semibold mb-3">Базы (Склады)</h2>
              <div class="form-group">
                <label for="newBaseNameInputAdmin">Название новой базы:</label>
                <input
                  id="newBaseNameInputAdmin"
                  v-model="newBaseNameInput"
                  placeholder="Название"
                />
              </div>
              <div class="form-group">
                <label for="newBaseAddressInputAdmin">Адрес новой базы:</label>
                <input
                  id="newBaseAddressInputAdmin"
                  v-model="newBaseAddressInput"
                  placeholder="Город, улица, дом"
                />
              </div>
              <button
                class="btn btn-primary mb-3"
                @click="addBase"
                :disabled="!newBaseNameInput.trim() || !newBaseAddressInput.trim()"
              >
                Добавить Базу
              </button>
              <ul v-if="bases.length" class="list-items">
                <li v-for="base in bases" :key="base.id">
                  <strong>{{ base.name }}</strong> <br />
                  <small>{{ base.addressString }}</small>
                  <small v-if="base.geocodedAddress && base.geocodedAddress !== base.addressString"
                    ><br />(Гео: {{ base.geocodedAddress }})</small
                  >
                </li>
              </ul>
              <p v-else class="text-sm text-gray-500">Список баз пуст.</p>
            </div>
            <div>
              <h2 class="text-lg font-semibold mb-3">Автомобили</h2>
              <div class="form-group">
                <label for="vehicleInputAdmin" class="sr-only">Добавить автомобиль</label>
                <div class="input-group">
                  <input
                    id="vehicleInputAdmin"
                    v-model="vehicleInput"
                    placeholder="Название/номер автомобиля"
                  />
                  <button
                    class="btn btn-primary"
                    @click="addVehicle"
                    :disabled="!vehicleInput.trim()"
                  >
                    Добавить
                  </button>
                </div>
              </div>
              <ul v-if="vehicles.length" class="list-items">
                <li v-for="vehicle in vehicles" :key="vehicle.id">{{ vehicle.name }}</li>
              </ul>
              <p v-else class="text-sm text-gray-500">Список автомобилей пуст.</p>
            </div>
          </div>
        </div>
        <div v-show="currentStep === 2" class="step-content">
          <div class="flex justify-between items-center mb-4">
            <h1 class="section-title mb-0">Составление маршрута</h1>
            <button class="btn btn-sm btn-outline-secondary" @click="startNewRouteConfiguration">
              Начать новый маршрут
            </button>
          </div>
          <div v-if="routePlanningStage === 'configure'">
            <h2 class="text-lg font-semibold mb-2">Шаг 1: Выбор точек</h2>
            <div class="form-group">
              <label for="startBaseSelect">Стартовая база (необязательно):</label>
              <select id="startBaseSelect" v-model="selectedStartBaseId" class="form-control">
                <option :value="null">-- Не выбрана --</option>
                <option v-for="base in bases" :key="base.id" :value="base.id">
                  {{ base.name }} ({{ base.addressString }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="addressInputAdminPoints">Адрес точки назначения:</label>
              <input
                id="addressInputAdminPoints"
                v-model="addressInput"
                @input="fetchAddressSuggestions"
                placeholder="Город, улица, дом для точки назначения"
              />
              <ul v-if="addressSuggestions.length" class="suggestions-list">
                <li
                  v-for="(suggestion, index) in addressSuggestions"
                  :key="index"
                  class="suggestion-item"
                  @click="addPoint(suggestion)"
                >
                  {{ suggestion.address }}
                </li>
              </ul>
            </div>
            <div class="flex justify-end mt-6">
              <button
                class="btn btn-primary"
                @click="routePlanningStage = 'review'"
                :disabled="points.length === 0 && !selectedStartBaseGeo"
              >
                Далее к проверке точек
              </button>
            </div>
          </div>
          <div v-if="routePlanningStage === 'review'">
            <h2 class="text-lg font-semibold mb-2">Шаг 2: Проверка выбранных точек</h2>
            <div v-if="selectedStartBaseGeo" class="mb-3 p-2 border rounded bg-gray-50">
              <strong>Стартовая точка:</strong> {{ selectedStartBaseGeo.name }} <br />
              <small>{{ selectedStartBaseGeo.address }}</small>
            </div>
            <div v-if="points.length" class="mt-2">
              <h3 class="text-md font-semibold mb-1">Точки назначения ({{ points.length }}):</h3>
              <ul class="list-items points-list">
                <li
                  v-for="point in points"
                  :key="point.id"
                  class="flex justify-between items-center py-1"
                >
                  <span class="text-sm">{{ point.address }}</span>
                  <button
                    @click="removePoint(point.id)"
                    class="text-red-500 hover:text-red-700 text-xs p-1 rounded hover:bg-red-100"
                    title="Удалить точку назначения"
                  >
                    Удалить
                  </button>
                </li>
              </ul>
            </div>
            <div v-if="points.length === 0 && !selectedStartBaseGeo" class="text-sm text-gray-500">
              Не выбрано ни одной точки. Вернитесь на предыдущий Шаг.
            </div>
            <div class="flex justify-between mt-6">
              <button class="btn btn-secondary" @click="routePlanningStage = 'configure'">
                Назад к выбору точек
              </button>
              <button
                class="btn btn-primary"
                @click="processOrderAndGoToResults"
                :disabled="
                  (points.length === 0 && !selectedStartBaseGeo) ||
                  (finalPointsForAPI && finalPointsForAPI.length < 2) ||
                  processingOrder
                "
              >
                {{ processingOrder ? 'Расчет...' : 'Рассчитать оптимальный маршрут' }}
              </button>
            </div>
          </div>
        </div>
        <div v-show="currentStep === 3" class="step-content">
          <h1 class="section-title">Шаг 3: Результаты расчета маршрута</h1>
          <div v-if="processingOrder" class="text-center p-4">Идет расчет маршрута...</div>
          <div v-else-if="showResultTable" class="mt-4">
            <table class="result-table">
              <thead>
                <tr>
                  <th>Откуда</th>
                  <th>Куда</th>
                  <th>Расстояние (км)</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in routeDataForTable" :key="index">
                  <td>{{ row.from }}</td>
                  <td>{{ row.to }}</td>
                  <td>{{ row.distance?.toFixed(2) || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
            <div v-if="fuelCostResult !== null" class="fuel-cost mt-4">
              Примерная стоимость топлива: {{ fuelCostResult.toFixed(2) }} рублей
            </div>
          </div>
          <div v-else-if="!apiError && !processingOrder" class="text-sm text-gray-600 mt-4">
            Нет данных для отображения. Рассчитайте маршрут.
          </div>
          <button
            class="btn mt-6"
            @click="
              () => {
                goToStep(2)
                routePlanningStage = 'review'
                showResultTable = false
                apiError = null
                if (routePolylineOnMap && mapInstance.value) {
                  mapInstance.value.removeLayer(routePolylineOnMap)
                  routePolylineOnMap = null
                }
              }
            "
          >
            Изменить точки / Новый расчет
          </button>
        </div>
        <div v-show="currentStep === 4" class="step-content orders-content">
          <h1 class="section-title">Заявки (Заказы клиентов)</h1>
          <div v-if="adminPendingOrders.length === 0 && !apiError" class="text-sm text-gray-500">
            Нет активных заявок для обработки.
          </div>
          <div v-else-if="adminPendingOrders.length > 0" class="table-responsive">
            <table class="result-table orders-table">
              <thead>
                <tr>
                  <th>ID Заказа</th>
                  <th>Email Клиента</th>
                  <th>Дата</th>
                  <th>Адрес</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in adminPendingOrders" :key="order.firestoreDocId">
                  <td>{{ order.id }}</td>
                  <td>{{ order.userEmail }}</td>
                  <td>{{ order.createdAt }}</td>
                  <td>{{ order.address }}</td>
                  <td>{{ order.totalPrice?.toFixed(2) }}</td>
                  <td>{{ order.status }}</td>
                  <td class="actions-cell">
                    <button
                      class="btn btn-sm btn-outline-primary mb-1"
                      @click="addOrderAddressToRoutePlanner(order.address)"
                      title="Добавить адрес этого заказа в точки назначения"
                      :disabled="processingStatusUpdate"
                    >
                      В маршрут
                    </button>
                    <button
                      v-if="order.status !== 'delivered'"
                      class="btn btn-sm btn-success"
                      @click="markOrderAsDelivered(order.firestoreDocId, order.id)"
                      title="Отметить заказ как доставленный"
                      :disabled="processingStatusUpdate"
                    >
                      {{ processingStatusUpdate ? 'Обработка...' : 'Принять' }}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-show="currentStep === 5" class="step-content log-content">
          <h1 class="section-title">Журнал обработанных запросов</h1>
          <div v-if="activityLogData.length === 0 && !apiError" class="text-sm text-gray-500">
            Журнал пуст.
          </div>
          <div v-else-if="activityLogData.length > 0" class="table-responsive">
            <table class="result-table log-table">
              <thead>
                <tr>
                  <th>Время</th>
                  <th>Тип</th>
                  <th>Детали</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in activityLogData" :key="log.id">
                  <td class="log-timestamp">{{ log.timestamp }}</td>
                  <td class="log-type">{{ log.type }}</td>
                  <td class="log-details">
                    <div v-if="log.type === 'order_creation'">
                      ID заказа: {{ log.orderId }}, Email: {{ log.userEmail }}, Сумма:
                      {{ log.totalPrice?.toFixed(2) }}, Адрес: {{ log.address }}
                    </div>
                    <div v-else-if="log.type === 'order_status_update'">
                      Заказ {{ log.orderId }} обновлен на "{{ log.newStatus }}" (Админ:
                      {{ log.adminEmail }})
                    </div>
                    <div v-else-if="log.type === 'base_added'">
                      База "{{ log.baseName }}" добавлена (Админ:
                      {{ log.adminUserId?.substring(0, 8) }}...)
                    </div>
                    <div v-else-if="log.type === 'route_processing'">
                      Маршрут обработан (Админ: {{ log.adminUserId?.substring(0, 8) }}...), Точек:
                      {{ log.pointsCount }}, Дистанция: {{ log.calculatedDistance }} км, Топливо:
                      {{ log.calculatedFuelCost?.toFixed(2) }}
                    </div>
                    <div v-else-if="log.type === 'order_creation_failed'">
                      Ошибка создания заказа для {{ log.userId?.substring(0, 8) }}: {{ log.error }}
                    </div>
                    <div v-else>
                      {{
                        JSON.stringify(
                          log,
                          (key, value) =>
                            key === 'id' || key === 'timestamp' || key === 'type'
                              ? undefined
                              : value,
                          2
                        )
                      }}
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div v-show="currentStep === 6" class="step-content reports-content">
          <h1 class="section-title">Отчёты</h1>
          <div class="form-group-inline">
            <label for="reportYear">Год:</label>
            <input type="number" id="reportYear" v-model.number="reportYear" class="report-input" />
            <label for="reportMonth">Месяц (1-12):</label>
            <input
              type="number"
              id="reportMonth"
              v-model.number="reportMonth"
              min="1"
              max="12"
              class="report-input"
            />
          </div>
          <button
            class="btn btn-primary mt-3"
            @click="downloadWordReport"
            :disabled="reportLoading"
          >
            {{ reportLoading ? 'Генерация...' : 'Скачать Word отчет по заказам' }}
          </button>
        </div>
        <div
          id="adminLogisticsMap"
          class="map-container card flex-grow mt-6"
          v-show="currentStep === 2 || currentStep === 3"
        ></div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app {
  margin-top: -50px;
  position: fixed;
  display: flex;
  width: 1370px;
  min-height: 102vh;
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fb;
  box-sizing: border-box;
}
.sidebar {
  margin-left: -190px;
  width: 250px;
  background-color: #001529;
  color: rgba(255, 255, 255, 0.65);
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  flex-shrink: 0;
  transition: margin-left 0.3s ease;
}
.user-info {
  display: flex;
  align-items: center;
  padding: 0 24px 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 16px;
}
.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 12px;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #1890ff;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
}
.user-name {
  font-size: 1rem;
  font-weight: 500;
  color: #fff;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.sidebar-links {
  flex-grow: 1;
}
.sidebar-link {
  display: block;
  font-size: 0.875rem;
  padding: 12px 24px;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  cursor: pointer;
  border-radius: 4px;
  margin-bottom: 4px;
}
.sidebar-link:hover,
.sidebar-link.active {
  background-color: #1890ff;
  color: #fff;
}
.sidebar-link-router {
  text-decoration: none;
  color: rgba(255, 255, 255, 0.65);
}
.sidebar-link-router .sidebar-link:hover {
  background-color: #1890ff;
  color: #fff;
}
.logout-btn {
  color: rgba(255, 255, 255, 0.65);
  border: none;
  padding: 12px 24px;
  width: 100%;
  text-align: center;
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    color 0.2s ease;
  margin-top: auto;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: #e00404c8;
  border-radius: 10px;
}
.logout-btn:hover {
  background-color: #c50000;
  color: #fff;
}
.main-content-area {
  flex-grow: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  max-height: 100vh;
  box-sizing: border-box;
}
.step-content {
  background-color: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.24);
  margin-bottom: 24px;
}
.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
}
.section-title.mb-0 {
  margin-bottom: 0;
}
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 6px;
  color: #555;
}
.form-group input,
.form-control,
.report-input {
  width: 100%;
  padding: 8px 12px;
  font-size: 0.875rem;
  border-radius: 4px;
  border: 1px solid #d9d9d9;
  transition:
    border-color 0.3s,
    box-shadow 0.3s;
  box-sizing: border-box;
}
.form-group input:focus,
.form-control:focus,
.report-input:focus {
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  outline: none;
}
.form-control {
  background-color: #fff;
  line-height: 1.5;
}
.report-input {
  width: auto;
  margin-right: 10px;
}
.form-group-inline {
  display: flex;
  align-items: center;
  gap: 8px;
}
.form-group-inline label {
  margin-bottom: 0;
}
.btn {
  background-color: #1890ff;
  color: #fff;
  padding: 8px 15px;
  border-radius: 4px;
  border: none;
  font-size: 0.875rem;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    opacity 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1.5;
}
.btn:hover:not(:disabled) {
  background-color: #40a9ff;
}
.btn:disabled {
  background-color: #f5f5f5;
  color: rgba(0, 0, 0, 0.25);
  cursor: not-allowed;
  border: 1px solid #d9d9d9 !important;
}
.btn-sm {
  padding: 4px 8px;
  font-size: 0.75rem;
}
.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}
.btn-success:hover:not(:disabled) {
  background-color: #218838;
  border-color: #1e7e34;
}
.btn-secondary {
  background-color: #6c757d;
  border-color: #6c757d;
}
.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
  border-color: #545b62;
}
.btn-outline-primary {
  background-color: transparent;
  color: #1890ff;
  border: 1px solid #1890ff;
}
.btn-outline-primary:hover:not(:disabled) {
  background-color: rgba(24, 144, 255, 0.1);
}
.btn-outline-secondary {
  background-color: transparent;
  border: 1px solid #6c757d;
  color: #6c757d;
}
.btn-outline-secondary:hover:not(:disabled) {
  background-color: #6c757d;
  color: #fff;
}
.input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}
.input-group input {
  flex-grow: 1;
}
.list-items {
  list-style: none;
  padding-left: 0;
  margin-top: 10px;
}
.list-items li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.875rem;
}
.list-items li:last-child {
  border-bottom: none;
}
.list-items li strong {
  display: block;
  margin-bottom: 2px;
}
.list-items li small {
  color: #555;
  font-size: 0.8em;
}
.points-list li {
  padding: 4px 0;
  font-size: 0.875rem;
}
.suggestions-list {
  list-style: none;
  padding: 0;
  margin-top: 4px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  max-height: 200px;
  overflow-y: auto;
  background-color: #fff;
  z-index: 1000;
  position: absolute;
  box-sizing: border-box;
  width: calc(100% - 48px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}
.suggestion-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 0.875rem;
}
.suggestion-item:hover {
  background-color: #f5f5f5;
}
.result-table {
  width: 100%;
  margin-top: 20px;
  border-collapse: collapse;
  font-size: 0.875rem;
}
.result-table th,
.result-table td {
  padding: 10px 12px;
  text-align: left;
  border: 1px solid #f0f0f0;
  word-break: break-word;
}
.result-table th {
  background-color: #fafafa;
  font-weight: 500;
  white-space: nowrap;
}
.actions-cell .btn {
  margin-right: 5px;
}
.actions-cell .mb-1 {
  margin-bottom: 0.25rem !important;
}
.fuel-cost {
  margin-top: 16px;
  font-size: 1rem;
  font-weight: 600;
}
.map-container {
  width: 100%;
  min-height: 400px;
  flex-grow: 1;
  border-radius: 8px;
  overflow: hidden;
  background-color: #e9e9e9;
}
#adminLogisticsMap {
  height: 100%;
  width: 100%;
}
.error-message {
  color: #ff4d4f;
  background-color: #fff1f0;
  border: 1px solid #ffccc7;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 0.875rem;
  margin-bottom: 16px;
}
.table-responsive {
  overflow-x: auto;
}
.log-timestamp {
  white-space: nowrap;
}
.log-type {
  font-weight: bold;
  white-space: nowrap;
}
.log-details {
  font-size: 0.8em;
}
.bg-gray-50 {
  background-color: #f9fafb;
}
.border {
  border-width: 1px;
}
.rounded {
  border-radius: 0.25rem;
}
.p-2 {
  padding: 0.5rem;
}
.mt-2 {
  margin-top: 0.5rem;
}
.mt-3 {
  margin-top: 0.75rem;
}
.mt-4 {
  margin-top: 1rem;
}
.mt-6 {
  margin-top: 1.5rem;
}
.mb-1 {
  margin-bottom: 0.25rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.mb-3 {
  margin-bottom: 0.75rem;
}
.mb-4 {
  margin-bottom: 1rem;
}
.text-sm {
  font-size: 0.875rem;
}
.text-gray-500 {
  color: #6b7280;
}
.text-gray-600 {
  color: #4b5563;
}
.text-md {
  font-size: 1rem;
  line-height: 1.5rem;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
.grid {
  display: grid;
}
.md\:grid-cols-2 {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}
@media (min-width: 768px) {
  .md\:grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
.gap-6 {
  gap: 1.5rem;
}
.text-lg {
  font-size: 1.125rem;
  line-height: 1.75rem;
}
.font-semibold {
  font-weight: 600;
}
.text-red-500 {
  color: #ef4444;
}
.hover\:text-red-700:hover {
  color: #b91c1c;
}
.text-xs {
  font-size: 0.75rem;
  line-height: 1rem;
}
.p-1 {
  padding: 0.25rem;
}
.hover\:bg-red-100:hover {
  background-color: #fee2e2;
}
.flex {
  display: flex;
}
.flex-col {
  flex-direction: column;
}
.h-full {
  height: 100%;
}
.flex-grow {
  flex-grow: 1;
}
.justify-between {
  justify-content: space-between;
}
.justify-end {
  justify-content: flex-end;
}
.items-center {
  align-items: center;
}
.text-center {
  text-align: center;
}
.p-10 {
  padding: 2.5rem;
}
.p-4 {
  padding: 1rem;
}
@media (max-width: 1024px) {
  .app {
    flex-direction: column;
    margin-top: 0;
    position: relative;
  }
  .sidebar {
    width: 100%;
    margin-left: 0;
    flex-direction: row;
    padding: 10px;
    justify-content: flex-start;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    height: auto;
    overflow-x: auto;
    white-space: nowrap;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .user-info {
    margin-bottom: 0;
    border-bottom: none;
    padding: 0 10px 0 0;
    flex-shrink: 0;
  }
  .sidebar-links {
    display: flex;
    flex-grow: 1;
    overflow-x: auto;
  }
  .sidebar-link {
    padding: 10px 15px;
    white-space: nowrap;
    margin-bottom: 0;
    margin-right: 5px;
  }
  .logout-btn {
    margin-top: 0;
    border-top: none;
    padding: 10px 15px;
    text-align: center;
    flex-shrink: 0;
    width: auto;
  }
  .main-content-area {
    padding: 16px;
    max-height: none;
  }
  .map-container {
    min-height: 300px;
  }
  .suggestions-list {
    width: calc(100% - 32px);
  }
}
@media (max-width: 767px) {
  .sidebar-links {
    justify-content: flex-start;
  }
  .md\:grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  .form-group-inline {
    flex-direction: column;
    align-items: flex-start;
  }
  .report-input {
    width: 100%;
    margin-bottom: 8px;
  }
  .actions-cell {
    white-space: nowrap;
  }
  .actions-cell .btn {
    display: block;
    width: 100%;
    margin-bottom: 5px;
  }
  .actions-cell .btn:last-child {
    margin-bottom: 0;
  }
}
</style>
