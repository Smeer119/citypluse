import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, BarChart3, UserPlus, LogIn, MapPin, TrendingUp, Users, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-city.jpg";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Landing Page */}
      <section className="relative overflow-hidden min-h-screen flex items-center justify-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 to-background/70" />
        
        <div className="relative container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            {/* Logo & Badge */}
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="w-16 h-16 bg-gradient-hero rounded-2xl flex items-center justify-center shadow-glow">
                <AlertTriangle className="w-8 h-8 text-white" />
              </div>
              <div className="px-4 py-2 bg-primary/20 rounded-full border border-primary/30">
                <span className="text-sm font-medium text-primary">Hack Fest 2025 - Team Jarvis</span>
              </div>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-6xl md:text-7xl font-bold text-foreground mb-6">
              <span className="text-transparent bg-clip-text bg-gradient-hero">CityPulse</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-4 leading-relaxed">
              Real-time Civic Issue Dashboard
            </p>
            <p className="text-lg text-muted-foreground/80 mb-12 max-w-2xl mx-auto">
              Monitor, report, and resolve community issues with AI-powered insights, 
              smart prioritization, and predictive analytics for better city management.
            </p>
            
            {/* Two Main Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto mb-16">
              {/* Dashboard Option */}
              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-500 group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-hero rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-4 text-foreground">Live Dashboard</CardTitle>
                  <CardDescription className="text-muted-foreground mb-6 text-base">
                    View real-time issues, interactive maps, and city statistics. 
                    No login required - open access to community data.
                  </CardDescription>
                  <Button size="lg" className="bg-gradient-hero hover:opacity-90 text-white shadow-glow w-full" asChild>
                    <Link to="/dashboard">
                      <MapPin className="w-5 h-5 mr-2" />
                      View Dashboard
                    </Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Sign In/Sign Up Option */}
              <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-500 group cursor-pointer">
                <CardContent className="p-8 text-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-glow group-hover:scale-110 transition-transform duration-300">
                    <UserPlus className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl mb-4 text-foreground">Join the Community</CardTitle>
                  <CardDescription className="text-muted-foreground mb-6 text-base">
                    Sign up to report issues, track your submissions, and help make your city better. 
                    For citizens and city administrators.
                  </CardDescription>
                  <div className="space-y-3">
                    <Button size="lg" variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                    
                      <Link to="/SignUp">
                       <UserPlus className="w-5 h-5 mr-2">
                      Sign Up
                    </Link>
                     
                    </Button>
                    <Button size="lg" variant="ghost" className="w-full hover:bg-secondary">
                      <Link to="/SignIp">
                      <LogIn className="w-5 h-5 mr-2" />
                      Sign In
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto opacity-80">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">1,247</div>
                <div className="text-sm text-muted-foreground">Active Issues</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-success">89</div>
                <div className="text-sm text-muted-foreground">Resolved Today</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">15K+</div>
                <div className="text-sm text-muted-foreground">Citizens</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-warning">2.4hrs</div>
                <div className="text-sm text-muted-foreground">Avg Response</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">
            Powered by AI & Real-time Data
          </h2>
          <p className="text-xl text-center text-muted-foreground mb-16 max-w-3xl mx-auto">
            Advanced technology stack with NLP processing, predictive analytics, and interactive visualizations
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-success to-success/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Smart Prioritization</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  AI-powered NLP analysis automatically prioritizes issues based on urgency, 
                  impact, and community sentiment using spaCy and natural language processing.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Interactive Maps</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Visual hotspot mapping with Leaflet.js integration, OpenStreetMap data, 
                  and real-time heatmaps showing issue density and patterns across the city.
                </CardDescription>
              </CardHeader>
            </Card>
            
            <Card className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
              <CardHeader className="text-center pb-4">
                <div className="w-16 h-16 bg-gradient-to-br from-warning to-warning/70 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl">Predictive Analytics</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  Advanced data visualization with Chart.js, Twitter/X API integration, 
                  and predictive modeling to forecast trends and optimize resource allocation.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;