
import { app } from './start';
import dotenv from 'dotenv';


const PORT = 8080;

dotenv.config();

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});