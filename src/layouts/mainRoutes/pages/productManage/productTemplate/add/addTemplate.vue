<template>
	<iframe id="product-template" style="width: 100%; height: 100%;" :src="`/admin.html#/product-template?id=${id}&copy=${copy}`" frameborder="0"></iframe>
</template>

<script lang="ts">
import { defineComponent, onMounted } from "vue";
import TemplateList from "./addTemplate";
import { useRoute } from 'vue-router'
import { setBreamubTitle } from '@/utils/setBreamubTitle'
export default defineComponent({
    setup() {
        const route = useRoute()
        const { type } = route.params || ""
        const { id = "" } = route.query
        const copy = type === 'copy' ? "1" : ""
        if (id) {
            if (copy) {
                setBreamubTitle("复制对象模板") 
            } else {
                setBreamubTitle("编辑对象模板") 
            }
        } 
        return {
            id,
            copy,
            ...TemplateList(),
        };
    },
});
</script>

<style lang="less" scoped>
.addObjectTemplate {
	//height: 100%;
}
</style>