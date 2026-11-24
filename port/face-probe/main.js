// Display-only integration probe using the unmodified upstream face and motions.
import {Application,Behavior,Skin} from "piu/MC";
import {SimpleFace} from "behaviors/face";
import {createFaceState,Emotion} from "face-state";
import {updateFaceSkinPalette} from "face-skin";
const state=createFaceState();
const face=new SimpleFace({left:20,top:60,width:200,height:120});
const palette=updateFaceSkinPalette(null,state);
class Probe extends Behavior {
  onDisplaying(app){
    face.behavior.onFaceSkin(face,palette);
    face.behavior.onFaceUpdate(face,state);
    face.distribute("onFaceSkin",palette);
  }
  onFaceTouch(app){
    state.emotion=state.emotion===Emotion.HAPPY?Emotion.NEUTRAL:Emotion.HAPPY;
    face.behavior.onFaceUpdate(face,state);
  }
}
export default new Application(null,{skin:new Skin({fill:"#000000"}),contents:[face],Behavior:Probe,displayListLength:4096});
