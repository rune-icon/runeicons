"use client"
import { Input } from "../ui/input";
import { Search as SearchIcon, Heart, Star, Settings, Bell, User, Home, Package, Zap, Lock, Share2, Trash2, Edit, Eye, Copy, Check, X, Download, Upload, Menu, Calendar, Mail, Phone, Map, Clock } from "lucide-react";
import TabBackgroundAnimation from "../pixel-perfect/tab-background-animation";

const ICONS = [
  SearchIcon, Heart, Star, Settings,
  Bell, User, Home, Package,
  Zap, Lock, Share2, Trash2,
  Edit, Eye, Copy, Check,
  X, Download, Upload, Menu, Calendar, Mail, Phone, Map
];

const Search = () => {
  return (
    <div className="h-screen grid grid-cols-2 gap-5 py-6">
      <div className="h-full flex justify-end">
        <div
          className="relative w-full rounded-2xl overflow-hidden bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1964&auto=format&fit=crop')",
          }}
        >
          {/* Dark gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
          {/* Text on top of image */}
          <div className="relative h-full flex flex-col justify-end gap-4 p-10">
            <div className="w-86.5 text-5xl font-medium text-white">
              <span>Search & </span>
              <span className="text-blue-400">Discover Icons</span>
            </div>
            <div className="text-xl leading-6 text-white/80">
              Quickly find the perfect icon using smart search <br /> filters,
              and organized categories.
            </div>
          </div>
        </div>
      </div>
      <div>
        <div
          className=" h-full w-full bg-cover bg-center flex justify-center items-center rounded-2xl"
          style={{ backgroundImage: "url('https://i.pinimg.com/1200x/6c/68/41/6c684112e642bae6412135eaf83892c9.jpg')" }}
        >
          <div className="w-md flex flex-col gap-2">
            <div className="bg-background p-4 rounded-3xl">
              <div className="relative flex items-center">
                <SearchIcon className="absolute left-3 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search for icons..."
                  className="pl-10 pr-24 h-11 bg-secondary/20 border-muted rounded-xl"
                />
                <button className="absolute right-1.5 bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium transition-colors">
                  Search
                </button>
              </div>
              <div className="grid grid-cols-4 gap-4 my-4 mt-6">
                {ICONS.map((Icon, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <Icon className="w-6 h-6" />
                    <span className="text-xs">{Icon.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <TabBackgroundAnimation />
            <div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
