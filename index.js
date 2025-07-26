const express = require('express');
const app = express();
const port = 3000;

const loanService = require('./services/loanService');

app.use(express.json());

// API Routes (we’ll define them step-by-step)
app.post('/lend', loanService.lendLoan);
app.post('/payment', loanService.makePayment);

app.listen(port, () => {
  console.log(`Bank System backend running at http://localhost:${port}`);
});
