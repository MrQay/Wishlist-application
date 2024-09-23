export class Wishlist {
    wishlist_id: number;
    user_id: number;
    title: string;
    description: string;
    date_created: Date;
    is_public: boolean;

    
    constructor(wishlist_id: number, user_id: number, title: string, description: string, date_created: Date, is_public: boolean) {
      this.wishlist_id = wishlist_id;
      this.user_id = user_id;
      this.title = title;
      this.description = description;
      this.date_created = date_created;
      this.is_public = is_public;
      
    }
  }
  