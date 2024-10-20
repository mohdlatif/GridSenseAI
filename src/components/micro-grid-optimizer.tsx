"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

type Appliance = {
  name: string;
  x: number;
  y: number;
  color: string;
  icon: string;
};

type MicroGridOptimizerProps = {
  appliances: Appliance[];
  extractedData: { [key: string]: number[] };
  timestamps: string[];
};

const MicroGridOptimizer: React.FC<MicroGridOptimizerProps> = ({
  appliances,
  extractedData,
  timestamps,
}) => {
  const [flowSpeed, setFlowSpeed] = useState(2); // Default flow speed in seconds
  const [batchSize, setBatchSize] = useState(3); // Default batch size
  const [currentDataIndex, setCurrentDataIndex] = useState(0);
  const [currentTimestamp, setCurrentTimestamp] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDataIndex((prevIndex) => {
        const newIndex =
          (prevIndex + 1) % (Object.values(extractedData)[0]?.length || 1);
        setCurrentTimestamp(timestamps[newIndex] || "");
        return newIndex;
      });
    }, flowSpeed * 1000);

    return () => clearInterval(interval);
  }, [flowSpeed, extractedData, timestamps]);

  return (
    <div className="w-full min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold mb-4">
        AI-Powered Micro-Grid Optimizer
      </h1>
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <Label htmlFor="flowSpeed">
              Flow Speed (seconds): {flowSpeed.toFixed(1)}
            </Label>
            <Slider
              id="flowSpeed"
              min={0.1}
              max={5}
              step={0.1}
              value={[flowSpeed]}
              onValueChange={(value) => setFlowSpeed(value[0])}
            />
          </div>
          <div>
            <Label htmlFor="batchSize">Batch Size: {batchSize}</Label>
            <Slider
              id="batchSize"
              min={1}
              max={10}
              step={1}
              value={[batchSize]}
              onValueChange={(value) => setBatchSize(value[0])}
            />
          </div>
        </div>
        <div className="text-center mb-4">
          <p className="text-lg font-semibold">
            Current Timestamp: {currentTimestamp}
          </p>
        </div>
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto border border-gray-300 rounded"
        >
          {/* Central AI Hub */}
          <circle cx="400" cy="300" r="50" fill="#4CAF50" />
          <text
            x="400"
            y="300"
            textAnchor="middle"
            fill="white"
            fontSize="20"
            dy=".3em"
          >
            AI Hub
          </text>

          {/* Appliances and Connections */}
          {appliances.map((appliance, index) => (
            <React.Fragment key={index}>
              <circle
                cx={appliance.x}
                cy={appliance.y}
                r="30"
                fill={appliance.color}
              />
              <text
                x={appliance.x}
                y={appliance.y}
                textAnchor="middle"
                fill="white"
                fontSize="24"
                dy=".3em"
              >
                {appliance.icon}
              </text>
              <text
                x={appliance.x}
                y={appliance.y + 50}
                textAnchor="middle"
                fill={appliance.color}
                fontSize="14"
              >
                {appliance.name}
              </text>
              <AnimatedConnection
                start={{ x: appliance.x, y: appliance.y }}
                end={{ x: 400, y: 300 }}
                flowSpeed={flowSpeed}
                batchSize={batchSize}
                currentValue={
                  extractedData[appliance.name]?.[currentDataIndex] || 0
                }
              />
            </React.Fragment>
          ))}
        </svg>
      </div>
    </div>
  );
};
interface AnimatedConnectionProps {
  start: { x: number; y: number };
  end: { x: number; y: number };
  flowSpeed: number;
  batchSize: number;
  currentValue: number;
}

const AnimatedConnection: React.FC<AnimatedConnectionProps> = ({
  start,
  end,
  flowSpeed,
  batchSize,
  currentValue,
}) => {
  const numbers = Array.from({ length: batchSize }, () =>
    currentValue.toFixed(2)
  );

  // Calculate the path for the numbers to follow
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const angle = Math.atan2(dy, dx);
  const length = Math.sqrt(dx * dx + dy * dy);

  return (
    <g>
      <line
        x1={start.x}
        y1={start.y}
        x2={end.x}
        y2={end.y}
        stroke="#90A4AE"
        strokeWidth="2"
      />
      {numbers.map((number, index) => (
        <motion.g
          key={index}
          initial={{ x: 0, y: 0 }}
          animate={{
            x: [0, dx],
            y: [0, dy],
          }}
          transition={{
            duration: flowSpeed,
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            delay: (index / batchSize) * flowSpeed,
          }}
        >
          <motion.circle cx={start.x} cy={start.y} r="8" fill="#F44336" />
          <motion.text
            x={start.x}
            y={start.y}
            fill="white"
            fontSize="10"
            textAnchor="middle"
            dy=".3em"
          >
            {number}
          </motion.text>
        </motion.g>
      ))}
    </g>
  );
};

export default MicroGridOptimizer;
