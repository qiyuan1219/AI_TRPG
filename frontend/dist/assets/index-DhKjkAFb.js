(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function nT(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var uy={exports:{}},Wu={},dy={exports:{}},qe={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var xl=Symbol.for("react.element"),iT=Symbol.for("react.portal"),rT=Symbol.for("react.fragment"),sT=Symbol.for("react.strict_mode"),aT=Symbol.for("react.profiler"),oT=Symbol.for("react.provider"),lT=Symbol.for("react.context"),cT=Symbol.for("react.forward_ref"),uT=Symbol.for("react.suspense"),dT=Symbol.for("react.memo"),fT=Symbol.for("react.lazy"),p0=Symbol.iterator;function hT(t){return t===null||typeof t!="object"?null:(t=p0&&t[p0]||t["@@iterator"],typeof t=="function"?t:null)}var fy={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},hy=Object.assign,py={};function ja(t,e,n){this.props=t,this.context=e,this.refs=py,this.updater=n||fy}ja.prototype.isReactComponent={};ja.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};ja.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function my(){}my.prototype=ja.prototype;function em(t,e,n){this.props=t,this.context=e,this.refs=py,this.updater=n||fy}var tm=em.prototype=new my;tm.constructor=em;hy(tm,ja.prototype);tm.isPureReactComponent=!0;var m0=Array.isArray,gy=Object.prototype.hasOwnProperty,nm={current:null},vy={key:!0,ref:!0,__self:!0,__source:!0};function xy(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)gy.call(e,i)&&!vy.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),c=0;c<o;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:xl,type:t,key:s,ref:a,props:r,_owner:nm.current}}function pT(t,e){return{$$typeof:xl,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function im(t){return typeof t=="object"&&t!==null&&t.$$typeof===xl}function mT(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var g0=/\/+/g;function Sd(t,e){return typeof t=="object"&&t!==null&&t.key!=null?mT(""+t.key):e.toString(36)}function Uc(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case xl:case iT:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Sd(a,0):i,m0(r)?(n="",t!=null&&(n=t.replace(g0,"$&/")+"/"),Uc(r,e,n,"",function(c){return c})):r!=null&&(im(r)&&(r=pT(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(g0,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",m0(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+Sd(s,o);a+=Uc(s,e,n,l,r)}else if(l=hT(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+Sd(s,o++),a+=Uc(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function Fl(t,e,n){if(t==null)return t;var i=[],r=0;return Uc(t,i,"","",function(s){return e.call(n,s,r++)}),i}function gT(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var _n={current:null},Fc={transition:null},vT={ReactCurrentDispatcher:_n,ReactCurrentBatchConfig:Fc,ReactCurrentOwner:nm};function _y(){throw Error("act(...) is not supported in production builds of React.")}qe.Children={map:Fl,forEach:function(t,e,n){Fl(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return Fl(t,function(){e++}),e},toArray:function(t){return Fl(t,function(e){return e})||[]},only:function(t){if(!im(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};qe.Component=ja;qe.Fragment=rT;qe.Profiler=aT;qe.PureComponent=em;qe.StrictMode=sT;qe.Suspense=uT;qe.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=vT;qe.act=_y;qe.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=hy({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=nm.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)gy.call(e,l)&&!vy.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var c=0;c<l;c++)o[c]=arguments[c+2];i.children=o}return{$$typeof:xl,type:t.type,key:r,ref:s,props:i,_owner:a}};qe.createContext=function(t){return t={$$typeof:lT,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:oT,_context:t},t.Consumer=t};qe.createElement=xy;qe.createFactory=function(t){var e=xy.bind(null,t);return e.type=t,e};qe.createRef=function(){return{current:null}};qe.forwardRef=function(t){return{$$typeof:cT,render:t}};qe.isValidElement=im;qe.lazy=function(t){return{$$typeof:fT,_payload:{_status:-1,_result:t},_init:gT}};qe.memo=function(t,e){return{$$typeof:dT,type:t,compare:e===void 0?null:e}};qe.startTransition=function(t){var e=Fc.transition;Fc.transition={};try{t()}finally{Fc.transition=e}};qe.unstable_act=_y;qe.useCallback=function(t,e){return _n.current.useCallback(t,e)};qe.useContext=function(t){return _n.current.useContext(t)};qe.useDebugValue=function(){};qe.useDeferredValue=function(t){return _n.current.useDeferredValue(t)};qe.useEffect=function(t,e){return _n.current.useEffect(t,e)};qe.useId=function(){return _n.current.useId()};qe.useImperativeHandle=function(t,e,n){return _n.current.useImperativeHandle(t,e,n)};qe.useInsertionEffect=function(t,e){return _n.current.useInsertionEffect(t,e)};qe.useLayoutEffect=function(t,e){return _n.current.useLayoutEffect(t,e)};qe.useMemo=function(t,e){return _n.current.useMemo(t,e)};qe.useReducer=function(t,e,n){return _n.current.useReducer(t,e,n)};qe.useRef=function(t){return _n.current.useRef(t)};qe.useState=function(t){return _n.current.useState(t)};qe.useSyncExternalStore=function(t,e,n){return _n.current.useSyncExternalStore(t,e,n)};qe.useTransition=function(){return _n.current.useTransition()};qe.version="18.3.1";dy.exports=qe;var z=dy.exports;const xT=nT(z);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var _T=z,yT=Symbol.for("react.element"),ST=Symbol.for("react.fragment"),MT=Object.prototype.hasOwnProperty,ET=_T.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,TT={key:!0,ref:!0,__self:!0,__source:!0};function yy(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)MT.call(e,i)&&!TT.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:yT,type:t,key:s,ref:a,props:r,_owner:ET.current}}Wu.Fragment=ST;Wu.jsx=yy;Wu.jsxs=yy;uy.exports=Wu;var x=uy.exports,Kf={},Sy={exports:{}},Bn={},My={exports:{}},Ey={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(F,K){var Y=F.length;F.push(K);e:for(;0<Y;){var re=Y-1>>>1,oe=F[re];if(0<r(oe,K))F[re]=K,F[Y]=oe,Y=re;else break e}}function n(F){return F.length===0?null:F[0]}function i(F){if(F.length===0)return null;var K=F[0],Y=F.pop();if(Y!==K){F[0]=Y;e:for(var re=0,oe=F.length,xe=oe>>>1;re<xe;){var Pe=2*(re+1)-1,Ae=F[Pe],Q=Pe+1,le=F[Q];if(0>r(Ae,Y))Q<oe&&0>r(le,Ae)?(F[re]=le,F[Q]=Y,re=Q):(F[re]=Ae,F[Pe]=Y,re=Pe);else if(Q<oe&&0>r(le,Y))F[re]=le,F[Q]=Y,re=Q;else break e}}return K}function r(F,K){var Y=F.sortIndex-K.sortIndex;return Y!==0?Y:F.id-K.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],c=[],u=1,f=null,d=3,p=!1,v=!1,y=!1,g=typeof setTimeout=="function"?setTimeout:null,h=typeof clearTimeout=="function"?clearTimeout:null,m=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function _(F){for(var K=n(c);K!==null;){if(K.callback===null)i(c);else if(K.startTime<=F)i(c),K.sortIndex=K.expirationTime,e(l,K);else break;K=n(c)}}function M(F){if(y=!1,_(F),!v)if(n(l)!==null)v=!0,H(w);else{var K=n(c);K!==null&&B(M,K.startTime-F)}}function w(F,K){v=!1,y&&(y=!1,h(S),S=-1),p=!0;var Y=d;try{for(_(K),f=n(l);f!==null&&(!(f.expirationTime>K)||F&&!D());){var re=f.callback;if(typeof re=="function"){f.callback=null,d=f.priorityLevel;var oe=re(f.expirationTime<=K);K=t.unstable_now(),typeof oe=="function"?f.callback=oe:f===n(l)&&i(l),_(K)}else i(l);f=n(l)}if(f!==null)var xe=!0;else{var Pe=n(c);Pe!==null&&B(M,Pe.startTime-K),xe=!1}return xe}finally{f=null,d=Y,p=!1}}var T=!1,R=null,S=-1,A=5,N=-1;function D(){return!(t.unstable_now()-N<A)}function I(){if(R!==null){var F=t.unstable_now();N=F;var K=!0;try{K=R(!0,F)}finally{K?X():(T=!1,R=null)}}else T=!1}var X;if(typeof m=="function")X=function(){m(I)};else if(typeof MessageChannel<"u"){var G=new MessageChannel,U=G.port2;G.port1.onmessage=I,X=function(){U.postMessage(null)}}else X=function(){g(I,0)};function H(F){R=F,T||(T=!0,X())}function B(F,K){S=g(function(){F(t.unstable_now())},K)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(F){F.callback=null},t.unstable_continueExecution=function(){v||p||(v=!0,H(w))},t.unstable_forceFrameRate=function(F){0>F||125<F?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):A=0<F?Math.floor(1e3/F):5},t.unstable_getCurrentPriorityLevel=function(){return d},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(F){switch(d){case 1:case 2:case 3:var K=3;break;default:K=d}var Y=d;d=K;try{return F()}finally{d=Y}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(F,K){switch(F){case 1:case 2:case 3:case 4:case 5:break;default:F=3}var Y=d;d=F;try{return K()}finally{d=Y}},t.unstable_scheduleCallback=function(F,K,Y){var re=t.unstable_now();switch(typeof Y=="object"&&Y!==null?(Y=Y.delay,Y=typeof Y=="number"&&0<Y?re+Y:re):Y=re,F){case 1:var oe=-1;break;case 2:oe=250;break;case 5:oe=1073741823;break;case 4:oe=1e4;break;default:oe=5e3}return oe=Y+oe,F={id:u++,callback:K,priorityLevel:F,startTime:Y,expirationTime:oe,sortIndex:-1},Y>re?(F.sortIndex=Y,e(c,F),n(l)===null&&F===n(c)&&(y?(h(S),S=-1):y=!0,B(M,Y-re))):(F.sortIndex=oe,e(l,F),v||p||(v=!0,H(w))),F},t.unstable_shouldYield=D,t.unstable_wrapCallback=function(F){var K=d;return function(){var Y=d;d=K;try{return F.apply(this,arguments)}finally{d=Y}}}})(Ey);My.exports=Ey;var wT=My.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var bT=z,On=wT;function ce(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var Ty=new Set,Wo={};function Ds(t,e){Pa(t,e),Pa(t+"Capture",e)}function Pa(t,e){for(Wo[t]=e,t=0;t<e.length;t++)Ty.add(e[t])}var nr=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),qf=Object.prototype.hasOwnProperty,AT=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,v0={},x0={};function CT(t){return qf.call(x0,t)?!0:qf.call(v0,t)?!1:AT.test(t)?x0[t]=!0:(v0[t]=!0,!1)}function RT(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function PT(t,e,n,i){if(e===null||typeof e>"u"||RT(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function yn(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var tn={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){tn[t]=new yn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];tn[e]=new yn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){tn[t]=new yn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){tn[t]=new yn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){tn[t]=new yn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){tn[t]=new yn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){tn[t]=new yn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){tn[t]=new yn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){tn[t]=new yn(t,5,!1,t.toLowerCase(),null,!1,!1)});var rm=/[\-:]([a-z])/g;function sm(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(rm,sm);tn[e]=new yn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(rm,sm);tn[e]=new yn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(rm,sm);tn[e]=new yn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){tn[t]=new yn(t,1,!1,t.toLowerCase(),null,!1,!1)});tn.xlinkHref=new yn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){tn[t]=new yn(t,1,!1,t.toLowerCase(),null,!0,!0)});function am(t,e,n,i){var r=tn.hasOwnProperty(e)?tn[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(PT(e,n,r,i)&&(n=null),i||r===null?CT(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var cr=bT.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Ol=Symbol.for("react.element"),ia=Symbol.for("react.portal"),ra=Symbol.for("react.fragment"),om=Symbol.for("react.strict_mode"),Zf=Symbol.for("react.profiler"),wy=Symbol.for("react.provider"),by=Symbol.for("react.context"),lm=Symbol.for("react.forward_ref"),Jf=Symbol.for("react.suspense"),Qf=Symbol.for("react.suspense_list"),cm=Symbol.for("react.memo"),Mr=Symbol.for("react.lazy"),Ay=Symbol.for("react.offscreen"),_0=Symbol.iterator;function Ja(t){return t===null||typeof t!="object"?null:(t=_0&&t[_0]||t["@@iterator"],typeof t=="function"?t:null)}var At=Object.assign,Md;function go(t){if(Md===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Md=e&&e[1]||""}return`
`+Md+t}var Ed=!1;function Td(t,e){if(!t||Ed)return"";Ed=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Ed=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?go(t):""}function DT(t){switch(t.tag){case 5:return go(t.type);case 16:return go("Lazy");case 13:return go("Suspense");case 19:return go("SuspenseList");case 0:case 2:case 15:return t=Td(t.type,!1),t;case 11:return t=Td(t.type.render,!1),t;case 1:return t=Td(t.type,!0),t;default:return""}}function eh(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ra:return"Fragment";case ia:return"Portal";case Zf:return"Profiler";case om:return"StrictMode";case Jf:return"Suspense";case Qf:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case by:return(t.displayName||"Context")+".Consumer";case wy:return(t._context.displayName||"Context")+".Provider";case lm:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case cm:return e=t.displayName||null,e!==null?e:eh(t.type)||"Memo";case Mr:e=t._payload,t=t._init;try{return eh(t(e))}catch{}}return null}function NT(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return eh(e);case 8:return e===om?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function zr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function Cy(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function LT(t){var e=Cy(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function kl(t){t._valueTracker||(t._valueTracker=LT(t))}function Ry(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=Cy(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function iu(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function th(t,e){var n=e.checked;return At({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function y0(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=zr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function Py(t,e){e=e.checked,e!=null&&am(t,"checked",e,!1)}function nh(t,e){Py(t,e);var n=zr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?ih(t,e.type,n):e.hasOwnProperty("defaultValue")&&ih(t,e.type,zr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function S0(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function ih(t,e,n){(e!=="number"||iu(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var vo=Array.isArray;function ya(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+zr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function rh(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(ce(91));return At({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function M0(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(ce(92));if(vo(n)){if(1<n.length)throw Error(ce(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:zr(n)}}function Dy(t,e){var n=zr(e.value),i=zr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function E0(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function Ny(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function sh(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?Ny(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Bl,Ly=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Bl=Bl||document.createElement("div"),Bl.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Bl.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function $o(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ao={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},IT=["Webkit","ms","Moz","O"];Object.keys(Ao).forEach(function(t){IT.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ao[e]=Ao[t]})});function Iy(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ao.hasOwnProperty(t)&&Ao[t]?(""+e).trim():e+"px"}function Uy(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=Iy(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var UT=At({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function ah(t,e){if(e){if(UT[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(ce(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(ce(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(ce(61))}if(e.style!=null&&typeof e.style!="object")throw Error(ce(62))}}function oh(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var lh=null;function um(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var ch=null,Sa=null,Ma=null;function T0(t){if(t=Sl(t)){if(typeof ch!="function")throw Error(ce(280));var e=t.stateNode;e&&(e=qu(e),ch(t.stateNode,t.type,e))}}function Fy(t){Sa?Ma?Ma.push(t):Ma=[t]:Sa=t}function Oy(){if(Sa){var t=Sa,e=Ma;if(Ma=Sa=null,T0(t),e)for(t=0;t<e.length;t++)T0(e[t])}}function ky(t,e){return t(e)}function By(){}var wd=!1;function zy(t,e,n){if(wd)return t(e,n);wd=!0;try{return ky(t,e,n)}finally{wd=!1,(Sa!==null||Ma!==null)&&(By(),Oy())}}function Xo(t,e){var n=t.stateNode;if(n===null)return null;var i=qu(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(ce(231,e,typeof n));return n}var uh=!1;if(nr)try{var Qa={};Object.defineProperty(Qa,"passive",{get:function(){uh=!0}}),window.addEventListener("test",Qa,Qa),window.removeEventListener("test",Qa,Qa)}catch{uh=!1}function FT(t,e,n,i,r,s,a,o,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(u){this.onError(u)}}var Co=!1,ru=null,su=!1,dh=null,OT={onError:function(t){Co=!0,ru=t}};function kT(t,e,n,i,r,s,a,o,l){Co=!1,ru=null,FT.apply(OT,arguments)}function BT(t,e,n,i,r,s,a,o,l){if(kT.apply(this,arguments),Co){if(Co){var c=ru;Co=!1,ru=null}else throw Error(ce(198));su||(su=!0,dh=c)}}function Ns(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Vy(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function w0(t){if(Ns(t)!==t)throw Error(ce(188))}function zT(t){var e=t.alternate;if(!e){if(e=Ns(t),e===null)throw Error(ce(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return w0(r),t;if(s===i)return w0(r),e;s=s.sibling}throw Error(ce(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(ce(189))}}if(n.alternate!==i)throw Error(ce(190))}if(n.tag!==3)throw Error(ce(188));return n.stateNode.current===n?t:e}function Gy(t){return t=zT(t),t!==null?Hy(t):null}function Hy(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Hy(t);if(e!==null)return e;t=t.sibling}return null}var jy=On.unstable_scheduleCallback,b0=On.unstable_cancelCallback,VT=On.unstable_shouldYield,GT=On.unstable_requestPaint,Ot=On.unstable_now,HT=On.unstable_getCurrentPriorityLevel,dm=On.unstable_ImmediatePriority,Wy=On.unstable_UserBlockingPriority,au=On.unstable_NormalPriority,jT=On.unstable_LowPriority,$y=On.unstable_IdlePriority,$u=null,Pi=null;function WT(t){if(Pi&&typeof Pi.onCommitFiberRoot=="function")try{Pi.onCommitFiberRoot($u,t,void 0,(t.current.flags&128)===128)}catch{}}var di=Math.clz32?Math.clz32:YT,$T=Math.log,XT=Math.LN2;function YT(t){return t>>>=0,t===0?32:31-($T(t)/XT|0)|0}var zl=64,Vl=4194304;function xo(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function ou(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=xo(o):(s&=a,s!==0&&(i=xo(s)))}else a=n&~r,a!==0?i=xo(a):s!==0&&(i=xo(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-di(e),r=1<<n,i|=t[n],e&=~r;return i}function KT(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function qT(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-di(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=KT(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function fh(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Xy(){var t=zl;return zl<<=1,!(zl&4194240)&&(zl=64),t}function bd(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function _l(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-di(e),t[e]=n}function ZT(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-di(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function fm(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-di(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var dt=0;function Yy(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Ky,hm,qy,Zy,Jy,hh=!1,Gl=[],Dr=null,Nr=null,Lr=null,Yo=new Map,Ko=new Map,Tr=[],JT="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function A0(t,e){switch(t){case"focusin":case"focusout":Dr=null;break;case"dragenter":case"dragleave":Nr=null;break;case"mouseover":case"mouseout":Lr=null;break;case"pointerover":case"pointerout":Yo.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ko.delete(e.pointerId)}}function eo(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Sl(e),e!==null&&hm(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function QT(t,e,n,i,r){switch(e){case"focusin":return Dr=eo(Dr,t,e,n,i,r),!0;case"dragenter":return Nr=eo(Nr,t,e,n,i,r),!0;case"mouseover":return Lr=eo(Lr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Yo.set(s,eo(Yo.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ko.set(s,eo(Ko.get(s)||null,t,e,n,i,r)),!0}return!1}function Qy(t){var e=hs(t.target);if(e!==null){var n=Ns(e);if(n!==null){if(e=n.tag,e===13){if(e=Vy(n),e!==null){t.blockedOn=e,Jy(t.priority,function(){qy(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Oc(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=ph(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);lh=i,n.target.dispatchEvent(i),lh=null}else return e=Sl(n),e!==null&&hm(e),t.blockedOn=n,!1;e.shift()}return!0}function C0(t,e,n){Oc(t)&&n.delete(e)}function ew(){hh=!1,Dr!==null&&Oc(Dr)&&(Dr=null),Nr!==null&&Oc(Nr)&&(Nr=null),Lr!==null&&Oc(Lr)&&(Lr=null),Yo.forEach(C0),Ko.forEach(C0)}function to(t,e){t.blockedOn===e&&(t.blockedOn=null,hh||(hh=!0,On.unstable_scheduleCallback(On.unstable_NormalPriority,ew)))}function qo(t){function e(r){return to(r,t)}if(0<Gl.length){to(Gl[0],t);for(var n=1;n<Gl.length;n++){var i=Gl[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Dr!==null&&to(Dr,t),Nr!==null&&to(Nr,t),Lr!==null&&to(Lr,t),Yo.forEach(e),Ko.forEach(e),n=0;n<Tr.length;n++)i=Tr[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Tr.length&&(n=Tr[0],n.blockedOn===null);)Qy(n),n.blockedOn===null&&Tr.shift()}var Ea=cr.ReactCurrentBatchConfig,lu=!0;function tw(t,e,n,i){var r=dt,s=Ea.transition;Ea.transition=null;try{dt=1,pm(t,e,n,i)}finally{dt=r,Ea.transition=s}}function nw(t,e,n,i){var r=dt,s=Ea.transition;Ea.transition=null;try{dt=4,pm(t,e,n,i)}finally{dt=r,Ea.transition=s}}function pm(t,e,n,i){if(lu){var r=ph(t,e,n,i);if(r===null)Fd(t,e,i,cu,n),A0(t,i);else if(QT(r,t,e,n,i))i.stopPropagation();else if(A0(t,i),e&4&&-1<JT.indexOf(t)){for(;r!==null;){var s=Sl(r);if(s!==null&&Ky(s),s=ph(t,e,n,i),s===null&&Fd(t,e,i,cu,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Fd(t,e,i,null,n)}}var cu=null;function ph(t,e,n,i){if(cu=null,t=um(i),t=hs(t),t!==null)if(e=Ns(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Vy(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return cu=t,null}function eS(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(HT()){case dm:return 1;case Wy:return 4;case au:case jT:return 16;case $y:return 536870912;default:return 16}default:return 16}}var Ar=null,mm=null,kc=null;function tS(){if(kc)return kc;var t,e=mm,n=e.length,i,r="value"in Ar?Ar.value:Ar.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return kc=r.slice(t,1<i?1-i:void 0)}function Bc(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Hl(){return!0}function R0(){return!1}function zn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Hl:R0,this.isPropagationStopped=R0,this}return At(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Hl)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Hl)},persist:function(){},isPersistent:Hl}),e}var Wa={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},gm=zn(Wa),yl=At({},Wa,{view:0,detail:0}),iw=zn(yl),Ad,Cd,no,Xu=At({},yl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:vm,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==no&&(no&&t.type==="mousemove"?(Ad=t.screenX-no.screenX,Cd=t.screenY-no.screenY):Cd=Ad=0,no=t),Ad)},movementY:function(t){return"movementY"in t?t.movementY:Cd}}),P0=zn(Xu),rw=At({},Xu,{dataTransfer:0}),sw=zn(rw),aw=At({},yl,{relatedTarget:0}),Rd=zn(aw),ow=At({},Wa,{animationName:0,elapsedTime:0,pseudoElement:0}),lw=zn(ow),cw=At({},Wa,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),uw=zn(cw),dw=At({},Wa,{data:0}),D0=zn(dw),fw={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},hw={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},pw={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function mw(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=pw[t])?!!e[t]:!1}function vm(){return mw}var gw=At({},yl,{key:function(t){if(t.key){var e=fw[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Bc(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?hw[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:vm,charCode:function(t){return t.type==="keypress"?Bc(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Bc(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),vw=zn(gw),xw=At({},Xu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),N0=zn(xw),_w=At({},yl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:vm}),yw=zn(_w),Sw=At({},Wa,{propertyName:0,elapsedTime:0,pseudoElement:0}),Mw=zn(Sw),Ew=At({},Xu,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),Tw=zn(Ew),ww=[9,13,27,32],xm=nr&&"CompositionEvent"in window,Ro=null;nr&&"documentMode"in document&&(Ro=document.documentMode);var bw=nr&&"TextEvent"in window&&!Ro,nS=nr&&(!xm||Ro&&8<Ro&&11>=Ro),L0=" ",I0=!1;function iS(t,e){switch(t){case"keyup":return ww.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function rS(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var sa=!1;function Aw(t,e){switch(t){case"compositionend":return rS(e);case"keypress":return e.which!==32?null:(I0=!0,L0);case"textInput":return t=e.data,t===L0&&I0?null:t;default:return null}}function Cw(t,e){if(sa)return t==="compositionend"||!xm&&iS(t,e)?(t=tS(),kc=mm=Ar=null,sa=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return nS&&e.locale!=="ko"?null:e.data;default:return null}}var Rw={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function U0(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!Rw[t.type]:e==="textarea"}function sS(t,e,n,i){Fy(i),e=uu(e,"onChange"),0<e.length&&(n=new gm("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Po=null,Zo=null;function Pw(t){gS(t,0)}function Yu(t){var e=la(t);if(Ry(e))return t}function Dw(t,e){if(t==="change")return e}var aS=!1;if(nr){var Pd;if(nr){var Dd="oninput"in document;if(!Dd){var F0=document.createElement("div");F0.setAttribute("oninput","return;"),Dd=typeof F0.oninput=="function"}Pd=Dd}else Pd=!1;aS=Pd&&(!document.documentMode||9<document.documentMode)}function O0(){Po&&(Po.detachEvent("onpropertychange",oS),Zo=Po=null)}function oS(t){if(t.propertyName==="value"&&Yu(Zo)){var e=[];sS(e,Zo,t,um(t)),zy(Pw,e)}}function Nw(t,e,n){t==="focusin"?(O0(),Po=e,Zo=n,Po.attachEvent("onpropertychange",oS)):t==="focusout"&&O0()}function Lw(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Yu(Zo)}function Iw(t,e){if(t==="click")return Yu(e)}function Uw(t,e){if(t==="input"||t==="change")return Yu(e)}function Fw(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var pi=typeof Object.is=="function"?Object.is:Fw;function Jo(t,e){if(pi(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!qf.call(e,r)||!pi(t[r],e[r]))return!1}return!0}function k0(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function B0(t,e){var n=k0(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=k0(n)}}function lS(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?lS(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function cS(){for(var t=window,e=iu();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=iu(t.document)}return e}function _m(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function Ow(t){var e=cS(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&lS(n.ownerDocument.documentElement,n)){if(i!==null&&_m(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=B0(n,s);var a=B0(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var kw=nr&&"documentMode"in document&&11>=document.documentMode,aa=null,mh=null,Do=null,gh=!1;function z0(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;gh||aa==null||aa!==iu(i)||(i=aa,"selectionStart"in i&&_m(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Do&&Jo(Do,i)||(Do=i,i=uu(mh,"onSelect"),0<i.length&&(e=new gm("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=aa)))}function jl(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var oa={animationend:jl("Animation","AnimationEnd"),animationiteration:jl("Animation","AnimationIteration"),animationstart:jl("Animation","AnimationStart"),transitionend:jl("Transition","TransitionEnd")},Nd={},uS={};nr&&(uS=document.createElement("div").style,"AnimationEvent"in window||(delete oa.animationend.animation,delete oa.animationiteration.animation,delete oa.animationstart.animation),"TransitionEvent"in window||delete oa.transitionend.transition);function Ku(t){if(Nd[t])return Nd[t];if(!oa[t])return t;var e=oa[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in uS)return Nd[t]=e[n];return t}var dS=Ku("animationend"),fS=Ku("animationiteration"),hS=Ku("animationstart"),pS=Ku("transitionend"),mS=new Map,V0="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Xr(t,e){mS.set(t,e),Ds(e,[t])}for(var Ld=0;Ld<V0.length;Ld++){var Id=V0[Ld],Bw=Id.toLowerCase(),zw=Id[0].toUpperCase()+Id.slice(1);Xr(Bw,"on"+zw)}Xr(dS,"onAnimationEnd");Xr(fS,"onAnimationIteration");Xr(hS,"onAnimationStart");Xr("dblclick","onDoubleClick");Xr("focusin","onFocus");Xr("focusout","onBlur");Xr(pS,"onTransitionEnd");Pa("onMouseEnter",["mouseout","mouseover"]);Pa("onMouseLeave",["mouseout","mouseover"]);Pa("onPointerEnter",["pointerout","pointerover"]);Pa("onPointerLeave",["pointerout","pointerover"]);Ds("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Ds("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Ds("onBeforeInput",["compositionend","keypress","textInput","paste"]);Ds("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Ds("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Ds("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var _o="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Vw=new Set("cancel close invalid load scroll toggle".split(" ").concat(_o));function G0(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,BT(i,e,void 0,t),t.currentTarget=null}function gS(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,c=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;G0(r,o,c),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,c=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;G0(r,o,c),s=l}}}if(su)throw t=dh,su=!1,dh=null,t}function yt(t,e){var n=e[Sh];n===void 0&&(n=e[Sh]=new Set);var i=t+"__bubble";n.has(i)||(vS(e,t,2,!1),n.add(i))}function Ud(t,e,n){var i=0;e&&(i|=4),vS(n,t,i,e)}var Wl="_reactListening"+Math.random().toString(36).slice(2);function Qo(t){if(!t[Wl]){t[Wl]=!0,Ty.forEach(function(n){n!=="selectionchange"&&(Vw.has(n)||Ud(n,!1,t),Ud(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Wl]||(e[Wl]=!0,Ud("selectionchange",!1,e))}}function vS(t,e,n,i){switch(eS(e)){case 1:var r=tw;break;case 4:r=nw;break;default:r=pm}n=r.bind(null,e,n,t),r=void 0,!uh||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Fd(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=hs(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}zy(function(){var c=s,u=um(n),f=[];e:{var d=mS.get(t);if(d!==void 0){var p=gm,v=t;switch(t){case"keypress":if(Bc(n)===0)break e;case"keydown":case"keyup":p=vw;break;case"focusin":v="focus",p=Rd;break;case"focusout":v="blur",p=Rd;break;case"beforeblur":case"afterblur":p=Rd;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=P0;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=sw;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=yw;break;case dS:case fS:case hS:p=lw;break;case pS:p=Mw;break;case"scroll":p=iw;break;case"wheel":p=Tw;break;case"copy":case"cut":case"paste":p=uw;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=N0}var y=(e&4)!==0,g=!y&&t==="scroll",h=y?d!==null?d+"Capture":null:d;y=[];for(var m=c,_;m!==null;){_=m;var M=_.stateNode;if(_.tag===5&&M!==null&&(_=M,h!==null&&(M=Xo(m,h),M!=null&&y.push(el(m,M,_)))),g)break;m=m.return}0<y.length&&(d=new p(d,v,null,n,u),f.push({event:d,listeners:y}))}}if(!(e&7)){e:{if(d=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",d&&n!==lh&&(v=n.relatedTarget||n.fromElement)&&(hs(v)||v[ir]))break e;if((p||d)&&(d=u.window===u?u:(d=u.ownerDocument)?d.defaultView||d.parentWindow:window,p?(v=n.relatedTarget||n.toElement,p=c,v=v?hs(v):null,v!==null&&(g=Ns(v),v!==g||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(y=P0,M="onMouseLeave",h="onMouseEnter",m="mouse",(t==="pointerout"||t==="pointerover")&&(y=N0,M="onPointerLeave",h="onPointerEnter",m="pointer"),g=p==null?d:la(p),_=v==null?d:la(v),d=new y(M,m+"leave",p,n,u),d.target=g,d.relatedTarget=_,M=null,hs(u)===c&&(y=new y(h,m+"enter",v,n,u),y.target=_,y.relatedTarget=g,M=y),g=M,p&&v)t:{for(y=p,h=v,m=0,_=y;_;_=Os(_))m++;for(_=0,M=h;M;M=Os(M))_++;for(;0<m-_;)y=Os(y),m--;for(;0<_-m;)h=Os(h),_--;for(;m--;){if(y===h||h!==null&&y===h.alternate)break t;y=Os(y),h=Os(h)}y=null}else y=null;p!==null&&H0(f,d,p,y,!1),v!==null&&g!==null&&H0(f,g,v,y,!0)}}e:{if(d=c?la(c):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var w=Dw;else if(U0(d))if(aS)w=Uw;else{w=Lw;var T=Nw}else(p=d.nodeName)&&p.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(w=Iw);if(w&&(w=w(t,c))){sS(f,w,n,u);break e}T&&T(t,d,c),t==="focusout"&&(T=d._wrapperState)&&T.controlled&&d.type==="number"&&ih(d,"number",d.value)}switch(T=c?la(c):window,t){case"focusin":(U0(T)||T.contentEditable==="true")&&(aa=T,mh=c,Do=null);break;case"focusout":Do=mh=aa=null;break;case"mousedown":gh=!0;break;case"contextmenu":case"mouseup":case"dragend":gh=!1,z0(f,n,u);break;case"selectionchange":if(kw)break;case"keydown":case"keyup":z0(f,n,u)}var R;if(xm)e:{switch(t){case"compositionstart":var S="onCompositionStart";break e;case"compositionend":S="onCompositionEnd";break e;case"compositionupdate":S="onCompositionUpdate";break e}S=void 0}else sa?iS(t,n)&&(S="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(S="onCompositionStart");S&&(nS&&n.locale!=="ko"&&(sa||S!=="onCompositionStart"?S==="onCompositionEnd"&&sa&&(R=tS()):(Ar=u,mm="value"in Ar?Ar.value:Ar.textContent,sa=!0)),T=uu(c,S),0<T.length&&(S=new D0(S,t,null,n,u),f.push({event:S,listeners:T}),R?S.data=R:(R=rS(n),R!==null&&(S.data=R)))),(R=bw?Aw(t,n):Cw(t,n))&&(c=uu(c,"onBeforeInput"),0<c.length&&(u=new D0("onBeforeInput","beforeinput",null,n,u),f.push({event:u,listeners:c}),u.data=R))}gS(f,e)})}function el(t,e,n){return{instance:t,listener:e,currentTarget:n}}function uu(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Xo(t,n),s!=null&&i.unshift(el(t,s,r)),s=Xo(t,e),s!=null&&i.push(el(t,s,r))),t=t.return}return i}function Os(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function H0(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,c=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&c!==null&&(o=c,r?(l=Xo(n,s),l!=null&&a.unshift(el(n,l,o))):r||(l=Xo(n,s),l!=null&&a.push(el(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var Gw=/\r\n?/g,Hw=/\u0000|\uFFFD/g;function j0(t){return(typeof t=="string"?t:""+t).replace(Gw,`
`).replace(Hw,"")}function $l(t,e,n){if(e=j0(e),j0(t)!==e&&n)throw Error(ce(425))}function du(){}var vh=null,xh=null;function _h(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var yh=typeof setTimeout=="function"?setTimeout:void 0,jw=typeof clearTimeout=="function"?clearTimeout:void 0,W0=typeof Promise=="function"?Promise:void 0,Ww=typeof queueMicrotask=="function"?queueMicrotask:typeof W0<"u"?function(t){return W0.resolve(null).then(t).catch($w)}:yh;function $w(t){setTimeout(function(){throw t})}function Od(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),qo(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);qo(e)}function Ir(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function $0(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var $a=Math.random().toString(36).slice(2),Ti="__reactFiber$"+$a,tl="__reactProps$"+$a,ir="__reactContainer$"+$a,Sh="__reactEvents$"+$a,Xw="__reactListeners$"+$a,Yw="__reactHandles$"+$a;function hs(t){var e=t[Ti];if(e)return e;for(var n=t.parentNode;n;){if(e=n[ir]||n[Ti]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=$0(t);t!==null;){if(n=t[Ti])return n;t=$0(t)}return e}t=n,n=t.parentNode}return null}function Sl(t){return t=t[Ti]||t[ir],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function la(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(ce(33))}function qu(t){return t[tl]||null}var Mh=[],ca=-1;function Yr(t){return{current:t}}function St(t){0>ca||(t.current=Mh[ca],Mh[ca]=null,ca--)}function _t(t,e){ca++,Mh[ca]=t.current,t.current=e}var Vr={},pn=Yr(Vr),Tn=Yr(!1),Ts=Vr;function Da(t,e){var n=t.type.contextTypes;if(!n)return Vr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function wn(t){return t=t.childContextTypes,t!=null}function fu(){St(Tn),St(pn)}function X0(t,e,n){if(pn.current!==Vr)throw Error(ce(168));_t(pn,e),_t(Tn,n)}function xS(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(ce(108,NT(t)||"Unknown",r));return At({},n,i)}function hu(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Vr,Ts=pn.current,_t(pn,t),_t(Tn,Tn.current),!0}function Y0(t,e,n){var i=t.stateNode;if(!i)throw Error(ce(169));n?(t=xS(t,e,Ts),i.__reactInternalMemoizedMergedChildContext=t,St(Tn),St(pn),_t(pn,t)):St(Tn),_t(Tn,n)}var Wi=null,Zu=!1,kd=!1;function _S(t){Wi===null?Wi=[t]:Wi.push(t)}function Kw(t){Zu=!0,_S(t)}function Kr(){if(!kd&&Wi!==null){kd=!0;var t=0,e=dt;try{var n=Wi;for(dt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Wi=null,Zu=!1}catch(r){throw Wi!==null&&(Wi=Wi.slice(t+1)),jy(dm,Kr),r}finally{dt=e,kd=!1}}return null}var ua=[],da=0,pu=null,mu=0,$n=[],Xn=0,ws=null,$i=1,Xi="";function rs(t,e){ua[da++]=mu,ua[da++]=pu,pu=t,mu=e}function yS(t,e,n){$n[Xn++]=$i,$n[Xn++]=Xi,$n[Xn++]=ws,ws=t;var i=$i;t=Xi;var r=32-di(i)-1;i&=~(1<<r),n+=1;var s=32-di(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,$i=1<<32-di(e)+r|n<<r|i,Xi=s+t}else $i=1<<s|n<<r|i,Xi=t}function ym(t){t.return!==null&&(rs(t,1),yS(t,1,0))}function Sm(t){for(;t===pu;)pu=ua[--da],ua[da]=null,mu=ua[--da],ua[da]=null;for(;t===ws;)ws=$n[--Xn],$n[Xn]=null,Xi=$n[--Xn],$n[Xn]=null,$i=$n[--Xn],$n[Xn]=null}var Un=null,In=null,Et=!1,li=null;function SS(t,e){var n=qn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function K0(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Un=t,In=Ir(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Un=t,In=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=ws!==null?{id:$i,overflow:Xi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=qn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Un=t,In=null,!0):!1;default:return!1}}function Eh(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Th(t){if(Et){var e=In;if(e){var n=e;if(!K0(t,e)){if(Eh(t))throw Error(ce(418));e=Ir(n.nextSibling);var i=Un;e&&K0(t,e)?SS(i,n):(t.flags=t.flags&-4097|2,Et=!1,Un=t)}}else{if(Eh(t))throw Error(ce(418));t.flags=t.flags&-4097|2,Et=!1,Un=t}}}function q0(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Un=t}function Xl(t){if(t!==Un)return!1;if(!Et)return q0(t),Et=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!_h(t.type,t.memoizedProps)),e&&(e=In)){if(Eh(t))throw MS(),Error(ce(418));for(;e;)SS(t,e),e=Ir(e.nextSibling)}if(q0(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(ce(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){In=Ir(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}In=null}}else In=Un?Ir(t.stateNode.nextSibling):null;return!0}function MS(){for(var t=In;t;)t=Ir(t.nextSibling)}function Na(){In=Un=null,Et=!1}function Mm(t){li===null?li=[t]:li.push(t)}var qw=cr.ReactCurrentBatchConfig;function io(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(ce(309));var i=n.stateNode}if(!i)throw Error(ce(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(ce(284));if(!n._owner)throw Error(ce(290,t))}return t}function Yl(t,e){throw t=Object.prototype.toString.call(e),Error(ce(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function Z0(t){var e=t._init;return e(t._payload)}function ES(t){function e(h,m){if(t){var _=h.deletions;_===null?(h.deletions=[m],h.flags|=16):_.push(m)}}function n(h,m){if(!t)return null;for(;m!==null;)e(h,m),m=m.sibling;return null}function i(h,m){for(h=new Map;m!==null;)m.key!==null?h.set(m.key,m):h.set(m.index,m),m=m.sibling;return h}function r(h,m){return h=kr(h,m),h.index=0,h.sibling=null,h}function s(h,m,_){return h.index=_,t?(_=h.alternate,_!==null?(_=_.index,_<m?(h.flags|=2,m):_):(h.flags|=2,m)):(h.flags|=1048576,m)}function a(h){return t&&h.alternate===null&&(h.flags|=2),h}function o(h,m,_,M){return m===null||m.tag!==6?(m=Wd(_,h.mode,M),m.return=h,m):(m=r(m,_),m.return=h,m)}function l(h,m,_,M){var w=_.type;return w===ra?u(h,m,_.props.children,M,_.key):m!==null&&(m.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Mr&&Z0(w)===m.type)?(M=r(m,_.props),M.ref=io(h,m,_),M.return=h,M):(M=$c(_.type,_.key,_.props,null,h.mode,M),M.ref=io(h,m,_),M.return=h,M)}function c(h,m,_,M){return m===null||m.tag!==4||m.stateNode.containerInfo!==_.containerInfo||m.stateNode.implementation!==_.implementation?(m=$d(_,h.mode,M),m.return=h,m):(m=r(m,_.children||[]),m.return=h,m)}function u(h,m,_,M,w){return m===null||m.tag!==7?(m=ys(_,h.mode,M,w),m.return=h,m):(m=r(m,_),m.return=h,m)}function f(h,m,_){if(typeof m=="string"&&m!==""||typeof m=="number")return m=Wd(""+m,h.mode,_),m.return=h,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Ol:return _=$c(m.type,m.key,m.props,null,h.mode,_),_.ref=io(h,null,m),_.return=h,_;case ia:return m=$d(m,h.mode,_),m.return=h,m;case Mr:var M=m._init;return f(h,M(m._payload),_)}if(vo(m)||Ja(m))return m=ys(m,h.mode,_,null),m.return=h,m;Yl(h,m)}return null}function d(h,m,_,M){var w=m!==null?m.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return w!==null?null:o(h,m,""+_,M);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Ol:return _.key===w?l(h,m,_,M):null;case ia:return _.key===w?c(h,m,_,M):null;case Mr:return w=_._init,d(h,m,w(_._payload),M)}if(vo(_)||Ja(_))return w!==null?null:u(h,m,_,M,null);Yl(h,_)}return null}function p(h,m,_,M,w){if(typeof M=="string"&&M!==""||typeof M=="number")return h=h.get(_)||null,o(m,h,""+M,w);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case Ol:return h=h.get(M.key===null?_:M.key)||null,l(m,h,M,w);case ia:return h=h.get(M.key===null?_:M.key)||null,c(m,h,M,w);case Mr:var T=M._init;return p(h,m,_,T(M._payload),w)}if(vo(M)||Ja(M))return h=h.get(_)||null,u(m,h,M,w,null);Yl(m,M)}return null}function v(h,m,_,M){for(var w=null,T=null,R=m,S=m=0,A=null;R!==null&&S<_.length;S++){R.index>S?(A=R,R=null):A=R.sibling;var N=d(h,R,_[S],M);if(N===null){R===null&&(R=A);break}t&&R&&N.alternate===null&&e(h,R),m=s(N,m,S),T===null?w=N:T.sibling=N,T=N,R=A}if(S===_.length)return n(h,R),Et&&rs(h,S),w;if(R===null){for(;S<_.length;S++)R=f(h,_[S],M),R!==null&&(m=s(R,m,S),T===null?w=R:T.sibling=R,T=R);return Et&&rs(h,S),w}for(R=i(h,R);S<_.length;S++)A=p(R,h,S,_[S],M),A!==null&&(t&&A.alternate!==null&&R.delete(A.key===null?S:A.key),m=s(A,m,S),T===null?w=A:T.sibling=A,T=A);return t&&R.forEach(function(D){return e(h,D)}),Et&&rs(h,S),w}function y(h,m,_,M){var w=Ja(_);if(typeof w!="function")throw Error(ce(150));if(_=w.call(_),_==null)throw Error(ce(151));for(var T=w=null,R=m,S=m=0,A=null,N=_.next();R!==null&&!N.done;S++,N=_.next()){R.index>S?(A=R,R=null):A=R.sibling;var D=d(h,R,N.value,M);if(D===null){R===null&&(R=A);break}t&&R&&D.alternate===null&&e(h,R),m=s(D,m,S),T===null?w=D:T.sibling=D,T=D,R=A}if(N.done)return n(h,R),Et&&rs(h,S),w;if(R===null){for(;!N.done;S++,N=_.next())N=f(h,N.value,M),N!==null&&(m=s(N,m,S),T===null?w=N:T.sibling=N,T=N);return Et&&rs(h,S),w}for(R=i(h,R);!N.done;S++,N=_.next())N=p(R,h,S,N.value,M),N!==null&&(t&&N.alternate!==null&&R.delete(N.key===null?S:N.key),m=s(N,m,S),T===null?w=N:T.sibling=N,T=N);return t&&R.forEach(function(I){return e(h,I)}),Et&&rs(h,S),w}function g(h,m,_,M){if(typeof _=="object"&&_!==null&&_.type===ra&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case Ol:e:{for(var w=_.key,T=m;T!==null;){if(T.key===w){if(w=_.type,w===ra){if(T.tag===7){n(h,T.sibling),m=r(T,_.props.children),m.return=h,h=m;break e}}else if(T.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===Mr&&Z0(w)===T.type){n(h,T.sibling),m=r(T,_.props),m.ref=io(h,T,_),m.return=h,h=m;break e}n(h,T);break}else e(h,T);T=T.sibling}_.type===ra?(m=ys(_.props.children,h.mode,M,_.key),m.return=h,h=m):(M=$c(_.type,_.key,_.props,null,h.mode,M),M.ref=io(h,m,_),M.return=h,h=M)}return a(h);case ia:e:{for(T=_.key;m!==null;){if(m.key===T)if(m.tag===4&&m.stateNode.containerInfo===_.containerInfo&&m.stateNode.implementation===_.implementation){n(h,m.sibling),m=r(m,_.children||[]),m.return=h,h=m;break e}else{n(h,m);break}else e(h,m);m=m.sibling}m=$d(_,h.mode,M),m.return=h,h=m}return a(h);case Mr:return T=_._init,g(h,m,T(_._payload),M)}if(vo(_))return v(h,m,_,M);if(Ja(_))return y(h,m,_,M);Yl(h,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,m!==null&&m.tag===6?(n(h,m.sibling),m=r(m,_),m.return=h,h=m):(n(h,m),m=Wd(_,h.mode,M),m.return=h,h=m),a(h)):n(h,m)}return g}var La=ES(!0),TS=ES(!1),gu=Yr(null),vu=null,fa=null,Em=null;function Tm(){Em=fa=vu=null}function wm(t){var e=gu.current;St(gu),t._currentValue=e}function wh(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ta(t,e){vu=t,Em=fa=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(En=!0),t.firstContext=null)}function Jn(t){var e=t._currentValue;if(Em!==t)if(t={context:t,memoizedValue:e,next:null},fa===null){if(vu===null)throw Error(ce(308));fa=t,vu.dependencies={lanes:0,firstContext:t}}else fa=fa.next=t;return e}var ps=null;function bm(t){ps===null?ps=[t]:ps.push(t)}function wS(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,bm(e)):(n.next=r.next,r.next=n),e.interleaved=n,rr(t,i)}function rr(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var Er=!1;function Am(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function bS(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Ki(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Ur(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,rt&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,rr(t,n)}return r=i.interleaved,r===null?(e.next=e,bm(i)):(e.next=r.next,r.next=e),i.interleaved=e,rr(t,n)}function zc(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,fm(t,n)}}function J0(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function xu(t,e,n,i){var r=t.updateQueue;Er=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,c=l.next;l.next=null,a===null?s=c:a.next=c,a=l;var u=t.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==a&&(o===null?u.firstBaseUpdate=c:o.next=c,u.lastBaseUpdate=l))}if(s!==null){var f=r.baseState;a=0,u=c=l=null,o=s;do{var d=o.lane,p=o.eventTime;if((i&d)===d){u!==null&&(u=u.next={eventTime:p,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var v=t,y=o;switch(d=e,p=n,y.tag){case 1:if(v=y.payload,typeof v=="function"){f=v.call(p,f,d);break e}f=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=y.payload,d=typeof v=="function"?v.call(p,f,d):v,d==null)break e;f=At({},f,d);break e;case 2:Er=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,d=r.effects,d===null?r.effects=[o]:d.push(o))}else p={eventTime:p,lane:d,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(c=u=p,l=f):u=u.next=p,a|=d;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;d=o,o=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(u===null&&(l=f),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);As|=a,t.lanes=a,t.memoizedState=f}}function Q0(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(ce(191,r));r.call(i)}}}var Ml={},Di=Yr(Ml),nl=Yr(Ml),il=Yr(Ml);function ms(t){if(t===Ml)throw Error(ce(174));return t}function Cm(t,e){switch(_t(il,e),_t(nl,t),_t(Di,Ml),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:sh(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=sh(e,t)}St(Di),_t(Di,e)}function Ia(){St(Di),St(nl),St(il)}function AS(t){ms(il.current);var e=ms(Di.current),n=sh(e,t.type);e!==n&&(_t(nl,t),_t(Di,n))}function Rm(t){nl.current===t&&(St(Di),St(nl))}var Tt=Yr(0);function _u(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Bd=[];function Pm(){for(var t=0;t<Bd.length;t++)Bd[t]._workInProgressVersionPrimary=null;Bd.length=0}var Vc=cr.ReactCurrentDispatcher,zd=cr.ReactCurrentBatchConfig,bs=0,bt=null,zt=null,$t=null,yu=!1,No=!1,rl=0,Zw=0;function rn(){throw Error(ce(321))}function Dm(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!pi(t[n],e[n]))return!1;return!0}function Nm(t,e,n,i,r,s){if(bs=s,bt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Vc.current=t===null||t.memoizedState===null?tb:nb,t=n(i,r),No){s=0;do{if(No=!1,rl=0,25<=s)throw Error(ce(301));s+=1,$t=zt=null,e.updateQueue=null,Vc.current=ib,t=n(i,r)}while(No)}if(Vc.current=Su,e=zt!==null&&zt.next!==null,bs=0,$t=zt=bt=null,yu=!1,e)throw Error(ce(300));return t}function Lm(){var t=rl!==0;return rl=0,t}function Ei(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return $t===null?bt.memoizedState=$t=t:$t=$t.next=t,$t}function Qn(){if(zt===null){var t=bt.alternate;t=t!==null?t.memoizedState:null}else t=zt.next;var e=$t===null?bt.memoizedState:$t.next;if(e!==null)$t=e,zt=t;else{if(t===null)throw Error(ce(310));zt=t,t={memoizedState:zt.memoizedState,baseState:zt.baseState,baseQueue:zt.baseQueue,queue:zt.queue,next:null},$t===null?bt.memoizedState=$t=t:$t=$t.next=t}return $t}function sl(t,e){return typeof e=="function"?e(t):e}function Vd(t){var e=Qn(),n=e.queue;if(n===null)throw Error(ce(311));n.lastRenderedReducer=t;var i=zt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,c=s;do{var u=c.lane;if((bs&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var f={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(o=l=f,a=i):l=l.next=f,bt.lanes|=u,As|=u}c=c.next}while(c!==null&&c!==s);l===null?a=i:l.next=o,pi(i,e.memoizedState)||(En=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,bt.lanes|=s,As|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Gd(t){var e=Qn(),n=e.queue;if(n===null)throw Error(ce(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);pi(s,e.memoizedState)||(En=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function CS(){}function RS(t,e){var n=bt,i=Qn(),r=e(),s=!pi(i.memoizedState,r);if(s&&(i.memoizedState=r,En=!0),i=i.queue,Im(NS.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||$t!==null&&$t.memoizedState.tag&1){if(n.flags|=2048,al(9,DS.bind(null,n,i,r,e),void 0,null),Xt===null)throw Error(ce(349));bs&30||PS(n,e,r)}return r}function PS(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=bt.updateQueue,e===null?(e={lastEffect:null,stores:null},bt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function DS(t,e,n,i){e.value=n,e.getSnapshot=i,LS(e)&&IS(t)}function NS(t,e,n){return n(function(){LS(e)&&IS(t)})}function LS(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!pi(t,n)}catch{return!0}}function IS(t){var e=rr(t,1);e!==null&&fi(e,t,1,-1)}function ev(t){var e=Ei();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:sl,lastRenderedState:t},e.queue=t,t=t.dispatch=eb.bind(null,bt,t),[e.memoizedState,t]}function al(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=bt.updateQueue,e===null?(e={lastEffect:null,stores:null},bt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function US(){return Qn().memoizedState}function Gc(t,e,n,i){var r=Ei();bt.flags|=t,r.memoizedState=al(1|e,n,void 0,i===void 0?null:i)}function Ju(t,e,n,i){var r=Qn();i=i===void 0?null:i;var s=void 0;if(zt!==null){var a=zt.memoizedState;if(s=a.destroy,i!==null&&Dm(i,a.deps)){r.memoizedState=al(e,n,s,i);return}}bt.flags|=t,r.memoizedState=al(1|e,n,s,i)}function tv(t,e){return Gc(8390656,8,t,e)}function Im(t,e){return Ju(2048,8,t,e)}function FS(t,e){return Ju(4,2,t,e)}function OS(t,e){return Ju(4,4,t,e)}function kS(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function BS(t,e,n){return n=n!=null?n.concat([t]):null,Ju(4,4,kS.bind(null,e,t),n)}function Um(){}function zS(t,e){var n=Qn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Dm(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function VS(t,e){var n=Qn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Dm(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function GS(t,e,n){return bs&21?(pi(n,e)||(n=Xy(),bt.lanes|=n,As|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,En=!0),t.memoizedState=n)}function Jw(t,e){var n=dt;dt=n!==0&&4>n?n:4,t(!0);var i=zd.transition;zd.transition={};try{t(!1),e()}finally{dt=n,zd.transition=i}}function HS(){return Qn().memoizedState}function Qw(t,e,n){var i=Or(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},jS(t))WS(e,n);else if(n=wS(t,e,n,i),n!==null){var r=xn();fi(n,t,i,r),$S(n,e,i)}}function eb(t,e,n){var i=Or(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(jS(t))WS(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,pi(o,a)){var l=e.interleaved;l===null?(r.next=r,bm(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=wS(t,e,r,i),n!==null&&(r=xn(),fi(n,t,i,r),$S(n,e,i))}}function jS(t){var e=t.alternate;return t===bt||e!==null&&e===bt}function WS(t,e){No=yu=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function $S(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,fm(t,n)}}var Su={readContext:Jn,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useInsertionEffect:rn,useLayoutEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useMutableSource:rn,useSyncExternalStore:rn,useId:rn,unstable_isNewReconciler:!1},tb={readContext:Jn,useCallback:function(t,e){return Ei().memoizedState=[t,e===void 0?null:e],t},useContext:Jn,useEffect:tv,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Gc(4194308,4,kS.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Gc(4194308,4,t,e)},useInsertionEffect:function(t,e){return Gc(4,2,t,e)},useMemo:function(t,e){var n=Ei();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Ei();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Qw.bind(null,bt,t),[i.memoizedState,t]},useRef:function(t){var e=Ei();return t={current:t},e.memoizedState=t},useState:ev,useDebugValue:Um,useDeferredValue:function(t){return Ei().memoizedState=t},useTransition:function(){var t=ev(!1),e=t[0];return t=Jw.bind(null,t[1]),Ei().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=bt,r=Ei();if(Et){if(n===void 0)throw Error(ce(407));n=n()}else{if(n=e(),Xt===null)throw Error(ce(349));bs&30||PS(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,tv(NS.bind(null,i,s,t),[t]),i.flags|=2048,al(9,DS.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Ei(),e=Xt.identifierPrefix;if(Et){var n=Xi,i=$i;n=(i&~(1<<32-di(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=rl++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Zw++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},nb={readContext:Jn,useCallback:zS,useContext:Jn,useEffect:Im,useImperativeHandle:BS,useInsertionEffect:FS,useLayoutEffect:OS,useMemo:VS,useReducer:Vd,useRef:US,useState:function(){return Vd(sl)},useDebugValue:Um,useDeferredValue:function(t){var e=Qn();return GS(e,zt.memoizedState,t)},useTransition:function(){var t=Vd(sl)[0],e=Qn().memoizedState;return[t,e]},useMutableSource:CS,useSyncExternalStore:RS,useId:HS,unstable_isNewReconciler:!1},ib={readContext:Jn,useCallback:zS,useContext:Jn,useEffect:Im,useImperativeHandle:BS,useInsertionEffect:FS,useLayoutEffect:OS,useMemo:VS,useReducer:Gd,useRef:US,useState:function(){return Gd(sl)},useDebugValue:Um,useDeferredValue:function(t){var e=Qn();return zt===null?e.memoizedState=t:GS(e,zt.memoizedState,t)},useTransition:function(){var t=Gd(sl)[0],e=Qn().memoizedState;return[t,e]},useMutableSource:CS,useSyncExternalStore:RS,useId:HS,unstable_isNewReconciler:!1};function ai(t,e){if(t&&t.defaultProps){e=At({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function bh(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:At({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Qu={isMounted:function(t){return(t=t._reactInternals)?Ns(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=xn(),r=Or(t),s=Ki(i,r);s.payload=e,n!=null&&(s.callback=n),e=Ur(t,s,r),e!==null&&(fi(e,t,r,i),zc(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=xn(),r=Or(t),s=Ki(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Ur(t,s,r),e!==null&&(fi(e,t,r,i),zc(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=xn(),i=Or(t),r=Ki(n,i);r.tag=2,e!=null&&(r.callback=e),e=Ur(t,r,i),e!==null&&(fi(e,t,i,n),zc(e,t,i))}};function nv(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Jo(n,i)||!Jo(r,s):!0}function XS(t,e,n){var i=!1,r=Vr,s=e.contextType;return typeof s=="object"&&s!==null?s=Jn(s):(r=wn(e)?Ts:pn.current,i=e.contextTypes,s=(i=i!=null)?Da(t,r):Vr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Qu,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function iv(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Qu.enqueueReplaceState(e,e.state,null)}function Ah(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Am(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Jn(s):(s=wn(e)?Ts:pn.current,r.context=Da(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(bh(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Qu.enqueueReplaceState(r,r.state,null),xu(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Ua(t,e){try{var n="",i=e;do n+=DT(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Hd(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function Ch(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var rb=typeof WeakMap=="function"?WeakMap:Map;function YS(t,e,n){n=Ki(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Eu||(Eu=!0,kh=i),Ch(t,e)},n}function KS(t,e,n){n=Ki(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){Ch(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){Ch(t,e),typeof i!="function"&&(Fr===null?Fr=new Set([this]):Fr.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function rv(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new rb;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=xb.bind(null,t,e,n),e.then(t,t))}function sv(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function av(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Ki(-1,1),e.tag=2,Ur(n,e,1))),n.lanes|=1),t)}var sb=cr.ReactCurrentOwner,En=!1;function vn(t,e,n,i){e.child=t===null?TS(e,null,n,i):La(e,t.child,n,i)}function ov(t,e,n,i,r){n=n.render;var s=e.ref;return Ta(e,r),i=Nm(t,e,n,i,s,r),n=Lm(),t!==null&&!En?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,sr(t,e,r)):(Et&&n&&ym(e),e.flags|=1,vn(t,e,i,r),e.child)}function lv(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Hm(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,qS(t,e,s,i,r)):(t=$c(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Jo,n(a,i)&&t.ref===e.ref)return sr(t,e,r)}return e.flags|=1,t=kr(s,i),t.ref=e.ref,t.return=e,e.child=t}function qS(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Jo(s,i)&&t.ref===e.ref)if(En=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(En=!0);else return e.lanes=t.lanes,sr(t,e,r)}return Rh(t,e,n,i,r)}function ZS(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},_t(pa,Nn),Nn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,_t(pa,Nn),Nn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,_t(pa,Nn),Nn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,_t(pa,Nn),Nn|=i;return vn(t,e,r,n),e.child}function JS(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function Rh(t,e,n,i,r){var s=wn(n)?Ts:pn.current;return s=Da(e,s),Ta(e,r),n=Nm(t,e,n,i,s,r),i=Lm(),t!==null&&!En?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,sr(t,e,r)):(Et&&i&&ym(e),e.flags|=1,vn(t,e,n,r),e.child)}function cv(t,e,n,i,r){if(wn(n)){var s=!0;hu(e)}else s=!1;if(Ta(e,r),e.stateNode===null)Hc(t,e),XS(e,n,i),Ah(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,c=n.contextType;typeof c=="object"&&c!==null?c=Jn(c):(c=wn(n)?Ts:pn.current,c=Da(e,c));var u=n.getDerivedStateFromProps,f=typeof u=="function"||typeof a.getSnapshotBeforeUpdate=="function";f||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==c)&&iv(e,a,i,c),Er=!1;var d=e.memoizedState;a.state=d,xu(e,i,a,r),l=e.memoizedState,o!==i||d!==l||Tn.current||Er?(typeof u=="function"&&(bh(e,n,u,i),l=e.memoizedState),(o=Er||nv(e,n,o,i,d,l,c))?(f||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=c,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,bS(t,e),o=e.memoizedProps,c=e.type===e.elementType?o:ai(e.type,o),a.props=c,f=e.pendingProps,d=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Jn(l):(l=wn(n)?Ts:pn.current,l=Da(e,l));var p=n.getDerivedStateFromProps;(u=typeof p=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==f||d!==l)&&iv(e,a,i,l),Er=!1,d=e.memoizedState,a.state=d,xu(e,i,a,r);var v=e.memoizedState;o!==f||d!==v||Tn.current||Er?(typeof p=="function"&&(bh(e,n,p,i),v=e.memoizedState),(c=Er||nv(e,n,c,i,d,v,l)||!1)?(u||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,v,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,v,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),a.props=i,a.state=v,a.context=l,i=c):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),i=!1)}return Ph(t,e,n,i,s,r)}function Ph(t,e,n,i,r,s){JS(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&Y0(e,n,!1),sr(t,e,s);i=e.stateNode,sb.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=La(e,t.child,null,s),e.child=La(e,null,o,s)):vn(t,e,o,s),e.memoizedState=i.state,r&&Y0(e,n,!0),e.child}function QS(t){var e=t.stateNode;e.pendingContext?X0(t,e.pendingContext,e.pendingContext!==e.context):e.context&&X0(t,e.context,!1),Cm(t,e.containerInfo)}function uv(t,e,n,i,r){return Na(),Mm(r),e.flags|=256,vn(t,e,n,i),e.child}var Dh={dehydrated:null,treeContext:null,retryLane:0};function Nh(t){return{baseLanes:t,cachePool:null,transitions:null}}function eM(t,e,n){var i=e.pendingProps,r=Tt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),_t(Tt,r&1),t===null)return Th(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=nd(a,i,0,null),t=ys(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Nh(n),e.memoizedState=Dh,t):Fm(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return ab(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=kr(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=kr(o,s):(s=ys(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?Nh(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=Dh,i}return s=t.child,t=s.sibling,i=kr(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Fm(t,e){return e=nd({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Kl(t,e,n,i){return i!==null&&Mm(i),La(e,t.child,null,n),t=Fm(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function ab(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Hd(Error(ce(422))),Kl(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=nd({mode:"visible",children:i.children},r,0,null),s=ys(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&La(e,t.child,null,a),e.child.memoizedState=Nh(a),e.memoizedState=Dh,s);if(!(e.mode&1))return Kl(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(ce(419)),i=Hd(s,i,void 0),Kl(t,e,a,i)}if(o=(a&t.childLanes)!==0,En||o){if(i=Xt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,rr(t,r),fi(i,t,r,-1))}return Gm(),i=Hd(Error(ce(421))),Kl(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=_b.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,In=Ir(r.nextSibling),Un=e,Et=!0,li=null,t!==null&&($n[Xn++]=$i,$n[Xn++]=Xi,$n[Xn++]=ws,$i=t.id,Xi=t.overflow,ws=e),e=Fm(e,i.children),e.flags|=4096,e)}function dv(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),wh(t.return,e,n)}function jd(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function tM(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(vn(t,e,i.children,n),i=Tt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&dv(t,n,e);else if(t.tag===19)dv(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(_t(Tt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&_u(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),jd(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&_u(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}jd(e,!0,n,null,s);break;case"together":jd(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Hc(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function sr(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),As|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(ce(153));if(e.child!==null){for(t=e.child,n=kr(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=kr(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function ob(t,e,n){switch(e.tag){case 3:QS(e),Na();break;case 5:AS(e);break;case 1:wn(e.type)&&hu(e);break;case 4:Cm(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;_t(gu,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(_t(Tt,Tt.current&1),e.flags|=128,null):n&e.child.childLanes?eM(t,e,n):(_t(Tt,Tt.current&1),t=sr(t,e,n),t!==null?t.sibling:null);_t(Tt,Tt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return tM(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),_t(Tt,Tt.current),i)break;return null;case 22:case 23:return e.lanes=0,ZS(t,e,n)}return sr(t,e,n)}var nM,Lh,iM,rM;nM=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Lh=function(){};iM=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,ms(Di.current);var s=null;switch(n){case"input":r=th(t,r),i=th(t,i),s=[];break;case"select":r=At({},r,{value:void 0}),i=At({},i,{value:void 0}),s=[];break;case"textarea":r=rh(t,r),i=rh(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=du)}ah(n,i);var a;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var o=r[c];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Wo.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(o=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==o&&(l!=null||o!=null))if(c==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Wo.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&yt("scroll",t),s||o===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};rM=function(t,e,n,i){n!==i&&(e.flags|=4)};function ro(t,e){if(!Et)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function sn(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function lb(t,e,n){var i=e.pendingProps;switch(Sm(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return sn(e),null;case 1:return wn(e.type)&&fu(),sn(e),null;case 3:return i=e.stateNode,Ia(),St(Tn),St(pn),Pm(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Xl(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,li!==null&&(Vh(li),li=null))),Lh(t,e),sn(e),null;case 5:Rm(e);var r=ms(il.current);if(n=e.type,t!==null&&e.stateNode!=null)iM(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(ce(166));return sn(e),null}if(t=ms(Di.current),Xl(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Ti]=e,i[tl]=s,t=(e.mode&1)!==0,n){case"dialog":yt("cancel",i),yt("close",i);break;case"iframe":case"object":case"embed":yt("load",i);break;case"video":case"audio":for(r=0;r<_o.length;r++)yt(_o[r],i);break;case"source":yt("error",i);break;case"img":case"image":case"link":yt("error",i),yt("load",i);break;case"details":yt("toggle",i);break;case"input":y0(i,s),yt("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},yt("invalid",i);break;case"textarea":M0(i,s),yt("invalid",i)}ah(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&$l(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&$l(i.textContent,o,t),r=["children",""+o]):Wo.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&yt("scroll",i)}switch(n){case"input":kl(i),S0(i,s,!0);break;case"textarea":kl(i),E0(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=du)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=Ny(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[Ti]=e,t[tl]=i,nM(t,e,!1,!1),e.stateNode=t;e:{switch(a=oh(n,i),n){case"dialog":yt("cancel",t),yt("close",t),r=i;break;case"iframe":case"object":case"embed":yt("load",t),r=i;break;case"video":case"audio":for(r=0;r<_o.length;r++)yt(_o[r],t);r=i;break;case"source":yt("error",t),r=i;break;case"img":case"image":case"link":yt("error",t),yt("load",t),r=i;break;case"details":yt("toggle",t),r=i;break;case"input":y0(t,i),r=th(t,i),yt("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=At({},i,{value:void 0}),yt("invalid",t);break;case"textarea":M0(t,i),r=rh(t,i),yt("invalid",t);break;default:r=i}ah(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?Uy(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Ly(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&$o(t,l):typeof l=="number"&&$o(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Wo.hasOwnProperty(s)?l!=null&&s==="onScroll"&&yt("scroll",t):l!=null&&am(t,s,l,a))}switch(n){case"input":kl(t),S0(t,i,!1);break;case"textarea":kl(t),E0(t);break;case"option":i.value!=null&&t.setAttribute("value",""+zr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?ya(t,!!i.multiple,s,!1):i.defaultValue!=null&&ya(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=du)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return sn(e),null;case 6:if(t&&e.stateNode!=null)rM(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(ce(166));if(n=ms(il.current),ms(Di.current),Xl(e)){if(i=e.stateNode,n=e.memoizedProps,i[Ti]=e,(s=i.nodeValue!==n)&&(t=Un,t!==null))switch(t.tag){case 3:$l(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&$l(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Ti]=e,e.stateNode=i}return sn(e),null;case 13:if(St(Tt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Et&&In!==null&&e.mode&1&&!(e.flags&128))MS(),Na(),e.flags|=98560,s=!1;else if(s=Xl(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(ce(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(ce(317));s[Ti]=e}else Na(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;sn(e),s=!1}else li!==null&&(Vh(li),li=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||Tt.current&1?Vt===0&&(Vt=3):Gm())),e.updateQueue!==null&&(e.flags|=4),sn(e),null);case 4:return Ia(),Lh(t,e),t===null&&Qo(e.stateNode.containerInfo),sn(e),null;case 10:return wm(e.type._context),sn(e),null;case 17:return wn(e.type)&&fu(),sn(e),null;case 19:if(St(Tt),s=e.memoizedState,s===null)return sn(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)ro(s,!1);else{if(Vt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=_u(t),a!==null){for(e.flags|=128,ro(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return _t(Tt,Tt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Ot()>Fa&&(e.flags|=128,i=!0,ro(s,!1),e.lanes=4194304)}else{if(!i)if(t=_u(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ro(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!Et)return sn(e),null}else 2*Ot()-s.renderingStartTime>Fa&&n!==1073741824&&(e.flags|=128,i=!0,ro(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Ot(),e.sibling=null,n=Tt.current,_t(Tt,i?n&1|2:n&1),e):(sn(e),null);case 22:case 23:return Vm(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Nn&1073741824&&(sn(e),e.subtreeFlags&6&&(e.flags|=8192)):sn(e),null;case 24:return null;case 25:return null}throw Error(ce(156,e.tag))}function cb(t,e){switch(Sm(e),e.tag){case 1:return wn(e.type)&&fu(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ia(),St(Tn),St(pn),Pm(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Rm(e),null;case 13:if(St(Tt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(ce(340));Na()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return St(Tt),null;case 4:return Ia(),null;case 10:return wm(e.type._context),null;case 22:case 23:return Vm(),null;case 24:return null;default:return null}}var ql=!1,cn=!1,ub=typeof WeakSet=="function"?WeakSet:Set,be=null;function ha(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Pt(t,e,i)}else n.current=null}function Ih(t,e,n){try{n()}catch(i){Pt(t,e,i)}}var fv=!1;function db(t,e){if(vh=lu,t=cS(),_m(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,c=0,u=0,f=t,d=null;t:for(;;){for(var p;f!==n||r!==0&&f.nodeType!==3||(o=a+r),f!==s||i!==0&&f.nodeType!==3||(l=a+i),f.nodeType===3&&(a+=f.nodeValue.length),(p=f.firstChild)!==null;)d=f,f=p;for(;;){if(f===t)break t;if(d===n&&++c===r&&(o=a),d===s&&++u===i&&(l=a),(p=f.nextSibling)!==null)break;f=d,d=f.parentNode}f=p}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(xh={focusedElem:t,selectionRange:n},lu=!1,be=e;be!==null;)if(e=be,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,be=t;else for(;be!==null;){e=be;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var y=v.memoizedProps,g=v.memoizedState,h=e.stateNode,m=h.getSnapshotBeforeUpdate(e.elementType===e.type?y:ai(e.type,y),g);h.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var _=e.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(ce(163))}}catch(M){Pt(e,e.return,M)}if(t=e.sibling,t!==null){t.return=e.return,be=t;break}be=e.return}return v=fv,fv=!1,v}function Lo(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&Ih(e,n,s)}r=r.next}while(r!==i)}}function ed(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function Uh(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function sM(t){var e=t.alternate;e!==null&&(t.alternate=null,sM(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Ti],delete e[tl],delete e[Sh],delete e[Xw],delete e[Yw])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function aM(t){return t.tag===5||t.tag===3||t.tag===4}function hv(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||aM(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Fh(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=du));else if(i!==4&&(t=t.child,t!==null))for(Fh(t,e,n),t=t.sibling;t!==null;)Fh(t,e,n),t=t.sibling}function Oh(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Oh(t,e,n),t=t.sibling;t!==null;)Oh(t,e,n),t=t.sibling}var qt=null,oi=!1;function hr(t,e,n){for(n=n.child;n!==null;)oM(t,e,n),n=n.sibling}function oM(t,e,n){if(Pi&&typeof Pi.onCommitFiberUnmount=="function")try{Pi.onCommitFiberUnmount($u,n)}catch{}switch(n.tag){case 5:cn||ha(n,e);case 6:var i=qt,r=oi;qt=null,hr(t,e,n),qt=i,oi=r,qt!==null&&(oi?(t=qt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):qt.removeChild(n.stateNode));break;case 18:qt!==null&&(oi?(t=qt,n=n.stateNode,t.nodeType===8?Od(t.parentNode,n):t.nodeType===1&&Od(t,n),qo(t)):Od(qt,n.stateNode));break;case 4:i=qt,r=oi,qt=n.stateNode.containerInfo,oi=!0,hr(t,e,n),qt=i,oi=r;break;case 0:case 11:case 14:case 15:if(!cn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&Ih(n,e,a),r=r.next}while(r!==i)}hr(t,e,n);break;case 1:if(!cn&&(ha(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){Pt(n,e,o)}hr(t,e,n);break;case 21:hr(t,e,n);break;case 22:n.mode&1?(cn=(i=cn)||n.memoizedState!==null,hr(t,e,n),cn=i):hr(t,e,n);break;default:hr(t,e,n)}}function pv(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new ub),e.forEach(function(i){var r=yb.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function ti(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:qt=o.stateNode,oi=!1;break e;case 3:qt=o.stateNode.containerInfo,oi=!0;break e;case 4:qt=o.stateNode.containerInfo,oi=!0;break e}o=o.return}if(qt===null)throw Error(ce(160));oM(s,a,r),qt=null,oi=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Pt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)lM(e,t),e=e.sibling}function lM(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(ti(e,t),xi(t),i&4){try{Lo(3,t,t.return),ed(3,t)}catch(y){Pt(t,t.return,y)}try{Lo(5,t,t.return)}catch(y){Pt(t,t.return,y)}}break;case 1:ti(e,t),xi(t),i&512&&n!==null&&ha(n,n.return);break;case 5:if(ti(e,t),xi(t),i&512&&n!==null&&ha(n,n.return),t.flags&32){var r=t.stateNode;try{$o(r,"")}catch(y){Pt(t,t.return,y)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&Py(r,s),oh(o,a);var c=oh(o,s);for(a=0;a<l.length;a+=2){var u=l[a],f=l[a+1];u==="style"?Uy(r,f):u==="dangerouslySetInnerHTML"?Ly(r,f):u==="children"?$o(r,f):am(r,u,f,c)}switch(o){case"input":nh(r,s);break;case"textarea":Dy(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?ya(r,!!s.multiple,p,!1):d!==!!s.multiple&&(s.defaultValue!=null?ya(r,!!s.multiple,s.defaultValue,!0):ya(r,!!s.multiple,s.multiple?[]:"",!1))}r[tl]=s}catch(y){Pt(t,t.return,y)}}break;case 6:if(ti(e,t),xi(t),i&4){if(t.stateNode===null)throw Error(ce(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(y){Pt(t,t.return,y)}}break;case 3:if(ti(e,t),xi(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{qo(e.containerInfo)}catch(y){Pt(t,t.return,y)}break;case 4:ti(e,t),xi(t);break;case 13:ti(e,t),xi(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Bm=Ot())),i&4&&pv(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?(cn=(c=cn)||u,ti(e,t),cn=c):ti(e,t),xi(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!u&&t.mode&1)for(be=t,u=t.child;u!==null;){for(f=be=u;be!==null;){switch(d=be,p=d.child,d.tag){case 0:case 11:case 14:case 15:Lo(4,d,d.return);break;case 1:ha(d,d.return);var v=d.stateNode;if(typeof v.componentWillUnmount=="function"){i=d,n=d.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(y){Pt(i,n,y)}}break;case 5:ha(d,d.return);break;case 22:if(d.memoizedState!==null){gv(f);continue}}p!==null?(p.return=d,be=p):gv(f)}u=u.sibling}e:for(u=null,f=t;;){if(f.tag===5){if(u===null){u=f;try{r=f.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=f.stateNode,l=f.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=Iy("display",a))}catch(y){Pt(t,t.return,y)}}}else if(f.tag===6){if(u===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(y){Pt(t,t.return,y)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;u===f&&(u=null),f=f.return}u===f&&(u=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:ti(e,t),xi(t),i&4&&pv(t);break;case 21:break;default:ti(e,t),xi(t)}}function xi(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(aM(n)){var i=n;break e}n=n.return}throw Error(ce(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&($o(r,""),i.flags&=-33);var s=hv(t);Oh(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=hv(t);Fh(t,o,a);break;default:throw Error(ce(161))}}catch(l){Pt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function fb(t,e,n){be=t,cM(t)}function cM(t,e,n){for(var i=(t.mode&1)!==0;be!==null;){var r=be,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||ql;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||cn;o=ql;var c=cn;if(ql=a,(cn=l)&&!c)for(be=r;be!==null;)a=be,l=a.child,a.tag===22&&a.memoizedState!==null?vv(r):l!==null?(l.return=a,be=l):vv(r);for(;s!==null;)be=s,cM(s),s=s.sibling;be=r,ql=o,cn=c}mv(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,be=s):mv(t)}}function mv(t){for(;be!==null;){var e=be;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:cn||ed(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!cn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:ai(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&Q0(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}Q0(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var f=u.dehydrated;f!==null&&qo(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(ce(163))}cn||e.flags&512&&Uh(e)}catch(d){Pt(e,e.return,d)}}if(e===t){be=null;break}if(n=e.sibling,n!==null){n.return=e.return,be=n;break}be=e.return}}function gv(t){for(;be!==null;){var e=be;if(e===t){be=null;break}var n=e.sibling;if(n!==null){n.return=e.return,be=n;break}be=e.return}}function vv(t){for(;be!==null;){var e=be;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{ed(4,e)}catch(l){Pt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Pt(e,r,l)}}var s=e.return;try{Uh(e)}catch(l){Pt(e,s,l)}break;case 5:var a=e.return;try{Uh(e)}catch(l){Pt(e,a,l)}}}catch(l){Pt(e,e.return,l)}if(e===t){be=null;break}var o=e.sibling;if(o!==null){o.return=e.return,be=o;break}be=e.return}}var hb=Math.ceil,Mu=cr.ReactCurrentDispatcher,Om=cr.ReactCurrentOwner,Zn=cr.ReactCurrentBatchConfig,rt=0,Xt=null,Bt=null,en=0,Nn=0,pa=Yr(0),Vt=0,ol=null,As=0,td=0,km=0,Io=null,Sn=null,Bm=0,Fa=1/0,ji=null,Eu=!1,kh=null,Fr=null,Zl=!1,Cr=null,Tu=0,Uo=0,Bh=null,jc=-1,Wc=0;function xn(){return rt&6?Ot():jc!==-1?jc:jc=Ot()}function Or(t){return t.mode&1?rt&2&&en!==0?en&-en:qw.transition!==null?(Wc===0&&(Wc=Xy()),Wc):(t=dt,t!==0||(t=window.event,t=t===void 0?16:eS(t.type)),t):1}function fi(t,e,n,i){if(50<Uo)throw Uo=0,Bh=null,Error(ce(185));_l(t,n,i),(!(rt&2)||t!==Xt)&&(t===Xt&&(!(rt&2)&&(td|=n),Vt===4&&wr(t,en)),bn(t,i),n===1&&rt===0&&!(e.mode&1)&&(Fa=Ot()+500,Zu&&Kr()))}function bn(t,e){var n=t.callbackNode;qT(t,e);var i=ou(t,t===Xt?en:0);if(i===0)n!==null&&b0(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&b0(n),e===1)t.tag===0?Kw(xv.bind(null,t)):_S(xv.bind(null,t)),Ww(function(){!(rt&6)&&Kr()}),n=null;else{switch(Yy(i)){case 1:n=dm;break;case 4:n=Wy;break;case 16:n=au;break;case 536870912:n=$y;break;default:n=au}n=vM(n,uM.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function uM(t,e){if(jc=-1,Wc=0,rt&6)throw Error(ce(327));var n=t.callbackNode;if(wa()&&t.callbackNode!==n)return null;var i=ou(t,t===Xt?en:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=wu(t,i);else{e=i;var r=rt;rt|=2;var s=fM();(Xt!==t||en!==e)&&(ji=null,Fa=Ot()+500,_s(t,e));do try{gb();break}catch(o){dM(t,o)}while(!0);Tm(),Mu.current=s,rt=r,Bt!==null?e=0:(Xt=null,en=0,e=Vt)}if(e!==0){if(e===2&&(r=fh(t),r!==0&&(i=r,e=zh(t,r))),e===1)throw n=ol,_s(t,0),wr(t,i),bn(t,Ot()),n;if(e===6)wr(t,i);else{if(r=t.current.alternate,!(i&30)&&!pb(r)&&(e=wu(t,i),e===2&&(s=fh(t),s!==0&&(i=s,e=zh(t,s))),e===1))throw n=ol,_s(t,0),wr(t,i),bn(t,Ot()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(ce(345));case 2:ss(t,Sn,ji);break;case 3:if(wr(t,i),(i&130023424)===i&&(e=Bm+500-Ot(),10<e)){if(ou(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){xn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=yh(ss.bind(null,t,Sn,ji),e);break}ss(t,Sn,ji);break;case 4:if(wr(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-di(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Ot()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*hb(i/1960))-i,10<i){t.timeoutHandle=yh(ss.bind(null,t,Sn,ji),i);break}ss(t,Sn,ji);break;case 5:ss(t,Sn,ji);break;default:throw Error(ce(329))}}}return bn(t,Ot()),t.callbackNode===n?uM.bind(null,t):null}function zh(t,e){var n=Io;return t.current.memoizedState.isDehydrated&&(_s(t,e).flags|=256),t=wu(t,e),t!==2&&(e=Sn,Sn=n,e!==null&&Vh(e)),t}function Vh(t){Sn===null?Sn=t:Sn.push.apply(Sn,t)}function pb(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!pi(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function wr(t,e){for(e&=~km,e&=~td,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-di(e),i=1<<n;t[n]=-1,e&=~i}}function xv(t){if(rt&6)throw Error(ce(327));wa();var e=ou(t,0);if(!(e&1))return bn(t,Ot()),null;var n=wu(t,e);if(t.tag!==0&&n===2){var i=fh(t);i!==0&&(e=i,n=zh(t,i))}if(n===1)throw n=ol,_s(t,0),wr(t,e),bn(t,Ot()),n;if(n===6)throw Error(ce(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,ss(t,Sn,ji),bn(t,Ot()),null}function zm(t,e){var n=rt;rt|=1;try{return t(e)}finally{rt=n,rt===0&&(Fa=Ot()+500,Zu&&Kr())}}function Cs(t){Cr!==null&&Cr.tag===0&&!(rt&6)&&wa();var e=rt;rt|=1;var n=Zn.transition,i=dt;try{if(Zn.transition=null,dt=1,t)return t()}finally{dt=i,Zn.transition=n,rt=e,!(rt&6)&&Kr()}}function Vm(){Nn=pa.current,St(pa)}function _s(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,jw(n)),Bt!==null)for(n=Bt.return;n!==null;){var i=n;switch(Sm(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&fu();break;case 3:Ia(),St(Tn),St(pn),Pm();break;case 5:Rm(i);break;case 4:Ia();break;case 13:St(Tt);break;case 19:St(Tt);break;case 10:wm(i.type._context);break;case 22:case 23:Vm()}n=n.return}if(Xt=t,Bt=t=kr(t.current,null),en=Nn=e,Vt=0,ol=null,km=td=As=0,Sn=Io=null,ps!==null){for(e=0;e<ps.length;e++)if(n=ps[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}ps=null}return t}function dM(t,e){do{var n=Bt;try{if(Tm(),Vc.current=Su,yu){for(var i=bt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}yu=!1}if(bs=0,$t=zt=bt=null,No=!1,rl=0,Om.current=null,n===null||n.return===null){Vt=1,ol=e,Bt=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=en,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=o,f=u.tag;if(!(u.mode&1)&&(f===0||f===11||f===15)){var d=u.alternate;d?(u.updateQueue=d.updateQueue,u.memoizedState=d.memoizedState,u.lanes=d.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=sv(a);if(p!==null){p.flags&=-257,av(p,a,o,s,e),p.mode&1&&rv(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var y=new Set;y.add(l),e.updateQueue=y}else v.add(l);break e}else{if(!(e&1)){rv(s,c,e),Gm();break e}l=Error(ce(426))}}else if(Et&&o.mode&1){var g=sv(a);if(g!==null){!(g.flags&65536)&&(g.flags|=256),av(g,a,o,s,e),Mm(Ua(l,o));break e}}s=l=Ua(l,o),Vt!==4&&(Vt=2),Io===null?Io=[s]:Io.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var h=YS(s,l,e);J0(s,h);break e;case 1:o=l;var m=s.type,_=s.stateNode;if(!(s.flags&128)&&(typeof m.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(Fr===null||!Fr.has(_)))){s.flags|=65536,e&=-e,s.lanes|=e;var M=KS(s,o,e);J0(s,M);break e}}s=s.return}while(s!==null)}pM(n)}catch(w){e=w,Bt===n&&n!==null&&(Bt=n=n.return);continue}break}while(!0)}function fM(){var t=Mu.current;return Mu.current=Su,t===null?Su:t}function Gm(){(Vt===0||Vt===3||Vt===2)&&(Vt=4),Xt===null||!(As&268435455)&&!(td&268435455)||wr(Xt,en)}function wu(t,e){var n=rt;rt|=2;var i=fM();(Xt!==t||en!==e)&&(ji=null,_s(t,e));do try{mb();break}catch(r){dM(t,r)}while(!0);if(Tm(),rt=n,Mu.current=i,Bt!==null)throw Error(ce(261));return Xt=null,en=0,Vt}function mb(){for(;Bt!==null;)hM(Bt)}function gb(){for(;Bt!==null&&!VT();)hM(Bt)}function hM(t){var e=gM(t.alternate,t,Nn);t.memoizedProps=t.pendingProps,e===null?pM(t):Bt=e,Om.current=null}function pM(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=cb(n,e),n!==null){n.flags&=32767,Bt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Vt=6,Bt=null;return}}else if(n=lb(n,e,Nn),n!==null){Bt=n;return}if(e=e.sibling,e!==null){Bt=e;return}Bt=e=t}while(e!==null);Vt===0&&(Vt=5)}function ss(t,e,n){var i=dt,r=Zn.transition;try{Zn.transition=null,dt=1,vb(t,e,n,i)}finally{Zn.transition=r,dt=i}return null}function vb(t,e,n,i){do wa();while(Cr!==null);if(rt&6)throw Error(ce(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(ce(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(ZT(t,s),t===Xt&&(Bt=Xt=null,en=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Zl||(Zl=!0,vM(au,function(){return wa(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Zn.transition,Zn.transition=null;var a=dt;dt=1;var o=rt;rt|=4,Om.current=null,db(t,n),lM(n,t),Ow(xh),lu=!!vh,xh=vh=null,t.current=n,fb(n),GT(),rt=o,dt=a,Zn.transition=s}else t.current=n;if(Zl&&(Zl=!1,Cr=t,Tu=r),s=t.pendingLanes,s===0&&(Fr=null),WT(n.stateNode),bn(t,Ot()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Eu)throw Eu=!1,t=kh,kh=null,t;return Tu&1&&t.tag!==0&&wa(),s=t.pendingLanes,s&1?t===Bh?Uo++:(Uo=0,Bh=t):Uo=0,Kr(),null}function wa(){if(Cr!==null){var t=Yy(Tu),e=Zn.transition,n=dt;try{if(Zn.transition=null,dt=16>t?16:t,Cr===null)var i=!1;else{if(t=Cr,Cr=null,Tu=0,rt&6)throw Error(ce(331));var r=rt;for(rt|=4,be=t.current;be!==null;){var s=be,a=s.child;if(be.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var c=o[l];for(be=c;be!==null;){var u=be;switch(u.tag){case 0:case 11:case 15:Lo(8,u,s)}var f=u.child;if(f!==null)f.return=u,be=f;else for(;be!==null;){u=be;var d=u.sibling,p=u.return;if(sM(u),u===c){be=null;break}if(d!==null){d.return=p,be=d;break}be=p}}}var v=s.alternate;if(v!==null){var y=v.child;if(y!==null){v.child=null;do{var g=y.sibling;y.sibling=null,y=g}while(y!==null)}}be=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,be=a;else e:for(;be!==null;){if(s=be,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Lo(9,s,s.return)}var h=s.sibling;if(h!==null){h.return=s.return,be=h;break e}be=s.return}}var m=t.current;for(be=m;be!==null;){a=be;var _=a.child;if(a.subtreeFlags&2064&&_!==null)_.return=a,be=_;else e:for(a=m;be!==null;){if(o=be,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:ed(9,o)}}catch(w){Pt(o,o.return,w)}if(o===a){be=null;break e}var M=o.sibling;if(M!==null){M.return=o.return,be=M;break e}be=o.return}}if(rt=r,Kr(),Pi&&typeof Pi.onPostCommitFiberRoot=="function")try{Pi.onPostCommitFiberRoot($u,t)}catch{}i=!0}return i}finally{dt=n,Zn.transition=e}}return!1}function _v(t,e,n){e=Ua(n,e),e=YS(t,e,1),t=Ur(t,e,1),e=xn(),t!==null&&(_l(t,1,e),bn(t,e))}function Pt(t,e,n){if(t.tag===3)_v(t,t,n);else for(;e!==null;){if(e.tag===3){_v(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Fr===null||!Fr.has(i))){t=Ua(n,t),t=KS(e,t,1),e=Ur(e,t,1),t=xn(),e!==null&&(_l(e,1,t),bn(e,t));break}}e=e.return}}function xb(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=xn(),t.pingedLanes|=t.suspendedLanes&n,Xt===t&&(en&n)===n&&(Vt===4||Vt===3&&(en&130023424)===en&&500>Ot()-Bm?_s(t,0):km|=n),bn(t,e)}function mM(t,e){e===0&&(t.mode&1?(e=Vl,Vl<<=1,!(Vl&130023424)&&(Vl=4194304)):e=1);var n=xn();t=rr(t,e),t!==null&&(_l(t,e,n),bn(t,n))}function _b(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),mM(t,n)}function yb(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(ce(314))}i!==null&&i.delete(e),mM(t,n)}var gM;gM=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Tn.current)En=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return En=!1,ob(t,e,n);En=!!(t.flags&131072)}else En=!1,Et&&e.flags&1048576&&yS(e,mu,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Hc(t,e),t=e.pendingProps;var r=Da(e,pn.current);Ta(e,n),r=Nm(null,e,i,t,r,n);var s=Lm();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,wn(i)?(s=!0,hu(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Am(e),r.updater=Qu,e.stateNode=r,r._reactInternals=e,Ah(e,i,t,n),e=Ph(null,e,i,!0,s,n)):(e.tag=0,Et&&s&&ym(e),vn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Hc(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=Mb(i),t=ai(i,t),r){case 0:e=Rh(null,e,i,t,n);break e;case 1:e=cv(null,e,i,t,n);break e;case 11:e=ov(null,e,i,t,n);break e;case 14:e=lv(null,e,i,ai(i.type,t),n);break e}throw Error(ce(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ai(i,r),Rh(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ai(i,r),cv(t,e,i,r,n);case 3:e:{if(QS(e),t===null)throw Error(ce(387));i=e.pendingProps,s=e.memoizedState,r=s.element,bS(t,e),xu(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Ua(Error(ce(423)),e),e=uv(t,e,i,n,r);break e}else if(i!==r){r=Ua(Error(ce(424)),e),e=uv(t,e,i,n,r);break e}else for(In=Ir(e.stateNode.containerInfo.firstChild),Un=e,Et=!0,li=null,n=TS(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Na(),i===r){e=sr(t,e,n);break e}vn(t,e,i,n)}e=e.child}return e;case 5:return AS(e),t===null&&Th(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,_h(i,r)?a=null:s!==null&&_h(i,s)&&(e.flags|=32),JS(t,e),vn(t,e,a,n),e.child;case 6:return t===null&&Th(e),null;case 13:return eM(t,e,n);case 4:return Cm(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=La(e,null,i,n):vn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ai(i,r),ov(t,e,i,r,n);case 7:return vn(t,e,e.pendingProps,n),e.child;case 8:return vn(t,e,e.pendingProps.children,n),e.child;case 12:return vn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,_t(gu,i._currentValue),i._currentValue=a,s!==null)if(pi(s.value,a)){if(s.children===r.children&&!Tn.current){e=sr(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=Ki(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),wh(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(ce(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),wh(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}vn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ta(e,n),r=Jn(r),i=i(r),e.flags|=1,vn(t,e,i,n),e.child;case 14:return i=e.type,r=ai(i,e.pendingProps),r=ai(i.type,r),lv(t,e,i,r,n);case 15:return qS(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:ai(i,r),Hc(t,e),e.tag=1,wn(i)?(t=!0,hu(e)):t=!1,Ta(e,n),XS(e,i,r),Ah(e,i,r,n),Ph(null,e,i,!0,t,n);case 19:return tM(t,e,n);case 22:return ZS(t,e,n)}throw Error(ce(156,e.tag))};function vM(t,e){return jy(t,e)}function Sb(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function qn(t,e,n,i){return new Sb(t,e,n,i)}function Hm(t){return t=t.prototype,!(!t||!t.isReactComponent)}function Mb(t){if(typeof t=="function")return Hm(t)?1:0;if(t!=null){if(t=t.$$typeof,t===lm)return 11;if(t===cm)return 14}return 2}function kr(t,e){var n=t.alternate;return n===null?(n=qn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function $c(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")Hm(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ra:return ys(n.children,r,s,e);case om:a=8,r|=8;break;case Zf:return t=qn(12,n,e,r|2),t.elementType=Zf,t.lanes=s,t;case Jf:return t=qn(13,n,e,r),t.elementType=Jf,t.lanes=s,t;case Qf:return t=qn(19,n,e,r),t.elementType=Qf,t.lanes=s,t;case Ay:return nd(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case wy:a=10;break e;case by:a=9;break e;case lm:a=11;break e;case cm:a=14;break e;case Mr:a=16,i=null;break e}throw Error(ce(130,t==null?t:typeof t,""))}return e=qn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function ys(t,e,n,i){return t=qn(7,t,i,e),t.lanes=n,t}function nd(t,e,n,i){return t=qn(22,t,i,e),t.elementType=Ay,t.lanes=n,t.stateNode={isHidden:!1},t}function Wd(t,e,n){return t=qn(6,t,null,e),t.lanes=n,t}function $d(t,e,n){return e=qn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function Eb(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=bd(0),this.expirationTimes=bd(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=bd(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function jm(t,e,n,i,r,s,a,o,l){return t=new Eb(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=qn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Am(s),t}function Tb(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ia,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function xM(t){if(!t)return Vr;t=t._reactInternals;e:{if(Ns(t)!==t||t.tag!==1)throw Error(ce(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(wn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(ce(171))}if(t.tag===1){var n=t.type;if(wn(n))return xS(t,n,e)}return e}function _M(t,e,n,i,r,s,a,o,l){return t=jm(n,i,!0,t,r,s,a,o,l),t.context=xM(null),n=t.current,i=xn(),r=Or(n),s=Ki(i,r),s.callback=e??null,Ur(n,s,r),t.current.lanes=r,_l(t,r,i),bn(t,i),t}function id(t,e,n,i){var r=e.current,s=xn(),a=Or(r);return n=xM(n),e.context===null?e.context=n:e.pendingContext=n,e=Ki(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Ur(r,e,a),t!==null&&(fi(t,r,a,s),zc(t,r,a)),a}function bu(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function yv(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Wm(t,e){yv(t,e),(t=t.alternate)&&yv(t,e)}function wb(){return null}var yM=typeof reportError=="function"?reportError:function(t){console.error(t)};function $m(t){this._internalRoot=t}rd.prototype.render=$m.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(ce(409));id(t,e,null,null)};rd.prototype.unmount=$m.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Cs(function(){id(null,t,null,null)}),e[ir]=null}};function rd(t){this._internalRoot=t}rd.prototype.unstable_scheduleHydration=function(t){if(t){var e=Zy();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Tr.length&&e!==0&&e<Tr[n].priority;n++);Tr.splice(n,0,t),n===0&&Qy(t)}};function Xm(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function sd(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Sv(){}function bb(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=bu(a);s.call(c)}}var a=_M(e,i,t,0,null,!1,!1,"",Sv);return t._reactRootContainer=a,t[ir]=a.current,Qo(t.nodeType===8?t.parentNode:t),Cs(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var c=bu(l);o.call(c)}}var l=jm(t,0,!1,null,null,!1,!1,"",Sv);return t._reactRootContainer=l,t[ir]=l.current,Qo(t.nodeType===8?t.parentNode:t),Cs(function(){id(e,l,n,i)}),l}function ad(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=bu(a);o.call(l)}}id(e,a,t,r)}else a=bb(n,e,t,r,i);return bu(a)}Ky=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=xo(e.pendingLanes);n!==0&&(fm(e,n|1),bn(e,Ot()),!(rt&6)&&(Fa=Ot()+500,Kr()))}break;case 13:Cs(function(){var i=rr(t,1);if(i!==null){var r=xn();fi(i,t,1,r)}}),Wm(t,1)}};hm=function(t){if(t.tag===13){var e=rr(t,134217728);if(e!==null){var n=xn();fi(e,t,134217728,n)}Wm(t,134217728)}};qy=function(t){if(t.tag===13){var e=Or(t),n=rr(t,e);if(n!==null){var i=xn();fi(n,t,e,i)}Wm(t,e)}};Zy=function(){return dt};Jy=function(t,e){var n=dt;try{return dt=t,e()}finally{dt=n}};ch=function(t,e,n){switch(e){case"input":if(nh(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=qu(i);if(!r)throw Error(ce(90));Ry(i),nh(i,r)}}}break;case"textarea":Dy(t,n);break;case"select":e=n.value,e!=null&&ya(t,!!n.multiple,e,!1)}};ky=zm;By=Cs;var Ab={usingClientEntryPoint:!1,Events:[Sl,la,qu,Fy,Oy,zm]},so={findFiberByHostInstance:hs,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Cb={bundleType:so.bundleType,version:so.version,rendererPackageName:so.rendererPackageName,rendererConfig:so.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:cr.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Gy(t),t===null?null:t.stateNode},findFiberByHostInstance:so.findFiberByHostInstance||wb,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Jl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Jl.isDisabled&&Jl.supportsFiber)try{$u=Jl.inject(Cb),Pi=Jl}catch{}}Bn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=Ab;Bn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Xm(e))throw Error(ce(200));return Tb(t,e,null,n)};Bn.createRoot=function(t,e){if(!Xm(t))throw Error(ce(299));var n=!1,i="",r=yM;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=jm(t,1,!1,null,null,n,!1,i,r),t[ir]=e.current,Qo(t.nodeType===8?t.parentNode:t),new $m(e)};Bn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(ce(188)):(t=Object.keys(t).join(","),Error(ce(268,t)));return t=Gy(e),t=t===null?null:t.stateNode,t};Bn.flushSync=function(t){return Cs(t)};Bn.hydrate=function(t,e,n){if(!sd(e))throw Error(ce(200));return ad(null,t,e,!0,n)};Bn.hydrateRoot=function(t,e,n){if(!Xm(t))throw Error(ce(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=yM;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=_M(e,null,t,1,n??null,r,!1,s,a),t[ir]=e.current,Qo(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new rd(e)};Bn.render=function(t,e,n){if(!sd(e))throw Error(ce(200));return ad(null,t,e,!1,n)};Bn.unmountComponentAtNode=function(t){if(!sd(t))throw Error(ce(40));return t._reactRootContainer?(Cs(function(){ad(null,null,t,!1,function(){t._reactRootContainer=null,t[ir]=null})}),!0):!1};Bn.unstable_batchedUpdates=zm;Bn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!sd(n))throw Error(ce(200));if(t==null||t._reactInternals===void 0)throw Error(ce(38));return ad(t,e,n,!1,i)};Bn.version="18.3.1-next-f1338f8080-20240426";function SM(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(SM)}catch(t){console.error(t)}}SM(),Sy.exports=Bn;var Rb=Sy.exports,Mv=Rb;Kf.createRoot=Mv.createRoot,Kf.hydrateRoot=Mv.hydrateRoot;const Ym=z.createContext({});function Km(t){const e=z.useRef(null);return e.current===null&&(e.current=t()),e.current}const od=z.createContext(null),qm=z.createContext({transformPagePoint:t=>t,isStatic:!1,reducedMotion:"never"});class Pb extends z.Component{getSnapshotBeforeUpdate(e){const n=this.props.childRef.current;if(n&&e.isPresent&&!this.props.isPresent){const i=this.props.sizeRef.current;i.height=n.offsetHeight||0,i.width=n.offsetWidth||0,i.top=n.offsetTop,i.left=n.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function Db({children:t,isPresent:e}){const n=z.useId(),i=z.useRef(null),r=z.useRef({width:0,height:0,top:0,left:0}),{nonce:s}=z.useContext(qm);return z.useInsertionEffect(()=>{const{width:a,height:o,top:l,left:c}=r.current;if(e||!i.current||!a||!o)return;i.current.dataset.motionPopId=n;const u=document.createElement("style");return s&&(u.nonce=s),document.head.appendChild(u),u.sheet&&u.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${a}px !important;
            height: ${o}px !important;
            top: ${l}px !important;
            left: ${c}px !important;
          }
        `),()=>{document.head.removeChild(u)}},[e]),x.jsx(Pb,{isPresent:e,childRef:i,sizeRef:r,children:z.cloneElement(t,{ref:i})})}const Nb=({children:t,initial:e,isPresent:n,onExitComplete:i,custom:r,presenceAffectsLayout:s,mode:a})=>{const o=Km(Lb),l=z.useId(),c=z.useCallback(f=>{o.set(f,!0);for(const d of o.values())if(!d)return;i&&i()},[o,i]),u=z.useMemo(()=>({id:l,initial:e,isPresent:n,custom:r,onExitComplete:c,register:f=>(o.set(f,!1),()=>o.delete(f))}),s?[Math.random(),c]:[n,c]);return z.useMemo(()=>{o.forEach((f,d)=>o.set(d,!1))},[n]),z.useEffect(()=>{!n&&!o.size&&i&&i()},[n]),a==="popLayout"&&(t=x.jsx(Db,{isPresent:n,children:t})),x.jsx(od.Provider,{value:u,children:t})};function Lb(){return new Map}function MM(t=!0){const e=z.useContext(od);if(e===null)return[!0,null];const{isPresent:n,onExitComplete:i,register:r}=e,s=z.useId();z.useEffect(()=>{t&&r(s)},[t]);const a=z.useCallback(()=>t&&i&&i(s),[s,i,t]);return!n&&i?[!1,a]:[!0]}const Ql=t=>t.key||"";function Ev(t){const e=[];return z.Children.forEach(t,n=>{z.isValidElement(n)&&e.push(n)}),e}const Zm=typeof window<"u",EM=Zm?z.useLayoutEffect:z.useEffect,Br=({children:t,custom:e,initial:n=!0,onExitComplete:i,presenceAffectsLayout:r=!0,mode:s="sync",propagate:a=!1})=>{const[o,l]=MM(a),c=z.useMemo(()=>Ev(t),[t]),u=a&&!o?[]:c.map(Ql),f=z.useRef(!0),d=z.useRef(c),p=Km(()=>new Map),[v,y]=z.useState(c),[g,h]=z.useState(c);EM(()=>{f.current=!1,d.current=c;for(let M=0;M<g.length;M++){const w=Ql(g[M]);u.includes(w)?p.delete(w):p.get(w)!==!0&&p.set(w,!1)}},[g,u.length,u.join("-")]);const m=[];if(c!==v){let M=[...c];for(let w=0;w<g.length;w++){const T=g[w],R=Ql(T);u.includes(R)||(M.splice(w,0,T),m.push(T))}s==="wait"&&m.length&&(M=m),h(Ev(M)),y(c);return}const{forceRender:_}=z.useContext(Ym);return x.jsx(x.Fragment,{children:g.map(M=>{const w=Ql(M),T=a&&!o?!1:c===g||u.includes(w),R=()=>{if(p.has(w))p.set(w,!0);else return;let S=!0;p.forEach(A=>{A||(S=!1)}),S&&(_==null||_(),h(d.current),a&&(l==null||l()),i&&i())};return x.jsx(Nb,{isPresent:T,initial:!f.current||n?void 0:!1,custom:T?void 0:e,presenceAffectsLayout:r,mode:s,onExitComplete:T?void 0:R,children:M},w)})})},Fn=t=>t;let TM=Fn;function Jm(t){let e;return()=>(e===void 0&&(e=t()),e)}const Oa=(t,e,n)=>{const i=e-t;return i===0?1:(n-t)/i},qi=t=>t*1e3,Zi=t=>t/1e3,Ib={useManualTiming:!1};function Ub(t){let e=new Set,n=new Set,i=!1,r=!1;const s=new WeakSet;let a={delta:0,timestamp:0,isProcessing:!1};function o(c){s.has(c)&&(l.schedule(c),t()),c(a)}const l={schedule:(c,u=!1,f=!1)=>{const p=f&&i?e:n;return u&&s.add(c),p.has(c)||p.add(c),c},cancel:c=>{n.delete(c),s.delete(c)},process:c=>{if(a=c,i){r=!0;return}i=!0,[e,n]=[n,e],e.forEach(o),e.clear(),i=!1,r&&(r=!1,l.process(c))}};return l}const ec=["read","resolveKeyframes","update","preRender","render","postRender"],Fb=40;function wM(t,e){let n=!1,i=!0;const r={delta:0,timestamp:0,isProcessing:!1},s=()=>n=!0,a=ec.reduce((h,m)=>(h[m]=Ub(s),h),{}),{read:o,resolveKeyframes:l,update:c,preRender:u,render:f,postRender:d}=a,p=()=>{const h=performance.now();n=!1,r.delta=i?1e3/60:Math.max(Math.min(h-r.timestamp,Fb),1),r.timestamp=h,r.isProcessing=!0,o.process(r),l.process(r),c.process(r),u.process(r),f.process(r),d.process(r),r.isProcessing=!1,n&&e&&(i=!1,t(p))},v=()=>{n=!0,i=!0,r.isProcessing||t(p)};return{schedule:ec.reduce((h,m)=>{const _=a[m];return h[m]=(M,w=!1,T=!1)=>(n||v(),_.schedule(M,w,T)),h},{}),cancel:h=>{for(let m=0;m<ec.length;m++)a[ec[m]].cancel(h)},state:r,steps:a}}const{schedule:Mt,cancel:Gr,state:Jt,steps:Xd}=wM(typeof requestAnimationFrame<"u"?requestAnimationFrame:Fn,!0),bM=z.createContext({strict:!1}),Tv={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]},ka={};for(const t in Tv)ka[t]={isEnabled:e=>Tv[t].some(n=>!!e[n])};function Ob(t){for(const e in t)ka[e]={...ka[e],...t[e]}}const kb=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","ignoreStrict","viewport"]);function Au(t){return t.startsWith("while")||t.startsWith("drag")&&t!=="draggable"||t.startsWith("layout")||t.startsWith("onTap")||t.startsWith("onPan")||t.startsWith("onLayout")||kb.has(t)}let AM=t=>!Au(t);function Bb(t){t&&(AM=e=>e.startsWith("on")?!Au(e):t(e))}try{Bb(require("@emotion/is-prop-valid").default)}catch{}function zb(t,e,n){const i={};for(const r in t)r==="values"&&typeof t.values=="object"||(AM(r)||n===!0&&Au(r)||!e&&!Au(r)||t.draggable&&r.startsWith("onDrag"))&&(i[r]=t[r]);return i}function Vb(t){if(typeof Proxy>"u")return t;const e=new Map,n=(...i)=>t(...i);return new Proxy(n,{get:(i,r)=>r==="create"?t:(e.has(r)||e.set(r,t(r)),e.get(r))})}const ld=z.createContext({});function ll(t){return typeof t=="string"||Array.isArray(t)}function cd(t){return t!==null&&typeof t=="object"&&typeof t.start=="function"}const Qm=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],eg=["initial",...Qm];function ud(t){return cd(t.animate)||eg.some(e=>ll(t[e]))}function CM(t){return!!(ud(t)||t.variants)}function Gb(t,e){if(ud(t)){const{initial:n,animate:i}=t;return{initial:n===!1||ll(n)?n:void 0,animate:ll(i)?i:void 0}}return t.inherit!==!1?e:{}}function Hb(t){const{initial:e,animate:n}=Gb(t,z.useContext(ld));return z.useMemo(()=>({initial:e,animate:n}),[wv(e),wv(n)])}function wv(t){return Array.isArray(t)?t.join(" "):t}const jb=Symbol.for("motionComponentSymbol");function ma(t){return t&&typeof t=="object"&&Object.prototype.hasOwnProperty.call(t,"current")}function Wb(t,e,n){return z.useCallback(i=>{i&&t.onMount&&t.onMount(i),e&&(i?e.mount(i):e.unmount()),n&&(typeof n=="function"?n(i):ma(n)&&(n.current=i))},[e])}const tg=t=>t.replace(/([a-z])([A-Z])/gu,"$1-$2").toLowerCase(),$b="framerAppearId",RM="data-"+tg($b),{schedule:ng}=wM(queueMicrotask,!1),PM=z.createContext({});function Xb(t,e,n,i,r){var s,a;const{visualElement:o}=z.useContext(ld),l=z.useContext(bM),c=z.useContext(od),u=z.useContext(qm).reducedMotion,f=z.useRef(null);i=i||l.renderer,!f.current&&i&&(f.current=i(t,{visualState:e,parent:o,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:u}));const d=f.current,p=z.useContext(PM);d&&!d.projection&&r&&(d.type==="html"||d.type==="svg")&&Yb(f.current,n,r,p);const v=z.useRef(!1);z.useInsertionEffect(()=>{d&&v.current&&d.update(n,c)});const y=n[RM],g=z.useRef(!!y&&!(!((s=window.MotionHandoffIsComplete)===null||s===void 0)&&s.call(window,y))&&((a=window.MotionHasOptimisedAnimation)===null||a===void 0?void 0:a.call(window,y)));return EM(()=>{d&&(v.current=!0,window.MotionIsMounted=!0,d.updateFeatures(),ng.render(d.render),g.current&&d.animationState&&d.animationState.animateChanges())}),z.useEffect(()=>{d&&(!g.current&&d.animationState&&d.animationState.animateChanges(),g.current&&(queueMicrotask(()=>{var h;(h=window.MotionHandoffMarkAsComplete)===null||h===void 0||h.call(window,y)}),g.current=!1))}),d}function Yb(t,e,n,i){const{layoutId:r,layout:s,drag:a,dragConstraints:o,layoutScroll:l,layoutRoot:c}=e;t.projection=new n(t.latestValues,e["data-framer-portal-id"]?void 0:DM(t.parent)),t.projection.setOptions({layoutId:r,layout:s,alwaysMeasureLayout:!!a||o&&ma(o),visualElement:t,animationType:typeof s=="string"?s:"both",initialPromotionConfig:i,layoutScroll:l,layoutRoot:c})}function DM(t){if(t)return t.options.allowProjection!==!1?t.projection:DM(t.parent)}function Kb({preloadedFeatures:t,createVisualElement:e,useRender:n,useVisualState:i,Component:r}){var s,a;t&&Ob(t);function o(c,u){let f;const d={...z.useContext(qm),...c,layoutId:qb(c)},{isStatic:p}=d,v=Hb(c),y=i(c,p);if(!p&&Zm){Zb();const g=Jb(d);f=g.MeasureLayout,v.visualElement=Xb(r,y,d,e,g.ProjectionNode)}return x.jsxs(ld.Provider,{value:v,children:[f&&v.visualElement?x.jsx(f,{visualElement:v.visualElement,...d}):null,n(r,c,Wb(y,v.visualElement,u),y,p,v.visualElement)]})}o.displayName=`motion.${typeof r=="string"?r:`create(${(a=(s=r.displayName)!==null&&s!==void 0?s:r.name)!==null&&a!==void 0?a:""})`}`;const l=z.forwardRef(o);return l[jb]=r,l}function qb({layoutId:t}){const e=z.useContext(Ym).id;return e&&t!==void 0?e+"-"+t:t}function Zb(t,e){z.useContext(bM).strict}function Jb(t){const{drag:e,layout:n}=ka;if(!e&&!n)return{};const i={...e,...n};return{MeasureLayout:e!=null&&e.isEnabled(t)||n!=null&&n.isEnabled(t)?i.MeasureLayout:void 0,ProjectionNode:i.ProjectionNode}}const Qb=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function ig(t){return typeof t!="string"||t.includes("-")?!1:!!(Qb.indexOf(t)>-1||/[A-Z]/u.test(t))}function bv(t){const e=[{},{}];return t==null||t.values.forEach((n,i)=>{e[0][i]=n.get(),e[1][i]=n.getVelocity()}),e}function rg(t,e,n,i){if(typeof e=="function"){const[r,s]=bv(i);e=e(n!==void 0?n:t.custom,r,s)}if(typeof e=="string"&&(e=t.variants&&t.variants[e]),typeof e=="function"){const[r,s]=bv(i);e=e(n!==void 0?n:t.custom,r,s)}return e}const Gh=t=>Array.isArray(t),eA=t=>!!(t&&typeof t=="object"&&t.mix&&t.toValue),tA=t=>Gh(t)?t[t.length-1]||0:t,un=t=>!!(t&&t.getVelocity);function Xc(t){const e=un(t)?t.get():t;return eA(e)?e.toValue():e}function nA({scrapeMotionValuesFromProps:t,createRenderState:e,onUpdate:n},i,r,s){const a={latestValues:iA(i,r,s,t),renderState:e()};return n&&(a.onMount=o=>n({props:i,current:o,...a}),a.onUpdate=o=>n(o)),a}const NM=t=>(e,n)=>{const i=z.useContext(ld),r=z.useContext(od),s=()=>nA(t,e,i,r);return n?s():Km(s)};function iA(t,e,n,i){const r={},s=i(t,{});for(const d in s)r[d]=Xc(s[d]);let{initial:a,animate:o}=t;const l=ud(t),c=CM(t);e&&c&&!l&&t.inherit!==!1&&(a===void 0&&(a=e.initial),o===void 0&&(o=e.animate));let u=n?n.initial===!1:!1;u=u||a===!1;const f=u?o:a;if(f&&typeof f!="boolean"&&!cd(f)){const d=Array.isArray(f)?f:[f];for(let p=0;p<d.length;p++){const v=rg(t,d[p]);if(v){const{transitionEnd:y,transition:g,...h}=v;for(const m in h){let _=h[m];if(Array.isArray(_)){const M=u?_.length-1:0;_=_[M]}_!==null&&(r[m]=_)}for(const m in y)r[m]=y[m]}}}return r}const Xa=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Ls=new Set(Xa),LM=t=>e=>typeof e=="string"&&e.startsWith(t),IM=LM("--"),rA=LM("var(--"),sg=t=>rA(t)?sA.test(t.split("/*")[0].trim()):!1,sA=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,UM=(t,e)=>e&&typeof t=="number"?e.transform(t):t,ar=(t,e,n)=>n>e?e:n<t?t:n,Ya={test:t=>typeof t=="number",parse:parseFloat,transform:t=>t},cl={...Ya,transform:t=>ar(0,1,t)},tc={...Ya,default:1},El=t=>({test:e=>typeof e=="string"&&e.endsWith(t)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${t}`}),Sr=El("deg"),Ni=El("%"),ke=El("px"),aA=El("vh"),oA=El("vw"),Av={...Ni,parse:t=>Ni.parse(t)/100,transform:t=>Ni.transform(t*100)},lA={borderWidth:ke,borderTopWidth:ke,borderRightWidth:ke,borderBottomWidth:ke,borderLeftWidth:ke,borderRadius:ke,radius:ke,borderTopLeftRadius:ke,borderTopRightRadius:ke,borderBottomRightRadius:ke,borderBottomLeftRadius:ke,width:ke,maxWidth:ke,height:ke,maxHeight:ke,top:ke,right:ke,bottom:ke,left:ke,padding:ke,paddingTop:ke,paddingRight:ke,paddingBottom:ke,paddingLeft:ke,margin:ke,marginTop:ke,marginRight:ke,marginBottom:ke,marginLeft:ke,backgroundPositionX:ke,backgroundPositionY:ke},cA={rotate:Sr,rotateX:Sr,rotateY:Sr,rotateZ:Sr,scale:tc,scaleX:tc,scaleY:tc,scaleZ:tc,skew:Sr,skewX:Sr,skewY:Sr,distance:ke,translateX:ke,translateY:ke,translateZ:ke,x:ke,y:ke,z:ke,perspective:ke,transformPerspective:ke,opacity:cl,originX:Av,originY:Av,originZ:ke},Cv={...Ya,transform:Math.round},ag={...lA,...cA,zIndex:Cv,size:ke,fillOpacity:cl,strokeOpacity:cl,numOctaves:Cv},uA={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},dA=Xa.length;function fA(t,e,n){let i="",r=!0;for(let s=0;s<dA;s++){const a=Xa[s],o=t[a];if(o===void 0)continue;let l=!0;if(typeof o=="number"?l=o===(a.startsWith("scale")?1:0):l=parseFloat(o)===0,!l||n){const c=UM(o,ag[a]);if(!l){r=!1;const u=uA[a]||a;i+=`${u}(${c}) `}n&&(e[a]=c)}}return i=i.trim(),n?i=n(e,r?"":i):r&&(i="none"),i}function og(t,e,n){const{style:i,vars:r,transformOrigin:s}=t;let a=!1,o=!1;for(const l in e){const c=e[l];if(Ls.has(l)){a=!0;continue}else if(IM(l)){r[l]=c;continue}else{const u=UM(c,ag[l]);l.startsWith("origin")?(o=!0,s[l]=u):i[l]=u}}if(e.transform||(a||n?i.transform=fA(e,t.transform,n):i.transform&&(i.transform="none")),o){const{originX:l="50%",originY:c="50%",originZ:u=0}=s;i.transformOrigin=`${l} ${c} ${u}`}}const hA={offset:"stroke-dashoffset",array:"stroke-dasharray"},pA={offset:"strokeDashoffset",array:"strokeDasharray"};function mA(t,e,n=1,i=0,r=!0){t.pathLength=1;const s=r?hA:pA;t[s.offset]=ke.transform(-i);const a=ke.transform(e),o=ke.transform(n);t[s.array]=`${a} ${o}`}function Rv(t,e,n){return typeof t=="string"?t:ke.transform(e+n*t)}function gA(t,e,n){const i=Rv(e,t.x,t.width),r=Rv(n,t.y,t.height);return`${i} ${r}`}function lg(t,{attrX:e,attrY:n,attrScale:i,originX:r,originY:s,pathLength:a,pathSpacing:o=1,pathOffset:l=0,...c},u,f){if(og(t,c,f),u){t.style.viewBox&&(t.attrs.viewBox=t.style.viewBox);return}t.attrs=t.style,t.style={};const{attrs:d,style:p,dimensions:v}=t;d.transform&&(v&&(p.transform=d.transform),delete d.transform),v&&(r!==void 0||s!==void 0||p.transform)&&(p.transformOrigin=gA(v,r!==void 0?r:.5,s!==void 0?s:.5)),e!==void 0&&(d.x=e),n!==void 0&&(d.y=n),i!==void 0&&(d.scale=i),a!==void 0&&mA(d,a,o,l,!1)}const cg=()=>({style:{},transform:{},transformOrigin:{},vars:{}}),FM=()=>({...cg(),attrs:{}}),ug=t=>typeof t=="string"&&t.toLowerCase()==="svg";function OM(t,{style:e,vars:n},i,r){Object.assign(t.style,e,r&&r.getProjectionStyles(i));for(const s in n)t.style.setProperty(s,n[s])}const kM=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]);function BM(t,e,n,i){OM(t,e,void 0,i);for(const r in e.attrs)t.setAttribute(kM.has(r)?r:tg(r),e.attrs[r])}const Cu={};function vA(t){Object.assign(Cu,t)}function zM(t,{layout:e,layoutId:n}){return Ls.has(t)||t.startsWith("origin")||(e||n!==void 0)&&(!!Cu[t]||t==="opacity")}function dg(t,e,n){var i;const{style:r}=t,s={};for(const a in r)(un(r[a])||e.style&&un(e.style[a])||zM(a,t)||((i=n==null?void 0:n.getValue(a))===null||i===void 0?void 0:i.liveStyle)!==void 0)&&(s[a]=r[a]);return s}function VM(t,e,n){const i=dg(t,e,n);for(const r in t)if(un(t[r])||un(e[r])){const s=Xa.indexOf(r)!==-1?"attr"+r.charAt(0).toUpperCase()+r.substring(1):r;i[s]=t[r]}return i}function xA(t,e){try{e.dimensions=typeof t.getBBox=="function"?t.getBBox():t.getBoundingClientRect()}catch{e.dimensions={x:0,y:0,width:0,height:0}}}const Pv=["x","y","width","height","cx","cy","r"],_A={useVisualState:NM({scrapeMotionValuesFromProps:VM,createRenderState:FM,onUpdate:({props:t,prevProps:e,current:n,renderState:i,latestValues:r})=>{if(!n)return;let s=!!t.drag;if(!s){for(const o in r)if(Ls.has(o)){s=!0;break}}if(!s)return;let a=!e;if(e)for(let o=0;o<Pv.length;o++){const l=Pv[o];t[l]!==e[l]&&(a=!0)}a&&Mt.read(()=>{xA(n,i),Mt.render(()=>{lg(i,r,ug(n.tagName),t.transformTemplate),BM(n,i)})})}})},yA={useVisualState:NM({scrapeMotionValuesFromProps:dg,createRenderState:cg})};function GM(t,e,n){for(const i in e)!un(e[i])&&!zM(i,n)&&(t[i]=e[i])}function SA({transformTemplate:t},e){return z.useMemo(()=>{const n=cg();return og(n,e,t),Object.assign({},n.vars,n.style)},[e])}function MA(t,e){const n=t.style||{},i={};return GM(i,n,t),Object.assign(i,SA(t,e)),i}function EA(t,e){const n={},i=MA(t,e);return t.drag&&t.dragListener!==!1&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=t.drag===!0?"none":`pan-${t.drag==="x"?"y":"x"}`),t.tabIndex===void 0&&(t.onTap||t.onTapStart||t.whileTap)&&(n.tabIndex=0),n.style=i,n}function TA(t,e,n,i){const r=z.useMemo(()=>{const s=FM();return lg(s,e,ug(i),t.transformTemplate),{...s.attrs,style:{...s.style}}},[e]);if(t.style){const s={};GM(s,t.style,t),r.style={...s,...r.style}}return r}function wA(t=!1){return(n,i,r,{latestValues:s},a)=>{const l=(ig(n)?TA:EA)(i,s,a,n),c=zb(i,typeof n=="string",t),u=n!==z.Fragment?{...c,...l,ref:r}:{},{children:f}=i,d=z.useMemo(()=>un(f)?f.get():f,[f]);return z.createElement(n,{...u,children:d})}}function bA(t,e){return function(i,{forwardMotionProps:r}={forwardMotionProps:!1}){const a={...ig(i)?_A:yA,preloadedFeatures:t,useRender:wA(r),createVisualElement:e,Component:i};return Kb(a)}}function HM(t,e){if(!Array.isArray(e))return!1;const n=e.length;if(n!==t.length)return!1;for(let i=0;i<n;i++)if(e[i]!==t[i])return!1;return!0}function dd(t,e,n){const i=t.getProps();return rg(i,e,n!==void 0?n:i.custom,t)}const AA=Jm(()=>window.ScrollTimeline!==void 0);class CA{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>"finished"in e?e.finished:e))}getAll(e){return this.animations[0][e]}setAll(e,n){for(let i=0;i<this.animations.length;i++)this.animations[i][e]=n}attachTimeline(e,n){const i=this.animations.map(r=>{if(AA()&&r.attachTimeline)return r.attachTimeline(e);if(typeof n=="function")return n(r)});return()=>{i.forEach((r,s)=>{r&&r(),this.animations[s].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get startTime(){return this.getAll("startTime")}get duration(){let e=0;for(let n=0;n<this.animations.length;n++)e=Math.max(e,this.animations[n].duration);return e}runAll(e){this.animations.forEach(n=>n[e]())}flatten(){this.runAll("flatten")}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}class RA extends CA{then(e,n){return Promise.all(this.animations).then(e).catch(n)}}function fg(t,e){return t?t[e]||t.default||t:void 0}const Hh=2e4;function jM(t){let e=0;const n=50;let i=t.next(e);for(;!i.done&&e<Hh;)e+=n,i=t.next(e);return e>=Hh?1/0:e}function hg(t){return typeof t=="function"}function Dv(t,e){t.timeline=e,t.onfinish=null}const pg=t=>Array.isArray(t)&&typeof t[0]=="number",PA={linearEasing:void 0};function DA(t,e){const n=Jm(t);return()=>{var i;return(i=PA[e])!==null&&i!==void 0?i:n()}}const Ru=DA(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),WM=(t,e,n=10)=>{let i="";const r=Math.max(Math.round(e/n),2);for(let s=0;s<r;s++)i+=t(Oa(0,r-1,s))+", ";return`linear(${i.substring(0,i.length-2)})`};function $M(t){return!!(typeof t=="function"&&Ru()||!t||typeof t=="string"&&(t in jh||Ru())||pg(t)||Array.isArray(t)&&t.every($M))}const yo=([t,e,n,i])=>`cubic-bezier(${t}, ${e}, ${n}, ${i})`,jh={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:yo([0,.65,.55,1]),circOut:yo([.55,0,1,.45]),backIn:yo([.31,.01,.66,-.59]),backOut:yo([.33,1.53,.69,.99])};function XM(t,e){if(t)return typeof t=="function"&&Ru()?WM(t,e):pg(t)?yo(t):Array.isArray(t)?t.map(n=>XM(n,e)||jh.easeOut):jh[t]}const si={x:!1,y:!1};function YM(){return si.x||si.y}function NA(t,e,n){var i;if(t instanceof Element)return[t];if(typeof t=="string"){let r=document;const s=(i=void 0)!==null&&i!==void 0?i:r.querySelectorAll(t);return s?Array.from(s):[]}return Array.from(t)}function KM(t,e){const n=NA(t),i=new AbortController,r={passive:!0,...e,signal:i.signal};return[n,r,()=>i.abort()]}function Nv(t){return e=>{e.pointerType==="touch"||YM()||t(e)}}function LA(t,e,n={}){const[i,r,s]=KM(t,n),a=Nv(o=>{const{target:l}=o,c=e(o);if(typeof c!="function"||!l)return;const u=Nv(f=>{c(f),l.removeEventListener("pointerleave",u)});l.addEventListener("pointerleave",u,r)});return i.forEach(o=>{o.addEventListener("pointerenter",a,r)}),s}const qM=(t,e)=>e?t===e?!0:qM(t,e.parentElement):!1,mg=t=>t.pointerType==="mouse"?typeof t.button!="number"||t.button<=0:t.isPrimary!==!1,IA=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function UA(t){return IA.has(t.tagName)||t.tabIndex!==-1}const So=new WeakSet;function Lv(t){return e=>{e.key==="Enter"&&t(e)}}function Yd(t,e){t.dispatchEvent(new PointerEvent("pointer"+e,{isPrimary:!0,bubbles:!0}))}const FA=(t,e)=>{const n=t.currentTarget;if(!n)return;const i=Lv(()=>{if(So.has(n))return;Yd(n,"down");const r=Lv(()=>{Yd(n,"up")}),s=()=>Yd(n,"cancel");n.addEventListener("keyup",r,e),n.addEventListener("blur",s,e)});n.addEventListener("keydown",i,e),n.addEventListener("blur",()=>n.removeEventListener("keydown",i),e)};function Iv(t){return mg(t)&&!YM()}function OA(t,e,n={}){const[i,r,s]=KM(t,n),a=o=>{const l=o.currentTarget;if(!Iv(o)||So.has(l))return;So.add(l);const c=e(o),u=(p,v)=>{window.removeEventListener("pointerup",f),window.removeEventListener("pointercancel",d),!(!Iv(p)||!So.has(l))&&(So.delete(l),typeof c=="function"&&c(p,{success:v}))},f=p=>{u(p,n.useGlobalTarget||qM(l,p.target))},d=p=>{u(p,!1)};window.addEventListener("pointerup",f,r),window.addEventListener("pointercancel",d,r)};return i.forEach(o=>{!UA(o)&&o.getAttribute("tabindex")===null&&(o.tabIndex=0),(n.useGlobalTarget?window:o).addEventListener("pointerdown",a,r),o.addEventListener("focus",c=>FA(c,r),r)}),s}function kA(t){return t==="x"||t==="y"?si[t]?null:(si[t]=!0,()=>{si[t]=!1}):si.x||si.y?null:(si.x=si.y=!0,()=>{si.x=si.y=!1})}const ZM=new Set(["width","height","top","left","right","bottom",...Xa]);let Yc;function BA(){Yc=void 0}const Li={now:()=>(Yc===void 0&&Li.set(Jt.isProcessing||Ib.useManualTiming?Jt.timestamp:performance.now()),Yc),set:t=>{Yc=t,queueMicrotask(BA)}};function gg(t,e){t.indexOf(e)===-1&&t.push(e)}function vg(t,e){const n=t.indexOf(e);n>-1&&t.splice(n,1)}class xg{constructor(){this.subscriptions=[]}add(e){return gg(this.subscriptions,e),()=>vg(this.subscriptions,e)}notify(e,n,i){const r=this.subscriptions.length;if(r)if(r===1)this.subscriptions[0](e,n,i);else for(let s=0;s<r;s++){const a=this.subscriptions[s];a&&a(e,n,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}function JM(t,e){return e?t*(1e3/e):0}const Uv=30,zA=t=>!isNaN(parseFloat(t));class VA{constructor(e,n={}){this.version="11.18.2",this.canTrackVelocity=null,this.events={},this.updateAndNotify=(i,r=!0)=>{const s=Li.now();this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&this.events.change&&this.events.change.notify(this.current),r&&this.events.renderRequest&&this.events.renderRequest.notify(this.current)},this.hasAnimated=!1,this.setCurrent(e),this.owner=n.owner}setCurrent(e){this.current=e,this.updatedAt=Li.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=zA(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,n){this.events[e]||(this.events[e]=new xg);const i=this.events[e].add(n);return e==="change"?()=>{i(),Mt.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,n){this.passiveEffect=e,this.stopPassiveEffect=n}set(e,n=!0){!n||!this.passiveEffect?this.updateAndNotify(e,n):this.passiveEffect(e,this.updateAndNotify)}setWithVelocity(e,n,i){this.set(n),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-i}jump(e,n=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const e=Li.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>Uv)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,Uv);return JM(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(e){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=e(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function ul(t,e){return new VA(t,e)}function GA(t,e,n){t.hasValue(e)?t.getValue(e).set(n):t.addValue(e,ul(n))}function HA(t,e){const n=dd(t,e);let{transitionEnd:i={},transition:r={},...s}=n||{};s={...s,...i};for(const a in s){const o=tA(s[a]);GA(t,a,o)}}function jA(t){return!!(un(t)&&t.add)}function Wh(t,e){const n=t.getValue("willChange");if(jA(n))return n.add(e)}function QM(t){return t.props[RM]}const e1=(t,e,n)=>(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t,WA=1e-7,$A=12;function XA(t,e,n,i,r){let s,a,o=0;do a=e+(n-e)/2,s=e1(a,i,r)-t,s>0?n=a:e=a;while(Math.abs(s)>WA&&++o<$A);return a}function Tl(t,e,n,i){if(t===e&&n===i)return Fn;const r=s=>XA(s,0,1,t,n);return s=>s===0||s===1?s:e1(r(s),e,i)}const t1=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,n1=t=>e=>1-t(1-e),i1=Tl(.33,1.53,.69,.99),_g=n1(i1),r1=t1(_g),s1=t=>(t*=2)<1?.5*_g(t):.5*(2-Math.pow(2,-10*(t-1))),yg=t=>1-Math.sin(Math.acos(t)),a1=n1(yg),o1=t1(yg),l1=t=>/^0[^.\s]+$/u.test(t);function YA(t){return typeof t=="number"?t===0:t!==null?t==="none"||t==="0"||l1(t):!0}const Fo=t=>Math.round(t*1e5)/1e5,Sg=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function KA(t){return t==null}const qA=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,Mg=(t,e)=>n=>!!(typeof n=="string"&&qA.test(n)&&n.startsWith(t)||e&&!KA(n)&&Object.prototype.hasOwnProperty.call(n,e)),c1=(t,e,n)=>i=>{if(typeof i!="string")return i;const[r,s,a,o]=i.match(Sg);return{[t]:parseFloat(r),[e]:parseFloat(s),[n]:parseFloat(a),alpha:o!==void 0?parseFloat(o):1}},ZA=t=>ar(0,255,t),Kd={...Ya,transform:t=>Math.round(ZA(t))},gs={test:Mg("rgb","red"),parse:c1("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:i=1})=>"rgba("+Kd.transform(t)+", "+Kd.transform(e)+", "+Kd.transform(n)+", "+Fo(cl.transform(i))+")"};function JA(t){let e="",n="",i="",r="";return t.length>5?(e=t.substring(1,3),n=t.substring(3,5),i=t.substring(5,7),r=t.substring(7,9)):(e=t.substring(1,2),n=t.substring(2,3),i=t.substring(3,4),r=t.substring(4,5),e+=e,n+=n,i+=i,r+=r),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:r?parseInt(r,16)/255:1}}const $h={test:Mg("#"),parse:JA,transform:gs.transform},ga={test:Mg("hsl","hue"),parse:c1("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:i=1})=>"hsla("+Math.round(t)+", "+Ni.transform(Fo(e))+", "+Ni.transform(Fo(n))+", "+Fo(cl.transform(i))+")"},ln={test:t=>gs.test(t)||$h.test(t)||ga.test(t),parse:t=>gs.test(t)?gs.parse(t):ga.test(t)?ga.parse(t):$h.parse(t),transform:t=>typeof t=="string"?t:t.hasOwnProperty("red")?gs.transform(t):ga.transform(t)},QA=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function eC(t){var e,n;return isNaN(t)&&typeof t=="string"&&(((e=t.match(Sg))===null||e===void 0?void 0:e.length)||0)+(((n=t.match(QA))===null||n===void 0?void 0:n.length)||0)>0}const u1="number",d1="color",tC="var",nC="var(",Fv="${}",iC=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function dl(t){const e=t.toString(),n=[],i={color:[],number:[],var:[]},r=[];let s=0;const o=e.replace(iC,l=>(ln.test(l)?(i.color.push(s),r.push(d1),n.push(ln.parse(l))):l.startsWith(nC)?(i.var.push(s),r.push(tC),n.push(l)):(i.number.push(s),r.push(u1),n.push(parseFloat(l))),++s,Fv)).split(Fv);return{values:n,split:o,indexes:i,types:r}}function f1(t){return dl(t).values}function h1(t){const{split:e,types:n}=dl(t),i=e.length;return r=>{let s="";for(let a=0;a<i;a++)if(s+=e[a],r[a]!==void 0){const o=n[a];o===u1?s+=Fo(r[a]):o===d1?s+=ln.transform(r[a]):s+=r[a]}return s}}const rC=t=>typeof t=="number"?0:t;function sC(t){const e=f1(t);return h1(t)(e.map(rC))}const Hr={test:eC,parse:f1,createTransformer:h1,getAnimatableNone:sC},aC=new Set(["brightness","contrast","saturate","opacity"]);function oC(t){const[e,n]=t.slice(0,-1).split("(");if(e==="drop-shadow")return t;const[i]=n.match(Sg)||[];if(!i)return t;const r=n.replace(i,"");let s=aC.has(e)?1:0;return i!==n&&(s*=100),e+"("+s+r+")"}const lC=/\b([a-z-]*)\(.*?\)/gu,Xh={...Hr,getAnimatableNone:t=>{const e=t.match(lC);return e?e.map(oC).join(" "):t}},cC={...ag,color:ln,backgroundColor:ln,outlineColor:ln,fill:ln,stroke:ln,borderColor:ln,borderTopColor:ln,borderRightColor:ln,borderBottomColor:ln,borderLeftColor:ln,filter:Xh,WebkitFilter:Xh},Eg=t=>cC[t];function p1(t,e){let n=Eg(t);return n!==Xh&&(n=Hr),n.getAnimatableNone?n.getAnimatableNone(e):void 0}const uC=new Set(["auto","none","0"]);function dC(t,e,n){let i=0,r;for(;i<t.length&&!r;){const s=t[i];typeof s=="string"&&!uC.has(s)&&dl(s).values.length&&(r=t[i]),i++}if(r&&n)for(const s of e)t[s]=p1(n,r)}const Ov=t=>t===Ya||t===ke,kv=(t,e)=>parseFloat(t.split(", ")[e]),Bv=(t,e)=>(n,{transform:i})=>{if(i==="none"||!i)return 0;const r=i.match(/^matrix3d\((.+)\)$/u);if(r)return kv(r[1],e);{const s=i.match(/^matrix\((.+)\)$/u);return s?kv(s[1],t):0}},fC=new Set(["x","y","z"]),hC=Xa.filter(t=>!fC.has(t));function pC(t){const e=[];return hC.forEach(n=>{const i=t.getValue(n);i!==void 0&&(e.push([n,i.get()]),i.set(n.startsWith("scale")?1:0))}),e}const Ba={width:({x:t},{paddingLeft:e="0",paddingRight:n="0"})=>t.max-t.min-parseFloat(e)-parseFloat(n),height:({y:t},{paddingTop:e="0",paddingBottom:n="0"})=>t.max-t.min-parseFloat(e)-parseFloat(n),top:(t,{top:e})=>parseFloat(e),left:(t,{left:e})=>parseFloat(e),bottom:({y:t},{top:e})=>parseFloat(e)+(t.max-t.min),right:({x:t},{left:e})=>parseFloat(e)+(t.max-t.min),x:Bv(4,13),y:Bv(5,14)};Ba.translateX=Ba.x;Ba.translateY=Ba.y;const Ss=new Set;let Yh=!1,Kh=!1;function m1(){if(Kh){const t=Array.from(Ss).filter(i=>i.needsMeasurement),e=new Set(t.map(i=>i.element)),n=new Map;e.forEach(i=>{const r=pC(i);r.length&&(n.set(i,r),i.render())}),t.forEach(i=>i.measureInitialState()),e.forEach(i=>{i.render();const r=n.get(i);r&&r.forEach(([s,a])=>{var o;(o=i.getValue(s))===null||o===void 0||o.set(a)})}),t.forEach(i=>i.measureEndState()),t.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}Kh=!1,Yh=!1,Ss.forEach(t=>t.complete()),Ss.clear()}function g1(){Ss.forEach(t=>{t.readKeyframes(),t.needsMeasurement&&(Kh=!0)})}function mC(){g1(),m1()}class Tg{constructor(e,n,i,r,s,a=!1){this.isComplete=!1,this.isAsync=!1,this.needsMeasurement=!1,this.isScheduled=!1,this.unresolvedKeyframes=[...e],this.onComplete=n,this.name=i,this.motionValue=r,this.element=s,this.isAsync=a}scheduleResolve(){this.isScheduled=!0,this.isAsync?(Ss.add(this),Yh||(Yh=!0,Mt.read(g1),Mt.resolveKeyframes(m1))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:n,element:i,motionValue:r}=this;for(let s=0;s<e.length;s++)if(e[s]===null)if(s===0){const a=r==null?void 0:r.get(),o=e[e.length-1];if(a!==void 0)e[0]=a;else if(i&&n){const l=i.readValue(n,o);l!=null&&(e[0]=l)}e[0]===void 0&&(e[0]=o),r&&a===void 0&&r.set(e[0])}else e[s]=e[s-1]}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(){this.isComplete=!0,this.onComplete(this.unresolvedKeyframes,this.finalKeyframe),Ss.delete(this)}cancel(){this.isComplete||(this.isScheduled=!1,Ss.delete(this))}resume(){this.isComplete||this.scheduleResolve()}}const v1=t=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t),gC=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function vC(t){const e=gC.exec(t);if(!e)return[,];const[,n,i,r]=e;return[`--${n??i}`,r]}function x1(t,e,n=1){const[i,r]=vC(t);if(!i)return;const s=window.getComputedStyle(e).getPropertyValue(i);if(s){const a=s.trim();return v1(a)?parseFloat(a):a}return sg(r)?x1(r,e,n+1):r}const _1=t=>e=>e.test(t),xC={test:t=>t==="auto",parse:t=>t},y1=[Ya,ke,Ni,Sr,oA,aA,xC],zv=t=>y1.find(_1(t));class S1 extends Tg{constructor(e,n,i,r,s){super(e,n,i,r,s,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:n,name:i}=this;if(!n||!n.current)return;super.readKeyframes();for(let l=0;l<e.length;l++){let c=e[l];if(typeof c=="string"&&(c=c.trim(),sg(c))){const u=x1(c,n.current);u!==void 0&&(e[l]=u),l===e.length-1&&(this.finalKeyframe=c)}}if(this.resolveNoneKeyframes(),!ZM.has(i)||e.length!==2)return;const[r,s]=e,a=zv(r),o=zv(s);if(a!==o)if(Ov(a)&&Ov(o))for(let l=0;l<e.length;l++){const c=e[l];typeof c=="string"&&(e[l]=parseFloat(c))}else this.needsMeasurement=!0}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:n}=this,i=[];for(let r=0;r<e.length;r++)YA(e[r])&&i.push(r);i.length&&dC(e,i,n)}measureInitialState(){const{element:e,unresolvedKeyframes:n,name:i}=this;if(!e||!e.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Ba[i](e.measureViewportBox(),window.getComputedStyle(e.current)),n[0]=this.measuredOrigin;const r=n[n.length-1];r!==void 0&&e.getValue(i,r).jump(r,!1)}measureEndState(){var e;const{element:n,name:i,unresolvedKeyframes:r}=this;if(!n||!n.current)return;const s=n.getValue(i);s&&s.jump(this.measuredOrigin,!1);const a=r.length-1,o=r[a];r[a]=Ba[i](n.measureViewportBox(),window.getComputedStyle(n.current)),o!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=o),!((e=this.removedTransforms)===null||e===void 0)&&e.length&&this.removedTransforms.forEach(([l,c])=>{n.getValue(l).set(c)}),this.resolveNoneKeyframes()}}const Vv=(t,e)=>e==="zIndex"?!1:!!(typeof t=="number"||Array.isArray(t)||typeof t=="string"&&(Hr.test(t)||t==="0")&&!t.startsWith("url("));function _C(t){const e=t[0];if(t.length===1)return!0;for(let n=0;n<t.length;n++)if(t[n]!==e)return!0}function yC(t,e,n,i){const r=t[0];if(r===null)return!1;if(e==="display"||e==="visibility")return!0;const s=t[t.length-1],a=Vv(r,e),o=Vv(s,e);return!a||!o?!1:_C(t)||(n==="spring"||hg(n))&&i}const SC=t=>t!==null;function fd(t,{repeat:e,repeatType:n="loop"},i){const r=t.filter(SC),s=e&&n!=="loop"&&e%2===1?0:r.length-1;return!s||i===void 0?r[s]:i}const MC=40;class M1{constructor({autoplay:e=!0,delay:n=0,type:i="keyframes",repeat:r=0,repeatDelay:s=0,repeatType:a="loop",...o}){this.isStopped=!1,this.hasAttemptedResolve=!1,this.createdAt=Li.now(),this.options={autoplay:e,delay:n,type:i,repeat:r,repeatDelay:s,repeatType:a,...o},this.updateFinishedPromise()}calcStartTime(){return this.resolvedAt?this.resolvedAt-this.createdAt>MC?this.resolvedAt:this.createdAt:this.createdAt}get resolved(){return!this._resolved&&!this.hasAttemptedResolve&&mC(),this._resolved}onKeyframesResolved(e,n){this.resolvedAt=Li.now(),this.hasAttemptedResolve=!0;const{name:i,type:r,velocity:s,delay:a,onComplete:o,onUpdate:l,isGenerator:c}=this.options;if(!c&&!yC(e,i,r,s))if(a)this.options.duration=0;else{l&&l(fd(e,this.options,n)),o&&o(),this.resolveFinishedPromise();return}const u=this.initPlayback(e,n);u!==!1&&(this._resolved={keyframes:e,finalKeyframe:n,...u},this.onPostResolved())}onPostResolved(){}then(e,n){return this.currentFinishedPromise.then(e,n)}flatten(){this.options.type="keyframes",this.options.ease="linear"}updateFinishedPromise(){this.currentFinishedPromise=new Promise(e=>{this.resolveFinishedPromise=e})}}const wt=(t,e,n)=>t+(e-t)*n;function qd(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function EC({hue:t,saturation:e,lightness:n,alpha:i}){t/=360,e/=100,n/=100;let r=0,s=0,a=0;if(!e)r=s=a=n;else{const o=n<.5?n*(1+e):n+e-n*e,l=2*n-o;r=qd(l,o,t+1/3),s=qd(l,o,t),a=qd(l,o,t-1/3)}return{red:Math.round(r*255),green:Math.round(s*255),blue:Math.round(a*255),alpha:i}}function Pu(t,e){return n=>n>0?e:t}const Zd=(t,e,n)=>{const i=t*t,r=n*(e*e-i)+i;return r<0?0:Math.sqrt(r)},TC=[$h,gs,ga],wC=t=>TC.find(e=>e.test(t));function Gv(t){const e=wC(t);if(!e)return!1;let n=e.parse(t);return e===ga&&(n=EC(n)),n}const Hv=(t,e)=>{const n=Gv(t),i=Gv(e);if(!n||!i)return Pu(t,e);const r={...n};return s=>(r.red=Zd(n.red,i.red,s),r.green=Zd(n.green,i.green,s),r.blue=Zd(n.blue,i.blue,s),r.alpha=wt(n.alpha,i.alpha,s),gs.transform(r))},bC=(t,e)=>n=>e(t(n)),wl=(...t)=>t.reduce(bC),qh=new Set(["none","hidden"]);function AC(t,e){return qh.has(t)?n=>n<=0?t:e:n=>n>=1?e:t}function CC(t,e){return n=>wt(t,e,n)}function wg(t){return typeof t=="number"?CC:typeof t=="string"?sg(t)?Pu:ln.test(t)?Hv:DC:Array.isArray(t)?E1:typeof t=="object"?ln.test(t)?Hv:RC:Pu}function E1(t,e){const n=[...t],i=n.length,r=t.map((s,a)=>wg(s)(s,e[a]));return s=>{for(let a=0;a<i;a++)n[a]=r[a](s);return n}}function RC(t,e){const n={...t,...e},i={};for(const r in n)t[r]!==void 0&&e[r]!==void 0&&(i[r]=wg(t[r])(t[r],e[r]));return r=>{for(const s in i)n[s]=i[s](r);return n}}function PC(t,e){var n;const i=[],r={color:0,var:0,number:0};for(let s=0;s<e.values.length;s++){const a=e.types[s],o=t.indexes[a][r[a]],l=(n=t.values[o])!==null&&n!==void 0?n:0;i[s]=l,r[a]++}return i}const DC=(t,e)=>{const n=Hr.createTransformer(e),i=dl(t),r=dl(e);return i.indexes.var.length===r.indexes.var.length&&i.indexes.color.length===r.indexes.color.length&&i.indexes.number.length>=r.indexes.number.length?qh.has(t)&&!r.values.length||qh.has(e)&&!i.values.length?AC(t,e):wl(E1(PC(i,r),r.values),n):Pu(t,e)};function T1(t,e,n){return typeof t=="number"&&typeof e=="number"&&typeof n=="number"?wt(t,e,n):wg(t)(t,e)}const NC=5;function w1(t,e,n){const i=Math.max(e-NC,0);return JM(n-t(i),e-i)}const Rt={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1},Jd=.001;function LC({duration:t=Rt.duration,bounce:e=Rt.bounce,velocity:n=Rt.velocity,mass:i=Rt.mass}){let r,s,a=1-e;a=ar(Rt.minDamping,Rt.maxDamping,a),t=ar(Rt.minDuration,Rt.maxDuration,Zi(t)),a<1?(r=c=>{const u=c*a,f=u*t,d=u-n,p=Zh(c,a),v=Math.exp(-f);return Jd-d/p*v},s=c=>{const f=c*a*t,d=f*n+n,p=Math.pow(a,2)*Math.pow(c,2)*t,v=Math.exp(-f),y=Zh(Math.pow(c,2),a);return(-r(c)+Jd>0?-1:1)*((d-p)*v)/y}):(r=c=>{const u=Math.exp(-c*t),f=(c-n)*t+1;return-Jd+u*f},s=c=>{const u=Math.exp(-c*t),f=(n-c)*(t*t);return u*f});const o=5/t,l=UC(r,s,o);if(t=qi(t),isNaN(l))return{stiffness:Rt.stiffness,damping:Rt.damping,duration:t};{const c=Math.pow(l,2)*i;return{stiffness:c,damping:a*2*Math.sqrt(i*c),duration:t}}}const IC=12;function UC(t,e,n){let i=n;for(let r=1;r<IC;r++)i=i-t(i)/e(i);return i}function Zh(t,e){return t*Math.sqrt(1-e*e)}const FC=["duration","bounce"],OC=["stiffness","damping","mass"];function jv(t,e){return e.some(n=>t[n]!==void 0)}function kC(t){let e={velocity:Rt.velocity,stiffness:Rt.stiffness,damping:Rt.damping,mass:Rt.mass,isResolvedFromDuration:!1,...t};if(!jv(t,OC)&&jv(t,FC))if(t.visualDuration){const n=t.visualDuration,i=2*Math.PI/(n*1.2),r=i*i,s=2*ar(.05,1,1-(t.bounce||0))*Math.sqrt(r);e={...e,mass:Rt.mass,stiffness:r,damping:s}}else{const n=LC(t);e={...e,...n,mass:Rt.mass},e.isResolvedFromDuration=!0}return e}function b1(t=Rt.visualDuration,e=Rt.bounce){const n=typeof t!="object"?{visualDuration:t,keyframes:[0,1],bounce:e}:t;let{restSpeed:i,restDelta:r}=n;const s=n.keyframes[0],a=n.keyframes[n.keyframes.length-1],o={done:!1,value:s},{stiffness:l,damping:c,mass:u,duration:f,velocity:d,isResolvedFromDuration:p}=kC({...n,velocity:-Zi(n.velocity||0)}),v=d||0,y=c/(2*Math.sqrt(l*u)),g=a-s,h=Zi(Math.sqrt(l/u)),m=Math.abs(g)<5;i||(i=m?Rt.restSpeed.granular:Rt.restSpeed.default),r||(r=m?Rt.restDelta.granular:Rt.restDelta.default);let _;if(y<1){const w=Zh(h,y);_=T=>{const R=Math.exp(-y*h*T);return a-R*((v+y*h*g)/w*Math.sin(w*T)+g*Math.cos(w*T))}}else if(y===1)_=w=>a-Math.exp(-h*w)*(g+(v+h*g)*w);else{const w=h*Math.sqrt(y*y-1);_=T=>{const R=Math.exp(-y*h*T),S=Math.min(w*T,300);return a-R*((v+y*h*g)*Math.sinh(S)+w*g*Math.cosh(S))/w}}const M={calculatedDuration:p&&f||null,next:w=>{const T=_(w);if(p)o.done=w>=f;else{let R=0;y<1&&(R=w===0?qi(v):w1(_,w,T));const S=Math.abs(R)<=i,A=Math.abs(a-T)<=r;o.done=S&&A}return o.value=o.done?a:T,o},toString:()=>{const w=Math.min(jM(M),Hh),T=WM(R=>M.next(w*R).value,w,30);return w+"ms "+T}};return M}function Wv({keyframes:t,velocity:e=0,power:n=.8,timeConstant:i=325,bounceDamping:r=10,bounceStiffness:s=500,modifyTarget:a,min:o,max:l,restDelta:c=.5,restSpeed:u}){const f=t[0],d={done:!1,value:f},p=S=>o!==void 0&&S<o||l!==void 0&&S>l,v=S=>o===void 0?l:l===void 0||Math.abs(o-S)<Math.abs(l-S)?o:l;let y=n*e;const g=f+y,h=a===void 0?g:a(g);h!==g&&(y=h-f);const m=S=>-y*Math.exp(-S/i),_=S=>h+m(S),M=S=>{const A=m(S),N=_(S);d.done=Math.abs(A)<=c,d.value=d.done?h:N};let w,T;const R=S=>{p(d.value)&&(w=S,T=b1({keyframes:[d.value,v(d.value)],velocity:w1(_,S,d.value),damping:r,stiffness:s,restDelta:c,restSpeed:u}))};return R(0),{calculatedDuration:null,next:S=>{let A=!1;return!T&&w===void 0&&(A=!0,M(S),R(S)),w!==void 0&&S>=w?T.next(S-w):(!A&&M(S),d)}}}const BC=Tl(.42,0,1,1),zC=Tl(0,0,.58,1),A1=Tl(.42,0,.58,1),VC=t=>Array.isArray(t)&&typeof t[0]!="number",GC={linear:Fn,easeIn:BC,easeInOut:A1,easeOut:zC,circIn:yg,circInOut:o1,circOut:a1,backIn:_g,backInOut:r1,backOut:i1,anticipate:s1},$v=t=>{if(pg(t)){TM(t.length===4);const[e,n,i,r]=t;return Tl(e,n,i,r)}else if(typeof t=="string")return GC[t];return t};function HC(t,e,n){const i=[],r=n||T1,s=t.length-1;for(let a=0;a<s;a++){let o=r(t[a],t[a+1]);if(e){const l=Array.isArray(e)?e[a]||Fn:e;o=wl(l,o)}i.push(o)}return i}function jC(t,e,{clamp:n=!0,ease:i,mixer:r}={}){const s=t.length;if(TM(s===e.length),s===1)return()=>e[0];if(s===2&&e[0]===e[1])return()=>e[1];const a=t[0]===t[1];t[0]>t[s-1]&&(t=[...t].reverse(),e=[...e].reverse());const o=HC(e,i,r),l=o.length,c=u=>{if(a&&u<t[0])return e[0];let f=0;if(l>1)for(;f<t.length-2&&!(u<t[f+1]);f++);const d=Oa(t[f],t[f+1],u);return o[f](d)};return n?u=>c(ar(t[0],t[s-1],u)):c}function WC(t,e){const n=t[t.length-1];for(let i=1;i<=e;i++){const r=Oa(0,e,i);t.push(wt(n,1,r))}}function $C(t){const e=[0];return WC(e,t.length-1),e}function XC(t,e){return t.map(n=>n*e)}function YC(t,e){return t.map(()=>e||A1).splice(0,t.length-1)}function Du({duration:t=300,keyframes:e,times:n,ease:i="easeInOut"}){const r=VC(i)?i.map($v):$v(i),s={done:!1,value:e[0]},a=XC(n&&n.length===e.length?n:$C(e),t),o=jC(a,e,{ease:Array.isArray(r)?r:YC(e,r)});return{calculatedDuration:t,next:l=>(s.value=o(l),s.done=l>=t,s)}}const KC=t=>{const e=({timestamp:n})=>t(n);return{start:()=>Mt.update(e,!0),stop:()=>Gr(e),now:()=>Jt.isProcessing?Jt.timestamp:Li.now()}},qC={decay:Wv,inertia:Wv,tween:Du,keyframes:Du,spring:b1},ZC=t=>t/100;class bg extends M1{constructor(e){super(e),this.holdTime=null,this.cancelTime=null,this.currentTime=0,this.playbackSpeed=1,this.pendingPlayState="running",this.startTime=null,this.state="idle",this.stop=()=>{if(this.resolver.cancel(),this.isStopped=!0,this.state==="idle")return;this.teardown();const{onStop:l}=this.options;l&&l()};const{name:n,motionValue:i,element:r,keyframes:s}=this.options,a=(r==null?void 0:r.KeyframeResolver)||Tg,o=(l,c)=>this.onKeyframesResolved(l,c);this.resolver=new a(s,o,n,i,r),this.resolver.scheduleResolve()}flatten(){super.flatten(),this._resolved&&Object.assign(this._resolved,this.initPlayback(this._resolved.keyframes))}initPlayback(e){const{type:n="keyframes",repeat:i=0,repeatDelay:r=0,repeatType:s,velocity:a=0}=this.options,o=hg(n)?n:qC[n]||Du;let l,c;o!==Du&&typeof e[0]!="number"&&(l=wl(ZC,T1(e[0],e[1])),e=[0,100]);const u=o({...this.options,keyframes:e});s==="mirror"&&(c=o({...this.options,keyframes:[...e].reverse(),velocity:-a})),u.calculatedDuration===null&&(u.calculatedDuration=jM(u));const{calculatedDuration:f}=u,d=f+r,p=d*(i+1)-r;return{generator:u,mirroredGenerator:c,mapPercentToKeyframes:l,calculatedDuration:f,resolvedDuration:d,totalDuration:p}}onPostResolved(){const{autoplay:e=!0}=this.options;this.play(),this.pendingPlayState==="paused"||!e?this.pause():this.state=this.pendingPlayState}tick(e,n=!1){const{resolved:i}=this;if(!i){const{keyframes:S}=this.options;return{done:!0,value:S[S.length-1]}}const{finalKeyframe:r,generator:s,mirroredGenerator:a,mapPercentToKeyframes:o,keyframes:l,calculatedDuration:c,totalDuration:u,resolvedDuration:f}=i;if(this.startTime===null)return s.next(0);const{delay:d,repeat:p,repeatType:v,repeatDelay:y,onUpdate:g}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-u/this.speed,this.startTime)),n?this.currentTime=e:this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=Math.round(e-this.startTime)*this.speed;const h=this.currentTime-d*(this.speed>=0?1:-1),m=this.speed>=0?h<0:h>u;this.currentTime=Math.max(h,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=u);let _=this.currentTime,M=s;if(p){const S=Math.min(this.currentTime,u)/f;let A=Math.floor(S),N=S%1;!N&&S>=1&&(N=1),N===1&&A--,A=Math.min(A,p+1),!!(A%2)&&(v==="reverse"?(N=1-N,y&&(N-=y/f)):v==="mirror"&&(M=a)),_=ar(0,1,N)*f}const w=m?{done:!1,value:l[0]}:M.next(_);o&&(w.value=o(w.value));let{done:T}=w;!m&&c!==null&&(T=this.speed>=0?this.currentTime>=u:this.currentTime<=0);const R=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&T);return R&&r!==void 0&&(w.value=fd(l,this.options,r)),g&&g(w.value),R&&this.finish(),w}get duration(){const{resolved:e}=this;return e?Zi(e.calculatedDuration):0}get time(){return Zi(this.currentTime)}set time(e){e=qi(e),this.currentTime=e,this.holdTime!==null||this.speed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.speed)}get speed(){return this.playbackSpeed}set speed(e){const n=this.playbackSpeed!==e;this.playbackSpeed=e,n&&(this.time=Zi(this.currentTime))}play(){if(this.resolver.isScheduled||this.resolver.resume(),!this._resolved){this.pendingPlayState="running";return}if(this.isStopped)return;const{driver:e=KC,onPlay:n,startTime:i}=this.options;this.driver||(this.driver=e(s=>this.tick(s))),n&&n();const r=this.driver.now();this.holdTime!==null?this.startTime=r-this.holdTime:this.startTime?this.state==="finished"&&(this.startTime=r):this.startTime=i??this.calcStartTime(),this.state==="finished"&&this.updateFinishedPromise(),this.cancelTime=this.startTime,this.holdTime=null,this.state="running",this.driver.start()}pause(){var e;if(!this._resolved){this.pendingPlayState="paused";return}this.state="paused",this.holdTime=(e=this.currentTime)!==null&&e!==void 0?e:0}complete(){this.state!=="running"&&this.play(),this.pendingPlayState=this.state="finished",this.holdTime=null}finish(){this.teardown(),this.state="finished";const{onComplete:e}=this.options;e&&e()}cancel(){this.cancelTime!==null&&this.tick(this.cancelTime),this.teardown(),this.updateFinishedPromise()}teardown(){this.state="idle",this.stopDriver(),this.resolveFinishedPromise(),this.updateFinishedPromise(),this.startTime=this.cancelTime=null,this.resolver.cancel()}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}}const JC=new Set(["opacity","clipPath","filter","transform"]);function QC(t,e,n,{delay:i=0,duration:r=300,repeat:s=0,repeatType:a="loop",ease:o="easeInOut",times:l}={}){const c={[e]:n};l&&(c.offset=l);const u=XM(o,r);return Array.isArray(u)&&(c.easing=u),t.animate(c,{delay:i,duration:r,easing:Array.isArray(u)?"linear":u,fill:"both",iterations:s+1,direction:a==="reverse"?"alternate":"normal"})}const eR=Jm(()=>Object.hasOwnProperty.call(Element.prototype,"animate")),Nu=10,tR=2e4;function nR(t){return hg(t.type)||t.type==="spring"||!$M(t.ease)}function iR(t,e){const n=new bg({...e,keyframes:t,repeat:0,delay:0,isGenerator:!0});let i={done:!1,value:t[0]};const r=[];let s=0;for(;!i.done&&s<tR;)i=n.sample(s),r.push(i.value),s+=Nu;return{times:void 0,keyframes:r,duration:s-Nu,ease:"linear"}}const C1={anticipate:s1,backInOut:r1,circInOut:o1};function rR(t){return t in C1}class Xv extends M1{constructor(e){super(e);const{name:n,motionValue:i,element:r,keyframes:s}=this.options;this.resolver=new S1(s,(a,o)=>this.onKeyframesResolved(a,o),n,i,r),this.resolver.scheduleResolve()}initPlayback(e,n){let{duration:i=300,times:r,ease:s,type:a,motionValue:o,name:l,startTime:c}=this.options;if(!o.owner||!o.owner.current)return!1;if(typeof s=="string"&&Ru()&&rR(s)&&(s=C1[s]),nR(this.options)){const{onComplete:f,onUpdate:d,motionValue:p,element:v,...y}=this.options,g=iR(e,y);e=g.keyframes,e.length===1&&(e[1]=e[0]),i=g.duration,r=g.times,s=g.ease,a="keyframes"}const u=QC(o.owner.current,l,e,{...this.options,duration:i,times:r,ease:s});return u.startTime=c??this.calcStartTime(),this.pendingTimeline?(Dv(u,this.pendingTimeline),this.pendingTimeline=void 0):u.onfinish=()=>{const{onComplete:f}=this.options;o.set(fd(e,this.options,n)),f&&f(),this.cancel(),this.resolveFinishedPromise()},{animation:u,duration:i,times:r,type:a,ease:s,keyframes:e}}get duration(){const{resolved:e}=this;if(!e)return 0;const{duration:n}=e;return Zi(n)}get time(){const{resolved:e}=this;if(!e)return 0;const{animation:n}=e;return Zi(n.currentTime||0)}set time(e){const{resolved:n}=this;if(!n)return;const{animation:i}=n;i.currentTime=qi(e)}get speed(){const{resolved:e}=this;if(!e)return 1;const{animation:n}=e;return n.playbackRate}set speed(e){const{resolved:n}=this;if(!n)return;const{animation:i}=n;i.playbackRate=e}get state(){const{resolved:e}=this;if(!e)return"idle";const{animation:n}=e;return n.playState}get startTime(){const{resolved:e}=this;if(!e)return null;const{animation:n}=e;return n.startTime}attachTimeline(e){if(!this._resolved)this.pendingTimeline=e;else{const{resolved:n}=this;if(!n)return Fn;const{animation:i}=n;Dv(i,e)}return Fn}play(){if(this.isStopped)return;const{resolved:e}=this;if(!e)return;const{animation:n}=e;n.playState==="finished"&&this.updateFinishedPromise(),n.play()}pause(){const{resolved:e}=this;if(!e)return;const{animation:n}=e;n.pause()}stop(){if(this.resolver.cancel(),this.isStopped=!0,this.state==="idle")return;this.resolveFinishedPromise(),this.updateFinishedPromise();const{resolved:e}=this;if(!e)return;const{animation:n,keyframes:i,duration:r,type:s,ease:a,times:o}=e;if(n.playState==="idle"||n.playState==="finished")return;if(this.time){const{motionValue:c,onUpdate:u,onComplete:f,element:d,...p}=this.options,v=new bg({...p,keyframes:i,duration:r,type:s,ease:a,times:o,isGenerator:!0}),y=qi(this.time);c.setWithVelocity(v.sample(y-Nu).value,v.sample(y).value,Nu)}const{onStop:l}=this.options;l&&l(),this.cancel()}complete(){const{resolved:e}=this;e&&e.animation.finish()}cancel(){const{resolved:e}=this;e&&e.animation.cancel()}static supports(e){const{motionValue:n,name:i,repeatDelay:r,repeatType:s,damping:a,type:o}=e;if(!n||!n.owner||!(n.owner.current instanceof HTMLElement))return!1;const{onUpdate:l,transformTemplate:c}=n.owner.getProps();return eR()&&i&&JC.has(i)&&!l&&!c&&!r&&s!=="mirror"&&a!==0&&o!=="inertia"}}const sR={type:"spring",stiffness:500,damping:25,restSpeed:10},aR=t=>({type:"spring",stiffness:550,damping:t===0?2*Math.sqrt(550):30,restSpeed:10}),oR={type:"keyframes",duration:.8},lR={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},cR=(t,{keyframes:e})=>e.length>2?oR:Ls.has(t)?t.startsWith("scale")?aR(e[1]):sR:lR;function uR({when:t,delay:e,delayChildren:n,staggerChildren:i,staggerDirection:r,repeat:s,repeatType:a,repeatDelay:o,from:l,elapsed:c,...u}){return!!Object.keys(u).length}const Ag=(t,e,n,i={},r,s)=>a=>{const o=fg(i,t)||{},l=o.delay||i.delay||0;let{elapsed:c=0}=i;c=c-qi(l);let u={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:e.getVelocity(),...o,delay:-c,onUpdate:d=>{e.set(d),o.onUpdate&&o.onUpdate(d)},onComplete:()=>{a(),o.onComplete&&o.onComplete()},name:t,motionValue:e,element:s?void 0:r};uR(o)||(u={...u,...cR(t,u)}),u.duration&&(u.duration=qi(u.duration)),u.repeatDelay&&(u.repeatDelay=qi(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let f=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(u.duration=0,u.delay===0&&(f=!0)),f&&!s&&e.get()!==void 0){const d=fd(u.keyframes,o);if(d!==void 0)return Mt.update(()=>{u.onUpdate(d),u.onComplete()}),new RA([])}return!s&&Xv.supports(u)?new Xv(u):new bg(u)};function dR({protectedKeys:t,needsAnimating:e},n){const i=t.hasOwnProperty(n)&&e[n]!==!0;return e[n]=!1,i}function R1(t,e,{delay:n=0,transitionOverride:i,type:r}={}){var s;let{transition:a=t.getDefaultTransition(),transitionEnd:o,...l}=e;i&&(a=i);const c=[],u=r&&t.animationState&&t.animationState.getState()[r];for(const f in l){const d=t.getValue(f,(s=t.latestValues[f])!==null&&s!==void 0?s:null),p=l[f];if(p===void 0||u&&dR(u,f))continue;const v={delay:n,...fg(a||{},f)};let y=!1;if(window.MotionHandoffAnimation){const h=QM(t);if(h){const m=window.MotionHandoffAnimation(h,f,Mt);m!==null&&(v.startTime=m,y=!0)}}Wh(t,f),d.start(Ag(f,d,p,t.shouldReduceMotion&&ZM.has(f)?{type:!1}:v,t,y));const g=d.animation;g&&c.push(g)}return o&&Promise.all(c).then(()=>{Mt.update(()=>{o&&HA(t,o)})}),c}function Jh(t,e,n={}){var i;const r=dd(t,e,n.type==="exit"?(i=t.presenceContext)===null||i===void 0?void 0:i.custom:void 0);let{transition:s=t.getDefaultTransition()||{}}=r||{};n.transitionOverride&&(s=n.transitionOverride);const a=r?()=>Promise.all(R1(t,r,n)):()=>Promise.resolve(),o=t.variantChildren&&t.variantChildren.size?(c=0)=>{const{delayChildren:u=0,staggerChildren:f,staggerDirection:d}=s;return fR(t,e,u+c,f,d,n)}:()=>Promise.resolve(),{when:l}=s;if(l){const[c,u]=l==="beforeChildren"?[a,o]:[o,a];return c().then(()=>u())}else return Promise.all([a(),o(n.delay)])}function fR(t,e,n=0,i=0,r=1,s){const a=[],o=(t.variantChildren.size-1)*i,l=r===1?(c=0)=>c*i:(c=0)=>o-c*i;return Array.from(t.variantChildren).sort(hR).forEach((c,u)=>{c.notify("AnimationStart",e),a.push(Jh(c,e,{...s,delay:n+l(u)}).then(()=>c.notify("AnimationComplete",e)))}),Promise.all(a)}function hR(t,e){return t.sortNodePosition(e)}function pR(t,e,n={}){t.notify("AnimationStart",e);let i;if(Array.isArray(e)){const r=e.map(s=>Jh(t,s,n));i=Promise.all(r)}else if(typeof e=="string")i=Jh(t,e,n);else{const r=typeof e=="function"?dd(t,e,n.custom):e;i=Promise.all(R1(t,r,n))}return i.then(()=>{t.notify("AnimationComplete",e)})}const mR=eg.length;function P1(t){if(!t)return;if(!t.isControllingVariants){const n=t.parent?P1(t.parent)||{}:{};return t.props.initial!==void 0&&(n.initial=t.props.initial),n}const e={};for(let n=0;n<mR;n++){const i=eg[n],r=t.props[i];(ll(r)||r===!1)&&(e[i]=r)}return e}const gR=[...Qm].reverse(),vR=Qm.length;function xR(t){return e=>Promise.all(e.map(({animation:n,options:i})=>pR(t,n,i)))}function _R(t){let e=xR(t),n=Yv(),i=!0;const r=l=>(c,u)=>{var f;const d=dd(t,u,l==="exit"?(f=t.presenceContext)===null||f===void 0?void 0:f.custom:void 0);if(d){const{transition:p,transitionEnd:v,...y}=d;c={...c,...y,...v}}return c};function s(l){e=l(t)}function a(l){const{props:c}=t,u=P1(t.parent)||{},f=[],d=new Set;let p={},v=1/0;for(let g=0;g<vR;g++){const h=gR[g],m=n[h],_=c[h]!==void 0?c[h]:u[h],M=ll(_),w=h===l?m.isActive:null;w===!1&&(v=g);let T=_===u[h]&&_!==c[h]&&M;if(T&&i&&t.manuallyAnimateOnMount&&(T=!1),m.protectedKeys={...p},!m.isActive&&w===null||!_&&!m.prevProp||cd(_)||typeof _=="boolean")continue;const R=yR(m.prevProp,_);let S=R||h===l&&m.isActive&&!T&&M||g>v&&M,A=!1;const N=Array.isArray(_)?_:[_];let D=N.reduce(r(h),{});w===!1&&(D={});const{prevResolvedValues:I={}}=m,X={...I,...D},G=B=>{S=!0,d.has(B)&&(A=!0,d.delete(B)),m.needsAnimating[B]=!0;const F=t.getValue(B);F&&(F.liveStyle=!1)};for(const B in X){const F=D[B],K=I[B];if(p.hasOwnProperty(B))continue;let Y=!1;Gh(F)&&Gh(K)?Y=!HM(F,K):Y=F!==K,Y?F!=null?G(B):d.add(B):F!==void 0&&d.has(B)?G(B):m.protectedKeys[B]=!0}m.prevProp=_,m.prevResolvedValues=D,m.isActive&&(p={...p,...D}),i&&t.blockInitialAnimation&&(S=!1),S&&(!(T&&R)||A)&&f.push(...N.map(B=>({animation:B,options:{type:h}})))}if(d.size){const g={};d.forEach(h=>{const m=t.getBaseTarget(h),_=t.getValue(h);_&&(_.liveStyle=!0),g[h]=m??null}),f.push({animation:g})}let y=!!f.length;return i&&(c.initial===!1||c.initial===c.animate)&&!t.manuallyAnimateOnMount&&(y=!1),i=!1,y?e(f):Promise.resolve()}function o(l,c){var u;if(n[l].isActive===c)return Promise.resolve();(u=t.variantChildren)===null||u===void 0||u.forEach(d=>{var p;return(p=d.animationState)===null||p===void 0?void 0:p.setActive(l,c)}),n[l].isActive=c;const f=a(l);for(const d in n)n[d].protectedKeys={};return f}return{animateChanges:a,setActive:o,setAnimateFunction:s,getState:()=>n,reset:()=>{n=Yv(),i=!0}}}function yR(t,e){return typeof e=="string"?e!==t:Array.isArray(e)?!HM(e,t):!1}function Qr(t=!1){return{isActive:t,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Yv(){return{animate:Qr(!0),whileInView:Qr(),whileHover:Qr(),whileTap:Qr(),whileDrag:Qr(),whileFocus:Qr(),exit:Qr()}}class qr{constructor(e){this.isMounted=!1,this.node=e}update(){}}class SR extends qr{constructor(e){super(e),e.animationState||(e.animationState=_R(e))}updateAnimationControlsSubscription(){const{animate:e}=this.node.getProps();cd(e)&&(this.unmountControls=e.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:e}=this.node.getProps(),{animate:n}=this.node.prevProps||{};e!==n&&this.updateAnimationControlsSubscription()}unmount(){var e;this.node.animationState.reset(),(e=this.unmountControls)===null||e===void 0||e.call(this)}}let MR=0;class ER extends qr{constructor(){super(...arguments),this.id=MR++}update(){if(!this.node.presenceContext)return;const{isPresent:e,onExitComplete:n}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||e===i)return;const r=this.node.animationState.setActive("exit",!e);n&&!e&&r.then(()=>n(this.id))}mount(){const{register:e}=this.node.presenceContext||{};e&&(this.unmount=e(this.id))}unmount(){}}const TR={animation:{Feature:SR},exit:{Feature:ER}};function fl(t,e,n,i={passive:!0}){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n)}function bl(t){return{point:{x:t.pageX,y:t.pageY}}}const wR=t=>e=>mg(e)&&t(e,bl(e));function Oo(t,e,n,i){return fl(t,e,wR(n),i)}const Kv=(t,e)=>Math.abs(t-e);function bR(t,e){const n=Kv(t.x,e.x),i=Kv(t.y,e.y);return Math.sqrt(n**2+i**2)}class D1{constructor(e,n,{transformPagePoint:i,contextWindow:r,dragSnapToOrigin:s=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const f=ef(this.lastMoveEventInfo,this.history),d=this.startEvent!==null,p=bR(f.offset,{x:0,y:0})>=3;if(!d&&!p)return;const{point:v}=f,{timestamp:y}=Jt;this.history.push({...v,timestamp:y});const{onStart:g,onMove:h}=this.handlers;d||(g&&g(this.lastMoveEvent,f),this.startEvent=this.lastMoveEvent),h&&h(this.lastMoveEvent,f)},this.handlePointerMove=(f,d)=>{this.lastMoveEvent=f,this.lastMoveEventInfo=Qd(d,this.transformPagePoint),Mt.update(this.updatePoint,!0)},this.handlePointerUp=(f,d)=>{this.end();const{onEnd:p,onSessionEnd:v,resumeAnimation:y}=this.handlers;if(this.dragSnapToOrigin&&y&&y(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const g=ef(f.type==="pointercancel"?this.lastMoveEventInfo:Qd(d,this.transformPagePoint),this.history);this.startEvent&&p&&p(f,g),v&&v(f,g)},!mg(e))return;this.dragSnapToOrigin=s,this.handlers=n,this.transformPagePoint=i,this.contextWindow=r||window;const a=bl(e),o=Qd(a,this.transformPagePoint),{point:l}=o,{timestamp:c}=Jt;this.history=[{...l,timestamp:c}];const{onSessionStart:u}=n;u&&u(e,ef(o,this.history)),this.removeListeners=wl(Oo(this.contextWindow,"pointermove",this.handlePointerMove),Oo(this.contextWindow,"pointerup",this.handlePointerUp),Oo(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),Gr(this.updatePoint)}}function Qd(t,e){return e?{point:e(t.point)}:t}function qv(t,e){return{x:t.x-e.x,y:t.y-e.y}}function ef({point:t},e){return{point:t,delta:qv(t,N1(e)),offset:qv(t,AR(e)),velocity:CR(e,.1)}}function AR(t){return t[0]}function N1(t){return t[t.length-1]}function CR(t,e){if(t.length<2)return{x:0,y:0};let n=t.length-1,i=null;const r=N1(t);for(;n>=0&&(i=t[n],!(r.timestamp-i.timestamp>qi(e)));)n--;if(!i)return{x:0,y:0};const s=Zi(r.timestamp-i.timestamp);if(s===0)return{x:0,y:0};const a={x:(r.x-i.x)/s,y:(r.y-i.y)/s};return a.x===1/0&&(a.x=0),a.y===1/0&&(a.y=0),a}const L1=1e-4,RR=1-L1,PR=1+L1,I1=.01,DR=0-I1,NR=0+I1;function kn(t){return t.max-t.min}function LR(t,e,n){return Math.abs(t-e)<=n}function Zv(t,e,n,i=.5){t.origin=i,t.originPoint=wt(e.min,e.max,t.origin),t.scale=kn(n)/kn(e),t.translate=wt(n.min,n.max,t.origin)-t.originPoint,(t.scale>=RR&&t.scale<=PR||isNaN(t.scale))&&(t.scale=1),(t.translate>=DR&&t.translate<=NR||isNaN(t.translate))&&(t.translate=0)}function ko(t,e,n,i){Zv(t.x,e.x,n.x,i?i.originX:void 0),Zv(t.y,e.y,n.y,i?i.originY:void 0)}function Jv(t,e,n){t.min=n.min+e.min,t.max=t.min+kn(e)}function IR(t,e,n){Jv(t.x,e.x,n.x),Jv(t.y,e.y,n.y)}function Qv(t,e,n){t.min=e.min-n.min,t.max=t.min+kn(e)}function Bo(t,e,n){Qv(t.x,e.x,n.x),Qv(t.y,e.y,n.y)}function UR(t,{min:e,max:n},i){return e!==void 0&&t<e?t=i?wt(e,t,i.min):Math.max(t,e):n!==void 0&&t>n&&(t=i?wt(n,t,i.max):Math.min(t,n)),t}function ex(t,e,n){return{min:e!==void 0?t.min+e:void 0,max:n!==void 0?t.max+n-(t.max-t.min):void 0}}function FR(t,{top:e,left:n,bottom:i,right:r}){return{x:ex(t.x,n,r),y:ex(t.y,e,i)}}function tx(t,e){let n=e.min-t.min,i=e.max-t.max;return e.max-e.min<t.max-t.min&&([n,i]=[i,n]),{min:n,max:i}}function OR(t,e){return{x:tx(t.x,e.x),y:tx(t.y,e.y)}}function kR(t,e){let n=.5;const i=kn(t),r=kn(e);return r>i?n=Oa(e.min,e.max-i,t.min):i>r&&(n=Oa(t.min,t.max-r,e.min)),ar(0,1,n)}function BR(t,e){const n={};return e.min!==void 0&&(n.min=e.min-t.min),e.max!==void 0&&(n.max=e.max-t.min),n}const Qh=.35;function zR(t=Qh){return t===!1?t=0:t===!0&&(t=Qh),{x:nx(t,"left","right"),y:nx(t,"top","bottom")}}function nx(t,e,n){return{min:ix(t,e),max:ix(t,n)}}function ix(t,e){return typeof t=="number"?t:t[e]||0}const rx=()=>({translate:0,scale:1,origin:0,originPoint:0}),va=()=>({x:rx(),y:rx()}),sx=()=>({min:0,max:0}),Ft=()=>({x:sx(),y:sx()});function jn(t){return[t("x"),t("y")]}function U1({top:t,left:e,right:n,bottom:i}){return{x:{min:e,max:n},y:{min:t,max:i}}}function VR({x:t,y:e}){return{top:e.min,right:t.max,bottom:e.max,left:t.min}}function GR(t,e){if(!e)return t;const n=e({x:t.left,y:t.top}),i=e({x:t.right,y:t.bottom});return{top:n.y,left:n.x,bottom:i.y,right:i.x}}function tf(t){return t===void 0||t===1}function ep({scale:t,scaleX:e,scaleY:n}){return!tf(t)||!tf(e)||!tf(n)}function as(t){return ep(t)||F1(t)||t.z||t.rotate||t.rotateX||t.rotateY||t.skewX||t.skewY}function F1(t){return ax(t.x)||ax(t.y)}function ax(t){return t&&t!=="0%"}function Lu(t,e,n){const i=t-n,r=e*i;return n+r}function ox(t,e,n,i,r){return r!==void 0&&(t=Lu(t,r,i)),Lu(t,n,i)+e}function tp(t,e=0,n=1,i,r){t.min=ox(t.min,e,n,i,r),t.max=ox(t.max,e,n,i,r)}function O1(t,{x:e,y:n}){tp(t.x,e.translate,e.scale,e.originPoint),tp(t.y,n.translate,n.scale,n.originPoint)}const lx=.999999999999,cx=1.0000000000001;function HR(t,e,n,i=!1){const r=n.length;if(!r)return;e.x=e.y=1;let s,a;for(let o=0;o<r;o++){s=n[o],a=s.projectionDelta;const{visualElement:l}=s.options;l&&l.props.style&&l.props.style.display==="contents"||(i&&s.options.layoutScroll&&s.scroll&&s!==s.root&&_a(t,{x:-s.scroll.offset.x,y:-s.scroll.offset.y}),a&&(e.x*=a.x.scale,e.y*=a.y.scale,O1(t,a)),i&&as(s.latestValues)&&_a(t,s.latestValues))}e.x<cx&&e.x>lx&&(e.x=1),e.y<cx&&e.y>lx&&(e.y=1)}function xa(t,e){t.min=t.min+e,t.max=t.max+e}function ux(t,e,n,i,r=.5){const s=wt(t.min,t.max,r);tp(t,e,n,s,i)}function _a(t,e){ux(t.x,e.x,e.scaleX,e.scale,e.originX),ux(t.y,e.y,e.scaleY,e.scale,e.originY)}function k1(t,e){return U1(GR(t.getBoundingClientRect(),e))}function jR(t,e,n){const i=k1(t,n),{scroll:r}=e;return r&&(xa(i.x,r.offset.x),xa(i.y,r.offset.y)),i}const B1=({current:t})=>t?t.ownerDocument.defaultView:null,WR=new WeakMap;class $R{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=Ft(),this.visualElement=e}start(e,{snapToCursor:n=!1}={}){const{presenceContext:i}=this.visualElement;if(i&&i.isPresent===!1)return;const r=u=>{const{dragSnapToOrigin:f}=this.getProps();f?this.pauseAnimation():this.stopAnimation(),n&&this.snapToCursor(bl(u).point)},s=(u,f)=>{const{drag:d,dragPropagation:p,onDragStart:v}=this.getProps();if(d&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=kA(d),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),jn(g=>{let h=this.getAxisMotionValue(g).get()||0;if(Ni.test(h)){const{projection:m}=this.visualElement;if(m&&m.layout){const _=m.layout.layoutBox[g];_&&(h=kn(_)*(parseFloat(h)/100))}}this.originPoint[g]=h}),v&&Mt.postRender(()=>v(u,f)),Wh(this.visualElement,"transform");const{animationState:y}=this.visualElement;y&&y.setActive("whileDrag",!0)},a=(u,f)=>{const{dragPropagation:d,dragDirectionLock:p,onDirectionLock:v,onDrag:y}=this.getProps();if(!d&&!this.openDragLock)return;const{offset:g}=f;if(p&&this.currentDirection===null){this.currentDirection=XR(g),this.currentDirection!==null&&v&&v(this.currentDirection);return}this.updateAxis("x",f.point,g),this.updateAxis("y",f.point,g),this.visualElement.render(),y&&y(u,f)},o=(u,f)=>this.stop(u,f),l=()=>jn(u=>{var f;return this.getAnimationState(u)==="paused"&&((f=this.getAxisMotionValue(u).animation)===null||f===void 0?void 0:f.play())}),{dragSnapToOrigin:c}=this.getProps();this.panSession=new D1(e,{onSessionStart:r,onStart:s,onMove:a,onSessionEnd:o,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:c,contextWindow:B1(this.visualElement)})}stop(e,n){const i=this.isDragging;if(this.cancel(),!i)return;const{velocity:r}=n;this.startAnimation(r);const{onDragEnd:s}=this.getProps();s&&Mt.postRender(()=>s(e,n))}cancel(){this.isDragging=!1;const{projection:e,animationState:n}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}updateAxis(e,n,i){const{drag:r}=this.getProps();if(!i||!nc(e,r,this.currentDirection))return;const s=this.getAxisMotionValue(e);let a=this.originPoint[e]+i[e];this.constraints&&this.constraints[e]&&(a=UR(a,this.constraints[e],this.elastic[e])),s.set(a)}resolveConstraints(){var e;const{dragConstraints:n,dragElastic:i}=this.getProps(),r=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,s=this.constraints;n&&ma(n)?this.constraints||(this.constraints=this.resolveRefConstraints()):n&&r?this.constraints=FR(r.layoutBox,n):this.constraints=!1,this.elastic=zR(i),s!==this.constraints&&r&&this.constraints&&!this.hasMutatedConstraints&&jn(a=>{this.constraints!==!1&&this.getAxisMotionValue(a)&&(this.constraints[a]=BR(r.layoutBox[a],this.constraints[a]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:n}=this.getProps();if(!e||!ma(e))return!1;const i=e.current,{projection:r}=this.visualElement;if(!r||!r.layout)return!1;const s=jR(i,r.root,this.visualElement.getTransformPagePoint());let a=OR(r.layout.layoutBox,s);if(n){const o=n(VR(a));this.hasMutatedConstraints=!!o,o&&(a=U1(o))}return a}startAnimation(e){const{drag:n,dragMomentum:i,dragElastic:r,dragTransition:s,dragSnapToOrigin:a,onDragTransitionEnd:o}=this.getProps(),l=this.constraints||{},c=jn(u=>{if(!nc(u,n,this.currentDirection))return;let f=l&&l[u]||{};a&&(f={min:0,max:0});const d=r?200:1e6,p=r?40:1e7,v={type:"inertia",velocity:i?e[u]:0,bounceStiffness:d,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...s,...f};return this.startAxisValueAnimation(u,v)});return Promise.all(c).then(o)}startAxisValueAnimation(e,n){const i=this.getAxisMotionValue(e);return Wh(this.visualElement,e),i.start(Ag(e,i,0,n,this.visualElement,!1))}stopAnimation(){jn(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){jn(e=>{var n;return(n=this.getAxisMotionValue(e).animation)===null||n===void 0?void 0:n.pause()})}getAnimationState(e){var n;return(n=this.getAxisMotionValue(e).animation)===null||n===void 0?void 0:n.state}getAxisMotionValue(e){const n=`_drag${e.toUpperCase()}`,i=this.visualElement.getProps(),r=i[n];return r||this.visualElement.getValue(e,(i.initial?i.initial[e]:void 0)||0)}snapToCursor(e){jn(n=>{const{drag:i}=this.getProps();if(!nc(n,i,this.currentDirection))return;const{projection:r}=this.visualElement,s=this.getAxisMotionValue(n);if(r&&r.layout){const{min:a,max:o}=r.layout.layoutBox[n];s.set(e[n]-wt(a,o,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:n}=this.getProps(),{projection:i}=this.visualElement;if(!ma(n)||!i||!this.constraints)return;this.stopAnimation();const r={x:0,y:0};jn(a=>{const o=this.getAxisMotionValue(a);if(o&&this.constraints!==!1){const l=o.get();r[a]=kR({min:l,max:l},this.constraints[a])}});const{transformTemplate:s}=this.visualElement.getProps();this.visualElement.current.style.transform=s?s({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.resolveConstraints(),jn(a=>{if(!nc(a,e,null))return;const o=this.getAxisMotionValue(a),{min:l,max:c}=this.constraints[a];o.set(wt(l,c,r[a]))})}addListeners(){if(!this.visualElement.current)return;WR.set(this.visualElement,this);const e=this.visualElement.current,n=Oo(e,"pointerdown",l=>{const{drag:c,dragListener:u=!0}=this.getProps();c&&u&&this.start(l)}),i=()=>{const{dragConstraints:l}=this.getProps();ma(l)&&l.current&&(this.constraints=this.resolveRefConstraints())},{projection:r}=this.visualElement,s=r.addEventListener("measure",i);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),Mt.read(i);const a=fl(window,"resize",()=>this.scalePositionWithinConstraints()),o=r.addEventListener("didUpdate",({delta:l,hasLayoutChanged:c})=>{this.isDragging&&c&&(jn(u=>{const f=this.getAxisMotionValue(u);f&&(this.originPoint[u]+=l[u].translate,f.set(f.get()+l[u].translate))}),this.visualElement.render())});return()=>{a(),n(),s(),o&&o()}}getProps(){const e=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:i=!1,dragPropagation:r=!1,dragConstraints:s=!1,dragElastic:a=Qh,dragMomentum:o=!0}=e;return{...e,drag:n,dragDirectionLock:i,dragPropagation:r,dragConstraints:s,dragElastic:a,dragMomentum:o}}}function nc(t,e,n){return(e===!0||e===t)&&(n===null||n===t)}function XR(t,e=10){let n=null;return Math.abs(t.y)>e?n="y":Math.abs(t.x)>e&&(n="x"),n}class YR extends qr{constructor(e){super(e),this.removeGroupControls=Fn,this.removeListeners=Fn,this.controls=new $R(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Fn}unmount(){this.removeGroupControls(),this.removeListeners()}}const dx=t=>(e,n)=>{t&&Mt.postRender(()=>t(e,n))};class KR extends qr{constructor(){super(...arguments),this.removePointerDownListener=Fn}onPointerDown(e){this.session=new D1(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:B1(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:n,onPan:i,onPanEnd:r}=this.node.getProps();return{onSessionStart:dx(e),onStart:dx(n),onMove:i,onEnd:(s,a)=>{delete this.session,r&&Mt.postRender(()=>r(s,a))}}}mount(){this.removePointerDownListener=Oo(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const Kc={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function fx(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const ao={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(ke.test(t))t=parseFloat(t);else return t;const n=fx(t,e.target.x),i=fx(t,e.target.y);return`${n}% ${i}%`}},qR={correct:(t,{treeScale:e,projectionDelta:n})=>{const i=t,r=Hr.parse(t);if(r.length>5)return i;const s=Hr.createTransformer(t),a=typeof r[0]!="number"?1:0,o=n.x.scale*e.x,l=n.y.scale*e.y;r[0+a]/=o,r[1+a]/=l;const c=wt(o,l,.5);return typeof r[2+a]=="number"&&(r[2+a]/=c),typeof r[3+a]=="number"&&(r[3+a]/=c),s(r)}};class ZR extends z.Component{componentDidMount(){const{visualElement:e,layoutGroup:n,switchLayoutGroup:i,layoutId:r}=this.props,{projection:s}=e;vA(JR),s&&(n.group&&n.group.add(s),i&&i.register&&r&&i.register(s),s.root.didUpdate(),s.addEventListener("animationComplete",()=>{this.safeToRemove()}),s.setOptions({...s.options,onExitComplete:()=>this.safeToRemove()})),Kc.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:n,visualElement:i,drag:r,isPresent:s}=this.props,a=i.projection;return a&&(a.isPresent=s,r||e.layoutDependency!==n||n===void 0?a.willUpdate():this.safeToRemove(),e.isPresent!==s&&(s?a.promote():a.relegate()||Mt.postRender(()=>{const o=a.getStack();(!o||!o.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),ng.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:n,switchLayoutGroup:i}=this.props,{projection:r}=e;r&&(r.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(r),i&&i.deregister&&i.deregister(r))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function z1(t){const[e,n]=MM(),i=z.useContext(Ym);return x.jsx(ZR,{...t,layoutGroup:i,switchLayoutGroup:z.useContext(PM),isPresent:e,safeToRemove:n})}const JR={borderRadius:{...ao,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:ao,borderTopRightRadius:ao,borderBottomLeftRadius:ao,borderBottomRightRadius:ao,boxShadow:qR};function QR(t,e,n){const i=un(t)?t:ul(t);return i.start(Ag("",i,e,n)),i.animation}function eP(t){return t instanceof SVGElement&&t.tagName!=="svg"}const tP=(t,e)=>t.depth-e.depth;class nP{constructor(){this.children=[],this.isDirty=!1}add(e){gg(this.children,e),this.isDirty=!0}remove(e){vg(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(tP),this.isDirty=!1,this.children.forEach(e)}}function iP(t,e){const n=Li.now(),i=({timestamp:r})=>{const s=r-n;s>=e&&(Gr(i),t(s-e))};return Mt.read(i,!0),()=>Gr(i)}const V1=["TopLeft","TopRight","BottomLeft","BottomRight"],rP=V1.length,hx=t=>typeof t=="string"?parseFloat(t):t,px=t=>typeof t=="number"||ke.test(t);function sP(t,e,n,i,r,s){r?(t.opacity=wt(0,n.opacity!==void 0?n.opacity:1,aP(i)),t.opacityExit=wt(e.opacity!==void 0?e.opacity:1,0,oP(i))):s&&(t.opacity=wt(e.opacity!==void 0?e.opacity:1,n.opacity!==void 0?n.opacity:1,i));for(let a=0;a<rP;a++){const o=`border${V1[a]}Radius`;let l=mx(e,o),c=mx(n,o);if(l===void 0&&c===void 0)continue;l||(l=0),c||(c=0),l===0||c===0||px(l)===px(c)?(t[o]=Math.max(wt(hx(l),hx(c),i),0),(Ni.test(c)||Ni.test(l))&&(t[o]+="%")):t[o]=c}(e.rotate||n.rotate)&&(t.rotate=wt(e.rotate||0,n.rotate||0,i))}function mx(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const aP=G1(0,.5,a1),oP=G1(.5,.95,Fn);function G1(t,e,n){return i=>i<t?0:i>e?1:n(Oa(t,e,i))}function gx(t,e){t.min=e.min,t.max=e.max}function Gn(t,e){gx(t.x,e.x),gx(t.y,e.y)}function vx(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function xx(t,e,n,i,r){return t-=e,t=Lu(t,1/n,i),r!==void 0&&(t=Lu(t,1/r,i)),t}function lP(t,e=0,n=1,i=.5,r,s=t,a=t){if(Ni.test(e)&&(e=parseFloat(e),e=wt(a.min,a.max,e/100)-a.min),typeof e!="number")return;let o=wt(s.min,s.max,i);t===s&&(o-=e),t.min=xx(t.min,e,n,o,r),t.max=xx(t.max,e,n,o,r)}function _x(t,e,[n,i,r],s,a){lP(t,e[n],e[i],e[r],e.scale,s,a)}const cP=["x","scaleX","originX"],uP=["y","scaleY","originY"];function yx(t,e,n,i){_x(t.x,e,cP,n?n.x:void 0,i?i.x:void 0),_x(t.y,e,uP,n?n.y:void 0,i?i.y:void 0)}function Sx(t){return t.translate===0&&t.scale===1}function H1(t){return Sx(t.x)&&Sx(t.y)}function Mx(t,e){return t.min===e.min&&t.max===e.max}function dP(t,e){return Mx(t.x,e.x)&&Mx(t.y,e.y)}function Ex(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function j1(t,e){return Ex(t.x,e.x)&&Ex(t.y,e.y)}function Tx(t){return kn(t.x)/kn(t.y)}function wx(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class fP{constructor(){this.members=[]}add(e){gg(this.members,e),e.scheduleRender()}remove(e){if(vg(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(e){const n=this.members.findIndex(r=>e===r);if(n===0)return!1;let i;for(let r=n;r>=0;r--){const s=this.members[r];if(s.isPresent!==!1){i=s;break}}return i?(this.promote(i),!0):!1}promote(e,n){const i=this.lead;if(e!==i&&(this.prevLead=i,this.lead=e,e.show(),i)){i.instance&&i.scheduleRender(),e.scheduleRender(),e.resumeFrom=i,n&&(e.resumeFrom.preserveOpacity=!0),i.snapshot&&(e.snapshot=i.snapshot,e.snapshot.latestValues=i.animationValues||i.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:r}=e.options;r===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:n,resumingFrom:i}=e;n.onExitComplete&&n.onExitComplete(),i&&i.options.onExitComplete&&i.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function hP(t,e,n){let i="";const r=t.x.translate/e.x,s=t.y.translate/e.y,a=(n==null?void 0:n.z)||0;if((r||s||a)&&(i=`translate3d(${r}px, ${s}px, ${a}px) `),(e.x!==1||e.y!==1)&&(i+=`scale(${1/e.x}, ${1/e.y}) `),n){const{transformPerspective:c,rotate:u,rotateX:f,rotateY:d,skewX:p,skewY:v}=n;c&&(i=`perspective(${c}px) ${i}`),u&&(i+=`rotate(${u}deg) `),f&&(i+=`rotateX(${f}deg) `),d&&(i+=`rotateY(${d}deg) `),p&&(i+=`skewX(${p}deg) `),v&&(i+=`skewY(${v}deg) `)}const o=t.x.scale*e.x,l=t.y.scale*e.y;return(o!==1||l!==1)&&(i+=`scale(${o}, ${l})`),i||"none"}const os={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0},Mo=typeof window<"u"&&window.MotionDebug!==void 0,nf=["","X","Y","Z"],pP={visibility:"hidden"},bx=1e3;let mP=0;function rf(t,e,n,i){const{latestValues:r}=e;r[t]&&(n[t]=r[t],e.setStaticValue(t,0),i&&(i[t]=0))}function W1(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const n=QM(e);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:r,layoutId:s}=t.options;window.MotionCancelOptimisedAnimation(n,"transform",Mt,!(r||s))}const{parent:i}=t;i&&!i.hasCheckedOptimisedAppear&&W1(i)}function $1({attachResizeListener:t,defaultParent:e,measureScroll:n,checkIsScrollRoot:i,resetTransform:r}){return class{constructor(a={},o=e==null?void 0:e()){this.id=mP++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,Mo&&(os.totalNodes=os.resolvedTargetDeltas=os.recalculatedProjection=0),this.nodes.forEach(xP),this.nodes.forEach(EP),this.nodes.forEach(TP),this.nodes.forEach(_P),Mo&&window.MotionDebug.record(os)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=a,this.root=o?o.root||o:this,this.path=o?[...o.path,o]:[],this.parent=o,this.depth=o?o.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new nP)}addEventListener(a,o){return this.eventHandlers.has(a)||this.eventHandlers.set(a,new xg),this.eventHandlers.get(a).add(o)}notifyListeners(a,...o){const l=this.eventHandlers.get(a);l&&l.notify(...o)}hasListeners(a){return this.eventHandlers.has(a)}mount(a,o=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=eP(a),this.instance=a;const{layoutId:l,layout:c,visualElement:u}=this.options;if(u&&!u.current&&u.mount(a),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),o&&(c||l)&&(this.isLayoutDirty=!0),t){let f;const d=()=>this.root.updateBlockedByResize=!1;t(a,()=>{this.root.updateBlockedByResize=!0,f&&f(),f=iP(d,250),Kc.hasAnimatedSinceResize&&(Kc.hasAnimatedSinceResize=!1,this.nodes.forEach(Cx))})}l&&this.root.registerSharedNode(l,this),this.options.animate!==!1&&u&&(l||c)&&this.addEventListener("didUpdate",({delta:f,hasLayoutChanged:d,hasRelativeTargetChanged:p,layout:v})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const y=this.options.transition||u.getDefaultTransition()||RP,{onLayoutAnimationStart:g,onLayoutAnimationComplete:h}=u.getProps(),m=!this.targetLayout||!j1(this.targetLayout,v)||p,_=!d&&p;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||_||d&&(m||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(f,_);const M={...fg(y,"layout"),onPlay:g,onComplete:h};(u.shouldReduceMotion||this.options.layoutRoot)&&(M.delay=0,M.type=!1),this.startAnimation(M)}else d||Cx(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=v})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const a=this.getStack();a&&a.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,Gr(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(wP),this.animationId++)}getTransformTemplate(){const{visualElement:a}=this.options;return a&&a.getProps().transformTemplate}willUpdate(a=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&W1(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const f=this.path[u];f.shouldResetTransform=!0,f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:o,layout:l}=this.options;if(o===void 0&&!l)return;const c=this.getTransformTemplate();this.prevTransformTemplateValue=c?c(this.latestValues,""):void 0,this.updateSnapshot(),a&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(Ax);return}this.isUpdating||this.nodes.forEach(SP),this.isUpdating=!1,this.nodes.forEach(MP),this.nodes.forEach(gP),this.nodes.forEach(vP),this.clearAllSnapshots();const o=Li.now();Jt.delta=ar(0,1e3/60,o-Jt.timestamp),Jt.timestamp=o,Jt.isProcessing=!0,Xd.update.process(Jt),Xd.preRender.process(Jt),Xd.render.process(Jt),Jt.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,ng.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(yP),this.sharedNodes.forEach(bP)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,Mt.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){Mt.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure())}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const a=this.layout;this.layout=this.measure(!1),this.layoutCorrected=Ft(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:o}=this.options;o&&o.notify("LayoutMeasure",this.layout.layoutBox,a?a.layoutBox:void 0)}updateScroll(a="measure"){let o=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===a&&(o=!1),o){const l=i(this.instance);this.scroll={animationId:this.root.animationId,phase:a,isRoot:l,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:l}}}resetTransform(){if(!r)return;const a=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,o=this.projectionDelta&&!H1(this.projectionDelta),l=this.getTransformTemplate(),c=l?l(this.latestValues,""):void 0,u=c!==this.prevTransformTemplateValue;a&&(o||as(this.latestValues)||u)&&(r(this.instance,c),this.shouldResetTransform=!1,this.scheduleRender())}measure(a=!0){const o=this.measurePageBox();let l=this.removeElementScroll(o);return a&&(l=this.removeTransform(l)),PP(l),{animationId:this.root.animationId,measuredBox:o,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){var a;const{visualElement:o}=this.options;if(!o)return Ft();const l=o.measureViewportBox();if(!(((a=this.scroll)===null||a===void 0?void 0:a.wasRoot)||this.path.some(DP))){const{scroll:u}=this.root;u&&(xa(l.x,u.offset.x),xa(l.y,u.offset.y))}return l}removeElementScroll(a){var o;const l=Ft();if(Gn(l,a),!((o=this.scroll)===null||o===void 0)&&o.wasRoot)return l;for(let c=0;c<this.path.length;c++){const u=this.path[c],{scroll:f,options:d}=u;u!==this.root&&f&&d.layoutScroll&&(f.wasRoot&&Gn(l,a),xa(l.x,f.offset.x),xa(l.y,f.offset.y))}return l}applyTransform(a,o=!1){const l=Ft();Gn(l,a);for(let c=0;c<this.path.length;c++){const u=this.path[c];!o&&u.options.layoutScroll&&u.scroll&&u!==u.root&&_a(l,{x:-u.scroll.offset.x,y:-u.scroll.offset.y}),as(u.latestValues)&&_a(l,u.latestValues)}return as(this.latestValues)&&_a(l,this.latestValues),l}removeTransform(a){const o=Ft();Gn(o,a);for(let l=0;l<this.path.length;l++){const c=this.path[l];if(!c.instance||!as(c.latestValues))continue;ep(c.latestValues)&&c.updateSnapshot();const u=Ft(),f=c.measurePageBox();Gn(u,f),yx(o,c.latestValues,c.snapshot?c.snapshot.layoutBox:void 0,u)}return as(this.latestValues)&&yx(o,this.latestValues),o}setTargetDelta(a){this.targetDelta=a,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(a){this.options={...this.options,...a,crossfade:a.crossfade!==void 0?a.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==Jt.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(a=!1){var o;const l=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=l.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=l.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=l.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==l;if(!(a||c&&this.isSharedProjectionDirty||this.isProjectionDirty||!((o=this.parent)===null||o===void 0)&&o.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:f,layoutId:d}=this.options;if(!(!this.layout||!(f||d))){if(this.resolvedRelativeTargetAt=Jt.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Ft(),this.relativeTargetOrigin=Ft(),Bo(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),Gn(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)){if(this.target||(this.target=Ft(),this.targetWithTransforms=Ft()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),IR(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):Gn(this.target,this.layout.layoutBox),O1(this.target,this.targetDelta)):Gn(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Ft(),this.relativeTargetOrigin=Ft(),Bo(this.relativeTargetOrigin,this.target,p.target),Gn(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}Mo&&os.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(!(!this.parent||ep(this.parent.latestValues)||F1(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var a;const o=this.getLead(),l=!!this.resumingFrom||this!==o;let c=!0;if((this.isProjectionDirty||!((a=this.parent)===null||a===void 0)&&a.isProjectionDirty)&&(c=!1),l&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===Jt.timestamp&&(c=!1),c)return;const{layout:u,layoutId:f}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(u||f))return;Gn(this.layoutCorrected,this.layout.layoutBox);const d=this.treeScale.x,p=this.treeScale.y;HR(this.layoutCorrected,this.treeScale,this.path,l),o.layout&&!o.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(o.target=o.layout.layoutBox,o.targetWithTransforms=Ft());const{target:v}=o;if(!v){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(vx(this.prevProjectionDelta.x,this.projectionDelta.x),vx(this.prevProjectionDelta.y,this.projectionDelta.y)),ko(this.projectionDelta,this.layoutCorrected,v,this.latestValues),(this.treeScale.x!==d||this.treeScale.y!==p||!wx(this.projectionDelta.x,this.prevProjectionDelta.x)||!wx(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",v)),Mo&&os.recalculatedProjection++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(a=!0){var o;if((o=this.options.visualElement)===null||o===void 0||o.scheduleRender(),a){const l=this.getStack();l&&l.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=va(),this.projectionDelta=va(),this.projectionDeltaWithTransform=va()}setAnimationOrigin(a,o=!1){const l=this.snapshot,c=l?l.latestValues:{},u={...this.latestValues},f=va();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!o;const d=Ft(),p=l?l.source:void 0,v=this.layout?this.layout.source:void 0,y=p!==v,g=this.getStack(),h=!g||g.members.length<=1,m=!!(y&&!h&&this.options.crossfade===!0&&!this.path.some(CP));this.animationProgress=0;let _;this.mixTargetDelta=M=>{const w=M/1e3;Rx(f.x,a.x,w),Rx(f.y,a.y,w),this.setTargetDelta(f),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Bo(d,this.layout.layoutBox,this.relativeParent.layout.layoutBox),AP(this.relativeTarget,this.relativeTargetOrigin,d,w),_&&dP(this.relativeTarget,_)&&(this.isProjectionDirty=!1),_||(_=Ft()),Gn(_,this.relativeTarget)),y&&(this.animationValues=u,sP(u,c,this.latestValues,w,m,h)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=w},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(a){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(Gr(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=Mt.update(()=>{Kc.hasAnimatedSinceResize=!0,this.currentAnimation=QR(0,bx,{...a,onUpdate:o=>{this.mixTargetDelta(o),a.onUpdate&&a.onUpdate(o)},onComplete:()=>{a.onComplete&&a.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const a=this.getStack();a&&a.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(bx),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const a=this.getLead();let{targetWithTransforms:o,target:l,layout:c,latestValues:u}=a;if(!(!o||!l||!c)){if(this!==a&&this.layout&&c&&X1(this.options.animationType,this.layout.layoutBox,c.layoutBox)){l=this.target||Ft();const f=kn(this.layout.layoutBox.x);l.x.min=a.target.x.min,l.x.max=l.x.min+f;const d=kn(this.layout.layoutBox.y);l.y.min=a.target.y.min,l.y.max=l.y.min+d}Gn(o,l),_a(o,u),ko(this.projectionDeltaWithTransform,this.layoutCorrected,o,u)}}registerSharedNode(a,o){this.sharedNodes.has(a)||this.sharedNodes.set(a,new fP),this.sharedNodes.get(a).add(o);const c=o.options.initialPromotionConfig;o.promote({transition:c?c.transition:void 0,preserveFollowOpacity:c&&c.shouldPreserveFollowOpacity?c.shouldPreserveFollowOpacity(o):void 0})}isLead(){const a=this.getStack();return a?a.lead===this:!0}getLead(){var a;const{layoutId:o}=this.options;return o?((a=this.getStack())===null||a===void 0?void 0:a.lead)||this:this}getPrevLead(){var a;const{layoutId:o}=this.options;return o?(a=this.getStack())===null||a===void 0?void 0:a.prevLead:void 0}getStack(){const{layoutId:a}=this.options;if(a)return this.root.sharedNodes.get(a)}promote({needsReset:a,transition:o,preserveFollowOpacity:l}={}){const c=this.getStack();c&&c.promote(this,l),a&&(this.projectionDelta=void 0,this.needsReset=!0),o&&this.setOptions({transition:o})}relegate(){const a=this.getStack();return a?a.relegate(this):!1}resetSkewAndRotation(){const{visualElement:a}=this.options;if(!a)return;let o=!1;const{latestValues:l}=a;if((l.z||l.rotate||l.rotateX||l.rotateY||l.rotateZ||l.skewX||l.skewY)&&(o=!0),!o)return;const c={};l.z&&rf("z",a,c,this.animationValues);for(let u=0;u<nf.length;u++)rf(`rotate${nf[u]}`,a,c,this.animationValues),rf(`skew${nf[u]}`,a,c,this.animationValues);a.render();for(const u in c)a.setStaticValue(u,c[u]),this.animationValues&&(this.animationValues[u]=c[u]);a.scheduleRender()}getProjectionStyles(a){var o,l;if(!this.instance||this.isSVG)return;if(!this.isVisible)return pP;const c={visibility:""},u=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,c.opacity="",c.pointerEvents=Xc(a==null?void 0:a.pointerEvents)||"",c.transform=u?u(this.latestValues,""):"none",c;const f=this.getLead();if(!this.projectionDelta||!this.layout||!f.target){const y={};return this.options.layoutId&&(y.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,y.pointerEvents=Xc(a==null?void 0:a.pointerEvents)||""),this.hasProjected&&!as(this.latestValues)&&(y.transform=u?u({},""):"none",this.hasProjected=!1),y}const d=f.animationValues||f.latestValues;this.applyTransformsToTarget(),c.transform=hP(this.projectionDeltaWithTransform,this.treeScale,d),u&&(c.transform=u(d,c.transform));const{x:p,y:v}=this.projectionDelta;c.transformOrigin=`${p.origin*100}% ${v.origin*100}% 0`,f.animationValues?c.opacity=f===this?(l=(o=d.opacity)!==null&&o!==void 0?o:this.latestValues.opacity)!==null&&l!==void 0?l:1:this.preserveOpacity?this.latestValues.opacity:d.opacityExit:c.opacity=f===this?d.opacity!==void 0?d.opacity:"":d.opacityExit!==void 0?d.opacityExit:0;for(const y in Cu){if(d[y]===void 0)continue;const{correct:g,applyTo:h}=Cu[y],m=c.transform==="none"?d[y]:g(d[y],f);if(h){const _=h.length;for(let M=0;M<_;M++)c[h[M]]=m}else c[y]=m}return this.options.layoutId&&(c.pointerEvents=f===this?Xc(a==null?void 0:a.pointerEvents)||"":"none"),c}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(a=>{var o;return(o=a.currentAnimation)===null||o===void 0?void 0:o.stop()}),this.root.nodes.forEach(Ax),this.root.sharedNodes.clear()}}}function gP(t){t.updateLayout()}function vP(t){var e;const n=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&n&&t.hasListeners("didUpdate")){const{layoutBox:i,measuredBox:r}=t.layout,{animationType:s}=t.options,a=n.source!==t.layout.source;s==="size"?jn(f=>{const d=a?n.measuredBox[f]:n.layoutBox[f],p=kn(d);d.min=i[f].min,d.max=d.min+p}):X1(s,n.layoutBox,i)&&jn(f=>{const d=a?n.measuredBox[f]:n.layoutBox[f],p=kn(i[f]);d.max=d.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[f].max=t.relativeTarget[f].min+p)});const o=va();ko(o,i,n.layoutBox);const l=va();a?ko(l,t.applyTransform(r,!0),n.measuredBox):ko(l,i,n.layoutBox);const c=!H1(o);let u=!1;if(!t.resumeFrom){const f=t.getClosestProjectingParent();if(f&&!f.resumeFrom){const{snapshot:d,layout:p}=f;if(d&&p){const v=Ft();Bo(v,n.layoutBox,d.layoutBox);const y=Ft();Bo(y,i,p.layoutBox),j1(v,y)||(u=!0),f.options.layoutRoot&&(t.relativeTarget=y,t.relativeTargetOrigin=v,t.relativeParent=f)}}}t.notifyListeners("didUpdate",{layout:i,snapshot:n,delta:l,layoutDelta:o,hasLayoutChanged:c,hasRelativeTargetChanged:u})}else if(t.isLead()){const{onExitComplete:i}=t.options;i&&i()}t.options.transition=void 0}function xP(t){Mo&&os.totalNodes++,t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function _P(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function yP(t){t.clearSnapshot()}function Ax(t){t.clearMeasurements()}function SP(t){t.isLayoutDirty=!1}function MP(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function Cx(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function EP(t){t.resolveTargetDelta()}function TP(t){t.calcProjection()}function wP(t){t.resetSkewAndRotation()}function bP(t){t.removeLeadSnapshot()}function Rx(t,e,n){t.translate=wt(e.translate,0,n),t.scale=wt(e.scale,1,n),t.origin=e.origin,t.originPoint=e.originPoint}function Px(t,e,n,i){t.min=wt(e.min,n.min,i),t.max=wt(e.max,n.max,i)}function AP(t,e,n,i){Px(t.x,e.x,n.x,i),Px(t.y,e.y,n.y,i)}function CP(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const RP={duration:.45,ease:[.4,0,.1,1]},Dx=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),Nx=Dx("applewebkit/")&&!Dx("chrome/")?Math.round:Fn;function Lx(t){t.min=Nx(t.min),t.max=Nx(t.max)}function PP(t){Lx(t.x),Lx(t.y)}function X1(t,e,n){return t==="position"||t==="preserve-aspect"&&!LR(Tx(e),Tx(n),.2)}function DP(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const NP=$1({attachResizeListener:(t,e)=>fl(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),sf={current:void 0},Y1=$1({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!sf.current){const t=new NP({});t.mount(window),t.setOptions({layoutScroll:!0}),sf.current=t}return sf.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),LP={pan:{Feature:KR},drag:{Feature:YR,ProjectionNode:Y1,MeasureLayout:z1}};function Ix(t,e,n){const{props:i}=t;t.animationState&&i.whileHover&&t.animationState.setActive("whileHover",n==="Start");const r="onHover"+n,s=i[r];s&&Mt.postRender(()=>s(e,bl(e)))}class IP extends qr{mount(){const{current:e}=this.node;e&&(this.unmount=LA(e,n=>(Ix(this.node,n,"Start"),i=>Ix(this.node,i,"End"))))}unmount(){}}class UP extends qr{constructor(){super(...arguments),this.isActive=!1}onFocus(){let e=!1;try{e=this.node.current.matches(":focus-visible")}catch{e=!0}!e||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=wl(fl(this.node.current,"focus",()=>this.onFocus()),fl(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function Ux(t,e,n){const{props:i}=t;t.animationState&&i.whileTap&&t.animationState.setActive("whileTap",n==="Start");const r="onTap"+(n==="End"?"":n),s=i[r];s&&Mt.postRender(()=>s(e,bl(e)))}class FP extends qr{mount(){const{current:e}=this.node;e&&(this.unmount=OA(e,n=>(Ux(this.node,n,"Start"),(i,{success:r})=>Ux(this.node,i,r?"End":"Cancel")),{useGlobalTarget:this.node.props.globalTapTarget}))}unmount(){}}const np=new WeakMap,af=new WeakMap,OP=t=>{const e=np.get(t.target);e&&e(t)},kP=t=>{t.forEach(OP)};function BP({root:t,...e}){const n=t||document;af.has(n)||af.set(n,{});const i=af.get(n),r=JSON.stringify(e);return i[r]||(i[r]=new IntersectionObserver(kP,{root:t,...e})),i[r]}function zP(t,e,n){const i=BP(e);return np.set(t,n),i.observe(t),()=>{np.delete(t),i.unobserve(t)}}const VP={some:0,all:1};class GP extends qr{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.unmount();const{viewport:e={}}=this.node.getProps(),{root:n,margin:i,amount:r="some",once:s}=e,a={root:n?n.current:void 0,rootMargin:i,threshold:typeof r=="number"?r:VP[r]},o=l=>{const{isIntersecting:c}=l;if(this.isInView===c||(this.isInView=c,s&&!c&&this.hasEnteredView))return;c&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",c);const{onViewportEnter:u,onViewportLeave:f}=this.node.getProps(),d=c?u:f;d&&d(l)};return zP(this.node.current,a,o)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:e,prevProps:n}=this.node;["amount","margin","root"].some(HP(e,n))&&this.startObserver()}unmount(){}}function HP({viewport:t={}},{viewport:e={}}={}){return n=>t[n]!==e[n]}const jP={inView:{Feature:GP},tap:{Feature:FP},focus:{Feature:UP},hover:{Feature:IP}},WP={layout:{ProjectionNode:Y1,MeasureLayout:z1}},ip={current:null},K1={current:!1};function $P(){if(K1.current=!0,!!Zm)if(window.matchMedia){const t=window.matchMedia("(prefers-reduced-motion)"),e=()=>ip.current=t.matches;t.addListener(e),e()}else ip.current=!1}const XP=[...y1,ln,Hr],YP=t=>XP.find(_1(t)),Fx=new WeakMap;function KP(t,e,n){for(const i in e){const r=e[i],s=n[i];if(un(r))t.addValue(i,r);else if(un(s))t.addValue(i,ul(r,{owner:t}));else if(s!==r)if(t.hasValue(i)){const a=t.getValue(i);a.liveStyle===!0?a.jump(r):a.hasAnimated||a.set(r)}else{const a=t.getStaticValue(i);t.addValue(i,ul(a!==void 0?a:r,{owner:t}))}}for(const i in n)e[i]===void 0&&t.removeValue(i);return e}const Ox=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];class qP{scrapeMotionValuesFromProps(e,n,i){return{}}constructor({parent:e,props:n,presenceContext:i,reducedMotionConfig:r,blockInitialAnimation:s,visualState:a},o={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.values=new Map,this.KeyframeResolver=Tg,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const p=Li.now();this.renderScheduledAt<p&&(this.renderScheduledAt=p,Mt.render(this.render,!1,!0))};const{latestValues:l,renderState:c,onUpdate:u}=a;this.onUpdate=u,this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=c,this.parent=e,this.props=n,this.presenceContext=i,this.depth=e?e.depth+1:0,this.reducedMotionConfig=r,this.options=o,this.blockInitialAnimation=!!s,this.isControllingVariants=ud(n),this.isVariantNode=CM(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(e&&e.current);const{willChange:f,...d}=this.scrapeMotionValuesFromProps(n,{},this);for(const p in d){const v=d[p];l[p]!==void 0&&un(v)&&v.set(l[p],!1)}}mount(e){this.current=e,Fx.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,i)=>this.bindToMotionValue(i,n)),K1.current||$P(),this.shouldReduceMotion=this.reducedMotionConfig==="never"?!1:this.reducedMotionConfig==="always"?!0:ip.current,this.parent&&this.parent.children.add(this),this.update(this.props,this.presenceContext)}unmount(){Fx.delete(this.current),this.projection&&this.projection.unmount(),Gr(this.notifyUpdate),Gr(this.render),this.valueSubscriptions.forEach(e=>e()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent&&this.parent.children.delete(this);for(const e in this.events)this.events[e].clear();for(const e in this.features){const n=this.features[e];n&&(n.unmount(),n.isMounted=!1)}this.current=null}bindToMotionValue(e,n){this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)();const i=Ls.has(e),r=n.on("change",o=>{this.latestValues[e]=o,this.props.onUpdate&&Mt.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0)}),s=n.on("renderRequest",this.scheduleRender);let a;window.MotionCheckAppearSync&&(a=window.MotionCheckAppearSync(this,e,n)),this.valueSubscriptions.set(e,()=>{r(),s(),a&&a(),n.owner&&n.stop()})}sortNodePosition(e){return!this.current||!this.sortInstanceNodePosition||this.type!==e.type?0:this.sortInstanceNodePosition(this.current,e.current)}updateFeatures(){let e="animation";for(e in ka){const n=ka[e];if(!n)continue;const{isEnabled:i,Feature:r}=n;if(!this.features[e]&&r&&i(this.props)&&(this.features[e]=new r(this)),this.features[e]){const s=this.features[e];s.isMounted?s.update():(s.mount(),s.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):Ft()}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,n){this.latestValues[e]=n}update(e,n){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let i=0;i<Ox.length;i++){const r=Ox[i];this.propEventSubscriptions[r]&&(this.propEventSubscriptions[r](),delete this.propEventSubscriptions[r]);const s="on"+r,a=e[s];a&&(this.propEventSubscriptions[r]=this.on(r,a))}this.prevMotionValues=KP(this,this.scrapeMotionValuesFromProps(e,this.prevProps,this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue(),this.onUpdate&&this.onUpdate(this)}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(e),()=>n.variantChildren.delete(e)}addValue(e,n){const i=this.values.get(e);n!==i&&(i&&this.removeValue(e),this.bindToMotionValue(e,n),this.values.set(e,n),this.latestValues[e]=n.get())}removeValue(e){this.values.delete(e);const n=this.valueSubscriptions.get(e);n&&(n(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,n){if(this.props.values&&this.props.values[e])return this.props.values[e];let i=this.values.get(e);return i===void 0&&n!==void 0&&(i=ul(n===null?void 0:n,{owner:this}),this.addValue(e,i)),i}readValue(e,n){var i;let r=this.latestValues[e]!==void 0||!this.current?this.latestValues[e]:(i=this.getBaseTargetFromProps(this.props,e))!==null&&i!==void 0?i:this.readValueFromInstance(this.current,e,this.options);return r!=null&&(typeof r=="string"&&(v1(r)||l1(r))?r=parseFloat(r):!YP(r)&&Hr.test(n)&&(r=p1(e,n)),this.setBaseTarget(e,un(r)?r.get():r)),un(r)?r.get():r}setBaseTarget(e,n){this.baseTarget[e]=n}getBaseTarget(e){var n;const{initial:i}=this.props;let r;if(typeof i=="string"||typeof i=="object"){const a=rg(this.props,i,(n=this.presenceContext)===null||n===void 0?void 0:n.custom);a&&(r=a[e])}if(i&&r!==void 0)return r;const s=this.getBaseTargetFromProps(this.props,e);return s!==void 0&&!un(s)?s:this.initialValues[e]!==void 0&&r===void 0?void 0:this.baseTarget[e]}on(e,n){return this.events[e]||(this.events[e]=new xg),this.events[e].add(n)}notify(e,...n){this.events[e]&&this.events[e].notify(...n)}}class q1 extends qP{constructor(){super(...arguments),this.KeyframeResolver=S1}sortInstanceNodePosition(e,n){return e.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(e,n){return e.style?e.style[n]:void 0}removeValueFromRenderState(e,{vars:n,style:i}){delete n[e],delete i[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:e}=this.props;un(e)&&(this.childSubscription=e.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}function ZP(t){return window.getComputedStyle(t)}class JP extends q1{constructor(){super(...arguments),this.type="html",this.renderInstance=OM}readValueFromInstance(e,n){if(Ls.has(n)){const i=Eg(n);return i&&i.default||0}else{const i=ZP(e),r=(IM(n)?i.getPropertyValue(n):i[n])||0;return typeof r=="string"?r.trim():r}}measureInstanceViewportBox(e,{transformPagePoint:n}){return k1(e,n)}build(e,n,i){og(e,n,i.transformTemplate)}scrapeMotionValuesFromProps(e,n,i){return dg(e,n,i)}}class QP extends q1{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=Ft}getBaseTargetFromProps(e,n){return e[n]}readValueFromInstance(e,n){if(Ls.has(n)){const i=Eg(n);return i&&i.default||0}return n=kM.has(n)?n:tg(n),e.getAttribute(n)}scrapeMotionValuesFromProps(e,n,i){return VM(e,n,i)}build(e,n,i){lg(e,n,this.isSVGTag,i.transformTemplate)}renderInstance(e,n,i,r){BM(e,n,i,r)}mount(e){this.isSVGTag=ug(e.tagName),super.mount(e)}}const e2=(t,e)=>ig(t)?new QP(e):new JP(e,{allowProjection:t!==z.Fragment}),t2=bA({...TR,...jP,...LP,...WP},e2),ut=Vb(t2);function n2({suggestions:t,disabled:e,onSubmit:n}){const[i,r]=z.useState("");function s(a){const o=a.trim();!o||e||(r(""),n(o))}return x.jsxs("div",{className:"action-panel",children:[x.jsx("div",{className:"suggestion-grid",children:t.map(a=>x.jsx("button",{type:"button",onClick:()=>s(a.text),disabled:e,children:a.label},a.id))}),x.jsxs("form",{className:"custom-action",onSubmit:a=>{a.preventDefault(),s(i)},children:[x.jsx("input",{value:i,onChange:a=>r(a.target.value),placeholder:"输入你的行动",disabled:e}),x.jsx("button",{type:"submit",disabled:e||!i.trim(),children:"执行"})]})]})}const rp=[{id:"warrior",name:"战士",mark:"W",desc:"前排坦克，高 AC 高 HP。擅长把战斗压力拉到自己身上，也能用蛮力打开危险路线。",stats:{str:16,dex:13,con:15,int:10,wis:12,cha:8},pros:["最高 AC 和 HP","近战压制稳定","能替同伴承担风险"],cons:["远程乏力","奥术与细致社交较弱"],skills:{combat:[{name:"压制斩",kind:"combat",check:"攻击检定：力量+熟练 vs AC",effect:"命中后造成武器伤害；若敌人正威胁队友，追加一次击退或缴械叙事机会。"},{name:"盾墙嘲讽",kind:"combat",check:"力量(运动) DC13 或 魅力(威吓) DC14",effect:"成功后一个敌人下轮优先攻击你，指定同伴下一次防御或逃脱检定+2。"}],nonCombat:[{name:"破门开路",kind:"noncombat",check:"力量(运动) DC12-18",effect:"撞门、移石、撑住坍塌机关；失败会制造声响或造成少量伤害。"},{name:"战场读势",kind:"noncombat",check:"感知(洞悉) DC14",effect:"读出伏击方向、敌人胆怯点或 Boss 的下一步战术。"}]}},{id:"rogue",name:"游荡者",mark:"R",desc:"灵活刺客，高爆发偷袭。最适合承担潜入、开锁、拆陷阱和危险侦查。",stats:{str:10,dex:16,con:14,int:12,wis:13,cha:8},pros:["潜行先手偷袭","解陷阱开锁主力","高单体爆发"],cons:["脆皮不能扛","需要队友配合"],skills:{combat:[{name:"偷袭",kind:"combat",check:"攻击检定：敏捷+熟练 vs AC",effect:"若目标被队友牵制或你处于隐藏，命中追加1d6伤害并暴露弱点。"},{name:"烟雾脱离",kind:"combat",check:"敏捷(杂技) DC13",effect:"从近战威胁中撤离，成功后可顺势潜行或护送一名队友后撤。"}],nonCombat:[{name:"开锁拆陷",kind:"noncombat",check:"敏捷(巧手/盗贼工具) DC12-18",effect:"处理门锁、宝箱、压力板和毒针；失败可能消耗工具或触发弱化版陷阱。"},{name:"暗处侦查",kind:"noncombat",check:"敏捷(潜行) 对抗 感知(察觉)",effect:"提前发现巡逻、暗门、偷听情报；大成功可给全队下一次行动优势。"}]}},{id:"wizard",name:"法师",mark:"M",desc:"远程炮台，法术轰炸。擅长奥术鉴定、符文谜题和用法术重写场景规则。",stats:{str:8,dex:13,con:14,int:16,wis:12,cha:10},pros:["AOE 清怪最强","解谜调查主力","法术花样多"],cons:["AC 最低最脆","法术位有限"],skills:{combat:[{name:"炽焰爆裂",kind:"combat",check:"智力(奥秘) DC14 或 法术攻击 vs AC",effect:"塑形火焰打击多个炼狱污染生物；成功避免误伤队友，失败引发环境燃烧。"},{name:"护盾反应",kind:"combat",check:"智力(奥秘) DC13",effect:"预判一次来袭攻击，成功后本轮 AC 临时+3或保护身旁队友。"}],nonCombat:[{name:"奥术鉴定",kind:"noncombat",check:"智力(奥秘) DC12-18",effect:"识别魔法物品、黑色方尖碑、封印符文和炼狱符纹，常能解锁额外剧情。"},{name:"仪式解谜",kind:"noncombat",check:"智力(调查/历史) DC14-18",effect:"解读古代封印、推演时间锚点顺序；失败会推进危险计时。"}]}},{id:"cleric",name:"牧师",mark:"C",desc:"治疗辅助，亡灵克星。擅长祝福、驱散、医治，以及辨认真伪神迹。",stats:{str:13,dex:10,con:14,int:12,wis:16,cha:8},pros:["唯一治疗职业","炼狱污染特攻","团队 buff"],cons:["输出较低","仇恨高易被集火"],skills:{combat:[{name:"圣光打击",kind:"combat",check:"攻击检定：感知+熟练 vs AC",effect:"对炼狱污染生物造成光耀伤害；命中后可压制目标的暗影再生。"},{name:"战地治疗",kind:"combat",check:"感知(医药) DC12",effect:"稳定濒死角色或恢复少量 HP；若消耗治疗药水，检定成功额外+2治疗。"}],nonCombat:[{name:"辨认真伪神迹",kind:"noncombat",check:"感知(洞悉/宗教) DC13-17",effect:"识破阿弗纳斯符纹、孢子幻觉伪装和被污染的圣物。"},{name:"驱散诅咒",kind:"noncombat",check:"感知(宗教) DC15-20",effect:"解除临时属性惩罚、净化孢子污染或削弱黑石诅咒。"}]}},{id:"paladin",name:"圣骑士",mark:"P",desc:"攻守兼备，魅力领袖。善于谈判、审判誓言，也能在 Boss 战里爆发圣光。",stats:{str:15,dex:10,con:13,int:8,wis:12,cha:14},pros:["攻守均衡","魅力社交优势","Boss 战爆发"],cons:["各方面不突出","法术位少"],skills:{combat:[{name:"神圣一击",kind:"combat",check:"攻击检定：力量+熟练 vs AC",effect:"命中后可追加光耀爆发；对恶魔、炼狱污染生物和誓敌特别有效。"},{name:"守护灵光",kind:"combat",check:"魅力(说服/宗教) DC13",effect:"鼓舞队友抵抗恐惧或魅惑，全队下一次相关豁免+2。"}],nonCombat:[{name:"威严谈判",kind:"noncombat",check:"魅力(说服/威吓) DC12-18",effect:"压住争执、争取守卫配合、逼问俘虏；失败会让对方警觉或索要代价。"},{name:"誓言审判",kind:"noncombat",check:"感知(洞悉) 或 魅力(宗教) DC14-18",effect:"判断莱因的记忆、黑石的污染是否源自邪恶力量。"}]}}],kx=[{id:"selin",name:"瑟琳",title:"瑟琳·逆钟",role:"时间魔法师 / 固定同行",hp:34,ac:14,trustKey:"se_trust",hpKey:"se_hp",skills:{combat:[{name:"魔法飞弹",kind:"combat",check:"法术攻击：自动命中, 3×1d4+1力场",effect:"可分散攻击多个目标，无视掩护。"},{name:"小回溯",kind:"combat",check:"附赠动作，修复破损物品",effect:"非战斗时修复破碎物品；接近黑石后可触发更强时间效果。"}],nonCombat:[{name:"时间感",kind:"noncombat",check:"感知DC12 感知时间异常",effect:"对孢子幻觉敏锐，能提前提醒玩家时间错位。"},{name:"侦测魔法",kind:"noncombat",check:"仪式10分钟，30尺内感知魔法灵光",effect:"探测魔法物品、封印符文和黑色方尖碑活动。"}],story:[{name:"时间守望者",kind:"story",check:"第一幕不可揭露来自未来",effect:"全程同行，在缆梯和黑暗之门表现异常，但不揭露秘密。"}]}},{id:"senluo",name:"森洛",title:"森洛·铁锅",role:"矮人战士 / 孢海向导",hp:46,ac:16,trustKey:"sl_trust",hpKey:"sl_hp",skills:{combat:[{name:"裂地斧",kind:"combat",check:"攻击检定：+5 vs AC",effect:"命中1d12+3挥砍；目标STR豁免DC14失败倒地。"},{name:"孢海陷阱",kind:"combat",check:"敏捷(生存)+5 DC14",effect:"放置生存陷阱，15尺内触发束缚。每短休2次。"}],nonCombat:[{name:"真菌辨识",kind:"noncombat",check:"智力(自然)+5，DC12-16",effect:"识别孢海生态、药用孢子、有毒菌类和安全路线。"},{name:"孢海料理",kind:"noncombat",check:"休整时自动成功",effect:"用孢海食材制作临时增益料理（+1d4属性或+5临时HP）。"}],story:[{name:"孢海的梦声",kind:"story",check:"信任>75 触发",effect:"透露巨大真菌生命体的秘密，指出黑石根区的安全路线。"}]}},{id:"liyase",name:"莉亚瑟",title:"莉亚瑟·青弦",role:"精灵游侠 / 弓箭手",hp:34,ac:15,trustKey:"ly_trust",hpKey:"ly_hp",skills:{combat:[{name:"精准射击",kind:"combat",check:"攻击检定：+6 vs AC，150尺",effect:"1d8+3穿刺远程。"},{name:"双箭连射",kind:"combat",check:"攻击检定：+6 vs AC，双命中+1d4",effect:"两次攻击各1d8+3；双命中额外1d4。每短休1次。"}],nonCombat:[{name:"精灵感知",kind:"noncombat",check:"感知(察觉)+5 DC13",effect:"发现伏击、暗门、异常环境和飞行魔物轨迹。"},{name:"追踪",kind:"noncombat",check:"感知(生存)+5 DC12-16",effect:"追踪失踪远征队和精灵侦查队留下的痕迹。"}],story:[{name:"失踪的精灵侦查队",kind:"story",check:"回声菌林发现精灵箭羽【调查DC14】",effect:"触发个人线，找到侦查队最后的去向线索。"}]}},{id:"kaxiya",name:"卡西亚",title:"卡西亚·断羽",role:"人类剑士 / 战斗大师",hp:48,ac:17,trustKey:"kx_trust",hpKey:"kx_hp",skills:{combat:[{name:"战术突刺",kind:"combat",check:"攻击检定：+6 vs AC",effect:"1d8+4穿刺；命中→下次对该目标攻击优势。每战斗2次。"},{name:"舍身掩护",kind:"combat",check:"反应：5尺内队友被攻击",effect:"替队友承受伤害（你的AC正常裁定）。每战斗1次。"}],nonCombat:[{name:"战术评估",kind:"noncombat",check:"感知(洞悉)+4 DC13",effect:"读敌方阵型、预判伏击、评估战场威胁等级。"},{name:"军规交涉",kind:"noncombat",check:"魅力(威吓)+3 DC13-16",effect:"用军人身份与城防守卫交涉获取通行或情报。"}],story:[{name:"矿道袭击真相",kind:"story",check:"在孢海发现类同当年遭遇的痕迹",effect:"触发个人线，揭示当年袭击可能来自深层污染。"}]}},{id:"kelaiya",name:"克莱娅",title:"克莱娅·软爪",role:"兽族盗贼 / 怪物猎人",hp:36,ac:16,trustKey:"kl_trust",hpKey:"kl_hp",skills:{combat:[{name:"暗影偷袭",kind:"combat",check:"攻击检定：+6 vs AC（需优势）",effect:"1d6+4穿刺+2d6偷袭伤害；每回合1次。"},{name:"弱点打击",kind:"combat",check:"攻击检定：+6 vs AC",effect:"1d6+4穿刺；命中→目标AC临时-2持续1轮。每战斗1次。"}],nonCombat:[{name:"开锁拆陷",kind:"noncombat",check:"敏捷(巧手)+6 DC12-18",effect:"解除孢子陷阱、菌丝机关和黑暗之门封印机制。"},{name:"潜行侦查",kind:"noncombat",check:"敏捷(潜行)+6 对抗 感知(察觉)",effect:"无声侦查孢海危险区域，提前发现隐藏敌人。"}],story:[{name:"黑石碎片的梦境",kind:"story",check:"信任>75 触发",effect:"透露黑石碎片在梦中「叫她回去」的线索，指向黑石根区。"}]}},{id:"leiduo",name:"雷铎",title:"雷铎·炉心",role:"机械人形 / 前排大盾",hp:58,ac:19,trustKey:"ld_trust",hpKey:"ld_hp",skills:{combat:[{name:"巨盾守护",kind:"combat",check:"无需检定",effect:"自身与相邻队友AC+2，持续到下次行动。每战斗2次。"},{name:"守护屏障",kind:"combat",check:"反应：15尺内队友被攻击",effect:"该次攻击劣势。每轮1次。"}],nonCombat:[{name:"黑石共鸣",kind:"noncombat",check:"被动自动触发",effect:"接近黑色方尖碑碎片时自动感知；可协助奥秘检定+4。"},{name:"重装破障",kind:"noncombat",check:"力量(运动)+5 DC13-16",effect:"撞开封闭门、清理塌方岩块、推倒巨型菌柱。"}],story:[{name:"记忆闪回",kind:"story",check:"接近黑石根区自动触发",effect:"获得古代地下文明的零星记忆，与黑暗之门方向传来的指令残响。"}]}}];function Z1(t){const e=Math.floor((t-10)/2);return e>=0?`+${e}`:`${e}`}function i2(t){return t<=10?t:t*3}function r2(t){return t==="warrior"||t==="paladin"?18:t==="cleric"?16:t==="rogue"?15:13}const s2=[["str","力"],["dex","敏"],["con","体"],["int","智"],["wis","感"],["cha","魅"]];function a2({state:t,savePanel:e}){const n=Number(t.current_hp??30),i=Number(t.max_hp??30),r=Math.max(0,Math.min(100,n/Math.max(i,1)*100)),s=String(t.inventory||"").split(",").map(o=>o.trim()).filter(Boolean),a=rp.find(o=>o.name===t.char_class||o.id===t.char_class);return x.jsxs("aside",{className:"character-panel",children:[x.jsxs("div",{className:"panel-block character-identity",children:[x.jsx("span",{children:t.player_name||"冒险者"}),x.jsxs("strong",{children:[t.char_class||"战士"," Lv.",t.level||3]})]}),e&&x.jsx("div",{className:"panel-block",children:e}),x.jsxs("div",{className:"panel-block",children:[x.jsxs("div",{className:"meter-label",children:[x.jsx("span",{children:"HP"}),x.jsxs("b",{children:[n,"/",i]})]}),x.jsx("div",{className:"hp-track",children:x.jsx("i",{style:{width:`${r}%`}})})]}),x.jsx("div",{className:"panel-grid",children:s2.map(([o,l])=>{const c=Number(t[o]??10);return x.jsxs("div",{className:"attr-tile",children:[x.jsx("span",{children:l}),x.jsx("b",{children:c}),x.jsx("small",{children:Z1(c)})]},o)})}),x.jsxs("div",{className:"panel-row",children:[x.jsx("span",{children:"AC"}),x.jsx("b",{children:t.ac||18})]}),x.jsxs("div",{className:"panel-row",children:[x.jsx("span",{children:"金币"}),x.jsxs("b",{children:[t.gold||200," GP"]})]}),a&&x.jsxs("div",{className:"panel-block skill-block",children:[x.jsx("h2",{children:"职业技能"}),x.jsx(Bx,{label:"战斗",skills:a.skills.combat}),x.jsx(Bx,{label:"探索/对话",skills:a.skills.nonCombat})]}),x.jsxs("div",{className:"panel-block",children:[x.jsx("h2",{children:"同伴信任"}),kx.map(o=>x.jsx(o2,{name:o.name,value:Number(t[o.trustKey]??50)},o.id))]}),x.jsxs("div",{className:"panel-block companion-skill-block",children:[x.jsx("h2",{children:"队友技能"}),kx.map(o=>x.jsxs("div",{className:"companion-skill",children:[x.jsx("strong",{children:o.name}),x.jsx("small",{children:o.role}),x.jsxs("p",{children:[o.skills.combat[0].name,": ",o.skills.combat[0].check]}),x.jsxs("p",{children:[o.skills.nonCombat[0].name,": ",o.skills.nonCombat[0].check]})]},o.id))]}),x.jsxs("div",{className:"panel-block inventory-block",children:[x.jsx("h2",{children:"背包"}),s.slice(0,5).map(o=>x.jsx("p",{children:o},o))]})]})}function Bx({label:t,skills:e}){return x.jsxs("div",{className:"skill-group",children:[x.jsx("span",{children:t}),e.map(n=>x.jsxs("p",{children:[x.jsx("b",{children:n.name}),x.jsx("small",{children:n.check})]},n.name))]})}function o2({name:t,value:e}){return x.jsxs("div",{className:"trust-row",children:[x.jsx("span",{children:t}),x.jsx("b",{className:e>=70?"trust-high":e<30?"trust-low":"",children:e})]})}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Cg="184",l2=0,zx=1,c2=2,qc=1,u2=2,Eo=3,jr=0,An=1,wi=2,Ji=0,ba=1,Vx=2,Gx=3,Hx=4,d2=5,cs=100,f2=101,h2=102,p2=103,m2=104,g2=200,v2=201,x2=202,_2=203,sp=204,ap=205,y2=206,S2=207,M2=208,E2=209,T2=210,w2=211,b2=212,A2=213,C2=214,op=0,lp=1,cp=2,za=3,up=4,dp=5,fp=6,hp=7,J1=0,R2=1,P2=2,Ii=0,Q1=1,eE=2,tE=3,nE=4,iE=5,rE=6,sE=7,aE=300,Rs=301,Va=302,of=303,lf=304,hd=306,pp=1e3,Yi=1001,mp=1002,Qt=1003,D2=1004,ic=1005,dn=1006,cf=1007,vs=1008,Ln=1009,oE=1010,lE=1011,hl=1012,Rg=1013,Oi=1014,Ai=1015,or=1016,Pg=1017,Dg=1018,pl=1020,cE=35902,uE=35899,dE=1021,fE=1022,ui=1023,lr=1026,xs=1027,hE=1028,Ng=1029,Ps=1030,Lg=1031,Ig=1033,Zc=33776,Jc=33777,Qc=33778,eu=33779,gp=35840,vp=35841,xp=35842,_p=35843,yp=36196,Sp=37492,Mp=37496,Ep=37488,Tp=37489,Iu=37490,wp=37491,bp=37808,Ap=37809,Cp=37810,Rp=37811,Pp=37812,Dp=37813,Np=37814,Lp=37815,Ip=37816,Up=37817,Fp=37818,Op=37819,kp=37820,Bp=37821,zp=36492,Vp=36494,Gp=36495,Hp=36283,jp=36284,Uu=36285,Wp=36286,N2=3200,$p=0,L2=1,br="",Wn="srgb",Fu="srgb-linear",Ou="linear",lt="srgb",ks=7680,jx=519,I2=512,U2=513,F2=514,Ug=515,O2=516,k2=517,Fg=518,B2=519,Xp=35044,Wx="300 es",Ci=2e3,ml=2001;function z2(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function ku(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function V2(){const t=ku("canvas");return t.style.display="block",t}const $x={};function Bu(...t){const e="THREE."+t.shift();console.log(e,...t)}function pE(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function Be(...t){t=pE(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function it(...t){t=pE(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Yp(...t){const e=t.join(" ");e in $x||($x[e]=!0,Be(...t))}function G2(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const H2={[op]:lp,[cp]:fp,[up]:hp,[za]:dp,[lp]:op,[fp]:cp,[hp]:up,[dp]:za};class Is{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const an=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Xx=1234567;const Aa=Math.PI/180,gl=180/Math.PI;function Qi(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(an[t&255]+an[t>>8&255]+an[t>>16&255]+an[t>>24&255]+"-"+an[e&255]+an[e>>8&255]+"-"+an[e>>16&15|64]+an[e>>24&255]+"-"+an[n&63|128]+an[n>>8&255]+"-"+an[n>>16&255]+an[n>>24&255]+an[i&255]+an[i>>8&255]+an[i>>16&255]+an[i>>24&255]).toLowerCase()}function $e(t,e,n){return Math.max(e,Math.min(n,t))}function Og(t,e){return(t%e+e)%e}function j2(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function W2(t,e,n){return t!==e?(n-t)/(e-t):0}function zo(t,e,n){return(1-n)*t+n*e}function $2(t,e,n,i){return zo(t,e,1-Math.exp(-n*i))}function X2(t,e=1){return e-Math.abs(Og(t,e*2)-e)}function Y2(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function K2(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function q2(t,e){return t+Math.floor(Math.random()*(e-t+1))}function Z2(t,e){return t+Math.random()*(e-t)}function J2(t){return t*(.5-Math.random())}function Q2(t){t!==void 0&&(Xx=t);let e=Xx+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function e3(t){return t*Aa}function t3(t){return t*gl}function n3(t){return(t&t-1)===0&&t!==0}function i3(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function r3(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function s3(t,e,n,i,r){const s=Math.cos,a=Math.sin,o=s(n/2),l=a(n/2),c=s((e+i)/2),u=a((e+i)/2),f=s((e-i)/2),d=a((e-i)/2),p=s((i-e)/2),v=a((i-e)/2);switch(r){case"XYX":t.set(o*u,l*f,l*d,o*c);break;case"YZY":t.set(l*d,o*u,l*f,o*c);break;case"ZXZ":t.set(l*f,l*d,o*u,o*c);break;case"XZX":t.set(o*u,l*v,l*p,o*c);break;case"YXY":t.set(l*p,o*u,l*v,o*c);break;case"ZYZ":t.set(l*v,l*p,o*u,o*c);break;default:Be("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ci(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function ct(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const a3={DEG2RAD:Aa,RAD2DEG:gl,generateUUID:Qi,clamp:$e,euclideanModulo:Og,mapLinear:j2,inverseLerp:W2,lerp:zo,damp:$2,pingpong:X2,smoothstep:Y2,smootherstep:K2,randInt:q2,randFloat:Z2,randFloatSpread:J2,seededRandom:Q2,degToRad:e3,radToDeg:t3,isPowerOfTwo:n3,ceilPowerOfTwo:i3,floorPowerOfTwo:r3,setQuaternionFromProperEuler:s3,normalize:ct,denormalize:ci},t0=class t0{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=$e(this.x,e.x,n.x),this.y=$e(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=$e(this.x,e,n),this.y=$e(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};t0.prototype.isVector2=!0;let Ze=t0;class Wr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3],d=s[a+0],p=s[a+1],v=s[a+2],y=s[a+3];if(f!==y||l!==d||c!==p||u!==v){let g=l*d+c*p+u*v+f*y;g<0&&(d=-d,p=-p,v=-v,y=-y,g=-g);let h=1-o;if(g<.9995){const m=Math.acos(g),_=Math.sin(m);h=Math.sin(h*m)/_,o=Math.sin(o*m)/_,l=l*h+d*o,c=c*h+p*o,u=u*h+v*o,f=f*h+y*o}else{l=l*h+d*o,c=c*h+p*o,u=u*h+v*o,f=f*h+y*o;const m=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=m,c*=m,u*=m,f*=m}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[a],d=s[a+1],p=s[a+2],v=s[a+3];return e[n]=o*v+u*f+l*p-c*d,e[n+1]=l*v+u*d+c*f-o*p,e[n+2]=c*v+u*p+o*d-l*f,e[n+3]=u*v-o*f-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,c=o(i/2),u=o(r/2),f=o(s/2),d=l(i/2),p=l(r/2),v=l(s/2);switch(a){case"XYZ":this._x=d*u*f+c*p*v,this._y=c*p*f-d*u*v,this._z=c*u*v+d*p*f,this._w=c*u*f-d*p*v;break;case"YXZ":this._x=d*u*f+c*p*v,this._y=c*p*f-d*u*v,this._z=c*u*v-d*p*f,this._w=c*u*f+d*p*v;break;case"ZXY":this._x=d*u*f-c*p*v,this._y=c*p*f+d*u*v,this._z=c*u*v+d*p*f,this._w=c*u*f-d*p*v;break;case"ZYX":this._x=d*u*f-c*p*v,this._y=c*p*f+d*u*v,this._z=c*u*v-d*p*f,this._w=c*u*f+d*p*v;break;case"YZX":this._x=d*u*f+c*p*v,this._y=c*p*f+d*u*v,this._z=c*u*v-d*p*f,this._w=c*u*f-d*p*v;break;case"XZY":this._x=d*u*f-c*p*v,this._y=c*p*f-d*u*v,this._z=c*u*v+d*p*f,this._w=c*u*f+d*p*v;break;default:Be("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],c=n[2],u=n[6],f=n[10],d=i+o+f;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(a-r)*p}else if(i>o&&i>f){const p=2*Math.sqrt(1+i-o-f);this._w=(u-l)/p,this._x=.25*p,this._y=(r+a)/p,this._z=(s+c)/p}else if(o>f){const p=2*Math.sqrt(1+o-i-f);this._w=(s-c)/p,this._x=(r+a)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-o);this._w=(a-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($e(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+a*o+r*c-s*l,this._y=r*u+a*l+s*o-i*c,this._z=s*u+a*c+i*l-r*o,this._w=a*u-i*o-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,a=e._w,o=this.dot(e);o<0&&(i=-i,r=-r,s=-s,a=-a,o=-o);let l=1-n;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+a*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const n0=class n0{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Yx.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Yx.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,c=2*(a*r-o*i),u=2*(o*n-s*r),f=2*(s*i-a*n);return this.x=n+l*c+a*f-o*u,this.y=i+l*u+o*c-s*f,this.z=r+l*f+s*u-a*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=$e(this.x,e.x,n.x),this.y=$e(this.y,e.y,n.y),this.z=$e(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=$e(this.x,e,n),this.y=$e(this.y,e,n),this.z=$e(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return uf.copy(this).projectOnVector(e),this.sub(uf)}reflect(e){return this.sub(uf.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos($e(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};n0.prototype.isVector3=!0;let L=n0;const uf=new L,Yx=new Wr,i0=class i0{constructor(e,n,i,r,s,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c)}set(e,n,i,r,s,a,o,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],c=i[1],u=i[4],f=i[7],d=i[2],p=i[5],v=i[8],y=r[0],g=r[3],h=r[6],m=r[1],_=r[4],M=r[7],w=r[2],T=r[5],R=r[8];return s[0]=a*y+o*m+l*w,s[3]=a*g+o*_+l*T,s[6]=a*h+o*M+l*R,s[1]=c*y+u*m+f*w,s[4]=c*g+u*_+f*T,s[7]=c*h+u*M+f*R,s[2]=d*y+p*m+v*w,s[5]=d*g+p*_+v*T,s[8]=d*h+p*M+v*R,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8];return n*a*u-n*o*c-i*s*u+i*o*l+r*s*c-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=u*a-o*c,d=o*l-u*s,p=c*s-a*l,v=n*f+i*d+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/v;return e[0]=f*y,e[1]=(r*c-u*i)*y,e[2]=(o*i-r*a)*y,e[3]=d*y,e[4]=(u*n-r*l)*y,e[5]=(r*s-o*n)*y,e[6]=p*y,e[7]=(i*l-c*n)*y,e[8]=(a*n-i*s)*y,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*a+c*o)+a+e,-r*c,r*l,-r*(-c*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(df.makeScale(e,n)),this}rotate(e){return this.premultiply(df.makeRotation(-e)),this}translate(e,n){return this.premultiply(df.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};i0.prototype.isMatrix3=!0;let He=i0;const df=new He,Kx=new He().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),qx=new He().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function o3(){const t={enabled:!0,workingColorSpace:Fu,spaces:{},convert:function(r,s,a){return this.enabled===!1||s===a||!s||!a||(this.spaces[s].transfer===lt&&(r.r=er(r.r),r.g=er(r.g),r.b=er(r.b)),this.spaces[s].primaries!==this.spaces[a].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===lt&&(r.r=Ca(r.r),r.g=Ca(r.g),r.b=Ca(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===br?Ou:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,a){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[a].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Yp("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Yp("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[Fu]:{primaries:e,whitePoint:i,transfer:Ou,toXYZ:Kx,fromXYZ:qx,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Wn},outputColorSpaceConfig:{drawingBufferColorSpace:Wn}},[Wn]:{primaries:e,whitePoint:i,transfer:lt,toXYZ:Kx,fromXYZ:qx,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Wn}}}),t}const et=o3();function er(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Ca(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Bs;class l3{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Bs===void 0&&(Bs=ku("canvas")),Bs.width=e.width,Bs.height=e.height;const r=Bs.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Bs}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=ku("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=er(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(er(n[i]/255)*255):n[i]=er(n[i]);return{data:n,width:e.width,height:e.height}}else return Be("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let c3=0;class kg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:c3++}),this.uuid=Qi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(ff(r[a].image)):s.push(ff(r[a]))}else s=ff(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function ff(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?l3.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(Be("Texture: Unable to serialize Texture."),{})}let u3=0;const hf=new L;class fn extends Is{constructor(e=fn.DEFAULT_IMAGE,n=fn.DEFAULT_MAPPING,i=Yi,r=Yi,s=dn,a=vs,o=ui,l=Ln,c=fn.DEFAULT_ANISOTROPY,u=br){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:u3++}),this.uuid=Qi(),this.name="",this.source=new kg(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ze(0,0),this.repeat=new Ze(1,1),this.center=new Ze(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new He,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(hf).x}get height(){return this.source.getSize(hf).y}get depth(){return this.source.getSize(hf).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){Be(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Be(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==aE)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case pp:e.x=e.x-Math.floor(e.x);break;case Yi:e.x=e.x<0?0:1;break;case mp:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case pp:e.y=e.y-Math.floor(e.y);break;case Yi:e.y=e.y<0?0:1;break;case mp:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=aE;fn.DEFAULT_ANISOTROPY=1;const r0=class r0{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],d=l[1],p=l[5],v=l[9],y=l[2],g=l[6],h=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-y)<.01&&Math.abs(v-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+y)<.1&&Math.abs(v+g)<.1&&Math.abs(c+p+h-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const _=(c+1)/2,M=(p+1)/2,w=(h+1)/2,T=(u+d)/4,R=(f+y)/4,S=(v+g)/4;return _>M&&_>w?_<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(_),r=T/i,s=R/i):M>w?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=T/r,s=S/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=R/s,r=S/s),this.set(i,r,s,n),this}let m=Math.sqrt((g-v)*(g-v)+(f-y)*(f-y)+(d-u)*(d-u));return Math.abs(m)<.001&&(m=1),this.x=(g-v)/m,this.y=(f-y)/m,this.z=(d-u)/m,this.w=Math.acos((c+p+h-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=$e(this.x,e.x,n.x),this.y=$e(this.y,e.y,n.y),this.z=$e(this.z,e.z,n.z),this.w=$e(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=$e(this.x,e,n),this.y=$e(this.y,e,n),this.z=$e(this.z,e,n),this.w=$e(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar($e(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};r0.prototype.isVector4=!0;let gt=r0;class d3 extends Is{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new gt(0,0,e,n),this.scissorTest=!1,this.viewport=new gt(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new fn(r),a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const n={minFilter:dn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new kg(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ui extends d3{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class mE extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=Yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class f3 extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Qt,this.minFilter=Qt,this.wrapR=Yi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const ju=class ju{constructor(e,n,i,r,s,a,o,l,c,u,f,d,p,v,y,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,c,u,f,d,p,v,y,g)}set(e,n,i,r,s,a,o,l,c,u,f,d,p,v,y,g){const h=this.elements;return h[0]=e,h[4]=n,h[8]=i,h[12]=r,h[1]=s,h[5]=a,h[9]=o,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=d,h[3]=p,h[7]=v,h[11]=y,h[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new ju().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinant()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const n=this.elements,i=e.elements,r=1/zs.setFromMatrixColumn(e,0).length(),s=1/zs.setFromMatrixColumn(e,1).length(),a=1/zs.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const d=a*u,p=a*f,v=o*u,y=o*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=p+v*c,n[5]=d-y*c,n[9]=-o*l,n[2]=y-d*c,n[6]=v+p*c,n[10]=a*l}else if(e.order==="YXZ"){const d=l*u,p=l*f,v=c*u,y=c*f;n[0]=d+y*o,n[4]=v*o-p,n[8]=a*c,n[1]=a*f,n[5]=a*u,n[9]=-o,n[2]=p*o-v,n[6]=y+d*o,n[10]=a*l}else if(e.order==="ZXY"){const d=l*u,p=l*f,v=c*u,y=c*f;n[0]=d-y*o,n[4]=-a*f,n[8]=v+p*o,n[1]=p+v*o,n[5]=a*u,n[9]=y-d*o,n[2]=-a*c,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const d=a*u,p=a*f,v=o*u,y=o*f;n[0]=l*u,n[4]=v*c-p,n[8]=d*c+y,n[1]=l*f,n[5]=y*c+d,n[9]=p*c-v,n[2]=-c,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const d=a*l,p=a*c,v=o*l,y=o*c;n[0]=l*u,n[4]=y-d*f,n[8]=v*f+p,n[1]=f,n[5]=a*u,n[9]=-o*u,n[2]=-c*u,n[6]=p*f+v,n[10]=d-y*f}else if(e.order==="XZY"){const d=a*l,p=a*c,v=o*l,y=o*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=d*f+y,n[5]=a*u,n[9]=p*f-v,n[2]=v*f-p,n[6]=o*u,n[10]=y*f+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(h3,e,p3)}lookAt(e,n,i){const r=this.elements;return Pn.subVectors(e,n),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),pr.crossVectors(i,Pn),pr.lengthSq()===0&&(Math.abs(i.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),pr.crossVectors(i,Pn)),pr.normalize(),rc.crossVectors(Pn,pr),r[0]=pr.x,r[4]=rc.x,r[8]=Pn.x,r[1]=pr.y,r[5]=rc.y,r[9]=Pn.y,r[2]=pr.z,r[6]=rc.z,r[10]=Pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],c=i[12],u=i[1],f=i[5],d=i[9],p=i[13],v=i[2],y=i[6],g=i[10],h=i[14],m=i[3],_=i[7],M=i[11],w=i[15],T=r[0],R=r[4],S=r[8],A=r[12],N=r[1],D=r[5],I=r[9],X=r[13],G=r[2],U=r[6],H=r[10],B=r[14],F=r[3],K=r[7],Y=r[11],re=r[15];return s[0]=a*T+o*N+l*G+c*F,s[4]=a*R+o*D+l*U+c*K,s[8]=a*S+o*I+l*H+c*Y,s[12]=a*A+o*X+l*B+c*re,s[1]=u*T+f*N+d*G+p*F,s[5]=u*R+f*D+d*U+p*K,s[9]=u*S+f*I+d*H+p*Y,s[13]=u*A+f*X+d*B+p*re,s[2]=v*T+y*N+g*G+h*F,s[6]=v*R+y*D+g*U+h*K,s[10]=v*S+y*I+g*H+h*Y,s[14]=v*A+y*X+g*B+h*re,s[3]=m*T+_*N+M*G+w*F,s[7]=m*R+_*D+M*U+w*K,s[11]=m*S+_*I+M*H+w*Y,s[15]=m*A+_*X+M*B+w*re,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],c=e[13],u=e[2],f=e[6],d=e[10],p=e[14],v=e[3],y=e[7],g=e[11],h=e[15],m=l*p-c*d,_=o*p-c*f,M=o*d-l*f,w=a*p-c*u,T=a*d-l*u,R=a*f-o*u;return n*(y*m-g*_+h*M)-i*(v*m-g*w+h*T)+r*(v*_-y*w+h*R)-s*(v*M-y*T+g*R)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],c=e[7],u=e[8],f=e[9],d=e[10],p=e[11],v=e[12],y=e[13],g=e[14],h=e[15],m=n*o-i*a,_=n*l-r*a,M=n*c-s*a,w=i*l-r*o,T=i*c-s*o,R=r*c-s*l,S=u*y-f*v,A=u*g-d*v,N=u*h-p*v,D=f*g-d*y,I=f*h-p*y,X=d*h-p*g,G=m*X-_*I+M*D+w*N-T*A+R*S;if(G===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/G;return e[0]=(o*X-l*I+c*D)*U,e[1]=(r*I-i*X-s*D)*U,e[2]=(y*R-g*T+h*w)*U,e[3]=(d*T-f*R-p*w)*U,e[4]=(l*N-a*X-c*A)*U,e[5]=(n*X-r*N+s*A)*U,e[6]=(g*M-v*R-h*_)*U,e[7]=(u*R-d*M+p*_)*U,e[8]=(a*I-o*N+c*S)*U,e[9]=(i*N-n*I-s*S)*U,e[10]=(v*T-y*M+h*m)*U,e[11]=(f*M-u*T-p*m)*U,e[12]=(o*A-a*D-l*S)*U,e[13]=(n*D-i*A+r*S)*U,e[14]=(y*_-v*w-g*m)*U,e[15]=(u*w-f*_+d*m)*U,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,c=s*a,u=s*o;return this.set(c*a+i,c*o-r*l,c*l+r*o,0,c*o+r*l,u*o+i,u*l-r*a,0,c*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,c=s+s,u=a+a,f=o+o,d=s*c,p=s*u,v=s*f,y=a*u,g=a*f,h=o*f,m=l*c,_=l*u,M=l*f,w=i.x,T=i.y,R=i.z;return r[0]=(1-(y+h))*w,r[1]=(p+M)*w,r[2]=(v-_)*w,r[3]=0,r[4]=(p-M)*T,r[5]=(1-(d+h))*T,r[6]=(g+m)*T,r[7]=0,r[8]=(v+_)*R,r[9]=(g-m)*R,r[10]=(1-(d+y))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinant();if(s===0)return i.set(1,1,1),n.identity(),this;let a=zs.set(r[0],r[1],r[2]).length();const o=zs.set(r[4],r[5],r[6]).length(),l=zs.set(r[8],r[9],r[10]).length();s<0&&(a=-a),ni.copy(this);const c=1/a,u=1/o,f=1/l;return ni.elements[0]*=c,ni.elements[1]*=c,ni.elements[2]*=c,ni.elements[4]*=u,ni.elements[5]*=u,ni.elements[6]*=u,ni.elements[8]*=f,ni.elements[9]*=f,ni.elements[10]*=f,n.setFromRotationMatrix(ni),i.x=a,i.y=o,i.z=l,this}makePerspective(e,n,i,r,s,a,o=Ci,l=!1){const c=this.elements,u=2*s/(n-e),f=2*s/(i-r),d=(n+e)/(n-e),p=(i+r)/(i-r);let v,y;if(l)v=s/(a-s),y=a*s/(a-s);else if(o===Ci)v=-(a+s)/(a-s),y=-2*a*s/(a-s);else if(o===ml)v=-a/(a-s),y=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=Ci,l=!1){const c=this.elements,u=2/(n-e),f=2/(i-r),d=-(n+e)/(n-e),p=-(i+r)/(i-r);let v,y;if(l)v=1/(a-s),y=a/(a-s);else if(o===Ci)v=-2/(a-s),y=-(a+s)/(a-s);else if(o===ml)v=-1/(a-s),y=-s/(a-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=v,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};ju.prototype.isMatrix4=!0;let Dt=ju;const zs=new L,ni=new Dt,h3=new L(0,0,0),p3=new L(1,1,1),pr=new L,rc=new L,Pn=new L,Zx=new Dt,Jx=new Wr;class $r{constructor(e=0,n=0,i=0,r=$r.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],c=r[5],u=r[9],f=r[2],d=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin($e(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-$e(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin($e(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-$e(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin($e(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-$e(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:Be("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Zx.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Zx,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Jx.setFromEuler(this),this.setFromQuaternion(Jx,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}$r.DEFAULT_ORDER="XYZ";class gE{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let m3=0;const Qx=new L,Vs=new Wr,Bi=new Dt,sc=new L,oo=new L,g3=new L,v3=new Wr,e_=new L(1,0,0),t_=new L(0,1,0),n_=new L(0,0,1),i_={type:"added"},x3={type:"removed"},Gs={type:"childadded",child:null},pf={type:"childremoved",child:null};class hn extends Is{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:m3++}),this.uuid=Qi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=hn.DEFAULT_UP.clone();const e=new L,n=new $r,i=new Wr,r=new L(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Dt},normalMatrix:{value:new He}}),this.matrix=new Dt,this.matrixWorld=new Dt,this.matrixAutoUpdate=hn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new gE,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Vs.setFromAxisAngle(e,n),this.quaternion.multiply(Vs),this}rotateOnWorldAxis(e,n){return Vs.setFromAxisAngle(e,n),this.quaternion.premultiply(Vs),this}rotateX(e){return this.rotateOnAxis(e_,e)}rotateY(e){return this.rotateOnAxis(t_,e)}rotateZ(e){return this.rotateOnAxis(n_,e)}translateOnAxis(e,n){return Qx.copy(e).applyQuaternion(this.quaternion),this.position.add(Qx.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(e_,e)}translateY(e){return this.translateOnAxis(t_,e)}translateZ(e){return this.translateOnAxis(n_,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Bi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?sc.copy(e):sc.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),oo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Bi.lookAt(oo,sc,this.up):Bi.lookAt(sc,oo,this.up),this.quaternion.setFromRotationMatrix(Bi),r&&(Bi.extractRotation(r.matrixWorld),Vs.setFromRotationMatrix(Bi),this.quaternion.premultiply(Vs.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(it("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(i_),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null):it("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(x3),pf.child=e,this.dispatchEvent(pf),pf.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Bi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Bi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Bi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(i_),Gs.child=e,this.dispatchEvent(Gs),Gs.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oo,e,g3),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(oo,v3,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(o=>({...o})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),c=a(e.textures),u=a(e.images),f=a(e.shapes),d=a(e.skeletons),p=a(e.animations),v=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}hn.DEFAULT_UP=new L(0,1,0);hn.DEFAULT_MATRIX_AUTO_UPDATE=!0;hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class To extends hn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const _3={type:"move"};class mf{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new To,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new To,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new To,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){a=!0;for(const y of e.hand.values()){const g=n.getJointPose(y,i),h=this._getHandJoint(c,y);g!==null&&(h.matrix.fromArray(g.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=g.radius),h.visible=g!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),p=.02,v=.005;c.inputState.pinching&&d>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(_3)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new To;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const vE={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},mr={h:0,s:0,l:0},ac={h:0,s:0,l:0};function gf(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class at{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,et.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=et.workingColorSpace){return this.r=e,this.g=n,this.b=i,et.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=et.workingColorSpace){if(e=Og(e,1),n=$e(n,0,1),i=$e(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=gf(a,s,e+1/3),this.g=gf(a,s,e),this.b=gf(a,s,e-1/3)}return et.colorSpaceToWorking(this,r),this}setStyle(e,n=Wn){function i(s){s!==void 0&&parseFloat(s)<1&&Be("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:Be("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);Be("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Wn){const i=vE[e.toLowerCase()];return i!==void 0?this.setHex(i,n):Be("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=er(e.r),this.g=er(e.g),this.b=er(e.b),this}copyLinearToSRGB(e){return this.r=Ca(e.r),this.g=Ca(e.g),this.b=Ca(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wn){return et.workingToColorSpace(on.copy(this),e),Math.round($e(on.r*255,0,255))*65536+Math.round($e(on.g*255,0,255))*256+Math.round($e(on.b*255,0,255))}getHexString(e=Wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=et.workingColorSpace){et.workingToColorSpace(on.copy(this),n);const i=on.r,r=on.g,s=on.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=et.workingColorSpace){return et.workingToColorSpace(on.copy(this),n),e.r=on.r,e.g=on.g,e.b=on.b,e}getStyle(e=Wn){et.workingToColorSpace(on.copy(this),e);const n=on.r,i=on.g,r=on.b;return e!==Wn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(mr),this.setHSL(mr.h+e,mr.s+n,mr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(mr),e.getHSL(ac);const i=zo(mr.h,ac.h,n),r=zo(mr.s,ac.s,n),s=zo(mr.l,ac.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const on=new at;at.NAMES=vE;class y3 extends hn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $r,this.environmentIntensity=1,this.environmentRotation=new $r,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const ii=new L,zi=new L,vf=new L,Vi=new L,Hs=new L,js=new L,r_=new L,xf=new L,_f=new L,yf=new L,Sf=new gt,Mf=new gt,Ef=new gt;class Kn{constructor(e=new L,n=new L,i=new L){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),ii.subVectors(e,n),r.cross(ii);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){ii.subVectors(r,n),zi.subVectors(i,n),vf.subVectors(e,n);const a=ii.dot(ii),o=ii.dot(zi),l=ii.dot(vf),c=zi.dot(zi),u=zi.dot(vf),f=a*c-o*o;if(f===0)return s.set(0,0,0),null;const d=1/f,p=(c*l-o*u)*d,v=(a*u-o*l)*d;return s.set(1-p-v,v,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Vi)===null?!1:Vi.x>=0&&Vi.y>=0&&Vi.x+Vi.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,Vi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Vi.x),l.addScaledVector(a,Vi.y),l.addScaledVector(o,Vi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return Sf.setScalar(0),Mf.setScalar(0),Ef.setScalar(0),Sf.fromBufferAttribute(e,n),Mf.fromBufferAttribute(e,i),Ef.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(Sf,s.x),a.addScaledVector(Mf,s.y),a.addScaledVector(Ef,s.z),a}static isFrontFacing(e,n,i,r){return ii.subVectors(i,n),zi.subVectors(e,n),ii.cross(zi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),zi.subVectors(this.a,this.b),ii.cross(zi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Kn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Kn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Hs.subVectors(r,i),js.subVectors(s,i),xf.subVectors(e,i);const l=Hs.dot(xf),c=js.dot(xf);if(l<=0&&c<=0)return n.copy(i);_f.subVectors(e,r);const u=Hs.dot(_f),f=js.dot(_f);if(u>=0&&f<=u)return n.copy(r);const d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return a=l/(l-u),n.copy(i).addScaledVector(Hs,a);yf.subVectors(e,s);const p=Hs.dot(yf),v=js.dot(yf);if(v>=0&&p<=v)return n.copy(s);const y=p*c-l*v;if(y<=0&&c>=0&&v<=0)return o=c/(c-v),n.copy(i).addScaledVector(js,o);const g=u*v-p*f;if(g<=0&&f-u>=0&&p-v>=0)return r_.subVectors(s,r),o=(f-u)/(f-u+(p-v)),n.copy(r).addScaledVector(r_,o);const h=1/(g+y+d);return a=y*h,o=d*h,n.copy(i).addScaledVector(Hs,a).addScaledVector(js,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class Zr{constructor(e=new L(1/0,1/0,1/0),n=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(ri.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(ri.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=ri.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,ri):ri.fromBufferAttribute(s,a),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),oc.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),oc.copy(i.boundingBox)),oc.applyMatrix4(e.matrixWorld),this.union(oc)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(lo),lc.subVectors(this.max,lo),Ws.subVectors(e.a,lo),$s.subVectors(e.b,lo),Xs.subVectors(e.c,lo),gr.subVectors($s,Ws),vr.subVectors(Xs,$s),es.subVectors(Ws,Xs);let n=[0,-gr.z,gr.y,0,-vr.z,vr.y,0,-es.z,es.y,gr.z,0,-gr.x,vr.z,0,-vr.x,es.z,0,-es.x,-gr.y,gr.x,0,-vr.y,vr.x,0,-es.y,es.x,0];return!Tf(n,Ws,$s,Xs,lc)||(n=[1,0,0,0,1,0,0,0,1],!Tf(n,Ws,$s,Xs,lc))?!1:(cc.crossVectors(gr,vr),n=[cc.x,cc.y,cc.z],Tf(n,Ws,$s,Xs,lc))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Gi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Gi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Gi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Gi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Gi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Gi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Gi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Gi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Gi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Gi=[new L,new L,new L,new L,new L,new L,new L,new L],ri=new L,oc=new Zr,Ws=new L,$s=new L,Xs=new L,gr=new L,vr=new L,es=new L,lo=new L,lc=new L,cc=new L,ts=new L;function Tf(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){ts.fromArray(t,s);const o=r.x*Math.abs(ts.x)+r.y*Math.abs(ts.y)+r.z*Math.abs(ts.z),l=e.dot(ts),c=n.dot(ts),u=i.dot(ts);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const kt=new L,uc=new Ze;let S3=0;class hi extends Is{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:S3++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Xp,this.updateRanges=[],this.gpuType=Ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)uc.fromBufferAttribute(this,n),uc.applyMatrix3(e),this.setXY(n,uc.x,uc.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.applyMatrix3(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.applyMatrix4(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.applyNormalMatrix(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.transformDirection(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ci(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ct(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ci(n,this.array)),n}setX(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ci(n,this.array)),n}setY(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ci(n,this.array)),n}setZ(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ci(n,this.array)),n}setW(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array),s=ct(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Xp&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class xE extends hi{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class _E extends hi{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Gt extends hi{constructor(e,n,i){super(new Float32Array(e),n,i)}}const M3=new Zr,co=new L,wf=new L;class Al{constructor(e=new L,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):M3.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;co.subVectors(e,this.center);const n=co.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(co,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(wf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(co.copy(e.center).add(wf)),this.expandByPoint(co.copy(e.center).sub(wf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let E3=0;const Hn=new Dt,bf=new hn,Ys=new L,Dn=new Zr,uo=new Zr,Wt=new L;class Cn extends Is{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:E3++}),this.uuid=Qi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(z2(e)?_E:xE)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new He().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Hn.makeRotationFromQuaternion(e),this.applyMatrix4(Hn),this}rotateX(e){return Hn.makeRotationX(e),this.applyMatrix4(Hn),this}rotateY(e){return Hn.makeRotationY(e),this.applyMatrix4(Hn),this}rotateZ(e){return Hn.makeRotationZ(e),this.applyMatrix4(Hn),this}translate(e,n,i){return Hn.makeTranslation(e,n,i),this.applyMatrix4(Hn),this}scale(e,n,i){return Hn.makeScale(e,n,i),this.applyMatrix4(Hn),this}lookAt(e){return bf.lookAt(e),bf.updateMatrix(),this.applyMatrix4(bf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ys).negate(),this.translate(Ys.x,Ys.y,Ys.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const a=e[r];i.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Gt(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&Be("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zr);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,Dn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,Dn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(Dn.min),this.boundingBox.expandByPoint(Dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&it('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Al);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Dn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];uo.setFromBufferAttribute(o),this.morphTargetsRelative?(Wt.addVectors(Dn.min,uo.min),Dn.expandByPoint(Wt),Wt.addVectors(Dn.max,uo.max),Dn.expandByPoint(Wt)):(Dn.expandByPoint(uo.min),Dn.expandByPoint(uo.max))}Dn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Wt));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Wt.fromBufferAttribute(o,c),l&&(Ys.fromBufferAttribute(e,c),Wt.add(Ys)),r=Math.max(r,i.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&it('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){it("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hi(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let S=0;S<i.count;S++)o[S]=new L,l[S]=new L;const c=new L,u=new L,f=new L,d=new Ze,p=new Ze,v=new Ze,y=new L,g=new L;function h(S,A,N){c.fromBufferAttribute(i,S),u.fromBufferAttribute(i,A),f.fromBufferAttribute(i,N),d.fromBufferAttribute(s,S),p.fromBufferAttribute(s,A),v.fromBufferAttribute(s,N),u.sub(c),f.sub(c),p.sub(d),v.sub(d);const D=1/(p.x*v.y-v.x*p.y);isFinite(D)&&(y.copy(u).multiplyScalar(v.y).addScaledVector(f,-p.y).multiplyScalar(D),g.copy(f).multiplyScalar(p.x).addScaledVector(u,-v.x).multiplyScalar(D),o[S].add(y),o[A].add(y),o[N].add(y),l[S].add(g),l[A].add(g),l[N].add(g))}let m=this.groups;m.length===0&&(m=[{start:0,count:e.count}]);for(let S=0,A=m.length;S<A;++S){const N=m[S],D=N.start,I=N.count;for(let X=D,G=D+I;X<G;X+=3)h(e.getX(X+0),e.getX(X+1),e.getX(X+2))}const _=new L,M=new L,w=new L,T=new L;function R(S){w.fromBufferAttribute(r,S),T.copy(w);const A=o[S];_.copy(A),_.sub(w.multiplyScalar(w.dot(A))).normalize(),M.crossVectors(T,A);const D=M.dot(l[S])<0?-1:1;a.setXYZW(S,_.x,_.y,_.z,D)}for(let S=0,A=m.length;S<A;++S){const N=m[S],D=N.start,I=N.count;for(let X=D,G=D+I;X<G;X+=3)R(e.getX(X+0)),R(e.getX(X+1)),R(e.getX(X+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new hi(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new L,s=new L,a=new L,o=new L,l=new L,c=new L,u=new L,f=new L;if(e)for(let d=0,p=e.count;d<p;d+=3){const v=e.getX(d+0),y=e.getX(d+1),g=e.getX(d+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,y),a.fromBufferAttribute(n,g),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(i,v),l.fromBufferAttribute(i,y),c.fromBufferAttribute(i,g),o.add(u),l.add(u),c.add(u),i.setXYZ(v,o.x,o.y,o.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,p=n.count;d<p;d+=3)r.fromBufferAttribute(n,d+0),s.fromBufferAttribute(n,d+1),a.fromBufferAttribute(n,d+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Wt.fromBufferAttribute(e,n),Wt.normalize(),e.setXYZ(n,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(o,l){const c=o.array,u=o.itemSize,f=o.normalized,d=new c.constructor(l.length*u);let p=0,v=0;for(let y=0,g=l.length;y<g;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*u;for(let h=0;h<u;h++)d[v++]=c[p++]}return new hi(d,u,f)}if(this.index===null)return Be("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Cn,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],c=e(l,i);n.setAttribute(o,c)}const s=this.morphAttributes;for(const o in s){const l=[],c=s[o];for(let u=0,f=c.length;u<f;u++){const d=c[u],p=e(d,i);l.push(p)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let d=0,p=f.length;d<p;d++)u.push(f[d].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class T3{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=Xp,this.updateRanges=[],this.version=0,this.uuid=Qi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Qi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const mn=new L;class Rr{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)mn.fromBufferAttribute(this,n),mn.applyMatrix4(e),this.setXYZ(n,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)mn.fromBufferAttribute(this,n),mn.applyNormalMatrix(e),this.setXYZ(n,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)mn.fromBufferAttribute(this,n),mn.transformDirection(e),this.setXYZ(n,mn.x,mn.y,mn.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=ci(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ct(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=ci(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=ci(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=ci(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=ci(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array),s=ct(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Bu("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new hi(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new Rr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Bu("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let w3=0;class Cl extends Is{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:w3++}),this.uuid=Qi(),this.name="",this.type="Material",this.blending=ba,this.side=jr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=sp,this.blendDst=ap,this.blendEquation=cs,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new at(0,0,0),this.blendAlpha=0,this.depthFunc=za,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=jx,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ks,this.stencilZFail=ks,this.stencilZPass=ks,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){Be(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){Be(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==ba&&(i.blending=this.blending),this.side!==jr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==sp&&(i.blendSrc=this.blendSrc),this.blendDst!==ap&&(i.blendDst=this.blendDst),this.blendEquation!==cs&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==za&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==jx&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ks&&(i.stencilFail=this.stencilFail),this.stencilZFail!==ks&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==ks&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Hi=new L,Af=new L,dc=new L,xr=new L,Cf=new L,fc=new L,Rf=new L;class b3{constructor(e=new L,n=new L(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Hi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Hi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Hi.copy(this.origin).addScaledVector(this.direction,n),Hi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Af.copy(e).add(n).multiplyScalar(.5),dc.copy(n).sub(e).normalize(),xr.copy(this.origin).sub(Af);const s=e.distanceTo(n)*.5,a=-this.direction.dot(dc),o=xr.dot(this.direction),l=-xr.dot(dc),c=xr.lengthSq(),u=Math.abs(1-a*a);let f,d,p,v;if(u>0)if(f=a*l-o,d=a*o-l,v=s*u,f>=0)if(d>=-v)if(d<=v){const y=1/u;f*=y,d*=y,p=f*(f+a*d+2*o)+d*(a*f+d+2*l)+c}else d=s,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;else d<=-v?(f=Math.max(0,-(-a*s+o)),d=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c):d<=v?(f=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(f=Math.max(0,-(a*s+o)),d=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c);else d=a>0?-s:s,f=Math.max(0,-(a*d+o)),p=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Af).addScaledVector(dc,d),p}intersectSphere(e,n){Hi.subVectors(e.center,this.origin);const i=Hi.dot(this.direction),r=Hi.dot(Hi)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,a=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,a=(e.min.y-d.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(o=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Hi)!==null}intersectTriangle(e,n,i,r,s){Cf.subVectors(n,e),fc.subVectors(i,e),Rf.crossVectors(Cf,fc);let a=this.direction.dot(Rf),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;xr.subVectors(this.origin,e);const l=o*this.direction.dot(fc.crossVectors(xr,fc));if(l<0)return null;const c=o*this.direction.dot(Cf.cross(xr));if(c<0||l+c>a)return null;const u=-o*xr.dot(Rf);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Bg extends Cl{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new at(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $r,this.combine=J1,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const s_=new Dt,ns=new b3,hc=new Al,a_=new L,pc=new L,mc=new L,gc=new L,Pf=new L,vc=new L,o_=new L,xc=new L;class ei extends hn{constructor(e=new Cn,n=new Bg){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){vc.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=o[l],f=s[l];u!==0&&(Pf.fromBufferAttribute(f,e),a?vc.addScaledVector(Pf,u):vc.addScaledVector(Pf.sub(n),u))}n.add(vc)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),hc.copy(i.boundingSphere),hc.applyMatrix4(s),ns.copy(e.ray).recast(e.near),!(hc.containsPoint(ns.origin)===!1&&(ns.intersectSphere(hc,a_)===null||ns.origin.distanceToSquared(a_)>(e.far-e.near)**2))&&(s_.copy(s).invert(),ns.copy(e.ray).applyMatrix4(s_),!(i.boundingBox!==null&&ns.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,ns)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,d=s.groups,p=s.drawRange;if(o!==null)if(Array.isArray(a))for(let v=0,y=d.length;v<y;v++){const g=d[v],h=a[g.materialIndex],m=Math.max(g.start,p.start),_=Math.min(o.count,Math.min(g.start+g.count,p.start+p.count));for(let M=m,w=_;M<w;M+=3){const T=o.getX(M),R=o.getX(M+1),S=o.getX(M+2);r=_c(this,h,e,i,c,u,f,T,R,S),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let g=v,h=y;g<h;g+=3){const m=o.getX(g),_=o.getX(g+1),M=o.getX(g+2);r=_c(this,a,e,i,c,u,f,m,_,M),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let v=0,y=d.length;v<y;v++){const g=d[v],h=a[g.materialIndex],m=Math.max(g.start,p.start),_=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let M=m,w=_;M<w;M+=3){const T=M,R=M+1,S=M+2;r=_c(this,h,e,i,c,u,f,T,R,S),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let g=v,h=y;g<h;g+=3){const m=g,_=g+1,M=g+2;r=_c(this,a,e,i,c,u,f,m,_,M),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function A3(t,e,n,i,r,s,a,o){let l;if(e.side===An?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===jr,o),l===null)return null;xc.copy(o),xc.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(xc);return c<n.near||c>n.far?null:{distance:c,point:xc.clone(),object:t}}function _c(t,e,n,i,r,s,a,o,l,c){t.getVertexPosition(o,pc),t.getVertexPosition(l,mc),t.getVertexPosition(c,gc);const u=A3(t,e,n,i,pc,mc,gc,o_);if(u){const f=new L;Kn.getBarycoord(o_,pc,mc,gc,f),r&&(u.uv=Kn.getInterpolatedAttribute(r,o,l,c,f,new Ze)),s&&(u.uv1=Kn.getInterpolatedAttribute(s,o,l,c,f,new Ze)),a&&(u.normal=Kn.getInterpolatedAttribute(a,o,l,c,f,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a:o,b:l,c,normal:new L,materialIndex:0};Kn.getNormal(pc,mc,gc,d.normal),u.face=d,u.barycoord=f}return u}class C3 extends fn{constructor(e=null,n=1,i=1,r,s,a,o,l,c=Qt,u=Qt,f,d){super(null,a,o,l,c,u,r,s,f,d),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Df=new L,R3=new L,P3=new He;class ls{constructor(e=new L(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Df.subVectors(i,n).cross(R3.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const r=e.delta(Df),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const a=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(a<0||a>1)?null:n.copy(e.start).addScaledVector(r,a)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||P3.getNormalMatrix(e),r=this.coplanarPoint(Df).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const is=new Al,D3=new Ze(.5,.5),yc=new L;class zg{constructor(e=new ls,n=new ls,i=new ls,r=new ls,s=new ls,a=new ls){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ci,i=!1){const r=this.planes,s=e.elements,a=s[0],o=s[1],l=s[2],c=s[3],u=s[4],f=s[5],d=s[6],p=s[7],v=s[8],y=s[9],g=s[10],h=s[11],m=s[12],_=s[13],M=s[14],w=s[15];if(r[0].setComponents(c-a,p-u,h-v,w-m).normalize(),r[1].setComponents(c+a,p+u,h+v,w+m).normalize(),r[2].setComponents(c+o,p+f,h+y,w+_).normalize(),r[3].setComponents(c-o,p-f,h-y,w-_).normalize(),i)r[4].setComponents(l,d,g,M).normalize(),r[5].setComponents(c-l,p-d,h-g,w-M).normalize();else if(r[4].setComponents(c-l,p-d,h-g,w-M).normalize(),n===Ci)r[5].setComponents(c+l,p+d,h+g,w+M).normalize();else if(n===ml)r[5].setComponents(l,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),is.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),is.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(is)}intersectsSprite(e){is.center.set(0,0,0);const n=D3.distanceTo(e.center);return is.radius=.7071067811865476+n,is.applyMatrix4(e.matrixWorld),this.intersectsSphere(is)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(yc.x=r.normal.x>0?e.max.x:e.min.x,yc.y=r.normal.y>0?e.max.y:e.min.y,yc.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(yc)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class yE extends fn{constructor(e=[],n=Rs,i,r,s,a,o,l,c,u){super(e,n,i,r,s,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class SE extends fn{constructor(e,n,i,r,s,a,o,l,c){super(e,n,i,r,s,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ga extends fn{constructor(e,n,i=Oi,r,s,a,o=Qt,l=Qt,c,u=lr,f=1){if(u!==lr&&u!==xs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:n,depth:f};super(d,r,s,a,o,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new kg(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class N3 extends Ga{constructor(e,n=Oi,i=Rs,r,s,a=Qt,o=Qt,l,c=lr){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,n,i,r,s,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class ME extends fn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class Ka extends Cn{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],c=[],u=[],f=[];let d=0,p=0;v("z","y","x",-1,-1,i,n,e,a,s,0),v("z","y","x",1,-1,i,n,-e,a,s,1),v("x","z","y",1,1,e,i,n,r,a,2),v("x","z","y",1,-1,e,i,-n,r,a,3),v("x","y","z",1,-1,e,n,i,r,s,4),v("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Gt(c,3)),this.setAttribute("normal",new Gt(u,3)),this.setAttribute("uv",new Gt(f,2));function v(y,g,h,m,_,M,w,T,R,S,A){const N=M/R,D=w/S,I=M/2,X=w/2,G=T/2,U=R+1,H=S+1;let B=0,F=0;const K=new L;for(let Y=0;Y<H;Y++){const re=Y*D-X;for(let oe=0;oe<U;oe++){const xe=oe*N-I;K[y]=xe*m,K[g]=re*_,K[h]=G,c.push(K.x,K.y,K.z),K[y]=0,K[g]=0,K[h]=T>0?1:-1,u.push(K.x,K.y,K.z),f.push(oe/R),f.push(1-Y/S),B+=1}}for(let Y=0;Y<S;Y++)for(let re=0;re<R;re++){const oe=d+re+U*Y,xe=d+re+U*(Y+1),Pe=d+(re+1)+U*(Y+1),Ae=d+(re+1)+U*Y;l.push(oe,xe,Ae),l.push(xe,Pe,Ae),F+=6}o.addGroup(p,F,A),p+=F,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Ka(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Vg extends Cn{constructor(e=1,n=1,i=1,r=32,s=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:a,thetaStart:o,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],d=[],p=[];let v=0;const y=[],g=i/2;let h=0;m(),a===!1&&(e>0&&_(!0),n>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new Gt(f,3)),this.setAttribute("normal",new Gt(d,3)),this.setAttribute("uv",new Gt(p,2));function m(){const M=new L,w=new L;let T=0;const R=(n-e)/i;for(let S=0;S<=s;S++){const A=[],N=S/s,D=N*(n-e)+e;for(let I=0;I<=r;I++){const X=I/r,G=X*l+o,U=Math.sin(G),H=Math.cos(G);w.x=D*U,w.y=-N*i+g,w.z=D*H,f.push(w.x,w.y,w.z),M.set(U,R,H).normalize(),d.push(M.x,M.y,M.z),p.push(X,1-N),A.push(v++)}y.push(A)}for(let S=0;S<r;S++)for(let A=0;A<s;A++){const N=y[A][S],D=y[A+1][S],I=y[A+1][S+1],X=y[A][S+1];(e>0||A!==0)&&(u.push(N,D,X),T+=3),(n>0||A!==s-1)&&(u.push(D,I,X),T+=3)}c.addGroup(h,T,0),h+=T}function _(M){const w=v,T=new Ze,R=new L;let S=0;const A=M===!0?e:n,N=M===!0?1:-1;for(let I=1;I<=r;I++)f.push(0,g*N,0),d.push(0,N,0),p.push(.5,.5),v++;const D=v;for(let I=0;I<=r;I++){const G=I/r*l+o,U=Math.cos(G),H=Math.sin(G);R.x=A*H,R.y=g*N,R.z=A*U,f.push(R.x,R.y,R.z),d.push(0,N,0),T.x=U*.5+.5,T.y=H*.5*N+.5,p.push(T.x,T.y),v++}for(let I=0;I<r;I++){const X=w+I,G=D+I;M===!0?u.push(G,G+1,X):u.push(G+1,G,X),S+=3}c.addGroup(h,S,M===!0?1:2),h+=S}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Vg(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class qa extends Cn{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};const s=[],a=[];o(r),c(i),u(),this.setAttribute("position",new Gt(s,3)),this.setAttribute("normal",new Gt(s.slice(),3)),this.setAttribute("uv",new Gt(a,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function o(m){const _=new L,M=new L,w=new L;for(let T=0;T<n.length;T+=3)p(n[T+0],_),p(n[T+1],M),p(n[T+2],w),l(_,M,w,m)}function l(m,_,M,w){const T=w+1,R=[];for(let S=0;S<=T;S++){R[S]=[];const A=m.clone().lerp(M,S/T),N=_.clone().lerp(M,S/T),D=T-S;for(let I=0;I<=D;I++)I===0&&S===T?R[S][I]=A:R[S][I]=A.clone().lerp(N,I/D)}for(let S=0;S<T;S++)for(let A=0;A<2*(T-S)-1;A++){const N=Math.floor(A/2);A%2===0?(d(R[S][N+1]),d(R[S+1][N]),d(R[S][N])):(d(R[S][N+1]),d(R[S+1][N+1]),d(R[S+1][N]))}}function c(m){const _=new L;for(let M=0;M<s.length;M+=3)_.x=s[M+0],_.y=s[M+1],_.z=s[M+2],_.normalize().multiplyScalar(m),s[M+0]=_.x,s[M+1]=_.y,s[M+2]=_.z}function u(){const m=new L;for(let _=0;_<s.length;_+=3){m.x=s[_+0],m.y=s[_+1],m.z=s[_+2];const M=g(m)/2/Math.PI+.5,w=h(m)/Math.PI+.5;a.push(M,1-w)}v(),f()}function f(){for(let m=0;m<a.length;m+=6){const _=a[m+0],M=a[m+2],w=a[m+4],T=Math.max(_,M,w),R=Math.min(_,M,w);T>.9&&R<.1&&(_<.2&&(a[m+0]+=1),M<.2&&(a[m+2]+=1),w<.2&&(a[m+4]+=1))}}function d(m){s.push(m.x,m.y,m.z)}function p(m,_){const M=m*3;_.x=e[M+0],_.y=e[M+1],_.z=e[M+2]}function v(){const m=new L,_=new L,M=new L,w=new L,T=new Ze,R=new Ze,S=new Ze;for(let A=0,N=0;A<s.length;A+=9,N+=6){m.set(s[A+0],s[A+1],s[A+2]),_.set(s[A+3],s[A+4],s[A+5]),M.set(s[A+6],s[A+7],s[A+8]),T.set(a[N+0],a[N+1]),R.set(a[N+2],a[N+3]),S.set(a[N+4],a[N+5]),w.copy(m).add(_).add(M).divideScalar(3);const D=g(w);y(T,N+0,m,D),y(R,N+2,_,D),y(S,N+4,M,D)}}function y(m,_,M,w){w<0&&m.x===1&&(a[_]=m.x-1),M.x===0&&M.z===0&&(a[_]=w/2/Math.PI+.5)}function g(m){return Math.atan2(m.z,-m.x)}function h(m){return Math.atan2(-m.y,Math.sqrt(m.x*m.x+m.z*m.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new qa(e.vertices,e.indices,e.radius,e.detail)}}class Gg extends qa{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],a=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,a,e,n),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Gg(e.radius,e.detail)}}const Sc=new L,Mc=new L,Nf=new L,Ec=new Kn;class L3 extends Cn{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const r=Math.pow(10,4),s=Math.cos(Aa*n),a=e.getIndex(),o=e.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],u=["a","b","c"],f=new Array(3),d={},p=[];for(let v=0;v<l;v+=3){a?(c[0]=a.getX(v),c[1]=a.getX(v+1),c[2]=a.getX(v+2)):(c[0]=v,c[1]=v+1,c[2]=v+2);const{a:y,b:g,c:h}=Ec;if(y.fromBufferAttribute(o,c[0]),g.fromBufferAttribute(o,c[1]),h.fromBufferAttribute(o,c[2]),Ec.getNormal(Nf),f[0]=`${Math.round(y.x*r)},${Math.round(y.y*r)},${Math.round(y.z*r)}`,f[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,f[2]=`${Math.round(h.x*r)},${Math.round(h.y*r)},${Math.round(h.z*r)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let m=0;m<3;m++){const _=(m+1)%3,M=f[m],w=f[_],T=Ec[u[m]],R=Ec[u[_]],S=`${M}_${w}`,A=`${w}_${M}`;A in d&&d[A]?(Nf.dot(d[A].normal)<=s&&(p.push(T.x,T.y,T.z),p.push(R.x,R.y,R.z)),d[A]=null):S in d||(d[S]={index0:c[m],index1:c[_],normal:Nf.clone()})}}for(const v in d)if(d[v]){const{index0:y,index1:g}=d[v];Sc.fromBufferAttribute(o,y),Mc.fromBufferAttribute(o,g),p.push(Sc.x,Sc.y,Sc.z),p.push(Mc.x,Mc.y,Mc.z)}this.setAttribute("position",new Gt(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Hg extends qa{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Hg(e.radius,e.detail)}}class jg extends qa{constructor(e=1,n=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,n),this.type="OctahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new jg(e.radius,e.detail)}}class Rl extends Cn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),c=o+1,u=l+1,f=e/o,d=n/l,p=[],v=[],y=[],g=[];for(let h=0;h<u;h++){const m=h*d-a;for(let _=0;_<c;_++){const M=_*f-s;v.push(M,-m,0),y.push(0,0,1),g.push(_/o),g.push(1-h/l)}}for(let h=0;h<l;h++)for(let m=0;m<o;m++){const _=m+c*h,M=m+c*(h+1),w=m+1+c*(h+1),T=m+1+c*h;p.push(_,M,T),p.push(M,w,T)}this.setIndex(p),this.setAttribute("position",new Gt(v,3)),this.setAttribute("normal",new Gt(y,3)),this.setAttribute("uv",new Gt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Rl(e.width,e.height,e.widthSegments,e.heightSegments)}}class Wg extends qa{constructor(e=1,n=0){const i=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],r=[2,1,0,0,3,2,1,3,0,2,3,1];super(i,r,e,n),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Wg(e.radius,e.detail)}}class I3 extends Cn{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const n=[],i=new Set,r=new L,s=new L;if(e.index!==null){const a=e.attributes.position,o=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){const f=l[c],d=f.start,p=f.count;for(let v=d,y=d+p;v<y;v+=3)for(let g=0;g<3;g++){const h=o.getX(v+g),m=o.getX(v+(g+1)%3);r.fromBufferAttribute(a,h),s.fromBufferAttribute(a,m),l_(r,s,i)===!0&&(n.push(r.x,r.y,r.z),n.push(s.x,s.y,s.z))}}}else{const a=e.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let c=0;c<3;c++){const u=3*o+c,f=3*o+(c+1)%3;r.fromBufferAttribute(a,u),s.fromBufferAttribute(a,f),l_(r,s,i)===!0&&(n.push(r.x,r.y,r.z),n.push(s.x,s.y,s.z))}}this.setAttribute("position",new Gt(n,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function l_(t,e,n){const i=`${t.x},${t.y},${t.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${t.x},${t.y},${t.z}`;return n.has(i)===!0||n.has(r)===!0?!1:(n.add(i),n.add(r),!0)}function Ha(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];if(c_(r))r.isRenderTargetTexture?(Be("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(c_(r[0])){const s=[];for(let a=0,o=r.length;a<o;a++)s[a]=r[a].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function gn(t){const e={};for(let n=0;n<t.length;n++){const i=Ha(t[n]);for(const r in i)e[r]=i[r]}return e}function c_(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function U3(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function EE(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:et.workingColorSpace}const $g={clone:Ha,merge:gn};var F3=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,O3=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mi extends Cl{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=F3,this.fragmentShader=O3,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ha(e.uniforms),this.uniformsGroups=U3(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class k3 extends mi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class B3 extends Cl{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new at(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new at(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=$p,this.normalScale=new Ze(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $r,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class z3 extends Cl{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=N2,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class V3 extends Cl{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Xg extends hn{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new at(e),this.intensity=n}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}const Lf=new Dt,u_=new L,d_=new L;class TE{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ze(512,512),this.mapType=Ln,this.map=null,this.mapPass=null,this.matrix=new Dt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new zg,this._frameExtents=new Ze(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;u_.setFromMatrixPosition(e.matrixWorld),n.position.copy(u_),d_.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(d_),n.updateMatrixWorld(),Lf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Lf,n.coordinateSystem,n.reversedDepth),n.coordinateSystem===ml||n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Lf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const Tc=new L,wc=new Wr,_i=new L;class wE extends hn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Dt,this.projectionMatrix=new Dt,this.projectionMatrixInverse=new Dt,this.coordinateSystem=Ci,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(Tc,wc,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Tc,wc,_i.set(1,1,1)).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorld.decompose(Tc,wc,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Tc,wc,_i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const _r=new L,f_=new Ze,h_=new Ze;class Yn extends wE{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=gl*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Aa*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return gl*2*Math.atan(Math.tan(Aa*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){_r.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(_r.x,_r.y).multiplyScalar(-e/_r.z),_r.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(_r.x,_r.y).multiplyScalar(-e/_r.z)}getViewSize(e,n){return this.getViewBounds(e,f_,h_),n.subVectors(h_,f_)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Aa*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/c,r*=a.width/l,i*=a.height/c}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class G3 extends TE{constructor(){super(new Yn(90,1,.5,500)),this.isPointLightShadow=!0}}class p_ extends Xg{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new G3}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.distance=this.distance,n.object.decay=this.decay,n.object.shadow=this.shadow.toJSON(),n}}class pd extends wE{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,a=s+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class H3 extends TE{constructor(){super(new pd(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class j3 extends Xg{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(hn.DEFAULT_UP),this.updateMatrix(),this.target=new hn,this.shadow=new H3}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class W3 extends Xg{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class $3 extends Cn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const Ks=-90,qs=1;class X3 extends hn{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Yn(Ks,qs,e,n);r.layers=this.layers,this.add(r);const s=new Yn(Ks,qs,e,n);s.layers=this.layers,this.add(s);const a=new Yn(Ks,qs,e,n);a.layers=this.layers,this.add(a);const o=new Yn(Ks,qs,e,n);o.layers=this.layers,this.add(o);const l=new Yn(Ks,qs,e,n);l.layers=this.layers,this.add(l);const c=new Yn(Ks,qs,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const c of n)this.remove(c);if(e===Ci)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ml)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,c,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(f,d,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class Y3 extends Yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class Kp extends T3{constructor(e,n,i=1){super(e,n),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const n=super.clone(e);return n.meshPerAttribute=this.meshPerAttribute,n}toJSON(e){const n=super.toJSON(e);return n.isInstancedInterleavedBuffer=!0,n.meshPerAttribute=this.meshPerAttribute,n}}class K3{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,Be("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=performance.now();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}const s0=class s0{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){const s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};s0.prototype.isMatrix2=!0;let m_=s0;const g_=new L,bc=new L,Zs=new L,Js=new L,If=new L,q3=new L,Z3=new L;class J3{constructor(e=new L,n=new L){this.start=e,this.end=n}set(e,n){return this.start.copy(e),this.end.copy(n),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,n){return this.delta(n).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,n){g_.subVectors(e,this.start),bc.subVectors(this.end,this.start);const i=bc.dot(bc);if(i===0)return 0;let s=bc.dot(g_)/i;return n&&(s=$e(s,0,1)),s}closestPointToPoint(e,n,i){const r=this.closestPointToPointParameter(e,n);return this.delta(i).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,n=q3,i=Z3){const r=10000000000000001e-32;let s,a;const o=this.start,l=e.start,c=this.end,u=e.end;Zs.subVectors(c,o),Js.subVectors(u,l),If.subVectors(o,l);const f=Zs.dot(Zs),d=Js.dot(Js),p=Js.dot(If);if(f<=r&&d<=r)return n.copy(o),i.copy(l),n.sub(i),n.dot(n);if(f<=r)s=0,a=p/d,a=$e(a,0,1);else{const v=Zs.dot(If);if(d<=r)a=0,s=$e(-v/f,0,1);else{const y=Zs.dot(Js),g=f*d-y*y;g!==0?s=$e((y*p-v*d)/g,0,1):s=0,a=(y*s+p)/d,a<0?(a=0,s=$e(-v/f,0,1)):a>1&&(a=1,s=$e((y-v)/f,0,1))}}return n.copy(o).addScaledVector(Zs,s),i.copy(l).addScaledVector(Js,a),n.distanceToSquared(i)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function v_(t,e,n,i){const r=Q3(i);switch(n){case dE:return t*e;case hE:return t*e/r.components*r.byteLength;case Ng:return t*e/r.components*r.byteLength;case Ps:return t*e*2/r.components*r.byteLength;case Lg:return t*e*2/r.components*r.byteLength;case fE:return t*e*3/r.components*r.byteLength;case ui:return t*e*4/r.components*r.byteLength;case Ig:return t*e*4/r.components*r.byteLength;case Zc:case Jc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Qc:case eu:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case vp:case _p:return Math.max(t,16)*Math.max(e,8)/4;case gp:case xp:return Math.max(t,8)*Math.max(e,8)/2;case yp:case Sp:case Ep:case Tp:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Mp:case Iu:case wp:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case bp:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ap:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case Cp:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Rp:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Pp:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Dp:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Np:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Lp:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Ip:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Up:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Fp:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Op:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case kp:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Bp:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case zp:case Vp:case Gp:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Hp:case jp:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Uu:case Wp:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function Q3(t){switch(t){case Ln:case oE:return{byteLength:1,components:1};case hl:case lE:case or:return{byteLength:2,components:1};case Pg:case Dg:return{byteLength:2,components:4};case Oi:case Rg:case Ai:return{byteLength:4,components:1};case cE:case uE:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Cg}}));typeof window<"u"&&(window.__THREE__?Be("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Cg);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function bE(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function eD(t){const e=new WeakMap;function n(o,l){const c=o.array,u=o.usage,f=c.byteLength,d=t.createBuffer();t.bindBuffer(l,d),t.bufferData(l,c,u),o.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=t.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,c){const u=l.array,f=l.updateRanges;if(t.bindBuffer(c,o),f.length===0)t.bufferSubData(c,0,u);else{f.sort((p,v)=>p.start-v.start);let d=0;for(let p=1;p<f.length;p++){const v=f[d],y=f[p];y.start<=v.start+v.count+1?v.count=Math.max(v.count,y.start+y.count-v.start):(++d,f[d]=y)}f.length=d+1;for(let p=0,v=f.length;p<v;p++){const y=f[p];t.bufferSubData(c,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,n(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,o,l),c.version=o.version}}return{get:r,remove:s,update:a}}var tD=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,nD=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,iD=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,rD=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,sD=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,aD=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,oD=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,lD=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,cD=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,uD=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,dD=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fD=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,hD=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,pD=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,mD=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,gD=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,vD=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xD=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,_D=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,yD=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,SD=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,MD=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,ED=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,TD=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,wD=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,bD=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,AD=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,CD=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,RD=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,PD=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,DD="gl_FragColor = linearToOutputTexel( gl_FragColor );",ND=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,LD=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ID=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,UD=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,FD=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,OD=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,kD=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,BD=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,zD=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,VD=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,GD=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,HD=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,jD=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,WD=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$D=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,XD=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,YD=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,KD=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,qD=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ZD=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,JD=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,QD=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,eN=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,tN=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,nN=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,iN=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,rN=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sN=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,aN=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,oN=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lN=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cN=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,uN=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,dN=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,fN=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,hN=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pN=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mN=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gN=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,vN=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,xN=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_N=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,yN=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,SN=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,MN=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,EN=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,TN=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,wN=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,bN=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,AN=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,CN=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,RN=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,PN=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,DN=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,NN=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,LN=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,IN=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,UN=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,FN=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ON=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,kN=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,BN=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,zN=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,VN=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,GN=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,HN=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jN=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,WN=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,$N=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,XN=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,YN=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,KN=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,qN=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ZN=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,JN=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,QN=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,eL=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const tL=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nL=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,iL=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rL=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sL=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aL=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,oL=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,lL=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,cL=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,uL=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,dL=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,fL=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hL=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,pL=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,mL=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,gL=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vL=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xL=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,_L=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,yL=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,SL=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ML=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,EL=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,TL=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,wL=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,bL=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,AL=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,CL=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RL=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,PL=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,DL=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,NL=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,LL=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,IL=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Ye={alphahash_fragment:tD,alphahash_pars_fragment:nD,alphamap_fragment:iD,alphamap_pars_fragment:rD,alphatest_fragment:sD,alphatest_pars_fragment:aD,aomap_fragment:oD,aomap_pars_fragment:lD,batching_pars_vertex:cD,batching_vertex:uD,begin_vertex:dD,beginnormal_vertex:fD,bsdfs:hD,iridescence_fragment:pD,bumpmap_pars_fragment:mD,clipping_planes_fragment:gD,clipping_planes_pars_fragment:vD,clipping_planes_pars_vertex:xD,clipping_planes_vertex:_D,color_fragment:yD,color_pars_fragment:SD,color_pars_vertex:MD,color_vertex:ED,common:TD,cube_uv_reflection_fragment:wD,defaultnormal_vertex:bD,displacementmap_pars_vertex:AD,displacementmap_vertex:CD,emissivemap_fragment:RD,emissivemap_pars_fragment:PD,colorspace_fragment:DD,colorspace_pars_fragment:ND,envmap_fragment:LD,envmap_common_pars_fragment:ID,envmap_pars_fragment:UD,envmap_pars_vertex:FD,envmap_physical_pars_fragment:XD,envmap_vertex:OD,fog_vertex:kD,fog_pars_vertex:BD,fog_fragment:zD,fog_pars_fragment:VD,gradientmap_pars_fragment:GD,lightmap_pars_fragment:HD,lights_lambert_fragment:jD,lights_lambert_pars_fragment:WD,lights_pars_begin:$D,lights_toon_fragment:YD,lights_toon_pars_fragment:KD,lights_phong_fragment:qD,lights_phong_pars_fragment:ZD,lights_physical_fragment:JD,lights_physical_pars_fragment:QD,lights_fragment_begin:eN,lights_fragment_maps:tN,lights_fragment_end:nN,lightprobes_pars_fragment:iN,logdepthbuf_fragment:rN,logdepthbuf_pars_fragment:sN,logdepthbuf_pars_vertex:aN,logdepthbuf_vertex:oN,map_fragment:lN,map_pars_fragment:cN,map_particle_fragment:uN,map_particle_pars_fragment:dN,metalnessmap_fragment:fN,metalnessmap_pars_fragment:hN,morphinstance_vertex:pN,morphcolor_vertex:mN,morphnormal_vertex:gN,morphtarget_pars_vertex:vN,morphtarget_vertex:xN,normal_fragment_begin:_N,normal_fragment_maps:yN,normal_pars_fragment:SN,normal_pars_vertex:MN,normal_vertex:EN,normalmap_pars_fragment:TN,clearcoat_normal_fragment_begin:wN,clearcoat_normal_fragment_maps:bN,clearcoat_pars_fragment:AN,iridescence_pars_fragment:CN,opaque_fragment:RN,packing:PN,premultiplied_alpha_fragment:DN,project_vertex:NN,dithering_fragment:LN,dithering_pars_fragment:IN,roughnessmap_fragment:UN,roughnessmap_pars_fragment:FN,shadowmap_pars_fragment:ON,shadowmap_pars_vertex:kN,shadowmap_vertex:BN,shadowmask_pars_fragment:zN,skinbase_vertex:VN,skinning_pars_vertex:GN,skinning_vertex:HN,skinnormal_vertex:jN,specularmap_fragment:WN,specularmap_pars_fragment:$N,tonemapping_fragment:XN,tonemapping_pars_fragment:YN,transmission_fragment:KN,transmission_pars_fragment:qN,uv_pars_fragment:ZN,uv_pars_vertex:JN,uv_vertex:QN,worldpos_vertex:eL,background_vert:tL,background_frag:nL,backgroundCube_vert:iL,backgroundCube_frag:rL,cube_vert:sL,cube_frag:aL,depth_vert:oL,depth_frag:lL,distance_vert:cL,distance_frag:uL,equirect_vert:dL,equirect_frag:fL,linedashed_vert:hL,linedashed_frag:pL,meshbasic_vert:mL,meshbasic_frag:gL,meshlambert_vert:vL,meshlambert_frag:xL,meshmatcap_vert:_L,meshmatcap_frag:yL,meshnormal_vert:SL,meshnormal_frag:ML,meshphong_vert:EL,meshphong_frag:TL,meshphysical_vert:wL,meshphysical_frag:bL,meshtoon_vert:AL,meshtoon_frag:CL,points_vert:RL,points_frag:PL,shadow_vert:DL,shadow_frag:NL,sprite_vert:LL,sprite_frag:IL},ge={common:{diffuse:{value:new at(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new He}},envmap:{envMap:{value:null},envMapRotation:{value:new He},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new He}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new He}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new He},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new He},normalScale:{value:new Ze(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new He},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new He}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new He}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new He}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new at(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new at(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0},uvTransform:{value:new He}},sprite:{diffuse:{value:new at(16777215)},opacity:{value:1},center:{value:new Ze(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new He},alphaMap:{value:null},alphaMapTransform:{value:new He},alphaTest:{value:0}}},Mn={basic:{uniforms:gn([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ye.meshbasic_vert,fragmentShader:Ye.meshbasic_frag},lambert:{uniforms:gn([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new at(0)},envMapIntensity:{value:1}}]),vertexShader:Ye.meshlambert_vert,fragmentShader:Ye.meshlambert_frag},phong:{uniforms:gn([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new at(0)},specular:{value:new at(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphong_vert,fragmentShader:Ye.meshphong_frag},standard:{uniforms:gn([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new at(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag},toon:{uniforms:gn([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new at(0)}}]),vertexShader:Ye.meshtoon_vert,fragmentShader:Ye.meshtoon_frag},matcap:{uniforms:gn([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ye.meshmatcap_vert,fragmentShader:Ye.meshmatcap_frag},points:{uniforms:gn([ge.points,ge.fog]),vertexShader:Ye.points_vert,fragmentShader:Ye.points_frag},dashed:{uniforms:gn([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ye.linedashed_vert,fragmentShader:Ye.linedashed_frag},depth:{uniforms:gn([ge.common,ge.displacementmap]),vertexShader:Ye.depth_vert,fragmentShader:Ye.depth_frag},normal:{uniforms:gn([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ye.meshnormal_vert,fragmentShader:Ye.meshnormal_frag},sprite:{uniforms:gn([ge.sprite,ge.fog]),vertexShader:Ye.sprite_vert,fragmentShader:Ye.sprite_frag},background:{uniforms:{uvTransform:{value:new He},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ye.background_vert,fragmentShader:Ye.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new He}},vertexShader:Ye.backgroundCube_vert,fragmentShader:Ye.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ye.cube_vert,fragmentShader:Ye.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ye.equirect_vert,fragmentShader:Ye.equirect_frag},distance:{uniforms:gn([ge.common,ge.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ye.distance_vert,fragmentShader:Ye.distance_frag},shadow:{uniforms:gn([ge.lights,ge.fog,{color:{value:new at(0)},opacity:{value:1}}]),vertexShader:Ye.shadow_vert,fragmentShader:Ye.shadow_frag}};Mn.physical={uniforms:gn([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new He},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new He},clearcoatNormalScale:{value:new Ze(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new He},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new He},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new He},sheen:{value:0},sheenColor:{value:new at(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new He},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new He},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new He},transmissionSamplerSize:{value:new Ze},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new He},attenuationDistance:{value:0},attenuationColor:{value:new at(0)},specularColor:{value:new at(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new He},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new He},anisotropyVector:{value:new Ze},anisotropyMap:{value:null},anisotropyMapTransform:{value:new He}}]),vertexShader:Ye.meshphysical_vert,fragmentShader:Ye.meshphysical_frag};const Ac={r:0,b:0,g:0},UL=new Dt,AE=new He;AE.set(-1,0,0,0,1,0,0,0,1);function FL(t,e,n,i,r,s){const a=new at(0);let o=r===!0?0:1,l,c,u=null,f=0,d=null;function p(m){let _=m.isScene===!0?m.background:null;if(_&&_.isTexture){const M=m.backgroundBlurriness>0;_=e.get(_,M)}return _}function v(m){let _=!1;const M=p(m);M===null?g(a,o):M&&M.isColor&&(g(M,1),_=!0);const w=t.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function y(m,_){const M=p(_);M&&(M.isCubeTexture||M.mapping===hd)?(c===void 0&&(c=new ei(new Ka(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:Ha(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(UL.makeRotationFromEuler(_.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(AE),c.material.toneMapped=et.getTransfer(M.colorSpace)!==lt,(u!==M||f!==M.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,u=M,f=M.version,d=t.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new ei(new Rl(2,2),new mi({name:"BackgroundMaterial",uniforms:Ha(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:jr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=et.getTransfer(M.colorSpace)!==lt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,d=t.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function g(m,_){m.getRGB(Ac,EE(t)),n.buffers.color.setClear(Ac.r,Ac.g,Ac.b,_,s)}function h(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(m,_=1){a.set(m),o=_,g(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(m){o=m,g(a,o)},render:v,addToRenderList:y,dispose:h}}function OL(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,a=!1;function o(D,I,X,G,U){let H=!1;const B=f(D,G,X,I);s!==B&&(s=B,c(s.object)),H=p(D,G,X,U),H&&v(D,G,X,U),U!==null&&e.update(U,t.ELEMENT_ARRAY_BUFFER),(H||a)&&(a=!1,M(D,I,X,G),U!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(U).buffer))}function l(){return t.createVertexArray()}function c(D){return t.bindVertexArray(D)}function u(D){return t.deleteVertexArray(D)}function f(D,I,X,G){const U=G.wireframe===!0;let H=i[I.id];H===void 0&&(H={},i[I.id]=H);const B=D.isInstancedMesh===!0?D.id:0;let F=H[B];F===void 0&&(F={},H[B]=F);let K=F[X.id];K===void 0&&(K={},F[X.id]=K);let Y=K[U];return Y===void 0&&(Y=d(l()),K[U]=Y),Y}function d(D){const I=[],X=[],G=[];for(let U=0;U<n;U++)I[U]=0,X[U]=0,G[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:I,enabledAttributes:X,attributeDivisors:G,object:D,attributes:{},index:null}}function p(D,I,X,G){const U=s.attributes,H=I.attributes;let B=0;const F=X.getAttributes();for(const K in F)if(F[K].location>=0){const re=U[K];let oe=H[K];if(oe===void 0&&(K==="instanceMatrix"&&D.instanceMatrix&&(oe=D.instanceMatrix),K==="instanceColor"&&D.instanceColor&&(oe=D.instanceColor)),re===void 0||re.attribute!==oe||oe&&re.data!==oe.data)return!0;B++}return s.attributesNum!==B||s.index!==G}function v(D,I,X,G){const U={},H=I.attributes;let B=0;const F=X.getAttributes();for(const K in F)if(F[K].location>=0){let re=H[K];re===void 0&&(K==="instanceMatrix"&&D.instanceMatrix&&(re=D.instanceMatrix),K==="instanceColor"&&D.instanceColor&&(re=D.instanceColor));const oe={};oe.attribute=re,re&&re.data&&(oe.data=re.data),U[K]=oe,B++}s.attributes=U,s.attributesNum=B,s.index=G}function y(){const D=s.newAttributes;for(let I=0,X=D.length;I<X;I++)D[I]=0}function g(D){h(D,0)}function h(D,I){const X=s.newAttributes,G=s.enabledAttributes,U=s.attributeDivisors;X[D]=1,G[D]===0&&(t.enableVertexAttribArray(D),G[D]=1),U[D]!==I&&(t.vertexAttribDivisor(D,I),U[D]=I)}function m(){const D=s.newAttributes,I=s.enabledAttributes;for(let X=0,G=I.length;X<G;X++)I[X]!==D[X]&&(t.disableVertexAttribArray(X),I[X]=0)}function _(D,I,X,G,U,H,B){B===!0?t.vertexAttribIPointer(D,I,X,U,H):t.vertexAttribPointer(D,I,X,G,U,H)}function M(D,I,X,G){y();const U=G.attributes,H=X.getAttributes(),B=I.defaultAttributeValues;for(const F in H){const K=H[F];if(K.location>=0){let Y=U[F];if(Y===void 0&&(F==="instanceMatrix"&&D.instanceMatrix&&(Y=D.instanceMatrix),F==="instanceColor"&&D.instanceColor&&(Y=D.instanceColor)),Y!==void 0){const re=Y.normalized,oe=Y.itemSize,xe=e.get(Y);if(xe===void 0)continue;const Pe=xe.buffer,Ae=xe.type,Q=xe.bytesPerElement,le=Ae===t.INT||Ae===t.UNSIGNED_INT||Y.gpuType===Rg;if(Y.isInterleavedBufferAttribute){const ue=Y.data,Ce=ue.stride,Oe=Y.offset;if(ue.isInstancedInterleavedBuffer){for(let _e=0;_e<K.locationSize;_e++)h(K.location+_e,ue.meshPerAttribute);D.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=ue.meshPerAttribute*ue.count)}else for(let _e=0;_e<K.locationSize;_e++)g(K.location+_e);t.bindBuffer(t.ARRAY_BUFFER,Pe);for(let _e=0;_e<K.locationSize;_e++)_(K.location+_e,oe/K.locationSize,Ae,re,Ce*Q,(Oe+oe/K.locationSize*_e)*Q,le)}else{if(Y.isInstancedBufferAttribute){for(let ue=0;ue<K.locationSize;ue++)h(K.location+ue,Y.meshPerAttribute);D.isInstancedMesh!==!0&&G._maxInstanceCount===void 0&&(G._maxInstanceCount=Y.meshPerAttribute*Y.count)}else for(let ue=0;ue<K.locationSize;ue++)g(K.location+ue);t.bindBuffer(t.ARRAY_BUFFER,Pe);for(let ue=0;ue<K.locationSize;ue++)_(K.location+ue,oe/K.locationSize,Ae,re,oe*Q,oe/K.locationSize*ue*Q,le)}}else if(B!==void 0){const re=B[F];if(re!==void 0)switch(re.length){case 2:t.vertexAttrib2fv(K.location,re);break;case 3:t.vertexAttrib3fv(K.location,re);break;case 4:t.vertexAttrib4fv(K.location,re);break;default:t.vertexAttrib1fv(K.location,re)}}}}m()}function w(){A();for(const D in i){const I=i[D];for(const X in I){const G=I[X];for(const U in G){const H=G[U];for(const B in H)u(H[B].object),delete H[B];delete G[U]}}delete i[D]}}function T(D){if(i[D.id]===void 0)return;const I=i[D.id];for(const X in I){const G=I[X];for(const U in G){const H=G[U];for(const B in H)u(H[B].object),delete H[B];delete G[U]}}delete i[D.id]}function R(D){for(const I in i){const X=i[I];for(const G in X){const U=X[G];if(U[D.id]===void 0)continue;const H=U[D.id];for(const B in H)u(H[B].object),delete H[B];delete U[D.id]}}}function S(D){for(const I in i){const X=i[I],G=D.isInstancedMesh===!0?D.id:0,U=X[G];if(U!==void 0){for(const H in U){const B=U[H];for(const F in B)u(B[F].object),delete B[F];delete U[H]}delete X[G],Object.keys(X).length===0&&delete i[I]}}}function A(){N(),a=!0,s!==r&&(s=r,c(s.object))}function N(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:A,resetDefaultState:N,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfObject:S,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:g,disableUnusedAttributes:m}}function kL(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function a(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function o(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let d=0;for(let p=0;p<u;p++)d+=c[p];n.update(d,i,1)}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o}function BL(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(R){return!(R!==ui&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const S=R===or&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Ln&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Ai&&!S)}function l(R){if(R==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(Be("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=n.logarithmicDepthBuffer===!0,d=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&d===!1&&Be("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),h=t.getParameter(t.MAX_VERTEX_ATTRIBS),m=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),_=t.getParameter(t.MAX_VARYING_VECTORS),M=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),w=t.getParameter(t.MAX_SAMPLES),T=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:v,maxTextureSize:y,maxCubemapSize:g,maxAttributes:h,maxVertexUniforms:m,maxVaryings:_,maxFragmentUniforms:M,maxSamples:w,samples:T}}function zL(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new ls,o=new He,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const p=f.length!==0||d||i!==0||r;return r=d,i=f.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){n=u(f,d,0)},this.setState=function(f,d,p){const v=f.clippingPlanes,y=f.clipIntersection,g=f.clipShadows,h=t.get(f);if(!r||v===null||v.length===0||s&&!g)s?u(null):c();else{const m=s?0:i,_=m*4;let M=h.clippingState||null;l.value=M,M=u(v,d,_,p);for(let w=0;w!==_;++w)M[w]=n[w];h.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=m}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,d,p,v){const y=f!==null?f.length:0;let g=null;if(y!==0){if(g=l.value,v!==!0||g===null){const h=p+y*4,m=d.matrixWorldInverse;o.getNormalMatrix(m),(g===null||g.length<h)&&(g=new Float32Array(h));for(let _=0,M=p;_!==y;++_,M+=4)a.copy(f[_]).applyMatrix4(m,o),a.normal.toArray(g,M),g[M+3]=a.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,g}}const Pr=4,x_=[.125,.215,.35,.446,.526,.582],us=20,VL=256,fo=new pd,__=new at;let Uf=null,Ff=0,Of=0,kf=!1;const GL=new L;class y_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:a=256,position:o=GL}=s;Uf=this._renderer.getRenderTarget(),Ff=this._renderer.getActiveCubeFace(),Of=this._renderer.getActiveMipmapLevel(),kf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(a);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,o),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=E_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=M_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Uf,Ff,Of),this._renderer.xr.enabled=kf,e.scissorTest=!1,Qs(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Rs||e.mapping===Va?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Uf=this._renderer.getRenderTarget(),Ff=this._renderer.getActiveCubeFace(),Of=this._renderer.getActiveMipmapLevel(),kf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:or,format:ui,colorSpace:Fu,depthBuffer:!1},r=S_(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=S_(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=HL(s)),this._blurMaterial=WL(s,e,n),this._ggxMaterial=jL(s,e,n)}return r}_compileMaterial(e){const n=new ei(new Cn,e);this._renderer.compile(n,fo)}_sceneToCubeUV(e,n,i,r,s){const l=new Yn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,p=f.toneMapping;f.getClearColor(__),f.toneMapping=Ii,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ei(new Ka,new Bg({name:"PMREM.Background",side:An,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,g=y.material;let h=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,h=!0):(g.color.copy(__),h=!0);for(let _=0;_<6;_++){const M=_%3;M===0?(l.up.set(0,c[_],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[_],s.y,s.z)):M===1?(l.up.set(0,0,c[_]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[_],s.z)):(l.up.set(0,c[_],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[_]));const w=this._cubeSize;Qs(r,M*w,_>2?w:0,w,w),f.setRenderTarget(r),h&&f.render(y,l),f.render(e,l)}f.toneMapping=p,f.autoClear=d,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Rs||e.mapping===Va;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=E_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=M_());const s=r?this._cubemapMaterial:this._equirectMaterial,a=this._lodMeshes[0];a.material=s;const o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;Qs(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,fo)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,a=this._ggxMaterial,o=this._lodMeshes[i];o.material=a;const l=a.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),d=0+c*1.25,p=f*d,{_lodMax:v}=this,y=this._sizeLods[i],g=3*y*(i>v-Pr?i-v+Pr:0),h=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=v-n,Qs(s,g,h,3*y,2*y),r.setRenderTarget(s),r.render(o,fo),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=v-i,Qs(e,g,h,3*y,2*y),r.setRenderTarget(e),r.render(o,fo)}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,c=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&it("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[r];f.material=c;const d=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*us-1),y=s/v,g=isFinite(s)?1+Math.floor(u*y):us;g>us&&Be(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${us}`);const h=[];let m=0;for(let R=0;R<us;++R){const S=R/y,A=Math.exp(-S*S/2);h.push(A),R===0?m+=A:R<g&&(m+=2*A)}for(let R=0;R<h.length;R++)h[R]=h[R]/m;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=h,d.latitudinal.value=a==="latitudinal",o&&(d.poleAxis.value=o);const{_lodMax:_}=this;d.dTheta.value=v,d.mipInt.value=_-i;const M=this._sizeLods[r],w=3*M*(r>_-Pr?r-_+Pr:0),T=4*(this._cubeSize-M);Qs(n,w,T,3*M,2*M),l.setRenderTarget(n),l.render(f,fo)}}function HL(t){const e=[],n=[],i=[];let r=t;const s=t-Pr+1+x_.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);e.push(o);let l=1/o;a>t-Pr?l=x_[a-t+Pr-1]:a===0&&(l=0),n.push(l);const c=1/(o-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,v=6,y=3,g=2,h=1,m=new Float32Array(y*v*p),_=new Float32Array(g*v*p),M=new Float32Array(h*v*p);for(let T=0;T<p;T++){const R=T%3*2/3-1,S=T>2?0:-1,A=[R,S,0,R+2/3,S,0,R+2/3,S+1,0,R,S,0,R+2/3,S+1,0,R,S+1,0];m.set(A,y*v*T),_.set(d,g*v*T);const N=[T,T,T,T,T,T];M.set(N,h*v*T)}const w=new Cn;w.setAttribute("position",new hi(m,y)),w.setAttribute("uv",new hi(_,g)),w.setAttribute("faceIndex",new hi(M,h)),i.push(new ei(w,null)),r>Pr&&r--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function S_(t,e,n){const i=new Ui(t,e,n);return i.texture.mapping=hd,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Qs(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function jL(t,e,n){return new mi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:VL,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:md(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function WL(t,e,n){const i=new Float32Array(us),r=new L(0,1,0);return new mi({name:"SphericalGaussianBlur",defines:{n:us,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:md(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function M_(){return new mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:md(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function E_(){return new mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:md(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ji,depthTest:!1,depthWrite:!1})}function md(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class CE extends Ui{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new yE(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new Ka(5,5,5),s=new mi({name:"CubemapFromEquirect",uniforms:Ha(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:An,blending:Ji});s.uniforms.tEquirect.value=n;const a=new ei(r,s),o=n.minFilter;return n.minFilter===vs&&(n.minFilter=dn),new X3(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}function $L(t){let e=new WeakMap,n=new WeakMap,i=null;function r(d,p=!1){return d==null?null:p?a(d):s(d)}function s(d){if(d&&d.isTexture){const p=d.mapping;if(p===of||p===lf)if(e.has(d)){const v=e.get(d).texture;return o(v,d.mapping)}else{const v=d.image;if(v&&v.height>0){const y=new CE(v.height);return y.fromEquirectangularTexture(t,d),e.set(d,y),d.addEventListener("dispose",c),o(y.texture,d.mapping)}else return null}}return d}function a(d){if(d&&d.isTexture){const p=d.mapping,v=p===of||p===lf,y=p===Rs||p===Va;if(v||y){let g=n.get(d);const h=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==h)return i===null&&(i=new y_(t)),g=v?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,n.set(d,g),g.texture;if(g!==void 0)return g.texture;{const m=d.image;return v&&m&&m.height>0||y&&m&&l(m)?(i===null&&(i=new y_(t)),g=v?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,n.set(d,g),d.addEventListener("dispose",u),g.texture):null}}}return d}function o(d,p){return p===of?d.mapping=Rs:p===lf&&(d.mapping=Va),d}function l(d){let p=0;const v=6;for(let y=0;y<v;y++)d[y]!==void 0&&p++;return p===v}function c(d){const p=d.target;p.removeEventListener("dispose",c);const v=e.get(p);v!==void 0&&(e.delete(p),v.dispose())}function u(d){const p=d.target;p.removeEventListener("dispose",u);const v=n.get(p);v!==void 0&&(n.delete(p),v.dispose())}function f(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:f}}function XL(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Yp("WebGLRenderer: "+i+" extension not supported."),r}}}function YL(t,e,n,i){const r={},s=new WeakMap;function a(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const v in d.attributes)e.remove(d.attributes[v]);d.removeEventListener("dispose",a),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function o(f,d){return r[d.id]===!0||(d.addEventListener("dispose",a),r[d.id]=!0,n.memory.geometries++),d}function l(f){const d=f.attributes;for(const p in d)e.update(d[p],t.ARRAY_BUFFER)}function c(f){const d=[],p=f.index,v=f.attributes.position;let y=0;if(v===void 0)return;if(p!==null){const m=p.array;y=p.version;for(let _=0,M=m.length;_<M;_+=3){const w=m[_+0],T=m[_+1],R=m[_+2];d.push(w,T,T,R,R,w)}}else{const m=v.array;y=v.version;for(let _=0,M=m.length/3-1;_<M;_+=3){const w=_+0,T=_+1,R=_+2;d.push(w,T,T,R,R,w)}}const g=new(v.count>=65535?_E:xE)(d,1);g.version=y;const h=s.get(f);h&&e.remove(h),s.set(f,g)}function u(f){const d=s.get(f);if(d){const p=f.index;p!==null&&d.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function KL(t,e,n){let i;function r(f){i=f}let s,a;function o(f){s=f.type,a=f.bytesPerElement}function l(f,d){t.drawElements(i,d,s,f*a),n.update(d,i,1)}function c(f,d,p){p!==0&&(t.drawElementsInstanced(i,d,s,f*a,p),n.update(d,i,p))}function u(f,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,f,0,p);let y=0;for(let g=0;g<p;g++)y+=d[g];n.update(y,i,1)}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function qL(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:it("WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function ZL(t,e,n){const i=new WeakMap,r=new gt;function s(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let d=i.get(o);if(d===void 0||d.count!==f){let N=function(){S.dispose(),i.delete(o),o.removeEventListener("dispose",N)};var p=N;d!==void 0&&d.texture.dispose();const v=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,h=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],_=o.morphAttributes.color||[];let M=0;v===!0&&(M=1),y===!0&&(M=2),g===!0&&(M=3);let w=o.attributes.position.count*M,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const R=new Float32Array(w*T*4*f),S=new mE(R,w,T,f);S.type=Ai,S.needsUpdate=!0;const A=M*4;for(let D=0;D<f;D++){const I=h[D],X=m[D],G=_[D],U=w*T*4*D;for(let H=0;H<I.count;H++){const B=H*A;v===!0&&(r.fromBufferAttribute(I,H),R[U+B+0]=r.x,R[U+B+1]=r.y,R[U+B+2]=r.z,R[U+B+3]=0),y===!0&&(r.fromBufferAttribute(X,H),R[U+B+4]=r.x,R[U+B+5]=r.y,R[U+B+6]=r.z,R[U+B+7]=0),g===!0&&(r.fromBufferAttribute(G,H),R[U+B+8]=r.x,R[U+B+9]=r.y,R[U+B+10]=r.z,R[U+B+11]=G.itemSize===4?r.w:1)}}d={count:f,texture:S,size:new Ze(w,T)},i.set(o,d),o.addEventListener("dispose",N)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let v=0;for(let g=0;g<c.length;g++)v+=c[g];const y=o.morphTargetsRelative?1:1-v;l.getUniforms().setValue(t,"morphTargetBaseInfluence",y),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:s}}function JL(t,e,n,i,r){let s=new WeakMap;function a(c){const u=r.render.frame,f=c.geometry,d=e.get(c,f);if(s.get(d)!==u&&(e.update(d),s.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==u&&(p.update(),s.set(p,u))}return d}function o(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:a,dispose:o}}const QL={[Q1]:"LINEAR_TONE_MAPPING",[eE]:"REINHARD_TONE_MAPPING",[tE]:"CINEON_TONE_MAPPING",[nE]:"ACES_FILMIC_TONE_MAPPING",[rE]:"AGX_TONE_MAPPING",[sE]:"NEUTRAL_TONE_MAPPING",[iE]:"CUSTOM_TONE_MAPPING"};function eI(t,e,n,i,r){const s=new Ui(e,n,{type:t,depthBuffer:i,stencilBuffer:r,depthTexture:i?new Ga(e,n):void 0}),a=new Ui(e,n,{type:or,depthBuffer:!1,stencilBuffer:!1}),o=new Cn;o.setAttribute("position",new Gt([-1,3,0,-1,-1,0,3,-1,0],3)),o.setAttribute("uv",new Gt([0,2,0,0,2,0],2));const l=new k3({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new ei(o,l),u=new pd(-1,1,1,-1,0,1);let f=null,d=null,p=!1,v,y=null,g=[],h=!1;this.setSize=function(m,_){s.setSize(m,_),a.setSize(m,_);for(let M=0;M<g.length;M++){const w=g[M];w.setSize&&w.setSize(m,_)}},this.setEffects=function(m){g=m,h=g.length>0&&g[0].isRenderPass===!0;const _=s.width,M=s.height;for(let w=0;w<g.length;w++){const T=g[w];T.setSize&&T.setSize(_,M)}},this.begin=function(m,_){if(p||m.toneMapping===Ii&&g.length===0)return!1;if(y=_,_!==null){const M=_.width,w=_.height;(s.width!==M||s.height!==w)&&this.setSize(M,w)}return h===!1&&m.setRenderTarget(s),v=m.toneMapping,m.toneMapping=Ii,!0},this.hasRenderPass=function(){return h},this.end=function(m,_){m.toneMapping=v,p=!0;let M=s,w=a;for(let T=0;T<g.length;T++){const R=g[T];if(R.enabled!==!1&&(R.render(m,w,M,_),R.needsSwap!==!1)){const S=M;M=w,w=S}}if(f!==m.outputColorSpace||d!==m.toneMapping){f=m.outputColorSpace,d=m.toneMapping,l.defines={},et.getTransfer(f)===lt&&(l.defines.SRGB_TRANSFER="");const T=QL[d];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,m.setRenderTarget(y),m.render(c,u),y=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),a.dispose(),o.dispose(),l.dispose()}}const RE=new fn,qp=new Ga(1,1),PE=new mE,DE=new f3,NE=new yE,T_=[],w_=[],b_=new Float32Array(16),A_=new Float32Array(9),C_=new Float32Array(4);function Za(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=T_[r];if(s===void 0&&(s=new Float32Array(r),T_[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Ht(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function jt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function gd(t,e){let n=w_[e];n===void 0&&(n=new Int32Array(e),w_[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function tI(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function nI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ht(n,e))return;t.uniform2fv(this.addr,e),jt(n,e)}}function iI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ht(n,e))return;t.uniform3fv(this.addr,e),jt(n,e)}}function rI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ht(n,e))return;t.uniform4fv(this.addr,e),jt(n,e)}}function sI(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ht(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),jt(n,e)}else{if(Ht(n,i))return;C_.set(i),t.uniformMatrix2fv(this.addr,!1,C_),jt(n,i)}}function aI(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ht(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),jt(n,e)}else{if(Ht(n,i))return;A_.set(i),t.uniformMatrix3fv(this.addr,!1,A_),jt(n,i)}}function oI(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ht(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),jt(n,e)}else{if(Ht(n,i))return;b_.set(i),t.uniformMatrix4fv(this.addr,!1,b_),jt(n,i)}}function lI(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function cI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ht(n,e))return;t.uniform2iv(this.addr,e),jt(n,e)}}function uI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ht(n,e))return;t.uniform3iv(this.addr,e),jt(n,e)}}function dI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ht(n,e))return;t.uniform4iv(this.addr,e),jt(n,e)}}function fI(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function hI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ht(n,e))return;t.uniform2uiv(this.addr,e),jt(n,e)}}function pI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ht(n,e))return;t.uniform3uiv(this.addr,e),jt(n,e)}}function mI(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ht(n,e))return;t.uniform4uiv(this.addr,e),jt(n,e)}}function gI(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(qp.compareFunction=n.isReversedDepthBuffer()?Fg:Ug,s=qp):s=RE,n.setTexture2D(e||s,r)}function vI(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||DE,r)}function xI(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||NE,r)}function _I(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||PE,r)}function yI(t){switch(t){case 5126:return tI;case 35664:return nI;case 35665:return iI;case 35666:return rI;case 35674:return sI;case 35675:return aI;case 35676:return oI;case 5124:case 35670:return lI;case 35667:case 35671:return cI;case 35668:case 35672:return uI;case 35669:case 35673:return dI;case 5125:return fI;case 36294:return hI;case 36295:return pI;case 36296:return mI;case 35678:case 36198:case 36298:case 36306:case 35682:return gI;case 35679:case 36299:case 36307:return vI;case 35680:case 36300:case 36308:case 36293:return xI;case 36289:case 36303:case 36311:case 36292:return _I}}function SI(t,e){t.uniform1fv(this.addr,e)}function MI(t,e){const n=Za(e,this.size,2);t.uniform2fv(this.addr,n)}function EI(t,e){const n=Za(e,this.size,3);t.uniform3fv(this.addr,n)}function TI(t,e){const n=Za(e,this.size,4);t.uniform4fv(this.addr,n)}function wI(t,e){const n=Za(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function bI(t,e){const n=Za(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function AI(t,e){const n=Za(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function CI(t,e){t.uniform1iv(this.addr,e)}function RI(t,e){t.uniform2iv(this.addr,e)}function PI(t,e){t.uniform3iv(this.addr,e)}function DI(t,e){t.uniform4iv(this.addr,e)}function NI(t,e){t.uniform1uiv(this.addr,e)}function LI(t,e){t.uniform2uiv(this.addr,e)}function II(t,e){t.uniform3uiv(this.addr,e)}function UI(t,e){t.uniform4uiv(this.addr,e)}function FI(t,e,n){const i=this.cache,r=e.length,s=gd(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));let a;this.type===t.SAMPLER_2D_SHADOW?a=qp:a=RE;for(let o=0;o!==r;++o)n.setTexture2D(e[o]||a,s[o])}function OI(t,e,n){const i=this.cache,r=e.length,s=gd(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||DE,s[a])}function kI(t,e,n){const i=this.cache,r=e.length,s=gd(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||NE,s[a])}function BI(t,e,n){const i=this.cache,r=e.length,s=gd(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||PE,s[a])}function zI(t){switch(t){case 5126:return SI;case 35664:return MI;case 35665:return EI;case 35666:return TI;case 35674:return wI;case 35675:return bI;case 35676:return AI;case 5124:case 35670:return CI;case 35667:case 35671:return RI;case 35668:case 35672:return PI;case 35669:case 35673:return DI;case 5125:return NI;case 36294:return LI;case 36295:return II;case 36296:return UI;case 35678:case 36198:case 36298:case 36306:case 35682:return FI;case 35679:case 36299:case 36307:return OI;case 35680:case 36300:case 36308:case 36293:return kI;case 36289:case 36303:case 36311:case 36292:return BI}}class VI{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=yI(n.type)}}class GI{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=zI(n.type)}}class HI{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const Bf=/(\w+)(\])?(\[|\.)?/g;function R_(t,e){t.seq.push(e),t.map[e.id]=e}function jI(t,e,n){const i=t.name,r=i.length;for(Bf.lastIndex=0;;){const s=Bf.exec(i),a=Bf.lastIndex;let o=s[1];const l=s[2]==="]",c=s[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===r){R_(n,c===void 0?new VI(o,t,e):new GI(o,t,e));break}else{let f=n.map[o];f===void 0&&(f=new HI(o),R_(n,f)),n=f}}}class tu{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let a=0;a<i;++a){const o=e.getActiveUniform(n,a),l=e.getUniformLocation(n,o.name);jI(o,l,this)}const r=[],s=[];for(const a of this.seq)a.type===e.SAMPLER_2D_SHADOW||a.type===e.SAMPLER_CUBE_SHADOW||a.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(a):s.push(a);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function P_(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const WI=37297;let $I=0;function XI(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}const D_=new He;function YI(t){et._getMatrix(D_,et.workingColorSpace,t);const e=`mat3( ${D_.elements.map(n=>n.toFixed(4))} )`;switch(et.getTransfer(t)){case Ou:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return Be("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function N_(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const a=/ERROR: 0:(\d+)/.exec(s);if(a){const o=parseInt(a[1]);return n.toUpperCase()+`

`+s+`

`+XI(t.getShaderSource(e),o)}else return s}function KI(t,e){const n=YI(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const qI={[Q1]:"Linear",[eE]:"Reinhard",[tE]:"Cineon",[nE]:"ACESFilmic",[rE]:"AgX",[sE]:"Neutral",[iE]:"Custom"};function ZI(t,e){const n=qI[e];return n===void 0?(Be("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Cc=new L;function JI(){et.getLuminanceCoefficients(Cc);const t=Cc.x.toFixed(4),e=Cc.y.toFixed(4),n=Cc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function QI(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wo).join(`
`)}function eU(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function tU(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function wo(t){return t!==""}function L_(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function I_(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const nU=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zp(t){return t.replace(nU,rU)}const iU=new Map;function rU(t,e){let n=Ye[e];if(n===void 0){const i=iU.get(e);if(i!==void 0)n=Ye[i],Be('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Zp(n)}const sU=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function U_(t){return t.replace(sU,aU)}function aU(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function F_(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}const oU={[qc]:"SHADOWMAP_TYPE_PCF",[Eo]:"SHADOWMAP_TYPE_VSM"};function lU(t){return oU[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const cU={[Rs]:"ENVMAP_TYPE_CUBE",[Va]:"ENVMAP_TYPE_CUBE",[hd]:"ENVMAP_TYPE_CUBE_UV"};function uU(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":cU[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const dU={[Va]:"ENVMAP_MODE_REFRACTION"};function fU(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":dU[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const hU={[J1]:"ENVMAP_BLENDING_MULTIPLY",[R2]:"ENVMAP_BLENDING_MIX",[P2]:"ENVMAP_BLENDING_ADD"};function pU(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":hU[t.combine]||"ENVMAP_BLENDING_NONE"}function mU(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function gU(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=lU(n),c=uU(n),u=fU(n),f=pU(n),d=mU(n),p=QI(n),v=eU(s),y=r.createProgram();let g,h,m=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(wo).join(`
`),g.length>0&&(g+=`
`),h=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(wo).join(`
`),h.length>0&&(h+=`
`)):(g=[F_(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wo).join(`
`),h=[F_(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Ii?"#define TONE_MAPPING":"",n.toneMapping!==Ii?Ye.tonemapping_pars_fragment:"",n.toneMapping!==Ii?ZI("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ye.colorspace_pars_fragment,KI("linearToOutputTexel",n.outputColorSpace),JI(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(wo).join(`
`)),a=Zp(a),a=L_(a,n),a=I_(a,n),o=Zp(o),o=L_(o,n),o=I_(o,n),a=U_(a),o=U_(o),n.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,h=["#define varying in",n.glslVersion===Wx?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Wx?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const _=m+g+a,M=m+h+o,w=P_(r,r.VERTEX_SHADER,_),T=P_(r,r.FRAGMENT_SHADER,M);r.attachShader(y,w),r.attachShader(y,T),n.index0AttributeName!==void 0?r.bindAttribLocation(y,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function R(D){if(t.debug.checkShaderErrors){const I=r.getProgramInfoLog(y)||"",X=r.getShaderInfoLog(w)||"",G=r.getShaderInfoLog(T)||"",U=I.trim(),H=X.trim(),B=G.trim();let F=!0,K=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(F=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,y,w,T);else{const Y=N_(r,w,"vertex"),re=N_(r,T,"fragment");it("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+U+`
`+Y+`
`+re)}else U!==""?Be("WebGLProgram: Program Info Log:",U):(H===""||B==="")&&(K=!1);K&&(D.diagnostics={runnable:F,programLog:U,vertexShader:{log:H,prefix:g},fragmentShader:{log:B,prefix:h}})}r.deleteShader(w),r.deleteShader(T),S=new tu(r,y),A=tU(r,y)}let S;this.getUniforms=function(){return S===void 0&&R(this),S};let A;this.getAttributes=function(){return A===void 0&&R(this),A};let N=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return N===!1&&(N=r.getProgramParameter(y,WI)),N},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=$I++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=w,this.fragmentShader=T,this}let vU=0;class xU{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new _U(e),n.set(e,i)),i}}class _U{constructor(e){this.id=vU++,this.code=e,this.usedTimes=0}}function yU(t){return t===Ps||t===Iu||t===Uu}function SU(t,e,n,i,r,s){const a=new gE,o=new xU,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer;let d=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(S){return l.add(S),S===0?"uv":`uv${S}`}function y(S,A,N,D,I,X){const G=D.fog,U=I.geometry,H=S.isMeshStandardMaterial||S.isMeshLambertMaterial||S.isMeshPhongMaterial?D.environment:null,B=S.isMeshStandardMaterial||S.isMeshLambertMaterial&&!S.envMap||S.isMeshPhongMaterial&&!S.envMap,F=e.get(S.envMap||H,B),K=F&&F.mapping===hd?F.image.height:null,Y=p[S.type];S.precision!==null&&(d=i.getMaxPrecision(S.precision),d!==S.precision&&Be("WebGLProgram.getParameters:",S.precision,"not supported, using",d,"instead."));const re=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,oe=re!==void 0?re.length:0;let xe=0;U.morphAttributes.position!==void 0&&(xe=1),U.morphAttributes.normal!==void 0&&(xe=2),U.morphAttributes.color!==void 0&&(xe=3);let Pe,Ae,Q,le;if(Y){const je=Mn[Y];Pe=je.vertexShader,Ae=je.fragmentShader}else Pe=S.vertexShader,Ae=S.fragmentShader,o.update(S),Q=o.getVertexShaderID(S),le=o.getFragmentShaderID(S);const ue=t.getRenderTarget(),Ce=t.state.buffers.depth.getReversed(),Oe=I.isInstancedMesh===!0,_e=I.isBatchedMesh===!0,Je=!!S.map,Ne=!!S.matcap,Qe=!!F,tt=!!S.aoMap,Ve=!!S.lightMap,vt=!!S.bumpMap,ot=!!S.normalMap,Nt=!!S.displacementMap,P=!!S.emissiveMap,Ie=!!S.metalnessMap,Re=!!S.roughnessMap,ze=S.anisotropy>0,ae=S.clearcoat>0,Me=S.dispersion>0,C=S.iridescence>0,E=S.sheen>0,k=S.transmission>0,j=ze&&!!S.anisotropyMap,te=ae&&!!S.clearcoatMap,Z=ae&&!!S.clearcoatNormalMap,ie=ae&&!!S.clearcoatRoughnessMap,J=C&&!!S.iridescenceMap,ee=C&&!!S.iridescenceThicknessMap,me=E&&!!S.sheenColorMap,ye=E&&!!S.sheenRoughnessMap,fe=!!S.specularMap,de=!!S.specularColorMap,Ge=!!S.specularIntensityMap,Xe=k&&!!S.transmissionMap,st=k&&!!S.thicknessMap,O=!!S.gradientMap,he=!!S.alphaMap,ne=S.alphaTest>0,Ee=!!S.alphaHash,pe=!!S.extensions;let se=Ii;S.toneMapped&&(ue===null||ue.isXRRenderTarget===!0)&&(se=t.toneMapping);const Le={shaderID:Y,shaderType:S.type,shaderName:S.name,vertexShader:Pe,fragmentShader:Ae,defines:S.defines,customVertexShaderID:Q,customFragmentShaderID:le,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:d,batching:_e,batchingColor:_e&&I._colorsTexture!==null,instancing:Oe,instancingColor:Oe&&I.instanceColor!==null,instancingMorph:Oe&&I.morphTexture!==null,outputColorSpace:ue===null?t.outputColorSpace:ue.isXRRenderTarget===!0?ue.texture.colorSpace:et.workingColorSpace,alphaToCoverage:!!S.alphaToCoverage,map:Je,matcap:Ne,envMap:Qe,envMapMode:Qe&&F.mapping,envMapCubeUVHeight:K,aoMap:tt,lightMap:Ve,bumpMap:vt,normalMap:ot,displacementMap:Nt,emissiveMap:P,normalMapObjectSpace:ot&&S.normalMapType===L2,normalMapTangentSpace:ot&&S.normalMapType===$p,packedNormalMap:ot&&S.normalMapType===$p&&yU(S.normalMap.format),metalnessMap:Ie,roughnessMap:Re,anisotropy:ze,anisotropyMap:j,clearcoat:ae,clearcoatMap:te,clearcoatNormalMap:Z,clearcoatRoughnessMap:ie,dispersion:Me,iridescence:C,iridescenceMap:J,iridescenceThicknessMap:ee,sheen:E,sheenColorMap:me,sheenRoughnessMap:ye,specularMap:fe,specularColorMap:de,specularIntensityMap:Ge,transmission:k,transmissionMap:Xe,thicknessMap:st,gradientMap:O,opaque:S.transparent===!1&&S.blending===ba&&S.alphaToCoverage===!1,alphaMap:he,alphaTest:ne,alphaHash:Ee,combine:S.combine,mapUv:Je&&v(S.map.channel),aoMapUv:tt&&v(S.aoMap.channel),lightMapUv:Ve&&v(S.lightMap.channel),bumpMapUv:vt&&v(S.bumpMap.channel),normalMapUv:ot&&v(S.normalMap.channel),displacementMapUv:Nt&&v(S.displacementMap.channel),emissiveMapUv:P&&v(S.emissiveMap.channel),metalnessMapUv:Ie&&v(S.metalnessMap.channel),roughnessMapUv:Re&&v(S.roughnessMap.channel),anisotropyMapUv:j&&v(S.anisotropyMap.channel),clearcoatMapUv:te&&v(S.clearcoatMap.channel),clearcoatNormalMapUv:Z&&v(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ie&&v(S.clearcoatRoughnessMap.channel),iridescenceMapUv:J&&v(S.iridescenceMap.channel),iridescenceThicknessMapUv:ee&&v(S.iridescenceThicknessMap.channel),sheenColorMapUv:me&&v(S.sheenColorMap.channel),sheenRoughnessMapUv:ye&&v(S.sheenRoughnessMap.channel),specularMapUv:fe&&v(S.specularMap.channel),specularColorMapUv:de&&v(S.specularColorMap.channel),specularIntensityMapUv:Ge&&v(S.specularIntensityMap.channel),transmissionMapUv:Xe&&v(S.transmissionMap.channel),thicknessMapUv:st&&v(S.thicknessMap.channel),alphaMapUv:he&&v(S.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ot||ze),vertexNormals:!!U.attributes.normal,vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:I.isPoints===!0&&!!U.attributes.uv&&(Je||he),fog:!!G,useFog:S.fog===!0,fogExp2:!!G&&G.isFogExp2,flatShading:S.wireframe===!1&&(S.flatShading===!0||U.attributes.normal===void 0&&ot===!1&&(S.isMeshLambertMaterial||S.isMeshPhongMaterial||S.isMeshStandardMaterial||S.isMeshPhysicalMaterial)),sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ce,skinning:I.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:oe,morphTextureStride:xe,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:X.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:S.dithering,shadowMapEnabled:t.shadowMap.enabled&&N.length>0,shadowMapType:t.shadowMap.type,toneMapping:se,decodeVideoTexture:Je&&S.map.isVideoTexture===!0&&et.getTransfer(S.map.colorSpace)===lt,decodeVideoTextureEmissive:P&&S.emissiveMap.isVideoTexture===!0&&et.getTransfer(S.emissiveMap.colorSpace)===lt,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===wi,flipSided:S.side===An,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:pe&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(pe&&S.extensions.multiDraw===!0||_e)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return Le.vertexUv1s=l.has(1),Le.vertexUv2s=l.has(2),Le.vertexUv3s=l.has(3),l.clear(),Le}function g(S){const A=[];if(S.shaderID?A.push(S.shaderID):(A.push(S.customVertexShaderID),A.push(S.customFragmentShaderID)),S.defines!==void 0)for(const N in S.defines)A.push(N),A.push(S.defines[N]);return S.isRawShaderMaterial===!1&&(h(A,S),m(A,S),A.push(t.outputColorSpace)),A.push(S.customProgramCacheKey),A.join()}function h(S,A){S.push(A.precision),S.push(A.outputColorSpace),S.push(A.envMapMode),S.push(A.envMapCubeUVHeight),S.push(A.mapUv),S.push(A.alphaMapUv),S.push(A.lightMapUv),S.push(A.aoMapUv),S.push(A.bumpMapUv),S.push(A.normalMapUv),S.push(A.displacementMapUv),S.push(A.emissiveMapUv),S.push(A.metalnessMapUv),S.push(A.roughnessMapUv),S.push(A.anisotropyMapUv),S.push(A.clearcoatMapUv),S.push(A.clearcoatNormalMapUv),S.push(A.clearcoatRoughnessMapUv),S.push(A.iridescenceMapUv),S.push(A.iridescenceThicknessMapUv),S.push(A.sheenColorMapUv),S.push(A.sheenRoughnessMapUv),S.push(A.specularMapUv),S.push(A.specularColorMapUv),S.push(A.specularIntensityMapUv),S.push(A.transmissionMapUv),S.push(A.thicknessMapUv),S.push(A.combine),S.push(A.fogExp2),S.push(A.sizeAttenuation),S.push(A.morphTargetsCount),S.push(A.morphAttributeCount),S.push(A.numDirLights),S.push(A.numPointLights),S.push(A.numSpotLights),S.push(A.numSpotLightMaps),S.push(A.numHemiLights),S.push(A.numRectAreaLights),S.push(A.numDirLightShadows),S.push(A.numPointLightShadows),S.push(A.numSpotLightShadows),S.push(A.numSpotLightShadowsWithMaps),S.push(A.numLightProbes),S.push(A.shadowMapType),S.push(A.toneMapping),S.push(A.numClippingPlanes),S.push(A.numClipIntersection),S.push(A.depthPacking)}function m(S,A){a.disableAll(),A.instancing&&a.enable(0),A.instancingColor&&a.enable(1),A.instancingMorph&&a.enable(2),A.matcap&&a.enable(3),A.envMap&&a.enable(4),A.normalMapObjectSpace&&a.enable(5),A.normalMapTangentSpace&&a.enable(6),A.clearcoat&&a.enable(7),A.iridescence&&a.enable(8),A.alphaTest&&a.enable(9),A.vertexColors&&a.enable(10),A.vertexAlphas&&a.enable(11),A.vertexUv1s&&a.enable(12),A.vertexUv2s&&a.enable(13),A.vertexUv3s&&a.enable(14),A.vertexTangents&&a.enable(15),A.anisotropy&&a.enable(16),A.alphaHash&&a.enable(17),A.batching&&a.enable(18),A.dispersion&&a.enable(19),A.batchingColor&&a.enable(20),A.gradientMap&&a.enable(21),A.packedNormalMap&&a.enable(22),A.vertexNormals&&a.enable(23),S.push(a.mask),a.disableAll(),A.fog&&a.enable(0),A.useFog&&a.enable(1),A.flatShading&&a.enable(2),A.logarithmicDepthBuffer&&a.enable(3),A.reversedDepthBuffer&&a.enable(4),A.skinning&&a.enable(5),A.morphTargets&&a.enable(6),A.morphNormals&&a.enable(7),A.morphColors&&a.enable(8),A.premultipliedAlpha&&a.enable(9),A.shadowMapEnabled&&a.enable(10),A.doubleSided&&a.enable(11),A.flipSided&&a.enable(12),A.useDepthPacking&&a.enable(13),A.dithering&&a.enable(14),A.transmission&&a.enable(15),A.sheen&&a.enable(16),A.opaque&&a.enable(17),A.pointsUvs&&a.enable(18),A.decodeVideoTexture&&a.enable(19),A.decodeVideoTextureEmissive&&a.enable(20),A.alphaToCoverage&&a.enable(21),A.numLightProbeGrids>0&&a.enable(22),S.push(a.mask)}function _(S){const A=p[S.type];let N;if(A){const D=Mn[A];N=$g.clone(D.uniforms)}else N=S.uniforms;return N}function M(S,A){let N=u.get(A);return N!==void 0?++N.usedTimes:(N=new gU(t,A,S,r),c.push(N),u.set(A,N)),N}function w(S){if(--S.usedTimes===0){const A=c.indexOf(S);c[A]=c[c.length-1],c.pop(),u.delete(S.cacheKey),S.destroy()}}function T(S){o.remove(S)}function R(){o.dispose()}return{getParameters:y,getProgramCacheKey:g,getUniforms:_,acquireProgram:M,releaseProgram:w,releaseShaderCache:T,programs:c,dispose:R}}function MU(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function EU(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function O_(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function k_(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(d){let p=0;return d.isInstancedMesh&&(p+=2),d.isSkinnedMesh&&(p+=1),p}function o(d,p,v,y,g,h){let m=t[e];return m===void 0?(m={id:d.id,object:d,geometry:p,material:v,materialVariant:a(d),groupOrder:y,renderOrder:d.renderOrder,z:g,group:h},t[e]=m):(m.id=d.id,m.object=d,m.geometry=p,m.material=v,m.materialVariant=a(d),m.groupOrder=y,m.renderOrder=d.renderOrder,m.z=g,m.group=h),e++,m}function l(d,p,v,y,g,h){const m=o(d,p,v,y,g,h);v.transmission>0?i.push(m):v.transparent===!0?r.push(m):n.push(m)}function c(d,p,v,y,g,h){const m=o(d,p,v,y,g,h);v.transmission>0?i.unshift(m):v.transparent===!0?r.unshift(m):n.unshift(m)}function u(d,p){n.length>1&&n.sort(d||EU),i.length>1&&i.sort(p||O_),r.length>1&&r.sort(p||O_)}function f(){for(let d=e,p=t.length;d<p;d++){const v=t[d];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:f,sort:u}}function TU(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new k_,t.set(i,[a])):r>=s.length?(a=new k_,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function wU(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new L,color:new at};break;case"SpotLight":n={position:new L,direction:new L,color:new at,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new L,color:new at,distance:0,decay:0};break;case"HemisphereLight":n={direction:new L,skyColor:new at,groundColor:new at};break;case"RectAreaLight":n={color:new at,position:new L,halfWidth:new L,halfHeight:new L};break}return t[e.id]=n,n}}}function bU(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ze,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let AU=0;function CU(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function RU(t){const e=new wU,n=bU(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const r=new L,s=new Dt,a=new Dt;function o(c){let u=0,f=0,d=0;for(let A=0;A<9;A++)i.probe[A].set(0,0,0);let p=0,v=0,y=0,g=0,h=0,m=0,_=0,M=0,w=0,T=0,R=0;c.sort(CU);for(let A=0,N=c.length;A<N;A++){const D=c[A],I=D.color,X=D.intensity,G=D.distance;let U=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===Ps?U=D.shadow.map.texture:U=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=I.r*X,f+=I.g*X,d+=I.b*X;else if(D.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(D.sh.coefficients[H],X);R++}else if(D.isDirectionalLight){const H=e.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const B=D.shadow,F=n.get(D);F.shadowIntensity=B.intensity,F.shadowBias=B.bias,F.shadowNormalBias=B.normalBias,F.shadowRadius=B.radius,F.shadowMapSize=B.mapSize,i.directionalShadow[p]=F,i.directionalShadowMap[p]=U,i.directionalShadowMatrix[p]=D.shadow.matrix,m++}i.directional[p]=H,p++}else if(D.isSpotLight){const H=e.get(D);H.position.setFromMatrixPosition(D.matrixWorld),H.color.copy(I).multiplyScalar(X),H.distance=G,H.coneCos=Math.cos(D.angle),H.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),H.decay=D.decay,i.spot[y]=H;const B=D.shadow;if(D.map&&(i.spotLightMap[w]=D.map,w++,B.updateMatrices(D),D.castShadow&&T++),i.spotLightMatrix[y]=B.matrix,D.castShadow){const F=n.get(D);F.shadowIntensity=B.intensity,F.shadowBias=B.bias,F.shadowNormalBias=B.normalBias,F.shadowRadius=B.radius,F.shadowMapSize=B.mapSize,i.spotShadow[y]=F,i.spotShadowMap[y]=U,M++}y++}else if(D.isRectAreaLight){const H=e.get(D);H.color.copy(I).multiplyScalar(X),H.halfWidth.set(D.width*.5,0,0),H.halfHeight.set(0,D.height*.5,0),i.rectArea[g]=H,g++}else if(D.isPointLight){const H=e.get(D);if(H.color.copy(D.color).multiplyScalar(D.intensity),H.distance=D.distance,H.decay=D.decay,D.castShadow){const B=D.shadow,F=n.get(D);F.shadowIntensity=B.intensity,F.shadowBias=B.bias,F.shadowNormalBias=B.normalBias,F.shadowRadius=B.radius,F.shadowMapSize=B.mapSize,F.shadowCameraNear=B.camera.near,F.shadowCameraFar=B.camera.far,i.pointShadow[v]=F,i.pointShadowMap[v]=U,i.pointShadowMatrix[v]=D.shadow.matrix,_++}i.point[v]=H,v++}else if(D.isHemisphereLight){const H=e.get(D);H.skyColor.copy(D.color).multiplyScalar(X),H.groundColor.copy(D.groundColor).multiplyScalar(X),i.hemi[h]=H,h++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ge.LTC_FLOAT_1,i.rectAreaLTC2=ge.LTC_FLOAT_2):(i.rectAreaLTC1=ge.LTC_HALF_1,i.rectAreaLTC2=ge.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=d;const S=i.hash;(S.directionalLength!==p||S.pointLength!==v||S.spotLength!==y||S.rectAreaLength!==g||S.hemiLength!==h||S.numDirectionalShadows!==m||S.numPointShadows!==_||S.numSpotShadows!==M||S.numSpotMaps!==w||S.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=y,i.rectArea.length=g,i.point.length=v,i.hemi.length=h,i.directionalShadow.length=m,i.directionalShadowMap.length=m,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=m,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=M+w-T,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,S.directionalLength=p,S.pointLength=v,S.spotLength=y,S.rectAreaLength=g,S.hemiLength=h,S.numDirectionalShadows=m,S.numPointShadows=_,S.numSpotShadows=M,S.numSpotMaps=w,S.numLightProbes=R,i.version=AU++)}function l(c,u){let f=0,d=0,p=0,v=0,y=0;const g=u.matrixWorldInverse;for(let h=0,m=c.length;h<m;h++){const _=c[h];if(_.isDirectionalLight){const M=i.directional[f];M.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),f++}else if(_.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),p++}else if(_.isRectAreaLight){const M=i.rectArea[v];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(g),a.identity(),s.copy(_.matrixWorld),s.premultiply(g),a.extractRotation(s),M.halfWidth.set(_.width*.5,0,0),M.halfHeight.set(0,_.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),v++}else if(_.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){const M=i.hemi[y];M.direction.setFromMatrixPosition(_.matrixWorld),M.direction.transformDirection(g),y++}}}return{setup:o,setupView:l,state:i}}function B_(t){const e=new RU(t),n=[],i=[],r=[];function s(d){f.camera=d,n.length=0,i.length=0,r.length=0}function a(d){n.push(d)}function o(d){i.push(d)}function l(d){r.push(d)}function c(){e.setup(n)}function u(d){e.setupView(n,d)}const f={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:u,pushLight:a,pushShadow:o,pushLightProbeGrid:l}}function PU(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new B_(t),e.set(r,[o])):s>=a.length?(o=new B_(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}const DU=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,NU=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,LU=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],IU=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],z_=new Dt,ho=new L,zf=new L;function UU(t,e,n){let i=new zg;const r=new Ze,s=new Ze,a=new gt,o=new z3,l=new V3,c={},u=n.maxTextureSize,f={[jr]:An,[An]:jr,[wi]:wi},d=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ze},radius:{value:4}},vertexShader:DU,fragmentShader:NU}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const v=new Cn;v.setAttribute("position",new hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new ei(v,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=qc;let h=this.type;this.render=function(T,R,S){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===u2&&(Be("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=qc);const A=t.getRenderTarget(),N=t.getActiveCubeFace(),D=t.getActiveMipmapLevel(),I=t.state;I.setBlending(Ji),I.buffers.depth.getReversed()===!0?I.buffers.color.setClear(0,0,0,0):I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const X=h!==this.type;X&&R.traverse(function(G){G.material&&(Array.isArray(G.material)?G.material.forEach(U=>U.needsUpdate=!0):G.material.needsUpdate=!0)});for(let G=0,U=T.length;G<U;G++){const H=T[G],B=H.shadow;if(B===void 0){Be("WebGLShadowMap:",H,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const F=B.getFrameExtents();r.multiply(F),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/F.x),r.x=s.x*F.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/F.y),r.y=s.y*F.y,B.mapSize.y=s.y));const K=t.state.buffers.depth.getReversed();if(B.camera._reversedDepth=K,B.map===null||X===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===Eo){if(H.isPointLight){Be("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Ui(r.x,r.y,{format:Ps,type:or,minFilter:dn,magFilter:dn,generateMipmaps:!1}),B.map.texture.name=H.name+".shadowMap",B.map.depthTexture=new Ga(r.x,r.y,Ai),B.map.depthTexture.name=H.name+".shadowMapDepth",B.map.depthTexture.format=lr,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Qt,B.map.depthTexture.magFilter=Qt}else H.isPointLight?(B.map=new CE(r.x),B.map.depthTexture=new N3(r.x,Oi)):(B.map=new Ui(r.x,r.y),B.map.depthTexture=new Ga(r.x,r.y,Oi)),B.map.depthTexture.name=H.name+".shadowMap",B.map.depthTexture.format=lr,this.type===qc?(B.map.depthTexture.compareFunction=K?Fg:Ug,B.map.depthTexture.minFilter=dn,B.map.depthTexture.magFilter=dn):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Qt,B.map.depthTexture.magFilter=Qt);B.camera.updateProjectionMatrix()}const Y=B.map.isWebGLCubeRenderTarget?6:1;for(let re=0;re<Y;re++){if(B.map.isWebGLCubeRenderTarget)t.setRenderTarget(B.map,re),t.clear();else{re===0&&(t.setRenderTarget(B.map),t.clear());const oe=B.getViewport(re);a.set(s.x*oe.x,s.y*oe.y,s.x*oe.z,s.y*oe.w),I.viewport(a)}if(H.isPointLight){const oe=B.camera,xe=B.matrix,Pe=H.distance||oe.far;Pe!==oe.far&&(oe.far=Pe,oe.updateProjectionMatrix()),ho.setFromMatrixPosition(H.matrixWorld),oe.position.copy(ho),zf.copy(oe.position),zf.add(LU[re]),oe.up.copy(IU[re]),oe.lookAt(zf),oe.updateMatrixWorld(),xe.makeTranslation(-ho.x,-ho.y,-ho.z),z_.multiplyMatrices(oe.projectionMatrix,oe.matrixWorldInverse),B._frustum.setFromProjectionMatrix(z_,oe.coordinateSystem,oe.reversedDepth)}else B.updateMatrices(H);i=B.getFrustum(),M(R,S,B.camera,H,this.type)}B.isPointLightShadow!==!0&&this.type===Eo&&m(B,S),B.needsUpdate=!1}h=this.type,g.needsUpdate=!1,t.setRenderTarget(A,N,D)};function m(T,R){const S=e.update(y);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Ui(r.x,r.y,{format:Ps,type:or})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,t.setRenderTarget(T.mapPass),t.clear(),t.renderBufferDirect(R,null,S,d,y,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,t.setRenderTarget(T.map),t.clear(),t.renderBufferDirect(R,null,S,p,y,null)}function _(T,R,S,A){let N=null;const D=S.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(D!==void 0)N=D;else if(N=S.isPointLight===!0?l:o,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const I=N.uuid,X=R.uuid;let G=c[I];G===void 0&&(G={},c[I]=G);let U=G[X];U===void 0&&(U=N.clone(),G[X]=U,R.addEventListener("dispose",w)),N=U}if(N.visible=R.visible,N.wireframe=R.wireframe,A===Eo?N.side=R.shadowSide!==null?R.shadowSide:R.side:N.side=R.shadowSide!==null?R.shadowSide:f[R.side],N.alphaMap=R.alphaMap,N.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,N.map=R.map,N.clipShadows=R.clipShadows,N.clippingPlanes=R.clippingPlanes,N.clipIntersection=R.clipIntersection,N.displacementMap=R.displacementMap,N.displacementScale=R.displacementScale,N.displacementBias=R.displacementBias,N.wireframeLinewidth=R.wireframeLinewidth,N.linewidth=R.linewidth,S.isPointLight===!0&&N.isMeshDistanceMaterial===!0){const I=t.properties.get(N);I.light=S}return N}function M(T,R,S,A,N){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&N===Eo)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(S.matrixWorldInverse,T.matrixWorld);const X=e.update(T),G=T.material;if(Array.isArray(G)){const U=X.groups;for(let H=0,B=U.length;H<B;H++){const F=U[H],K=G[F.materialIndex];if(K&&K.visible){const Y=_(T,K,A,N);T.onBeforeShadow(t,T,R,S,X,Y,F),t.renderBufferDirect(S,null,X,Y,T,F),T.onAfterShadow(t,T,R,S,X,Y,F)}}}else if(G.visible){const U=_(T,G,A,N);T.onBeforeShadow(t,T,R,S,X,U,null),t.renderBufferDirect(S,null,X,U,T,null),T.onAfterShadow(t,T,R,S,X,U,null)}}const I=T.children;for(let X=0,G=I.length;X<G;X++)M(I[X],R,S,A,N)}function w(T){T.target.removeEventListener("dispose",w);for(const S in c){const A=c[S],N=T.target.uuid;N in A&&(A[N].dispose(),delete A[N])}}}function FU(t,e){function n(){let O=!1;const he=new gt;let ne=null;const Ee=new gt(0,0,0,0);return{setMask:function(pe){ne!==pe&&!O&&(t.colorMask(pe,pe,pe,pe),ne=pe)},setLocked:function(pe){O=pe},setClear:function(pe,se,Le,je,Lt){Lt===!0&&(pe*=je,se*=je,Le*=je),he.set(pe,se,Le,je),Ee.equals(he)===!1&&(t.clearColor(pe,se,Le,je),Ee.copy(he))},reset:function(){O=!1,ne=null,Ee.set(-1,0,0,0)}}}function i(){let O=!1,he=!1,ne=null,Ee=null,pe=null;return{setReversed:function(se){if(he!==se){const Le=e.get("EXT_clip_control");se?Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.ZERO_TO_ONE_EXT):Le.clipControlEXT(Le.LOWER_LEFT_EXT,Le.NEGATIVE_ONE_TO_ONE_EXT),he=se;const je=pe;pe=null,this.setClear(je)}},getReversed:function(){return he},setTest:function(se){se?ue(t.DEPTH_TEST):Ce(t.DEPTH_TEST)},setMask:function(se){ne!==se&&!O&&(t.depthMask(se),ne=se)},setFunc:function(se){if(he&&(se=H2[se]),Ee!==se){switch(se){case op:t.depthFunc(t.NEVER);break;case lp:t.depthFunc(t.ALWAYS);break;case cp:t.depthFunc(t.LESS);break;case za:t.depthFunc(t.LEQUAL);break;case up:t.depthFunc(t.EQUAL);break;case dp:t.depthFunc(t.GEQUAL);break;case fp:t.depthFunc(t.GREATER);break;case hp:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}Ee=se}},setLocked:function(se){O=se},setClear:function(se){pe!==se&&(pe=se,he&&(se=1-se),t.clearDepth(se))},reset:function(){O=!1,ne=null,Ee=null,pe=null,he=!1}}}function r(){let O=!1,he=null,ne=null,Ee=null,pe=null,se=null,Le=null,je=null,Lt=null;return{setTest:function(ft){O||(ft?ue(t.STENCIL_TEST):Ce(t.STENCIL_TEST))},setMask:function(ft){he!==ft&&!O&&(t.stencilMask(ft),he=ft)},setFunc:function(ft,ki,gi){(ne!==ft||Ee!==ki||pe!==gi)&&(t.stencilFunc(ft,ki,gi),ne=ft,Ee=ki,pe=gi)},setOp:function(ft,ki,gi){(se!==ft||Le!==ki||je!==gi)&&(t.stencilOp(ft,ki,gi),se=ft,Le=ki,je=gi)},setLocked:function(ft){O=ft},setClear:function(ft){Lt!==ft&&(t.clearStencil(ft),Lt=ft)},reset:function(){O=!1,he=null,ne=null,Ee=null,pe=null,se=null,Le=null,je=null,Lt=null}}}const s=new n,a=new i,o=new r,l=new WeakMap,c=new WeakMap;let u={},f={},d={},p=new WeakMap,v=[],y=null,g=!1,h=null,m=null,_=null,M=null,w=null,T=null,R=null,S=new at(0,0,0),A=0,N=!1,D=null,I=null,X=null,G=null,U=null;const H=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,F=0;const K=t.getParameter(t.VERSION);K.indexOf("WebGL")!==-1?(F=parseFloat(/^WebGL (\d)/.exec(K)[1]),B=F>=1):K.indexOf("OpenGL ES")!==-1&&(F=parseFloat(/^OpenGL ES (\d)/.exec(K)[1]),B=F>=2);let Y=null,re={};const oe=t.getParameter(t.SCISSOR_BOX),xe=t.getParameter(t.VIEWPORT),Pe=new gt().fromArray(oe),Ae=new gt().fromArray(xe);function Q(O,he,ne,Ee){const pe=new Uint8Array(4),se=t.createTexture();t.bindTexture(O,se),t.texParameteri(O,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(O,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Le=0;Le<ne;Le++)O===t.TEXTURE_3D||O===t.TEXTURE_2D_ARRAY?t.texImage3D(he,0,t.RGBA,1,1,Ee,0,t.RGBA,t.UNSIGNED_BYTE,pe):t.texImage2D(he+Le,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,pe);return se}const le={};le[t.TEXTURE_2D]=Q(t.TEXTURE_2D,t.TEXTURE_2D,1),le[t.TEXTURE_CUBE_MAP]=Q(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[t.TEXTURE_2D_ARRAY]=Q(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),le[t.TEXTURE_3D]=Q(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),a.setClear(1),o.setClear(0),ue(t.DEPTH_TEST),a.setFunc(za),vt(!1),ot(zx),ue(t.CULL_FACE),tt(Ji);function ue(O){u[O]!==!0&&(t.enable(O),u[O]=!0)}function Ce(O){u[O]!==!1&&(t.disable(O),u[O]=!1)}function Oe(O,he){return d[O]!==he?(t.bindFramebuffer(O,he),d[O]=he,O===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=he),O===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=he),!0):!1}function _e(O,he){let ne=v,Ee=!1;if(O){ne=p.get(he),ne===void 0&&(ne=[],p.set(he,ne));const pe=O.textures;if(ne.length!==pe.length||ne[0]!==t.COLOR_ATTACHMENT0){for(let se=0,Le=pe.length;se<Le;se++)ne[se]=t.COLOR_ATTACHMENT0+se;ne.length=pe.length,Ee=!0}}else ne[0]!==t.BACK&&(ne[0]=t.BACK,Ee=!0);Ee&&t.drawBuffers(ne)}function Je(O){return y!==O?(t.useProgram(O),y=O,!0):!1}const Ne={[cs]:t.FUNC_ADD,[f2]:t.FUNC_SUBTRACT,[h2]:t.FUNC_REVERSE_SUBTRACT};Ne[p2]=t.MIN,Ne[m2]=t.MAX;const Qe={[g2]:t.ZERO,[v2]:t.ONE,[x2]:t.SRC_COLOR,[sp]:t.SRC_ALPHA,[T2]:t.SRC_ALPHA_SATURATE,[M2]:t.DST_COLOR,[y2]:t.DST_ALPHA,[_2]:t.ONE_MINUS_SRC_COLOR,[ap]:t.ONE_MINUS_SRC_ALPHA,[E2]:t.ONE_MINUS_DST_COLOR,[S2]:t.ONE_MINUS_DST_ALPHA,[w2]:t.CONSTANT_COLOR,[b2]:t.ONE_MINUS_CONSTANT_COLOR,[A2]:t.CONSTANT_ALPHA,[C2]:t.ONE_MINUS_CONSTANT_ALPHA};function tt(O,he,ne,Ee,pe,se,Le,je,Lt,ft){if(O===Ji){g===!0&&(Ce(t.BLEND),g=!1);return}if(g===!1&&(ue(t.BLEND),g=!0),O!==d2){if(O!==h||ft!==N){if((m!==cs||w!==cs)&&(t.blendEquation(t.FUNC_ADD),m=cs,w=cs),ft)switch(O){case ba:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Vx:t.blendFunc(t.ONE,t.ONE);break;case Gx:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Hx:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:it("WebGLState: Invalid blending: ",O);break}else switch(O){case ba:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Vx:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case Gx:it("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Hx:it("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:it("WebGLState: Invalid blending: ",O);break}_=null,M=null,T=null,R=null,S.set(0,0,0),A=0,h=O,N=ft}return}pe=pe||he,se=se||ne,Le=Le||Ee,(he!==m||pe!==w)&&(t.blendEquationSeparate(Ne[he],Ne[pe]),m=he,w=pe),(ne!==_||Ee!==M||se!==T||Le!==R)&&(t.blendFuncSeparate(Qe[ne],Qe[Ee],Qe[se],Qe[Le]),_=ne,M=Ee,T=se,R=Le),(je.equals(S)===!1||Lt!==A)&&(t.blendColor(je.r,je.g,je.b,Lt),S.copy(je),A=Lt),h=O,N=!1}function Ve(O,he){O.side===wi?Ce(t.CULL_FACE):ue(t.CULL_FACE);let ne=O.side===An;he&&(ne=!ne),vt(ne),O.blending===ba&&O.transparent===!1?tt(Ji):tt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),a.setFunc(O.depthFunc),a.setTest(O.depthTest),a.setMask(O.depthWrite),s.setMask(O.colorWrite);const Ee=O.stencilWrite;o.setTest(Ee),Ee&&(o.setMask(O.stencilWriteMask),o.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),o.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),P(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?ue(t.SAMPLE_ALPHA_TO_COVERAGE):Ce(t.SAMPLE_ALPHA_TO_COVERAGE)}function vt(O){D!==O&&(O?t.frontFace(t.CW):t.frontFace(t.CCW),D=O)}function ot(O){O!==l2?(ue(t.CULL_FACE),O!==I&&(O===zx?t.cullFace(t.BACK):O===c2?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ce(t.CULL_FACE),I=O}function Nt(O){O!==X&&(B&&t.lineWidth(O),X=O)}function P(O,he,ne){O?(ue(t.POLYGON_OFFSET_FILL),(G!==he||U!==ne)&&(G=he,U=ne,a.getReversed()&&(he=-he),t.polygonOffset(he,ne))):Ce(t.POLYGON_OFFSET_FILL)}function Ie(O){O?ue(t.SCISSOR_TEST):Ce(t.SCISSOR_TEST)}function Re(O){O===void 0&&(O=t.TEXTURE0+H-1),Y!==O&&(t.activeTexture(O),Y=O)}function ze(O,he,ne){ne===void 0&&(Y===null?ne=t.TEXTURE0+H-1:ne=Y);let Ee=re[ne];Ee===void 0&&(Ee={type:void 0,texture:void 0},re[ne]=Ee),(Ee.type!==O||Ee.texture!==he)&&(Y!==ne&&(t.activeTexture(ne),Y=ne),t.bindTexture(O,he||le[O]),Ee.type=O,Ee.texture=he)}function ae(){const O=re[Y];O!==void 0&&O.type!==void 0&&(t.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function Me(){try{t.compressedTexImage2D(...arguments)}catch(O){it("WebGLState:",O)}}function C(){try{t.compressedTexImage3D(...arguments)}catch(O){it("WebGLState:",O)}}function E(){try{t.texSubImage2D(...arguments)}catch(O){it("WebGLState:",O)}}function k(){try{t.texSubImage3D(...arguments)}catch(O){it("WebGLState:",O)}}function j(){try{t.compressedTexSubImage2D(...arguments)}catch(O){it("WebGLState:",O)}}function te(){try{t.compressedTexSubImage3D(...arguments)}catch(O){it("WebGLState:",O)}}function Z(){try{t.texStorage2D(...arguments)}catch(O){it("WebGLState:",O)}}function ie(){try{t.texStorage3D(...arguments)}catch(O){it("WebGLState:",O)}}function J(){try{t.texImage2D(...arguments)}catch(O){it("WebGLState:",O)}}function ee(){try{t.texImage3D(...arguments)}catch(O){it("WebGLState:",O)}}function me(O){return f[O]!==void 0?f[O]:t.getParameter(O)}function ye(O,he){f[O]!==he&&(t.pixelStorei(O,he),f[O]=he)}function fe(O){Pe.equals(O)===!1&&(t.scissor(O.x,O.y,O.z,O.w),Pe.copy(O))}function de(O){Ae.equals(O)===!1&&(t.viewport(O.x,O.y,O.z,O.w),Ae.copy(O))}function Ge(O,he){let ne=c.get(he);ne===void 0&&(ne=new WeakMap,c.set(he,ne));let Ee=ne.get(O);Ee===void 0&&(Ee=t.getUniformBlockIndex(he,O.name),ne.set(O,Ee))}function Xe(O,he){const Ee=c.get(he).get(O);l.get(he)!==Ee&&(t.uniformBlockBinding(he,Ee,O.__bindingPointIndex),l.set(he,Ee))}function st(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),a.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},f={},Y=null,re={},d={},p=new WeakMap,v=[],y=null,g=!1,h=null,m=null,_=null,M=null,w=null,T=null,R=null,S=new at(0,0,0),A=0,N=!1,D=null,I=null,X=null,G=null,U=null,Pe.set(0,0,t.canvas.width,t.canvas.height),Ae.set(0,0,t.canvas.width,t.canvas.height),s.reset(),a.reset(),o.reset()}return{buffers:{color:s,depth:a,stencil:o},enable:ue,disable:Ce,bindFramebuffer:Oe,drawBuffers:_e,useProgram:Je,setBlending:tt,setMaterial:Ve,setFlipSided:vt,setCullFace:ot,setLineWidth:Nt,setPolygonOffset:P,setScissorTest:Ie,activeTexture:Re,bindTexture:ze,unbindTexture:ae,compressedTexImage2D:Me,compressedTexImage3D:C,texImage2D:J,texImage3D:ee,pixelStorei:ye,getParameter:me,updateUBOMapping:Ge,uniformBlockBinding:Xe,texStorage2D:Z,texStorage3D:ie,texSubImage2D:E,texSubImage3D:k,compressedTexSubImage2D:j,compressedTexSubImage3D:te,scissor:fe,viewport:de,reset:st}}function OU(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ze,u=new WeakMap,f=new Set;let d;const p=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(C,E){return v?new OffscreenCanvas(C,E):ku("canvas")}function g(C,E,k){let j=1;const te=Me(C);if((te.width>k||te.height>k)&&(j=k/Math.max(te.width,te.height)),j<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){const Z=Math.floor(j*te.width),ie=Math.floor(j*te.height);d===void 0&&(d=y(Z,ie));const J=E?y(Z,ie):d;return J.width=Z,J.height=ie,J.getContext("2d").drawImage(C,0,0,Z,ie),Be("WebGLRenderer: Texture has been resized from ("+te.width+"x"+te.height+") to ("+Z+"x"+ie+")."),J}else return"data"in C&&Be("WebGLRenderer: Image in DataTexture is too big ("+te.width+"x"+te.height+")."),C;return C}function h(C){return C.generateMipmaps}function m(C){t.generateMipmap(C)}function _(C){return C.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?t.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function M(C,E,k,j,te,Z=!1){if(C!==null){if(t[C]!==void 0)return t[C];Be("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let ie;j&&(ie=e.get("EXT_texture_norm16"),ie||Be("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=E;if(E===t.RED&&(k===t.FLOAT&&(J=t.R32F),k===t.HALF_FLOAT&&(J=t.R16F),k===t.UNSIGNED_BYTE&&(J=t.R8),k===t.UNSIGNED_SHORT&&ie&&(J=ie.R16_EXT),k===t.SHORT&&ie&&(J=ie.R16_SNORM_EXT)),E===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&(J=t.R8UI),k===t.UNSIGNED_SHORT&&(J=t.R16UI),k===t.UNSIGNED_INT&&(J=t.R32UI),k===t.BYTE&&(J=t.R8I),k===t.SHORT&&(J=t.R16I),k===t.INT&&(J=t.R32I)),E===t.RG&&(k===t.FLOAT&&(J=t.RG32F),k===t.HALF_FLOAT&&(J=t.RG16F),k===t.UNSIGNED_BYTE&&(J=t.RG8),k===t.UNSIGNED_SHORT&&ie&&(J=ie.RG16_EXT),k===t.SHORT&&ie&&(J=ie.RG16_SNORM_EXT)),E===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&(J=t.RG8UI),k===t.UNSIGNED_SHORT&&(J=t.RG16UI),k===t.UNSIGNED_INT&&(J=t.RG32UI),k===t.BYTE&&(J=t.RG8I),k===t.SHORT&&(J=t.RG16I),k===t.INT&&(J=t.RG32I)),E===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&(J=t.RGB8UI),k===t.UNSIGNED_SHORT&&(J=t.RGB16UI),k===t.UNSIGNED_INT&&(J=t.RGB32UI),k===t.BYTE&&(J=t.RGB8I),k===t.SHORT&&(J=t.RGB16I),k===t.INT&&(J=t.RGB32I)),E===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&(J=t.RGBA8UI),k===t.UNSIGNED_SHORT&&(J=t.RGBA16UI),k===t.UNSIGNED_INT&&(J=t.RGBA32UI),k===t.BYTE&&(J=t.RGBA8I),k===t.SHORT&&(J=t.RGBA16I),k===t.INT&&(J=t.RGBA32I)),E===t.RGB&&(k===t.UNSIGNED_SHORT&&ie&&(J=ie.RGB16_EXT),k===t.SHORT&&ie&&(J=ie.RGB16_SNORM_EXT),k===t.UNSIGNED_INT_5_9_9_9_REV&&(J=t.RGB9_E5),k===t.UNSIGNED_INT_10F_11F_11F_REV&&(J=t.R11F_G11F_B10F)),E===t.RGBA){const ee=Z?Ou:et.getTransfer(te);k===t.FLOAT&&(J=t.RGBA32F),k===t.HALF_FLOAT&&(J=t.RGBA16F),k===t.UNSIGNED_BYTE&&(J=ee===lt?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT&&ie&&(J=ie.RGBA16_EXT),k===t.SHORT&&ie&&(J=ie.RGBA16_SNORM_EXT),k===t.UNSIGNED_SHORT_4_4_4_4&&(J=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&(J=t.RGB5_A1)}return(J===t.R16F||J===t.R32F||J===t.RG16F||J===t.RG32F||J===t.RGBA16F||J===t.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function w(C,E){let k;return C?E===null||E===Oi||E===pl?k=t.DEPTH24_STENCIL8:E===Ai?k=t.DEPTH32F_STENCIL8:E===hl&&(k=t.DEPTH24_STENCIL8,Be("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Oi||E===pl?k=t.DEPTH_COMPONENT24:E===Ai?k=t.DEPTH_COMPONENT32F:E===hl&&(k=t.DEPTH_COMPONENT16),k}function T(C,E){return h(C)===!0||C.isFramebufferTexture&&C.minFilter!==Qt&&C.minFilter!==dn?Math.log2(Math.max(E.width,E.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?E.mipmaps.length:1}function R(C){const E=C.target;E.removeEventListener("dispose",R),A(E),E.isVideoTexture&&u.delete(E),E.isHTMLTexture&&f.delete(E)}function S(C){const E=C.target;E.removeEventListener("dispose",S),D(E)}function A(C){const E=i.get(C);if(E.__webglInit===void 0)return;const k=C.source,j=p.get(k);if(j){const te=j[E.__cacheKey];te.usedTimes--,te.usedTimes===0&&N(C),Object.keys(j).length===0&&p.delete(k)}i.remove(C)}function N(C){const E=i.get(C);t.deleteTexture(E.__webglTexture);const k=C.source,j=p.get(k);delete j[E.__cacheKey],a.memory.textures--}function D(C){const E=i.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),i.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let j=0;j<6;j++){if(Array.isArray(E.__webglFramebuffer[j]))for(let te=0;te<E.__webglFramebuffer[j].length;te++)t.deleteFramebuffer(E.__webglFramebuffer[j][te]);else t.deleteFramebuffer(E.__webglFramebuffer[j]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[j])}else{if(Array.isArray(E.__webglFramebuffer))for(let j=0;j<E.__webglFramebuffer.length;j++)t.deleteFramebuffer(E.__webglFramebuffer[j]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let j=0;j<E.__webglColorRenderbuffer.length;j++)E.__webglColorRenderbuffer[j]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[j]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const k=C.textures;for(let j=0,te=k.length;j<te;j++){const Z=i.get(k[j]);Z.__webglTexture&&(t.deleteTexture(Z.__webglTexture),a.memory.textures--),i.remove(k[j])}i.remove(C)}let I=0;function X(){I=0}function G(){return I}function U(C){I=C}function H(){const C=I;return C>=r.maxTextures&&Be("WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+r.maxTextures),I+=1,C}function B(C){const E=[];return E.push(C.wrapS),E.push(C.wrapT),E.push(C.wrapR||0),E.push(C.magFilter),E.push(C.minFilter),E.push(C.anisotropy),E.push(C.internalFormat),E.push(C.format),E.push(C.type),E.push(C.generateMipmaps),E.push(C.premultiplyAlpha),E.push(C.flipY),E.push(C.unpackAlignment),E.push(C.colorSpace),E.join()}function F(C,E){const k=i.get(C);if(C.isVideoTexture&&ze(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&k.__version!==C.version){const j=C.image;if(j===null)Be("WebGLRenderer: Texture marked for update but no image data found.");else if(j.complete===!1)Be("WebGLRenderer: Texture marked for update but image is incomplete");else{Ce(k,C,E);return}}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+E)}function K(C,E){const k=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Ce(k,C,E);return}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+E)}function Y(C,E){const k=i.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){Ce(k,C,E);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+E)}function re(C,E){const k=i.get(C);if(C.isCubeDepthTexture!==!0&&C.version>0&&k.__version!==C.version){Oe(k,C,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+E)}const oe={[pp]:t.REPEAT,[Yi]:t.CLAMP_TO_EDGE,[mp]:t.MIRRORED_REPEAT},xe={[Qt]:t.NEAREST,[D2]:t.NEAREST_MIPMAP_NEAREST,[ic]:t.NEAREST_MIPMAP_LINEAR,[dn]:t.LINEAR,[cf]:t.LINEAR_MIPMAP_NEAREST,[vs]:t.LINEAR_MIPMAP_LINEAR},Pe={[I2]:t.NEVER,[B2]:t.ALWAYS,[U2]:t.LESS,[Ug]:t.LEQUAL,[F2]:t.EQUAL,[Fg]:t.GEQUAL,[O2]:t.GREATER,[k2]:t.NOTEQUAL};function Ae(C,E){if(E.type===Ai&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===dn||E.magFilter===cf||E.magFilter===ic||E.magFilter===vs||E.minFilter===dn||E.minFilter===cf||E.minFilter===ic||E.minFilter===vs)&&Be("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(C,t.TEXTURE_WRAP_S,oe[E.wrapS]),t.texParameteri(C,t.TEXTURE_WRAP_T,oe[E.wrapT]),(C===t.TEXTURE_3D||C===t.TEXTURE_2D_ARRAY)&&t.texParameteri(C,t.TEXTURE_WRAP_R,oe[E.wrapR]),t.texParameteri(C,t.TEXTURE_MAG_FILTER,xe[E.magFilter]),t.texParameteri(C,t.TEXTURE_MIN_FILTER,xe[E.minFilter]),E.compareFunction&&(t.texParameteri(C,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(C,t.TEXTURE_COMPARE_FUNC,Pe[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Qt||E.minFilter!==ic&&E.minFilter!==vs||E.type===Ai&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");t.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Q(C,E){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,E.addEventListener("dispose",R));const j=E.source;let te=p.get(j);te===void 0&&(te={},p.set(j,te));const Z=B(E);if(Z!==C.__cacheKey){te[Z]===void 0&&(te[Z]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,k=!0),te[Z].usedTimes++;const ie=te[C.__cacheKey];ie!==void 0&&(te[C.__cacheKey].usedTimes--,ie.usedTimes===0&&N(E)),C.__cacheKey=Z,C.__webglTexture=te[Z].texture}return k}function le(C,E,k){return Math.floor(Math.floor(C/k)/E)}function ue(C,E,k,j){const Z=C.updateRanges;if(Z.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,E.width,E.height,k,j,E.data);else{Z.sort((ye,fe)=>ye.start-fe.start);let ie=0;for(let ye=1;ye<Z.length;ye++){const fe=Z[ie],de=Z[ye],Ge=fe.start+fe.count,Xe=le(de.start,E.width,4),st=le(fe.start,E.width,4);de.start<=Ge+1&&Xe===st&&le(de.start+de.count-1,E.width,4)===Xe?fe.count=Math.max(fe.count,de.start+de.count-fe.start):(++ie,Z[ie]=de)}Z.length=ie+1;const J=n.getParameter(t.UNPACK_ROW_LENGTH),ee=n.getParameter(t.UNPACK_SKIP_PIXELS),me=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,E.width);for(let ye=0,fe=Z.length;ye<fe;ye++){const de=Z[ye],Ge=Math.floor(de.start/4),Xe=Math.ceil(de.count/4),st=Ge%E.width,O=Math.floor(Ge/E.width),he=Xe,ne=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,st),n.pixelStorei(t.UNPACK_SKIP_ROWS,O),n.texSubImage2D(t.TEXTURE_2D,0,st,O,he,ne,k,j,E.data)}C.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,J),n.pixelStorei(t.UNPACK_SKIP_PIXELS,ee),n.pixelStorei(t.UNPACK_SKIP_ROWS,me)}}function Ce(C,E,k){let j=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(j=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(j=t.TEXTURE_3D);const te=Q(C,E),Z=E.source;n.bindTexture(j,C.__webglTexture,t.TEXTURE0+k);const ie=i.get(Z);if(Z.version!==ie.__version||te===!0){if(n.activeTexture(t.TEXTURE0+k),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const ne=et.getPrimaries(et.workingColorSpace),Ee=E.colorSpace===br?null:et.getPrimaries(E.colorSpace),pe=E.colorSpace===br||ne===Ee?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,pe)}n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment);let ee=g(E.image,!1,r.maxTextureSize);ee=ae(E,ee);const me=s.convert(E.format,E.colorSpace),ye=s.convert(E.type);let fe=M(E.internalFormat,me,ye,E.normalized,E.colorSpace,E.isVideoTexture);Ae(j,E);let de;const Ge=E.mipmaps,Xe=E.isVideoTexture!==!0,st=ie.__version===void 0||te===!0,O=Z.dataReady,he=T(E,ee);if(E.isDepthTexture)fe=w(E.format===xs,E.type),st&&(Xe?n.texStorage2D(t.TEXTURE_2D,1,fe,ee.width,ee.height):n.texImage2D(t.TEXTURE_2D,0,fe,ee.width,ee.height,0,me,ye,null));else if(E.isDataTexture)if(Ge.length>0){Xe&&st&&n.texStorage2D(t.TEXTURE_2D,he,fe,Ge[0].width,Ge[0].height);for(let ne=0,Ee=Ge.length;ne<Ee;ne++)de=Ge[ne],Xe?O&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,de.width,de.height,me,ye,de.data):n.texImage2D(t.TEXTURE_2D,ne,fe,de.width,de.height,0,me,ye,de.data);E.generateMipmaps=!1}else Xe?(st&&n.texStorage2D(t.TEXTURE_2D,he,fe,ee.width,ee.height),O&&ue(E,ee,me,ye)):n.texImage2D(t.TEXTURE_2D,0,fe,ee.width,ee.height,0,me,ye,ee.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Xe&&st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,he,fe,Ge[0].width,Ge[0].height,ee.depth);for(let ne=0,Ee=Ge.length;ne<Ee;ne++)if(de=Ge[ne],E.format!==ui)if(me!==null)if(Xe){if(O)if(E.layerUpdates.size>0){const pe=v_(de.width,de.height,E.format,E.type);for(const se of E.layerUpdates){const Le=de.data.subarray(se*pe/de.data.BYTES_PER_ELEMENT,(se+1)*pe/de.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,se,de.width,de.height,1,me,Le)}E.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,ee.depth,me,de.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ne,fe,de.width,de.height,ee.depth,0,de.data,0,0);else Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?O&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ne,0,0,0,de.width,de.height,ee.depth,me,ye,de.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ne,fe,de.width,de.height,ee.depth,0,me,ye,de.data)}else{Xe&&st&&n.texStorage2D(t.TEXTURE_2D,he,fe,Ge[0].width,Ge[0].height);for(let ne=0,Ee=Ge.length;ne<Ee;ne++)de=Ge[ne],E.format!==ui?me!==null?Xe?O&&n.compressedTexSubImage2D(t.TEXTURE_2D,ne,0,0,de.width,de.height,me,de.data):n.compressedTexImage2D(t.TEXTURE_2D,ne,fe,de.width,de.height,0,de.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?O&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,de.width,de.height,me,ye,de.data):n.texImage2D(t.TEXTURE_2D,ne,fe,de.width,de.height,0,me,ye,de.data)}else if(E.isDataArrayTexture)if(Xe){if(st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,he,fe,ee.width,ee.height,ee.depth),O)if(E.layerUpdates.size>0){const ne=v_(ee.width,ee.height,E.format,E.type);for(const Ee of E.layerUpdates){const pe=ee.data.subarray(Ee*ne/ee.data.BYTES_PER_ELEMENT,(Ee+1)*ne/ee.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,Ee,ee.width,ee.height,1,me,ye,pe)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ee.width,ee.height,ee.depth,me,ye,ee.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,fe,ee.width,ee.height,ee.depth,0,me,ye,ee.data);else if(E.isData3DTexture)Xe?(st&&n.texStorage3D(t.TEXTURE_3D,he,fe,ee.width,ee.height,ee.depth),O&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ee.width,ee.height,ee.depth,me,ye,ee.data)):n.texImage3D(t.TEXTURE_3D,0,fe,ee.width,ee.height,ee.depth,0,me,ye,ee.data);else if(E.isFramebufferTexture){if(st)if(Xe)n.texStorage2D(t.TEXTURE_2D,he,fe,ee.width,ee.height);else{let ne=ee.width,Ee=ee.height;for(let pe=0;pe<he;pe++)n.texImage2D(t.TEXTURE_2D,pe,fe,ne,Ee,0,me,ye,null),ne>>=1,Ee>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in t){const ne=t.canvas;if(ne.hasAttribute("layoutsubtree")||ne.setAttribute("layoutsubtree","true"),ee.parentNode!==ne){ne.appendChild(ee),f.add(E),ne.onpaint=je=>{const Lt=je.changedElements;for(const ft of f)Lt.includes(ft.image)&&(ft.needsUpdate=!0)},ne.requestPaint();return}const Ee=0,pe=t.RGBA,se=t.RGBA,Le=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,Ee,pe,se,Le,ee),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(Ge.length>0){if(Xe&&st){const ne=Me(Ge[0]);n.texStorage2D(t.TEXTURE_2D,he,fe,ne.width,ne.height)}for(let ne=0,Ee=Ge.length;ne<Ee;ne++)de=Ge[ne],Xe?O&&n.texSubImage2D(t.TEXTURE_2D,ne,0,0,me,ye,de):n.texImage2D(t.TEXTURE_2D,ne,fe,me,ye,de);E.generateMipmaps=!1}else if(Xe){if(st){const ne=Me(ee);n.texStorage2D(t.TEXTURE_2D,he,fe,ne.width,ne.height)}O&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,me,ye,ee)}else n.texImage2D(t.TEXTURE_2D,0,fe,me,ye,ee);h(E)&&m(j),ie.__version=Z.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function Oe(C,E,k){if(E.image.length!==6)return;const j=Q(C,E),te=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,C.__webglTexture,t.TEXTURE0+k);const Z=i.get(te);if(te.version!==Z.__version||j===!0){n.activeTexture(t.TEXTURE0+k);const ie=et.getPrimaries(et.workingColorSpace),J=E.colorSpace===br?null:et.getPrimaries(E.colorSpace),ee=E.colorSpace===br||ie===J?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ee);const me=E.isCompressedTexture||E.image[0].isCompressedTexture,ye=E.image[0]&&E.image[0].isDataTexture,fe=[];for(let se=0;se<6;se++)!me&&!ye?fe[se]=g(E.image[se],!0,r.maxCubemapSize):fe[se]=ye?E.image[se].image:E.image[se],fe[se]=ae(E,fe[se]);const de=fe[0],Ge=s.convert(E.format,E.colorSpace),Xe=s.convert(E.type),st=M(E.internalFormat,Ge,Xe,E.normalized,E.colorSpace),O=E.isVideoTexture!==!0,he=Z.__version===void 0||j===!0,ne=te.dataReady;let Ee=T(E,de);Ae(t.TEXTURE_CUBE_MAP,E);let pe;if(me){O&&he&&n.texStorage2D(t.TEXTURE_CUBE_MAP,Ee,st,de.width,de.height);for(let se=0;se<6;se++){pe=fe[se].mipmaps;for(let Le=0;Le<pe.length;Le++){const je=pe[Le];E.format!==ui?Ge!==null?O?ne&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le,0,0,je.width,je.height,Ge,je.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le,st,je.width,je.height,0,je.data):Be("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le,0,0,je.width,je.height,Ge,Xe,je.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le,st,je.width,je.height,0,Ge,Xe,je.data)}}}else{if(pe=E.mipmaps,O&&he){pe.length>0&&Ee++;const se=Me(fe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,Ee,st,se.width,se.height)}for(let se=0;se<6;se++)if(ye){O?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,fe[se].width,fe[se].height,Ge,Xe,fe[se].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,st,fe[se].width,fe[se].height,0,Ge,Xe,fe[se].data);for(let Le=0;Le<pe.length;Le++){const Lt=pe[Le].image[se].image;O?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le+1,0,0,Lt.width,Lt.height,Ge,Xe,Lt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le+1,st,Lt.width,Lt.height,0,Ge,Xe,Lt.data)}}else{O?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,0,0,Ge,Xe,fe[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,0,st,Ge,Xe,fe[se]);for(let Le=0;Le<pe.length;Le++){const je=pe[Le];O?ne&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le+1,0,0,Ge,Xe,je.image[se]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+se,Le+1,st,Ge,Xe,je.image[se])}}}h(E)&&m(t.TEXTURE_CUBE_MAP),Z.__version=te.version,E.onUpdate&&E.onUpdate(E)}C.__version=E.version}function _e(C,E,k,j,te,Z){const ie=s.convert(k.format,k.colorSpace),J=s.convert(k.type),ee=M(k.internalFormat,ie,J,k.normalized,k.colorSpace),me=i.get(E),ye=i.get(k);if(ye.__renderTarget=E,!me.__hasExternalTextures){const fe=Math.max(1,E.width>>Z),de=Math.max(1,E.height>>Z);te===t.TEXTURE_3D||te===t.TEXTURE_2D_ARRAY?n.texImage3D(te,Z,ee,fe,de,E.depth,0,ie,J,null):n.texImage2D(te,Z,ee,fe,de,0,ie,J,null)}n.bindFramebuffer(t.FRAMEBUFFER,C),Re(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,j,te,ye.__webglTexture,0,Ie(E)):(te===t.TEXTURE_2D||te>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&te<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,j,te,ye.__webglTexture,Z),n.bindFramebuffer(t.FRAMEBUFFER,null)}function Je(C,E,k){if(t.bindRenderbuffer(t.RENDERBUFFER,C),E.depthBuffer){const j=E.depthTexture,te=j&&j.isDepthTexture?j.type:null,Z=w(E.stencilBuffer,te),ie=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Re(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ie(E),Z,E.width,E.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ie(E),Z,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,Z,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,ie,t.RENDERBUFFER,C)}else{const j=E.textures;for(let te=0;te<j.length;te++){const Z=j[te],ie=s.convert(Z.format,Z.colorSpace),J=s.convert(Z.type),ee=M(Z.internalFormat,ie,J,Z.normalized,Z.colorSpace);Re(E)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ie(E),ee,E.width,E.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ie(E),ee,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,ee,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Ne(C,E,k){const j=E.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,C),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const te=i.get(E.depthTexture);if(te.__renderTarget=E,(!te.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),j){if(te.__webglInit===void 0&&(te.__webglInit=!0,E.depthTexture.addEventListener("dispose",R)),te.__webglTexture===void 0){te.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,te.__webglTexture),Ae(t.TEXTURE_CUBE_MAP,E.depthTexture);const me=s.convert(E.depthTexture.format),ye=s.convert(E.depthTexture.type);let fe;E.depthTexture.format===lr?fe=t.DEPTH_COMPONENT24:E.depthTexture.format===xs&&(fe=t.DEPTH24_STENCIL8);for(let de=0;de<6;de++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+de,0,fe,E.width,E.height,0,me,ye,null)}}else F(E.depthTexture,0);const Z=te.__webglTexture,ie=Ie(E),J=j?t.TEXTURE_CUBE_MAP_POSITIVE_X+k:t.TEXTURE_2D,ee=E.depthTexture.format===xs?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(E.depthTexture.format===lr)Re(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,ee,J,Z,0,ie):t.framebufferTexture2D(t.FRAMEBUFFER,ee,J,Z,0);else if(E.depthTexture.format===xs)Re(E)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,ee,J,Z,0,ie):t.framebufferTexture2D(t.FRAMEBUFFER,ee,J,Z,0);else throw new Error("Unknown depthTexture format")}function Qe(C){const E=i.get(C),k=C.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==C.depthTexture){const j=C.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),j){const te=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,j.removeEventListener("dispose",te)};j.addEventListener("dispose",te),E.__depthDisposeCallback=te}E.__boundDepthTexture=j}if(C.depthTexture&&!E.__autoAllocateDepthBuffer)if(k)for(let j=0;j<6;j++)Ne(E.__webglFramebuffer[j],C,j);else{const j=C.texture.mipmaps;j&&j.length>0?Ne(E.__webglFramebuffer[0],C,0):Ne(E.__webglFramebuffer,C,0)}else if(k){E.__webglDepthbuffer=[];for(let j=0;j<6;j++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[j]),E.__webglDepthbuffer[j]===void 0)E.__webglDepthbuffer[j]=t.createRenderbuffer(),Je(E.__webglDepthbuffer[j],C,!1);else{const te=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Z=E.__webglDepthbuffer[j];t.bindRenderbuffer(t.RENDERBUFFER,Z),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,Z)}}else{const j=C.texture.mipmaps;if(j&&j.length>0?n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),Je(E.__webglDepthbuffer,C,!1);else{const te=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Z=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,Z),t.framebufferRenderbuffer(t.FRAMEBUFFER,te,t.RENDERBUFFER,Z)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function tt(C,E,k){const j=i.get(C);E!==void 0&&_e(j.__webglFramebuffer,C,C.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&Qe(C)}function Ve(C){const E=C.texture,k=i.get(C),j=i.get(E);C.addEventListener("dispose",S);const te=C.textures,Z=C.isWebGLCubeRenderTarget===!0,ie=te.length>1;if(ie||(j.__webglTexture===void 0&&(j.__webglTexture=t.createTexture()),j.__version=E.version,a.memory.textures++),Z){k.__webglFramebuffer=[];for(let J=0;J<6;J++)if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer[J]=[];for(let ee=0;ee<E.mipmaps.length;ee++)k.__webglFramebuffer[J][ee]=t.createFramebuffer()}else k.__webglFramebuffer[J]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer=[];for(let J=0;J<E.mipmaps.length;J++)k.__webglFramebuffer[J]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(ie)for(let J=0,ee=te.length;J<ee;J++){const me=i.get(te[J]);me.__webglTexture===void 0&&(me.__webglTexture=t.createTexture(),a.memory.textures++)}if(C.samples>0&&Re(C)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let J=0;J<te.length;J++){const ee=te[J];k.__webglColorRenderbuffer[J]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[J]);const me=s.convert(ee.format,ee.colorSpace),ye=s.convert(ee.type),fe=M(ee.internalFormat,me,ye,ee.normalized,ee.colorSpace,C.isXRRenderTarget===!0),de=Ie(C);t.renderbufferStorageMultisample(t.RENDERBUFFER,de,fe,C.width,C.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+J,t.RENDERBUFFER,k.__webglColorRenderbuffer[J])}t.bindRenderbuffer(t.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),Je(k.__webglDepthRenderbuffer,C,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Z){n.bindTexture(t.TEXTURE_CUBE_MAP,j.__webglTexture),Ae(t.TEXTURE_CUBE_MAP,E);for(let J=0;J<6;J++)if(E.mipmaps&&E.mipmaps.length>0)for(let ee=0;ee<E.mipmaps.length;ee++)_e(k.__webglFramebuffer[J][ee],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+J,ee);else _e(k.__webglFramebuffer[J],C,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);h(E)&&m(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(ie){for(let J=0,ee=te.length;J<ee;J++){const me=te[J],ye=i.get(me);let fe=t.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(fe=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(fe,ye.__webglTexture),Ae(fe,me),_e(k.__webglFramebuffer,C,me,t.COLOR_ATTACHMENT0+J,fe,0),h(me)&&m(fe)}n.unbindTexture()}else{let J=t.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(J=C.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(J,j.__webglTexture),Ae(J,E),E.mipmaps&&E.mipmaps.length>0)for(let ee=0;ee<E.mipmaps.length;ee++)_e(k.__webglFramebuffer[ee],C,E,t.COLOR_ATTACHMENT0,J,ee);else _e(k.__webglFramebuffer,C,E,t.COLOR_ATTACHMENT0,J,0);h(E)&&m(J),n.unbindTexture()}C.depthBuffer&&Qe(C)}function vt(C){const E=C.textures;for(let k=0,j=E.length;k<j;k++){const te=E[k];if(h(te)){const Z=_(C),ie=i.get(te).__webglTexture;n.bindTexture(Z,ie),m(Z),n.unbindTexture()}}}const ot=[],Nt=[];function P(C){if(C.samples>0){if(Re(C)===!1){const E=C.textures,k=C.width,j=C.height;let te=t.COLOR_BUFFER_BIT;const Z=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ie=i.get(C),J=E.length>1;if(J)for(let me=0;me<E.length;me++)n.bindFramebuffer(t.FRAMEBUFFER,ie.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,ie.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,ie.__webglMultisampledFramebuffer);const ee=C.texture.mipmaps;ee&&ee.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ie.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ie.__webglFramebuffer);for(let me=0;me<E.length;me++){if(C.resolveDepthBuffer&&(C.depthBuffer&&(te|=t.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&(te|=t.STENCIL_BUFFER_BIT)),J){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,ie.__webglColorRenderbuffer[me]);const ye=i.get(E[me]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,ye,0)}t.blitFramebuffer(0,0,k,j,0,0,k,j,te,t.NEAREST),l===!0&&(ot.length=0,Nt.length=0,ot.push(t.COLOR_ATTACHMENT0+me),C.depthBuffer&&C.resolveDepthBuffer===!1&&(ot.push(Z),Nt.push(Z),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,Nt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,ot))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),J)for(let me=0;me<E.length;me++){n.bindFramebuffer(t.FRAMEBUFFER,ie.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,ie.__webglColorRenderbuffer[me]);const ye=i.get(E[me]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,ie.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,ye,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,ie.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&l){const E=C.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function Ie(C){return Math.min(r.maxSamples,C.samples)}function Re(C){const E=i.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function ze(C){const E=a.render.frame;u.get(C)!==E&&(u.set(C,E),C.update())}function ae(C,E){const k=C.colorSpace,j=C.format,te=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==Fu&&k!==br&&(et.getTransfer(k)===lt?(j!==ui||te!==Ln)&&Be("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):it("WebGLTextures: Unsupported texture color space:",k)),E}function Me(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(c.width=C.naturalWidth||C.width,c.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(c.width=C.displayWidth,c.height=C.displayHeight):(c.width=C.width,c.height=C.height),c}this.allocateTextureUnit=H,this.resetTextureUnits=X,this.getTextureUnits=G,this.setTextureUnits=U,this.setTexture2D=F,this.setTexture2DArray=K,this.setTexture3D=Y,this.setTextureCube=re,this.rebindTextures=tt,this.setupRenderTarget=Ve,this.updateRenderTargetMipmap=vt,this.updateMultisampleRenderTarget=P,this.setupDepthRenderbuffer=Qe,this.setupFrameBufferTexture=_e,this.useMultisampledRTT=Re,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function kU(t,e){function n(i,r=br){let s;const a=et.getTransfer(r);if(i===Ln)return t.UNSIGNED_BYTE;if(i===Pg)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Dg)return t.UNSIGNED_SHORT_5_5_5_1;if(i===cE)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===uE)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===oE)return t.BYTE;if(i===lE)return t.SHORT;if(i===hl)return t.UNSIGNED_SHORT;if(i===Rg)return t.INT;if(i===Oi)return t.UNSIGNED_INT;if(i===Ai)return t.FLOAT;if(i===or)return t.HALF_FLOAT;if(i===dE)return t.ALPHA;if(i===fE)return t.RGB;if(i===ui)return t.RGBA;if(i===lr)return t.DEPTH_COMPONENT;if(i===xs)return t.DEPTH_STENCIL;if(i===hE)return t.RED;if(i===Ng)return t.RED_INTEGER;if(i===Ps)return t.RG;if(i===Lg)return t.RG_INTEGER;if(i===Ig)return t.RGBA_INTEGER;if(i===Zc||i===Jc||i===Qc||i===eu)if(a===lt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Zc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Jc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===Qc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===eu)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Zc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Jc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===Qc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===eu)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===gp||i===vp||i===xp||i===_p)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===gp)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===vp)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===xp)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===_p)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===yp||i===Sp||i===Mp||i===Ep||i===Tp||i===Iu||i===wp)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===yp||i===Sp)return a===lt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Mp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===Ep)return s.COMPRESSED_R11_EAC;if(i===Tp)return s.COMPRESSED_SIGNED_R11_EAC;if(i===Iu)return s.COMPRESSED_RG11_EAC;if(i===wp)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===bp||i===Ap||i===Cp||i===Rp||i===Pp||i===Dp||i===Np||i===Lp||i===Ip||i===Up||i===Fp||i===Op||i===kp||i===Bp)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===bp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Ap)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===Cp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Rp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Pp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Dp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Np)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Lp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Ip)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Up)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Fp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Op)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===kp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Bp)return a===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===zp||i===Vp||i===Gp)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===zp)return a===lt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Vp)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Gp)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Hp||i===jp||i===Uu||i===Wp)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Hp)return s.COMPRESSED_RED_RGTC1_EXT;if(i===jp)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Uu)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Wp)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===pl?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const BU=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zU=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class VU{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new ME(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new mi({vertexShader:BU,fragmentShader:zU,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new ei(new Rl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class GU extends Is{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,d=null,p=null,v=null;const y=typeof XRWebGLBinding<"u",g=new VU,h={},m=n.getContextAttributes();let _=null,M=null;const w=[],T=[],R=new Ze;let S=null;const A=new Yn;A.viewport=new gt;const N=new Yn;N.viewport=new gt;const D=[A,N],I=new Y3;let X=null,G=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let le=w[Q];return le===void 0&&(le=new mf,w[Q]=le),le.getTargetRaySpace()},this.getControllerGrip=function(Q){let le=w[Q];return le===void 0&&(le=new mf,w[Q]=le),le.getGripSpace()},this.getHand=function(Q){let le=w[Q];return le===void 0&&(le=new mf,w[Q]=le),le.getHandSpace()};function U(Q){const le=T.indexOf(Q.inputSource);if(le===-1)return;const ue=w[le];ue!==void 0&&(ue.update(Q.inputSource,Q.frame,c||a),ue.dispatchEvent({type:Q.type,data:Q.inputSource}))}function H(){r.removeEventListener("select",U),r.removeEventListener("selectstart",U),r.removeEventListener("selectend",U),r.removeEventListener("squeeze",U),r.removeEventListener("squeezestart",U),r.removeEventListener("squeezeend",U),r.removeEventListener("end",H),r.removeEventListener("inputsourceschange",B);for(let Q=0;Q<w.length;Q++){const le=T[Q];le!==null&&(T[Q]=null,w[Q].disconnect(le))}X=null,G=null,g.reset();for(const Q in h)delete h[Q];e.setRenderTarget(_),p=null,d=null,f=null,r=null,M=null,Ae.stop(),i.isPresenting=!1,e.setPixelRatio(S),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&Be("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){o=Q,i.isPresenting===!0&&Be("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f===null&&y&&(f=new XRWebGLBinding(r,n)),f},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(Q){if(r=Q,r!==null){if(_=e.getRenderTarget(),r.addEventListener("select",U),r.addEventListener("selectstart",U),r.addEventListener("selectend",U),r.addEventListener("squeeze",U),r.addEventListener("squeezestart",U),r.addEventListener("squeezeend",U),r.addEventListener("end",H),r.addEventListener("inputsourceschange",B),m.xrCompatible!==!0&&await n.makeXRCompatible(),S=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let ue=null,Ce=null,Oe=null;m.depth&&(Oe=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ue=m.stencil?xs:lr,Ce=m.stencil?pl:Oi);const _e={colorFormat:n.RGBA8,depthFormat:Oe,scaleFactor:s};f=this.getBinding(),d=f.createProjectionLayer(_e),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new Ui(d.textureWidth,d.textureHeight,{format:ui,type:Ln,depthTexture:new Ga(d.textureWidth,d.textureHeight,Ce,void 0,void 0,void 0,void 0,void 0,void 0,ue),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ue={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ue),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new Ui(p.framebufferWidth,p.framebufferHeight,{format:ui,type:Ln,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await r.requestReferenceSpace(o),Ae.setContext(r),Ae.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function B(Q){for(let le=0;le<Q.removed.length;le++){const ue=Q.removed[le],Ce=T.indexOf(ue);Ce>=0&&(T[Ce]=null,w[Ce].disconnect(ue))}for(let le=0;le<Q.added.length;le++){const ue=Q.added[le];let Ce=T.indexOf(ue);if(Ce===-1){for(let _e=0;_e<w.length;_e++)if(_e>=T.length){T.push(ue),Ce=_e;break}else if(T[_e]===null){T[_e]=ue,Ce=_e;break}if(Ce===-1)break}const Oe=w[Ce];Oe&&Oe.connect(ue)}}const F=new L,K=new L;function Y(Q,le,ue){F.setFromMatrixPosition(le.matrixWorld),K.setFromMatrixPosition(ue.matrixWorld);const Ce=F.distanceTo(K),Oe=le.projectionMatrix.elements,_e=ue.projectionMatrix.elements,Je=Oe[14]/(Oe[10]-1),Ne=Oe[14]/(Oe[10]+1),Qe=(Oe[9]+1)/Oe[5],tt=(Oe[9]-1)/Oe[5],Ve=(Oe[8]-1)/Oe[0],vt=(_e[8]+1)/_e[0],ot=Je*Ve,Nt=Je*vt,P=Ce/(-Ve+vt),Ie=P*-Ve;if(le.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(Ie),Q.translateZ(P),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Oe[10]===-1)Q.projectionMatrix.copy(le.projectionMatrix),Q.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const Re=Je+P,ze=Ne+P,ae=ot-Ie,Me=Nt+(Ce-Ie),C=Qe*Ne/ze*Re,E=tt*Ne/ze*Re;Q.projectionMatrix.makePerspective(ae,Me,C,E,Re,ze),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function re(Q,le){le===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(le.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let le=Q.near,ue=Q.far;g.texture!==null&&(g.depthNear>0&&(le=g.depthNear),g.depthFar>0&&(ue=g.depthFar)),I.near=N.near=A.near=le,I.far=N.far=A.far=ue,(X!==I.near||G!==I.far)&&(r.updateRenderState({depthNear:I.near,depthFar:I.far}),X=I.near,G=I.far),I.layers.mask=Q.layers.mask|6,A.layers.mask=I.layers.mask&-5,N.layers.mask=I.layers.mask&-3;const Ce=Q.parent,Oe=I.cameras;re(I,Ce);for(let _e=0;_e<Oe.length;_e++)re(Oe[_e],Ce);Oe.length===2?Y(I,A,N):I.projectionMatrix.copy(A.projectionMatrix),oe(Q,I,Ce)};function oe(Q,le,ue){ue===null?Q.matrix.copy(le.matrixWorld):(Q.matrix.copy(ue.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(le.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(le.projectionMatrix),Q.projectionMatrixInverse.copy(le.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=gl*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return I},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(I)},this.getCameraTexture=function(Q){return h[Q]};let xe=null;function Pe(Q,le){if(u=le.getViewerPose(c||a),v=le,u!==null){const ue=u.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let Ce=!1;ue.length!==I.cameras.length&&(I.cameras.length=0,Ce=!0);for(let Ne=0;Ne<ue.length;Ne++){const Qe=ue[Ne];let tt=null;if(p!==null)tt=p.getViewport(Qe);else{const vt=f.getViewSubImage(d,Qe);tt=vt.viewport,Ne===0&&(e.setRenderTargetTextures(M,vt.colorTexture,vt.depthStencilTexture),e.setRenderTarget(M))}let Ve=D[Ne];Ve===void 0&&(Ve=new Yn,Ve.layers.enable(Ne),Ve.viewport=new gt,D[Ne]=Ve),Ve.matrix.fromArray(Qe.transform.matrix),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),Ve.projectionMatrix.fromArray(Qe.projectionMatrix),Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(),Ve.viewport.set(tt.x,tt.y,tt.width,tt.height),Ne===0&&(I.matrix.copy(Ve.matrix),I.matrix.decompose(I.position,I.quaternion,I.scale)),Ce===!0&&I.cameras.push(Ve)}const Oe=r.enabledFeatures;if(Oe&&Oe.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&y){f=i.getBinding();const Ne=f.getDepthInformation(ue[0]);Ne&&Ne.isValid&&Ne.texture&&g.init(Ne,r.renderState)}if(Oe&&Oe.includes("camera-access")&&y){e.state.unbindTexture(),f=i.getBinding();for(let Ne=0;Ne<ue.length;Ne++){const Qe=ue[Ne].camera;if(Qe){let tt=h[Qe];tt||(tt=new ME,h[Qe]=tt);const Ve=f.getCameraImage(Qe);tt.sourceTexture=Ve}}}}for(let ue=0;ue<w.length;ue++){const Ce=T[ue],Oe=w[ue];Ce!==null&&Oe!==void 0&&Oe.update(Ce,le,c||a)}xe&&xe(Q,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),v=null}const Ae=new bE;Ae.setAnimationLoop(Pe),this.setAnimationLoop=function(Q){xe=Q},this.dispose=function(){}}}const HU=new Dt,LE=new He;LE.set(-1,0,0,0,1,0,0,0,1);function jU(t,e){function n(g,h){g.matrixAutoUpdate===!0&&g.updateMatrix(),h.value.copy(g.matrix)}function i(g,h){h.color.getRGB(g.fogColor.value,EE(t)),h.isFog?(g.fogNear.value=h.near,g.fogFar.value=h.far):h.isFogExp2&&(g.fogDensity.value=h.density)}function r(g,h,m,_,M){h.isNodeMaterial?h.uniformsNeedUpdate=!1:h.isMeshBasicMaterial?s(g,h):h.isMeshLambertMaterial?(s(g,h),h.envMap&&(g.envMapIntensity.value=h.envMapIntensity)):h.isMeshToonMaterial?(s(g,h),f(g,h)):h.isMeshPhongMaterial?(s(g,h),u(g,h),h.envMap&&(g.envMapIntensity.value=h.envMapIntensity)):h.isMeshStandardMaterial?(s(g,h),d(g,h),h.isMeshPhysicalMaterial&&p(g,h,M)):h.isMeshMatcapMaterial?(s(g,h),v(g,h)):h.isMeshDepthMaterial?s(g,h):h.isMeshDistanceMaterial?(s(g,h),y(g,h)):h.isMeshNormalMaterial?s(g,h):h.isLineBasicMaterial?(a(g,h),h.isLineDashedMaterial&&o(g,h)):h.isPointsMaterial?l(g,h,m,_):h.isSpriteMaterial?c(g,h):h.isShadowMaterial?(g.color.value.copy(h.color),g.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(g,h){g.opacity.value=h.opacity,h.color&&g.diffuse.value.copy(h.color),h.emissive&&g.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(g.map.value=h.map,n(h.map,g.mapTransform)),h.alphaMap&&(g.alphaMap.value=h.alphaMap,n(h.alphaMap,g.alphaMapTransform)),h.bumpMap&&(g.bumpMap.value=h.bumpMap,n(h.bumpMap,g.bumpMapTransform),g.bumpScale.value=h.bumpScale,h.side===An&&(g.bumpScale.value*=-1)),h.normalMap&&(g.normalMap.value=h.normalMap,n(h.normalMap,g.normalMapTransform),g.normalScale.value.copy(h.normalScale),h.side===An&&g.normalScale.value.negate()),h.displacementMap&&(g.displacementMap.value=h.displacementMap,n(h.displacementMap,g.displacementMapTransform),g.displacementScale.value=h.displacementScale,g.displacementBias.value=h.displacementBias),h.emissiveMap&&(g.emissiveMap.value=h.emissiveMap,n(h.emissiveMap,g.emissiveMapTransform)),h.specularMap&&(g.specularMap.value=h.specularMap,n(h.specularMap,g.specularMapTransform)),h.alphaTest>0&&(g.alphaTest.value=h.alphaTest);const m=e.get(h),_=m.envMap,M=m.envMapRotation;_&&(g.envMap.value=_,g.envMapRotation.value.setFromMatrix4(HU.makeRotationFromEuler(M)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(LE),g.reflectivity.value=h.reflectivity,g.ior.value=h.ior,g.refractionRatio.value=h.refractionRatio),h.lightMap&&(g.lightMap.value=h.lightMap,g.lightMapIntensity.value=h.lightMapIntensity,n(h.lightMap,g.lightMapTransform)),h.aoMap&&(g.aoMap.value=h.aoMap,g.aoMapIntensity.value=h.aoMapIntensity,n(h.aoMap,g.aoMapTransform))}function a(g,h){g.diffuse.value.copy(h.color),g.opacity.value=h.opacity,h.map&&(g.map.value=h.map,n(h.map,g.mapTransform))}function o(g,h){g.dashSize.value=h.dashSize,g.totalSize.value=h.dashSize+h.gapSize,g.scale.value=h.scale}function l(g,h,m,_){g.diffuse.value.copy(h.color),g.opacity.value=h.opacity,g.size.value=h.size*m,g.scale.value=_*.5,h.map&&(g.map.value=h.map,n(h.map,g.uvTransform)),h.alphaMap&&(g.alphaMap.value=h.alphaMap,n(h.alphaMap,g.alphaMapTransform)),h.alphaTest>0&&(g.alphaTest.value=h.alphaTest)}function c(g,h){g.diffuse.value.copy(h.color),g.opacity.value=h.opacity,g.rotation.value=h.rotation,h.map&&(g.map.value=h.map,n(h.map,g.mapTransform)),h.alphaMap&&(g.alphaMap.value=h.alphaMap,n(h.alphaMap,g.alphaMapTransform)),h.alphaTest>0&&(g.alphaTest.value=h.alphaTest)}function u(g,h){g.specular.value.copy(h.specular),g.shininess.value=Math.max(h.shininess,1e-4)}function f(g,h){h.gradientMap&&(g.gradientMap.value=h.gradientMap)}function d(g,h){g.metalness.value=h.metalness,h.metalnessMap&&(g.metalnessMap.value=h.metalnessMap,n(h.metalnessMap,g.metalnessMapTransform)),g.roughness.value=h.roughness,h.roughnessMap&&(g.roughnessMap.value=h.roughnessMap,n(h.roughnessMap,g.roughnessMapTransform)),h.envMap&&(g.envMapIntensity.value=h.envMapIntensity)}function p(g,h,m){g.ior.value=h.ior,h.sheen>0&&(g.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),g.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(g.sheenColorMap.value=h.sheenColorMap,n(h.sheenColorMap,g.sheenColorMapTransform)),h.sheenRoughnessMap&&(g.sheenRoughnessMap.value=h.sheenRoughnessMap,n(h.sheenRoughnessMap,g.sheenRoughnessMapTransform))),h.clearcoat>0&&(g.clearcoat.value=h.clearcoat,g.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(g.clearcoatMap.value=h.clearcoatMap,n(h.clearcoatMap,g.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,n(h.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(g.clearcoatNormalMap.value=h.clearcoatNormalMap,n(h.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===An&&g.clearcoatNormalScale.value.negate())),h.dispersion>0&&(g.dispersion.value=h.dispersion),h.iridescence>0&&(g.iridescence.value=h.iridescence,g.iridescenceIOR.value=h.iridescenceIOR,g.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(g.iridescenceMap.value=h.iridescenceMap,n(h.iridescenceMap,g.iridescenceMapTransform)),h.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=h.iridescenceThicknessMap,n(h.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),h.transmission>0&&(g.transmission.value=h.transmission,g.transmissionSamplerMap.value=m.texture,g.transmissionSamplerSize.value.set(m.width,m.height),h.transmissionMap&&(g.transmissionMap.value=h.transmissionMap,n(h.transmissionMap,g.transmissionMapTransform)),g.thickness.value=h.thickness,h.thicknessMap&&(g.thicknessMap.value=h.thicknessMap,n(h.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=h.attenuationDistance,g.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(g.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(g.anisotropyMap.value=h.anisotropyMap,n(h.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=h.specularIntensity,g.specularColor.value.copy(h.specularColor),h.specularColorMap&&(g.specularColorMap.value=h.specularColorMap,n(h.specularColorMap,g.specularColorMapTransform)),h.specularIntensityMap&&(g.specularIntensityMap.value=h.specularIntensityMap,n(h.specularIntensityMap,g.specularIntensityMapTransform))}function v(g,h){h.matcap&&(g.matcap.value=h.matcap)}function y(g,h){const m=e.get(h).light;g.referencePosition.value.setFromMatrixPosition(m.matrixWorld),g.nearDistance.value=m.shadow.camera.near,g.farDistance.value=m.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function WU(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(m,_){const M=_.program;i.uniformBlockBinding(m,M)}function c(m,_){let M=r[m.id];M===void 0&&(v(m),M=u(m),r[m.id]=M,m.addEventListener("dispose",g));const w=_.program;i.updateUBOMapping(m,w);const T=e.render.frame;s[m.id]!==T&&(d(m),s[m.id]=T)}function u(m){const _=f();m.__bindingPointIndex=_;const M=t.createBuffer(),w=m.__size,T=m.usage;return t.bindBuffer(t.UNIFORM_BUFFER,M),t.bufferData(t.UNIFORM_BUFFER,w,T),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,_,M),M}function f(){for(let m=0;m<o;m++)if(a.indexOf(m)===-1)return a.push(m),m;return it("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(m){const _=r[m.id],M=m.uniforms,w=m.__cache;t.bindBuffer(t.UNIFORM_BUFFER,_);for(let T=0,R=M.length;T<R;T++){const S=Array.isArray(M[T])?M[T]:[M[T]];for(let A=0,N=S.length;A<N;A++){const D=S[A];if(p(D,T,A,w)===!0){const I=D.__offset,X=Array.isArray(D.value)?D.value:[D.value];let G=0;for(let U=0;U<X.length;U++){const H=X[U],B=y(H);typeof H=="number"||typeof H=="boolean"?(D.__data[0]=H,t.bufferSubData(t.UNIFORM_BUFFER,I+G,D.__data)):H.isMatrix3?(D.__data[0]=H.elements[0],D.__data[1]=H.elements[1],D.__data[2]=H.elements[2],D.__data[3]=0,D.__data[4]=H.elements[3],D.__data[5]=H.elements[4],D.__data[6]=H.elements[5],D.__data[7]=0,D.__data[8]=H.elements[6],D.__data[9]=H.elements[7],D.__data[10]=H.elements[8],D.__data[11]=0):ArrayBuffer.isView(H)?D.__data.set(new H.constructor(H.buffer,H.byteOffset,D.__data.length)):(H.toArray(D.__data,G),G+=B.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,I,D.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(m,_,M,w){const T=m.value,R=_+"_"+M;if(w[R]===void 0)return typeof T=="number"||typeof T=="boolean"?w[R]=T:ArrayBuffer.isView(T)?w[R]=T.slice():w[R]=T.clone(),!0;{const S=w[R];if(typeof T=="number"||typeof T=="boolean"){if(S!==T)return w[R]=T,!0}else{if(ArrayBuffer.isView(T))return!0;if(S.equals(T)===!1)return S.copy(T),!0}}return!1}function v(m){const _=m.uniforms;let M=0;const w=16;for(let R=0,S=_.length;R<S;R++){const A=Array.isArray(_[R])?_[R]:[_[R]];for(let N=0,D=A.length;N<D;N++){const I=A[N],X=Array.isArray(I.value)?I.value:[I.value];for(let G=0,U=X.length;G<U;G++){const H=X[G],B=y(H),F=M%w,K=F%B.boundary,Y=F+K;M+=K,Y!==0&&w-Y<B.storage&&(M+=w-Y),I.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=M,M+=B.storage}}}const T=M%w;return T>0&&(M+=w-T),m.__size=M,m.__cache={},this}function y(m){const _={boundary:0,storage:0};return typeof m=="number"||typeof m=="boolean"?(_.boundary=4,_.storage=4):m.isVector2?(_.boundary=8,_.storage=8):m.isVector3||m.isColor?(_.boundary=16,_.storage=12):m.isVector4?(_.boundary=16,_.storage=16):m.isMatrix3?(_.boundary=48,_.storage=48):m.isMatrix4?(_.boundary=64,_.storage=64):m.isTexture?Be("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(m)?(_.boundary=16,_.storage=m.byteLength):Be("WebGLRenderer: Unsupported uniform value type.",m),_}function g(m){const _=m.target;_.removeEventListener("dispose",g);const M=a.indexOf(_.__bindingPointIndex);a.splice(M,1),t.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function h(){for(const m in r)t.deleteBuffer(r[m]);a=[],r={},s={}}return{bind:l,update:c,dispose:h}}const $U=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let yi=null;function XU(){return yi===null&&(yi=new C3($U,16,16,Ps,or),yi.name="DFG_LUT",yi.minFilter=dn,yi.magFilter=dn,yi.wrapS=Yi,yi.wrapT=Yi,yi.generateMipmaps=!1,yi.needsUpdate=!0),yi}class YU{constructor(e={}){const{canvas:n=V2(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:p=Ln}=e;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=a;const y=p,g=new Set([Ig,Lg,Ng]),h=new Set([Ln,Oi,hl,pl,Pg,Dg]),m=new Uint32Array(4),_=new Int32Array(4),M=new L;let w=null,T=null;const R=[],S=[];let A=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ii,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const N=this;let D=!1,I=null;this._outputColorSpace=Wn;let X=0,G=0,U=null,H=-1,B=null;const F=new gt,K=new gt;let Y=null;const re=new at(0);let oe=0,xe=n.width,Pe=n.height,Ae=1,Q=null,le=null;const ue=new gt(0,0,xe,Pe),Ce=new gt(0,0,xe,Pe);let Oe=!1;const _e=new zg;let Je=!1,Ne=!1;const Qe=new Dt,tt=new L,Ve=new gt,vt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ot=!1;function Nt(){return U===null?Ae:1}let P=i;function Ie(b,V){return n.getContext(b,V)}try{const b={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${Cg}`),n.addEventListener("webglcontextlost",se,!1),n.addEventListener("webglcontextrestored",Le,!1),n.addEventListener("webglcontextcreationerror",je,!1),P===null){const V="webgl2";if(P=Ie(V,b),P===null)throw Ie(V)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw it("WebGLRenderer: "+b.message),b}let Re,ze,ae,Me,C,E,k,j,te,Z,ie,J,ee,me,ye,fe,de,Ge,Xe,st,O,he,ne;function Ee(){Re=new XL(P),Re.init(),O=new kU(P,Re),ze=new BL(P,Re,e,O),ae=new FU(P,Re),ze.reversedDepthBuffer&&d&&ae.buffers.depth.setReversed(!0),Me=new qL(P),C=new MU,E=new OU(P,Re,ae,C,ze,O,Me),k=new $L(N),j=new eD(P),he=new OL(P,j),te=new YL(P,j,Me,he),Z=new JL(P,te,j,he,Me),Ge=new ZL(P,ze,E),ye=new zL(C),ie=new SU(N,k,Re,ze,he,ye),J=new jU(N,C),ee=new TU,me=new PU(Re),de=new FL(N,k,ae,Z,v,l),fe=new UU(N,Z,ze),ne=new WU(P,Me,ze,ae),Xe=new kL(P,Re,Me),st=new KL(P,Re,Me),Me.programs=ie.programs,N.capabilities=ze,N.extensions=Re,N.properties=C,N.renderLists=ee,N.shadowMap=fe,N.state=ae,N.info=Me}Ee(),y!==Ln&&(A=new eI(y,n.width,n.height,r,s));const pe=new GU(N,P);this.xr=pe,this.getContext=function(){return P},this.getContextAttributes=function(){return P.getContextAttributes()},this.forceContextLoss=function(){const b=Re.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Re.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Ae},this.setPixelRatio=function(b){b!==void 0&&(Ae=b,this.setSize(xe,Pe,!1))},this.getSize=function(b){return b.set(xe,Pe)},this.setSize=function(b,V,q=!0){if(pe.isPresenting){Be("WebGLRenderer: Can't change size while VR device is presenting.");return}xe=b,Pe=V,n.width=Math.floor(b*Ae),n.height=Math.floor(V*Ae),q===!0&&(n.style.width=b+"px",n.style.height=V+"px"),A!==null&&A.setSize(n.width,n.height),this.setViewport(0,0,b,V)},this.getDrawingBufferSize=function(b){return b.set(xe*Ae,Pe*Ae).floor()},this.setDrawingBufferSize=function(b,V,q){xe=b,Pe=V,Ae=q,n.width=Math.floor(b*q),n.height=Math.floor(V*q),this.setViewport(0,0,b,V)},this.setEffects=function(b){if(y===Ln){it("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let V=0;V<b.length;V++)if(b[V].isOutputPass===!0){Be("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(F)},this.getViewport=function(b){return b.copy(ue)},this.setViewport=function(b,V,q,W){b.isVector4?ue.set(b.x,b.y,b.z,b.w):ue.set(b,V,q,W),ae.viewport(F.copy(ue).multiplyScalar(Ae).round())},this.getScissor=function(b){return b.copy(Ce)},this.setScissor=function(b,V,q,W){b.isVector4?Ce.set(b.x,b.y,b.z,b.w):Ce.set(b,V,q,W),ae.scissor(K.copy(Ce).multiplyScalar(Ae).round())},this.getScissorTest=function(){return Oe},this.setScissorTest=function(b){ae.setScissorTest(Oe=b)},this.setOpaqueSort=function(b){Q=b},this.setTransparentSort=function(b){le=b},this.getClearColor=function(b){return b.copy(de.getClearColor())},this.setClearColor=function(){de.setClearColor(...arguments)},this.getClearAlpha=function(){return de.getClearAlpha()},this.setClearAlpha=function(){de.setClearAlpha(...arguments)},this.clear=function(b=!0,V=!0,q=!0){let W=0;if(b){let $=!1;if(U!==null){const Se=U.texture.format;$=g.has(Se)}if($){const Se=U.texture.type,we=h.has(Se),ve=de.getClearColor(),De=de.getClearAlpha(),Ue=ve.r,We=ve.g,Ke=ve.b;we?(m[0]=Ue,m[1]=We,m[2]=Ke,m[3]=De,P.clearBufferuiv(P.COLOR,0,m)):(_[0]=Ue,_[1]=We,_[2]=Ke,_[3]=De,P.clearBufferiv(P.COLOR,0,_))}else W|=P.COLOR_BUFFER_BIT}V&&(W|=P.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(W|=P.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&P.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),I=b},this.dispose=function(){n.removeEventListener("webglcontextlost",se,!1),n.removeEventListener("webglcontextrestored",Le,!1),n.removeEventListener("webglcontextcreationerror",je,!1),de.dispose(),ee.dispose(),me.dispose(),C.dispose(),k.dispose(),Z.dispose(),he.dispose(),ne.dispose(),ie.dispose(),pe.dispose(),pe.removeEventListener("sessionstart",a0),pe.removeEventListener("sessionend",o0),Jr.stop()};function se(b){b.preventDefault(),Bu("WebGLRenderer: Context Lost."),D=!0}function Le(){Bu("WebGLRenderer: Context Restored."),D=!1;const b=Me.autoReset,V=fe.enabled,q=fe.autoUpdate,W=fe.needsUpdate,$=fe.type;Ee(),Me.autoReset=b,fe.enabled=V,fe.autoUpdate=q,fe.needsUpdate=W,fe.type=$}function je(b){it("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Lt(b){const V=b.target;V.removeEventListener("dispose",Lt),ft(V)}function ft(b){ki(b),C.remove(b)}function ki(b){const V=C.get(b).programs;V!==void 0&&(V.forEach(function(q){ie.releaseProgram(q)}),b.isShaderMaterial&&ie.releaseShaderCache(b))}this.renderBufferDirect=function(b,V,q,W,$,Se){V===null&&(V=vt);const we=$.isMesh&&$.matrixWorld.determinant()<0,ve=qE(b,V,q,W,$);ae.setMaterial(W,we);let De=q.index,Ue=1;if(W.wireframe===!0){if(De=te.getWireframeAttribute(q),De===void 0)return;Ue=2}const We=q.drawRange,Ke=q.attributes.position;let Fe=We.start*Ue,ht=(We.start+We.count)*Ue;Se!==null&&(Fe=Math.max(Fe,Se.start*Ue),ht=Math.min(ht,(Se.start+Se.count)*Ue)),De!==null?(Fe=Math.max(Fe,0),ht=Math.min(ht,De.count)):Ke!=null&&(Fe=Math.max(Fe,0),ht=Math.min(ht,Ke.count));const It=ht-Fe;if(It<0||It===1/0)return;he.setup($,W,ve,q,De);let Ct,pt=Xe;if(De!==null&&(Ct=j.get(De),pt=st,pt.setIndex(Ct)),$.isMesh)W.wireframe===!0?(ae.setLineWidth(W.wireframeLinewidth*Nt()),pt.setMode(P.LINES)):pt.setMode(P.TRIANGLES);else if($.isLine){let nn=W.linewidth;nn===void 0&&(nn=1),ae.setLineWidth(nn*Nt()),$.isLineSegments?pt.setMode(P.LINES):$.isLineLoop?pt.setMode(P.LINE_LOOP):pt.setMode(P.LINE_STRIP)}else $.isPoints?pt.setMode(P.POINTS):$.isSprite&&pt.setMode(P.TRIANGLES);if($.isBatchedMesh)if(Re.get("WEBGL_multi_draw"))pt.renderMultiDraw($._multiDrawStarts,$._multiDrawCounts,$._multiDrawCount);else{const nn=$._multiDrawStarts,Te=$._multiDrawCounts,Rn=$._multiDrawCount,nt=De?j.get(De).bytesPerElement:1,Vn=C.get(W).currentProgram.getUniforms();for(let vi=0;vi<Rn;vi++)Vn.setValue(P,"_gl_DrawID",vi),pt.render(nn[vi]/nt,Te[vi])}else if($.isInstancedMesh)pt.renderInstances(Fe,It,$.count);else if(q.isInstancedBufferGeometry){const nn=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Te=Math.min(q.instanceCount,nn);pt.renderInstances(Fe,It,Te)}else pt.render(Fe,It)};function gi(b,V,q){b.transparent===!0&&b.side===wi&&b.forceSinglePass===!1?(b.side=An,b.needsUpdate=!0,Ul(b,V,q),b.side=jr,b.needsUpdate=!0,Ul(b,V,q),b.side=wi):Ul(b,V,q)}this.compile=function(b,V,q=null){q===null&&(q=b),T=me.get(q),T.init(V),S.push(T),q.traverseVisible(function($){$.isLight&&$.layers.test(V.layers)&&(T.pushLight($),$.castShadow&&T.pushShadow($))}),b!==q&&b.traverseVisible(function($){$.isLight&&$.layers.test(V.layers)&&(T.pushLight($),$.castShadow&&T.pushShadow($))}),T.setupLights();const W=new Set;return b.traverse(function($){if(!($.isMesh||$.isPoints||$.isLine||$.isSprite))return;const Se=$.material;if(Se)if(Array.isArray(Se))for(let we=0;we<Se.length;we++){const ve=Se[we];gi(ve,q,$),W.add(ve)}else gi(Se,q,$),W.add(Se)}),T=S.pop(),W},this.compileAsync=function(b,V,q=null){const W=this.compile(b,V,q);return new Promise($=>{function Se(){if(W.forEach(function(we){C.get(we).currentProgram.isReady()&&W.delete(we)}),W.size===0){$(b);return}setTimeout(Se,10)}Re.get("KHR_parallel_shader_compile")!==null?Se():setTimeout(Se,10)})};let _d=null;function YE(b){_d&&_d(b)}function a0(){Jr.stop()}function o0(){Jr.start()}const Jr=new bE;Jr.setAnimationLoop(YE),typeof self<"u"&&Jr.setContext(self),this.setAnimationLoop=function(b){_d=b,pe.setAnimationLoop(b),b===null?Jr.stop():Jr.start()},pe.addEventListener("sessionstart",a0),pe.addEventListener("sessionend",o0),this.render=function(b,V){if(V!==void 0&&V.isCamera!==!0){it("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(D===!0)return;I!==null&&I.renderStart(b,V);const q=pe.enabled===!0&&pe.isPresenting===!0,W=A!==null&&(U===null||q)&&A.begin(N,U);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),V.parent===null&&V.matrixWorldAutoUpdate===!0&&V.updateMatrixWorld(),pe.enabled===!0&&pe.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(pe.cameraAutoUpdate===!0&&pe.updateCamera(V),V=pe.getCamera()),b.isScene===!0&&b.onBeforeRender(N,b,V,U),T=me.get(b,S.length),T.init(V),T.state.textureUnits=E.getTextureUnits(),S.push(T),Qe.multiplyMatrices(V.projectionMatrix,V.matrixWorldInverse),_e.setFromProjectionMatrix(Qe,Ci,V.reversedDepth),Ne=this.localClippingEnabled,Je=ye.init(this.clippingPlanes,Ne),w=ee.get(b,R.length),w.init(),R.push(w),pe.enabled===!0&&pe.isPresenting===!0){const we=N.xr.getDepthSensingMesh();we!==null&&yd(we,V,-1/0,N.sortObjects)}yd(b,V,0,N.sortObjects),w.finish(),N.sortObjects===!0&&w.sort(Q,le),ot=pe.enabled===!1||pe.isPresenting===!1||pe.hasDepthSensing()===!1,ot&&de.addToRenderList(w,b),this.info.render.frame++,Je===!0&&ye.beginShadows();const $=T.state.shadowsArray;if(fe.render($,b,V),Je===!0&&ye.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&A.hasRenderPass())===!1){const we=w.opaque,ve=w.transmissive;if(T.setupLights(),V.isArrayCamera){const De=V.cameras;if(ve.length>0)for(let Ue=0,We=De.length;Ue<We;Ue++){const Ke=De[Ue];c0(we,ve,b,Ke)}ot&&de.render(b);for(let Ue=0,We=De.length;Ue<We;Ue++){const Ke=De[Ue];l0(w,b,Ke,Ke.viewport)}}else ve.length>0&&c0(we,ve,b,V),ot&&de.render(b),l0(w,b,V)}U!==null&&G===0&&(E.updateMultisampleRenderTarget(U),E.updateRenderTargetMipmap(U)),W&&A.end(N),b.isScene===!0&&b.onAfterRender(N,b,V),he.resetDefaultState(),H=-1,B=null,S.pop(),S.length>0?(T=S[S.length-1],E.setTextureUnits(T.state.textureUnits),Je===!0&&ye.setGlobalState(N.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?w=R[R.length-1]:w=null,I!==null&&I.renderEnd()};function yd(b,V,q,W){if(b.visible===!1)return;if(b.layers.test(V.layers)){if(b.isGroup)q=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(V);else if(b.isLightProbeGrid)T.pushLightProbeGrid(b);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||_e.intersectsSprite(b)){W&&Ve.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Qe);const we=Z.update(b),ve=b.material;ve.visible&&w.push(b,we,ve,q,Ve.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||_e.intersectsObject(b))){const we=Z.update(b),ve=b.material;if(W&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),Ve.copy(b.boundingSphere.center)):(we.boundingSphere===null&&we.computeBoundingSphere(),Ve.copy(we.boundingSphere.center)),Ve.applyMatrix4(b.matrixWorld).applyMatrix4(Qe)),Array.isArray(ve)){const De=we.groups;for(let Ue=0,We=De.length;Ue<We;Ue++){const Ke=De[Ue],Fe=ve[Ke.materialIndex];Fe&&Fe.visible&&w.push(b,we,Fe,q,Ve.z,Ke)}}else ve.visible&&w.push(b,we,ve,q,Ve.z,null)}}const Se=b.children;for(let we=0,ve=Se.length;we<ve;we++)yd(Se[we],V,q,W)}function l0(b,V,q,W){const{opaque:$,transmissive:Se,transparent:we}=b;T.setupLightsView(q),Je===!0&&ye.setGlobalState(N.clippingPlanes,q),W&&ae.viewport(F.copy(W)),$.length>0&&Il($,V,q),Se.length>0&&Il(Se,V,q),we.length>0&&Il(we,V,q),ae.buffers.depth.setTest(!0),ae.buffers.depth.setMask(!0),ae.buffers.color.setMask(!0),ae.setPolygonOffset(!1)}function c0(b,V,q,W){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[W.id]===void 0){const Fe=Re.has("EXT_color_buffer_half_float")||Re.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[W.id]=new Ui(1,1,{generateMipmaps:!0,type:Fe?or:Ln,minFilter:vs,samples:Math.max(4,ze.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:et.workingColorSpace})}const Se=T.state.transmissionRenderTarget[W.id],we=W.viewport||F;Se.setSize(we.z*N.transmissionResolutionScale,we.w*N.transmissionResolutionScale);const ve=N.getRenderTarget(),De=N.getActiveCubeFace(),Ue=N.getActiveMipmapLevel();N.setRenderTarget(Se),N.getClearColor(re),oe=N.getClearAlpha(),oe<1&&N.setClearColor(16777215,.5),N.clear(),ot&&de.render(q);const We=N.toneMapping;N.toneMapping=Ii;const Ke=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),T.setupLightsView(W),Je===!0&&ye.setGlobalState(N.clippingPlanes,W),Il(b,q,W),E.updateMultisampleRenderTarget(Se),E.updateRenderTargetMipmap(Se),Re.has("WEBGL_multisampled_render_to_texture")===!1){let Fe=!1;for(let ht=0,It=V.length;ht<It;ht++){const Ct=V[ht],{object:pt,geometry:nn,material:Te,group:Rn}=Ct;if(Te.side===wi&&pt.layers.test(W.layers)){const nt=Te.side;Te.side=An,Te.needsUpdate=!0,u0(pt,q,W,nn,Te,Rn),Te.side=nt,Te.needsUpdate=!0,Fe=!0}}Fe===!0&&(E.updateMultisampleRenderTarget(Se),E.updateRenderTargetMipmap(Se))}N.setRenderTarget(ve,De,Ue),N.setClearColor(re,oe),Ke!==void 0&&(W.viewport=Ke),N.toneMapping=We}function Il(b,V,q){const W=V.isScene===!0?V.overrideMaterial:null;for(let $=0,Se=b.length;$<Se;$++){const we=b[$],{object:ve,geometry:De,group:Ue}=we;let We=we.material;We.allowOverride===!0&&W!==null&&(We=W),ve.layers.test(q.layers)&&u0(ve,V,q,De,We,Ue)}}function u0(b,V,q,W,$,Se){b.onBeforeRender(N,V,q,W,$,Se),b.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),$.onBeforeRender(N,V,q,W,b,Se),$.transparent===!0&&$.side===wi&&$.forceSinglePass===!1?($.side=An,$.needsUpdate=!0,N.renderBufferDirect(q,V,W,$,b,Se),$.side=jr,$.needsUpdate=!0,N.renderBufferDirect(q,V,W,$,b,Se),$.side=wi):N.renderBufferDirect(q,V,W,$,b,Se),b.onAfterRender(N,V,q,W,$,Se)}function Ul(b,V,q){V.isScene!==!0&&(V=vt);const W=C.get(b),$=T.state.lights,Se=T.state.shadowsArray,we=$.state.version,ve=ie.getParameters(b,$.state,Se,V,q,T.state.lightProbeGridArray),De=ie.getProgramCacheKey(ve);let Ue=W.programs;W.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?V.environment:null,W.fog=V.fog;const We=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;W.envMap=k.get(b.envMap||W.environment,We),W.envMapRotation=W.environment!==null&&b.envMap===null?V.environmentRotation:b.envMapRotation,Ue===void 0&&(b.addEventListener("dispose",Lt),Ue=new Map,W.programs=Ue);let Ke=Ue.get(De);if(Ke!==void 0){if(W.currentProgram===Ke&&W.lightsStateVersion===we)return f0(b,ve),Ke}else ve.uniforms=ie.getUniforms(b),I!==null&&b.isNodeMaterial&&I.build(b,q,ve),b.onBeforeCompile(ve,N),Ke=ie.acquireProgram(ve,De),Ue.set(De,Ke),W.uniforms=ve.uniforms;const Fe=W.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Fe.clippingPlanes=ye.uniform),f0(b,ve),W.needsLights=JE(b),W.lightsStateVersion=we,W.needsLights&&(Fe.ambientLightColor.value=$.state.ambient,Fe.lightProbe.value=$.state.probe,Fe.directionalLights.value=$.state.directional,Fe.directionalLightShadows.value=$.state.directionalShadow,Fe.spotLights.value=$.state.spot,Fe.spotLightShadows.value=$.state.spotShadow,Fe.rectAreaLights.value=$.state.rectArea,Fe.ltc_1.value=$.state.rectAreaLTC1,Fe.ltc_2.value=$.state.rectAreaLTC2,Fe.pointLights.value=$.state.point,Fe.pointLightShadows.value=$.state.pointShadow,Fe.hemisphereLights.value=$.state.hemi,Fe.directionalShadowMatrix.value=$.state.directionalShadowMatrix,Fe.spotLightMatrix.value=$.state.spotLightMatrix,Fe.spotLightMap.value=$.state.spotLightMap,Fe.pointShadowMatrix.value=$.state.pointShadowMatrix),W.lightProbeGrid=T.state.lightProbeGridArray.length>0,W.currentProgram=Ke,W.uniformsList=null,Ke}function d0(b){if(b.uniformsList===null){const V=b.currentProgram.getUniforms();b.uniformsList=tu.seqWithValue(V.seq,b.uniforms)}return b.uniformsList}function f0(b,V){const q=C.get(b);q.outputColorSpace=V.outputColorSpace,q.batching=V.batching,q.batchingColor=V.batchingColor,q.instancing=V.instancing,q.instancingColor=V.instancingColor,q.instancingMorph=V.instancingMorph,q.skinning=V.skinning,q.morphTargets=V.morphTargets,q.morphNormals=V.morphNormals,q.morphColors=V.morphColors,q.morphTargetsCount=V.morphTargetsCount,q.numClippingPlanes=V.numClippingPlanes,q.numIntersection=V.numClipIntersection,q.vertexAlphas=V.vertexAlphas,q.vertexTangents=V.vertexTangents,q.toneMapping=V.toneMapping}function KE(b,V){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;M.setFromMatrixPosition(V.matrixWorld);for(let q=0,W=b.length;q<W;q++){const $=b[q];if($.texture!==null&&$.boundingBox.containsPoint(M))return $}return null}function qE(b,V,q,W,$){V.isScene!==!0&&(V=vt),E.resetTextureUnits();const Se=V.fog,we=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?V.environment:null,ve=U===null?N.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:et.workingColorSpace,De=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,Ue=k.get(W.envMap||we,De),We=W.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Ke=!!q.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Fe=!!q.morphAttributes.position,ht=!!q.morphAttributes.normal,It=!!q.morphAttributes.color;let Ct=Ii;W.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(Ct=N.toneMapping);const pt=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,nn=pt!==void 0?pt.length:0,Te=C.get(W),Rn=T.state.lights;if(Je===!0&&(Ne===!0||b!==B)){const xt=b===B&&W.id===H;ye.setState(W,b,xt)}let nt=!1;W.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==Rn.state.version||Te.outputColorSpace!==ve||$.isBatchedMesh&&Te.batching===!1||!$.isBatchedMesh&&Te.batching===!0||$.isBatchedMesh&&Te.batchingColor===!0&&$.colorTexture===null||$.isBatchedMesh&&Te.batchingColor===!1&&$.colorTexture!==null||$.isInstancedMesh&&Te.instancing===!1||!$.isInstancedMesh&&Te.instancing===!0||$.isSkinnedMesh&&Te.skinning===!1||!$.isSkinnedMesh&&Te.skinning===!0||$.isInstancedMesh&&Te.instancingColor===!0&&$.instanceColor===null||$.isInstancedMesh&&Te.instancingColor===!1&&$.instanceColor!==null||$.isInstancedMesh&&Te.instancingMorph===!0&&$.morphTexture===null||$.isInstancedMesh&&Te.instancingMorph===!1&&$.morphTexture!==null||Te.envMap!==Ue||W.fog===!0&&Te.fog!==Se||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ye.numPlanes||Te.numIntersection!==ye.numIntersection)||Te.vertexAlphas!==We||Te.vertexTangents!==Ke||Te.morphTargets!==Fe||Te.morphNormals!==ht||Te.morphColors!==It||Te.toneMapping!==Ct||Te.morphTargetsCount!==nn||!!Te.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(nt=!0):(nt=!0,Te.__version=W.version);let Vn=Te.currentProgram;nt===!0&&(Vn=Ul(W,V,$),I&&W.isNodeMaterial&&I.onUpdateProgram(W,Vn,Te));let vi=!1,ur=!1,Us=!1;const mt=Vn.getUniforms(),Ut=Te.uniforms;if(ae.useProgram(Vn.program)&&(vi=!0,ur=!0,Us=!0),W.id!==H&&(H=W.id,ur=!0),Te.needsLights){const xt=KE(T.state.lightProbeGridArray,$);Te.lightProbeGrid!==xt&&(Te.lightProbeGrid=xt,ur=!0)}if(vi||B!==b){ae.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),mt.setValue(P,"projectionMatrix",b.projectionMatrix),mt.setValue(P,"viewMatrix",b.matrixWorldInverse);const fr=mt.map.cameraPosition;fr!==void 0&&fr.setValue(P,tt.setFromMatrixPosition(b.matrixWorld)),ze.logarithmicDepthBuffer&&mt.setValue(P,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&mt.setValue(P,"isOrthographic",b.isOrthographicCamera===!0),B!==b&&(B=b,ur=!0,Us=!0)}if(Te.needsLights&&(Rn.state.directionalShadowMap.length>0&&mt.setValue(P,"directionalShadowMap",Rn.state.directionalShadowMap,E),Rn.state.spotShadowMap.length>0&&mt.setValue(P,"spotShadowMap",Rn.state.spotShadowMap,E),Rn.state.pointShadowMap.length>0&&mt.setValue(P,"pointShadowMap",Rn.state.pointShadowMap,E)),$.isSkinnedMesh){mt.setOptional(P,$,"bindMatrix"),mt.setOptional(P,$,"bindMatrixInverse");const xt=$.skeleton;xt&&(xt.boneTexture===null&&xt.computeBoneTexture(),mt.setValue(P,"boneTexture",xt.boneTexture,E))}$.isBatchedMesh&&(mt.setOptional(P,$,"batchingTexture"),mt.setValue(P,"batchingTexture",$._matricesTexture,E),mt.setOptional(P,$,"batchingIdTexture"),mt.setValue(P,"batchingIdTexture",$._indirectTexture,E),mt.setOptional(P,$,"batchingColorTexture"),$._colorsTexture!==null&&mt.setValue(P,"batchingColorTexture",$._colorsTexture,E));const dr=q.morphAttributes;if((dr.position!==void 0||dr.normal!==void 0||dr.color!==void 0)&&Ge.update($,q,Vn),(ur||Te.receiveShadow!==$.receiveShadow)&&(Te.receiveShadow=$.receiveShadow,mt.setValue(P,"receiveShadow",$.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&V.environment!==null&&(Ut.envMapIntensity.value=V.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=XU()),ur){if(mt.setValue(P,"toneMappingExposure",N.toneMappingExposure),Te.needsLights&&ZE(Ut,Us),Se&&W.fog===!0&&J.refreshFogUniforms(Ut,Se),J.refreshMaterialUniforms(Ut,W,Ae,Pe,T.state.transmissionRenderTarget[b.id]),Te.needsLights&&Te.lightProbeGrid){const xt=Te.lightProbeGrid;Ut.probesSH.value=xt.texture,Ut.probesMin.value.copy(xt.boundingBox.min),Ut.probesMax.value.copy(xt.boundingBox.max),Ut.probesResolution.value.copy(xt.resolution)}tu.upload(P,d0(Te),Ut,E)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(tu.upload(P,d0(Te),Ut,E),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&mt.setValue(P,"center",$.center),mt.setValue(P,"modelViewMatrix",$.modelViewMatrix),mt.setValue(P,"normalMatrix",$.normalMatrix),mt.setValue(P,"modelMatrix",$.matrixWorld),W.uniformsGroups!==void 0){const xt=W.uniformsGroups;for(let fr=0,Fs=xt.length;fr<Fs;fr++){const h0=xt[fr];ne.update(h0,Vn),ne.bind(h0,Vn)}}return Vn}function ZE(b,V){b.ambientLightColor.needsUpdate=V,b.lightProbe.needsUpdate=V,b.directionalLights.needsUpdate=V,b.directionalLightShadows.needsUpdate=V,b.pointLights.needsUpdate=V,b.pointLightShadows.needsUpdate=V,b.spotLights.needsUpdate=V,b.spotLightShadows.needsUpdate=V,b.rectAreaLights.needsUpdate=V,b.hemisphereLights.needsUpdate=V}function JE(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return X},this.getActiveMipmapLevel=function(){return G},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(b,V,q){const W=C.get(b);W.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),C.get(b.texture).__webglTexture=V,C.get(b.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:q,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,V){const q=C.get(b);q.__webglFramebuffer=V,q.__useDefaultFramebuffer=V===void 0};const QE=P.createFramebuffer();this.setRenderTarget=function(b,V=0,q=0){U=b,X=V,G=q;let W=null,$=!1,Se=!1;if(b){const ve=C.get(b);if(ve.__useDefaultFramebuffer!==void 0){ae.bindFramebuffer(P.FRAMEBUFFER,ve.__webglFramebuffer),F.copy(b.viewport),K.copy(b.scissor),Y=b.scissorTest,ae.viewport(F),ae.scissor(K),ae.setScissorTest(Y),H=-1;return}else if(ve.__webglFramebuffer===void 0)E.setupRenderTarget(b);else if(ve.__hasExternalTextures)E.rebindTextures(b,C.get(b.texture).__webglTexture,C.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const We=b.depthTexture;if(ve.__boundDepthTexture!==We){if(We!==null&&C.has(We)&&(b.width!==We.image.width||b.height!==We.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(b)}}const De=b.texture;(De.isData3DTexture||De.isDataArrayTexture||De.isCompressedArrayTexture)&&(Se=!0);const Ue=C.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Ue[V])?W=Ue[V][q]:W=Ue[V],$=!0):b.samples>0&&E.useMultisampledRTT(b)===!1?W=C.get(b).__webglMultisampledFramebuffer:Array.isArray(Ue)?W=Ue[q]:W=Ue,F.copy(b.viewport),K.copy(b.scissor),Y=b.scissorTest}else F.copy(ue).multiplyScalar(Ae).floor(),K.copy(Ce).multiplyScalar(Ae).floor(),Y=Oe;if(q!==0&&(W=QE),ae.bindFramebuffer(P.FRAMEBUFFER,W)&&ae.drawBuffers(b,W),ae.viewport(F),ae.scissor(K),ae.setScissorTest(Y),$){const ve=C.get(b.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_CUBE_MAP_POSITIVE_X+V,ve.__webglTexture,q)}else if(Se){const ve=V;for(let De=0;De<b.textures.length;De++){const Ue=C.get(b.textures[De]);P.framebufferTextureLayer(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0+De,Ue.__webglTexture,q,ve)}}else if(b!==null&&q!==0){const ve=C.get(b.texture);P.framebufferTexture2D(P.FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,ve.__webglTexture,q)}H=-1},this.readRenderTargetPixels=function(b,V,q,W,$,Se,we,ve=0){if(!(b&&b.isWebGLRenderTarget)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let De=C.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&we!==void 0&&(De=De[we]),De){ae.bindFramebuffer(P.FRAMEBUFFER,De);try{const Ue=b.textures[ve],We=Ue.format,Ke=Ue.type;if(b.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ve),!ze.textureFormatReadable(We)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!ze.textureTypeReadable(Ke)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}V>=0&&V<=b.width-W&&q>=0&&q<=b.height-$&&P.readPixels(V,q,W,$,O.convert(We),O.convert(Ke),Se)}finally{const Ue=U!==null?C.get(U).__webglFramebuffer:null;ae.bindFramebuffer(P.FRAMEBUFFER,Ue)}}},this.readRenderTargetPixelsAsync=async function(b,V,q,W,$,Se,we,ve=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let De=C.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&we!==void 0&&(De=De[we]),De)if(V>=0&&V<=b.width-W&&q>=0&&q<=b.height-$){ae.bindFramebuffer(P.FRAMEBUFFER,De);const Ue=b.textures[ve],We=Ue.format,Ke=Ue.type;if(b.textures.length>1&&P.readBuffer(P.COLOR_ATTACHMENT0+ve),!ze.textureFormatReadable(We))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!ze.textureTypeReadable(Ke))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Fe=P.createBuffer();P.bindBuffer(P.PIXEL_PACK_BUFFER,Fe),P.bufferData(P.PIXEL_PACK_BUFFER,Se.byteLength,P.STREAM_READ),P.readPixels(V,q,W,$,O.convert(We),O.convert(Ke),0);const ht=U!==null?C.get(U).__webglFramebuffer:null;ae.bindFramebuffer(P.FRAMEBUFFER,ht);const It=P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE,0);return P.flush(),await G2(P,It,4),P.bindBuffer(P.PIXEL_PACK_BUFFER,Fe),P.getBufferSubData(P.PIXEL_PACK_BUFFER,0,Se),P.deleteBuffer(Fe),P.deleteSync(It),Se}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,V=null,q=0){const W=Math.pow(2,-q),$=Math.floor(b.image.width*W),Se=Math.floor(b.image.height*W),we=V!==null?V.x:0,ve=V!==null?V.y:0;E.setTexture2D(b,0),P.copyTexSubImage2D(P.TEXTURE_2D,q,0,0,we,ve,$,Se),ae.unbindTexture()};const eT=P.createFramebuffer(),tT=P.createFramebuffer();this.copyTextureToTexture=function(b,V,q=null,W=null,$=0,Se=0){let we,ve,De,Ue,We,Ke,Fe,ht,It;const Ct=b.isCompressedTexture?b.mipmaps[Se]:b.image;if(q!==null)we=q.max.x-q.min.x,ve=q.max.y-q.min.y,De=q.isBox3?q.max.z-q.min.z:1,Ue=q.min.x,We=q.min.y,Ke=q.isBox3?q.min.z:0;else{const Ut=Math.pow(2,-$);we=Math.floor(Ct.width*Ut),ve=Math.floor(Ct.height*Ut),b.isDataArrayTexture?De=Ct.depth:b.isData3DTexture?De=Math.floor(Ct.depth*Ut):De=1,Ue=0,We=0,Ke=0}W!==null?(Fe=W.x,ht=W.y,It=W.z):(Fe=0,ht=0,It=0);const pt=O.convert(V.format),nn=O.convert(V.type);let Te;V.isData3DTexture?(E.setTexture3D(V,0),Te=P.TEXTURE_3D):V.isDataArrayTexture||V.isCompressedArrayTexture?(E.setTexture2DArray(V,0),Te=P.TEXTURE_2D_ARRAY):(E.setTexture2D(V,0),Te=P.TEXTURE_2D),ae.activeTexture(P.TEXTURE0),ae.pixelStorei(P.UNPACK_FLIP_Y_WEBGL,V.flipY),ae.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL,V.premultiplyAlpha),ae.pixelStorei(P.UNPACK_ALIGNMENT,V.unpackAlignment);const Rn=ae.getParameter(P.UNPACK_ROW_LENGTH),nt=ae.getParameter(P.UNPACK_IMAGE_HEIGHT),Vn=ae.getParameter(P.UNPACK_SKIP_PIXELS),vi=ae.getParameter(P.UNPACK_SKIP_ROWS),ur=ae.getParameter(P.UNPACK_SKIP_IMAGES);ae.pixelStorei(P.UNPACK_ROW_LENGTH,Ct.width),ae.pixelStorei(P.UNPACK_IMAGE_HEIGHT,Ct.height),ae.pixelStorei(P.UNPACK_SKIP_PIXELS,Ue),ae.pixelStorei(P.UNPACK_SKIP_ROWS,We),ae.pixelStorei(P.UNPACK_SKIP_IMAGES,Ke);const Us=b.isDataArrayTexture||b.isData3DTexture,mt=V.isDataArrayTexture||V.isData3DTexture;if(b.isDepthTexture){const Ut=C.get(b),dr=C.get(V),xt=C.get(Ut.__renderTarget),fr=C.get(dr.__renderTarget);ae.bindFramebuffer(P.READ_FRAMEBUFFER,xt.__webglFramebuffer),ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,fr.__webglFramebuffer);for(let Fs=0;Fs<De;Fs++)Us&&(P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,C.get(b).__webglTexture,$,Ke+Fs),P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,C.get(V).__webglTexture,Se,It+Fs)),P.blitFramebuffer(Ue,We,we,ve,Fe,ht,we,ve,P.DEPTH_BUFFER_BIT,P.NEAREST);ae.bindFramebuffer(P.READ_FRAMEBUFFER,null),ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else if($!==0||b.isRenderTargetTexture||C.has(b)){const Ut=C.get(b),dr=C.get(V);ae.bindFramebuffer(P.READ_FRAMEBUFFER,eT),ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,tT);for(let xt=0;xt<De;xt++)Us?P.framebufferTextureLayer(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,Ut.__webglTexture,$,Ke+xt):P.framebufferTexture2D(P.READ_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,Ut.__webglTexture,$),mt?P.framebufferTextureLayer(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,dr.__webglTexture,Se,It+xt):P.framebufferTexture2D(P.DRAW_FRAMEBUFFER,P.COLOR_ATTACHMENT0,P.TEXTURE_2D,dr.__webglTexture,Se),$!==0?P.blitFramebuffer(Ue,We,we,ve,Fe,ht,we,ve,P.COLOR_BUFFER_BIT,P.NEAREST):mt?P.copyTexSubImage3D(Te,Se,Fe,ht,It+xt,Ue,We,we,ve):P.copyTexSubImage2D(Te,Se,Fe,ht,Ue,We,we,ve);ae.bindFramebuffer(P.READ_FRAMEBUFFER,null),ae.bindFramebuffer(P.DRAW_FRAMEBUFFER,null)}else mt?b.isDataTexture||b.isData3DTexture?P.texSubImage3D(Te,Se,Fe,ht,It,we,ve,De,pt,nn,Ct.data):V.isCompressedArrayTexture?P.compressedTexSubImage3D(Te,Se,Fe,ht,It,we,ve,De,pt,Ct.data):P.texSubImage3D(Te,Se,Fe,ht,It,we,ve,De,pt,nn,Ct):b.isDataTexture?P.texSubImage2D(P.TEXTURE_2D,Se,Fe,ht,we,ve,pt,nn,Ct.data):b.isCompressedTexture?P.compressedTexSubImage2D(P.TEXTURE_2D,Se,Fe,ht,Ct.width,Ct.height,pt,Ct.data):P.texSubImage2D(P.TEXTURE_2D,Se,Fe,ht,we,ve,pt,nn,Ct);ae.pixelStorei(P.UNPACK_ROW_LENGTH,Rn),ae.pixelStorei(P.UNPACK_IMAGE_HEIGHT,nt),ae.pixelStorei(P.UNPACK_SKIP_PIXELS,Vn),ae.pixelStorei(P.UNPACK_SKIP_ROWS,vi),ae.pixelStorei(P.UNPACK_SKIP_IMAGES,ur),Se===0&&V.generateMipmaps&&P.generateMipmap(Te),ae.unbindTexture()},this.initRenderTarget=function(b){C.get(b).__webglFramebuffer===void 0&&E.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?E.setTextureCube(b,0):b.isData3DTexture?E.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?E.setTexture2DArray(b,0):E.setTexture2D(b,0),ae.unbindTexture()},this.resetState=function(){X=0,G=0,U=null,ae.reset(),he.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ci}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=et._getDrawingBufferColorSpace(e),n.unpackColorSpace=et._getUnpackColorSpace()}}ge.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Ze(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Mn.line={uniforms:$g.merge([ge.common,ge.fog,ge.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			float alpha = opacity;
			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};class IE extends mi{constructor(e){super({type:"LineMaterial",uniforms:$g.clone(Mn.line.uniforms),vertexShader:Mn.line.vertexShader,fragmentShader:Mn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const V_=new Zr,Rc=new L;class UE extends $3{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],n=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new Gt(e,3)),this.setAttribute("uv",new Gt(n,2))}applyMatrix4(e){const n=this.attributes.instanceStart,i=this.attributes.instanceEnd;return n!==void 0&&(n.applyMatrix4(e),i.applyMatrix4(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new Kp(n,6,1);return this.setAttribute("instanceStart",new Rr(i,3,0)),this.setAttribute("instanceEnd",new Rr(i,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new Kp(n,6,1);return this.setAttribute("instanceColorStart",new Rr(i,3,0)),this.setAttribute("instanceColorEnd",new Rr(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new I3(e.geometry)),this}fromLineSegments(e){const n=e.geometry;return this.setPositions(n.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Zr);const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;e!==void 0&&n!==void 0&&(this.boundingBox.setFromBufferAttribute(e),V_.setFromBufferAttribute(n),this.boundingBox.union(V_))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Al),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;if(e!==void 0&&n!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Rc.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Rc)),Rc.fromBufferAttribute(n,s),r=Math.max(r,i.distanceToSquared(Rc));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}const Vf=new gt,G_=new L,H_=new L,Yt=new gt,Kt=new gt,Si=new gt,Gf=new L,Hf=new Dt,Zt=new J3,j_=new L,Pc=new Zr,Dc=new Al,Mi=new gt;let bi,Ms;function W_(t,e,n){return Mi.set(0,0,-e,1).applyMatrix4(t.projectionMatrix),Mi.multiplyScalar(1/Mi.w),Mi.x=Ms/n.width,Mi.y=Ms/n.height,Mi.applyMatrix4(t.projectionMatrixInverse),Mi.multiplyScalar(1/Mi.w),Math.abs(Math.max(Mi.x,Mi.y))}function KU(t,e){const n=t.matrixWorld,i=t.geometry,r=i.attributes.instanceStart,s=i.attributes.instanceEnd,a=Math.min(i.instanceCount,r.count);for(let o=0,l=a;o<l;o++){Zt.start.fromBufferAttribute(r,o),Zt.end.fromBufferAttribute(s,o),Zt.applyMatrix4(n);const c=new L,u=new L;bi.distanceSqToSegment(Zt.start,Zt.end,u,c),u.distanceTo(c)<Ms*.5&&e.push({point:u,pointOnLine:c,distance:bi.origin.distanceTo(u),object:t,face:null,faceIndex:o,uv:null,uv1:null})}}function qU(t,e,n){const i=e.projectionMatrix,s=t.material.resolution,a=t.matrixWorld,o=t.geometry,l=o.attributes.instanceStart,c=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),f=-e.near;bi.at(1,Si),Si.w=1,Si.applyMatrix4(e.matrixWorldInverse),Si.applyMatrix4(i),Si.multiplyScalar(1/Si.w),Si.x*=s.x/2,Si.y*=s.y/2,Si.z=0,Gf.copy(Si),Hf.multiplyMatrices(e.matrixWorldInverse,a);for(let d=0,p=u;d<p;d++){if(Yt.fromBufferAttribute(l,d),Kt.fromBufferAttribute(c,d),Yt.w=1,Kt.w=1,Yt.applyMatrix4(Hf),Kt.applyMatrix4(Hf),Yt.z>f&&Kt.z>f)continue;if(Yt.z>f){const _=Yt.z-Kt.z,M=(Yt.z-f)/_;Yt.lerp(Kt,M)}else if(Kt.z>f){const _=Kt.z-Yt.z,M=(Kt.z-f)/_;Kt.lerp(Yt,M)}Yt.applyMatrix4(i),Kt.applyMatrix4(i),Yt.multiplyScalar(1/Yt.w),Kt.multiplyScalar(1/Kt.w),Yt.x*=s.x/2,Yt.y*=s.y/2,Kt.x*=s.x/2,Kt.y*=s.y/2,Zt.start.copy(Yt),Zt.start.z=0,Zt.end.copy(Kt),Zt.end.z=0;const y=Zt.closestPointToPointParameter(Gf,!0);Zt.at(y,j_);const g=a3.lerp(Yt.z,Kt.z,y),h=g>=-1&&g<=1,m=Gf.distanceTo(j_)<Ms*.5;if(h&&m){Zt.start.fromBufferAttribute(l,d),Zt.end.fromBufferAttribute(c,d),Zt.start.applyMatrix4(a),Zt.end.applyMatrix4(a);const _=new L,M=new L;bi.distanceSqToSegment(Zt.start,Zt.end,M,_),n.push({point:M,pointOnLine:_,distance:bi.origin.distanceTo(M),object:t,face:null,faceIndex:d,uv:null,uv1:null})}}}class ZU extends ei{constructor(e=new UE,n=new IE({color:Math.random()*16777215})){super(e,n),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,n=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*n.count);for(let a=0,o=0,l=n.count;a<l;a++,o+=2)G_.fromBufferAttribute(n,a),H_.fromBufferAttribute(i,a),r[o]=o===0?0:r[o-1],r[o+1]=r[o]+G_.distanceTo(H_);const s=new Kp(r,2,1);return e.setAttribute("instanceDistanceStart",new Rr(s,1,0)),e.setAttribute("instanceDistanceEnd",new Rr(s,1,1)),this}raycast(e,n){const i=this.material.worldUnits,r=e.camera;r===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;bi=e.ray;const a=this.matrixWorld,o=this.geometry,l=this.material;Ms=l.linewidth+s,o.boundingSphere===null&&o.computeBoundingSphere(),Dc.copy(o.boundingSphere).applyMatrix4(a);let c;if(i)c=Ms*.5;else{const f=Math.max(r.near,Dc.distanceToPoint(bi.origin));c=W_(r,f,l.resolution)}if(Dc.radius+=c,bi.intersectsSphere(Dc)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Pc.copy(o.boundingBox).applyMatrix4(a);let u;if(i)u=Ms*.5;else{const f=Math.max(r.near,Pc.distanceToPoint(bi.origin));u=W_(r,f,l.resolution)}Pc.expandByScalar(u),bi.intersectsBox(Pc)!==!1&&(i?KU(this,n):qU(this,r,n))}onBeforeRender(e){const n=this.material.uniforms;n&&n.resolution&&(e.getViewport(Vf),this.material.uniforms.resolution.value.set(Vf.z,Vf.w))}}const zu={d4:4,d6:6,d8:8,d10:10,d12:12,d20:20};function FE(t,e){const n=String(t.data.骰子??t.data.die??e).toLowerCase();return n.includes("d4")?"d4":n.includes("d6")?"d6":n.includes("d8")?"d8":n.includes("d10")?"d10":n.includes("d12")?"d12":n.includes("d20")?"d20":e}function JU(t,e){var a,o,l,c,u;const n=t.data,i=FE(t,e),r=`D${zu[i]}`;if(t.type==="dice_test"){const f=String(n.结果??n.roll??((o=(a=n.掷骰)==null?void 0:a.match(/D\d+=(\d+)/))==null?void 0:o[1])??"?");return{dieLabel:r,roll:f,total:String(n.总计??f),attr:String(n.属性??"骰子测试"),verdict:String(n.描述??"结果已生成")}}return t.type==="skill_check"?{dieLabel:"D20",roll:((l=n.掷骰)==null?void 0:l.replace("D20=",""))||"?",total:String(n.总计??"?"),dc:String(n.DC??"?"),success:!!n.成功,attr:String(n.属性??"")}:{dieLabel:"D20",roll:((u=(c=n.攻击掷骰)==null?void 0:c.match(/D20=(\d+)/))==null?void 0:u[1])||"?",total:String(n.总计??"?"),dc:"AC"+String(n.目标AC??"?"),success:!!n.命中,attr:String(n.武器??"")}}function QU(t,e){switch(t){case"d4":return new Wg(e,0);case"d6":return new Ka(e*2,e*2,e*2);case"d8":return new jg(e,0);case"d10":return new Vg(e*.82,e*.82,e*1.95,10,1,!1);case"d12":return new Gg(e,0);case"d20":default:return new Hg(e,0)}}function eF(t){return[{normal:new L(0,1,0),center:new L(0,t,0)},{normal:new L(0,-1,0),center:new L(0,-t,0)},{normal:new L(1,0,0),center:new L(t,0,0)},{normal:new L(-1,0,0),center:new L(-t,0,0)},{normal:new L(0,0,1),center:new L(0,0,t)},{normal:new L(0,0,-1),center:new L(0,0,-t)}]}function tF(t){const e=t*.82;return Array.from({length:10},(n,i)=>{const r=Math.PI*2*i/10,s=new L(Math.cos(r),0,Math.sin(r)).normalize();return{normal:s,center:s.clone().multiplyScalar(e)}})}function nF(t,e){const n=t.attributes.position.array,i=n.length/9/e|0,r=[];for(let s=0;s<e;s++){const a=new L,o=s*i*9,l=new L(n[o],n[o+1],n[o+2]),c=new L(n[o+3],n[o+4],n[o+5]),u=new L(n[o+6],n[o+7],n[o+8]),f=new L().crossVectors(c.clone().sub(l),u.clone().sub(l)).normalize();for(let d=0;d<i;d++){const p=(s*i+d)*9,v=new L(n[p],n[p+1],n[p+2]),y=new L(n[p+3],n[p+4],n[p+5]),g=new L(n[p+6],n[p+7],n[p+8]);a.add(v).add(y).add(g)}a.multiplyScalar(1/(i*3)),f.dot(a)<0&&f.negate(),r.push({center:a,normal:f})}return r}function iF(t){const e=document.createElement("canvas");e.width=72,e.height=72;const n=e.getContext("2d");return n.fillStyle="#d4a843",n.textAlign="center",n.textBaseline="middle",n.font="bold 70px Georgia, serif",n.fillText(String(t),36,36),new SE(e)}function rF(t){var r;const e=document.createElement("canvas");e.width=128,e.height=128;const n=e.getContext("2d");n.fillStyle="#f8f3df",n.beginPath(),n.roundRect(10,10,108,108,18),n.fill(),n.strokeStyle="rgba(40, 45, 52, 0.22)",n.lineWidth=4,n.stroke();const i={1:[[64,64]],2:[[40,40],[88,88]],3:[[40,40],[64,64],[88,88]],4:[[40,40],[88,40],[40,88],[88,88]],5:[[40,40],[88,40],[64,64],[40,88],[88,88]],6:[[40,36],[88,36],[40,64],[88,64],[40,92],[88,92]]};return n.fillStyle="#1f2830",(r=i[t])==null||r.forEach(([s,a])=>{n.beginPath(),n.arc(s,a,10,0,Math.PI*2),n.fill()}),new SE(e)}function Yg({dice:t,dieType:e="d20",onClose:n}){const[i,r]=z.useState(!1),[s,a]=z.useState(!1),[o,l]=z.useState(!1),c=z.useRef([]);z.useEffect(()=>{if(!t){r(!1);return}c.current.forEach(clearTimeout),c.current=[],r(!0),a(!0),l(!1);const g=window.setTimeout(()=>{a(!1),window.setTimeout(()=>l(!0),950)},1200),h=window.setTimeout(()=>n(),4600);return c.current=[g,h],()=>c.current.forEach(clearTimeout)},[t]);const u=t?JU(t,e):null,f=t?Number(t.data.加值??0):0,d=t?FE(t,e):e,p=zu[d],v=Number(u==null?void 0:u.roll)===p,y=(u==null?void 0:u.roll)==="1";return x.jsx("div",{className:"dice-overlay",style:{display:i?"flex":"none"},onClick:o?n:void 0,children:x.jsxs(ut.div,{className:"dice-modal dice-modal-3d",initial:{scale:.6,opacity:0},animate:{scale:i?1:.6,opacity:i?1:0},transition:{type:"spring",stiffness:260,damping:22},onClick:g=>g.stopPropagation(),children:[x.jsx(Pl,{dieType:d,roll:Number(u==null?void 0:u.roll),rolling:s,revealed:o}),o&&u&&x.jsxs(ut.div,{className:"dice-info",initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},children:[u.attr&&x.jsx("div",{className:"dice-attr",children:u.attr}),x.jsxs("div",{className:"dice-calc",children:[x.jsx("span",{children:u.dieLabel}),x.jsx("span",{className:`dice-roll-val ${v?"text-teal":""} ${y?"text-danger":""}`,children:u.roll}),f!==0&&x.jsxs(x.Fragment,{children:[x.jsx("span",{children:f>0?"+":""}),x.jsx("span",{children:f})]}),(f!==0||u.total!==u.roll)&&x.jsxs(x.Fragment,{children:[x.jsx("span",{children:"="}),x.jsx("span",{className:"dice-total",children:u.total})]})]}),u.dc&&x.jsxs("div",{className:"dice-dc",children:[x.jsx("span",{children:"/"}),x.jsxs("span",{children:["DC ",u.dc.replace("AC","").trim()]})]}),(u.verdict||typeof u.success=="boolean")&&x.jsx(ut.div,{className:`dice-verdict ${typeof u.success=="boolean"?u.success?"verdict-success":"verdict-fail":"verdict-neutral"}`,initial:{scale:0},animate:{scale:1},transition:{delay:.1,type:"spring",stiffness:400},children:u.verdict||(v?"🎉 大成功!":y?"💀 大失败!":u.success?"通过 ✓":"失败 ✗")})]})]})})}function Pl({dieType:t="d20",roll:e=null,rolling:n=!1,revealed:i=!1,size:r=220,className:s="",faceStyle:a="numbers",showResultBadge:o=!0}){const l=z.useRef(null),c=z.useRef(null),u=z.useRef(!1);z.useEffect(()=>{u.current=n},[n]),z.useEffect(()=>{const y=l.current;if(!y)return;const g=new y3,h=new pd(-2.5,2.5,2.5,-2.5,.1,20);h.position.set(0,0,4.8),h.lookAt(0,0,0);const m=new YU({antialias:!0,alpha:!0});m.setSize(r,r),m.setPixelRatio(Math.min(window.devicePixelRatio,2)),m.setClearColor(0,0),y.appendChild(m.domElement),g.add(new W3(16777215,.6));const _=new p_(16775399,1.6);_.position.set(4,3,5),g.add(_);const M=new p_(9141611,.6);M.position.set(-3,-2,-4),g.add(M);const w=new j3(16771248,.8);w.position.set(0,5,2),g.add(w);const T=new To,R=zu[t],S=QU(t,1.5);T.add(new ei(S,new B3({color:4857984,metalness:.45,roughness:.25})));const A=new UE().fromEdgesGeometry(new L3(S,12));T.add(new ZU(A,new IE({color:13936707,linewidth:.03,worldUnits:!0})));const N=t==="d6"?eF(1.5):t==="d10"?tF(1.5):nF(S,R),D=t==="d6"?1.2:t==="d10"?.72:.55,I=t==="d6"&&a==="pips";N.forEach(({center:re,normal:oe},xe)=>{const Pe=new ei(new Rl(D,D),new Bg({map:I?rF(xe+1):iF(xe+1),transparent:!0,side:wi}));Pe.position.copy(re).add(oe.clone().multiplyScalar(.015)),Pe.setRotationFromQuaternion(new Wr().setFromUnitVectors(new L(0,0,1),oe)),T.add(Pe)}),g.add(T);const X=N.map(re=>re.normal),G=new L(0,0,1);let U=null,H=null,B=0,F=0;const K=new K3;function Y(){F=requestAnimationFrame(Y);const re=Math.min(K.getDelta(),.1);if(U&&H){const oe=Date.now()-B,xe=Math.min(oe/50,1),Pe=xe<.5?2*xe*xe:1-Math.pow(-2*xe+2,2)/2;T.quaternion.copy(H).slerp(U,Pe),xe>=1&&(U=null,H=null)}else u.current&&(T.rotation.x+=re*9,T.rotation.y+=re*7,T.rotation.z+=re*5);m.render(g,h)}return Y(),T.userData.faceToCamera=re=>{const oe=X[re];oe&&(H=T.quaternion.clone(),U=new Wr().setFromUnitVectors(oe.clone(),G),B=Date.now())},c.current={diceGroup:T,renderer:m,animId:F},()=>{cancelAnimationFrame(F),m.dispose(),y.contains(m.domElement)&&y.removeChild(m.domElement),c.current=null}},[t,a,r]),z.useEffect(()=>{var h;const y=Number(e);if(n||!Number.isFinite(y)||y<1)return;u.current=!1;const g=(h=c.current)==null?void 0:h.diceGroup.userData;g!=null&&g.faceToCamera&&g.faceToCamera(y-1)},[n,e]);const f=zu[t],d=Number(e),p=d===f,v=d===1;return x.jsx("div",{className:`dice-canvas-wrap ${s}`.trim(),ref:l,style:{width:r,height:r},children:o&&i&&Number.isFinite(d)&&x.jsx(ut.div,{className:`dice-result-badge ${p?"badge-crit":""} ${v?"badge-fumble":""}`,initial:{scale:0,rotateZ:-30},animate:{scale:1,rotateZ:0},transition:{type:"spring",stiffness:360,damping:16},children:x.jsx("span",{className:"badge-num",children:d})})})}const sF=["slot-1","slot-2","slot-3","slot-4","slot-5"],aF={"slot-1":"存档一","slot-2":"存档二","slot-3":"存档三","slot-4":"存档四","slot-5":"存档五"};function oF(t){if(!t)return"未记录时间";const e=new Date(t.includes("T")?t:t.replace(" ","T"));return Number.isNaN(e.getTime())?t:e.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1})}function Kg({saves:t,busySlot:e="",disabled:n=!1,message:i="",messageTone:r="neutral",title:s="冒险存档",onRefresh:a,onSave:o,onLoad:l}){const c=new Map(t.map(f=>[f.slot_key,f])),u=!!e;return x.jsxs("div",{className:"save-load-panel",children:[x.jsxs("div",{className:"save-load-header",children:[x.jsx("span",{children:s}),a&&x.jsx("button",{type:"button",onClick:a,disabled:u,children:"刷新"})]}),i&&x.jsx("p",{className:`save-message save-message-${r}`,children:i}),x.jsx("div",{className:"save-slot-list",children:sF.map(f=>{const d=c.get(f),p=e===f;return x.jsxs("div",{className:`save-slot ${d?"has-save":""}`,children:[x.jsxs("div",{className:"save-slot-copy",children:[x.jsx("strong",{children:(d==null?void 0:d.title)||aF[f]}),x.jsx("small",{children:d?`${d.player_name} · ${d.char_class} Lv.${d.level}`:"空存档位"}),x.jsx("em",{children:d?`${oF(d.saved_at)} · ${d.current_area}`:"尚未写入冒险记录"})]}),x.jsxs("div",{className:"save-slot-actions",children:[o&&x.jsx("button",{type:"button",onClick:()=>o(f),disabled:n||u,children:p?"...":"存"}),x.jsx("button",{type:"button",onClick:()=>l(f),disabled:n||u||!d,children:p?"...":"读"})]})]},f)})})]})}function lF({saves:t,saveBusySlot:e,saveMessage:n,saveMessageTone:i,onBack:r,onRefreshSaves:s,onLoadSave:a}){return x.jsx("main",{className:"load-game-screen",children:x.jsxs(ut.section,{className:"load-game-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.35,ease:"easeOut"},children:[x.jsxs("header",{className:"load-game-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"LOAD GAME"}),x.jsx("h1",{children:"读取存档"})]}),x.jsx("button",{type:"button",className:"ghost-button",onClick:r,children:"返回"})]}),x.jsx("div",{className:"load-game-panel",children:x.jsx(Kg,{title:"冒险记录",saves:t,busySlot:e,message:n,messageTone:i,onRefresh:s,onLoad:a})})]})})}function cF({error:t,onRetry:e}){const[n,i]=z.useState(0);return z.useEffect(()=>{const r=window.setInterval(()=>i(s=>(s+1)%4),400);return()=>window.clearInterval(r)},[]),x.jsx("div",{className:"loading-screen",children:x.jsxs("div",{className:"loading-panel",children:[x.jsx(ut.div,{initial:{scale:.88,opacity:0},animate:{scale:1,opacity:1},className:"loading-sigil",children:"SC"}),x.jsx("h1",{children:"碎冠之影"}),x.jsx("div",{className:"loading-rule"}),t?x.jsxs(x.Fragment,{children:[x.jsx("p",{className:"loading-error",children:"召唤失败"}),x.jsx("p",{className:"loading-detail",children:t}),x.jsx("button",{onClick:e,className:"primary-button",children:"返回"})]}):x.jsxs("p",{children:["地下城主正在搭建冒险舞台",".".repeat(n)]})]})})}const uF=[{key:"str",name:"力量"},{key:"dex",name:"敏捷"},{key:"con",name:"体质"},{key:"int",name:"智力"},{key:"wis",name:"感知"},{key:"cha",name:"魅力"}];function dF({onStart:t,onBack:e,saves:n=[],saveBusySlot:i="",saveMessage:r="",saveMessageTone:s="neutral",onRefreshSaves:a,onLoadSave:o}){const[l,c]=z.useState("冒险者"),[u,f]=z.useState(0),[d,p]=z.useState(!1),v=rp[u];function y(){t({player_name:l.trim()||"冒险者",char_class:v.name,attr_str:v.stats.str,attr_dex:v.stats.dex,attr_con:v.stats.con,attr_int:v.stats.int,attr_wis:v.stats.wis,attr_cha:v.stats.cha,level:3})}return x.jsxs("div",{className:"start-screen",children:[x.jsxs(ut.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},className:"start-layout",children:[x.jsxs("header",{className:"start-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"D&D AI-TRPG"}),x.jsx("h1",{children:"地心之门"})]}),x.jsxs("div",{className:"start-header-copy",children:[x.jsx("p",{children:"逆穹城倒挂在穹顶之下，无光孢海的荧光在深渊中明灭。"}),e&&x.jsx("button",{type:"button",className:"ghost-button",onClick:e,children:"返回"})]})]}),x.jsxs("section",{className:"creator-grid",children:[x.jsxs("div",{className:"creator-column",children:[x.jsx("label",{className:"field-label",htmlFor:"player-name",children:"冒险者姓名"}),x.jsx("input",{id:"player-name",value:l,maxLength:12,onChange:g=>c(g.target.value),className:"text-field"}),x.jsx("div",{className:"class-list",role:"listbox","aria-label":"选择职业",children:rp.map((g,h)=>x.jsxs("button",{type:"button","aria-selected":u===h,onClick:()=>f(h),className:`class-option ${u===h?"is-selected":""}`,children:[x.jsx("span",{className:"class-mark",children:g.mark}),x.jsxs("span",{children:[x.jsx("strong",{children:g.name}),x.jsx("small",{children:g.desc})]})]},g.id))})]}),x.jsxs(ut.div,{initial:{opacity:0,x:16},animate:{opacity:1,x:0},className:"class-sheet",children:[x.jsxs("div",{className:"sheet-title",children:[x.jsx("span",{children:v.name}),x.jsxs("small",{children:["HP ",i2(v.stats.con)," / AC ",r2(v.id)]})]}),x.jsx("div",{className:"stat-list",children:uF.map(g=>{const h=v.stats[g.key];return x.jsxs("div",{className:"stat-row",children:[x.jsx("span",{children:g.name}),x.jsx("div",{className:"stat-track",children:x.jsx("i",{style:{width:`${h/18*100}%`}})}),x.jsxs("b",{children:[h," (",Z1(h),")"]})]},g.key)})}),x.jsxs("div",{className:"trait-grid",children:[x.jsxs("div",{children:[x.jsx("h3",{children:"优势"}),v.pros.map(g=>x.jsx("p",{children:g},g))]}),x.jsxs("div",{children:[x.jsx("h3",{children:"限制"}),v.cons.map(g=>x.jsx("p",{children:g},g))]})]}),x.jsxs("div",{className:"skill-preview",children:[x.jsxs("div",{children:[x.jsx("h3",{children:"战斗技能"}),v.skills.combat.map(g=>x.jsxs("p",{children:[x.jsx("b",{children:g.name}),x.jsx("span",{children:g.check})]},g.name))]}),x.jsxs("div",{children:[x.jsx("h3",{children:"非战斗技能"}),v.skills.nonCombat.map(g=>x.jsxs("p",{children:[x.jsx("b",{children:g.name}),x.jsx("span",{children:g.check})]},g.name))]})]}),x.jsx("button",{type:"button",onClick:y,className:"start-button",children:"深入地下城"})]},v.id)]})]}),o&&x.jsx("button",{type:"button",className:"load-save-fab",onClick:()=>p(!0),title:"读取存档",children:"📂"}),x.jsx(Br,{children:d&&x.jsx(ut.div,{className:"save-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>p(!1),children:x.jsxs(ut.div,{className:"save-modal",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},onClick:g=>g.stopPropagation(),children:[x.jsxs("div",{className:"save-modal-header",children:[x.jsx("span",{children:"读取存档"}),x.jsx("button",{type:"button",onClick:()=>p(!1),children:"✕"})]}),x.jsx(Kg,{title:"读取存档",saves:n,busySlot:i,message:r,messageTone:s,onRefresh:a,onLoad:g=>{o==null||o(g),p(!1)}})]})})})]})}const fF=[["str","力量"],["dex","敏捷"],["con","体质"],["int","智力"],["wis","感知"],["cha","魅力"]],hF=[{title:"流程",text:"每回合选择 1 个战斗技能，指定对象后立刻进入骰子判定。"},{title:"技能",text:"每个角色只展示 3 个战斗技能，暂不区分移动、附赠动作、反应和距离。"},{title:"判定",text:"攻击看 D20 + 加值 vs AC；治疗和范围技能按各自骰子结算。"},{title:"节奏",text:"我方有 +2 节奏加值，普通未命中会造成压制擦伤；敌方伤害降低。"}],pF="/assets/battle/b1-sanctum-placeholder.png",Ri={allyHitBonus:2,allySaveDcBonus:1,allyDamageMultiplier:1.35,enemyDamageMultiplier:.65,allyGrazeDamage:4,enemyGrazeDamage:0,enemyRollDelayMs:520,enemyEndDelayMs:3300},mF=[{id:"pc-adventurer",name:"冒险者",faction:"ally",role:"战士 Lv.3 / 重装先锋",portrait:"冒",model:"adventurer",hp:30,maxHp:30,ac:18,speed:30,proficiency:2,abilities:{str:16,dex:13,con:15,int:10,wis:12,cha:8},weaponMastery:"长剑 Sap / 战斧 Topple / 巨剑 Graze / 长矛 Slow / 战锤 Push",resourceProfile:["动作压制","附赠恢复/控制","反应护卫"],statuses:["戒备","板甲","前排"],traits:["HP30 / AC18","熟练加值 +2","战士武器精通槽位 2","短休技能：回气、破甲连斩"],skills:[{id:"F1",name:"断筋斩",resource:"动作",source:"职业技能",formula:"STR + 熟练 vs AC；命中后 1d8+3 挥砍",effect:"命中后目标 DEX 豁免 DC13，失败则速度减半 1 轮。",cooldown:"无",rule:"攻击检定 + Topple/推撞变体",roll:{kind:"attack",ability:"str",targetAc:14,label:"断筋斩命中判定"},tags:["攻击","减速","武器精通"]},{id:"F2",name:"盾牌猛击",resource:"附赠动作",source:"职业技能",formula:"STR 运动 DC13；伤害 1d4+3 钝击",effect:"目标 STR 豁免 DC13，失败则倒地。",cooldown:"每战斗 2 次",rule:"Shove 推撞机制",roll:{kind:"ability",ability:"str",dc:13,label:"盾牌猛击运动检定"},tags:["检定","倒地","附赠动作"]},{id:"F3",name:"回气",resource:"附赠动作",source:"职业技能",formula:"恢复 1d10 + 战士等级",effect:"立即恢复生命值，用于测试治疗骰和附赠动作占用。",cooldown:"每次短休 1 次",rule:"HP 与恢复",roll:{kind:"healing",dieType:"d10",diceCount:1,bonus:3,label:"回气恢复量"},tags:["治疗","D10","短休"]},{id:"F4",name:"嘲讽咆哮",resource:"附赠动作",source:"职业技能",formula:"CHA 威吓 DC14；敌人 WIS 豁免 DC13",effect:"15 尺内敌人失败后对你以外目标攻击受限制，持续 1 轮。",cooldown:"每战斗 1 次",rule:"Help 动作反用 + 魅惑变体",roll:{kind:"ability",ability:"cha",dc:14,label:"嘲讽咆哮威吓检定"},tags:["控制","劣势","群体"]},{id:"F5",name:"护卫拦截",resource:"反应",source:"职业技能",formula:"无需掷骰；5 尺内队友被攻击时触发",effect:"你用反应替队友承受一半伤害，伤害类型不变。",cooldown:"每轮 1 次",rule:"反应 + 半身掩护变体",roll:{kind:"none"},tags:["反应","护卫","减伤"],trigger:"5 尺内队友被攻击"},{id:"F6",name:"破甲连斩",resource:"动作",source:"职业技能",formula:"STR + 熟练 vs AC，连击 2 次",effect:"每次命中造成武器骰+STR，两次都命中额外 1d6 挥砍。",cooldown:"每次短休 1 次",rule:"多重攻击",roll:{kind:"attack",ability:"str",targetAc:18,label:"破甲连斩首击"},tags:["攻击","连击","破甲"]},{id:"F7",name:"战争践踏",resource:"动作",source:"职业技能",formula:"STR 运动 DC15；范围 DEX 豁免 DC13",effect:"10 尺锥形，失败者倒地并受束缚 1 轮。",cooldown:"每次长休 1 次",rule:"倒地 + 束缚状态",roll:{kind:"ability",ability:"str",dc:15,label:"战争践踏运动检定"},tags:["范围","倒地","束缚"]}],nonCombatSkills:[{name:"破门开路",check:"STR 运动 DC12-18",effect:"撞开上锁的门、栅栏或石棺。"},{name:"战场读势",check:"WIS 洞悉 DC14",effect:"预判伏击时先攻有优势；识破弱点后首轮攻击 +2。"},{name:"军械鉴定",check:"INT 调查 DC12",effect:"识别武器品质、附魔或隐藏机关。"},{name:"负重拖拽",check:"STR 运动 DC13",effect:"拖拽倒地队友或重物，速度减半。"}]},{id:"ally-grum",name:"格鲁姆",faction:"ally",role:"矮人战士 / 铁锤破阵",portrait:"格",model:"grum",hp:52,maxHp:52,ac:18,speed:25,proficiency:2,abilities:{str:18,dex:12,con:17,int:9,wis:13,cha:10},weaponMastery:"战锤 Push",resourceProfile:["动作击倒","附赠临时 HP","反应代伤"],statuses:["护卫","矮人韧性","前排"],traits:["HP52 / AC18","战锤 1d8+4 钝击","Push 精通","队友专属护卫反应"],skills:[{id:"GM1",name:"裂地猛击",resource:"动作",source:"队友技能",formula:"STR + 熟练 vs AC；1d8+4 钝击",effect:"命中后目标 STR 豁免 DC15，失败倒地；近战攻击对其有优势。",cooldown:"无",rule:"攻击检定 + 倒地状态",roll:{kind:"attack",ability:"str",targetAc:14,label:"裂地猛击命中判定"},tags:["攻击","倒地","优势"]},{id:"GM2",name:"铜墙铁壁",resource:"附赠动作",source:"队友技能",formula:"获得 2d8 临时 HP，无需 D20",effect:"临时 HP 优先扣除，且下回合获得闪避效果。",cooldown:"每战斗 1 次",rule:"临时生命值 + 闪避",roll:{kind:"damage",dieType:"d8",diceCount:2,bonus:0,label:"铜墙铁壁临时 HP"},tags:["临时HP","闪避","附赠动作"]},{id:"GM3",name:"舍身护卫",resource:"反应",source:"队友技能",formula:"无需掷骰；5 尺内队友被攻击时触发",effect:"格鲁姆完全承受该次伤害，队友受到 0 伤害。",cooldown:"每战斗 1 次",rule:"反应 + 护卫",roll:{kind:"none"},tags:["反应","代伤","护卫"],trigger:"5 尺内队友被攻击"},{id:"GM4",name:"酒桶冲锋",resource:"动作",source:"队友技能",formula:"STR 运动 DC15；路径敌人 DEX 豁免 DC15",effect:"直线 20 尺冲刺，失败者倒地；终点对最近敌人进行一次攻击。",cooldown:"每次短休 1 次",rule:"移动 + 冲撞可选规则",roll:{kind:"ability",ability:"str",dc:15,label:"酒桶冲锋运动检定"},tags:["移动","冲撞","倒地"]}],nonCombatSkills:[{name:"矮人石工",check:"STR 运动 +4，DC12-16",effect:"鉴定石造机关、暗门或矿脉。"},{name:"酒馆人脉",check:"CHA 说服 +3，DC13",effect:"打听城市传闻、黑市中介和酒馆情报。"},{name:"酒量比拼",check:"CON 豁免 DC15",effect:"喝倒对方套取情报，失败则自己醉酒。"}]},{id:"ally-lisa",name:"丽莎",faction:"ally",role:"半精灵游荡者 / 影刃",portrait:"丽",model:"lisa",hp:38,maxHp:38,ac:16,speed:30,proficiency:2,abilities:{str:10,dex:18,con:14,int:12,wis:13,cha:8},weaponMastery:"短剑 Vex / 匕首 Nick",resourceProfile:["动作偷袭","附赠隐形/束缚","反应反击"],statuses:["潜行","双持","后排突袭"],traits:["HP38 / AC16","DEX +4","偷袭 2d6","Vex 命中后下击优势"],skills:[{id:"LS1",name:"暗影突袭",resource:"动作",source:"队友技能",formula:"DEX + 熟练 vs AC；1d6+4 + 2d6 偷袭",effect:"需有优势或目标 5 尺内有盟友；Vex 使下次对同目标攻击有优势。",cooldown:"每回合 1 次偷袭",rule:"偷袭 + 优势系统",roll:{kind:"attack",ability:"dex",targetAc:14,label:"暗影突袭命中判定"},tags:["攻击","偷袭","优势"]},{id:"LS2",name:"烟中恶鬼",resource:"附赠动作",source:"队友技能",formula:"DEX 潜行 DC15",effect:"成功后隐形 1 轮；本回合已造成伤害则自动成功。",cooldown:"每战斗 1 次",rule:"隐形 + 重度遮蔽",roll:{kind:"ability",ability:"dex",dc:15,label:"烟中恶鬼潜行检定"},tags:["隐形","优势","附赠动作"]},{id:"LS3",name:"暗器投网",resource:"附赠动作",source:"队友技能",formula:"DEX + 熟练 vs AC，射程 20/40",effect:"命中后目标受束缚 1 轮：速度 0、攻击劣势、被攻击优势。",cooldown:"每战斗 1 次",rule:"受束缚状态",roll:{kind:"attack",ability:"dex",targetAc:14,label:"暗器投网命中判定"},tags:["束缚","远程","附赠动作"]},{id:"LS4",name:"毒蛇反击",resource:"反应",source:"队友技能",formula:"DEX + 熟练 vs AC；1d4+4 穿刺 + 1d6 毒素",effect:"被近战攻击时对攻击者进行一次匕首反击。",cooldown:"每轮 1 次",rule:"反应攻击 + 毒素伤害",roll:{kind:"attack",ability:"dex",targetAc:14,label:"毒蛇反击命中判定"},tags:["反应","反击","毒素"],trigger:"丽莎被近战攻击"}],nonCombatSkills:[{name:"拆陷大师",check:"DEX 巧手 +6，DC12-18",effect:"解除陷阱或开锁，大成功可反转陷阱。"},{name:"阴影潜行",check:"DEX 潜行 +6",effect:"引导队伍潜行路线，降低全队被察觉概率。"},{name:"暗语解读",check:"INT 调查 +4，DC14",effect:"解读盗贼黑话、暗影教会暗号或地下标记。"}]},{id:"ally-talia",name:"塔莉亚",faction:"ally",role:"龙血法师学徒",portrait:"塔",model:"talia",hp:24,maxHp:24,ac:14,speed:30,proficiency:2,abilities:{str:8,dex:14,con:14,int:17,wis:12,cha:13},weaponMastery:"无；法术位 1级×3 / 2级×1",resourceProfile:["动作法术","反应元素抗性","短休爆发"],statuses:["奥术专注","龙血","远程"],traits:["HP24 / AC14","INT +3","法术豁免 DC14","灰烬之裔易伤变体"],skills:[{id:"TL1",name:"炽焰射线",resource:"动作",source:"队友技能",formula:"INT + 熟练 vs AC；1d10 火焰",effect:"命中后目标 DEX 豁免 DC14，失败着火，下回合开始受 1d4 火焰。",cooldown:"无，戏法",rule:"法术攻击 + 持续伤害",roll:{kind:"attack",ability:"int",targetAc:14,label:"炽焰射线命中判定"},tags:["法术攻击","火焰","持续伤害"]},{id:"TL2",name:"龙火护罩",resource:"反应",source:"队友技能",formula:"无需掷骰；火焰/冷冻伤害触发",effect:"你或 10 尺内盟友获得该伤害类型抗性，仅对本次生效。",cooldown:"每战斗 2 次",rule:"抗性：伤害减半",roll:{kind:"none"},tags:["反应","抗性","减伤"],trigger:"受到火焰或冷冻伤害"},{id:"TL3",name:"灼热金属",resource:"动作",source:"队友技能",formula:"自动生效；2d8 火焰；CON 豁免 DC14",effect:"穿金属护甲目标失败后卸除武器/护甲，下回合无法攻击。",cooldown:"消耗 1级法术位",rule:"自动命中 + 缴械可选规则",roll:{kind:"save",dc:14,targetSaveBonus:3,label:"目标 CON 豁免"},tags:["火焰","缴械","豁免"]},{id:"TL4",name:"龙火星爆",resource:"动作",source:"队友技能",formula:"15 尺锥形；DEX 豁免 DC14；3d6 火焰",effect:"失败全伤、成功半伤；自己受 1d4 火焰反噬。灰烬之裔伤害翻倍。",cooldown:"每次短休 1 次",rule:"范围豁免 + 易伤",roll:{kind:"save",dc:14,targetSaveBonus:3,label:"目标 DEX 豁免"},tags:["范围","火焰","易伤"]},{id:"TL5",name:"龙息觉醒",resource:"动作",source:"队友技能",formula:"30 尺锥形；DEX 豁免 DC15；4d6 火焰",effect:"信任 > 80 且完成龙血觉醒事件后解锁，无反噬。",cooldown:"每次长休 1 次",rule:"剧情解锁技能",roll:{kind:"save",dc:15,targetSaveBonus:3,label:"目标 DEX 豁免"},tags:["锁定","范围","火焰"],locked:!0}],nonCombatSkills:[{name:"奥术译读",check:"INT 奥秘 +6，DC12-18",effect:"解读古代文字、魔法卷轴或符文。"},{name:"法师塔礼仪",check:"INT 历史 +4 或 CHA 说服 +3",effect:"在法师塔或学术场合获取情报。"},{name:"血脉共鸣",check:"被动",effect:"30 尺内感知龙类、龙血生物或龙相关魔法物品。"}]},{id:"enemy-templar",name:"被腐化的圣堂骑士",faction:"enemy",role:"精英敌人 / 灰烬重甲",portrait:"圣",model:"templar",hp:42,maxHp:42,ac:17,speed:30,proficiency:2,abilities:{str:18,dex:11,con:16,int:10,wis:12,cha:14},weaponMastery:"巨剑 Graze / 腐化光环",resourceProfile:["动作高伤","附赠黯蚀","反应招架"],statuses:["腐化","重甲","首领"],traits:["HP42 / AC17","STR +4","重甲威压","灰烬腐化抗性"],skills:[{id:"ET1",name:"黑誓巨剑",resource:"动作",source:"敌方技能",formula:"STR + 熟练 vs AC；2d6+4 挥砍",effect:"命中后可追加 1d6 黯蚀；未命中仍可用 Graze 造成 STR 调整值伤害。",cooldown:"无",rule:"攻击检定 + Graze",roll:{kind:"attack",ability:"str",targetAc:18,label:"黑誓巨剑命中判定"},tags:["攻击","黯蚀","精通"]},{id:"ET2",name:"灰烬裁决",resource:"动作",source:"敌方技能",formula:"CHA 威吓 vs WIS 豁免 DC14",effect:"失败者恐慌 1 轮，无法主动靠近圣堂骑士。",cooldown:"每战斗 1 次",rule:"恐慌状态",roll:{kind:"save",dc:14,targetSaveBonus:1,label:"我方 WIS 豁免"},tags:["控制","恐慌","豁免"]},{id:"ET3",name:"余烬招架",resource:"反应",source:"敌方技能",formula:"无需掷骰；被近战命中时触发",effect:"本次受到的物理伤害 -1d8，并对攻击者造成 1d4 火焰。",cooldown:"每轮 1 次",rule:"反应 + 伤害减免",roll:{kind:"none"},tags:["反应","减伤","火焰"],trigger:"被近战攻击命中"}],nonCombatSkills:[]},{id:"enemy-ash-a",name:"灰烬之影小兵A",faction:"enemy",role:"影裔爪牙 / 快速骚扰",portrait:"影A",model:"shade",hp:15,maxHp:15,ac:13,speed:35,proficiency:2,abilities:{str:10,dex:16,con:12,int:8,wis:11,cha:7},resourceProfile:["动作爪击","附赠位移","反应撤影"],statuses:["轻盈","灰烬之裔"],traits:["HP15 / AC13","DEX +3","速度 35 尺","受光耀/龙火克制"],skills:[{id:"EA1",name:"暗影爪击",resource:"动作",source:"敌方技能",formula:"DEX + 熟练 vs AC；1d6+3 挥砍",effect:"命中后可向 5 尺内另一个目标施加轻度遮蔽。",cooldown:"无",rule:"近战攻击",roll:{kind:"attack",ability:"dex",targetAc:16,label:"暗影爪击命中判定"},tags:["攻击","近战","遮蔽"]},{id:"EA2",name:"烟影位移",resource:"附赠动作",source:"敌方技能",formula:"移动 15 尺，无需掷骰",effect:"不触发借机攻击，优先贴近后排。",cooldown:"每轮 1 次",rule:"移动 + 借机攻击例外",roll:{kind:"none"},tags:["移动","撤离","附赠动作"]}],nonCombatSkills:[]},{id:"enemy-ash-b",name:"灰烬之影小兵B",faction:"enemy",role:"影裔爪牙 / 快速骚扰",portrait:"影B",model:"shade",hp:15,maxHp:15,ac:13,speed:35,proficiency:2,abilities:{str:10,dex:16,con:12,int:8,wis:11,cha:7},resourceProfile:["动作爪击","附赠位移","反应撤影"],statuses:["轻盈","灰烬之裔"],traits:["HP15 / AC13","DEX +3","速度 35 尺","受光耀/龙火克制"],skills:[{id:"EB1",name:"暗影爪击",resource:"动作",source:"敌方技能",formula:"DEX + 熟练 vs AC；1d6+3 挥砍",effect:"命中后可向 5 尺内另一个目标施加轻度遮蔽。",cooldown:"无",rule:"近战攻击",roll:{kind:"attack",ability:"dex",targetAc:16,label:"暗影爪击命中判定"},tags:["攻击","近战","遮蔽"]},{id:"EB2",name:"烟影位移",resource:"附赠动作",source:"敌方技能",formula:"移动 15 尺，无需掷骰",effect:"不触发借机攻击，优先贴近后排。",cooldown:"每轮 1 次",rule:"移动 + 借机攻击例外",roll:{kind:"none"},tags:["移动","撤离","附赠动作"]}],nonCombatSkills:[]}],gF={"pc-adventurer":["F1","F6","F3"],"ally-grum":["GM1","GM2","GM4"],"ally-lisa":["LS1","LS3","LS2"],"ally-talia":["TL1","TL3","TL4"],"enemy-templar":["ET1","ET2","ET4"],"enemy-ash-a":["EA1","EA3","EA2"],"enemy-ash-b":["EB1","EB3","EB2"]},vF={"enemy-templar":[{id:"ET4",name:"腐化重击",resource:"战斗技能",source:"敌方技能",formula:"STR + 熟练 vs AC；1d8+4 黯蚀",effect:"命中后黯蚀能量爆开，压低我方当前生命最低者的状态。",cooldown:"每回合 1 次",rule:"简化攻击检定",roll:{kind:"attack",ability:"str",targetAc:16,label:"腐化重击命中判定"},tags:["攻击","黯蚀","压制"]}],"enemy-ash-a":[{id:"EA3",name:"灰烬爆裂",resource:"战斗技能",source:"敌方技能",formula:"DEX + 熟练 vs AC；1d8+3 火焰",effect:"灰烬在目标身侧爆开，造成火焰伤害并制造短暂混乱。",cooldown:"每回合 1 次",rule:"简化攻击检定",roll:{kind:"attack",ability:"dex",targetAc:15,label:"灰烬爆裂命中判定"},tags:["攻击","火焰","压制"]}],"enemy-ash-b":[{id:"EB3",name:"灰烬爆裂",resource:"战斗技能",source:"敌方技能",formula:"DEX + 熟练 vs AC；1d8+3 火焰",effect:"灰烬在目标身侧爆开，造成火焰伤害并制造短暂混乱。",cooldown:"每回合 1 次",rule:"简化攻击检定",roll:{kind:"attack",ability:"dex",targetAc:15,label:"灰烬爆裂命中判定"},tags:["攻击","火焰","压制"]}]};function Vo(t){return t.replace(/，?射程\s*\d+\/\d+/g,"").replace(/直线\s*\d+\s*尺/g,"冲击线").replace(/\d+\s*尺锥形/g,"范围").replace(/\d+\s*尺内/g,"附近").replace(/\d+\s*尺/g,"近身").replace(/速度\s*0/g,"行动受限").replace(/速度(?:被)?减半/g,"行动受限").replace(/移动\s*近身/g,"快速切入").replace(/附赠动作|自由互动|反应|动作/g,"战斗技能").replace(/借机攻击/g,"反制").replace(/\s+/g," ").trim()}function xF(t){return{...t,resource:"战斗技能",cooldown:"每回合 1 次",trigger:void 0,formula:Vo(t.formula),effect:Vo(t.effect),rule:Vo(t.rule),tags:t.tags.filter(e=>!["附赠动作","自由互动","反应","移动","近战"].includes(e)).slice(0,4)}}function _F(t){const e=gF[t.id]??t.skills.slice(0,3).map(r=>r.id),n=[...t.skills,...vF[t.id]??[]],i=e.map(r=>n.find(s=>s.id===r)).filter(r=>!!r).slice(0,3).map(xF);return{...t,weaponMastery:t.weaponMastery?Vo(t.weaponMastery):void 0,resourceProfile:["三技能简化战斗","不计算距离","不区分附赠/反应"],traits:t.traits.filter(r=>!/^速度/.test(r)).map(Vo),skills:i}}const ds=mF.map(_F);function Go(t){return Math.floor((t-10)/2)}function Es(t){return t>=0?`+${t}`:String(t)}function qg(t){return Math.floor(Math.random()*t)+1}function nu(){return qg(20)}function yF(t){return Number(t.replace("d",""))}function $_(t){return t.map(e=>{const n=Go(e.abilities.dex),i=e.initiativeBonus??0,r=nu();return{unitId:e.id,roll:r,dexMod:n,otherBonus:i,total:r+n+i}})}function OE(t,e){return[...t].sort((n,i)=>{if(i.total!==n.total)return i.total-n.total;if(i.dexMod!==n.dexMod)return i.dexMod-n.dexMod;const r=e.get(n.unitId),s=e.get(i.unitId);return(r==null?void 0:r.faction)!==(s==null?void 0:s.faction)?(r==null?void 0:r.faction)==="ally"?-1:1:ds.findIndex(a=>a.id===n.unitId)-ds.findIndex(a=>a.id===i.unitId)})}function Zg(t){return Math.max(0,Math.min(100,t.hp/Math.max(t.maxHp,1)*100))}function SF(t){return t.roll.kind!=="none"}function Jp(t,e){return!!e[t]}function X_(t){return t.roll.kind==="healing"?"选择恢复对象":t.tags.some(e=>["临时HP","隐形","抗性"].includes(e))?"选择自身或受益者":t.tags.some(e=>["范围","群体"].includes(e))?"选择范围中心或主要目标":t.roll.kind==="none"&&t.trigger?"选择预设保护对象":"选择释放目标"}function Y_(t,e,n,i){const r=n.filter(a=>a.hp>0),s=i.filter(a=>a.hp>0);return e.name==="回气"||e.tags.includes("临时HP")||e.name==="烟中恶鬼"?[t]:e.roll.kind==="healing"||e.roll.kind==="none"&&e.tags.some(a=>["护卫","抗性","减伤"].includes(a))?r.length?r:n:t.faction==="ally"?s:r}function MF(t){const e=[...t.matchAll(/(\d*)d(\d+)(?:\s*[+＋]\s*(\d+))?/gi)];if(e.length===0)return null;const n=[];let i=0;return e.forEach(r=>{const s=Number(r[1]||1),a=Number(r[2]),o=Number(r[3]||0),l=Array.from({length:s},()=>qg(a)),c=l.reduce((u,f)=>u+f,0)+o;i+=c,n.push(`${s}d${a}${o?`+${o}`:""}: ${l.join("+")}${o?`+${o}`:""}`)}),{total:i,detail:n.join("；")}}function po(t){var e,n;return t?t.type==="attack_roll"?`D20 ${((e=t.data.攻击掷骰)==null?void 0:e.replace("D20=",""))??"?"} + ${t.data.加值??0} = ${t.data.总计??"?"} / AC ${t.data.目标AC??"?"}`:t.type==="skill_check"?`D20 ${((n=t.data.掷骰)==null?void 0:n.replace("D20=",""))??"?"} + ${t.data.加值??0} = ${t.data.总计??"?"} / DC ${t.data.DC??"?"}`:`${t.data.骰子??"骰子"} ${t.data.掷骰??""}，总计 ${t.data.总计??t.data.结果??"?"}`:"无掷骰，按触发条件直接生效。"}function EF(t){return Number((t==null?void 0:t.data.总计)??(t==null?void 0:t.data.结果)??0)}function TF(t){const e=(t==null?void 0:t.type)==="attack_roll"?t.data.攻击掷骰:t==null?void 0:t.data.掷骰,n=String(e??"").match(/D20=(\d+)/);return n?Number(n[1]):0}function kE(t){return t.roll.kind==="healing"||/治疗|恢复/.test(t.name+t.formula)}function Jg(t,e,n){return t.faction!==e.faction&&!kE(n)&&!n.tags.includes("临时HP")}function wF(t,e){const n=t.faction==="ally"?Ri.allyDamageMultiplier:Ri.enemyDamageMultiplier;return Math.max(1,Math.round(e*n))}function mo({actor:t,target:e,skill:n,dice:i,amount:r,outcome:s}){const a=EF(i),o=a?`${a} 点判定`:"这次行动",l=r!==void 0&&Jg(t,e,n)&&r>=e.hp;if(s==="heal")return`KP：${t.name}稳住呼吸，${n.name}的光芒落在${e.name}身上，恢复了 ${r??0} 点生命。伤口收拢，${e.name}重新找回了站稳脚跟的力气。`;if(s==="trigger")return`KP：${t.name}把${n.name}留作应对，视线牢牢压在${e.name}身侧。下一次危机到来时，这个选择会立刻改变战场。`;if(l)return`KP：${t.name}使用${n.name}，${o}压过防线。${e.name}被这一击打得失去平衡，灰烬般的轮廓崩散在地，已经无法继续战斗。`;if(s==="hit"||s==="save-full"){const c=n.tags.includes("火焰")?"火光沿着命中的轨迹炸开":n.tags.includes("倒地")||n.tags.includes("束缚")?"冲击把目标的重心狠狠掀翻":n.tags.includes("偷袭")?"刀锋从阴影里切入护甲缝隙":"这一击结结实实撕开了敌人的防线",u=r!==void 0?`${e.name}受到 ${r} 点影响`:`${e.name}吃下了主要效果`;return`KP：${t.name}使用${n.name}，${o}成功。${c}，${u}，阵型被迫后退。`}if(s==="save-half"){const c=r!==void 0?`造成 ${r} 点半效伤害`:"保留了半效影响";return`KP：${e.name}勉强扛住了${n.name}的主要冲击，但余波仍然扫过战场。${t.name}逼出了破绽，${c}。`}return s==="graze"?`KP：${t.name}的${n.name}没有正面命中，但攻势没有白费。${e.name}被逼得撞开半步，护甲上留下擦伤，受到 ${r??0} 点压制伤害。`:s==="check"?`KP：${t.name}尝试${n.name}，${o}通过。${e.name}被迫按你的节奏移动，战场主动权短暂向我方倾斜。`:`KP：${t.name}使用${n.name}，但${o||"判定"}没能压过对方。${e.name}避开了关键威胁，不过这一瞬间的交锋仍让战场节奏被重新拉扯。`}function K_(t,e,n,i){const r=MF(n.formula),s=(i==null?void 0:i.type)==="dice_test"?Number(i.data.总计??i.data.结果??0):r==null?void 0:r.total,a=Jg(t,e,n),o=s&&a?wF(t,s):s;if(!i){const c=mo({actor:t,target:e,skill:n,dice:i,outcome:"trigger"});return{id:Date.now(),actorName:t.name,targetName:e.name,skillName:n.name,title:"触发/预设生效",formula:n.formula,resultLine:po(null),detail:`${e.name} 已被指定为 ${n.name} 的对象。${n.effect}`,narration:c}}if(i.type==="attack_roll"){const c=!!i.data.命中,u=TF(i),f=a&&!c&&u!==1?t.faction==="ally"?Ri.allyGrazeDamage:Ri.enemyGrazeDamage:0,d=c?o:f||void 0,v=mo({actor:t,target:e,skill:n,dice:i,amount:d,outcome:c?"hit":f?"graze":"miss"});return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:c?"攻击命中":f?"擦伤压制":"攻击未命中",formula:n.formula,resultLine:po(i),amount:d,success:c||f>0,detail:c?`${e.name} 受到${d?`约 ${d} 点`:""}效果结算。${r?`伤害骰：${r.detail}。`:""}${a?"测试节奏已应用伤害倍率。":""}${n.effect}`:f?`${e.name} 未被正面命中，但我方测试节奏触发擦伤压制，造成 ${f} 点伤害。`:`${e.name} 未被命中，本次主要效果不触发。`,narration:v}}if(i.type==="skill_check"&&n.roll.kind==="save"){const c=!!i.data.成功,u=o?Math.max(1,Math.round(o*(c?.5:1))):void 0,d=mo({actor:t,target:e,skill:n,dice:i,amount:u,outcome:c?"save-half":"save-full"});return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:c?"目标豁免成功（半效）":"目标豁免失败",formula:n.formula,resultLine:po(i),amount:u,success:!!u,detail:c?`${e.name} 通过豁免，效果减弱为半效。${r?`基础伤害骰：${r.detail}。`:""}${a?"测试节奏已应用伤害倍率。":""}`:`${e.name} 豁免失败，技能完整生效。${r?`基础伤害骰：${r.detail}。`:""}${a?"测试节奏已应用伤害倍率。":""}${n.effect}`,narration:d}}if(i.type==="skill_check"){const c=!!i.data.成功,u=c?o:void 0,f=mo({actor:t,target:e,skill:n,dice:i,amount:u,outcome:c?"check":"miss"});return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:c?"检定成功":"检定失败",formula:n.formula,resultLine:po(i),amount:u,success:c,detail:c?`${n.effect}${r?` 结算骰：${r.detail}。`:""}${a?"测试节奏已应用伤害倍率。":""}`:"本次检定失败，技能主要效果不触发。",narration:f}}const l=mo({actor:t,target:e,skill:n,dice:i,amount:o,outcome:kE(n)?"heal":"check"});return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:n.roll.kind==="healing"?"治疗结算":"骰子结算",formula:n.formula,resultLine:po(i),amount:o,success:!0,detail:`${e.name} 获得 ${o??0} 点${n.roll.kind==="healing"?"治疗":"效果值"}。${n.effect}`,narration:l}}function bF(t){const e=`${t.roll.label??""} ${t.formula} ${t.effect}`;return/CON|体质/.test(e)?"con":/WIS|感知/.test(e)?"wis":/STR|力量/.test(e)?"str":/CHA|魅力/.test(e)?"cha":/INT|智力/.test(e)?"int":"dex"}function q_(t,e,n){if(e.roll.kind==="none")return null;const i=Date.now();if(e.roll.kind==="attack"){const f=nu(),p=Go(t.abilities[e.roll.ability??"str"])+t.proficiency+(e.roll.bonus??0)+(t.faction==="ally"?Ri.allyHitBonus:0),v=f+p,y=(n==null?void 0:n.ac)??e.roll.targetAc??14;return{type:"attack_roll",data:{骰子:"D20",武器:`${t.name}：${e.name}`,攻击掷骰:`D20=${f}`,加值:p,总计:v,目标AC:y,命中:f===20||f!==1&&v>=y,id:i}}}if(e.roll.kind==="ability"){const f=nu(),p=Go(t.abilities[e.roll.ability??"str"])+t.proficiency+(e.roll.bonus??0)+(t.faction==="ally"?Ri.allyHitBonus:0),v=f+p,y=(e.roll.dc??13)+(t.faction==="ally"?Ri.allySaveDcBonus:0);return{type:"skill_check",data:{骰子:"D20",属性:`${t.name}：${e.roll.label??e.name}`,掷骰:`D20=${f}`,加值:p,总计:v,DC:y,成功:f===20||f!==1&&v>=y,id:i}}}if(e.roll.kind==="save"){const f=nu(),d=bF(e),p=n?Go(n.abilities[d]):e.roll.targetSaveBonus??2,v=f+p,y=(e.roll.dc??13)+(t.faction==="ally"?Ri.allySaveDcBonus:0);return{type:"skill_check",data:{骰子:"D20",属性:`${e.roll.label??"目标豁免"}：${e.name}`,掷骰:`D20=${f}`,加值:p,总计:v,DC:y,成功:f===20||f!==1&&v>=y,id:i}}}const r=e.roll.dieType??"d6",s=e.roll.diceCount??1,a=yF(r),o=Array.from({length:s},()=>qg(a)),l=o.reduce((f,d)=>f+d,0),c=e.roll.bonus??0,u=l+c;return{type:"dice_test",data:{骰子:r.toUpperCase(),属性:`${t.name}：${e.roll.label??e.name}`,掷骰:`${r.toUpperCase()}=${o[0]}`,结果:o[0],加值:c,总计:u,描述:s>1?`${s}${r} 合计 ${o.join(" + ")} = ${l}`:"结果已生成",id:i}}}function AF({onBack:t}){var Nt;const[e,n]=z.useState(()=>$_(ds)),[i,r]=z.useState("initiative"),[s,a]=z.useState(1),[o,l]=z.useState(0),[c,u]=z.useState(()=>Object.fromEntries(ds.map(P=>[P.id,P.hp]))),[f,d]=z.useState(null),[p,v]=z.useState(null),[y,g]=z.useState(null),[h,m]=z.useState(null),[_,M]=z.useState(null),w=z.useRef(null),[T,R]=z.useState({}),[S,A]=z.useState(["战斗测试按三技能简化规则初始化：选技能、指定对象、掷骰结算。"]),N=z.useMemo(()=>ds.map(P=>({...P,hp:Math.max(0,Math.min(P.maxHp,c[P.id]??P.hp))})),[c]),D=z.useMemo(()=>new Map(N.map(P=>[P.id,P])),[N]),I=z.useMemo(()=>OE(e,D),[e,D]),X=I[o%I.length],G=X?D.get(X.unitId):void 0,U=G==null?void 0:G.id,H=G==null?void 0:G.faction,B=f?D.get(f):void 0,F=p?D.get(p):void 0,K=z.useMemo(()=>N.filter(P=>P.faction==="ally"),[N]),Y=z.useMemo(()=>N.filter(P=>P.faction==="enemy"),[N]),re=z.useMemo(()=>K.filter(P=>P.hp>0),[K]),oe=z.useMemo(()=>Y.filter(P=>P.hp>0),[Y]),xe=i==="battle"&&Y.length>0&&oe.length===0,Pe=i==="battle"&&K.length>0&&re.length===0,Ae=y?(Nt=D.get(y.unitId))==null?void 0:Nt.skills.find(P=>P.id===y.skillId):void 0,Q=y?D.get(y.unitId):void 0,le=Q&&Ae?Y_(Q,Ae,K,Y):[],ue=z.useMemo(()=>new Set(le.map(P=>P.id)),[le]),Ce=i==="battle"&&(G==null?void 0:G.faction)==="enemy",Oe=z.useCallback(()=>r("battle"),[]);function _e(P){A(Ie=>[P,...Ie].slice(0,4))}function Je(){n($_(ds)),r("initiative"),a(P=>P+1),l(0),d(null),v(null),g(null),m(null),M(null),w.current=null,u(Object.fromEntries(ds.map(P=>[P.id,P.hp]))),R({}),_e("重新进行全员 1D20 先攻判定。")}function Ne(){l(P=>{var Ie;for(let Re=1;Re<=I.length;Re+=1){const ze=(P+Re)%I.length,ae=D.get((Ie=I[ze])==null?void 0:Ie.unitId);if(ae&&ae.hp>0)return ze}return P})}function Qe(){Ne(),v(null),g(null),R({}),m(null),w.current=null}function tt(P){if(Q&&Ae&&le.some(Ie=>Ie.id===P.id)){Ve(Q,Ae,P);return}if(P.id===(G==null?void 0:G.id)&&P.faction==="ally"&&i==="battle"){v(P.id);return}d(P.id)}function Ve(P,Ie,Re){if(xe||Pe||P.hp<=0||Re.hp<=0||Ie.locked||Jp(Ie.resource,T[P.id]??{}))return;R(Me=>({...Me,[P.id]:{...Me[P.id]??{},[Ie.resource]:!0}}));const ze=q_(P,Ie,Re),ae=K_(P,Re,Ie,ze);vt(P,Re,Ie,ae),g(null),M(ae),_e(`${P.name} 对 ${Re.name} 使用 ${Ie.name}：${ae.title}`),_e(ae.narration),ze&&m(ze)}function vt(P,Ie,Re,ze){if(!(!ze.amount||ze.amount<=0)){if(Re.roll.kind==="healing"){u(ae=>({...ae,[Ie.id]:Math.min(Ie.maxHp,(ae[Ie.id]??Ie.hp)+ze.amount)}));return}ze.success&&Jg(P,Ie,Re)&&u(ae=>({...ae,[Ie.id]:Math.max(0,(ae[Ie.id]??Ie.hp)-ze.amount)}))}}function ot(P,Ie){xe||Pe||P.hp<=0||P.faction!=="ally"||P.id!==(G==null?void 0:G.id)||Ie.locked||Jp(Ie.resource,T[P.id]??{})||(g({unitId:P.id,skillId:Ie.id}),_e(`${P.name} 准备 ${Ie.name}，等待指定释放对象。`))}return z.useEffect(()=>{if(i!=="battle"||xe||Pe||!U||H!=="enemy")return;const P=D.get(U);if(!P)return;if(P.hp<=0){Ne();return}const Ie=`${o}-${U}`;if(w.current===Ie)return;w.current=Ie,v(null),g(null),_e(`${P.name} 的敌方回合开始，我方操作锁定。`);const Re=[...D.values()].filter(j=>j.faction==="ally"&&j.hp>0),ze=[...D.values()].filter(j=>j.faction==="enemy"&&j.hp>0),ae=P.skills.find(j=>j.roll.kind==="attack"||j.roll.kind==="save")??P.skills[0],Me=Y_(P,ae,Re,ze);if(!Me.length){Ne();return}const C=Me.reduce((j,te)=>te.hp<j.hp?te:j,Me[0]),E=window.setTimeout(()=>{const j=q_(P,ae,C),te=K_(P,C,ae,j);vt(P,C,ae,te),M(te),_e(`${P.name} 自动对 ${C.name} 使用 ${ae.name}：${te.title}`),_e(te.narration),j&&m(j)},Ri.enemyRollDelayMs),k=window.setTimeout(()=>{Ne(),R({}),m(null),g(null),w.current=null},Ri.enemyEndDelayMs);return()=>{window.clearTimeout(E),window.clearTimeout(k)}},[H,U,Pe,xe,I.length,i,o]),z.useEffect(()=>{if(i!=="battle"||xe||Pe||!G||G.hp>0)return;const P=window.setTimeout(()=>{Ne(),v(null),g(null)},420);return()=>window.clearTimeout(P)},[G,Pe,xe,i]),x.jsxs("main",{className:"battle-test-screen",children:[x.jsx("div",{className:"battle-background",style:{backgroundImage:`url(${pF})`}}),x.jsx("div",{className:"battle-overlay"}),x.jsxs("header",{className:"battle-hud-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"B1 COMBAT RULE SANDBOX"}),x.jsx("h1",{children:"B1 层战斗测试"}),x.jsx("small",{children:"三技能简化战斗：指定对象后过骰子判定，AI KP 会按点数、伤害和治疗描述行动结果。"})]}),x.jsxs("div",{className:"battle-hud-actions",children:[x.jsx("button",{type:"button",className:"ghost-button",onClick:Je,children:"重投先攻"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:Qe,disabled:i!=="battle"||Ce||xe||Pe,children:"下一行动"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:t,children:"返回测试"})]})]}),x.jsx("section",{className:"initiative-track","aria-label":"行动顺序",children:I.map((P,Ie)=>{const Re=D.get(P.unitId);if(!Re)return null;const ze=Re.id===(G==null?void 0:G.id)&&i==="battle";return x.jsxs("button",{type:"button",className:`initiative-token ${ze?"is-active":""} ${Re.hp<=0?"is-defeated":""} ${Re.faction==="enemy"?"is-enemy":"is-ally"}`,onClick:()=>d(Re.id),"aria-current":ze?"true":void 0,children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${Re.model}`,children:Re.portrait}),x.jsxs("span",{className:"initiative-token-copy",children:[x.jsx("b",{children:Re.name}),x.jsxs("small",{children:[P.roll," ",Es(P.dexMod),P.otherBonus?` ${Es(P.otherBonus)}`:""," = ",P.total]})]}),x.jsx("i",{children:Ie+1})]},Re.id)})}),x.jsx("section",{className:"battle-rules-dock","aria-label":"规则速查",children:hF.map(P=>x.jsxs("article",{children:[x.jsx("b",{children:P.title}),x.jsx("span",{children:P.text})]},P.title))}),Ce&&G&&x.jsxs("section",{className:"battle-enemy-turn-lock","aria-label":"敌方回合",children:[x.jsx("b",{children:"敌方回合"}),x.jsxs("span",{children:[G.name," 正在自动行动，我方操作暂时锁定。"]})]}),(xe||Pe)&&x.jsxs("section",{className:`battle-end-banner ${xe?"is-win":"is-lose"}`,"aria-label":"战斗结果",children:[x.jsx("b",{children:xe?"战斗测试胜利":"战斗测试失败"}),x.jsx("span",{children:xe?"敌方已经全部失去战斗能力。本次节奏调校目标达成，可以继续测试下一场战斗。":"我方已经全部失去战斗能力，可以重投先攻重新测试。"})]}),x.jsx(Z_,{title:"我方",units:K,activeUnitId:G==null?void 0:G.id,onSelect:d}),x.jsx(Z_,{title:"敌方",units:Y,activeUnitId:G==null?void 0:G.id,onSelect:d,align:"right"}),x.jsxs("section",{className:"battle-field","aria-label":"战斗场景",children:[x.jsx("div",{className:"battle-side battle-side-ally",children:K.map(P=>x.jsx(J_,{unit:P,active:P.id===(G==null?void 0:G.id)&&i==="battle",targetable:ue.has(P.id),onClick:()=>tt(P)},P.id))}),x.jsx("div",{className:"battle-side battle-side-enemy",children:Y.map(P=>x.jsx(J_,{unit:P,active:P.id===(G==null?void 0:G.id)&&i==="battle",targetable:ue.has(P.id),onClick:()=>tt(P)},P.id))})]}),x.jsxs("aside",{className:"battle-log-panel","aria-label":"战斗记录",children:[x.jsx("span",{children:"规则事件"}),S.map(P=>x.jsx("p",{children:P},P))]}),_&&x.jsx(RF,{effect:_}),x.jsxs("div",{className:"battle-turn-plate",children:[x.jsx("span",{children:i==="battle"?"当前行动":"等待先攻揭示"}),x.jsx("b",{children:(G==null?void 0:G.name)??"等待先攻"}),X&&x.jsxs("small",{children:["先攻 ",X.total,"，D20 ",X.roll," + 敏捷 ",Es(X.dexMod),X.otherBonus?` + 其他 ${X.otherBonus}`:""]})]}),x.jsx(Br,{children:B&&x.jsx(PF,{unit:B,initiative:e.find(P=>P.unitId===B.id),onClose:()=>d(null)},B.id)}),x.jsx(Br,{children:F&&!Ce&&F.id===(G==null?void 0:G.id)&&x.jsx(NF,{unit:F,usedResources:T[F.id]??{},pendingSkill:Ae,pendingTargets:le,onInspect:()=>d(F.id),onClose:()=>v(null),onEndTurn:Qe,onChooseSkill:P=>ot(F,P),onSelectTarget:P=>{Ae&&Ve(F,Ae,P)},onCancelTarget:()=>g(null)},F.id)}),x.jsx(Yg,{dice:h,dieType:"d20",onClose:()=>m(null)}),x.jsx(Br,{children:i==="initiative"&&x.jsx(CF,{entries:e,unitMap:D,onComplete:Oe},s)})]})}function CF({entries:t,unitMap:e,onComplete:n}){const[i,r]=z.useState(!1),[s,a]=z.useState(!1),o=z.useMemo(()=>OE(t,e),[t,e]);return z.useEffect(()=>{const l=window.setTimeout(()=>r(!0),1300),c=window.setTimeout(()=>a(!0),2200),u=window.setTimeout(n,3900);return()=>{window.clearTimeout(l),window.clearTimeout(c),window.clearTimeout(u)}},[n]),x.jsx(ut.section,{className:"battle-init-roll-backdrop",role:"dialog","aria-modal":"true","aria-label":"先攻判定",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:x.jsxs(ut.div,{className:"battle-init-roll-panel",initial:{opacity:0,scale:.96,y:16},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.96,y:16},children:[x.jsxs("header",{children:[x.jsx("p",{className:"eyebrow",children:"INITIATIVE ROLL"}),x.jsx("h2",{children:"同时投掷先攻"}),x.jsx("small",{children:"7 位单位同时进行 1D20 判定：D20 + 敏捷调整值 + 其他加值。"})]}),x.jsx("div",{className:"battle-init-roll-grid",children:t.map(l=>{const c=e.get(l.unitId);if(!c)return null;const u=o.findIndex(f=>f.unitId===c.id)+1;return x.jsxs("article",{className:`battle-init-card ${s?"is-revealed":""}`,children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${c.model}`,children:c.portrait}),x.jsxs("div",{className:"battle-init-card-copy",children:[x.jsx("b",{children:c.name}),x.jsx("small",{children:c.faction==="ally"?"我方":"敌方"})]}),x.jsx(Pl,{dieType:"d20",roll:l.roll,rolling:!i,revealed:s,size:112,className:"battle-init-dice-wrap"}),x.jsx("p",{children:s?`${l.roll} ${Es(l.dexMod)}${l.otherBonus?` ${Es(l.otherBonus)}`:""} = ${l.total}`:i?"确认结果":"掷骰中"}),s&&x.jsxs("i",{children:["第 ",u," 位"]})]},c.id)})})]})})}function Z_({title:t,units:e,activeUnitId:n,align:i="left",onSelect:r}){return x.jsxs("aside",{className:`battle-roster battle-roster-${i}`,children:[x.jsx("span",{className:"battle-roster-title",children:t}),e.map(s=>x.jsxs("button",{type:"button",className:`battle-roster-unit ${s.id===n?"is-active":""} ${s.hp<=0?"is-defeated":""}`,onClick:()=>r(s.id),children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${s.model}`,children:s.portrait}),x.jsxs("span",{className:"battle-roster-copy",children:[x.jsx("b",{children:s.name}),x.jsxs("small",{children:["HP ",s.hp,"/",s.maxHp," · AC ",s.ac]}),x.jsx("span",{className:"battle-mini-hp",children:x.jsx("i",{style:{width:`${Zg(s)}%`}})})]})]},s.id))]})}function J_({unit:t,active:e,targetable:n,onClick:i}){return x.jsxs("button",{type:"button",className:`battle-combatant ${e?"is-active":""} ${n?"is-targetable":""} ${t.hp<=0?"is-defeated":""} ${t.faction==="enemy"?"is-enemy":"is-ally"}`,onClick:i,"aria-label":t.name,children:[x.jsxs("span",{className:`battle-sprite battle-sprite-${t.model}`,children:[x.jsx("span",{className:"sprite-aura"}),x.jsx("span",{className:"sprite-head"}),x.jsx("span",{className:"sprite-body"}),x.jsx("span",{className:"sprite-weapon"})]}),x.jsx("span",{className:"battle-combatant-name",children:t.name}),x.jsx("span",{className:"battle-combatant-hp",children:x.jsx("i",{style:{width:`${Zg(t)}%`}})})]})}function RF({effect:t}){return x.jsxs(ut.aside,{className:`battle-effect-panel ${t.success===!1?"is-fail":""}`,"aria-label":"回合效果",initial:{opacity:0,y:16},animate:{opacity:1,y:0},children:[x.jsx("span",{children:"AI KP 回合结算"}),x.jsx("h2",{children:t.title}),x.jsxs("p",{children:[x.jsx("b",{children:t.actorName})," 对 ",x.jsx("b",{children:t.targetName})," 使用 ",x.jsx("b",{children:t.skillName})]}),x.jsx("strong",{children:t.resultLine}),typeof t.amount=="number"&&x.jsx("em",{children:t.amount}),x.jsx("small",{children:t.formula}),x.jsx("blockquote",{children:t.narration}),x.jsx("p",{children:t.detail})]},t.id)}function PF({unit:t,initiative:e,onClose:n}){return x.jsx(ut.div,{className:"battle-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:n,children:x.jsxs(ut.section,{className:"battle-unit-modal",role:"dialog","aria-modal":"true","aria-label":`${t.name} 详情`,initial:{opacity:0,scale:.94,y:16},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.94,y:16},onClick:i=>i.stopPropagation(),children:[x.jsxs("header",{className:"battle-modal-header",children:[x.jsx("div",{className:`battle-avatar-mark battle-avatar-${t.model}`,children:t.portrait}),x.jsxs("div",{children:[x.jsx("span",{children:t.name}),x.jsx("small",{children:t.role})]}),x.jsx("button",{type:"button","aria-label":"关闭",onClick:n,children:"×"})]}),x.jsxs("div",{className:"battle-detail-grid",children:[x.jsxs("section",{className:"battle-detail-block",children:[x.jsx("h2",{children:"状态"}),x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"HP"}),x.jsxs("b",{children:[t.hp,"/",t.maxHp]})]}),x.jsx("div",{className:"battle-wide-hp",children:x.jsx("i",{style:{width:`${Zg(t)}%`}})}),x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"AC"}),x.jsx("b",{children:t.ac})]}),x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"熟练"}),x.jsx("b",{children:Es(t.proficiency)})]}),e&&x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"先攻"}),x.jsx("b",{children:e.total})]}),t.weaponMastery&&x.jsxs("div",{className:"battle-stat-note",children:[x.jsx("b",{children:"精通/资源"}),x.jsx("span",{children:t.weaponMastery})]}),x.jsx("div",{className:"battle-status-list",children:t.statuses.map(i=>x.jsx("span",{children:i},i))})]}),x.jsxs("section",{className:"battle-detail-block battle-abilities",children:[x.jsx("h2",{children:"六维数值"}),fF.map(([i,r])=>{const s=t.abilities[i];return x.jsxs("div",{className:"battle-ability-tile",children:[x.jsx("span",{children:r}),x.jsx("b",{children:s}),x.jsx("small",{children:Es(Go(s))})]},i)})]}),x.jsxs("section",{className:"battle-detail-block battle-traits",children:[x.jsx("h2",{children:"规则画像"}),t.traits.map(i=>x.jsx("span",{children:i},i)),t.resourceProfile.map(i=>x.jsx("span",{children:i},i))]}),x.jsxs("section",{className:"battle-detail-block battle-skills",children:[x.jsx("h2",{children:"战斗技能"}),t.skills.map(i=>x.jsx(DF,{skill:i,compact:!1},i.id))]}),t.nonCombatSkills.length>0&&x.jsxs("section",{className:"battle-detail-block battle-noncombat-skills",children:[x.jsx("h2",{children:"非战斗技能"}),t.nonCombatSkills.map(i=>x.jsxs("article",{children:[x.jsx("b",{children:i.name}),x.jsx("small",{children:i.check}),x.jsx("p",{children:i.effect})]},i.name))]})]})]})})}function DF({skill:t,compact:e=!0}){return x.jsxs("article",{className:`battle-skill-card ${t.locked?"is-locked":""} ${e?"is-compact":""}`,children:[x.jsxs("div",{className:"battle-skill-card-head",children:[x.jsx("span",{children:t.resource}),x.jsx("b",{children:t.name}),x.jsx("em",{children:t.cooldown})]}),x.jsx("small",{children:t.formula}),!e&&x.jsx("p",{children:t.effect}),x.jsxs("div",{className:"battle-skill-meta",children:[x.jsx("i",{children:SF(t)?"需掷骰":"无掷骰"}),x.jsx("i",{children:t.rule}),t.trigger&&x.jsx("i",{children:t.trigger}),t.tags.map(n=>x.jsx("i",{children:n},n))]})]})}function NF({unit:t,usedResources:e,pendingSkill:n,pendingTargets:i,onInspect:r,onClose:s,onEndTurn:a,onChooseSkill:o,onSelectTarget:l,onCancelTarget:c}){return x.jsxs(ut.section,{className:"battle-action-sheet",role:"dialog","aria-label":`${t.name} 行动`,initial:{opacity:0,y:28},animate:{opacity:1,y:0},exit:{opacity:0,y:28},children:[x.jsxs("header",{children:[x.jsxs("div",{children:[x.jsxs("span",{children:[t.name," 的回合"]}),x.jsx("small",{children:"先选技能，再指定释放对象，随后进入骰子判定与效果结算。"})]}),x.jsxs("div",{className:"battle-action-buttons",children:[x.jsx("button",{type:"button",className:"ghost-button",onClick:r,children:"详情"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:s,children:"收起"}),x.jsx("button",{type:"button",className:"start-button",onClick:a,children:"结束回合"})]})]}),x.jsxs("div",{className:"battle-action-content",children:[x.jsx("section",{className:"battle-action-skill-list","aria-label":"可用技能",children:t.skills.map(u=>{const d=Jp(u.resource,e)||u.locked;return x.jsxs("button",{type:"button",className:`${d?"is-disabled":""} ${(n==null?void 0:n.id)===u.id?"is-selected":""}`,disabled:d,onClick:()=>o(u),children:[x.jsx("span",{children:"技能"}),x.jsx("b",{children:u.name}),x.jsx("small",{children:u.formula}),x.jsx("em",{children:X_(u)})]},u.id)})}),n&&x.jsxs("section",{className:"battle-target-picker","aria-label":"指定释放对象",children:[x.jsxs("header",{children:[x.jsxs("div",{children:[x.jsx("b",{children:"指定释放对象"}),x.jsxs("span",{children:[n.name," · ",X_(n)]})]}),x.jsx("button",{type:"button",className:"ghost-button",onClick:c,children:"取消"})]}),x.jsx("div",{children:i.map(u=>x.jsxs("button",{type:"button",onClick:()=>l(u),children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${u.model}`,children:u.portrait}),x.jsx("b",{children:u.name}),x.jsxs("small",{children:["HP ",u.hp,"/",u.maxHp," · AC ",u.ac]})]},u.id))})]})]})]})}const tr=5,LF=2,IF=1,jf=3,ea=50,Q_=24340,Nc=[1,2,3,4,5],ey=7,ty=5,Ho=3,UF=15,FF=14,BE=15,Wf=Array(tr).fill(!0),$f=Array(tr).fill(!1),OF=[{label:"快艇",score:"800+",sample:"五颗同点，最高牌型。"},{label:"四条",score:"700+",sample:"四颗同点，剩余一颗不计牌型。"},{label:"葫芦",score:"600+",sample:"三颗同点 + 一对。"},{label:"顺子",score:"500+",sample:"1-2-3-4-5 或 2-3-4-5-6。"},{label:"三条",score:"400+",sample:"三颗同点。"},{label:"两对",score:"300+",sample:"两组对子。"},{label:"一对",score:"200+",sample:"一组对子。"},{label:"散牌",score:"100+",sample:"没有组合时，比最高点。"}],ny=new Map;function zE(t){return Math.floor(Math.random()*t)+1}function Qp(){return zE(6)}function iy(){return zE(20)}function ry(){return Array.from({length:tr},Qp)}function kF(t){return t.reduce((e,n)=>e+n,0)}function Qg(t){return t.reduce((e,n)=>(e[n]=(e[n]??0)+1,e),{})}function BF(t){return[...t].sort((e,n)=>n-e)}function zF(t){const e=Array.from(new Set(t)).sort((n,i)=>n-i);return[1,2,3,4,5].every(n=>e.includes(n))?5:[2,3,4,5,6].every(n=>e.includes(n))?6:0}function yr(t,e){return t*100+(e[0]??0)}function Fi(t){const e=Object.entries(Qg(t)).map(([u,f])=>({face:Number(u),count:f})).sort((u,f)=>f.count-u.count||f.face-u.face),n=e.filter(u=>u.count>=2).sort((u,f)=>f.face-u.face),i=BF(t),r=zF(t),s=e.find(u=>u.count===5);if(s){const u=[s.face];return{label:"快艇",rank:8,score:yr(8,u),detail:`五颗 ${s.face} 点`,tieBreak:u}}const a=e.find(u=>u.count===4);if(a){const u=i.find(d=>d!==a.face)??0,f=[a.face,u];return{label:"四条",rank:7,score:yr(7,f),detail:`四颗 ${a.face} 点`,tieBreak:f}}const o=e.find(u=>u.count===3),l=n.find(u=>u.face!==(o==null?void 0:o.face));if(o&&l){const u=[o.face,l.face];return{label:"葫芦",rank:6,score:yr(6,u),detail:`${o.face} 点三条 + ${l.face} 点对子`,tieBreak:u}}if(r){const u=[r];return{label:"顺子",rank:5,score:yr(5,u),detail:r===6?"2-3-4-5-6":"1-2-3-4-5",tieBreak:u}}if(o){const u=i.filter(d=>d!==o.face),f=[o.face,...u];return{label:"三条",rank:4,score:yr(4,f),detail:`三颗 ${o.face} 点`,tieBreak:f}}if(n.length>=2){const u=n.slice(0,2).map(p=>p.face).sort((p,v)=>v-p),f=i.find(p=>!u.includes(p))??0,d=[...u,f];return{label:"两对",rank:3,score:yr(3,d),detail:`${u[0]} 点对子 + ${u[1]} 点对子`,tieBreak:d}}if(n.length===1){const u=n[0].face,f=i.filter(p=>p!==u),d=[u,...f];return{label:"一对",rank:2,score:yr(2,d),detail:`${u} 点对子`,tieBreak:d}}const c=i;return{label:"散牌",rank:1,score:yr(1,c),detail:`最高 ${i[0]} 点，总点数 ${kF(t)}`,tieBreak:c}}function VE(t,e){if(t.rank!==e.rank)return t.rank>e.rank?1:-1;const n=Math.max(t.tieBreak.length,e.tieBreak.length);for(let i=0;i<n;i+=1){const r=t.tieBreak[i]??0,s=e.tieBreak[i]??0;if(r!==s)return r>s?1:-1}return 0}function VF(t){return t>0?"player":t<0?"enemy":"draw"}function GF(t){const e=Array.from(new Set(t)).sort((r,s)=>r-s);let n=[],i=[];return e.forEach(r=>{!i.length||r===i[i.length-1]+1?i.push(r):(i.length>n.length&&(n=i),i=[r])}),i.length>n.length&&(n=i),n}function HF(t){if(Fi(t).rank>=5)return t.map(()=>!0);const i=Object.entries(Qg(t)).map(([a,o])=>({face:Number(a),count:o})).sort((a,o)=>o.count-a.count||o.face-a.face)[0];if(i.count>=2)return t.map(a=>a===i.face);const r=GF(t);if(r.length>=3){const a=new Set(r);return t.map(o=>a.has(o))}const s=Math.max(...t);return t.map(a=>a===s)}function GE(t,e,n){return t==="draw"?`平局：双方都是 ${e.label}，关键点数完全相同。`:t==="player"?e.label===n.label?`我方获胜：同为 ${e.label}，我方关键点数更高。`:`我方获胜：${e.label} 压过敌方 ${n.label}。`:e.label===n.label?`敌方获胜：同为 ${n.label}，敌方关键点数更高。`:`敌方获胜：敌方 ${n.label} 压过我方 ${e.label}。`}function ta(t){t.current.forEach(e=>window.clearTimeout(e)),t.current=[]}function jF(t){return t>=24?5:t>=21?4:t>=18?3:2}function WF(t){const e=[0,1,2,3,4];for(let n=e.length-1;n>0;n-=1){const i=Math.floor(Math.random()*(n+1));[e[n],e[i]]=[e[i],e[n]]}return e.slice(0,t).sort((n,i)=>n-i)}function HE(t){const e=ny.get(t);if(e)return e;if(t===0)return[[]];const n=HE(t-1),i=[];return n.forEach(r=>{for(let s=1;s<=6;s+=1)i.push([...r,s])}),ny.set(t,i),i}function jE(t,e){var a;if(e.length===5)return Fi(t);const n=e.map(o=>t[o]);if(!n.length)return null;const i=[...n],s=((a=Object.entries(Qg(n)).map(([o,l])=>({face:Number(o),count:l})).sort((o,l)=>l.count-o.count||l.face-o.face)[0])==null?void 0:a.face)??Math.max(...n);for(;i.length<tr;)i.push(s);return Fi(i)}function $F(t,e,n){if(n||e.length===5)return`敌方完整牌型：${Fi(t).label}（${Fi(t).detail}）。`;if(!e.length)return"瑟琳还没有拿到敌方骰面情报，建议先按我方期望牌型最大化。";const i=e.map(s=>t[s]),r=jE(t,e);return`瑟琳透露第 ${e.map(s=>s+1).join("、")} 颗：${i.join(" / ")}。AI推测敌方可能在追 ${(r==null?void 0:r.label)??"高点"}。`}function XF(t,e,n,i){const r=i?Fi(e):jE(e,n);let s=null;for(let c=0;c<1<<tr;c+=1){const u=Array.from({length:tr},(_,M)=>!!(c&1<<M)),f=u.map((_,M)=>_?-1:M).filter(_=>_>=0),d=HE(f.length);let p=0,v=0;d.forEach(_=>{const M=[...t];f.forEach((T,R)=>{M[T]=_[R]});const w=Fi(M);p+=w.score,r&&VE(w,r)>0&&(v+=1)});const y=p/d.length,g=r?v/d.length:void 0,h=(g??0)*1e3+y,m=((s==null?void 0:s.winRate)??0)*1e3+((s==null?void 0:s.expectedScore)??0);(!s||h>m)&&(s={keepMask:u,rerollIndexes:f,expectedScore:y,winRate:g,headline:"",detail:""})}const a=Fi(t),o=s!=null&&s.rerollIndexes.length?`建议重掷第 ${s.rerollIndexes.map(c=>c+1).join("、")} 颗。`:"建议不重掷，直接结算。",l=r?`对照目标约为 ${r.label}，预计胜率 ${Math.round(((s==null?void 0:s.winRate)??0)*100)}%。`:"敌方信息不足，本轮按期望牌型分最大化。";return{...s??{keepMask:Array(tr).fill(!0),rerollIndexes:[],expectedScore:a.score,winRate:void 0,headline:"",detail:""},headline:`${o} 当前是 ${a.label}。`,detail:`${l} 枚举所有可保留方案后，推荐方案的期望牌型分约 ${Math.round((s==null?void 0:s.expectedScore)??a.score)}。`}}function YF({sessionState:t,roundNumber:e,playerHand:n,enemyHand:i,revealedCount:r,advisorPlan:s,serlynCheck:a,roundWinner:o,rerollsLeft:l}){if(t==="idle")return"萨洛把骰盅往桌上一扣，笑着等你付入场费。瑟琳没有催促，只在观察老板的手势。";if(t==="prep")return a?a.kind==="stealth"?a.success?`瑟琳从灯影里退回来，轻声报出她看见的线索：本轮至少能揭开 ${a.revealCount??0} 颗敌骰。`:"瑟琳指尖按在杯沿上，摇了摇头：老板这次盯得太紧，她不建议继续冒险。":a.success?"瑟琳把话题绕到老板年轻时的胜局，老板被哄得松口，赌桌多给你一次重掷。":"老板笑着收回骰盅，瑟琳轻轻叹气：这人情牌没打动他，只能靠牌面说话。":`第 ${e} 轮开局前，瑟琳看向你，等你决定是偷偷看牌，还是用话术多争取一次机会。`;if(t==="playing"){if(s){const c=s.winRate===void 0?"敌方情报不足":`预计胜率 ${Math.round(s.winRate*100)}%`;return r?`瑟琳压低声音补完情报，AI参谋把 ${c} 摆在你面前，建议这次别被高点散牌诱惑。`:`敌方骰盅仍然盖着，AI参谋只能按期望收益推演；还剩 ${l} 次重掷，先把牌型骨架做出来。`}return"骰子还在桌面滚动，萨洛的手指敲着木边，等你决定哪些留下。"}return t==="round-settled"?o==="player"?`我方 ${n.label} 压住敌方 ${i.label}。萨洛挑眉看向奖池，等你决定见好就收还是继续翻倍。`:o==="enemy"?`敌方 ${i.label} 反压我方 ${n.label}。瑟琳立刻提醒：现在只剩求情判定能把本局拉回来。`:`双方同为 ${n.label}，赌桌短暂安静下来。老板摊手，示意本轮可以重开。`:t==="cashed-out"?"你把奖池收进口袋，萨洛吹了声口哨，瑟琳把这场赌局记成了一次还算漂亮的情报演练。":"赌局气氛沉了下去。老板收回骰盅，瑟琳没有责怪你，只提醒下一次要先看清风险。"}function KF({onBack:t}){const[e,n]=z.useState(Q_),[i,r]=z.useState("idle"),[s,a]=z.useState(1),[o,l]=z.useState(ea),[c,u]=z.useState(Nc),[f,d]=z.useState(Nc),[p,v]=z.useState(Wf),[y,g]=z.useState($f),[h,m]=z.useState([]),[_,M]=z.useState(0),[w,T]=z.useState(!1),[R,S]=z.useState(!1),[A,N]=z.useState(null),[D,I]=z.useState(!1),[X,G]=z.useState(0),[U,H]=z.useState(null),[B,F]=z.useState(null),[K,Y]=z.useState("支付 50G 入场费后开始最多三轮的快艇赌局。"),re=z.useRef([]),oe=z.useMemo(()=>Fi(c),[c]),xe=z.useMemo(()=>Fi(f),[f]),Pe=LF+X,Ae=_>0?Math.max(0,Pe-(_-1)):Pe,Q=_>0,le=i==="round-settled",ue=le||h.length===tr,Ce=i==="prep"&&!w&&!(A!=null&&A.rolling)&&(!!A||D),Oe=i==="playing"&&Q&&!w&&!le,_e=z.useMemo(()=>Oe?XF(c,f,h,ue):null,[Oe,f,ue,c,h]),Je=z.useMemo(()=>YF({sessionState:i,roundNumber:s,playerHand:oe,enemyHand:xe,revealedCount:h.length,advisorPlan:_e,serlynCheck:A,roundWinner:B,rerollsLeft:Ae}),[_e,xe,oe,h.length,Ae,s,B,A,i]);function Ne(Z){ta(re),u(Nc),d(Nc),v(Wf),g($f),m([]),M(0),T(!1),S(!1),N(null),I(!1),G(0),H(null),F(null),Y(Z)}function Qe(){ta(re),n(Q_),r("idle"),a(1),l(ea),Ne("支付 50G 入场费后开始最多三轮的快艇赌局。")}function tt(){e<ea||(n(Z=>Z-ea),r("prep"),a(1),l(ea),Ne("已支付 50G 入场费。每轮开骰前，可以让瑟琳选择潜行偷窥或人情说服，两者只能选一个。"))}function Ve(Z){if(i!=="prep"||A!=null&&A.rolling||A||D)return;ta(re);const ie=iy(),J=Z==="stealth"?ey:ty,ee=Z==="stealth"?UF:FF,me=ie+J,ye=ie===20||ie!==1&&me>=ee,fe=Z==="stealth"&&ye?jF(me):0;N({kind:Z,roll:ie,total:me,success:ye,rolling:!0,revealCount:fe}),Y(Z==="stealth"?"瑟琳靠近赌桌阴影，准备潜行偷窥对手骰盅。":"瑟琳开始和老板套近乎，试图多争取一次重掷机会。");const de=window.setTimeout(()=>{N({kind:Z,roll:ie,total:me,success:ye,rolling:!1,revealCount:fe}),Z==="stealth"?Y(ye?`潜行成功：${me} 点。开骰后瑟琳会随机透露 ${fe} 颗敌方骰子。`:`潜行失败：${me} 点。瑟琳没有暴露，但也没能偷看到牌。`):(G(ye?IF:0),Y(ye?`人情成功：${me} 点。老板松口，本轮额外获得 1 次重掷机会。`:`人情失败：${me} 点。老板笑着摇头，本轮仍然只有 2 次重掷机会。`))},1150);re.current.push(de)}function vt(){i!=="prep"||A||D||(I(!0),Y("你决定不让瑟琳冒险，本轮直接开骰。"))}function ot(Z){const ie=window.setTimeout(()=>{T(!1),S(!0),Y(Z)},960);re.current.push(ie)}function Nt(){if(!Ce)return;ta(re);const Z=ry(),ie=(A==null?void 0:A.kind)==="stealth"&&A.success?A.revealCount??0:0;u(ry()),d(Z),v(Wf),g($f),m(ie?WF(ie):[]),M(1),T(!0),S(!1),r("playing"),Y("双方同时开骰。"),ot(ie?"第一手完成。瑟琳已经把偷看到的敌方骰子告诉你，AI建议已更新。":"第一手完成。敌方牌面隐藏，AI会先按我方期望牌型给建议。")}function P(Z){i!=="playing"||!Q||w||v(ie=>ie.map((J,ee)=>ee===Z?!J:J))}function Ie(){!_e||!Oe||(v(_e.keepMask),Y(`已按AI建议标记重掷骰：第 ${_e.rerollIndexes.length?_e.rerollIndexes.map(Z=>Z+1).join("、"):"无"} 颗。未标记骰子默认保留。`))}function Re(){if(i!=="playing"||!Q||w||Ae<=0)return;ta(re);const Z=HF(f);g(Z),u(ie=>ie.map((J,ee)=>p[ee]?J:Qp())),d(ie=>ie.map((J,ee)=>Z[ee]?J:Qp())),M(ie=>ie+1),T(!0),S(!1),Y("双方重投已选中的骰子。敌方AI的保留选择只会在被瑟琳透露的位置显现。"),ot(Ae-1>0?"重投完成。AI建议已根据新牌面重新计算。":"最后一次重投完成。现在可以结算牌型。")}function ze(){if(i!=="playing"||!Q||w)return;const Z=VF(VE(oe,xe));F(Z),r("round-settled"),m([0,1,2,3,4]),Y(GE(Z,oe,xe))}function ae(Z,ie){a(Z),l(ie),r("prep"),Ne(`第 ${Z} 轮赌资翻倍为 ${ie}G。开骰前重新选择瑟琳行动。`)}function Me(){const Z=o*2;n(ie=>ie+Z),r("cashed-out"),Y(`你收走奖池 ${Z}G，本次快艇赌局结束。`)}function C(){if(s>=jf){Me();return}ae(s+1,o*2)}function E(){r("prep"),Ne("平局重开本轮，不消耗额外赌资。开骰前可以重新选择瑟琳行动。")}function k(){if(i!=="round-settled"||B!=="enemy"||U!=null&&U.rolling||U)return;ta(re);const Z=iy(),ie=Z+Ho,J=Z===20||Z!==1&&ie>=BE;H({kind:"plea",roll:Z,total:ie,success:J,rolling:!0}),Y("你向老板求情，试图让这一局重新来过。");const ee=window.setTimeout(()=>{H({kind:"plea",roll:Z,total:ie,success:J,rolling:!1}),J?(r("prep"),Ne(`求情成功：D20 ${Z} + ${Ho} = ${ie}。老板同意重启本轮。`)):(r("failed"),Y(`求情失败：D20 ${Z} + ${Ho} = ${ie}。本次赌局失败，已损失入场费与当前赌资。`))},1150);re.current.push(ee)}const j=$F(f,h,le),te=o*2;return x.jsx("main",{className:"yacht-screen",children:x.jsxs(ut.section,{className:"yacht-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.35,ease:"easeOut"},children:[x.jsxs("header",{className:"test-header yacht-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"YACHT STORY DUEL"}),x.jsx("h1",{children:"快艇骰子赌局测试"}),x.jsx("small",{children:"入场费 50G，最多三轮。胜后可收走奖池，也可翻倍进入下一轮。"})]}),x.jsxs("div",{className:"yacht-header-actions",children:[x.jsx("button",{type:"button",className:"ghost-button",onClick:Qe,children:"重置测试"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:t,children:"返回"})]})]}),x.jsxs("div",{className:"yacht-game-grid",children:[x.jsxs("section",{className:"yacht-play-panel","aria-label":"快艇骰子赌局",children:[x.jsxs("section",{className:"yacht-bank-panel","aria-label":"赌局状态",children:[x.jsxs("article",{children:[x.jsx("span",{children:"金币"}),x.jsxs("b",{children:[e.toLocaleString(),"G"]})]}),x.jsxs("article",{children:[x.jsx("span",{children:"轮次"}),x.jsx("b",{children:i==="idle"?"未入场":`${s}/${jf}`})]}),x.jsxs("article",{children:[x.jsx("span",{children:"当前赌资"}),x.jsxs("b",{children:[o,"G"]})]}),x.jsxs("article",{children:[x.jsx("span",{children:"本轮奖池"}),x.jsxs("b",{children:[te,"G"]})]}),i==="idle"&&x.jsx("button",{type:"button",className:"start-button",onClick:tt,disabled:e<ea,children:"支付 50G 入场"})]}),x.jsxs("section",{className:"yacht-serlyn-panel","aria-label":"瑟琳开场行动",children:[x.jsxs("div",{children:[x.jsx("span",{children:"瑟琳行动"}),x.jsx("b",{children:"每轮开骰前二选一"}),x.jsx("small",{children:"潜行成功会随机透露 2-5 颗敌方骰子；人情成功会让老板多给本轮 1 次重掷机会。"})]}),x.jsx(Pl,{dieType:"d20",roll:(A==null?void 0:A.roll)??null,rolling:!!(A!=null&&A.rolling),revealed:!!(A&&!A.rolling),size:92,className:"yacht-perception-die"}),x.jsxs("div",{className:"yacht-serlyn-actions",children:[x.jsx("button",{type:"button",className:"ghost-button",onClick:()=>Ve("stealth"),disabled:i!=="prep"||!!A||D,children:"潜行偷窥"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:()=>Ve("favor"),disabled:i!=="prep"||!!A||D,children:"人情说服"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:vt,disabled:i!=="prep"||!!A||D,children:"跳过协助"})]}),x.jsx("p",{children:A?`${A.kind==="stealth"?"潜行":"人情"}：D20 ${A.roll} + ${A.kind==="stealth"?ey:ty} = ${A.total}，${A.success?"成功":"失败"}。`:D?"本轮未使用瑟琳协助。":"等待选择瑟琳行动。"})]}),x.jsxs("div",{className:"yacht-status-row",children:[x.jsxs("div",{children:[x.jsx("span",{children:i==="round-settled"?"本轮已结算":i==="playing"?"对局进行中":i==="prep"?"开场准备":"赌局状态"}),x.jsxs("b",{children:["投掷 ",_||0,"/",Pe+1," · 重投机会 ",Ae,"/",Pe]})]}),x.jsx("strong",{children:K})]}),x.jsxs("div",{className:"yacht-duel-table",children:[x.jsx(sy,{title:"敌方：Joker 之王",subtitle:le||h.length===tr?`${xe.label} · 牌型分 ${xe.score}`:h.length?`瑟琳透露 ${h.length} 颗`:"牌型未知",dice:f,locked:y,rolling:w,visibleIndexes:le?[0,1,2,3,4]:h,diceRevealed:R,side:"enemy"}),x.jsx(sy,{title:"我方：冒险者",subtitle:Q?`${oe.label} · 牌型分 ${oe.score}`:"等待开骰",dice:c,locked:p,rolling:w,visibleIndexes:Q?[0,1,2,3,4]:[],diceRevealed:R,side:"player",canToggle:i==="playing"&&Q&&!w,onToggle:P})]}),x.jsxs("section",{className:"yacht-control-row","aria-label":"对局操作",children:[x.jsx("button",{type:"button",className:"start-button",onClick:Q?Re:Nt,disabled:w||i!=="playing"&&!Ce||Q&&Ae<=0,children:Q?Ae>0?"重掷选中骰":"重掷已用完":"开始本轮"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:ze,disabled:i!=="playing"||!Q||w,children:"结算牌型"}),x.jsx("p",{children:j})]}),x.jsxs("section",{className:"yacht-advisor-panel","aria-label":"AI 推荐",children:[x.jsxs("header",{children:[x.jsx("span",{children:"AI参谋"}),x.jsx("b",{children:"根据我方牌型与瑟琳情报枚举计算"})]}),_e?x.jsxs(x.Fragment,{children:[x.jsx("p",{children:_e.headline}),x.jsx("small",{children:_e.detail}),x.jsx("button",{type:"button",className:"ghost-button",onClick:Ie,children:"按建议选择重掷骰"})]}):x.jsxs(x.Fragment,{children:[x.jsx("p",{children:"开骰后，AI会根据当前牌型、剩余重投次数和已透露敌骰推荐重掷位置。"}),x.jsx("small",{children:"如果瑟琳没有拿到情报，AI会先按我方期望牌型分最大化。"})]}),x.jsxs("small",{className:"yacht-atmosphere-line",children:["氛围组：",Je]})]}),le&&x.jsx(qF,{winner:B??"draw",playerDice:c,enemyDice:f,playerHand:oe,enemyHand:xe,stake:o,prize:te,roundNumber:s,maxRounds:jf,pleaCheck:U,onCashOut:Me,onContinue:C,onPlea:k,onDrawRestart:E})]}),x.jsxs("aside",{className:"yacht-side-panel","aria-label":"快艇骰子规则",children:[x.jsxs("section",{className:"yacht-rank-ladder","aria-label":"牌型阶梯",children:[x.jsxs("header",{children:[x.jsx("span",{children:"牌型阶梯"}),x.jsx("small",{children:"分数越高越强"})]}),OF.map(Z=>x.jsxs("article",{className:"yacht-rank-row",children:[x.jsx("b",{children:Z.label}),x.jsx("strong",{children:Z.score}),x.jsx("span",{children:Z.sample})]},Z.label))]}),x.jsxs("section",{className:"yacht-rules-panel","aria-label":"详细规则说明",children:[x.jsx("h2",{children:"赌局规则"}),x.jsxs("ol",{children:[x.jsx("li",{children:"入场费 50G，最多进行 3 轮。第 1 轮赌资为 50G。"}),x.jsx("li",{children:"每轮开骰前，瑟琳可以选择潜行偷窥或人情说服，两者只能选一个。"}),x.jsx("li",{children:"潜行成功后，按判定总值随机透露 2-5 颗敌方骰子；人情成功后，本轮额外获得 1 次重掷。"}),x.jsx("li",{children:"每轮双方同时投 5D6，默认有 2 次重掷机会。骰子默认保留，玩家点选的骰子会加入重掷队列。"}),x.jsx("li",{children:"获胜后可拿走当前奖池结束，也可让赌资翻倍进入下一轮。"}),x.jsx("li",{children:"失败后可进行一次求情判定，成功则重启本轮，失败则赌局直接失败。"})]})]})]})]})]})})}function sy({title:t,subtitle:e,dice:n,locked:i,rolling:r,visibleIndexes:s,diceRevealed:a,side:o,canToggle:l=!1,onToggle:c}){const u=new Set(s);return x.jsxs("section",{className:`yacht-hand-panel is-${o} ${s.length?"is-visible":"is-hidden"}`,"aria-label":t,children:[x.jsxs("header",{children:[x.jsxs("div",{children:[x.jsx("span",{children:o==="enemy"?"对手":"我方"}),x.jsx("h2",{children:t})]}),x.jsx("strong",{children:e})]}),x.jsx("div",{className:"yacht-dice-row",children:n.map((f,d)=>{const p=u.has(d),v=p&&(a||i[d]),y=r&&!i[d],g=o==="player"&&p&&!i[d],h=o==="enemy"&&i[d];return x.jsxs("button",{type:"button",className:`yacht-die ${h?"is-locked":""} ${g?"is-reroll":""} ${p?"":"is-hidden"}`,onClick:()=>c==null?void 0:c(d),disabled:!l,children:[x.jsx(Pl,{dieType:"d6",roll:p?f:null,rolling:y,revealed:v,size:118,className:"yacht-dice-canvas",faceStyle:"pips",showResultBadge:!1}),!p&&x.jsx("i",{className:"yacht-hidden-mark",children:"?"}),x.jsx("span",{children:o==="enemy"?p?i[d]?"敌方保留":"敌方骰面":"隐藏":i[d]?"默认保留":"选中重掷"})]},`${o}-${d}`)})})]})}function qF({winner:t,playerDice:e,enemyDice:n,playerHand:i,enemyHand:r,stake:s,prize:a,roundNumber:o,maxRounds:l,pleaCheck:c,onCashOut:u,onContinue:f,onPlea:d,onDrawRestart:p}){return x.jsxs("section",{className:`yacht-result-panel is-${t}`,"aria-label":"结算结果",children:[x.jsx("h2",{children:GE(t,i,r)}),x.jsxs("p",{children:["我方：",e.join(" / ")," · ",i.label,"（",i.detail,"）· ",i.score," 分"]}),x.jsxs("p",{children:["敌方：",n.join(" / ")," · ",r.label,"（",r.detail,"）· ",r.score," 分"]}),t==="player"&&x.jsxs("div",{className:"yacht-result-actions",children:[x.jsxs("button",{type:"button",className:"start-button",onClick:u,children:["拿走奖池 ",a,"G"]}),x.jsx("button",{type:"button",className:"ghost-button",onClick:f,children:o>=l?"收走最终奖池":`翻倍进入下一轮（${s*2}G）`})]}),t==="enemy"&&x.jsxs("div",{className:"yacht-result-actions",children:[x.jsx(Pl,{dieType:"d20",roll:(c==null?void 0:c.roll)??null,rolling:!!(c!=null&&c.rolling),revealed:!!(c&&!c.rolling),size:86,className:"yacht-perception-die"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:d,disabled:!!c,children:"求情判定"}),x.jsx("small",{children:c?`D20 ${c.roll} + ${Ho} = ${c.total}，${c.success?"成功重启本轮":"失败，赌局结束"}。`:`冒险者 魅力 +${Ho} / DC ${BE}，成功可重启本轮。`})]}),t==="draw"&&x.jsx("div",{className:"yacht-result-actions",children:x.jsx("button",{type:"button",className:"ghost-button",onClick:p,children:"平局重开本轮"})})]})}const Xf=[{type:"d4",label:"四面骰",sides:4},{type:"d6",label:"六面骰",sides:6},{type:"d8",label:"八面骰",sides:8},{type:"d12",label:"十二面骰",sides:12},{type:"d20",label:"二十面骰",sides:20}];function ZF({onBack:t}){const[e,n]=z.useState("menu"),[i,r]=z.useState("d20"),[s,a]=z.useState(null),[o,l]=z.useState([]),c=z.useMemo(()=>Xf.find(p=>p.type===i)??Xf[4],[i]);function u(){if(e==="dice-roll"){n("dice-select");return}if(e==="dice-select"){n("menu");return}if(e==="battle"){n("menu");return}if(e==="yacht"){n("menu");return}t()}function f(p){r(p),n("dice-roll"),a(null)}function d(){if(s)return;const p=Math.floor(Math.random()*c.sides)+1,v=Date.now();l(y=>[{id:v,die:c.type,value:p},...y].slice(0,8)),a({type:"dice_test",data:{骰子:`D${c.sides}`,掷骰:`D${c.sides}=${p}`,结果:p,总计:p,id:v}})}return e==="battle"?x.jsx(AF,{onBack:()=>n("menu")}):e==="yacht"?x.jsx(KF,{onBack:()=>n("menu")}):x.jsxs("main",{className:"test-screen",children:[x.jsxs(ut.section,{className:"test-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.35,ease:"easeOut"},children:[x.jsxs("header",{className:"test-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"TEST LAB"}),x.jsx("h1",{children:"测试"})]}),x.jsx("button",{type:"button",className:"ghost-button",onClick:u,children:"返回"})]}),e==="menu"&&x.jsxs("section",{className:"test-menu-grid","aria-label":"测试类型",children:[x.jsxs("button",{type:"button",className:"test-mode-button",onClick:()=>n("dice-select"),children:[x.jsx("span",{children:"测试骰子"}),x.jsx("small",{children:"验证 D4、D6、D8、D12、D20 是否能正常投出结果"})]}),x.jsxs("button",{type:"button",className:"test-mode-button",onClick:()=>n("battle"),children:[x.jsx("span",{children:"测试战斗"}),x.jsx("small",{children:"B1 层先攻、指定目标、骰子判定与 AI KP 战斗描写"})]}),x.jsxs("button",{type:"button",className:"test-mode-button",onClick:()=>n("yacht"),children:[x.jsx("span",{children:"快艇骰子"}),x.jsx("small",{children:"三轮赌局、瑟琳协助、AI建议、氛围旁白与点面 D6"})]})]}),e==="dice-select"&&x.jsxs("section",{className:"dice-select-panel",children:[x.jsxs("div",{className:"test-section-title",children:[x.jsx("span",{children:"选择骰子"}),x.jsx("small",{children:"选择后进入判定界面"})]}),x.jsx("div",{className:"dice-option-grid",children:Xf.map(p=>x.jsxs("button",{type:"button",className:"dice-option-button",onClick:()=>f(p.type),children:[x.jsxs("b",{children:["D",p.sides]}),x.jsx("span",{children:p.label})]},p.type))})]}),e==="dice-roll"&&x.jsxs("section",{className:"dice-judge-panel",children:[x.jsxs("div",{className:"test-section-title",children:[x.jsxs("span",{children:[c.label,"判定"]}),x.jsxs("small",{children:["点击投骰，确认 ",`D${c.sides}`," 可以生成结果"]})]}),x.jsxs("div",{className:"dice-judge-board",children:[x.jsxs("div",{className:"dice-judge-symbol",children:["D",c.sides]}),x.jsxs("div",{className:"dice-judge-copy",children:[x.jsx("strong",{children:o[0]?`最近结果：${o[0].value}`:"等待投骰"}),x.jsx("p",{children:s?"投骰动画进行中":"准备进行一次独立骰子判定。"})]}),x.jsx("button",{type:"button",className:"start-button",onClick:d,disabled:!!s,children:"投骰"})]}),x.jsx("div",{className:"dice-history-list","aria-label":"投骰记录",children:o.length?o.map(p=>x.jsxs("p",{children:[x.jsx("span",{children:p.die.toUpperCase()}),x.jsx("b",{children:p.value})]},p.id)):x.jsx("p",{className:"dice-history-empty",children:"暂无投骰记录"})})]})]}),x.jsx(Yg,{dice:s,dieType:i,onClose:()=>a(null)})]})}const JF=[{label:"新游戏",action:"new"},{label:"载入游戏",action:"load"},{label:"设置",action:"settings",disabled:!0},{label:"画廊",action:"gallery",disabled:!0},{label:"测试",action:"test"}];function QF({onNewGame:t,onLoadGame:e,onTest:n}){return x.jsxs("main",{className:"title-menu-screen",children:[x.jsx("div",{className:"title-menu-shade"}),x.jsxs(ut.section,{className:"title-menu-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.45,ease:"easeOut"},children:[x.jsxs("div",{className:"title-brand",children:[x.jsx("p",{className:"eyebrow",children:"D&D AI-TRPG"}),x.jsx("h1",{children:"地心之门"}),x.jsx("div",{className:"title-rule"})]}),x.jsx("nav",{className:"title-menu-actions","aria-label":"主菜单",children:JF.map((i,r)=>{const s=i.action==="new"?t:i.action==="load"?e:i.action==="test"?n:void 0,a="disabled"in i&&i.disabled;return x.jsx(ut.button,{type:"button",className:"title-menu-button",disabled:a,onClick:s,initial:{opacity:0,x:-12},animate:{opacity:1,x:0},transition:{delay:.08+r*.05},children:x.jsx("span",{children:i.label})},i.action)})})]})]})}function eO({items:t}){return x.jsx("div",{className:"event-feed","aria-live":"polite",children:x.jsx(Br,{children:t.slice(-4).map(e=>x.jsx(ut.div,{initial:{opacity:0,x:18},animate:{opacity:1,x:0},exit:{opacity:0,x:18},className:`event-chip event-${e.tone}`,children:e.text},e.id))})})}function tO(t,e=20){const[n,i]=z.useState(""),[r,s]=z.useState(!0);z.useEffect(()=>{if(!t){i(""),s(!0);return}let o=0;i(""),s(!1);const l=window.setInterval(()=>{o+=1,i(t.slice(0,o)),o>=t.length&&(s(!0),window.clearInterval(l))},e);return()=>window.clearInterval(l)},[e,t]);const a=z.useCallback(()=>{i(t),s(!0)},[t]);return{visible:n,done:r,reveal:a}}function nO({scene:t,line:e,events:n,isStreaming:i,isActionPhase:r,canAdvance:s,actionPanel:a,onAdvance:o}){const l=(e==null?void 0:e.text)||"",{visible:c,done:u,reveal:f}=tO(l),d=(e==null?void 0:e.speaker)||(i?"KP":""),p=z.useMemo(()=>r?"行动":!e&&i?"等待KP":u?s?"下一句":"等待KP":"显示全文",[s,u,r,i,e]);function v(){if(!r&&!(!e&&i)){if(!u){f();return}s&&o()}}return z.useEffect(()=>{function y(g){var h,m;g.key===" "&&!r&&((h=document.activeElement)==null?void 0:h.tagName)!=="INPUT"&&((m=document.activeElement)==null?void 0:m.tagName)!=="TEXTAREA"&&(g.preventDefault(),v())}return window.addEventListener("keydown",y),()=>window.removeEventListener("keydown",y)},[r,s,u,i,e]),x.jsxs("main",{className:`vn-canvas ${t.themeClass}`,onClick:v,children:[x.jsx("div",{className:"scene-layer"}),x.jsx("div",{className:"scene-vignette"}),x.jsxs("header",{className:"scene-header",children:[x.jsx("span",{children:t.title}),x.jsx("small",{children:t.subtitle})]}),x.jsx(eO,{items:n}),x.jsxs(ut.section,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},className:`dialogue-box dialogue-${(e==null?void 0:e.role)||"kp"}`,onClick:y=>y.stopPropagation(),children:[x.jsxs("div",{className:"speaker-row",children:[x.jsx("span",{children:d||"KP"}),i&&x.jsx("i",{children:"思考中"})]}),x.jsx("p",{children:c||(i?"……":"")}),x.jsx("button",{type:"button",onClick:v,disabled:r||!e&&i,className:"next-button",children:p})]},(e==null?void 0:e.id)||"empty-line"),a]})}const ay=[{id:"inverse-city",title:"逆穹城",subtitle:"倒挂在穹顶下的奇迹城邦",aliases:["逆穹城","倒挂城市","城市","城中"],themeClass:"scene-crown-city"},{id:"guild",title:"冒险者公会",subtitle:"委托、远征档案与失踪者名单",aliases:["冒险者公会","公会","公会大厅"],themeClass:"scene-guild"},{id:"tavern",title:"回声酒馆",subtitle:"传闻、情报与一杯暖酒",aliases:["回声酒馆","酒馆","碎盾"],themeClass:"scene-guild"},{id:"market",title:"补给市场",subtitle:"抗孢面罩、冷光灯与药剂",aliases:["补给市场","市场","黑市"],themeClass:"scene-library"},{id:"forge",title:"匠炉区",subtitle:"武器锻造、装备维修与工程之谜",aliases:["匠炉区","匠炉","武器店"],themeClass:"scene-chapel"},{id:"temple",title:"静默神殿",subtitle:"治疗、安魂与远征者遗录",aliases:["静默神殿","神殿"],themeClass:"scene-sanctum"},{id:"observatory",title:"黑石观测台",subtitle:"地脉震动、魔力脉冲与时间异常",aliases:["黑石观测台","观测台","黑石台"],themeClass:"scene-tomb"},{id:"cable-elevator",title:"降渊缆梯",subtitle:"九条秘银主缆垂向深渊",aliases:["降渊缆梯","缆梯","缆梯中枢","吊舱","垂降"],themeClass:"scene-maze"},{id:"spore-outpost",title:"孢海据点",subtitle:"半废弃的前线安全点",aliases:["孢海据点","据点","缆梯底部"],themeClass:"scene-chapel"},{id:"blue-cap-shallows",title:"蓝伞浅滩",subtitle:"巨大菌伞像沉默的灯塔",aliases:["蓝伞浅滩","浅滩","蓝伞"],themeClass:"scene-library"},{id:"echo-fungus-forest",title:"回声菌林",subtitle:"菌柱间传来模仿人声的低语",aliases:["回声菌林","菌林","回声区"],themeClass:"scene-maze"},{id:"bone-pillar-marsh",title:"骨柱湿地",subtitle:"菌毯陷落与寄生魔物的领地",aliases:["骨柱湿地","湿地","骨柱"],themeClass:"scene-tomb"},{id:"blackstone-root",title:"黑石根区",subtitle:"黑色方尖碑碎片在菌丝中发光",aliases:["黑石根区","黑石区","根区","黑石"],themeClass:"scene-sanctum"},{id:"dark-gate-vestibule",title:"黑暗之门前庭",subtitle:"三重时间纹路封印的古老入口",aliases:["黑暗之门前庭","前庭","黑门前","黑暗之门","门前"],themeClass:"scene-sanctum"}];function iO(t){const e=String(t.current_area||""),n=ay.find(i=>i.aliases.some(r=>e.includes(r)));return n||ay[0]}const Dl="/api/dnd",Lc="KP暂时没有回应，已为本轮处理启用兜底。",rO=/(connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|load\s*failed|timeout|timed\s*out|econn|socket|fetch|body\s*stream|terminated|aborted)/i;function Vu(t,e){const n=String(t||"").trim();return!n||rO.test(n)?e:n}async function Nl(t,e){const n=await t.json().catch(()=>({}));return Vu(n.detail,e)}async function Ll(t,e,n){try{return await fetch(t,e)}catch(i){throw new Error(Vu(i==null?void 0:i.message,n))}}async function sO(t){const e=await Ll(`${Dl}/game/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)},"创建游戏失败");if(!e.ok)throw new Error(await Nl(e,"创建游戏失败"));return e.json()}async function aO(){const t=await Ll(`${Dl}/saves`,void 0,"获取存档失败");if(!t.ok)throw new Error(await Nl(t,"获取存档失败"));return t.json()}async function oO(t,e){const n=await Ll(`${Dl}/game/${t}/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)},"保存失败");if(!n.ok)throw new Error(await Nl(n,"保存失败"));return n.json()}async function lO(t){const e=await Ll(`${Dl}/saves/${t}/load`,{method:"POST"},"读取存档失败");if(!e.ok)throw new Error(await Nl(e,"读取存档失败"));return e.json()}function cO(t,e,n,i,r,s,a){const o=new AbortController;return Ll(`${Dl}/chat/stream`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({game_id:t,message:e}),signal:o.signal},Lc).then(async l=>{if(!l.ok||!l.body)throw new Error(await Nl(l,Lc));const c=l.body.getReader(),u=new TextDecoder;let f="",d=!1;for(;;){const{done:p,value:v}=await c.read();if(p)break;f+=u.decode(v,{stream:!0});const y=f.split(`
`);f=y.pop()||"";for(const g of y)if(g.startsWith("data: "))try{const h=JSON.parse(g.slice(6));h.type==="narrative"?n(h.content):h.type==="system"?i(h.content):h.type==="state_update"?a==null||a(h.content):h.type==="state_snapshot"?a==null||a({type:"snapshot",state:h.content}):h.type==="done"?(d=!0,r()):h.type==="error"&&s(Vu(h.content,Lc))}catch{}}d||r()}).catch(l=>{o.signal.aborted||s(Vu(l==null?void 0:l.message,Lc))}),o}const uO={瑟琳:"se_trust",森洛:"sl_trust",莉亚瑟:"ly_trust",卡西亚:"kx_trust",克莱娅:"kl_trust",雷铎:"ld_trust"},dO={瑟琳:"se_hp",森洛:"sl_hp",莉亚瑟:"ly_hp",卡西亚:"kx_hp",克莱娅:"kl_hp",雷铎:"ld_hp"};function fO(t){const e=t.match(/^\[SYSTEM:(\w+):(\{.+\})\]$/);if(!e)return t.startsWith("[SYSTEM:")||t.startsWith("错误")?null:{type:"text",data:{msg:t}};try{return{type:e[1],data:JSON.parse(e[2])}}catch{return{type:"text",data:{msg:t}}}}function hO(t){var n,i,r;const e=t.data;switch(t.type){case"skill_check":return`${e.成功?"检定成功":"检定失败"} D20=${(n=e.掷骰)==null?void 0:n.replace("D20=","")} +${e.加值} = ${e.总计} / DC${e.DC}`;case"attack_roll":{const s=((r=(i=e.攻击掷骰)==null?void 0:i.match(/D20=(\d+)/))==null?void 0:r[1])||"?";return`${e.命中?"命中":"未命中"} D20=${s}${e.伤害?`，造成 ${e.伤害} 点伤害`:""} / AC${e.目标AC}`}case"roll_dice_tool":return`${e.骰子} = ${e.结果}`;case"death_save":return e.成功?"死亡豁免成功":"死亡豁免失败";case"error":return String(e.msg||"发生错误");default:return e.msg||JSON.stringify(e)}}function pO(t){if(t.type==="snapshot")return"";const e=Number(t.change||0),n=e>0?`+${e}`:String(e),i=t.reason?`：${t.reason}`:"";return t.type==="gold"?`金币 ${n}${i}`:t.type==="hp"?`HP ${n}${i}`:t.type==="inventory"?`${t.op==="add"?"获得":"失去"} ${t.item}`:t.type==="trust"?`${t.npc}信任 ${n}${i}`:t.type==="area"?`场景切换：${t.new}${i}`:t.type==="level_up"?`升级到 Lv.${t.new}${i}`:t.type==="npc_hp"?`${t.npc} HP ${n}${i}`:t.type==="attribute"?`${t.attr} ${n}${i}`:t.type==="xp"?`经验 ${n}${i}`:t.type==="complete_chapter"?t.reason||"章节完成":t.type==="trigger_event"?`剧情事件：${t.event_name}`:""}function mO(t,e){if(e.type==="snapshot")return{...e.state||t};const n={...t};if(e.type==="gold")n.gold=e.new;else if(e.type==="hp")n.current_hp=e.new,e.max&&(n.max_hp=e.max);else if(e.type==="inventory")n.inventory=e.inventory;else if(e.type==="trust"){const i=uO[e.npc];i&&(n[i]=e.new)}else if(e.type==="area")n.current_area=e.new;else if(e.type==="level_up")n.level=e.new,n.max_hp=e.max_hp,n.current_hp=e.max_hp;else if(e.type==="npc_hp"){const i=dO[e.npc];i&&(n[i]=e.new)}else e.type==="attribute"?n[e.attr]=e.new:e.type==="xp"?n.xp=e.new:e.type==="complete_chapter"?n.cleared_levels=e.new:e.type==="trigger_event"&&(n.triggered_events=e.events);return n}const gO={id:"dnd",name:"地心之门",createGame:sO,streamAction(t,e,n){return cO(t,e,n.onNarrative,n.onSystem,n.onDone,n.onError,n.onStateUpdate)},applyStateChange:mO,parseSystemEvent:fO,formatSystemEvent:hO,formatStateChange:pO},vO=/\[HINTS:([\s\S]*?)\]/g,e0=new Set(["。","！","？","!","?",`
`]),xO=10,vd={"瑟琳·逆钟":"瑟琳",瑟琳:"瑟琳",逆钟:"瑟琳","森洛·铁锅":"森洛",森洛:"森洛",铁锅:"森洛","莉亚瑟·青弦":"莉亚瑟",莉亚瑟:"莉亚瑟",青弦:"莉亚瑟","卡西亚·断羽":"卡西亚",卡西亚:"卡西亚",断羽:"卡西亚","克莱娅·软爪":"克莱娅",克莱娅:"克莱娅",软爪:"克莱娅","雷铎·炉心":"雷铎",雷铎:"雷铎",炉心:"雷铎","米蕾娜·白契":"米蕾娜",米蕾娜:"米蕾娜",白契:"米蕾娜","赫尔曼·断缆":"赫尔曼",赫尔曼:"赫尔曼",断缆:"赫尔曼","温妮娅·铜铃":"温妮娅",温妮娅:"温妮娅",铜铃:"温妮娅","莱因·铁脊":"莱因",莱因:"莱因",铁脊:"莱因","萨洛·杯底":"萨洛",萨洛:"萨洛","海伦特·灰杯":"海伦特",海伦特:"海伦特","奥布兰·晨爵":"奥布兰",奥布兰:"奥布兰","赛因·镜页":"赛因",赛因:"赛因",铁砧玛尔加:"玛尔加",玛尔加:"玛尔加",蓝伞尼布:"尼布",尼布:"尼布",烛账帕维:"帕维",帕维:"帕维",静默修女埃拉:"埃拉",埃拉:"埃拉"},Gu=Object.keys(vd).sort((t,e)=>e.length-t.length),_O=["说","说道","道","问","问道","喊","喊道","吼","吼道","答","答道","回答","回应","告诉","宣布","大叫","低语","喃喃","嘟囔","插嘴","补充","补充道","低声说","压低声音说"];function xd(t){return t.replace(/「/g,"“").replace(/」/g,"”").replace(/\*\*([^*]+)\*\*/g,"$1").replace(/\[SCENE:[^\]]*\]\n?/g,"").replace(/\r/g,"")}function oy(t){return t.replace(/[\s“”「」【】{}\[\]（）()，,。.!！?？；;：:、—\-…]/g,"").length}function jo(t){return oy(t)>0&&oy(t)<xO}function fs(...t){return t.map(e=>e.trim()).filter(Boolean).join("")}function yO(t){return xd(t).replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}function bo(t){return t.map(e=>e.trim()).filter(Boolean).slice(0,4).map((e,n)=>({id:`${n}-${e}`,label:e,text:e}))}function vl(t){const e=[],n=xd(t).replace(vO,(i,r)=>(r.split("|").forEach(s=>e.push(s)),""));return{text:yO(n),suggestions:bo(e)}}function WE(t){return t.replace(/^[\s，,：:]+/,"").replace(/[\s，,]+$/,e=>e.includes("，")||e.includes(",")?"，":"").replace(/^随后，?/,"随后，").trim()}function $E(t){const e=t.trim();return/^\[[^\[\]]+\]$/.test(e)&&!e.startsWith("[SYSTEM:")?e.slice(1,-1).trim():e}function Ra(t,e=!1){const n=t.replace(/[【】]/g,""),i=e?[...Gu].reverse():Gu;let r=e?-1:Number.POSITIVE_INFINITY,s="";for(const a of i){const o=e?n.lastIndexOf(a):n.indexOf(a);o<0||(e?o>=r:o<=r)&&(r=o,s=vd[a])}return s}function SO(t,e){const n=Ra(t,!0);if(n)return n;const i=MO(t);if(i)return i;const r=Ra(e.slice(0,80));return r||""}function MO(t){const e=t.trimEnd();for(const n of Gu){const i=vd[n];if(i){for(const r of["说","说道","道","问","问道","喊","喊道","插嘴","低语","叫","回答","宣布"])if(e.endsWith(`${n}${r}`)||e.endsWith(`${i}${r}`))return i;if(e.endsWith(`${n}：`)||e.endsWith(`${i}：`)||e.endsWith(`${n}:`)||e.endsWith(`${i}:`))return i}}return""}function EO(t,e){const n=t.slice(0,e);return Ra(n,!0)}function TO(t){const e=WE($E(t)).replace(/[【】\s：:，,。.!！?？；;]+$/g,"");if(!e)return!0;for(const n of Gu){const i=vd[n];if(i){if(e===n||e===i)return!0;for(const r of _O)if(e===`${n}${r}`||e===`${i}${r}`)return!0}}return!1}function ly(t,e,n){if(TO(e))return;const i=WE($E(e));i&&AO(i).forEach(r=>{t.push({speaker:n,text:r})})}function wO(t,e,n){const i=e.trim();i&&t.push({speaker:n,text:`“${i}”`})}function bO(t){const e=[...t];for(let n=0;n<=e.length-3;n+=1){const i=e[n],r=e[n+1],s=e[n+2],a=i.speaker!=="KP"&&r.speaker==="KP"&&s.speaker===i.speaker,o=jo(i.text)||jo(r.text);a&&o&&(e.splice(n,3,{speaker:i.speaker,text:fs(i.text,r.text,s.text)}),n=Math.max(-1,n-2))}for(let n=0;n<e.length;n+=1){const i=e[n];if(!i||!jo(i.text)||e.length<=1)continue;const r=e[n-1],s=e[n+1];if(r&&r.speaker===i.speaker){r.text=fs(r.text,i.text),e.splice(n,1),n=Math.max(-1,n-2);continue}if(s&&s.speaker===i.speaker){s.text=fs(i.text,s.text),e.splice(n,1),n=Math.max(-1,n-2);continue}if(s){s.text=fs(i.text,s.text),e.splice(n,1),n=Math.max(-1,n-2);continue}r&&(r.text=fs(r.text,i.text),e.splice(n,1),n=Math.max(-1,n-2))}return e}function AO(t){const e=[];let n=0;for(let r=0;r<t.length;r+=1){if(!e0.has(t[r]))continue;const s=t.slice(n,r+1).trim();s&&e.push(s),n=r+1}const i=t.slice(n).trim();return i&&e.push(i),XE(e)}function XE(t){const e=[...t];for(let n=0;n<e.length;n+=1){const i=e[n];if(!(!jo(i)||e.length<=1)){if(n<e.length-1){e[n+1]=fs(i,e[n+1]),e.splice(n,1),n=Math.max(-1,n-2);continue}e[n-1]=fs(e[n-1],i),e.splice(n,1),n=Math.max(-1,n-2)}}return e}function CO(t,e="KP",n=""){const{text:i}=vl(t),r=[];let s=n;if(!i)return{segments:r,lastSpeaker:s};const a=i.split(/\n+/).map(o=>o.trim()).filter(Boolean);for(const o of a){const l=/“([^”]*)”/g;let c=0,u=!1,f;for(;f=l.exec(o);){u=!0;const v=o.slice(c,f.index),y=o.slice(f.index+f[0].length),g=Ra(v);g&&(s=g),ly(r,v,e);let h=SO(v,y);h||(h=EO(o,f.index)),h||(h=s),h||(h=e),wO(r,f[1],h),h!==e&&(s=h),c=f.index+f[0].length}const d=o.slice(c),p=Ra(d);if(ly(r,d,e),p&&(s=p),!u){const v=Ra(o);v&&(s=v)}}return{segments:bO(r),lastSpeaker:s}}function RO(t){let e=!1,n=-1;for(let i=0;i<t.length;i+=1){const r=t[i];if(r==="“"){e=!0;continue}if(r==="”"){e=!1;continue}if(e0.has(r)){if(e){let s=i+1;for(;/\s/.test(t[s]||"");)s+=1;t[s]==="”"&&(n=s+1);continue}e||(n=i+1)}}return n}function Hu(t){const{text:e}=vl(t);if(!e)return[];const n=[];let i=0,r=!1;for(let o=0;o<e.length;o+=1){const l=e[o];if(l==="“"){r=!0;continue}if(l==="”"){r=!1;continue}if(!r&&e0.has(l)){const c=e.slice(i,o+1).trim();c&&n.push(c),i=o+1}}const s=e.slice(i).trim();s&&n.push(s);const a=[];for(const o of n)o.length<3&&a.length>0?a[a.length-1]+=o:a.push(o);return XE(a)}function cy(t){const e=xd(t),n=RO(e);if(n<0)return{complete:[],tail:e};let i=e.slice(0,n),r=e.slice(n);const s=Hu(i);if(s.length&&jo(s[s.length-1])){const a=s.pop()||"",o=i.lastIndexOf(a);o>=0&&(r=i.slice(o)+r,i=i.slice(0,o))}return{complete:Hu(i),tail:r}}function Ic(){let t="",e=[];function n(){const i=[];for(;t;){const r=t.indexOf("[HINTS:");if(r>=0){const a=t.indexOf("]",r),o=t.slice(0,r),l=cy(o);if(i.push(...l.complete),a<0){t=l.tail+t.slice(r);break}const c=t.slice(r,a+1);e=vl(c).suggestions,t=l.tail+t.slice(a+1);continue}const s=cy(t);i.push(...s.complete),t=s.tail;break}return{lines:i,suggestions:e}}return{push(i){return t+=xd(i),n()},flush(){const i=vl(t),r=Hu(i.text);return i.suggestions.length&&(e=i.suggestions),t="",{lines:r,suggestions:e}}}}const Yf="逆穹城倒挂在巨大洞穴的穹顶之上，蓝绿色荧光在远方深渊中明灭。你的冒险从这一刻开始。";function na(t){const e=String(t.current_area||"");return e.includes("公会")||e.includes("酒馆")?bo(["查看远征档案【调查DC12】","打听地底堡垒传闻【感知DC12】","让瑟琳分析时间异常【奥秘DC13】"]):e.includes("孢海")||e.includes("菌林")||e.includes("湿地")?bo(["谨慎探查周围【感知DC14】","让克莱娅检查陷阱【巧手DC15】","让森洛辨识真菌生态【自然DC13】"]):e.includes("黑石")||e.includes("黑暗之门")?bo(["分析黑石结构【奥秘DC15】","辨识三圈纹路【历史DC14】","让瑟琳感知时间异常"]):bo(["前往冒险者公会接取委托","在逆穹城探索打听情报","与瑟琳讨论远征计划"])}function PO(t){let e=1;return(Array.isArray(t)?t:[]).filter(n=>n&&typeof n.text=="string"&&n.text.trim()).map(n=>{const i=Number(n.id),r=Number.isFinite(i)&&i>0?i:e;return e=Math.max(e,r+1),{id:r,role:n.role==="player"||n.role==="system"?n.role:"kp",speaker:n.speaker||"KP",text:n.text}})}function DO(){const t=gO,[e,n]=z.useState("main-menu"),[i,r]=z.useState(""),[s,a]=z.useState(""),[o,l]=z.useState({}),[c,u]=z.useState([]),[f,d]=z.useState(0),[p,v]=z.useState("narrating"),[y,g]=z.useState(!1),[h,m]=z.useState([]),[_,M]=z.useState([]),[w,T]=z.useState(null),[R,S]=z.useState([]),[A,N]=z.useState(""),[D,I]=z.useState(!1),[X,G]=z.useState(!1),[U,H]=z.useState(!1),[B,F]=z.useState(""),[K,Y]=z.useState("neutral"),re=z.useRef(1),oe=z.useRef(1),xe=z.useRef(Ic()),Pe=z.useRef(null),Ae=z.useRef({}),Q=z.useRef(""),le=z.useRef([]),ue=z.useRef(!1);z.useEffect(()=>{Ae.current=o},[o]);const Ce=z.useCallback(()=>{le.current.forEach(Me=>window.clearTimeout(Me)),le.current=[]},[]);z.useEffect(()=>()=>{var Me;(Me=Pe.current)==null||Me.abort(),Ce()},[Ce]);const Oe=z.useCallback(Me=>{S(C=>[...C.filter(E=>E.slot_key!==Me.slot_key),Me])},[]),_e=z.useCallback(async()=>{try{const Me=await aO();S(Me.saves),F(""),Y("neutral")}catch(Me){F(Me.message||"获取存档失败"),Y("error")}},[]);z.useEffect(()=>{_e()},[_e]);const Je=z.useCallback((Me,C,E,k=!1)=>{const j=Me.map(Z=>Z.trim()).filter(Boolean);if(!j.length)return;const te=j.flatMap(Z=>{if(C!=="kp")return[{id:re.current++,role:C,speaker:E,text:Z}];const ie=CO(Z,E||"KP",Q.current);return Q.current=ie.lastSpeaker,ie.segments.map(J=>({id:re.current++,role:"kp",speaker:J.speaker,text:J.text}))});u(Z=>((k||Z.length===0)&&d(Z.length),[...Z,...te]))},[]),Ne=z.useCallback((Me,C)=>{const E=Me.trim();if(!E)return;const k=oe.current++;M(te=>[...te,{id:k,text:E,tone:C}].slice(-8));const j=window.setTimeout(()=>{M(te=>te.filter(Z=>Z.id!==k)),le.current=le.current.filter(te=>te!==j)},5e3);le.current.push(j)},[]),Qe=z.useCallback(async Me=>{if(!(!s||y||A)){N(Me),F(""),Y("neutral");try{const C=`${o.player_name||"冒险者"} · ${o.current_area||"未知区域"}`,E=await oO(s,{slot_key:Me,title:C,story:c,suggestions:h.length?h:na(o),active_index:f,phase:p});Oe(E.save),F(`已写入：${E.save.title}`),Y("success"),Ne("存档已写入","state")}catch(C){const E=C.message||"保存失败";F(E),Y("error"),Ne(E,"error")}finally{N("")}}},[f,Ne,s,o,p,A,c,y,h,Oe]),tt=z.useCallback(async Me=>{var C;if(!(y||A)){N(Me),F(""),Y("neutral");try{(C=Pe.current)==null||C.abort(),xe.current=Ic();const E=await lO(Me),k=PO(E.story),j=k.reduce((te,Z)=>Math.max(te,Z.id),0);re.current=j+1,oe.current=1,Q.current="",a(E.game_id),l(E.state),u(k),d(k.length?Math.min(Math.max(E.active_index,0),k.length-1):0),v(E.phase==="narrating"?"narrating":"action"),g(!1),m(E.suggestions.length?E.suggestions:na(E.state)),Ce(),M([]),n("game"),Oe(E.save),F(`已读取：${E.save.title}`),Y("success"),Ne("读档完成","state")}catch(E){const k=E.message||"读取存档失败";F(k),Y("error"),e==="game"&&Ne(k,"error")}finally{N("")}}},[Ne,Ce,A,e,y,Oe]),Ve=z.useCallback(async Me=>{n("loading"),r(""),u([]),Ce(),M([]),m([]),d(0),v("narrating"),F(""),Y("neutral"),re.current=1,oe.current=1,Q.current="";try{const C=await t.createGame(Me),E=vl(C.opening||Yf),k=Hu(E.text||Yf);a(C.game_id),l(C.state),m(E.suggestions.length?E.suggestions:na(C.state)),Je(k.length?k:[Yf],"kp","KP",!0),n("game")}catch(C){r(C.message||"连接失败")}},[Je,Ce,t]),vt=z.useCallback(Me=>{var E;const C=Me.trim();!C||!s||y||((E=Pe.current)==null||E.abort(),xe.current=Ic(),ue.current=!1,v("narrating"),g(!0),m([]),Je([C],"player",o.player_name||"你",!0),Pe.current=t.streamAction(s,C,{onNarrative:k=>{const j=xe.current.push(k);j.lines.length&&Je(j.lines,"kp","KP"),j.suggestions.length&&m(j.suggestions)},onSystem:k=>{const j=t.parseSystemEvent(k);j&&(Ne(t.formatSystemEvent(j),j.type==="error"?"error":"dice"),!ue.current&&(j.type==="skill_check"||j.type==="attack_roll")&&(ue.current=!0,T(j)))},onStateUpdate:k=>{l(j=>t.applyStateChange(j,k)),Ne(t.formatStateChange(k),"state")},onDone:()=>{const k=xe.current.flush();k.lines.length&&Je(k.lines,"kp","KP"),m(k.suggestions.length?k.suggestions:na(Ae.current)),g(!1)},onError:k=>{const j=String(k||"").trim(),te=/connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|timeout|timed\s*out|econn|socket/i.test(j)?"KP暂时没有回应，已为本轮处理启用兜底。":j||"KP暂时没有回应，已为本轮处理启用兜底。";g(!1),Ne(te,"state"),Je([te],"system","系统"),m(na(Ae.current))}}))},[Ne,Je,s,o.player_name,t,y]),ot=z.useMemo(()=>iO(o),[o]),Nt=c[f],P=!!Nt&&(f<c.length-1||!y),Ie=h.length?h:na(o),Re=z.useCallback(()=>{if(f<c.length-1){d(Me=>Math.min(Me+1,c.length-1));return}y||v("action")},[f,c.length,y]),ze=z.useCallback(()=>{F(""),Y("neutral"),_e(),n("load-game")},[_e]),ae=z.useCallback(()=>{var Me;(Me=Pe.current)==null||Me.abort(),Pe.current=null,xe.current=Ic(),Ce(),g(!1),I(!1),G(!1),H(!1),T(null),M([]),F(""),Y("neutral"),n("main-menu")},[Ce]);return e==="main-menu"?x.jsx(QF,{onNewGame:()=>n("new-game"),onLoadGame:ze,onTest:()=>n("test")}):e==="new-game"?x.jsx(dF,{onStart:Ve,onBack:()=>n("main-menu")}):e==="load-game"?x.jsx(lF,{saves:R,saveBusySlot:A,saveMessage:B,saveMessageTone:K,onBack:()=>n("main-menu"),onRefreshSaves:_e,onLoadSave:tt}):e==="test"?x.jsx(ZF,{onBack:()=>n("main-menu")}):e==="loading"?x.jsx(cF,{error:i,onRetry:()=>n("new-game")}):x.jsxs(ut.div,{initial:{opacity:0},animate:{opacity:1},className:"vn-app",children:[x.jsx(nO,{scene:ot,line:Nt,events:_,isStreaming:y,isActionPhase:p==="action",canAdvance:p!=="action"&&P,onAdvance:Re,actionPanel:p==="action"?x.jsx(n2,{suggestions:Ie,disabled:y,onSubmit:vt}):void 0}),x.jsx(Yg,{dice:w,dieType:"d20",onClose:()=>T(null)}),x.jsx("button",{type:"button",className:"game-character-btn","aria-haspopup":"dialog","aria-expanded":X,onClick:()=>G(!0),children:"角色信息"}),x.jsxs("div",{className:"game-top-actions",children:[x.jsx("button",{type:"button",className:"game-title-btn",onClick:()=>H(!0),children:"回到标题界面"}),x.jsx("button",{type:"button",className:"game-save-btn",onClick:()=>I(!0),children:"📂 冒险存档"})]}),x.jsx(Br,{children:U&&x.jsx(ut.div,{className:"return-title-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>H(!1),children:x.jsxs(ut.section,{className:"return-title-modal",role:"dialog","aria-modal":"true","aria-label":"返回标题界面确认",initial:{opacity:0,scale:.94,y:12},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.94,y:12},onClick:Me=>Me.stopPropagation(),children:[x.jsxs("div",{className:"return-title-copy",children:[x.jsx("span",{children:"返回标题界面"}),x.jsx("p",{children:"请先确认当前冒险进度已经存档。未保存的剧情和状态不会自动保存。"})]}),x.jsxs("div",{className:"return-title-actions",children:[x.jsx("button",{type:"button",className:"return-title-cancel",onClick:()=>H(!1),children:"取消"}),x.jsx("button",{type:"button",className:"return-title-confirm",onClick:ae,children:"确定"})]})]})})}),x.jsx(Br,{children:X&&x.jsx(ut.div,{className:"character-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>G(!1),children:x.jsxs(ut.section,{className:"character-modal",role:"dialog","aria-modal":"true","aria-label":"角色信息",initial:{opacity:0,scale:.94,y:12},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.94,y:12},onClick:Me=>Me.stopPropagation(),children:[x.jsxs("div",{className:"character-modal-header",children:[x.jsxs("div",{children:[x.jsx("span",{children:"角色信息"}),x.jsxs("small",{children:[o.player_name||"冒险者"," · ",o.char_class||"战士"]})]}),x.jsx("button",{type:"button","aria-label":"关闭角色信息",onClick:()=>G(!1),children:"×"})]}),x.jsx(a2,{state:o})]})})}),x.jsx(Br,{children:D&&x.jsx(ut.div,{className:"save-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>I(!1),children:x.jsxs(ut.div,{className:"save-modal",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},onClick:Me=>Me.stopPropagation(),children:[x.jsxs("div",{className:"save-modal-header",children:[x.jsx("span",{children:"冒险存档"}),x.jsx("button",{type:"button",onClick:()=>I(!1),children:"✕"})]}),x.jsx(Kg,{title:"冒险存档",saves:R,busySlot:A,disabled:y,message:B,messageTone:K,onRefresh:_e,onSave:Me=>{Qe(Me),I(!1)},onLoad:tt})]})})})]})}Kf.createRoot(document.getElementById("root")).render(x.jsx(xT.StrictMode,{children:x.jsx(DO,{})}));
