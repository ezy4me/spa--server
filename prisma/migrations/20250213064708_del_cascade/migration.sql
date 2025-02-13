-- DropForeignKey
ALTER TABLE "TransactionProducts" DROP CONSTRAINT "TransactionProducts_productId_fkey";

-- DropForeignKey
ALTER TABLE "TransactionProducts" DROP CONSTRAINT "TransactionProducts_transactionId_fkey";

-- AddForeignKey
ALTER TABLE "TransactionProducts" ADD CONSTRAINT "TransactionProducts_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionProducts" ADD CONSTRAINT "TransactionProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
