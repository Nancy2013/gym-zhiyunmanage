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
        icon: "table",
        path: "/home",
        name: "home",
        title: "工作台",
        meta: { title: "工作台" },
        component: () => import("@/layouts/mainRoutes/pages/home/index.vue"),
      },
      {
        level: 1,
        icon: "table",
        path: "/authorizeAdmin",
        name: "/authorizeAdmin",
        title: "权限管理",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/authorizeAdmin/user",
            name: "authorizeAdminUser",
            title: "用户管理",
            meta: { title: "用户管理" },
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
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-admin/type/index.vue"
              )
          },
          {
            level: 2,
            path: "/authorizeAdmin/menu",
            name: "authorizeAdminMenu",
            title: "菜单管理",
            meta: { title: "菜单管理" },
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
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-admin/tenant/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "table",
        path: "/authorizeTenant",
        name: "/authorizeTenant",
        title: "租户权限",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/authorizeTenant/user",
            name: "authorizeTenantUser",
            title: "用户管理",
            meta: { title: "用户管理" },
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
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-tenant/enterprise/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "table",
        path: "/authorizeEnterprise",
        name: "/authorizeEnterprise",
        title: "企业权限",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/authorizeEnterprise/user",
            name: "authorizeEnterpriseUser",
            title: "用户管理",
            meta: { title: "用户管理" },
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
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/authorize/authorize-enterprise/role/index.vue"
              ),
          }
        ],
      },
      {
        level: 1,
        icon: "table",
        path: "/objectManage",
        name: "objectManage",
        title: "对象管理",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/objectManage/objectClass",
            name: "objectClass",
            title: "对象分类",
            meta: { title: "对象分类" },
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
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/objectManage/objectList/list/objectList.vue"
              ),
          },
          {
            level: 2,
            path: "/objectManage/addObject",
            name: "addObject",
            title: "添加对象",
            meta: { title: "添加对象" },
            hideInMenu: true,
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/objectManage/objectList/add/addObject.vue"
              ),
          },
          {
            level: 2,
            path: "/objectManage/objectBatch",
            name: "objectBatch",
            title: "对象批次",
            meta: { title: "对象批次" },
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/objectManage/objectBatch/objectBatch.vue"
              ),
          },
          {
            level: 2,
            path: "/objectManage/templateList",
            name: "objectTemplateList",
            title: "对象模板",
            meta: { title: "对象模板" },
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/objectManage/objectTemplate/list/templateList.vue"
              ),
          },
          {
            level: 2,
            path: "/objectManage/addTemplate",
            name: "addObjectTemplate",
            title: "添加对象模板",
            meta: { title: "添加对象模板" },
            hideInMenu: true,
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/objectManage/objectTemplate/add/addTemplate.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "table",
        path: "/identity",
        name: "identity",
        title: "标识管理",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/identity/identityStrategyList",
            name: "identityStrategyList",
            title: "标识策略",
            meta: { title: "标识策略" },
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
            hideInMenu: true,
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
            hideInMenu: true,
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/identity/identity-detail/info/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "table",
        path: "/trace",
        name: "trace",
        title: "溯源管理",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/trace/traceProcess",
            name: "/traceProcess",
            title: "流程管理",
            meta: { title: "流程管理" },
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
            hideInMenu: true,
            component: () =>
              import(
                "@/layouts/mainRoutes/pages/trace/trace-data/edit/index.vue"
              ),
          },
        ],
      },
      {
        level: 1,
        icon: "table",
        path: "/antiFake",
        name: "antiFake",
        title: "防伪验证",
        component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
        children: [
          {
            level: 2,
            path: "/antiFake/template",
            name: "/antiFake/template",
            title: "防伪模板",
            meta: { title: "防伪模板" },
            component: () => import("@/layouts/mainRoutes/pages/antiFake/template/template.vue"),
          },
          {
            level: 2,
            path: "/antiFake/record",
            name: "/antiFake/record",
            title: "防伪记录",
            meta: { title: "防伪记录" },
            component: () => import("@/layouts/mainRoutes/pages/antiFake/record/record.vue"),
          }
        ]
      },
      {
				level: 1,
				icon: "table",
				path: "/securityAlarm",
                name: "securityAlarm",
				title: "窜货预警",
				component: () => import("@/layouts/mainRoutes/basicLayout.vue"),
				children: [
					{
						level: 2,
						path: "/securityAlarm/regionSet/list",
						name: "regionSetList",
						title: "区域配置列表",
						meta: { title: "区域配置列表" },
						component: () => import("@/layouts/mainRoutes/pages/securityAlarm/regionSet/list/index.vue"),
					},
					{
						level: 2,
						path: "/securityAlarm/regionSet/add",
						name: "regionSetAdd",
						title: "区域配置列表",
						meta: { title: "添加区域配置" },
						component: () => import("@/layouts/mainRoutes/pages/securityAlarm/regionSet/add/index.vue"),
						hideInMenu: true,
					},
					{
						level: 2,
						path: "/securityAlarm/deployBatch/list",
						name: "deployBatchList",
						title: "产品地区分配列表",
						meta: { title: "产品地区分配列表" },
						component: () => import("@/layouts/mainRoutes/pages/securityAlarm/deployBatch/list/index.vue"),
					},
					{
						level: 2,
						path: "/securityAlarm/deployBatch/add",
						name: "deployBatchAdd",
						title: "产品地区分配列表",
						meta: { title: "添加地区分配" },
						component: () => import("@/layouts/mainRoutes/pages/securityAlarm/deployBatch/add/index.vue"),
						hideInMenu: true,
					},
          {
						level: 2,
						path: "/securityAlarm/preventionQuery",
						name: "preventionQuery",
						title: "窜货预警记录",
						meta: { title: "窜货预警记录" },
						component: () => import("@/layouts/mainRoutes/pages/securityAlarm/preventionQuery/index.vue"),
					},
					{
						level: 2,
						path: "/securityAlarm/preventionMap",
						name: "preventionMap",
						title: "窜货地图分布图",
						meta: { title: "窜货地图分布图" },
						component: () => import("@/layouts/mainRoutes/pages/securityAlarm/preventionMap/index.vue"),
					},
				]
			}

    ],
  },
  {
    level: 0,
    path: "/login",
    name: "login",
    component: () => import("@/layouts/mainRoutes/login.vue"),
  },
];
