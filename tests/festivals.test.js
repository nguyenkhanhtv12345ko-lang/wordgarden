import test from 'node:test';import assert from 'node:assert/strict';
import {seedWords,vocabularyVersion} from '../data.js';
import {festivalWords} from '../vocabulary-festivals.js';
import {upgradeVocabulary} from '../vocabulary-update.js';

test('Version 3 upgrades add the festival batch once, preserving edits, deletions and a user-added duplicate',()=>{
 const old=structuredClone(seedWords.filter(w=>Number(w.id.slice(5))<=73&&w.id!=='seed-46'));
 old[0].vi.push('đáp án riêng');
 const shop={id:'custom-shop',en:['SHOP'],vi:['tiệm riêng của tôi'],note:'do tôi thêm'};old.push(shop);
 const updated=upgradeVocabulary(old,3);
 assert.equal(updated.length,old.length+festivalWords.length-1);
 assert.equal(updated.some(w=>w.id==='seed-46'),false);
 assert.ok(updated[0].vi.includes('đáp án riêng'));
 assert.deepEqual(updated.find(w=>w.id===shop.id),shop);
 assert.equal(updated.filter(w=>w.en.some(en=>en.toLowerCase()==='shop')).length,1);
 for(const repeated of ['prepare','interesting'])assert.equal(updated.filter(w=>w.en.some(en=>en.toLowerCase()===repeated)).length,1);
 const afterDeletion=updated.filter(w=>w.en[0]!=='festival');
 assert.deepEqual(upgradeVocabulary(afterDeletion,vocabularyVersion),afterDeletion);
});
