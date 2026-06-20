import { useEffect, useState } from "react";
import { getCategories } from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend
} from "recharts";

export default function CategoryPieChart() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    const categories = await getCategories();

    const chartData = Object.entries(categories).map(
      ([name, value]) => ({
        name,
        value,
      })
    );

    setData(chartData);
  };

  const colors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#00C49F",
  ];

  return (
    <div>
      <h2>Category Analytics</h2>

      <PieChart width={500} height={300}>
        <Pie
          data={data}
          dataKey="value"
          nameKey="name"
          outerRadius={100}
          label
        >
          {data.map((_, index) => (
            <Cell
              key={index}
              fill={
                colors[index % colors.length]
              }
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}