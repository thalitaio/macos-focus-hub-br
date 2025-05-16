
import React, { useState, useEffect } from 'react';
import { ArrowDown, DollarSign, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ExchangeRates {
  USD_BRL: number;
  BRL_USD: number;
  timestamp: number;
}

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<'USD' | 'BRL'>('USD');
  const [toCurrency, setToCurrency] = useState<'USD' | 'BRL'>('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<ExchangeRates>({
    USD_BRL: 5.03,  // Example fixed value
    BRL_USD: 0.20,  // Example fixed value
    timestamp: Date.now()
  });
  
  const [loading, setLoading] = useState(false);
  
  // Mock API call to get currency rates
  const fetchRates = () => {
    setLoading(true);
    
    // Simulate API call with fluctuation in rates
    setTimeout(() => {
      // Randomize rates slightly for realism
      const baseRate = 5 + (Math.random() * 0.2);
      setRates({
        USD_BRL: parseFloat(baseRate.toFixed(2)),
        BRL_USD: parseFloat((1 / baseRate).toFixed(2)),
        timestamp: Date.now()
      });
      setLoading(false);
    }, 1000);
  };
  
  // Initial data load
  useEffect(() => {
    fetchRates();
  }, []);
  
  // Calculate conversion when params change
  useEffect(() => {
    if (!amount || isNaN(amount) || amount < 0) {
      setResult(null);
      return;
    }
    
    let conversionRate;
    if (fromCurrency === 'USD' && toCurrency === 'BRL') {
      conversionRate = rates.USD_BRL;
    } else if (fromCurrency === 'BRL' && toCurrency === 'USD') {
      conversionRate = rates.BRL_USD;
    } else {
      conversionRate = 1; // Same currency
    }
    
    setResult(parseFloat((amount * conversionRate).toFixed(2)));
  }, [amount, fromCurrency, toCurrency, rates]);
  
  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency as 'USD' | 'BRL');
    setToCurrency(fromCurrency);
  };
  
  // Format date from timestamp
  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Conversor de Moeda</h2>
        <div className="text-sm text-gray-500 flex items-center">
          <span>Última atualização: {formatDate(rates.timestamp)}</span>
          <Button
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={fetchRates}
            className="ml-2"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </Button>
        </div>
      </div>
      
      <div className="space-y-6 flex-1">
        {/* From Currency */}
        <div>
          <label className="block mb-2 text-sm font-medium">De:</label>
          <div className="flex space-x-2">
            <div className="flex-1">
              <Input
                type="number"
                value={amount || ''}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min={0}
              />
            </div>
            <div className="w-20">
              <select 
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as 'USD' | 'BRL')}
                className="w-full h-full border rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USD">USD</option>
                <option value="BRL">BRL</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Swap Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="icon"
            onClick={handleSwap}
          >
            <ArrowDown size={18} />
          </Button>
        </div>
        
        {/* To Currency */}
        <div>
          <label className="block mb-2 text-sm font-medium">Para:</label>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <Input
                readOnly
                value={result !== null ? result : ''}
                className="bg-gray-50"
              />
            </div>
            <div className="w-20">
              <select 
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as 'USD' | 'BRL')}
                className="w-full h-full border rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="BRL">BRL</option>
                <option value="USD">USD</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Current Rates */}
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Taxas atuais:</div>
          <div className="flex justify-between text-sm">
            <div className="flex items-center">
              <DollarSign size={14} className="mr-1" />
              <span>1 USD = {rates.USD_BRL} BRL</span>
            </div>
            <div className="flex items-center">
              <span>1 BRL = {rates.BRL_USD} USD</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
