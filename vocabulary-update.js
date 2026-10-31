import {seedWords as previousSeeds} from './legacy-data.js';
import {seedWords,addedWordParents,vocabularyVersion} from './data.js?v=4';

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
  const old=previous.get(w.id),next=current.get(w.id);
  if(!old||!next)return {...w,en:[...w.en],vi:[...w.vi]};
  return {...w,en:updateAliases(w.en,old.en,next.en),vi:updateAliases(w.vi,old.vi,next.vi),note:w.note===old.note?next.note:w.note};
 });
 const existing=new Set(words.map(w=>w.id));
 for(const word of seedWords){
  if(addedWordParents[word.id]&&existing.has(addedWordParents[word.id])&&!existing.has(word.id))result.push(structuredClone(word));
 }
 return result;
}
