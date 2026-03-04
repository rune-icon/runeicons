"use client"
import { Input } from "../ui/input";
import { Search as SearchIcon, Heart, Star, Settings, Bell, User, Home, Package, Zap, Lock, Share2, Trash2, Edit, Eye, Copy, Check, X, Download, Upload, Menu, Calendar, Mail, Phone, Map, Clock } from "lucide-react";
import TabBackgroundAnimation from "../pixel-perfect/tab-background-animation";
import { Button } from "../ui/button";

const ICONS = [
  { Icon: SearchIcon, name: "Search" },
  { Icon: Heart, name: "Heart" },
  { Icon: Star, name: "Star" },
  { Icon: Settings, name: "Settings" },
  { Icon: Bell, name: "Bell" },
  { Icon: User, name: "User" },
  { Icon: Home, name: "Home" },
  { Icon: Package, name: "Package" },
  { Icon: Zap, name: "Zap" },
  { Icon: Lock, name: "Lock" },
  { Icon: Share2, name: "Share" },
  { Icon: Trash2, name: "Trash" },
  { Icon: Edit, name: "Edit" },
  { Icon: Eye, name: "Eye" },
  { Icon: Copy, name: "Copy" },
  { Icon: Check, name: "Check" },
  { Icon: X, name: "Close" },
  { Icon: Download, name: "Download" },
  { Icon: Upload, name: "Upload" },
  { Icon: Menu, name: "Menu" },
  { Icon: Calendar, name: "Calendar" },
  { Icon: Mail, name: "Mail" },
  { Icon: Phone, name: "Phone" },
  { Icon: Map, name: "Map" },
];

const Search = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row gap-5 py-6">
      {/* Left - Hero text card */}
      <div className="lg:w-1/2 min-h-[400px] lg:min-h-0">
        <div
          className="relative w-full h-full rounded-2xl overflow-hidden bg-cover bg-center min-h-[400px]"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')",
          }}
        >
          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {/* Text content */}
          <div className="relative h-full flex flex-col justify-end gap-4 p-8 md:p-10">
            <h2 className="text-4xl md:text-5xl font-medium text-white leading-tight">
              <span>Search & </span>
              <br />
              <span className="text-blue-400">Discover Icons</span>
            </h2>
            <p className=" text-sm text-muted-foreground sm:text-base leading-relaxed max-w-md">
              Quickly find the perfect icon using smart search, filters,
              and organized categories.
            </p>
          </div>
        </div>
      </div>

      {/* Right - Search panel */}
      <div className="lg:w-1/2">
        <div
          className="h-full w-full bg-cover bg-center flex items-center justify-center rounded-2xl p-6 md:p-10"
          style={{ backgroundImage: "url('https://i.pinimg.com/1200x/6c/68/41/6c684112e642bae6412135eaf83892c9.jpg')" }}
        >
          <div className="w-full max-w-md flex flex-col gap-3">
            {/* Search bar */}
            <div className="bg-background p-4 rounded-3xl shadow-lg">
              <div className="relative flex items-center">
                <SearchIcon className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search for icons..."
                  className="pl-10 pr-24 h-11 bg-secondary/20 border-muted rounded-xl"
                />
                <Button className="absolute right-1.5 bg-blue-600 hover:bg-blue-700 text-white">
                  Search
                </Button>
              </div>

              {/* Icons grid - flexible wrapping */}
              <div className="flex flex-wrap gap-3 justify-center my-4 mt-6">
                {ICONS.map(({ Icon, name }, index) => (
                  <div key={index} className={`flex flex-col items-center gap-1 w-14 ${index >= 9 ? "hidden sm:flex" : ""}`}>
                    <div className="w-10 h-10 rounded-lg bg-muted/50 hover:bg-muted flex items-center justify-center transition-colors cursor-pointer">
                      <Icon className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="text-[10px] text-muted-foreground truncate w-full text-center">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab selector */}
            <TabBackgroundAnimation />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
