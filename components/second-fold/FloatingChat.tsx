
import React, { useState, useEffect, useRef } from "react";
// FIX: Cast motion to `any` to bypass TypeScript errors due to a likely configuration issue.
import { motion as untypedMotion, AnimatePresence } from "framer-motion";
import Keyboard from "./Keyboard";
import { DynamicIsland } from "../dynamic-island/DynamicIsland";
import AudioRecordingBar from "./AudioRecordingBar";

const motion = untypedMotion as any;

const DoubleTick = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2 10L6 14L11 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M8 10L12 14L18 8"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const wallpaperSvg = `data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3e%3cg fill='none' stroke='%23131f24' stroke-width='1.5'%3e%3cpath d='M86 103c-4-2-12 2-12 11s2 13 8 14s13 0 15-5s-1-12-11-20zm128 105c-4-4-10-6-16-4c-6 2-10 8-9 15s6 12 13 12s12-4 13-10c1-6-1-12-7-18z M316 254c0 8-5 14-12 15s-14-1-17-7s-2-13 4-17s12-4 18-1s8 5 10 10z M253 88c-6-3-13-1-17 4s-5 12-2 18s9 10 16 8s12-6 13-13s0-11-10-17z'/%3e%3cpath d='M143 322c-15 0-27 12-27 27s12 27 27 27s27-12 27-27s-12-27-27-27z'/%3e%3cpath d='M25 159a4 4 0 0 1 4-4h18a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4h-18a4 4 0 0 1-4-4v-18z'/%3e%3ccircle cx='293' cy='32' r='20'/%3e%3cpath d='M352 143l-24 16-24-16l24-16l24 16z'/%3e%3c/g%3e%3c/svg%3e`;


const PlayIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M8 5v14l11-7z" /></svg>
);
const PauseIcon = (props: React.ComponentProps<'svg'>) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
);


const AudioMessageBubble = ({ duration = "0:56", timestamp = "0:00" }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0); // 0 to 100
    const durationInSeconds = parseInt(duration.split(':')[1], 10);
    const animationDuration = Math.min(durationInSeconds, 5); 

    const [elapsedTime, setElapsedTime] = useState(0);

    useEffect(() => {
        if (!isPlaying) {
            setProgress(0);
            setElapsedTime(0);
            return;
        }

        let animationFrameId: number;
        let startTime = 0;

        const animate = (timestamp: number) => {
            if (!startTime) startTime = timestamp;
            const elapsedMs = timestamp - startTime;
            const newProgress = Math.min((elapsedMs / (animationDuration * 1000)) * 100, 100);
            
            setProgress(newProgress);
            setElapsedTime((newProgress / 100) * durationInSeconds);
            
            if (newProgress < 100) {
                animationFrameId = requestAnimationFrame(animate);
            } else {
                setIsPlaying(false);
            }
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [isPlaying, animationDuration, durationInSeconds]);
    
    const waveformBars = React.useMemo(
      () => Array.from({ length: 28 }, () => Math.floor(Math.random() * 20) + 4),
      []
    );
    
    const formattedElapsedTime = `0:${String(Math.floor(elapsedTime)).padStart(2, '0')}`;

    return (
        <div className="flex items-center gap-2 bg-[#005c4b] rounded-2xl rounded-tr-none p-2 w-[240px]">
            <div className={`w-10 h-10 rounded-full bg-pink-400 flex-shrink-0 relative transition-all duration-300 ${isPlaying ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#005c4b]' : ''}`}>
                <img src="https://i.pravatar.cc/40?img=32" alt="User avatar" className="rounded-full w-full h-full object-cover"/>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#005c4b] rounded-full border-2 border-[#005c4b] flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-3 h-3 text-cyan-400">
                        <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z" />
                    </svg>
                </div>
            </div>

            <button onClick={() => setIsPlaying(p => !p)} className="text-white w-8 h-8 flex-shrink-0 transition-transform active:scale-90">
                {isPlaying ? <PauseIcon /> : <PlayIcon />}
            </button>
            
            <div className="flex-1 flex flex-col justify-center gap-1 h-full">
                <div className="flex items-center h-6 w-full relative">
                    {waveformBars.map((h, i) => (
                         <div key={i} className={`w-[2px] rounded-full mx-px transition-colors duration-150 ${ (progress / 100) * waveformBars.length > i ? 'bg-white' : 'bg-cyan-200/50'}`} style={{ height: `${h}px`}} />
                    ))}
                    <div className="absolute w-full h-0.5 bg-transparent top-1/2 -translate-y-1/2" />
                    <motion.div 
                        className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-sm"
                        initial={{ left: '0%' }}
                        animate={{ left: `calc(${progress}% - 6px)` }}
                        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    />
                </div>
                
                <div className="flex justify-between items-center text-xs text-neutral-300 -mt-1 pr-1">
                    <span>{isPlaying ? formattedElapsedTime : duration}</span>
                    <div className="flex items-center gap-1 text-green-300">
                       <span>{timestamp}</span>
                       <DoubleTick className="inline-block w-4 h-4 text-cyan-400" />
                    </div>
                </div>
            </div>
        </div>
    );
};


// ==================================================================
// == DIÁLOGOS DOS MOTORES ==
// ==================================================================
const motorDialogues = [
  // MOTOR 1: PLANEJAMENTO
  [
    [
      { id: "1-1-1", sender: "user", text: "Reunião com investidor em 2h. Me prepara.", timestamp: "12:00" },
      { id: "1-1-2", sender: "ai", text: `🎯 Briefing de fechamento\n\n3 Perguntas que comandam:\n\n- "O que faz você investir?"\n- "Último 'não' que deu e por quê?"\n- "O que quer ver em 90 dias?"\n\nObjeções + Defesas:\n"Saturado" → "90% modelo antigo, pegamos 30% insatisfeitos"\n"Pouca tração" → "+47% em 60 dias, margem 37%"\n"Valuation alto" → "Similares 8-12x, pedimos 6x"\n\nDeixa ele falar 60%. Quem pergunta, comanda.\n\nVocê quer simular a reunião comigo agora?`, timestamp: "12:01" },
    ],
    [
      { id: "1-2-1", sender: "user", text: "Preciso marcar reunião com o marketing semana que vem.", timestamp: "11:05" },
      { id: "1-2-2", sender: "ai", text: `📅 Melhores horários (11-15 Nov):\n\nTerça 14h ✅ (RECOMENDADO)\nQuarta 10h ✅\nQuinta 15h ✅\n\nMe passa: nome, online/presencial, duração?\n\nJá bloqueio e crio lembretes.`, timestamp: "11:06" },
    ],
    [
      { id: "1-3-1", sender: "user", type: 'audio', duration: '0:07', timestamp: "09:00" },
      { id: "1-3-2", sender: "ai", text: `📋 Planejamento semanal inteligente\n\nIdentifiquei suas prioridades baseado no impacto:\n\nURGENTE + IMPORTANTE (fazer primeiro):\n- Fechar proposta cliente R$15k (vence sexta)\n- Renegociar fornecedor (economia R$3.700/mês)\n- Aprovar campanha de Black Friday\n\nIMPORTANTE (agendar essa semana):\n- Reunião time vendas (meta mês)\n- Revisar fluxo de caixa dezembro\n- Contratar designer freelancer\n\nDELEGAR:\n- Aprovação de posts redes sociais → Marketing\n- Responder emails operacionais → Assistente\n- Relatório financeiro → Contador\n\nBloqueio terça e quinta 9h-12h pra você focar no importante?`, timestamp: "09:01" },
    ],
    [
      { id: "1-4-1", sender: "user", text: "O que eu tenho pra hoje?", timestamp: "08:30" },
      { id: "1-4-2", sender: "ai", text: `📋 Terça, 05/11 - Dia de Receita\n\n09h00 — Reunião marketing (ajustar CAC que subiu 18%)\n13h30 — Fornecedor (reduzir 8% ou trocar)\n16h00 — Apresentação cliente (proposta R$5k)\n18h30 — Treino (bloqueado)\n\nTarefas críticas (antes 12h):\n✅ Ativar retargeting\n✅ Ensaiar 3 objeções reunião 16h\n\nExpectativa: 2 decisões + 1 negociação fechada.\n\nMe atualiza sobre os resultados de cada reunião.`, timestamp: "08:31" },
    ],
    [
      { id: "1-5-1", sender: "user", text: "Me lembra de pagar o boleto dia 18.", timestamp: "15:20" },
      { id: "1-5-2", sender: "ai", text: `✅ R$8.900 - Fornecedor - 18/11\n\nAlertas:\n⏰ 16/11 às 10h (2 dias antes)\n⏰ 18/11 às 09h + 16h (dia D)\n\n⚠️ Dia 18 = R$24.500 em pagamentos\nSaldo após: R$17.880 (zona crítica)\n\nPreparo o roteiro de antecipação?`, timestamp: "15:21" },
    ],
    [
      { id: "1-6-1", sender: "user", type: 'audio', duration: '0:06', timestamp: "14:10" },
      { id: "1-6-2", sender: "ai", text: `✈️ Checklist pré-viagem - 7 dias\n\nURGENTE (antes da viagem):\n- Adiantar folha de pagamento (sai dia 20, você volta dia 22)\n- Aprovar campanha que roda enquanto estiver fora\n- Delegar 3 decisões pro gerente\n\nDURANTE A VIAGEM:\n- 2 reuniões online mantidas (seg 10h, qua 14h)\n- Alertas diários de métricas críticas\n- Aprovações via WhatsApp (já configurado)\n\nMATERIAL DA REUNIÃO:\n- Proposta impressa + backup digital\n- Dados de mercado atualizados\n- 3 referências verificadas\n\nJá bloqueio sexta inteira pra você preparar tudo?`, timestamp: "14:11" },
    ],
    [
      { id: "1-7-1", sender: "user", text: "Preciso preparar apresentação pra conselho até sexta.", timestamp: "10:45" },
      { id: "1-7-2", sender: "ai", text: `📊 Roteiro de apresentação\n\nESTRUTURA (15 slides máximo):\n\nSlides 1-3: Resultados do trimestre\n- Receita, margem, crescimento\n- 2 gráficos de impacto\n\nSlides 4-6: Desafios enfrentados\n- O que não funcionou + aprendizados\n- Ações corretivas tomadas\n\nSlides 7-10: Plano próximo trimestre\n- 3 metas principais + como atingir\n- Budget necessário\n\nSlides 11-12: Riscos e mitigações\nSlides 13-15: Pedidos/Decisões\n\nTempo: 25min apresentação + 20min perguntas\n\nBloqueio quinta 14h-17h pra você montar?\nPreparo os dados e gráficos antes?`, timestamp: "10:46" },
    ],
    [
      { id: "1-8-1", sender: "user", text: "Tenho 3 propostas de parceria. Qual aceitar?", timestamp: "16:00" },
      { id: "1-8-2", sender: "ai", text: `🤝 Análise comparativa\n\nPARCERIA A - Distribuidor Regional\n- Potencial: R$80k/mês\n- Exclusividade: 12 meses\n- Margem: 32% (vs. 45% seu canal)\n- Risco: Médio (depender 1 canal)\n\nPARCERIA B - Marketplace\n- Potencial: R$45k/mês\n- Sem exclusividade\n- Margem: 28% (comissão alta)\n- Risco: Baixo (diversificação)\n\nPARCERIA C - Afiliados\n- Potencial: R$120k/mês\n- Comissão 20%\n- Margem: 37%\n- Risco: Alto (gestão complexa)\n\nRECOMENDAÇÃO:\nComeçar com B (menor risco)\nTestar 90 dias\nSe validar → adicionar A ou C\n\nAgenda reunião com B essa semana?`, timestamp: "16:01" },
    ],
    [
      { id: "1-9-1", sender: "user", type: 'audio', duration: '0:09', timestamp: "18:00" },
      { id: "1-9-2", sender: "ai", text: `🎯 Planejamento anual - Dobrar faturamento\n\nSituação atual: R$127k/mês = R$1,52M/ano\nMeta 2026: R$3,04M/ano (+100%)\n\nÉ REALISTA? Sim, mas precisa de 4 pilares:\n\nPILAR 1: Produto (Q1)\n- Lançar 2 novos produtos\n- Criar upsell nos existentes\n- Impacto: +R$580k/ano\n\nPILAR 2: Canais (Q2)\n- Escalar tráfego em 3x\n- Ativar 2 novos canais\n- Impacto: +R$720k/ano\n\nPILAR 3: Time (Q3)\n- Contratar 3 vendedores\n- 1 gestor de marketing\n- Impacto: +R$540k/ano\n\nPILAR 4: Eficiência (Q4)\n- Aumentar ticket em 25%\n- Elevar conversão pra 6%\n- Impacto: +R$380k/ano\n\nTotal: +R$2,22M (146% da meta)\n\nProbabilidade de sucesso: 76% se executar no prazo\n\nMonte o roadmap trimestre a trimestre?`, timestamp: "18:01" },
    ],
    [
      { id: "1-10-1", sender: "user", text: "Preciso decidir entre 2 fornecedores. Como escolher?", timestamp: "13:30" },
      { id: "1-10-2", sender: "ai", text: `⚖️ Análise de fornecedores\n\nFORNECEDOR 1 - Atual\n- Preço: R$18.500/mês\n- Prazo: 30 dias\n- Qualidade: 8/10\n- Confiança: alta (3 anos)\n- Flexibilidade: média\n\nFORNECEDOR 2 - Novo\n- Preço: R$15.800/mês (-15%)\n- Prazo: 15 dias\n- Qualidade: ? (sem histórico)\n- Confiança: baixa (novo)\n- Flexibilidade: alta (promete)\n\nECONOMIA: R$2.700/mês = R$32.400/ano\n\nRISCO: Qualidade inferior/atraso = perda de R$40k+ em vendas\n\nRECOMENDAÇÃO:\n- Teste piloto: 1 pedido pequeno\n- Valida qualidade e prazo\n- Se OK → migra 50% (não 100%)\n- Mantém atual como backup\n\nCusto do teste: R$3.200\nGanho potencial: R$32.400/ano\n\nNegoceio teste com fornecedor 2?`, timestamp: "13:31" },
    ],
  ],
  // MOTOR 2: AÇÃO
  [
    [
      { id: "2-1-1", sender: "user", text: "Preciso vender mais essa semana. O que fazer?", timestamp: "09:15" },
      { id: "2-1-2", sender: "ai", text: `⚡ Ação imediata\n\nFLASH SALE 72H:\nBest-seller com 20% off\nEstoque: 50 unidades\n\nExecução:\nStories 3x/dia (começa agora)\nEmail base (hoje 18h)\n\nProjeção: 42 vendas | R$16.800\n\nTotal 48-72h: R$52.900\n\nVocê quer o plano de execução dessa estratégia?`, timestamp: "09:16" },
    ],
    [
      { id: "2-2-1", sender: "user", text: "Quero investir mais em tráfego. Quanto?", timestamp: "10:30" },
      { id: "2-2-2", sender: "ai", text: `💰 Análise de capacidade\n\nAtual: R$8.900 | ROAS 6,2x\n\nFASE 1 (Essa semana):\n+30% = R$11.570\nRetorno: +R$16.554/mês\nRisco: Baixo ✅\n\nFASE 2 (15 dias depois):\nSe ROAS > 5,5x → +50%\nRetorno: +R$27.590/mês\n\nComece com +R$2.670 agora`, timestamp: "10:31" },
    ],
    [
      { id: "2-3-1", sender: "user", type: 'audio', duration: '0:09', timestamp: "11:00" },
      { id: "2-3-2", sender: "ai", text: `🚨 Diagnóstico + correção urgente\n\nAnalisando sua campanha...\n\nPROBLEMA IDENTIFICADO:\n- CTR: 0,7% (mínimo: 2%)\n- CPC: R$8,40 (teto: R$3,50)\n- Conversão: 0,9% (mínimo: 2,5%)\n\nVocê tá perdendo R$180/dia\n\nAÇÃO IMEDIATA (próximas 4h):\n\n1. PAUSAR AGORA:\n❌ Criativo estático atual\n❌ Público amplo frio\n\n2. ATIVAR JÁ:\n✅ Vídeo 15s (tenho 3 opções prontas)\n✅ Retargeting últimos 14 dias\n✅ Lookalike 1% compradores\n\n3. NOVA OFERTA:\n❌ "Conheça nosso produto"\n✅ "20% off acaba em 48h"\n\nProjeção pós-correção:\n- CTR: 3,2%\n- CPC: R$2,80\n- Conversão: 3,8%\n\nEconomia: R$126/dia = R$3.780/mês\n\nPauso campanha e implemento correções agora?`, timestamp: "11:01" },
    ],
    [
      { id: "2-4-1", sender: "user", text: "Quero lançar produto novo.", timestamp: "14:00" },
      { id: "2-4-2", sender: "ai", text: `🚀 Validação antes de produzir\n\nNUNCA produza antes de vender.\n\nSemana 1-2: Landing + R$300 ads\nMeta: 50+ leads (8% conversão)\nSe falhar → pivotar ângulo\n\nSemana 3-4: Pré-venda early bird\nMeta: 20 vendas = R$8k\nFinancia a produção\n\nSemana 5: Produzir com risco zero\n\nSemana 6: Lançamento 72h\nProjeção: 150 vendas = R$60k\n\nTotal: R$68k | ROI: 24x\n\nCrie a landingpage teste agora.`, timestamp: "14:01" },
    ],
    [
      { id: "2-5-1", sender: "user", text: "Preciso contratar um novo colaborador como faço?", timestamp: "16:22" },
      { id: "2-5-2", sender: "ai", text: `👥 Teste antes de contratar CLT\n\nPergunta: Quanto vão gerar de receita?\n\nVENDEDOR:\nExpectativa: R$45k/mês\nCusto: R$4.200/mês\nROI: 10,7x → ✅ Contrate\n\nSUPORTE:\nLibera 15h suas → você vende +R$28k\nROI: 3,3x → ✅ Depois do vendedor\n\nRecomendação:\nContratar PJ 90 dias (teste sem rescisão)\nPerformance OK → CLT\n\nCusto de errar: R$25k\n\nCrio anúncio da vaga?`, timestamp: "16:23" },
    ],
    [
      { id: "2-6-1", sender: "user", type: 'audio', duration: '0:11', timestamp: "13:00" },
      { id: "2-6-2", sender: "ai", text: `💰 Campanha de recuperação - 48h\n\nANÁLISE DOS 50 LEADS:\n- 18 pediram proposta há 7-15 dias (quentes)\n- 22 pediram há 16-30 dias (mornos)\n- 10 pediram há 30+ dias (frios)\n\nPotencial total: R$87.500 em contratos\n\nESTRATÉGIA POR GRUPO:\n\nGRUPO 1 (18 quentes):\nWhatsApp personalizado HOJE:\n"[Nome], notei que não finalizou. Sobrou alguma dúvida? Liberei 20% off válido 48h."\nProjeção: 7 fechamentos = R$35.000\n\nGRUPO 2 (22 mornos):\nEmail + ligação AMANHÃ:\n"Situação mudou? Temos case novo que pode interessar."\nProjeção: 5 fechamentos = R$25.000\n\nGRUPO 3 (10 frios):\nNurturing 30 dias (não forçar)\n\nTotal recuperável em 7 dias: R$60.000\n\nTimeline:\nHoje 14h: WhatsApp grupo 1\nAmanhã 10h: Email + calls grupo 2\n\nDisparo agora ou quer ajustar as mensagens?`, timestamp: "13:01" },
    ],
    [
      { id: "2-7-1", sender: "user", text: "Meu site tá lento e perdendo venda. O que fazer?", timestamp: "15:45" },
      { id: "2-7-2", sender: "ai", text: `⚡ Correção de performance - Urgente\n\nDIAGNÓSTICO:\n- Tempo de carregamento: 8,2s (limite: 3s)\n- Taxa de abandono: 67%\n- Perda estimada: R$18.400/mês\n\nAÇÃO IMEDIATA:\n\nHoje:\n✅ Comprimir 12 imagens pesadas\n✅ Remover 3 scripts desnecessários\n✅ Ativar cache\n\nResultado: 8,2s → 2,8s\n\nAmanhã:\n✅ Contratar CDN (R$89/mês)\n✅ Otimizar código checkout\n\nImpacto final:\n- Carregamento: 1,9s\n- Abandono: 67% → 23%\n- Recuperação: +R$13.200/mês\n\nImplemento correções agora?\nDesenvolvedor disponível em 2h.`, timestamp: "15:46" },
    ],
    [
      { id: "2-8-1", sender: "user", text: "Quero criar programa de indicação. Vale a pena?", timestamp: "11:50" },
      { id: "2-8-2", sender: "ai", text: `🎁 Setup de programa de afiliados\n\nMODELO RECOMENDADO:\n\nComissão: 20% por venda\nDuração: 90 dias (recorrente)\nTicket médio: R$400\nComissão: R$80/venda\n\nPROJEÇÃO:\n\nMês 1: 15 afiliados → 23 vendas\nReceita: R$9.200 | Custo: R$1.840\n\nMês 3: 40 afiliados → 87 vendas\nReceita: R$34.800 | Custo: R$6.960\n\nMês 6: 95 afiliados → 203 vendas\nReceita: R$81.200 | Custo: R$16.240\n\nSetup necessário:\n- Plataforma afiliados: R$197/mês\n- Material de divulgação\n- Treinamento afiliados\n\nROI Mês 6: 4,2x\n\nCrio estrutura e convido primeiros 20 afiliados?`, timestamp: "11:51" },
    ],
    [
      { id: "2-9-1", sender: "user", type: 'audio', duration: '0:10', timestamp: "17:30" },
      { id: "2-9-2", sender: "ai", text: `🏢 Estratégia de entrada B2B - 90 dias\n\nDIFERENÇAS CRÍTICAS:\nB2C: ticket R$400, decisão 2 dias\nB2B: ticket R$8.500, decisão 30-60 dias\n\nFASE 1: VALIDAÇÃO (Dia 1-30)\n\nAção:\n- Mapear 50 empresas target\n- LinkedIn outreach (20 conexões/semana)\n- Oferecer diagnóstico gratuito\nMeta: 10 reuniões agendadas\n\nFASE 2: PROTOTIPAÇÃO (Dia 31-60)\n\nAção:\n- Criar proposta B2B específica\n- Piloto gratuito com 2 empresas\n- Gerar case de sucesso\nMeta: 2 contratos fechados\n\nFASE 3: ESCALA (Dia 61-90)\n\nAção:\n- Contratar SDR dedicado B2B\n- Ativar LinkedIn Ads\n- Criar funil automatizado\nMeta: 8 contratos/mês\n\nInvestimento total: R$18.900\nReceita projetada M3: R$68.000/mês\n\nRisco: Médio (novo mercado)\nTempo até lucro: 4 meses\n\nComeço mapeamento das 50 empresas hoje?`, timestamp: "17:31" },
    ],
    [
      { id: "2-10-1", sender: "user", text: "Meu concorrente baixou preço 40%. O que faço?", timestamp: "19:00" },
      { id: "2-10-2", sender: "ai", text: `🎯 Estratégia anti-guerra de preços\n\nNÃO BAIXE SEU PREÇO.\n\nEle baixou porque:\n- Desespero por caixa (fraco)\n- Volume rápido (insustentável)\n- Não consegue vender valor (amador)\n\nSUA RESPOSTA (escolha 1):\n\nOPÇÃO A: Subir valor percebido\n- Adicionar bônus R$300\n- Garantia estendida 90 → 180 dias\n- Suporte prioritário incluso\nResultado: Justifica preço 2x maior\n\nOPÇÃO B: Criar tier superior\n- Versão premium +40% preço\n- Para quem quer o melhor, não o barato\nResultado: Novos clientes high-ticket\n\nOPÇÃO C: Capturar insatisfeitos dele\n- Campanha "Migração inteligente"\n- Diagnóstico grátis quem comprou com concorrente\n- Demonstrar diferencial em 30 dias\nResultado: Roubar base dele\n\nRECOMENDAÇÃO: Opção A + C\nCusto: R$2.400\nImpacto: +R$34.200 em 60 dias\n\nImplemento qual estratégia?`, timestamp: "19:01" },
    ],
  ],
  // MOTOR 3: CONTROLE
  [
    [
      { id: "3-1-1", sender: "user", text: "Quanto tenho pra investir?", timestamp: "09:00" },
      { id: "3-1-2", sender: "ai", text: `💰 Fluxo de caixa crítico\n\nSaldo: R$42.380\nA pagar (30d): R$28.900\nA receber: R$34.200\n\nCapacidade: R$8.500-R$15.200\n\n⚠️ ALERTA: Dias 18-22\nFolha + Fornecedor + Aluguel = R$24.500\nSaldo pós: R$17.880 (ZONA CRÍTICA)\n\nAção urgente:\nAntecipar R$9.800 de 2 clientes OU\nNegociar 7 dias prazo fornecedor\n\nPreparo roteiro de antecipação?`, timestamp: "09:01" },
    ],
    [
      { id: "3-2-1", sender: "user", text: "Gastei R$1.200 nos coffee break de hoje.", timestamp: "17:00" },
      { id: "3-2-2", sender: "ai", text: `💰 Registrado + Análise\n\n📊 R$1.200 | Administrativa | 05/11\n\nROI válido se:\n✅ 3+ ações definidas\n✅ Follow-up < 7 dias\n✅ Impacto em receita\n\nStatus: Admin R$5.800 (29% acima)\n\nPróximas reuniões:\nCoffee interno = R$150 vs R$1.200\nEconomia anual: R$12.600\n\nAceita a mudança?`, timestamp: "17:01" },
    ],
    [
      { id: "3-3-1", sender: "user", type: 'audio', duration: '0:06', timestamp: "10:15" },
      { id: "3-3-2", sender: "ai", text: `📊 Análise de ROI - Evento\n\nInvestimento registrado:\nR$3.500 | Categoria: Marketing/Eventos\n\nPara valer a pena, você precisa:\n\nCENÁRIO MÍNIMO (break-even):\n2 clientes fechados × R$1.750 = R$3.500\nROI: 1x (empata)\n\nCENÁRIO ACEITÁVEL:\n4 clientes × R$1.750 = R$7.000\nROI: 2x (ok)\n\nCENÁRIO BOM:\n7+ clientes × R$1.750 = R$12.250\nROI: 3,5x (excelente)\n\nAÇÃO NAS PRÓXIMAS 48H:\n✅ WhatsApp para os 23 contatos feitos\n✅ Email com proposta personalizada\n✅ Agendar follow-up call\n\nSe não fizer follow-up em 48h:\nTaxa de conversão: 3% (desperdiçou R$3.400)\n\nSe fizer follow-up em 24h:\nTaxa de conversão: 28% (gera R$11.200)\n\nTimeline crítica: Hoje até 18h\nPreparo mensagens de follow-up agora?`, timestamp: "10:16" },
    ],
    [
      { id: "3-4-1", sender: "user", text: "Como está o negócio?", timestamp: "10:00" },
      { id: "3-4-2", sender: "ai", text: `📊 Status: 🟡 Saudável com vazamentos\n\nReceita: R$127.800 (+18%) ✅\nLucro: R$47.600 (37%) ✅\nTicket: R$340 (-5%) ⚠️\n\nAlertas críticos:\n⚠️ Ticket caindo (falta upsell) = -R$6.390/mês\n⚠️ Conversão 3,8% (meta 5%) = -R$38.340/mês\n⚠️ Caixa 38 dias (ideal 60+) = vulnerável\n\nVocê deixa R$44.730/mês na mesa.\n\n3 correções = +R$67k/mês.\nQuer o plano?`, timestamp: "10:01" },
    ],
    [
      { id: "3-5-1", sender: "user", text: "Quanto vendi em setembro?", timestamp: "11:30" },
      { id: "3-5-2", sender: "ai", text: `📊 R$127.800 | Lucro R$47.600\n\nProduto A: R$54.000 (42%)\n⭐ Margem 45% | +12% → ESCALAR\nCriar upsell R$200 → +R$18.900/mês\n\nProduto B: R$36.000 (28%)\n⚠️ Ticket -12% → REPOSICIONAR\nBundle ou novo ângulo\n\nProduto C: R$21.000 (16%)\n💎 Margem 58% → ISCA\nCAC R$34 | Volume baixo\n\n3 produtos = 86% receita.\nFocar = +34% sem novos produtos.\n\nOtimizo qual primeiro?`, timestamp: "11:31" },
    ],
    [
      { id: "3-6-1", sender: "user", type: 'audio', duration: '0:08', timestamp: "14:20" },
      { id: "3-6-2", sender: "ai", text: `💰 Análise de viabilidade - Retirada\n\nSituação do caixa:\n\nHoje: R$42.380\nApós retirada: R$27.380\n\nCompromissos próximos 30 dias:\n- Folha: R$12.400 (dia 20)\n- Fornecedores: R$11.700\n- Fixos: R$6.200\nTotal: R$30.300\n\nSaldo final: -R$2.920 (NEGATIVO) ❌\n\nRESPOSTA: NÃO DÁ.\n\nALTERNATIVAS:\n\nOpção 1: Retirar R$8.000 (ok)\nSaldo final: R$4.080 (apertado mas viável)\n\nOpção 2: Retirar R$15k MAS:\nAntecipar R$9.800 de clientes antes\nNegociar 15 dias prazo fornecedor\n\nOpção 3: Esperar 10 dias\nEntrada de R$18.200 dia 15\nAí sim pode tirar R$15k com folga\n\nRECOMENDAÇÃO: Opção 3\nPaciência de 10 dias evita crise de caixa\n\nExplico isso pro seu sócio em dados?`, timestamp: "14:21" },
    ],
    [
      { id: "3-7-1", sender: "user", text: "Gastei R$850 em Uber esse mês. Tá normal?", timestamp: "18:15" },
      { id: "3-7-2", sender: "ai", text: `🚗 Análise de despesa - Transporte\n\n📊 R$850 | Transporte | Novembro\n\nComparativo:\n- Média últimos 3 meses: R$420\n- Este mês: R$850 (+102%) ⚠️\n\nBreakdown:\n- Reuniões clientes: R$380 (ok)\n- Deslocamento escritório: R$290 (alto)\n- Pessoal: R$180 (misturado)\n\nRECOMENDAÇÃO:\n\nCurto prazo:\nSeparar Uber pessoal vs. empresa\nEconomia: R$180/mês = R$2.160/ano\n\nMédio prazo:\nAvaliar carro executivo (R$2.800/mês)\nBreak-even: 15 Ubers/mês\nVocê faz 28 Ubers/mês\n\nAnálise: Carro compensa após 4 meses\n\nQuer simulação completa de TCO?`, timestamp: "18:16" },
    ],
    [
      { id: "3-8-1", sender: "user", text: "Onde tô perdendo dinheiro?", timestamp: "20:00" },
      { id: "3-8-2", sender: "ai", text: `🔍 Canais deficitários\n\nSANGRIA ATIVA:\n❌ Facebook público frio: R$4.100 → R$4.920 (ROI 1,2x)\n❌ Portal anúncios: R$1.800 → R$0\nPerda mensal: R$5.900\n\nOPORTUNIDADE:\n✅ Instagram: 7,6x (escalar +30%)\n✅ Email: 98x (criar 2 sequências)\n\nRealocação:\nCorta R$5.900 → Instagram/Email\nGanho: +R$44.840/mês\n\nPause Facebook/Portal agora.`, timestamp: "20:01" },
    ],
    [
      { id: "3-9-1", sender: "user", type: 'audio', duration: '0:12', timestamp: "21:30" },
      { id: "3-9-2", sender: "ai", text: `📊 Raio-X financeiro - Últimos 90 dias\n\nENTRADA: R$383.400 (3 meses)\n\nPRA ONDE FOI:\n\n💰 CUSTO DIRETO (42%): R$161.028\n- Matéria-prima: R$87.300\n- Fornecedores: R$51.900\n- Frete/Logística: R$21.828\n\n👥 PESSOAS (18%): R$69.012\n- Folha: R$52.200\n- Pró-labore sócios: R$16.812\n\n📢 MARKETING (11%): R$42.174\n- Ads: R$31.500\n- Ferramentas: R$6.450\n- Conteúdo/Design: R$4.224\n\n🏢 FIXOS (8%): R$30.672\n- Aluguel: R$14.400\n- Luz/Internet/Telefone: R$8.280\n- Contador/Jurídico: R$7.992\n\n🔧 OPERACIONAL (5%): R$19.170\n- Sistemas/Software: R$9.480\n- Manutenção: R$5.694\n- Outros: R$3.996\n\n💳 ADMINISTRATIVO (6%): R$23.004\n- Reuniões/Eventos: R$8.940\n- Transporte: R$7.020\n- Diversos: R$7.044\n\nTOTAL SAÍDA: R$345.060 (90%)\n\nSOBROU: R$38.340 (10% de margem líquida)\n\n⚠️ VAZAMENTOS IDENTIFICADOS:\n\n1. Matéria-prima: 22,7% (ideal: 18%)\nAção: Renegociar → Economia R$18k/ano\n2. Marketing disperso: R$4.224 sem ROI claro\nAção: Cortar → Realocar pra ads\n3. Administrativo alto: 6% (ideal: 3%)\nAção: Reuniões internas → -R$9k/ano\n\n3 correções = +R$42.600/ano (11% margem)\n\nQuer que eu prepare o plano de cortes?`, timestamp: "21:31" },
    ],
    [
      { id: "3-10-1", sender: "user", text: "Preciso de um relatório financeiro pra apresentar pro banco.", timestamp: "12:00" },
      { id: "3-10-2", sender: "ai", text: `📄 Relatório executivo - 12 meses\n\nPREPARANDO DOCUMENTO:\n\nSEÇÃO 1: Desempenho Financeiro\n- Faturamento mensal (gráfico evolução)\n- Margem líquida trimestral\n- EBITDA últimos 12 meses\n- Projeção próximos 6 meses\n\nSEÇÃO 2: Estrutura de Custos\n- Breakdown por categoria\n- Comparativo com benchmark setor\n- Eficiência operacional (índices)\n\nSEÇÃO 3: Fluxo de Caixa\n- DRE simplificado\n- Balanço patrimonial\n- Análise de liquidez\n- Prazo médio recebimento/pagamento\n\nSEÇÃO 4: Crescimento\n- Taxa crescimento MoM/YoY\n- Aquisição de clientes\n- Ticket médio evolução\n- Projeção 2026\n\nSEÇÃO 5: Garantias\n- Ativos disponíveis\n- Recebíveis\n- Estoque\n\nFormato: PDF profissional (18 páginas)\nPrazo: 48h úteis\n\nPrecisa para quando?\nPreparo com dados do contador também?`, timestamp: "12:01" },
    ],
  ],
];

const TypingIndicator = () => (
    <motion.div
        key="typing-indicator"
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="self-start"
    >
        <div className="rounded-2xl rounded-tl-none bg-[#202c33] px-4 py-3 shadow-sm">
            <div className="flex items-center justify-center gap-1.5 h-3">
                <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                    animate={{
                        y: [0, -3, 0],
                        transition: { duration: 0.8, repeat: Infinity, ease: "easeInOut" },
                    }}
                />
                <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                    animate={{
                        y: [0, -3, 0],
                        transition: {
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.1,
                        },
                    }}
                />
                <motion.div
                    className="h-1.5 w-1.5 rounded-full bg-neutral-400"
                    animate={{
                        y: [0, -3, 0],
                        transition: {
                            duration: 0.8,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: 0.2,
                        },
                    }}
                />
            </div>
        </div>
    </motion.div>
);


export default function FloatingChat({
  activeIndex,
  onInitialAnimationComplete,
}: {
  activeIndex: number;
  onInitialAnimationComplete?: () => void;
}) {
  const [messages, setMessages] = useState<any[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [highlightedKey, setHighlightedKey] = useState("");
  const [currentTime, setCurrentTime] = useState("9:41");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inViewRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  
  const isTransitioningOut = useRef(false);
  const pendingAnimationRef = useRef<(() => void) | null>(null);
  const hasAnimatedIn = useRef(false);

  const handleAnimationComplete = () => {
    if (!hasAnimatedIn.current) {
      hasAnimatedIn.current = true;
      onInitialAnimationComplete?.();
    }
  };
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    if (inViewRef.current) {
      observer.observe(inViewRef.current);
    }

    return () => observer.disconnect();
  }, []);


  useEffect(() => {
    if (!isInView) return;

    let isCancelled = false;
    // FIX: Replaced NodeJS.Timeout with ReturnType<typeof setTimeout> to use browser-compatible types and resolve TypeScript errors.
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    const cleanup = () => {
        isCancelled = true;
        timeouts.forEach(clearTimeout);
        intervals.forEach(clearInterval);
    };

    const wait = (ms: number) => new Promise(resolve => {
        if (isCancelled) return;
        timeouts.push(setTimeout(resolve, ms));
    });

    const typeAndSend = (msg: any): Promise<void> => {
        return new Promise(resolve => {
            let i = 0;
            const textToType = typeof msg.text === 'string' ? msg.text : "Certo. Preparando a resposta...";
            const typingInterval = setInterval(() => {
                if (isCancelled) {
                    clearInterval(typingInterval);
                    return;
                }
                const char = textToType.charAt(i);
                setHighlightedKey(char.toLowerCase());
                setInputMessage(textToType.substring(0, i + 1));
                i++;
                if (i > textToType.length) {
                    clearInterval(typingInterval);
                    setHighlightedKey("");
                    timeouts.push(setTimeout(() => {
                        if (isCancelled) return;
                        setInputMessage("");
                        setMessages(prev => [...prev, msg]);
                        resolve();
                    }, 500));
                }
            }, 50);
            intervals.push(typingInterval);
        });
    };
    
    const recordAndSendAudio = (msg: any): Promise<void> => {
      return new Promise(resolve => {
          setIsRecording(true);
          setRecordingProgress(0);
          const durationInSeconds = parseInt(msg.duration.split(':')[1], 10);
          setRecordingDuration(durationInSeconds);

          const animationDurationMs = Math.min(durationInSeconds * 1000, 3000); // Cap at 3 seconds

          const startTime = Date.now();
          const recordingInterval = setInterval(() => {
              if (isCancelled) {
                  clearInterval(recordingInterval);
                  return;
              }
              const elapsed = Date.now() - startTime;
              const progress = Math.min((elapsed / animationDurationMs) * 100, 100);
              setRecordingProgress(progress);

              if (progress >= 100) {
                  clearInterval(recordingInterval);
                  timeouts.push(setTimeout(() => {
                      if (isCancelled) return;
                      setIsRecording(false);
                      setRecordingProgress(0);
                      setMessages(prev => [...prev, msg]);
                      resolve();
                  }, 300));
              }
          }, 50); // Update every 50ms for smooth progress
          intervals.push(recordingInterval);
      });
    };
    
    const processUserMessage = async (msg: any) => {
      if (msg.type === 'audio') {
        await recordAndSendAudio(msg);
      } else {
        await typeAndSend(msg);
      }
    };
    
    const runMotorAnimationLoop = async () => {
        const dialoguesForMotor = motorDialogues[activeIndex];
        
        if (dialoguesForMotor.length > 0 && dialoguesForMotor[0].length > 0) {
            setCurrentTime(dialoguesForMotor[0][0].timestamp);
        }

        for (const dialogue of dialoguesForMotor) {
            if (isCancelled) return;

            for (const msg of dialogue) {
                if (isCancelled) return;
                
                if (currentTime !== msg.timestamp) {
                   setCurrentTime(msg.timestamp);
                }
                
                if (msg.sender === 'user') {
                    await processUserMessage(msg);
                } else {
                    await wait(1200);
                    if (isCancelled) return;
                    setIsTyping(true);
                    await wait(800);
                    if (isCancelled) return;
                    setIsTyping(false);
                    setMessages(prev => [...prev, msg]);
                }
                await wait(300);
                if (isCancelled) return;
            }
            await wait(1500); 
            if (isCancelled) return;
        }

        await wait(3000);
        if (isCancelled) return;
        
        pendingAnimationRef.current = startAnimation;
        isTransitioningOut.current = true;
        setMessages([]);
    };

    const startAnimation = () => {
        if (isCancelled) return;
        
        setIsTyping(false);
        setInputMessage("");
        setHighlightedKey("");
        setIsRecording(false);
        
        runMotorAnimationLoop();
    };

    if (isTransitioningOut.current) {
        pendingAnimationRef.current = startAnimation;
    } else {
        if (messages.length > 0) {
            pendingAnimationRef.current = startAnimation;
            isTransitioningOut.current = true;
            setMessages([]);
        } else {
            startAnimation();
        }
    }

    return cleanup;
}, [isInView, activeIndex]);


  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth'
        });
    }
  }, [messages, isTyping]);
  
  const onExitComplete = () => {
      isTransitioningOut.current = false;
      if (pendingAnimationRef.current) {
          pendingAnimationRef.current();
          pendingAnimationRef.current = null;
      }
  };


  return (
    <motion.div
      ref={inViewRef}
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      onAnimationComplete={handleAnimationComplete}
      className="relative w-[270px] h-[552px] rounded-[41px] border-y-[8px] border-x-[6px] border-t-neutral-800 border-l-neutral-900 border-r-neutral-900 border-b-black bg-black shadow-2xl shadow-black/50 overflow-hidden"
    >
      <DynamicIsland currentTime={currentTime} />

      {/* Screen Content */}
      <div
        className="relative w-full h-full text-white/90 text-sm bg-[#0b141a]"
        style={{ backgroundImage: `url("${wallpaperSvg}")` }}
      >
        
        {/* WhatsApp UI */}
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="px-2 pt-10 pb-2 bg-[#1f2c33] flex items-center gap-3 shrink-0 relative">
             <div className="absolute bottom-0 left-0 right-0 h-px bg-white/10" />
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white"><path d="M15 18l-6-6 6-6"/></svg>
            <div className="w-10 h-10 rounded-full bg-neutral-600 flex items-center justify-center">
                <img src="https://assets.codepen.io/3364143/assessor-logo.png" alt="Assessor Logo" className="w-6 h-6" />
            </div>
            <div>
              <p className="font-semibold text-base text-neutral-200">Socceo</p>
              <div className="text-xs text-green-400 relative h-4 w-16">
                 <AnimatePresence initial={false}>
                    <motion.p
                      key={isTyping ? "typing" : "online"}
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute inset-0"
                    >
                      {isTyping ? "digitando..." : "online"}
                    </motion.p>
                 </AnimatePresence>
              </div>
            </div>
            <div className="ml-auto flex items-center gap-5 pr-2">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24c1.12.37 2.33.57 3.57.57c.55 0 1 .45 1 1V20c0 .55-.45 1-1 1c-9.39 0-17-7.61-17-17c0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1c0 1.25.2 2.45.57 3.57c.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
            </div>
          </div>

          {/* Chat Log */}
          <div ref={chatContainerRef} className="flex-1 p-3 flex flex-col items-start gap-y-2 overflow-y-auto">
            <AnimatePresence onExitComplete={onExitComplete}>
                {messages.map((msg) => (
                     <motion.div
                        key={msg.id}
                        layout
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{
                            type: "spring",
                            damping: 20,
                            stiffness: 200,
                        }}
                        className={`w-full flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.type === 'audio' ? (
                        <AudioMessageBubble duration={msg.duration} timestamp={msg.timestamp} />
                      ) : (
                        <div className={`relative max-w-[80%] px-3 py-2 text-sm text-neutral-200 shadow-sm ${msg.sender === 'user' ? 'bg-[#005c4b] rounded-xl rounded-tr-none' : 'bg-[#202c33] rounded-xl rounded-tl-none'}`}>
                            <div className="leading-snug whitespace-pre-wrap">{msg.text}</div>
                            <div className={`text-right text-[11px] text-neutral-400 mt-1 -mb-1 ${msg.sender === 'user' ? 'text-green-300' : ''}`}>
                                <span className="float-left">{'\u00A0'.repeat(8)}</span>
                                <span className="relative z-10">
                                    {msg.timestamp}
                                    {msg.sender === 'user' && <DoubleTick className="inline-block w-4 h-4 ml-1 text-cyan-400" />}
                                </span>
                            </div>
                        </div>
                      )}
                    </motion.div>
                ))}
                {isTyping && <TypingIndicator />}
            </AnimatePresence>
          </div>
          
          {/* Input Area */}
          <div className="shrink-0 bg-[#0e0e0e] relative">
            <div className="relative h-[56px] overflow-hidden">
                <AnimatePresence mode="wait">
                {isRecording ? (
                    <motion.div
                        key="recorder"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-full"
                    >
                        <AudioRecordingBar progress={recordingProgress} duration={recordingDuration} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="input"
                        initial={{ opacity: 0, y: "100%" }}
                        animate={{ opacity: 1, y: "0%" }}
                        exit={{ opacity: 0, y: "100%" }}
                        transition={{ duration: 0.3, ease: "easeOut" }}
                        className="h-full"
                    >
                    {/* Refined Input Bar */}
                    <div className="p-2 flex items-center gap-2 bg-[#1f2c33] h-full">
                        <div className="flex-1 bg-[#2a3942] rounded-full h-10 flex items-center px-2">
                            <button className="shrink-0 text-xl text-neutral-400 p-2 transition-transform active:scale-90"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg></button>
                            <div className="flex-1 min-w-0 mx-2 relative h-full overflow-hidden">
                                {inputMessage ? (
                                    <div className="absolute inset-y-0 right-0 flex items-center">
                                        <span className="text-base text-white whitespace-nowrap">
                                            {inputMessage}
                                            <span className="inline-block w-px h-4 bg-green-400 animate-pulse align-middle ml-0.5" />
                                        </span>
                                    </div>
                                ) : (
                                    <div className="h-full flex items-center">
                                        <span className="text-neutral-500 text-base">Mensagem</span>
                                    </div>
                                )}
                            </div>
                            <div className="shrink-0 flex items-center">
                                <button className="text-neutral-400 py-2 px-1 transition-transform active:scale-90"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400 -rotate-45"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg></button>
                                <button className="text-neutral-400 py-2 px-1 transition-transform active:scale-90"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-neutral-400"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg></button>
                            </div>
                        </div>
                        <AnimatePresence mode="wait">
                            {inputMessage ? (
                                <motion.button 
                                    key="send"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center transition-transform active:scale-90"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white ml-0.5"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
                                </motion.button>
                            ) : (
                                <motion.button 
                                    key="mic"
                                    initial={{ scale: 0, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0, opacity: 0 }}
                                    transition={{ duration: 0.2, ease: "easeOut" }}
                                    className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center transition-transform active:scale-90"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.49 6-3.31 6-6.72h-1.7z"/></svg>
                                </motion.button>
                            )}
                        </AnimatePresence>
                    </div>
                    </motion.div>
                )}
                </AnimatePresence>
            </div>
            <Keyboard highlightedKey={highlightedKey} />
          </div>
        </div>
      </div>
    </motion.div>
  );
}
