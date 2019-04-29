var base64 = require('node-base64-image');

    
function broad(data){
    
 var path = data.name,
          options = {localFile: true, string: true};
        base64.base64encoder(path, options, function (err, image) {  
    if (err) { console.log(err); }  
       return image;
    });  
}

exports.broad=broad;