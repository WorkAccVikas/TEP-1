export function getMergeResult(data, zone_zoneType, vehicleType, cabOptions) {
  let ans = [];

  console.log({ data });
  console.log({ cabOptions });

  // Create maps for quick lookup
  let cabMap = new Map();
  cabOptions&&cabOptions.forEach((cab) => {
    cabMap.set(cab.vehicleNumber.replaceAll(/\s+/g, '').toUpperCase(), {
      id: cab._id,
      drivers: cab.linkedDrivers
        .filter((driver) => driver.driverId !== null) // Exclude drivers with null driverId
        .map((driver) => ({
          _id: driver.driverId._id,
          userName: driver.driverId.userName,
        })),
    });
  });

  console.log({ cabMap });

  let zoneMap = new Map();
  zone_zoneType.forEach((zone) => {
    zoneMap.set(zone.zoneName.replaceAll(/\s+/g, '').toLowerCase(), {
      id: zone._id,
      zoneType: zone.zoneType.map((type) => ({
        id: type._id,
        zoneTypeName: type.zoneTypeName,
      })),
    });
  });

  let vehicleMap = new Map();
  vehicleType.forEach((vehicle) => {
    vehicleMap.set(vehicle.vehicleTypeName.replaceAll(/\s+/g, '').toLowerCase(), vehicle);
  });

  data.forEach((val) => {
    let obj = { ...val };

    // Initialize arrays
    let zoneNameArray = [];
    let zoneTypeArray = [];
    let vehicleTypeArray = [];
    let cabOptionsArray = [];
    let driverOptionsArray = [];

    // Match zone data
    let zoneData = zoneMap.get(obj.zoneName.replaceAll(/\s+/g, '').toLowerCase());
    if (zoneData) {
      zoneNameArray.push({ id: zoneData.id, name: obj.zoneName });
      zoneTypeArray.push(...zoneData.zoneType);
    }

    // Match cab data and populate cabOptionsArray and DriverOptionsArray
    let cabData = cabMap.get(obj.vehicleNumber?.replaceAll(/\s+/g, '').toUpperCase());
    if (cabData) {
      cabOptionsArray.push({ _id: cabData.id, vehicleNumber: obj.vehicleNumber });
      driverOptionsArray = [...cabData.drivers];
    }

    // Match vehicle type
    if (typeof obj.vehicleType === 'string') {
      let vehicleData = vehicleMap.get(obj.vehicleType.replaceAll(/\s+/g, '').toLowerCase());
      if (vehicleData) {
        vehicleTypeArray.push(vehicleData);
      }
    }

    console.log({ cabOptionsArray });
    console.log({ driverOptionsArray });

    // Add matched zone data
    obj.zoneNameArray = zoneNameArray;

    // Handle zone type array
    if (zoneTypeArray.length > 0) {
      let matchedZoneTypes = zoneTypeArray.filter(
        (type) => type.zoneTypeName?.toLowerCase() === obj.zoneType?.toLowerCase()
      );
      obj.zoneTypeArray = matchedZoneTypes.length === 1 ? [matchedZoneTypes[0]] : zoneTypeArray;
    } else {
      obj.zoneTypeArray = zoneTypeArray;
    }

    // Determine status
    if (zoneNameArray.length === 0 || vehicleTypeArray.length === 0) {
      obj.status = 2; // Discarded
    } else if (zoneNameArray.length !== 0 && vehicleTypeArray.length !== 0) {
      obj.status = 1; // Verified
    } else if (vehicleTypeArray.length === 1 && obj.zoneTypeArray.length === 1) {
      obj.status = 1; // Verified
    } else {
      obj.status = 0; // Unverified
    }

    // Add additional arrays
    obj.vehicleTypeArray = vehicleTypeArray;
    obj.cabOptionsArray = cabOptionsArray;
    obj.driverOptionsArray = driverOptionsArray;

    ans.push(obj);
  });

  return ans;
}
