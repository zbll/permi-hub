import { useLogView } from "~/hooks/query/use-log-view";
import type { Route } from "./+types/log-view";
import { ErrorView } from "~/components/features/error-view";
import { Spinner } from "~/components/ui/spinner";
import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";
import { LogViewTitle } from "~/components/features/log/log-view-title";
import { LogViewDetails } from "~/components/features/log/log-view-details";
import { JsonInspector } from "@rexxars/react-json-inspector";
import "@rexxars/react-json-inspector/json-inspector.css";

export default function logViewScreen({ params }: Route.ComponentProps) {
  const { t } = useTranslation();
  const { isFetching, data, isError, error } = useLogView(params.id);

  return (
    <>
      {isError && <ErrorView error={error} />}
      {isFetching && (
        <div className="w-full h-full flex items-center justify-center">
          <Spinner className="size-5" />
          <p className="ml-2">{t(Locale.Text$Loading)}</p>
        </div>
      )}
      {data && (
        <>
          <LogViewTitle
            url={data.url}
            isSuccess={data.isSuccess}
            isSecure={data.isSecure}
          />
          <LogViewDetails
            isSuccess={data.isSuccess}
            method={data.method}
            language={data.language}
            requestIp={data.requestIp}
            userAgent={data.userAgent}
            createAt={data.createAt}
            reason={data.reason}
          />
          <section className="w-full">
            <h3 className="text-2xl font-semibold mt-8">
              {t(Locale.Log$View$Headers)}
            </h3>
            <div className="w-full wrap-anywhere overflow-hidden mt-4">
              <JsonInspector data={data.headers} search={false} />
            </div>
          </section>
          <section className="w-full">
            <h3 className="text-2xl font-semibold mt-8">
              {t(Locale.Log$View$Params)}
            </h3>
            <div className="w-full wrap-anywhere overflow-hidden mt-4">
              <JsonInspector data={data.params} search={false} />
            </div>
          </section>
          <section className="w-full">
            <h3 className="text-2xl font-semibold mt-8">
              {t(Locale.Log$View$Response)}
            </h3>
            <div className="w-full wrap-anywhere overflow-hidden mt-4">
              <JsonInspector data={data.response} search={false} />
            </div>
          </section>
        </>
      )}
    </>
  );
}
