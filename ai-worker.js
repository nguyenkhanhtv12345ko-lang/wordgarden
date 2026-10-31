import {cosine,negationMismatch} from './core.js';
let extractor=null;const cache=new Map();
async function embedding(text){if(cache.has(text))return cache.get(text);const output=await extractor(text,{pooling:'mean',normalize:true});const v=Array.from(output.data);if(cache.size>2000)cache.clear();cache.set(text,v);return v;}
self.onmessage=async({data})=>{const {id,type}=data;try{
 if(type==='load'){
  const {pipeline,env}=await import('https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1');
  env.allowLocalModels=false;
  extractor=await pipeline('feature-extraction','Xenova/paraphrase-multilingual-MiniLM-L12-v2',{dtype:'q8',device:'wasm',progress_callback:p=>{if(p.status==='progress')self.postMessage({type:'progress',progress:p.progress,message:`Đang tải ${p.file}: ${Math.round(p.progress||0)}%`});}});
  self.postMessage({id,ready:true});
 }else if(type==='compare'){
  if(!extractor)throw Error('Mô hình chưa tải');
  const answer=await embedding(data.answer);let score=0;
  for(const alias of data.aliases){if(negationMismatch(data.answer,alias))continue;score=Math.max(score,cosine(answer,await embedding(alias)));}
  self.postMessage({id,score});
 }
 }catch(error){self.postMessage({id,error:error.message});}};
