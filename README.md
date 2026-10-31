# Wordgarden 🌱

Website học từ vựng Anh–Việt bằng HTML/CSS/JavaScript, chạy trên GitHub Pages.

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
