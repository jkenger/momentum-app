// components/learn/risk-calculator.tsx
"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export function RiskCalculator() {
  const [accountSize, setAccountSize] = useState<number>(10000);
  const [riskPercentage, setRiskPercentage] = useState<number>(1);
  const [entryPrice, setEntryPrice] = useState<number>(100);
  const [stopLoss, setStopLoss] = useState<number>(95);

  const [positionSize, setPositionSize] = useState<number>(0);
  const [riskAmount, setRiskAmount] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    // Calculate risk amount
    const maxRiskAmount = (accountSize * riskPercentage) / 100;
    setRiskAmount(maxRiskAmount);

    // Calculate risk per unit
    const riskPerUnit = Math.abs(entryPrice - stopLoss);

    // Calculate quantity
    const calculatedQuantity = maxRiskAmount / riskPerUnit;
    setQuantity(Number(calculatedQuantity.toFixed(4)));

    // Calculate total position size
    const calculatedPositionSize = entryPrice * calculatedQuantity;
    setPositionSize(Number(calculatedPositionSize.toFixed(2)));
  }, [accountSize, riskPercentage, entryPrice, stopLoss]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Input Fields */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="accountSize">Account Size ($)</Label>
            <Input
              id="accountSize"
              type="number"
              value={accountSize}
              onChange={(e) => setAccountSize(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="riskPercentage">Risk Percentage (%)</Label>
            <Input
              id="riskPercentage"
              type="number"
              value={riskPercentage}
              onChange={(e) => setRiskPercentage(Number(e.target.value))}
              step="0.1"
              min="0.1"
              max="100"
            />
          </div>
          <div>
            <Label htmlFor="entryPrice">Entry Price ($)</Label>
            <Input
              id="entryPrice"
              type="number"
              value={entryPrice}
              onChange={(e) => setEntryPrice(Number(e.target.value))}
            />
          </div>
          <div>
            <Label htmlFor="stopLoss">Stop Loss ($)</Label>
            <Input
              id="stopLoss"
              type="number"
              value={stopLoss}
              onChange={(e) => setStopLoss(Number(e.target.value))}
            />
          </div>
        </div>

        {/* Results */}
        <Card className="p-4 space-y-4">
          <div>
            <Label className="text-muted-foreground">Risk Amount ($)</Label>
            <p className="text-2xl font-bold">{riskAmount.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Position Size ($)</Label>
            <p className="text-2xl font-bold">{positionSize.toFixed(2)}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Quantity</Label>
            <p className="text-2xl font-bold">{quantity.toFixed(4)}</p>
          </div>
          <div className="text-sm text-muted-foreground">
            * Calculations assume no leverage
          </div>
        </Card>
      </div>

      {/* Explanation */}
      <div className="text-sm text-muted-foreground space-y-2">
        <p>
          <strong>How it works:</strong>
        </p>
        <ul className="list-disc pl-6 space-y-1">
          <li>Risk amount is calculated as account size × risk percentage</li>
          <li>
            Position size is based on your entry price and calculated quantity
          </li>
          <li>
            Quantity is determined by your risk amount divided by the difference
            between entry and stop loss
          </li>
        </ul>
      </div>
    </div>
  );
}
