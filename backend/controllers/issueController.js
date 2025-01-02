const express=require('express');
const mongoose= require('mongoose');
const Repository=require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

async function createIssue(req,res){
    const {title,description}=req.body;
    const{id}=req.params;
    try{
        const issue = new Issue({
            title,
            description,
            repository:id,
        });

        await issue.save();
    }
    catch(err){
        console.error("Ohh No! Error creating a issue!:",err.message,":(");
        res.status(500).send("Oops! Server Error!");
    }
    
};

async function  updateIssueById(req,res){
    const {id}=req.params;
    const{title,description,statu} = req.body;
    try{
        const issue = await Issue.findById(id);
        if(!issue){
            return res.status(404).json({error:"Issue not found"});
        }
        issue.title=title,
        issue.description=description,
        issue.status=status;

        await issue.save();
        res.json(issue,{message:"Issue Updated!"});
        
    }
    catch(err){
        console.error("Ohh No! Error updating a issue!:",err.message);
        res.status(500).send("Oops! Server Error!");
    }
};
async function deleteIssueById(req,res){
    const {id} = req.params;

    try{
        const issue = await Issue.findByIdAndDelete(id);
        if(!issue){
            return res.status(404).json({error:"Ohh No! Issue not found"});
        }
        res.json(issue,{message:"Yay! Issue deleted"});
    }
    catch(err){
        console.error("Ohh No! Error deleting a issue!:",err.message);
        res.status(500).send("Oops! Server Error!");
    }
};

async function getAllIssues(req,res){
    const {id}= req.params;
    try{
        const issue = await Issue.findById({repository:id});
        if(!issue){
            return res.status(404).json({error:"Issue not found"});
        }
        res.status(200).json(issue);
    }
    catch(err){
        console.error("Ohh No! Error getting a issue!:",err.message);
        res.status(500).send("Oops! Server Error!");
    }
};

async function getIssueById(req,res){
    const {id} = req.params;
    try{
        const issue = await Issue.findById(id);
        if(!issue){
            return res.status(404).json({error:"Issue not found"});
        }
        res.json(issue);
    }
    catch(err){
        console.error("Ohh No! Error getting a issue!:",err.message);
        res.status(500).send("Oops! Server Error!");
    }
};
module.exports={
    getIssueById,
    getAllIssues,
    deleteIssueById,
    deleteIssueById,
    updateIssueById,
    createIssue,
};
























