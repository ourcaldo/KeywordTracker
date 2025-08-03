'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Download, 
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Minus
} from 'lucide-react'

interface KeywordData {
  keyword: string
  position: number
  positionChange: number
  volume: number
  difficulty: number
  traffic: number
  trafficChange: number
  serp: string
  url: string
  location: string
  lastUpdate: string
}

function TrendIcon({ change }: { change: number }) {
  if (change > 0) return <ArrowUpRight className="h-3 w-3 text-green-500" />
  if (change < 0) return <ArrowDownRight className="h-3 w-3 text-red-500" />
  return <Minus className="h-3 w-3 text-gray-400" />
}

function PositionBadge({ position }: { position: number }) {
  let variant: "default" | "secondary" | "destructive" | "success" | "warning" = "default"
  
  if (position <= 3) variant = "success"
  else if (position <= 10) variant = "warning" 
  else if (position <= 20) variant = "secondary"
  else variant = "destructive"

  return <Badge variant={variant}>{position}</Badge>
}

export function KeywordTable() {
  const [searchTerm, setSearchTerm] = useState('')
  
  // Sample data that would come from your API
  const keywordData: KeywordData[] = [
    {
      keyword: "tesla",
      position: 3,
      positionChange: 1,
      volume: 340,
      difficulty: 25,
      traffic: 23,
      trafficChange: 12,
      serp: "SERP >",
      url: "/products/",
      location: "United States (EN)",
      lastUpdate: "7 Sep"
    },
    {
      keyword: "electric car",
      position: 2,
      positionChange: -1,
      volume: 1334,
      difficulty: 23,
      traffic: 12,
      trafficChange: -1,
      serp: "SERP >", 
      url: "/products/model3",
      location: "United States (EN)",
      lastUpdate: "7 Sep"
    },
    {
      keyword: "cybertruck",
      position: 3,
      positionChange: 2,
      volume: 453,
      difficulty: 6,
      traffic: 4,
      trafficChange: 31,
      serp: "SERP >",
      url: "/products/cybertruck",
      location: "United States (EN)", 
      lastUpdate: "7 Sep"
    },
    {
      keyword: "model s",
      position: 3,
      positionChange: 2,
      volume: 1349,
      difficulty: 4,
      traffic: 23,
      trafficChange: 13,
      serp: "SERP >",
      url: "/products/model-s",
      location: "United States (EN)",
      lastUpdate: "7 Sep"
    },
    {
      keyword: "model x", 
      position: 2,
      positionChange: -1,
      volume: 54,
      difficulty: 32,
      traffic: 7,
      trafficChange: 16,
      serp: "SERP >",
      url: "/products/model-x",
      location: "United States (EN)",
      lastUpdate: "7 Sep"
    },
    {
      keyword: "roadster",
      position: 1,
      positionChange: -1,
      volume: 2320,
      difficulty: 12,
      traffic: 2,
      trafficChange: 12,
      serp: "SERP >",
      url: "/products/roadster", 
      location: "United States (EN)",
      lastUpdate: "7 Sep"
    },
    {
      keyword: "tesla car",
      position: 2,
      positionChange: -1,
      volume: 346,
      difficulty: 54,
      traffic: 4,
      trafficChange: 15,
      serp: "SERP >",
      url: "/products/",
      location: "United States (EN)",
      lastUpdate: "7 Sep"
    }
  ]

  const filteredData = keywordData.filter(item =>
    item.keyword.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Card className="border border-gray-200 bg-white">
      <CardHeader className="border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Tesla.com
            </CardTitle>
            <div className="text-sm text-gray-500">
              Last full update: 3 seconds ago
            </div>
            <Button variant="outline" size="sm">
              🔄 Refresh
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export All
            </Button>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Keywords
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="top100" className="mt-4">
          <TabsList className="grid grid-cols-6 w-fit">
            <TabsTrigger value="top100">Top 100</TabsTrigger>
            <TabsTrigger value="top50">Top 50</TabsTrigger>
            <TabsTrigger value="top20">Top 20</TabsTrigger>
            <TabsTrigger value="top10">Top 10</TabsTrigger>
            <TabsTrigger value="top5">Top 5</TabsTrigger>
            <TabsTrigger value="top3">Top 3</TabsTrigger>
          </TabsList>
          
          <TabsContent value="top100" className="mt-4">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-12">
                  <input type="checkbox" className="rounded" />
                </TableHead>
                <TableHead>KEYWORD</TableHead>
                <TableHead>POSITION</TableHead>
                <TableHead>1D</TableHead>
                <TableHead>7D</TableHead>
                <TableHead>30D</TableHead>
                <TableHead>VOLUME</TableHead>
                <TableHead>TRAFFIC</TableHead>
                <TableHead>KD</TableHead>
                <TableHead>SERP</TableHead>
                <TableHead>URL</TableHead>
                <TableHead>LOCATION</TableHead>
                <TableHead>UPDATE</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((item, index) => (
                <TableRow key={index} className="hover:bg-gray-50 transition-colors">
                  <TableCell>
                    <input type="checkbox" className="rounded" />
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer font-medium">
                      {item.keyword}
                    </span>
                  </TableCell>
                  <TableCell>
                    <PositionBadge position={item.position} />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendIcon change={item.positionChange} />
                      <span className={`text-sm ${
                        item.positionChange > 0 ? 'text-green-600' :
                        item.positionChange < 0 ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {item.positionChange > 0 ? '+' : ''}{item.positionChange}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendIcon change={item.positionChange} />
                      <span className="text-sm text-green-600">+1</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <TrendIcon change={1} />
                      <span className="text-sm text-green-600">+1</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">{item.volume.toLocaleString()}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-900">{item.traffic}</span>
                      <TrendIcon change={item.trafficChange} />
                      <span className={`text-xs ${
                        item.trafficChange > 0 ? 'text-green-600' :
                        item.trafficChange < 0 ? 'text-red-600' :
                        'text-gray-500'
                      }`}>
                        {item.trafficChange > 0 ? '+' : ''}{item.trafficChange}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-900">{item.difficulty}</span>
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm">
                      {item.serp}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-blue-600 hover:text-blue-800 cursor-pointer text-sm max-w-32 truncate block">
                      {item.url}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🇺🇸</span>
                      <span className="text-sm text-gray-700">{item.location}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm text-gray-500">{item.lastUpdate}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Pin keyword</DropdownMenuItem>
                        <DropdownMenuItem>Check row data</DropdownMenuItem>
                        <DropdownMenuItem>Refresh</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}