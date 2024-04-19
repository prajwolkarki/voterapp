const express = require("express");
const router = express.Router();
const Candidate = require("./../models/candidateModel");
const { jwtAuthMiddleware, generateToken } = require("./../middleware/jwt");
const User = require("../models/userModel");

const checkAdminRole = async (userID) => {
  try {
    const user = await User.findById(userID);
    return user.role === "admin";
  } catch (err) {
    return false;
  }
};
router.post("/", jwtAuthMiddleware,async (req, res) => {
  try {
    if (await !checkAdminRole(req.user.id)) {
      return res.status(404).json({ message: "user has no admin role" });
    }
    const data = req.body;
    const newCandidate = new Candidate(data);
    const response = await newCandidate.save();
    console.log("Data saved");

    res.status(200).json({ response: response });
  } catch (err) {
    console.log(err); // Log the error for debugging
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:candidateID",jwtAuthMiddleware, async (req, res) => {
  try {
    if (!checkAdminRole(req.user.id)) {
      return res.status(403).json({ error: "user has not admin role" });
    }
    const candidateID = req.params.candidateID;
    const updatedCandidateData = req.body;
    // console.log(updatedCandidateData);

    const response = await Person.findByIdAndUpdate(
      candidateID,
      updatedCandidateData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!response) {
      return res.status(403).json({ error: "Candidate not found" });
    }
    console.log("Candidate data updated");
    res.status(200).json(response);
  } catch (err) {
    console.log(err);
    res.status(404).json({ error: "Internal Server error" });
  }
});
router.delete('/:candidateID', jwtAuthMiddleware, async (req, res) => {
    try {
       
        if (!checkAdminRole(req.user.id)) {
            return res.status(403).json({ message: 'User does not have admin role' });
        }
        
        const candidateID = req.params.candidateID; 
        console.log(candidateID);
        
        const response = await Candidate.findByIdAndDelete(candidateID)
        console.log(response);
       
        if (!response) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        
        console.log('Candidate deleted:', response);
        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (err) {
        
        console.error('Error deleting candidate:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
router.get('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
    
    
    candidateID = req.params.candidateID;
    userId = req.user.id;

    try{
       
        const candidate = await Candidate.findById(candidateID);
        if(!candidate){
            return res.status(404).json({ message: 'Candidate not found' });
        }

        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({ message: 'user not found' });
        }
        if(user.role == 'admin'){
            return res.status(403).json({ message: 'admin is not allowed'});
        }
        if(user.isVoted){
            return res.status(400).json({ message: 'You have already voted' });
        }


        candidate.votes.push({user: userId})
        candidate.voteCount++;
        await candidate.save();


        user.isVoted = true
        await user.save();

        return res.status(200).json({ message: 'Vote recorded successfully' });
    }catch(err){
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
});


router.get('/vote/count', async (req, res) => {
    try{
     
        const candidate = await Candidate.find().sort({voteCount: 'desc'});

      
        const voteRecord = candidate.map((data)=>{
            return {
                party: data.party,
                count: data.voteCount
            }
        });

        return res.status(200).json(voteRecord);
    }catch(err){
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
});

router.get('/', async (req, res) => {
    try {
        
        const candidates = await Candidate.find({}, 'name party -_id');

        res.status(200).json(candidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
