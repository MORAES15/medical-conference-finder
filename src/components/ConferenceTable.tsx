import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import * as XLSX from 'xlsx';
import { useToast } from "@/components/ui/use-toast";

export interface Conference {
  name: string;
  location: string;
  month: string;
  day: string;
  year: string;
}

interface ConferenceTableProps {
  conferences: Conference[];
}

export const ConferenceTable = ({ conferences }: ConferenceTableProps) => {
  const { toast } = useToast();

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(conferences);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Conferences");
    XLSX.writeFile(wb, "medical-conferences-2025.xlsx");
    
    toast({
      title: "Export Successful",
      description: "Conference data has been exported to Excel",
    });
  };

  return (
    <div className="backdrop-blur-md bg-glass rounded-lg border border-glass-light p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Conference Results</h2>
        <Button onClick={exportToExcel} className="bg-accent hover:bg-accent-hover">
          <Download className="mr-2 h-4 w-4" />
          Export to Excel
        </Button>
      </div>
      <div className="rounded-md border border-glass-light">
        <Table>
          <TableHeader>
            <TableRow className="bg-glass-dark">
              <TableHead className="text-gray-200">Name</TableHead>
              <TableHead className="text-gray-200">Location</TableHead>
              <TableHead className="text-gray-200">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {conferences.map((conference, index) => (
              <TableRow key={index} className="hover:bg-glass-dark transition-colors">
                <TableCell className="text-white">{conference.name}</TableCell>
                <TableCell className="text-white">{conference.location}</TableCell>
                <TableCell className="text-white">
                  {conference.month} {conference.day}, {conference.year}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};