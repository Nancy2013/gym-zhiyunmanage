/**
 * 主路由分支
 */
import { RouteRecordRaw, _RouteRecordBase } from "vue-router";

export const mainAuthority = [
  {
    level: 0,
    path: "/",
    name: "manage",
    component: () => import("@/layouts/mainRoutes/manage.vue"),
    children: [
      {
        level: 1,
        icon: "dashboard",
        path: "/home",
        name: "home",
        title: "工作台",
        meta: { title: "工作台" },
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/pages/home/index.vue"),
      },
      {
        level: 1,
        icon: "audit",
        path: "/authorizeAdmin",
        name: "authorizeAdmin",
        title: "权限管理",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/authorizeAdmin/user",
            name: "authorizeAdminUser",
            title: "用户管理",
            meta: { title: "用户管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-admin/user/index.vue"
              ),
          },
          {
            level: 2,
            path: "/authorizeAdmin/role",
            name: "authorizeAdminRole",
            title: "角色管理",
            meta: { title: "角色管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-admin/role/index.vue"
              ),
          },
          {
            level: 2,
            path: "/authorizeAdmin/type",
            name: "authorizeAdminType",
            title: "租户类型",
            meta: { title: "租户类型" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-admin/type/index.vue"
              ),
          },
          {
            level: 2,
            path: "/authorizeAdmin/menu",
            name: "authorizeAdminMenu",
            title: "菜单管理",
            meta: { title: "菜单管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-admin/menu/index.vue"
              ),
          },
          {
            level: 2,
            path: "/authorizeAdmin/tenant",
            name: "authorizeAdminTeant",
            title: "租户管理",
            meta: { title: "租户管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-admin/tenant/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "audit",
        path: "/authorizeTenant",
        name: "authorizeTenant",
        title: "租户权限",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/authorizeTenant/user",
            name: "authorizeTenantUser",
            title: "用户管理",
            meta: { title: "用户管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-tenant/user/index.vue"
              ),
          },
          {
            level: 2,
            path: "/authorizeTenant/role",
            name: "authorizeTenantRole",
            title: "角色管理",
            meta: { title: "角色管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-tenant/role/index.vue"
              ),
          },
          {
            level: 2,
            path: "/authorizeTenant/enterprise",
            name: "authorizeTenantEnterprise",
            title: "企业管理",
            meta: { title: "企业管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-tenant/enterprise/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "audit",
        path: "/authorizeEnterprise",
        name: "authorizeEnterprise",
        title: "企业权限",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/authorizeEnterprise/user",
            name: "authorizeEnterpriseUser",
            title: "用户管理",
            meta: { title: "用户管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-enterprise/user/index.vue"
              ),
          },
          {
            level: 2,
            path: "/authorizeEnterprise/role",
            name: "authorizeEnterpriseRole",
            title: "角色管理",
            meta: { title: "角色管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-enterprise/role/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "cluster",
        path: "/objectManage",
        name: "objectManage",
        title: "对象管理",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/objectManage/objectClass",
            name: "objectClass",
            title: "对象分类",
            meta: { title: "对象分类" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/objectManage/objectClass/objectClass.vue"
              ),
          },
          {
            level: 2,
            path: "/objectManage/objectList",
            name: "objectList",
            title: "对象列表",
            meta: { title: "对象列表" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/objectManage/objectList/list/objectList.vue"
              ),
          },
        ],
      },

      {
        level: 1,
        icon: "CodeSandbox",
        path: "/productManage",
        name: "productManage",
        title: "产品管理",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/productManage/productClass",
            name: "productClass",
            title: "产品分类",
            meta: { title: "产品分类" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/productManage/productClass/productClass.vue"
              ),
          },
          {
            level: 2,
            path: "/productManage/productList",
            name: "productList",
            title: "产品列表",
            meta: { title: "产品列表" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/productManage/productList/list/productList.vue"
              ),
          },
          {
            level: 2,
            path: "/productManage/addProduct",
            name: "addProduct",
            title: "添加产品",
            meta: { title: "添加产品" },
            ismenu: "N",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/productManage/productList/add/addProduct.vue"
              ),
          },
          {
            level: 2,
            path: "/productManage/productBatch",
            name: "productBatch",
            title: "产品批次",
            meta: { title: "产品批次" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/productManage/productBatch/productBatch.vue"
              ),
          },
          {
            level: 2,
            path: "/productManage/templateList",
            name: "productTemplateList",
            title: "产品模板",
            meta: { title: "产品模板" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/productManage/productTemplate/list/templateList.vue"
              ),
          },
          {
            level: 2,
            path: "/productManage/addTemplate",
            name: "addProductTemplate",
            title: "添加产品模板",
            meta: { title: "添加产品模板" },
            ismenu: "N",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/productManage/productTemplate/add/addTemplate.vue"
              ),
          },
        ],
      },

      {
        level: 1,
        icon: "scan",
        path: "/identity",
        name: "identity",
        title: "标识管理",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/identity/identityStrategyList",
            name: "identityStrategyList",
            title: "标识策略",
            meta: { title: "标识策略" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/identity/identity-strategy/list/index.vue"
              ),
          },
          {
            level: 2,
            path: "/identity/identityStrategyAction",
            name: "/identity/identityStrategyAction",
            title: "标识策略",
            meta: { title: "标识策略" },
            ismenu: "N",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/identity/identity-strategy/action/index.vue"
              ),
          },
          {
            level: 2,
            path: "/identity/identityGenerate",
            name: "identityGenerate",
            title: "标识生成",
            meta: { title: "标识生成" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/identity/identity-generate/index.vue"
              ),
          },
          {
            level: 2,
            path: "/identity/idetityDetailList",
            name: "identityDetailList",
            title: "标识明细",
            meta: { title: "标识明细" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/identity/identity-detail/list/index.vue"
              ),
          },
          {
            level: 2,
            path: "/identity/identityDetailInfo",
            name: "/identityDetailInfo",
            title: "标识详情",
            meta: { title: "标识详情" },
            ismenu: "N",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/identity/identity-detail/info/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "chrome",
        path: "/trace",
        name: "trace",
        title: "溯源管理",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/trace/traceProcess",
            name: "/traceProcess",
            title: "流程管理",
            meta: { title: "流程管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/trace/trace-process/index.vue"
              ),
          },
          {
            level: 2,
            path: "/trace/traceDataList",
            name: "/traceDataList",
            title: "数据管理",
            meta: { title: "数据管理" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/trace/trace-data/list/index.vue"
              ),
          },
          {
            level: 2,
            path: "/trace/traceDataEdit",
            name: "/traceDataEdit",
            title: "编辑数据",
            meta: { title: "编辑数据" },
            ismenu: "N",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/trace/trace-data/edit/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "securityscan",
        path: "/antiFake",
        name: "antiFake",
        title: "防伪验证",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/antiFake/template",
            name: "/antiFake/template",
            title: "防伪模板",
            meta: { title: "防伪模板" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/antiFake/template/template.vue"
              ),
          },
          {
            level: 2,
            path: "/antiFake/examine",
            name: "/antiFake/examine",
            title: "模板审核",
            meta: { title: "模板审核" },
            ismenu: "Y",
            component: () =>
              import("@/layouts/mainRoutes/pages/antiFake/examine/examine.vue"),
          },
          {
            level: 2,
            path: "/antiFake/record",
            name: "/antiFake/record",
            title: "防伪记录",
            meta: { title: "防伪记录" },
            ismenu: "Y",
            component: () =>
              import("@/layouts/mainRoutes/pages/antiFake/record/record.vue"),
          },
        ],
      },
      {
        level: 1,
        icon: "alert",
        path: "/securityAlarm",
        name: "securityAlarm",
        title: "窜货预警",
        ismenu: "Y",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/securityAlarm/regionSet/list",
            name: "regionSetList",
            title: "区域配置列表",
            meta: { title: "区域配置列表" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/securityAlarm/regionSet/list/index.vue"
              ),
          },
          {
            level: 2,
            path: "/securityAlarm/regionSet/add",
            name: "regionSetAdd",
            title: "区域配置列表",
            meta: { title: "添加区域配置" },
            ismenu: "N",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/securityAlarm/regionSet/add/index.vue"
              ),
          },
          {
            level: 2,
            path: "/securityAlarm/deployBatch/list",
            name: "deployBatchList",
            title: "产品地区分配列表",
            meta: { title: "产品地区分配列表" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/securityAlarm/deployBatch/list/index.vue"
              ),
          },
          {
            level: 2,
            path: "/securityAlarm/deployBatch/add",
            name: "deployBatchAdd",
            title: "产品地区分配列表",
            meta: { title: "添加地区分配" },
            ismenu: "N",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/securityAlarm/deployBatch/add/index.vue"
              ),
          },
          {
            level: 2,
            path: "/securityAlarm/preventionQuery",
            name: "preventionQuery",
            title: "窜货预警记录",
            meta: { title: "窜货预警记录" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/securityAlarm/preventionQuery/index.vue"
              ),
          },
          {
            level: 2,
            path: "/securityAlarm/preventionMap",
            name: "preventionMap",
            title: "窜货地图分布图",
            meta: { title: "窜货地图分布图" },
            ismenu: "Y",
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/securityAlarm/preventionMap/index.vue"
              ),
          },
        ],
      },
    ],
  },
  {
    level: 0,
    path: "/login",
    name: "login",
    component: () => import("@/layouts/mainRoutes/login.vue"),
  },
  {
    level: 0,
    path: "/error",
    name: "error",
    component: () => import("@/layouts/mainRoutes/error.vue"),
  }
];
