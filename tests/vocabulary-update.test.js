import test from 'node:test';import assert from 'node:assert/strict';
import {seedWords, vocabularyVersion} from '../data.js';
import {seedWords as previousSeeds} from '../legacy-data.js';
import {upgradeVocabulary} from '../vocabulary-update.js';
import {exactMatch} from '../core.js';
const find=(words,id)=>words.find(w=>w.id===id);
test('Stock deck upgrades to 117 distinct entries and corrects misleading meanings',()=>{
 const upgraded=upgradeVocabulary(structuredClone(previousSeeds));
 assert.equal(upgraded.length,117);assert.equal(new Set(upgraded.map(w=>w.id)).size,117);
 assert.deepEqual(upgraded,seedWords);
 for(const [id,wrong] of [['seed-8','mọi thứ'],['seed-10','về quê'],['seed-30','ăn tối'],['seed-32','bữa ăn']])assert.equal(exactMatch(wrong,find(upgraded,id).vi),false);
 for(const [id,right] of [['seed-1','sửa soạn'],['seed-4','kiếm được rất nhiều tiền'],['seed-16','cảm thấy vui thích'],['seed-31','mắc tiền'],['seed-38','món ăn'],['seed-39','bữa ăn'],['seed-43','ăn tối'],['seed-44','về quê']])assert.equal(exactMatch(right,find(upgraded,id).vi),true);
});
test('Migration preserves learner additions, intentional replacements, notes and custom words',()=>{
 const deck=structuredClone(previousSeeds);find(deck,'seed-1').vi.push('sắp sửa soạn');find(deck,'seed-2').vi=['chuyến công tác (ghi chú riêng)'];find(deck,'seed-3').note='Ghi chú của tôi';
 const custom={id:'custom-1',en:['apple'],vi:['quả táo'],note:'Của tôi'};deck.push(custom);
 const upgraded=upgradeVocabulary(deck);
 assert.ok(find(upgraded,'seed-1').vi.includes('sắp sửa soạn'));assert.ok(find(upgraded,'seed-1').vi.includes('sửa soạn'));
 assert.deepEqual(find(upgraded,'seed-2').vi,['chuyến công tác (ghi chú riêng)']);assert.equal(find(upgraded,'seed-3').note,'Ghi chú của tôi');assert.deepEqual(find(upgraded,'custom-1'),custom);
 assert.deepEqual(find(deck,'seed-1').vi, [...previousSeeds[0].vi,'sắp sửa soạn']);
});
test('Migration respects deletions and does not populate custom-only or empty decks',()=>{
 const deck=previousSeeds.filter(w=>!['seed-24','seed-32'].includes(w.id));const result=upgradeVocabulary(deck);
 for(const id of ['seed-24','seed-32','seed-38','seed-39','seed-41','seed-42','seed-45'])assert.equal(find(result,id),undefined);
 assert.deepEqual(upgradeVocabulary([]),[]);const custom=[{id:'custom',en:['x'],vi:['y'],note:''}];assert.deepEqual(upgradeVocabulary(custom),custom);
});
test('Versioned update does not resurrect a new entry the learner later deleted',()=>{
 const upgraded=upgradeVocabulary(previousSeeds).filter(w=>w.id!=='seed-43');assert.deepEqual(upgradeVocabulary(upgraded,vocabularyVersion),upgraded);
});
