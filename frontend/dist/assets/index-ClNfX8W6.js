(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();function OE(t){return t&&t.__esModule&&Object.prototype.hasOwnProperty.call(t,"default")?t.default:t}var Q_={exports:{}},Ou={},J_={exports:{}},Ze={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cl=Symbol.for("react.element"),kE=Symbol.for("react.portal"),BE=Symbol.for("react.fragment"),zE=Symbol.for("react.strict_mode"),VE=Symbol.for("react.profiler"),GE=Symbol.for("react.provider"),HE=Symbol.for("react.context"),jE=Symbol.for("react.forward_ref"),WE=Symbol.for("react.suspense"),XE=Symbol.for("react.memo"),$E=Symbol.for("react.lazy"),o0=Symbol.iterator;function YE(t){return t===null||typeof t!="object"?null:(t=o0&&t[o0]||t["@@iterator"],typeof t=="function"?t:null)}var ey={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},ty=Object.assign,ny={};function Bo(t,e,n){this.props=t,this.context=e,this.refs=ny,this.updater=n||ey}Bo.prototype.isReactComponent={};Bo.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Bo.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function iy(){}iy.prototype=Bo.prototype;function jp(t,e,n){this.props=t,this.context=e,this.refs=ny,this.updater=n||ey}var Wp=jp.prototype=new iy;Wp.constructor=jp;ty(Wp,Bo.prototype);Wp.isPureReactComponent=!0;var a0=Array.isArray,ry=Object.prototype.hasOwnProperty,Xp={current:null},sy={key:!0,ref:!0,__self:!0,__source:!0};function oy(t,e,n){var i,r={},s=null,o=null;if(e!=null)for(i in e.ref!==void 0&&(o=e.ref),e.key!==void 0&&(s=""+e.key),e)ry.call(e,i)&&!sy.hasOwnProperty(i)&&(r[i]=e[i]);var a=arguments.length-2;if(a===1)r.children=n;else if(1<a){for(var l=Array(a),c=0;c<a;c++)l[c]=arguments[c+2];r.children=l}if(t&&t.defaultProps)for(i in a=t.defaultProps,a)r[i]===void 0&&(r[i]=a[i]);return{$$typeof:cl,type:t,key:s,ref:o,props:r,_owner:Xp.current}}function KE(t,e){return{$$typeof:cl,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function $p(t){return typeof t=="object"&&t!==null&&t.$$typeof===cl}function qE(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var l0=/\/+/g;function fd(t,e){return typeof t=="object"&&t!==null&&t.key!=null?qE(""+t.key):e.toString(36)}function bc(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var o=!1;if(t===null)o=!0;else switch(s){case"string":case"number":o=!0;break;case"object":switch(t.$$typeof){case cl:case kE:o=!0}}if(o)return o=t,r=r(o),t=i===""?"."+fd(o,0):i,a0(r)?(n="",t!=null&&(n=t.replace(l0,"$&/")+"/"),bc(r,e,n,"",function(c){return c})):r!=null&&($p(r)&&(r=KE(r,n+(!r.key||o&&o.key===r.key?"":(""+r.key).replace(l0,"$&/")+"/")+t)),e.push(r)),1;if(o=0,i=i===""?".":i+":",a0(t))for(var a=0;a<t.length;a++){s=t[a];var l=i+fd(s,a);o+=bc(s,e,n,l,r)}else if(l=YE(t),typeof l=="function")for(t=l.call(t),a=0;!(s=t.next()).done;)s=s.value,l=i+fd(s,a++),o+=bc(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return o}function bl(t,e,n){if(t==null)return t;var i=[],r=0;return bc(t,i,"","",function(s){return e.call(n,s,r++)}),i}function ZE(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var _n={current:null},Ac={transition:null},QE={ReactCurrentDispatcher:_n,ReactCurrentBatchConfig:Ac,ReactCurrentOwner:Xp};function ay(){throw Error("act(...) is not supported in production builds of React.")}Ze.Children={map:bl,forEach:function(t,e,n){bl(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return bl(t,function(){e++}),e},toArray:function(t){return bl(t,function(e){return e})||[]},only:function(t){if(!$p(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ze.Component=Bo;Ze.Fragment=BE;Ze.Profiler=VE;Ze.PureComponent=jp;Ze.StrictMode=zE;Ze.Suspense=WE;Ze.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=QE;Ze.act=ay;Ze.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=ty({},t.props),r=t.key,s=t.ref,o=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,o=Xp.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var a=t.type.defaultProps;for(l in e)ry.call(e,l)&&!sy.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&a!==void 0?a[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){a=Array(l);for(var c=0;c<l;c++)a[c]=arguments[c+2];i.children=a}return{$$typeof:cl,type:t.type,key:r,ref:s,props:i,_owner:o}};Ze.createContext=function(t){return t={$$typeof:HE,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:GE,_context:t},t.Consumer=t};Ze.createElement=oy;Ze.createFactory=function(t){var e=oy.bind(null,t);return e.type=t,e};Ze.createRef=function(){return{current:null}};Ze.forwardRef=function(t){return{$$typeof:jE,render:t}};Ze.isValidElement=$p;Ze.lazy=function(t){return{$$typeof:$E,_payload:{_status:-1,_result:t},_init:ZE}};Ze.memo=function(t,e){return{$$typeof:XE,type:t,compare:e===void 0?null:e}};Ze.startTransition=function(t){var e=Ac.transition;Ac.transition={};try{t()}finally{Ac.transition=e}};Ze.unstable_act=ay;Ze.useCallback=function(t,e){return _n.current.useCallback(t,e)};Ze.useContext=function(t){return _n.current.useContext(t)};Ze.useDebugValue=function(){};Ze.useDeferredValue=function(t){return _n.current.useDeferredValue(t)};Ze.useEffect=function(t,e){return _n.current.useEffect(t,e)};Ze.useId=function(){return _n.current.useId()};Ze.useImperativeHandle=function(t,e,n){return _n.current.useImperativeHandle(t,e,n)};Ze.useInsertionEffect=function(t,e){return _n.current.useInsertionEffect(t,e)};Ze.useLayoutEffect=function(t,e){return _n.current.useLayoutEffect(t,e)};Ze.useMemo=function(t,e){return _n.current.useMemo(t,e)};Ze.useReducer=function(t,e,n){return _n.current.useReducer(t,e,n)};Ze.useRef=function(t){return _n.current.useRef(t)};Ze.useState=function(t){return _n.current.useState(t)};Ze.useSyncExternalStore=function(t,e,n){return _n.current.useSyncExternalStore(t,e,n)};Ze.useTransition=function(){return _n.current.useTransition()};Ze.version="18.3.1";J_.exports=Ze;var G=J_.exports;const JE=OE(G);/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var eT=G,tT=Symbol.for("react.element"),nT=Symbol.for("react.fragment"),iT=Object.prototype.hasOwnProperty,rT=eT.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,sT={key:!0,ref:!0,__self:!0,__source:!0};function ly(t,e,n){var i,r={},s=null,o=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(o=e.ref);for(i in e)iT.call(e,i)&&!sT.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:tT,type:t,key:s,ref:o,props:r,_owner:rT.current}}Ou.Fragment=nT;Ou.jsx=ly;Ou.jsxs=ly;Q_.exports=Ou;var x=Q_.exports,zf={},cy={exports:{}},Bn={},uy={exports:{}},dy={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(I,$){var K=I.length;I.push($);e:for(;0<K;){var ie=K-1>>>1,fe=I[ie];if(0<r(fe,$))I[ie]=$,I[K]=fe,K=ie;else break e}}function n(I){return I.length===0?null:I[0]}function i(I){if(I.length===0)return null;var $=I[0],K=I.pop();if(K!==$){I[0]=K;e:for(var ie=0,fe=I.length,Fe=fe>>>1;ie<Fe;){var Be=2*(ie+1)-1,Le=I[Be],Q=Be+1,le=I[Q];if(0>r(Le,K))Q<fe&&0>r(le,Le)?(I[ie]=le,I[Q]=K,ie=Q):(I[ie]=Le,I[Be]=K,ie=Be);else if(Q<fe&&0>r(le,K))I[ie]=le,I[Q]=K,ie=Q;else break e}}return $}function r(I,$){var K=I.sortIndex-$.sortIndex;return K!==0?K:I.id-$.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var o=Date,a=o.now();t.unstable_now=function(){return o.now()-a}}var l=[],c=[],u=1,f=null,d=3,p=!1,v=!1,S=!1,g=typeof setTimeout=="function"?setTimeout:null,h=typeof clearTimeout=="function"?clearTimeout:null,m=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function _(I){for(var $=n(c);$!==null;){if($.callback===null)i(c);else if($.startTime<=I)i(c),$.sortIndex=$.expirationTime,e(l,$);else break;$=n(c)}}function M(I){if(S=!1,_(I),!v)if(n(l)!==null)v=!0,j(w);else{var $=n(c);$!==null&&B(M,$.startTime-I)}}function w(I,$){v=!1,S&&(S=!1,h(y),y=-1),p=!0;var K=d;try{for(_($),f=n(l);f!==null&&(!(f.expirationTime>$)||I&&!P());){var ie=f.callback;if(typeof ie=="function"){f.callback=null,d=f.priorityLevel;var fe=ie(f.expirationTime<=$);$=t.unstable_now(),typeof fe=="function"?f.callback=fe:f===n(l)&&i(l),_($)}else i(l);f=n(l)}if(f!==null)var Fe=!0;else{var Be=n(c);Be!==null&&B(M,Be.startTime-$),Fe=!1}return Fe}finally{f=null,d=K,p=!1}}var T=!1,R=null,y=-1,C=5,D=-1;function P(){return!(t.unstable_now()-D<C)}function N(){if(R!==null){var I=t.unstable_now();D=I;var $=!0;try{$=R(!0,I)}finally{$?H():(T=!1,R=null)}}else T=!1}var H;if(typeof m=="function")H=function(){m(N)};else if(typeof MessageChannel<"u"){var V=new MessageChannel,F=V.port2;V.port1.onmessage=N,H=function(){F.postMessage(null)}}else H=function(){g(N,0)};function j(I){R=I,T||(T=!0,H())}function B(I,$){y=g(function(){I(t.unstable_now())},$)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(I){I.callback=null},t.unstable_continueExecution=function(){v||p||(v=!0,j(w))},t.unstable_forceFrameRate=function(I){0>I||125<I?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):C=0<I?Math.floor(1e3/I):5},t.unstable_getCurrentPriorityLevel=function(){return d},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(I){switch(d){case 1:case 2:case 3:var $=3;break;default:$=d}var K=d;d=$;try{return I()}finally{d=K}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(I,$){switch(I){case 1:case 2:case 3:case 4:case 5:break;default:I=3}var K=d;d=I;try{return $()}finally{d=K}},t.unstable_scheduleCallback=function(I,$,K){var ie=t.unstable_now();switch(typeof K=="object"&&K!==null?(K=K.delay,K=typeof K=="number"&&0<K?ie+K:ie):K=ie,I){case 1:var fe=-1;break;case 2:fe=250;break;case 5:fe=1073741823;break;case 4:fe=1e4;break;default:fe=5e3}return fe=K+fe,I={id:u++,callback:$,priorityLevel:I,startTime:K,expirationTime:fe,sortIndex:-1},K>ie?(I.sortIndex=K,e(c,I),n(l)===null&&I===n(c)&&(S?(h(y),y=-1):S=!0,B(M,K-ie))):(I.sortIndex=fe,e(l,I),v||p||(v=!0,j(w))),I},t.unstable_shouldYield=P,t.unstable_wrapCallback=function(I){var $=d;return function(){var K=d;d=$;try{return I.apply(this,arguments)}finally{d=K}}}})(dy);uy.exports=dy;var oT=uy.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var aT=G,On=oT;function oe(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var fy=new Set,Fa={};function As(t,e){wo(t,e),wo(t+"Capture",e)}function wo(t,e){for(Fa[t]=e,t=0;t<e.length;t++)fy.add(e[t])}var Ji=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Vf=Object.prototype.hasOwnProperty,lT=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,c0={},u0={};function cT(t){return Vf.call(u0,t)?!0:Vf.call(c0,t)?!1:lT.test(t)?u0[t]=!0:(c0[t]=!0,!1)}function uT(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function dT(t,e,n,i){if(e===null||typeof e>"u"||uT(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function yn(t,e,n,i,r,s,o){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=o}var tn={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){tn[t]=new yn(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];tn[e]=new yn(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){tn[t]=new yn(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){tn[t]=new yn(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){tn[t]=new yn(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){tn[t]=new yn(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){tn[t]=new yn(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){tn[t]=new yn(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){tn[t]=new yn(t,5,!1,t.toLowerCase(),null,!1,!1)});var Yp=/[\-:]([a-z])/g;function Kp(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(Yp,Kp);tn[e]=new yn(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(Yp,Kp);tn[e]=new yn(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(Yp,Kp);tn[e]=new yn(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){tn[t]=new yn(t,1,!1,t.toLowerCase(),null,!1,!1)});tn.xlinkHref=new yn("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){tn[t]=new yn(t,1,!1,t.toLowerCase(),null,!0,!0)});function qp(t,e,n,i){var r=tn.hasOwnProperty(e)?tn[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(dT(e,n,r,i)&&(n=null),i||r===null?cT(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var or=aT.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,Al=Symbol.for("react.element"),Qs=Symbol.for("react.portal"),Js=Symbol.for("react.fragment"),Zp=Symbol.for("react.strict_mode"),Gf=Symbol.for("react.profiler"),hy=Symbol.for("react.provider"),py=Symbol.for("react.context"),Qp=Symbol.for("react.forward_ref"),Hf=Symbol.for("react.suspense"),jf=Symbol.for("react.suspense_list"),Jp=Symbol.for("react.memo"),xr=Symbol.for("react.lazy"),my=Symbol.for("react.offscreen"),d0=Symbol.iterator;function $o(t){return t===null||typeof t!="object"?null:(t=d0&&t[d0]||t["@@iterator"],typeof t=="function"?t:null)}var Ct=Object.assign,hd;function ca(t){if(hd===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);hd=e&&e[1]||""}return`
`+hd+t}var pd=!1;function md(t,e){if(!t||pd)return"";pd=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(c){var i=c}Reflect.construct(t,[],e)}else{try{e.call()}catch(c){i=c}t.call(e.prototype)}else{try{throw Error()}catch(c){i=c}t()}}catch(c){if(c&&i&&typeof c.stack=="string"){for(var r=c.stack.split(`
`),s=i.stack.split(`
`),o=r.length-1,a=s.length-1;1<=o&&0<=a&&r[o]!==s[a];)a--;for(;1<=o&&0<=a;o--,a--)if(r[o]!==s[a]){if(o!==1||a!==1)do if(o--,a--,0>a||r[o]!==s[a]){var l=`
`+r[o].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=o&&0<=a);break}}}finally{pd=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ca(t):""}function fT(t){switch(t.tag){case 5:return ca(t.type);case 16:return ca("Lazy");case 13:return ca("Suspense");case 19:return ca("SuspenseList");case 0:case 2:case 15:return t=md(t.type,!1),t;case 11:return t=md(t.type.render,!1),t;case 1:return t=md(t.type,!0),t;default:return""}}function Wf(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case Js:return"Fragment";case Qs:return"Portal";case Gf:return"Profiler";case Zp:return"StrictMode";case Hf:return"Suspense";case jf:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case py:return(t.displayName||"Context")+".Consumer";case hy:return(t._context.displayName||"Context")+".Provider";case Qp:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case Jp:return e=t.displayName||null,e!==null?e:Wf(t.type)||"Memo";case xr:e=t._payload,t=t._init;try{return Wf(t(e))}catch{}}return null}function hT(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Wf(e);case 8:return e===Zp?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function Fr(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function gy(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function pT(t){var e=gy(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(o){i=""+o,s.call(this,o)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(o){i=""+o},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function Cl(t){t._valueTracker||(t._valueTracker=pT(t))}function vy(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=gy(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function Kc(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Xf(t,e){var n=e.checked;return Ct({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function f0(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=Fr(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function xy(t,e){e=e.checked,e!=null&&qp(t,"checked",e,!1)}function $f(t,e){xy(t,e);var n=Fr(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Yf(t,e.type,n):e.hasOwnProperty("defaultValue")&&Yf(t,e.type,Fr(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function h0(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Yf(t,e,n){(e!=="number"||Kc(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var ua=Array.isArray;function go(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+Fr(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Kf(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(oe(91));return Ct({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function p0(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(oe(92));if(ua(n)){if(1<n.length)throw Error(oe(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:Fr(n)}}function _y(t,e){var n=Fr(e.value),i=Fr(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function m0(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function yy(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function qf(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?yy(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var Rl,Sy=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(Rl=Rl||document.createElement("div"),Rl.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=Rl.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Oa(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var _a={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},mT=["Webkit","ms","Moz","O"];Object.keys(_a).forEach(function(t){mT.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),_a[e]=_a[t]})});function My(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||_a.hasOwnProperty(t)&&_a[t]?(""+e).trim():e+"px"}function Ey(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=My(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var gT=Ct({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Zf(t,e){if(e){if(gT[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(oe(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(oe(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(oe(61))}if(e.style!=null&&typeof e.style!="object")throw Error(oe(62))}}function Qf(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Jf=null;function em(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var eh=null,vo=null,xo=null;function g0(t){if(t=fl(t)){if(typeof eh!="function")throw Error(oe(280));var e=t.stateNode;e&&(e=Gu(e),eh(t.stateNode,t.type,e))}}function Ty(t){vo?xo?xo.push(t):xo=[t]:vo=t}function wy(){if(vo){var t=vo,e=xo;if(xo=vo=null,g0(t),e)for(t=0;t<e.length;t++)g0(e[t])}}function by(t,e){return t(e)}function Ay(){}var gd=!1;function Cy(t,e,n){if(gd)return t(e,n);gd=!0;try{return by(t,e,n)}finally{gd=!1,(vo!==null||xo!==null)&&(Ay(),wy())}}function ka(t,e){var n=t.stateNode;if(n===null)return null;var i=Gu(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(oe(231,e,typeof n));return n}var th=!1;if(Ji)try{var Yo={};Object.defineProperty(Yo,"passive",{get:function(){th=!0}}),window.addEventListener("test",Yo,Yo),window.removeEventListener("test",Yo,Yo)}catch{th=!1}function vT(t,e,n,i,r,s,o,a,l){var c=Array.prototype.slice.call(arguments,3);try{e.apply(n,c)}catch(u){this.onError(u)}}var ya=!1,qc=null,Zc=!1,nh=null,xT={onError:function(t){ya=!0,qc=t}};function _T(t,e,n,i,r,s,o,a,l){ya=!1,qc=null,vT.apply(xT,arguments)}function yT(t,e,n,i,r,s,o,a,l){if(_T.apply(this,arguments),ya){if(ya){var c=qc;ya=!1,qc=null}else throw Error(oe(198));Zc||(Zc=!0,nh=c)}}function Cs(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function Ry(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function v0(t){if(Cs(t)!==t)throw Error(oe(188))}function ST(t){var e=t.alternate;if(!e){if(e=Cs(t),e===null)throw Error(oe(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return v0(r),t;if(s===i)return v0(r),e;s=s.sibling}throw Error(oe(188))}if(n.return!==i.return)n=r,i=s;else{for(var o=!1,a=r.child;a;){if(a===n){o=!0,n=r,i=s;break}if(a===i){o=!0,i=r,n=s;break}a=a.sibling}if(!o){for(a=s.child;a;){if(a===n){o=!0,n=s,i=r;break}if(a===i){o=!0,i=s,n=r;break}a=a.sibling}if(!o)throw Error(oe(189))}}if(n.alternate!==i)throw Error(oe(190))}if(n.tag!==3)throw Error(oe(188));return n.stateNode.current===n?t:e}function Py(t){return t=ST(t),t!==null?Dy(t):null}function Dy(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Dy(t);if(e!==null)return e;t=t.sibling}return null}var Ny=On.unstable_scheduleCallback,x0=On.unstable_cancelCallback,MT=On.unstable_shouldYield,ET=On.unstable_requestPaint,Ot=On.unstable_now,TT=On.unstable_getCurrentPriorityLevel,tm=On.unstable_ImmediatePriority,Ly=On.unstable_UserBlockingPriority,Qc=On.unstable_NormalPriority,wT=On.unstable_LowPriority,Iy=On.unstable_IdlePriority,ku=null,Ri=null;function bT(t){if(Ri&&typeof Ri.onCommitFiberRoot=="function")try{Ri.onCommitFiberRoot(ku,t,void 0,(t.current.flags&128)===128)}catch{}}var di=Math.clz32?Math.clz32:RT,AT=Math.log,CT=Math.LN2;function RT(t){return t>>>=0,t===0?32:31-(AT(t)/CT|0)|0}var Pl=64,Dl=4194304;function da(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function Jc(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,o=n&268435455;if(o!==0){var a=o&~r;a!==0?i=da(a):(s&=o,s!==0&&(i=da(s)))}else o=n&~r,o!==0?i=da(o):s!==0&&(i=da(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-di(e),r=1<<n,i|=t[n],e&=~r;return i}function PT(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function DT(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var o=31-di(s),a=1<<o,l=r[o];l===-1?(!(a&n)||a&i)&&(r[o]=PT(a,e)):l<=e&&(t.expiredLanes|=a),s&=~a}}function ih(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Uy(){var t=Pl;return Pl<<=1,!(Pl&4194240)&&(Pl=64),t}function vd(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function ul(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-di(e),t[e]=n}function NT(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-di(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function nm(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-di(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var dt=0;function Fy(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Oy,im,ky,By,zy,rh=!1,Nl=[],Ar=null,Cr=null,Rr=null,Ba=new Map,za=new Map,yr=[],LT="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function _0(t,e){switch(t){case"focusin":case"focusout":Ar=null;break;case"dragenter":case"dragleave":Cr=null;break;case"mouseover":case"mouseout":Rr=null;break;case"pointerover":case"pointerout":Ba.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":za.delete(e.pointerId)}}function Ko(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=fl(e),e!==null&&im(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function IT(t,e,n,i,r){switch(e){case"focusin":return Ar=Ko(Ar,t,e,n,i,r),!0;case"dragenter":return Cr=Ko(Cr,t,e,n,i,r),!0;case"mouseover":return Rr=Ko(Rr,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ba.set(s,Ko(Ba.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,za.set(s,Ko(za.get(s)||null,t,e,n,i,r)),!0}return!1}function Vy(t){var e=cs(t.target);if(e!==null){var n=Cs(e);if(n!==null){if(e=n.tag,e===13){if(e=Ry(n),e!==null){t.blockedOn=e,zy(t.priority,function(){ky(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Cc(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=sh(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Jf=i,n.target.dispatchEvent(i),Jf=null}else return e=fl(n),e!==null&&im(e),t.blockedOn=n,!1;e.shift()}return!0}function y0(t,e,n){Cc(t)&&n.delete(e)}function UT(){rh=!1,Ar!==null&&Cc(Ar)&&(Ar=null),Cr!==null&&Cc(Cr)&&(Cr=null),Rr!==null&&Cc(Rr)&&(Rr=null),Ba.forEach(y0),za.forEach(y0)}function qo(t,e){t.blockedOn===e&&(t.blockedOn=null,rh||(rh=!0,On.unstable_scheduleCallback(On.unstable_NormalPriority,UT)))}function Va(t){function e(r){return qo(r,t)}if(0<Nl.length){qo(Nl[0],t);for(var n=1;n<Nl.length;n++){var i=Nl[n];i.blockedOn===t&&(i.blockedOn=null)}}for(Ar!==null&&qo(Ar,t),Cr!==null&&qo(Cr,t),Rr!==null&&qo(Rr,t),Ba.forEach(e),za.forEach(e),n=0;n<yr.length;n++)i=yr[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<yr.length&&(n=yr[0],n.blockedOn===null);)Vy(n),n.blockedOn===null&&yr.shift()}var _o=or.ReactCurrentBatchConfig,eu=!0;function FT(t,e,n,i){var r=dt,s=_o.transition;_o.transition=null;try{dt=1,rm(t,e,n,i)}finally{dt=r,_o.transition=s}}function OT(t,e,n,i){var r=dt,s=_o.transition;_o.transition=null;try{dt=4,rm(t,e,n,i)}finally{dt=r,_o.transition=s}}function rm(t,e,n,i){if(eu){var r=sh(t,e,n,i);if(r===null)Ad(t,e,i,tu,n),_0(t,i);else if(IT(r,t,e,n,i))i.stopPropagation();else if(_0(t,i),e&4&&-1<LT.indexOf(t)){for(;r!==null;){var s=fl(r);if(s!==null&&Oy(s),s=sh(t,e,n,i),s===null&&Ad(t,e,i,tu,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Ad(t,e,i,null,n)}}var tu=null;function sh(t,e,n,i){if(tu=null,t=em(i),t=cs(t),t!==null)if(e=Cs(t),e===null)t=null;else if(n=e.tag,n===13){if(t=Ry(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return tu=t,null}function Gy(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(TT()){case tm:return 1;case Ly:return 4;case Qc:case wT:return 16;case Iy:return 536870912;default:return 16}default:return 16}}var Er=null,sm=null,Rc=null;function Hy(){if(Rc)return Rc;var t,e=sm,n=e.length,i,r="value"in Er?Er.value:Er.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var o=n-t;for(i=1;i<=o&&e[n-i]===r[s-i];i++);return Rc=r.slice(t,1<i?1-i:void 0)}function Pc(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function Ll(){return!0}function S0(){return!1}function zn(t){function e(n,i,r,s,o){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=o,this.currentTarget=null;for(var a in t)t.hasOwnProperty(a)&&(n=t[a],this[a]=n?n(s):s[a]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?Ll:S0,this.isPropagationStopped=S0,this}return Ct(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=Ll)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=Ll)},persist:function(){},isPersistent:Ll}),e}var zo={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},om=zn(zo),dl=Ct({},zo,{view:0,detail:0}),kT=zn(dl),xd,_d,Zo,Bu=Ct({},dl,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:am,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Zo&&(Zo&&t.type==="mousemove"?(xd=t.screenX-Zo.screenX,_d=t.screenY-Zo.screenY):_d=xd=0,Zo=t),xd)},movementY:function(t){return"movementY"in t?t.movementY:_d}}),M0=zn(Bu),BT=Ct({},Bu,{dataTransfer:0}),zT=zn(BT),VT=Ct({},dl,{relatedTarget:0}),yd=zn(VT),GT=Ct({},zo,{animationName:0,elapsedTime:0,pseudoElement:0}),HT=zn(GT),jT=Ct({},zo,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),WT=zn(jT),XT=Ct({},zo,{data:0}),E0=zn(XT),$T={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},YT={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},KT={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function qT(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=KT[t])?!!e[t]:!1}function am(){return qT}var ZT=Ct({},dl,{key:function(t){if(t.key){var e=$T[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Pc(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?YT[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:am,charCode:function(t){return t.type==="keypress"?Pc(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Pc(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),QT=zn(ZT),JT=Ct({},Bu,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),T0=zn(JT),ew=Ct({},dl,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:am}),tw=zn(ew),nw=Ct({},zo,{propertyName:0,elapsedTime:0,pseudoElement:0}),iw=zn(nw),rw=Ct({},Bu,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),sw=zn(rw),ow=[9,13,27,32],lm=Ji&&"CompositionEvent"in window,Sa=null;Ji&&"documentMode"in document&&(Sa=document.documentMode);var aw=Ji&&"TextEvent"in window&&!Sa,jy=Ji&&(!lm||Sa&&8<Sa&&11>=Sa),w0=" ",b0=!1;function Wy(t,e){switch(t){case"keyup":return ow.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Xy(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var eo=!1;function lw(t,e){switch(t){case"compositionend":return Xy(e);case"keypress":return e.which!==32?null:(b0=!0,w0);case"textInput":return t=e.data,t===w0&&b0?null:t;default:return null}}function cw(t,e){if(eo)return t==="compositionend"||!lm&&Wy(t,e)?(t=Hy(),Rc=sm=Er=null,eo=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return jy&&e.locale!=="ko"?null:e.data;default:return null}}var uw={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function A0(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!uw[t.type]:e==="textarea"}function $y(t,e,n,i){Ty(i),e=nu(e,"onChange"),0<e.length&&(n=new om("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Ma=null,Ga=null;function dw(t){rS(t,0)}function zu(t){var e=io(t);if(vy(e))return t}function fw(t,e){if(t==="change")return e}var Yy=!1;if(Ji){var Sd;if(Ji){var Md="oninput"in document;if(!Md){var C0=document.createElement("div");C0.setAttribute("oninput","return;"),Md=typeof C0.oninput=="function"}Sd=Md}else Sd=!1;Yy=Sd&&(!document.documentMode||9<document.documentMode)}function R0(){Ma&&(Ma.detachEvent("onpropertychange",Ky),Ga=Ma=null)}function Ky(t){if(t.propertyName==="value"&&zu(Ga)){var e=[];$y(e,Ga,t,em(t)),Cy(dw,e)}}function hw(t,e,n){t==="focusin"?(R0(),Ma=e,Ga=n,Ma.attachEvent("onpropertychange",Ky)):t==="focusout"&&R0()}function pw(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return zu(Ga)}function mw(t,e){if(t==="click")return zu(e)}function gw(t,e){if(t==="input"||t==="change")return zu(e)}function vw(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var pi=typeof Object.is=="function"?Object.is:vw;function Ha(t,e){if(pi(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Vf.call(e,r)||!pi(t[r],e[r]))return!1}return!0}function P0(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function D0(t,e){var n=P0(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=P0(n)}}function qy(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?qy(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Zy(){for(var t=window,e=Kc();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=Kc(t.document)}return e}function cm(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function xw(t){var e=Zy(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&qy(n.ownerDocument.documentElement,n)){if(i!==null&&cm(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=D0(n,s);var o=D0(n,i);r&&o&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==o.node||t.focusOffset!==o.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(o.node,o.offset)):(e.setEnd(o.node,o.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var _w=Ji&&"documentMode"in document&&11>=document.documentMode,to=null,oh=null,Ea=null,ah=!1;function N0(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;ah||to==null||to!==Kc(i)||(i=to,"selectionStart"in i&&cm(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ea&&Ha(Ea,i)||(Ea=i,i=nu(oh,"onSelect"),0<i.length&&(e=new om("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=to)))}function Il(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var no={animationend:Il("Animation","AnimationEnd"),animationiteration:Il("Animation","AnimationIteration"),animationstart:Il("Animation","AnimationStart"),transitionend:Il("Transition","TransitionEnd")},Ed={},Qy={};Ji&&(Qy=document.createElement("div").style,"AnimationEvent"in window||(delete no.animationend.animation,delete no.animationiteration.animation,delete no.animationstart.animation),"TransitionEvent"in window||delete no.transitionend.transition);function Vu(t){if(Ed[t])return Ed[t];if(!no[t])return t;var e=no[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Qy)return Ed[t]=e[n];return t}var Jy=Vu("animationend"),eS=Vu("animationiteration"),tS=Vu("animationstart"),nS=Vu("transitionend"),iS=new Map,L0="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function Hr(t,e){iS.set(t,e),As(e,[t])}for(var Td=0;Td<L0.length;Td++){var wd=L0[Td],yw=wd.toLowerCase(),Sw=wd[0].toUpperCase()+wd.slice(1);Hr(yw,"on"+Sw)}Hr(Jy,"onAnimationEnd");Hr(eS,"onAnimationIteration");Hr(tS,"onAnimationStart");Hr("dblclick","onDoubleClick");Hr("focusin","onFocus");Hr("focusout","onBlur");Hr(nS,"onTransitionEnd");wo("onMouseEnter",["mouseout","mouseover"]);wo("onMouseLeave",["mouseout","mouseover"]);wo("onPointerEnter",["pointerout","pointerover"]);wo("onPointerLeave",["pointerout","pointerover"]);As("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));As("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));As("onBeforeInput",["compositionend","keypress","textInput","paste"]);As("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));As("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));As("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var fa="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),Mw=new Set("cancel close invalid load scroll toggle".split(" ").concat(fa));function I0(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,yT(i,e,void 0,t),t.currentTarget=null}function rS(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var o=i.length-1;0<=o;o--){var a=i[o],l=a.instance,c=a.currentTarget;if(a=a.listener,l!==s&&r.isPropagationStopped())break e;I0(r,a,c),s=l}else for(o=0;o<i.length;o++){if(a=i[o],l=a.instance,c=a.currentTarget,a=a.listener,l!==s&&r.isPropagationStopped())break e;I0(r,a,c),s=l}}}if(Zc)throw t=nh,Zc=!1,nh=null,t}function St(t,e){var n=e[fh];n===void 0&&(n=e[fh]=new Set);var i=t+"__bubble";n.has(i)||(sS(e,t,2,!1),n.add(i))}function bd(t,e,n){var i=0;e&&(i|=4),sS(n,t,i,e)}var Ul="_reactListening"+Math.random().toString(36).slice(2);function ja(t){if(!t[Ul]){t[Ul]=!0,fy.forEach(function(n){n!=="selectionchange"&&(Mw.has(n)||bd(n,!1,t),bd(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[Ul]||(e[Ul]=!0,bd("selectionchange",!1,e))}}function sS(t,e,n,i){switch(Gy(e)){case 1:var r=FT;break;case 4:r=OT;break;default:r=rm}n=r.bind(null,e,n,t),r=void 0,!th||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Ad(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var o=i.tag;if(o===3||o===4){var a=i.stateNode.containerInfo;if(a===r||a.nodeType===8&&a.parentNode===r)break;if(o===4)for(o=i.return;o!==null;){var l=o.tag;if((l===3||l===4)&&(l=o.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;o=o.return}for(;a!==null;){if(o=cs(a),o===null)return;if(l=o.tag,l===5||l===6){i=s=o;continue e}a=a.parentNode}}i=i.return}Cy(function(){var c=s,u=em(n),f=[];e:{var d=iS.get(t);if(d!==void 0){var p=om,v=t;switch(t){case"keypress":if(Pc(n)===0)break e;case"keydown":case"keyup":p=QT;break;case"focusin":v="focus",p=yd;break;case"focusout":v="blur",p=yd;break;case"beforeblur":case"afterblur":p=yd;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":p=M0;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":p=zT;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":p=tw;break;case Jy:case eS:case tS:p=HT;break;case nS:p=iw;break;case"scroll":p=kT;break;case"wheel":p=sw;break;case"copy":case"cut":case"paste":p=WT;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":p=T0}var S=(e&4)!==0,g=!S&&t==="scroll",h=S?d!==null?d+"Capture":null:d;S=[];for(var m=c,_;m!==null;){_=m;var M=_.stateNode;if(_.tag===5&&M!==null&&(_=M,h!==null&&(M=ka(m,h),M!=null&&S.push(Wa(m,M,_)))),g)break;m=m.return}0<S.length&&(d=new p(d,v,null,n,u),f.push({event:d,listeners:S}))}}if(!(e&7)){e:{if(d=t==="mouseover"||t==="pointerover",p=t==="mouseout"||t==="pointerout",d&&n!==Jf&&(v=n.relatedTarget||n.fromElement)&&(cs(v)||v[er]))break e;if((p||d)&&(d=u.window===u?u:(d=u.ownerDocument)?d.defaultView||d.parentWindow:window,p?(v=n.relatedTarget||n.toElement,p=c,v=v?cs(v):null,v!==null&&(g=Cs(v),v!==g||v.tag!==5&&v.tag!==6)&&(v=null)):(p=null,v=c),p!==v)){if(S=M0,M="onMouseLeave",h="onMouseEnter",m="mouse",(t==="pointerout"||t==="pointerover")&&(S=T0,M="onPointerLeave",h="onPointerEnter",m="pointer"),g=p==null?d:io(p),_=v==null?d:io(v),d=new S(M,m+"leave",p,n,u),d.target=g,d.relatedTarget=_,M=null,cs(u)===c&&(S=new S(h,m+"enter",v,n,u),S.target=_,S.relatedTarget=g,M=S),g=M,p&&v)t:{for(S=p,h=v,m=0,_=S;_;_=Ls(_))m++;for(_=0,M=h;M;M=Ls(M))_++;for(;0<m-_;)S=Ls(S),m--;for(;0<_-m;)h=Ls(h),_--;for(;m--;){if(S===h||h!==null&&S===h.alternate)break t;S=Ls(S),h=Ls(h)}S=null}else S=null;p!==null&&U0(f,d,p,S,!1),v!==null&&g!==null&&U0(f,g,v,S,!0)}}e:{if(d=c?io(c):window,p=d.nodeName&&d.nodeName.toLowerCase(),p==="select"||p==="input"&&d.type==="file")var w=fw;else if(A0(d))if(Yy)w=gw;else{w=pw;var T=hw}else(p=d.nodeName)&&p.toLowerCase()==="input"&&(d.type==="checkbox"||d.type==="radio")&&(w=mw);if(w&&(w=w(t,c))){$y(f,w,n,u);break e}T&&T(t,d,c),t==="focusout"&&(T=d._wrapperState)&&T.controlled&&d.type==="number"&&Yf(d,"number",d.value)}switch(T=c?io(c):window,t){case"focusin":(A0(T)||T.contentEditable==="true")&&(to=T,oh=c,Ea=null);break;case"focusout":Ea=oh=to=null;break;case"mousedown":ah=!0;break;case"contextmenu":case"mouseup":case"dragend":ah=!1,N0(f,n,u);break;case"selectionchange":if(_w)break;case"keydown":case"keyup":N0(f,n,u)}var R;if(lm)e:{switch(t){case"compositionstart":var y="onCompositionStart";break e;case"compositionend":y="onCompositionEnd";break e;case"compositionupdate":y="onCompositionUpdate";break e}y=void 0}else eo?Wy(t,n)&&(y="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(y="onCompositionStart");y&&(jy&&n.locale!=="ko"&&(eo||y!=="onCompositionStart"?y==="onCompositionEnd"&&eo&&(R=Hy()):(Er=u,sm="value"in Er?Er.value:Er.textContent,eo=!0)),T=nu(c,y),0<T.length&&(y=new E0(y,t,null,n,u),f.push({event:y,listeners:T}),R?y.data=R:(R=Xy(n),R!==null&&(y.data=R)))),(R=aw?lw(t,n):cw(t,n))&&(c=nu(c,"onBeforeInput"),0<c.length&&(u=new E0("onBeforeInput","beforeinput",null,n,u),f.push({event:u,listeners:c}),u.data=R))}rS(f,e)})}function Wa(t,e,n){return{instance:t,listener:e,currentTarget:n}}function nu(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=ka(t,n),s!=null&&i.unshift(Wa(t,s,r)),s=ka(t,e),s!=null&&i.push(Wa(t,s,r))),t=t.return}return i}function Ls(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function U0(t,e,n,i,r){for(var s=e._reactName,o=[];n!==null&&n!==i;){var a=n,l=a.alternate,c=a.stateNode;if(l!==null&&l===i)break;a.tag===5&&c!==null&&(a=c,r?(l=ka(n,s),l!=null&&o.unshift(Wa(n,l,a))):r||(l=ka(n,s),l!=null&&o.push(Wa(n,l,a)))),n=n.return}o.length!==0&&t.push({event:e,listeners:o})}var Ew=/\r\n?/g,Tw=/\u0000|\uFFFD/g;function F0(t){return(typeof t=="string"?t:""+t).replace(Ew,`
`).replace(Tw,"")}function Fl(t,e,n){if(e=F0(e),F0(t)!==e&&n)throw Error(oe(425))}function iu(){}var lh=null,ch=null;function uh(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var dh=typeof setTimeout=="function"?setTimeout:void 0,ww=typeof clearTimeout=="function"?clearTimeout:void 0,O0=typeof Promise=="function"?Promise:void 0,bw=typeof queueMicrotask=="function"?queueMicrotask:typeof O0<"u"?function(t){return O0.resolve(null).then(t).catch(Aw)}:dh;function Aw(t){setTimeout(function(){throw t})}function Cd(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Va(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Va(e)}function Pr(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function k0(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Vo=Math.random().toString(36).slice(2),Ti="__reactFiber$"+Vo,Xa="__reactProps$"+Vo,er="__reactContainer$"+Vo,fh="__reactEvents$"+Vo,Cw="__reactListeners$"+Vo,Rw="__reactHandles$"+Vo;function cs(t){var e=t[Ti];if(e)return e;for(var n=t.parentNode;n;){if(e=n[er]||n[Ti]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=k0(t);t!==null;){if(n=t[Ti])return n;t=k0(t)}return e}t=n,n=t.parentNode}return null}function fl(t){return t=t[Ti]||t[er],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function io(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(oe(33))}function Gu(t){return t[Xa]||null}var hh=[],ro=-1;function jr(t){return{current:t}}function Mt(t){0>ro||(t.current=hh[ro],hh[ro]=null,ro--)}function yt(t,e){ro++,hh[ro]=t.current,t.current=e}var Or={},pn=jr(Or),Tn=jr(!1),ys=Or;function bo(t,e){var n=t.type.contextTypes;if(!n)return Or;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function wn(t){return t=t.childContextTypes,t!=null}function ru(){Mt(Tn),Mt(pn)}function B0(t,e,n){if(pn.current!==Or)throw Error(oe(168));yt(pn,e),yt(Tn,n)}function oS(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(oe(108,hT(t)||"Unknown",r));return Ct({},n,i)}function su(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||Or,ys=pn.current,yt(pn,t),yt(Tn,Tn.current),!0}function z0(t,e,n){var i=t.stateNode;if(!i)throw Error(oe(169));n?(t=oS(t,e,ys),i.__reactInternalMemoizedMergedChildContext=t,Mt(Tn),Mt(pn),yt(pn,t)):Mt(Tn),yt(Tn,n)}var Hi=null,Hu=!1,Rd=!1;function aS(t){Hi===null?Hi=[t]:Hi.push(t)}function Pw(t){Hu=!0,aS(t)}function Wr(){if(!Rd&&Hi!==null){Rd=!0;var t=0,e=dt;try{var n=Hi;for(dt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}Hi=null,Hu=!1}catch(r){throw Hi!==null&&(Hi=Hi.slice(t+1)),Ny(tm,Wr),r}finally{dt=e,Rd=!1}}return null}var so=[],oo=0,ou=null,au=0,Xn=[],$n=0,Ss=null,ji=1,Wi="";function es(t,e){so[oo++]=au,so[oo++]=ou,ou=t,au=e}function lS(t,e,n){Xn[$n++]=ji,Xn[$n++]=Wi,Xn[$n++]=Ss,Ss=t;var i=ji;t=Wi;var r=32-di(i)-1;i&=~(1<<r),n+=1;var s=32-di(e)+r;if(30<s){var o=r-r%5;s=(i&(1<<o)-1).toString(32),i>>=o,r-=o,ji=1<<32-di(e)+r|n<<r|i,Wi=s+t}else ji=1<<s|n<<r|i,Wi=t}function um(t){t.return!==null&&(es(t,1),lS(t,1,0))}function dm(t){for(;t===ou;)ou=so[--oo],so[oo]=null,au=so[--oo],so[oo]=null;for(;t===Ss;)Ss=Xn[--$n],Xn[$n]=null,Wi=Xn[--$n],Xn[$n]=null,ji=Xn[--$n],Xn[$n]=null}var Un=null,In=null,Tt=!1,li=null;function cS(t,e){var n=qn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function V0(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,Un=t,In=Pr(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,Un=t,In=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Ss!==null?{id:ji,overflow:Wi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=qn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,Un=t,In=null,!0):!1;default:return!1}}function ph(t){return(t.mode&1)!==0&&(t.flags&128)===0}function mh(t){if(Tt){var e=In;if(e){var n=e;if(!V0(t,e)){if(ph(t))throw Error(oe(418));e=Pr(n.nextSibling);var i=Un;e&&V0(t,e)?cS(i,n):(t.flags=t.flags&-4097|2,Tt=!1,Un=t)}}else{if(ph(t))throw Error(oe(418));t.flags=t.flags&-4097|2,Tt=!1,Un=t}}}function G0(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;Un=t}function Ol(t){if(t!==Un)return!1;if(!Tt)return G0(t),Tt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!uh(t.type,t.memoizedProps)),e&&(e=In)){if(ph(t))throw uS(),Error(oe(418));for(;e;)cS(t,e),e=Pr(e.nextSibling)}if(G0(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(oe(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){In=Pr(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}In=null}}else In=Un?Pr(t.stateNode.nextSibling):null;return!0}function uS(){for(var t=In;t;)t=Pr(t.nextSibling)}function Ao(){In=Un=null,Tt=!1}function fm(t){li===null?li=[t]:li.push(t)}var Dw=or.ReactCurrentBatchConfig;function Qo(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(oe(309));var i=n.stateNode}if(!i)throw Error(oe(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(o){var a=r.refs;o===null?delete a[s]:a[s]=o},e._stringRef=s,e)}if(typeof t!="string")throw Error(oe(284));if(!n._owner)throw Error(oe(290,t))}return t}function kl(t,e){throw t=Object.prototype.toString.call(e),Error(oe(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function H0(t){var e=t._init;return e(t._payload)}function dS(t){function e(h,m){if(t){var _=h.deletions;_===null?(h.deletions=[m],h.flags|=16):_.push(m)}}function n(h,m){if(!t)return null;for(;m!==null;)e(h,m),m=m.sibling;return null}function i(h,m){for(h=new Map;m!==null;)m.key!==null?h.set(m.key,m):h.set(m.index,m),m=m.sibling;return h}function r(h,m){return h=Ir(h,m),h.index=0,h.sibling=null,h}function s(h,m,_){return h.index=_,t?(_=h.alternate,_!==null?(_=_.index,_<m?(h.flags|=2,m):_):(h.flags|=2,m)):(h.flags|=1048576,m)}function o(h){return t&&h.alternate===null&&(h.flags|=2),h}function a(h,m,_,M){return m===null||m.tag!==6?(m=Fd(_,h.mode,M),m.return=h,m):(m=r(m,_),m.return=h,m)}function l(h,m,_,M){var w=_.type;return w===Js?u(h,m,_.props.children,M,_.key):m!==null&&(m.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===xr&&H0(w)===m.type)?(M=r(m,_.props),M.ref=Qo(h,m,_),M.return=h,M):(M=Oc(_.type,_.key,_.props,null,h.mode,M),M.ref=Qo(h,m,_),M.return=h,M)}function c(h,m,_,M){return m===null||m.tag!==4||m.stateNode.containerInfo!==_.containerInfo||m.stateNode.implementation!==_.implementation?(m=Od(_,h.mode,M),m.return=h,m):(m=r(m,_.children||[]),m.return=h,m)}function u(h,m,_,M,w){return m===null||m.tag!==7?(m=gs(_,h.mode,M,w),m.return=h,m):(m=r(m,_),m.return=h,m)}function f(h,m,_){if(typeof m=="string"&&m!==""||typeof m=="number")return m=Fd(""+m,h.mode,_),m.return=h,m;if(typeof m=="object"&&m!==null){switch(m.$$typeof){case Al:return _=Oc(m.type,m.key,m.props,null,h.mode,_),_.ref=Qo(h,null,m),_.return=h,_;case Qs:return m=Od(m,h.mode,_),m.return=h,m;case xr:var M=m._init;return f(h,M(m._payload),_)}if(ua(m)||$o(m))return m=gs(m,h.mode,_,null),m.return=h,m;kl(h,m)}return null}function d(h,m,_,M){var w=m!==null?m.key:null;if(typeof _=="string"&&_!==""||typeof _=="number")return w!==null?null:a(h,m,""+_,M);if(typeof _=="object"&&_!==null){switch(_.$$typeof){case Al:return _.key===w?l(h,m,_,M):null;case Qs:return _.key===w?c(h,m,_,M):null;case xr:return w=_._init,d(h,m,w(_._payload),M)}if(ua(_)||$o(_))return w!==null?null:u(h,m,_,M,null);kl(h,_)}return null}function p(h,m,_,M,w){if(typeof M=="string"&&M!==""||typeof M=="number")return h=h.get(_)||null,a(m,h,""+M,w);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case Al:return h=h.get(M.key===null?_:M.key)||null,l(m,h,M,w);case Qs:return h=h.get(M.key===null?_:M.key)||null,c(m,h,M,w);case xr:var T=M._init;return p(h,m,_,T(M._payload),w)}if(ua(M)||$o(M))return h=h.get(_)||null,u(m,h,M,w,null);kl(m,M)}return null}function v(h,m,_,M){for(var w=null,T=null,R=m,y=m=0,C=null;R!==null&&y<_.length;y++){R.index>y?(C=R,R=null):C=R.sibling;var D=d(h,R,_[y],M);if(D===null){R===null&&(R=C);break}t&&R&&D.alternate===null&&e(h,R),m=s(D,m,y),T===null?w=D:T.sibling=D,T=D,R=C}if(y===_.length)return n(h,R),Tt&&es(h,y),w;if(R===null){for(;y<_.length;y++)R=f(h,_[y],M),R!==null&&(m=s(R,m,y),T===null?w=R:T.sibling=R,T=R);return Tt&&es(h,y),w}for(R=i(h,R);y<_.length;y++)C=p(R,h,y,_[y],M),C!==null&&(t&&C.alternate!==null&&R.delete(C.key===null?y:C.key),m=s(C,m,y),T===null?w=C:T.sibling=C,T=C);return t&&R.forEach(function(P){return e(h,P)}),Tt&&es(h,y),w}function S(h,m,_,M){var w=$o(_);if(typeof w!="function")throw Error(oe(150));if(_=w.call(_),_==null)throw Error(oe(151));for(var T=w=null,R=m,y=m=0,C=null,D=_.next();R!==null&&!D.done;y++,D=_.next()){R.index>y?(C=R,R=null):C=R.sibling;var P=d(h,R,D.value,M);if(P===null){R===null&&(R=C);break}t&&R&&P.alternate===null&&e(h,R),m=s(P,m,y),T===null?w=P:T.sibling=P,T=P,R=C}if(D.done)return n(h,R),Tt&&es(h,y),w;if(R===null){for(;!D.done;y++,D=_.next())D=f(h,D.value,M),D!==null&&(m=s(D,m,y),T===null?w=D:T.sibling=D,T=D);return Tt&&es(h,y),w}for(R=i(h,R);!D.done;y++,D=_.next())D=p(R,h,y,D.value,M),D!==null&&(t&&D.alternate!==null&&R.delete(D.key===null?y:D.key),m=s(D,m,y),T===null?w=D:T.sibling=D,T=D);return t&&R.forEach(function(N){return e(h,N)}),Tt&&es(h,y),w}function g(h,m,_,M){if(typeof _=="object"&&_!==null&&_.type===Js&&_.key===null&&(_=_.props.children),typeof _=="object"&&_!==null){switch(_.$$typeof){case Al:e:{for(var w=_.key,T=m;T!==null;){if(T.key===w){if(w=_.type,w===Js){if(T.tag===7){n(h,T.sibling),m=r(T,_.props.children),m.return=h,h=m;break e}}else if(T.elementType===w||typeof w=="object"&&w!==null&&w.$$typeof===xr&&H0(w)===T.type){n(h,T.sibling),m=r(T,_.props),m.ref=Qo(h,T,_),m.return=h,h=m;break e}n(h,T);break}else e(h,T);T=T.sibling}_.type===Js?(m=gs(_.props.children,h.mode,M,_.key),m.return=h,h=m):(M=Oc(_.type,_.key,_.props,null,h.mode,M),M.ref=Qo(h,m,_),M.return=h,h=M)}return o(h);case Qs:e:{for(T=_.key;m!==null;){if(m.key===T)if(m.tag===4&&m.stateNode.containerInfo===_.containerInfo&&m.stateNode.implementation===_.implementation){n(h,m.sibling),m=r(m,_.children||[]),m.return=h,h=m;break e}else{n(h,m);break}else e(h,m);m=m.sibling}m=Od(_,h.mode,M),m.return=h,h=m}return o(h);case xr:return T=_._init,g(h,m,T(_._payload),M)}if(ua(_))return v(h,m,_,M);if($o(_))return S(h,m,_,M);kl(h,_)}return typeof _=="string"&&_!==""||typeof _=="number"?(_=""+_,m!==null&&m.tag===6?(n(h,m.sibling),m=r(m,_),m.return=h,h=m):(n(h,m),m=Fd(_,h.mode,M),m.return=h,h=m),o(h)):n(h,m)}return g}var Co=dS(!0),fS=dS(!1),lu=jr(null),cu=null,ao=null,hm=null;function pm(){hm=ao=cu=null}function mm(t){var e=lu.current;Mt(lu),t._currentValue=e}function gh(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function yo(t,e){cu=t,hm=ao=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(En=!0),t.firstContext=null)}function Qn(t){var e=t._currentValue;if(hm!==t)if(t={context:t,memoizedValue:e,next:null},ao===null){if(cu===null)throw Error(oe(308));ao=t,cu.dependencies={lanes:0,firstContext:t}}else ao=ao.next=t;return e}var us=null;function gm(t){us===null?us=[t]:us.push(t)}function hS(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,gm(e)):(n.next=r.next,r.next=n),e.interleaved=n,tr(t,i)}function tr(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var _r=!1;function vm(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function pS(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function $i(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Dr(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,rt&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,tr(t,n)}return r=i.interleaved,r===null?(e.next=e,gm(i)):(e.next=r.next,r.next=e),i.interleaved=e,tr(t,n)}function Dc(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,nm(t,n)}}function j0(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var o={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=o:s=s.next=o,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function uu(t,e,n,i){var r=t.updateQueue;_r=!1;var s=r.firstBaseUpdate,o=r.lastBaseUpdate,a=r.shared.pending;if(a!==null){r.shared.pending=null;var l=a,c=l.next;l.next=null,o===null?s=c:o.next=c,o=l;var u=t.alternate;u!==null&&(u=u.updateQueue,a=u.lastBaseUpdate,a!==o&&(a===null?u.firstBaseUpdate=c:a.next=c,u.lastBaseUpdate=l))}if(s!==null){var f=r.baseState;o=0,u=c=l=null,a=s;do{var d=a.lane,p=a.eventTime;if((i&d)===d){u!==null&&(u=u.next={eventTime:p,lane:0,tag:a.tag,payload:a.payload,callback:a.callback,next:null});e:{var v=t,S=a;switch(d=e,p=n,S.tag){case 1:if(v=S.payload,typeof v=="function"){f=v.call(p,f,d);break e}f=v;break e;case 3:v.flags=v.flags&-65537|128;case 0:if(v=S.payload,d=typeof v=="function"?v.call(p,f,d):v,d==null)break e;f=Ct({},f,d);break e;case 2:_r=!0}}a.callback!==null&&a.lane!==0&&(t.flags|=64,d=r.effects,d===null?r.effects=[a]:d.push(a))}else p={eventTime:p,lane:d,tag:a.tag,payload:a.payload,callback:a.callback,next:null},u===null?(c=u=p,l=f):u=u.next=p,o|=d;if(a=a.next,a===null){if(a=r.shared.pending,a===null)break;d=a,a=d.next,d.next=null,r.lastBaseUpdate=d,r.shared.pending=null}}while(!0);if(u===null&&(l=f),r.baseState=l,r.firstBaseUpdate=c,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do o|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Es|=o,t.lanes=o,t.memoizedState=f}}function W0(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(oe(191,r));r.call(i)}}}var hl={},Pi=jr(hl),$a=jr(hl),Ya=jr(hl);function ds(t){if(t===hl)throw Error(oe(174));return t}function xm(t,e){switch(yt(Ya,e),yt($a,t),yt(Pi,hl),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:qf(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=qf(e,t)}Mt(Pi),yt(Pi,e)}function Ro(){Mt(Pi),Mt($a),Mt(Ya)}function mS(t){ds(Ya.current);var e=ds(Pi.current),n=qf(e,t.type);e!==n&&(yt($a,t),yt(Pi,n))}function _m(t){$a.current===t&&(Mt(Pi),Mt($a))}var wt=jr(0);function du(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var Pd=[];function ym(){for(var t=0;t<Pd.length;t++)Pd[t]._workInProgressVersionPrimary=null;Pd.length=0}var Nc=or.ReactCurrentDispatcher,Dd=or.ReactCurrentBatchConfig,Ms=0,At=null,zt=null,Xt=null,fu=!1,Ta=!1,Ka=0,Nw=0;function rn(){throw Error(oe(321))}function Sm(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!pi(t[n],e[n]))return!1;return!0}function Mm(t,e,n,i,r,s){if(Ms=s,At=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Nc.current=t===null||t.memoizedState===null?Fw:Ow,t=n(i,r),Ta){s=0;do{if(Ta=!1,Ka=0,25<=s)throw Error(oe(301));s+=1,Xt=zt=null,e.updateQueue=null,Nc.current=kw,t=n(i,r)}while(Ta)}if(Nc.current=hu,e=zt!==null&&zt.next!==null,Ms=0,Xt=zt=At=null,fu=!1,e)throw Error(oe(300));return t}function Em(){var t=Ka!==0;return Ka=0,t}function Ei(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Xt===null?At.memoizedState=Xt=t:Xt=Xt.next=t,Xt}function Jn(){if(zt===null){var t=At.alternate;t=t!==null?t.memoizedState:null}else t=zt.next;var e=Xt===null?At.memoizedState:Xt.next;if(e!==null)Xt=e,zt=t;else{if(t===null)throw Error(oe(310));zt=t,t={memoizedState:zt.memoizedState,baseState:zt.baseState,baseQueue:zt.baseQueue,queue:zt.queue,next:null},Xt===null?At.memoizedState=Xt=t:Xt=Xt.next=t}return Xt}function qa(t,e){return typeof e=="function"?e(t):e}function Nd(t){var e=Jn(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=zt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var o=r.next;r.next=s.next,s.next=o}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var a=o=null,l=null,c=s;do{var u=c.lane;if((Ms&u)===u)l!==null&&(l=l.next={lane:0,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null}),i=c.hasEagerState?c.eagerState:t(i,c.action);else{var f={lane:u,action:c.action,hasEagerState:c.hasEagerState,eagerState:c.eagerState,next:null};l===null?(a=l=f,o=i):l=l.next=f,At.lanes|=u,Es|=u}c=c.next}while(c!==null&&c!==s);l===null?o=i:l.next=a,pi(i,e.memoizedState)||(En=!0),e.memoizedState=i,e.baseState=o,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,At.lanes|=s,Es|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Ld(t){var e=Jn(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var o=r=r.next;do s=t(s,o.action),o=o.next;while(o!==r);pi(s,e.memoizedState)||(En=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function gS(){}function vS(t,e){var n=At,i=Jn(),r=e(),s=!pi(i.memoizedState,r);if(s&&(i.memoizedState=r,En=!0),i=i.queue,Tm(yS.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Xt!==null&&Xt.memoizedState.tag&1){if(n.flags|=2048,Za(9,_S.bind(null,n,i,r,e),void 0,null),$t===null)throw Error(oe(349));Ms&30||xS(n,e,r)}return r}function xS(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=At.updateQueue,e===null?(e={lastEffect:null,stores:null},At.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function _S(t,e,n,i){e.value=n,e.getSnapshot=i,SS(e)&&MS(t)}function yS(t,e,n){return n(function(){SS(e)&&MS(t)})}function SS(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!pi(t,n)}catch{return!0}}function MS(t){var e=tr(t,1);e!==null&&fi(e,t,1,-1)}function X0(t){var e=Ei();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:qa,lastRenderedState:t},e.queue=t,t=t.dispatch=Uw.bind(null,At,t),[e.memoizedState,t]}function Za(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=At.updateQueue,e===null?(e={lastEffect:null,stores:null},At.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function ES(){return Jn().memoizedState}function Lc(t,e,n,i){var r=Ei();At.flags|=t,r.memoizedState=Za(1|e,n,void 0,i===void 0?null:i)}function ju(t,e,n,i){var r=Jn();i=i===void 0?null:i;var s=void 0;if(zt!==null){var o=zt.memoizedState;if(s=o.destroy,i!==null&&Sm(i,o.deps)){r.memoizedState=Za(e,n,s,i);return}}At.flags|=t,r.memoizedState=Za(1|e,n,s,i)}function $0(t,e){return Lc(8390656,8,t,e)}function Tm(t,e){return ju(2048,8,t,e)}function TS(t,e){return ju(4,2,t,e)}function wS(t,e){return ju(4,4,t,e)}function bS(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function AS(t,e,n){return n=n!=null?n.concat([t]):null,ju(4,4,bS.bind(null,e,t),n)}function wm(){}function CS(t,e){var n=Jn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Sm(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function RS(t,e){var n=Jn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Sm(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function PS(t,e,n){return Ms&21?(pi(n,e)||(n=Uy(),At.lanes|=n,Es|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,En=!0),t.memoizedState=n)}function Lw(t,e){var n=dt;dt=n!==0&&4>n?n:4,t(!0);var i=Dd.transition;Dd.transition={};try{t(!1),e()}finally{dt=n,Dd.transition=i}}function DS(){return Jn().memoizedState}function Iw(t,e,n){var i=Lr(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},NS(t))LS(e,n);else if(n=hS(t,e,n,i),n!==null){var r=xn();fi(n,t,i,r),IS(n,e,i)}}function Uw(t,e,n){var i=Lr(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(NS(t))LS(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var o=e.lastRenderedState,a=s(o,n);if(r.hasEagerState=!0,r.eagerState=a,pi(a,o)){var l=e.interleaved;l===null?(r.next=r,gm(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=hS(t,e,r,i),n!==null&&(r=xn(),fi(n,t,i,r),IS(n,e,i))}}function NS(t){var e=t.alternate;return t===At||e!==null&&e===At}function LS(t,e){Ta=fu=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function IS(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,nm(t,n)}}var hu={readContext:Qn,useCallback:rn,useContext:rn,useEffect:rn,useImperativeHandle:rn,useInsertionEffect:rn,useLayoutEffect:rn,useMemo:rn,useReducer:rn,useRef:rn,useState:rn,useDebugValue:rn,useDeferredValue:rn,useTransition:rn,useMutableSource:rn,useSyncExternalStore:rn,useId:rn,unstable_isNewReconciler:!1},Fw={readContext:Qn,useCallback:function(t,e){return Ei().memoizedState=[t,e===void 0?null:e],t},useContext:Qn,useEffect:$0,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,Lc(4194308,4,bS.bind(null,e,t),n)},useLayoutEffect:function(t,e){return Lc(4194308,4,t,e)},useInsertionEffect:function(t,e){return Lc(4,2,t,e)},useMemo:function(t,e){var n=Ei();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Ei();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=Iw.bind(null,At,t),[i.memoizedState,t]},useRef:function(t){var e=Ei();return t={current:t},e.memoizedState=t},useState:X0,useDebugValue:wm,useDeferredValue:function(t){return Ei().memoizedState=t},useTransition:function(){var t=X0(!1),e=t[0];return t=Lw.bind(null,t[1]),Ei().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=At,r=Ei();if(Tt){if(n===void 0)throw Error(oe(407));n=n()}else{if(n=e(),$t===null)throw Error(oe(349));Ms&30||xS(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,$0(yS.bind(null,i,s,t),[t]),i.flags|=2048,Za(9,_S.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Ei(),e=$t.identifierPrefix;if(Tt){var n=Wi,i=ji;n=(i&~(1<<32-di(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ka++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=Nw++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Ow={readContext:Qn,useCallback:CS,useContext:Qn,useEffect:Tm,useImperativeHandle:AS,useInsertionEffect:TS,useLayoutEffect:wS,useMemo:RS,useReducer:Nd,useRef:ES,useState:function(){return Nd(qa)},useDebugValue:wm,useDeferredValue:function(t){var e=Jn();return PS(e,zt.memoizedState,t)},useTransition:function(){var t=Nd(qa)[0],e=Jn().memoizedState;return[t,e]},useMutableSource:gS,useSyncExternalStore:vS,useId:DS,unstable_isNewReconciler:!1},kw={readContext:Qn,useCallback:CS,useContext:Qn,useEffect:Tm,useImperativeHandle:AS,useInsertionEffect:TS,useLayoutEffect:wS,useMemo:RS,useReducer:Ld,useRef:ES,useState:function(){return Ld(qa)},useDebugValue:wm,useDeferredValue:function(t){var e=Jn();return zt===null?e.memoizedState=t:PS(e,zt.memoizedState,t)},useTransition:function(){var t=Ld(qa)[0],e=Jn().memoizedState;return[t,e]},useMutableSource:gS,useSyncExternalStore:vS,useId:DS,unstable_isNewReconciler:!1};function oi(t,e){if(t&&t.defaultProps){e=Ct({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function vh(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:Ct({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var Wu={isMounted:function(t){return(t=t._reactInternals)?Cs(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=xn(),r=Lr(t),s=$i(i,r);s.payload=e,n!=null&&(s.callback=n),e=Dr(t,s,r),e!==null&&(fi(e,t,r,i),Dc(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=xn(),r=Lr(t),s=$i(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Dr(t,s,r),e!==null&&(fi(e,t,r,i),Dc(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=xn(),i=Lr(t),r=$i(n,i);r.tag=2,e!=null&&(r.callback=e),e=Dr(t,r,i),e!==null&&(fi(e,t,i,n),Dc(e,t,i))}};function Y0(t,e,n,i,r,s,o){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,o):e.prototype&&e.prototype.isPureReactComponent?!Ha(n,i)||!Ha(r,s):!0}function US(t,e,n){var i=!1,r=Or,s=e.contextType;return typeof s=="object"&&s!==null?s=Qn(s):(r=wn(e)?ys:pn.current,i=e.contextTypes,s=(i=i!=null)?bo(t,r):Or),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=Wu,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function K0(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&Wu.enqueueReplaceState(e,e.state,null)}function xh(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},vm(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Qn(s):(s=wn(e)?ys:pn.current,r.context=bo(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(vh(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&Wu.enqueueReplaceState(r,r.state,null),uu(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Po(t,e){try{var n="",i=e;do n+=fT(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Id(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function _h(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var Bw=typeof WeakMap=="function"?WeakMap:Map;function FS(t,e,n){n=$i(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){mu||(mu=!0,Rh=i),_h(t,e)},n}function OS(t,e,n){n=$i(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){_h(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){_h(t,e),typeof i!="function"&&(Nr===null?Nr=new Set([this]):Nr.add(this));var o=e.stack;this.componentDidCatch(e.value,{componentStack:o!==null?o:""})}),n}function q0(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new Bw;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=Jw.bind(null,t,e,n),e.then(t,t))}function Z0(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function Q0(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=$i(-1,1),e.tag=2,Dr(n,e,1))),n.lanes|=1),t)}var zw=or.ReactCurrentOwner,En=!1;function vn(t,e,n,i){e.child=t===null?fS(e,null,n,i):Co(e,t.child,n,i)}function J0(t,e,n,i,r){n=n.render;var s=e.ref;return yo(e,r),i=Mm(t,e,n,i,s,r),n=Em(),t!==null&&!En?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,nr(t,e,r)):(Tt&&n&&um(e),e.flags|=1,vn(t,e,i,r),e.child)}function ev(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Lm(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,kS(t,e,s,i,r)):(t=Oc(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var o=s.memoizedProps;if(n=n.compare,n=n!==null?n:Ha,n(o,i)&&t.ref===e.ref)return nr(t,e,r)}return e.flags|=1,t=Ir(s,i),t.ref=e.ref,t.return=e,e.child=t}function kS(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Ha(s,i)&&t.ref===e.ref)if(En=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(En=!0);else return e.lanes=t.lanes,nr(t,e,r)}return yh(t,e,n,i,r)}function BS(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},yt(co,Nn),Nn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,yt(co,Nn),Nn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,yt(co,Nn),Nn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,yt(co,Nn),Nn|=i;return vn(t,e,r,n),e.child}function zS(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function yh(t,e,n,i,r){var s=wn(n)?ys:pn.current;return s=bo(e,s),yo(e,r),n=Mm(t,e,n,i,s,r),i=Em(),t!==null&&!En?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,nr(t,e,r)):(Tt&&i&&um(e),e.flags|=1,vn(t,e,n,r),e.child)}function tv(t,e,n,i,r){if(wn(n)){var s=!0;su(e)}else s=!1;if(yo(e,r),e.stateNode===null)Ic(t,e),US(e,n,i),xh(e,n,i,r),i=!0;else if(t===null){var o=e.stateNode,a=e.memoizedProps;o.props=a;var l=o.context,c=n.contextType;typeof c=="object"&&c!==null?c=Qn(c):(c=wn(n)?ys:pn.current,c=bo(e,c));var u=n.getDerivedStateFromProps,f=typeof u=="function"||typeof o.getSnapshotBeforeUpdate=="function";f||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==i||l!==c)&&K0(e,o,i,c),_r=!1;var d=e.memoizedState;o.state=d,uu(e,i,o,r),l=e.memoizedState,a!==i||d!==l||Tn.current||_r?(typeof u=="function"&&(vh(e,n,u,i),l=e.memoizedState),(a=_r||Y0(e,n,a,i,d,l,c))?(f||typeof o.UNSAFE_componentWillMount!="function"&&typeof o.componentWillMount!="function"||(typeof o.componentWillMount=="function"&&o.componentWillMount(),typeof o.UNSAFE_componentWillMount=="function"&&o.UNSAFE_componentWillMount()),typeof o.componentDidMount=="function"&&(e.flags|=4194308)):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),o.props=i,o.state=l,o.context=c,i=a):(typeof o.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{o=e.stateNode,pS(t,e),a=e.memoizedProps,c=e.type===e.elementType?a:oi(e.type,a),o.props=c,f=e.pendingProps,d=o.context,l=n.contextType,typeof l=="object"&&l!==null?l=Qn(l):(l=wn(n)?ys:pn.current,l=bo(e,l));var p=n.getDerivedStateFromProps;(u=typeof p=="function"||typeof o.getSnapshotBeforeUpdate=="function")||typeof o.UNSAFE_componentWillReceiveProps!="function"&&typeof o.componentWillReceiveProps!="function"||(a!==f||d!==l)&&K0(e,o,i,l),_r=!1,d=e.memoizedState,o.state=d,uu(e,i,o,r);var v=e.memoizedState;a!==f||d!==v||Tn.current||_r?(typeof p=="function"&&(vh(e,n,p,i),v=e.memoizedState),(c=_r||Y0(e,n,c,i,d,v,l)||!1)?(u||typeof o.UNSAFE_componentWillUpdate!="function"&&typeof o.componentWillUpdate!="function"||(typeof o.componentWillUpdate=="function"&&o.componentWillUpdate(i,v,l),typeof o.UNSAFE_componentWillUpdate=="function"&&o.UNSAFE_componentWillUpdate(i,v,l)),typeof o.componentDidUpdate=="function"&&(e.flags|=4),typeof o.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=v),o.props=i,o.state=v,o.context=l,i=c):(typeof o.componentDidUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=4),typeof o.getSnapshotBeforeUpdate!="function"||a===t.memoizedProps&&d===t.memoizedState||(e.flags|=1024),i=!1)}return Sh(t,e,n,i,s,r)}function Sh(t,e,n,i,r,s){zS(t,e);var o=(e.flags&128)!==0;if(!i&&!o)return r&&z0(e,n,!1),nr(t,e,s);i=e.stateNode,zw.current=e;var a=o&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&o?(e.child=Co(e,t.child,null,s),e.child=Co(e,null,a,s)):vn(t,e,a,s),e.memoizedState=i.state,r&&z0(e,n,!0),e.child}function VS(t){var e=t.stateNode;e.pendingContext?B0(t,e.pendingContext,e.pendingContext!==e.context):e.context&&B0(t,e.context,!1),xm(t,e.containerInfo)}function nv(t,e,n,i,r){return Ao(),fm(r),e.flags|=256,vn(t,e,n,i),e.child}var Mh={dehydrated:null,treeContext:null,retryLane:0};function Eh(t){return{baseLanes:t,cachePool:null,transitions:null}}function GS(t,e,n){var i=e.pendingProps,r=wt.current,s=!1,o=(e.flags&128)!==0,a;if((a=o)||(a=t!==null&&t.memoizedState===null?!1:(r&2)!==0),a?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),yt(wt,r&1),t===null)return mh(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(o=i.children,t=i.fallback,s?(i=e.mode,s=e.child,o={mode:"hidden",children:o},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=o):s=Yu(o,i,0,null),t=gs(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=Eh(n),e.memoizedState=Mh,t):bm(e,o));if(r=t.memoizedState,r!==null&&(a=r.dehydrated,a!==null))return Vw(t,e,o,i,a,r,n);if(s){s=i.fallback,o=e.mode,r=t.child,a=r.sibling;var l={mode:"hidden",children:i.children};return!(o&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=Ir(r,l),i.subtreeFlags=r.subtreeFlags&14680064),a!==null?s=Ir(a,s):(s=gs(s,o,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,o=t.child.memoizedState,o=o===null?Eh(n):{baseLanes:o.baseLanes|n,cachePool:null,transitions:o.transitions},s.memoizedState=o,s.childLanes=t.childLanes&~n,e.memoizedState=Mh,i}return s=t.child,t=s.sibling,i=Ir(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function bm(t,e){return e=Yu({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function Bl(t,e,n,i){return i!==null&&fm(i),Co(e,t.child,null,n),t=bm(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function Vw(t,e,n,i,r,s,o){if(n)return e.flags&256?(e.flags&=-257,i=Id(Error(oe(422))),Bl(t,e,o,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=Yu({mode:"visible",children:i.children},r,0,null),s=gs(s,r,o,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Co(e,t.child,null,o),e.child.memoizedState=Eh(o),e.memoizedState=Mh,s);if(!(e.mode&1))return Bl(t,e,o,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var a=i.dgst;return i=a,s=Error(oe(419)),i=Id(s,i,void 0),Bl(t,e,o,i)}if(a=(o&t.childLanes)!==0,En||a){if(i=$t,i!==null){switch(o&-o){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|o)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,tr(t,r),fi(i,t,r,-1))}return Nm(),i=Id(Error(oe(421))),Bl(t,e,o,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=eb.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,In=Pr(r.nextSibling),Un=e,Tt=!0,li=null,t!==null&&(Xn[$n++]=ji,Xn[$n++]=Wi,Xn[$n++]=Ss,ji=t.id,Wi=t.overflow,Ss=e),e=bm(e,i.children),e.flags|=4096,e)}function iv(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),gh(t.return,e,n)}function Ud(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function HS(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(vn(t,e,i.children,n),i=wt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&iv(t,n,e);else if(t.tag===19)iv(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(yt(wt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&du(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Ud(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&du(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Ud(e,!0,n,null,s);break;case"together":Ud(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function Ic(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function nr(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Es|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(oe(153));if(e.child!==null){for(t=e.child,n=Ir(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=Ir(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Gw(t,e,n){switch(e.tag){case 3:VS(e),Ao();break;case 5:mS(e);break;case 1:wn(e.type)&&su(e);break;case 4:xm(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;yt(lu,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(yt(wt,wt.current&1),e.flags|=128,null):n&e.child.childLanes?GS(t,e,n):(yt(wt,wt.current&1),t=nr(t,e,n),t!==null?t.sibling:null);yt(wt,wt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return HS(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),yt(wt,wt.current),i)break;return null;case 22:case 23:return e.lanes=0,BS(t,e,n)}return nr(t,e,n)}var jS,Th,WS,XS;jS=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};Th=function(){};WS=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,ds(Pi.current);var s=null;switch(n){case"input":r=Xf(t,r),i=Xf(t,i),s=[];break;case"select":r=Ct({},r,{value:void 0}),i=Ct({},i,{value:void 0}),s=[];break;case"textarea":r=Kf(t,r),i=Kf(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=iu)}Zf(n,i);var o;n=null;for(c in r)if(!i.hasOwnProperty(c)&&r.hasOwnProperty(c)&&r[c]!=null)if(c==="style"){var a=r[c];for(o in a)a.hasOwnProperty(o)&&(n||(n={}),n[o]="")}else c!=="dangerouslySetInnerHTML"&&c!=="children"&&c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&c!=="autoFocus"&&(Fa.hasOwnProperty(c)?s||(s=[]):(s=s||[]).push(c,null));for(c in i){var l=i[c];if(a=r!=null?r[c]:void 0,i.hasOwnProperty(c)&&l!==a&&(l!=null||a!=null))if(c==="style")if(a){for(o in a)!a.hasOwnProperty(o)||l&&l.hasOwnProperty(o)||(n||(n={}),n[o]="");for(o in l)l.hasOwnProperty(o)&&a[o]!==l[o]&&(n||(n={}),n[o]=l[o])}else n||(s||(s=[]),s.push(c,n)),n=l;else c==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,a=a?a.__html:void 0,l!=null&&a!==l&&(s=s||[]).push(c,l)):c==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(c,""+l):c!=="suppressContentEditableWarning"&&c!=="suppressHydrationWarning"&&(Fa.hasOwnProperty(c)?(l!=null&&c==="onScroll"&&St("scroll",t),s||a===l||(s=[])):(s=s||[]).push(c,l))}n&&(s=s||[]).push("style",n);var c=s;(e.updateQueue=c)&&(e.flags|=4)}};XS=function(t,e,n,i){n!==i&&(e.flags|=4)};function Jo(t,e){if(!Tt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function sn(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Hw(t,e,n){var i=e.pendingProps;switch(dm(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return sn(e),null;case 1:return wn(e.type)&&ru(),sn(e),null;case 3:return i=e.stateNode,Ro(),Mt(Tn),Mt(pn),ym(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(Ol(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,li!==null&&(Nh(li),li=null))),Th(t,e),sn(e),null;case 5:_m(e);var r=ds(Ya.current);if(n=e.type,t!==null&&e.stateNode!=null)WS(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(oe(166));return sn(e),null}if(t=ds(Pi.current),Ol(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[Ti]=e,i[Xa]=s,t=(e.mode&1)!==0,n){case"dialog":St("cancel",i),St("close",i);break;case"iframe":case"object":case"embed":St("load",i);break;case"video":case"audio":for(r=0;r<fa.length;r++)St(fa[r],i);break;case"source":St("error",i);break;case"img":case"image":case"link":St("error",i),St("load",i);break;case"details":St("toggle",i);break;case"input":f0(i,s),St("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},St("invalid",i);break;case"textarea":p0(i,s),St("invalid",i)}Zf(n,s),r=null;for(var o in s)if(s.hasOwnProperty(o)){var a=s[o];o==="children"?typeof a=="string"?i.textContent!==a&&(s.suppressHydrationWarning!==!0&&Fl(i.textContent,a,t),r=["children",a]):typeof a=="number"&&i.textContent!==""+a&&(s.suppressHydrationWarning!==!0&&Fl(i.textContent,a,t),r=["children",""+a]):Fa.hasOwnProperty(o)&&a!=null&&o==="onScroll"&&St("scroll",i)}switch(n){case"input":Cl(i),h0(i,s,!0);break;case"textarea":Cl(i),m0(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=iu)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{o=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=yy(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=o.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=o.createElement(n,{is:i.is}):(t=o.createElement(n),n==="select"&&(o=t,i.multiple?o.multiple=!0:i.size&&(o.size=i.size))):t=o.createElementNS(t,n),t[Ti]=e,t[Xa]=i,jS(t,e,!1,!1),e.stateNode=t;e:{switch(o=Qf(n,i),n){case"dialog":St("cancel",t),St("close",t),r=i;break;case"iframe":case"object":case"embed":St("load",t),r=i;break;case"video":case"audio":for(r=0;r<fa.length;r++)St(fa[r],t);r=i;break;case"source":St("error",t),r=i;break;case"img":case"image":case"link":St("error",t),St("load",t),r=i;break;case"details":St("toggle",t),r=i;break;case"input":f0(t,i),r=Xf(t,i),St("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=Ct({},i,{value:void 0}),St("invalid",t);break;case"textarea":p0(t,i),r=Kf(t,i),St("invalid",t);break;default:r=i}Zf(n,r),a=r;for(s in a)if(a.hasOwnProperty(s)){var l=a[s];s==="style"?Ey(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&Sy(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Oa(t,l):typeof l=="number"&&Oa(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Fa.hasOwnProperty(s)?l!=null&&s==="onScroll"&&St("scroll",t):l!=null&&qp(t,s,l,o))}switch(n){case"input":Cl(t),h0(t,i,!1);break;case"textarea":Cl(t),m0(t);break;case"option":i.value!=null&&t.setAttribute("value",""+Fr(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?go(t,!!i.multiple,s,!1):i.defaultValue!=null&&go(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=iu)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return sn(e),null;case 6:if(t&&e.stateNode!=null)XS(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(oe(166));if(n=ds(Ya.current),ds(Pi.current),Ol(e)){if(i=e.stateNode,n=e.memoizedProps,i[Ti]=e,(s=i.nodeValue!==n)&&(t=Un,t!==null))switch(t.tag){case 3:Fl(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&Fl(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[Ti]=e,e.stateNode=i}return sn(e),null;case 13:if(Mt(wt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(Tt&&In!==null&&e.mode&1&&!(e.flags&128))uS(),Ao(),e.flags|=98560,s=!1;else if(s=Ol(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(oe(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(oe(317));s[Ti]=e}else Ao(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;sn(e),s=!1}else li!==null&&(Nh(li),li=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||wt.current&1?Vt===0&&(Vt=3):Nm())),e.updateQueue!==null&&(e.flags|=4),sn(e),null);case 4:return Ro(),Th(t,e),t===null&&ja(e.stateNode.containerInfo),sn(e),null;case 10:return mm(e.type._context),sn(e),null;case 17:return wn(e.type)&&ru(),sn(e),null;case 19:if(Mt(wt),s=e.memoizedState,s===null)return sn(e),null;if(i=(e.flags&128)!==0,o=s.rendering,o===null)if(i)Jo(s,!1);else{if(Vt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(o=du(t),o!==null){for(e.flags|=128,Jo(s,!1),i=o.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,o=s.alternate,o===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=o.childLanes,s.lanes=o.lanes,s.child=o.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=o.memoizedProps,s.memoizedState=o.memoizedState,s.updateQueue=o.updateQueue,s.type=o.type,t=o.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return yt(wt,wt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Ot()>Do&&(e.flags|=128,i=!0,Jo(s,!1),e.lanes=4194304)}else{if(!i)if(t=du(o),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),Jo(s,!0),s.tail===null&&s.tailMode==="hidden"&&!o.alternate&&!Tt)return sn(e),null}else 2*Ot()-s.renderingStartTime>Do&&n!==1073741824&&(e.flags|=128,i=!0,Jo(s,!1),e.lanes=4194304);s.isBackwards?(o.sibling=e.child,e.child=o):(n=s.last,n!==null?n.sibling=o:e.child=o,s.last=o)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Ot(),e.sibling=null,n=wt.current,yt(wt,i?n&1|2:n&1),e):(sn(e),null);case 22:case 23:return Dm(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?Nn&1073741824&&(sn(e),e.subtreeFlags&6&&(e.flags|=8192)):sn(e),null;case 24:return null;case 25:return null}throw Error(oe(156,e.tag))}function jw(t,e){switch(dm(e),e.tag){case 1:return wn(e.type)&&ru(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ro(),Mt(Tn),Mt(pn),ym(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return _m(e),null;case 13:if(Mt(wt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(oe(340));Ao()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return Mt(wt),null;case 4:return Ro(),null;case 10:return mm(e.type._context),null;case 22:case 23:return Dm(),null;case 24:return null;default:return null}}var zl=!1,cn=!1,Ww=typeof WeakSet=="function"?WeakSet:Set,we=null;function lo(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){Dt(t,e,i)}else n.current=null}function wh(t,e,n){try{n()}catch(i){Dt(t,e,i)}}var rv=!1;function Xw(t,e){if(lh=eu,t=Zy(),cm(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var o=0,a=-1,l=-1,c=0,u=0,f=t,d=null;t:for(;;){for(var p;f!==n||r!==0&&f.nodeType!==3||(a=o+r),f!==s||i!==0&&f.nodeType!==3||(l=o+i),f.nodeType===3&&(o+=f.nodeValue.length),(p=f.firstChild)!==null;)d=f,f=p;for(;;){if(f===t)break t;if(d===n&&++c===r&&(a=o),d===s&&++u===i&&(l=o),(p=f.nextSibling)!==null)break;f=d,d=f.parentNode}f=p}n=a===-1||l===-1?null:{start:a,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for(ch={focusedElem:t,selectionRange:n},eu=!1,we=e;we!==null;)if(e=we,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,we=t;else for(;we!==null;){e=we;try{var v=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(v!==null){var S=v.memoizedProps,g=v.memoizedState,h=e.stateNode,m=h.getSnapshotBeforeUpdate(e.elementType===e.type?S:oi(e.type,S),g);h.__reactInternalSnapshotBeforeUpdate=m}break;case 3:var _=e.stateNode.containerInfo;_.nodeType===1?_.textContent="":_.nodeType===9&&_.documentElement&&_.removeChild(_.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(oe(163))}}catch(M){Dt(e,e.return,M)}if(t=e.sibling,t!==null){t.return=e.return,we=t;break}we=e.return}return v=rv,rv=!1,v}function wa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&wh(e,n,s)}r=r.next}while(r!==i)}}function Xu(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function bh(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function $S(t){var e=t.alternate;e!==null&&(t.alternate=null,$S(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[Ti],delete e[Xa],delete e[fh],delete e[Cw],delete e[Rw])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function YS(t){return t.tag===5||t.tag===3||t.tag===4}function sv(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||YS(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function Ah(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=iu));else if(i!==4&&(t=t.child,t!==null))for(Ah(t,e,n),t=t.sibling;t!==null;)Ah(t,e,n),t=t.sibling}function Ch(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(Ch(t,e,n),t=t.sibling;t!==null;)Ch(t,e,n),t=t.sibling}var qt=null,ai=!1;function ur(t,e,n){for(n=n.child;n!==null;)KS(t,e,n),n=n.sibling}function KS(t,e,n){if(Ri&&typeof Ri.onCommitFiberUnmount=="function")try{Ri.onCommitFiberUnmount(ku,n)}catch{}switch(n.tag){case 5:cn||lo(n,e);case 6:var i=qt,r=ai;qt=null,ur(t,e,n),qt=i,ai=r,qt!==null&&(ai?(t=qt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):qt.removeChild(n.stateNode));break;case 18:qt!==null&&(ai?(t=qt,n=n.stateNode,t.nodeType===8?Cd(t.parentNode,n):t.nodeType===1&&Cd(t,n),Va(t)):Cd(qt,n.stateNode));break;case 4:i=qt,r=ai,qt=n.stateNode.containerInfo,ai=!0,ur(t,e,n),qt=i,ai=r;break;case 0:case 11:case 14:case 15:if(!cn&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,o=s.destroy;s=s.tag,o!==void 0&&(s&2||s&4)&&wh(n,e,o),r=r.next}while(r!==i)}ur(t,e,n);break;case 1:if(!cn&&(lo(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(a){Dt(n,e,a)}ur(t,e,n);break;case 21:ur(t,e,n);break;case 22:n.mode&1?(cn=(i=cn)||n.memoizedState!==null,ur(t,e,n),cn=i):ur(t,e,n);break;default:ur(t,e,n)}}function ov(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new Ww),e.forEach(function(i){var r=tb.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function ti(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,o=e,a=o;e:for(;a!==null;){switch(a.tag){case 5:qt=a.stateNode,ai=!1;break e;case 3:qt=a.stateNode.containerInfo,ai=!0;break e;case 4:qt=a.stateNode.containerInfo,ai=!0;break e}a=a.return}if(qt===null)throw Error(oe(160));KS(s,o,r),qt=null,ai=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(c){Dt(r,e,c)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)qS(e,t),e=e.sibling}function qS(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(ti(e,t),xi(t),i&4){try{wa(3,t,t.return),Xu(3,t)}catch(S){Dt(t,t.return,S)}try{wa(5,t,t.return)}catch(S){Dt(t,t.return,S)}}break;case 1:ti(e,t),xi(t),i&512&&n!==null&&lo(n,n.return);break;case 5:if(ti(e,t),xi(t),i&512&&n!==null&&lo(n,n.return),t.flags&32){var r=t.stateNode;try{Oa(r,"")}catch(S){Dt(t,t.return,S)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,o=n!==null?n.memoizedProps:s,a=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{a==="input"&&s.type==="radio"&&s.name!=null&&xy(r,s),Qf(a,o);var c=Qf(a,s);for(o=0;o<l.length;o+=2){var u=l[o],f=l[o+1];u==="style"?Ey(r,f):u==="dangerouslySetInnerHTML"?Sy(r,f):u==="children"?Oa(r,f):qp(r,u,f,c)}switch(a){case"input":$f(r,s);break;case"textarea":_y(r,s);break;case"select":var d=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var p=s.value;p!=null?go(r,!!s.multiple,p,!1):d!==!!s.multiple&&(s.defaultValue!=null?go(r,!!s.multiple,s.defaultValue,!0):go(r,!!s.multiple,s.multiple?[]:"",!1))}r[Xa]=s}catch(S){Dt(t,t.return,S)}}break;case 6:if(ti(e,t),xi(t),i&4){if(t.stateNode===null)throw Error(oe(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(S){Dt(t,t.return,S)}}break;case 3:if(ti(e,t),xi(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Va(e.containerInfo)}catch(S){Dt(t,t.return,S)}break;case 4:ti(e,t),xi(t);break;case 13:ti(e,t),xi(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Rm=Ot())),i&4&&ov(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?(cn=(c=cn)||u,ti(e,t),cn=c):ti(e,t),xi(t),i&8192){if(c=t.memoizedState!==null,(t.stateNode.isHidden=c)&&!u&&t.mode&1)for(we=t,u=t.child;u!==null;){for(f=we=u;we!==null;){switch(d=we,p=d.child,d.tag){case 0:case 11:case 14:case 15:wa(4,d,d.return);break;case 1:lo(d,d.return);var v=d.stateNode;if(typeof v.componentWillUnmount=="function"){i=d,n=d.return;try{e=i,v.props=e.memoizedProps,v.state=e.memoizedState,v.componentWillUnmount()}catch(S){Dt(i,n,S)}}break;case 5:lo(d,d.return);break;case 22:if(d.memoizedState!==null){lv(f);continue}}p!==null?(p.return=d,we=p):lv(f)}u=u.sibling}e:for(u=null,f=t;;){if(f.tag===5){if(u===null){u=f;try{r=f.stateNode,c?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(a=f.stateNode,l=f.memoizedProps.style,o=l!=null&&l.hasOwnProperty("display")?l.display:null,a.style.display=My("display",o))}catch(S){Dt(t,t.return,S)}}}else if(f.tag===6){if(u===null)try{f.stateNode.nodeValue=c?"":f.memoizedProps}catch(S){Dt(t,t.return,S)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;u===f&&(u=null),f=f.return}u===f&&(u=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:ti(e,t),xi(t),i&4&&ov(t);break;case 21:break;default:ti(e,t),xi(t)}}function xi(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(YS(n)){var i=n;break e}n=n.return}throw Error(oe(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Oa(r,""),i.flags&=-33);var s=sv(t);Ch(t,s,r);break;case 3:case 4:var o=i.stateNode.containerInfo,a=sv(t);Ah(t,a,o);break;default:throw Error(oe(161))}}catch(l){Dt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function $w(t,e,n){we=t,ZS(t)}function ZS(t,e,n){for(var i=(t.mode&1)!==0;we!==null;){var r=we,s=r.child;if(r.tag===22&&i){var o=r.memoizedState!==null||zl;if(!o){var a=r.alternate,l=a!==null&&a.memoizedState!==null||cn;a=zl;var c=cn;if(zl=o,(cn=l)&&!c)for(we=r;we!==null;)o=we,l=o.child,o.tag===22&&o.memoizedState!==null?cv(r):l!==null?(l.return=o,we=l):cv(r);for(;s!==null;)we=s,ZS(s),s=s.sibling;we=r,zl=a,cn=c}av(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,we=s):av(t)}}function av(t){for(;we!==null;){var e=we;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:cn||Xu(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!cn)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:oi(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&W0(e,s,i);break;case 3:var o=e.updateQueue;if(o!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}W0(e,o,n)}break;case 5:var a=e.stateNode;if(n===null&&e.flags&4){n=a;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var c=e.alternate;if(c!==null){var u=c.memoizedState;if(u!==null){var f=u.dehydrated;f!==null&&Va(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(oe(163))}cn||e.flags&512&&bh(e)}catch(d){Dt(e,e.return,d)}}if(e===t){we=null;break}if(n=e.sibling,n!==null){n.return=e.return,we=n;break}we=e.return}}function lv(t){for(;we!==null;){var e=we;if(e===t){we=null;break}var n=e.sibling;if(n!==null){n.return=e.return,we=n;break}we=e.return}}function cv(t){for(;we!==null;){var e=we;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{Xu(4,e)}catch(l){Dt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){Dt(e,r,l)}}var s=e.return;try{bh(e)}catch(l){Dt(e,s,l)}break;case 5:var o=e.return;try{bh(e)}catch(l){Dt(e,o,l)}}}catch(l){Dt(e,e.return,l)}if(e===t){we=null;break}var a=e.sibling;if(a!==null){a.return=e.return,we=a;break}we=e.return}}var Yw=Math.ceil,pu=or.ReactCurrentDispatcher,Am=or.ReactCurrentOwner,Zn=or.ReactCurrentBatchConfig,rt=0,$t=null,Bt=null,en=0,Nn=0,co=jr(0),Vt=0,Qa=null,Es=0,$u=0,Cm=0,ba=null,Sn=null,Rm=0,Do=1/0,Gi=null,mu=!1,Rh=null,Nr=null,Vl=!1,Tr=null,gu=0,Aa=0,Ph=null,Uc=-1,Fc=0;function xn(){return rt&6?Ot():Uc!==-1?Uc:Uc=Ot()}function Lr(t){return t.mode&1?rt&2&&en!==0?en&-en:Dw.transition!==null?(Fc===0&&(Fc=Uy()),Fc):(t=dt,t!==0||(t=window.event,t=t===void 0?16:Gy(t.type)),t):1}function fi(t,e,n,i){if(50<Aa)throw Aa=0,Ph=null,Error(oe(185));ul(t,n,i),(!(rt&2)||t!==$t)&&(t===$t&&(!(rt&2)&&($u|=n),Vt===4&&Sr(t,en)),bn(t,i),n===1&&rt===0&&!(e.mode&1)&&(Do=Ot()+500,Hu&&Wr()))}function bn(t,e){var n=t.callbackNode;DT(t,e);var i=Jc(t,t===$t?en:0);if(i===0)n!==null&&x0(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&x0(n),e===1)t.tag===0?Pw(uv.bind(null,t)):aS(uv.bind(null,t)),bw(function(){!(rt&6)&&Wr()}),n=null;else{switch(Fy(i)){case 1:n=tm;break;case 4:n=Ly;break;case 16:n=Qc;break;case 536870912:n=Iy;break;default:n=Qc}n=sM(n,QS.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function QS(t,e){if(Uc=-1,Fc=0,rt&6)throw Error(oe(327));var n=t.callbackNode;if(So()&&t.callbackNode!==n)return null;var i=Jc(t,t===$t?en:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=vu(t,i);else{e=i;var r=rt;rt|=2;var s=eM();($t!==t||en!==e)&&(Gi=null,Do=Ot()+500,ms(t,e));do try{Zw();break}catch(a){JS(t,a)}while(!0);pm(),pu.current=s,rt=r,Bt!==null?e=0:($t=null,en=0,e=Vt)}if(e!==0){if(e===2&&(r=ih(t),r!==0&&(i=r,e=Dh(t,r))),e===1)throw n=Qa,ms(t,0),Sr(t,i),bn(t,Ot()),n;if(e===6)Sr(t,i);else{if(r=t.current.alternate,!(i&30)&&!Kw(r)&&(e=vu(t,i),e===2&&(s=ih(t),s!==0&&(i=s,e=Dh(t,s))),e===1))throw n=Qa,ms(t,0),Sr(t,i),bn(t,Ot()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(oe(345));case 2:ts(t,Sn,Gi);break;case 3:if(Sr(t,i),(i&130023424)===i&&(e=Rm+500-Ot(),10<e)){if(Jc(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){xn(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=dh(ts.bind(null,t,Sn,Gi),e);break}ts(t,Sn,Gi);break;case 4:if(Sr(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var o=31-di(i);s=1<<o,o=e[o],o>r&&(r=o),i&=~s}if(i=r,i=Ot()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*Yw(i/1960))-i,10<i){t.timeoutHandle=dh(ts.bind(null,t,Sn,Gi),i);break}ts(t,Sn,Gi);break;case 5:ts(t,Sn,Gi);break;default:throw Error(oe(329))}}}return bn(t,Ot()),t.callbackNode===n?QS.bind(null,t):null}function Dh(t,e){var n=ba;return t.current.memoizedState.isDehydrated&&(ms(t,e).flags|=256),t=vu(t,e),t!==2&&(e=Sn,Sn=n,e!==null&&Nh(e)),t}function Nh(t){Sn===null?Sn=t:Sn.push.apply(Sn,t)}function Kw(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!pi(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Sr(t,e){for(e&=~Cm,e&=~$u,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-di(e),i=1<<n;t[n]=-1,e&=~i}}function uv(t){if(rt&6)throw Error(oe(327));So();var e=Jc(t,0);if(!(e&1))return bn(t,Ot()),null;var n=vu(t,e);if(t.tag!==0&&n===2){var i=ih(t);i!==0&&(e=i,n=Dh(t,i))}if(n===1)throw n=Qa,ms(t,0),Sr(t,e),bn(t,Ot()),n;if(n===6)throw Error(oe(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,ts(t,Sn,Gi),bn(t,Ot()),null}function Pm(t,e){var n=rt;rt|=1;try{return t(e)}finally{rt=n,rt===0&&(Do=Ot()+500,Hu&&Wr())}}function Ts(t){Tr!==null&&Tr.tag===0&&!(rt&6)&&So();var e=rt;rt|=1;var n=Zn.transition,i=dt;try{if(Zn.transition=null,dt=1,t)return t()}finally{dt=i,Zn.transition=n,rt=e,!(rt&6)&&Wr()}}function Dm(){Nn=co.current,Mt(co)}function ms(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,ww(n)),Bt!==null)for(n=Bt.return;n!==null;){var i=n;switch(dm(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&ru();break;case 3:Ro(),Mt(Tn),Mt(pn),ym();break;case 5:_m(i);break;case 4:Ro();break;case 13:Mt(wt);break;case 19:Mt(wt);break;case 10:mm(i.type._context);break;case 22:case 23:Dm()}n=n.return}if($t=t,Bt=t=Ir(t.current,null),en=Nn=e,Vt=0,Qa=null,Cm=$u=Es=0,Sn=ba=null,us!==null){for(e=0;e<us.length;e++)if(n=us[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var o=s.next;s.next=r,i.next=o}n.pending=i}us=null}return t}function JS(t,e){do{var n=Bt;try{if(pm(),Nc.current=hu,fu){for(var i=At.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}fu=!1}if(Ms=0,Xt=zt=At=null,Ta=!1,Ka=0,Am.current=null,n===null||n.return===null){Vt=1,Qa=e,Bt=null;break}e:{var s=t,o=n.return,a=n,l=e;if(e=en,a.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var c=l,u=a,f=u.tag;if(!(u.mode&1)&&(f===0||f===11||f===15)){var d=u.alternate;d?(u.updateQueue=d.updateQueue,u.memoizedState=d.memoizedState,u.lanes=d.lanes):(u.updateQueue=null,u.memoizedState=null)}var p=Z0(o);if(p!==null){p.flags&=-257,Q0(p,o,a,s,e),p.mode&1&&q0(s,c,e),e=p,l=c;var v=e.updateQueue;if(v===null){var S=new Set;S.add(l),e.updateQueue=S}else v.add(l);break e}else{if(!(e&1)){q0(s,c,e),Nm();break e}l=Error(oe(426))}}else if(Tt&&a.mode&1){var g=Z0(o);if(g!==null){!(g.flags&65536)&&(g.flags|=256),Q0(g,o,a,s,e),fm(Po(l,a));break e}}s=l=Po(l,a),Vt!==4&&(Vt=2),ba===null?ba=[s]:ba.push(s),s=o;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var h=FS(s,l,e);j0(s,h);break e;case 1:a=l;var m=s.type,_=s.stateNode;if(!(s.flags&128)&&(typeof m.getDerivedStateFromError=="function"||_!==null&&typeof _.componentDidCatch=="function"&&(Nr===null||!Nr.has(_)))){s.flags|=65536,e&=-e,s.lanes|=e;var M=OS(s,a,e);j0(s,M);break e}}s=s.return}while(s!==null)}nM(n)}catch(w){e=w,Bt===n&&n!==null&&(Bt=n=n.return);continue}break}while(!0)}function eM(){var t=pu.current;return pu.current=hu,t===null?hu:t}function Nm(){(Vt===0||Vt===3||Vt===2)&&(Vt=4),$t===null||!(Es&268435455)&&!($u&268435455)||Sr($t,en)}function vu(t,e){var n=rt;rt|=2;var i=eM();($t!==t||en!==e)&&(Gi=null,ms(t,e));do try{qw();break}catch(r){JS(t,r)}while(!0);if(pm(),rt=n,pu.current=i,Bt!==null)throw Error(oe(261));return $t=null,en=0,Vt}function qw(){for(;Bt!==null;)tM(Bt)}function Zw(){for(;Bt!==null&&!MT();)tM(Bt)}function tM(t){var e=rM(t.alternate,t,Nn);t.memoizedProps=t.pendingProps,e===null?nM(t):Bt=e,Am.current=null}function nM(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=jw(n,e),n!==null){n.flags&=32767,Bt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Vt=6,Bt=null;return}}else if(n=Hw(n,e,Nn),n!==null){Bt=n;return}if(e=e.sibling,e!==null){Bt=e;return}Bt=e=t}while(e!==null);Vt===0&&(Vt=5)}function ts(t,e,n){var i=dt,r=Zn.transition;try{Zn.transition=null,dt=1,Qw(t,e,n,i)}finally{Zn.transition=r,dt=i}return null}function Qw(t,e,n,i){do So();while(Tr!==null);if(rt&6)throw Error(oe(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(oe(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(NT(t,s),t===$t&&(Bt=$t=null,en=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||Vl||(Vl=!0,sM(Qc,function(){return So(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Zn.transition,Zn.transition=null;var o=dt;dt=1;var a=rt;rt|=4,Am.current=null,Xw(t,n),qS(n,t),xw(ch),eu=!!lh,ch=lh=null,t.current=n,$w(n),ET(),rt=a,dt=o,Zn.transition=s}else t.current=n;if(Vl&&(Vl=!1,Tr=t,gu=r),s=t.pendingLanes,s===0&&(Nr=null),bT(n.stateNode),bn(t,Ot()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(mu)throw mu=!1,t=Rh,Rh=null,t;return gu&1&&t.tag!==0&&So(),s=t.pendingLanes,s&1?t===Ph?Aa++:(Aa=0,Ph=t):Aa=0,Wr(),null}function So(){if(Tr!==null){var t=Fy(gu),e=Zn.transition,n=dt;try{if(Zn.transition=null,dt=16>t?16:t,Tr===null)var i=!1;else{if(t=Tr,Tr=null,gu=0,rt&6)throw Error(oe(331));var r=rt;for(rt|=4,we=t.current;we!==null;){var s=we,o=s.child;if(we.flags&16){var a=s.deletions;if(a!==null){for(var l=0;l<a.length;l++){var c=a[l];for(we=c;we!==null;){var u=we;switch(u.tag){case 0:case 11:case 15:wa(8,u,s)}var f=u.child;if(f!==null)f.return=u,we=f;else for(;we!==null;){u=we;var d=u.sibling,p=u.return;if($S(u),u===c){we=null;break}if(d!==null){d.return=p,we=d;break}we=p}}}var v=s.alternate;if(v!==null){var S=v.child;if(S!==null){v.child=null;do{var g=S.sibling;S.sibling=null,S=g}while(S!==null)}}we=s}}if(s.subtreeFlags&2064&&o!==null)o.return=s,we=o;else e:for(;we!==null;){if(s=we,s.flags&2048)switch(s.tag){case 0:case 11:case 15:wa(9,s,s.return)}var h=s.sibling;if(h!==null){h.return=s.return,we=h;break e}we=s.return}}var m=t.current;for(we=m;we!==null;){o=we;var _=o.child;if(o.subtreeFlags&2064&&_!==null)_.return=o,we=_;else e:for(o=m;we!==null;){if(a=we,a.flags&2048)try{switch(a.tag){case 0:case 11:case 15:Xu(9,a)}}catch(w){Dt(a,a.return,w)}if(a===o){we=null;break e}var M=a.sibling;if(M!==null){M.return=a.return,we=M;break e}we=a.return}}if(rt=r,Wr(),Ri&&typeof Ri.onPostCommitFiberRoot=="function")try{Ri.onPostCommitFiberRoot(ku,t)}catch{}i=!0}return i}finally{dt=n,Zn.transition=e}}return!1}function dv(t,e,n){e=Po(n,e),e=FS(t,e,1),t=Dr(t,e,1),e=xn(),t!==null&&(ul(t,1,e),bn(t,e))}function Dt(t,e,n){if(t.tag===3)dv(t,t,n);else for(;e!==null;){if(e.tag===3){dv(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Nr===null||!Nr.has(i))){t=Po(n,t),t=OS(e,t,1),e=Dr(e,t,1),t=xn(),e!==null&&(ul(e,1,t),bn(e,t));break}}e=e.return}}function Jw(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=xn(),t.pingedLanes|=t.suspendedLanes&n,$t===t&&(en&n)===n&&(Vt===4||Vt===3&&(en&130023424)===en&&500>Ot()-Rm?ms(t,0):Cm|=n),bn(t,e)}function iM(t,e){e===0&&(t.mode&1?(e=Dl,Dl<<=1,!(Dl&130023424)&&(Dl=4194304)):e=1);var n=xn();t=tr(t,e),t!==null&&(ul(t,e,n),bn(t,n))}function eb(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),iM(t,n)}function tb(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(oe(314))}i!==null&&i.delete(e),iM(t,n)}var rM;rM=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||Tn.current)En=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return En=!1,Gw(t,e,n);En=!!(t.flags&131072)}else En=!1,Tt&&e.flags&1048576&&lS(e,au,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;Ic(t,e),t=e.pendingProps;var r=bo(e,pn.current);yo(e,n),r=Mm(null,e,i,t,r,n);var s=Em();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,wn(i)?(s=!0,su(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,vm(e),r.updater=Wu,e.stateNode=r,r._reactInternals=e,xh(e,i,t,n),e=Sh(null,e,i,!0,s,n)):(e.tag=0,Tt&&s&&um(e),vn(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(Ic(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=ib(i),t=oi(i,t),r){case 0:e=yh(null,e,i,t,n);break e;case 1:e=tv(null,e,i,t,n);break e;case 11:e=J0(null,e,i,t,n);break e;case 14:e=ev(null,e,i,oi(i.type,t),n);break e}throw Error(oe(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:oi(i,r),yh(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:oi(i,r),tv(t,e,i,r,n);case 3:e:{if(VS(e),t===null)throw Error(oe(387));i=e.pendingProps,s=e.memoizedState,r=s.element,pS(t,e),uu(e,i,null,n);var o=e.memoizedState;if(i=o.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:o.cache,pendingSuspenseBoundaries:o.pendingSuspenseBoundaries,transitions:o.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Po(Error(oe(423)),e),e=nv(t,e,i,n,r);break e}else if(i!==r){r=Po(Error(oe(424)),e),e=nv(t,e,i,n,r);break e}else for(In=Pr(e.stateNode.containerInfo.firstChild),Un=e,Tt=!0,li=null,n=fS(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ao(),i===r){e=nr(t,e,n);break e}vn(t,e,i,n)}e=e.child}return e;case 5:return mS(e),t===null&&mh(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,o=r.children,uh(i,r)?o=null:s!==null&&uh(i,s)&&(e.flags|=32),zS(t,e),vn(t,e,o,n),e.child;case 6:return t===null&&mh(e),null;case 13:return GS(t,e,n);case 4:return xm(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Co(e,null,i,n):vn(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:oi(i,r),J0(t,e,i,r,n);case 7:return vn(t,e,e.pendingProps,n),e.child;case 8:return vn(t,e,e.pendingProps.children,n),e.child;case 12:return vn(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,o=r.value,yt(lu,i._currentValue),i._currentValue=o,s!==null)if(pi(s.value,o)){if(s.children===r.children&&!Tn.current){e=nr(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var a=s.dependencies;if(a!==null){o=s.child;for(var l=a.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=$i(-1,n&-n),l.tag=2;var c=s.updateQueue;if(c!==null){c=c.shared;var u=c.pending;u===null?l.next=l:(l.next=u.next,u.next=l),c.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),gh(s.return,n,e),a.lanes|=n;break}l=l.next}}else if(s.tag===10)o=s.type===e.type?null:s.child;else if(s.tag===18){if(o=s.return,o===null)throw Error(oe(341));o.lanes|=n,a=o.alternate,a!==null&&(a.lanes|=n),gh(o,n,e),o=s.sibling}else o=s.child;if(o!==null)o.return=s;else for(o=s;o!==null;){if(o===e){o=null;break}if(s=o.sibling,s!==null){s.return=o.return,o=s;break}o=o.return}s=o}vn(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,yo(e,n),r=Qn(r),i=i(r),e.flags|=1,vn(t,e,i,n),e.child;case 14:return i=e.type,r=oi(i,e.pendingProps),r=oi(i.type,r),ev(t,e,i,r,n);case 15:return kS(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:oi(i,r),Ic(t,e),e.tag=1,wn(i)?(t=!0,su(e)):t=!1,yo(e,n),US(e,i,r),xh(e,i,r,n),Sh(null,e,i,!0,t,n);case 19:return HS(t,e,n);case 22:return BS(t,e,n)}throw Error(oe(156,e.tag))};function sM(t,e){return Ny(t,e)}function nb(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function qn(t,e,n,i){return new nb(t,e,n,i)}function Lm(t){return t=t.prototype,!(!t||!t.isReactComponent)}function ib(t){if(typeof t=="function")return Lm(t)?1:0;if(t!=null){if(t=t.$$typeof,t===Qp)return 11;if(t===Jp)return 14}return 2}function Ir(t,e){var n=t.alternate;return n===null?(n=qn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function Oc(t,e,n,i,r,s){var o=2;if(i=t,typeof t=="function")Lm(t)&&(o=1);else if(typeof t=="string")o=5;else e:switch(t){case Js:return gs(n.children,r,s,e);case Zp:o=8,r|=8;break;case Gf:return t=qn(12,n,e,r|2),t.elementType=Gf,t.lanes=s,t;case Hf:return t=qn(13,n,e,r),t.elementType=Hf,t.lanes=s,t;case jf:return t=qn(19,n,e,r),t.elementType=jf,t.lanes=s,t;case my:return Yu(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case hy:o=10;break e;case py:o=9;break e;case Qp:o=11;break e;case Jp:o=14;break e;case xr:o=16,i=null;break e}throw Error(oe(130,t==null?t:typeof t,""))}return e=qn(o,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function gs(t,e,n,i){return t=qn(7,t,i,e),t.lanes=n,t}function Yu(t,e,n,i){return t=qn(22,t,i,e),t.elementType=my,t.lanes=n,t.stateNode={isHidden:!1},t}function Fd(t,e,n){return t=qn(6,t,null,e),t.lanes=n,t}function Od(t,e,n){return e=qn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function rb(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=vd(0),this.expirationTimes=vd(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=vd(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Im(t,e,n,i,r,s,o,a,l){return t=new rb(t,e,n,a,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=qn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},vm(s),t}function sb(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:Qs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function oM(t){if(!t)return Or;t=t._reactInternals;e:{if(Cs(t)!==t||t.tag!==1)throw Error(oe(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(wn(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(oe(171))}if(t.tag===1){var n=t.type;if(wn(n))return oS(t,n,e)}return e}function aM(t,e,n,i,r,s,o,a,l){return t=Im(n,i,!0,t,r,s,o,a,l),t.context=oM(null),n=t.current,i=xn(),r=Lr(n),s=$i(i,r),s.callback=e??null,Dr(n,s,r),t.current.lanes=r,ul(t,r,i),bn(t,i),t}function Ku(t,e,n,i){var r=e.current,s=xn(),o=Lr(r);return n=oM(n),e.context===null?e.context=n:e.pendingContext=n,e=$i(s,o),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Dr(r,e,o),t!==null&&(fi(t,r,o,s),Dc(t,r,o)),o}function xu(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function fv(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Um(t,e){fv(t,e),(t=t.alternate)&&fv(t,e)}function ob(){return null}var lM=typeof reportError=="function"?reportError:function(t){console.error(t)};function Fm(t){this._internalRoot=t}qu.prototype.render=Fm.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(oe(409));Ku(t,e,null,null)};qu.prototype.unmount=Fm.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Ts(function(){Ku(null,t,null,null)}),e[er]=null}};function qu(t){this._internalRoot=t}qu.prototype.unstable_scheduleHydration=function(t){if(t){var e=By();t={blockedOn:null,target:t,priority:e};for(var n=0;n<yr.length&&e!==0&&e<yr[n].priority;n++);yr.splice(n,0,t),n===0&&Vy(t)}};function Om(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function Zu(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function hv(){}function ab(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var c=xu(o);s.call(c)}}var o=aM(e,i,t,0,null,!1,!1,"",hv);return t._reactRootContainer=o,t[er]=o.current,ja(t.nodeType===8?t.parentNode:t),Ts(),o}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var a=i;i=function(){var c=xu(l);a.call(c)}}var l=Im(t,0,!1,null,null,!1,!1,"",hv);return t._reactRootContainer=l,t[er]=l.current,ja(t.nodeType===8?t.parentNode:t),Ts(function(){Ku(e,l,n,i)}),l}function Qu(t,e,n,i,r){var s=n._reactRootContainer;if(s){var o=s;if(typeof r=="function"){var a=r;r=function(){var l=xu(o);a.call(l)}}Ku(e,o,t,r)}else o=ab(n,e,t,r,i);return xu(o)}Oy=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=da(e.pendingLanes);n!==0&&(nm(e,n|1),bn(e,Ot()),!(rt&6)&&(Do=Ot()+500,Wr()))}break;case 13:Ts(function(){var i=tr(t,1);if(i!==null){var r=xn();fi(i,t,1,r)}}),Um(t,1)}};im=function(t){if(t.tag===13){var e=tr(t,134217728);if(e!==null){var n=xn();fi(e,t,134217728,n)}Um(t,134217728)}};ky=function(t){if(t.tag===13){var e=Lr(t),n=tr(t,e);if(n!==null){var i=xn();fi(n,t,e,i)}Um(t,e)}};By=function(){return dt};zy=function(t,e){var n=dt;try{return dt=t,e()}finally{dt=n}};eh=function(t,e,n){switch(e){case"input":if($f(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Gu(i);if(!r)throw Error(oe(90));vy(i),$f(i,r)}}}break;case"textarea":_y(t,n);break;case"select":e=n.value,e!=null&&go(t,!!n.multiple,e,!1)}};by=Pm;Ay=Ts;var lb={usingClientEntryPoint:!1,Events:[fl,io,Gu,Ty,wy,Pm]},ea={findFiberByHostInstance:cs,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},cb={bundleType:ea.bundleType,version:ea.version,rendererPackageName:ea.rendererPackageName,rendererConfig:ea.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:or.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Py(t),t===null?null:t.stateNode},findFiberByHostInstance:ea.findFiberByHostInstance||ob,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Gl=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Gl.isDisabled&&Gl.supportsFiber)try{ku=Gl.inject(cb),Ri=Gl}catch{}}Bn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=lb;Bn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Om(e))throw Error(oe(200));return sb(t,e,null,n)};Bn.createRoot=function(t,e){if(!Om(t))throw Error(oe(299));var n=!1,i="",r=lM;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Im(t,1,!1,null,null,n,!1,i,r),t[er]=e.current,ja(t.nodeType===8?t.parentNode:t),new Fm(e)};Bn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(oe(188)):(t=Object.keys(t).join(","),Error(oe(268,t)));return t=Py(e),t=t===null?null:t.stateNode,t};Bn.flushSync=function(t){return Ts(t)};Bn.hydrate=function(t,e,n){if(!Zu(e))throw Error(oe(200));return Qu(null,t,e,!0,n)};Bn.hydrateRoot=function(t,e,n){if(!Om(t))throw Error(oe(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",o=lM;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(o=n.onRecoverableError)),e=aM(e,null,t,1,n??null,r,!1,s,o),t[er]=e.current,ja(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new qu(e)};Bn.render=function(t,e,n){if(!Zu(e))throw Error(oe(200));return Qu(null,t,e,!1,n)};Bn.unmountComponentAtNode=function(t){if(!Zu(t))throw Error(oe(40));return t._reactRootContainer?(Ts(function(){Qu(null,null,t,!1,function(){t._reactRootContainer=null,t[er]=null})}),!0):!1};Bn.unstable_batchedUpdates=Pm;Bn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!Zu(n))throw Error(oe(200));if(t==null||t._reactInternals===void 0)throw Error(oe(38));return Qu(t,e,n,!1,i)};Bn.version="18.3.1-next-f1338f8080-20240426";function cM(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(cM)}catch(t){console.error(t)}}cM(),cy.exports=Bn;var ub=cy.exports,pv=ub;zf.createRoot=pv.createRoot,zf.hydrateRoot=pv.hydrateRoot;const km=G.createContext({});function Bm(t){const e=G.useRef(null);return e.current===null&&(e.current=t()),e.current}const Ju=G.createContext(null),zm=G.createContext({transformPagePoint:t=>t,isStatic:!1,reducedMotion:"never"});class db extends G.Component{getSnapshotBeforeUpdate(e){const n=this.props.childRef.current;if(n&&e.isPresent&&!this.props.isPresent){const i=this.props.sizeRef.current;i.height=n.offsetHeight||0,i.width=n.offsetWidth||0,i.top=n.offsetTop,i.left=n.offsetLeft}return null}componentDidUpdate(){}render(){return this.props.children}}function fb({children:t,isPresent:e}){const n=G.useId(),i=G.useRef(null),r=G.useRef({width:0,height:0,top:0,left:0}),{nonce:s}=G.useContext(zm);return G.useInsertionEffect(()=>{const{width:o,height:a,top:l,left:c}=r.current;if(e||!i.current||!o||!a)return;i.current.dataset.motionPopId=n;const u=document.createElement("style");return s&&(u.nonce=s),document.head.appendChild(u),u.sheet&&u.sheet.insertRule(`
          [data-motion-pop-id="${n}"] {
            position: absolute !important;
            width: ${o}px !important;
            height: ${a}px !important;
            top: ${l}px !important;
            left: ${c}px !important;
          }
        `),()=>{document.head.removeChild(u)}},[e]),x.jsx(db,{isPresent:e,childRef:i,sizeRef:r,children:G.cloneElement(t,{ref:i})})}const hb=({children:t,initial:e,isPresent:n,onExitComplete:i,custom:r,presenceAffectsLayout:s,mode:o})=>{const a=Bm(pb),l=G.useId(),c=G.useCallback(f=>{a.set(f,!0);for(const d of a.values())if(!d)return;i&&i()},[a,i]),u=G.useMemo(()=>({id:l,initial:e,isPresent:n,custom:r,onExitComplete:c,register:f=>(a.set(f,!1),()=>a.delete(f))}),s?[Math.random(),c]:[n,c]);return G.useMemo(()=>{a.forEach((f,d)=>a.set(d,!1))},[n]),G.useEffect(()=>{!n&&!a.size&&i&&i()},[n]),o==="popLayout"&&(t=x.jsx(fb,{isPresent:n,children:t})),x.jsx(Ju.Provider,{value:u,children:t})};function pb(){return new Map}function uM(t=!0){const e=G.useContext(Ju);if(e===null)return[!0,null];const{isPresent:n,onExitComplete:i,register:r}=e,s=G.useId();G.useEffect(()=>{t&&r(s)},[t]);const o=G.useCallback(()=>t&&i&&i(s),[s,i,t]);return!n&&i?[!1,o]:[!0]}const Hl=t=>t.key||"";function mv(t){const e=[];return G.Children.forEach(t,n=>{G.isValidElement(n)&&e.push(n)}),e}const Vm=typeof window<"u",dM=Vm?G.useLayoutEffect:G.useEffect,Ur=({children:t,custom:e,initial:n=!0,onExitComplete:i,presenceAffectsLayout:r=!0,mode:s="sync",propagate:o=!1})=>{const[a,l]=uM(o),c=G.useMemo(()=>mv(t),[t]),u=o&&!a?[]:c.map(Hl),f=G.useRef(!0),d=G.useRef(c),p=Bm(()=>new Map),[v,S]=G.useState(c),[g,h]=G.useState(c);dM(()=>{f.current=!1,d.current=c;for(let M=0;M<g.length;M++){const w=Hl(g[M]);u.includes(w)?p.delete(w):p.get(w)!==!0&&p.set(w,!1)}},[g,u.length,u.join("-")]);const m=[];if(c!==v){let M=[...c];for(let w=0;w<g.length;w++){const T=g[w],R=Hl(T);u.includes(R)||(M.splice(w,0,T),m.push(T))}s==="wait"&&m.length&&(M=m),h(mv(M)),S(c);return}const{forceRender:_}=G.useContext(km);return x.jsx(x.Fragment,{children:g.map(M=>{const w=Hl(M),T=o&&!a?!1:c===g||u.includes(w),R=()=>{if(p.has(w))p.set(w,!0);else return;let y=!0;p.forEach(C=>{C||(y=!1)}),y&&(_==null||_(),h(d.current),o&&(l==null||l()),i&&i())};return x.jsx(hb,{isPresent:T,initial:!f.current||n?void 0:!1,custom:T?void 0:e,presenceAffectsLayout:r,mode:s,onExitComplete:T?void 0:R,children:M},w)})})},Fn=t=>t;let fM=Fn;function Gm(t){let e;return()=>(e===void 0&&(e=t()),e)}const No=(t,e,n)=>{const i=e-t;return i===0?1:(n-t)/i},Yi=t=>t*1e3,Ki=t=>t/1e3,mb={useManualTiming:!1};function gb(t){let e=new Set,n=new Set,i=!1,r=!1;const s=new WeakSet;let o={delta:0,timestamp:0,isProcessing:!1};function a(c){s.has(c)&&(l.schedule(c),t()),c(o)}const l={schedule:(c,u=!1,f=!1)=>{const p=f&&i?e:n;return u&&s.add(c),p.has(c)||p.add(c),c},cancel:c=>{n.delete(c),s.delete(c)},process:c=>{if(o=c,i){r=!0;return}i=!0,[e,n]=[n,e],e.forEach(a),e.clear(),i=!1,r&&(r=!1,l.process(c))}};return l}const jl=["read","resolveKeyframes","update","preRender","render","postRender"],vb=40;function hM(t,e){let n=!1,i=!0;const r={delta:0,timestamp:0,isProcessing:!1},s=()=>n=!0,o=jl.reduce((h,m)=>(h[m]=gb(s),h),{}),{read:a,resolveKeyframes:l,update:c,preRender:u,render:f,postRender:d}=o,p=()=>{const h=performance.now();n=!1,r.delta=i?1e3/60:Math.max(Math.min(h-r.timestamp,vb),1),r.timestamp=h,r.isProcessing=!0,a.process(r),l.process(r),c.process(r),u.process(r),f.process(r),d.process(r),r.isProcessing=!1,n&&e&&(i=!1,t(p))},v=()=>{n=!0,i=!0,r.isProcessing||t(p)};return{schedule:jl.reduce((h,m)=>{const _=o[m];return h[m]=(M,w=!1,T=!1)=>(n||v(),_.schedule(M,w,T)),h},{}),cancel:h=>{for(let m=0;m<jl.length;m++)o[jl[m]].cancel(h)},state:r,steps:o}}const{schedule:Et,cancel:kr,state:Qt,steps:kd}=hM(typeof requestAnimationFrame<"u"?requestAnimationFrame:Fn,!0),pM=G.createContext({strict:!1}),gv={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]},Lo={};for(const t in gv)Lo[t]={isEnabled:e=>gv[t].some(n=>!!e[n])};function xb(t){for(const e in t)Lo[e]={...Lo[e],...t[e]}}const _b=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","ignoreStrict","viewport"]);function _u(t){return t.startsWith("while")||t.startsWith("drag")&&t!=="draggable"||t.startsWith("layout")||t.startsWith("onTap")||t.startsWith("onPan")||t.startsWith("onLayout")||_b.has(t)}let mM=t=>!_u(t);function yb(t){t&&(mM=e=>e.startsWith("on")?!_u(e):t(e))}try{yb(require("@emotion/is-prop-valid").default)}catch{}function Sb(t,e,n){const i={};for(const r in t)r==="values"&&typeof t.values=="object"||(mM(r)||n===!0&&_u(r)||!e&&!_u(r)||t.draggable&&r.startsWith("onDrag"))&&(i[r]=t[r]);return i}function Mb(t){if(typeof Proxy>"u")return t;const e=new Map,n=(...i)=>t(...i);return new Proxy(n,{get:(i,r)=>r==="create"?t:(e.has(r)||e.set(r,t(r)),e.get(r))})}const ed=G.createContext({});function Ja(t){return typeof t=="string"||Array.isArray(t)}function td(t){return t!==null&&typeof t=="object"&&typeof t.start=="function"}const Hm=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],jm=["initial",...Hm];function nd(t){return td(t.animate)||jm.some(e=>Ja(t[e]))}function gM(t){return!!(nd(t)||t.variants)}function Eb(t,e){if(nd(t)){const{initial:n,animate:i}=t;return{initial:n===!1||Ja(n)?n:void 0,animate:Ja(i)?i:void 0}}return t.inherit!==!1?e:{}}function Tb(t){const{initial:e,animate:n}=Eb(t,G.useContext(ed));return G.useMemo(()=>({initial:e,animate:n}),[vv(e),vv(n)])}function vv(t){return Array.isArray(t)?t.join(" "):t}const wb=Symbol.for("motionComponentSymbol");function uo(t){return t&&typeof t=="object"&&Object.prototype.hasOwnProperty.call(t,"current")}function bb(t,e,n){return G.useCallback(i=>{i&&t.onMount&&t.onMount(i),e&&(i?e.mount(i):e.unmount()),n&&(typeof n=="function"?n(i):uo(n)&&(n.current=i))},[e])}const Wm=t=>t.replace(/([a-z])([A-Z])/gu,"$1-$2").toLowerCase(),Ab="framerAppearId",vM="data-"+Wm(Ab),{schedule:Xm}=hM(queueMicrotask,!1),xM=G.createContext({});function Cb(t,e,n,i,r){var s,o;const{visualElement:a}=G.useContext(ed),l=G.useContext(pM),c=G.useContext(Ju),u=G.useContext(zm).reducedMotion,f=G.useRef(null);i=i||l.renderer,!f.current&&i&&(f.current=i(t,{visualState:e,parent:a,props:n,presenceContext:c,blockInitialAnimation:c?c.initial===!1:!1,reducedMotionConfig:u}));const d=f.current,p=G.useContext(xM);d&&!d.projection&&r&&(d.type==="html"||d.type==="svg")&&Rb(f.current,n,r,p);const v=G.useRef(!1);G.useInsertionEffect(()=>{d&&v.current&&d.update(n,c)});const S=n[vM],g=G.useRef(!!S&&!(!((s=window.MotionHandoffIsComplete)===null||s===void 0)&&s.call(window,S))&&((o=window.MotionHasOptimisedAnimation)===null||o===void 0?void 0:o.call(window,S)));return dM(()=>{d&&(v.current=!0,window.MotionIsMounted=!0,d.updateFeatures(),Xm.render(d.render),g.current&&d.animationState&&d.animationState.animateChanges())}),G.useEffect(()=>{d&&(!g.current&&d.animationState&&d.animationState.animateChanges(),g.current&&(queueMicrotask(()=>{var h;(h=window.MotionHandoffMarkAsComplete)===null||h===void 0||h.call(window,S)}),g.current=!1))}),d}function Rb(t,e,n,i){const{layoutId:r,layout:s,drag:o,dragConstraints:a,layoutScroll:l,layoutRoot:c}=e;t.projection=new n(t.latestValues,e["data-framer-portal-id"]?void 0:_M(t.parent)),t.projection.setOptions({layoutId:r,layout:s,alwaysMeasureLayout:!!o||a&&uo(a),visualElement:t,animationType:typeof s=="string"?s:"both",initialPromotionConfig:i,layoutScroll:l,layoutRoot:c})}function _M(t){if(t)return t.options.allowProjection!==!1?t.projection:_M(t.parent)}function Pb({preloadedFeatures:t,createVisualElement:e,useRender:n,useVisualState:i,Component:r}){var s,o;t&&xb(t);function a(c,u){let f;const d={...G.useContext(zm),...c,layoutId:Db(c)},{isStatic:p}=d,v=Tb(c),S=i(c,p);if(!p&&Vm){Nb();const g=Lb(d);f=g.MeasureLayout,v.visualElement=Cb(r,S,d,e,g.ProjectionNode)}return x.jsxs(ed.Provider,{value:v,children:[f&&v.visualElement?x.jsx(f,{visualElement:v.visualElement,...d}):null,n(r,c,bb(S,v.visualElement,u),S,p,v.visualElement)]})}a.displayName=`motion.${typeof r=="string"?r:`create(${(o=(s=r.displayName)!==null&&s!==void 0?s:r.name)!==null&&o!==void 0?o:""})`}`;const l=G.forwardRef(a);return l[wb]=r,l}function Db({layoutId:t}){const e=G.useContext(km).id;return e&&t!==void 0?e+"-"+t:t}function Nb(t,e){G.useContext(pM).strict}function Lb(t){const{drag:e,layout:n}=Lo;if(!e&&!n)return{};const i={...e,...n};return{MeasureLayout:e!=null&&e.isEnabled(t)||n!=null&&n.isEnabled(t)?i.MeasureLayout:void 0,ProjectionNode:i.ProjectionNode}}const Ib=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function $m(t){return typeof t!="string"||t.includes("-")?!1:!!(Ib.indexOf(t)>-1||/[A-Z]/u.test(t))}function xv(t){const e=[{},{}];return t==null||t.values.forEach((n,i)=>{e[0][i]=n.get(),e[1][i]=n.getVelocity()}),e}function Ym(t,e,n,i){if(typeof e=="function"){const[r,s]=xv(i);e=e(n!==void 0?n:t.custom,r,s)}if(typeof e=="string"&&(e=t.variants&&t.variants[e]),typeof e=="function"){const[r,s]=xv(i);e=e(n!==void 0?n:t.custom,r,s)}return e}const Lh=t=>Array.isArray(t),Ub=t=>!!(t&&typeof t=="object"&&t.mix&&t.toValue),Fb=t=>Lh(t)?t[t.length-1]||0:t,un=t=>!!(t&&t.getVelocity);function kc(t){const e=un(t)?t.get():t;return Ub(e)?e.toValue():e}function Ob({scrapeMotionValuesFromProps:t,createRenderState:e,onUpdate:n},i,r,s){const o={latestValues:kb(i,r,s,t),renderState:e()};return n&&(o.onMount=a=>n({props:i,current:a,...o}),o.onUpdate=a=>n(a)),o}const yM=t=>(e,n)=>{const i=G.useContext(ed),r=G.useContext(Ju),s=()=>Ob(t,e,i,r);return n?s():Bm(s)};function kb(t,e,n,i){const r={},s=i(t,{});for(const d in s)r[d]=kc(s[d]);let{initial:o,animate:a}=t;const l=nd(t),c=gM(t);e&&c&&!l&&t.inherit!==!1&&(o===void 0&&(o=e.initial),a===void 0&&(a=e.animate));let u=n?n.initial===!1:!1;u=u||o===!1;const f=u?a:o;if(f&&typeof f!="boolean"&&!td(f)){const d=Array.isArray(f)?f:[f];for(let p=0;p<d.length;p++){const v=Ym(t,d[p]);if(v){const{transitionEnd:S,transition:g,...h}=v;for(const m in h){let _=h[m];if(Array.isArray(_)){const M=u?_.length-1:0;_=_[M]}_!==null&&(r[m]=_)}for(const m in S)r[m]=S[m]}}}return r}const Go=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],Rs=new Set(Go),SM=t=>e=>typeof e=="string"&&e.startsWith(t),MM=SM("--"),Bb=SM("var(--"),Km=t=>Bb(t)?zb.test(t.split("/*")[0].trim()):!1,zb=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,EM=(t,e)=>e&&typeof t=="number"?e.transform(t):t,ir=(t,e,n)=>n>e?e:n<t?t:n,Ho={test:t=>typeof t=="number",parse:parseFloat,transform:t=>t},el={...Ho,transform:t=>ir(0,1,t)},Wl={...Ho,default:1},pl=t=>({test:e=>typeof e=="string"&&e.endsWith(t)&&e.split(" ").length===1,parse:parseFloat,transform:e=>`${e}${t}`}),vr=pl("deg"),Di=pl("%"),Ue=pl("px"),Vb=pl("vh"),Gb=pl("vw"),_v={...Di,parse:t=>Di.parse(t)/100,transform:t=>Di.transform(t*100)},Hb={borderWidth:Ue,borderTopWidth:Ue,borderRightWidth:Ue,borderBottomWidth:Ue,borderLeftWidth:Ue,borderRadius:Ue,radius:Ue,borderTopLeftRadius:Ue,borderTopRightRadius:Ue,borderBottomRightRadius:Ue,borderBottomLeftRadius:Ue,width:Ue,maxWidth:Ue,height:Ue,maxHeight:Ue,top:Ue,right:Ue,bottom:Ue,left:Ue,padding:Ue,paddingTop:Ue,paddingRight:Ue,paddingBottom:Ue,paddingLeft:Ue,margin:Ue,marginTop:Ue,marginRight:Ue,marginBottom:Ue,marginLeft:Ue,backgroundPositionX:Ue,backgroundPositionY:Ue},jb={rotate:vr,rotateX:vr,rotateY:vr,rotateZ:vr,scale:Wl,scaleX:Wl,scaleY:Wl,scaleZ:Wl,skew:vr,skewX:vr,skewY:vr,distance:Ue,translateX:Ue,translateY:Ue,translateZ:Ue,x:Ue,y:Ue,z:Ue,perspective:Ue,transformPerspective:Ue,opacity:el,originX:_v,originY:_v,originZ:Ue},yv={...Ho,transform:Math.round},qm={...Hb,...jb,zIndex:yv,size:Ue,fillOpacity:el,strokeOpacity:el,numOctaves:yv},Wb={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},Xb=Go.length;function $b(t,e,n){let i="",r=!0;for(let s=0;s<Xb;s++){const o=Go[s],a=t[o];if(a===void 0)continue;let l=!0;if(typeof a=="number"?l=a===(o.startsWith("scale")?1:0):l=parseFloat(a)===0,!l||n){const c=EM(a,qm[o]);if(!l){r=!1;const u=Wb[o]||o;i+=`${u}(${c}) `}n&&(e[o]=c)}}return i=i.trim(),n?i=n(e,r?"":i):r&&(i="none"),i}function Zm(t,e,n){const{style:i,vars:r,transformOrigin:s}=t;let o=!1,a=!1;for(const l in e){const c=e[l];if(Rs.has(l)){o=!0;continue}else if(MM(l)){r[l]=c;continue}else{const u=EM(c,qm[l]);l.startsWith("origin")?(a=!0,s[l]=u):i[l]=u}}if(e.transform||(o||n?i.transform=$b(e,t.transform,n):i.transform&&(i.transform="none")),a){const{originX:l="50%",originY:c="50%",originZ:u=0}=s;i.transformOrigin=`${l} ${c} ${u}`}}const Yb={offset:"stroke-dashoffset",array:"stroke-dasharray"},Kb={offset:"strokeDashoffset",array:"strokeDasharray"};function qb(t,e,n=1,i=0,r=!0){t.pathLength=1;const s=r?Yb:Kb;t[s.offset]=Ue.transform(-i);const o=Ue.transform(e),a=Ue.transform(n);t[s.array]=`${o} ${a}`}function Sv(t,e,n){return typeof t=="string"?t:Ue.transform(e+n*t)}function Zb(t,e,n){const i=Sv(e,t.x,t.width),r=Sv(n,t.y,t.height);return`${i} ${r}`}function Qm(t,{attrX:e,attrY:n,attrScale:i,originX:r,originY:s,pathLength:o,pathSpacing:a=1,pathOffset:l=0,...c},u,f){if(Zm(t,c,f),u){t.style.viewBox&&(t.attrs.viewBox=t.style.viewBox);return}t.attrs=t.style,t.style={};const{attrs:d,style:p,dimensions:v}=t;d.transform&&(v&&(p.transform=d.transform),delete d.transform),v&&(r!==void 0||s!==void 0||p.transform)&&(p.transformOrigin=Zb(v,r!==void 0?r:.5,s!==void 0?s:.5)),e!==void 0&&(d.x=e),n!==void 0&&(d.y=n),i!==void 0&&(d.scale=i),o!==void 0&&qb(d,o,a,l,!1)}const Jm=()=>({style:{},transform:{},transformOrigin:{},vars:{}}),TM=()=>({...Jm(),attrs:{}}),eg=t=>typeof t=="string"&&t.toLowerCase()==="svg";function wM(t,{style:e,vars:n},i,r){Object.assign(t.style,e,r&&r.getProjectionStyles(i));for(const s in n)t.style.setProperty(s,n[s])}const bM=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]);function AM(t,e,n,i){wM(t,e,void 0,i);for(const r in e.attrs)t.setAttribute(bM.has(r)?r:Wm(r),e.attrs[r])}const yu={};function Qb(t){Object.assign(yu,t)}function CM(t,{layout:e,layoutId:n}){return Rs.has(t)||t.startsWith("origin")||(e||n!==void 0)&&(!!yu[t]||t==="opacity")}function tg(t,e,n){var i;const{style:r}=t,s={};for(const o in r)(un(r[o])||e.style&&un(e.style[o])||CM(o,t)||((i=n==null?void 0:n.getValue(o))===null||i===void 0?void 0:i.liveStyle)!==void 0)&&(s[o]=r[o]);return s}function RM(t,e,n){const i=tg(t,e,n);for(const r in t)if(un(t[r])||un(e[r])){const s=Go.indexOf(r)!==-1?"attr"+r.charAt(0).toUpperCase()+r.substring(1):r;i[s]=t[r]}return i}function Jb(t,e){try{e.dimensions=typeof t.getBBox=="function"?t.getBBox():t.getBoundingClientRect()}catch{e.dimensions={x:0,y:0,width:0,height:0}}}const Mv=["x","y","width","height","cx","cy","r"],eA={useVisualState:yM({scrapeMotionValuesFromProps:RM,createRenderState:TM,onUpdate:({props:t,prevProps:e,current:n,renderState:i,latestValues:r})=>{if(!n)return;let s=!!t.drag;if(!s){for(const a in r)if(Rs.has(a)){s=!0;break}}if(!s)return;let o=!e;if(e)for(let a=0;a<Mv.length;a++){const l=Mv[a];t[l]!==e[l]&&(o=!0)}o&&Et.read(()=>{Jb(n,i),Et.render(()=>{Qm(i,r,eg(n.tagName),t.transformTemplate),AM(n,i)})})}})},tA={useVisualState:yM({scrapeMotionValuesFromProps:tg,createRenderState:Jm})};function PM(t,e,n){for(const i in e)!un(e[i])&&!CM(i,n)&&(t[i]=e[i])}function nA({transformTemplate:t},e){return G.useMemo(()=>{const n=Jm();return Zm(n,e,t),Object.assign({},n.vars,n.style)},[e])}function iA(t,e){const n=t.style||{},i={};return PM(i,n,t),Object.assign(i,nA(t,e)),i}function rA(t,e){const n={},i=iA(t,e);return t.drag&&t.dragListener!==!1&&(n.draggable=!1,i.userSelect=i.WebkitUserSelect=i.WebkitTouchCallout="none",i.touchAction=t.drag===!0?"none":`pan-${t.drag==="x"?"y":"x"}`),t.tabIndex===void 0&&(t.onTap||t.onTapStart||t.whileTap)&&(n.tabIndex=0),n.style=i,n}function sA(t,e,n,i){const r=G.useMemo(()=>{const s=TM();return Qm(s,e,eg(i),t.transformTemplate),{...s.attrs,style:{...s.style}}},[e]);if(t.style){const s={};PM(s,t.style,t),r.style={...s,...r.style}}return r}function oA(t=!1){return(n,i,r,{latestValues:s},o)=>{const l=($m(n)?sA:rA)(i,s,o,n),c=Sb(i,typeof n=="string",t),u=n!==G.Fragment?{...c,...l,ref:r}:{},{children:f}=i,d=G.useMemo(()=>un(f)?f.get():f,[f]);return G.createElement(n,{...u,children:d})}}function aA(t,e){return function(i,{forwardMotionProps:r}={forwardMotionProps:!1}){const o={...$m(i)?eA:tA,preloadedFeatures:t,useRender:oA(r),createVisualElement:e,Component:i};return Pb(o)}}function DM(t,e){if(!Array.isArray(e))return!1;const n=e.length;if(n!==t.length)return!1;for(let i=0;i<n;i++)if(e[i]!==t[i])return!1;return!0}function id(t,e,n){const i=t.getProps();return Ym(i,e,n!==void 0?n:i.custom,t)}const lA=Gm(()=>window.ScrollTimeline!==void 0);class cA{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>"finished"in e?e.finished:e))}getAll(e){return this.animations[0][e]}setAll(e,n){for(let i=0;i<this.animations.length;i++)this.animations[i][e]=n}attachTimeline(e,n){const i=this.animations.map(r=>{if(lA()&&r.attachTimeline)return r.attachTimeline(e);if(typeof n=="function")return n(r)});return()=>{i.forEach((r,s)=>{r&&r(),this.animations[s].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get startTime(){return this.getAll("startTime")}get duration(){let e=0;for(let n=0;n<this.animations.length;n++)e=Math.max(e,this.animations[n].duration);return e}runAll(e){this.animations.forEach(n=>n[e]())}flatten(){this.runAll("flatten")}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}class uA extends cA{then(e,n){return Promise.all(this.animations).then(e).catch(n)}}function ng(t,e){return t?t[e]||t.default||t:void 0}const Ih=2e4;function NM(t){let e=0;const n=50;let i=t.next(e);for(;!i.done&&e<Ih;)e+=n,i=t.next(e);return e>=Ih?1/0:e}function ig(t){return typeof t=="function"}function Ev(t,e){t.timeline=e,t.onfinish=null}const rg=t=>Array.isArray(t)&&typeof t[0]=="number",dA={linearEasing:void 0};function fA(t,e){const n=Gm(t);return()=>{var i;return(i=dA[e])!==null&&i!==void 0?i:n()}}const Su=fA(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch{return!1}return!0},"linearEasing"),LM=(t,e,n=10)=>{let i="";const r=Math.max(Math.round(e/n),2);for(let s=0;s<r;s++)i+=t(No(0,r-1,s))+", ";return`linear(${i.substring(0,i.length-2)})`};function IM(t){return!!(typeof t=="function"&&Su()||!t||typeof t=="string"&&(t in Uh||Su())||rg(t)||Array.isArray(t)&&t.every(IM))}const ha=([t,e,n,i])=>`cubic-bezier(${t}, ${e}, ${n}, ${i})`,Uh={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:ha([0,.65,.55,1]),circOut:ha([.55,0,1,.45]),backIn:ha([.31,.01,.66,-.59]),backOut:ha([.33,1.53,.69,.99])};function UM(t,e){if(t)return typeof t=="function"&&Su()?LM(t,e):rg(t)?ha(t):Array.isArray(t)?t.map(n=>UM(n,e)||Uh.easeOut):Uh[t]}const si={x:!1,y:!1};function FM(){return si.x||si.y}function hA(t,e,n){var i;if(t instanceof Element)return[t];if(typeof t=="string"){let r=document;const s=(i=void 0)!==null&&i!==void 0?i:r.querySelectorAll(t);return s?Array.from(s):[]}return Array.from(t)}function OM(t,e){const n=hA(t),i=new AbortController,r={passive:!0,...e,signal:i.signal};return[n,r,()=>i.abort()]}function Tv(t){return e=>{e.pointerType==="touch"||FM()||t(e)}}function pA(t,e,n={}){const[i,r,s]=OM(t,n),o=Tv(a=>{const{target:l}=a,c=e(a);if(typeof c!="function"||!l)return;const u=Tv(f=>{c(f),l.removeEventListener("pointerleave",u)});l.addEventListener("pointerleave",u,r)});return i.forEach(a=>{a.addEventListener("pointerenter",o,r)}),s}const kM=(t,e)=>e?t===e?!0:kM(t,e.parentElement):!1,sg=t=>t.pointerType==="mouse"?typeof t.button!="number"||t.button<=0:t.isPrimary!==!1,mA=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]);function gA(t){return mA.has(t.tagName)||t.tabIndex!==-1}const pa=new WeakSet;function wv(t){return e=>{e.key==="Enter"&&t(e)}}function Bd(t,e){t.dispatchEvent(new PointerEvent("pointer"+e,{isPrimary:!0,bubbles:!0}))}const vA=(t,e)=>{const n=t.currentTarget;if(!n)return;const i=wv(()=>{if(pa.has(n))return;Bd(n,"down");const r=wv(()=>{Bd(n,"up")}),s=()=>Bd(n,"cancel");n.addEventListener("keyup",r,e),n.addEventListener("blur",s,e)});n.addEventListener("keydown",i,e),n.addEventListener("blur",()=>n.removeEventListener("keydown",i),e)};function bv(t){return sg(t)&&!FM()}function xA(t,e,n={}){const[i,r,s]=OM(t,n),o=a=>{const l=a.currentTarget;if(!bv(a)||pa.has(l))return;pa.add(l);const c=e(a),u=(p,v)=>{window.removeEventListener("pointerup",f),window.removeEventListener("pointercancel",d),!(!bv(p)||!pa.has(l))&&(pa.delete(l),typeof c=="function"&&c(p,{success:v}))},f=p=>{u(p,n.useGlobalTarget||kM(l,p.target))},d=p=>{u(p,!1)};window.addEventListener("pointerup",f,r),window.addEventListener("pointercancel",d,r)};return i.forEach(a=>{!gA(a)&&a.getAttribute("tabindex")===null&&(a.tabIndex=0),(n.useGlobalTarget?window:a).addEventListener("pointerdown",o,r),a.addEventListener("focus",c=>vA(c,r),r)}),s}function _A(t){return t==="x"||t==="y"?si[t]?null:(si[t]=!0,()=>{si[t]=!1}):si.x||si.y?null:(si.x=si.y=!0,()=>{si.x=si.y=!1})}const BM=new Set(["width","height","top","left","right","bottom",...Go]);let Bc;function yA(){Bc=void 0}const Ni={now:()=>(Bc===void 0&&Ni.set(Qt.isProcessing||mb.useManualTiming?Qt.timestamp:performance.now()),Bc),set:t=>{Bc=t,queueMicrotask(yA)}};function og(t,e){t.indexOf(e)===-1&&t.push(e)}function ag(t,e){const n=t.indexOf(e);n>-1&&t.splice(n,1)}class lg{constructor(){this.subscriptions=[]}add(e){return og(this.subscriptions,e),()=>ag(this.subscriptions,e)}notify(e,n,i){const r=this.subscriptions.length;if(r)if(r===1)this.subscriptions[0](e,n,i);else for(let s=0;s<r;s++){const o=this.subscriptions[s];o&&o(e,n,i)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}function zM(t,e){return e?t*(1e3/e):0}const Av=30,SA=t=>!isNaN(parseFloat(t));class MA{constructor(e,n={}){this.version="11.18.2",this.canTrackVelocity=null,this.events={},this.updateAndNotify=(i,r=!0)=>{const s=Ni.now();this.updatedAt!==s&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(i),this.current!==this.prev&&this.events.change&&this.events.change.notify(this.current),r&&this.events.renderRequest&&this.events.renderRequest.notify(this.current)},this.hasAnimated=!1,this.setCurrent(e),this.owner=n.owner}setCurrent(e){this.current=e,this.updatedAt=Ni.now(),this.canTrackVelocity===null&&e!==void 0&&(this.canTrackVelocity=SA(this.current))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,n){this.events[e]||(this.events[e]=new lg);const i=this.events[e].add(n);return e==="change"?()=>{i(),Et.read(()=>{this.events.change.getSize()||this.stop()})}:i}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,n){this.passiveEffect=e,this.stopPassiveEffect=n}set(e,n=!0){!n||!this.passiveEffect?this.updateAndNotify(e,n):this.passiveEffect(e,this.updateAndNotify)}setWithVelocity(e,n,i){this.set(n),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-i}jump(e,n=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,n&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}get(){return this.current}getPrevious(){return this.prev}getVelocity(){const e=Ni.now();if(!this.canTrackVelocity||this.prevFrameValue===void 0||e-this.updatedAt>Av)return 0;const n=Math.min(this.updatedAt-this.prevUpdatedAt,Av);return zM(parseFloat(this.current)-parseFloat(this.prevFrameValue),n)}start(e){return this.stop(),new Promise(n=>{this.hasAnimated=!0,this.animation=e(n),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function tl(t,e){return new MA(t,e)}function EA(t,e,n){t.hasValue(e)?t.getValue(e).set(n):t.addValue(e,tl(n))}function TA(t,e){const n=id(t,e);let{transitionEnd:i={},transition:r={},...s}=n||{};s={...s,...i};for(const o in s){const a=Fb(s[o]);EA(t,o,a)}}function wA(t){return!!(un(t)&&t.add)}function Fh(t,e){const n=t.getValue("willChange");if(wA(n))return n.add(e)}function VM(t){return t.props[vM]}const GM=(t,e,n)=>(((1-3*n+3*e)*t+(3*n-6*e))*t+3*e)*t,bA=1e-7,AA=12;function CA(t,e,n,i,r){let s,o,a=0;do o=e+(n-e)/2,s=GM(o,i,r)-t,s>0?n=o:e=o;while(Math.abs(s)>bA&&++a<AA);return o}function ml(t,e,n,i){if(t===e&&n===i)return Fn;const r=s=>CA(s,0,1,t,n);return s=>s===0||s===1?s:GM(r(s),e,i)}const HM=t=>e=>e<=.5?t(2*e)/2:(2-t(2*(1-e)))/2,jM=t=>e=>1-t(1-e),WM=ml(.33,1.53,.69,.99),cg=jM(WM),XM=HM(cg),$M=t=>(t*=2)<1?.5*cg(t):.5*(2-Math.pow(2,-10*(t-1))),ug=t=>1-Math.sin(Math.acos(t)),YM=jM(ug),KM=HM(ug),qM=t=>/^0[^.\s]+$/u.test(t);function RA(t){return typeof t=="number"?t===0:t!==null?t==="none"||t==="0"||qM(t):!0}const Ca=t=>Math.round(t*1e5)/1e5,dg=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu;function PA(t){return t==null}const DA=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,fg=(t,e)=>n=>!!(typeof n=="string"&&DA.test(n)&&n.startsWith(t)||e&&!PA(n)&&Object.prototype.hasOwnProperty.call(n,e)),ZM=(t,e,n)=>i=>{if(typeof i!="string")return i;const[r,s,o,a]=i.match(dg);return{[t]:parseFloat(r),[e]:parseFloat(s),[n]:parseFloat(o),alpha:a!==void 0?parseFloat(a):1}},NA=t=>ir(0,255,t),zd={...Ho,transform:t=>Math.round(NA(t))},fs={test:fg("rgb","red"),parse:ZM("red","green","blue"),transform:({red:t,green:e,blue:n,alpha:i=1})=>"rgba("+zd.transform(t)+", "+zd.transform(e)+", "+zd.transform(n)+", "+Ca(el.transform(i))+")"};function LA(t){let e="",n="",i="",r="";return t.length>5?(e=t.substring(1,3),n=t.substring(3,5),i=t.substring(5,7),r=t.substring(7,9)):(e=t.substring(1,2),n=t.substring(2,3),i=t.substring(3,4),r=t.substring(4,5),e+=e,n+=n,i+=i,r+=r),{red:parseInt(e,16),green:parseInt(n,16),blue:parseInt(i,16),alpha:r?parseInt(r,16)/255:1}}const Oh={test:fg("#"),parse:LA,transform:fs.transform},fo={test:fg("hsl","hue"),parse:ZM("hue","saturation","lightness"),transform:({hue:t,saturation:e,lightness:n,alpha:i=1})=>"hsla("+Math.round(t)+", "+Di.transform(Ca(e))+", "+Di.transform(Ca(n))+", "+Ca(el.transform(i))+")"},ln={test:t=>fs.test(t)||Oh.test(t)||fo.test(t),parse:t=>fs.test(t)?fs.parse(t):fo.test(t)?fo.parse(t):Oh.parse(t),transform:t=>typeof t=="string"?t:t.hasOwnProperty("red")?fs.transform(t):fo.transform(t)},IA=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;function UA(t){var e,n;return isNaN(t)&&typeof t=="string"&&(((e=t.match(dg))===null||e===void 0?void 0:e.length)||0)+(((n=t.match(IA))===null||n===void 0?void 0:n.length)||0)>0}const QM="number",JM="color",FA="var",OA="var(",Cv="${}",kA=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function nl(t){const e=t.toString(),n=[],i={color:[],number:[],var:[]},r=[];let s=0;const a=e.replace(kA,l=>(ln.test(l)?(i.color.push(s),r.push(JM),n.push(ln.parse(l))):l.startsWith(OA)?(i.var.push(s),r.push(FA),n.push(l)):(i.number.push(s),r.push(QM),n.push(parseFloat(l))),++s,Cv)).split(Cv);return{values:n,split:a,indexes:i,types:r}}function e1(t){return nl(t).values}function t1(t){const{split:e,types:n}=nl(t),i=e.length;return r=>{let s="";for(let o=0;o<i;o++)if(s+=e[o],r[o]!==void 0){const a=n[o];a===QM?s+=Ca(r[o]):a===JM?s+=ln.transform(r[o]):s+=r[o]}return s}}const BA=t=>typeof t=="number"?0:t;function zA(t){const e=e1(t);return t1(t)(e.map(BA))}const Br={test:UA,parse:e1,createTransformer:t1,getAnimatableNone:zA},VA=new Set(["brightness","contrast","saturate","opacity"]);function GA(t){const[e,n]=t.slice(0,-1).split("(");if(e==="drop-shadow")return t;const[i]=n.match(dg)||[];if(!i)return t;const r=n.replace(i,"");let s=VA.has(e)?1:0;return i!==n&&(s*=100),e+"("+s+r+")"}const HA=/\b([a-z-]*)\(.*?\)/gu,kh={...Br,getAnimatableNone:t=>{const e=t.match(HA);return e?e.map(GA).join(" "):t}},jA={...qm,color:ln,backgroundColor:ln,outlineColor:ln,fill:ln,stroke:ln,borderColor:ln,borderTopColor:ln,borderRightColor:ln,borderBottomColor:ln,borderLeftColor:ln,filter:kh,WebkitFilter:kh},hg=t=>jA[t];function n1(t,e){let n=hg(t);return n!==kh&&(n=Br),n.getAnimatableNone?n.getAnimatableNone(e):void 0}const WA=new Set(["auto","none","0"]);function XA(t,e,n){let i=0,r;for(;i<t.length&&!r;){const s=t[i];typeof s=="string"&&!WA.has(s)&&nl(s).values.length&&(r=t[i]),i++}if(r&&n)for(const s of e)t[s]=n1(n,r)}const Rv=t=>t===Ho||t===Ue,Pv=(t,e)=>parseFloat(t.split(", ")[e]),Dv=(t,e)=>(n,{transform:i})=>{if(i==="none"||!i)return 0;const r=i.match(/^matrix3d\((.+)\)$/u);if(r)return Pv(r[1],e);{const s=i.match(/^matrix\((.+)\)$/u);return s?Pv(s[1],t):0}},$A=new Set(["x","y","z"]),YA=Go.filter(t=>!$A.has(t));function KA(t){const e=[];return YA.forEach(n=>{const i=t.getValue(n);i!==void 0&&(e.push([n,i.get()]),i.set(n.startsWith("scale")?1:0))}),e}const Io={width:({x:t},{paddingLeft:e="0",paddingRight:n="0"})=>t.max-t.min-parseFloat(e)-parseFloat(n),height:({y:t},{paddingTop:e="0",paddingBottom:n="0"})=>t.max-t.min-parseFloat(e)-parseFloat(n),top:(t,{top:e})=>parseFloat(e),left:(t,{left:e})=>parseFloat(e),bottom:({y:t},{top:e})=>parseFloat(e)+(t.max-t.min),right:({x:t},{left:e})=>parseFloat(e)+(t.max-t.min),x:Dv(4,13),y:Dv(5,14)};Io.translateX=Io.x;Io.translateY=Io.y;const vs=new Set;let Bh=!1,zh=!1;function i1(){if(zh){const t=Array.from(vs).filter(i=>i.needsMeasurement),e=new Set(t.map(i=>i.element)),n=new Map;e.forEach(i=>{const r=KA(i);r.length&&(n.set(i,r),i.render())}),t.forEach(i=>i.measureInitialState()),e.forEach(i=>{i.render();const r=n.get(i);r&&r.forEach(([s,o])=>{var a;(a=i.getValue(s))===null||a===void 0||a.set(o)})}),t.forEach(i=>i.measureEndState()),t.forEach(i=>{i.suspendedScrollY!==void 0&&window.scrollTo(0,i.suspendedScrollY)})}zh=!1,Bh=!1,vs.forEach(t=>t.complete()),vs.clear()}function r1(){vs.forEach(t=>{t.readKeyframes(),t.needsMeasurement&&(zh=!0)})}function qA(){r1(),i1()}class pg{constructor(e,n,i,r,s,o=!1){this.isComplete=!1,this.isAsync=!1,this.needsMeasurement=!1,this.isScheduled=!1,this.unresolvedKeyframes=[...e],this.onComplete=n,this.name=i,this.motionValue=r,this.element=s,this.isAsync=o}scheduleResolve(){this.isScheduled=!0,this.isAsync?(vs.add(this),Bh||(Bh=!0,Et.read(r1),Et.resolveKeyframes(i1))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:n,element:i,motionValue:r}=this;for(let s=0;s<e.length;s++)if(e[s]===null)if(s===0){const o=r==null?void 0:r.get(),a=e[e.length-1];if(o!==void 0)e[0]=o;else if(i&&n){const l=i.readValue(n,a);l!=null&&(e[0]=l)}e[0]===void 0&&(e[0]=a),r&&o===void 0&&r.set(e[0])}else e[s]=e[s-1]}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(){this.isComplete=!0,this.onComplete(this.unresolvedKeyframes,this.finalKeyframe),vs.delete(this)}cancel(){this.isComplete||(this.isScheduled=!1,vs.delete(this))}resume(){this.isComplete||this.scheduleResolve()}}const s1=t=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(t),ZA=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function QA(t){const e=ZA.exec(t);if(!e)return[,];const[,n,i,r]=e;return[`--${n??i}`,r]}function o1(t,e,n=1){const[i,r]=QA(t);if(!i)return;const s=window.getComputedStyle(e).getPropertyValue(i);if(s){const o=s.trim();return s1(o)?parseFloat(o):o}return Km(r)?o1(r,e,n+1):r}const a1=t=>e=>e.test(t),JA={test:t=>t==="auto",parse:t=>t},l1=[Ho,Ue,Di,vr,Gb,Vb,JA],Nv=t=>l1.find(a1(t));class c1 extends pg{constructor(e,n,i,r,s){super(e,n,i,r,s,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:n,name:i}=this;if(!n||!n.current)return;super.readKeyframes();for(let l=0;l<e.length;l++){let c=e[l];if(typeof c=="string"&&(c=c.trim(),Km(c))){const u=o1(c,n.current);u!==void 0&&(e[l]=u),l===e.length-1&&(this.finalKeyframe=c)}}if(this.resolveNoneKeyframes(),!BM.has(i)||e.length!==2)return;const[r,s]=e,o=Nv(r),a=Nv(s);if(o!==a)if(Rv(o)&&Rv(a))for(let l=0;l<e.length;l++){const c=e[l];typeof c=="string"&&(e[l]=parseFloat(c))}else this.needsMeasurement=!0}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:n}=this,i=[];for(let r=0;r<e.length;r++)RA(e[r])&&i.push(r);i.length&&XA(e,i,n)}measureInitialState(){const{element:e,unresolvedKeyframes:n,name:i}=this;if(!e||!e.current)return;i==="height"&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Io[i](e.measureViewportBox(),window.getComputedStyle(e.current)),n[0]=this.measuredOrigin;const r=n[n.length-1];r!==void 0&&e.getValue(i,r).jump(r,!1)}measureEndState(){var e;const{element:n,name:i,unresolvedKeyframes:r}=this;if(!n||!n.current)return;const s=n.getValue(i);s&&s.jump(this.measuredOrigin,!1);const o=r.length-1,a=r[o];r[o]=Io[i](n.measureViewportBox(),window.getComputedStyle(n.current)),a!==null&&this.finalKeyframe===void 0&&(this.finalKeyframe=a),!((e=this.removedTransforms)===null||e===void 0)&&e.length&&this.removedTransforms.forEach(([l,c])=>{n.getValue(l).set(c)}),this.resolveNoneKeyframes()}}const Lv=(t,e)=>e==="zIndex"?!1:!!(typeof t=="number"||Array.isArray(t)||typeof t=="string"&&(Br.test(t)||t==="0")&&!t.startsWith("url("));function eC(t){const e=t[0];if(t.length===1)return!0;for(let n=0;n<t.length;n++)if(t[n]!==e)return!0}function tC(t,e,n,i){const r=t[0];if(r===null)return!1;if(e==="display"||e==="visibility")return!0;const s=t[t.length-1],o=Lv(r,e),a=Lv(s,e);return!o||!a?!1:eC(t)||(n==="spring"||ig(n))&&i}const nC=t=>t!==null;function rd(t,{repeat:e,repeatType:n="loop"},i){const r=t.filter(nC),s=e&&n!=="loop"&&e%2===1?0:r.length-1;return!s||i===void 0?r[s]:i}const iC=40;class u1{constructor({autoplay:e=!0,delay:n=0,type:i="keyframes",repeat:r=0,repeatDelay:s=0,repeatType:o="loop",...a}){this.isStopped=!1,this.hasAttemptedResolve=!1,this.createdAt=Ni.now(),this.options={autoplay:e,delay:n,type:i,repeat:r,repeatDelay:s,repeatType:o,...a},this.updateFinishedPromise()}calcStartTime(){return this.resolvedAt?this.resolvedAt-this.createdAt>iC?this.resolvedAt:this.createdAt:this.createdAt}get resolved(){return!this._resolved&&!this.hasAttemptedResolve&&qA(),this._resolved}onKeyframesResolved(e,n){this.resolvedAt=Ni.now(),this.hasAttemptedResolve=!0;const{name:i,type:r,velocity:s,delay:o,onComplete:a,onUpdate:l,isGenerator:c}=this.options;if(!c&&!tC(e,i,r,s))if(o)this.options.duration=0;else{l&&l(rd(e,this.options,n)),a&&a(),this.resolveFinishedPromise();return}const u=this.initPlayback(e,n);u!==!1&&(this._resolved={keyframes:e,finalKeyframe:n,...u},this.onPostResolved())}onPostResolved(){}then(e,n){return this.currentFinishedPromise.then(e,n)}flatten(){this.options.type="keyframes",this.options.ease="linear"}updateFinishedPromise(){this.currentFinishedPromise=new Promise(e=>{this.resolveFinishedPromise=e})}}const bt=(t,e,n)=>t+(e-t)*n;function Vd(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*(2/3-n)*6:t}function rC({hue:t,saturation:e,lightness:n,alpha:i}){t/=360,e/=100,n/=100;let r=0,s=0,o=0;if(!e)r=s=o=n;else{const a=n<.5?n*(1+e):n+e-n*e,l=2*n-a;r=Vd(l,a,t+1/3),s=Vd(l,a,t),o=Vd(l,a,t-1/3)}return{red:Math.round(r*255),green:Math.round(s*255),blue:Math.round(o*255),alpha:i}}function Mu(t,e){return n=>n>0?e:t}const Gd=(t,e,n)=>{const i=t*t,r=n*(e*e-i)+i;return r<0?0:Math.sqrt(r)},sC=[Oh,fs,fo],oC=t=>sC.find(e=>e.test(t));function Iv(t){const e=oC(t);if(!e)return!1;let n=e.parse(t);return e===fo&&(n=rC(n)),n}const Uv=(t,e)=>{const n=Iv(t),i=Iv(e);if(!n||!i)return Mu(t,e);const r={...n};return s=>(r.red=Gd(n.red,i.red,s),r.green=Gd(n.green,i.green,s),r.blue=Gd(n.blue,i.blue,s),r.alpha=bt(n.alpha,i.alpha,s),fs.transform(r))},aC=(t,e)=>n=>e(t(n)),gl=(...t)=>t.reduce(aC),Vh=new Set(["none","hidden"]);function lC(t,e){return Vh.has(t)?n=>n<=0?t:e:n=>n>=1?e:t}function cC(t,e){return n=>bt(t,e,n)}function mg(t){return typeof t=="number"?cC:typeof t=="string"?Km(t)?Mu:ln.test(t)?Uv:fC:Array.isArray(t)?d1:typeof t=="object"?ln.test(t)?Uv:uC:Mu}function d1(t,e){const n=[...t],i=n.length,r=t.map((s,o)=>mg(s)(s,e[o]));return s=>{for(let o=0;o<i;o++)n[o]=r[o](s);return n}}function uC(t,e){const n={...t,...e},i={};for(const r in n)t[r]!==void 0&&e[r]!==void 0&&(i[r]=mg(t[r])(t[r],e[r]));return r=>{for(const s in i)n[s]=i[s](r);return n}}function dC(t,e){var n;const i=[],r={color:0,var:0,number:0};for(let s=0;s<e.values.length;s++){const o=e.types[s],a=t.indexes[o][r[o]],l=(n=t.values[a])!==null&&n!==void 0?n:0;i[s]=l,r[o]++}return i}const fC=(t,e)=>{const n=Br.createTransformer(e),i=nl(t),r=nl(e);return i.indexes.var.length===r.indexes.var.length&&i.indexes.color.length===r.indexes.color.length&&i.indexes.number.length>=r.indexes.number.length?Vh.has(t)&&!r.values.length||Vh.has(e)&&!i.values.length?lC(t,e):gl(d1(dC(i,r),r.values),n):Mu(t,e)};function f1(t,e,n){return typeof t=="number"&&typeof e=="number"&&typeof n=="number"?bt(t,e,n):mg(t)(t,e)}const hC=5;function h1(t,e,n){const i=Math.max(e-hC,0);return zM(n-t(i),e-i)}const Pt={stiffness:100,damping:10,mass:1,velocity:0,duration:800,bounce:.3,visualDuration:.3,restSpeed:{granular:.01,default:2},restDelta:{granular:.005,default:.5},minDuration:.01,maxDuration:10,minDamping:.05,maxDamping:1},Hd=.001;function pC({duration:t=Pt.duration,bounce:e=Pt.bounce,velocity:n=Pt.velocity,mass:i=Pt.mass}){let r,s,o=1-e;o=ir(Pt.minDamping,Pt.maxDamping,o),t=ir(Pt.minDuration,Pt.maxDuration,Ki(t)),o<1?(r=c=>{const u=c*o,f=u*t,d=u-n,p=Gh(c,o),v=Math.exp(-f);return Hd-d/p*v},s=c=>{const f=c*o*t,d=f*n+n,p=Math.pow(o,2)*Math.pow(c,2)*t,v=Math.exp(-f),S=Gh(Math.pow(c,2),o);return(-r(c)+Hd>0?-1:1)*((d-p)*v)/S}):(r=c=>{const u=Math.exp(-c*t),f=(c-n)*t+1;return-Hd+u*f},s=c=>{const u=Math.exp(-c*t),f=(n-c)*(t*t);return u*f});const a=5/t,l=gC(r,s,a);if(t=Yi(t),isNaN(l))return{stiffness:Pt.stiffness,damping:Pt.damping,duration:t};{const c=Math.pow(l,2)*i;return{stiffness:c,damping:o*2*Math.sqrt(i*c),duration:t}}}const mC=12;function gC(t,e,n){let i=n;for(let r=1;r<mC;r++)i=i-t(i)/e(i);return i}function Gh(t,e){return t*Math.sqrt(1-e*e)}const vC=["duration","bounce"],xC=["stiffness","damping","mass"];function Fv(t,e){return e.some(n=>t[n]!==void 0)}function _C(t){let e={velocity:Pt.velocity,stiffness:Pt.stiffness,damping:Pt.damping,mass:Pt.mass,isResolvedFromDuration:!1,...t};if(!Fv(t,xC)&&Fv(t,vC))if(t.visualDuration){const n=t.visualDuration,i=2*Math.PI/(n*1.2),r=i*i,s=2*ir(.05,1,1-(t.bounce||0))*Math.sqrt(r);e={...e,mass:Pt.mass,stiffness:r,damping:s}}else{const n=pC(t);e={...e,...n,mass:Pt.mass},e.isResolvedFromDuration=!0}return e}function p1(t=Pt.visualDuration,e=Pt.bounce){const n=typeof t!="object"?{visualDuration:t,keyframes:[0,1],bounce:e}:t;let{restSpeed:i,restDelta:r}=n;const s=n.keyframes[0],o=n.keyframes[n.keyframes.length-1],a={done:!1,value:s},{stiffness:l,damping:c,mass:u,duration:f,velocity:d,isResolvedFromDuration:p}=_C({...n,velocity:-Ki(n.velocity||0)}),v=d||0,S=c/(2*Math.sqrt(l*u)),g=o-s,h=Ki(Math.sqrt(l/u)),m=Math.abs(g)<5;i||(i=m?Pt.restSpeed.granular:Pt.restSpeed.default),r||(r=m?Pt.restDelta.granular:Pt.restDelta.default);let _;if(S<1){const w=Gh(h,S);_=T=>{const R=Math.exp(-S*h*T);return o-R*((v+S*h*g)/w*Math.sin(w*T)+g*Math.cos(w*T))}}else if(S===1)_=w=>o-Math.exp(-h*w)*(g+(v+h*g)*w);else{const w=h*Math.sqrt(S*S-1);_=T=>{const R=Math.exp(-S*h*T),y=Math.min(w*T,300);return o-R*((v+S*h*g)*Math.sinh(y)+w*g*Math.cosh(y))/w}}const M={calculatedDuration:p&&f||null,next:w=>{const T=_(w);if(p)a.done=w>=f;else{let R=0;S<1&&(R=w===0?Yi(v):h1(_,w,T));const y=Math.abs(R)<=i,C=Math.abs(o-T)<=r;a.done=y&&C}return a.value=a.done?o:T,a},toString:()=>{const w=Math.min(NM(M),Ih),T=LM(R=>M.next(w*R).value,w,30);return w+"ms "+T}};return M}function Ov({keyframes:t,velocity:e=0,power:n=.8,timeConstant:i=325,bounceDamping:r=10,bounceStiffness:s=500,modifyTarget:o,min:a,max:l,restDelta:c=.5,restSpeed:u}){const f=t[0],d={done:!1,value:f},p=y=>a!==void 0&&y<a||l!==void 0&&y>l,v=y=>a===void 0?l:l===void 0||Math.abs(a-y)<Math.abs(l-y)?a:l;let S=n*e;const g=f+S,h=o===void 0?g:o(g);h!==g&&(S=h-f);const m=y=>-S*Math.exp(-y/i),_=y=>h+m(y),M=y=>{const C=m(y),D=_(y);d.done=Math.abs(C)<=c,d.value=d.done?h:D};let w,T;const R=y=>{p(d.value)&&(w=y,T=p1({keyframes:[d.value,v(d.value)],velocity:h1(_,y,d.value),damping:r,stiffness:s,restDelta:c,restSpeed:u}))};return R(0),{calculatedDuration:null,next:y=>{let C=!1;return!T&&w===void 0&&(C=!0,M(y),R(y)),w!==void 0&&y>=w?T.next(y-w):(!C&&M(y),d)}}}const yC=ml(.42,0,1,1),SC=ml(0,0,.58,1),m1=ml(.42,0,.58,1),MC=t=>Array.isArray(t)&&typeof t[0]!="number",EC={linear:Fn,easeIn:yC,easeInOut:m1,easeOut:SC,circIn:ug,circInOut:KM,circOut:YM,backIn:cg,backInOut:XM,backOut:WM,anticipate:$M},kv=t=>{if(rg(t)){fM(t.length===4);const[e,n,i,r]=t;return ml(e,n,i,r)}else if(typeof t=="string")return EC[t];return t};function TC(t,e,n){const i=[],r=n||f1,s=t.length-1;for(let o=0;o<s;o++){let a=r(t[o],t[o+1]);if(e){const l=Array.isArray(e)?e[o]||Fn:e;a=gl(l,a)}i.push(a)}return i}function wC(t,e,{clamp:n=!0,ease:i,mixer:r}={}){const s=t.length;if(fM(s===e.length),s===1)return()=>e[0];if(s===2&&e[0]===e[1])return()=>e[1];const o=t[0]===t[1];t[0]>t[s-1]&&(t=[...t].reverse(),e=[...e].reverse());const a=TC(e,i,r),l=a.length,c=u=>{if(o&&u<t[0])return e[0];let f=0;if(l>1)for(;f<t.length-2&&!(u<t[f+1]);f++);const d=No(t[f],t[f+1],u);return a[f](d)};return n?u=>c(ir(t[0],t[s-1],u)):c}function bC(t,e){const n=t[t.length-1];for(let i=1;i<=e;i++){const r=No(0,e,i);t.push(bt(n,1,r))}}function AC(t){const e=[0];return bC(e,t.length-1),e}function CC(t,e){return t.map(n=>n*e)}function RC(t,e){return t.map(()=>e||m1).splice(0,t.length-1)}function Eu({duration:t=300,keyframes:e,times:n,ease:i="easeInOut"}){const r=MC(i)?i.map(kv):kv(i),s={done:!1,value:e[0]},o=CC(n&&n.length===e.length?n:AC(e),t),a=wC(o,e,{ease:Array.isArray(r)?r:RC(e,r)});return{calculatedDuration:t,next:l=>(s.value=a(l),s.done=l>=t,s)}}const PC=t=>{const e=({timestamp:n})=>t(n);return{start:()=>Et.update(e,!0),stop:()=>kr(e),now:()=>Qt.isProcessing?Qt.timestamp:Ni.now()}},DC={decay:Ov,inertia:Ov,tween:Eu,keyframes:Eu,spring:p1},NC=t=>t/100;class gg extends u1{constructor(e){super(e),this.holdTime=null,this.cancelTime=null,this.currentTime=0,this.playbackSpeed=1,this.pendingPlayState="running",this.startTime=null,this.state="idle",this.stop=()=>{if(this.resolver.cancel(),this.isStopped=!0,this.state==="idle")return;this.teardown();const{onStop:l}=this.options;l&&l()};const{name:n,motionValue:i,element:r,keyframes:s}=this.options,o=(r==null?void 0:r.KeyframeResolver)||pg,a=(l,c)=>this.onKeyframesResolved(l,c);this.resolver=new o(s,a,n,i,r),this.resolver.scheduleResolve()}flatten(){super.flatten(),this._resolved&&Object.assign(this._resolved,this.initPlayback(this._resolved.keyframes))}initPlayback(e){const{type:n="keyframes",repeat:i=0,repeatDelay:r=0,repeatType:s,velocity:o=0}=this.options,a=ig(n)?n:DC[n]||Eu;let l,c;a!==Eu&&typeof e[0]!="number"&&(l=gl(NC,f1(e[0],e[1])),e=[0,100]);const u=a({...this.options,keyframes:e});s==="mirror"&&(c=a({...this.options,keyframes:[...e].reverse(),velocity:-o})),u.calculatedDuration===null&&(u.calculatedDuration=NM(u));const{calculatedDuration:f}=u,d=f+r,p=d*(i+1)-r;return{generator:u,mirroredGenerator:c,mapPercentToKeyframes:l,calculatedDuration:f,resolvedDuration:d,totalDuration:p}}onPostResolved(){const{autoplay:e=!0}=this.options;this.play(),this.pendingPlayState==="paused"||!e?this.pause():this.state=this.pendingPlayState}tick(e,n=!1){const{resolved:i}=this;if(!i){const{keyframes:y}=this.options;return{done:!0,value:y[y.length-1]}}const{finalKeyframe:r,generator:s,mirroredGenerator:o,mapPercentToKeyframes:a,keyframes:l,calculatedDuration:c,totalDuration:u,resolvedDuration:f}=i;if(this.startTime===null)return s.next(0);const{delay:d,repeat:p,repeatType:v,repeatDelay:S,onUpdate:g}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-u/this.speed,this.startTime)),n?this.currentTime=e:this.holdTime!==null?this.currentTime=this.holdTime:this.currentTime=Math.round(e-this.startTime)*this.speed;const h=this.currentTime-d*(this.speed>=0?1:-1),m=this.speed>=0?h<0:h>u;this.currentTime=Math.max(h,0),this.state==="finished"&&this.holdTime===null&&(this.currentTime=u);let _=this.currentTime,M=s;if(p){const y=Math.min(this.currentTime,u)/f;let C=Math.floor(y),D=y%1;!D&&y>=1&&(D=1),D===1&&C--,C=Math.min(C,p+1),!!(C%2)&&(v==="reverse"?(D=1-D,S&&(D-=S/f)):v==="mirror"&&(M=o)),_=ir(0,1,D)*f}const w=m?{done:!1,value:l[0]}:M.next(_);a&&(w.value=a(w.value));let{done:T}=w;!m&&c!==null&&(T=this.speed>=0?this.currentTime>=u:this.currentTime<=0);const R=this.holdTime===null&&(this.state==="finished"||this.state==="running"&&T);return R&&r!==void 0&&(w.value=rd(l,this.options,r)),g&&g(w.value),R&&this.finish(),w}get duration(){const{resolved:e}=this;return e?Ki(e.calculatedDuration):0}get time(){return Ki(this.currentTime)}set time(e){e=Yi(e),this.currentTime=e,this.holdTime!==null||this.speed===0?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.speed)}get speed(){return this.playbackSpeed}set speed(e){const n=this.playbackSpeed!==e;this.playbackSpeed=e,n&&(this.time=Ki(this.currentTime))}play(){if(this.resolver.isScheduled||this.resolver.resume(),!this._resolved){this.pendingPlayState="running";return}if(this.isStopped)return;const{driver:e=PC,onPlay:n,startTime:i}=this.options;this.driver||(this.driver=e(s=>this.tick(s))),n&&n();const r=this.driver.now();this.holdTime!==null?this.startTime=r-this.holdTime:this.startTime?this.state==="finished"&&(this.startTime=r):this.startTime=i??this.calcStartTime(),this.state==="finished"&&this.updateFinishedPromise(),this.cancelTime=this.startTime,this.holdTime=null,this.state="running",this.driver.start()}pause(){var e;if(!this._resolved){this.pendingPlayState="paused";return}this.state="paused",this.holdTime=(e=this.currentTime)!==null&&e!==void 0?e:0}complete(){this.state!=="running"&&this.play(),this.pendingPlayState=this.state="finished",this.holdTime=null}finish(){this.teardown(),this.state="finished";const{onComplete:e}=this.options;e&&e()}cancel(){this.cancelTime!==null&&this.tick(this.cancelTime),this.teardown(),this.updateFinishedPromise()}teardown(){this.state="idle",this.stopDriver(),this.resolveFinishedPromise(),this.updateFinishedPromise(),this.startTime=this.cancelTime=null,this.resolver.cancel()}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}}const LC=new Set(["opacity","clipPath","filter","transform"]);function IC(t,e,n,{delay:i=0,duration:r=300,repeat:s=0,repeatType:o="loop",ease:a="easeInOut",times:l}={}){const c={[e]:n};l&&(c.offset=l);const u=UM(a,r);return Array.isArray(u)&&(c.easing=u),t.animate(c,{delay:i,duration:r,easing:Array.isArray(u)?"linear":u,fill:"both",iterations:s+1,direction:o==="reverse"?"alternate":"normal"})}const UC=Gm(()=>Object.hasOwnProperty.call(Element.prototype,"animate")),Tu=10,FC=2e4;function OC(t){return ig(t.type)||t.type==="spring"||!IM(t.ease)}function kC(t,e){const n=new gg({...e,keyframes:t,repeat:0,delay:0,isGenerator:!0});let i={done:!1,value:t[0]};const r=[];let s=0;for(;!i.done&&s<FC;)i=n.sample(s),r.push(i.value),s+=Tu;return{times:void 0,keyframes:r,duration:s-Tu,ease:"linear"}}const g1={anticipate:$M,backInOut:XM,circInOut:KM};function BC(t){return t in g1}class Bv extends u1{constructor(e){super(e);const{name:n,motionValue:i,element:r,keyframes:s}=this.options;this.resolver=new c1(s,(o,a)=>this.onKeyframesResolved(o,a),n,i,r),this.resolver.scheduleResolve()}initPlayback(e,n){let{duration:i=300,times:r,ease:s,type:o,motionValue:a,name:l,startTime:c}=this.options;if(!a.owner||!a.owner.current)return!1;if(typeof s=="string"&&Su()&&BC(s)&&(s=g1[s]),OC(this.options)){const{onComplete:f,onUpdate:d,motionValue:p,element:v,...S}=this.options,g=kC(e,S);e=g.keyframes,e.length===1&&(e[1]=e[0]),i=g.duration,r=g.times,s=g.ease,o="keyframes"}const u=IC(a.owner.current,l,e,{...this.options,duration:i,times:r,ease:s});return u.startTime=c??this.calcStartTime(),this.pendingTimeline?(Ev(u,this.pendingTimeline),this.pendingTimeline=void 0):u.onfinish=()=>{const{onComplete:f}=this.options;a.set(rd(e,this.options,n)),f&&f(),this.cancel(),this.resolveFinishedPromise()},{animation:u,duration:i,times:r,type:o,ease:s,keyframes:e}}get duration(){const{resolved:e}=this;if(!e)return 0;const{duration:n}=e;return Ki(n)}get time(){const{resolved:e}=this;if(!e)return 0;const{animation:n}=e;return Ki(n.currentTime||0)}set time(e){const{resolved:n}=this;if(!n)return;const{animation:i}=n;i.currentTime=Yi(e)}get speed(){const{resolved:e}=this;if(!e)return 1;const{animation:n}=e;return n.playbackRate}set speed(e){const{resolved:n}=this;if(!n)return;const{animation:i}=n;i.playbackRate=e}get state(){const{resolved:e}=this;if(!e)return"idle";const{animation:n}=e;return n.playState}get startTime(){const{resolved:e}=this;if(!e)return null;const{animation:n}=e;return n.startTime}attachTimeline(e){if(!this._resolved)this.pendingTimeline=e;else{const{resolved:n}=this;if(!n)return Fn;const{animation:i}=n;Ev(i,e)}return Fn}play(){if(this.isStopped)return;const{resolved:e}=this;if(!e)return;const{animation:n}=e;n.playState==="finished"&&this.updateFinishedPromise(),n.play()}pause(){const{resolved:e}=this;if(!e)return;const{animation:n}=e;n.pause()}stop(){if(this.resolver.cancel(),this.isStopped=!0,this.state==="idle")return;this.resolveFinishedPromise(),this.updateFinishedPromise();const{resolved:e}=this;if(!e)return;const{animation:n,keyframes:i,duration:r,type:s,ease:o,times:a}=e;if(n.playState==="idle"||n.playState==="finished")return;if(this.time){const{motionValue:c,onUpdate:u,onComplete:f,element:d,...p}=this.options,v=new gg({...p,keyframes:i,duration:r,type:s,ease:o,times:a,isGenerator:!0}),S=Yi(this.time);c.setWithVelocity(v.sample(S-Tu).value,v.sample(S).value,Tu)}const{onStop:l}=this.options;l&&l(),this.cancel()}complete(){const{resolved:e}=this;e&&e.animation.finish()}cancel(){const{resolved:e}=this;e&&e.animation.cancel()}static supports(e){const{motionValue:n,name:i,repeatDelay:r,repeatType:s,damping:o,type:a}=e;if(!n||!n.owner||!(n.owner.current instanceof HTMLElement))return!1;const{onUpdate:l,transformTemplate:c}=n.owner.getProps();return UC()&&i&&LC.has(i)&&!l&&!c&&!r&&s!=="mirror"&&o!==0&&a!=="inertia"}}const zC={type:"spring",stiffness:500,damping:25,restSpeed:10},VC=t=>({type:"spring",stiffness:550,damping:t===0?2*Math.sqrt(550):30,restSpeed:10}),GC={type:"keyframes",duration:.8},HC={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},jC=(t,{keyframes:e})=>e.length>2?GC:Rs.has(t)?t.startsWith("scale")?VC(e[1]):zC:HC;function WC({when:t,delay:e,delayChildren:n,staggerChildren:i,staggerDirection:r,repeat:s,repeatType:o,repeatDelay:a,from:l,elapsed:c,...u}){return!!Object.keys(u).length}const vg=(t,e,n,i={},r,s)=>o=>{const a=ng(i,t)||{},l=a.delay||i.delay||0;let{elapsed:c=0}=i;c=c-Yi(l);let u={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:e.getVelocity(),...a,delay:-c,onUpdate:d=>{e.set(d),a.onUpdate&&a.onUpdate(d)},onComplete:()=>{o(),a.onComplete&&a.onComplete()},name:t,motionValue:e,element:s?void 0:r};WC(a)||(u={...u,...jC(t,u)}),u.duration&&(u.duration=Yi(u.duration)),u.repeatDelay&&(u.repeatDelay=Yi(u.repeatDelay)),u.from!==void 0&&(u.keyframes[0]=u.from);let f=!1;if((u.type===!1||u.duration===0&&!u.repeatDelay)&&(u.duration=0,u.delay===0&&(f=!0)),f&&!s&&e.get()!==void 0){const d=rd(u.keyframes,a);if(d!==void 0)return Et.update(()=>{u.onUpdate(d),u.onComplete()}),new uA([])}return!s&&Bv.supports(u)?new Bv(u):new gg(u)};function XC({protectedKeys:t,needsAnimating:e},n){const i=t.hasOwnProperty(n)&&e[n]!==!0;return e[n]=!1,i}function v1(t,e,{delay:n=0,transitionOverride:i,type:r}={}){var s;let{transition:o=t.getDefaultTransition(),transitionEnd:a,...l}=e;i&&(o=i);const c=[],u=r&&t.animationState&&t.animationState.getState()[r];for(const f in l){const d=t.getValue(f,(s=t.latestValues[f])!==null&&s!==void 0?s:null),p=l[f];if(p===void 0||u&&XC(u,f))continue;const v={delay:n,...ng(o||{},f)};let S=!1;if(window.MotionHandoffAnimation){const h=VM(t);if(h){const m=window.MotionHandoffAnimation(h,f,Et);m!==null&&(v.startTime=m,S=!0)}}Fh(t,f),d.start(vg(f,d,p,t.shouldReduceMotion&&BM.has(f)?{type:!1}:v,t,S));const g=d.animation;g&&c.push(g)}return a&&Promise.all(c).then(()=>{Et.update(()=>{a&&TA(t,a)})}),c}function Hh(t,e,n={}){var i;const r=id(t,e,n.type==="exit"?(i=t.presenceContext)===null||i===void 0?void 0:i.custom:void 0);let{transition:s=t.getDefaultTransition()||{}}=r||{};n.transitionOverride&&(s=n.transitionOverride);const o=r?()=>Promise.all(v1(t,r,n)):()=>Promise.resolve(),a=t.variantChildren&&t.variantChildren.size?(c=0)=>{const{delayChildren:u=0,staggerChildren:f,staggerDirection:d}=s;return $C(t,e,u+c,f,d,n)}:()=>Promise.resolve(),{when:l}=s;if(l){const[c,u]=l==="beforeChildren"?[o,a]:[a,o];return c().then(()=>u())}else return Promise.all([o(),a(n.delay)])}function $C(t,e,n=0,i=0,r=1,s){const o=[],a=(t.variantChildren.size-1)*i,l=r===1?(c=0)=>c*i:(c=0)=>a-c*i;return Array.from(t.variantChildren).sort(YC).forEach((c,u)=>{c.notify("AnimationStart",e),o.push(Hh(c,e,{...s,delay:n+l(u)}).then(()=>c.notify("AnimationComplete",e)))}),Promise.all(o)}function YC(t,e){return t.sortNodePosition(e)}function KC(t,e,n={}){t.notify("AnimationStart",e);let i;if(Array.isArray(e)){const r=e.map(s=>Hh(t,s,n));i=Promise.all(r)}else if(typeof e=="string")i=Hh(t,e,n);else{const r=typeof e=="function"?id(t,e,n.custom):e;i=Promise.all(v1(t,r,n))}return i.then(()=>{t.notify("AnimationComplete",e)})}const qC=jm.length;function x1(t){if(!t)return;if(!t.isControllingVariants){const n=t.parent?x1(t.parent)||{}:{};return t.props.initial!==void 0&&(n.initial=t.props.initial),n}const e={};for(let n=0;n<qC;n++){const i=jm[n],r=t.props[i];(Ja(r)||r===!1)&&(e[i]=r)}return e}const ZC=[...Hm].reverse(),QC=Hm.length;function JC(t){return e=>Promise.all(e.map(({animation:n,options:i})=>KC(t,n,i)))}function eR(t){let e=JC(t),n=zv(),i=!0;const r=l=>(c,u)=>{var f;const d=id(t,u,l==="exit"?(f=t.presenceContext)===null||f===void 0?void 0:f.custom:void 0);if(d){const{transition:p,transitionEnd:v,...S}=d;c={...c,...S,...v}}return c};function s(l){e=l(t)}function o(l){const{props:c}=t,u=x1(t.parent)||{},f=[],d=new Set;let p={},v=1/0;for(let g=0;g<QC;g++){const h=ZC[g],m=n[h],_=c[h]!==void 0?c[h]:u[h],M=Ja(_),w=h===l?m.isActive:null;w===!1&&(v=g);let T=_===u[h]&&_!==c[h]&&M;if(T&&i&&t.manuallyAnimateOnMount&&(T=!1),m.protectedKeys={...p},!m.isActive&&w===null||!_&&!m.prevProp||td(_)||typeof _=="boolean")continue;const R=tR(m.prevProp,_);let y=R||h===l&&m.isActive&&!T&&M||g>v&&M,C=!1;const D=Array.isArray(_)?_:[_];let P=D.reduce(r(h),{});w===!1&&(P={});const{prevResolvedValues:N={}}=m,H={...N,...P},V=B=>{y=!0,d.has(B)&&(C=!0,d.delete(B)),m.needsAnimating[B]=!0;const I=t.getValue(B);I&&(I.liveStyle=!1)};for(const B in H){const I=P[B],$=N[B];if(p.hasOwnProperty(B))continue;let K=!1;Lh(I)&&Lh($)?K=!DM(I,$):K=I!==$,K?I!=null?V(B):d.add(B):I!==void 0&&d.has(B)?V(B):m.protectedKeys[B]=!0}m.prevProp=_,m.prevResolvedValues=P,m.isActive&&(p={...p,...P}),i&&t.blockInitialAnimation&&(y=!1),y&&(!(T&&R)||C)&&f.push(...D.map(B=>({animation:B,options:{type:h}})))}if(d.size){const g={};d.forEach(h=>{const m=t.getBaseTarget(h),_=t.getValue(h);_&&(_.liveStyle=!0),g[h]=m??null}),f.push({animation:g})}let S=!!f.length;return i&&(c.initial===!1||c.initial===c.animate)&&!t.manuallyAnimateOnMount&&(S=!1),i=!1,S?e(f):Promise.resolve()}function a(l,c){var u;if(n[l].isActive===c)return Promise.resolve();(u=t.variantChildren)===null||u===void 0||u.forEach(d=>{var p;return(p=d.animationState)===null||p===void 0?void 0:p.setActive(l,c)}),n[l].isActive=c;const f=o(l);for(const d in n)n[d].protectedKeys={};return f}return{animateChanges:o,setActive:a,setAnimateFunction:s,getState:()=>n,reset:()=>{n=zv(),i=!0}}}function tR(t,e){return typeof e=="string"?e!==t:Array.isArray(e)?!DM(e,t):!1}function Kr(t=!1){return{isActive:t,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function zv(){return{animate:Kr(!0),whileInView:Kr(),whileHover:Kr(),whileTap:Kr(),whileDrag:Kr(),whileFocus:Kr(),exit:Kr()}}class Xr{constructor(e){this.isMounted=!1,this.node=e}update(){}}class nR extends Xr{constructor(e){super(e),e.animationState||(e.animationState=eR(e))}updateAnimationControlsSubscription(){const{animate:e}=this.node.getProps();td(e)&&(this.unmountControls=e.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:e}=this.node.getProps(),{animate:n}=this.node.prevProps||{};e!==n&&this.updateAnimationControlsSubscription()}unmount(){var e;this.node.animationState.reset(),(e=this.unmountControls)===null||e===void 0||e.call(this)}}let iR=0;class rR extends Xr{constructor(){super(...arguments),this.id=iR++}update(){if(!this.node.presenceContext)return;const{isPresent:e,onExitComplete:n}=this.node.presenceContext,{isPresent:i}=this.node.prevPresenceContext||{};if(!this.node.animationState||e===i)return;const r=this.node.animationState.setActive("exit",!e);n&&!e&&r.then(()=>n(this.id))}mount(){const{register:e}=this.node.presenceContext||{};e&&(this.unmount=e(this.id))}unmount(){}}const sR={animation:{Feature:nR},exit:{Feature:rR}};function il(t,e,n,i={passive:!0}){return t.addEventListener(e,n,i),()=>t.removeEventListener(e,n)}function vl(t){return{point:{x:t.pageX,y:t.pageY}}}const oR=t=>e=>sg(e)&&t(e,vl(e));function Ra(t,e,n,i){return il(t,e,oR(n),i)}const Vv=(t,e)=>Math.abs(t-e);function aR(t,e){const n=Vv(t.x,e.x),i=Vv(t.y,e.y);return Math.sqrt(n**2+i**2)}class _1{constructor(e,n,{transformPagePoint:i,contextWindow:r,dragSnapToOrigin:s=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const f=Wd(this.lastMoveEventInfo,this.history),d=this.startEvent!==null,p=aR(f.offset,{x:0,y:0})>=3;if(!d&&!p)return;const{point:v}=f,{timestamp:S}=Qt;this.history.push({...v,timestamp:S});const{onStart:g,onMove:h}=this.handlers;d||(g&&g(this.lastMoveEvent,f),this.startEvent=this.lastMoveEvent),h&&h(this.lastMoveEvent,f)},this.handlePointerMove=(f,d)=>{this.lastMoveEvent=f,this.lastMoveEventInfo=jd(d,this.transformPagePoint),Et.update(this.updatePoint,!0)},this.handlePointerUp=(f,d)=>{this.end();const{onEnd:p,onSessionEnd:v,resumeAnimation:S}=this.handlers;if(this.dragSnapToOrigin&&S&&S(),!(this.lastMoveEvent&&this.lastMoveEventInfo))return;const g=Wd(f.type==="pointercancel"?this.lastMoveEventInfo:jd(d,this.transformPagePoint),this.history);this.startEvent&&p&&p(f,g),v&&v(f,g)},!sg(e))return;this.dragSnapToOrigin=s,this.handlers=n,this.transformPagePoint=i,this.contextWindow=r||window;const o=vl(e),a=jd(o,this.transformPagePoint),{point:l}=a,{timestamp:c}=Qt;this.history=[{...l,timestamp:c}];const{onSessionStart:u}=n;u&&u(e,Wd(a,this.history)),this.removeListeners=gl(Ra(this.contextWindow,"pointermove",this.handlePointerMove),Ra(this.contextWindow,"pointerup",this.handlePointerUp),Ra(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),kr(this.updatePoint)}}function jd(t,e){return e?{point:e(t.point)}:t}function Gv(t,e){return{x:t.x-e.x,y:t.y-e.y}}function Wd({point:t},e){return{point:t,delta:Gv(t,y1(e)),offset:Gv(t,lR(e)),velocity:cR(e,.1)}}function lR(t){return t[0]}function y1(t){return t[t.length-1]}function cR(t,e){if(t.length<2)return{x:0,y:0};let n=t.length-1,i=null;const r=y1(t);for(;n>=0&&(i=t[n],!(r.timestamp-i.timestamp>Yi(e)));)n--;if(!i)return{x:0,y:0};const s=Ki(r.timestamp-i.timestamp);if(s===0)return{x:0,y:0};const o={x:(r.x-i.x)/s,y:(r.y-i.y)/s};return o.x===1/0&&(o.x=0),o.y===1/0&&(o.y=0),o}const S1=1e-4,uR=1-S1,dR=1+S1,M1=.01,fR=0-M1,hR=0+M1;function kn(t){return t.max-t.min}function pR(t,e,n){return Math.abs(t-e)<=n}function Hv(t,e,n,i=.5){t.origin=i,t.originPoint=bt(e.min,e.max,t.origin),t.scale=kn(n)/kn(e),t.translate=bt(n.min,n.max,t.origin)-t.originPoint,(t.scale>=uR&&t.scale<=dR||isNaN(t.scale))&&(t.scale=1),(t.translate>=fR&&t.translate<=hR||isNaN(t.translate))&&(t.translate=0)}function Pa(t,e,n,i){Hv(t.x,e.x,n.x,i?i.originX:void 0),Hv(t.y,e.y,n.y,i?i.originY:void 0)}function jv(t,e,n){t.min=n.min+e.min,t.max=t.min+kn(e)}function mR(t,e,n){jv(t.x,e.x,n.x),jv(t.y,e.y,n.y)}function Wv(t,e,n){t.min=e.min-n.min,t.max=t.min+kn(e)}function Da(t,e,n){Wv(t.x,e.x,n.x),Wv(t.y,e.y,n.y)}function gR(t,{min:e,max:n},i){return e!==void 0&&t<e?t=i?bt(e,t,i.min):Math.max(t,e):n!==void 0&&t>n&&(t=i?bt(n,t,i.max):Math.min(t,n)),t}function Xv(t,e,n){return{min:e!==void 0?t.min+e:void 0,max:n!==void 0?t.max+n-(t.max-t.min):void 0}}function vR(t,{top:e,left:n,bottom:i,right:r}){return{x:Xv(t.x,n,r),y:Xv(t.y,e,i)}}function $v(t,e){let n=e.min-t.min,i=e.max-t.max;return e.max-e.min<t.max-t.min&&([n,i]=[i,n]),{min:n,max:i}}function xR(t,e){return{x:$v(t.x,e.x),y:$v(t.y,e.y)}}function _R(t,e){let n=.5;const i=kn(t),r=kn(e);return r>i?n=No(e.min,e.max-i,t.min):i>r&&(n=No(t.min,t.max-r,e.min)),ir(0,1,n)}function yR(t,e){const n={};return e.min!==void 0&&(n.min=e.min-t.min),e.max!==void 0&&(n.max=e.max-t.min),n}const jh=.35;function SR(t=jh){return t===!1?t=0:t===!0&&(t=jh),{x:Yv(t,"left","right"),y:Yv(t,"top","bottom")}}function Yv(t,e,n){return{min:Kv(t,e),max:Kv(t,n)}}function Kv(t,e){return typeof t=="number"?t:t[e]||0}const qv=()=>({translate:0,scale:1,origin:0,originPoint:0}),ho=()=>({x:qv(),y:qv()}),Zv=()=>({min:0,max:0}),Ft=()=>({x:Zv(),y:Zv()});function jn(t){return[t("x"),t("y")]}function E1({top:t,left:e,right:n,bottom:i}){return{x:{min:e,max:n},y:{min:t,max:i}}}function MR({x:t,y:e}){return{top:e.min,right:t.max,bottom:e.max,left:t.min}}function ER(t,e){if(!e)return t;const n=e({x:t.left,y:t.top}),i=e({x:t.right,y:t.bottom});return{top:n.y,left:n.x,bottom:i.y,right:i.x}}function Xd(t){return t===void 0||t===1}function Wh({scale:t,scaleX:e,scaleY:n}){return!Xd(t)||!Xd(e)||!Xd(n)}function ns(t){return Wh(t)||T1(t)||t.z||t.rotate||t.rotateX||t.rotateY||t.skewX||t.skewY}function T1(t){return Qv(t.x)||Qv(t.y)}function Qv(t){return t&&t!=="0%"}function wu(t,e,n){const i=t-n,r=e*i;return n+r}function Jv(t,e,n,i,r){return r!==void 0&&(t=wu(t,r,i)),wu(t,n,i)+e}function Xh(t,e=0,n=1,i,r){t.min=Jv(t.min,e,n,i,r),t.max=Jv(t.max,e,n,i,r)}function w1(t,{x:e,y:n}){Xh(t.x,e.translate,e.scale,e.originPoint),Xh(t.y,n.translate,n.scale,n.originPoint)}const ex=.999999999999,tx=1.0000000000001;function TR(t,e,n,i=!1){const r=n.length;if(!r)return;e.x=e.y=1;let s,o;for(let a=0;a<r;a++){s=n[a],o=s.projectionDelta;const{visualElement:l}=s.options;l&&l.props.style&&l.props.style.display==="contents"||(i&&s.options.layoutScroll&&s.scroll&&s!==s.root&&mo(t,{x:-s.scroll.offset.x,y:-s.scroll.offset.y}),o&&(e.x*=o.x.scale,e.y*=o.y.scale,w1(t,o)),i&&ns(s.latestValues)&&mo(t,s.latestValues))}e.x<tx&&e.x>ex&&(e.x=1),e.y<tx&&e.y>ex&&(e.y=1)}function po(t,e){t.min=t.min+e,t.max=t.max+e}function nx(t,e,n,i,r=.5){const s=bt(t.min,t.max,r);Xh(t,e,n,s,i)}function mo(t,e){nx(t.x,e.x,e.scaleX,e.scale,e.originX),nx(t.y,e.y,e.scaleY,e.scale,e.originY)}function b1(t,e){return E1(ER(t.getBoundingClientRect(),e))}function wR(t,e,n){const i=b1(t,n),{scroll:r}=e;return r&&(po(i.x,r.offset.x),po(i.y,r.offset.y)),i}const A1=({current:t})=>t?t.ownerDocument.defaultView:null,bR=new WeakMap;class AR{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic=Ft(),this.visualElement=e}start(e,{snapToCursor:n=!1}={}){const{presenceContext:i}=this.visualElement;if(i&&i.isPresent===!1)return;const r=u=>{const{dragSnapToOrigin:f}=this.getProps();f?this.pauseAnimation():this.stopAnimation(),n&&this.snapToCursor(vl(u).point)},s=(u,f)=>{const{drag:d,dragPropagation:p,onDragStart:v}=this.getProps();if(d&&!p&&(this.openDragLock&&this.openDragLock(),this.openDragLock=_A(d),!this.openDragLock))return;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),jn(g=>{let h=this.getAxisMotionValue(g).get()||0;if(Di.test(h)){const{projection:m}=this.visualElement;if(m&&m.layout){const _=m.layout.layoutBox[g];_&&(h=kn(_)*(parseFloat(h)/100))}}this.originPoint[g]=h}),v&&Et.postRender(()=>v(u,f)),Fh(this.visualElement,"transform");const{animationState:S}=this.visualElement;S&&S.setActive("whileDrag",!0)},o=(u,f)=>{const{dragPropagation:d,dragDirectionLock:p,onDirectionLock:v,onDrag:S}=this.getProps();if(!d&&!this.openDragLock)return;const{offset:g}=f;if(p&&this.currentDirection===null){this.currentDirection=CR(g),this.currentDirection!==null&&v&&v(this.currentDirection);return}this.updateAxis("x",f.point,g),this.updateAxis("y",f.point,g),this.visualElement.render(),S&&S(u,f)},a=(u,f)=>this.stop(u,f),l=()=>jn(u=>{var f;return this.getAnimationState(u)==="paused"&&((f=this.getAxisMotionValue(u).animation)===null||f===void 0?void 0:f.play())}),{dragSnapToOrigin:c}=this.getProps();this.panSession=new _1(e,{onSessionStart:r,onStart:s,onMove:o,onSessionEnd:a,resumeAnimation:l},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:c,contextWindow:A1(this.visualElement)})}stop(e,n){const i=this.isDragging;if(this.cancel(),!i)return;const{velocity:r}=n;this.startAnimation(r);const{onDragEnd:s}=this.getProps();s&&Et.postRender(()=>s(e,n))}cancel(){this.isDragging=!1;const{projection:e,animationState:n}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:i}=this.getProps();!i&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),n&&n.setActive("whileDrag",!1)}updateAxis(e,n,i){const{drag:r}=this.getProps();if(!i||!Xl(e,r,this.currentDirection))return;const s=this.getAxisMotionValue(e);let o=this.originPoint[e]+i[e];this.constraints&&this.constraints[e]&&(o=gR(o,this.constraints[e],this.elastic[e])),s.set(o)}resolveConstraints(){var e;const{dragConstraints:n,dragElastic:i}=this.getProps(),r=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):(e=this.visualElement.projection)===null||e===void 0?void 0:e.layout,s=this.constraints;n&&uo(n)?this.constraints||(this.constraints=this.resolveRefConstraints()):n&&r?this.constraints=vR(r.layoutBox,n):this.constraints=!1,this.elastic=SR(i),s!==this.constraints&&r&&this.constraints&&!this.hasMutatedConstraints&&jn(o=>{this.constraints!==!1&&this.getAxisMotionValue(o)&&(this.constraints[o]=yR(r.layoutBox[o],this.constraints[o]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:n}=this.getProps();if(!e||!uo(e))return!1;const i=e.current,{projection:r}=this.visualElement;if(!r||!r.layout)return!1;const s=wR(i,r.root,this.visualElement.getTransformPagePoint());let o=xR(r.layout.layoutBox,s);if(n){const a=n(MR(o));this.hasMutatedConstraints=!!a,a&&(o=E1(a))}return o}startAnimation(e){const{drag:n,dragMomentum:i,dragElastic:r,dragTransition:s,dragSnapToOrigin:o,onDragTransitionEnd:a}=this.getProps(),l=this.constraints||{},c=jn(u=>{if(!Xl(u,n,this.currentDirection))return;let f=l&&l[u]||{};o&&(f={min:0,max:0});const d=r?200:1e6,p=r?40:1e7,v={type:"inertia",velocity:i?e[u]:0,bounceStiffness:d,bounceDamping:p,timeConstant:750,restDelta:1,restSpeed:10,...s,...f};return this.startAxisValueAnimation(u,v)});return Promise.all(c).then(a)}startAxisValueAnimation(e,n){const i=this.getAxisMotionValue(e);return Fh(this.visualElement,e),i.start(vg(e,i,0,n,this.visualElement,!1))}stopAnimation(){jn(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){jn(e=>{var n;return(n=this.getAxisMotionValue(e).animation)===null||n===void 0?void 0:n.pause()})}getAnimationState(e){var n;return(n=this.getAxisMotionValue(e).animation)===null||n===void 0?void 0:n.state}getAxisMotionValue(e){const n=`_drag${e.toUpperCase()}`,i=this.visualElement.getProps(),r=i[n];return r||this.visualElement.getValue(e,(i.initial?i.initial[e]:void 0)||0)}snapToCursor(e){jn(n=>{const{drag:i}=this.getProps();if(!Xl(n,i,this.currentDirection))return;const{projection:r}=this.visualElement,s=this.getAxisMotionValue(n);if(r&&r.layout){const{min:o,max:a}=r.layout.layoutBox[n];s.set(e[n]-bt(o,a,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:n}=this.getProps(),{projection:i}=this.visualElement;if(!uo(n)||!i||!this.constraints)return;this.stopAnimation();const r={x:0,y:0};jn(o=>{const a=this.getAxisMotionValue(o);if(a&&this.constraints!==!1){const l=a.get();r[o]=_R({min:l,max:l},this.constraints[o])}});const{transformTemplate:s}=this.visualElement.getProps();this.visualElement.current.style.transform=s?s({},""):"none",i.root&&i.root.updateScroll(),i.updateLayout(),this.resolveConstraints(),jn(o=>{if(!Xl(o,e,null))return;const a=this.getAxisMotionValue(o),{min:l,max:c}=this.constraints[o];a.set(bt(l,c,r[o]))})}addListeners(){if(!this.visualElement.current)return;bR.set(this.visualElement,this);const e=this.visualElement.current,n=Ra(e,"pointerdown",l=>{const{drag:c,dragListener:u=!0}=this.getProps();c&&u&&this.start(l)}),i=()=>{const{dragConstraints:l}=this.getProps();uo(l)&&l.current&&(this.constraints=this.resolveRefConstraints())},{projection:r}=this.visualElement,s=r.addEventListener("measure",i);r&&!r.layout&&(r.root&&r.root.updateScroll(),r.updateLayout()),Et.read(i);const o=il(window,"resize",()=>this.scalePositionWithinConstraints()),a=r.addEventListener("didUpdate",({delta:l,hasLayoutChanged:c})=>{this.isDragging&&c&&(jn(u=>{const f=this.getAxisMotionValue(u);f&&(this.originPoint[u]+=l[u].translate,f.set(f.get()+l[u].translate))}),this.visualElement.render())});return()=>{o(),n(),s(),a&&a()}}getProps(){const e=this.visualElement.getProps(),{drag:n=!1,dragDirectionLock:i=!1,dragPropagation:r=!1,dragConstraints:s=!1,dragElastic:o=jh,dragMomentum:a=!0}=e;return{...e,drag:n,dragDirectionLock:i,dragPropagation:r,dragConstraints:s,dragElastic:o,dragMomentum:a}}}function Xl(t,e,n){return(e===!0||e===t)&&(n===null||n===t)}function CR(t,e=10){let n=null;return Math.abs(t.y)>e?n="y":Math.abs(t.x)>e&&(n="x"),n}class RR extends Xr{constructor(e){super(e),this.removeGroupControls=Fn,this.removeListeners=Fn,this.controls=new AR(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||Fn}unmount(){this.removeGroupControls(),this.removeListeners()}}const ix=t=>(e,n)=>{t&&Et.postRender(()=>t(e,n))};class PR extends Xr{constructor(){super(...arguments),this.removePointerDownListener=Fn}onPointerDown(e){this.session=new _1(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:A1(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:n,onPan:i,onPanEnd:r}=this.node.getProps();return{onSessionStart:ix(e),onStart:ix(n),onMove:i,onEnd:(s,o)=>{delete this.session,r&&Et.postRender(()=>r(s,o))}}}mount(){this.removePointerDownListener=Ra(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}const zc={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function rx(t,e){return e.max===e.min?0:t/(e.max-e.min)*100}const ta={correct:(t,e)=>{if(!e.target)return t;if(typeof t=="string")if(Ue.test(t))t=parseFloat(t);else return t;const n=rx(t,e.target.x),i=rx(t,e.target.y);return`${n}% ${i}%`}},DR={correct:(t,{treeScale:e,projectionDelta:n})=>{const i=t,r=Br.parse(t);if(r.length>5)return i;const s=Br.createTransformer(t),o=typeof r[0]!="number"?1:0,a=n.x.scale*e.x,l=n.y.scale*e.y;r[0+o]/=a,r[1+o]/=l;const c=bt(a,l,.5);return typeof r[2+o]=="number"&&(r[2+o]/=c),typeof r[3+o]=="number"&&(r[3+o]/=c),s(r)}};class NR extends G.Component{componentDidMount(){const{visualElement:e,layoutGroup:n,switchLayoutGroup:i,layoutId:r}=this.props,{projection:s}=e;Qb(LR),s&&(n.group&&n.group.add(s),i&&i.register&&r&&i.register(s),s.root.didUpdate(),s.addEventListener("animationComplete",()=>{this.safeToRemove()}),s.setOptions({...s.options,onExitComplete:()=>this.safeToRemove()})),zc.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:n,visualElement:i,drag:r,isPresent:s}=this.props,o=i.projection;return o&&(o.isPresent=s,r||e.layoutDependency!==n||n===void 0?o.willUpdate():this.safeToRemove(),e.isPresent!==s&&(s?o.promote():o.relegate()||Et.postRender(()=>{const a=o.getStack();(!a||!a.members.length)&&this.safeToRemove()}))),null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Xm.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:n,switchLayoutGroup:i}=this.props,{projection:r}=e;r&&(r.scheduleCheckAfterUnmount(),n&&n.group&&n.group.remove(r),i&&i.deregister&&i.deregister(r))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function C1(t){const[e,n]=uM(),i=G.useContext(km);return x.jsx(NR,{...t,layoutGroup:i,switchLayoutGroup:G.useContext(xM),isPresent:e,safeToRemove:n})}const LR={borderRadius:{...ta,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:ta,borderTopRightRadius:ta,borderBottomLeftRadius:ta,borderBottomRightRadius:ta,boxShadow:DR};function IR(t,e,n){const i=un(t)?t:tl(t);return i.start(vg("",i,e,n)),i.animation}function UR(t){return t instanceof SVGElement&&t.tagName!=="svg"}const FR=(t,e)=>t.depth-e.depth;class OR{constructor(){this.children=[],this.isDirty=!1}add(e){og(this.children,e),this.isDirty=!0}remove(e){ag(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(FR),this.isDirty=!1,this.children.forEach(e)}}function kR(t,e){const n=Ni.now(),i=({timestamp:r})=>{const s=r-n;s>=e&&(kr(i),t(s-e))};return Et.read(i,!0),()=>kr(i)}const R1=["TopLeft","TopRight","BottomLeft","BottomRight"],BR=R1.length,sx=t=>typeof t=="string"?parseFloat(t):t,ox=t=>typeof t=="number"||Ue.test(t);function zR(t,e,n,i,r,s){r?(t.opacity=bt(0,n.opacity!==void 0?n.opacity:1,VR(i)),t.opacityExit=bt(e.opacity!==void 0?e.opacity:1,0,GR(i))):s&&(t.opacity=bt(e.opacity!==void 0?e.opacity:1,n.opacity!==void 0?n.opacity:1,i));for(let o=0;o<BR;o++){const a=`border${R1[o]}Radius`;let l=ax(e,a),c=ax(n,a);if(l===void 0&&c===void 0)continue;l||(l=0),c||(c=0),l===0||c===0||ox(l)===ox(c)?(t[a]=Math.max(bt(sx(l),sx(c),i),0),(Di.test(c)||Di.test(l))&&(t[a]+="%")):t[a]=c}(e.rotate||n.rotate)&&(t.rotate=bt(e.rotate||0,n.rotate||0,i))}function ax(t,e){return t[e]!==void 0?t[e]:t.borderRadius}const VR=P1(0,.5,YM),GR=P1(.5,.95,Fn);function P1(t,e,n){return i=>i<t?0:i>e?1:n(No(t,e,i))}function lx(t,e){t.min=e.min,t.max=e.max}function Gn(t,e){lx(t.x,e.x),lx(t.y,e.y)}function cx(t,e){t.translate=e.translate,t.scale=e.scale,t.originPoint=e.originPoint,t.origin=e.origin}function ux(t,e,n,i,r){return t-=e,t=wu(t,1/n,i),r!==void 0&&(t=wu(t,1/r,i)),t}function HR(t,e=0,n=1,i=.5,r,s=t,o=t){if(Di.test(e)&&(e=parseFloat(e),e=bt(o.min,o.max,e/100)-o.min),typeof e!="number")return;let a=bt(s.min,s.max,i);t===s&&(a-=e),t.min=ux(t.min,e,n,a,r),t.max=ux(t.max,e,n,a,r)}function dx(t,e,[n,i,r],s,o){HR(t,e[n],e[i],e[r],e.scale,s,o)}const jR=["x","scaleX","originX"],WR=["y","scaleY","originY"];function fx(t,e,n,i){dx(t.x,e,jR,n?n.x:void 0,i?i.x:void 0),dx(t.y,e,WR,n?n.y:void 0,i?i.y:void 0)}function hx(t){return t.translate===0&&t.scale===1}function D1(t){return hx(t.x)&&hx(t.y)}function px(t,e){return t.min===e.min&&t.max===e.max}function XR(t,e){return px(t.x,e.x)&&px(t.y,e.y)}function mx(t,e){return Math.round(t.min)===Math.round(e.min)&&Math.round(t.max)===Math.round(e.max)}function N1(t,e){return mx(t.x,e.x)&&mx(t.y,e.y)}function gx(t){return kn(t.x)/kn(t.y)}function vx(t,e){return t.translate===e.translate&&t.scale===e.scale&&t.originPoint===e.originPoint}class $R{constructor(){this.members=[]}add(e){og(this.members,e),e.scheduleRender()}remove(e){if(ag(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const n=this.members[this.members.length-1];n&&this.promote(n)}}relegate(e){const n=this.members.findIndex(r=>e===r);if(n===0)return!1;let i;for(let r=n;r>=0;r--){const s=this.members[r];if(s.isPresent!==!1){i=s;break}}return i?(this.promote(i),!0):!1}promote(e,n){const i=this.lead;if(e!==i&&(this.prevLead=i,this.lead=e,e.show(),i)){i.instance&&i.scheduleRender(),e.scheduleRender(),e.resumeFrom=i,n&&(e.resumeFrom.preserveOpacity=!0),i.snapshot&&(e.snapshot=i.snapshot,e.snapshot.latestValues=i.animationValues||i.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:r}=e.options;r===!1&&i.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:n,resumingFrom:i}=e;n.onExitComplete&&n.onExitComplete(),i&&i.options.onExitComplete&&i.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}function YR(t,e,n){let i="";const r=t.x.translate/e.x,s=t.y.translate/e.y,o=(n==null?void 0:n.z)||0;if((r||s||o)&&(i=`translate3d(${r}px, ${s}px, ${o}px) `),(e.x!==1||e.y!==1)&&(i+=`scale(${1/e.x}, ${1/e.y}) `),n){const{transformPerspective:c,rotate:u,rotateX:f,rotateY:d,skewX:p,skewY:v}=n;c&&(i=`perspective(${c}px) ${i}`),u&&(i+=`rotate(${u}deg) `),f&&(i+=`rotateX(${f}deg) `),d&&(i+=`rotateY(${d}deg) `),p&&(i+=`skewX(${p}deg) `),v&&(i+=`skewY(${v}deg) `)}const a=t.x.scale*e.x,l=t.y.scale*e.y;return(a!==1||l!==1)&&(i+=`scale(${a}, ${l})`),i||"none"}const is={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0},ma=typeof window<"u"&&window.MotionDebug!==void 0,$d=["","X","Y","Z"],KR={visibility:"hidden"},xx=1e3;let qR=0;function Yd(t,e,n,i){const{latestValues:r}=e;r[t]&&(n[t]=r[t],e.setStaticValue(t,0),i&&(i[t]=0))}function L1(t){if(t.hasCheckedOptimisedAppear=!0,t.root===t)return;const{visualElement:e}=t.options;if(!e)return;const n=VM(e);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:r,layoutId:s}=t.options;window.MotionCancelOptimisedAnimation(n,"transform",Et,!(r||s))}const{parent:i}=t;i&&!i.hasCheckedOptimisedAppear&&L1(i)}function I1({attachResizeListener:t,defaultParent:e,measureScroll:n,checkIsScrollRoot:i,resetTransform:r}){return class{constructor(o={},a=e==null?void 0:e()){this.id=qR++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,ma&&(is.totalNodes=is.resolvedTargetDeltas=is.recalculatedProjection=0),this.nodes.forEach(JR),this.nodes.forEach(rP),this.nodes.forEach(sP),this.nodes.forEach(eP),ma&&window.MotionDebug.record(is)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=o,this.root=a?a.root||a:this,this.path=a?[...a.path,a]:[],this.parent=a,this.depth=a?a.depth+1:0;for(let l=0;l<this.path.length;l++)this.path[l].shouldResetTransform=!0;this.root===this&&(this.nodes=new OR)}addEventListener(o,a){return this.eventHandlers.has(o)||this.eventHandlers.set(o,new lg),this.eventHandlers.get(o).add(a)}notifyListeners(o,...a){const l=this.eventHandlers.get(o);l&&l.notify(...a)}hasListeners(o){return this.eventHandlers.has(o)}mount(o,a=this.root.hasTreeAnimated){if(this.instance)return;this.isSVG=UR(o),this.instance=o;const{layoutId:l,layout:c,visualElement:u}=this.options;if(u&&!u.current&&u.mount(o),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),a&&(c||l)&&(this.isLayoutDirty=!0),t){let f;const d=()=>this.root.updateBlockedByResize=!1;t(o,()=>{this.root.updateBlockedByResize=!0,f&&f(),f=kR(d,250),zc.hasAnimatedSinceResize&&(zc.hasAnimatedSinceResize=!1,this.nodes.forEach(yx))})}l&&this.root.registerSharedNode(l,this),this.options.animate!==!1&&u&&(l||c)&&this.addEventListener("didUpdate",({delta:f,hasLayoutChanged:d,hasRelativeTargetChanged:p,layout:v})=>{if(this.isTreeAnimationBlocked()){this.target=void 0,this.relativeTarget=void 0;return}const S=this.options.transition||u.getDefaultTransition()||uP,{onLayoutAnimationStart:g,onLayoutAnimationComplete:h}=u.getProps(),m=!this.targetLayout||!N1(this.targetLayout,v)||p,_=!d&&p;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||_||d&&(m||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(f,_);const M={...ng(S,"layout"),onPlay:g,onComplete:h};(u.shouldReduceMotion||this.options.layoutRoot)&&(M.delay=0,M.type=!1),this.startAnimation(M)}else d||yx(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=v})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const o=this.getStack();o&&o.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,kr(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(oP),this.animationId++)}getTransformTemplate(){const{visualElement:o}=this.options;return o&&o.getProps().transformTemplate}willUpdate(o=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked()){this.options.onExitComplete&&this.options.onExitComplete();return}if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&L1(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let u=0;u<this.path.length;u++){const f=this.path[u];f.shouldResetTransform=!0,f.updateScroll("snapshot"),f.options.layoutRoot&&f.willUpdate(!1)}const{layoutId:a,layout:l}=this.options;if(a===void 0&&!l)return;const c=this.getTransformTemplate();this.prevTransformTemplateValue=c?c(this.latestValues,""):void 0,this.updateSnapshot(),o&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked()){this.unblockUpdate(),this.clearAllSnapshots(),this.nodes.forEach(_x);return}this.isUpdating||this.nodes.forEach(nP),this.isUpdating=!1,this.nodes.forEach(iP),this.nodes.forEach(ZR),this.nodes.forEach(QR),this.clearAllSnapshots();const a=Ni.now();Qt.delta=ir(0,1e3/60,a-Qt.timestamp),Qt.timestamp=a,Qt.isProcessing=!0,kd.update.process(Qt),kd.preRender.process(Qt),kd.render.process(Qt),Qt.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Xm.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(tP),this.sharedNodes.forEach(aP)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,Et.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){Et.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){this.snapshot||!this.instance||(this.snapshot=this.measure())}updateLayout(){if(!this.instance||(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead())&&!this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let l=0;l<this.path.length;l++)this.path[l].updateScroll();const o=this.layout;this.layout=this.measure(!1),this.layoutCorrected=Ft(),this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:a}=this.options;a&&a.notify("LayoutMeasure",this.layout.layoutBox,o?o.layoutBox:void 0)}updateScroll(o="measure"){let a=!!(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===o&&(a=!1),a){const l=i(this.instance);this.scroll={animationId:this.root.animationId,phase:o,isRoot:l,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:l}}}resetTransform(){if(!r)return;const o=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,a=this.projectionDelta&&!D1(this.projectionDelta),l=this.getTransformTemplate(),c=l?l(this.latestValues,""):void 0,u=c!==this.prevTransformTemplateValue;o&&(a||ns(this.latestValues)||u)&&(r(this.instance,c),this.shouldResetTransform=!1,this.scheduleRender())}measure(o=!0){const a=this.measurePageBox();let l=this.removeElementScroll(a);return o&&(l=this.removeTransform(l)),dP(l),{animationId:this.root.animationId,measuredBox:a,layoutBox:l,latestValues:{},source:this.id}}measurePageBox(){var o;const{visualElement:a}=this.options;if(!a)return Ft();const l=a.measureViewportBox();if(!(((o=this.scroll)===null||o===void 0?void 0:o.wasRoot)||this.path.some(fP))){const{scroll:u}=this.root;u&&(po(l.x,u.offset.x),po(l.y,u.offset.y))}return l}removeElementScroll(o){var a;const l=Ft();if(Gn(l,o),!((a=this.scroll)===null||a===void 0)&&a.wasRoot)return l;for(let c=0;c<this.path.length;c++){const u=this.path[c],{scroll:f,options:d}=u;u!==this.root&&f&&d.layoutScroll&&(f.wasRoot&&Gn(l,o),po(l.x,f.offset.x),po(l.y,f.offset.y))}return l}applyTransform(o,a=!1){const l=Ft();Gn(l,o);for(let c=0;c<this.path.length;c++){const u=this.path[c];!a&&u.options.layoutScroll&&u.scroll&&u!==u.root&&mo(l,{x:-u.scroll.offset.x,y:-u.scroll.offset.y}),ns(u.latestValues)&&mo(l,u.latestValues)}return ns(this.latestValues)&&mo(l,this.latestValues),l}removeTransform(o){const a=Ft();Gn(a,o);for(let l=0;l<this.path.length;l++){const c=this.path[l];if(!c.instance||!ns(c.latestValues))continue;Wh(c.latestValues)&&c.updateSnapshot();const u=Ft(),f=c.measurePageBox();Gn(u,f),fx(a,c.latestValues,c.snapshot?c.snapshot.layoutBox:void 0,u)}return ns(this.latestValues)&&fx(a,this.latestValues),a}setTargetDelta(o){this.targetDelta=o,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(o){this.options={...this.options,...o,crossfade:o.crossfade!==void 0?o.crossfade:!0}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==Qt.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(o=!1){var a;const l=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=l.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=l.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=l.isSharedProjectionDirty);const c=!!this.resumingFrom||this!==l;if(!(o||c&&this.isSharedProjectionDirty||this.isProjectionDirty||!((a=this.parent)===null||a===void 0)&&a.isProjectionDirty||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:f,layoutId:d}=this.options;if(!(!this.layout||!(f||d))){if(this.resolvedRelativeTargetAt=Qt.timestamp,!this.targetDelta&&!this.relativeTarget){const p=this.getClosestProjectingParent();p&&p.layout&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Ft(),this.relativeTargetOrigin=Ft(),Da(this.relativeTargetOrigin,this.layout.layoutBox,p.layout.layoutBox),Gn(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(!(!this.relativeTarget&&!this.targetDelta)){if(this.target||(this.target=Ft(),this.targetWithTransforms=Ft()),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),mR(this.target,this.relativeTarget,this.relativeParent.target)):this.targetDelta?(this.resumingFrom?this.target=this.applyTransform(this.layout.layoutBox):Gn(this.target,this.layout.layoutBox),w1(this.target,this.targetDelta)):Gn(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const p=this.getClosestProjectingParent();p&&!!p.resumingFrom==!!this.resumingFrom&&!p.options.layoutScroll&&p.target&&this.animationProgress!==1?(this.relativeParent=p,this.forceRelativeParentToResolveTarget(),this.relativeTarget=Ft(),this.relativeTargetOrigin=Ft(),Da(this.relativeTargetOrigin,this.target,p.target),Gn(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}ma&&is.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(!(!this.parent||Wh(this.parent.latestValues)||T1(this.parent.latestValues)))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return!!((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var o;const a=this.getLead(),l=!!this.resumingFrom||this!==a;let c=!0;if((this.isProjectionDirty||!((o=this.parent)===null||o===void 0)&&o.isProjectionDirty)&&(c=!1),l&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(c=!1),this.resolvedRelativeTargetAt===Qt.timestamp&&(c=!1),c)return;const{layout:u,layoutId:f}=this.options;if(this.isTreeAnimating=!!(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!(u||f))return;Gn(this.layoutCorrected,this.layout.layoutBox);const d=this.treeScale.x,p=this.treeScale.y;TR(this.layoutCorrected,this.treeScale,this.path,l),a.layout&&!a.target&&(this.treeScale.x!==1||this.treeScale.y!==1)&&(a.target=a.layout.layoutBox,a.targetWithTransforms=Ft());const{target:v}=a;if(!v){this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender());return}!this.projectionDelta||!this.prevProjectionDelta?this.createProjectionDeltas():(cx(this.prevProjectionDelta.x,this.projectionDelta.x),cx(this.prevProjectionDelta.y,this.projectionDelta.y)),Pa(this.projectionDelta,this.layoutCorrected,v,this.latestValues),(this.treeScale.x!==d||this.treeScale.y!==p||!vx(this.projectionDelta.x,this.prevProjectionDelta.x)||!vx(this.projectionDelta.y,this.prevProjectionDelta.y))&&(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",v)),ma&&is.recalculatedProjection++}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(o=!0){var a;if((a=this.options.visualElement)===null||a===void 0||a.scheduleRender(),o){const l=this.getStack();l&&l.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta=ho(),this.projectionDelta=ho(),this.projectionDeltaWithTransform=ho()}setAnimationOrigin(o,a=!1){const l=this.snapshot,c=l?l.latestValues:{},u={...this.latestValues},f=ho();(!this.relativeParent||!this.relativeParent.options.layoutRoot)&&(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!a;const d=Ft(),p=l?l.source:void 0,v=this.layout?this.layout.source:void 0,S=p!==v,g=this.getStack(),h=!g||g.members.length<=1,m=!!(S&&!h&&this.options.crossfade===!0&&!this.path.some(cP));this.animationProgress=0;let _;this.mixTargetDelta=M=>{const w=M/1e3;Sx(f.x,o.x,w),Sx(f.y,o.y,w),this.setTargetDelta(f),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Da(d,this.layout.layoutBox,this.relativeParent.layout.layoutBox),lP(this.relativeTarget,this.relativeTargetOrigin,d,w),_&&XR(this.relativeTarget,_)&&(this.isProjectionDirty=!1),_||(_=Ft()),Gn(_,this.relativeTarget)),S&&(this.animationValues=u,zR(u,c,this.latestValues,w,m,h)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=w},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(o){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(kr(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=Et.update(()=>{zc.hasAnimatedSinceResize=!0,this.currentAnimation=IR(0,xx,{...o,onUpdate:a=>{this.mixTargetDelta(a),o.onUpdate&&o.onUpdate(a)},onComplete:()=>{o.onComplete&&o.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const o=this.getStack();o&&o.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(xx),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const o=this.getLead();let{targetWithTransforms:a,target:l,layout:c,latestValues:u}=o;if(!(!a||!l||!c)){if(this!==o&&this.layout&&c&&U1(this.options.animationType,this.layout.layoutBox,c.layoutBox)){l=this.target||Ft();const f=kn(this.layout.layoutBox.x);l.x.min=o.target.x.min,l.x.max=l.x.min+f;const d=kn(this.layout.layoutBox.y);l.y.min=o.target.y.min,l.y.max=l.y.min+d}Gn(a,l),mo(a,u),Pa(this.projectionDeltaWithTransform,this.layoutCorrected,a,u)}}registerSharedNode(o,a){this.sharedNodes.has(o)||this.sharedNodes.set(o,new $R),this.sharedNodes.get(o).add(a);const c=a.options.initialPromotionConfig;a.promote({transition:c?c.transition:void 0,preserveFollowOpacity:c&&c.shouldPreserveFollowOpacity?c.shouldPreserveFollowOpacity(a):void 0})}isLead(){const o=this.getStack();return o?o.lead===this:!0}getLead(){var o;const{layoutId:a}=this.options;return a?((o=this.getStack())===null||o===void 0?void 0:o.lead)||this:this}getPrevLead(){var o;const{layoutId:a}=this.options;return a?(o=this.getStack())===null||o===void 0?void 0:o.prevLead:void 0}getStack(){const{layoutId:o}=this.options;if(o)return this.root.sharedNodes.get(o)}promote({needsReset:o,transition:a,preserveFollowOpacity:l}={}){const c=this.getStack();c&&c.promote(this,l),o&&(this.projectionDelta=void 0,this.needsReset=!0),a&&this.setOptions({transition:a})}relegate(){const o=this.getStack();return o?o.relegate(this):!1}resetSkewAndRotation(){const{visualElement:o}=this.options;if(!o)return;let a=!1;const{latestValues:l}=o;if((l.z||l.rotate||l.rotateX||l.rotateY||l.rotateZ||l.skewX||l.skewY)&&(a=!0),!a)return;const c={};l.z&&Yd("z",o,c,this.animationValues);for(let u=0;u<$d.length;u++)Yd(`rotate${$d[u]}`,o,c,this.animationValues),Yd(`skew${$d[u]}`,o,c,this.animationValues);o.render();for(const u in c)o.setStaticValue(u,c[u]),this.animationValues&&(this.animationValues[u]=c[u]);o.scheduleRender()}getProjectionStyles(o){var a,l;if(!this.instance||this.isSVG)return;if(!this.isVisible)return KR;const c={visibility:""},u=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,c.opacity="",c.pointerEvents=kc(o==null?void 0:o.pointerEvents)||"",c.transform=u?u(this.latestValues,""):"none",c;const f=this.getLead();if(!this.projectionDelta||!this.layout||!f.target){const S={};return this.options.layoutId&&(S.opacity=this.latestValues.opacity!==void 0?this.latestValues.opacity:1,S.pointerEvents=kc(o==null?void 0:o.pointerEvents)||""),this.hasProjected&&!ns(this.latestValues)&&(S.transform=u?u({},""):"none",this.hasProjected=!1),S}const d=f.animationValues||f.latestValues;this.applyTransformsToTarget(),c.transform=YR(this.projectionDeltaWithTransform,this.treeScale,d),u&&(c.transform=u(d,c.transform));const{x:p,y:v}=this.projectionDelta;c.transformOrigin=`${p.origin*100}% ${v.origin*100}% 0`,f.animationValues?c.opacity=f===this?(l=(a=d.opacity)!==null&&a!==void 0?a:this.latestValues.opacity)!==null&&l!==void 0?l:1:this.preserveOpacity?this.latestValues.opacity:d.opacityExit:c.opacity=f===this?d.opacity!==void 0?d.opacity:"":d.opacityExit!==void 0?d.opacityExit:0;for(const S in yu){if(d[S]===void 0)continue;const{correct:g,applyTo:h}=yu[S],m=c.transform==="none"?d[S]:g(d[S],f);if(h){const _=h.length;for(let M=0;M<_;M++)c[h[M]]=m}else c[S]=m}return this.options.layoutId&&(c.pointerEvents=f===this?kc(o==null?void 0:o.pointerEvents)||"":"none"),c}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(o=>{var a;return(a=o.currentAnimation)===null||a===void 0?void 0:a.stop()}),this.root.nodes.forEach(_x),this.root.sharedNodes.clear()}}}function ZR(t){t.updateLayout()}function QR(t){var e;const n=((e=t.resumeFrom)===null||e===void 0?void 0:e.snapshot)||t.snapshot;if(t.isLead()&&t.layout&&n&&t.hasListeners("didUpdate")){const{layoutBox:i,measuredBox:r}=t.layout,{animationType:s}=t.options,o=n.source!==t.layout.source;s==="size"?jn(f=>{const d=o?n.measuredBox[f]:n.layoutBox[f],p=kn(d);d.min=i[f].min,d.max=d.min+p}):U1(s,n.layoutBox,i)&&jn(f=>{const d=o?n.measuredBox[f]:n.layoutBox[f],p=kn(i[f]);d.max=d.min+p,t.relativeTarget&&!t.currentAnimation&&(t.isProjectionDirty=!0,t.relativeTarget[f].max=t.relativeTarget[f].min+p)});const a=ho();Pa(a,i,n.layoutBox);const l=ho();o?Pa(l,t.applyTransform(r,!0),n.measuredBox):Pa(l,i,n.layoutBox);const c=!D1(a);let u=!1;if(!t.resumeFrom){const f=t.getClosestProjectingParent();if(f&&!f.resumeFrom){const{snapshot:d,layout:p}=f;if(d&&p){const v=Ft();Da(v,n.layoutBox,d.layoutBox);const S=Ft();Da(S,i,p.layoutBox),N1(v,S)||(u=!0),f.options.layoutRoot&&(t.relativeTarget=S,t.relativeTargetOrigin=v,t.relativeParent=f)}}}t.notifyListeners("didUpdate",{layout:i,snapshot:n,delta:l,layoutDelta:a,hasLayoutChanged:c,hasRelativeTargetChanged:u})}else if(t.isLead()){const{onExitComplete:i}=t.options;i&&i()}t.options.transition=void 0}function JR(t){ma&&is.totalNodes++,t.parent&&(t.isProjecting()||(t.isProjectionDirty=t.parent.isProjectionDirty),t.isSharedProjectionDirty||(t.isSharedProjectionDirty=!!(t.isProjectionDirty||t.parent.isProjectionDirty||t.parent.isSharedProjectionDirty)),t.isTransformDirty||(t.isTransformDirty=t.parent.isTransformDirty))}function eP(t){t.isProjectionDirty=t.isSharedProjectionDirty=t.isTransformDirty=!1}function tP(t){t.clearSnapshot()}function _x(t){t.clearMeasurements()}function nP(t){t.isLayoutDirty=!1}function iP(t){const{visualElement:e}=t.options;e&&e.getProps().onBeforeLayoutMeasure&&e.notify("BeforeLayoutMeasure"),t.resetTransform()}function yx(t){t.finishAnimation(),t.targetDelta=t.relativeTarget=t.target=void 0,t.isProjectionDirty=!0}function rP(t){t.resolveTargetDelta()}function sP(t){t.calcProjection()}function oP(t){t.resetSkewAndRotation()}function aP(t){t.removeLeadSnapshot()}function Sx(t,e,n){t.translate=bt(e.translate,0,n),t.scale=bt(e.scale,1,n),t.origin=e.origin,t.originPoint=e.originPoint}function Mx(t,e,n,i){t.min=bt(e.min,n.min,i),t.max=bt(e.max,n.max,i)}function lP(t,e,n,i){Mx(t.x,e.x,n.x,i),Mx(t.y,e.y,n.y,i)}function cP(t){return t.animationValues&&t.animationValues.opacityExit!==void 0}const uP={duration:.45,ease:[.4,0,.1,1]},Ex=t=>typeof navigator<"u"&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(t),Tx=Ex("applewebkit/")&&!Ex("chrome/")?Math.round:Fn;function wx(t){t.min=Tx(t.min),t.max=Tx(t.max)}function dP(t){wx(t.x),wx(t.y)}function U1(t,e,n){return t==="position"||t==="preserve-aspect"&&!pR(gx(e),gx(n),.2)}function fP(t){var e;return t!==t.root&&((e=t.scroll)===null||e===void 0?void 0:e.wasRoot)}const hP=I1({attachResizeListener:(t,e)=>il(t,"resize",e),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),Kd={current:void 0},F1=I1({measureScroll:t=>({x:t.scrollLeft,y:t.scrollTop}),defaultParent:()=>{if(!Kd.current){const t=new hP({});t.mount(window),t.setOptions({layoutScroll:!0}),Kd.current=t}return Kd.current},resetTransform:(t,e)=>{t.style.transform=e!==void 0?e:"none"},checkIsScrollRoot:t=>window.getComputedStyle(t).position==="fixed"}),pP={pan:{Feature:PR},drag:{Feature:RR,ProjectionNode:F1,MeasureLayout:C1}};function bx(t,e,n){const{props:i}=t;t.animationState&&i.whileHover&&t.animationState.setActive("whileHover",n==="Start");const r="onHover"+n,s=i[r];s&&Et.postRender(()=>s(e,vl(e)))}class mP extends Xr{mount(){const{current:e}=this.node;e&&(this.unmount=pA(e,n=>(bx(this.node,n,"Start"),i=>bx(this.node,i,"End"))))}unmount(){}}class gP extends Xr{constructor(){super(...arguments),this.isActive=!1}onFocus(){let e=!1;try{e=this.node.current.matches(":focus-visible")}catch{e=!0}!e||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){!this.isActive||!this.node.animationState||(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=gl(il(this.node.current,"focus",()=>this.onFocus()),il(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}function Ax(t,e,n){const{props:i}=t;t.animationState&&i.whileTap&&t.animationState.setActive("whileTap",n==="Start");const r="onTap"+(n==="End"?"":n),s=i[r];s&&Et.postRender(()=>s(e,vl(e)))}class vP extends Xr{mount(){const{current:e}=this.node;e&&(this.unmount=xA(e,n=>(Ax(this.node,n,"Start"),(i,{success:r})=>Ax(this.node,i,r?"End":"Cancel")),{useGlobalTarget:this.node.props.globalTapTarget}))}unmount(){}}const $h=new WeakMap,qd=new WeakMap,xP=t=>{const e=$h.get(t.target);e&&e(t)},_P=t=>{t.forEach(xP)};function yP({root:t,...e}){const n=t||document;qd.has(n)||qd.set(n,{});const i=qd.get(n),r=JSON.stringify(e);return i[r]||(i[r]=new IntersectionObserver(_P,{root:t,...e})),i[r]}function SP(t,e,n){const i=yP(e);return $h.set(t,n),i.observe(t),()=>{$h.delete(t),i.unobserve(t)}}const MP={some:0,all:1};class EP extends Xr{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.unmount();const{viewport:e={}}=this.node.getProps(),{root:n,margin:i,amount:r="some",once:s}=e,o={root:n?n.current:void 0,rootMargin:i,threshold:typeof r=="number"?r:MP[r]},a=l=>{const{isIntersecting:c}=l;if(this.isInView===c||(this.isInView=c,s&&!c&&this.hasEnteredView))return;c&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",c);const{onViewportEnter:u,onViewportLeave:f}=this.node.getProps(),d=c?u:f;d&&d(l)};return SP(this.node.current,o,a)}mount(){this.startObserver()}update(){if(typeof IntersectionObserver>"u")return;const{props:e,prevProps:n}=this.node;["amount","margin","root"].some(TP(e,n))&&this.startObserver()}unmount(){}}function TP({viewport:t={}},{viewport:e={}}={}){return n=>t[n]!==e[n]}const wP={inView:{Feature:EP},tap:{Feature:vP},focus:{Feature:gP},hover:{Feature:mP}},bP={layout:{ProjectionNode:F1,MeasureLayout:C1}},Yh={current:null},O1={current:!1};function AP(){if(O1.current=!0,!!Vm)if(window.matchMedia){const t=window.matchMedia("(prefers-reduced-motion)"),e=()=>Yh.current=t.matches;t.addListener(e),e()}else Yh.current=!1}const CP=[...l1,ln,Br],RP=t=>CP.find(a1(t)),Cx=new WeakMap;function PP(t,e,n){for(const i in e){const r=e[i],s=n[i];if(un(r))t.addValue(i,r);else if(un(s))t.addValue(i,tl(r,{owner:t}));else if(s!==r)if(t.hasValue(i)){const o=t.getValue(i);o.liveStyle===!0?o.jump(r):o.hasAnimated||o.set(r)}else{const o=t.getStaticValue(i);t.addValue(i,tl(o!==void 0?o:r,{owner:t}))}}for(const i in n)e[i]===void 0&&t.removeValue(i);return e}const Rx=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];class DP{scrapeMotionValuesFromProps(e,n,i){return{}}constructor({parent:e,props:n,presenceContext:i,reducedMotionConfig:r,blockInitialAnimation:s,visualState:o},a={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.values=new Map,this.KeyframeResolver=pg,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const p=Ni.now();this.renderScheduledAt<p&&(this.renderScheduledAt=p,Et.render(this.render,!1,!0))};const{latestValues:l,renderState:c,onUpdate:u}=o;this.onUpdate=u,this.latestValues=l,this.baseTarget={...l},this.initialValues=n.initial?{...l}:{},this.renderState=c,this.parent=e,this.props=n,this.presenceContext=i,this.depth=e?e.depth+1:0,this.reducedMotionConfig=r,this.options=a,this.blockInitialAnimation=!!s,this.isControllingVariants=nd(n),this.isVariantNode=gM(n),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=!!(e&&e.current);const{willChange:f,...d}=this.scrapeMotionValuesFromProps(n,{},this);for(const p in d){const v=d[p];l[p]!==void 0&&un(v)&&v.set(l[p],!1)}}mount(e){this.current=e,Cx.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((n,i)=>this.bindToMotionValue(i,n)),O1.current||AP(),this.shouldReduceMotion=this.reducedMotionConfig==="never"?!1:this.reducedMotionConfig==="always"?!0:Yh.current,this.parent&&this.parent.children.add(this),this.update(this.props,this.presenceContext)}unmount(){Cx.delete(this.current),this.projection&&this.projection.unmount(),kr(this.notifyUpdate),kr(this.render),this.valueSubscriptions.forEach(e=>e()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent&&this.parent.children.delete(this);for(const e in this.events)this.events[e].clear();for(const e in this.features){const n=this.features[e];n&&(n.unmount(),n.isMounted=!1)}this.current=null}bindToMotionValue(e,n){this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)();const i=Rs.has(e),r=n.on("change",a=>{this.latestValues[e]=a,this.props.onUpdate&&Et.preRender(this.notifyUpdate),i&&this.projection&&(this.projection.isTransformDirty=!0)}),s=n.on("renderRequest",this.scheduleRender);let o;window.MotionCheckAppearSync&&(o=window.MotionCheckAppearSync(this,e,n)),this.valueSubscriptions.set(e,()=>{r(),s(),o&&o(),n.owner&&n.stop()})}sortNodePosition(e){return!this.current||!this.sortInstanceNodePosition||this.type!==e.type?0:this.sortInstanceNodePosition(this.current,e.current)}updateFeatures(){let e="animation";for(e in Lo){const n=Lo[e];if(!n)continue;const{isEnabled:i,Feature:r}=n;if(!this.features[e]&&r&&i(this.props)&&(this.features[e]=new r(this)),this.features[e]){const s=this.features[e];s.isMounted?s.update():(s.mount(),s.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):Ft()}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,n){this.latestValues[e]=n}update(e,n){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=n;for(let i=0;i<Rx.length;i++){const r=Rx[i];this.propEventSubscriptions[r]&&(this.propEventSubscriptions[r](),delete this.propEventSubscriptions[r]);const s="on"+r,o=e[s];o&&(this.propEventSubscriptions[r]=this.on(r,o))}this.prevMotionValues=PP(this,this.scrapeMotionValuesFromProps(e,this.prevProps,this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue(),this.onUpdate&&this.onUpdate(this)}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){const n=this.getClosestVariantNode();if(n)return n.variantChildren&&n.variantChildren.add(e),()=>n.variantChildren.delete(e)}addValue(e,n){const i=this.values.get(e);n!==i&&(i&&this.removeValue(e),this.bindToMotionValue(e,n),this.values.set(e,n),this.latestValues[e]=n.get())}removeValue(e){this.values.delete(e);const n=this.valueSubscriptions.get(e);n&&(n(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,n){if(this.props.values&&this.props.values[e])return this.props.values[e];let i=this.values.get(e);return i===void 0&&n!==void 0&&(i=tl(n===null?void 0:n,{owner:this}),this.addValue(e,i)),i}readValue(e,n){var i;let r=this.latestValues[e]!==void 0||!this.current?this.latestValues[e]:(i=this.getBaseTargetFromProps(this.props,e))!==null&&i!==void 0?i:this.readValueFromInstance(this.current,e,this.options);return r!=null&&(typeof r=="string"&&(s1(r)||qM(r))?r=parseFloat(r):!RP(r)&&Br.test(n)&&(r=n1(e,n)),this.setBaseTarget(e,un(r)?r.get():r)),un(r)?r.get():r}setBaseTarget(e,n){this.baseTarget[e]=n}getBaseTarget(e){var n;const{initial:i}=this.props;let r;if(typeof i=="string"||typeof i=="object"){const o=Ym(this.props,i,(n=this.presenceContext)===null||n===void 0?void 0:n.custom);o&&(r=o[e])}if(i&&r!==void 0)return r;const s=this.getBaseTargetFromProps(this.props,e);return s!==void 0&&!un(s)?s:this.initialValues[e]!==void 0&&r===void 0?void 0:this.baseTarget[e]}on(e,n){return this.events[e]||(this.events[e]=new lg),this.events[e].add(n)}notify(e,...n){this.events[e]&&this.events[e].notify(...n)}}class k1 extends DP{constructor(){super(...arguments),this.KeyframeResolver=c1}sortInstanceNodePosition(e,n){return e.compareDocumentPosition(n)&2?1:-1}getBaseTargetFromProps(e,n){return e.style?e.style[n]:void 0}removeValueFromRenderState(e,{vars:n,style:i}){delete n[e],delete i[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:e}=this.props;un(e)&&(this.childSubscription=e.on("change",n=>{this.current&&(this.current.textContent=`${n}`)}))}}function NP(t){return window.getComputedStyle(t)}class LP extends k1{constructor(){super(...arguments),this.type="html",this.renderInstance=wM}readValueFromInstance(e,n){if(Rs.has(n)){const i=hg(n);return i&&i.default||0}else{const i=NP(e),r=(MM(n)?i.getPropertyValue(n):i[n])||0;return typeof r=="string"?r.trim():r}}measureInstanceViewportBox(e,{transformPagePoint:n}){return b1(e,n)}build(e,n,i){Zm(e,n,i.transformTemplate)}scrapeMotionValuesFromProps(e,n,i){return tg(e,n,i)}}class IP extends k1{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=Ft}getBaseTargetFromProps(e,n){return e[n]}readValueFromInstance(e,n){if(Rs.has(n)){const i=hg(n);return i&&i.default||0}return n=bM.has(n)?n:Wm(n),e.getAttribute(n)}scrapeMotionValuesFromProps(e,n,i){return RM(e,n,i)}build(e,n,i){Qm(e,n,this.isSVGTag,i.transformTemplate)}renderInstance(e,n,i,r){AM(e,n,i,r)}mount(e){this.isSVGTag=eg(e.tagName),super.mount(e)}}const UP=(t,e)=>$m(t)?new IP(e):new LP(e,{allowProjection:t!==G.Fragment}),FP=aA({...sR,...wP,...pP,...bP},UP),ut=Mb(FP);function OP({suggestions:t,disabled:e,onSubmit:n}){const[i,r]=G.useState("");function s(o){const a=o.trim();!a||e||(r(""),n(a))}return x.jsxs("div",{className:"action-panel",children:[x.jsx("div",{className:"suggestion-grid",children:t.map(o=>x.jsx("button",{type:"button",onClick:()=>s(o.text),disabled:e,children:o.label},o.id))}),x.jsxs("form",{className:"custom-action",onSubmit:o=>{o.preventDefault(),s(i)},children:[x.jsx("input",{value:i,onChange:o=>r(o.target.value),placeholder:"输入你的行动",disabled:e}),x.jsx("button",{type:"submit",disabled:e||!i.trim(),children:"执行"})]})]})}const Kh=[{id:"warrior",name:"战士",mark:"W",desc:"前排坦克，高 AC 高 HP。擅长把战斗压力拉到自己身上，也能用蛮力打开危险路线。",stats:{str:16,dex:13,con:15,int:10,wis:12,cha:8},pros:["最高 AC 和 HP","近战压制稳定","能替同伴承担风险"],cons:["远程乏力","奥术与细致社交较弱"],skills:{combat:[{name:"压制斩",kind:"combat",check:"攻击检定：力量+熟练 vs AC",effect:"命中后造成武器伤害；若敌人正威胁队友，追加一次击退或缴械叙事机会。"},{name:"盾墙嘲讽",kind:"combat",check:"力量(运动) DC13 或 魅力(威吓) DC14",effect:"成功后一个敌人下轮优先攻击你，指定同伴下一次防御或逃脱检定+2。"}],nonCombat:[{name:"破门开路",kind:"noncombat",check:"力量(运动) DC12-18",effect:"撞门、移石、撑住坍塌机关；失败会制造声响或造成少量伤害。"},{name:"战场读势",kind:"noncombat",check:"感知(洞悉) DC14",effect:"读出伏击方向、敌人胆怯点或 Boss 的下一步战术。"}]}},{id:"rogue",name:"游荡者",mark:"R",desc:"灵活刺客，高爆发偷袭。最适合承担潜入、开锁、拆陷阱和危险侦查。",stats:{str:10,dex:16,con:14,int:12,wis:13,cha:8},pros:["潜行先手偷袭","解陷阱开锁主力","高单体爆发"],cons:["脆皮不能扛","需要队友配合"],skills:{combat:[{name:"偷袭",kind:"combat",check:"攻击检定：敏捷+熟练 vs AC",effect:"若目标被队友牵制或你处于隐藏，命中追加1d6伤害并暴露弱点。"},{name:"烟雾脱离",kind:"combat",check:"敏捷(杂技) DC13",effect:"从近战威胁中撤离，成功后可顺势潜行或护送一名队友后撤。"}],nonCombat:[{name:"开锁拆陷",kind:"noncombat",check:"敏捷(巧手/盗贼工具) DC12-18",effect:"处理门锁、宝箱、压力板和毒针；失败可能消耗工具或触发弱化版陷阱。"},{name:"暗处侦查",kind:"noncombat",check:"敏捷(潜行) 对抗 感知(察觉)",effect:"提前发现巡逻、暗门、偷听情报；大成功可给全队下一次行动优势。"}]}},{id:"wizard",name:"法师",mark:"M",desc:"远程炮台，法术轰炸。擅长奥术鉴定、符文谜题和用法术重写场景规则。",stats:{str:8,dex:13,con:14,int:16,wis:12,cha:10},pros:["AOE 清怪最强","解谜调查主力","法术花样多"],cons:["AC 最低最脆","法术位有限"],skills:{combat:[{name:"炽焰爆裂",kind:"combat",check:"智力(奥秘) DC14 或 法术攻击 vs AC",effect:"塑形火焰打击多个灰烬之裔；成功避免误伤队友，失败会引发环境燃烧。"},{name:"护盾反应",kind:"combat",check:"智力(奥秘) DC13",effect:"预判一次来袭攻击，成功后本轮 AC 临时+3或保护身旁队友。"}],nonCombat:[{name:"奥术鉴定",kind:"noncombat",check:"智力(奥秘) DC12-18",effect:"识别魔法物品、诅咒、传送阵和深渊符文，常能解锁额外剧情选项。"},{name:"仪式解谜",kind:"noncombat",check:"智力(调查/历史) DC14-18",effect:"重排书架、破译王室密文、推演封印顺序；失败会推进危险计时。"}]}},{id:"cleric",name:"牧师",mark:"C",desc:"治疗辅助，亡灵克星。擅长祝福、驱散、医治，以及辨认真伪神迹。",stats:{str:13,dex:10,con:14,int:12,wis:16,cha:8},pros:["唯一治疗职业","亡灵特攻","团队 buff"],cons:["输出较低","仇恨高易被集火"],skills:{combat:[{name:"圣光打击",kind:"combat",check:"攻击检定：感知+熟练 vs AC",effect:"对亡灵和灰烬之裔造成光耀伤害；命中后可压制目标的暗影再生。"},{name:"战地治疗",kind:"combat",check:"感知(医药) DC12",effect:"稳定濒死角色或恢复少量 HP；若消耗治疗药水，检定成功额外+2治疗。"}],nonCombat:[{name:"辨认真伪神迹",kind:"noncombat",check:"感知(洞悉/宗教) DC13-17",effect:"识破莫德雷德的治疗印记、祭坛伪装和被污染的祝福。"},{name:"驱散诅咒",kind:"noncombat",check:"感知(宗教) DC15-20",effect:"解除临时属性惩罚、安抚亡魂或削弱 Boss 前的场地诅咒。"}]}},{id:"paladin",name:"圣骑士",mark:"P",desc:"攻守兼备，魅力领袖。善于谈判、审判誓言，也能在 Boss 战里爆发圣光。",stats:{str:15,dex:10,con:13,int:8,wis:12,cha:14},pros:["攻守均衡","魅力社交优势","Boss 战爆发"],cons:["各方面不突出","法术位少"],skills:{combat:[{name:"神圣一击",kind:"combat",check:"攻击检定：力量+熟练 vs AC",effect:"命中后可追加光耀爆发；对恶魔、亡灵和誓敌特别有效。"},{name:"守护灵光",kind:"combat",check:"魅力(说服/宗教) DC13",effect:"鼓舞队友抵抗恐惧或魅惑，全队下一次相关豁免+2。"}],nonCombat:[{name:"威严谈判",kind:"noncombat",check:"魅力(说服/威吓) DC12-18",effect:"压住争执、争取守卫配合、逼问俘虏；失败会让对方警觉或索要代价。"},{name:"誓言审判",kind:"noncombat",check:"感知(洞悉) 或 魅力(宗教) DC14-18",effect:"判断亡魂、贵族或教士是否违背誓言，影响王室线和墓穴审判。"}]}}],Px=[{id:"grum",name:"格鲁姆",title:"格鲁姆·铁锤",role:"矮人战士 / 护卫",hp:52,ac:17,trustKey:"gm_trust",hpKey:"gm_hp",skills:{combat:[{name:"嘲讽护卫",kind:"combat",check:"力量(运动) DC13",effect:"吸引火力并替玩家或塔莉亚挡下一次近战威胁。"},{name:"破甲战锤",kind:"combat",check:"攻击检定：+5 vs AC",effect:"命中重甲或石像敌人时，下次对该目标攻击+2。"}],nonCombat:[{name:"矮人石工",kind:"noncombat",check:"智力(历史/调查)+4，石造机关 DC12-16",effect:"识别暗门、承重墙、坍塌风险和古矮人铭刻。"},{name:"酒馆人脉",kind:"noncombat",check:"魅力(威吓/说服)+3，城市情报 DC13",effect:"在旅店、黑市和雇佣兵之间打听债主、装备或地城传闻。"}],story:[{name:"欠债的战锤",kind:"story",check:"还债500GP 或 魅力(说服) DC15",effect:"完成后信任+30，并获得镀银战锤支援。"}]}},{id:"lisa",name:"丽莎",title:"影刃丽莎",role:"半精灵游荡者 / 斥候",hp:38,ac:15,trustKey:"ls_trust",hpKey:"ls_hp",skills:{combat:[{name:"暗影偷袭",kind:"combat",check:"攻击检定：+6 vs AC；隐藏时优势",effect:"命中追加1d6伤害；若目标是暗影教会成员，揭露一条弱点。"},{name:"反制陷阱",kind:"combat",check:"敏捷(巧手/盗贼工具)+6，DC13-18",effect:"战斗中解除地刺、毒雾喷口或警报符线。"}],nonCombat:[{name:"暗语潜入",kind:"noncombat",check:"敏捷(潜行)+6 或 魅力(欺瞒)+4",effect:"绕过巡逻、偷听密谈、伪装暗影教会口令。"},{name:"追踪印记嗅探",kind:"noncombat",check:"感知(察觉)+4，DC14",effect:"发现自己或队伍是否被莫德雷德追踪。"}],story:[{name:"复仇名单",kind:"story",check:"B3 宗教/调查 DC15 找到实验记录",effect:"完成后信任+30，开启暗影教会秘密通道。"}]}},{id:"talia",name:"塔莉亚",title:"塔莉亚",role:"人类法师学徒 / 奥术支援",hp:24,ac:13,trustKey:"tl_trust",hpKey:"tl_hp",skills:{combat:[{name:"炽焰射线",kind:"combat",check:"法术攻击：+5 vs AC",effect:"对灰烬之裔造成额外压制；命中后可点燃易燃场景物。"},{name:"龙血火星",kind:"combat",check:"体质豁免 DC14；信任>80后升级为龙息术",effect:"情绪激动时爆发小范围火焰，成功控制则不误伤队友。"}],nonCombat:[{name:"奥术译读",kind:"noncombat",check:"智力(奥秘)+6，DC12-18",effect:"翻译符文、法阵、血契文本和书库禁忌批注。"},{name:"法师塔礼仪",kind:"noncombat",check:"智力(历史)+4 或 魅力(说服)+3",effect:"在伊瑟拉、学者和贵族面前争取专业话语权。"}],story:[{name:"龙血觉醒",kind:"story",check:"B4 受到保护或鼓励后，魅力(说服) DC15",effect:"完成后信任+20，解锁龙息术并影响隐藏结局。"}]}}];function B1(t){const e=Math.floor((t-10)/2);return e>=0?`+${e}`:`${e}`}function kP(t){return t<=10?t:t*3}function BP(t){return t==="warrior"||t==="paladin"?18:t==="cleric"?16:t==="rogue"?15:13}const zP=[["str","力"],["dex","敏"],["con","体"],["int","智"],["wis","感"],["cha","魅"]];function VP({state:t,savePanel:e}){const n=Number(t.current_hp??30),i=Number(t.max_hp??30),r=Math.max(0,Math.min(100,n/Math.max(i,1)*100)),s=String(t.inventory||"").split(",").map(a=>a.trim()).filter(Boolean),o=Kh.find(a=>a.name===t.char_class||a.id===t.char_class);return x.jsxs("aside",{className:"character-panel",children:[x.jsxs("div",{className:"panel-block character-identity",children:[x.jsx("span",{children:t.player_name||"冒险者"}),x.jsxs("strong",{children:[t.char_class||"战士"," Lv.",t.level||3]})]}),e&&x.jsx("div",{className:"panel-block",children:e}),x.jsxs("div",{className:"panel-block",children:[x.jsxs("div",{className:"meter-label",children:[x.jsx("span",{children:"HP"}),x.jsxs("b",{children:[n,"/",i]})]}),x.jsx("div",{className:"hp-track",children:x.jsx("i",{style:{width:`${r}%`}})})]}),x.jsx("div",{className:"panel-grid",children:zP.map(([a,l])=>{const c=Number(t[a]??10);return x.jsxs("div",{className:"attr-tile",children:[x.jsx("span",{children:l}),x.jsx("b",{children:c}),x.jsx("small",{children:B1(c)})]},a)})}),x.jsxs("div",{className:"panel-row",children:[x.jsx("span",{children:"AC"}),x.jsx("b",{children:t.ac||18})]}),x.jsxs("div",{className:"panel-row",children:[x.jsx("span",{children:"金币"}),x.jsxs("b",{children:[t.gold||200," GP"]})]}),o&&x.jsxs("div",{className:"panel-block skill-block",children:[x.jsx("h2",{children:"职业技能"}),x.jsx(Dx,{label:"战斗",skills:o.skills.combat}),x.jsx(Dx,{label:"探索/对话",skills:o.skills.nonCombat})]}),x.jsxs("div",{className:"panel-block",children:[x.jsx("h2",{children:"同伴信任"}),Px.map(a=>x.jsx(GP,{name:a.name,value:Number(t[a.trustKey]??50)},a.id))]}),x.jsxs("div",{className:"panel-block companion-skill-block",children:[x.jsx("h2",{children:"队友技能"}),Px.map(a=>x.jsxs("div",{className:"companion-skill",children:[x.jsx("strong",{children:a.name}),x.jsx("small",{children:a.role}),x.jsxs("p",{children:[a.skills.combat[0].name,": ",a.skills.combat[0].check]}),x.jsxs("p",{children:[a.skills.nonCombat[0].name,": ",a.skills.nonCombat[0].check]})]},a.id))]}),x.jsxs("div",{className:"panel-block inventory-block",children:[x.jsx("h2",{children:"背包"}),s.slice(0,5).map(a=>x.jsx("p",{children:a},a))]})]})}function Dx({label:t,skills:e}){return x.jsxs("div",{className:"skill-group",children:[x.jsx("span",{children:t}),e.map(n=>x.jsxs("p",{children:[x.jsx("b",{children:n.name}),x.jsx("small",{children:n.check})]},n.name))]})}function GP({name:t,value:e}){return x.jsxs("div",{className:"trust-row",children:[x.jsx("span",{children:t}),x.jsx("b",{className:e>=70?"trust-high":e<30?"trust-low":"",children:e})]})}/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const xg="184",HP=0,Nx=1,jP=2,Vc=1,WP=2,ga=3,zr=0,An=1,wi=2,qi=0,Mo=1,Lx=2,Ix=3,Ux=4,XP=5,ss=100,$P=101,YP=102,KP=103,qP=104,ZP=200,QP=201,JP=202,e3=203,qh=204,Zh=205,t3=206,n3=207,i3=208,r3=209,s3=210,o3=211,a3=212,l3=213,c3=214,Qh=0,Jh=1,ep=2,Uo=3,tp=4,np=5,ip=6,rp=7,z1=0,u3=1,d3=2,Li=0,V1=1,G1=2,H1=3,j1=4,W1=5,X1=6,$1=7,Y1=300,ws=301,Fo=302,Zd=303,Qd=304,sd=306,sp=1e3,Xi=1001,op=1002,Jt=1003,f3=1004,$l=1005,dn=1006,Jd=1007,hs=1008,Ln=1009,K1=1010,q1=1011,rl=1012,_g=1013,Ui=1014,Ai=1015,rr=1016,yg=1017,Sg=1018,sl=1020,Z1=35902,Q1=35899,J1=1021,eE=1022,ui=1023,sr=1026,ps=1027,tE=1028,Mg=1029,bs=1030,Eg=1031,Tg=1033,Gc=33776,Hc=33777,jc=33778,Wc=33779,ap=35840,lp=35841,cp=35842,up=35843,dp=36196,fp=37492,hp=37496,pp=37488,mp=37489,bu=37490,gp=37491,vp=37808,xp=37809,_p=37810,yp=37811,Sp=37812,Mp=37813,Ep=37814,Tp=37815,wp=37816,bp=37817,Ap=37818,Cp=37819,Rp=37820,Pp=37821,Dp=36492,Np=36494,Lp=36495,Ip=36283,Up=36284,Au=36285,Fp=36286,h3=3200,Op=0,p3=1,Mr="",Wn="srgb",Cu="srgb-linear",Ru="linear",lt="srgb",Is=7680,Fx=519,m3=512,g3=513,v3=514,wg=515,x3=516,_3=517,bg=518,y3=519,kp=35044,Ox="300 es",Ci=2e3,ol=2001;function S3(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Pu(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function M3(){const t=Pu("canvas");return t.style.display="block",t}const kx={};function Du(...t){const e="THREE."+t.shift();console.log(e,...t)}function nE(t){const e=t[0];if(typeof e=="string"&&e.startsWith("TSL:")){const n=t[1];n&&n.isStackTrace?t[0]+=" "+n.getLocation():t[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return t}function ke(...t){t=nE(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.warn(n.getError(e)):console.warn(e,...t)}}function it(...t){t=nE(t);const e="THREE."+t.shift();{const n=t[0];n&&n.isStackTrace?console.error(n.getError(e)):console.error(e,...t)}}function Bp(...t){const e=t.join(" ");e in kx||(kx[e]=!0,ke(...t))}function E3(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}const T3={[Qh]:Jh,[ep]:ip,[tp]:rp,[Uo]:np,[Jh]:Qh,[ip]:ep,[rp]:tp,[np]:Uo};class Ps{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){const i=this._listeners;return i===void 0?!1:i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){const i=this._listeners;if(i===void 0)return;const r=i[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){const n=this._listeners;if(n===void 0)return;const i=n[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,o=r.length;s<o;s++)r[s].call(this,e);e.target=null}}}const on=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Bx=1234567;const Eo=Math.PI/180,al=180/Math.PI;function Zi(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(on[t&255]+on[t>>8&255]+on[t>>16&255]+on[t>>24&255]+"-"+on[e&255]+on[e>>8&255]+"-"+on[e>>16&15|64]+on[e>>24&255]+"-"+on[n&63|128]+on[n>>8&255]+"-"+on[n>>16&255]+on[n>>24&255]+on[i&255]+on[i>>8&255]+on[i>>16&255]+on[i>>24&255]).toLowerCase()}function We(t,e,n){return Math.max(e,Math.min(n,t))}function Ag(t,e){return(t%e+e)%e}function w3(t,e,n,i,r){return i+(t-e)*(r-i)/(n-e)}function b3(t,e,n){return t!==e?(n-t)/(e-t):0}function Na(t,e,n){return(1-n)*t+n*e}function A3(t,e,n,i){return Na(t,e,1-Math.exp(-n*i))}function C3(t,e=1){return e-Math.abs(Ag(t,e*2)-e)}function R3(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*(3-2*t))}function P3(t,e,n){return t<=e?0:t>=n?1:(t=(t-e)/(n-e),t*t*t*(t*(t*6-15)+10))}function D3(t,e){return t+Math.floor(Math.random()*(e-t+1))}function N3(t,e){return t+Math.random()*(e-t)}function L3(t){return t*(.5-Math.random())}function I3(t){t!==void 0&&(Bx=t);let e=Bx+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function U3(t){return t*Eo}function F3(t){return t*al}function O3(t){return(t&t-1)===0&&t!==0}function k3(t){return Math.pow(2,Math.ceil(Math.log(t)/Math.LN2))}function B3(t){return Math.pow(2,Math.floor(Math.log(t)/Math.LN2))}function z3(t,e,n,i,r){const s=Math.cos,o=Math.sin,a=s(n/2),l=o(n/2),c=s((e+i)/2),u=o((e+i)/2),f=s((e-i)/2),d=o((e-i)/2),p=s((i-e)/2),v=o((i-e)/2);switch(r){case"XYX":t.set(a*u,l*f,l*d,a*c);break;case"YZY":t.set(l*d,a*u,l*f,a*c);break;case"ZXZ":t.set(l*f,l*d,a*u,a*c);break;case"XZX":t.set(a*u,l*v,l*p,a*c);break;case"YXY":t.set(l*p,a*u,l*v,a*c);break;case"ZYZ":t.set(l*v,l*p,a*u,a*c);break;default:ke("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+r)}}function ci(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function ct(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const V3={DEG2RAD:Eo,RAD2DEG:al,generateUUID:Zi,clamp:We,euclideanModulo:Ag,mapLinear:w3,inverseLerp:b3,lerp:Na,damp:A3,pingpong:C3,smoothstep:R3,smootherstep:P3,randInt:D3,randFloat:N3,randFloatSpread:L3,seededRandom:I3,degToRad:U3,radToDeg:F3,isPowerOfTwo:O3,ceilPowerOfTwo:k3,floorPowerOfTwo:B3,setQuaternionFromProperEuler:z3,normalize:ct,denormalize:ci},$g=class $g{constructor(e=0,n=0){this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=We(this.x,e.x,n.x),this.y=We(this.y,e.y,n.y),this}clampScalar(e,n){return this.x=We(this.x,e,n),this.y=We(this.y,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,o=this.y-e.y;return this.x=s*i-o*r+e.x,this.y=s*r+o*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};$g.prototype.isVector2=!0;let Qe=$g;class Vr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,o,a){let l=i[r+0],c=i[r+1],u=i[r+2],f=i[r+3],d=s[o+0],p=s[o+1],v=s[o+2],S=s[o+3];if(f!==S||l!==d||c!==p||u!==v){let g=l*d+c*p+u*v+f*S;g<0&&(d=-d,p=-p,v=-v,S=-S,g=-g);let h=1-a;if(g<.9995){const m=Math.acos(g),_=Math.sin(m);h=Math.sin(h*m)/_,a=Math.sin(a*m)/_,l=l*h+d*a,c=c*h+p*a,u=u*h+v*a,f=f*h+S*a}else{l=l*h+d*a,c=c*h+p*a,u=u*h+v*a,f=f*h+S*a;const m=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=m,c*=m,u*=m,f*=m}}e[n]=l,e[n+1]=c,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,o){const a=i[r],l=i[r+1],c=i[r+2],u=i[r+3],f=s[o],d=s[o+1],p=s[o+2],v=s[o+3];return e[n]=a*v+u*f+l*p-c*d,e[n+1]=l*v+u*d+c*f-a*p,e[n+2]=c*v+u*p+a*d-l*f,e[n+3]=u*v-a*f-l*d-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,o=e._order,a=Math.cos,l=Math.sin,c=a(i/2),u=a(r/2),f=a(s/2),d=l(i/2),p=l(r/2),v=l(s/2);switch(o){case"XYZ":this._x=d*u*f+c*p*v,this._y=c*p*f-d*u*v,this._z=c*u*v+d*p*f,this._w=c*u*f-d*p*v;break;case"YXZ":this._x=d*u*f+c*p*v,this._y=c*p*f-d*u*v,this._z=c*u*v-d*p*f,this._w=c*u*f+d*p*v;break;case"ZXY":this._x=d*u*f-c*p*v,this._y=c*p*f+d*u*v,this._z=c*u*v+d*p*f,this._w=c*u*f-d*p*v;break;case"ZYX":this._x=d*u*f-c*p*v,this._y=c*p*f+d*u*v,this._z=c*u*v-d*p*f,this._w=c*u*f+d*p*v;break;case"YZX":this._x=d*u*f+c*p*v,this._y=c*p*f+d*u*v,this._z=c*u*v-d*p*f,this._w=c*u*f-d*p*v;break;case"XZY":this._x=d*u*f-c*p*v,this._y=c*p*f-d*u*v,this._z=c*u*v+d*p*f,this._w=c*u*f+d*p*v;break;default:ke("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],o=n[1],a=n[5],l=n[9],c=n[2],u=n[6],f=n[10],d=i+a+f;if(d>0){const p=.5/Math.sqrt(d+1);this._w=.25/p,this._x=(u-l)*p,this._y=(s-c)*p,this._z=(o-r)*p}else if(i>a&&i>f){const p=2*Math.sqrt(1+i-a-f);this._w=(u-l)/p,this._x=.25*p,this._y=(r+o)/p,this._z=(s+c)/p}else if(a>f){const p=2*Math.sqrt(1+a-i-f);this._w=(s-c)/p,this._x=(r+o)/p,this._y=.25*p,this._z=(l+u)/p}else{const p=2*Math.sqrt(1+f-i-a);this._w=(o-r)/p,this._x=(s+c)/p,this._y=(l+u)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<1e-8?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(We(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,o=e._w,a=n._x,l=n._y,c=n._z,u=n._w;return this._x=i*u+o*a+r*c-s*l,this._y=r*u+o*l+s*a-i*c,this._z=s*u+o*c+i*l-r*a,this._w=o*u-i*a-r*l-s*c,this._onChangeCallback(),this}slerp(e,n){let i=e._x,r=e._y,s=e._z,o=e._w,a=this.dot(e);a<0&&(i=-i,r=-r,s=-s,o=-o,a=-a);let l=1-n;if(a<.9995){const c=Math.acos(a),u=Math.sin(c);l=Math.sin(l*c)/u,n=Math.sin(n*c)/u,this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this._onChangeCallback()}else this._x=this._x*l+i*n,this._y=this._y*l+r*n,this._z=this._z*l+s*n,this._w=this._w*l+o*n,this.normalize();return this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Yg=class Yg{constructor(e=0,n=0,i=0){this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(zx.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(zx.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,o=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*o,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*o,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*o,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,o=e.y,a=e.z,l=e.w,c=2*(o*r-a*i),u=2*(a*n-s*r),f=2*(s*i-o*n);return this.x=n+l*c+o*f-a*u,this.y=i+l*u+a*c-s*f,this.z=r+l*f+s*u-o*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=We(this.x,e.x,n.x),this.y=We(this.y,e.y,n.y),this.z=We(this.z,e.z,n.z),this}clampScalar(e,n){return this.x=We(this.x,e,n),this.y=We(this.y,e,n),this.z=We(this.z,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,o=n.x,a=n.y,l=n.z;return this.x=r*l-s*a,this.y=s*o-i*l,this.z=i*a-r*o,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return ef.copy(this).projectOnVector(e),this.sub(ef)}reflect(e){return this.sub(ef.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(We(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Yg.prototype.isVector3=!0;let L=Yg;const ef=new L,zx=new Vr,Kg=class Kg{constructor(e,n,i,r,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c)}set(e,n,i,r,s,o,a,l,c){const u=this.elements;return u[0]=e,u[1]=r,u[2]=a,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=o,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[3],l=i[6],c=i[1],u=i[4],f=i[7],d=i[2],p=i[5],v=i[8],S=r[0],g=r[3],h=r[6],m=r[1],_=r[4],M=r[7],w=r[2],T=r[5],R=r[8];return s[0]=o*S+a*m+l*w,s[3]=o*g+a*_+l*T,s[6]=o*h+a*M+l*R,s[1]=c*S+u*m+f*w,s[4]=c*g+u*_+f*T,s[7]=c*h+u*M+f*R,s[2]=d*S+p*m+v*w,s[5]=d*g+p*_+v*T,s[8]=d*h+p*M+v*R,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8];return n*o*u-n*a*c-i*s*u+i*a*l+r*s*c-r*o*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=u*o-a*c,d=a*l-u*s,p=c*s-o*l,v=n*f+i*d+r*p;if(v===0)return this.set(0,0,0,0,0,0,0,0,0);const S=1/v;return e[0]=f*S,e[1]=(r*c-u*i)*S,e[2]=(a*i-r*o)*S,e[3]=d*S,e[4]=(u*n-r*l)*S,e[5]=(r*s-a*n)*S,e[6]=p*S,e[7]=(i*l-c*n)*S,e[8]=(o*n-i*s)*S,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(i*l,i*c,-i*(l*o+c*a)+o+e,-r*c,r*l,-r*(-c*o+l*a)+a+n,0,0,1),this}scale(e,n){return this.premultiply(tf.makeScale(e,n)),this}rotate(e){return this.premultiply(tf.makeRotation(-e)),this}translate(e,n){return this.premultiply(tf.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}};Kg.prototype.isMatrix3=!0;let Ge=Kg;const tf=new Ge,Vx=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Gx=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function G3(){const t={enabled:!0,workingColorSpace:Cu,spaces:{},convert:function(r,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===lt&&(r.r=Qi(r.r),r.g=Qi(r.g),r.b=Qi(r.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(r.applyMatrix3(this.spaces[s].toXYZ),r.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===lt&&(r.r=To(r.r),r.g=To(r.g),r.b=To(r.b))),r},workingToColorSpace:function(r,s){return this.convert(r,this.workingColorSpace,s)},colorSpaceToWorking:function(r,s){return this.convert(r,s,this.workingColorSpace)},getPrimaries:function(r){return this.spaces[r].primaries},getTransfer:function(r){return r===Mr?Ru:this.spaces[r].transfer},getToneMappingMode:function(r){return this.spaces[r].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(r,s=this.workingColorSpace){return r.fromArray(this.spaces[s].luminanceCoefficients)},define:function(r){Object.assign(this.spaces,r)},_getMatrix:function(r,s,o){return r.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(r){return this.spaces[r].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(r=this.workingColorSpace){return this.spaces[r].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(r,s){return Bp("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),t.workingToColorSpace(r,s)},toWorkingColorSpace:function(r,s){return Bp("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),t.colorSpaceToWorking(r,s)}},e=[.64,.33,.3,.6,.15,.06],n=[.2126,.7152,.0722],i=[.3127,.329];return t.define({[Cu]:{primaries:e,whitePoint:i,transfer:Ru,toXYZ:Vx,fromXYZ:Gx,luminanceCoefficients:n,workingColorSpaceConfig:{unpackColorSpace:Wn},outputColorSpaceConfig:{drawingBufferColorSpace:Wn}},[Wn]:{primaries:e,whitePoint:i,transfer:lt,toXYZ:Vx,fromXYZ:Gx,luminanceCoefficients:n,outputColorSpaceConfig:{drawingBufferColorSpace:Wn}}}),t}const Je=G3();function Qi(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function To(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Us;class H3{static getDataURL(e,n="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let i;if(e instanceof HTMLCanvasElement)i=e;else{Us===void 0&&(Us=Pu("canvas")),Us.width=e.width,Us.height=e.height;const r=Us.getContext("2d");e instanceof ImageData?r.putImageData(e,0,0):r.drawImage(e,0,0,e.width,e.height),i=Us}return i.toDataURL(n)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Pu("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let o=0;o<s.length;o++)s[o]=Qi(s[o]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Qi(n[i]/255)*255):n[i]=Qi(n[i]);return{data:n,width:e.width,height:e.height}}else return ke("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let j3=0;class Cg{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:j3++}),this.uuid=Zi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const n=this.data;return typeof HTMLVideoElement<"u"&&n instanceof HTMLVideoElement?e.set(n.videoWidth,n.videoHeight,0):typeof VideoFrame<"u"&&n instanceof VideoFrame?e.set(n.displayWidth,n.displayHeight,0):n!==null?e.set(n.width,n.height,n.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let o=0,a=r.length;o<a;o++)r[o].isDataTexture?s.push(nf(r[o].image)):s.push(nf(r[o]))}else s=nf(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function nf(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?H3.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(ke("Texture: Unable to serialize Texture."),{})}let W3=0;const rf=new L;class fn extends Ps{constructor(e=fn.DEFAULT_IMAGE,n=fn.DEFAULT_MAPPING,i=Xi,r=Xi,s=dn,o=hs,a=ui,l=Ln,c=fn.DEFAULT_ANISOTROPY,u=Mr){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:W3++}),this.uuid=Zi(),this.name="",this.source=new Cg(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new Qe(0,0),this.repeat=new Qe(1,1),this.center=new Qe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(rf).x}get height(){return this.source.getSize(rf).y}get depth(){return this.source.getSize(rf).z}get image(){return this.source.data}set image(e){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.normalized=e.normalized,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const n in e){const i=e[n];if(i===void 0){ke(`Texture.setValues(): parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){ke(`Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==Y1)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case sp:e.x=e.x-Math.floor(e.x);break;case Xi:e.x=e.x<0?0:1;break;case op:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case sp:e.y=e.y-Math.floor(e.y);break;case Xi:e.y=e.y<0?0:1;break;case op:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=Y1;fn.DEFAULT_ANISOTROPY=1;const qg=class qg{constructor(e=0,n=0,i=0,r=1){this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,o=e.elements;return this.x=o[0]*n+o[4]*i+o[8]*r+o[12]*s,this.y=o[1]*n+o[5]*i+o[9]*r+o[13]*s,this.z=o[2]*n+o[6]*i+o[10]*r+o[14]*s,this.w=o[3]*n+o[7]*i+o[11]*r+o[15]*s,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,c=l[0],u=l[4],f=l[8],d=l[1],p=l[5],v=l[9],S=l[2],g=l[6],h=l[10];if(Math.abs(u-d)<.01&&Math.abs(f-S)<.01&&Math.abs(v-g)<.01){if(Math.abs(u+d)<.1&&Math.abs(f+S)<.1&&Math.abs(v+g)<.1&&Math.abs(c+p+h-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const _=(c+1)/2,M=(p+1)/2,w=(h+1)/2,T=(u+d)/4,R=(f+S)/4,y=(v+g)/4;return _>M&&_>w?_<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(_),r=T/i,s=R/i):M>w?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=T/r,s=y/r):w<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(w),i=R/s,r=y/s),this.set(i,r,s,n),this}let m=Math.sqrt((g-v)*(g-v)+(f-S)*(f-S)+(d-u)*(d-u));return Math.abs(m)<.001&&(m=1),this.x=(g-v)/m,this.y=(f-S)/m,this.z=(d-u)/m,this.w=Math.acos((c+p+h-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=We(this.x,e.x,n.x),this.y=We(this.y,e.y,n.y),this.z=We(this.z,e.z,n.z),this.w=We(this.w,e.w,n.w),this}clampScalar(e,n){return this.x=We(this.x,e,n),this.y=We(this.y,e,n),this.z=We(this.z,e,n),this.w=We(this.w,e,n),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(We(i,e,n))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};qg.prototype.isVector4=!0;let gt=qg;class X3 extends Ps{constructor(e=1,n=1,i={}){super(),i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:dn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},i),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=i.depth,this.scissor=new gt(0,0,e,n),this.scissorTest=!1,this.viewport=new gt(0,0,e,n),this.textures=[];const r={width:e,height:n,depth:i.depth},s=new fn(r),o=i.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(i),this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=i.depthTexture,this.samples=i.samples,this.multiview=i.multiview}_setTextureOptions(e={}){const n={minFilter:dn,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(n.mapping=e.mapping),e.wrapS!==void 0&&(n.wrapS=e.wrapS),e.wrapT!==void 0&&(n.wrapT=e.wrapT),e.wrapR!==void 0&&(n.wrapR=e.wrapR),e.magFilter!==void 0&&(n.magFilter=e.magFilter),e.minFilter!==void 0&&(n.minFilter=e.minFilter),e.format!==void 0&&(n.format=e.format),e.type!==void 0&&(n.type=e.type),e.anisotropy!==void 0&&(n.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(n.colorSpace=e.colorSpace),e.flipY!==void 0&&(n.flipY=e.flipY),e.generateMipmaps!==void 0&&(n.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(n.internalFormat=e.internalFormat);for(let i=0;i<this.textures.length;i++)this.textures[i].setValues(n)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i,this.textures[r].isData3DTexture!==!0&&(this.textures[r].isArrayTexture=this.textures[r].image.depth>1);this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let n=0,i=e.textures.length;n<i;n++){this.textures[n]=e.textures[n].clone(),this.textures[n].isRenderTargetTexture=!0,this.textures[n].renderTarget=this;const r=Object.assign({},e.textures[n].image);this.textures[n].source=new Cg(r)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this.multiview=e.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Ii extends X3{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class iE extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class $3 extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=Jt,this.minFilter=Jt,this.wrapR=Xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Fu=class Fu{constructor(e,n,i,r,s,o,a,l,c,u,f,d,p,v,S,g){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,o,a,l,c,u,f,d,p,v,S,g)}set(e,n,i,r,s,o,a,l,c,u,f,d,p,v,S,g){const h=this.elements;return h[0]=e,h[4]=n,h[8]=i,h[12]=r,h[1]=s,h[5]=o,h[9]=a,h[13]=l,h[2]=c,h[6]=u,h[10]=f,h[14]=d,h[3]=p,h[7]=v,h[11]=S,h[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new Fu().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return this.determinant()===0?(e.set(1,0,0),n.set(0,1,0),i.set(0,0,1),this):(e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this)}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){if(e.determinant()===0)return this.identity();const n=this.elements,i=e.elements,r=1/Fs.setFromMatrixColumn(e,0).length(),s=1/Fs.setFromMatrixColumn(e,1).length(),o=1/Fs.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*o,n[9]=i[9]*o,n[10]=i[10]*o,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,o=Math.cos(i),a=Math.sin(i),l=Math.cos(r),c=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const d=o*u,p=o*f,v=a*u,S=a*f;n[0]=l*u,n[4]=-l*f,n[8]=c,n[1]=p+v*c,n[5]=d-S*c,n[9]=-a*l,n[2]=S-d*c,n[6]=v+p*c,n[10]=o*l}else if(e.order==="YXZ"){const d=l*u,p=l*f,v=c*u,S=c*f;n[0]=d+S*a,n[4]=v*a-p,n[8]=o*c,n[1]=o*f,n[5]=o*u,n[9]=-a,n[2]=p*a-v,n[6]=S+d*a,n[10]=o*l}else if(e.order==="ZXY"){const d=l*u,p=l*f,v=c*u,S=c*f;n[0]=d-S*a,n[4]=-o*f,n[8]=v+p*a,n[1]=p+v*a,n[5]=o*u,n[9]=S-d*a,n[2]=-o*c,n[6]=a,n[10]=o*l}else if(e.order==="ZYX"){const d=o*u,p=o*f,v=a*u,S=a*f;n[0]=l*u,n[4]=v*c-p,n[8]=d*c+S,n[1]=l*f,n[5]=S*c+d,n[9]=p*c-v,n[2]=-c,n[6]=a*l,n[10]=o*l}else if(e.order==="YZX"){const d=o*l,p=o*c,v=a*l,S=a*c;n[0]=l*u,n[4]=S-d*f,n[8]=v*f+p,n[1]=f,n[5]=o*u,n[9]=-a*u,n[2]=-c*u,n[6]=p*f+v,n[10]=d-S*f}else if(e.order==="XZY"){const d=o*l,p=o*c,v=a*l,S=a*c;n[0]=l*u,n[4]=-f,n[8]=c*u,n[1]=d*f+S,n[5]=o*u,n[9]=p*f-v,n[2]=v*f-p,n[6]=a*u,n[10]=S*f+d}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Y3,e,K3)}lookAt(e,n,i){const r=this.elements;return Pn.subVectors(e,n),Pn.lengthSq()===0&&(Pn.z=1),Pn.normalize(),dr.crossVectors(i,Pn),dr.lengthSq()===0&&(Math.abs(i.z)===1?Pn.x+=1e-4:Pn.z+=1e-4,Pn.normalize(),dr.crossVectors(i,Pn)),dr.normalize(),Yl.crossVectors(Pn,dr),r[0]=dr.x,r[4]=Yl.x,r[8]=Pn.x,r[1]=dr.y,r[5]=Yl.y,r[9]=Pn.y,r[2]=dr.z,r[6]=Yl.z,r[10]=Pn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,o=i[0],a=i[4],l=i[8],c=i[12],u=i[1],f=i[5],d=i[9],p=i[13],v=i[2],S=i[6],g=i[10],h=i[14],m=i[3],_=i[7],M=i[11],w=i[15],T=r[0],R=r[4],y=r[8],C=r[12],D=r[1],P=r[5],N=r[9],H=r[13],V=r[2],F=r[6],j=r[10],B=r[14],I=r[3],$=r[7],K=r[11],ie=r[15];return s[0]=o*T+a*D+l*V+c*I,s[4]=o*R+a*P+l*F+c*$,s[8]=o*y+a*N+l*j+c*K,s[12]=o*C+a*H+l*B+c*ie,s[1]=u*T+f*D+d*V+p*I,s[5]=u*R+f*P+d*F+p*$,s[9]=u*y+f*N+d*j+p*K,s[13]=u*C+f*H+d*B+p*ie,s[2]=v*T+S*D+g*V+h*I,s[6]=v*R+S*P+g*F+h*$,s[10]=v*y+S*N+g*j+h*K,s[14]=v*C+S*H+g*B+h*ie,s[3]=m*T+_*D+M*V+w*I,s[7]=m*R+_*P+M*F+w*$,s[11]=m*y+_*N+M*j+w*K,s[15]=m*C+_*H+M*B+w*ie,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],o=e[1],a=e[5],l=e[9],c=e[13],u=e[2],f=e[6],d=e[10],p=e[14],v=e[3],S=e[7],g=e[11],h=e[15],m=l*p-c*d,_=a*p-c*f,M=a*d-l*f,w=o*p-c*u,T=o*d-l*u,R=o*f-a*u;return n*(S*m-g*_+h*M)-i*(v*m-g*w+h*T)+r*(v*_-S*w+h*R)-s*(v*M-S*T+g*R)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],o=e[4],a=e[5],l=e[6],c=e[7],u=e[8],f=e[9],d=e[10],p=e[11],v=e[12],S=e[13],g=e[14],h=e[15],m=n*a-i*o,_=n*l-r*o,M=n*c-s*o,w=i*l-r*a,T=i*c-s*a,R=r*c-s*l,y=u*S-f*v,C=u*g-d*v,D=u*h-p*v,P=f*g-d*S,N=f*h-p*S,H=d*h-p*g,V=m*H-_*N+M*P+w*D-T*C+R*y;if(V===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const F=1/V;return e[0]=(a*H-l*N+c*P)*F,e[1]=(r*N-i*H-s*P)*F,e[2]=(S*R-g*T+h*w)*F,e[3]=(d*T-f*R-p*w)*F,e[4]=(l*D-o*H-c*C)*F,e[5]=(n*H-r*D+s*C)*F,e[6]=(g*M-v*R-h*_)*F,e[7]=(u*R-d*M+p*_)*F,e[8]=(o*N-a*D+c*y)*F,e[9]=(i*D-n*N-s*y)*F,e[10]=(v*T-S*M+h*m)*F,e[11]=(f*M-u*T-p*m)*F,e[12]=(a*C-o*P-l*y)*F,e[13]=(n*P-i*C+r*y)*F,e[14]=(S*_-v*w-g*m)*F,e[15]=(u*w-f*_+d*m)*F,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,o=e.x,a=e.y,l=e.z,c=s*o,u=s*a;return this.set(c*o+i,c*a-r*l,c*l+r*a,0,c*a+r*l,u*a+i,u*l-r*o,0,c*l-r*a,u*l+r*o,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,o){return this.set(1,i,s,0,e,1,o,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,o=n._y,a=n._z,l=n._w,c=s+s,u=o+o,f=a+a,d=s*c,p=s*u,v=s*f,S=o*u,g=o*f,h=a*f,m=l*c,_=l*u,M=l*f,w=i.x,T=i.y,R=i.z;return r[0]=(1-(S+h))*w,r[1]=(p+M)*w,r[2]=(v-_)*w,r[3]=0,r[4]=(p-M)*T,r[5]=(1-(d+h))*T,r[6]=(g+m)*T,r[7]=0,r[8]=(v+_)*R,r[9]=(g-m)*R,r[10]=(1-(d+S))*R,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;e.x=r[12],e.y=r[13],e.z=r[14];const s=this.determinant();if(s===0)return i.set(1,1,1),n.identity(),this;let o=Fs.set(r[0],r[1],r[2]).length();const a=Fs.set(r[4],r[5],r[6]).length(),l=Fs.set(r[8],r[9],r[10]).length();s<0&&(o=-o),ni.copy(this);const c=1/o,u=1/a,f=1/l;return ni.elements[0]*=c,ni.elements[1]*=c,ni.elements[2]*=c,ni.elements[4]*=u,ni.elements[5]*=u,ni.elements[6]*=u,ni.elements[8]*=f,ni.elements[9]*=f,ni.elements[10]*=f,n.setFromRotationMatrix(ni),i.x=o,i.y=a,i.z=l,this}makePerspective(e,n,i,r,s,o,a=Ci,l=!1){const c=this.elements,u=2*s/(n-e),f=2*s/(i-r),d=(n+e)/(n-e),p=(i+r)/(i-r);let v,S;if(l)v=s/(o-s),S=o*s/(o-s);else if(a===Ci)v=-(o+s)/(o-s),S=-2*o*s/(o-s);else if(a===ol)v=-o/(o-s),S=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=d,c[12]=0,c[1]=0,c[5]=f,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=v,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,o,a=Ci,l=!1){const c=this.elements,u=2/(n-e),f=2/(i-r),d=-(n+e)/(n-e),p=-(i+r)/(i-r);let v,S;if(l)v=1/(o-s),S=o/(o-s);else if(a===Ci)v=-2/(o-s),S=-(o+s)/(o-s);else if(a===ol)v=-1/(o-s),S=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=u,c[4]=0,c[8]=0,c[12]=d,c[1]=0,c[5]=f,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=v,c[14]=S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}};Fu.prototype.isMatrix4=!0;let Nt=Fu;const Fs=new L,ni=new Nt,Y3=new L(0,0,0),K3=new L(1,1,1),dr=new L,Yl=new L,Pn=new L,Hx=new Nt,jx=new Vr;class Gr{constructor(e=0,n=0,i=0,r=Gr.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],o=r[4],a=r[8],l=r[1],c=r[5],u=r[9],f=r[2],d=r[6],p=r[10];switch(n){case"XYZ":this._y=Math.asin(We(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-u,p),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(d,c),this._z=0);break;case"YXZ":this._x=Math.asin(-We(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(a,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(We(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(-f,p),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-We(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(d,p),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(We(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(a,p));break;case"XZY":this._z=Math.asin(-We(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(d,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-u,p),this._y=0);break;default:ke("Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Hx.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Hx,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return jx.setFromEuler(this),this.setFromQuaternion(jx,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Gr.DEFAULT_ORDER="XYZ";class rE{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let q3=0;const Wx=new L,Os=new Vr,Oi=new Nt,Kl=new L,na=new L,Z3=new L,Q3=new Vr,Xx=new L(1,0,0),$x=new L(0,1,0),Yx=new L(0,0,1),Kx={type:"added"},J3={type:"removed"},ks={type:"childadded",child:null},sf={type:"childremoved",child:null};class hn extends Ps{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:q3++}),this.uuid=Zi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=hn.DEFAULT_UP.clone();const e=new L,n=new Gr,i=new Vr,r=new L(1,1,1);function s(){i.setFromEuler(n,!1)}function o(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new Nt},normalMatrix:{value:new Ge}}),this.matrix=new Nt,this.matrixWorld=new Nt,this.matrixAutoUpdate=hn.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new rE,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Os.setFromAxisAngle(e,n),this.quaternion.multiply(Os),this}rotateOnWorldAxis(e,n){return Os.setFromAxisAngle(e,n),this.quaternion.premultiply(Os),this}rotateX(e){return this.rotateOnAxis(Xx,e)}rotateY(e){return this.rotateOnAxis($x,e)}rotateZ(e){return this.rotateOnAxis(Yx,e)}translateOnAxis(e,n){return Wx.copy(e).applyQuaternion(this.quaternion),this.position.add(Wx.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Xx,e)}translateY(e){return this.translateOnAxis($x,e)}translateZ(e){return this.translateOnAxis(Yx,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Oi.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Kl.copy(e):Kl.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Oi.lookAt(na,Kl,this.up):Oi.lookAt(Kl,na,this.up),this.quaternion.setFromRotationMatrix(Oi),r&&(Oi.extractRotation(r.matrixWorld),Os.setFromRotationMatrix(Oi),this.quaternion.premultiply(Os.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(it("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Kx),ks.child=e,this.dispatchEvent(ks),ks.child=null):it("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(J3),sf.child=e,this.dispatchEvent(sf),sf.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Oi.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Oi.multiply(e.parent.matrixWorld)),e.applyMatrix4(Oi),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Kx),ks.child=e,this.dispatchEvent(ks),ks.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const o=this.children[i].getObjectByProperty(e,n);if(o!==void 0)return o}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,Z3),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,Q3,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const e=this.pivot;if(e!==null){const n=e.x,i=e.y,r=e.z,s=this.matrix.elements;s[12]+=n-s[0]*n-s[4]*i-s[8]*r,s[13]+=i-s[1]*n-s[5]*i-s[9]*r,s[14]+=r-s[2]*n-s[6]*i-s[10]*r}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,o=r.length;s<o;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),this.static!==!1&&(r.static=this.static),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.pivot!==null&&(r.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(r.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(r.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(a=>({...a})),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(e),r.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(e.materials,this.material[l]));r.material=a}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let a=0;a<this.children.length;a++)r.children.push(this.children[a].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];r.animations.push(s(e.animations,l))}}if(n){const a=o(e.geometries),l=o(e.materials),c=o(e.textures),u=o(e.images),f=o(e.shapes),d=o(e.skeletons),p=o(e.animations),v=o(e.nodes);a.length>0&&(i.geometries=a),l.length>0&&(i.materials=l),c.length>0&&(i.textures=c),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),d.length>0&&(i.skeletons=d),p.length>0&&(i.animations=p),v.length>0&&(i.nodes=v)}return i.object=r,i;function o(a){const l=[];for(const c in a){const u=a[c];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.pivot=e.pivot!==null?e.pivot.clone():null,this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.static=e.static,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}hn.DEFAULT_UP=new L(0,1,0);hn.DEFAULT_MATRIX_AUTO_UPDATE=!0;hn.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class va extends hn{constructor(){super(),this.isGroup=!0,this.type="Group"}}const e2={type:"move"};class of{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new va,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new va,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new L,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new L),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new va,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new L,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new L,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(c&&e.hand){o=!0;for(const S of e.hand.values()){const g=n.getJointPose(S,i),h=this._getHandJoint(c,S);g!==null&&(h.matrix.fromArray(g.transform.matrix),h.matrix.decompose(h.position,h.rotation,h.scale),h.matrixWorldNeedsUpdate=!0,h.jointRadius=g.radius),h.visible=g!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],d=u.position.distanceTo(f.position),p=.02,v=.005;c.inputState.pinching&&d>p+v?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&d<=p-v&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:e,target:this})));a!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(a.matrix.fromArray(r.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,r.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(r.linearVelocity)):a.hasLinearVelocity=!1,r.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(r.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(e2)))}return a!==null&&(a.visible=r!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new va;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const sE={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},fr={h:0,s:0,l:0},ql={h:0,s:0,l:0};function af(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class ot{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=Wn){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.colorSpaceToWorking(this,n),this}setRGB(e,n,i,r=Je.workingColorSpace){return this.r=e,this.g=n,this.b=i,Je.colorSpaceToWorking(this,r),this}setHSL(e,n,i,r=Je.workingColorSpace){if(e=Ag(e,1),n=We(n,0,1),i=We(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,o=2*i-s;this.r=af(o,s,e+1/3),this.g=af(o,s,e),this.b=af(o,s,e-1/3)}return Je.colorSpaceToWorking(this,r),this}setStyle(e,n=Wn){function i(s){s!==void 0&&parseFloat(s)<1&&ke("Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const o=r[1],a=r[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:ke("Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(o===6)return this.setHex(parseInt(s,16),n);ke("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=Wn){const i=sE[e.toLowerCase()];return i!==void 0?this.setHex(i,n):ke("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Qi(e.r),this.g=Qi(e.g),this.b=Qi(e.b),this}copyLinearToSRGB(e){return this.r=To(e.r),this.g=To(e.g),this.b=To(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Wn){return Je.workingToColorSpace(an.copy(this),e),Math.round(We(an.r*255,0,255))*65536+Math.round(We(an.g*255,0,255))*256+Math.round(We(an.b*255,0,255))}getHexString(e=Wn){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Je.workingColorSpace){Je.workingToColorSpace(an.copy(this),n);const i=an.r,r=an.g,s=an.b,o=Math.max(i,r,s),a=Math.min(i,r,s);let l,c;const u=(a+o)/2;if(a===o)l=0,c=0;else{const f=o-a;switch(c=u<=.5?f/(o+a):f/(2-o-a),o){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=c,e.l=u,e}getRGB(e,n=Je.workingColorSpace){return Je.workingToColorSpace(an.copy(this),n),e.r=an.r,e.g=an.g,e.b=an.b,e}getStyle(e=Wn){Je.workingToColorSpace(an.copy(this),e);const n=an.r,i=an.g,r=an.b;return e!==Wn?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(fr),this.setHSL(fr.h+e,fr.s+n,fr.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(fr),e.getHSL(ql);const i=Na(fr.h,ql.h,n),r=Na(fr.s,ql.s,n),s=Na(fr.l,ql.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const an=new ot;ot.NAMES=sE;class t2 extends hn{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Gr,this.environmentIntensity=1,this.environmentRotation=new Gr,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}const ii=new L,ki=new L,lf=new L,Bi=new L,Bs=new L,zs=new L,qx=new L,cf=new L,uf=new L,df=new L,ff=new gt,hf=new gt,pf=new gt;class Kn{constructor(e=new L,n=new L,i=new L){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),ii.subVectors(e,n),r.cross(ii);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){ii.subVectors(r,n),ki.subVectors(i,n),lf.subVectors(e,n);const o=ii.dot(ii),a=ii.dot(ki),l=ii.dot(lf),c=ki.dot(ki),u=ki.dot(lf),f=o*c-a*a;if(f===0)return s.set(0,0,0),null;const d=1/f,p=(c*l-a*u)*d,v=(o*u-a*l)*d;return s.set(1-p-v,v,p)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,Bi)===null?!1:Bi.x>=0&&Bi.y>=0&&Bi.x+Bi.y<=1}static getInterpolation(e,n,i,r,s,o,a,l){return this.getBarycoord(e,n,i,r,Bi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Bi.x),l.addScaledVector(o,Bi.y),l.addScaledVector(a,Bi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,o){return ff.setScalar(0),hf.setScalar(0),pf.setScalar(0),ff.fromBufferAttribute(e,n),hf.fromBufferAttribute(e,i),pf.fromBufferAttribute(e,r),o.setScalar(0),o.addScaledVector(ff,s.x),o.addScaledVector(hf,s.y),o.addScaledVector(pf,s.z),o}static isFrontFacing(e,n,i,r){return ii.subVectors(i,n),ki.subVectors(e,n),ii.cross(ki).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return ii.subVectors(this.c,this.b),ki.subVectors(this.a,this.b),ii.cross(ki).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return Kn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return Kn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return Kn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return Kn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return Kn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let o,a;Bs.subVectors(r,i),zs.subVectors(s,i),cf.subVectors(e,i);const l=Bs.dot(cf),c=zs.dot(cf);if(l<=0&&c<=0)return n.copy(i);uf.subVectors(e,r);const u=Bs.dot(uf),f=zs.dot(uf);if(u>=0&&f<=u)return n.copy(r);const d=l*f-u*c;if(d<=0&&l>=0&&u<=0)return o=l/(l-u),n.copy(i).addScaledVector(Bs,o);df.subVectors(e,s);const p=Bs.dot(df),v=zs.dot(df);if(v>=0&&p<=v)return n.copy(s);const S=p*c-l*v;if(S<=0&&c>=0&&v<=0)return a=c/(c-v),n.copy(i).addScaledVector(zs,a);const g=u*v-p*f;if(g<=0&&f-u>=0&&p-v>=0)return qx.subVectors(s,r),a=(f-u)/(f-u+(p-v)),n.copy(r).addScaledVector(qx,a);const h=1/(g+S+d);return o=S*h,a=d*h,n.copy(i).addScaledVector(Bs,o).addScaledVector(zs,a)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}class $r{constructor(e=new L(1/0,1/0,1/0),n=new L(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(ri.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(ri.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=ri.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)e.isMesh===!0?e.getVertexPosition(o,ri):ri.fromBufferAttribute(s,o),ri.applyMatrix4(e.matrixWorld),this.expandByPoint(ri);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Zl.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Zl.copy(i.boundingBox)),Zl.applyMatrix4(e.matrixWorld),this.union(Zl)}const r=e.children;for(let s=0,o=r.length;s<o;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ri),ri.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ia),Ql.subVectors(this.max,ia),Vs.subVectors(e.a,ia),Gs.subVectors(e.b,ia),Hs.subVectors(e.c,ia),hr.subVectors(Gs,Vs),pr.subVectors(Hs,Gs),qr.subVectors(Vs,Hs);let n=[0,-hr.z,hr.y,0,-pr.z,pr.y,0,-qr.z,qr.y,hr.z,0,-hr.x,pr.z,0,-pr.x,qr.z,0,-qr.x,-hr.y,hr.x,0,-pr.y,pr.x,0,-qr.y,qr.x,0];return!mf(n,Vs,Gs,Hs,Ql)||(n=[1,0,0,0,1,0,0,0,1],!mf(n,Vs,Gs,Hs,Ql))?!1:(Jl.crossVectors(hr,pr),n=[Jl.x,Jl.y,Jl.z],mf(n,Vs,Gs,Hs,Ql))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ri).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ri).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(zi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),zi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),zi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),zi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),zi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),zi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),zi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),zi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(zi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const zi=[new L,new L,new L,new L,new L,new L,new L,new L],ri=new L,Zl=new $r,Vs=new L,Gs=new L,Hs=new L,hr=new L,pr=new L,qr=new L,ia=new L,Ql=new L,Jl=new L,Zr=new L;function mf(t,e,n,i,r){for(let s=0,o=t.length-3;s<=o;s+=3){Zr.fromArray(t,s);const a=r.x*Math.abs(Zr.x)+r.y*Math.abs(Zr.y)+r.z*Math.abs(Zr.z),l=e.dot(Zr),c=n.dot(Zr),u=i.dot(Zr);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>a)return!1}return!0}const kt=new L,ec=new Qe;let n2=0;class hi extends Ps{constructor(e,n,i=!1){if(super(),Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:n2++}),this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=kp,this.updateRanges=[],this.gpuType=Ai,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)ec.fromBufferAttribute(this,n),ec.applyMatrix3(e),this.setXY(n,ec.x,ec.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.applyMatrix3(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.applyMatrix4(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.applyNormalMatrix(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)kt.fromBufferAttribute(this,n),kt.transformDirection(e),this.setXYZ(n,kt.x,kt.y,kt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=ci(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ct(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=ci(n,this.array)),n}setX(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=ci(n,this.array)),n}setY(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=ci(n,this.array)),n}setZ(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=ci(n,this.array)),n}setW(e,n){return this.normalized&&(n=ct(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array),s=ct(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==kp&&(e.usage=this.usage),e}dispose(){this.dispatchEvent({type:"dispose"})}}class oE extends hi{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class aE extends hi{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Gt extends hi{constructor(e,n,i){super(new Float32Array(e),n,i)}}const i2=new $r,ra=new L,gf=new L;class xl{constructor(e=new L,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):i2.setFromPoints(e).getCenter(i);let r=0;for(let s=0,o=e.length;s<o;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ra.subVectors(e,this.center);const n=ra.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ra,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(gf.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ra.copy(e.center).add(gf)),this.expandByPoint(ra.copy(e.center).sub(gf))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}let r2=0;const Hn=new Nt,vf=new hn,js=new L,Dn=new $r,sa=new $r,Wt=new L;class Cn extends Ps{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:r2++}),this.uuid=Zi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(S3(e)?aE:oE)(e,1):this.index=e,this}setIndirect(e,n=0){return this.indirect=e,this.indirectOffset=n,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Ge().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Hn.makeRotationFromQuaternion(e),this.applyMatrix4(Hn),this}rotateX(e){return Hn.makeRotationX(e),this.applyMatrix4(Hn),this}rotateY(e){return Hn.makeRotationY(e),this.applyMatrix4(Hn),this}rotateZ(e){return Hn.makeRotationZ(e),this.applyMatrix4(Hn),this}translate(e,n,i){return Hn.makeTranslation(e,n,i),this.applyMatrix4(Hn),this}scale(e,n,i){return Hn.makeScale(e,n,i),this.applyMatrix4(Hn),this}lookAt(e){return vf.lookAt(e),vf.updateMatrix(),this.applyMatrix4(vf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(js).negate(),this.translate(js.x,js.y,js.z),this}setFromPoints(e){const n=this.getAttribute("position");if(n===void 0){const i=[];for(let r=0,s=e.length;r<s;r++){const o=e[r];i.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Gt(i,3))}else{const i=Math.min(e.length,n.count);for(let r=0;r<i;r++){const s=e[r];n.setXYZ(r,s.x,s.y,s.z||0)}e.length>n.count&&ke("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),n.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $r);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new L(-1/0,-1/0,-1/0),new L(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];Dn.setFromBufferAttribute(s),this.morphTargetsRelative?(Wt.addVectors(this.boundingBox.min,Dn.min),this.boundingBox.expandByPoint(Wt),Wt.addVectors(this.boundingBox.max,Dn.max),this.boundingBox.expandByPoint(Wt)):(this.boundingBox.expandByPoint(Dn.min),this.boundingBox.expandByPoint(Dn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&it('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xl);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){it("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new L,1/0);return}if(e){const i=this.boundingSphere.center;if(Dn.setFromBufferAttribute(e),n)for(let s=0,o=n.length;s<o;s++){const a=n[s];sa.setFromBufferAttribute(a),this.morphTargetsRelative?(Wt.addVectors(Dn.min,sa.min),Dn.expandByPoint(Wt),Wt.addVectors(Dn.max,sa.max),Dn.expandByPoint(Wt)):(Dn.expandByPoint(sa.min),Dn.expandByPoint(sa.max))}Dn.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)Wt.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Wt));if(n)for(let s=0,o=n.length;s<o;s++){const a=n[s],l=this.morphTargetsRelative;for(let c=0,u=a.count;c<u;c++)Wt.fromBufferAttribute(a,c),l&&(js.fromBufferAttribute(e,c),Wt.add(js)),r=Math.max(r,i.distanceToSquared(Wt))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&it('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){it("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new hi(new Float32Array(4*i.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let y=0;y<i.count;y++)a[y]=new L,l[y]=new L;const c=new L,u=new L,f=new L,d=new Qe,p=new Qe,v=new Qe,S=new L,g=new L;function h(y,C,D){c.fromBufferAttribute(i,y),u.fromBufferAttribute(i,C),f.fromBufferAttribute(i,D),d.fromBufferAttribute(s,y),p.fromBufferAttribute(s,C),v.fromBufferAttribute(s,D),u.sub(c),f.sub(c),p.sub(d),v.sub(d);const P=1/(p.x*v.y-v.x*p.y);isFinite(P)&&(S.copy(u).multiplyScalar(v.y).addScaledVector(f,-p.y).multiplyScalar(P),g.copy(f).multiplyScalar(p.x).addScaledVector(u,-v.x).multiplyScalar(P),a[y].add(S),a[C].add(S),a[D].add(S),l[y].add(g),l[C].add(g),l[D].add(g))}let m=this.groups;m.length===0&&(m=[{start:0,count:e.count}]);for(let y=0,C=m.length;y<C;++y){const D=m[y],P=D.start,N=D.count;for(let H=P,V=P+N;H<V;H+=3)h(e.getX(H+0),e.getX(H+1),e.getX(H+2))}const _=new L,M=new L,w=new L,T=new L;function R(y){w.fromBufferAttribute(r,y),T.copy(w);const C=a[y];_.copy(C),_.sub(w.multiplyScalar(w.dot(C))).normalize(),M.crossVectors(T,C);const P=M.dot(l[y])<0?-1:1;o.setXYZW(y,_.x,_.y,_.z,P)}for(let y=0,C=m.length;y<C;++y){const D=m[y],P=D.start,N=D.count;for(let H=P,V=P+N;H<V;H+=3)R(e.getX(H+0)),R(e.getX(H+1)),R(e.getX(H+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new hi(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let d=0,p=i.count;d<p;d++)i.setXYZ(d,0,0,0);const r=new L,s=new L,o=new L,a=new L,l=new L,c=new L,u=new L,f=new L;if(e)for(let d=0,p=e.count;d<p;d+=3){const v=e.getX(d+0),S=e.getX(d+1),g=e.getX(d+2);r.fromBufferAttribute(n,v),s.fromBufferAttribute(n,S),o.fromBufferAttribute(n,g),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),a.fromBufferAttribute(i,v),l.fromBufferAttribute(i,S),c.fromBufferAttribute(i,g),a.add(u),l.add(u),c.add(u),i.setXYZ(v,a.x,a.y,a.z),i.setXYZ(S,l.x,l.y,l.z),i.setXYZ(g,c.x,c.y,c.z)}else for(let d=0,p=n.count;d<p;d+=3)r.fromBufferAttribute(n,d+0),s.fromBufferAttribute(n,d+1),o.fromBufferAttribute(n,d+2),u.subVectors(o,s),f.subVectors(r,s),u.cross(f),i.setXYZ(d+0,u.x,u.y,u.z),i.setXYZ(d+1,u.x,u.y,u.z),i.setXYZ(d+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Wt.fromBufferAttribute(e,n),Wt.normalize(),e.setXYZ(n,Wt.x,Wt.y,Wt.z)}toNonIndexed(){function e(a,l){const c=a.array,u=a.itemSize,f=a.normalized,d=new c.constructor(l.length*u);let p=0,v=0;for(let S=0,g=l.length;S<g;S++){a.isInterleavedBufferAttribute?p=l[S]*a.data.stride+a.offset:p=l[S]*u;for(let h=0;h<u;h++)d[v++]=c[p++]}return new hi(d,u,f)}if(this.index===null)return ke("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new Cn,i=this.index.array,r=this.attributes;for(const a in r){const l=r[a],c=e(l,i);n.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let u=0,f=c.length;u<f;u++){const d=c[u],p=e(d,i);l.push(p)}n.morphAttributes[a]=l}n.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];n.addGroup(c.start,c.count,c.materialIndex)}return n}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const c=i[l];e.data.attributes[l]=c.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,d=c.length;f<d;f++){const p=c[f];u.push(p.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(e.data.boundingSphere=a.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone());const r=e.attributes;for(const c in r){const u=r[c];this.setAttribute(c,u.clone(n))}const s=e.morphAttributes;for(const c in s){const u=[],f=s[c];for(let d=0,p=f.length;d<p;d++)u.push(f[d].clone(n));this.morphAttributes[c]=u}this.morphTargetsRelative=e.morphTargetsRelative;const o=e.groups;for(let c=0,u=o.length;c<u;c++){const f=o[c];this.addGroup(f.start,f.count,f.materialIndex)}const a=e.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}class s2{constructor(e,n){this.isInterleavedBuffer=!0,this.array=e,this.stride=n,this.count=e!==void 0?e.length/n:0,this.usage=kp,this.updateRanges=[],this.version=0,this.uuid=Zi()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,n,i){e*=this.stride,i*=n.stride;for(let r=0,s=this.stride;r<s;r++)this.array[e+r]=n.array[i+r];return this}set(e,n=0){return this.array.set(e,n),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);const n=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),i=new this.constructor(n,this.stride);return i.setUsage(this.usage),i}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Zi()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}}const mn=new L;class wr{constructor(e,n,i,r=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=n,this.offset=i,this.normalized=r}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let n=0,i=this.data.count;n<i;n++)mn.fromBufferAttribute(this,n),mn.applyMatrix4(e),this.setXYZ(n,mn.x,mn.y,mn.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)mn.fromBufferAttribute(this,n),mn.applyNormalMatrix(e),this.setXYZ(n,mn.x,mn.y,mn.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)mn.fromBufferAttribute(this,n),mn.transformDirection(e),this.setXYZ(n,mn.x,mn.y,mn.z);return this}getComponent(e,n){let i=this.array[e*this.data.stride+this.offset+n];return this.normalized&&(i=ci(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=ct(i,this.array)),this.data.array[e*this.data.stride+this.offset+n]=i,this}setX(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset]=n,this}setY(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+1]=n,this}setZ(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+2]=n,this}setW(e,n){return this.normalized&&(n=ct(n,this.array)),this.data.array[e*this.data.stride+this.offset+3]=n,this}getX(e){let n=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(n=ci(n,this.array)),n}getY(e){let n=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(n=ci(n,this.array)),n}getZ(e){let n=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(n=ci(n,this.array)),n}getW(e){let n=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(n=ci(n,this.array)),n}setXY(e,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this}setXYZ(e,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e=e*this.data.stride+this.offset,this.normalized&&(n=ct(n,this.array),i=ct(i,this.array),r=ct(r,this.array),s=ct(s,this.array)),this.data.array[e+0]=n,this.data.array[e+1]=i,this.data.array[e+2]=r,this.data.array[e+3]=s,this}clone(e){if(e===void 0){Du("InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return new hi(new this.array.constructor(n),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new wr(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){Du("InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");const n=[];for(let i=0;i<this.count;i++){const r=i*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)n.push(this.data.array[r+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:n,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}}let o2=0;class _l extends Ps{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:o2++}),this.uuid=Zi(),this.name="",this.type="Material",this.blending=Mo,this.side=zr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=qh,this.blendDst=Zh,this.blendEquation=ss,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new ot(0,0,0),this.blendAlpha=0,this.depthFunc=Uo,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fx,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Is,this.stencilZFail=Is,this.stencilZPass=Is,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){ke(`Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){ke(`Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(i.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(i.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Mo&&(i.blending=this.blending),this.side!==zr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==qh&&(i.blendSrc=this.blendSrc),this.blendDst!==Zh&&(i.blendDst=this.blendDst),this.blendEquation!==ss&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Uo&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fx&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Is&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Is&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Is&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.allowOverride===!1&&(i.allowOverride=!1),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(n){const s=r(e.textures),o=r(e.images);s.length>0&&(i.textures=s),o.length>0&&(i.images=o)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.allowOverride=e.allowOverride,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}const Vi=new L,xf=new L,tc=new L,mr=new L,_f=new L,nc=new L,yf=new L;class a2{constructor(e=new L,n=new L(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Vi)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=Vi.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(Vi.copy(this.origin).addScaledVector(this.direction,n),Vi.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){xf.copy(e).add(n).multiplyScalar(.5),tc.copy(n).sub(e).normalize(),mr.copy(this.origin).sub(xf);const s=e.distanceTo(n)*.5,o=-this.direction.dot(tc),a=mr.dot(this.direction),l=-mr.dot(tc),c=mr.lengthSq(),u=Math.abs(1-o*o);let f,d,p,v;if(u>0)if(f=o*l-a,d=o*a-l,v=s*u,f>=0)if(d>=-v)if(d<=v){const S=1/u;f*=S,d*=S,p=f*(f+o*d+2*a)+d*(o*f+d+2*l)+c}else d=s,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*l)+c;else d=-s,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*l)+c;else d<=-v?(f=Math.max(0,-(-o*s+a)),d=f>0?-s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c):d<=v?(f=0,d=Math.min(Math.max(-s,-l),s),p=d*(d+2*l)+c):(f=Math.max(0,-(o*s+a)),d=f>0?s:Math.min(Math.max(-s,-l),s),p=-f*f+d*(d+2*l)+c);else d=o>0?-s:s,f=Math.max(0,-(o*d+a)),p=-f*f+d*(d+2*l)+c;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(xf).addScaledVector(tc,d),p}intersectSphere(e,n){Vi.subVectors(e.center,this.origin);const i=Vi.dot(this.direction),r=Vi.dot(Vi)-i*i,s=e.radius*e.radius;if(r>s)return null;const o=Math.sqrt(s-r),a=i-o,l=i+o;return l<0?null:a<0?this.at(l,n):this.at(a,n)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,o,a,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,d=this.origin;return c>=0?(i=(e.min.x-d.x)*c,r=(e.max.x-d.x)*c):(i=(e.max.x-d.x)*c,r=(e.min.x-d.x)*c),u>=0?(s=(e.min.y-d.y)*u,o=(e.max.y-d.y)*u):(s=(e.max.y-d.y)*u,o=(e.min.y-d.y)*u),i>o||s>r||((s>i||isNaN(i))&&(i=s),(o<r||isNaN(r))&&(r=o),f>=0?(a=(e.min.z-d.z)*f,l=(e.max.z-d.z)*f):(a=(e.max.z-d.z)*f,l=(e.min.z-d.z)*f),i>l||a>r)||((a>i||i!==i)&&(i=a),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,Vi)!==null}intersectTriangle(e,n,i,r,s){_f.subVectors(n,e),nc.subVectors(i,e),yf.crossVectors(_f,nc);let o=this.direction.dot(yf),a;if(o>0){if(r)return null;a=1}else if(o<0)a=-1,o=-o;else return null;mr.subVectors(this.origin,e);const l=a*this.direction.dot(nc.crossVectors(mr,nc));if(l<0)return null;const c=a*this.direction.dot(_f.cross(mr));if(c<0||l+c>o)return null;const u=-a*mr.dot(yf);return u<0?null:this.at(u/o,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Rg extends _l{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new ot(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gr,this.combine=z1,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Zx=new Nt,Qr=new a2,ic=new xl,Qx=new L,rc=new L,sc=new L,oc=new L,Sf=new L,ac=new L,Jx=new L,lc=new L;class ei extends hn{constructor(e=new Cn,n=new Rg){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=r.length;s<o;s++){const a=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,o=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const a=this.morphTargetInfluences;if(s&&a){ac.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const u=a[l],f=s[l];u!==0&&(Sf.fromBufferAttribute(f,e),o?ac.addScaledVector(Sf,u):ac.addScaledVector(Sf.sub(n),u))}n.add(ac)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),ic.copy(i.boundingSphere),ic.applyMatrix4(s),Qr.copy(e.ray).recast(e.near),!(ic.containsPoint(Qr.origin)===!1&&(Qr.intersectSphere(ic,Qx)===null||Qr.origin.distanceToSquared(Qx)>(e.far-e.near)**2))&&(Zx.copy(s).invert(),Qr.copy(e.ray).applyMatrix4(Zx),!(i.boundingBox!==null&&Qr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,Qr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,d=s.groups,p=s.drawRange;if(a!==null)if(Array.isArray(o))for(let v=0,S=d.length;v<S;v++){const g=d[v],h=o[g.materialIndex],m=Math.max(g.start,p.start),_=Math.min(a.count,Math.min(g.start+g.count,p.start+p.count));for(let M=m,w=_;M<w;M+=3){const T=a.getX(M),R=a.getX(M+1),y=a.getX(M+2);r=cc(this,h,e,i,c,u,f,T,R,y),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),S=Math.min(a.count,p.start+p.count);for(let g=v,h=S;g<h;g+=3){const m=a.getX(g),_=a.getX(g+1),M=a.getX(g+2);r=cc(this,o,e,i,c,u,f,m,_,M),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(o))for(let v=0,S=d.length;v<S;v++){const g=d[v],h=o[g.materialIndex],m=Math.max(g.start,p.start),_=Math.min(l.count,Math.min(g.start+g.count,p.start+p.count));for(let M=m,w=_;M<w;M+=3){const T=M,R=M+1,y=M+2;r=cc(this,h,e,i,c,u,f,T,R,y),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const v=Math.max(0,p.start),S=Math.min(l.count,p.start+p.count);for(let g=v,h=S;g<h;g+=3){const m=g,_=g+1,M=g+2;r=cc(this,o,e,i,c,u,f,m,_,M),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function l2(t,e,n,i,r,s,o,a){let l;if(e.side===An?l=i.intersectTriangle(o,s,r,!0,a):l=i.intersectTriangle(r,s,o,e.side===zr,a),l===null)return null;lc.copy(a),lc.applyMatrix4(t.matrixWorld);const c=n.ray.origin.distanceTo(lc);return c<n.near||c>n.far?null:{distance:c,point:lc.clone(),object:t}}function cc(t,e,n,i,r,s,o,a,l,c){t.getVertexPosition(a,rc),t.getVertexPosition(l,sc),t.getVertexPosition(c,oc);const u=l2(t,e,n,i,rc,sc,oc,Jx);if(u){const f=new L;Kn.getBarycoord(Jx,rc,sc,oc,f),r&&(u.uv=Kn.getInterpolatedAttribute(r,a,l,c,f,new Qe)),s&&(u.uv1=Kn.getInterpolatedAttribute(s,a,l,c,f,new Qe)),o&&(u.normal=Kn.getInterpolatedAttribute(o,a,l,c,f,new L),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const d={a,b:l,c,normal:new L,materialIndex:0};Kn.getNormal(rc,sc,oc,d.normal),u.face=d,u.barycoord=f}return u}class c2 extends fn{constructor(e=null,n=1,i=1,r,s,o,a,l,c=Jt,u=Jt,f,d){super(null,o,a,l,c,u,r,s,f,d),this.isDataTexture=!0,this.image={data:e,width:n,height:i},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const Mf=new L,u2=new L,d2=new Ge;class rs{constructor(e=new L(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=Mf.subVectors(i,n).cross(u2.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n,i=!0){const r=e.delta(Mf),s=this.normal.dot(r);if(s===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const o=-(e.start.dot(this.normal)+this.constant)/s;return i===!0&&(o<0||o>1)?null:n.copy(e.start).addScaledVector(r,o)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||d2.getNormalMatrix(e),r=this.coplanarPoint(Mf).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Jr=new xl,f2=new Qe(.5,.5),uc=new L;class Pg{constructor(e=new rs,n=new rs,i=new rs,r=new rs,s=new rs,o=new rs){this.planes=[e,n,i,r,s,o]}set(e,n,i,r,s,o){const a=this.planes;return a[0].copy(e),a[1].copy(n),a[2].copy(i),a[3].copy(r),a[4].copy(s),a[5].copy(o),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=Ci,i=!1){const r=this.planes,s=e.elements,o=s[0],a=s[1],l=s[2],c=s[3],u=s[4],f=s[5],d=s[6],p=s[7],v=s[8],S=s[9],g=s[10],h=s[11],m=s[12],_=s[13],M=s[14],w=s[15];if(r[0].setComponents(c-o,p-u,h-v,w-m).normalize(),r[1].setComponents(c+o,p+u,h+v,w+m).normalize(),r[2].setComponents(c+a,p+f,h+S,w+_).normalize(),r[3].setComponents(c-a,p-f,h-S,w-_).normalize(),i)r[4].setComponents(l,d,g,M).normalize(),r[5].setComponents(c-l,p-d,h-g,w-M).normalize();else if(r[4].setComponents(c-l,p-d,h-g,w-M).normalize(),n===Ci)r[5].setComponents(c+l,p+d,h+g,w+M).normalize();else if(n===ol)r[5].setComponents(l,d,g,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),Jr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),Jr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(Jr)}intersectsSprite(e){Jr.center.set(0,0,0);const n=f2.distanceTo(e.center);return Jr.radius=.7071067811865476+n,Jr.applyMatrix4(e.matrixWorld),this.intersectsSphere(Jr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(uc.x=r.normal.x>0?e.max.x:e.min.x,uc.y=r.normal.y>0?e.max.y:e.min.y,uc.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(uc)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class lE extends fn{constructor(e=[],n=ws,i,r,s,o,a,l,c,u){super(e,n,i,r,s,o,a,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class h2 extends fn{constructor(e,n,i,r,s,o,a,l,c){super(e,n,i,r,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Oo extends fn{constructor(e,n,i=Ui,r,s,o,a=Jt,l=Jt,c,u=sr,f=1){if(u!==sr&&u!==ps)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const d={width:e,height:n,depth:f};super(d,r,s,o,a,l,u,i,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new Cg(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}class p2 extends Oo{constructor(e,n=Ui,i=ws,r,s,o=Jt,a=Jt,l,c=sr){const u={width:e,height:e,depth:1},f=[u,u,u,u,u,u];super(e,e,n,i,r,s,o,a,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(e){this.image=e}}class cE extends fn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class jo extends Cn{constructor(e=1,n=1,i=1,r=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:o};const a=this;r=Math.floor(r),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],u=[],f=[];let d=0,p=0;v("z","y","x",-1,-1,i,n,e,o,s,0),v("z","y","x",1,-1,i,n,-e,o,s,1),v("x","z","y",1,1,e,i,n,r,o,2),v("x","z","y",1,-1,e,i,-n,r,o,3),v("x","y","z",1,-1,e,n,i,r,s,4),v("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Gt(c,3)),this.setAttribute("normal",new Gt(u,3)),this.setAttribute("uv",new Gt(f,2));function v(S,g,h,m,_,M,w,T,R,y,C){const D=M/R,P=w/y,N=M/2,H=w/2,V=T/2,F=R+1,j=y+1;let B=0,I=0;const $=new L;for(let K=0;K<j;K++){const ie=K*P-H;for(let fe=0;fe<F;fe++){const Fe=fe*D-N;$[S]=Fe*m,$[g]=ie*_,$[h]=V,c.push($.x,$.y,$.z),$[S]=0,$[g]=0,$[h]=T>0?1:-1,u.push($.x,$.y,$.z),f.push(fe/R),f.push(1-K/y),B+=1}}for(let K=0;K<y;K++)for(let ie=0;ie<R;ie++){const fe=d+ie+F*K,Fe=d+ie+F*(K+1),Be=d+(ie+1)+F*(K+1),Le=d+(ie+1)+F*K;l.push(fe,Fe,Le),l.push(Fe,Be,Le),I+=6}a.addGroup(p,I,C),p+=I,d+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new jo(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}class Dg extends Cn{constructor(e=1,n=1,i=1,r=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:n,height:i,radialSegments:r,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;r=Math.floor(r),s=Math.floor(s);const u=[],f=[],d=[],p=[];let v=0;const S=[],g=i/2;let h=0;m(),o===!1&&(e>0&&_(!0),n>0&&_(!1)),this.setIndex(u),this.setAttribute("position",new Gt(f,3)),this.setAttribute("normal",new Gt(d,3)),this.setAttribute("uv",new Gt(p,2));function m(){const M=new L,w=new L;let T=0;const R=(n-e)/i;for(let y=0;y<=s;y++){const C=[],D=y/s,P=D*(n-e)+e;for(let N=0;N<=r;N++){const H=N/r,V=H*l+a,F=Math.sin(V),j=Math.cos(V);w.x=P*F,w.y=-D*i+g,w.z=P*j,f.push(w.x,w.y,w.z),M.set(F,R,j).normalize(),d.push(M.x,M.y,M.z),p.push(H,1-D),C.push(v++)}S.push(C)}for(let y=0;y<r;y++)for(let C=0;C<s;C++){const D=S[C][y],P=S[C+1][y],N=S[C+1][y+1],H=S[C][y+1];(e>0||C!==0)&&(u.push(D,P,H),T+=3),(n>0||C!==s-1)&&(u.push(P,N,H),T+=3)}c.addGroup(h,T,0),h+=T}function _(M){const w=v,T=new Qe,R=new L;let y=0;const C=M===!0?e:n,D=M===!0?1:-1;for(let N=1;N<=r;N++)f.push(0,g*D,0),d.push(0,D,0),p.push(.5,.5),v++;const P=v;for(let N=0;N<=r;N++){const V=N/r*l+a,F=Math.cos(V),j=Math.sin(V);R.x=C*j,R.y=g*D,R.z=C*F,f.push(R.x,R.y,R.z),d.push(0,D,0),T.x=F*.5+.5,T.y=j*.5*D+.5,p.push(T.x,T.y),v++}for(let N=0;N<r;N++){const H=w+N,V=P+N;M===!0?u.push(V,V+1,H):u.push(V+1,V,H),y+=3}c.addGroup(h,y,M===!0?1:2),h+=y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Dg(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Wo extends Cn{constructor(e=[],n=[],i=1,r=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:e,indices:n,radius:i,detail:r};const s=[],o=[];a(r),c(i),u(),this.setAttribute("position",new Gt(s,3)),this.setAttribute("normal",new Gt(s.slice(),3)),this.setAttribute("uv",new Gt(o,2)),r===0?this.computeVertexNormals():this.normalizeNormals();function a(m){const _=new L,M=new L,w=new L;for(let T=0;T<n.length;T+=3)p(n[T+0],_),p(n[T+1],M),p(n[T+2],w),l(_,M,w,m)}function l(m,_,M,w){const T=w+1,R=[];for(let y=0;y<=T;y++){R[y]=[];const C=m.clone().lerp(M,y/T),D=_.clone().lerp(M,y/T),P=T-y;for(let N=0;N<=P;N++)N===0&&y===T?R[y][N]=C:R[y][N]=C.clone().lerp(D,N/P)}for(let y=0;y<T;y++)for(let C=0;C<2*(T-y)-1;C++){const D=Math.floor(C/2);C%2===0?(d(R[y][D+1]),d(R[y+1][D]),d(R[y][D])):(d(R[y][D+1]),d(R[y+1][D+1]),d(R[y+1][D]))}}function c(m){const _=new L;for(let M=0;M<s.length;M+=3)_.x=s[M+0],_.y=s[M+1],_.z=s[M+2],_.normalize().multiplyScalar(m),s[M+0]=_.x,s[M+1]=_.y,s[M+2]=_.z}function u(){const m=new L;for(let _=0;_<s.length;_+=3){m.x=s[_+0],m.y=s[_+1],m.z=s[_+2];const M=g(m)/2/Math.PI+.5,w=h(m)/Math.PI+.5;o.push(M,1-w)}v(),f()}function f(){for(let m=0;m<o.length;m+=6){const _=o[m+0],M=o[m+2],w=o[m+4],T=Math.max(_,M,w),R=Math.min(_,M,w);T>.9&&R<.1&&(_<.2&&(o[m+0]+=1),M<.2&&(o[m+2]+=1),w<.2&&(o[m+4]+=1))}}function d(m){s.push(m.x,m.y,m.z)}function p(m,_){const M=m*3;_.x=e[M+0],_.y=e[M+1],_.z=e[M+2]}function v(){const m=new L,_=new L,M=new L,w=new L,T=new Qe,R=new Qe,y=new Qe;for(let C=0,D=0;C<s.length;C+=9,D+=6){m.set(s[C+0],s[C+1],s[C+2]),_.set(s[C+3],s[C+4],s[C+5]),M.set(s[C+6],s[C+7],s[C+8]),T.set(o[D+0],o[D+1]),R.set(o[D+2],o[D+3]),y.set(o[D+4],o[D+5]),w.copy(m).add(_).add(M).divideScalar(3);const P=g(w);S(T,D+0,m,P),S(R,D+2,_,P),S(y,D+4,M,P)}}function S(m,_,M,w){w<0&&m.x===1&&(o[_]=m.x-1),M.x===0&&M.z===0&&(o[_]=w/2/Math.PI+.5)}function g(m){return Math.atan2(m.z,-m.x)}function h(m){return Math.atan2(-m.y,Math.sqrt(m.x*m.x+m.z*m.z))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Wo(e.vertices,e.indices,e.radius,e.detail)}}class Ng extends Wo{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=1/i,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-r,-i,0,-r,i,0,r,-i,0,r,i,-r,-i,0,-r,i,0,r,-i,0,r,i,0,-i,0,-r,i,0,-r,-i,0,r,i,0,r],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,e,n),this.type="DodecahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Ng(e.radius,e.detail)}}const dc=new L,fc=new L,Ef=new L,hc=new Kn;class m2 extends Cn{constructor(e=null,n=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:e,thresholdAngle:n},e!==null){const r=Math.pow(10,4),s=Math.cos(Eo*n),o=e.getIndex(),a=e.getAttribute("position"),l=o?o.count:a.count,c=[0,0,0],u=["a","b","c"],f=new Array(3),d={},p=[];for(let v=0;v<l;v+=3){o?(c[0]=o.getX(v),c[1]=o.getX(v+1),c[2]=o.getX(v+2)):(c[0]=v,c[1]=v+1,c[2]=v+2);const{a:S,b:g,c:h}=hc;if(S.fromBufferAttribute(a,c[0]),g.fromBufferAttribute(a,c[1]),h.fromBufferAttribute(a,c[2]),hc.getNormal(Ef),f[0]=`${Math.round(S.x*r)},${Math.round(S.y*r)},${Math.round(S.z*r)}`,f[1]=`${Math.round(g.x*r)},${Math.round(g.y*r)},${Math.round(g.z*r)}`,f[2]=`${Math.round(h.x*r)},${Math.round(h.y*r)},${Math.round(h.z*r)}`,!(f[0]===f[1]||f[1]===f[2]||f[2]===f[0]))for(let m=0;m<3;m++){const _=(m+1)%3,M=f[m],w=f[_],T=hc[u[m]],R=hc[u[_]],y=`${M}_${w}`,C=`${w}_${M}`;C in d&&d[C]?(Ef.dot(d[C].normal)<=s&&(p.push(T.x,T.y,T.z),p.push(R.x,R.y,R.z)),d[C]=null):y in d||(d[y]={index0:c[m],index1:c[_],normal:Ef.clone()})}}for(const v in d)if(d[v]){const{index0:S,index1:g}=d[v];dc.fromBufferAttribute(a,S),fc.fromBufferAttribute(a,g),p.push(dc.x,dc.y,dc.z),p.push(fc.x,fc.y,fc.z)}this.setAttribute("position",new Gt(p,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}class Lg extends Wo{constructor(e=1,n=0){const i=(1+Math.sqrt(5))/2,r=[-1,i,0,1,i,0,-1,-i,0,1,-i,0,0,-1,i,0,1,i,0,-1,-i,0,1,-i,i,0,-1,i,0,1,-i,0,-1,-i,0,1],s=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(r,s,e,n),this.type="IcosahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Lg(e.radius,e.detail)}}class Ig extends Wo{constructor(e=1,n=0){const i=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],r=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(i,r,e,n),this.type="OctahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Ig(e.radius,e.detail)}}class yl extends Cn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,o=n/2,a=Math.floor(i),l=Math.floor(r),c=a+1,u=l+1,f=e/a,d=n/l,p=[],v=[],S=[],g=[];for(let h=0;h<u;h++){const m=h*d-o;for(let _=0;_<c;_++){const M=_*f-s;v.push(M,-m,0),S.push(0,0,1),g.push(_/a),g.push(1-h/l)}}for(let h=0;h<l;h++)for(let m=0;m<a;m++){const _=m+c*h,M=m+c*(h+1),w=m+1+c*(h+1),T=m+1+c*h;p.push(_,M,T),p.push(M,w,T)}this.setIndex(p),this.setAttribute("position",new Gt(v,3)),this.setAttribute("normal",new Gt(S,3)),this.setAttribute("uv",new Gt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new yl(e.width,e.height,e.widthSegments,e.heightSegments)}}class Ug extends Wo{constructor(e=1,n=0){const i=[1,1,1,-1,-1,1,-1,1,-1,1,-1,-1],r=[2,1,0,0,3,2,1,3,0,2,3,1];super(i,r,e,n),this.type="TetrahedronGeometry",this.parameters={radius:e,detail:n}}static fromJSON(e){return new Ug(e.radius,e.detail)}}class g2 extends Cn{constructor(e=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:e},e!==null){const n=[],i=new Set,r=new L,s=new L;if(e.index!==null){const o=e.attributes.position,a=e.index;let l=e.groups;l.length===0&&(l=[{start:0,count:a.count,materialIndex:0}]);for(let c=0,u=l.length;c<u;++c){const f=l[c],d=f.start,p=f.count;for(let v=d,S=d+p;v<S;v+=3)for(let g=0;g<3;g++){const h=a.getX(v+g),m=a.getX(v+(g+1)%3);r.fromBufferAttribute(o,h),s.fromBufferAttribute(o,m),e_(r,s,i)===!0&&(n.push(r.x,r.y,r.z),n.push(s.x,s.y,s.z))}}}else{const o=e.attributes.position;for(let a=0,l=o.count/3;a<l;a++)for(let c=0;c<3;c++){const u=3*a+c,f=3*a+(c+1)%3;r.fromBufferAttribute(o,u),s.fromBufferAttribute(o,f),e_(r,s,i)===!0&&(n.push(r.x,r.y,r.z),n.push(s.x,s.y,s.z))}}this.setAttribute("position",new Gt(n,3))}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}}function e_(t,e,n){const i=`${t.x},${t.y},${t.z}-${e.x},${e.y},${e.z}`,r=`${e.x},${e.y},${e.z}-${t.x},${t.y},${t.z}`;return n.has(i)===!0||n.has(r)===!0?!1:(n.add(i),n.add(r),!0)}function ko(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];if(t_(r))r.isRenderTargetTexture?(ke("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone();else if(Array.isArray(r))if(t_(r[0])){const s=[];for(let o=0,a=r.length;o<a;o++)s[o]=r[o].clone();e[n][i]=s}else e[n][i]=r.slice();else e[n][i]=r}}return e}function gn(t){const e={};for(let n=0;n<t.length;n++){const i=ko(t[n]);for(const r in i)e[r]=i[r]}return e}function t_(t){return t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)}function v2(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function uE(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const Fg={clone:ko,merge:gn};var x2=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,_2=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mi extends _l{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=x2,this.fragmentShader=_2,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=ko(e.uniforms),this.uniformsGroups=v2(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this.defaultAttributeValues=Object.assign({},e.defaultAttributeValues),this.index0AttributeName=e.index0AttributeName,this.uniformsNeedUpdate=e.uniformsNeedUpdate,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const o=this.uniforms[r].value;o&&o.isTexture?n.uniforms[r]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?n.uniforms[r]={type:"c",value:o.getHex()}:o&&o.isVector2?n.uniforms[r]={type:"v2",value:o.toArray()}:o&&o.isVector3?n.uniforms[r]={type:"v3",value:o.toArray()}:o&&o.isVector4?n.uniforms[r]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?n.uniforms[r]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?n.uniforms[r]={type:"m4",value:o.toArray()}:n.uniforms[r]={value:o}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class y2 extends mi{constructor(e){super(e),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class S2 extends _l{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new ot(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new ot(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Op,this.normalScale=new Qe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Gr,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class M2 extends _l{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=h3,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class E2 extends _l{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class Og extends hn{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new ot(e),this.intensity=n}dispose(){this.dispatchEvent({type:"dispose"})}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,n}}const Tf=new Nt,n_=new L,i_=new L;class dE{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Qe(512,512),this.mapType=Ln,this.map=null,this.mapPass=null,this.matrix=new Nt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Pg,this._frameExtents=new Qe(1,1),this._viewportCount=1,this._viewports=[new gt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;n_.setFromMatrixPosition(e.matrixWorld),n.position.copy(n_),i_.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(i_),n.updateMatrixWorld(),Tf.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Tf,n.coordinateSystem,n.reversedDepth),n.coordinateSystem===ol||n.reversedDepth?i.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Tf)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this.biasNode=e.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}const pc=new L,mc=new Vr,_i=new L;class fE extends hn{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Nt,this.projectionMatrix=new Nt,this.projectionMatrixInverse=new Nt,this.coordinateSystem=Ci,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorld.decompose(pc,mc,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(pc,mc,_i.set(1,1,1)).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorld.decompose(pc,mc,_i),_i.x===1&&_i.y===1&&_i.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(pc,mc,_i.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const gr=new L,r_=new Qe,s_=new Qe;class Yn extends fE{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=al*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(Eo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return al*2*Math.atan(Math.tan(Eo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){gr.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(gr.x,gr.y).multiplyScalar(-e/gr.z),gr.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(gr.x,gr.y).multiplyScalar(-e/gr.z)}getViewSize(e,n){return this.getViewBounds(e,r_,s_),n.subVectors(s_,r_)}setViewOffset(e,n,i,r,s,o){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(Eo*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*r/l,n-=o.offsetY*i/c,r*=o.width/l,i*=o.height/c}const a=this.filmOffset;a!==0&&(s+=e*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}class T2 extends dE{constructor(){super(new Yn(90,1,.5,500)),this.isPointLightShadow=!0}}class o_ extends Og{constructor(e,n,i=0,r=2){super(e,n),this.isPointLight=!0,this.type="PointLight",this.distance=i,this.decay=r,this.shadow=new T2}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(e,n){return super.copy(e,n),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.distance=this.distance,n.object.decay=this.decay,n.object.shadow=this.shadow.toJSON(),n}}class od extends fE{constructor(e=-1,n=1,i=1,r=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,o=i+e,a=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=u*this.view.offsetY,l=a-u*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}class w2 extends dE{constructor(){super(new od(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class b2 extends Og{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(hn.DEFAULT_UP),this.updateMatrix(),this.target=new hn,this.shadow=new w2}dispose(){super.dispose(),this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}toJSON(e){const n=super.toJSON(e);return n.object.shadow=this.shadow.toJSON(),n.object.target=this.target.uuid,n}}class A2 extends Og{constructor(e,n){super(e,n),this.isAmbientLight=!0,this.type="AmbientLight"}}class C2 extends Cn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(e){return super.copy(e),this.instanceCount=e.instanceCount,this}toJSON(){const e=super.toJSON();return e.instanceCount=this.instanceCount,e.isInstancedBufferGeometry=!0,e}}const Ws=-90,Xs=1;class R2 extends hn{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new Yn(Ws,Xs,e,n);r.layers=this.layers,this.add(r);const s=new Yn(Ws,Xs,e,n);s.layers=this.layers,this.add(s);const o=new Yn(Ws,Xs,e,n);o.layers=this.layers,this.add(o);const a=new Yn(Ws,Xs,e,n);a.layers=this.layers,this.add(a);const l=new Yn(Ws,Xs,e,n);l.layers=this.layers,this.add(l);const c=new Yn(Ws,Xs,e,n);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,o,a,l]=n;for(const c of n)this.remove(c);if(e===Ci)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ol)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of n)this.add(c),c.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,u]=this.children,f=e.getRenderTarget(),d=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),v=e.xr.enabled;e.xr.enabled=!1;const S=i.texture.generateMipmaps;i.texture.generateMipmaps=!1;let g=!1;e.isWebGLRenderer===!0?g=e.state.buffers.depth.getReversed():g=e.reversedDepthBuffer,e.setRenderTarget(i,0,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,s),e.setRenderTarget(i,1,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,o),e.setRenderTarget(i,2,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,a),e.setRenderTarget(i,3,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,l),e.setRenderTarget(i,4,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,c),i.texture.generateMipmaps=S,e.setRenderTarget(i,5,r),g&&e.autoClear===!1&&e.clearDepth(),e.render(n,u),e.setRenderTarget(f,d,p),e.xr.enabled=v,i.texture.needsPMREMUpdate=!0}}class P2 extends Yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class zp extends s2{constructor(e,n,i=1){super(e,n),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}clone(e){const n=super.clone(e);return n.meshPerAttribute=this.meshPerAttribute,n}toJSON(e){const n=super.toJSON(e);return n.isInstancedInterleavedBuffer=!0,n.meshPerAttribute=this.meshPerAttribute,n}}class D2{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1,ke("Clock: This module has been deprecated. Please use THREE.Timer instead.")}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){const n=performance.now();e=(n-this.oldTime)/1e3,this.oldTime=n,this.elapsedTime+=e}return e}}const Zg=class Zg{constructor(e,n,i,r){this.elements=[1,0,0,1],e!==void 0&&this.set(e,n,i,r)}identity(){return this.set(1,0,0,1),this}fromArray(e,n=0){for(let i=0;i<4;i++)this.elements[i]=e[i+n];return this}set(e,n,i,r){const s=this.elements;return s[0]=e,s[2]=n,s[1]=i,s[3]=r,this}};Zg.prototype.isMatrix2=!0;let a_=Zg;const l_=new L,gc=new L,$s=new L,Ys=new L,wf=new L,N2=new L,L2=new L;class I2{constructor(e=new L,n=new L){this.start=e,this.end=n}set(e,n){return this.start.copy(e),this.end.copy(n),this}copy(e){return this.start.copy(e.start),this.end.copy(e.end),this}getCenter(e){return e.addVectors(this.start,this.end).multiplyScalar(.5)}delta(e){return e.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(e,n){return this.delta(n).multiplyScalar(e).add(this.start)}closestPointToPointParameter(e,n){l_.subVectors(e,this.start),gc.subVectors(this.end,this.start);const i=gc.dot(gc);if(i===0)return 0;let s=gc.dot(l_)/i;return n&&(s=We(s,0,1)),s}closestPointToPoint(e,n,i){const r=this.closestPointToPointParameter(e,n);return this.delta(i).multiplyScalar(r).add(this.start)}distanceSqToLine3(e,n=N2,i=L2){const r=10000000000000001e-32;let s,o;const a=this.start,l=e.start,c=this.end,u=e.end;$s.subVectors(c,a),Ys.subVectors(u,l),wf.subVectors(a,l);const f=$s.dot($s),d=Ys.dot(Ys),p=Ys.dot(wf);if(f<=r&&d<=r)return n.copy(a),i.copy(l),n.sub(i),n.dot(n);if(f<=r)s=0,o=p/d,o=We(o,0,1);else{const v=$s.dot(wf);if(d<=r)o=0,s=We(-v/f,0,1);else{const S=$s.dot(Ys),g=f*d-S*S;g!==0?s=We((S*p-v*d)/g,0,1):s=0,o=(S*s+p)/d,o<0?(o=0,s=We(-v/f,0,1)):o>1&&(o=1,s=We((S-v)/f,0,1))}}return n.copy(a).addScaledVector($s,s),i.copy(l).addScaledVector(Ys,o),n.distanceToSquared(i)}applyMatrix4(e){return this.start.applyMatrix4(e),this.end.applyMatrix4(e),this}equals(e){return e.start.equals(this.start)&&e.end.equals(this.end)}clone(){return new this.constructor().copy(this)}}function c_(t,e,n,i){const r=U2(i);switch(n){case J1:return t*e;case tE:return t*e/r.components*r.byteLength;case Mg:return t*e/r.components*r.byteLength;case bs:return t*e*2/r.components*r.byteLength;case Eg:return t*e*2/r.components*r.byteLength;case eE:return t*e*3/r.components*r.byteLength;case ui:return t*e*4/r.components*r.byteLength;case Tg:return t*e*4/r.components*r.byteLength;case Gc:case Hc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case jc:case Wc:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case lp:case up:return Math.max(t,16)*Math.max(e,8)/4;case ap:case cp:return Math.max(t,8)*Math.max(e,8)/2;case dp:case fp:case pp:case mp:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case hp:case bu:case gp:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case vp:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case xp:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case _p:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case yp:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Sp:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Mp:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Ep:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Tp:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case wp:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case bp:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case Ap:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Cp:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Rp:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Pp:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case Dp:case Np:case Lp:return Math.ceil(t/4)*Math.ceil(e/4)*16;case Ip:case Up:return Math.ceil(t/4)*Math.ceil(e/4)*8;case Au:case Fp:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function U2(t){switch(t){case Ln:case K1:return{byteLength:1,components:1};case rl:case q1:case rr:return{byteLength:2,components:1};case yg:case Sg:return{byteLength:2,components:4};case Ui:case _g:case Ai:return{byteLength:4,components:1};case Z1:case Q1:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:xg}}));typeof window<"u"&&(window.__THREE__?ke("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=xg);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function hE(){let t=null,e=!1,n=null,i=null;function r(s,o){n(s,o),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&t!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t!==null&&t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function F2(t){const e=new WeakMap;function n(a,l){const c=a.array,u=a.usage,f=c.byteLength,d=t.createBuffer();t.bindBuffer(l,d),t.bufferData(l,c,u),a.onUploadCallback();let p;if(c instanceof Float32Array)p=t.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=t.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?p=t.HALF_FLOAT:p=t.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=t.SHORT;else if(c instanceof Uint32Array)p=t.UNSIGNED_INT;else if(c instanceof Int32Array)p=t.INT;else if(c instanceof Int8Array)p=t.BYTE;else if(c instanceof Uint8Array)p=t.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:d,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:f}}function i(a,l,c){const u=l.array,f=l.updateRanges;if(t.bindBuffer(c,a),f.length===0)t.bufferSubData(c,0,u);else{f.sort((p,v)=>p.start-v.start);let d=0;for(let p=1;p<f.length;p++){const v=f[d],S=f[p];S.start<=v.start+v.count+1?v.count=Math.max(v.count,S.start+S.count-v.start):(++d,f[d]=S)}f.length=d+1;for(let p=0,v=f.length;p<v;p++){const S=f[p];t.bufferSubData(c,S.start*u.BYTES_PER_ELEMENT,u,S.start,S.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(a){return a.isInterleavedBufferAttribute&&(a=a.data),e.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=e.get(a);l&&(t.deleteBuffer(l.buffer),e.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const u=e.get(a);(!u||u.version<a.version)&&e.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=e.get(a);if(c===void 0)e.set(a,n(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(c.buffer,a,l),c.version=a.version}}return{get:r,remove:s,update:o}}var O2=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,k2=`#ifdef USE_ALPHAHASH
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
#endif`,B2=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,z2=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,V2=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,G2=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,H2=`#ifdef USE_AOMAP
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
#endif`,j2=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,W2=`#ifdef USE_BATCHING
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
#endif`,X2=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,$2=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Y2=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,K2=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,q2=`#ifdef USE_IRIDESCENCE
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
#endif`,Z2=`#ifdef USE_BUMPMAP
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
#endif`,Q2=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,J2=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,eD=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tD=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nD=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,iD=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,rD=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,sD=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,oD=`#define PI 3.141592653589793
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
} // validated`,aD=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,lD=`vec3 transformedNormal = objectNormal;
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
#endif`,cD=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,uD=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,dD=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fD=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,hD="gl_FragColor = linearToOutputTexel( gl_FragColor );",pD=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mD=`#ifdef USE_ENVMAP
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
#endif`,gD=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,vD=`#ifdef USE_ENVMAP
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
#endif`,xD=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,_D=`#ifdef USE_ENVMAP
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
#endif`,yD=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,SD=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,MD=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,ED=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,TD=`#ifdef USE_GRADIENTMAP
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
}`,wD=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,bD=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,AD=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,CD=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,RD=`#ifdef USE_ENVMAP
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
#endif`,PD=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,DD=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ND=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,LD=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,ID=`PhysicalMaterial material;
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
#endif`,UD=`uniform sampler2D dfgLUT;
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
}`,FD=`
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
#endif`,OD=`#if defined( RE_IndirectDiffuse )
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
#endif`,kD=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,BD=`#ifdef USE_LIGHT_PROBES_GRID
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
#endif`,zD=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,VD=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,GD=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,HD=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,jD=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,WD=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,XD=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,$D=`#if defined( USE_POINTS_UV )
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
#endif`,YD=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,KD=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,qD=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,ZD=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,QD=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,JD=`#ifdef USE_MORPHTARGETS
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
#endif`,eN=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,tN=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,nN=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,iN=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rN=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,sN=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,oN=`#ifdef USE_NORMALMAP
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
#endif`,aN=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lN=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,cN=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,uN=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,dN=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,fN=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,hN=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pN=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mN=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,gN=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,vN=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,xN=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,_N=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,yN=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,SN=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,MN=`float getShadowMask() {
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
}`,EN=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,TN=`#ifdef USE_SKINNING
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
#endif`,wN=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,bN=`#ifdef USE_SKINNING
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
#endif`,AN=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,CN=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,RN=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,PN=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,DN=`#ifdef USE_TRANSMISSION
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
#endif`,NN=`#ifdef USE_TRANSMISSION
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
#endif`,LN=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,IN=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,UN=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,FN=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ON=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,kN=`uniform sampler2D t2D;
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
}`,BN=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zN=`#ifdef ENVMAP_TYPE_CUBE
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
}`,VN=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,GN=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,HN=`#include <common>
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
}`,jN=`#if DEPTH_PACKING == 3200
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
}`,WN=`#define DISTANCE
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
}`,XN=`#define DISTANCE
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
}`,$N=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,YN=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,KN=`uniform float scale;
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
}`,qN=`uniform vec3 diffuse;
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
}`,ZN=`#include <common>
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
}`,QN=`uniform vec3 diffuse;
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
}`,JN=`#define LAMBERT
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
}`,eL=`#define LAMBERT
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
}`,tL=`#define MATCAP
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
}`,nL=`#define MATCAP
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
}`,iL=`#define NORMAL
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
}`,rL=`#define NORMAL
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
}`,sL=`#define PHONG
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
}`,oL=`#define PHONG
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
}`,aL=`#define STANDARD
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
}`,lL=`#define STANDARD
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
}`,cL=`#define TOON
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
}`,uL=`#define TOON
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
}`,dL=`uniform float size;
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
}`,fL=`uniform vec3 diffuse;
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
}`,hL=`#include <common>
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
}`,pL=`uniform vec3 color;
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
}`,mL=`uniform float rotation;
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
}`,gL=`uniform vec3 diffuse;
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
}`,Ke={alphahash_fragment:O2,alphahash_pars_fragment:k2,alphamap_fragment:B2,alphamap_pars_fragment:z2,alphatest_fragment:V2,alphatest_pars_fragment:G2,aomap_fragment:H2,aomap_pars_fragment:j2,batching_pars_vertex:W2,batching_vertex:X2,begin_vertex:$2,beginnormal_vertex:Y2,bsdfs:K2,iridescence_fragment:q2,bumpmap_pars_fragment:Z2,clipping_planes_fragment:Q2,clipping_planes_pars_fragment:J2,clipping_planes_pars_vertex:eD,clipping_planes_vertex:tD,color_fragment:nD,color_pars_fragment:iD,color_pars_vertex:rD,color_vertex:sD,common:oD,cube_uv_reflection_fragment:aD,defaultnormal_vertex:lD,displacementmap_pars_vertex:cD,displacementmap_vertex:uD,emissivemap_fragment:dD,emissivemap_pars_fragment:fD,colorspace_fragment:hD,colorspace_pars_fragment:pD,envmap_fragment:mD,envmap_common_pars_fragment:gD,envmap_pars_fragment:vD,envmap_pars_vertex:xD,envmap_physical_pars_fragment:RD,envmap_vertex:_D,fog_vertex:yD,fog_pars_vertex:SD,fog_fragment:MD,fog_pars_fragment:ED,gradientmap_pars_fragment:TD,lightmap_pars_fragment:wD,lights_lambert_fragment:bD,lights_lambert_pars_fragment:AD,lights_pars_begin:CD,lights_toon_fragment:PD,lights_toon_pars_fragment:DD,lights_phong_fragment:ND,lights_phong_pars_fragment:LD,lights_physical_fragment:ID,lights_physical_pars_fragment:UD,lights_fragment_begin:FD,lights_fragment_maps:OD,lights_fragment_end:kD,lightprobes_pars_fragment:BD,logdepthbuf_fragment:zD,logdepthbuf_pars_fragment:VD,logdepthbuf_pars_vertex:GD,logdepthbuf_vertex:HD,map_fragment:jD,map_pars_fragment:WD,map_particle_fragment:XD,map_particle_pars_fragment:$D,metalnessmap_fragment:YD,metalnessmap_pars_fragment:KD,morphinstance_vertex:qD,morphcolor_vertex:ZD,morphnormal_vertex:QD,morphtarget_pars_vertex:JD,morphtarget_vertex:eN,normal_fragment_begin:tN,normal_fragment_maps:nN,normal_pars_fragment:iN,normal_pars_vertex:rN,normal_vertex:sN,normalmap_pars_fragment:oN,clearcoat_normal_fragment_begin:aN,clearcoat_normal_fragment_maps:lN,clearcoat_pars_fragment:cN,iridescence_pars_fragment:uN,opaque_fragment:dN,packing:fN,premultiplied_alpha_fragment:hN,project_vertex:pN,dithering_fragment:mN,dithering_pars_fragment:gN,roughnessmap_fragment:vN,roughnessmap_pars_fragment:xN,shadowmap_pars_fragment:_N,shadowmap_pars_vertex:yN,shadowmap_vertex:SN,shadowmask_pars_fragment:MN,skinbase_vertex:EN,skinning_pars_vertex:TN,skinning_vertex:wN,skinnormal_vertex:bN,specularmap_fragment:AN,specularmap_pars_fragment:CN,tonemapping_fragment:RN,tonemapping_pars_fragment:PN,transmission_fragment:DN,transmission_pars_fragment:NN,uv_pars_fragment:LN,uv_pars_vertex:IN,uv_vertex:UN,worldpos_vertex:FN,background_vert:ON,background_frag:kN,backgroundCube_vert:BN,backgroundCube_frag:zN,cube_vert:VN,cube_frag:GN,depth_vert:HN,depth_frag:jN,distance_vert:WN,distance_frag:XN,equirect_vert:$N,equirect_frag:YN,linedashed_vert:KN,linedashed_frag:qN,meshbasic_vert:ZN,meshbasic_frag:QN,meshlambert_vert:JN,meshlambert_frag:eL,meshmatcap_vert:tL,meshmatcap_frag:nL,meshnormal_vert:iL,meshnormal_frag:rL,meshphong_vert:sL,meshphong_frag:oL,meshphysical_vert:aL,meshphysical_frag:lL,meshtoon_vert:cL,meshtoon_frag:uL,points_vert:dL,points_frag:fL,shadow_vert:hL,shadow_frag:pL,sprite_vert:mL,sprite_frag:gL},ge={common:{diffuse:{value:new ot(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Qe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new ot(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new L},probesMax:{value:new L},probesResolution:{value:new L}},points:{diffuse:{value:new ot(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new ot(16777215)},opacity:{value:1},center:{value:new Qe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},Mn={basic:{uniforms:gn([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.fog]),vertexShader:Ke.meshbasic_vert,fragmentShader:Ke.meshbasic_frag},lambert:{uniforms:gn([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new ot(0)},envMapIntensity:{value:1}}]),vertexShader:Ke.meshlambert_vert,fragmentShader:Ke.meshlambert_frag},phong:{uniforms:gn([ge.common,ge.specularmap,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,ge.lights,{emissive:{value:new ot(0)},specular:{value:new ot(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphong_vert,fragmentShader:Ke.meshphong_frag},standard:{uniforms:gn([ge.common,ge.envmap,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.roughnessmap,ge.metalnessmap,ge.fog,ge.lights,{emissive:{value:new ot(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag},toon:{uniforms:gn([ge.common,ge.aomap,ge.lightmap,ge.emissivemap,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.gradientmap,ge.fog,ge.lights,{emissive:{value:new ot(0)}}]),vertexShader:Ke.meshtoon_vert,fragmentShader:Ke.meshtoon_frag},matcap:{uniforms:gn([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,ge.fog,{matcap:{value:null}}]),vertexShader:Ke.meshmatcap_vert,fragmentShader:Ke.meshmatcap_frag},points:{uniforms:gn([ge.points,ge.fog]),vertexShader:Ke.points_vert,fragmentShader:Ke.points_frag},dashed:{uniforms:gn([ge.common,ge.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Ke.linedashed_vert,fragmentShader:Ke.linedashed_frag},depth:{uniforms:gn([ge.common,ge.displacementmap]),vertexShader:Ke.depth_vert,fragmentShader:Ke.depth_frag},normal:{uniforms:gn([ge.common,ge.bumpmap,ge.normalmap,ge.displacementmap,{opacity:{value:1}}]),vertexShader:Ke.meshnormal_vert,fragmentShader:Ke.meshnormal_frag},sprite:{uniforms:gn([ge.sprite,ge.fog]),vertexShader:Ke.sprite_vert,fragmentShader:Ke.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Ke.background_vert,fragmentShader:Ke.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Ke.backgroundCube_vert,fragmentShader:Ke.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Ke.cube_vert,fragmentShader:Ke.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Ke.equirect_vert,fragmentShader:Ke.equirect_frag},distance:{uniforms:gn([ge.common,ge.displacementmap,{referencePosition:{value:new L},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Ke.distance_vert,fragmentShader:Ke.distance_frag},shadow:{uniforms:gn([ge.lights,ge.fog,{color:{value:new ot(0)},opacity:{value:1}}]),vertexShader:Ke.shadow_vert,fragmentShader:Ke.shadow_frag}};Mn.physical={uniforms:gn([Mn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Qe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new ot(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Qe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new ot(0)},specularColor:{value:new ot(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Qe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Ke.meshphysical_vert,fragmentShader:Ke.meshphysical_frag};const vc={r:0,b:0,g:0},vL=new Nt,pE=new Ge;pE.set(-1,0,0,0,1,0,0,0,1);function xL(t,e,n,i,r,s){const o=new ot(0);let a=r===!0?0:1,l,c,u=null,f=0,d=null;function p(m){let _=m.isScene===!0?m.background:null;if(_&&_.isTexture){const M=m.backgroundBlurriness>0;_=e.get(_,M)}return _}function v(m){let _=!1;const M=p(m);M===null?g(o,a):M&&M.isColor&&(g(M,1),_=!0);const w=t.xr.getEnvironmentBlendMode();w==="additive"?n.buffers.color.setClear(0,0,0,1,s):w==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(t.autoClear||_)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function S(m,_){const M=p(_);M&&(M.isCubeTexture||M.mapping===sd)?(c===void 0&&(c=new ei(new jo(1,1,1),new mi({name:"BackgroundCubeMaterial",uniforms:ko(Mn.backgroundCube.uniforms),vertexShader:Mn.backgroundCube.vertexShader,fragmentShader:Mn.backgroundCube.fragmentShader,side:An,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(w,T,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=_.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(vL.makeRotationFromEuler(_.backgroundRotation)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(pE),c.material.toneMapped=Je.getTransfer(M.colorSpace)!==lt,(u!==M||f!==M.version||d!==t.toneMapping)&&(c.material.needsUpdate=!0,u=M,f=M.version,d=t.toneMapping),c.layers.enableAll(),m.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new ei(new yl(2,2),new mi({name:"BackgroundMaterial",uniforms:ko(Mn.background.uniforms),vertexShader:Mn.background.vertexShader,fragmentShader:Mn.background.fragmentShader,side:zr,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=_.backgroundIntensity,l.material.toneMapped=Je.getTransfer(M.colorSpace)!==lt,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||f!==M.version||d!==t.toneMapping)&&(l.material.needsUpdate=!0,u=M,f=M.version,d=t.toneMapping),l.layers.enableAll(),m.unshift(l,l.geometry,l.material,0,0,null))}function g(m,_){m.getRGB(vc,uE(t)),n.buffers.color.setClear(vc.r,vc.g,vc.b,_,s)}function h(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(m,_=1){o.set(m),a=_,g(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(m){a=m,g(o,a)},render:v,addToRenderList:S,dispose:h}}function _L(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=d(null);let s=r,o=!1;function a(P,N,H,V,F){let j=!1;const B=f(P,V,H,N);s!==B&&(s=B,c(s.object)),j=p(P,V,H,F),j&&v(P,V,H,F),F!==null&&e.update(F,t.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,M(P,N,H,V),F!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(F).buffer))}function l(){return t.createVertexArray()}function c(P){return t.bindVertexArray(P)}function u(P){return t.deleteVertexArray(P)}function f(P,N,H,V){const F=V.wireframe===!0;let j=i[N.id];j===void 0&&(j={},i[N.id]=j);const B=P.isInstancedMesh===!0?P.id:0;let I=j[B];I===void 0&&(I={},j[B]=I);let $=I[H.id];$===void 0&&($={},I[H.id]=$);let K=$[F];return K===void 0&&(K=d(l()),$[F]=K),K}function d(P){const N=[],H=[],V=[];for(let F=0;F<n;F++)N[F]=0,H[F]=0,V[F]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:N,enabledAttributes:H,attributeDivisors:V,object:P,attributes:{},index:null}}function p(P,N,H,V){const F=s.attributes,j=N.attributes;let B=0;const I=H.getAttributes();for(const $ in I)if(I[$].location>=0){const ie=F[$];let fe=j[$];if(fe===void 0&&($==="instanceMatrix"&&P.instanceMatrix&&(fe=P.instanceMatrix),$==="instanceColor"&&P.instanceColor&&(fe=P.instanceColor)),ie===void 0||ie.attribute!==fe||fe&&ie.data!==fe.data)return!0;B++}return s.attributesNum!==B||s.index!==V}function v(P,N,H,V){const F={},j=N.attributes;let B=0;const I=H.getAttributes();for(const $ in I)if(I[$].location>=0){let ie=j[$];ie===void 0&&($==="instanceMatrix"&&P.instanceMatrix&&(ie=P.instanceMatrix),$==="instanceColor"&&P.instanceColor&&(ie=P.instanceColor));const fe={};fe.attribute=ie,ie&&ie.data&&(fe.data=ie.data),F[$]=fe,B++}s.attributes=F,s.attributesNum=B,s.index=V}function S(){const P=s.newAttributes;for(let N=0,H=P.length;N<H;N++)P[N]=0}function g(P){h(P,0)}function h(P,N){const H=s.newAttributes,V=s.enabledAttributes,F=s.attributeDivisors;H[P]=1,V[P]===0&&(t.enableVertexAttribArray(P),V[P]=1),F[P]!==N&&(t.vertexAttribDivisor(P,N),F[P]=N)}function m(){const P=s.newAttributes,N=s.enabledAttributes;for(let H=0,V=N.length;H<V;H++)N[H]!==P[H]&&(t.disableVertexAttribArray(H),N[H]=0)}function _(P,N,H,V,F,j,B){B===!0?t.vertexAttribIPointer(P,N,H,F,j):t.vertexAttribPointer(P,N,H,V,F,j)}function M(P,N,H,V){S();const F=V.attributes,j=H.getAttributes(),B=N.defaultAttributeValues;for(const I in j){const $=j[I];if($.location>=0){let K=F[I];if(K===void 0&&(I==="instanceMatrix"&&P.instanceMatrix&&(K=P.instanceMatrix),I==="instanceColor"&&P.instanceColor&&(K=P.instanceColor)),K!==void 0){const ie=K.normalized,fe=K.itemSize,Fe=e.get(K);if(Fe===void 0)continue;const Be=Fe.buffer,Le=Fe.type,Q=Fe.bytesPerElement,le=Le===t.INT||Le===t.UNSIGNED_INT||K.gpuType===_g;if(K.isInterleavedBufferAttribute){const ce=K.data,Ae=ce.stride,Ie=K.offset;if(ce.isInstancedInterleavedBuffer){for(let Re=0;Re<$.locationSize;Re++)h($.location+Re,ce.meshPerAttribute);P.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let Re=0;Re<$.locationSize;Re++)g($.location+Re);t.bindBuffer(t.ARRAY_BUFFER,Be);for(let Re=0;Re<$.locationSize;Re++)_($.location+Re,fe/$.locationSize,Le,ie,Ae*Q,(Ie+fe/$.locationSize*Re)*Q,le)}else{if(K.isInstancedBufferAttribute){for(let ce=0;ce<$.locationSize;ce++)h($.location+ce,K.meshPerAttribute);P.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let ce=0;ce<$.locationSize;ce++)g($.location+ce);t.bindBuffer(t.ARRAY_BUFFER,Be);for(let ce=0;ce<$.locationSize;ce++)_($.location+ce,fe/$.locationSize,Le,ie,fe*Q,fe/$.locationSize*ce*Q,le)}}else if(B!==void 0){const ie=B[I];if(ie!==void 0)switch(ie.length){case 2:t.vertexAttrib2fv($.location,ie);break;case 3:t.vertexAttrib3fv($.location,ie);break;case 4:t.vertexAttrib4fv($.location,ie);break;default:t.vertexAttrib1fv($.location,ie)}}}}m()}function w(){C();for(const P in i){const N=i[P];for(const H in N){const V=N[H];for(const F in V){const j=V[F];for(const B in j)u(j[B].object),delete j[B];delete V[F]}}delete i[P]}}function T(P){if(i[P.id]===void 0)return;const N=i[P.id];for(const H in N){const V=N[H];for(const F in V){const j=V[F];for(const B in j)u(j[B].object),delete j[B];delete V[F]}}delete i[P.id]}function R(P){for(const N in i){const H=i[N];for(const V in H){const F=H[V];if(F[P.id]===void 0)continue;const j=F[P.id];for(const B in j)u(j[B].object),delete j[B];delete F[P.id]}}}function y(P){for(const N in i){const H=i[N],V=P.isInstancedMesh===!0?P.id:0,F=H[V];if(F!==void 0){for(const j in F){const B=F[j];for(const I in B)u(B[I].object),delete B[I];delete F[j]}delete H[V],Object.keys(H).length===0&&delete i[N]}}}function C(){D(),o=!0,s!==r&&(s=r,c(s.object))}function D(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:a,reset:C,resetDefaultState:D,dispose:w,releaseStatesOfGeometry:T,releaseStatesOfObject:y,releaseStatesOfProgram:R,initAttributes:S,enableAttribute:g,disableUnusedAttributes:m}}function yL(t,e,n){let i;function r(l){i=l}function s(l,c){t.drawArrays(i,l,c),n.update(c,i,1)}function o(l,c,u){u!==0&&(t.drawArraysInstanced(i,l,c,u),n.update(c,i,u))}function a(l,c,u){if(u===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,l,0,c,0,u);let d=0;for(let p=0;p<u;p++)d+=c[p];n.update(d,i,1)}this.setMode=r,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function SL(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function o(R){return!(R!==ui&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const y=R===rr&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==Ln&&i.convert(R)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==Ai&&!y)}function l(R){if(R==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=n.precision!==void 0?n.precision:"highp";const u=l(c);u!==c&&(ke("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=n.logarithmicDepthBuffer===!0,d=n.reversedDepthBuffer===!0&&e.has("EXT_clip_control");n.reversedDepthBuffer===!0&&d===!1&&ke("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const p=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),v=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),S=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),h=t.getParameter(t.MAX_VERTEX_ATTRIBS),m=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),_=t.getParameter(t.MAX_VARYING_VECTORS),M=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),w=t.getParameter(t.MAX_SAMPLES),T=t.getParameter(t.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:f,reversedDepthBuffer:d,maxTextures:p,maxVertexTextures:v,maxTextureSize:S,maxCubemapSize:g,maxAttributes:h,maxVertexUniforms:m,maxVaryings:_,maxFragmentUniforms:M,maxSamples:w,samples:T}}function ML(t){const e=this;let n=null,i=0,r=!1,s=!1;const o=new rs,a=new Ge,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,d){const p=f.length!==0||d||i!==0||r;return r=d,i=f.length,p},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,d){n=u(f,d,0)},this.setState=function(f,d,p){const v=f.clippingPlanes,S=f.clipIntersection,g=f.clipShadows,h=t.get(f);if(!r||v===null||v.length===0||s&&!g)s?u(null):c();else{const m=s?0:i,_=m*4;let M=h.clippingState||null;l.value=M,M=u(v,d,_,p);for(let w=0;w!==_;++w)M[w]=n[w];h.clippingState=M,this.numIntersection=S?this.numPlanes:0,this.numPlanes+=m}};function c(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,d,p,v){const S=f!==null?f.length:0;let g=null;if(S!==0){if(g=l.value,v!==!0||g===null){const h=p+S*4,m=d.matrixWorldInverse;a.getNormalMatrix(m),(g===null||g.length<h)&&(g=new Float32Array(h));for(let _=0,M=p;_!==S;++_,M+=4)o.copy(f[_]).applyMatrix4(m,a),o.normal.toArray(g,M),g[M+3]=o.constant}l.value=g,l.needsUpdate=!0}return e.numPlanes=S,e.numIntersection=0,g}}const br=4,u_=[.125,.215,.35,.446,.526,.582],os=20,EL=256,oa=new od,d_=new ot;let bf=null,Af=0,Cf=0,Rf=!1;const TL=new L;class f_{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,n=0,i=.1,r=100,s={}){const{size:o=256,position:a=TL}=s;bf=this._renderer.getRenderTarget(),Af=this._renderer.getActiveCubeFace(),Cf=this._renderer.getActiveMipmapLevel(),Rf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,i,r,l,a),n>0&&this._blur(l,0,0,n),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=m_(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=p_(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(bf,Af,Cf),this._renderer.xr.enabled=Rf,e.scissorTest=!1,Ks(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===ws||e.mapping===Fo?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),bf=this._renderer.getRenderTarget(),Af=this._renderer.getActiveCubeFace(),Cf=this._renderer.getActiveMipmapLevel(),Rf=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:dn,minFilter:dn,generateMipmaps:!1,type:rr,format:ui,colorSpace:Cu,depthBuffer:!1},r=h_(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=h_(e,n,i);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=wL(s)),this._blurMaterial=AL(s,e,n),this._ggxMaterial=bL(s,e,n)}return r}_compileMaterial(e){const n=new ei(new Cn,e);this._renderer.compile(n,oa)}_sceneToCubeUV(e,n,i,r,s){const l=new Yn(90,1,n,i),c=[1,-1,1,1,1,1],u=[1,1,1,-1,-1,-1],f=this._renderer,d=f.autoClear,p=f.toneMapping;f.getClearColor(d_),f.toneMapping=Li,f.autoClear=!1,f.state.buffers.depth.getReversed()&&(f.setRenderTarget(r),f.clearDepth(),f.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new ei(new jo,new Rg({name:"PMREM.Background",side:An,depthWrite:!1,depthTest:!1})));const S=this._backgroundBox,g=S.material;let h=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,h=!0):(g.color.copy(d_),h=!0);for(let _=0;_<6;_++){const M=_%3;M===0?(l.up.set(0,c[_],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+u[_],s.y,s.z)):M===1?(l.up.set(0,0,c[_]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+u[_],s.z)):(l.up.set(0,c[_],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+u[_]));const w=this._cubeSize;Ks(r,M*w,_>2?w:0,w,w),f.setRenderTarget(r),h&&f.render(S,l),f.render(e,l)}f.toneMapping=p,f.autoClear=d,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===ws||e.mapping===Fo;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=m_()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=p_());const s=r?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=e;const l=this._cubeSize;Ks(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(o,oa)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodMeshes.length;for(let s=1;s<r;s++)this._applyGGXFilter(e,s-1,s);n.autoClear=i}_applyGGXFilter(e,n,i){const r=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[i];a.material=o;const l=o.uniforms,c=i/(this._lodMeshes.length-1),u=n/(this._lodMeshes.length-1),f=Math.sqrt(c*c-u*u),d=0+c*1.25,p=f*d,{_lodMax:v}=this,S=this._sizeLods[i],g=3*S*(i>v-br?i-v+br:0),h=4*(this._cubeSize-S);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=v-n,Ks(s,g,h,3*S,2*S),r.setRenderTarget(s),r.render(a,oa),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=v-i,Ks(e,g,h,3*S,2*S),r.setRenderTarget(e),r.render(a,oa)}_blur(e,n,i,r,s){const o=this._pingPongRenderTarget;this._halfBlur(e,o,n,i,r,"latitudinal",s),this._halfBlur(o,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&it("blur direction must be either latitudinal or longitudinal!");const u=3,f=this._lodMeshes[r];f.material=c;const d=c.uniforms,p=this._sizeLods[i]-1,v=isFinite(s)?Math.PI/(2*p):2*Math.PI/(2*os-1),S=s/v,g=isFinite(s)?1+Math.floor(u*S):os;g>os&&ke(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${os}`);const h=[];let m=0;for(let R=0;R<os;++R){const y=R/S,C=Math.exp(-y*y/2);h.push(C),R===0?m+=C:R<g&&(m+=2*C)}for(let R=0;R<h.length;R++)h[R]=h[R]/m;d.envMap.value=e.texture,d.samples.value=g,d.weights.value=h,d.latitudinal.value=o==="latitudinal",a&&(d.poleAxis.value=a);const{_lodMax:_}=this;d.dTheta.value=v,d.mipInt.value=_-i;const M=this._sizeLods[r],w=3*M*(r>_-br?r-_+br:0),T=4*(this._cubeSize-M);Ks(n,w,T,3*M,2*M),l.setRenderTarget(n),l.render(f,oa)}}function wL(t){const e=[],n=[],i=[];let r=t;const s=t-br+1+u_.length;for(let o=0;o<s;o++){const a=Math.pow(2,r);e.push(a);let l=1/a;o>t-br?l=u_[o-t+br-1]:o===0&&(l=0),n.push(l);const c=1/(a-2),u=-c,f=1+c,d=[u,u,f,u,f,f,u,u,f,f,u,f],p=6,v=6,S=3,g=2,h=1,m=new Float32Array(S*v*p),_=new Float32Array(g*v*p),M=new Float32Array(h*v*p);for(let T=0;T<p;T++){const R=T%3*2/3-1,y=T>2?0:-1,C=[R,y,0,R+2/3,y,0,R+2/3,y+1,0,R,y,0,R+2/3,y+1,0,R,y+1,0];m.set(C,S*v*T),_.set(d,g*v*T);const D=[T,T,T,T,T,T];M.set(D,h*v*T)}const w=new Cn;w.setAttribute("position",new hi(m,S)),w.setAttribute("uv",new hi(_,g)),w.setAttribute("faceIndex",new hi(M,h)),i.push(new ei(w,null)),r>br&&r--}return{lodMeshes:i,sizeLods:e,sigmas:n}}function h_(t,e,n){const i=new Ii(t,e,n);return i.texture.mapping=sd,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ks(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function bL(t,e,n){return new mi({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:EL,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:ad(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function AL(t,e,n){const i=new Float32Array(os),r=new L(0,1,0);return new mi({name:"SphericalGaussianBlur",defines:{n:os,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ad(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function p_(){return new mi({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ad(),fragmentShader:`

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
		`,blending:qi,depthTest:!1,depthWrite:!1})}function m_(){return new mi({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ad(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:qi,depthTest:!1,depthWrite:!1})}function ad(){return`

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
	`}class mE extends Ii{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new lE(r),this._setTextureOptions(n),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new jo(5,5,5),s=new mi({name:"CubemapFromEquirect",uniforms:ko(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:An,blending:qi});s.uniforms.tEquirect.value=n;const o=new ei(r,s),a=n.minFilter;return n.minFilter===hs&&(n.minFilter=dn),new R2(1,10,this).update(e,o),n.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(e,n=!0,i=!0,r=!0){const s=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(n,i,r);e.setRenderTarget(s)}}function CL(t){let e=new WeakMap,n=new WeakMap,i=null;function r(d,p=!1){return d==null?null:p?o(d):s(d)}function s(d){if(d&&d.isTexture){const p=d.mapping;if(p===Zd||p===Qd)if(e.has(d)){const v=e.get(d).texture;return a(v,d.mapping)}else{const v=d.image;if(v&&v.height>0){const S=new mE(v.height);return S.fromEquirectangularTexture(t,d),e.set(d,S),d.addEventListener("dispose",c),a(S.texture,d.mapping)}else return null}}return d}function o(d){if(d&&d.isTexture){const p=d.mapping,v=p===Zd||p===Qd,S=p===ws||p===Fo;if(v||S){let g=n.get(d);const h=g!==void 0?g.texture.pmremVersion:0;if(d.isRenderTargetTexture&&d.pmremVersion!==h)return i===null&&(i=new f_(t)),g=v?i.fromEquirectangular(d,g):i.fromCubemap(d,g),g.texture.pmremVersion=d.pmremVersion,n.set(d,g),g.texture;if(g!==void 0)return g.texture;{const m=d.image;return v&&m&&m.height>0||S&&m&&l(m)?(i===null&&(i=new f_(t)),g=v?i.fromEquirectangular(d):i.fromCubemap(d),g.texture.pmremVersion=d.pmremVersion,n.set(d,g),d.addEventListener("dispose",u),g.texture):null}}}return d}function a(d,p){return p===Zd?d.mapping=ws:p===Qd&&(d.mapping=Fo),d}function l(d){let p=0;const v=6;for(let S=0;S<v;S++)d[S]!==void 0&&p++;return p===v}function c(d){const p=d.target;p.removeEventListener("dispose",c);const v=e.get(p);v!==void 0&&(e.delete(p),v.dispose())}function u(d){const p=d.target;p.removeEventListener("dispose",u);const v=n.get(p);v!==void 0&&(n.delete(p),v.dispose())}function f(){e=new WeakMap,n=new WeakMap,i!==null&&(i.dispose(),i=null)}return{get:r,dispose:f}}function RL(t){const e={};function n(i){if(e[i]!==void 0)return e[i];const r=t.getExtension(i);return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&Bp("WebGLRenderer: "+i+" extension not supported."),r}}}function PL(t,e,n,i){const r={},s=new WeakMap;function o(f){const d=f.target;d.index!==null&&e.remove(d.index);for(const v in d.attributes)e.remove(d.attributes[v]);d.removeEventListener("dispose",o),delete r[d.id];const p=s.get(d);p&&(e.remove(p),s.delete(d)),i.releaseStatesOfGeometry(d),d.isInstancedBufferGeometry===!0&&delete d._maxInstanceCount,n.memory.geometries--}function a(f,d){return r[d.id]===!0||(d.addEventListener("dispose",o),r[d.id]=!0,n.memory.geometries++),d}function l(f){const d=f.attributes;for(const p in d)e.update(d[p],t.ARRAY_BUFFER)}function c(f){const d=[],p=f.index,v=f.attributes.position;let S=0;if(v===void 0)return;if(p!==null){const m=p.array;S=p.version;for(let _=0,M=m.length;_<M;_+=3){const w=m[_+0],T=m[_+1],R=m[_+2];d.push(w,T,T,R,R,w)}}else{const m=v.array;S=v.version;for(let _=0,M=m.length/3-1;_<M;_+=3){const w=_+0,T=_+1,R=_+2;d.push(w,T,T,R,R,w)}}const g=new(v.count>=65535?aE:oE)(d,1);g.version=S;const h=s.get(f);h&&e.remove(h),s.set(f,g)}function u(f){const d=s.get(f);if(d){const p=f.index;p!==null&&d.version<p.version&&c(f)}else c(f);return s.get(f)}return{get:a,update:l,getWireframeAttribute:u}}function DL(t,e,n){let i;function r(f){i=f}let s,o;function a(f){s=f.type,o=f.bytesPerElement}function l(f,d){t.drawElements(i,d,s,f*o),n.update(d,i,1)}function c(f,d,p){p!==0&&(t.drawElementsInstanced(i,d,s,f*o,p),n.update(d,i,p))}function u(f,d,p){if(p===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,d,0,s,f,0,p);let S=0;for(let g=0;g<p;g++)S+=d[g];n.update(S,i,1)}this.setMode=r,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function NL(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,o,a){switch(n.calls++,o){case t.TRIANGLES:n.triangles+=a*(s/3);break;case t.LINES:n.lines+=a*(s/2);break;case t.LINE_STRIP:n.lines+=a*(s-1);break;case t.LINE_LOOP:n.lines+=a*s;break;case t.POINTS:n.points+=a*s;break;default:it("WebGLInfo: Unknown draw mode:",o);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function LL(t,e,n){const i=new WeakMap,r=new gt;function s(o,a,l){const c=o.morphTargetInfluences,u=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,f=u!==void 0?u.length:0;let d=i.get(a);if(d===void 0||d.count!==f){let D=function(){y.dispose(),i.delete(a),a.removeEventListener("dispose",D)};var p=D;d!==void 0&&d.texture.dispose();const v=a.morphAttributes.position!==void 0,S=a.morphAttributes.normal!==void 0,g=a.morphAttributes.color!==void 0,h=a.morphAttributes.position||[],m=a.morphAttributes.normal||[],_=a.morphAttributes.color||[];let M=0;v===!0&&(M=1),S===!0&&(M=2),g===!0&&(M=3);let w=a.attributes.position.count*M,T=1;w>e.maxTextureSize&&(T=Math.ceil(w/e.maxTextureSize),w=e.maxTextureSize);const R=new Float32Array(w*T*4*f),y=new iE(R,w,T,f);y.type=Ai,y.needsUpdate=!0;const C=M*4;for(let P=0;P<f;P++){const N=h[P],H=m[P],V=_[P],F=w*T*4*P;for(let j=0;j<N.count;j++){const B=j*C;v===!0&&(r.fromBufferAttribute(N,j),R[F+B+0]=r.x,R[F+B+1]=r.y,R[F+B+2]=r.z,R[F+B+3]=0),S===!0&&(r.fromBufferAttribute(H,j),R[F+B+4]=r.x,R[F+B+5]=r.y,R[F+B+6]=r.z,R[F+B+7]=0),g===!0&&(r.fromBufferAttribute(V,j),R[F+B+8]=r.x,R[F+B+9]=r.y,R[F+B+10]=r.z,R[F+B+11]=V.itemSize===4?r.w:1)}}d={count:f,texture:y,size:new Qe(w,T)},i.set(a,d),a.addEventListener("dispose",D)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",o.morphTexture,n);else{let v=0;for(let g=0;g<c.length;g++)v+=c[g];const S=a.morphTargetsRelative?1:1-v;l.getUniforms().setValue(t,"morphTargetBaseInfluence",S),l.getUniforms().setValue(t,"morphTargetInfluences",c)}l.getUniforms().setValue(t,"morphTargetsTexture",d.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",d.size)}return{update:s}}function IL(t,e,n,i,r){let s=new WeakMap;function o(c){const u=r.render.frame,f=c.geometry,d=e.get(c,f);if(s.get(d)!==u&&(e.update(d),s.set(d,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==u&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),s.set(c,u))),c.isSkinnedMesh){const p=c.skeleton;s.get(p)!==u&&(p.update(),s.set(p,u))}return d}function a(){s=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),i.releaseStatesOfObject(u),n.remove(u.instanceMatrix),u.instanceColor!==null&&n.remove(u.instanceColor)}return{update:o,dispose:a}}const UL={[V1]:"LINEAR_TONE_MAPPING",[G1]:"REINHARD_TONE_MAPPING",[H1]:"CINEON_TONE_MAPPING",[j1]:"ACES_FILMIC_TONE_MAPPING",[X1]:"AGX_TONE_MAPPING",[$1]:"NEUTRAL_TONE_MAPPING",[W1]:"CUSTOM_TONE_MAPPING"};function FL(t,e,n,i,r){const s=new Ii(e,n,{type:t,depthBuffer:i,stencilBuffer:r,depthTexture:i?new Oo(e,n):void 0}),o=new Ii(e,n,{type:rr,depthBuffer:!1,stencilBuffer:!1}),a=new Cn;a.setAttribute("position",new Gt([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new Gt([0,2,0,0,2,0],2));const l=new y2({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),c=new ei(a,l),u=new od(-1,1,1,-1,0,1);let f=null,d=null,p=!1,v,S=null,g=[],h=!1;this.setSize=function(m,_){s.setSize(m,_),o.setSize(m,_);for(let M=0;M<g.length;M++){const w=g[M];w.setSize&&w.setSize(m,_)}},this.setEffects=function(m){g=m,h=g.length>0&&g[0].isRenderPass===!0;const _=s.width,M=s.height;for(let w=0;w<g.length;w++){const T=g[w];T.setSize&&T.setSize(_,M)}},this.begin=function(m,_){if(p||m.toneMapping===Li&&g.length===0)return!1;if(S=_,_!==null){const M=_.width,w=_.height;(s.width!==M||s.height!==w)&&this.setSize(M,w)}return h===!1&&m.setRenderTarget(s),v=m.toneMapping,m.toneMapping=Li,!0},this.hasRenderPass=function(){return h},this.end=function(m,_){m.toneMapping=v,p=!0;let M=s,w=o;for(let T=0;T<g.length;T++){const R=g[T];if(R.enabled!==!1&&(R.render(m,w,M,_),R.needsSwap!==!1)){const y=M;M=w,w=y}}if(f!==m.outputColorSpace||d!==m.toneMapping){f=m.outputColorSpace,d=m.toneMapping,l.defines={},Je.getTransfer(f)===lt&&(l.defines.SRGB_TRANSFER="");const T=UL[d];T&&(l.defines[T]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=M.texture,m.setRenderTarget(S),m.render(c,u),S=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),o.dispose(),a.dispose(),l.dispose()}}const gE=new fn,Vp=new Oo(1,1),vE=new iE,xE=new $3,_E=new lE,g_=[],v_=[],x_=new Float32Array(16),__=new Float32Array(9),y_=new Float32Array(4);function Xo(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=g_[r];if(s===void 0&&(s=new Float32Array(r),g_[r]=s),e!==0){i.toArray(s,0);for(let o=1,a=0;o!==e;++o)a+=n,t[o].toArray(s,a)}return s}function Ht(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function jt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function ld(t,e){let n=v_[e];n===void 0&&(n=new Int32Array(e),v_[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function OL(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function kL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ht(n,e))return;t.uniform2fv(this.addr,e),jt(n,e)}}function BL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Ht(n,e))return;t.uniform3fv(this.addr,e),jt(n,e)}}function zL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ht(n,e))return;t.uniform4fv(this.addr,e),jt(n,e)}}function VL(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ht(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),jt(n,e)}else{if(Ht(n,i))return;y_.set(i),t.uniformMatrix2fv(this.addr,!1,y_),jt(n,i)}}function GL(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ht(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),jt(n,e)}else{if(Ht(n,i))return;__.set(i),t.uniformMatrix3fv(this.addr,!1,__),jt(n,i)}}function HL(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Ht(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),jt(n,e)}else{if(Ht(n,i))return;x_.set(i),t.uniformMatrix4fv(this.addr,!1,x_),jt(n,i)}}function jL(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function WL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ht(n,e))return;t.uniform2iv(this.addr,e),jt(n,e)}}function XL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ht(n,e))return;t.uniform3iv(this.addr,e),jt(n,e)}}function $L(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ht(n,e))return;t.uniform4iv(this.addr,e),jt(n,e)}}function YL(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function KL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Ht(n,e))return;t.uniform2uiv(this.addr,e),jt(n,e)}}function qL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Ht(n,e))return;t.uniform3uiv(this.addr,e),jt(n,e)}}function ZL(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Ht(n,e))return;t.uniform4uiv(this.addr,e),jt(n,e)}}function QL(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(Vp.compareFunction=n.isReversedDepthBuffer()?bg:wg,s=Vp):s=gE,n.setTexture2D(e||s,r)}function JL(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||xE,r)}function eI(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||_E,r)}function tI(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||vE,r)}function nI(t){switch(t){case 5126:return OL;case 35664:return kL;case 35665:return BL;case 35666:return zL;case 35674:return VL;case 35675:return GL;case 35676:return HL;case 5124:case 35670:return jL;case 35667:case 35671:return WL;case 35668:case 35672:return XL;case 35669:case 35673:return $L;case 5125:return YL;case 36294:return KL;case 36295:return qL;case 36296:return ZL;case 35678:case 36198:case 36298:case 36306:case 35682:return QL;case 35679:case 36299:case 36307:return JL;case 35680:case 36300:case 36308:case 36293:return eI;case 36289:case 36303:case 36311:case 36292:return tI}}function iI(t,e){t.uniform1fv(this.addr,e)}function rI(t,e){const n=Xo(e,this.size,2);t.uniform2fv(this.addr,n)}function sI(t,e){const n=Xo(e,this.size,3);t.uniform3fv(this.addr,n)}function oI(t,e){const n=Xo(e,this.size,4);t.uniform4fv(this.addr,n)}function aI(t,e){const n=Xo(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function lI(t,e){const n=Xo(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function cI(t,e){const n=Xo(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function uI(t,e){t.uniform1iv(this.addr,e)}function dI(t,e){t.uniform2iv(this.addr,e)}function fI(t,e){t.uniform3iv(this.addr,e)}function hI(t,e){t.uniform4iv(this.addr,e)}function pI(t,e){t.uniform1uiv(this.addr,e)}function mI(t,e){t.uniform2uiv(this.addr,e)}function gI(t,e){t.uniform3uiv(this.addr,e)}function vI(t,e){t.uniform4uiv(this.addr,e)}function xI(t,e,n){const i=this.cache,r=e.length,s=ld(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));let o;this.type===t.SAMPLER_2D_SHADOW?o=Vp:o=gE;for(let a=0;a!==r;++a)n.setTexture2D(e[a]||o,s[a])}function _I(t,e,n){const i=this.cache,r=e.length,s=ld(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));for(let o=0;o!==r;++o)n.setTexture3D(e[o]||xE,s[o])}function yI(t,e,n){const i=this.cache,r=e.length,s=ld(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));for(let o=0;o!==r;++o)n.setTextureCube(e[o]||_E,s[o])}function SI(t,e,n){const i=this.cache,r=e.length,s=ld(n,r);Ht(i,s)||(t.uniform1iv(this.addr,s),jt(i,s));for(let o=0;o!==r;++o)n.setTexture2DArray(e[o]||vE,s[o])}function MI(t){switch(t){case 5126:return iI;case 35664:return rI;case 35665:return sI;case 35666:return oI;case 35674:return aI;case 35675:return lI;case 35676:return cI;case 5124:case 35670:return uI;case 35667:case 35671:return dI;case 35668:case 35672:return fI;case 35669:case 35673:return hI;case 5125:return pI;case 36294:return mI;case 36295:return gI;case 36296:return vI;case 35678:case 36198:case 36298:case 36306:case 35682:return xI;case 35679:case 36299:case 36307:return _I;case 35680:case 36300:case 36308:case 36293:return yI;case 36289:case 36303:case 36311:case 36292:return SI}}class EI{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=nI(n.type)}}class TI{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=MI(n.type)}}class wI{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,o=r.length;s!==o;++s){const a=r[s];a.setValue(e,n[a.id],i)}}}const Pf=/(\w+)(\])?(\[|\.)?/g;function S_(t,e){t.seq.push(e),t.map[e.id]=e}function bI(t,e,n){const i=t.name,r=i.length;for(Pf.lastIndex=0;;){const s=Pf.exec(i),o=Pf.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===r){S_(n,c===void 0?new EI(a,t,e):new TI(a,t,e));break}else{let f=n.map[a];f===void 0&&(f=new wI(a),S_(n,f)),n=f}}}class Xc{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let o=0;o<i;++o){const a=e.getActiveUniform(n,o),l=e.getUniformLocation(n,a.name);bI(a,l,this)}const r=[],s=[];for(const o of this.seq)o.type===e.SAMPLER_2D_SHADOW||o.type===e.SAMPLER_CUBE_SHADOW||o.type===e.SAMPLER_2D_ARRAY_SHADOW?r.push(o):s.push(o);r.length>0&&(this.seq=r.concat(s))}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,o=n.length;s!==o;++s){const a=n[s],l=i[a.id];l.needsUpdate!==!1&&a.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const o=e[r];o.id in n&&i.push(o)}return i}}function M_(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const AI=37297;let CI=0;function RI(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let o=r;o<s;o++){const a=o+1;i.push(`${a===e?">":" "} ${a}: ${n[o]}`)}return i.join(`
`)}const E_=new Ge;function PI(t){Je._getMatrix(E_,Je.workingColorSpace,t);const e=`mat3( ${E_.elements.map(n=>n.toFixed(4))} )`;switch(Je.getTransfer(t)){case Ru:return[e,"LinearTransferOETF"];case lt:return[e,"sRGBTransferOETF"];default:return ke("WebGLProgram: Unsupported color space: ",t),[e,"LinearTransferOETF"]}}function T_(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),s=(t.getShaderInfoLog(e)||"").trim();if(i&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return n.toUpperCase()+`

`+s+`

`+RI(t.getShaderSource(e),a)}else return s}function DI(t,e){const n=PI(e);return[`vec4 ${t}( vec4 value ) {`,`	return ${n[1]}( vec4( value.rgb * ${n[0]}, value.a ) );`,"}"].join(`
`)}const NI={[V1]:"Linear",[G1]:"Reinhard",[H1]:"Cineon",[j1]:"ACESFilmic",[X1]:"AgX",[$1]:"Neutral",[W1]:"Custom"};function LI(t,e){const n=NI[e];return n===void 0?(ke("WebGLProgram: Unsupported toneMapping:",e),"vec3 "+t+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const xc=new L;function II(){Je.getLuminanceCoefficients(xc);const t=xc.x.toFixed(4),e=xc.y.toFixed(4),n=xc.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function UI(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xa).join(`
`)}function FI(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function OI(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),o=s.name;let a=1;s.type===t.FLOAT_MAT2&&(a=2),s.type===t.FLOAT_MAT3&&(a=3),s.type===t.FLOAT_MAT4&&(a=4),n[o]={type:s.type,location:t.getAttribLocation(e,o),locationSize:a}}return n}function xa(t){return t!==""}function w_(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function b_(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const kI=/^[ \t]*#include +<([\w\d./]+)>/gm;function Gp(t){return t.replace(kI,zI)}const BI=new Map;function zI(t,e){let n=Ke[e];if(n===void 0){const i=BI.get(e);if(i!==void 0)n=Ke[i],ke('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return Gp(n)}const VI=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function A_(t){return t.replace(VI,GI)}function GI(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function C_(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}const HI={[Vc]:"SHADOWMAP_TYPE_PCF",[ga]:"SHADOWMAP_TYPE_VSM"};function jI(t){return HI[t.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const WI={[ws]:"ENVMAP_TYPE_CUBE",[Fo]:"ENVMAP_TYPE_CUBE",[sd]:"ENVMAP_TYPE_CUBE_UV"};function XI(t){return t.envMap===!1?"ENVMAP_TYPE_CUBE":WI[t.envMapMode]||"ENVMAP_TYPE_CUBE"}const $I={[Fo]:"ENVMAP_MODE_REFRACTION"};function YI(t){return t.envMap===!1?"ENVMAP_MODE_REFLECTION":$I[t.envMapMode]||"ENVMAP_MODE_REFLECTION"}const KI={[z1]:"ENVMAP_BLENDING_MULTIPLY",[u3]:"ENVMAP_BLENDING_MIX",[d3]:"ENVMAP_BLENDING_ADD"};function qI(t){return t.envMap===!1?"ENVMAP_BLENDING_NONE":KI[t.combine]||"ENVMAP_BLENDING_NONE"}function ZI(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function QI(t,e,n,i){const r=t.getContext(),s=n.defines;let o=n.vertexShader,a=n.fragmentShader;const l=jI(n),c=XI(n),u=YI(n),f=qI(n),d=ZI(n),p=UI(n),v=FI(s),S=r.createProgram();let g,h,m=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(xa).join(`
`),g.length>0&&(g+=`
`),h=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v].filter(xa).join(`
`),h.length>0&&(h+=`
`)):(g=[C_(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexNormals?"#define HAS_NORMAL":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xa).join(`
`),h=[C_(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,v,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+c:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",d?"#define CUBEUV_TEXEL_WIDTH "+d.texelWidth:"",d?"#define CUBEUV_TEXEL_HEIGHT "+d.texelHeight:"",d?"#define CUBEUV_MAX_MIP "+d.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor?"#define USE_COLOR":"",n.vertexAlphas||n.batchingColor?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",n.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",n.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==Li?"#define TONE_MAPPING":"",n.toneMapping!==Li?Ke.tonemapping_pars_fragment:"",n.toneMapping!==Li?LI("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Ke.colorspace_pars_fragment,DI("linearToOutputTexel",n.outputColorSpace),II(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(xa).join(`
`)),o=Gp(o),o=w_(o,n),o=b_(o,n),a=Gp(a),a=w_(a,n),a=b_(a,n),o=A_(o),a=A_(a),n.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,g=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,h=["#define varying in",n.glslVersion===Ox?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Ox?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+h);const _=m+g+o,M=m+h+a,w=M_(r,r.VERTEX_SHADER,_),T=M_(r,r.FRAGMENT_SHADER,M);r.attachShader(S,w),r.attachShader(S,T),n.index0AttributeName!==void 0?r.bindAttribLocation(S,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(S,0,"position"),r.linkProgram(S);function R(P){if(t.debug.checkShaderErrors){const N=r.getProgramInfoLog(S)||"",H=r.getShaderInfoLog(w)||"",V=r.getShaderInfoLog(T)||"",F=N.trim(),j=H.trim(),B=V.trim();let I=!0,$=!0;if(r.getProgramParameter(S,r.LINK_STATUS)===!1)if(I=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,S,w,T);else{const K=T_(r,w,"vertex"),ie=T_(r,T,"fragment");it("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(S,r.VALIDATE_STATUS)+`

Material Name: `+P.name+`
Material Type: `+P.type+`

Program Info Log: `+F+`
`+K+`
`+ie)}else F!==""?ke("WebGLProgram: Program Info Log:",F):(j===""||B==="")&&($=!1);$&&(P.diagnostics={runnable:I,programLog:F,vertexShader:{log:j,prefix:g},fragmentShader:{log:B,prefix:h}})}r.deleteShader(w),r.deleteShader(T),y=new Xc(r,S),C=OI(r,S)}let y;this.getUniforms=function(){return y===void 0&&R(this),y};let C;this.getAttributes=function(){return C===void 0&&R(this),C};let D=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=r.getProgramParameter(S,AI)),D},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(S),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=CI++,this.cacheKey=e,this.usedTimes=1,this.program=S,this.vertexShader=w,this.fragmentShader=T,this}let JI=0;class eU{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),o=this._getShaderCacheForMaterial(e);return o.has(r)===!1&&(o.add(r),r.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new tU(e),n.set(e,i)),i}}class tU{constructor(e){this.id=JI++,this.code=e,this.usedTimes=0}}function nU(t){return t===bs||t===bu||t===Au}function iU(t,e,n,i,r,s){const o=new rE,a=new eU,l=new Set,c=[],u=new Map,f=i.logarithmicDepthBuffer;let d=i.precision;const p={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(y){return l.add(y),y===0?"uv":`uv${y}`}function S(y,C,D,P,N,H){const V=P.fog,F=N.geometry,j=y.isMeshStandardMaterial||y.isMeshLambertMaterial||y.isMeshPhongMaterial?P.environment:null,B=y.isMeshStandardMaterial||y.isMeshLambertMaterial&&!y.envMap||y.isMeshPhongMaterial&&!y.envMap,I=e.get(y.envMap||j,B),$=I&&I.mapping===sd?I.image.height:null,K=p[y.type];y.precision!==null&&(d=i.getMaxPrecision(y.precision),d!==y.precision&&ke("WebGLProgram.getParameters:",y.precision,"not supported, using",d,"instead."));const ie=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,fe=ie!==void 0?ie.length:0;let Fe=0;F.morphAttributes.position!==void 0&&(Fe=1),F.morphAttributes.normal!==void 0&&(Fe=2),F.morphAttributes.color!==void 0&&(Fe=3);let Be,Le,Q,le;if(K){const He=Mn[K];Be=He.vertexShader,Le=He.fragmentShader}else Be=y.vertexShader,Le=y.fragmentShader,a.update(y),Q=a.getVertexShaderID(y),le=a.getFragmentShaderID(y);const ce=t.getRenderTarget(),Ae=t.state.buffers.depth.getReversed(),Ie=N.isInstancedMesh===!0,Re=N.isBatchedMesh===!0,et=!!y.map,Oe=!!y.matcap,tt=!!I,J=!!y.aoMap,be=!!y.lightMap,Ve=!!y.bumpMap,$e=!!y.normalMap,vt=!!y.displacementMap,O=!!y.emissiveMap,xt=!!y.metalnessMap,Ye=!!y.roughnessMap,at=y.anisotropy>0,ae=y.clearcoat>0,Se=y.dispersion>0,A=y.iridescence>0,E=y.sheen>0,k=y.transmission>0,q=at&&!!y.anisotropyMap,ne=ae&&!!y.clearcoatMap,se=ae&&!!y.clearcoatNormalMap,he=ae&&!!y.clearcoatRoughnessMap,Z=A&&!!y.iridescenceMap,te=A&&!!y.iridescenceThicknessMap,_e=E&&!!y.sheenColorMap,Ee=E&&!!y.sheenRoughnessMap,pe=!!y.specularMap,ue=!!y.specularColorMap,ze=!!y.specularIntensityMap,Xe=k&&!!y.transmissionMap,st=k&&!!y.thicknessMap,U=!!y.gradientMap,de=!!y.alphaMap,ee=y.alphaTest>0,ye=!!y.alphaHash,me=!!y.extensions;let re=Li;y.toneMapped&&(ce===null||ce.isXRRenderTarget===!0)&&(re=t.toneMapping);const Pe={shaderID:K,shaderType:y.type,shaderName:y.name,vertexShader:Be,fragmentShader:Le,defines:y.defines,customVertexShaderID:Q,customFragmentShaderID:le,isRawShaderMaterial:y.isRawShaderMaterial===!0,glslVersion:y.glslVersion,precision:d,batching:Re,batchingColor:Re&&N._colorsTexture!==null,instancing:Ie,instancingColor:Ie&&N.instanceColor!==null,instancingMorph:Ie&&N.morphTexture!==null,outputColorSpace:ce===null?t.outputColorSpace:ce.isXRRenderTarget===!0?ce.texture.colorSpace:Je.workingColorSpace,alphaToCoverage:!!y.alphaToCoverage,map:et,matcap:Oe,envMap:tt,envMapMode:tt&&I.mapping,envMapCubeUVHeight:$,aoMap:J,lightMap:be,bumpMap:Ve,normalMap:$e,displacementMap:vt,emissiveMap:O,normalMapObjectSpace:$e&&y.normalMapType===p3,normalMapTangentSpace:$e&&y.normalMapType===Op,packedNormalMap:$e&&y.normalMapType===Op&&nU(y.normalMap.format),metalnessMap:xt,roughnessMap:Ye,anisotropy:at,anisotropyMap:q,clearcoat:ae,clearcoatMap:ne,clearcoatNormalMap:se,clearcoatRoughnessMap:he,dispersion:Se,iridescence:A,iridescenceMap:Z,iridescenceThicknessMap:te,sheen:E,sheenColorMap:_e,sheenRoughnessMap:Ee,specularMap:pe,specularColorMap:ue,specularIntensityMap:ze,transmission:k,transmissionMap:Xe,thicknessMap:st,gradientMap:U,opaque:y.transparent===!1&&y.blending===Mo&&y.alphaToCoverage===!1,alphaMap:de,alphaTest:ee,alphaHash:ye,combine:y.combine,mapUv:et&&v(y.map.channel),aoMapUv:J&&v(y.aoMap.channel),lightMapUv:be&&v(y.lightMap.channel),bumpMapUv:Ve&&v(y.bumpMap.channel),normalMapUv:$e&&v(y.normalMap.channel),displacementMapUv:vt&&v(y.displacementMap.channel),emissiveMapUv:O&&v(y.emissiveMap.channel),metalnessMapUv:xt&&v(y.metalnessMap.channel),roughnessMapUv:Ye&&v(y.roughnessMap.channel),anisotropyMapUv:q&&v(y.anisotropyMap.channel),clearcoatMapUv:ne&&v(y.clearcoatMap.channel),clearcoatNormalMapUv:se&&v(y.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:he&&v(y.clearcoatRoughnessMap.channel),iridescenceMapUv:Z&&v(y.iridescenceMap.channel),iridescenceThicknessMapUv:te&&v(y.iridescenceThicknessMap.channel),sheenColorMapUv:_e&&v(y.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&v(y.sheenRoughnessMap.channel),specularMapUv:pe&&v(y.specularMap.channel),specularColorMapUv:ue&&v(y.specularColorMap.channel),specularIntensityMapUv:ze&&v(y.specularIntensityMap.channel),transmissionMapUv:Xe&&v(y.transmissionMap.channel),thicknessMapUv:st&&v(y.thicknessMap.channel),alphaMapUv:de&&v(y.alphaMap.channel),vertexTangents:!!F.attributes.tangent&&($e||at),vertexNormals:!!F.attributes.normal,vertexColors:y.vertexColors,vertexAlphas:y.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,pointsUvs:N.isPoints===!0&&!!F.attributes.uv&&(et||de),fog:!!V,useFog:y.fog===!0,fogExp2:!!V&&V.isFogExp2,flatShading:y.wireframe===!1&&(y.flatShading===!0||F.attributes.normal===void 0&&$e===!1&&(y.isMeshLambertMaterial||y.isMeshPhongMaterial||y.isMeshStandardMaterial||y.isMeshPhysicalMaterial)),sizeAttenuation:y.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:Ae,skinning:N.isSkinnedMesh===!0,morphTargets:F.morphAttributes.position!==void 0,morphNormals:F.morphAttributes.normal!==void 0,morphColors:F.morphAttributes.color!==void 0,morphTargetsCount:fe,morphTextureStride:Fe,numDirLights:C.directional.length,numPointLights:C.point.length,numSpotLights:C.spot.length,numSpotLightMaps:C.spotLightMap.length,numRectAreaLights:C.rectArea.length,numHemiLights:C.hemi.length,numDirLightShadows:C.directionalShadowMap.length,numPointLightShadows:C.pointShadowMap.length,numSpotLightShadows:C.spotShadowMap.length,numSpotLightShadowsWithMaps:C.numSpotLightShadowsWithMaps,numLightProbes:C.numLightProbes,numLightProbeGrids:H.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:y.dithering,shadowMapEnabled:t.shadowMap.enabled&&D.length>0,shadowMapType:t.shadowMap.type,toneMapping:re,decodeVideoTexture:et&&y.map.isVideoTexture===!0&&Je.getTransfer(y.map.colorSpace)===lt,decodeVideoTextureEmissive:O&&y.emissiveMap.isVideoTexture===!0&&Je.getTransfer(y.emissiveMap.colorSpace)===lt,premultipliedAlpha:y.premultipliedAlpha,doubleSided:y.side===wi,flipSided:y.side===An,useDepthPacking:y.depthPacking>=0,depthPacking:y.depthPacking||0,index0AttributeName:y.index0AttributeName,extensionClipCullDistance:me&&y.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(me&&y.extensions.multiDraw===!0||Re)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:y.customProgramCacheKey()};return Pe.vertexUv1s=l.has(1),Pe.vertexUv2s=l.has(2),Pe.vertexUv3s=l.has(3),l.clear(),Pe}function g(y){const C=[];if(y.shaderID?C.push(y.shaderID):(C.push(y.customVertexShaderID),C.push(y.customFragmentShaderID)),y.defines!==void 0)for(const D in y.defines)C.push(D),C.push(y.defines[D]);return y.isRawShaderMaterial===!1&&(h(C,y),m(C,y),C.push(t.outputColorSpace)),C.push(y.customProgramCacheKey),C.join()}function h(y,C){y.push(C.precision),y.push(C.outputColorSpace),y.push(C.envMapMode),y.push(C.envMapCubeUVHeight),y.push(C.mapUv),y.push(C.alphaMapUv),y.push(C.lightMapUv),y.push(C.aoMapUv),y.push(C.bumpMapUv),y.push(C.normalMapUv),y.push(C.displacementMapUv),y.push(C.emissiveMapUv),y.push(C.metalnessMapUv),y.push(C.roughnessMapUv),y.push(C.anisotropyMapUv),y.push(C.clearcoatMapUv),y.push(C.clearcoatNormalMapUv),y.push(C.clearcoatRoughnessMapUv),y.push(C.iridescenceMapUv),y.push(C.iridescenceThicknessMapUv),y.push(C.sheenColorMapUv),y.push(C.sheenRoughnessMapUv),y.push(C.specularMapUv),y.push(C.specularColorMapUv),y.push(C.specularIntensityMapUv),y.push(C.transmissionMapUv),y.push(C.thicknessMapUv),y.push(C.combine),y.push(C.fogExp2),y.push(C.sizeAttenuation),y.push(C.morphTargetsCount),y.push(C.morphAttributeCount),y.push(C.numDirLights),y.push(C.numPointLights),y.push(C.numSpotLights),y.push(C.numSpotLightMaps),y.push(C.numHemiLights),y.push(C.numRectAreaLights),y.push(C.numDirLightShadows),y.push(C.numPointLightShadows),y.push(C.numSpotLightShadows),y.push(C.numSpotLightShadowsWithMaps),y.push(C.numLightProbes),y.push(C.shadowMapType),y.push(C.toneMapping),y.push(C.numClippingPlanes),y.push(C.numClipIntersection),y.push(C.depthPacking)}function m(y,C){o.disableAll(),C.instancing&&o.enable(0),C.instancingColor&&o.enable(1),C.instancingMorph&&o.enable(2),C.matcap&&o.enable(3),C.envMap&&o.enable(4),C.normalMapObjectSpace&&o.enable(5),C.normalMapTangentSpace&&o.enable(6),C.clearcoat&&o.enable(7),C.iridescence&&o.enable(8),C.alphaTest&&o.enable(9),C.vertexColors&&o.enable(10),C.vertexAlphas&&o.enable(11),C.vertexUv1s&&o.enable(12),C.vertexUv2s&&o.enable(13),C.vertexUv3s&&o.enable(14),C.vertexTangents&&o.enable(15),C.anisotropy&&o.enable(16),C.alphaHash&&o.enable(17),C.batching&&o.enable(18),C.dispersion&&o.enable(19),C.batchingColor&&o.enable(20),C.gradientMap&&o.enable(21),C.packedNormalMap&&o.enable(22),C.vertexNormals&&o.enable(23),y.push(o.mask),o.disableAll(),C.fog&&o.enable(0),C.useFog&&o.enable(1),C.flatShading&&o.enable(2),C.logarithmicDepthBuffer&&o.enable(3),C.reversedDepthBuffer&&o.enable(4),C.skinning&&o.enable(5),C.morphTargets&&o.enable(6),C.morphNormals&&o.enable(7),C.morphColors&&o.enable(8),C.premultipliedAlpha&&o.enable(9),C.shadowMapEnabled&&o.enable(10),C.doubleSided&&o.enable(11),C.flipSided&&o.enable(12),C.useDepthPacking&&o.enable(13),C.dithering&&o.enable(14),C.transmission&&o.enable(15),C.sheen&&o.enable(16),C.opaque&&o.enable(17),C.pointsUvs&&o.enable(18),C.decodeVideoTexture&&o.enable(19),C.decodeVideoTextureEmissive&&o.enable(20),C.alphaToCoverage&&o.enable(21),C.numLightProbeGrids>0&&o.enable(22),y.push(o.mask)}function _(y){const C=p[y.type];let D;if(C){const P=Mn[C];D=Fg.clone(P.uniforms)}else D=y.uniforms;return D}function M(y,C){let D=u.get(C);return D!==void 0?++D.usedTimes:(D=new QI(t,C,y,r),c.push(D),u.set(C,D)),D}function w(y){if(--y.usedTimes===0){const C=c.indexOf(y);c[C]=c[c.length-1],c.pop(),u.delete(y.cacheKey),y.destroy()}}function T(y){a.remove(y)}function R(){a.dispose()}return{getParameters:S,getProgramCacheKey:g,getUniforms:_,acquireProgram:M,releaseProgram:w,releaseShaderCache:T,programs:c,dispose:R}}function rU(){let t=new WeakMap;function e(o){return t.has(o)}function n(o){let a=t.get(o);return a===void 0&&(a={},t.set(o,a)),a}function i(o){t.delete(o)}function r(o,a,l){t.get(o)[a]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function sU(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.materialVariant!==e.materialVariant?t.materialVariant-e.materialVariant:t.z!==e.z?t.z-e.z:t.id-e.id}function R_(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function P_(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function o(d){let p=0;return d.isInstancedMesh&&(p+=2),d.isSkinnedMesh&&(p+=1),p}function a(d,p,v,S,g,h){let m=t[e];return m===void 0?(m={id:d.id,object:d,geometry:p,material:v,materialVariant:o(d),groupOrder:S,renderOrder:d.renderOrder,z:g,group:h},t[e]=m):(m.id=d.id,m.object=d,m.geometry=p,m.material=v,m.materialVariant=o(d),m.groupOrder=S,m.renderOrder=d.renderOrder,m.z=g,m.group=h),e++,m}function l(d,p,v,S,g,h){const m=a(d,p,v,S,g,h);v.transmission>0?i.push(m):v.transparent===!0?r.push(m):n.push(m)}function c(d,p,v,S,g,h){const m=a(d,p,v,S,g,h);v.transmission>0?i.unshift(m):v.transparent===!0?r.unshift(m):n.unshift(m)}function u(d,p){n.length>1&&n.sort(d||sU),i.length>1&&i.sort(p||R_),r.length>1&&r.sort(p||R_)}function f(){for(let d=e,p=t.length;d<p;d++){const v=t[d];if(v.id===null)break;v.id=null,v.object=null,v.geometry=null,v.material=null,v.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:l,unshift:c,finish:f,sort:u}}function oU(){let t=new WeakMap;function e(i,r){const s=t.get(i);let o;return s===void 0?(o=new P_,t.set(i,[o])):r>=s.length?(o=new P_,s.push(o)):o=s[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}function aU(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new L,color:new ot};break;case"SpotLight":n={position:new L,direction:new L,color:new ot,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new L,color:new ot,distance:0,decay:0};break;case"HemisphereLight":n={direction:new L,skyColor:new ot,groundColor:new ot};break;case"RectAreaLight":n={color:new ot,position:new L,halfWidth:new L,halfHeight:new L};break}return t[e.id]=n,n}}}function lU(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Qe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let cU=0;function uU(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function dU(t){const e=new aU,n=lU(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)i.probe.push(new L);const r=new L,s=new Nt,o=new Nt;function a(c){let u=0,f=0,d=0;for(let C=0;C<9;C++)i.probe[C].set(0,0,0);let p=0,v=0,S=0,g=0,h=0,m=0,_=0,M=0,w=0,T=0,R=0;c.sort(uU);for(let C=0,D=c.length;C<D;C++){const P=c[C],N=P.color,H=P.intensity,V=P.distance;let F=null;if(P.shadow&&P.shadow.map&&(P.shadow.map.texture.format===bs?F=P.shadow.map.texture:F=P.shadow.map.depthTexture||P.shadow.map.texture),P.isAmbientLight)u+=N.r*H,f+=N.g*H,d+=N.b*H;else if(P.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(P.sh.coefficients[j],H);R++}else if(P.isDirectionalLight){const j=e.get(P);if(j.color.copy(P.color).multiplyScalar(P.intensity),P.castShadow){const B=P.shadow,I=n.get(P);I.shadowIntensity=B.intensity,I.shadowBias=B.bias,I.shadowNormalBias=B.normalBias,I.shadowRadius=B.radius,I.shadowMapSize=B.mapSize,i.directionalShadow[p]=I,i.directionalShadowMap[p]=F,i.directionalShadowMatrix[p]=P.shadow.matrix,m++}i.directional[p]=j,p++}else if(P.isSpotLight){const j=e.get(P);j.position.setFromMatrixPosition(P.matrixWorld),j.color.copy(N).multiplyScalar(H),j.distance=V,j.coneCos=Math.cos(P.angle),j.penumbraCos=Math.cos(P.angle*(1-P.penumbra)),j.decay=P.decay,i.spot[S]=j;const B=P.shadow;if(P.map&&(i.spotLightMap[w]=P.map,w++,B.updateMatrices(P),P.castShadow&&T++),i.spotLightMatrix[S]=B.matrix,P.castShadow){const I=n.get(P);I.shadowIntensity=B.intensity,I.shadowBias=B.bias,I.shadowNormalBias=B.normalBias,I.shadowRadius=B.radius,I.shadowMapSize=B.mapSize,i.spotShadow[S]=I,i.spotShadowMap[S]=F,M++}S++}else if(P.isRectAreaLight){const j=e.get(P);j.color.copy(N).multiplyScalar(H),j.halfWidth.set(P.width*.5,0,0),j.halfHeight.set(0,P.height*.5,0),i.rectArea[g]=j,g++}else if(P.isPointLight){const j=e.get(P);if(j.color.copy(P.color).multiplyScalar(P.intensity),j.distance=P.distance,j.decay=P.decay,P.castShadow){const B=P.shadow,I=n.get(P);I.shadowIntensity=B.intensity,I.shadowBias=B.bias,I.shadowNormalBias=B.normalBias,I.shadowRadius=B.radius,I.shadowMapSize=B.mapSize,I.shadowCameraNear=B.camera.near,I.shadowCameraFar=B.camera.far,i.pointShadow[v]=I,i.pointShadowMap[v]=F,i.pointShadowMatrix[v]=P.shadow.matrix,_++}i.point[v]=j,v++}else if(P.isHemisphereLight){const j=e.get(P);j.skyColor.copy(P.color).multiplyScalar(H),j.groundColor.copy(P.groundColor).multiplyScalar(H),i.hemi[h]=j,h++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ge.LTC_FLOAT_1,i.rectAreaLTC2=ge.LTC_FLOAT_2):(i.rectAreaLTC1=ge.LTC_HALF_1,i.rectAreaLTC2=ge.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=d;const y=i.hash;(y.directionalLength!==p||y.pointLength!==v||y.spotLength!==S||y.rectAreaLength!==g||y.hemiLength!==h||y.numDirectionalShadows!==m||y.numPointShadows!==_||y.numSpotShadows!==M||y.numSpotMaps!==w||y.numLightProbes!==R)&&(i.directional.length=p,i.spot.length=S,i.rectArea.length=g,i.point.length=v,i.hemi.length=h,i.directionalShadow.length=m,i.directionalShadowMap.length=m,i.pointShadow.length=_,i.pointShadowMap.length=_,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=m,i.pointShadowMatrix.length=_,i.spotLightMatrix.length=M+w-T,i.spotLightMap.length=w,i.numSpotLightShadowsWithMaps=T,i.numLightProbes=R,y.directionalLength=p,y.pointLength=v,y.spotLength=S,y.rectAreaLength=g,y.hemiLength=h,y.numDirectionalShadows=m,y.numPointShadows=_,y.numSpotShadows=M,y.numSpotMaps=w,y.numLightProbes=R,i.version=cU++)}function l(c,u){let f=0,d=0,p=0,v=0,S=0;const g=u.matrixWorldInverse;for(let h=0,m=c.length;h<m;h++){const _=c[h];if(_.isDirectionalLight){const M=i.directional[f];M.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),f++}else if(_.isSpotLight){const M=i.spot[p];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(g),M.direction.setFromMatrixPosition(_.matrixWorld),r.setFromMatrixPosition(_.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(g),p++}else if(_.isRectAreaLight){const M=i.rectArea[v];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(g),o.identity(),s.copy(_.matrixWorld),s.premultiply(g),o.extractRotation(s),M.halfWidth.set(_.width*.5,0,0),M.halfHeight.set(0,_.height*.5,0),M.halfWidth.applyMatrix4(o),M.halfHeight.applyMatrix4(o),v++}else if(_.isPointLight){const M=i.point[d];M.position.setFromMatrixPosition(_.matrixWorld),M.position.applyMatrix4(g),d++}else if(_.isHemisphereLight){const M=i.hemi[S];M.direction.setFromMatrixPosition(_.matrixWorld),M.direction.transformDirection(g),S++}}}return{setup:a,setupView:l,state:i}}function D_(t){const e=new dU(t),n=[],i=[],r=[];function s(d){f.camera=d,n.length=0,i.length=0,r.length=0}function o(d){n.push(d)}function a(d){i.push(d)}function l(d){r.push(d)}function c(){e.setup(n)}function u(d){e.setupView(n,d)}const f={lightsArray:n,shadowsArray:i,lightProbeGridArray:r,camera:null,lights:e,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:f,setupLights:c,setupLightsView:u,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function fU(t){let e=new WeakMap;function n(r,s=0){const o=e.get(r);let a;return o===void 0?(a=new D_(t),e.set(r,[a])):s>=o.length?(a=new D_(t),o.push(a)):a=o[s],a}function i(){e=new WeakMap}return{get:n,dispose:i}}const hU=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,pU=`uniform sampler2D shadow_pass;
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
}`,mU=[new L(1,0,0),new L(-1,0,0),new L(0,1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1)],gU=[new L(0,-1,0),new L(0,-1,0),new L(0,0,1),new L(0,0,-1),new L(0,-1,0),new L(0,-1,0)],N_=new Nt,aa=new L,Df=new L;function vU(t,e,n){let i=new Pg;const r=new Qe,s=new Qe,o=new gt,a=new M2,l=new E2,c={},u=n.maxTextureSize,f={[zr]:An,[An]:zr,[wi]:wi},d=new mi({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Qe},radius:{value:4}},vertexShader:hU,fragmentShader:pU}),p=d.clone();p.defines.HORIZONTAL_PASS=1;const v=new Cn;v.setAttribute("position",new hi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const S=new ei(v,d),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Vc;let h=this.type;this.render=function(T,R,y){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||T.length===0)return;this.type===WP&&(ke("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Vc);const C=t.getRenderTarget(),D=t.getActiveCubeFace(),P=t.getActiveMipmapLevel(),N=t.state;N.setBlending(qi),N.buffers.depth.getReversed()===!0?N.buffers.color.setClear(0,0,0,0):N.buffers.color.setClear(1,1,1,1),N.buffers.depth.setTest(!0),N.setScissorTest(!1);const H=h!==this.type;H&&R.traverse(function(V){V.material&&(Array.isArray(V.material)?V.material.forEach(F=>F.needsUpdate=!0):V.material.needsUpdate=!0)});for(let V=0,F=T.length;V<F;V++){const j=T[V],B=j.shadow;if(B===void 0){ke("WebGLShadowMap:",j,"has no shadow.");continue}if(B.autoUpdate===!1&&B.needsUpdate===!1)continue;r.copy(B.mapSize);const I=B.getFrameExtents();r.multiply(I),s.copy(B.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/I.x),r.x=s.x*I.x,B.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/I.y),r.y=s.y*I.y,B.mapSize.y=s.y));const $=t.state.buffers.depth.getReversed();if(B.camera._reversedDepth=$,B.map===null||H===!0){if(B.map!==null&&(B.map.depthTexture!==null&&(B.map.depthTexture.dispose(),B.map.depthTexture=null),B.map.dispose()),this.type===ga){if(j.isPointLight){ke("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}B.map=new Ii(r.x,r.y,{format:bs,type:rr,minFilter:dn,magFilter:dn,generateMipmaps:!1}),B.map.texture.name=j.name+".shadowMap",B.map.depthTexture=new Oo(r.x,r.y,Ai),B.map.depthTexture.name=j.name+".shadowMapDepth",B.map.depthTexture.format=sr,B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Jt,B.map.depthTexture.magFilter=Jt}else j.isPointLight?(B.map=new mE(r.x),B.map.depthTexture=new p2(r.x,Ui)):(B.map=new Ii(r.x,r.y),B.map.depthTexture=new Oo(r.x,r.y,Ui)),B.map.depthTexture.name=j.name+".shadowMap",B.map.depthTexture.format=sr,this.type===Vc?(B.map.depthTexture.compareFunction=$?bg:wg,B.map.depthTexture.minFilter=dn,B.map.depthTexture.magFilter=dn):(B.map.depthTexture.compareFunction=null,B.map.depthTexture.minFilter=Jt,B.map.depthTexture.magFilter=Jt);B.camera.updateProjectionMatrix()}const K=B.map.isWebGLCubeRenderTarget?6:1;for(let ie=0;ie<K;ie++){if(B.map.isWebGLCubeRenderTarget)t.setRenderTarget(B.map,ie),t.clear();else{ie===0&&(t.setRenderTarget(B.map),t.clear());const fe=B.getViewport(ie);o.set(s.x*fe.x,s.y*fe.y,s.x*fe.z,s.y*fe.w),N.viewport(o)}if(j.isPointLight){const fe=B.camera,Fe=B.matrix,Be=j.distance||fe.far;Be!==fe.far&&(fe.far=Be,fe.updateProjectionMatrix()),aa.setFromMatrixPosition(j.matrixWorld),fe.position.copy(aa),Df.copy(fe.position),Df.add(mU[ie]),fe.up.copy(gU[ie]),fe.lookAt(Df),fe.updateMatrixWorld(),Fe.makeTranslation(-aa.x,-aa.y,-aa.z),N_.multiplyMatrices(fe.projectionMatrix,fe.matrixWorldInverse),B._frustum.setFromProjectionMatrix(N_,fe.coordinateSystem,fe.reversedDepth)}else B.updateMatrices(j);i=B.getFrustum(),M(R,y,B.camera,j,this.type)}B.isPointLightShadow!==!0&&this.type===ga&&m(B,y),B.needsUpdate=!1}h=this.type,g.needsUpdate=!1,t.setRenderTarget(C,D,P)};function m(T,R){const y=e.update(S);d.defines.VSM_SAMPLES!==T.blurSamples&&(d.defines.VSM_SAMPLES=T.blurSamples,p.defines.VSM_SAMPLES=T.blurSamples,d.needsUpdate=!0,p.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Ii(r.x,r.y,{format:bs,type:rr})),d.uniforms.shadow_pass.value=T.map.depthTexture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,t.setRenderTarget(T.mapPass),t.clear(),t.renderBufferDirect(R,null,y,d,S,null),p.uniforms.shadow_pass.value=T.mapPass.texture,p.uniforms.resolution.value=T.mapSize,p.uniforms.radius.value=T.radius,t.setRenderTarget(T.map),t.clear(),t.renderBufferDirect(R,null,y,p,S,null)}function _(T,R,y,C){let D=null;const P=y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(P!==void 0)D=P;else if(D=y.isPointLight===!0?l:a,t.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const N=D.uuid,H=R.uuid;let V=c[N];V===void 0&&(V={},c[N]=V);let F=V[H];F===void 0&&(F=D.clone(),V[H]=F,R.addEventListener("dispose",w)),D=F}if(D.visible=R.visible,D.wireframe=R.wireframe,C===ga?D.side=R.shadowSide!==null?R.shadowSide:R.side:D.side=R.shadowSide!==null?R.shadowSide:f[R.side],D.alphaMap=R.alphaMap,D.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,D.map=R.map,D.clipShadows=R.clipShadows,D.clippingPlanes=R.clippingPlanes,D.clipIntersection=R.clipIntersection,D.displacementMap=R.displacementMap,D.displacementScale=R.displacementScale,D.displacementBias=R.displacementBias,D.wireframeLinewidth=R.wireframeLinewidth,D.linewidth=R.linewidth,y.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const N=t.properties.get(D);N.light=y}return D}function M(T,R,y,C,D){if(T.visible===!1)return;if(T.layers.test(R.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&D===ga)&&(!T.frustumCulled||i.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,T.matrixWorld);const H=e.update(T),V=T.material;if(Array.isArray(V)){const F=H.groups;for(let j=0,B=F.length;j<B;j++){const I=F[j],$=V[I.materialIndex];if($&&$.visible){const K=_(T,$,C,D);T.onBeforeShadow(t,T,R,y,H,K,I),t.renderBufferDirect(y,null,H,K,T,I),T.onAfterShadow(t,T,R,y,H,K,I)}}}else if(V.visible){const F=_(T,V,C,D);T.onBeforeShadow(t,T,R,y,H,F,null),t.renderBufferDirect(y,null,H,F,T,null),T.onAfterShadow(t,T,R,y,H,F,null)}}const N=T.children;for(let H=0,V=N.length;H<V;H++)M(N[H],R,y,C,D)}function w(T){T.target.removeEventListener("dispose",w);for(const y in c){const C=c[y],D=T.target.uuid;D in C&&(C[D].dispose(),delete C[D])}}}function xU(t,e){function n(){let U=!1;const de=new gt;let ee=null;const ye=new gt(0,0,0,0);return{setMask:function(me){ee!==me&&!U&&(t.colorMask(me,me,me,me),ee=me)},setLocked:function(me){U=me},setClear:function(me,re,Pe,He,Lt){Lt===!0&&(me*=He,re*=He,Pe*=He),de.set(me,re,Pe,He),ye.equals(de)===!1&&(t.clearColor(me,re,Pe,He),ye.copy(de))},reset:function(){U=!1,ee=null,ye.set(-1,0,0,0)}}}function i(){let U=!1,de=!1,ee=null,ye=null,me=null;return{setReversed:function(re){if(de!==re){const Pe=e.get("EXT_clip_control");re?Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.ZERO_TO_ONE_EXT):Pe.clipControlEXT(Pe.LOWER_LEFT_EXT,Pe.NEGATIVE_ONE_TO_ONE_EXT),de=re;const He=me;me=null,this.setClear(He)}},getReversed:function(){return de},setTest:function(re){re?ce(t.DEPTH_TEST):Ae(t.DEPTH_TEST)},setMask:function(re){ee!==re&&!U&&(t.depthMask(re),ee=re)},setFunc:function(re){if(de&&(re=T3[re]),ye!==re){switch(re){case Qh:t.depthFunc(t.NEVER);break;case Jh:t.depthFunc(t.ALWAYS);break;case ep:t.depthFunc(t.LESS);break;case Uo:t.depthFunc(t.LEQUAL);break;case tp:t.depthFunc(t.EQUAL);break;case np:t.depthFunc(t.GEQUAL);break;case ip:t.depthFunc(t.GREATER);break;case rp:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}ye=re}},setLocked:function(re){U=re},setClear:function(re){me!==re&&(me=re,de&&(re=1-re),t.clearDepth(re))},reset:function(){U=!1,ee=null,ye=null,me=null,de=!1}}}function r(){let U=!1,de=null,ee=null,ye=null,me=null,re=null,Pe=null,He=null,Lt=null;return{setTest:function(ft){U||(ft?ce(t.STENCIL_TEST):Ae(t.STENCIL_TEST))},setMask:function(ft){de!==ft&&!U&&(t.stencilMask(ft),de=ft)},setFunc:function(ft,Fi,gi){(ee!==ft||ye!==Fi||me!==gi)&&(t.stencilFunc(ft,Fi,gi),ee=ft,ye=Fi,me=gi)},setOp:function(ft,Fi,gi){(re!==ft||Pe!==Fi||He!==gi)&&(t.stencilOp(ft,Fi,gi),re=ft,Pe=Fi,He=gi)},setLocked:function(ft){U=ft},setClear:function(ft){Lt!==ft&&(t.clearStencil(ft),Lt=ft)},reset:function(){U=!1,de=null,ee=null,ye=null,me=null,re=null,Pe=null,He=null,Lt=null}}}const s=new n,o=new i,a=new r,l=new WeakMap,c=new WeakMap;let u={},f={},d={},p=new WeakMap,v=[],S=null,g=!1,h=null,m=null,_=null,M=null,w=null,T=null,R=null,y=new ot(0,0,0),C=0,D=!1,P=null,N=null,H=null,V=null,F=null;const j=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let B=!1,I=0;const $=t.getParameter(t.VERSION);$.indexOf("WebGL")!==-1?(I=parseFloat(/^WebGL (\d)/.exec($)[1]),B=I>=1):$.indexOf("OpenGL ES")!==-1&&(I=parseFloat(/^OpenGL ES (\d)/.exec($)[1]),B=I>=2);let K=null,ie={};const fe=t.getParameter(t.SCISSOR_BOX),Fe=t.getParameter(t.VIEWPORT),Be=new gt().fromArray(fe),Le=new gt().fromArray(Fe);function Q(U,de,ee,ye){const me=new Uint8Array(4),re=t.createTexture();t.bindTexture(U,re),t.texParameteri(U,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(U,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let Pe=0;Pe<ee;Pe++)U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY?t.texImage3D(de,0,t.RGBA,1,1,ye,0,t.RGBA,t.UNSIGNED_BYTE,me):t.texImage2D(de+Pe,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,me);return re}const le={};le[t.TEXTURE_2D]=Q(t.TEXTURE_2D,t.TEXTURE_2D,1),le[t.TEXTURE_CUBE_MAP]=Q(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),le[t.TEXTURE_2D_ARRAY]=Q(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),le[t.TEXTURE_3D]=Q(t.TEXTURE_3D,t.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),ce(t.DEPTH_TEST),o.setFunc(Uo),Ve(!1),$e(Nx),ce(t.CULL_FACE),J(qi);function ce(U){u[U]!==!0&&(t.enable(U),u[U]=!0)}function Ae(U){u[U]!==!1&&(t.disable(U),u[U]=!1)}function Ie(U,de){return d[U]!==de?(t.bindFramebuffer(U,de),d[U]=de,U===t.DRAW_FRAMEBUFFER&&(d[t.FRAMEBUFFER]=de),U===t.FRAMEBUFFER&&(d[t.DRAW_FRAMEBUFFER]=de),!0):!1}function Re(U,de){let ee=v,ye=!1;if(U){ee=p.get(de),ee===void 0&&(ee=[],p.set(de,ee));const me=U.textures;if(ee.length!==me.length||ee[0]!==t.COLOR_ATTACHMENT0){for(let re=0,Pe=me.length;re<Pe;re++)ee[re]=t.COLOR_ATTACHMENT0+re;ee.length=me.length,ye=!0}}else ee[0]!==t.BACK&&(ee[0]=t.BACK,ye=!0);ye&&t.drawBuffers(ee)}function et(U){return S!==U?(t.useProgram(U),S=U,!0):!1}const Oe={[ss]:t.FUNC_ADD,[$P]:t.FUNC_SUBTRACT,[YP]:t.FUNC_REVERSE_SUBTRACT};Oe[KP]=t.MIN,Oe[qP]=t.MAX;const tt={[ZP]:t.ZERO,[QP]:t.ONE,[JP]:t.SRC_COLOR,[qh]:t.SRC_ALPHA,[s3]:t.SRC_ALPHA_SATURATE,[i3]:t.DST_COLOR,[t3]:t.DST_ALPHA,[e3]:t.ONE_MINUS_SRC_COLOR,[Zh]:t.ONE_MINUS_SRC_ALPHA,[r3]:t.ONE_MINUS_DST_COLOR,[n3]:t.ONE_MINUS_DST_ALPHA,[o3]:t.CONSTANT_COLOR,[a3]:t.ONE_MINUS_CONSTANT_COLOR,[l3]:t.CONSTANT_ALPHA,[c3]:t.ONE_MINUS_CONSTANT_ALPHA};function J(U,de,ee,ye,me,re,Pe,He,Lt,ft){if(U===qi){g===!0&&(Ae(t.BLEND),g=!1);return}if(g===!1&&(ce(t.BLEND),g=!0),U!==XP){if(U!==h||ft!==D){if((m!==ss||w!==ss)&&(t.blendEquation(t.FUNC_ADD),m=ss,w=ss),ft)switch(U){case Mo:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Lx:t.blendFunc(t.ONE,t.ONE);break;case Ix:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Ux:t.blendFuncSeparate(t.DST_COLOR,t.ONE_MINUS_SRC_ALPHA,t.ZERO,t.ONE);break;default:it("WebGLState: Invalid blending: ",U);break}else switch(U){case Mo:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case Lx:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE,t.ONE,t.ONE);break;case Ix:it("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ux:it("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:it("WebGLState: Invalid blending: ",U);break}_=null,M=null,T=null,R=null,y.set(0,0,0),C=0,h=U,D=ft}return}me=me||de,re=re||ee,Pe=Pe||ye,(de!==m||me!==w)&&(t.blendEquationSeparate(Oe[de],Oe[me]),m=de,w=me),(ee!==_||ye!==M||re!==T||Pe!==R)&&(t.blendFuncSeparate(tt[ee],tt[ye],tt[re],tt[Pe]),_=ee,M=ye,T=re,R=Pe),(He.equals(y)===!1||Lt!==C)&&(t.blendColor(He.r,He.g,He.b,Lt),y.copy(He),C=Lt),h=U,D=!1}function be(U,de){U.side===wi?Ae(t.CULL_FACE):ce(t.CULL_FACE);let ee=U.side===An;de&&(ee=!ee),Ve(ee),U.blending===Mo&&U.transparent===!1?J(qi):J(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),o.setFunc(U.depthFunc),o.setTest(U.depthTest),o.setMask(U.depthWrite),s.setMask(U.colorWrite);const ye=U.stencilWrite;a.setTest(ye),ye&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),O(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ce(t.SAMPLE_ALPHA_TO_COVERAGE):Ae(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(U){P!==U&&(U?t.frontFace(t.CW):t.frontFace(t.CCW),P=U)}function $e(U){U!==HP?(ce(t.CULL_FACE),U!==N&&(U===Nx?t.cullFace(t.BACK):U===jP?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):Ae(t.CULL_FACE),N=U}function vt(U){U!==H&&(B&&t.lineWidth(U),H=U)}function O(U,de,ee){U?(ce(t.POLYGON_OFFSET_FILL),(V!==de||F!==ee)&&(V=de,F=ee,o.getReversed()&&(de=-de),t.polygonOffset(de,ee))):Ae(t.POLYGON_OFFSET_FILL)}function xt(U){U?ce(t.SCISSOR_TEST):Ae(t.SCISSOR_TEST)}function Ye(U){U===void 0&&(U=t.TEXTURE0+j-1),K!==U&&(t.activeTexture(U),K=U)}function at(U,de,ee){ee===void 0&&(K===null?ee=t.TEXTURE0+j-1:ee=K);let ye=ie[ee];ye===void 0&&(ye={type:void 0,texture:void 0},ie[ee]=ye),(ye.type!==U||ye.texture!==de)&&(K!==ee&&(t.activeTexture(ee),K=ee),t.bindTexture(U,de||le[U]),ye.type=U,ye.texture=de)}function ae(){const U=ie[K];U!==void 0&&U.type!==void 0&&(t.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function Se(){try{t.compressedTexImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function A(){try{t.compressedTexImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function E(){try{t.texSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function k(){try{t.texSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function q(){try{t.compressedTexSubImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function ne(){try{t.compressedTexSubImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function se(){try{t.texStorage2D(...arguments)}catch(U){it("WebGLState:",U)}}function he(){try{t.texStorage3D(...arguments)}catch(U){it("WebGLState:",U)}}function Z(){try{t.texImage2D(...arguments)}catch(U){it("WebGLState:",U)}}function te(){try{t.texImage3D(...arguments)}catch(U){it("WebGLState:",U)}}function _e(U){return f[U]!==void 0?f[U]:t.getParameter(U)}function Ee(U,de){f[U]!==de&&(t.pixelStorei(U,de),f[U]=de)}function pe(U){Be.equals(U)===!1&&(t.scissor(U.x,U.y,U.z,U.w),Be.copy(U))}function ue(U){Le.equals(U)===!1&&(t.viewport(U.x,U.y,U.z,U.w),Le.copy(U))}function ze(U,de){let ee=c.get(de);ee===void 0&&(ee=new WeakMap,c.set(de,ee));let ye=ee.get(U);ye===void 0&&(ye=t.getUniformBlockIndex(de,U.name),ee.set(U,ye))}function Xe(U,de){const ye=c.get(de).get(U);l.get(de)!==ye&&(t.uniformBlockBinding(de,ye,U.__bindingPointIndex),l.set(de,ye))}function st(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),o.setReversed(!1),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),t.pixelStorei(t.PACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_ALIGNMENT,4),t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,!1),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,t.BROWSER_DEFAULT_WEBGL),t.pixelStorei(t.PACK_ROW_LENGTH,0),t.pixelStorei(t.PACK_SKIP_PIXELS,0),t.pixelStorei(t.PACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_ROW_LENGTH,0),t.pixelStorei(t.UNPACK_IMAGE_HEIGHT,0),t.pixelStorei(t.UNPACK_SKIP_PIXELS,0),t.pixelStorei(t.UNPACK_SKIP_ROWS,0),t.pixelStorei(t.UNPACK_SKIP_IMAGES,0),u={},f={},K=null,ie={},d={},p=new WeakMap,v=[],S=null,g=!1,h=null,m=null,_=null,M=null,w=null,T=null,R=null,y=new ot(0,0,0),C=0,D=!1,P=null,N=null,H=null,V=null,F=null,Be.set(0,0,t.canvas.width,t.canvas.height),Le.set(0,0,t.canvas.width,t.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:ce,disable:Ae,bindFramebuffer:Ie,drawBuffers:Re,useProgram:et,setBlending:J,setMaterial:be,setFlipSided:Ve,setCullFace:$e,setLineWidth:vt,setPolygonOffset:O,setScissorTest:xt,activeTexture:Ye,bindTexture:at,unbindTexture:ae,compressedTexImage2D:Se,compressedTexImage3D:A,texImage2D:Z,texImage3D:te,pixelStorei:Ee,getParameter:_e,updateUBOMapping:ze,uniformBlockBinding:Xe,texStorage2D:se,texStorage3D:he,texSubImage2D:E,texSubImage3D:k,compressedTexSubImage2D:q,compressedTexSubImage3D:ne,scissor:pe,viewport:ue,reset:st}}function _U(t,e,n,i,r,s,o){const a=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Qe,u=new WeakMap,f=new Set;let d;const p=new WeakMap;let v=!1;try{v=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(A,E){return v?new OffscreenCanvas(A,E):Pu("canvas")}function g(A,E,k){let q=1;const ne=Se(A);if((ne.width>k||ne.height>k)&&(q=k/Math.max(ne.width,ne.height)),q<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const se=Math.floor(q*ne.width),he=Math.floor(q*ne.height);d===void 0&&(d=S(se,he));const Z=E?S(se,he):d;return Z.width=se,Z.height=he,Z.getContext("2d").drawImage(A,0,0,se,he),ke("WebGLRenderer: Texture has been resized from ("+ne.width+"x"+ne.height+") to ("+se+"x"+he+")."),Z}else return"data"in A&&ke("WebGLRenderer: Image in DataTexture is too big ("+ne.width+"x"+ne.height+")."),A;return A}function h(A){return A.generateMipmaps}function m(A){t.generateMipmap(A)}function _(A){return A.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:A.isWebGL3DRenderTarget?t.TEXTURE_3D:A.isWebGLArrayRenderTarget||A.isCompressedArrayTexture?t.TEXTURE_2D_ARRAY:t.TEXTURE_2D}function M(A,E,k,q,ne,se=!1){if(A!==null){if(t[A]!==void 0)return t[A];ke("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let he;q&&(he=e.get("EXT_texture_norm16"),he||ke("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let Z=E;if(E===t.RED&&(k===t.FLOAT&&(Z=t.R32F),k===t.HALF_FLOAT&&(Z=t.R16F),k===t.UNSIGNED_BYTE&&(Z=t.R8),k===t.UNSIGNED_SHORT&&he&&(Z=he.R16_EXT),k===t.SHORT&&he&&(Z=he.R16_SNORM_EXT)),E===t.RED_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.R8UI),k===t.UNSIGNED_SHORT&&(Z=t.R16UI),k===t.UNSIGNED_INT&&(Z=t.R32UI),k===t.BYTE&&(Z=t.R8I),k===t.SHORT&&(Z=t.R16I),k===t.INT&&(Z=t.R32I)),E===t.RG&&(k===t.FLOAT&&(Z=t.RG32F),k===t.HALF_FLOAT&&(Z=t.RG16F),k===t.UNSIGNED_BYTE&&(Z=t.RG8),k===t.UNSIGNED_SHORT&&he&&(Z=he.RG16_EXT),k===t.SHORT&&he&&(Z=he.RG16_SNORM_EXT)),E===t.RG_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.RG8UI),k===t.UNSIGNED_SHORT&&(Z=t.RG16UI),k===t.UNSIGNED_INT&&(Z=t.RG32UI),k===t.BYTE&&(Z=t.RG8I),k===t.SHORT&&(Z=t.RG16I),k===t.INT&&(Z=t.RG32I)),E===t.RGB_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.RGB8UI),k===t.UNSIGNED_SHORT&&(Z=t.RGB16UI),k===t.UNSIGNED_INT&&(Z=t.RGB32UI),k===t.BYTE&&(Z=t.RGB8I),k===t.SHORT&&(Z=t.RGB16I),k===t.INT&&(Z=t.RGB32I)),E===t.RGBA_INTEGER&&(k===t.UNSIGNED_BYTE&&(Z=t.RGBA8UI),k===t.UNSIGNED_SHORT&&(Z=t.RGBA16UI),k===t.UNSIGNED_INT&&(Z=t.RGBA32UI),k===t.BYTE&&(Z=t.RGBA8I),k===t.SHORT&&(Z=t.RGBA16I),k===t.INT&&(Z=t.RGBA32I)),E===t.RGB&&(k===t.UNSIGNED_SHORT&&he&&(Z=he.RGB16_EXT),k===t.SHORT&&he&&(Z=he.RGB16_SNORM_EXT),k===t.UNSIGNED_INT_5_9_9_9_REV&&(Z=t.RGB9_E5),k===t.UNSIGNED_INT_10F_11F_11F_REV&&(Z=t.R11F_G11F_B10F)),E===t.RGBA){const te=se?Ru:Je.getTransfer(ne);k===t.FLOAT&&(Z=t.RGBA32F),k===t.HALF_FLOAT&&(Z=t.RGBA16F),k===t.UNSIGNED_BYTE&&(Z=te===lt?t.SRGB8_ALPHA8:t.RGBA8),k===t.UNSIGNED_SHORT&&he&&(Z=he.RGBA16_EXT),k===t.SHORT&&he&&(Z=he.RGBA16_SNORM_EXT),k===t.UNSIGNED_SHORT_4_4_4_4&&(Z=t.RGBA4),k===t.UNSIGNED_SHORT_5_5_5_1&&(Z=t.RGB5_A1)}return(Z===t.R16F||Z===t.R32F||Z===t.RG16F||Z===t.RG32F||Z===t.RGBA16F||Z===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function w(A,E){let k;return A?E===null||E===Ui||E===sl?k=t.DEPTH24_STENCIL8:E===Ai?k=t.DEPTH32F_STENCIL8:E===rl&&(k=t.DEPTH24_STENCIL8,ke("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):E===null||E===Ui||E===sl?k=t.DEPTH_COMPONENT24:E===Ai?k=t.DEPTH_COMPONENT32F:E===rl&&(k=t.DEPTH_COMPONENT16),k}function T(A,E){return h(A)===!0||A.isFramebufferTexture&&A.minFilter!==Jt&&A.minFilter!==dn?Math.log2(Math.max(E.width,E.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?E.mipmaps.length:1}function R(A){const E=A.target;E.removeEventListener("dispose",R),C(E),E.isVideoTexture&&u.delete(E),E.isHTMLTexture&&f.delete(E)}function y(A){const E=A.target;E.removeEventListener("dispose",y),P(E)}function C(A){const E=i.get(A);if(E.__webglInit===void 0)return;const k=A.source,q=p.get(k);if(q){const ne=q[E.__cacheKey];ne.usedTimes--,ne.usedTimes===0&&D(A),Object.keys(q).length===0&&p.delete(k)}i.remove(A)}function D(A){const E=i.get(A);t.deleteTexture(E.__webglTexture);const k=A.source,q=p.get(k);delete q[E.__cacheKey],o.memory.textures--}function P(A){const E=i.get(A);if(A.depthTexture&&(A.depthTexture.dispose(),i.remove(A.depthTexture)),A.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(E.__webglFramebuffer[q]))for(let ne=0;ne<E.__webglFramebuffer[q].length;ne++)t.deleteFramebuffer(E.__webglFramebuffer[q][ne]);else t.deleteFramebuffer(E.__webglFramebuffer[q]);E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer[q])}else{if(Array.isArray(E.__webglFramebuffer))for(let q=0;q<E.__webglFramebuffer.length;q++)t.deleteFramebuffer(E.__webglFramebuffer[q]);else t.deleteFramebuffer(E.__webglFramebuffer);if(E.__webglDepthbuffer&&t.deleteRenderbuffer(E.__webglDepthbuffer),E.__webglMultisampledFramebuffer&&t.deleteFramebuffer(E.__webglMultisampledFramebuffer),E.__webglColorRenderbuffer)for(let q=0;q<E.__webglColorRenderbuffer.length;q++)E.__webglColorRenderbuffer[q]&&t.deleteRenderbuffer(E.__webglColorRenderbuffer[q]);E.__webglDepthRenderbuffer&&t.deleteRenderbuffer(E.__webglDepthRenderbuffer)}const k=A.textures;for(let q=0,ne=k.length;q<ne;q++){const se=i.get(k[q]);se.__webglTexture&&(t.deleteTexture(se.__webglTexture),o.memory.textures--),i.remove(k[q])}i.remove(A)}let N=0;function H(){N=0}function V(){return N}function F(A){N=A}function j(){const A=N;return A>=r.maxTextures&&ke("WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),N+=1,A}function B(A){const E=[];return E.push(A.wrapS),E.push(A.wrapT),E.push(A.wrapR||0),E.push(A.magFilter),E.push(A.minFilter),E.push(A.anisotropy),E.push(A.internalFormat),E.push(A.format),E.push(A.type),E.push(A.generateMipmaps),E.push(A.premultiplyAlpha),E.push(A.flipY),E.push(A.unpackAlignment),E.push(A.colorSpace),E.join()}function I(A,E){const k=i.get(A);if(A.isVideoTexture&&at(A),A.isRenderTargetTexture===!1&&A.isExternalTexture!==!0&&A.version>0&&k.__version!==A.version){const q=A.image;if(q===null)ke("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)ke("WebGLRenderer: Texture marked for update but image is incomplete");else{Ae(k,A,E);return}}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);n.bindTexture(t.TEXTURE_2D,k.__webglTexture,t.TEXTURE0+E)}function $(A,E){const k=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){Ae(k,A,E);return}else A.isExternalTexture&&(k.__webglTexture=A.sourceTexture?A.sourceTexture:null);n.bindTexture(t.TEXTURE_2D_ARRAY,k.__webglTexture,t.TEXTURE0+E)}function K(A,E){const k=i.get(A);if(A.isRenderTargetTexture===!1&&A.version>0&&k.__version!==A.version){Ae(k,A,E);return}n.bindTexture(t.TEXTURE_3D,k.__webglTexture,t.TEXTURE0+E)}function ie(A,E){const k=i.get(A);if(A.isCubeDepthTexture!==!0&&A.version>0&&k.__version!==A.version){Ie(k,A,E);return}n.bindTexture(t.TEXTURE_CUBE_MAP,k.__webglTexture,t.TEXTURE0+E)}const fe={[sp]:t.REPEAT,[Xi]:t.CLAMP_TO_EDGE,[op]:t.MIRRORED_REPEAT},Fe={[Jt]:t.NEAREST,[f3]:t.NEAREST_MIPMAP_NEAREST,[$l]:t.NEAREST_MIPMAP_LINEAR,[dn]:t.LINEAR,[Jd]:t.LINEAR_MIPMAP_NEAREST,[hs]:t.LINEAR_MIPMAP_LINEAR},Be={[m3]:t.NEVER,[y3]:t.ALWAYS,[g3]:t.LESS,[wg]:t.LEQUAL,[v3]:t.EQUAL,[bg]:t.GEQUAL,[x3]:t.GREATER,[_3]:t.NOTEQUAL};function Le(A,E){if(E.type===Ai&&e.has("OES_texture_float_linear")===!1&&(E.magFilter===dn||E.magFilter===Jd||E.magFilter===$l||E.magFilter===hs||E.minFilter===dn||E.minFilter===Jd||E.minFilter===$l||E.minFilter===hs)&&ke("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(A,t.TEXTURE_WRAP_S,fe[E.wrapS]),t.texParameteri(A,t.TEXTURE_WRAP_T,fe[E.wrapT]),(A===t.TEXTURE_3D||A===t.TEXTURE_2D_ARRAY)&&t.texParameteri(A,t.TEXTURE_WRAP_R,fe[E.wrapR]),t.texParameteri(A,t.TEXTURE_MAG_FILTER,Fe[E.magFilter]),t.texParameteri(A,t.TEXTURE_MIN_FILTER,Fe[E.minFilter]),E.compareFunction&&(t.texParameteri(A,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(A,t.TEXTURE_COMPARE_FUNC,Be[E.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(E.magFilter===Jt||E.minFilter!==$l&&E.minFilter!==hs||E.type===Ai&&e.has("OES_texture_float_linear")===!1)return;if(E.anisotropy>1||i.get(E).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");t.texParameterf(A,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(E.anisotropy,r.getMaxAnisotropy())),i.get(E).__currentAnisotropy=E.anisotropy}}}function Q(A,E){let k=!1;A.__webglInit===void 0&&(A.__webglInit=!0,E.addEventListener("dispose",R));const q=E.source;let ne=p.get(q);ne===void 0&&(ne={},p.set(q,ne));const se=B(E);if(se!==A.__cacheKey){ne[se]===void 0&&(ne[se]={texture:t.createTexture(),usedTimes:0},o.memory.textures++,k=!0),ne[se].usedTimes++;const he=ne[A.__cacheKey];he!==void 0&&(ne[A.__cacheKey].usedTimes--,he.usedTimes===0&&D(E)),A.__cacheKey=se,A.__webglTexture=ne[se].texture}return k}function le(A,E,k){return Math.floor(Math.floor(A/k)/E)}function ce(A,E,k,q){const se=A.updateRanges;if(se.length===0)n.texSubImage2D(t.TEXTURE_2D,0,0,0,E.width,E.height,k,q,E.data);else{se.sort((Ee,pe)=>Ee.start-pe.start);let he=0;for(let Ee=1;Ee<se.length;Ee++){const pe=se[he],ue=se[Ee],ze=pe.start+pe.count,Xe=le(ue.start,E.width,4),st=le(pe.start,E.width,4);ue.start<=ze+1&&Xe===st&&le(ue.start+ue.count-1,E.width,4)===Xe?pe.count=Math.max(pe.count,ue.start+ue.count-pe.start):(++he,se[he]=ue)}se.length=he+1;const Z=n.getParameter(t.UNPACK_ROW_LENGTH),te=n.getParameter(t.UNPACK_SKIP_PIXELS),_e=n.getParameter(t.UNPACK_SKIP_ROWS);n.pixelStorei(t.UNPACK_ROW_LENGTH,E.width);for(let Ee=0,pe=se.length;Ee<pe;Ee++){const ue=se[Ee],ze=Math.floor(ue.start/4),Xe=Math.ceil(ue.count/4),st=ze%E.width,U=Math.floor(ze/E.width),de=Xe,ee=1;n.pixelStorei(t.UNPACK_SKIP_PIXELS,st),n.pixelStorei(t.UNPACK_SKIP_ROWS,U),n.texSubImage2D(t.TEXTURE_2D,0,st,U,de,ee,k,q,E.data)}A.clearUpdateRanges(),n.pixelStorei(t.UNPACK_ROW_LENGTH,Z),n.pixelStorei(t.UNPACK_SKIP_PIXELS,te),n.pixelStorei(t.UNPACK_SKIP_ROWS,_e)}}function Ae(A,E,k){let q=t.TEXTURE_2D;(E.isDataArrayTexture||E.isCompressedArrayTexture)&&(q=t.TEXTURE_2D_ARRAY),E.isData3DTexture&&(q=t.TEXTURE_3D);const ne=Q(A,E),se=E.source;n.bindTexture(q,A.__webglTexture,t.TEXTURE0+k);const he=i.get(se);if(se.version!==he.__version||ne===!0){if(n.activeTexture(t.TEXTURE0+k),(typeof ImageBitmap<"u"&&E.image instanceof ImageBitmap)===!1){const ee=Je.getPrimaries(Je.workingColorSpace),ye=E.colorSpace===Mr?null:Je.getPrimaries(E.colorSpace),me=E.colorSpace===Mr||ee===ye?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,me)}n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment);let te=g(E.image,!1,r.maxTextureSize);te=ae(E,te);const _e=s.convert(E.format,E.colorSpace),Ee=s.convert(E.type);let pe=M(E.internalFormat,_e,Ee,E.normalized,E.colorSpace,E.isVideoTexture);Le(q,E);let ue;const ze=E.mipmaps,Xe=E.isVideoTexture!==!0,st=he.__version===void 0||ne===!0,U=se.dataReady,de=T(E,te);if(E.isDepthTexture)pe=w(E.format===ps,E.type),st&&(Xe?n.texStorage2D(t.TEXTURE_2D,1,pe,te.width,te.height):n.texImage2D(t.TEXTURE_2D,0,pe,te.width,te.height,0,_e,Ee,null));else if(E.isDataTexture)if(ze.length>0){Xe&&st&&n.texStorage2D(t.TEXTURE_2D,de,pe,ze[0].width,ze[0].height);for(let ee=0,ye=ze.length;ee<ye;ee++)ue=ze[ee],Xe?U&&n.texSubImage2D(t.TEXTURE_2D,ee,0,0,ue.width,ue.height,_e,Ee,ue.data):n.texImage2D(t.TEXTURE_2D,ee,pe,ue.width,ue.height,0,_e,Ee,ue.data);E.generateMipmaps=!1}else Xe?(st&&n.texStorage2D(t.TEXTURE_2D,de,pe,te.width,te.height),U&&ce(E,te,_e,Ee)):n.texImage2D(t.TEXTURE_2D,0,pe,te.width,te.height,0,_e,Ee,te.data);else if(E.isCompressedTexture)if(E.isCompressedArrayTexture){Xe&&st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,pe,ze[0].width,ze[0].height,te.depth);for(let ee=0,ye=ze.length;ee<ye;ee++)if(ue=ze[ee],E.format!==ui)if(_e!==null)if(Xe){if(U)if(E.layerUpdates.size>0){const me=c_(ue.width,ue.height,E.format,E.type);for(const re of E.layerUpdates){const Pe=ue.data.subarray(re*me/ue.data.BYTES_PER_ELEMENT,(re+1)*me/ue.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ee,0,0,re,ue.width,ue.height,1,_e,Pe)}E.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,ee,0,0,0,ue.width,ue.height,te.depth,_e,ue.data)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,ee,pe,ue.width,ue.height,te.depth,0,ue.data,0,0);else ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Xe?U&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,ee,0,0,0,ue.width,ue.height,te.depth,_e,Ee,ue.data):n.texImage3D(t.TEXTURE_2D_ARRAY,ee,pe,ue.width,ue.height,te.depth,0,_e,Ee,ue.data)}else{Xe&&st&&n.texStorage2D(t.TEXTURE_2D,de,pe,ze[0].width,ze[0].height);for(let ee=0,ye=ze.length;ee<ye;ee++)ue=ze[ee],E.format!==ui?_e!==null?Xe?U&&n.compressedTexSubImage2D(t.TEXTURE_2D,ee,0,0,ue.width,ue.height,_e,ue.data):n.compressedTexImage2D(t.TEXTURE_2D,ee,pe,ue.width,ue.height,0,ue.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Xe?U&&n.texSubImage2D(t.TEXTURE_2D,ee,0,0,ue.width,ue.height,_e,Ee,ue.data):n.texImage2D(t.TEXTURE_2D,ee,pe,ue.width,ue.height,0,_e,Ee,ue.data)}else if(E.isDataArrayTexture)if(Xe){if(st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,de,pe,te.width,te.height,te.depth),U)if(E.layerUpdates.size>0){const ee=c_(te.width,te.height,E.format,E.type);for(const ye of E.layerUpdates){const me=te.data.subarray(ye*ee/te.data.BYTES_PER_ELEMENT,(ye+1)*ee/te.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,ye,te.width,te.height,1,_e,Ee,me)}E.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,te.width,te.height,te.depth,_e,Ee,te.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,pe,te.width,te.height,te.depth,0,_e,Ee,te.data);else if(E.isData3DTexture)Xe?(st&&n.texStorage3D(t.TEXTURE_3D,de,pe,te.width,te.height,te.depth),U&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,te.width,te.height,te.depth,_e,Ee,te.data)):n.texImage3D(t.TEXTURE_3D,0,pe,te.width,te.height,te.depth,0,_e,Ee,te.data);else if(E.isFramebufferTexture){if(st)if(Xe)n.texStorage2D(t.TEXTURE_2D,de,pe,te.width,te.height);else{let ee=te.width,ye=te.height;for(let me=0;me<de;me++)n.texImage2D(t.TEXTURE_2D,me,pe,ee,ye,0,_e,Ee,null),ee>>=1,ye>>=1}}else if(E.isHTMLTexture){if("texElementImage2D"in t){const ee=t.canvas;if(ee.hasAttribute("layoutsubtree")||ee.setAttribute("layoutsubtree","true"),te.parentNode!==ee){ee.appendChild(te),f.add(E),ee.onpaint=He=>{const Lt=He.changedElements;for(const ft of f)Lt.includes(ft.image)&&(ft.needsUpdate=!0)},ee.requestPaint();return}const ye=0,me=t.RGBA,re=t.RGBA,Pe=t.UNSIGNED_BYTE;t.texElementImage2D(t.TEXTURE_2D,ye,me,re,Pe,te),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE)}}else if(ze.length>0){if(Xe&&st){const ee=Se(ze[0]);n.texStorage2D(t.TEXTURE_2D,de,pe,ee.width,ee.height)}for(let ee=0,ye=ze.length;ee<ye;ee++)ue=ze[ee],Xe?U&&n.texSubImage2D(t.TEXTURE_2D,ee,0,0,_e,Ee,ue):n.texImage2D(t.TEXTURE_2D,ee,pe,_e,Ee,ue);E.generateMipmaps=!1}else if(Xe){if(st){const ee=Se(te);n.texStorage2D(t.TEXTURE_2D,de,pe,ee.width,ee.height)}U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,_e,Ee,te)}else n.texImage2D(t.TEXTURE_2D,0,pe,_e,Ee,te);h(E)&&m(q),he.__version=se.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function Ie(A,E,k){if(E.image.length!==6)return;const q=Q(A,E),ne=E.source;n.bindTexture(t.TEXTURE_CUBE_MAP,A.__webglTexture,t.TEXTURE0+k);const se=i.get(ne);if(ne.version!==se.__version||q===!0){n.activeTexture(t.TEXTURE0+k);const he=Je.getPrimaries(Je.workingColorSpace),Z=E.colorSpace===Mr?null:Je.getPrimaries(E.colorSpace),te=E.colorSpace===Mr||he===Z?t.NONE:t.BROWSER_DEFAULT_WEBGL;n.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,E.flipY),n.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,E.premultiplyAlpha),n.pixelStorei(t.UNPACK_ALIGNMENT,E.unpackAlignment),n.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,te);const _e=E.isCompressedTexture||E.image[0].isCompressedTexture,Ee=E.image[0]&&E.image[0].isDataTexture,pe=[];for(let re=0;re<6;re++)!_e&&!Ee?pe[re]=g(E.image[re],!0,r.maxCubemapSize):pe[re]=Ee?E.image[re].image:E.image[re],pe[re]=ae(E,pe[re]);const ue=pe[0],ze=s.convert(E.format,E.colorSpace),Xe=s.convert(E.type),st=M(E.internalFormat,ze,Xe,E.normalized,E.colorSpace),U=E.isVideoTexture!==!0,de=se.__version===void 0||q===!0,ee=ne.dataReady;let ye=T(E,ue);Le(t.TEXTURE_CUBE_MAP,E);let me;if(_e){U&&de&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ye,st,ue.width,ue.height);for(let re=0;re<6;re++){me=pe[re].mipmaps;for(let Pe=0;Pe<me.length;Pe++){const He=me[Pe];E.format!==ui?ze!==null?U?ee&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,0,0,He.width,He.height,ze,He.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,st,He.width,He.height,0,He.data):ke("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):U?ee&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,0,0,He.width,He.height,ze,Xe,He.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe,st,He.width,He.height,0,ze,Xe,He.data)}}}else{if(me=E.mipmaps,U&&de){me.length>0&&ye++;const re=Se(pe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ye,st,re.width,re.height)}for(let re=0;re<6;re++)if(Ee){U?ee&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,pe[re].width,pe[re].height,ze,Xe,pe[re].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,st,pe[re].width,pe[re].height,0,ze,Xe,pe[re].data);for(let Pe=0;Pe<me.length;Pe++){const Lt=me[Pe].image[re].image;U?ee&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,0,0,Lt.width,Lt.height,ze,Xe,Lt.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,st,Lt.width,Lt.height,0,ze,Xe,Lt.data)}}else{U?ee&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,0,0,ze,Xe,pe[re]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,0,st,ze,Xe,pe[re]);for(let Pe=0;Pe<me.length;Pe++){const He=me[Pe];U?ee&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,0,0,ze,Xe,He.image[re]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+re,Pe+1,st,ze,Xe,He.image[re])}}}h(E)&&m(t.TEXTURE_CUBE_MAP),se.__version=ne.version,E.onUpdate&&E.onUpdate(E)}A.__version=E.version}function Re(A,E,k,q,ne,se){const he=s.convert(k.format,k.colorSpace),Z=s.convert(k.type),te=M(k.internalFormat,he,Z,k.normalized,k.colorSpace),_e=i.get(E),Ee=i.get(k);if(Ee.__renderTarget=E,!_e.__hasExternalTextures){const pe=Math.max(1,E.width>>se),ue=Math.max(1,E.height>>se);ne===t.TEXTURE_3D||ne===t.TEXTURE_2D_ARRAY?n.texImage3D(ne,se,te,pe,ue,E.depth,0,he,Z,null):n.texImage2D(ne,se,te,pe,ue,0,he,Z,null)}n.bindFramebuffer(t.FRAMEBUFFER,A),Ye(E)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,q,ne,Ee.__webglTexture,0,xt(E)):(ne===t.TEXTURE_2D||ne>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ne<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,q,ne,Ee.__webglTexture,se),n.bindFramebuffer(t.FRAMEBUFFER,null)}function et(A,E,k){if(t.bindRenderbuffer(t.RENDERBUFFER,A),E.depthBuffer){const q=E.depthTexture,ne=q&&q.isDepthTexture?q.type:null,se=w(E.stencilBuffer,ne),he=E.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;Ye(E)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,xt(E),se,E.width,E.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,xt(E),se,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,se,E.width,E.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,he,t.RENDERBUFFER,A)}else{const q=E.textures;for(let ne=0;ne<q.length;ne++){const se=q[ne],he=s.convert(se.format,se.colorSpace),Z=s.convert(se.type),te=M(se.internalFormat,he,Z,se.normalized,se.colorSpace);Ye(E)?a.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,xt(E),te,E.width,E.height):k?t.renderbufferStorageMultisample(t.RENDERBUFFER,xt(E),te,E.width,E.height):t.renderbufferStorage(t.RENDERBUFFER,te,E.width,E.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function Oe(A,E,k){const q=E.isWebGLCubeRenderTarget===!0;if(n.bindFramebuffer(t.FRAMEBUFFER,A),!(E.depthTexture&&E.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const ne=i.get(E.depthTexture);if(ne.__renderTarget=E,(!ne.__webglTexture||E.depthTexture.image.width!==E.width||E.depthTexture.image.height!==E.height)&&(E.depthTexture.image.width=E.width,E.depthTexture.image.height=E.height,E.depthTexture.needsUpdate=!0),q){if(ne.__webglInit===void 0&&(ne.__webglInit=!0,E.depthTexture.addEventListener("dispose",R)),ne.__webglTexture===void 0){ne.__webglTexture=t.createTexture(),n.bindTexture(t.TEXTURE_CUBE_MAP,ne.__webglTexture),Le(t.TEXTURE_CUBE_MAP,E.depthTexture);const _e=s.convert(E.depthTexture.format),Ee=s.convert(E.depthTexture.type);let pe;E.depthTexture.format===sr?pe=t.DEPTH_COMPONENT24:E.depthTexture.format===ps&&(pe=t.DEPTH24_STENCIL8);for(let ue=0;ue<6;ue++)t.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ue,0,pe,E.width,E.height,0,_e,Ee,null)}}else I(E.depthTexture,0);const se=ne.__webglTexture,he=xt(E),Z=q?t.TEXTURE_CUBE_MAP_POSITIVE_X+k:t.TEXTURE_2D,te=E.depthTexture.format===ps?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;if(E.depthTexture.format===sr)Ye(E)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,te,Z,se,0,he):t.framebufferTexture2D(t.FRAMEBUFFER,te,Z,se,0);else if(E.depthTexture.format===ps)Ye(E)?a.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,te,Z,se,0,he):t.framebufferTexture2D(t.FRAMEBUFFER,te,Z,se,0);else throw new Error("Unknown depthTexture format")}function tt(A){const E=i.get(A),k=A.isWebGLCubeRenderTarget===!0;if(E.__boundDepthTexture!==A.depthTexture){const q=A.depthTexture;if(E.__depthDisposeCallback&&E.__depthDisposeCallback(),q){const ne=()=>{delete E.__boundDepthTexture,delete E.__depthDisposeCallback,q.removeEventListener("dispose",ne)};q.addEventListener("dispose",ne),E.__depthDisposeCallback=ne}E.__boundDepthTexture=q}if(A.depthTexture&&!E.__autoAllocateDepthBuffer)if(k)for(let q=0;q<6;q++)Oe(E.__webglFramebuffer[q],A,q);else{const q=A.texture.mipmaps;q&&q.length>0?Oe(E.__webglFramebuffer[0],A,0):Oe(E.__webglFramebuffer,A,0)}else if(k){E.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[q]),E.__webglDepthbuffer[q]===void 0)E.__webglDepthbuffer[q]=t.createRenderbuffer(),et(E.__webglDepthbuffer[q],A,!1);else{const ne=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=E.__webglDepthbuffer[q];t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,ne,t.RENDERBUFFER,se)}}else{const q=A.texture.mipmaps;if(q&&q.length>0?n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer[0]):n.bindFramebuffer(t.FRAMEBUFFER,E.__webglFramebuffer),E.__webglDepthbuffer===void 0)E.__webglDepthbuffer=t.createRenderbuffer(),et(E.__webglDepthbuffer,A,!1);else{const ne=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,se=E.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,se),t.framebufferRenderbuffer(t.FRAMEBUFFER,ne,t.RENDERBUFFER,se)}}n.bindFramebuffer(t.FRAMEBUFFER,null)}function J(A,E,k){const q=i.get(A);E!==void 0&&Re(q.__webglFramebuffer,A,A.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),k!==void 0&&tt(A)}function be(A){const E=A.texture,k=i.get(A),q=i.get(E);A.addEventListener("dispose",y);const ne=A.textures,se=A.isWebGLCubeRenderTarget===!0,he=ne.length>1;if(he||(q.__webglTexture===void 0&&(q.__webglTexture=t.createTexture()),q.__version=E.version,o.memory.textures++),se){k.__webglFramebuffer=[];for(let Z=0;Z<6;Z++)if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer[Z]=[];for(let te=0;te<E.mipmaps.length;te++)k.__webglFramebuffer[Z][te]=t.createFramebuffer()}else k.__webglFramebuffer[Z]=t.createFramebuffer()}else{if(E.mipmaps&&E.mipmaps.length>0){k.__webglFramebuffer=[];for(let Z=0;Z<E.mipmaps.length;Z++)k.__webglFramebuffer[Z]=t.createFramebuffer()}else k.__webglFramebuffer=t.createFramebuffer();if(he)for(let Z=0,te=ne.length;Z<te;Z++){const _e=i.get(ne[Z]);_e.__webglTexture===void 0&&(_e.__webglTexture=t.createTexture(),o.memory.textures++)}if(A.samples>0&&Ye(A)===!1){k.__webglMultisampledFramebuffer=t.createFramebuffer(),k.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let Z=0;Z<ne.length;Z++){const te=ne[Z];k.__webglColorRenderbuffer[Z]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,k.__webglColorRenderbuffer[Z]);const _e=s.convert(te.format,te.colorSpace),Ee=s.convert(te.type),pe=M(te.internalFormat,_e,Ee,te.normalized,te.colorSpace,A.isXRRenderTarget===!0),ue=xt(A);t.renderbufferStorageMultisample(t.RENDERBUFFER,ue,pe,A.width,A.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Z,t.RENDERBUFFER,k.__webglColorRenderbuffer[Z])}t.bindRenderbuffer(t.RENDERBUFFER,null),A.depthBuffer&&(k.__webglDepthRenderbuffer=t.createRenderbuffer(),et(k.__webglDepthRenderbuffer,A,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(se){n.bindTexture(t.TEXTURE_CUBE_MAP,q.__webglTexture),Le(t.TEXTURE_CUBE_MAP,E);for(let Z=0;Z<6;Z++)if(E.mipmaps&&E.mipmaps.length>0)for(let te=0;te<E.mipmaps.length;te++)Re(k.__webglFramebuffer[Z][te],A,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,te);else Re(k.__webglFramebuffer[Z],A,E,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0);h(E)&&m(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(he){for(let Z=0,te=ne.length;Z<te;Z++){const _e=ne[Z],Ee=i.get(_e);let pe=t.TEXTURE_2D;(A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(pe=A.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(pe,Ee.__webglTexture),Le(pe,_e),Re(k.__webglFramebuffer,A,_e,t.COLOR_ATTACHMENT0+Z,pe,0),h(_e)&&m(pe)}n.unbindTexture()}else{let Z=t.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(Z=A.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(Z,q.__webglTexture),Le(Z,E),E.mipmaps&&E.mipmaps.length>0)for(let te=0;te<E.mipmaps.length;te++)Re(k.__webglFramebuffer[te],A,E,t.COLOR_ATTACHMENT0,Z,te);else Re(k.__webglFramebuffer,A,E,t.COLOR_ATTACHMENT0,Z,0);h(E)&&m(Z),n.unbindTexture()}A.depthBuffer&&tt(A)}function Ve(A){const E=A.textures;for(let k=0,q=E.length;k<q;k++){const ne=E[k];if(h(ne)){const se=_(A),he=i.get(ne).__webglTexture;n.bindTexture(se,he),m(se),n.unbindTexture()}}}const $e=[],vt=[];function O(A){if(A.samples>0){if(Ye(A)===!1){const E=A.textures,k=A.width,q=A.height;let ne=t.COLOR_BUFFER_BIT;const se=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,he=i.get(A),Z=E.length>1;if(Z)for(let _e=0;_e<E.length;_e++)n.bindFramebuffer(t.FRAMEBUFFER,he.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,he.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,he.__webglMultisampledFramebuffer);const te=A.texture.mipmaps;te&&te.length>0?n.bindFramebuffer(t.DRAW_FRAMEBUFFER,he.__webglFramebuffer[0]):n.bindFramebuffer(t.DRAW_FRAMEBUFFER,he.__webglFramebuffer);for(let _e=0;_e<E.length;_e++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ne|=t.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ne|=t.STENCIL_BUFFER_BIT)),Z){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,he.__webglColorRenderbuffer[_e]);const Ee=i.get(E[_e]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ee,0)}t.blitFramebuffer(0,0,k,q,0,0,k,q,ne,t.NEAREST),l===!0&&($e.length=0,vt.length=0,$e.push(t.COLOR_ATTACHMENT0+_e),A.depthBuffer&&A.resolveDepthBuffer===!1&&($e.push(se),vt.push(se),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,vt)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,$e))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),Z)for(let _e=0;_e<E.length;_e++){n.bindFramebuffer(t.FRAMEBUFFER,he.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.RENDERBUFFER,he.__webglColorRenderbuffer[_e]);const Ee=i.get(E[_e]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,he.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+_e,t.TEXTURE_2D,Ee,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,he.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&l){const E=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[E])}}}function xt(A){return Math.min(r.maxSamples,A.samples)}function Ye(A){const E=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&E.__useRenderToTexture!==!1}function at(A){const E=o.render.frame;u.get(A)!==E&&(u.set(A,E),A.update())}function ae(A,E){const k=A.colorSpace,q=A.format,ne=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||k!==Cu&&k!==Mr&&(Je.getTransfer(k)===lt?(q!==ui||ne!==Ln)&&ke("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):it("WebGLTextures: Unsupported texture color space:",k)),E}function Se(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(c.width=A.naturalWidth||A.width,c.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(c.width=A.displayWidth,c.height=A.displayHeight):(c.width=A.width,c.height=A.height),c}this.allocateTextureUnit=j,this.resetTextureUnits=H,this.getTextureUnits=V,this.setTextureUnits=F,this.setTexture2D=I,this.setTexture2DArray=$,this.setTexture3D=K,this.setTextureCube=ie,this.rebindTextures=J,this.setupRenderTarget=be,this.updateRenderTargetMipmap=Ve,this.updateMultisampleRenderTarget=O,this.setupDepthRenderbuffer=tt,this.setupFrameBufferTexture=Re,this.useMultisampledRTT=Ye,this.isReversedDepthBuffer=function(){return n.buffers.depth.getReversed()}}function yU(t,e){function n(i,r=Mr){let s;const o=Je.getTransfer(r);if(i===Ln)return t.UNSIGNED_BYTE;if(i===yg)return t.UNSIGNED_SHORT_4_4_4_4;if(i===Sg)return t.UNSIGNED_SHORT_5_5_5_1;if(i===Z1)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===Q1)return t.UNSIGNED_INT_10F_11F_11F_REV;if(i===K1)return t.BYTE;if(i===q1)return t.SHORT;if(i===rl)return t.UNSIGNED_SHORT;if(i===_g)return t.INT;if(i===Ui)return t.UNSIGNED_INT;if(i===Ai)return t.FLOAT;if(i===rr)return t.HALF_FLOAT;if(i===J1)return t.ALPHA;if(i===eE)return t.RGB;if(i===ui)return t.RGBA;if(i===sr)return t.DEPTH_COMPONENT;if(i===ps)return t.DEPTH_STENCIL;if(i===tE)return t.RED;if(i===Mg)return t.RED_INTEGER;if(i===bs)return t.RG;if(i===Eg)return t.RG_INTEGER;if(i===Tg)return t.RGBA_INTEGER;if(i===Gc||i===Hc||i===jc||i===Wc)if(o===lt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===Gc)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===Hc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===jc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===Wc)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===Gc)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===Hc)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===jc)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===Wc)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===ap||i===lp||i===cp||i===up)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===ap)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===lp)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===cp)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===up)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===dp||i===fp||i===hp||i===pp||i===mp||i===bu||i===gp)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===dp||i===fp)return o===lt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===hp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(i===pp)return s.COMPRESSED_R11_EAC;if(i===mp)return s.COMPRESSED_SIGNED_R11_EAC;if(i===bu)return s.COMPRESSED_RG11_EAC;if(i===gp)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(i===vp||i===xp||i===_p||i===yp||i===Sp||i===Mp||i===Ep||i===Tp||i===wp||i===bp||i===Ap||i===Cp||i===Rp||i===Pp)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===vp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===xp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===_p)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===yp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Sp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Mp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Ep)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Tp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===wp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===bp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===Ap)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Cp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Rp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Pp)return o===lt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===Dp||i===Np||i===Lp)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===Dp)return o===lt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Np)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Lp)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===Ip||i===Up||i===Au||i===Fp)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===Ip)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Up)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===Au)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===Fp)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===sl?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}const SU=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,MU=`
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

}`;class EU{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n){if(this.texture===null){const i=new cE(e.texture);(e.depthNear!==n.depthNear||e.depthFar!==n.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=i}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new mi({vertexShader:SU,fragmentShader:MU,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new ei(new yl(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class TU extends Ps{constructor(e,n){super();const i=this;let r=null,s=1,o=null,a="local-floor",l=1,c=null,u=null,f=null,d=null,p=null,v=null;const S=typeof XRWebGLBinding<"u",g=new EU,h={},m=n.getContextAttributes();let _=null,M=null;const w=[],T=[],R=new Qe;let y=null;const C=new Yn;C.viewport=new gt;const D=new Yn;D.viewport=new gt;const P=[C,D],N=new P2;let H=null,V=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Q){let le=w[Q];return le===void 0&&(le=new of,w[Q]=le),le.getTargetRaySpace()},this.getControllerGrip=function(Q){let le=w[Q];return le===void 0&&(le=new of,w[Q]=le),le.getGripSpace()},this.getHand=function(Q){let le=w[Q];return le===void 0&&(le=new of,w[Q]=le),le.getHandSpace()};function F(Q){const le=T.indexOf(Q.inputSource);if(le===-1)return;const ce=w[le];ce!==void 0&&(ce.update(Q.inputSource,Q.frame,c||o),ce.dispatchEvent({type:Q.type,data:Q.inputSource}))}function j(){r.removeEventListener("select",F),r.removeEventListener("selectstart",F),r.removeEventListener("selectend",F),r.removeEventListener("squeeze",F),r.removeEventListener("squeezestart",F),r.removeEventListener("squeezeend",F),r.removeEventListener("end",j),r.removeEventListener("inputsourceschange",B);for(let Q=0;Q<w.length;Q++){const le=T[Q];le!==null&&(T[Q]=null,w[Q].disconnect(le))}H=null,V=null,g.reset();for(const Q in h)delete h[Q];e.setRenderTarget(_),p=null,d=null,f=null,r=null,M=null,Le.stop(),i.isPresenting=!1,e.setPixelRatio(y),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Q){s=Q,i.isPresenting===!0&&ke("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Q){a=Q,i.isPresenting===!0&&ke("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(Q){c=Q},this.getBaseLayer=function(){return d!==null?d:p},this.getBinding=function(){return f===null&&S&&(f=new XRWebGLBinding(r,n)),f},this.getFrame=function(){return v},this.getSession=function(){return r},this.setSession=async function(Q){if(r=Q,r!==null){if(_=e.getRenderTarget(),r.addEventListener("select",F),r.addEventListener("selectstart",F),r.addEventListener("selectend",F),r.addEventListener("squeeze",F),r.addEventListener("squeezestart",F),r.addEventListener("squeezeend",F),r.addEventListener("end",j),r.addEventListener("inputsourceschange",B),m.xrCompatible!==!0&&await n.makeXRCompatible(),y=e.getPixelRatio(),e.getSize(R),S&&"createProjectionLayer"in XRWebGLBinding.prototype){let ce=null,Ae=null,Ie=null;m.depth&&(Ie=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,ce=m.stencil?ps:sr,Ae=m.stencil?sl:Ui);const Re={colorFormat:n.RGBA8,depthFormat:Ie,scaleFactor:s};f=this.getBinding(),d=f.createProjectionLayer(Re),r.updateRenderState({layers:[d]}),e.setPixelRatio(1),e.setSize(d.textureWidth,d.textureHeight,!1),M=new Ii(d.textureWidth,d.textureHeight,{format:ui,type:Ln,depthTexture:new Oo(d.textureWidth,d.textureHeight,Ae,void 0,void 0,void 0,void 0,void 0,void 0,ce),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1})}else{const ce={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};p=new XRWebGLLayer(r,n,ce),r.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),M=new Ii(p.framebufferWidth,p.framebufferHeight,{format:ui,type:Ln,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await r.requestReferenceSpace(a),Le.setContext(r),Le.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return g.getDepthTexture()};function B(Q){for(let le=0;le<Q.removed.length;le++){const ce=Q.removed[le],Ae=T.indexOf(ce);Ae>=0&&(T[Ae]=null,w[Ae].disconnect(ce))}for(let le=0;le<Q.added.length;le++){const ce=Q.added[le];let Ae=T.indexOf(ce);if(Ae===-1){for(let Re=0;Re<w.length;Re++)if(Re>=T.length){T.push(ce),Ae=Re;break}else if(T[Re]===null){T[Re]=ce,Ae=Re;break}if(Ae===-1)break}const Ie=w[Ae];Ie&&Ie.connect(ce)}}const I=new L,$=new L;function K(Q,le,ce){I.setFromMatrixPosition(le.matrixWorld),$.setFromMatrixPosition(ce.matrixWorld);const Ae=I.distanceTo($),Ie=le.projectionMatrix.elements,Re=ce.projectionMatrix.elements,et=Ie[14]/(Ie[10]-1),Oe=Ie[14]/(Ie[10]+1),tt=(Ie[9]+1)/Ie[5],J=(Ie[9]-1)/Ie[5],be=(Ie[8]-1)/Ie[0],Ve=(Re[8]+1)/Re[0],$e=et*be,vt=et*Ve,O=Ae/(-be+Ve),xt=O*-be;if(le.matrixWorld.decompose(Q.position,Q.quaternion,Q.scale),Q.translateX(xt),Q.translateZ(O),Q.matrixWorld.compose(Q.position,Q.quaternion,Q.scale),Q.matrixWorldInverse.copy(Q.matrixWorld).invert(),Ie[10]===-1)Q.projectionMatrix.copy(le.projectionMatrix),Q.projectionMatrixInverse.copy(le.projectionMatrixInverse);else{const Ye=et+O,at=Oe+O,ae=$e-xt,Se=vt+(Ae-xt),A=tt*Oe/at*Ye,E=J*Oe/at*Ye;Q.projectionMatrix.makePerspective(ae,Se,A,E,Ye,at),Q.projectionMatrixInverse.copy(Q.projectionMatrix).invert()}}function ie(Q,le){le===null?Q.matrixWorld.copy(Q.matrix):Q.matrixWorld.multiplyMatrices(le.matrixWorld,Q.matrix),Q.matrixWorldInverse.copy(Q.matrixWorld).invert()}this.updateCamera=function(Q){if(r===null)return;let le=Q.near,ce=Q.far;g.texture!==null&&(g.depthNear>0&&(le=g.depthNear),g.depthFar>0&&(ce=g.depthFar)),N.near=D.near=C.near=le,N.far=D.far=C.far=ce,(H!==N.near||V!==N.far)&&(r.updateRenderState({depthNear:N.near,depthFar:N.far}),H=N.near,V=N.far),N.layers.mask=Q.layers.mask|6,C.layers.mask=N.layers.mask&-5,D.layers.mask=N.layers.mask&-3;const Ae=Q.parent,Ie=N.cameras;ie(N,Ae);for(let Re=0;Re<Ie.length;Re++)ie(Ie[Re],Ae);Ie.length===2?K(N,C,D):N.projectionMatrix.copy(C.projectionMatrix),fe(Q,N,Ae)};function fe(Q,le,ce){ce===null?Q.matrix.copy(le.matrixWorld):(Q.matrix.copy(ce.matrixWorld),Q.matrix.invert(),Q.matrix.multiply(le.matrixWorld)),Q.matrix.decompose(Q.position,Q.quaternion,Q.scale),Q.updateMatrixWorld(!0),Q.projectionMatrix.copy(le.projectionMatrix),Q.projectionMatrixInverse.copy(le.projectionMatrixInverse),Q.isPerspectiveCamera&&(Q.fov=al*2*Math.atan(1/Q.projectionMatrix.elements[5]),Q.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(d===null&&p===null))return l},this.setFoveation=function(Q){l=Q,d!==null&&(d.fixedFoveation=Q),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=Q)},this.hasDepthSensing=function(){return g.texture!==null},this.getDepthSensingMesh=function(){return g.getMesh(N)},this.getCameraTexture=function(Q){return h[Q]};let Fe=null;function Be(Q,le){if(u=le.getViewerPose(c||o),v=le,u!==null){const ce=u.views;p!==null&&(e.setRenderTargetFramebuffer(M,p.framebuffer),e.setRenderTarget(M));let Ae=!1;ce.length!==N.cameras.length&&(N.cameras.length=0,Ae=!0);for(let Oe=0;Oe<ce.length;Oe++){const tt=ce[Oe];let J=null;if(p!==null)J=p.getViewport(tt);else{const Ve=f.getViewSubImage(d,tt);J=Ve.viewport,Oe===0&&(e.setRenderTargetTextures(M,Ve.colorTexture,Ve.depthStencilTexture),e.setRenderTarget(M))}let be=P[Oe];be===void 0&&(be=new Yn,be.layers.enable(Oe),be.viewport=new gt,P[Oe]=be),be.matrix.fromArray(tt.transform.matrix),be.matrix.decompose(be.position,be.quaternion,be.scale),be.projectionMatrix.fromArray(tt.projectionMatrix),be.projectionMatrixInverse.copy(be.projectionMatrix).invert(),be.viewport.set(J.x,J.y,J.width,J.height),Oe===0&&(N.matrix.copy(be.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ae===!0&&N.cameras.push(be)}const Ie=r.enabledFeatures;if(Ie&&Ie.includes("depth-sensing")&&r.depthUsage=="gpu-optimized"&&S){f=i.getBinding();const Oe=f.getDepthInformation(ce[0]);Oe&&Oe.isValid&&Oe.texture&&g.init(Oe,r.renderState)}if(Ie&&Ie.includes("camera-access")&&S){e.state.unbindTexture(),f=i.getBinding();for(let Oe=0;Oe<ce.length;Oe++){const tt=ce[Oe].camera;if(tt){let J=h[tt];J||(J=new cE,h[tt]=J);const be=f.getCameraImage(tt);J.sourceTexture=be}}}}for(let ce=0;ce<w.length;ce++){const Ae=T[ce],Ie=w[ce];Ae!==null&&Ie!==void 0&&Ie.update(Ae,le,c||o)}Fe&&Fe(Q,le),le.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:le}),v=null}const Le=new hE;Le.setAnimationLoop(Be),this.setAnimationLoop=function(Q){Fe=Q},this.dispose=function(){}}}const wU=new Nt,yE=new Ge;yE.set(-1,0,0,0,1,0,0,0,1);function bU(t,e){function n(g,h){g.matrixAutoUpdate===!0&&g.updateMatrix(),h.value.copy(g.matrix)}function i(g,h){h.color.getRGB(g.fogColor.value,uE(t)),h.isFog?(g.fogNear.value=h.near,g.fogFar.value=h.far):h.isFogExp2&&(g.fogDensity.value=h.density)}function r(g,h,m,_,M){h.isNodeMaterial?h.uniformsNeedUpdate=!1:h.isMeshBasicMaterial?s(g,h):h.isMeshLambertMaterial?(s(g,h),h.envMap&&(g.envMapIntensity.value=h.envMapIntensity)):h.isMeshToonMaterial?(s(g,h),f(g,h)):h.isMeshPhongMaterial?(s(g,h),u(g,h),h.envMap&&(g.envMapIntensity.value=h.envMapIntensity)):h.isMeshStandardMaterial?(s(g,h),d(g,h),h.isMeshPhysicalMaterial&&p(g,h,M)):h.isMeshMatcapMaterial?(s(g,h),v(g,h)):h.isMeshDepthMaterial?s(g,h):h.isMeshDistanceMaterial?(s(g,h),S(g,h)):h.isMeshNormalMaterial?s(g,h):h.isLineBasicMaterial?(o(g,h),h.isLineDashedMaterial&&a(g,h)):h.isPointsMaterial?l(g,h,m,_):h.isSpriteMaterial?c(g,h):h.isShadowMaterial?(g.color.value.copy(h.color),g.opacity.value=h.opacity):h.isShaderMaterial&&(h.uniformsNeedUpdate=!1)}function s(g,h){g.opacity.value=h.opacity,h.color&&g.diffuse.value.copy(h.color),h.emissive&&g.emissive.value.copy(h.emissive).multiplyScalar(h.emissiveIntensity),h.map&&(g.map.value=h.map,n(h.map,g.mapTransform)),h.alphaMap&&(g.alphaMap.value=h.alphaMap,n(h.alphaMap,g.alphaMapTransform)),h.bumpMap&&(g.bumpMap.value=h.bumpMap,n(h.bumpMap,g.bumpMapTransform),g.bumpScale.value=h.bumpScale,h.side===An&&(g.bumpScale.value*=-1)),h.normalMap&&(g.normalMap.value=h.normalMap,n(h.normalMap,g.normalMapTransform),g.normalScale.value.copy(h.normalScale),h.side===An&&g.normalScale.value.negate()),h.displacementMap&&(g.displacementMap.value=h.displacementMap,n(h.displacementMap,g.displacementMapTransform),g.displacementScale.value=h.displacementScale,g.displacementBias.value=h.displacementBias),h.emissiveMap&&(g.emissiveMap.value=h.emissiveMap,n(h.emissiveMap,g.emissiveMapTransform)),h.specularMap&&(g.specularMap.value=h.specularMap,n(h.specularMap,g.specularMapTransform)),h.alphaTest>0&&(g.alphaTest.value=h.alphaTest);const m=e.get(h),_=m.envMap,M=m.envMapRotation;_&&(g.envMap.value=_,g.envMapRotation.value.setFromMatrix4(wU.makeRotationFromEuler(M)).transpose(),_.isCubeTexture&&_.isRenderTargetTexture===!1&&g.envMapRotation.value.premultiply(yE),g.reflectivity.value=h.reflectivity,g.ior.value=h.ior,g.refractionRatio.value=h.refractionRatio),h.lightMap&&(g.lightMap.value=h.lightMap,g.lightMapIntensity.value=h.lightMapIntensity,n(h.lightMap,g.lightMapTransform)),h.aoMap&&(g.aoMap.value=h.aoMap,g.aoMapIntensity.value=h.aoMapIntensity,n(h.aoMap,g.aoMapTransform))}function o(g,h){g.diffuse.value.copy(h.color),g.opacity.value=h.opacity,h.map&&(g.map.value=h.map,n(h.map,g.mapTransform))}function a(g,h){g.dashSize.value=h.dashSize,g.totalSize.value=h.dashSize+h.gapSize,g.scale.value=h.scale}function l(g,h,m,_){g.diffuse.value.copy(h.color),g.opacity.value=h.opacity,g.size.value=h.size*m,g.scale.value=_*.5,h.map&&(g.map.value=h.map,n(h.map,g.uvTransform)),h.alphaMap&&(g.alphaMap.value=h.alphaMap,n(h.alphaMap,g.alphaMapTransform)),h.alphaTest>0&&(g.alphaTest.value=h.alphaTest)}function c(g,h){g.diffuse.value.copy(h.color),g.opacity.value=h.opacity,g.rotation.value=h.rotation,h.map&&(g.map.value=h.map,n(h.map,g.mapTransform)),h.alphaMap&&(g.alphaMap.value=h.alphaMap,n(h.alphaMap,g.alphaMapTransform)),h.alphaTest>0&&(g.alphaTest.value=h.alphaTest)}function u(g,h){g.specular.value.copy(h.specular),g.shininess.value=Math.max(h.shininess,1e-4)}function f(g,h){h.gradientMap&&(g.gradientMap.value=h.gradientMap)}function d(g,h){g.metalness.value=h.metalness,h.metalnessMap&&(g.metalnessMap.value=h.metalnessMap,n(h.metalnessMap,g.metalnessMapTransform)),g.roughness.value=h.roughness,h.roughnessMap&&(g.roughnessMap.value=h.roughnessMap,n(h.roughnessMap,g.roughnessMapTransform)),h.envMap&&(g.envMapIntensity.value=h.envMapIntensity)}function p(g,h,m){g.ior.value=h.ior,h.sheen>0&&(g.sheenColor.value.copy(h.sheenColor).multiplyScalar(h.sheen),g.sheenRoughness.value=h.sheenRoughness,h.sheenColorMap&&(g.sheenColorMap.value=h.sheenColorMap,n(h.sheenColorMap,g.sheenColorMapTransform)),h.sheenRoughnessMap&&(g.sheenRoughnessMap.value=h.sheenRoughnessMap,n(h.sheenRoughnessMap,g.sheenRoughnessMapTransform))),h.clearcoat>0&&(g.clearcoat.value=h.clearcoat,g.clearcoatRoughness.value=h.clearcoatRoughness,h.clearcoatMap&&(g.clearcoatMap.value=h.clearcoatMap,n(h.clearcoatMap,g.clearcoatMapTransform)),h.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=h.clearcoatRoughnessMap,n(h.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),h.clearcoatNormalMap&&(g.clearcoatNormalMap.value=h.clearcoatNormalMap,n(h.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(h.clearcoatNormalScale),h.side===An&&g.clearcoatNormalScale.value.negate())),h.dispersion>0&&(g.dispersion.value=h.dispersion),h.iridescence>0&&(g.iridescence.value=h.iridescence,g.iridescenceIOR.value=h.iridescenceIOR,g.iridescenceThicknessMinimum.value=h.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=h.iridescenceThicknessRange[1],h.iridescenceMap&&(g.iridescenceMap.value=h.iridescenceMap,n(h.iridescenceMap,g.iridescenceMapTransform)),h.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=h.iridescenceThicknessMap,n(h.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),h.transmission>0&&(g.transmission.value=h.transmission,g.transmissionSamplerMap.value=m.texture,g.transmissionSamplerSize.value.set(m.width,m.height),h.transmissionMap&&(g.transmissionMap.value=h.transmissionMap,n(h.transmissionMap,g.transmissionMapTransform)),g.thickness.value=h.thickness,h.thicknessMap&&(g.thicknessMap.value=h.thicknessMap,n(h.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=h.attenuationDistance,g.attenuationColor.value.copy(h.attenuationColor)),h.anisotropy>0&&(g.anisotropyVector.value.set(h.anisotropy*Math.cos(h.anisotropyRotation),h.anisotropy*Math.sin(h.anisotropyRotation)),h.anisotropyMap&&(g.anisotropyMap.value=h.anisotropyMap,n(h.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=h.specularIntensity,g.specularColor.value.copy(h.specularColor),h.specularColorMap&&(g.specularColorMap.value=h.specularColorMap,n(h.specularColorMap,g.specularColorMapTransform)),h.specularIntensityMap&&(g.specularIntensityMap.value=h.specularIntensityMap,n(h.specularIntensityMap,g.specularIntensityMapTransform))}function v(g,h){h.matcap&&(g.matcap.value=h.matcap)}function S(g,h){const m=e.get(h).light;g.referencePosition.value.setFromMatrixPosition(m.matrixWorld),g.nearDistance.value=m.shadow.camera.near,g.farDistance.value=m.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function AU(t,e,n,i){let r={},s={},o=[];const a=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(m,_){const M=_.program;i.uniformBlockBinding(m,M)}function c(m,_){let M=r[m.id];M===void 0&&(v(m),M=u(m),r[m.id]=M,m.addEventListener("dispose",g));const w=_.program;i.updateUBOMapping(m,w);const T=e.render.frame;s[m.id]!==T&&(d(m),s[m.id]=T)}function u(m){const _=f();m.__bindingPointIndex=_;const M=t.createBuffer(),w=m.__size,T=m.usage;return t.bindBuffer(t.UNIFORM_BUFFER,M),t.bufferData(t.UNIFORM_BUFFER,w,T),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,_,M),M}function f(){for(let m=0;m<a;m++)if(o.indexOf(m)===-1)return o.push(m),m;return it("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function d(m){const _=r[m.id],M=m.uniforms,w=m.__cache;t.bindBuffer(t.UNIFORM_BUFFER,_);for(let T=0,R=M.length;T<R;T++){const y=Array.isArray(M[T])?M[T]:[M[T]];for(let C=0,D=y.length;C<D;C++){const P=y[C];if(p(P,T,C,w)===!0){const N=P.__offset,H=Array.isArray(P.value)?P.value:[P.value];let V=0;for(let F=0;F<H.length;F++){const j=H[F],B=S(j);typeof j=="number"||typeof j=="boolean"?(P.__data[0]=j,t.bufferSubData(t.UNIFORM_BUFFER,N+V,P.__data)):j.isMatrix3?(P.__data[0]=j.elements[0],P.__data[1]=j.elements[1],P.__data[2]=j.elements[2],P.__data[3]=0,P.__data[4]=j.elements[3],P.__data[5]=j.elements[4],P.__data[6]=j.elements[5],P.__data[7]=0,P.__data[8]=j.elements[6],P.__data[9]=j.elements[7],P.__data[10]=j.elements[8],P.__data[11]=0):ArrayBuffer.isView(j)?P.__data.set(new j.constructor(j.buffer,j.byteOffset,P.__data.length)):(j.toArray(P.__data,V),V+=B.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,N,P.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function p(m,_,M,w){const T=m.value,R=_+"_"+M;if(w[R]===void 0)return typeof T=="number"||typeof T=="boolean"?w[R]=T:ArrayBuffer.isView(T)?w[R]=T.slice():w[R]=T.clone(),!0;{const y=w[R];if(typeof T=="number"||typeof T=="boolean"){if(y!==T)return w[R]=T,!0}else{if(ArrayBuffer.isView(T))return!0;if(y.equals(T)===!1)return y.copy(T),!0}}return!1}function v(m){const _=m.uniforms;let M=0;const w=16;for(let R=0,y=_.length;R<y;R++){const C=Array.isArray(_[R])?_[R]:[_[R]];for(let D=0,P=C.length;D<P;D++){const N=C[D],H=Array.isArray(N.value)?N.value:[N.value];for(let V=0,F=H.length;V<F;V++){const j=H[V],B=S(j),I=M%w,$=I%B.boundary,K=I+$;M+=$,K!==0&&w-K<B.storage&&(M+=w-K),N.__data=new Float32Array(B.storage/Float32Array.BYTES_PER_ELEMENT),N.__offset=M,M+=B.storage}}}const T=M%w;return T>0&&(M+=w-T),m.__size=M,m.__cache={},this}function S(m){const _={boundary:0,storage:0};return typeof m=="number"||typeof m=="boolean"?(_.boundary=4,_.storage=4):m.isVector2?(_.boundary=8,_.storage=8):m.isVector3||m.isColor?(_.boundary=16,_.storage=12):m.isVector4?(_.boundary=16,_.storage=16):m.isMatrix3?(_.boundary=48,_.storage=48):m.isMatrix4?(_.boundary=64,_.storage=64):m.isTexture?ke("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(m)?(_.boundary=16,_.storage=m.byteLength):ke("WebGLRenderer: Unsupported uniform value type.",m),_}function g(m){const _=m.target;_.removeEventListener("dispose",g);const M=o.indexOf(_.__bindingPointIndex);o.splice(M,1),t.deleteBuffer(r[_.id]),delete r[_.id],delete s[_.id]}function h(){for(const m in r)t.deleteBuffer(r[m]);o=[],r={},s={}}return{bind:l,update:c,dispose:h}}const CU=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let yi=null;function RU(){return yi===null&&(yi=new c2(CU,16,16,bs,rr),yi.name="DFG_LUT",yi.minFilter=dn,yi.magFilter=dn,yi.wrapS=Xi,yi.wrapT=Xi,yi.generateMipmaps=!1,yi.needsUpdate=!0),yi}class PU{constructor(e={}){const{canvas:n=M3(),context:i=null,depth:r=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:d=!1,outputBufferType:p=Ln}=e;this.isWebGLRenderer=!0;let v;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");v=i.getContextAttributes().alpha}else v=o;const S=p,g=new Set([Tg,Eg,Mg]),h=new Set([Ln,Ui,rl,sl,yg,Sg]),m=new Uint32Array(4),_=new Int32Array(4),M=new L;let w=null,T=null;const R=[],y=[];let C=null;this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Li,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let P=!1,N=null;this._outputColorSpace=Wn;let H=0,V=0,F=null,j=-1,B=null;const I=new gt,$=new gt;let K=null;const ie=new ot(0);let fe=0,Fe=n.width,Be=n.height,Le=1,Q=null,le=null;const ce=new gt(0,0,Fe,Be),Ae=new gt(0,0,Fe,Be);let Ie=!1;const Re=new Pg;let et=!1,Oe=!1;const tt=new Nt,J=new L,be=new gt,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let $e=!1;function vt(){return F===null?Le:1}let O=i;function xt(b,z){return n.getContext(b,z)}try{const b={alpha:!0,depth:r,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${xg}`),n.addEventListener("webglcontextlost",re,!1),n.addEventListener("webglcontextrestored",Pe,!1),n.addEventListener("webglcontextcreationerror",He,!1),O===null){const z="webgl2";if(O=xt(z,b),O===null)throw xt(z)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw it("WebGLRenderer: "+b.message),b}let Ye,at,ae,Se,A,E,k,q,ne,se,he,Z,te,_e,Ee,pe,ue,ze,Xe,st,U,de,ee;function ye(){Ye=new RL(O),Ye.init(),U=new yU(O,Ye),at=new SL(O,Ye,e,U),ae=new xU(O,Ye),at.reversedDepthBuffer&&d&&ae.buffers.depth.setReversed(!0),Se=new NL(O),A=new rU,E=new _U(O,Ye,ae,A,at,U,Se),k=new CL(D),q=new F2(O),de=new _L(O,q),ne=new PL(O,q,Se,de),se=new IL(O,ne,q,de,Se),ze=new LL(O,at,E),Ee=new ML(A),he=new iU(D,k,Ye,at,de,Ee),Z=new bU(D,A),te=new oU,_e=new fU(Ye),ue=new xL(D,k,ae,se,v,l),pe=new vU(D,se,at),ee=new AU(O,Se,at,ae),Xe=new yL(O,Ye,Se),st=new DL(O,Ye,Se),Se.programs=he.programs,D.capabilities=at,D.extensions=Ye,D.properties=A,D.renderLists=te,D.shadowMap=pe,D.state=ae,D.info=Se}ye(),S!==Ln&&(C=new FL(S,n.width,n.height,r,s));const me=new TU(D,O);this.xr=me,this.getContext=function(){return O},this.getContextAttributes=function(){return O.getContextAttributes()},this.forceContextLoss=function(){const b=Ye.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Ye.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Le},this.setPixelRatio=function(b){b!==void 0&&(Le=b,this.setSize(Fe,Be,!1))},this.getSize=function(b){return b.set(Fe,Be)},this.setSize=function(b,z,Y=!0){if(me.isPresenting){ke("WebGLRenderer: Can't change size while VR device is presenting.");return}Fe=b,Be=z,n.width=Math.floor(b*Le),n.height=Math.floor(z*Le),Y===!0&&(n.style.width=b+"px",n.style.height=z+"px"),C!==null&&C.setSize(n.width,n.height),this.setViewport(0,0,b,z)},this.getDrawingBufferSize=function(b){return b.set(Fe*Le,Be*Le).floor()},this.setDrawingBufferSize=function(b,z,Y){Fe=b,Be=z,Le=Y,n.width=Math.floor(b*Y),n.height=Math.floor(z*Y),this.setViewport(0,0,b,z)},this.setEffects=function(b){if(S===Ln){it("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let z=0;z<b.length;z++)if(b[z].isOutputPass===!0){ke("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(I)},this.getViewport=function(b){return b.copy(ce)},this.setViewport=function(b,z,Y,W){b.isVector4?ce.set(b.x,b.y,b.z,b.w):ce.set(b,z,Y,W),ae.viewport(I.copy(ce).multiplyScalar(Le).round())},this.getScissor=function(b){return b.copy(Ae)},this.setScissor=function(b,z,Y,W){b.isVector4?Ae.set(b.x,b.y,b.z,b.w):Ae.set(b,z,Y,W),ae.scissor($.copy(Ae).multiplyScalar(Le).round())},this.getScissorTest=function(){return Ie},this.setScissorTest=function(b){ae.setScissorTest(Ie=b)},this.setOpaqueSort=function(b){Q=b},this.setTransparentSort=function(b){le=b},this.getClearColor=function(b){return b.copy(ue.getClearColor())},this.setClearColor=function(){ue.setClearColor(...arguments)},this.getClearAlpha=function(){return ue.getClearAlpha()},this.setClearAlpha=function(){ue.setClearAlpha(...arguments)},this.clear=function(b=!0,z=!0,Y=!0){let W=0;if(b){let X=!1;if(F!==null){const xe=F.texture.format;X=g.has(xe)}if(X){const xe=F.texture.type,Te=h.has(xe),ve=ue.getClearColor(),Ce=ue.getClearAlpha(),De=ve.r,je=ve.g,qe=ve.b;Te?(m[0]=De,m[1]=je,m[2]=qe,m[3]=Ce,O.clearBufferuiv(O.COLOR,0,m)):(_[0]=De,_[1]=je,_[2]=qe,_[3]=Ce,O.clearBufferiv(O.COLOR,0,_))}else W|=O.COLOR_BUFFER_BIT}z&&(W|=O.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),Y&&(W|=O.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),W!==0&&O.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),N=b},this.dispose=function(){n.removeEventListener("webglcontextlost",re,!1),n.removeEventListener("webglcontextrestored",Pe,!1),n.removeEventListener("webglcontextcreationerror",He,!1),ue.dispose(),te.dispose(),_e.dispose(),A.dispose(),k.dispose(),se.dispose(),de.dispose(),ee.dispose(),he.dispose(),me.dispose(),me.removeEventListener("sessionstart",Qg),me.removeEventListener("sessionend",Jg),Yr.stop()};function re(b){b.preventDefault(),Du("WebGLRenderer: Context Lost."),P=!0}function Pe(){Du("WebGLRenderer: Context Restored."),P=!1;const b=Se.autoReset,z=pe.enabled,Y=pe.autoUpdate,W=pe.needsUpdate,X=pe.type;ye(),Se.autoReset=b,pe.enabled=z,pe.autoUpdate=Y,pe.needsUpdate=W,pe.type=X}function He(b){it("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function Lt(b){const z=b.target;z.removeEventListener("dispose",Lt),ft(z)}function ft(b){Fi(b),A.remove(b)}function Fi(b){const z=A.get(b).programs;z!==void 0&&(z.forEach(function(Y){he.releaseProgram(Y)}),b.isShaderMaterial&&he.releaseShaderCache(b))}this.renderBufferDirect=function(b,z,Y,W,X,xe){z===null&&(z=Ve);const Te=X.isMesh&&X.matrixWorld.determinant()<0,ve=DE(b,z,Y,W,X);ae.setMaterial(W,Te);let Ce=Y.index,De=1;if(W.wireframe===!0){if(Ce=ne.getWireframeAttribute(Y),Ce===void 0)return;De=2}const je=Y.drawRange,qe=Y.attributes.position;let Ne=je.start*De,ht=(je.start+je.count)*De;xe!==null&&(Ne=Math.max(Ne,xe.start*De),ht=Math.min(ht,(xe.start+xe.count)*De)),Ce!==null?(Ne=Math.max(Ne,0),ht=Math.min(ht,Ce.count)):qe!=null&&(Ne=Math.max(Ne,0),ht=Math.min(ht,qe.count));const It=ht-Ne;if(It<0||It===1/0)return;de.setup(X,W,ve,Y,Ce);let Rt,pt=Xe;if(Ce!==null&&(Rt=q.get(Ce),pt=st,pt.setIndex(Rt)),X.isMesh)W.wireframe===!0?(ae.setLineWidth(W.wireframeLinewidth*vt()),pt.setMode(O.LINES)):pt.setMode(O.TRIANGLES);else if(X.isLine){let nn=W.linewidth;nn===void 0&&(nn=1),ae.setLineWidth(nn*vt()),X.isLineSegments?pt.setMode(O.LINES):X.isLineLoop?pt.setMode(O.LINE_LOOP):pt.setMode(O.LINE_STRIP)}else X.isPoints?pt.setMode(O.POINTS):X.isSprite&&pt.setMode(O.TRIANGLES);if(X.isBatchedMesh)if(Ye.get("WEBGL_multi_draw"))pt.renderMultiDraw(X._multiDrawStarts,X._multiDrawCounts,X._multiDrawCount);else{const nn=X._multiDrawStarts,Me=X._multiDrawCounts,Rn=X._multiDrawCount,nt=Ce?q.get(Ce).bytesPerElement:1,Vn=A.get(W).currentProgram.getUniforms();for(let vi=0;vi<Rn;vi++)Vn.setValue(O,"_gl_DrawID",vi),pt.render(nn[vi]/nt,Me[vi])}else if(X.isInstancedMesh)pt.renderInstances(Ne,It,X.count);else if(Y.isInstancedBufferGeometry){const nn=Y._maxInstanceCount!==void 0?Y._maxInstanceCount:1/0,Me=Math.min(Y.instanceCount,nn);pt.renderInstances(Ne,It,Me)}else pt.render(Ne,It)};function gi(b,z,Y){b.transparent===!0&&b.side===wi&&b.forceSinglePass===!1?(b.side=An,b.needsUpdate=!0,wl(b,z,Y),b.side=zr,b.needsUpdate=!0,wl(b,z,Y),b.side=wi):wl(b,z,Y)}this.compile=function(b,z,Y=null){Y===null&&(Y=b),T=_e.get(Y),T.init(z),y.push(T),Y.traverseVisible(function(X){X.isLight&&X.layers.test(z.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),b!==Y&&b.traverseVisible(function(X){X.isLight&&X.layers.test(z.layers)&&(T.pushLight(X),X.castShadow&&T.pushShadow(X))}),T.setupLights();const W=new Set;return b.traverse(function(X){if(!(X.isMesh||X.isPoints||X.isLine||X.isSprite))return;const xe=X.material;if(xe)if(Array.isArray(xe))for(let Te=0;Te<xe.length;Te++){const ve=xe[Te];gi(ve,Y,X),W.add(ve)}else gi(xe,Y,X),W.add(xe)}),T=y.pop(),W},this.compileAsync=function(b,z,Y=null){const W=this.compile(b,z,Y);return new Promise(X=>{function xe(){if(W.forEach(function(Te){A.get(Te).currentProgram.isReady()&&W.delete(Te)}),W.size===0){X(b);return}setTimeout(xe,10)}Ye.get("KHR_parallel_shader_compile")!==null?xe():setTimeout(xe,10)})};let ud=null;function RE(b){ud&&ud(b)}function Qg(){Yr.stop()}function Jg(){Yr.start()}const Yr=new hE;Yr.setAnimationLoop(RE),typeof self<"u"&&Yr.setContext(self),this.setAnimationLoop=function(b){ud=b,me.setAnimationLoop(b),b===null?Yr.stop():Yr.start()},me.addEventListener("sessionstart",Qg),me.addEventListener("sessionend",Jg),this.render=function(b,z){if(z!==void 0&&z.isCamera!==!0){it("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;N!==null&&N.renderStart(b,z);const Y=me.enabled===!0&&me.isPresenting===!0,W=C!==null&&(F===null||Y)&&C.begin(D,F);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),z.parent===null&&z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),me.enabled===!0&&me.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(me.cameraAutoUpdate===!0&&me.updateCamera(z),z=me.getCamera()),b.isScene===!0&&b.onBeforeRender(D,b,z,F),T=_e.get(b,y.length),T.init(z),T.state.textureUnits=E.getTextureUnits(),y.push(T),tt.multiplyMatrices(z.projectionMatrix,z.matrixWorldInverse),Re.setFromProjectionMatrix(tt,Ci,z.reversedDepth),Oe=this.localClippingEnabled,et=Ee.init(this.clippingPlanes,Oe),w=te.get(b,R.length),w.init(),R.push(w),me.enabled===!0&&me.isPresenting===!0){const Te=D.xr.getDepthSensingMesh();Te!==null&&dd(Te,z,-1/0,D.sortObjects)}dd(b,z,0,D.sortObjects),w.finish(),D.sortObjects===!0&&w.sort(Q,le),$e=me.enabled===!1||me.isPresenting===!1||me.hasDepthSensing()===!1,$e&&ue.addToRenderList(w,b),this.info.render.frame++,et===!0&&Ee.beginShadows();const X=T.state.shadowsArray;if(pe.render(X,b,z),et===!0&&Ee.endShadows(),this.info.autoReset===!0&&this.info.reset(),(W&&C.hasRenderPass())===!1){const Te=w.opaque,ve=w.transmissive;if(T.setupLights(),z.isArrayCamera){const Ce=z.cameras;if(ve.length>0)for(let De=0,je=Ce.length;De<je;De++){const qe=Ce[De];t0(Te,ve,b,qe)}$e&&ue.render(b);for(let De=0,je=Ce.length;De<je;De++){const qe=Ce[De];e0(w,b,qe,qe.viewport)}}else ve.length>0&&t0(Te,ve,b,z),$e&&ue.render(b),e0(w,b,z)}F!==null&&V===0&&(E.updateMultisampleRenderTarget(F),E.updateRenderTargetMipmap(F)),W&&C.end(D),b.isScene===!0&&b.onAfterRender(D,b,z),de.resetDefaultState(),j=-1,B=null,y.pop(),y.length>0?(T=y[y.length-1],E.setTextureUnits(T.state.textureUnits),et===!0&&Ee.setGlobalState(D.clippingPlanes,T.state.camera)):T=null,R.pop(),R.length>0?w=R[R.length-1]:w=null,N!==null&&N.renderEnd()};function dd(b,z,Y,W){if(b.visible===!1)return;if(b.layers.test(z.layers)){if(b.isGroup)Y=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(z);else if(b.isLightProbeGrid)T.pushLightProbeGrid(b);else if(b.isLight)T.pushLight(b),b.castShadow&&T.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Re.intersectsSprite(b)){W&&be.setFromMatrixPosition(b.matrixWorld).applyMatrix4(tt);const Te=se.update(b),ve=b.material;ve.visible&&w.push(b,Te,ve,Y,be.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Re.intersectsObject(b))){const Te=se.update(b),ve=b.material;if(W&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),be.copy(b.boundingSphere.center)):(Te.boundingSphere===null&&Te.computeBoundingSphere(),be.copy(Te.boundingSphere.center)),be.applyMatrix4(b.matrixWorld).applyMatrix4(tt)),Array.isArray(ve)){const Ce=Te.groups;for(let De=0,je=Ce.length;De<je;De++){const qe=Ce[De],Ne=ve[qe.materialIndex];Ne&&Ne.visible&&w.push(b,Te,Ne,Y,be.z,qe)}}else ve.visible&&w.push(b,Te,ve,Y,be.z,null)}}const xe=b.children;for(let Te=0,ve=xe.length;Te<ve;Te++)dd(xe[Te],z,Y,W)}function e0(b,z,Y,W){const{opaque:X,transmissive:xe,transparent:Te}=b;T.setupLightsView(Y),et===!0&&Ee.setGlobalState(D.clippingPlanes,Y),W&&ae.viewport(I.copy(W)),X.length>0&&Tl(X,z,Y),xe.length>0&&Tl(xe,z,Y),Te.length>0&&Tl(Te,z,Y),ae.buffers.depth.setTest(!0),ae.buffers.depth.setMask(!0),ae.buffers.color.setMask(!0),ae.setPolygonOffset(!1)}function t0(b,z,Y,W){if((Y.isScene===!0?Y.overrideMaterial:null)!==null)return;if(T.state.transmissionRenderTarget[W.id]===void 0){const Ne=Ye.has("EXT_color_buffer_half_float")||Ye.has("EXT_color_buffer_float");T.state.transmissionRenderTarget[W.id]=new Ii(1,1,{generateMipmaps:!0,type:Ne?rr:Ln,minFilter:hs,samples:Math.max(4,at.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace})}const xe=T.state.transmissionRenderTarget[W.id],Te=W.viewport||I;xe.setSize(Te.z*D.transmissionResolutionScale,Te.w*D.transmissionResolutionScale);const ve=D.getRenderTarget(),Ce=D.getActiveCubeFace(),De=D.getActiveMipmapLevel();D.setRenderTarget(xe),D.getClearColor(ie),fe=D.getClearAlpha(),fe<1&&D.setClearColor(16777215,.5),D.clear(),$e&&ue.render(Y);const je=D.toneMapping;D.toneMapping=Li;const qe=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),T.setupLightsView(W),et===!0&&Ee.setGlobalState(D.clippingPlanes,W),Tl(b,Y,W),E.updateMultisampleRenderTarget(xe),E.updateRenderTargetMipmap(xe),Ye.has("WEBGL_multisampled_render_to_texture")===!1){let Ne=!1;for(let ht=0,It=z.length;ht<It;ht++){const Rt=z[ht],{object:pt,geometry:nn,material:Me,group:Rn}=Rt;if(Me.side===wi&&pt.layers.test(W.layers)){const nt=Me.side;Me.side=An,Me.needsUpdate=!0,n0(pt,Y,W,nn,Me,Rn),Me.side=nt,Me.needsUpdate=!0,Ne=!0}}Ne===!0&&(E.updateMultisampleRenderTarget(xe),E.updateRenderTargetMipmap(xe))}D.setRenderTarget(ve,Ce,De),D.setClearColor(ie,fe),qe!==void 0&&(W.viewport=qe),D.toneMapping=je}function Tl(b,z,Y){const W=z.isScene===!0?z.overrideMaterial:null;for(let X=0,xe=b.length;X<xe;X++){const Te=b[X],{object:ve,geometry:Ce,group:De}=Te;let je=Te.material;je.allowOverride===!0&&W!==null&&(je=W),ve.layers.test(Y.layers)&&n0(ve,z,Y,Ce,je,De)}}function n0(b,z,Y,W,X,xe){b.onBeforeRender(D,z,Y,W,X,xe),b.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),X.onBeforeRender(D,z,Y,W,b,xe),X.transparent===!0&&X.side===wi&&X.forceSinglePass===!1?(X.side=An,X.needsUpdate=!0,D.renderBufferDirect(Y,z,W,X,b,xe),X.side=zr,X.needsUpdate=!0,D.renderBufferDirect(Y,z,W,X,b,xe),X.side=wi):D.renderBufferDirect(Y,z,W,X,b,xe),b.onAfterRender(D,z,Y,W,X,xe)}function wl(b,z,Y){z.isScene!==!0&&(z=Ve);const W=A.get(b),X=T.state.lights,xe=T.state.shadowsArray,Te=X.state.version,ve=he.getParameters(b,X.state,xe,z,Y,T.state.lightProbeGridArray),Ce=he.getProgramCacheKey(ve);let De=W.programs;W.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?z.environment:null,W.fog=z.fog;const je=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;W.envMap=k.get(b.envMap||W.environment,je),W.envMapRotation=W.environment!==null&&b.envMap===null?z.environmentRotation:b.envMapRotation,De===void 0&&(b.addEventListener("dispose",Lt),De=new Map,W.programs=De);let qe=De.get(Ce);if(qe!==void 0){if(W.currentProgram===qe&&W.lightsStateVersion===Te)return r0(b,ve),qe}else ve.uniforms=he.getUniforms(b),N!==null&&b.isNodeMaterial&&N.build(b,Y,ve),b.onBeforeCompile(ve,D),qe=he.acquireProgram(ve,Ce),De.set(Ce,qe),W.uniforms=ve.uniforms;const Ne=W.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Ne.clippingPlanes=Ee.uniform),r0(b,ve),W.needsLights=LE(b),W.lightsStateVersion=Te,W.needsLights&&(Ne.ambientLightColor.value=X.state.ambient,Ne.lightProbe.value=X.state.probe,Ne.directionalLights.value=X.state.directional,Ne.directionalLightShadows.value=X.state.directionalShadow,Ne.spotLights.value=X.state.spot,Ne.spotLightShadows.value=X.state.spotShadow,Ne.rectAreaLights.value=X.state.rectArea,Ne.ltc_1.value=X.state.rectAreaLTC1,Ne.ltc_2.value=X.state.rectAreaLTC2,Ne.pointLights.value=X.state.point,Ne.pointLightShadows.value=X.state.pointShadow,Ne.hemisphereLights.value=X.state.hemi,Ne.directionalShadowMatrix.value=X.state.directionalShadowMatrix,Ne.spotLightMatrix.value=X.state.spotLightMatrix,Ne.spotLightMap.value=X.state.spotLightMap,Ne.pointShadowMatrix.value=X.state.pointShadowMatrix),W.lightProbeGrid=T.state.lightProbeGridArray.length>0,W.currentProgram=qe,W.uniformsList=null,qe}function i0(b){if(b.uniformsList===null){const z=b.currentProgram.getUniforms();b.uniformsList=Xc.seqWithValue(z.seq,b.uniforms)}return b.uniformsList}function r0(b,z){const Y=A.get(b);Y.outputColorSpace=z.outputColorSpace,Y.batching=z.batching,Y.batchingColor=z.batchingColor,Y.instancing=z.instancing,Y.instancingColor=z.instancingColor,Y.instancingMorph=z.instancingMorph,Y.skinning=z.skinning,Y.morphTargets=z.morphTargets,Y.morphNormals=z.morphNormals,Y.morphColors=z.morphColors,Y.morphTargetsCount=z.morphTargetsCount,Y.numClippingPlanes=z.numClippingPlanes,Y.numIntersection=z.numClipIntersection,Y.vertexAlphas=z.vertexAlphas,Y.vertexTangents=z.vertexTangents,Y.toneMapping=z.toneMapping}function PE(b,z){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;M.setFromMatrixPosition(z.matrixWorld);for(let Y=0,W=b.length;Y<W;Y++){const X=b[Y];if(X.texture!==null&&X.boundingBox.containsPoint(M))return X}return null}function DE(b,z,Y,W,X){z.isScene!==!0&&(z=Ve),E.resetTextureUnits();const xe=z.fog,Te=W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial?z.environment:null,ve=F===null?D.outputColorSpace:F.isXRRenderTarget===!0?F.texture.colorSpace:Je.workingColorSpace,Ce=W.isMeshStandardMaterial||W.isMeshLambertMaterial&&!W.envMap||W.isMeshPhongMaterial&&!W.envMap,De=k.get(W.envMap||Te,Ce),je=W.vertexColors===!0&&!!Y.attributes.color&&Y.attributes.color.itemSize===4,qe=!!Y.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),Ne=!!Y.morphAttributes.position,ht=!!Y.morphAttributes.normal,It=!!Y.morphAttributes.color;let Rt=Li;W.toneMapped&&(F===null||F.isXRRenderTarget===!0)&&(Rt=D.toneMapping);const pt=Y.morphAttributes.position||Y.morphAttributes.normal||Y.morphAttributes.color,nn=pt!==void 0?pt.length:0,Me=A.get(W),Rn=T.state.lights;if(et===!0&&(Oe===!0||b!==B)){const _t=b===B&&W.id===j;Ee.setState(W,b,_t)}let nt=!1;W.version===Me.__version?(Me.needsLights&&Me.lightsStateVersion!==Rn.state.version||Me.outputColorSpace!==ve||X.isBatchedMesh&&Me.batching===!1||!X.isBatchedMesh&&Me.batching===!0||X.isBatchedMesh&&Me.batchingColor===!0&&X.colorTexture===null||X.isBatchedMesh&&Me.batchingColor===!1&&X.colorTexture!==null||X.isInstancedMesh&&Me.instancing===!1||!X.isInstancedMesh&&Me.instancing===!0||X.isSkinnedMesh&&Me.skinning===!1||!X.isSkinnedMesh&&Me.skinning===!0||X.isInstancedMesh&&Me.instancingColor===!0&&X.instanceColor===null||X.isInstancedMesh&&Me.instancingColor===!1&&X.instanceColor!==null||X.isInstancedMesh&&Me.instancingMorph===!0&&X.morphTexture===null||X.isInstancedMesh&&Me.instancingMorph===!1&&X.morphTexture!==null||Me.envMap!==De||W.fog===!0&&Me.fog!==xe||Me.numClippingPlanes!==void 0&&(Me.numClippingPlanes!==Ee.numPlanes||Me.numIntersection!==Ee.numIntersection)||Me.vertexAlphas!==je||Me.vertexTangents!==qe||Me.morphTargets!==Ne||Me.morphNormals!==ht||Me.morphColors!==It||Me.toneMapping!==Rt||Me.morphTargetsCount!==nn||!!Me.lightProbeGrid!=T.state.lightProbeGridArray.length>0)&&(nt=!0):(nt=!0,Me.__version=W.version);let Vn=Me.currentProgram;nt===!0&&(Vn=wl(W,z,X),N&&W.isNodeMaterial&&N.onUpdateProgram(W,Vn,Me));let vi=!1,ar=!1,Ds=!1;const mt=Vn.getUniforms(),Ut=Me.uniforms;if(ae.useProgram(Vn.program)&&(vi=!0,ar=!0,Ds=!0),W.id!==j&&(j=W.id,ar=!0),Me.needsLights){const _t=PE(T.state.lightProbeGridArray,X);Me.lightProbeGrid!==_t&&(Me.lightProbeGrid=_t,ar=!0)}if(vi||B!==b){ae.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),mt.setValue(O,"projectionMatrix",b.projectionMatrix),mt.setValue(O,"viewMatrix",b.matrixWorldInverse);const cr=mt.map.cameraPosition;cr!==void 0&&cr.setValue(O,J.setFromMatrixPosition(b.matrixWorld)),at.logarithmicDepthBuffer&&mt.setValue(O,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&mt.setValue(O,"isOrthographic",b.isOrthographicCamera===!0),B!==b&&(B=b,ar=!0,Ds=!0)}if(Me.needsLights&&(Rn.state.directionalShadowMap.length>0&&mt.setValue(O,"directionalShadowMap",Rn.state.directionalShadowMap,E),Rn.state.spotShadowMap.length>0&&mt.setValue(O,"spotShadowMap",Rn.state.spotShadowMap,E),Rn.state.pointShadowMap.length>0&&mt.setValue(O,"pointShadowMap",Rn.state.pointShadowMap,E)),X.isSkinnedMesh){mt.setOptional(O,X,"bindMatrix"),mt.setOptional(O,X,"bindMatrixInverse");const _t=X.skeleton;_t&&(_t.boneTexture===null&&_t.computeBoneTexture(),mt.setValue(O,"boneTexture",_t.boneTexture,E))}X.isBatchedMesh&&(mt.setOptional(O,X,"batchingTexture"),mt.setValue(O,"batchingTexture",X._matricesTexture,E),mt.setOptional(O,X,"batchingIdTexture"),mt.setValue(O,"batchingIdTexture",X._indirectTexture,E),mt.setOptional(O,X,"batchingColorTexture"),X._colorsTexture!==null&&mt.setValue(O,"batchingColorTexture",X._colorsTexture,E));const lr=Y.morphAttributes;if((lr.position!==void 0||lr.normal!==void 0||lr.color!==void 0)&&ze.update(X,Y,Vn),(ar||Me.receiveShadow!==X.receiveShadow)&&(Me.receiveShadow=X.receiveShadow,mt.setValue(O,"receiveShadow",X.receiveShadow)),(W.isMeshStandardMaterial||W.isMeshLambertMaterial||W.isMeshPhongMaterial)&&W.envMap===null&&z.environment!==null&&(Ut.envMapIntensity.value=z.environmentIntensity),Ut.dfgLUT!==void 0&&(Ut.dfgLUT.value=RU()),ar){if(mt.setValue(O,"toneMappingExposure",D.toneMappingExposure),Me.needsLights&&NE(Ut,Ds),xe&&W.fog===!0&&Z.refreshFogUniforms(Ut,xe),Z.refreshMaterialUniforms(Ut,W,Le,Be,T.state.transmissionRenderTarget[b.id]),Me.needsLights&&Me.lightProbeGrid){const _t=Me.lightProbeGrid;Ut.probesSH.value=_t.texture,Ut.probesMin.value.copy(_t.boundingBox.min),Ut.probesMax.value.copy(_t.boundingBox.max),Ut.probesResolution.value.copy(_t.resolution)}Xc.upload(O,i0(Me),Ut,E)}if(W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(Xc.upload(O,i0(Me),Ut,E),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&mt.setValue(O,"center",X.center),mt.setValue(O,"modelViewMatrix",X.modelViewMatrix),mt.setValue(O,"normalMatrix",X.normalMatrix),mt.setValue(O,"modelMatrix",X.matrixWorld),W.uniformsGroups!==void 0){const _t=W.uniformsGroups;for(let cr=0,Ns=_t.length;cr<Ns;cr++){const s0=_t[cr];ee.update(s0,Vn),ee.bind(s0,Vn)}}return Vn}function NE(b,z){b.ambientLightColor.needsUpdate=z,b.lightProbe.needsUpdate=z,b.directionalLights.needsUpdate=z,b.directionalLightShadows.needsUpdate=z,b.pointLights.needsUpdate=z,b.pointLightShadows.needsUpdate=z,b.spotLights.needsUpdate=z,b.spotLightShadows.needsUpdate=z,b.rectAreaLights.needsUpdate=z,b.hemisphereLights.needsUpdate=z}function LE(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return H},this.getActiveMipmapLevel=function(){return V},this.getRenderTarget=function(){return F},this.setRenderTargetTextures=function(b,z,Y){const W=A.get(b);W.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,W.__autoAllocateDepthBuffer===!1&&(W.__useRenderToTexture=!1),A.get(b.texture).__webglTexture=z,A.get(b.depthTexture).__webglTexture=W.__autoAllocateDepthBuffer?void 0:Y,W.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,z){const Y=A.get(b);Y.__webglFramebuffer=z,Y.__useDefaultFramebuffer=z===void 0};const IE=O.createFramebuffer();this.setRenderTarget=function(b,z=0,Y=0){F=b,H=z,V=Y;let W=null,X=!1,xe=!1;if(b){const ve=A.get(b);if(ve.__useDefaultFramebuffer!==void 0){ae.bindFramebuffer(O.FRAMEBUFFER,ve.__webglFramebuffer),I.copy(b.viewport),$.copy(b.scissor),K=b.scissorTest,ae.viewport(I),ae.scissor($),ae.setScissorTest(K),j=-1;return}else if(ve.__webglFramebuffer===void 0)E.setupRenderTarget(b);else if(ve.__hasExternalTextures)E.rebindTextures(b,A.get(b.texture).__webglTexture,A.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const je=b.depthTexture;if(ve.__boundDepthTexture!==je){if(je!==null&&A.has(je)&&(b.width!==je.image.width||b.height!==je.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");E.setupDepthRenderbuffer(b)}}const Ce=b.texture;(Ce.isData3DTexture||Ce.isDataArrayTexture||Ce.isCompressedArrayTexture)&&(xe=!0);const De=A.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(De[z])?W=De[z][Y]:W=De[z],X=!0):b.samples>0&&E.useMultisampledRTT(b)===!1?W=A.get(b).__webglMultisampledFramebuffer:Array.isArray(De)?W=De[Y]:W=De,I.copy(b.viewport),$.copy(b.scissor),K=b.scissorTest}else I.copy(ce).multiplyScalar(Le).floor(),$.copy(Ae).multiplyScalar(Le).floor(),K=Ie;if(Y!==0&&(W=IE),ae.bindFramebuffer(O.FRAMEBUFFER,W)&&ae.drawBuffers(b,W),ae.viewport(I),ae.scissor($),ae.setScissorTest(K),X){const ve=A.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_CUBE_MAP_POSITIVE_X+z,ve.__webglTexture,Y)}else if(xe){const ve=z;for(let Ce=0;Ce<b.textures.length;Ce++){const De=A.get(b.textures[Ce]);O.framebufferTextureLayer(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0+Ce,De.__webglTexture,Y,ve)}}else if(b!==null&&Y!==0){const ve=A.get(b.texture);O.framebufferTexture2D(O.FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,ve.__webglTexture,Y)}j=-1},this.readRenderTargetPixels=function(b,z,Y,W,X,xe,Te,ve=0){if(!(b&&b.isWebGLRenderTarget)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Ce=A.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Te!==void 0&&(Ce=Ce[Te]),Ce){ae.bindFramebuffer(O.FRAMEBUFFER,Ce);try{const De=b.textures[ve],je=De.format,qe=De.type;if(b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ve),!at.textureFormatReadable(je)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!at.textureTypeReadable(qe)){it("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}z>=0&&z<=b.width-W&&Y>=0&&Y<=b.height-X&&O.readPixels(z,Y,W,X,U.convert(je),U.convert(qe),xe)}finally{const De=F!==null?A.get(F).__webglFramebuffer:null;ae.bindFramebuffer(O.FRAMEBUFFER,De)}}},this.readRenderTargetPixelsAsync=async function(b,z,Y,W,X,xe,Te,ve=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Ce=A.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&Te!==void 0&&(Ce=Ce[Te]),Ce)if(z>=0&&z<=b.width-W&&Y>=0&&Y<=b.height-X){ae.bindFramebuffer(O.FRAMEBUFFER,Ce);const De=b.textures[ve],je=De.format,qe=De.type;if(b.textures.length>1&&O.readBuffer(O.COLOR_ATTACHMENT0+ve),!at.textureFormatReadable(je))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!at.textureTypeReadable(qe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ne=O.createBuffer();O.bindBuffer(O.PIXEL_PACK_BUFFER,Ne),O.bufferData(O.PIXEL_PACK_BUFFER,xe.byteLength,O.STREAM_READ),O.readPixels(z,Y,W,X,U.convert(je),U.convert(qe),0);const ht=F!==null?A.get(F).__webglFramebuffer:null;ae.bindFramebuffer(O.FRAMEBUFFER,ht);const It=O.fenceSync(O.SYNC_GPU_COMMANDS_COMPLETE,0);return O.flush(),await E3(O,It,4),O.bindBuffer(O.PIXEL_PACK_BUFFER,Ne),O.getBufferSubData(O.PIXEL_PACK_BUFFER,0,xe),O.deleteBuffer(Ne),O.deleteSync(It),xe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,z=null,Y=0){const W=Math.pow(2,-Y),X=Math.floor(b.image.width*W),xe=Math.floor(b.image.height*W),Te=z!==null?z.x:0,ve=z!==null?z.y:0;E.setTexture2D(b,0),O.copyTexSubImage2D(O.TEXTURE_2D,Y,0,0,Te,ve,X,xe),ae.unbindTexture()};const UE=O.createFramebuffer(),FE=O.createFramebuffer();this.copyTextureToTexture=function(b,z,Y=null,W=null,X=0,xe=0){let Te,ve,Ce,De,je,qe,Ne,ht,It;const Rt=b.isCompressedTexture?b.mipmaps[xe]:b.image;if(Y!==null)Te=Y.max.x-Y.min.x,ve=Y.max.y-Y.min.y,Ce=Y.isBox3?Y.max.z-Y.min.z:1,De=Y.min.x,je=Y.min.y,qe=Y.isBox3?Y.min.z:0;else{const Ut=Math.pow(2,-X);Te=Math.floor(Rt.width*Ut),ve=Math.floor(Rt.height*Ut),b.isDataArrayTexture?Ce=Rt.depth:b.isData3DTexture?Ce=Math.floor(Rt.depth*Ut):Ce=1,De=0,je=0,qe=0}W!==null?(Ne=W.x,ht=W.y,It=W.z):(Ne=0,ht=0,It=0);const pt=U.convert(z.format),nn=U.convert(z.type);let Me;z.isData3DTexture?(E.setTexture3D(z,0),Me=O.TEXTURE_3D):z.isDataArrayTexture||z.isCompressedArrayTexture?(E.setTexture2DArray(z,0),Me=O.TEXTURE_2D_ARRAY):(E.setTexture2D(z,0),Me=O.TEXTURE_2D),ae.activeTexture(O.TEXTURE0),ae.pixelStorei(O.UNPACK_FLIP_Y_WEBGL,z.flipY),ae.pixelStorei(O.UNPACK_PREMULTIPLY_ALPHA_WEBGL,z.premultiplyAlpha),ae.pixelStorei(O.UNPACK_ALIGNMENT,z.unpackAlignment);const Rn=ae.getParameter(O.UNPACK_ROW_LENGTH),nt=ae.getParameter(O.UNPACK_IMAGE_HEIGHT),Vn=ae.getParameter(O.UNPACK_SKIP_PIXELS),vi=ae.getParameter(O.UNPACK_SKIP_ROWS),ar=ae.getParameter(O.UNPACK_SKIP_IMAGES);ae.pixelStorei(O.UNPACK_ROW_LENGTH,Rt.width),ae.pixelStorei(O.UNPACK_IMAGE_HEIGHT,Rt.height),ae.pixelStorei(O.UNPACK_SKIP_PIXELS,De),ae.pixelStorei(O.UNPACK_SKIP_ROWS,je),ae.pixelStorei(O.UNPACK_SKIP_IMAGES,qe);const Ds=b.isDataArrayTexture||b.isData3DTexture,mt=z.isDataArrayTexture||z.isData3DTexture;if(b.isDepthTexture){const Ut=A.get(b),lr=A.get(z),_t=A.get(Ut.__renderTarget),cr=A.get(lr.__renderTarget);ae.bindFramebuffer(O.READ_FRAMEBUFFER,_t.__webglFramebuffer),ae.bindFramebuffer(O.DRAW_FRAMEBUFFER,cr.__webglFramebuffer);for(let Ns=0;Ns<Ce;Ns++)Ds&&(O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,A.get(b).__webglTexture,X,qe+Ns),O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,A.get(z).__webglTexture,xe,It+Ns)),O.blitFramebuffer(De,je,Te,ve,Ne,ht,Te,ve,O.DEPTH_BUFFER_BIT,O.NEAREST);ae.bindFramebuffer(O.READ_FRAMEBUFFER,null),ae.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else if(X!==0||b.isRenderTargetTexture||A.has(b)){const Ut=A.get(b),lr=A.get(z);ae.bindFramebuffer(O.READ_FRAMEBUFFER,UE),ae.bindFramebuffer(O.DRAW_FRAMEBUFFER,FE);for(let _t=0;_t<Ce;_t++)Ds?O.framebufferTextureLayer(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,Ut.__webglTexture,X,qe+_t):O.framebufferTexture2D(O.READ_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,Ut.__webglTexture,X),mt?O.framebufferTextureLayer(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,lr.__webglTexture,xe,It+_t):O.framebufferTexture2D(O.DRAW_FRAMEBUFFER,O.COLOR_ATTACHMENT0,O.TEXTURE_2D,lr.__webglTexture,xe),X!==0?O.blitFramebuffer(De,je,Te,ve,Ne,ht,Te,ve,O.COLOR_BUFFER_BIT,O.NEAREST):mt?O.copyTexSubImage3D(Me,xe,Ne,ht,It+_t,De,je,Te,ve):O.copyTexSubImage2D(Me,xe,Ne,ht,De,je,Te,ve);ae.bindFramebuffer(O.READ_FRAMEBUFFER,null),ae.bindFramebuffer(O.DRAW_FRAMEBUFFER,null)}else mt?b.isDataTexture||b.isData3DTexture?O.texSubImage3D(Me,xe,Ne,ht,It,Te,ve,Ce,pt,nn,Rt.data):z.isCompressedArrayTexture?O.compressedTexSubImage3D(Me,xe,Ne,ht,It,Te,ve,Ce,pt,Rt.data):O.texSubImage3D(Me,xe,Ne,ht,It,Te,ve,Ce,pt,nn,Rt):b.isDataTexture?O.texSubImage2D(O.TEXTURE_2D,xe,Ne,ht,Te,ve,pt,nn,Rt.data):b.isCompressedTexture?O.compressedTexSubImage2D(O.TEXTURE_2D,xe,Ne,ht,Rt.width,Rt.height,pt,Rt.data):O.texSubImage2D(O.TEXTURE_2D,xe,Ne,ht,Te,ve,pt,nn,Rt);ae.pixelStorei(O.UNPACK_ROW_LENGTH,Rn),ae.pixelStorei(O.UNPACK_IMAGE_HEIGHT,nt),ae.pixelStorei(O.UNPACK_SKIP_PIXELS,Vn),ae.pixelStorei(O.UNPACK_SKIP_ROWS,vi),ae.pixelStorei(O.UNPACK_SKIP_IMAGES,ar),xe===0&&z.generateMipmaps&&O.generateMipmap(Me),ae.unbindTexture()},this.initRenderTarget=function(b){A.get(b).__webglFramebuffer===void 0&&E.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?E.setTextureCube(b,0):b.isData3DTexture?E.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?E.setTexture2DArray(b,0):E.setTexture2D(b,0),ae.unbindTexture()},this.resetState=function(){H=0,V=0,F=null,ae.reset(),de.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ci}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=Je._getDrawingBufferColorSpace(e),n.unpackColorSpace=Je._getUnpackColorSpace()}}ge.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Qe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};Mn.line={uniforms:Fg.merge([ge.common,ge.fog,ge.line]),vertexShader:`
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
		`};class SE extends mi{constructor(e){super({type:"LineMaterial",uniforms:Fg.clone(Mn.line.uniforms),vertexShader:Mn.line.vertexShader,fragmentShader:Mn.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(e)}get color(){return this.uniforms.diffuse.value}set color(e){this.uniforms.diffuse.value=e}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(e){e===!0!==this.worldUnits&&(this.needsUpdate=!0),e===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(e){this.uniforms.linewidth&&(this.uniforms.linewidth.value=e)}get dashed(){return"USE_DASH"in this.defines}set dashed(e){e===!0!==this.dashed&&(this.needsUpdate=!0),e===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(e){this.uniforms.dashScale.value=e}get dashSize(){return this.uniforms.dashSize.value}set dashSize(e){this.uniforms.dashSize.value=e}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(e){this.uniforms.dashOffset.value=e}get gapSize(){return this.uniforms.gapSize.value}set gapSize(e){this.uniforms.gapSize.value=e}get opacity(){return this.uniforms.opacity.value}set opacity(e){this.uniforms&&(this.uniforms.opacity.value=e)}get resolution(){return this.uniforms.resolution.value}set resolution(e){this.uniforms.resolution.value.copy(e)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(e){this.defines&&(e===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),e===!0?this.defines.USE_ALPHA_TO_COVERAGE="":delete this.defines.USE_ALPHA_TO_COVERAGE)}}const L_=new $r,_c=new L;class ME extends C2{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],n=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],i=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(i),this.setAttribute("position",new Gt(e,3)),this.setAttribute("uv",new Gt(n,2))}applyMatrix4(e){const n=this.attributes.instanceStart,i=this.attributes.instanceEnd;return n!==void 0&&(n.applyMatrix4(e),i.applyMatrix4(e),n.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new zp(n,6,1);return this.setAttribute("instanceStart",new wr(i,3,0)),this.setAttribute("instanceEnd",new wr(i,3,3)),this.instanceCount=this.attributes.instanceStart.count,this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e){let n;e instanceof Float32Array?n=e:Array.isArray(e)&&(n=new Float32Array(e));const i=new zp(n,6,1);return this.setAttribute("instanceColorStart",new wr(i,3,0)),this.setAttribute("instanceColorEnd",new wr(i,3,3)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new g2(e.geometry)),this}fromLineSegments(e){const n=e.geometry;return this.setPositions(n.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new $r);const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;e!==void 0&&n!==void 0&&(this.boundingBox.setFromBufferAttribute(e),L_.setFromBufferAttribute(n),this.boundingBox.union(L_))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new xl),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,n=this.attributes.instanceEnd;if(e!==void 0&&n!==void 0){const i=this.boundingSphere.center;this.boundingBox.getCenter(i);let r=0;for(let s=0,o=e.count;s<o;s++)_c.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(_c)),_c.fromBufferAttribute(n,s),r=Math.max(r,i.distanceToSquared(_c));this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}}const Nf=new gt,I_=new L,U_=new L,Yt=new gt,Kt=new gt,Si=new gt,Lf=new L,If=new Nt,Zt=new I2,F_=new L,yc=new $r,Sc=new xl,Mi=new gt;let bi,xs;function O_(t,e,n){return Mi.set(0,0,-e,1).applyMatrix4(t.projectionMatrix),Mi.multiplyScalar(1/Mi.w),Mi.x=xs/n.width,Mi.y=xs/n.height,Mi.applyMatrix4(t.projectionMatrixInverse),Mi.multiplyScalar(1/Mi.w),Math.abs(Math.max(Mi.x,Mi.y))}function DU(t,e){const n=t.matrixWorld,i=t.geometry,r=i.attributes.instanceStart,s=i.attributes.instanceEnd,o=Math.min(i.instanceCount,r.count);for(let a=0,l=o;a<l;a++){Zt.start.fromBufferAttribute(r,a),Zt.end.fromBufferAttribute(s,a),Zt.applyMatrix4(n);const c=new L,u=new L;bi.distanceSqToSegment(Zt.start,Zt.end,u,c),u.distanceTo(c)<xs*.5&&e.push({point:u,pointOnLine:c,distance:bi.origin.distanceTo(u),object:t,face:null,faceIndex:a,uv:null,uv1:null})}}function NU(t,e,n){const i=e.projectionMatrix,s=t.material.resolution,o=t.matrixWorld,a=t.geometry,l=a.attributes.instanceStart,c=a.attributes.instanceEnd,u=Math.min(a.instanceCount,l.count),f=-e.near;bi.at(1,Si),Si.w=1,Si.applyMatrix4(e.matrixWorldInverse),Si.applyMatrix4(i),Si.multiplyScalar(1/Si.w),Si.x*=s.x/2,Si.y*=s.y/2,Si.z=0,Lf.copy(Si),If.multiplyMatrices(e.matrixWorldInverse,o);for(let d=0,p=u;d<p;d++){if(Yt.fromBufferAttribute(l,d),Kt.fromBufferAttribute(c,d),Yt.w=1,Kt.w=1,Yt.applyMatrix4(If),Kt.applyMatrix4(If),Yt.z>f&&Kt.z>f)continue;if(Yt.z>f){const _=Yt.z-Kt.z,M=(Yt.z-f)/_;Yt.lerp(Kt,M)}else if(Kt.z>f){const _=Kt.z-Yt.z,M=(Kt.z-f)/_;Kt.lerp(Yt,M)}Yt.applyMatrix4(i),Kt.applyMatrix4(i),Yt.multiplyScalar(1/Yt.w),Kt.multiplyScalar(1/Kt.w),Yt.x*=s.x/2,Yt.y*=s.y/2,Kt.x*=s.x/2,Kt.y*=s.y/2,Zt.start.copy(Yt),Zt.start.z=0,Zt.end.copy(Kt),Zt.end.z=0;const S=Zt.closestPointToPointParameter(Lf,!0);Zt.at(S,F_);const g=V3.lerp(Yt.z,Kt.z,S),h=g>=-1&&g<=1,m=Lf.distanceTo(F_)<xs*.5;if(h&&m){Zt.start.fromBufferAttribute(l,d),Zt.end.fromBufferAttribute(c,d),Zt.start.applyMatrix4(o),Zt.end.applyMatrix4(o);const _=new L,M=new L;bi.distanceSqToSegment(Zt.start,Zt.end,M,_),n.push({point:M,pointOnLine:_,distance:bi.origin.distanceTo(M),object:t,face:null,faceIndex:d,uv:null,uv1:null})}}}class LU extends ei{constructor(e=new ME,n=new SE({color:Math.random()*16777215})){super(e,n),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,n=e.attributes.instanceStart,i=e.attributes.instanceEnd,r=new Float32Array(2*n.count);for(let o=0,a=0,l=n.count;o<l;o++,a+=2)I_.fromBufferAttribute(n,o),U_.fromBufferAttribute(i,o),r[a]=a===0?0:r[a-1],r[a+1]=r[a]+I_.distanceTo(U_);const s=new zp(r,2,1);return e.setAttribute("instanceDistanceStart",new wr(s,1,0)),e.setAttribute("instanceDistanceEnd",new wr(s,1,1)),this}raycast(e,n){const i=this.material.worldUnits,r=e.camera;r===null&&!i&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const s=e.params.Line2!==void 0&&e.params.Line2.threshold||0;bi=e.ray;const o=this.matrixWorld,a=this.geometry,l=this.material;xs=l.linewidth+s,a.boundingSphere===null&&a.computeBoundingSphere(),Sc.copy(a.boundingSphere).applyMatrix4(o);let c;if(i)c=xs*.5;else{const f=Math.max(r.near,Sc.distanceToPoint(bi.origin));c=O_(r,f,l.resolution)}if(Sc.radius+=c,bi.intersectsSphere(Sc)===!1)return;a.boundingBox===null&&a.computeBoundingBox(),yc.copy(a.boundingBox).applyMatrix4(o);let u;if(i)u=xs*.5;else{const f=Math.max(r.near,yc.distanceToPoint(bi.origin));u=O_(r,f,l.resolution)}yc.expandByScalar(u),bi.intersectsBox(yc)!==!1&&(i?DU(this,n):NU(this,r,n))}onBeforeRender(e){const n=this.material.uniforms;n&&n.resolution&&(e.getViewport(Nf),this.material.uniforms.resolution.value.set(Nf.z,Nf.w))}}const Nu={d4:4,d6:6,d8:8,d10:10,d12:12,d20:20};function EE(t,e){const n=String(t.data.骰子??t.data.die??e).toLowerCase();return n.includes("d4")?"d4":n.includes("d6")?"d6":n.includes("d8")?"d8":n.includes("d10")?"d10":n.includes("d12")?"d12":n.includes("d20")?"d20":e}function IU(t,e){var o,a,l,c,u;const n=t.data,i=EE(t,e),r=`D${Nu[i]}`;if(t.type==="dice_test"){const f=String(n.结果??n.roll??((a=(o=n.掷骰)==null?void 0:o.match(/D\d+=(\d+)/))==null?void 0:a[1])??"?");return{dieLabel:r,roll:f,total:String(n.总计??f),attr:String(n.属性??"骰子测试"),verdict:String(n.描述??"结果已生成")}}return t.type==="skill_check"?{dieLabel:"D20",roll:((l=n.掷骰)==null?void 0:l.replace("D20=",""))||"?",total:String(n.总计??"?"),dc:String(n.DC??"?"),success:!!n.成功,attr:String(n.属性??"")}:{dieLabel:"D20",roll:((u=(c=n.攻击掷骰)==null?void 0:c.match(/D20=(\d+)/))==null?void 0:u[1])||"?",total:String(n.总计??"?"),dc:"AC"+String(n.目标AC??"?"),success:!!n.命中,attr:String(n.武器??"")}}function UU(t,e){switch(t){case"d4":return new Ug(e,0);case"d6":return new jo(e*2,e*2,e*2);case"d8":return new Ig(e,0);case"d10":return new Dg(e*.82,e*.82,e*1.95,10,1,!1);case"d12":return new Ng(e,0);case"d20":default:return new Lg(e,0)}}function FU(t){return[{normal:new L(0,1,0),center:new L(0,t,0)},{normal:new L(0,-1,0),center:new L(0,-t,0)},{normal:new L(1,0,0),center:new L(t,0,0)},{normal:new L(-1,0,0),center:new L(-t,0,0)},{normal:new L(0,0,1),center:new L(0,0,t)},{normal:new L(0,0,-1),center:new L(0,0,-t)}]}function OU(t){const e=t*.82;return Array.from({length:10},(n,i)=>{const r=Math.PI*2*i/10,s=new L(Math.cos(r),0,Math.sin(r)).normalize();return{normal:s,center:s.clone().multiplyScalar(e)}})}function kU(t,e){const n=t.attributes.position.array,i=n.length/9/e|0,r=[];for(let s=0;s<e;s++){const o=new L,a=s*i*9,l=new L(n[a],n[a+1],n[a+2]),c=new L(n[a+3],n[a+4],n[a+5]),u=new L(n[a+6],n[a+7],n[a+8]),f=new L().crossVectors(c.clone().sub(l),u.clone().sub(l)).normalize();for(let d=0;d<i;d++){const p=(s*i+d)*9,v=new L(n[p],n[p+1],n[p+2]),S=new L(n[p+3],n[p+4],n[p+5]),g=new L(n[p+6],n[p+7],n[p+8]);o.add(v).add(S).add(g)}o.multiplyScalar(1/(i*3)),f.dot(o)<0&&f.negate(),r.push({center:o,normal:f})}return r}function BU(t){const e=document.createElement("canvas");e.width=72,e.height=72;const n=e.getContext("2d");return n.fillStyle="#d4a843",n.textAlign="center",n.textBaseline="middle",n.font="bold 70px Georgia, serif",n.fillText(String(t),36,36),new h2(e)}function kg({dice:t,dieType:e="d20",onClose:n}){const[i,r]=G.useState(!1),[s,o]=G.useState(!1),[a,l]=G.useState(!1),c=G.useRef([]);G.useEffect(()=>{if(!t){r(!1);return}c.current.forEach(clearTimeout),c.current=[],r(!0),o(!0),l(!1);const g=window.setTimeout(()=>{o(!1),window.setTimeout(()=>l(!0),950)},1200),h=window.setTimeout(()=>n(),4600);return c.current=[g,h],()=>c.current.forEach(clearTimeout)},[t]);const u=t?IU(t,e):null,f=t?Number(t.data.加值??0):0,d=t?EE(t,e):e,p=Nu[d],v=Number(u==null?void 0:u.roll)===p,S=(u==null?void 0:u.roll)==="1";return x.jsx("div",{className:"dice-overlay",style:{display:i?"flex":"none"},onClick:a?n:void 0,children:x.jsxs(ut.div,{className:"dice-modal dice-modal-3d",initial:{scale:.6,opacity:0},animate:{scale:i?1:.6,opacity:i?1:0},transition:{type:"spring",stiffness:260,damping:22},onClick:g=>g.stopPropagation(),children:[x.jsx(Bg,{dieType:d,roll:Number(u==null?void 0:u.roll),rolling:s,revealed:a}),a&&u&&x.jsxs(ut.div,{className:"dice-info",initial:{opacity:0},animate:{opacity:1},transition:{duration:.3},children:[u.attr&&x.jsx("div",{className:"dice-attr",children:u.attr}),x.jsxs("div",{className:"dice-calc",children:[x.jsx("span",{children:u.dieLabel}),x.jsx("span",{className:`dice-roll-val ${v?"text-teal":""} ${S?"text-danger":""}`,children:u.roll}),f!==0&&x.jsxs(x.Fragment,{children:[x.jsx("span",{children:f>0?"+":""}),x.jsx("span",{children:f})]}),(f!==0||u.total!==u.roll)&&x.jsxs(x.Fragment,{children:[x.jsx("span",{children:"="}),x.jsx("span",{className:"dice-total",children:u.total})]})]}),u.dc&&x.jsxs("div",{className:"dice-dc",children:[x.jsx("span",{children:"/"}),x.jsxs("span",{children:["DC ",u.dc.replace("AC","").trim()]})]}),(u.verdict||typeof u.success=="boolean")&&x.jsx(ut.div,{className:`dice-verdict ${typeof u.success=="boolean"?u.success?"verdict-success":"verdict-fail":"verdict-neutral"}`,initial:{scale:0},animate:{scale:1},transition:{delay:.1,type:"spring",stiffness:400},children:u.verdict||(v?"🎉 大成功!":S?"💀 大失败!":u.success?"通过 ✓":"失败 ✗")})]})]})})}function Bg({dieType:t="d20",roll:e=null,rolling:n=!1,revealed:i=!1,size:r=220,className:s=""}){const o=G.useRef(null),a=G.useRef(null),l=G.useRef(!1);G.useEffect(()=>{l.current=n},[n]),G.useEffect(()=>{const p=o.current;if(!p)return;const v=new t2,S=new od(-2.5,2.5,2.5,-2.5,.1,20);S.position.set(0,0,4.8),S.lookAt(0,0,0);const g=new PU({antialias:!0,alpha:!0});g.setSize(r,r),g.setPixelRatio(Math.min(window.devicePixelRatio,2)),g.setClearColor(0,0),p.appendChild(g.domElement),v.add(new A2(16777215,.6));const h=new o_(16775399,1.6);h.position.set(4,3,5),v.add(h);const m=new o_(9141611,.6);m.position.set(-3,-2,-4),v.add(m);const _=new b2(16771248,.8);_.position.set(0,5,2),v.add(_);const M=new va,w=Nu[t],T=UU(t,1.5);M.add(new ei(T,new S2({color:4857984,metalness:.45,roughness:.25})));const R=new ME().fromEdgesGeometry(new m2(T,12));M.add(new LU(R,new SE({color:13936707,linewidth:.03,worldUnits:!0})));const y=t==="d6"?FU(1.5):t==="d10"?OU(1.5):kU(T,w),C=t==="d6"?1.2:t==="d10"?.72:.55;y.forEach(({center:I,normal:$},K)=>{const ie=new ei(new yl(C,C),new Rg({map:BU(K+1),transparent:!0,side:wi}));ie.position.copy(I).add($.clone().multiplyScalar(.015)),ie.setRotationFromQuaternion(new Vr().setFromUnitVectors(new L(0,0,1),$)),M.add(ie)}),v.add(M);const D=y.map(I=>I.normal),P=new L(0,0,1);let N=null,H=null,V=0,F=0;const j=new D2;function B(){F=requestAnimationFrame(B);const I=Math.min(j.getDelta(),.1);if(N&&H){const $=Date.now()-V,K=Math.min($/50,1),ie=K<.5?2*K*K:1-Math.pow(-2*K+2,2)/2;M.quaternion.copy(H).slerp(N,ie),K>=1&&(N=null,H=null)}else l.current&&(M.rotation.x+=I*9,M.rotation.y+=I*7,M.rotation.z+=I*5);g.render(v,S)}return B(),M.userData.faceToCamera=I=>{const $=D[I];$&&(H=M.quaternion.clone(),N=new Vr().setFromUnitVectors($.clone(),P),V=Date.now())},a.current={diceGroup:M,renderer:g,animId:F},()=>{cancelAnimationFrame(F),g.dispose(),p.contains(g.domElement)&&p.removeChild(g.domElement),a.current=null}},[t,r]),G.useEffect(()=>{var S;const p=Number(e);if(n||!Number.isFinite(p)||p<1)return;l.current=!1;const v=(S=a.current)==null?void 0:S.diceGroup.userData;v!=null&&v.faceToCamera&&v.faceToCamera(p-1)},[n,e]);const c=Nu[t],u=Number(e),f=u===c,d=u===1;return x.jsx("div",{className:`dice-canvas-wrap ${s}`.trim(),ref:o,style:{width:r,height:r},children:i&&Number.isFinite(u)&&x.jsx(ut.div,{className:`dice-result-badge ${f?"badge-crit":""} ${d?"badge-fumble":""}`,initial:{scale:0,rotateZ:-30},animate:{scale:1,rotateZ:0},transition:{type:"spring",stiffness:360,damping:16},children:x.jsx("span",{className:"badge-num",children:u})})})}const zU=["slot-1","slot-2","slot-3","slot-4","slot-5"],VU={"slot-1":"存档一","slot-2":"存档二","slot-3":"存档三","slot-4":"存档四","slot-5":"存档五"};function GU(t){if(!t)return"未记录时间";const e=new Date(t.includes("T")?t:t.replace(" ","T"));return Number.isNaN(e.getTime())?t:e.toLocaleString("zh-CN",{month:"2-digit",day:"2-digit",hour:"2-digit",minute:"2-digit",hour12:!1})}function zg({saves:t,busySlot:e="",disabled:n=!1,message:i="",messageTone:r="neutral",title:s="冒险存档",onRefresh:o,onSave:a,onLoad:l}){const c=new Map(t.map(f=>[f.slot_key,f])),u=!!e;return x.jsxs("div",{className:"save-load-panel",children:[x.jsxs("div",{className:"save-load-header",children:[x.jsx("span",{children:s}),o&&x.jsx("button",{type:"button",onClick:o,disabled:u,children:"刷新"})]}),i&&x.jsx("p",{className:`save-message save-message-${r}`,children:i}),x.jsx("div",{className:"save-slot-list",children:zU.map(f=>{const d=c.get(f),p=e===f;return x.jsxs("div",{className:`save-slot ${d?"has-save":""}`,children:[x.jsxs("div",{className:"save-slot-copy",children:[x.jsx("strong",{children:(d==null?void 0:d.title)||VU[f]}),x.jsx("small",{children:d?`${d.player_name} · ${d.char_class} Lv.${d.level}`:"空存档位"}),x.jsx("em",{children:d?`${GU(d.saved_at)} · ${d.current_area}`:"尚未写入冒险记录"})]}),x.jsxs("div",{className:"save-slot-actions",children:[a&&x.jsx("button",{type:"button",onClick:()=>a(f),disabled:n||u,children:p?"...":"存"}),x.jsx("button",{type:"button",onClick:()=>l(f),disabled:n||u||!d,children:p?"...":"读"})]})]},f)})})]})}function HU({saves:t,saveBusySlot:e,saveMessage:n,saveMessageTone:i,onBack:r,onRefreshSaves:s,onLoadSave:o}){return x.jsx("main",{className:"load-game-screen",children:x.jsxs(ut.section,{className:"load-game-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.35,ease:"easeOut"},children:[x.jsxs("header",{className:"load-game-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"LOAD GAME"}),x.jsx("h1",{children:"读取存档"})]}),x.jsx("button",{type:"button",className:"ghost-button",onClick:r,children:"返回"})]}),x.jsx("div",{className:"load-game-panel",children:x.jsx(zg,{title:"冒险记录",saves:t,busySlot:e,message:n,messageTone:i,onRefresh:s,onLoad:o})})]})})}function jU({error:t,onRetry:e}){const[n,i]=G.useState(0);return G.useEffect(()=>{const r=window.setInterval(()=>i(s=>(s+1)%4),400);return()=>window.clearInterval(r)},[]),x.jsx("div",{className:"loading-screen",children:x.jsxs("div",{className:"loading-panel",children:[x.jsx(ut.div,{initial:{scale:.88,opacity:0},animate:{scale:1,opacity:1},className:"loading-sigil",children:"SC"}),x.jsx("h1",{children:"碎冠之影"}),x.jsx("div",{className:"loading-rule"}),t?x.jsxs(x.Fragment,{children:[x.jsx("p",{className:"loading-error",children:"召唤失败"}),x.jsx("p",{className:"loading-detail",children:t}),x.jsx("button",{onClick:e,className:"primary-button",children:"返回"})]}):x.jsxs("p",{children:["地下城主正在搭建冒险舞台",".".repeat(n)]})]})})}const WU=[{key:"str",name:"力量"},{key:"dex",name:"敏捷"},{key:"con",name:"体质"},{key:"int",name:"智力"},{key:"wis",name:"感知"},{key:"cha",name:"魅力"}];function XU({onStart:t,onBack:e,saves:n=[],saveBusySlot:i="",saveMessage:r="",saveMessageTone:s="neutral",onRefreshSaves:o,onLoadSave:a}){const[l,c]=G.useState("冒险者"),[u,f]=G.useState(0),[d,p]=G.useState(!1),v=Kh[u];function S(){t({player_name:l.trim()||"冒险者",char_class:v.name,attr_str:v.stats.str,attr_dex:v.stats.dex,attr_con:v.stats.con,attr_int:v.stats.int,attr_wis:v.stats.wis,attr_cha:v.stats.cha,level:3})}return x.jsxs("div",{className:"start-screen",children:[x.jsxs(ut.div,{initial:{opacity:0,y:24},animate:{opacity:1,y:0},className:"start-layout",children:[x.jsxs("header",{className:"start-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"D&D AI-TRPG"}),x.jsx("h1",{children:"碎冠之影"})]}),x.jsxs("div",{className:"start-header-copy",children:[x.jsx("p",{children:"王冠城的雾正在升起，地下裂隙等待回应。"}),e&&x.jsx("button",{type:"button",className:"ghost-button",onClick:e,children:"返回"})]})]}),x.jsxs("section",{className:"creator-grid",children:[x.jsxs("div",{className:"creator-column",children:[x.jsx("label",{className:"field-label",htmlFor:"player-name",children:"冒险者姓名"}),x.jsx("input",{id:"player-name",value:l,maxLength:12,onChange:g=>c(g.target.value),className:"text-field"}),x.jsx("div",{className:"class-list",role:"listbox","aria-label":"选择职业",children:Kh.map((g,h)=>x.jsxs("button",{type:"button","aria-selected":u===h,onClick:()=>f(h),className:`class-option ${u===h?"is-selected":""}`,children:[x.jsx("span",{className:"class-mark",children:g.mark}),x.jsxs("span",{children:[x.jsx("strong",{children:g.name}),x.jsx("small",{children:g.desc})]})]},g.id))})]}),x.jsxs(ut.div,{initial:{opacity:0,x:16},animate:{opacity:1,x:0},className:"class-sheet",children:[x.jsxs("div",{className:"sheet-title",children:[x.jsx("span",{children:v.name}),x.jsxs("small",{children:["HP ",kP(v.stats.con)," / AC ",BP(v.id)]})]}),x.jsx("div",{className:"stat-list",children:WU.map(g=>{const h=v.stats[g.key];return x.jsxs("div",{className:"stat-row",children:[x.jsx("span",{children:g.name}),x.jsx("div",{className:"stat-track",children:x.jsx("i",{style:{width:`${h/18*100}%`}})}),x.jsxs("b",{children:[h," (",B1(h),")"]})]},g.key)})}),x.jsxs("div",{className:"trait-grid",children:[x.jsxs("div",{children:[x.jsx("h3",{children:"优势"}),v.pros.map(g=>x.jsx("p",{children:g},g))]}),x.jsxs("div",{children:[x.jsx("h3",{children:"限制"}),v.cons.map(g=>x.jsx("p",{children:g},g))]})]}),x.jsxs("div",{className:"skill-preview",children:[x.jsxs("div",{children:[x.jsx("h3",{children:"战斗技能"}),v.skills.combat.map(g=>x.jsxs("p",{children:[x.jsx("b",{children:g.name}),x.jsx("span",{children:g.check})]},g.name))]}),x.jsxs("div",{children:[x.jsx("h3",{children:"非战斗技能"}),v.skills.nonCombat.map(g=>x.jsxs("p",{children:[x.jsx("b",{children:g.name}),x.jsx("span",{children:g.check})]},g.name))]})]}),x.jsx("button",{type:"button",onClick:S,className:"start-button",children:"深入地下城"})]},v.id)]})]}),a&&x.jsx("button",{type:"button",className:"load-save-fab",onClick:()=>p(!0),title:"读取存档",children:"📂"}),x.jsx(Ur,{children:d&&x.jsx(ut.div,{className:"save-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>p(!1),children:x.jsxs(ut.div,{className:"save-modal",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},onClick:g=>g.stopPropagation(),children:[x.jsxs("div",{className:"save-modal-header",children:[x.jsx("span",{children:"读取存档"}),x.jsx("button",{type:"button",onClick:()=>p(!1),children:"✕"})]}),x.jsx(zg,{title:"读取存档",saves:n,busySlot:i,message:r,messageTone:s,onRefresh:o,onLoad:g=>{a==null||a(g),p(!1)}})]})})})]})}const $U=[["str","力量"],["dex","敏捷"],["con","体质"],["int","智力"],["wis","感知"],["cha","魅力"]],YU=[{name:"移动",count:"1 次移动额度",example:"走路、攀爬、跳跃",rule:"可拆分在动作前后，倒地起身消耗一半速度。"},{name:"动作",count:"1 次",example:"攻击、施法、疾走",rule:"本回合主要行动；攻击/施法/闪避/协助等互斥。"},{name:"附赠动作",count:"视能力而定",example:"回气、双持、职业技能",rule:"只有技能或法术明确写明时才能使用。"},{name:"自由互动",count:"通常 1 次",example:"拔剑、开门、取物",rule:"2024 规则中拔/收武器可作为攻击动作一部分。"},{name:"反应",count:"每轮 1 次",example:"借机攻击、护盾术、护卫",rule:"在其他角色回合触发，自己的回合开始时刷新。"}],KU=[{name:"攻击",summary:"D20 + 属性调整值 + 熟练加值 >= 目标 AC。"},{name:"施法",summary:"按法术描述进行攻击、豁免或自动生效。"},{name:"疾走",summary:"本回合获得额外移动，等于速度值。"},{name:"撤离",summary:"本回合移动不会触发借机攻击。"},{name:"闪避",summary:"敌人攻击你有劣势，你的敏捷豁免有优势。"},{name:"协助",summary:"让盟友下一次攻击或技能检定获得优势。"},{name:"躲藏",summary:"DEX 潜行 vs 感知察觉，成功后获得隐形。"},{name:"准备",summary:"设定触发条件，之后用反应执行。"},{name:"搜索",summary:"感知察觉或智力调查寻找隐藏目标。"},{name:"使用物件",summary:"激活道具、机关或需要动作的物品。"}],qU=[{title:"先攻",text:"1D20 + 敏捷调整值 + 其他加值；同分时我方优先，其次比较敏捷。"},{title:"命中",text:"D20 + 属性调整值 + 熟练加值 >= AC；20 自动命中，1 自动未命中。"},{title:"优势",text:"优势投 2 次取高，劣势投 2 次取低；同时存在时互相抵消。"},{title:"专注",text:"受伤后进行体质豁免，DC 为 10 或伤害一半取高。"}],ZU="/assets/battle/b1-sanctum-placeholder.png",as=[{id:"pc-adventurer",name:"冒险者",faction:"ally",role:"战士 Lv.3 / 重装先锋",portrait:"冒",model:"adventurer",hp:30,maxHp:30,ac:18,speed:30,proficiency:2,abilities:{str:16,dex:13,con:15,int:10,wis:12,cha:8},weaponMastery:"长剑 Sap / 战斧 Topple / 巨剑 Graze / 长矛 Slow / 战锤 Push",resourceProfile:["动作压制","附赠恢复/控制","反应护卫"],statuses:["戒备","板甲","前排"],traits:["HP30 / AC18","熟练加值 +2","战士武器精通槽位 2","短休技能：回气、破甲连斩"],skills:[{id:"F1",name:"断筋斩",resource:"动作",source:"职业技能",formula:"STR + 熟练 vs AC；命中后 1d8+3 挥砍",effect:"命中后目标 DEX 豁免 DC13，失败则速度减半 1 轮。",cooldown:"无",rule:"攻击检定 + Topple/推撞变体",roll:{kind:"attack",ability:"str",targetAc:14,label:"断筋斩命中判定"},tags:["攻击","减速","武器精通"]},{id:"F2",name:"盾牌猛击",resource:"附赠动作",source:"职业技能",formula:"STR 运动 DC13；伤害 1d4+3 钝击",effect:"目标 STR 豁免 DC13，失败则倒地。",cooldown:"每战斗 2 次",rule:"Shove 推撞机制",roll:{kind:"ability",ability:"str",dc:13,label:"盾牌猛击运动检定"},tags:["检定","倒地","附赠动作"]},{id:"F3",name:"回气",resource:"附赠动作",source:"职业技能",formula:"恢复 1d10 + 战士等级",effect:"立即恢复生命值，用于测试治疗骰和附赠动作占用。",cooldown:"每次短休 1 次",rule:"HP 与恢复",roll:{kind:"healing",dieType:"d10",diceCount:1,bonus:3,label:"回气恢复量"},tags:["治疗","D10","短休"]},{id:"F4",name:"嘲讽咆哮",resource:"附赠动作",source:"职业技能",formula:"CHA 威吓 DC14；敌人 WIS 豁免 DC13",effect:"15 尺内敌人失败后对你以外目标攻击受限制，持续 1 轮。",cooldown:"每战斗 1 次",rule:"Help 动作反用 + 魅惑变体",roll:{kind:"ability",ability:"cha",dc:14,label:"嘲讽咆哮威吓检定"},tags:["控制","劣势","群体"]},{id:"F5",name:"护卫拦截",resource:"反应",source:"职业技能",formula:"无需掷骰；5 尺内队友被攻击时触发",effect:"你用反应替队友承受一半伤害，伤害类型不变。",cooldown:"每轮 1 次",rule:"反应 + 半身掩护变体",roll:{kind:"none"},tags:["反应","护卫","减伤"],trigger:"5 尺内队友被攻击"},{id:"F6",name:"破甲连斩",resource:"动作",source:"职业技能",formula:"STR + 熟练 vs AC，连击 2 次",effect:"每次命中造成武器骰+STR，两次都命中额外 1d6 挥砍。",cooldown:"每次短休 1 次",rule:"多重攻击",roll:{kind:"attack",ability:"str",targetAc:18,label:"破甲连斩首击"},tags:["攻击","连击","破甲"]},{id:"F7",name:"战争践踏",resource:"动作",source:"职业技能",formula:"STR 运动 DC15；范围 DEX 豁免 DC13",effect:"10 尺锥形，失败者倒地并受束缚 1 轮。",cooldown:"每次长休 1 次",rule:"倒地 + 束缚状态",roll:{kind:"ability",ability:"str",dc:15,label:"战争践踏运动检定"},tags:["范围","倒地","束缚"]}],nonCombatSkills:[{name:"破门开路",check:"STR 运动 DC12-18",effect:"撞开上锁的门、栅栏或石棺。"},{name:"战场读势",check:"WIS 洞悉 DC14",effect:"预判伏击时先攻有优势；识破弱点后首轮攻击 +2。"},{name:"军械鉴定",check:"INT 调查 DC12",effect:"识别武器品质、附魔或隐藏机关。"},{name:"负重拖拽",check:"STR 运动 DC13",effect:"拖拽倒地队友或重物，速度减半。"}]},{id:"ally-grum",name:"格鲁姆",faction:"ally",role:"矮人战士 / 铁锤破阵",portrait:"格",model:"grum",hp:52,maxHp:52,ac:18,speed:25,proficiency:2,abilities:{str:18,dex:12,con:17,int:9,wis:13,cha:10},weaponMastery:"战锤 Push",resourceProfile:["动作击倒","附赠临时 HP","反应代伤"],statuses:["护卫","矮人韧性","前排"],traits:["HP52 / AC18","战锤 1d8+4 钝击","Push 精通","队友专属护卫反应"],skills:[{id:"GM1",name:"裂地猛击",resource:"动作",source:"队友技能",formula:"STR + 熟练 vs AC；1d8+4 钝击",effect:"命中后目标 STR 豁免 DC15，失败倒地；近战攻击对其有优势。",cooldown:"无",rule:"攻击检定 + 倒地状态",roll:{kind:"attack",ability:"str",targetAc:14,label:"裂地猛击命中判定"},tags:["攻击","倒地","优势"]},{id:"GM2",name:"铜墙铁壁",resource:"附赠动作",source:"队友技能",formula:"获得 2d8 临时 HP，无需 D20",effect:"临时 HP 优先扣除，且下回合获得闪避效果。",cooldown:"每战斗 1 次",rule:"临时生命值 + 闪避",roll:{kind:"damage",dieType:"d8",diceCount:2,bonus:0,label:"铜墙铁壁临时 HP"},tags:["临时HP","闪避","附赠动作"]},{id:"GM3",name:"舍身护卫",resource:"反应",source:"队友技能",formula:"无需掷骰；5 尺内队友被攻击时触发",effect:"格鲁姆完全承受该次伤害，队友受到 0 伤害。",cooldown:"每战斗 1 次",rule:"反应 + 护卫",roll:{kind:"none"},tags:["反应","代伤","护卫"],trigger:"5 尺内队友被攻击"},{id:"GM4",name:"酒桶冲锋",resource:"动作",source:"队友技能",formula:"STR 运动 DC15；路径敌人 DEX 豁免 DC15",effect:"直线 20 尺冲刺，失败者倒地；终点对最近敌人进行一次攻击。",cooldown:"每次短休 1 次",rule:"移动 + 冲撞可选规则",roll:{kind:"ability",ability:"str",dc:15,label:"酒桶冲锋运动检定"},tags:["移动","冲撞","倒地"]}],nonCombatSkills:[{name:"矮人石工",check:"STR 运动 +4，DC12-16",effect:"鉴定石造机关、暗门或矿脉。"},{name:"酒馆人脉",check:"CHA 说服 +3，DC13",effect:"打听城市传闻、黑市中介和酒馆情报。"},{name:"酒量比拼",check:"CON 豁免 DC15",effect:"喝倒对方套取情报，失败则自己醉酒。"}]},{id:"ally-lisa",name:"丽莎",faction:"ally",role:"半精灵游荡者 / 影刃",portrait:"丽",model:"lisa",hp:38,maxHp:38,ac:16,speed:30,proficiency:2,abilities:{str:10,dex:18,con:14,int:12,wis:13,cha:8},weaponMastery:"短剑 Vex / 匕首 Nick",resourceProfile:["动作偷袭","附赠隐形/束缚","反应反击"],statuses:["潜行","双持","后排突袭"],traits:["HP38 / AC16","DEX +4","偷袭 2d6","Vex 命中后下击优势"],skills:[{id:"LS1",name:"暗影突袭",resource:"动作",source:"队友技能",formula:"DEX + 熟练 vs AC；1d6+4 + 2d6 偷袭",effect:"需有优势或目标 5 尺内有盟友；Vex 使下次对同目标攻击有优势。",cooldown:"每回合 1 次偷袭",rule:"偷袭 + 优势系统",roll:{kind:"attack",ability:"dex",targetAc:14,label:"暗影突袭命中判定"},tags:["攻击","偷袭","优势"]},{id:"LS2",name:"烟中恶鬼",resource:"附赠动作",source:"队友技能",formula:"DEX 潜行 DC15",effect:"成功后隐形 1 轮；本回合已造成伤害则自动成功。",cooldown:"每战斗 1 次",rule:"隐形 + 重度遮蔽",roll:{kind:"ability",ability:"dex",dc:15,label:"烟中恶鬼潜行检定"},tags:["隐形","优势","附赠动作"]},{id:"LS3",name:"暗器投网",resource:"附赠动作",source:"队友技能",formula:"DEX + 熟练 vs AC，射程 20/40",effect:"命中后目标受束缚 1 轮：速度 0、攻击劣势、被攻击优势。",cooldown:"每战斗 1 次",rule:"受束缚状态",roll:{kind:"attack",ability:"dex",targetAc:14,label:"暗器投网命中判定"},tags:["束缚","远程","附赠动作"]},{id:"LS4",name:"毒蛇反击",resource:"反应",source:"队友技能",formula:"DEX + 熟练 vs AC；1d4+4 穿刺 + 1d6 毒素",effect:"被近战攻击时对攻击者进行一次匕首反击。",cooldown:"每轮 1 次",rule:"反应攻击 + 毒素伤害",roll:{kind:"attack",ability:"dex",targetAc:14,label:"毒蛇反击命中判定"},tags:["反应","反击","毒素"],trigger:"丽莎被近战攻击"}],nonCombatSkills:[{name:"拆陷大师",check:"DEX 巧手 +6，DC12-18",effect:"解除陷阱或开锁，大成功可反转陷阱。"},{name:"阴影潜行",check:"DEX 潜行 +6",effect:"引导队伍潜行路线，降低全队被察觉概率。"},{name:"暗语解读",check:"INT 调查 +4，DC14",effect:"解读盗贼黑话、暗影教会暗号或地下标记。"}]},{id:"ally-talia",name:"塔莉亚",faction:"ally",role:"龙血法师学徒",portrait:"塔",model:"talia",hp:24,maxHp:24,ac:14,speed:30,proficiency:2,abilities:{str:8,dex:14,con:14,int:17,wis:12,cha:13},weaponMastery:"无；法术位 1级×3 / 2级×1",resourceProfile:["动作法术","反应元素抗性","短休爆发"],statuses:["奥术专注","龙血","远程"],traits:["HP24 / AC14","INT +3","法术豁免 DC14","灰烬之裔易伤变体"],skills:[{id:"TL1",name:"炽焰射线",resource:"动作",source:"队友技能",formula:"INT + 熟练 vs AC；1d10 火焰",effect:"命中后目标 DEX 豁免 DC14，失败着火，下回合开始受 1d4 火焰。",cooldown:"无，戏法",rule:"法术攻击 + 持续伤害",roll:{kind:"attack",ability:"int",targetAc:14,label:"炽焰射线命中判定"},tags:["法术攻击","火焰","持续伤害"]},{id:"TL2",name:"龙火护罩",resource:"反应",source:"队友技能",formula:"无需掷骰；火焰/冷冻伤害触发",effect:"你或 10 尺内盟友获得该伤害类型抗性，仅对本次生效。",cooldown:"每战斗 2 次",rule:"抗性：伤害减半",roll:{kind:"none"},tags:["反应","抗性","减伤"],trigger:"受到火焰或冷冻伤害"},{id:"TL3",name:"灼热金属",resource:"动作",source:"队友技能",formula:"自动生效；2d8 火焰；CON 豁免 DC14",effect:"穿金属护甲目标失败后卸除武器/护甲，下回合无法攻击。",cooldown:"消耗 1级法术位",rule:"自动命中 + 缴械可选规则",roll:{kind:"save",dc:14,targetSaveBonus:3,label:"目标 CON 豁免"},tags:["火焰","缴械","豁免"]},{id:"TL4",name:"龙火星爆",resource:"动作",source:"队友技能",formula:"15 尺锥形；DEX 豁免 DC14；3d6 火焰",effect:"失败全伤、成功半伤；自己受 1d4 火焰反噬。灰烬之裔伤害翻倍。",cooldown:"每次短休 1 次",rule:"范围豁免 + 易伤",roll:{kind:"save",dc:14,targetSaveBonus:3,label:"目标 DEX 豁免"},tags:["范围","火焰","易伤"]},{id:"TL5",name:"龙息觉醒",resource:"动作",source:"队友技能",formula:"30 尺锥形；DEX 豁免 DC15；4d6 火焰",effect:"信任 > 80 且完成龙血觉醒事件后解锁，无反噬。",cooldown:"每次长休 1 次",rule:"剧情解锁技能",roll:{kind:"save",dc:15,targetSaveBonus:3,label:"目标 DEX 豁免"},tags:["锁定","范围","火焰"],locked:!0}],nonCombatSkills:[{name:"奥术译读",check:"INT 奥秘 +6，DC12-18",effect:"解读古代文字、魔法卷轴或符文。"},{name:"法师塔礼仪",check:"INT 历史 +4 或 CHA 说服 +3",effect:"在法师塔或学术场合获取情报。"},{name:"血脉共鸣",check:"被动",effect:"30 尺内感知龙类、龙血生物或龙相关魔法物品。"}]},{id:"enemy-templar",name:"被腐化的圣堂骑士",faction:"enemy",role:"精英敌人 / 灰烬重甲",portrait:"圣",model:"templar",hp:56,maxHp:56,ac:18,speed:30,proficiency:2,abilities:{str:18,dex:11,con:16,int:10,wis:12,cha:14},weaponMastery:"巨剑 Graze / 腐化光环",resourceProfile:["动作高伤","附赠黯蚀","反应招架"],statuses:["腐化","重甲","首领"],traits:["HP56 / AC18","STR +4","重甲威压","灰烬腐化抗性"],skills:[{id:"ET1",name:"黑誓巨剑",resource:"动作",source:"敌方技能",formula:"STR + 熟练 vs AC；2d6+4 挥砍",effect:"命中后可追加 1d6 黯蚀；未命中仍可用 Graze 造成 STR 调整值伤害。",cooldown:"无",rule:"攻击检定 + Graze",roll:{kind:"attack",ability:"str",targetAc:18,label:"黑誓巨剑命中判定"},tags:["攻击","黯蚀","精通"]},{id:"ET2",name:"灰烬裁决",resource:"动作",source:"敌方技能",formula:"CHA 威吓 vs WIS 豁免 DC14",effect:"失败者恐慌 1 轮，无法主动靠近圣堂骑士。",cooldown:"每战斗 1 次",rule:"恐慌状态",roll:{kind:"save",dc:14,targetSaveBonus:1,label:"我方 WIS 豁免"},tags:["控制","恐慌","豁免"]},{id:"ET3",name:"余烬招架",resource:"反应",source:"敌方技能",formula:"无需掷骰；被近战命中时触发",effect:"本次受到的物理伤害 -1d8，并对攻击者造成 1d4 火焰。",cooldown:"每轮 1 次",rule:"反应 + 伤害减免",roll:{kind:"none"},tags:["反应","减伤","火焰"],trigger:"被近战攻击命中"}],nonCombatSkills:[]},{id:"enemy-ash-a",name:"灰烬之影小兵A",faction:"enemy",role:"影裔爪牙 / 快速骚扰",portrait:"影A",model:"shade",hp:18,maxHp:18,ac:14,speed:35,proficiency:2,abilities:{str:10,dex:16,con:12,int:8,wis:11,cha:7},resourceProfile:["动作爪击","附赠位移","反应撤影"],statuses:["轻盈","灰烬之裔"],traits:["HP18 / AC14","DEX +3","速度 35 尺","受光耀/龙火克制"],skills:[{id:"EA1",name:"暗影爪击",resource:"动作",source:"敌方技能",formula:"DEX + 熟练 vs AC；1d6+3 挥砍",effect:"命中后可向 5 尺内另一个目标施加轻度遮蔽。",cooldown:"无",rule:"近战攻击",roll:{kind:"attack",ability:"dex",targetAc:16,label:"暗影爪击命中判定"},tags:["攻击","近战","遮蔽"]},{id:"EA2",name:"烟影位移",resource:"附赠动作",source:"敌方技能",formula:"移动 15 尺，无需掷骰",effect:"不触发借机攻击，优先贴近后排。",cooldown:"每轮 1 次",rule:"移动 + 借机攻击例外",roll:{kind:"none"},tags:["移动","撤离","附赠动作"]}],nonCombatSkills:[]},{id:"enemy-ash-b",name:"灰烬之影小兵B",faction:"enemy",role:"影裔爪牙 / 快速骚扰",portrait:"影B",model:"shade",hp:18,maxHp:18,ac:14,speed:35,proficiency:2,abilities:{str:10,dex:16,con:12,int:8,wis:11,cha:7},resourceProfile:["动作爪击","附赠位移","反应撤影"],statuses:["轻盈","灰烬之裔"],traits:["HP18 / AC14","DEX +3","速度 35 尺","受光耀/龙火克制"],skills:[{id:"EB1",name:"暗影爪击",resource:"动作",source:"敌方技能",formula:"DEX + 熟练 vs AC；1d6+3 挥砍",effect:"命中后可向 5 尺内另一个目标施加轻度遮蔽。",cooldown:"无",rule:"近战攻击",roll:{kind:"attack",ability:"dex",targetAc:16,label:"暗影爪击命中判定"},tags:["攻击","近战","遮蔽"]},{id:"EB2",name:"烟影位移",resource:"附赠动作",source:"敌方技能",formula:"移动 15 尺，无需掷骰",effect:"不触发借机攻击，优先贴近后排。",cooldown:"每轮 1 次",rule:"移动 + 借机攻击例外",roll:{kind:"none"},tags:["移动","撤离","附赠动作"]}],nonCombatSkills:[]}];function La(t){return Math.floor((t-10)/2)}function _s(t){return t>=0?`+${t}`:String(t)}function Vg(t){return Math.floor(Math.random()*t)+1}function $c(){return Vg(20)}function QU(t){return Number(t.replace("d",""))}function k_(t){return t.map(e=>{const n=La(e.abilities.dex),i=e.initiativeBonus??0,r=$c();return{unitId:e.id,roll:r,dexMod:n,otherBonus:i,total:r+n+i}})}function TE(t,e){return[...t].sort((n,i)=>{if(i.total!==n.total)return i.total-n.total;if(i.dexMod!==n.dexMod)return i.dexMod-n.dexMod;const r=e.get(n.unitId),s=e.get(i.unitId);return(r==null?void 0:r.faction)!==(s==null?void 0:s.faction)?(r==null?void 0:r.faction)==="ally"?-1:1:as.findIndex(o=>o.id===n.unitId)-as.findIndex(o=>o.id===i.unitId)})}function Gg(t){return Math.max(0,Math.min(100,t.hp/Math.max(t.maxHp,1)*100))}function JU(t){return t.roll.kind!=="none"}function Lu(t,e){return!!e[t]}function B_(t){return t.roll.kind==="healing"?"选择恢复对象":t.tags.some(e=>["临时HP","隐形","抗性"].includes(e))?"选择自身或受益者":t.tags.some(e=>["范围","群体"].includes(e))?"选择范围中心或主要目标":t.roll.kind==="none"&&t.trigger?"选择预设保护对象":"选择释放目标"}function z_(t,e,n,i){return e.name==="回气"||e.tags.includes("临时HP")||e.name==="烟中恶鬼"?[t]:e.roll.kind==="healing"||e.roll.kind==="none"&&e.tags.some(r=>["护卫","抗性","减伤"].includes(r))?n:t.faction==="ally"?i:n}function eF(t){const e=[...t.matchAll(/(\d*)d(\d+)(?:\s*[+＋]\s*(\d+))?/gi)];if(e.length===0)return null;const n=[];let i=0;return e.forEach(r=>{const s=Number(r[1]||1),o=Number(r[2]),a=Number(r[3]||0),l=Array.from({length:s},()=>Vg(o)),c=l.reduce((u,f)=>u+f,0)+a;i+=c,n.push(`${s}d${o}${a?`+${a}`:""}: ${l.join("+")}${a?`+${a}`:""}`)}),{total:i,detail:n.join("；")}}function la(t){var e,n;return t?t.type==="attack_roll"?`D20 ${((e=t.data.攻击掷骰)==null?void 0:e.replace("D20=",""))??"?"} + ${t.data.加值??0} = ${t.data.总计??"?"} / AC ${t.data.目标AC??"?"}`:t.type==="skill_check"?`D20 ${((n=t.data.掷骰)==null?void 0:n.replace("D20=",""))??"?"} + ${t.data.加值??0} = ${t.data.总计??"?"} / DC ${t.data.DC??"?"}`:`${t.data.骰子??"骰子"} ${t.data.掷骰??""}，总计 ${t.data.总计??t.data.结果??"?"}`:"无掷骰，按触发条件直接生效。"}function V_(t,e,n,i){const r=eF(n.formula),s=(i==null?void 0:i.type)==="dice_test"?Number(i.data.总计??i.data.结果??0):r==null?void 0:r.total;if(!i)return{id:Date.now(),actorName:t.name,targetName:e.name,skillName:n.name,title:"触发/预设生效",formula:n.formula,resultLine:la(null),detail:`${e.name} 已被指定为 ${n.name} 的对象。${n.effect}`};if(i.type==="attack_roll"){const o=!!i.data.命中;return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:o?"攻击命中":"攻击未命中",formula:n.formula,resultLine:la(i),amount:o?s:void 0,success:o,detail:o?`${e.name} 受到${s?`约 ${s} 点`:""}效果结算。${r?`伤害骰：${r.detail}。`:""}${n.effect}`:`${e.name} 未被命中，本次主要效果不触发。若技能有 Graze、半伤或后续豁免，后续规则引擎会继续处理。`}}if(i.type==="skill_check"&&n.roll.kind==="save"){const o=!!i.data.成功;return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:o?"目标豁免成功":"目标豁免失败",formula:n.formula,resultLine:la(i),amount:r==null?void 0:r.total,success:!o,detail:o?`${e.name} 通过豁免，效果减弱或按规则改为半伤。${r?`基础伤害骰：${r.detail}。`:""}`:`${e.name} 豁免失败，技能完整生效。${r?`基础伤害骰：${r.detail}，合计 ${r.total}。`:""}${n.effect}`}}if(i.type==="skill_check"){const o=!!i.data.成功;return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:o?"检定成功":"检定失败",formula:n.formula,resultLine:la(i),amount:o?s:void 0,success:o,detail:o?`${n.effect}${r?` 结算骰：${r.detail}，合计 ${r.total}。`:""}`:"本次检定失败，技能主要效果不触发。"}}return{id:Number(i.data.id??Date.now()),actorName:t.name,targetName:e.name,skillName:n.name,title:n.roll.kind==="healing"?"治疗结算":"骰子结算",formula:n.formula,resultLine:la(i),amount:s,success:!0,detail:`${e.name} 获得 ${s??0} 点${n.roll.kind==="healing"?"治疗":"效果值"}。${n.effect}`}}function tF(t){const e=`${t.roll.label??""} ${t.formula} ${t.effect}`;return/CON|体质/.test(e)?"con":/WIS|感知/.test(e)?"wis":/STR|力量/.test(e)?"str":/CHA|魅力/.test(e)?"cha":/INT|智力/.test(e)?"int":"dex"}function G_(t,e,n){if(e.roll.kind==="none")return null;const i=Date.now();if(e.roll.kind==="attack"){const f=$c(),p=La(t.abilities[e.roll.ability??"str"])+t.proficiency+(e.roll.bonus??0),v=f+p,S=(n==null?void 0:n.ac)??e.roll.targetAc??14;return{type:"attack_roll",data:{骰子:"D20",武器:`${t.name}：${e.name}`,攻击掷骰:`D20=${f}`,加值:p,总计:v,目标AC:S,命中:f===20||f!==1&&v>=S,id:i}}}if(e.roll.kind==="ability"){const f=$c(),p=La(t.abilities[e.roll.ability??"str"])+t.proficiency+(e.roll.bonus??0),v=f+p,S=e.roll.dc??13;return{type:"skill_check",data:{骰子:"D20",属性:`${t.name}：${e.roll.label??e.name}`,掷骰:`D20=${f}`,加值:p,总计:v,DC:S,成功:f===20||f!==1&&v>=S,id:i}}}if(e.roll.kind==="save"){const f=$c(),d=tF(e),p=n?La(n.abilities[d]):e.roll.targetSaveBonus??2,v=f+p,S=e.roll.dc??13;return{type:"skill_check",data:{骰子:"D20",属性:`${e.roll.label??"目标豁免"}：${e.name}`,掷骰:`D20=${f}`,加值:p,总计:v,DC:S,成功:f===20||f!==1&&v>=S,id:i}}}const r=e.roll.dieType??"d6",s=e.roll.diceCount??1,o=QU(r),a=Array.from({length:s},()=>Vg(o)),l=a.reduce((f,d)=>f+d,0),c=e.roll.bonus??0,u=l+c;return{type:"dice_test",data:{骰子:r.toUpperCase(),属性:`${t.name}：${e.roll.label??e.name}`,掷骰:`${r.toUpperCase()}=${a[0]}`,结果:a[0],加值:c,总计:u,描述:s>1?`${s}${r} 合计 ${a.join(" + ")} = ${l}`:"结果已生成",id:i}}}function nF({onBack:t}){var tt;const[e,n]=G.useState(()=>k_(as)),[i,r]=G.useState("initiative"),[s,o]=G.useState(1),[a,l]=G.useState(0),[c,u]=G.useState(()=>Object.fromEntries(as.map(J=>[J.id,J.hp]))),[f,d]=G.useState(null),[p,v]=G.useState(null),[S,g]=G.useState(null),[h,m]=G.useState(null),[_,M]=G.useState(null),w=G.useRef(null),[T,R]=G.useState({}),[y,C]=G.useState(["战斗测试按 DND 战斗规则详解与职业/队友技能 V2 初始化。"]),D=G.useMemo(()=>as.map(J=>({...J,hp:Math.max(0,Math.min(J.maxHp,c[J.id]??J.hp))})),[c]),P=G.useMemo(()=>new Map(D.map(J=>[J.id,J])),[D]),N=G.useMemo(()=>TE(e,P),[e,P]),H=N[a%N.length],V=H?P.get(H.unitId):void 0,F=V==null?void 0:V.id,j=V==null?void 0:V.faction,B=f?P.get(f):void 0,I=p?P.get(p):void 0,$=G.useMemo(()=>D.filter(J=>J.faction==="ally"),[D]),K=G.useMemo(()=>D.filter(J=>J.faction==="enemy"),[D]),ie=S?(tt=P.get(S.unitId))==null?void 0:tt.skills.find(J=>J.id===S.skillId):void 0,fe=S?P.get(S.unitId):void 0,Fe=fe&&ie?z_(fe,ie,$,K):[],Be=G.useMemo(()=>new Set(Fe.map(J=>J.id)),[Fe]),Le=i==="battle"&&(V==null?void 0:V.faction)==="enemy",Q=G.useCallback(()=>r("battle"),[]);function le(J){C(be=>[J,...be].slice(0,4))}function ce(){n(k_(as)),r("initiative"),o(J=>J+1),l(0),d(null),v(null),g(null),m(null),M(null),w.current=null,u(Object.fromEntries(as.map(J=>[J.id,J.hp]))),R({}),le("重新进行全员 1D20 先攻判定。")}function Ae(){l(J=>(J+1)%N.length),v(null),g(null),R({}),m(null),w.current=null}function Ie(J){if(fe&&ie&&Fe.some(be=>be.id===J.id)){Re(fe,ie,J);return}if(J.id===(V==null?void 0:V.id)&&J.faction==="ally"&&i==="battle"){v(J.id);return}d(J.id)}function Re(J,be,Ve){if(be.locked||Lu(be.resource,T[J.id]??{}))return;R(O=>({...O,[J.id]:{...O[J.id]??{},[be.resource]:!0}}));const $e=G_(J,be,Ve),vt=V_(J,Ve,be,$e);et(Ve,be,vt),g(null),M(vt),le(`${J.name} 对 ${Ve.name} 使用 ${be.name}：${vt.title}`),$e&&m($e)}function et(J,be,Ve){if(!(!Ve.amount||Ve.amount<=0)){if(be.roll.kind==="healing"){u($e=>({...$e,[J.id]:Math.min(J.maxHp,($e[J.id]??J.hp)+Ve.amount)}));return}Ve.success&&u($e=>({...$e,[J.id]:Math.max(0,($e[J.id]??J.hp)-Ve.amount)}))}}function Oe(J,be){J.faction!=="ally"||J.id!==(V==null?void 0:V.id)||be.locked||Lu(be.resource,T[J.id]??{})||(g({unitId:J.id,skillId:be.id}),le(`${J.name} 准备 ${be.name}，等待指定释放对象。`))}return G.useEffect(()=>{if(i!=="battle"||!F||j!=="enemy")return;const J=P.get(F);if(!J)return;const be=`${a}-${F}`;if(w.current===be)return;w.current=be,v(null),g(null),le(`${J.name} 的敌方回合开始，我方操作锁定。`);const Ve=[...P.values()].filter(ae=>ae.faction==="ally"),$e=[...P.values()].filter(ae=>ae.faction==="enemy"),vt=J.skills.find(ae=>ae.resource==="动作")??J.skills[0],O=z_(J,vt,Ve,$e),xt=O.reduce((ae,Se)=>Se.hp<ae.hp?Se:ae,O[0]),Ye=window.setTimeout(()=>{const ae=G_(J,vt,xt),Se=V_(J,xt,vt,ae);et(xt,vt,Se),M(Se),le(`${J.name} 自动对 ${xt.name} 使用 ${vt.name}：${Se.title}`),ae&&m(ae)},780),at=window.setTimeout(()=>{l(ae=>(ae+1)%N.length),R({}),m(null),g(null),w.current=null},5600);return()=>{window.clearTimeout(Ye),window.clearTimeout(at)}},[j,F,N.length,i,a]),x.jsxs("main",{className:"battle-test-screen",children:[x.jsx("div",{className:"battle-background",style:{backgroundImage:`url(${ZU})`}}),x.jsx("div",{className:"battle-overlay"}),x.jsxs("header",{className:"battle-hud-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"B1 COMBAT RULE SANDBOX"}),x.jsx("h1",{children:"B1 层战斗测试"}),x.jsx("small",{children:"加载《职业与队友技能体系 V2》与《DND战斗规则详解》：动作经济、先攻、攻击/豁免/治疗骰。"})]}),x.jsxs("div",{className:"battle-hud-actions",children:[x.jsx("button",{type:"button",className:"ghost-button",onClick:ce,children:"重投先攻"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:Ae,disabled:i!=="battle"||Le,children:"下一行动"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:t,children:"返回测试"})]})]}),x.jsx("section",{className:"initiative-track","aria-label":"行动顺序",children:N.map((J,be)=>{const Ve=P.get(J.unitId);if(!Ve)return null;const $e=Ve.id===(V==null?void 0:V.id)&&i==="battle";return x.jsxs("button",{type:"button",className:`initiative-token ${$e?"is-active":""} ${Ve.faction==="enemy"?"is-enemy":"is-ally"}`,onClick:()=>d(Ve.id),"aria-current":$e?"true":void 0,children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${Ve.model}`,children:Ve.portrait}),x.jsxs("span",{className:"initiative-token-copy",children:[x.jsx("b",{children:Ve.name}),x.jsxs("small",{children:[J.roll," ",_s(J.dexMod),J.otherBonus?` ${_s(J.otherBonus)}`:""," = ",J.total]})]}),x.jsx("i",{children:be+1})]},Ve.id)})}),x.jsx("section",{className:"battle-rules-dock","aria-label":"规则速查",children:qU.map(J=>x.jsxs("article",{children:[x.jsx("b",{children:J.title}),x.jsx("span",{children:J.text})]},J.title))}),Le&&V&&x.jsxs("section",{className:"battle-enemy-turn-lock","aria-label":"敌方回合",children:[x.jsx("b",{children:"敌方回合"}),x.jsxs("span",{children:[V.name," 正在自动行动，我方操作暂时锁定。"]})]}),x.jsx(H_,{title:"我方",units:$,activeUnitId:V==null?void 0:V.id,onSelect:d}),x.jsx(H_,{title:"敌方",units:K,activeUnitId:V==null?void 0:V.id,onSelect:d,align:"right"}),x.jsxs("section",{className:"battle-field","aria-label":"战斗场景",children:[x.jsx("div",{className:"battle-side battle-side-ally",children:$.map(J=>x.jsx(j_,{unit:J,active:J.id===(V==null?void 0:V.id)&&i==="battle",targetable:Be.has(J.id),onClick:()=>Ie(J)},J.id))}),x.jsx("div",{className:"battle-side battle-side-enemy",children:K.map(J=>x.jsx(j_,{unit:J,active:J.id===(V==null?void 0:V.id)&&i==="battle",targetable:Be.has(J.id),onClick:()=>Ie(J)},J.id))})]}),x.jsxs("aside",{className:"battle-log-panel","aria-label":"战斗记录",children:[x.jsx("span",{children:"规则事件"}),y.map(J=>x.jsx("p",{children:J},J))]}),_&&x.jsx(rF,{effect:_}),x.jsxs("div",{className:"battle-turn-plate",children:[x.jsx("span",{children:i==="battle"?"当前行动":"等待先攻揭示"}),x.jsx("b",{children:(V==null?void 0:V.name)??"等待先攻"}),H&&x.jsxs("small",{children:["先攻 ",H.total,"，D20 ",H.roll," + 敏捷 ",_s(H.dexMod),H.otherBonus?` + 其他 ${H.otherBonus}`:""]})]}),x.jsx(Ur,{children:B&&x.jsx(sF,{unit:B,initiative:e.find(J=>J.unitId===B.id),onClose:()=>d(null)},B.id)}),x.jsx(Ur,{children:I&&!Le&&I.id===(V==null?void 0:V.id)&&x.jsx(aF,{unit:I,usedResources:T[I.id]??{},pendingSkill:ie,pendingTargets:Fe,onInspect:()=>d(I.id),onClose:()=>v(null),onEndTurn:Ae,onChooseSkill:J=>Oe(I,J),onSelectTarget:J=>{ie&&Re(I,ie,J)},onCancelTarget:()=>g(null)},I.id)}),x.jsx(kg,{dice:h,dieType:"d20",onClose:()=>m(null)}),x.jsx(Ur,{children:i==="initiative"&&x.jsx(iF,{entries:e,unitMap:P,onComplete:Q},s)})]})}function iF({entries:t,unitMap:e,onComplete:n}){const[i,r]=G.useState(!1),[s,o]=G.useState(!1),a=G.useMemo(()=>TE(t,e),[t,e]);return G.useEffect(()=>{const l=window.setTimeout(()=>r(!0),1300),c=window.setTimeout(()=>o(!0),2200),u=window.setTimeout(n,3900);return()=>{window.clearTimeout(l),window.clearTimeout(c),window.clearTimeout(u)}},[n]),x.jsx(ut.section,{className:"battle-init-roll-backdrop",role:"dialog","aria-modal":"true","aria-label":"先攻判定",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:x.jsxs(ut.div,{className:"battle-init-roll-panel",initial:{opacity:0,scale:.96,y:16},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.96,y:16},children:[x.jsxs("header",{children:[x.jsx("p",{className:"eyebrow",children:"INITIATIVE ROLL"}),x.jsx("h2",{children:"同时投掷先攻"}),x.jsx("small",{children:"7 位单位同时进行 1D20 判定：D20 + 敏捷调整值 + 其他加值。"})]}),x.jsx("div",{className:"battle-init-roll-grid",children:t.map(l=>{const c=e.get(l.unitId);if(!c)return null;const u=a.findIndex(f=>f.unitId===c.id)+1;return x.jsxs("article",{className:`battle-init-card ${s?"is-revealed":""}`,children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${c.model}`,children:c.portrait}),x.jsxs("div",{className:"battle-init-card-copy",children:[x.jsx("b",{children:c.name}),x.jsx("small",{children:c.faction==="ally"?"我方":"敌方"})]}),x.jsx(Bg,{dieType:"d20",roll:l.roll,rolling:!i,revealed:s,size:112,className:"battle-init-dice-wrap"}),x.jsx("p",{children:s?`${l.roll} ${_s(l.dexMod)}${l.otherBonus?` ${_s(l.otherBonus)}`:""} = ${l.total}`:i?"确认结果":"掷骰中"}),s&&x.jsxs("i",{children:["第 ",u," 位"]})]},c.id)})})]})})}function H_({title:t,units:e,activeUnitId:n,align:i="left",onSelect:r}){return x.jsxs("aside",{className:`battle-roster battle-roster-${i}`,children:[x.jsx("span",{className:"battle-roster-title",children:t}),e.map(s=>x.jsxs("button",{type:"button",className:`battle-roster-unit ${s.id===n?"is-active":""}`,onClick:()=>r(s.id),children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${s.model}`,children:s.portrait}),x.jsxs("span",{className:"battle-roster-copy",children:[x.jsx("b",{children:s.name}),x.jsxs("small",{children:["HP ",s.hp,"/",s.maxHp," · AC ",s.ac]}),x.jsx("span",{className:"battle-mini-hp",children:x.jsx("i",{style:{width:`${Gg(s)}%`}})})]})]},s.id))]})}function j_({unit:t,active:e,targetable:n,onClick:i}){return x.jsxs("button",{type:"button",className:`battle-combatant ${e?"is-active":""} ${n?"is-targetable":""} ${t.faction==="enemy"?"is-enemy":"is-ally"}`,onClick:i,"aria-label":t.name,children:[x.jsxs("span",{className:`battle-sprite battle-sprite-${t.model}`,children:[x.jsx("span",{className:"sprite-aura"}),x.jsx("span",{className:"sprite-head"}),x.jsx("span",{className:"sprite-body"}),x.jsx("span",{className:"sprite-weapon"})]}),x.jsx("span",{className:"battle-combatant-name",children:t.name}),x.jsx("span",{className:"battle-combatant-hp",children:x.jsx("i",{style:{width:`${Gg(t)}%`}})})]})}function rF({effect:t}){return x.jsxs(ut.aside,{className:`battle-effect-panel ${t.success===!1?"is-fail":""}`,"aria-label":"回合效果",initial:{opacity:0,y:16},animate:{opacity:1,y:0},children:[x.jsx("span",{children:"本回合结算"}),x.jsx("h2",{children:t.title}),x.jsxs("p",{children:[x.jsx("b",{children:t.actorName})," 对 ",x.jsx("b",{children:t.targetName})," 使用 ",x.jsx("b",{children:t.skillName})]}),x.jsx("strong",{children:t.resultLine}),typeof t.amount=="number"&&x.jsx("em",{children:t.amount}),x.jsx("small",{children:t.formula}),x.jsx("p",{children:t.detail})]},t.id)}function sF({unit:t,initiative:e,onClose:n}){return x.jsx(ut.div,{className:"battle-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:n,children:x.jsxs(ut.section,{className:"battle-unit-modal",role:"dialog","aria-modal":"true","aria-label":`${t.name} 详情`,initial:{opacity:0,scale:.94,y:16},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.94,y:16},onClick:i=>i.stopPropagation(),children:[x.jsxs("header",{className:"battle-modal-header",children:[x.jsx("div",{className:`battle-avatar-mark battle-avatar-${t.model}`,children:t.portrait}),x.jsxs("div",{children:[x.jsx("span",{children:t.name}),x.jsx("small",{children:t.role})]}),x.jsx("button",{type:"button","aria-label":"关闭",onClick:n,children:"×"})]}),x.jsxs("div",{className:"battle-detail-grid",children:[x.jsxs("section",{className:"battle-detail-block",children:[x.jsx("h2",{children:"状态"}),x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"HP"}),x.jsxs("b",{children:[t.hp,"/",t.maxHp]})]}),x.jsx("div",{className:"battle-wide-hp",children:x.jsx("i",{style:{width:`${Gg(t)}%`}})}),x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"AC"}),x.jsx("b",{children:t.ac})]}),x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"速度"}),x.jsxs("b",{children:[t.speed," 尺"]})]}),x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"熟练"}),x.jsx("b",{children:_s(t.proficiency)})]}),e&&x.jsxs("div",{className:"battle-stat-row",children:[x.jsx("span",{children:"先攻"}),x.jsx("b",{children:e.total})]}),t.weaponMastery&&x.jsxs("div",{className:"battle-stat-note",children:[x.jsx("b",{children:"精通/资源"}),x.jsx("span",{children:t.weaponMastery})]}),x.jsx("div",{className:"battle-status-list",children:t.statuses.map(i=>x.jsx("span",{children:i},i))})]}),x.jsxs("section",{className:"battle-detail-block battle-abilities",children:[x.jsx("h2",{children:"六维数值"}),$U.map(([i,r])=>{const s=t.abilities[i];return x.jsxs("div",{className:"battle-ability-tile",children:[x.jsx("span",{children:r}),x.jsx("b",{children:s}),x.jsx("small",{children:_s(La(s))})]},i)})]}),x.jsxs("section",{className:"battle-detail-block battle-traits",children:[x.jsx("h2",{children:"规则画像"}),t.traits.map(i=>x.jsx("span",{children:i},i)),t.resourceProfile.map(i=>x.jsx("span",{children:i},i))]}),x.jsxs("section",{className:"battle-detail-block battle-skills",children:[x.jsx("h2",{children:"战斗技能"}),t.skills.map(i=>x.jsx(oF,{skill:i,compact:!1},i.id))]}),t.nonCombatSkills.length>0&&x.jsxs("section",{className:"battle-detail-block battle-noncombat-skills",children:[x.jsx("h2",{children:"非战斗技能"}),t.nonCombatSkills.map(i=>x.jsxs("article",{children:[x.jsx("b",{children:i.name}),x.jsx("small",{children:i.check}),x.jsx("p",{children:i.effect})]},i.name))]})]})]})})}function oF({skill:t,compact:e=!0}){return x.jsxs("article",{className:`battle-skill-card ${t.locked?"is-locked":""} ${e?"is-compact":""}`,children:[x.jsxs("div",{className:"battle-skill-card-head",children:[x.jsx("span",{children:t.resource}),x.jsx("b",{children:t.name}),x.jsx("em",{children:t.cooldown})]}),x.jsx("small",{children:t.formula}),!e&&x.jsx("p",{children:t.effect}),x.jsxs("div",{className:"battle-skill-meta",children:[x.jsx("i",{children:JU(t)?"需掷骰":"无掷骰"}),x.jsx("i",{children:t.rule}),t.trigger&&x.jsx("i",{children:t.trigger}),t.tags.map(n=>x.jsx("i",{children:n},n))]})]})}function aF({unit:t,usedResources:e,pendingSkill:n,pendingTargets:i,onInspect:r,onClose:s,onEndTurn:o,onChooseSkill:a,onSelectTarget:l,onCancelTarget:c}){return x.jsxs(ut.section,{className:"battle-action-sheet",role:"dialog","aria-label":`${t.name} 行动`,initial:{opacity:0,y:28},animate:{opacity:1,y:0},exit:{opacity:0,y:28},children:[x.jsxs("header",{children:[x.jsxs("div",{children:[x.jsxs("span",{children:[t.name," 的回合"]}),x.jsx("small",{children:"先选技能，再指定释放对象，随后进入骰子判定与效果结算。"})]}),x.jsxs("div",{className:"battle-action-buttons",children:[x.jsx("button",{type:"button",className:"ghost-button",onClick:r,children:"详情"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:s,children:"收起"}),x.jsx("button",{type:"button",className:"start-button",onClick:o,children:"结束回合"})]})]}),x.jsxs("div",{className:"battle-action-content",children:[x.jsx("section",{className:"battle-resource-grid","aria-label":"回合资源",children:YU.map(u=>{const f=Lu(u.name,e);return x.jsxs("article",{className:f?"is-spent":"",children:[x.jsx("b",{children:u.name}),x.jsx("span",{children:u.count}),x.jsx("small",{children:u.example}),x.jsx("em",{children:f?"已用":"可用"})]},u.name)})}),x.jsx("section",{className:"battle-action-skill-list","aria-label":"可用技能",children:t.skills.map(u=>{const d=Lu(u.resource,e)||u.locked;return x.jsxs("button",{type:"button",className:`${d?"is-disabled":""} ${(n==null?void 0:n.id)===u.id?"is-selected":""}`,disabled:d,onClick:()=>a(u),children:[x.jsx("span",{children:u.resource}),x.jsx("b",{children:u.name}),x.jsx("small",{children:u.formula}),x.jsx("em",{children:B_(u)})]},u.id)})}),n&&x.jsxs("section",{className:"battle-target-picker","aria-label":"指定释放对象",children:[x.jsxs("header",{children:[x.jsxs("div",{children:[x.jsx("b",{children:"指定释放对象"}),x.jsxs("span",{children:[n.name," · ",B_(n)]})]}),x.jsx("button",{type:"button",className:"ghost-button",onClick:c,children:"取消"})]}),x.jsx("div",{children:i.map(u=>x.jsxs("button",{type:"button",onClick:()=>l(u),children:[x.jsx("span",{className:`battle-avatar-mark battle-avatar-${u.model}`,children:u.portrait}),x.jsx("b",{children:u.name}),x.jsxs("small",{children:["HP ",u.hp,"/",u.maxHp," · AC ",u.ac]})]},u.id))})]}),x.jsx("section",{className:"battle-basic-actions","aria-label":"基础动作",children:KU.map(u=>x.jsxs("article",{children:[x.jsx("b",{children:u.name}),x.jsx("span",{children:u.summary})]},u.name))})]})]})}const Uf=5,Mc=3,Hg=[1,2,3,4,5,6].map(t=>({id:`face-${t}`,label:`${t} 点`,section:"upper",description:`只计算所有 ${t} 点骰子的点数总和。`,score:e=>e.filter(n=>n===t).reduce((n,i)=>n+i,0)})),jg=[{id:"three-kind",label:"三条",section:"lower",description:"至少 3 颗骰子点数相同，得所有骰子的点数总和。",score:t=>Of(t,3)?Ff(t):0},{id:"four-kind",label:"四条",section:"lower",description:"至少 4 颗骰子点数相同，得所有骰子的点数总和。",score:t=>Of(t,4)?Ff(t):0},{id:"full-house",label:"葫芦",section:"lower",description:"一组三同点数 + 一组二同点数，固定得 25 分。",score:t=>cF(t)?25:0},{id:"small-straight",label:"小顺",section:"lower",description:"包含连续 4 个点数，例如 1-2-3-4，固定得 30 分。",score:t=>X_(t,4)?30:0},{id:"large-straight",label:"大顺",section:"lower",description:"包含连续 5 个点数，即 1-2-3-4-5 或 2-3-4-5-6，固定得 40 分。",score:t=>X_(t,5)?40:0},{id:"yacht",label:"快艇",section:"lower",description:"5 颗骰子点数完全相同，固定得 50 分。",score:t=>Of(t,5)?50:0},{id:"chance",label:"机会",section:"lower",description:"没有组合限制，得所有骰子的点数总和。",score:Ff}],Zs=[...Hg,...jg],W_=[1,2,3,4,5];function lF(){return Math.floor(Math.random()*6)+1}function Ff(t){return t.reduce((e,n)=>e+n,0)}function wE(t){return t.reduce((e,n)=>(e[n]=(e[n]??0)+1,e),{})}function Of(t,e){return Object.values(wE(t)).some(n=>n>=e)}function cF(t){const e=Object.values(wE(t)).sort((n,i)=>n-i);return e.length===2&&e[0]===2&&e[1]===3}function X_(t,e){const n=Array.from(new Set(t)).sort((r,s)=>r-s);return(e===4?[[1,2,3,4],[2,3,4,5],[3,4,5,6]]:[[1,2,3,4,5],[2,3,4,5,6]]).some(r=>r.every(s=>n.includes(s)))}function $_(){return Object.fromEntries(Zs.map(t=>[t.id,null]))}function uF(t){return Hg.reduce((e,n)=>e+(t[n.id]??0),0)}function dF(t){return jg.reduce((e,n)=>e+(t[n.id]??0),0)}function fF({onBack:t}){const[e,n]=G.useState(W_),[i,r]=G.useState(Array(Uf).fill(!1)),[s,o]=G.useState(0),[a,l]=G.useState(!1),[c,u]=G.useState(!0),[f,d]=G.useState(()=>$_()),[p,v]=G.useState("投掷 5 颗骰子开始本回合。"),S=Zs.filter(P=>f[P.id]!==null).length,g=Math.min(S+1,Zs.length),h=uF(f),m=h>=63?35:0,_=dF(f),M=h+m+_,w=S===Zs.length,T=G.useMemo(()=>Object.fromEntries(Zs.map(P=>[P.id,P.score(e)])),[e]);function R(){n(W_),r(Array(Uf).fill(!1)),o(0),l(!1),u(!0),d($_()),v("投掷 5 颗骰子开始本回合。")}function y(){if(a||w||s>=Mc)return;const P=e.map((N,H)=>i[H]&&s>0?N:lF());n(P),l(!0),u(!1),v("骰子滚动中。"),window.setTimeout(()=>{l(!1),window.setTimeout(()=>{u(!0),o(N=>N+1),v("可以锁定骰子、继续投掷，或选择一个计分格。")},420)},920)}function C(P){a||s===0||w||r(N=>N.map((H,V)=>V===P?!H:H))}function D(P){if(a||w||s===0||f[P.id]!==null)return;const N=P.score(e);d(H=>({...H,[P.id]:N})),r(Array(Uf).fill(!1)),o(0),u(!0),v(`已将 ${N} 分填入「${P.label}」。`)}return x.jsx("main",{className:"yacht-screen",children:x.jsxs(ut.section,{className:"yacht-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.35,ease:"easeOut"},children:[x.jsxs("header",{className:"test-header yacht-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"YACHT DICE"}),x.jsx("h1",{children:"快艇骰子"})]}),x.jsxs("div",{className:"yacht-header-actions",children:[x.jsx("button",{type:"button",className:"ghost-button",onClick:R,children:"新局"}),x.jsx("button",{type:"button",className:"ghost-button",onClick:t,children:"返回"})]})]}),x.jsxs("div",{className:"yacht-game-grid",children:[x.jsxs("section",{className:"yacht-play-panel","aria-label":"快艇骰子游戏区",children:[x.jsxs("div",{className:"yacht-status-row",children:[x.jsxs("div",{children:[x.jsxs("span",{children:["第 ",g,"/",Zs.length," 回合"]}),x.jsxs("b",{children:["投掷 ",s,"/",Mc]})]}),x.jsxs("strong",{children:["总分 ",M]})]}),x.jsx("div",{className:"yacht-dice-row","aria-label":"五颗骰子",children:e.map((P,N)=>x.jsxs("button",{type:"button",className:`yacht-die ${i[N]?"is-locked":""}`,onClick:()=>C(N),disabled:a||s===0||w,children:[x.jsx(Bg,{dieType:"d6",roll:P,rolling:a&&!(i[N]&&s>0),revealed:c||i[N],size:132,className:"yacht-dice-canvas"}),x.jsx("span",{children:i[N]?"已锁定":s===0?"待投掷":"可锁定"})]},N))}),x.jsxs("div",{className:"yacht-control-row",children:[x.jsx("button",{type:"button",className:"start-button",onClick:y,disabled:a||w||s>=Mc,children:s===0?"投掷骰子":s>=Mc?"选择计分格":"继续投掷"}),x.jsx("p",{children:w?`游戏结束，最终得分 ${M}。`:p})]}),x.jsxs("section",{className:"yacht-rules-panel","aria-label":"快艇骰子规则",children:[x.jsx("h2",{children:"游戏规则"}),x.jsx("p",{children:"快艇骰子使用 5 颗六面骰。玩家要在 13 个回合内把每个计分格各填写一次，最终总分越高越好。"}),x.jsxs("ol",{children:[x.jsx("li",{children:"每回合最多可以投掷 3 次。第一次必须投全部 5 颗骰子。"}),x.jsx("li",{children:"第一次投掷后，可以点击骰子将它锁定。锁定的骰子不会在下一次投掷中变化。"}),x.jsx("li",{children:"你可以随时解锁骰子，只要本回合还没选择计分格。"}),x.jsx("li",{children:"完成任意一次投掷后，必须选择一个尚未使用的计分格。该格分数可能是 0 分。"}),x.jsx("li",{children:"计分后进入下一回合，所有骰子解除锁定，投掷次数归零。"})]}),x.jsx("h3",{children:"上半区与奖励"}),x.jsx("p",{children:"一到六点只计算对应点数的骰子总和。上半区合计达到 63 分时，额外获得 35 分奖励。"}),x.jsx("h3",{children:"下半区组合"}),x.jsx("p",{children:"三条/四条要求至少 3 或 4 颗同点，得全部骰子总和。葫芦固定 25 分，小顺固定 30 分，大顺固定 40 分，五颗同点的快艇固定 50 分，机会直接计算总和。"})]})]}),x.jsx(hF,{scores:f,availableScores:T,rollCount:s,rolling:a,gameOver:w,upper:h,upperBonus:m,lower:_,total:M,onScore:D})]})]})})}function hF({scores:t,availableScores:e,rollCount:n,rolling:i,gameOver:r,upper:s,upperBonus:o,lower:a,total:l,onScore:c}){return x.jsxs("aside",{className:"yacht-score-panel","aria-label":"计分表",children:[x.jsxs("header",{children:[x.jsx("span",{children:"计分表"}),x.jsx("small",{children:"每格只能选择一次"})]}),x.jsx(Y_,{title:"上半区",categories:Hg,scores:t,availableScores:e,rollCount:n,rolling:i,gameOver:r,onScore:c}),x.jsxs("div",{className:"yacht-score-total-row",children:[x.jsx("span",{children:"上半区合计"}),x.jsx("b",{children:s})]}),x.jsxs("div",{className:"yacht-score-total-row",children:[x.jsx("span",{children:"奖励 63+"}),x.jsx("b",{children:o})]}),x.jsx(Y_,{title:"下半区",categories:jg,scores:t,availableScores:e,rollCount:n,rolling:i,gameOver:r,onScore:c}),x.jsxs("div",{className:"yacht-score-total-row",children:[x.jsx("span",{children:"下半区合计"}),x.jsx("b",{children:a})]}),x.jsxs("div",{className:"yacht-grand-total",children:[x.jsx("span",{children:"总分"}),x.jsx("b",{children:l})]})]})}function Y_({title:t,categories:e,scores:n,availableScores:i,rollCount:r,rolling:s,gameOver:o,onScore:a}){return x.jsxs("section",{className:"yacht-score-section",children:[x.jsx("h2",{children:t}),e.map(l=>{const c=n[l.id]!==null;return x.jsxs("button",{type:"button",className:`yacht-score-row ${c?"is-scored":""}`,disabled:c||s||o||r===0,onClick:()=>a(l),children:[x.jsxs("span",{children:[x.jsx("b",{children:l.label}),x.jsx("small",{children:l.description})]}),x.jsx("strong",{children:c?n[l.id]:r>0?i[l.id]:"-"})]},l.id)})]})}const kf=[{type:"d4",label:"四面骰",sides:4},{type:"d6",label:"六面骰",sides:6},{type:"d8",label:"八面骰",sides:8},{type:"d12",label:"十二面骰",sides:12},{type:"d20",label:"二十面骰",sides:20}];function pF({onBack:t}){const[e,n]=G.useState("menu"),[i,r]=G.useState("d20"),[s,o]=G.useState(null),[a,l]=G.useState([]),c=G.useMemo(()=>kf.find(p=>p.type===i)??kf[4],[i]);function u(){if(e==="dice-roll"){n("dice-select");return}if(e==="dice-select"){n("menu");return}if(e==="battle"){n("menu");return}if(e==="yacht"){n("menu");return}t()}function f(p){r(p),n("dice-roll"),o(null)}function d(){if(s)return;const p=Math.floor(Math.random()*c.sides)+1,v=Date.now();l(S=>[{id:v,die:c.type,value:p},...S].slice(0,8)),o({type:"dice_test",data:{骰子:`D${c.sides}`,掷骰:`D${c.sides}=${p}`,结果:p,总计:p,id:v}})}return e==="battle"?x.jsx(nF,{onBack:()=>n("menu")}):e==="yacht"?x.jsx(fF,{onBack:()=>n("menu")}):x.jsxs("main",{className:"test-screen",children:[x.jsxs(ut.section,{className:"test-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.35,ease:"easeOut"},children:[x.jsxs("header",{className:"test-header",children:[x.jsxs("div",{children:[x.jsx("p",{className:"eyebrow",children:"TEST LAB"}),x.jsx("h1",{children:"测试"})]}),x.jsx("button",{type:"button",className:"ghost-button",onClick:u,children:"返回"})]}),e==="menu"&&x.jsxs("section",{className:"test-menu-grid","aria-label":"测试类型",children:[x.jsxs("button",{type:"button",className:"test-mode-button",onClick:()=>n("dice-select"),children:[x.jsx("span",{children:"测试骰子"}),x.jsx("small",{children:"验证 D4、D6、D8、D12、D20 是否能正常投出结果"})]}),x.jsxs("button",{type:"button",className:"test-mode-button",onClick:()=>n("battle"),children:[x.jsx("span",{children:"测试战斗"}),x.jsx("small",{children:"B1 层先攻、行动顺序、角色详情与技能界面"})]}),x.jsxs("button",{type:"button",className:"test-mode-button",onClick:()=>n("yacht"),children:[x.jsx("span",{children:"快艇骰子"}),x.jsx("small",{children:"5 颗 D6、锁骰、计分表与完整规则说明"})]})]}),e==="dice-select"&&x.jsxs("section",{className:"dice-select-panel",children:[x.jsxs("div",{className:"test-section-title",children:[x.jsx("span",{children:"选择骰子"}),x.jsx("small",{children:"选择后进入判定界面"})]}),x.jsx("div",{className:"dice-option-grid",children:kf.map(p=>x.jsxs("button",{type:"button",className:"dice-option-button",onClick:()=>f(p.type),children:[x.jsxs("b",{children:["D",p.sides]}),x.jsx("span",{children:p.label})]},p.type))})]}),e==="dice-roll"&&x.jsxs("section",{className:"dice-judge-panel",children:[x.jsxs("div",{className:"test-section-title",children:[x.jsxs("span",{children:[c.label,"判定"]}),x.jsxs("small",{children:["点击投骰，确认 ",`D${c.sides}`," 可以生成结果"]})]}),x.jsxs("div",{className:"dice-judge-board",children:[x.jsxs("div",{className:"dice-judge-symbol",children:["D",c.sides]}),x.jsxs("div",{className:"dice-judge-copy",children:[x.jsx("strong",{children:a[0]?`最近结果：${a[0].value}`:"等待投骰"}),x.jsx("p",{children:s?"投骰动画进行中":"准备进行一次独立骰子判定。"})]}),x.jsx("button",{type:"button",className:"start-button",onClick:d,disabled:!!s,children:"投骰"})]}),x.jsx("div",{className:"dice-history-list","aria-label":"投骰记录",children:a.length?a.map(p=>x.jsxs("p",{children:[x.jsx("span",{children:p.die.toUpperCase()}),x.jsx("b",{children:p.value})]},p.id)):x.jsx("p",{className:"dice-history-empty",children:"暂无投骰记录"})})]})]}),x.jsx(kg,{dice:s,dieType:i,onClose:()=>o(null)})]})}const mF=[{label:"新游戏",action:"new"},{label:"载入游戏",action:"load"},{label:"设置",action:"settings",disabled:!0},{label:"画廊",action:"gallery",disabled:!0},{label:"测试",action:"test"}];function gF({onNewGame:t,onLoadGame:e,onTest:n}){return x.jsxs("main",{className:"title-menu-screen",children:[x.jsx("div",{className:"title-menu-shade"}),x.jsxs(ut.section,{className:"title-menu-layout",initial:{opacity:0,y:18},animate:{opacity:1,y:0},transition:{duration:.45,ease:"easeOut"},children:[x.jsxs("div",{className:"title-brand",children:[x.jsx("p",{className:"eyebrow",children:"D&D AI-TRPG"}),x.jsx("h1",{children:"碎冠之影"}),x.jsx("div",{className:"title-rule"})]}),x.jsx("nav",{className:"title-menu-actions","aria-label":"主菜单",children:mF.map((i,r)=>{const s=i.action==="new"?t:i.action==="load"?e:i.action==="test"?n:void 0,o="disabled"in i&&i.disabled;return x.jsx(ut.button,{type:"button",className:"title-menu-button",disabled:o,onClick:s,initial:{opacity:0,x:-12},animate:{opacity:1,x:0},transition:{delay:.08+r*.05},children:x.jsx("span",{children:i.label})},i.action)})})]})]})}function vF({items:t}){return x.jsx("div",{className:"event-feed","aria-live":"polite",children:x.jsx(Ur,{children:t.slice(-4).map(e=>x.jsx(ut.div,{initial:{opacity:0,x:18},animate:{opacity:1,x:0},exit:{opacity:0,x:18},className:`event-chip event-${e.tone}`,children:e.text},e.id))})})}function xF(t,e=20){const[n,i]=G.useState(""),[r,s]=G.useState(!0);G.useEffect(()=>{if(!t){i(""),s(!0);return}let a=0;i(""),s(!1);const l=window.setInterval(()=>{a+=1,i(t.slice(0,a)),a>=t.length&&(s(!0),window.clearInterval(l))},e);return()=>window.clearInterval(l)},[e,t]);const o=G.useCallback(()=>{i(t),s(!0)},[t]);return{visible:n,done:r,reveal:o}}function _F({scene:t,line:e,events:n,isStreaming:i,isActionPhase:r,canAdvance:s,actionPanel:o,onAdvance:a}){const l=(e==null?void 0:e.text)||"",{visible:c,done:u,reveal:f}=xF(l),d=(e==null?void 0:e.speaker)||(i?"KP":""),p=G.useMemo(()=>r?"行动":!e&&i?"等待KP":u?s?"下一句":"等待KP":"显示全文",[s,u,r,i,e]);function v(){if(!r&&!(!e&&i)){if(!u){f();return}s&&a()}}return G.useEffect(()=>{function S(g){var h,m;g.key===" "&&!r&&((h=document.activeElement)==null?void 0:h.tagName)!=="INPUT"&&((m=document.activeElement)==null?void 0:m.tagName)!=="TEXTAREA"&&(g.preventDefault(),v())}return window.addEventListener("keydown",S),()=>window.removeEventListener("keydown",S)},[r,s,u,i,e]),x.jsxs("main",{className:`vn-canvas ${t.themeClass}`,onClick:v,children:[x.jsx("div",{className:"scene-layer"}),x.jsx("div",{className:"scene-vignette"}),x.jsxs("header",{className:"scene-header",children:[x.jsx("span",{children:t.title}),x.jsx("small",{children:t.subtitle})]}),x.jsx(vF,{items:n}),x.jsxs(ut.section,{initial:{opacity:0,y:16},animate:{opacity:1,y:0},className:`dialogue-box dialogue-${(e==null?void 0:e.role)||"kp"}`,onClick:S=>S.stopPropagation(),children:[x.jsxs("div",{className:"speaker-row",children:[x.jsx("span",{children:d||"KP"}),i&&x.jsx("i",{children:"思考中"})]}),x.jsx("p",{children:c||(i?"……":"")}),x.jsx("button",{type:"button",onClick:v,disabled:r||!e&&i,className:"next-button",children:p})]},(e==null?void 0:e.id)||"empty-line"),o]})}const Ec=[{id:"crown-city",title:"王冠城",subtitle:"中央广场与王宫高塔",aliases:["王冠城","中央广场","王宫"],themeClass:"scene-crown-city"},{id:"guild",title:"冒险者公会",subtitle:"悬赏、同伴与传闻",aliases:["冒险者公会","公会","碎盾","酒馆"],themeClass:"scene-guild"},{id:"b1-chapel",title:"B1 废弃圣堂",subtitle:"腐化圣光仍在穹顶下回响",aliases:["B1","废弃圣堂","圣堂"],themeClass:"scene-chapel"},{id:"b2-library",title:"B2 幽暗书库",subtitle:"禁忌文字在暗处翻页",aliases:["B2","幽暗书库","书库"],themeClass:"scene-library"},{id:"b3-maze",title:"B3 囚徒迷宫",subtitle:"铁门、回声与追踪印记",aliases:["B3","囚徒迷宫","迷宫"],themeClass:"scene-maze"},{id:"b4-tomb",title:"B4 皇家墓穴",subtitle:"王血与旧誓言沉在石棺中",aliases:["B4","皇家墓穴","墓穴"],themeClass:"scene-tomb"},{id:"b5-sanctum",title:"B5 碎冠圣所",subtitle:"深渊尽头的王冠残响",aliases:["B5","碎冠圣所","圣所","碎冠"],themeClass:"scene-sanctum"}];function yF(t){const e=String(t.current_area||""),n=Ec.find(r=>r.aliases.some(s=>e.includes(s)));if(n)return n;const i=Number(t.cleared_levels||0);return Ec[Math.min(i,Ec.length-1)]||Ec[0]}const Sl="/api/dnd",Tc="KP暂时没有回应，已为本轮处理启用兜底。",SF=/(connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|load\s*failed|timeout|timed\s*out|econn|socket|fetch|body\s*stream|terminated|aborted)/i;function Iu(t,e){const n=String(t||"").trim();return!n||SF.test(n)?e:n}async function Ml(t,e){const n=await t.json().catch(()=>({}));return Iu(n.detail,e)}async function El(t,e,n){try{return await fetch(t,e)}catch(i){throw new Error(Iu(i==null?void 0:i.message,n))}}async function MF(t){const e=await El(`${Sl}/game/create`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(t)},"创建游戏失败");if(!e.ok)throw new Error(await Ml(e,"创建游戏失败"));return e.json()}async function EF(){const t=await El(`${Sl}/saves`,void 0,"获取存档失败");if(!t.ok)throw new Error(await Ml(t,"获取存档失败"));return t.json()}async function TF(t,e){const n=await El(`${Sl}/game/${t}/save`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)},"保存失败");if(!n.ok)throw new Error(await Ml(n,"保存失败"));return n.json()}async function wF(t){const e=await El(`${Sl}/saves/${t}/load`,{method:"POST"},"读取存档失败");if(!e.ok)throw new Error(await Ml(e,"读取存档失败"));return e.json()}function bF(t,e,n,i,r,s,o){const a=new AbortController;return El(`${Sl}/chat/stream`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({game_id:t,message:e}),signal:a.signal},Tc).then(async l=>{if(!l.ok||!l.body)throw new Error(await Ml(l,Tc));const c=l.body.getReader(),u=new TextDecoder;let f="",d=!1;for(;;){const{done:p,value:v}=await c.read();if(p)break;f+=u.decode(v,{stream:!0});const S=f.split(`
`);f=S.pop()||"";for(const g of S)if(g.startsWith("data: "))try{const h=JSON.parse(g.slice(6));h.type==="narrative"?n(h.content):h.type==="system"?i(h.content):h.type==="state_update"?o==null||o(h.content):h.type==="state_snapshot"?o==null||o({type:"snapshot",state:h.content}):h.type==="done"?(d=!0,r()):h.type==="error"&&s(Iu(h.content,Tc))}catch{}}d||r()}).catch(l=>{a.signal.aborted||s(Iu(l==null?void 0:l.message,Tc))}),a}const AF={格鲁姆:"gm_trust",丽莎:"ls_trust",塔莉亚:"tl_trust",伊瑟拉:"ys_trust"},CF={格鲁姆:"gm_hp",丽莎:"ls_hp",塔莉亚:"tl_hp"};function RF(t){const e=t.match(/^\[SYSTEM:(\w+):(\{.+\})\]$/);if(!e)return t.startsWith("[SYSTEM:")||t.startsWith("错误")?null:{type:"text",data:{msg:t}};try{return{type:e[1],data:JSON.parse(e[2])}}catch{return{type:"text",data:{msg:t}}}}function PF(t){var n,i,r;const e=t.data;switch(t.type){case"skill_check":return`${e.成功?"检定成功":"检定失败"} D20=${(n=e.掷骰)==null?void 0:n.replace("D20=","")} +${e.加值} = ${e.总计} / DC${e.DC}`;case"attack_roll":{const s=((r=(i=e.攻击掷骰)==null?void 0:i.match(/D20=(\d+)/))==null?void 0:r[1])||"?";return`${e.命中?"命中":"未命中"} D20=${s}${e.伤害?`，造成 ${e.伤害} 点伤害`:""} / AC${e.目标AC}`}case"roll_dice_tool":return`${e.骰子} = ${e.结果}`;case"death_save":return e.成功?"死亡豁免成功":"死亡豁免失败";case"error":return String(e.msg||"发生错误");default:return e.msg||JSON.stringify(e)}}function DF(t){if(t.type==="snapshot")return"";const e=Number(t.change||0),n=e>0?`+${e}`:String(e),i=t.reason?`：${t.reason}`:"";return t.type==="gold"?`金币 ${n}${i}`:t.type==="hp"?`HP ${n}${i}`:t.type==="inventory"?`${t.op==="add"?"获得":"失去"} ${t.item}`:t.type==="trust"?`${t.npc}信任 ${n}${i}`:t.type==="area"?`场景切换：${t.new}${i}`:t.type==="level_up"?`升级到 Lv.${t.new}${i}`:t.type==="npc_hp"?`${t.npc} HP ${n}${i}`:t.type==="attribute"?`${t.attr} ${n}${i}`:t.type==="xp"?`经验 ${n}${i}`:t.type==="complete_chapter"?t.reason||"章节完成":t.type==="trigger_event"?`剧情事件：${t.event_name}`:""}function NF(t,e){if(e.type==="snapshot")return{...e.state||t};const n={...t};if(e.type==="gold")n.gold=e.new;else if(e.type==="hp")n.current_hp=e.new,e.max&&(n.max_hp=e.max);else if(e.type==="inventory")n.inventory=e.inventory;else if(e.type==="trust"){const i=AF[e.npc];i&&(n[i]=e.new)}else if(e.type==="area")n.current_area=e.new;else if(e.type==="level_up")n.level=e.new,n.max_hp=e.max_hp,n.current_hp=e.max_hp;else if(e.type==="npc_hp"){const i=CF[e.npc];i&&(n[i]=e.new)}else e.type==="attribute"?n[e.attr]=e.new:e.type==="xp"?n.xp=e.new:e.type==="complete_chapter"?n.cleared_levels=e.new:e.type==="trigger_event"&&(n.triggered_events=e.events);return n}const LF={id:"dnd",name:"碎冠之影",createGame:MF,streamAction(t,e,n){return bF(t,e,n.onNarrative,n.onSystem,n.onDone,n.onError,n.onStateUpdate)},applyStateChange:NF,parseSystemEvent:RF,formatSystemEvent:PF,formatStateChange:DF},IF=/\[HINTS:([\s\S]*?)\]/g,Wg=new Set(["。","！","？","!","?",`
`]),UF=10,Xg={铁砧玛格丽特:"玛格丽特",玛格丽特:"玛格丽特","格鲁姆·铁锤":"格鲁姆",格鲁姆:"格鲁姆",铁锤:"格鲁姆",影刃丽莎:"丽莎",丽莎:"丽莎",影刃:"丽莎",塔莉亚:"塔莉亚",法师学徒:"塔莉亚",学徒:"塔莉亚","伊瑟拉·星语":"伊瑟拉",伊瑟拉:"伊瑟拉",星语:"伊瑟拉",莫德雷德主教:"莫德雷德",莫德雷德:"莫德雷德",主教:"莫德雷德",塞琳娜公主:"塞琳娜",塞琳娜:"塞琳娜",公主:"塞琳娜","雷恩·灰鬃":"雷恩",雷恩:"雷恩",灰鬃:"雷恩",艾拉:"艾拉",巴托克:"巴托克",塞德里克:"塞德里克",奥图斯:"奥图斯",典狱长:"典狱长"},Hp=Object.keys(Xg).sort((t,e)=>e.length-t.length),FF=["说","说道","道","问","问道","喊","喊道","吼","吼道","答","答道","回答","回应","告诉","宣布","大叫","低语","喃喃","嘟囔","插嘴","补充","补充道","低声说","压低声音说"];function cd(t){return t.replace(/「/g,"“").replace(/」/g,"”").replace(/\*\*([^*]+)\*\*/g,"$1").replace(/\[SCENE:[^\]]*\]\n?/g,"").replace(/\r/g,"")}function K_(t){return t.replace(/[\s“”「」【】{}\[\]（）()，,。.!！?？；;：:、—\-…]/g,"").length}function Ia(t){return K_(t)>0&&K_(t)<UF}function ls(...t){return t.map(e=>e.trim()).filter(Boolean).join("")}function OF(t){return cd(t).replace(/[ \t]+\n/g,`
`).replace(/\n{3,}/g,`

`).trim()}function Yc(t){return t.map(e=>e.trim()).filter(Boolean).slice(0,4).map((e,n)=>({id:`${n}-${e}`,label:e,text:e}))}function ll(t){const e=[],n=cd(t).replace(IF,(i,r)=>(r.split("|").forEach(s=>e.push(s)),""));return{text:OF(n),suggestions:Yc(e)}}function bE(t){return t.replace(/^[\s，,：:]+/,"").replace(/[\s，,]+$/,e=>e.includes("，")||e.includes(",")?"，":"").replace(/^随后，?/,"随后，").trim()}function AE(t){const e=t.trim();return/^\[[^\[\]]+\]$/.test(e)&&!e.startsWith("[SYSTEM:")?e.slice(1,-1).trim():e}function Ua(t,e=!1){const n=t.replace(/[【】]/g,""),i=e?[...Hp].reverse():Hp;let r=e?-1:Number.POSITIVE_INFINITY,s="";for(const o of i){const a=e?n.lastIndexOf(o):n.indexOf(o);a<0||(e?a>=r:a<=r)&&(r=a,s=Xg[o])}return s}function kF(t,e){const n=Ua(t.slice(-36),!0);if(n)return n;const i=Ua(e.slice(0,36));return i||""}function BF(t){const e=bE(AE(t)).replace(/[【】\s：:，,。.!！?？；;]+$/g,"");if(!e)return!0;for(const n of Hp){const i=Xg[n];if(i){if(e===n||e===i)return!0;for(const r of FF)if(e===`${n}${r}`||e===`${i}${r}`)return!0}}return!1}function q_(t,e,n){if(BF(e))return;const i=bE(AE(e));i&&GF(i).forEach(r=>{t.push({speaker:n,text:r})})}function zF(t,e,n){const i=e.trim();i&&t.push({speaker:n,text:`“${i}”`})}function VF(t){const e=[...t];for(let n=0;n<=e.length-3;n+=1){const i=e[n],r=e[n+1],s=e[n+2],o=i.speaker!=="KP"&&r.speaker==="KP"&&s.speaker===i.speaker,a=Ia(i.text)||Ia(r.text);o&&a&&(e.splice(n,3,{speaker:i.speaker,text:ls(i.text,r.text,s.text)}),n=Math.max(-1,n-2))}for(let n=0;n<e.length;n+=1){const i=e[n];if(!i||!Ia(i.text)||e.length<=1)continue;const r=e[n-1],s=e[n+1];if(r&&r.speaker===i.speaker){r.text=ls(r.text,i.text),e.splice(n,1),n=Math.max(-1,n-2);continue}if(s&&s.speaker===i.speaker){s.text=ls(i.text,s.text),e.splice(n,1),n=Math.max(-1,n-2);continue}if(s){s.text=ls(i.text,s.text),e.splice(n,1),n=Math.max(-1,n-2);continue}r&&(r.text=ls(r.text,i.text),e.splice(n,1),n=Math.max(-1,n-2))}return e}function GF(t){const e=[];let n=0;for(let r=0;r<t.length;r+=1){if(!Wg.has(t[r]))continue;const s=t.slice(n,r+1).trim();s&&e.push(s),n=r+1}const i=t.slice(n).trim();return i&&e.push(i),CE(e)}function CE(t){const e=[...t];for(let n=0;n<e.length;n+=1){const i=e[n];if(!(!Ia(i)||e.length<=1)){if(n<e.length-1){e[n+1]=ls(i,e[n+1]),e.splice(n,1),n=Math.max(-1,n-2);continue}e[n-1]=ls(e[n-1],i),e.splice(n,1),n=Math.max(-1,n-2)}}return e}function HF(t,e="KP",n=""){const{text:i}=ll(t),r=[];let s=n;if(!i)return{segments:r,lastSpeaker:s};const o=i.split(/\n+/).map(a=>a.trim()).filter(Boolean);for(const a of o){const l=/“([^”]*)”/g;let c=0,u=!1,f;for(;f=l.exec(a);){u=!0;const v=a.slice(c,f.index),S=a.slice(f.index+f[0].length),g=Ua(v);g&&(s=g),q_(r,v,e);const h=kF(v,S)||s||e;zF(r,f[1],h),h!==e&&(s=h),c=f.index+f[0].length}const d=a.slice(c),p=Ua(d);if(q_(r,d,e),p&&(s=p),!u){const v=Ua(a);v&&(s=v)}}return{segments:VF(r),lastSpeaker:s}}function jF(t){let e=!1,n=-1;for(let i=0;i<t.length;i+=1){const r=t[i];if(r==="“"){e=!0;continue}if(r==="”"){e=!1;continue}if(Wg.has(r)){if(e){let s=i+1;for(;/\s/.test(t[s]||"");)s+=1;t[s]==="”"&&(n=s+1);continue}e||(n=i+1)}}return n}function Uu(t){const{text:e}=ll(t);if(!e)return[];const n=[];let i=0,r=!1;for(let a=0;a<e.length;a+=1){const l=e[a];if(l==="“"){r=!0;continue}if(l==="”"){r=!1;continue}if(!r&&Wg.has(l)){const c=e.slice(i,a+1).trim();c&&n.push(c),i=a+1}}const s=e.slice(i).trim();s&&n.push(s);const o=[];for(const a of n)a.length<3&&o.length>0?o[o.length-1]+=a:o.push(a);return CE(o)}function Z_(t){const e=cd(t),n=jF(e);if(n<0)return{complete:[],tail:e};let i=e.slice(0,n),r=e.slice(n);const s=Uu(i);if(s.length&&Ia(s[s.length-1])){const o=s.pop()||"",a=i.lastIndexOf(o);a>=0&&(r=i.slice(a)+r,i=i.slice(0,a))}return{complete:Uu(i),tail:r}}function wc(){let t="",e=[];function n(){const i=[];for(;t;){const r=t.indexOf("[HINTS:");if(r>=0){const o=t.indexOf("]",r),a=t.slice(0,r),l=Z_(a);if(i.push(...l.complete),o<0){t=l.tail+t.slice(r);break}const c=t.slice(r,o+1);e=ll(c).suggestions,t=l.tail+t.slice(o+1);continue}const s=Z_(t);i.push(...s.complete),t=s.tail;break}return{lines:i,suggestions:e}}return{push(i){return t+=cd(i),n()},flush(){const i=ll(t),r=Uu(i.text);return i.suggestions.length&&(e=i.suggestions),t="",{lines:r,suggestions:e}}}}const Bf="王冠城的钟声穿过雾气。你的冒险从这一刻开始。";function qs(t){const e=String(t.current_area||"");return e.includes("公会")||e.includes("酒馆")?Yc(["调查登记簿【智力DC12】","观察伊瑟拉是否隐瞒【洞悉DC14】","让格鲁姆打听传闻【人脉DC13】"]):e.includes("B")?Yc(["谨慎搜索暗门【察觉DC14】","让丽莎检查陷阱【巧手DC15】","让塔莉亚解读符文【奥秘DC14】"]):Yc(["接过招募令","调查公会登记簿【智力DC12】","询问伊瑟拉真相【洞悉DC14】"])}function WF(t){let e=1;return(Array.isArray(t)?t:[]).filter(n=>n&&typeof n.text=="string"&&n.text.trim()).map(n=>{const i=Number(n.id),r=Number.isFinite(i)&&i>0?i:e;return e=Math.max(e,r+1),{id:r,role:n.role==="player"||n.role==="system"?n.role:"kp",speaker:n.speaker||"KP",text:n.text}})}function XF(){const t=LF,[e,n]=G.useState("main-menu"),[i,r]=G.useState(""),[s,o]=G.useState(""),[a,l]=G.useState({}),[c,u]=G.useState([]),[f,d]=G.useState(0),[p,v]=G.useState("narrating"),[S,g]=G.useState(!1),[h,m]=G.useState([]),[_,M]=G.useState([]),[w,T]=G.useState(null),[R,y]=G.useState([]),[C,D]=G.useState(""),[P,N]=G.useState(!1),[H,V]=G.useState(!1),[F,j]=G.useState(!1),[B,I]=G.useState(""),[$,K]=G.useState("neutral"),ie=G.useRef(1),fe=G.useRef(1),Fe=G.useRef(wc()),Be=G.useRef(null),Le=G.useRef({}),Q=G.useRef(""),le=G.useRef([]),ce=G.useRef(!1);G.useEffect(()=>{Le.current=a},[a]);const Ae=G.useCallback(()=>{le.current.forEach(Se=>window.clearTimeout(Se)),le.current=[]},[]);G.useEffect(()=>()=>{var Se;(Se=Be.current)==null||Se.abort(),Ae()},[Ae]);const Ie=G.useCallback(Se=>{y(A=>[...A.filter(E=>E.slot_key!==Se.slot_key),Se])},[]),Re=G.useCallback(async()=>{try{const Se=await EF();y(Se.saves),I(""),K("neutral")}catch(Se){I(Se.message||"获取存档失败"),K("error")}},[]);G.useEffect(()=>{Re()},[Re]);const et=G.useCallback((Se,A,E,k=!1)=>{const q=Se.map(se=>se.trim()).filter(Boolean);if(!q.length)return;const ne=q.flatMap(se=>{if(A!=="kp")return[{id:ie.current++,role:A,speaker:E,text:se}];const he=HF(se,E||"KP",Q.current);return Q.current=he.lastSpeaker,he.segments.map(Z=>({id:ie.current++,role:"kp",speaker:Z.speaker,text:Z.text}))});u(se=>((k||se.length===0)&&d(se.length),[...se,...ne]))},[]),Oe=G.useCallback((Se,A)=>{const E=Se.trim();if(!E)return;const k=fe.current++;M(ne=>[...ne,{id:k,text:E,tone:A}].slice(-8));const q=window.setTimeout(()=>{M(ne=>ne.filter(se=>se.id!==k)),le.current=le.current.filter(ne=>ne!==q)},5e3);le.current.push(q)},[]),tt=G.useCallback(async Se=>{if(!(!s||S||C)){D(Se),I(""),K("neutral");try{const A=`${a.player_name||"冒险者"} · ${a.current_area||"未知区域"}`,E=await TF(s,{slot_key:Se,title:A,story:c,suggestions:h.length?h:qs(a),active_index:f,phase:p});Ie(E.save),I(`已写入：${E.save.title}`),K("success"),Oe("存档已写入","state")}catch(A){const E=A.message||"保存失败";I(E),K("error"),Oe(E,"error")}finally{D("")}}},[f,Oe,s,a,p,C,c,S,h,Ie]),J=G.useCallback(async Se=>{var A;if(!(S||C)){D(Se),I(""),K("neutral");try{(A=Be.current)==null||A.abort(),Fe.current=wc();const E=await wF(Se),k=WF(E.story),q=k.reduce((ne,se)=>Math.max(ne,se.id),0);ie.current=q+1,fe.current=1,Q.current="",o(E.game_id),l(E.state),u(k),d(k.length?Math.min(Math.max(E.active_index,0),k.length-1):0),v(E.phase==="narrating"?"narrating":"action"),g(!1),m(E.suggestions.length?E.suggestions:qs(E.state)),Ae(),M([]),n("game"),Ie(E.save),I(`已读取：${E.save.title}`),K("success"),Oe("读档完成","state")}catch(E){const k=E.message||"读取存档失败";I(k),K("error"),e==="game"&&Oe(k,"error")}finally{D("")}}},[Oe,Ae,C,e,S,Ie]),be=G.useCallback(async Se=>{n("loading"),r(""),u([]),Ae(),M([]),m([]),d(0),v("narrating"),I(""),K("neutral"),ie.current=1,fe.current=1,Q.current="";try{const A=await t.createGame(Se),E=ll(A.opening||Bf),k=Uu(E.text||Bf);o(A.game_id),l(A.state),m(E.suggestions.length?E.suggestions:qs(A.state)),et(k.length?k:[Bf],"kp","KP",!0),n("game")}catch(A){r(A.message||"连接失败")}},[et,Ae,t]),Ve=G.useCallback(Se=>{var E;const A=Se.trim();!A||!s||S||((E=Be.current)==null||E.abort(),Fe.current=wc(),ce.current=!1,v("narrating"),g(!0),m([]),et([A],"player",a.player_name||"你",!0),Be.current=t.streamAction(s,A,{onNarrative:k=>{const q=Fe.current.push(k);q.lines.length&&et(q.lines,"kp","KP"),q.suggestions.length&&m(q.suggestions)},onSystem:k=>{const q=t.parseSystemEvent(k);q&&(Oe(t.formatSystemEvent(q),q.type==="error"?"error":"dice"),!ce.current&&(q.type==="skill_check"||q.type==="attack_roll")&&(ce.current=!0,T(q)))},onStateUpdate:k=>{l(q=>t.applyStateChange(q,k)),Oe(t.formatStateChange(k),"state")},onDone:()=>{const k=Fe.current.flush();k.lines.length&&et(k.lines,"kp","KP"),m(k.suggestions.length?k.suggestions:qs(Le.current)),g(!1)},onError:k=>{const q=String(k||"").trim(),ne=/connection\s*error|failed\s*to\s*fetch|network\s*error|networkerror|timeout|timed\s*out|econn|socket/i.test(q)?"KP暂时没有回应，已为本轮处理启用兜底。":q||"KP暂时没有回应，已为本轮处理启用兜底。";g(!1),Oe(ne,"state"),et([ne],"system","系统"),m(qs(Le.current))}}))},[Oe,et,s,a.player_name,t,S]),$e=G.useMemo(()=>yF(a),[a]),vt=c[f],O=!!vt&&(f<c.length-1||!S),xt=h.length?h:qs(a),Ye=G.useCallback(()=>{if(f<c.length-1){d(Se=>Math.min(Se+1,c.length-1));return}S||v("action")},[f,c.length,S]),at=G.useCallback(()=>{I(""),K("neutral"),Re(),n("load-game")},[Re]),ae=G.useCallback(()=>{var Se;(Se=Be.current)==null||Se.abort(),Be.current=null,Fe.current=wc(),Ae(),g(!1),N(!1),V(!1),j(!1),T(null),M([]),I(""),K("neutral"),n("main-menu")},[Ae]);return e==="main-menu"?x.jsx(gF,{onNewGame:()=>n("new-game"),onLoadGame:at,onTest:()=>n("test")}):e==="new-game"?x.jsx(XU,{onStart:be,onBack:()=>n("main-menu")}):e==="load-game"?x.jsx(HU,{saves:R,saveBusySlot:C,saveMessage:B,saveMessageTone:$,onBack:()=>n("main-menu"),onRefreshSaves:Re,onLoadSave:J}):e==="test"?x.jsx(pF,{onBack:()=>n("main-menu")}):e==="loading"?x.jsx(jU,{error:i,onRetry:()=>n("new-game")}):x.jsxs(ut.div,{initial:{opacity:0},animate:{opacity:1},className:"vn-app",children:[x.jsx(_F,{scene:$e,line:vt,events:_,isStreaming:S,isActionPhase:p==="action",canAdvance:p!=="action"&&O,onAdvance:Ye,actionPanel:p==="action"?x.jsx(OP,{suggestions:xt,disabled:S,onSubmit:Ve}):void 0}),x.jsx(kg,{dice:w,dieType:"d20",onClose:()=>T(null)}),x.jsx("button",{type:"button",className:"game-character-btn","aria-haspopup":"dialog","aria-expanded":H,onClick:()=>V(!0),children:"角色信息"}),x.jsxs("div",{className:"game-top-actions",children:[x.jsx("button",{type:"button",className:"game-title-btn",onClick:()=>j(!0),children:"回到标题界面"}),x.jsx("button",{type:"button",className:"game-save-btn",onClick:()=>N(!0),children:"📂 冒险存档"})]}),x.jsx(Ur,{children:F&&x.jsx(ut.div,{className:"return-title-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>j(!1),children:x.jsxs(ut.section,{className:"return-title-modal",role:"dialog","aria-modal":"true","aria-label":"返回标题界面确认",initial:{opacity:0,scale:.94,y:12},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.94,y:12},onClick:Se=>Se.stopPropagation(),children:[x.jsxs("div",{className:"return-title-copy",children:[x.jsx("span",{children:"返回标题界面"}),x.jsx("p",{children:"请先确认当前冒险进度已经存档。未保存的剧情和状态不会自动保存。"})]}),x.jsxs("div",{className:"return-title-actions",children:[x.jsx("button",{type:"button",className:"return-title-cancel",onClick:()=>j(!1),children:"取消"}),x.jsx("button",{type:"button",className:"return-title-confirm",onClick:ae,children:"确定"})]})]})})}),x.jsx(Ur,{children:H&&x.jsx(ut.div,{className:"character-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>V(!1),children:x.jsxs(ut.section,{className:"character-modal",role:"dialog","aria-modal":"true","aria-label":"角色信息",initial:{opacity:0,scale:.94,y:12},animate:{opacity:1,scale:1,y:0},exit:{opacity:0,scale:.94,y:12},onClick:Se=>Se.stopPropagation(),children:[x.jsxs("div",{className:"character-modal-header",children:[x.jsxs("div",{children:[x.jsx("span",{children:"角色信息"}),x.jsxs("small",{children:[a.player_name||"冒险者"," · ",a.char_class||"战士"]})]}),x.jsx("button",{type:"button","aria-label":"关闭角色信息",onClick:()=>V(!1),children:"×"})]}),x.jsx(VP,{state:a})]})})}),x.jsx(Ur,{children:P&&x.jsx(ut.div,{className:"save-modal-backdrop",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},onClick:()=>N(!1),children:x.jsxs(ut.div,{className:"save-modal",initial:{opacity:0,scale:.9},animate:{opacity:1,scale:1},exit:{opacity:0,scale:.9},onClick:Se=>Se.stopPropagation(),children:[x.jsxs("div",{className:"save-modal-header",children:[x.jsx("span",{children:"冒险存档"}),x.jsx("button",{type:"button",onClick:()=>N(!1),children:"✕"})]}),x.jsx(zg,{title:"冒险存档",saves:R,busySlot:C,disabled:S,message:B,messageTone:$,onRefresh:Re,onSave:Se=>{tt(Se),N(!1)},onLoad:J})]})})})]})}zf.createRoot(document.getElementById("root")).render(x.jsx(JE.StrictMode,{children:x.jsx(XF,{})}));
