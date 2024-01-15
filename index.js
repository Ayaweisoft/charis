const http = require("http");
const app = require("./app");
const path = require('path')
const moment = require("moment");
const fs = require("fs");
const {randomString} = require("./utils/numbers");
const {request, response} = require("express");
const server = http.createServer(app);


const { API_PORT } = process.env;
const port = process.env.PORT || API_PORT;


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(randomString(20))
  // console.log("Prototype: ", UsersController.prototype.me(response))
});
