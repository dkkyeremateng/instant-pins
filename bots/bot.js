
module.exports = function (bot,rest) {

bot.on('start', () =>{
const params = {
    icon_emoji: ':smiley:'
}

bot.postMessageToChannel('nodelogs', 'AI Bot is Ready ', params);

});

bot.on('error', (err) =>{
console.log(err);
})

bot.on('message', (data) =>{
    if(data.type !== 'message'){
        return;
    }
console.log(data.text);
  var response =   handleMessage(data.text);
  console.log(response);
  
})



function handleMessage(message){
    if(message.toLowerCase().includes('metrics')){
        rest.post('http://opaltech.herokuapp.com/clientapp/getcardsmetric', {
          data: {},
        }).on('complete', (data, response) => {
            console.log(data.depositcomp)
           
                bot.postMessageToChannel('nodelogs','Completed Deposits: '+data.depositcomp);
        });
    }
    else{
        console.log(message)
        return 0;
     //   return 'Sorry Dont understand this command yet.'
    }
}
}

