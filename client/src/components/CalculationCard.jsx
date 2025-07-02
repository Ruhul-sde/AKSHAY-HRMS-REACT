import React from 'react';
import { Calculator, Banknote, Percent, TrendingUp, Clock } from 'lucide-react';

const CalculationCard = ({ formData }) => (
  <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
    <div className="flex items-center gap-3 mb-4">
      <div className="bg-blue-100 p-2 rounded-lg">
        <Calculator className="w-5 h-5 text-blue-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-800">Loan Summary</h3>
    </div>
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <Banknote className="w-4 h-4" />
          <span>Principal Amount</span>
        </div>
        <span className="font-medium">
          {formData.ls_ReqAmnt ? `₹${Number(formData.ls_ReqAmnt).toLocaleString('en-IN')}` : '₹0'}
        </span>
      </div>
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <Percent className="w-4 h-4" />
          <span>Interest ({formData.ls_Intrst || '0'}%)</span>
        </div>
        <span className="font-medium">
          {formData.ls_ReqAmnt && formData.ls_Intrst
            ? `₹${(Number(formData.ls_ReqAmnt) * Number(formData.ls_Intrst)/100).toLocaleString('en-IN')}`
            : '₹0'}
        </span>
      </div>
      <div className="flex justify-between items-center pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-600">
          <TrendingUp className="w-4 h-4" />
          <span>Total Payable</span>
        </div>
        <span className="font-bold text-blue-600">
          {formData.ls_FinlAmnt ? `₹${Number(formData.ls_FinlAmnt).toLocaleString('en-IN')}` : '₹0'}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="w-4 h-4" />
          <span>Monthly EMI</span>
        </div>
        <div className="text-right">
          <p className="font-bold text-gray-800">
            {formData.ls_EmiAmnt ? `₹${Number(formData.ls_EmiAmnt).toLocaleString('en-IN')}` : '₹0'}
          </p>
          {formData.ls_NoOfEmi && (
            <p className="text-xs text-gray-500">
              for {formData.ls_NoOfEmi} months
            </p>
          )}
        </div>
      </div>
    </div>
  </div>
);

export default React.memo(CalculationCard); 