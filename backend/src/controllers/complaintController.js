const express = require('express');
const mongoose = require('mongoose');
const Complaint = require('../Models/Complaint'); // Assuming the schema is in a file named Complaint.js

const router = express.Router();

// Create a new complaint
const createComplaint = async (req, res) => {
  try {
    const { title, body } = req.body;
    const tourist = req.user.id; // Get tourist ID from token
    const complaint = new Complaint({ title, body, tourist });
    await complaint.save();
    res.status(201).send(complaint);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get a specific complaint by ID
const getComplaintById = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id).populate('tourist');
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    console.log(complaint);
    
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get all complaints by tourist ID
const getComplaints = async (req, res) => {
    try {
      let complaints;
      if (req.user?.type === 'tourist') {
        complaints = await Complaint.find({ tourist: req.user.id }).populate('tourist');
      } else {
        complaints = await Complaint.find().populate('tourist');
      }
      if (!complaints.length) {
        return res.status(404).send();
      }
      res.status(200).json(complaints);
    } catch (error) {
      res.status(500).send(error);
    }
  };

const updateComplaintStatus = async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).send(error);
  }
}

const addReplyToComplaint = async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    if (!complaint) {
      return res.status(404).json({ error: 'Complaint not found' });
    }
    complaint.replies.push({ reply: req.body.reply, date: new Date() });
    await complaint.save();
    res.status(200).json(complaint);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = {
  createComplaint,
  getComplaintById,
  getComplaints,
  updateComplaintStatus,
  addReplyToComplaint
};