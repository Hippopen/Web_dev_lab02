// src/jsx-runtime.ts

/*
 * =================================================================
 * PHẦN 1: ĐỊNH NGHĨA CÁC TYPES
 * =================================================================
 */

export interface VNode {
  type: string | ComponentFunction;
  props: Record<string, any>;
  children: (VNode | string | number)[];
}

export interface ComponentProps {
  children?: (VNode | string | number)[];
  [key: string]: any;
}

export type ComponentFunction = (props: ComponentProps) => VNode;

/*
 * =================================================================
 * PHẦN 2: HỆ THỐNG STATE VÀ RE-RENDER (QUAN TRỌNG)
 * =================================================================
 */

// Biến toàn cục lưu trữ root component và container
let rootComponent: (() => VNode) | null = null;
let rootContainer: HTMLElement | null = null;

// Mảng toàn cục để lưu trữ state (giống React)
let stateSlots: any[] = [];
let currentStateIndex: number = 0; // Con trỏ cho state hiện tại

// Hàm "vẽ" lại toàn bộ ứng dụng
function rerender() {
  // Reset lại con trỏ state
  currentStateIndex = 0;
  
  if (rootComponent && rootContainer) {
    // Gọi lại hàm component gốc để lấy VNode mới
    const newVNode = rootComponent();
    
    // Xóa DOM cũ
    rootContainer.innerHTML = '';
    
    // Render VNode mới
    const newDOM = renderToDOM(newVNode);
    
    // Gắn vào
    rootContainer.appendChild(newDOM);
    
    // BƯỚC SỬA LỖI: TÌM VÀ FOCUS LẠI ELEMENT
    const elementToFocus = rootContainer.querySelector('[data-autofocus="true"]');
    if (elementToFocus && typeof (elementToFocus as HTMLElement).focus === 'function') {
      (elementToFocus as HTMLElement).focus();
    }
  }
}

// TODO: Implement basic state management
export function useState<T>(initialValue: T): [() => T, (newValue: T) => void] {
  
  const index = currentStateIndex;
  
  // Nếu slot này chưa có state, khởi tạo nó
  if (stateSlots[index] === undefined) {
    stateSlots[index] = initialValue;
  }

  // Hàm getter: Trả về state tại slot này
  const getter = (): T => stateSlots[index];

  // Hàm setter: Cập nhật state và kích hoạt re-render
  const setter = (newValue: T): void => {
    stateSlots[index] = newValue;
    rerender(); // Kích hoạt "vẽ" lại
  };

  // Di chuyển con trỏ sang slot tiếp theo
  currentStateIndex++;
  
  return [getter, setter];
}


/*
 * =================================================================
 * PHẦN 3: TRIỂN KHAI CÁC HÀM RUNTIME (Core Functions)
 * =================================================================
 */

// TODO: Implement createElement function
export function createElement(
  type: string | ComponentFunction,
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  
  const { children: propsChildren, ...restProps } = props || {};
  
  const flatChildren = children
    .flat()
    .filter(child => child !== null && child !== undefined);

  return {
    type: type,
    props: restProps,
    children: flatChildren
  };
}

// TODO: Implement createFragment function
export function createFragment(
  props: Record<string, any> | null,
  ...children: (VNode | string | number)[]
): VNode {
  return createElement('fragment', props, ...children);
}

/*
 * =================================================================
 * PHẦN 4: TRIỂN KHAI HỆ THỐNG RENDERING (VNode -> DOM)
 * =================================================================
 */

// TODO: Implement renderToDOM function
export function renderToDOM(vnode: VNode | string | number): Node {
  
  // 1. Xử lý text nodes
  if (typeof vnode === 'string' || typeof vnode === 'number') {
    return document.createTextNode(String(vnode));
  }

  // 2. Xử lý fragments
  if (vnode.type === 'fragment') {
    const fragment = document.createDocumentFragment();
    vnode.children.forEach(child => {
      fragment.appendChild(renderToDOM(child));
    });
    return fragment;
  }
  
  // 3. Xử lý component functions
  if (typeof vnode.type === 'function') {
    const componentVNode = vnode.type({ ...vnode.props, children: vnode.children });
    return renderToDOM(componentVNode);
  }

  // 4. Xử lý các phần tử HTML
  const element = document.createElement(vnode.type as string);

  // Đệ quy render các con
  vnode.children.forEach(child => {
    element.appendChild(renderToDOM(child));
  });

  // Gán các thuộc tính (props) cho element
  Object.keys(vnode.props).forEach(key => {
    const value = vnode.props[key];
    
    /*
     * BÀI 5.2 - TỐI ƯU HÓA
     * Chúng ta xử lý các DOM 'property' (như checked, value)
     * thay vì chỉ dùng 'setAttribute' cho mọi thứ.
     */
    if (key === 'className') {
      element.setAttribute('class', value);
    } else if (key === 'style' && typeof value === 'object') {
      const styleString = Object.entries(value)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
        .join(';');
      element.setAttribute('style', styleString);
    } else if (key === 'style' && typeof value === 'string') {
      element.setAttribute('style', value);
    } else if (key.startsWith('on') && typeof value === 'function') {
      const eventName = key.substring(2).toLowerCase();
      element.addEventListener(eventName, value);
    } else if (key === 'ref' && typeof value === 'function') {
      value(element);
    } else if (key === 'autoFocus' && value) {
      element.setAttribute('data-autofocus', 'true');
    } else if (key === 'key') {
      // Bỏ qua 'key', nó chỉ dùng cho reconciliation
    } else if (key === 'checked' || key === 'value' || key === 'disabled' || key === 'selected') {
      // Gán thẳng vào 'property' của element
      (element as any)[key] = value;
    } else {
      // Thuộc tính HTML thông thường
      element.setAttribute(key, value);
    }
  });

  return element;
}

// TODO: Implement mount function
export function mount(component: () => VNode, container: HTMLElement): void {
  // Lưu trữ component gốc và container
  rootComponent = component;
  rootContainer = container;
  
  // Kích hoạt render lần đầu
  rerender();
}