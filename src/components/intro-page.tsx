"use client";

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
import MicroGridOptimizer from "./micro-grid-optimizer";
import DataAnalysis from "./data-analysis";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type Appliance = {
  name: string;
  x: number;
  y: number;
  color: string;
  icon: string;
};

const iconMap: { [key: string]: string } = {
  "Solar Panel": "☀️",
  "Wind Turbine": "🌬️",
  House: "🏠",
  Fan: "💨",
  "Community Center": "🏛️",
  Battery: "🔋",
  "Electric Vehicle": "🚗",
  "Smart Meter": "📊",
  "Water Pump": "💧",
  "Street Light": "🏮",
};

const colorMap: { [key: string]: string } = {
  "Solar Panel": "#FFA000",
  "Wind Turbine": "#0277BD",
  House: "#795548",
  Fan: "#0777BD",
  "Community Center": "#673AB7",
  Battery: "#4CAF50",
  "Electric Vehicle": "#E91E63",
  "Smart Meter": "#9C27B0",
  "Water Pump": "#00BCD4",
  "Street Light": "#FF5722",
};

export default function IntroPage() {
  const [fileData, setFileData] = useState<string[][]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [showSimulation, setShowSimulation] = useState(false);
  const [extractedData, setExtractedData] = useState<{
    [key: string]: number[];
  }>({});
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [dailyUsage, setDailyUsage] = useState<
    { date: string; totalPower: number }[]
  >([]);
  const [analysisResults, setAnalysisResults] = useState<{
    [key: string]: { min: number; max: number; avg: number; median: number };
  }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [aimlapiAnalysis, setaimlapiAnalysis] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const rows = text.split("\n").map((row) => row.split(","));
        setFileData(rows);

        const headers = rows[0];
        const timestampIndex = headers.findIndex((header) =>
          header.toLowerCase().includes("timestamp")
        );
        const relevantColumns = headers.filter(
          (header) =>
            !header.toLowerCase().includes("timestamp") &&
            !header.toLowerCase().includes("total")
        );

        const newAppliances: Appliance[] = relevantColumns.map(
          (column, index) => ({
            name: column.trim(),
            x: 100 + ((index * 150) % 600),
            y: 100 + Math.floor(index / 4) * 150,
            color: colorMap[column.trim()] || `hsl(${index * 30}, 70%, 50%)`,
            icon: iconMap[column.trim()] || "📍",
          })
        );

        setAppliances(newAppliances);

        const extractedData: { [key: string]: number[] } = {};
        const timestamps: string[] = [];
        relevantColumns.forEach((column) => {
          const columnIndex = headers.indexOf(column);
          extractedData[column] = rows
            .slice(1)
            .map((row) => parseFloat(row[columnIndex]) || 0);
        });
        timestamps.push(...rows.slice(1).map((row) => row[timestampIndex]));
        setExtractedData(extractedData);
        setTimestamps(timestamps);

        // Calculate daily usage
        const dailyUsage: { [key: string]: number } = {};
        rows.slice(1).forEach((row) => {
          const date = row[timestampIndex].split(" ")[0];
          const totalPower = relevantColumns.reduce(
            (sum, column) =>
              sum + (parseFloat(row[headers.indexOf(column)]) || 0),
            0
          );
          dailyUsage[date] = (dailyUsage[date] || 0) + totalPower;
        });
        setDailyUsage(
          Object.entries(dailyUsage).map(([date, totalPower]) => ({
            date,
            totalPower,
          }))
        );

        // Perform data analysis
        const analysisResults: {
          [key: string]: {
            min: number;
            max: number;
            avg: number;
            median: number;
          };
        } = {};
        Object.entries(extractedData).forEach(([key, values]) => {
          const sortedValues = [...values].sort((a, b) => a - b);
          analysisResults[key] = {
            min: sortedValues[0],
            max: sortedValues[sortedValues.length - 1],
            avg: values.reduce((sum, val) => sum + val, 0) / values.length,
            median: sortedValues[Math.floor(sortedValues.length / 2)],
          };
        });
        setAnalysisResults(analysisResults);

        // Send data to aimlapi API
        sendToaimlapiAPI(text);
      };
      reader.readAsText(file);
    }
  };

  const sendToaimlapiAPI = async (csvData: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/aimlapi-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ csvData }),
      });
      const data = await response.json();
      setaimlapiAnalysis(data.response);
    } catch (error) {
      console.error("Error sending data to aimlapi API:", error);
      setaimlapiAnalysis(
        "Error occurred while processing data with aimlapi API."
      );
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
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
              a small micro-grid, focusing on balancing energy production,
              storage, and consumption in an underserved community. It's
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
                  Uploaded Data (First 10 Rows)
                </h3>
                <p className="text-sm text-gray-500 mb-2">
                  Displaying the first 10 rows of the uploaded data.
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
                      {fileData.slice(1, 11).map((row, rowIndex) => (
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

            {dailyUsage.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">
                  Daily Power Usage
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={dailyUsage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="totalPower"
                      stroke="#8884d8"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {Object.keys(analysisResults).length > 0 && (
              <DataAnalysis results={analysisResults} />
            )}

            {isLoading && (
              <div className="mt-8 text-center">
                <p>Processing data with aimlapi API. Please wait....</p>
              </div>
            )}

            {aimlapiAnalysis && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">
                  aimlapi API Analysis
                </h3>
                <p className="whitespace-pre-wrap">{aimlapiAnalysis}</p>
              </div>
            )}

            <div className="mt-8 text-center">
              <Button
                size="lg"
                onClick={() => setShowSimulation(true)}
                disabled={appliances.length === 0}
              >
                Start Simulation
              </Button>
            </div>
          </CardContent>
        </Card>

        {showSimulation && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">
                Micro-Grid Simulation
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MicroGridOptimizer
                appliances={appliances}
                extractedData={extractedData}
                timestamps={timestamps}
              />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
