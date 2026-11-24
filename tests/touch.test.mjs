import test from "node:test";
import assert from "node:assert/strict";
import {decodeTouch} from "../port/sanny/touch-decode.mjs";
test("press and move",()=>{assert.deepEqual(decodeTouch(Uint8Array.of(0,1,0,120,0,80)),[{id:0,x:120,y:80}]);});
test("release event",()=>{assert.deepEqual(decodeTouch(Uint8Array.of(0,1,64,120,0,80)),[]);});
test("no touch",()=>assert.deepEqual(decodeTouch(new Uint8Array(6)),[]));
test("invalid input",()=>{assert.equal(decodeTouch([0,2,0,0,0,0]),undefined);assert.equal(decodeTouch([0,1,0,240,0,0]),undefined);assert.equal(decodeTouch([]),undefined);});
