"use client";
import { useState, useCallback } from "react";
import { PayNowShell, PN, FONT } from "../_shell";
import { SecondaryNav, SectionCard, fieldStyle, SaveBar } from "./_params";

export default function EntreprisePage() {
  const INIT = { name:"Cabinet Immobilier Delafusse", siret:"82341567800014", tva:"FR 45 823415678", address:"12 rue de la Paix", postal:"75001", city:"Paris", country:"France", email:"compta@delafusse.fr", phone:"+33 1 42 36 87 54", website:"https://cabinet-immobilier-delafusse.com" };
  const [name,    setName]    = useState(INIT.name);
  const [siret,   setSiret]   = useState(INIT.siret);
  const [tva,     setTva]     = useState(INIT.tva);
  const [address, setAddress] = useState(INIT.address);
  const [postal,  setPostal]  = useState(INIT.postal);
  const [city,    setCity]    = useState(INIT.city);
  const [country, setCountry] = useState(INIT.country);
  const [email,   setEmail]   = useState(INIT.email);
  const [phone,   setPhone]   = useState(INIT.phone);
  const [website, setWebsite] = useState(INIT.website);
  const [isDirty, setIsDirty] = useState(false);
  const mark = useCallback(() => setIsDirty(true), []);

  function save()  { setIsDirty(false); }
  function reset() { setName(INIT.name); setSiret(INIT.siret); setTva(INIT.tva); setAddress(INIT.address); setPostal(INIT.postal); setCity(INIT.city); setCountry(INIT.country); setEmail(INIT.email); setPhone(INIT.phone); setWebsite(INIT.website); setIsDirty(false); }

  const inp = fieldStyle;
  const lbl = { display:"block", fontSize:12.5, fontWeight:700, color:PN.ink2, fontFamily:FONT, marginBottom:6 } as const;

  return (
    <PayNowShell activePage="params">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>
        <SecondaryNav activeId="entreprise" />
        <div style={{ flex:1, overflowY:"auto", background:"#fff" }}>
          <div style={{ padding:"36px 44px 100px" }}>
            <h1 style={{ margin:"0 0 6px", fontSize:22, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>Entreprise</h1>
            <p style={{ margin:"0 0 28px", fontSize:13, color:PN.ink3, fontFamily:FONT }}>Informations légales et coordonnées de votre entreprise.</p>

            {/* Informations légales */}
            <SectionCard title="Informations légales">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={lbl}>Raison sociale *</label>
                  <input value={name} onChange={e=>{setName(e.target.value);mark();}} style={inp} />
                </div>
                <div>
                  <label style={lbl}>SIRET</label>
                  <input value={siret} onChange={e=>{setSiret(e.target.value);mark();}} style={inp} placeholder="12345678900001" />
                </div>
                <div>
                  <label style={lbl}>N° TVA intracommunautaire</label>
                  <input value={tva} onChange={e=>{setTva(e.target.value);mark();}} style={inp} placeholder="FR 00 000000000" />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={lbl}>Site web</label>
                  <input value={website} onChange={e=>{setWebsite(e.target.value);mark();}} style={inp} placeholder="https://votresite.fr" />
                </div>
              </div>
            </SectionCard>

            {/* Adresse */}
            <SectionCard title="Adresse">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={lbl}>Adresse</label>
                  <input value={address} onChange={e=>{setAddress(e.target.value);mark();}} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Code postal</label>
                  <input value={postal} onChange={e=>{setPostal(e.target.value);mark();}} style={inp} />
                </div>
                <div>
                  <label style={lbl}>Ville</label>
                  <input value={city} onChange={e=>{setCity(e.target.value);mark();}} style={inp} />
                </div>
                <div style={{ gridColumn:"1/-1" }}>
                  <label style={lbl}>Pays</label>
                  <select value={country} onChange={e=>{setCountry(e.target.value);mark();}} style={{...inp,cursor:"pointer"}}>
                    {["France","Belgique","Suisse","Luxembourg","Canada","Autre"].map(c=><option key={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </SectionCard>

            {/* Contact facturation */}
            <SectionCard title="Contact facturation" subtitle="Utilisé pour l'envoi des factures et des alertes comptables.">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
                <div>
                  <label style={lbl}>E-mail</label>
                  <input value={email} onChange={e=>{setEmail(e.target.value);mark();}} style={inp} placeholder="compta@votreentreprise.fr" />
                </div>
                <div>
                  <label style={lbl}>Téléphone</label>
                  <input value={phone} onChange={e=>{setPhone(e.target.value);mark();}} style={inp} placeholder="+33 1 23 45 67 89" />
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
      <SaveBar dirty={isDirty} onSave={save} onReset={reset} />
    </PayNowShell>
  );
}
