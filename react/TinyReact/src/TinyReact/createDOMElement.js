import mountElement from './mountElement'
import updateElementNode from './updateElementNode'

/**
 * @description 将VDOM转换成真实DOM
 * @param {Object} virtualDOM 待转换的VDOM
 */
export default function createDOMElement(virtualDOM) {
  let newElement = null
  if (virtualDOM.type === 'text') {
    // 创建文本节点
    newElement = document.createTextNode(virtualDOM.props.textContent)
  } else {
    // 创建元素节点
    newElement = document.createElement(virtualDOM.type)
    // 设置/更新元素属性
    updateElementNode(newElement, virtualDOM)
  }

  // 将 Virtual DOM 挂载到真实 DOM 对象的属性中 方便在对比时获取其 Virtual DOM
  newElement.__virtualDOM__ = virtualDOM

  // 如果有ref属性 且ref的值为函数 则将DOM作为形参传入
  if (
    virtualDOM.props &&
    virtualDOM.props.ref &&
    typeof virtualDOM.props.ref === 'function'
  ) {
    virtualDOM.props.ref(newElement)
  }

  // 递归渲染子节点
  virtualDOM.children.forEach((child) => {
    // 因为不确定子元素是 NativeElement 还是 Component 所以调用 mountElement 方法进行确定
    mountElement(child, newElement)
  })

  return newElement
}
