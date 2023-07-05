<template>
    <a-layout class="st-public">
        <StPublicHeader />
        <Breaumb />
        <Content />
    </a-layout>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { StPublicHeader, Breaumb, Content } from "@/layouts/stRoutes/container"
export default defineComponent({
    components: {
        StPublicHeader,
        Breaumb,
        Content
    },
    setup() {
        
    }
})
</script>

<style>
.st-public {
    height: 100%;
    background-color: #F6F8FA;
}
</style>