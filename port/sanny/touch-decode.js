// CST816S register 0x01..0x06; undefined = transient/invalid read.
export function decodeTouch(b) {
  if (!b || b.length!==6) return undefined;
  const count=b[1]&15;
  if(count===0) return [];
  if(count!==1) return undefined;
  const x=((b[2]&15)<<8)|b[3],y=((b[4]&15)<<8)|b[5];
  if(x>=240||y>=240) return undefined;
  if((b[2]>>>6)===1) return [];
  return [{id:0,x,y}];
}
