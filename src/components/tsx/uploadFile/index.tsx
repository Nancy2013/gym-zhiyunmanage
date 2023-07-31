import { defineComponent, ref, PropType, watch } from "vue";
import { Upload, message } from 'ant-design-vue'
import { UploadOutlined, PlusOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import styles from "./index.module.less";
import { UploadListType, FileType, UploadChangeParam } from 'ant-design-vue/lib/upload/interface'
import { UploadType } from "@/components/tsx/form";

/**
 * 配置项设置
 */


export default defineComponent({
	name: 'TsxUploadFile',
	props: {
		value: {
			type: Array as PropType<any[]>,
			require: true
		},
		type: {
			type: String as PropType<UploadType>,
			default: "button"
		},
		title: {
			type: String,
			default: '开始上传'
		},
		accept: {
			type: String
		},
		action: {
			type: String,
			default: import.meta.env.VITE_BASE_URL + "/upload-file"
		},
		disabled: {
			type: Boolean
		},
		maxCount: {
			type: Number,
			default: 1
		},
		listType: {
			type: String as PropType<UploadListType>,
			default: ''
		},
		multiple: {
			type: Boolean
		},
		limitSize: {
			type: Number
		},
		remerk: {
			type: String
		}
	},
	emits: ["update:value", 'success', 'change'],
	setup(props, { slots, emit }) {
		const innerValue = ref(props.value)
		/**
         * 上传文件之前的钩子
         * @param {FileType} file 当前上传的文件对象
         * @return
         */
		const handleBeforeUpload = (file: FileType) => {
			if (props.maxCount && innerValue.value && innerValue.value?.length >= props.maxCount) {
				message.error("上传数量超出限制");
				return false
			}
			if (props.limitSize && file.size > props.limitSize) {
				message.error("上传的资源超出限制");
				return false
			}
			return true
		}

		/**
         * 上传文件改变时的状态
         * @param {UploadChangeParam} event change事件擦桉树
         * @return
         */
		const handleChange = (event: UploadChangeParam) => {
			switch (event.file.status) {
				case "done":
					event.file.url = event.file.response.data
					event.file.thumbUrl = event.file.response.data
					emit("success", {
						size: event.file.size,
						imgPath: event.file.response.data,
					});
					break;
				case "error":
					for (let i = 0; i < event.fileList.length; i++) {
						if (event.fileList[i].uid === event.file.uid) {
							event.fileList.splice(i, 1);
							break;
						}
					}
					message.error("上传失败");
					break;
				case "uploading":
					break;
				case "removed":
					break;
				default:
					for (let i = 0; i < event.fileList.length; i++) {
						if (event.fileList[i].uid === event.file.uid) {
							event.fileList.splice(i, 1);
							break;
						}
					}
					break;
			}
			emit("change", event.fileList)
			emit("update:value", event.fileList);
		}


		watch(() => props.value, (newValue) => {
			innerValue.value = newValue
		}, {
			deep: true
		})

		return () => (
			<Upload v-model:file-list={innerValue.value} showUploadList={ { showDownloadIcon: false } } disabled={props.disabled} action={props.action} listType={props.listType ? props.listType : props.type === 'card' ? 'picture-card' : ''} accept={props.accept} beforeUpload={handleBeforeUpload} onChange={handleChange}>
				{slots.default ? slots.default() : props.type === 'card'
					? 
					(props.maxCount && innerValue.value && innerValue.value?.length >= props.maxCount) ? "" : <div class={styles['upload-image']}>
						<PlusOutlined></PlusOutlined>
						<div style="margin-top: 8px">{props.title}</div>
					</div>
					:
					<a-button>
						<UploadOutlined class={styles['upload-button-icon']}></UploadOutlined>
						<span>{props.title}</span>
					</a-button>
				}
			</Upload>
		)
	}
})