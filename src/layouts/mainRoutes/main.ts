import { App, createApp, Plugin } from "vue";
import Main from "@/Main.vue";
import router from "./router";
import store from "@/store";
import VideoPlayer from "vue-video-player";
import "video.js/dist/video-js.css";
import "./base.less";
import {
  Tooltip,
  Tag,
  Button,
  Table,
  Divider,
  Input,
  Popover,
  Radio,
  Checkbox,
  Row,
  Col,
  Select,
  Modal,
  Tree,
  PageHeader,
  Form,
} from "ant-design-vue";
import {
  TsxIcon,
  TsxTable,
  TsxUploadImg,
  TsxPage,
  TsxForm,
  TsxInput
} from "@/components/tsx";
import { VueForm, VueTable } from "@/components/vue";

const app: App<Element> = createApp(Main);

const components = [
  Form,
  Tooltip,
  Tag,
  Button,
  Table,
  Divider,
  Input,
  Input.Search,
  Popover,
  Radio,
  Radio.Group,
  Checkbox,
  Checkbox.Group,
  Row,
  Col,
  Select,
  Modal,
  Tree,
  PageHeader,
  TsxIcon,
  TsxTable,
  TsxUploadImg,
  TsxPage,
  TsxForm,
  VueForm,
  VueTable,
  TsxInput
];

components.forEach((component) => {
  app.component(component.name, component);
});

app.use(VideoPlayer);

// 配置路由
app.use(router as Plugin);

// 配置vuex
app.use(store);

// 绑定节点
app.mount("#app");
