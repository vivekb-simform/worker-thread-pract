const { Worker } = require("node:worker_threads");
const express = require("express"); //Import the express dependency
const app = express(); //Instantiate an express app, the main work horse of this server
const port = 5000; //Save the port number where your server will be listening

//Idiomatic expression in express to route and respond to a client request
app.get("/", (req, res) => {
  res.send("hello world");
});

const runService = ({ count }) => {
  return new Promise((resolve, reject) => {
    const worker = new Worker("./worker.js", {
      workerData: { n: count },
    });

    worker.on("message", resolve);
    worker.on("error", reject);
    worker.on("exit", (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
};

app.get("/worker", async (req, res) => {
  const count = req.query?.count || 200;
  const result = await runService({ count: +count });
  res.status(200).json({ message: result });
});
app.listen(port, () => {
  //server starts listening for any attempts from a client to connect at port: {port}
  console.log(`Now listening on port ${port}`);
});
