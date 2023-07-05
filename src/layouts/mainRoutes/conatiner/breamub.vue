<template>
    <div class="manage-breamub">
        <div class="breamub-title">
            <span>{{ breamubTitle }}</span>
        </div>
    </div>
</template>
<script lang="ts">
import { useAction, useState } from "@/hooks";
import { defineComponent, watch } from "vue";
import { useRoute } from "vue-router";
export default defineComponent({
    setup() {
        const storeState = useState("mainModule", [
            "selectedKeys",
            "breamubTitle",
            "isBreamub",
        ]);
        const storeAction = useAction("mainModule", [
            "asyncUpdateBreamubTitle",
        ]);

        const { asyncUpdateBreamubTitle } = storeAction;
        const route: any = useRoute();
        watch([storeState.selectedKeys, route], (next, prev) => {
            asyncUpdateBreamubTitle({
                breamubTitle: next[1]["meta"].title as string,
            });
        });
        return {
            ...storeState,
        };
    },
});
</script>
<style lang="less" scoped>
.manage-breamub {
    background: #fff;
    border-top: 1px solid #f0f0f0;
}
.breamub-title::before {
    content: "";
    border-left: 5px solid #40a9ff;
    padding-right: 15px;
}
.breamub-title {
    display: inline-block;
    font-size: 18px;
    padding: 16px;
    letter-spacing: 1px;
    color: #878789;
    font-weight: 600;
}
</style>