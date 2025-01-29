import { useState } from "react";
import { ConferenceScraperForm } from "@/components/ConferenceScraperForm";
import { ConferenceTable, type Conference } from "@/components/ConferenceTable";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const { toast } = useToast();

  const handleStartScraping = async (keywords: string[]) => {
    console.log("Starting scraping with keywords:", keywords);
    
    // Simulated data for demonstration
    const mockData: Conference[] = [
      {
        name: "Brazilian Medical Innovation Congress",
        location: "Porto Alegre, RS",
        month: "March",
        day: "15",
        year: "2025"
      },
      {
        name: "Southern Healthcare Summit",
        location: "Florianópolis, SC",
        month: "May",
        day: "22",
        year: "2025"
      }
    ];

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setConferences(mockData);
    toast({
      title: "Search Complete",
      description: `Found ${mockData.length} conferences matching your criteria`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Medical Conference Scraper
        </h1>
        <div className="max-w-4xl mx-auto space-y-8">
          <ConferenceScraperForm onStartScraping={handleStartScraping} />
          <ConferenceTable conferences={conferences} />
        </div>
      </div>
    </div>
  );
};

export default Index;