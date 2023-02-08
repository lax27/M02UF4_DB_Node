#!/bin/node

//##!/usr/bin/env node
const http = require('http');
const { MongoClient } = require('mongodb');

// or as an es module:
// import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'abascal';

let db;

async function db_conect() {
  // Use connect method to connect to the server
  await client.connect();
  console.log('Connected successfully to server');
  db = client.db(dbName);
//  const collection = db.collection('documents');

  // the following code examples can be pasted here...

  return 'Conectados a la base de datos mongo db';
}

db_conect()
  .then(console.log)
  .catch(console.error);






function SendCharacters(response) {
	let collection = db.collection('characters');

	collection.find({}).toArray().then(characters => {
		let names = [];
		for(let i = 0; i < characters.length; i++){
			names.push(characters[i].name);
		}
    response.write(JSON.stringify(names));
	response.end();
	});
}

function sendAge(response,url){
	if(url.length < 3 ){
		response.write("ERROR:edad erronea");
		response.end();
		return;
	}
	let collection = db.collection('characters');
	collection.find({"name":url[2]}).toArray().then(character => {
		let data = {			
			p
			age: character[0].age
		};
		response.write(JSON.stringify(data));
		response.end();
	});
}
 

let http_server = http.createServer(function(request,response){
	if(request.url == "/favicon.ico"){
		return;
	}

		let url = request.url.split("/");

	
		switch (url[1]){
			
			case "characters":
				SendCharacters(response);
				break;

			case "age":
				sendAge(response,url);
				break;

			default:
				response.write("Pagina Principal")
		 		response.end();	
				
		}
		
	});	

	http_server.listen(8080); 

