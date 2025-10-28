import { useState } from "react";
import { z } from "zod";
import {
  ChevronDown,
  ChevronLeft,
  FileCheck,
} from "lucide-react";
import { Button } from "../../ui/button";
import { Progress } from "../../ui/progress";
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog";
import {
  _TRANSACTION_TYPE,
  PAYMENT_METHODS_ENUM,
  MAX_IMPORT_LIMIT,
} from "../../../constant";
import { toast } from "sonner";
import { BulkTransactionType } from "../../../features/transaction/transationType";
import { useProgressLoader } from "../../../hooks/use-progress-loader";
import { useBulkImportTransactionMutation } from "../../../features/transaction/transactionAPI";

// ✅ Zod schema (v4 safe)
const transactionSchema = z
  .object({
    title: z.string().min(1, "Title is required"),
    amount: z.coerce
      .number()
      .refine((val) => !isNaN(val), "Amount must be a number")
      .positive("Amount must be greater than zero"),
    date: z.coerce
      .date()
      .refine((val) => !isNaN(val.getTime()), "Invalid date format"),
    type: z.enum([_TRANSACTION_TYPE.INCOME, _TRANSACTION_TYPE.EXPENSE], {
      message: "Transaction type must be INCOME or EXPENSE",
    }),
    category: z.string().min(1, "Category is required"),
    paymentMethod: z
      .union([
        z.literal(""),
        z.undefined(),
        z.enum([
          PAYMENT_METHODS_ENUM.CARD,
          PAYMENT_METHODS_ENUM.BANK_TRANSFER,
          PAYMENT_METHODS_ENUM.MOBILE_PAYMENT,
          PAYMENT_METHODS_ENUM.AUTO_DEBIT,
          PAYMENT_METHODS_ENUM.CASH,
          PAYMENT_METHODS_ENUM.OTHER,
        ]),
      ])
      .transform((val) => (val === "" ? undefined : val))
      .optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.paymentMethod &&
      !Object.values(PAYMENT_METHODS_ENUM).includes(data.paymentMethod)
    ) {
      ctx.addIssue({
        path: ["paymentMethod"],
        message: `Payment method must be one of: ${Object.values(
          PAYMENT_METHODS_ENUM
        ).join(", ")}`,
        code: "custom",
      });
    }
  });

type ConfirmationStepProps = {
  file: File | null;
  mappings: Record<string, string>;
  csvData: any[];
  onComplete: () => void;
  onBack: () => void;
};

const ConfirmationStep = ({
  file,
  mappings,
  csvData,
  onComplete,
  onBack,
}: ConfirmationStepProps) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const {
    progress,
    isLoading,
    startProgress,
    updateProgress,
    doneProgress,
    resetProgress,
  } = useProgressLoader({ initialProgress: 10, completionDelay: 500 });
  const [bulkImportTransaction] = useBulkImportTransactionMutation();

  const getAssignFieldToMappedTransactions = () => {
    let hasValidationErrors = false;
    const results: Partial<any>[] = [];

    csvData.forEach((row, index) => {
      const transaction: Record<string, unknown> = {};
      Object.entries(mappings).forEach(([csvColumn, transactionField]) => {
        if (transactionField === "Skip" || row[csvColumn] === undefined) return;
        transaction[transactionField] =
          transactionField === "amount"
            ? Number(row[csvColumn])
            : transactionField === "date"
            ? new Date(row[csvColumn])
            : row[csvColumn];
      });

      try {
        const validated = transactionSchema.parse(transaction);
        results.push(validated);
      } catch (error) {
  hasValidationErrors = true;
  const message =
    error instanceof z.ZodError
      ? error.issues
          .map((e) => `${String(e.path[0])}: ${e.message}`)
          .join("\n")
      : "Invalid data";

  setErrors((prev) => ({
    ...prev,
    [index + 1]: message,
  }));
}

    });

    return { transactions: results, hasValidationErrors };
  };

  const handleImport = () => {
    const { transactions, hasValidationErrors } =
      getAssignFieldToMappedTransactions();

    if (Object.keys(errors).length > 0 || hasValidationErrors) return;

    if (transactions.length > MAX_IMPORT_LIMIT) {
      toast.error(`Cannot import more than ${MAX_IMPORT_LIMIT} transactions`);
      return;
    }

    resetProgress();
    startProgress(10);

    let currentProgress = 10;
    const interval = setInterval(() => {
      const increment = currentProgress < 90 ? 10 : 1;
      currentProgress = Math.min(currentProgress + increment, 90);
      updateProgress(currentProgress);
    }, 250);

    const payload = { transactions: transactions as BulkTransactionType[] };
    bulkImportTransaction(payload)
      .unwrap()
      .then(() => {
        updateProgress(100);
        toast.success("Imported transactions successfully");
      })
      .catch((error: { data: { message: any } }) => {
        resetProgress();
        toast.error(error.data?.message || "Failed to import transactions");
      })
      .finally(() => {
        clearInterval(interval);
        setTimeout(() => {
          doneProgress();
          resetProgress();
          onComplete();
        }, 500);
      });
  };

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="space-y-6 bg-[#F8FBFD] rounded-2xl p-6 border border-[#E6EEF3] shadow-sm">
      <DialogHeader>
        <DialogTitle className="text-[#002B4C] text-lg font-bold flex items-center gap-1">
          Confirm Import
        </DialogTitle>
        <DialogDescription className="text-[#333333]/70">
          Review your CSV mapping before importing transactions.
        </DialogDescription>
      </DialogHeader>

      {/* Summary Section */}
      <div className="border border-[#E6EEF3] bg-white rounded-xl p-4">
        <h4 className="flex items-center gap-2 font-semibold text-[#002B4C] mb-3">
          <FileCheck className="w-4 h-4 text-[#14A0C4]" />
          Import Summary
        </h4>

        <div className="grid grid-cols-2 gap-4 text-sm text-[#333333]">
          <div>
            <p className="text-[#333333]/60">File</p>
            <p>{file?.name}</p>
          </div>
          <div>
            <p className="text-[#333333]/60">Columns Mapped</p>
            <p>{Object.keys(mappings).length}</p>
          </div>
          <div>
            <p className="text-[#333333]/60">Transactions</p>
            <p>{csvData.length}</p>
          </div>
          <div>
            <p className="text-[#333333]/60">Transaction Limit</p>
            <p>{MAX_IMPORT_LIMIT}</p>
          </div>
        </div>
      </div>

      {/* Validation Errors */}
      {hasErrors && (
        <div className="w-full border border-red-100 bg-[#FEF2F2] rounded-xl text-sm max-h-64 overflow-y-auto">
          <p className="font-semibold text-red-600 bg-[#FEE2E2] px-3 py-2 sticky top-0 rounded-t-xl">
            Validation Issues:
          </p>
          <div className="space-y-1 p-3">
            {Object.entries(errors).map(([row, msg]) => (
              <details key={row} className="group">
                <summary className="flex items-center justify-between text-red-600 cursor-pointer">
                  <span>Row {row}</span>
                  <ChevronDown className="w-4 h-4 transform group-open:rotate-180 transition-transform" />
                </summary>
                <div className="mt-1 pl-3 text-xs text-red-500 border-l-2 border-red-200">
                  {msg.split("\n").map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </details>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bar */}
      {isLoading && (
        <div className="space-y-2">
          <Progress value={progress} className="h-2 bg-[#E6EEF3]" />
          <p className="text-xs text-[#333333]/70">
            Importing... {progress}%
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex justify-between pt-2">
        <Button
          variant="outline"
          onClick={onBack}
          disabled={isLoading}
          className="rounded-xl border-[#002B4C] text-[#002B4C] hover:bg-[#002B4C] hover:text-white"
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleImport}
          disabled={isLoading}
          className="rounded-xl bg-[#14A0C4] hover:bg-[#128AA9] text-white shadow-md"
        >
          {isLoading ? "Importing..." : "Confirm Import"}
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
