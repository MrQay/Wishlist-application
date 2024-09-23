export class User {
    user_id?: number;
    username?: string;
    email: string;
    password: string;
    date_created?: Date;
    last_login?: Date;
    constructor(username: string, email: string, password_hash: string) {
      this.username = username;
      this.email = email;
      this.password = password_hash;
    }
  }