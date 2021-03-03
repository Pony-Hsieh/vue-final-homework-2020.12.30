<template>
    <div>
        <headerComponent />
        <shippingDescription />
        <footerComponent />

    </div>
</template>

<script>

    import shippingDescription from "../shippingDescription";

    import headerComponent from "../headerComponent";
    import footerComponent from "../footerComponent";
    export default {
        components: {
            headerComponent,
            shippingDescription,
            footerComponent,
        },
    }
</script>