import { defineComponent, PropType, reactive, toRefs, watch } from "vue";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  CheckOutlined,
} from "@ant-design/icons-vue";
import { Tree, message } from "ant-design-vue";
import { DataNode, TreeProps } from "ant-design-vue/lib/tree";
import styles from "./index.module.less";
import { ChangeEvent } from "ant-design-vue/lib/_util/EventInterface";

/**
 * 配置项设置
 */

interface ExtraPropertyType {
  level?: number;
  nodeName?: string;
}

type PropsType = {
  treeModules: TreeProps & ExtraPropertyType;
};

export default defineComponent({
  name: 'TsxTree',
  props: {
    treeConfigs: {
      type: Object as PropType<PropsType>,
      required: true,
    },
  },
  components: {
    Tree,
  },
  setup(props, { slots }) {
    // toRefs解构保持响应式
    let { treeConfigs } = toRefs(props);
    let { treeModules } = treeConfigs.value;

    // 树形结构项
    let { treeData, level, nodeName } = treeModules;
    let exposeTreeProps = reactive({ treeData, level });
    // 选择节点类型
    let state = reactive({ selectKey: "" });

    const NodeTree = (_props: {
      title: string;
      key: string;
      children?: DataNode[];
    }) => {
      const { title, key, children } = _props;
      if (children) {
        return <NodeTree title={title} key={key} children={children} />;
      } else {
        return <tree-node title={title} key={key}></tree-node>;
      }
    };

    // 递归树形组件
    const renderTree = (data: DataNode[] | undefined) => {
      return data?.map((item: DataNode) => {
        if (item.children) {
          return (
            <tree-node title={item.title} key={item.key}>
              {renderTree(item.children)}
            </tree-node>
          );
        } else {
          return <tree-node title={item.title} key={item.key} />;
        }
      });
    };

    // 操作项
    const actions = {
      //  修改input输入框值
      input(e: ChangeEvent, record: { title?: string; key: string }) {
        record.title = e.target.value;
        let getTreeData: DataNode[] | undefined = exposeTreeProps.treeData;
        // 递归更改数据
        const forEachTree = (data: DataNode[] | undefined) => {
          return data?.map((item: DataNode) => {
            item.children ? forEachTree(item.children) : null;
            if (item.key == record.key) {
              item.title = e.target.value;
            }
            return item;
          });
        };
        exposeTreeProps.treeData = forEachTree(getTreeData);
      },

      // 编辑
      edit(record: { key: string }) {
        state.selectKey = record.key;
      },

      // 添加
      add(record: { key: string }) {
        let getTreeData: DataNode[] | undefined = exposeTreeProps.treeData;

        // 循环遍历设置key值
        const setKey = (
          count: number,
          index: number,
          parentKey: string | number
        ) => {
          let key: string | number = parentKey;
          for (let i = 0; i < count - 2; i++) {
            key += `-${0}`;
          }
          return key + `-${index}`;
        };

        // 增加节点属性
        const addPropertyNode = (
          title: string,
          parent: number,
          key: string
        ) => {
          return {
            title,
            parent,
            key,
          };
        };

        // 递归更改数据
        const forEachTree = (data: DataNode[] | undefined) => {
          return data?.map((item: DataNode, index: number) => {
            item.children ? forEachTree(item.children) : null;
            if (item.key == record.key) {
              if (item.children) {
                item.children.push(
                  addPropertyNode(
                    nodeName ? `${nodeName}` : `新步骤`,
                    item.parent + 1,
                    setKey(item.parent + 1, index, item.key)
                  )
                );
                item.children = item.children.map(
                  (element: DataNode, eleIndex: number) =>
                    Object.assign({}, element, {
                      key: setKey(element.parent, eleIndex, item.key),
                    })
                );
              } else {
                item.children = [
                  addPropertyNode(
                    nodeName ? `${nodeName}` : `新步骤`,
                    item.parent + 1,
                    setKey(item.parent + 1, index, item.key)
                  ),
                ];
              }
            }
            return item;
          });
        };
        exposeTreeProps.treeData = forEachTree(getTreeData);
      },

      // 删除
      delete(record: { key: string }) {
        let getTreeData: DataNode[] | undefined = exposeTreeProps.treeData;
        // 删除树形结构
        const deleteTree = (data: DataNode[] | undefined) => {
          data?.forEach((item: any, index: number) => {
            item.children ? deleteTree(item.children) : null;
            if (item.key == record.key) {
              data.splice(index, 1);
            }
          });
          return data;
        };
        exposeTreeProps.treeData = deleteTree(getTreeData);
      },

      // 保存
      save() {
        state.selectKey = "";
      },
    };

    // 操作组件
    const TreeAction = (_props: {
      action: Function;
      type: string;
      danger?: boolean;
    }) => {
      const { action, type, danger } = _props;
      const getTypeTitle = (type: string) => {
        let title = "";
        switch (type) {
          case "save":
            title = "保存";
            break;
          case "add":
            title = "添加";
            break;
          case "edit":
            title = "编辑";
            break;
          case "delete":
            title = "删除";
            break;
        }
        return title;
      };

      const TypeComponent = (_props: { type: string }) => {
        const { type } = _props;
        return (
          <>
            {type == "save" ? <CheckOutlined /> : undefined}
            {type == "add" ? <PlusOutlined /> : undefined}
            {type == "edit" ? <EditOutlined /> : undefined}
            {type == "delete" ? <DeleteOutlined /> : undefined}
          </>
        );
      };

      return (
        <a-tooltip placement="top" title={getTypeTitle(type)}>
          <a-button
            type="link"
            size="small"
            danger={danger ? danger : false}
            onClick={action}
          >
            <TypeComponent type={type} />
          </a-button>
        </a-tooltip>
      );
    };

    // 监听配置项属性
    watch(
      () => treeConfigs.value,
      (next, prev) => {
        // 树形控件
        exposeTreeProps = Object.assign(exposeTreeProps, {
          ...next.treeModules,
        });
      }
    );

    return () => (
      <div class={styles["tree-main"]}>
        <Tree
          {...Object.assign({}, treeModules, {
            treeData: exposeTreeProps.treeData,
          })}
          v-slots={{
            title: (record: {
              key: string;
              title?: string;
              parent?: number;
            }) => {
              return (
                <div class={styles["slots-title"]}>
                  {Object.is(state.selectKey, record.key) ? (
                    <a-input
                      value={record.title}
                      placeholder="输入标题"
                      style="width:100px"
                      onChange={(e: ChangeEvent) => actions.input(e, record)}
                    />
                  ) : (
                    <span>{record.title}</span>
                  )}
                  <div class={styles["slots-title-action"]}>
                    {Object.is(state.selectKey, record.key) ? (
                      <TreeAction action={() => actions.save()} type="save" />
                    ) : (
                      <>
                        {Object.is(record.parent, -1) ? (
                          <TreeAction
                            action={() => actions.add(record)}
                            type="add"
                          />
                        ) : (
                          <>
                            {Object.is(
                              (record.parent as any) + 1,
                              exposeTreeProps.level
                            ) ? (
                              <>
                                <TreeAction
                                  action={() => actions.edit(record)}
                                  type="edit"
                                />
                                <a-divider type="vertical" />
                                <TreeAction
                                  action={() => actions.delete(record)}
                                  type="delete"
                                  danger
                                />
                              </>
                            ) : (
                              <>
                                <TreeAction
                                  action={() => actions.add(record)}
                                  type="add"
                                />
                                <a-divider type="vertical" />
                                <TreeAction
                                  action={() => actions.edit(record)}
                                  type="edit"
                                />
                                <a-divider type="vertical" />
                                <TreeAction
                                  action={() => actions.delete(record)}
                                  type="delete"
                                  danger
                                />
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            },
          }}
        >
          {renderTree(exposeTreeProps.treeData)}
          {slots}
        </Tree>
      </div>
    );
  },
});
