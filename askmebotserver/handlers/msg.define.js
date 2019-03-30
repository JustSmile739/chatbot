module.exports = {
    greet: ({senderName}) => {
        return `Chào ${senderName}, tôi có thể giúp gì được cho bạn?`;
    },
    askQuantity: ({senderName}) => {
        return `Chào ${senderName}, tôi có thể giúp gì được cho bạn?`;
    },
    product: ({senderName, productName, price}) => {
        return `Chào ${senderName}, giá sản phẩm ${productName} là ${price} `;
    },
};