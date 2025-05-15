document.addEventListener('DOMContentLoaded', () => {
  // Tạo container cho form
  const formContainer = document.createElement('div');
  formContainer.id = 'pawn-calculator';
  formContainer.innerHTML = `
    <h2>Công cụ tính toán cầm xe trả góp</h2>
    <form id="pawn-form">
      <label>Số tiền trả góp còn lại (VND):</label>
      <input type="number" id="remaining-loan" required min="0">
      <label>Kỳ hạn còn lại (tháng):</label>
      <input type="number" id="term" required min="1">
      <label>Ngân hàng cho vay:</label>
      <input type="text" id="bank" required>
      <button type="submit">Tính toán</button>
    </form>
    <div id="result"></div>
  `;

  // Chèn form vào đầu trang
  const target = document.querySelector('body');
  if (target) {
    target.insertBefore(formContainer, target.firstChild);
  }

  // Xử lý submit form
  const form = document.getElementById('pawn-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const remainingLoan = parseFloat(document.getElementById('remaining-loan').value);
    const term = parseInt(document.getElementById('term').value);
    const bank = document.getElementById('bank').value;

    // Ước tính giá trị xe (giả định số tiền trả góp chiếm 50% giá trị xe)
    const estimatedCarValue = remainingLoan / 0.5;
    const loanToValueRatio = remainingLoan / estimatedCarValue;

    // Xác định khả năng cầm và giá trị cầm tối đa
    let pawnPossibility = '';
    let pawnRatio = 0;
    if (loanToValueRatio < 0.5) {
      pawnPossibility = 'Cao (lên đến 90% giá trị xe)';
      pawnRatio = 0.9;
    } else if (loanToValueRatio < 0.7) {
      pawnPossibility = 'Trung bình (lên đến 70% giá trị xe)';
      pawnRatio = 0.7;
    } else {
      pawnPossibility = 'Thấp (lên đến 50% giá trị xe)';
      pawnRatio = 0.5;
    }

    const maxPawnValue = remainingLoan * pawnRatio;

    // Gợi ý phương án cầm
    const options = `
      <h3>Phương án cầm:</h3>
      <p><strong>Giữ xe (Cầm giấy tờ):</strong> Cầm giấy tờ xe, tiếp tục sử dụng xe. Lãi suất: 3-4%/tháng. Phù hợp nhu cầu ngắn hạn.</p>
      <p><strong>Không giữ xe:</strong> Cầm xe, niêm phong an toàn. Lãi suất: 2.5-3%/tháng. Phù hợp khoản vay lớn.</p>
    `;

    // Hiển thị kết quả
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
      <h3>Kết quả tính toán:</h3>
      <p><strong>Số tiền trả góp còn lại:</strong> ${remainingLoan.toLocaleString()} VND</p>
      <p><strong>Kỳ hạn còn lại:</strong> ${term} tháng</p>
      <p><strong>Ngân hàng:</strong> ${bank}</p>
      <p><strong>Khả năng cầm:</strong> ${pawnPossibility}</p>
      <p><strong>Giá trị cầm tối đa:</strong> ${maxPawnValue.toLocaleString()} VND</p>
      ${options}
    `;
  });
});