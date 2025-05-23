
import React, { useState } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// We need to add the js-yaml package
const jsYaml = {
  load: (yaml: string) => {
    // Simple YAML to JSON converter (basic implementation)
    const lines = yaml.split('\n');
    const result: Record<string, any> = {};
    
    let currentIndent = 0;
    let currentObj = result;
    const stack: Array<{obj: Record<string, any>, indent: number}> = [{obj: result, indent: 0}];

    for (const line of lines) {
      if (!line.trim() || line.trim().startsWith('#')) continue;
      
      const indent = line.search(/\S|$/);
      const matches = line.trim().match(/^([^:]+):\s*(.*)$/);
      
      if (matches) {
        const [, key, value] = matches;
        
        if (indent > currentIndent) {
          // Going deeper
          const newObj: Record<string, any> = {};
          currentObj[lastKey] = newObj;
          stack.push({obj: currentObj, indent: currentIndent});
          currentObj = newObj;
          currentIndent = indent;
        } else if (indent < currentIndent) {
          // Going back up
          while (stack.length > 0 && indent <= currentIndent) {
            const popped = stack.pop();
            if (popped) {
              currentObj = popped.obj;
              currentIndent = popped.indent;
            }
          }
        }
        
        const trimmedValue = value.trim();
        if (trimmedValue) {
          // Handle basic data types
          if (trimmedValue === 'true') currentObj[key] = true;
          else if (trimmedValue === 'false') currentObj[key] = false;
          else if (trimmedValue === 'null') currentObj[key] = null;
          else if (!isNaN(Number(trimmedValue))) currentObj[key] = Number(trimmedValue);
          else currentObj[key] = trimmedValue.replace(/^["'](.*)["']$/, '$1'); // Remove quotes
        } else {
          // This is a parent key
          lastKey = key;
        }
      }
    }
    
    return result;
  },
  
  dump: (obj: any) => {
    // Simple JSON to YAML converter (basic implementation)
    const convert = (obj: any, indent = 0): string => {
      if (obj === null) return 'null';
      if (obj === undefined) return '';
      
      const indentStr = ' '.repeat(indent);
      
      if (typeof obj === 'object') {
        if (Array.isArray(obj)) {
          return obj.map(item => `${indentStr}- ${convert(item, indent + 2)}`).join('\n');
        } else {
          return Object.entries(obj)
            .map(([key, value]) => {
              if (typeof value === 'object' && value !== null) {
                return `${indentStr}${key}:\n${convert(value, indent + 2)}`;
              } else {
                return `${indentStr}${key}: ${convert(value)}`;
              }
            })
            .join('\n');
        }
      } else if (typeof obj === 'string') {
        // Check if string needs quotes
        if (obj.includes('\n') || obj.includes(':') || obj.includes('{') || obj.includes('[')) {
          return `"${obj.replace(/"/g, '\\"')}"`;
        }
        return obj;
      } else {
        return String(obj);
      }
    };
    
    return convert(obj);
  }
};

// Variable to track the last key name for nested structures
let lastKey = '';

const JsonYamlConverter: React.FC = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json-to-yaml' | 'yaml-to-json'>('json-to-yaml');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const convert = () => {
    if (!input.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um texto para converter",
        variant: "destructive",
      });
      return;
    }

    try {
      if (mode === 'json-to-yaml') {
        const jsonData = JSON.parse(input);
        setOutput(jsYaml.dump(jsonData));
      } else {
        const yamlData = jsYaml.load(input);
        setOutput(JSON.stringify(yamlData, null, 2));
      }
      
      toast({
        title: "Conversão concluída",
        description: mode === 'json-to-yaml' ? "JSON convertido para YAML" : "YAML convertido para JSON",
      });
    } catch (error) {
      console.error('Conversion error:', error);
      toast({
        title: "Erro de conversão",
        description: `O formato de entrada não é válido`,
        variant: "destructive",
      });
    }
  };

  const toggleMode = () => {
    setMode(mode === 'json-to-yaml' ? 'yaml-to-json' : 'json-to-yaml');
    // Swap input and output
    setInput(output);
    setOutput(input);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Convertido copiado para a área de transferência",
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o texto",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Conversor JSON ↔ YAML</h2>
        <Button 
          onClick={toggleMode} 
          variant="outline" 
          size="sm"
          className="flex items-center gap-1"
        >
          <ArrowRightLeft size={14} />
          {mode === 'json-to-yaml' ? 'JSON → YAML' : 'YAML → JSON'}
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-4 flex-1">
        <div className="flex flex-col">
          <label className="text-sm font-medium mb-2">
            {mode === 'json-to-yaml' ? 'JSON' : 'YAML'}
          </label>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 p-3 rounded border border-gray-300 font-mono text-sm resize-none"
            placeholder={`Cole seu ${mode === 'json-to-yaml' ? 'JSON' : 'YAML'} aqui...`}
          />
        </div>
        
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">
              {mode === 'json-to-yaml' ? 'YAML' : 'JSON'}
            </label>
            <Button 
              onClick={copyToClipboard} 
              size="sm" 
              variant="outline" 
              disabled={!output}
            >
              {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
              Copiar
            </Button>
          </div>
          <textarea 
            value={output}
            readOnly
            className="flex-1 p-3 rounded border border-gray-300 font-mono text-sm bg-gray-50 resize-none"
            placeholder={`O ${mode === 'json-to-yaml' ? 'YAML' : 'JSON'} convertido aparecerá aqui...`}
          />
        </div>
      </div>
      
      <div className="flex justify-center mt-4">
        <Button onClick={convert} className="w-1/3">
          Converter
        </Button>
      </div>
    </div>
  );
};

export default JsonYamlConverter;
