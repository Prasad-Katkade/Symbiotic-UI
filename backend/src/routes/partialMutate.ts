import { Router } from "express";

import { openai } from "../openai";

import {
  PARTIAL_MUTATION_PROMPT,
} from "../prompts";

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

        temperature: 1,

        messages: [
          {
            role: "system",
            content:
              PARTIAL_MUTATION_PROMPT,
          },

          {
            role: "user",
            content:
              JSON.stringify({
                tree,
                prompt,
              }),
          },
        ],
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
          "Invalid JSON returned",

        raw: output,
      });
    }

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      error:
        "Partial mutation failed",
    });
  }
});

export default router;