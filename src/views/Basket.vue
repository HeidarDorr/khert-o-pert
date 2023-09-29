<script setup>
import { ref, onUpdated, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import axios from 'axios'
import useBasketStore from '@/stores/ShopBasket.js'
import { useRouter } from 'vue-router'
import convertNumbersToFarsi from '@/stores/useConvertNumbersToFarsi.js'

document.title = 'فروشگاه اینترنتی خرت و پرت'

const basketProducts = ref()

// axios('http://localhost:3000/products')
//     .then(res => {
//         basketProducts.value = res.data
//         if (basketProducts.value.length) {
//             getData(basketProducts.value[counter.value])
//         } else {
//             initialOverlay.value = false

//             setTotalCountEmpty()
//         }
//     })

onMounted(() => {
    const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)products\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    basketProducts.value = cookie ? JSON.parse(cookie) : ['']

    if (basketProducts.value.length > 1) {
        getData(basketProducts.value[counter.value])
    } else {
        initialOverlay.value = false

        setTotalCountEmpty()
    }
})

const products = ref([])
const counter = ref(1)

const productsCount = ref()

function getData(p) {
    axios('https://fakestoreapi.com/products/' + p.id)
        .then(res => {
            if (p.color) {
                res.data.colorFa = p.color.value
                res.data.colorEn = p.color.id
            }
            products.value.push(res.data)

            calcPrices(res.data.price)
            productsCount.value = convertNumbersToFarsi(products.value.length)

            counter.value++
            if (counter.value === basketProducts.value.length) return

            getData(basketProducts.value[counter.value])
        })
}

const initialOverlay = ref(true)
onUpdated(() => {
    initialOverlay.value = false
})

const router = useRouter()

function goToProduct(id) {
    router.push('/product/' + id)
}

const basketStore = useBasketStore()

function removeProduct(id, i, price) {
    products.value.splice(i, 1)

    calcPrices(-price)
    productsCount.value = convertNumbersToFarsi(products.value.length)

    // basketStore.removeProduct(id)
    basketStore.loading = true
    setTimeout(() => {
        basketStore.loading = false
    }, 100)

    basketProducts.value.splice(basketProducts.value.indexOf(id), 1)

    const now = new Date()
    now.setTime(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    document.cookie = `products=${JSON.stringify(basketProducts.value)};path=/;expires=${now}`

    counter.value--
}

const totalCount = ref(0)
const totalCount2 = ref(0)
const discountCount = ref(0)

function calcPrices(price) {
    totalCount.value += price
    totalCount2.value = (totalCount.value * 1.5).toFixed(2)
    discountCount.value = (totalCount2.value - totalCount.value).toFixed(2) + ` (${Math.floor(totalCount.value * (100 / totalCount2.value))}%)`

    totalCount.value = +totalCount.value.toFixed(2)

    if (!totalCount.value) setTotalCountEmpty()
}

function setTotalCountEmpty() {
    totalCount.value = '...'
    totalCount2.value = '...'
    discountCount.value = '...'

    productsCount.value = convertNumbersToFarsi(0)
}
</script>


<template>
    <div class="big-container">
        <Transition name="initial-overlay">
            <div v-if="initialOverlay" class="w-full h-screen bg-white fixed z-50"></div>
        </Transition>
        <Header />
        <div class="grid grid-cols-10 gap-10 px-[12%] w-full">
            <div class="col-span-7 border rounded-3xl p-5 py-2 relative mt-7">
                <h3 class="absolute top-[-2.5rem] text-lg text-red-800">سبد خرید شما</h3>
                <div>
                    <div v-if="!products.length" class="grid grid-cols-4 gap-5 p-5 h-44 items-center">
                        <img src="../../public/empty-cart.svg" alt="empty-cart">
                        <p class="col-span-3">سبد خرید شما خالی است!</p>
                    </div>
                    <TransitionGroup tag="div" name="list">
                        <div v-for="(p, i) in products" :key="i" :class="{ 'last': i + 1 === products.length }"
                            class="grid grid-cols-4 gap-5 border-b p-5 h-44 items-center relative">
                            <img @click="goToProduct(p.id)" :src="p.image" :alt="p.title" class="max-h-32 cursor-pointer">
                            <div class="col-span-3">
                                <p @click="goToProduct(p.id)" class="text-sm cursor-pointer">{{ p.title }}</p>
                                <div v-if="p.colorFa" class="flex gap-[.4rem] items-center mt-1">
                                    <i :style="'background-color:' + p.colorEn"
                                        class="w-3 h-3 rounded-full border border-gray-400 inline-block"></i>
                                    <span class="text-sm">{{ p.colorFa }}</span>
                                </div>
                                <span class="inline-block ml-1 mt-5 text-sm line-through text-gray-500">{{ (p.price *
                                    1.5).toFixed(2) }}$</span>
                                <span class="inline-block text-red-600">{{ p.price }}$</span>
                            </div>
                            <div @click="removeProduct(p.id, i, p.price)" class="absolute left-5 bottom-5 cursor-pointer">
                                <svg height="24" viewBox="0 -960 960 960" width="24">
                                    <path fill="red"
                                        d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                                </svg>
                            </div>
                        </div>
                        <div v-if="basketProducts && counter !== basketProducts.length"
                            class="flex p-5 pt-9 h-16 items-center justify-center border-t">
                            در حال بارگیری...
                        </div>
                    </TransitionGroup>
                </div>
            </div>
            <div class="col-span-3 border rounded-3xl p-5 relative mt-7 self-start flex flex-col gap-5">
                <h3 class="absolute top-[-2.5rem] text-lg text-red-800">مجموع خرید</h3>
                <div class="flex justify-between items-center gap-2">
                    <span class="text-[.85rem] text-gray-500">قیمت کالاها ({{ productsCount }})</span>
                    <span class="text-[.85rem] text-gray-500">{{ totalCount2 }}</span>
                </div>
                <div class="flex justify-between items-center gap-2">
                    <span class="text-[.85rem]">جمع سبد خرید</span>
                    <span class="text-[.85rem]">{{ totalCount }}</span>
                </div>
                <div class="flex justify-between items-center gap-2">
                    <span class="text-[.85rem] text-red-600">سود شما از خرید</span>
                    <span class="text-[.85rem] text-red-600 ltr">{{ discountCount }}</span>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>


<style scoped>
.list-enter-active,
.list-leave-active {
    transition: 0.3s ease;
}

.list-enter-from,
.list-leave-to {
    opacity: 0;
    transform: translateX(10px);
}

.last {
    border: none;
}
</style>