-- Companies Table: Stores company details
CREATE TABLE
    Companies (
        companyId UUID PRIMARY KEY, -- Unique company ID
        companyName VARCHAR NOT NULL, -- Name of the company
        subscriptionId UUID REFERENCES Subscriptions (subscriptionId), -- Current subscription plan
        parentCompanyId UUID REFERENCES Companies (companyId), -- Parent company for hierarchies
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- Timestamp of company creation
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );