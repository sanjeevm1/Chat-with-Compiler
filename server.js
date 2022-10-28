const express=require('express');
const axios=require('axios');
const {Telegraf}=require('telegraf');


const app=express();
app.use(express.static("BOT"));

require('dotenv').config({path:__dirname+"/.env"});
const bot=new Telegraf(process.env.BOT_TOKEN,{polling:true});

app.listen(process.env.PORT || 5000,()=>{
    console.log("listened");
});



let support=["Python","Java","Javascript","C"]

let obj={};
let send=bot.telegram;


bot.on("text",(msg)=>{

    
    let id=msg.message.chat.id;
    let userName=msg.message.chat.first_name;

    if(obj[id]==undefined){
        obj[id]={flag:0}
    }
     
    if(obj[id].flag==1){
      obj[id].lang=msg.message.text.trim();obj[id].flag=2;

      if(!support.includes(obj[id].lang)){
          delete obj[id];
          send.sendMessage(id,"This language is not supported or wrong format of language");
      }

      else
      send.sendMessage(id,"Give the input,if no input require send an empty message");
    }

    else if(obj[id].flag==2){
      obj[id].input=msg.message.text.trim();obj[id].flag=3;
      send.sendMessage(id,"Enter the code");
    }

    else if(obj[id].flag==3){
        code=msg.message.text.trim();obj[id].flag=0;
        console.log("hello");

        axios.post("https://app-decoder.herokuapp.com/api/code/compile",{content:code,language:obj[id].lang,stdin:obj[id].input}).then((out)=>{
            
            let error=out.data.result.stderr;
            let output=out.data.result.stdout;

            send.sendMessage(id,"Error : "+error+"\noutput : "+output);
        }).catch((err)=>{
            send.sendMessage(id,"Internal compiler api is shut down")
        });

        delete obj[id];
    }

    else{
    send.sendMessage(id,"Hi "+userName+" choose your language to compile\n1)Python\n2)Java\n3)Javscript\n4)C");
    obj[id].flag=1;}
})

bot.launch();