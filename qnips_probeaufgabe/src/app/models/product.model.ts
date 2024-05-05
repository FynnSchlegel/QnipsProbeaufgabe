export interface IProduct {
    AllergenIds: string[];
    ProductId: number;
    Name: string;
    Price: {
        Betrag: number;
    };
}