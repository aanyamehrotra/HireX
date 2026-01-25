import axios from "axios";
import { ENV } from "../lib/env.js";

let cachedProblems = null;
let lastFetch = null;
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

/**
 * Fetch specific problem details from LeetCode GraphQL API
 */
export async function getProblemDetails(titleSlug) {
    try {
        const response = await axios.post("https://leetcode.com/graphql", {
            query: `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            questionFrontendId
            title
            titleSlug
            content
            difficulty
            codeSnippets {
              lang
              langSlug
              code
            }
            sampleTestCase
          }
        }
      `,
            variables: { titleSlug },
        });

        const question = response.data.data.question;

        if (!question) return null;

        return {
            id: question.titleSlug, // Use slug as ID for consistency
            title: question.title,
            difficulty: question.difficulty,
            category: "Algorithms", // Default category
            description: {
                text: question.content, // This is HTML content
                isHtml: true,
            },
            starterCode: question.codeSnippets.reduce((acc, snippet) => {
                // Map LeetCode language slugs to our application's language keys
                const langMap = {
                    "cpp": "cpp",
                    "java": "java",
                    "python3": "python",
                    "javascript": "javascript",
                    // Add others if needed
                };
                if (langMap[snippet.langSlug]) {
                    acc[langMap[snippet.langSlug]] = snippet.code;
                }
                return acc;
            }, {}),
            // We'll use the sample test case as a basic example
            examples: [
                {
                    input: question.sampleTestCase,
                    output: "See description for details",
                }
            ],
            constraints: [], // Constraints are usually embedded in content HTML
        };
    } catch (error) {
        console.error(`Error fetching details for ${titleSlug}:`, error.message);
        return null;
    }
}

/**
 * Fetch problems from LeetCode API
 * Caches results for 1 hour to avoid excessive API calls
 */
async function fetchLeetCodeProblems() {
    try {
        const response = await axios.get("https://leetcode.com/api/problems/all/");
        const data = response.data;

        // Filter and transform LeetCode problems
        const problems = data.stat_status_pairs
            .filter((item) => !item.paid_only && !item.stat.question__hide) // Free problems only
            .slice(0, 100) // Limit to 100 most recent for performance
            .map((item) => ({
                id: item.stat.question__title_slug,
                title: item.stat.question__title,
                slug: item.stat.question__title_slug,
                difficulty: ["Easy", "Medium", "Hard"][item.difficulty.level - 1],
                category: "Algorithms", // LeetCode doesn't provide category in this endpoint
            }));

        return problems;
    } catch (error) {
        console.error("Error fetching LeetCode problems:", error.message);
        return [];
    }
}

/**
 * Get problems with caching
 */
export async function getProblems() {
    const now = Date.now();

    // Return cached data if still valid
    if (cachedProblems && lastFetch && now - lastFetch < CACHE_DURATION) {
        return cachedProblems;
    }

    // Fetch fresh data
    const problems = await fetchLeetCodeProblems();
    cachedProblems = problems;
    lastFetch = now;

    return problems;
}
