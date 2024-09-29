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
          src:  './public/template.png',
          alt: 'Product 1'
        },
        {
          src: './public/template4.png',
          alt: 'Product 2'
        },
        {
          src: './public/template3.png',
          alt: 'Product 3'
        },
        {
          src: './public/template.png',
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
  width: 100%;
  height: 100%;
  border-radius: 10px;
}
@media (max-width: 1024px) {
  .carousel__image {
    border-radius: 5px;
  }
}
</style>
