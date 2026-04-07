const Lab = require("../model/Lab");
const Slot = require("../model/slot.model");

const MAX_SEAT_COUNT = 45;
const LOCATION_PATTERN = /^[A-Za-z][A-Za-z\s'-]* Building \d+(st|nd|rd|th) Floor$/;
const ROOM_CODE_PATTERN = /^[A-Z]\d{3}[A-Z]?$/;

function normalizeText(value) {
  return String(value || "").trim().replace(/\s+/g, " ");
}

function getBuildingNameFromLocation(location) {
  const match = location.match(/^(.*) Building \d+(st|nd|rd|th) Floor$/);
  return match ? match[1].trim() : "";
}

function validateLabPayload({ name, location, seatCount }) {
  const normalizedName = normalizeText(name);
  const normalizedLocation = normalizeText(location);
  const seatCountNum = Number(seatCount);

  if (!normalizedName || !normalizedLocation || !seatCountNum) {
    return "Name, location, and seatCount are required";
  }

  if (!LOCATION_PATTERN.test(normalizedLocation)) {
    return 'Location must follow "Building Name Building 5th Floor" format.';
  }

  const buildingName = getBuildingNameFromLocation(normalizedLocation);
  const expectedPrefix = `${buildingName} Computer Lab `;

  if (!normalizedName.startsWith(expectedPrefix)) {
    return `Room name must start with "${expectedPrefix}"`;
  }

  const roomCode = normalizedName.slice(expectedPrefix.length).trim();
  if (!ROOM_CODE_PATTERN.test(roomCode)) {
    return 'Room code must follow DLSU-style format like "G304" or "Y302C".';
  }

  if (!Number.isInteger(seatCountNum) || seatCountNum < 1) {
    return "seatCount must be a positive whole number";
  }

  if (seatCountNum > MAX_SEAT_COUNT) {
    return `seatCount cannot be more than ${MAX_SEAT_COUNT}`;
  }

  return null;
}

function generateSeats(seatCount, seatsPerRow = 3) {
  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const seats = [];

  for (let i = 0; i < seatCount; i++) {
    const colIndex = (i % seatsPerRow) + 1;
    const currentRow = Math.floor(i / seatsPerRow);
    if (currentRow >= rows.length) {
      throw new Error("Too many seats for the available row letters!");
    }
    seats.push(`${rows[currentRow]}${colIndex}`);
  }

  return seats;
}

exports.getAllLabs = async (req, res) => {
  try {
    const labs = await Lab.find().sort({ location: 1, name: 1 });
    res.status(200).json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createLab = async (req, res) => {
  try {
    const { name, location, seatCount } = req.body;
    const validationError = validateLabPayload({ name, location, seatCount });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const normalizedName = normalizeText(name);
    const normalizedLocation = normalizeText(location);
    const seatCountNum = Number(seatCount);
    const seatsArray = generateSeats(seatCountNum, 3);

    const lab = new Lab({
      name: normalizedName,
      location: normalizedLocation,
      seatCount: seatCountNum,
      seats: seatsArray,
    });

    await lab.save();
    res.status(201).json(lab);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A lab with this name already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateLab = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location, seatCount } = req.body;

    const validationError = validateLabPayload({ name, location, seatCount });
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const normalizedName = normalizeText(name);
    const normalizedLocation = normalizeText(location);
    const seatCountNum = Number(seatCount);
    const seatsArray = generateSeats(seatCountNum, 3);

    const updated = await Lab.findByIdAndUpdate(
      id,
      {
        name: normalizedName,
        location: normalizedLocation,
        seatCount: seatCountNum,
        seats: seatsArray,
      },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Lab not found" });
    }

    res.status(200).json(updated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "A lab with this name already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.deleteLab = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Lab.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Lab not found" });
    }

    await Slot.deleteMany({ lab: id });

    res.status(200).json({ message: "Lab deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
