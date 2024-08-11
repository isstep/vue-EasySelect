<script>
import { onMounted } from 'vue'
import axios from 'axios'


onMounted(async () => {
    try {
        const {data} = await axios.get(`https://f4f1d0c1ac4cb845.mokky.dev/favorites`)
        console.log(data);
    }catch(err){
        console.log(err);
    }
})
</script>

<template>
  <h1>Избранные товары</h1>
</template>
