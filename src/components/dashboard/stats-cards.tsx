'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MiniChart, TrendIndicator } from '@/components/ui/chart'
import { Eye, BarChart3, TrendingUp, Search, ArrowUpRight, ArrowDownRight } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  subtitle: string
  trend?: number
  trendLabel?: string
  chartData?: number[]
  icon: React.ComponentType<any>
  chartColor?: string
}

function StatsCard({ 
  title, 
  value, 
  subtitle, 
  trend, 
  trendLabel,
  chartData, 
  icon: Icon,
  chartColor = '#3b82f6'
}: StatsCardProps) {
  const isPositiveTrend = trend && trend > 0
  const isNegativeTrend = trend && trend < 0

  return (
    <Card className="relative overflow-hidden border border-gray-200 bg-white hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-2xl font-bold text-gray-900">{value}</div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-xs text-gray-500">{subtitle}</p>
              {trend !== undefined && (
                <div className="flex items-center gap-1">
                  {isPositiveTrend && <ArrowUpRight className="h-3 w-3 text-green-500" />}
                  {isNegativeTrend && <ArrowDownRight className="h-3 w-3 text-red-500" />}
                  <span className={`text-xs font-medium ${
                    isPositiveTrend ? 'text-green-600' : 
                    isNegativeTrend ? 'text-red-600' : 
                    'text-gray-500'
                  }`}>
                    {Math.abs(trend)}{trendLabel || '%'}
                  </span>
                </div>
              )}
            </div>
          </div>
          {chartData && chartData.length > 0 && (
            <div className="w-20 h-10">
              <MiniChart data={chartData} color={chartColor} height={40} />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards() {
  // Sample data that would come from your API
  const visibilityData = [45, 52, 48, 61, 65, 68, 64, 70, 68, 72, 75, 68]
  const trafficData = [8500, 9200, 8800, 9800, 10100, 10234, 9900, 10400, 10100, 10500, 10234]
  const positionData = [35, 34, 32, 31, 33, 32, 30, 31, 32, 33, 32.64]
  const serpData = [280, 295, 310, 325, 330, 338, 342, 345, 340, 338]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <StatsCard
        title="VISIBILITY"
        value="68%"
        subtitle="+1.34"
        trend={1.34}
        chartData={visibilityData}
        icon={Eye}
        chartColor="#3b82f6"
      />
      <StatsCard
        title="TRAFFIC"
        value="10,234"
        subtitle="+126"
        trend={2.1}
        chartData={trafficData}
        icon={BarChart3}
        chartColor="#10b981"
      />
      <StatsCard
        title="AVERAGE POSITION"
        value="32.64"
        subtitle="+2.65"
        trend={-2.65}
        chartData={positionData}
        icon={TrendingUp}
        chartColor="#f59e0b"
      />
      <StatsCard
        title="SERP FEATURES"
        value="338"
        subtitle="+90"
        trend={26.6}
        chartData={serpData}
        icon={Search}
        chartColor="#8b5cf6"
      />
    </div>
  )
}