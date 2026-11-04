import test from 'node:test';import assert from 'node:assert/strict';
import {books,latestBookId,bookOf,assignBooks,wordsForBook,selectBook} from '../books.js';
import {seedWords} from '../data.js';import {validateWords,shuffled} from '../core.js';

test('Three dated updates partition the stock deck and the newest queue excludes old words',()=>{
 const words=assignBooks(seedWords);assert.deepEqual(books.map(b=>b.date),['31/10/2026','03/11/2026','04/11/2026']);
 assert.deepEqual(books.map(b=>wordsForBook(words,b.id).length),[45,28,44]);
 const sets=books.map(b=>new Set(wordsForBook(words,b.id).map(w=>w.id)));
 assert.equal(new Set(sets.flatMap(s=>[...s])).size,117);
 const queue=shuffled(wordsForBook(words,latestBookId));assert.equal(queue.length,44);
 for(const w of queue){assert.ok(Number(w.id.slice(5))>=74);assert.equal(sets[0].has(w.id)||sets[1].has(w.id),false);}
 assert.equal(selectBook(undefined),latestBookId);assert.equal(selectBook('invalid'),latestBookId);assert.equal(selectBook('update-1'),'update-1');
});
test('Selection never falls back to old vocabulary when the latest book is empty',()=>{
 const older=assignBooks(seedWords.filter(w=>Number(w.id.slice(5))<=73));assert.deepEqual(wordsForBook(older,latestBookId),[]);
 assert.equal(wordsForBook(older,'all').length,73);assert.deepEqual(wordsForBook(older,'personal'),[]);
});
test('Book assignments survive JSON export/import even when imported identifiers change',()=>{
 const selected=wordsForBook(assignBooks(seedWords),'update-3');const imported=validateWords(JSON.parse(JSON.stringify({version:1,words:selected})));
 assert.equal(wordsForBook(imported,'update-3').length,44);assert.equal(wordsForBook(imported,'update-1').length,0);
 assert.ok(imported.every(w=>w.id.startsWith('import-')));
 assert.equal(validateWords([{en:['x'],vi:['y'],bookId:'all'}])[0].bookId,undefined);
});
test('Old personal words stay personal and explicit moves preserve their chosen book',()=>{
 const personal={id:'mine',en:['apple'],vi:['táo'],note:'Giữ lại'};assert.equal(bookOf(personal),'personal');
 assert.equal(bookOf({...seedWords[0],bookId:'update-3'}),'update-3');assert.equal(bookOf({id:'seed-999'}),'personal');
 const old=JSON.stringify(seedWords);assignBooks(seedWords);assert.equal(JSON.stringify(seedWords),old);
 assert.deepEqual(assignBooks([personal])[0],{...personal,bookId:'personal'});
});
