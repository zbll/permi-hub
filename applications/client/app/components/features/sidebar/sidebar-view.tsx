import { Link, Outlet } from "react-router";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "~/components/ui/breadcrumb";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "~/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { Separator } from "~/components/ui/separator";
import { useTranslation } from "react-i18next";
import { Fragment } from "react/jsx-runtime";
import { cn } from "~/lib/utils";
import { Moon, Sun } from "lucide-react";
import { useUserStore } from "~/stores/user-store";

export interface SidebarViewProps {
  match: any[];
}

export function SidebarView({ match }: SidebarViewProps) {
  const userStore = useUserStore();
  const { t } = useTranslation();

  const createI18nKey = (id: string) => {
    return `route.${id}.name`;
  };

  const list = match
    .filter((u) => u.id !== "routes/root-layout")
    .filter((u) => u.id !== "routes/home");

  const toggleTheme = () => {
    userStore.setTheme(userStore.theme === "light" ? "dark" : "light");
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-screen">
        <header className="flex h-16 shrink-0 justify-between items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="mr-2 data-[orientation=vertical]:h-4"
            />
            <Breadcrumb>
              <BreadcrumbList>
                {list.map((item, index) => (
                  <Fragment key={item.id}>
                    <BreadcrumbItem className="hidden md:block">
                      {index < list.length - 1 ? (
                        <Link to={item.pathname}>
                          {t(createI18nKey(item.id))}
                        </Link>
                      ) : (
                        <BreadcrumbPage>
                          {t(createI18nKey(item.id))}
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < list.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="px-4">
            {userStore.theme === "light" && (
              <Moon className="cursor-pointer" onClick={toggleTheme} />
            )}
            {userStore.theme === "dark" && (
              <Sun className="cursor-pointer" onClick={toggleTheme} />
            )}
          </div>
        </header>
        <div
          className={cn(
            "flex flex-1 flex-col gap-4 p-4 pt-0 pb-0",
            // "before:absolute before:z-10 before:h-4 before:w-full before:left-0",
            // "before:bg-gradient-to-b before:from-white before:to-[rgba(0,0,0,0)]",
            // "after:absolute after:z-10 after:h-4 after:w-full after:left-0 after:bottom-0",
            // "after:bg-gradient-to-t after:from-white after:to-[rgba(0,0,0,0)]",
          )}
        >
          {/* <div className="py-4"> */}
          <Outlet />
          {/* </div> */}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
