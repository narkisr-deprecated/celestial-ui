angular.module( 'celestial.systems.query', [
])
.factory('systemsQueryService', function($resource, growl)  {
  var service = {};

  var rules = 
'{' +
  'function makeInteger(o) {' +
    'return parseInt(o.join(""), 10);' +
  '}' +
'}' +

'start' +
  '= query' +

'\nquery =' +
  'must / must_not / wildcard / all' +

'\nspace = " "*' +

'\nall= "*"' +

'must' +
  '= left:field "=" right:value space? rest:query? {' +
	'if(!rest) {' +
         'rest = {};' +
	'}' +
	'if(!rest["must"]) {' +
         'rest["must"] = [];' +
	'}' +
      'term = {term:{}};' +
      'term["term"][left] = right;' +
	'rest["must"].push(term);' +
	'return rest;' +
    '}' +

'must_not' +
  '= left:field "!=" right:value space? rest:query? {  ' +
	'if(!rest) {' +
         'rest = {};' +
	'}' +
	'if(!rest["must_not"]) {' +
         'rest["must_not"] = {};' +
	'}' +
	'rest["must_not"][left]=right;' +
	'return rest;' +
   '}' +

'wildcard = "type:" right:value space? rest:query? {  ' +
      'if(!rest) {' +
         'rest = {};' +
	'}' +
	'if(!rest["wildcard"]) {' +
         'rest["wildcard"] = {};' +
	'}' +
	'rest["wildcard"]["type"]=right;' +
	'return rest;' +
   '}' +

'field ' +
  '= prefix:([a-z]+) dot:"." key:([a-z]+) { ' +
     'return prefix.join("")+ "." + key.join(""); ' +
  '}' + '/' +

  'key:([a-z]+) { return key.join(""); }' + 

'value ' +
  '= alpha:[a-z]+ { return alpha.join(""); } /' +
    'digits:[0-9]+ { return makeInteger(digits); }';

  var Systems = $resource('/systems/', {page:'@page',offset:'@offset'},{
     query:{method : "GET", url:'/systems/query'}
  });

  service.parseQuery = function(input) {
    try {
      var parser = PEG.buildParser(rules);
	return parser.parse(input);
    } catch(e) {
      growl.addErrorMessage(e.message);
	throw e;
    }
  };
  return service;
});
