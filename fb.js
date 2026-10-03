import {initializeApp} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getFirestore,doc,setDoc,updateDoc,deleteDoc,onSnapshot,collection} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {getAuth,signInWithEmailAndPassword,signOut,updatePassword} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {firebaseConfig} from "./firebase-config.js";
export const CONFIGURED=!String(firebaseConfig.apiKey).startsWith("YAHAN");
let fs=null,au=null;
if(CONFIGURED){const app=initializeApp(firebaseConfig);fs=getFirestore(app);au=getAuth(app)}
const snap=s=>({id:s.id,exists:s.exists(),data:()=>s.data()});
export const DB={
  doc:p=>{const r=doc(fs,p);return{set:d=>setDoc(r,d),update:d=>updateDoc(r,d),delete:()=>deleteDoc(r),onSnapshot:(n,e)=>onSnapshot(r,s=>n(snap(s)),e)}},
  collection:c=>({onSnapshot:(n,e)=>onSnapshot(collection(fs,c),s=>n({docs:s.docs.map(snap),docChanges:()=>s.docChanges().map(x=>({type:x.type,doc:snap(x.doc)}))}),e)})
};
export const AUTH={login:(e,p)=>signInWithEmailAndPassword(au,e,p),logout:()=>signOut(au),changePw:p=>updatePassword(au.currentUser,p)};
