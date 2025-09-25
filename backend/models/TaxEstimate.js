import mongoose from 'mongoose';

const taxEstimateSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    
    index: true
  },
  quarter: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  filingStatus: {
    type: String,
    required: true
  },
  grossIncome: {
    type: Number,
    required: true
  },
  deductions: {
    businessExpenses: Number,
    retirementContributions: Number,
    healthInsurance: Number,
    homeOfficeDeduction: Number
  },
  taxableIncome: {
    type: Number,
    required: true
  },
  estimatedTax: {
    type: Number,
    required: true
  },
  annualTax: {
    type: Number,
    required: true
  },
  effectiveRate: {
    type: Number,
    required: true
  },
  totalDeductions: {
    type: Number,
    required: true
  },
  dueDate: {
    type: Date,
    required: true
  },
  reminderDate: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TaxEstimate = mongoose.model('TaxEstimate', taxEstimateSchema);
export default TaxEstimate;