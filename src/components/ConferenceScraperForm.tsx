import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, StopCircle, X } from "lucide-react";

interface Tag {
  id: string;
  value: string;
}

export const ConferenceScraperForm = ({ onStartScraping }: { onStartScraping: (keywords: string[]) => void }) => {
  const [tags, setTags] = useState<Tag[]>([
    { id: "1", value: "congresso medicina" },
    { id: "2", value: "simpósio médico" },
    { id: "3", value: "encontro médico" }
  ]);
  const [inputValue, setInputValue] = useState("");
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      const newTag = { id: Date.now().toString(), value: inputValue.trim() };
      setTags(prev => [...prev, newTag]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (id: string) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tags.length === 0) {
      toast({
        title: "Erro",
        description: "Adicione pelo menos um termo de busca",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    console.log("Starting scraping with keywords:", tags.map(tag => tag.value));
    onStartScraping(tags.map(tag => tag.value));
  };

  const handleStop = () => {
    setIsSearching(false);
    toast({
      title: "Busca Interrompida",
      description: "O processo de busca foi interrompido",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 backdrop-blur-md bg-glass p-6 rounded-lg border border-glass-light">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Termos de Busca</label>
        <div className="flex flex-wrap gap-2 p-3 bg-glass-dark rounded-lg border border-glass-light min-h-[120px]">
          {tags.map((tag) => (
            <span
              key={tag.id}
              className="animate-tag-enter flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-full text-sm transition-all duration-200 hover:bg-accent-hover group"
            >
              {tag.value}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.id)}
                className="opacity-70 hover:opacity-100 transition-opacity focus:outline-none"
                aria-label="Remove tag"
              >
                <X className="h-4 w-4" />
              </button>
            </span>
          ))}
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleAddTag}
            className="flex-1 min-w-[200px] bg-transparent border-none text-white placeholder:text-gray-400 focus:ring-1 focus:ring-accent"
            placeholder="Digite um termo e pressione Enter"
          />
        </div>
      </div>
      <div className="flex gap-2">
        {!isSearching ? (
          <Button type="submit" className="w-full bg-accent hover:bg-accent-hover transition-colors">
            <Search className="mr-2 h-4 w-4" />
            Iniciar Busca
          </Button>
        ) : (
          <Button onClick={handleStop} variant="destructive" className="w-full">
            <StopCircle className="mr-2 h-4 w-4" />
            Parar Busca
          </Button>
        )}
      </div>
    </form>
  );
};