export class Product {
    product_id: number;
    wishlist_id: number;
    title: string;
    description: string;
    url: string;
    imageUrl: string;
    price: number;
    amount: number;
    ranking: string; // e.g., 1 star, 2 stars, etc
    date_added: Date;
  
    constructor(product_id: number, wishlist_id: number, title: string, description: string, url: string, imageUrl: string, price: number, amount: number, ranking: string, date_added: Date) {
      this.product_id = product_id;
      this.wishlist_id = wishlist_id;
      this.title = title;
      this.description = description;
      this.url = url;
      this.imageUrl = imageUrl;
      this.price = price;
      this.amount = amount;
      this.ranking = ranking;
      this.date_added = date_added;
    }
  }