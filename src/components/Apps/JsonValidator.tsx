
import React, { useState } from 'react';
import { Check, X, Copy } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const JsonValidator: React.FC = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [validationResult, setValidationResult] = useState<{
    isValid: boolean;
    formattedJson: string;
    error?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const validateJson = () => {
    if (!jsonInput.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um JSON para validar",
        variant: "destructive",
      });
      return;
    }

    try {
      // Parse JSON to validate it
      const parsed = JSON.parse(jsonInput);
      
      // Format JSON with proper indentation
      const formattedJson = JSON.stringify(parsed, null, 2);
      
      setValidationResult({
        isValid: true,
        formattedJson
      });
      
      toast({
        title: "JSON Válido",
        description: "O JSON é válido e foi formatado",
      });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
      
      setValidationResult({
        isValid: false,
        formattedJson: '',
        error: errorMessage
      });
      
      toast({
        title: "JSON Inválido",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    if (!validationResult?.formattedJson) return;
    
    try {
      await navigator.clipboard.writeText(validationResult.formattedJson);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "JSON formatado copiado para a área de transferência",
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o JSON",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Validador de JSON</h2>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">JSON de entrada</label>
          <textarea 
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            className="flex-1 p-3 rounded border border-gray-300 font-mono text-sm resize-none"
            placeholder="Cole seu JSON aqui para validação..."
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <span className="text-sm font-medium mr-2">Resultado</span>
              {validationResult && (
                validationResult.isValid ? (
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <Check size={12} className="mr-1" />
                    Válido
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full flex items-center">
                    <X size={12} className="mr-1" />
                    Inválido
                  </div>
                )
              )}
            </div>
            
            {validationResult?.isValid && (
              <Button 
                onClick={copyToClipboard} 
                size="sm" 
                variant="outline"
              >
                {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                Copiar
              </Button>
            )}
          </div>
          
          {validationResult?.isValid ? (
            <textarea 
              value={validationResult.formattedJson}
              readOnly
              className="flex-1 p-3 rounded border border-gray-300 font-mono text-sm bg-green-50 resize-none"
            />
          ) : (
            <div className={`flex-1 p-3 rounded border ${validationResult?.error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50'} font-mono text-sm overflow-auto`}>
              {validationResult?.error ? (
                <span className="text-red-600">{validationResult.error}</span>
              ) : (
                <span className="text-gray-400">O resultado da validação aparecerá aqui...</span>
              )}
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <Button onClick={validateJson} className="w-1/3">
          Validar
        </Button>
      </div>
    </div>
  );
};

export default JsonValidator;
