require("dotenv").config();
require("./config/database").connect();
const express = require("express");
var cron = require('node-cron');
const auth = require("./middleware/auth");
const mongoose = require("mongoose");
var cors = require('cors')
var bodyParser = require('body-parser')

// import controllers
const UserController = require("./controller/UserController")();
const AdminController = require("./controller/AdminController")();
const BankAccountController = require("./controller/BankAccountController")();
const LoanController = require("./controller/LoanController")();
const FDRController = require("./controller/FDRController")();
const BeneficiaryController = require("./controller/BeneficiaryController")();
const WireTransferController = require("./controller/WireTransferController")();
const InterbankTransferController = require("./controller/InterbankTransferController")();

// import routes
const userRoute = require("./routes/userRoute")
const paystackRoute = require("./routes/paystackRoute")
const ministryRoute = require("./routes/ministryRoute")
const profileRoute = require("./routes/profileRoute")
const learningRoute = require("./routes/learningRoute")
const adminRoute = require("./routes/adminRoute")
const bankAccountRoute = require("./routes/bankAccountRoute")
const loanRoute = require("./routes/loanRoute")
const FDRRoute = require("./routes/FDRRoute")
const BeneficiaryRoute = require("./routes/beneficiaryRoute")
const WireTransferRoute = require("./routes/wireTransferRoute")
const InterbankTransferRoute = require("./routes/interbankTransferRoute")

const app = express();

// use cors so the front end can post data to this backend
app.use(cors());

// bodyParser settings for proper data decodin form frontend
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(bodyParser.raw())

// limit size of data that can bebsent from the front end
app.use(express.json({ limit: "50mb" }));

// use the imported routes
app.use("/api", userRoute)
app.use("/api", learningRoute)
app.use("/api", paystackRoute)
app.use("/api", adminRoute)
app.use("/api", profileRoute)
app.use("/api", ministryRoute)
// app.use("/api", adminRoute)
// app.use("/api", bankAccountRoute)
// app.use("/api", loanRoute)
// app.use("/api", FDRRoute)
// app.use("/api", BeneficiaryRoute)
// app.use("/api", WireTransferRoute)
// app.use("/api", InterbankTransferRoute)


app.get("/welcome", auth, (req, res) => {
  res.status(200).send(req.user);
});

// set a default message in case an invalid route is entered.
// This should be the last route else any after it won't work
app.use("*", (req, res) => {
  res.status(404).json({
    success: "false",
    message: "Page not found",
    error: {
      statusCode: 404,
      message: "You reached a route that is not defined on this server",
    },
  });
});

// cron.schedule('0 0 */2 * * *', () => {
//   console.log('running a task every two hours');
// });


module.exports = app;
