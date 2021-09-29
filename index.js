const express = require("express");
const cors = require("cors");
const app =  express();

const auth = require("./routes/auth");
const userActions = require("./routes/user.actions");

app.use(cors());
app.use(express.json());
app.use("/", auth );
app.use("/",  userActions);


const port = 5000

app.listen(port, () => console.log(`server started on port: ${port}`))