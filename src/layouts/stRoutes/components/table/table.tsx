// <template>
//     <!-- <a-table :columns="columns" :row-key="record => record.login.uuid" :data-source="dataSource" :pagination="pagination" :loading="loading" @change="handleTableChange">
        
//     </a-table> -->
// </template>

// <script>
// import { defineComponent } from 'vue'

// export default defineComponent({

// })

// </script>

// <style scoped lang='less'>
// </style>

import { defineComponent, PropType } from "vue";
import { PaginationProps } from "ant-design-vue";
import { ColumnProps, TableProps } from "ant-design-vue/lib/table";

export default defineComponent({
    props: {
        columns: {
            type: Object as PropType<ColumnProps[]>,
            required: true
        },
        dataSource: {
            type: Array,
            required: true
        },
        pagination: {
            type: Object as PropType<PaginationProps>
        }
    }
})
