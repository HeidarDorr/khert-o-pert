<template>
    <div class="w-full h-16 bg-red-100 flex justify-center items-center absolute bottom-0 z-40">
        <span class="bg-red-100"></span>
        <span class="bg-red-100"></span>
        <p class="text-xs">کلیه حقوق مادی و معنوی سایت متعلق به خرت و پرت می باشد و هرگونه کپی‌برداری از محتوای سایت با درج منبع بلامانع است.</p>
    </div>
</template>


<style scoped>
span {
    position: absolute;
    height: 28px;
    width: 28px;
    top: -28px;
    right: 0;
}

span:nth-child(2) {
    right: unset;
    left: 0;
}

span::before {
    content: '';
    position: absolute;
    height: 56px;
    width: 56px;
    bottom: 0;
    background-color: #fff;
    border-radius: 50%;
}

span:nth-child(2)::before {
    left: 0;
}
</style>