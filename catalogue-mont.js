var http = require("http");
var request = require("request");
var cheerio = require("cheerio");
var vm = require("vm");
var util = require("util");

var rateInSeconds = 15;
var activeThreads = new Map();
var archivedTHreads = new Map();

var options = {
    url: 'https://boards.4chan.org/pol/catalog',
    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30'
    }
};

const sandbox = {
    globalVar: 1,
    document: {
        addEventListener: function(){}
    }
};
vm.createContext(sandbox);

(function () {
    function rerun(){
        request(options, function(e, r, b){
            console.log('hi');
            if(!e && r.statusCode == 200){
                processHTML(b, sandbox);
            }
        });
    };
    setInterval(function () {
        rerun();
    }, rateInSeconds * 1000 * 60);
    rerun();
})();

function processHTML(body, context){
    var $ = cheerio.load(body);
    var scripts = $('script');
    scripts.each(function(index, elm){
        var e = $(this), v = e.attr('src');
        if(v == null){
            try {
                vm.runInContext(e.html(), context);
            }catch(e){

            }
        }
    });

};
