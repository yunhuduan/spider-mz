var rp = require('request-promise');
var request = require('request')
var cheerio = require('cheerio');
const fs = require('fs');
var options = {
    uri: 'http://www.taotu.la',
    headers: {
        // "Upgrade-Insecure-Requests": 1,
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.84 Safari/537.36"
        // "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
        // "Accept-Encoding": "gzip, deflate",
        // "Accept-Language": "zh-CN,zh;q=0.9"
        //"Cookie": "Hm_lvt_f42145d69535158c41803d07fff18b30=1513391204,1513493383,1513496689; Hm_lpvt_f42145d69535158c41803d07fff18b30=1513526687"
    }
};

rp(options).then(function (body) {
    var $ = cheerio.load(body);
    var pages = [];
    $('#post_container li').each(function () {
        var thumbnail = $(this).find('.thumbnail img').attr('src');
        var article = $(this).find('.article a');
        var href = article.attr('href');
        var title = article.attr('title');
        pages.push({title: title, href: href, thumb: thumbnail});
    });
    console.log(JSON.stringify(pages));
    for (var i = 0; i < pages.length; i++) {
        var p = pages[i];
        var pname = p.href.substring(p.href.lastIndexOf('/') + 1, p.href.lastIndexOf('.'));
        console.log('=====>>>page name:' + pname)
        writeFile(pname, p['href']);
    }

}).catch(function (err) {
    console.error(err.stack);
});


function writeFile(pname, href) {
    rp(Object.assign({}, options, {uri: href})).then(function (body) {
        var $ = cheerio.load(body);
        $('#post_content p img').each(function () {
            var img = $(this).attr('src');
            var fileName = img.substring(img.lastIndexOf('/'));
            var path = 'd:/img/' + pname;
            if (!fs.existsSync(path)) {
                fs.mkdirSync(path);
            }
            console.log('write path:' + path);
            request(img).pipe(fs.createWriteStream(path + fileName));
            //console.log('=====>>>get img url:' + img);
        })

    });
}

