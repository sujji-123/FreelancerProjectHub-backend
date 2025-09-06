import Proposal from "../models/Proposal.js";

export const createProposal = async (req, res) => {
  try {
    const { projectId, bidAmount, coverLetter } = req.body;
    const proposal = new Proposal({
      project: projectId,
      freelancer: req.user.id,
      bidAmount,
      coverLetter,
    });
    await proposal.save();
    res.status(201).json(proposal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

export const getProposals = async (req, res) => {
  try {
    const proposals = await Proposal.find()
      .populate("project")
      .populate("freelancer", "name email");
    res.json(proposals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
