-- Company Routes
CREATE TABLE Routes (
    routeId UUID PRIMARY KEY,
    companyId UUID NOT NULL REFERENCES Companies(companyId) ON DELETE CASCADE,
    sourceZoneId UUID NOT NULL REFERENCES Zones(zoneId) ON DELETE CASCADE,
    destinationZoneId UUID NOT NULL REFERENCES Zones(zoneId) ON DELETE CASCADE,
    routeName VARCHAR NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (companyId, sourceZoneId, destinationZoneId)
);

-- Route Charges
CREATE TABLE RouteCharges (
    chargeId UUID PRIMARY KEY,
    routeId UUID NOT NULL REFERENCES Routes(routeId) ON DELETE CASCADE,
    chargeType VARCHAR NOT NULL CHECK (chargeType IN ('toll', 'parking', 'other')),
    amount DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Pricing Rules (Rate Card equivalent)
CREATE TABLE PricingRules (
    ruleId UUID PRIMARY KEY,
    routeId UUID REFERENCES Routes(routeId) ON DELETE SET NULL,
    companyId UUID NOT NULL REFERENCES Companies(companyId) ON DELETE CASCADE,
    applicableTo VARCHAR NOT NULL CHECK (applicableTo IN ('vendor', 'driver', 'admin')),
    pricingModel VARCHAR NOT NULL CHECK (pricingModel IN ('fixed', 'distance-based', 'zone-based')),
    fixedRate DECIMAL(10, 2),
    distanceRate DECIMAL(10, 2),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Multi-Zone Pricing
CREATE TABLE MultiZonePricing (
    pricingId UUID PRIMARY KEY,
    companyId UUID REFERENCES Companies(companyId) ON DELETE CASCADE,
    sourceZoneId UUID REFERENCES Zones(zoneId) ON DELETE CASCADE,
    intermediateZoneIds UUID[],
    destinationZoneId UUID REFERENCES Zones(zoneId) ON DELETE CASCADE,
    vehicleCategoryId UUID REFERENCES VehicleCategories(categoryId) ON DELETE CASCADE,
    totalRate DECIMAL(10, 2) NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rule Assignments
CREATE TABLE RuleAssignments (
    assignmentId UUID PRIMARY KEY,
    ruleId UUID REFERENCES PricingRules(ruleId) ON DELETE CASCADE,
    entityId UUID NOT NULL REFERENCES Users(userId) ON DELETE CASCADE,
    role VARCHAR NOT NULL CHECK (role IN ('driver', 'vendor', 'user')),
    startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endDate TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ruleId, entityId)
);

-- Pricing History
CREATE TABLE PricingHistory (
    historyId UUID PRIMARY KEY,
    assignmentId UUID REFERENCES RuleAssignments(assignmentId) ON DELETE CASCADE,
    changeTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    previousBaseRate DECIMAL(10, 2),
    newBaseRate DECIMAL(10, 2),
    updatedBy UUID REFERENCES Users(userId) ON DELETE SET NULL
);

-- Dynamic Pricing
CREATE TABLE DynamicPricing (
    dynamicPricingId UUID PRIMARY KEY,
    zoneId UUID REFERENCES Zones(zoneId) ON DELETE CASCADE,
    vehicleCategoryId UUID REFERENCES VehicleCategories(categoryId) ON DELETE CASCADE,
    surgeMultiplier DECIMAL(5, 2) NOT NULL,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL
);

-- Price History
CREATE TABLE PriceHistory (
    historyId UUID PRIMARY KEY,
    ruleId UUID REFERENCES PricingRules(ruleId) ON DELETE CASCADE,
    oldRate DECIMAL(10, 2),
    newRate DECIMAL(10, 2),
    changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changedBy UUID REFERENCES Users(userId) ON DELETE SET NULL
);

-- Price Modifiers
CREATE TABLE PriceModifiers (
    modifierId UUID PRIMARY KEY,
    ruleId UUID REFERENCES PricingRules(ruleId) ON DELETE CASCADE,
    type VARCHAR NOT NULL CHECK (type IN ('discount', 'surcharge')),
    description VARCHAR NOT NULL,
    value DECIMAL(10, 2) NOT NULL,
    isPercentage BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
