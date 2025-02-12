-- CreateTable
CREATE TABLE "TransactionProducts" (
    "id" SERIAL NOT NULL,
    "transactionId" INTEGER NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TransactionProducts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TransactionProducts" ADD CONSTRAINT "TransactionProducts_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TransactionProducts" ADD CONSTRAINT "TransactionProducts_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
