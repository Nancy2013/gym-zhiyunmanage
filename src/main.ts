import { App, createApp, Plugin } from 'vue';
import Main from './Main.vue';
import router from "@/router";
import store from "@/store";
import VideoPlayer from 'vue-video-player'
import 'video.js/dist/video-js.css'
import { Tooltip, Tag, Button, Table, Divider, Input, Popover, Radio, Checkbox, Row, Col, Select, Modal, Spin } from 'ant-design-vue'
import configIcon from '@/components/configIcon';
import configTable from '@/components/configTable';
import configUpload from '@/components/configUpload';
import configPage from '@/components/configPage';
import FcForm from '@/components/form/form'

const app: App<Element> = createApp(Main);

const components = [
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
    Spin,
];

components.forEach(component => {
    app.component(component.name, component);
})

// 注入config-icon组件
app.component("config-icon", configIcon);

// 注入config-table组件
app.component("config-table", configTable);

// 注入config-upload组件
app.component("config-upload", configUpload);

// 注入config-page组件
app.component("config-page", configPage);

app.component("FcForm", FcForm);

app.use(VideoPlayer)

// 配置路由
app.use(router as Plugin);

// 配置vuex
app.use(store);

// 绑定节点
app.mount('#app');

