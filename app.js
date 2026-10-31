import {seedWords,splitAliases} from './data.js';
import {exactMatch,normalize,shuffled,validateWords} from './core.js';
const $=id=>document.getElementById(id), KEY='wordgarden.v1';
let stored;try{stored=JSON.parse(localStorage.getItem(KEY)||'null');}catch{}
let words;try{words=stored?.words?validateWords(stored.words):structuredClone(seedWords);}catch{words=structuredClone(seedWords);}
// Imported identifiers are regenerated; restore original stable IDs for stored decks.
if(stored?.words&&words.length===stored.words.length)words.forEach((w,i)=>w.id=stored.words[i].id||w.id);
let stats=stored?.stats&&Number.isFinite(stored.stats.attempts)?stored.stats:{correct:0,attempts:0,streak:0};
let settings={accents:true,threshold:88,...stored?.settings};
let mode='en-vi',queue=[],index=0,direction='en-vi',current=null,graded=false,locked=false,history=[],lastResult=null,hintUsed=false;
let worker=null,aiReady=false,requestId=0,pending=new Map(),session=0;
function toast(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(toast.timer);toast.timer=setTimeout(()=>$('toast').hidden=true,4000);}
function save(){try{localStorage.setItem(KEY,JSON.stringify({version:1,words,stats,settings}));}catch{toast('Không thể lưu trên thiết bị. Hãy xuất sổ từ để sao lưu.');}}
function updateStats(){ $('totalCount').textContent=words.length;$('navCount').textContent=words.length;$('correctCount').textContent=stats.correct;$('accuracy').textContent=stats.attempts?Math.round(stats.correct/stats.attempts*100)+'%':'—';$('streak').textContent=stats.streak;}
function startSession(){session++;queue=shuffled(words);index=0;showQuestion();updateStats();}
function showQuestion(){
 graded=false;locked=false;lastResult=null;hintUsed=false;current=queue[index]||null;
 direction=mode==='mixed'?(Math.random()<.5?'en-vi':'vi-en'):mode;
 $('feedback').hidden=true;$('answer').value='';$('answer').disabled=!current;$('check').hidden=false;$('check').disabled=!current;$('next').hidden=true;$('hint').disabled=!current;$('skip').disabled=!current;$('speak').disabled=!current;
 $('questionNumber').textContent=current?`${String(index+1).padStart(2,'0')} / ${queue.length}`:'0 / 0';
 $('directionLabel').textContent=direction==='en-vi'?'ENGLISH → TIẾNG VIỆT':'TIẾNG VIỆT → ENGLISH';
 $('prompt').textContent=current?(direction==='en-vi'?current.en[0]:current.vi[0]):'Sổ từ đang trống';
 $('promptCaption').textContent=current?(direction==='en-vi'?'Viết nghĩa tiếng Việt mà bạn biết.':'Viết từ hoặc cụm từ tiếng Anh tương ứng.'):'Thêm từ trong Sổ từ của tôi để bắt đầu.';
 $('answer').placeholder=direction==='en-vi'?'Gõ nghĩa tiếng Việt ở đây…':'Type the English word here…';
 $('answer').lang=direction==='en-vi'?'vi':'en';
 $('progressText').textContent=index?`Đã đi qua ${index} / ${queue.length} từ`:'Bắt đầu hành trình hôm nay';
 const p=queue.length?Math.round(index/queue.length*100):0;$('progressPercent').textContent=p+'%';$('progressBar').style.width=p+'%';
}
function appendText(parent,tag,text,cls){const el=document.createElement(tag);el.textContent=text;if(cls)el.className=cls;parent.append(el);return el;}
function similarWords(){
 const tokens=new Set(normalize(current.en.join(' ')).split(' '));
 return words.filter(w=>w.id!==current.id).map(w=>({w,score:w.en.some(e=>normalize(e).split(' ').some(t=>tokens.has(t)))?2:0})).sort((a,b)=>b.score-a.score).slice(0,3).map(x=>x.w);
}
function showResult(ok,{kind='dictionary',score=null,skipped=false}={}){
 graded=true;locked=false;$('check').hidden=true;$('next').hidden=false;$('hint').disabled=true;$('skip').disabled=true;$('answer').disabled=true;
 const before={...stats};stats.attempts++;if(ok){stats.correct++;stats.streak++;}else stats.streak=0;
 lastResult={before,ok};save();updateStats();
 const f=$('feedback');f.replaceChildren();f.hidden=false;f.className=ok?'':'wrong';
 appendText(f,'strong',skipped?'Cùng ghi nhớ từ này nhé.':ok?(hintUsed?'Đúng rồi! Lần tới thử không cần gợi ý nhé.':'Đúng rồi! Thêm một hạt mầm lớn lên 🌱'):'Chưa khớp — cùng xem lại nhé.');
 appendText(f,'p',`Đáp án: ${(direction==='en-vi'?current.vi:current.en).join(' · ')}`);
 if(kind==='ai')appendText(f,'p',`AI gợi ý · tương đồng ${Math.round(score*100)}%. Bạn có thể sửa đánh giá bên dưới.`);
 if(current.note)appendText(f,'p',current.note,'small');
 appendText(f,'p','Một vài từ trong sổ để liên hệ:','small');
 const chips=document.createElement('div');chips.className='chips';similarWords().forEach(w=>appendText(chips,'span',`${w.en[0]} · ${w.vi[0]}`));f.append(chips);
 const override=appendText(f,'button',ok?'Đánh dấu sai':'Mình trả lời đúng','secondary');override.type='button';override.onclick=()=>{
  if(!lastResult)return;const nextOK=!lastResult.ok;stats={...lastResult.before,attempts:lastResult.before.attempts+1,correct:lastResult.before.correct+(nextOK?1:0),streak:nextOK?lastResult.before.streak+1:0};lastResult.ok=nextOK;
  history[0].ok=nextOK;f.className=nextOK?'':'wrong';f.querySelector('strong').textContent=nextOK?'Đã đánh dấu đúng theo đánh giá của bạn.':'Đã đánh dấu sai theo đánh giá của bạn.';override.textContent=nextOK?'Đánh dấu sai':'Mình trả lời đúng';save();updateStats();renderRecent();
 };
 history.unshift({en:current.en[0],vi:current.vi[0],ok});history=history.slice(0,5);renderRecent();
}
function renderRecent(){const list=$('recentList');list.replaceChildren();history.forEach(w=>{const li=document.createElement('li'),d=document.createElement('div');appendText(d,'span',w.en);appendText(d,'small',w.vi);li.append(d);appendText(li,'span',w.ok?'✓':'↻',`result-mark ${w.ok?'':'wrong'}`);list.append(li);});}
async function check(event){event.preventDefault();if(graded||locked||!current||!$('answer').value.trim())return;
 const answer=$('answer').value.trim(),aliases=direction==='en-vi'?current.vi:current.en;
 if(exactMatch(answer,aliases,settings.accents&&direction==='en-vi'))return showResult(true);
 if(aiReady&&$('aiEnabled').checked){locked=true;$('check').disabled=true;$('skip').disabled=true;$('hint').disabled=true;$('check').textContent='Đang đối chiếu…';const activeSession=session;
 try{const result=await callAI('compare',{answer,aliases});if(activeSession!==session)return;showResult(result.score>=settings.threshold/100,{kind:'ai',score:result.score});}
 catch{if(activeSession!==session)return;toast('AI tạm thời không hoạt động; đã chấm theo sổ từ.');showResult(false);}
 finally{if(activeSession===session){locked=false;$('check').disabled=false;$('check').textContent='Kiểm tra →';}}
 }else showResult(false);
}
function advance(){if(index+1>=queue.length){toast(`Hoàn thành ${queue.length} từ! Bắt đầu lượt mới đã được trộn.`);startSession();}else{index++;showQuestion();}$('answer').focus();}
function openPage(name){document.querySelectorAll('.page').forEach(x=>x.classList.toggle('active',x.id==='page-'+name));document.querySelectorAll('.nav-item').forEach(x=>x.classList.toggle('active',x.dataset.page===name));$('pageTitle').textContent={practice:'Luyện từ vựng',library:'Sổ từ của tôi',notes:'Góc viết',settings:'Chấm điểm & AI'}[name];if(name==='library')renderLibrary();if(name==='notes')renderWritingWords();}
document.querySelectorAll('[data-page]').forEach(b=>b.onclick=()=>openPage(b.dataset.page));document.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>openPage(b.dataset.go));
document.querySelectorAll('[data-mode]').forEach(b=>b.onclick=()=>{mode=b.dataset.mode;document.querySelectorAll('[data-mode]').forEach(x=>x.classList.toggle('selected',x===b));startSession();});
$('shuffle').onclick=()=>{startSession();toast('Đã trộn lại toàn bộ từ vựng.');};$('answerForm').onsubmit=check;$('next').onclick=advance;$('skip').onclick=()=>{if(!graded&&!locked&&current)showResult(false,{skipped:true});};
document.addEventListener('keydown',e=>{if(e.key==='Enter'&&graded&&$('page-practice').classList.contains('active')&&!$('wordDialog').open&&['answer','next'].includes(document.activeElement.id)){e.preventDefault();advance();}});
$('hint').onclick=()=>{if(!current||locked)return;hintUsed=true;const target=(direction==='en-vi'?current.vi:current.en)[0];$('feedback').hidden=false;$('feedback').className='neutral';$('feedback').textContent=`Bắt đầu bằng “${target.slice(0,1)}…” · ${target.split(/\s+/).length} từ trong đáp án gợi ý.`;$('answer').focus();};
$('speak').onclick=()=>{if(!('speechSynthesis' in window))return toast('Trình duyệt này chưa hỗ trợ phát âm.');speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(direction==='en-vi'?current.en[0]:current.vi[0]);utterance.lang=direction==='en-vi'?'en-US':'vi-VN';utterance.rate=.85;speechSynthesis.speak(utterance);};
function renderLibrary(){const q=normalize($('search').value,true),list=$('wordList');list.replaceChildren();const filtered=words.filter(w=>normalize([...w.en,...w.vi].join(' '),true).includes(q));if(!filtered.length)appendText(list,'p','Chưa có từ phù hợp. Hãy thêm một từ mới.','muted');filtered.forEach(w=>{const card=document.createElement('article');card.className='word-card';appendText(card,'h3',w.en.join(' / '));appendText(card,'p',w.vi.join(' · '));if(w.note)appendText(card,'p',w.note,'word-note');const actions=document.createElement('div');actions.className='word-actions';const edit=appendText(actions,'button','Chỉnh sửa','text-button'),del=appendText(actions,'button','Xóa','text-button');edit.onclick=()=>openWord(w);del.onclick=()=>{if(!confirm(`Xóa “${w.en[0]}” khỏi sổ từ?`))return;words=words.filter(x=>x.id!==w.id);save();renderLibrary();startSession();};card.append(actions);list.append(card);});}
function openWord(w){$('wordForm').reset();$('editId').value=w?.id||'';$('wordEn').value=w?.en.join(' / ')||'';$('wordVi').value=w?.vi.join(' / ')||'';$('wordNote').value=w?.note||'';$('dialogTitle').textContent=w?'Chăm chút một từ':'Thêm một hạt mầm';$('wordDialog').showModal();}
$('search').oninput=renderLibrary;$('addWord').onclick=()=>openWord();$('closeDialog').onclick=()=>$('wordDialog').close();
$('wordForm').onsubmit=e=>{e.preventDefault();const en=splitAliases($('wordEn').value),vi=splitAliases($('wordVi').value);if(!en.length||!vi.length)return toast('Điền ít nhất một từ cho mỗi ngôn ngữ.');const id=$('editId').value||crypto.randomUUID(),word={id,en,vi,note:$('wordNote').value.trim()},at=words.findIndex(w=>w.id===id);if(at>=0)words[at]=word;else words.push(word);save();$('wordDialog').close();renderLibrary();startSession();toast('Đã lưu vào sổ từ.');};
function download(name,content,type){const url=URL.createObjectURL(new Blob([content],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),5000);}
$('export').onclick=()=>download('wordgarden-vocabulary.json',JSON.stringify({version:1,words},null,2),'application/json');
$('import').onchange=async e=>{try{const file=e.target.files[0];if(!file)return;if(file.size>5e6)throw Error('Tệp quá lớn. Hãy dùng tệp dưới 5 MB.');const data=validateWords(JSON.parse(await file.text()));const existing=new Set(words.map(w=>normalize(w.en[0])));let added=0;for(const w of data){const key=normalize(w.en[0]);if(!existing.has(key)){words.push(w);existing.add(key);added++;}}save();renderLibrary();startSession();toast(`Đã thêm ${added} từ mới; bỏ qua từ trùng.`);}catch(err){toast(err.message||'Không đọc được tệp JSON.');}e.target.value='';};
try{$('notes').value=localStorage.getItem('wordgarden.notes')||'';}catch{}
function noteCount(){const n=$('notes').value.trim();$('noteCount').textContent=(n?n.split(/\s+/).length:0)+' từ';}
$('notes').oninput=()=>{noteCount();try{localStorage.setItem('wordgarden.notes',$('notes').value);$('saveStatus').textContent='● Đã lưu';}catch{$('saveStatus').textContent='Chưa lưu được — hãy tải văn bản';}};
$('exportNotes').onclick=()=>download('wordgarden-notes.txt',$('notes').value,'text/plain;charset=utf-8');
function renderWritingWords(){const box=$('writingWords');box.replaceChildren();shuffled(words).slice(0,8).forEach(w=>{const b=appendText(box,'button',w.en[0]);b.onclick=()=>{const n=$('notes');n.setRangeText(w.en[0],n.selectionStart,n.selectionEnd,'end');n.focus();n.dispatchEvent(new Event('input'));};});}
$('accentToggle').checked=settings.accents;$('accentToggle').onchange=e=>{settings.accents=e.target.checked;save();};$('threshold').value=settings.threshold;$('thresholdValue').textContent=settings.threshold+'%';$('threshold').oninput=e=>{settings.threshold=Number(e.target.value);$('thresholdValue').textContent=settings.threshold+'%';save();};
function callAI(type,payload={}){return new Promise((resolve,reject)=>{const id=++requestId;const timer=setTimeout(()=>{pending.delete(id);reject(Error('AI timeout'));},type==='load'?600000:60000);pending.set(id,{resolve,reject,timer});worker.postMessage({id,type,...payload});});}
$('loadAI').onclick=async()=>{const b=$('loadAI');b.disabled=true;$('aiProgress').hidden=false;$('aiStatus').textContent='Đang tải mô hình. Bạn có thể tiếp tục học ở mục Luyện từ vựng.';
 try{if(!worker){worker=new Worker(new URL('./ai-worker.js',import.meta.url),{type:'module'});worker.onmessage=({data})=>{if(data.type==='progress'){$('aiStatus').textContent=data.message;if(data.progress!=null)$('aiProgress').value=data.progress;return;}const p=pending.get(data.id);if(p){clearTimeout(p.timer);pending.delete(data.id);data.error?p.reject(Error(data.error)):p.resolve(data);}};worker.onerror=()=>{for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('Không khởi động được AI'));}pending.clear();worker.terminate();worker=null;};}
 await callAI('load');aiReady=true;$('aiEnabled').disabled=false;$('aiEnabled').checked=true;$('aiStatus').textContent='Đã sẵn sàng. AI chạy trên thiết bị; dữ liệu mô hình có thể được trình duyệt lưu đệm.';b.textContent='✓ Mô hình đã sẵn sàng';$('aiProgress').hidden=true;updateGrading();
 }catch{$('aiStatus').textContent='Không tải được mô hình. Kiểm tra mạng hoặc thử lại. Chấm theo sổ từ vẫn hoạt động.';b.disabled=false;b.textContent='Thử tải lại mô hình';$('aiProgress').hidden=true;}
};
function updateGrading(){$('gradingCaption').textContent=aiReady&&$('aiEnabled').checked?'AI ngữ nghĩa đã bật · Bạn có thể sửa đánh giá sau mỗi câu.':'Chấp nhận các nghĩa tương đương trong sổ từ.';}$('aiEnabled').onchange=updateGrading;
noteCount();startSession();
