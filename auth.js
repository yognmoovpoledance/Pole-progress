import { firebaseConfig } from "./firebase-config.js";
const G = "https://www.gstatic.com/firebasejs/10.12.2/";
const $ = id => document.getElementById(id);
const pages = ["a-login", "a-verif", "a-refus", "a-conf", "a-err"];
const show = p => { $("auth").hidden = false; $("a-load").hidden = true; pages.forEach(x => { $(x).hidden = x !== p; }); };
const msg = t => { $("a-msg").textContent = t || ""; };
const ERR = {
  "auth/invalid-email": "Adresse e-mail invalide.",
  "auth/email-already-in-use": "Un compte existe déjà avec cet e-mail : connecte-toi.",
  "auth/weak-password": "Mot de passe trop court (6 caractères minimum).",
  "auth/missing-password": "Écris ton mot de passe.",
  "auth/invalid-credential": "E-mail ou mot de passe incorrect.",
  "auth/user-not-found": "E-mail ou mot de passe incorrect.",
  "auth/wrong-password": "E-mail ou mot de passe incorrect.",
  "auth/too-many-requests": "Trop de tentatives, réessaie plus tard.",
  "auth/network-request-failed": "Pas de connexion internet."
};
const fr = e => ERR[e && e.code] || ("Une erreur est survenue (" + ((e && e.code) || "inconnue") + "). Réessaie dans un instant.");

if (!firebaseConfig || !firebaseConfig.apiKey || String(firebaseConfig.apiKey).startsWith("REMPLACE")) {
  show("a-conf");
} else {
  const [{ initializeApp }, A, F] = await Promise.all([
    import(G + "firebase-app.js"), import(G + "firebase-auth.js"), import(G + "firebase-firestore.js")
  ]);
  const app = initializeApp(firebaseConfig);
  const auth = A.getAuth(app);
  const db = F.initializeFirestore(app, { localCache: F.persistentLocalCache() });
  let uid = null, timer = null;
  const ref = () => F.doc(db, "utilisateurs", uid);
  const sync = S => {
    clearTimeout(timer);
    timer = setTimeout(() => { F.setDoc(ref(), { carnet: S, maj: Date.now() }).catch(() => {}); }, 700);
  };
  window.PAS_SYNC = S => { if (uid) sync(S); };

  async function entrer(user) {
    uid = user.uid;
    try {
      const s = await F.getDoc(ref());
      PAS.begin(uid, s.exists() ? s.data().carnet : null);
      $("auth").hidden = true;
      $("acct").hidden = false;
      if (!s.exists()) sync(PAS.state());
    } catch (e) {
      uid = null;
      if (e && e.code === "permission-denied") show("a-refus");
      else { $("a-errtxt").textContent = "Connexion impossible pour le moment. Vérifie ta connexion internet."; show("a-err"); }
    }
  }

  A.onAuthStateChanged(auth, async user => {
    msg("");
    if (!user) { uid = null; $("acct").hidden = true; show("a-login"); return; }
    try { await user.reload(); } catch (e) {}
    if (!user.emailVerified) { $("a-to").textContent = user.email || ""; show("a-verif"); return; }
    await entrer(user);
  });

  $("a-in").onclick = async () => {
    try { msg("Connexion…"); await A.signInWithEmailAndPassword(auth, $("a-mail").value.trim(), $("a-pass").value); }
    catch (e) { msg(fr(e)); }
  };
  $("a-up").onclick = async () => {
    try {
      msg("Création du compte…");
      const c = await A.createUserWithEmailAndPassword(auth, $("a-mail").value.trim(), $("a-pass").value);
      await A.sendEmailVerification(c.user);
      msg("");
    } catch (e) { msg(fr(e)); }
  };
  $("a-reset").onclick = async () => {
    const m = $("a-mail").value.trim();
    if (!m) { msg("Écris ton e-mail ci-dessus, puis touche « Mot de passe oublié »."); return; }
    try { await A.sendPasswordResetEmail(auth, m); msg("Si un compte existe avec cet e-mail, un message de réinitialisation vient d’être envoyé."); }
    catch (e) { msg(fr(e)); }
  };
  $("a-renvoi").onclick = async () => {
    try { await A.sendEmailVerification(auth.currentUser); msg("E-mail de vérification renvoyé."); }
    catch (e) { msg(fr(e)); }
  };
  $("a-ok").onclick = async () => {
    const u = auth.currentUser; if (!u) return;
    try { await u.reload(); if (u.emailVerified) await entrer(u); else msg("Ton e-mail n’est pas encore vérifié."); }
    catch (e) { msg(fr(e)); }
  };
  $("a-retry").onclick = $("a-retry2").onclick = () => location.reload();
  const sortir = async () => { try { await A.signOut(auth); } catch (e) {} location.reload(); };
  ["a-out1", "a-out2", "a-out3", "acct-out"].forEach(id => { $(id).onclick = sortir; });

  $("acct-exp").onclick = () => {
    const b = new Blob([JSON.stringify({ exporte_le: new Date().toISOString(), email: auth.currentUser.email, carnet: PAS.state() }, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "mon-carnet-yognmoov.json"; a.click();
  };
  let d = 0;
  $("acct-del").onclick = async () => {
    if (!d) { d = 1; $("acct-del").textContent = "Confirmer la suppression définitive"; return; }
    try {
      clearTimeout(timer); window.PAS_SYNC = () => {};
      await F.deleteDoc(ref());
      await A.deleteUser(auth.currentUser);
      try { localStorage.removeItem("pas-v1-" + uid); } catch (e) {}
      location.reload();
    } catch (e) {
      $("acct-msg").textContent = e.code === "auth/requires-recent-login"
        ? "Pour ta sécurité, déconnecte-toi, reconnecte-toi, puis recommence."
        : fr(e);
      d = 0; $("acct-del").textContent = "Supprimer mon compte et mes données";
    }
  };
}
