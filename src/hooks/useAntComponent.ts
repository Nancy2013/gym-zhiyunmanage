/**
 * ant design vue组件通用方法
 */

/**
 * select菜单滚动定位到父节点
 * @param triggerNode 菜单组件节点
 * @returns 
 */
export const getPopupContainer=(triggerNode:any)=>triggerNode.parentNode;