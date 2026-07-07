// signaling.js 
// Native ES Module 
// Browser & Node compatible 
// No CommonJS 
// No Lodash 
const isNull = v => v === null; 
const isUndefined = v => v === undefined; 
const isEmpty = value => { if (value == null) return true; 
if (Array.isArray(value) || typeof value === "string") return value.length === 0; 
if (typeof value === "object") return Object.keys(value).length === 0; return false; 
}; 
const first = arr => Array.isArray(arr) && arr.length ? arr[0] : undefined; 
const clone = obj => structuredClone(obj); 
const assign = Object.assign; 
const keys = Object.keys; 
const values = Object.values; 
const zip = (a, b) => a.map((k, i) => [k, b[i]]); 
const filter = (arr, criteria) => { 
if (!Array.isArray(arr)) return []; 
if (typeof criteria === "function") 
	return arr.filter(criteria); 
return arr.filter(item => Object.entries(criteria) .every(([k, v]) => item[k] === v)); 
}; 
const find = (arr, criteria) => first(filter(arr, criteria)); 
const forEach = (arr, cb) => { 
if (!Array.isArray(arr)) 
	return; arr.forEach(cb); 
}; 
const map = (arr, cb) => { 
if (!Array.isArray(arr)) 
	return []; return arr.map(cb); 
}; 
const remove = (arr, obj) => { 
const idx = arr.indexOf(obj); 
if (idx >= 0) arr.splice(idx, 1); 
}; 
const merge = (target, source) => { 
if (!source) return target; 
Object.keys(source).forEach(key => { 
if ( source[key] && typeof source[key] === "object" && !Array.isArray(source[key]) ) { 
if (!target[key]) target[key] = {}; 
merge(target[key], source[key]); 
} else { 
target[key] = source[key]; 
} 
}); 
return target; 
}; 
export default function Signaling( principal, results, location, rels, options, lifecycle, events_order, events, transitionEvent, domainName, userGroup, users ) { 
const vm = {}; 
vm.principal = principal; 
vm.results = results || { pattern: "", data: { items: [] }, event: "" }; 
vm.location = location; 
vm.rels = rels; 
vm.options = options; 
vm.lifecycle = lifecycle || { initEvent: "", prevEvent: "", startedEvent: "", postEvent: "", option: "", param: [], params: [], items: { service: [], events: [], events_order: [] } }; 
vm.events_order = events_order; 
vm.events = events; 
vm.transitionEvent = transitionEvent; 
vm.domainName = domainName; 
vm.userGroup = userGroup; 
vm.users = users; 
vm.case = { lifecycle: {}, name: "" }; 
vm.broadcast = broadcast; 
vm.applyverb = applyverb; 
vm.loadpanel = loadpanel; 
vm.execute = execute; 
vm.load = load; 
vm.settransition = settransition; 
vm.getcase = getcase; 
vm.remap = remap; 
vm.loadcache = loadcache; 
vm.loadoption = loadoption; 
vm.loadrules = loadrules; 
vm.resolve = resolve; 
async function broadcast(eventName, cb) { 
if (typeof cb !== "function") return true; 
return cb(eventName, vm.lifecycle); 
} 
async function loadoption(cb) { 
if (typeof cb !== "function") return true; 
const resp = cb(); 
if (isUndefined(resp) || isNull(resp)) throw new Error("Call Back is undefined on loadoption"); 
return resp; 
} 
async function load(cb) { 
if ( !isEmpty(vm.principal) && isEmpty(vm.lifecycle.items.service) ) { 
vm.lifecycle.items.service = vm.principal; 
} 
if ( isNull(vm.results) || vm.results.pattern === "" ) { 
throw new Error("load results pattern error"); 
} 
const service = first(vm.lifecycle.items.service); 
const links = service ? service.links : []; 
for (const value of links) { 
if ( value.location === vm.location && value.verb === "GET" && value.type === "options" && value.group === vm.userGroup ) { 
const results = await vm.applyverb( value.href, value.verb, false, null, null, null, null, null, cb ); 
const loadedResults = vm.resolve(results, vm.results.pattern); 
vm.results.data.items = loadedResults; 
vm.results.event = "loadOptions"; 
if ( loadedResults && !isEmpty(loadedResults) ) { 
if ( isEmpty( filter(vm.rels, { rel: vm.location }) ) ) { 
const data = { ...value, options: loadedResults }; 
vm.rels.push({ rel: value.name, items: data }); 
} 
return results; 
} 
} 
} 
throw new Error("No object to load()"); 
} 
async function loadrules(cb) { 
await vm.load(cb); 
const rels = filter(vm.rels, { rel: vm.location }); 
if (isEmpty(rels)) throw new Error( "Could not loadrules - no rels for specified location" ); 
for (const value of rels) { 
for (const item of value.items.options) { 
for (const rule of item.rules) { 
if ( rule.permission && isEmpty( filter(vm.users, { rel: item.name }) ) ) { 
for (const user of rule.permission) { user.rel = item.name; vm.users.push(user); 
} 
} 
if ( rule.events && isEmpty( filter(vm.events, { rel: item.name }) ) ) { 
vm.events.push({ rel: item.name, items: rule.events }); 
} 
if ( rule.events_order && isEmpty( filter(vm.events_order, { rel: item.name }) ) ) { 
vm.events_order.push({ rel: item.name, items: rule.events_order }); 
} 
} 
} 
} 
return rels[0]; 
} 
async function loadcache(rel, cb) { 
if (typeof cb !== "function") return true; 
const resp = cb(vm.lifecycle, rel); 
if (isUndefined(resp)) throw new Error("loadcache not defined"); 
return resp; 
} 
async function loadpanel( name, html, size, cb ) { 
const resp = cb( name, vm.lifecycle, html, size ); 
if (isUndefined(resp)) throw new Error("loadpanel not defined"); 
return resp; 
} 
async function applyverb( url, method, cache, data, headers, rel, name, message, cb ) { 
const resp = cb( url, method, cache, data, headers, rel, name, message ); 
if (isUndefined(resp)) throw new Error("applyverb not defined"); 
return resp; 
} 
function getcase() { 
return vm.case; 
} 
function remap(mapping, value) { 
const result = clone(mapping); 
if (!value) return result; 
for (const [k, v] of zip( keys(mapping), values(mapping) )) { 
result[k] = value[v]; 
} 
return result; 
} 
function settransition(event) { 
if ( event .split("$") .pop() .toLowerCase() === "transition" ) { 
vm.transitionEvent = null; 
} 
} 
function resolve(obj, path) { 
let current = obj; 
for (const part of path.split(".")) { 
if ( current === null || typeof current !== "object" ) { 
return undefined; } current = current[part]; 
} 
return current; 
} 
async function execute( lifecycle, switchcb, panelcb, broadcastcb, verbcb, cachecb, rulescb ) { 
if ( isEmpty(vm.events_order) && isEmpty(filter(vm.lifecycle.items.events_order, { rel: vm.lifecycle.option })) ) { 
await vm.loadrules(rulescb); 
return vm.execute( lifecycle, switchcb, panelcb, broadcastcb, verbcb, cachecb, rulescb ); 
} 
if ( !isEmpty(filter(vm.events_order, { rel: vm.lifecycle.option })) && isEmpty(filter(vm.lifecycle.items.events_order, { rel: vm.lifecycle.option })) ) { 
vm.lifecycle.items.events_order = vm.events_order; 
} 
if ( !isEmpty(filter(vm.events, { rel: vm.lifecycle.option })) && isEmpty(filter(vm.lifecycle.items.events, { rel: vm.lifecycle.option })) ) { 
vm.lifecycle.items.events = vm.events; 
} 
let event = null; 
if ( lifecycle.prevEvent !== "" && lifecycle.postEvent === "" && vm.transitionEvent === null ) { 
const itemEvents = first( filter( lifecycle.items.events_order, { rel: vm.lifecycle.option } ) ).items; 
let index = itemEvents.indexOf( lifecycle.prevEvent ); 
index++; 
event = itemEvents[index]; 
lifecycle.postEvent = event; 
} else if (vm.transitionEvent === null) { 
const itemEvents = first( filter( vm.lifecycle.items.events_order, { rel: vm.lifecycle.option } ) ).items; 
event = itemEvents[0]; 
vm.lifecycle.postEvent = event; 
} 
const switchEvent = vm.transitionEvent ?? event; 
let eventObject; 
switch ( (switchEvent || "") .split("_")[0] ) { 
case "confirmation": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
await vm.loadpanel( "handle", eventObject.html, eventObject.modal.size, panelcb ); 
break; 
} 
case "get": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
const href = find( first(vm.lifecycle.items[eventObject.links]).links, { name: eventObject.rel } ).href; 
const url = eventObject.criteria_mapping ? href + "?where=" + encodeURIComponent( JSON.stringify( vm.remap( first(eventObject.criteria_mapping), first(vm.lifecycle.items[eventObject.name]) ) ) ) : !isEmpty( map( eventObject.keyvalue, value => value.where ) ) ? href + "?where=" + encodeURIComponent( JSON.stringify( first( map( eventObject.keyvalue, value => value.where ) ) ) ) : href; 
const results = await vm.applyverb( url, "get", false, null, null, eventObject.rel, eventObject.name, eventObject.message, verbcb ); 
const getResults = vm.resolve( results, eventObject.results?.pattern ?? vm.results.pattern ); 
vm.results.data.items = getResults; 
vm.results.event = switchEvent; 
if ( eventObject.mapping && getResults?.length ) { let mappingObject = {}; 
for (const mapping of eventObject.mapping) { 
mappingObject = clone(mapping); 
for (const [target, source] of zip( keys(mapping), values(mapping) )) { 
if ( source !== undefined && getResults.length ) { mappingObject[target] = getResults[0][source]; 
} 
} 
} 
for (const service of vm.lifecycle.items[eventObject.name]) { 
assign( service, mappingObject ); 
} 
} 
vm.settransition( switchEvent ); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
break; 
} 
case "cache": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
vm.lifecycle.items[eventObject.name] = []; 
await vm.loadcache( eventObject.rel, cachecb ); 
for (const service of vm.lifecycle.items[eventObject.rel]) { 
for (const mapping of eventObject.mapping) { 
vm.lifecycle.items[eventObject.name].push( eventObject.keyvalue ? assign( vm.remap(mapping, service), eventObject.keyvalue ) : vm.remap( mapping, service ) ); 
} 
} 
vm.settransition( switchEvent ); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
break; 
}
case "transform": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
for (const object of vm.lifecycle.items[eventObject.name]) { 
for (const mapping of eventObject.mapping) { 
merge( object, vm.remap( mapping, object[eventObject.rel] ) ); 
} 
} 
vm.settransition( switchEvent ); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
break; 
} 
case "post": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
const relate = find( first( vm.lifecycle.items[eventObject.links] ).links, { name: eventObject.rel } ); 
await vm.applyverb( relate.href, relate.verb, false, vm.lifecycle, { "Content-Type": "application/json" }, relate.rel, eventObject.name, eventObject.message, verbcb ); 
break; 
} 
case "new": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
const href = find( first(vm.lifecycle.items[eventObject.links]).links, { name: eventObject.rel } ).href; 
vm.lifecycle.items[vm.domainName] = []; 
const url = eventObject.criteria_mapping ? href + "?where=" + encodeURIComponent( JSON.stringify( vm.remap( first(eventObject.criteria_mapping), first(vm.lifecycle.items[eventObject.name]) ) ) ) : href; 
const results = await vm.applyverb( url, "get", false, null, null, eventObject.rel, eventObject.name, eventObject.message, verbcb ); 
const newResults = vm.resolve( results, eventObject.results?.pattern ?? vm.results.pattern ); 
vm.results.data.items = newResults; 
vm.results.event = switchEvent; 
for (const service of newResults) { 
for (const mapping of eventObject.mapping) { 
vm.lifecycle.items[vm.domainName].push( eventObject.keyvalue ? assign( vm.remap(mapping, service), eventObject.keyvalue ) : vm.remap(mapping, service) ); 
} 
} 
vm.settransition(switchEvent); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
break; 
} 
case "mergeWhere": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
const href = find( first(vm.lifecycle.items[eventObject.links]).links, { name: eventObject.rel } ).href; 
const parameter = { parameter: vm.lifecycle.items[eventObject.name] .map(v => v[eventObject.keyvalue.where.parameter] ) }; 
const url = eventObject.criteria_mapping ? href + "?where=" + encodeURIComponent( JSON.stringify( vm.remap( first(eventObject.criteria_mapping), parameter ) ) ) : href; 
const results = await vm.applyverb( url, "get", false, null, null, eventObject.rel, eventObject.name, eventObject.message, verbcb ); 
const mergeResults = vm.resolve( results, eventObject.results?.pattern ?? vm.results.pattern ); 
vm.results.data.items = mergeResults; vm.results.event = switchEvent; 
const mapped = []; 
for (const service of mergeResults) { 
for (const mapping of eventObject.mapping) { 
mapped.push( eventObject.keyvalue ? assign( vm.remap(mapping, service), eventObject.keyvalue ) : vm.remap(mapping, service) ); 
} 
} 
const key = eventObject[switchEvent].parameter; 
for (const domain of vm.lifecycle.items[vm.domainName]) { 
const found = mapped.find( item => item[key] === domain[key] ); 
if (found) merge(domain, found); } vm.settransition(switchEvent); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
break; 
} 
case "deleteAttribute": { 
eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
for (const domain of vm.lifecycle.items[eventObject.name]) { 
for (const mapping of eventObject.mapping) { 
for (const key of Object.keys(mapping)) { delete domain[key]; 
} 
} 
} 
vm.settransition(switchEvent); 
await vm.broadcast( "lifecycle_change", broadcastcb );
break; 
} 
case "assign": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
for (const domain of vm.lifecycle.items[eventObject.name]) { 
for (const mapping of eventObject.mapping) { 
assign( domain, vm.remap( mapping, domain ) ); 
} 
} 
vm.settransition(switchEvent); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
break; 
} 
case "deleteObject": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
const copy = clone( vm.lifecycle.items[eventObject.name] ); 
for (const domain of copy) { 
for (const criteria of eventObject.keyvalue) { 
let removeObject = true; 
for (const key of Object.keys(criteria)) { 
if (domain[key] !== criteria[key]) { 
removeObject = false; 
break; 
} 
} if (removeObject) { 
remove( vm.lifecycle.items[eventObject.name], domain ); 
} 
} 
} 
vm.settransition(switchEvent); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
break; 
} 
case "eq": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
const matched = filter( vm.lifecycle.items[eventObject.name], first(eventObject.criteria) ).length > 0; 
if (matched) { 
vm.transitionEvent = eventObject.transitionEvent; 
await vm.broadcast( "transition_change", broadcastcb ); 
} else { 
vm.settransition(switchEvent); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
} 
break; 
} 
case "lt": { eventObject = find( first( filter( vm.lifecycle.items.events, { rel: vm.lifecycle.option } ) ).items, switchEvent )[switchEvent]; 
const matched = vm.lifecycle.items[eventObject.name] .some(item => vm.resolve( item, first(eventObject.criteria).key ) < first(eventObject.criteria).value ); 
if (matched) { 
vm.transitionEvent = eventObject.transitionEvent; 
await vm.broadcast( "transition_change", broadcastcb ); 
} else { 
vm.settransition(switchEvent); 
await vm.broadcast( "lifecycle_change", broadcastcb ); 
} 
break; 
} 
default: { 
await switchcb( vm.lifecycle, switchEvent );
await vm.broadcast( "lifecycle_change", broadcastcb );  
break; 
} 
} 
vm.case.lifecycle = vm.lifecycle; 
vm.case.name = switchEvent; 
}
return vm; 
}