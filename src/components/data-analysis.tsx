import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type AnalysisResults = {
  [key: string]: {
    min: number;
    max: number;
    avg: number;
    median: number;
  };
};

type DataAnalysisProps = {
  results: AnalysisResults;
};

const DataAnalysis: React.FC<DataAnalysisProps> = ({ results }) => {
  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-2">Data Analysis</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Appliance</TableHead>
            <TableHead>Min</TableHead>
            <TableHead>Max</TableHead>
            <TableHead>Average</TableHead>
            <TableHead>Median</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(results).map(([appliance, stats]) => (
            <TableRow key={appliance}>
              <TableCell>{appliance}</TableCell>
              <TableCell>{stats.min.toFixed(2)}</TableCell>
              <TableCell>{stats.max.toFixed(2)}</TableCell>
              <TableCell>{stats.avg.toFixed(2)}</TableCell>
              <TableCell>{stats.median.toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default DataAnalysis;
