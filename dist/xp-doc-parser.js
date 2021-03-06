!function(t){var e={};function r(i){if(e[i])return e[i].exports;var s=e[i]={i:i,l:!1,exports:{}};return t[i].call(s.exports,s,s.exports,r),s.l=!0,s.exports}r.m=t,r.c=e,r.d=function(t,e,i){r.o(t,e)||Object.defineProperty(t,e,{configurable:!1,enumerable:!0,get:i})},r.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(e,"a",e),e},r.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},r.p="",r(r.s=0)}([function(t,e,r){t.exports=r(1)},function(t,e,r){(function(e){const i="undefined"!=typeof window?window:e,s=i.XP||r(3),n=i.XPEmitter||r(4),a=i.XPRequest||r(5);t.exports=new s.Class("XPDocParser",{extends:n,initialize:{promise:!0,value(t,e){n.call(this),s.isObject(t)||(t={url:t}),this.options=t,this.url=this.options.url,this.request=new a({parser:"text",url:this.url}),this.state=this.request.state,this.request.once("data",this._handleData.bind(this)),this.request.once("error",t=>this.error=t),this.request.on("state",t=>this.state=t),this.once("data",t=>e(null,t)),this.once("error",t=>e(t,null)),this.request.submit()}},parse(t){s.assertArgument(s.isVoid(t)||s.isString(t),1,"string");let e="\\/\\*\\*([\\s\\S]*?)\\*\\/",r="\x3c!--([\\s\\S]*?)--\x3e",i=t?new RegExp(`${e}|${r}`,"g"):null,n=t?s.match(t,i).map(t=>this.parseBlock(t)):[],a=t?n.find(t=>this.entities.indexOf(t.type)>=0):null;return a&&this._interpretEntity(a,s.pull(n,a)),a||{type:"Unknown",name:"Unknown",summary:"**Undocumented**"}},parseBlock(t){s.assertArgument(s.isVoid(t)||s.isString(t),1,"string");let e=(t=(t=(t=t||"").replace(/\r\n/g,"\n")).replace(/^\s*\/\*\*|^\s*\*\/|^\s*\* ?|^\s*<!-\-|^s*\-\->/gm,"")).split("\n"),r={};return e=e.filter(t=>{let e=s.match(t,/^@(\w+)(.*)|^\s+\s+@(\w+)(.*)/);if(!e.length)return!0;r.pragma&&r.pragma.push({type:e[1]||e[3],value:s.clean(e[2]||e[4])||!0}),r.pragma||(r.type=e[1]||e[3],r.name=s.clean(e[2]||e[4]),r.pragma=[])}),r.type=r.type||"",r.name=r.name||"",r.summary=e.join("\n").trim(),r},_computeInterpreter(t){let e=`_interpret${s.capitalize(t)}`;return s.isFunction(this[e])?e:void 0},_interpretAdapts(t,e){this._interpretDependency(t,e)},_interpretBehavior(t,e){this._interpretDependency(t,e)},_interpretDependency(t,e){let r=e.value.split(" ");e.value={name:s.trim(r[0]),url:s.trim(r[1]||"")},this._interpretPragma(t,e)},_interpretDevDependency(t,e){this._interpretDependency(t,e)},_interpretEntity(t,e){s.assertArgument(s.isObject(t),1,"Object"),s.assertArgument(s.isVoid(e)||s.isArray(e),2,"ArrayLike");let r=s.withdraw(t,"pragma");r&&r.forEach(e=>s.apply(this,this._computeInterpreter(e.type)||"_interpretPragma",[t,e])),e&&e.forEach(e=>s.apply(this,this._computeInterpreter(e.type)||"_interpretFeature",[t,e]))},_interpretExtends(t,e){this._interpretDependency(t,e)},_interpretFeature(t,e){s.assertArgument(s.isObject(t),1,"Object"),s.assertArgument(s.isObject(e),2,"Object");e.name||s.withdraw(e,"name");let r=s.withdraw(e,"pragma"),i=s.withdraw(e,"type"),n=this.plurals[i||""];i&&(r&&r.forEach(t=>s.apply(this,this._computeInterpreter(t.type)||"_interpretPragma",[e,t])),n?(t[n]=t[n]||[]).push(e):t[i]=e)},_interpretKeywords(t,e){e.value=s.split(e.value,",").map(t=>t.trim()),this._interpretPragma(t,e)},_interpretParam(t,e){let r=/\{(.+)\}\s+(\[.+\]|\w+\.\w+|\w+)\s*(.*)$/,i=s.match(e.value,r),n=s.split(s.trim(i[2],"[]"),"=",!0),a=s.split(s.trim(n[0]),".",!0);e.value={type:s.trim(i[1]),name:s.trim(a[a.length>1?1:0]),summary:s.trim(i[3]),optional:s.startsWith(i[2],"["),default:s.trim(n[1])},e.value.optional||delete e.value.optional,e.value.default||delete e.value.default,a.length>1&&(t=s.findLast(t.params||[],t=>t.name===a[0].trim())||{}),this._interpretPragma(t,e)},_interpretPragma(t,e){s.assertArgument(s.isObject(t),1,"Object"),s.assertArgument(s.isObject(e),2,"Object");let r=s.withdraw(e,"type"),i=this.plurals[r||""];i?(t[i]=t[i]||[],t[i].push(e.value)):t[r]=e.value},_interpretReturns(t,e){let r=/\{(.+)\}\s*(.*)$/,i=e.value.match(r)||[];e.value={type:s.trim(i[1]),summary:s.trim(i[2])},this._interpretPragma(t,e)},_mergeData(t,e){return s.assertArgument(s.isObject(t),1,"Object"),s.assertArgument(s.isArray(e),2,"Array"),e.reverse().forEach(e=>{this.inheritance.forEach(r=>e.data[r]&&e.data[r].forEach(e=>{Array.from(t[r]||[]).some(t=>t.name===e.name)||(t[r]=t[r]||[],t[r].push(Object.assign(e,{inherited:!0})))}))}),t},_sortData(t,e){return s.assertArgument(s.isObject(t),1,"Object"),e&&this.inherited?t:(this.inheritance.forEach(e=>t[e]&&t[e].sort((t,e)=>!t.private&&e.private?1:t.private&&!e.private?-1:t.name>e.name?1:t.name<e.name?-1:void 0)),t)},data:{set(t){return s.isDefined(this.data)?this.data:t},then(t){return t&&this.emit("data",t)},validate:t=>!s.isNull(t)&&!s.isObject(t)&&"Object"},empty:{get(){return!this.data}},entities:{frozen:!0,writable:!1,value:["behavior","class","element","function","module","object","stylesheet"]},error:{set(t){return s.isDefined(this.error)?this.error:t},then(t){return t&&this.emit("error",t)},validate:t=>!s.isNull(t)&&!s.isObject(t)&&"Object"},host:{set(t){return this.host||t},validate:t=>!s.isString(t,!0)&&"string"},inheritance:{frozen:!0,writable:!1,value:["attributes","events","methods","properties"]},inherited:{set(t){return s.isDefined(this.inherited)?this.inherited:Boolean(t)}},plurals:{frozen:!0,writable:!1,value:{attribute:"attributes",behavior:"behaviors",dependency:"dependencies",devDependency:"devDependencies",event:"events",method:"methods",param:"params",property:"properties"}},protocol:{set(t){return this.protocol||t},validate:t=>!s.isString(t,!0)&&"string"},request:{set(t){return this.request||t},validate:t=>!s.isObject(t)&&"Object"},state:{set:t=>t,then(t){return"idle"!==t&&this.emit("state",t)},validate:t=>!s.isString(t,!0)&&"string"},url:{set(t){return this.url||t},then(t){let e=s.parseURL(t);this.host=e.host,this.protocol=e.protocol},validate:t=>!s.isString(t,!0)&&"string"},_handleData(e){let r=e?this.parse(e):null,i=null,n=[],a=0;if(r&&r.extends&&r.extends.url){let e=s.parseURL(r.extends.url);e.host=e.host||this.host,e.protocol=e.protocol||this.protocol,(i=new t.exports({inherited:!0,url:s.toURL(e)})).once("data",()=>(a+=1)===n.length&&(this.data=this._sortData(this._mergeData(r,n),!0))),n.push(i)}r&&r.behaviors&&r.behaviors.forEach(e=>{if(!e.url)return;let o=s.parseURL(e.url);o.host=o.host||this.host,o.protocol=o.protocol||this.protocol,(i=new t.exports({inherited:!0,url:s.toURL(o)})).once("data",()=>(a+=1)===n.length&&(this.data=this._sortData(this._mergeData(r,n),!0))),n.push(i)}),n.length||(this.data=r&&this._sortData(r,!0))}}),"undefined"!=typeof window&&(window.XPDocParser=t.exports)}).call(e,r(2))},function(t,e){var r;r=function(){return this}();try{r=r||Function("return this")()||(0,eval)("this")}catch(t){"object"==typeof window&&(r=window)}t.exports=r},function(t,e){t.exports=XP},function(t,e){t.exports=XPEmitter},function(t,e){t.exports=XPRequest}]);