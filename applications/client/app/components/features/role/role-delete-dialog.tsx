import { Dialog, DialogContent, DialogTitle } from "~ui/dialog";
import { useTranslation } from "react-i18next";
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Locale } from "~/locale/declaration";
import { useRoleDelete } from "~/hooks/mutation/use-role-delete";

export interface RoleDeleteDialogProps {
  show: boolean;
  setShow: (show: boolean) => void;
  id: number | null;
}

export function RoleDeleteDialog({ show, setShow, id }: RoleDeleteDialogProps) {
  const { t } = useTranslation();
  const { mutate, isPending } = useRoleDelete();

  const handleDelete = () => {
    if (id) {
      mutate(id, {
        onSuccess: () => {
          setShow(false);
        },
      });
    }
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t(Locale.Role$Delete$Title)}</DialogTitle>
          <DialogDescription>{t(Locale.Role$Delete$Confirm)}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => setShow(false)}
            disabled={isPending}
          >
            {t(Locale.Text$Cancel)}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {t(Locale.Text$Confirm)}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
