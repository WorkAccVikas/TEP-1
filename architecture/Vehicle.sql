CREATE TABLE
    Vehicles (
        vehicleId UUID PRIMARY KEY,
        ownerId UUID REFERENCES Users (userId), -- Owner of the vehicle
        companyId UUID REFERENCES Companies (companyId), -- Optional, if owned by a company
        categoryId UUID REFERENCES VehicleCategories (categoryId), -- Link to the vehicle category
        vehicleType VARCHAR NOT NULL, -- E.g., car, truck, etc.
        registrationNumber VARCHAR UNIQUE NOT NULL, -- Vehicle registration
        capacity INT, -- Passenger or cargo capacity
        isAvailable BOOLEAN DEFAULT TRUE, -- Availability for trips
        isShared BOOLEAN DEFAULT FALSE, -- Indicates if the vehicle can be used by other companies
        pricing JSONB, -- Pricing details (e.g., per km, per hour)
        status VARCHAR CHECK (status IN ('active', 'inactive', 'maintenance')) DEFAULT 'active',
        deletedAt TIMESTAMP, -- Soft delete
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    VehicleMaintenance (
        maintenanceId UUID PRIMARY KEY,
        vehicleId UUID REFERENCES Vehicles (vehicleId) ON DELETE CASCADE,
        maintenanceType VARCHAR NOT NULL CHECK (
            maintenanceType IN ('repair', 'service', 'inspection')
        ),
        scheduledDate TIMESTAMP NOT NULL,
        completedDate TIMESTAMP,
        cost DECIMAL(10, 2),
        status VARCHAR CHECK (status IN ('pending', 'completed', 'canceled')) DEFAULT 'pending',
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    VehicleCategories (
        categoryId UUID PRIMARY KEY,
        categoryName VARCHAR NOT NULL,
        categoryType VARCHAR CHECK (categoryType IN ('seating', 'type', 'fuel')),
        description TEXT,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    VehicleAssignments (
        assignmentId UUID PRIMARY KEY,
        vehicleId UUID REFERENCES Vehicles (vehicleId) ON DELETE CASCADE,
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE,
        role VARCHAR CHECK (role IN ('driver', 'vendor')),
        serviceRate DECIMAL(10, 2) NOT NULL,
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endDate TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    VehicleExpenses (
        expenseId UUID PRIMARY KEY, -- Unique expense identifier
        vehicleId UUID REFERENCES Vehicles (vehicleId) ON DELETE CASCADE, -- Reference to the vehicle
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- Reference to the user (driver/vendor)
        expenseType VARCHAR CHECK (
            expenseType IN (
                'fuel',
                'maintenance',
                'toll',
                'insurance',
                'other'
            )
        ), -- Type of expense
        amount DECIMAL(10, 2) NOT NULL, -- Expense amount
        dateIncurred DATE NOT NULL, -- Date the expense was incurred
        paymentStatus VARCHAR CHECK (
            paymentStatus IN ('paid', 'pending', 'reimbursed')
        ), -- Payment status of the expense
        reimbursed DECIMAL(10, 2) DEFAULT 0, -- Amount reimbursed (if any)
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when the expense record was created
    );

CREATE TABLE
    VehicleLoans (
        loanId UUID PRIMARY KEY, -- Unique loan identifier
        vehicleId UUID REFERENCES Vehicles (vehicleId) ON DELETE CASCADE, -- Reference to the vehicle
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- Reference to the user (driver/vendor)
        loanAmount DECIMAL(10, 2) NOT NULL, -- Total loan amount
        interestRate DECIMAL(5, 2) NOT NULL, -- Annual interest rate (percentage)
        startDate DATE NOT NULL, -- Loan start date
        endDate DATE, -- Loan end date (nullable, if ongoing)
        totalInstallments INT NOT NULL, -- Total number of installments
        paidInstallments INT DEFAULT 0, -- Number of installments paid
        EMIAmount DECIMAL(10, 2) NOT NULL, -- Amount paid per installment
        loanStatus VARCHAR CHECK (loanStatus IN ('active', 'closed', 'overdue')), -- Loan status
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp when loan was created
    );