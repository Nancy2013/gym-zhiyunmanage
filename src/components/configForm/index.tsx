import { PropType, defineComponent, reactive, ref, toRefs, watch } from "vue";
import styles from "./index.module.less";
import {
  DatePicker,
  Input,
  Button,
  Upload,
  UploadFile,
  message,
  UploadChangeParam,
} from "ant-design-vue";
import { DeleteOutlined } from "@ant-design/icons-vue";
import { getSuffixName } from "@/utils/common";

/**
 * 配置项设置
 */
export default defineComponent({
  props: {
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
  setup(props, { emit }) {
    // toRefs解构保持响应式
    let { formType, placeholder } = toRefs(props);

    let state = reactive({
      imageList: [],
    });

    // 输入值回调
    const inputChange = (e: any) => emit("update:value", e.target.value);

    // 时间回调
    const timeChange = (date: any, value: any) => emit("update:value", value);

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
    const fileSuffixNameList = [
        "doc",
        "docx",
        "pdf"
    ]

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
    }

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

    return () => (
      <>
        {formType.value == "input" ? (
          <Input
            class={styles["form-item"]}
            type="text"
            placeholder={placeholder.value}
            onChange={inputChange}
          />
        ) : undefined}
        {formType.value == "date" ? (
          <DatePicker
            class={styles["form-item"]}
            placeholder={placeholder.value}
            onChange={timeChange}
          />
        ) : undefined}
        {formType.value == "range" ? (
          <DatePicker.RangePicker
            class={styles["form-item"]}
            placeholder={placeholder.value}
            onChange={timeChange}
          />
        ) : undefined}
        {formType.value == "imgUpload" ? (
          <div>
            <Button class={styles["form-upload"]} type="primary" ghost>
              <Upload
                {...{
                  action: import.meta.env.VITE_BASE_URL + "/upload-file",
                  beforeUpload: handleBeforeUpload,
                  showUploadList: false,
                }}
                onChange={handleChangeUpload}
              >
                图片上传
              </Upload>
            </Button>
            {state.imageList.map((v: any, index: number) => {
              return (
                <div class={styles["form-file"]}>
                  <div class={styles["form-file-text"]}>{v.name}</div>
                  <div
                    class={styles["form-file-delete"]}
                    onClick={() => handleDeleteUpload(index)}
                  >
                    <DeleteOutlined />
                  </div>
                </div>
              );
            })}
          </div>
        ) : undefined}
        {formType.value == "fileUpload" ? (
          <div>
            <Button class={styles["form-upload"]}>
              <Upload
                {...{
                  action: import.meta.env.VITE_BASE_URL + "/upload-file",
                  beforeUpload: handleBeforeFileUpload,
                  showUploadList: false,
                }}
                onChange={handleChangeUpload}
              >
                文件上传
              </Upload>
            </Button>
            {state.imageList.map((v: any, index: number) => {
              return (
                <div class={styles["form-file"]}>
                  <div class={styles["form-file-text"]}>{v.name}</div>
                  <div
                    class={styles["form-file-delete"]}
                    onClick={() => handleDeleteUpload(index)}
                  >
                    <DeleteOutlined />
                  </div>
                </div>
              );
            })}
          </div>
        ) : undefined}
        {formType.value == "richText" ? (
          <a-input
            class={styles["form-item"]}
            type="text"
            placeholder={placeholder.value}
            onChange={inputChange}
          />
        ) : undefined}
      </>
    );
  },
});
