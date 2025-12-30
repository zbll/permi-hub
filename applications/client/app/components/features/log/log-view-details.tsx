import { useTranslation } from "react-i18next";
import { Locale } from "~/locale/declaration";
import { LogViewDescription } from "./log-view-description";
import dayjs from "dayjs";

export interface LogViewDetailsProps {
  isSuccess: boolean;
  method: string;
  language: string;
  requestIp: string;
  userAgent: string;
  createAt: Date;
  reason: string;
}

export function LogViewDetails({
  isSuccess,
  method,
  language,
  requestIp,
  userAgent,
  createAt,
  reason,
}: LogViewDetailsProps) {
  const { t } = useTranslation();

  let formatReason = <>{reason}</>;
  if (!isSuccess) {
    const list = reason.split("\n");
    formatReason = (
      <>
        {list.map((text, index) => (
          <>
            {text}
            {index < list.length - 1 && <br />}
          </>
        ))}
      </>
    );
  }

  return (
    <section className="w-full">
      <h3 className="text-2xl font-semibold mt-8">
        {t(Locale.Log$View$Details)}
      </h3>
      <table className="mt-4 w-full">
        <tbody>
          <LogViewDescription
            title={t(Locale.Log$View$Method)}
            value={method}
          />
          <LogViewDescription
            title={t(Locale.Log$View$Language)}
            value={language}
          />
          <LogViewDescription
            title={t(Locale.Log$View$RequestIp)}
            value={requestIp}
          />
          <LogViewDescription
            title={t(Locale.Log$View$UserAgent)}
            value={userAgent}
          />
          <LogViewDescription
            title={t(Locale.Log$View$RequestTime)}
            value={dayjs(createAt).format(t(Locale.Template$Full$Date))}
          />
          {!isSuccess && (
            <LogViewDescription
              title={t(Locale.Log$View$Reason)}
              value={formatReason}
            />
          )}
        </tbody>
      </table>
    </section>
  );
}
