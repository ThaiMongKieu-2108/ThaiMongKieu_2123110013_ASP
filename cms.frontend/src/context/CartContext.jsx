import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // 1. Khởi tạo: Tải giỏ hàng cũ từ localStorage lên nếu có
    useEffect(() => {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    // 2. Tự động lưu vào localStorage mỗi khi giỏ hàng thay đổi
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Hàm thêm sản phẩm vào giỏ hàng (Có kiểm tra trùng và cộng dồn số lượng)
    const addToCart = (product, quantity = 1) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find(item => item.id === product.id);
            if (existItem) {
                // Nếu vượt quá số kho hiện có thì chặn lại
                if (existItem.quantity + quantity > product.stockQuantity) {
                    alert(`⚠️ Không thể thêm! Số lượng trong giỏ hàng sẽ vượt quá tồn kho thực tế (${product.stockQuantity} sản phẩm).`);
                    return prevItems;
                }
                return prevItems.map(item =>
                    item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
                );
            }
            return [...prevItems, { ...product, quantity }];
        });
    };

    // Hàm cập nhật số lượng (tăng/giảm) tại trang Cart
    const updateQuantity = (productId, newQuantity, stockQuantity) => {
        if (newQuantity < 1) return;
        if (newQuantity > stockQuantity) {
            alert(`⚠️ Trong kho chỉ còn tối đa ${stockQuantity} sản phẩm!`);
            return;
        }
        setCartItems(prevItems =>
            prevItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item)
        );
    };

    // Hàm xóa 1 món đồ ra khỏi giỏ
    const removeFromCart = (productId) => {
        setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
    };

    // Hàm dọn sạch giỏ hàng về số 0 sau khi đặt hàng thành công
    const clearCart = () => {
        setCartItems([]);
    };

    // Tính tổng số lượng hiển thị trên Badge của Header
    const getCartCount = () => {
        return cartItems.reduce((total, item) => total + item.quantity, 0);
    };

    // Tính tổng tiền toàn bộ giỏ hàng
    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    return (
        <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, getCartCount, getCartTotal }}>
            {children}
        </CartContext.Provider>
    );
}