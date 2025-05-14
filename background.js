// Xử lý thông điệp từ content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "openPopup") {
    // Mở popup của extension
    chrome.action.openPopup();
  }
  // Luôn trả về true nếu sendResponse sẽ được gọi bất đồng bộ
  return true;
});