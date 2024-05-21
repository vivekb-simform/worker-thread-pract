const { workerData, parentPort } = require("node:worker_threads");
const { n } = workerData;

const sum = async (n) => {
  return new Promise((resolve, reject) => {
    let sum = 0;
    for (let i = 0; i < n; i++) {
      sum += 1;
    }
    resolve(sum);
  });
};

(async () => {
  const result = await sum(n);
  if (parentPort) {
    parentPort.postMessage({ result, status: "Done" });
  }
})();
