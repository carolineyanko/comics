var request = require('request');
var path = require('path');
var fs = require('fs');
var http=require('http');
var express = require('express');
var cheerio = require('cheerio');


// app.get('/', function (req, res) {
//   res.send('Hello World!');
// })
var app = express();


var server = app.listen(5000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});

var source = 'http://acomics.ru/~train-hard/';
var links = [];
var page,
		host = getHost(source),
		path = '';

// app.get('/',function (req, res) {

// })
request(source, function (error, response, body) {

  if (!error && response.statusCode == 200) {

		page = cheerio.load(body);

  	var issueNumber  = getIssueNumber(page);

  	for (var i = 1; i <= issueNumber; i++) {


		(function(i){
	  		request(source + i, function (error, response, body) {

				  if (!error && response.statusCode == 200) {

						page = cheerio.load(body);

				  	path = generateURL(body, host);

					  saveImage(path, i+'');
						 console.log(i);

				  }

				})

		})(i);


		};

	  // res.send(links);

  }

})


	// request('http://acomics.ru/upload/!c/!import/train-hard/000007-fbxng2cit0.jpg', function (error, response, body) {

	//   if (!error && response.statusCode == 200) {
	//   	// console.log(response);
	// 		fs.writeFile('test.txt', body, function (err) {
	// 		  if (err) throw err;
	// 		  console.log('It\'s saved!');
	// 		});
	//   }

	// })

function saveImage(path,i){

		var options = {
		    host: 'acomics.ru',
		    port:80,
		    path: path
		}

		http.get(options,function(res){

			var f = fs.createWriteStream('images/' + ('0000' + i).slice(-4)+'.jpg');

		    res.on('data', function (chunk) {
		        f.write(chunk);
		    });
		    res.on('end',function(){
		        f.end();
		    });
		});
	// }

}


function generateURL (body, url) {

			img = page('#mainImage').attr('src'),
			path = img;

	return img;
}
function getHost (source) {

	host = source.slice(7, source.indexOf('~')-1);

	return host;
}

function getIssueNumber (page) {
	var str = page('.issueNumber').text();
	var number = parseInt(str.slice(str.indexOf('/') + 1));

	return number;
}
