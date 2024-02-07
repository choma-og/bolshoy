(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity)
      fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy)
      fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function isObject$3(obj) {
  return obj !== null && typeof obj === "object" && "constructor" in obj && obj.constructor === Object;
}
function extend$2(target = {}, src = {}) {
  Object.keys(src).forEach((key) => {
    if (typeof target[key] === "undefined")
      target[key] = src[key];
    else if (isObject$3(src[key]) && isObject$3(target[key]) && Object.keys(src[key]).length > 0) {
      extend$2(target[key], src[key]);
    }
  });
}
const ssrDocument = {
  body: {},
  addEventListener() {
  },
  removeEventListener() {
  },
  activeElement: {
    blur() {
    },
    nodeName: ""
  },
  querySelector() {
    return null;
  },
  querySelectorAll() {
    return [];
  },
  getElementById() {
    return null;
  },
  createEvent() {
    return {
      initEvent() {
      }
    };
  },
  createElement() {
    return {
      children: [],
      childNodes: [],
      style: {},
      setAttribute() {
      },
      getElementsByTagName() {
        return [];
      }
    };
  },
  createElementNS() {
    return {};
  },
  importNode() {
    return null;
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  }
};
function getDocument() {
  const doc = typeof document !== "undefined" ? document : {};
  extend$2(doc, ssrDocument);
  return doc;
}
const ssrWindow = {
  document: ssrDocument,
  navigator: {
    userAgent: ""
  },
  location: {
    hash: "",
    host: "",
    hostname: "",
    href: "",
    origin: "",
    pathname: "",
    protocol: "",
    search: ""
  },
  history: {
    replaceState() {
    },
    pushState() {
    },
    go() {
    },
    back() {
    }
  },
  CustomEvent: function CustomEvent() {
    return this;
  },
  addEventListener() {
  },
  removeEventListener() {
  },
  getComputedStyle() {
    return {
      getPropertyValue() {
        return "";
      }
    };
  },
  Image() {
  },
  Date() {
  },
  screen: {},
  setTimeout() {
  },
  clearTimeout() {
  },
  matchMedia() {
    return {};
  },
  requestAnimationFrame(callback) {
    if (typeof setTimeout === "undefined") {
      callback();
      return null;
    }
    return setTimeout(callback, 0);
  },
  cancelAnimationFrame(id) {
    if (typeof setTimeout === "undefined") {
      return;
    }
    clearTimeout(id);
  }
};
function getWindow() {
  const win = typeof window !== "undefined" ? window : {};
  extend$2(win, ssrWindow);
  return win;
}
function makeReactive(obj) {
  const proto = obj.__proto__;
  Object.defineProperty(obj, "__proto__", {
    get() {
      return proto;
    },
    set(value) {
      proto.__proto__ = value;
    }
  });
}
class Dom7 extends Array {
  constructor(items) {
    if (typeof items === "number") {
      super(items);
    } else {
      super(...items || []);
      makeReactive(this);
    }
  }
}
function arrayFlat(arr = []) {
  const res = [];
  arr.forEach((el) => {
    if (Array.isArray(el)) {
      res.push(...arrayFlat(el));
    } else {
      res.push(el);
    }
  });
  return res;
}
function arrayFilter(arr, callback) {
  return Array.prototype.filter.call(arr, callback);
}
function arrayUnique(arr) {
  const uniqueArray = [];
  for (let i = 0; i < arr.length; i += 1) {
    if (uniqueArray.indexOf(arr[i]) === -1)
      uniqueArray.push(arr[i]);
  }
  return uniqueArray;
}
function qsa(selector3, context3) {
  if (typeof selector3 !== "string") {
    return [selector3];
  }
  const a = [];
  const res = context3.querySelectorAll(selector3);
  for (let i = 0; i < res.length; i += 1) {
    a.push(res[i]);
  }
  return a;
}
function $$1(selector3, context3) {
  const window2 = getWindow();
  const document2 = getDocument();
  let arr = [];
  if (!context3 && selector3 instanceof Dom7) {
    return selector3;
  }
  if (!selector3) {
    return new Dom7(arr);
  }
  if (typeof selector3 === "string") {
    const html2 = selector3.trim();
    if (html2.indexOf("<") >= 0 && html2.indexOf(">") >= 0) {
      let toCreate = "div";
      if (html2.indexOf("<li") === 0)
        toCreate = "ul";
      if (html2.indexOf("<tr") === 0)
        toCreate = "tbody";
      if (html2.indexOf("<td") === 0 || html2.indexOf("<th") === 0)
        toCreate = "tr";
      if (html2.indexOf("<tbody") === 0)
        toCreate = "table";
      if (html2.indexOf("<option") === 0)
        toCreate = "select";
      const tempParent = document2.createElement(toCreate);
      tempParent.innerHTML = html2;
      for (let i = 0; i < tempParent.childNodes.length; i += 1) {
        arr.push(tempParent.childNodes[i]);
      }
    } else {
      arr = qsa(selector3.trim(), context3 || document2);
    }
  } else if (selector3.nodeType || selector3 === window2 || selector3 === document2) {
    arr.push(selector3);
  } else if (Array.isArray(selector3)) {
    if (selector3 instanceof Dom7)
      return selector3;
    arr = selector3;
  }
  return new Dom7(arrayUnique(arr));
}
$$1.fn = Dom7.prototype;
function addClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    el.classList.add(...classNames);
  });
  return this;
}
function removeClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    el.classList.remove(...classNames);
  });
  return this;
}
function toggleClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  this.forEach((el) => {
    classNames.forEach((className) => {
      el.classList.toggle(className);
    });
  });
}
function hasClass(...classes2) {
  const classNames = arrayFlat(classes2.map((c) => c.split(" ")));
  return arrayFilter(this, (el) => {
    return classNames.filter((className) => el.classList.contains(className)).length > 0;
  }).length > 0;
}
function attr(attrs, value) {
  if (arguments.length === 1 && typeof attrs === "string") {
    if (this[0])
      return this[0].getAttribute(attrs);
    return void 0;
  }
  for (let i = 0; i < this.length; i += 1) {
    if (arguments.length === 2) {
      this[i].setAttribute(attrs, value);
    } else {
      for (const attrName in attrs) {
        this[i][attrName] = attrs[attrName];
        this[i].setAttribute(attrName, attrs[attrName]);
      }
    }
  }
  return this;
}
function removeAttr(attr2) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].removeAttribute(attr2);
  }
  return this;
}
function transform(transform2) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transform = transform2;
  }
  return this;
}
function transition$1(duration) {
  for (let i = 0; i < this.length; i += 1) {
    this[i].style.transitionDuration = typeof duration !== "string" ? `${duration}ms` : duration;
  }
  return this;
}
function on(...args) {
  let [eventType, targetSelector, listener, capture] = args;
  if (typeof args[1] === "function") {
    [eventType, listener, capture] = args;
    targetSelector = void 0;
  }
  if (!capture)
    capture = false;
  function handleLiveEvent(e) {
    const target = e.target;
    if (!target)
      return;
    const eventData = e.target.dom7EventData || [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    if ($$1(target).is(targetSelector))
      listener.apply(target, eventData);
    else {
      const parents2 = $$1(target).parents();
      for (let k = 0; k < parents2.length; k += 1) {
        if ($$1(parents2[k]).is(targetSelector))
          listener.apply(parents2[k], eventData);
      }
    }
  }
  function handleEvent(e) {
    const eventData = e && e.target ? e.target.dom7EventData || [] : [];
    if (eventData.indexOf(e) < 0) {
      eventData.unshift(e);
    }
    listener.apply(this, eventData);
  }
  const events2 = eventType.split(" ");
  let j;
  for (let i = 0; i < this.length; i += 1) {
    const el = this[i];
    if (!targetSelector) {
      for (j = 0; j < events2.length; j += 1) {
        const event = events2[j];
        if (!el.dom7Listeners)
          el.dom7Listeners = {};
        if (!el.dom7Listeners[event])
          el.dom7Listeners[event] = [];
        el.dom7Listeners[event].push({
          listener,
          proxyListener: handleEvent
        });
        el.addEventListener(event, handleEvent, capture);
      }
    } else {
      for (j = 0; j < events2.length; j += 1) {
        const event = events2[j];
        if (!el.dom7LiveListeners)
          el.dom7LiveListeners = {};
        if (!el.dom7LiveListeners[event])
          el.dom7LiveListeners[event] = [];
        el.dom7LiveListeners[event].push({
          listener,
          proxyListener: handleLiveEvent
        });
        el.addEventListener(event, handleLiveEvent, capture);
      }
    }
  }
  return this;
}
function off(...args) {
  let [eventType, targetSelector, listener, capture] = args;
  if (typeof args[1] === "function") {
    [eventType, listener, capture] = args;
    targetSelector = void 0;
  }
  if (!capture)
    capture = false;
  const events2 = eventType.split(" ");
  for (let i = 0; i < events2.length; i += 1) {
    const event = events2[i];
    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      let handlers;
      if (!targetSelector && el.dom7Listeners) {
        handlers = el.dom7Listeners[event];
      } else if (targetSelector && el.dom7LiveListeners) {
        handlers = el.dom7LiveListeners[event];
      }
      if (handlers && handlers.length) {
        for (let k = handlers.length - 1; k >= 0; k -= 1) {
          const handler = handlers[k];
          if (listener && handler.listener === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (listener && handler.listener && handler.listener.dom7proxy && handler.listener.dom7proxy === listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          } else if (!listener) {
            el.removeEventListener(event, handler.proxyListener, capture);
            handlers.splice(k, 1);
          }
        }
      }
    }
  }
  return this;
}
function trigger(...args) {
  const window2 = getWindow();
  const events2 = args[0].split(" ");
  const eventData = args[1];
  for (let i = 0; i < events2.length; i += 1) {
    const event = events2[i];
    for (let j = 0; j < this.length; j += 1) {
      const el = this[j];
      if (window2.CustomEvent) {
        const evt = new window2.CustomEvent(event, {
          detail: eventData,
          bubbles: true,
          cancelable: true
        });
        el.dom7EventData = args.filter((data, dataIndex) => dataIndex > 0);
        el.dispatchEvent(evt);
        el.dom7EventData = [];
        delete el.dom7EventData;
      }
    }
  }
  return this;
}
function transitionEnd$1(callback) {
  const dom = this;
  function fireCallBack(e) {
    if (e.target !== this)
      return;
    callback.call(this, e);
    dom.off("transitionend", fireCallBack);
  }
  if (callback) {
    dom.on("transitionend", fireCallBack);
  }
  return this;
}
function outerWidth(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles2 = this.styles();
      return this[0].offsetWidth + parseFloat(styles2.getPropertyValue("margin-right")) + parseFloat(styles2.getPropertyValue("margin-left"));
    }
    return this[0].offsetWidth;
  }
  return null;
}
function outerHeight(includeMargins) {
  if (this.length > 0) {
    if (includeMargins) {
      const styles2 = this.styles();
      return this[0].offsetHeight + parseFloat(styles2.getPropertyValue("margin-top")) + parseFloat(styles2.getPropertyValue("margin-bottom"));
    }
    return this[0].offsetHeight;
  }
  return null;
}
function offset() {
  if (this.length > 0) {
    const window2 = getWindow();
    const document2 = getDocument();
    const el = this[0];
    const box = el.getBoundingClientRect();
    const body = document2.body;
    const clientTop = el.clientTop || body.clientTop || 0;
    const clientLeft = el.clientLeft || body.clientLeft || 0;
    const scrollTop = el === window2 ? window2.scrollY : el.scrollTop;
    const scrollLeft = el === window2 ? window2.scrollX : el.scrollLeft;
    return {
      top: box.top + scrollTop - clientTop,
      left: box.left + scrollLeft - clientLeft
    };
  }
  return null;
}
function styles() {
  const window2 = getWindow();
  if (this[0])
    return window2.getComputedStyle(this[0], null);
  return {};
}
function css(props, value) {
  const window2 = getWindow();
  let i;
  if (arguments.length === 1) {
    if (typeof props === "string") {
      if (this[0])
        return window2.getComputedStyle(this[0], null).getPropertyValue(props);
    } else {
      for (i = 0; i < this.length; i += 1) {
        for (const prop in props) {
          this[i].style[prop] = props[prop];
        }
      }
      return this;
    }
  }
  if (arguments.length === 2 && typeof props === "string") {
    for (i = 0; i < this.length; i += 1) {
      this[i].style[props] = value;
    }
    return this;
  }
  return this;
}
function each(callback) {
  if (!callback)
    return this;
  this.forEach((el, index2) => {
    callback.apply(el, [el, index2]);
  });
  return this;
}
function filter(callback) {
  const result = arrayFilter(this, callback);
  return $$1(result);
}
function html(html2) {
  if (typeof html2 === "undefined") {
    return this[0] ? this[0].innerHTML : null;
  }
  for (let i = 0; i < this.length; i += 1) {
    this[i].innerHTML = html2;
  }
  return this;
}
function text(text2) {
  if (typeof text2 === "undefined") {
    return this[0] ? this[0].textContent.trim() : null;
  }
  for (let i = 0; i < this.length; i += 1) {
    this[i].textContent = text2;
  }
  return this;
}
function is(selector3) {
  const window2 = getWindow();
  const document2 = getDocument();
  const el = this[0];
  let compareWith;
  let i;
  if (!el || typeof selector3 === "undefined")
    return false;
  if (typeof selector3 === "string") {
    if (el.matches)
      return el.matches(selector3);
    if (el.webkitMatchesSelector)
      return el.webkitMatchesSelector(selector3);
    if (el.msMatchesSelector)
      return el.msMatchesSelector(selector3);
    compareWith = $$1(selector3);
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el)
        return true;
    }
    return false;
  }
  if (selector3 === document2) {
    return el === document2;
  }
  if (selector3 === window2) {
    return el === window2;
  }
  if (selector3.nodeType || selector3 instanceof Dom7) {
    compareWith = selector3.nodeType ? [selector3] : selector3;
    for (i = 0; i < compareWith.length; i += 1) {
      if (compareWith[i] === el)
        return true;
    }
    return false;
  }
  return false;
}
function index() {
  let child = this[0];
  let i;
  if (child) {
    i = 0;
    while ((child = child.previousSibling) !== null) {
      if (child.nodeType === 1)
        i += 1;
    }
    return i;
  }
  return void 0;
}
function eq(index2) {
  if (typeof index2 === "undefined")
    return this;
  const length = this.length;
  if (index2 > length - 1) {
    return $$1([]);
  }
  if (index2 < 0) {
    const returnIndex = length + index2;
    if (returnIndex < 0)
      return $$1([]);
    return $$1([this[returnIndex]]);
  }
  return $$1([this[index2]]);
}
function append(...els) {
  let newChild;
  const document2 = getDocument();
  for (let k = 0; k < els.length; k += 1) {
    newChild = els[k];
    for (let i = 0; i < this.length; i += 1) {
      if (typeof newChild === "string") {
        const tempDiv = document2.createElement("div");
        tempDiv.innerHTML = newChild;
        while (tempDiv.firstChild) {
          this[i].appendChild(tempDiv.firstChild);
        }
      } else if (newChild instanceof Dom7) {
        for (let j = 0; j < newChild.length; j += 1) {
          this[i].appendChild(newChild[j]);
        }
      } else {
        this[i].appendChild(newChild);
      }
    }
  }
  return this;
}
function prepend(newChild) {
  const document2 = getDocument();
  let i;
  let j;
  for (i = 0; i < this.length; i += 1) {
    if (typeof newChild === "string") {
      const tempDiv = document2.createElement("div");
      tempDiv.innerHTML = newChild;
      for (j = tempDiv.childNodes.length - 1; j >= 0; j -= 1) {
        this[i].insertBefore(tempDiv.childNodes[j], this[i].childNodes[0]);
      }
    } else if (newChild instanceof Dom7) {
      for (j = 0; j < newChild.length; j += 1) {
        this[i].insertBefore(newChild[j], this[i].childNodes[0]);
      }
    } else {
      this[i].insertBefore(newChild, this[i].childNodes[0]);
    }
  }
  return this;
}
function next(selector3) {
  if (this.length > 0) {
    if (selector3) {
      if (this[0].nextElementSibling && $$1(this[0].nextElementSibling).is(selector3)) {
        return $$1([this[0].nextElementSibling]);
      }
      return $$1([]);
    }
    if (this[0].nextElementSibling)
      return $$1([this[0].nextElementSibling]);
    return $$1([]);
  }
  return $$1([]);
}
function nextAll(selector3) {
  const nextEls = [];
  let el = this[0];
  if (!el)
    return $$1([]);
  while (el.nextElementSibling) {
    const next2 = el.nextElementSibling;
    if (selector3) {
      if ($$1(next2).is(selector3))
        nextEls.push(next2);
    } else
      nextEls.push(next2);
    el = next2;
  }
  return $$1(nextEls);
}
function prev(selector3) {
  if (this.length > 0) {
    const el = this[0];
    if (selector3) {
      if (el.previousElementSibling && $$1(el.previousElementSibling).is(selector3)) {
        return $$1([el.previousElementSibling]);
      }
      return $$1([]);
    }
    if (el.previousElementSibling)
      return $$1([el.previousElementSibling]);
    return $$1([]);
  }
  return $$1([]);
}
function prevAll(selector3) {
  const prevEls = [];
  let el = this[0];
  if (!el)
    return $$1([]);
  while (el.previousElementSibling) {
    const prev2 = el.previousElementSibling;
    if (selector3) {
      if ($$1(prev2).is(selector3))
        prevEls.push(prev2);
    } else
      prevEls.push(prev2);
    el = prev2;
  }
  return $$1(prevEls);
}
function parent(selector3) {
  const parents2 = [];
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode !== null) {
      if (selector3) {
        if ($$1(this[i].parentNode).is(selector3))
          parents2.push(this[i].parentNode);
      } else {
        parents2.push(this[i].parentNode);
      }
    }
  }
  return $$1(parents2);
}
function parents(selector3) {
  const parents2 = [];
  for (let i = 0; i < this.length; i += 1) {
    let parent2 = this[i].parentNode;
    while (parent2) {
      if (selector3) {
        if ($$1(parent2).is(selector3))
          parents2.push(parent2);
      } else {
        parents2.push(parent2);
      }
      parent2 = parent2.parentNode;
    }
  }
  return $$1(parents2);
}
function closest(selector3) {
  let closest2 = this;
  if (typeof selector3 === "undefined") {
    return $$1([]);
  }
  if (!closest2.is(selector3)) {
    closest2 = closest2.parents(selector3).eq(0);
  }
  return closest2;
}
function find$1(selector3) {
  const foundElements = [];
  for (let i = 0; i < this.length; i += 1) {
    const found = this[i].querySelectorAll(selector3);
    for (let j = 0; j < found.length; j += 1) {
      foundElements.push(found[j]);
    }
  }
  return $$1(foundElements);
}
function children(selector3) {
  const children2 = [];
  for (let i = 0; i < this.length; i += 1) {
    const childNodes = this[i].children;
    for (let j = 0; j < childNodes.length; j += 1) {
      if (!selector3 || $$1(childNodes[j]).is(selector3)) {
        children2.push(childNodes[j]);
      }
    }
  }
  return $$1(children2);
}
function remove() {
  for (let i = 0; i < this.length; i += 1) {
    if (this[i].parentNode)
      this[i].parentNode.removeChild(this[i]);
  }
  return this;
}
const Methods = {
  addClass,
  removeClass,
  hasClass,
  toggleClass,
  attr,
  removeAttr,
  transform,
  transition: transition$1,
  on,
  off,
  trigger,
  transitionEnd: transitionEnd$1,
  outerWidth,
  outerHeight,
  styles,
  offset,
  css,
  each,
  html,
  text,
  is,
  index,
  eq,
  append,
  prepend,
  next,
  nextAll,
  prev,
  prevAll,
  parent,
  parents,
  closest,
  find: find$1,
  children,
  filter,
  remove
};
Object.keys(Methods).forEach((methodName) => {
  Object.defineProperty($$1.fn, methodName, {
    value: Methods[methodName],
    writable: true
  });
});
function deleteProps(obj) {
  const object = obj;
  Object.keys(object).forEach((key) => {
    try {
      object[key] = null;
    } catch (e) {
    }
    try {
      delete object[key];
    } catch (e) {
    }
  });
}
function nextTick(callback, delay = 0) {
  return setTimeout(callback, delay);
}
function now() {
  return Date.now();
}
function getComputedStyle$1(el) {
  const window2 = getWindow();
  let style2;
  if (window2.getComputedStyle) {
    style2 = window2.getComputedStyle(el, null);
  }
  if (!style2 && el.currentStyle) {
    style2 = el.currentStyle;
  }
  if (!style2) {
    style2 = el.style;
  }
  return style2;
}
function getTranslate(el, axis = "x") {
  const window2 = getWindow();
  let matrix;
  let curTransform;
  let transformMatrix;
  const curStyle = getComputedStyle$1(el);
  if (window2.WebKitCSSMatrix) {
    curTransform = curStyle.transform || curStyle.webkitTransform;
    if (curTransform.split(",").length > 6) {
      curTransform = curTransform.split(", ").map((a) => a.replace(",", ".")).join(", ");
    }
    transformMatrix = new window2.WebKitCSSMatrix(curTransform === "none" ? "" : curTransform);
  } else {
    transformMatrix = curStyle.MozTransform || curStyle.OTransform || curStyle.MsTransform || curStyle.msTransform || curStyle.transform || curStyle.getPropertyValue("transform").replace("translate(", "matrix(1, 0, 0, 1,");
    matrix = transformMatrix.toString().split(",");
  }
  if (axis === "x") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m41;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[12]);
    else
      curTransform = parseFloat(matrix[4]);
  }
  if (axis === "y") {
    if (window2.WebKitCSSMatrix)
      curTransform = transformMatrix.m42;
    else if (matrix.length === 16)
      curTransform = parseFloat(matrix[13]);
    else
      curTransform = parseFloat(matrix[5]);
  }
  return curTransform || 0;
}
function isObject$2(o) {
  return typeof o === "object" && o !== null && o.constructor && Object.prototype.toString.call(o).slice(8, -1) === "Object";
}
function isNode(node) {
  if (typeof window !== "undefined" && typeof window.HTMLElement !== "undefined") {
    return node instanceof HTMLElement;
  }
  return node && (node.nodeType === 1 || node.nodeType === 11);
}
function extend$1(...args) {
  const to = Object(args[0]);
  const noExtend = ["__proto__", "constructor", "prototype"];
  for (let i = 1; i < args.length; i += 1) {
    const nextSource = args[i];
    if (nextSource !== void 0 && nextSource !== null && !isNode(nextSource)) {
      const keysArray = Object.keys(Object(nextSource)).filter((key) => noExtend.indexOf(key) < 0);
      for (let nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex += 1) {
        const nextKey = keysArray[nextIndex];
        const desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
        if (desc !== void 0 && desc.enumerable) {
          if (isObject$2(to[nextKey]) && isObject$2(nextSource[nextKey])) {
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else if (!isObject$2(to[nextKey]) && isObject$2(nextSource[nextKey])) {
            to[nextKey] = {};
            if (nextSource[nextKey].__swiper__) {
              to[nextKey] = nextSource[nextKey];
            } else {
              extend$1(to[nextKey], nextSource[nextKey]);
            }
          } else {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
    }
  }
  return to;
}
function setCSSProperty(el, varName, varValue) {
  el.style.setProperty(varName, varValue);
}
function animateCSSModeScroll({
  swiper: swiper2,
  targetPosition,
  side
}) {
  const window2 = getWindow();
  const startPosition = -swiper2.translate;
  let startTime = null;
  let time;
  const duration = swiper2.params.speed;
  swiper2.wrapperEl.style.scrollSnapType = "none";
  window2.cancelAnimationFrame(swiper2.cssModeFrameID);
  const dir = targetPosition > startPosition ? "next" : "prev";
  const isOutOfBound = (current, target) => {
    return dir === "next" && current >= target || dir === "prev" && current <= target;
  };
  const animate2 = () => {
    time = (/* @__PURE__ */ new Date()).getTime();
    if (startTime === null) {
      startTime = time;
    }
    const progress = Math.max(Math.min((time - startTime) / duration, 1), 0);
    const easeProgress = 0.5 - Math.cos(progress * Math.PI) / 2;
    let currentPosition = startPosition + easeProgress * (targetPosition - startPosition);
    if (isOutOfBound(currentPosition, targetPosition)) {
      currentPosition = targetPosition;
    }
    swiper2.wrapperEl.scrollTo({
      [side]: currentPosition
    });
    if (isOutOfBound(currentPosition, targetPosition)) {
      swiper2.wrapperEl.style.overflow = "hidden";
      swiper2.wrapperEl.style.scrollSnapType = "";
      setTimeout(() => {
        swiper2.wrapperEl.style.overflow = "";
        swiper2.wrapperEl.scrollTo({
          [side]: currentPosition
        });
      });
      window2.cancelAnimationFrame(swiper2.cssModeFrameID);
      return;
    }
    swiper2.cssModeFrameID = window2.requestAnimationFrame(animate2);
  };
  animate2();
}
let support;
function calcSupport() {
  const window2 = getWindow();
  const document2 = getDocument();
  return {
    smoothScroll: document2.documentElement && "scrollBehavior" in document2.documentElement.style,
    touch: !!("ontouchstart" in window2 || window2.DocumentTouch && document2 instanceof window2.DocumentTouch),
    passiveListener: function checkPassiveListener() {
      let supportsPassive = false;
      try {
        const opts = Object.defineProperty({}, "passive", {
          // eslint-disable-next-line
          get() {
            supportsPassive = true;
          }
        });
        window2.addEventListener("testPassiveListener", null, opts);
      } catch (e) {
      }
      return supportsPassive;
    }(),
    gestures: function checkGestures() {
      return "ongesturestart" in window2;
    }()
  };
}
function getSupport() {
  if (!support) {
    support = calcSupport();
  }
  return support;
}
let deviceCached;
function calcDevice({
  userAgent
} = {}) {
  const support2 = getSupport();
  const window2 = getWindow();
  const platform2 = window2.navigator.platform;
  const ua = userAgent || window2.navigator.userAgent;
  const device = {
    ios: false,
    android: false
  };
  const screenWidth = window2.screen.width;
  const screenHeight = window2.screen.height;
  const android = ua.match(/(Android);?[\s\/]+([\d.]+)?/);
  let ipad = ua.match(/(iPad).*OS\s([\d_]+)/);
  const ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/);
  const iphone = !ipad && ua.match(/(iPhone\sOS|iOS)\s([\d_]+)/);
  const windows = platform2 === "Win32";
  let macos = platform2 === "MacIntel";
  const iPadScreens = ["1024x1366", "1366x1024", "834x1194", "1194x834", "834x1112", "1112x834", "768x1024", "1024x768", "820x1180", "1180x820", "810x1080", "1080x810"];
  if (!ipad && macos && support2.touch && iPadScreens.indexOf(`${screenWidth}x${screenHeight}`) >= 0) {
    ipad = ua.match(/(Version)\/([\d.]+)/);
    if (!ipad)
      ipad = [0, 1, "13_0_0"];
    macos = false;
  }
  if (android && !windows) {
    device.os = "android";
    device.android = true;
  }
  if (ipad || iphone || ipod) {
    device.os = "ios";
    device.ios = true;
  }
  return device;
}
function getDevice(overrides = {}) {
  if (!deviceCached) {
    deviceCached = calcDevice(overrides);
  }
  return deviceCached;
}
let browser$1;
function calcBrowser() {
  const window2 = getWindow();
  function isSafari() {
    const ua = window2.navigator.userAgent.toLowerCase();
    return ua.indexOf("safari") >= 0 && ua.indexOf("chrome") < 0 && ua.indexOf("android") < 0;
  }
  return {
    isSafari: isSafari(),
    isWebView: /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(window2.navigator.userAgent)
  };
}
function getBrowser() {
  if (!browser$1) {
    browser$1 = calcBrowser();
  }
  return browser$1;
}
function Resize({
  swiper: swiper2,
  on: on2,
  emit
}) {
  const window2 = getWindow();
  let observer = null;
  let animationFrame = null;
  const resizeHandler = () => {
    if (!swiper2 || swiper2.destroyed || !swiper2.initialized)
      return;
    emit("beforeResize");
    emit("resize");
  };
  const createObserver = () => {
    if (!swiper2 || swiper2.destroyed || !swiper2.initialized)
      return;
    observer = new ResizeObserver((entries) => {
      animationFrame = window2.requestAnimationFrame(() => {
        const {
          width,
          height
        } = swiper2;
        let newWidth = width;
        let newHeight = height;
        entries.forEach(({
          contentBoxSize,
          contentRect,
          target
        }) => {
          if (target && target !== swiper2.el)
            return;
          newWidth = contentRect ? contentRect.width : (contentBoxSize[0] || contentBoxSize).inlineSize;
          newHeight = contentRect ? contentRect.height : (contentBoxSize[0] || contentBoxSize).blockSize;
        });
        if (newWidth !== width || newHeight !== height) {
          resizeHandler();
        }
      });
    });
    observer.observe(swiper2.el);
  };
  const removeObserver = () => {
    if (animationFrame) {
      window2.cancelAnimationFrame(animationFrame);
    }
    if (observer && observer.unobserve && swiper2.el) {
      observer.unobserve(swiper2.el);
      observer = null;
    }
  };
  const orientationChangeHandler = () => {
    if (!swiper2 || swiper2.destroyed || !swiper2.initialized)
      return;
    emit("orientationchange");
  };
  on2("init", () => {
    if (swiper2.params.resizeObserver && typeof window2.ResizeObserver !== "undefined") {
      createObserver();
      return;
    }
    window2.addEventListener("resize", resizeHandler);
    window2.addEventListener("orientationchange", orientationChangeHandler);
  });
  on2("destroy", () => {
    removeObserver();
    window2.removeEventListener("resize", resizeHandler);
    window2.removeEventListener("orientationchange", orientationChangeHandler);
  });
}
function Observer({
  swiper: swiper2,
  extendParams,
  on: on2,
  emit
}) {
  const observers = [];
  const window2 = getWindow();
  const attach = (target, options = {}) => {
    const ObserverFunc = window2.MutationObserver || window2.WebkitMutationObserver;
    const observer = new ObserverFunc((mutations) => {
      if (mutations.length === 1) {
        emit("observerUpdate", mutations[0]);
        return;
      }
      const observerUpdate = function observerUpdate2() {
        emit("observerUpdate", mutations[0]);
      };
      if (window2.requestAnimationFrame) {
        window2.requestAnimationFrame(observerUpdate);
      } else {
        window2.setTimeout(observerUpdate, 0);
      }
    });
    observer.observe(target, {
      attributes: typeof options.attributes === "undefined" ? true : options.attributes,
      childList: typeof options.childList === "undefined" ? true : options.childList,
      characterData: typeof options.characterData === "undefined" ? true : options.characterData
    });
    observers.push(observer);
  };
  const init4 = () => {
    if (!swiper2.params.observer)
      return;
    if (swiper2.params.observeParents) {
      const containerParents = swiper2.$el.parents();
      for (let i = 0; i < containerParents.length; i += 1) {
        attach(containerParents[i]);
      }
    }
    attach(swiper2.$el[0], {
      childList: swiper2.params.observeSlideChildren
    });
    attach(swiper2.$wrapperEl[0], {
      attributes: false
    });
  };
  const destroy = () => {
    observers.forEach((observer) => {
      observer.disconnect();
    });
    observers.splice(0, observers.length);
  };
  extendParams({
    observer: false,
    observeParents: false,
    observeSlideChildren: false
  });
  on2("init", init4);
  on2("destroy", destroy);
}
const eventsEmitter = {
  on(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    events2.split(" ").forEach((event) => {
      if (!self2.eventsListeners[event])
        self2.eventsListeners[event] = [];
      self2.eventsListeners[event][method](handler);
    });
    return self2;
  },
  once(events2, handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    function onceHandler(...args) {
      self2.off(events2, onceHandler);
      if (onceHandler.__emitterProxy) {
        delete onceHandler.__emitterProxy;
      }
      handler.apply(self2, args);
    }
    onceHandler.__emitterProxy = handler;
    return self2.on(events2, onceHandler, priority);
  },
  onAny(handler, priority) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (typeof handler !== "function")
      return self2;
    const method = priority ? "unshift" : "push";
    if (self2.eventsAnyListeners.indexOf(handler) < 0) {
      self2.eventsAnyListeners[method](handler);
    }
    return self2;
  },
  offAny(handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsAnyListeners)
      return self2;
    const index2 = self2.eventsAnyListeners.indexOf(handler);
    if (index2 >= 0) {
      self2.eventsAnyListeners.splice(index2, 1);
    }
    return self2;
  },
  off(events2, handler) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    events2.split(" ").forEach((event) => {
      if (typeof handler === "undefined") {
        self2.eventsListeners[event] = [];
      } else if (self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler, index2) => {
          if (eventHandler === handler || eventHandler.__emitterProxy && eventHandler.__emitterProxy === handler) {
            self2.eventsListeners[event].splice(index2, 1);
          }
        });
      }
    });
    return self2;
  },
  emit(...args) {
    const self2 = this;
    if (!self2.eventsListeners || self2.destroyed)
      return self2;
    if (!self2.eventsListeners)
      return self2;
    let events2;
    let data;
    let context3;
    if (typeof args[0] === "string" || Array.isArray(args[0])) {
      events2 = args[0];
      data = args.slice(1, args.length);
      context3 = self2;
    } else {
      events2 = args[0].events;
      data = args[0].data;
      context3 = args[0].context || self2;
    }
    data.unshift(context3);
    const eventsArray = Array.isArray(events2) ? events2 : events2.split(" ");
    eventsArray.forEach((event) => {
      if (self2.eventsAnyListeners && self2.eventsAnyListeners.length) {
        self2.eventsAnyListeners.forEach((eventHandler) => {
          eventHandler.apply(context3, [event, ...data]);
        });
      }
      if (self2.eventsListeners && self2.eventsListeners[event]) {
        self2.eventsListeners[event].forEach((eventHandler) => {
          eventHandler.apply(context3, data);
        });
      }
    });
    return self2;
  }
};
function updateSize() {
  const swiper2 = this;
  let width;
  let height;
  const $el = swiper2.$el;
  if (typeof swiper2.params.width !== "undefined" && swiper2.params.width !== null) {
    width = swiper2.params.width;
  } else {
    width = $el[0].clientWidth;
  }
  if (typeof swiper2.params.height !== "undefined" && swiper2.params.height !== null) {
    height = swiper2.params.height;
  } else {
    height = $el[0].clientHeight;
  }
  if (width === 0 && swiper2.isHorizontal() || height === 0 && swiper2.isVertical()) {
    return;
  }
  width = width - parseInt($el.css("padding-left") || 0, 10) - parseInt($el.css("padding-right") || 0, 10);
  height = height - parseInt($el.css("padding-top") || 0, 10) - parseInt($el.css("padding-bottom") || 0, 10);
  if (Number.isNaN(width))
    width = 0;
  if (Number.isNaN(height))
    height = 0;
  Object.assign(swiper2, {
    width,
    height,
    size: swiper2.isHorizontal() ? width : height
  });
}
function updateSlides() {
  const swiper2 = this;
  function getDirectionLabel(property) {
    if (swiper2.isHorizontal()) {
      return property;
    }
    return {
      "width": "height",
      "margin-top": "margin-left",
      "margin-bottom ": "margin-right",
      "margin-left": "margin-top",
      "margin-right": "margin-bottom",
      "padding-left": "padding-top",
      "padding-right": "padding-bottom",
      "marginRight": "marginBottom"
    }[property];
  }
  function getDirectionPropertyValue(node, label) {
    return parseFloat(node.getPropertyValue(getDirectionLabel(label)) || 0);
  }
  const params = swiper2.params;
  const {
    $wrapperEl,
    size: swiperSize,
    rtlTranslate: rtl,
    wrongRTL
  } = swiper2;
  const isVirtual = swiper2.virtual && params.virtual.enabled;
  const previousSlidesLength = isVirtual ? swiper2.virtual.slides.length : swiper2.slides.length;
  const slides = $wrapperEl.children(`.${swiper2.params.slideClass}`);
  const slidesLength = isVirtual ? swiper2.virtual.slides.length : slides.length;
  let snapGrid = [];
  const slidesGrid = [];
  const slidesSizesGrid = [];
  let offsetBefore = params.slidesOffsetBefore;
  if (typeof offsetBefore === "function") {
    offsetBefore = params.slidesOffsetBefore.call(swiper2);
  }
  let offsetAfter = params.slidesOffsetAfter;
  if (typeof offsetAfter === "function") {
    offsetAfter = params.slidesOffsetAfter.call(swiper2);
  }
  const previousSnapGridLength = swiper2.snapGrid.length;
  const previousSlidesGridLength = swiper2.slidesGrid.length;
  let spaceBetween = params.spaceBetween;
  let slidePosition = -offsetBefore;
  let prevSlideSize = 0;
  let index2 = 0;
  if (typeof swiperSize === "undefined") {
    return;
  }
  if (typeof spaceBetween === "string" && spaceBetween.indexOf("%") >= 0) {
    spaceBetween = parseFloat(spaceBetween.replace("%", "")) / 100 * swiperSize;
  }
  swiper2.virtualSize = -spaceBetween;
  if (rtl)
    slides.css({
      marginLeft: "",
      marginBottom: "",
      marginTop: ""
    });
  else
    slides.css({
      marginRight: "",
      marginBottom: "",
      marginTop: ""
    });
  if (params.centeredSlides && params.cssMode) {
    setCSSProperty(swiper2.wrapperEl, "--swiper-centered-offset-before", "");
    setCSSProperty(swiper2.wrapperEl, "--swiper-centered-offset-after", "");
  }
  const gridEnabled = params.grid && params.grid.rows > 1 && swiper2.grid;
  if (gridEnabled) {
    swiper2.grid.initSlides(slidesLength);
  }
  let slideSize;
  const shouldResetSlideSize = params.slidesPerView === "auto" && params.breakpoints && Object.keys(params.breakpoints).filter((key) => {
    return typeof params.breakpoints[key].slidesPerView !== "undefined";
  }).length > 0;
  for (let i = 0; i < slidesLength; i += 1) {
    slideSize = 0;
    const slide2 = slides.eq(i);
    if (gridEnabled) {
      swiper2.grid.updateSlide(i, slide2, slidesLength, getDirectionLabel);
    }
    if (slide2.css("display") === "none")
      continue;
    if (params.slidesPerView === "auto") {
      if (shouldResetSlideSize) {
        slides[i].style[getDirectionLabel("width")] = ``;
      }
      const slideStyles = getComputedStyle(slide2[0]);
      const currentTransform = slide2[0].style.transform;
      const currentWebKitTransform = slide2[0].style.webkitTransform;
      if (currentTransform) {
        slide2[0].style.transform = "none";
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = "none";
      }
      if (params.roundLengths) {
        slideSize = swiper2.isHorizontal() ? slide2.outerWidth(true) : slide2.outerHeight(true);
      } else {
        const width = getDirectionPropertyValue(slideStyles, "width");
        const paddingLeft = getDirectionPropertyValue(slideStyles, "padding-left");
        const paddingRight = getDirectionPropertyValue(slideStyles, "padding-right");
        const marginLeft = getDirectionPropertyValue(slideStyles, "margin-left");
        const marginRight = getDirectionPropertyValue(slideStyles, "margin-right");
        const boxSizing = slideStyles.getPropertyValue("box-sizing");
        if (boxSizing && boxSizing === "border-box") {
          slideSize = width + marginLeft + marginRight;
        } else {
          const {
            clientWidth,
            offsetWidth
          } = slide2[0];
          slideSize = width + paddingLeft + paddingRight + marginLeft + marginRight + (offsetWidth - clientWidth);
        }
      }
      if (currentTransform) {
        slide2[0].style.transform = currentTransform;
      }
      if (currentWebKitTransform) {
        slide2[0].style.webkitTransform = currentWebKitTransform;
      }
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
    } else {
      slideSize = (swiperSize - (params.slidesPerView - 1) * spaceBetween) / params.slidesPerView;
      if (params.roundLengths)
        slideSize = Math.floor(slideSize);
      if (slides[i]) {
        slides[i].style[getDirectionLabel("width")] = `${slideSize}px`;
      }
    }
    if (slides[i]) {
      slides[i].swiperSlideSize = slideSize;
    }
    slidesSizesGrid.push(slideSize);
    if (params.centeredSlides) {
      slidePosition = slidePosition + slideSize / 2 + prevSlideSize / 2 + spaceBetween;
      if (prevSlideSize === 0 && i !== 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (i === 0)
        slidePosition = slidePosition - swiperSize / 2 - spaceBetween;
      if (Math.abs(slidePosition) < 1 / 1e3)
        slidePosition = 0;
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if (index2 % params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
    } else {
      if (params.roundLengths)
        slidePosition = Math.floor(slidePosition);
      if ((index2 - Math.min(swiper2.params.slidesPerGroupSkip, index2)) % swiper2.params.slidesPerGroup === 0)
        snapGrid.push(slidePosition);
      slidesGrid.push(slidePosition);
      slidePosition = slidePosition + slideSize + spaceBetween;
    }
    swiper2.virtualSize += slideSize + spaceBetween;
    prevSlideSize = slideSize;
    index2 += 1;
  }
  swiper2.virtualSize = Math.max(swiper2.virtualSize, swiperSize) + offsetAfter;
  if (rtl && wrongRTL && (params.effect === "slide" || params.effect === "coverflow")) {
    $wrapperEl.css({
      width: `${swiper2.virtualSize + params.spaceBetween}px`
    });
  }
  if (params.setWrapperSize) {
    $wrapperEl.css({
      [getDirectionLabel("width")]: `${swiper2.virtualSize + params.spaceBetween}px`
    });
  }
  if (gridEnabled) {
    swiper2.grid.updateWrapperSize(slideSize, snapGrid, getDirectionLabel);
  }
  if (!params.centeredSlides) {
    const newSlidesGrid = [];
    for (let i = 0; i < snapGrid.length; i += 1) {
      let slidesGridItem = snapGrid[i];
      if (params.roundLengths)
        slidesGridItem = Math.floor(slidesGridItem);
      if (snapGrid[i] <= swiper2.virtualSize - swiperSize) {
        newSlidesGrid.push(slidesGridItem);
      }
    }
    snapGrid = newSlidesGrid;
    if (Math.floor(swiper2.virtualSize - swiperSize) - Math.floor(snapGrid[snapGrid.length - 1]) > 1) {
      snapGrid.push(swiper2.virtualSize - swiperSize);
    }
  }
  if (snapGrid.length === 0)
    snapGrid = [0];
  if (params.spaceBetween !== 0) {
    const key = swiper2.isHorizontal() && rtl ? "marginLeft" : getDirectionLabel("marginRight");
    slides.filter((_, slideIndex) => {
      if (!params.cssMode)
        return true;
      if (slideIndex === slides.length - 1) {
        return false;
      }
      return true;
    }).css({
      [key]: `${spaceBetween}px`
    });
  }
  if (params.centeredSlides && params.centeredSlidesBounds) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    const maxSnap = allSlidesSize - swiperSize;
    snapGrid = snapGrid.map((snap3) => {
      if (snap3 < 0)
        return -offsetBefore;
      if (snap3 > maxSnap)
        return maxSnap + offsetAfter;
      return snap3;
    });
  }
  if (params.centerInsufficientSlides) {
    let allSlidesSize = 0;
    slidesSizesGrid.forEach((slideSizeValue) => {
      allSlidesSize += slideSizeValue + (params.spaceBetween ? params.spaceBetween : 0);
    });
    allSlidesSize -= params.spaceBetween;
    if (allSlidesSize < swiperSize) {
      const allSlidesOffset = (swiperSize - allSlidesSize) / 2;
      snapGrid.forEach((snap3, snapIndex) => {
        snapGrid[snapIndex] = snap3 - allSlidesOffset;
      });
      slidesGrid.forEach((snap3, snapIndex) => {
        slidesGrid[snapIndex] = snap3 + allSlidesOffset;
      });
    }
  }
  Object.assign(swiper2, {
    slides,
    snapGrid,
    slidesGrid,
    slidesSizesGrid
  });
  if (params.centeredSlides && params.cssMode && !params.centeredSlidesBounds) {
    setCSSProperty(swiper2.wrapperEl, "--swiper-centered-offset-before", `${-snapGrid[0]}px`);
    setCSSProperty(swiper2.wrapperEl, "--swiper-centered-offset-after", `${swiper2.size / 2 - slidesSizesGrid[slidesSizesGrid.length - 1] / 2}px`);
    const addToSnapGrid = -swiper2.snapGrid[0];
    const addToSlidesGrid = -swiper2.slidesGrid[0];
    swiper2.snapGrid = swiper2.snapGrid.map((v) => v + addToSnapGrid);
    swiper2.slidesGrid = swiper2.slidesGrid.map((v) => v + addToSlidesGrid);
  }
  if (slidesLength !== previousSlidesLength) {
    swiper2.emit("slidesLengthChange");
  }
  if (snapGrid.length !== previousSnapGridLength) {
    if (swiper2.params.watchOverflow)
      swiper2.checkOverflow();
    swiper2.emit("snapGridLengthChange");
  }
  if (slidesGrid.length !== previousSlidesGridLength) {
    swiper2.emit("slidesGridLengthChange");
  }
  if (params.watchSlidesProgress) {
    swiper2.updateSlidesOffset();
  }
  if (!isVirtual && !params.cssMode && (params.effect === "slide" || params.effect === "fade")) {
    const backFaceHiddenClass = `${params.containerModifierClass}backface-hidden`;
    const hasClassBackfaceClassAdded = swiper2.$el.hasClass(backFaceHiddenClass);
    if (slidesLength <= params.maxBackfaceHiddenSlides) {
      if (!hasClassBackfaceClassAdded)
        swiper2.$el.addClass(backFaceHiddenClass);
    } else if (hasClassBackfaceClassAdded) {
      swiper2.$el.removeClass(backFaceHiddenClass);
    }
  }
}
function updateAutoHeight(speed) {
  const swiper2 = this;
  const activeSlides = [];
  const isVirtual = swiper2.virtual && swiper2.params.virtual.enabled;
  let newHeight = 0;
  let i;
  if (typeof speed === "number") {
    swiper2.setTransition(speed);
  } else if (speed === true) {
    swiper2.setTransition(swiper2.params.speed);
  }
  const getSlideByIndex = (index2) => {
    if (isVirtual) {
      return swiper2.slides.filter((el) => parseInt(el.getAttribute("data-swiper-slide-index"), 10) === index2)[0];
    }
    return swiper2.slides.eq(index2)[0];
  };
  if (swiper2.params.slidesPerView !== "auto" && swiper2.params.slidesPerView > 1) {
    if (swiper2.params.centeredSlides) {
      (swiper2.visibleSlides || $$1([])).each((slide2) => {
        activeSlides.push(slide2);
      });
    } else {
      for (i = 0; i < Math.ceil(swiper2.params.slidesPerView); i += 1) {
        const index2 = swiper2.activeIndex + i;
        if (index2 > swiper2.slides.length && !isVirtual)
          break;
        activeSlides.push(getSlideByIndex(index2));
      }
    }
  } else {
    activeSlides.push(getSlideByIndex(swiper2.activeIndex));
  }
  for (i = 0; i < activeSlides.length; i += 1) {
    if (typeof activeSlides[i] !== "undefined") {
      const height = activeSlides[i].offsetHeight;
      newHeight = height > newHeight ? height : newHeight;
    }
  }
  if (newHeight || newHeight === 0)
    swiper2.$wrapperEl.css("height", `${newHeight}px`);
}
function updateSlidesOffset() {
  const swiper2 = this;
  const slides = swiper2.slides;
  for (let i = 0; i < slides.length; i += 1) {
    slides[i].swiperSlideOffset = swiper2.isHorizontal() ? slides[i].offsetLeft : slides[i].offsetTop;
  }
}
function updateSlidesProgress(translate2 = this && this.translate || 0) {
  const swiper2 = this;
  const params = swiper2.params;
  const {
    slides,
    rtlTranslate: rtl,
    snapGrid
  } = swiper2;
  if (slides.length === 0)
    return;
  if (typeof slides[0].swiperSlideOffset === "undefined")
    swiper2.updateSlidesOffset();
  let offsetCenter = -translate2;
  if (rtl)
    offsetCenter = translate2;
  slides.removeClass(params.slideVisibleClass);
  swiper2.visibleSlidesIndexes = [];
  swiper2.visibleSlides = [];
  for (let i = 0; i < slides.length; i += 1) {
    const slide2 = slides[i];
    let slideOffset = slide2.swiperSlideOffset;
    if (params.cssMode && params.centeredSlides) {
      slideOffset -= slides[0].swiperSlideOffset;
    }
    const slideProgress = (offsetCenter + (params.centeredSlides ? swiper2.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const originalSlideProgress = (offsetCenter - snapGrid[0] + (params.centeredSlides ? swiper2.minTranslate() : 0) - slideOffset) / (slide2.swiperSlideSize + params.spaceBetween);
    const slideBefore = -(offsetCenter - slideOffset);
    const slideAfter = slideBefore + swiper2.slidesSizesGrid[i];
    const isVisible = slideBefore >= 0 && slideBefore < swiper2.size - 1 || slideAfter > 1 && slideAfter <= swiper2.size || slideBefore <= 0 && slideAfter >= swiper2.size;
    if (isVisible) {
      swiper2.visibleSlides.push(slide2);
      swiper2.visibleSlidesIndexes.push(i);
      slides.eq(i).addClass(params.slideVisibleClass);
    }
    slide2.progress = rtl ? -slideProgress : slideProgress;
    slide2.originalProgress = rtl ? -originalSlideProgress : originalSlideProgress;
  }
  swiper2.visibleSlides = $$1(swiper2.visibleSlides);
}
function updateProgress(translate2) {
  const swiper2 = this;
  if (typeof translate2 === "undefined") {
    const multiplier = swiper2.rtlTranslate ? -1 : 1;
    translate2 = swiper2 && swiper2.translate && swiper2.translate * multiplier || 0;
  }
  const params = swiper2.params;
  const translatesDiff = swiper2.maxTranslate() - swiper2.minTranslate();
  let {
    progress,
    isBeginning,
    isEnd
  } = swiper2;
  const wasBeginning = isBeginning;
  const wasEnd = isEnd;
  if (translatesDiff === 0) {
    progress = 0;
    isBeginning = true;
    isEnd = true;
  } else {
    progress = (translate2 - swiper2.minTranslate()) / translatesDiff;
    isBeginning = progress <= 0;
    isEnd = progress >= 1;
  }
  Object.assign(swiper2, {
    progress,
    isBeginning,
    isEnd
  });
  if (params.watchSlidesProgress || params.centeredSlides && params.autoHeight)
    swiper2.updateSlidesProgress(translate2);
  if (isBeginning && !wasBeginning) {
    swiper2.emit("reachBeginning toEdge");
  }
  if (isEnd && !wasEnd) {
    swiper2.emit("reachEnd toEdge");
  }
  if (wasBeginning && !isBeginning || wasEnd && !isEnd) {
    swiper2.emit("fromEdge");
  }
  swiper2.emit("progress", progress);
}
function updateSlidesClasses() {
  const swiper2 = this;
  const {
    slides,
    params,
    $wrapperEl,
    activeIndex,
    realIndex
  } = swiper2;
  const isVirtual = swiper2.virtual && params.virtual.enabled;
  slides.removeClass(`${params.slideActiveClass} ${params.slideNextClass} ${params.slidePrevClass} ${params.slideDuplicateActiveClass} ${params.slideDuplicateNextClass} ${params.slideDuplicatePrevClass}`);
  let activeSlide;
  if (isVirtual) {
    activeSlide = swiper2.$wrapperEl.find(`.${params.slideClass}[data-swiper-slide-index="${activeIndex}"]`);
  } else {
    activeSlide = slides.eq(activeIndex);
  }
  activeSlide.addClass(params.slideActiveClass);
  if (params.loop) {
    if (activeSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${realIndex}"]`).addClass(params.slideDuplicateActiveClass);
    }
  }
  let nextSlide = activeSlide.nextAll(`.${params.slideClass}`).eq(0).addClass(params.slideNextClass);
  if (params.loop && nextSlide.length === 0) {
    nextSlide = slides.eq(0);
    nextSlide.addClass(params.slideNextClass);
  }
  let prevSlide = activeSlide.prevAll(`.${params.slideClass}`).eq(0).addClass(params.slidePrevClass);
  if (params.loop && prevSlide.length === 0) {
    prevSlide = slides.eq(-1);
    prevSlide.addClass(params.slidePrevClass);
  }
  if (params.loop) {
    if (nextSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${nextSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicateNextClass);
    }
    if (prevSlide.hasClass(params.slideDuplicateClass)) {
      $wrapperEl.children(`.${params.slideClass}:not(.${params.slideDuplicateClass})[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    } else {
      $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass}[data-swiper-slide-index="${prevSlide.attr("data-swiper-slide-index")}"]`).addClass(params.slideDuplicatePrevClass);
    }
  }
  swiper2.emitSlidesClasses();
}
function updateActiveIndex(newActiveIndex) {
  const swiper2 = this;
  const translate2 = swiper2.rtlTranslate ? swiper2.translate : -swiper2.translate;
  const {
    slidesGrid,
    snapGrid,
    params,
    activeIndex: previousIndex,
    realIndex: previousRealIndex,
    snapIndex: previousSnapIndex
  } = swiper2;
  let activeIndex = newActiveIndex;
  let snapIndex;
  if (typeof activeIndex === "undefined") {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1] - (slidesGrid[i + 1] - slidesGrid[i]) / 2) {
          activeIndex = i;
        } else if (translate2 >= slidesGrid[i] && translate2 < slidesGrid[i + 1]) {
          activeIndex = i + 1;
        }
      } else if (translate2 >= slidesGrid[i]) {
        activeIndex = i;
      }
    }
    if (params.normalizeSlideIndex) {
      if (activeIndex < 0 || typeof activeIndex === "undefined")
        activeIndex = 0;
    }
  }
  if (snapGrid.indexOf(translate2) >= 0) {
    snapIndex = snapGrid.indexOf(translate2);
  } else {
    const skip = Math.min(params.slidesPerGroupSkip, activeIndex);
    snapIndex = skip + Math.floor((activeIndex - skip) / params.slidesPerGroup);
  }
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  if (activeIndex === previousIndex) {
    if (snapIndex !== previousSnapIndex) {
      swiper2.snapIndex = snapIndex;
      swiper2.emit("snapIndexChange");
    }
    return;
  }
  const realIndex = parseInt(swiper2.slides.eq(activeIndex).attr("data-swiper-slide-index") || activeIndex, 10);
  Object.assign(swiper2, {
    snapIndex,
    realIndex,
    previousIndex,
    activeIndex
  });
  swiper2.emit("activeIndexChange");
  swiper2.emit("snapIndexChange");
  if (previousRealIndex !== realIndex) {
    swiper2.emit("realIndexChange");
  }
  if (swiper2.initialized || swiper2.params.runCallbacksOnInit) {
    swiper2.emit("slideChange");
  }
}
function updateClickedSlide(e) {
  const swiper2 = this;
  const params = swiper2.params;
  const slide2 = $$1(e).closest(`.${params.slideClass}`)[0];
  let slideFound = false;
  let slideIndex;
  if (slide2) {
    for (let i = 0; i < swiper2.slides.length; i += 1) {
      if (swiper2.slides[i] === slide2) {
        slideFound = true;
        slideIndex = i;
        break;
      }
    }
  }
  if (slide2 && slideFound) {
    swiper2.clickedSlide = slide2;
    if (swiper2.virtual && swiper2.params.virtual.enabled) {
      swiper2.clickedIndex = parseInt($$1(slide2).attr("data-swiper-slide-index"), 10);
    } else {
      swiper2.clickedIndex = slideIndex;
    }
  } else {
    swiper2.clickedSlide = void 0;
    swiper2.clickedIndex = void 0;
    return;
  }
  if (params.slideToClickedSlide && swiper2.clickedIndex !== void 0 && swiper2.clickedIndex !== swiper2.activeIndex) {
    swiper2.slideToClickedSlide();
  }
}
const update = {
  updateSize,
  updateSlides,
  updateAutoHeight,
  updateSlidesOffset,
  updateSlidesProgress,
  updateProgress,
  updateSlidesClasses,
  updateActiveIndex,
  updateClickedSlide
};
function getSwiperTranslate(axis = this.isHorizontal() ? "x" : "y") {
  const swiper2 = this;
  const {
    params,
    rtlTranslate: rtl,
    translate: translate2,
    $wrapperEl
  } = swiper2;
  if (params.virtualTranslate) {
    return rtl ? -translate2 : translate2;
  }
  if (params.cssMode) {
    return translate2;
  }
  let currentTranslate = getTranslate($wrapperEl[0], axis);
  if (rtl)
    currentTranslate = -currentTranslate;
  return currentTranslate || 0;
}
function setTranslate(translate2, byController) {
  const swiper2 = this;
  const {
    rtlTranslate: rtl,
    params,
    $wrapperEl,
    wrapperEl,
    progress
  } = swiper2;
  let x = 0;
  let y = 0;
  const z = 0;
  if (swiper2.isHorizontal()) {
    x = rtl ? -translate2 : translate2;
  } else {
    y = translate2;
  }
  if (params.roundLengths) {
    x = Math.floor(x);
    y = Math.floor(y);
  }
  if (params.cssMode) {
    wrapperEl[swiper2.isHorizontal() ? "scrollLeft" : "scrollTop"] = swiper2.isHorizontal() ? -x : -y;
  } else if (!params.virtualTranslate) {
    $wrapperEl.transform(`translate3d(${x}px, ${y}px, ${z}px)`);
  }
  swiper2.previousTranslate = swiper2.translate;
  swiper2.translate = swiper2.isHorizontal() ? x : y;
  let newProgress;
  const translatesDiff = swiper2.maxTranslate() - swiper2.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (translate2 - swiper2.minTranslate()) / translatesDiff;
  }
  if (newProgress !== progress) {
    swiper2.updateProgress(translate2);
  }
  swiper2.emit("setTranslate", swiper2.translate, byController);
}
function minTranslate() {
  return -this.snapGrid[0];
}
function maxTranslate() {
  return -this.snapGrid[this.snapGrid.length - 1];
}
function translateTo(translate2 = 0, speed = this.params.speed, runCallbacks = true, translateBounds = true, internal) {
  const swiper2 = this;
  const {
    params,
    wrapperEl
  } = swiper2;
  if (swiper2.animating && params.preventInteractionOnTransition) {
    return false;
  }
  const minTranslate2 = swiper2.minTranslate();
  const maxTranslate2 = swiper2.maxTranslate();
  let newTranslate;
  if (translateBounds && translate2 > minTranslate2)
    newTranslate = minTranslate2;
  else if (translateBounds && translate2 < maxTranslate2)
    newTranslate = maxTranslate2;
  else
    newTranslate = translate2;
  swiper2.updateProgress(newTranslate);
  if (params.cssMode) {
    const isH = swiper2.isHorizontal();
    if (speed === 0) {
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = -newTranslate;
    } else {
      if (!swiper2.support.smoothScroll) {
        animateCSSModeScroll({
          swiper: swiper2,
          targetPosition: -newTranslate,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: -newTranslate,
        behavior: "smooth"
      });
    }
    return true;
  }
  if (speed === 0) {
    swiper2.setTransition(0);
    swiper2.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper2.emit("beforeTransitionStart", speed, internal);
      swiper2.emit("transitionEnd");
    }
  } else {
    swiper2.setTransition(speed);
    swiper2.setTranslate(newTranslate);
    if (runCallbacks) {
      swiper2.emit("beforeTransitionStart", speed, internal);
      swiper2.emit("transitionStart");
    }
    if (!swiper2.animating) {
      swiper2.animating = true;
      if (!swiper2.onTranslateToWrapperTransitionEnd) {
        swiper2.onTranslateToWrapperTransitionEnd = function transitionEnd2(e) {
          if (!swiper2 || swiper2.destroyed)
            return;
          if (e.target !== this)
            return;
          swiper2.$wrapperEl[0].removeEventListener("transitionend", swiper2.onTranslateToWrapperTransitionEnd);
          swiper2.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper2.onTranslateToWrapperTransitionEnd);
          swiper2.onTranslateToWrapperTransitionEnd = null;
          delete swiper2.onTranslateToWrapperTransitionEnd;
          if (runCallbacks) {
            swiper2.emit("transitionEnd");
          }
        };
      }
      swiper2.$wrapperEl[0].addEventListener("transitionend", swiper2.onTranslateToWrapperTransitionEnd);
      swiper2.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper2.onTranslateToWrapperTransitionEnd);
    }
  }
  return true;
}
const translate = {
  getTranslate: getSwiperTranslate,
  setTranslate,
  minTranslate,
  maxTranslate,
  translateTo
};
function setTransition(duration, byController) {
  const swiper2 = this;
  if (!swiper2.params.cssMode) {
    swiper2.$wrapperEl.transition(duration);
  }
  swiper2.emit("setTransition", duration, byController);
}
function transitionEmit({
  swiper: swiper2,
  runCallbacks,
  direction,
  step
}) {
  const {
    activeIndex,
    previousIndex
  } = swiper2;
  let dir = direction;
  if (!dir) {
    if (activeIndex > previousIndex)
      dir = "next";
    else if (activeIndex < previousIndex)
      dir = "prev";
    else
      dir = "reset";
  }
  swiper2.emit(`transition${step}`);
  if (runCallbacks && activeIndex !== previousIndex) {
    if (dir === "reset") {
      swiper2.emit(`slideResetTransition${step}`);
      return;
    }
    swiper2.emit(`slideChangeTransition${step}`);
    if (dir === "next") {
      swiper2.emit(`slideNextTransition${step}`);
    } else {
      swiper2.emit(`slidePrevTransition${step}`);
    }
  }
}
function transitionStart(runCallbacks = true, direction) {
  const swiper2 = this;
  const {
    params
  } = swiper2;
  if (params.cssMode)
    return;
  if (params.autoHeight) {
    swiper2.updateAutoHeight();
  }
  transitionEmit({
    swiper: swiper2,
    runCallbacks,
    direction,
    step: "Start"
  });
}
function transitionEnd(runCallbacks = true, direction) {
  const swiper2 = this;
  const {
    params
  } = swiper2;
  swiper2.animating = false;
  if (params.cssMode)
    return;
  swiper2.setTransition(0);
  transitionEmit({
    swiper: swiper2,
    runCallbacks,
    direction,
    step: "End"
  });
}
const transition = {
  setTransition,
  transitionStart,
  transitionEnd
};
function slideTo(index2 = 0, speed = this.params.speed, runCallbacks = true, internal, initial) {
  if (typeof index2 !== "number" && typeof index2 !== "string") {
    throw new Error(`The 'index' argument cannot have type other than 'number' or 'string'. [${typeof index2}] given.`);
  }
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper2 = this;
  let slideIndex = index2;
  if (slideIndex < 0)
    slideIndex = 0;
  const {
    params,
    snapGrid,
    slidesGrid,
    previousIndex,
    activeIndex,
    rtlTranslate: rtl,
    wrapperEl,
    enabled
  } = swiper2;
  if (swiper2.animating && params.preventInteractionOnTransition || !enabled && !internal && !initial) {
    return false;
  }
  const skip = Math.min(swiper2.params.slidesPerGroupSkip, slideIndex);
  let snapIndex = skip + Math.floor((slideIndex - skip) / swiper2.params.slidesPerGroup);
  if (snapIndex >= snapGrid.length)
    snapIndex = snapGrid.length - 1;
  const translate2 = -snapGrid[snapIndex];
  if (params.normalizeSlideIndex) {
    for (let i = 0; i < slidesGrid.length; i += 1) {
      const normalizedTranslate = -Math.floor(translate2 * 100);
      const normalizedGrid = Math.floor(slidesGrid[i] * 100);
      const normalizedGridNext = Math.floor(slidesGrid[i + 1] * 100);
      if (typeof slidesGrid[i + 1] !== "undefined") {
        if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext - (normalizedGridNext - normalizedGrid) / 2) {
          slideIndex = i;
        } else if (normalizedTranslate >= normalizedGrid && normalizedTranslate < normalizedGridNext) {
          slideIndex = i + 1;
        }
      } else if (normalizedTranslate >= normalizedGrid) {
        slideIndex = i;
      }
    }
  }
  if (swiper2.initialized && slideIndex !== activeIndex) {
    if (!swiper2.allowSlideNext && translate2 < swiper2.translate && translate2 < swiper2.minTranslate()) {
      return false;
    }
    if (!swiper2.allowSlidePrev && translate2 > swiper2.translate && translate2 > swiper2.maxTranslate()) {
      if ((activeIndex || 0) !== slideIndex)
        return false;
    }
  }
  if (slideIndex !== (previousIndex || 0) && runCallbacks) {
    swiper2.emit("beforeSlideChangeStart");
  }
  swiper2.updateProgress(translate2);
  let direction;
  if (slideIndex > activeIndex)
    direction = "next";
  else if (slideIndex < activeIndex)
    direction = "prev";
  else
    direction = "reset";
  if (rtl && -translate2 === swiper2.translate || !rtl && translate2 === swiper2.translate) {
    swiper2.updateActiveIndex(slideIndex);
    if (params.autoHeight) {
      swiper2.updateAutoHeight();
    }
    swiper2.updateSlidesClasses();
    if (params.effect !== "slide") {
      swiper2.setTranslate(translate2);
    }
    if (direction !== "reset") {
      swiper2.transitionStart(runCallbacks, direction);
      swiper2.transitionEnd(runCallbacks, direction);
    }
    return false;
  }
  if (params.cssMode) {
    const isH = swiper2.isHorizontal();
    const t = rtl ? translate2 : -translate2;
    if (speed === 0) {
      const isVirtual = swiper2.virtual && swiper2.params.virtual.enabled;
      if (isVirtual) {
        swiper2.wrapperEl.style.scrollSnapType = "none";
        swiper2._immediateVirtual = true;
      }
      wrapperEl[isH ? "scrollLeft" : "scrollTop"] = t;
      if (isVirtual) {
        requestAnimationFrame(() => {
          swiper2.wrapperEl.style.scrollSnapType = "";
          swiper2._swiperImmediateVirtual = false;
        });
      }
    } else {
      if (!swiper2.support.smoothScroll) {
        animateCSSModeScroll({
          swiper: swiper2,
          targetPosition: t,
          side: isH ? "left" : "top"
        });
        return true;
      }
      wrapperEl.scrollTo({
        [isH ? "left" : "top"]: t,
        behavior: "smooth"
      });
    }
    return true;
  }
  swiper2.setTransition(speed);
  swiper2.setTranslate(translate2);
  swiper2.updateActiveIndex(slideIndex);
  swiper2.updateSlidesClasses();
  swiper2.emit("beforeTransitionStart", speed, internal);
  swiper2.transitionStart(runCallbacks, direction);
  if (speed === 0) {
    swiper2.transitionEnd(runCallbacks, direction);
  } else if (!swiper2.animating) {
    swiper2.animating = true;
    if (!swiper2.onSlideToWrapperTransitionEnd) {
      swiper2.onSlideToWrapperTransitionEnd = function transitionEnd2(e) {
        if (!swiper2 || swiper2.destroyed)
          return;
        if (e.target !== this)
          return;
        swiper2.$wrapperEl[0].removeEventListener("transitionend", swiper2.onSlideToWrapperTransitionEnd);
        swiper2.$wrapperEl[0].removeEventListener("webkitTransitionEnd", swiper2.onSlideToWrapperTransitionEnd);
        swiper2.onSlideToWrapperTransitionEnd = null;
        delete swiper2.onSlideToWrapperTransitionEnd;
        swiper2.transitionEnd(runCallbacks, direction);
      };
    }
    swiper2.$wrapperEl[0].addEventListener("transitionend", swiper2.onSlideToWrapperTransitionEnd);
    swiper2.$wrapperEl[0].addEventListener("webkitTransitionEnd", swiper2.onSlideToWrapperTransitionEnd);
  }
  return true;
}
function slideToLoop(index2 = 0, speed = this.params.speed, runCallbacks = true, internal) {
  if (typeof index2 === "string") {
    const indexAsNumber = parseInt(index2, 10);
    const isValidNumber = isFinite(indexAsNumber);
    if (!isValidNumber) {
      throw new Error(`The passed-in 'index' (string) couldn't be converted to 'number'. [${index2}] given.`);
    }
    index2 = indexAsNumber;
  }
  const swiper2 = this;
  let newIndex = index2;
  if (swiper2.params.loop) {
    newIndex += swiper2.loopedSlides;
  }
  return swiper2.slideTo(newIndex, speed, runCallbacks, internal);
}
function slideNext(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper2 = this;
  const {
    animating,
    enabled,
    params
  } = swiper2;
  if (!enabled)
    return swiper2;
  let perGroup = params.slidesPerGroup;
  if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
    perGroup = Math.max(swiper2.slidesPerViewDynamic("current", true), 1);
  }
  const increment = swiper2.activeIndex < params.slidesPerGroupSkip ? 1 : perGroup;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper2.loopFix();
    swiper2._clientLeft = swiper2.$wrapperEl[0].clientLeft;
  }
  if (params.rewind && swiper2.isEnd) {
    return swiper2.slideTo(0, speed, runCallbacks, internal);
  }
  return swiper2.slideTo(swiper2.activeIndex + increment, speed, runCallbacks, internal);
}
function slidePrev(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper2 = this;
  const {
    params,
    animating,
    snapGrid,
    slidesGrid,
    rtlTranslate,
    enabled
  } = swiper2;
  if (!enabled)
    return swiper2;
  if (params.loop) {
    if (animating && params.loopPreventsSlide)
      return false;
    swiper2.loopFix();
    swiper2._clientLeft = swiper2.$wrapperEl[0].clientLeft;
  }
  const translate2 = rtlTranslate ? swiper2.translate : -swiper2.translate;
  function normalize3(val) {
    if (val < 0)
      return -Math.floor(Math.abs(val));
    return Math.floor(val);
  }
  const normalizedTranslate = normalize3(translate2);
  const normalizedSnapGrid = snapGrid.map((val) => normalize3(val));
  let prevSnap = snapGrid[normalizedSnapGrid.indexOf(normalizedTranslate) - 1];
  if (typeof prevSnap === "undefined" && params.cssMode) {
    let prevSnapIndex;
    snapGrid.forEach((snap3, snapIndex) => {
      if (normalizedTranslate >= snap3) {
        prevSnapIndex = snapIndex;
      }
    });
    if (typeof prevSnapIndex !== "undefined") {
      prevSnap = snapGrid[prevSnapIndex > 0 ? prevSnapIndex - 1 : prevSnapIndex];
    }
  }
  let prevIndex = 0;
  if (typeof prevSnap !== "undefined") {
    prevIndex = slidesGrid.indexOf(prevSnap);
    if (prevIndex < 0)
      prevIndex = swiper2.activeIndex - 1;
    if (params.slidesPerView === "auto" && params.slidesPerGroup === 1 && params.slidesPerGroupAuto) {
      prevIndex = prevIndex - swiper2.slidesPerViewDynamic("previous", true) + 1;
      prevIndex = Math.max(prevIndex, 0);
    }
  }
  if (params.rewind && swiper2.isBeginning) {
    const lastIndex = swiper2.params.virtual && swiper2.params.virtual.enabled && swiper2.virtual ? swiper2.virtual.slides.length - 1 : swiper2.slides.length - 1;
    return swiper2.slideTo(lastIndex, speed, runCallbacks, internal);
  }
  return swiper2.slideTo(prevIndex, speed, runCallbacks, internal);
}
function slideReset(speed = this.params.speed, runCallbacks = true, internal) {
  const swiper2 = this;
  return swiper2.slideTo(swiper2.activeIndex, speed, runCallbacks, internal);
}
function slideToClosest(speed = this.params.speed, runCallbacks = true, internal, threshold = 0.5) {
  const swiper2 = this;
  let index2 = swiper2.activeIndex;
  const skip = Math.min(swiper2.params.slidesPerGroupSkip, index2);
  const snapIndex = skip + Math.floor((index2 - skip) / swiper2.params.slidesPerGroup);
  const translate2 = swiper2.rtlTranslate ? swiper2.translate : -swiper2.translate;
  if (translate2 >= swiper2.snapGrid[snapIndex]) {
    const currentSnap = swiper2.snapGrid[snapIndex];
    const nextSnap = swiper2.snapGrid[snapIndex + 1];
    if (translate2 - currentSnap > (nextSnap - currentSnap) * threshold) {
      index2 += swiper2.params.slidesPerGroup;
    }
  } else {
    const prevSnap = swiper2.snapGrid[snapIndex - 1];
    const currentSnap = swiper2.snapGrid[snapIndex];
    if (translate2 - prevSnap <= (currentSnap - prevSnap) * threshold) {
      index2 -= swiper2.params.slidesPerGroup;
    }
  }
  index2 = Math.max(index2, 0);
  index2 = Math.min(index2, swiper2.slidesGrid.length - 1);
  return swiper2.slideTo(index2, speed, runCallbacks, internal);
}
function slideToClickedSlide() {
  const swiper2 = this;
  const {
    params,
    $wrapperEl
  } = swiper2;
  const slidesPerView = params.slidesPerView === "auto" ? swiper2.slidesPerViewDynamic() : params.slidesPerView;
  let slideToIndex = swiper2.clickedIndex;
  let realIndex;
  if (params.loop) {
    if (swiper2.animating)
      return;
    realIndex = parseInt($$1(swiper2.clickedSlide).attr("data-swiper-slide-index"), 10);
    if (params.centeredSlides) {
      if (slideToIndex < swiper2.loopedSlides - slidesPerView / 2 || slideToIndex > swiper2.slides.length - swiper2.loopedSlides + slidesPerView / 2) {
        swiper2.loopFix();
        slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
        nextTick(() => {
          swiper2.slideTo(slideToIndex);
        });
      } else {
        swiper2.slideTo(slideToIndex);
      }
    } else if (slideToIndex > swiper2.slides.length - slidesPerView) {
      swiper2.loopFix();
      slideToIndex = $wrapperEl.children(`.${params.slideClass}[data-swiper-slide-index="${realIndex}"]:not(.${params.slideDuplicateClass})`).eq(0).index();
      nextTick(() => {
        swiper2.slideTo(slideToIndex);
      });
    } else {
      swiper2.slideTo(slideToIndex);
    }
  } else {
    swiper2.slideTo(slideToIndex);
  }
}
const slide = {
  slideTo,
  slideToLoop,
  slideNext,
  slidePrev,
  slideReset,
  slideToClosest,
  slideToClickedSlide
};
function loopCreate() {
  const swiper2 = this;
  const document2 = getDocument();
  const {
    params,
    $wrapperEl
  } = swiper2;
  const $selector = $wrapperEl.children().length > 0 ? $$1($wrapperEl.children()[0].parentNode) : $wrapperEl;
  $selector.children(`.${params.slideClass}.${params.slideDuplicateClass}`).remove();
  let slides = $selector.children(`.${params.slideClass}`);
  if (params.loopFillGroupWithBlank) {
    const blankSlidesNum = params.slidesPerGroup - slides.length % params.slidesPerGroup;
    if (blankSlidesNum !== params.slidesPerGroup) {
      for (let i = 0; i < blankSlidesNum; i += 1) {
        const blankNode = $$1(document2.createElement("div")).addClass(`${params.slideClass} ${params.slideBlankClass}`);
        $selector.append(blankNode);
      }
      slides = $selector.children(`.${params.slideClass}`);
    }
  }
  if (params.slidesPerView === "auto" && !params.loopedSlides)
    params.loopedSlides = slides.length;
  swiper2.loopedSlides = Math.ceil(parseFloat(params.loopedSlides || params.slidesPerView, 10));
  swiper2.loopedSlides += params.loopAdditionalSlides;
  if (swiper2.loopedSlides > slides.length && swiper2.params.loopedSlidesLimit) {
    swiper2.loopedSlides = slides.length;
  }
  const prependSlides = [];
  const appendSlides = [];
  slides.each((el, index2) => {
    const slide2 = $$1(el);
    slide2.attr("data-swiper-slide-index", index2);
  });
  for (let i = 0; i < swiper2.loopedSlides; i += 1) {
    const index2 = i - Math.floor(i / slides.length) * slides.length;
    appendSlides.push(slides.eq(index2)[0]);
    prependSlides.unshift(slides.eq(slides.length - index2 - 1)[0]);
  }
  for (let i = 0; i < appendSlides.length; i += 1) {
    $selector.append($$1(appendSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
  for (let i = prependSlides.length - 1; i >= 0; i -= 1) {
    $selector.prepend($$1(prependSlides[i].cloneNode(true)).addClass(params.slideDuplicateClass));
  }
}
function loopFix() {
  const swiper2 = this;
  swiper2.emit("beforeLoopFix");
  const {
    activeIndex,
    slides,
    loopedSlides,
    allowSlidePrev,
    allowSlideNext,
    snapGrid,
    rtlTranslate: rtl
  } = swiper2;
  let newIndex;
  swiper2.allowSlidePrev = true;
  swiper2.allowSlideNext = true;
  const snapTranslate = -snapGrid[activeIndex];
  const diff = snapTranslate - swiper2.getTranslate();
  if (activeIndex < loopedSlides) {
    newIndex = slides.length - loopedSlides * 3 + activeIndex;
    newIndex += loopedSlides;
    const slideChanged = swiper2.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper2.setTranslate((rtl ? -swiper2.translate : swiper2.translate) - diff);
    }
  } else if (activeIndex >= slides.length - loopedSlides) {
    newIndex = -slides.length + activeIndex + loopedSlides;
    newIndex += loopedSlides;
    const slideChanged = swiper2.slideTo(newIndex, 0, false, true);
    if (slideChanged && diff !== 0) {
      swiper2.setTranslate((rtl ? -swiper2.translate : swiper2.translate) - diff);
    }
  }
  swiper2.allowSlidePrev = allowSlidePrev;
  swiper2.allowSlideNext = allowSlideNext;
  swiper2.emit("loopFix");
}
function loopDestroy() {
  const swiper2 = this;
  const {
    $wrapperEl,
    params,
    slides
  } = swiper2;
  $wrapperEl.children(`.${params.slideClass}.${params.slideDuplicateClass},.${params.slideClass}.${params.slideBlankClass}`).remove();
  slides.removeAttr("data-swiper-slide-index");
}
const loop = {
  loopCreate,
  loopFix,
  loopDestroy
};
function setGrabCursor(moving) {
  const swiper2 = this;
  if (swiper2.support.touch || !swiper2.params.simulateTouch || swiper2.params.watchOverflow && swiper2.isLocked || swiper2.params.cssMode)
    return;
  const el = swiper2.params.touchEventsTarget === "container" ? swiper2.el : swiper2.wrapperEl;
  el.style.cursor = "move";
  el.style.cursor = moving ? "grabbing" : "grab";
}
function unsetGrabCursor() {
  const swiper2 = this;
  if (swiper2.support.touch || swiper2.params.watchOverflow && swiper2.isLocked || swiper2.params.cssMode) {
    return;
  }
  swiper2[swiper2.params.touchEventsTarget === "container" ? "el" : "wrapperEl"].style.cursor = "";
}
const grabCursor = {
  setGrabCursor,
  unsetGrabCursor
};
function closestElement(selector3, base = this) {
  function __closestFrom(el) {
    if (!el || el === getDocument() || el === getWindow())
      return null;
    if (el.assignedSlot)
      el = el.assignedSlot;
    const found = el.closest(selector3);
    if (!found && !el.getRootNode) {
      return null;
    }
    return found || __closestFrom(el.getRootNode().host);
  }
  return __closestFrom(base);
}
function onTouchStart(event) {
  const swiper2 = this;
  const document2 = getDocument();
  const window2 = getWindow();
  const data = swiper2.touchEventsData;
  const {
    params,
    touches,
    enabled
  } = swiper2;
  if (!enabled)
    return;
  if (swiper2.animating && params.preventInteractionOnTransition) {
    return;
  }
  if (!swiper2.animating && params.cssMode && params.loop) {
    swiper2.loopFix();
  }
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  let $targetEl = $$1(e.target);
  if (params.touchEventsTarget === "wrapper") {
    if (!$targetEl.closest(swiper2.wrapperEl).length)
      return;
  }
  data.isTouchEvent = e.type === "touchstart";
  if (!data.isTouchEvent && "which" in e && e.which === 3)
    return;
  if (!data.isTouchEvent && "button" in e && e.button > 0)
    return;
  if (data.isTouched && data.isMoved)
    return;
  const swipingClassHasValue = !!params.noSwipingClass && params.noSwipingClass !== "";
  const eventPath = event.composedPath ? event.composedPath() : event.path;
  if (swipingClassHasValue && e.target && e.target.shadowRoot && eventPath) {
    $targetEl = $$1(eventPath[0]);
  }
  const noSwipingSelector = params.noSwipingSelector ? params.noSwipingSelector : `.${params.noSwipingClass}`;
  const isTargetShadow = !!(e.target && e.target.shadowRoot);
  if (params.noSwiping && (isTargetShadow ? closestElement(noSwipingSelector, $targetEl[0]) : $targetEl.closest(noSwipingSelector)[0])) {
    swiper2.allowClick = true;
    return;
  }
  if (params.swipeHandler) {
    if (!$targetEl.closest(params.swipeHandler)[0])
      return;
  }
  touches.currentX = e.type === "touchstart" ? e.targetTouches[0].pageX : e.pageX;
  touches.currentY = e.type === "touchstart" ? e.targetTouches[0].pageY : e.pageY;
  const startX = touches.currentX;
  const startY = touches.currentY;
  const edgeSwipeDetection = params.edgeSwipeDetection || params.iOSEdgeSwipeDetection;
  const edgeSwipeThreshold = params.edgeSwipeThreshold || params.iOSEdgeSwipeThreshold;
  if (edgeSwipeDetection && (startX <= edgeSwipeThreshold || startX >= window2.innerWidth - edgeSwipeThreshold)) {
    if (edgeSwipeDetection === "prevent") {
      event.preventDefault();
    } else {
      return;
    }
  }
  Object.assign(data, {
    isTouched: true,
    isMoved: false,
    allowTouchCallbacks: true,
    isScrolling: void 0,
    startMoving: void 0
  });
  touches.startX = startX;
  touches.startY = startY;
  data.touchStartTime = now();
  swiper2.allowClick = true;
  swiper2.updateSize();
  swiper2.swipeDirection = void 0;
  if (params.threshold > 0)
    data.allowThresholdMove = false;
  if (e.type !== "touchstart") {
    let preventDefault = true;
    if ($targetEl.is(data.focusableElements)) {
      preventDefault = false;
      if ($targetEl[0].nodeName === "SELECT") {
        data.isTouched = false;
      }
    }
    if (document2.activeElement && $$1(document2.activeElement).is(data.focusableElements) && document2.activeElement !== $targetEl[0]) {
      document2.activeElement.blur();
    }
    const shouldPreventDefault = preventDefault && swiper2.allowTouchMove && params.touchStartPreventDefault;
    if ((params.touchStartForcePreventDefault || shouldPreventDefault) && !$targetEl[0].isContentEditable) {
      e.preventDefault();
    }
  }
  if (swiper2.params.freeMode && swiper2.params.freeMode.enabled && swiper2.freeMode && swiper2.animating && !params.cssMode) {
    swiper2.freeMode.onTouchStart();
  }
  swiper2.emit("touchStart", e);
}
function onTouchMove(event) {
  const document2 = getDocument();
  const swiper2 = this;
  const data = swiper2.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    enabled
  } = swiper2;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (!data.isTouched) {
    if (data.startMoving && data.isScrolling) {
      swiper2.emit("touchMoveOpposite", e);
    }
    return;
  }
  if (data.isTouchEvent && e.type !== "touchmove")
    return;
  const targetTouch = e.type === "touchmove" && e.targetTouches && (e.targetTouches[0] || e.changedTouches[0]);
  const pageX = e.type === "touchmove" ? targetTouch.pageX : e.pageX;
  const pageY = e.type === "touchmove" ? targetTouch.pageY : e.pageY;
  if (e.preventedByNestedSwiper) {
    touches.startX = pageX;
    touches.startY = pageY;
    return;
  }
  if (!swiper2.allowTouchMove) {
    if (!$$1(e.target).is(data.focusableElements)) {
      swiper2.allowClick = false;
    }
    if (data.isTouched) {
      Object.assign(touches, {
        startX: pageX,
        startY: pageY,
        currentX: pageX,
        currentY: pageY
      });
      data.touchStartTime = now();
    }
    return;
  }
  if (data.isTouchEvent && params.touchReleaseOnEdges && !params.loop) {
    if (swiper2.isVertical()) {
      if (pageY < touches.startY && swiper2.translate <= swiper2.maxTranslate() || pageY > touches.startY && swiper2.translate >= swiper2.minTranslate()) {
        data.isTouched = false;
        data.isMoved = false;
        return;
      }
    } else if (pageX < touches.startX && swiper2.translate <= swiper2.maxTranslate() || pageX > touches.startX && swiper2.translate >= swiper2.minTranslate()) {
      return;
    }
  }
  if (data.isTouchEvent && document2.activeElement) {
    if (e.target === document2.activeElement && $$1(e.target).is(data.focusableElements)) {
      data.isMoved = true;
      swiper2.allowClick = false;
      return;
    }
  }
  if (data.allowTouchCallbacks) {
    swiper2.emit("touchMove", e);
  }
  if (e.targetTouches && e.targetTouches.length > 1)
    return;
  touches.currentX = pageX;
  touches.currentY = pageY;
  const diffX = touches.currentX - touches.startX;
  const diffY = touches.currentY - touches.startY;
  if (swiper2.params.threshold && Math.sqrt(diffX ** 2 + diffY ** 2) < swiper2.params.threshold)
    return;
  if (typeof data.isScrolling === "undefined") {
    let touchAngle;
    if (swiper2.isHorizontal() && touches.currentY === touches.startY || swiper2.isVertical() && touches.currentX === touches.startX) {
      data.isScrolling = false;
    } else {
      if (diffX * diffX + diffY * diffY >= 25) {
        touchAngle = Math.atan2(Math.abs(diffY), Math.abs(diffX)) * 180 / Math.PI;
        data.isScrolling = swiper2.isHorizontal() ? touchAngle > params.touchAngle : 90 - touchAngle > params.touchAngle;
      }
    }
  }
  if (data.isScrolling) {
    swiper2.emit("touchMoveOpposite", e);
  }
  if (typeof data.startMoving === "undefined") {
    if (touches.currentX !== touches.startX || touches.currentY !== touches.startY) {
      data.startMoving = true;
    }
  }
  if (data.isScrolling) {
    data.isTouched = false;
    return;
  }
  if (!data.startMoving) {
    return;
  }
  swiper2.allowClick = false;
  if (!params.cssMode && e.cancelable) {
    e.preventDefault();
  }
  if (params.touchMoveStopPropagation && !params.nested) {
    e.stopPropagation();
  }
  if (!data.isMoved) {
    if (params.loop && !params.cssMode) {
      swiper2.loopFix();
    }
    data.startTranslate = swiper2.getTranslate();
    swiper2.setTransition(0);
    if (swiper2.animating) {
      swiper2.$wrapperEl.trigger("webkitTransitionEnd transitionend");
    }
    data.allowMomentumBounce = false;
    if (params.grabCursor && (swiper2.allowSlideNext === true || swiper2.allowSlidePrev === true)) {
      swiper2.setGrabCursor(true);
    }
    swiper2.emit("sliderFirstMove", e);
  }
  swiper2.emit("sliderMove", e);
  data.isMoved = true;
  let diff = swiper2.isHorizontal() ? diffX : diffY;
  touches.diff = diff;
  diff *= params.touchRatio;
  if (rtl)
    diff = -diff;
  swiper2.swipeDirection = diff > 0 ? "prev" : "next";
  data.currentTranslate = diff + data.startTranslate;
  let disableParentSwiper = true;
  let resistanceRatio = params.resistanceRatio;
  if (params.touchReleaseOnEdges) {
    resistanceRatio = 0;
  }
  if (diff > 0 && data.currentTranslate > swiper2.minTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data.currentTranslate = swiper2.minTranslate() - 1 + (-swiper2.minTranslate() + data.startTranslate + diff) ** resistanceRatio;
  } else if (diff < 0 && data.currentTranslate < swiper2.maxTranslate()) {
    disableParentSwiper = false;
    if (params.resistance)
      data.currentTranslate = swiper2.maxTranslate() + 1 - (swiper2.maxTranslate() - data.startTranslate - diff) ** resistanceRatio;
  }
  if (disableParentSwiper) {
    e.preventedByNestedSwiper = true;
  }
  if (!swiper2.allowSlideNext && swiper2.swipeDirection === "next" && data.currentTranslate < data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper2.allowSlidePrev && swiper2.swipeDirection === "prev" && data.currentTranslate > data.startTranslate) {
    data.currentTranslate = data.startTranslate;
  }
  if (!swiper2.allowSlidePrev && !swiper2.allowSlideNext) {
    data.currentTranslate = data.startTranslate;
  }
  if (params.threshold > 0) {
    if (Math.abs(diff) > params.threshold || data.allowThresholdMove) {
      if (!data.allowThresholdMove) {
        data.allowThresholdMove = true;
        touches.startX = touches.currentX;
        touches.startY = touches.currentY;
        data.currentTranslate = data.startTranslate;
        touches.diff = swiper2.isHorizontal() ? touches.currentX - touches.startX : touches.currentY - touches.startY;
        return;
      }
    } else {
      data.currentTranslate = data.startTranslate;
      return;
    }
  }
  if (!params.followFinger || params.cssMode)
    return;
  if (params.freeMode && params.freeMode.enabled && swiper2.freeMode || params.watchSlidesProgress) {
    swiper2.updateActiveIndex();
    swiper2.updateSlidesClasses();
  }
  if (swiper2.params.freeMode && params.freeMode.enabled && swiper2.freeMode) {
    swiper2.freeMode.onTouchMove();
  }
  swiper2.updateProgress(data.currentTranslate);
  swiper2.setTranslate(data.currentTranslate);
}
function onTouchEnd(event) {
  const swiper2 = this;
  const data = swiper2.touchEventsData;
  const {
    params,
    touches,
    rtlTranslate: rtl,
    slidesGrid,
    enabled
  } = swiper2;
  if (!enabled)
    return;
  let e = event;
  if (e.originalEvent)
    e = e.originalEvent;
  if (data.allowTouchCallbacks) {
    swiper2.emit("touchEnd", e);
  }
  data.allowTouchCallbacks = false;
  if (!data.isTouched) {
    if (data.isMoved && params.grabCursor) {
      swiper2.setGrabCursor(false);
    }
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  if (params.grabCursor && data.isMoved && data.isTouched && (swiper2.allowSlideNext === true || swiper2.allowSlidePrev === true)) {
    swiper2.setGrabCursor(false);
  }
  const touchEndTime = now();
  const timeDiff = touchEndTime - data.touchStartTime;
  if (swiper2.allowClick) {
    const pathTree = e.path || e.composedPath && e.composedPath();
    swiper2.updateClickedSlide(pathTree && pathTree[0] || e.target);
    swiper2.emit("tap click", e);
    if (timeDiff < 300 && touchEndTime - data.lastClickTime < 300) {
      swiper2.emit("doubleTap doubleClick", e);
    }
  }
  data.lastClickTime = now();
  nextTick(() => {
    if (!swiper2.destroyed)
      swiper2.allowClick = true;
  });
  if (!data.isTouched || !data.isMoved || !swiper2.swipeDirection || touches.diff === 0 || data.currentTranslate === data.startTranslate) {
    data.isTouched = false;
    data.isMoved = false;
    data.startMoving = false;
    return;
  }
  data.isTouched = false;
  data.isMoved = false;
  data.startMoving = false;
  let currentPos;
  if (params.followFinger) {
    currentPos = rtl ? swiper2.translate : -swiper2.translate;
  } else {
    currentPos = -data.currentTranslate;
  }
  if (params.cssMode) {
    return;
  }
  if (swiper2.params.freeMode && params.freeMode.enabled) {
    swiper2.freeMode.onTouchEnd({
      currentPos
    });
    return;
  }
  let stopIndex = 0;
  let groupSize = swiper2.slidesSizesGrid[0];
  for (let i = 0; i < slidesGrid.length; i += i < params.slidesPerGroupSkip ? 1 : params.slidesPerGroup) {
    const increment2 = i < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
    if (typeof slidesGrid[i + increment2] !== "undefined") {
      if (currentPos >= slidesGrid[i] && currentPos < slidesGrid[i + increment2]) {
        stopIndex = i;
        groupSize = slidesGrid[i + increment2] - slidesGrid[i];
      }
    } else if (currentPos >= slidesGrid[i]) {
      stopIndex = i;
      groupSize = slidesGrid[slidesGrid.length - 1] - slidesGrid[slidesGrid.length - 2];
    }
  }
  let rewindFirstIndex = null;
  let rewindLastIndex = null;
  if (params.rewind) {
    if (swiper2.isBeginning) {
      rewindLastIndex = swiper2.params.virtual && swiper2.params.virtual.enabled && swiper2.virtual ? swiper2.virtual.slides.length - 1 : swiper2.slides.length - 1;
    } else if (swiper2.isEnd) {
      rewindFirstIndex = 0;
    }
  }
  const ratio = (currentPos - slidesGrid[stopIndex]) / groupSize;
  const increment = stopIndex < params.slidesPerGroupSkip - 1 ? 1 : params.slidesPerGroup;
  if (timeDiff > params.longSwipesMs) {
    if (!params.longSwipes) {
      swiper2.slideTo(swiper2.activeIndex);
      return;
    }
    if (swiper2.swipeDirection === "next") {
      if (ratio >= params.longSwipesRatio)
        swiper2.slideTo(params.rewind && swiper2.isEnd ? rewindFirstIndex : stopIndex + increment);
      else
        swiper2.slideTo(stopIndex);
    }
    if (swiper2.swipeDirection === "prev") {
      if (ratio > 1 - params.longSwipesRatio) {
        swiper2.slideTo(stopIndex + increment);
      } else if (rewindLastIndex !== null && ratio < 0 && Math.abs(ratio) > params.longSwipesRatio) {
        swiper2.slideTo(rewindLastIndex);
      } else {
        swiper2.slideTo(stopIndex);
      }
    }
  } else {
    if (!params.shortSwipes) {
      swiper2.slideTo(swiper2.activeIndex);
      return;
    }
    const isNavButtonTarget = swiper2.navigation && (e.target === swiper2.navigation.nextEl || e.target === swiper2.navigation.prevEl);
    if (!isNavButtonTarget) {
      if (swiper2.swipeDirection === "next") {
        swiper2.slideTo(rewindFirstIndex !== null ? rewindFirstIndex : stopIndex + increment);
      }
      if (swiper2.swipeDirection === "prev") {
        swiper2.slideTo(rewindLastIndex !== null ? rewindLastIndex : stopIndex);
      }
    } else if (e.target === swiper2.navigation.nextEl) {
      swiper2.slideTo(stopIndex + increment);
    } else {
      swiper2.slideTo(stopIndex);
    }
  }
}
function onResize() {
  const swiper2 = this;
  const {
    params,
    el
  } = swiper2;
  if (el && el.offsetWidth === 0)
    return;
  if (params.breakpoints) {
    swiper2.setBreakpoint();
  }
  const {
    allowSlideNext,
    allowSlidePrev,
    snapGrid
  } = swiper2;
  swiper2.allowSlideNext = true;
  swiper2.allowSlidePrev = true;
  swiper2.updateSize();
  swiper2.updateSlides();
  swiper2.updateSlidesClasses();
  if ((params.slidesPerView === "auto" || params.slidesPerView > 1) && swiper2.isEnd && !swiper2.isBeginning && !swiper2.params.centeredSlides) {
    swiper2.slideTo(swiper2.slides.length - 1, 0, false, true);
  } else {
    swiper2.slideTo(swiper2.activeIndex, 0, false, true);
  }
  if (swiper2.autoplay && swiper2.autoplay.running && swiper2.autoplay.paused) {
    swiper2.autoplay.run();
  }
  swiper2.allowSlidePrev = allowSlidePrev;
  swiper2.allowSlideNext = allowSlideNext;
  if (swiper2.params.watchOverflow && snapGrid !== swiper2.snapGrid) {
    swiper2.checkOverflow();
  }
}
function onClick(e) {
  const swiper2 = this;
  if (!swiper2.enabled)
    return;
  if (!swiper2.allowClick) {
    if (swiper2.params.preventClicks)
      e.preventDefault();
    if (swiper2.params.preventClicksPropagation && swiper2.animating) {
      e.stopPropagation();
      e.stopImmediatePropagation();
    }
  }
}
function onScroll() {
  const swiper2 = this;
  const {
    wrapperEl,
    rtlTranslate,
    enabled
  } = swiper2;
  if (!enabled)
    return;
  swiper2.previousTranslate = swiper2.translate;
  if (swiper2.isHorizontal()) {
    swiper2.translate = -wrapperEl.scrollLeft;
  } else {
    swiper2.translate = -wrapperEl.scrollTop;
  }
  if (swiper2.translate === 0)
    swiper2.translate = 0;
  swiper2.updateActiveIndex();
  swiper2.updateSlidesClasses();
  let newProgress;
  const translatesDiff = swiper2.maxTranslate() - swiper2.minTranslate();
  if (translatesDiff === 0) {
    newProgress = 0;
  } else {
    newProgress = (swiper2.translate - swiper2.minTranslate()) / translatesDiff;
  }
  if (newProgress !== swiper2.progress) {
    swiper2.updateProgress(rtlTranslate ? -swiper2.translate : swiper2.translate);
  }
  swiper2.emit("setTranslate", swiper2.translate, false);
}
let dummyEventAttached = false;
function dummyEventListener() {
}
const events = (swiper2, method) => {
  const document2 = getDocument();
  const {
    params,
    touchEvents,
    el,
    wrapperEl,
    device,
    support: support2
  } = swiper2;
  const capture = !!params.nested;
  const domMethod = method === "on" ? "addEventListener" : "removeEventListener";
  const swiperMethod = method;
  if (!support2.touch) {
    el[domMethod](touchEvents.start, swiper2.onTouchStart, false);
    document2[domMethod](touchEvents.move, swiper2.onTouchMove, capture);
    document2[domMethod](touchEvents.end, swiper2.onTouchEnd, false);
  } else {
    const passiveListener = touchEvents.start === "touchstart" && support2.passiveListener && params.passiveListeners ? {
      passive: true,
      capture: false
    } : false;
    el[domMethod](touchEvents.start, swiper2.onTouchStart, passiveListener);
    el[domMethod](touchEvents.move, swiper2.onTouchMove, support2.passiveListener ? {
      passive: false,
      capture
    } : capture);
    el[domMethod](touchEvents.end, swiper2.onTouchEnd, passiveListener);
    if (touchEvents.cancel) {
      el[domMethod](touchEvents.cancel, swiper2.onTouchEnd, passiveListener);
    }
  }
  if (params.preventClicks || params.preventClicksPropagation) {
    el[domMethod]("click", swiper2.onClick, true);
  }
  if (params.cssMode) {
    wrapperEl[domMethod]("scroll", swiper2.onScroll);
  }
  if (params.updateOnWindowResize) {
    swiper2[swiperMethod](device.ios || device.android ? "resize orientationchange observerUpdate" : "resize observerUpdate", onResize, true);
  } else {
    swiper2[swiperMethod]("observerUpdate", onResize, true);
  }
};
function attachEvents() {
  const swiper2 = this;
  const document2 = getDocument();
  const {
    params,
    support: support2
  } = swiper2;
  swiper2.onTouchStart = onTouchStart.bind(swiper2);
  swiper2.onTouchMove = onTouchMove.bind(swiper2);
  swiper2.onTouchEnd = onTouchEnd.bind(swiper2);
  if (params.cssMode) {
    swiper2.onScroll = onScroll.bind(swiper2);
  }
  swiper2.onClick = onClick.bind(swiper2);
  if (support2.touch && !dummyEventAttached) {
    document2.addEventListener("touchstart", dummyEventListener);
    dummyEventAttached = true;
  }
  events(swiper2, "on");
}
function detachEvents() {
  const swiper2 = this;
  events(swiper2, "off");
}
const events$1 = {
  attachEvents,
  detachEvents
};
const isGridEnabled = (swiper2, params) => {
  return swiper2.grid && params.grid && params.grid.rows > 1;
};
function setBreakpoint() {
  const swiper2 = this;
  const {
    activeIndex,
    initialized,
    loopedSlides = 0,
    params,
    $el
  } = swiper2;
  const breakpoints2 = params.breakpoints;
  if (!breakpoints2 || breakpoints2 && Object.keys(breakpoints2).length === 0)
    return;
  const breakpoint = swiper2.getBreakpoint(breakpoints2, swiper2.params.breakpointsBase, swiper2.el);
  if (!breakpoint || swiper2.currentBreakpoint === breakpoint)
    return;
  const breakpointOnlyParams = breakpoint in breakpoints2 ? breakpoints2[breakpoint] : void 0;
  const breakpointParams = breakpointOnlyParams || swiper2.originalParams;
  const wasMultiRow = isGridEnabled(swiper2, params);
  const isMultiRow = isGridEnabled(swiper2, breakpointParams);
  const wasEnabled = params.enabled;
  if (wasMultiRow && !isMultiRow) {
    $el.removeClass(`${params.containerModifierClass}grid ${params.containerModifierClass}grid-column`);
    swiper2.emitContainerClasses();
  } else if (!wasMultiRow && isMultiRow) {
    $el.addClass(`${params.containerModifierClass}grid`);
    if (breakpointParams.grid.fill && breakpointParams.grid.fill === "column" || !breakpointParams.grid.fill && params.grid.fill === "column") {
      $el.addClass(`${params.containerModifierClass}grid-column`);
    }
    swiper2.emitContainerClasses();
  }
  ["navigation", "pagination", "scrollbar"].forEach((prop) => {
    const wasModuleEnabled = params[prop] && params[prop].enabled;
    const isModuleEnabled = breakpointParams[prop] && breakpointParams[prop].enabled;
    if (wasModuleEnabled && !isModuleEnabled) {
      swiper2[prop].disable();
    }
    if (!wasModuleEnabled && isModuleEnabled) {
      swiper2[prop].enable();
    }
  });
  const directionChanged = breakpointParams.direction && breakpointParams.direction !== params.direction;
  const needsReLoop = params.loop && (breakpointParams.slidesPerView !== params.slidesPerView || directionChanged);
  if (directionChanged && initialized) {
    swiper2.changeDirection();
  }
  extend$1(swiper2.params, breakpointParams);
  const isEnabled = swiper2.params.enabled;
  Object.assign(swiper2, {
    allowTouchMove: swiper2.params.allowTouchMove,
    allowSlideNext: swiper2.params.allowSlideNext,
    allowSlidePrev: swiper2.params.allowSlidePrev
  });
  if (wasEnabled && !isEnabled) {
    swiper2.disable();
  } else if (!wasEnabled && isEnabled) {
    swiper2.enable();
  }
  swiper2.currentBreakpoint = breakpoint;
  swiper2.emit("_beforeBreakpoint", breakpointParams);
  if (needsReLoop && initialized) {
    swiper2.loopDestroy();
    swiper2.loopCreate();
    swiper2.updateSlides();
    swiper2.slideTo(activeIndex - loopedSlides + swiper2.loopedSlides, 0, false);
  }
  swiper2.emit("breakpoint", breakpointParams);
}
function getBreakpoint(breakpoints2, base = "window", containerEl) {
  if (!breakpoints2 || base === "container" && !containerEl)
    return void 0;
  let breakpoint = false;
  const window2 = getWindow();
  const currentHeight = base === "window" ? window2.innerHeight : containerEl.clientHeight;
  const points = Object.keys(breakpoints2).map((point) => {
    if (typeof point === "string" && point.indexOf("@") === 0) {
      const minRatio = parseFloat(point.substr(1));
      const value = currentHeight * minRatio;
      return {
        value,
        point
      };
    }
    return {
      value: point,
      point
    };
  });
  points.sort((a, b) => parseInt(a.value, 10) - parseInt(b.value, 10));
  for (let i = 0; i < points.length; i += 1) {
    const {
      point,
      value
    } = points[i];
    if (base === "window") {
      if (window2.matchMedia(`(min-width: ${value}px)`).matches) {
        breakpoint = point;
      }
    } else if (value <= containerEl.clientWidth) {
      breakpoint = point;
    }
  }
  return breakpoint || "max";
}
const breakpoints = {
  setBreakpoint,
  getBreakpoint
};
function prepareClasses(entries, prefix) {
  const resultClasses = [];
  entries.forEach((item) => {
    if (typeof item === "object") {
      Object.keys(item).forEach((classNames) => {
        if (item[classNames]) {
          resultClasses.push(prefix + classNames);
        }
      });
    } else if (typeof item === "string") {
      resultClasses.push(prefix + item);
    }
  });
  return resultClasses;
}
function addClasses() {
  const swiper2 = this;
  const {
    classNames,
    params,
    rtl,
    $el,
    device,
    support: support2
  } = swiper2;
  const suffixes = prepareClasses(["initialized", params.direction, {
    "pointer-events": !support2.touch
  }, {
    "free-mode": swiper2.params.freeMode && params.freeMode.enabled
  }, {
    "autoheight": params.autoHeight
  }, {
    "rtl": rtl
  }, {
    "grid": params.grid && params.grid.rows > 1
  }, {
    "grid-column": params.grid && params.grid.rows > 1 && params.grid.fill === "column"
  }, {
    "android": device.android
  }, {
    "ios": device.ios
  }, {
    "css-mode": params.cssMode
  }, {
    "centered": params.cssMode && params.centeredSlides
  }, {
    "watch-progress": params.watchSlidesProgress
  }], params.containerModifierClass);
  classNames.push(...suffixes);
  $el.addClass([...classNames].join(" "));
  swiper2.emitContainerClasses();
}
function removeClasses() {
  const swiper2 = this;
  const {
    $el,
    classNames
  } = swiper2;
  $el.removeClass(classNames.join(" "));
  swiper2.emitContainerClasses();
}
const classes = {
  addClasses,
  removeClasses
};
function loadImage(imageEl, src, srcset, sizes, checkForComplete, callback) {
  const window2 = getWindow();
  let image;
  function onReady() {
    if (callback)
      callback();
  }
  const isPicture = $$1(imageEl).parent("picture")[0];
  if (!isPicture && (!imageEl.complete || !checkForComplete)) {
    if (src) {
      image = new window2.Image();
      image.onload = onReady;
      image.onerror = onReady;
      if (sizes) {
        image.sizes = sizes;
      }
      if (srcset) {
        image.srcset = srcset;
      }
      if (src) {
        image.src = src;
      }
    } else {
      onReady();
    }
  } else {
    onReady();
  }
}
function preloadImages() {
  const swiper2 = this;
  swiper2.imagesToLoad = swiper2.$el.find("img");
  function onReady() {
    if (typeof swiper2 === "undefined" || swiper2 === null || !swiper2 || swiper2.destroyed)
      return;
    if (swiper2.imagesLoaded !== void 0)
      swiper2.imagesLoaded += 1;
    if (swiper2.imagesLoaded === swiper2.imagesToLoad.length) {
      if (swiper2.params.updateOnImagesReady)
        swiper2.update();
      swiper2.emit("imagesReady");
    }
  }
  for (let i = 0; i < swiper2.imagesToLoad.length; i += 1) {
    const imageEl = swiper2.imagesToLoad[i];
    swiper2.loadImage(imageEl, imageEl.currentSrc || imageEl.getAttribute("src"), imageEl.srcset || imageEl.getAttribute("srcset"), imageEl.sizes || imageEl.getAttribute("sizes"), true, onReady);
  }
}
const images = {
  loadImage,
  preloadImages
};
function checkOverflow() {
  const swiper2 = this;
  const {
    isLocked: wasLocked,
    params
  } = swiper2;
  const {
    slidesOffsetBefore
  } = params;
  if (slidesOffsetBefore) {
    const lastSlideIndex = swiper2.slides.length - 1;
    const lastSlideRightEdge = swiper2.slidesGrid[lastSlideIndex] + swiper2.slidesSizesGrid[lastSlideIndex] + slidesOffsetBefore * 2;
    swiper2.isLocked = swiper2.size > lastSlideRightEdge;
  } else {
    swiper2.isLocked = swiper2.snapGrid.length === 1;
  }
  if (params.allowSlideNext === true) {
    swiper2.allowSlideNext = !swiper2.isLocked;
  }
  if (params.allowSlidePrev === true) {
    swiper2.allowSlidePrev = !swiper2.isLocked;
  }
  if (wasLocked && wasLocked !== swiper2.isLocked) {
    swiper2.isEnd = false;
  }
  if (wasLocked !== swiper2.isLocked) {
    swiper2.emit(swiper2.isLocked ? "lock" : "unlock");
  }
}
const checkOverflow$1 = {
  checkOverflow
};
const defaults$2 = {
  init: true,
  direction: "horizontal",
  touchEventsTarget: "wrapper",
  initialSlide: 0,
  speed: 300,
  cssMode: false,
  updateOnWindowResize: true,
  resizeObserver: true,
  nested: false,
  createElements: false,
  enabled: true,
  focusableElements: "input, select, option, textarea, button, video, label",
  // Overrides
  width: null,
  height: null,
  //
  preventInteractionOnTransition: false,
  // ssr
  userAgent: null,
  url: null,
  // To support iOS's swipe-to-go-back gesture (when being used in-app).
  edgeSwipeDetection: false,
  edgeSwipeThreshold: 20,
  // Autoheight
  autoHeight: false,
  // Set wrapper width
  setWrapperSize: false,
  // Virtual Translate
  virtualTranslate: false,
  // Effects
  effect: "slide",
  // 'slide' or 'fade' or 'cube' or 'coverflow' or 'flip'
  // Breakpoints
  breakpoints: void 0,
  breakpointsBase: "window",
  // Slides grid
  spaceBetween: 0,
  slidesPerView: 1,
  slidesPerGroup: 1,
  slidesPerGroupSkip: 0,
  slidesPerGroupAuto: false,
  centeredSlides: false,
  centeredSlidesBounds: false,
  slidesOffsetBefore: 0,
  // in px
  slidesOffsetAfter: 0,
  // in px
  normalizeSlideIndex: true,
  centerInsufficientSlides: false,
  // Disable swiper and hide navigation when container not overflow
  watchOverflow: true,
  // Round length
  roundLengths: false,
  // Touches
  touchRatio: 1,
  touchAngle: 45,
  simulateTouch: true,
  shortSwipes: true,
  longSwipes: true,
  longSwipesRatio: 0.5,
  longSwipesMs: 300,
  followFinger: true,
  allowTouchMove: true,
  threshold: 0,
  touchMoveStopPropagation: false,
  touchStartPreventDefault: true,
  touchStartForcePreventDefault: false,
  touchReleaseOnEdges: false,
  // Unique Navigation Elements
  uniqueNavElements: true,
  // Resistance
  resistance: true,
  resistanceRatio: 0.85,
  // Progress
  watchSlidesProgress: false,
  // Cursor
  grabCursor: false,
  // Clicks
  preventClicks: true,
  preventClicksPropagation: true,
  slideToClickedSlide: false,
  // Images
  preloadImages: true,
  updateOnImagesReady: true,
  // loop
  loop: false,
  loopAdditionalSlides: 0,
  loopedSlides: null,
  loopedSlidesLimit: true,
  loopFillGroupWithBlank: false,
  loopPreventsSlide: true,
  // rewind
  rewind: false,
  // Swiping/no swiping
  allowSlidePrev: true,
  allowSlideNext: true,
  swipeHandler: null,
  // '.swipe-handler',
  noSwiping: true,
  noSwipingClass: "swiper-no-swiping",
  noSwipingSelector: null,
  // Passive Listeners
  passiveListeners: true,
  maxBackfaceHiddenSlides: 10,
  // NS
  containerModifierClass: "swiper-",
  // NEW
  slideClass: "swiper-slide",
  slideBlankClass: "swiper-slide-invisible-blank",
  slideActiveClass: "swiper-slide-active",
  slideDuplicateActiveClass: "swiper-slide-duplicate-active",
  slideVisibleClass: "swiper-slide-visible",
  slideDuplicateClass: "swiper-slide-duplicate",
  slideNextClass: "swiper-slide-next",
  slideDuplicateNextClass: "swiper-slide-duplicate-next",
  slidePrevClass: "swiper-slide-prev",
  slideDuplicatePrevClass: "swiper-slide-duplicate-prev",
  wrapperClass: "swiper-wrapper",
  // Callbacks
  runCallbacksOnInit: true,
  // Internals
  _emitClasses: false
};
function moduleExtendParams(params, allModulesParams) {
  return function extendParams(obj = {}) {
    const moduleParamName = Object.keys(obj)[0];
    const moduleParams = obj[moduleParamName];
    if (typeof moduleParams !== "object" || moduleParams === null) {
      extend$1(allModulesParams, obj);
      return;
    }
    if (["navigation", "pagination", "scrollbar"].indexOf(moduleParamName) >= 0 && params[moduleParamName] === true) {
      params[moduleParamName] = {
        auto: true
      };
    }
    if (!(moduleParamName in params && "enabled" in moduleParams)) {
      extend$1(allModulesParams, obj);
      return;
    }
    if (params[moduleParamName] === true) {
      params[moduleParamName] = {
        enabled: true
      };
    }
    if (typeof params[moduleParamName] === "object" && !("enabled" in params[moduleParamName])) {
      params[moduleParamName].enabled = true;
    }
    if (!params[moduleParamName])
      params[moduleParamName] = {
        enabled: false
      };
    extend$1(allModulesParams, obj);
  };
}
const prototypes = {
  eventsEmitter,
  update,
  translate,
  transition,
  slide,
  loop,
  grabCursor,
  events: events$1,
  breakpoints,
  checkOverflow: checkOverflow$1,
  classes,
  images
};
const extendedDefaults = {};
class Swiper {
  constructor(...args) {
    let el;
    let params;
    if (args.length === 1 && args[0].constructor && Object.prototype.toString.call(args[0]).slice(8, -1) === "Object") {
      params = args[0];
    } else {
      [el, params] = args;
    }
    if (!params)
      params = {};
    params = extend$1({}, params);
    if (el && !params.el)
      params.el = el;
    if (params.el && $$1(params.el).length > 1) {
      const swipers = [];
      $$1(params.el).each((containerEl) => {
        const newParams = extend$1({}, params, {
          el: containerEl
        });
        swipers.push(new Swiper(newParams));
      });
      return swipers;
    }
    const swiper2 = this;
    swiper2.__swiper__ = true;
    swiper2.support = getSupport();
    swiper2.device = getDevice({
      userAgent: params.userAgent
    });
    swiper2.browser = getBrowser();
    swiper2.eventsListeners = {};
    swiper2.eventsAnyListeners = [];
    swiper2.modules = [...swiper2.__modules__];
    if (params.modules && Array.isArray(params.modules)) {
      swiper2.modules.push(...params.modules);
    }
    const allModulesParams = {};
    swiper2.modules.forEach((mod) => {
      mod({
        swiper: swiper2,
        extendParams: moduleExtendParams(params, allModulesParams),
        on: swiper2.on.bind(swiper2),
        once: swiper2.once.bind(swiper2),
        off: swiper2.off.bind(swiper2),
        emit: swiper2.emit.bind(swiper2)
      });
    });
    const swiperParams = extend$1({}, defaults$2, allModulesParams);
    swiper2.params = extend$1({}, swiperParams, extendedDefaults, params);
    swiper2.originalParams = extend$1({}, swiper2.params);
    swiper2.passedParams = extend$1({}, params);
    if (swiper2.params && swiper2.params.on) {
      Object.keys(swiper2.params.on).forEach((eventName) => {
        swiper2.on(eventName, swiper2.params.on[eventName]);
      });
    }
    if (swiper2.params && swiper2.params.onAny) {
      swiper2.onAny(swiper2.params.onAny);
    }
    swiper2.$ = $$1;
    Object.assign(swiper2, {
      enabled: swiper2.params.enabled,
      el,
      // Classes
      classNames: [],
      // Slides
      slides: $$1(),
      slidesGrid: [],
      snapGrid: [],
      slidesSizesGrid: [],
      // isDirection
      isHorizontal() {
        return swiper2.params.direction === "horizontal";
      },
      isVertical() {
        return swiper2.params.direction === "vertical";
      },
      // Indexes
      activeIndex: 0,
      realIndex: 0,
      //
      isBeginning: true,
      isEnd: false,
      // Props
      translate: 0,
      previousTranslate: 0,
      progress: 0,
      velocity: 0,
      animating: false,
      // Locks
      allowSlideNext: swiper2.params.allowSlideNext,
      allowSlidePrev: swiper2.params.allowSlidePrev,
      // Touch Events
      touchEvents: function touchEvents() {
        const touch = ["touchstart", "touchmove", "touchend", "touchcancel"];
        const desktop = ["pointerdown", "pointermove", "pointerup"];
        swiper2.touchEventsTouch = {
          start: touch[0],
          move: touch[1],
          end: touch[2],
          cancel: touch[3]
        };
        swiper2.touchEventsDesktop = {
          start: desktop[0],
          move: desktop[1],
          end: desktop[2]
        };
        return swiper2.support.touch || !swiper2.params.simulateTouch ? swiper2.touchEventsTouch : swiper2.touchEventsDesktop;
      }(),
      touchEventsData: {
        isTouched: void 0,
        isMoved: void 0,
        allowTouchCallbacks: void 0,
        touchStartTime: void 0,
        isScrolling: void 0,
        currentTranslate: void 0,
        startTranslate: void 0,
        allowThresholdMove: void 0,
        // Form elements to match
        focusableElements: swiper2.params.focusableElements,
        // Last click time
        lastClickTime: now(),
        clickTimeout: void 0,
        // Velocities
        velocities: [],
        allowMomentumBounce: void 0,
        isTouchEvent: void 0,
        startMoving: void 0
      },
      // Clicks
      allowClick: true,
      // Touches
      allowTouchMove: swiper2.params.allowTouchMove,
      touches: {
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0,
        diff: 0
      },
      // Images
      imagesToLoad: [],
      imagesLoaded: 0
    });
    swiper2.emit("_swiper");
    if (swiper2.params.init) {
      swiper2.init();
    }
    return swiper2;
  }
  enable() {
    const swiper2 = this;
    if (swiper2.enabled)
      return;
    swiper2.enabled = true;
    if (swiper2.params.grabCursor) {
      swiper2.setGrabCursor();
    }
    swiper2.emit("enable");
  }
  disable() {
    const swiper2 = this;
    if (!swiper2.enabled)
      return;
    swiper2.enabled = false;
    if (swiper2.params.grabCursor) {
      swiper2.unsetGrabCursor();
    }
    swiper2.emit("disable");
  }
  setProgress(progress, speed) {
    const swiper2 = this;
    progress = Math.min(Math.max(progress, 0), 1);
    const min = swiper2.minTranslate();
    const max = swiper2.maxTranslate();
    const current = (max - min) * progress + min;
    swiper2.translateTo(current, typeof speed === "undefined" ? 0 : speed);
    swiper2.updateActiveIndex();
    swiper2.updateSlidesClasses();
  }
  emitContainerClasses() {
    const swiper2 = this;
    if (!swiper2.params._emitClasses || !swiper2.el)
      return;
    const cls = swiper2.el.className.split(" ").filter((className) => {
      return className.indexOf("swiper") === 0 || className.indexOf(swiper2.params.containerModifierClass) === 0;
    });
    swiper2.emit("_containerClasses", cls.join(" "));
  }
  getSlideClasses(slideEl) {
    const swiper2 = this;
    if (swiper2.destroyed)
      return "";
    return slideEl.className.split(" ").filter((className) => {
      return className.indexOf("swiper-slide") === 0 || className.indexOf(swiper2.params.slideClass) === 0;
    }).join(" ");
  }
  emitSlidesClasses() {
    const swiper2 = this;
    if (!swiper2.params._emitClasses || !swiper2.el)
      return;
    const updates = [];
    swiper2.slides.each((slideEl) => {
      const classNames = swiper2.getSlideClasses(slideEl);
      updates.push({
        slideEl,
        classNames
      });
      swiper2.emit("_slideClass", slideEl, classNames);
    });
    swiper2.emit("_slideClasses", updates);
  }
  slidesPerViewDynamic(view = "current", exact = false) {
    const swiper2 = this;
    const {
      params,
      slides,
      slidesGrid,
      slidesSizesGrid,
      size: swiperSize,
      activeIndex
    } = swiper2;
    let spv = 1;
    if (params.centeredSlides) {
      let slideSize = slides[activeIndex].swiperSlideSize;
      let breakLoop;
      for (let i = activeIndex + 1; i < slides.length; i += 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
      for (let i = activeIndex - 1; i >= 0; i -= 1) {
        if (slides[i] && !breakLoop) {
          slideSize += slides[i].swiperSlideSize;
          spv += 1;
          if (slideSize > swiperSize)
            breakLoop = true;
        }
      }
    } else {
      if (view === "current") {
        for (let i = activeIndex + 1; i < slides.length; i += 1) {
          const slideInView = exact ? slidesGrid[i] + slidesSizesGrid[i] - slidesGrid[activeIndex] < swiperSize : slidesGrid[i] - slidesGrid[activeIndex] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      } else {
        for (let i = activeIndex - 1; i >= 0; i -= 1) {
          const slideInView = slidesGrid[activeIndex] - slidesGrid[i] < swiperSize;
          if (slideInView) {
            spv += 1;
          }
        }
      }
    }
    return spv;
  }
  update() {
    const swiper2 = this;
    if (!swiper2 || swiper2.destroyed)
      return;
    const {
      snapGrid,
      params
    } = swiper2;
    if (params.breakpoints) {
      swiper2.setBreakpoint();
    }
    swiper2.updateSize();
    swiper2.updateSlides();
    swiper2.updateProgress();
    swiper2.updateSlidesClasses();
    function setTranslate2() {
      const translateValue = swiper2.rtlTranslate ? swiper2.translate * -1 : swiper2.translate;
      const newTranslate = Math.min(Math.max(translateValue, swiper2.maxTranslate()), swiper2.minTranslate());
      swiper2.setTranslate(newTranslate);
      swiper2.updateActiveIndex();
      swiper2.updateSlidesClasses();
    }
    let translated;
    if (swiper2.params.freeMode && swiper2.params.freeMode.enabled) {
      setTranslate2();
      if (swiper2.params.autoHeight) {
        swiper2.updateAutoHeight();
      }
    } else {
      if ((swiper2.params.slidesPerView === "auto" || swiper2.params.slidesPerView > 1) && swiper2.isEnd && !swiper2.params.centeredSlides) {
        translated = swiper2.slideTo(swiper2.slides.length - 1, 0, false, true);
      } else {
        translated = swiper2.slideTo(swiper2.activeIndex, 0, false, true);
      }
      if (!translated) {
        setTranslate2();
      }
    }
    if (params.watchOverflow && snapGrid !== swiper2.snapGrid) {
      swiper2.checkOverflow();
    }
    swiper2.emit("update");
  }
  changeDirection(newDirection, needUpdate = true) {
    const swiper2 = this;
    const currentDirection = swiper2.params.direction;
    if (!newDirection) {
      newDirection = currentDirection === "horizontal" ? "vertical" : "horizontal";
    }
    if (newDirection === currentDirection || newDirection !== "horizontal" && newDirection !== "vertical") {
      return swiper2;
    }
    swiper2.$el.removeClass(`${swiper2.params.containerModifierClass}${currentDirection}`).addClass(`${swiper2.params.containerModifierClass}${newDirection}`);
    swiper2.emitContainerClasses();
    swiper2.params.direction = newDirection;
    swiper2.slides.each((slideEl) => {
      if (newDirection === "vertical") {
        slideEl.style.width = "";
      } else {
        slideEl.style.height = "";
      }
    });
    swiper2.emit("changeDirection");
    if (needUpdate)
      swiper2.update();
    return swiper2;
  }
  changeLanguageDirection(direction) {
    const swiper2 = this;
    if (swiper2.rtl && direction === "rtl" || !swiper2.rtl && direction === "ltr")
      return;
    swiper2.rtl = direction === "rtl";
    swiper2.rtlTranslate = swiper2.params.direction === "horizontal" && swiper2.rtl;
    if (swiper2.rtl) {
      swiper2.$el.addClass(`${swiper2.params.containerModifierClass}rtl`);
      swiper2.el.dir = "rtl";
    } else {
      swiper2.$el.removeClass(`${swiper2.params.containerModifierClass}rtl`);
      swiper2.el.dir = "ltr";
    }
    swiper2.update();
  }
  mount(el) {
    const swiper2 = this;
    if (swiper2.mounted)
      return true;
    const $el = $$1(el || swiper2.params.el);
    el = $el[0];
    if (!el) {
      return false;
    }
    el.swiper = swiper2;
    const getWrapperSelector = () => {
      return `.${(swiper2.params.wrapperClass || "").trim().split(" ").join(".")}`;
    };
    const getWrapper = () => {
      if (el && el.shadowRoot && el.shadowRoot.querySelector) {
        const res = $$1(el.shadowRoot.querySelector(getWrapperSelector()));
        res.children = (options) => $el.children(options);
        return res;
      }
      if (!$el.children) {
        return $$1($el).children(getWrapperSelector());
      }
      return $el.children(getWrapperSelector());
    };
    let $wrapperEl = getWrapper();
    if ($wrapperEl.length === 0 && swiper2.params.createElements) {
      const document2 = getDocument();
      const wrapper = document2.createElement("div");
      $wrapperEl = $$1(wrapper);
      wrapper.className = swiper2.params.wrapperClass;
      $el.append(wrapper);
      $el.children(`.${swiper2.params.slideClass}`).each((slideEl) => {
        $wrapperEl.append(slideEl);
      });
    }
    Object.assign(swiper2, {
      $el,
      el,
      $wrapperEl,
      wrapperEl: $wrapperEl[0],
      mounted: true,
      // RTL
      rtl: el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl",
      rtlTranslate: swiper2.params.direction === "horizontal" && (el.dir.toLowerCase() === "rtl" || $el.css("direction") === "rtl"),
      wrongRTL: $wrapperEl.css("display") === "-webkit-box"
    });
    return true;
  }
  init(el) {
    const swiper2 = this;
    if (swiper2.initialized)
      return swiper2;
    const mounted = swiper2.mount(el);
    if (mounted === false)
      return swiper2;
    swiper2.emit("beforeInit");
    if (swiper2.params.breakpoints) {
      swiper2.setBreakpoint();
    }
    swiper2.addClasses();
    if (swiper2.params.loop) {
      swiper2.loopCreate();
    }
    swiper2.updateSize();
    swiper2.updateSlides();
    if (swiper2.params.watchOverflow) {
      swiper2.checkOverflow();
    }
    if (swiper2.params.grabCursor && swiper2.enabled) {
      swiper2.setGrabCursor();
    }
    if (swiper2.params.preloadImages) {
      swiper2.preloadImages();
    }
    if (swiper2.params.loop) {
      swiper2.slideTo(swiper2.params.initialSlide + swiper2.loopedSlides, 0, swiper2.params.runCallbacksOnInit, false, true);
    } else {
      swiper2.slideTo(swiper2.params.initialSlide, 0, swiper2.params.runCallbacksOnInit, false, true);
    }
    swiper2.attachEvents();
    swiper2.initialized = true;
    swiper2.emit("init");
    swiper2.emit("afterInit");
    return swiper2;
  }
  destroy(deleteInstance = true, cleanStyles = true) {
    const swiper2 = this;
    const {
      params,
      $el,
      $wrapperEl,
      slides
    } = swiper2;
    if (typeof swiper2.params === "undefined" || swiper2.destroyed) {
      return null;
    }
    swiper2.emit("beforeDestroy");
    swiper2.initialized = false;
    swiper2.detachEvents();
    if (params.loop) {
      swiper2.loopDestroy();
    }
    if (cleanStyles) {
      swiper2.removeClasses();
      $el.removeAttr("style");
      $wrapperEl.removeAttr("style");
      if (slides && slides.length) {
        slides.removeClass([params.slideVisibleClass, params.slideActiveClass, params.slideNextClass, params.slidePrevClass].join(" ")).removeAttr("style").removeAttr("data-swiper-slide-index");
      }
    }
    swiper2.emit("destroy");
    Object.keys(swiper2.eventsListeners).forEach((eventName) => {
      swiper2.off(eventName);
    });
    if (deleteInstance !== false) {
      swiper2.$el[0].swiper = null;
      deleteProps(swiper2);
    }
    swiper2.destroyed = true;
    return null;
  }
  static extendDefaults(newDefaults) {
    extend$1(extendedDefaults, newDefaults);
  }
  static get extendedDefaults() {
    return extendedDefaults;
  }
  static get defaults() {
    return defaults$2;
  }
  static installModule(mod) {
    if (!Swiper.prototype.__modules__)
      Swiper.prototype.__modules__ = [];
    const modules = Swiper.prototype.__modules__;
    if (typeof mod === "function" && modules.indexOf(mod) < 0) {
      modules.push(mod);
    }
  }
  static use(module) {
    if (Array.isArray(module)) {
      module.forEach((m) => Swiper.installModule(m));
      return Swiper;
    }
    Swiper.installModule(module);
    return Swiper;
  }
}
Object.keys(prototypes).forEach((prototypeGroup) => {
  Object.keys(prototypes[prototypeGroup]).forEach((protoMethod) => {
    Swiper.prototype[protoMethod] = prototypes[prototypeGroup][protoMethod];
  });
});
Swiper.use([Resize, Observer]);
function createElementIfNotDefined(swiper2, originalParams, params, checkProps) {
  const document2 = getDocument();
  if (swiper2.params.createElements) {
    Object.keys(checkProps).forEach((key) => {
      if (!params[key] && params.auto === true) {
        let element = swiper2.$el.children(`.${checkProps[key]}`)[0];
        if (!element) {
          element = document2.createElement("div");
          element.className = checkProps[key];
          swiper2.$el.append(element);
        }
        params[key] = element;
        originalParams[key] = element;
      }
    });
  }
  return params;
}
function Navigation({
  swiper: swiper2,
  extendParams,
  on: on2,
  emit
}) {
  extendParams({
    navigation: {
      nextEl: null,
      prevEl: null,
      hideOnClick: false,
      disabledClass: "swiper-button-disabled",
      hiddenClass: "swiper-button-hidden",
      lockClass: "swiper-button-lock",
      navigationDisabledClass: "swiper-navigation-disabled"
    }
  });
  swiper2.navigation = {
    nextEl: null,
    $nextEl: null,
    prevEl: null,
    $prevEl: null
  };
  function getEl(el) {
    let $el;
    if (el) {
      $el = $$1(el);
      if (swiper2.params.uniqueNavElements && typeof el === "string" && $el.length > 1 && swiper2.$el.find(el).length === 1) {
        $el = swiper2.$el.find(el);
      }
    }
    return $el;
  }
  function toggleEl($el, disabled) {
    const params = swiper2.params.navigation;
    if ($el && $el.length > 0) {
      $el[disabled ? "addClass" : "removeClass"](params.disabledClass);
      if ($el[0] && $el[0].tagName === "BUTTON")
        $el[0].disabled = disabled;
      if (swiper2.params.watchOverflow && swiper2.enabled) {
        $el[swiper2.isLocked ? "addClass" : "removeClass"](params.lockClass);
      }
    }
  }
  function update2() {
    if (swiper2.params.loop)
      return;
    const {
      $nextEl,
      $prevEl
    } = swiper2.navigation;
    toggleEl($prevEl, swiper2.isBeginning && !swiper2.params.rewind);
    toggleEl($nextEl, swiper2.isEnd && !swiper2.params.rewind);
  }
  function onPrevClick(e) {
    e.preventDefault();
    if (swiper2.isBeginning && !swiper2.params.loop && !swiper2.params.rewind)
      return;
    swiper2.slidePrev();
    emit("navigationPrev");
  }
  function onNextClick(e) {
    e.preventDefault();
    if (swiper2.isEnd && !swiper2.params.loop && !swiper2.params.rewind)
      return;
    swiper2.slideNext();
    emit("navigationNext");
  }
  function init4() {
    const params = swiper2.params.navigation;
    swiper2.params.navigation = createElementIfNotDefined(swiper2, swiper2.originalParams.navigation, swiper2.params.navigation, {
      nextEl: "swiper-button-next",
      prevEl: "swiper-button-prev"
    });
    if (!(params.nextEl || params.prevEl))
      return;
    const $nextEl = getEl(params.nextEl);
    const $prevEl = getEl(params.prevEl);
    if ($nextEl && $nextEl.length > 0) {
      $nextEl.on("click", onNextClick);
    }
    if ($prevEl && $prevEl.length > 0) {
      $prevEl.on("click", onPrevClick);
    }
    Object.assign(swiper2.navigation, {
      $nextEl,
      nextEl: $nextEl && $nextEl[0],
      $prevEl,
      prevEl: $prevEl && $prevEl[0]
    });
    if (!swiper2.enabled) {
      if ($nextEl)
        $nextEl.addClass(params.lockClass);
      if ($prevEl)
        $prevEl.addClass(params.lockClass);
    }
  }
  function destroy() {
    const {
      $nextEl,
      $prevEl
    } = swiper2.navigation;
    if ($nextEl && $nextEl.length) {
      $nextEl.off("click", onNextClick);
      $nextEl.removeClass(swiper2.params.navigation.disabledClass);
    }
    if ($prevEl && $prevEl.length) {
      $prevEl.off("click", onPrevClick);
      $prevEl.removeClass(swiper2.params.navigation.disabledClass);
    }
  }
  on2("init", () => {
    if (swiper2.params.navigation.enabled === false) {
      disable();
    } else {
      init4();
      update2();
    }
  });
  on2("toEdge fromEdge lock unlock", () => {
    update2();
  });
  on2("destroy", () => {
    destroy();
  });
  on2("enable disable", () => {
    const {
      $nextEl,
      $prevEl
    } = swiper2.navigation;
    if ($nextEl) {
      $nextEl[swiper2.enabled ? "removeClass" : "addClass"](swiper2.params.navigation.lockClass);
    }
    if ($prevEl) {
      $prevEl[swiper2.enabled ? "removeClass" : "addClass"](swiper2.params.navigation.lockClass);
    }
  });
  on2("click", (_s, e) => {
    const {
      $nextEl,
      $prevEl
    } = swiper2.navigation;
    const targetEl = e.target;
    if (swiper2.params.navigation.hideOnClick && !$$1(targetEl).is($prevEl) && !$$1(targetEl).is($nextEl)) {
      if (swiper2.pagination && swiper2.params.pagination && swiper2.params.pagination.clickable && (swiper2.pagination.el === targetEl || swiper2.pagination.el.contains(targetEl)))
        return;
      let isHidden;
      if ($nextEl) {
        isHidden = $nextEl.hasClass(swiper2.params.navigation.hiddenClass);
      } else if ($prevEl) {
        isHidden = $prevEl.hasClass(swiper2.params.navigation.hiddenClass);
      }
      if (isHidden === true) {
        emit("navigationShow");
      } else {
        emit("navigationHide");
      }
      if ($nextEl) {
        $nextEl.toggleClass(swiper2.params.navigation.hiddenClass);
      }
      if ($prevEl) {
        $prevEl.toggleClass(swiper2.params.navigation.hiddenClass);
      }
    }
  });
  const enable = () => {
    swiper2.$el.removeClass(swiper2.params.navigation.navigationDisabledClass);
    init4();
    update2();
  };
  const disable = () => {
    swiper2.$el.addClass(swiper2.params.navigation.navigationDisabledClass);
    destroy();
  };
  Object.assign(swiper2.navigation, {
    enable,
    disable,
    update: update2,
    init: init4,
    destroy
  });
}
function classesToSelector(classes2 = "") {
  return `.${classes2.trim().replace(/([\.:!\/])/g, "\\$1").replace(/ /g, ".")}`;
}
function Pagination({
  swiper: swiper2,
  extendParams,
  on: on2,
  emit
}) {
  const pfx = "swiper-pagination";
  extendParams({
    pagination: {
      el: null,
      bulletElement: "span",
      clickable: false,
      hideOnClick: false,
      renderBullet: null,
      renderProgressbar: null,
      renderFraction: null,
      renderCustom: null,
      progressbarOpposite: false,
      type: "bullets",
      // 'bullets' or 'progressbar' or 'fraction' or 'custom'
      dynamicBullets: false,
      dynamicMainBullets: 1,
      formatFractionCurrent: (number) => number,
      formatFractionTotal: (number) => number,
      bulletClass: `${pfx}-bullet`,
      bulletActiveClass: `${pfx}-bullet-active`,
      modifierClass: `${pfx}-`,
      currentClass: `${pfx}-current`,
      totalClass: `${pfx}-total`,
      hiddenClass: `${pfx}-hidden`,
      progressbarFillClass: `${pfx}-progressbar-fill`,
      progressbarOppositeClass: `${pfx}-progressbar-opposite`,
      clickableClass: `${pfx}-clickable`,
      lockClass: `${pfx}-lock`,
      horizontalClass: `${pfx}-horizontal`,
      verticalClass: `${pfx}-vertical`,
      paginationDisabledClass: `${pfx}-disabled`
    }
  });
  swiper2.pagination = {
    el: null,
    $el: null,
    bullets: []
  };
  let bulletSize;
  let dynamicBulletIndex = 0;
  function isPaginationDisabled() {
    return !swiper2.params.pagination.el || !swiper2.pagination.el || !swiper2.pagination.$el || swiper2.pagination.$el.length === 0;
  }
  function setSideBullets($bulletEl, position) {
    const {
      bulletActiveClass
    } = swiper2.params.pagination;
    $bulletEl[position]().addClass(`${bulletActiveClass}-${position}`)[position]().addClass(`${bulletActiveClass}-${position}-${position}`);
  }
  function update2() {
    const rtl = swiper2.rtl;
    const params = swiper2.params.pagination;
    if (isPaginationDisabled())
      return;
    const slidesLength = swiper2.virtual && swiper2.params.virtual.enabled ? swiper2.virtual.slides.length : swiper2.slides.length;
    const $el = swiper2.pagination.$el;
    let current;
    const total = swiper2.params.loop ? Math.ceil((slidesLength - swiper2.loopedSlides * 2) / swiper2.params.slidesPerGroup) : swiper2.snapGrid.length;
    if (swiper2.params.loop) {
      current = Math.ceil((swiper2.activeIndex - swiper2.loopedSlides) / swiper2.params.slidesPerGroup);
      if (current > slidesLength - 1 - swiper2.loopedSlides * 2) {
        current -= slidesLength - swiper2.loopedSlides * 2;
      }
      if (current > total - 1)
        current -= total;
      if (current < 0 && swiper2.params.paginationType !== "bullets")
        current = total + current;
    } else if (typeof swiper2.snapIndex !== "undefined") {
      current = swiper2.snapIndex;
    } else {
      current = swiper2.activeIndex || 0;
    }
    if (params.type === "bullets" && swiper2.pagination.bullets && swiper2.pagination.bullets.length > 0) {
      const bullets = swiper2.pagination.bullets;
      let firstIndex;
      let lastIndex;
      let midIndex;
      if (params.dynamicBullets) {
        bulletSize = bullets.eq(0)[swiper2.isHorizontal() ? "outerWidth" : "outerHeight"](true);
        $el.css(swiper2.isHorizontal() ? "width" : "height", `${bulletSize * (params.dynamicMainBullets + 4)}px`);
        if (params.dynamicMainBullets > 1 && swiper2.previousIndex !== void 0) {
          dynamicBulletIndex += current - (swiper2.previousIndex - swiper2.loopedSlides || 0);
          if (dynamicBulletIndex > params.dynamicMainBullets - 1) {
            dynamicBulletIndex = params.dynamicMainBullets - 1;
          } else if (dynamicBulletIndex < 0) {
            dynamicBulletIndex = 0;
          }
        }
        firstIndex = Math.max(current - dynamicBulletIndex, 0);
        lastIndex = firstIndex + (Math.min(bullets.length, params.dynamicMainBullets) - 1);
        midIndex = (lastIndex + firstIndex) / 2;
      }
      bullets.removeClass(["", "-next", "-next-next", "-prev", "-prev-prev", "-main"].map((suffix) => `${params.bulletActiveClass}${suffix}`).join(" "));
      if ($el.length > 1) {
        bullets.each((bullet) => {
          const $bullet = $$1(bullet);
          const bulletIndex = $bullet.index();
          if (bulletIndex === current) {
            $bullet.addClass(params.bulletActiveClass);
          }
          if (params.dynamicBullets) {
            if (bulletIndex >= firstIndex && bulletIndex <= lastIndex) {
              $bullet.addClass(`${params.bulletActiveClass}-main`);
            }
            if (bulletIndex === firstIndex) {
              setSideBullets($bullet, "prev");
            }
            if (bulletIndex === lastIndex) {
              setSideBullets($bullet, "next");
            }
          }
        });
      } else {
        const $bullet = bullets.eq(current);
        const bulletIndex = $bullet.index();
        $bullet.addClass(params.bulletActiveClass);
        if (params.dynamicBullets) {
          const $firstDisplayedBullet = bullets.eq(firstIndex);
          const $lastDisplayedBullet = bullets.eq(lastIndex);
          for (let i = firstIndex; i <= lastIndex; i += 1) {
            bullets.eq(i).addClass(`${params.bulletActiveClass}-main`);
          }
          if (swiper2.params.loop) {
            if (bulletIndex >= bullets.length) {
              for (let i = params.dynamicMainBullets; i >= 0; i -= 1) {
                bullets.eq(bullets.length - i).addClass(`${params.bulletActiveClass}-main`);
              }
              bullets.eq(bullets.length - params.dynamicMainBullets - 1).addClass(`${params.bulletActiveClass}-prev`);
            } else {
              setSideBullets($firstDisplayedBullet, "prev");
              setSideBullets($lastDisplayedBullet, "next");
            }
          } else {
            setSideBullets($firstDisplayedBullet, "prev");
            setSideBullets($lastDisplayedBullet, "next");
          }
        }
      }
      if (params.dynamicBullets) {
        const dynamicBulletsLength = Math.min(bullets.length, params.dynamicMainBullets + 4);
        const bulletsOffset = (bulletSize * dynamicBulletsLength - bulletSize) / 2 - midIndex * bulletSize;
        const offsetProp = rtl ? "right" : "left";
        bullets.css(swiper2.isHorizontal() ? offsetProp : "top", `${bulletsOffset}px`);
      }
    }
    if (params.type === "fraction") {
      $el.find(classesToSelector(params.currentClass)).text(params.formatFractionCurrent(current + 1));
      $el.find(classesToSelector(params.totalClass)).text(params.formatFractionTotal(total));
    }
    if (params.type === "progressbar") {
      let progressbarDirection;
      if (params.progressbarOpposite) {
        progressbarDirection = swiper2.isHorizontal() ? "vertical" : "horizontal";
      } else {
        progressbarDirection = swiper2.isHorizontal() ? "horizontal" : "vertical";
      }
      const scale = (current + 1) / total;
      let scaleX = 1;
      let scaleY = 1;
      if (progressbarDirection === "horizontal") {
        scaleX = scale;
      } else {
        scaleY = scale;
      }
      $el.find(classesToSelector(params.progressbarFillClass)).transform(`translate3d(0,0,0) scaleX(${scaleX}) scaleY(${scaleY})`).transition(swiper2.params.speed);
    }
    if (params.type === "custom" && params.renderCustom) {
      $el.html(params.renderCustom(swiper2, current + 1, total));
      emit("paginationRender", $el[0]);
    } else {
      emit("paginationUpdate", $el[0]);
    }
    if (swiper2.params.watchOverflow && swiper2.enabled) {
      $el[swiper2.isLocked ? "addClass" : "removeClass"](params.lockClass);
    }
  }
  function render3() {
    const params = swiper2.params.pagination;
    if (isPaginationDisabled())
      return;
    const slidesLength = swiper2.virtual && swiper2.params.virtual.enabled ? swiper2.virtual.slides.length : swiper2.slides.length;
    const $el = swiper2.pagination.$el;
    let paginationHTML = "";
    if (params.type === "bullets") {
      let numberOfBullets = swiper2.params.loop ? Math.ceil((slidesLength - swiper2.loopedSlides * 2) / swiper2.params.slidesPerGroup) : swiper2.snapGrid.length;
      if (swiper2.params.freeMode && swiper2.params.freeMode.enabled && !swiper2.params.loop && numberOfBullets > slidesLength) {
        numberOfBullets = slidesLength;
      }
      for (let i = 0; i < numberOfBullets; i += 1) {
        if (params.renderBullet) {
          paginationHTML += params.renderBullet.call(swiper2, i, params.bulletClass);
        } else {
          paginationHTML += `<${params.bulletElement} class="${params.bulletClass}"></${params.bulletElement}>`;
        }
      }
      $el.html(paginationHTML);
      swiper2.pagination.bullets = $el.find(classesToSelector(params.bulletClass));
    }
    if (params.type === "fraction") {
      if (params.renderFraction) {
        paginationHTML = params.renderFraction.call(swiper2, params.currentClass, params.totalClass);
      } else {
        paginationHTML = `<span class="${params.currentClass}"></span> / <span class="${params.totalClass}"></span>`;
      }
      $el.html(paginationHTML);
    }
    if (params.type === "progressbar") {
      if (params.renderProgressbar) {
        paginationHTML = params.renderProgressbar.call(swiper2, params.progressbarFillClass);
      } else {
        paginationHTML = `<span class="${params.progressbarFillClass}"></span>`;
      }
      $el.html(paginationHTML);
    }
    if (params.type !== "custom") {
      emit("paginationRender", swiper2.pagination.$el[0]);
    }
  }
  function init4() {
    swiper2.params.pagination = createElementIfNotDefined(swiper2, swiper2.originalParams.pagination, swiper2.params.pagination, {
      el: "swiper-pagination"
    });
    const params = swiper2.params.pagination;
    if (!params.el)
      return;
    let $el = $$1(params.el);
    if ($el.length === 0)
      return;
    if (swiper2.params.uniqueNavElements && typeof params.el === "string" && $el.length > 1) {
      $el = swiper2.$el.find(params.el);
      if ($el.length > 1) {
        $el = $el.filter((el) => {
          if ($$1(el).parents(".swiper")[0] !== swiper2.el)
            return false;
          return true;
        });
      }
    }
    if (params.type === "bullets" && params.clickable) {
      $el.addClass(params.clickableClass);
    }
    $el.addClass(params.modifierClass + params.type);
    $el.addClass(swiper2.isHorizontal() ? params.horizontalClass : params.verticalClass);
    if (params.type === "bullets" && params.dynamicBullets) {
      $el.addClass(`${params.modifierClass}${params.type}-dynamic`);
      dynamicBulletIndex = 0;
      if (params.dynamicMainBullets < 1) {
        params.dynamicMainBullets = 1;
      }
    }
    if (params.type === "progressbar" && params.progressbarOpposite) {
      $el.addClass(params.progressbarOppositeClass);
    }
    if (params.clickable) {
      $el.on("click", classesToSelector(params.bulletClass), function onClick2(e) {
        e.preventDefault();
        let index2 = $$1(this).index() * swiper2.params.slidesPerGroup;
        if (swiper2.params.loop)
          index2 += swiper2.loopedSlides;
        swiper2.slideTo(index2);
      });
    }
    Object.assign(swiper2.pagination, {
      $el,
      el: $el[0]
    });
    if (!swiper2.enabled) {
      $el.addClass(params.lockClass);
    }
  }
  function destroy() {
    const params = swiper2.params.pagination;
    if (isPaginationDisabled())
      return;
    const $el = swiper2.pagination.$el;
    $el.removeClass(params.hiddenClass);
    $el.removeClass(params.modifierClass + params.type);
    $el.removeClass(swiper2.isHorizontal() ? params.horizontalClass : params.verticalClass);
    if (swiper2.pagination.bullets && swiper2.pagination.bullets.removeClass)
      swiper2.pagination.bullets.removeClass(params.bulletActiveClass);
    if (params.clickable) {
      $el.off("click", classesToSelector(params.bulletClass));
    }
  }
  on2("init", () => {
    if (swiper2.params.pagination.enabled === false) {
      disable();
    } else {
      init4();
      render3();
      update2();
    }
  });
  on2("activeIndexChange", () => {
    if (swiper2.params.loop) {
      update2();
    } else if (typeof swiper2.snapIndex === "undefined") {
      update2();
    }
  });
  on2("snapIndexChange", () => {
    if (!swiper2.params.loop) {
      update2();
    }
  });
  on2("slidesLengthChange", () => {
    if (swiper2.params.loop) {
      render3();
      update2();
    }
  });
  on2("snapGridLengthChange", () => {
    if (!swiper2.params.loop) {
      render3();
      update2();
    }
  });
  on2("destroy", () => {
    destroy();
  });
  on2("enable disable", () => {
    const {
      $el
    } = swiper2.pagination;
    if ($el) {
      $el[swiper2.enabled ? "removeClass" : "addClass"](swiper2.params.pagination.lockClass);
    }
  });
  on2("lock unlock", () => {
    update2();
  });
  on2("click", (_s, e) => {
    const targetEl = e.target;
    const {
      $el
    } = swiper2.pagination;
    if (swiper2.params.pagination.el && swiper2.params.pagination.hideOnClick && $el && $el.length > 0 && !$$1(targetEl).hasClass(swiper2.params.pagination.bulletClass)) {
      if (swiper2.navigation && (swiper2.navigation.nextEl && targetEl === swiper2.navigation.nextEl || swiper2.navigation.prevEl && targetEl === swiper2.navigation.prevEl))
        return;
      const isHidden = $el.hasClass(swiper2.params.pagination.hiddenClass);
      if (isHidden === true) {
        emit("paginationShow");
      } else {
        emit("paginationHide");
      }
      $el.toggleClass(swiper2.params.pagination.hiddenClass);
    }
  });
  const enable = () => {
    swiper2.$el.removeClass(swiper2.params.pagination.paginationDisabledClass);
    if (swiper2.pagination.$el) {
      swiper2.pagination.$el.removeClass(swiper2.params.pagination.paginationDisabledClass);
    }
    init4();
    render3();
    update2();
  };
  const disable = () => {
    swiper2.$el.addClass(swiper2.params.pagination.paginationDisabledClass);
    if (swiper2.pagination.$el) {
      swiper2.pagination.$el.addClass(swiper2.params.pagination.paginationDisabledClass);
    }
    destroy();
  };
  Object.assign(swiper2.pagination, {
    enable,
    disable,
    render: render3,
    update: update2,
    init: init4,
    destroy
  });
}
function Autoplay({
  swiper: swiper2,
  extendParams,
  on: on2,
  emit
}) {
  let timeout;
  swiper2.autoplay = {
    running: false,
    paused: false
  };
  extendParams({
    autoplay: {
      enabled: false,
      delay: 3e3,
      waitForTransition: true,
      disableOnInteraction: true,
      stopOnLastSlide: false,
      reverseDirection: false,
      pauseOnMouseEnter: false
    }
  });
  function run() {
    if (!swiper2.size) {
      swiper2.autoplay.running = false;
      swiper2.autoplay.paused = false;
      return;
    }
    const $activeSlideEl = swiper2.slides.eq(swiper2.activeIndex);
    let delay = swiper2.params.autoplay.delay;
    if ($activeSlideEl.attr("data-swiper-autoplay")) {
      delay = $activeSlideEl.attr("data-swiper-autoplay") || swiper2.params.autoplay.delay;
    }
    clearTimeout(timeout);
    timeout = nextTick(() => {
      let autoplayResult;
      if (swiper2.params.autoplay.reverseDirection) {
        if (swiper2.params.loop) {
          swiper2.loopFix();
          autoplayResult = swiper2.slidePrev(swiper2.params.speed, true, true);
          emit("autoplay");
        } else if (!swiper2.isBeginning) {
          autoplayResult = swiper2.slidePrev(swiper2.params.speed, true, true);
          emit("autoplay");
        } else if (!swiper2.params.autoplay.stopOnLastSlide) {
          autoplayResult = swiper2.slideTo(swiper2.slides.length - 1, swiper2.params.speed, true, true);
          emit("autoplay");
        } else {
          stop();
        }
      } else if (swiper2.params.loop) {
        swiper2.loopFix();
        autoplayResult = swiper2.slideNext(swiper2.params.speed, true, true);
        emit("autoplay");
      } else if (!swiper2.isEnd) {
        autoplayResult = swiper2.slideNext(swiper2.params.speed, true, true);
        emit("autoplay");
      } else if (!swiper2.params.autoplay.stopOnLastSlide) {
        autoplayResult = swiper2.slideTo(0, swiper2.params.speed, true, true);
        emit("autoplay");
      } else {
        stop();
      }
      if (swiper2.params.cssMode && swiper2.autoplay.running)
        run();
      else if (autoplayResult === false) {
        run();
      }
    }, delay);
  }
  function start() {
    if (typeof timeout !== "undefined")
      return false;
    if (swiper2.autoplay.running)
      return false;
    swiper2.autoplay.running = true;
    emit("autoplayStart");
    run();
    return true;
  }
  function stop() {
    if (!swiper2.autoplay.running)
      return false;
    if (typeof timeout === "undefined")
      return false;
    if (timeout) {
      clearTimeout(timeout);
      timeout = void 0;
    }
    swiper2.autoplay.running = false;
    emit("autoplayStop");
    return true;
  }
  function pause(speed) {
    if (!swiper2.autoplay.running)
      return;
    if (swiper2.autoplay.paused)
      return;
    if (timeout)
      clearTimeout(timeout);
    swiper2.autoplay.paused = true;
    if (speed === 0 || !swiper2.params.autoplay.waitForTransition) {
      swiper2.autoplay.paused = false;
      run();
    } else {
      ["transitionend", "webkitTransitionEnd"].forEach((event) => {
        swiper2.$wrapperEl[0].addEventListener(event, onTransitionEnd);
      });
    }
  }
  function onVisibilityChange() {
    const document2 = getDocument();
    if (document2.visibilityState === "hidden" && swiper2.autoplay.running) {
      pause();
    }
    if (document2.visibilityState === "visible" && swiper2.autoplay.paused) {
      run();
      swiper2.autoplay.paused = false;
    }
  }
  function onTransitionEnd(e) {
    if (!swiper2 || swiper2.destroyed || !swiper2.$wrapperEl)
      return;
    if (e.target !== swiper2.$wrapperEl[0])
      return;
    ["transitionend", "webkitTransitionEnd"].forEach((event) => {
      swiper2.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
    swiper2.autoplay.paused = false;
    if (!swiper2.autoplay.running) {
      stop();
    } else {
      run();
    }
  }
  function onMouseEnter() {
    if (swiper2.params.autoplay.disableOnInteraction) {
      stop();
    } else {
      emit("autoplayPause");
      pause();
    }
    ["transitionend", "webkitTransitionEnd"].forEach((event) => {
      swiper2.$wrapperEl[0].removeEventListener(event, onTransitionEnd);
    });
  }
  function onMouseLeave() {
    if (swiper2.params.autoplay.disableOnInteraction) {
      return;
    }
    swiper2.autoplay.paused = false;
    emit("autoplayResume");
    run();
  }
  function attachMouseEvents() {
    if (swiper2.params.autoplay.pauseOnMouseEnter) {
      swiper2.$el.on("mouseenter", onMouseEnter);
      swiper2.$el.on("mouseleave", onMouseLeave);
    }
  }
  function detachMouseEvents() {
    swiper2.$el.off("mouseenter", onMouseEnter);
    swiper2.$el.off("mouseleave", onMouseLeave);
  }
  on2("init", () => {
    if (swiper2.params.autoplay.enabled) {
      start();
      const document2 = getDocument();
      document2.addEventListener("visibilitychange", onVisibilityChange);
      attachMouseEvents();
    }
  });
  on2("beforeTransitionStart", (_s, speed, internal) => {
    if (swiper2.autoplay.running) {
      if (internal || !swiper2.params.autoplay.disableOnInteraction) {
        swiper2.autoplay.pause(speed);
      } else {
        stop();
      }
    }
  });
  on2("sliderFirstMove", () => {
    if (swiper2.autoplay.running) {
      if (swiper2.params.autoplay.disableOnInteraction) {
        stop();
      } else {
        pause();
      }
    }
  });
  on2("touchEnd", () => {
    if (swiper2.params.cssMode && swiper2.autoplay.paused && !swiper2.params.autoplay.disableOnInteraction) {
      run();
    }
  });
  on2("destroy", () => {
    detachMouseEvents();
    if (swiper2.autoplay.running) {
      stop();
    }
    const document2 = getDocument();
    document2.removeEventListener("visibilitychange", onVisibilityChange);
  });
  Object.assign(swiper2.autoplay, {
    pause,
    run,
    start,
    stop
  });
}
function freeMode({
  swiper: swiper2,
  extendParams,
  emit,
  once
}) {
  extendParams({
    freeMode: {
      enabled: false,
      momentum: true,
      momentumRatio: 1,
      momentumBounce: true,
      momentumBounceRatio: 1,
      momentumVelocityRatio: 1,
      sticky: false,
      minimumVelocity: 0.02
    }
  });
  function onTouchStart2() {
    const translate2 = swiper2.getTranslate();
    swiper2.setTranslate(translate2);
    swiper2.setTransition(0);
    swiper2.touchEventsData.velocities.length = 0;
    swiper2.freeMode.onTouchEnd({
      currentPos: swiper2.rtl ? swiper2.translate : -swiper2.translate
    });
  }
  function onTouchMove2() {
    const {
      touchEventsData: data,
      touches
    } = swiper2;
    if (data.velocities.length === 0) {
      data.velocities.push({
        position: touches[swiper2.isHorizontal() ? "startX" : "startY"],
        time: data.touchStartTime
      });
    }
    data.velocities.push({
      position: touches[swiper2.isHorizontal() ? "currentX" : "currentY"],
      time: now()
    });
  }
  function onTouchEnd2({
    currentPos
  }) {
    const {
      params,
      $wrapperEl,
      rtlTranslate: rtl,
      snapGrid,
      touchEventsData: data
    } = swiper2;
    const touchEndTime = now();
    const timeDiff = touchEndTime - data.touchStartTime;
    if (currentPos < -swiper2.minTranslate()) {
      swiper2.slideTo(swiper2.activeIndex);
      return;
    }
    if (currentPos > -swiper2.maxTranslate()) {
      if (swiper2.slides.length < snapGrid.length) {
        swiper2.slideTo(snapGrid.length - 1);
      } else {
        swiper2.slideTo(swiper2.slides.length - 1);
      }
      return;
    }
    if (params.freeMode.momentum) {
      if (data.velocities.length > 1) {
        const lastMoveEvent = data.velocities.pop();
        const velocityEvent = data.velocities.pop();
        const distance = lastMoveEvent.position - velocityEvent.position;
        const time = lastMoveEvent.time - velocityEvent.time;
        swiper2.velocity = distance / time;
        swiper2.velocity /= 2;
        if (Math.abs(swiper2.velocity) < params.freeMode.minimumVelocity) {
          swiper2.velocity = 0;
        }
        if (time > 150 || now() - lastMoveEvent.time > 300) {
          swiper2.velocity = 0;
        }
      } else {
        swiper2.velocity = 0;
      }
      swiper2.velocity *= params.freeMode.momentumVelocityRatio;
      data.velocities.length = 0;
      let momentumDuration = 1e3 * params.freeMode.momentumRatio;
      const momentumDistance = swiper2.velocity * momentumDuration;
      let newPosition = swiper2.translate + momentumDistance;
      if (rtl)
        newPosition = -newPosition;
      let doBounce = false;
      let afterBouncePosition;
      const bounceAmount = Math.abs(swiper2.velocity) * 20 * params.freeMode.momentumBounceRatio;
      let needsLoopFix;
      if (newPosition < swiper2.maxTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition + swiper2.maxTranslate() < -bounceAmount) {
            newPosition = swiper2.maxTranslate() - bounceAmount;
          }
          afterBouncePosition = swiper2.maxTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper2.maxTranslate();
        }
        if (params.loop && params.centeredSlides)
          needsLoopFix = true;
      } else if (newPosition > swiper2.minTranslate()) {
        if (params.freeMode.momentumBounce) {
          if (newPosition - swiper2.minTranslate() > bounceAmount) {
            newPosition = swiper2.minTranslate() + bounceAmount;
          }
          afterBouncePosition = swiper2.minTranslate();
          doBounce = true;
          data.allowMomentumBounce = true;
        } else {
          newPosition = swiper2.minTranslate();
        }
        if (params.loop && params.centeredSlides)
          needsLoopFix = true;
      } else if (params.freeMode.sticky) {
        let nextSlide;
        for (let j = 0; j < snapGrid.length; j += 1) {
          if (snapGrid[j] > -newPosition) {
            nextSlide = j;
            break;
          }
        }
        if (Math.abs(snapGrid[nextSlide] - newPosition) < Math.abs(snapGrid[nextSlide - 1] - newPosition) || swiper2.swipeDirection === "next") {
          newPosition = snapGrid[nextSlide];
        } else {
          newPosition = snapGrid[nextSlide - 1];
        }
        newPosition = -newPosition;
      }
      if (needsLoopFix) {
        once("transitionEnd", () => {
          swiper2.loopFix();
        });
      }
      if (swiper2.velocity !== 0) {
        if (rtl) {
          momentumDuration = Math.abs((-newPosition - swiper2.translate) / swiper2.velocity);
        } else {
          momentumDuration = Math.abs((newPosition - swiper2.translate) / swiper2.velocity);
        }
        if (params.freeMode.sticky) {
          const moveDistance = Math.abs((rtl ? -newPosition : newPosition) - swiper2.translate);
          const currentSlideSize = swiper2.slidesSizesGrid[swiper2.activeIndex];
          if (moveDistance < currentSlideSize) {
            momentumDuration = params.speed;
          } else if (moveDistance < 2 * currentSlideSize) {
            momentumDuration = params.speed * 1.5;
          } else {
            momentumDuration = params.speed * 2.5;
          }
        }
      } else if (params.freeMode.sticky) {
        swiper2.slideToClosest();
        return;
      }
      if (params.freeMode.momentumBounce && doBounce) {
        swiper2.updateProgress(afterBouncePosition);
        swiper2.setTransition(momentumDuration);
        swiper2.setTranslate(newPosition);
        swiper2.transitionStart(true, swiper2.swipeDirection);
        swiper2.animating = true;
        $wrapperEl.transitionEnd(() => {
          if (!swiper2 || swiper2.destroyed || !data.allowMomentumBounce)
            return;
          emit("momentumBounce");
          swiper2.setTransition(params.speed);
          setTimeout(() => {
            swiper2.setTranslate(afterBouncePosition);
            $wrapperEl.transitionEnd(() => {
              if (!swiper2 || swiper2.destroyed)
                return;
              swiper2.transitionEnd();
            });
          }, 0);
        });
      } else if (swiper2.velocity) {
        emit("_freeModeNoMomentumRelease");
        swiper2.updateProgress(newPosition);
        swiper2.setTransition(momentumDuration);
        swiper2.setTranslate(newPosition);
        swiper2.transitionStart(true, swiper2.swipeDirection);
        if (!swiper2.animating) {
          swiper2.animating = true;
          $wrapperEl.transitionEnd(() => {
            if (!swiper2 || swiper2.destroyed)
              return;
            swiper2.transitionEnd();
          });
        }
      } else {
        swiper2.updateProgress(newPosition);
      }
      swiper2.updateActiveIndex();
      swiper2.updateSlidesClasses();
    } else if (params.freeMode.sticky) {
      swiper2.slideToClosest();
      return;
    } else if (params.freeMode) {
      emit("_freeModeNoMomentumRelease");
    }
    if (!params.freeMode.momentum || timeDiff >= params.longSwipesMs) {
      swiper2.updateProgress();
      swiper2.updateActiveIndex();
      swiper2.updateSlidesClasses();
    }
  }
  Object.assign(swiper2, {
    freeMode: {
      onTouchStart: onTouchStart2,
      onTouchMove: onTouchMove2,
      onTouchEnd: onTouchEnd2
    }
  });
}
function effectInit(params) {
  const {
    effect,
    swiper: swiper2,
    on: on2,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    overwriteParams,
    perspective,
    recreateShadows,
    getEffectParams
  } = params;
  on2("beforeInit", () => {
    if (swiper2.params.effect !== effect)
      return;
    swiper2.classNames.push(`${swiper2.params.containerModifierClass}${effect}`);
    if (perspective && perspective()) {
      swiper2.classNames.push(`${swiper2.params.containerModifierClass}3d`);
    }
    const overwriteParamsResult = overwriteParams ? overwriteParams() : {};
    Object.assign(swiper2.params, overwriteParamsResult);
    Object.assign(swiper2.originalParams, overwriteParamsResult);
  });
  on2("setTranslate", () => {
    if (swiper2.params.effect !== effect)
      return;
    setTranslate2();
  });
  on2("setTransition", (_s, duration) => {
    if (swiper2.params.effect !== effect)
      return;
    setTransition2(duration);
  });
  on2("transitionEnd", () => {
    if (swiper2.params.effect !== effect)
      return;
    if (recreateShadows) {
      if (!getEffectParams || !getEffectParams().slideShadows)
        return;
      swiper2.slides.each((slideEl) => {
        const $slideEl = swiper2.$(slideEl);
        $slideEl.find(".swiper-slide-shadow-top, .swiper-slide-shadow-right, .swiper-slide-shadow-bottom, .swiper-slide-shadow-left").remove();
      });
      recreateShadows();
    }
  });
  let requireUpdateOnVirtual;
  on2("virtualUpdate", () => {
    if (swiper2.params.effect !== effect)
      return;
    if (!swiper2.slides.length) {
      requireUpdateOnVirtual = true;
    }
    requestAnimationFrame(() => {
      if (requireUpdateOnVirtual && swiper2.slides && swiper2.slides.length) {
        setTranslate2();
        requireUpdateOnVirtual = false;
      }
    });
  });
}
function effectTarget(effectParams, $slideEl) {
  if (effectParams.transformEl) {
    return $slideEl.find(effectParams.transformEl).css({
      "backface-visibility": "hidden",
      "-webkit-backface-visibility": "hidden"
    });
  }
  return $slideEl;
}
function effectVirtualTransitionEnd({
  swiper: swiper2,
  duration,
  transformEl,
  allSlides
}) {
  const {
    slides,
    activeIndex,
    $wrapperEl
  } = swiper2;
  if (swiper2.params.virtualTranslate && duration !== 0) {
    let eventTriggered = false;
    let $transitionEndTarget;
    if (allSlides) {
      $transitionEndTarget = transformEl ? slides.find(transformEl) : slides;
    } else {
      $transitionEndTarget = transformEl ? slides.eq(activeIndex).find(transformEl) : slides.eq(activeIndex);
    }
    $transitionEndTarget.transitionEnd(() => {
      if (eventTriggered)
        return;
      if (!swiper2 || swiper2.destroyed)
        return;
      eventTriggered = true;
      swiper2.animating = false;
      const triggerEvents = ["webkitTransitionEnd", "transitionend"];
      for (let i = 0; i < triggerEvents.length; i += 1) {
        $wrapperEl.trigger(triggerEvents[i]);
      }
    });
  }
}
function EffectFade({
  swiper: swiper2,
  extendParams,
  on: on2
}) {
  extendParams({
    fadeEffect: {
      crossFade: false,
      transformEl: null
    }
  });
  const setTranslate2 = () => {
    const {
      slides
    } = swiper2;
    const params = swiper2.params.fadeEffect;
    for (let i = 0; i < slides.length; i += 1) {
      const $slideEl = swiper2.slides.eq(i);
      const offset2 = $slideEl[0].swiperSlideOffset;
      let tx = -offset2;
      if (!swiper2.params.virtualTranslate)
        tx -= swiper2.translate;
      let ty = 0;
      if (!swiper2.isHorizontal()) {
        ty = tx;
        tx = 0;
      }
      const slideOpacity = swiper2.params.fadeEffect.crossFade ? Math.max(1 - Math.abs($slideEl[0].progress), 0) : 1 + Math.min(Math.max($slideEl[0].progress, -1), 0);
      const $targetEl = effectTarget(params, $slideEl);
      $targetEl.css({
        opacity: slideOpacity
      }).transform(`translate3d(${tx}px, ${ty}px, 0px)`);
    }
  };
  const setTransition2 = (duration) => {
    const {
      transformEl
    } = swiper2.params.fadeEffect;
    const $transitionElements = transformEl ? swiper2.slides.find(transformEl) : swiper2.slides;
    $transitionElements.transition(duration);
    effectVirtualTransitionEnd({
      swiper: swiper2,
      duration,
      transformEl,
      allSlides: true
    });
  };
  effectInit({
    effect: "fade",
    swiper: swiper2,
    on: on2,
    setTranslate: setTranslate2,
    setTransition: setTransition2,
    overwriteParams: () => ({
      slidesPerView: 1,
      slidesPerGroup: 1,
      watchSlidesProgress: true,
      spaceBetween: 0,
      virtualTranslate: !swiper2.params.cssMode
    })
  });
}
const navigation_min = "";
const pagination_min = "";
const swiperBundle = "";
const style = "";
function bind(fn, thisArg) {
  return function wrap3() {
    return fn.apply(thisArg, arguments);
  };
}
const { toString } = Object.prototype;
const { getPrototypeOf } = Object;
const kindOf = ((cache2) => (thing) => {
  const str = toString.call(thing);
  return cache2[str] || (cache2[str] = str.slice(8, -1).toLowerCase());
})(/* @__PURE__ */ Object.create(null));
const kindOfTest = (type) => {
  type = type.toLowerCase();
  return (thing) => kindOf(thing) === type;
};
const typeOfTest = (type) => (thing) => typeof thing === type;
const { isArray } = Array;
const isUndefined = typeOfTest("undefined");
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor) && isFunction(val.constructor.isBuffer) && val.constructor.isBuffer(val);
}
const isArrayBuffer = kindOfTest("ArrayBuffer");
function isArrayBufferView(val) {
  let result;
  if (typeof ArrayBuffer !== "undefined" && ArrayBuffer.isView) {
    result = ArrayBuffer.isView(val);
  } else {
    result = val && val.buffer && isArrayBuffer(val.buffer);
  }
  return result;
}
const isString$1 = typeOfTest("string");
const isFunction = typeOfTest("function");
const isNumber = typeOfTest("number");
const isObject$1 = (thing) => thing !== null && typeof thing === "object";
const isBoolean = (thing) => thing === true || thing === false;
const isPlainObject = (val) => {
  if (kindOf(val) !== "object") {
    return false;
  }
  const prototype2 = getPrototypeOf(val);
  return (prototype2 === null || prototype2 === Object.prototype || Object.getPrototypeOf(prototype2) === null) && !(Symbol.toStringTag in val) && !(Symbol.iterator in val);
};
const isDate = kindOfTest("Date");
const isFile = kindOfTest("File");
const isBlob = kindOfTest("Blob");
const isFileList = kindOfTest("FileList");
const isStream = (val) => isObject$1(val) && isFunction(val.pipe);
const isFormData = (thing) => {
  let kind;
  return thing && (typeof FormData === "function" && thing instanceof FormData || isFunction(thing.append) && ((kind = kindOf(thing)) === "formdata" || // detect form-data instance
  kind === "object" && isFunction(thing.toString) && thing.toString() === "[object FormData]"));
};
const isURLSearchParams = kindOfTest("URLSearchParams");
const trim = (str) => str.trim ? str.trim() : str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
function forEach(obj, fn, { allOwnKeys = false } = {}) {
  if (obj === null || typeof obj === "undefined") {
    return;
  }
  let i;
  let l;
  if (typeof obj !== "object") {
    obj = [obj];
  }
  if (isArray(obj)) {
    for (i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    const keys = allOwnKeys ? Object.getOwnPropertyNames(obj) : Object.keys(obj);
    const len = keys.length;
    let key;
    for (i = 0; i < len; i++) {
      key = keys[i];
      fn.call(null, obj[key], key, obj);
    }
  }
}
function findKey(obj, key) {
  key = key.toLowerCase();
  const keys = Object.keys(obj);
  let i = keys.length;
  let _key;
  while (i-- > 0) {
    _key = keys[i];
    if (key === _key.toLowerCase()) {
      return _key;
    }
  }
  return null;
}
const _global = (() => {
  if (typeof globalThis !== "undefined")
    return globalThis;
  return typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : global;
})();
const isContextDefined = (context3) => !isUndefined(context3) && context3 !== _global;
function merge() {
  const { caseless } = isContextDefined(this) && this || {};
  const result = {};
  const assignValue = (val, key) => {
    const targetKey = caseless && findKey(result, key) || key;
    if (isPlainObject(result[targetKey]) && isPlainObject(val)) {
      result[targetKey] = merge(result[targetKey], val);
    } else if (isPlainObject(val)) {
      result[targetKey] = merge({}, val);
    } else if (isArray(val)) {
      result[targetKey] = val.slice();
    } else {
      result[targetKey] = val;
    }
  };
  for (let i = 0, l = arguments.length; i < l; i++) {
    arguments[i] && forEach(arguments[i], assignValue);
  }
  return result;
}
const extend = (a, b, thisArg, { allOwnKeys } = {}) => {
  forEach(b, (val, key) => {
    if (thisArg && isFunction(val)) {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  }, { allOwnKeys });
  return a;
};
const stripBOM = (content) => {
  if (content.charCodeAt(0) === 65279) {
    content = content.slice(1);
  }
  return content;
};
const inherits = (constructor, superConstructor, props, descriptors2) => {
  constructor.prototype = Object.create(superConstructor.prototype, descriptors2);
  constructor.prototype.constructor = constructor;
  Object.defineProperty(constructor, "super", {
    value: superConstructor.prototype
  });
  props && Object.assign(constructor.prototype, props);
};
const toFlatObject = (sourceObj, destObj, filter3, propFilter) => {
  let props;
  let i;
  let prop;
  const merged = {};
  destObj = destObj || {};
  if (sourceObj == null)
    return destObj;
  do {
    props = Object.getOwnPropertyNames(sourceObj);
    i = props.length;
    while (i-- > 0) {
      prop = props[i];
      if ((!propFilter || propFilter(prop, sourceObj, destObj)) && !merged[prop]) {
        destObj[prop] = sourceObj[prop];
        merged[prop] = true;
      }
    }
    sourceObj = filter3 !== false && getPrototypeOf(sourceObj);
  } while (sourceObj && (!filter3 || filter3(sourceObj, destObj)) && sourceObj !== Object.prototype);
  return destObj;
};
const endsWith = (str, searchString, position) => {
  str = String(str);
  if (position === void 0 || position > str.length) {
    position = str.length;
  }
  position -= searchString.length;
  const lastIndex = str.indexOf(searchString, position);
  return lastIndex !== -1 && lastIndex === position;
};
const toArray$1 = (thing) => {
  if (!thing)
    return null;
  if (isArray(thing))
    return thing;
  let i = thing.length;
  if (!isNumber(i))
    return null;
  const arr = new Array(i);
  while (i-- > 0) {
    arr[i] = thing[i];
  }
  return arr;
};
const isTypedArray = ((TypedArray) => {
  return (thing) => {
    return TypedArray && thing instanceof TypedArray;
  };
})(typeof Uint8Array !== "undefined" && getPrototypeOf(Uint8Array));
const forEachEntry = (obj, fn) => {
  const generator = obj && obj[Symbol.iterator];
  const iterator = generator.call(obj);
  let result;
  while ((result = iterator.next()) && !result.done) {
    const pair = result.value;
    fn.call(obj, pair[0], pair[1]);
  }
};
const matchAll = (regExp, str) => {
  let matches;
  const arr = [];
  while ((matches = regExp.exec(str)) !== null) {
    arr.push(matches);
  }
  return arr;
};
const isHTMLForm = kindOfTest("HTMLFormElement");
const toCamelCase = (str) => {
  return str.toLowerCase().replace(
    /[-_\s]([a-z\d])(\w*)/g,
    function replacer(m, p1, p2) {
      return p1.toUpperCase() + p2;
    }
  );
};
const hasOwnProperty = (({ hasOwnProperty: hasOwnProperty2 }) => (obj, prop) => hasOwnProperty2.call(obj, prop))(Object.prototype);
const isRegExp = kindOfTest("RegExp");
const reduceDescriptors = (obj, reducer) => {
  const descriptors2 = Object.getOwnPropertyDescriptors(obj);
  const reducedDescriptors = {};
  forEach(descriptors2, (descriptor, name) => {
    let ret;
    if ((ret = reducer(descriptor, name, obj)) !== false) {
      reducedDescriptors[name] = ret || descriptor;
    }
  });
  Object.defineProperties(obj, reducedDescriptors);
};
const freezeMethods = (obj) => {
  reduceDescriptors(obj, (descriptor, name) => {
    if (isFunction(obj) && ["arguments", "caller", "callee"].indexOf(name) !== -1) {
      return false;
    }
    const value = obj[name];
    if (!isFunction(value))
      return;
    descriptor.enumerable = false;
    if ("writable" in descriptor) {
      descriptor.writable = false;
      return;
    }
    if (!descriptor.set) {
      descriptor.set = () => {
        throw Error("Can not rewrite read-only method '" + name + "'");
      };
    }
  });
};
const toObjectSet = (arrayOrString, delimiter) => {
  const obj = {};
  const define = (arr) => {
    arr.forEach((value) => {
      obj[value] = true;
    });
  };
  isArray(arrayOrString) ? define(arrayOrString) : define(String(arrayOrString).split(delimiter));
  return obj;
};
const noop$1 = () => {
};
const toFiniteNumber = (value, defaultValue) => {
  value = +value;
  return Number.isFinite(value) ? value : defaultValue;
};
const ALPHA = "abcdefghijklmnopqrstuvwxyz";
const DIGIT = "0123456789";
const ALPHABET = {
  DIGIT,
  ALPHA,
  ALPHA_DIGIT: ALPHA + ALPHA.toUpperCase() + DIGIT
};
const generateString = (size = 16, alphabet = ALPHABET.ALPHA_DIGIT) => {
  let str = "";
  const { length } = alphabet;
  while (size--) {
    str += alphabet[Math.random() * length | 0];
  }
  return str;
};
function isSpecCompliantForm(thing) {
  return !!(thing && isFunction(thing.append) && thing[Symbol.toStringTag] === "FormData" && thing[Symbol.iterator]);
}
const toJSONObject = (obj) => {
  const stack = new Array(10);
  const visit = (source, i) => {
    if (isObject$1(source)) {
      if (stack.indexOf(source) >= 0) {
        return;
      }
      if (!("toJSON" in source)) {
        stack[i] = source;
        const target = isArray(source) ? [] : {};
        forEach(source, (value, key) => {
          const reducedValue = visit(value, i + 1);
          !isUndefined(reducedValue) && (target[key] = reducedValue);
        });
        stack[i] = void 0;
        return target;
      }
    }
    return source;
  };
  return visit(obj, 0);
};
const isAsyncFn = kindOfTest("AsyncFunction");
const isThenable = (thing) => thing && (isObject$1(thing) || isFunction(thing)) && isFunction(thing.then) && isFunction(thing.catch);
const utils = {
  isArray,
  isArrayBuffer,
  isBuffer,
  isFormData,
  isArrayBufferView,
  isString: isString$1,
  isNumber,
  isBoolean,
  isObject: isObject$1,
  isPlainObject,
  isUndefined,
  isDate,
  isFile,
  isBlob,
  isRegExp,
  isFunction,
  isStream,
  isURLSearchParams,
  isTypedArray,
  isFileList,
  forEach,
  merge,
  extend,
  trim,
  stripBOM,
  inherits,
  toFlatObject,
  kindOf,
  kindOfTest,
  endsWith,
  toArray: toArray$1,
  forEachEntry,
  matchAll,
  isHTMLForm,
  hasOwnProperty,
  hasOwnProp: hasOwnProperty,
  // an alias to avoid ESLint no-prototype-builtins detection
  reduceDescriptors,
  freezeMethods,
  toObjectSet,
  toCamelCase,
  noop: noop$1,
  toFiniteNumber,
  findKey,
  global: _global,
  isContextDefined,
  ALPHABET,
  generateString,
  isSpecCompliantForm,
  toJSONObject,
  isAsyncFn,
  isThenable
};
function AxiosError(message, code, config3, request, response) {
  Error.call(this);
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, this.constructor);
  } else {
    this.stack = new Error().stack;
  }
  this.message = message;
  this.name = "AxiosError";
  code && (this.code = code);
  config3 && (this.config = config3);
  request && (this.request = request);
  response && (this.response = response);
}
utils.inherits(AxiosError, Error, {
  toJSON: function toJSON() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: utils.toJSONObject(this.config),
      code: this.code,
      status: this.response && this.response.status ? this.response.status : null
    };
  }
});
const prototype$1 = AxiosError.prototype;
const descriptors = {};
[
  "ERR_BAD_OPTION_VALUE",
  "ERR_BAD_OPTION",
  "ECONNABORTED",
  "ETIMEDOUT",
  "ERR_NETWORK",
  "ERR_FR_TOO_MANY_REDIRECTS",
  "ERR_DEPRECATED",
  "ERR_BAD_RESPONSE",
  "ERR_BAD_REQUEST",
  "ERR_CANCELED",
  "ERR_NOT_SUPPORT",
  "ERR_INVALID_URL"
  // eslint-disable-next-line func-names
].forEach((code) => {
  descriptors[code] = { value: code };
});
Object.defineProperties(AxiosError, descriptors);
Object.defineProperty(prototype$1, "isAxiosError", { value: true });
AxiosError.from = (error2, code, config3, request, response, customProps) => {
  const axiosError = Object.create(prototype$1);
  utils.toFlatObject(error2, axiosError, function filter3(obj) {
    return obj !== Error.prototype;
  }, (prop) => {
    return prop !== "isAxiosError";
  });
  AxiosError.call(axiosError, error2.message, code, config3, request, response);
  axiosError.cause = error2;
  axiosError.name = error2.name;
  customProps && Object.assign(axiosError, customProps);
  return axiosError;
};
const httpAdapter = null;
function isVisitable(thing) {
  return utils.isPlainObject(thing) || utils.isArray(thing);
}
function removeBrackets(key) {
  return utils.endsWith(key, "[]") ? key.slice(0, -2) : key;
}
function renderKey(path2, key, dots) {
  if (!path2)
    return key;
  return path2.concat(key).map(function each2(token, i) {
    token = removeBrackets(token);
    return !dots && i ? "[" + token + "]" : token;
  }).join(dots ? "." : "");
}
function isFlatArray(arr) {
  return utils.isArray(arr) && !arr.some(isVisitable);
}
const predicates = utils.toFlatObject(utils, {}, null, function filter2(prop) {
  return /^is[A-Z]/.test(prop);
});
function toFormData(obj, formData, options) {
  if (!utils.isObject(obj)) {
    throw new TypeError("target must be an object");
  }
  formData = formData || new FormData();
  options = utils.toFlatObject(options, {
    metaTokens: true,
    dots: false,
    indexes: false
  }, false, function defined(option, source) {
    return !utils.isUndefined(source[option]);
  });
  const metaTokens = options.metaTokens;
  const visitor = options.visitor || defaultVisitor;
  const dots = options.dots;
  const indexes = options.indexes;
  const _Blob = options.Blob || typeof Blob !== "undefined" && Blob;
  const useBlob = _Blob && utils.isSpecCompliantForm(formData);
  if (!utils.isFunction(visitor)) {
    throw new TypeError("visitor must be a function");
  }
  function convertValue(value) {
    if (value === null)
      return "";
    if (utils.isDate(value)) {
      return value.toISOString();
    }
    if (!useBlob && utils.isBlob(value)) {
      throw new AxiosError("Blob is not supported. Use a Buffer instead.");
    }
    if (utils.isArrayBuffer(value) || utils.isTypedArray(value)) {
      return useBlob && typeof Blob === "function" ? new Blob([value]) : Buffer.from(value);
    }
    return value;
  }
  function defaultVisitor(value, key, path2) {
    let arr = value;
    if (value && !path2 && typeof value === "object") {
      if (utils.endsWith(key, "{}")) {
        key = metaTokens ? key : key.slice(0, -2);
        value = JSON.stringify(value);
      } else if (utils.isArray(value) && isFlatArray(value) || (utils.isFileList(value) || utils.endsWith(key, "[]")) && (arr = utils.toArray(value))) {
        key = removeBrackets(key);
        arr.forEach(function each2(el, index2) {
          !(utils.isUndefined(el) || el === null) && formData.append(
            // eslint-disable-next-line no-nested-ternary
            indexes === true ? renderKey([key], index2, dots) : indexes === null ? key : key + "[]",
            convertValue(el)
          );
        });
        return false;
      }
    }
    if (isVisitable(value)) {
      return true;
    }
    formData.append(renderKey(path2, key, dots), convertValue(value));
    return false;
  }
  const stack = [];
  const exposedHelpers = Object.assign(predicates, {
    defaultVisitor,
    convertValue,
    isVisitable
  });
  function build(value, path2) {
    if (utils.isUndefined(value))
      return;
    if (stack.indexOf(value) !== -1) {
      throw Error("Circular reference detected in " + path2.join("."));
    }
    stack.push(value);
    utils.forEach(value, function each2(el, key) {
      const result = !(utils.isUndefined(el) || el === null) && visitor.call(
        formData,
        el,
        utils.isString(key) ? key.trim() : key,
        path2,
        exposedHelpers
      );
      if (result === true) {
        build(el, path2 ? path2.concat(key) : [key]);
      }
    });
    stack.pop();
  }
  if (!utils.isObject(obj)) {
    throw new TypeError("data must be an object");
  }
  build(obj);
  return formData;
}
function encode$1(str) {
  const charMap = {
    "!": "%21",
    "'": "%27",
    "(": "%28",
    ")": "%29",
    "~": "%7E",
    "%20": "+",
    "%00": "\0"
  };
  return encodeURIComponent(str).replace(/[!'()~]|%20|%00/g, function replacer(match) {
    return charMap[match];
  });
}
function AxiosURLSearchParams(params, options) {
  this._pairs = [];
  params && toFormData(params, this, options);
}
const prototype = AxiosURLSearchParams.prototype;
prototype.append = function append2(name, value) {
  this._pairs.push([name, value]);
};
prototype.toString = function toString2(encoder) {
  const _encode = encoder ? function(value) {
    return encoder.call(this, value, encode$1);
  } : encode$1;
  return this._pairs.map(function each2(pair) {
    return _encode(pair[0]) + "=" + _encode(pair[1]);
  }, "").join("&");
};
function encode(val) {
  return encodeURIComponent(val).replace(/%3A/gi, ":").replace(/%24/g, "$").replace(/%2C/gi, ",").replace(/%20/g, "+").replace(/%5B/gi, "[").replace(/%5D/gi, "]");
}
function buildURL(url, params, options) {
  if (!params) {
    return url;
  }
  const _encode = options && options.encode || encode;
  const serializeFn = options && options.serialize;
  let serializedParams;
  if (serializeFn) {
    serializedParams = serializeFn(params, options);
  } else {
    serializedParams = utils.isURLSearchParams(params) ? params.toString() : new AxiosURLSearchParams(params, options).toString(_encode);
  }
  if (serializedParams) {
    const hashmarkIndex = url.indexOf("#");
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }
    url += (url.indexOf("?") === -1 ? "?" : "&") + serializedParams;
  }
  return url;
}
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  /**
   * Add a new interceptor to the stack
   *
   * @param {Function} fulfilled The function to handle `then` for a `Promise`
   * @param {Function} rejected The function to handle `reject` for a `Promise`
   *
   * @return {Number} An ID used to remove interceptor later
   */
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
      synchronous: options ? options.synchronous : false,
      runWhen: options ? options.runWhen : null
    });
    return this.handlers.length - 1;
  }
  /**
   * Remove an interceptor from the stack
   *
   * @param {Number} id The ID that was returned by `use`
   *
   * @returns {Boolean} `true` if the interceptor was removed, `false` otherwise
   */
  eject(id) {
    if (this.handlers[id]) {
      this.handlers[id] = null;
    }
  }
  /**
   * Clear all interceptors from the stack
   *
   * @returns {void}
   */
  clear() {
    if (this.handlers) {
      this.handlers = [];
    }
  }
  /**
   * Iterate over all the registered interceptors
   *
   * This method is particularly useful for skipping over any
   * interceptors that may have become `null` calling `eject`.
   *
   * @param {Function} fn The function to call for each interceptor
   *
   * @returns {void}
   */
  forEach(fn) {
    utils.forEach(this.handlers, function forEachHandler(h) {
      if (h !== null) {
        fn(h);
      }
    });
  }
}
const InterceptorManager$1 = InterceptorManager;
const transitionalDefaults = {
  silentJSONParsing: true,
  forcedJSONParsing: true,
  clarifyTimeoutError: false
};
const URLSearchParams$1 = typeof URLSearchParams !== "undefined" ? URLSearchParams : AxiosURLSearchParams;
const FormData$1 = typeof FormData !== "undefined" ? FormData : null;
const Blob$1 = typeof Blob !== "undefined" ? Blob : null;
const isStandardBrowserEnv = (() => {
  let product;
  if (typeof navigator !== "undefined" && ((product = navigator.product) === "ReactNative" || product === "NativeScript" || product === "NS")) {
    return false;
  }
  return typeof window !== "undefined" && typeof document !== "undefined";
})();
const isStandardBrowserWebWorkerEnv = (() => {
  return typeof WorkerGlobalScope !== "undefined" && // eslint-disable-next-line no-undef
  self instanceof WorkerGlobalScope && typeof self.importScripts === "function";
})();
const platform = {
  isBrowser: true,
  classes: {
    URLSearchParams: URLSearchParams$1,
    FormData: FormData$1,
    Blob: Blob$1
  },
  isStandardBrowserEnv,
  isStandardBrowserWebWorkerEnv,
  protocols: ["http", "https", "file", "blob", "url", "data"]
};
function toURLEncodedForm(data, options) {
  return toFormData(data, new platform.classes.URLSearchParams(), Object.assign({
    visitor: function(value, key, path2, helpers) {
      if (platform.isNode && utils.isBuffer(value)) {
        this.append(key, value.toString("base64"));
        return false;
      }
      return helpers.defaultVisitor.apply(this, arguments);
    }
  }, options));
}
function parsePropPath(name) {
  return utils.matchAll(/\w+|\[(\w*)]/g, name).map((match) => {
    return match[0] === "[]" ? "" : match[1] || match[0];
  });
}
function arrayToObject(arr) {
  const obj = {};
  const keys = Object.keys(arr);
  let i;
  const len = keys.length;
  let key;
  for (i = 0; i < len; i++) {
    key = keys[i];
    obj[key] = arr[key];
  }
  return obj;
}
function formDataToJSON(formData) {
  function buildPath(path2, value, target, index2) {
    let name = path2[index2++];
    const isNumericKey = Number.isFinite(+name);
    const isLast = index2 >= path2.length;
    name = !name && utils.isArray(target) ? target.length : name;
    if (isLast) {
      if (utils.hasOwnProp(target, name)) {
        target[name] = [target[name], value];
      } else {
        target[name] = value;
      }
      return !isNumericKey;
    }
    if (!target[name] || !utils.isObject(target[name])) {
      target[name] = [];
    }
    const result = buildPath(path2, value, target[name], index2);
    if (result && utils.isArray(target[name])) {
      target[name] = arrayToObject(target[name]);
    }
    return !isNumericKey;
  }
  if (utils.isFormData(formData) && utils.isFunction(formData.entries)) {
    const obj = {};
    utils.forEachEntry(formData, (name, value) => {
      buildPath(parsePropPath(name), value, obj, 0);
    });
    return obj;
  }
  return null;
}
function stringifySafely(rawValue, parser, encoder) {
  if (utils.isString(rawValue)) {
    try {
      (parser || JSON.parse)(rawValue);
      return utils.trim(rawValue);
    } catch (e) {
      if (e.name !== "SyntaxError") {
        throw e;
      }
    }
  }
  return (encoder || JSON.stringify)(rawValue);
}
const defaults = {
  transitional: transitionalDefaults,
  adapter: ["xhr", "http"],
  transformRequest: [function transformRequest(data, headers) {
    const contentType = headers.getContentType() || "";
    const hasJSONContentType = contentType.indexOf("application/json") > -1;
    const isObjectPayload = utils.isObject(data);
    if (isObjectPayload && utils.isHTMLForm(data)) {
      data = new FormData(data);
    }
    const isFormData2 = utils.isFormData(data);
    if (isFormData2) {
      if (!hasJSONContentType) {
        return data;
      }
      return hasJSONContentType ? JSON.stringify(formDataToJSON(data)) : data;
    }
    if (utils.isArrayBuffer(data) || utils.isBuffer(data) || utils.isStream(data) || utils.isFile(data) || utils.isBlob(data)) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      headers.setContentType("application/x-www-form-urlencoded;charset=utf-8", false);
      return data.toString();
    }
    let isFileList2;
    if (isObjectPayload) {
      if (contentType.indexOf("application/x-www-form-urlencoded") > -1) {
        return toURLEncodedForm(data, this.formSerializer).toString();
      }
      if ((isFileList2 = utils.isFileList(data)) || contentType.indexOf("multipart/form-data") > -1) {
        const _FormData = this.env && this.env.FormData;
        return toFormData(
          isFileList2 ? { "files[]": data } : data,
          _FormData && new _FormData(),
          this.formSerializer
        );
      }
    }
    if (isObjectPayload || hasJSONContentType) {
      headers.setContentType("application/json", false);
      return stringifySafely(data);
    }
    return data;
  }],
  transformResponse: [function transformResponse(data) {
    const transitional2 = this.transitional || defaults.transitional;
    const forcedJSONParsing = transitional2 && transitional2.forcedJSONParsing;
    const JSONRequested = this.responseType === "json";
    if (data && utils.isString(data) && (forcedJSONParsing && !this.responseType || JSONRequested)) {
      const silentJSONParsing = transitional2 && transitional2.silentJSONParsing;
      const strictJSONParsing = !silentJSONParsing && JSONRequested;
      try {
        return JSON.parse(data);
      } catch (e) {
        if (strictJSONParsing) {
          if (e.name === "SyntaxError") {
            throw AxiosError.from(e, AxiosError.ERR_BAD_RESPONSE, this, null, this.response);
          }
          throw e;
        }
      }
    }
    return data;
  }],
  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,
  xsrfCookieName: "XSRF-TOKEN",
  xsrfHeaderName: "X-XSRF-TOKEN",
  maxContentLength: -1,
  maxBodyLength: -1,
  env: {
    FormData: platform.classes.FormData,
    Blob: platform.classes.Blob
  },
  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  },
  headers: {
    common: {
      "Accept": "application/json, text/plain, */*",
      "Content-Type": void 0
    }
  }
};
utils.forEach(["delete", "get", "head", "post", "put", "patch"], (method) => {
  defaults.headers[method] = {};
});
const defaults$1 = defaults;
const ignoreDuplicateOf = utils.toObjectSet([
  "age",
  "authorization",
  "content-length",
  "content-type",
  "etag",
  "expires",
  "from",
  "host",
  "if-modified-since",
  "if-unmodified-since",
  "last-modified",
  "location",
  "max-forwards",
  "proxy-authorization",
  "referer",
  "retry-after",
  "user-agent"
]);
const parseHeaders = (rawHeaders) => {
  const parsed = {};
  let key;
  let val;
  let i;
  rawHeaders && rawHeaders.split("\n").forEach(function parser(line) {
    i = line.indexOf(":");
    key = line.substring(0, i).trim().toLowerCase();
    val = line.substring(i + 1).trim();
    if (!key || parsed[key] && ignoreDuplicateOf[key]) {
      return;
    }
    if (key === "set-cookie") {
      if (parsed[key]) {
        parsed[key].push(val);
      } else {
        parsed[key] = [val];
      }
    } else {
      parsed[key] = parsed[key] ? parsed[key] + ", " + val : val;
    }
  });
  return parsed;
};
const $internals = Symbol("internals");
function normalizeHeader(header) {
  return header && String(header).trim().toLowerCase();
}
function normalizeValue(value) {
  if (value === false || value == null) {
    return value;
  }
  return utils.isArray(value) ? value.map(normalizeValue) : String(value);
}
function parseTokens(str) {
  const tokens = /* @__PURE__ */ Object.create(null);
  const tokensRE = /([^\s,;=]+)\s*(?:=\s*([^,;]+))?/g;
  let match;
  while (match = tokensRE.exec(str)) {
    tokens[match[1]] = match[2];
  }
  return tokens;
}
const isValidHeaderName = (str) => /^[-_a-zA-Z0-9^`|~,!#$%&'*+.]+$/.test(str.trim());
function matchHeaderValue(context3, value, header, filter3, isHeaderNameFilter) {
  if (utils.isFunction(filter3)) {
    return filter3.call(this, value, header);
  }
  if (isHeaderNameFilter) {
    value = header;
  }
  if (!utils.isString(value))
    return;
  if (utils.isString(filter3)) {
    return value.indexOf(filter3) !== -1;
  }
  if (utils.isRegExp(filter3)) {
    return filter3.test(value);
  }
}
function formatHeader(header) {
  return header.trim().toLowerCase().replace(/([a-z\d])(\w*)/g, (w, char, str) => {
    return char.toUpperCase() + str;
  });
}
function buildAccessors(obj, header) {
  const accessorName = utils.toCamelCase(" " + header);
  ["get", "set", "has"].forEach((methodName) => {
    Object.defineProperty(obj, methodName + accessorName, {
      value: function(arg1, arg2, arg3) {
        return this[methodName].call(this, header, arg1, arg2, arg3);
      },
      configurable: true
    });
  });
}
class AxiosHeaders {
  constructor(headers) {
    headers && this.set(headers);
  }
  set(header, valueOrRewrite, rewrite) {
    const self2 = this;
    function setHeader(_value, _header, _rewrite) {
      const lHeader = normalizeHeader(_header);
      if (!lHeader) {
        throw new Error("header name must be a non-empty string");
      }
      const key = utils.findKey(self2, lHeader);
      if (!key || self2[key] === void 0 || _rewrite === true || _rewrite === void 0 && self2[key] !== false) {
        self2[key || _header] = normalizeValue(_value);
      }
    }
    const setHeaders = (headers, _rewrite) => utils.forEach(headers, (_value, _header) => setHeader(_value, _header, _rewrite));
    if (utils.isPlainObject(header) || header instanceof this.constructor) {
      setHeaders(header, valueOrRewrite);
    } else if (utils.isString(header) && (header = header.trim()) && !isValidHeaderName(header)) {
      setHeaders(parseHeaders(header), valueOrRewrite);
    } else {
      header != null && setHeader(valueOrRewrite, header, rewrite);
    }
    return this;
  }
  get(header, parser) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      if (key) {
        const value = this[key];
        if (!parser) {
          return value;
        }
        if (parser === true) {
          return parseTokens(value);
        }
        if (utils.isFunction(parser)) {
          return parser.call(this, value, key);
        }
        if (utils.isRegExp(parser)) {
          return parser.exec(value);
        }
        throw new TypeError("parser must be boolean|regexp|function");
      }
    }
  }
  has(header, matcher) {
    header = normalizeHeader(header);
    if (header) {
      const key = utils.findKey(this, header);
      return !!(key && this[key] !== void 0 && (!matcher || matchHeaderValue(this, this[key], key, matcher)));
    }
    return false;
  }
  delete(header, matcher) {
    const self2 = this;
    let deleted = false;
    function deleteHeader(_header) {
      _header = normalizeHeader(_header);
      if (_header) {
        const key = utils.findKey(self2, _header);
        if (key && (!matcher || matchHeaderValue(self2, self2[key], key, matcher))) {
          delete self2[key];
          deleted = true;
        }
      }
    }
    if (utils.isArray(header)) {
      header.forEach(deleteHeader);
    } else {
      deleteHeader(header);
    }
    return deleted;
  }
  clear(matcher) {
    const keys = Object.keys(this);
    let i = keys.length;
    let deleted = false;
    while (i--) {
      const key = keys[i];
      if (!matcher || matchHeaderValue(this, this[key], key, matcher, true)) {
        delete this[key];
        deleted = true;
      }
    }
    return deleted;
  }
  normalize(format) {
    const self2 = this;
    const headers = {};
    utils.forEach(this, (value, header) => {
      const key = utils.findKey(headers, header);
      if (key) {
        self2[key] = normalizeValue(value);
        delete self2[header];
        return;
      }
      const normalized = format ? formatHeader(header) : String(header).trim();
      if (normalized !== header) {
        delete self2[header];
      }
      self2[normalized] = normalizeValue(value);
      headers[normalized] = true;
    });
    return this;
  }
  concat(...targets) {
    return this.constructor.concat(this, ...targets);
  }
  toJSON(asStrings) {
    const obj = /* @__PURE__ */ Object.create(null);
    utils.forEach(this, (value, header) => {
      value != null && value !== false && (obj[header] = asStrings && utils.isArray(value) ? value.join(", ") : value);
    });
    return obj;
  }
  [Symbol.iterator]() {
    return Object.entries(this.toJSON())[Symbol.iterator]();
  }
  toString() {
    return Object.entries(this.toJSON()).map(([header, value]) => header + ": " + value).join("\n");
  }
  get [Symbol.toStringTag]() {
    return "AxiosHeaders";
  }
  static from(thing) {
    return thing instanceof this ? thing : new this(thing);
  }
  static concat(first, ...targets) {
    const computed = new this(first);
    targets.forEach((target) => computed.set(target));
    return computed;
  }
  static accessor(header) {
    const internals = this[$internals] = this[$internals] = {
      accessors: {}
    };
    const accessors = internals.accessors;
    const prototype2 = this.prototype;
    function defineAccessor(_header) {
      const lHeader = normalizeHeader(_header);
      if (!accessors[lHeader]) {
        buildAccessors(prototype2, _header);
        accessors[lHeader] = true;
      }
    }
    utils.isArray(header) ? header.forEach(defineAccessor) : defineAccessor(header);
    return this;
  }
}
AxiosHeaders.accessor(["Content-Type", "Content-Length", "Accept", "Accept-Encoding", "User-Agent", "Authorization"]);
utils.reduceDescriptors(AxiosHeaders.prototype, ({ value }, key) => {
  let mapped = key[0].toUpperCase() + key.slice(1);
  return {
    get: () => value,
    set(headerValue) {
      this[mapped] = headerValue;
    }
  };
});
utils.freezeMethods(AxiosHeaders);
const AxiosHeaders$1 = AxiosHeaders;
function transformData(fns, response) {
  const config3 = this || defaults$1;
  const context3 = response || config3;
  const headers = AxiosHeaders$1.from(context3.headers);
  let data = context3.data;
  utils.forEach(fns, function transform2(fn) {
    data = fn.call(config3, data, headers.normalize(), response ? response.status : void 0);
  });
  headers.normalize();
  return data;
}
function isCancel(value) {
  return !!(value && value.__CANCEL__);
}
function CanceledError(message, config3, request) {
  AxiosError.call(this, message == null ? "canceled" : message, AxiosError.ERR_CANCELED, config3, request);
  this.name = "CanceledError";
}
utils.inherits(CanceledError, AxiosError, {
  __CANCEL__: true
});
function settle(resolve2, reject, response) {
  const validateStatus2 = response.config.validateStatus;
  if (!response.status || !validateStatus2 || validateStatus2(response.status)) {
    resolve2(response);
  } else {
    reject(new AxiosError(
      "Request failed with status code " + response.status,
      [AxiosError.ERR_BAD_REQUEST, AxiosError.ERR_BAD_RESPONSE][Math.floor(response.status / 100) - 4],
      response.config,
      response.request,
      response
    ));
  }
}
const cookies = platform.isStandardBrowserEnv ? (
  // Standard browser envs support document.cookie
  function standardBrowserEnv() {
    return {
      write: function write(name, value, expires, path2, domain, secure) {
        const cookie = [];
        cookie.push(name + "=" + encodeURIComponent(value));
        if (utils.isNumber(expires)) {
          cookie.push("expires=" + new Date(expires).toGMTString());
        }
        if (utils.isString(path2)) {
          cookie.push("path=" + path2);
        }
        if (utils.isString(domain)) {
          cookie.push("domain=" + domain);
        }
        if (secure === true) {
          cookie.push("secure");
        }
        document.cookie = cookie.join("; ");
      },
      read: function read(name) {
        const match = document.cookie.match(new RegExp("(^|;\\s*)(" + name + ")=([^;]*)"));
        return match ? decodeURIComponent(match[3]) : null;
      },
      remove: function remove2(name) {
        this.write(name, "", Date.now() - 864e5);
      }
    };
  }()
) : (
  // Non standard browser env (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv() {
    return {
      write: function write() {
      },
      read: function read() {
        return null;
      },
      remove: function remove2() {
      }
    };
  }()
);
function isAbsoluteURL(url) {
  return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
}
function combineURLs(baseURL, relativeURL) {
  return relativeURL ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "") : baseURL;
}
function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
}
const isURLSameOrigin = platform.isStandardBrowserEnv ? (
  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
  function standardBrowserEnv2() {
    const msie = /(msie|trident)/i.test(navigator.userAgent);
    const urlParsingNode = document.createElement("a");
    let originURL;
    function resolveURL(url) {
      let href = url;
      if (msie) {
        urlParsingNode.setAttribute("href", href);
        href = urlParsingNode.href;
      }
      urlParsingNode.setAttribute("href", href);
      return {
        href: urlParsingNode.href,
        protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, "") : "",
        host: urlParsingNode.host,
        search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, "") : "",
        hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, "") : "",
        hostname: urlParsingNode.hostname,
        port: urlParsingNode.port,
        pathname: urlParsingNode.pathname.charAt(0) === "/" ? urlParsingNode.pathname : "/" + urlParsingNode.pathname
      };
    }
    originURL = resolveURL(window.location.href);
    return function isURLSameOrigin2(requestURL) {
      const parsed = utils.isString(requestURL) ? resolveURL(requestURL) : requestURL;
      return parsed.protocol === originURL.protocol && parsed.host === originURL.host;
    };
  }()
) : (
  // Non standard browser envs (web workers, react-native) lack needed support.
  function nonStandardBrowserEnv2() {
    return function isURLSameOrigin2() {
      return true;
    };
  }()
);
function parseProtocol(url) {
  const match = /^([-+\w]{1,25})(:?\/\/|:)/.exec(url);
  return match && match[1] || "";
}
function speedometer(samplesCount, min) {
  samplesCount = samplesCount || 10;
  const bytes = new Array(samplesCount);
  const timestamps = new Array(samplesCount);
  let head = 0;
  let tail = 0;
  let firstSampleTS;
  min = min !== void 0 ? min : 1e3;
  return function push(chunkLength) {
    const now2 = Date.now();
    const startedAt = timestamps[tail];
    if (!firstSampleTS) {
      firstSampleTS = now2;
    }
    bytes[head] = chunkLength;
    timestamps[head] = now2;
    let i = tail;
    let bytesCount = 0;
    while (i !== head) {
      bytesCount += bytes[i++];
      i = i % samplesCount;
    }
    head = (head + 1) % samplesCount;
    if (head === tail) {
      tail = (tail + 1) % samplesCount;
    }
    if (now2 - firstSampleTS < min) {
      return;
    }
    const passed = startedAt && now2 - startedAt;
    return passed ? Math.round(bytesCount * 1e3 / passed) : void 0;
  };
}
function progressEventReducer(listener, isDownloadStream) {
  let bytesNotified = 0;
  const _speedometer = speedometer(50, 250);
  return (e) => {
    const loaded = e.loaded;
    const total = e.lengthComputable ? e.total : void 0;
    const progressBytes = loaded - bytesNotified;
    const rate = _speedometer(progressBytes);
    const inRange = loaded <= total;
    bytesNotified = loaded;
    const data = {
      loaded,
      total,
      progress: total ? loaded / total : void 0,
      bytes: progressBytes,
      rate: rate ? rate : void 0,
      estimated: rate && total && inRange ? (total - loaded) / rate : void 0,
      event: e
    };
    data[isDownloadStream ? "download" : "upload"] = true;
    listener(data);
  };
}
const isXHRAdapterSupported = typeof XMLHttpRequest !== "undefined";
const xhrAdapter = isXHRAdapterSupported && function(config3) {
  return new Promise(function dispatchXhrRequest(resolve2, reject) {
    let requestData = config3.data;
    const requestHeaders = AxiosHeaders$1.from(config3.headers).normalize();
    const responseType = config3.responseType;
    let onCanceled;
    function done() {
      if (config3.cancelToken) {
        config3.cancelToken.unsubscribe(onCanceled);
      }
      if (config3.signal) {
        config3.signal.removeEventListener("abort", onCanceled);
      }
    }
    let contentType;
    if (utils.isFormData(requestData)) {
      if (platform.isStandardBrowserEnv || platform.isStandardBrowserWebWorkerEnv) {
        requestHeaders.setContentType(false);
      } else if (!requestHeaders.getContentType(/^\s*multipart\/form-data/)) {
        requestHeaders.setContentType("multipart/form-data");
      } else if (utils.isString(contentType = requestHeaders.getContentType())) {
        requestHeaders.setContentType(contentType.replace(/^\s*(multipart\/form-data);+/, "$1"));
      }
    }
    let request = new XMLHttpRequest();
    if (config3.auth) {
      const username = config3.auth.username || "";
      const password = config3.auth.password ? unescape(encodeURIComponent(config3.auth.password)) : "";
      requestHeaders.set("Authorization", "Basic " + btoa(username + ":" + password));
    }
    const fullPath = buildFullPath(config3.baseURL, config3.url);
    request.open(config3.method.toUpperCase(), buildURL(fullPath, config3.params, config3.paramsSerializer), true);
    request.timeout = config3.timeout;
    function onloadend() {
      if (!request) {
        return;
      }
      const responseHeaders = AxiosHeaders$1.from(
        "getAllResponseHeaders" in request && request.getAllResponseHeaders()
      );
      const responseData = !responseType || responseType === "text" || responseType === "json" ? request.responseText : request.response;
      const response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config3,
        request
      };
      settle(function _resolve(value) {
        resolve2(value);
        done();
      }, function _reject(err) {
        reject(err);
        done();
      }, response);
      request = null;
    }
    if ("onloadend" in request) {
      request.onloadend = onloadend;
    } else {
      request.onreadystatechange = function handleLoad() {
        if (!request || request.readyState !== 4) {
          return;
        }
        if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf("file:") === 0)) {
          return;
        }
        setTimeout(onloadend);
      };
    }
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }
      reject(new AxiosError("Request aborted", AxiosError.ECONNABORTED, config3, request));
      request = null;
    };
    request.onerror = function handleError() {
      reject(new AxiosError("Network Error", AxiosError.ERR_NETWORK, config3, request));
      request = null;
    };
    request.ontimeout = function handleTimeout() {
      let timeoutErrorMessage = config3.timeout ? "timeout of " + config3.timeout + "ms exceeded" : "timeout exceeded";
      const transitional2 = config3.transitional || transitionalDefaults;
      if (config3.timeoutErrorMessage) {
        timeoutErrorMessage = config3.timeoutErrorMessage;
      }
      reject(new AxiosError(
        timeoutErrorMessage,
        transitional2.clarifyTimeoutError ? AxiosError.ETIMEDOUT : AxiosError.ECONNABORTED,
        config3,
        request
      ));
      request = null;
    };
    if (platform.isStandardBrowserEnv) {
      const xsrfValue = isURLSameOrigin(fullPath) && config3.xsrfCookieName && cookies.read(config3.xsrfCookieName);
      if (xsrfValue) {
        requestHeaders.set(config3.xsrfHeaderName, xsrfValue);
      }
    }
    requestData === void 0 && requestHeaders.setContentType(null);
    if ("setRequestHeader" in request) {
      utils.forEach(requestHeaders.toJSON(), function setRequestHeader(val, key) {
        request.setRequestHeader(key, val);
      });
    }
    if (!utils.isUndefined(config3.withCredentials)) {
      request.withCredentials = !!config3.withCredentials;
    }
    if (responseType && responseType !== "json") {
      request.responseType = config3.responseType;
    }
    if (typeof config3.onDownloadProgress === "function") {
      request.addEventListener("progress", progressEventReducer(config3.onDownloadProgress, true));
    }
    if (typeof config3.onUploadProgress === "function" && request.upload) {
      request.upload.addEventListener("progress", progressEventReducer(config3.onUploadProgress));
    }
    if (config3.cancelToken || config3.signal) {
      onCanceled = (cancel) => {
        if (!request) {
          return;
        }
        reject(!cancel || cancel.type ? new CanceledError(null, config3, request) : cancel);
        request.abort();
        request = null;
      };
      config3.cancelToken && config3.cancelToken.subscribe(onCanceled);
      if (config3.signal) {
        config3.signal.aborted ? onCanceled() : config3.signal.addEventListener("abort", onCanceled);
      }
    }
    const protocol = parseProtocol(fullPath);
    if (protocol && platform.protocols.indexOf(protocol) === -1) {
      reject(new AxiosError("Unsupported protocol " + protocol + ":", AxiosError.ERR_BAD_REQUEST, config3));
      return;
    }
    request.send(requestData || null);
  });
};
const knownAdapters = {
  http: httpAdapter,
  xhr: xhrAdapter
};
utils.forEach(knownAdapters, (fn, value) => {
  if (fn) {
    try {
      Object.defineProperty(fn, "name", { value });
    } catch (e) {
    }
    Object.defineProperty(fn, "adapterName", { value });
  }
});
const renderReason = (reason) => `- ${reason}`;
const isResolvedHandle = (adapter) => utils.isFunction(adapter) || adapter === null || adapter === false;
const adapters = {
  getAdapter: (adapters2) => {
    adapters2 = utils.isArray(adapters2) ? adapters2 : [adapters2];
    const { length } = adapters2;
    let nameOrAdapter;
    let adapter;
    const rejectedReasons = {};
    for (let i = 0; i < length; i++) {
      nameOrAdapter = adapters2[i];
      let id;
      adapter = nameOrAdapter;
      if (!isResolvedHandle(nameOrAdapter)) {
        adapter = knownAdapters[(id = String(nameOrAdapter)).toLowerCase()];
        if (adapter === void 0) {
          throw new AxiosError(`Unknown adapter '${id}'`);
        }
      }
      if (adapter) {
        break;
      }
      rejectedReasons[id || "#" + i] = adapter;
    }
    if (!adapter) {
      const reasons = Object.entries(rejectedReasons).map(
        ([id, state]) => `adapter ${id} ` + (state === false ? "is not supported by the environment" : "is not available in the build")
      );
      let s = length ? reasons.length > 1 ? "since :\n" + reasons.map(renderReason).join("\n") : " " + renderReason(reasons[0]) : "as no adapter specified";
      throw new AxiosError(
        `There is no suitable adapter to dispatch the request ` + s,
        "ERR_NOT_SUPPORT"
      );
    }
    return adapter;
  },
  adapters: knownAdapters
};
function throwIfCancellationRequested(config3) {
  if (config3.cancelToken) {
    config3.cancelToken.throwIfRequested();
  }
  if (config3.signal && config3.signal.aborted) {
    throw new CanceledError(null, config3);
  }
}
function dispatchRequest(config3) {
  throwIfCancellationRequested(config3);
  config3.headers = AxiosHeaders$1.from(config3.headers);
  config3.data = transformData.call(
    config3,
    config3.transformRequest
  );
  if (["post", "put", "patch"].indexOf(config3.method) !== -1) {
    config3.headers.setContentType("application/x-www-form-urlencoded", false);
  }
  const adapter = adapters.getAdapter(config3.adapter || defaults$1.adapter);
  return adapter(config3).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config3);
    response.data = transformData.call(
      config3,
      config3.transformResponse,
      response
    );
    response.headers = AxiosHeaders$1.from(response.headers);
    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config3);
      if (reason && reason.response) {
        reason.response.data = transformData.call(
          config3,
          config3.transformResponse,
          reason.response
        );
        reason.response.headers = AxiosHeaders$1.from(reason.response.headers);
      }
    }
    return Promise.reject(reason);
  });
}
const headersToObject = (thing) => thing instanceof AxiosHeaders$1 ? thing.toJSON() : thing;
function mergeConfig(config1, config22) {
  config22 = config22 || {};
  const config3 = {};
  function getMergedValue(target, source, caseless) {
    if (utils.isPlainObject(target) && utils.isPlainObject(source)) {
      return utils.merge.call({ caseless }, target, source);
    } else if (utils.isPlainObject(source)) {
      return utils.merge({}, source);
    } else if (utils.isArray(source)) {
      return source.slice();
    }
    return source;
  }
  function mergeDeepProperties(a, b, caseless) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(a, b, caseless);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a, caseless);
    }
  }
  function valueFromConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    }
  }
  function defaultToConfig2(a, b) {
    if (!utils.isUndefined(b)) {
      return getMergedValue(void 0, b);
    } else if (!utils.isUndefined(a)) {
      return getMergedValue(void 0, a);
    }
  }
  function mergeDirectKeys(a, b, prop) {
    if (prop in config22) {
      return getMergedValue(a, b);
    } else if (prop in config1) {
      return getMergedValue(void 0, a);
    }
  }
  const mergeMap = {
    url: valueFromConfig2,
    method: valueFromConfig2,
    data: valueFromConfig2,
    baseURL: defaultToConfig2,
    transformRequest: defaultToConfig2,
    transformResponse: defaultToConfig2,
    paramsSerializer: defaultToConfig2,
    timeout: defaultToConfig2,
    timeoutMessage: defaultToConfig2,
    withCredentials: defaultToConfig2,
    adapter: defaultToConfig2,
    responseType: defaultToConfig2,
    xsrfCookieName: defaultToConfig2,
    xsrfHeaderName: defaultToConfig2,
    onUploadProgress: defaultToConfig2,
    onDownloadProgress: defaultToConfig2,
    decompress: defaultToConfig2,
    maxContentLength: defaultToConfig2,
    maxBodyLength: defaultToConfig2,
    beforeRedirect: defaultToConfig2,
    transport: defaultToConfig2,
    httpAgent: defaultToConfig2,
    httpsAgent: defaultToConfig2,
    cancelToken: defaultToConfig2,
    socketPath: defaultToConfig2,
    responseEncoding: defaultToConfig2,
    validateStatus: mergeDirectKeys,
    headers: (a, b) => mergeDeepProperties(headersToObject(a), headersToObject(b), true)
  };
  utils.forEach(Object.keys(Object.assign({}, config1, config22)), function computeConfigValue(prop) {
    const merge2 = mergeMap[prop] || mergeDeepProperties;
    const configValue = merge2(config1[prop], config22[prop], prop);
    utils.isUndefined(configValue) && merge2 !== mergeDirectKeys || (config3[prop] = configValue);
  });
  return config3;
}
const VERSION = "1.6.0";
const validators$1 = {};
["object", "boolean", "number", "function", "string", "symbol"].forEach((type, i) => {
  validators$1[type] = function validator2(thing) {
    return typeof thing === type || "a" + (i < 1 ? "n " : " ") + type;
  };
});
const deprecatedWarnings = {};
validators$1.transitional = function transitional(validator2, version, message) {
  function formatMessage(opt, desc) {
    return "[Axios v" + VERSION + "] Transitional option '" + opt + "'" + desc + (message ? ". " + message : "");
  }
  return (value, opt, opts) => {
    if (validator2 === false) {
      throw new AxiosError(
        formatMessage(opt, " has been removed" + (version ? " in " + version : "")),
        AxiosError.ERR_DEPRECATED
      );
    }
    if (version && !deprecatedWarnings[opt]) {
      deprecatedWarnings[opt] = true;
      console.warn(
        formatMessage(
          opt,
          " has been deprecated since v" + version + " and will be removed in the near future"
        )
      );
    }
    return validator2 ? validator2(value, opt, opts) : true;
  };
};
function assertOptions(options, schema, allowUnknown) {
  if (typeof options !== "object") {
    throw new AxiosError("options must be an object", AxiosError.ERR_BAD_OPTION_VALUE);
  }
  const keys = Object.keys(options);
  let i = keys.length;
  while (i-- > 0) {
    const opt = keys[i];
    const validator2 = schema[opt];
    if (validator2) {
      const value = options[opt];
      const result = value === void 0 || validator2(value, opt, options);
      if (result !== true) {
        throw new AxiosError("option " + opt + " must be " + result, AxiosError.ERR_BAD_OPTION_VALUE);
      }
      continue;
    }
    if (allowUnknown !== true) {
      throw new AxiosError("Unknown option " + opt, AxiosError.ERR_BAD_OPTION);
    }
  }
}
const validator = {
  assertOptions,
  validators: validators$1
};
const validators = validator.validators;
class Axios {
  constructor(instanceConfig) {
    this.defaults = instanceConfig;
    this.interceptors = {
      request: new InterceptorManager$1(),
      response: new InterceptorManager$1()
    };
  }
  /**
   * Dispatch a request
   *
   * @param {String|Object} configOrUrl The config specific for this request (merged with this.defaults)
   * @param {?Object} config
   *
   * @returns {Promise} The Promise to be fulfilled
   */
  request(configOrUrl, config3) {
    if (typeof configOrUrl === "string") {
      config3 = config3 || {};
      config3.url = configOrUrl;
    } else {
      config3 = configOrUrl || {};
    }
    config3 = mergeConfig(this.defaults, config3);
    const { transitional: transitional2, paramsSerializer, headers } = config3;
    if (transitional2 !== void 0) {
      validator.assertOptions(transitional2, {
        silentJSONParsing: validators.transitional(validators.boolean),
        forcedJSONParsing: validators.transitional(validators.boolean),
        clarifyTimeoutError: validators.transitional(validators.boolean)
      }, false);
    }
    if (paramsSerializer != null) {
      if (utils.isFunction(paramsSerializer)) {
        config3.paramsSerializer = {
          serialize: paramsSerializer
        };
      } else {
        validator.assertOptions(paramsSerializer, {
          encode: validators.function,
          serialize: validators.function
        }, true);
      }
    }
    config3.method = (config3.method || this.defaults.method || "get").toLowerCase();
    let contextHeaders = headers && utils.merge(
      headers.common,
      headers[config3.method]
    );
    headers && utils.forEach(
      ["delete", "get", "head", "post", "put", "patch", "common"],
      (method) => {
        delete headers[method];
      }
    );
    config3.headers = AxiosHeaders$1.concat(contextHeaders, headers);
    const requestInterceptorChain = [];
    let synchronousRequestInterceptors = true;
    this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
      if (typeof interceptor.runWhen === "function" && interceptor.runWhen(config3) === false) {
        return;
      }
      synchronousRequestInterceptors = synchronousRequestInterceptors && interceptor.synchronous;
      requestInterceptorChain.unshift(interceptor.fulfilled, interceptor.rejected);
    });
    const responseInterceptorChain = [];
    this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
      responseInterceptorChain.push(interceptor.fulfilled, interceptor.rejected);
    });
    let promise;
    let i = 0;
    let len;
    if (!synchronousRequestInterceptors) {
      const chain = [dispatchRequest.bind(this), void 0];
      chain.unshift.apply(chain, requestInterceptorChain);
      chain.push.apply(chain, responseInterceptorChain);
      len = chain.length;
      promise = Promise.resolve(config3);
      while (i < len) {
        promise = promise.then(chain[i++], chain[i++]);
      }
      return promise;
    }
    len = requestInterceptorChain.length;
    let newConfig = config3;
    i = 0;
    while (i < len) {
      const onFulfilled = requestInterceptorChain[i++];
      const onRejected = requestInterceptorChain[i++];
      try {
        newConfig = onFulfilled(newConfig);
      } catch (error2) {
        onRejected.call(this, error2);
        break;
      }
    }
    try {
      promise = dispatchRequest.call(this, newConfig);
    } catch (error2) {
      return Promise.reject(error2);
    }
    i = 0;
    len = responseInterceptorChain.length;
    while (i < len) {
      promise = promise.then(responseInterceptorChain[i++], responseInterceptorChain[i++]);
    }
    return promise;
  }
  getUri(config3) {
    config3 = mergeConfig(this.defaults, config3);
    const fullPath = buildFullPath(config3.baseURL, config3.url);
    return buildURL(fullPath, config3.params, config3.paramsSerializer);
  }
}
utils.forEach(["delete", "get", "head", "options"], function forEachMethodNoData(method) {
  Axios.prototype[method] = function(url, config3) {
    return this.request(mergeConfig(config3 || {}, {
      method,
      url,
      data: (config3 || {}).data
    }));
  };
});
utils.forEach(["post", "put", "patch"], function forEachMethodWithData(method) {
  function generateHTTPMethod(isForm) {
    return function httpMethod(url, data, config3) {
      return this.request(mergeConfig(config3 || {}, {
        method,
        headers: isForm ? {
          "Content-Type": "multipart/form-data"
        } : {},
        url,
        data
      }));
    };
  }
  Axios.prototype[method] = generateHTTPMethod();
  Axios.prototype[method + "Form"] = generateHTTPMethod(true);
});
const Axios$1 = Axios;
class CancelToken {
  constructor(executor) {
    if (typeof executor !== "function") {
      throw new TypeError("executor must be a function.");
    }
    let resolvePromise;
    this.promise = new Promise(function promiseExecutor(resolve2) {
      resolvePromise = resolve2;
    });
    const token = this;
    this.promise.then((cancel) => {
      if (!token._listeners)
        return;
      let i = token._listeners.length;
      while (i-- > 0) {
        token._listeners[i](cancel);
      }
      token._listeners = null;
    });
    this.promise.then = (onfulfilled) => {
      let _resolve;
      const promise = new Promise((resolve2) => {
        token.subscribe(resolve2);
        _resolve = resolve2;
      }).then(onfulfilled);
      promise.cancel = function reject() {
        token.unsubscribe(_resolve);
      };
      return promise;
    };
    executor(function cancel(message, config3, request) {
      if (token.reason) {
        return;
      }
      token.reason = new CanceledError(message, config3, request);
      resolvePromise(token.reason);
    });
  }
  /**
   * Throws a `CanceledError` if cancellation has been requested.
   */
  throwIfRequested() {
    if (this.reason) {
      throw this.reason;
    }
  }
  /**
   * Subscribe to the cancel signal
   */
  subscribe(listener) {
    if (this.reason) {
      listener(this.reason);
      return;
    }
    if (this._listeners) {
      this._listeners.push(listener);
    } else {
      this._listeners = [listener];
    }
  }
  /**
   * Unsubscribe from the cancel signal
   */
  unsubscribe(listener) {
    if (!this._listeners) {
      return;
    }
    const index2 = this._listeners.indexOf(listener);
    if (index2 !== -1) {
      this._listeners.splice(index2, 1);
    }
  }
  /**
   * Returns an object that contains a new `CancelToken` and a function that, when called,
   * cancels the `CancelToken`.
   */
  static source() {
    let cancel;
    const token = new CancelToken(function executor(c) {
      cancel = c;
    });
    return {
      token,
      cancel
    };
  }
}
const CancelToken$1 = CancelToken;
function spread(callback) {
  return function wrap3(arr) {
    return callback.apply(null, arr);
  };
}
function isAxiosError(payload) {
  return utils.isObject(payload) && payload.isAxiosError === true;
}
const HttpStatusCode = {
  Continue: 100,
  SwitchingProtocols: 101,
  Processing: 102,
  EarlyHints: 103,
  Ok: 200,
  Created: 201,
  Accepted: 202,
  NonAuthoritativeInformation: 203,
  NoContent: 204,
  ResetContent: 205,
  PartialContent: 206,
  MultiStatus: 207,
  AlreadyReported: 208,
  ImUsed: 226,
  MultipleChoices: 300,
  MovedPermanently: 301,
  Found: 302,
  SeeOther: 303,
  NotModified: 304,
  UseProxy: 305,
  Unused: 306,
  TemporaryRedirect: 307,
  PermanentRedirect: 308,
  BadRequest: 400,
  Unauthorized: 401,
  PaymentRequired: 402,
  Forbidden: 403,
  NotFound: 404,
  MethodNotAllowed: 405,
  NotAcceptable: 406,
  ProxyAuthenticationRequired: 407,
  RequestTimeout: 408,
  Conflict: 409,
  Gone: 410,
  LengthRequired: 411,
  PreconditionFailed: 412,
  PayloadTooLarge: 413,
  UriTooLong: 414,
  UnsupportedMediaType: 415,
  RangeNotSatisfiable: 416,
  ExpectationFailed: 417,
  ImATeapot: 418,
  MisdirectedRequest: 421,
  UnprocessableEntity: 422,
  Locked: 423,
  FailedDependency: 424,
  TooEarly: 425,
  UpgradeRequired: 426,
  PreconditionRequired: 428,
  TooManyRequests: 429,
  RequestHeaderFieldsTooLarge: 431,
  UnavailableForLegalReasons: 451,
  InternalServerError: 500,
  NotImplemented: 501,
  BadGateway: 502,
  ServiceUnavailable: 503,
  GatewayTimeout: 504,
  HttpVersionNotSupported: 505,
  VariantAlsoNegotiates: 506,
  InsufficientStorage: 507,
  LoopDetected: 508,
  NotExtended: 510,
  NetworkAuthenticationRequired: 511
};
Object.entries(HttpStatusCode).forEach(([key, value]) => {
  HttpStatusCode[value] = key;
});
const HttpStatusCode$1 = HttpStatusCode;
function createInstance(defaultConfig) {
  const context3 = new Axios$1(defaultConfig);
  const instance = bind(Axios$1.prototype.request, context3);
  utils.extend(instance, Axios$1.prototype, context3, { allOwnKeys: true });
  utils.extend(instance, context3, null, { allOwnKeys: true });
  instance.create = function create(instanceConfig) {
    return createInstance(mergeConfig(defaultConfig, instanceConfig));
  };
  return instance;
}
const axios = createInstance(defaults$1);
axios.Axios = Axios$1;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken$1;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
axios.AxiosError = AxiosError;
axios.Cancel = axios.CanceledError;
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = spread;
axios.isAxiosError = isAxiosError;
axios.mergeConfig = mergeConfig;
axios.AxiosHeaders = AxiosHeaders$1;
axios.formToJSON = (thing) => formDataToJSON(utils.isHTMLForm(thing) ? new FormData(thing) : thing);
axios.getAdapter = adapters.getAdapter;
axios.HttpStatusCode = HttpStatusCode$1;
axios.default = axios;
const axios$1 = axios;
function isString(str) {
  return typeof str === "string" || str instanceof String;
}
function isObject(obj) {
  var _obj$constructor;
  return typeof obj === "object" && obj != null && (obj == null || (_obj$constructor = obj.constructor) == null ? void 0 : _obj$constructor.name) === "Object";
}
function pick(obj, keys) {
  if (Array.isArray(keys))
    return pick(obj, (_, k) => keys.includes(k));
  return Object.entries(obj).reduce((acc, _ref) => {
    let [k, v] = _ref;
    if (keys(v, k))
      acc[k] = v;
    return acc;
  }, {});
}
const DIRECTION = {
  NONE: "NONE",
  LEFT: "LEFT",
  FORCE_LEFT: "FORCE_LEFT",
  RIGHT: "RIGHT",
  FORCE_RIGHT: "FORCE_RIGHT"
};
function forceDirection(direction) {
  switch (direction) {
    case DIRECTION.LEFT:
      return DIRECTION.FORCE_LEFT;
    case DIRECTION.RIGHT:
      return DIRECTION.FORCE_RIGHT;
    default:
      return direction;
  }
}
function escapeRegExp(str) {
  return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, "\\$1");
}
function objectIncludes(b, a) {
  if (a === b)
    return true;
  const arrA = Array.isArray(a), arrB = Array.isArray(b);
  let i;
  if (arrA && arrB) {
    if (a.length != b.length)
      return false;
    for (i = 0; i < a.length; i++)
      if (!objectIncludes(a[i], b[i]))
        return false;
    return true;
  }
  if (arrA != arrB)
    return false;
  if (a && b && typeof a === "object" && typeof b === "object") {
    const dateA = a instanceof Date, dateB = b instanceof Date;
    if (dateA && dateB)
      return a.getTime() == b.getTime();
    if (dateA != dateB)
      return false;
    const regexpA = a instanceof RegExp, regexpB = b instanceof RegExp;
    if (regexpA && regexpB)
      return a.toString() == b.toString();
    if (regexpA != regexpB)
      return false;
    const keys = Object.keys(a);
    for (i = 0; i < keys.length; i++)
      if (!Object.prototype.hasOwnProperty.call(b, keys[i]))
        return false;
    for (i = 0; i < keys.length; i++)
      if (!objectIncludes(b[keys[i]], a[keys[i]]))
        return false;
    return true;
  } else if (a && b && typeof a === "function" && typeof b === "function") {
    return a.toString() === b.toString();
  }
  return false;
}
class ActionDetails {
  /** Current input value */
  /** Current cursor position */
  /** Old input value */
  /** Old selection */
  constructor(opts) {
    Object.assign(this, opts);
    while (this.value.slice(0, this.startChangePos) !== this.oldValue.slice(0, this.startChangePos)) {
      --this.oldSelection.start;
    }
  }
  /** Start changing position */
  get startChangePos() {
    return Math.min(this.cursorPos, this.oldSelection.start);
  }
  /** Inserted symbols count */
  get insertedCount() {
    return this.cursorPos - this.startChangePos;
  }
  /** Inserted symbols */
  get inserted() {
    return this.value.substr(this.startChangePos, this.insertedCount);
  }
  /** Removed symbols count */
  get removedCount() {
    return Math.max(this.oldSelection.end - this.startChangePos || // for Delete
    this.oldValue.length - this.value.length, 0);
  }
  /** Removed symbols */
  get removed() {
    return this.oldValue.substr(this.startChangePos, this.removedCount);
  }
  /** Unchanged head symbols */
  get head() {
    return this.value.substring(0, this.startChangePos);
  }
  /** Unchanged tail symbols */
  get tail() {
    return this.value.substring(this.startChangePos + this.insertedCount);
  }
  /** Remove direction */
  get removeDirection() {
    if (!this.removedCount || this.insertedCount)
      return DIRECTION.NONE;
    return (this.oldSelection.end === this.cursorPos || this.oldSelection.start === this.cursorPos) && // if not range removed (event with backspace)
    this.oldSelection.end === this.oldSelection.start ? DIRECTION.RIGHT : DIRECTION.LEFT;
  }
}
function IMask(el, opts) {
  return new IMask.InputMask(el, opts);
}
function maskedClass(mask) {
  if (mask == null)
    throw new Error("mask property should be defined");
  if (mask instanceof RegExp)
    return IMask.MaskedRegExp;
  if (isString(mask))
    return IMask.MaskedPattern;
  if (mask === Date)
    return IMask.MaskedDate;
  if (mask === Number)
    return IMask.MaskedNumber;
  if (Array.isArray(mask) || mask === Array)
    return IMask.MaskedDynamic;
  if (IMask.Masked && mask.prototype instanceof IMask.Masked)
    return mask;
  if (IMask.Masked && mask instanceof IMask.Masked)
    return mask.constructor;
  if (mask instanceof Function)
    return IMask.MaskedFunction;
  console.warn("Mask not found for mask", mask);
  return IMask.Masked;
}
function normalizeOpts(opts) {
  if (!opts)
    throw new Error("Options in not defined");
  if (IMask.Masked) {
    if (opts.prototype instanceof IMask.Masked)
      return {
        mask: opts
      };
    const {
      mask = void 0,
      ...instanceOpts
    } = opts instanceof IMask.Masked ? {
      mask: opts
    } : isObject(opts) && opts.mask instanceof IMask.Masked ? opts : {};
    if (mask) {
      const _mask = mask.mask;
      return {
        ...pick(mask, (_, k) => !k.startsWith("_")),
        mask: mask.constructor,
        _mask,
        ...instanceOpts
      };
    }
  }
  if (!isObject(opts))
    return {
      mask: opts
    };
  return {
    ...opts
  };
}
function createMask(opts) {
  if (IMask.Masked && opts instanceof IMask.Masked)
    return opts;
  const nOpts = normalizeOpts(opts);
  const MaskedClass = maskedClass(nOpts.mask);
  if (!MaskedClass)
    throw new Error("Masked class is not found for provided mask, appropriate module needs to be imported manually before creating mask.");
  if (nOpts.mask === MaskedClass)
    delete nOpts.mask;
  if (nOpts._mask) {
    nOpts.mask = nOpts._mask;
    delete nOpts._mask;
  }
  return new MaskedClass(nOpts);
}
IMask.createMask = createMask;
class MaskElement {
  /** */
  /** */
  /** */
  /** Safely returns selection start */
  get selectionStart() {
    let start;
    try {
      start = this._unsafeSelectionStart;
    } catch {
    }
    return start != null ? start : this.value.length;
  }
  /** Safely returns selection end */
  get selectionEnd() {
    let end;
    try {
      end = this._unsafeSelectionEnd;
    } catch {
    }
    return end != null ? end : this.value.length;
  }
  /** Safely sets element selection */
  select(start, end) {
    if (start == null || end == null || start === this.selectionStart && end === this.selectionEnd)
      return;
    try {
      this._unsafeSelect(start, end);
    } catch {
    }
  }
  /** */
  get isActive() {
    return false;
  }
  /** */
  /** */
  /** */
}
IMask.MaskElement = MaskElement;
class HTMLMaskElement extends MaskElement {
  /** HTMLElement to use mask on */
  constructor(input) {
    super();
    this.input = input;
    this._handlers = {};
  }
  get rootElement() {
    var _this$input$getRootNo, _this$input$getRootNo2, _this$input;
    return (_this$input$getRootNo = (_this$input$getRootNo2 = (_this$input = this.input).getRootNode) == null ? void 0 : _this$input$getRootNo2.call(_this$input)) != null ? _this$input$getRootNo : document;
  }
  /**
    Is element in focus
  */
  get isActive() {
    return this.input === this.rootElement.activeElement;
  }
  /**
    Binds HTMLElement events to mask internal events
  */
  bindEvents(handlers) {
    Object.keys(handlers).forEach((event) => this._toggleEventHandler(HTMLMaskElement.EVENTS_MAP[event], handlers[event]));
  }
  /**
    Unbinds HTMLElement events to mask internal events
  */
  unbindEvents() {
    Object.keys(this._handlers).forEach((event) => this._toggleEventHandler(event));
  }
  _toggleEventHandler(event, handler) {
    if (this._handlers[event]) {
      this.input.removeEventListener(event, this._handlers[event]);
      delete this._handlers[event];
    }
    if (handler) {
      this.input.addEventListener(event, handler);
      this._handlers[event] = handler;
    }
  }
}
HTMLMaskElement.EVENTS_MAP = {
  selectionChange: "keydown",
  input: "input",
  drop: "drop",
  click: "click",
  focus: "focus",
  commit: "blur"
};
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLInputMaskElement extends HTMLMaskElement {
  /** InputElement to use mask on */
  constructor(input) {
    super(input);
    this.input = input;
    this._handlers = {};
  }
  /** Returns InputElement selection start */
  get _unsafeSelectionStart() {
    return this.input.selectionStart != null ? this.input.selectionStart : this.value.length;
  }
  /** Returns InputElement selection end */
  get _unsafeSelectionEnd() {
    return this.input.selectionEnd;
  }
  /** Sets InputElement selection */
  _unsafeSelect(start, end) {
    this.input.setSelectionRange(start, end);
  }
  get value() {
    return this.input.value;
  }
  set value(value) {
    this.input.value = value;
  }
}
IMask.HTMLMaskElement = HTMLMaskElement;
class HTMLContenteditableMaskElement extends HTMLMaskElement {
  /** Returns HTMLElement selection start */
  get _unsafeSelectionStart() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset < focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Returns HTMLElement selection end */
  get _unsafeSelectionEnd() {
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    const anchorOffset = selection && selection.anchorOffset;
    const focusOffset = selection && selection.focusOffset;
    if (focusOffset == null || anchorOffset == null || anchorOffset > focusOffset) {
      return anchorOffset;
    }
    return focusOffset;
  }
  /** Sets HTMLElement selection */
  _unsafeSelect(start, end) {
    if (!this.rootElement.createRange)
      return;
    const range = this.rootElement.createRange();
    range.setStart(this.input.firstChild || this.input, start);
    range.setEnd(this.input.lastChild || this.input, end);
    const root = this.rootElement;
    const selection = root.getSelection && root.getSelection();
    if (selection) {
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  /** HTMLElement value */
  get value() {
    return this.input.textContent || "";
  }
  set value(value) {
    this.input.textContent = value;
  }
}
IMask.HTMLContenteditableMaskElement = HTMLContenteditableMaskElement;
class InputMask {
  /**
    View element
  */
  /** Internal {@link Masked} model */
  constructor(el, opts) {
    this.el = el instanceof MaskElement ? el : el.isContentEditable && el.tagName !== "INPUT" && el.tagName !== "TEXTAREA" ? new HTMLContenteditableMaskElement(el) : new HTMLInputMaskElement(el);
    this.masked = createMask(opts);
    this._listeners = {};
    this._value = "";
    this._unmaskedValue = "";
    this._saveSelection = this._saveSelection.bind(this);
    this._onInput = this._onInput.bind(this);
    this._onChange = this._onChange.bind(this);
    this._onDrop = this._onDrop.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onClick = this._onClick.bind(this);
    this.alignCursor = this.alignCursor.bind(this);
    this.alignCursorFriendly = this.alignCursorFriendly.bind(this);
    this._bindEvents();
    this.updateValue();
    this._onChange();
  }
  maskEquals(mask) {
    var _this$masked;
    return mask == null || ((_this$masked = this.masked) == null ? void 0 : _this$masked.maskEquals(mask));
  }
  /** Masked */
  get mask() {
    return this.masked.mask;
  }
  set mask(mask) {
    if (this.maskEquals(mask))
      return;
    if (!(mask instanceof IMask.Masked) && this.masked.constructor === maskedClass(mask)) {
      this.masked.updateOptions({
        mask
      });
      return;
    }
    const masked = mask instanceof IMask.Masked ? mask : createMask({
      mask
    });
    masked.unmaskedValue = this.masked.unmaskedValue;
    this.masked = masked;
  }
  /** Raw value */
  get value() {
    return this._value;
  }
  set value(str) {
    if (this.value === str)
      return;
    this.masked.value = str;
    this.updateControl();
    this.alignCursor();
  }
  /** Unmasked value */
  get unmaskedValue() {
    return this._unmaskedValue;
  }
  set unmaskedValue(str) {
    if (this.unmaskedValue === str)
      return;
    this.masked.unmaskedValue = str;
    this.updateControl();
    this.alignCursor();
  }
  /** Typed unmasked value */
  get typedValue() {
    return this.masked.typedValue;
  }
  set typedValue(val) {
    if (this.masked.typedValueEquals(val))
      return;
    this.masked.typedValue = val;
    this.updateControl();
    this.alignCursor();
  }
  /** Display value */
  get displayValue() {
    return this.masked.displayValue;
  }
  /** Starts listening to element events */
  _bindEvents() {
    this.el.bindEvents({
      selectionChange: this._saveSelection,
      input: this._onInput,
      drop: this._onDrop,
      click: this._onClick,
      focus: this._onFocus,
      commit: this._onChange
    });
  }
  /** Stops listening to element events */
  _unbindEvents() {
    if (this.el)
      this.el.unbindEvents();
  }
  /** Fires custom event */
  _fireEvent(ev, e) {
    const listeners = this._listeners[ev];
    if (!listeners)
      return;
    listeners.forEach((l) => l(e));
  }
  /** Current selection start */
  get selectionStart() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionStart;
  }
  /** Current cursor position */
  get cursorPos() {
    return this._cursorChanging ? this._changingCursorPos : this.el.selectionEnd;
  }
  set cursorPos(pos) {
    if (!this.el || !this.el.isActive)
      return;
    this.el.select(pos, pos);
    this._saveSelection();
  }
  /** Stores current selection */
  _saveSelection() {
    if (this.displayValue !== this.el.value) {
      console.warn("Element value was changed outside of mask. Syncronize mask using `mask.updateValue()` to work properly.");
    }
    this._selection = {
      start: this.selectionStart,
      end: this.cursorPos
    };
  }
  /** Syncronizes model value from view */
  updateValue() {
    this.masked.value = this.el.value;
    this._value = this.masked.value;
  }
  /** Syncronizes view from model value, fires change events */
  updateControl() {
    const newUnmaskedValue = this.masked.unmaskedValue;
    const newValue = this.masked.value;
    const newDisplayValue = this.displayValue;
    const isChanged = this.unmaskedValue !== newUnmaskedValue || this.value !== newValue;
    this._unmaskedValue = newUnmaskedValue;
    this._value = newValue;
    if (this.el.value !== newDisplayValue)
      this.el.value = newDisplayValue;
    if (isChanged)
      this._fireChangeEvents();
  }
  /** Updates options with deep equal check, recreates {@link Masked} model if mask type changes */
  updateOptions(opts) {
    const {
      mask,
      ...restOpts
    } = opts;
    const updateMask = !this.maskEquals(mask);
    const updateOpts = !objectIncludes(this.masked, restOpts);
    if (updateMask)
      this.mask = mask;
    if (updateOpts)
      this.masked.updateOptions(restOpts);
    if (updateMask || updateOpts)
      this.updateControl();
  }
  /** Updates cursor */
  updateCursor(cursorPos) {
    if (cursorPos == null)
      return;
    this.cursorPos = cursorPos;
    this._delayUpdateCursor(cursorPos);
  }
  /** Delays cursor update to support mobile browsers */
  _delayUpdateCursor(cursorPos) {
    this._abortUpdateCursor();
    this._changingCursorPos = cursorPos;
    this._cursorChanging = setTimeout(() => {
      if (!this.el)
        return;
      this.cursorPos = this._changingCursorPos;
      this._abortUpdateCursor();
    }, 10);
  }
  /** Fires custom events */
  _fireChangeEvents() {
    this._fireEvent("accept", this._inputEvent);
    if (this.masked.isComplete)
      this._fireEvent("complete", this._inputEvent);
  }
  /** Aborts delayed cursor update */
  _abortUpdateCursor() {
    if (this._cursorChanging) {
      clearTimeout(this._cursorChanging);
      delete this._cursorChanging;
    }
  }
  /** Aligns cursor to nearest available position */
  alignCursor() {
    this.cursorPos = this.masked.nearestInputPos(this.masked.nearestInputPos(this.cursorPos, DIRECTION.LEFT));
  }
  /** Aligns cursor only if selection is empty */
  alignCursorFriendly() {
    if (this.selectionStart !== this.cursorPos)
      return;
    this.alignCursor();
  }
  /** Adds listener on custom event */
  on(ev, handler) {
    if (!this._listeners[ev])
      this._listeners[ev] = [];
    this._listeners[ev].push(handler);
    return this;
  }
  /** Removes custom event listener */
  off(ev, handler) {
    if (!this._listeners[ev])
      return this;
    if (!handler) {
      delete this._listeners[ev];
      return this;
    }
    const hIndex = this._listeners[ev].indexOf(handler);
    if (hIndex >= 0)
      this._listeners[ev].splice(hIndex, 1);
    return this;
  }
  /** Handles view input event */
  _onInput(e) {
    this._inputEvent = e;
    this._abortUpdateCursor();
    if (!this._selection)
      return this.updateValue();
    const details = new ActionDetails({
      // new state
      value: this.el.value,
      cursorPos: this.cursorPos,
      // old state
      oldValue: this.displayValue,
      oldSelection: this._selection
    });
    const oldRawValue = this.masked.rawInputValue;
    const offset2 = this.masked.splice(details.startChangePos, details.removed.length, details.inserted, details.removeDirection, {
      input: true,
      raw: true
    }).offset;
    const removeDirection = oldRawValue === this.masked.rawInputValue ? details.removeDirection : DIRECTION.NONE;
    let cursorPos = this.masked.nearestInputPos(details.startChangePos + offset2, removeDirection);
    if (removeDirection !== DIRECTION.NONE)
      cursorPos = this.masked.nearestInputPos(cursorPos, DIRECTION.NONE);
    this.updateControl();
    this.updateCursor(cursorPos);
    delete this._inputEvent;
  }
  /** Handles view change event and commits model value */
  _onChange() {
    if (this.displayValue !== this.el.value) {
      this.updateValue();
    }
    this.masked.doCommit();
    this.updateControl();
    this._saveSelection();
  }
  /** Handles view drop event, prevents by default */
  _onDrop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
  }
  /** Restore last selection on focus */
  _onFocus(ev) {
    this.alignCursorFriendly();
  }
  /** Restore last selection on focus */
  _onClick(ev) {
    this.alignCursorFriendly();
  }
  /** Unbind view events and removes element reference */
  destroy() {
    this._unbindEvents();
    this._listeners.length = 0;
    delete this.el;
  }
}
IMask.InputMask = InputMask;
class ChangeDetails {
  /** Inserted symbols */
  /** Can skip chars */
  /** Additional offset if any changes occurred before tail */
  /** Raw inserted is used by dynamic mask */
  static normalize(prep) {
    return Array.isArray(prep) ? prep : [prep, new ChangeDetails()];
  }
  constructor(details) {
    Object.assign(this, {
      inserted: "",
      rawInserted: "",
      skip: false,
      tailShift: 0
    }, details);
  }
  /** Aggregate changes */
  aggregate(details) {
    this.rawInserted += details.rawInserted;
    this.skip = this.skip || details.skip;
    this.inserted += details.inserted;
    this.tailShift += details.tailShift;
    return this;
  }
  /** Total offset considering all changes */
  get offset() {
    return this.tailShift + this.inserted.length;
  }
}
IMask.ChangeDetails = ChangeDetails;
class ContinuousTailDetails {
  /** Tail value as string */
  /** Tail start position */
  /** Start position */
  constructor(value, from, stop) {
    if (value === void 0) {
      value = "";
    }
    if (from === void 0) {
      from = 0;
    }
    this.value = value;
    this.from = from;
    this.stop = stop;
  }
  toString() {
    return this.value;
  }
  extend(tail) {
    this.value += String(tail);
  }
  appendTo(masked) {
    return masked.append(this.toString(), {
      tail: true
    }).aggregate(masked._appendPlaceholder());
  }
  get state() {
    return {
      value: this.value,
      from: this.from,
      stop: this.stop
    };
  }
  set state(state) {
    Object.assign(this, state);
  }
  unshift(beforePos) {
    if (!this.value.length || beforePos != null && this.from >= beforePos)
      return "";
    const shiftChar = this.value[0];
    this.value = this.value.slice(1);
    return shiftChar;
  }
  shift() {
    if (!this.value.length)
      return "";
    const shiftChar = this.value[this.value.length - 1];
    this.value = this.value.slice(0, -1);
    return shiftChar;
  }
}
class Masked {
  /** */
  /** */
  /** Transforms value before mask processing */
  /** Transforms each char before mask processing */
  /** Validates if value is acceptable */
  /** Does additional processing at the end of editing */
  /** Format typed value to string */
  /** Parse string to get typed value */
  /** Enable characters overwriting */
  /** */
  /** */
  /** */
  constructor(opts) {
    this._value = "";
    this._update({
      ...Masked.DEFAULTS,
      ...opts
    });
    this._initialized = true;
  }
  /** Sets and applies new options */
  updateOptions(opts) {
    if (!Object.keys(opts).length)
      return;
    this.withValueRefresh(this._update.bind(this, opts));
  }
  /** Sets new options */
  _update(opts) {
    Object.assign(this, opts);
  }
  /** Mask state */
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(state) {
    this._value = state._value;
  }
  /** Resets value */
  reset() {
    this._value = "";
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this.resolve(value, {
      input: true
    });
  }
  /** Resolve new value */
  resolve(value, flags) {
    if (flags === void 0) {
      flags = {
        input: true
      };
    }
    this.reset();
    this.append(value, flags, "");
    this.doCommit();
  }
  get unmaskedValue() {
    return this.value;
  }
  set unmaskedValue(value) {
    this.resolve(value, {});
  }
  get typedValue() {
    return this.parse ? this.parse(this.value, this) : this.unmaskedValue;
  }
  set typedValue(value) {
    if (this.format) {
      this.value = this.format(value, this);
    } else {
      this.unmaskedValue = String(value);
    }
  }
  /** Value that includes raw user input */
  get rawInputValue() {
    return this.extractInput(0, this.displayValue.length, {
      raw: true
    });
  }
  set rawInputValue(value) {
    this.resolve(value, {
      raw: true
    });
  }
  get displayValue() {
    return this.value;
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return this.isComplete;
  }
  /** Finds nearest input position in direction */
  nearestInputPos(cursorPos, direction) {
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return Math.min(this.displayValue.length, toPos - fromPos);
  }
  /** Extracts value in range considering flags */
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return this.displayValue.slice(fromPos, toPos);
  }
  /** Extracts tail in range */
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    return new ContinuousTailDetails(this.extractInput(fromPos, toPos), fromPos);
  }
  /** Appends tail */
  appendTail(tail) {
    if (isString(tail))
      tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  /** Appends char */
  _appendCharRaw(ch, flags) {
    if (!ch)
      return new ChangeDetails();
    this._value += ch;
    return new ChangeDetails({
      inserted: ch,
      rawInserted: ch
    });
  }
  /** Appends char */
  _appendChar(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const consistentState = this.state;
    let details;
    [ch, details] = this.doPrepareChar(ch, flags);
    details = details.aggregate(this._appendCharRaw(ch, flags));
    if (details.inserted) {
      let consistentTail;
      let appended = this.doValidate(flags) !== false;
      if (appended && checkTail != null) {
        const beforeTailState = this.state;
        if (this.overwrite === true) {
          consistentTail = checkTail.state;
          checkTail.unshift(this.displayValue.length - details.tailShift);
        }
        let tailDetails = this.appendTail(checkTail);
        appended = tailDetails.rawInserted === checkTail.toString();
        if (!(appended && tailDetails.inserted) && this.overwrite === "shift") {
          this.state = beforeTailState;
          consistentTail = checkTail.state;
          checkTail.shift();
          tailDetails = this.appendTail(checkTail);
          appended = tailDetails.rawInserted === checkTail.toString();
        }
        if (appended && tailDetails.inserted)
          this.state = beforeTailState;
      }
      if (!appended) {
        details = new ChangeDetails();
        this.state = consistentState;
        if (checkTail && consistentTail)
          checkTail.state = consistentTail;
      }
    }
    return details;
  }
  /** Appends optional placeholder at the end */
  _appendPlaceholder() {
    return new ChangeDetails();
  }
  /** Appends optional eager placeholder at the end */
  _appendEager() {
    return new ChangeDetails();
  }
  /** Appends symbols considering flags */
  append(str, flags, tail) {
    if (!isString(str))
      throw new Error("value should be string");
    const checkTail = isString(tail) ? new ContinuousTailDetails(String(tail)) : tail;
    if (flags != null && flags.tail)
      flags._beforeTailState = this.state;
    let details;
    [str, details] = this.doPrepare(str, flags);
    for (let ci = 0; ci < str.length; ++ci) {
      const d = this._appendChar(str[ci], flags, checkTail);
      if (!d.rawInserted && !this.doSkipInvalid(str[ci], flags, checkTail))
        break;
      details.aggregate(d);
    }
    if ((this.eager === true || this.eager === "append") && flags != null && flags.input && str) {
      details.aggregate(this._appendEager());
    }
    if (checkTail != null) {
      details.tailShift += this.appendTail(checkTail).tailShift;
    }
    return details;
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    this._value = this.displayValue.slice(0, fromPos) + this.displayValue.slice(toPos);
    return new ChangeDetails();
  }
  /** Calls function and reapplies current value */
  withValueRefresh(fn) {
    if (this._refreshing || !this._initialized)
      return fn();
    this._refreshing = true;
    const rawInput = this.rawInputValue;
    const value = this.value;
    const ret = fn();
    this.rawInputValue = rawInput;
    if (this.value && this.value !== value && value.indexOf(this.value) === 0) {
      this.append(value.slice(this.displayValue.length), {}, "");
    }
    delete this._refreshing;
    return ret;
  }
  runIsolated(fn) {
    if (this._isolated || !this._initialized)
      return fn(this);
    this._isolated = true;
    const state = this.state;
    const ret = fn(this);
    this.state = state;
    delete this._isolated;
    return ret;
  }
  doSkipInvalid(ch, flags, checkTail) {
    return Boolean(this.skipInvalid);
  }
  /** Prepares string before mask processing */
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(this.prepare ? this.prepare(str, this, flags) : str);
  }
  /** Prepares each char before mask processing */
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    return ChangeDetails.normalize(this.prepareChar ? this.prepareChar(str, this, flags) : str);
  }
  /** Validates if value is acceptable */
  doValidate(flags) {
    return (!this.validate || this.validate(this.value, this, flags)) && (!this.parent || this.parent.doValidate(flags));
  }
  /** Does additional processing at the end of editing */
  doCommit() {
    if (this.commit)
      this.commit(this.value, this);
  }
  splice(start, deleteCount, inserted, removeDirection, flags) {
    if (removeDirection === void 0) {
      removeDirection = DIRECTION.NONE;
    }
    if (flags === void 0) {
      flags = {
        input: true
      };
    }
    const tailPos = start + deleteCount;
    const tail = this.extractTail(tailPos);
    const eagerRemove = this.eager === true || this.eager === "remove";
    let oldRawValue;
    if (eagerRemove) {
      removeDirection = forceDirection(removeDirection);
      oldRawValue = this.extractInput(0, tailPos, {
        raw: true
      });
    }
    let startChangePos = start;
    const details = new ChangeDetails();
    if (removeDirection !== DIRECTION.NONE) {
      startChangePos = this.nearestInputPos(start, deleteCount > 1 && start !== 0 && !eagerRemove ? DIRECTION.NONE : removeDirection);
      details.tailShift = startChangePos - start;
    }
    details.aggregate(this.remove(startChangePos));
    if (eagerRemove && removeDirection !== DIRECTION.NONE && oldRawValue === this.rawInputValue) {
      if (removeDirection === DIRECTION.FORCE_LEFT) {
        let valLength;
        while (oldRawValue === this.rawInputValue && (valLength = this.displayValue.length)) {
          details.aggregate(new ChangeDetails({
            tailShift: -1
          })).aggregate(this.remove(valLength - 1));
        }
      } else if (removeDirection === DIRECTION.FORCE_RIGHT) {
        tail.unshift();
      }
    }
    return details.aggregate(this.append(inserted, flags, tail));
  }
  maskEquals(mask) {
    return this.mask === mask;
  }
  typedValueEquals(value) {
    const tval = this.typedValue;
    return value === tval || Masked.EMPTY_VALUES.includes(value) && Masked.EMPTY_VALUES.includes(tval) || (this.format ? this.format(value, this) === this.format(this.typedValue, this) : false);
  }
}
Masked.DEFAULTS = {
  skipInvalid: true
};
Masked.EMPTY_VALUES = [void 0, null, ""];
IMask.Masked = Masked;
class ChunksTailDetails {
  /** */
  constructor(chunks, from) {
    if (chunks === void 0) {
      chunks = [];
    }
    if (from === void 0) {
      from = 0;
    }
    this.chunks = chunks;
    this.from = from;
  }
  toString() {
    return this.chunks.map(String).join("");
  }
  extend(tailChunk) {
    if (!String(tailChunk))
      return;
    tailChunk = isString(tailChunk) ? new ContinuousTailDetails(String(tailChunk)) : tailChunk;
    const lastChunk = this.chunks[this.chunks.length - 1];
    const extendLast = lastChunk && // if stops are same or tail has no stop
    (lastChunk.stop === tailChunk.stop || tailChunk.stop == null) && // if tail chunk goes just after last chunk
    tailChunk.from === lastChunk.from + lastChunk.toString().length;
    if (tailChunk instanceof ContinuousTailDetails) {
      if (extendLast) {
        lastChunk.extend(tailChunk.toString());
      } else {
        this.chunks.push(tailChunk);
      }
    } else if (tailChunk instanceof ChunksTailDetails) {
      if (tailChunk.stop == null) {
        let firstTailChunk;
        while (tailChunk.chunks.length && tailChunk.chunks[0].stop == null) {
          firstTailChunk = tailChunk.chunks.shift();
          firstTailChunk.from += tailChunk.from;
          this.extend(firstTailChunk);
        }
      }
      if (tailChunk.toString()) {
        tailChunk.stop = tailChunk.blockIndex;
        this.chunks.push(tailChunk);
      }
    }
  }
  appendTo(masked) {
    if (!(masked instanceof IMask.MaskedPattern)) {
      const tail = new ContinuousTailDetails(this.toString());
      return tail.appendTo(masked);
    }
    const details = new ChangeDetails();
    for (let ci = 0; ci < this.chunks.length && !details.skip; ++ci) {
      const chunk = this.chunks[ci];
      const lastBlockIter = masked._mapPosToBlock(masked.displayValue.length);
      const stop = chunk.stop;
      let chunkBlock;
      if (stop != null && // if block not found or stop is behind lastBlock
      (!lastBlockIter || lastBlockIter.index <= stop)) {
        if (chunk instanceof ChunksTailDetails || // for continuous block also check if stop is exist
        masked._stops.indexOf(stop) >= 0) {
          const phDetails = masked._appendPlaceholder(stop);
          details.aggregate(phDetails);
        }
        chunkBlock = chunk instanceof ChunksTailDetails && masked._blocks[stop];
      }
      if (chunkBlock) {
        const tailDetails = chunkBlock.appendTail(chunk);
        tailDetails.skip = false;
        details.aggregate(tailDetails);
        masked._value += tailDetails.inserted;
        const remainChars = chunk.toString().slice(tailDetails.rawInserted.length);
        if (remainChars)
          details.aggregate(masked.append(remainChars, {
            tail: true
          }));
      } else {
        details.aggregate(masked.append(chunk.toString(), {
          tail: true
        }));
      }
    }
    return details;
  }
  get state() {
    return {
      chunks: this.chunks.map((c) => c.state),
      from: this.from,
      stop: this.stop,
      blockIndex: this.blockIndex
    };
  }
  set state(state) {
    const {
      chunks,
      ...props
    } = state;
    Object.assign(this, props);
    this.chunks = chunks.map((cstate) => {
      const chunk = "chunks" in cstate ? new ChunksTailDetails() : new ContinuousTailDetails();
      chunk.state = cstate;
      return chunk;
    });
  }
  unshift(beforePos) {
    if (!this.chunks.length || beforePos != null && this.from >= beforePos)
      return "";
    const chunkShiftPos = beforePos != null ? beforePos - this.from : beforePos;
    let ci = 0;
    while (ci < this.chunks.length) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.unshift(chunkShiftPos);
      if (chunk.toString()) {
        if (!shiftChar)
          break;
        ++ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar)
        return shiftChar;
    }
    return "";
  }
  shift() {
    if (!this.chunks.length)
      return "";
    let ci = this.chunks.length - 1;
    while (0 <= ci) {
      const chunk = this.chunks[ci];
      const shiftChar = chunk.shift();
      if (chunk.toString()) {
        if (!shiftChar)
          break;
        --ci;
      } else {
        this.chunks.splice(ci, 1);
      }
      if (shiftChar)
        return shiftChar;
    }
    return "";
  }
}
class PatternCursor {
  constructor(masked, pos) {
    this.masked = masked;
    this._log = [];
    const {
      offset: offset2,
      index: index2
    } = masked._mapPosToBlock(pos) || (pos < 0 ? (
      // first
      {
        index: 0,
        offset: 0
      }
    ) : (
      // last
      {
        index: this.masked._blocks.length,
        offset: 0
      }
    ));
    this.offset = offset2;
    this.index = index2;
    this.ok = false;
  }
  get block() {
    return this.masked._blocks[this.index];
  }
  get pos() {
    return this.masked._blockStartPos(this.index) + this.offset;
  }
  get state() {
    return {
      index: this.index,
      offset: this.offset,
      ok: this.ok
    };
  }
  set state(s) {
    Object.assign(this, s);
  }
  pushState() {
    this._log.push(this.state);
  }
  popState() {
    const s = this._log.pop();
    if (s)
      this.state = s;
    return s;
  }
  bindBlock() {
    if (this.block)
      return;
    if (this.index < 0) {
      this.index = 0;
      this.offset = 0;
    }
    if (this.index >= this.masked._blocks.length) {
      this.index = this.masked._blocks.length - 1;
      this.offset = this.block.displayValue.length;
    }
  }
  _pushLeft(fn) {
    this.pushState();
    for (this.bindBlock(); 0 <= this.index; --this.index, this.offset = ((_this$block = this.block) == null ? void 0 : _this$block.displayValue.length) || 0) {
      var _this$block;
      if (fn())
        return this.ok = true;
    }
    return this.ok = false;
  }
  _pushRight(fn) {
    this.pushState();
    for (this.bindBlock(); this.index < this.masked._blocks.length; ++this.index, this.offset = 0) {
      if (fn())
        return this.ok = true;
    }
    return this.ok = false;
  }
  pushLeftBeforeFilled() {
    return this._pushLeft(() => {
      if (this.block.isFixed || !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_LEFT);
      if (this.offset !== 0)
        return true;
    });
  }
  pushLeftBeforeInput() {
    return this._pushLeft(() => {
      if (this.block.isFixed)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushLeftBeforeRequired() {
    return this._pushLeft(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.LEFT);
      return true;
    });
  }
  pushRightBeforeFilled() {
    return this._pushRight(() => {
      if (this.block.isFixed || !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.FORCE_RIGHT);
      if (this.offset !== this.block.value.length)
        return true;
    });
  }
  pushRightBeforeInput() {
    return this._pushRight(() => {
      if (this.block.isFixed)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
  pushRightBeforeRequired() {
    return this._pushRight(() => {
      if (this.block.isFixed || this.block.isOptional && !this.block.value)
        return;
      this.offset = this.block.nearestInputPos(this.offset, DIRECTION.NONE);
      return true;
    });
  }
}
class PatternFixedDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    Object.assign(this, opts);
    this._value = "";
    this.isFixed = true;
  }
  get value() {
    return this._value;
  }
  get unmaskedValue() {
    return this.isUnmasking ? this.value : "";
  }
  get rawInputValue() {
    return this._isRawInput ? this.value : "";
  }
  get displayValue() {
    return this.value;
  }
  reset() {
    this._isRawInput = false;
    this._value = "";
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    this._value = this._value.slice(0, fromPos) + this._value.slice(toPos);
    if (!this._value)
      this._isRawInput = false;
    return new ChangeDetails();
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this._value.length;
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return minPos;
      case DIRECTION.NONE:
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
      default:
        return maxPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    return this._isRawInput ? toPos - fromPos : 0;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this._value.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    return flags.raw && this._isRawInput && this._value.slice(fromPos, toPos) || "";
  }
  get isComplete() {
    return true;
  }
  get isFilled() {
    return Boolean(this._value);
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = new ChangeDetails();
    if (this.isFilled)
      return details;
    const appendEager = this.eager === true || this.eager === "append";
    const appended = this.char === ch;
    const isResolved = appended && (this.isUnmasking || flags.input || flags.raw) && (!flags.raw || !appendEager) && !flags.tail;
    if (isResolved)
      details.rawInserted = this.char;
    this._value = details.inserted = this.char;
    this._isRawInput = isResolved && (flags.raw || flags.input);
    return details;
  }
  _appendEager() {
    return this._appendChar(this.char, {
      tail: true
    });
  }
  _appendPlaceholder() {
    const details = new ChangeDetails();
    if (this.isFilled)
      return details;
    this._value = details.inserted = this.char;
    return details;
  }
  extractTail() {
    return new ContinuousTailDetails("");
  }
  appendTail(tail) {
    if (isString(tail))
      tail = new ContinuousTailDetails(String(tail));
    return tail.appendTo(this);
  }
  append(str, flags, tail) {
    const details = this._appendChar(str[0], flags);
    if (tail != null) {
      details.tailShift += this.appendTail(tail).tailShift;
    }
    return details;
  }
  doCommit() {
  }
  get state() {
    return {
      _value: this._value,
      _rawInputValue: this.rawInputValue
    };
  }
  set state(state) {
    this._value = state._value;
    this._isRawInput = Boolean(state._rawInputValue);
  }
}
class PatternInputDefinition {
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  /** */
  constructor(opts) {
    const {
      parent: parent2,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager,
      ...maskOpts
    } = opts;
    this.masked = createMask(maskOpts);
    Object.assign(this, {
      parent: parent2,
      isOptional,
      placeholderChar,
      displayChar,
      lazy,
      eager
    });
  }
  reset() {
    this.isFilled = false;
    this.masked.reset();
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    if (fromPos === 0 && toPos >= 1) {
      this.isFilled = false;
      return this.masked.remove(fromPos, toPos);
    }
    return new ChangeDetails();
  }
  get value() {
    return this.masked.value || (this.isFilled && !this.isOptional ? this.placeholderChar : "");
  }
  get unmaskedValue() {
    return this.masked.unmaskedValue;
  }
  get rawInputValue() {
    return this.masked.rawInputValue;
  }
  get displayValue() {
    return this.masked.value && this.displayChar || this.value;
  }
  get isComplete() {
    return Boolean(this.masked.value) || this.isOptional;
  }
  _appendChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (this.isFilled)
      return new ChangeDetails();
    const state = this.masked.state;
    const details = this.masked._appendChar(ch, this.currentMaskFlags(flags));
    if (details.inserted && this.doValidate(flags) === false) {
      details.inserted = details.rawInserted = "";
      this.masked.state = state;
    }
    if (!details.inserted && !this.isOptional && !this.lazy && !flags.input) {
      details.inserted = this.placeholderChar;
    }
    details.skip = !details.inserted && !this.isOptional;
    this.isFilled = Boolean(details.inserted);
    return details;
  }
  append(str, flags, tail) {
    return this.masked.append(str, this.currentMaskFlags(flags), tail);
  }
  _appendPlaceholder() {
    const details = new ChangeDetails();
    if (this.isFilled || this.isOptional)
      return details;
    this.isFilled = true;
    details.inserted = this.placeholderChar;
    return details;
  }
  _appendEager() {
    return new ChangeDetails();
  }
  extractTail(fromPos, toPos) {
    return this.masked.extractTail(fromPos, toPos);
  }
  appendTail(tail) {
    return this.masked.appendTail(tail);
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.masked.extractInput(fromPos, toPos, flags);
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    const minPos = 0;
    const maxPos = this.value.length;
    const boundPos = Math.min(Math.max(cursorPos, minPos), maxPos);
    switch (direction) {
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT:
        return this.isComplete ? boundPos : minPos;
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT:
        return this.isComplete ? boundPos : maxPos;
      case DIRECTION.NONE:
      default:
        return boundPos;
    }
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.value.length;
    }
    return this.value.slice(fromPos, toPos).length;
  }
  doValidate(flags) {
    return this.masked.doValidate(this.currentMaskFlags(flags)) && (!this.parent || this.parent.doValidate(this.currentMaskFlags(flags)));
  }
  doCommit() {
    this.masked.doCommit();
  }
  get state() {
    return {
      _value: this.value,
      _rawInputValue: this.rawInputValue,
      masked: this.masked.state,
      isFilled: this.isFilled
    };
  }
  set state(state) {
    this.masked.state = state.masked;
    this.isFilled = state.isFilled;
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta;
    return {
      ...flags,
      _beforeTailState: (flags == null || (_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.masked) || (flags == null ? void 0 : flags._beforeTailState)
    };
  }
}
PatternInputDefinition.DEFAULT_DEFINITIONS = {
  "0": /\d/,
  "a": /[\u0041-\u005A\u0061-\u007A\u00AA\u00B5\u00BA\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097F\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2183\u2184\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005\u3006\u3031-\u3035\u303B\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA697\uA6A0-\uA6E5\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA793\uA7A0-\uA7AA\uA7F8-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
  // http://stackoverflow.com/a/22075070
  "*": /./
};
class MaskedRegExp extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const mask = opts.mask;
    if (mask)
      opts.validate = (value) => value.search(mask) >= 0;
    super._update(opts);
  }
}
IMask.MaskedRegExp = MaskedRegExp;
class MaskedPattern extends Masked {
  /** */
  /** */
  /** Single char for empty input */
  /** Single char for filled input */
  /** Show placeholder only when needed */
  /** Enable characters overwriting */
  /** */
  /** */
  constructor(opts) {
    super({
      ...MaskedPattern.DEFAULTS,
      ...opts,
      definitions: Object.assign({}, PatternInputDefinition.DEFAULT_DEFINITIONS, opts == null ? void 0 : opts.definitions)
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    opts.definitions = Object.assign({}, this.definitions, opts.definitions);
    super._update(opts);
    this._rebuildMask();
  }
  _rebuildMask() {
    const defs = this.definitions;
    this._blocks = [];
    this.exposeBlock = void 0;
    this._stops = [];
    this._maskedBlocks = {};
    const pattern = this.mask;
    if (!pattern || !defs)
      return;
    let unmaskingBlock = false;
    let optionalBlock = false;
    for (let i = 0; i < pattern.length; ++i) {
      if (this.blocks) {
        const p = pattern.slice(i);
        const bNames = Object.keys(this.blocks).filter((bName2) => p.indexOf(bName2) === 0);
        bNames.sort((a, b) => b.length - a.length);
        const bName = bNames[0];
        if (bName) {
          const {
            expose,
            ...blockOpts
          } = normalizeOpts(this.blocks[bName]);
          const maskedBlock = createMask({
            lazy: this.lazy,
            eager: this.eager,
            placeholderChar: this.placeholderChar,
            displayChar: this.displayChar,
            overwrite: this.overwrite,
            ...blockOpts,
            parent: this
          });
          if (maskedBlock) {
            this._blocks.push(maskedBlock);
            if (expose)
              this.exposeBlock = maskedBlock;
            if (!this._maskedBlocks[bName])
              this._maskedBlocks[bName] = [];
            this._maskedBlocks[bName].push(this._blocks.length - 1);
          }
          i += bName.length - 1;
          continue;
        }
      }
      let char = pattern[i];
      let isInput = char in defs;
      if (char === MaskedPattern.STOP_CHAR) {
        this._stops.push(this._blocks.length);
        continue;
      }
      if (char === "{" || char === "}") {
        unmaskingBlock = !unmaskingBlock;
        continue;
      }
      if (char === "[" || char === "]") {
        optionalBlock = !optionalBlock;
        continue;
      }
      if (char === MaskedPattern.ESCAPE_CHAR) {
        ++i;
        char = pattern[i];
        if (!char)
          break;
        isInput = false;
      }
      const def = isInput ? new PatternInputDefinition({
        isOptional: optionalBlock,
        lazy: this.lazy,
        eager: this.eager,
        placeholderChar: this.placeholderChar,
        displayChar: this.displayChar,
        ...normalizeOpts(defs[char]),
        parent: this
      }) : new PatternFixedDefinition({
        char,
        eager: this.eager,
        isUnmasking: unmaskingBlock
      });
      this._blocks.push(def);
    }
  }
  get state() {
    return {
      ...super.state,
      _blocks: this._blocks.map((b) => b.state)
    };
  }
  set state(state) {
    const {
      _blocks,
      ...maskedState
    } = state;
    this._blocks.forEach((b, bi) => b.state = _blocks[bi]);
    super.state = maskedState;
  }
  reset() {
    super.reset();
    this._blocks.forEach((b) => b.reset());
  }
  get isComplete() {
    return this.exposeBlock ? this.exposeBlock.isComplete : this._blocks.every((b) => b.isComplete);
  }
  get isFilled() {
    return this._blocks.every((b) => b.isFilled);
  }
  get isFixed() {
    return this._blocks.every((b) => b.isFixed);
  }
  get isOptional() {
    return this._blocks.every((b) => b.isOptional);
  }
  doCommit() {
    this._blocks.forEach((b) => b.doCommit());
    super.doCommit();
  }
  get unmaskedValue() {
    return this.exposeBlock ? this.exposeBlock.unmaskedValue : this._blocks.reduce((str, b) => str += b.unmaskedValue, "");
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.unmaskedValue = unmaskedValue;
      this.appendTail(tail);
      this.doCommit();
    } else
      super.unmaskedValue = unmaskedValue;
  }
  get value() {
    return this.exposeBlock ? this.exposeBlock.value : (
      // TODO return _value when not in change?
      this._blocks.reduce((str, b) => str += b.value, "")
    );
  }
  set value(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.value = value;
      this.appendTail(tail);
      this.doCommit();
    } else
      super.value = value;
  }
  get typedValue() {
    return this.exposeBlock ? this.exposeBlock.typedValue : super.typedValue;
  }
  set typedValue(value) {
    if (this.exposeBlock) {
      const tail = this.extractTail(this._blockStartPos(this._blocks.indexOf(this.exposeBlock)) + this.exposeBlock.displayValue.length);
      this.exposeBlock.typedValue = value;
      this.appendTail(tail);
      this.doCommit();
    } else
      super.typedValue = value;
  }
  get displayValue() {
    return this._blocks.reduce((str, b) => str += b.displayValue, "");
  }
  appendTail(tail) {
    return super.appendTail(tail).aggregate(this._appendPlaceholder());
  }
  _appendEager() {
    var _this$_mapPosToBlock;
    const details = new ChangeDetails();
    let startBlockIndex = (_this$_mapPosToBlock = this._mapPosToBlock(this.displayValue.length)) == null ? void 0 : _this$_mapPosToBlock.index;
    if (startBlockIndex == null)
      return details;
    if (this._blocks[startBlockIndex].isFilled)
      ++startBlockIndex;
    for (let bi = startBlockIndex; bi < this._blocks.length; ++bi) {
      const d = this._blocks[bi]._appendEager();
      if (!d.inserted)
        break;
      details.aggregate(d);
    }
    return details;
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const blockIter = this._mapPosToBlock(this.displayValue.length);
    const details = new ChangeDetails();
    if (!blockIter)
      return details;
    for (let bi = blockIter.index; ; ++bi) {
      var _flags$_beforeTailSta;
      const block = this._blocks[bi];
      if (!block)
        break;
      const blockDetails = block._appendChar(ch, {
        ...flags,
        _beforeTailState: (_flags$_beforeTailSta = flags._beforeTailState) == null || (_flags$_beforeTailSta = _flags$_beforeTailSta._blocks) == null ? void 0 : _flags$_beforeTailSta[bi]
      });
      const skip = blockDetails.skip;
      details.aggregate(blockDetails);
      if (skip || blockDetails.rawInserted)
        break;
    }
    return details;
  }
  extractTail(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const chunkTail = new ChunksTailDetails();
    if (fromPos === toPos)
      return chunkTail;
    this._forEachBlocksInRange(fromPos, toPos, (b, bi, bFromPos, bToPos) => {
      const blockChunk = b.extractTail(bFromPos, bToPos);
      blockChunk.stop = this._findStopBefore(bi);
      blockChunk.from = this._blockStartPos(bi);
      if (blockChunk instanceof ChunksTailDetails)
        blockChunk.blockIndex = bi;
      chunkTail.extend(blockChunk);
    });
    return chunkTail;
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    if (flags === void 0) {
      flags = {};
    }
    if (fromPos === toPos)
      return "";
    let input = "";
    this._forEachBlocksInRange(fromPos, toPos, (b, _, fromPos2, toPos2) => {
      input += b.extractInput(fromPos2, toPos2, flags);
    });
    return input;
  }
  _findStopBefore(blockIndex) {
    let stopBefore;
    for (let si = 0; si < this._stops.length; ++si) {
      const stop = this._stops[si];
      if (stop <= blockIndex)
        stopBefore = stop;
      else
        break;
    }
    return stopBefore;
  }
  /** Appends placeholder depending on laziness */
  _appendPlaceholder(toBlockIndex) {
    const details = new ChangeDetails();
    if (this.lazy && toBlockIndex == null)
      return details;
    const startBlockIter = this._mapPosToBlock(this.displayValue.length);
    if (!startBlockIter)
      return details;
    const startBlockIndex = startBlockIter.index;
    const endBlockIndex = toBlockIndex != null ? toBlockIndex : this._blocks.length;
    this._blocks.slice(startBlockIndex, endBlockIndex).forEach((b) => {
      if (!b.lazy || toBlockIndex != null) {
        var _blocks2;
        const bDetails = b._appendPlaceholder((_blocks2 = b._blocks) == null ? void 0 : _blocks2.length);
        this._value += bDetails.inserted;
        details.aggregate(bDetails);
      }
    });
    return details;
  }
  /** Finds block in pos */
  _mapPosToBlock(pos) {
    let accVal = "";
    for (let bi = 0; bi < this._blocks.length; ++bi) {
      const block = this._blocks[bi];
      const blockStartPos = accVal.length;
      accVal += block.displayValue;
      if (pos <= accVal.length) {
        return {
          index: bi,
          offset: pos - blockStartPos
        };
      }
    }
  }
  _blockStartPos(blockIndex) {
    return this._blocks.slice(0, blockIndex).reduce((pos, b) => pos += b.displayValue.length, 0);
  }
  _forEachBlocksInRange(fromPos, toPos, fn) {
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const fromBlockIter = this._mapPosToBlock(fromPos);
    if (fromBlockIter) {
      const toBlockIter = this._mapPosToBlock(toPos);
      const isSameBlock = toBlockIter && fromBlockIter.index === toBlockIter.index;
      const fromBlockStartPos = fromBlockIter.offset;
      const fromBlockEndPos = toBlockIter && isSameBlock ? toBlockIter.offset : this._blocks[fromBlockIter.index].displayValue.length;
      fn(this._blocks[fromBlockIter.index], fromBlockIter.index, fromBlockStartPos, fromBlockEndPos);
      if (toBlockIter && !isSameBlock) {
        for (let bi = fromBlockIter.index + 1; bi < toBlockIter.index; ++bi) {
          fn(this._blocks[bi], bi, 0, this._blocks[bi].displayValue.length);
        }
        fn(this._blocks[toBlockIter.index], toBlockIter.index, 0, toBlockIter.offset);
      }
    }
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    const removeDetails = super.remove(fromPos, toPos);
    this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
      removeDetails.aggregate(b.remove(bFromPos, bToPos));
    });
    return removeDetails;
  }
  nearestInputPos(cursorPos, direction) {
    if (direction === void 0) {
      direction = DIRECTION.NONE;
    }
    if (!this._blocks.length)
      return 0;
    const cursor = new PatternCursor(this, cursorPos);
    if (direction === DIRECTION.NONE) {
      if (cursor.pushRightBeforeInput())
        return cursor.pos;
      cursor.popState();
      if (cursor.pushLeftBeforeInput())
        return cursor.pos;
      return this.displayValue.length;
    }
    if (direction === DIRECTION.LEFT || direction === DIRECTION.FORCE_LEFT) {
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeFilled();
        if (cursor.ok && cursor.pos === cursorPos)
          return cursorPos;
        cursor.popState();
      }
      cursor.pushLeftBeforeInput();
      cursor.pushLeftBeforeRequired();
      cursor.pushLeftBeforeFilled();
      if (direction === DIRECTION.LEFT) {
        cursor.pushRightBeforeInput();
        cursor.pushRightBeforeRequired();
        if (cursor.ok && cursor.pos <= cursorPos)
          return cursor.pos;
        cursor.popState();
        if (cursor.ok && cursor.pos <= cursorPos)
          return cursor.pos;
        cursor.popState();
      }
      if (cursor.ok)
        return cursor.pos;
      if (direction === DIRECTION.FORCE_LEFT)
        return 0;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      return 0;
    }
    if (direction === DIRECTION.RIGHT || direction === DIRECTION.FORCE_RIGHT) {
      cursor.pushRightBeforeInput();
      cursor.pushRightBeforeRequired();
      if (cursor.pushRightBeforeFilled())
        return cursor.pos;
      if (direction === DIRECTION.FORCE_RIGHT)
        return this.displayValue.length;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      cursor.popState();
      if (cursor.ok)
        return cursor.pos;
      return this.nearestInputPos(cursorPos, DIRECTION.LEFT);
    }
    return cursorPos;
  }
  totalInputPositions(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    let total = 0;
    this._forEachBlocksInRange(fromPos, toPos, (b, _, bFromPos, bToPos) => {
      total += b.totalInputPositions(bFromPos, bToPos);
    });
    return total;
  }
  /** Get block by name */
  maskedBlock(name) {
    return this.maskedBlocks(name)[0];
  }
  /** Get all blocks by name */
  maskedBlocks(name) {
    const indices = this._maskedBlocks[name];
    if (!indices)
      return [];
    return indices.map((gi) => this._blocks[gi]);
  }
}
MaskedPattern.DEFAULTS = {
  lazy: true,
  placeholderChar: "_"
};
MaskedPattern.STOP_CHAR = "`";
MaskedPattern.ESCAPE_CHAR = "\\";
MaskedPattern.InputDefinition = PatternInputDefinition;
MaskedPattern.FixedDefinition = PatternFixedDefinition;
IMask.MaskedPattern = MaskedPattern;
class MaskedRange extends MaskedPattern {
  /**
    Optionally sets max length of pattern.
    Used when pattern length is longer then `to` param length. Pads zeros at start in this case.
  */
  /** Min bound */
  /** Max bound */
  /** */
  get _matchFrom() {
    return this.maxLength - String(this.from).length;
  }
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      to = this.to || 0,
      from = this.from || 0,
      maxLength = this.maxLength || 0,
      autofix = this.autofix,
      ...patternOpts
    } = opts;
    this.to = to;
    this.from = from;
    this.maxLength = Math.max(String(to).length, maxLength);
    this.autofix = autofix;
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    let sameCharsCount = 0;
    while (sameCharsCount < toStr.length && toStr[sameCharsCount] === fromStr[sameCharsCount])
      ++sameCharsCount;
    patternOpts.mask = toStr.slice(0, sameCharsCount).replace(/0/g, "\\0") + "0".repeat(this.maxLength - sameCharsCount);
    super._update(patternOpts);
  }
  get isComplete() {
    return super.isComplete && Boolean(this.value);
  }
  boundaries(str) {
    let minstr = "";
    let maxstr = "";
    const [, placeholder, num] = str.match(/^(\D*)(\d*)(\D*)/) || [];
    if (num) {
      minstr = "0".repeat(placeholder.length) + num;
      maxstr = "9".repeat(placeholder.length) + num;
    }
    minstr = minstr.padEnd(this.maxLength, "0");
    maxstr = maxstr.padEnd(this.maxLength, "9");
    return [minstr, maxstr];
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let details;
    [ch, details] = super.doPrepareChar(ch.replace(/\D/g, ""), flags);
    if (!this.autofix || !ch)
      return [ch, details];
    const fromStr = String(this.from).padStart(this.maxLength, "0");
    const toStr = String(this.to).padStart(this.maxLength, "0");
    const nextVal = this.value + ch;
    if (nextVal.length > this.maxLength)
      return ["", details];
    const [minstr, maxstr] = this.boundaries(nextVal);
    if (Number(maxstr) < this.from)
      return [fromStr[nextVal.length - 1], details];
    if (Number(minstr) > this.to) {
      if (this.autofix === "pad" && nextVal.length < this.maxLength) {
        return ["", details.aggregate(this.append(fromStr[nextVal.length - 1] + ch, flags))];
      }
      return [toStr[nextVal.length - 1], details];
    }
    return [ch, details];
  }
  doValidate(flags) {
    const str = this.value;
    const firstNonZero = str.search(/[^0]/);
    if (firstNonZero === -1 && str.length <= this._matchFrom)
      return true;
    const [minstr, maxstr] = this.boundaries(str);
    return this.from <= Number(maxstr) && Number(minstr) <= this.to && super.doValidate(flags);
  }
}
IMask.MaskedRange = MaskedRange;
class MaskedDate extends MaskedPattern {
  /** Pattern mask for date according to {@link MaskedDate#format} */
  /** Start date */
  /** End date */
  /** */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    const {
      mask,
      pattern,
      ...patternOpts
    } = {
      ...MaskedDate.DEFAULTS,
      ...opts
    };
    super({
      ...patternOpts,
      mask: isString(mask) ? mask : pattern
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      mask,
      pattern,
      blocks,
      ...patternOpts
    } = {
      ...MaskedDate.DEFAULTS,
      ...opts
    };
    const patternBlocks = Object.assign({}, MaskedDate.GET_DEFAULT_BLOCKS());
    if (opts.min)
      patternBlocks.Y.from = opts.min.getFullYear();
    if (opts.max)
      patternBlocks.Y.to = opts.max.getFullYear();
    if (opts.min && opts.max && patternBlocks.Y.from === patternBlocks.Y.to) {
      patternBlocks.m.from = opts.min.getMonth() + 1;
      patternBlocks.m.to = opts.max.getMonth() + 1;
      if (patternBlocks.m.from === patternBlocks.m.to) {
        patternBlocks.d.from = opts.min.getDate();
        patternBlocks.d.to = opts.max.getDate();
      }
    }
    Object.assign(patternBlocks, this.blocks, blocks);
    Object.keys(patternBlocks).forEach((bk) => {
      const b = patternBlocks[bk];
      if (!("autofix" in b) && "autofix" in opts)
        b.autofix = opts.autofix;
    });
    super._update({
      ...patternOpts,
      mask: isString(mask) ? mask : pattern,
      blocks: patternBlocks
    });
  }
  doValidate(flags) {
    const date = this.date;
    return super.doValidate(flags) && (!this.isComplete || this.isDateExist(this.value) && date != null && (this.min == null || this.min <= date) && (this.max == null || date <= this.max));
  }
  /** Checks if date is exists */
  isDateExist(str) {
    return this.format(this.parse(str, this), this).indexOf(str) >= 0;
  }
  /** Parsed Date */
  get date() {
    return this.typedValue;
  }
  set date(date) {
    this.typedValue = date;
  }
  get typedValue() {
    return this.isComplete ? super.typedValue : null;
  }
  set typedValue(value) {
    super.typedValue = value;
  }
  maskEquals(mask) {
    return mask === Date || super.maskEquals(mask);
  }
}
MaskedDate.GET_DEFAULT_BLOCKS = () => ({
  d: {
    mask: MaskedRange,
    from: 1,
    to: 31,
    maxLength: 2
  },
  m: {
    mask: MaskedRange,
    from: 1,
    to: 12,
    maxLength: 2
  },
  Y: {
    mask: MaskedRange,
    from: 1900,
    to: 9999
  }
});
MaskedDate.DEFAULTS = {
  mask: Date,
  pattern: "d{.}`m{.}`Y",
  format: (date, masked) => {
    if (!date)
      return "";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return [day, month, year].join(".");
  },
  parse: (str, masked) => {
    const [day, month, year] = str.split(".").map(Number);
    return new Date(year, month - 1, day);
  }
};
IMask.MaskedDate = MaskedDate;
class MaskedDynamic extends Masked {
  /** Currently chosen mask */
  /** Currently chosen mask */
  /** Compliled {@link Masked} options */
  /** Chooses {@link Masked} depending on input value */
  constructor(opts) {
    super({
      ...MaskedDynamic.DEFAULTS,
      ...opts
    });
    this.currentMask = void 0;
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    if ("mask" in opts) {
      this.exposeMask = void 0;
      this.compiledMasks = Array.isArray(opts.mask) ? opts.mask.map((m) => {
        const {
          expose,
          ...maskOpts
        } = normalizeOpts(m);
        const masked = createMask({
          overwrite: this._overwrite,
          eager: this._eager,
          skipInvalid: this._skipInvalid,
          ...maskOpts
        });
        if (expose)
          this.exposeMask = masked;
        return masked;
      }) : [];
    }
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const details = this._applyDispatch(ch, flags);
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendChar(ch, this.currentMaskFlags(flags)));
    }
    return details;
  }
  _applyDispatch(appended, flags, tail) {
    if (appended === void 0) {
      appended = "";
    }
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    const prevValueBeforeTail = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._value : this.value;
    const inputValue = this.rawInputValue;
    const insertValue = flags.tail && flags._beforeTailState != null ? flags._beforeTailState._rawInputValue : inputValue;
    const tailValue = inputValue.slice(insertValue.length);
    const prevMask = this.currentMask;
    const details = new ChangeDetails();
    const prevMaskState = prevMask == null ? void 0 : prevMask.state;
    this.currentMask = this.doDispatch(appended, {
      ...flags
    }, tail);
    if (this.currentMask) {
      if (this.currentMask !== prevMask) {
        this.currentMask.reset();
        if (insertValue) {
          const d = this.currentMask.append(insertValue, {
            raw: true
          });
          details.tailShift = d.inserted.length - prevValueBeforeTail.length;
        }
        if (tailValue) {
          details.tailShift += this.currentMask.append(tailValue, {
            raw: true,
            tail: true
          }).tailShift;
        }
      } else if (prevMaskState) {
        this.currentMask.state = prevMaskState;
      }
    }
    return details;
  }
  _appendPlaceholder() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendPlaceholder());
    }
    return details;
  }
  _appendEager() {
    const details = this._applyDispatch();
    if (this.currentMask) {
      details.aggregate(this.currentMask._appendEager());
    }
    return details;
  }
  appendTail(tail) {
    const details = new ChangeDetails();
    if (tail)
      details.aggregate(this._applyDispatch("", {}, tail));
    return details.aggregate(this.currentMask ? this.currentMask.appendTail(tail) : super.appendTail(tail));
  }
  currentMaskFlags(flags) {
    var _flags$_beforeTailSta, _flags$_beforeTailSta2;
    return {
      ...flags,
      _beforeTailState: ((_flags$_beforeTailSta = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta.currentMaskRef) === this.currentMask && ((_flags$_beforeTailSta2 = flags._beforeTailState) == null ? void 0 : _flags$_beforeTailSta2.currentMask) || flags._beforeTailState
    };
  }
  doDispatch(appended, flags, tail) {
    if (flags === void 0) {
      flags = {};
    }
    if (tail === void 0) {
      tail = "";
    }
    return this.dispatch(appended, this, flags, tail);
  }
  doValidate(flags) {
    return super.doValidate(flags) && (!this.currentMask || this.currentMask.doValidate(this.currentMaskFlags(flags)));
  }
  doPrepare(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s, details] = super.doPrepare(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s, currentDetails] = super.doPrepare(s, this.currentMaskFlags(flags));
      details = details.aggregate(currentDetails);
    }
    return [s, details];
  }
  doPrepareChar(str, flags) {
    if (flags === void 0) {
      flags = {};
    }
    let [s, details] = super.doPrepareChar(str, flags);
    if (this.currentMask) {
      let currentDetails;
      [s, currentDetails] = super.doPrepareChar(s, this.currentMaskFlags(flags));
      details = details.aggregate(currentDetails);
    }
    return [s, details];
  }
  reset() {
    var _this$currentMask;
    (_this$currentMask = this.currentMask) == null ? void 0 : _this$currentMask.reset();
    this.compiledMasks.forEach((m) => m.reset());
  }
  get value() {
    return this.exposeMask ? this.exposeMask.value : this.currentMask ? this.currentMask.value : "";
  }
  set value(value) {
    if (this.exposeMask) {
      this.exposeMask.value = value;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else
      super.value = value;
  }
  get unmaskedValue() {
    return this.exposeMask ? this.exposeMask.unmaskedValue : this.currentMask ? this.currentMask.unmaskedValue : "";
  }
  set unmaskedValue(unmaskedValue) {
    if (this.exposeMask) {
      this.exposeMask.unmaskedValue = unmaskedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
    } else
      super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.exposeMask ? this.exposeMask.typedValue : this.currentMask ? this.currentMask.typedValue : "";
  }
  set typedValue(typedValue) {
    if (this.exposeMask) {
      this.exposeMask.typedValue = typedValue;
      this.currentMask = this.exposeMask;
      this._applyDispatch();
      return;
    }
    let unmaskedValue = String(typedValue);
    if (this.currentMask) {
      this.currentMask.typedValue = typedValue;
      unmaskedValue = this.currentMask.unmaskedValue;
    }
    this.unmaskedValue = unmaskedValue;
  }
  get displayValue() {
    return this.currentMask ? this.currentMask.displayValue : "";
  }
  get isComplete() {
    var _this$currentMask2;
    return Boolean((_this$currentMask2 = this.currentMask) == null ? void 0 : _this$currentMask2.isComplete);
  }
  get isFilled() {
    var _this$currentMask3;
    return Boolean((_this$currentMask3 = this.currentMask) == null ? void 0 : _this$currentMask3.isFilled);
  }
  remove(fromPos, toPos) {
    const details = new ChangeDetails();
    if (this.currentMask) {
      details.aggregate(this.currentMask.remove(fromPos, toPos)).aggregate(this._applyDispatch());
    }
    return details;
  }
  get state() {
    var _this$currentMask4;
    return {
      ...super.state,
      _rawInputValue: this.rawInputValue,
      compiledMasks: this.compiledMasks.map((m) => m.state),
      currentMaskRef: this.currentMask,
      currentMask: (_this$currentMask4 = this.currentMask) == null ? void 0 : _this$currentMask4.state
    };
  }
  set state(state) {
    const {
      compiledMasks,
      currentMaskRef,
      currentMask,
      ...maskedState
    } = state;
    if (compiledMasks)
      this.compiledMasks.forEach((m, mi) => m.state = compiledMasks[mi]);
    if (currentMaskRef != null) {
      this.currentMask = currentMaskRef;
      this.currentMask.state = currentMask;
    }
    super.state = maskedState;
  }
  extractInput(fromPos, toPos, flags) {
    return this.currentMask ? this.currentMask.extractInput(fromPos, toPos, flags) : "";
  }
  extractTail(fromPos, toPos) {
    return this.currentMask ? this.currentMask.extractTail(fromPos, toPos) : super.extractTail(fromPos, toPos);
  }
  doCommit() {
    if (this.currentMask)
      this.currentMask.doCommit();
    super.doCommit();
  }
  nearestInputPos(cursorPos, direction) {
    return this.currentMask ? this.currentMask.nearestInputPos(cursorPos, direction) : super.nearestInputPos(cursorPos, direction);
  }
  get overwrite() {
    return this.currentMask ? this.currentMask.overwrite : this._overwrite;
  }
  set overwrite(overwrite) {
    this._overwrite = overwrite;
  }
  get eager() {
    return this.currentMask ? this.currentMask.eager : this._eager;
  }
  set eager(eager) {
    this._eager = eager;
  }
  get skipInvalid() {
    return this.currentMask ? this.currentMask.skipInvalid : this._skipInvalid;
  }
  set skipInvalid(skipInvalid) {
    this._skipInvalid = skipInvalid;
  }
  maskEquals(mask) {
    return Array.isArray(mask) ? this.compiledMasks.every((m, mi) => {
      if (!mask[mi])
        return;
      const {
        mask: oldMask,
        ...restOpts
      } = mask[mi];
      return objectIncludes(m, restOpts) && m.maskEquals(oldMask);
    }) : super.maskEquals(mask);
  }
  typedValueEquals(value) {
    var _this$currentMask5;
    return Boolean((_this$currentMask5 = this.currentMask) == null ? void 0 : _this$currentMask5.typedValueEquals(value));
  }
}
MaskedDynamic.DEFAULTS = void 0;
MaskedDynamic.DEFAULTS = {
  dispatch: (appended, masked, flags, tail) => {
    if (!masked.compiledMasks.length)
      return;
    const inputValue = masked.rawInputValue;
    const inputs = masked.compiledMasks.map((m, index2) => {
      const isCurrent = masked.currentMask === m;
      const startInputPos = isCurrent ? m.displayValue.length : m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT);
      if (m.rawInputValue !== inputValue) {
        m.reset();
        m.append(inputValue, {
          raw: true
        });
      } else if (!isCurrent) {
        m.remove(startInputPos);
      }
      m.append(appended, masked.currentMaskFlags(flags));
      m.appendTail(tail);
      return {
        index: index2,
        weight: m.rawInputValue.length,
        totalInputPositions: m.totalInputPositions(0, Math.max(startInputPos, m.nearestInputPos(m.displayValue.length, DIRECTION.FORCE_LEFT)))
      };
    });
    inputs.sort((i1, i2) => i2.weight - i1.weight || i2.totalInputPositions - i1.totalInputPositions);
    return masked.compiledMasks[inputs[0].index];
  }
};
IMask.MaskedDynamic = MaskedDynamic;
class MaskedEnum extends MaskedPattern {
  constructor(opts) {
    super(opts);
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    const {
      enum: _enum,
      ...eopts
    } = opts;
    if (_enum) {
      const lengths = _enum.map((e) => e.length);
      const requiredLength = Math.min(...lengths);
      const optionalLength = Math.max(...lengths) - requiredLength;
      eopts.mask = "*".repeat(requiredLength);
      if (optionalLength)
        eopts.mask += "[" + "*".repeat(optionalLength) + "]";
      this.enum = _enum;
    }
    super._update(eopts);
  }
  doValidate(flags) {
    return this.enum.some((e) => e.indexOf(this.unmaskedValue) === 0) && super.doValidate(flags);
  }
}
IMask.MaskedEnum = MaskedEnum;
class MaskedFunction extends Masked {
  /** */
  /** Enable characters overwriting */
  /** */
  /** */
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update({
      ...opts,
      validate: opts.mask
    });
  }
}
IMask.MaskedFunction = MaskedFunction;
class MaskedNumber extends Masked {
  /** Single char */
  /** Single char */
  /** Array of single chars */
  /** */
  /** */
  /** Digits after point */
  /** Flag to remove leading and trailing zeros in the end of editing */
  /** Flag to pad trailing zeros after point in the end of editing */
  /** Enable characters overwriting */
  /** */
  /** */
  /** Format typed value to string */
  /** Parse string to get typed value */
  constructor(opts) {
    super({
      ...MaskedNumber.DEFAULTS,
      ...opts
    });
  }
  updateOptions(opts) {
    super.updateOptions(opts);
  }
  _update(opts) {
    super._update(opts);
    this._updateRegExps();
  }
  _updateRegExps() {
    const start = "^" + (this.allowNegative ? "[+|\\-]?" : "");
    const mid = "\\d*";
    const end = (this.scale ? "(" + escapeRegExp(this.radix) + "\\d{0," + this.scale + "})?" : "") + "$";
    this._numberRegExp = new RegExp(start + mid + end);
    this._mapToRadixRegExp = new RegExp("[" + this.mapToRadix.map(escapeRegExp).join("") + "]", "g");
    this._thousandsSeparatorRegExp = new RegExp(escapeRegExp(this.thousandsSeparator), "g");
  }
  _removeThousandsSeparators(value) {
    return value.replace(this._thousandsSeparatorRegExp, "");
  }
  _insertThousandsSeparators(value) {
    const parts = value.split(this.radix);
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandsSeparator);
    return parts.join(this.radix);
  }
  doPrepareChar(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    const [prepCh, details] = super.doPrepareChar(this._removeThousandsSeparators(this.scale && this.mapToRadix.length && /*
      radix should be mapped when
      1) input is done from keyboard = flags.input && flags.raw
      2) unmasked value is set = !flags.input && !flags.raw
      and should not be mapped when
      1) value is set = flags.input && !flags.raw
      2) raw value is set = !flags.input && flags.raw
    */
    (flags.input && flags.raw || !flags.input && !flags.raw) ? ch.replace(this._mapToRadixRegExp, this.radix) : ch), flags);
    if (ch && !prepCh)
      details.skip = true;
    if (prepCh && !this.allowPositive && !this.value && prepCh !== "-")
      details.aggregate(this._appendChar("-"));
    return [prepCh, details];
  }
  _separatorsCount(to, extendOnSeparators) {
    if (extendOnSeparators === void 0) {
      extendOnSeparators = false;
    }
    let count = 0;
    for (let pos = 0; pos < to; ++pos) {
      if (this._value.indexOf(this.thousandsSeparator, pos) === pos) {
        ++count;
        if (extendOnSeparators)
          to += this.thousandsSeparator.length;
      }
    }
    return count;
  }
  _separatorsCountFromSlice(slice) {
    if (slice === void 0) {
      slice = this._value;
    }
    return this._separatorsCount(this._removeThousandsSeparators(slice).length, true);
  }
  extractInput(fromPos, toPos, flags) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    return this._removeThousandsSeparators(super.extractInput(fromPos, toPos, flags));
  }
  _appendCharRaw(ch, flags) {
    if (flags === void 0) {
      flags = {};
    }
    if (!this.thousandsSeparator)
      return super._appendCharRaw(ch, flags);
    const prevBeforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const prevBeforeTailSeparatorsCount = this._separatorsCountFromSlice(prevBeforeTailValue);
    this._value = this._removeThousandsSeparators(this.value);
    const appendDetails = super._appendCharRaw(ch, flags);
    this._value = this._insertThousandsSeparators(this._value);
    const beforeTailValue = flags.tail && flags._beforeTailState ? flags._beforeTailState._value : this._value;
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(beforeTailValue);
    appendDetails.tailShift += (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length;
    appendDetails.skip = !appendDetails.rawInserted && ch === this.thousandsSeparator;
    return appendDetails;
  }
  _findSeparatorAround(pos) {
    if (this.thousandsSeparator) {
      const searchFrom = pos - this.thousandsSeparator.length + 1;
      const separatorPos = this.value.indexOf(this.thousandsSeparator, searchFrom);
      if (separatorPos <= pos)
        return separatorPos;
    }
    return -1;
  }
  _adjustRangeWithSeparators(from, to) {
    const separatorAroundFromPos = this._findSeparatorAround(from);
    if (separatorAroundFromPos >= 0)
      from = separatorAroundFromPos;
    const separatorAroundToPos = this._findSeparatorAround(to);
    if (separatorAroundToPos >= 0)
      to = separatorAroundToPos + this.thousandsSeparator.length;
    return [from, to];
  }
  remove(fromPos, toPos) {
    if (fromPos === void 0) {
      fromPos = 0;
    }
    if (toPos === void 0) {
      toPos = this.displayValue.length;
    }
    [fromPos, toPos] = this._adjustRangeWithSeparators(fromPos, toPos);
    const valueBeforePos = this.value.slice(0, fromPos);
    const valueAfterPos = this.value.slice(toPos);
    const prevBeforeTailSeparatorsCount = this._separatorsCount(valueBeforePos.length);
    this._value = this._insertThousandsSeparators(this._removeThousandsSeparators(valueBeforePos + valueAfterPos));
    const beforeTailSeparatorsCount = this._separatorsCountFromSlice(valueBeforePos);
    return new ChangeDetails({
      tailShift: (beforeTailSeparatorsCount - prevBeforeTailSeparatorsCount) * this.thousandsSeparator.length
    });
  }
  nearestInputPos(cursorPos, direction) {
    if (!this.thousandsSeparator)
      return cursorPos;
    switch (direction) {
      case DIRECTION.NONE:
      case DIRECTION.LEFT:
      case DIRECTION.FORCE_LEFT: {
        const separatorAtLeftPos = this._findSeparatorAround(cursorPos - 1);
        if (separatorAtLeftPos >= 0) {
          const separatorAtLeftEndPos = separatorAtLeftPos + this.thousandsSeparator.length;
          if (cursorPos < separatorAtLeftEndPos || this.value.length <= separatorAtLeftEndPos || direction === DIRECTION.FORCE_LEFT) {
            return separatorAtLeftPos;
          }
        }
        break;
      }
      case DIRECTION.RIGHT:
      case DIRECTION.FORCE_RIGHT: {
        const separatorAtRightPos = this._findSeparatorAround(cursorPos);
        if (separatorAtRightPos >= 0) {
          return separatorAtRightPos + this.thousandsSeparator.length;
        }
      }
    }
    return cursorPos;
  }
  doValidate(flags) {
    let valid = Boolean(this._removeThousandsSeparators(this.value).match(this._numberRegExp));
    if (valid) {
      const number = this.number;
      valid = valid && !isNaN(number) && // check min bound for negative values
      (this.min == null || this.min >= 0 || this.min <= this.number) && // check max bound for positive values
      (this.max == null || this.max <= 0 || this.number <= this.max);
    }
    return valid && super.doValidate(flags);
  }
  doCommit() {
    if (this.value) {
      const number = this.number;
      let validnum = number;
      if (this.min != null)
        validnum = Math.max(validnum, this.min);
      if (this.max != null)
        validnum = Math.min(validnum, this.max);
      if (validnum !== number)
        this.unmaskedValue = this.format(validnum, this);
      let formatted = this.value;
      if (this.normalizeZeros)
        formatted = this._normalizeZeros(formatted);
      if (this.padFractionalZeros && this.scale > 0)
        formatted = this._padFractionalZeros(formatted);
      this._value = formatted;
    }
    super.doCommit();
  }
  _normalizeZeros(value) {
    const parts = this._removeThousandsSeparators(value).split(this.radix);
    parts[0] = parts[0].replace(/^(\D*)(0*)(\d*)/, (match, sign, zeros, num) => sign + num);
    if (value.length && !/\d$/.test(parts[0]))
      parts[0] = parts[0] + "0";
    if (parts.length > 1) {
      parts[1] = parts[1].replace(/0*$/, "");
      if (!parts[1].length)
        parts.length = 1;
    }
    return this._insertThousandsSeparators(parts.join(this.radix));
  }
  _padFractionalZeros(value) {
    if (!value)
      return value;
    const parts = value.split(this.radix);
    if (parts.length < 2)
      parts.push("");
    parts[1] = parts[1].padEnd(this.scale, "0");
    return parts.join(this.radix);
  }
  doSkipInvalid(ch, flags, checkTail) {
    if (flags === void 0) {
      flags = {};
    }
    const dropFractional = this.scale === 0 && ch !== this.thousandsSeparator && (ch === this.radix || ch === MaskedNumber.UNMASKED_RADIX || this.mapToRadix.includes(ch));
    return super.doSkipInvalid(ch, flags, checkTail) && !dropFractional;
  }
  get unmaskedValue() {
    return this._removeThousandsSeparators(this._normalizeZeros(this.value)).replace(this.radix, MaskedNumber.UNMASKED_RADIX);
  }
  set unmaskedValue(unmaskedValue) {
    super.unmaskedValue = unmaskedValue;
  }
  get typedValue() {
    return this.parse(this.unmaskedValue, this);
  }
  set typedValue(n) {
    this.rawInputValue = this.format(n, this).replace(MaskedNumber.UNMASKED_RADIX, this.radix);
  }
  /** Parsed Number */
  get number() {
    return this.typedValue;
  }
  set number(number) {
    this.typedValue = number;
  }
  /**
    Is negative allowed
  */
  get allowNegative() {
    return this.min != null && this.min < 0 || this.max != null && this.max < 0;
  }
  /**
    Is positive allowed
  */
  get allowPositive() {
    return this.min != null && this.min > 0 || this.max != null && this.max > 0;
  }
  typedValueEquals(value) {
    return (super.typedValueEquals(value) || MaskedNumber.EMPTY_VALUES.includes(value) && MaskedNumber.EMPTY_VALUES.includes(this.typedValue)) && !(value === 0 && this.value === "");
  }
}
MaskedNumber.UNMASKED_RADIX = ".";
MaskedNumber.EMPTY_VALUES = [...Masked.EMPTY_VALUES, 0];
MaskedNumber.DEFAULTS = {
  mask: Number,
  radix: ",",
  thousandsSeparator: "",
  mapToRadix: [MaskedNumber.UNMASKED_RADIX],
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  scale: 2,
  normalizeZeros: true,
  padFractionalZeros: false,
  parse: Number,
  format: (n) => n.toLocaleString("en-US", {
    useGrouping: false,
    maximumFractionDigits: 20
  })
};
IMask.MaskedNumber = MaskedNumber;
const PIPE_TYPE = {
  MASKED: "value",
  UNMASKED: "unmaskedValue",
  TYPED: "typedValue"
};
function createPipe(arg, from, to) {
  if (from === void 0) {
    from = PIPE_TYPE.MASKED;
  }
  if (to === void 0) {
    to = PIPE_TYPE.MASKED;
  }
  const masked = createMask(arg);
  return (value) => masked.runIsolated((m) => {
    m[from] = value;
    return m[to];
  });
}
function pipe$1(value, mask, from, to) {
  return createPipe(mask, from, to)(value);
}
IMask.PIPE_TYPE = PIPE_TYPE;
IMask.createPipe = createPipe;
IMask.pipe = pipe$1;
try {
  globalThis.IMask = IMask;
} catch {
}
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var f = n.default;
  if (typeof f == "function") {
    var a = function a2() {
      if (this instanceof a2) {
        var args = [null];
        args.push.apply(args, arguments);
        var Ctor = Function.bind.apply(f, args);
        return new Ctor();
      }
      return f.apply(this, arguments);
    };
    a.prototype = f.prototype;
  } else
    a = {};
  Object.defineProperty(a, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
const require$$0 = [
  {
    name: "nodejs",
    version: "0.2.0",
    date: "2011-08-26",
    lts: false,
    security: false,
    v8: "2.3.8.0"
  },
  {
    name: "nodejs",
    version: "0.3.0",
    date: "2011-08-26",
    lts: false,
    security: false,
    v8: "2.5.1.0"
  },
  {
    name: "nodejs",
    version: "0.4.0",
    date: "2011-08-26",
    lts: false,
    security: false,
    v8: "3.1.2.0"
  },
  {
    name: "nodejs",
    version: "0.5.0",
    date: "2011-08-26",
    lts: false,
    security: false,
    v8: "3.1.8.25"
  },
  {
    name: "nodejs",
    version: "0.6.0",
    date: "2011-11-04",
    lts: false,
    security: false,
    v8: "3.6.6.6"
  },
  {
    name: "nodejs",
    version: "0.7.0",
    date: "2012-01-17",
    lts: false,
    security: false,
    v8: "3.8.6.0"
  },
  {
    name: "nodejs",
    version: "0.8.0",
    date: "2012-06-22",
    lts: false,
    security: false,
    v8: "3.11.10.10"
  },
  {
    name: "nodejs",
    version: "0.9.0",
    date: "2012-07-20",
    lts: false,
    security: false,
    v8: "3.11.10.15"
  },
  {
    name: "nodejs",
    version: "0.10.0",
    date: "2013-03-11",
    lts: false,
    security: false,
    v8: "3.14.5.8"
  },
  {
    name: "nodejs",
    version: "0.11.0",
    date: "2013-03-28",
    lts: false,
    security: false,
    v8: "3.17.13.0"
  },
  {
    name: "nodejs",
    version: "0.12.0",
    date: "2015-02-06",
    lts: false,
    security: false,
    v8: "3.28.73.0"
  },
  {
    name: "nodejs",
    version: "4.0.0",
    date: "2015-09-08",
    lts: false,
    security: false,
    v8: "4.5.103.30"
  },
  {
    name: "nodejs",
    version: "4.1.0",
    date: "2015-09-17",
    lts: false,
    security: false,
    v8: "4.5.103.33"
  },
  {
    name: "nodejs",
    version: "4.2.0",
    date: "2015-10-12",
    lts: "Argon",
    security: false,
    v8: "4.5.103.35"
  },
  {
    name: "nodejs",
    version: "4.3.0",
    date: "2016-02-09",
    lts: "Argon",
    security: false,
    v8: "4.5.103.35"
  },
  {
    name: "nodejs",
    version: "4.4.0",
    date: "2016-03-08",
    lts: "Argon",
    security: false,
    v8: "4.5.103.35"
  },
  {
    name: "nodejs",
    version: "4.5.0",
    date: "2016-08-16",
    lts: "Argon",
    security: false,
    v8: "4.5.103.37"
  },
  {
    name: "nodejs",
    version: "4.6.0",
    date: "2016-09-27",
    lts: "Argon",
    security: true,
    v8: "4.5.103.37"
  },
  {
    name: "nodejs",
    version: "4.7.0",
    date: "2016-12-06",
    lts: "Argon",
    security: false,
    v8: "4.5.103.43"
  },
  {
    name: "nodejs",
    version: "4.8.0",
    date: "2017-02-21",
    lts: "Argon",
    security: false,
    v8: "4.5.103.45"
  },
  {
    name: "nodejs",
    version: "4.9.0",
    date: "2018-03-28",
    lts: "Argon",
    security: true,
    v8: "4.5.103.53"
  },
  {
    name: "nodejs",
    version: "5.0.0",
    date: "2015-10-29",
    lts: false,
    security: false,
    v8: "4.6.85.28"
  },
  {
    name: "nodejs",
    version: "5.1.0",
    date: "2015-11-17",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.2.0",
    date: "2015-12-09",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.3.0",
    date: "2015-12-15",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.4.0",
    date: "2016-01-06",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.5.0",
    date: "2016-01-21",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.6.0",
    date: "2016-02-09",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.7.0",
    date: "2016-02-23",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.8.0",
    date: "2016-03-09",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.9.0",
    date: "2016-03-16",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.10.0",
    date: "2016-04-01",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.11.0",
    date: "2016-04-21",
    lts: false,
    security: false,
    v8: "4.6.85.31"
  },
  {
    name: "nodejs",
    version: "5.12.0",
    date: "2016-06-23",
    lts: false,
    security: false,
    v8: "4.6.85.32"
  },
  {
    name: "nodejs",
    version: "6.0.0",
    date: "2016-04-26",
    lts: false,
    security: false,
    v8: "5.0.71.35"
  },
  {
    name: "nodejs",
    version: "6.1.0",
    date: "2016-05-05",
    lts: false,
    security: false,
    v8: "5.0.71.35"
  },
  {
    name: "nodejs",
    version: "6.2.0",
    date: "2016-05-17",
    lts: false,
    security: false,
    v8: "5.0.71.47"
  },
  {
    name: "nodejs",
    version: "6.3.0",
    date: "2016-07-06",
    lts: false,
    security: false,
    v8: "5.0.71.52"
  },
  {
    name: "nodejs",
    version: "6.4.0",
    date: "2016-08-12",
    lts: false,
    security: false,
    v8: "5.0.71.60"
  },
  {
    name: "nodejs",
    version: "6.5.0",
    date: "2016-08-26",
    lts: false,
    security: false,
    v8: "5.1.281.81"
  },
  {
    name: "nodejs",
    version: "6.6.0",
    date: "2016-09-14",
    lts: false,
    security: false,
    v8: "5.1.281.83"
  },
  {
    name: "nodejs",
    version: "6.7.0",
    date: "2016-09-27",
    lts: false,
    security: true,
    v8: "5.1.281.83"
  },
  {
    name: "nodejs",
    version: "6.8.0",
    date: "2016-10-12",
    lts: false,
    security: false,
    v8: "5.1.281.84"
  },
  {
    name: "nodejs",
    version: "6.9.0",
    date: "2016-10-18",
    lts: "Boron",
    security: false,
    v8: "5.1.281.84"
  },
  {
    name: "nodejs",
    version: "6.10.0",
    date: "2017-02-21",
    lts: "Boron",
    security: false,
    v8: "5.1.281.93"
  },
  {
    name: "nodejs",
    version: "6.11.0",
    date: "2017-06-06",
    lts: "Boron",
    security: false,
    v8: "5.1.281.102"
  },
  {
    name: "nodejs",
    version: "6.12.0",
    date: "2017-11-06",
    lts: "Boron",
    security: false,
    v8: "5.1.281.108"
  },
  {
    name: "nodejs",
    version: "6.13.0",
    date: "2018-02-10",
    lts: "Boron",
    security: false,
    v8: "5.1.281.111"
  },
  {
    name: "nodejs",
    version: "6.14.0",
    date: "2018-03-28",
    lts: "Boron",
    security: true,
    v8: "5.1.281.111"
  },
  {
    name: "nodejs",
    version: "6.15.0",
    date: "2018-11-27",
    lts: "Boron",
    security: true,
    v8: "5.1.281.111"
  },
  {
    name: "nodejs",
    version: "6.16.0",
    date: "2018-12-26",
    lts: "Boron",
    security: false,
    v8: "5.1.281.111"
  },
  {
    name: "nodejs",
    version: "6.17.0",
    date: "2019-02-28",
    lts: "Boron",
    security: true,
    v8: "5.1.281.111"
  },
  {
    name: "nodejs",
    version: "7.0.0",
    date: "2016-10-25",
    lts: false,
    security: false,
    v8: "5.4.500.36"
  },
  {
    name: "nodejs",
    version: "7.1.0",
    date: "2016-11-08",
    lts: false,
    security: false,
    v8: "5.4.500.36"
  },
  {
    name: "nodejs",
    version: "7.2.0",
    date: "2016-11-22",
    lts: false,
    security: false,
    v8: "5.4.500.43"
  },
  {
    name: "nodejs",
    version: "7.3.0",
    date: "2016-12-20",
    lts: false,
    security: false,
    v8: "5.4.500.45"
  },
  {
    name: "nodejs",
    version: "7.4.0",
    date: "2017-01-04",
    lts: false,
    security: false,
    v8: "5.4.500.45"
  },
  {
    name: "nodejs",
    version: "7.5.0",
    date: "2017-01-31",
    lts: false,
    security: false,
    v8: "5.4.500.48"
  },
  {
    name: "nodejs",
    version: "7.6.0",
    date: "2017-02-21",
    lts: false,
    security: false,
    v8: "5.5.372.40"
  },
  {
    name: "nodejs",
    version: "7.7.0",
    date: "2017-02-28",
    lts: false,
    security: false,
    v8: "5.5.372.41"
  },
  {
    name: "nodejs",
    version: "7.8.0",
    date: "2017-03-29",
    lts: false,
    security: false,
    v8: "5.5.372.43"
  },
  {
    name: "nodejs",
    version: "7.9.0",
    date: "2017-04-11",
    lts: false,
    security: false,
    v8: "5.5.372.43"
  },
  {
    name: "nodejs",
    version: "7.10.0",
    date: "2017-05-02",
    lts: false,
    security: false,
    v8: "5.5.372.43"
  },
  {
    name: "nodejs",
    version: "8.0.0",
    date: "2017-05-30",
    lts: false,
    security: false,
    v8: "5.8.283.41"
  },
  {
    name: "nodejs",
    version: "8.1.0",
    date: "2017-06-08",
    lts: false,
    security: false,
    v8: "5.8.283.41"
  },
  {
    name: "nodejs",
    version: "8.2.0",
    date: "2017-07-19",
    lts: false,
    security: false,
    v8: "5.8.283.41"
  },
  {
    name: "nodejs",
    version: "8.3.0",
    date: "2017-08-08",
    lts: false,
    security: false,
    v8: "6.0.286.52"
  },
  {
    name: "nodejs",
    version: "8.4.0",
    date: "2017-08-15",
    lts: false,
    security: false,
    v8: "6.0.286.52"
  },
  {
    name: "nodejs",
    version: "8.5.0",
    date: "2017-09-12",
    lts: false,
    security: false,
    v8: "6.0.287.53"
  },
  {
    name: "nodejs",
    version: "8.6.0",
    date: "2017-09-26",
    lts: false,
    security: false,
    v8: "6.0.287.53"
  },
  {
    name: "nodejs",
    version: "8.7.0",
    date: "2017-10-11",
    lts: false,
    security: false,
    v8: "6.1.534.42"
  },
  {
    name: "nodejs",
    version: "8.8.0",
    date: "2017-10-24",
    lts: false,
    security: false,
    v8: "6.1.534.42"
  },
  {
    name: "nodejs",
    version: "8.9.0",
    date: "2017-10-31",
    lts: "Carbon",
    security: false,
    v8: "6.1.534.46"
  },
  {
    name: "nodejs",
    version: "8.10.0",
    date: "2018-03-06",
    lts: "Carbon",
    security: false,
    v8: "6.2.414.50"
  },
  {
    name: "nodejs",
    version: "8.11.0",
    date: "2018-03-28",
    lts: "Carbon",
    security: true,
    v8: "6.2.414.50"
  },
  {
    name: "nodejs",
    version: "8.12.0",
    date: "2018-09-10",
    lts: "Carbon",
    security: false,
    v8: "6.2.414.66"
  },
  {
    name: "nodejs",
    version: "8.13.0",
    date: "2018-11-20",
    lts: "Carbon",
    security: false,
    v8: "6.2.414.72"
  },
  {
    name: "nodejs",
    version: "8.14.0",
    date: "2018-11-27",
    lts: "Carbon",
    security: true,
    v8: "6.2.414.72"
  },
  {
    name: "nodejs",
    version: "8.15.0",
    date: "2018-12-26",
    lts: "Carbon",
    security: false,
    v8: "6.2.414.75"
  },
  {
    name: "nodejs",
    version: "8.16.0",
    date: "2019-04-16",
    lts: "Carbon",
    security: false,
    v8: "6.2.414.77"
  },
  {
    name: "nodejs",
    version: "8.17.0",
    date: "2019-12-17",
    lts: "Carbon",
    security: true,
    v8: "6.2.414.78"
  },
  {
    name: "nodejs",
    version: "9.0.0",
    date: "2017-10-31",
    lts: false,
    security: false,
    v8: "6.2.414.32"
  },
  {
    name: "nodejs",
    version: "9.1.0",
    date: "2017-11-07",
    lts: false,
    security: false,
    v8: "6.2.414.32"
  },
  {
    name: "nodejs",
    version: "9.2.0",
    date: "2017-11-14",
    lts: false,
    security: false,
    v8: "6.2.414.44"
  },
  {
    name: "nodejs",
    version: "9.3.0",
    date: "2017-12-12",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.4.0",
    date: "2018-01-10",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.5.0",
    date: "2018-01-31",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.6.0",
    date: "2018-02-21",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.7.0",
    date: "2018-03-01",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.8.0",
    date: "2018-03-07",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.9.0",
    date: "2018-03-21",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.10.0",
    date: "2018-03-28",
    lts: false,
    security: true,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "9.11.0",
    date: "2018-04-04",
    lts: false,
    security: false,
    v8: "6.2.414.46"
  },
  {
    name: "nodejs",
    version: "10.0.0",
    date: "2018-04-24",
    lts: false,
    security: false,
    v8: "6.6.346.24"
  },
  {
    name: "nodejs",
    version: "10.1.0",
    date: "2018-05-08",
    lts: false,
    security: false,
    v8: "6.6.346.27"
  },
  {
    name: "nodejs",
    version: "10.2.0",
    date: "2018-05-23",
    lts: false,
    security: false,
    v8: "6.6.346.32"
  },
  {
    name: "nodejs",
    version: "10.3.0",
    date: "2018-05-29",
    lts: false,
    security: false,
    v8: "6.6.346.32"
  },
  {
    name: "nodejs",
    version: "10.4.0",
    date: "2018-06-06",
    lts: false,
    security: false,
    v8: "6.7.288.43"
  },
  {
    name: "nodejs",
    version: "10.5.0",
    date: "2018-06-20",
    lts: false,
    security: false,
    v8: "6.7.288.46"
  },
  {
    name: "nodejs",
    version: "10.6.0",
    date: "2018-07-04",
    lts: false,
    security: false,
    v8: "6.7.288.46"
  },
  {
    name: "nodejs",
    version: "10.7.0",
    date: "2018-07-18",
    lts: false,
    security: false,
    v8: "6.7.288.49"
  },
  {
    name: "nodejs",
    version: "10.8.0",
    date: "2018-08-01",
    lts: false,
    security: false,
    v8: "6.7.288.49"
  },
  {
    name: "nodejs",
    version: "10.9.0",
    date: "2018-08-15",
    lts: false,
    security: false,
    v8: "6.8.275.24"
  },
  {
    name: "nodejs",
    version: "10.10.0",
    date: "2018-09-06",
    lts: false,
    security: false,
    v8: "6.8.275.30"
  },
  {
    name: "nodejs",
    version: "10.11.0",
    date: "2018-09-19",
    lts: false,
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.12.0",
    date: "2018-10-10",
    lts: false,
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.13.0",
    date: "2018-10-30",
    lts: "Dubnium",
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.14.0",
    date: "2018-11-27",
    lts: "Dubnium",
    security: true,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.15.0",
    date: "2018-12-26",
    lts: "Dubnium",
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.16.0",
    date: "2019-05-28",
    lts: "Dubnium",
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.17.0",
    date: "2019-10-22",
    lts: "Dubnium",
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.18.0",
    date: "2019-12-17",
    lts: "Dubnium",
    security: true,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.19.0",
    date: "2020-02-05",
    lts: "Dubnium",
    security: true,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.20.0",
    date: "2020-03-26",
    lts: "Dubnium",
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.21.0",
    date: "2020-06-02",
    lts: "Dubnium",
    security: true,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.22.0",
    date: "2020-07-21",
    lts: "Dubnium",
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.23.0",
    date: "2020-10-27",
    lts: "Dubnium",
    security: false,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "10.24.0",
    date: "2021-02-23",
    lts: "Dubnium",
    security: true,
    v8: "6.8.275.32"
  },
  {
    name: "nodejs",
    version: "11.0.0",
    date: "2018-10-23",
    lts: false,
    security: false,
    v8: "7.0.276.28"
  },
  {
    name: "nodejs",
    version: "11.1.0",
    date: "2018-10-30",
    lts: false,
    security: false,
    v8: "7.0.276.32"
  },
  {
    name: "nodejs",
    version: "11.2.0",
    date: "2018-11-15",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.3.0",
    date: "2018-11-27",
    lts: false,
    security: true,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.4.0",
    date: "2018-12-07",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.5.0",
    date: "2018-12-18",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.6.0",
    date: "2018-12-26",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.7.0",
    date: "2019-01-17",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.8.0",
    date: "2019-01-24",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.9.0",
    date: "2019-01-30",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.10.0",
    date: "2019-02-14",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.11.0",
    date: "2019-03-05",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.12.0",
    date: "2019-03-14",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.13.0",
    date: "2019-03-28",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.14.0",
    date: "2019-04-10",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "11.15.0",
    date: "2019-04-30",
    lts: false,
    security: false,
    v8: "7.0.276.38"
  },
  {
    name: "nodejs",
    version: "12.0.0",
    date: "2019-04-23",
    lts: false,
    security: false,
    v8: "7.4.288.21"
  },
  {
    name: "nodejs",
    version: "12.1.0",
    date: "2019-04-29",
    lts: false,
    security: false,
    v8: "7.4.288.21"
  },
  {
    name: "nodejs",
    version: "12.2.0",
    date: "2019-05-07",
    lts: false,
    security: false,
    v8: "7.4.288.21"
  },
  {
    name: "nodejs",
    version: "12.3.0",
    date: "2019-05-21",
    lts: false,
    security: false,
    v8: "7.4.288.27"
  },
  {
    name: "nodejs",
    version: "12.4.0",
    date: "2019-06-04",
    lts: false,
    security: false,
    v8: "7.4.288.27"
  },
  {
    name: "nodejs",
    version: "12.5.0",
    date: "2019-06-26",
    lts: false,
    security: false,
    v8: "7.5.288.22"
  },
  {
    name: "nodejs",
    version: "12.6.0",
    date: "2019-07-03",
    lts: false,
    security: false,
    v8: "7.5.288.22"
  },
  {
    name: "nodejs",
    version: "12.7.0",
    date: "2019-07-23",
    lts: false,
    security: false,
    v8: "7.5.288.22"
  },
  {
    name: "nodejs",
    version: "12.8.0",
    date: "2019-08-06",
    lts: false,
    security: false,
    v8: "7.5.288.22"
  },
  {
    name: "nodejs",
    version: "12.9.0",
    date: "2019-08-20",
    lts: false,
    security: false,
    v8: "7.6.303.29"
  },
  {
    name: "nodejs",
    version: "12.10.0",
    date: "2019-09-04",
    lts: false,
    security: false,
    v8: "7.6.303.29"
  },
  {
    name: "nodejs",
    version: "12.11.0",
    date: "2019-09-25",
    lts: false,
    security: false,
    v8: "7.7.299.11"
  },
  {
    name: "nodejs",
    version: "12.12.0",
    date: "2019-10-11",
    lts: false,
    security: false,
    v8: "7.7.299.13"
  },
  {
    name: "nodejs",
    version: "12.13.0",
    date: "2019-10-21",
    lts: "Erbium",
    security: false,
    v8: "7.7.299.13"
  },
  {
    name: "nodejs",
    version: "12.14.0",
    date: "2019-12-17",
    lts: "Erbium",
    security: true,
    v8: "7.7.299.13"
  },
  {
    name: "nodejs",
    version: "12.15.0",
    date: "2020-02-05",
    lts: "Erbium",
    security: true,
    v8: "7.7.299.13"
  },
  {
    name: "nodejs",
    version: "12.16.0",
    date: "2020-02-11",
    lts: "Erbium",
    security: false,
    v8: "7.8.279.23"
  },
  {
    name: "nodejs",
    version: "12.17.0",
    date: "2020-05-26",
    lts: "Erbium",
    security: false,
    v8: "7.8.279.23"
  },
  {
    name: "nodejs",
    version: "12.18.0",
    date: "2020-06-02",
    lts: "Erbium",
    security: true,
    v8: "7.8.279.23"
  },
  {
    name: "nodejs",
    version: "12.19.0",
    date: "2020-10-06",
    lts: "Erbium",
    security: false,
    v8: "7.8.279.23"
  },
  {
    name: "nodejs",
    version: "12.20.0",
    date: "2020-11-24",
    lts: "Erbium",
    security: false,
    v8: "7.8.279.23"
  },
  {
    name: "nodejs",
    version: "12.21.0",
    date: "2021-02-23",
    lts: "Erbium",
    security: true,
    v8: "7.8.279.23"
  },
  {
    name: "nodejs",
    version: "12.22.0",
    date: "2021-03-30",
    lts: "Erbium",
    security: false,
    v8: "7.8.279.23"
  },
  {
    name: "nodejs",
    version: "13.0.0",
    date: "2019-10-22",
    lts: false,
    security: false,
    v8: "7.8.279.17"
  },
  {
    name: "nodejs",
    version: "13.1.0",
    date: "2019-11-05",
    lts: false,
    security: false,
    v8: "7.8.279.17"
  },
  {
    name: "nodejs",
    version: "13.2.0",
    date: "2019-11-21",
    lts: false,
    security: false,
    v8: "7.9.317.23"
  },
  {
    name: "nodejs",
    version: "13.3.0",
    date: "2019-12-03",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.4.0",
    date: "2019-12-17",
    lts: false,
    security: true,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.5.0",
    date: "2019-12-18",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.6.0",
    date: "2020-01-07",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.7.0",
    date: "2020-01-21",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.8.0",
    date: "2020-02-05",
    lts: false,
    security: true,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.9.0",
    date: "2020-02-18",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.10.0",
    date: "2020-03-04",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.11.0",
    date: "2020-03-12",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.12.0",
    date: "2020-03-26",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.13.0",
    date: "2020-04-14",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "13.14.0",
    date: "2020-04-29",
    lts: false,
    security: false,
    v8: "7.9.317.25"
  },
  {
    name: "nodejs",
    version: "14.0.0",
    date: "2020-04-21",
    lts: false,
    security: false,
    v8: "8.1.307.30"
  },
  {
    name: "nodejs",
    version: "14.1.0",
    date: "2020-04-29",
    lts: false,
    security: false,
    v8: "8.1.307.31"
  },
  {
    name: "nodejs",
    version: "14.2.0",
    date: "2020-05-05",
    lts: false,
    security: false,
    v8: "8.1.307.31"
  },
  {
    name: "nodejs",
    version: "14.3.0",
    date: "2020-05-19",
    lts: false,
    security: false,
    v8: "8.1.307.31"
  },
  {
    name: "nodejs",
    version: "14.4.0",
    date: "2020-06-02",
    lts: false,
    security: true,
    v8: "8.1.307.31"
  },
  {
    name: "nodejs",
    version: "14.5.0",
    date: "2020-06-30",
    lts: false,
    security: false,
    v8: "8.3.110.9"
  },
  {
    name: "nodejs",
    version: "14.6.0",
    date: "2020-07-20",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.7.0",
    date: "2020-07-29",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.8.0",
    date: "2020-08-11",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.9.0",
    date: "2020-08-27",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.10.0",
    date: "2020-09-08",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.11.0",
    date: "2020-09-15",
    lts: false,
    security: true,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.12.0",
    date: "2020-09-22",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.13.0",
    date: "2020-09-29",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.14.0",
    date: "2020-10-15",
    lts: false,
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.15.0",
    date: "2020-10-27",
    lts: "Fermium",
    security: false,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.16.0",
    date: "2021-02-23",
    lts: "Fermium",
    security: true,
    v8: "8.4.371.19"
  },
  {
    name: "nodejs",
    version: "14.17.0",
    date: "2021-05-11",
    lts: "Fermium",
    security: false,
    v8: "8.4.371.23"
  },
  {
    name: "nodejs",
    version: "14.18.0",
    date: "2021-09-28",
    lts: "Fermium",
    security: false,
    v8: "8.4.371.23"
  },
  {
    name: "nodejs",
    version: "14.19.0",
    date: "2022-02-01",
    lts: "Fermium",
    security: false,
    v8: "8.4.371.23"
  },
  {
    name: "nodejs",
    version: "14.20.0",
    date: "2022-07-07",
    lts: "Fermium",
    security: true,
    v8: "8.4.371.23"
  },
  {
    name: "nodejs",
    version: "14.21.0",
    date: "2022-11-01",
    lts: "Fermium",
    security: false,
    v8: "8.4.371.23"
  },
  {
    name: "nodejs",
    version: "15.0.0",
    date: "2020-10-20",
    lts: false,
    security: false,
    v8: "8.6.395.16"
  },
  {
    name: "nodejs",
    version: "15.1.0",
    date: "2020-11-04",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.2.0",
    date: "2020-11-10",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.3.0",
    date: "2020-11-24",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.4.0",
    date: "2020-12-09",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.5.0",
    date: "2020-12-22",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.6.0",
    date: "2021-01-14",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.7.0",
    date: "2021-01-25",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.8.0",
    date: "2021-02-02",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.9.0",
    date: "2021-02-18",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.10.0",
    date: "2021-02-23",
    lts: false,
    security: true,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.11.0",
    date: "2021-03-03",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.12.0",
    date: "2021-03-17",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.13.0",
    date: "2021-03-31",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "15.14.0",
    date: "2021-04-06",
    lts: false,
    security: false,
    v8: "8.6.395.17"
  },
  {
    name: "nodejs",
    version: "16.0.0",
    date: "2021-04-20",
    lts: false,
    security: false,
    v8: "9.0.257.17"
  },
  {
    name: "nodejs",
    version: "16.1.0",
    date: "2021-05-04",
    lts: false,
    security: false,
    v8: "9.0.257.24"
  },
  {
    name: "nodejs",
    version: "16.2.0",
    date: "2021-05-19",
    lts: false,
    security: false,
    v8: "9.0.257.25"
  },
  {
    name: "nodejs",
    version: "16.3.0",
    date: "2021-06-03",
    lts: false,
    security: false,
    v8: "9.0.257.25"
  },
  {
    name: "nodejs",
    version: "16.4.0",
    date: "2021-06-23",
    lts: false,
    security: false,
    v8: "9.1.269.36"
  },
  {
    name: "nodejs",
    version: "16.5.0",
    date: "2021-07-14",
    lts: false,
    security: false,
    v8: "9.1.269.38"
  },
  {
    name: "nodejs",
    version: "16.6.0",
    date: "2021-07-29",
    lts: false,
    security: true,
    v8: "9.2.230.21"
  },
  {
    name: "nodejs",
    version: "16.7.0",
    date: "2021-08-18",
    lts: false,
    security: false,
    v8: "9.2.230.21"
  },
  {
    name: "nodejs",
    version: "16.8.0",
    date: "2021-08-25",
    lts: false,
    security: false,
    v8: "9.2.230.21"
  },
  {
    name: "nodejs",
    version: "16.9.0",
    date: "2021-09-07",
    lts: false,
    security: false,
    v8: "9.3.345.16"
  },
  {
    name: "nodejs",
    version: "16.10.0",
    date: "2021-09-22",
    lts: false,
    security: false,
    v8: "9.3.345.19"
  },
  {
    name: "nodejs",
    version: "16.11.0",
    date: "2021-10-08",
    lts: false,
    security: false,
    v8: "9.4.146.19"
  },
  {
    name: "nodejs",
    version: "16.12.0",
    date: "2021-10-20",
    lts: false,
    security: false,
    v8: "9.4.146.19"
  },
  {
    name: "nodejs",
    version: "16.13.0",
    date: "2021-10-26",
    lts: "Gallium",
    security: false,
    v8: "9.4.146.19"
  },
  {
    name: "nodejs",
    version: "16.14.0",
    date: "2022-02-08",
    lts: "Gallium",
    security: false,
    v8: "9.4.146.24"
  },
  {
    name: "nodejs",
    version: "16.15.0",
    date: "2022-04-26",
    lts: "Gallium",
    security: false,
    v8: "9.4.146.24"
  },
  {
    name: "nodejs",
    version: "16.16.0",
    date: "2022-07-07",
    lts: "Gallium",
    security: true,
    v8: "9.4.146.24"
  },
  {
    name: "nodejs",
    version: "16.17.0",
    date: "2022-08-16",
    lts: "Gallium",
    security: false,
    v8: "9.4.146.26"
  },
  {
    name: "nodejs",
    version: "16.18.0",
    date: "2022-10-12",
    lts: "Gallium",
    security: false,
    v8: "9.4.146.26"
  },
  {
    name: "nodejs",
    version: "16.19.0",
    date: "2022-12-13",
    lts: "Gallium",
    security: false,
    v8: "9.4.146.26"
  },
  {
    name: "nodejs",
    version: "16.20.0",
    date: "2023-03-28",
    lts: "Gallium",
    security: false,
    v8: "9.4.146.26"
  },
  {
    name: "nodejs",
    version: "17.0.0",
    date: "2021-10-19",
    lts: false,
    security: false,
    v8: "9.5.172.21"
  },
  {
    name: "nodejs",
    version: "17.1.0",
    date: "2021-11-09",
    lts: false,
    security: false,
    v8: "9.5.172.25"
  },
  {
    name: "nodejs",
    version: "17.2.0",
    date: "2021-11-30",
    lts: false,
    security: false,
    v8: "9.6.180.14"
  },
  {
    name: "nodejs",
    version: "17.3.0",
    date: "2021-12-17",
    lts: false,
    security: false,
    v8: "9.6.180.15"
  },
  {
    name: "nodejs",
    version: "17.4.0",
    date: "2022-01-18",
    lts: false,
    security: false,
    v8: "9.6.180.15"
  },
  {
    name: "nodejs",
    version: "17.5.0",
    date: "2022-02-10",
    lts: false,
    security: false,
    v8: "9.6.180.15"
  },
  {
    name: "nodejs",
    version: "17.6.0",
    date: "2022-02-22",
    lts: false,
    security: false,
    v8: "9.6.180.15"
  },
  {
    name: "nodejs",
    version: "17.7.0",
    date: "2022-03-09",
    lts: false,
    security: false,
    v8: "9.6.180.15"
  },
  {
    name: "nodejs",
    version: "17.8.0",
    date: "2022-03-22",
    lts: false,
    security: false,
    v8: "9.6.180.15"
  },
  {
    name: "nodejs",
    version: "17.9.0",
    date: "2022-04-07",
    lts: false,
    security: false,
    v8: "9.6.180.15"
  },
  {
    name: "nodejs",
    version: "18.0.0",
    date: "2022-04-18",
    lts: false,
    security: false,
    v8: "10.1.124.8"
  },
  {
    name: "nodejs",
    version: "18.1.0",
    date: "2022-05-03",
    lts: false,
    security: false,
    v8: "10.1.124.8"
  },
  {
    name: "nodejs",
    version: "18.2.0",
    date: "2022-05-17",
    lts: false,
    security: false,
    v8: "10.1.124.8"
  },
  {
    name: "nodejs",
    version: "18.3.0",
    date: "2022-06-02",
    lts: false,
    security: false,
    v8: "10.2.154.4"
  },
  {
    name: "nodejs",
    version: "18.4.0",
    date: "2022-06-16",
    lts: false,
    security: false,
    v8: "10.2.154.4"
  },
  {
    name: "nodejs",
    version: "18.5.0",
    date: "2022-07-06",
    lts: false,
    security: true,
    v8: "10.2.154.4"
  },
  {
    name: "nodejs",
    version: "18.6.0",
    date: "2022-07-13",
    lts: false,
    security: false,
    v8: "10.2.154.13"
  },
  {
    name: "nodejs",
    version: "18.7.0",
    date: "2022-07-26",
    lts: false,
    security: false,
    v8: "10.2.154.13"
  },
  {
    name: "nodejs",
    version: "18.8.0",
    date: "2022-08-24",
    lts: false,
    security: false,
    v8: "10.2.154.13"
  },
  {
    name: "nodejs",
    version: "18.9.0",
    date: "2022-09-07",
    lts: false,
    security: false,
    v8: "10.2.154.15"
  },
  {
    name: "nodejs",
    version: "18.10.0",
    date: "2022-09-28",
    lts: false,
    security: false,
    v8: "10.2.154.15"
  },
  {
    name: "nodejs",
    version: "18.11.0",
    date: "2022-10-13",
    lts: false,
    security: false,
    v8: "10.2.154.15"
  },
  {
    name: "nodejs",
    version: "18.12.0",
    date: "2022-10-25",
    lts: "Hydrogen",
    security: false,
    v8: "10.2.154.15"
  },
  {
    name: "nodejs",
    version: "18.13.0",
    date: "2023-01-05",
    lts: "Hydrogen",
    security: false,
    v8: "10.2.154.23"
  },
  {
    name: "nodejs",
    version: "18.14.0",
    date: "2023-02-01",
    lts: "Hydrogen",
    security: false,
    v8: "10.2.154.23"
  },
  {
    name: "nodejs",
    version: "18.15.0",
    date: "2023-03-05",
    lts: "Hydrogen",
    security: false,
    v8: "10.2.154.26"
  },
  {
    name: "nodejs",
    version: "18.16.0",
    date: "2023-04-12",
    lts: "Hydrogen",
    security: false,
    v8: "10.2.154.26"
  },
  {
    name: "nodejs",
    version: "19.0.0",
    date: "2022-10-17",
    lts: false,
    security: false,
    v8: "10.7.193.13"
  },
  {
    name: "nodejs",
    version: "19.1.0",
    date: "2022-11-14",
    lts: false,
    security: false,
    v8: "10.7.193.20"
  },
  {
    name: "nodejs",
    version: "19.2.0",
    date: "2022-11-29",
    lts: false,
    security: false,
    v8: "10.8.168.20"
  },
  {
    name: "nodejs",
    version: "19.3.0",
    date: "2022-12-14",
    lts: false,
    security: false,
    v8: "10.8.168.21"
  },
  {
    name: "nodejs",
    version: "19.4.0",
    date: "2023-01-05",
    lts: false,
    security: false,
    v8: "10.8.168.25"
  },
  {
    name: "nodejs",
    version: "19.5.0",
    date: "2023-01-24",
    lts: false,
    security: false,
    v8: "10.8.168.25"
  },
  {
    name: "nodejs",
    version: "19.6.0",
    date: "2023-02-01",
    lts: false,
    security: false,
    v8: "10.8.168.25"
  },
  {
    name: "nodejs",
    version: "19.7.0",
    date: "2023-02-21",
    lts: false,
    security: false,
    v8: "10.8.168.25"
  },
  {
    name: "nodejs",
    version: "19.8.0",
    date: "2023-03-14",
    lts: false,
    security: false,
    v8: "10.8.168.25"
  },
  {
    name: "nodejs",
    version: "19.9.0",
    date: "2023-04-10",
    lts: false,
    security: false,
    v8: "10.8.168.25"
  },
  {
    name: "nodejs",
    version: "20.0.0",
    date: "2023-04-17",
    lts: false,
    security: false,
    v8: "11.3.244.4"
  },
  {
    name: "nodejs",
    version: "20.1.0",
    date: "2023-05-03",
    lts: false,
    security: false,
    v8: "11.3.244.8"
  },
  {
    name: "nodejs",
    version: "20.2.0",
    date: "2023-05-16",
    lts: false,
    security: false,
    v8: "11.3.244.8"
  }
];
var agents$2 = {};
var browsers$2 = {};
var browsers$1 = { A: "ie", B: "edge", C: "firefox", D: "chrome", E: "safari", F: "opera", G: "ios_saf", H: "op_mini", I: "android", J: "bb", K: "op_mob", L: "and_chr", M: "and_ff", N: "ie_mob", O: "and_uc", P: "samsung", Q: "and_qq", R: "baidu", S: "kaios" };
browsers$2.browsers = browsers$1;
var browserVersions$1 = {};
var browserVersions = { "0": "5", "1": "19", "2": "22", "3": "23", "4": "24", "5": "25", "6": "26", "7": "27", "8": "28", "9": "29", A: "10", B: "11", C: "12", D: "17", E: "7", F: "8", G: "9", H: "15", I: "114", J: "4", K: "6", L: "13", M: "14", N: "16", O: "18", P: "79", Q: "80", R: "81", S: "83", T: "84", U: "85", V: "86", W: "87", X: "88", Y: "89", Z: "90", a: "91", b: "92", c: "93", d: "94", e: "95", f: "96", g: "97", h: "98", i: "99", j: "113", k: "20", l: "21", m: "73", n: "100", o: "101", p: "102", q: "103", r: "104", s: "105", t: "106", u: "107", v: "108", w: "109", x: "110", y: "111", z: "112", AB: "30", BB: "31", CB: "32", DB: "33", EB: "34", FB: "35", GB: "36", HB: "37", IB: "38", JB: "39", KB: "40", LB: "41", MB: "42", NB: "43", OB: "44", PB: "45", QB: "46", RB: "47", SB: "48", TB: "49", UB: "50", VB: "51", WB: "52", XB: "53", YB: "54", ZB: "55", aB: "56", bB: "57", cB: "58", dB: "60", eB: "62", fB: "63", gB: "64", hB: "65", iB: "66", jB: "67", kB: "68", lB: "69", mB: "70", nB: "71", oB: "72", pB: "74", qB: "75", rB: "76", sB: "77", tB: "78", uB: "11.1", vB: "12.1", wB: "16.0", xB: "3", yB: "59", zB: "61", "0B": "82", "1B": "115", "2B": "3.2", "3B": "10.1", "4B": "13.1", "5B": "15.2-15.3", "6B": "15.4", "7B": "15.5", "8B": "15.6", "9B": "16.1", AC: "16.2", BC: "16.3", CC: "16.4", DC: "16.5", EC: "16.6", FC: "11.5", GC: "4.2-4.3", HC: "5.5", IC: "2", JC: "3.5", KC: "3.6", LC: "116", MC: "117", NC: "3.1", OC: "5.1", PC: "6.1", QC: "7.1", RC: "9.1", SC: "14.1", TC: "15.1", UC: "TP", VC: "9.5-9.6", WC: "10.0-10.1", XC: "10.5", YC: "10.6", ZC: "11.6", aC: "4.0-4.1", bC: "5.0-5.1", cC: "6.0-6.1", dC: "7.0-7.1", eC: "8.1-8.4", fC: "9.0-9.2", gC: "9.3", hC: "10.0-10.2", iC: "10.3", jC: "11.0-11.2", kC: "11.3-11.4", lC: "12.0-12.1", mC: "12.2-12.5", nC: "13.0-13.1", oC: "13.2", pC: "13.3", qC: "13.4-13.7", rC: "14.0-14.4", sC: "14.5-14.8", tC: "15.0-15.1", uC: "all", vC: "2.1", wC: "2.2", xC: "2.3", yC: "4.1", zC: "4.4", "0C": "4.4.3-4.4.4", "1C": "13.4", "2C": "5.0-5.4", "3C": "6.2-6.4", "4C": "7.2-7.4", "5C": "8.2", "6C": "9.2", "7C": "11.1-11.2", "8C": "12.0", "9C": "13.0", AD: "14.0", BD: "15.0", CD: "17.0", DD: "18.0", ED: "19.0", FD: "13.18", GD: "2.5", HD: "3.0-3.1" };
browserVersions$1.browserVersions = browserVersions;
var agents$1 = { A: { A: { K: 0, E: 0, F: 0.0309495, G: 0.041266, A: 0, B: 0.371394, HC: 0 }, B: "ms", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "HC", "K", "E", "F", "G", "A", "B", "", "", ""], E: "IE", F: { HC: 962323200, K: 998870400, E: 1161129600, F: 1237420800, G: 1300060800, A: 1346716800, B: 1381968e3 } }, B: { A: { C: 0, L: 0, M: 0, H: 0, N: 0, D: 477e-5, O: 954e-5, P: 0, Q: 0, R: 0, S: 0, T: 0, U: 0, V: 0, W: 0, X: 0, Y: 477e-5, Z: 0, a: 0, b: 0.01431, c: 0, d: 0, e: 0, f: 0, g: 0, h: 0, i: 0, n: 0, o: 477e-5, p: 477e-5, q: 477e-5, r: 0, s: 0, t: 477e-5, u: 0.01431, v: 0.02385, w: 0.08586, x: 0.03339, y: 0.0477, z: 1.89369, j: 3.01464, I: 0 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "C", "L", "M", "H", "N", "D", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "j", "I", "", "", ""], E: "Edge", F: { C: 1438128e3, L: 1447286400, M: 1470096e3, H: 1491868800, N: 1508198400, D: 1525046400, O: 1542067200, P: 1579046400, Q: 1581033600, R: 1586736e3, S: 1590019200, T: 1594857600, U: 1598486400, V: 1602201600, W: 1605830400, X: 161136e4, Y: 1614816e3, Z: 1618358400, a: 1622073600, b: 1626912e3, c: 1630627200, d: 1632441600, e: 1634774400, f: 1637539200, g: 1641427200, h: 1643932800, i: 1646265600, n: 1649635200, o: 1651190400, p: 1653955200, q: 1655942400, r: 1659657600, s: 1661990400, t: 1664755200, u: 1666915200, v: 1670198400, w: 1673481600, x: 1675900800, y: 1678665600, z: 1680825600, j: 1683158400, I: 1685664e3 }, D: { C: "ms", L: "ms", M: "ms", H: "ms", N: "ms", D: "ms", O: "ms" } }, C: { A: { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, IC: 0, xB: 0, J: 0, K: 0, E: 0, F: 0, G: 0, A: 0, B: 477e-5, C: 0, L: 0, M: 0, H: 0, N: 0, D: 0, O: 0, k: 0, l: 0, AB: 0, BB: 0, CB: 0, DB: 0, EB: 0, FB: 0, GB: 477e-5, HB: 0, IB: 0, JB: 0, KB: 0, LB: 0, MB: 0, NB: 0.01908, OB: 477e-5, PB: 0, QB: 0, RB: 0, SB: 0, TB: 0, UB: 0, VB: 0, WB: 0.0477, XB: 0, YB: 0, ZB: 0, aB: 477e-5, bB: 0, cB: 0, yB: 0, dB: 0, zB: 0, eB: 0, fB: 0, gB: 0, hB: 0, iB: 0, jB: 0, kB: 0, lB: 0, mB: 0, nB: 0, oB: 954e-5, m: 0, pB: 0, qB: 0, rB: 0, sB: 0, tB: 0.03339, P: 0, Q: 0, R: 0, "0B": 0, S: 0, T: 954e-5, U: 0, V: 0, W: 0.01431, X: 954e-5, Y: 0, Z: 0, a: 954e-5, b: 0, c: 0, d: 954e-5, e: 0, f: 0, g: 0, h: 0, i: 0, n: 0, o: 0, p: 0.10971, q: 0.02385, r: 477e-5, s: 477e-5, t: 477e-5, u: 954e-5, v: 954e-5, w: 0.01431, x: 0.02385, y: 0.05247, z: 0.8109, j: 1.09233, I: 0.01431, "1B": 0, JC: 0, KC: 0 }, B: "moz", C: ["IC", "xB", "JC", "KC", "J", "0", "K", "E", "F", "G", "A", "B", "C", "L", "M", "H", "N", "D", "O", "1", "k", "l", "2", "3", "4", "5", "6", "7", "8", "9", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "JB", "KB", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB", "aB", "bB", "cB", "yB", "dB", "zB", "eB", "fB", "gB", "hB", "iB", "jB", "kB", "lB", "mB", "nB", "oB", "m", "pB", "qB", "rB", "sB", "tB", "P", "Q", "R", "0B", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "j", "I", "1B", ""], E: "Firefox", F: { "0": 1308614400, "1": 1357603200, "2": 1368489600, "3": 1372118400, "4": 1375747200, "5": 1379376e3, "6": 1386633600, "7": 1391472e3, "8": 1395100800, "9": 1398729600, IC: 1161648e3, xB: 1213660800, JC: 124632e4, KC: 1264032e3, J: 1300752e3, K: 1313452800, E: 1317081600, F: 1317081600, G: 1320710400, A: 1324339200, B: 1327968e3, C: 1331596800, L: 1335225600, M: 1338854400, H: 1342483200, N: 1346112e3, D: 1349740800, O: 1353628800, k: 1361232e3, l: 1364860800, AB: 1402358400, BB: 1405987200, CB: 1409616e3, DB: 1413244800, EB: 1417392e3, FB: 1421107200, GB: 1424736e3, HB: 1428278400, IB: 1431475200, JB: 1435881600, KB: 1439251200, LB: 144288e4, MB: 1446508800, NB: 1450137600, OB: 1453852800, PB: 1457395200, QB: 1461628800, RB: 1465257600, SB: 1470096e3, TB: 1474329600, UB: 1479168e3, VB: 1485216e3, WB: 1488844800, XB: 149256e4, YB: 1497312e3, ZB: 1502150400, aB: 1506556800, bB: 1510617600, cB: 1516665600, yB: 1520985600, dB: 1525824e3, zB: 1529971200, eB: 1536105600, fB: 1540252800, gB: 1544486400, hB: 154872e4, iB: 1552953600, jB: 1558396800, kB: 1562630400, lB: 1567468800, mB: 1571788800, nB: 1575331200, oB: 1578355200, m: 1581379200, pB: 1583798400, qB: 1586304e3, rB: 1588636800, sB: 1591056e3, tB: 1593475200, P: 1595894400, Q: 1598313600, R: 1600732800, "0B": 1603152e3, S: 1605571200, T: 1607990400, U: 1611619200, V: 1614038400, W: 1616457600, X: 1618790400, Y: 1622505600, Z: 1626134400, a: 1628553600, b: 1630972800, c: 1633392e3, d: 1635811200, e: 1638835200, f: 1641859200, g: 1644364800, h: 1646697600, i: 1649116800, n: 1651536e3, o: 1653955200, p: 1656374400, q: 1658793600, r: 1661212800, s: 1663632e3, t: 1666051200, u: 1668470400, v: 1670889600, w: 1673913600, x: 1676332800, y: 1678752e3, z: 1681171200, j: 1683590400, I: null, "1B": null } }, D: { A: { "0": 0, "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 0, "9": 0, J: 0, K: 0, E: 0, F: 0, G: 0, A: 0, B: 0, C: 0, L: 0, M: 0, H: 0, N: 0, D: 0, O: 0, k: 0, l: 0, AB: 0, BB: 0, CB: 0, DB: 0, EB: 954e-5, FB: 477e-5, GB: 0, HB: 0, IB: 0.01431, JB: 0, KB: 954e-5, LB: 0, MB: 0, NB: 954e-5, OB: 477e-5, PB: 954e-5, QB: 0, RB: 954e-5, SB: 0.01908, TB: 0.03339, UB: 954e-5, VB: 0, WB: 477e-5, XB: 954e-5, YB: 0, ZB: 477e-5, aB: 0.06678, bB: 0, cB: 477e-5, yB: 0, dB: 954e-5, zB: 0.01431, eB: 0, fB: 477e-5, gB: 0, hB: 954e-5, iB: 0.02862, jB: 954e-5, kB: 954e-5, lB: 0.03816, mB: 0.01908, nB: 954e-5, oB: 0.01908, m: 0.01431, pB: 0.03339, qB: 0.07155, rB: 0.05724, sB: 0.01908, tB: 0.02385, P: 0.2385, Q: 0.04293, R: 0.04293, S: 0.15264, T: 0.01908, U: 0.06678, V: 0.05247, W: 0.10494, X: 0.02862, Y: 0.03339, Z: 0.0477, a: 0.08109, b: 0.0477, c: 0.13356, d: 0.03816, e: 0.01908, f: 0.03339, g: 0.02862, h: 0.05247, i: 0.05724, n: 0.04293, o: 0.04293, p: 0.05724, q: 0.25758, r: 0.05724, s: 0.08109, t: 0.05724, u: 0.07632, v: 0.21465, w: 2.11788, x: 0.20988, y: 0.80613, z: 6.99759, j: 12.3829, I: 0.07155, "1B": 0.01908, LC: 0, MC: 0 }, B: "webkit", C: ["", "", "", "", "J", "0", "K", "E", "F", "G", "A", "B", "C", "L", "M", "H", "N", "D", "O", "1", "k", "l", "2", "3", "4", "5", "6", "7", "8", "9", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "JB", "KB", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB", "aB", "bB", "cB", "yB", "dB", "zB", "eB", "fB", "gB", "hB", "iB", "jB", "kB", "lB", "mB", "nB", "oB", "m", "pB", "qB", "rB", "sB", "tB", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "j", "I", "1B", "LC", "MC"], E: "Chrome", F: { "0": 1274745600, "1": 1332892800, "2": 1343692800, "3": 1348531200, "4": 1352246400, "5": 1357862400, "6": 1361404800, "7": 1364428800, "8": 1369094400, "9": 1374105600, J: 1264377600, K: 1283385600, E: 1287619200, F: 1291248e3, G: 1296777600, A: 1299542400, B: 1303862400, C: 1307404800, L: 1312243200, M: 1316131200, H: 1316131200, N: 1319500800, D: 1323734400, O: 1328659200, k: 133704e4, l: 1340668800, AB: 1376956800, BB: 1384214400, CB: 1389657600, DB: 1392940800, EB: 1397001600, FB: 1400544e3, GB: 1405468800, HB: 1409011200, IB: 141264e4, JB: 1416268800, KB: 1421798400, LB: 1425513600, MB: 1429401600, NB: 143208e4, OB: 1437523200, PB: 1441152e3, QB: 1444780800, RB: 1449014400, SB: 1453248e3, TB: 1456963200, UB: 1460592e3, VB: 1464134400, WB: 1469059200, XB: 1472601600, YB: 1476230400, ZB: 1480550400, aB: 1485302400, bB: 1489017600, cB: 149256e4, yB: 1496707200, dB: 1500940800, zB: 1504569600, eB: 1508198400, fB: 1512518400, gB: 1516752e3, hB: 1520294400, iB: 1523923200, jB: 1527552e3, kB: 1532390400, lB: 1536019200, mB: 1539648e3, nB: 1543968e3, oB: 154872e4, m: 1552348800, pB: 1555977600, qB: 1559606400, rB: 1564444800, sB: 1568073600, tB: 1571702400, P: 1575936e3, Q: 1580860800, R: 1586304e3, S: 1589846400, T: 1594684800, U: 1598313600, V: 1601942400, W: 1605571200, X: 1611014400, Y: 1614556800, Z: 1618272e3, a: 1621987200, b: 1626739200, c: 1630368e3, d: 1632268800, e: 1634601600, f: 1637020800, g: 1641340800, h: 1643673600, i: 1646092800, n: 1648512e3, o: 1650931200, p: 1653350400, q: 1655769600, r: 1659398400, s: 1661817600, t: 1664236800, u: 1666656e3, v: 166968e4, w: 1673308800, x: 1675728e3, y: 1678147200, z: 1680566400, j: 1682985600, I: 1685404800, "1B": null, LC: null, MC: null } }, E: { A: { "0": 0, J: 0, K: 0, E: 0, F: 0, G: 0, A: 0, B: 0, C: 0, L: 0.02385, M: 0.12879, H: 0.03339, D: 0, NC: 0, "2B": 0, OC: 954e-5, PC: 0, QC: 0, RC: 0.0477, "3B": 0, uB: 477e-5, vB: 0.0477, "4B": 0.18126, SC: 0.37206, TC: 0.05724, "5B": 0.0477, "6B": 0.11925, "7B": 0.20988, "8B": 0.86337, wB: 0.09063, "9B": 0.29574, AC: 0.35775, BC: 0.98262, CC: 1.86984, DC: 0.14787, EC: 0, UC: 0 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "NC", "2B", "J", "0", "OC", "K", "PC", "E", "QC", "F", "G", "RC", "A", "3B", "B", "uB", "C", "vB", "L", "4B", "M", "SC", "H", "TC", "5B", "6B", "7B", "8B", "wB", "9B", "AC", "BC", "CC", "DC", "EC", "D", "UC"], E: "Safari", F: { "0": 1275868800, NC: 1205798400, "2B": 1226534400, J: 1244419200, OC: 131112e4, K: 1343174400, PC: 13824e5, E: 13824e5, QC: 1410998400, F: 1413417600, G: 1443657600, RC: 1458518400, A: 1474329600, "3B": 1490572800, B: 1505779200, uB: 1522281600, C: 1537142400, vB: 1553472e3, L: 1568851200, "4B": 1585008e3, M: 1600214400, SC: 1619395200, H: 1632096e3, TC: 1635292800, "5B": 1639353600, "6B": 1647216e3, "7B": 1652745600, "8B": 1658275200, wB: 1662940800, "9B": 1666569600, AC: 1670889600, BC: 1674432e3, CC: 1679875200, DC: 1684368e3, EC: null, D: null, UC: null } }, F: { A: { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0, "6": 0, "7": 0, "8": 954e-5, "9": 0, G: 0, B: 0.03816, C: 0, H: 0, N: 0, D: 0, O: 0, k: 0, l: 0, AB: 0, BB: 0, CB: 0, DB: 0, EB: 0, FB: 0, GB: 0, HB: 0, IB: 0, JB: 0, KB: 477e-5, LB: 0, MB: 0, NB: 0, OB: 0, PB: 0, QB: 0.01431, RB: 0, SB: 0, TB: 0, UB: 0, VB: 0, WB: 0, XB: 0, YB: 0, ZB: 0, aB: 0, bB: 0, cB: 0, dB: 0, eB: 0, fB: 0, gB: 0, hB: 0, iB: 0, jB: 0, kB: 0, lB: 0, mB: 0, nB: 0, oB: 0, m: 0, pB: 0, qB: 0, rB: 0, sB: 0, tB: 0, P: 0, Q: 0, R: 0, "0B": 0, S: 0, T: 0, U: 477e-5, V: 0, W: 0, X: 0, Y: 0.01431, Z: 0, a: 0, b: 0, c: 0, d: 477e-5, e: 0.06201, f: 0.01908, g: 0.45315, h: 1.16388, i: 0.02385, VC: 0, WC: 0, XC: 0, YC: 0, uB: 0, FC: 0, ZC: 0, vB: 0 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "G", "VC", "WC", "XC", "YC", "B", "uB", "FC", "ZC", "C", "vB", "H", "N", "D", "O", "1", "k", "l", "2", "3", "4", "5", "6", "7", "8", "9", "AB", "BB", "CB", "DB", "EB", "FB", "GB", "HB", "IB", "JB", "KB", "LB", "MB", "NB", "OB", "PB", "QB", "RB", "SB", "TB", "UB", "VB", "WB", "XB", "YB", "ZB", "aB", "bB", "cB", "dB", "eB", "fB", "gB", "hB", "iB", "jB", "kB", "lB", "mB", "nB", "oB", "m", "pB", "qB", "rB", "sB", "tB", "P", "Q", "R", "0B", "S", "T", "U", "V", "W", "X", "Y", "Z", "a", "b", "c", "d", "e", "f", "g", "h", "i", "", "", ""], E: "Opera", F: { "1": 1390867200, "2": 1401753600, "3": 1405987200, "4": 1409616e3, "5": 1413331200, "6": 1417132800, "7": 1422316800, "8": 1425945600, "9": 1430179200, G: 1150761600, VC: 1223424e3, WC: 1251763200, XC: 1267488e3, YC: 1277942400, B: 1292457600, uB: 1302566400, FC: 1309219200, ZC: 1323129600, C: 1323129600, vB: 1352073600, H: 1372723200, N: 1377561600, D: 1381104e3, O: 1386288e3, k: 1393891200, l: 1399334400, AB: 1433808e3, BB: 1438646400, CB: 1442448e3, DB: 1445904e3, EB: 1449100800, FB: 1454371200, GB: 1457308800, HB: 146232e4, IB: 1465344e3, JB: 1470096e3, KB: 1474329600, LB: 1477267200, MB: 1481587200, NB: 1486425600, OB: 1490054400, PB: 1494374400, QB: 1498003200, RB: 1502236800, SB: 1506470400, TB: 1510099200, UB: 1515024e3, VB: 1517961600, WB: 1521676800, XB: 1525910400, YB: 1530144e3, ZB: 1534982400, aB: 1537833600, bB: 1543363200, cB: 1548201600, dB: 1554768e3, eB: 1561593600, fB: 1566259200, gB: 1570406400, hB: 1573689600, iB: 1578441600, jB: 1583971200, kB: 1587513600, lB: 1592956800, mB: 1595894400, nB: 1600128e3, oB: 1603238400, m: 161352e4, pB: 1612224e3, qB: 1616544e3, rB: 1619568e3, sB: 1623715200, tB: 1627948800, P: 1631577600, Q: 1633392e3, R: 1635984e3, "0B": 1638403200, S: 1642550400, T: 1644969600, U: 1647993600, V: 1650412800, W: 1652745600, X: 1654646400, Y: 1657152e3, Z: 1660780800, a: 1663113600, b: 1668816e3, c: 1668643200, d: 1671062400, e: 1675209600, f: 1677024e3, g: 1679529600, h: 1681948800, i: 1684195200 }, D: { G: "o", B: "o", C: "o", VC: "o", WC: "o", XC: "o", YC: "o", uB: "o", FC: "o", ZC: "o", vB: "o" } }, G: { A: { F: 0, D: 0, "2B": 0, aC: 0, GC: 307706e-8, bC: 307706e-8, cC: 461559e-8, dC: 0.0153853, eC: 923118e-8, fC: 923118e-8, gC: 0.0476944, hC: 307706e-8, iC: 0.0630797, jC: 0.0215394, kC: 0.0200009, lC: 0.0169238, mC: 0.341554, nC: 923118e-8, oC: 0.0138468, pC: 0.026155, qC: 0.0738494, rC: 0.204624, sC: 0.380017, tC: 0.116928, "5B": 0.143083, "6B": 0.164623, "7B": 0.256934, "8B": 0.667722, wB: 0.776957, "9B": 1.4816, AC: 0.821575, BC: 2.3401, CC: 6.00488, DC: 0.430788, EC: 0 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "2B", "aC", "GC", "bC", "cC", "dC", "F", "eC", "fC", "gC", "hC", "iC", "jC", "kC", "lC", "mC", "nC", "oC", "pC", "qC", "rC", "sC", "tC", "5B", "6B", "7B", "8B", "wB", "9B", "AC", "BC", "CC", "DC", "EC", "D", ""], E: "Safari on iOS", F: { "2B": 1270252800, aC: 1283904e3, GC: 1299628800, bC: 1331078400, cC: 1359331200, dC: 1394409600, F: 1410912e3, eC: 1413763200, fC: 1442361600, gC: 1458518400, hC: 1473724800, iC: 1490572800, jC: 1505779200, kC: 1522281600, lC: 1537142400, mC: 1553472e3, nC: 1568851200, oC: 1572220800, pC: 1580169600, qC: 1585008e3, rC: 1600214400, sC: 1619395200, tC: 1632096e3, "5B": 1639353600, "6B": 1647216e3, "7B": 1652659200, "8B": 1658275200, wB: 1662940800, "9B": 1666569600, AC: 1670889600, BC: 1674432e3, CC: 1679875200, DC: 1684368e3, EC: null, D: null } }, H: { A: { uC: 0.886305 }, B: "o", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "uC", "", "", ""], E: "Opera Mini", F: { uC: 1426464e3 } }, I: { A: { xB: 0, J: 0.0144972, I: 0, vC: 0, wC: 0.0579888, xC: 0, yC: 0.0144972, GC: 0.0797346, zC: 0, "0C": 0.246452 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "vC", "wC", "xC", "xB", "J", "yC", "GC", "zC", "0C", "I", "", "", ""], E: "Android Browser", F: { vC: 1256515200, wC: 1274313600, xC: 1291593600, xB: 1298332800, J: 1318896e3, yC: 1341792e3, GC: 1374624e3, zC: 1386547200, "0C": 1401667200, I: 1685404800 } }, J: { A: { E: 0, A: 0 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "E", "A", "", "", ""], E: "Blackberry Browser", F: { E: 1325376e3, A: 1359504e3 } }, K: { A: { A: 0, B: 0, C: 0, m: 0, uB: 0, FC: 0, vB: 0 }, B: "o", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "A", "B", "uB", "FC", "C", "vB", "m", "", "", ""], E: "Opera Mobile", F: { A: 1287100800, B: 1300752e3, uB: 1314835200, FC: 1318291200, C: 1330300800, vB: 1349740800, m: 1673827200 }, D: { m: "webkit" } }, L: { A: { I: 37.5965 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "I", "", "", ""], E: "Chrome for Android", F: { I: 1685404800 } }, M: { A: { j: 0.27719 }, B: "moz", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "j", "", "", ""], E: "Firefox for Android", F: { j: 1683590400 } }, N: { A: { A: 0, B: 0 }, B: "ms", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "A", "B", "", "", ""], E: "IE Mobile", F: { A: 1340150400, B: 1353456e3 } }, O: { A: { "1C": 0.80019 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "1C", "", "", ""], E: "UC Browser for Android", F: { "1C": 1634688e3 }, D: { "1C": "webkit" } }, P: { A: { J: 0.157218, k: 1.66651, l: 0.408766, "2C": 0, "3C": 0, "4C": 0.0524059, "5C": 0, "6C": 0, "3B": 0, "7C": 0.0209623, "8C": 0, "9C": 0.0209623, AD: 0.0104812, BD: 0.0104812, wB: 0.0419247, CD: 0.0524059, DD: 0.0419247, ED: 0.104812 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "J", "2C", "3C", "4C", "5C", "6C", "3B", "7C", "8C", "9C", "AD", "BD", "wB", "CD", "DD", "ED", "k", "l", "", "", ""], E: "Samsung Internet", F: { J: 1461024e3, "2C": 1481846400, "3C": 1509408e3, "4C": 1528329600, "5C": 1546128e3, "6C": 1554163200, "3B": 1567900800, "7C": 1582588800, "8C": 1593475200, "9C": 1605657600, AD: 1618531200, BD: 1629072e3, wB: 1640736e3, CD: 1651708800, DD: 1659657600, ED: 1667260800, k: 1677369600, l: 1684454400 } }, Q: { A: { "4B": 0.12552 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "4B", "", "", ""], E: "QQ Browser", F: { "4B": 1663718400 } }, R: { A: { FD: 0 }, B: "webkit", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "FD", "", "", ""], E: "Baidu Browser", F: { FD: 1663027200 } }, S: { A: { GD: 0.1046, HD: 0 }, B: "moz", C: ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "GD", "HD", "", "", ""], E: "KaiOS Browser", F: { GD: 1527811200, HD: 1631664e3 } } };
const browsers = browsers$2.browsers;
const versions$1 = browserVersions$1.browserVersions;
const agentsData = agents$1;
function unpackBrowserVersions(versionsData) {
  return Object.keys(versionsData).reduce((usage, version) => {
    usage[versions$1[version]] = versionsData[version];
    return usage;
  }, {});
}
agents$2.agents = Object.keys(agentsData).reduce((map, key) => {
  let versionsData = agentsData[key];
  map[browsers[key]] = Object.keys(versionsData).reduce((data, entry) => {
    if (entry === "A") {
      data.usage_global = unpackBrowserVersions(versionsData[entry]);
    } else if (entry === "C") {
      data.versions = versionsData[entry].reduce((list, version) => {
        if (version === "") {
          list.push(null);
        } else {
          list.push(versions$1[version]);
        }
        return list;
      }, []);
    } else if (entry === "D") {
      data.prefix_exceptions = unpackBrowserVersions(versionsData[entry]);
    } else if (entry === "E") {
      data.browser = versionsData[entry];
    } else if (entry === "F") {
      data.release_date = Object.keys(versionsData[entry]).reduce(
        (map2, key2) => {
          map2[versions$1[key2]] = versionsData[entry][key2];
          return map2;
        },
        {}
      );
    } else {
      data.prefix = versionsData[entry];
    }
    return data;
  }, {});
  return map;
}, {});
const v4 = {
  start: "2015-09-08",
  lts: "2015-10-12",
  maintenance: "2017-04-01",
  end: "2018-04-30",
  codename: "Argon"
};
const v5 = {
  start: "2015-10-29",
  maintenance: "2016-04-30",
  end: "2016-06-30"
};
const v6 = {
  start: "2016-04-26",
  lts: "2016-10-18",
  maintenance: "2018-04-30",
  end: "2019-04-30",
  codename: "Boron"
};
const v7 = {
  start: "2016-10-25",
  maintenance: "2017-04-30",
  end: "2017-06-30"
};
const v8 = {
  start: "2017-05-30",
  lts: "2017-10-31",
  maintenance: "2019-01-01",
  end: "2019-12-31",
  codename: "Carbon"
};
const v9 = {
  start: "2017-10-01",
  maintenance: "2018-04-01",
  end: "2018-06-30"
};
const v10 = {
  start: "2018-04-24",
  lts: "2018-10-30",
  maintenance: "2020-05-19",
  end: "2021-04-30",
  codename: "Dubnium"
};
const v11 = {
  start: "2018-10-23",
  maintenance: "2019-04-22",
  end: "2019-06-01"
};
const v12 = {
  start: "2019-04-23",
  lts: "2019-10-21",
  maintenance: "2020-11-30",
  end: "2022-04-30",
  codename: "Erbium"
};
const v13 = {
  start: "2019-10-22",
  maintenance: "2020-04-01",
  end: "2020-06-01"
};
const v14 = {
  start: "2020-04-21",
  lts: "2020-10-27",
  maintenance: "2021-10-19",
  end: "2023-04-30",
  codename: "Fermium"
};
const v15 = {
  start: "2020-10-20",
  maintenance: "2021-04-01",
  end: "2021-06-01"
};
const v16 = {
  start: "2021-04-20",
  lts: "2021-10-26",
  maintenance: "2022-10-18",
  end: "2023-09-11",
  codename: "Gallium"
};
const v17 = {
  start: "2021-10-19",
  maintenance: "2022-04-01",
  end: "2022-06-01"
};
const v18 = {
  start: "2022-04-19",
  lts: "2022-10-25",
  maintenance: "2023-10-18",
  end: "2025-04-30",
  codename: "Hydrogen"
};
const v19 = {
  start: "2022-10-18",
  maintenance: "2023-04-01",
  end: "2023-06-01"
};
const v20 = {
  start: "2023-04-18",
  lts: "2023-10-24",
  maintenance: "2024-10-22",
  end: "2026-04-30",
  codename: ""
};
const require$$2 = {
  "v0.8": {
    start: "2012-06-25",
    end: "2014-07-31"
  },
  "v0.10": {
    start: "2013-03-11",
    end: "2016-10-31"
  },
  "v0.12": {
    start: "2015-02-06",
    end: "2016-12-31"
  },
  v4,
  v5,
  v6,
  v7,
  v8,
  v9,
  v10,
  v11,
  v12,
  v13,
  v14,
  v15,
  v16,
  v17,
  v18,
  v19,
  v20
};
const __viteBrowserExternal = {};
const __viteBrowserExternal$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: __viteBrowserExternal
}, Symbol.toStringTag, { value: "Module" }));
const require$$3 = /* @__PURE__ */ getAugmentedNamespace(__viteBrowserExternal$1);
var versions = {
  "0.20": "39",
  "0.21": "41",
  "0.22": "41",
  "0.23": "41",
  "0.24": "41",
  "0.25": "42",
  "0.26": "42",
  "0.27": "43",
  "0.28": "43",
  "0.29": "43",
  "0.30": "44",
  "0.31": "45",
  "0.32": "45",
  "0.33": "45",
  "0.34": "45",
  "0.35": "45",
  "0.36": "47",
  "0.37": "49",
  "1.0": "49",
  "1.1": "50",
  "1.2": "51",
  "1.3": "52",
  "1.4": "53",
  "1.5": "54",
  "1.6": "56",
  "1.7": "58",
  "1.8": "59",
  "2.0": "61",
  "2.1": "61",
  "3.0": "66",
  "3.1": "66",
  "4.0": "69",
  "4.1": "69",
  "4.2": "69",
  "5.0": "73",
  "6.0": "76",
  "6.1": "76",
  "7.0": "78",
  "7.1": "78",
  "7.2": "78",
  "7.3": "78",
  "8.0": "80",
  "8.1": "80",
  "8.2": "80",
  "8.3": "80",
  "8.4": "80",
  "8.5": "80",
  "9.0": "83",
  "9.1": "83",
  "9.2": "83",
  "9.3": "83",
  "9.4": "83",
  "10.0": "85",
  "10.1": "85",
  "10.2": "85",
  "10.3": "85",
  "10.4": "85",
  "11.0": "87",
  "11.1": "87",
  "11.2": "87",
  "11.3": "87",
  "11.4": "87",
  "11.5": "87",
  "12.0": "89",
  "12.1": "89",
  "12.2": "89",
  "13.0": "91",
  "13.1": "91",
  "13.2": "91",
  "13.3": "91",
  "13.4": "91",
  "13.5": "91",
  "13.6": "91",
  "14.0": "93",
  "14.1": "93",
  "14.2": "93",
  "15.0": "94",
  "15.1": "94",
  "15.2": "94",
  "15.3": "94",
  "15.4": "94",
  "15.5": "94",
  "16.0": "96",
  "16.1": "96",
  "16.2": "96",
  "17.0": "98",
  "17.1": "98",
  "17.2": "98",
  "17.3": "98",
  "17.4": "98",
  "18.0": "100",
  "18.1": "100",
  "18.2": "100",
  "18.3": "100",
  "19.0": "102",
  "19.1": "102",
  "20.0": "104",
  "20.1": "104",
  "20.2": "104",
  "20.3": "104",
  "21.0": "106",
  "21.1": "106",
  "21.2": "106",
  "21.3": "106",
  "21.4": "106",
  "22.0": "108",
  "22.1": "108",
  "22.2": "108",
  "22.3": "108",
  "23.0": "110",
  "23.1": "110",
  "23.2": "110",
  "23.3": "110",
  "24.0": "112",
  "24.1": "112",
  "24.2": "112",
  "24.3": "112",
  "24.4": "112",
  "24.5": "112",
  "25.0": "114",
  "25.1": "114",
  "26.0": "116"
};
function BrowserslistError$2(message) {
  this.name = "BrowserslistError";
  this.message = message;
  this.browserslist = true;
  if (Error.captureStackTrace) {
    Error.captureStackTrace(this, BrowserslistError$2);
  }
}
BrowserslistError$2.prototype = Error.prototype;
var error = BrowserslistError$2;
var AND_REGEXP = /^\s+and\s+(.*)/i;
var OR_REGEXP = /^(?:,\s*|\s+or\s+)(.*)/i;
function flatten(array) {
  if (!Array.isArray(array))
    return [array];
  return array.reduce(function(a, b) {
    return a.concat(flatten(b));
  }, []);
}
function find(string, predicate) {
  for (var n = 1, max = string.length; n <= max; n++) {
    var parsed = string.substr(-n, n);
    if (predicate(parsed, n, max)) {
      return string.slice(0, -n);
    }
  }
  return "";
}
function matchQuery(all2, query) {
  var node = { query };
  if (query.indexOf("not ") === 0) {
    node.not = true;
    query = query.slice(4);
  }
  for (var name in all2) {
    var type = all2[name];
    var match = query.match(type.regexp);
    if (match) {
      node.type = name;
      for (var i = 0; i < type.matches.length; i++) {
        node[type.matches[i]] = match[i + 1];
      }
      return node;
    }
  }
  node.type = "unknown";
  return node;
}
function matchBlock(all2, string, qs) {
  var node;
  return find(string, function(parsed, n, max) {
    if (AND_REGEXP.test(parsed)) {
      node = matchQuery(all2, parsed.match(AND_REGEXP)[1]);
      node.compose = "and";
      qs.unshift(node);
      return true;
    } else if (OR_REGEXP.test(parsed)) {
      node = matchQuery(all2, parsed.match(OR_REGEXP)[1]);
      node.compose = "or";
      qs.unshift(node);
      return true;
    } else if (n === max) {
      node = matchQuery(all2, parsed.trim());
      node.compose = "or";
      qs.unshift(node);
      return true;
    }
    return false;
  });
}
var parse$1 = function parse(all2, queries) {
  if (!Array.isArray(queries))
    queries = [queries];
  return flatten(
    queries.map(function(block) {
      var qs = [];
      do {
        block = matchBlock(all2, block, qs);
      } while (block);
      return qs;
    })
  );
};
var BrowserslistError$1 = error;
function noop() {
}
var browser = {
  loadQueries: function loadQueries() {
    throw new BrowserslistError$1(
      "Sharable configs are not supported in client-side build of Browserslist"
    );
  },
  getStat: function getStat(opts) {
    return opts.stats;
  },
  loadConfig: function loadConfig(opts) {
    if (opts.config) {
      throw new BrowserslistError$1(
        "Browserslist config are not supported in client-side build"
      );
    }
  },
  loadCountry: function loadCountry() {
    throw new BrowserslistError$1(
      "Country statistics are not supported in client-side build of Browserslist"
    );
  },
  loadFeature: function loadFeature() {
    throw new BrowserslistError$1(
      "Supports queries are not available in client-side build of Browserslist"
    );
  },
  currentNode: function currentNode(resolve2, context3) {
    return resolve2(["maintained node versions"], context3)[0];
  },
  parseConfig: noop,
  readConfig: noop,
  findConfig: noop,
  clearCaches: noop,
  oldDataWarning: noop,
  env: {}
};
var jsReleases = require$$0;
var agents = agents$2.agents;
var jsEOL = require$$2;
var path = require$$3;
var e2c = versions;
var BrowserslistError = error;
var parse2 = parse$1;
var env = browser;
var YEAR = 365.259641 * 24 * 60 * 60 * 1e3;
var ANDROID_EVERGREEN_FIRST = "37";
function isVersionsMatch(versionA, versionB) {
  return (versionA + ".").indexOf(versionB + ".") === 0;
}
function isEolReleased(name) {
  var version = name.slice(1);
  return browserslist.nodeVersions.some(function(i) {
    return isVersionsMatch(i, version);
  });
}
function normalize$1(versions2) {
  return versions2.filter(function(version) {
    return typeof version === "string";
  });
}
function normalizeElectron(version) {
  var versionToUse = version;
  if (version.split(".").length === 3) {
    versionToUse = version.split(".").slice(0, -1).join(".");
  }
  return versionToUse;
}
function nameMapper(name) {
  return function mapName(version) {
    return name + " " + version;
  };
}
function getMajor(version) {
  return parseInt(version.split(".")[0]);
}
function getMajorVersions(released, number) {
  if (released.length === 0)
    return [];
  var majorVersions = uniq(released.map(getMajor));
  var minimum = majorVersions[majorVersions.length - number];
  if (!minimum) {
    return released;
  }
  var selected = [];
  for (var i = released.length - 1; i >= 0; i--) {
    if (minimum > getMajor(released[i]))
      break;
    selected.unshift(released[i]);
  }
  return selected;
}
function uniq(array) {
  var filtered = [];
  for (var i = 0; i < array.length; i++) {
    if (filtered.indexOf(array[i]) === -1)
      filtered.push(array[i]);
  }
  return filtered;
}
function fillUsage(result, name, data) {
  for (var i in data) {
    result[name + " " + i] = data[i];
  }
}
function generateFilter(sign, version) {
  version = parseFloat(version);
  if (sign === ">") {
    return function(v) {
      return parseFloat(v) > version;
    };
  } else if (sign === ">=") {
    return function(v) {
      return parseFloat(v) >= version;
    };
  } else if (sign === "<") {
    return function(v) {
      return parseFloat(v) < version;
    };
  } else {
    return function(v) {
      return parseFloat(v) <= version;
    };
  }
}
function generateSemverFilter(sign, version) {
  version = version.split(".").map(parseSimpleInt);
  version[1] = version[1] || 0;
  version[2] = version[2] || 0;
  if (sign === ">") {
    return function(v) {
      v = v.split(".").map(parseSimpleInt);
      return compareSemver(v, version) > 0;
    };
  } else if (sign === ">=") {
    return function(v) {
      v = v.split(".").map(parseSimpleInt);
      return compareSemver(v, version) >= 0;
    };
  } else if (sign === "<") {
    return function(v) {
      v = v.split(".").map(parseSimpleInt);
      return compareSemver(version, v) > 0;
    };
  } else {
    return function(v) {
      v = v.split(".").map(parseSimpleInt);
      return compareSemver(version, v) >= 0;
    };
  }
}
function parseSimpleInt(x) {
  return parseInt(x);
}
function compare(a, b) {
  if (a < b)
    return -1;
  if (a > b)
    return 1;
  return 0;
}
function compareSemver(a, b) {
  return compare(parseInt(a[0]), parseInt(b[0])) || compare(parseInt(a[1] || "0"), parseInt(b[1] || "0")) || compare(parseInt(a[2] || "0"), parseInt(b[2] || "0"));
}
function semverFilterLoose(operator, range) {
  range = range.split(".").map(parseSimpleInt);
  if (typeof range[1] === "undefined") {
    range[1] = "x";
  }
  switch (operator) {
    case "<=":
      return function(version) {
        version = version.split(".").map(parseSimpleInt);
        return compareSemverLoose(version, range) <= 0;
      };
    case ">=":
    default:
      return function(version) {
        version = version.split(".").map(parseSimpleInt);
        return compareSemverLoose(version, range) >= 0;
      };
  }
}
function compareSemverLoose(version, range) {
  if (version[0] !== range[0]) {
    return version[0] < range[0] ? -1 : 1;
  }
  if (range[1] === "x") {
    return 0;
  }
  if (version[1] !== range[1]) {
    return version[1] < range[1] ? -1 : 1;
  }
  return 0;
}
function resolveVersion(data, version) {
  if (data.versions.indexOf(version) !== -1) {
    return version;
  } else if (browserslist.versionAliases[data.name][version]) {
    return browserslist.versionAliases[data.name][version];
  } else {
    return false;
  }
}
function normalizeVersion(data, version) {
  var resolved = resolveVersion(data, version);
  if (resolved) {
    return resolved;
  } else if (data.versions.length === 1) {
    return data.versions[0];
  } else {
    return false;
  }
}
function filterByYear(since, context3) {
  since = since / 1e3;
  return Object.keys(agents).reduce(function(selected, name) {
    var data = byName(name, context3);
    if (!data)
      return selected;
    var versions2 = Object.keys(data.releaseDate).filter(function(v) {
      var date = data.releaseDate[v];
      return date !== null && date >= since;
    });
    return selected.concat(versions2.map(nameMapper(data.name)));
  }, []);
}
function cloneData(data) {
  return {
    name: data.name,
    versions: data.versions,
    released: data.released,
    releaseDate: data.releaseDate
  };
}
function mapVersions(data, map) {
  data.versions = data.versions.map(function(i2) {
    return map[i2] || i2;
  });
  data.released = data.released.map(function(i2) {
    return map[i2] || i2;
  });
  var fixedDate = {};
  for (var i in data.releaseDate) {
    fixedDate[map[i] || i] = data.releaseDate[i];
  }
  data.releaseDate = fixedDate;
  return data;
}
function byName(name, context3) {
  name = name.toLowerCase();
  name = browserslist.aliases[name] || name;
  if (context3.mobileToDesktop && browserslist.desktopNames[name]) {
    var desktop = browserslist.data[browserslist.desktopNames[name]];
    if (name === "android") {
      return normalizeAndroidData(cloneData(browserslist.data[name]), desktop);
    } else {
      var cloned = cloneData(desktop);
      cloned.name = name;
      if (name === "op_mob") {
        cloned = mapVersions(cloned, { "10.0-10.1": "10" });
      }
      return cloned;
    }
  }
  return browserslist.data[name];
}
function normalizeAndroidVersions(androidVersions, chromeVersions) {
  var iFirstEvergreen = chromeVersions.indexOf(ANDROID_EVERGREEN_FIRST);
  return androidVersions.filter(function(version) {
    return /^(?:[2-4]\.|[34]$)/.test(version);
  }).concat(chromeVersions.slice(iFirstEvergreen));
}
function normalizeAndroidData(android, chrome) {
  android.released = normalizeAndroidVersions(android.released, chrome.released);
  android.versions = normalizeAndroidVersions(android.versions, chrome.versions);
  android.released.forEach(function(v) {
    if (android.releaseDate[v] === void 0) {
      android.releaseDate[v] = chrome.releaseDate[v];
    }
  });
  return android;
}
function checkName(name, context3) {
  var data = byName(name, context3);
  if (!data)
    throw new BrowserslistError("Unknown browser " + name);
  return data;
}
function unknownQuery(query) {
  return new BrowserslistError(
    "Unknown browser query `" + query + "`. Maybe you are using old Browserslist or made typo in query."
  );
}
function filterAndroid(list, versions2, context3) {
  if (context3.mobileToDesktop)
    return list;
  var released = browserslist.data.chrome.released;
  var nEvergreen = released.length - released.indexOf(ANDROID_EVERGREEN_FIRST);
  if (versions2 <= nEvergreen) {
    return list.slice(-1);
  }
  return list.slice(nEvergreen - 1 - versions2);
}
function isSupported(flags) {
  return typeof flags === "string" && (flags.indexOf("y") >= 0 || flags.indexOf("a") >= 0);
}
function resolve(queries, context3) {
  return parse2(QUERIES, queries).reduce(function(result, node, index2) {
    if (node.not && index2 === 0) {
      throw new BrowserslistError(
        "Write any browsers query (for instance, `defaults`) before `" + node.query + "`"
      );
    }
    var type = QUERIES[node.type];
    var array = type.select.call(browserslist, context3, node).map(function(j) {
      var parts = j.split(" ");
      if (parts[1] === "0") {
        return parts[0] + " " + byName(parts[0], context3).versions[0];
      } else {
        return j;
      }
    });
    if (node.compose === "and") {
      if (node.not) {
        return result.filter(function(j) {
          return array.indexOf(j) === -1;
        });
      } else {
        return result.filter(function(j) {
          return array.indexOf(j) !== -1;
        });
      }
    } else {
      if (node.not) {
        var filter3 = {};
        array.forEach(function(j) {
          filter3[j] = true;
        });
        return result.filter(function(j) {
          return !filter3[j];
        });
      }
      return result.concat(array);
    }
  }, []);
}
function prepareOpts(opts) {
  if (typeof opts === "undefined")
    opts = {};
  if (typeof opts.path === "undefined") {
    opts.path = path.resolve ? path.resolve(".") : ".";
  }
  return opts;
}
function prepareQueries(queries, opts) {
  if (typeof queries === "undefined" || queries === null) {
    var config3 = browserslist.loadConfig(opts);
    if (config3) {
      queries = config3;
    } else {
      queries = browserslist.defaults;
    }
  }
  return queries;
}
function checkQueries(queries) {
  if (!(typeof queries === "string" || Array.isArray(queries))) {
    throw new BrowserslistError(
      "Browser queries must be an array or string. Got " + typeof queries + "."
    );
  }
}
var cache = {};
function browserslist(queries, opts) {
  opts = prepareOpts(opts);
  queries = prepareQueries(queries, opts);
  checkQueries(queries);
  var context3 = {
    ignoreUnknownVersions: opts.ignoreUnknownVersions,
    dangerousExtend: opts.dangerousExtend,
    mobileToDesktop: opts.mobileToDesktop,
    path: opts.path,
    env: opts.env
  };
  env.oldDataWarning(browserslist.data);
  var stats = env.getStat(opts, browserslist.data);
  if (stats) {
    context3.customUsage = {};
    for (var browser2 in stats) {
      fillUsage(context3.customUsage, browser2, stats[browser2]);
    }
  }
  var cacheKey = JSON.stringify([queries, context3]);
  if (cache[cacheKey])
    return cache[cacheKey];
  var result = uniq(resolve(queries, context3)).sort(function(name1, name2) {
    name1 = name1.split(" ");
    name2 = name2.split(" ");
    if (name1[0] === name2[0]) {
      var version1 = name1[1].split("-")[0];
      var version2 = name2[1].split("-")[0];
      return compareSemver(version2.split("."), version1.split("."));
    } else {
      return compare(name1[0], name2[0]);
    }
  });
  if (!env.env.BROWSERSLIST_DISABLE_CACHE) {
    cache[cacheKey] = result;
  }
  return result;
}
browserslist.parse = function(queries, opts) {
  opts = prepareOpts(opts);
  queries = prepareQueries(queries, opts);
  checkQueries(queries);
  return parse2(QUERIES, queries);
};
browserslist.cache = {};
browserslist.data = {};
browserslist.usage = {
  global: {},
  custom: null
};
browserslist.defaults = ["> 0.5%", "last 2 versions", "Firefox ESR", "not dead"];
browserslist.aliases = {
  fx: "firefox",
  ff: "firefox",
  ios: "ios_saf",
  explorer: "ie",
  blackberry: "bb",
  explorermobile: "ie_mob",
  operamini: "op_mini",
  operamobile: "op_mob",
  chromeandroid: "and_chr",
  firefoxandroid: "and_ff",
  ucandroid: "and_uc",
  qqandroid: "and_qq"
};
browserslist.desktopNames = {
  and_chr: "chrome",
  and_ff: "firefox",
  ie_mob: "ie",
  op_mob: "opera",
  android: "chrome"
  // has extra processing logic
};
browserslist.versionAliases = {};
browserslist.clearCaches = env.clearCaches;
browserslist.parseConfig = env.parseConfig;
browserslist.readConfig = env.readConfig;
browserslist.findConfig = env.findConfig;
browserslist.loadConfig = env.loadConfig;
browserslist.coverage = function(browsers2, stats) {
  var data;
  if (typeof stats === "undefined") {
    data = browserslist.usage.global;
  } else if (stats === "my stats") {
    var opts = {};
    opts.path = path.resolve ? path.resolve(".") : ".";
    var customStats = env.getStat(opts);
    if (!customStats) {
      throw new BrowserslistError("Custom usage statistics was not provided");
    }
    data = {};
    for (var browser2 in customStats) {
      fillUsage(data, browser2, customStats[browser2]);
    }
  } else if (typeof stats === "string") {
    if (stats.length > 2) {
      stats = stats.toLowerCase();
    } else {
      stats = stats.toUpperCase();
    }
    env.loadCountry(browserslist.usage, stats, browserslist.data);
    data = browserslist.usage[stats];
  } else {
    if ("dataByBrowser" in stats) {
      stats = stats.dataByBrowser;
    }
    data = {};
    for (var name in stats) {
      for (var version in stats[name]) {
        data[name + " " + version] = stats[name][version];
      }
    }
  }
  return browsers2.reduce(function(all2, i) {
    var usage = data[i];
    if (usage === void 0) {
      usage = data[i.replace(/ \S+$/, " 0")];
    }
    return all2 + (usage || 0);
  }, 0);
};
function nodeQuery(context3, node) {
  var matched = browserslist.nodeVersions.filter(function(i) {
    return isVersionsMatch(i, node.version);
  });
  if (matched.length === 0) {
    if (context3.ignoreUnknownVersions) {
      return [];
    } else {
      throw new BrowserslistError(
        "Unknown version " + node.version + " of Node.js"
      );
    }
  }
  return ["node " + matched[matched.length - 1]];
}
function sinceQuery(context3, node) {
  var year = parseInt(node.year);
  var month = parseInt(node.month || "01") - 1;
  var day = parseInt(node.day || "01");
  return filterByYear(Date.UTC(year, month, day, 0, 0, 0), context3);
}
function coverQuery(context3, node) {
  var coverage = parseFloat(node.coverage);
  var usage = browserslist.usage.global;
  if (node.place) {
    if (node.place.match(/^my\s+stats$/i)) {
      if (!context3.customUsage) {
        throw new BrowserslistError("Custom usage statistics was not provided");
      }
      usage = context3.customUsage;
    } else {
      var place;
      if (node.place.length === 2) {
        place = node.place.toUpperCase();
      } else {
        place = node.place.toLowerCase();
      }
      env.loadCountry(browserslist.usage, place, browserslist.data);
      usage = browserslist.usage[place];
    }
  }
  var versions2 = Object.keys(usage).sort(function(a, b) {
    return usage[b] - usage[a];
  });
  var coveraged = 0;
  var result = [];
  var version;
  for (var i = 0; i < versions2.length; i++) {
    version = versions2[i];
    if (usage[version] === 0)
      break;
    coveraged += usage[version];
    result.push(version);
    if (coveraged >= coverage)
      break;
  }
  return result;
}
var QUERIES = {
  last_major_versions: {
    matches: ["versions"],
    regexp: /^last\s+(\d+)\s+major\s+versions?$/i,
    select: function(context3, node) {
      return Object.keys(agents).reduce(function(selected, name) {
        var data = byName(name, context3);
        if (!data)
          return selected;
        var list = getMajorVersions(data.released, node.versions);
        list = list.map(nameMapper(data.name));
        if (data.name === "android") {
          list = filterAndroid(list, node.versions, context3);
        }
        return selected.concat(list);
      }, []);
    }
  },
  last_versions: {
    matches: ["versions"],
    regexp: /^last\s+(\d+)\s+versions?$/i,
    select: function(context3, node) {
      return Object.keys(agents).reduce(function(selected, name) {
        var data = byName(name, context3);
        if (!data)
          return selected;
        var list = data.released.slice(-node.versions);
        list = list.map(nameMapper(data.name));
        if (data.name === "android") {
          list = filterAndroid(list, node.versions, context3);
        }
        return selected.concat(list);
      }, []);
    }
  },
  last_electron_major_versions: {
    matches: ["versions"],
    regexp: /^last\s+(\d+)\s+electron\s+major\s+versions?$/i,
    select: function(context3, node) {
      var validVersions = getMajorVersions(Object.keys(e2c), node.versions);
      return validVersions.map(function(i) {
        return "chrome " + e2c[i];
      });
    }
  },
  last_node_major_versions: {
    matches: ["versions"],
    regexp: /^last\s+(\d+)\s+node\s+major\s+versions?$/i,
    select: function(context3, node) {
      return getMajorVersions(browserslist.nodeVersions, node.versions).map(
        function(version) {
          return "node " + version;
        }
      );
    }
  },
  last_browser_major_versions: {
    matches: ["versions", "browser"],
    regexp: /^last\s+(\d+)\s+(\w+)\s+major\s+versions?$/i,
    select: function(context3, node) {
      var data = checkName(node.browser, context3);
      var validVersions = getMajorVersions(data.released, node.versions);
      var list = validVersions.map(nameMapper(data.name));
      if (data.name === "android") {
        list = filterAndroid(list, node.versions, context3);
      }
      return list;
    }
  },
  last_electron_versions: {
    matches: ["versions"],
    regexp: /^last\s+(\d+)\s+electron\s+versions?$/i,
    select: function(context3, node) {
      return Object.keys(e2c).slice(-node.versions).map(function(i) {
        return "chrome " + e2c[i];
      });
    }
  },
  last_node_versions: {
    matches: ["versions"],
    regexp: /^last\s+(\d+)\s+node\s+versions?$/i,
    select: function(context3, node) {
      return browserslist.nodeVersions.slice(-node.versions).map(function(version) {
        return "node " + version;
      });
    }
  },
  last_browser_versions: {
    matches: ["versions", "browser"],
    regexp: /^last\s+(\d+)\s+(\w+)\s+versions?$/i,
    select: function(context3, node) {
      var data = checkName(node.browser, context3);
      var list = data.released.slice(-node.versions).map(nameMapper(data.name));
      if (data.name === "android") {
        list = filterAndroid(list, node.versions, context3);
      }
      return list;
    }
  },
  unreleased_versions: {
    matches: [],
    regexp: /^unreleased\s+versions$/i,
    select: function(context3) {
      return Object.keys(agents).reduce(function(selected, name) {
        var data = byName(name, context3);
        if (!data)
          return selected;
        var list = data.versions.filter(function(v) {
          return data.released.indexOf(v) === -1;
        });
        list = list.map(nameMapper(data.name));
        return selected.concat(list);
      }, []);
    }
  },
  unreleased_electron_versions: {
    matches: [],
    regexp: /^unreleased\s+electron\s+versions?$/i,
    select: function() {
      return [];
    }
  },
  unreleased_browser_versions: {
    matches: ["browser"],
    regexp: /^unreleased\s+(\w+)\s+versions?$/i,
    select: function(context3, node) {
      var data = checkName(node.browser, context3);
      return data.versions.filter(function(v) {
        return data.released.indexOf(v) === -1;
      }).map(nameMapper(data.name));
    }
  },
  last_years: {
    matches: ["years"],
    regexp: /^last\s+(\d*.?\d+)\s+years?$/i,
    select: function(context3, node) {
      return filterByYear(Date.now() - YEAR * node.years, context3);
    }
  },
  since_y: {
    matches: ["year"],
    regexp: /^since (\d+)$/i,
    select: sinceQuery
  },
  since_y_m: {
    matches: ["year", "month"],
    regexp: /^since (\d+)-(\d+)$/i,
    select: sinceQuery
  },
  since_y_m_d: {
    matches: ["year", "month", "day"],
    regexp: /^since (\d+)-(\d+)-(\d+)$/i,
    select: sinceQuery
  },
  popularity: {
    matches: ["sign", "popularity"],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%$/,
    select: function(context3, node) {
      var popularity = parseFloat(node.popularity);
      var usage = browserslist.usage.global;
      return Object.keys(usage).reduce(function(result, version) {
        if (node.sign === ">") {
          if (usage[version] > popularity) {
            result.push(version);
          }
        } else if (node.sign === "<") {
          if (usage[version] < popularity) {
            result.push(version);
          }
        } else if (node.sign === "<=") {
          if (usage[version] <= popularity) {
            result.push(version);
          }
        } else if (usage[version] >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  popularity_in_my_stats: {
    matches: ["sign", "popularity"],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+my\s+stats$/,
    select: function(context3, node) {
      var popularity = parseFloat(node.popularity);
      if (!context3.customUsage) {
        throw new BrowserslistError("Custom usage statistics was not provided");
      }
      var usage = context3.customUsage;
      return Object.keys(usage).reduce(function(result, version) {
        var percentage = usage[version];
        if (percentage == null) {
          return result;
        }
        if (node.sign === ">") {
          if (percentage > popularity) {
            result.push(version);
          }
        } else if (node.sign === "<") {
          if (percentage < popularity) {
            result.push(version);
          }
        } else if (node.sign === "<=") {
          if (percentage <= popularity) {
            result.push(version);
          }
        } else if (percentage >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  popularity_in_config_stats: {
    matches: ["sign", "popularity", "config"],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+(\S+)\s+stats$/,
    select: function(context3, node) {
      var popularity = parseFloat(node.popularity);
      var stats = env.loadStat(context3, node.config, browserslist.data);
      if (stats) {
        context3.customUsage = {};
        for (var browser2 in stats) {
          fillUsage(context3.customUsage, browser2, stats[browser2]);
        }
      }
      if (!context3.customUsage) {
        throw new BrowserslistError("Custom usage statistics was not provided");
      }
      var usage = context3.customUsage;
      return Object.keys(usage).reduce(function(result, version) {
        var percentage = usage[version];
        if (percentage == null) {
          return result;
        }
        if (node.sign === ">") {
          if (percentage > popularity) {
            result.push(version);
          }
        } else if (node.sign === "<") {
          if (percentage < popularity) {
            result.push(version);
          }
        } else if (node.sign === "<=") {
          if (percentage <= popularity) {
            result.push(version);
          }
        } else if (percentage >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  popularity_in_place: {
    matches: ["sign", "popularity", "place"],
    regexp: /^(>=?|<=?)\s*(\d+|\d+\.\d+|\.\d+)%\s+in\s+((alt-)?\w\w)$/,
    select: function(context3, node) {
      var popularity = parseFloat(node.popularity);
      var place = node.place;
      if (place.length === 2) {
        place = place.toUpperCase();
      } else {
        place = place.toLowerCase();
      }
      env.loadCountry(browserslist.usage, place, browserslist.data);
      var usage = browserslist.usage[place];
      return Object.keys(usage).reduce(function(result, version) {
        var percentage = usage[version];
        if (percentage == null) {
          return result;
        }
        if (node.sign === ">") {
          if (percentage > popularity) {
            result.push(version);
          }
        } else if (node.sign === "<") {
          if (percentage < popularity) {
            result.push(version);
          }
        } else if (node.sign === "<=") {
          if (percentage <= popularity) {
            result.push(version);
          }
        } else if (percentage >= popularity) {
          result.push(version);
        }
        return result;
      }, []);
    }
  },
  cover: {
    matches: ["coverage"],
    regexp: /^cover\s+(\d+|\d+\.\d+|\.\d+)%$/i,
    select: coverQuery
  },
  cover_in: {
    matches: ["coverage", "place"],
    regexp: /^cover\s+(\d+|\d+\.\d+|\.\d+)%\s+in\s+(my\s+stats|(alt-)?\w\w)$/i,
    select: coverQuery
  },
  supports: {
    matches: ["feature"],
    regexp: /^supports\s+([\w-]+)$/,
    select: function(context3, node) {
      env.loadFeature(browserslist.cache, node.feature);
      var features = browserslist.cache[node.feature];
      var result = [];
      for (var name in features) {
        var data = byName(name, context3);
        var checkDesktop = context3.mobileToDesktop && name in browserslist.desktopNames && isSupported(features[name][data.released.slice(-1)[0]]);
        data.versions.forEach(function(version) {
          var flags = features[name][version];
          if (flags === void 0 && checkDesktop) {
            flags = features[browserslist.desktopNames[name]][version];
          }
          if (isSupported(flags)) {
            result.push(name + " " + version);
          }
        });
      }
      return result;
    }
  },
  electron_range: {
    matches: ["from", "to"],
    regexp: /^electron\s+([\d.]+)\s*-\s*([\d.]+)$/i,
    select: function(context3, node) {
      var fromToUse = normalizeElectron(node.from);
      var toToUse = normalizeElectron(node.to);
      var from = parseFloat(node.from);
      var to = parseFloat(node.to);
      if (!e2c[fromToUse]) {
        throw new BrowserslistError("Unknown version " + from + " of electron");
      }
      if (!e2c[toToUse]) {
        throw new BrowserslistError("Unknown version " + to + " of electron");
      }
      return Object.keys(e2c).filter(function(i) {
        var parsed = parseFloat(i);
        return parsed >= from && parsed <= to;
      }).map(function(i) {
        return "chrome " + e2c[i];
      });
    }
  },
  node_range: {
    matches: ["from", "to"],
    regexp: /^node\s+([\d.]+)\s*-\s*([\d.]+)$/i,
    select: function(context3, node) {
      return browserslist.nodeVersions.filter(semverFilterLoose(">=", node.from)).filter(semverFilterLoose("<=", node.to)).map(function(v) {
        return "node " + v;
      });
    }
  },
  browser_range: {
    matches: ["browser", "from", "to"],
    regexp: /^(\w+)\s+([\d.]+)\s*-\s*([\d.]+)$/i,
    select: function(context3, node) {
      var data = checkName(node.browser, context3);
      var from = parseFloat(normalizeVersion(data, node.from) || node.from);
      var to = parseFloat(normalizeVersion(data, node.to) || node.to);
      function filter3(v) {
        var parsed = parseFloat(v);
        return parsed >= from && parsed <= to;
      }
      return data.released.filter(filter3).map(nameMapper(data.name));
    }
  },
  electron_ray: {
    matches: ["sign", "version"],
    regexp: /^electron\s*(>=?|<=?)\s*([\d.]+)$/i,
    select: function(context3, node) {
      var versionToUse = normalizeElectron(node.version);
      return Object.keys(e2c).filter(generateFilter(node.sign, versionToUse)).map(function(i) {
        return "chrome " + e2c[i];
      });
    }
  },
  node_ray: {
    matches: ["sign", "version"],
    regexp: /^node\s*(>=?|<=?)\s*([\d.]+)$/i,
    select: function(context3, node) {
      return browserslist.nodeVersions.filter(generateSemverFilter(node.sign, node.version)).map(function(v) {
        return "node " + v;
      });
    }
  },
  browser_ray: {
    matches: ["browser", "sign", "version"],
    regexp: /^(\w+)\s*(>=?|<=?)\s*([\d.]+)$/,
    select: function(context3, node) {
      var version = node.version;
      var data = checkName(node.browser, context3);
      var alias = browserslist.versionAliases[data.name][version];
      if (alias)
        version = alias;
      return data.released.filter(generateFilter(node.sign, version)).map(function(v) {
        return data.name + " " + v;
      });
    }
  },
  firefox_esr: {
    matches: [],
    regexp: /^(firefox|ff|fx)\s+esr$/i,
    select: function() {
      return ["firefox 102"];
    }
  },
  opera_mini_all: {
    matches: [],
    regexp: /(operamini|op_mini)\s+all/i,
    select: function() {
      return ["op_mini all"];
    }
  },
  electron_version: {
    matches: ["version"],
    regexp: /^electron\s+([\d.]+)$/i,
    select: function(context3, node) {
      var versionToUse = normalizeElectron(node.version);
      var chrome = e2c[versionToUse];
      if (!chrome) {
        throw new BrowserslistError(
          "Unknown version " + node.version + " of electron"
        );
      }
      return ["chrome " + chrome];
    }
  },
  node_major_version: {
    matches: ["version"],
    regexp: /^node\s+(\d+)$/i,
    select: nodeQuery
  },
  node_minor_version: {
    matches: ["version"],
    regexp: /^node\s+(\d+\.\d+)$/i,
    select: nodeQuery
  },
  node_patch_version: {
    matches: ["version"],
    regexp: /^node\s+(\d+\.\d+\.\d+)$/i,
    select: nodeQuery
  },
  current_node: {
    matches: [],
    regexp: /^current\s+node$/i,
    select: function(context3) {
      return [env.currentNode(resolve, context3)];
    }
  },
  maintained_node: {
    matches: [],
    regexp: /^maintained\s+node\s+versions$/i,
    select: function(context3) {
      var now2 = Date.now();
      var queries = Object.keys(jsEOL).filter(function(key) {
        return now2 < Date.parse(jsEOL[key].end) && now2 > Date.parse(jsEOL[key].start) && isEolReleased(key);
      }).map(function(key) {
        return "node " + key.slice(1);
      });
      return resolve(queries, context3);
    }
  },
  phantomjs_1_9: {
    matches: [],
    regexp: /^phantomjs\s+1.9$/i,
    select: function() {
      return ["safari 5"];
    }
  },
  phantomjs_2_1: {
    matches: [],
    regexp: /^phantomjs\s+2.1$/i,
    select: function() {
      return ["safari 6"];
    }
  },
  browser_version: {
    matches: ["browser", "version"],
    regexp: /^(\w+)\s+(tp|[\d.]+)$/i,
    select: function(context3, node) {
      var version = node.version;
      if (/^tp$/i.test(version))
        version = "TP";
      var data = checkName(node.browser, context3);
      var alias = normalizeVersion(data, version);
      if (alias) {
        version = alias;
      } else {
        if (version.indexOf(".") === -1) {
          alias = version + ".0";
        } else {
          alias = version.replace(/\.0$/, "");
        }
        alias = normalizeVersion(data, alias);
        if (alias) {
          version = alias;
        } else if (context3.ignoreUnknownVersions) {
          return [];
        } else {
          throw new BrowserslistError(
            "Unknown version " + version + " of " + node.browser
          );
        }
      }
      return [data.name + " " + version];
    }
  },
  browserslist_config: {
    matches: [],
    regexp: /^browserslist config$/i,
    select: function(context3) {
      return browserslist(void 0, context3);
    }
  },
  extends: {
    matches: ["config"],
    regexp: /^extends (.+)$/i,
    select: function(context3, node) {
      return resolve(env.loadQueries(context3, node.config), context3);
    }
  },
  defaults: {
    matches: [],
    regexp: /^defaults$/i,
    select: function(context3) {
      return resolve(browserslist.defaults, context3);
    }
  },
  dead: {
    matches: [],
    regexp: /^dead$/i,
    select: function(context3) {
      var dead = [
        "Baidu >= 0",
        "ie <= 11",
        "ie_mob <= 11",
        "bb <= 10",
        "op_mob <= 12.1",
        "samsung 4"
      ];
      return resolve(dead, context3);
    }
  },
  unknown: {
    matches: [],
    regexp: /^(\w+)$/i,
    select: function(context3, node) {
      if (byName(node.query, context3)) {
        throw new BrowserslistError(
          "Specify versions in Browserslist query for browser " + node.query
        );
      } else {
        throw unknownQuery(node.query);
      }
    }
  }
};
(function() {
  for (var name in agents) {
    var browser2 = agents[name];
    browserslist.data[name] = {
      name,
      versions: normalize$1(agents[name].versions),
      released: normalize$1(agents[name].versions.slice(0, -3)),
      releaseDate: agents[name].release_date
    };
    fillUsage(browserslist.usage.global, name, browser2.usage_global);
    browserslist.versionAliases[name] = {};
    for (var i = 0; i < browser2.versions.length; i++) {
      var full = browser2.versions[i];
      if (!full)
        continue;
      if (full.indexOf("-") !== -1) {
        var interval = full.split("-");
        for (var j = 0; j < interval.length; j++) {
          browserslist.versionAliases[name][interval[j]] = full;
        }
      }
    }
  }
  browserslist.versionAliases.op_mob["59"] = "58";
  browserslist.nodeVersions = jsReleases.map(function(release) {
    return release.version;
  });
})();
const owl_carousel = "";
!function(a, b, c, d) {
  function e(b2, c2) {
    this.settings = null, this.options = a.extend({}, e.Defaults, c2), this.$element = a(b2), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = { time: null, target: null, pointer: null, stage: { start: null, current: null }, direction: null }, this._states = { current: {}, tags: { initializing: ["busy"], animating: ["busy"], dragging: ["interacting"] } }, a.each(["onResize", "onThrottledResize"], a.proxy(function(b3, c3) {
      this._handlers[c3] = a.proxy(this[c3], this);
    }, this)), a.each(e.Plugins, a.proxy(function(a2, b3) {
      this._plugins[a2.charAt(0).toLowerCase() + a2.slice(1)] = new b3(this);
    }, this)), a.each(e.Workers, a.proxy(function(b3, c3) {
      this._pipe.push({ filter: c3.filter, run: a.proxy(c3.run, this) });
    }, this)), this.setup(), this.initialize();
  }
  e.Defaults = { items: 3, loop: false, center: false, rewind: false, checkVisibility: true, mouseDrag: true, touchDrag: true, pullDrag: true, freeDrag: false, margin: 0, stagePadding: 0, merge: false, mergeFit: true, autoWidth: false, startPosition: 0, rtl: false, smartSpeed: 250, fluidSpeed: false, dragEndSpeed: false, responsive: {}, responsiveRefreshRate: 200, responsiveBaseElement: b, fallbackEasing: "swing", slideTransition: "", info: false, nestedItemSelector: false, itemElement: "div", stageElement: "div", refreshClass: "owl-refresh", loadedClass: "owl-loaded", loadingClass: "owl-loading", rtlClass: "owl-rtl", responsiveClass: "owl-responsive", dragClass: "owl-drag", itemClass: "owl-item", stageClass: "owl-stage", stageOuterClass: "owl-stage-outer", grabClass: "owl-grab" }, e.Width = { Default: "default", Inner: "inner", Outer: "outer" }, e.Type = { Event: "event", State: "state" }, e.Plugins = {}, e.Workers = [{ filter: ["width", "settings"], run: function() {
    this._width = this.$element.width();
  } }, { filter: ["width", "items", "settings"], run: function(a2) {
    a2.current = this._items && this._items[this.relative(this._current)];
  } }, { filter: ["items", "settings"], run: function() {
    this.$stage.children(".cloned").remove();
  } }, { filter: ["width", "items", "settings"], run: function(a2) {
    var b2 = this.settings.margin || "", c2 = !this.settings.autoWidth, d2 = this.settings.rtl, e2 = { width: "auto", "margin-left": d2 ? b2 : "", "margin-right": d2 ? "" : b2 };
    !c2 && this.$stage.children().css(e2), a2.css = e2;
  } }, { filter: ["width", "items", "settings"], run: function(a2) {
    var b2 = (this.width() / this.settings.items).toFixed(3) - this.settings.margin, c2 = null, d2 = this._items.length, e2 = !this.settings.autoWidth, f = [];
    for (a2.items = { merge: false, width: b2 }; d2--; )
      c2 = this._mergers[d2], c2 = this.settings.mergeFit && Math.min(c2, this.settings.items) || c2, a2.items.merge = c2 > 1 || a2.items.merge, f[d2] = e2 ? b2 * c2 : this._items[d2].width();
    this._widths = f;
  } }, { filter: ["items", "settings"], run: function() {
    var b2 = [], c2 = this._items, d2 = this.settings, e2 = Math.max(2 * d2.items, 4), f = 2 * Math.ceil(c2.length / 2), g = d2.loop && c2.length ? d2.rewind ? e2 : Math.max(e2, f) : 0, h = "", i = "";
    for (g /= 2; g > 0; )
      b2.push(this.normalize(b2.length / 2, true)), h += c2[b2[b2.length - 1]][0].outerHTML, b2.push(this.normalize(c2.length - 1 - (b2.length - 1) / 2, true)), i = c2[b2[b2.length - 1]][0].outerHTML + i, g -= 1;
    this._clones = b2, a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage);
  } }, { filter: ["width", "items", "settings"], run: function() {
    for (var a2 = this.settings.rtl ? 1 : -1, b2 = this._clones.length + this._items.length, c2 = -1, d2 = 0, e2 = 0, f = []; ++c2 < b2; )
      d2 = f[c2 - 1] || 0, e2 = this._widths[this.relative(c2)] + this.settings.margin, f.push(d2 + e2 * a2);
    this._coordinates = f;
  } }, { filter: ["width", "items", "settings"], run: function() {
    var a2 = this.settings.stagePadding, b2 = this._coordinates, c2 = { width: Math.ceil(Math.abs(b2[b2.length - 1])) + 2 * a2, "padding-left": a2 || "", "padding-right": a2 || "" };
    this.$stage.css(c2);
  } }, { filter: ["width", "items", "settings"], run: function(a2) {
    var b2 = this._coordinates.length, c2 = !this.settings.autoWidth, d2 = this.$stage.children();
    if (c2 && a2.items.merge)
      for (; b2--; )
        a2.css.width = this._widths[this.relative(b2)], d2.eq(b2).css(a2.css);
    else
      c2 && (a2.css.width = a2.items.width, d2.css(a2.css));
  } }, { filter: ["items"], run: function() {
    this._coordinates.length < 1 && this.$stage.removeAttr("style");
  } }, { filter: ["width", "items", "settings"], run: function(a2) {
    a2.current = a2.current ? this.$stage.children().index(a2.current) : 0, a2.current = Math.max(this.minimum(), Math.min(this.maximum(), a2.current)), this.reset(a2.current);
  } }, { filter: ["position"], run: function() {
    this.animate(this.coordinates(this._current));
  } }, { filter: ["width", "position", "items", "settings"], run: function() {
    var a2, b2, c2, d2, e2 = this.settings.rtl ? 1 : -1, f = 2 * this.settings.stagePadding, g = this.coordinates(this.current()) + f, h = g + this.width() * e2, i = [];
    for (c2 = 0, d2 = this._coordinates.length; c2 < d2; c2++)
      a2 = this._coordinates[c2 - 1] || 0, b2 = Math.abs(this._coordinates[c2]) + f * e2, (this.op(a2, "<=", g) && this.op(a2, ">", h) || this.op(b2, "<", g) && this.op(b2, ">", h)) && i.push(c2);
    this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center");
  } }], e.prototype.initializeStage = function() {
    this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ">", { class: this.settings.stageClass }).wrap(a("<div/>", { class: this.settings.stageOuterClass })), this.$element.append(this.$stage.parent()));
  }, e.prototype.initializeItems = function() {
    var b2 = this.$element.find(".owl-item");
    if (b2.length)
      return this._items = b2.get().map(function(b3) {
        return a(b3);
      }), this._mergers = this._items.map(function() {
        return 1;
      }), void this.refresh();
    this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass);
  }, e.prototype.initialize = function() {
    if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
      var a2, b2, c2;
      a2 = this.$element.find("img"), b2 = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, c2 = this.$element.children(b2).width(), a2.length && c2 <= 0 && this.preloadAutoWidthImages(a2);
    }
    this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized");
  }, e.prototype.isVisible = function() {
    return !this.settings.checkVisibility || this.$element.is(":visible");
  }, e.prototype.setup = function() {
    var b2 = this.viewport(), c2 = this.options.responsive, d2 = -1, e2 = null;
    c2 ? (a.each(c2, function(a2) {
      a2 <= b2 && a2 > d2 && (d2 = Number(a2));
    }), e2 = a.extend({}, this.options, c2[d2]), "function" == typeof e2.stagePadding && (e2.stagePadding = e2.stagePadding()), delete e2.responsive, e2.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d2))) : e2 = a.extend({}, this.options), this.trigger("change", { property: { name: "settings", value: e2 } }), this._breakpoint = d2, this.settings = e2, this.invalidate("settings"), this.trigger("changed", { property: { name: "settings", value: this.settings } });
  }, e.prototype.optionsLogic = function() {
    this.settings.autoWidth && (this.settings.stagePadding = false, this.settings.merge = false);
  }, e.prototype.prepare = function(b2) {
    var c2 = this.trigger("prepare", { content: b2 });
    return c2.data || (c2.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b2)), this.trigger("prepared", { content: c2.data }), c2.data;
  }, e.prototype.update = function() {
    for (var b2 = 0, c2 = this._pipe.length, d2 = a.proxy(function(a2) {
      return this[a2];
    }, this._invalidated), e2 = {}; b2 < c2; )
      (this._invalidated.all || a.grep(this._pipe[b2].filter, d2).length > 0) && this._pipe[b2].run(e2), b2++;
    this._invalidated = {}, !this.is("valid") && this.enter("valid");
  }, e.prototype.width = function(a2) {
    switch (a2 = a2 || e.Width.Default) {
      case e.Width.Inner:
      case e.Width.Outer:
        return this._width;
      default:
        return this._width - 2 * this.settings.stagePadding + this.settings.margin;
    }
  }, e.prototype.refresh = function() {
    this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed");
  }, e.prototype.onThrottledResize = function() {
    b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate);
  }, e.prototype.onResize = function() {
    return !!this._items.length && (this._width !== this.$element.width() && (!!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), false) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))));
  }, e.prototype.registerEventHandlers = function() {
    a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)), false !== this.settings.responsive && this.on(b, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function() {
      return false;
    })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)));
  }, e.prototype.onDragStart = function(b2) {
    var d2 = null;
    3 !== b2.which && (a.support.transform ? (d2 = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d2 = { x: d2[16 === d2.length ? 12 : 4], y: d2[16 === d2.length ? 13 : 5] }) : (d2 = this.$stage.position(), d2 = { x: this.settings.rtl ? d2.left + this.$stage.width() - this.width() + this.settings.margin : d2.left, y: d2.top }), this.is("animating") && (a.support.transform ? this.animate(d2.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b2.type), this.speed(0), this._drag.time = (/* @__PURE__ */ new Date()).getTime(), this._drag.target = a(b2.target), this._drag.stage.start = d2, this._drag.stage.current = d2, this._drag.pointer = this.pointer(b2), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function(b3) {
      var d3 = this.difference(this._drag.pointer, this.pointer(b3));
      a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), Math.abs(d3.x) < Math.abs(d3.y) && this.is("valid") || (b3.preventDefault(), this.enter("dragging"), this.trigger("drag"));
    }, this)));
  }, e.prototype.onDragMove = function(a2) {
    var b2 = null, c2 = null, d2 = null, e2 = this.difference(this._drag.pointer, this.pointer(a2)), f = this.difference(this._drag.stage.start, e2);
    this.is("dragging") && (a2.preventDefault(), this.settings.loop ? (b2 = this.coordinates(this.minimum()), c2 = this.coordinates(this.maximum() + 1) - b2, f.x = ((f.x - b2) % c2 + c2) % c2 + b2) : (b2 = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), c2 = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), d2 = this.settings.pullDrag ? -1 * e2.x / 5 : 0, f.x = Math.max(Math.min(f.x, b2 + d2), c2 + d2)), this._drag.stage.current = f, this.animate(f.x));
  }, e.prototype.onDragEnd = function(b2) {
    var d2 = this.difference(this._drag.pointer, this.pointer(b2)), e2 = this._drag.stage.current, f = d2.x > 0 ^ this.settings.rtl ? "left" : "right";
    a(c).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== d2.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e2.x, 0 !== d2.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d2.x) > 3 || (/* @__PURE__ */ new Date()).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function() {
      return false;
    })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"));
  }, e.prototype.closest = function(b2, c2) {
    var e2 = -1, f = 30, g = this.width(), h = this.coordinates();
    return this.settings.freeDrag || a.each(h, a.proxy(function(a2, i) {
      return "left" === c2 && b2 > i - f && b2 < i + f ? e2 = a2 : "right" === c2 && b2 > i - g - f && b2 < i - g + f ? e2 = a2 + 1 : this.op(b2, "<", i) && this.op(b2, ">", h[a2 + 1] !== d ? h[a2 + 1] : i - g) && (e2 = "left" === c2 ? a2 + 1 : a2), -1 === e2;
    }, this)), this.settings.loop || (this.op(b2, ">", h[this.minimum()]) ? e2 = b2 = this.minimum() : this.op(b2, "<", h[this.maximum()]) && (e2 = b2 = this.maximum())), e2;
  }, e.prototype.animate = function(b2) {
    var c2 = this.speed() > 0;
    this.is("animating") && this.onTransitionEnd(), c2 && (this.enter("animating"), this.trigger("translate")), a.support.transform3d && a.support.transition ? this.$stage.css({ transform: "translate3d(" + b2 + "px,0px,0px)", transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "") }) : c2 ? this.$stage.animate({ left: b2 + "px" }, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({ left: b2 + "px" });
  }, e.prototype.is = function(a2) {
    return this._states.current[a2] && this._states.current[a2] > 0;
  }, e.prototype.current = function(a2) {
    if (a2 === d)
      return this._current;
    if (0 === this._items.length)
      return d;
    if (a2 = this.normalize(a2), this._current !== a2) {
      var b2 = this.trigger("change", { property: { name: "position", value: a2 } });
      b2.data !== d && (a2 = this.normalize(b2.data)), this._current = a2, this.invalidate("position"), this.trigger("changed", { property: { name: "position", value: this._current } });
    }
    return this._current;
  }, e.prototype.invalidate = function(b2) {
    return "string" === a.type(b2) && (this._invalidated[b2] = true, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function(a2, b3) {
      return b3;
    });
  }, e.prototype.reset = function(a2) {
    (a2 = this.normalize(a2)) !== d && (this._speed = 0, this._current = a2, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a2)), this.release(["translate", "translated"]));
  }, e.prototype.normalize = function(a2, b2) {
    var c2 = this._items.length, e2 = b2 ? 0 : this._clones.length;
    return !this.isNumeric(a2) || c2 < 1 ? a2 = d : (a2 < 0 || a2 >= c2 + e2) && (a2 = ((a2 - e2 / 2) % c2 + c2) % c2 + e2 / 2), a2;
  }, e.prototype.relative = function(a2) {
    return a2 -= this._clones.length / 2, this.normalize(a2, true);
  }, e.prototype.maximum = function(a2) {
    var b2, c2, d2, e2 = this.settings, f = this._coordinates.length;
    if (e2.loop)
      f = this._clones.length / 2 + this._items.length - 1;
    else if (e2.autoWidth || e2.merge) {
      if (b2 = this._items.length)
        for (c2 = this._items[--b2].width(), d2 = this.$element.width(); b2-- && !((c2 += this._items[b2].width() + this.settings.margin) > d2); )
          ;
      f = b2 + 1;
    } else
      f = e2.center ? this._items.length - 1 : this._items.length - e2.items;
    return a2 && (f -= this._clones.length / 2), Math.max(f, 0);
  }, e.prototype.minimum = function(a2) {
    return a2 ? 0 : this._clones.length / 2;
  }, e.prototype.items = function(a2) {
    return a2 === d ? this._items.slice() : (a2 = this.normalize(a2, true), this._items[a2]);
  }, e.prototype.mergers = function(a2) {
    return a2 === d ? this._mergers.slice() : (a2 = this.normalize(a2, true), this._mergers[a2]);
  }, e.prototype.clones = function(b2) {
    var c2 = this._clones.length / 2, e2 = c2 + this._items.length, f = function(a2) {
      return a2 % 2 == 0 ? e2 + a2 / 2 : c2 - (a2 + 1) / 2;
    };
    return b2 === d ? a.map(this._clones, function(a2, b3) {
      return f(b3);
    }) : a.map(this._clones, function(a2, c3) {
      return a2 === b2 ? f(c3) : null;
    });
  }, e.prototype.speed = function(a2) {
    return a2 !== d && (this._speed = a2), this._speed;
  }, e.prototype.coordinates = function(b2) {
    var c2, e2 = 1, f = b2 - 1;
    return b2 === d ? a.map(this._coordinates, a.proxy(function(a2, b3) {
      return this.coordinates(b3);
    }, this)) : (this.settings.center ? (this.settings.rtl && (e2 = -1, f = b2 + 1), c2 = this._coordinates[b2], c2 += (this.width() - c2 + (this._coordinates[f] || 0)) / 2 * e2) : c2 = this._coordinates[f] || 0, c2 = Math.ceil(c2));
  }, e.prototype.duration = function(a2, b2, c2) {
    return 0 === c2 ? 0 : Math.min(Math.max(Math.abs(b2 - a2), 1), 6) * Math.abs(c2 || this.settings.smartSpeed);
  }, e.prototype.to = function(a2, b2) {
    var c2 = this.current(), d2 = null, e2 = a2 - this.relative(c2), f = (e2 > 0) - (e2 < 0), g = this._items.length, h = this.minimum(), i = this.maximum();
    this.settings.loop ? (!this.settings.rewind && Math.abs(e2) > g / 2 && (e2 += -1 * f * g), a2 = c2 + e2, (d2 = ((a2 - h) % g + g) % g + h) !== a2 && d2 - e2 <= i && d2 - e2 > 0 && (c2 = d2 - e2, a2 = d2, this.reset(c2))) : this.settings.rewind ? (i += 1, a2 = (a2 % i + i) % i) : a2 = Math.max(h, Math.min(i, a2)), this.speed(this.duration(c2, a2, b2)), this.current(a2), this.isVisible() && this.update();
  }, e.prototype.next = function(a2) {
    a2 = a2 || false, this.to(this.relative(this.current()) + 1, a2);
  }, e.prototype.prev = function(a2) {
    a2 = a2 || false, this.to(this.relative(this.current()) - 1, a2);
  }, e.prototype.onTransitionEnd = function(a2) {
    if (a2 !== d && (a2.stopPropagation(), (a2.target || a2.srcElement || a2.originalTarget) !== this.$stage.get(0)))
      return false;
    this.leave("animating"), this.trigger("translated");
  }, e.prototype.viewport = function() {
    var d2;
    return this.options.responsiveBaseElement !== b ? d2 = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d2 = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d2 = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d2;
  }, e.prototype.replace = function(b2) {
    this.$stage.empty(), this._items = [], b2 && (b2 = b2 instanceof jQuery ? b2 : a(b2)), this.settings.nestedItemSelector && (b2 = b2.find("." + this.settings.nestedItemSelector)), b2.filter(function() {
      return 1 === this.nodeType;
    }).each(a.proxy(function(a2, b3) {
      b3 = this.prepare(b3), this.$stage.append(b3), this._items.push(b3), this._mergers.push(1 * b3.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1);
    }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items");
  }, e.prototype.add = function(b2, c2) {
    var e2 = this.relative(this._current);
    c2 = c2 === d ? this._items.length : this.normalize(c2, true), b2 = b2 instanceof jQuery ? b2 : a(b2), this.trigger("add", { content: b2, position: c2 }), b2 = this.prepare(b2), 0 === this._items.length || c2 === this._items.length ? (0 === this._items.length && this.$stage.append(b2), 0 !== this._items.length && this._items[c2 - 1].after(b2), this._items.push(b2), this._mergers.push(1 * b2.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[c2].before(b2), this._items.splice(c2, 0, b2), this._mergers.splice(c2, 0, 1 * b2.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[e2] && this.reset(this._items[e2].index()), this.invalidate("items"), this.trigger("added", { content: b2, position: c2 });
  }, e.prototype.remove = function(a2) {
    (a2 = this.normalize(a2, true)) !== d && (this.trigger("remove", { content: this._items[a2], position: a2 }), this._items[a2].remove(), this._items.splice(a2, 1), this._mergers.splice(a2, 1), this.invalidate("items"), this.trigger("removed", { content: null, position: a2 }));
  }, e.prototype.preloadAutoWidthImages = function(b2) {
    b2.each(a.proxy(function(b3, c2) {
      this.enter("pre-loading"), c2 = a(c2), a(new Image()).one("load", a.proxy(function(a2) {
        c2.attr("src", a2.target.src), c2.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh();
      }, this)).attr("src", c2.attr("src") || c2.attr("data-src") || c2.attr("data-src-retina"));
    }, this));
  }, e.prototype.destroy = function() {
    this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), false !== this.settings.responsive && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
    for (var d2 in this._plugins)
      this._plugins[d2].destroy();
    this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel");
  }, e.prototype.op = function(a2, b2, c2) {
    var d2 = this.settings.rtl;
    switch (b2) {
      case "<":
        return d2 ? a2 > c2 : a2 < c2;
      case ">":
        return d2 ? a2 < c2 : a2 > c2;
      case ">=":
        return d2 ? a2 <= c2 : a2 >= c2;
      case "<=":
        return d2 ? a2 >= c2 : a2 <= c2;
    }
  }, e.prototype.on = function(a2, b2, c2, d2) {
    a2.addEventListener ? a2.addEventListener(b2, c2, d2) : a2.attachEvent && a2.attachEvent("on" + b2, c2);
  }, e.prototype.off = function(a2, b2, c2, d2) {
    a2.removeEventListener ? a2.removeEventListener(b2, c2, d2) : a2.detachEvent && a2.detachEvent("on" + b2, c2);
  }, e.prototype.trigger = function(b2, c2, d2, f, g) {
    var h = { item: { count: this._items.length, index: this.current() } }, i = a.camelCase(a.grep(["on", b2, d2], function(a2) {
      return a2;
    }).join("-").toLowerCase()), j = a.Event([b2, "owl", d2 || "carousel"].join(".").toLowerCase(), a.extend({ relatedTarget: this }, h, c2));
    return this._supress[b2] || (a.each(this._plugins, function(a2, b3) {
      b3.onTrigger && b3.onTrigger(j);
    }), this.register({ type: e.Type.Event, name: b2 }), this.$element.trigger(j), this.settings && "function" == typeof this.settings[i] && this.settings[i].call(this, j)), j;
  }, e.prototype.enter = function(b2) {
    a.each([b2].concat(this._states.tags[b2] || []), a.proxy(function(a2, b3) {
      this._states.current[b3] === d && (this._states.current[b3] = 0), this._states.current[b3]++;
    }, this));
  }, e.prototype.leave = function(b2) {
    a.each([b2].concat(this._states.tags[b2] || []), a.proxy(function(a2, b3) {
      this._states.current[b3]--;
    }, this));
  }, e.prototype.register = function(b2) {
    if (b2.type === e.Type.Event) {
      if (a.event.special[b2.name] || (a.event.special[b2.name] = {}), !a.event.special[b2.name].owl) {
        var c2 = a.event.special[b2.name]._default;
        a.event.special[b2.name]._default = function(a2) {
          return !c2 || !c2.apply || a2.namespace && -1 !== a2.namespace.indexOf("owl") ? a2.namespace && a2.namespace.indexOf("owl") > -1 : c2.apply(this, arguments);
        }, a.event.special[b2.name].owl = true;
      }
    } else
      b2.type === e.Type.State && (this._states.tags[b2.name] ? this._states.tags[b2.name] = this._states.tags[b2.name].concat(b2.tags) : this._states.tags[b2.name] = b2.tags, this._states.tags[b2.name] = a.grep(this._states.tags[b2.name], a.proxy(function(c3, d2) {
        return a.inArray(c3, this._states.tags[b2.name]) === d2;
      }, this)));
  }, e.prototype.suppress = function(b2) {
    a.each(b2, a.proxy(function(a2, b3) {
      this._supress[b3] = true;
    }, this));
  }, e.prototype.release = function(b2) {
    a.each(b2, a.proxy(function(a2, b3) {
      delete this._supress[b3];
    }, this));
  }, e.prototype.pointer = function(a2) {
    var c2 = { x: null, y: null };
    return a2 = a2.originalEvent || a2 || b.event, a2 = a2.touches && a2.touches.length ? a2.touches[0] : a2.changedTouches && a2.changedTouches.length ? a2.changedTouches[0] : a2, a2.pageX ? (c2.x = a2.pageX, c2.y = a2.pageY) : (c2.x = a2.clientX, c2.y = a2.clientY), c2;
  }, e.prototype.isNumeric = function(a2) {
    return !isNaN(parseFloat(a2));
  }, e.prototype.difference = function(a2, b2) {
    return { x: a2.x - b2.x, y: a2.y - b2.y };
  }, a.fn.owlCarousel = function(b2) {
    var c2 = Array.prototype.slice.call(arguments, 1);
    return this.each(function() {
      var d2 = a(this), f = d2.data("owl.carousel");
      f || (f = new e(this, "object" == typeof b2 && b2), d2.data("owl.carousel", f), a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function(b3, c3) {
        f.register({ type: e.Type.Event, name: c3 }), f.$element.on(c3 + ".owl.carousel.core", a.proxy(function(a2) {
          a2.namespace && a2.relatedTarget !== this && (this.suppress([c3]), f[c3].apply(this, [].slice.call(arguments, 1)), this.release([c3]));
        }, f));
      })), "string" == typeof b2 && "_" !== b2.charAt(0) && f[b2].apply(f, c2);
    });
  }, a.fn.owlCarousel.Constructor = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
  var e = function(b2) {
    this._core = b2, this._interval = null, this._visible = null, this._handlers = { "initialized.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.settings.autoRefresh && this.watch();
    }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers);
  };
  e.Defaults = { autoRefresh: true, autoRefreshInterval: 500 }, e.prototype.watch = function() {
    this._interval || (this._visible = this._core.isVisible(), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval));
  }, e.prototype.refresh = function() {
    this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh());
  }, e.prototype.destroy = function() {
    var a2, c2;
    b.clearInterval(this._interval);
    for (a2 in this._handlers)
      this._core.$element.off(a2, this._handlers[a2]);
    for (c2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[c2] && (this[c2] = null);
  }, a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e;
}(window.Zepto || window.jQuery, window), function(a, b, c, d) {
  var e = function(b2) {
    this._core = b2, this._loaded = [], this._handlers = { "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function(b3) {
      if (b3.namespace && this._core.settings && this._core.settings.lazyLoad && (b3.property && "position" == b3.property.name || "initialized" == b3.type)) {
        var c2 = this._core.settings, e2 = c2.center && Math.ceil(c2.items / 2) || c2.items, f = c2.center && -1 * e2 || 0, g = (b3.property && b3.property.value !== d ? b3.property.value : this._core.current()) + f, h = this._core.clones().length, i = a.proxy(function(a2, b4) {
          this.load(b4);
        }, this);
        for (c2.lazyLoadEager > 0 && (e2 += c2.lazyLoadEager, c2.loop && (g -= c2.lazyLoadEager, e2++)); f++ < e2; )
          this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++;
      }
    }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers);
  };
  e.Defaults = { lazyLoad: false, lazyLoadEager: 0 }, e.prototype.load = function(c2) {
    var d2 = this._core.$stage.children().eq(c2), e2 = d2 && d2.find(".owl-lazy");
    !e2 || a.inArray(d2.get(0), this._loaded) > -1 || (e2.each(a.proxy(function(c3, d3) {
      var e3, f = a(d3), g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src") || f.attr("data-srcset");
      this._core.trigger("load", { element: f, url: g }, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function() {
        f.css("opacity", 1), this._core.trigger("loaded", { element: f, url: g }, "lazy");
      }, this)).attr("src", g) : f.is("source") ? f.one("load.owl.lazy", a.proxy(function() {
        this._core.trigger("loaded", { element: f, url: g }, "lazy");
      }, this)).attr("srcset", g) : (e3 = new Image(), e3.onload = a.proxy(function() {
        f.css({ "background-image": 'url("' + g + '")', opacity: "1" }), this._core.trigger("loaded", { element: f, url: g }, "lazy");
      }, this), e3.src = g);
    }, this)), this._loaded.push(d2.get(0)));
  }, e.prototype.destroy = function() {
    var a2, b2;
    for (a2 in this.handlers)
      this._core.$element.off(a2, this.handlers[a2]);
    for (b2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[b2] && (this[b2] = null);
  }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e;
}(window.Zepto || window.jQuery, window), function(a, b, c, d) {
  var e = function(c2) {
    this._core = c2, this._previousHeight = null, this._handlers = { "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.settings.autoHeight && this.update();
    }, this), "changed.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.settings.autoHeight && "position" === a2.property.name && this.update();
    }, this), "loaded.owl.lazy": a.proxy(function(a2) {
      a2.namespace && this._core.settings.autoHeight && a2.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update();
    }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null;
    var d2 = this;
    a(b).on("load", function() {
      d2._core.settings.autoHeight && d2.update();
    }), a(b).resize(function() {
      d2._core.settings.autoHeight && (null != d2._intervalId && clearTimeout(d2._intervalId), d2._intervalId = setTimeout(function() {
        d2.update();
      }, 250));
    });
  };
  e.Defaults = { autoHeight: false, autoHeightClass: "owl-height" }, e.prototype.update = function() {
    var b2 = this._core._current, c2 = b2 + this._core.settings.items, d2 = this._core.settings.lazyLoad, e2 = this._core.$stage.children().toArray().slice(b2, c2), f = [], g = 0;
    a.each(e2, function(b3, c3) {
      f.push(a(c3).height());
    }), g = Math.max.apply(null, f), g <= 1 && d2 && this._previousHeight && (g = this._previousHeight), this._previousHeight = g, this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass);
  }, e.prototype.destroy = function() {
    var a2, b2;
    for (a2 in this._handlers)
      this._core.$element.off(a2, this._handlers[a2]);
    for (b2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[b2] && (this[b2] = null);
  }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e;
}(window.Zepto || window.jQuery, window), function(a, b, c, d) {
  var e = function(b2) {
    this._core = b2, this._videos = {}, this._playing = null, this._handlers = { "initialized.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.register({ type: "state", name: "playing", tags: ["interacting"] });
    }, this), "resize.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.settings.video && this.isInFullScreen() && a2.preventDefault();
    }, this), "refreshed.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove();
    }, this), "changed.owl.carousel": a.proxy(function(a2) {
      a2.namespace && "position" === a2.property.name && this._playing && this.stop();
    }, this), "prepared.owl.carousel": a.proxy(function(b3) {
      if (b3.namespace) {
        var c2 = a(b3.content).find(".owl-video");
        c2.length && (c2.css("display", "none"), this.fetch(c2, a(b3.content)));
      }
    }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function(a2) {
      this.play(a2);
    }, this));
  };
  e.Defaults = { video: false, videoHeight: false, videoWidth: false }, e.prototype.fetch = function(a2, b2) {
    var c2 = function() {
      return a2.attr("data-vimeo-id") ? "vimeo" : a2.attr("data-vzaar-id") ? "vzaar" : "youtube";
    }(), d2 = a2.attr("data-vimeo-id") || a2.attr("data-youtube-id") || a2.attr("data-vzaar-id"), e2 = a2.attr("data-width") || this._core.settings.videoWidth, f = a2.attr("data-height") || this._core.settings.videoHeight, g = a2.attr("href");
    if (!g)
      throw new Error("Missing video URL.");
    if (d2 = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d2[3].indexOf("youtu") > -1)
      c2 = "youtube";
    else if (d2[3].indexOf("vimeo") > -1)
      c2 = "vimeo";
    else {
      if (!(d2[3].indexOf("vzaar") > -1))
        throw new Error("Video URL not supported.");
      c2 = "vzaar";
    }
    d2 = d2[6], this._videos[g] = { type: c2, id: d2, width: e2, height: f }, b2.attr("data-video", g), this.thumbnail(a2, this._videos[g]);
  }, e.prototype.thumbnail = function(b2, c2) {
    var d2, e2, f, g = c2.width && c2.height ? "width:" + c2.width + "px;height:" + c2.height + "px;" : "", h = b2.find("img"), i = "src", j = "", k = this._core.settings, l = function(c3) {
      e2 = '<div class="owl-video-play-icon"></div>', d2 = k.lazyLoad ? a("<div/>", { class: "owl-video-tn " + j, srcType: c3 }) : a("<div/>", { class: "owl-video-tn", style: "opacity:1;background-image:url(" + c3 + ")" }), b2.after(d2), b2.after(e2);
    };
    if (b2.wrap(a("<div/>", { class: "owl-video-wrapper", style: g })), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length)
      return l(h.attr(i)), h.remove(), false;
    "youtube" === c2.type ? (f = "//img.youtube.com/vi/" + c2.id + "/hqdefault.jpg", l(f)) : "vimeo" === c2.type ? a.ajax({ type: "GET", url: "//vimeo.com/api/v2/video/" + c2.id + ".json", jsonp: "callback", dataType: "jsonp", success: function(a2) {
      f = a2[0].thumbnail_large, l(f);
    } }) : "vzaar" === c2.type && a.ajax({ type: "GET", url: "//vzaar.com/api/videos/" + c2.id + ".json", jsonp: "callback", dataType: "jsonp", success: function(a2) {
      f = a2.framegrab_url, l(f);
    } });
  }, e.prototype.stop = function() {
    this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video");
  }, e.prototype.play = function(b2) {
    var c2, d2 = a(b2.target), e2 = d2.closest("." + this._core.settings.itemClass), f = this._videos[e2.attr("data-video")], g = f.width || "100%", h = f.height || this._core.$stage.height();
    this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e2 = this._core.items(this._core.relative(e2.index())), this._core.reset(e2.index()), c2 = a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'), c2.attr("height", h), c2.attr("width", g), "youtube" === f.type ? c2.attr("src", "//www.youtube.com/embed/" + f.id + "?autoplay=1&rel=0&v=" + f.id) : "vimeo" === f.type ? c2.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1") : "vzaar" === f.type && c2.attr("src", "//view.vzaar.com/" + f.id + "/player?autoplay=true"), a(c2).wrap('<div class="owl-video-frame" />').insertAfter(e2.find(".owl-video")), this._playing = e2.addClass("owl-video-playing"));
  }, e.prototype.isInFullScreen = function() {
    var b2 = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
    return b2 && a(b2).parent().hasClass("owl-video-frame");
  }, e.prototype.destroy = function() {
    var a2, b2;
    this._core.$element.off("click.owl.video");
    for (a2 in this._handlers)
      this._core.$element.off(a2, this._handlers[a2]);
    for (b2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[b2] && (this[b2] = null);
  }, a.fn.owlCarousel.Constructor.Plugins.Video = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
  var e = function(b2) {
    this.core = b2, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = true, this.previous = d, this.next = d, this.handlers = { "change.owl.carousel": a.proxy(function(a2) {
      a2.namespace && "position" == a2.property.name && (this.previous = this.core.current(), this.next = a2.property.value);
    }, this), "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function(a2) {
      a2.namespace && (this.swapping = "translated" == a2.type);
    }, this), "translate.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap();
    }, this) }, this.core.$element.on(this.handlers);
  };
  e.Defaults = {
    animateOut: false,
    animateIn: false
  }, e.prototype.swap = function() {
    if (1 === this.core.settings.items && a.support.animation && a.support.transition) {
      this.core.speed(0);
      var b2, c2 = a.proxy(this.clear, this), d2 = this.core.$stage.children().eq(this.previous), e2 = this.core.$stage.children().eq(this.next), f = this.core.settings.animateIn, g = this.core.settings.animateOut;
      this.core.current() !== this.previous && (g && (b2 = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d2.one(a.support.animation.end, c2).css({ left: b2 + "px" }).addClass("animated owl-animated-out").addClass(g)), f && e2.one(a.support.animation.end, c2).addClass("animated owl-animated-in").addClass(f));
    }
  }, e.prototype.clear = function(b2) {
    a(b2.target).css({ left: "" }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd();
  }, e.prototype.destroy = function() {
    var a2, b2;
    for (a2 in this.handlers)
      this.core.$element.off(a2, this.handlers[a2]);
    for (b2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[b2] && (this[b2] = null);
  }, a.fn.owlCarousel.Constructor.Plugins.Animate = e;
}(window.Zepto || window.jQuery), function(a, b, c, d) {
  var e = function(b2) {
    this._core = b2, this._call = null, this._time = 0, this._timeout = 0, this._paused = true, this._handlers = { "changed.owl.carousel": a.proxy(function(a2) {
      a2.namespace && "settings" === a2.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a2.namespace && "position" === a2.property.name && this._paused && (this._time = 0);
    }, this), "initialized.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.settings.autoplay && this.play();
    }, this), "play.owl.autoplay": a.proxy(function(a2, b3, c2) {
      a2.namespace && this.play(b3, c2);
    }, this), "stop.owl.autoplay": a.proxy(function(a2) {
      a2.namespace && this.stop();
    }, this), "mouseover.owl.autoplay": a.proxy(function() {
      this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
    }, this), "mouseleave.owl.autoplay": a.proxy(function() {
      this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play();
    }, this), "touchstart.owl.core": a.proxy(function() {
      this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause();
    }, this), "touchend.owl.core": a.proxy(function() {
      this._core.settings.autoplayHoverPause && this.play();
    }, this) }, this._core.$element.on(this._handlers), this._core.options = a.extend({}, e.Defaults, this._core.options);
  };
  e.Defaults = { autoplay: false, autoplayTimeout: 5e3, autoplayHoverPause: false, autoplaySpeed: false }, e.prototype._next = function(d2) {
    this._call = b.setTimeout(a.proxy(this._next, this, d2), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || c.hidden || this._core.next(d2 || this._core.settings.autoplaySpeed);
  }, e.prototype.read = function() {
    return (/* @__PURE__ */ new Date()).getTime() - this._time;
  }, e.prototype.play = function(c2, d2) {
    var e2;
    this._core.is("rotating") || this._core.enter("rotating"), c2 = c2 || this._core.settings.autoplayTimeout, e2 = Math.min(this._time % (this._timeout || c2), c2), this._paused ? (this._time = this.read(), this._paused = false) : b.clearTimeout(this._call), this._time += this.read() % c2 - e2, this._timeout = c2, this._call = b.setTimeout(a.proxy(this._next, this, d2), c2 - e2);
  }, e.prototype.stop = function() {
    this._core.is("rotating") && (this._time = 0, this._paused = true, b.clearTimeout(this._call), this._core.leave("rotating"));
  }, e.prototype.pause = function() {
    this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = true, b.clearTimeout(this._call));
  }, e.prototype.destroy = function() {
    var a2, b2;
    this.stop();
    for (a2 in this._handlers)
      this._core.$element.off(a2, this._handlers[a2]);
    for (b2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[b2] && (this[b2] = null);
  }, a.fn.owlCarousel.Constructor.Plugins.autoplay = e;
}(window.Zepto || window.jQuery, window, document), function(a, b, c, d) {
  var e = function(b2) {
    this._core = b2, this._initialized = false, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = { next: this._core.next, prev: this._core.prev, to: this._core.to }, this._handlers = { "prepared.owl.carousel": a.proxy(function(b3) {
      b3.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b3.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>");
    }, this), "added.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.settings.dotsData && this._templates.splice(a2.position, 0, this._templates.pop());
    }, this), "remove.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._core.settings.dotsData && this._templates.splice(a2.position, 1);
    }, this), "changed.owl.carousel": a.proxy(function(a2) {
      a2.namespace && "position" == a2.property.name && this.draw();
    }, this), "initialized.owl.carousel": a.proxy(function(a2) {
      a2.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = true, this._core.trigger("initialized", null, "navigation"));
    }, this), "refreshed.owl.carousel": a.proxy(function(a2) {
      a2.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"));
    }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers);
  };
  e.Defaults = { nav: false, navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'], navSpeed: false, navElement: 'button type="button" role="presentation"', navContainer: false, navContainerClass: "owl-nav", navClass: ["owl-prev", "owl-next"], slideBy: 1, dotClass: "owl-dot", dotsClass: "owl-dots", dots: true, dotsEach: false, dotsData: false, dotsSpeed: false, dotsContainer: false }, e.prototype.initialize = function() {
    var b2, c2 = this._core.settings;
    this._controls.$relative = (c2.navContainer ? a(c2.navContainer) : a("<div>").addClass(c2.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c2.navElement + ">").addClass(c2.navClass[0]).html(c2.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function(a2) {
      this.prev(c2.navSpeed);
    }, this)), this._controls.$next = a("<" + c2.navElement + ">").addClass(c2.navClass[1]).html(c2.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function(a2) {
      this.next(c2.navSpeed);
    }, this)), c2.dotsData || (this._templates = [a('<button role="button">').addClass(c2.dotClass).append(a("<span>")).prop("outerHTML")]), this._controls.$absolute = (c2.dotsContainer ? a(c2.dotsContainer) : a("<div>").addClass(c2.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", a.proxy(function(b3) {
      var d2 = a(b3.target).parent().is(this._controls.$absolute) ? a(b3.target).index() : a(b3.target).parent().index();
      b3.preventDefault(), this.to(d2, c2.dotsSpeed);
    }, this));
    for (b2 in this._overrides)
      this._core[b2] = a.proxy(this[b2], this);
  }, e.prototype.destroy = function() {
    var a2, b2, c2, d2, e2;
    e2 = this._core.settings;
    for (a2 in this._handlers)
      this.$element.off(a2, this._handlers[a2]);
    for (b2 in this._controls)
      "$relative" === b2 && e2.navContainer ? this._controls[b2].html("") : this._controls[b2].remove();
    for (d2 in this.overides)
      this._core[d2] = this._overrides[d2];
    for (c2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[c2] && (this[c2] = null);
  }, e.prototype.update = function() {
    var a2, b2, d2 = this._core.clones().length / 2, e2 = d2 + this._core.items().length, f = this._core.maximum(true), g = this._core.settings, h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
    if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy)
      for (this._pages = [], a2 = d2, b2 = 0, 0; a2 < e2; a2++) {
        if (b2 >= h || 0 === b2) {
          if (this._pages.push({ start: Math.min(f, a2 - d2), end: a2 - d2 + h - 1 }), Math.min(f, a2 - d2) === f)
            break;
          b2 = 0;
        }
        b2 += this._core.mergers(this._core.relative(a2));
      }
  }, e.prototype.draw = function() {
    var b2, c2 = this._core.settings, d2 = this._core.items().length <= c2.items, e2 = this._core.relative(this._core.current()), f = c2.loop || c2.rewind;
    this._controls.$relative.toggleClass("disabled", !c2.nav || d2), c2.nav && (this._controls.$previous.toggleClass("disabled", !f && e2 <= this._core.minimum(true)), this._controls.$next.toggleClass("disabled", !f && e2 >= this._core.maximum(true))), this._controls.$absolute.toggleClass("disabled", !c2.dots || d2), c2.dots && (b2 = this._pages.length - this._controls.$absolute.children().length, c2.dotsData && 0 !== b2 ? this._controls.$absolute.html(this._templates.join("")) : b2 > 0 ? this._controls.$absolute.append(new Array(b2 + 1).join(this._templates[0])) : b2 < 0 && this._controls.$absolute.children().slice(b2).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"));
  }, e.prototype.onTrigger = function(b2) {
    var c2 = this._core.settings;
    b2.page = { index: a.inArray(this.current(), this._pages), count: this._pages.length, size: c2 && (c2.center || c2.autoWidth || c2.dotsData ? 1 : c2.dotsEach || c2.items) };
  }, e.prototype.current = function() {
    var b2 = this._core.relative(this._core.current());
    return a.grep(this._pages, a.proxy(function(a2, c2) {
      return a2.start <= b2 && a2.end >= b2;
    }, this)).pop();
  }, e.prototype.getPosition = function(b2) {
    var c2, d2, e2 = this._core.settings;
    return "page" == e2.slideBy ? (c2 = a.inArray(this.current(), this._pages), d2 = this._pages.length, b2 ? ++c2 : --c2, c2 = this._pages[(c2 % d2 + d2) % d2].start) : (c2 = this._core.relative(this._core.current()), d2 = this._core.items().length, b2 ? c2 += e2.slideBy : c2 -= e2.slideBy), c2;
  }, e.prototype.next = function(b2) {
    a.proxy(this._overrides.to, this._core)(this.getPosition(true), b2);
  }, e.prototype.prev = function(b2) {
    a.proxy(this._overrides.to, this._core)(this.getPosition(false), b2);
  }, e.prototype.to = function(b2, c2, d2) {
    var e2;
    !d2 && this._pages.length ? (e2 = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b2 % e2 + e2) % e2].start, c2)) : a.proxy(this._overrides.to, this._core)(b2, c2);
  }, a.fn.owlCarousel.Constructor.Plugins.Navigation = e;
}(window.Zepto || window.jQuery), function(a, b, c, d) {
  var e = function(c2) {
    this._core = c2, this._hashes = {}, this.$element = this._core.$element, this._handlers = { "initialized.owl.carousel": a.proxy(function(c3) {
      c3.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation");
    }, this), "prepared.owl.carousel": a.proxy(function(b2) {
      if (b2.namespace) {
        var c3 = a(b2.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
        if (!c3)
          return;
        this._hashes[c3] = b2.content;
      }
    }, this), "changed.owl.carousel": a.proxy(function(c3) {
      if (c3.namespace && "position" === c3.property.name) {
        var d2 = this._core.items(this._core.relative(this._core.current())), e2 = a.map(this._hashes, function(a2, b2) {
          return a2 === d2 ? b2 : null;
        }).join();
        if (!e2 || b.location.hash.slice(1) === e2)
          return;
        b.location.hash = e2;
      }
    }, this) }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function(a2) {
      var c3 = b.location.hash.substring(1), e2 = this._core.$stage.children(), f = this._hashes[c3] && e2.index(this._hashes[c3]);
      f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), false, true);
    }, this));
  };
  e.Defaults = { URLhashListener: false }, e.prototype.destroy = function() {
    var c2, d2;
    a(b).off("hashchange.owl.navigation");
    for (c2 in this._handlers)
      this._core.$element.off(c2, this._handlers[c2]);
    for (d2 in Object.getOwnPropertyNames(this))
      "function" != typeof this[d2] && (this[d2] = null);
  }, a.fn.owlCarousel.Constructor.Plugins.Hash = e;
}(window.Zepto || window.jQuery, window), function(a, b, c, d) {
  function e(b2, c2) {
    var e2 = false, f2 = b2.charAt(0).toUpperCase() + b2.slice(1);
    return a.each((b2 + " " + h.join(f2 + " ") + f2).split(" "), function(a2, b3) {
      if (g[b3] !== d)
        return e2 = !c2 || b3, false;
    }), e2;
  }
  function f(a2) {
    return e(a2, true);
  }
  var g = a("<support>").get(0).style, h = "Webkit Moz O ms".split(" "), i = { transition: { end: { WebkitTransition: "webkitTransitionEnd", MozTransition: "transitionend", OTransition: "oTransitionEnd", transition: "transitionend" } }, animation: { end: { WebkitAnimation: "webkitAnimationEnd", MozAnimation: "animationend", OAnimation: "oAnimationEnd", animation: "animationend" } } }, j = { csstransforms: function() {
    return !!e("transform");
  }, csstransforms3d: function() {
    return !!e("perspective");
  }, csstransitions: function() {
    return !!e("transition");
  }, cssanimations: function() {
    return !!e("animation");
  } };
  j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d());
}(window.Zepto || window.jQuery);
const animate = "";
function _assertThisInitialized(self2) {
  if (self2 === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self2;
}
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}
/*!
 * GSAP 3.12.5
 * https://gsap.com
 *
 * @license Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var _config = {
  autoSleep: 120,
  force3D: "auto",
  nullTargetWarn: 1,
  units: {
    lineHeight: ""
  }
}, _defaults = {
  duration: 0.5,
  overwrite: false,
  delay: 0
}, _suppressOverwrites, _reverting$1, _context, _bigNum$1 = 1e8, _tinyNum = 1 / _bigNum$1, _2PI = Math.PI * 2, _HALF_PI = _2PI / 4, _gsID = 0, _sqrt = Math.sqrt, _cos = Math.cos, _sin = Math.sin, _isString = function _isString2(value) {
  return typeof value === "string";
}, _isFunction = function _isFunction2(value) {
  return typeof value === "function";
}, _isNumber = function _isNumber2(value) {
  return typeof value === "number";
}, _isUndefined = function _isUndefined2(value) {
  return typeof value === "undefined";
}, _isObject = function _isObject2(value) {
  return typeof value === "object";
}, _isNotFalse = function _isNotFalse2(value) {
  return value !== false;
}, _windowExists$1 = function _windowExists() {
  return typeof window !== "undefined";
}, _isFuncOrString = function _isFuncOrString2(value) {
  return _isFunction(value) || _isString(value);
}, _isTypedArray = typeof ArrayBuffer === "function" && ArrayBuffer.isView || function() {
}, _isArray = Array.isArray, _strictNumExp = /(?:-?\.?\d|\.)+/gi, _numExp = /[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g, _numWithUnitExp = /[-+=.]*\d+[.e-]*\d*[a-z%]*/g, _complexStringNumExp = /[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi, _relExp = /[+-]=-?[.\d]+/, _delimitedValueExp = /[^,'"\[\]\s]+/gi, _unitExp = /^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i, _globalTimeline, _win$1, _coreInitted, _doc$1, _globals = {}, _installScope = {}, _coreReady, _install = function _install2(scope) {
  return (_installScope = _merge(scope, _globals)) && gsap;
}, _missingPlugin = function _missingPlugin2(property, value) {
  return console.warn("Invalid property", property, "set to", value, "Missing plugin? gsap.registerPlugin()");
}, _warn = function _warn2(message, suppress) {
  return !suppress && console.warn(message);
}, _addGlobal = function _addGlobal2(name, obj) {
  return name && (_globals[name] = obj) && _installScope && (_installScope[name] = obj) || _globals;
}, _emptyFunc = function _emptyFunc2() {
  return 0;
}, _startAtRevertConfig = {
  suppressEvents: true,
  isStart: true,
  kill: false
}, _revertConfigNoKill = {
  suppressEvents: true,
  kill: false
}, _revertConfig = {
  suppressEvents: true
}, _reservedProps = {}, _lazyTweens = [], _lazyLookup = {}, _lastRenderedFrame, _plugins = {}, _effects = {}, _nextGCFrame = 30, _harnessPlugins = [], _callbackNames = "", _harness = function _harness2(targets) {
  var target = targets[0], harnessPlugin, i;
  _isObject(target) || _isFunction(target) || (targets = [targets]);
  if (!(harnessPlugin = (target._gsap || {}).harness)) {
    i = _harnessPlugins.length;
    while (i-- && !_harnessPlugins[i].targetTest(target)) {
    }
    harnessPlugin = _harnessPlugins[i];
  }
  i = targets.length;
  while (i--) {
    targets[i] && (targets[i]._gsap || (targets[i]._gsap = new GSCache(targets[i], harnessPlugin))) || targets.splice(i, 1);
  }
  return targets;
}, _getCache = function _getCache2(target) {
  return target._gsap || _harness(toArray(target))[0]._gsap;
}, _getProperty = function _getProperty2(target, property, v) {
  return (v = target[property]) && _isFunction(v) ? target[property]() : _isUndefined(v) && target.getAttribute && target.getAttribute(property) || v;
}, _forEachName = function _forEachName2(names, func) {
  return (names = names.split(",")).forEach(func) || names;
}, _round = function _round2(value) {
  return Math.round(value * 1e5) / 1e5 || 0;
}, _roundPrecise = function _roundPrecise2(value) {
  return Math.round(value * 1e7) / 1e7 || 0;
}, _parseRelative = function _parseRelative2(start, value) {
  var operator = value.charAt(0), end = parseFloat(value.substr(2));
  start = parseFloat(start);
  return operator === "+" ? start + end : operator === "-" ? start - end : operator === "*" ? start * end : start / end;
}, _arrayContainsAny = function _arrayContainsAny2(toSearch, toFind) {
  var l = toFind.length, i = 0;
  for (; toSearch.indexOf(toFind[i]) < 0 && ++i < l; ) {
  }
  return i < l;
}, _lazyRender = function _lazyRender2() {
  var l = _lazyTweens.length, a = _lazyTweens.slice(0), i, tween;
  _lazyLookup = {};
  _lazyTweens.length = 0;
  for (i = 0; i < l; i++) {
    tween = a[i];
    tween && tween._lazy && (tween.render(tween._lazy[0], tween._lazy[1], true)._lazy = 0);
  }
}, _lazySafeRender = function _lazySafeRender2(animation, time, suppressEvents, force) {
  _lazyTweens.length && !_reverting$1 && _lazyRender();
  animation.render(time, suppressEvents, force || _reverting$1 && time < 0 && (animation._initted || animation._startAt));
  _lazyTweens.length && !_reverting$1 && _lazyRender();
}, _numericIfPossible = function _numericIfPossible2(value) {
  var n = parseFloat(value);
  return (n || n === 0) && (value + "").match(_delimitedValueExp).length < 2 ? n : _isString(value) ? value.trim() : value;
}, _passThrough = function _passThrough2(p) {
  return p;
}, _setDefaults = function _setDefaults2(obj, defaults3) {
  for (var p in defaults3) {
    p in obj || (obj[p] = defaults3[p]);
  }
  return obj;
}, _setKeyframeDefaults = function _setKeyframeDefaults2(excludeDuration) {
  return function(obj, defaults3) {
    for (var p in defaults3) {
      p in obj || p === "duration" && excludeDuration || p === "ease" || (obj[p] = defaults3[p]);
    }
  };
}, _merge = function _merge2(base, toMerge) {
  for (var p in toMerge) {
    base[p] = toMerge[p];
  }
  return base;
}, _mergeDeep = function _mergeDeep2(base, toMerge) {
  for (var p in toMerge) {
    p !== "__proto__" && p !== "constructor" && p !== "prototype" && (base[p] = _isObject(toMerge[p]) ? _mergeDeep2(base[p] || (base[p] = {}), toMerge[p]) : toMerge[p]);
  }
  return base;
}, _copyExcluding = function _copyExcluding2(obj, excluding) {
  var copy = {}, p;
  for (p in obj) {
    p in excluding || (copy[p] = obj[p]);
  }
  return copy;
}, _inheritDefaults = function _inheritDefaults2(vars) {
  var parent2 = vars.parent || _globalTimeline, func = vars.keyframes ? _setKeyframeDefaults(_isArray(vars.keyframes)) : _setDefaults;
  if (_isNotFalse(vars.inherit)) {
    while (parent2) {
      func(vars, parent2.vars.defaults);
      parent2 = parent2.parent || parent2._dp;
    }
  }
  return vars;
}, _arraysMatch = function _arraysMatch2(a1, a2) {
  var i = a1.length, match = i === a2.length;
  while (match && i-- && a1[i] === a2[i]) {
  }
  return i < 0;
}, _addLinkedListItem = function _addLinkedListItem2(parent2, child, firstProp, lastProp, sortBy) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }
  if (lastProp === void 0) {
    lastProp = "_last";
  }
  var prev2 = parent2[lastProp], t;
  if (sortBy) {
    t = child[sortBy];
    while (prev2 && prev2[sortBy] > t) {
      prev2 = prev2._prev;
    }
  }
  if (prev2) {
    child._next = prev2._next;
    prev2._next = child;
  } else {
    child._next = parent2[firstProp];
    parent2[firstProp] = child;
  }
  if (child._next) {
    child._next._prev = child;
  } else {
    parent2[lastProp] = child;
  }
  child._prev = prev2;
  child.parent = child._dp = parent2;
  return child;
}, _removeLinkedListItem = function _removeLinkedListItem2(parent2, child, firstProp, lastProp) {
  if (firstProp === void 0) {
    firstProp = "_first";
  }
  if (lastProp === void 0) {
    lastProp = "_last";
  }
  var prev2 = child._prev, next2 = child._next;
  if (prev2) {
    prev2._next = next2;
  } else if (parent2[firstProp] === child) {
    parent2[firstProp] = next2;
  }
  if (next2) {
    next2._prev = prev2;
  } else if (parent2[lastProp] === child) {
    parent2[lastProp] = prev2;
  }
  child._next = child._prev = child.parent = null;
}, _removeFromParent = function _removeFromParent2(child, onlyIfParentHasAutoRemove) {
  child.parent && (!onlyIfParentHasAutoRemove || child.parent.autoRemoveChildren) && child.parent.remove && child.parent.remove(child);
  child._act = 0;
}, _uncache = function _uncache2(animation, child) {
  if (animation && (!child || child._end > animation._dur || child._start < 0)) {
    var a = animation;
    while (a) {
      a._dirty = 1;
      a = a.parent;
    }
  }
  return animation;
}, _recacheAncestors = function _recacheAncestors2(animation) {
  var parent2 = animation.parent;
  while (parent2 && parent2.parent) {
    parent2._dirty = 1;
    parent2.totalDuration();
    parent2 = parent2.parent;
  }
  return animation;
}, _rewindStartAt = function _rewindStartAt2(tween, totalTime, suppressEvents, force) {
  return tween._startAt && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween.vars.immediateRender && !tween.vars.autoRevert || tween._startAt.render(totalTime, true, force));
}, _hasNoPausedAncestors = function _hasNoPausedAncestors2(animation) {
  return !animation || animation._ts && _hasNoPausedAncestors2(animation.parent);
}, _elapsedCycleDuration = function _elapsedCycleDuration2(animation) {
  return animation._repeat ? _animationCycle(animation._tTime, animation = animation.duration() + animation._rDelay) * animation : 0;
}, _animationCycle = function _animationCycle2(tTime, cycleDuration) {
  var whole = Math.floor(tTime /= cycleDuration);
  return tTime && whole === tTime ? whole - 1 : whole;
}, _parentToChildTotalTime = function _parentToChildTotalTime2(parentTime, child) {
  return (parentTime - child._start) * child._ts + (child._ts >= 0 ? 0 : child._dirty ? child.totalDuration() : child._tDur);
}, _setEnd = function _setEnd2(animation) {
  return animation._end = _roundPrecise(animation._start + (animation._tDur / Math.abs(animation._ts || animation._rts || _tinyNum) || 0));
}, _alignPlayhead = function _alignPlayhead2(animation, totalTime) {
  var parent2 = animation._dp;
  if (parent2 && parent2.smoothChildTiming && animation._ts) {
    animation._start = _roundPrecise(parent2._time - (animation._ts > 0 ? totalTime / animation._ts : ((animation._dirty ? animation.totalDuration() : animation._tDur) - totalTime) / -animation._ts));
    _setEnd(animation);
    parent2._dirty || _uncache(parent2, animation);
  }
  return animation;
}, _postAddChecks = function _postAddChecks2(timeline2, child) {
  var t;
  if (child._time || !child._dur && child._initted || child._start < timeline2._time && (child._dur || !child.add)) {
    t = _parentToChildTotalTime(timeline2.rawTime(), child);
    if (!child._dur || _clamp(0, child.totalDuration(), t) - child._tTime > _tinyNum) {
      child.render(t, true);
    }
  }
  if (_uncache(timeline2, child)._dp && timeline2._initted && timeline2._time >= timeline2._dur && timeline2._ts) {
    if (timeline2._dur < timeline2.duration()) {
      t = timeline2;
      while (t._dp) {
        t.rawTime() >= 0 && t.totalTime(t._tTime);
        t = t._dp;
      }
    }
    timeline2._zTime = -_tinyNum;
  }
}, _addToTimeline = function _addToTimeline2(timeline2, child, position, skipChecks) {
  child.parent && _removeFromParent(child);
  child._start = _roundPrecise((_isNumber(position) ? position : position || timeline2 !== _globalTimeline ? _parsePosition(timeline2, position, child) : timeline2._time) + child._delay);
  child._end = _roundPrecise(child._start + (child.totalDuration() / Math.abs(child.timeScale()) || 0));
  _addLinkedListItem(timeline2, child, "_first", "_last", timeline2._sort ? "_start" : 0);
  _isFromOrFromStart(child) || (timeline2._recent = child);
  skipChecks || _postAddChecks(timeline2, child);
  timeline2._ts < 0 && _alignPlayhead(timeline2, timeline2._tTime);
  return timeline2;
}, _scrollTrigger = function _scrollTrigger2(animation, trigger2) {
  return (_globals.ScrollTrigger || _missingPlugin("scrollTrigger", trigger2)) && _globals.ScrollTrigger.create(trigger2, animation);
}, _attemptInitTween = function _attemptInitTween2(tween, time, force, suppressEvents, tTime) {
  _initTween(tween, time, tTime);
  if (!tween._initted) {
    return 1;
  }
  if (!force && tween._pt && !_reverting$1 && (tween._dur && tween.vars.lazy !== false || !tween._dur && tween.vars.lazy) && _lastRenderedFrame !== _ticker.frame) {
    _lazyTweens.push(tween);
    tween._lazy = [tTime, suppressEvents];
    return 1;
  }
}, _parentPlayheadIsBeforeStart = function _parentPlayheadIsBeforeStart2(_ref) {
  var parent2 = _ref.parent;
  return parent2 && parent2._ts && parent2._initted && !parent2._lock && (parent2.rawTime() < 0 || _parentPlayheadIsBeforeStart2(parent2));
}, _isFromOrFromStart = function _isFromOrFromStart2(_ref2) {
  var data = _ref2.data;
  return data === "isFromStart" || data === "isStart";
}, _renderZeroDurationTween = function _renderZeroDurationTween2(tween, totalTime, suppressEvents, force) {
  var prevRatio = tween.ratio, ratio = totalTime < 0 || !totalTime && (!tween._start && _parentPlayheadIsBeforeStart(tween) && !(!tween._initted && _isFromOrFromStart(tween)) || (tween._ts < 0 || tween._dp._ts < 0) && !_isFromOrFromStart(tween)) ? 0 : 1, repeatDelay = tween._rDelay, tTime = 0, pt, iteration, prevIteration;
  if (repeatDelay && tween._repeat) {
    tTime = _clamp(0, tween._tDur, totalTime);
    iteration = _animationCycle(tTime, repeatDelay);
    tween._yoyo && iteration & 1 && (ratio = 1 - ratio);
    if (iteration !== _animationCycle(tween._tTime, repeatDelay)) {
      prevRatio = 1 - ratio;
      tween.vars.repeatRefresh && tween._initted && tween.invalidate();
    }
  }
  if (ratio !== prevRatio || _reverting$1 || force || tween._zTime === _tinyNum || !totalTime && tween._zTime) {
    if (!tween._initted && _attemptInitTween(tween, totalTime, force, suppressEvents, tTime)) {
      return;
    }
    prevIteration = tween._zTime;
    tween._zTime = totalTime || (suppressEvents ? _tinyNum : 0);
    suppressEvents || (suppressEvents = totalTime && !prevIteration);
    tween.ratio = ratio;
    tween._from && (ratio = 1 - ratio);
    tween._time = 0;
    tween._tTime = tTime;
    pt = tween._pt;
    while (pt) {
      pt.r(ratio, pt.d);
      pt = pt._next;
    }
    totalTime < 0 && _rewindStartAt(tween, totalTime, suppressEvents, true);
    tween._onUpdate && !suppressEvents && _callback(tween, "onUpdate");
    tTime && tween._repeat && !suppressEvents && tween.parent && _callback(tween, "onRepeat");
    if ((totalTime >= tween._tDur || totalTime < 0) && tween.ratio === ratio) {
      ratio && _removeFromParent(tween, 1);
      if (!suppressEvents && !_reverting$1) {
        _callback(tween, ratio ? "onComplete" : "onReverseComplete", true);
        tween._prom && tween._prom();
      }
    }
  } else if (!tween._zTime) {
    tween._zTime = totalTime;
  }
}, _findNextPauseTween = function _findNextPauseTween2(animation, prevTime, time) {
  var child;
  if (time > prevTime) {
    child = animation._first;
    while (child && child._start <= time) {
      if (child.data === "isPause" && child._start > prevTime) {
        return child;
      }
      child = child._next;
    }
  } else {
    child = animation._last;
    while (child && child._start >= time) {
      if (child.data === "isPause" && child._start < prevTime) {
        return child;
      }
      child = child._prev;
    }
  }
}, _setDuration = function _setDuration2(animation, duration, skipUncache, leavePlayhead) {
  var repeat = animation._repeat, dur = _roundPrecise(duration) || 0, totalProgress = animation._tTime / animation._tDur;
  totalProgress && !leavePlayhead && (animation._time *= dur / animation._dur);
  animation._dur = dur;
  animation._tDur = !repeat ? dur : repeat < 0 ? 1e10 : _roundPrecise(dur * (repeat + 1) + animation._rDelay * repeat);
  totalProgress > 0 && !leavePlayhead && _alignPlayhead(animation, animation._tTime = animation._tDur * totalProgress);
  animation.parent && _setEnd(animation);
  skipUncache || _uncache(animation.parent, animation);
  return animation;
}, _onUpdateTotalDuration = function _onUpdateTotalDuration2(animation) {
  return animation instanceof Timeline ? _uncache(animation) : _setDuration(animation, animation._dur);
}, _zeroPosition = {
  _start: 0,
  endTime: _emptyFunc,
  totalDuration: _emptyFunc
}, _parsePosition = function _parsePosition2(animation, position, percentAnimation) {
  var labels = animation.labels, recent = animation._recent || _zeroPosition, clippedDuration = animation.duration() >= _bigNum$1 ? recent.endTime(false) : animation._dur, i, offset2, isPercent;
  if (_isString(position) && (isNaN(position) || position in labels)) {
    offset2 = position.charAt(0);
    isPercent = position.substr(-1) === "%";
    i = position.indexOf("=");
    if (offset2 === "<" || offset2 === ">") {
      i >= 0 && (position = position.replace(/=/, ""));
      return (offset2 === "<" ? recent._start : recent.endTime(recent._repeat >= 0)) + (parseFloat(position.substr(1)) || 0) * (isPercent ? (i < 0 ? recent : percentAnimation).totalDuration() / 100 : 1);
    }
    if (i < 0) {
      position in labels || (labels[position] = clippedDuration);
      return labels[position];
    }
    offset2 = parseFloat(position.charAt(i - 1) + position.substr(i + 1));
    if (isPercent && percentAnimation) {
      offset2 = offset2 / 100 * (_isArray(percentAnimation) ? percentAnimation[0] : percentAnimation).totalDuration();
    }
    return i > 1 ? _parsePosition2(animation, position.substr(0, i - 1), percentAnimation) + offset2 : clippedDuration + offset2;
  }
  return position == null ? clippedDuration : +position;
}, _createTweenType = function _createTweenType2(type, params, timeline2) {
  var isLegacy = _isNumber(params[1]), varsIndex = (isLegacy ? 2 : 1) + (type < 2 ? 0 : 1), vars = params[varsIndex], irVars, parent2;
  isLegacy && (vars.duration = params[1]);
  vars.parent = timeline2;
  if (type) {
    irVars = vars;
    parent2 = timeline2;
    while (parent2 && !("immediateRender" in irVars)) {
      irVars = parent2.vars.defaults || {};
      parent2 = _isNotFalse(parent2.vars.inherit) && parent2.parent;
    }
    vars.immediateRender = _isNotFalse(irVars.immediateRender);
    type < 2 ? vars.runBackwards = 1 : vars.startAt = params[varsIndex - 1];
  }
  return new Tween(params[0], vars, params[varsIndex + 1]);
}, _conditionalReturn = function _conditionalReturn2(value, func) {
  return value || value === 0 ? func(value) : func;
}, _clamp = function _clamp2(min, max, value) {
  return value < min ? min : value > max ? max : value;
}, getUnit = function getUnit2(value, v) {
  return !_isString(value) || !(v = _unitExp.exec(value)) ? "" : v[1];
}, clamp = function clamp2(min, max, value) {
  return _conditionalReturn(value, function(v) {
    return _clamp(min, max, v);
  });
}, _slice = [].slice, _isArrayLike = function _isArrayLike2(value, nonEmpty) {
  return value && _isObject(value) && "length" in value && (!nonEmpty && !value.length || value.length - 1 in value && _isObject(value[0])) && !value.nodeType && value !== _win$1;
}, _flatten = function _flatten2(ar, leaveStrings, accumulator) {
  if (accumulator === void 0) {
    accumulator = [];
  }
  return ar.forEach(function(value) {
    var _accumulator;
    return _isString(value) && !leaveStrings || _isArrayLike(value, 1) ? (_accumulator = accumulator).push.apply(_accumulator, toArray(value)) : accumulator.push(value);
  }) || accumulator;
}, toArray = function toArray2(value, scope, leaveStrings) {
  return _context && !scope && _context.selector ? _context.selector(value) : _isString(value) && !leaveStrings && (_coreInitted || !_wake()) ? _slice.call((scope || _doc$1).querySelectorAll(value), 0) : _isArray(value) ? _flatten(value, leaveStrings) : _isArrayLike(value) ? _slice.call(value, 0) : value ? [value] : [];
}, selector = function selector2(value) {
  value = toArray(value)[0] || _warn("Invalid scope") || {};
  return function(v) {
    var el = value.current || value.nativeElement || value;
    return toArray(v, el.querySelectorAll ? el : el === value ? _warn("Invalid scope") || _doc$1.createElement("div") : value);
  };
}, shuffle = function shuffle2(a) {
  return a.sort(function() {
    return 0.5 - Math.random();
  });
}, distribute = function distribute2(v) {
  if (_isFunction(v)) {
    return v;
  }
  var vars = _isObject(v) ? v : {
    each: v
  }, ease = _parseEase(vars.ease), from = vars.from || 0, base = parseFloat(vars.base) || 0, cache2 = {}, isDecimal = from > 0 && from < 1, ratios = isNaN(from) || isDecimal, axis = vars.axis, ratioX = from, ratioY = from;
  if (_isString(from)) {
    ratioX = ratioY = {
      center: 0.5,
      edges: 0.5,
      end: 1
    }[from] || 0;
  } else if (!isDecimal && ratios) {
    ratioX = from[0];
    ratioY = from[1];
  }
  return function(i, target, a) {
    var l = (a || vars).length, distances = cache2[l], originX, originY, x, y, d, j, max, min, wrapAt;
    if (!distances) {
      wrapAt = vars.grid === "auto" ? 0 : (vars.grid || [1, _bigNum$1])[1];
      if (!wrapAt) {
        max = -_bigNum$1;
        while (max < (max = a[wrapAt++].getBoundingClientRect().left) && wrapAt < l) {
        }
        wrapAt < l && wrapAt--;
      }
      distances = cache2[l] = [];
      originX = ratios ? Math.min(wrapAt, l) * ratioX - 0.5 : from % wrapAt;
      originY = wrapAt === _bigNum$1 ? 0 : ratios ? l * ratioY / wrapAt - 0.5 : from / wrapAt | 0;
      max = 0;
      min = _bigNum$1;
      for (j = 0; j < l; j++) {
        x = j % wrapAt - originX;
        y = originY - (j / wrapAt | 0);
        distances[j] = d = !axis ? _sqrt(x * x + y * y) : Math.abs(axis === "y" ? y : x);
        d > max && (max = d);
        d < min && (min = d);
      }
      from === "random" && shuffle(distances);
      distances.max = max - min;
      distances.min = min;
      distances.v = l = (parseFloat(vars.amount) || parseFloat(vars.each) * (wrapAt > l ? l - 1 : !axis ? Math.max(wrapAt, l / wrapAt) : axis === "y" ? l / wrapAt : wrapAt) || 0) * (from === "edges" ? -1 : 1);
      distances.b = l < 0 ? base - l : base;
      distances.u = getUnit(vars.amount || vars.each) || 0;
      ease = ease && l < 0 ? _invertEase(ease) : ease;
    }
    l = (distances[i] - distances.min) / distances.max || 0;
    return _roundPrecise(distances.b + (ease ? ease(l) : l) * distances.v) + distances.u;
  };
}, _roundModifier = function _roundModifier2(v) {
  var p = Math.pow(10, ((v + "").split(".")[1] || "").length);
  return function(raw) {
    var n = _roundPrecise(Math.round(parseFloat(raw) / v) * v * p);
    return (n - n % 1) / p + (_isNumber(raw) ? 0 : getUnit(raw));
  };
}, snap = function snap2(snapTo, value) {
  var isArray2 = _isArray(snapTo), radius, is2D;
  if (!isArray2 && _isObject(snapTo)) {
    radius = isArray2 = snapTo.radius || _bigNum$1;
    if (snapTo.values) {
      snapTo = toArray(snapTo.values);
      if (is2D = !_isNumber(snapTo[0])) {
        radius *= radius;
      }
    } else {
      snapTo = _roundModifier(snapTo.increment);
    }
  }
  return _conditionalReturn(value, !isArray2 ? _roundModifier(snapTo) : _isFunction(snapTo) ? function(raw) {
    is2D = snapTo(raw);
    return Math.abs(is2D - raw) <= radius ? is2D : raw;
  } : function(raw) {
    var x = parseFloat(is2D ? raw.x : raw), y = parseFloat(is2D ? raw.y : 0), min = _bigNum$1, closest2 = 0, i = snapTo.length, dx, dy;
    while (i--) {
      if (is2D) {
        dx = snapTo[i].x - x;
        dy = snapTo[i].y - y;
        dx = dx * dx + dy * dy;
      } else {
        dx = Math.abs(snapTo[i] - x);
      }
      if (dx < min) {
        min = dx;
        closest2 = i;
      }
    }
    closest2 = !radius || min <= radius ? snapTo[closest2] : raw;
    return is2D || closest2 === raw || _isNumber(raw) ? closest2 : closest2 + getUnit(raw);
  });
}, random = function random2(min, max, roundingIncrement, returnFunction) {
  return _conditionalReturn(_isArray(min) ? !max : roundingIncrement === true ? !!(roundingIncrement = 0) : !returnFunction, function() {
    return _isArray(min) ? min[~~(Math.random() * min.length)] : (roundingIncrement = roundingIncrement || 1e-5) && (returnFunction = roundingIncrement < 1 ? Math.pow(10, (roundingIncrement + "").length - 2) : 1) && Math.floor(Math.round((min - roundingIncrement / 2 + Math.random() * (max - min + roundingIncrement * 0.99)) / roundingIncrement) * roundingIncrement * returnFunction) / returnFunction;
  });
}, pipe = function pipe2() {
  for (var _len = arguments.length, functions = new Array(_len), _key = 0; _key < _len; _key++) {
    functions[_key] = arguments[_key];
  }
  return function(value) {
    return functions.reduce(function(v, f) {
      return f(v);
    }, value);
  };
}, unitize = function unitize2(func, unit) {
  return function(value) {
    return func(parseFloat(value)) + (unit || getUnit(value));
  };
}, normalize = function normalize2(min, max, value) {
  return mapRange(min, max, 0, 1, value);
}, _wrapArray = function _wrapArray2(a, wrapper, value) {
  return _conditionalReturn(value, function(index2) {
    return a[~~wrapper(index2)];
  });
}, wrap = function wrap2(min, max, value) {
  var range = max - min;
  return _isArray(min) ? _wrapArray(min, wrap2(0, min.length), max) : _conditionalReturn(value, function(value2) {
    return (range + (value2 - min) % range) % range + min;
  });
}, wrapYoyo = function wrapYoyo2(min, max, value) {
  var range = max - min, total = range * 2;
  return _isArray(min) ? _wrapArray(min, wrapYoyo2(0, min.length - 1), max) : _conditionalReturn(value, function(value2) {
    value2 = (total + (value2 - min) % total) % total || 0;
    return min + (value2 > range ? total - value2 : value2);
  });
}, _replaceRandom = function _replaceRandom2(value) {
  var prev2 = 0, s = "", i, nums, end, isArray2;
  while (~(i = value.indexOf("random(", prev2))) {
    end = value.indexOf(")", i);
    isArray2 = value.charAt(i + 7) === "[";
    nums = value.substr(i + 7, end - i - 7).match(isArray2 ? _delimitedValueExp : _strictNumExp);
    s += value.substr(prev2, i - prev2) + random(isArray2 ? nums : +nums[0], isArray2 ? 0 : +nums[1], +nums[2] || 1e-5);
    prev2 = end + 1;
  }
  return s + value.substr(prev2, value.length - prev2);
}, mapRange = function mapRange2(inMin, inMax, outMin, outMax, value) {
  var inRange = inMax - inMin, outRange = outMax - outMin;
  return _conditionalReturn(value, function(value2) {
    return outMin + ((value2 - inMin) / inRange * outRange || 0);
  });
}, interpolate = function interpolate2(start, end, progress, mutate) {
  var func = isNaN(start + end) ? 0 : function(p2) {
    return (1 - p2) * start + p2 * end;
  };
  if (!func) {
    var isString2 = _isString(start), master = {}, p, i, interpolators, l, il;
    progress === true && (mutate = 1) && (progress = null);
    if (isString2) {
      start = {
        p: start
      };
      end = {
        p: end
      };
    } else if (_isArray(start) && !_isArray(end)) {
      interpolators = [];
      l = start.length;
      il = l - 2;
      for (i = 1; i < l; i++) {
        interpolators.push(interpolate2(start[i - 1], start[i]));
      }
      l--;
      func = function func2(p2) {
        p2 *= l;
        var i2 = Math.min(il, ~~p2);
        return interpolators[i2](p2 - i2);
      };
      progress = end;
    } else if (!mutate) {
      start = _merge(_isArray(start) ? [] : {}, start);
    }
    if (!interpolators) {
      for (p in end) {
        _addPropTween.call(master, start, p, "get", end[p]);
      }
      func = function func2(p2) {
        return _renderPropTweens(p2, master) || (isString2 ? start.p : start);
      };
    }
  }
  return _conditionalReturn(progress, func);
}, _getLabelInDirection = function _getLabelInDirection2(timeline2, fromTime, backward) {
  var labels = timeline2.labels, min = _bigNum$1, p, distance, label;
  for (p in labels) {
    distance = labels[p] - fromTime;
    if (distance < 0 === !!backward && distance && min > (distance = Math.abs(distance))) {
      label = p;
      min = distance;
    }
  }
  return label;
}, _callback = function _callback2(animation, type, executeLazyFirst) {
  var v = animation.vars, callback = v[type], prevContext = _context, context3 = animation._ctx, params, scope, result;
  if (!callback) {
    return;
  }
  params = v[type + "Params"];
  scope = v.callbackScope || animation;
  executeLazyFirst && _lazyTweens.length && _lazyRender();
  context3 && (_context = context3);
  result = params ? callback.apply(scope, params) : callback.call(scope);
  _context = prevContext;
  return result;
}, _interrupt = function _interrupt2(animation) {
  _removeFromParent(animation);
  animation.scrollTrigger && animation.scrollTrigger.kill(!!_reverting$1);
  animation.progress() < 1 && _callback(animation, "onInterrupt");
  return animation;
}, _quickTween, _registerPluginQueue = [], _createPlugin = function _createPlugin2(config3) {
  if (!config3)
    return;
  config3 = !config3.name && config3["default"] || config3;
  if (_windowExists$1() || config3.headless) {
    var name = config3.name, isFunc = _isFunction(config3), Plugin = name && !isFunc && config3.init ? function() {
      this._props = [];
    } : config3, instanceDefaults = {
      init: _emptyFunc,
      render: _renderPropTweens,
      add: _addPropTween,
      kill: _killPropTweensOf,
      modifier: _addPluginModifier,
      rawVars: 0
    }, statics = {
      targetTest: 0,
      get: 0,
      getSetter: _getSetter,
      aliases: {},
      register: 0
    };
    _wake();
    if (config3 !== Plugin) {
      if (_plugins[name]) {
        return;
      }
      _setDefaults(Plugin, _setDefaults(_copyExcluding(config3, instanceDefaults), statics));
      _merge(Plugin.prototype, _merge(instanceDefaults, _copyExcluding(config3, statics)));
      _plugins[Plugin.prop = name] = Plugin;
      if (config3.targetTest) {
        _harnessPlugins.push(Plugin);
        _reservedProps[name] = 1;
      }
      name = (name === "css" ? "CSS" : name.charAt(0).toUpperCase() + name.substr(1)) + "Plugin";
    }
    _addGlobal(name, Plugin);
    config3.register && config3.register(gsap, Plugin, PropTween);
  } else {
    _registerPluginQueue.push(config3);
  }
}, _255 = 255, _colorLookup = {
  aqua: [0, _255, _255],
  lime: [0, _255, 0],
  silver: [192, 192, 192],
  black: [0, 0, 0],
  maroon: [128, 0, 0],
  teal: [0, 128, 128],
  blue: [0, 0, _255],
  navy: [0, 0, 128],
  white: [_255, _255, _255],
  olive: [128, 128, 0],
  yellow: [_255, _255, 0],
  orange: [_255, 165, 0],
  gray: [128, 128, 128],
  purple: [128, 0, 128],
  green: [0, 128, 0],
  red: [_255, 0, 0],
  pink: [_255, 192, 203],
  cyan: [0, _255, _255],
  transparent: [_255, _255, _255, 0]
}, _hue = function _hue2(h, m1, m2) {
  h += h < 0 ? 1 : h > 1 ? -1 : 0;
  return (h * 6 < 1 ? m1 + (m2 - m1) * h * 6 : h < 0.5 ? m2 : h * 3 < 2 ? m1 + (m2 - m1) * (2 / 3 - h) * 6 : m1) * _255 + 0.5 | 0;
}, splitColor = function splitColor2(v, toHSL, forceAlpha) {
  var a = !v ? _colorLookup.black : _isNumber(v) ? [v >> 16, v >> 8 & _255, v & _255] : 0, r, g, b, h, s, l, max, min, d, wasHSL;
  if (!a) {
    if (v.substr(-1) === ",") {
      v = v.substr(0, v.length - 1);
    }
    if (_colorLookup[v]) {
      a = _colorLookup[v];
    } else if (v.charAt(0) === "#") {
      if (v.length < 6) {
        r = v.charAt(1);
        g = v.charAt(2);
        b = v.charAt(3);
        v = "#" + r + r + g + g + b + b + (v.length === 5 ? v.charAt(4) + v.charAt(4) : "");
      }
      if (v.length === 9) {
        a = parseInt(v.substr(1, 6), 16);
        return [a >> 16, a >> 8 & _255, a & _255, parseInt(v.substr(7), 16) / 255];
      }
      v = parseInt(v.substr(1), 16);
      a = [v >> 16, v >> 8 & _255, v & _255];
    } else if (v.substr(0, 3) === "hsl") {
      a = wasHSL = v.match(_strictNumExp);
      if (!toHSL) {
        h = +a[0] % 360 / 360;
        s = +a[1] / 100;
        l = +a[2] / 100;
        g = l <= 0.5 ? l * (s + 1) : l + s - l * s;
        r = l * 2 - g;
        a.length > 3 && (a[3] *= 1);
        a[0] = _hue(h + 1 / 3, r, g);
        a[1] = _hue(h, r, g);
        a[2] = _hue(h - 1 / 3, r, g);
      } else if (~v.indexOf("=")) {
        a = v.match(_numExp);
        forceAlpha && a.length < 4 && (a[3] = 1);
        return a;
      }
    } else {
      a = v.match(_strictNumExp) || _colorLookup.transparent;
    }
    a = a.map(Number);
  }
  if (toHSL && !wasHSL) {
    r = a[0] / _255;
    g = a[1] / _255;
    b = a[2] / _255;
    max = Math.max(r, g, b);
    min = Math.min(r, g, b);
    l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      h = max === r ? (g - b) / d + (g < b ? 6 : 0) : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
      h *= 60;
    }
    a[0] = ~~(h + 0.5);
    a[1] = ~~(s * 100 + 0.5);
    a[2] = ~~(l * 100 + 0.5);
  }
  forceAlpha && a.length < 4 && (a[3] = 1);
  return a;
}, _colorOrderData = function _colorOrderData2(v) {
  var values = [], c = [], i = -1;
  v.split(_colorExp).forEach(function(v2) {
    var a = v2.match(_numWithUnitExp) || [];
    values.push.apply(values, a);
    c.push(i += a.length + 1);
  });
  values.c = c;
  return values;
}, _formatColors = function _formatColors2(s, toHSL, orderMatchData) {
  var result = "", colors = (s + result).match(_colorExp), type = toHSL ? "hsla(" : "rgba(", i = 0, c, shell, d, l;
  if (!colors) {
    return s;
  }
  colors = colors.map(function(color) {
    return (color = splitColor(color, toHSL, 1)) && type + (toHSL ? color[0] + "," + color[1] + "%," + color[2] + "%," + color[3] : color.join(",")) + ")";
  });
  if (orderMatchData) {
    d = _colorOrderData(s);
    c = orderMatchData.c;
    if (c.join(result) !== d.c.join(result)) {
      shell = s.replace(_colorExp, "1").split(_numWithUnitExp);
      l = shell.length - 1;
      for (; i < l; i++) {
        result += shell[i] + (~c.indexOf(i) ? colors.shift() || type + "0,0,0,0)" : (d.length ? d : colors.length ? colors : orderMatchData).shift());
      }
    }
  }
  if (!shell) {
    shell = s.split(_colorExp);
    l = shell.length - 1;
    for (; i < l; i++) {
      result += shell[i] + colors[i];
    }
  }
  return result + shell[l];
}, _colorExp = function() {
  var s = "(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b", p;
  for (p in _colorLookup) {
    s += "|" + p + "\\b";
  }
  return new RegExp(s + ")", "gi");
}(), _hslExp = /hsl[a]?\(/, _colorStringFilter = function _colorStringFilter2(a) {
  var combined = a.join(" "), toHSL;
  _colorExp.lastIndex = 0;
  if (_colorExp.test(combined)) {
    toHSL = _hslExp.test(combined);
    a[1] = _formatColors(a[1], toHSL);
    a[0] = _formatColors(a[0], toHSL, _colorOrderData(a[1]));
    return true;
  }
}, _tickerActive, _ticker = function() {
  var _getTime = Date.now, _lagThreshold = 500, _adjustedLag = 33, _startTime = _getTime(), _lastUpdate = _startTime, _gap = 1e3 / 240, _nextTime = _gap, _listeners2 = [], _id, _req, _raf, _self, _delta, _i, _tick = function _tick2(v) {
    var elapsed = _getTime() - _lastUpdate, manual = v === true, overlap, dispatch, time, frame;
    (elapsed > _lagThreshold || elapsed < 0) && (_startTime += elapsed - _adjustedLag);
    _lastUpdate += elapsed;
    time = _lastUpdate - _startTime;
    overlap = time - _nextTime;
    if (overlap > 0 || manual) {
      frame = ++_self.frame;
      _delta = time - _self.time * 1e3;
      _self.time = time = time / 1e3;
      _nextTime += overlap + (overlap >= _gap ? 4 : _gap - overlap);
      dispatch = 1;
    }
    manual || (_id = _req(_tick2));
    if (dispatch) {
      for (_i = 0; _i < _listeners2.length; _i++) {
        _listeners2[_i](time, _delta, frame, v);
      }
    }
  };
  _self = {
    time: 0,
    frame: 0,
    tick: function tick() {
      _tick(true);
    },
    deltaRatio: function deltaRatio(fps) {
      return _delta / (1e3 / (fps || 60));
    },
    wake: function wake() {
      if (_coreReady) {
        if (!_coreInitted && _windowExists$1()) {
          _win$1 = _coreInitted = window;
          _doc$1 = _win$1.document || {};
          _globals.gsap = gsap;
          (_win$1.gsapVersions || (_win$1.gsapVersions = [])).push(gsap.version);
          _install(_installScope || _win$1.GreenSockGlobals || !_win$1.gsap && _win$1 || {});
          _registerPluginQueue.forEach(_createPlugin);
        }
        _raf = typeof requestAnimationFrame !== "undefined" && requestAnimationFrame;
        _id && _self.sleep();
        _req = _raf || function(f) {
          return setTimeout(f, _nextTime - _self.time * 1e3 + 1 | 0);
        };
        _tickerActive = 1;
        _tick(2);
      }
    },
    sleep: function sleep() {
      (_raf ? cancelAnimationFrame : clearTimeout)(_id);
      _tickerActive = 0;
      _req = _emptyFunc;
    },
    lagSmoothing: function lagSmoothing(threshold, adjustedLag) {
      _lagThreshold = threshold || Infinity;
      _adjustedLag = Math.min(adjustedLag || 33, _lagThreshold);
    },
    fps: function fps(_fps) {
      _gap = 1e3 / (_fps || 240);
      _nextTime = _self.time * 1e3 + _gap;
    },
    add: function add(callback, once, prioritize) {
      var func = once ? function(t, d, f, v) {
        callback(t, d, f, v);
        _self.remove(func);
      } : callback;
      _self.remove(callback);
      _listeners2[prioritize ? "unshift" : "push"](func);
      _wake();
      return func;
    },
    remove: function remove2(callback, i) {
      ~(i = _listeners2.indexOf(callback)) && _listeners2.splice(i, 1) && _i >= i && _i--;
    },
    _listeners: _listeners2
  };
  return _self;
}(), _wake = function _wake2() {
  return !_tickerActive && _ticker.wake();
}, _easeMap = {}, _customEaseExp = /^[\d.\-M][\d.\-,\s]/, _quotesExp = /["']/g, _parseObjectInString = function _parseObjectInString2(value) {
  var obj = {}, split = value.substr(1, value.length - 3).split(":"), key = split[0], i = 1, l = split.length, index2, val, parsedVal;
  for (; i < l; i++) {
    val = split[i];
    index2 = i !== l - 1 ? val.lastIndexOf(",") : val.length;
    parsedVal = val.substr(0, index2);
    obj[key] = isNaN(parsedVal) ? parsedVal.replace(_quotesExp, "").trim() : +parsedVal;
    key = val.substr(index2 + 1).trim();
  }
  return obj;
}, _valueInParentheses = function _valueInParentheses2(value) {
  var open = value.indexOf("(") + 1, close = value.indexOf(")"), nested = value.indexOf("(", open);
  return value.substring(open, ~nested && nested < close ? value.indexOf(")", close + 1) : close);
}, _configEaseFromString = function _configEaseFromString2(name) {
  var split = (name + "").split("("), ease = _easeMap[split[0]];
  return ease && split.length > 1 && ease.config ? ease.config.apply(null, ~name.indexOf("{") ? [_parseObjectInString(split[1])] : _valueInParentheses(name).split(",").map(_numericIfPossible)) : _easeMap._CE && _customEaseExp.test(name) ? _easeMap._CE("", name) : ease;
}, _invertEase = function _invertEase2(ease) {
  return function(p) {
    return 1 - ease(1 - p);
  };
}, _propagateYoyoEase = function _propagateYoyoEase2(timeline2, isYoyo) {
  var child = timeline2._first, ease;
  while (child) {
    if (child instanceof Timeline) {
      _propagateYoyoEase2(child, isYoyo);
    } else if (child.vars.yoyoEase && (!child._yoyo || !child._repeat) && child._yoyo !== isYoyo) {
      if (child.timeline) {
        _propagateYoyoEase2(child.timeline, isYoyo);
      } else {
        ease = child._ease;
        child._ease = child._yEase;
        child._yEase = ease;
        child._yoyo = isYoyo;
      }
    }
    child = child._next;
  }
}, _parseEase = function _parseEase2(ease, defaultEase) {
  return !ease ? defaultEase : (_isFunction(ease) ? ease : _easeMap[ease] || _configEaseFromString(ease)) || defaultEase;
}, _insertEase = function _insertEase2(names, easeIn, easeOut, easeInOut) {
  if (easeOut === void 0) {
    easeOut = function easeOut2(p) {
      return 1 - easeIn(1 - p);
    };
  }
  if (easeInOut === void 0) {
    easeInOut = function easeInOut2(p) {
      return p < 0.5 ? easeIn(p * 2) / 2 : 1 - easeIn((1 - p) * 2) / 2;
    };
  }
  var ease = {
    easeIn,
    easeOut,
    easeInOut
  }, lowercaseName;
  _forEachName(names, function(name) {
    _easeMap[name] = _globals[name] = ease;
    _easeMap[lowercaseName = name.toLowerCase()] = easeOut;
    for (var p in ease) {
      _easeMap[lowercaseName + (p === "easeIn" ? ".in" : p === "easeOut" ? ".out" : ".inOut")] = _easeMap[name + "." + p] = ease[p];
    }
  });
  return ease;
}, _easeInOutFromOut = function _easeInOutFromOut2(easeOut) {
  return function(p) {
    return p < 0.5 ? (1 - easeOut(1 - p * 2)) / 2 : 0.5 + easeOut((p - 0.5) * 2) / 2;
  };
}, _configElastic = function _configElastic2(type, amplitude, period) {
  var p1 = amplitude >= 1 ? amplitude : 1, p2 = (period || (type ? 0.3 : 0.45)) / (amplitude < 1 ? amplitude : 1), p3 = p2 / _2PI * (Math.asin(1 / p1) || 0), easeOut = function easeOut2(p) {
    return p === 1 ? 1 : p1 * Math.pow(2, -10 * p) * _sin((p - p3) * p2) + 1;
  }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);
  p2 = _2PI / p2;
  ease.config = function(amplitude2, period2) {
    return _configElastic2(type, amplitude2, period2);
  };
  return ease;
}, _configBack = function _configBack2(type, overshoot) {
  if (overshoot === void 0) {
    overshoot = 1.70158;
  }
  var easeOut = function easeOut2(p) {
    return p ? --p * p * ((overshoot + 1) * p + overshoot) + 1 : 0;
  }, ease = type === "out" ? easeOut : type === "in" ? function(p) {
    return 1 - easeOut(1 - p);
  } : _easeInOutFromOut(easeOut);
  ease.config = function(overshoot2) {
    return _configBack2(type, overshoot2);
  };
  return ease;
};
_forEachName("Linear,Quad,Cubic,Quart,Quint,Strong", function(name, i) {
  var power = i < 5 ? i + 1 : i;
  _insertEase(name + ",Power" + (power - 1), i ? function(p) {
    return Math.pow(p, power);
  } : function(p) {
    return p;
  }, function(p) {
    return 1 - Math.pow(1 - p, power);
  }, function(p) {
    return p < 0.5 ? Math.pow(p * 2, power) / 2 : 1 - Math.pow((1 - p) * 2, power) / 2;
  });
});
_easeMap.Linear.easeNone = _easeMap.none = _easeMap.Linear.easeIn;
_insertEase("Elastic", _configElastic("in"), _configElastic("out"), _configElastic());
(function(n, c) {
  var n1 = 1 / c, n2 = 2 * n1, n3 = 2.5 * n1, easeOut = function easeOut2(p) {
    return p < n1 ? n * p * p : p < n2 ? n * Math.pow(p - 1.5 / c, 2) + 0.75 : p < n3 ? n * (p -= 2.25 / c) * p + 0.9375 : n * Math.pow(p - 2.625 / c, 2) + 0.984375;
  };
  _insertEase("Bounce", function(p) {
    return 1 - easeOut(1 - p);
  }, easeOut);
})(7.5625, 2.75);
_insertEase("Expo", function(p) {
  return p ? Math.pow(2, 10 * (p - 1)) : 0;
});
_insertEase("Circ", function(p) {
  return -(_sqrt(1 - p * p) - 1);
});
_insertEase("Sine", function(p) {
  return p === 1 ? 1 : -_cos(p * _HALF_PI) + 1;
});
_insertEase("Back", _configBack("in"), _configBack("out"), _configBack());
_easeMap.SteppedEase = _easeMap.steps = _globals.SteppedEase = {
  config: function config(steps, immediateStart) {
    if (steps === void 0) {
      steps = 1;
    }
    var p1 = 1 / steps, p2 = steps + (immediateStart ? 0 : 1), p3 = immediateStart ? 1 : 0, max = 1 - _tinyNum;
    return function(p) {
      return ((p2 * _clamp(0, max, p) | 0) + p3) * p1;
    };
  }
};
_defaults.ease = _easeMap["quad.out"];
_forEachName("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt", function(name) {
  return _callbackNames += name + "," + name + "Params,";
});
var GSCache = function GSCache2(target, harness) {
  this.id = _gsID++;
  target._gsap = this;
  this.target = target;
  this.harness = harness;
  this.get = harness ? harness.get : _getProperty;
  this.set = harness ? harness.getSetter : _getSetter;
};
var Animation = /* @__PURE__ */ function() {
  function Animation2(vars) {
    this.vars = vars;
    this._delay = +vars.delay || 0;
    if (this._repeat = vars.repeat === Infinity ? -2 : vars.repeat || 0) {
      this._rDelay = vars.repeatDelay || 0;
      this._yoyo = !!vars.yoyo || !!vars.yoyoEase;
    }
    this._ts = 1;
    _setDuration(this, +vars.duration, 1, 1);
    this.data = vars.data;
    if (_context) {
      this._ctx = _context;
      _context.data.push(this);
    }
    _tickerActive || _ticker.wake();
  }
  var _proto = Animation2.prototype;
  _proto.delay = function delay(value) {
    if (value || value === 0) {
      this.parent && this.parent.smoothChildTiming && this.startTime(this._start + value - this._delay);
      this._delay = value;
      return this;
    }
    return this._delay;
  };
  _proto.duration = function duration(value) {
    return arguments.length ? this.totalDuration(this._repeat > 0 ? value + (value + this._rDelay) * this._repeat : value) : this.totalDuration() && this._dur;
  };
  _proto.totalDuration = function totalDuration(value) {
    if (!arguments.length) {
      return this._tDur;
    }
    this._dirty = 0;
    return _setDuration(this, this._repeat < 0 ? value : (value - this._repeat * this._rDelay) / (this._repeat + 1));
  };
  _proto.totalTime = function totalTime(_totalTime, suppressEvents) {
    _wake();
    if (!arguments.length) {
      return this._tTime;
    }
    var parent2 = this._dp;
    if (parent2 && parent2.smoothChildTiming && this._ts) {
      _alignPlayhead(this, _totalTime);
      !parent2._dp || parent2.parent || _postAddChecks(parent2, this);
      while (parent2 && parent2.parent) {
        if (parent2.parent._time !== parent2._start + (parent2._ts >= 0 ? parent2._tTime / parent2._ts : (parent2.totalDuration() - parent2._tTime) / -parent2._ts)) {
          parent2.totalTime(parent2._tTime, true);
        }
        parent2 = parent2.parent;
      }
      if (!this.parent && this._dp.autoRemoveChildren && (this._ts > 0 && _totalTime < this._tDur || this._ts < 0 && _totalTime > 0 || !this._tDur && !_totalTime)) {
        _addToTimeline(this._dp, this, this._start - this._delay);
      }
    }
    if (this._tTime !== _totalTime || !this._dur && !suppressEvents || this._initted && Math.abs(this._zTime) === _tinyNum || !_totalTime && !this._initted && (this.add || this._ptLookup)) {
      this._ts || (this._pTime = _totalTime);
      _lazySafeRender(this, _totalTime, suppressEvents);
    }
    return this;
  };
  _proto.time = function time(value, suppressEvents) {
    return arguments.length ? this.totalTime(Math.min(this.totalDuration(), value + _elapsedCycleDuration(this)) % (this._dur + this._rDelay) || (value ? this._dur : 0), suppressEvents) : this._time;
  };
  _proto.totalProgress = function totalProgress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.totalDuration() * value, suppressEvents) : this.totalDuration() ? Math.min(1, this._tTime / this._tDur) : this.rawTime() > 0 ? 1 : 0;
  };
  _proto.progress = function progress(value, suppressEvents) {
    return arguments.length ? this.totalTime(this.duration() * (this._yoyo && !(this.iteration() & 1) ? 1 - value : value) + _elapsedCycleDuration(this), suppressEvents) : this.duration() ? Math.min(1, this._time / this._dur) : this.rawTime() > 0 ? 1 : 0;
  };
  _proto.iteration = function iteration(value, suppressEvents) {
    var cycleDuration = this.duration() + this._rDelay;
    return arguments.length ? this.totalTime(this._time + (value - 1) * cycleDuration, suppressEvents) : this._repeat ? _animationCycle(this._tTime, cycleDuration) + 1 : 1;
  };
  _proto.timeScale = function timeScale(value, suppressEvents) {
    if (!arguments.length) {
      return this._rts === -_tinyNum ? 0 : this._rts;
    }
    if (this._rts === value) {
      return this;
    }
    var tTime = this.parent && this._ts ? _parentToChildTotalTime(this.parent._time, this) : this._tTime;
    this._rts = +value || 0;
    this._ts = this._ps || value === -_tinyNum ? 0 : this._rts;
    this.totalTime(_clamp(-Math.abs(this._delay), this._tDur, tTime), suppressEvents !== false);
    _setEnd(this);
    return _recacheAncestors(this);
  };
  _proto.paused = function paused(value) {
    if (!arguments.length) {
      return this._ps;
    }
    if (this._ps !== value) {
      this._ps = value;
      if (value) {
        this._pTime = this._tTime || Math.max(-this._delay, this.rawTime());
        this._ts = this._act = 0;
      } else {
        _wake();
        this._ts = this._rts;
        this.totalTime(this.parent && !this.parent.smoothChildTiming ? this.rawTime() : this._tTime || this._pTime, this.progress() === 1 && Math.abs(this._zTime) !== _tinyNum && (this._tTime -= _tinyNum));
      }
    }
    return this;
  };
  _proto.startTime = function startTime(value) {
    if (arguments.length) {
      this._start = value;
      var parent2 = this.parent || this._dp;
      parent2 && (parent2._sort || !this.parent) && _addToTimeline(parent2, this, value - this._delay);
      return this;
    }
    return this._start;
  };
  _proto.endTime = function endTime(includeRepeats) {
    return this._start + (_isNotFalse(includeRepeats) ? this.totalDuration() : this.duration()) / Math.abs(this._ts || 1);
  };
  _proto.rawTime = function rawTime(wrapRepeats) {
    var parent2 = this.parent || this._dp;
    return !parent2 ? this._tTime : wrapRepeats && (!this._ts || this._repeat && this._time && this.totalProgress() < 1) ? this._tTime % (this._dur + this._rDelay) : !this._ts ? this._tTime : _parentToChildTotalTime(parent2.rawTime(wrapRepeats), this);
  };
  _proto.revert = function revert(config3) {
    if (config3 === void 0) {
      config3 = _revertConfig;
    }
    var prevIsReverting = _reverting$1;
    _reverting$1 = config3;
    if (this._initted || this._startAt) {
      this.timeline && this.timeline.revert(config3);
      this.totalTime(-0.01, config3.suppressEvents);
    }
    this.data !== "nested" && config3.kill !== false && this.kill();
    _reverting$1 = prevIsReverting;
    return this;
  };
  _proto.globalTime = function globalTime(rawTime) {
    var animation = this, time = arguments.length ? rawTime : animation.rawTime();
    while (animation) {
      time = animation._start + time / (Math.abs(animation._ts) || 1);
      animation = animation._dp;
    }
    return !this.parent && this._sat ? this._sat.globalTime(rawTime) : time;
  };
  _proto.repeat = function repeat(value) {
    if (arguments.length) {
      this._repeat = value === Infinity ? -2 : value;
      return _onUpdateTotalDuration(this);
    }
    return this._repeat === -2 ? Infinity : this._repeat;
  };
  _proto.repeatDelay = function repeatDelay(value) {
    if (arguments.length) {
      var time = this._time;
      this._rDelay = value;
      _onUpdateTotalDuration(this);
      return time ? this.time(time) : this;
    }
    return this._rDelay;
  };
  _proto.yoyo = function yoyo(value) {
    if (arguments.length) {
      this._yoyo = value;
      return this;
    }
    return this._yoyo;
  };
  _proto.seek = function seek(position, suppressEvents) {
    return this.totalTime(_parsePosition(this, position), _isNotFalse(suppressEvents));
  };
  _proto.restart = function restart(includeDelay, suppressEvents) {
    return this.play().totalTime(includeDelay ? -this._delay : 0, _isNotFalse(suppressEvents));
  };
  _proto.play = function play(from, suppressEvents) {
    from != null && this.seek(from, suppressEvents);
    return this.reversed(false).paused(false);
  };
  _proto.reverse = function reverse(from, suppressEvents) {
    from != null && this.seek(from || this.totalDuration(), suppressEvents);
    return this.reversed(true).paused(false);
  };
  _proto.pause = function pause(atTime, suppressEvents) {
    atTime != null && this.seek(atTime, suppressEvents);
    return this.paused(true);
  };
  _proto.resume = function resume() {
    return this.paused(false);
  };
  _proto.reversed = function reversed(value) {
    if (arguments.length) {
      !!value !== this.reversed() && this.timeScale(-this._rts || (value ? -_tinyNum : 0));
      return this;
    }
    return this._rts < 0;
  };
  _proto.invalidate = function invalidate() {
    this._initted = this._act = 0;
    this._zTime = -_tinyNum;
    return this;
  };
  _proto.isActive = function isActive() {
    var parent2 = this.parent || this._dp, start = this._start, rawTime;
    return !!(!parent2 || this._ts && this._initted && parent2.isActive() && (rawTime = parent2.rawTime(true)) >= start && rawTime < this.endTime(true) - _tinyNum);
  };
  _proto.eventCallback = function eventCallback(type, callback, params) {
    var vars = this.vars;
    if (arguments.length > 1) {
      if (!callback) {
        delete vars[type];
      } else {
        vars[type] = callback;
        params && (vars[type + "Params"] = params);
        type === "onUpdate" && (this._onUpdate = callback);
      }
      return this;
    }
    return vars[type];
  };
  _proto.then = function then(onFulfilled) {
    var self2 = this;
    return new Promise(function(resolve2) {
      var f = _isFunction(onFulfilled) ? onFulfilled : _passThrough, _resolve = function _resolve2() {
        var _then = self2.then;
        self2.then = null;
        _isFunction(f) && (f = f(self2)) && (f.then || f === self2) && (self2.then = _then);
        resolve2(f);
        self2.then = _then;
      };
      if (self2._initted && self2.totalProgress() === 1 && self2._ts >= 0 || !self2._tTime && self2._ts < 0) {
        _resolve();
      } else {
        self2._prom = _resolve;
      }
    });
  };
  _proto.kill = function kill() {
    _interrupt(this);
  };
  return Animation2;
}();
_setDefaults(Animation.prototype, {
  _time: 0,
  _start: 0,
  _end: 0,
  _tTime: 0,
  _tDur: 0,
  _dirty: 0,
  _repeat: 0,
  _yoyo: false,
  parent: null,
  _initted: false,
  _rDelay: 0,
  _ts: 1,
  _dp: 0,
  ratio: 0,
  _zTime: -_tinyNum,
  _prom: 0,
  _ps: false,
  _rts: 1
});
var Timeline = /* @__PURE__ */ function(_Animation) {
  _inheritsLoose(Timeline2, _Animation);
  function Timeline2(vars, position) {
    var _this;
    if (vars === void 0) {
      vars = {};
    }
    _this = _Animation.call(this, vars) || this;
    _this.labels = {};
    _this.smoothChildTiming = !!vars.smoothChildTiming;
    _this.autoRemoveChildren = !!vars.autoRemoveChildren;
    _this._sort = _isNotFalse(vars.sortChildren);
    _globalTimeline && _addToTimeline(vars.parent || _globalTimeline, _assertThisInitialized(_this), position);
    vars.reversed && _this.reverse();
    vars.paused && _this.paused(true);
    vars.scrollTrigger && _scrollTrigger(_assertThisInitialized(_this), vars.scrollTrigger);
    return _this;
  }
  var _proto2 = Timeline2.prototype;
  _proto2.to = function to(targets, vars, position) {
    _createTweenType(0, arguments, this);
    return this;
  };
  _proto2.from = function from(targets, vars, position) {
    _createTweenType(1, arguments, this);
    return this;
  };
  _proto2.fromTo = function fromTo(targets, fromVars, toVars, position) {
    _createTweenType(2, arguments, this);
    return this;
  };
  _proto2.set = function set(targets, vars, position) {
    vars.duration = 0;
    vars.parent = this;
    _inheritDefaults(vars).repeatDelay || (vars.repeat = 0);
    vars.immediateRender = !!vars.immediateRender;
    new Tween(targets, vars, _parsePosition(this, position), 1);
    return this;
  };
  _proto2.call = function call(callback, params, position) {
    return _addToTimeline(this, Tween.delayedCall(0, callback, params), position);
  };
  _proto2.staggerTo = function staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.duration = duration;
    vars.stagger = vars.stagger || stagger;
    vars.onComplete = onCompleteAll;
    vars.onCompleteParams = onCompleteAllParams;
    vars.parent = this;
    new Tween(targets, vars, _parsePosition(this, position));
    return this;
  };
  _proto2.staggerFrom = function staggerFrom(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams) {
    vars.runBackwards = 1;
    _inheritDefaults(vars).immediateRender = _isNotFalse(vars.immediateRender);
    return this.staggerTo(targets, duration, vars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.staggerFromTo = function staggerFromTo(targets, duration, fromVars, toVars, stagger, position, onCompleteAll, onCompleteAllParams) {
    toVars.startAt = fromVars;
    _inheritDefaults(toVars).immediateRender = _isNotFalse(toVars.immediateRender);
    return this.staggerTo(targets, duration, toVars, stagger, position, onCompleteAll, onCompleteAllParams);
  };
  _proto2.render = function render3(totalTime, suppressEvents, force) {
    var prevTime = this._time, tDur = this._dirty ? this.totalDuration() : this._tDur, dur = this._dur, tTime = totalTime <= 0 ? 0 : _roundPrecise(totalTime), crossingStart = this._zTime < 0 !== totalTime < 0 && (this._initted || !dur), time, child, next2, iteration, cycleDuration, prevPaused, pauseTween, timeScale, prevStart, prevIteration, yoyo, isYoyo;
    this !== _globalTimeline && tTime > tDur && totalTime >= 0 && (tTime = tDur);
    if (tTime !== this._tTime || force || crossingStart) {
      if (prevTime !== this._time && dur) {
        tTime += this._time - prevTime;
        totalTime += this._time - prevTime;
      }
      time = tTime;
      prevStart = this._start;
      timeScale = this._ts;
      prevPaused = !timeScale;
      if (crossingStart) {
        dur || (prevTime = this._zTime);
        (totalTime || !suppressEvents) && (this._zTime = totalTime);
      }
      if (this._repeat) {
        yoyo = this._yoyo;
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && totalTime < 0) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === tTime / cycleDuration) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        !prevTime && this._tTime && prevIteration !== iteration && this._tTime - prevIteration * cycleDuration - this._dur <= 0 && (prevIteration = iteration);
        if (yoyo && iteration & 1) {
          time = dur - time;
          isYoyo = 1;
        }
        if (iteration !== prevIteration && !this._lock) {
          var rewinding = yoyo && prevIteration & 1, doesWrap = rewinding === (yoyo && iteration & 1);
          iteration < prevIteration && (rewinding = !rewinding);
          prevTime = rewinding ? 0 : tTime % dur ? dur : tTime;
          this._lock = 1;
          this.render(prevTime || (isYoyo ? 0 : _roundPrecise(iteration * cycleDuration)), suppressEvents, !dur)._lock = 0;
          this._tTime = tTime;
          !suppressEvents && this.parent && _callback(this, "onRepeat");
          this.vars.repeatRefresh && !isYoyo && (this.invalidate()._lock = 1);
          if (prevTime && prevTime !== this._time || prevPaused !== !this._ts || this.vars.onRepeat && !this.parent && !this._act) {
            return this;
          }
          dur = this._dur;
          tDur = this._tDur;
          if (doesWrap) {
            this._lock = 2;
            prevTime = rewinding ? dur : -1e-4;
            this.render(prevTime, true);
            this.vars.repeatRefresh && !isYoyo && this.invalidate();
          }
          this._lock = 0;
          if (!this._ts && !prevPaused) {
            return this;
          }
          _propagateYoyoEase(this, isYoyo);
        }
      }
      if (this._hasPause && !this._forcing && this._lock < 2) {
        pauseTween = _findNextPauseTween(this, _roundPrecise(prevTime), _roundPrecise(time));
        if (pauseTween) {
          tTime -= time - (time = pauseTween._start);
        }
      }
      this._tTime = tTime;
      this._time = time;
      this._act = !timeScale;
      if (!this._initted) {
        this._onUpdate = this.vars.onUpdate;
        this._initted = 1;
        this._zTime = totalTime;
        prevTime = 0;
      }
      if (!prevTime && time && !suppressEvents && !iteration) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      if (time >= prevTime && totalTime >= 0) {
        child = this._first;
        while (child) {
          next2 = child._next;
          if ((child._act || time >= child._start) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (time - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (time - child._start) * child._ts, suppressEvents, force);
            if (time !== this._time || !this._ts && !prevPaused) {
              pauseTween = 0;
              next2 && (tTime += this._zTime = -_tinyNum);
              break;
            }
          }
          child = next2;
        }
      } else {
        child = this._last;
        var adjustedTime = totalTime < 0 ? totalTime : time;
        while (child) {
          next2 = child._prev;
          if ((child._act || adjustedTime <= child._end) && child._ts && pauseTween !== child) {
            if (child.parent !== this) {
              return this.render(totalTime, suppressEvents, force);
            }
            child.render(child._ts > 0 ? (adjustedTime - child._start) * child._ts : (child._dirty ? child.totalDuration() : child._tDur) + (adjustedTime - child._start) * child._ts, suppressEvents, force || _reverting$1 && (child._initted || child._startAt));
            if (time !== this._time || !this._ts && !prevPaused) {
              pauseTween = 0;
              next2 && (tTime += this._zTime = adjustedTime ? -_tinyNum : _tinyNum);
              break;
            }
          }
          child = next2;
        }
      }
      if (pauseTween && !suppressEvents) {
        this.pause();
        pauseTween.render(time >= prevTime ? 0 : -_tinyNum)._zTime = time >= prevTime ? 1 : -1;
        if (this._ts) {
          this._start = prevStart;
          _setEnd(this);
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._onUpdate && !suppressEvents && _callback(this, "onUpdate", true);
      if (tTime === tDur && this._tTime >= this.totalDuration() || !tTime && prevTime) {
        if (prevStart === this._start || Math.abs(timeScale) !== Math.abs(this._ts)) {
          if (!this._lock) {
            (totalTime || !dur) && (tTime === tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
            if (!suppressEvents && !(totalTime < 0 && !prevTime) && (tTime || prevTime || !tDur)) {
              _callback(this, tTime === tDur && totalTime >= 0 ? "onComplete" : "onReverseComplete", true);
              this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
            }
          }
        }
      }
    }
    return this;
  };
  _proto2.add = function add(child, position) {
    var _this2 = this;
    _isNumber(position) || (position = _parsePosition(this, position, child));
    if (!(child instanceof Animation)) {
      if (_isArray(child)) {
        child.forEach(function(obj) {
          return _this2.add(obj, position);
        });
        return this;
      }
      if (_isString(child)) {
        return this.addLabel(child, position);
      }
      if (_isFunction(child)) {
        child = Tween.delayedCall(0, child);
      } else {
        return this;
      }
    }
    return this !== child ? _addToTimeline(this, child, position) : this;
  };
  _proto2.getChildren = function getChildren(nested, tweens, timelines, ignoreBeforeTime) {
    if (nested === void 0) {
      nested = true;
    }
    if (tweens === void 0) {
      tweens = true;
    }
    if (timelines === void 0) {
      timelines = true;
    }
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = -_bigNum$1;
    }
    var a = [], child = this._first;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        if (child instanceof Tween) {
          tweens && a.push(child);
        } else {
          timelines && a.push(child);
          nested && a.push.apply(a, child.getChildren(true, tweens, timelines));
        }
      }
      child = child._next;
    }
    return a;
  };
  _proto2.getById = function getById2(id) {
    var animations = this.getChildren(1, 1, 1), i = animations.length;
    while (i--) {
      if (animations[i].vars.id === id) {
        return animations[i];
      }
    }
  };
  _proto2.remove = function remove2(child) {
    if (_isString(child)) {
      return this.removeLabel(child);
    }
    if (_isFunction(child)) {
      return this.killTweensOf(child);
    }
    _removeLinkedListItem(this, child);
    if (child === this._recent) {
      this._recent = this._last;
    }
    return _uncache(this);
  };
  _proto2.totalTime = function totalTime(_totalTime2, suppressEvents) {
    if (!arguments.length) {
      return this._tTime;
    }
    this._forcing = 1;
    if (!this._dp && this._ts) {
      this._start = _roundPrecise(_ticker.time - (this._ts > 0 ? _totalTime2 / this._ts : (this.totalDuration() - _totalTime2) / -this._ts));
    }
    _Animation.prototype.totalTime.call(this, _totalTime2, suppressEvents);
    this._forcing = 0;
    return this;
  };
  _proto2.addLabel = function addLabel(label, position) {
    this.labels[label] = _parsePosition(this, position);
    return this;
  };
  _proto2.removeLabel = function removeLabel(label) {
    delete this.labels[label];
    return this;
  };
  _proto2.addPause = function addPause(position, callback, params) {
    var t = Tween.delayedCall(0, callback || _emptyFunc, params);
    t.data = "isPause";
    this._hasPause = 1;
    return _addToTimeline(this, t, _parsePosition(this, position));
  };
  _proto2.removePause = function removePause(position) {
    var child = this._first;
    position = _parsePosition(this, position);
    while (child) {
      if (child._start === position && child.data === "isPause") {
        _removeFromParent(child);
      }
      child = child._next;
    }
  };
  _proto2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    var tweens = this.getTweensOf(targets, onlyActive), i = tweens.length;
    while (i--) {
      _overwritingTween !== tweens[i] && tweens[i].kill(targets, props);
    }
    return this;
  };
  _proto2.getTweensOf = function getTweensOf2(targets, onlyActive) {
    var a = [], parsedTargets = toArray(targets), child = this._first, isGlobalTime = _isNumber(onlyActive), children2;
    while (child) {
      if (child instanceof Tween) {
        if (_arrayContainsAny(child._targets, parsedTargets) && (isGlobalTime ? (!_overwritingTween || child._initted && child._ts) && child.globalTime(0) <= onlyActive && child.globalTime(child.totalDuration()) > onlyActive : !onlyActive || child.isActive())) {
          a.push(child);
        }
      } else if ((children2 = child.getTweensOf(parsedTargets, onlyActive)).length) {
        a.push.apply(a, children2);
      }
      child = child._next;
    }
    return a;
  };
  _proto2.tweenTo = function tweenTo(position, vars) {
    vars = vars || {};
    var tl2 = this, endTime = _parsePosition(tl2, position), _vars = vars, startAt = _vars.startAt, _onStart = _vars.onStart, onStartParams = _vars.onStartParams, immediateRender = _vars.immediateRender, initted, tween = Tween.to(tl2, _setDefaults({
      ease: vars.ease || "none",
      lazy: false,
      immediateRender: false,
      time: endTime,
      overwrite: "auto",
      duration: vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl2._time)) / tl2.timeScale()) || _tinyNum,
      onStart: function onStart() {
        tl2.pause();
        if (!initted) {
          var duration = vars.duration || Math.abs((endTime - (startAt && "time" in startAt ? startAt.time : tl2._time)) / tl2.timeScale());
          tween._dur !== duration && _setDuration(tween, duration, 0, 1).render(tween._time, true, true);
          initted = 1;
        }
        _onStart && _onStart.apply(tween, onStartParams || []);
      }
    }, vars));
    return immediateRender ? tween.render(0) : tween;
  };
  _proto2.tweenFromTo = function tweenFromTo(fromPosition, toPosition, vars) {
    return this.tweenTo(toPosition, _setDefaults({
      startAt: {
        time: _parsePosition(this, fromPosition)
      }
    }, vars));
  };
  _proto2.recent = function recent() {
    return this._recent;
  };
  _proto2.nextLabel = function nextLabel(afterTime) {
    if (afterTime === void 0) {
      afterTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, afterTime));
  };
  _proto2.previousLabel = function previousLabel(beforeTime) {
    if (beforeTime === void 0) {
      beforeTime = this._time;
    }
    return _getLabelInDirection(this, _parsePosition(this, beforeTime), 1);
  };
  _proto2.currentLabel = function currentLabel(value) {
    return arguments.length ? this.seek(value, true) : this.previousLabel(this._time + _tinyNum);
  };
  _proto2.shiftChildren = function shiftChildren(amount, adjustLabels, ignoreBeforeTime) {
    if (ignoreBeforeTime === void 0) {
      ignoreBeforeTime = 0;
    }
    var child = this._first, labels = this.labels, p;
    while (child) {
      if (child._start >= ignoreBeforeTime) {
        child._start += amount;
        child._end += amount;
      }
      child = child._next;
    }
    if (adjustLabels) {
      for (p in labels) {
        if (labels[p] >= ignoreBeforeTime) {
          labels[p] += amount;
        }
      }
    }
    return _uncache(this);
  };
  _proto2.invalidate = function invalidate(soft) {
    var child = this._first;
    this._lock = 0;
    while (child) {
      child.invalidate(soft);
      child = child._next;
    }
    return _Animation.prototype.invalidate.call(this, soft);
  };
  _proto2.clear = function clear(includeLabels) {
    if (includeLabels === void 0) {
      includeLabels = true;
    }
    var child = this._first, next2;
    while (child) {
      next2 = child._next;
      this.remove(child);
      child = next2;
    }
    this._dp && (this._time = this._tTime = this._pTime = 0);
    includeLabels && (this.labels = {});
    return _uncache(this);
  };
  _proto2.totalDuration = function totalDuration(value) {
    var max = 0, self2 = this, child = self2._last, prevStart = _bigNum$1, prev2, start, parent2;
    if (arguments.length) {
      return self2.timeScale((self2._repeat < 0 ? self2.duration() : self2.totalDuration()) / (self2.reversed() ? -value : value));
    }
    if (self2._dirty) {
      parent2 = self2.parent;
      while (child) {
        prev2 = child._prev;
        child._dirty && child.totalDuration();
        start = child._start;
        if (start > prevStart && self2._sort && child._ts && !self2._lock) {
          self2._lock = 1;
          _addToTimeline(self2, child, start - child._delay, 1)._lock = 0;
        } else {
          prevStart = start;
        }
        if (start < 0 && child._ts) {
          max -= start;
          if (!parent2 && !self2._dp || parent2 && parent2.smoothChildTiming) {
            self2._start += start / self2._ts;
            self2._time -= start;
            self2._tTime -= start;
          }
          self2.shiftChildren(-start, false, -Infinity);
          prevStart = 0;
        }
        child._end > max && child._ts && (max = child._end);
        child = prev2;
      }
      _setDuration(self2, self2 === _globalTimeline && self2._time > max ? self2._time : max, 1, 1);
      self2._dirty = 0;
    }
    return self2._tDur;
  };
  Timeline2.updateRoot = function updateRoot(time) {
    if (_globalTimeline._ts) {
      _lazySafeRender(_globalTimeline, _parentToChildTotalTime(time, _globalTimeline));
      _lastRenderedFrame = _ticker.frame;
    }
    if (_ticker.frame >= _nextGCFrame) {
      _nextGCFrame += _config.autoSleep || 120;
      var child = _globalTimeline._first;
      if (!child || !child._ts) {
        if (_config.autoSleep && _ticker._listeners.length < 2) {
          while (child && !child._ts) {
            child = child._next;
          }
          child || _ticker.sleep();
        }
      }
    }
  };
  return Timeline2;
}(Animation);
_setDefaults(Timeline.prototype, {
  _lock: 0,
  _hasPause: 0,
  _forcing: 0
});
var _addComplexStringPropTween = function _addComplexStringPropTween2(target, prop, start, end, setter, stringFilter, funcParam) {
  var pt = new PropTween(this._pt, target, prop, 0, 1, _renderComplexString, null, setter), index2 = 0, matchIndex = 0, result, startNums, color, endNum, chunk, startNum, hasRandom, a;
  pt.b = start;
  pt.e = end;
  start += "";
  end += "";
  if (hasRandom = ~end.indexOf("random(")) {
    end = _replaceRandom(end);
  }
  if (stringFilter) {
    a = [start, end];
    stringFilter(a, target, prop);
    start = a[0];
    end = a[1];
  }
  startNums = start.match(_complexStringNumExp) || [];
  while (result = _complexStringNumExp.exec(end)) {
    endNum = result[0];
    chunk = end.substring(index2, result.index);
    if (color) {
      color = (color + 1) % 5;
    } else if (chunk.substr(-5) === "rgba(") {
      color = 1;
    }
    if (endNum !== startNums[matchIndex++]) {
      startNum = parseFloat(startNums[matchIndex - 1]) || 0;
      pt._pt = {
        _next: pt._pt,
        p: chunk || matchIndex === 1 ? chunk : ",",
        //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
        s: startNum,
        c: endNum.charAt(1) === "=" ? _parseRelative(startNum, endNum) - startNum : parseFloat(endNum) - startNum,
        m: color && color < 4 ? Math.round : 0
      };
      index2 = _complexStringNumExp.lastIndex;
    }
  }
  pt.c = index2 < end.length ? end.substring(index2, end.length) : "";
  pt.fp = funcParam;
  if (_relExp.test(end) || hasRandom) {
    pt.e = 0;
  }
  this._pt = pt;
  return pt;
}, _addPropTween = function _addPropTween2(target, prop, start, end, index2, targets, modifier, stringFilter, funcParam, optional) {
  _isFunction(end) && (end = end(index2 || 0, target, targets));
  var currentValue = target[prop], parsedStart = start !== "get" ? start : !_isFunction(currentValue) ? currentValue : funcParam ? target[prop.indexOf("set") || !_isFunction(target["get" + prop.substr(3)]) ? prop : "get" + prop.substr(3)](funcParam) : target[prop](), setter = !_isFunction(currentValue) ? _setterPlain : funcParam ? _setterFuncWithParam : _setterFunc, pt;
  if (_isString(end)) {
    if (~end.indexOf("random(")) {
      end = _replaceRandom(end);
    }
    if (end.charAt(1) === "=") {
      pt = _parseRelative(parsedStart, end) + (getUnit(parsedStart) || 0);
      if (pt || pt === 0) {
        end = pt;
      }
    }
  }
  if (!optional || parsedStart !== end || _forceAllPropTweens) {
    if (!isNaN(parsedStart * end) && end !== "") {
      pt = new PropTween(this._pt, target, prop, +parsedStart || 0, end - (parsedStart || 0), typeof currentValue === "boolean" ? _renderBoolean : _renderPlain, 0, setter);
      funcParam && (pt.fp = funcParam);
      modifier && pt.modifier(modifier, this, target);
      return this._pt = pt;
    }
    !currentValue && !(prop in target) && _missingPlugin(prop, end);
    return _addComplexStringPropTween.call(this, target, prop, parsedStart, end, setter, stringFilter || _config.stringFilter, funcParam);
  }
}, _processVars = function _processVars2(vars, index2, target, targets, tween) {
  _isFunction(vars) && (vars = _parseFuncOrString(vars, tween, index2, target, targets));
  if (!_isObject(vars) || vars.style && vars.nodeType || _isArray(vars) || _isTypedArray(vars)) {
    return _isString(vars) ? _parseFuncOrString(vars, tween, index2, target, targets) : vars;
  }
  var copy = {}, p;
  for (p in vars) {
    copy[p] = _parseFuncOrString(vars[p], tween, index2, target, targets);
  }
  return copy;
}, _checkPlugin = function _checkPlugin2(property, vars, tween, index2, target, targets) {
  var plugin, pt, ptLookup, i;
  if (_plugins[property] && (plugin = new _plugins[property]()).init(target, plugin.rawVars ? vars[property] : _processVars(vars[property], index2, target, targets, tween), tween, index2, targets) !== false) {
    tween._pt = pt = new PropTween(tween._pt, target, property, 0, 1, plugin.render, plugin, 0, plugin.priority);
    if (tween !== _quickTween) {
      ptLookup = tween._ptLookup[tween._targets.indexOf(target)];
      i = plugin._props.length;
      while (i--) {
        ptLookup[plugin._props[i]] = pt;
      }
    }
  }
  return plugin;
}, _overwritingTween, _forceAllPropTweens, _initTween = function _initTween2(tween, time, tTime) {
  var vars = tween.vars, ease = vars.ease, startAt = vars.startAt, immediateRender = vars.immediateRender, lazy = vars.lazy, onUpdate = vars.onUpdate, runBackwards = vars.runBackwards, yoyoEase = vars.yoyoEase, keyframes = vars.keyframes, autoRevert = vars.autoRevert, dur = tween._dur, prevStartAt = tween._startAt, targets = tween._targets, parent2 = tween.parent, fullTargets = parent2 && parent2.data === "nested" ? parent2.vars.targets : targets, autoOverwrite = tween._overwrite === "auto" && !_suppressOverwrites, tl2 = tween.timeline, cleanVars, i, p, pt, target, hasPriority, gsData, harness, plugin, ptLookup, index2, harnessVars, overwritten;
  tl2 && (!keyframes || !ease) && (ease = "none");
  tween._ease = _parseEase(ease, _defaults.ease);
  tween._yEase = yoyoEase ? _invertEase(_parseEase(yoyoEase === true ? ease : yoyoEase, _defaults.ease)) : 0;
  if (yoyoEase && tween._yoyo && !tween._repeat) {
    yoyoEase = tween._yEase;
    tween._yEase = tween._ease;
    tween._ease = yoyoEase;
  }
  tween._from = !tl2 && !!vars.runBackwards;
  if (!tl2 || keyframes && !vars.stagger) {
    harness = targets[0] ? _getCache(targets[0]).harness : 0;
    harnessVars = harness && vars[harness.prop];
    cleanVars = _copyExcluding(vars, _reservedProps);
    if (prevStartAt) {
      prevStartAt._zTime < 0 && prevStartAt.progress(1);
      time < 0 && runBackwards && immediateRender && !autoRevert ? prevStartAt.render(-1, true) : prevStartAt.revert(runBackwards && dur ? _revertConfigNoKill : _startAtRevertConfig);
      prevStartAt._lazy = 0;
    }
    if (startAt) {
      _removeFromParent(tween._startAt = Tween.set(targets, _setDefaults({
        data: "isStart",
        overwrite: false,
        parent: parent2,
        immediateRender: true,
        lazy: !prevStartAt && _isNotFalse(lazy),
        startAt: null,
        delay: 0,
        onUpdate: onUpdate && function() {
          return _callback(tween, "onUpdate");
        },
        stagger: 0
      }, startAt)));
      tween._startAt._dp = 0;
      tween._startAt._sat = tween;
      time < 0 && (_reverting$1 || !immediateRender && !autoRevert) && tween._startAt.revert(_revertConfigNoKill);
      if (immediateRender) {
        if (dur && time <= 0 && tTime <= 0) {
          time && (tween._zTime = time);
          return;
        }
      }
    } else if (runBackwards && dur) {
      if (!prevStartAt) {
        time && (immediateRender = false);
        p = _setDefaults({
          overwrite: false,
          data: "isFromStart",
          //we tag the tween with as "isFromStart" so that if [inside a plugin] we need to only do something at the very END of a tween, we have a way of identifying this tween as merely the one that's setting the beginning values for a "from()" tween. For example, clearProps in CSSPlugin should only get applied at the very END of a tween and without this tag, from(...{height:100, clearProps:"height", delay:1}) would wipe the height at the beginning of the tween and after 1 second, it'd kick back in.
          lazy: immediateRender && !prevStartAt && _isNotFalse(lazy),
          immediateRender,
          //zero-duration tweens render immediately by default, but if we're not specifically instructed to render this tween immediately, we should skip this and merely _init() to record the starting values (rendering them immediately would push them to completion which is wasteful in that case - we'd have to render(-1) immediately after)
          stagger: 0,
          parent: parent2
          //ensures that nested tweens that had a stagger are handled properly, like gsap.from(".class", {y: gsap.utils.wrap([-100,100]), stagger: 0.5})
        }, cleanVars);
        harnessVars && (p[harness.prop] = harnessVars);
        _removeFromParent(tween._startAt = Tween.set(targets, p));
        tween._startAt._dp = 0;
        tween._startAt._sat = tween;
        time < 0 && (_reverting$1 ? tween._startAt.revert(_revertConfigNoKill) : tween._startAt.render(-1, true));
        tween._zTime = time;
        if (!immediateRender) {
          _initTween2(tween._startAt, _tinyNum, _tinyNum);
        } else if (!time) {
          return;
        }
      }
    }
    tween._pt = tween._ptCache = 0;
    lazy = dur && _isNotFalse(lazy) || lazy && !dur;
    for (i = 0; i < targets.length; i++) {
      target = targets[i];
      gsData = target._gsap || _harness(targets)[i]._gsap;
      tween._ptLookup[i] = ptLookup = {};
      _lazyLookup[gsData.id] && _lazyTweens.length && _lazyRender();
      index2 = fullTargets === targets ? i : fullTargets.indexOf(target);
      if (harness && (plugin = new harness()).init(target, harnessVars || cleanVars, tween, index2, fullTargets) !== false) {
        tween._pt = pt = new PropTween(tween._pt, target, plugin.name, 0, 1, plugin.render, plugin, 0, plugin.priority);
        plugin._props.forEach(function(name) {
          ptLookup[name] = pt;
        });
        plugin.priority && (hasPriority = 1);
      }
      if (!harness || harnessVars) {
        for (p in cleanVars) {
          if (_plugins[p] && (plugin = _checkPlugin(p, cleanVars, tween, index2, target, fullTargets))) {
            plugin.priority && (hasPriority = 1);
          } else {
            ptLookup[p] = pt = _addPropTween.call(tween, target, p, "get", cleanVars[p], index2, fullTargets, 0, vars.stringFilter);
          }
        }
      }
      tween._op && tween._op[i] && tween.kill(target, tween._op[i]);
      if (autoOverwrite && tween._pt) {
        _overwritingTween = tween;
        _globalTimeline.killTweensOf(target, ptLookup, tween.globalTime(time));
        overwritten = !tween.parent;
        _overwritingTween = 0;
      }
      tween._pt && lazy && (_lazyLookup[gsData.id] = 1);
    }
    hasPriority && _sortPropTweensByPriority(tween);
    tween._onInit && tween._onInit(tween);
  }
  tween._onUpdate = onUpdate;
  tween._initted = (!tween._op || tween._pt) && !overwritten;
  keyframes && time <= 0 && tl2.render(_bigNum$1, true, true);
}, _updatePropTweens = function _updatePropTweens2(tween, property, value, start, startIsRelative, ratio, time, skipRecursion) {
  var ptCache = (tween._pt && tween._ptCache || (tween._ptCache = {}))[property], pt, rootPT, lookup, i;
  if (!ptCache) {
    ptCache = tween._ptCache[property] = [];
    lookup = tween._ptLookup;
    i = tween._targets.length;
    while (i--) {
      pt = lookup[i][property];
      if (pt && pt.d && pt.d._pt) {
        pt = pt.d._pt;
        while (pt && pt.p !== property && pt.fp !== property) {
          pt = pt._next;
        }
      }
      if (!pt) {
        _forceAllPropTweens = 1;
        tween.vars[property] = "+=0";
        _initTween(tween, time);
        _forceAllPropTweens = 0;
        return skipRecursion ? _warn(property + " not eligible for reset") : 1;
      }
      ptCache.push(pt);
    }
  }
  i = ptCache.length;
  while (i--) {
    rootPT = ptCache[i];
    pt = rootPT._pt || rootPT;
    pt.s = (start || start === 0) && !startIsRelative ? start : pt.s + (start || 0) + ratio * pt.c;
    pt.c = value - pt.s;
    rootPT.e && (rootPT.e = _round(value) + getUnit(rootPT.e));
    rootPT.b && (rootPT.b = pt.s + getUnit(rootPT.b));
  }
}, _addAliasesToVars = function _addAliasesToVars2(targets, vars) {
  var harness = targets[0] ? _getCache(targets[0]).harness : 0, propertyAliases = harness && harness.aliases, copy, p, i, aliases;
  if (!propertyAliases) {
    return vars;
  }
  copy = _merge({}, vars);
  for (p in propertyAliases) {
    if (p in copy) {
      aliases = propertyAliases[p].split(",");
      i = aliases.length;
      while (i--) {
        copy[aliases[i]] = copy[p];
      }
    }
  }
  return copy;
}, _parseKeyframe = function _parseKeyframe2(prop, obj, allProps, easeEach) {
  var ease = obj.ease || easeEach || "power1.inOut", p, a;
  if (_isArray(obj)) {
    a = allProps[prop] || (allProps[prop] = []);
    obj.forEach(function(value, i) {
      return a.push({
        t: i / (obj.length - 1) * 100,
        v: value,
        e: ease
      });
    });
  } else {
    for (p in obj) {
      a = allProps[p] || (allProps[p] = []);
      p === "ease" || a.push({
        t: parseFloat(prop),
        v: obj[p],
        e: ease
      });
    }
  }
}, _parseFuncOrString = function _parseFuncOrString2(value, tween, i, target, targets) {
  return _isFunction(value) ? value.call(tween, i, target, targets) : _isString(value) && ~value.indexOf("random(") ? _replaceRandom(value) : value;
}, _staggerTweenProps = _callbackNames + "repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,autoRevert", _staggerPropsToSkip = {};
_forEachName(_staggerTweenProps + ",id,stagger,delay,duration,paused,scrollTrigger", function(name) {
  return _staggerPropsToSkip[name] = 1;
});
var Tween = /* @__PURE__ */ function(_Animation2) {
  _inheritsLoose(Tween2, _Animation2);
  function Tween2(targets, vars, position, skipInherit) {
    var _this3;
    if (typeof vars === "number") {
      position.duration = vars;
      vars = position;
      position = null;
    }
    _this3 = _Animation2.call(this, skipInherit ? vars : _inheritDefaults(vars)) || this;
    var _this3$vars = _this3.vars, duration = _this3$vars.duration, delay = _this3$vars.delay, immediateRender = _this3$vars.immediateRender, stagger = _this3$vars.stagger, overwrite = _this3$vars.overwrite, keyframes = _this3$vars.keyframes, defaults3 = _this3$vars.defaults, scrollTrigger = _this3$vars.scrollTrigger, yoyoEase = _this3$vars.yoyoEase, parent2 = vars.parent || _globalTimeline, parsedTargets = (_isArray(targets) || _isTypedArray(targets) ? _isNumber(targets[0]) : "length" in vars) ? [targets] : toArray(targets), tl2, i, copy, l, p, curTarget, staggerFunc, staggerVarsToMerge;
    _this3._targets = parsedTargets.length ? _harness(parsedTargets) : _warn("GSAP target " + targets + " not found. https://gsap.com", !_config.nullTargetWarn) || [];
    _this3._ptLookup = [];
    _this3._overwrite = overwrite;
    if (keyframes || stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
      vars = _this3.vars;
      tl2 = _this3.timeline = new Timeline({
        data: "nested",
        defaults: defaults3 || {},
        targets: parent2 && parent2.data === "nested" ? parent2.vars.targets : parsedTargets
      });
      tl2.kill();
      tl2.parent = tl2._dp = _assertThisInitialized(_this3);
      tl2._start = 0;
      if (stagger || _isFuncOrString(duration) || _isFuncOrString(delay)) {
        l = parsedTargets.length;
        staggerFunc = stagger && distribute(stagger);
        if (_isObject(stagger)) {
          for (p in stagger) {
            if (~_staggerTweenProps.indexOf(p)) {
              staggerVarsToMerge || (staggerVarsToMerge = {});
              staggerVarsToMerge[p] = stagger[p];
            }
          }
        }
        for (i = 0; i < l; i++) {
          copy = _copyExcluding(vars, _staggerPropsToSkip);
          copy.stagger = 0;
          yoyoEase && (copy.yoyoEase = yoyoEase);
          staggerVarsToMerge && _merge(copy, staggerVarsToMerge);
          curTarget = parsedTargets[i];
          copy.duration = +_parseFuncOrString(duration, _assertThisInitialized(_this3), i, curTarget, parsedTargets);
          copy.delay = (+_parseFuncOrString(delay, _assertThisInitialized(_this3), i, curTarget, parsedTargets) || 0) - _this3._delay;
          if (!stagger && l === 1 && copy.delay) {
            _this3._delay = delay = copy.delay;
            _this3._start += delay;
            copy.delay = 0;
          }
          tl2.to(curTarget, copy, staggerFunc ? staggerFunc(i, curTarget, parsedTargets) : 0);
          tl2._ease = _easeMap.none;
        }
        tl2.duration() ? duration = delay = 0 : _this3.timeline = 0;
      } else if (keyframes) {
        _inheritDefaults(_setDefaults(tl2.vars.defaults, {
          ease: "none"
        }));
        tl2._ease = _parseEase(keyframes.ease || vars.ease || "none");
        var time = 0, a, kf, v;
        if (_isArray(keyframes)) {
          keyframes.forEach(function(frame) {
            return tl2.to(parsedTargets, frame, ">");
          });
          tl2.duration();
        } else {
          copy = {};
          for (p in keyframes) {
            p === "ease" || p === "easeEach" || _parseKeyframe(p, keyframes[p], copy, keyframes.easeEach);
          }
          for (p in copy) {
            a = copy[p].sort(function(a2, b) {
              return a2.t - b.t;
            });
            time = 0;
            for (i = 0; i < a.length; i++) {
              kf = a[i];
              v = {
                ease: kf.e,
                duration: (kf.t - (i ? a[i - 1].t : 0)) / 100 * duration
              };
              v[p] = kf.v;
              tl2.to(parsedTargets, v, time);
              time += v.duration;
            }
          }
          tl2.duration() < duration && tl2.to({}, {
            duration: duration - tl2.duration()
          });
        }
      }
      duration || _this3.duration(duration = tl2.duration());
    } else {
      _this3.timeline = 0;
    }
    if (overwrite === true && !_suppressOverwrites) {
      _overwritingTween = _assertThisInitialized(_this3);
      _globalTimeline.killTweensOf(parsedTargets);
      _overwritingTween = 0;
    }
    _addToTimeline(parent2, _assertThisInitialized(_this3), position);
    vars.reversed && _this3.reverse();
    vars.paused && _this3.paused(true);
    if (immediateRender || !duration && !keyframes && _this3._start === _roundPrecise(parent2._time) && _isNotFalse(immediateRender) && _hasNoPausedAncestors(_assertThisInitialized(_this3)) && parent2.data !== "nested") {
      _this3._tTime = -_tinyNum;
      _this3.render(Math.max(0, -delay) || 0);
    }
    scrollTrigger && _scrollTrigger(_assertThisInitialized(_this3), scrollTrigger);
    return _this3;
  }
  var _proto3 = Tween2.prototype;
  _proto3.render = function render3(totalTime, suppressEvents, force) {
    var prevTime = this._time, tDur = this._tDur, dur = this._dur, isNegative = totalTime < 0, tTime = totalTime > tDur - _tinyNum && !isNegative ? tDur : totalTime < _tinyNum ? 0 : totalTime, time, pt, iteration, cycleDuration, prevIteration, isYoyo, ratio, timeline2, yoyoEase;
    if (!dur) {
      _renderZeroDurationTween(this, totalTime, suppressEvents, force);
    } else if (tTime !== this._tTime || !totalTime || force || !this._initted && this._tTime || this._startAt && this._zTime < 0 !== isNegative) {
      time = tTime;
      timeline2 = this.timeline;
      if (this._repeat) {
        cycleDuration = dur + this._rDelay;
        if (this._repeat < -1 && isNegative) {
          return this.totalTime(cycleDuration * 100 + totalTime, suppressEvents, force);
        }
        time = _roundPrecise(tTime % cycleDuration);
        if (tTime === tDur) {
          iteration = this._repeat;
          time = dur;
        } else {
          iteration = ~~(tTime / cycleDuration);
          if (iteration && iteration === _roundPrecise(tTime / cycleDuration)) {
            time = dur;
            iteration--;
          }
          time > dur && (time = dur);
        }
        isYoyo = this._yoyo && iteration & 1;
        if (isYoyo) {
          yoyoEase = this._yEase;
          time = dur - time;
        }
        prevIteration = _animationCycle(this._tTime, cycleDuration);
        if (time === prevTime && !force && this._initted && iteration === prevIteration) {
          this._tTime = tTime;
          return this;
        }
        if (iteration !== prevIteration) {
          timeline2 && this._yEase && _propagateYoyoEase(timeline2, isYoyo);
          if (this.vars.repeatRefresh && !isYoyo && !this._lock && this._time !== cycleDuration && this._initted) {
            this._lock = force = 1;
            this.render(_roundPrecise(cycleDuration * iteration), true).invalidate()._lock = 0;
          }
        }
      }
      if (!this._initted) {
        if (_attemptInitTween(this, isNegative ? totalTime : time, force, suppressEvents, tTime)) {
          this._tTime = 0;
          return this;
        }
        if (prevTime !== this._time && !(force && this.vars.repeatRefresh && iteration !== prevIteration)) {
          return this;
        }
        if (dur !== this._dur) {
          return this.render(totalTime, suppressEvents, force);
        }
      }
      this._tTime = tTime;
      this._time = time;
      if (!this._act && this._ts) {
        this._act = 1;
        this._lazy = 0;
      }
      this.ratio = ratio = (yoyoEase || this._ease)(time / dur);
      if (this._from) {
        this.ratio = ratio = 1 - ratio;
      }
      if (time && !prevTime && !suppressEvents && !iteration) {
        _callback(this, "onStart");
        if (this._tTime !== tTime) {
          return this;
        }
      }
      pt = this._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
      timeline2 && timeline2.render(totalTime < 0 ? totalTime : timeline2._dur * timeline2._ease(time / this._dur), suppressEvents, force) || this._startAt && (this._zTime = totalTime);
      if (this._onUpdate && !suppressEvents) {
        isNegative && _rewindStartAt(this, totalTime, suppressEvents, force);
        _callback(this, "onUpdate");
      }
      this._repeat && iteration !== prevIteration && this.vars.onRepeat && !suppressEvents && this.parent && _callback(this, "onRepeat");
      if ((tTime === this._tDur || !tTime) && this._tTime === tTime) {
        isNegative && !this._onUpdate && _rewindStartAt(this, totalTime, true, true);
        (totalTime || !dur) && (tTime === this._tDur && this._ts > 0 || !tTime && this._ts < 0) && _removeFromParent(this, 1);
        if (!suppressEvents && !(isNegative && !prevTime) && (tTime || prevTime || isYoyo)) {
          _callback(this, tTime === tDur ? "onComplete" : "onReverseComplete", true);
          this._prom && !(tTime < tDur && this.timeScale() > 0) && this._prom();
        }
      }
    }
    return this;
  };
  _proto3.targets = function targets() {
    return this._targets;
  };
  _proto3.invalidate = function invalidate(soft) {
    (!soft || !this.vars.runBackwards) && (this._startAt = 0);
    this._pt = this._op = this._onUpdate = this._lazy = this.ratio = 0;
    this._ptLookup = [];
    this.timeline && this.timeline.invalidate(soft);
    return _Animation2.prototype.invalidate.call(this, soft);
  };
  _proto3.resetTo = function resetTo(property, value, start, startIsRelative, skipRecursion) {
    _tickerActive || _ticker.wake();
    this._ts || this.play();
    var time = Math.min(this._dur, (this._dp._time - this._start) * this._ts), ratio;
    this._initted || _initTween(this, time);
    ratio = this._ease(time / this._dur);
    if (_updatePropTweens(this, property, value, start, startIsRelative, ratio, time, skipRecursion)) {
      return this.resetTo(property, value, start, startIsRelative, 1);
    }
    _alignPlayhead(this, 0);
    this.parent || _addLinkedListItem(this._dp, this, "_first", "_last", this._dp._sort ? "_start" : 0);
    return this.render(0);
  };
  _proto3.kill = function kill(targets, vars) {
    if (vars === void 0) {
      vars = "all";
    }
    if (!targets && (!vars || vars === "all")) {
      this._lazy = this._pt = 0;
      return this.parent ? _interrupt(this) : this;
    }
    if (this.timeline) {
      var tDur = this.timeline.totalDuration();
      this.timeline.killTweensOf(targets, vars, _overwritingTween && _overwritingTween.vars.overwrite !== true)._first || _interrupt(this);
      this.parent && tDur !== this.timeline.totalDuration() && _setDuration(this, this._dur * this.timeline._tDur / tDur, 0, 1);
      return this;
    }
    var parsedTargets = this._targets, killingTargets = targets ? toArray(targets) : parsedTargets, propTweenLookup = this._ptLookup, firstPT = this._pt, overwrittenProps, curLookup, curOverwriteProps, props, p, pt, i;
    if ((!vars || vars === "all") && _arraysMatch(parsedTargets, killingTargets)) {
      vars === "all" && (this._pt = 0);
      return _interrupt(this);
    }
    overwrittenProps = this._op = this._op || [];
    if (vars !== "all") {
      if (_isString(vars)) {
        p = {};
        _forEachName(vars, function(name) {
          return p[name] = 1;
        });
        vars = p;
      }
      vars = _addAliasesToVars(parsedTargets, vars);
    }
    i = parsedTargets.length;
    while (i--) {
      if (~killingTargets.indexOf(parsedTargets[i])) {
        curLookup = propTweenLookup[i];
        if (vars === "all") {
          overwrittenProps[i] = vars;
          props = curLookup;
          curOverwriteProps = {};
        } else {
          curOverwriteProps = overwrittenProps[i] = overwrittenProps[i] || {};
          props = vars;
        }
        for (p in props) {
          pt = curLookup && curLookup[p];
          if (pt) {
            if (!("kill" in pt.d) || pt.d.kill(p) === true) {
              _removeLinkedListItem(this, pt, "_pt");
            }
            delete curLookup[p];
          }
          if (curOverwriteProps !== "all") {
            curOverwriteProps[p] = 1;
          }
        }
      }
    }
    this._initted && !this._pt && firstPT && _interrupt(this);
    return this;
  };
  Tween2.to = function to(targets, vars) {
    return new Tween2(targets, vars, arguments[2]);
  };
  Tween2.from = function from(targets, vars) {
    return _createTweenType(1, arguments);
  };
  Tween2.delayedCall = function delayedCall(delay, callback, params, scope) {
    return new Tween2(callback, 0, {
      immediateRender: false,
      lazy: false,
      overwrite: false,
      delay,
      onComplete: callback,
      onReverseComplete: callback,
      onCompleteParams: params,
      onReverseCompleteParams: params,
      callbackScope: scope
    });
  };
  Tween2.fromTo = function fromTo(targets, fromVars, toVars) {
    return _createTweenType(2, arguments);
  };
  Tween2.set = function set(targets, vars) {
    vars.duration = 0;
    vars.repeatDelay || (vars.repeat = 0);
    return new Tween2(targets, vars);
  };
  Tween2.killTweensOf = function killTweensOf(targets, props, onlyActive) {
    return _globalTimeline.killTweensOf(targets, props, onlyActive);
  };
  return Tween2;
}(Animation);
_setDefaults(Tween.prototype, {
  _targets: [],
  _lazy: 0,
  _startAt: 0,
  _op: 0,
  _onInit: 0
});
_forEachName("staggerTo,staggerFrom,staggerFromTo", function(name) {
  Tween[name] = function() {
    var tl2 = new Timeline(), params = _slice.call(arguments, 0);
    params.splice(name === "staggerFromTo" ? 5 : 4, 0, 0);
    return tl2[name].apply(tl2, params);
  };
});
var _setterPlain = function _setterPlain2(target, property, value) {
  return target[property] = value;
}, _setterFunc = function _setterFunc2(target, property, value) {
  return target[property](value);
}, _setterFuncWithParam = function _setterFuncWithParam2(target, property, value, data) {
  return target[property](data.fp, value);
}, _setterAttribute = function _setterAttribute2(target, property, value) {
  return target.setAttribute(property, value);
}, _getSetter = function _getSetter2(target, property) {
  return _isFunction(target[property]) ? _setterFunc : _isUndefined(target[property]) && target.setAttribute ? _setterAttribute : _setterPlain;
}, _renderPlain = function _renderPlain2(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e6) / 1e6, data);
}, _renderBoolean = function _renderBoolean2(ratio, data) {
  return data.set(data.t, data.p, !!(data.s + data.c * ratio), data);
}, _renderComplexString = function _renderComplexString2(ratio, data) {
  var pt = data._pt, s = "";
  if (!ratio && data.b) {
    s = data.b;
  } else if (ratio === 1 && data.e) {
    s = data.e;
  } else {
    while (pt) {
      s = pt.p + (pt.m ? pt.m(pt.s + pt.c * ratio) : Math.round((pt.s + pt.c * ratio) * 1e4) / 1e4) + s;
      pt = pt._next;
    }
    s += data.c;
  }
  data.set(data.t, data.p, s, data);
}, _renderPropTweens = function _renderPropTweens2(ratio, data) {
  var pt = data._pt;
  while (pt) {
    pt.r(ratio, pt.d);
    pt = pt._next;
  }
}, _addPluginModifier = function _addPluginModifier2(modifier, tween, target, property) {
  var pt = this._pt, next2;
  while (pt) {
    next2 = pt._next;
    pt.p === property && pt.modifier(modifier, tween, target);
    pt = next2;
  }
}, _killPropTweensOf = function _killPropTweensOf2(property) {
  var pt = this._pt, hasNonDependentRemaining, next2;
  while (pt) {
    next2 = pt._next;
    if (pt.p === property && !pt.op || pt.op === property) {
      _removeLinkedListItem(this, pt, "_pt");
    } else if (!pt.dep) {
      hasNonDependentRemaining = 1;
    }
    pt = next2;
  }
  return !hasNonDependentRemaining;
}, _setterWithModifier = function _setterWithModifier2(target, property, value, data) {
  data.mSet(target, property, data.m.call(data.tween, value, data.mt), data);
}, _sortPropTweensByPriority = function _sortPropTweensByPriority2(parent2) {
  var pt = parent2._pt, next2, pt2, first, last;
  while (pt) {
    next2 = pt._next;
    pt2 = first;
    while (pt2 && pt2.pr > pt.pr) {
      pt2 = pt2._next;
    }
    if (pt._prev = pt2 ? pt2._prev : last) {
      pt._prev._next = pt;
    } else {
      first = pt;
    }
    if (pt._next = pt2) {
      pt2._prev = pt;
    } else {
      last = pt;
    }
    pt = next2;
  }
  parent2._pt = first;
};
var PropTween = /* @__PURE__ */ function() {
  function PropTween2(next2, target, prop, start, change, renderer, data, setter, priority) {
    this.t = target;
    this.s = start;
    this.c = change;
    this.p = prop;
    this.r = renderer || _renderPlain;
    this.d = data || this;
    this.set = setter || _setterPlain;
    this.pr = priority || 0;
    this._next = next2;
    if (next2) {
      next2._prev = this;
    }
  }
  var _proto4 = PropTween2.prototype;
  _proto4.modifier = function modifier(func, tween, target) {
    this.mSet = this.mSet || this.set;
    this.set = _setterWithModifier;
    this.m = func;
    this.mt = target;
    this.tween = tween;
  };
  return PropTween2;
}();
_forEachName(_callbackNames + "parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger", function(name) {
  return _reservedProps[name] = 1;
});
_globals.TweenMax = _globals.TweenLite = Tween;
_globals.TimelineLite = _globals.TimelineMax = Timeline;
_globalTimeline = new Timeline({
  sortChildren: false,
  defaults: _defaults,
  autoRemoveChildren: true,
  id: "root",
  smoothChildTiming: true
});
_config.stringFilter = _colorStringFilter;
var _media = [], _listeners = {}, _emptyArray = [], _lastMediaTime = 0, _contextID = 0, _dispatch = function _dispatch2(type) {
  return (_listeners[type] || _emptyArray).map(function(f) {
    return f();
  });
}, _onMediaChange = function _onMediaChange2() {
  var time = Date.now(), matches = [];
  if (time - _lastMediaTime > 2) {
    _dispatch("matchMediaInit");
    _media.forEach(function(c) {
      var queries = c.queries, conditions = c.conditions, match, p, anyMatch, toggled;
      for (p in queries) {
        match = _win$1.matchMedia(queries[p]).matches;
        match && (anyMatch = 1);
        if (match !== conditions[p]) {
          conditions[p] = match;
          toggled = 1;
        }
      }
      if (toggled) {
        c.revert();
        anyMatch && matches.push(c);
      }
    });
    _dispatch("matchMediaRevert");
    matches.forEach(function(c) {
      return c.onMatch(c, function(func) {
        return c.add(null, func);
      });
    });
    _lastMediaTime = time;
    _dispatch("matchMedia");
  }
};
var Context = /* @__PURE__ */ function() {
  function Context2(func, scope) {
    this.selector = scope && selector(scope);
    this.data = [];
    this._r = [];
    this.isReverted = false;
    this.id = _contextID++;
    func && this.add(func);
  }
  var _proto5 = Context2.prototype;
  _proto5.add = function add(name, func, scope) {
    if (_isFunction(name)) {
      scope = func;
      func = name;
      name = _isFunction;
    }
    var self2 = this, f = function f2() {
      var prev2 = _context, prevSelector = self2.selector, result;
      prev2 && prev2 !== self2 && prev2.data.push(self2);
      scope && (self2.selector = selector(scope));
      _context = self2;
      result = func.apply(self2, arguments);
      _isFunction(result) && self2._r.push(result);
      _context = prev2;
      self2.selector = prevSelector;
      self2.isReverted = false;
      return result;
    };
    self2.last = f;
    return name === _isFunction ? f(self2, function(func2) {
      return self2.add(null, func2);
    }) : name ? self2[name] = f : f;
  };
  _proto5.ignore = function ignore(func) {
    var prev2 = _context;
    _context = null;
    func(this);
    _context = prev2;
  };
  _proto5.getTweens = function getTweens() {
    var a = [];
    this.data.forEach(function(e) {
      return e instanceof Context2 ? a.push.apply(a, e.getTweens()) : e instanceof Tween && !(e.parent && e.parent.data === "nested") && a.push(e);
    });
    return a;
  };
  _proto5.clear = function clear() {
    this._r.length = this.data.length = 0;
  };
  _proto5.kill = function kill(revert, matchMedia2) {
    var _this4 = this;
    if (revert) {
      (function() {
        var tweens = _this4.getTweens(), i2 = _this4.data.length, t;
        while (i2--) {
          t = _this4.data[i2];
          if (t.data === "isFlip") {
            t.revert();
            t.getChildren(true, true, false).forEach(function(tween) {
              return tweens.splice(tweens.indexOf(tween), 1);
            });
          }
        }
        tweens.map(function(t2) {
          return {
            g: t2._dur || t2._delay || t2._sat && !t2._sat.vars.immediateRender ? t2.globalTime(0) : -Infinity,
            t: t2
          };
        }).sort(function(a, b) {
          return b.g - a.g || -Infinity;
        }).forEach(function(o) {
          return o.t.revert(revert);
        });
        i2 = _this4.data.length;
        while (i2--) {
          t = _this4.data[i2];
          if (t instanceof Timeline) {
            if (t.data !== "nested") {
              t.scrollTrigger && t.scrollTrigger.revert();
              t.kill();
            }
          } else {
            !(t instanceof Tween) && t.revert && t.revert(revert);
          }
        }
        _this4._r.forEach(function(f) {
          return f(revert, _this4);
        });
        _this4.isReverted = true;
      })();
    } else {
      this.data.forEach(function(e) {
        return e.kill && e.kill();
      });
    }
    this.clear();
    if (matchMedia2) {
      var i = _media.length;
      while (i--) {
        _media[i].id === this.id && _media.splice(i, 1);
      }
    }
  };
  _proto5.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  return Context2;
}();
var MatchMedia = /* @__PURE__ */ function() {
  function MatchMedia2(scope) {
    this.contexts = [];
    this.scope = scope;
    _context && _context.data.push(this);
  }
  var _proto6 = MatchMedia2.prototype;
  _proto6.add = function add(conditions, func, scope) {
    _isObject(conditions) || (conditions = {
      matches: conditions
    });
    var context3 = new Context(0, scope || this.scope), cond = context3.conditions = {}, mq, p, active;
    _context && !context3.selector && (context3.selector = _context.selector);
    this.contexts.push(context3);
    func = context3.add("onMatch", func);
    context3.queries = conditions;
    for (p in conditions) {
      if (p === "all") {
        active = 1;
      } else {
        mq = _win$1.matchMedia(conditions[p]);
        if (mq) {
          _media.indexOf(context3) < 0 && _media.push(context3);
          (cond[p] = mq.matches) && (active = 1);
          mq.addListener ? mq.addListener(_onMediaChange) : mq.addEventListener("change", _onMediaChange);
        }
      }
    }
    active && func(context3, function(f) {
      return context3.add(null, f);
    });
    return this;
  };
  _proto6.revert = function revert(config3) {
    this.kill(config3 || {});
  };
  _proto6.kill = function kill(revert) {
    this.contexts.forEach(function(c) {
      return c.kill(revert, true);
    });
  };
  return MatchMedia2;
}();
var _gsap = {
  registerPlugin: function registerPlugin() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    args.forEach(function(config3) {
      return _createPlugin(config3);
    });
  },
  timeline: function timeline(vars) {
    return new Timeline(vars);
  },
  getTweensOf: function getTweensOf(targets, onlyActive) {
    return _globalTimeline.getTweensOf(targets, onlyActive);
  },
  getProperty: function getProperty(target, property, unit, uncache) {
    _isString(target) && (target = toArray(target)[0]);
    var getter = _getCache(target || {}).get, format = unit ? _passThrough : _numericIfPossible;
    unit === "native" && (unit = "");
    return !target ? target : !property ? function(property2, unit2, uncache2) {
      return format((_plugins[property2] && _plugins[property2].get || getter)(target, property2, unit2, uncache2));
    } : format((_plugins[property] && _plugins[property].get || getter)(target, property, unit, uncache));
  },
  quickSetter: function quickSetter(target, property, unit) {
    target = toArray(target);
    if (target.length > 1) {
      var setters = target.map(function(t) {
        return gsap.quickSetter(t, property, unit);
      }), l = setters.length;
      return function(value) {
        var i = l;
        while (i--) {
          setters[i](value);
        }
      };
    }
    target = target[0] || {};
    var Plugin = _plugins[property], cache2 = _getCache(target), p = cache2.harness && (cache2.harness.aliases || {})[property] || property, setter = Plugin ? function(value) {
      var p2 = new Plugin();
      _quickTween._pt = 0;
      p2.init(target, unit ? value + unit : value, _quickTween, 0, [target]);
      p2.render(1, p2);
      _quickTween._pt && _renderPropTweens(1, _quickTween);
    } : cache2.set(target, p);
    return Plugin ? setter : function(value) {
      return setter(target, p, unit ? value + unit : value, cache2, 1);
    };
  },
  quickTo: function quickTo(target, property, vars) {
    var _merge22;
    var tween = gsap.to(target, _merge((_merge22 = {}, _merge22[property] = "+=0.1", _merge22.paused = true, _merge22), vars || {})), func = function func2(value, start, startIsRelative) {
      return tween.resetTo(property, value, start, startIsRelative);
    };
    func.tween = tween;
    return func;
  },
  isTweening: function isTweening(targets) {
    return _globalTimeline.getTweensOf(targets, true).length > 0;
  },
  defaults: function defaults2(value) {
    value && value.ease && (value.ease = _parseEase(value.ease, _defaults.ease));
    return _mergeDeep(_defaults, value || {});
  },
  config: function config2(value) {
    return _mergeDeep(_config, value || {});
  },
  registerEffect: function registerEffect(_ref3) {
    var name = _ref3.name, effect = _ref3.effect, plugins = _ref3.plugins, defaults3 = _ref3.defaults, extendTimeline = _ref3.extendTimeline;
    (plugins || "").split(",").forEach(function(pluginName) {
      return pluginName && !_plugins[pluginName] && !_globals[pluginName] && _warn(name + " effect requires " + pluginName + " plugin.");
    });
    _effects[name] = function(targets, vars, tl2) {
      return effect(toArray(targets), _setDefaults(vars || {}, defaults3), tl2);
    };
    if (extendTimeline) {
      Timeline.prototype[name] = function(targets, vars, position) {
        return this.add(_effects[name](targets, _isObject(vars) ? vars : (position = vars) && {}, this), position);
      };
    }
  },
  registerEase: function registerEase(name, ease) {
    _easeMap[name] = _parseEase(ease);
  },
  parseEase: function parseEase(ease, defaultEase) {
    return arguments.length ? _parseEase(ease, defaultEase) : _easeMap;
  },
  getById: function getById(id) {
    return _globalTimeline.getById(id);
  },
  exportRoot: function exportRoot(vars, includeDelayedCalls) {
    if (vars === void 0) {
      vars = {};
    }
    var tl2 = new Timeline(vars), child, next2;
    tl2.smoothChildTiming = _isNotFalse(vars.smoothChildTiming);
    _globalTimeline.remove(tl2);
    tl2._dp = 0;
    tl2._time = tl2._tTime = _globalTimeline._time;
    child = _globalTimeline._first;
    while (child) {
      next2 = child._next;
      if (includeDelayedCalls || !(!child._dur && child instanceof Tween && child.vars.onComplete === child._targets[0])) {
        _addToTimeline(tl2, child, child._start - child._delay);
      }
      child = next2;
    }
    _addToTimeline(_globalTimeline, tl2, 0);
    return tl2;
  },
  context: function context(func, scope) {
    return func ? new Context(func, scope) : _context;
  },
  matchMedia: function matchMedia(scope) {
    return new MatchMedia(scope);
  },
  matchMediaRefresh: function matchMediaRefresh() {
    return _media.forEach(function(c) {
      var cond = c.conditions, found, p;
      for (p in cond) {
        if (cond[p]) {
          cond[p] = false;
          found = 1;
        }
      }
      found && c.revert();
    }) || _onMediaChange();
  },
  addEventListener: function addEventListener(type, callback) {
    var a = _listeners[type] || (_listeners[type] = []);
    ~a.indexOf(callback) || a.push(callback);
  },
  removeEventListener: function removeEventListener(type, callback) {
    var a = _listeners[type], i = a && a.indexOf(callback);
    i >= 0 && a.splice(i, 1);
  },
  utils: {
    wrap,
    wrapYoyo,
    distribute,
    random,
    snap,
    normalize,
    getUnit,
    clamp,
    splitColor,
    toArray,
    selector,
    mapRange,
    pipe,
    unitize,
    interpolate,
    shuffle
  },
  install: _install,
  effects: _effects,
  ticker: _ticker,
  updateRoot: Timeline.updateRoot,
  plugins: _plugins,
  globalTimeline: _globalTimeline,
  core: {
    PropTween,
    globals: _addGlobal,
    Tween,
    Timeline,
    Animation,
    getCache: _getCache,
    _removeLinkedListItem,
    reverting: function reverting() {
      return _reverting$1;
    },
    context: function context2(toAdd) {
      if (toAdd && _context) {
        _context.data.push(toAdd);
        toAdd._ctx = _context;
      }
      return _context;
    },
    suppressOverwrites: function suppressOverwrites(value) {
      return _suppressOverwrites = value;
    }
  }
};
_forEachName("to,from,fromTo,delayedCall,set,killTweensOf", function(name) {
  return _gsap[name] = Tween[name];
});
_ticker.add(Timeline.updateRoot);
_quickTween = _gsap.to({}, {
  duration: 0
});
var _getPluginPropTween = function _getPluginPropTween2(plugin, prop) {
  var pt = plugin._pt;
  while (pt && pt.p !== prop && pt.op !== prop && pt.fp !== prop) {
    pt = pt._next;
  }
  return pt;
}, _addModifiers = function _addModifiers2(tween, modifiers) {
  var targets = tween._targets, p, i, pt;
  for (p in modifiers) {
    i = targets.length;
    while (i--) {
      pt = tween._ptLookup[i][p];
      if (pt && (pt = pt.d)) {
        if (pt._pt) {
          pt = _getPluginPropTween(pt, p);
        }
        pt && pt.modifier && pt.modifier(modifiers[p], tween, targets[i], p);
      }
    }
  }
}, _buildModifierPlugin = function _buildModifierPlugin2(name, modifier) {
  return {
    name,
    rawVars: 1,
    //don't pre-process function-based values or "random()" strings.
    init: function init4(target, vars, tween) {
      tween._onInit = function(tween2) {
        var temp, p;
        if (_isString(vars)) {
          temp = {};
          _forEachName(vars, function(name2) {
            return temp[name2] = 1;
          });
          vars = temp;
        }
        if (modifier) {
          temp = {};
          for (p in vars) {
            temp[p] = modifier(vars[p]);
          }
          vars = temp;
        }
        _addModifiers(tween2, vars);
      };
    }
  };
};
var gsap = _gsap.registerPlugin({
  name: "attr",
  init: function init(target, vars, tween, index2, targets) {
    var p, pt, v;
    this.tween = tween;
    for (p in vars) {
      v = target.getAttribute(p) || "";
      pt = this.add(target, "setAttribute", (v || 0) + "", vars[p], index2, targets, 0, 0, p);
      pt.op = p;
      pt.b = v;
      this._props.push(p);
    }
  },
  render: function render(ratio, data) {
    var pt = data._pt;
    while (pt) {
      _reverting$1 ? pt.set(pt.t, pt.p, pt.b, pt) : pt.r(ratio, pt.d);
      pt = pt._next;
    }
  }
}, {
  name: "endArray",
  init: function init2(target, value) {
    var i = value.length;
    while (i--) {
      this.add(target, i, target[i] || 0, value[i], 0, 0, 0, 0, 0, 1);
    }
  }
}, _buildModifierPlugin("roundProps", _roundModifier), _buildModifierPlugin("modifiers"), _buildModifierPlugin("snap", snap)) || _gsap;
Tween.version = Timeline.version = gsap.version = "3.12.5";
_coreReady = 1;
_windowExists$1() && _wake();
_easeMap.Power0;
_easeMap.Power1;
_easeMap.Power2;
_easeMap.Power3;
_easeMap.Power4;
_easeMap.Linear;
_easeMap.Quad;
_easeMap.Cubic;
_easeMap.Quart;
_easeMap.Quint;
_easeMap.Strong;
_easeMap.Elastic;
_easeMap.Back;
_easeMap.SteppedEase;
_easeMap.Bounce;
_easeMap.Sine;
_easeMap.Expo;
_easeMap.Circ;
/*!
 * CSSPlugin 3.12.5
 * https://gsap.com
 *
 * Copyright 2008-2024, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license or for
 * Club GSAP members, the agreement issued with that membership.
 * @author: Jack Doyle, jack@greensock.com
*/
var _win, _doc, _docElement, _pluginInitted, _tempDiv, _recentSetterPlugin, _reverting, _windowExists2 = function _windowExists3() {
  return typeof window !== "undefined";
}, _transformProps = {}, _RAD2DEG = 180 / Math.PI, _DEG2RAD = Math.PI / 180, _atan2 = Math.atan2, _bigNum = 1e8, _capsExp = /([A-Z])/g, _horizontalExp = /(left|right|width|margin|padding|x)/i, _complexExp = /[\s,\(]\S/, _propertyAliases = {
  autoAlpha: "opacity,visibility",
  scale: "scaleX,scaleY",
  alpha: "opacity"
}, _renderCSSProp = function _renderCSSProp2(ratio, data) {
  return data.set(data.t, data.p, Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderPropWithEnd = function _renderPropWithEnd2(ratio, data) {
  return data.set(data.t, data.p, ratio === 1 ? data.e : Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u, data);
}, _renderCSSPropWithBeginning = function _renderCSSPropWithBeginning2(ratio, data) {
  return data.set(data.t, data.p, ratio ? Math.round((data.s + data.c * ratio) * 1e4) / 1e4 + data.u : data.b, data);
}, _renderRoundedCSSProp = function _renderRoundedCSSProp2(ratio, data) {
  var value = data.s + data.c * ratio;
  data.set(data.t, data.p, ~~(value + (value < 0 ? -0.5 : 0.5)) + data.u, data);
}, _renderNonTweeningValue = function _renderNonTweeningValue2(ratio, data) {
  return data.set(data.t, data.p, ratio ? data.e : data.b, data);
}, _renderNonTweeningValueOnlyAtEnd = function _renderNonTweeningValueOnlyAtEnd2(ratio, data) {
  return data.set(data.t, data.p, ratio !== 1 ? data.b : data.e, data);
}, _setterCSSStyle = function _setterCSSStyle2(target, property, value) {
  return target.style[property] = value;
}, _setterCSSProp = function _setterCSSProp2(target, property, value) {
  return target.style.setProperty(property, value);
}, _setterTransform = function _setterTransform2(target, property, value) {
  return target._gsap[property] = value;
}, _setterScale = function _setterScale2(target, property, value) {
  return target._gsap.scaleX = target._gsap.scaleY = value;
}, _setterScaleWithRender = function _setterScaleWithRender2(target, property, value, data, ratio) {
  var cache2 = target._gsap;
  cache2.scaleX = cache2.scaleY = value;
  cache2.renderTransform(ratio, cache2);
}, _setterTransformWithRender = function _setterTransformWithRender2(target, property, value, data, ratio) {
  var cache2 = target._gsap;
  cache2[property] = value;
  cache2.renderTransform(ratio, cache2);
}, _transformProp = "transform", _transformOriginProp = _transformProp + "Origin", _saveStyle = function _saveStyle2(property, isNotCSS) {
  var _this = this;
  var target = this.target, style2 = target.style, cache2 = target._gsap;
  if (property in _transformProps && style2) {
    this.tfm = this.tfm || {};
    if (property !== "transform") {
      property = _propertyAliases[property] || property;
      ~property.indexOf(",") ? property.split(",").forEach(function(a) {
        return _this.tfm[a] = _get(target, a);
      }) : this.tfm[property] = cache2.x ? cache2[property] : _get(target, property);
      property === _transformOriginProp && (this.tfm.zOrigin = cache2.zOrigin);
    } else {
      return _propertyAliases.transform.split(",").forEach(function(p) {
        return _saveStyle2.call(_this, p, isNotCSS);
      });
    }
    if (this.props.indexOf(_transformProp) >= 0) {
      return;
    }
    if (cache2.svg) {
      this.svgo = target.getAttribute("data-svg-origin");
      this.props.push(_transformOriginProp, isNotCSS, "");
    }
    property = _transformProp;
  }
  (style2 || isNotCSS) && this.props.push(property, isNotCSS, style2[property]);
}, _removeIndependentTransforms = function _removeIndependentTransforms2(style2) {
  if (style2.translate) {
    style2.removeProperty("translate");
    style2.removeProperty("scale");
    style2.removeProperty("rotate");
  }
}, _revertStyle = function _revertStyle2() {
  var props = this.props, target = this.target, style2 = target.style, cache2 = target._gsap, i, p;
  for (i = 0; i < props.length; i += 3) {
    props[i + 1] ? target[props[i]] = props[i + 2] : props[i + 2] ? style2[props[i]] = props[i + 2] : style2.removeProperty(props[i].substr(0, 2) === "--" ? props[i] : props[i].replace(_capsExp, "-$1").toLowerCase());
  }
  if (this.tfm) {
    for (p in this.tfm) {
      cache2[p] = this.tfm[p];
    }
    if (cache2.svg) {
      cache2.renderTransform();
      target.setAttribute("data-svg-origin", this.svgo || "");
    }
    i = _reverting();
    if ((!i || !i.isStart) && !style2[_transformProp]) {
      _removeIndependentTransforms(style2);
      if (cache2.zOrigin && style2[_transformOriginProp]) {
        style2[_transformOriginProp] += " " + cache2.zOrigin + "px";
        cache2.zOrigin = 0;
        cache2.renderTransform();
      }
      cache2.uncache = 1;
    }
  }
}, _getStyleSaver = function _getStyleSaver2(target, properties) {
  var saver = {
    target,
    props: [],
    revert: _revertStyle,
    save: _saveStyle
  };
  target._gsap || gsap.core.getCache(target);
  properties && properties.split(",").forEach(function(p) {
    return saver.save(p);
  });
  return saver;
}, _supports3D, _createElement = function _createElement2(type, ns) {
  var e = _doc.createElementNS ? _doc.createElementNS((ns || "http://www.w3.org/1999/xhtml").replace(/^https/, "http"), type) : _doc.createElement(type);
  return e && e.style ? e : _doc.createElement(type);
}, _getComputedProperty = function _getComputedProperty2(target, property, skipPrefixFallback) {
  var cs = getComputedStyle(target);
  return cs[property] || cs.getPropertyValue(property.replace(_capsExp, "-$1").toLowerCase()) || cs.getPropertyValue(property) || !skipPrefixFallback && _getComputedProperty2(target, _checkPropPrefix(property) || property, 1) || "";
}, _prefixes = "O,Moz,ms,Ms,Webkit".split(","), _checkPropPrefix = function _checkPropPrefix2(property, element, preferPrefix) {
  var e = element || _tempDiv, s = e.style, i = 5;
  if (property in s && !preferPrefix) {
    return property;
  }
  property = property.charAt(0).toUpperCase() + property.substr(1);
  while (i-- && !(_prefixes[i] + property in s)) {
  }
  return i < 0 ? null : (i === 3 ? "ms" : i >= 0 ? _prefixes[i] : "") + property;
}, _initCore = function _initCore2() {
  if (_windowExists2() && window.document) {
    _win = window;
    _doc = _win.document;
    _docElement = _doc.documentElement;
    _tempDiv = _createElement("div") || {
      style: {}
    };
    _createElement("div");
    _transformProp = _checkPropPrefix(_transformProp);
    _transformOriginProp = _transformProp + "Origin";
    _tempDiv.style.cssText = "border-width:0;line-height:0;position:absolute;padding:0";
    _supports3D = !!_checkPropPrefix("perspective");
    _reverting = gsap.core.reverting;
    _pluginInitted = 1;
  }
}, _getBBoxHack = function _getBBoxHack2(swapIfPossible) {
  var svg = _createElement("svg", this.ownerSVGElement && this.ownerSVGElement.getAttribute("xmlns") || "http://www.w3.org/2000/svg"), oldParent = this.parentNode, oldSibling = this.nextSibling, oldCSS = this.style.cssText, bbox;
  _docElement.appendChild(svg);
  svg.appendChild(this);
  this.style.display = "block";
  if (swapIfPossible) {
    try {
      bbox = this.getBBox();
      this._gsapBBox = this.getBBox;
      this.getBBox = _getBBoxHack2;
    } catch (e) {
    }
  } else if (this._gsapBBox) {
    bbox = this._gsapBBox();
  }
  if (oldParent) {
    if (oldSibling) {
      oldParent.insertBefore(this, oldSibling);
    } else {
      oldParent.appendChild(this);
    }
  }
  _docElement.removeChild(svg);
  this.style.cssText = oldCSS;
  return bbox;
}, _getAttributeFallbacks = function _getAttributeFallbacks2(target, attributesArray) {
  var i = attributesArray.length;
  while (i--) {
    if (target.hasAttribute(attributesArray[i])) {
      return target.getAttribute(attributesArray[i]);
    }
  }
}, _getBBox = function _getBBox2(target) {
  var bounds;
  try {
    bounds = target.getBBox();
  } catch (error2) {
    bounds = _getBBoxHack.call(target, true);
  }
  bounds && (bounds.width || bounds.height) || target.getBBox === _getBBoxHack || (bounds = _getBBoxHack.call(target, true));
  return bounds && !bounds.width && !bounds.x && !bounds.y ? {
    x: +_getAttributeFallbacks(target, ["x", "cx", "x1"]) || 0,
    y: +_getAttributeFallbacks(target, ["y", "cy", "y1"]) || 0,
    width: 0,
    height: 0
  } : bounds;
}, _isSVG = function _isSVG2(e) {
  return !!(e.getCTM && (!e.parentNode || e.ownerSVGElement) && _getBBox(e));
}, _removeProperty = function _removeProperty2(target, property) {
  if (property) {
    var style2 = target.style, first2Chars;
    if (property in _transformProps && property !== _transformOriginProp) {
      property = _transformProp;
    }
    if (style2.removeProperty) {
      first2Chars = property.substr(0, 2);
      if (first2Chars === "ms" || property.substr(0, 6) === "webkit") {
        property = "-" + property;
      }
      style2.removeProperty(first2Chars === "--" ? property : property.replace(_capsExp, "-$1").toLowerCase());
    } else {
      style2.removeAttribute(property);
    }
  }
}, _addNonTweeningPT = function _addNonTweeningPT2(plugin, target, property, beginning, end, onlySetAtEnd) {
  var pt = new PropTween(plugin._pt, target, property, 0, 1, onlySetAtEnd ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue);
  plugin._pt = pt;
  pt.b = beginning;
  pt.e = end;
  plugin._props.push(property);
  return pt;
}, _nonConvertibleUnits = {
  deg: 1,
  rad: 1,
  turn: 1
}, _nonStandardLayouts = {
  grid: 1,
  flex: 1
}, _convertToUnit = function _convertToUnit2(target, property, value, unit) {
  var curValue = parseFloat(value) || 0, curUnit = (value + "").trim().substr((curValue + "").length) || "px", style2 = _tempDiv.style, horizontal = _horizontalExp.test(property), isRootSVG = target.tagName.toLowerCase() === "svg", measureProperty = (isRootSVG ? "client" : "offset") + (horizontal ? "Width" : "Height"), amount = 100, toPixels = unit === "px", toPercent = unit === "%", px, parent2, cache2, isSVG;
  if (unit === curUnit || !curValue || _nonConvertibleUnits[unit] || _nonConvertibleUnits[curUnit]) {
    return curValue;
  }
  curUnit !== "px" && !toPixels && (curValue = _convertToUnit2(target, property, value, "px"));
  isSVG = target.getCTM && _isSVG(target);
  if ((toPercent || curUnit === "%") && (_transformProps[property] || ~property.indexOf("adius"))) {
    px = isSVG ? target.getBBox()[horizontal ? "width" : "height"] : target[measureProperty];
    return _round(toPercent ? curValue / px * amount : curValue / 100 * px);
  }
  style2[horizontal ? "width" : "height"] = amount + (toPixels ? curUnit : unit);
  parent2 = ~property.indexOf("adius") || unit === "em" && target.appendChild && !isRootSVG ? target : target.parentNode;
  if (isSVG) {
    parent2 = (target.ownerSVGElement || {}).parentNode;
  }
  if (!parent2 || parent2 === _doc || !parent2.appendChild) {
    parent2 = _doc.body;
  }
  cache2 = parent2._gsap;
  if (cache2 && toPercent && cache2.width && horizontal && cache2.time === _ticker.time && !cache2.uncache) {
    return _round(curValue / cache2.width * amount);
  } else {
    if (toPercent && (property === "height" || property === "width")) {
      var v = target.style[property];
      target.style[property] = amount + unit;
      px = target[measureProperty];
      v ? target.style[property] = v : _removeProperty(target, property);
    } else {
      (toPercent || curUnit === "%") && !_nonStandardLayouts[_getComputedProperty(parent2, "display")] && (style2.position = _getComputedProperty(target, "position"));
      parent2 === target && (style2.position = "static");
      parent2.appendChild(_tempDiv);
      px = _tempDiv[measureProperty];
      parent2.removeChild(_tempDiv);
      style2.position = "absolute";
    }
    if (horizontal && toPercent) {
      cache2 = _getCache(parent2);
      cache2.time = _ticker.time;
      cache2.width = parent2[measureProperty];
    }
  }
  return _round(toPixels ? px * curValue / amount : px && curValue ? amount / px * curValue : 0);
}, _get = function _get2(target, property, unit, uncache) {
  var value;
  _pluginInitted || _initCore();
  if (property in _propertyAliases && property !== "transform") {
    property = _propertyAliases[property];
    if (~property.indexOf(",")) {
      property = property.split(",")[0];
    }
  }
  if (_transformProps[property] && property !== "transform") {
    value = _parseTransform(target, uncache);
    value = property !== "transformOrigin" ? value[property] : value.svg ? value.origin : _firstTwoOnly(_getComputedProperty(target, _transformOriginProp)) + " " + value.zOrigin + "px";
  } else {
    value = target.style[property];
    if (!value || value === "auto" || uncache || ~(value + "").indexOf("calc(")) {
      value = _specialProps[property] && _specialProps[property](target, property, unit) || _getComputedProperty(target, property) || _getProperty(target, property) || (property === "opacity" ? 1 : 0);
    }
  }
  return unit && !~(value + "").trim().indexOf(" ") ? _convertToUnit(target, property, value, unit) + unit : value;
}, _tweenComplexCSSString = function _tweenComplexCSSString2(target, prop, start, end) {
  if (!start || start === "none") {
    var p = _checkPropPrefix(prop, target, 1), s = p && _getComputedProperty(target, p, 1);
    if (s && s !== start) {
      prop = p;
      start = s;
    } else if (prop === "borderColor") {
      start = _getComputedProperty(target, "borderTopColor");
    }
  }
  var pt = new PropTween(this._pt, target.style, prop, 0, 1, _renderComplexString), index2 = 0, matchIndex = 0, a, result, startValues, startNum, color, startValue, endValue, endNum, chunk, endUnit, startUnit, endValues;
  pt.b = start;
  pt.e = end;
  start += "";
  end += "";
  if (end === "auto") {
    startValue = target.style[prop];
    target.style[prop] = end;
    end = _getComputedProperty(target, prop) || end;
    startValue ? target.style[prop] = startValue : _removeProperty(target, prop);
  }
  a = [start, end];
  _colorStringFilter(a);
  start = a[0];
  end = a[1];
  startValues = start.match(_numWithUnitExp) || [];
  endValues = end.match(_numWithUnitExp) || [];
  if (endValues.length) {
    while (result = _numWithUnitExp.exec(end)) {
      endValue = result[0];
      chunk = end.substring(index2, result.index);
      if (color) {
        color = (color + 1) % 5;
      } else if (chunk.substr(-5) === "rgba(" || chunk.substr(-5) === "hsla(") {
        color = 1;
      }
      if (endValue !== (startValue = startValues[matchIndex++] || "")) {
        startNum = parseFloat(startValue) || 0;
        startUnit = startValue.substr((startNum + "").length);
        endValue.charAt(1) === "=" && (endValue = _parseRelative(startNum, endValue) + startUnit);
        endNum = parseFloat(endValue);
        endUnit = endValue.substr((endNum + "").length);
        index2 = _numWithUnitExp.lastIndex - endUnit.length;
        if (!endUnit) {
          endUnit = endUnit || _config.units[prop] || startUnit;
          if (index2 === end.length) {
            end += endUnit;
            pt.e += endUnit;
          }
        }
        if (startUnit !== endUnit) {
          startNum = _convertToUnit(target, prop, startValue, endUnit) || 0;
        }
        pt._pt = {
          _next: pt._pt,
          p: chunk || matchIndex === 1 ? chunk : ",",
          //note: SVG spec allows omission of comma/space when a negative sign is wedged between two numbers, like 2.5-5.3 instead of 2.5,-5.3 but when tweening, the negative value may switch to positive, so we insert the comma just in case.
          s: startNum,
          c: endNum - startNum,
          m: color && color < 4 || prop === "zIndex" ? Math.round : 0
        };
      }
    }
    pt.c = index2 < end.length ? end.substring(index2, end.length) : "";
  } else {
    pt.r = prop === "display" && end === "none" ? _renderNonTweeningValueOnlyAtEnd : _renderNonTweeningValue;
  }
  _relExp.test(end) && (pt.e = 0);
  this._pt = pt;
  return pt;
}, _keywordToPercent = {
  top: "0%",
  bottom: "100%",
  left: "0%",
  right: "100%",
  center: "50%"
}, _convertKeywordsToPercentages = function _convertKeywordsToPercentages2(value) {
  var split = value.split(" "), x = split[0], y = split[1] || "50%";
  if (x === "top" || x === "bottom" || y === "left" || y === "right") {
    value = x;
    x = y;
    y = value;
  }
  split[0] = _keywordToPercent[x] || x;
  split[1] = _keywordToPercent[y] || y;
  return split.join(" ");
}, _renderClearProps = function _renderClearProps2(ratio, data) {
  if (data.tween && data.tween._time === data.tween._dur) {
    var target = data.t, style2 = target.style, props = data.u, cache2 = target._gsap, prop, clearTransforms, i;
    if (props === "all" || props === true) {
      style2.cssText = "";
      clearTransforms = 1;
    } else {
      props = props.split(",");
      i = props.length;
      while (--i > -1) {
        prop = props[i];
        if (_transformProps[prop]) {
          clearTransforms = 1;
          prop = prop === "transformOrigin" ? _transformOriginProp : _transformProp;
        }
        _removeProperty(target, prop);
      }
    }
    if (clearTransforms) {
      _removeProperty(target, _transformProp);
      if (cache2) {
        cache2.svg && target.removeAttribute("transform");
        _parseTransform(target, 1);
        cache2.uncache = 1;
        _removeIndependentTransforms(style2);
      }
    }
  }
}, _specialProps = {
  clearProps: function clearProps(plugin, target, property, endValue, tween) {
    if (tween.data !== "isFromStart") {
      var pt = plugin._pt = new PropTween(plugin._pt, target, property, 0, 0, _renderClearProps);
      pt.u = endValue;
      pt.pr = -10;
      pt.tween = tween;
      plugin._props.push(property);
      return 1;
    }
  }
  /* className feature (about 0.4kb gzipped).
  , className(plugin, target, property, endValue, tween) {
  	let _renderClassName = (ratio, data) => {
  			data.css.render(ratio, data.css);
  			if (!ratio || ratio === 1) {
  				let inline = data.rmv,
  					target = data.t,
  					p;
  				target.setAttribute("class", ratio ? data.e : data.b);
  				for (p in inline) {
  					_removeProperty(target, p);
  				}
  			}
  		},
  		_getAllStyles = (target) => {
  			let styles = {},
  				computed = getComputedStyle(target),
  				p;
  			for (p in computed) {
  				if (isNaN(p) && p !== "cssText" && p !== "length") {
  					styles[p] = computed[p];
  				}
  			}
  			_setDefaults(styles, _parseTransform(target, 1));
  			return styles;
  		},
  		startClassList = target.getAttribute("class"),
  		style = target.style,
  		cssText = style.cssText,
  		cache = target._gsap,
  		classPT = cache.classPT,
  		inlineToRemoveAtEnd = {},
  		data = {t:target, plugin:plugin, rmv:inlineToRemoveAtEnd, b:startClassList, e:(endValue.charAt(1) !== "=") ? endValue : startClassList.replace(new RegExp("(?:\\s|^)" + endValue.substr(2) + "(?![\\w-])"), "") + ((endValue.charAt(0) === "+") ? " " + endValue.substr(2) : "")},
  		changingVars = {},
  		startVars = _getAllStyles(target),
  		transformRelated = /(transform|perspective)/i,
  		endVars, p;
  	if (classPT) {
  		classPT.r(1, classPT.d);
  		_removeLinkedListItem(classPT.d.plugin, classPT, "_pt");
  	}
  	target.setAttribute("class", data.e);
  	endVars = _getAllStyles(target, true);
  	target.setAttribute("class", startClassList);
  	for (p in endVars) {
  		if (endVars[p] !== startVars[p] && !transformRelated.test(p)) {
  			changingVars[p] = endVars[p];
  			if (!style[p] && style[p] !== "0") {
  				inlineToRemoveAtEnd[p] = 1;
  			}
  		}
  	}
  	cache.classPT = plugin._pt = new PropTween(plugin._pt, target, "className", 0, 0, _renderClassName, data, 0, -11);
  	if (style.cssText !== cssText) { //only apply if things change. Otherwise, in cases like a background-image that's pulled dynamically, it could cause a refresh. See https://gsap.com/forums/topic/20368-possible-gsap-bug-switching-classnames-in-chrome/.
  		style.cssText = cssText; //we recorded cssText before we swapped classes and ran _getAllStyles() because in cases when a className tween is overwritten, we remove all the related tweening properties from that class change (otherwise class-specific stuff can't override properties we've directly set on the target's style object due to specificity).
  	}
  	_parseTransform(target, true); //to clear the caching of transforms
  	data.css = new gsap.plugins.css();
  	data.css.init(target, changingVars, tween);
  	plugin._props.push(...data.css._props);
  	return 1;
  }
  */
}, _identity2DMatrix = [1, 0, 0, 1, 0, 0], _rotationalProperties = {}, _isNullTransform = function _isNullTransform2(value) {
  return value === "matrix(1, 0, 0, 1, 0, 0)" || value === "none" || !value;
}, _getComputedTransformMatrixAsArray = function _getComputedTransformMatrixAsArray2(target) {
  var matrixString = _getComputedProperty(target, _transformProp);
  return _isNullTransform(matrixString) ? _identity2DMatrix : matrixString.substr(7).match(_numExp).map(_round);
}, _getMatrix = function _getMatrix2(target, force2D) {
  var cache2 = target._gsap || _getCache(target), style2 = target.style, matrix = _getComputedTransformMatrixAsArray(target), parent2, nextSibling, temp, addedToDOM;
  if (cache2.svg && target.getAttribute("transform")) {
    temp = target.transform.baseVal.consolidate().matrix;
    matrix = [temp.a, temp.b, temp.c, temp.d, temp.e, temp.f];
    return matrix.join(",") === "1,0,0,1,0,0" ? _identity2DMatrix : matrix;
  } else if (matrix === _identity2DMatrix && !target.offsetParent && target !== _docElement && !cache2.svg) {
    temp = style2.display;
    style2.display = "block";
    parent2 = target.parentNode;
    if (!parent2 || !target.offsetParent) {
      addedToDOM = 1;
      nextSibling = target.nextElementSibling;
      _docElement.appendChild(target);
    }
    matrix = _getComputedTransformMatrixAsArray(target);
    temp ? style2.display = temp : _removeProperty(target, "display");
    if (addedToDOM) {
      nextSibling ? parent2.insertBefore(target, nextSibling) : parent2 ? parent2.appendChild(target) : _docElement.removeChild(target);
    }
  }
  return force2D && matrix.length > 6 ? [matrix[0], matrix[1], matrix[4], matrix[5], matrix[12], matrix[13]] : matrix;
}, _applySVGOrigin = function _applySVGOrigin2(target, origin, originIsAbsolute, smooth, matrixArray, pluginToAddPropTweensTo) {
  var cache2 = target._gsap, matrix = matrixArray || _getMatrix(target, true), xOriginOld = cache2.xOrigin || 0, yOriginOld = cache2.yOrigin || 0, xOffsetOld = cache2.xOffset || 0, yOffsetOld = cache2.yOffset || 0, a = matrix[0], b = matrix[1], c = matrix[2], d = matrix[3], tx = matrix[4], ty = matrix[5], originSplit = origin.split(" "), xOrigin = parseFloat(originSplit[0]) || 0, yOrigin = parseFloat(originSplit[1]) || 0, bounds, determinant, x, y;
  if (!originIsAbsolute) {
    bounds = _getBBox(target);
    xOrigin = bounds.x + (~originSplit[0].indexOf("%") ? xOrigin / 100 * bounds.width : xOrigin);
    yOrigin = bounds.y + (~(originSplit[1] || originSplit[0]).indexOf("%") ? yOrigin / 100 * bounds.height : yOrigin);
  } else if (matrix !== _identity2DMatrix && (determinant = a * d - b * c)) {
    x = xOrigin * (d / determinant) + yOrigin * (-c / determinant) + (c * ty - d * tx) / determinant;
    y = xOrigin * (-b / determinant) + yOrigin * (a / determinant) - (a * ty - b * tx) / determinant;
    xOrigin = x;
    yOrigin = y;
  }
  if (smooth || smooth !== false && cache2.smooth) {
    tx = xOrigin - xOriginOld;
    ty = yOrigin - yOriginOld;
    cache2.xOffset = xOffsetOld + (tx * a + ty * c) - tx;
    cache2.yOffset = yOffsetOld + (tx * b + ty * d) - ty;
  } else {
    cache2.xOffset = cache2.yOffset = 0;
  }
  cache2.xOrigin = xOrigin;
  cache2.yOrigin = yOrigin;
  cache2.smooth = !!smooth;
  cache2.origin = origin;
  cache2.originIsAbsolute = !!originIsAbsolute;
  target.style[_transformOriginProp] = "0px 0px";
  if (pluginToAddPropTweensTo) {
    _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "xOrigin", xOriginOld, xOrigin);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "yOrigin", yOriginOld, yOrigin);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "xOffset", xOffsetOld, cache2.xOffset);
    _addNonTweeningPT(pluginToAddPropTweensTo, cache2, "yOffset", yOffsetOld, cache2.yOffset);
  }
  target.setAttribute("data-svg-origin", xOrigin + " " + yOrigin);
}, _parseTransform = function _parseTransform2(target, uncache) {
  var cache2 = target._gsap || new GSCache(target);
  if ("x" in cache2 && !uncache && !cache2.uncache) {
    return cache2;
  }
  var style2 = target.style, invertedScaleX = cache2.scaleX < 0, px = "px", deg = "deg", cs = getComputedStyle(target), origin = _getComputedProperty(target, _transformOriginProp) || "0", x, y, z, scaleX, scaleY, rotation, rotationX, rotationY, skewX, skewY, perspective, xOrigin, yOrigin, matrix, angle, cos, sin, a, b, c, d, a12, a22, t1, t2, t3, a13, a23, a33, a42, a43, a32;
  x = y = z = rotation = rotationX = rotationY = skewX = skewY = perspective = 0;
  scaleX = scaleY = 1;
  cache2.svg = !!(target.getCTM && _isSVG(target));
  if (cs.translate) {
    if (cs.translate !== "none" || cs.scale !== "none" || cs.rotate !== "none") {
      style2[_transformProp] = (cs.translate !== "none" ? "translate3d(" + (cs.translate + " 0 0").split(" ").slice(0, 3).join(", ") + ") " : "") + (cs.rotate !== "none" ? "rotate(" + cs.rotate + ") " : "") + (cs.scale !== "none" ? "scale(" + cs.scale.split(" ").join(",") + ") " : "") + (cs[_transformProp] !== "none" ? cs[_transformProp] : "");
    }
    style2.scale = style2.rotate = style2.translate = "none";
  }
  matrix = _getMatrix(target, cache2.svg);
  if (cache2.svg) {
    if (cache2.uncache) {
      t2 = target.getBBox();
      origin = cache2.xOrigin - t2.x + "px " + (cache2.yOrigin - t2.y) + "px";
      t1 = "";
    } else {
      t1 = !uncache && target.getAttribute("data-svg-origin");
    }
    _applySVGOrigin(target, t1 || origin, !!t1 || cache2.originIsAbsolute, cache2.smooth !== false, matrix);
  }
  xOrigin = cache2.xOrigin || 0;
  yOrigin = cache2.yOrigin || 0;
  if (matrix !== _identity2DMatrix) {
    a = matrix[0];
    b = matrix[1];
    c = matrix[2];
    d = matrix[3];
    x = a12 = matrix[4];
    y = a22 = matrix[5];
    if (matrix.length === 6) {
      scaleX = Math.sqrt(a * a + b * b);
      scaleY = Math.sqrt(d * d + c * c);
      rotation = a || b ? _atan2(b, a) * _RAD2DEG : 0;
      skewX = c || d ? _atan2(c, d) * _RAD2DEG + rotation : 0;
      skewX && (scaleY *= Math.abs(Math.cos(skewX * _DEG2RAD)));
      if (cache2.svg) {
        x -= xOrigin - (xOrigin * a + yOrigin * c);
        y -= yOrigin - (xOrigin * b + yOrigin * d);
      }
    } else {
      a32 = matrix[6];
      a42 = matrix[7];
      a13 = matrix[8];
      a23 = matrix[9];
      a33 = matrix[10];
      a43 = matrix[11];
      x = matrix[12];
      y = matrix[13];
      z = matrix[14];
      angle = _atan2(a32, a33);
      rotationX = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a12 * cos + a13 * sin;
        t2 = a22 * cos + a23 * sin;
        t3 = a32 * cos + a33 * sin;
        a13 = a12 * -sin + a13 * cos;
        a23 = a22 * -sin + a23 * cos;
        a33 = a32 * -sin + a33 * cos;
        a43 = a42 * -sin + a43 * cos;
        a12 = t1;
        a22 = t2;
        a32 = t3;
      }
      angle = _atan2(-c, a33);
      rotationY = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(-angle);
        sin = Math.sin(-angle);
        t1 = a * cos - a13 * sin;
        t2 = b * cos - a23 * sin;
        t3 = c * cos - a33 * sin;
        a43 = d * sin + a43 * cos;
        a = t1;
        b = t2;
        c = t3;
      }
      angle = _atan2(b, a);
      rotation = angle * _RAD2DEG;
      if (angle) {
        cos = Math.cos(angle);
        sin = Math.sin(angle);
        t1 = a * cos + b * sin;
        t2 = a12 * cos + a22 * sin;
        b = b * cos - a * sin;
        a22 = a22 * cos - a12 * sin;
        a = t1;
        a12 = t2;
      }
      if (rotationX && Math.abs(rotationX) + Math.abs(rotation) > 359.9) {
        rotationX = rotation = 0;
        rotationY = 180 - rotationY;
      }
      scaleX = _round(Math.sqrt(a * a + b * b + c * c));
      scaleY = _round(Math.sqrt(a22 * a22 + a32 * a32));
      angle = _atan2(a12, a22);
      skewX = Math.abs(angle) > 2e-4 ? angle * _RAD2DEG : 0;
      perspective = a43 ? 1 / (a43 < 0 ? -a43 : a43) : 0;
    }
    if (cache2.svg) {
      t1 = target.getAttribute("transform");
      cache2.forceCSS = target.setAttribute("transform", "") || !_isNullTransform(_getComputedProperty(target, _transformProp));
      t1 && target.setAttribute("transform", t1);
    }
  }
  if (Math.abs(skewX) > 90 && Math.abs(skewX) < 270) {
    if (invertedScaleX) {
      scaleX *= -1;
      skewX += rotation <= 0 ? 180 : -180;
      rotation += rotation <= 0 ? 180 : -180;
    } else {
      scaleY *= -1;
      skewX += skewX <= 0 ? 180 : -180;
    }
  }
  uncache = uncache || cache2.uncache;
  cache2.x = x - ((cache2.xPercent = x && (!uncache && cache2.xPercent || (Math.round(target.offsetWidth / 2) === Math.round(-x) ? -50 : 0))) ? target.offsetWidth * cache2.xPercent / 100 : 0) + px;
  cache2.y = y - ((cache2.yPercent = y && (!uncache && cache2.yPercent || (Math.round(target.offsetHeight / 2) === Math.round(-y) ? -50 : 0))) ? target.offsetHeight * cache2.yPercent / 100 : 0) + px;
  cache2.z = z + px;
  cache2.scaleX = _round(scaleX);
  cache2.scaleY = _round(scaleY);
  cache2.rotation = _round(rotation) + deg;
  cache2.rotationX = _round(rotationX) + deg;
  cache2.rotationY = _round(rotationY) + deg;
  cache2.skewX = skewX + deg;
  cache2.skewY = skewY + deg;
  cache2.transformPerspective = perspective + px;
  if (cache2.zOrigin = parseFloat(origin.split(" ")[2]) || !uncache && cache2.zOrigin || 0) {
    style2[_transformOriginProp] = _firstTwoOnly(origin);
  }
  cache2.xOffset = cache2.yOffset = 0;
  cache2.force3D = _config.force3D;
  cache2.renderTransform = cache2.svg ? _renderSVGTransforms : _supports3D ? _renderCSSTransforms : _renderNon3DTransforms;
  cache2.uncache = 0;
  return cache2;
}, _firstTwoOnly = function _firstTwoOnly2(value) {
  return (value = value.split(" "))[0] + " " + value[1];
}, _addPxTranslate = function _addPxTranslate2(target, start, value) {
  var unit = getUnit(start);
  return _round(parseFloat(start) + parseFloat(_convertToUnit(target, "x", value + "px", unit))) + unit;
}, _renderNon3DTransforms = function _renderNon3DTransforms2(ratio, cache2) {
  cache2.z = "0px";
  cache2.rotationY = cache2.rotationX = "0deg";
  cache2.force3D = 0;
  _renderCSSTransforms(ratio, cache2);
}, _zeroDeg = "0deg", _zeroPx = "0px", _endParenthesis = ") ", _renderCSSTransforms = function _renderCSSTransforms2(ratio, cache2) {
  var _ref = cache2 || this, xPercent = _ref.xPercent, yPercent = _ref.yPercent, x = _ref.x, y = _ref.y, z = _ref.z, rotation = _ref.rotation, rotationY = _ref.rotationY, rotationX = _ref.rotationX, skewX = _ref.skewX, skewY = _ref.skewY, scaleX = _ref.scaleX, scaleY = _ref.scaleY, transformPerspective = _ref.transformPerspective, force3D = _ref.force3D, target = _ref.target, zOrigin = _ref.zOrigin, transforms = "", use3D = force3D === "auto" && ratio && ratio !== 1 || force3D === true;
  if (zOrigin && (rotationX !== _zeroDeg || rotationY !== _zeroDeg)) {
    var angle = parseFloat(rotationY) * _DEG2RAD, a13 = Math.sin(angle), a33 = Math.cos(angle), cos;
    angle = parseFloat(rotationX) * _DEG2RAD;
    cos = Math.cos(angle);
    x = _addPxTranslate(target, x, a13 * cos * -zOrigin);
    y = _addPxTranslate(target, y, -Math.sin(angle) * -zOrigin);
    z = _addPxTranslate(target, z, a33 * cos * -zOrigin + zOrigin);
  }
  if (transformPerspective !== _zeroPx) {
    transforms += "perspective(" + transformPerspective + _endParenthesis;
  }
  if (xPercent || yPercent) {
    transforms += "translate(" + xPercent + "%, " + yPercent + "%) ";
  }
  if (use3D || x !== _zeroPx || y !== _zeroPx || z !== _zeroPx) {
    transforms += z !== _zeroPx || use3D ? "translate3d(" + x + ", " + y + ", " + z + ") " : "translate(" + x + ", " + y + _endParenthesis;
  }
  if (rotation !== _zeroDeg) {
    transforms += "rotate(" + rotation + _endParenthesis;
  }
  if (rotationY !== _zeroDeg) {
    transforms += "rotateY(" + rotationY + _endParenthesis;
  }
  if (rotationX !== _zeroDeg) {
    transforms += "rotateX(" + rotationX + _endParenthesis;
  }
  if (skewX !== _zeroDeg || skewY !== _zeroDeg) {
    transforms += "skew(" + skewX + ", " + skewY + _endParenthesis;
  }
  if (scaleX !== 1 || scaleY !== 1) {
    transforms += "scale(" + scaleX + ", " + scaleY + _endParenthesis;
  }
  target.style[_transformProp] = transforms || "translate(0, 0)";
}, _renderSVGTransforms = function _renderSVGTransforms2(ratio, cache2) {
  var _ref2 = cache2 || this, xPercent = _ref2.xPercent, yPercent = _ref2.yPercent, x = _ref2.x, y = _ref2.y, rotation = _ref2.rotation, skewX = _ref2.skewX, skewY = _ref2.skewY, scaleX = _ref2.scaleX, scaleY = _ref2.scaleY, target = _ref2.target, xOrigin = _ref2.xOrigin, yOrigin = _ref2.yOrigin, xOffset = _ref2.xOffset, yOffset = _ref2.yOffset, forceCSS = _ref2.forceCSS, tx = parseFloat(x), ty = parseFloat(y), a11, a21, a12, a22, temp;
  rotation = parseFloat(rotation);
  skewX = parseFloat(skewX);
  skewY = parseFloat(skewY);
  if (skewY) {
    skewY = parseFloat(skewY);
    skewX += skewY;
    rotation += skewY;
  }
  if (rotation || skewX) {
    rotation *= _DEG2RAD;
    skewX *= _DEG2RAD;
    a11 = Math.cos(rotation) * scaleX;
    a21 = Math.sin(rotation) * scaleX;
    a12 = Math.sin(rotation - skewX) * -scaleY;
    a22 = Math.cos(rotation - skewX) * scaleY;
    if (skewX) {
      skewY *= _DEG2RAD;
      temp = Math.tan(skewX - skewY);
      temp = Math.sqrt(1 + temp * temp);
      a12 *= temp;
      a22 *= temp;
      if (skewY) {
        temp = Math.tan(skewY);
        temp = Math.sqrt(1 + temp * temp);
        a11 *= temp;
        a21 *= temp;
      }
    }
    a11 = _round(a11);
    a21 = _round(a21);
    a12 = _round(a12);
    a22 = _round(a22);
  } else {
    a11 = scaleX;
    a22 = scaleY;
    a21 = a12 = 0;
  }
  if (tx && !~(x + "").indexOf("px") || ty && !~(y + "").indexOf("px")) {
    tx = _convertToUnit(target, "x", x, "px");
    ty = _convertToUnit(target, "y", y, "px");
  }
  if (xOrigin || yOrigin || xOffset || yOffset) {
    tx = _round(tx + xOrigin - (xOrigin * a11 + yOrigin * a12) + xOffset);
    ty = _round(ty + yOrigin - (xOrigin * a21 + yOrigin * a22) + yOffset);
  }
  if (xPercent || yPercent) {
    temp = target.getBBox();
    tx = _round(tx + xPercent / 100 * temp.width);
    ty = _round(ty + yPercent / 100 * temp.height);
  }
  temp = "matrix(" + a11 + "," + a21 + "," + a12 + "," + a22 + "," + tx + "," + ty + ")";
  target.setAttribute("transform", temp);
  forceCSS && (target.style[_transformProp] = temp);
}, _addRotationalPropTween = function _addRotationalPropTween2(plugin, target, property, startNum, endValue) {
  var cap = 360, isString2 = _isString(endValue), endNum = parseFloat(endValue) * (isString2 && ~endValue.indexOf("rad") ? _RAD2DEG : 1), change = endNum - startNum, finalValue = startNum + change + "deg", direction, pt;
  if (isString2) {
    direction = endValue.split("_")[1];
    if (direction === "short") {
      change %= cap;
      if (change !== change % (cap / 2)) {
        change += change < 0 ? cap : -cap;
      }
    }
    if (direction === "cw" && change < 0) {
      change = (change + cap * _bigNum) % cap - ~~(change / cap) * cap;
    } else if (direction === "ccw" && change > 0) {
      change = (change - cap * _bigNum) % cap - ~~(change / cap) * cap;
    }
  }
  plugin._pt = pt = new PropTween(plugin._pt, target, property, startNum, change, _renderPropWithEnd);
  pt.e = finalValue;
  pt.u = "deg";
  plugin._props.push(property);
  return pt;
}, _assign = function _assign2(target, source) {
  for (var p in source) {
    target[p] = source[p];
  }
  return target;
}, _addRawTransformPTs = function _addRawTransformPTs2(plugin, transforms, target) {
  var startCache = _assign({}, target._gsap), exclude = "perspective,force3D,transformOrigin,svgOrigin", style2 = target.style, endCache, p, startValue, endValue, startNum, endNum, startUnit, endUnit;
  if (startCache.svg) {
    startValue = target.getAttribute("transform");
    target.setAttribute("transform", "");
    style2[_transformProp] = transforms;
    endCache = _parseTransform(target, 1);
    _removeProperty(target, _transformProp);
    target.setAttribute("transform", startValue);
  } else {
    startValue = getComputedStyle(target)[_transformProp];
    style2[_transformProp] = transforms;
    endCache = _parseTransform(target, 1);
    style2[_transformProp] = startValue;
  }
  for (p in _transformProps) {
    startValue = startCache[p];
    endValue = endCache[p];
    if (startValue !== endValue && exclude.indexOf(p) < 0) {
      startUnit = getUnit(startValue);
      endUnit = getUnit(endValue);
      startNum = startUnit !== endUnit ? _convertToUnit(target, p, startValue, endUnit) : parseFloat(startValue);
      endNum = parseFloat(endValue);
      plugin._pt = new PropTween(plugin._pt, endCache, p, startNum, endNum - startNum, _renderCSSProp);
      plugin._pt.u = endUnit || 0;
      plugin._props.push(p);
    }
  }
  _assign(endCache, startCache);
};
_forEachName("padding,margin,Width,Radius", function(name, index2) {
  var t = "Top", r = "Right", b = "Bottom", l = "Left", props = (index2 < 3 ? [t, r, b, l] : [t + l, t + r, b + r, b + l]).map(function(side) {
    return index2 < 2 ? name + side : "border" + side + name;
  });
  _specialProps[index2 > 1 ? "border" + name : name] = function(plugin, target, property, endValue, tween) {
    var a, vars;
    if (arguments.length < 4) {
      a = props.map(function(prop) {
        return _get(plugin, prop, property);
      });
      vars = a.join(" ");
      return vars.split(a[0]).length === 5 ? a[0] : vars;
    }
    a = (endValue + "").split(" ");
    vars = {};
    props.forEach(function(prop, i) {
      return vars[prop] = a[i] = a[i] || a[(i - 1) / 2 | 0];
    });
    plugin.init(target, vars, tween);
  };
});
var CSSPlugin = {
  name: "css",
  register: _initCore,
  targetTest: function targetTest(target) {
    return target.style && target.nodeType;
  },
  init: function init3(target, vars, tween, index2, targets) {
    var props = this._props, style2 = target.style, startAt = tween.vars.startAt, startValue, endValue, endNum, startNum, type, specialProp, p, startUnit, endUnit, relative, isTransformRelated, transformPropTween, cache2, smooth, hasPriority, inlineProps;
    _pluginInitted || _initCore();
    this.styles = this.styles || _getStyleSaver(target);
    inlineProps = this.styles.props;
    this.tween = tween;
    for (p in vars) {
      if (p === "autoRound") {
        continue;
      }
      endValue = vars[p];
      if (_plugins[p] && _checkPlugin(p, vars, tween, index2, target, targets)) {
        continue;
      }
      type = typeof endValue;
      specialProp = _specialProps[p];
      if (type === "function") {
        endValue = endValue.call(tween, index2, target, targets);
        type = typeof endValue;
      }
      if (type === "string" && ~endValue.indexOf("random(")) {
        endValue = _replaceRandom(endValue);
      }
      if (specialProp) {
        specialProp(this, target, p, endValue, tween) && (hasPriority = 1);
      } else if (p.substr(0, 2) === "--") {
        startValue = (getComputedStyle(target).getPropertyValue(p) + "").trim();
        endValue += "";
        _colorExp.lastIndex = 0;
        if (!_colorExp.test(startValue)) {
          startUnit = getUnit(startValue);
          endUnit = getUnit(endValue);
        }
        endUnit ? startUnit !== endUnit && (startValue = _convertToUnit(target, p, startValue, endUnit) + endUnit) : startUnit && (endValue += startUnit);
        this.add(style2, "setProperty", startValue, endValue, index2, targets, 0, 0, p);
        props.push(p);
        inlineProps.push(p, 0, style2[p]);
      } else if (type !== "undefined") {
        if (startAt && p in startAt) {
          startValue = typeof startAt[p] === "function" ? startAt[p].call(tween, index2, target, targets) : startAt[p];
          _isString(startValue) && ~startValue.indexOf("random(") && (startValue = _replaceRandom(startValue));
          getUnit(startValue + "") || startValue === "auto" || (startValue += _config.units[p] || getUnit(_get(target, p)) || "");
          (startValue + "").charAt(1) === "=" && (startValue = _get(target, p));
        } else {
          startValue = _get(target, p);
        }
        startNum = parseFloat(startValue);
        relative = type === "string" && endValue.charAt(1) === "=" && endValue.substr(0, 2);
        relative && (endValue = endValue.substr(2));
        endNum = parseFloat(endValue);
        if (p in _propertyAliases) {
          if (p === "autoAlpha") {
            if (startNum === 1 && _get(target, "visibility") === "hidden" && endNum) {
              startNum = 0;
            }
            inlineProps.push("visibility", 0, style2.visibility);
            _addNonTweeningPT(this, style2, "visibility", startNum ? "inherit" : "hidden", endNum ? "inherit" : "hidden", !endNum);
          }
          if (p !== "scale" && p !== "transform") {
            p = _propertyAliases[p];
            ~p.indexOf(",") && (p = p.split(",")[0]);
          }
        }
        isTransformRelated = p in _transformProps;
        if (isTransformRelated) {
          this.styles.save(p);
          if (!transformPropTween) {
            cache2 = target._gsap;
            cache2.renderTransform && !vars.parseTransform || _parseTransform(target, vars.parseTransform);
            smooth = vars.smoothOrigin !== false && cache2.smooth;
            transformPropTween = this._pt = new PropTween(this._pt, style2, _transformProp, 0, 1, cache2.renderTransform, cache2, 0, -1);
            transformPropTween.dep = 1;
          }
          if (p === "scale") {
            this._pt = new PropTween(this._pt, cache2, "scaleY", cache2.scaleY, (relative ? _parseRelative(cache2.scaleY, relative + endNum) : endNum) - cache2.scaleY || 0, _renderCSSProp);
            this._pt.u = 0;
            props.push("scaleY", p);
            p += "X";
          } else if (p === "transformOrigin") {
            inlineProps.push(_transformOriginProp, 0, style2[_transformOriginProp]);
            endValue = _convertKeywordsToPercentages(endValue);
            if (cache2.svg) {
              _applySVGOrigin(target, endValue, 0, smooth, 0, this);
            } else {
              endUnit = parseFloat(endValue.split(" ")[2]) || 0;
              endUnit !== cache2.zOrigin && _addNonTweeningPT(this, cache2, "zOrigin", cache2.zOrigin, endUnit);
              _addNonTweeningPT(this, style2, p, _firstTwoOnly(startValue), _firstTwoOnly(endValue));
            }
            continue;
          } else if (p === "svgOrigin") {
            _applySVGOrigin(target, endValue, 1, smooth, 0, this);
            continue;
          } else if (p in _rotationalProperties) {
            _addRotationalPropTween(this, cache2, p, startNum, relative ? _parseRelative(startNum, relative + endValue) : endValue);
            continue;
          } else if (p === "smoothOrigin") {
            _addNonTweeningPT(this, cache2, "smooth", cache2.smooth, endValue);
            continue;
          } else if (p === "force3D") {
            cache2[p] = endValue;
            continue;
          } else if (p === "transform") {
            _addRawTransformPTs(this, endValue, target);
            continue;
          }
        } else if (!(p in style2)) {
          p = _checkPropPrefix(p) || p;
        }
        if (isTransformRelated || (endNum || endNum === 0) && (startNum || startNum === 0) && !_complexExp.test(endValue) && p in style2) {
          startUnit = (startValue + "").substr((startNum + "").length);
          endNum || (endNum = 0);
          endUnit = getUnit(endValue) || (p in _config.units ? _config.units[p] : startUnit);
          startUnit !== endUnit && (startNum = _convertToUnit(target, p, startValue, endUnit));
          this._pt = new PropTween(this._pt, isTransformRelated ? cache2 : style2, p, startNum, (relative ? _parseRelative(startNum, relative + endNum) : endNum) - startNum, !isTransformRelated && (endUnit === "px" || p === "zIndex") && vars.autoRound !== false ? _renderRoundedCSSProp : _renderCSSProp);
          this._pt.u = endUnit || 0;
          if (startUnit !== endUnit && endUnit !== "%") {
            this._pt.b = startValue;
            this._pt.r = _renderCSSPropWithBeginning;
          }
        } else if (!(p in style2)) {
          if (p in target) {
            this.add(target, p, startValue || target[p], relative ? relative + endValue : endValue, index2, targets);
          } else if (p !== "parseTransform") {
            _missingPlugin(p, endValue);
            continue;
          }
        } else {
          _tweenComplexCSSString.call(this, target, p, startValue, relative ? relative + endValue : endValue);
        }
        isTransformRelated || (p in style2 ? inlineProps.push(p, 0, style2[p]) : inlineProps.push(p, 1, startValue || target[p]));
        props.push(p);
      }
    }
    hasPriority && _sortPropTweensByPriority(this);
  },
  render: function render2(ratio, data) {
    if (data.tween._time || !_reverting()) {
      var pt = data._pt;
      while (pt) {
        pt.r(ratio, pt.d);
        pt = pt._next;
      }
    } else {
      data.styles.revert();
    }
  },
  get: _get,
  aliases: _propertyAliases,
  getSetter: function getSetter(target, property, plugin) {
    var p = _propertyAliases[property];
    p && p.indexOf(",") < 0 && (property = p);
    return property in _transformProps && property !== _transformOriginProp && (target._gsap.x || _get(target, "x")) ? plugin && _recentSetterPlugin === plugin ? property === "scale" ? _setterScale : _setterTransform : (_recentSetterPlugin = plugin || {}) && (property === "scale" ? _setterScaleWithRender : _setterTransformWithRender) : target.style && !_isUndefined(target.style[property]) ? _setterCSSStyle : ~property.indexOf("-") ? _setterCSSProp : _getSetter(target, property);
  },
  core: {
    _removeProperty,
    _getMatrix
  }
};
gsap.utils.checkPrefix = _checkPropPrefix;
gsap.core.getStyleSaver = _getStyleSaver;
(function(positionAndScale, rotation, others, aliases) {
  var all2 = _forEachName(positionAndScale + "," + rotation + "," + others, function(name) {
    _transformProps[name] = 1;
  });
  _forEachName(rotation, function(name) {
    _config.units[name] = "deg";
    _rotationalProperties[name] = 1;
  });
  _propertyAliases[all2[13]] = positionAndScale + "," + rotation;
  _forEachName(aliases, function(name) {
    var split = name.split(":");
    _propertyAliases[split[1]] = all2[split[0]];
  });
})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent", "rotation,rotationX,rotationY,skewX,skewY", "transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective", "0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");
_forEachName("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective", function(name) {
  _config.units[name] = "px";
});
gsap.registerPlugin(CSSPlugin);
var gsapWithCSS = gsap.registerPlugin(CSSPlugin) || gsap;
gsapWithCSS.core.Tween;
const dropDownItems = document.querySelectorAll(".subdivision__drop");
dropDownItems.forEach((item) => {
  const dropDownButton = item.querySelector(".subdivision");
  dropDownButton.addEventListener("click", () => {
    toggleItem(item);
  });
});
const toggleItem = (item) => {
  const dropdownContainer = item.querySelector(".subdivision__list");
  if (item.classList.contains("show-dropdown")) {
    dropdownContainer.removeAttribute("style");
    item.classList.remove("show-dropdown");
  } else {
    dropdownContainer.style.height = dropdownContainer.scrollHeight + "px";
    item.classList.add("show-dropdown");
  }
};
const tl = gsapWithCSS.timeline({ paused: true });
const animateOpenNav = () => {
  tl.fromTo(
    "#js-modal-menu",
    { autoAlpha: 0 },
    {
      duration: 0.1,
      autoAlpha: 1,
      delay: 0
    }
  );
};
const openNav = () => {
  animateOpenNav();
  const navBtn = document.getElementById("menu-toggle-btn");
  const headerMenu = document.getElementById("header__menu");
  const headerTel = document.getElementById("header__tel");
  const header = document.querySelector(".header");
  navBtn.addEventListener("click", function(e) {
    document.body.classList.toggle("_lock");
    navBtn.classList.toggle("active");
    headerMenu.classList.toggle("active");
    headerTel.classList.toggle("active");
    header.classList.toggle("active");
    toggleMenuText();
    if (navBtn.classList.contains("active")) {
      tl.play();
    } else {
      tl.reverse();
    }
  });
  function toggleMenuText() {
    var menuText = navBtn.querySelector("span");
    if (menuText.textContent === "Меню") {
      menuText.textContent = "Закрыть";
    } else {
      menuText.textContent = "Меню";
    }
  }
};
openNav();
var swiper = new Swiper(".advantages-swiper", {
  effect: "fade",
  modules: [Navigation, Pagination, EffectFade, Autoplay],
  autoplay: {
    delay: 5e3,
    disableOnInteraction: false
  },
  navigation: {
    nextEl: ".swiper-next-button",
    prevEl: ".swiper-prev-button"
  },
  pagination: {
    el: ".swiper-pagination",
    type: "fraction"
  }
});
swiper.on("slideChange", function(sld) {
  document.body.setAttribute("data-sld", sld.realIndex);
});
$(".news__carousel").owlCarousel({
  margin: 52,
  nav: true,
  merge: true,
  dots: false,
  navText: [$(".slider-next"), $(".slider-prev")],
  responsiveClass: true,
  responsive: {
    0: {
      items: 1,
      nav: true
    },
    600: {
      items: 2
    },
    1300: {
      items: 2,
      mergeFit: true
    }
  }
});
$(".technique-carousel").owlCarousel({
  margin: 60,
  nav: true,
  merge: true,
  dots: false,
  navText: [$(".slider-next"), $(".slider-prev")],
  responsiveClass: true,
  responsive: {
    0: {
      items: 1
      // nav:true
    },
    800: {
      items: 2
    },
    1300: {
      items: 3
    }
  }
});
window.addEventListener("DOMContentLoaded", () => {
  const resizableSwiper = (breakpoint, swiperClass, swiperSettings, callback) => {
    let swiper2;
    breakpoint = window.matchMedia(breakpoint);
    const enableSwiper = function(className, settings) {
      swiper2 = new Swiper(className, settings);
      if (callback) {
        callback(swiper2);
      }
    };
    const checker = function() {
      if (breakpoint.matches) {
        return enableSwiper(swiperClass, swiperSettings);
      } else {
        if (swiper2 !== void 0)
          swiper2.destroy(true, true);
        return;
      }
    };
    breakpoint.addEventListener("change", checker);
    checker();
  };
  resizableSwiper(
    "(max-width: 950px)",
    ".range__swiper",
    {
      grabCursor: true,
      slidesPerView: "auto",
      spaceBetween: 20,
      centerSlides: true,
      breakpoints: {
        600: {
          centerSlides: false
        }
      }
    }
  );
});
new Swiper(".news-detail__gallery", {
  slidesPerView: 1,
  spaceBetween: 20,
  modules: [Navigation],
  navigation: {
    nextEl: ".swiper-next-button",
    prevEl: ".swiper-prev-button"
  }
});
new Swiper(".about-people__slider", {
  effect: "fade",
  modules: [Navigation, Pagination, EffectFade],
  navigation: {
    nextEl: ".swiper-next-button",
    prevEl: ".swiper-prev-button"
  }
});
new Swiper(".detail-swiper", {
  effect: "fade",
  modules: [Navigation, Pagination, EffectFade],
  navigation: {
    nextEl: ".detail-slider-next",
    prevEl: ".detail-slider-prev"
  },
  pagination: {
    el: ".swiper-pagination",
    type: "fraction"
  }
});
new Swiper(".vacancy-slider__swiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  modules: [Navigation],
  navigation: {
    nextEl: ".swiper-next-button",
    prevEl: ".swiper-prev-button"
  }
});
new Swiper(".clients-swiper", {
  slidesPerView: 5,
  spaceBetween: 5,
  loopedSlides: 12,
  loop: true,
  modules: [Autoplay, freeMode],
  speed: 8e3,
  freeMode: {
    enabled: false,
    momentumBounce: true,
    freeModeMomentumRatio: 1222
  },
  autoplay: {
    delay: 0,
    disableOnInteraction: false
  }
  // breakpoints: {
  // 640: {
  //   slidesPerView: 2,
  //   spaceBetween: 20,
  // },
  // 768: {
  //   slidesPerView: 4,
  //   spaceBetween: 40,
  // },
  // 1024: {
  //   slidesPerView: 5,
  //   spaceBetween: 50,
  // },
  // },
});
const accordionItems = document.querySelectorAll(".vacancy-accordion__point");
accordionItems.forEach((item) => {
  const accoordionHeader = item.querySelector(".vacancy-accordion__info");
  accoordionHeader.addEventListener("click", () => {
    const openItem = document.querySelector(".acrd-open");
    toggleVacancy(item);
    if (openItem && openItem !== item) {
      toggleVacancy(openItem);
    }
  });
});
const toggleVacancy = (item) => {
  const accordionContent = item.querySelector(".vacancy-accordion__content");
  if (item.classList.contains("acrd-open")) {
    accordionContent.removeAttribute("style");
    item.classList.remove("acrd-open");
  } else {
    accordionContent.style.height = accordionContent.scrollHeight + "px";
    item.classList.add("acrd-open");
  }
};
let phones = document.querySelectorAll('[data-mask="phone"]');
phones.forEach(function(element) {
  new IMask(element, {
    mask: "+{7}(000)000-00-00"
  });
});
const modalMainBody = document.querySelector(".modal-main__body");
const modalMainButton = document.querySelector(".js-open-modal-main");
const modalMainContent = document.querySelector(".modal-main__content");
const modalMainClose = document.querySelector(".modal-main__close");
const errorBlock = document.querySelectorAll(".js-error");
if (modalMainButton) {
  modalMainButton.addEventListener("click", (e) => {
    document.body.classList.add("_lock");
    modalMainBody.classList.add("_active");
    modalMainContent.classList.add("_active");
  });
}
if (modalMainClose) {
  console.log(errorBlock);
  modalMainClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalMainBody.classList.remove("_active");
    modalMainContent.classList.remove("_active");
    errorBlock.forEach(
      (item) => {
        item.classList.remove("_active");
      }
    );
  });
}
const modalVacancyBody = document.querySelector(".modal-vacancy__body");
const modalVacancyButtons = document.querySelectorAll(".js-open-modal-vacancy");
const modalVacancyContent = document.querySelector(".modal-vacancy__content");
const modalVacancyClose = document.querySelector(".modal-vacancy__close");
if (modalVacancyButtons) {
  modalVacancyButtons.forEach((button) => {
    button.addEventListener("click", (e) => {
      document.body.classList.add("_lock");
      modalVacancyBody.classList.add("_active");
      modalVacancyContent.classList.add("_active");
    });
  });
}
if (modalVacancyClose) {
  modalVacancyClose.addEventListener("click", (e) => {
    document.body.classList.remove("_lock");
    modalVacancyBody.classList.remove("_active");
    modalVacancyContent.classList.remove("_active");
    errorBlock.forEach(
      (item) => {
        item.classList.remove("_active");
      }
    );
  });
}
const sucesBody = document.querySelector(".suces__body");
const sucesContent = document.querySelector(".suces__content");
const sucesClose = document.querySelector(".suces__close");
function sucesOpen() {
  sucesBody.classList.add("_active");
  sucesContent.classList.add("_active");
  document.body.classList.add("_lock");
}
if (sucesClose) {
  sucesClose.addEventListener("click", (e) => {
    sucesBody.classList.remove("_active");
    sucesContent.classList.remove("_active");
    document.body.classList.remove("_lock");
  });
}
function validatePhone(phone) {
  const cleanedPhone = phone.replace(/\D/g, "");
  console.log(new String(cleanedPhone).length);
  console.log(cleanedPhone.length === 11, "partial");
  if (cleanedPhone.length === 11) {
    return true;
  } else {
    return false;
  }
}
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function validateText(text2) {
  const trimmedText = text2.trim();
  if (trimmedText.length >= 2) {
    return true;
  } else {
    return false;
  }
}
const validate = (input) => {
  const dataType = input.getAttribute("data-type");
  let res = true;
  switch (dataType) {
    case "phone":
      res = validatePhone(input.value);
      break;
    case "text":
      res = validateText(input.value);
      break;
    case "email":
      res = validateEmail(input.value);
      break;
  }
  console.log(input, res, dataType);
  return res;
};
let forms = document.querySelectorAll(".js-form");
console.log(forms);
forms.forEach((form) => {
  let formButton = form.querySelector(".js-form-submit");
  console.log(formButton);
  if (formButton) {
    formButton.addEventListener("click", (e) => {
      e.preventDefault();
      formButton.disabled = true;
      const inputs = form.querySelectorAll("input, textarea");
      const method = form.method;
      const action = form.action;
      let isValidated = true;
      let formData = [];
      inputs.forEach((input) => {
        formData.push({
          name: input.name,
          value: input.value,
          isValidate: validate(input)
        });
      });
      formData.forEach((item) => {
        const input = form.querySelector(`[name="${item.name}"]`);
        const wrapper = input.parentNode;
        const errorBlock2 = wrapper.querySelector(".js-error");
        if (!item.isValidate) {
          isValidated = false;
          errorBlock2.classList.add("_active");
          wrapper.classList.add("_active");
        } else {
          errorBlock2.classList.remove("_active");
          wrapper.classList.remove("_active");
        }
      });
      if (!isValidated) {
        formButton.disabled = false;
        return false;
      }
      axios$1({
        method,
        url: action,
        data: formData
      }).then((response) => {
        sucesOpen();
        console.log("success");
        formButton.disabled = false;
        modalVacancyBody.classList.remove("_active");
        modalVacancyContent.classList.remove("_active");
        inputs.forEach((input) => {
          input.value = "";
        });
      }).catch((error2) => {
        console.error(error2);
        document.body.classList.remove("_lock");
        modalMainBody.classList.remove("_active");
        modalMainContent.classList.remove("_active");
        modalVacancyBody.classList.remove("_active");
        modalVacancyContent.classList.remove("_active");
        sucesOpen();
        formButton.disabled = false;
        inputs.forEach((input) => {
          input.value = "";
        });
      });
    });
  }
});
const tabs = document.querySelectorAll(".contacts-map__item");
const contents = document.querySelectorAll(".contacts-map__content");
tabs.forEach((tab, index2) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tab2) => tab2.classList.remove("active"));
    tab.classList.add("active");
    contents.forEach((c) => c.classList.remove("active"));
    contents[index2].classList.add("active");
  });
});
tabs[0].click();
document.addEventListener("DOMContentLoaded", function() {
  if (ymaps) {
    ymaps.ready(initializeMaps);
  }
});
let centerOffice = [53.36863907494733, 83.76431772883599];
let centerStore = [55.004994486746305, 82.95321743254078];
let centerService = [55.004994486746305, 82.95321743254078];
function initializeMaps() {
  let mapOffice = new ymaps.Map("map-office", {
    center: centerOffice,
    zoom: 16
  });
  let mapStore = new ymaps.Map("map-store", {
    center: centerStore,
    zoom: 16
  });
  let mapService = new ymaps.Map("map-service", {
    center: centerService,
    zoom: 16
  });
  let placemarkOffice = new ymaps.Placemark([53.36863907494733, 83.76431772883599], {}, {
    iconLayout: "default#image",
    iconImageHref: "map.svg",
    iconImageSize: [37, 37],
    iconImageOffset: [-20, -30]
  });
  let placemarkStore = new ymaps.Placemark([55.004994486746305, 82.95321743254078], {}, {
    iconLayout: "default#image",
    iconImageHref: "map.svg",
    iconImageSize: [37, 37],
    iconImageOffset: [-20, -20]
  });
  let placemarkService = new ymaps.Placemark([55.004994486746305, 82.95321743254078], {}, {
    iconLayout: "default#image",
    iconImageHref: "map.svg",
    iconImageSize: [37, 37],
    iconImageOffset: [-20, -20]
  });
  mapOffice.controls.remove("geolocationControl");
  mapOffice.controls.remove("searchControl");
  mapOffice.controls.remove("trafficControl");
  mapOffice.controls.remove("typeSelector");
  mapOffice.controls.remove("rulerControl", {
    scaleLine: false
  });
  mapStore.controls.remove("geolocationControl");
  mapStore.controls.remove("searchControl");
  mapStore.controls.remove("trafficControl");
  mapStore.controls.remove("typeSelector");
  mapStore.controls.remove("rulerControl", {
    scaleLine: false
  });
  mapService.controls.remove("geolocationControl");
  mapService.controls.remove("searchControl");
  mapService.controls.remove("trafficControl");
  mapService.controls.remove("typeSelector");
  mapService.controls.remove("rulerControl", {
    scaleLine: false
  });
  mapService.geoObjects.add(placemarkService);
  mapOffice.geoObjects.add(placemarkOffice);
  mapStore.geoObjects.add(placemarkStore);
}
