import { defineComponent, onMounted, reactive, toRefs, nextTick } from "vue";
import { Modal, message } from 'ant-design-vue';
import request from '@/utils/axios'
import { useRoute, useRouter } from "vue-router";
import { useAction } from "@/hooks";
import { teaConfirmStatusDict } from '@/utils/dict'
import { teaConfirmStatusOptions } from '@/utils/config'
import QRCode from "qrcodejs2-fix";

// 表格数据
const columns = [
    {
        key: "tableIndex",
        dataIndex: "tableIndex",
        align: "center",
        title: "序号",
        width: 72,
    },
    {
        key: "enterpriseName",
        dataIndex: "enterpriseName",
        align: "center",
        title: "企业名称",
    },
    {
        // TODO
        key: "enterpriseName",
        dataIndex: "enterpriseName",
        align: "center",
        title: "企业简称",
    },
    {
        key: "teaGardenName",
        dataIndex: "teaGardenName",
        align: "center",
        title: "茶园名称",
    },
    {
        key: "teaGardenArea",
        dataIndex: "teaGardenArea",
        align: "center",
        title: "茶园面积(亩)",
    },
    {
        key: "teaGardenAddress",
        dataIndex: "teaGardenAddress",
        align: "center",
        title: "茶园地址"
    },
    {
        key: "selenium",
        dataIndex: "selenium",
        align: "center",
        title: "含硒量(mg/kg)",
    },
    {
        key: "head",
        dataIndex: "head",
        align: "center",
        title: "负责人",
        width: 96,
    },
    {
        key: "headPhone",
        dataIndex: "headPhone",
        align: "center",
        title: "联系电话"
    },
    {
        key: "applyTime",
        dataIndex: "applyTime",
        align: "center",
        title: "申请时间"
    },
    {
        key: "authorizedStatus",
        dataIndex: "authorizedStatus",
        align: "center",
        title: "审核状态",
        width: 96
    },
    {
        key: "action",
        title: "操作",
        align: "center",
        dataIndex: "action",
        fixed: 'right',
        width: 140,
    }
]
export default defineComponent({
    setup() {
        const route = useRoute()
        const router = useRouter()
        const storeAction = useAction('stModule', ['asyncUpdateIsStBreamub', 'asyncUpdateApprovalStatus', 'asyncUpdateStSelectedKeys'])
        const state = reactive({
            columns,
            dataSource: [],
            loading: true,
            pagination: {
                total: 0,
                current: 1,
                pageSize: 10
            },
            formData: {} as any,
            validateStatus: "",
            teaConfirmStatusOptions,
            query: {
                condition: '',
                status: ''
            },
            visible: false,
            visibleTeaCode: false,
            modalTeaName: '',
            id: '',
            reason: '',
            type: '',
            tHeight: '' as string | number ,
            teaCodeKey: Math.random(),
            teaGardenData: {} as any,
            selectedRowKeys: []
        })

        onMounted(() => {
            const tableHeight = document.getElementById('teaGardenProperty-table')?.clientHeight
            if (tableHeight) {
                state.tHeight = tableHeight - 120 
            }
        })
        const convertStatus = (state: number) => {
            let value: string = ''
            switch (state) {
                case 0: value = '待审核'; break;
                case 1: value = '已通过'; break;
                case 2: value = '已驳回'; break;
                default: break;
            }
            return value
        }

        // 茶企确权查询
        const queryTea = async () => {
            state.loading = true
            let { pagination: { pageSize, current }, query: { condition, status } } = state
            let res: any = await request({
                url: `${import.meta.env.VITE_XICHA_URL}/authorized/page-query`, method: 'POST', data: {
                    pageSize: pageSize,
                    pageNum: current,
                    keyWords: condition,
                    authorizedStatus: status
                }
            })
            let { rows, total } = res.data;
            
            if (Array.isArray(rows) && rows.length) {
                state.dataSource = rows.map((row, index) => {
                    row.tableIndex = pageSize * (current - 1) + index + 1
                    return row as never
                });
            } else {
                state.dataSource = []
            }
            state.loading = false;
            state.selectedRowKeys = [];
            state.pagination = {
                total: total,
                current,
                pageSize
            };
        }

        // 复选框操作
        const rowSelection = {
            onChange: (selectedRowKeys: any) => {
                state.selectedRowKeys = selectedRowKeys
            },
            getCheckboxProps: (record: any) => ({
                disabled: record.status != 0,
                // name: record.approvalStatus,
            })
        }

        // 更新认证审核 （多个）
        const updateAuthorizeAll = async (data: any) => {
            let res: any = await request({
                baseURL: "/fcapi",
                url: "/tea/auth/processAuthoBatch",
                type: "json",
                method: "post",
                data,
            })
            console.log("res.data", res);
            if (res.data.code == 200) {
                queryTea()
                state.visible = false;
            }
        }

        // 点击查询
        const clickQuery = () => {
            state.pagination.current = 1;
            queryTea()
        }

        /**
         点击确权驳回按钮时触发
         @param
         @return
         */
        const cancel = () => {
            const { formData, teaGardenData } = state
            if (!formData.reason) {
                state.validateStatus = 'error'
                return
            } else {
                state.validateStatus = ''
            }
            request({
                url: `${import.meta.env.VITE_XICHA_URL}/authorized/approve`,
                type: "json",
                method: "post",
                data: {
                    id: teaGardenData.id,
                    approve: teaConfirmStatusDict.reject,
                    reason: formData.reason
                },
            }).then((res) => {
                state.visible = false
                queryTea()
                message.success('操作成功');
            })
        }

        /**
         点击确权通过按钮时触发
         @param
         @return
         */
        const ok = () => {
            const { teaGardenData, formData } = state
            request({
                url: `${import.meta.env.VITE_XICHA_URL}/authorized/approve`,
                type: "json",
                method: "post",
                data: {
                    id: teaGardenData.id,
                    approve: teaConfirmStatusDict.complate,
                    reason: formData.reason
                },
            }).then((res) => {
                state.visible = false
                queryTea()
                message.success('审核已通过');
            })
            
        }


        // 分页查询
        const paginationChange = (pagination: any) => {
            let { total, current, pageSize } = pagination
            state.pagination = { total, current, pageSize };
            queryTea();
        }

        /**
         点击查看详情时触发
         @param { Object } record 表格行数据
         @return
         */
        const handleInfo = (record: any) => {
            router.push({
                path: "/stPublic/application/teaGardenProperty/detail",
                query: {
                    id: record.id
                }
            } as any);
        }

        /**
         点击茶园码时触发
         @param { Object } record 表格行数据
         @return
         */
        const handleTeaCode = async (record: any) => {
            state.visibleTeaCode = true;
            state.teaCodeKey = Math.random()
            state.teaGardenData = record
            await nextTick()
            let qrcode: any = document.getElementById("qrcode");
            new QRCode(qrcode, {
                text: `https://xi.cn88555.com/weixin.html#/code?code=${record.teaGardenCode}`,
                width: 200,
                height: 200,
                colorDark: "#000000",
                colorLight: "#ffffff",
            });
        }

        /**
         处理点击审核时触发
         @param { Object } record 表格行数据
         @return
         */
        const handleAudit = (record: any) => {
            state.visible = true
            state.teaGardenData = record
        }

        /**
         处理驳回原因文本框获取焦点事件
         @param
         @return
         */
        const handleFocus = () => {
            state.validateStatus = ''
        }

        /**
         处理关闭审核弹框
         @param
         @return
         */
        const handleCloseTeaAuditModal = () => {
            state.formData = {}
        }

        onMounted(() => {
            queryTea()
            const { asyncUpdateIsStBreamub, asyncUpdateApprovalStatus, asyncUpdateStSelectedKeys } = storeAction
            asyncUpdateIsStBreamub({ isStBreamub: true })
            asyncUpdateApprovalStatus({ approvalStatus: 3 })
            asyncUpdateStSelectedKeys({ stSelectedKeys: [route.path] })
        })
        return {
            ...toRefs(state),
            convertStatus,
            clickQuery,
            cancel,
            ok,
            rowSelection,
            teaConfirmStatusDict,
            paginationChange,
            handleInfo,
            handleTeaCode,
            handleAudit,
            handleFocus,
            handleCloseTeaAuditModal
        }
    }
})