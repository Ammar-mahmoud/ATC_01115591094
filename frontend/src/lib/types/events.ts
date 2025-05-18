export interface EventsResponse {
    results : number;
    paginationResult:{
        currentPage:number;
        limit:number;
        numberOfPages:number
        totalDocuments: number;
    },
    data : Event[]
}

export interface Event {
      "name": {
                "en": string;
                "ar": string;
            },
            "description": {
                "en":string;
                "ar": string;
            },
            "venue": {
                "location": {
                    "type": "Point";
                },
                "en": string;
                "ar": string;
            },
            "tags": [],
            "_id": string,
            "category": string,
            "date": string;
            "price": number;
            "image": string;
            "ticketQuantity": number;
            "soldTickets": number;
            "deletedAt": null,
            "createdAt": string;
            "updatedAt": string;
            "imageUrl": string;
            "id": string;
}