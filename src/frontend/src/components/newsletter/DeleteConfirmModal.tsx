import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  label: string;
  isLoading?: boolean;
}

export default function DeleteConfirmModal({
  open,
  onCancel,
  onConfirm,
  label,
  isLoading,
}: Props) {
  return (
    <AlertDialog open={open}>
      <AlertDialogContent
        data-ocid="subscribers.delete.dialog"
        className="bg-card border border-border"
      >
        <AlertDialogHeader>
          <AlertDialogTitle className="text-foreground">
            Delete Subscriber?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            This will permanently remove{" "}
            <span className="font-semibold text-foreground">{label}</span> from
            your subscriber list. This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-ocid="subscribers.delete.cancel_button"
            onClick={onCancel}
            className="border-border"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-ocid="subscribers.delete.confirm_button"
            onClick={onConfirm}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? "Deleting…" : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
