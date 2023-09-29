<script setup>
import { ref, onUpdated, inject } from 'vue'
import axios from 'axios'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import { register } from 'swiper/element/bundle'

document.title = 'فروشگاه اینترنتی خرت و پرت'

const axiosInstance = axios.create({
    baseURL: 'https://fakestoreapi.com'
})

const products = ref()
const sliderProducts = ref()

axiosInstance.get('/products')
    .then(res => {
        products.value = res.data

        sliderProducts.value = [products.value[11], products.value[4], products.value[0], products.value[19], products.value[16]]
        register()

        products.value.forEach(p => {
            if (p.category === "men's clothing" || p.category === "women's clothing") p.colorBoxNeed = true
        })
    })

const initialOverlay = ref(true)
onUpdated(() => initialOverlay.value = false)

const router = useRouter()
function goToProductPage(id) {
    router.push('/product/' + id)
}

const clothingColors = inject('clothingColors')
</script>


<template>
    <div class="big-container">
        <Transition name="initial-overlay">
            <div v-if="initialOverlay" class="w-full h-screen bg-white fixed z-50"></div>
        </Transition>
        <Header />
        <section class="container px-10 m-10 mt-7 relative">
            <h3 class="absolute top-[-2.5rem] text-lg text-red-700">پیشنهادات ویژه</h3>
            <swiper-container slides-per-view="2" speed="600" autoplay-delay="3000" autoplay-pause-on-mouse-enter="true"
                autoplay-disable-on-interaction="false" pagination-clickable="true" space-between="2"
                class="border border-red-600 rounded-3xl py-3 pb-[.3rem] relative">
                <swiper-slide v-for="(p, i) in sliderProducts" :key="i" class="p-3 px-6 pl-0 grid grid-cols-3 gap-5">
                    <img :src="p.image" :alt="p.title" class="h-48 object-contain">
                    <div class="slide relative col-span-2 flex flex-col justify-between pl-7"
                        :class="{ 'last': i + 1 === sliderProducts.length }">
                        <div>
                            <h3 class="text-sm">{{ p.title }}</h3>
                            <p class="mt-3 text-xs text-gray-800">{{ p.description.length < 120 ? p.description :
                                p.description.slice(0, 120).concat('...') }}</p>
                        </div>
                        <div class="relative">
                            <span class="text-sm line-through text-gray-500">{{ (p.price * 1.5).toFixed(2) }}$</span>
                            <span class="block text-red-600">{{ p.price }}$</span>
                            <router-link :to="'product/' + p.id" class="btn-slate absolute -bottom-2 left-0">
                                مشاهده محصول
                            </router-link>
                        </div>
                    </div>
                </swiper-slide>
            </swiper-container>
        </section>
        <section class="container px-10 grid grid-cols-4 relative mt-10">
            <h3 class="absolute top-[-2.5rem] right-10 text-lg">تمامی محصولات</h3>
            <div v-for="(p, i) in products" @click="goToProductPage(p.id)"
                class="card flex flex-col justify-between items-center gap-8 py-4 px-2 cursor-pointer relative" :class="{
                    'first': i === 0,
                    'fourth': i === 3,
                    'four-before-last': i === products.length - 4,
                    'last': i === products.length - 1,
                    'last-four': i >= products.length - 4,
                    'every-forth': i % 4 === 0
                }">
                <div class="max-h-40">
                    <img :src="p.image" :alt="p.title" class="h-full">
                </div>
                <div>
                    <p class="text-[.86rem] ltr">{{ p.title.length > 25 ? p.title.slice(0, 23).concat('...')
                        : p.title }}</p>
                    <span class="text-xs inline-block mt-2 line-through text-gray-500">{{ (p.price * 1.5).toFixed(2)
                    }}$</span>
                    <span class="text-sm inline-block mt-2 mr-1 text-red-600">{{ p.price }}$</span>
                </div>
                <div v-if="p.colorBoxNeed" class="absolute left-3 top-3 flex flex-col gap-[.1rem]">
                    <i v-for="c in clothingColors" :style="'background-color:' + c.id"
                        class="w-[.6rem] h-[.6rem] rounded-full inline-block border"></i>
                </div>
            </div>
        </section>
        <Footer />
    </div>
</template>


<style scoped>
.card {
    border-bottom: 1px solid rgb(254 226 226);
    border-right: 1px solid rgb(254 226 226);
}

.card:hover {
    box-shadow: 0 0 4px 1px rgb(254 226 226);
}

.first {
    border-top-right-radius: 1.5rem;
}

.fourth {
    border-top-left-radius: 1.5rem;
}

.four-before-last {
    border-bottom-right-radius: 1.5rem;
}

.last {
    border-bottom-left-radius: 1.5rem;
}

.last-four {
    border-bottom: none;
}

.every-forth {
    border-right: none;
}

swiper-container::part(container) {
    overflow-y: visible;
}

swiper-container::part(pagination) {
    position: absolute;
    bottom: -2.1rem;
}

swiper-container::part(bullet) {
    height: 0.5rem;
    width: 0.5rem;
    border-radius: 5px;
    margin: 0 2.5px;
    transition: .6s;
    border: 1px solid #222;
    background-color: unset;
}

swiper-container::part(bullet-active) {
    background-color: unset;
    height: 0.5rem;
    width: 1rem;
    border-radius: 1rem;
    transition: .6s;
    border: 1px solid rgb(220 38 38);
    cursor: default;
}

.slide::before {
    content: '';
    position: absolute;
    left: -1px;
    top: .3rem;
    width: 1px;
    height: 95%;
    background-color: #ddd;
}

.last::before {
    display: none;
}
</style>