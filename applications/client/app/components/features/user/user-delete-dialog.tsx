import { Dialog, DialogContent, DialogTitle } from "~ui/dialog";
import { useTranslation } from "react-i18next";
import {
  DialogHeader,
  DialogFooter,
  DialogDescription,
} from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
import { Locale } from "~/locale/declaration";
import { useUserDelete } from "~/hooks/mutation/use-user-delete";

export interface UserDeleteDialogProps {
  show: boolean;
  setShow: (show: boolean) => void;
  id: string | null;
}

export function UserDeleteDialog({ show, setShow, id }: UserDeleteDialogProps) {
  const { t } = useTranslation();
  const { mutate, isPending } = useUserDelete();

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
          <DialogTitle>{t(Locale.User$Delete$Title)}</DialogTitle>
          <DialogDescription>{t(Locale.User$Delete$Confirm)}</DialogDescription>
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
