/**
 * @license
 * GRAM-DISHA — Deterministic Financial Engine
 * Pure mathematical, formula-bound calculations independent of generative AI.
 */

import { FinancialStructure, ProjectCostBreakdown, FinancialCalculationInput, MonthlyCashFlowRecord } from '../../types';

export class DeterministicFinancialEngine {
  /**
   * Standard Equated Monthly Installment (EMI) formula:
   * EMI = [P x r x (1+r)^n] / [(1+r)^n - 1]
   * where P = principal, r = monthly interest rate, n = tenure in months
   */
  public static calculateEMI(principal: number, annualRatePercent: number, tenureMonths: number): number {
    if (principal <= 0 || tenureMonths <= 0) return 0;
    if (annualRatePercent === 0) return Math.round(principal / tenureMonths);

    const monthlyRate = annualRatePercent / 12 / 100;
    const numerator = principal * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths);
    const denominator = Math.pow(1 + monthlyRate, tenureMonths) - 1;

    if (denominator === 0) return 0;
    return Math.round(numerator / denominator);
  }

  /**
   * Break-even Analysis formula:
   * Break-even Volume = Fixed Cost / (Unit Price - Unit Variable Cost)
   */
  public static calculateBreakEven(
    monthlyFixedCost: number,
    unitPrice: number,
    unitVariableCost: number
  ): { units: number; revenue: number; margin: number } {
    const contributionMargin = Math.max(1, unitPrice - unitVariableCost);
    if (monthlyFixedCost <= 0) {
      return { units: 0, revenue: 0, margin: contributionMargin };
    }
    const units = Math.ceil(monthlyFixedCost / contributionMargin);
    const revenue = Math.round(units * unitPrice);
    return { units, revenue, margin: contributionMargin };
  }

  /**
   * Return on Investment (ROI):
   * ROI = (Annual Net Profit / Total Project Cost) * 100
   */
  public static calculateROI(annualNetProfit: number, totalProjectCost: number): number {
    if (totalProjectCost <= 0) return 0;
    return Number(((annualNetProfit / totalProjectCost) * 100).toFixed(2));
  }

  /**
   * Debt Service Coverage Ratio (DSCR):
   * DSCR = Net Operating Income / Total Debt Service
   */
  public static calculateDSCR(annualNetOperatingIncome: number, annualDebtService: number): number {
    if (annualDebtService <= 0) return 9.99; // No debt service load
    return Number((annualNetOperatingIncome / annualDebtService).toFixed(2));
  }

  /**
   * Comprehensive Financial Structuring
   */
  public static structureProject(input: FinancialCalculationInput): FinancialStructure {
    const totalProjectCost = Math.max(0, input.projectCost);
    const promoterContribution = Math.min(totalProjectCost, Math.max(0, input.promoterCapital));
    const promoterContributionPercentage = totalProjectCost > 0 
      ? Number(((promoterContribution / totalProjectCost) * 100).toFixed(1))
      : 0;

    const netLoanRequirement = Math.max(0, totalProjectCost - promoterContribution);
    
    // Splitting 85% Term Loan, 15% Working Capital Loan
    const requiredTermLoan = Math.round(netLoanRequirement * 0.85);
    const requiredWorkingCapitalLoan = netLoanRequirement - requiredTermLoan;

    const monthlyEMI = this.calculateEMI(
      requiredTermLoan,
      input.interestRateAnnual,
      input.tenureMonths
    );

    const unitSellingPrice = input.unitSalePrice || 100;
    const unitVariableCost = input.unitVariableCost || 60;
    const monthlyFixedCost = input.monthlyFixedCost || (totalProjectCost * 0.02);
    const breakEven = this.calculateBreakEven(monthlyFixedCost, unitSellingPrice, unitVariableCost);
    const contributionMarginPercentage = unitSellingPrice > 0
      ? Math.round(((unitSellingPrice - unitVariableCost) / unitSellingPrice) * 100)
      : 35;

    const projectedRevenue = (breakEven.revenue * 1.45);
    const projectedOpCost = (monthlyFixedCost + (projectedRevenue * 0.55));
    const netOperatingIncome = projectedRevenue - projectedOpCost;

    const annualNOI = netOperatingIncome * 12;
    const annualDebtService = monthlyEMI * 12;
    const projectedDSCR = this.calculateDSCR(annualNOI, annualDebtService);

    const annualNetProfit = Math.max(0, annualNOI - annualDebtService);
    const projectedAnnualROI = this.calculateROI(annualNetProfit, totalProjectCost);

    const debtToEquityRatio = promoterContribution > 0
      ? `${(requiredTermLoan / promoterContribution).toFixed(1)}:1`
      : '100% Debt';

    // Default itemized cost breakdown
    const projectCostBreakdown: ProjectCostBreakdown = {
      fixedAssets: input.customBreakdown?.fixedAssets || Math.round(totalProjectCost * 0.07),
      equipmentAndMachinery: input.customBreakdown?.equipmentAndMachinery || Math.round(totalProjectCost * 0.53),
      infrastructureSetup: input.customBreakdown?.infrastructureSetup || Math.round(totalProjectCost * 0.21),
      initialRawMaterialInventory: input.customBreakdown?.initialRawMaterialInventory || Math.round(totalProjectCost * 0.10),
      workingCapitalContingency: input.customBreakdown?.workingCapitalContingency || Math.round(totalProjectCost * 0.07),
      statutoryLicensingCosts: input.customBreakdown?.statutoryLicensingCosts || Math.round(totalProjectCost * 0.02),
      totalProjectCost: totalProjectCost,
    };

    // 12-Month Projections
    let runningCash = promoterContribution * 0.2; // Start with contingency reserve
    const projectedMonthlyCashFlow: MonthlyCashFlowRecord[] = [];
    const cashFlowMonthly = Array.from({ length: 12 }).map((_, i) => {
      const month = i + 1;
      const isMoratorium = month <= (input.moratoriumMonths || 0);
      const debt = isMoratorium ? Math.round(monthlyEMI * 0.35) : monthlyEMI;
      const grossRev = Math.round(projectedRevenue * (0.85 + (i * 0.025)));
      const varCost = Math.round(grossRev * (unitVariableCost / unitSellingPrice));
      const fixedCost = Math.round(monthlyFixedCost);
      const net = grossRev - (varCost + fixedCost);
      const surplus = net - debt;
      runningCash += surplus;

      const record: MonthlyCashFlowRecord = {
        month,
        cashInflows: grossRev,
        variableExpenses: varCost,
        fixedExpenses: fixedCost,
        debtServiceEMI: debt,
        netCashFlow: surplus,
        closingCashBalance: Math.round(runningCash),
      };
      projectedMonthlyCashFlow.push(record);

      return {
        month,
        grossRevenue: grossRev,
        variableCosts: varCost,
        fixedCosts: fixedCost,
        netOperatingIncome: net,
        debtService: debt,
        surplus,
        closingCash: Math.round(runningCash),
      };
    });

    return {
      projectCost: projectCostBreakdown,
      promoterContribution,
      promoterContributionPercentage,
      requiredTermLoan,
      requiredWorkingCapitalLoan,
      interestRateAnnual: input.interestRateAnnual,
      tenureMonths: input.tenureMonths,
      moratoriumMonths: input.moratoriumMonths || 0,
      monthlyEMI,
      unitSellingPrice,
      unitVariableCost,
      monthlyFixedCost,
      contributionMarginPerUnit: breakEven.margin,
      contributionMarginPercentage,
      breakEvenMonthlyUnits: breakEven.units,
      breakEvenMonthlyRevenue: breakEven.revenue,
      projectedAnnualROI,
      projectedDSCR,
      debtToEquityRatio,
      projectedMonthlyCashFlow,
      cashFlowMonthly,
    };
  }
}
