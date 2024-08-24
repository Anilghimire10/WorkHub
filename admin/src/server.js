import express from "express";
const app = express();

app.get("api/products", (req, res) => {});

const port = process.env.PORT || 8800;
app.listen(port, () => {
  console.log("Server running on port ${port}");
});
