# Bank Loan System (In Progress)

This is a simple backend system to simulate basic banking operations like loan disbursement and payments.

Currently, the **LEND** feature is implemented. The system is built using **Node.js** and **Express**, and stores data in a local `JSON` file.

---

##  Features Implemented

### 1. LEND

The bank can give loans to customers. There is no restriction on the loan amount or number of loans per customer.

- **Endpoint:** `POST /loan/lend`
- **Input:**
  ```json
  {
    "customer_id": "cust101",
    "principal": 100000,
    "years": 2,
    "rate": 10
  }
