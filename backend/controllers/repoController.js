const express=require('express');
const createRepository=(req,res)=>{
    res.send("Repository created");
};

const getAllRepository=(req,res)=>{
    res.send("All repositories fetched!");
};

const fetchRepositoryById=(req,res)=>{
    res.send("Repository Details Fetched!");
};
const fetchRepositoryByName=(req,res)=>{
    res.send("Repository Details Fetched!");
};

const fetchRepositoryForCurrentUser=(req,res)=>{
    res.send("All Repositories Details Fetched!");
};

const updateRepositoryById=(req,res)=>{
    res.send("Repository Details Updated!");
};
const toggleVisibilityById=(req,res)=>{
    res.send("Visibility changed!");
};

const deleteRepositoryById=(req,res)=>{
    res.send("Repository Deleted!");
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

