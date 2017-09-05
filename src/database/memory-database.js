import Database from './database.js';
import DynamicIdGenerator from './dynamic-id-generator.js';

export default class MemoryDatabase extends Database {

	constructor(initialData = {}) {
		super();
		this.memoryDatabaseObject = initialData; 
	}

	get(requestObject) {
		console.log("[GET] Getting a resource in memory database");
		let endpoint         = requestObject.endpoint;
		let targetCollection = this.memoryDatabaseObject[endpoint.entity] || [];
		if(!endpoint.id) {
			return targetCollection;
		}

		let targetObject = targetCollection.filter(this.byId(endpoint.id));
		return targetObject.length && targetObject[0] || undefined;
	}

	post(requestObject) {
		console.log("[POST] Inserting a resource in memory database");
		var endpoint = requestObject.endpoint;
		var body     = requestObject.body;
		if(!this.memoryDatabaseObject[endpoint.entity]) {
			this.memoryDatabaseObject[endpoint.entity] = [];
		}

		body.id = DynamicIdGenerator.generateId();
		this.memoryDatabaseObject[endpoint.entity].push(body);
		return body;
	}

	put() {
		throw new Error('You have to implement the method put()');
	}

	delete() {
		throw new Error('You have to implement the method delete()');
	}

	byId(id) {
		return function(object) {
			return object.id === id;
		}
	}

}
/****
OLD VERSION
var dynamicIdGenerator = require('./dynamic-id-generator.js');

(function (memoryDatabase) {

	var memoryDatabaseObject = {};

	memoryDatabase.get    = _get;
	memoryDatabase.post   = _post;
	memoryDatabase.put    = _put;
	memoryDatabase.delete = _delete;
	
	function _get(requestObject){
		console.log("[GET] Getting a resource in memory database");
		var endpoint = requestObject.endpoint;
		var targetCollection = memoryDatabaseObject[endpoint.entity] || [];
		if(!endpoint.id) {
			return targetCollection;
		}

		var targetObject = targetCollection.filter(byId(endpoint.id));
		return targetObject.length && targetObject[0] || undefined;
	}

	function _post(requestObject){
		console.log("[POST] Inserting a resource in memory database");
		var endpoint = requestObject.endpoint;
		var body     = requestObject.body;
		if(!memoryDatabaseObject[endpoint.entity]) {
			memoryDatabaseObject[endpoint.entity] = [];
		}

		body.id = dynamicIdGenerator.generateId();
		memoryDatabaseObject[endpoint.entity].push(body);
		return body;
	}

	function _put(requestObject){
		console.log("[PUT] Updating a resource in memory database");
		var body             = requestObject.body;
		var endpoint         = requestObject.endpoint;
		var targetCollection = memoryDatabaseObject[endpoint.entity] || [];
		var targetIndex      = targetCollection.findIndex(byId(endpoint.id));

		body.id 					  = endpoint.id;
		targetCollection[targetIndex] = body;
		return body;
	}

	function _delete(requestObject){
		console.log("[DELETE] Removing a resource in memory database");
		var endpoint         = requestObject.endpoint;
		var targetCollection = memoryDatabaseObject[endpoint.entity] || [];
		var targetIndex      = targetCollection.findIndex(byId(endpoint.id));
		var deletedObject    = targetCollection[targetIndex];

		targetCollection.splice(targetIndex, 1);
		return deletedObject;
	}

	function byId(id) {
		return function(object) {
			return object.id === id;
		}
	}

})(module.exports);
**/