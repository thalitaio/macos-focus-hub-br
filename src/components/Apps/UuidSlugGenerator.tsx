
import React, { useState } from 'react';
import { Copy, RefreshCw, Check } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

const UuidSlugGenerator: React.FC = () => {
  const [uuid, setUuid] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateUUID = () => {
    // Fixed implementation to avoid TS errors
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    
    setUuid(uuid);
    return uuid;
  };

  const generateSlug = (text: string) => {
    const slug = text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    setSlug(slug);
    return slug;
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newText = e.target.value;
    setText(newText);
    generateSlug(newText);
  };

  const copyToClipboard = async (content: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      toast({
        title: "Copiado!",
        description: "Conteúdo copiado para a área de transferência",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar para a área de transferência",
        variant: "destructive",
      });
    }
  };

  // Generate initial UUID on component mount
  React.useEffect(() => {
    generateUUID();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Gerador de UUID e Slug</h2>
      
      <Tabs defaultValue="uuid" className="flex-1">
        <TabsList>
          <TabsTrigger value="uuid">UUID</TabsTrigger>
          <TabsTrigger value="slug">Slug</TabsTrigger>
        </TabsList>
        
        <TabsContent value="uuid" className="space-y-4">
          <div className="flex">
            <Input 
              value={uuid} 
              readOnly 
              className="font-mono flex-1 mr-2"
            />
            <Button 
              onClick={() => copyToClipboard(uuid)} 
              className="w-10 p-0" 
              variant="outline"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </Button>
            <Button 
              onClick={generateUUID} 
              className="w-10 p-0 ml-2" 
              variant="outline"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">
              Um UUID (Identificador Único Universal) é um identificador de 128 bits padronizado usado para identificar recursos de maneira única.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="slug" className="space-y-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Texto para converter
            </label>
            <Input 
              value={text} 
              onChange={handleTextChange} 
              placeholder="Digite um texto para gerar um slug"
              className="mb-2"
            />
          </div>
          
          <div className="flex">
            <Input 
              value={slug} 
              readOnly 
              className="font-mono flex-1 mr-2"
            />
            <Button 
              onClick={() => copyToClipboard(slug)} 
              className="w-10 p-0" 
              variant="outline"
            >
              {copied ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </Button>
            <Button 
              onClick={() => generateSlug(text)} 
              className="w-10 p-0 ml-2" 
              variant="outline"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">
              Um slug é uma versão amigável para URL de uma string, geralmente usada para criar URLs legíveis para humanos.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UuidSlugGenerator;
