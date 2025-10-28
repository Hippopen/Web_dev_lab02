/** @jsx createElement */
import { createElement, useState, VNode } from './jsx-runtime';
// Import mọi thứ chúng ta cần từ data-service
import { 
  DataPoint, 
  generateMockData, 
  // generateRandomDataPoint,
  filterData,
  DataFilters,
  CATEGORIES
} from './data-service';
import { Chart } from './chart';
import { Card } from './components';

export const DashboardApp = (): VNode => {
  
  // State 1: Dữ liệu GỐC (master data)
  const [masterData, setMasterData] = useState<DataPoint[]>(generateMockData(8));
  
  // State 2: Loại biểu đồ
  const [chartType, setChartType] = useState<'bar' | 'line' | 'pie'>('bar');
  
  // State 3: Bộ lọc (filters)
  const [filters, setFilters] = useState<DataFilters>({ category: 'all' });

  /*
   * CÁC HÀM XỬ LÝ SỰ KIỆN
   */

  const handleChartTypeChange = (e: Event) => {
    const newType = (e.target as HTMLSelectElement).value as 'bar' | 'line' | 'pie';
    setChartType(newType);
  };
  
  // TODO: Real-time data updates
  const handleAddData = () => {
    const currentData = masterData();
    
    // 1. Tìm số Product LỚN NHẤT hiện có
    let maxId = 0;
    currentData.forEach(item => {
      const id = extractNumber(item.label);
      if (id > maxId) {
        maxId = id;
      }
    });
    
    // 2. Tạo Product mới tuần tự (Product 9, 10, 11... hoặc 55, 56...)
    const newLabel = `Product ${maxId + 1}`;
    
    // 3. Tái tạo logic của generateRandomDataPoint (nhưng với label tuần tự)
    // (Chúng ta cần import CATEGORIES từ data-service.ts cho việc này)
    const newProduct: DataPoint = {
      label: newLabel,
      value: Math.floor(Math.random() * 5000) + 500, // Logic giá trị ngẫu nhiên
      category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)], // Logic category ngẫu nhiên
      date: new Date().toISOString(),
    };

    // 4. Cập nhật state
    setMasterData([...currentData, newProduct]);
  };
  
  // Gọi khi bấm nút "Remove Data" (giữ nguyên)
  const handleRemoveData = () => {
    // Xóa dữ liệu từ mảng GỐC
    setMasterData(masterData().slice(0, masterData().length - 1));
  };
  
  // TODO: Data filtering options
  const handleCategoryFilterChange = (e: Event) => {
    const newCategory = (e.target as HTMLSelectElement).value;
    setFilters({ ...filters(), category: newCategory });
  };

  /*
   * LOGIC RENDER
   */
  
  // Lọc dữ liệu GỐC dựa trên state 'filters'
  const filteredData = filterData(masterData(), filters());

  // === BẮT ĐẦU SỬA LỖI SẮP XẾP ===
  // Hàm này sẽ trích xuất số từ "Product X" một cách an toàn
  const extractNumber = (label: string): number => {
    // Regex tìm một hoặc nhiều chữ số ở CUỐI chuỗi
    const match = label.match(/\d+$/); 
    if (match) {
      return parseInt(match[0], 10);
    }
    return 0; // Trả về 0 nếu không tìm thấy số
  };

  // Sắp xếp dữ liệu TRƯỚC KHI VẼ
  const dataForChart = [...filteredData].sort((a, b) => {
    if (chartType() === 'line') {
      // Line chart PHẢI sắp xếp theo ngày
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    }
    // Bar/Pie chart sắp xếp theo SỐ được trích xuất từ label
    return extractNumber(a.label) - extractNumber(b.label);
  });
  // === KẾT THÚC SỬA LỖI ===

  // Tính tổng dựa trên dữ liệu đã lọc
  const totalValue = filteredData.reduce((sum, d) => sum + d.value, 0).toLocaleString();

  /*
   * RENDER RA GIAO DIỆN
   */
  return (
    <div className="dashboard-app">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>

      {/* TODO: Data filtering options */}
      <Card title="Controls" className="dashboard-controls">
        <div className="card-content">
          {/* 1. Chọn loại biểu đồ */}
          <div>
            <label for="chartType">Chart type: </label>
            <select id="chartType" value={chartType()} onChange={handleChartTypeChange}>
              <option value="bar">Bar</option>
              <option value="line">Line</option>
              <option value="pie">Pie</option>
            </select>
          </div>
          
          {/* 2. Lọc theo danh mục (MỚI) */}
          <div>
            <label for="categoryFilter">Sort by category: </label>
            <select id="categoryFilter" value={filters().category} onChange={handleCategoryFilterChange}>
              <option value="all">All</option>
              {CATEGORIES.map(cat => <option value={cat}>{cat}</option>)}
            </select>
          </div>

          {/* 3. Cập nhật real-time */}
          <button onClick={handleAddData}>Add</button>
          <button onClick={handleRemoveData} disabled={masterData().length <= 1}>
            Remove
          </button>
        </div>
      </Card>

      {/* TODO: Responsive grid layout */}
      <main className="dashboard-main">
        <Card title={`Revenue (Total: $${totalValue})`} className="chart-card">
          {/* Truyền dữ liệu ĐÃ LỌC vào biểu đồ */}
          <Chart data={filteredData} type={chartType()} />
        </Card>
      </main>
    </div>
  );
};