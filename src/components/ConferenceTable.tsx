import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, ExternalLink } from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

export interface Conference {
  name: string;
  location: string;
  month: string;
  day: string;
  year: string;
  url?: string;
}

interface ConferenceTableProps {
  conferences: Conference[];
}

type SortField = "name" | "location" | "date";
type SortDirection = "asc" | "desc";

export const ConferenceTable = ({ conferences }: ConferenceTableProps) => {
  const { toast } = useToast();
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");

  const handleSort = (field: SortField) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedConferences = [...conferences].sort((a, b) => {
    const direction = sortDirection === "asc" ? 1 : -1;
    switch (sortField) {
      case "name":
        return direction * a.name.localeCompare(b.name);
      case "location":
        return direction * a.location.localeCompare(b.location);
      case "date":
        const dateA = new Date(`${a.year}-${a.month}-${a.day}`);
        const dateB = new Date(`${b.year}-${b.month}-${b.day}`);
        return direction * (dateA.getTime() - dateB.getTime());
      default:
        return 0;
    }
  });

  const exportToExcel = () => {
    const exportData = conferences.map(conf => ({
      "Nome do Congresso": conf.name,
      "Local": conf.location,
      "Data": `${conf.day}/${conf.month}/${conf.year}`,
      "Link": conf.url || "N/A"
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Congressos");
    XLSX.writeFile(wb, "congressos-medicos-2025.xlsx");
    
    toast({
      title: "Exportação Concluída",
      description: "Os dados foram exportados com sucesso para Excel",
    });
  };

  return (
    <div className="backdrop-blur-md bg-glass rounded-lg border border-glass-light p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Resultados da Busca</h2>
        <Button onClick={exportToExcel} className="bg-accent hover:bg-accent-hover transition-colors">
          <Download className="mr-2 h-4 w-4" />
          Exportar para Excel
        </Button>
      </div>
      <div className="rounded-md border border-glass-light overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-glass-dark hover:bg-glass-dark">
              <TableHead 
                className="text-gray-200 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("name")}
              >
                Nome {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="text-gray-200 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("location")}
              >
                Local {sortField === "location" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead 
                className="text-gray-200 cursor-pointer hover:text-white transition-colors"
                onClick={() => handleSort("date")}
              >
                Data {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </TableHead>
              <TableHead className="text-gray-200">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedConferences.map((conference, index) => (
              <TableRow key={index} className="hover:bg-glass-dark transition-colors">
                <TableCell className="text-white">{conference.name}</TableCell>
                <TableCell className="text-white">{conference.location}</TableCell>
                <TableCell className="text-white">
                  {conference.day} de {conference.month}, {conference.year}
                </TableCell>
                <TableCell className="text-white">
                  {conference.url && (
                    <a
                      href={conference.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-hover transition-colors inline-flex items-center"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};