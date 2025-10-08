import { Button } from "../ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { PlusIcon, XIcon } from "lucide-react";
import { useState } from "react";
import TransactionForm from "./transaction-form";

const AddTransactionDrawer = () => {
  const [open, setOpen] = useState(false);

  const onCloseDrawer = () => {
    setOpen(false);
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          className="!cursor-pointer !bg-[#14A0C4] !text-white flex items-center gap-2 hover:brightness-110"
        >
          <PlusIcon className="h-4 w-4" />
          Add Transaction
        </Button>
      </DrawerTrigger>

      <DrawerContent className="max-w-md overflow-hidden overflow-y-auto bg-white">
        <DrawerHeader className="relative border-b border-gray-200 pb-4">
          <div>
            <DrawerTitle className="text-xl font-semibold text-[#002B4C]">
              Add Transaction
            </DrawerTitle>
            <DrawerDescription className="text-[#333333]">
              Add a new transaction to track your finances
            </DrawerDescription>
          </div>
          <DrawerClose className="absolute top-4 right-4">
            <XIcon className="h-5 w-5 text-[#002B4C] !cursor-pointer" />
          </DrawerClose>
        </DrawerHeader>

        <div className="p-4">
          <TransactionForm onCloseDrawer={onCloseDrawer} />
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default AddTransactionDrawer;
