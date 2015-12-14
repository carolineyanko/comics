var fs = require('fs');
var http = require('http');
var request = require('request');
var cheerio = require('cheerio');

var source = 'http://acomics.ru/~train-hard/',
		host = getHost(source),
		page,
		path = '',
		issueNumber = 0;
