document.addEventListener('DOMContentLoaded', function() {
    // Lấy các phần tử DOM
    const valuateBtn = document.getElementById('valuate-btn');
    const sendInfoBtn = document.getElementById('send-info-btn');
    const resultDiv = document.getElementById('result');
    const valuationResult = document.getElementById('valuation-result');
    
    // Tải dữ liệu đã lưu (nếu có)
    loadSavedData();
    
    // Xử lý sự kiện click nút định giá
    valuateBtn.addEventListener('click', async function() {
        const brand = document.getElementById('brand').value;
        const model = document.getElementById('model').value;
        const year = document.getElementById('year').value;
        const mileage = document.getElementById('mileage').value;
        const condition = document.getElementById('condition').value;
        
        // Validate input
        if (!brand || !model || !year || !mileage || !condition) {
            alert('Vui lòng điền đầy đủ thông tin để định giá.');
            return;
        }
        
        // Lưu dữ liệu vào storage
        saveFormData();
        
        // Thực hiện định giá
        const carData = {
            brand: brand,
            model: model,
            year: parseInt(year),
            mileage: parseInt(mileage),
            condition: condition
        };
        
        try {
            // Định giá (có thể sử dụng API thực hoặc thuật toán nội bộ)
            const valuation = await valuateCar(carData);
            
            // Hiển thị kết quả
            valuationResult.textContent = formatCurrency(valuation) + " VND";
            resultDiv.style.display = 'block';
        } catch (error) {
            alert('Có lỗi xảy ra khi định giá: ' + error.message);
        }
    });
    
    // Xử lý sự kiện click nút gửi thông tin
    sendInfoBtn.addEventListener('click', async function() {
        const carInfo = getFormData();
        try {
            // Gửi thông tin đến server
            await sendCarInfoToStaff(carInfo);
            alert('Thông tin của bạn đã được gửi thành công! Nhân viên sẽ liên hệ sớm.');
        } catch (error) {
            alert('Có lỗi xảy ra khi gửi thông tin: ' + error.message);
        }
    });
    
    // Lưu dữ liệu form vào storage
    function saveFormData() {
        const formData = getFormData();
        chrome.storage.local.set({ 'carFormData': formData });
    }
    
    // Lấy dữ liệu từ form
    function getFormData() {
        return {
            brand: document.getElementById('brand').value,
            model: document.getElementById('model').value,
            year: document.getElementById('year').value,
            mileage: document.getElementById('mileage').value,
            condition: document.getElementById('condition').value
        };
    }
    
    // Tải dữ liệu đã lưu
    function loadSavedData() {
        chrome.storage.local.get('carFormData', function(data) {
            if (data.carFormData) {
                document.getElementById('brand').value = data.carFormData.brand || '';
                document.getElementById('model').value = data.carFormData.model || '';
                document.getElementById('year').value = data.carFormData.year || '';
                document.getElementById('mileage').value = data.carFormData.mileage || '';
                document.getElementById('condition').value = data.carFormData.condition || '';
            }
        });
    }
    
    // Định dạng tiền tệ
    function formatCurrency(amount) {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
    
    // Hàm định giá xe (thuật toán nội bộ hoặc API)
    async function valuateCar(carData) {
        
        // Phương pháp 2: Gọi API bên ngoài
        return await callValuationAPI(carData);
    }
     
    // Gọi API định giá bên ngoài (thay thế bằng API thực nếu có)
    async function callValuationAPI(carData) {
        try {
            const response = await fetch('https://camdotanphu.com/api/submit-info', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(carData)
            });
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            return data.valuation;
        } catch (error) {
            console.error('Error calling valuation API:', error);
            // Fallback to local valuation if API fails
            return calculateLocalValuation(carData);
        }
    }
    
    // Gửi thông tin xe cho nhân viên
    async function sendCarInfoToStaff(carInfo) {
        // Thêm thời gian yêu cầu
        carInfo.requestTime = new Date().toISOString();
        
        try {
             
             const response = await fetch('https://camdotanphu.com/api/submit-info', {
                method: 'POST',
                 headers: {
                     'Content-Type': 'application/json'
                 },
                 body: JSON.stringify(carInfo)
             });
            
            // Lưu request vào storage để lịch sử
            chrome.storage.local.get('carRequests', function(data) {
                const requests = data.carRequests || [];
                requests.push(carInfo);
                chrome.storage.local.set({ 'carRequests': requests });
            });
            
            // Mô phỏng delay API
            return new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
            console.error('Error sending car info:', error);
            throw error;
        }
    }
});