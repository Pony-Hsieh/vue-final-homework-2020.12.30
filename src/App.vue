<template>
    <div id="app">
        <!-- router-view 這兩種寫法都可以喔~ -->
        <!-- <router-view></router-view> -->
        <router-view />
    </div>
</template>


<style lang="scss">
    @import "./assets/all";
    /* 在這支檔案有引 bootstrap 喔 */
</style>

<style>
    ::selection {
        background: #2f7dfc;
        color: #fff;
    }

    ::-moz-selection {
        background: #2f7dfc;
        color: #fff;
    }
</style>

<script>
    export default {
        name: "App",
    };
</script>