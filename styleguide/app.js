import express from 'express';
import ejs from 'ejs';
import kss from 'kss';
import pkg from '../package.json';

// Express App
var app = express();

app.set('view engine', 'ejs');
app.set('views', __dirname);

app.use(express.static(__dirname + '/../'));

app.locals.renderMarkup = function(markup) {
  return markup.replace('{{modifier_class}}', pattern.modifiers(i).className());
};

app.get('/', function(req, res) {
  let version = app.get('env') === 'production' ? pkg.version : pkg.version + '-dev';

  // Read KSS on each render. Since this is only used for local development, I'm
  // not too worried about performance. (It takes approx. 40ms to parse KSS.)
  kss.traverse(__dirname + '/../scss', {}, function(err, styleguide) {
    if(err) console.error(err);

    res.render('index', {
      version: version,
      styleguide: styleguide,
      year: new Date().getFullYear()
    });
  });

});

// Start 'er up!
const PORT = 3000;
app.listen(PORT, function() {
  console.log(`Pattern Library running on 'http://localhost:${PORT}'.`);
});
