-- Trip Details
CREATE TABLE
    Trips (
        tripId UUID PRIMARY KEY,
        tripName VARCHAR NOT NULL,
        sourceZoneId UUID REFERENCES Zones (zoneId) ON DELETE CASCADE,
        destZoneId UUID REFERENCES Zones (zoneId) ON DELETE CASCADE,
        distanceTraveled DECIMAL(10, 2), -- Distance traveled in km
        tripDate TIMESTAMP NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

-- Trip Assignments
CREATE TABLE
    TripAssignments (
        assignmentId UUID PRIMARY KEY,
        tripId UUID NOT NULL REFERENCES Trips (tripId) ON DELETE CASCADE,
        assignedToId UUID NOT NULL,
        assignedToType VARCHAR NOT NULL CHECK (assignedToType IN ('driver', 'vendor')),
        vehicleCategoryId UUID REFERENCES VehicleCategories (categoryId) ON DELETE CASCADE,
        customRate DECIMAL(10, 2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    TripHistory (
        tripId UUID PRIMARY KEY,
        vehicleId UUID REFERENCES Vehicles (vehicleId),
        driverId UUID REFERENCES Users (userId),
        startLocationId UUID REFERENCES Locations (locationId),
        endLocationId UUID REFERENCES Locations (locationId),
        startTime TIMESTAMP,
        endTime TIMESTAMP,
        status VARCHAR CHECK (status IN ('completed', 'canceled', 'ongoing')),
        distance DECIMAL(10, 2),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );