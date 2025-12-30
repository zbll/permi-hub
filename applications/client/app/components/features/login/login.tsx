import { useTranslation } from "react-i18next";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~ui/card";
import { Locale } from "~/locale/declaration";
import { Button } from "~ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "~ui/input";
import { LanguageSelect } from "~components/features/language-select";
import { BrandButton } from "~components/shared/brand-button";
import { useLogin } from "~/hooks/mutation/use-login";

export interface LoginProps {
  onLogined: () => void;
}

export function Login({ onLogined }: LoginProps) {
  const { t } = useTranslation();

  const { isPending, mutate } = useLogin();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    mutate(formData, {
      onSuccess: onLogined,
      onError: (e) => {
        console.log(e);
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <Card>
        <CardHeader>
          <CardTitle>{t(Locale.Login$Title)}</CardTitle>
          <CardDescription>{t(Locale.Login$Subtitle)}</CardDescription>
          <CardAction>
            <Button variant="link" className="cursor-pointer">
              {t(Locale.Login$Signup)}
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <Label>
            <div className="mb-2 text-sm">{t(Locale.Text$Email)}</div>
            <Input
              placeholder="m@example.com"
              type="email"
              required
              className="text-sm"
              name="email"
              tabIndex={1}
            />
          </Label>
          <div className="mt-6">
            <Label>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm">{t(Locale.Text$Password)}</span>
                <Button
                  variant="link"
                  size="sm"
                  className="h-6 cursor-pointer"
                  tabIndex={3}
                >
                  {t(Locale.Login$ForgotPassword)}
                </Button>
              </div>
              <Input
                type="password"
                required
                className="text-sm"
                name="password"
                tabIndex={2}
              />
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex-col">
          <BrandButton type="submit" className="w-full" isLoading={isPending}>
            {t(Locale.Text$Login)}
          </BrandButton>
          <div className="mt-6 w-full flex justify-end">
            <LanguageSelect />
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
