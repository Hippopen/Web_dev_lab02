// src/data-service.ts

/*
 * =================================================================
 * PHẦN 1: ĐỊNH NGHĨA DỮ LIỆU VÀ CÁC HẰNG SỐ
 * =================================================================
 */

// TODO: Define structure for chart data [cite: 395]
// Định nghĩa cấu trúc cho một điểm dữ liệu
export interface DataPoint {
  label: string;  // Tên của mục (ví dụ: 'Item 1', 'Item 2')
  value: number;  // Giá trị (ví dụ: doanh số)
  category: string; // Danh mục (ví dụ: 'Electronics', 'Books')
  date: string;   // Ngày tháng (sử dụng chuỗi ISO cho dễ lọc)
}

// TODO: Define filtering options
// Định nghĩa cấu trúc cho bộ lọc
export interface DataFilters {
  category?: string; // Lọc theo danh mục
  startDate?: string; // Lọc theo ngày bắt đầu
  endDate?: string;   // Lọc theo ngày kết thúc
}

// Các hằng số để tạo dữ liệu giả
export const CATEGORIES = ['Electronics', 'Groceries', 'Apparel', 'Books'];

// Mảng màu để vẽ biểu đồ tròn (Pie Chart)
export const CHART_COLORS = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];

/*
 * =================================================================
 * PHẦN 2: CÁC HÀM TIỆN ÍCH TẠO DỮ LIỆU
 * =================================================================
 */

// Hàm nội bộ: Lấy một danh mục ngẫu nhiên
function getRandomCategory(): string {
  return CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
}

// Hàm nội bộ: Lấy một ngày ngẫu nhiên trong 6 tháng qua
function getRandomDate(): string {
  const endDate = new Date();
  const startDate = new Date();
  startDate.setMonth(endDate.getMonth() - 6);
  
  const randomTime = startDate.getTime() + Math.random() * (endDate.getTime() - startDate.getTime());
  return new Date(randomTime).toISOString();
}

/**
 * TODO: Method to generate mock data [cite: 404]
 * Tạo một bộ dữ liệu mẫu (dataset)
 * @param count Số lượng điểm dữ liệu cần tạo
 * @returns Mảng các DataPoint
 */
export function generateMockData(count: number = 8): DataPoint[] {
  const data: DataPoint[] = [];
  for (let i = 0; i < count; i++) {
    data.push({
      label: `Product ${i + 1}`,
      value: Math.floor(Math.random() * 5000) + 500, // Giá trị từ 500 đến 5500
      category: getRandomCategory(),
      date: getRandomDate(),
    });
  }
  return data;
}

/**
 * TODO: Method to simulate real-time updates [cite: 405]
 * Tạo một điểm dữ liệu ngẫu nhiên mới (dùng cho nút "Add Data")
 * @returns Một DataPoint mới
 */
export function generateRandomDataPoint(): DataPoint {
  const newIndex = Math.floor(Math.random() * 50) + 10;
  return {
    label: `Product ${newIndex}`,
    value: Math.floor(Math.random() * 5000) + 500,
    category: getRandomCategory(),
    date: new Date().toISOString(), // Dữ liệu mới có ngày là hiện tại
  };
}

/*
 * =================================================================
 * PHẦN 3: CÁC HÀM LỌC VÀ TIỆN ÍCH BIỂU ĐỒ
 * =================================================================
 */

/**
 * TODO: Method to filter data by category/date [cite: 406]
 * Lọc mảng dữ liệu dựa trên các tiêu chí
 * @param data Mảng dữ liệu gốc
 * @param filters Đối tượng chứa các tiêu chí lọc
 * @returns Mảng dữ liệu đã được lọc
 */
export function filterData(data: DataPoint[], filters: DataFilters): DataPoint[] {
  return data.filter(point => {
    // 1. Lọc theo danh mục
    if (filters.category && filters.category !== 'all' && point.category !== filters.category) {
      return false;
    }
    // 2. Lọc theo ngày bắt đầu (so sánh chuỗi ISO)
    if (filters.startDate && point.date < filters.startDate) {
      return false;
    }
    // 3. Lọc theo ngày kết thúc
    if (filters.endDate && point.date > filters.endDate) {
      return false;
    }
    // Nếu vượt qua tất cả, giữ lại
    return true;
  });
}

/**
 * Hàm tiện ích để vẽ một miếng bánh (dùng cho Pie Chart)
 * (Liên quan đến việc vẽ dữ liệu, nên để ở đây)
 */
export function drawPieSlice(
  ctx: CanvasRenderingContext2D,
  centerX: number,
  centerY: number,
  radius: number,
  startAngle: number,
  endAngle: number,
  color: string
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
}