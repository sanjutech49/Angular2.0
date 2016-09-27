module consumersite {

    export function classFactory<facadClass, wrappedClass>(fc: { new (ti: cls.TransactionInfo): facadClass; }, wc: { new (fc: facadClass): wrappedClass; }, transactionInfo: cls.TransactionInfo): wrappedClass {
        return new wc(new fc(transactionInfo));
    }
}