const fs = require('fs');

const { id, total, payments} = require('./transaction.json');

const templateStyle = `
<head>
	<meta content="width=device-width, initial-scale=1, maximum-scale=1" name="viewport" />
    <style>
        html {
            font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
                Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
                "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol",
                "Noto Color Emoji";
            line-height: 1rem;
                    font-weight: 300;
        }
		body, h3, p {
            margin: 0;
            box-sizing: border-box;
        }
		.d-flex{
			display: flex;
		}
		.col {
			flex-basis: 0;
			flex-grow: 1;
			max-width: 100%;
		}
		.justify-content-between{
			justify-content: space-between;
		}
        .grey-800{
			color: #2d3748;
		}
		.grey-900{
			color: #1a202c;
		}    
		.border{
			border: 2px solid #e2e8f0;
            border-radius: 0.375rem;
            overflow: hidden;
		}
		.border-bottom {
			border-bottom: 2px solid #e2e8f0;
		}
        .font-weight-semibold {
        font-weight: 600;
        }
		.font-xs{
			font-size: 0.75rem;
		}
		.font-sm{
			font-size: 1rem;
		}
		.font-md{
			font-size: 1.125rem;
		}
		.font-lg{
			font-size: 1.25rem;
		}
		.font-xl{
			font-size: 1.5rem;
		}
		.line-height-sm{
			line-height: 1.25rem;
		}
		.line-height-md{
			line-height: 1.5rem;
		}
		.line-height-lg{
			line-height: 1.75rem;
		}
		.line-height-xl{
			line-height: 2rem;
		}
		.my-5{
			margin-top: 2.5rem;
			margin-bottom: 2.5rem;
		}
		.ml-1{
			margin-left: 0.25rem;
		}
		.mr-3{
			margin-right: 1rem;
		}
		.mb-1{
			margin-bottom: 0.25rem;
		}
		.mb-3{
			margin-bottom: 1rem;
		}
		.mt-2{
			margin-top: 0.5rem;
		}
		.py-3{
			padding-top: 1rem;
            padding-bottom: 1rem;
		}
		.px-2{
			padding-left: 0.5rem;
            padding-right: 0.5rem;
		}
		.px-0{
			padding-left: 0;
			padding-right: 0;
		}
		.pb-3{
			padding-bottom: 1rem;
		}
		.pt-3{
			padding-top: 1rem;
		}
		.thumbnail{
			width: 80px;
			height: 80px;
		}
		@media screen and (max-width: 600px){
			html{
				font-size: 75% !important;
			}
		} 
    </style>
</head>
`;

const templateHeader = `
    <div class="my-5">
        <h3 class="font-weight-semibold font-xl line-height-xl grey-800">Thank you, your order has been placed.</h3>
        <p class="font-md line-height-md">Please check your email for order confirmation and detailed delivery information.</p>
    </div>
`;

const templateSummary = `
    <div class="font-md mb-3 grey-900">
        <p class="line-height-md ml-1 mb-1">Transaction Summary</p>
        <div class="border line-height-md py-3 px-2">
            <p>Date: <span class="font-weight-semibold">${payments[0]?.date}</span></p>
            <p class="mt-2">Stripe Transaction ID:
                <span class="font-weight-semibold">${id}</span>
            </p>
            <p class="font-weight-semibold font-lg line-height-lg mt-2">Transaction Amount: $${total.toFixed(2)}</p>
        </div>
    </div>
`;

const templateOrderDetails = (payments || []).map((seller) => {
    return `
        <div class="mb-3 grey-900">
            <p class="line-height-md ml-1 mb-1">Order Details</p>
            <div class=" border py-3 px-0 ">
                <div class="line-height-md  border-bottom pb-3 px-2 font-md">
                    <p>Sold By: ${seller.items[0].business}</p>
                    <p class="font-xs font-weight-semibold">Sent from ${seller.items[0].country}</p>
                    <p>Status: <span class="font-weight-semibold">${seller.status}</span></p>
                </div>
                ${
                    seller.items.map((item, i) => {
                        return `
                            <div class="border-bottom py-3 d-flex">
                                <div class="col d-flex">
                                    <img class="thumbnail mr-3" src="${item.images[0]}"/>
                                    <div class="font-wieght-md font-sm">
                                        <p>${item.title}${
                                            item.selectedProduct && item.selectedProduct.variants ? 
                                            Object.entries(item.selectedProduct.variants).map(
                                                (variant) => `${variant[0]} : ${variant[1]}`
                                            ) : ""
                                        }</p>
                                        <p class="mt-2">Quantity: ${item.desiredQty}</p>
                                        <p class="mt-2">Total: $${(item.desiredQty * (item.selectedProduct ? (item.selectedProduct.price || item.price) : item.price)).toFixed(2)}</p>
                                        <p class="font-xs">($${(item.selectedProduct ? (item.selectedProduct.price || item.price) : item.price).toFixed(2)} each)</p>
                                    </div>
                                </div>
                                <div class="col font-sm">
                                    <p>Shipping to</p>
                                    <p class="font-weight-semibold">${item.shippingAddress.city}</p>
                                    <p class="mt-2">Estimated Delivery:</p>
                                    <p class="font-weight-semibold">Estimated date goes here</p>
                                </div>
                            </div>
                        `
                    }).join('')
                }
                <div class="pt-3 px-2 d-flex justify-content-between">
                    <p>SubTotal</p>
                    <p>$38.0</p>
                </div>
            </div>
        </div>
    `
}).join('');

const template = `${templateStyle}<body>${templateHeader} ${templateSummary} ${templateOrderDetails}</body>`;

fs.writeFileSync('./index.html', template);