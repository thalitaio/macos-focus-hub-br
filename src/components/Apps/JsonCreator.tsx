
import React, { useState } from 'react';
import { Plus, Trash, Copy, Check, Save } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

type JsonFieldType = 'string' | 'number' | 'boolean' | 'array' | 'object';

interface JsonField {
  id: string;
  key: string;
  type: JsonFieldType;
  value: string | number | boolean | null;
}

const JsonCreator: React.FC = () => {
  const [fields, setFields] = useState<JsonField[]>([
    { id: '1', key: 'name', type: 'string', value: '' },
    { id: '2', key: 'age', type: 'number', value: 0 },
  ]);
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const addField = () => {
    const newId = Date.now().toString();
    setFields([...fields, { id: newId, key: '', type: 'string', value: '' }]);
  };

  const removeField = (id: string) => {
    setFields(fields.filter(field => field.id !== id));
  };

  const updateField = (id: string, prop: keyof JsonField, value: any) => {
    setFields(fields.map(field => {
      if (field.id === id) {
        // For type changes, convert the value accordingly
        if (prop === 'type') {
          let convertedValue: any = field.value;
          
          if (value === 'string') {
            convertedValue = field.value?.toString() || '';
          } else if (value === 'number') {
            convertedValue = Number(field.value) || 0;
          } else if (value === 'boolean') {
            convertedValue = Boolean(field.value);
          } else {
            convertedValue = null;
          }
          
          return { ...field, [prop]: value, value: convertedValue };
        }
        
        // For value changes, convert based on current type
        if (prop === 'value') {
          if (field.type === 'number') {
            value = value === '' ? 0 : Number(value);
          } else if (field.type === 'boolean') {
            value = value === 'true';
          }
        }
        
        return { ...field, [prop]: value };
      }
      return field;
    }));
  };

  const generateJson = () => {
    const jsonObj: Record<string, any> = {};
    
    fields.forEach(field => {
      if (field.key) {
        jsonObj[field.key] = field.value;
      }
    });
    
    const formatted = JSON.stringify(jsonObj, null, 2);
    setJsonOutput(formatted);
    
    toast({
      title: "JSON Gerado",
      description: "O JSON foi criado com sucesso",
      duration: 2000,
    });
  };

  const copyToClipboard = async () => {
    if (!jsonOutput) {
      toast({
        title: "Nada para copiar",
        description: "Gere o JSON primeiro",
        variant: "destructive",
      });
      return;
    }
    
    try {
      await navigator.clipboard.writeText(jsonOutput);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "JSON copiado para a área de transferência",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar o JSON",
        variant: "destructive",
      });
    }
  };

  const downloadJson = () => {
    if (!jsonOutput) {
      toast({
        title: "Nada para baixar",
        description: "Gere o JSON primeiro",
        variant: "destructive",
      });
      return;
    }
    
    const blob = new Blob([jsonOutput], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Download iniciado",
      description: "O arquivo JSON está sendo baixado",
      duration: 2000,
    });
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Criador de JSON</h2>
      
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 mb-6">
          {fields.map((field) => (
            <div key={field.id} className="flex items-center space-x-2">
              <Input
                placeholder="Chave"
                value={field.key}
                onChange={(e) => updateField(field.id, 'key', e.target.value)}
                className="w-1/3"
              />
              
              <Select 
                value={field.type} 
                onValueChange={(value: JsonFieldType) => updateField(field.id, 'type', value)}
              >
                <SelectTrigger className="w-1/4">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Número</SelectItem>
                  <SelectItem value="boolean">Booleano</SelectItem>
                </SelectContent>
              </Select>
              
              {field.type === 'string' && (
                <Input
                  placeholder="Valor"
                  value={field.value as string}
                  onChange={(e) => updateField(field.id, 'value', e.target.value)}
                  className="flex-1"
                />
              )}
              
              {field.type === 'number' && (
                <Input
                  type="number"
                  placeholder="0"
                  value={field.value as number}
                  onChange={(e) => updateField(field.id, 'value', e.target.value)}
                  className="flex-1"
                />
              )}
              
              {field.type === 'boolean' && (
                <Select 
                  value={String(field.value)} 
                  onValueChange={(value: string) => updateField(field.id, 'value', value)}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Valor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Verdadeiro</SelectItem>
                    <SelectItem value="false">Falso</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              <Button
                variant="outline"
                size="icon"
                onClick={() => removeField(field.id)}
                className="shrink-0"
              >
                <Trash size={16} />
              </Button>
            </div>
          ))}
        </div>
        
        <div className="flex space-x-2 mb-6">
          <Button onClick={addField} className="flex items-center gap-1">
            <Plus size={16} /> Adicionar Campo
          </Button>
          <Button onClick={generateJson} variant="secondary">
            Gerar JSON
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Saída JSON</h3>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                className="h-8"
                disabled={!jsonOutput}
              >
                {copied ? <Check size={16} /> : <Copy size={16} />}
                <span className="ml-1">{copied ? "Copiado" : "Copiar"}</span>
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={downloadJson}
                className="h-8"
                disabled={!jsonOutput}
              >
                <Save size={16} />
                <span className="ml-1">Baixar</span>
              </Button>
            </div>
          </div>
          
          <Textarea
            value={jsonOutput}
            readOnly
            className="font-mono min-h-[200px]"
            placeholder='{"exemplo": "JSON será exibido aqui"}'
          />
        </div>
      </div>
    </div>
  );
};

export default JsonCreator;
