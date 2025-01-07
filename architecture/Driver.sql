-- Drivers Table: Stores driver-specific details/compliance (linked to Users and Vehicles)
CREATE TABLE
    Drivers (
        driverId UUID PRIMARY KEY, -- Unique driver ID
        userId UUID REFERENCES Users (userId), -- Reference to the Users table (to avoid duplication)
        licenseNumber VARCHAR NOT NULL, -- Driver's license number
        vehicleId UUID REFERENCES Vehicles (vehicleId), -- Vehicle assigned to the driver
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of driver record creation
    );

CREATE TABLE
    LoanEmi (
        loanId UUID PRIMARY KEY, -- Unique loan ID
        userId UUID REFERENCES Users (userId) ON DELETE SET NULL, -- Driver or vendor responsible for the loan
        loanAmount DECIMAL(12, 2) NOT NULL, -- Total loan amount
        emiAmount DECIMAL(10, 2) NOT NULL, -- EMI amount
        emiDueDate DATE NOT NULL, -- Next due date for the EMI
        loanStartDate DATE NOT NULL, -- When the loan started
        loanEndDate DATE, -- When the loan will end
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the loan record was created
    );

CREATE TABLE
    DriverPayments (
        paymentId UUID PRIMARY KEY, -- Unique ID for the payment
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- Reference to the driver
        paymentType VARCHAR NOT NULL CHECK (
            paymentType IN (
                'salary',
                'advance',
                'reimbursement',
                'trip_payment'
            )
        ), -- Type of payment
        amount DECIMAL(10, 2) NOT NULL, -- Amount paid
        paymentDate DATE DEFAULT CURRENT_DATE, -- Date of payment
        tax DECIMAL(10, 2) DEFAULT 0.00, -- Tax deducted (e.g., TDS)
        description TEXT, -- Optional description
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the payment record was created
    );

CREATE TABLE
    DriverSalary (
        salaryId UUID PRIMARY KEY, -- Unique salary ID
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- Reference to the driver
        monthYear VARCHAR NOT NULL, -- Month and year of the salary payment (e.g., '2024-12')
        grossSalary DECIMAL(12, 2) NOT NULL, -- Gross salary amount
        deductions DECIMAL(10, 2) DEFAULT 0.00, -- Total deductions (e.g., tax, TDS)
        netSalary DECIMAL(12, 2) NOT NULL, -- Net salary amount paid
        paymentDate DATE DEFAULT CURRENT_DATE, -- Date of salary payment
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for when the salary record was created
    );