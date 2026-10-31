// The supplied vocabulary is preserved, with common equivalents and usage notes.
const raw = [
['Prepare','chuẩn bị','I prepare for a trip.'],
['trip','chuyến đi / chuyến du lịch'],
['make money / earn money','kiếm tiền'],
['make a lot of money / earn a lot of money','kiếm được nhiều tiền / kiếm nhiều tiền'],
['Sports / sport','thể thao'],
['after school','sau giờ học / sau khi tan học / sau buổi học'],
['in the school yard / in the schoolyard','ở trong sân trường / trong sân trường / ở sân trường'],
['things','đồ vật / nhiều thứ / mọi thứ / những thứ / các thứ'],
['on the weekend / at the weekend','vào cuối tuần / cuối tuần'],
['come back home / return home','về nhà / trở về nhà / về quê','Come back home thường là về nhà; nghĩa về quê phụ thuộc ngữ cảnh.'],
['he comes back home / he returns to his hometown','anh ấy về quê / anh ấy trở về quê hương / anh ấy về nhà'],
['Hometown / home town','quê hương / quê nhà / quê'],
['draw','vẽ'],['travel','du lịch / đi du lịch'],['restaurant','nhà hàng'],
['enjoy','thưởng thức / tận hưởng / thích','I enjoy the fresh air.'],['delicious / tasty','ngon / thơm ngon / ngon miệng'],
['work','làm việc / công việc'],['hard','chăm chỉ / khó / cứng','Trong work hard, hard có nghĩa là chăm chỉ.'],
['work hard','làm việc chăm chỉ / chăm chỉ làm việc'],['go for a walk / take a walk','đi dạo / đi bộ / dạo bộ'],
['fresh air','không khí trong lành / không khí tươi mát'],['park','công viên'],
['the cinema / cinema / movie theater','rạp chiếu phim / rạp phim','Bạn gửi “the cinema / the movie: xem phim”. Cinema là rạp; movie là bộ phim; xem phim là watch a movie hoặc go to the cinema.'],
['try to','cố gắng / cố gắng để'],['fail','rớt / trượt / thi trượt / thất bại','Fail an exam = trượt kỳ thi.'],['exam / examination','kỳ thi / kì thi / bài thi'],
['many times','nhiều lần'],['work part-time / work part time','làm thêm / làm việc bán thời gian / làm bán thời gian'],
['dinner','bữa tối / bữa ăn tối / ăn tối','Dinner là bữa tối; ăn tối thường nói have dinner.'],['expensive / costly','mắc / đắt / đắt tiền / tốn kém'],
['food / dish / meal','món ăn / thức ăn / đồ ăn / bữa ăn','Food = thức ăn; dish = món ăn; meal = bữa ăn.'],
['go to the market','đi chợ / đi đến chợ'],['usually / often','thường / thường xuyên','Usually = thường, thường lệ; often = thường xuyên.'],
['drink','uống'],['drive','lái xe']
];
export const splitAliases = value => value.split(/\s*[/;]\s*/).map(x=>x.trim()).filter(Boolean);
export const seedWords = raw.map(([en,vi,note=''],i)=>({id:`seed-${i+1}`,en:splitAliases(en),vi:splitAliases(vi),note}));
