import i18next from "i18next";
import {
  BadgeCheck,
  ChevronsUpDown,
  Languages,
  LogOut,
  Sparkles,
} from "lucide-react";
import React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router";
import { useLogout } from "~/hooks/mutation/use-logout";
import { useAvatarAlt } from "~/hooks/use-avatar-alt";
import { Locale } from "~/locale/declaration";
import { SupportedLanguages } from "~/locale/i18n";
import { Avatar, AvatarFallback, AvatarImage } from "~ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "~ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~ui/sidebar";
export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar: string;
  };
}) {
  const { t } = useTranslation();
  const { mutate: logout } = useLogout();
  const { isMobile } = useSidebar();
  const [currentLanguage, setCurrentLanguage] = useState("");

  const avatarAlt = useAvatarAlt(user.name);

  React.useEffect(() => {
    setCurrentLanguage(i18next.language);
  }, [i18next.language]);

  const handleLanguageChange = (language: string) => {
    if (language.trim() === "") return;
    setCurrentLanguage(language);
    i18next.changeLanguage(language);
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user.avatar} alt={user.name} />
                <AvatarFallback className="rounded-lg">
                  {avatarAlt}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg">
                    {avatarAlt}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Sparkles />
                Upgrade to Pro
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <NavLink to="/account">
                <DropdownMenuItem>
                  <BadgeCheck />
                  {t(Locale.Nav$Account)}
                </DropdownMenuItem>
              </NavLink>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <Languages />
                  {t(Locale.Text$Language)}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    value={currentLanguage}
                    onValueChange={handleLanguageChange}
                  >
                    {SupportedLanguages.map((lang) => (
                      <DropdownMenuRadioItem
                        value={lang.value}
                        key={lang.value}
                      >
                        {lang.label}
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()}>
              <LogOut />
              {t(Locale.Text$Logout)}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
