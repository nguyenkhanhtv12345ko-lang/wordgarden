# Wordgarden

Web học từ vựng Anh–Việt với giao diện GitHub Dark tối ưu cho điện thoại.

- 45 mục từ ban đầu, nhiều nghĩa tương đương và chú thích cách dùng.
- Luyện Anh → Việt, Việt → Anh hoặc trộn cả hai chiều.
- Trộn không lặp trong một lượt; gõ đáp án, gợi ý, phát âm.
- Thêm/sửa/xóa từ; xuất/nhập JSON để sao lưu hoặc chuyển thiết bị.
- Góc viết tự lưu, chèn từ gợi ý và tải văn bản.
- Chấm theo sổ từ; bỏ qua chữ hoa và dấu câu, có tùy chọn chấp nhận tiếng Việt không dấu. Có thể tự sửa đánh giá.
- Không dùng AI, không cần API key. Đáp án chưa có trong danh sách cần được bổ sung vào sổ từ.

## Chạy tại máy

Cần Node.js 20 trở lên. Không cần cài thư viện. Chạy npm start rồi mở http://127.0.0.1:4173. Chạy npm test để kiểm tra.

## Dữ liệu

Từ vựng, thống kê, tùy chọn và bài viết lưu trên localStorage của từng trình duyệt, không đồng bộ tài khoản. Xóa dữ liệu trình duyệt sẽ xóa dữ liệu này. Xuất sổ từ JSON và tải bài viết để sao lưu.

Nội dung nhập được hiển thị dưới dạng văn bản, không thực thi như HTML. Google Fonts cung cấp phông chữ; phát âm dùng tính năng giọng đọc của trình duyệt/hệ điều hành. Không có dịch vụ AI hoặc khóa riêng trong bản hiện tại.

## GitHub Pages

Phát hành từ nhánh main, thư mục gốc /. Đường dẫn tài nguyên tương đối hỗ trợ project Pages.

Bộ từ phiên bản 2 bổ sung cách diễn đạt tiếng Việt và tách food/dish/meal, usually/often, dinner/have dinner, home/hometown, cinema/movie/watch a movie. Tự cập nhật các mục có sẵn theo mã ổn định; giữ từ tự thêm, giữ sửa đổi chủ động, ghép thêm đáp án do người học bổ sung. Không đưa lại mục gốc đã xóa; việc cập nhật chỉ chạy một lần.
