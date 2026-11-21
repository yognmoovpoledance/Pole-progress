import { firebaseConfig } from "./firebase-config.js";
const G = "https://www.gstatic.com/firebasejs/10.12.2/";
const $ = id => document.getElementById(id);
const pages = ["a-login", "a-verif", "a-refus", "a-conf", "a-err", "a-cgv"];
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
  let uid = null, timer = null, cgvData = null;
  const CGV_VERSION = "2026-11-20";
  const TEXTE_ACCORD = "Je demande l’accès immédiat à l’application et je reconnais que je perds mon droit de rétractation de 14 jours. J’ai lu et j’accepte les conditions générales de vente et la politique de confidentialité.";
  const ref = () => F.doc(db, "utilisateurs", uid);
  const sync = S => {
    clearTimeout(timer);
    timer = setTimeout(() => { F.setDoc(ref(), { carnet: S, maj: Date.now() }, { merge: true }).catch(() => {}); }, 700);
  };
  window.PAS_SYNC = S => { if (uid) sync(S); };
  const say = t => { const e = $("pmsg"); if (e) e.textContent = t || ""; };

  function ouvrir(data, existait, pseudo) {
    const u = auth.currentUser;
    const ts = data.accord && data.accord.date && data.accord.date.toDate ? data.accord.date.toDate().toISOString() : null;
    window.PAS_ACCT = {
      email: (u && u.email) || "",
      creation: u && u.metadata ? u.metadata.creationTime : null,
      accord: ts || new Date().toISOString()
    };
    PAS.begin(uid, data.carnet || null, pseudo);
    $("auth").hidden = true;
    if (!existait || !data.carnet) sync(PAS.state());
  }

  async function entrer(user) {
    uid = user.uid;
    try {
      const s = await F.getDoc(ref());
      const data = s.exists() ? s.data() : {};
      if (!data.accord || data.accord.version !== CGV_VERSION) {
        cgvData = data; $("a-cgv-chk").checked = false; $("a-cgv-ok").disabled = true; show("a-cgv"); return;
      }
      ouvrir(data, s.exists());
    } catch (e) {
      uid = null;
      if (e && e.code === "permission-denied") show("a-refus");
      else { $("a-errtxt").textContent = "Connexion impossible pour le moment. Vérifie ta connexion internet."; show("a-err"); }
    }
  }

  A.onAuthStateChanged(auth, async user => {
    msg("");
    if (!user) { uid = null; show("a-login"); return; }
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
  const upd = () => { $("a-cgv-ok").disabled = !($("a-cgv-chk").checked && $("a-pseudo").value.trim().length >= 2); };
  $("a-cgv-chk").onchange = upd;
  $("a-pseudo").oninput = upd;
  $("a-cgv-ok").onclick = async () => {
    try {
      await F.setDoc(ref(), { accord: { version: CGV_VERSION, date: F.serverTimestamp(), texte: TEXTE_ACCORD } }, { merge: true });
      ouvrir(Object.assign({}, cgvData, { accord: { version: CGV_VERSION } }), !!(cgvData && cgvData.carnet), $("a-pseudo").value.trim().slice(0, 30));
    } catch (e) { msg(fr(e)); }
  };
  const sortir = async () => { try { await A.signOut(auth); } catch (e) {} location.reload(); };
  ["a-out1", "a-out2", "a-out3", "a-out4"].forEach(id => { $(id).onclick = sortir; });

  window.PAS_ACT = {
    out: sortir,
    exp: () => {
      const c = JSON.parse(JSON.stringify(PAS.state())); if (c.prof) delete c.prof.photo;
      const b = new Blob([JSON.stringify({ exporte_le: new Date().toISOString(), email: auth.currentUser.email, carnet: c }, null, 2)], { type: "application/json" });
      const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = "mon-carnet-yognmoov.json"; a.click();
      say("Ton carnet a été téléchargé.");
    },
    pwd: async () => {
      try { await A.sendPasswordResetEmail(auth, auth.currentUser.email); say("Un e-mail pour changer ton mot de passe vient d’être envoyé."); }
      catch (e) { say(fr(e)); }
    },
    del: async () => {
      try {
        clearTimeout(timer); window.PAS_SYNC = () => {};
        await F.deleteDoc(ref());
        await A.deleteUser(auth.currentUser);
        try { localStorage.removeItem("pas-v1-" + uid); } catch (e) {}
        location.reload();
      } catch (e) {
        say(e.code === "auth/requires-recent-login" ? "Pour ta sécurité, déconnecte-toi, reconnecte-toi, puis recommence." : fr(e));
      }
    }
  };
}
