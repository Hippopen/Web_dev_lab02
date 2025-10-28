/** @jsx createElement */
import { createElement, VNode, ComponentProps } from './jsx-runtime';
// Import DataPoint và màu sắc từ data-service
import { DataPoint, drawPieSlice, CHART_COLORS } from './data-service';

/*
 * =================================================================
 * INTERFACE (Đã cập nhật)
 * =================================================================
 */

// Props bây giờ sử dụng mảng DataPoint[]
export interface ChartProps extends ComponentProps {
  data: DataPoint[];
  type: 'bar' | 'line' | 'pie';
}

/*
 * =================================================================
 * CÁC HÀM VẼ (Đã cập nhật)
 * =================================================================
 */

/**
 * 1. Vẽ biểu đồ cột
 */
function drawBarChart(ctx: CanvasRenderingContext2D, data: DataPoint[]) {
  const { width, height } = ctx.canvas;
  if (!data || data.length === 0) return;

  const barWidth = Math.max(20, width / data.length - 20); // Giảm khoảng cách, tăng độ rộng
  const maxValue = Math.max(...data.map(d => d.value));
  const textMargin = 20; // Lề cho chữ
  const chartHeight = height - textMargin;

  data.forEach((d, i) => {
    const barHeight = (d.value / maxValue) * (chartHeight - 20); // 20 là lề trên
    const x = (width / data.length) * i + (width / data.length - barWidth) / 2;
    const y = chartHeight - barHeight - 10; // 10 là lề dưới

    ctx.fillStyle = CHART_COLORS[i % CHART_COLORS.length]; // Dùng màu từ data-service
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Viết chữ
    ctx.fillStyle = '#333';
    ctx.textAlign = 'center';
    ctx.fillText(d.label, x + barWidth / 2, height - 5);
  });
}

/**
 * 2. Vẽ biểu đồ đường
 */
function drawLineChart(ctx: CanvasRenderingContext2D, data: DataPoint[]) {
  const { width, height } = ctx.canvas;
  if (!data || data.length === 0) return;

  const maxValue = Math.max(...data.map(d => d.value));
  const padding = 30;
  const chartWidth = width - 2 * padding;
  const chartHeight = height - 2 * padding;

  // Hàm nội bộ để lấy tọa độ
  const getCoords = (d: DataPoint, i: number) => {
    const x = (i / (data.length - 1)) * chartWidth + padding;
    const y = chartHeight - (d.value / maxValue) * chartHeight + padding;
    return { x, y };
  };

  // === BƯỚC 1: Vẽ đường line ===
  ctx.strokeStyle = CHART_COLORS[1]; // Màu xanh
  ctx.lineWidth = 3;
  ctx.beginPath(); // Bắt đầu đường line

  data.forEach((d, i) => {
    const { x, y } = getCoords(d, i);
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke(); // Vẽ đường line

  // === BƯỚC 2: Vẽ các điểm tròn (SAU KHI VẼ LINE) ===
  ctx.fillStyle = CHART_COLORS[1];
  data.forEach((d, i) => {
    const { x, y } = getCoords(d, i);
    
    ctx.beginPath(); // Bắt đầu path MỚI cho mỗi điểm tròn
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}

/**
 * 3. Vẽ biểu đồ tròn
 */
function drawPieChart(ctx: CanvasRenderingContext2D, data: DataPoint[]) {
  const { width, height } = ctx.canvas;
  if (!data || data.length === 0) return;
  
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) / 2 - 20; // Thu nhỏ lại
  const totalValue = data.reduce((sum, d) => sum + d.value, 0);

  let startAngle = -0.5 * Math.PI; // Bắt đầu từ 12 giờ

  data.forEach((d, i) => {
    const sliceAngle = (d.value / totalValue) * 2 * Math.PI;
    const endAngle = startAngle + sliceAngle;
    
    drawPieSlice(
      ctx,
      centerX,
      centerY,
      radius,
      startAngle,
      endAngle,
      CHART_COLORS[i % CHART_COLORS.length] // Dùng màu từ data-service
    );
    startAngle = endAngle;
  });
}

/*
 * =================================================================
 * COMPONENT CHÍNH (Không đổi)
 * =================================================================
 */

export const Chart = (props: ChartProps): VNode => {
  const { data, type } = props;

  const canvasRef = (canvasElement: Node) => {
    if (canvasElement && canvasElement instanceof HTMLCanvasElement) {
      const ctx = canvasElement.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
        
        // Cài đặt font chữ chung
        ctx.font = '14px Arial';
        
        switch (type) {
          case 'bar':
            drawBarChart(ctx, data);
            break;
          case 'line':
            drawLineChart(ctx, data);
            break;
          case 'pie':
            drawPieChart(ctx, data);
            break;
        }
      }
    }
  };

  return (
    <canvas
      className="chart-canvas"
      width="600"
      height="350"
      ref={canvasRef}
    >
      Your browser does not support the canvas element.
    </canvas>
  );
};