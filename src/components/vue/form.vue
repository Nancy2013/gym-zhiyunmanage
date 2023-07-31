<template>
    <div>
        <!-- 输入框 -->
        <Input v-if="formType == 'input'" class="form-item" type="text" v-model:value="value" :placeholder="placeholder"
            @change="(e: any) => listenChange('input', e)" />
        <!-- 日期选择 -->
        <DatePicker v-if="formType == 'date'" class="form-item" v-model:value="value" valueFormat="YYYY-MM-DD"
            :placeholder="placeholder" @change="(_moment: any, e: any) => listenChange('timer', e)" />
        <!-- 日期范围选择 -->
        <RangePicker v-if="formType == 'range'" class="form-item" v-model:value="value" :placeholder="placeholder"
            valueFormat="YYYY-MM-DD" @change="(_moment: any, e: any) => listenChange('timer', e)" />
        <!-- 图片上传 -->
        <div v-if="formType == 'imgUpload'">
            <Button class="form-upload" type="primary" ghost>
                <Upload :action="action" :beforeUpload="handleBeforeUpload" :showUploadList="false"
                    @change="handleChangeUpload">
                    图片上传
                </Upload>
            </Button>
            <div class="form-file" v-for="(item, index) in imageList" :key="index">
                <div class="form-file-text">{{ item.name }}</div>
                <div class="form-file-delete" @click="() => handleDeleteUpload(index)">
                    <DeleteOutlined />
                </div>
            </div>
        </div>
        <!-- 文件上传 -->
        <div v-if="formType == 'fileUpload'">
            <Button class="form-upload">
                <Upload :action="action" :beforeUpload="handleBeforeFileUpload" :showUploadList="false"
                    @change="handleChangeUpload">
                    文件上传
                </Upload>
            </Button>
            <div class="form-file" v-for="(item, index) in imageList" :key="index">
                <div class="form-file-text">{{ item.name }}</div>
                <div class="form-file-delete" @click="() => handleDeleteUpload(index)">
                    <DeleteOutlined />
                </div>
            </div>
        </div>
        <!-- 富文本编辑器 -->
        <div class="form-item" v-if="formType == 'richText'">
            <Button type="primary" class="form-upload" @click="showModal">富文本编辑</Button>
        </div>
        <Modal v-model:visible="visible" width="800px" title="富文本编辑器" @ok="confirmOk">
            <div>
                <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig"
                    mode="deault" />
                <Editor style="height: 300px; overflow-y: hidden;" :defaultConfig="editorConfig" mode="default"
                    v-model="value" @onCreated="handleCreated" @onChange="(e: any) => listenChange('rich', e)" />
            </div>
        </Modal>
    </div>
</template>
<script lang="ts">
import { defineComponent, onBeforeUnmount, reactive, ref, shallowRef, toRefs } from 'vue'
import {
    DatePicker,
    Input,
    Button,
    Upload,
    UploadFile,
    message,
    UploadChangeParam,
    Modal
} from "ant-design-vue";

// 富文本编辑器
import "@wangeditor/editor/dist/css/style.css";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { getSuffixName } from "@/utils/common";

export default defineComponent({
    name: 'VueForm',
    props: {
        value: {
            type: String,
            requied: true,
        },
        formType: {
            type: String,
            required: true,
        },
        placeholder: {
            type: String,
            required: true,
        },
        formTypes: {
            type: Array,
            required: true,
        },
    },
    components: {
        Editor,
        Toolbar,
        DatePicker,
        RangePicker: DatePicker.RangePicker,
        Input,
        Button,
        Upload,
        DeleteOutlined,
        Modal
    },
    setup(props, { emit }) {
        // 编辑器实例，必须用 shallowRef
        const editorRef = shallowRef();
        const toolbarConfig = {};
        const editorConfig = { placeholder: "请输入内容..." };
        // toRefs解构赋值
        let { formType, placeholder, value } = toRefs(props);
        let state = reactive({
            imageList: ref<any>(value.value),
            action: import.meta.env.VITE_BASE_URL + `/upload-file`,
            visible: false,
            richText: ref<any>(),
            value: ref<any>(value.value)
        });

        // 图片文件类型列表
        const imageSuffixNameList = [
            "xbm",
            "tif",
            "pjp",
            "apng",
            "svgz",
            "jpg",
            "jpeg",
            "ico",
            "tiff",
            "gif",
            "svg",
            "jfif",
            "webp",
            "png",
            "bmp",
            "pjpng",
            "avif",
        ];
        // 文本类型列表
        const fileSuffixNameList = ["doc", "docx", "pdf"];

        /**
         * 组件销毁
         */
        onBeforeUnmount(() => {
            const editor = editorRef.value;
            if (editor == null) return;
            editor.destroy();
        });
        
         /**
          * 模态框操作
          * 弹出
          * 确认
          */
        
        const showModal = () => state.visible = true // 弹出
        const confirmOk = () => {
            emit("update:value", state.richText);
            state.visible = false;
        } // 确认

        /**
         * 富文本编辑器实例
         */
        const handleCreated = (editor: any) => editorRef.value = editor; // 记录 editor 实例，重要！;

        /**
         * 监听值回调
         */
        const listenChange = (type: string, listen: any) => {
            switch (type) {
                case 'input': emit("update:value", listen.target.value); break;
                case 'timer': emit("update:value", listen); break;
                case 'rich': state.richText = listen.getHtml(); break;
            }
        }

        /**
         * 文件上传前处理 (图片)
         */
        const handleBeforeUpload = (file: UploadFile) => {
            return new Promise((resolve, reject) => {
                let fileSize = file.size as unknown as number;
                let fileAccept = "image/*";
                // 校验文件格式
                if (fileAccept.indexOf("image") > -1) {
                    const suffixName = getSuffixName(file.name);
                    if (imageSuffixNameList.indexOf(suffixName) === -1) {
                        message.error("请上传图片类型文件");
                        reject();
                        return;
                    }
                }
                if (fileSize > 1024 * 1024 * 20) {
                    message.error("图片最大不能超过20M");
                    reject();
                } else {
                    resolve(true);
                }
            });
        };

        /**
         * 文件上传前处理 (文本)
         */
        const handleBeforeFileUpload = (file: UploadFile) => {
            return new Promise((resolve, reject) => {
                let fileSize = file.size as unknown as number;
                const suffixName = getSuffixName(file.name);
                // 校验文件格式
                if (fileSuffixNameList.indexOf(suffixName) === -1) {
                    message.error("只支持上传PDF或Word");
                    reject();
                    return;
                }
                if (fileSize > 1024 * 1024 * 20) {
                    message.error("文件最大不能超过20M");
                    reject();
                } else {
                    resolve(true);
                }
            });
        };

        /**
         * 上传状态改变回调
         */
        const handleChangeUpload = (event: UploadChangeParam) => {
            switch (event.file.status) {
                case "done":
                    emit("success", {
                        size: event.file.size,
                        imgPath: event.file.response.data,
                    });
                    break;
                case "error":
                    try {
                        event.fileList.forEach((item: UploadFile, index: number) => {
                            if (Object.is(item.uid, event.file.uid)) {
                                event.fileList.splice(index, 1);
                                throw new Error("执行结束");
                            }
                        });
                        message.error("上传失败");
                    } catch (e) {
                        throw e;
                    }
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
            state.imageList = event.fileList as any;
            emit("update:value", event.fileList);
        };

        /**
         * 删除文件时回调
         */
        const handleDeleteUpload = (index: number) => {
            state.imageList.splice(index, 1);
            emit("update:value", state.imageList);
        };

        return {
            editorRef,
            toolbarConfig,
            editorConfig,
            formType,
            placeholder,
            ...toRefs(state),
            handleCreated,
            listenChange,
            handleBeforeUpload,
            handleBeforeFileUpload,
            handleChangeUpload,
            handleDeleteUpload,
            showModal,
            confirmOk
        }
    },
})
</script>
<style lang="less" scoped>
.form-item {
    width: 100%;
}

.form-upload {
    width: 100%;
}

.form-file {
    position: relative;
    margin: 10px;
}

.form-file-text {
    width: 140px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.form-file-delete {
    position: absolute;
    right: 0px;
    top: 2px;
    cursor: pointer;
}
</style>