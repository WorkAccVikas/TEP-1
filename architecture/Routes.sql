-- Zones Table: Stores hierarchical geographical zones, linked to companies
CREATE TABLE
    Zones (
        zoneId UUID PRIMARY KEY,
        zoneName VARCHAR NOT NULL, -- Name of the zone (e.g., City, Area, Region)
        parentZoneId UUID REFERENCES Zones (zoneId) ON DELETE CASCADE, -- Parent zone, allows hierarchical relationships
        zoneType VARCHAR NOT NULL, -- Zone type (e.g., City, Area, Region)
        companyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE, -- Link zone to a specific company
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of zone creation
    );

-- Locations Table: Stores locations within zones, linked to companies
CREATE TABLE
    Locations (
        locationId UUID PRIMARY KEY, -- Unique identifier for the location
        locationName VARCHAR NOT NULL, -- Name of the location (e.g., 'DLF Phase 3, Gurgaon')
        zoneId UUID REFERENCES Zones (zoneId) ON DELETE CASCADE, -- References the related zone, cascading delete if zone is removed
        companyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE, -- Link location to a specific company
        latitude DECIMAL(10, 8), -- Latitude of the location (decimal precision suitable for GPS coordinates)
        longitude DECIMAL(11, 8), -- Longitude of the location (decimal precision suitable for GPS coordinates)
        createdAt TIMESTAMP DE FAULT CURRENT_TIMESTAMP -- Timestamp for when the location was created
    );



CREATE TABLE Routes (
    routeId UUID PRIMARY KEY,
    companyId UUID NOT NULL REFERENCES Companies(companyId) ON DELETE CASCADE,
    sourceZoneId UUID NOT NULL REFERENCES Zones(zoneId) ON DELETE CASCADE,
    destinationZoneId UUID NOT NULL REFERENCES Zones(zoneId) ON DELETE CASCADE,
    routeName VARCHAR NOT NULL,
    distance DECIMAL(10, 2) NOT NULL CHECK (distance > 0), -- distance in kilometers
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (companyId, sourceZoneId, destinationZoneId)
);


CREATE TABLE RouteCharges (
    chargeId UUID PRIMARY KEY,
    routeId UUID NOT NULL REFERENCES Routes(routeId) ON DELETE CASCADE,
    chargeType VARCHAR NOT NULL CHECK (chargeType IN ('toll', 'parking', 'other')),
    description TEXT,
    amount DECIMAL(10, 2) NOT NULL CHECK (amount >= 0),
    startTime TIMESTAMP,
    endTime TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE PricingRules (
    ruleId UUID PRIMARY KEY,
    routeId UUID REFERENCES Routes(routeId) ON DELETE SET NULL,
    companyId UUID NOT NULL REFERENCES Companies(companyId) ON DELETE CASCADE,
    applicableTo VARCHAR NOT NULL CHECK (applicableTo IN ('vendor', 'driver', 'admin')),
    pricingModel VARCHAR NOT NULL CHECK (pricingModel IN ('fixed', 'distance-based', 'zone-based')),
    fixedRate DECIMAL(10, 2), -- for fixed pricing
    distanceRate DECIMAL(10, 2), -- rate per kilometer
    zoneRate DECIMAL(10, 2), -- rate per zone
    minCharge DECIMAL(10, 2) DEFAULT 0, -- minimum charge
    maxCharge DECIMAL(10, 2), -- optional maximum charge
    priority INT DEFAULT 1, -- priority of the rule
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE RuleAssignments (
    assignmentId UUID PRIMARY KEY,
    ruleId UUID REFERENCES PricingRules(ruleId) ON DELETE CASCADE,
    entityId UUID NOT NULL REFERENCES Users(userId) ON DELETE CASCADE,
    role VARCHAR NOT NULL CHECK (role IN ('driver', 'vendor', 'admin')),
    startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    endDate TIMESTAMP,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (ruleId, entityId)
);

CREATE TABLE DynamicPricing (
    dynamicPricingId UUID PRIMARY KEY,
    zoneId UUID REFERENCES Zones(zoneId) ON DELETE CASCADE,
    vehicleCategoryId UUID REFERENCES VehicleCategories(categoryId) ON DELETE CASCADE,
    surgeMultiplier DECIMAL(5, 2) NOT NULL CHECK (surgeMultiplier >= 1),
    description TEXT,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PriceModifiers (
    modifierId UUID PRIMARY KEY,
    ruleId UUID REFERENCES PricingRules(ruleId) ON DELETE CASCADE,
    type VARCHAR NOT NULL CHECK (type IN ('discount', 'surcharge')),
    description VARCHAR NOT NULL,
    value DECIMAL(10, 2) NOT NULL CHECK (value >= 0),
    isPercentage BOOLEAN DEFAULT FALSE,
    priority INT DEFAULT 1,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE PricingHistory (
    historyId UUID PRIMARY KEY,
    assignmentId UUID REFERENCES RuleAssignments(assignmentId) ON DELETE CASCADE,
    changeTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    previousBaseRate DECIMAL(10, 2),
    newBaseRate DECIMAL(10, 2),
    reasonForChange TEXT,
    updatedBy UUID REFERENCES Users(userId) ON DELETE SET NULL
);

CREATE TABLE PriceHistory (
    historyId UUID PRIMARY KEY,
    ruleId UUID REFERENCES PricingRules(ruleId) ON DELETE CASCADE,
    oldRate DECIMAL(10, 2),
    newRate DECIMAL(10, 2),
    changedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    changedBy UUID REFERENCES Users(userId) ON DELETE SET NULL,
    reasonForChange TEXT
);

CREATE TABLE RouteHistory (
    historyId UUID PRIMARY KEY,
    routeId UUID REFERENCES Routes(routeId) ON DELETE CASCADE,
    oldDistance DECIMAL(10, 2),
    newDistance DECIMAL(10, 2),
    changeReason TEXT,
    updatedBy UUID REFERENCES Users(userId) ON DELETE SET NULL,
    changeTimestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- CREATE TABLE MultiZonePricing (
--     pricingId UUID PRIMARY KEY,
--     companyId UUID REFERENCES Companies(companyId) ON DELETE CASCADE,
--     sourceZoneId UUID REFERENCES Zones(zoneId) ON DELETE CASCADE,
--     intermediateZoneIds UUID[],
--     destinationZoneId UUID REFERENCES Zones(zoneId) ON DELETE CASCADE,
--     vehicleCategoryId UUID REFERENCES VehicleCategories(categoryId) ON DELETE CASCADE,
--     totalRate DECIMAL(10, 2) NOT NULL,
--     minCharge DECIMAL(10, 2),
--     maxCharge DECIMAL(10, 2),
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

