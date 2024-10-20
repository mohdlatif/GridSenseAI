import React, { useState } from "react";
import { motion } from "framer-motion";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";

const MicroGridOptimizer = () => {
  const [flowSpeed, setFlowSpeed] = useState(2); // Default flow speed in seconds
  const [minNumber, setMinNumber] = useState(0.1);
  const [maxNumber, setMaxNumber] = useState(1);
  const [batchSize, setBatchSize] = useState(3); // Default batch size

  const appliances = [
    { name: "Solar Panel", x: 150, y: 100, color: "#FFA000", icon: "☀️" },
    { name: "Wind Turbine", x: 700, y: 50, color: "#0277BD", icon: "🌬️" },
    { name: "House", x: 260, y: 400, color: "#795548", icon: "🏠" },
    { name: "Fan", x: 625, y: 400, color: "#673AB7", icon: "🏛️" },
    { name: "Community Center", x: 675, y: 280, color: "#673AB7", icon: "🏛️" },
  ];

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
          <div>
            <Label htmlFor="minNumber">
              Min Number: {minNumber.toFixed(1)}
            </Label>
            <Slider
              id="minNumber"
              min={0.1}
              max={0.9}
              step={0.1}
              value={[minNumber]}
              onValueChange={(value) => setMinNumber(value[0])}
            />
          </div>
          <div>
            <Label htmlFor="maxNumber">
              Max Number: {maxNumber.toFixed(1)}
            </Label>
            <Slider
              id="maxNumber"
              min={0.2}
              max={1}
              step={0.1}
              value={[maxNumber]}
              onValueChange={(value) => setMaxNumber(value[0])}
            />
          </div>
        </div>
        <svg
          viewBox="0 0 800 600"
          className="w-full h-auto border border-gray-300 rounded"
        >
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
                minNumber={minNumber}
                maxNumber={maxNumber}
              />
            </React.Fragment>
          ))}
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
        </svg>
      </div>
    </div>
  );
};
interface Point {
  x: number;
  y: number;
}

const AnimatedConnection = ({
  start,
  end,
  flowSpeed,
  batchSize,
  minNumber,
  maxNumber,
}: {
  start: Point;
  end: Point;
  flowSpeed: number;
  batchSize: number;
  minNumber: number;
  maxNumber: number;
}) => {
  const generateNumber = () =>
    (Math.random() * (maxNumber - minNumber) + minNumber).toFixed(2);
  const numbers = Array.from({ length: batchSize }, generateNumber);

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

export default function Component() {
  return <MicroGridOptimizer />;
}
