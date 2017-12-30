var rp = require('request-promise');
var cheerio = require('cheerio');

var options = {
    uri: 'http://www.taotu.la',
    headers: {

    },
    transform: function (body) {
        return cheerio.load(body);
    }
};

rp(options)
    .then(function ($) {
        var html  = $.html();
        console.log(html);
        console.log('==================================>>>>>');
        $('#post_container .post .zoom').each(function(){
            console.log($(this).attr('href'));
        })
        // Process html like you would with jQuery...
    })
    .catch(function (err) {
        // Crawling failed or Cheerio choked...
    });
