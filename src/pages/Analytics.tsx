import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navigation from "@/components/Navigation";
import StatsCard from "@/components/StatsCard";
import { BarChart3, TrendingUp, Calendar, Download, AlertTriangle, Users, Clock, MapPin } from "lucide-react";

const Analytics = () => {
  // Mock data for charts - in real app this would come from Chart.js integration
  const mockChartData = {
    issuesByCategory: [
      { category: "Infrastructure", count: 245, percentage: 35 },
      { category: "Utilities", count: 189, percentage: 27 },
      { category: "Public Safety", count: 124, percentage: 18 },
      { category: "Environment", count: 87, percentage: 12 },
      { category: "Other", count: 55, percentage: 8 },
    ],
    trendsData: [
      { month: "Jan", reported: 156, resolved: 134 },
      { month: "Feb", reported: 189, resolved: 167 },
      { month: "Mar", reported: 234, resolved: 201 },
      { month: "Apr", reported: 198, resolved: 187 },
      { month: "May", reported: 276, resolved: 249 },
      { month: "Jun", reported: 312, resolved: 298 },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
              <p className="text-lg text-muted-foreground">
                Data-driven insights for civic issue management and predictive analytics
              </p>
            </div>
            <div className="flex space-x-2">
              <Select defaultValue="30days">
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">Last 7 days</SelectItem>
                  <SelectItem value="30days">Last 30 days</SelectItem>
                  <SelectItem value="90days">Last 90 days</SelectItem>
                  <SelectItem value="1year">Last year</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Issue Resolution Rate"
            value="78.4%"
            change="+5.2%"
            trend="up"
            icon={TrendingUp}
          />
          <StatsCard
            title="Avg Resolution Time"
            value="3.2 days"
            change="-18%"
            trend="down"
            icon={Clock}
          />
          <StatsCard
            title="Citizen Satisfaction"
            value="4.3/5"
            change="+0.3"
            trend="up"
            icon={Users}
          />
          <StatsCard
            title="Predictive Accuracy"
            value="91.7%"
            change="+2.1%"
            trend="up"
            icon={BarChart3}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Issues by Category */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                <span>Issues by Category</span>
              </CardTitle>
              <CardDescription>Distribution of reported issues across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockChartData.issuesByCategory.map((item, index) => (
                  <div key={item.category} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ 
                          backgroundColor: `hsl(${217 + index * 30}, 91%, ${60 + index * 5}%)` 
                        }}
                      />
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-32 bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-muted-foreground w-8">{item.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trends */}
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Monthly Trends</span>
              </CardTitle>
              <CardDescription>Reported vs Resolved issues over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockChartData.trendsData.map((item, index) => (
                  <div key={item.month} className="flex items-center justify-between">
                    <span className="text-sm font-medium w-12">{item.month}</span>
                    <div className="flex-1 mx-4">
                      <div className="flex space-x-1">
                        <div className="flex-1 bg-muted rounded h-6 flex items-center relative">
                          <div 
                            className="bg-primary h-4 rounded mx-1 transition-all duration-300"
                            style={{ width: `${(item.reported / 350) * 100}%` }}
                          />
                          <span className="absolute left-2 text-xs text-white">
                            {item.reported}
                          </span>
                        </div>
                        <div className="flex-1 bg-muted rounded h-6 flex items-center relative">
                          <div 
                            className="bg-success h-4 rounded mx-1 transition-all duration-300"
                            style={{ width: `${(item.resolved / 350) * 100}%` }}
                          />
                          <span className="absolute left-2 text-xs text-white">
                            {item.resolved}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <div className="flex justify-center space-x-4 pt-4 border-t border-border">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-primary rounded" />
                    <span className="text-xs text-muted-foreground">Reported</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-success rounded" />
                    <span className="text-xs text-muted-foreground">Resolved</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Predictive Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Hotspot Prediction</CardTitle>
              <CardDescription>Areas likely to see increased issue reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-civic-urgent/10 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Downtown District</p>
                    <p className="text-xs text-muted-foreground">Infrastructure issues expected</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-civic-urgent">High Risk</p>
                    <p className="text-xs text-muted-foreground">87% confidence</p>
                  </div>
                </div>
                
                <div className="flex justify-between items-center p-3 bg-civic-high/10 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Park Avenue</p>
                    <p className="text-xs text-muted-foreground">Utility maintenance needed</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-civic-high">Medium Risk</p>
                    <p className="text-xs text-muted-foreground">72% confidence</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>Resource Allocation</CardTitle>
              <CardDescription>Recommended department resource distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Public Works</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-4/5" />
                    </div>
                    <span className="text-sm font-medium">80%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Utilities</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-3/5" />
                    </div>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Safety</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full w-2/5" />
                    </div>
                    <span className="text-sm font-medium">40%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border/50">
            <CardHeader>
              <CardTitle>AI Insights</CardTitle>
              <CardDescription>Machine learning predictions and recommendations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <p className="text-sm font-medium">Peak Reporting Hours</p>
                  <p className="text-xs text-muted-foreground">9-11 AM and 5-7 PM show highest activity</p>
                </div>
                
                <div className="p-3 bg-success/10 rounded-lg">
                  <p className="text-sm font-medium">Resolution Efficiency</p>
                  <p className="text-xs text-muted-foreground">Infrastructure issues resolve 23% faster on weekdays</p>
                </div>
                
                <div className="p-3 bg-warning/10 rounded-lg">
                  <p className="text-sm font-medium">Seasonal Pattern</p>
                  <p className="text-xs text-muted-foreground">Weather-related reports increase by 45% in winter</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NLP Analysis Results */}
        <Card className="bg-gradient-card border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-primary" />
              <span>NLP Sentiment & Urgency Analysis</span>
            </CardTitle>
            <CardDescription>
              Natural language processing results from citizen reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-success mb-2">72%</div>
                <div className="text-sm text-muted-foreground">Positive Sentiment</div>
                <div className="text-xs text-muted-foreground mt-1">Citizens satisfied with response times</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-warning mb-2">18%</div>
                <div className="text-sm text-muted-foreground">Neutral Sentiment</div>
                <div className="text-xs text-muted-foreground mt-1">Factual reporting without emotion</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-destructive mb-2">10%</div>
                <div className="text-sm text-muted-foreground">Negative Sentiment</div>
                <div className="text-xs text-muted-foreground mt-1">Frustrated with delayed responses</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-medium mb-2">Common Keywords (This Week)</h4>
              <div className="flex flex-wrap gap-2">
                {["pothole", "streetlight", "traffic", "noise", "construction", "safety", "urgent", "dangerous"].map((keyword) => (
                  <span key={keyword} className="px-2 py-1 bg-primary/20 text-primary text-xs rounded">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;