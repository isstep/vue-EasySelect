<script>
import { defineComponent } from 'vue'
import { Carousel, Pagination, Slide } from 'vue3-carousel'

import 'vue3-carousel/dist/carousel.css'

export default defineComponent({
  name: 'App',
  components: {
    Carousel,
    Slide,
    Pagination
  },
  data() {
    return {
      images: [
        {
          src: 'https://api-static.edostavka.by/media/669e04b7053ef_2832h600-kras.webp?id=20852',
          alt: 'Product 1'
        },
        {
          src: 'https://api-static.edostavka.by/media/668d4c19dd1b5_2832h600-dostavka-arbuzy.webp?id=20752',
          alt: 'Product 2'
        },
        {
          src: 'https://api-static.edostavka.by/media/669e04b7053ef_2832h600-kras.webp?id=20852',
          alt: 'Product 3'
        },
        {
          src: 'https://api-static.edostavka.by/media/66ac7bac1d701_2832h600-socnoe-sezonnoe.webp?id=21001',
          alt: 'Product 4'
        }
      ]
    }
  }
})
</script>

<template>
  <Carousel :autoplay="4000" :wrap-around="true">
    <Slide v-for="(image, index) in images" :key="index">
      <img :src="image.src" :alt="image.alt" class="carousel__image" />
    </Slide>

    <template #addons>
      <Pagination />
    </template>
  </Carousel>
</template>

<style scoped>
.carousel__image {
  width: 95%;
  height: 300px;
  object-fit: cover;
  border-radius: 10px;
}
</style>
