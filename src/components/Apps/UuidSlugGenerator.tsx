
import React, { useState } from 'react';
import { Copy, Check, RefreshCw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

const UuidSlugGenerator: React.FC = () => {
  const [uuid, setUuid] = useState('');
  const [text, setText] = useState('');
  const [slug, setSlug] = useState('');
  const [copied, setCopied] = useState<{uuid: boolean; slug: boolean}>({uuid: false, slug: false});
  const { toast } = useToast();

  // Generate UUID on component mount
  React.useEffect(() => {
    generateUuid();
  }, []);

  const generateUuid = () => {
    // Implementation of RFC4122 version 4 UUID
    const cryptoObj = window.crypto || window.Crypto;
    
    if (cryptoObj && cryptoObj.getRandomValues) {
      // Use Web Crypto API if available
      const buffer = new Uint16Array(8);
      cryptoObj.getRandomValues(buffer);
      
      // Set version bits (4 = random UUID)
      buffer[3] = (buffer[3] & 0x0FFF) | 0x4000;
      // Set variant bits (8, 9, A, or B)
      buffer[4] = (buffer[4] & 0x3FFF) | 0x8000;
      
      const stringBuffer = Array.from(buffer, value => 
        value.toString(16).padStart(4, '0')
      );
      
      const result = `${stringBuffer[0]}${stringBuffer[1]}-${stringBuffer[2]}-${stringBuffer[3]}-${stringBuffer[4]}-${stringBuffer[5]}${stringBuffer[6]}${stringBuffer[7]}`;
      setUuid(result);
    } else {
      // Fallback to Math.random() if Web Crypto API is not available
      const lut: string[] = [];
      for (let i = 0; i < 256; i++) {
        lut[i] = (i < 16 ? '0' : '') + i.toString(16);
      }
      
      const d0 = Math.random() * 0xffffffff | 0;
      const d1 = Math.random() * 0xffffffff | 0;
      const d2 = Math.random() * 0xffffffff | 0;
      const d3 = Math.random() * 0xffffffff | 0;
      
      const result = 
        lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + '-' +
        lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + '-' +
        lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + '-' +
        lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + '-' +
        lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
        lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
      
      setUuid(result);
    }
    
    // Reset copy status
    setCopied(prev => ({...prev, uuid: false}));
  };

  const generateSlug = () => {
    if (!text.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira um texto para gerar o slug",
        variant: "destructive",
      });
      return;
    }
    
    // Create slug from text
    const slugResult = text
      .toLowerCase()
      .normalize('NFD') // Normalize diacritics
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Remove consecutive hyphens
      .trim() // Remove whitespace from both ends
      .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    
    setSlug(slugResult);
    
    // Reset copy status
    setCopied(prev => ({...prev, slug: false}));
  };

  const copyToClipboard = async (type: 'uuid' | 'slug') => {
    try {
      const textToCopy = type === 'uuid' ? uuid : slug;
      await navigator.clipboard.writeText(textToCopy);
      
      setCopied(prev => ({...prev, [type]: true}));
      
      toast({
        title: "Copiado!",
        description: `${type.toUpperCase()} copiado para a área de transferência`,
      });
      
      // Reset copy state after 2 seconds
      setTimeout(() => {
        setCopied(prev => ({...prev, [type]: false}));
      }, 2000);
    } catch (err) {
      toast({
        title: "Erro",
        description: "Não foi possível copiar para a área de transferência",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h2 className="text-lg font-semibold mb-4">Gerador de UUID e Slug</h2>
      
      <Tabs defaultValue="uuid" className="flex-1">
        <TabsList className="mb-6 grid grid-cols-2">
          <TabsTrigger value="uuid">UUID</TabsTrigger>
          <TabsTrigger value="slug">Slug</TabsTrigger>
        </TabsList>
        
        <TabsContent value="uuid" className="space-y-6">
          <div className="flex items-center space-x-2">
            <Input 
              value={uuid} 
              readOnly 
              className="font-mono flex-1"
            />
            <Button 
              onClick={() => copyToClipboard('uuid')} 
              className="w-10 p-0" 
              variant="outline"
              aria-label="Copiar UUID"
            >
              {copied.uuid ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
            </Button>
            <Button 
              onClick={generateUuid} 
              className="w-10 p-0" 
              variant="outline"
              aria-label="Gerar novo UUID"
            >
              <RefreshCw size={18} />
            </Button>
          </div>
          
          <div>
            <h3 className="text-sm font-medium mb-2">O que é UUID?</h3>
            <p className="text-sm text-gray-600">
              UUID (Universally Unique Identifier) é um identificador de 128 bits padronizado que é 
              praticamente garantido ser único globalmente. É comumente usado em sistemas distribuídos 
              para identificar informações sem coordenação central.
            </p>
          </div>
        </TabsContent>
        
        <TabsContent value="slug" className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Texto</label>
            <Input 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="Digite um texto para converter em slug..."
              className="mb-2"
            />
            <Button onClick={generateSlug} className="w-full mb-4">
              Gerar Slug
            </Button>
          </div>
          
          {slug && (
            <div>
              <label className="block text-sm font-medium mb-2">Slug gerado</label>
              <div className="flex items-center space-x-2">
                <Input 
                  value={slug} 
                  readOnly 
                  className="font-mono flex-1"
                />
                <Button 
                  onClick={() => copyToClipboard('slug')} 
                  className="w-10 p-0" 
                  variant="outline"
                  aria-label="Copiar slug"
                >
                  {copied.slug ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                </Button>
              </div>
            </div>
          )}
          
          <div>
            <h3 className="text-sm font-medium mb-2">O que é um Slug?</h3>
            <p className="text-sm text-gray-600">
              Um slug é uma versão amigável para URL de um texto. É normalmente composto por 
              letras minúsculas, números e hifens, e é usado em URLs para identificar recursos 
              de forma legível para humanos.
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UuidSlugGenerator;
