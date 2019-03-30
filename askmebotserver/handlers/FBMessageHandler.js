const FACEBOOK_ACCESS_TOKEN = 'EAAhDdGtojlYBABWASAplWxZCZBIWe6ZBx7FpqrFOZAjKkymHyHaJKxc2aWfFcBwZCCbGFa032RtH1wMHYuBHgjGVRHwBQMIo0ngxRsaKjRpEV6Sn9OdUi8T7m8AtKnl7AxqgdzPTEswwiX5ZCbXQdUsxQGj72y7KoD67D47FqOOvzCRZCNeMLQ0'
const RestClient = require('node-rest-client').Client
const request = require('request')

const sendTextMessage = (senderID, text) => {
  console.log(text)
    request({
        url: 'https://graph.facebook.com/v3.2/me/messages',
        qs: { access_token: FACEBOOK_ACCESS_TOKEN},
        method: 'POST',
        json: {
            recipient: { id: senderID},
            message: text
        }
    }, function (err, response, body) {
      console.log("error sendTextMessage", err);
        console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
        console.log('body:', body); // Print the HTML for the Google homepage.
    })
}
const msgTemplate = ({customer_name}) => {
  return (
    `
    {
      "attachment":{
      "type":"template",
      "payload":{
        "template_type":"button",
        "text":"Bạn có muốn đặt mua ngay không ? ",
        "buttons":[
          {
            "type":"web_url",
            "url":"https://www.messenger.com",
            "title":"Đặt mua "
          }
        ]
      }
    }
  }
`
  )
}
const msgTemplate1 = ({customer_name, product_name, product_code, quantity, price, picture}) => {
  return (
    `
    {
    "attachment":{
      "type":"template",
      "payload":{
        "template_type":"receipt",
        "recipient_name":"Stephane Crozatier",
        "order_number":"12345678902",
        "currency":"VND",
        "payment_method":"Visa 2345",
        "order_url":"http://petersapparel.parseapp.com/order?order_id=123456",
        "timestamp":"1428444852",
        "address":{
          "street_1":"ĐH Quốc Gia",
          "street_2":"",
          "city":"Hanoi",
          "postal_code":"10000",
          "state":"CA",
          "country":"US"
        },
        "summary":{
          "subtotal":75.00,
          "shipping_cost":4.95,
          "total_tax":6.19,
          "total_cost":560000
        },
        "adjustments":[
          {
            "name":"New Customer Discount",
            "amount":20
          },
          {
            "name":"$10 Off Coupon",
            "amount":10
          }
        ],
        "elements":[
          {
            "title":"Quần bò",
            "subtitle":"100% Soft and Luxurious Cotton",
            "quantity":2,
            "price":50000,
            "currency":"VND",
            "image_url":"http://a9.vietbao.vn/images/vn899/150/2019/03/20190325-hoc-lom-chi-pu-minh-hang-cach-mix-do-voi-ao-so-mi-trang-1.jpg"
          }
        ]
      }
    }
  }
    `
  )
}
module.exports = (event) => {
    const senderID = event.sender.id
    const fbUserMessage = event.message.text

    var senderName = ''
    getSenderInformation((senderInfo) => {
        senderName = senderInfo
    })

    getWitAPIData((witData) => {
        if (witData.entities.greet)
        {
          sendTextMessage(senderID, { "text" : "Chào " + senderName + ", tôi có thể giúp gì được cho bạn?"})


          }

          if ( witData.entities.askQuantity)
          {
            sendTextMessage(senderID, { "text" : "Chào " + senderName + ", quần bò shop còn 23 chiếc "})
            const message = msgTemplate({customer_name:senderName});
       //       console.log("message temp", message);
             sendTextMessage(senderID, message);
           }

       if ( witData.entities.JEAN27)
       {
         sendTextMessage(senderID, { "text" : "Chào " + senderName + ", giá quần bò là 270k "})
         const message = msgTemplate({customer_name:senderName});
    //       console.log("message temp", message);
          sendTextMessage(senderID, message);
        }


          if (witData.entities.order){
            sendTextMessage(senderID, { "text" : "Chào " + senderName + ", xác nhận đặt quần jeans giá 270 "})
            const message1 = msgTemplate1({customer_name:senderName});
            sendTextMessage(senderID, message1);

          }



}
  )
    // Ham goi den Wit.ai API
    function getWitAPIData(callback) {
        var client = new RestClient()
        var arguments = {
            data: { userMessage: fbUserMessage },
            headers: { "Content-Type": "application/json" }
        };
        client.post("http://localhost:4000/v1/getEntitiesInfo", arguments, function(data, response) {
            if (data.isSuccess == true) {
                callback(data.data)
            } else {
                callback(null)
            }
        })
    }

    function getSenderInformation(callback) {
        request({
            url: "https://graph.facebook.com/v3.2/" + event.sender.id,
            qs: {
                access_token: FACEBOOK_ACCESS_TOKEN,
                fields: 'first_name'
            },
            method: 'GET'
        }, function(error, response, body) {
            if (!error) {
                var bodyObject = JSON.parse(body)
                callback(bodyObject.first_name)
            }
        })
    }
}
