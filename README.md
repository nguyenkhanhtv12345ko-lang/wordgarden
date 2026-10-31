# Wordgarden 🌱

Website học từ vựng Anh–Việt bằng HTML/CSS/JavaScript, chạy trên GitHub Pages. Giao diện GitHub Dark, hỗ trợ điện thoại với thanh điều hướng dưới, nút lớn và ô nhập 16px.

- 36 mục từ ban đầu, có nghĩa tương đương và chú thích cách dùng.
- Luyện Anh → Việt, Việt → Anh hoặc ngẫu nhiên; trộn không lặp trong mỗi lượt.
- Gõ đáp án, gợi ý, nghe phát âm theo giọng trình duyệt, thống kê và lịch sử phiên.
- Thêm/sửa/xóa từ; xuất/nhập JSON; ghi chú tự lưu và tải văn bản.
- Tùy chọn tải mô hình MiniLM đa ngôn ngữ chạy trong Web Worker để đối chiếu nghĩa.

## Chạy tại máy

Cần Node.js 20 trở lên. Không cần cài thư viện cho website.

```sh
npm start
# http://127.0.0.1:4173
npm test
```

## Chấm ngữ nghĩa

Mặc định chỉ kiểm tra các đáp án trong sổ từ, có thể bỏ dấu tiếng Việt. Tại “Chấm điểm & AI”, bấm “Tải & bật mô hình AI”. Transformers.js 3.8.1 tải từ jsDelivr và mô hình `Xenova/paraphrase-multilingual-MiniLM-L12-v2` dạng q8 tải từ Hugging Face. Mạng, RAM và bộ nhớ trình duyệt ảnh hưởng đến tải lần đầu (vài trăm MB). Không cần API key. Chưa tải được AI vẫn dùng được sổ từ. Sau khi tải, mô hình có thể được browser lưu cache, nhưng việc giữ cache không được đảm bảo.

Đây là mô hình embedding để so sánh nghĩa, không phải mô hình dịch văn bản tự do. Ngưỡng mặc định 88% là heuristic, không phải xác suất đúng; từ gần nghĩa hoặc trái nghĩa vẫn có thể bị nhầm. Có chặn khác biệt phủ định đơn giản và cho phép người học sửa đánh giá. Cần kiểm tra với dữ liệu thực trước khi dùng để chấm thi. Các từ gợi ý sau câu trả lời là các từ trong sổ, ưu tiên từ có chung thành phần tiếng Anh, không phải định nghĩa AI sinh ra.

## Dữ liệu

Sổ từ, thống kê, tùy chọn và trang viết lưu bằng localStorage trên từng trình duyệt, không đồng bộ tài khoản hoặc thiết bị. Xuất JSON và tải văn bản để sao lưu. Xóa dữ liệu trình duyệt sẽ xóa dữ liệu này. Nội dung nhập được hiển thị bằng textContent, không được thực thi như HTML. Câu trả lời không gửi lên dịch vụ AI; khi tải tài nguyên, máy vẫn kết nối Google Fonts, jsDelivr và Hugging Face. Phát âm dùng dịch vụ giọng đọc của trình duyệt/hệ điều hành.

## Nguồn

- [Mô hình MiniLM ONNX](https://huggingface.co/Xenova/paraphrase-multilingual-MiniLM-L12-v2)
- [Transformers.js](https://huggingface.co/docs/transformers.js)

## GitHub Pages

Phát hành từ nhánh `main`, thư mục gốc `/`. Mọi đường dẫn dùng dạng tương đối để hỗ trợ project Pages. Không lưu thông tin đăng nhập trong mã nguồn.

## Gemini cá nhân

Trong “Chấm điểm & AI”, nhập khóa và kết nối. Khóa chỉ giữ trong biến JavaScript của tab, không lưu localStorage, cookie, tệp hay GitHub. Tải lại trang cần nhập lại khóa. Mô hình ưu tiên Gemini 3.8 Flash lấy từ danh sách Google trả về. Đáp án khớp sổ từ không gọi API; đáp án cần đối chiếu mới gửi từ hỏi, nghĩa tham chiếu và câu trả lời đến Google. Có thể dùng nút “Dịch & góp ý với Gemini” để gửi trang viết theo yêu cầu. API có thể tính phí, hết hạn mức hoặc quá tải; lỗi được thông báo, chế độ sổ từ vẫn dùng được. Đây là chế độ dùng khóa riêng trên thiết bị cá nhân; nếu muốn dùng chung một khóa cho nhiều người, cần backend giữ khóa.

Kiểm tra thực tế ngày 31/10/2026: xác thực danh sách mô hình thành công, nhưng Gemini 3.8 Flash trả HTTP 503 (high demand), nên chưa xác nhận được chấm/dịch trực tiếp với khóa cá nhân ở thời điểm này. Không có khóa thực nào được ghi trong dự án.

Đã kiểm tra trong trình duyệt: mô hình MiniLM tải thành công và chạy trong Web Worker; giao diện ở chiều rộng điện thoại 390px. 8 kiểm thử tự động cho sổ từ, chấm cơ bản, trộn từ, kiểm tra dữ liệu nhập và luồng Gemini đều đạt.
