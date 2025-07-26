const { v4: uuidv4 } = require('uuid');
const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, '..', 'data', 'loans.json');


if (!fs.existsSync(path.dirname(dataFilePath))) {
    fs.mkdirSync(path.dirname(dataFilePath));
}
if (!fs.existsSync(dataFilePath)) {
    fs.writeFileSync(dataFilePath, JSON.stringify([]));
}

const lendLoan = (req, res) => {
    const { customer_id, loan_amount, loan_period, rate_of_interest } = req.body;

    
    if (!customer_id || !loan_amount || !loan_period || !rate_of_interest) {
        return res.status(400).json({ error: 'Missing loan input fields' });
    }

    // Calculate interest, total amount, EMI
    const interest = (loan_amount * loan_period * rate_of_interest) / 100;
    const totalAmount = loan_amount + interest;
    const emi = parseFloat((totalAmount / (loan_period * 12)).toFixed(2));

    // Create loan object
    const loan = {
    id: uuidv4(),
    customer_id,
    loan_amount,
    loan_period,
    rate_of_interest,
    total_amount: totalAmount,
    monthly_emi: emi,
    amount_paid: 0,
    emis_paid: 0,
    transactions: []
};


    // Read existing data and append the new loan
    const data = JSON.parse(fs.readFileSync(dataFilePath));
    data.push(loan);
    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));

    // Return success response
    res.json({
        message: 'Loan issued successfully',
        loan_id: loan.id,
        total_amount: totalAmount,
        monthly_emi: emi
    });
};
const makePayment = (req, res) => {
  console.log("✅ Payment endpoint hit");
  const { loan_id, payment_type, amount } = req.body;

  // Read loans from file
  const loans = JSON.parse(fs.readFileSync(dataFilePath));

  // Find the loan by ID
  const loan = loans.find(loan => loan.id === loan_id);
  if (!loan) {
    return res.status(404).json({ message: 'Loan not found' });
  }

  // Initialize amount_paid and emis_paid if not set
  loan.amount_paid = loan.amount_paid || 0;
  loan.emis_paid = loan.emis_paid || 0;

  if (payment_type === 'emi') {
    loan.amount_paid += loan.monthly_emi;
    loan.emis_paid += 1;
  } else if (payment_type === 'lump_sum') {
    if (!amount) return res.status(400).json({ message: 'Amount is required for lump_sum payment' });
    loan.amount_paid += amount;
  } else {
    return res.status(400).json({ message: 'Invalid payment type' });
  }

  // Update transactions list
  loan.transactions.push({
    type: payment_type,
    amount: payment_type === 'emi' ? loan.monthly_emi : amount,
    date: new Date().toISOString()
  });

  // Calculate remaining
  const remaining = loan.total_amount - loan.amount_paid;
  const emis_left = Math.ceil(remaining / loan.monthly_emi);

  // Write updated data back to file
  fs.writeFileSync(dataFilePath, JSON.stringify(loans, null, 2));

  res.json({
    message: 'Payment successful',
    remaining_amount: Math.max(remaining, 0),
    emis_left: Math.max(emis_left, 0),
  });
};


module.exports = {
  lendLoan,
  makePayment,
};


