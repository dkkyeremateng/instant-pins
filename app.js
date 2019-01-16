
var randomString = require('random-string');
var randomstring = require('randomstring');
var express = require('express');
var app = express();
var configDB = require('./config/database.js');
var Person = require('./config/models/personSchema').Data;
var Card = require('./config/models/cardSchema').Data;

var Merchant = require('./config/models/merchantSchema').Data;
var Dump = require('./config/models/dumpSchema').Data;
var Deposit = require('./config/models/depositSchema').Data;
var Upload = require('./config/models/uploadSchema').Data;
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
//var sendgrid  = require('sendgrid')();
var path = require('path');
var DateDiff = require('date-diff');
var firebase = require('firebase');
var rest = require('restler');
var kingbakura = require('./opal-mega/payment');
var sikapa = require('./opal-mega/payment');
var admin = require("firebase-admin");
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
const nodemailer = require('nodemailer');
const xoauth2 = require('xoauth2');
var Client = require('node-rest-client').Client;

var http = require('http');
var server = http.createServer(app);
var socketIO=require('socket.io')
const io = socketIO(server);
const SlackBot = require('slackbots');
const axios = require('axios');
const bot = new SlackBot({token: 'xoxb-314822764211-432632777991-YYfddSulk0GqWj1amOsLY5qJ',name : 'smartbot'});
require('./config/passport')(passport);

//var io = require("socket-io");
//var app = require("express");

// port  = process.env.OPENSHIFT_NODEJS_PORT;
//var port = 2000;

var Slack = require('slack-node');
var c =0;
webhookUri = "https://hooks.slack.com/services/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";
 
slack = new Slack();
slack.setWebhook(webhookUri);
 
slack.webhook({
  channel: "#nodelogs",
  username: "nodeOpal",
  text: "Server Restarted , Up and Running."
}, function(err, response) {
  console.log(response);
});

var connection_string = ' ';
var moment = require('moment-timezone');
var schedule = require('node-schedule');

// if OPENSHIFT env variables are present, use the available connection info:
 // connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":"+process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +process.env.OPENSHIFT_APP_NAME;
connection_string =process.env.MONGODB_URI;
// if OPENSHIFT env variables are present, use the available connection info:
//  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ":"+process.env.OPENSHIFT_MONGODB_DB_PASSWORD + "@" + process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +process.env.OPENSHIFT_APP_NAME;
mongoose.connect(process.env.MONGODB_URI);
app.use(cookieParser());
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
 extended: true }));
//app.use(app.router);

//connection_string= '127.0.0.1:27017';
var upload = require('express-fileupload');
app.use(upload());
app.use(session({secret: 'thiefkingbakura', saveUninitialized:true, resave: true,  cookie : { secure : false, maxAge : (24 * 60 * 60 * 1000) },store: new MongoStore({  url:connection_string+"/sessions"})}));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

 app.use('/dashboard',express.static(__dirname + '/views'));
 
 app.use('/addcard',express.static(__dirname + '/views'));
 app.use('/registermerchant',express.static(__dirname + '/views'));
 app.use('/listcards',express.static(__dirname + '/views'));
 app.use('/listorders',express.static(__dirname + '/views'));
 app.use('/listdumps',express.static(__dirname + '/views'));
 app.use('/home',express.static(__dirname + '/instant'));
 app.use('/faq',express.static(__dirname + '/views'));
 app.use('/contact',express.static(__dirname + '/views'));
 app.use('/listmerchants',express.static(__dirname + '/views'));
 app.use('/auth',express.static(__dirname + '/views'));
 app.use('/full',express.static(__dirname + '/views'));
app.use('/portal',express.static(__dirname + '/views'));
app.use('/topup',express.static(__dirname + '/views'));
app.use('/iportal',express.static(__dirname + '/views'));
app.use('/broadcaster',express.static(__dirname + '/views'));
app.use('/transfer',express.static(__dirname + '/views'));
app.use('/withdraw',express.static(__dirname + '/views'));
app.use('/transactions',express.static(__dirname + '/views'));
app.use('/settings',express.static(__dirname + '/views'));
var secure = express.Router();
var auth= express.Router();
var formidable = require('formidable');
require('./routes/auth.js')(auth, passport,app);
var ua = require('universal-analytics');
var clientr = express.Router();
var visitor = ua('UA-107715939-1');


visitor.pageview("/").send()
app.use('/auth',auth);
require('./routes/secure.js')(secure,app, passport);
app.use('/clientapp',clientr);
require('./routes/client')(clientr);
//app.use('/',express.static(__dirname + '/views'));
app.set('view engine','ejs');
//mongoose.connect("mongodb://"+connection_string+"/person");
//mongoose.connect(configDB.url2);
//persondb = mongoose.createConnection("mongodb://localhost:27017/persons");
uploaddb = mongoose.createConnection("mongodb://"+connection_string+"/uploads");
persondb = mongoose.createConnection("mongodb://"+connection_string+"/users");
carddb = mongoose.createConnection("mongodb://"+connection_string+"/cards");
merchantdb = mongoose.createConnection("mongodb://"+connection_string+"/merchants");
dumpdb = mongoose.createConnection("mongodb://"+connection_string+"/dumps");
var personroute = express.Router();
var MobileMoney = kingbakura.Payment;
var Airtime = kingbakura.Airtime;
var Sms = kingbakura.Sms;
var smoney = sikapa.Payment;
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
 var head = "FreebieX";
// parse application/json 
app.use(bodyParser.json())
 var head = "Gyedi";//"InstantPins";
var pt = '/';
var pt2 = false;
var utmodel = {
         tfulldate: '',
         tdate: '',
         ttime: '',
         ttype: '',
         tamount: '',
};
//app.use('/clientapp',client);
//require('./routes/client')(client);


var redis = require("redis");
var redisclient;
//That works just fine in development, but we need it to authenticate to Redis To Go in production. To handle both cases I just check for the existence of the REDISTOGO_URL, like so:
if (process.env.REDISTOGO_URL) {
 var rtg  = require("url").parse(process.env.REDISTOGO_URL);
 redisclient =  redis.createClient(rtg.port, rtg.hostname);
 redisclient.auth(rtg.auth.split(":")[1]);

//client.set("testkey", new Date().toDateString(), redis.print);

//console.log("GETTING: "+getKey("testkey"))
} else {
  console.log("Error COnnecting")
  //  var redis = require("redis").createClient();
}
//Everything should still work fine in development, but we still need to implement the Redis To Go connection. To do this we need to extract the port, hostname, and authentication string from REDISTOGO_URL using Node’s built-in url lib:]
// inside if statement

function getKey(key){

  redisclient.get(key,  function(err, reply) {
     // reply is null when the key is missing
     console.log(reply);
     return reply;
 });
}

/*
 
 setInterval(()   => {
  redisclient.get('testmoney', (err, payload) => {
    if(err) throw err;
   if( payload && payload=='yes'){
  var   datacd = { action: "sendbill",
  wallet: "027XXXXXXX",
  description: "Automated Downtime TESTS",
  amount: "1",
  api_key:  "",
  wallet_type : "t"};
  // "FeesOnCustomer": true,

    
rest.post('https://www.cediplus.com/apiplus/plus_v1', {
  data: datacd,
}).on('complete', function(data, response) {
  if (response.statusCode == 200) {
    console.log(data);
    redisclient.get('cardmoney', (err, reply) => {
     console.log(reply);
     data = JSON.parse(data);
      if(err) console.error(err);
      if(reply){
      reply = reply + "\n"+new Date().toTimeString()+"    "+data.response_msg;
      redisclient.set('cardmoney', reply, redis.print);

      if(data.state!=200){                
    
slack.webhook({
  channel: "#nodelogs",
  username: "nodeOpal",
  text: "WE GOT EM :"+ new Date().toTimeString()
}, function(err, response) {
  console.log(response);
});
      }
      else{
  
}
      }
      });
  }
});
}
  });
  
 },1000*60*5);
 */
//}

//.log(data);     
 //calls();
 
app.get('/faq',function(req, res){
	res.render('faq.ejs');
});
app.get('/home',function(req, res){
 res.sendFile(path.join(__dirname + '/instant/home.html'));
});


app.get('/contact', function(req,res){
   res.render('contact_us.ejs');
});


app.get('/full', function(req,res){
  res.render('fullpage.ejs');
});

app.get('/iportal',function(req, res){
	res.render('iportal.ejs');
});

app.get('/broadcaster', function(req,res){
   res.render('broadcast.ejs');
});



var agent = new MobileMoney("HM2806170019","Basic ZWx0c2J4dmc6Z3pscmVyeGQ=","fdc9a31c8f361b482bf59077ca81b9eb");
var sagent = new MobileMoney("HM0506170010","Basic amJia3J4Yms6aW5iZHFweW8=","fdc9a31c8f361b482bf59077ca81b9eb",);
agent.say();
//agent.("0270413417","tigo-gh","0.5","http://41.210.18.192:2120/callback",function(response){  console.log(response);});
//console.log(agent.rdata);
var airtime = new Airtime();
//airtime.send("0270413417","1","tigo",function(res){console.log(res);})

var sms = new Sms();
//sms.send("JOhn","0270413417","Hello boy!",function(res){log(res);});

app.all('/callbackb', (req,res)=>{
  console.log(req.body.address);
  res.send("ok");
});
app.all('/sendcallback', (req,res) =>{
  console.log(req.body);
})
app.all('/sendmoney', (req,res) => {
agent.send(req.body.number,req.body.provider+'-gh',req.body.amount,"http://opaltech.herokuapp.com/sendcallback",(data)=>{
  console.log(data);
  res.json(data)
});

})
app.all('/callback',function(req,res){
  res.send('callback from MM servers');
 if(agent.isSuccess(req.body)){
   console.log("Succesfull Transaction")
   io.emit('sold',"sold");
 
   redisclient.get('sold', (err, reply) => {
     console.log(reply);
     if(err) console.error(err);
     if(reply){
     var increment = parseInt(reply)+1;
     redisclient.set('sold', increment.toString(), redis.print);
     }
     });
   Deposit.findOne({'token':req.body.Data.TransactionId},function(err,trans){
    if(trans){
           if(trans.class=="individual"){
            Card.findOne({'type': trans.type},function(err,card){ 
                 if(card){  
             
     
 slack.webhook({
   channel: "#nodelogs",
   username: "nodeOpal",
   text: trans.pnumber+" : Thanks for your purchase!\nCard Type:"+card.type+"\nSerial No:"+card.serial+"\nPin: "+card.pin+"\nUrl: "+card.url+" @Hamid" 
 }, function(err, response) {
   console.log(response);
 });
            sms.send(head,trans.pnumber,'Thanks for your purchase!\nCard Type: '+card.type+'\nSerial No:'+card.serial+"\nPin: "+card.pin+"\nUrl: "+card.url+"\nContact 0502262457 or 0545095737 for Support.(8AM - 8PM)",function(a){console.log(a)});
            var dump = new Dump();
            dump.serial = card.serial;
            dump.type = card.type;
            dump.pin = card.pin;
            dump.amount = card.unitprice;
            dump.udate = new Date();
            dump.usedby = trans.pnumber;
            dump.save(function(err){})
            card.remove();
            trans.completed = true;
            trans.save(function(err){})
     
      
       }
       else{
          
 slack.webhook({
   channel: "#nodelogs",
   username: "nodeOpal",
   text: trans.pnumber+" : OUT OF CARDS ERROR"
 }, function(err, response) {
   console.log(response);
 });
            sms.send(head,trans.pnumber,'Sorry ran out of cards.. Refund of amount paid in progress...',function(a){console.log(a)});
            trans.refund = true;
            trans.save(function(err){});
            io.emit('empty',"empty");
          //  var dump = new Dump();
       
       }
     
        
     });
     
     }
     else if(trans.class=="merchant"){
       Card.find({'type': trans.type},function(err,cards){ 
         if(cards.length>=trans.quantity){
           
         var tmsg='Thank you for Your Order\nTotal Cards Ordered: '+trans.quantity+'\nTotal Value : '+trans.amount+' GHC\n'+"Card Url: "+cards[0].url+"\n\n";
        //sms.send(head,trans.pnumber,'Thanks for your purchase\nCards have been delivered to your Email\nContact 0502262457 for Support.',function(a){console.log(a)});
          for(var i=0; i<trans.quantity; i++){
           var card = cards[i];
           tmsg+='\nCard Type: '+card.type+'\nSerial No:'+card.serial+"\nPin: "+card.pin;
           tmsg+='\n.............';
            var dump = new Dump();
            dump.serial = card.serial;
            dump.type = card.type;
            dump.pin = card.pin;
            dump.udate = new Date();
            dump.amount = parseFloat(trans.amount);
            dump.usedby = trans.pnumber;
            dump.save(function(err){})
            
            card.remove();
          
         
            trans.completed = true;
            trans.save(function(err){})
          }
        
          sms.send(head,trans.pnumber,tmsg,function(a){console.log(a)});
        // f
            //  sms.send(head,trans.pnumber,'Thanks for your purchase!'+tmsg+'\nContact 0542731844 for Support.',function(a){console.log(a)});
      Merchant.findOne({'phonenumber':trans.pnumber},function(err,merc){
     
       if(merc){
        // sms.send(head,trans.pnumber,'Thanks for your purchase\nCards have been delivered to your Email\nContact 0502262457 for Support.',function(a){console.log(a)});
        // for(var i=0; i<
         var transporter = nodemailer.createTransport({
           service: 'gmail',
           auth: {
             user: '', //email address to send from
             pass: '' //the actual
           }
         })
         /*
         global.window = {document: {createElementNS: () => {return {}} }};
       global.navigator = {};
       global.btoa = () => {};
       
     var fs = require('fs');
     var jsPDF = require('jspdf');
     
     var doc = new jsPDF();
     doc.text(tmsg, 10, 10);
     var data = doc.output();
     
     fs.writeFileSync('./document.pdf', data);
     
     delete global.window;
     delete global.navigator;
     delete global.btoa;
     */
     var docx = require('docx');
      
     // Create document
     var doc = new docx.Document();
      
     // Add some content in the document
     var paragraph = new docx.Paragraph(tmsg);
     
     doc.addParagraph(paragraph);
      
     // Used to export the file into a .docx file
     var exporter = new docx.LocalPacker(doc);
      
     // Or use the express packer to make the file downloadable.
     // res is express' Response object
     //var exporter = new docx.ExpressPacker(doc, res);
      
     exporter.pack('document');
     // If you want to export it as a .pdf file instead
     //exporter.packPdf('document');
      
         var mailOptions = {
           from: 'InstantPins <instantpins@gmail.com>',
           to: 'kiy@gmail.com',
           subject: 'Merchant Order Completed',
           text: 'Thank you for your Purchase, your Order is attached below' ,
           attachments: [{
             filename: 'order.docx',
             path: './document.docx',
             contentType: 'application/docx'
           }]
         }
         
         transporter.sendMail(mailOptions, function (err, res) {
           if(err){
               console.log('Error');
           } else {
               console.log('Email Sent');
           }
           console.log(err);
           console.log(res);
         })
       }
       
      })
     
     //while(1);
     
     
          }
          else{
            sms.send(head,trans.pnumber,'Sorry ran out of cards.. Refund of amount paid in progress...',function(a){console.log(a)});
          trans.refund = true;
          trans.save(function(err){});
          io.emit('empty',"empty");
          }
       
     
     });
     }
     }
     
     
   });
 
 }
 });
//const nodemailer = require('nodemailer');

// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing


app.all('/setkey', (req,res)=>{

redisclient.set(req.query.key, req.query.value, redis.print);
redisclient.get(req.query.key, (err, reply) => {
  if(reply){
res.send(reply);
  }
});
})
app.all('/getkey',(req,res)=>{

redisclient.get(req.query.key, (err, reply) => {
console.log(reply);
if(err) console.error(err);
if(reply){
res.send(reply);
}
else{
  res.send("none");
}
})
});

app.all('/getratio', (req,res) => {

  redisclient.get('dial', (err, reply) => {
    console.log(reply);
    if(err) console.error(err);
    if(reply){
   
  redisclient.get('sold', (err, reply2) => {
    console.log(reply2);
    if(err) console.error(err);
    if(reply2){
    var v1 = parseInt(reply);
    var v2 = parseInt(reply2);
    var ratio = (v2/v1).toFixed(2);
    var perc =  ((v2/v1)*100).toFixed(2);
    var dials = v1.toString();
    var sold = v2.toString();
    res.json({ratio : ratio, perc : perc, dials : dials, sold : sold});
  //  redisclient.set('dial', increment.toString(), redis.print);
    }
    });
    }
    });
});

app.get('/laravel',(req,res)=>{
  var rnd = randomString({
    length: 12,
    numeric: true,
    letters: true,
    special: false
    });
res.send(rnd);
});
app.all('/refund/:tid/:a/:r',function(req,res){
agent.refund(req.params.tid,req.param.a,req.params.r,true,function(response){
res.json(response);
});
});

app.all('/ussd', function(req,res){

   res.header("Access-Control-Allow-Origin", "http://apps.smsgh.com");
  res.header("Access-Control-Allow-Headers",  req.get("Access-Control-Request-Headers"));
  res.header("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  var top = {};
  top.Type="Response";
  //top.Message="Welcome!";
   
   var tfone = req.body.Mobile;
   var userfone = "0";
   for(var i =3; i<tfone.length; i++){
userfone+=tfone.charAt(i);
   }

   console.log(userfone);
   console.log(req.body.Sequence);
   var msg = req.body.Message;
   io.emit('ussd',"activity");
   if(req.body.Type=="Initiation"){
    //top.Message= "Welcome to Opal Fintech Waec Portal!"

    top.Message="Welcome to Gyedi Enterprise (authorised retailer) Fast Shop\nChoose an Option below:\n1. Buy a card\n\n";
    top.Type="Response";
  res.json(top);

  redisclient.get('dial', (err, reply) => {
    console.log(reply);
    if(err) console.error(err);
    if(reply){
    var increment = parseInt(reply)+1;
    redisclient.set('dial', increment.toString(), redis.print);
    }
    });
       
   }
   
  /*
   if(1){
    top.Message="Welcome to Instant Pins Portal\nWe are working to announce something very cool soon. Stay Tuned!";
    top.Type="Release";
    res.json(top);
  }
  */
   else{
 if(req.body.Sequence == 2){

if(msg == 1){
 top.Message="Select a Card to Buy\n1. WAEC Result Checker(GHC 10)"//'\n1. Price List\n2. WAEC Result Checker Card"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Response";
    top.ClientState = "indv";
        res.json(top);
}
else if(msg == 2){
  Merchant.findOne({'phonenumber':userfone},function(err,merchant){
    if(merchant){
    //  top.Message="This Number is a Registered Merchant!\nName: "+merchant.name+"\nPhone : "+merchant.phonenumber;
      //top.Type="Release";
        //  res.json(top);
        if(merchant.activated==false){
            top.Message="This Merchant Account is Deactivated, Please Contact Support to Activate.Thank You"
            top.Type= "Release";
            res.json(top);
        }
        else{
         top.Message="Select Card to Buy in Bulk\n1.  WAEC Result Checker Card"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Response";
    top.ClientState = "merc";
     res.json(top);
        }
    }
    else{
        top.Message="This Number is NOT Registered as a Merchant!";
      top.Type="Release";
          res.json(top);
    }
  })

}







 }
   
   else if(req.body.Sequence == 3){
if(  req.body.ClientState == "indv"){
      if(msg==2){
        top.Message="WAEC Result Checker Card\n Price: 12\nSHS Placement Card\n Price: Soon...\nNote: There are NO charges, Maintenance cost factored into pricing."
        top.Type="Release";
        res.json(top);
      
        /*
        var cards= ['SHS Placement Card','WAEC Result Checker Card','NVTI Result Checker Card','UCC-Distance Result Checker Card'];
       var ct =  Math.floor(Math.random() * 2); 
          Card.findOne({'type': cards[ct]},function(err,card){ 
            if(card){  
 top.Message="A Random Card Has been Sent to You!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
  

       sms.send(head,userfone,'Thanks for your purchase!\nCard Type: '+card.type+'\nCard No:'+card.serial+"\nCard Pin: "+card.pin+"\nCard Url: "+card.url+"\nContact 0542731844 for Support.",function(a){console.log(a)});
       var dump = new Dump();
       dump.serial = card.serial;
       dump.type = card.type;
       dump.pin = card.pin;
       dump.amount = card.unitprice;
       dump.usedby = userfone;
        dump.udate = new Date();
       dump.save(function(err){})
       card.remove();
  }
  else{
    top.Message="Out of Cards please try again later!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
  
  }
      });
      */
      }
else if(msg==1){
          Card.findOne({'type': 'WAEC Result Checker Card'},function(err,card){ 
            if(card){  
              /*
              if((req.body.Operator.toLowerCase()+"-gh").indexOf("mtn") >= 0){
                  
 top.Message="Close this page. Dial *170# Select Option 7 My wallet, Select option 3 for my approvals, and follow the prompt to complete your purchase"//"Now follow the steps below to authorize payment of GHC"+card.unitprice+" to receive your card, Dial *170# Select Option 10 My wallet Select option 3 for my approvals and follow the prompt"
 }
              else{
                top.Message="A Bill Prompt of "+card.unitprice+" cedis has been sent to you for Authorization.";
  
              }
              */
              top.Message="A Bill Prompt of "+card.unitprice+" cedis has been sent to you for Authorization.";
  
//top.Message= "Payment Gateway Error, Try again";
 top.Type="Release";
 /*
 setTimeout(() => {
  
},5000);
*/
res.json(top);
    var deposit = new Deposit();
        //deposit.amount: '0.1';    
       // deposit.pnumber: userfone,
      var cup = card.unitprice;
      if(userfone=='0270413417'){
        cup = 1;
      }
      agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",fify(cup),"http://opaltech.herokuapp.com/callback",function(response){
  var deposit = new Deposit();
  
      deposit.amount=card.unitprice.toString();
      deposit.pnumber=userfone;
      deposit.provider=req.body.Operator.toLowerCase();
     deposit.date = new Date();
     deposit.gateway = response.gateway;
     deposit.type= card.type;
     try{
     deposit.token= response.Data.TransactionId || response.token;
     if((req.body.Operator.toLowerCase()+"-gh").indexOf("mtn") >= 0){
   // sms.send(head,userfone,,function(a){console.log(a)});
      
        
     } 
     }catch(err){console.log("No Token received")}
      deposit.save(function(err){});
      io.emit('prompt',"prompt")

});

  
             /*
       sms.send(head,userfone,'Thanks for your purchase!\nCard Type: '+card.type+'\nCard No:'+card.serial+"\nCard Pin: c"+card.pin,function(a){console.log(a)});
       var dump = new Dump();
       dump.serial = card.serial;
       dump.type = card.type;
       dump.pin = card.pin;
       dump.usedby = userfone;
       dump.save(function(err){})
       card.remove();
       */
  }
  else{
        
slack.webhook({
  channel: "#nodelogs",
  username: "nodeOpal",
  text: userfone+" : Out of Cards Error"
}, function(err, response) {
  console.log(response);
});
    top.Message="Out of Cards please try again later!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
    io.emit('empty',"empty");
  
  }
      });
      }

else if(msg==3){
          Card.findOne({'type': 'SHS Placement Card'},function(err,card){ 
            if(card){  
 top.Message="A Bill Prompt of "+card.unitprice+" cedis has been sent to you for payment!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
    var deposit = new Deposit();
        //deposit.amount: '0.1';    
       // deposit.pnumber: userfone,
      agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",fify(card.unitprice),"http://opaltech.herokuapp.com/callback",function(response){
  var deposit = new Deposit();
      deposit.amount=card.unitprice.toString();
      deposit.pnumber=userfone;
      deposit.provider=req.body.Operator.toLowerCase();
     deposit.date = new Date();
     deposit.type= card.type;
     deposit.token= response.Data.TransactionId;
      deposit.save(function(err){});

});
  
             /*
       sms.send(head,userfone,'Thanks for your purchase!\nCard Type: '+card.type+'\nCard No:'+card.serial+"\nCard Pin: c"+card.pin,function(a){console.log(a)});
       var dump = new Dump();
       dump.serial = card.serial;
       dump.type = card.type;
       dump.pin = card.pin;
       dump.usedby = userfone;
       dump.save(function(err){})
       card.remove();
       */
  }
  else{
    top.Message="Out of Cards please try again later!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
  io.emit('empty',"empty");
  }
      });
      }
     
      else if(msg==4){
          Card.findOne({'type': 'NVTI Result Checker Card'},function(err,card){ 
            if(card){  
 top.Message="A Bill Prompt of "+card.unitprice+" cedis has been sent to you for payment!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
    var deposit = new Deposit();
        //deposit.amount: '0.1';    
       // deposit.pnumber: userfone,
      agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",card.unitprice.toString(),"http://opaltech.herokuapp.com/callback",function(response){
  var deposit = new Deposit();
      deposit.amount=card.unitprice.toString();
      deposit.pnumber=userfone;
      deposit.provider=req.body.Operator.toLowerCase();
     deposit.date = new Date();
     deposit.type= card.type;
     deposit.token= response.Data.TransactionId;
      deposit.save(function(err){});

});
  
             /*
       sms.send(head,userfone,'Thanks for your purchase!\nCard Type: '+card.type+'\nCard No:'+card.serial+"\nCard Pin: c"+card.pin,function(a){console.log(a)});
       var dump = new Dump();
       dump.serial = card.serial;
       dump.type = card.type;
       dump.pin = card.pin;
       dump.usedby = userfone;
       dump.save(function(err){})
       card.remove();
       */
  }
  else{
    top.Message="Out of Cards please try again later!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
  io.emit('empty',"empty");
  }
      });
      }
      else if(msg==5){
        Card.findOne({'type': 'UCC-Distance Result Checker Card'},function(err,card){ 
          if(card){  
top.Message="A Bill Prompt of "+card.unitprice+" cedis has been sent to you for payment!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
  top.Type="Release";
  res.json(top);
  var deposit = new Deposit();
      //deposit.amount: '0.1';    
     // deposit.pnumber: userfone,
    agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",card.unitprice.toString(),"http://opaltech.herokuapp.com/callback",function(response){
var deposit = new Deposit();
    deposit.amount=card.unitprice.toString();
    deposit.pnumber=userfone;
    deposit.provider=req.body.Operator.toLowerCase();
   deposit.date = new Date();
   deposit.type= card.type;
   deposit.token= response.Data.TransactionId;
    deposit.save(function(err){});

});


}
else{
  top.Message="Out of Cards please try again later!"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
  top.Type="Release";
  res.json(top);
  io.emit('empty',"empty");

}
    });
    }
      else{
         top.Message="Invalid Option Try Again"//\n2. Top-up Ticket As Standard   \n3. Top-Up Ticket Premium  \n4. Transfer Money  \n5. Withdraw Airtime  \n6. Withdraw MobileMoney";
    top.Type="Release";
    res.json(top);
      }
   }
   else if(req.body.ClientState=="merc"){
    if(msg == 1){
      top.Message="WAEC Result Checker Card Card Bulk Price 9 per unit\nEnter Quantity below(Min 1): ";
      top.ClientState="WAEC Result Checker Cardq";
      top.Type="Response";
       res.json(top);
    }
    else if(msg == 2){
      top.Message="SHS Placement Card Card Bulk Price 7 per unit\nEnter Quantity below(Min 1): ";
      top.ClientState="SHS Placement Cardq";
      top.Type="Response";
       res.json(top);
    }
  
    else if(msg == 3){
      top.Message="NVTI Result Checker Card Card Bulk Price 0.2 per unit\nEnter Quantity below(Min 20): ";
      top.ClientState="NVTI Result Checker Cardq";
      top.Type="Response";
       res.json(top);
    }
    else if(msg == 4){
      top.Message="UCC-Distance Result Checker Card Bulk Price 0.5 per unit\nEnter Quantity below(Min 20): ";
      top.ClientState="UCC-Distance Result Checker Cardq";
      top.Type="Response";
       res.json(top);
    }
    else{
      top.Message="Invalid Option Try Again";
      top.Type="Release";
       res.json(top);
    }
   
   }


}
else if(req.body.Sequence == 4){
if(isNaN(msg)){
  top.Message="Invalid Amount Try again!";
top.Type = "Release";
res.json(top);
}
else if(parseInt(msg)<1){
  top.Message="Below Minimum Quantity Try again!";
top.Type = "Release";
res.json(top);
}
else{
  if(req.body.ClientState=="WAEC Result Checker Cardq"){
      Card.find({'type':'WAEC Result Checker Card'},function(err,cards){
        var card = cards[0];
          if(cards.length<parseInt(msg)){
             top.Message="Not Enough Cards available Try again Later!";
top.Type = "Release";
res.json(top);
          }
          else{
              // deposit.pnumber: userfone,
              
                       top.Message="A Bill prompt has been sent you , Please proceed with payment!";
top.Type = "Release";
res.json(top);
var deposit = new Deposit();
deposit.amount=(card.bulkprice*parseInt(msg)).toString();
      agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",deposit.amount,"http://opaltech.herokuapp.com/callback",function(response){
  //var deposit = new Deposit();
 
        deposit.quantity = parseInt(msg);
      deposit.pnumber=userfone;
      deposit.provider=req.body.Operator.toLowerCase();
     deposit.date = new Date();
     deposit.type= cards[0].type;
     deposit.class = "merchant";
     deposit.token= response.Data.TransactionId;
      deposit.save(function(err){});
          
});
  }
    
      });
  }
   else if(req.body.ClientState=="SHS Placement Cardq"){
      Card.find({'type':'SHS Placement Card'},function(err,cards){
         var card = cards[0];
          if(cards.length<parseInt(msg)){
             top.Message="Not Enough Cards available Try again Later!";
top.Type = "Release";
res.json(top);
          }
          else{
              // deposit.pnumber: userfone,
                   top.Message="A Bill prompt has been sent you , Please proceed with payment!";
top.Type = "Release";
res.json(top);
      var deposit = new Deposit();
      deposit.amount=(card.bulkprice*parseInt(msg)).toString();
      agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",deposit.amount,"http://opaltech.herokuapp.com/callback",function(response){
 // var deposit = new Deposit();
         deposit.quantity = parseInt(msg);
      deposit.pnumber=userfone;
      deposit.provider=req.body.Operator.toLowerCase();
     deposit.date = new Date();
     deposit.type= cards[0].type;
     deposit.class = "merchant";
     deposit.token= response.Data.TransactionId;
      deposit.save(function(err){});
          
});
  }
    
      });

  }  
    else if(req.body.ClientState=="NVTI Result Checker Cardq"){
  Card.find({'type':'NVTI Result Checker Card'},function(err,cards){
     var card = cards[0];
          if(cards.length<parseInt(msg)){
             top.Message="Not Enough Cards available Try again Later!";
top.Type = "Release";
res.json(top);
          }
          else{
              // deposit.pnumber: userfone,
               top.Message="A Bill prompt has been sent you , Please proceed with payment!";
top.Type = "Release";
res.json(top);
      var deposit = new Deposit();
      deposit.amount=(card.bulkprice*parseInt(msg)).toString();
      agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",deposit.amount,"http://opaltech.herokuapp.com/callback",function(response){

    
      deposit.pnumber=userfone;
      deposit.provider=req.body.Operator.toLowerCase();
     deposit.date = new Date();
     deposit.type= cards[0].type;
     deposit.class ="merchant";
     deposit.quantity = parseInt(msg);
     deposit.token= response.Data.TransactionId;
      deposit.save(function(err){});
          
});
  }
    
      });
  }
  else if(req.body.ClientState=="UCC-Distance Result Checker Cardq"){
    Card.find({'type':'UCC-Distance Result Checker Card'},function(err,cards){
       var card = cards[0];
            if(cards.length<parseInt(msg)){
               top.Message="Not Enough Cards available Try again Later!";
  top.Type = "Release";
  res.json(top);
            }
            else{
                // deposit.pnumber: userfone,
                 top.Message="A Bill prompt has been sent you , Please proceed with payment!";
  top.Type = "Release";
  res.json(top);
        var deposit = new Deposit();
        deposit.amount=(card.bulkprice*parseInt(msg)).toString();
        agent.charge(userfone,req.body.Operator.toLowerCase()+"-gh",deposit.amount,"http://opaltech.herokuapp.com/callback",function(response){
  
      
        deposit.pnumber=userfone;
        deposit.provider=req.body.Operator.toLowerCase();
       deposit.date = new Date();
       deposit.type= cards[0].type;
       deposit.class ="merchant";
       deposit.quantity = parseInt(msg);
       deposit.token= response.Data.TransactionId;
        deposit.save(function(err){});
            
  });
    }
      
        });
    }
  else{}
}


}
   }
    
    
});
app.get('/returnall',(req,res) => {
  //let record = {amount: trans.amount, provider: trans.provider, token: trans.token, type: trans.type,class: trans.class, quantity: trans.quantity,date: new Date(trans.date),completed: trans.completed,refund: trans.refund}
  let sql = 'SELECT * FROM transactions';
  let query = db.query(sql,(err,result) =>{
    if(err) throw err;
      console.log(result);
      res.json(result)
    //  console.log("New Transaction Recorded");
  })
});
app.get('/newm/:n/:p',function(req,res){
  Merchant.findOne({'phonenumber':req.params.p},function(err,merc){
    if(merc){
      res.send("already");
    }
    else{
  var merchant = new Merchant();
  merchant.name = req.params.n;
  merchant.phonenumber = req.params.p;
  merchant.activated= true;
  merchant.provider = "univeral";
  merchant.save(function(err){});
  res.send("merchant saved");
    }
})
});

app.get('/createcard',function(req,res){
  var card = new Card();
  card.unitprice =0.1;
  card.bulkprice = 0.05;
  card.id = 1;
  card.url = "http://ghana.waecdirect.org";
  card.type= "WAEC Result Checker Card";
    var wtok = randomString({
length: 12,
numeric: true,
letters: false,
special: false
});
  card.pin = wtok;
       wtok = randomString({
length: 12,
numeric: true,
letters: true,
special: false
});
        card.serial = wtok;
      
  card.save(function(err){});
  /*
for(var i =0; i<5; i++ ){
  var card = new Card();
  card.unitprice =0.1;
  card.bulkprice = 0.05;
  card.id = 1;
  card.url = "http://ghana.waecdirect.org";
  card.type= "WAEC Result Checker Card";
    var wtok = randomString({
length: 12,
numeric: true,
letters: false,
special: false
});
  card.pin = wtok;
       wtok = randomString({
length: 12,
numeric: true,
letters: true,
special: false
});
        card.serial = wtok;
      
  card.save(function(err){});
}


for(var i =0; i<5; i++ ){
  var card = new Card();
  card.unitprice =0.2;
  card.bulkprice = 0.1;
  card.id = 2;
  card.url = "http://cssps.gov.gh";
  card.type= "SHS Placement Card";
    var wtok = randomString({
length: 12,
numeric: true,
letters: false,
special: false
});
  card.pin = wtok;
       wtok = randomString({
length: 12,
numeric: true,
letters: true,
special: false
});
        card.serial = wtok;
      
  card.save(function(err){});
}
*/
res.send("Done");
});


app.all('/callback2',function(req,res){
  if(agent.isSuccess(req.body)){
    console.log('Success: ' + req.body.Data.TransactionId);
    res.send("RECEIVED!")
  }
});
app.all('/testplus', (req,res) =>{

  agent.charge(req.body.number,req.body.operator.toLowerCase()+"-gh",fify(1),"http://opaltech.herokuapp.com/callback2",function(response){
 //   var deposit = new Deposit();
 res.json(response)
 console.log(response)
});  

});
app.use('/',secure);

app.get('/*',function(req, res){
   res.redirect('/home'); 
    
    
});




let fify = (price = 0) => {
//price = 
let newprice = (price * (2.0 / 100.0)) + price;
return newprice.toFixed(2);
}

//var io = require('socket.io').listen(server);  //pass a http.Server instance
server.listen(process.env.PORT || process.env.port);


io.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('disconnect', () => console.log('Client disconnected'));
  socket.on('update', (msg)=>{ 
    console.log(msg);
    io.emit('feedback',msg);

  });
});

require('./bots/bot')(bot,rest);
setInterval(() => io.emit('time', new Date().toTimeString()), 200);
//setInterval(() => io.emit('message', new Date().toTimeString()+"Message"), 00);
//setInterval(() => io.emit('time', new Date().toTimeString()), 10);
//setInterval(() => io.emit('time', new Date().toTimeString()), 1000);

//app.listen(port, process.env.OPENSHIFT_NODEJS_IP);
