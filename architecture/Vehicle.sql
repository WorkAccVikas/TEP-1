-- Vehicles Table: Stores vehicle details, now linking to a category
CREATE TABLE
    Vehicles (
        vehicleId UUID PRIMARY KEY, -- Unique vehicle ID
        vehicleNumber VARCHAR NOT NULL, -- Vehicle registration number
        vehicleType VARCHAR NOT NULL, -- Type of the vehicle (e.g., Sedan, Truck)
        manufacturer VARCHAR, -- Vehicle manufacturer (e.g., Toyota, Ford)
        model VARCHAR, -- Vehicle model (e.g., Corolla, F-150)
        capacity INT, -- Passenger or weight capacity
        vehicleOwner UUID REFERENCES Users (userId) -- Link to the vehicle Owner allow null
        categoryId UUID REFERENCES VehicleCategories (categoryId), -- Link to the vehicle category
        fuelType VARCHAR, -- Fuel type (e.g., Diesel, Petrol, Electric)
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp for vehicle record creation
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