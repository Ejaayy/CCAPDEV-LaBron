const Lab = require("../model/Lab");

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
    const { name, location, seatCount, seats } = req.body;

    if (!name || !seatCount) {
      return res.status(400).json({ message: "Name and seatCount are required" });
    }

    const seatCountNum = Number(seatCount);
    if (isNaN(seatCountNum) || seatCountNum < 1) {
      return res.status(400).json({ message: "seatCount must be a positive number" });
    }

    let seatsArray = seats;
    if (!seatsArray || !Array.isArray(seatsArray) || seatsArray.length === 0) {
      seatsArray = Array.from({ length: seatCountNum }, (_, i) => `A${i + 1}`);
    }

    const lab = new Lab({
      name,
      location: location || "",
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
