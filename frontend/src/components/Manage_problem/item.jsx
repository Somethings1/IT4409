import React, { useState, useEffect } from "react";
import "../Manage_problem/item.css";
import { useAuth } from "../introduce/useAuth.jsx";
import ProblemDetail from "./ProblemDetail.jsx";
import DeleteProblemModal from "./DeleteProblemModal.jsx";
import { useLoading } from "../introduce/Loading.jsx";
import { notify } from '../Notification/notification.jsx';

const ProblemGrid = ({ selectedCategory, reload, searchTerm, sortByA, sortByB }) => {
  const { startLoading, stopLoading } = useLoading();
  const { user, loading } = useAuth();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [problemToDelete, setProblemToDelete] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  // Danh sách bài toán mẫu
  const sampleProblems = [
    {
      id: 1,
      title: "Circle Area",
      description: "Calculate the area of a circle given its radius",
      difficulty: "Medium",
      category: "Math",
      tags: ["Geometry"],
      solution: "Use the formula A = πr²"
    },
    {
      id: 2,
      title: "Next Character",
      description: "Given a character, return the next character in the alphabet",
      difficulty: "Easy",
      category: "String",
      tags: ["Alphabet"],
      solution: "Convert to ASCII code, increment, convert back"
    },
    {
      id: 3,
      title: "Quadratic Equation",
      description: "Solve a quadratic equation of form ax² + bx + c = 0",
      difficulty: "Medium",
      category: "Math",
      tags: ["Algebra"],
      solution: "Use the quadratic formula"
    },
    {
      id: 4,
      title: "Two Sum",
      description: "Find two numbers in an array that add up to a target",
      difficulty: "Easy",
      category: "Array",
      tags: ["Hash Table"],
      solution: "Use a hash map to store complements"
    }
  ];

  useEffect(() => {
    const fetchProblems = async () => {
      if (loading) return;
      
      try {
        startLoading();
        // Trong thực tế, bạn sẽ gọi API ở đây
        // const response = await fetch('http://localhost:8080/problems');
        // const data = await response.json();
        
        // Tạm thời sử dụng dữ liệu mẫu
        const data = sampleProblems;
        
        // Lấy danh sách categories từ dữ liệu
        const categories = [...new Set(data.map(problem => problem.category))];
        reload(categories);
        setProblems(data);
        stopLoading();
      } catch (error) {
        console.error("Error fetching problems:", error);
        stopLoading();
      }
    };

    fetchProblems();
  }, [user, refreshTrigger]);

  const showProblemDetail = (problem) => {
    setSelectedProblem(problem);
  };

  const handleDelete = async (problem) => {
    try {
      startLoading();
      // Trong thực tế, bạn sẽ gọi API xóa ở đây
      // await fetch(`http://localhost:8080/problems/${problem.id}`, { method: 'DELETE' });
      
      // Giả lập xóa thành công
      setTimeout(() => {
        notify(1, `Problem "${problem.title}" deleted successfully`, "Success");
        setRefreshTrigger(prev => !prev);
        setProblemToDelete(null);
        stopLoading();
      }, 500);
    } catch (error) {
      notify(2, `Failed to delete problem "${problem.title}"`, "Error");
      stopLoading();
    }
  };

  const handleUpdate = async (updatedProblem) => {
    try {
      startLoading();
      // Trong thực tế, bạn sẽ gọi API cập nhật ở đây
      // const response = await fetch(`http://localhost:8080/problems/${updatedProblem.id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(updatedProblem)
      // });
      
      // Giả lập cập nhật thành công
      setTimeout(() => {
        notify(1, `Problem "${updatedProblem.title}" updated successfully`, "Success");
        setSelectedProblem(null);
        setRefreshTrigger(prev => !prev);
        stopLoading();
      }, 500);
    } catch (error) {
      notify(2, `Failed to update problem "${updatedProblem.title}"`, "Error");
      stopLoading();
    }
  };

  const closeDetail = () => {
    setSelectedProblem(null);
  };

  const closeDeleteModal = () => {
    setProblemToDelete(null);
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
              {problem.category} {problem.tags && problem.tags.length > 0 && (
                <span className="problem-tags">• {problem.tags.join(", ")}</span>
              )}
            </div>
            
            <p className="problem-description">
              {problem.description.length > 100 
                ? `${problem.description.substring(0, 100)}...` 
                : problem.description}
            </p>
            
            <div className="problem-actions">
              <button 
                className="action-button view-button"
                onClick={() => showProblemDetail(problem)}
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