// EMI calculation
export function calculateEMI(amount, interest, emiCount) {
  const numAmount = parseFloat(amount) || 0;
  const numInterest = parseFloat(interest) || 0;
  const numEmiCount = parseInt(emiCount) || 0;

  if (numAmount <= 0 || numEmiCount <= 0) {
    return { finalAmount: '0.00', emi: '0.00' };
  }

  const final = numAmount + (numAmount * numInterest) / 100;
  const emi = final / numEmiCount;

  return {
    finalAmount: final.toFixed(2),
    emi: emi.toFixed(2)
  };
}

// Field validation
export function validateField(name, value) {
  const errors = {};
  switch (name) {
    case 'ls_ReqAmnt': {
      const amount = parseFloat(value);
      if (!value) errors[name] = 'Amount is required';
      else if (isNaN(amount) || amount <= 0) errors[name] = 'Must be positive number';
      else if (amount > 10000000) errors[name] = 'Cannot exceed ₹1 crore';
      break;
    }
    case 'ls_NoOfEmi': {
      const emi = parseInt(value);
      if (!value) errors[name] = 'EMIs is required';
      else if (isNaN(emi) || emi <= 0) errors[name] = 'Must be positive number';
      else if (emi > 360) errors[name] = 'Cannot exceed 360 months';
      break;
    }
    case 'ls_Reason': {
      if (!value || value.trim().length < 10) errors[name] = 'Minimum 10 characters';
      else if (value.length > 500) errors[name] = 'Maximum 500 characters';
      break;
    }
    case 'ls_LoanTyp': {
      if (!value) errors[name] = 'Please select a loan type';
      break;
    }
    default: break;
  }
  return errors;
} 