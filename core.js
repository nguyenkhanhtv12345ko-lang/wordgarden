export function normalize(text, accents=false){
 let result=text.toLocaleLowerCase('vi').normalize('NFC').replace(/[.,!?;:()“”"'’]/g,' ').replace(/[-–—]/g,' ').replace(/\s+/g,' ').trim();
 if(accents) result=result.normalize('NFD').replace(/\p{M}/gu,'').replace(/đ/g,'d');
 return result;
}
export function exactMatch(answer, aliases, accents=false){const n=normalize(answer,accents);return !!n&&aliases.some(x=>normalize(x,accents)===n);}
export function shuffled(items,random=Math.random){const result=[...items];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}return result;}
export function validateWords(data){
 const words=Array.isArray(data)?data:data?.words;
 if(!Array.isArray(words)||words.length>5000)throw Error('Sổ từ cần là danh sách tối đa 5.000 từ.');
 return words.map((w,i)=>{if(!w||!['en','vi'].every(k=>Array.isArray(w[k])&&w[k].length>0&&w[k].length<=50&&w[k].every(x=>typeof x==='string'&&x.trim()&&x.length<=500)))throw Error(`Từ thứ ${i+1} không đúng định dạng.`);return {id:`import-${i}-${Date.now()}`,en:w.en.map(x=>x.trim()),vi:w.vi.map(x=>x.trim()),note:typeof w.note==='string'?w.note.slice(0,2000):''};});
}
