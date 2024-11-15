export function getMergeResult(data, zone_zoneType, vehicleType) {
  let ans = [];

  // Create a map from zone_zoneType for quick lookup
  let zoneMap = new Map();
  zone_zoneType.forEach((zone) => {
    zoneMap.set(zone.zoneName.replaceAll(/\s+/g, '')?.toLowerCase(), {
      id: zone._id,
      zoneType: zone.zoneType.map((type) => ({
        id: type._id,
        zoneTypeName: type.zoneTypeName
      }))
    });
  });


  // Create a map from vehicleType for quick lookup
  let vehicleMap = new Map();
  vehicleType.forEach((vehicle) => {
    vehicleMap.set(vehicle.vehicleTypeName.replaceAll(/\s+/g, '')?.toLowerCase(), vehicle);
  });

  data.forEach((val) => {
    let obj = { ...val };

    // Arrays to hold matched zone names, zone types, and vehicle types
    let zoneNameArray = [];
    let zoneTypeArray = [];
    let vehicleTypeArray = [];

    // Get the zone data from the map
    let zoneData = zoneMap.get(obj.zoneName.replaceAll(/\s+/g, '')?.toLowerCase());
    if (zoneData) {
      zoneNameArray.push({ id: zoneData.id, name: obj.zoneName });
      zoneTypeArray.push(...zoneData.zoneType);
    }

    // Check if vehicleTypeName exists and is a string
    if (typeof obj.vehicleType === 'string') {
      let vehicleData = vehicleMap.get(obj.vehicleType.replaceAll(/\s+/g, '')?.toLowerCase());
      if (vehicleData) {
        vehicleTypeArray.push(vehicleData);
      }
    }

    // Add the new arrays to the object
    obj.zoneNameArray = zoneNameArray;

    // Handle zoneTypeArray based on matching with zoneType in main data
    if (zoneTypeArray.length > 0) {
      // Find matches based on zoneType in the main data
      let matchedZoneTypes = zoneTypeArray.filter((type) => type.zoneTypeName?.toLowerCase() === obj.zoneType?.toLowerCase());

      // If there's exactly one match, set zoneTypeArray to that match
      if (matchedZoneTypes.length === 1) {
        obj.zoneTypeArray = [matchedZoneTypes[0]]; // Keep only the matched type
      } else {
        obj.zoneTypeArray = zoneTypeArray; // Retain original zoneTypeArray
      }
    } else {
      obj.zoneTypeArray = zoneTypeArray; // Maintain original if no zone types found
    }

    // Determine the status based on the lengths of arrays
    if (zoneNameArray.length === 0 || vehicleTypeArray.length === 0) {
      obj.status = 2; // No zone or vehicle type, mark as discarded (2)
    } else if (zoneNameArray.length !== 0 && vehicleTypeArray.length !== 0) {
      obj.status = 1; // Both zone and vehicle type exist, mark as verified (1)
    } else if (vehicleTypeArray.length === 1 && obj.zoneTypeArray.length === 1) {
      obj.status = 1; // Both arrays have exactly 1 entry, mark as verified (1)
    } else {
      obj.status = 0; // Otherwise, mark as unverified (0)
    }

    // Add vehicle type array (remains unaffected)
    obj.vehicleTypeArray = vehicleTypeArray;

    ans.push(obj);
    console.log({zoneMap})
    console.log({zoneNameArray})
    console.log({zoneTypeArray})
    console.log({vehicleTypeArray})
  });


  return ans;
}
