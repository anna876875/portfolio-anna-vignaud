"use client";
import { useState, useRef, useEffect } from "react";
import {
  RotateCcw, Rocket,
  Check, FileText, AlertCircle,
} from "lucide-react";
import { PayNowShell, PN, FONT } from "../../_shell";
import { SecondaryNav } from "../_perso";

/* ─────────────────────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────────────────────── */
type Lang = "de"|"en"|"es"|"fr"|"it"|"ja"|"nl"|"pl"|"pt"|"ru"|"sv";
type CustomTexts = Partial<Record<Lang, Partial<Record<string, string>>>>;

/* ─────────────────────────────────────────────────────────────────────────────
   LANGUAGES
───────────────────────────────────────────────────────────────────────────── */
const LANGS: { id: Lang; label: string }[] = [
  { id:"de", label:"Allemand"    },
  { id:"en", label:"Anglais"     },
  { id:"es", label:"Espagnol"    },
  { id:"fr", label:"Français"    },
  { id:"it", label:"Italien"     },
  { id:"ja", label:"Japonais"    },
  { id:"nl", label:"Néerlandais" },
  { id:"pl", label:"Polonais"    },
  { id:"pt", label:"Portugais"   },
  { id:"ru", label:"Russe"       },
  { id:"sv", label:"Suédois"     },
];

/* ─────────────────────────────────────────────────────────────────────────────
   TRANSLATION KEYS (French defaults)
───────────────────────────────────────────────────────────────────────────── */
const TRANSLATIONS: { code: string; category: string; default: string }[] = [
  /* Boutons */
  { code:"SUBMIT_BUTTON_LABEL",         category:"Boutons",    default:"VALIDER" },
  { code:"PAY_BUTTON_LABEL",            category:"Boutons",    default:"PAYER" },
  { code:"CANCEL_BUTTON_LABEL",         category:"Boutons",    default:"ANNULER" },
  { code:"BACK_BUTTON_LABEL",           category:"Boutons",    default:"RETOUR" },
  /* Navigation */
  { code:"SUCCESS_FOOTER_MSG_RETURN",   category:"Navigation", default:"Retourner à la boutique" },
  { code:"CANCEL_FOOTER_MSG_RETURN",    category:"Navigation", default:"Annuler et retourner à la boutique" },
  /* Champs de formulaire */
  { code:"CARD_NUMBER_LABEL",           category:"Formulaire", default:"Numéro de carte" },
  { code:"EXPIRY_DATE_LABEL",           category:"Formulaire", default:"Date d'expiration" },
  { code:"CVV_LABEL",                   category:"Formulaire", default:"Cryptogramme visuel" },
  { code:"CARDHOLDER_NAME_LABEL",       category:"Formulaire", default:"Nom du porteur" },
  { code:"EMAIL_LABEL",                 category:"Formulaire", default:"Adresse e-mail" },
  { code:"PHONE_LABEL",                 category:"Formulaire", default:"Numéro de téléphone" },
  { code:"TOTAL_AMOUNT_LABEL",          category:"Formulaire", default:"Montant total" },
  { code:"SITE_DE_LABEL",               category:"Formulaire", default:"Adresse du marchand" },
  /* Messages de sécurité */
  { code:"SECURE_MESSAGE",              category:"Sécurité",   default:"L'adresse de ce site de paiement préfixée par 'https' indique que vous êtes sur un site sécurisé et que vous pouvez régler en toute confiance." },
  { code:"SECURE_MESSAGE_REGISTER",     category:"Sécurité",   default:"L'adresse de ce site de paiement préfixée par 'https' indique que vous êtes sur un site sécurisé et que vous devez enregistrer votre moyen de paiement en toute confiance." },
  /* Messages d'état */
  { code:"LOADING_MESSAGE",             category:"Messages",   default:"Chargement en cours..." },
  { code:"ERROR_GENERIC_MESSAGE",       category:"Messages",   default:"Une erreur s'est produite. Veuillez réessayer." },
  { code:"TIMEOUT_MESSAGE",             category:"Messages",   default:"La session a expiré. Veuillez recommencer votre paiement." },
  { code:"SUCCESS_MESSAGE",             category:"Messages",   default:"Votre paiement a bien été pris en compte." },
  { code:"REFUSED_MESSAGE",             category:"Messages",   default:"Votre paiement a été refusé. Veuillez vérifier vos informations ou contacter votre banque." },
];

/* ─────────────────────────────────────────────────────────────────────────────
   DEFAULT TEXTS PER LANGUAGE
───────────────────────────────────────────────────────────────────────────── */
const LANG_DEFAULTS: Partial<Record<Lang, Record<string,string>>> = {
  fr: {
    SUBMIT_BUTTON_LABEL:"VALIDER", PAY_BUTTON_LABEL:"PAYER", CANCEL_BUTTON_LABEL:"ANNULER", BACK_BUTTON_LABEL:"RETOUR",
    SUCCESS_FOOTER_MSG_RETURN:"Retourner à la boutique", CANCEL_FOOTER_MSG_RETURN:"Annuler et retourner à la boutique",
    CARD_NUMBER_LABEL:"Numéro de carte", EXPIRY_DATE_LABEL:"Date d'expiration", CVV_LABEL:"Cryptogramme visuel",
    CARDHOLDER_NAME_LABEL:"Nom du porteur", EMAIL_LABEL:"Adresse e-mail", PHONE_LABEL:"Numéro de téléphone",
    TOTAL_AMOUNT_LABEL:"Montant total", SITE_DE_LABEL:"Adresse du marchand",
    SECURE_MESSAGE:"L'adresse de ce site de paiement préfixée par 'https' indique que vous êtes sur un site sécurisé et que vous pouvez régler en toute confiance.",
    SECURE_MESSAGE_REGISTER:"L'adresse de ce site de paiement préfixée par 'https' indique que vous êtes sur un site sécurisé et que vous devez enregistrer votre moyen de paiement en toute confiance.",
    LOADING_MESSAGE:"Chargement en cours...", ERROR_GENERIC_MESSAGE:"Une erreur s'est produite. Veuillez réessayer.",
    TIMEOUT_MESSAGE:"La session a expiré. Veuillez recommencer votre paiement.",
    SUCCESS_MESSAGE:"Votre paiement a bien été pris en compte.",
    REFUSED_MESSAGE:"Votre paiement a été refusé. Veuillez vérifier vos informations ou contacter votre banque.",
  },
  en: {
    SUBMIT_BUTTON_LABEL:"SUBMIT", PAY_BUTTON_LABEL:"PAY", CANCEL_BUTTON_LABEL:"CANCEL", BACK_BUTTON_LABEL:"BACK",
    SUCCESS_FOOTER_MSG_RETURN:"Return to store", CANCEL_FOOTER_MSG_RETURN:"Cancel and return to store",
    CARD_NUMBER_LABEL:"Card number", EXPIRY_DATE_LABEL:"Expiry date", CVV_LABEL:"Security code",
    CARDHOLDER_NAME_LABEL:"Cardholder name", EMAIL_LABEL:"Email address", PHONE_LABEL:"Phone number",
    TOTAL_AMOUNT_LABEL:"Total amount", SITE_DE_LABEL:"Merchant address",
    SECURE_MESSAGE:"The 'https' prefix of this payment page confirms you are on a secure site and may pay with confidence.",
    SECURE_MESSAGE_REGISTER:"The 'https' prefix of this payment page confirms you are on a secure site and may register your payment method with confidence.",
    LOADING_MESSAGE:"Loading...", ERROR_GENERIC_MESSAGE:"An error occurred. Please try again.",
    TIMEOUT_MESSAGE:"Your session has expired. Please restart your payment.",
    SUCCESS_MESSAGE:"Your payment has been successfully processed.",
    REFUSED_MESSAGE:"Your payment was declined. Please check your details or contact your bank.",
  },
  de: {
    SUBMIT_BUTTON_LABEL:"BESTÄTIGEN", PAY_BUTTON_LABEL:"BEZAHLEN", CANCEL_BUTTON_LABEL:"ABBRECHEN", BACK_BUTTON_LABEL:"ZURÜCK",
    SUCCESS_FOOTER_MSG_RETURN:"Zurück zum Shop", CANCEL_FOOTER_MSG_RETURN:"Abbrechen und zum Shop zurückkehren",
    CARD_NUMBER_LABEL:"Kartennummer", EXPIRY_DATE_LABEL:"Ablaufdatum", CVV_LABEL:"Sicherheitscode",
    CARDHOLDER_NAME_LABEL:"Name des Karteninhabers", EMAIL_LABEL:"E-Mail-Adresse", PHONE_LABEL:"Telefonnummer",
    TOTAL_AMOUNT_LABEL:"Gesamtbetrag", SITE_DE_LABEL:"Händleradresse",
    SECURE_MESSAGE:"Das 'https'-Präfix dieser Zahlungsseite zeigt, dass Sie sich auf einer sicheren Website befinden und sicher bezahlen können.",
    SECURE_MESSAGE_REGISTER:"Das 'https'-Präfix dieser Zahlungsseite zeigt, dass Sie sich auf einer sicheren Website befinden und Ihr Zahlungsmittel sicher registrieren können.",
    LOADING_MESSAGE:"Wird geladen...", ERROR_GENERIC_MESSAGE:"Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.",
    TIMEOUT_MESSAGE:"Ihre Sitzung ist abgelaufen. Bitte starten Sie Ihre Zahlung neu.",
    SUCCESS_MESSAGE:"Ihre Zahlung wurde erfolgreich verarbeitet.",
    REFUSED_MESSAGE:"Ihre Zahlung wurde abgelehnt. Bitte überprüfen Sie Ihre Daten oder kontaktieren Sie Ihre Bank.",
  },
  es: {
    SUBMIT_BUTTON_LABEL:"ENVIAR", PAY_BUTTON_LABEL:"PAGAR", CANCEL_BUTTON_LABEL:"CANCELAR", BACK_BUTTON_LABEL:"VOLVER",
    SUCCESS_FOOTER_MSG_RETURN:"Volver a la tienda", CANCEL_FOOTER_MSG_RETURN:"Cancelar y volver a la tienda",
    CARD_NUMBER_LABEL:"Número de tarjeta", EXPIRY_DATE_LABEL:"Fecha de vencimiento", CVV_LABEL:"Código de seguridad",
    CARDHOLDER_NAME_LABEL:"Nombre del titular", EMAIL_LABEL:"Correo electrónico", PHONE_LABEL:"Número de teléfono",
    TOTAL_AMOUNT_LABEL:"Importe total", SITE_DE_LABEL:"Dirección del comercio",
    SECURE_MESSAGE:"El prefijo 'https' de esta dirección de pago indica que está en un sitio seguro y puede pagar con confianza.",
    SECURE_MESSAGE_REGISTER:"El prefijo 'https' de esta dirección de pago indica que está en un sitio seguro y puede registrar su método de pago con confianza.",
    LOADING_MESSAGE:"Cargando...", ERROR_GENERIC_MESSAGE:"Se produjo un error. Por favor, inténtelo de nuevo.",
    TIMEOUT_MESSAGE:"Su sesión ha expirado. Por favor, reinicie su pago.",
    SUCCESS_MESSAGE:"Su pago ha sido procesado correctamente.",
    REFUSED_MESSAGE:"Su pago fue rechazado. Verifique sus datos o contacte con su banco.",
  },
  it: {
    SUBMIT_BUTTON_LABEL:"CONFERMA", PAY_BUTTON_LABEL:"PAGA", CANCEL_BUTTON_LABEL:"ANNULLA", BACK_BUTTON_LABEL:"INDIETRO",
    SUCCESS_FOOTER_MSG_RETURN:"Torna al negozio", CANCEL_FOOTER_MSG_RETURN:"Annulla e torna al negozio",
    CARD_NUMBER_LABEL:"Numero di carta", EXPIRY_DATE_LABEL:"Data di scadenza", CVV_LABEL:"Codice di sicurezza",
    CARDHOLDER_NAME_LABEL:"Nome del titolare", EMAIL_LABEL:"Indirizzo e-mail", PHONE_LABEL:"Numero di telefono",
    TOTAL_AMOUNT_LABEL:"Importo totale", SITE_DE_LABEL:"Indirizzo del commerciante",
    SECURE_MESSAGE:"Il prefisso 'https' di questo sito di pagamento indica che sei su un sito sicuro e puoi pagare con fiducia.",
    SECURE_MESSAGE_REGISTER:"Il prefisso 'https' di questo sito di pagamento indica che sei su un sito sicuro e puoi registrare il tuo metodo di pagamento con fiducia.",
    LOADING_MESSAGE:"Caricamento in corso...", ERROR_GENERIC_MESSAGE:"Si è verificato un errore. Si prega di riprovare.",
    TIMEOUT_MESSAGE:"La sessione è scaduta. Si prega di riavviare il pagamento.",
    SUCCESS_MESSAGE:"Il pagamento è stato elaborato con successo.",
    REFUSED_MESSAGE:"Il pagamento è stato rifiutato. Verificare i dati o contattare la propria banca.",
  },
  ja: {
    SUBMIT_BUTTON_LABEL:"送信", PAY_BUTTON_LABEL:"支払う", CANCEL_BUTTON_LABEL:"キャンセル", BACK_BUTTON_LABEL:"戻る",
    SUCCESS_FOOTER_MSG_RETURN:"ショップに戻る", CANCEL_FOOTER_MSG_RETURN:"キャンセルしてショップに戻る",
    CARD_NUMBER_LABEL:"カード番号", EXPIRY_DATE_LABEL:"有効期限", CVV_LABEL:"セキュリティコード",
    CARDHOLDER_NAME_LABEL:"カード名義人", EMAIL_LABEL:"メールアドレス", PHONE_LABEL:"電話番号",
    TOTAL_AMOUNT_LABEL:"合計金額", SITE_DE_LABEL:"加盟店住所",
    SECURE_MESSAGE:"このお支払いサイトの「https」は、セキュリティが確保されたサイトであることを示しています。安心してお支払いください。",
    SECURE_MESSAGE_REGISTER:"このお支払いサイトの「https」は、セキュリティが確保されたサイトであることを示しています。安心してお支払い方法を登録してください。",
    LOADING_MESSAGE:"読み込み中...", ERROR_GENERIC_MESSAGE:"エラーが発生しました。もう一度お試しください。",
    TIMEOUT_MESSAGE:"セッションが期限切れになりました。お支払いを最初からやり直してください。",
    SUCCESS_MESSAGE:"お支払いが完了しました。",
    REFUSED_MESSAGE:"お支払いが拒否されました。情報を確認するか、銀行にお問い合わせください。",
  },
  nl: {
    SUBMIT_BUTTON_LABEL:"BEVESTIGEN", PAY_BUTTON_LABEL:"BETALEN", CANCEL_BUTTON_LABEL:"ANNULEREN", BACK_BUTTON_LABEL:"TERUG",
    SUCCESS_FOOTER_MSG_RETURN:"Terug naar de winkel", CANCEL_FOOTER_MSG_RETURN:"Annuleren en terug naar de winkel",
    CARD_NUMBER_LABEL:"Kaartnummer", EXPIRY_DATE_LABEL:"Vervaldatum", CVV_LABEL:"Beveiligingscode",
    CARDHOLDER_NAME_LABEL:"Naam kaarthouder", EMAIL_LABEL:"E-mailadres", PHONE_LABEL:"Telefoonnummer",
    TOTAL_AMOUNT_LABEL:"Totaalbedrag", SITE_DE_LABEL:"Adres verkoper",
    SECURE_MESSAGE:"Het 'https'-voorvoegsel van dit betaalsiteadres geeft aan dat u zich op een beveiligde site bevindt en veilig kunt betalen.",
    SECURE_MESSAGE_REGISTER:"Het 'https'-voorvoegsel van dit betaalsiteadres geeft aan dat u zich op een beveiligde site bevindt en veilig uw betaalmethode kunt registreren.",
    LOADING_MESSAGE:"Laden...", ERROR_GENERIC_MESSAGE:"Er is een fout opgetreden. Probeer het opnieuw.",
    TIMEOUT_MESSAGE:"Uw sessie is verlopen. Start uw betaling opnieuw.",
    SUCCESS_MESSAGE:"Uw betaling is succesvol verwerkt.",
    REFUSED_MESSAGE:"Uw betaling is geweigerd. Controleer uw gegevens of neem contact op met uw bank.",
  },
  pl: {
    SUBMIT_BUTTON_LABEL:"WYŚLIJ", PAY_BUTTON_LABEL:"ZAPŁAĆ", CANCEL_BUTTON_LABEL:"ANULUJ", BACK_BUTTON_LABEL:"WRÓĆ",
    SUCCESS_FOOTER_MSG_RETURN:"Wróć do sklepu", CANCEL_FOOTER_MSG_RETURN:"Anuluj i wróć do sklepu",
    CARD_NUMBER_LABEL:"Numer karty", EXPIRY_DATE_LABEL:"Data ważności", CVV_LABEL:"Kod bezpieczeństwa",
    CARDHOLDER_NAME_LABEL:"Imię i nazwisko posiadacza karty", EMAIL_LABEL:"Adres e-mail", PHONE_LABEL:"Numer telefonu",
    TOTAL_AMOUNT_LABEL:"Łączna kwota", SITE_DE_LABEL:"Adres sprzedawcy",
    SECURE_MESSAGE:"Prefiks 'https' w adresie tej strony płatności wskazuje, że jesteś na bezpiecznej stronie i możesz płacić bez obaw.",
    SECURE_MESSAGE_REGISTER:"Prefiks 'https' w adresie tej strony płatności wskazuje, że jesteś na bezpiecznej stronie i możesz bezpiecznie zarejestrować metodę płatności.",
    LOADING_MESSAGE:"Ładowanie...", ERROR_GENERIC_MESSAGE:"Wystąpił błąd. Spróbuj ponownie.",
    TIMEOUT_MESSAGE:"Sesja wygasła. Proszę ponownie rozpocząć płatność.",
    SUCCESS_MESSAGE:"Twoja płatność została pomyślnie przetworzona.",
    REFUSED_MESSAGE:"Twoja płatność została odrzucona. Sprawdź swoje dane lub skontaktuj się z bankiem.",
  },
  pt: {
    SUBMIT_BUTTON_LABEL:"ENVIAR", PAY_BUTTON_LABEL:"PAGAR", CANCEL_BUTTON_LABEL:"CANCELAR", BACK_BUTTON_LABEL:"VOLTAR",
    SUCCESS_FOOTER_MSG_RETURN:"Voltar à loja", CANCEL_FOOTER_MSG_RETURN:"Cancelar e voltar à loja",
    CARD_NUMBER_LABEL:"Número do cartão", EXPIRY_DATE_LABEL:"Data de validade", CVV_LABEL:"Código de segurança",
    CARDHOLDER_NAME_LABEL:"Nome do titular", EMAIL_LABEL:"Endereço de e-mail", PHONE_LABEL:"Número de telefone",
    TOTAL_AMOUNT_LABEL:"Valor total", SITE_DE_LABEL:"Endereço do comerciante",
    SECURE_MESSAGE:"O prefixo 'https' do endereço deste site de pagamento indica que você está em um site seguro e pode pagar com confiança.",
    SECURE_MESSAGE_REGISTER:"O prefixo 'https' do endereço deste site de pagamento indica que você está em um site seguro e pode registrar seu método de pagamento com confiança.",
    LOADING_MESSAGE:"Carregando...", ERROR_GENERIC_MESSAGE:"Ocorreu um erro. Por favor, tente novamente.",
    TIMEOUT_MESSAGE:"Sua sessão expirou. Por favor, reinicie seu pagamento.",
    SUCCESS_MESSAGE:"Seu pagamento foi processado com sucesso.",
    REFUSED_MESSAGE:"Seu pagamento foi recusado. Verifique seus dados ou entre em contato com seu banco.",
  },
  ru: {
    SUBMIT_BUTTON_LABEL:"ОТПРАВИТЬ", PAY_BUTTON_LABEL:"ОПЛАТИТЬ", CANCEL_BUTTON_LABEL:"ОТМЕНА", BACK_BUTTON_LABEL:"НАЗАД",
    SUCCESS_FOOTER_MSG_RETURN:"Вернуться в магазин", CANCEL_FOOTER_MSG_RETURN:"Отменить и вернуться в магазин",
    CARD_NUMBER_LABEL:"Номер карты", EXPIRY_DATE_LABEL:"Срок действия", CVV_LABEL:"Код безопасности",
    CARDHOLDER_NAME_LABEL:"Имя держателя карты", EMAIL_LABEL:"Адрес эл. почты", PHONE_LABEL:"Номер телефона",
    TOTAL_AMOUNT_LABEL:"Итого", SITE_DE_LABEL:"Адрес продавца",
    SECURE_MESSAGE:"Префикс «https» в адресе этого платёжного сайта указывает, что вы находитесь на защищённом сайте и можете безопасно совершить платёж.",
    SECURE_MESSAGE_REGISTER:"Префикс «https» в адресе этого платёжного сайта указывает, что вы находитесь на защищённом сайте и можете безопасно зарегистрировать способ оплаты.",
    LOADING_MESSAGE:"Загрузка...", ERROR_GENERIC_MESSAGE:"Произошла ошибка. Пожалуйста, попробуйте ещё раз.",
    TIMEOUT_MESSAGE:"Сессия истекла. Пожалуйста, перезапустите платёж.",
    SUCCESS_MESSAGE:"Ваш платёж успешно обработан.",
    REFUSED_MESSAGE:"Ваш платёж отклонён. Проверьте данные или обратитесь в свой банк.",
  },
  sv: {
    SUBMIT_BUTTON_LABEL:"SKICKA", PAY_BUTTON_LABEL:"BETALA", CANCEL_BUTTON_LABEL:"AVBRYT", BACK_BUTTON_LABEL:"TILLBAKA",
    SUCCESS_FOOTER_MSG_RETURN:"Tillbaka till butiken", CANCEL_FOOTER_MSG_RETURN:"Avbryt och gå tillbaka till butiken",
    CARD_NUMBER_LABEL:"Kortnummer", EXPIRY_DATE_LABEL:"Utgångsdatum", CVV_LABEL:"Säkerhetskod",
    CARDHOLDER_NAME_LABEL:"Kortinnehavarens namn", EMAIL_LABEL:"E-postadress", PHONE_LABEL:"Telefonnummer",
    TOTAL_AMOUNT_LABEL:"Totalt belopp", SITE_DE_LABEL:"Handlarens adress",
    SECURE_MESSAGE:"Prefixet 'https' i den här betalsidans adress visar att du är på en säker sida och kan betala med förtroende.",
    SECURE_MESSAGE_REGISTER:"Prefixet 'https' i den här betalsidans adress visar att du är på en säker sida och kan registrera din betalningsmetod med förtroende.",
    LOADING_MESSAGE:"Laddar...", ERROR_GENERIC_MESSAGE:"Ett fel uppstod. Försök igen.",
    TIMEOUT_MESSAGE:"Din session har gått ut. Starta om betalningen.",
    SUCCESS_MESSAGE:"Din betalning har behandlats framgångsrikt.",
    REFUSED_MESSAGE:"Din betalning nekades. Kontrollera dina uppgifter eller kontakta din bank.",
  },
};

const CATEGORY_COLORS: Record<string,string> = {
  "Boutons":    "#7C3AED",
  "Navigation": PN.blue,
  "Formulaire": PN.green,
  "Sécurité":   PN.amber,
  "Messages":   PN.ink3,
};

/* ─────────────────────────────────────────────────────────────────────────────
   PAGE
───────────────────────────────────────────────────────────────────────────── */
export default function TraductionsPage() {
  const [activeLang,      setActiveLang]      = useState<Lang>("fr");
  const [customTexts,     setCustomTexts]     = useState<CustomTexts>({});
  const [editingCode,     setEditingCode]     = useState<string|null>(null);
  const [editingValue,    setEditingValue]    = useState("");
  const [activated,       setActivated]       = useState(false);
  const [showSuccess,     setShowSuccess]     = useState(false);
  const [filterCategory,  setFilterCategory]  = useState("Tous");
  const inputRef = useRef<HTMLInputElement|null>(null);

  const langTexts = customTexts[activeLang] ?? {};
  const hasCustom = Object.keys(langTexts).some(k => langTexts[k]);
  const customCount = Object.values(langTexts).filter(Boolean).length;
  const langLabel = LANGS.find(l => l.id === activeLang)?.label ?? "";

  const categories = ["Tous", ...Array.from(new Set(TRANSLATIONS.map(t => t.category)))];
  const filtered = filterCategory === "Tous" ? TRANSLATIONS : TRANSLATIONS.filter(t => t.category === filterCategory);

  function startEdit(code: string) {
    setEditingCode(code);
    setEditingValue(langTexts[code] ?? "");
    setTimeout(() => inputRef.current?.focus(), 0);
  }

  function saveEdit() {
    if (!editingCode) return;
    setCustomTexts(prev => ({
      ...prev,
      [activeLang]: { ...(prev[activeLang] ?? {}), [editingCode]: editingValue.trim() },
    }));
    setEditingCode(null);
    setEditingValue("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") { setEditingCode(null); setEditingValue(""); }
  }

  function resetLang() {
    setCustomTexts(prev => { const n = { ...prev }; delete n[activeLang]; return n; });
  }

  function activateProduction() {
    setActivated(true);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  }

  return (
    <PayNowShell activePage="perso">
      <div style={{ display:"flex", height:"100%", overflow:"hidden" }}>

        <SecondaryNav activeId="traductions" />

        {/* ════ MAIN CONTENT ════ */}
        <div style={{ flex:1, overflowY:"auto" }}>
          <div style={{ padding:"44px 44px 60px" }}>

            {/* HEADER */}
            <div style={{ marginBottom:6 }}>
              <h1 style={{ margin:0, fontSize:24, fontWeight:800, color:PN.primary, letterSpacing:"-0.035em", fontFamily:FONT }}>
                Traductions
              </h1>
              <p style={{ margin:"8px 0 0", fontSize:13.5, color:PN.ink2, fontFamily:FONT, lineHeight:1.55, maxWidth:620 }}>
                Personnalisez vos textes. Vos textes s&apos;affichent sur vos parcours de paiement.
                Laissez vide pour conserver le texte par défaut.
              </p>
            </div>

            {/* SUCCESS TOAST */}
            {showSuccess && (
              <div style={{
                display:"flex", alignItems:"center", gap:10,
                background:PN.greenBg, border:`1px solid ${PN.green}40`,
                borderLeft:`3px solid ${PN.green}`,
                borderRadius:PN.r.md, padding:"12px 16px", marginTop:20,
                fontFamily:FONT, fontSize:13.5, fontWeight:600, color:PN.greenText,
              }}>
                <Check size={16} style={{ flexShrink:0 }} />
                Les traductions ont bien été activées en production.
              </div>
            )}

            {/* LANGUAGE TABS */}
            <div style={{ marginTop:28, position:"relative", display:"flex", alignItems:"flex-end", gap:0, overflowX:"auto" }}>
              {LANGS.map(lang => (
                <button key={lang.id} onClick={() => setActiveLang(lang.id)} style={{
                  padding:"11px 16px 10px", border:"none", background:"none", cursor:"pointer",
                  fontSize:13.5, fontFamily:FONT, whiteSpace:"nowrap",
                  fontWeight: activeLang === lang.id ? 700 : 500,
                  color: activeLang === lang.id ? PN.primary : PN.ink2,
                  transition:"color 0.15s",
                  position:"relative",
                }}>
                  {lang.label}
                  {(customTexts[lang.id] && Object.values(customTexts[lang.id]!).some(Boolean)) && (
                    <span style={{ position:"absolute", top:7, right:4, width:6, height:6, borderRadius:"50%", background:PN.primary }} />
                  )}
                  {/* Active indicator — same width as button, placed just above the grey divider */}
                  {activeLang === lang.id && (
                    <span style={{ position:"absolute", bottom:0, left:0, right:0, height:2, background:PN.primary, borderRadius:"2px 2px 0 0", zIndex:1 }} />
                  )}
                </button>
              ))}
              {/* Full-width grey divider below all tabs */}
              <div style={{ position:"absolute", bottom:0, left:0, right:0, height:1, background:PN.bord }} />
            </div>

            {/* ACTION BAR */}
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 0", marginBottom:4, gap:12, flexWrap:"wrap" }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {hasCustom
                  ? <span style={{ fontSize:13, fontWeight:600, color:PN.primary, fontFamily:FONT }}>
                      {customCount} personnalisation{customCount>1?"s":""} en {langLabel}
                    </span>
                  : <span style={{ fontSize:13, color:PN.ink3, fontFamily:FONT, fontStyle:"italic" }}>
                      Aucune personnalisation en {langLabel}
                    </span>
                }
                {hasCustom && (
                  <button onClick={resetLang} style={{ display:"flex", alignItems:"center", gap:5, border:"none", background:"none", cursor:"pointer", fontSize:12.5, fontWeight:600, color:PN.ink2, fontFamily:FONT, padding:"4px 8px", borderRadius:PN.r.sm }}>
                    <RotateCcw size={12} />
                    Réinitialiser les valeurs par défaut
                  </button>
                )}
              </div>

              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                {/* Category filter */}
                <div style={{ display:"flex", alignItems:"center", gap:4 }}>
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setFilterCategory(cat)} style={{
                      padding:"5px 11px", border:`1px solid ${filterCategory===cat?PN.primary:PN.bord}`,
                      borderRadius:PN.r.full, cursor:"pointer",
                      background:filterCategory===cat?PN.primaryBg:"transparent",
                      color:filterCategory===cat?PN.primary:PN.ink2,
                      fontSize:12, fontWeight:filterCategory===cat?700:500, fontFamily:FONT, whiteSpace:"nowrap",
                    }}>
                      {cat}
                    </button>
                  ))}
                </div>

                <button onClick={activateProduction} style={{
                  display:"flex", alignItems:"center", gap:7,
                  background: activated ? PN.green : PN.primary,
                  color:"#fff", border:"none", borderRadius:PN.r.md,
                  padding:"9px 18px", fontSize:13.5, fontWeight:700, fontFamily:FONT,
                  cursor:"pointer", whiteSpace:"nowrap", flexShrink:0,
                  boxShadow: activated ? "0 2px 8px rgba(5,150,105,0.3)" : "0 2px 10px rgba(59,126,248,0.32)",
                  transition:"background 0.2s",
                }}>
                  {activated ? <Check size={14} strokeWidth={2.5} /> : <Rocket size={14} strokeWidth={2} />}
                  {activated ? "Activé en production" : "Activer en production"}
                </button>
              </div>
            </div>

            {/* TABLE */}
            <div style={{ background:"#fff", border:`1px solid ${PN.bord}`, borderRadius:PN.r.xl, overflow:"hidden", boxShadow:"0 2px 12px rgba(11,26,52,0.05)" }}>
              <table style={{ width:"100%", borderCollapse:"collapse" }}>
                <thead>
                  <tr style={{ background:PN.surf, borderBottom:`1px solid ${PN.bord}` }}>
                    {[
                      { label:"CODE",              w:"28%" },
                      { label:"TEXTE PAR DÉFAUT",  w:"34%" },
                      { label:"TEXTE PERSONNALISÉ",w:"38%" },
                    ].map(col => (
                      <th key={col.label} style={{ padding:"12px 18px", textAlign:"left", fontSize:10.5, fontWeight:700, color:PN.ink3, letterSpacing:"0.07em", textTransform:"uppercase", fontFamily:FONT, width:col.w }}>
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((row, i) => {
                    const customVal  = langTexts[row.code] ?? "";
                    const defaultVal = LANG_DEFAULTS[activeLang]?.[row.code] ?? row.default;
                    const isEditing  = editingCode === row.code;
                    const catColor   = CATEGORY_COLORS[row.category] ?? PN.ink3;

                    return (
                      <tr key={row.code} className="pn-tr" style={{ borderBottom:i<filtered.length-1?`1px solid ${PN.bord}`:"none" }}>

                        {/* CODE */}
                        <td style={{ padding:"14px 18px", verticalAlign:"top" }}>
                          <div style={{ display:"flex", flexDirection:"column", gap:5 }}>
                            <code style={{ fontSize:12, fontFamily:"monospace", color:PN.ink, background:PN.surf, border:`1px solid ${PN.bord}`, borderRadius:PN.r.xs, padding:"2px 7px", display:"inline-block", lineHeight:1.5, letterSpacing:"0.02em" }}>
                              {row.code}
                            </code>
                            <span style={{ fontSize:10.5, fontWeight:700, color:catColor, fontFamily:FONT, letterSpacing:"0.04em", textTransform:"uppercase" }}>
                              {row.category}
                            </span>
                          </div>
                        </td>

                        {/* TEXTE PAR DÉFAUT */}
                        <td style={{ padding:"14px 18px", verticalAlign:"top" }}>
                          <span style={{ fontSize:13, color:PN.ink2, fontFamily:FONT, lineHeight:1.55 }}>
                            {defaultVal}
                          </span>
                        </td>

                        {/* TEXTE PERSONNALISÉ — inline edit on double-click */}
                        <td
                          style={{ padding:"14px 18px", verticalAlign:"top", cursor:isEditing?"default":"text" }}
                          onDoubleClick={() => !isEditing && startEdit(row.code)}
                        >
                          {isEditing ? (
                            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                              <input
                                ref={inputRef}
                                value={editingValue}
                                onChange={e => setEditingValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                onBlur={saveEdit}
                                placeholder={defaultVal}
                                style={{
                                  width:"100%", boxSizing:"border-box",
                                  border:`2px solid ${PN.primary}`,
                                  borderRadius:PN.r.sm, padding:"7px 10px",
                                  fontSize:13, fontFamily:FONT, color:PN.ink,
                                  outline:"none", lineHeight:1.5,
                                  boxShadow:`0 0 0 3px ${PN.primaryBg}`,
                                }}
                              />
                              <div style={{ display:"flex", gap:6 }}>
                                <button onMouseDown={saveEdit} style={{ padding:"4px 10px", border:"none", borderRadius:PN.r.sm, background:PN.primary, color:"#fff", fontSize:12, fontWeight:700, fontFamily:FONT, cursor:"pointer" }}>
                                  Enregistrer
                                </button>
                                <button onMouseDown={() => { setEditingCode(null); setEditingValue(""); }} style={{ padding:"4px 10px", border:`1px solid ${PN.bord}`, borderRadius:PN.r.sm, background:"#fff", color:PN.ink2, fontSize:12, fontFamily:FONT, cursor:"pointer" }}>
                                  Annuler
                                </button>
                              </div>
                            </div>
                          ) : customVal ? (
                            <div style={{ display:"flex", alignItems:"flex-start", gap:8 }}>
                              <span style={{ fontSize:13, color:PN.ink, fontFamily:FONT, lineHeight:1.55, flex:1 }}>
                                {customVal}
                              </span>
                              <span style={{ fontSize:10, background:PN.primaryBg, color:PN.primary, borderRadius:PN.r.full, padding:"2px 7px", fontWeight:700, fontFamily:FONT, whiteSpace:"nowrap", flexShrink:0, marginTop:1 }}>
                                Modifié
                              </span>
                            </div>
                          ) : (
                            <span style={{ fontSize:12.5, color:PN.ink4, fontFamily:FONT, fontStyle:"italic" }}>
                              Double-cliquez pour personnaliser
                            </span>
                          )}
                        </td>

                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* FOOTER NOTE */}
            <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:18, fontSize:12.5, color:PN.ink3, fontFamily:FONT }}>
              <AlertCircle size={13} style={{ flexShrink:0 }} />
              Les modifications sont sauvegardées en environnement de test. Cliquez sur &laquo;&nbsp;Activer en production&nbsp;&raquo; pour les déployer.
            </div>

          </div>
        </div>
      </div>
    </PayNowShell>
  );
}
