import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../Manage_problem/item.css";
import { useAuth } from "../introduce/useAuth.jsx";
import ProblemDetail from "./ProblemDetail.jsx";
import DeleteProblemModal from "./DeleteProblemModal.jsx";
import { useLoading } from "../introduce/Loading.jsx";
import { notify } from "../Notification/notification.jsx";

const ProblemGrid = ({ selectedCategory, reload, searchTerm, sortByA, sortByB }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user, loading: authLoading } = useAuth(); // Rename to avoid confusion
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Use number for cleaner toggle
  const navigate = useNavigate();


  // Memoize fetchProblems to ensure stable function reference
  const fetchProblems = useCallback(async () => {
    // Skip if auth is still loading
    if (authLoading) {
      console.log("Auth loading, skipping fetch");
      return;
    }

    try {
      startLoading();
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("No access token found");
        stopLoading();
        return;
      }

      const response = await fetch(import.meta.env.VITE_API_URL + "/problems", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch problems");
      }

      const data = await response.json();
      console.log("API data:", data.data.result);

      // Deduplicate problems by id
      const uniqueProblems = Array.from(
        new Map(data.data.result.map((item) => [item.id, item])).values()
      );

      const formattedProblems = uniqueProblems.map((problem) => ({
        id: problem.id,
        title: problem.title || "Untitled",
        description: problem.description || "",
        difficulty: problem.difficulty === "MEDIUM" ? "Medium" : problem.difficulty || "Unknown",
        category: problem.difficulty === "MEDIUM" ? "Math" : "Other",
        tags: Array.isArray(problem.tags) ? problem.tags.map((tag) => tag.name) : [],
        solution: problem.solution || "x = (c - b) / a",
        example: problem.example || {
          input: "2 -4 8",
          output: "6.0",
          explanation: "2x -4 = 8 → 2x=12 → x=6",
        },
        constraints: problem.constraints || "",
        implementations: problem.implementations || {
          javascript: `function solveLinearEquation(a, b, c) {\n  return (c - b) / a;\n}`,
          python: `a, b, c = map(int, input().split())\nprint((c - b) / a)`,
        },
      }));

      const categories = [...new Set(formattedProblems.map((problem) => problem.category))];
      reload(categories);
      setProblems(formattedProblems);
      console.log("Formatted problems:", formattedProblems);
      stopLoading();
    } catch (error) {
      console.error("Error fetching problems:", error);
      stopLoading();
    }
  }, [authLoading,  ]); // Dependencies for fetchProblems

  // Run fetchProblems when user or refreshTrigger changes
  useEffect(() => {
    fetchProblems();
  }, [fetchProblems, user, refreshTrigger]);

  const showCodeEditor = useCallback((problem) => {
    navigate("/home/code-editor", {
      state: {
        problem,
        initialCode: {
          javascript: problem.implementations?.javascript || "",
          python: problem.implementations?.python || "",
        },
      },
    });
  }, [navigate]);

  const showProblemDetail = useCallback((problem) => {
    setSelectedProblem(problem);
  }, []);

  const handleDelete = useCallback(async (problem) => {
    try {
      startLoading();
      // Simulate API delete
      setTimeout(() => {
        notify(1, `Problem "${problem.title}" deleted successfully`, "Success");
        setRefreshTrigger((prev) => prev + 1); // Increment for cleaner toggle
        setProblemToDelete(null);
        stopLoading();
      }, 500);
    } catch (error) {
      notify(2, `Failed to delete problem "${problem.title}"`, "Error");
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  const handleUpdate = useCallback((updatedProblem) => {
    setProblems((prev) =>
      prev.map((p) => (p.id === updatedProblem.id ? updatedProblem : p))
    );
    setSelectedProblem(null);
    notify(1, `Problem "${updatedProblem.title}" updated successfully`, "Success");
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const closeDetail = useCallback(() => {
    setSelectedProblem(null);
  }, []);

  const closeDeleteModal = useCallback(() => {
    setProblemToDelete(null);
  }, []);

  // Filter and sort problems
  let filteredProblems = problems.slice();

  if (selectedCategory) {
    filteredProblems = filteredProblems.filter(
      (problem) =>
        problem.category === selectedCategory ||
        (problem.tags && problem.tags.includes(selectedCategory))
    );
  }

  if (searchTerm) {
    filteredProblems = filteredProblems.filter(
      (problem) =>
        problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        problem.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortByA === "Tên") {
    filteredProblems.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortByA === "Mức độ") {
    const difficultyOrder = { EASY: 1, Medium: 2, HARD: 3 };
    filteredProblems.sort(
      (a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0)
    );
  }

  if (sortByB === "Từ khó đến dễ") {
    filteredProblems.reverse();
  }

  return (
    <>
      {selectedProblem && (
        <ProblemDetail
          problem={selectedProblem}
          onClose={closeDetail}
          onUpdate={handleUpdate}
        />
      )}

      {problemToDelete && (
        <DeleteProblemModal
          problem={problemToDelete}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
        />
      )}

      <div className="problem-grid">
        {filteredProblems.map((problem) => (
          <div className="problem-card" key={problem.id}>
            <div className="problem-header">
              <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                {problem.difficulty}
              </span>
              <h3 className="problem-title">{problem.title}</h3>
            </div>

            <div className="problem-category">
              {problem.category}{" "}
              {problem.tags && problem.tags.length > 0 && (
                <span className="problem-tags">• {problem.tags.join(", ")}</span>
              )}
            </div>

            {/* <p className="problem-description">
              {problem.description.length > 100
                ? `${problem.description.substring(0, 100)}...`
                : problem.description}
            </p>
             */}
            <p className="problem-description">
              {problem.description.length > 100
                ? <span dangerouslySetInnerHTML={{ __html: problem.description.substring(0, 100) + '...' }} />
                : <span dangerouslySetInnerHTML={{ __html: problem.description }} />}
            </p>

            
             
            <div className="problem-actions">
              <button
                className="action-button view-button"
                onClick={() => showCodeEditor(problem)}
              >
                View
              </button>
              <button
                className="action-button edit-button"
                onClick={() => showProblemDetail(problem)}
              >
                Edit
              </button>
              <button
                className="action-button delete-button"
                onClick={() => setProblemToDelete(problem)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default ProblemGrid;
