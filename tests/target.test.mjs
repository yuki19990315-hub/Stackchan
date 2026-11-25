import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
test("target is pinned and optional devices stay disabled",()=>{
 const r=read("port/target-requirements.json"),b=read("port/board.json"),m=read("port/sanny/manifest.json");
 assert.equal(r.upstream.release,"v2.1.0");assert.equal(r.upstream.sdk,"10.1.0");
 assert.equal(r.upstream.commit,"b050a44592ab847f0f4c2ceb6eb350a02bcb609a");
 assert.equal(b.servo.enabled,false);assert.equal(b.i2s.enabled,false);
 assert.equal(r.hardware.cameraEnabled,false);assert.equal(m.config.driver.type,"none");
 assert.equal(m.config.driver.typeLocked,true);
});
test("build script contains no flash or deploy invocation",()=>{
 const s=fs.readFileSync(new URL("../scripts/build-display.mjs",import.meta.url),"utf8");
 assert.match(s,/"-t","build"/);assert.doesNotMatch(s,/"-t","deploy"|["']erase.flash["']/);
});
