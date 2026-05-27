import { Router } from "express";

import { openai } from "../openai";

import { SYSTEM_PROMPT } from "../prompts";

const router = Router();

router.post("/", async (req, res) => {
  try {

    const {
      tree,
      prompt,
    } = req.body;

    const completion =
      await openai.chat.completions.create({
        model: "gpt-5-mini",

        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },

          // STEP 1
          {
            role: "user",
            content:
              "Understand the following UI registry JSON. Reply ONLY with: OK",
          },

          {
            role: "user",
            content: JSON.stringify(tree),
          },

          // STEP 2
          {
            role: "user",
            content:
              "Now wait for the final mutation request. Reply ONLY with: READY",
          },

          // STEP 3
          {
            role: "user",
            content: prompt,
          },
        ],

        temperature: 1,
      });

    const output =
      completion.choices[0]
        ?.message?.content || "{}";

    try {

      const parsed =
        JSON.parse(output);

      return res.json(parsed);

    } catch {

      return res.status(500).json({
        error:
          "Invalid JSON returned from model",

        raw: output,
      });
    }

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error: "Mutation failed",
    });
  }
});

export default router;