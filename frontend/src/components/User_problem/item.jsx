import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Table, Tag, Badge, Spin } from "antd";
import { useAuth } from "../introduce/useAuth.jsx";
import { useLoading } from "../introduce/Loading.jsx";

const statusColors = {
    Submitted: 'green',
    Pending: 'orange',
    Partial: 'blue',
    Default: 'gray'
};

const difficultyColors = {
    Easy: 'green',
    Medium: 'gold',
    Hard: 'red',
    Unknown: 'gray'
};

const ProblemGrid = ({ selectedCategory, reload, searchTerm, sortByA, sortByB }) => {
    const { startLoading, stopLoading } = useLoading();
    const { user, loading: authLoading } = useAuth();
    const [problems, setProblems] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const navigate = useNavigate();

    const fetchProblems = useCallback(async () => {
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
            stopLoading();
        } catch (error) {
            console.error("Error fetching problems:", error);
            stopLoading();
        }
    }, [authLoading, reload, startLoading, stopLoading]);

    useEffect(() => {
        fetchProblems();
    }, [user, refreshTrigger]);

    const handleRowClick = (problem) => {
        navigate('/code/solve', {
            state: {
                problem,
                initialCode: {
                    javascript: '',
                    python: ''
                }
            }
        });
    };

    // Filtering and sorting
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

    const dataSource = filteredProblems.map((problem, index) => ({ ...problem, key: problem.id || index }));

    const columns = [
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: status => (
                <Badge
                    color={statusColors[status] || statusColors.Default}
                    text={status}
                />
            ),
            sorter: (a, b) => a.status.localeCompare(b.status),
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            render: (text, record) => (
                <div>
                    <strong>{text}</strong>
                    <p style={{ marginBottom: 0 }}>
                        <span dangerouslySetInnerHTML={{
                            __html: record.description.length > 100
                                ? record.description.substring(0, 100) + "..."
                                : record.description
                        }} />
                    </p>
                </div>
            ),
            sorter: (a, b) => a.title.localeCompare(b.title),
        },
        {
            title: 'Tags',
            dataIndex: 'tags',
            key: 'tags',
            render: tags => (
                <>
                    {tags.map(tag => (
                        <Tag key={tag} color="blue">
                            {tag}
                        </Tag>
                    ))}
                </>
            )
        },
        {
            title: 'Category',
            dataIndex: 'category',
            key: 'category',
            sorter: (a, b) => a.category.localeCompare(b.category),
        },
        {
            title: 'Difficulty',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: difficulty => (
                <Tag color={difficultyColors[difficulty] || difficultyColors.Unknown}>
                    {difficulty}
                </Tag>
            ),
            sorter: (a, b) => {
                const order = { Easy: 1, Medium: 2, Hard: 3, Unknown: 4 };
                return order[a.difficulty] - order[b.difficulty];
            }
        }
    ];

    return (
        <Spin spinning={authLoading}>
            <Table
                columns={columns}
                dataSource={dataSource}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record)
                })}
                pagination={{ pageSize: 10 }}
            />
        </Spin>
    );
};

export default ProblemGrid;

