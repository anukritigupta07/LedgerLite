import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "../../components/ui/drawer";
import TransactionForm from "./transaction-form";
import useEditTransactionDrawer from "../../hooks/use-edit-transaction-drawer";

const EditTransactionDrawer = () => {
  const { open, transactionId, onCloseDrawer } = useEditTransactionDrawer();

  return (
    <Drawer open={open} onOpenChange={onCloseDrawer} direction="right">
      <DrawerContent className="max-w-md overflow-hidden overflow-y-auto bg-white">
        <DrawerHeader className="border-b border-gray-200 pb-4">
          <DrawerTitle className="text-xl font-semibold text-[#002B4C]">
            Edit Transaction
          </DrawerTitle>
          <DrawerDescription className="text-[#333333]">
            Edit a transaction to track your finances
          </DrawerDescription>
        </DrawerHeader>

        <div className="p-4">
          <TransactionForm
            isEdit
            transactionId={transactionId}
            onCloseDrawer={onCloseDrawer}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditTransactionDrawer;
