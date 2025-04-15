
// import { useAccount } from "wagmi";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { GetCreditUsageInPeriod } from "@/actions/analytics/getCreditUsageInperiod";
import { GetPeriods } from "@/actions/analytics/getPeriods";
import { GetStatsCardsValues } from "@/actions/analytics/getStatsCardsValues";
import { GetWorkflowExecutionStats } from "@/actions/analytics/getWorkflowExecutionStats";
import { Skeleton } from "@/components/ui/skeleton";
import PeriodSelector from "./_components/PeriodSelector";
import StatsCard from "./_components/StatsCard";
import ExecutionStatusChart from "./_components/ExecutionStatusChart";
import CreditUsageChart from "./_components/CreditUsageChart";
import { Period } from "@/types/analytics";
import { CirclePlayIcon, CoinsIcon, WaypointsIcon } from "lucide-react";
import { cookies } from "next/headers";

export default function HomePageWrapper({ searchParams }: { searchParams: { month?: string; year?: string } }) {
  // const { isConnected } = useAccount();
  const address = cookies().get('walletAddress')?.value;

  if (!address) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen  p-10 border-4 border-black shadow-[8px_8px_0px_black] text-black">
        <div className="max-w-3xl text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-extrabold border-4 border-black px-6 py-4 shadow-[4px_4px_0px_black] bg-[#ff6347] inline-block rotate-[-2deg]">
            Welcome to Tawzi 🚀
          </h1>
          <p className="text-lg bg-[#ffff00] border-4 border-black shadow-[4px_4px_0px_black] px-6 py-4 rotate-1 skew-y-1">
            A visual-first playground for AI-powered Web3 workflows. No code. Just vibes.
          </p>

          <p className="text-sm bg-white border-4 border-black shadow-[4px_4px_0px_black] px-6 py-4 -rotate-1 skew-y-1">
            ⚠️ Heads up: this site is under active construction. Things may break, explode, or time travel. You’ve been warned.
          </p>

          <div className="flex justify-center mt-10">
            <div className="flex items-center gap-2 px-6 py-3 bg-[#facc15] text-black border-4 border-black shadow-[4px_4px_0px_black] animate-bounce cursor-pointer">
              <ArrowLeft className="w-5 h-5 stroke-black" />
              <span className="font-bold">Connect your wallet to get started</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <HomePage searchParams={searchParams} />;
}

async function HomePage({ searchParams }: { searchParams: { month?: string; year?: string } }) {
  const currentDate = new Date();
  const { month, year } = searchParams;
  const period: Period = {
    month: month ? parseInt(month) : currentDate.getMonth(),
    year: year ? parseInt(year) : currentDate.getFullYear(),
  };

  let periods: Period[] = [];
  try {
    periods = await GetPeriods();
  } catch (error) {
    periods = [{ month: currentDate.getMonth(), year: currentDate.getFullYear() }];
  }

  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Home</h1>
        <PeriodSelector selectedPeriod={period} periods={periods} />
      </div>

      <div className="h-full py-6 flex flex-col gap-8">
        <Suspense fallback={<StatsCardSkeleton />}>
          <StatsCards selectedPeriod={period} />
        </Suspense>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Suspense fallback={<Skeleton className="w-full h-[300px] dark:bg-yellow-500/20" />}>
            <ExecutionStatusWrapper selectedPeriod={period} />
          </Suspense>
          <Suspense fallback={<Skeleton className="w-full h-[300px] dark:bg-yellow-500/20" />}>
            <CreditUsageWrapper selectedPeriod={period} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

async function StatsCards({ selectedPeriod }: { selectedPeriod: Period }) {
  const stats = await GetStatsCardsValues(selectedPeriod);
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <StatsCard title="Total Executions" value={stats.totalExecutions} subtitle="Total workflow executions this month" icon={CirclePlayIcon} className="dark:border-[#facc15] dark:text-[#facc15] dark:shadow-[4px_4px_0px_#facc15]" />
      <StatsCard title="Total Workflows" value={stats.totalWorkflows} subtitle="Total workflows created" icon={WaypointsIcon} className="dark:border-[#facc15] dark:text-[#facc15] dark:shadow-[4px_4px_0px_#facc15]" />
      <StatsCard title="Credits Used" value={stats.creditsUsed} subtitle="Credits used this month" icon={CoinsIcon} className="dark:border-[#facc15] dark:text-[#facc15] dark:shadow-[4px_4px_0px_#facc15]" />
    </div>
  );
}

function StatsCardSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="w-full h-[120px] dark:bg-yellow-500/20" />
      ))}
    </div>
  );
}

async function ExecutionStatusWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const stats = await GetWorkflowExecutionStats(selectedPeriod);
  return <ExecutionStatusChart data={stats} />;
}

async function CreditUsageWrapper({ selectedPeriod }: { selectedPeriod: Period }) {
  const usage = await GetCreditUsageInPeriod(selectedPeriod);
  return <CreditUsageChart data={usage} />;
}
