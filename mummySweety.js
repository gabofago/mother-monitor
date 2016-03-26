var request = require("request");

var dataFromMummy = null;
request("http://mother-mont.herokuapp.com/archive", function(err, resp, body){
    if(!err && resp.statusCode == 200){
        try{
            dataFromMummy = JSON.parse(body);
        }catch(e){
            console.log(e);
        }

        console.log("posts in archive: " + dataFromMummy.length);

        //go through the list of archives
        for(var i = 0; i < dataFromMummy.length; i++){
            for(postId in dataFromMummy[i]){
                console.log("post id "+ postId + " responses: " + dataFromMummy[i][postId]['r']  + ", " + dataFromMummy[i][postId]['semantic_url']);
            }
        }
    }
});
