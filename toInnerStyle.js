/**
 * Created by LiYonglei on 2017/4/22.
 * 将传入的dom以及其后代元素的外部css转化为内联css
 * 注意:该方法并不支持伪元素的转化,因此转化完毕后，若外部css一旦不起作用了，那么伪元素都将会丢失
/**/
const ignoreKey = /^block(-s|S)ize|^border(-b|B)lock|^border(-i|I)nline|^column(-r|R)ule|^font$|^font(-f|F)amily|^inline(-s|S)ize|^perspective|^text(-d|D)ecoration|^text(-e|E)mphasis|^-?webkit|^-?o|^-?ms|^-?moz/;
const hiddenStyle = {
  all: 'initial',
  position: 'absolute',
  opacity: '0',
  pointerEvents: 'none',
  zIndex: -999999
}
const supportAll = 'all' in document.documentElement.style;
/**
 * 
 * @param {HTMLElement} dom 要转换的元素
 * @param {Boolean} copy 是转换自身还是生成一个新的副本进行转换
 * @returns 
 */
function toInnerStyle(dom, copy = true) {
  let container;
  let iframe;
  let contentWindow;
  if (supportAll) {
    container = document.createElement('div');
    Object.assign(container.style, hiddenStyle);
    document.documentElement.append(container);
  } else {
    iframe = document.createElement('iframe');
    Object.keys(hiddenStyle).forEach(key => {
      iframe.style[key] = hiddenStyle[key];
    })
    document.documentElement.append(iframe);
    contentWindow = iframe.contentWindow;
    container = contentWindow.document.documentElement;
  }
  const copyDom = transformCSS(dom);
  if (supportAll) {
    document.documentElement.removeChild(container);
  } else {
    document.documentElement.removeChild(iframe);
  }
  return copyDom;
  function transformCSS(dom) {
    const computedStyle = window.getComputedStyle(dom);
    const baseDom = document.createElement(dom.tagName);
    container.append(baseDom);
    const baseComputedStyle = (contentWindow || window).getComputedStyle(baseDom);
    const styles = getStyle(computedStyle, baseComputedStyle).join(";")
    let copyDom;
    if (copy) {
      copyDom = dom.cloneNode(false);
      copyDom.setAttribute("style", styles);
    } else {
      dom.setAttribute("style", styles);
    }
    const childNodes = dom.childNodes;
    if (childNodes) {
      for (let i = 0; i < childNodes?.length || 0; i++) {
        const childNode = childNodes[i];
        if (childNode.nodeType === Node.ELEMENT_NODE) {
          const childCopyDom = transformCSS(childNode);
          copyDom?.append(childCopyDom);
        } else {
          copyDom?.append(childNode.cloneNode(false));
        }
      }
    }
    return copyDom;
  }
  function getStyle(computedStyle, baseComputedStyle) {
    var csses = {},
      csses2 = {};
    for (let key in computedStyle) {
      if (
        ignoreKey.test(key) ||
        baseComputedStyle[key] === computedStyle[key]
      ) {
        continue;
      }
      if (isNaN(key) && typeof computedStyle[key] === "string" && computedStyle[key].length) {
        csses[key] = computedStyle[key];
      }
    }
    Object.keys(csses).forEach(function (key) {
      var key2 = key.replace(/^ms|^webkit|^moz|[A-Z]/g, function (prefix) {
        return "-" + prefix.toLowerCase();
      });
      csses2[key2] = csses[key];
    });
    return Object.keys(csses2).map(function (key) {
      return key + ":" + csses2[key];
    });
  }
}
