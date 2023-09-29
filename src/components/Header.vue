<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import convertNumbersToFarsi from '@/stores/useConvertNumbersToFarsi.js'
import useBasketStore from '@/stores/ShopBasket.js'
import { useRouter } from 'vue-router'

// const productsId = ref()
const productsCount = ref()
const finalCount = ref()

function getData() {
    //     axios('http://localhost:3000/products')
    //         .then(res => {
    //             productsId.value = res.data
    //             productsCount.value = productsId.value.length

    //             const farsiCount = convertNumbersToFarsi(productsCount.value)
    //             finalCount.value = farsiCount
    //         })

    const cookie = document.cookie.replace(/(?:(?:^|.*;\s*)products\s*\=\s*([^;]*).*$)|^.*$/, "$1")
    const products = cookie ? JSON.parse(cookie) : ['']

    productsCount.value = products.length - 1
    const farsiCount = convertNumbersToFarsi(productsCount.value)
    finalCount.value = farsiCount
}
getData()


const basketStore = useBasketStore()

watch(() => basketStore.loading, () => {
    productsCount.value = ''
    getData()
})

////////////////////////// Search box
const input = ref()

const allProducts = ref()

function getDataForSearch() {
    if (!allProducts.value) {
        axios('https://fakestoreapi.com/products')
            .then(res => {
                allProducts.value = res.data
                searchHandler()
            })
    } else {
        searchHandler()
    }
}

const inputValue = ref()
const filteredProducts = ref()

function searchHandler() {
    window.onkeyup = () => {
        filteredProducts.value = allProducts.value.filter(p => {
            if (inputValue.value.length === 1) {
                return p.title.toLowerCase().startsWith(inputValue.value.toLowerCase())
            } else if (inputValue.value.length > 1) {
                return p.title.toLowerCase().includes(inputValue.value.toLowerCase())
            }
        })
        if (inputValue.value.length > 1 && !filteredProducts.value.length) filteredProducts.value = [{ title: 'محصول مورد نظر یافت نشد!', notFoundItem: true }]
    }

    closeSearchBox()
}

const router = useRouter()

function goToProduct(id, notFoundItem) {
    if (notFoundItem) return
    router.push('/product/' + id)
}

const searchBox = ref()

function closeSearchBox() {
    window.onclick = e => {
        if (!searchBox.value.contains(e.target)) {
            inputValue.value = ''
            filteredProducts.value = ''
        }
    }
}
</script>


<template>
    <div class="w-full h-24 mb-10 bg-red-100 flex justify-center items-center relative z-40">
        <i class="bg-red-100"></i>
        <i class="bg-red-100"></i>
        <router-link to="/">
            <div class="flex justify-center items-center p-2">
                <h1 class="mr-1">خرت و پرت</h1>
            </div>
        </router-link>
        <div ref="searchBox" class="absolute left-[5.7rem]">
            <input @focus="getDataForSearch" v-model="inputValue" ref="input" type="text"
                class="rounded-2xl h-[1.9rem] w-60 pr-[2.4rem] outline-none" placeholder="جستجو">
            <svg @click="input.focus()" class="absolute right-2 translate-y-[-50%] top-[50%]" height="24"
                viewBox="0 -960 960 960" width="24">
                <path fill="#78002cb1"
                    d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
            </svg>
            <Transition name="slide-down">
                <TransitionGroup name="list" tag="div" v-if="filteredProducts && filteredProducts.length"
                    class="absolute w-full top-9 rounded-2xl bg-white border ltr p-3 px-[.65rem]">
                    <div v-for="( p, i ) in  filteredProducts" :key="i" @click="goToProduct(p.id, p.notFoundItem)">
                        <div class="border-b p-2 pt-3 card cursor-pointer"
                            :class="{ 'last': i + 1 === filteredProducts.length, 'first': i === 0, 'notFoundItem': p.notFoundItem }">
                            <p class="text-sm">{{ p.title.length > 25 ? p.title.slice(0, 23).concat('...') : p.title }}</p>
                        </div>
                    </div>
                </TransitionGroup>
            </Transition>
        </div>
        <router-link to="/basket">
            <div class="absolute left-10 translate-y-[-50%]">
                <svg height="29" viewBox="0 -960 960 960" width="29">
                    <path fill="var(--color-secondary)"
                        d="M280-80q-33 0-56.5-23.5T200-160q0-33 23.5-56.5T280-240q33 0 56.5 23.5T360-160q0 33-23.5 56.5T280-80Zm400 0q-33 0-56.5-23.5T600-160q0-33 23.5-56.5T680-240q33 0 56.5 23.5T760-160q0 33-23.5 56.5T680-80ZM246-720l96 200h280l110-200H246Zm-38-80h590q23 0 35 20.5t1 41.5L692-482q-11 20-29.5 31T622-440H324l-44 80h480v80H280q-45 0-68-39.5t-2-78.5l54-98-144-304H40v-80h130l38 80Zm134 280h280-280Z" />
                </svg>
                <Transition name="slide">
                    <div v-if="productsCount"
                        class="absolute bg-red-600 top-[-.7rem] -right-1 rounded-3xl w-[1.2rem] h-[1.2rem] flex justify-center">
                        <span class="text-white translate-y-[-1px]">{{ finalCount }}</span>
                    </div>
                </Transition>
            </div>
        </router-link>
    </div>
</template>


<style scoped>
i {
    position: absolute;
    height: 28px;
    width: 28px;
    bottom: -28px;
    right: 0;
}

i:nth-child(2) {
    right: unset;
    left: 0;
}

i::before {
    content: '';
    position: absolute;
    height: 56px;
    width: 56px;
    background-color: #fff;
    border-radius: 50%;
}

i:nth-child(2)::before {
    left: 0;
}

input::placeholder {
    font-size: .85rem;
    color: #78002c89;
    transform: translateY(-1px);
}

.card:hover {
    background-color: rgba(255, 0, 0, 0.045);
}

.notFoundItem:hover {
    background-color: unset;
    cursor: default;
}

.notFoundItem {
    color: var(--color-primary);
    direction: rtl;
}

.last {
    border: none;
    border-bottom-left-radius: .6rem;
    border-bottom-right-radius: .6rem;
}

.first {
    border-top-left-radius: .6rem;
    border-top-right-radius: .6rem;
}

.slide-down-enter-active,
.slide-down-leave-active {
    transition: .15s;
}

.slide-down-enter-from,
.slide-down-leave-to {
    transform: translateY(-5px);
    opacity: 0;
}

.list-enter-active,
.list-leave-active {
    transition: .2s;
}

.list-enter-from,
.list-leave-to {
    transform: translateY(-8px);
    opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
    transition: .3s;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
}
</style>