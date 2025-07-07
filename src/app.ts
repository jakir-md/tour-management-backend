//connects with our main app
//connects with controllers, models

import express, { Request, Response } from "express";
const app = express();

app.get("/", (req:Request, res:Response) => {
    res.status(200).json({
        message: "Welcome to our tour management system."
    })
})

export default app;