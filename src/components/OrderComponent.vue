<script setup>
import { ref } from 'vue'

const header = ref('Список')
const items = ref([
{id:1 , label:"1 список"},
{id:2 , label:"2 список"},
{id:3 , label:"3 список"},
{id:4 , label:"4 список"},
])
</script>

<template>
 <div class="mt-20">
    <h2 class="text-3xl font-bold mb-8">Заказы</h2>
  </div>
  <div>
<h1>{{ header }}</h1>
<ul>
  <li v-for="item in items" :key="item.id">{{item.label}}</li>
</ul>

</div>

</template>
