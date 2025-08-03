'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface ChartProps {
  data: number[]
  className?: string
  color?: string
  height?: number
}

export function MiniChart({ data, className, color = '#3b82f6', height = 40 }: ChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className={cn("flex items-center justify-center", className)} style={{ height }}>
        <div className="text-xs text-muted-foreground">No data</div>
      </div>
    )
  }

  const max = Math.max(...data)
  const min = Math.min(...data)
  const range = max - min || 1

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100
    const y = 100 - ((value - min) / range) * 100
    return `${x},${y}`
  }).join(' ')

  return (
    <div className={cn("relative", className)} style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        className="absolute inset-0"
      >
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          points={points}
          vectorEffect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id={`gradient-${color.replace('#', '')}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" style={{ stopColor: color, stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: color, stopOpacity: 0 }} />
          </linearGradient>
        </defs>
        <polygon
          fill={`url(#gradient-${color.replace('#', '')})`}
          points={`0,100 ${points} 100,100`}
        />
      </svg>
    </div>
  )
}

export function TrendIndicator({ value, className }: { value: number; className?: string }) {
  const isPositive = value > 0
  const isNegative = value < 0
  
  return (
    <span className={cn(
      "inline-flex items-center text-xs font-medium",
      isPositive && "text-green-600",
      isNegative && "text-red-600",
      !isPositive && !isNegative && "text-gray-500",
      className
    )}>
      {isPositive && "↗"}
      {isNegative && "↘"}
      {Math.abs(value)}{value !== 0 && "%"}
    </span>
  )
}