import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
const read=p=>JSON.parse(fs.readFileSync(new URL("../"+p,import.meta.url),"utf8"));
const b=read("port/board.json"), m=read("port/sanny/manifest.json");
test("display and touch pins match manifest",()=>{
assert.equal(m.defines.spi.sck_pin,b.lcd.sck);
assert.equal(m.defines.spi.mosi_pin,b.lcd.mosi);
for(const [k,v] of [["cs_pin","cs"],["dc_pin","dc"],["rst_pin","reset"],["backlight_pin","backlight"],["width","width"],["height","height"]]) assert.equal(m.defines.ili9341[k],b.lcd[v]);
assert.equal(m.defines.i2c.sda_pin,b.i2c.sda);
assert.equal(m.defines.i2c.scl_pin,b.i2c.scl);
});
test("no pin collisions",()=>{
const pins=[b.lcd.sck,b.lcd.mosi,b.lcd.cs,b.lcd.dc,b.lcd.reset,b.lcd.backlight,b.i2c.sda,b.i2c.scl,b.touch.reset,b.battery.adc,b.i2s.bclk,b.i2s.ws,b.i2s.micData,b.i2s.speakerData,...b.servo.pins];
assert.equal(new Set(pins).size,pins.length);
});
test("safe first pass",()=>{
assert.equal(b.i2s.enabled,false);
assert.equal(b.servo.enabled,false);
assert.equal(m.config.driver.type,"none");
assert.equal(m.config.enablePowerButton,false);
});
