CREATE TABLE
    Companies (
        companyId UUID PRIMARY KEY,
        companyName VARCHAR NOT NULL,
        subscriptionId UUID REFERENCES Subscriptions (subscriptionId),
        parentCompanyId UUID REFERENCES Companies (companyId),
        deletedAt TIMESTAMP, -- Soft delete column
        createdBy UUID REFERENCES Users (userId), -- Tracks who created the record
        updatedBy UUID REFERENCES Users (userId), -- Tracks who last updated the record
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    CompanyRelations (
        fromCompanyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE,
        toCompanyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE,
        relationshipType VARCHAR CHECK (
            relationshipType IN ('serviceProvider', 'customer', 'partner')
        ),
        metadata JSONB, -- Optional: Store any additional information about the relationship
        deletedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (fromCompanyId, toCompanyId)
    );

    CREATE TABLE UserCompanyRelations (
    userId UUID REFERENCES Users (userId) ON DELETE CASCADE, 
    companyId UUID REFERENCES Companies (companyId) ON DELETE CASCADE, 
    relationshipType VARCHAR NOT NULL CHECK (relationshipType IN ('employee', 'vendor', 'driver', 'consultant', 'partner')), 
    metadata JSONB, -- Optional: Additional information about the relationship
    startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    endDate TIMESTAMP, -- Null if the relationship is ongoing
    isActive BOOLEAN DEFAULT TRUE, 
    deletedAt TIMESTAMP, 
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, 
    PRIMARY KEY (userId, companyId, relationshipType)
);


CREATE TABLE
    UserHierarchies (
        parentId UUID REFERENCES Users (userId),
        childId UUID REFERENCES Users (userId),
        path JSONB, -- Optimized to store paths as arrays or JSON objects
        deletedAt TIMESTAMP, -- Soft delete column for logical deletion
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (parentId, childId)
    );

CREATE TABLE
    Users (
        userId UUID PRIMARY KEY,
        userTypeId UUID REFERENCES UserTypes (typeId),
        firstName VARCHAR NOT NULL,
        lastName VARCHAR NOT NULL,
        email VARCHAR UNIQUE NOT NULL,
        phone VARCHAR,
        role VARCHAR CHECK (
            role IN ('admin', 'vendor', 'driver', 'user', 'self')
        ) NOT NULL,
        subscriptionId UUID REFERENCES UserSubscriptions (userSubscriptionId),
        companyId UUID REFERENCES Companies (companyId),
        language VARCHAR DEFAULT 'en',
        timezone VARCHAR DEFAULT 'UTC',
        deletedAt TIMESTAMP,
        createdBy UUID REFERENCES Users (userId),
        updatedBy UUID REFERENCES Users (userId),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    UserTypes (
        typeId UUID PRIMARY KEY,
        typeName VARCHAR NOT NULL,
        typeCategory VARCHAR CHECK (typeCategory IN ('role', 'permissions', 'status')),
        description TEXT,
        version INT DEFAULT 1, -- Versioning to track changes over time
        deletedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    Permissions (
        permissionId UUID PRIMARY KEY,
        permissionName VARCHAR NOT NULL,
        featureName VARCHAR,
        description TEXT,
        version INT DEFAULT 1, -- Versioning to manage permission updates
        deletedAt TIMESTAMP,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    RolePermissions (
        roleId UUID REFERENCES UserTypes (typeId) ON DELETE CASCADE,
        permissionId UUID REFERENCES Permissions (permissionId) ON DELETE CASCADE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (roleId, permissionId)
    );

CREATE TABLE
    UserSubscriptions (
        userSubscriptionId UUID PRIMARY KEY,
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE,
        subscriptionId UUID REFERENCES Subscriptions (subscriptionId),
        startDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        endDate TIMESTAMP,
        renewalDate TIMESTAMP,
        isActive BOOLEAN DEFAULT TRUE,
        autoRenew BOOLEAN DEFAULT FALSE,
        deletedAt TIMESTAMP,
        createdBy UUID REFERENCES Users (userId),
        updatedBy UUID REFERENCES Users (userId),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    Subscriptions (
        subscriptionId UUID PRIMARY KEY,
        planName VARCHAR NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        version INT DEFAULT 1,
        features JSONB,
        deletedAt TIMESTAMP,
        createdBy UUID REFERENCES Users (userId),
        updatedBy UUID REFERENCES Users (userId),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    );

CREATE TABLE
    AuditLogs (
        logId UUID PRIMARY KEY,
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE,
        action VARCHAR NOT NULL,
        metadata JSONB,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

CREATE TABLE
    ActivityLogs (
        activityLogId UUID PRIMARY KEY,
        userId UUID REFERENCES Users (userId) ON DELETE CASCADE,
        activityType VARCHAR NOT NULL,
        details JSONB,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE Notifications (
    notificationId UUID PRIMARY KEY,
    recipientId UUID REFERENCES Users (userId),
    type VARCHAR CHECK (type IN ('alert', 'reminder', 'info')),
    message TEXT NOT NULL,
    readStatus BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);