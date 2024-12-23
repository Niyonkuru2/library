import Member from '../models/member.js'

// Create a new member
const createMember = async (req, res) => {
  try {
    const { name, category } = req.body;
    
    const membershipCode = `M${Date.now().toString().slice(-5)}`;  // You could also use a custom pattern here
    
    // Create the new member record
    const newMember = new Member({
      membershipCode,
      name,
      category,
    });
    
    // Save the member record to the database
    await newMember.save();
    
    // Send a response with the new member's data
    res.status(201).json({
      message: 'Member created successfully',
      member: newMember
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all members
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find();
    res.status(200).json(members);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a member by membership code
const getMemberByCode = async (req, res) => {
  try {
    const member = await Member.findOne({ membershipCode: req.params.membershipCode });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json(member);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a member by membership code
const updateMember = async (req, res) => {
  try {
    const updatedMember = await Member.findOneAndUpdate(
      { membershipCode: req.params.membershipCode },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json({ message: 'Member updated successfully', member: updatedMember });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a member by membership code
const deleteMember = async (req, res) => {
  try {
    const deletedMember = await Member.findOneAndDelete({ membershipCode: req.params.membershipCode });
    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.status(200).json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export {createMember,getAllMembers,getMemberByCode,deleteMember,updateMember}
