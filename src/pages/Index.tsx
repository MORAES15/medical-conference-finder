import { useState } from "react";
import { ConferenceScraperForm } from "@/components/ConferenceScraperForm";
import { ConferenceTable, type Conference } from "@/components/ConferenceTable";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";

const Index = () => {
  const [conferences, setConferences] = useState<Conference[]>([]);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const handleStartScraping = async (keywords: string[]) => {
    console.log("Starting scraping with keywords:", keywords);
    setProgress(0);
    
    // Simulated data for demonstration
    const mockData: Conference[] = [
      {
        name: "Congresso Brasileiro de Inovação Médica",
        location: "Porto Alegre, RS",
        month: "Março",
        day: "15",
        year: "2025",
        url: "https://example.com/congresso1"
      },
      {
        name: "Simpósio Sul-Brasileiro de Saúde",
        location: "Florianópolis, SC",
        month: "Maio",
        day: "22",
        year: "2025",
        url: "https://example.com/simposio1"
      }
    ];

    // Simulate progress updates
    for (let i = 0; i <= 100; i += 20) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setConferences(mockData);
    toast({
      title: "Busca Concluída",
      description: `Encontrados ${mockData.length} eventos correspondentes aos critérios`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-purple-900">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">
          Buscador de Congressos Médicos
        </h1>
        <div className="max-w-4xl mx-auto space-y-8">
          <ConferenceScraperForm onStartScraping={handleStartScraping} />
          {progress > 0 && progress < 100 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-white">
                <span>Buscando eventos...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}
          <ConferenceTable conferences={conferences} />
        </div>
      </div>
    </div>
  );
};

export default Index;