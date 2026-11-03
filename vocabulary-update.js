import {seedWords as previousSeeds} from './legacy-data.js';
import {seedWords,addedWordParents,vocabularyVersion} from './data.js?v=5';
import {novemberWords} from './vocabulary-november.js?v=5';

const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
function updateAliases(saved,previous,next){
 if(same(saved,previous))return [...next];
 // Preserve learner-added aliases while replacing the old stock meanings.
 if(previous.every(x=>saved.includes(x)))return [...new Set([...next,...saved.filter(x=>!previous.includes(x))])];
 // A learner who replaced or removed meanings keeps that intentional edit.
 return [...saved];
}
export function upgradeVocabulary(words,fromVersion=0){
 if(fromVersion>=vocabularyVersion)return words;
 const previous=new Map(previousSeeds.map(w=>[w.id,w])),current=new Map(seedWords.map(w=>[w.id,w]));
 const result=words.map(w=>{
  if(fromVersion>=2)return {...w,en:[...w.en],vi:[...w.vi]};
  const old=previous.get(w.id),next=current.get(w.id);
  if(!old||!next)return {...w,en:[...w.en],vi:[...w.vi]};
  return {...w,en:updateAliases(w.en,old.en,next.en),vi:updateAliases(w.vi,old.vi,next.vi),note:w.note===old.note?next.note:w.note};
 });
 const existing=new Set(words.map(w=>w.id));
 for(const word of seedWords){
  if(fromVersion<2&&addedWordParents[word.id]&&existing.has(addedWordParents[word.id])&&!existing.has(word.id))result.push(structuredClone(word));
 }
 // This batch belongs to the supplied study deck, rather than unrelated custom-only decks.
 if(fromVersion<3&&words.some(w=>current.has(w.id))){
  const names=new Set(result.flatMap(w=>w.en.map(x=>x.toLowerCase().trim())));
  for(const word of novemberWords){
   if(!existing.has(word.id)&&!word.en.some(en=>names.has(en.toLowerCase().trim()))){
    result.push(structuredClone(word));word.en.forEach(en=>names.add(en.toLowerCase().trim()));
   }
  }
 }
 return result;
}
