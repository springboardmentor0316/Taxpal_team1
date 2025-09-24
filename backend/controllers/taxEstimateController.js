import TaxEstimate from '../models/TaxEstimate.js';

const calculateTax = (grossIncome, deductions, filingStatus) => {
  // Convert all inputs to numbers and handle invalid inputs
  const income = Number(grossIncome) || 0;
  const deductionsTotal = Object.values(deductions).reduce((sum, val) => sum + (Number(val) || 0), 0);
  
  // Calculate taxable income
  const taxableIncome = Math.max(0, income - deductionsTotal);
  
  // Tax brackets for 2025 (example rates)
  const brackets = {
    single: [
      { upTo: 40000, rate: 0.10 },
      { upTo: 85000, rate: 0.12 },
      { upTo: 165000, rate: 0.22 },
      { upTo: 207000, rate: 0.24 },
      { upTo: 518000, rate: 0.32 },
      { upTo: 600000, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 }
    ],
    married: [
      { upTo: 80000, rate: 0.10 },
      { upTo: 170000, rate: 0.12 },
      { upTo: 330000, rate: 0.22 },
      { upTo: 414000, rate: 0.24 },
      { upTo: 622000, rate: 0.32 },
      { upTo: 700000, rate: 0.35 },
      { upTo: Infinity, rate: 0.37 }
    ]
  };

  // Select bracket based on filing status
  const bracketToUse = brackets[filingStatus.toLowerCase() === 'single' ? 'single' : 'married'];
  
  // Calculate tax progressively
  let remainingIncome = taxableIncome;
  let totalTax = 0;
  let previousBracketEnd = 0;

  for (const bracket of bracketToUse) {
    const taxableInBracket = Math.min(
      Math.max(0, remainingIncome),
      bracket.upTo - previousBracketEnd
    );
    
    totalTax += taxableInBracket * bracket.rate;
    remainingIncome -= taxableInBracket;
    previousBracketEnd = bracket.upTo;

    if (remainingIncome <= 0) break;
  }

  // Calculate quarterly tax (since this is for quarterly estimates)
  const quarterlyTax = totalTax / 4;

  return {
    taxableIncome,
    annualTax: totalTax,
    estimatedTax: quarterlyTax,
    effectiveRate: totalTax / (taxableIncome || 1),
    deductions: deductionsTotal
  };
};

const getDueDate = (quarter) => {
  const year = new Date().getFullYear();
  const dueDates = {
    'Q1': `${year}-04-15`,
    'Q2': `${year}-06-15`,
    'Q3': `${year}-09-15`,
    'Q4': `${year}-01-15`
  };
  return new Date(dueDates[quarter]);
};

export const createTaxEstimate = async (req, res) => {
  try {
    console.log('Received tax estimate request:', req.body);

    // Validate required fields
    const requiredFields = ['userId', 'quarter', 'country', 'state', 'filingStatus', 'grossIncome'];
    const missingFields = requiredFields.filter(field => !req.body[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missingFields.join(', ')}`,
        error: 'Validation Error'
      });
    }

    const {
      userId,
      quarter,
      country,
      state,
      filingStatus,
      grossIncome,
      deductions = {} // Default to empty object if not provided
    } = req.body;

    const taxCalculation = calculateTax(grossIncome, deductions, filingStatus);
    const dueDate = getDueDate(quarter);
    
    const reminderDate = new Date(dueDate);
    reminderDate.setDate(reminderDate.getDate() - 14);

    const taxEstimate = new TaxEstimate({
      userId,
      quarter,
      country,
      state,
      filingStatus,
      grossIncome,
      deductions,
      taxableIncome: taxCalculation.taxableIncome,
      estimatedTax: taxCalculation.estimatedTax,
      annualTax: taxCalculation.annualTax,
      effectiveRate: taxCalculation.effectiveRate,
      totalDeductions: taxCalculation.deductions,
      dueDate,
      reminderDate
    });

    await taxEstimate.save();
    res.status(201).json({ 
      message: 'Tax estimate created successfully',
      data: taxEstimate 
    });

  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating tax estimate',
      error: error.message 
    });
  }
};

export const getTaxEstimates = async (req, res) => {
  try {
    const { userId } = req.params;
    const estimates = await TaxEstimate.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(estimates);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching tax estimates',
      error: error.message 
    });
  }
};