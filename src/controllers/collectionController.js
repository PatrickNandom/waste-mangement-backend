const CollectionPoint = require("../models/collectionPointModel");

//CONTROLLER FOR CREATING A COLLECTION POINT

exports.defineCollectionPoint = async (req, res) => {
  try {
    const { name, location, capacity, wasteTypes } = req.body;
    if (
      !name ||
      !location ||
      !location.coordinates ||
      !capacity ||
      !wasteTypes
    ) {
      return res.status(400).json({ error: "All fields are required." });
    }

    // Validate waste types
    const validWasteTypes = ["organic", "recyclable", "hazardous"];
    for (let type of wasteTypes) {
      if (!validWasteTypes.includes(type)) {
        return res.status(400).json({ error: `Invalid waste type: ${type}` });
      }
    }

    // Create the new collection point
    let collectionPoint = new CollectionPoint({
      name,
      location: {
        type: "Point",
        coordinates: location.coordinates,
      },
      capacity,
      wasteTypes,
    });

    // Save the collection point to the database
    await collectionPoint.save();

    // Respond with the created collection point
    res.status(201).json({
      message: "Collection point created successfully",
      collectionPoint,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error. Please try again later." });
  }
};
