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



let support=["java","js","py","c","cpp","go","cs"]

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

        axios.post("https://codex-api.herokuapp.com/",{code:code,language:obj[id].lang,input:obj[id].input}).then((out)=>{
            send.sendMessage(id,"output:\n"+((out.data.output==undefined)?out.data.error:out.data.output));
        }).catch((err)=>{
            console.log(err);
        });

        delete obj[id];
    }

    else{
    send.sendMessage(id,"Hi "+userName+" choose your language to compile\n1)java\n2)c\n3)cpp\n4)py\n5)js\n6)go(goLang)\n7)cs(C#)");
    obj[id].flag=1;}
})

bot.launch();