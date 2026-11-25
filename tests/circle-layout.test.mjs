import test from "node:test";
import assert from "node:assert/strict";
import {circleSpan,safeRect,centeredRect} from "../port/sanny/circle-layout.js";
test("circle spans are symmetric and every returned endpoint lies inside",()=>{
 for(let y=0;y<240;y++){
  const s=circleSpan(y);assert.deepEqual(s,circleSpan(239-y));
  if(s){assert.equal(s.left+s.right,239);for(const x of [s.left,s.right])assert.ok((x-119.5)**2+(y-119.5)**2<=116**2);}
 }
});
test("circle excludes corners and accepts central area",()=>{
 assert.equal(safeRect(0,0,240,240),false);
 assert.equal(safeRect(40,40,160,160),true);
 assert.equal(safeRect(20,60,200,120),true);
 assert.equal(safeRect(20,66,200,120),true);
});
test("every valid centered row region is inside screen",()=>{
 for(let y=0;y<240;y++)for(let h=1;h<=240-y;h++){
  const r=centeredRect(y,h);if(r)assert.ok(safeRect(r.left,r.top,r.width,r.height));
 }
});
test("invalid geometry",()=>{
 assert.equal(circleSpan(-1),null);assert.equal(circleSpan(240),null);
 assert.equal(safeRect(1,1,0,20),false);assert.equal(centeredRect(120,0),null);
});
