var http = require("http");
var request = require("request");
var cheerio = require("cheerio");
var vm = require("vm");
var util = require("util");
var fs = require("fs");

var port = (process.env.PORT || 5000);
var rateInSeconds = 15;
var nowThreads = {};
var pastThreads = {};

var archivedTHreads = [];

var memoryUsage = [];



var options = {
    url: 'https://boards.4chan.org/pol/catalog',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    }
};

var sandbox = {
    catalog: {}
};

var prototype_of_desiredinfo = {
    "date": 1458872967,
    "r": 218,
    "i": 70,
    "lr": {
        "id": 68735599,
        "date": 1458892518,
        "author": "Anonymous"
    },
    "semantic_url": "why-is-hillary-obsessed-with-ayy-lmaos-that-much",
    "country": "TR",
    "author": "Anonymous",
    "imgurl": "1458872967802",
    "sub": "",
    "teaser": "why is hillary obsessed with ayy lmaos that much?"
};

function dupe(proto, toDupe) {
    var k, val, o = {};
    for(k in proto){
        if(toDupe.hasOwnProperty(k)){
            //shallow dupe
            o[k] = toDupe[k]
        }
    }
    return o;
};


(function () {
    function rerun() {
        request(options, function (e, r, b) {
            if (!e && r.statusCode == 200) {
                processHTML(options.url, b, sandbox);
            }
        });
    };
    setInterval(function () {
        rerun();
    }, rateInSeconds * 1000);
    rerun();
})();



function processHTML(url, body, context) {
    var $ = cheerio.load(body);
    var scripts = $('script');

    setImmediate(function () {
        var mem, now, threads;
        scripts.each(function (index, elm) {
            var e = $(this), v = e.attr('src'), scrpt;
            if (v == null) {
                try {
                    //vm.runInContext(e.html(), context);
                    vm.runInThisContext(e.html());
                } catch (e) {

                }
                //sandbox = {catalog: global.catalog};
            }
        });

        sandbox.catalog = {};

        now = (new Date());
        mem = (process.memoryUsage().heapTotal / (1024 * 1024));
        memoryUsage.push([now, mem]);
        console.log(now + " parsed " + url + ", mem usage: " + mem);

        //duplicate the archived thing
        sandbox.catalog = global.catalog;
        threads = global.catalog.threads;
        for(k in threads){
            nowThreads[k] = dupe(prototype_of_desiredinfo, threads[k]);
        }
        sandbox.catalog = {threads: nowThreads};
    });

};

//fs.writeFileSync("catalogue.json", JSON.stringify(sandbox.catalog.threads));

http.createServer(function (req, res) {
    if (req.url === '/mem') {
        res.end(JSON.stringify(memoryUsage));
    }else if(req.url == "/active"){
        res.end(JSON.stringify(nowThreads));
    }else if(req.url =="/archive"){
        res.end(JSON.stringify(archivedTHreads));
    }else{
        res.end(JSON.stringify(sandbox.catalog.threads));
    }
}).listen(port, function () {
    console.log("created server, %s", port);
})
