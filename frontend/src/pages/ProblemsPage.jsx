import { Link } from "react-router";
import Navbar from "../components/Navbar";
import { useProblems } from "../hooks/useProblems";
import { PROBLEMS } from "../data/problems";
import { ChevronRightIcon, Code2Icon, Loader2Icon, Search } from "lucide-react";

import { useState } from "react";

function ProblemsPage() {
  const { data, isLoading, isError } = useProblems();
  const [searchQuery, setSearchQuery] = useState("");

  const allProblems = data?.problems || Object.values(PROBLEMS);

  const filteredProblems = allProblems.filter((problem) =>
    problem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    problem.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const easyProblems = filteredProblems.filter(p => p.difficulty.toLowerCase() === "easy");
  const mediumProblems = filteredProblems.filter(p => p.difficulty.toLowerCase() === "medium");
  const hardProblems = filteredProblems.filter(p => p.difficulty.toLowerCase() === "hard");

  const ProblemCard = ({ problem }) => (
    <Link
      key={problem.id}
      to={`/problem/${problem.id}`}
      className="card bg-base-100 hover:scale-[1.01] transition-transform mb-3"
    >
      <div className="card-body p-4 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Code2Icon className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold">
                    {problem.title}
                  </h2>
                </div>
                <p className="text-sm text-base-content/60">
                  {problem.category || "Algorithms"}
                </p>
              </div>
            </div>
            <p className="text-sm text-base-content/80 line-clamp-2">
              {problem.description?.text}
            </p>
          </div>
          <div className="flex items-center gap-2 text-primary shrink-0">
            <span className="font-medium hidden sm:inline">Solve</span>
            <ChevronRightIcon className="size-5" />
          </div>
        </div>
      </div>
    </Link>
  );

  return (
    <div className="min-h-screen bg-base-200">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold mb-3">Practice Problems</h1>
          <p className="text-base-content/70 mb-8">
            Sharpen your coding skills with these curated problems
          </p>

          <div className="max-w-md mx-auto relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-500" />
            </div>
            <input
              type="text"
              className="input input-bordered w-full pl-10 bg-base-100 focus:outline-none focus:border-primary rounded-full shadow-sm"
              placeholder="Search problems..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {isLoading && (
          <div className="flex items-center justify-center py-20">
            <Loader2Icon className="w-12 h-12 animate-spin text-primary" />
          </div>
        )}

        {isError && (
          <div className="alert alert-warning mb-8 max-w-2xl mx-auto flex justify-center">
            <span>
              Failed to load problems from LeetCode. Showing default problems.
            </span>
          </div>
        )}

        {!isLoading && (
          <div className="space-y-12">

            {easyProblems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-b border-base-300 pb-2">
                  <div className="w-2 h-8 bg-success rounded-full"></div>
                  <h2 className="text-2xl font-bold text-base-content">Easy</h2>
                  <span className="badge badge-success badge-sm badge-outline">{easyProblems.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {easyProblems.map((problem) => <ProblemCard key={problem.id} problem={problem} />)}
                </div>
              </section>
            )}

            {mediumProblems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-b border-base-300 pb-2">
                  <div className="w-2 h-8 bg-warning rounded-full"></div>
                  <h2 className="text-2xl font-bold text-base-content">Medium</h2>
                  <span className="badge badge-warning badge-sm badge-outline">{mediumProblems.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {mediumProblems.map((problem) => <ProblemCard key={problem.id} problem={problem} />)}
                </div>
              </section>
            )}

            {hardProblems.length > 0 && (
              <section>
                <div className="flex items-center gap-2 mb-4 border-b border-base-300 pb-2">
                  <div className="w-2 h-8 bg-error rounded-full"></div>
                  <h2 className="text-2xl font-bold text-base-content">Hard</h2>
                  <span className="badge badge-error badge-sm badge-outline">{hardProblems.length}</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {hardProblems.map((problem) => <ProblemCard key={problem.id} problem={problem} />)}
                </div>
              </section>
            )}

            {filteredProblems.length === 0 && (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">No problems found matching "{searchQuery}"</p>
              </div>
            )}

          </div>
        )}
      </div>
    </div>
  );
}
export default ProblemsPage;
