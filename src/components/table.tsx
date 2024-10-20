import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function IntroPage() {
  const [fileData, setFileData] = useState<string[][]>([]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n").map((row) => row.split(","));
        setFileData(rows);
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">
              AI-Powered Micro-Grid Optimizer
            </CardTitle>
            <CardDescription className="text-center mt-2">
              A simulation-based tool for optimizing energy distribution in
              underserved communities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mt-4 text-lg text-gray-600">
              This tool demonstrates how AI can optimize energy distribution in
              a small micro-grid, focusing on balancing solar energy production,
              battery storage, and consumption in an underserved community. It's
              designed for a hackathon project showcasing the potential of edge
              devices using AI for energy management.
            </p>

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">
                Upload Simulation Data
              </h2>
              <div className="flex items-center space-x-4">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="flex-grow"
                />
                <Button
                  onClick={() =>
                    (
                      document.querySelector(
                        'input[type="file"]'
                      ) as HTMLInputElement
                    )?.click()
                  }
                >
                  Upload CSV
                </Button>
              </div>
            </div>

            {fileData.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">
                  Uploaded Data (First 50 Rows)
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Displaying the first 50 rows of the uploaded data.
                </p>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {fileData[0].map((header, index) => (
                          <TableHead key={index}>{header}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {fileData.slice(1, 51).map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          {row.map((cell, cellIndex) => (
                            <TableCell key={cellIndex}>{cell}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
              <ol className="list-decimal list-inside space-y-2">
                <li>
                  Upload your CSV file containing micro-grid simulation data.
                </li>
                <li>Review the data in the table above.</li>
                <li>
                  Proceed to the simulation page to visualize energy flow and AI
                  optimization.
                </li>
                <li>
                  Adjust parameters to see how the AI adapts to different
                  scenarios.
                </li>
              </ol>
            </div>

            <div className="mt-8 text-center">
              <Button size="lg">Start Simulation</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
