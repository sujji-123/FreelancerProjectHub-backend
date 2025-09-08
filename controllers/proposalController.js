// backend/controllers/proposalController.js
import Proposal from "../models/Proposal.js";
import Project from "../models/Project.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";

/**
 * Freelancer creates a proposal for a project
 * body: { projectId, coverLetter, bidAmount }
 */
export const createProposal = async (req, res) => {
  try {
    const { projectId, coverLetter, bidAmount } = req.body;
    const freelancerId = req.user.id; // auth middleware sets req.user

    const project = await Project.findById(projectId);
    if (!project) return res.status(404).json({ msg: "Project not found" });

    const prop = new Proposal({
      project: projectId,
      freelancer: freelancerId,
      coverLetter,
      bidAmount,
      status: "pending",
    });
    await prop.save();

    // create notification for project owner (client)
    await Notification.create({
      user: project.client,
      type: "proposal_submitted",
      payload: {
        projectId: project._id,
        projectTitle: project.title,
        proposalId: prop._id,
        freelancerId,
      },
    });

    res.status(201).json(prop);
  } catch (err) {
    console.error("createProposal:", err);
    res.status(500).send("Server Error");
  }
};

/**
 * Get all proposals for client's projects (client only)
 * route: GET /api/proposals/client
 */
export const getProposalsForClient = async (req, res) => {
  try {
    // find project ids owned by this client
    const clientId = req.user.id;
    const projects = await Project.find({ client: clientId }, "_id");
    const projectIds = projects.map((p) => p._id);
    const proposals = await Proposal.find({ project: { $in: projectIds } })
      .populate("freelancer", "name email")
      .populate("project", "title");

    res.json(proposals);
  } catch (err) {
    console.error("getProposalsForClient:", err);
    res.status(500).send("Server Error");
  }
};

/**
 * Accept proposal (client) -> marks proposal accepted, sets project.assignedFreelancer and updates project.status to allocated/in-progress
 * route: PATCH /api/proposals/:id/accept
 */
export const acceptProposal = async (req, res) => {
  try {
    const propId = req.params.id;
    const proposal = await Proposal.findById(propId).populate("project");
    if (!proposal) return res.status(404).json({ msg: "Proposal not found" });

    const project = await Project.findById(proposal.project._id);
    if (String(project.client) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    // mark all other proposals for same project as rejected
    await Proposal.updateMany(
      { project: project._id, _id: { $ne: propId } },
      { $set: { status: "rejected" } }
    );

    // accept this proposal
    proposal.status = "accepted";
    await proposal.save();

    // assign the freelancer to project and update status
    project.assignedFreelancer = proposal.freelancer;
    project.status = "allocated";
    await project.save();

    // create notifications: to freelancer & client
    await Notification.create({
      user: proposal.freelancer,
      type: "proposal_accepted",
      payload: { projectId: project._id, projectTitle: project.title, proposalId: proposal._id },
    });

    await Notification.create({
      user: project.client,
      type: "proposal_accepted_client",
      payload: { projectId: project._id, projectTitle: project.title, proposalId: proposal._id },
    });

    res.json({ proposal, project });
  } catch (err) {
    console.error("acceptProposal:", err);
    res.status(500).send("Server Error");
  }
};

/**
 * Reject proposal (client)
 * route: PATCH /api/proposals/:id/reject
 */
export const rejectProposal = async (req, res) => {
  try {
    const propId = req.params.id;
    const proposal = await Proposal.findById(propId).populate("project");
    if (!proposal) return res.status(404).json({ msg: "Proposal not found" });

    const project = await Project.findById(proposal.project._id);
    if (String(project.client) !== String(req.user.id)) {
      return res.status(403).json({ msg: "Forbidden" });
    }

    proposal.status = "rejected";
    await proposal.save();

    // notify freelancer
    await Notification.create({
      user: proposal.freelancer,
      type: "proposal_rejected",
      payload: { projectId: project._id, projectTitle: project.title, proposalId: proposal._id },
    });

    res.json(proposal);
  } catch (err) {
    console.error("rejectProposal:", err);
    res.status(500).send("Server Error");
  }
};
