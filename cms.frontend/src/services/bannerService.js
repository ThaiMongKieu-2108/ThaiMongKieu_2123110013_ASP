import axiosClient from '../api/axiosClient';

const bannerService = {
    /**
     * Hàm lấy toàn bộ danh sách BANNER đang hoạt động từ Backend
     * Endpoint này kết nối tới BannersController trong ASP.NET Core
     */
    getAllBanners: () => {
        // Đường dẫn định tuyến khớp chính xác với cấu trúc định tuyến [Route("api/[controller]")] của Backend (BannersController)
        const url = '/banners';
        return axiosClient.get(url);
    }
};

export default bannerService;