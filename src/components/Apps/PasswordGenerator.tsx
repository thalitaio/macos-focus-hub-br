
import React, { useState, useEffect } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(12);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  // Generate password on initial render and when settings change
  useEffect(() => {
    generatePassword();
  }, [length, includeSymbols, includeNumbers]);

  const generatePassword = () => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    let chars = lowercase + uppercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;
    
    let newPassword = '';
    for (let i = 0; i < length; i++) {
      newPassword += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    setPassword(newPassword);
    setCopied(false);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Senha copiada para a área de transferência",
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar a senha",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Gerador de Senhas</h2>
      
      <div className="flex mb-6">
        <Input 
          value={password} 
          readOnly 
          className="font-mono flex-1 mr-2"
        />
        <Button 
          onClick={copyToClipboard} 
          className="w-10 p-0" 
          variant="outline"
          aria-label="Copiar para área de transferência"
        >
          {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
        </Button>
        <Button 
          onClick={generatePassword} 
          className="w-10 p-0 ml-2" 
          variant="outline"
          aria-label="Gerar nova senha"
        >
          <RefreshCw size={18} />
        </Button>
      </div>
      
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label>Comprimento</Label>
            <span className="text-sm font-medium">{length}</span>
          </div>
          <Slider 
            value={[length]} 
            min={6} 
            max={32} 
            step={1} 
            onValueChange={(value) => setLength(value[0])} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="include-numbers">Incluir números</Label>
          <Switch 
            id="include-numbers" 
            checked={includeNumbers} 
            onCheckedChange={setIncludeNumbers} 
          />
        </div>
        
        <div className="flex items-center justify-between">
          <Label htmlFor="include-symbols">Incluir símbolos</Label>
          <Switch 
            id="include-symbols" 
            checked={includeSymbols} 
            onCheckedChange={setIncludeSymbols} 
          />
        </div>
      </div>
      
      <div className="mt-6 border-t border-gray-200 pt-4">
        <p className="text-sm text-gray-500">
          Dica: Senhas com comprimento maior que 12 caracteres, incluindo letras maiúsculas, minúsculas, números e símbolos são consideradas muito seguras.
        </p>
      </div>
    </div>
  );
};

export default PasswordGenerator;
