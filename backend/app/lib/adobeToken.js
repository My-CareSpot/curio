const request = require("request");
module.exports = {
    adobeToken
  };

function abodeRefresh() {
    async function adobeToken() {
        let form = {
            "client_id": "7bc9a9b7-a374-4074-9237-4126bd84de9f",
            "client_secret": "cee61430-07d1-4b98-9094-1f200a218fe7",
            "code": "6c3eb4d1276ee4faec47f592561f49aa"
        };
        let uri = 'https://captivateprime.adobe.com/oauth/token';
        // let refreshToken = await requestAbode(form, uri, "refresh");
        // if(refreshToken)

    }
    adobeToken().then(res => { })
}

function adobeToken1() {
    async function adobeToken() {
        try{
            let form = {
                "client_id": "7bc9a9b7-a374-4074-9237-4126bd84de9f",
                "client_secret": "cee61430-07d1-4b98-9094-1f200a218fe7",
                "refresh_token":"bad06ad1aae042fef66e0bdc84b2dfe0"
            };
            let refreshUri = 'https://captivateprime.adobe.com/oauth/token/refresh';
            requestAbode (form,refreshUri,"ACCESS","POST");
    
        }
        catch(erro){
            console.log("error in request block")
        }
        


    }
    adobeToken().then(res => { })
}

function requestAbode(form, uri, requestType, type) {

    async function requestAbode() {
        try {
            if (type == "POST") {
                request({
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    uri: uri,
                    form: form,
                    method: 'POST'
                }, function (error, response, body) {
                    if (response.statusCode == 200) {
                        if (requestType == "ACCESS") {
                            let access_token = JSON.parse(body).access_token;
                            if (access_token) {
                                request(`https://captivateprime.adobe.com/oauth/token/check?access_token=${access_token}`, function (error, resonse, body) {
                                })
                            }
                        }
                    }
                })
                return result;
            }
            if (type == "GET") {

            }
        }
        catch (error) {
        }
    }
    requestAbode().then(res => { })
}

function adobeToken(){
    let apiUri = "https://captivateprime.adobe.com/primeapi/v1/courses/1592283/modules";    
    request("https://captivateprime.adobe.com/primeapi/v1/courses/1592283/modules",{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': 'oauth 9341169f2bf68c8678377cb384e964cc'
        },   
        method: 'GET'
    },function(error,response,body){
    })
}



