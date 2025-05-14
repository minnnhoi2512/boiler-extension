// Kiểm tra xem trang hiện tại có liên quan đến xe ô tô không
function isCarRelatedPage() {
    const keywords = ['car', 'auto', 'vehicle', 'ô tô', 'xe hơi', 'xe ô tô', 'mua bán xe'];
    const pageContent = document.body.innerText.toLowerCase();
    
    return keywords.some(keyword => pageContent.includes(keyword));
}

// Tạo nút định giá xe
function createValuationButton() {
    // Chỉ hiển thị nút khi trang liên quan đến ô tô
    if (!isCarRelatedPage()) return;
    
    const button = document.createElement('button');
    button.textContent = 'Định giá xe';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '10000';
    button.style.padding = '10px 15px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.3)';
    button.style.cursor = 'pointer';
    button.style.fontSize = '14px';
    
    // Thêm sự kiện click
    button.addEventListener('click', function() {
        // Mở popup của extension
        chrome.runtime.sendMessage({action: "openPopup"});
    });
    
    // Thêm nút vào trang
    document.body.appendChild(button);
}

// Thực thi sau khi trang đã tải xong
window.addEventListener('load', function() {
    // Đợi một chút để trang hoàn thành render
    setTimeout(createValuationButton, 1000);
    
    // Tự động quét các phần tử xe trên trang và trích xuất thông tin
    autoDetectCarInfo();
});

// Tự động phát hiện thông tin xe trên trang
function autoDetectCarInfo() {
    try {
        //vd
        const brandRegex = /(toyota|honda|ford|mazda|kia|hyundai|bmw|mercedes|audi|lexus)/i;
        const yearRegex = /(20[0-2][0-9]|19[9][0-9])/; // Năm từ 1990-2029
        
        // Lấy toàn bộ nội dung trang
        const pageText = document.body.innerText;
        
        // Tìm kiếm thông tin
        const brandMatch = pageText.match(brandRegex);
        const yearMatch = pageText.match(yearRegex);
        
        // Nếu tìm thấy thông tin, lưu vào storage để sử dụng trong popup
        if (brandMatch || yearMatch) {
            const detectedInfo = {};
            
            if (brandMatch) {
                detectedInfo.brand = brandMatch[0].toLowerCase();
            }
            
            if (yearMatch) {
                detectedInfo.year = yearMatch[0];
            }
            
            // Lưu thông tin phát hiện được
            chrome.storage.local.set({ 'detectedCarInfo': detectedInfo });
        }
    } catch (e) {
        console.error('Error detecting car info:', e);
    }
}