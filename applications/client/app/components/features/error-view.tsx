import type { ResultCode } from "@packages/types";
import { AxiosError } from "axios";
import { Empty, EmptyHeader, EmptyTitle } from "../ui/empty";

export interface ErrorViewProps {
  error: Error;
}

export function ErrorView({ error }: ErrorViewProps) {
  if (error instanceof AxiosError) {
    return AxiosErrorView(error);
  }
  return BaseErrorView(error);
}

function AxiosErrorView(
  error: AxiosError<{ code: ResultCode; message: string }, any>,
) {
  if (!error.response?.data) return null;
  const { message } = error.response.data;

  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{message}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}

function BaseErrorView(error: Error) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{error.message}</EmptyTitle>
      </EmptyHeader>
    </Empty>
  );
}
