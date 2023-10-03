<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, onMounted, inject } from 'vue'
import axios from 'axios'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import useBasketStore from '@/stores/ShopBasket.js'

const route = useRoute()
const router = useRouter()
const id = ref(+route.params.id)

const product = ref()

const descriptionP = ref()
const fullDescription = ref()

const needExpand = ref(false)
const count = ref(140)

axios('https://fakestoreapi.com/products/' + id.value)
    .then(res => {
        product.value = res.data
        document.title = 'مشخصات، قیمت و خرید ' + product.value.title

        if (!product.value) router.push({ name: 'NotFound' })

        if (product.value.category === "men's clothing" || product.value.category === "women's clothing") colorBoxHandler()
        getDataFromBasketStore()

        if (product.value.description.length > count.value) {
            needExpand.value = true
            fullDescription.value = product.value.description
            descriptionCutting()
        }
    })

// onMounted(() => {
//     if (descriptionP.value.innerHTML.length > count.value) {
//         needExpand.value = true
//         fullDescription.value = product.value.description
//         descriptionCutting()
//     }
// })

function descriptionCutting() {
    if (product.value.description[count.value] === ' ') {
        setTimeout(() => {
            descriptionP.value.innerHTML = product.value.description.slice(0, count.value).concat('...')
        }, 1)
        return
    } else if (product.value.description[count.value]) {
        count.value++
        descriptionCutting()
    } else {
        needExpand.value = false
    }
}

const expanded = ref(true)

function expandDescription() {
    descriptionP.value.innerHTML = fullDescription.value
    expanded.value = false
}

function condenceDescription() {
    descriptionCutting()
    expanded.value = true
}

const basketStore = useBasketStore()

const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)products\s*\=\s*([^;]*).*$)|^.*$/, "$1")
const products = cookie ? JSON.parse(cookie) : ['']

function addProduct(id) {
    // basketStore.addProduct({
    //     id: id,
    //     color: radios.find(r => r.value === color.value)
    // })
    basketStore.loading = true
    setTimeout(() => {
        basketStore.loading = false
    }, 100)

    products.push({
        id: id,
        color: radios.find(r => r.value === color.value)
    })

    const now = new Date()
    now.setTime(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    document.cookie = `products=${JSON.stringify(products)};path=/;expires=${now}`

    isProductExist.value = true
}

function removeProduct(id) {
    // basketStore.removeProduct(id)
    basketStore.loading = true
    setTimeout(() => {
        basketStore.loading = false
    }, 100)

    products.splice(products.indexOf(id), 1)

    const now = new Date()
    now.setTime(now.getTime() + 30 * 24 * 60 * 60 * 1000)
    document.cookie = `products=${JSON.stringify(products)};path=/;expires=${now}`

    isProductExist.value = false
}

// const allProducts = ref()
const isProductExist = ref(false)

function getDataFromBasketStore() {
    // axios('http://localhost:3000/products')
    //     .then(res => {
    //         allProducts.value = res.data

    checkIfProductAdeed()
    // })
}

function checkIfProductAdeed() {
    // allProducts.value.forEach(p => {
    //     if (p.id === id.value) {
    //         isProductExist.value = true
    //         if (p.color) color.value = p.color.value
    //     }
    // })

    products.forEach(p => {
        if (p.id === id.value) {
            isProductExist.value = true
            if (p.color) color.value = p.color.value
        }
    })
}

//////////////////////////////////////// color choosing box
const colorBoxNeed = ref(false)
const color = ref()

function colorBoxHandler() {
    colorBoxNeed.value = true
    color.value = radios[0].value
}

const radios = inject('clothingColors')
</script>


<template>
    <div class="big-container">
        <Header />
        <div class="container px-10 ltr">
            <div class="grid grid-cols-3 gap-10">
                <img :src="product.image" :alt="product.title">
                <div class="col-span-2 flex flex-col justify-between gap-7">
                    <div>
                        <p class="text-sm text-gray-500">{{ product.category }}</p>
                        <h2 class="text-3xl mt-3 mb-5">{{ product.title }}</h2>
                        <p ref="descriptionP">{{ product.description }}</p>
                        <div v-if="needExpand">
                            <Transition name="up-fade" mode="out-in" appear>
                                <span v-if="expanded" @click="expandDescription" id="more"
                                    class="text-[.85rem] text-slate-500 cursor-pointer relative inline-block ml-4">
                                    بیشتر</span>
                                <span v-else @click="condenceDescription" id="more-2"
                                    class="text-[.85rem] text-slate-500 cursor-pointer relative inline-block ml-4">
                                    کمتر</span>
                            </Transition>
                        </div>
                    </div>
                    <div class="bg-red-100 w-52 rounded-2xl p-4 py-3 pb-2">
                        <div v-if="colorBoxNeed" class="flex justify-between items-center mt-[.3rem] mb-[.3rem]">
                            <input v-for="r in radios" v-model="color" type="radio" :value="r.value" :id="r.id"
                                :disabled="isProductExist" class="hidden">
                            <div class="colors flex gap-1">
                                <label v-for="r in radios" :for="r.id" :style="'background-color:' + r.id"
                                    class="w-3 h-3 rounded-full"></label>
                            </div>
                            <span class="rtl text-sm">رنگ: {{ color }}</span>
                        </div>

                        <span class="inline-block mt-2 text-xl mr-[.35rem] text-red-600">{{ product.price }}$</span>
                        <span class="inline-block mt-2 line-through text-gray-500">{{ (product.price * 1.5).toFixed(2)
                        }}$</span>

                        <!-- <button v-if="!isProductExist && !basketStore.loading" @click="addProduct(product.id)"
                            class="btn-rose bg-red-700 active:bg-red-800 block w-full">
                            افزودن به سبد خرید</button>
                            <button v-else-if="!isProductExist && basketStore.loading" disabled="true"
                            class="btn-rose bg-red-700 active:bg-red-800 block w-full">...</button> -->
                        <button v-if="!isProductExist" @click="addProduct(product.id)"
                            class="btn-rose bg-red-700 active:bg-red-800 block w-full">
                            افزودن به سبد خرید</button>
                        <button v-else @click="removeProduct(product.id)"
                            class="btn-rose bg-white active:bg-red-100 flex justify-center w-full">
                            <svg height="24" viewBox="0 -960 960 960" width="24">
                                <path fill="red"
                                    d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                            </svg></button>
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
</template>


<style>
#more::before {
    content: '';
    position: absolute;
    width: 9px;
    height: 9px;
    left: 0;
    border-top: 1px solid rgb(100 116 139);
    border-right: 1px solid rgb(100 116 139);
    transform: rotate(135deg) translate(12px, 7px);
}

#more-2::before {
    content: '';
    position: absolute;
    width: 9px;
    height: 9px;
    left: 0;
    border-top: 1px solid rgb(100 116 139);
    border-right: 1px solid rgb(100 116 139);
    transform: rotate(315deg) translate(-16px, -4px);
}

.up-fade-enter-active,
.up-fade-leave-active {
    transition: 0.15s;
}

.up-fade-enter-from {
    opacity: .8;
}

.up-fade-leave-to {
    opacity: .8;
}

input:nth-child(1):checked~.colors label:nth-child(1),
input:nth-child(2):checked~.colors label:nth-child(2),
input:nth-child(3):checked~.colors label:nth-child(3),
input:nth-child(4):checked~.colors label:nth-child(4),
input:nth-child(5):checked~.colors label:nth-child(5) {
    transition: .2s;
    outline: 1px solid red;
    outline-offset: 1px;
}

input:disabled~.colors label {
    opacity: .4;
}
</style>