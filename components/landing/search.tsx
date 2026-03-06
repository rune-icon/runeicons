"use client";
import {
  Bell,
  Calendar,
  Check,
  Clock,
  Copy,
  Download,
  Edit,
  Eye,
  Heart,
  Home,
  Lock,
  Mail,
  Map,
  Menu,
  Package,
  Phone,
  Search as SearchIcon,
  Settings,
  Share2,
  Star,
  Trash2,
  Upload,
  User,
  X,
  Zap,
} from "lucide-react";

import TabBackgroundAnimation from "../pixel-perfect/tab-background-animation";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

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
    <div className="flex min-h-screen flex-col gap-5 py-6 lg:flex-row">
      {/* Left - Hero text card */}
      <div className="min-h-[400px] lg:min-h-0 lg:w-1/2">
        <div className="bg-background relative h-full min-h-[400px] w-full overflow-hidden rounded-2xl bg-center">
          <img
            className="h-full w-full object-cover"
            src="
          https://i.pinimg.com/1200x/d3/49/0e/d3490eaa1637583dca52fe021fa38d19.jpg"
            alt=""
          />
        </div>
      </div>

      {/* Right - Search panel */}
      <div className="lg:w-1/2">
        <div
          className="flex h-full w-full items-center justify-center rounded-2xl bg-cover bg-center p-6 md:p-10"
          style={{
            backgroundImage: "url('/landing/search-gradient2.png')",
          }}
        >
          <div className="w-full max-w-md">
            <div className="bg-background/20 border-border/50 rounded-3xl border p-4 shadow-lg backdrop-blur-[2px]">
              <div className="border-input bg-background/80 focus-within:ring-ring/50 flex h-11 items-center overflow-hidden rounded-xl border focus-within:ring-2">
                <div className="text-muted-foreground flex h-full items-center px-3 dark:text-white/80">
                  <SearchIcon className="h-4 w-4" />
                </div>
                <Input
                  placeholder="Search for icons..."
                  className="text-foreground placeholder:text-muted-foreground h-full flex-1 border-0 bg-transparent pl-2 shadow-none focus-visible:ring-0 dark:text-white dark:placeholder:text-white/70"
                />
                <Button className="h-full rounded-none bg-white px-4 text-black hover:bg-white/90 dark:bg-zinc-900 dark:text-white dark:hover:bg-zinc-800">
                  Search
                </Button>
              </div>

              {/* Icons grid - flexible wrapping */}
              <div className="my-4 mt-6 flex flex-wrap justify-center gap-3">
                {ICONS.map(({ Icon, name }, index) => (
                  <div
                    key={index}
                    className={`flex w-14 flex-col items-center gap-1 ${index >= 9 ? "hidden sm:flex" : ""}`}
                  >
                    <div className="bg-muted/50 hover:bg-muted flex h-10 w-10 cursor-pointer items-center justify-center rounded-lg transition-colors">
                      <Icon className="text-foreground h-5 w-5" />
                    </div>
                    <span className="w-full truncate text-center text-[10px] text-white/85">
                      {name}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-border/40 mt-4 border-t pt-4">
                <TabBackgroundAnimation />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
