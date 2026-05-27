import express from "express";

import cors from "cors";

import dotenv from "dotenv";

import mutateRoute from "./routes/mutate";

import partialMutateRoute from"./routes/partialMutate";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json({
  limit: "10mb",
}));

app.use("/mutate", mutateRoute);
app.use("/partial_mutate", partialMutateRoute);

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, ()=>{console.log("Backend Running on Port : ",PORT)})