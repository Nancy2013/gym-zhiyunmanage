import { App, createApp } from "vue";

const app: App<Element> = createApp({});

const permission = app.directive("permission", (el, binding, vnode) => {
       const { value } = binding;
})

export default permission