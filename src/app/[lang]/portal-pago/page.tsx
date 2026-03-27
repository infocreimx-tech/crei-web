"use client";

import { useState, useRef } from "react";
import Script from "next/script";
import { CreditCard, Lock, ShieldCheck, Mail, User, CheckCircle2, Loader2, Info } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

declare global {
  interface Window {
    OpenPay: any;
  }
}

export default function PaymentPortal() {
  const { lang } = useI18n();
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [successToken, setSuccessToken] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    holderName: "",
    cardNumber: "",
    expMonth: "",
    expYear: "",
    cvv: "",
    amount: "1500", // Default example amount
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleOpenpaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setErrorMsg(null);
    setSuccessToken(null);

    // Openpay sandbox keys integration
    const MERCHANT_ID = "mx1234567890test"; 
    const PUBLIC_KEY = "pk_1234567890sandbox";

    try {
      if (typeof window === "undefined" || !window.OpenPay) {
        throw new Error("Openpay no ha cargado correctamente. Revisa tu conexión.");
      }

      window.OpenPay.setId(MERCHANT_ID);
      window.OpenPay.setApiKey(PUBLIC_KEY);
      window.OpenPay.setSandboxMode(true); 

      const deviceSessionId = window.OpenPay.deviceData.setup(
        "payment-form",
        "deviceIdHiddenFieldName"
      );

      // Call token creation
      window.OpenPay.token.create(
        {
          holder_name: formData.holderName,
          card_number: formData.cardNumber.replace(/\s+/g, ""),
          expiration_month: formData.expMonth,
          expiration_year: formData.expYear.slice(-2),
          cvv2: formData.cvv,
        },
        (response: any) => {
          setIsProcessing(false);
          setSuccessToken(response.data.id);
          console.log("Token generated:", response.data.id, "Session:", deviceSessionId, "Monto:", formData.amount);
        },
        (error: any) => {
          setIsProcessing(false);
          setErrorMsg(error.message || error.description || "Error procesando la tarjeta. Verifica los datos.");
        }
      );
    } catch (err: any) {
      setIsProcessing(false);
      setErrorMsg(err.message || "Error al inicializar Openpay.");
    }
  };

  return (
    <main className="min-h-screen bg-[#fdfbf7] relative">
      <Script src="https://js.openpay.mx/openpay.v1.min.js" strategy="lazyOnload" />
      <Script src="https://js.openpay.mx/openpay-data.v1.min.js" strategy="lazyOnload" />

      <Navbar />

      <section className="pt-40 pb-24 relative">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] pointer-events-none -z-10" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-accent font-medium tracking-widest uppercase text-sm mb-3 block">
              {lang === "en" ? "Secure Checkout" : "Checkout Seguro"}
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              {lang === "en" ? "Payment Portal" : "Portal de Pagos"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {lang === "en"
                ? "Complete your payment safely through our 256-bit encrypted BBVA Openpay integration."
                : "Realiza tu pago de forma completamente segura a través de nuestra integración encriptada a 256-bits BBVA Openpay."}
            </p>
          </div>

          <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12 items-start">
            
            {/* Left side: Premium info area */}
            <div className="lg:col-span-2 space-y-8 bg-white/60 p-8 rounded-3xl border border-white/80 backdrop-blur-xl shadow-sm z-20 relative">
              <div>
                <h3 className="text-xl font-bold text-primary mb-2">
                  {lang === "en" ? "Summary & Details" : "Resumen y Detalles"}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  {lang === "en"
                    ? "Your information is transmitted directly to Openpay's secure servers. We never store your raw credit card data."
                    : "Tu información viaja directamente a los servidores seguros de Openpay. Nosotros no guardamos ni procesamos los números crudos de tu tarjeta."}
                </p>

                {/* Monto Visual */}
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-1">Total a Pagar</p>
                  <p className="text-3xl font-serif font-bold text-primary">${formData.amount || "0"} <span className="text-base text-primary/60 font-sans">MXN</span></p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 text-primary">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">PCI DSS Compliant</p>
                    <p className="text-xs text-muted-foreground">Highest grade security</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-primary">
                  <div className="bg-accent/10 p-3 rounded-full">
                    <Lock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">256-bit Encryption</p>
                    <p className="text-xs text-muted-foreground">Data is fully masked</p>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-primary/10 flex items-center justify-center opacity-70">
                <div className="font-serif font-black tracking-widest text-lg text-primary/60 uppercase">
                  OPENPAY <span className="font-sans text-xs align-super ml-1">bbva</span>
                </div>
              </div>
            </div>

            {/* Right side: Payment form */}
            <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-stone-100 z-30 relative">
              
              {successToken ? (
                <div className="flex flex-col items-center justify-center text-center py-10 space-y-4">
                  <div className="bg-green-50 text-green-600 p-4 rounded-full mb-2">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <h3 className="text-2xl font-bold text-stone-900">
                    ¡Pago Encriptado Exitosamente!
                  </h3>
                  <p className="text-stone-500">
                    Tu Token Seguro: <br />
                    <span className="font-mono text-xs bg-stone-100 p-2 rounded mt-2 inline-block">
                      {successToken}
                    </span>
                  </p>
                  <p className="text-stone-500">
                    Monto Ingresado: <span className="font-bold">${formData.amount} MXN</span>
                  </p>
                  <button 
                    onClick={() => { setSuccessToken(null); setFormData(prev => ({ ...prev, cardNumber: "", cvv: "" })); }}
                    className="mt-6 text-accent font-medium hover:underline"
                  >
                    Hacer otro pago
                  </button>
                </div>
              ) : (
                <form id="payment-form" onSubmit={handleOpenpaySubmit} className="space-y-6">
                  
                  <input type="hidden" name="deviceIdHiddenFieldName" id="deviceIdHiddenFieldName" />

                  {errorMsg && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md text-red-700 text-sm">
                      <p className="font-bold">Error de procesamiento</p>
                      <p>{errorMsg}</p>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label htmlFor="amount" className="text-sm font-semibold text-stone-700">Monto a Pagar (MXN)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-stone-400">$</span>
                        <input 
                          id="amount"
                          type="number" 
                          name="amount"
                          required
                          min="1"
                          value={formData.amount}
                          onChange={handleChange}
                          className="w-full pl-8 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none font-bold text-lg text-primary"
                          placeholder="0.00" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="holderName" className="text-sm font-semibold text-stone-700">Nombre en la tarjeta</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                          id="holderName"
                          type="text" 
                          name="holderName"
                          required
                          autoComplete="cc-name"
                          value={formData.holderName}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none text-stone-800"
                          placeholder="Ej. Luis Paniagua" 
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="cardNumber" className="text-sm font-semibold text-stone-700">Número de Tarjeta</label>
                      <div className="relative">
                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                        <input 
                          id="cardNumber"
                          type="text" 
                          name="cardNumber"
                          required
                          autoComplete="cc-number"
                          maxLength={19}
                          value={formData.cardNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none font-mono text-stone-800"
                          placeholder="0000 0000 0000 0000" 
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 space-y-2">
                        <label htmlFor="expMonth" className="text-sm font-semibold text-stone-700">Mes</label>
                        <input 
                          id="expMonth"
                          type="text" 
                          name="expMonth"
                          required
                          autoComplete="cc-exp-month"
                          maxLength={2}
                          value={formData.expMonth}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none text-center text-stone-800"
                          placeholder="01" 
                        />
                      </div>
                      <div className="col-span-1 space-y-2">
                        <label htmlFor="expYear" className="text-sm font-semibold text-stone-700">Año</label>
                        <input 
                          id="expYear"
                          type="text" 
                          name="expYear"
                          required
                          autoComplete="cc-exp-year"
                          maxLength={2}
                          value={formData.expYear}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none text-center text-stone-800"
                          placeholder="26" 
                        />
                      </div>
                      <div className="col-span-1 space-y-2">
                        <label htmlFor="cvv" className="text-sm font-semibold text-stone-700">CVV</label>
                        <div className="relative">
                          <input 
                            id="cvv"
                            type="password" 
                            name="cvv"
                            required
                            autoComplete="cc-csc"
                            maxLength={4}
                            value={formData.cvv}
                            onChange={handleChange}
                            className="w-full pl-4 pr-10 py-3 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:ring-2 focus:ring-accent focus:border-transparent transition-all outline-none text-center text-stone-800"
                            placeholder="123" 
                          />
                          <Info className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-300" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      disabled={isProcessing}
                      className="w-full bg-primary text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-all focus:ring-4 focus:ring-primary/20 disabled:opacity-70"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Procesando Pago Seguro...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Pagar ${formData.amount || "0"} Seguro
                        </>
                      )}
                    </button>
                    <p className="text-center text-xs text-stone-400 mt-4 flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Tus datos son tokenizados encriptados bajo la normativa bancaria PCI.
                    </p>
                  </div>

                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
