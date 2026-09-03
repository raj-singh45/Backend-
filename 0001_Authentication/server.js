import app from "./src/app/app.js";
import { connectDb } from "./src/config/db.js";

await connectDb();
app.listen(5000, () => {
  console.log("server is running");
});
