var request = require('request');
var api = require('api')

var url = 'http://api.nytimes.com/svc/mostpopular/v2/mostviewed/all-sections/1.json',
	query = { json:true };

query.qs = {	
	"api-key":api.key
}

var getItems = function(callback) {
	request(url, query, function (error, response, body) {
		if (!error && response.statusCode == 200) {
			callback(body)
		}
	});
}

var formatData = function(data){
	var obj = JSON.parse(JSON.stringify(data.results)),
		articles = [];

	for (var prop in obj) {
		var article = {};
		if(obj.hasOwnProperty(prop)){
			var item = obj[prop]
			
			for (var prop1 in item) {
				if(item.hasOwnProperty(prop1)){

					if ( prop1 === "media" ) {
						var media = item[prop1][0];
						for (var prop2 in media) {
							if(media.hasOwnProperty(prop2)){

								if ( prop2 === "caption") {
									article.caption = media[prop2]
								}

								if (prop2 === "media-metadata" ) {
									for (var i = 1;i<media[prop2].length;i++) {

										if (media[prop2][i].format === "superJumbo") {

											article.image = media[prop2][i].url;
											article.dem = [media[prop2][i].width, media[prop2][i].height];
										}
									}
								}
							}
						}
					}

					if (prop1 === "title") {
						article.title =item[prop1]
					}
					if (prop1 === "abstract") {
						article.abstract = item[prop1]
					}
					if (prop1 === "byline") {
						article.byline = item[prop1]
					}
					if (prop1 === "url") {
						article.url = item[prop1]
					}
				}
			}
		}

		if (article.image) {
			articles.push( article )
		}
	}
	return articles;
}

module.exports = {
	returnItems: function( callback ) {
		getItems( function( data ) {
			var truData = formatData(data);
			callback(truData);
		});
	}
}