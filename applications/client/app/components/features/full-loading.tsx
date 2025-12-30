import { useTranslation } from "react-i18next";
import { Spinner } from "../ui/spinner";
import { Locale } from "~/locale/declaration";
import { cn } from "~/lib/utils";

export interface FullLoadingProps {
  className?: string;
}

export function FullLoading({ className }: FullLoadingProps) {
  const { t } = useTranslation();

  return (
    <div className={cn("flex justify-center items-center", className)}>
      <Spinner className="size-5" />
      <p className="ml-2">{t(Locale.Text$Loading)}</p>
    </div>
  );
}
