const express=require('express');
const createIssue=(req,res)=>{
    res.send('Issue created');
};

const updateIssueById=(req,res)=>{
    res.send('Issue updated');
};
const deleteIssueById=(req,res)=>{
    res.send('Issue deleted');
};

const getAllIssues=(req,res)=>{
    res.send('Issues Fetched');
};

const getIssueById=(req,res)=>{
    res.send('Issue Details Obtained!');
};
module.exports={
    getIssueById,
    getAllIssues,
    deleteIssueById,
    deleteIssueById,
    updateIssueById,
    createIssue,




};
























