import express from "express";
import { getProblems, getProblemDetails } from "../services/leetcodeService.js";

const router = express.Router();

/**
 * GET /api/problems
 * Fetch all available coding problems from LeetCode
 */
router.get("/", async (req, res) => {
    try {
        const problems = await getProblems();
        res.json({ problems });
    } catch (error) {
        console.error("Error in getProblems controller:", error);
        res.status(500).json({ message: "Failed to fetch problems" });
    }
});

router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const problem = await getProblemDetails(id);

        if (!problem) {
            return res.status(404).json({ message: "Problem not found" });
        }

        res.json(problem);
    } catch (error) {
        console.error("Error in getProblemDetails controller:", error);
        res.status(500).json({ message: "Failed to fetch problem details" });
    }
});

export default router;
