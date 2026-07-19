# RxTooltip 组件使用文档

基于 `dom-align` 库的 Vue 3  tooltip 组件，支持 SSR（ClientOnly）。

## 功能特性

- ✨ 支持多种触发方式：hover（悬停）、click（点击）、manual（手动）
- 📍 12 种定位方式，支持自定义偏移
- 🎨 内置默认样式，支持完全自定义样式
- 🔄 自动对齐到参考元素
- 📱 响应式设计，支持窗口 resize 重新对齐
- 🛡️ SSR 友好（使用 ClientOnly 组件）
- 🎯 支持箭头指示和自定义类名
- ⚡ 轻量级，基于 dom-align 库

## 安装与导入

由于项目使用 Nuxt 自动组件注册，只需在 `components` 目录下创建，即可直接使用。

```vue
<template>
  <RxTooltip content="这是一个提示">
    <button>悬停显示</button>
  </RxTooltip>
</template>
```

## 基本使用

### 1. 悬停触发（默认）

```vue
<template>
  <RxTooltip content="这是提示内容">
    <span class="text-blue-500">悬停我</span>
  </RxTooltip>
</template>
```

### 2. 点击触发

```vue
<template>
  <RxTooltip trigger="click" content="点击显示/隐藏">
    <button>点击显示</button>
  </RxTooltip>
</template>
```

### 3. 手动触发

```vue
<template>
  <RxTooltip
    trigger="manual"
    :visible="visible"
    content="手动控制显示/隐藏"
  >
    <button @click="visible = !visible">
      {{ visible ? '隐藏' : '显示' }} 提示
    </button>
  </RxTooltip>
</template>

<script setup>
const visible = ref(false)
</script>
```

### 4. 自定义内容（插槽）

```vue
<template>
  <RxTooltip>
    <span class="font-bold">带插槽内容的提示</span>
    <template #content>
      <div class="p-2">
        <h4 class="font-bold mb-1">自定义标题</h4>
        <p class="text-sm text-gray-600">这是一个自定义的 tooltip 内容</p>
      </div>
    </template>
  </RxTooltip>
</template>
```

### 5. 定位方式

支持 12 种定位方式：

```vue
<template>
  <div class="flex flex-wrap gap-4">
    <RxTooltip placement="top" content="顶部对齐">
      <button>top</button>
    </RxTooltip>
    <RxTooltip placement="topLeft" content="顶部左对齐">
      <button>topLeft</button>
    </RxTooltip>
    <RxTooltip placement="topRight" content="顶部右对齐">
      <button>topRight</button>
    </RxTooltip>
    <RxTooltip placement="bottom" content="底部对齐">
      <button>bottom</button>
    </RxTooltip>
    <RxTooltip placement="bottomLeft" content="底部左对齐">
      <button>bottomLeft</button>
    </RxTooltip>
    <RxTooltip placement="bottomRight" content="底部右对齐">
      <button>bottomRight</button>
    </RxTooltip>
    <RxTooltip placement="left" content="左对齐">
      <button>left</button>
    </RxTooltip>
    <RxTooltip placement="leftTop" content="左对齐顶部">
      <button>leftTop</button>
    </RxTooltip>
    <RxTooltip placement="leftBottom" content="左对齐底部">
      <button>leftBottom</button>
    </RxTooltip>
    <RxTooltip placement="right" content="右对齐">
      <button>right</button>
    </RxTooltip>
    <RxTooltip placement="rightTop" content="右对齐顶部">
      <button>rightTop</button>
    </RxTooltip>
    <RxTooltip placement="rightBottom" content="右对齐底部">
      <button>rightBottom</button>
    </RxTooltip>
  </div>
</template>
```

### 6. 自定义样式

```vue
<template>
  <RxTooltip
    content="自定义样式的提示"
    custom-class="my-custom-tooltip"
    :offset="[10, 10]"
  >
    <button>自定义样式</button>
  </RxTooltip>
</template>

<style scoped>
.my-custom-tooltip {
  background-color: #ff6b6b !important;
  color: white !important;
  border-radius: 8px !important;
  padding: 12px !important;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.3) !important;
}

.my-custom-tooltip .rx-tooltip__arrow {
  background-color: #ff6b6b !important;
}
</style>
```

## Props 配置

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| `trigger` | `'hover' \| 'click' \| 'manual'` | `'hover'` | 触发方式 |
| `content` | `string` | `''` | 提示内容 |
| `visible` | `boolean` | `false` | 手动触发时的可见性（`trigger='manual'` 时必传） |
| `placement` | `Placement` | `'top'` | 定位方式 |
| `delay` | `number` | `150` | 延迟显示时间（ms） |
| `hideDelay` | `number` | `150` | 延迟隐藏时间（ms） |
| `disabled` | `boolean` | `false` | 是否禁用 |
| `showArrow` | `boolean` | `true` | 是否显示箭头 |
| `customClass` | `string` | `''` | 自定义类名 |
| `offset` | `[number, number]` | `[0, 8]` | 偏移量 [x, y] |

### 定位方式类型 `Placement`

```typescript
type Placement =
  | 'top'
  | 'topLeft'
  | 'topRight'
  | 'bottom'
  | 'bottomLeft'
  | 'bottomRight'
  | 'left'
  | 'leftTop'
  | 'leftBottom'
  | 'right'
  | 'rightTop'
  | 'rightBottom'
```

## 事件

| 事件名 | 参数 | 说明 |
|--------|------|------|
| `update:visible` | `(visible: boolean)` | 可见性变化时触发（v-model:visible） |
| `visible-change` | `(visible: boolean)` | 可见性变化时触发 |

## 自定义样式

组件提供了完整的 CSS 类名，可以完全覆盖默认样式：

```css
/* 基础类 */
.rx-tooltip {
  /* 提示框容器 */
}

.rx-tooltip--top, .rx-tooltip--bottom, /* 定位类 */ {
  /* 特定位置样式 */
}

.rx-tooltip__arrow {
  /* 箭头样式 */
}

.rx-tooltip__content {
  /* 内容区域 */
}

.rx-tooltip--disabled {
  /* 禁用状态 */
}
```

## 注意事项

### SSR 兼容性

组件使用 `<ClientOnly>` 包裹，确保在 SSR 环境下不会报错。

### 嵌套使用

避免在具有 `overflow: hidden` 的容器中嵌套使用，可能会导致 tooltip 被裁剪。

### 动画

组件使用 CSS 过渡动画，修改时建议保持一致性。

## 开发与调试

### 查看 dom-align 对齐效果

```javascript
// 在浏览器控制台中查看对齐信息
console.log('dom-align 对齐信息:', domAlign(popper, reference, config))
```

### 常见问题

1. **tooltip 不显示**：检查是否有 `overflow: hidden` 容器影响
2. **对齐不准确**：尝试调整 `offset` 属性或检查参考元素的尺寸
3. **箭头不显示**：确保 `showArrow` 属性为 `true`

## 浏览器支持

- Chrome (推荐)
- Firefox
- Safari
- Edge

## 许可证

MIT
