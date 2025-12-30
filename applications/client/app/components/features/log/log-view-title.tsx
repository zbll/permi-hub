import { Check, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { Locale } from "~/locale/declaration";

export interface LogViewTitleProps {
  url: string;
  isSuccess: boolean;
  isSecure: boolean;
}

export function LogViewTitle({ url, isSuccess, isSecure }: LogViewTitleProps) {
  const { t } = useTranslation();
  return (
    <h3 className="text-2xl font-semibold flex items-center wrap-anywhere">
      {url}
      <Badge className="ml-2" variant={isSuccess ? "secondary" : "destructive"}>
        {isSuccess
          ? t(Locale.Log$Table$IsSuccess$True)
          : t(Locale.Log$Table$IsSuccess$False)}
      </Badge>
      <Badge
        className={cn(
          "ml-2",
          isSecure && "bg-blue-500 text-white dark:bg-blue-600",
        )}
        variant={isSecure ? "secondary" : "destructive"}
      >
        {isSecure && <Check />}
        {!isSecure && <X />}
        SSL
      </Badge>
    </h3>
  );
}
