import { useNavigate } from 'react-router-dom';
import { UserCircle2, LogOut, Users } from 'lucide-react';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getUser, logout } from '@/lib/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const user = getUser();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="mx-auto px-6 sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="flex h-16 items-center">
      <div className="mr-4 flex">
        <a href="/" className="flex items-center space-x-2">
          <Users className="h-8 w-8 text-purple-600" />
          <span className="text-xl bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            TALENTBRIDGE
          </span>
        </a>
      </div>
  
      <div className="flex flex-1 items-center justify-end space-x-2">
        {user ? (
          <>
            
            <div className="hidden md:flex items-center justify-end gap-1 py-4 ml-auto">
              <UserCircle2 className="h-5 w-5" />
              <span className="font-medium">{user?.name}</span>
              <Button variant="ghost" className="p-2 text-red-600" onClick={handleLogout}>
                Logout
                <LogOut className="h-5 w-5 ml-2" />
              </Button>
            </div>
  
            
            <div className="md:hidden">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-4">
                    <UserCircle2 className="h-5 w-5" />
                    <span className="font-medium">{user?.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem className="flex items-center gap-2 text-red-600" onClick={handleLogout}>
                    <LogOut className="h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        ) : (
          // Login button for users not logged in
          <Button className="ml-auto" onClick={()=>{navigate('/login')}}>
            Login
          </Button>
        )}
      </div>
    </div>
  </header>
  );
};

export default Navbar;