let db = {
    users: [
        {
            userName: "userName",
            storedLists: [
                "listId1",
                "listId2",
                "listId3"
            ]
        }
    ],
    lists: [
        {
            owner: "userId",
            listName: "list name",
            createdAt: "1 January 2020 at",
            items: [
                {
                    productId: "productId",
                    quantity: "2"
                }
            ]
        }
    ],
    products: [
        {
            productName: "product name",
            type: "single/collection",
            location: {
                "shop1id": "3",
                "shop2id": "5"
            },
            composedOf: [
                {
                    productId: "productId",
                    quantity: "2"
                }
            ]
        }
    ]
}