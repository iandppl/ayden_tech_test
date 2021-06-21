const paymentMethodsConfig = {
    allowedPaymentMethods:["scheme","ideal"],
    shopperReference: "",
    reference: "",
    countryCode: "NL",
    amount: {
        value: 1000,
        currency: "EUR"
    }
};

const paymentsDefaultConfig = {
    shopperReference: '1111',
    reference: 'JinWeiTeo_adyenrecruitment',
    countryCode: 'NL',
    channel: 'Web',
    origin:"https://checkout-test.adyen.com/v67/payments",
    returnUrl: 'http://localhost:3000//result/success.html',
    additionalData:{
        allow3ds2:true
    },
    amount: {
        value: 1000,
        currency: 'EUR'
    },
    lineItems: [
        {
            id: '1',
            description: 'Test Item 1',
            amountExcludingTax: 10000,
            amountIncludingTax: 11800,
            taxAmount: 1800,
            taxPercentage: 1800,
            quantity: 1,
            taxCategory: 'High'
        }
    ]
};

// Generic POST Helper
const httpPost = (endpoint, data) =>
    fetch(`/${endpoint}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(response => response.json());

// Get all available payment methods from the local server
const getPaymentMethods = () =>
    httpPost('paymentMethods', paymentMethodsConfig)
        .then(response => {
            if (response.error) throw 'No paymentMethods available';

            return response;
        })
        .catch(console.error);

// Posts a new payment into the local server
const makePayment = (paymentMethod,component) => {
    const paymentsConfig = { ...paymentsDefaultConfig };
    const paymentRequest = { ...paymentsConfig, ...paymentMethod };

    console.log(paymentRequest);

    return httpPost('payments', paymentRequest)
        .then(res => {
            if(res.action){
                component.handleAction(res.action);
            }else{
                if (res.resultCode == "Authorised") {
                    console.log("inside success");
                    document.location.href='../result/success.html';
                }else if (res.resultCode == "Refused"){
                    console.log("rejected card");
                    document.location.href="../result/error.html";
                }
            }
        })
        .catch(console.error);
};

const redirectingURL = async(res) => {
    console.log("inside redirecting url")
    return httpPost('details',res)
    .then(res =>{
        if (res.resultCode == "Authorised") {
            console.log("inside success");
            document.location.href='../result/success.html';
        }else if (res.resultCode == "Refused"){
            console.log("rejected card");
            document.location.href="../result/error.html";
        }
    })
}

// Fetches an originKey from the local server
const getOriginKey = () =>
    httpPost('originKeys')
        .then(response => {
            if (response.error || !response.originKeys) throw 'No originKey available';

            return response.originKeys[Object.keys(response.originKeys)[0]];
        })
        .catch(console.error);

// Fetches a clientKey from the 
const getClientKey = () =>
    httpPost('clientKeys')
        .then(response => {
            if (response.error || !response.clientKey) throw 'No clientKey available';

            return response.clientKey;
        })
        .catch(console.error);
