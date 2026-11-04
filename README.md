# Wordgarden

Web học từ vựng Anh–Việt với giao diện GitHub Dark tối ưu cho điện thoại.

- 117 mục từ ban đầu, nhiều nghĩa tương đương và chú thích cách dùng.
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

Ngày 03/11/2026: thêm 28 thẻ cho 21 dòng từ vựng mới; tách mọi cặp từ sang thẻ riêng. Các thẻ có ngữ cảnh trong câu hỏi, ví dụ song ngữ và ghi chú đối chiếu. Ngữ cảnh được giữ khi lưu, chỉnh sửa hoặc xuất/nhập. Nâng cấp một lần từ bộ 45 mục, không đưa lại từ cũ đã xóa, không ghi đè từ tự thêm trùng tiếng Anh.

Ngày 04/11/2026: thêm 44 thẻ về lễ hội, thú cưng và truyền hình. Prepare và interesting đã có nên không thêm trùng; tách delicious dish/food và organize/celebrate/hold a party theo nghĩa, ngữ cảnh. Bộ từ hiện có 117 thẻ.

## Học theo lần cập nhật

Chọn sổ ở đầu trang: lần 1 (31/10/2026, 45 thẻ), lần 2 (03/11/2026, 28 thẻ), lần 3 (04/11/2026, 44 thẻ). Lần đầu dùng tính năng mặc định chọn lần 3; sau đó nhớ lựa chọn của người học. Trộn, đảo chiều, sổ từ, gợi ý liên hệ và từ gợi ý cho trang viết đều giới hạn trong sổ đang chọn. Sổ trống không tự động lấy từ cũ để thay thế. Chọn Tất cả để ôn chung.

Các mã từ cũ được tự phân vào đúng lần cập nhật; từ tự thêm trước đây thuộc nhóm Từ tự thêm. Có thể đổi sổ khi thêm/sửa từ. Xuất sổ chỉ xuất lựa chọn hiện tại và giữ thông tin nhóm để nhập lại. Chọn Tất cả trước khi xuất để sao lưu toàn bộ. Thống kê được lưu riêng cho mỗi sổ; thống kê tổng trước đây vẫn được giữ trong Tất cả.
