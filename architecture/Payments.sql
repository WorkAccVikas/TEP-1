-- Trip Invoices
CREATE TABLE
    TripInvoices (
        invoiceId UUID PRIMARY KEY,
        tripId UUID REFERENCES Trips (tripId) ON DELETE SET NULL,
        baseAmount DECIMAL(10, 2) NOT NULL,
        taxAmount DECIMAL(10, 2),
        discountAmount DECIMAL(10, 2) DEFAULT 0,
        additionalCharges DECIMAL(10, 2) DEFAULT 0,
        totalAmount DECIMAL(10, 2) NOT NULL,
        status VARCHAR DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue')),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Master table for expenses, including both trip-specific and general expenses
CREATE TABLE
    Expenses (
        expenseId UUID PRIMARY KEY, -- Unique identifier for the expense
        tripId UUID REFERENCES Trips (tripId) ON DELETE CASCADE, -- Associated trip (optional)
        userId UUID REFERENCES Users (userId) NOT NULL, -- User who incurred the expense
        vehicleId UUID REFERENCES Vehicles (vehicleId), -- Reference to the vehicle (optional)
        expenseCategoryId UUID REFERENCES ExpenseCategories (categoryId) NOT NULL, -- Linked to category for normalization
        amount DECIMAL(10, 2) NOT NULL, -- Expense amount
        description TEXT, -- Additional details about the expense
        advanceTaken DECIMAL(10, 2) DEFAULT 0, -- Advance amount taken (if applicable)
        reimbursementRequested BOOLEAN DEFAULT FALSE, -- Flag for reimbursement request
        expenseDate DATE DEFAULT CURRENT_DATE, -- Date when the expense occurred
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp for expense creation
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP -- Timestamp for the last update
    );

-- Table for categorizing expenses (fuel, toll, maintenance, etc.)
CREATE TABLE
    ExpenseCategories (
        categoryId UUID PRIMARY KEY, -- Unique category ID
        categoryName VARCHAR NOT NULL UNIQUE, -- Category name (e.g., 'fuel', 'toll', etc.)
        description TEXT, -- Additional details about the category
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the category was created
    );

CREATE TABLE
    Payments (
        paymentId UUID PRIMARY KEY, -- Unique payment identifier
        userId UUID REFERENCES Users (userId), -- Payer or payee
        invoiceId UUID REFERENCES TripInvoices (invoiceId), --Array  Related invoice (if applicable)
        expenseId UUID REFERENCES Expenses (expenseId), -- array Related expense (if applicable)
        amount DECIMAL(10, 2) NOT NULL, -- Payment amount
        paymentMode VARCHAR CHECK (
            paymentMode IN ('cash', 'card', 'bank_transfer', 'upi', 'wallet')
        ), -- Mode of payment
        paymentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Payment timestamp
    );

CREATE TABLE
    LoanRepayments (
        repaymentId UUID PRIMARY KEY, -- Unique repayment identifier
        loanId UUID REFERENCES VehicleLoans (loanId) ON DELETE CASCADE, -- Reference to the loan
        paymentAmount DECIMAL(10, 2) NOT NULL, -- Amount paid towards the loan
        paymentDate DATE NOT NULL, -- Date of repayment
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the repayment was created
    );

CREATE TABLE
    Ledgers (
        ledgerId UUID PRIMARY KEY, -- Unique ledger identifier
        entityId UUID NOT NULL, -- ID of the entity (company, driver, or vendor)
        entityType VARCHAR NOT NULL CHECK (entityType IN ('company', 'driver', 'vendor')), -- Type of entity
        paymentId UUID REFERENCES Payments (paymentId), -- Associated trip (optional)
        transactionType VARCHAR CHECK (transactionType IN ('credit', 'debit')), -- Type of transaction
        amount DECIMAL(10, 2) NOT NULL, -- Transaction amount
        description TEXT, -- Details about the transaction
        balance DECIMAL(10, 2) NOT NULL, -- Current balance after this transaction
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Transaction timestamp
    );