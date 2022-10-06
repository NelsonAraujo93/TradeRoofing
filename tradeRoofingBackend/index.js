
var app = require('./app');
var http = require('http');
const httpServer = http.createServer(app);
var mongoose = require('mongoose');
var port = 3902;
const io = require("socket.io")(httpServer,{
  cors:{
      origin:"*"
  }
});


/*let dataUncheckedNews = [];
let dataCheckedNews = [];
let loggedUsers= [];*/
//let users = [];


/*const addUncheckedNews = (news) =>{
  dataUncheckedNews = news;
}*/
io.on("connection", (socket)=>{
  socket.on("new-service", (data) =>{
    var dataNotify=data;
    dataNotify.kind='New service';
    io.emit("update-services");
    io.emit("update-notify",dataNotify)
  });
  socket.on("new-user", (data) =>{
    var dataNotify=data;
    dataNotify.kind='New user';
    io.emit("update-users");
    io.emit("update-notify",dataNotify)
  });
  socket.on("new-request", (data) =>{
    var dataNotify=data;
    dataNotify.kind='New request';
    io.emit("update-requests");
    io.emit("update-notify",dataNotify)
  });
  socket.on("new-message", (data) =>{
    var dataNotify=data;
    dataNotify.kind='New message';
    io.emit("update-messages-"+data.id,data.chat)
    io.emit("update-notify",dataNotify);
  });
});


mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/trade-roofing', { useNewUrlParser: true })
    .then(() => {
        console.log('buenos días');

        //crear servidor para escuchar peticionoes
        /*server.listen(port, () => {
            console.log("server starting on port : " + port);
        });*/
        httpServer.listen(port, () => {
            console.log("server starting on porto : " + port);
        });
    });