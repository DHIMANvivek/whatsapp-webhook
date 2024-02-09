const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;

app.listen(process.env.PORT,()=>{
    console.log("webhook is listening", process.env.PORT);
});

app.get("/webhook", (req, res) => {
    const verify_token = process.env.MYTOKEN;
    console.log("inside get webhook")
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    if (mode && token) {
      if (mode === "subscribe" && token === verify_token) {
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        res.sendStatus(403);
      }
    }
  });

app.post("/webhook",(req,res)=>{

    let body_param=req.body;

    console.log(JSON.stringify(body_param,null,2));

    if(body_param.object){
        console.log("inside body param");
        if(body_param.entry && 
            body_param.entry[0].changes && 
            body_param.entry[0].changes[0].value.messages && 
            body_param.entry[0].changes[0].value.messages[0]  
            ){
               let phon_no_id=body_param.entry[0].changes[0].value.metadata.phone_number_id;
               let from = body_param.entry[0].changes[0].value.messages[0].from; 
               let msg_body = body_param.entry[0].changes[0].value.messages[0].text.body;

               console.log("phone number "+phon_no_id);
               console.log("from "+from);
               console.log("boady param "+msg_body , typeof msg_body);

               const whatsapp_message = {
                messaging_product: "whatsapp",
                to: from,
                text: {
                  body: "your message is " + msg_body
                }
              }

              const whatsapp_template = {
                "messaging_product": "whatsapp",
                "to": "916283415102",
                "type": "template",
                "template": {
                    "name": "vivek_test",
                    "language": {
                        "code": "en"
                    }
                }
            }

            const image = 
                {
                    "type": "image",
                    "image": {
                      "link": "https://media.licdn.com/dms/image/C4D0BAQGtjiLe3UaDoA/company-logo_200_200/0/1631307523364?e=2147483647&v=beta&t=hVmrTz7CmJTXYQjtRJuTxkHtCcbK_IiO2fSqAFwR1ks",
                      "provider": {
                        "name" : "media.licdn.com"
                      },
                    }
                  }
            

              const data = {}

               axios({
                method: "POST",
                url: "https://graph.facebook.com/v18.0/" + phon_no_id + "/messages?access_token=" + token,
                data: msg_body === "hi" ? whatsapp_template : image
                ,
                headers: {
                  "Content-Type": "application/json"
                }
              })
                .then(response => {
                  console.log("Message sent successfully:", response.data);
                  res.sendStatus(200);
                })
                .catch(error => {
                  res.sendStatus(400); 
                });
            }else{
                res.sendStatus(404);
            }
    }
});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});
