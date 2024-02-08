const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;
const mytoken=process.env.MYTOKEN;

app.listen(process.env.PORT,()=>{
    console.log("webhook is listening", process.env.PORT);
});

// app.get("/webhook",(req,res)=>{
//     let mode=req.query["hub.mode"];
//     let challange=req.query["hub.challenge"];
//     let token=req.query["hub.verify_token"];
//     console.log("inside webhook", mode , token , challange)


//     if(mode && token){
//         console.log("inside mode and token");
//         if(mode==="subscribe" && token===mytoken){
//             console.log("inside subscribe and token");
//             res.status(200).send(challange);
//         }else{
//             res.status(403);
//         }

//     }

// });

app.get("/webhook", (req, res) => {

    console.log(mytoken , "mytoken is")
  
    // Parse the query params
      let mode = req.query["hub.mode"];
      let token = req.query["hub.verify_token"];
      let challenge = req.query["hub.challenge"];
    
      // Check if a token and mode is in the query string of the request
      if (mode && token) {
        console.log("inside mode and token")
        // Check the mode and token sent is correct
        if (mode === "subscribe" && token === mytoken) {
          // Respond with the challenge token from the request
          console.log("WEBHOOK_VERIFIED");
          res.status(200).send(challenge);
        } else {
          // Respond with '403 Forbidden' if verify tokens do not match
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
               console.log("boady param "+msg_body);

               axios({
                method: "POST",
                url: "https://graph.facebook.com/v18.0/" + phon_no_id + "/messages?access_token=" + token,
                data: {
                  messaging_product: "whatsapp",
                  to: from,
                  text: {
                    body: "Hi.. I'm Vivek Dhiman, your message is " + msg_body
                  }
                },
                headers: {
                  "Content-Type": "application/json"
                }
              })
                .then(response => {
                  console.log("Message sent successfully:", response);
                  res.sendStatus(200);
                })
                .catch(error => {
                  res.sendStatus(400); 
                });
              

            //    res.sendStatus(200);
            }else{
                res.sendStatus(404);
            }

    }

});

app.get("/",(req,res)=>{
    res.status(200).send("hello this is webhook setup");
});
