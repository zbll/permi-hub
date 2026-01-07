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
import { Input } from "~ui/input";
import { LanguageSelect } from "~components/features/language-select";
import { BrandButton } from "~components/shared/brand-button";
import { useLogin } from "~/hooks/mutation/use-login";
import z from "zod";
import { useForm } from "@tanstack/react-form";
import { Field, FieldError, FieldLabel } from "~/components/ui/field";
import { setAuthToken } from "~/lib/utils";
import { queryClient } from "~/lib/query-client";

export interface LoginProps {
  onLogined: () => void;
}

export function Login({ onLogined }: LoginProps) {
  const { t } = useTranslation();

  const formSchema = z.object({
    email: z.email(),
    password: z.string().min(6, { error: () => t(Locale.Login$PasswordEmpty) }),
  });

  const { isPending, mutate } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onBlur: formSchema,
    },
    onSubmit: async ({ value }) => {
      mutate(value, {
        onSuccess: (data) => {
          setAuthToken(data).then(() => {
            queryClient.invalidateQueries();
            onLogined();
          });
        },
        onError: (e) => {
          console.log(e);
        },
      });
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit();
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
          <form.Field name="email">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    {t(Locale.Text$Email)}
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    placeholder="m@example.com"
                    tabIndex={1}
                    autoComplete="email"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <form.Field name="password">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;
              return (
                <Field data-invalid={isInvalid} className="mt-4">
                  <FieldLabel
                    htmlFor={field.name}
                    className="flex justify-between items-center mb-2"
                  >
                    <span className="text-sm">{t(Locale.Text$Password)}</span>
                    <Button
                      variant="link"
                      size="sm"
                      className="h-6 cursor-pointer"
                      tabIndex={3}
                    >
                      {t(Locale.Login$ForgotPassword)}
                    </Button>
                  </FieldLabel>
                  <Input
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    aria-invalid={isInvalid}
                    type="password"
                    tabIndex={2}
                    autoComplete="password"
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
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
