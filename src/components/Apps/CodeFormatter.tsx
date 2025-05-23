
import React, { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const CodeFormatter: React.FC = () => {
  const [code, setCode] = useState('');
  const [formattedCode, setFormattedCode] = useState('');
  const [format, setFormat] = useState('json');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const formatCode = () => {
    if (!code.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um código para formatar",
        variant: "destructive",
      });
      return;
    }

    try {
      let result = '';
      
      switch (format) {
        case 'json': {
          // Format JSON
          const parsedJson = JSON.parse(code);
          result = JSON.stringify(parsedJson, null, 2);
          break;
        }
        case 'html': {
          // Simple HTML formatter - replace multiple spaces with single space
          result = code
            .replace(/>\s+</g, '>\n<') // Add newline between tags
            .replace(/\n\s+/g, '\n')   // Remove extra spaces after newlines
            .split('\n')               // Split by line
            .map(line => {             // Add indentation
              const indent = (line.match(/<\//) ? -1 : 0) + (line.match(/<[^/]/) ? 1 : 0);
              return '  '.repeat(Math.max(0, indent)) + line;
            })
            .join('\n');
          break;
        }
        case 'css': {
          // Simple CSS formatter
          result = code
            .replace(/\s*{\s*/g, ' {\n  ')
            .replace(/;\s*/g, ';\n  ')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/\n\s*\n/g, '\n');
          break;
        }
        default:
          result = code;
      }
      
      setFormattedCode(result);
      toast({
        title: "Formatação concluída",
        description: `Código formatado como ${format.toUpperCase()}`,
      });
    } catch (error) {
      console.error('Formatting error:', error);
      toast({
        title: "Erro de formatação",
        description: `O código ${format.toUpperCase()} não é válido`,
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedCode);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Código formatado copiado para a área de transferência",
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o código",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Formatador de Código</h2>
      
      <Tabs defaultValue="json" value={format} onValueChange={setFormat} className="flex-1 flex flex-col">
        <TabsList className="mb-4 grid grid-cols-3">
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
        </TabsList>
        
        <div className="grid grid-cols-2 gap-4 flex-1">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-2">Código original</label>
            <textarea 
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-3 rounded border border-gray-300 font-mono text-sm resize-none"
              placeholder={`Cole seu código ${format.toUpperCase()} aqui...`}
            />
          </div>
          
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Código formatado</label>
              <div className="flex gap-2">
                <Button 
                  onClick={copyToClipboard} 
                  size="sm" 
                  variant="outline" 
                  disabled={!formattedCode}
                >
                  {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
                  Copiar
                </Button>
              </div>
            </div>
            <textarea 
              value={formattedCode}
              readOnly
              className="flex-1 p-3 rounded border border-gray-300 font-mono text-sm bg-gray-50 resize-none"
              placeholder="O código formatado aparecerá aqui..."
            />
          </div>
        </div>
        
        <div className="flex justify-center mt-4">
          <Button onClick={formatCode} className="w-1/3">
            Formatar
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default CodeFormatter;
