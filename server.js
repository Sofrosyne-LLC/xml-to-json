// Import dependencies
const path = require("path");
const express = require("express");
require("dotenv").config();
const cors = require("cors");

// ENV Variables
const port = process.env.PORT;

// Don't ask
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

// Set Routes
require("./routes/index.routes")(app);

app.listen(port, () => {
    console.log(`<<<Server running on ${port}>>>`);
});