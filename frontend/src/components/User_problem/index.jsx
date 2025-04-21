import React, { useState, useRef, useEffect } from "react";
import "../User_problem/index.css";
import ProductGrid from "./item.jsx";
import ProductForm from './ProblemForm.jsx';

import { useLoading } from "../introduce/Loading.jsx"

const ProductManager = () => {
  const { startLoading, stopLoading } = useLoading();
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [unselectedCategory, unsetSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [shouldReload, setShouldReload] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortByA, setSortByA] = useState("default");
  const [sortByB, setSortByB] = useState("Từ thấp lên cao");
  const categoriesRef = useRef(null);

  // Xử lý scroll categories
  const handleScrollLeft = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: -100,
        behavior: 'smooth',
      });
    }
  };

  const handleScrollRight = () => {
    if (categoriesRef.current) {
      categoriesRef.current.scrollBy({
        left: 100,
        behavior: 'smooth',
      });
    }
  };

  // Xử lý loading khi component mount
  useEffect(() => {
    startLoading();
    const timer = setTimeout(() => {
      stopLoading();
    }, 500); // Giảm thời gian loading xuống 0.5s

    return () => clearTimeout(timer);
  }, []);

  const turnonA = () => {
    setShowForm(true);
  };

  const turnoffA = () => {
    setShowForm(false);
  };

  const turnoffB = () => {
    setShowHistory(false);
  };

  const reload_categorie = (a) => {
    setCategories(a);
  };

  const refresh = () => {
    startLoading();
    setShouldReload(false);
    setTimeout(() => {
      setShouldReload(true);
      stopLoading();
    }, 300); // Giảm thời gian reload xuống 0.3s
  };

  return (
    <div className="product-manager">
      {showForm && <ProductForm turnoff={turnoffA} refresh={refresh} />}
    

      <div className="x">
        <div className="filter-bar">
          <div className="scrollable-categories" ref={categoriesRef}>
            {categories.length > 1 ? (
              categories.map((category) => (
                <button
                  style={{ marginRight: "9px" }}
                  key={category}
                  className={`category-button ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => {
                    if (unselectedCategory !== category) {
                      unsetSelectedCategory(category);
                      setSelectedCategory(category);
                    } else {
                      unsetSelectedCategory('');
                      setSelectedCategory('');
                    }
                  }}
                >
                  {category}
                </button>
              ))
            ) : (
              <h1 style={{ textAlign: "center", fontSize: "16px" }}>đây là nơi chia bài toán theo dạng</h1>
            )}
          </div>
          
        </div>
        
        <div className="extended-filter-bar">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select 
            value={sortByA}
            onChange={(e) => setSortByA(e.target.value)}
            className="sort-select"
          >
            <option value="default">Sắp xếp theo</option>
            <option value="Mức độ">Mức độ</option>
            <option value="Tên">Tên</option>
          </select>
          <select 
            value={sortByB}
            onChange={(e) => setSortByB(e.target.value)}
            className="sort-select"
          >
            <option value="Từ khó đến dễ">Từ khó đến dễ</option>
            <option value="Từ dễ đến khó">Từ dễ đến khó</option>
          </select>
        </div>
      </div>

      {/* Hiển thị grid sản phẩm */}
      {shouldReload && <ProductGrid 
        selectedCategory={selectedCategory} 
        reload={reload_categorie} 
        searchTerm={searchTerm} 
        sortByA={sortByA} 
        sortByB={sortByB}
      />}
    </div>
  );
};

export default ProductManager;