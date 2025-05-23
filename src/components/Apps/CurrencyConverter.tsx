import React, { useState, useEffect } from 'react';
import { ArrowDown, DollarSign, RefreshCw } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ExchangeRates {
  USD_BRL: number;
  BRL_USD: number;
  EUR_BRL: number;
  BRL_EUR: number;
  EUR_USD: number;
  USD_EUR: number;
  timestamp: number;
}

type CurrencyType = 'USD' | 'BRL' | 'EUR';

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState<CurrencyType>('USD');
  const [toCurrency, setToCurrency] = useState<CurrencyType>('BRL');
  const [result, setResult] = useState<number | null>(null);
  const [rates, setRates] = useState<ExchangeRates>({
    USD_BRL: 0,
    BRL_USD: 0,
    EUR_BRL: 0,
    BRL_EUR: 0,
    EUR_USD: 0,
    USD_EUR: 0,
    timestamp: Date.now()
  });

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const currencySymbols: Record<CurrencyType, string> = {
    USD: '$',
    BRL: 'R$',
    EUR: '€'
  };

  // Fetch real exchange rates
  const fetchRates = async () => {
    setLoading(true);
    try {
      const [usdResponse, eurResponse] = await Promise.all([
        fetch('https://open.er-api.com/v6/latest/USD'),
        fetch('https://open.er-api.com/v6/latest/EUR')
      ]);

      const [usdData, eurData] = await Promise.all([
        usdResponse.json(),
        eurResponse.json()
      ]);

      if (usdData.result === 'success' && eurData.result === 'success') {
        const usdToBrl = usdData.rates.BRL;
        const eurToBrl = eurData.rates.BRL;
        const eurToUsd = eurData.rates.USD;

        setRates({
          USD_BRL: parseFloat(usdToBrl.toFixed(2)),
          BRL_USD: parseFloat((1 / usdToBrl).toFixed(4)),
          EUR_BRL: parseFloat(eurToBrl.toFixed(2)),
          BRL_EUR: parseFloat((1 / eurToBrl).toFixed(4)),
          EUR_USD: parseFloat(eurToUsd.toFixed(4)),
          USD_EUR: parseFloat((1 / eurToUsd).toFixed(4)),
          timestamp: Date.now()
        });
      } else {
        throw new Error('Falha ao obter taxas de câmbio');
      }
    } catch (error) {
      console.error('Erro ao buscar taxas:', error);
      toast({
        title: "Erro ao atualizar taxas",
        description: "Não foi possível obter as taxas de câmbio atualizadas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchRates();
    // Atualizar taxas a cada 5 minutos
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Calculate conversion when params change
  useEffect(() => {
    if (!amount || isNaN(amount) || amount < 0) {
      setResult(null);
      return;
    }

    let conversionRate;
    const rateKey = `${fromCurrency}_${toCurrency}` as keyof ExchangeRates;

    if (fromCurrency === toCurrency) {
      conversionRate = 1;
    } else if (rates[rateKey]) {
      conversionRate = rates[rateKey];
    } else {
      // Se a taxa direta não existe, calculamos a inversa
      const inverseKey = `${toCurrency}_${fromCurrency}` as keyof ExchangeRates;
      conversionRate = 1 / rates[inverseKey];
    }

    setResult(parseFloat((amount * conversionRate).toFixed(2)));
  }, [amount, fromCurrency, toCurrency, rates]);

  // Swap currencies
  const handleSwap = () => {
    setFromCurrency(toCurrency);
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

  // Format currency value
  const formatCurrency = (value: number, currency: CurrencyType) => {
    const symbol = currencySymbols[currency];
    const decimals = currency === 'BRL' ? 2 : 4;
    return `${symbol} ${value.toFixed(decimals)}`;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-1">Conversor de Moeda</h2>
        <div className="text-sm text-gray-500 flex items-center justify-between">
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
                placeholder="0.00"
                className="text-right"
              />
            </div>
            <div className="w-24">
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value as CurrencyType)}
                className="w-full h-full border rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="BRL">BRL (R$)</option>
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
                value={result !== null ? formatCurrency(result, toCurrency) : ''}
                className="bg-gray-50 text-right"
                placeholder="0.00"
              />
            </div>
            <div className="w-24">
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value as CurrencyType)}
                className="w-full h-full border rounded-md px-2 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="BRL">BRL (R$)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Current Rates */}
        <div className="mt-6">
          <div className="text-sm font-medium mb-2">Taxas atuais:</div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <DollarSign size={14} className="mr-1" />
                <span>1 USD = {formatCurrency(rates.USD_BRL, 'BRL')}</span>
              </div>
              <div className="flex items-center">
                <span>1 USD = {formatCurrency(rates.USD_EUR, 'EUR')}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm bg-gray-50 p-3 rounded-lg">
              <div className="flex items-center">
                <span>€</span>
                <span className="ml-1">1 EUR = {formatCurrency(rates.EUR_BRL, 'BRL')}</span>
              </div>
              <div className="flex items-center">
                <span>1 EUR = {formatCurrency(rates.EUR_USD, 'USD')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrencyConverter;
