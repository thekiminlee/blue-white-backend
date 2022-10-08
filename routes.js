import express from 'express';
import apiRouter from './api.js';

export default function(app) {
    app.use(express.json());

    app.use('/', apiRouter);
}