export const books = [
 {id:'update-1',title:'Lần 1',date:'31/10/2026',description:'Sinh hoạt, học tập và chuyến đi'},
 {id:'update-2',title:'Lần 2',date:'03/11/2026',description:'Gia đình, tính cách và các từ dễ nhầm'},
 {id:'update-3',title:'Lần 3',date:'04/11/2026',description:'Lễ hội, thú cưng và chương trình truyền hình'}
];
export const latestBookId='update-3';
export const bookChoices=['all',...books.map(b=>b.id),'personal'];
export function bookOf(word){
 if(bookChoices.includes(word.bookId)&&word.bookId!=='all')return word.bookId;
 const match=/^seed-(\d+)$/.exec(word.id||'');
 if(!match)return 'personal';
 const n=Number(match[1]);
 return n>=1&&n<=45?'update-1':n<=73&&n>=46?'update-2':n>=74&&n<=117?'update-3':'personal';
}
export function assignBooks(words){return words.map(w=>({...w,bookId:bookOf(w)}));}
export function wordsForBook(words,bookId){return bookId==='all'?[...words]:words.filter(w=>bookOf(w)===bookId);}
export function selectBook(savedId){return bookChoices.includes(savedId)?savedId:latestBookId;}
export function bookLabel(id){const b=books.find(b=>b.id===id);return b?`${b.title} · ${b.date}`:id==='all'?'Tất cả các lần':'Từ tự thêm';}
export function recordResult(before,ok){return {attempts:before.attempts+1,correct:before.correct+(ok?1:0),streak:ok?before.streak+1:0};}
