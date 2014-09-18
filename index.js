var fs = require('fs-extra');
var request = require('request');
var moment = require('moment');

//WILL TAKE APPX 10.5 HOURS TO RUN
console.log('\n'+moment().format('hh:mm:ss'), '|', 'Priming the Cache will take up to 11 hours.\n');

var queue = [],
    url1 = 'http://m.gsa.gov/api/rs/perdiem/zip/',
    url2 = '/year/'
    years = ['2014','2015'];

fs.readFile(__dirname+'/us-zips.json', function read(err, data) {
    if (err) {
        throw err;
    }
    else{
        var zips = JSON.parse(data);
        prime(zips);
    }
});

function prime(zips){
    var zipsLength = zips.length;

    function repeater(index) {
        for(i in years){
            grab(zips[index],years[i]);
        }
        var done = [];
        function grab(z,y){
            var req = url1+z+url2+y;
            request({
                url: req,
                json: true
            }, function(error, response, json) {
                if (!error && response.statusCode === 200) {
                    console.log(moment().format('hh:mm:ss'), '|', 'Success: ',z,y);
                } else {
                    console.log(moment().format('hh:mm:ss'), '|', 'Fail: ',z,y);
                }
                done.push(y)
                if(done.length == 2 && index < zipsLength){
                    repeater(index+1)
                    return;
                }
            });
        }
    }
    repeater(0)
}