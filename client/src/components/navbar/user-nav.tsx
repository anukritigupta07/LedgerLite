import { ChevronDown, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function UserNav({
  userName,
  profilePicture,
  onLogout,
}: {
  userName: string;
  profilePicture: string;
  onLogout: () => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative !bg-transparent h-10 w-10 rounded-full !gap-0"
        >
          <Avatar className="h-10 w-10 !cursor-pointer">
            <AvatarImage src={profilePicture || ""} className="!cursor-pointer" />
            <AvatarFallback
              className="!bg-[#002B4C] !text-white border !border-gray-300"
            >
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="!w-3 !h-3 ml-1 text-[#14A0C4]" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-56 !bg-[#002B4C] !text-white !border !border-[#002B4C]"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex flex-col items-start gap-1">
          <span className="font-semibold">{userName}</span>
          <span className="text-[13px] text-gray-300 font-light"></span>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="!bg-gray-400" />

        <DropdownMenuGroup>
          <DropdownMenuItem
            className="hover:!bg-[#14A0C4] hover:!text-white flex items-center gap-2"
            onClick={onLogout}
          >
            <LogOut className="w-4 h-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
