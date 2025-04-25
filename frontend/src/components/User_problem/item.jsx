import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import "./item.css";
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
  const navigate = useNavigate();

  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // asc hoặc desc
  

  // Danh sách bài toán mẫu
  const sampleProblems = [
    {
      id: 1,
      title: "Next Character",
      description: "Find the next character in the English alphabet, wrapping from z to a",
      difficulty: "Medium",
      category: "String",
      tags: ["Alphabet", "ASCII"],
      status: "Submitted", // Thêm trạng thái
      solution: "Use character codes with wrap-around logic:\n1. Get ASCII code of input\n2. If 'z', return 'a'\n3. Else return next character",
      example: {
        input: "'d'",
        output: "'e'",
        explanation: "Next after 'd' is 'e'"
      },
      edgeCases: [
        { input: "'z'", output: "'a'", explanation: "Wraps around alphabet" },
        { input: "'a'", output: "'b'" }
      ],
      constraints: "Input is a lowercase English letter (a-z)",
      implementations: {
        javascript: `function nextChar(c) {\n  return c === 'z' ? 'a' : String.fromCharCode(c.charCodeAt(0) + 1);\n}`,
        python: `c = input().strip()\nprint('a' if c == 'z' else chr(ord(c) + 1))`
      }
    },
    {
      id: 2,
      title: "Circle Calculations",
      description: "Calculate circumference and area of a circle given its radius",
      difficulty: "Medium",
      category: "Math",
      tags: ["Geometry", "Formulas"],
      status: "Pending", // Thêm trạng thái
      solution: "Circumference = 2πr\nArea = πr²\nUse π=3.14 and round to 2 decimal places",
      example: {
        input: "5",
        output: "31.40 78.50",
        explanation: "Circumference: 2×3.14×5=31.40\nArea: 3.14×5²=78.50"
      },
      constraints: "1 ≤ r ≤ 1000",
      implementations: {
        javascript: `function circleCalculations(r) {\n  const pi = 3.14;\n  const circumference = (2 * pi * r).toFixed(2);\n  const area = (pi * r * r).toFixed(2);\n  return [circumference, area].join(' ');\n}`,
        python: `import math\nr = int(input())\npi = 3.14\nprint(f"{2*pi*r:.2f} {pi*r*r:.2f}")`
      }
    },
    {
      id: 3,
      title: "Rectangle Calculation",
      description: "Calculate perimeter and area of a rectangle for office partition design",
      difficulty: "Easy",
      category: "Math",
      tags: ["Geometry", "Formulas"],
      status: "Partial", // Thêm trạng thái
      solution: "Perimeter = 2*(length + width)\nArea = length * width",
      example: {
        input: "5 3",
        output: "16 15",
        explanation: "Perimeter: 2*(5+3)=16\nArea: 5×3=15"
      },
      constraints: "1 ≤ width ≤ length ≤ 100",
      implementations: {
        javascript: `function calculateRectangle(l, w) {\n  return [2*(l+w), l*w].join(' ');\n}`,
        python: `length, width = map(int, input().split())\nprint(2*(length+width), length*width)`
      }
    },
    {
      id: 4,
      title: "Basic Arithmetic Operations",
      description: "Compute sum, difference, product, and integer quotient of two numbers",
      difficulty: "Easy",
      category: "Math",
      tags: ["Arithmetic"],
      status: "Submitted", // Thêm trạng thái
      solution: "Use +, -, *, and // operators",
      example: {
        input: "7 3",
        output: "10\n4\n21\n2",
        explanation: "Sum: 7+3=10\nDifference: 7-3=4\nProduct: 7×3=21\nQuotient: 7÷3≈2 (floor division)"
      },
      constraints: "0 ≤ a, b ≤ 10⁹",
      implementations: {
        javascript: `function basicOperations(a, b) {\n  console.log(a+b);\n  console.log(a-b);\n  console.log(a*b);\n  console.log(Math.floor(a/b));\n}`,
        python: `a, b = map(int, input().split())\nprint(a+b, a-b, a*b, a//b, sep='\\n')`
      }
    },
    {
      id: 5,
      title: "Linear Equation Solver",
      description: "Find the solution to a linear equation ax + b = c",
      difficulty: "Medium",
      category: "Math",
      tags: ["Algebra", "Equations"],
      status: "Pending", // Thêm trạng thái
      solution: "x = (c - b) / a",
      example: {
        input: "2 -4 8",
        output: "6.0",
        explanation: "2x -4 = 8 → 2x=12 → x=6"
      },
      constraints: "-20 ≤ a,b,c ≤ 20\na ≠ 0",
      implementations: {
        javascript: `function solveLinearEquation(a, b, c) {\n  return (c - b) / a;\n}`,
        python: `a, b, c = map(int, input().split())\nprint((c - b) / a)`
      }
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

  const showCodeEditor = (problem) => {
    navigate('/code/code-editor', { 
      state: { 
        problem,
        initialCode: {
          javascript: problem.implementations?.javascript || '',
          python: problem.implementations?.python || ''
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
    const difficultyOrder = { "Easy": 1, "Medium": 2, "Hard": 3 };
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
                <td className="problem-title-cell">
                  <div className="problem-title">{problem.title}</div>
                  <div className="problem-description">
                    {problem.description.length > 100 
                      ? `${problem.description.substring(0, 100)}...` 
                      : problem.description}
                  </div>
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