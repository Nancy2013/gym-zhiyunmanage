import { PaginationProps, Empty } from "ant-design-vue";
import { RadioChangeEvent } from "ant-design-vue/lib/radio";
import { ColumnProps, TableProps } from "ant-design-vue/lib/table";
import { DataIndex } from "ant-design-vue/lib/vc-table/interface";
import {
    defineComponent,
    reactive,
    watch,
    computed,
    toRefs,
    ref,
    PropType,
    VNode
} from "vue";
import styles from "./index.module.less";

/**
 * 按钮项配置
 */
interface ConfigIconType {
    icon: String;
    popever: Function;
    action?: Function;
}

type ReactiveIconType<T, K> = {
    size: String;
    search: String;
    fullScreen: Boolean;
    checked: Array<K>;
    configIconList: Array<T>;
}

/**
 * 操作项配置
 */
interface ConfigActionType {
    isAction?: Boolean;
    isAdd?: Boolean;
    isSearch?: Boolean;
    add?: Function;
    search?: Function;
    receive?: Function;
}


type PropsType<K> = {
    tableModules: TableProps & { columns: Array<ColumnProps<unknown>>, dataSource: Array<K> },
    actionModules: ConfigActionType,
    paginationModules: PaginationProps
}

export default defineComponent({
    name: 'TsxTable',
    props: {
        configColumns: {
            type: Object as PropType<PropsType<unknown>>,
            required: true
        },
        paginationModules: {
            type: Object as PropType<PropsType<unknown>>,
            default: () => {
                return {
                    total: 500
                }
            }
        }
    },
    components: {
        Empty
    },
    setup(props, { slots }) {

        // 设置input属性的ref值
        const inputRef = ref();

        // toRefs解构保持响应式
        const { configColumns } = toRefs(props);
        const { tableModules, actionModules } = configColumns.value;

        // 表格项
        const { columns, dataSource, loading, pagination } = tableModules;

        // 操作项
        const { isAction, isAdd, isSearch, add, search, receive } = actionModules;

        // reactive 高度响应式
        let exposeTableProps = reactive({ dataSource, loading, pagination, columns });
        let exposeActionProps: ReactiveIconType<ConfigIconType, undefined | DataIndex> = reactive({
            fullScreen: true,
            configIconList: [],
            size: "default",
            checked: columns.map((item: ColumnProps) => item.dataIndex),
            search: "",
        });

        // 控制table全局搜索 -- 根据search, search无, 默认静态搜索 有, 动态搜索
        const globalSearch = (event: String) => {
            return search
                ? search
                : (() => {
                    exposeActionProps.search = event;
                })();
        };

        exposeActionProps.configIconList = [
            {
                icon: "screen",
                popever: (icon: string, action: Function) => {
                    return (
                        <p>
                            <tsx-icon name={icon} onClick={action} />
                        </p>
                    );
                },
                action: () => {
                    switch (exposeActionProps.fullScreen) {
                        case true:
                            (() => {
                                let element = document.getElementById("app");
                                element?.requestFullscreen();
                                exposeActionProps.fullScreen = false;
                            })();
                            break;
                        default:
                            (() => {
                                document.exitFullscreen();
                                exposeActionProps.fullScreen = true;
                            })();
                            break;
                    }
                },
            },
            {
                icon: "size",
                popever: (icon: string) => {
                    let content: VNode = (
                        <a-radio-group
                            value={exposeActionProps.size}
                            onChange={(e: RadioChangeEvent) => {
                                exposeActionProps.size = e.target.value;
                            }}
                        >
                            <p>
                                <a-radio value="small">紧凑</a-radio>
                            </p>
                            <p>
                                <a-radio value="middle">稍紧</a-radio>
                            </p>
                            <p>
                                <a-radio value="default">默认</a-radio>
                            </p>
                        </a-radio-group>
                    );
                    return (
                        <p>
                            <a-popover
                                content={content}
                                trigger="click"
                            >
                                <tsx-icon name={icon} />
                            </a-popover>
                        </p>
                    );
                },
            },
            {
                icon: "filter",
                popever: (icon: string) => {
                    let content: VNode = (
                        <a-checkbox-group
                            value={exposeActionProps.checked}
                            onChange={(checked: string[]) => {
                                exposeActionProps.checked = checked;
                            }}
                        >
                            {exposeTableProps.columns.map((item: ColumnProps) => (
                                <p>
                                    <a-checkbox value={item.dataIndex}>{item.title}</a-checkbox>
                                </p>
                            ))}
                        </a-checkbox-group>
                    );
                    return (
                        <p>
                            {exposeTableProps.columns.length ? (
                                <a-popover
                                    content={content}
                                    trigger="click"
                                >
                                    <tsx-icon name={icon} />
                                </a-popover>
                            ) : (
                                <tsx-icon name={icon} />
                            )}
                        </p>
                    );
                },
            },
            {
                icon: "reset",
                popever: (icon: string, action: Function) => {
                    return (
                        <p>
                            <a-popover content="刷新">
                                <tsx-icon name={icon} onClick={action} />
                            </a-popover>
                        </p>
                    );
                },
                action: () => {
                    return receive
                        ? (() => {
                            if (isSearch) {
                                exposeActionProps.search = '';
                                inputRef.value.input.stateValue = "";
                            }
                            let reset = receive as Function;
                            reset();
                        })()
                        : null;
                },
            },
        ];

        // 监听配置项属性
        watch(() => configColumns.value, (next, prev) => {
            // 表格
            exposeTableProps = Object.assign(exposeTableProps, { ...next.tableModules })
            exposeActionProps.checked = columns.map((item: ColumnProps) => item.dataIndex)
        })

        // 监听全屏操作 (监听属性为响应式)
        watch(
            () => exposeActionProps.fullScreen,
            () => {
                let { configIconList } = exposeActionProps;
                configIconList = configIconList.map((item) => {
                    switch (item.icon) {
                        case "screen":
                            Object.assign(item, { icon: "outScreen" });
                            break;
                        case "outScreen":
                            Object.assign(item, { icon: "screen" });
                            break;
                        default:
                            break;
                    }
                    return item;
                });
            }
        );

        // 监听检索属性, 过滤数据源
        watch(
            () => exposeActionProps.search,
            (next, prev) => {
                let arrayList: Array<unknown> = [];
                let { dataSource } = configColumns.value.tableModules;
                dataSource.forEach((item: any) => {
                    let verifity: boolean = Object.values(item).some(
                        (value: unknown): boolean => {
                            let current = value as string;
                            return `${current}`.includes(next as string);
                        }
                    );
                    if (verifity) arrayList.push(item);
                });
                exposeTableProps = Object.assign(exposeTableProps, { dataSource: arrayList, loading });
            }
        );

        // 计算属性
        const filterColumns = computed(() => {
            return exposeTableProps.columns.filter((ele: ColumnProps) =>
              exposeActionProps.checked.some((element) => element == ele.dataIndex)
            );
        });

        // 表格操作配置项
        const TableConfig = (_props: {
            configIconList: Array<ConfigIconType>;
        }) => {
            const { configIconList } = _props;
            return (
                <div class={styles["table-config"]}>
                    <div class={styles["tsx-icon"]}>
                        {configIconList.map((item) => item.popever(item.icon, item.action))}
                    </div>
                </div>
            );
        };

        return () => (
            <div class="table">
                {isAdd || isSearch ?
                    <div class={styles["table-header"]}>
                        {isAdd ? (
                            <div class="header-action">
                                <a-button type="primary" onClick={add}>
                                    新增
                                </a-button>
                            </div>
                        ) : null}
                        {isSearch ? (
                            <div class="header-query">
                                <a-input-search
                                    ref={inputRef}
                                    placeholder="检索"
                                    enter-button="检索"
                                    onSearch={(e: string) => globalSearch(e)}
                                />
                            </div>
                        ) : null}
                    </div>
                    : null}
                <div class="table-main">
                    {isAction || isAction == undefined ? (
                        <TableConfig configIconList={exposeActionProps.configIconList} />
                    ) : null}
                    {
                        tableModules && exposeActionProps.checked.length ? <a-table
                            {...Object.assign(tableModules, exposeTableProps, {
                                columns: filterColumns.value,
                                size: exposeActionProps.size
                            })}>
                            {slots}
                        </a-table> : <Empty description="暂无数据" />
                    }
                </div>
            </div>
        );
    },
});
