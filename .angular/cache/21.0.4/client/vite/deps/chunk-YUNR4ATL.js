// node_modules/@primeuix/utils/dist/classnames/index.mjs
function f(...e) {
  if (e) {
    let t2 = [];
    for (let i3 = 0; i3 < e.length; i3++) {
      let n2 = e[i3];
      if (!n2) continue;
      let s4 = typeof n2;
      if (s4 === "string" || s4 === "number") t2.push(n2);
      else if (s4 === "object") {
        let c4 = Array.isArray(n2) ? [f(...n2)] : Object.entries(n2).map(([r, o]) => o ? r : void 0);
        t2 = c4.length ? t2.concat(c4.filter((r) => !!r)) : t2;
      }
    }
    return t2.join(" ").trim();
  }
}

// node_modules/@primeuix/utils/dist/dom/index.mjs
function R(t2, e) {
  return t2 ? t2.classList ? t2.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t2.className) : false;
}
function W(t2, e) {
  if (t2 && e) {
    let o = (n2) => {
      R(t2, n2) || (t2.classList ? t2.classList.add(n2) : t2.className += " " + n2);
    };
    [e].flat().filter(Boolean).forEach((n2) => n2.split(" ").forEach(o));
  }
}
function F() {
  return window.innerWidth - document.documentElement.offsetWidth;
}
function st(t2) {
  typeof t2 == "string" ? W(document.body, t2 || "p-overflow-hidden") : (t2 != null && t2.variableName && document.body.style.setProperty(t2.variableName, F() + "px"), W(document.body, (t2 == null ? void 0 : t2.className) || "p-overflow-hidden"));
}
function P(t2, e) {
  if (t2 && e) {
    let o = (n2) => {
      t2.classList ? t2.classList.remove(n2) : t2.className = t2.className.replace(new RegExp("(^|\\b)" + n2.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((n2) => n2.split(" ").forEach(o));
  }
}
function dt(t2) {
  typeof t2 == "string" ? P(document.body, t2 || "p-overflow-hidden") : (t2 != null && t2.variableName && document.body.style.removeProperty(t2.variableName), P(document.body, (t2 == null ? void 0 : t2.className) || "p-overflow-hidden"));
}
function x(t2) {
  for (let e of document == null ? void 0 : document.styleSheets) try {
    for (let o of e == null ? void 0 : e.cssRules) for (let n2 of o == null ? void 0 : o.style) if (t2.test(n2)) return { name: n2, value: o.style.getPropertyValue(n2).trim() };
  } catch (o) {
  }
  return null;
}
function w(t2) {
  let e = { width: 0, height: 0 };
  if (t2) {
    let [o, n2] = [t2.style.visibility, t2.style.display], r = t2.getBoundingClientRect();
    t2.style.visibility = "hidden", t2.style.display = "block", e.width = r.width || t2.offsetWidth, e.height = r.height || t2.offsetHeight, t2.style.display = n2, t2.style.visibility = o;
  }
  return e;
}
function h() {
  let t2 = window, e = document, o = e.documentElement, n2 = e.getElementsByTagName("body")[0], r = t2.innerWidth || o.clientWidth || n2.clientWidth, i3 = t2.innerHeight || o.clientHeight || n2.clientHeight;
  return { width: r, height: i3 };
}
function E(t2) {
  return t2 ? Math.abs(t2.scrollLeft) : 0;
}
function k() {
  let t2 = document.documentElement;
  return (window.pageXOffset || E(t2)) - (t2.clientLeft || 0);
}
function $() {
  let t2 = document.documentElement;
  return (window.pageYOffset || t2.scrollTop) - (t2.clientTop || 0);
}
function V(t2) {
  return t2 ? getComputedStyle(t2).direction === "rtl" : false;
}
function D(t2, e, o = true) {
  var n2, r, i3, l3;
  if (t2) {
    let d2 = t2.offsetParent ? { width: t2.offsetWidth, height: t2.offsetHeight } : w(t2), s4 = d2.height, a2 = d2.width, u2 = e.offsetHeight, p3 = e.offsetWidth, f2 = e.getBoundingClientRect(), g3 = $(), it = k(), lt = h(), L, N, ot = "top";
    f2.top + u2 + s4 > lt.height ? (L = f2.top + g3 - s4, ot = "bottom", L < 0 && (L = g3)) : L = u2 + f2.top + g3, f2.left + a2 > lt.width ? N = Math.max(0, f2.left + it + p3 - a2) : N = f2.left + it, V(t2) ? t2.style.insetInlineEnd = N + "px" : t2.style.insetInlineStart = N + "px", t2.style.top = L + "px", t2.style.transformOrigin = ot, o && (t2.style.marginTop = ot === "bottom" ? `calc(${(r = (n2 = x(/-anchor-gutter$/)) == null ? void 0 : n2.value) != null ? r : "2px"} * -1)` : (l3 = (i3 = x(/-anchor-gutter$/)) == null ? void 0 : i3.value) != null ? l3 : "");
  }
}
function S(t2, e) {
  t2 && (typeof e == "string" ? t2.style.cssText = e : Object.entries(e || {}).forEach(([o, n2]) => t2.style[o] = n2));
}
function v(t2, e) {
  if (t2 instanceof HTMLElement) {
    let o = t2.offsetWidth;
    if (e) {
      let n2 = getComputedStyle(t2);
      o += parseFloat(n2.marginLeft) + parseFloat(n2.marginRight);
    }
    return o;
  }
  return 0;
}
function I(t2, e, o = true, n2 = void 0) {
  var r;
  if (t2) {
    let i3 = t2.offsetParent ? { width: t2.offsetWidth, height: t2.offsetHeight } : w(t2), l3 = e.offsetHeight, d2 = e.getBoundingClientRect(), s4 = h(), a2, u2, p3 = n2 != null ? n2 : "top";
    if (!n2 && d2.top + l3 + i3.height > s4.height ? (a2 = -1 * i3.height, p3 = "bottom", d2.top + a2 < 0 && (a2 = -1 * d2.top)) : a2 = l3, i3.width > s4.width ? u2 = d2.left * -1 : d2.left + i3.width > s4.width ? u2 = (d2.left + i3.width - s4.width) * -1 : u2 = 0, t2.style.top = a2 + "px", t2.style.insetInlineStart = u2 + "px", t2.style.transformOrigin = p3, o) {
      let f2 = (r = x(/-anchor-gutter$/)) == null ? void 0 : r.value;
      t2.style.marginTop = p3 === "bottom" ? `calc(${f2 != null ? f2 : "2px"} * -1)` : f2 != null ? f2 : "";
    }
  }
}
function y(t2) {
  if (t2) {
    let e = t2.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function T(t2) {
  return !!(t2 !== null && typeof t2 != "undefined" && t2.nodeName && y(t2));
}
function c(t2) {
  return typeof Element != "undefined" ? t2 instanceof Element : t2 !== null && typeof t2 == "object" && t2.nodeType === 1 && typeof t2.nodeName == "string";
}
function H(t2) {
  let e = t2;
  return t2 && typeof t2 == "object" && (Object.hasOwn(t2, "current") ? e = t2.current : Object.hasOwn(t2, "el") && (Object.hasOwn(t2.el, "nativeElement") ? e = t2.el.nativeElement : e = t2.el)), c(e) ? e : void 0;
}
function j(t2, e) {
  var o, n2, r;
  if (t2) switch (t2) {
    case "document":
      return document;
    case "window":
      return window;
    case "body":
      return document.body;
    case "@next":
      return e == null ? void 0 : e.nextElementSibling;
    case "@prev":
      return e == null ? void 0 : e.previousElementSibling;
    case "@first":
      return e == null ? void 0 : e.firstElementChild;
    case "@last":
      return e == null ? void 0 : e.lastElementChild;
    case "@child":
      return (o = e == null ? void 0 : e.children) == null ? void 0 : o[0];
    case "@parent":
      return e == null ? void 0 : e.parentElement;
    case "@grandparent":
      return (n2 = e == null ? void 0 : e.parentElement) == null ? void 0 : n2.parentElement;
    default: {
      if (typeof t2 == "string") {
        let s4 = t2.match(/^@child\[(\d+)]/);
        return s4 ? ((r = e == null ? void 0 : e.children) == null ? void 0 : r[parseInt(s4[1], 10)]) || null : document.querySelector(t2) || null;
      }
      let l3 = ((s4) => typeof s4 == "function" && "call" in s4 && "apply" in s4)(t2) ? t2() : t2, d2 = H(l3);
      return T(d2) ? d2 : (l3 == null ? void 0 : l3.nodeType) === 9 ? l3 : void 0;
    }
  }
}
function ut(t2, e) {
  let o = j(t2, e);
  if (o) o.appendChild(e);
  else throw new Error("Cannot append " + e + " to " + t2);
}
function A(t2, e = {}) {
  if (c(t2)) {
    let o = (n2, r) => {
      var l3, d2;
      let i3 = (l3 = t2 == null ? void 0 : t2.$attrs) != null && l3[n2] ? [(d2 = t2 == null ? void 0 : t2.$attrs) == null ? void 0 : d2[n2]] : [];
      return [r].flat().reduce((s4, a2) => {
        if (a2 != null) {
          let u2 = typeof a2;
          if (u2 === "string" || u2 === "number") s4.push(a2);
          else if (u2 === "object") {
            let p3 = Array.isArray(a2) ? o(n2, a2) : Object.entries(a2).map(([f2, g3]) => n2 === "style" && (g3 || g3 === 0) ? `${f2.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${g3}` : g3 ? f2 : void 0);
            s4 = p3.length ? s4.concat(p3.filter((f2) => !!f2)) : s4;
          }
        }
        return s4;
      }, i3);
    };
    Object.entries(e).forEach(([n2, r]) => {
      if (r != null) {
        let i3 = n2.match(/^on(.+)/);
        i3 ? t2.addEventListener(i3[1].toLowerCase(), r) : n2 === "p-bind" || n2 === "pBind" ? A(t2, r) : (r = n2 === "class" ? [...new Set(o("class", r))].join(" ").trim() : n2 === "style" ? o("style", r).join(";").trim() : r, (t2.$attrs = t2.$attrs || {}) && (t2.$attrs[n2] = r), t2.setAttribute(n2, r));
      }
    });
  }
}
function U(t2, e = {}, ...o) {
  if (t2) {
    let n2 = document.createElement(t2);
    return A(n2, e), n2.append(...o), n2;
  }
}
function ht(t2, e) {
  if (t2) {
    t2.style.opacity = "0";
    let o = +/* @__PURE__ */ new Date(), n2 = "0", r = function() {
      n2 = `${+t2.style.opacity + ((/* @__PURE__ */ new Date()).getTime() - o) / e}`, t2.style.opacity = n2, o = +/* @__PURE__ */ new Date(), +n2 < 1 && ("requestAnimationFrame" in window ? requestAnimationFrame(r) : setTimeout(r, 16));
    };
    r();
  }
}
function Y(t2, e) {
  return c(t2) ? Array.from(t2.querySelectorAll(e)) : [];
}
function z(t2, e) {
  return c(t2) ? t2.matches(e) ? t2 : t2.querySelector(e) : null;
}
function bt(t2, e) {
  t2 && document.activeElement !== t2 && t2.focus(e);
}
function Q(t2, e) {
  if (c(t2)) {
    let o = t2.getAttribute(e);
    return isNaN(o) ? o === "true" || o === "false" ? o === "true" : o : +o;
  }
}
function b(t2, e = "") {
  let o = Y(t2, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`), n2 = [];
  for (let r of o) getComputedStyle(r).display != "none" && getComputedStyle(r).visibility != "hidden" && n2.push(r);
  return n2;
}
function vt(t2, e) {
  let o = b(t2, e);
  return o.length > 0 ? o[0] : null;
}
function Tt(t2) {
  if (t2) {
    let e = t2.offsetHeight, o = getComputedStyle(t2);
    return e -= parseFloat(o.paddingTop) + parseFloat(o.paddingBottom) + parseFloat(o.borderTopWidth) + parseFloat(o.borderBottomWidth), e;
  }
  return 0;
}
function Lt(t2, e) {
  let o = b(t2, e);
  return o.length > 0 ? o[o.length - 1] : null;
}
function K(t2) {
  if (t2) {
    let e = t2.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || E(document.documentElement) || E(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function C(t2, e) {
  if (t2) {
    let o = t2.offsetHeight;
    if (e) {
      let n2 = getComputedStyle(t2);
      o += parseFloat(n2.marginTop) + parseFloat(n2.marginBottom);
    }
    return o;
  }
  return 0;
}
function Mt() {
  if (window.getSelection) return window.getSelection().toString();
  if (document.getSelection) return document.getSelection().toString();
}
function Rt(t2) {
  if (t2) {
    let e = t2.offsetWidth, o = getComputedStyle(t2);
    return e -= parseFloat(o.paddingLeft) + parseFloat(o.paddingRight) + parseFloat(o.borderLeftWidth) + parseFloat(o.borderRightWidth), e;
  }
  return 0;
}
function et(t2) {
  return !!(t2 && t2.offsetParent != null);
}
function qt() {
  return typeof window == "undefined" || !window.matchMedia ? false : window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
function Yt() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Qt() {
  return new Promise((t2) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(t2);
    });
  });
}
function Zt(t2) {
  var e;
  t2 && ("remove" in Element.prototype ? t2.remove() : (e = t2.parentNode) == null || e.removeChild(t2));
}
function Gt(t2, e) {
  let o = H(t2);
  if (o) o.removeChild(e);
  else throw new Error("Cannot remove " + e + " from " + t2);
}
function Kt(t2, e) {
  let o = getComputedStyle(t2).getPropertyValue("borderTopWidth"), n2 = o ? parseFloat(o) : 0, r = getComputedStyle(t2).getPropertyValue("paddingTop"), i3 = r ? parseFloat(r) : 0, l3 = t2.getBoundingClientRect(), s4 = e.getBoundingClientRect().top + document.body.scrollTop - (l3.top + document.body.scrollTop) - n2 - i3, a2 = t2.scrollTop, u2 = t2.clientHeight, p3 = C(e);
  s4 < 0 ? t2.scrollTop = a2 + s4 : s4 + p3 > u2 && (t2.scrollTop = a2 + s4 - u2 + p3);
}
function _t(t2, e = "", o) {
  c(t2) && o !== null && o !== void 0 && t2.setAttribute(e, o);
}
function te(t2, e, o = null, n2) {
  var r;
  e && ((r = t2 == null ? void 0 : t2.style) == null || r.setProperty(e, o, n2));
}

// node_modules/@primeuix/utils/dist/object/index.mjs
function l(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function b2(e, t2, n2 = /* @__PURE__ */ new WeakSet()) {
  if (e === t2) return true;
  if (!e || !t2 || typeof e != "object" || typeof t2 != "object" || n2.has(e) || n2.has(t2)) return false;
  n2.add(e).add(t2);
  let o = Array.isArray(e), r = Array.isArray(t2), u2, f2, T2;
  if (o && r) {
    if (f2 = e.length, f2 != t2.length) return false;
    for (u2 = f2; u2-- !== 0; ) if (!b2(e[u2], t2[u2], n2)) return false;
    return true;
  }
  if (o != r) return false;
  let S2 = e instanceof Date, A2 = t2 instanceof Date;
  if (S2 != A2) return false;
  if (S2 && A2) return e.getTime() == t2.getTime();
  let I2 = e instanceof RegExp, L = t2 instanceof RegExp;
  if (I2 != L) return false;
  if (I2 && L) return e.toString() == t2.toString();
  let R2 = Object.keys(e);
  if (f2 = R2.length, f2 !== Object.keys(t2).length) return false;
  for (u2 = f2; u2-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(t2, R2[u2])) return false;
  for (u2 = f2; u2-- !== 0; ) if (T2 = R2[u2], !b2(e[T2], t2[T2], n2)) return false;
  return true;
}
function y2(e, t2) {
  return b2(e, t2);
}
function c2(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function s(e) {
  return !l(e);
}
function p(e, t2) {
  if (!e || !t2) return null;
  try {
    let n2 = e[t2];
    if (s(n2)) return n2;
  } catch (n2) {
  }
  if (Object.keys(e).length) {
    if (c2(t2)) return t2(e);
    if (t2.indexOf(".") === -1) return e[t2];
    {
      let n2 = t2.split("."), o = e;
      for (let r = 0, u2 = n2.length; r < u2; ++r) {
        if (o == null) return null;
        o = o[n2[r]];
      }
      return o;
    }
  }
  return null;
}
function k2(e, t2, n2) {
  return n2 ? p(e, n2) === p(t2, n2) : y2(e, t2);
}
function i(e, t2 = true) {
  return e instanceof Object && e.constructor === Object && (t2 || Object.keys(e).length !== 0);
}
function M(e, t2) {
  let n2 = -1;
  if (s(e)) try {
    n2 = e.findLastIndex(t2);
  } catch (o) {
    n2 = e.lastIndexOf([...e].reverse().find(t2));
  }
  return n2;
}
function m(e, ...t2) {
  return c2(e) ? e(...t2) : e;
}
function a(e, t2 = true) {
  return typeof e == "string" && (t2 || e !== "");
}
function g(e) {
  return a(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function F2(e, t2 = "", n2 = {}) {
  let o = g(t2).split("."), r = o.shift();
  if (r) {
    if (i(e)) {
      let u2 = Object.keys(e).find((f2) => g(f2) === r) || "";
      return F2(m(e[u2], n2), o.join("."), n2);
    }
    return;
  }
  return m(e, n2);
}
function C2(e, t2 = true) {
  return Array.isArray(e) && (t2 || e.length !== 0);
}
function z2(e) {
  return s(e) && !isNaN(e);
}
function J(e = "") {
  return s(e) && e.length === 1 && !!e.match(/\S| /);
}
function G(e, t2) {
  if (t2) {
    let n2 = t2.test(e);
    return t2.lastIndex = 0, n2;
  }
  return false;
}
function Y2(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function X(e) {
  if (e && /[\xC0-\xFF\u0100-\u017E]/.test(e)) {
    let n2 = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let o in n2) e = e.replace(n2[o], o);
  }
  return e;
}
function re(e) {
  return a(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function oe(e) {
  return e === "auto" ? 0 : typeof e == "number" ? e : Number(e.replace(/[^\d.]/g, "").replace(",", ".")) * 1e3;
}

// node_modules/@primeuix/utils/dist/uuid/index.mjs
var t = {};
function s2(n2 = "pui_id_") {
  return Object.hasOwn(t, n2) || (t[n2] = 0), t[n2]++, `${n2}${t[n2]}`;
}

// node_modules/@primeuix/utils/dist/eventbus/index.mjs
function s3() {
  let r = /* @__PURE__ */ new Map();
  return { on(e, t2) {
    let n2 = r.get(e);
    return n2 ? n2.push(t2) : n2 = [t2], r.set(e, n2), this;
  }, off(e, t2) {
    let n2 = r.get(e);
    return n2 && n2.splice(n2.indexOf(t2) >>> 0, 1), this;
  }, emit(e, t2) {
    let n2 = r.get(e);
    n2 && n2.forEach((i3) => {
      i3(t2);
    });
  }, clear() {
    r.clear();
  } };
}

// node_modules/@primeuix/utils/dist/mergeprops/index.mjs
var p2 = Object.defineProperty;
var i2 = Object.getOwnPropertySymbols;
var x2 = Object.prototype.hasOwnProperty;
var c3 = Object.prototype.propertyIsEnumerable;
var d = (t2, e, a2) => e in t2 ? p2(t2, e, { enumerable: true, configurable: true, writable: true, value: a2 }) : t2[e] = a2;
var n = (t2, e) => {
  for (var a2 in e || (e = {})) x2.call(e, a2) && d(t2, a2, e[a2]);
  if (i2) for (var a2 of i2(e)) c3.call(e, a2) && d(t2, a2, e[a2]);
  return t2;
};
function u(...t2) {
  if (t2) {
    let e = [];
    for (let a2 = 0; a2 < t2.length; a2++) {
      let o = t2[a2];
      if (!o) continue;
      let r = typeof o;
      if (r === "string" || r === "number") e.push(o);
      else if (r === "object") {
        let s4 = Array.isArray(o) ? [u(...o)] : Object.entries(o).map(([f2, m2]) => m2 ? f2 : void 0);
        e = s4.length ? e.concat(s4.filter((f2) => !!f2)) : e;
      }
    }
    return e.join(" ").trim();
  }
}
function l2(t2) {
  return typeof t2 == "function" && "call" in t2 && "apply" in t2;
}
function w2(...t2) {
  return t2 == null ? void 0 : t2.reduce((e, a2 = {}) => {
    for (let o in a2) {
      let r = a2[o];
      if (o === "style") e.style = n(n({}, e.style), a2.style);
      else if (o === "class" || o === "className") e[o] = u(e[o], a2[o]);
      else if (l2(r)) {
        let s4 = e[o];
        e[o] = s4 ? (...f2) => {
          s4(...f2), r(...f2);
        } : r;
      } else e[o] = r;
    }
    return e;
  }, {});
}

// node_modules/@primeuix/utils/dist/zindex/index.mjs
function g2() {
  let r = [], i3 = (e, n2, t2 = 999) => {
    let s4 = u2(e, n2, t2), o = s4.value + (s4.key === e ? 0 : t2) + 1;
    return r.push({ key: e, value: o }), o;
  }, d2 = (e) => {
    r = r.filter((n2) => n2.value !== e);
  }, a2 = (e, n2) => u2(e, n2).value, u2 = (e, n2, t2 = 0) => [...r].reverse().find((s4) => n2 ? true : s4.key === e) || { key: e, value: t2 }, l3 = (e) => e && parseInt(e.style.zIndex, 10) || 0;
  return { get: l3, set: (e, n2, t2) => {
    n2 && (n2.style.zIndex = String(i3(e, true, t2)));
  }, clear: (e) => {
    e && (d2(l3(e)), e.style.zIndex = "");
  }, getCurrent: (e) => a2(e, true) };
}
var x3 = g2();

export {
  f,
  R,
  W,
  st,
  P,
  dt,
  x,
  w,
  h,
  k,
  $,
  V,
  D,
  S,
  v,
  I,
  j,
  ut,
  A,
  U,
  ht,
  Y,
  z,
  bt,
  Q,
  b,
  vt,
  Tt,
  Lt,
  K,
  C,
  Mt,
  Rt,
  et,
  qt,
  Yt,
  Qt,
  Zt,
  Gt,
  Kt,
  _t,
  te,
  s3 as s,
  w2,
  l,
  y2 as y,
  c2 as c,
  s as s2,
  p,
  k2,
  i,
  M,
  m,
  a,
  g,
  F2 as F,
  C2,
  z2,
  J,
  G,
  Y2,
  X,
  re,
  oe,
  s2 as s3
};
//# sourceMappingURL=chunk-YUNR4ATL.js.map
