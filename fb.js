import {initializeApp,getApps} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import {getFirestore,doc,getDoc,setDoc,updateDoc,deleteDoc,onSnapshot,collection,query,where} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js";
import {getAuth,signInWithEmailAndPassword,signOut,updatePassword,signInAnonymously,onAuthStateChanged,GoogleAuthProvider,linkWithPopup,signInWithPopup,signInWithCredential,createUserWithEmailAndPassword,sendPasswordResetEmail} from "https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js";
import {firebaseConfig} from "./firebase-config.js";
export const CONFIGURED=!String(firebaseConfig.apiKey).startsWith("YAHAN");
let fs=null,au=null;
if(CONFIGURED){const app=initializeApp(firebaseConfig);fs=getFirestore(app);au=getAuth(app)}
const snap=s=>({id:s.id,exists:s.exists(),data:()=>s.data()});
const mk=src=>({onSnapshot:(n,e)=>onSnapshot(src,s=>n({docs:s.docs.map(snap),docChanges:()=>s.docChanges().map(x=>({type:x.type,doc:snap(x.doc)}))}),e)});
export const DB={
  doc:p=>{const r=doc(fs,p);return{get:()=>getDoc(r).then(snap),set:d=>setDoc(r,d),update:d=>updateDoc(r,d),delete:()=>deleteDoc(r),onSnapshot:(n,e)=>onSnapshot(r,s=>n(snap(s)),e)}},
  collection:c=>mk(collection(fs,c)),
  where:(c,f,v)=>mk(query(collection(fs,c),where(f,"==",v)))
};
const gp=()=>new GoogleAuthProvider();
export const AUTH={
  login:(e,p)=>signInWithEmailAndPassword(au,e,p),logout:()=>signOut(au),changePw:p=>updatePassword(au.currentUser,p),
  user:()=>au.currentUser,
  onChange:cb=>onAuthStateChanged(au,cb),
  anon:()=>signInAnonymously(au),
  async google(){const u=au.currentUser;
    if(u&&u.isAnonymous){try{return await linkWithPopup(u,gp())}catch(e){if(e.code==="auth/credential-already-in-use"){const c=GoogleAuthProvider.credentialFromError(e);if(c)return signInWithCredential(au,c)}throw e}}
    return signInWithPopup(au,gp())},
  async mkUser(em,pw){const sa=getAuth(getApps().find(a=>a.name==="sec")||initializeApp(firebaseConfig,"sec"));const c=await createUserWithEmailAndPassword(sa,em,pw);await signOut(sa);return c.user.uid},
  reset:em=>sendPasswordResetEmail(au,em)
};
