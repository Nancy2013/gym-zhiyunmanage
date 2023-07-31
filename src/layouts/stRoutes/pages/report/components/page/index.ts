import { defineComponent, reactive, toRefs, onMounted } from "vue";
export default defineComponent({
  props: {
    loading:{
      type:Boolean,
      default:false,
    },
    columns:{
      type:Array,
      default:[],
    },
    dataSource:{
      type:Array,
      default:[],
    },
    pagination:{
      type:[Object,Boolean],
      default:{},
    },
    paginationChange:{
      type:Function,
      default:()=>{},
    },
    scroll:{
      type:Number,
      default:1500,
    },
  },
  components: {},
  setup(props:any, { emit }) {
    const state = reactive({});

    /**
     *
     *导出数据
     */
    const exportData=()=>{
      emit('exportData');
    }
    onMounted(() => {});
    return {
      ...toRefs(state),
      ...toRefs(props),
      exportData,
    };
  },
});
