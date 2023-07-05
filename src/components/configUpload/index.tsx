import { PropType, defineComponent, ref, toRefs, watch } from "vue";
import { getSuffixName } from "@/utils/common";
import {
  UploadChangeParam,
  UploadFile,
  UploadProps,
  message,
  Upload,
} from "ant-design-vue";
import { UploadOutlined } from "@ant-design/icons-vue";
import styles from "./index.module.less";

/**
 * 配置项设置
 */

export default defineComponent({
  props: {
    uploadConfigs: {
      type: Object as PropType<UploadProps>,
      required: true,
    },
    value: {
      type: Array,
      required: true,
    },
  },
  components: {
    aUpload: Upload,
  },
  setup(props, { slots, emit }) {
    // toRefs解构保持响应式
    let fileList = ref(props.value);
    let { uploadConfigs } = toRefs(props);
    let { accept } = uploadConfigs.value;

    // 文件类型列表
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

    /**
     * 文件上传前处理
     */
    const handleBeofreUpload = (file: UploadFile) => {
      return new Promise((resolve, reject) => {
        let fileSize = file.size as unknown as number;
        let fileAccept = accept as unknown as string;
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
     * 上传状态改变时回调
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
      emit("update:value", event.fileList);
    };

    /**
     * 监听输入框值改变
     */
    watch(
      () => props.value,
      (next) => {
        fileList.value = next;
      }
    );

    return () => (
      <div class={styles["upload-main"]}>
        <a-upload
          {...Object.assign({}, uploadConfigs.value, {
            fileList: fileList.value,
            beforeUpload: handleBeofreUpload,
            action: import.meta.env.VITE_BASE_URL + "/upload-file",
          })}
          onChange={handleChangeUpload}
        >
          <a-button>
            <UploadOutlined />
            上传图片
          </a-button>
        </a-upload>
        {slots}
      </div>
    );
  },
});
