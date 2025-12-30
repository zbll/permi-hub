import {
  GalleryVerticalEnd,
  AudioWaveform,
  Command,
  SquareTerminal,
  Frame,
  PieChart,
  Map,
  IdCardLanyard,
} from "lucide-react";
import { useUserInfo } from "./query/use-user-info";
import { usePermission } from "@packages/hooks";
import { useUserPermissions } from "./query/use-user-permissions";
import { Permissions } from "@packages/types";
import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";

export function useSidebarData() {
  const { t } = useTranslation();
  const { isSuccess: userInfoSuccess, data: userInfo } = useUserInfo();
  const { isSuccess: userPermissionsSuccess, data: userPermissions } =
    useUserPermissions();
  const { checkPermissions } = usePermission();
  if (!userInfoSuccess) return null;
  const user = {
    name: userInfo.nickname,
    email: userInfo.email,
    avatar: "",
  };
  if (!userPermissionsSuccess) return null;

  const navMain = [];

  if (checkPermissions([Permissions.LoggerGet], userPermissions)) {
    navMain.push({
      title: t(Locale.Log$Nav$Name),
      url: "/log",
      icon: SquareTerminal,
      isActive: false,
    });
  }

  if (checkPermissions([Permissions.RoleGet], userPermissions)) {
    navMain.push({
      title: t(Locale.Role$Nav$Name),
      url: "/role",
      icon: IdCardLanyard,
      isActive: false,
    })
  }

  const teams = [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ];

  const projects = [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ];
  return {
    user,
    teams,
    navMain,
    projects,
  };
}
