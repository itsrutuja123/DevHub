const express=require('express');
const mongoose= require('mongoose');
const Repository=require('../models/repoModel');
const User = require('../models/userModel');
const Issue = require('../models/issueModel');

async function createRepository(req,res){
    const {owner,name,issues,content,description,visibility}=req.body;


    try{
        if(!name){
            return res.status(400).json({error:"Repository name is Required!"});
        }
        if(!mongoose.Types.ObjectId.isValid(owner)){
            return res.status(400).json({error:"Username is invalid!"});
        }
        const newRepository = new Repository({
            name,
            description,
            visibility,
            owner,
            content,
            issues,
        });
        const result = await newRepository.save();
        res.status(201).json({
            message:"Yay! You created a repository! :)",
            repositoryID:result._id,
        });
    }
    catch(err){
        console.error("Ohh No! Error creating a repository!:",err.message,":(");
        res.status(500).send("Server Error!");
    }
};

async function getAllRepository(req,res){
    try{
        const repositories = await Repository.finf({}).populate('owner').populate('issues'); 
        res.json(repositories);
    }
    catch(err){
        console.error("Ohh No! Error during fetching repository!:",err.message,":(");
        res.status(500).send("Server Error!");
    }
};

async function fetchRepositoryById(req,res){
    const {id}= req.params;
    try{
        const repository = await Repository.find({_id:id}).populate('owner').populate('issues').toArray();
        res.json(repository);
    }
    catch(err){
        console.error("Ohh No! Error during fetching repository!:",err.message,":(");
        res.status(500).send("Oops! Server Error!");
    }
    
};
async function fetchRepositoryByName(req,res){
    const {name}= req.params;
    try{
        const repository = await Repository.find({name}).populate('owner').populate('issues');
        res.json(repository);
    }
    catch(err){
        console.error("Ohh No! Error during fetching repository!:",err.message,":(");
        res.status(500).send("Oops! Server Error!");
    }
    
};

async function fetchRepositoryForCurrentUser(req,res){
    
    const userId= req.user;
    try{
        const repositories= await Repository.find({owner:userId});
        if(!repositories || repositories.length==0){
            return res.status(404).json({error:"User repository not found!"});
        }
        res.json({message:"repositories found:",repositories});
    }
    catch(err){
        console.error("Ohh No! Error during fetching user repositories!:",err.message,":(");
        res.status(500).send("Server Error!");
    }
};

async function updateRepositoryById(req,res){
    
    const {id}=req.params;
    const {content,description}=req.body;
    try{
        const repository = await Repository.find({_id:id});
        if(!repository){
            return res.status(404).json({error:"User repository not found!"});
        }
        repository.content.push(content);
        repository.description=description;
        const updatedRepository = await Repository.save();
        res.json({message:"Yes! Repository updated!",repository:updatedRepository});
    }
    catch(err){
        console.error("Ohh No! Error during updating repositories!:",err.message);
        res.status(500).send("Oops! Server Error!");

    }
};
async function toggleVisibilityById(req,res){
    const {id}=req.params;
  
    try{
        const repository = await Repository.find({_id:id});
        if(!repository){
            return res.status(404).json({error:"User repository not found!"});
        }
        repository.visibility = !repository.visibility;
        const updatedRepository = await Repository.save();
        res.json({
            message:"Yes! Repository Visibility Updated! :)",
            repositoty: updatedRepository
        });
    }
    catch(err){
        console.error("Ohh No! Error during changing visibility repositories!:",err.message,":(");
        res.status(500).send("Oops! Server Error!");

    }
};

async function deleteRepositoryById(req,res){
    const {id}=req.params;
    try{
        const repository = await Repository.findByIdAndDelete(id);
        if(!repository){
            return res.status(404).json({error:"User repository not found!"});
        }
        res.json({message:"Yes! Repository Deeleted Successfully!"})
    }
    catch(err){
        console.error("Ohh No! Error deleting repository!:",err.message,":(");
        res.status(500).send("Oops! Server Error!");

    }
};

module.exports={
    createRepository,
    getAllRepository,
    fetchRepositoryById,
    fetchRepositoryByName,
    fetchRepositoryForCurrentUser,
    updateRepositoryById,
    toggleVisibilityById,
    deleteRepositoryById,



};

