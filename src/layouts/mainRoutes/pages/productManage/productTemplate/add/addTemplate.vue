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
        const id = route.query.id || ""
        const copy = route.query.copy || ""
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