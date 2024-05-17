const Emp = require("./model/emp.model.js");
const express = require("express");
const router = express.Router();

// Basic start page info
router.get("/", (req, res) => {
  res.send("Employee & Designation"); //emp: name, date of join, desg. desg: title,
});

// Route to get all emp (with or without search query)
router.get("/comp/emp", async (req, res) => {
  try {
    const query = req.query.q;
    let emp;
    if (query) {
      emp = await Emp.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { dtjoin: { $regex: query, $options: "i" } },
          { desg: query.match(/^[0-9a-fA-F]{24}$/) ? query : null }, // Check if query is ObjectId
          { desg_name: { $regex: query, $options: "i" } }, // Fallback to desg_name search
        ].filter(Boolean), // Filter out null values
      }).populate("desg");;
    } else {
      emp = await Emp.find({}).populate("desg");
    }
    res.status(200).json(emp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to get a specific emp by ID
router.get("/comp/emp:id", async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Emp.findById(id).populate("desg", "desg_name _id");
    res.status(200).json(emp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new person in emp
router.post("/comp/emp", async (req, res) => {
  try {
    const existingEmp = await Emp.find({
      name: req.body.name,
      desg: req.body.desg,
    });
    if (existingEmp.length === 0) {
      const emp = await Emp.create(req.body);
      return res.status(200).json(emp);
    }
    return res.status(400).send("Employee in the designation already exists.");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to update a list item
router.patch("/comp/emp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const emp = await Emp.findByIdAndUpdate(id, {
      name: req.body.name,
      desg: req.body.desg,
      dtjoin: req.body.dtjoin,
    });
    if (!emp) {
      return res.status(404).json({ message: "Employee not found" });
    }
    const updatedEmp = await Emp.findById(id).populate("desg", "desg_name _id");
    res.status(200).json(updatedEmp);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to delete an emp
router.delete("/comp/emp/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(404).json({ message: "Employee id not found" });
    const emp = await Emp.findByIdAndDelete(id);
    //if (!emp) return res.status(404).json({ message: "Employee not found" });
    res.status(200).json({ message: "Employee deleted", emp });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
