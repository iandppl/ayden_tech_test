// 0. Get clientKey
getClientKey().then(clientKey => {
    getPaymentMethods().then(paymentMethodsResponse => {
        const checkout = new AdyenCheckout({
            environment: 'test',
            clientKey: clientKey,
            locale:"en-US",
            paymentMethodsResponse,
            removePaymentMethods: ["paywithgoogle"],
            // onChange: state => {
            //     updateStateContainer(state);
            // },
            onSubmit: (state, component) => {
                if(state.isValid){
                    makePayment(state.data,component);
                }
            },
            onAdditionalDetails:(state, dropin)=>{
                redirectingURL(state.data);
            },
            paymentMethodsConfiguration: {
                card: { // Example optional configuration for Cards
                    hasHolderName: true,
                    holderNameRequired: true,
                    enableStoreDetails: true,
                    hideCVC: false, // Change this to true to hide the CVC field for stored cards
                    name: 'Credit or debit card',
                    billingAddressRequired: true
                }
            }
        });

        // 2. Create and mount the Component
        const dropin = checkout
            .create('dropin', {
                // Events
                // onSelect: activeComponent => {
                //     if (activeComponent.state && activeComponent.state.data) {
                //         updateStateContainer(activeComponent.data);
                //     }
                // }
            })
            .mount('#dropin-container');
    });
});
