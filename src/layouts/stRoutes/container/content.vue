<template>
    <a-layout-content>
        <div :class="`st-layout-content ${isStBreamub ? 'st-layout-content-breamub' : ''}`">
            <router-view />
        </div>
    </a-layout-content>
</template>

<script lang="ts">
import { useState } from "@/hooks";
import { defineComponent } from "vue";
export default defineComponent({
    
    setup() {
        const storeState = useState("stModule", [
            "isStBreamub"
        ]);
        
        return {
            ...storeState
        };
    },
});
</script>

<style>
.st-layout-content {
    margin: 20px 10px;
    padding: 10px;
    background: #fff;
    min-height: calc(100vh - 120px); 
}

.st-layout-content-breamub {
    position: absolute;
    left: 16px;
    right: 16px;
    top: 153px;
    bottom: 20px;
    margin: 0;
    padding: 0;
    min-height: auto;
    border-top: 4px solid #175DEF;
}
</style>