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

