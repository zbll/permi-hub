export interface LogViewDescriptionProps {
  title: string;
  value: string;
}

export function LogViewDescription({ title, value }: LogViewDescriptionProps) {
  return (
    <tr className="even:bg-muted m-0 border-t p-0">
      <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right w-50">
        {title}
      </td>
      <td className="border px-4 py-2 text-left [[align=center]]:text-center [[align=right]]:text-right wrap-anywhere">
        {value}
      </td>
    </tr>
  );
}
