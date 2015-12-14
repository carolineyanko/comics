var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');


var source = 'http://acomics.ru/~train-hard/',
		host = getHost(source),
		page,
		path = '',
		issueNumber = 0;

request(source, function (error, response, body) {

  if (!error && response.statusCode == 200) {

		page = cheerio.load(body);
  	issueNumber  = getIssueNumber(page);

		for (var i = 1; i <= issueNumber; i++) {

			(function(i){
				request(source + i, function (error, response, body) {

				  if (!error && response.statusCode == 200) {

						page = cheerio.load(body);

				  	path = generateURL(body, host);

					  saveImage(path, i+'');
						console.log("Page found", i);
				  }
				})
			})(i);

		};
  }
})



function saveImage(path, i){

		var options = {
		    host: host,
		    port: 80,
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

}


function generateURL (body, url) {
	var imgPath = page('#mainImage').attr('src');

	return imgPath;
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
