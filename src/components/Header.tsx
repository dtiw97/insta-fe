import {
  User,
  SquarePlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 w-screen">
      <div className="max-w-lg mx-auto px-2">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              // className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 bg-clip-text text-transparent"
              className="text-2xl font-bold bg-gradient-to-r from-gray-400 via-gray-900 to-gray-400 bg-clip-text text-transparent"
            >
              portfolio
            </Link>
          </div>

          {/* Navigation Icons */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            {/* <Button variant="ghost" size="icon" className="h-10 w-10 relative">
              <Heart className="h-6 w-6" />
              Notification dot
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button> */}

            {/* Messages */}
            <Link to="/createPost">
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <SquarePlus className="h-4 w-4" />
              </Button>
            </Link>

            {/* Profile */}
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <User className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
