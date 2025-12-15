import React, { useState } from 'react';
import { motion } from 'framer-motion';

// --- COMPONENTES VISUAIS AUXILIARES (Spotlight, Background, Icons) ---

export const Spotlight = ({
  gradientFirst = "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(210, 100%, 85%, .08) 0, hsla(210, 100%, 55%, .02) 50%, hsla(210, 100%, 45%, 0) 80%)",
  gradientSecond = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .06) 0, hsla(210, 100%, 55%, .02) 80%, transparent 100%)",
  gradientThird = "radial-gradient(50% 50% at 50% 50%, hsla(210, 100%, 85%, .04) 0, hsla(210, 100%, 45%, .02) 80%, transparent 100%)",
  translateY = -350,
  width = 560,
  height = 1380,
  smallWidth = 240,
  duration = 7,
  xOffset = 100,
}) => {
  return (
    <div className="pointer-events-none absolute inset-0 h-full w-full overflow-hidden">
      <style>
        {`
          @keyframes spotlight-move-left {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(${xOffset}px); }
          }
          @keyframes spotlight-move-right {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-${xOffset}px); }
          }
          .animate-spotlight-left {
            animation: spotlight-move-left ${duration}s ease-in-out infinite;
          }
          .animate-spotlight-right {
            animation: spotlight-move-right ${duration}s ease-in-out infinite;
          }
        `}
      </style>
      <div className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none animate-spotlight-left">
        <div style={{ transform: `translateY(${translateY}px) rotate(-45deg)`, background: gradientFirst, width: `${width}px`, height: `${height}px` }} className="absolute top-0 left-0" />
        <div style={{ transform: "rotate(-45deg) translate(5%, -50%)", background: gradientSecond, width: `${smallWidth}px`, height: `${height}px` }} className="absolute top-0 left-0 origin-top-left" />
        <div style={{ transform: "rotate(-45deg) translate(-180%, -70%)", background: gradientThird, width: `${smallWidth}px`, height: `${height}px` }} className="absolute top-0 left-0 origin-top-left" />
      </div>
      <div className="absolute top-0 right-0 w-screen h-screen z-40 pointer-events-none animate-spotlight-right">
        <div style={{ transform: `translateY(${translateY}px) rotate(45deg)`, background: gradientFirst, width: `${width}px`, height: `${height}px` }} className="absolute top-0 right-0" />
        <div style={{ transform: "rotate(45deg) translate(-5%, -50%)", background: gradientSecond, width: `${smallWidth}px`, height: `${height}px` }} className="absolute top-0 right-0 origin-top-right" />
        <div style={{ transform: "rotate(45deg) translate(180%, -70%)", background: gradientThird, width: `${smallWidth}px`, height: `${height}px` }} className="absolute top-0 right-0 origin-top-right" />
      </div>
    </div>
  );
};

export const DashboardBackground = () => (
  <div
    className="w-full h-full"
    style={{
      backgroundColor: '#111111',
      backgroundImage: `
          linear-gradient(45deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 75%),
          linear-gradient(45deg, rgba(255, 255, 255, 0.04) 25%, transparent 25%, transparent 75%, rgba(255, 255, 255, 0.04) 75%)
      `,
      backgroundSize: '10px 10px',
      backgroundPosition: '0 0, 5px 5px',
    }}
    aria-hidden="true"
  />
);

const WordmarkIcon = (props: React.ComponentProps<"svg">) => (
  <svg viewBox="0 0 84 24" fill="currentColor" {...props}>
    <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fontSize="18" fontFamily="system-ui, sans-serif" fontWeight="bold" letterSpacing="0.05em">
      SÓCIO
    </text>
  </svg>
);

const BrazilFlag = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 50" className="w-5 h-3.5 rounded-sm object-cover shadow-sm">
        <rect width="72" height="50" fill="#009b3a"/>
        <path d="M36 8l29 17-29 17-29-17z" fill="#fedf00"/>
        <circle cx="36" cy="25" r="10.5" fill="#002776"/>
        <path d="M36 25c0-.2.2-.4.3-.5 1.8-1.5 6.7-1.6 9.2-.2" fill="none" stroke="#fff" strokeWidth=".8"/>
    </svg>
);

// --- PÁGINA PRINCIPAL ---

interface LoginPageProps {
  onLogin: () => void;
  onSignup: (userData: any) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // Form States - Pré-preenchido conforme solicitado
  const [formData, setFormData] = useState({
      name: "Pueblo Juan",
      email: "pueblo@example.com",
      whatsapp: "(11) 99999-9999",
      password: "pueblo",
      confirmPassword: "pueblo",
      acceptTerms: true
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
    if (error) setError("");
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData(prev => ({ ...prev, [id]: checked }));
    if (error) setError("");
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    
    // Mask: (XX) XXXXX-XXXX
    if (value.length > 2) {
        value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 10) {
        value = `${value.slice(0, 10)}-${value.slice(10)}`;
    }
    
    setFormData(prev => ({ ...prev, whatsapp: value }));
    if (error) setError("");
  };

  const togglePasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowConfirmPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validações
    if (!formData.email || !formData.password) {
      setError("Preencha os campos obrigatórios.");
      setIsLoading(false);
      return;
    }

    if (!isLogin) {
        if (!formData.name) {
            setError("Preencha seu nome completo.");
            setIsLoading(false);
            return;
        }
        if (formData.password !== formData.confirmPassword) {
            setError("As senhas não coincidem.");
            setIsLoading(false);
            return;
        }
        // CRITICAL FIX: Ensure term validation is checked on submit
        if (formData.acceptTerms !== true) {
            setError("Você deve aceitar os Termos de Uso e Política de Privacidade.");
            setIsLoading(false);
            return;
        }
    }

    if (!formData.email.includes("@") && !(formData.email === "pueblo" && formData.password === "pueblo")) {
      setError("Insira um email válido.");
      setIsLoading(false);
      return;
    }

    try {
      // Simulação de API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setSuccess(true);
      
      setTimeout(() => {
        if (isLogin) {
            onLogin(); // Vai direto pro Dashboard
        } else {
            // Envia dados parciais para o App iniciar o Onboarding
            onSignup({
                name: formData.name,
                email: formData.email
            }); 
        }
      }, 1000);

    } catch (err: any) {
      setError(err.message || "Ocorreu um erro.");
      setIsLoading(false);
    }
  };

  // Animações CSS baseadas no estado
  const toggleClass = "transition-all duration-500 ease-in-out overflow-hidden";
  const expandedClass = "max-h-[500px] opacity-100 mt-3";
  const collapsedClass = "max-h-0 opacity-0 mt-0 pointer-events-none";

  // Icons (Inline SVGs para evitar erros de script externos na carga inicial critica)
  const EyeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 pointer-events-none">
        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
    </svg>
  );
  
  const EyeOffIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 pointer-events-none">
        <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7c.68 0 1.36-.09 2-.27"/><line x1="2" x2="22" y1="2" y2="22"/>
    </svg>
  );

  return (
    <motion.div
      key="login"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, y: -20, transition: { duration: 0.5 } }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black font-sans overflow-y-auto py-10"
    >
      {/* Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none fixed">
        <Spotlight />
      </div>
      
      <div
        className="pointer-events-none absolute inset-0 z-0 fixed"
        style={{
          maskImage: `radial-gradient(circle at 50% 50%, white 0px, rgba(255,255,255,0.9) 120px, rgba(255,255,255,0.3) 240px, transparent 320px)`,
          WebkitMaskImage: `radial-gradient(circle at 50% 50%, white 0px, rgba(255,255,255,0.9) 120px, rgba(255,255,255,0.3) 240px, transparent 320px)`,
        }}
      >
        <div className="w-full h-full opacity-40">
           <DashboardBackground />
        </div>
      </div>

      <div 
        className="pointer-events-none absolute inset-0 z-1 fixed"
        style={{
          maskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, black 95%, transparent 100%)',
        }}
      />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-4 my-auto">
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-950/80 p-8 shadow-2xl backdrop-blur-xl relative transform transition-all duration-500 ease-out scale-100 opacity-100">
          
          {/* Tela de Sucesso */}
          {success && (
            <div className="absolute inset-0 z-20 bg-neutral-950/90 flex flex-col items-center justify-center text-center p-8 animate-in fade-in duration-300">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
                    <svg className="w-8 h-8 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-xl font-bold text-white">
                    {isLogin ? "Login realizado!" : "Conta criada!"}
                </h3>
                <p className="text-neutral-400 text-sm mt-2">
                    {isLogin ? "Redirecionando..." : "Iniciando configuração..."}
                </p>
            </div>
          )}

          <div className="mb-6 text-center">
            <div className="mb-4 flex justify-center text-white">
               <WordmarkIcon className="h-6" />
            </div>
            <h2 className="text-2xl font-bold text-white">
                {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
            </h2>
            <p className="mt-2 text-sm text-neutral-400">
                {isLogin 
                    ? "Acesse seu cérebro estratégico para continuar." 
                    : "Comece sua jornada de gestão inteligente."}
            </p>
          </div>

          {/* Login/Register Toggle with CSS Animation */}
          <div className="relative grid grid-cols-2 gap-1 p-1 bg-white/5 rounded-xl border border-white/10 mb-6">
            {/* Animated Background Pill */}
            <div 
                className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white/10 rounded-lg border border-white/10 shadow-sm transition-all duration-300 ease-in-out ${isLogin ? 'left-1' : 'left-[calc(50%+2px)]'}`}
            ></div>
            
            <button
                onClick={() => { setIsLogin(true); setError(""); }}
                className="relative z-10 px-4 py-2 text-sm font-medium transition-colors outline-none"
                type="button"
            >
                <span className={isLogin ? "text-white" : "text-neutral-400 hover:text-white"}>Entrar</span>
            </button>
            <button
                onClick={() => { setIsLogin(false); setError(""); }}
                className="relative z-10 px-4 py-2 text-sm font-medium transition-colors outline-none"
                type="button"
            >
                <span className={!isLogin ? "text-white" : "text-neutral-400 hover:text-white"}>Cadastrar</span>
            </button>
          </div>

          <form className="flex flex-col gap-0" onSubmit={handleSubmit}>
             <div className={`${toggleClass} ${error ? 'max-h-24 opacity-100 mb-4' : 'max-h-0 opacity-0 mb-0'}`}>
                <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-3">
                    <p className="text-xs text-red-400 text-center font-medium">{error}</p>
                </div>
             </div>

            {/* Campos Extras de Cadastro (Expandable) */}
            <div className={`${toggleClass} ${!isLogin ? expandedClass : collapsedClass}`}>
                <label htmlFor="name" className="text-xs font-medium text-neutral-300 mb-2 block">Nome Completo</label>
                <input
                    id="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Seu nome completo"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none focus:ring-0 disabled:opacity-50 transition-all"
                />
            </div>

            <div className="mt-3">
              <label htmlFor="email" className="text-xs font-medium text-neutral-300 mb-2 block">E-mail</label>
              <input
                id="email"
                type="text" 
                value={formData.email}
                onChange={handleInputChange}
                disabled={isLoading}
                placeholder="seu@email.com"
                className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none focus:ring-0 disabled:opacity-50 transition-all"
              />
            </div>

            <div className={`${toggleClass} ${!isLogin ? expandedClass : collapsedClass}`}>
                <label htmlFor="whatsapp" className="text-xs font-medium text-neutral-300 mb-2 block">WhatsApp <span className="text-red-400">*</span></label>
                <div className="flex gap-2">
                    <div className="shrink-0 flex items-center justify-center px-3 rounded-lg bg-white/5 border border-white/10 text-neutral-400 text-sm gap-2 select-none">
                        <BrazilFlag />
                        <span>+55</span>
                    </div>
                    <input
                        id="whatsapp"
                        type="tel"
                        value={formData.whatsapp}
                        onChange={handlePhoneChange}
                        disabled={isLoading}
                        placeholder="(XX) XXXXX-XXXX"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none focus:ring-0 disabled:opacity-50 transition-all"
                    />
                </div>
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <label htmlFor="password" className="text-xs font-medium text-neutral-300">Senha</label>
                {isLogin && (
                    <a href="#" className="text-xs text-neutral-500 hover:text-white transition-colors">Esqueceu a senha?</a>
                )}
              </div>
              <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    disabled={isLoading}
                    placeholder="Sua senha"
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none focus:ring-0 disabled:opacity-50 transition-all pr-10"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors pointer-events-auto cursor-pointer"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
              </div>
            </div>

            <div className={`${toggleClass} ${!isLogin ? expandedClass : collapsedClass}`}>
                <label htmlFor="confirmPassword" className="text-xs font-medium text-neutral-300 mb-2 block">Confirmar senha</label>
                <div className="relative">
                    <input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        disabled={isLoading}
                        placeholder="Confirme sua senha"
                        className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-neutral-500 focus:border-white/30 focus:outline-none focus:ring-0 disabled:opacity-50 transition-all pr-10"
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 transition-colors pointer-events-auto cursor-pointer"
                        onMouseDown={(e) => e.preventDefault()}
                    >
                        {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                </div>

                <div className="pt-3 flex items-start gap-3">
                    <div className="relative flex items-center">
                        <input
                            id="acceptTerms"
                            type="checkbox"
                            checked={formData.acceptTerms}
                            onChange={handleCheckboxChange}
                            className="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-white/10 bg-white/5 transition-all checked:border-white checked:bg-white hover:border-white/30"
                        />
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-black opacity-0 peer-checked:opacity-100 h-3.5 w-3.5"><polyline points="20 6 9 17 4 12"/></svg>
                    </div>
                    <label htmlFor="acceptTerms" className="text-xs text-neutral-400 leading-tight cursor-pointer select-none">
                        Concordo com os <a href="#" onClick={(e) => e.preventDefault()} className="text-white hover:text-neutral-300 transition-colors font-medium">Termos de Uso</a> e <a href="#" onClick={(e) => e.preventDefault()} className="text-white hover:text-neutral-300 transition-colors font-medium">Política de Privacidade</a>
                    </label>
                </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full relative rounded-full bg-white px-4 py-3 text-sm font-bold text-black transition-all active:scale-95 hover:bg-neutral-200 mt-6 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-h-[44px] shadow-lg shadow-white/10"
            >
              {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
              ) : (isLogin ? "Entrar" : "Criar conta")}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button 
                onClick={() => { setIsLogin(true); setError(""); setFormData(prev => ({ ...prev, acceptTerms: true })); }}
                disabled={isLoading}
                className="text-sm text-neutral-500 hover:text-white transition-colors disabled:opacity-50"
            >
                ← Voltar para o site
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}