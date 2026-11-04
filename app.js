import {seedWords,splitAliases,vocabularyVersion} from './data.js?v=7';
import {upgradeVocabulary} from './vocabulary-update.js?v=7';
import {exactMatch,normalize,shuffled,validateWords,questionCaption} from './core.js?v=7';
import {books,latestBookId,bookChoices,bookOf,assignBooks,wordsForBook,selectBook,bookLabel,recordResult} from './books.js?v=7';
const $=id=>document.getElementById(id), KEY='wordgarden.v1';
let stored;try{stored=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
let words;try{words=stored?.words?validateWords(stored.words):structuredClone(seedWords);}catch{words=structuredClone(seedWords);}
// Imported identifiers are regenerated; restore original stable IDs for stored decks.
if(stored?.words&&words.length===stored.words.length)words.forEach((w,i)=>w.id=stored.words[i].id||w.id);
words=assignBooks(upgradeVocabulary(words,stored?.vocabularyVersion||0));
const emptyStats=()=>({correct:0,attempts:0,streak:0});
function readStats(value){return value&&['correct','attempts','streak'].every(k=>Number.isFinite(value[k])&&value[k]>=0)?{...value}:emptyStats();}
let overallStats=readStats(stored?.stats);
let bookStats=Object.fromEntries(bookChoices.filter(id=>id!=='all').map(id=>[id,readStats(stored?.bookStats?.[id])]));
let selectedBook=selectBook(stored?.selectedBook);
let stats=selectedBook==='all'?overallStats:bookStats[selectedBook];
let settings={accents:stored?.settings?.accents ?? true};
let mode='en-vi',queue=[],index=0,direction='en-vi',current=null,graded=false,locked=false,history=[],lastResult=null,hintUsed=false;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4000);}
function save(){if(selectedBook==='all')overallStats=stats;else bookStats[selectedBook]=stats;try{localStorage.setItem(KEY,JSON.stringify({version:1,vocabularyVersion,words,stats:overallStats,bookStats,selectedBook,settings}));}catch{toast('Không thể lưu trên thiết bị. Hãy xuất sổ từ để sao lưu.');}}
function updateStats(){ renderBooks();$('totalCount').textContent=selectedWords().length;$('navCount').textContent=words.length;$('correctCount').textContent=stats.correct;$('accuracy').textContent=stats.attempts?Math.round(stats.correct/stats.attempts*100)+'%':'—';$('streak').textContent=stats.streak;}
function selectedWords(){return wordsForBook(words,selectedBook);}
function renderBooks(){
 const select=$('bookSelect');select.replaceChildren();
 for(const id of [latestBookId,...books.map(b=>b.id).reverse().filter(id=>id!==latestBookId),'all','personal']){
  const option=document.createElement('option');option.value=id;option.textContent=`${bookLabel(id)} · ${wordsForBook(words,id).length} từ${id===latestBookId?' (mới nhất)':''}`;select.append(option);
 }
 select.value=selectedBook;$('bookTitle').textContent=bookLabel(selectedBook);
 const count=selectedWords().length;
 $('bookSummary').textContent=!count?'Sổ này đang trống. Thêm từ hoặc chọn sổ khác.':selectedBook==='all'?`Ôn chung toàn bộ ${count} thẻ trong sổ từ.`:`Chỉ luyện ${count} thẻ trong sổ này. Trộn từ và đảo chiều đều giữ trong sổ đang chọn.`;
 $('latestBook').hidden=selectedBook===latestBookId;
}
function changeBook(id){selectedBook=selectBook(id);stats=selectedBook==='all'?overallStats:bookStats[selectedBook];history=[];renderRecent();startSession();if($('page-library').classList.contains('active'))renderLibrary();if($('page-notes').classList.contains('active'))renderWritingWords();save();}
$('bookSelect').onchange=e=>changeBook(e.target.value);$('latestBook').onclick=()=>changeBook(latestBookId);
function startSession(){queue=shuffled(selectedWords());index=0;showQuestion();updateStats();}
function showQuestion(){
 graded=false;locked=false;lastResult=null;hintUsed=false;current=queue[index]||null;
 direction=mode==='mixed'?(Math.random()<.5?'en-vi':'vi-en'):mode;
 $('feedback').hidden=true;$('answer').value='';$('answer').disabled=!current;$('check').hidden=false;$('check').disabled=!current;$('next').hidden=true;$('hint').disabled=!current;$('skip').disabled=!current;$('speak').disabled=!current;
 $('questionNumber').textContent=current?`${String(index+1).padStart(2,'0')} / ${queue.length}`:'0 / 0';
 $('directionLabel').textContent=direction==='en-vi'?'ENGLISH → TIẾNG VIỆT':'TIẾNG VIỆT → ENGLISH';
 $('prompt').textContent=current?(direction==='en-vi'?current.en[0]:current.vi[0]):'Sổ đang chọn chưa có từ';
 $('promptCaption').textContent=current?questionCaption(current,direction):'Thêm từ vào sổ này hoặc chọn lần cập nhật khác.';
 $('answer').placeholder=direction==='en-vi'?'Gõ nghĩa tiếng Việt ở đây…':'Type the English word here…';
 $('answer').lang=direction==='en-vi'?'vi':'en';
 $('progressText').textContent=index?`Đã đi qua ${index} / ${queue.length} từ`:'Bắt đầu hành trình hôm nay';
 const p=queue.length?Math.round(index/queue.length*100):0;$('progressPercent').textContent=p+'%';$('progressBar').style.width=p+'%';
}
function appendText(parent,tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent.append(el);return el;}
function similarWords(){
 const tokens=new Set(normalize(current.en.join(' ')).split(' '));
 return selectedWords().filter(w=>w.id!==current.id).map(w=>({w,score:current.contrast&&w.en.some(e=>normalize(e)===normalize(current.contrast))?100:w.en.some(e=>normalize(e).split(' ').some(t=>tokens.has(t)))?2:0})).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.w);
}
function showResult(ok,{skipped=false}={}){
 graded=true;locked=false;$('check').hidden=true;$('next').hidden=false;$('hint').disabled=true;$('skip').disabled=true;$('answer').disabled=true;
 const before={...stats},allBefore={...overallStats};stats=recordResult(before,ok);overallStats=selectedBook==='all'?stats:recordResult(allBefore,ok);
 lastResult={before,allBefore,ok};save();updateStats();
 const f=$('feedback');f.replaceChildren();f.hidden=false;f.className=ok?'':'wrong';
 appendText(f,'strong',skipped?'Cùng ghi nhớ từ này nhé.':ok?(hintUsed?'Đúng rồi! Lần tới thử không cần gợi ý nhé.':'Đúng rồi! Thêm một hạt mầm lớn lên 🌱'):'Chưa khớp — cùng xem lại nhé.');
 appendText(f,'p',`Đáp án: ${(direction==='en-vi'?current.vi:current.en).join(' · ')}`);
 if(current.note)appendText(f,'p',current.note,'small');
 appendText(f,'p','Một vài từ trong sổ để liên hệ:','small');
 const chips=document.createElement('div');chips.className='chips';similarWords().forEach(w=>appendText(chips,'span',`${w.en[0]} · ${w.vi[0]}`));f.append(chips);
 const override=appendText(f,'button',ok?'Đánh dấu sai':'Mình trả lời đúng','secondary');override.type='button';override.onclick=()=>{
  if(!lastResult)return;const nextOK=!lastResult.ok;stats=recordResult(lastResult.before,nextOK);overallStats=selectedBook==='all'?stats:recordResult(lastResult.allBefore,nextOK);lastResult.ok=nextOK;
  history[0].ok=nextOK;f.className=nextOK?'':'wrong';f.querySelector('strong').textContent=nextOK?'Đã đánh dấu đúng theo đánh giá của bạn.':'Đã đánh dấu sai theo đánh giá của bạn.';override.textContent=nextOK?'Đánh dấu sai':'Mình trả lời đúng';save();updateStats();renderRecent();
 };
 history.unshift({en:current.en[0],vi:current.vi[0],ok});history=history.slice(0,5);renderRecent();
}
function renderRecent(){const list=$('recentList');list.replaceChildren();if(!history.length){appendText(list,'li','Những từ bạn vừa học sẽ xuất hiện ở đây.','empty-recent');return;}history.forEach(w=>{const li=document.createElement('li'),d=document.createElement('div');appendText(d,'span',w.en);appendText(d,'small',w.vi);li.append(d);appendText(li,'span',w.ok?'✓':'↻',`result-mark ${w.ok?'':'wrong'}`);list.append(li);});}
function check(event){event.preventDefault();if(graded||locked||!current||!$('answer').value.trim())return;
 const answer=$('answer').value.trim(),aliases=direction==='en-vi'?current.vi:current.en;
 showResult(exactMatch(answer,aliases,settings.accents&&direction==='en-vi'));
}
function advance(){if(index+1>=queue.length){toast(`Hoàn thành ${queue.length} từ! Bắt đầu lượt mới đã được trộn.`);startSession();}else{index++;showQuestion();}$('answer').focus();}
function openPage(name){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id==='page-'+name));document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page===name));$('pageTitle').textContent={practice:'Luyện từ vựng',library:'Sổ từ của tôi',notes:'Góc viết',settings:'Tùy chọn'}[name];if(name==='library')renderLibrary();if(name==='notes')renderWritingWords();window.scrollTo({top:0,behavior:'instant'});}
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>openPage(b.dataset.page));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>openPage(b.dataset.go));
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('selected',x===b));startSession();});
$('shuffle').onclick=()=>{startSession();toast('Đã trộn lại toàn bộ từ vựng.');};$('answerForm').onsubmit=check;$('next').onclick=advance;$('skip').onclick=()=>{if(!graded&&!locked&&current)showResult(false,{skipped:true});};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&graded&&$('page-practice').classList.contains('active')&&!$('wordDialog').open&&(['answer','next'].includes(document.activeElement.id)||document.activeElement===document.body)){e.preventDefault();advance();}});
$('hint').onclick=()=>{if(!current||locked)return;hintUsed=true;const target=(direction==='en-vi'?current.vi:current.en)[0];$('feedback').hidden=false;$('feedback').className='neutral';$('feedback').textContent=`Bắt đầu bằng “${target.slice(0,1)}…” · ${target.split(/\s+/).length} từ trong đáp án gợi ý.`;$('answer').focus();};
$('speak').onclick=()=>{if(!('speechSynthesis' in window))return toast('Trình duyệt này chưa hỗ trợ phát âm.');speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(direction==='en-vi'?current.en[0]:current.vi[0]);utterance.lang=direction==='en-vi'?'en-US':'vi-VN';utterance.rate=.85;speechSynthesis.speak(utterance);};
function renderLibrary(){const q=normalize($('search').value,true),list=$('wordList');list.replaceChildren();const filtered=selectedWords().filter(w=>normalize([...w.en,...w.vi].join(' '),true).includes(q));$('libraryScope').textContent=`${bookLabel(selectedBook)} · Hiển thị ${filtered.length} / ${selectedWords().length} từ`;$('export').textContent=selectedBook==='all'?'↓ Xuất tất cả':'↓ Xuất sổ đang chọn';if(!filtered.length)appendText(list,'p','Sổ đang chọn chưa có từ phù hợp. Hãy thêm từ hoặc chọn sổ khác.','muted');filtered.forEach(w=>{const card=document.createElement('article');card.className='word-card';appendText(card,'span',bookLabel(bookOf(w)),'book-tag');appendText(card,'h3',w.en.join(' / '));appendText(card,'p',w.vi.join(' · '));if(w.context)appendText(card,'p','Ngữ cảnh: '+w.context,'word-note');if(w.note)appendText(card,'p',w.note,'word-note');const actions=document.createElement('div');actions.className='word-actions';const edit=appendText(actions,'button','Chỉnh sửa','text-button'),del=appendText(actions,'button','Xóa','text-button');edit.onclick=()=>openWord(w);del.onclick=()=>{if(!confirm(`Xóa “${w.en[0]}” khỏi sổ từ?`))return;words=words.filter(x=>x.id!==w.id);save();renderLibrary();startSession();};card.append(actions);list.append(card);});}
function openWord(w){$('wordForm').reset();$('editId').value=w?.id||'';$('wordBook').value=w?bookOf(w):selectedBook==='all'?'personal':selectedBook;$('wordEn').value=w?.en.join(' / ')||'';$('wordVi').value=w?.vi.join(' / ')||'';$('wordNote').value=w?.note||'';$('wordContext').value=w?.context||'';$('dialogTitle').textContent=w?'Chăm chút một từ':'Thêm một hạt mầm';$('wordDialog').showModal();}
$('search').oninput=renderLibrary;$('addWord').onclick=()=>openWord();$('closeDialog').onclick=()=>$('wordDialog').close();
$('wordForm').onsubmit=e=>{e.preventDefault();const en=splitAliases($('wordEn').value),vi=splitAliases($('wordVi').value);if(!en.length||!vi.length)return toast('Điền ít nhất một từ cho mỗi ngôn ngữ.');const id=$('editId').value||crypto.randomUUID(),word={...words.find(w=>w.id===id),id,en,vi,bookId:$('wordBook').value,note:$('wordNote').value.trim(),context:$('wordContext').value.trim()},at=words.findIndex(w=>w.id===id);if(at>=0)words[at]=word;else words.push(word);save();$('wordDialog').close();renderLibrary();startSession();toast('Đã lưu vào sổ từ.');};
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
$('export').onclick=()=>download(`wordgarden-${selectedBook}.json`,JSON.stringify({version:1,words:selectedWords()},null,2),'application/json');
$('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>5e6)throw Error('Tệp quá lớn. Hãy dùng tệp dưới 5 MB.');const data=validateWords(JSON.parse(await file.text()));const existing=new Set(words.map(w=>normalize(w.en[0])));let added=0;for(const w of data){const key=normalize(w.en[0]);if(!existing.has(key)){words.push({...w,bookId:w.bookId||(selectedBook==='all'?'personal':selectedBook)});existing.add(key);added++;}}save();renderLibrary();startSession();toast(`Đã thêm ${added} từ mới; bỏ qua từ trùng.`);}catch(err){toast(err.message||'Không đọc được tệp JSON.');}e.target.value='';};
try{$('notes').value=localStorage.getItem('wordgarden.notes')||'';}catch{}
function noteCount(){const n=$('notes').value.trim();$('noteCount').textContent=(n?n.split(/\s+/).length:0)+' từ';}
$('notes').oninput=()=>{noteCount();try{localStorage.setItem('wordgarden.notes',$('notes').value);$('saveStatus').textContent='● Đã lưu';}catch{$('saveStatus').textContent='Chưa lưu được — hãy tải văn bản';}};
$('exportNotes').onclick=()=>download('wordgarden-notes.txt',$('notes').value,'text/plain;charset=utf-8');
function renderWritingWords(){const box=$('writingWords');box.replaceChildren();shuffled(selectedWords()).slice(0,8).forEach(w=>{const b=appendText(box,'button',w.en[0]);b.onclick=()=>{const n=$('notes');n.setRangeText(w.en[0],n.selectionStart,n.selectionEnd,'end');n.focus();n.dispatchEvent(new Event('input'));};});}
$('accentToggle').checked=settings.accents;$('accentToggle').onchange=e=>{settings.accents=e.target.checked;save();};
noteCount();startSession();save();
