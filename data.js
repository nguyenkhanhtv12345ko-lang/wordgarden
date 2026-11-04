import {festivalWords} from './vocabulary-festivals.js?v=6';
import {novemberWords} from './vocabulary-november.js?v=5';
// Stable identifiers retain progress and user changes across vocabulary updates.
const raw = [
['Prepare','chuẩn bị / sửa soạn / chuẩn bị sẵn / sửa soạn sẵn','Động từ. Prepare for a trip = chuẩn bị cho một chuyến đi.'],
['trip','chuyến đi / chuyến du lịch / chuyến đi chơi / chuyến đi du lịch','Danh từ chỉ một chuyến đi; không phải động từ đi du lịch.'],
['make money / earn money','kiếm tiền / kiếm được tiền / làm ra tiền'],
['make a lot of money / earn a lot of money','kiếm được nhiều tiền / kiếm nhiều tiền / kiếm rất nhiều tiền / kiếm được rất nhiều tiền / làm ra nhiều tiền'],
['Sports / sport','thể thao / môn thể thao / các môn thể thao','Sport có thể chỉ thể thao nói chung hoặc một môn thể thao.'],
['after school','sau giờ học / sau khi tan học / sau buổi học / lúc tan học / khi tan học'],
['in the school yard / in the schoolyard','ở trong sân trường / trong sân trường / ở sân trường / tại sân trường'],
['things','đồ vật / các đồ vật / những đồ vật / những thứ / các thứ / những vật / sự việc / các sự việc','Things có thể chỉ đồ vật hoặc sự việc tùy ngữ cảnh. Many things = nhiều thứ; everything = mọi thứ.'],
['on the weekend / at the weekend','vào cuối tuần / cuối tuần / vào dịp cuối tuần / dịp cuối tuần'],
['come back home / return home / go back home','về nhà / trở về nhà / quay về nhà / quay trở về nhà','Home là nhà. Về quê cần ngữ cảnh hoặc cụm return to one’s hometown.'],
['he comes back home / he returns home / he goes back home','anh ấy về nhà / anh ấy trở về nhà / anh ấy quay về nhà / anh ấy quay trở về nhà','Phân biệt với he returns to his hometown = anh ấy về quê.'],
['Hometown / home town','quê hương / quê nhà / quê / quê quán','Chỉ nơi mình sinh ra hoặc lớn lên; không phải quốc gia nói chung.'],
['draw','vẽ / vẽ tranh / vẽ hình','Nghĩa đang luyện: vẽ. Draw còn có các nghĩa khác theo ngữ cảnh.'],
['travel','du lịch / đi du lịch / đi lại / đi đây đó','Động từ. Travel có thể là đi du lịch hoặc di chuyển giữa các nơi.'],
['restaurant','nhà hàng / quán ăn / tiệm ăn'],
['enjoy','thưởng thức / tận hưởng / thích / yêu thích / thích thú / vui thích / cảm thấy thích thú / cảm thấy vui thích / hưởng thụ','Enjoy a meal = thưởng thức bữa ăn; enjoy a holiday = tận hưởng kỳ nghỉ; enjoy doing something = thích làm việc gì.'],
['delicious / tasty','ngon / thơm ngon / ngon miệng / ngon lành / rất ngon / ngon tuyệt / ngon tuyệt vời'],
['work','làm việc / làm / công việc / việc làm / hoạt động','Work là động từ làm việc hoặc danh từ công việc. Máy móc work = hoạt động.'],
['hard','chăm chỉ / vất vả / cật lực / hết sức / khó / khó khăn / cứng / cứng rắn','Trạng từ: work hard = làm việc chăm chỉ, vất vả. Tính từ: a hard exam = kỳ thi khó; hard wood = gỗ cứng.'],
['work hard','làm việc chăm chỉ / chăm chỉ làm việc / làm việc cật lực / làm việc vất vả / làm việc hết sức / nỗ lực làm việc'],
['go for a walk / take a walk','đi dạo / dạo bộ / đi bộ thư giãn / đi tản bộ / tản bộ','Cụm từ nhấn mạnh đi bộ để thư giãn. Walk đứng riêng có nghĩa rộng hơn là đi bộ.'],
['fresh air','không khí trong lành / bầu không khí trong lành / khí trời trong lành / không khí thoáng đãng'],
['park','công viên / vườn hoa / đỗ xe / đậu xe','Danh từ: công viên. Động từ: đỗ xe, đậu xe.'],
['the cinema / cinema / movie theater / movie theatre','rạp chiếu phim / rạp phim / rạp chiếu bóng','Cinema là rạp chiếu phim; movie là bộ phim; go to the cinema là đi xem phim.'],
['try to','cố gắng / cố gắng để / cố / cố để / tìm cách','Try to + động từ = cố gắng làm việc gì. Khác với try + V-ing = thử làm việc gì.'],
['fail','rớt / trượt / thi trượt / thi rớt / thất bại / không thành công / không đạt','Fail an exam = thi trượt; fail to do something = không làm được việc gì.'],
['exam / examination','kỳ thi / kì thi / bài thi','Nghĩa đang luyện: kỳ thi hoặc bài thi.'],
['many times','nhiều lần / rất nhiều lần / nhiều lần rồi'],
['work part-time / work part time','làm thêm / làm việc bán thời gian / làm bán thời gian / đi làm thêm / làm việc không toàn thời gian','Part-time nghĩa là bán thời gian; làm thêm trong ngữ cảnh này không phải làm tăng ca (work overtime).'],
['dinner','bữa tối / bữa ăn tối / cơm tối','Dinner là bữa ăn chính, thường vào buổi tối. Have dinner hoặc eat dinner = ăn tối.'],
['expensive / costly','mắc / đắt / đắt tiền / mắc tiền / tốn kém / đắt đỏ / giá cao / giá đắt / có giá cao'],
['food','thức ăn / đồ ăn / thực phẩm / lương thực','Food = thức ăn nói chung. Dish = một món ăn; meal = một bữa ăn.'],
['go to the market','đi chợ / đi đến chợ / tới chợ / đến chợ / đi ra chợ'],
['usually','thường lệ / thường / thông thường / thường thường / thường thì / thường hay','Chỉ điều thường xảy ra theo thói quen. Often nhấn mạnh tần suất thường xuyên.'],
['drink','uống / đồ uống / thức uống / nước uống','Động từ: uống. Danh từ: đồ uống; drink cũng có thể chỉ đồ uống có cồn trong ngữ cảnh riêng.'],
['drive','lái xe / lái ô tô / lái xe hơi / điều khiển xe','Động từ, thường nói về lái ô tô hoặc xe cơ giới.']
];
// New entries separate meanings that were previously grouped together.
const additions = [
['seed-37','seed-11','he returns to his hometown / he goes back to his hometown','anh ấy về quê / anh ấy trở về quê / anh ấy trở về quê hương / anh ấy quay về quê','Hometown là quê hương; home là nhà.'],
['seed-38','seed-32','dish','món ăn / một món ăn / đĩa / cái đĩa / dĩa / cái dĩa','Danh từ: món ăn hoặc đồ đựng thức ăn. Food là thức ăn nói chung.'],
['seed-39','seed-32','meal','bữa ăn / một bữa ăn / bữa cơm','Một lần ăn, chẳng hạn breakfast, lunch hoặc dinner; không đồng nghĩa riêng với món ăn.'],
['seed-40','seed-34','often / frequently','thường xuyên / thường / hay / nhiều lần','Nhấn mạnh điều xảy ra nhiều lần. Không có nghĩa là luôn luôn.'],
['seed-41','seed-24','movie / film','bộ phim / phim / một bộ phim','Bộ phim là tác phẩm; rạp chiếu phim là cinema hoặc movie theater.'],
['seed-42','seed-24','watch a movie / watch a film','xem phim / xem một bộ phim','Watch a movie = xem phim, không bắt buộc xem ở rạp.'],
['seed-43','seed-30','have dinner / eat dinner','ăn tối / ăn bữa tối / dùng bữa tối / ăn cơm tối','Phân biệt hành động ăn tối với danh từ dinner = bữa tối.'],
['seed-44','seed-10','return to my hometown / go back to my hometown','về quê / trở về quê / quay về quê / trở về quê hương / về quê nhà','Nghĩa về quê đã được tách khỏi come back home = về nhà.'],
['seed-45','seed-24','go to the cinema / go to the movies','đi xem phim / đi xem chiếu bóng / đến rạp xem phim / đi xem phim ở rạp','Nhấn mạnh đi đến rạp để xem phim.']
];
export const splitAliases = value => value.split(/\s*[/;]\s*/).map(x=>x.trim()).filter(Boolean);
export const vocabularyVersion = 4;
export const seedWords = [
 ...raw.map(([en,vi,note=''],i)=>({id:`seed-${i+1}`,en:splitAliases(en),vi:splitAliases(vi),note})),
 ...additions.map(([id,parent,en,vi,note])=>({id,en:splitAliases(en),vi:splitAliases(vi),note})),
 ...novemberWords,
 ...festivalWords
];
export const addedWordParents = Object.fromEntries(additions.map(([id,parent])=>[id,parent]));
