const express=require("express");
const body_parser=require("body-parser");
const axios=require("axios");
require('dotenv').config();

const app=express().use(body_parser.json());

const token=process.env.TOKEN;

const template_customn  = {
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "916283415102",
  "type": "template",
  "template": {
      "name": "vivek_2",
      "language": {
          "code": "en"
      }
  },
  "components": [
      {
          "type": "header",
          "parameters": [
             { "type": "image", 
                  "link": "https://images.unsplash.com/photo-1545093149-618ce3bcf49d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=668&q=80"
             }

          ]
      },
      {
          "type": "body",
          "parameters": [
              {
                  "type": "text",
                  "text": "Ready To Chat"
              }
          ]
      },
      {
          "type": "button",
          "sub_type": "quick_reply",
          "index": "0",
          "parameters": [
              {
                  "type": "payload",
                  "payload": "PAYLOAD"
              }
          ]
      },
      {
          "type": "button",
          "sub_type": "quick_reply",
          "index": "1",
          "parameters": [
              {
                  "type": "payload",
                  "payload": "PAYLOAD"
              }
          ]
      }
  ]
}

const template_customn_2  = {
  "messaging_product": "whatsapp",
  "to": "916283415102",
  "type": "template",
  "template": {
      "name": "final_sample",
      "language": {
          "code": "en"
      }
  },
  // "components": [
  //   {
  //     "type": "header",
  //     "parameters": [
  //       {
  //         "type": "text",
  //         "text": "TEXT_STRING"
  //       }
  //     ]
  //   },
  //   {
  //     "type": "body",
  //     "parameters": [
  //       {
  //         "type": "text",
  //         "text": "shop now through TEXT_STRING and use code TEXT_STRING to get TEXT_STRING off of all merchandise."
  //       }
  //     ]
  //   }
  // ],
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

const sendTemplate = {
    "to": "916283415102",
    "recipient_type": "individual",
    "type": "template",
    "template": {
        "language": {
            "policy": "deterministic",
            "code": "en"
        },
        "name": "asdasdas",
        "components": [
            {
                "type":"BODY",
                "text":"Hello {{1}}\n\nThis is a test body {{2}}  ",
                "example":{
                    "body_text":[
                        [
                            "bodyVariable1",
                            "bodyVariable2"
                        ]
                    ]
                }
            }
        ]
    }
}

const image = 
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
"to": "916283415102",
"type": "image",
"image": {
  "link": "https://i.imgur.com/OevvBMO.jpeg"
}
}

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

  async function createTemplate() {
    try {
        const templateData = {
          "name": "seasonal_promotioenq",
          "language": "en",
          "category": "MARKETING",
          "components": [
            {
              "type": "HEADER",
              "format": "TEXT",
              "text": "Our {{1}} is on!",
              "example": {
                "header_text": [
                  "Summer Sale"
                ]
              }
            },
            {
              "type": "BODY",
              "text": "Shop now through {{1}} and use code {{2}} to get {{3}} off of all merchandise.",
              "example": {
                "body_text": [
                  [
                    "the end of August","25OFF","25%"
                  ]
                ]
              }
            },
            {
              "type": "FOOTER",
              "text": "Use the buttons below to manage your marketing subscriptions"
            },
            {
              "type":"BUTTONS",
              "buttons": [
                {
                  "type": "QUICK_REPLY",
                  "text": "Unsubcribe from Promos"
                },
                {
                  "type":"QUICK_REPLY",
                  "text": "Unsubscribe from All"
                }
              ]
            }
          ]
        };

        // Make Axios POST request
        const response = await axios.post('https://graph.facebook.com/v18.0/180046158536495/message_templates', 
            templateData
        , {
            params: {
                access_token: token
            }
        });

        console.log("Template created successfully:", response.data);
    } catch (error) {
        console.error("Error creating template:", error.response.data);
    }
}

// Call the function to create the template
// createTemplate();

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

             const whatsapp_message = {
              messaging_product: "whatsapp",
              to: from,
              text: {
                body: "your message is " + msg_body
              }
            }

             console.log("phone number "+phon_no_id);
             console.log("from "+from);
             console.log("boady param "+msg_body);

             axios({
              method: "POST",
              url: "https://graph.facebook.com/v18.0/" + phon_no_id + "/messages?access_token=" + token,
              data: msg_body === "hi" ? sendTemplate : whatsapp_message,
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
