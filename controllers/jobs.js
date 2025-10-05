const { StatusCodes } = require("http-status-codes");
const BadRequestError = require("../errors/bad-request");
const Job = require("../models/Job");
const { NotFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ jobs });
};

const getJob = async (req, res) => {
  const job = await Job.findOne({
    createdBy: req.user.userId,
    _id: req.params.id,
  });
  res.status(StatusCodes.OK).json({ job });
};

const createJob = async (req, res) => {
  req.body.createdBy = req.user.userId;

  const job = await Job.create({ ...req.body });
  if (!job) {
    throw new BadRequestError("Something is wrong, Please Try Again");
  }
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: jobId },
  } = req;
  if(company==="" || position===""){
    throw new BadRequestError("Company or Position fields cannot be Empty")
  }
  const job = await Job.findOneAndUpdate(
    { createdBy: userId, _id: jobId },
    req.body,
    { new: true, runValidators: true }
  );
  if(!job){
    throw new NotFoundError(`No job with id ${jobId}`)
  }
  res.status(StatusCodes.OK).json({ job });
};
const deleteJob = async (req, res) => {
  const jobs = await Job.findOneAndDelete({
    createdBy: req.user.userId,
    _id: req.params.id,
  });
  res.status(StatusCodes.OK).json({ jobs });
};

module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob };
