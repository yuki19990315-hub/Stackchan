// Sanny hardware provider; no writes to unverified external GPIO.
import QMI8658 from "embedded:sensor/Accelerometer-Gyroscope/QMI8658";
import Timer from "timer";
import {decodeTouch} from "sanny-touch-decode";
const bus={io:"I2C",data:6,clock:7,port:"I2C_NUM_0"};
class Touch {
  constructor(){
    try {
      this.reset=new device.io.Digital({pin:13,mode:device.io.Digital.Output});
      this.reset.write(0);Timer.delay(10);this.reset.write(1);Timer.delay(150);
      this.io=new device.io.SMBus({...bus,address:0x15,hz:100000});
      this.buffer=new Uint8Array(6);
    } catch(e){this.close();throw e;}
  }
  get configuration(){return {interrupt:false};}
  sample(){try{this.io.readBuffer(1,this.buffer);return decodeTouch(this.buffer);}catch(_){return undefined;}}
  close(){this.io?.close();this.io=undefined;this.reset?.close();this.reset=undefined;}
}
class IMU {
  constructor(){
    for(const address of [0x6b,0x6a]){
      let probe;
      try{
        probe=new device.io.SMBus({...bus,address,hz:100000});
        if(probe.readUint8(0)!==5) continue;
      }catch(_){continue;}finally{probe?.close();}
      try{this.driver=new QMI8658({sensor:{...bus,io:device.io.SMBus,address}});break;}catch(_){}
    }
    // Optional sensor: missing hardware must not crash the face.
  }
  sample(){return this.driver?.sample()??{};}
  close(){this.driver?.close();this.driver=undefined;}
}
export default {i2c:{default:bus,internal:bus},spi:{default:{io:"SPI",clock:10,out:11,in:-1,port:2}},pin:{displayDC:8,displaySelect:9,backlight:2,touchReset:13,batteryADC:1},sensor:{Touch,IMU}};
