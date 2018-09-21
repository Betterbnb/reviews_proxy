const express = require('express');
const morgan = require('morgan');
const path = require('path');
const app = express();
const proxy = require('http-proxy-middleware');
const port = process.env.PORT || 3000;


const { routes } = require('./config.json');

app.use(morgan('dev'));
app.use('/homes/:homeId', express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

 //once a request is made to /homes it is proxied to localhost:3001 with the routes above 

for (route of routes) { ///localhost:3000/homes/100/reviews/100
  app.use(route.route, //will serve up all the routes in the config 
      proxy({  //will receive a request (localhost:3000/descriptions/100)
          target: route.address, path
          // pathRewrite: (path, req) => {
          //   return path; //will send a request to localhost:3002/homes/100/reviews/100 now 
          // }
      })
  );
}


// app.use('/home/:id', express.static(path.join(__dirname, 'public')));



app.listen(port, () => {
  console.log(`server running at: http://localhost:${port}`);
});


//in the config: whenever there is a request made to /descriptions it will be rerouted to localhost:3002