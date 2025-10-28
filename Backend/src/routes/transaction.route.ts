import { Router } from "express";

import { createTransactionController, getAllTransactionController, getTransactionByIdController ,duplicateTransactionController ,updateTransactionController , deleteTransactionController ,bulkDeleteTransactionController ,bulkTransactionController,scanReceiptController } from "../controllers/transaction.controller";
import { upload } from "../config/cloudinary.config";
const transactionRoutes = Router();


transactionRoutes.post(
  "/scan-receipt",
  upload.single("receipt"),
  scanReceiptController
);


transactionRoutes.post("/bulk-transaction", bulkTransactionController);
transactionRoutes.post("/create", createTransactionController);

transactionRoutes.put("/duplicate/:id", duplicateTransactionController);
transactionRoutes.put("/update/:id", updateTransactionController);
transactionRoutes.delete("/delete/:id", deleteTransactionController);
transactionRoutes.delete("/bulk-delete", bulkDeleteTransactionController);


transactionRoutes.get("/all", getAllTransactionController);
transactionRoutes.get("/:id", getTransactionByIdController);
export default transactionRoutes;