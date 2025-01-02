CREATE TABLE Contracts (
    contractId UUID PRIMARY KEY,
    vendorId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- Vendor providing the fleet
    clientCompanyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE, -- The company receiving the service
    terms JSONB, -- Contract details (pricing, fleet size, etc.)
    startDate TIMESTAMP NOT NULL,
    endDate TIMESTAMP,
    status VARCHAR CHECK (status IN ('active', 'terminated', 'expired')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE FleetRequests (
    requestId UUID PRIMARY KEY,
    companyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE, -- Company making the request
    recipientId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- The recipient (e.g., vendor) to whom the request is made
    requiredVehicles INT, -- Number of vehicles needed
    vehicleType VARCHAR, -- E.g., truck, car, etc.
    startDate TIMESTAMP, -- Start date of the trip
    endDate TIMESTAMP, -- End date of the trip
    status VARCHAR CHECK (
        status IN ('pending', 'approved', 'rejected', 'cancelled')
    ), -- Request status
    contractId UUID REFERENCES Contracts (contractId) ON DELETE SET NULL, -- Linked to a contract
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE VendorProposals (
    proposalId UUID PRIMARY KEY,
    fleetRequestId UUID REFERENCES FleetRequests (requestId) ON DELETE CASCADE, -- Linked to the fleet request
    vendorId UUID REFERENCES Users (userId) ON DELETE CASCADE, -- Vendor providing the vehicles
    vehicleId UUID REFERENCES Vehicles (vehicleId) ON DELETE CASCADE, -- Vehicle proposed
    companyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE, -- Linked to the company making the request
    pricing DECIMAL(10, 2), -- Price for the fleet (overrides PricingRules)
    pricingModel VARCHAR CHECK (
        pricingModel IN ('fixed', 'distance-based', 'zone-based')
    ), -- Vendor pricing model
    status VARCHAR CHECK (status IN ('pending', 'accepted', 'rejected')), -- Vendor response status
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE FleetPool (
    fleetPoolId UUID PRIMARY KEY,
    vehicleId UUID REFERENCES Vehicles (vehicleId) ON DELETE CASCADE, -- Vehicle in the fleet pool
    sharedWithCompanyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE, -- Company the vehicle is shared with
    pricing DECIMAL(10, 2), -- Price for the fleet (overrides PricingRules)
    pricingModel VARCHAR CHECK (
        pricingModel IN ('fixed', 'distance-based', 'zone-based')
    ), -- Vendor pricing model
    availabilityStatus VARCHAR CHECK (
        availabilityStatus IN ('available', 'assigned', 'unavailable')
    ) DEFAULT 'available',
    startDate TIMESTAMP, -- Availability start date
    endDate TIMESTAMP, -- Availability end date
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
