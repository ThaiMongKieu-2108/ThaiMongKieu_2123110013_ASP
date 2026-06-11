import React, { useState, useEffect } from 'react';
import { blogService } from '../../services/blogService';

function BlogSidebar({ onSelectCategory }) {
    const [categories, setCategories] = useState([]);
    const [activeId, setActiveId] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const data = await blogService.getBlogCategories();
            setCategories(data);
        };
        fetchCategories();
    }, []);

    const handleItemClick = (id) => {
        setActiveId(id);
        onSelectCategory(id); // Kích hoạt hàm lọc ở component cha
    };

    return (
        <div className="card border-0 shadow-sm p-3" style={{ borderRadius: '12px' }}>
            <h5 className="font-weight-bold mb-3 pb-2 border-bottom" style={{ color: '#005088' }}>Danh Mục Tin Tức</h5>
            <div className="list-group list-group-flush">
                <button
                    onClick={() => handleItemClick(null)}
                    className={`list-group-item list-group-item-action border-0 px-2 py-2 rounded ${activeId === null ? 'active font-weight-bold text-white' : 'text-secondary'}`}
                    style={activeId === null ? { backgroundColor: '#11CAA0' } : {}}
                >
                    <i className="fas fa-tags mr-2"></i> Tất cả bài viết
                </button>

                {categories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => handleItemClick(cat.id)}
                        className={`list-group-item list-group-item-action border-0 px-2 py-2 mt-1 rounded ${activeId === cat.id ? 'active font-weight-bold text-white' : 'text-secondary'}`}
                        style={activeId === cat.id ? { backgroundColor: '#11CAA0' } : {}}
                    >
                        <i className="fas fa-chevron-right mr-2" style={{ fontSize: '12px' }}></i> {cat.name}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default BlogSidebar;