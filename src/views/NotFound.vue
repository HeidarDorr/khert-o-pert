<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>


<template>
    <div class="big-container">
        <Header />
        <div
            class="fixed right-[50%] top-[50%] translate-x-[50%] translate-y-[-50%] flex flex-col items-center justify-center">
            <h3 class="text-8xl">404</h3>
            <h3 class="text-1xl">صفحه‌ای که دنبال آن بودید پیدا نشد!</h3>
        </div>
        <Footer />
    </div>
</template>