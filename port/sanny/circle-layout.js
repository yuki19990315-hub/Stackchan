// Integer pixel bounds for the visible circular panel. No hardware dependencies.
export function circleSpan(y, margin=4) {
  if(!Number.isInteger(y)||y<0||y>=240||!Number.isFinite(margin)||margin<0||margin>=120)return null;
  const r=120-margin,dy=y-119.5;
  if(Math.abs(dy)>r)return null;
  const dx=Math.sqrt(r*r-dy*dy);
  const left=Math.ceil(119.5-dx),right=Math.floor(119.5+dx);
  return left<=right?{left,right}:null;
}
export function safeRect(left,top,width,height,margin=4){
  if(![left,top,width,height].every(Number.isInteger)||width<=0||height<=0)return false;
  const a=circleSpan(top,margin),b=circleSpan(top+height-1,margin);
  return !!a&&!!b&&left>=Math.max(a.left,b.left)&&left+width-1<=Math.min(a.right,b.right);
}
export function centeredRect(top,height,margin=4){
  const a=circleSpan(top,margin),b=circleSpan(top+height-1,margin);
  if(!Number.isInteger(height)||height<=0||!a||!b)return null;
  const left=Math.max(a.left,b.left),right=Math.min(a.right,b.right);
  return {left,top,width:right-left+1,height};
}
