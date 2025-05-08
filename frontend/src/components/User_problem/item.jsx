import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../User_problem/item.css";
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


  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // asc hoặc desc

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
        status: problem.status?.toUpperCase() || "Pending",
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
          javascript: ``,
          python: ``,
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

  const showCodeEditor = (problem) => {
    navigate('/code/solve', {
      state: {
        problem,
        initialCode: {
          javascript:  '',
          python:  ''
        }
      }
    });
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "Submitted": return "status-submitted";
      case "Pending": return "status-pending";
      case "Partial": return "status-partial";
      default: return "";
    }
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };


  // Lọc bài toán theo các tiêu chí
  let filteredProblems = problems.slice();

  if (selectedCategory) {
    filteredProblems = filteredProblems.filter(problem =>
      problem.category === selectedCategory ||
      (problem.tags && problem.tags.includes(selectedCategory))
    );
  }

  if (searchTerm) {
    filteredProblems = filteredProblems.filter(problem =>
      problem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      problem.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortByA === "Tên") {
    filteredProblems.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortByA === "Mức độ") {
    const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
    filteredProblems.sort((a, b) => difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]);
  }

  if (sortByB === "Từ khó đến dễ") {
    filteredProblems.reverse();
  }

  if (sortField) {
    filteredProblems.sort((a, b) => {
      const valA = a[sortField] ?? '';
      const valB = b[sortField] ?? '';

      if (typeof valA === 'string') {
        return sortDirection === 'asc'
          ? valA.localeCompare(valB)
          : valB.localeCompare(valA);
      }

      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }


  if (sortField === 'difficulty') {
    const difficultyOrder = { "EASY": 1, "Medium": 2, "HARD": 3 };
    filteredProblems.sort((a, b) => {
      const valA = difficultyOrder[a.difficulty];
      const valB = difficultyOrder[b.difficulty];
      return sortDirection === 'asc' ? valA - valB : valB - valA;
    });
  }


  return (
    <>
      {problemToDelete && (
        <DeleteProblemModal
          problem={problemToDelete}
          onClose={closeDeleteModal}
          onDelete={handleDelete}
        />
      )}

      <div className="problem-table-container">
        <table className="problem-table">
         <thead>
          <tr>
            <th onClick={() => handleSort('status')}>
              Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('title')}>
              Title {sortField === 'title' && (sortDirection === 'asc' ? '↑' : '↓')}
            </th>
            <th onClick={() => handleSort('tags')}>
              Tags </th>
            <th onClick={() => handleSort('category')}>
              Category {sortField === 'category' && (sortDirection === 'asc' ? '↑' : '↓')}</th>
            <th onClick={() => handleSort('difficulty')}>
              Difficulty {sortField === 'difficulty' && (sortDirection === 'asc' ? '↑' : '↓')} </th>
          </tr>
        </thead>

          <tbody>
            {filteredProblems.map((problem) => (
              <tr
                key={problem.id}
                className="problem-row"
                onClick={() => showCodeEditor(problem)}
              >
                <td>
                  <span className={`status-badge ${getStatusClass(problem.status)}`}>
                    {problem.status}
                  </span>
                </td>
                {/* <td className="problem-title-cell">
                  <div className="problem-title">{problem.title}</div>
                  <div className="problem-description">
                    {problem.description.length > 100
                      ? `${problem.description.substring(0, 100)}...`
                      : problem.description}
                  </div>
                  <p className="problem-description">
                    {problem.description.length > 100
                      ? <span dangerouslySetInnerHTML={{ __html: problem.description.substring(0, 100) + '...' }} />
                      : <span dangerouslySetInnerHTML={{ __html: problem.description }} />}
                  </p>
                </td> */}
                <td className="problem-title-cell">
                  <div className="problem-title">{problem.title}</div>
                  <p className="problem-description">
                    {problem.description.length > 100
                      ? <span dangerouslySetInnerHTML={{ __html: problem.description.substring(0, 100) + '...' }} />
                      : <span dangerouslySetInnerHTML={{ __html: problem.description }} />}
                  </p>
                </td>


                <td>
                  {problem.tags && problem.tags.map(tag => (
                    <span key={tag} className="problem-tag">{tag}</span>
                  ))}
                </td>
                <td>{problem.category}</td>
                <td>
                  <span className={`difficulty-badge ${problem.difficulty.toLowerCase()}`}>
                    {problem.difficulty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProblemGrid;
