const Lab = require("../model/Lab");

//functions needed to generate seat labels
function generateSeats(seatCount, seatsPerRow = 3) {
  const rows = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const seats = [];
  let rowIndex = 0;

  for (let i = 0; i < seatCount; i++) {
    const colIndex = (i % seatsPerRow) + 1;       // 1,2,3 repeated
    const currentRow = Math.floor(i / seatsPerRow); // 0,0,0 then 1,1,1
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

    if (!name || !seatCount) {
      return res.status(400).json({ message: "Name and seatCount are required" });
    }

    const seatCountNum = Number(seatCount);
    if (isNaN(seatCountNum) || seatCountNum < 1) {
      return res.status(400).json({ message: "seatCount must be a positive number" });
    }

    // Always generate seats properly
    const seatsArray = generateSeats(seatCountNum, 3);

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
