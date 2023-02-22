#!/bin/node

//##!/usr/bin/env node
const http = require('http');
const { MongoClient } = require('mongodb');
const fs = require('fs');
const qs = require('querystring');
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
		response.write("ERROR: introduce un personaje");
		response.end();
		return;
	}

	let collection = db.collection('characters');

	collection.find({"name":url[2]}).project({_id:0,age:1}).toArray().then(character => {
	if (character.length == 0){	
	response.write("ERROR: edad erronea");
	response.end();	
	return;
 }

		
		response.write(JSON.stringify(character[0]));
		response.end();
	});
}
/*
function  sendCharactersItems(url,response){

let name = ure[2].trim();
if (name == ""){
response.write("ERROR: URL mal formada");
response.end;
return;
}

let collection = db.collection('characters');
collection.find({"name":name}).toArray().then(character =>{	
	if(character.length != 1){
	response.write("ERROR: el personaje "+name+" no existe");
	response.end();
	return;
	}

		let id_ch =	character[0].id_character;	

		let collection = db.collection('items_characters');
	
		collection.find({"id_character":id_ch}).toArray().then(ids => {
			
				if (ids.length == 0){
					response.write("[]");
					response.end();
					return;
				}


				let ids_items = [];
				ids.forEach(element => {
				ids_items.push(element.ids);
				});

				let collection = db.collection('items');
				collection.find({"id":{$in ids_items}}).toArray().then(items => {
						
					response.write(JSON.stringify(id_items));
					response.end();

					return;
	
					

				});
		});
});
} */








function SendItems(response,url) {
if(url.length >= 3 ){
sendCharactersItems(url,response);

return;
}



let collection = db.collection('items');
collection.find({}).toArray().then(characters => {
 let names = [];
 for(let i = 0; i < characters.length; i++){
  names.push(characters[i].name);
  }
  response.write(JSON.stringify(names));
   response.end();
    });
}

function insertCharacter (request, response){
	
	if (request.method != "POST"){
		response.write("ERROR: Formulario no enviado");
		response.end();
		return;
	}
	
	let data = "";

	request.on('data', function(character_chunk){
		data += character_chunk;
	});

	request.on('end', function() { 
		console.log(data);

		let info = qs.parse(data);
		console.log(info);
		
		let collection = db.collection('characters');
		if (info.name == undefined) {
			response.write("ERROR: Nombre no definido");
			response.end();
			return;
		}

		 if (info.name == undefined) {
		 	response.write("ERROR: Nombre no definido");
		 	 response.end();
		     return;
		 }

		 let insert_info = { name: info.name, age: parseInt(info.age)};

		collection.insertOne(insert_info); //hay dos maneras de acceder a los valores de info 
		
		response.write("nuevo personaje insertado: " +  insert_info.name);

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
			case "items":
				SendItems(response,url);
				break;

			case"character_form":
				insertCharacter(request, response);
				break;

			default:
				fs.readFile("index.html", function(err, data){
				if (err){
					console.error(err);
					response.writeHead(404,{'Content-Type':'text/html'});
					response.write("Error 404: el archivo no esta en este castillo");
					response.end();
					return;
				}

				response.writeHead(200,{'Content-Type':'text/html'});
				response.write(data)
		 		response.end();	
				});
		}
		
	});	

	http_server.listen(8080); 

