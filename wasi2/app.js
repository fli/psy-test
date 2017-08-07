var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var pg = require('pg');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, 'public')));

app.post('/', function(req, res) {
  pg.connect(
    process.env.DATABASE_URL,
    function(err, client, done) {
      var vc = req.body.vocabScore;
      var mr = req.body.matrixScore;
      var years = req.body.years;
      var months = req.body.months;
      if (err) {
	console.error(err);
      } else {
	client.query(
	  'SELECT score('
	    + parseInt(vc) + ','
	    + parseInt(mr) + ','
	    + parseInt(years)+ ','
	    + parseInt(months)+ ')',
	  function(err, result) {
	    done();
	    if (err) {
	      console.error(err);
	      var data = {vocabTScore: 'No result',
			  matrixTScore: '',
			  sumTScores: '',
			  fsiq2Score: '',
			  percentile: '',
			  conf95: ''};
	    } else {
	      var arr = result.rows[0].score.split(',');
	      var data = {
		vocabTScore: arr[0].substring(1),
		matrixTScore: arr[1],
		sumTScores: arr[2],
		fsiq2Score: arr[3],
		percentile: arr[4],
		conf95: arr[5].substring(0, arr[5].length-1)};
	    }
	    res.send(data);
	  });
      }
    });
});

app.listen(process.env.PORT || 3000);
