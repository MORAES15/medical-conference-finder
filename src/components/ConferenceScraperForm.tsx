import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Search, StopCircle } from "lucide-react";

export const ConferenceScraperForm = ({ onStartScraping }: { onStartScraping: (keywords: string[]) => void }) => {
  const [keywords, setKeywords] = useState<string>("medical conference, southern brazil");
  const { toast } = useToast();
  const [isSearching, setIsSearching] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!keywords.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one keyword",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    onStartScraping(keywords.split(",").map(k => k.trim()));
  };

  const handleStop = () => {
    setIsSearching(false);
    toast({
      title: "Search Stopped",
      description: "The scraping process has been stopped",
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 backdrop-blur-md bg-glass p-6 rounded-lg border border-glass-light">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-200">Search Keywords</label>
        <Input
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          className="bg-glass-dark border-glass-light text-white placeholder:text-gray-400"
          placeholder="Enter keywords separated by commas"
        />
      </div>
      <div className="flex gap-2">
        {!isSearching ? (
          <Button type="submit" className="w-full bg-accent hover:bg-accent-hover">
            <Search className="mr-2 h-4 w-4" />
            Start Scraping
          </Button>
        ) : (
          <Button onClick={handleStop} variant="destructive" className="w-full">
            <StopCircle className="mr-2 h-4 w-4" />
            Stop Scraping
          </Button>
        )}
      </div>
    </form>
  );
};