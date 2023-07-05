import $ from "jquery";
import QRCode from "qrcodejs2-fix";
import request from "@/utils/axios";
import { useRouter, useRoute } from "vue-router";
import CodeBgimg from "@/assets/image/codeBgimg.png";
import QrCodeBgimg from "@/assets/image/qrCodeBgimg.png";
import ImgLogo from "@/assets/image/logo_img_Industrycode.png";
import { defineComponent, reactive, toRefs, onMounted, ref } from "vue";
import { Empty } from 'ant-design-vue'

export default defineComponent({
  components: {
    Empty
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      idisCode: "",
      activeKey: "1",
      formState: {
        idisCode: "",
        boName: "",
        categoryName: "",
        templateName: "",
        businessObjectAttrBOList: ref<any>(""),
      },
    });

    onMounted(() => {
      state.idisCode = route.query.idisCode as unknown as string;
      codeInfo(state.idisCode);
    });

    
    /**
     * 获取对象详情
     * @param { String } idisCode
     * @return
     */
    const codeInfo = async (idisCode: string) => {
      let res: any = await request({
        url: import.meta.env.VITE_NODE_URL + "/code/info",
        type: "json",
        method: "get",
        params: { idisCode },
      });
      if (res.code == 200) {
        let {
          idisCode,
          boName,
          categoryName,
          templateName,
          businessObjectAttrBOList,
          codeUrl,
        } = res.data;
        state.formState = {
          idisCode,
          boName,
          categoryName,
          templateName,
          businessObjectAttrBOList,
        };
        drawCanvas(idisCode, boName, codeUrl);
      }
    };


    /**
     * 绘制canvas
     * @param { String } idisCode
     * @param { String }  boName
     * @param { String }  codeUrl
     * @return
     */
    const drawCanvas = (idisCode: string, boName: string, codeUrl: string) => {
      let logoTitle = "中国工业互联网标识服务中心";
      let canvas: any = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");
      let qrcode: any = document.getElementById("qrcode");
      new QRCode(qrcode, {
        text: codeUrl,
        width: 110,
        height: 110,
        colorDark: "#000000",
        colorLight: "#ffffff",
      });

      let imgLogo = new Image();
      imgLogo.src = ImgLogo; // 复创logo

      let codeBgimg = new Image();
      codeBgimg.src = CodeBgimg; // canvas背景

      let qrCodeBgimg = new Image();
      qrCodeBgimg.src = QrCodeBgimg; // 二维码背景

      if (canvas.getContext) {
        codeBgimg.addEventListener("load", function () {
          ctx.drawImage(codeBgimg, 0, 0, 370, 612);
          imgLogo.addEventListener("load", function () {
            ctx.drawImage(imgLogo, 139, 87, 90, 33);
          });
          if (imgLogo.complete) {
            ctx.drawImage(imgLogo, 139, 87, 90, 33);
          } // 绘制复创logo

          ctx.font = "bold 16px 微软雅黑";
          ctx.fillStyle = "#4970E0";
          ctx.textAlign = "center";
          ctx.fillText(logoTitle, canvas.width / 2, 155); // 固定标题

          ctx.font = "bold 16px 微软雅黑";
          ctx.fillStyle = "#151515";
          ctx.textAlign = "center";
          ctx.fillText(boName, canvas.width / 2, 197); // 产品名称

          ctx.font = "13px 微软雅黑";
          ctx.fillStyle = "#565656";
          ctx.textAlign = "left";
          ctx.fillText("工业标识：" + `${idisCode}`, 60, 233, 248); // 标识信息-标题

          qrCodeBgimg.addEventListener("load", function () {
            ctx.drawImage(qrCodeBgimg, 87, 311, 200, 200);
            let timeForImg = setInterval(function () {
              let img: any = new Image();
              img.src = $("#qrcode").find("img")[0].src; // 画二维码

              img.onload = function () {
                ctx.drawImage(img, 150, 383, 75, 75);
                clearInterval(timeForImg);
              };
              img.onload();
            }, 100); // 使用计时器防止二维码绘制失败
          }); // 绘制二维码的背景图

          if (qrCodeBgimg.complete) {
            ctx.drawImage(qrCodeBgimg, 87, 311, 200, 200);
            let timeForImg = setInterval(function () {
              let img: any = new Image();
              img.src = $("#qrcode").find("img")[0].src; // 画二维码

              img.onload = function () {
                ctx.drawImage(img, 150, 383, 75, 75);
                clearInterval(timeForImg);
              };
              img.onload();
            }, 100); // 使用计时器防止二维码绘制失败
          }
        }); // 绘制整个canvas的背景图, 在背景图绘制完成之后再绘制内容, 防止背景图盖住内容

        if (codeBgimg.complete) {
          ctx.drawImage(codeBgimg, 0, 0, 370, 592);
        }
      }
    };


    /**
     * 下载标识
     * @param
     * @return
     */
    const downloadCode = () => {
      let canvas: any = document.getElementById("canvas");
      let dataURL = canvas
        .toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
      let saveLink = document.createElement("a");
      saveLink.href = dataURL;
      saveLink.download = state.formState.idisCode + ".png";
      saveLink.click();
    };


    /**
     * 返回上一页
     * @param
     * @return
     */
    const back = () => router.go(-1);

    return {
      ...toRefs(state),
      back,
      downloadCode,
      labelCol: { span: 6 },
      wrapperCol: { span: 14 },
    };

  },
});
