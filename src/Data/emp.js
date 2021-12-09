const Cusb = require("../../models/customer.js");

// console.log(emps.find((emp) => emp.name === "James"));

function findByEmpname(empName) {
  return Cusb.find((emp) => emp.name === empName);
}
function createEmp(emp) {
  const created = { ...emp, id: Date.now().toString() };
  emps.push(created);
  return emps;
}

console.log(findByEmpname("Mina"));

module.exports = { findByEmpname, createEmp };
