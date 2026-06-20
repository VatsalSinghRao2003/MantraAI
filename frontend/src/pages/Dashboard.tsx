import StatsCards from "../components/StatsCards";
import CategoryPieChart from "../components/CategoryPieChart";
import ModelsCard
from "../components/ModelsCard";
import AIStatusCard
from "../components/AIStatusCard";
import RecentActivity from "../components/RecentActivity";

export default function Dashboard() {
  return (
    <div>
      <h1>📊 Dashboard</h1>
	<AIStatusCard />
<ModelsCard />
<StatsCards />

<CategoryPieChart />

<RecentActivity />
    </div>
  );
}
