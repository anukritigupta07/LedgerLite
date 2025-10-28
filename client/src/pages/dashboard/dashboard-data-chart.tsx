import * as React from "react";
import { format } from "date-fns";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { useIsMobile } from "../../hooks/use-mobile";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "../../components/ui/chart";
import { EmptyState } from "../../components/empty-state";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { DateRangeType } from "../../components/date-range-select";
import { Skeleton } from "../../components/ui/skeleton";
import { formatCurrency } from "../../lib/format-currency";
import { useChartAnalyticsQuery } from "../../features/analytics/analyticsAPI";

interface PropsType {
  dateRange?: DateRangeType;
}

const COLORS = ["#14A0C4", "#FF4D4F"]; // Income: Aqua, Expenses: Red
const TRANSACTION_TYPES = ["income", "expenses"];

const chartConfig = {
  income: {
    label: "Income",
    color: COLORS[0],
  },
  expenses: {
    label: "Expenses",
    color: COLORS[1],
  },
} satisfies ChartConfig;

const DashboardDataChart: React.FC<PropsType> = ({ dateRange }) => {
  const isMobile = useIsMobile();

  const { data, isFetching } = useChartAnalyticsQuery({
    preset: dateRange?.value,
  });
  const chartData = data?.data?.chartData || [];
  const totalExpenseCount = data?.data?.totalExpenseCount || 0;
  const totalIncomeCount = data?.data?.totalIncomeCount || 0;

  if (isFetching) return <ChartSkeleton />;

  return (
    <Card className="!shadow-none border border-gray-200 !pt-0 bg-white">
      <CardHeader className="flex flex-col sm:flex-row items-stretch !space-y-0 border-b border-gray-200 !p-0 pr-1">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-0">
          <CardTitle className="text-lg text-[#002B4C]">Transaction Overview</CardTitle>
          <CardDescription className="text-[#333333]">
            <span>Showing total transactions {dateRange?.label}</span>
          </CardDescription>
        </div>
        <div className="flex">
          {TRANSACTION_TYPES.map((key) => {
            const chart = key as keyof typeof chartConfig;
            return (
              <div
                key={chart}
                className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l sm:border-l border-gray-200 sm:px-4 sm:py-6 min-w-36"
              >
                <span className="w-full block text-xs text-[#333333]">
                  No of {chartConfig[chart].label}
                </span>
                <span className="flex items-center justify-center gap-2 text-lg font-semibold leading-none sm:text-3xl">
                  {key === "income" ? (
                    <TrendingUpIcon className="size-3 ml-2 text-[#14A0C4]" />
                  ) : (
                    <TrendingDownIcon className="size-3 ml-2 text-[#FF4D4F]" />
                  )}
                  {key === "income" ? totalIncomeCount : totalExpenseCount}
                </span>
              </div>
            );
          })}
        </div>
      </CardHeader>

      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[300px]">
        {chartData.length === 0 ? (
          <EmptyState
            title="No transaction data"
            description="There are no transactions recorded for this period."
          />
        ) : (
          <ChartContainer config={chartConfig} className="aspect-auto h-[300px] w-full">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={1.0} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1} />
                </linearGradient>
                <linearGradient id="expensesGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[1]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[1]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={isMobile ? 20 : 25}
                tickFormatter={(value) =>
                  format(new Date(value), isMobile ? "MMM d" : "MMMM d, yyyy")
                }
              />
              <ChartTooltip
                cursor={{ stroke: "#94a3b8", strokeWidth: 1, strokeDasharray: "3 3" }}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => format(new Date(value), "MMM d, yyyy")}
                    indicator="line"
                    formatter={(value, name) => {
                      const isExpense = name === "expenses";
                      const color = isExpense ? COLORS[1] : COLORS[0];
                      return [
                        <span key={name} style={{ color }}>
                          {formatCurrency(Number(value), { showSign: true, compact: true, isExpense })}
                        </span>,
                        isExpense ? "Expenses" : "Income",
                      ];
                    }}
                  />
                }
              />
              <Area dataKey="expenses" stackId="1" type="step" fill="url(#expensesGradient)" stroke={COLORS[1]} className="drop-shadow-sm" />
              <Area dataKey="income" stackId="1" type="step" fill="url(#incomeGradient)" stroke={COLORS[0]} />
              <ChartLegend verticalAlign="bottom" content={<ChartLegendContent payload={undefined} />} />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

const ChartSkeleton = () => (
  <Card className="!shadow-none border border-gray-200 !pt-0 bg-white">
    <CardHeader className="flex flex-col sm:flex-row items-stretch !space-y-0 border-b border-gray-200 !p-0 pr-1">
      <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-2 sm:py-0">
        <Skeleton className="h-6 w-48 bg-gray-200" />
        <Skeleton className="h-4 w-32 mt-1 bg-gray-200" />
      </div>
      <div className="flex">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-1 flex-col justify-center gap-1 px-6 py-4 text-center even:border-l sm:border-l border-gray-200 sm:px-4 sm:py-6 min-w-36">
            <Skeleton className="h-4 w-20 mx-auto bg-gray-200" />
            <Skeleton className="h-8 w-24 mx-auto mt-1 sm:h-12 bg-gray-200" />
          </div>
        ))}
      </div>
    </CardHeader>
    <CardContent className="px-2 pt-2 sm:px-6 sm:pt-2 h-[280px]">
      <Skeleton className="h-full w-full bg-gray-200" />
    </CardContent>
  </Card>
);

export default DashboardDataChart;
