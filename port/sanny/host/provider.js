// Sanny hardware provider. Original adaptation for the Waveshare board.
import QMI8658 from "embedded:sensor/Accelerometer-Gyroscope/QMI8658";
import Timer from "timer";

const bus = {io:"I2C", data:6, clock:7, port:"I2C_NUM_0"};
class Touch {
  constructor() {
    this.reset = new device.io.Digital({pin:13, mode:device.io.Digital.Output});
    this.reset.write(0); Timer.delay(10); this.reset.write(1); Timer.delay(150);
    this.io = new device.io.SMBus({...bus, address:0x15, hz:100000});
    this.buffer = new Uint8Array(6);
  }
  get configuration() { return {interrupt:false}; }
  sample() {
    try { this.io.readBuffer(1,this.buffer); } catch (_) { return undefined; }
    const b=this.buffer;
    if ((b[1]&15)!==1) return [];
    const x=((b[2]&15)<<8)|b[3], y=((b[4]&15)<<8)|b[5];
    return x<240 && y<240 ? [{id:0,x,y}] : [];
  }
  close() { this.io?.close(); this.reset?.close(); }
}
class IMU {
  constructor() {
    for (const address of [0x6b,0x6a]) {
      try { this.driver=new QMI8658({sensor:{...bus,io:device.io.SMBus,address}}); break; }
      catch (_) {}
    }
    if (!this.driver) throw new Error("QMI8658 not detected");
  }
  sample() { return this.driver.sample(); }
  close() { this.driver.close(); }
}
export default {
  i2c:{default:bus,internal:bus},
  spi:{default:{io:"SPI",clock:10,out:11,in:-1,port:2}},
  pin:{displayDC:8,displaySelect:9,backlight:2,touchReset:13,touchInterrupt:5,batteryADC:1},
  sensor:{Touch,IMU}
};
