<script setup>
import { RouterView } from 'vue-router'
import { provide } from 'vue'

const clothingColors = [
  { value: "آبی", id: "blue" },
  { value: "صورتی", id: "pink" },
  { value: "سفید", id: "white" },
  { value: "زرد", id: "yellow" }
]

provide('clothingColors', clothingColors)
</script>


<template>
  <router-view v-slot="{ Component, route }">
    <transition mode="out-in" :name="route.meta.transition">
      <component :is="Component" :key="route.path" />
    </transition>
  </router-view>
</template>


<style>
:root {
  --color-primary: #78002c;
  --color-primary-black: #5d0022;
  --color-secondary: rgb(185 28 28);
  --fade-duration: .175s;
}

#app {
  max-width: 1280px;
  font-family: 'Sahel', sans-serif;
  overflow-x: hidden;
  color: var(--color-primary-black);
}

.big-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  position: relative;
  padding-bottom: 6.5rem;
}

h1 {
  text-align: center;
  font-size: 2.5rem;
  color: var(--color-primary);
}

.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform .13s, opacity var(--fade-duration);
}

.slide-right-enter-from {
  opacity: 0;
}

.slide-right-leave-to {
  opacity: 0;
  transform: translateX(3%);
}

.slide-left-enter-active,
.slide-left-leave-active {
  transition: transform .13s, opacity var(--fade-duration);
}

.slide-left-enter-from {
  opacity: 0;
}

.slide-left-leave-to {
  opacity: 0;
  transform: translateX(-3%);
}

.initial-overlay-enter-active,
.initial-overlay-leave-active {
  transition: var(--fade-duration);
}

.initial-overlay-enter-from,
.initial-overlay-leave-to {
  opacity: 0;
}
</style>