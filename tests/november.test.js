import test from 'node:test';import assert from 'node:assert/strict';
import {novemberWords} from '../vocabulary-november.js';
import {seedWords,vocabularyVersion} from '../data.js';
import {upgradeVocabulary} from '../vocabulary-update.js';
import {questionCaption,validateWords,exactMatch} from '../core.js';
const get=en=>novemberWords.find(w=>w.en[0]===en);
test('Every supplied English term is its own card, with context and a bilingual example',()=>{
 assert.equal(novemberWords.length,28);assert.equal(new Set(novemberWords.flatMap(w=>w.en)).size,28);
 for(const w of novemberWords){assert.equal(w.en.length,1);assert.ok(w.context.length>10);assert.ok(w.note.includes('='));}
 for(const [a,b] of [['tall','high'],['short','low'],['table','desk'],['university','college'],['funny','humorous'],['beautiful','pretty'],['sick','ill']]){
  assert.notEqual(get(a).id,get(b).id);assert.notEqual(questionCaption(get(a),'vi-en'),questionCaption(get(b),'vi-en'));
  assert.ok(questionCaption(get(a),'en-vi').includes(get(a).context));assert.equal(get(a).contrast,b);assert.equal(get(b).contrast,a);
 }
 assert.equal(exactMatch('high',get('tall').en),false);assert.equal(exactMatch('desk',get('table').en),false);
 assert.equal(exactMatch('noi tro',get('housewife').vi,true),true);assert.equal(exactMatch('ba mẹ',get('parents').vi),true);
});
test('Context and comparison survive export/import validation; invalid metadata is ignored',()=>{
 const before=get('high');const after=validateWords(JSON.parse(JSON.stringify([before])))[0];
 assert.equal(after.context,before.context);assert.equal(after.contrast,'tall');assert.equal(questionCaption(after,'vi-en'),questionCaption(before,'vi-en'));
 const bad=validateWords([{en:['x'],vi:['y'],context:{html:'x'},contrast:['bad']}])[0];assert.equal(bad.context,undefined);assert.equal(bad.contrast,undefined);
});
test('Version 2 decks receive only the new batch, preserving deleted old words and learner edits',()=>{
 const old=structuredClone(seedWords.filter(w=>Number(w.id.slice(5))<=45&&w.id!=='seed-43'));old[0].note='My note';
 const custom={id:'mine',en:['Friendly'],vi:['thân thiện của tôi'],note:'custom'};old.push(custom);
 const upgraded=upgradeVocabulary(old,2);
 assert.equal(upgraded.some(w=>w.id==='seed-43'),false);assert.equal(upgraded.filter(w=>w.en[0].toLowerCase()==='friendly').length,1);
 assert.deepEqual(upgraded.find(w=>w.id==='mine'),custom);assert.equal(upgraded[0].note,'My note');assert.ok(upgraded.some(w=>w.en[0]==='desk'));
 const deleted=upgraded.filter(w=>w.en[0]!=='high');assert.deepEqual(upgradeVocabulary(deleted,vocabularyVersion),deleted);
});
