import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

// Simple in-memory rate limiting (for demo/prototype purposes)
const rateLimitMap = new Map<string, { count: number, resetTime: number }>();

export async function POST(request: Request) {
  try {
    // 1. Basic Rate Limiting (max 10 req/min per IP)
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const now = Date.now();
    const rateLimit = rateLimitMap.get(ip);
    
    if (rateLimit) {
      if (now > rateLimit.resetTime) {
        // Reset if minute has passed
        rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
      } else if (rateLimit.count >= 10) {
        return NextResponse.json({ error: "Muitas requisições. Tente novamente em alguns instantes." }, { status: 429 });
      } else {
        rateLimit.count++;
      }
    } else {
      rateLimitMap.set(ip, { count: 1, resetTime: now + 60000 });
    }

    // 2. Parse request
    const body = await request.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ error: "Ação não especificada." }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
       return NextResponse.json({ error: "Integração Gemini não configurada corretamente." }, { status: 500 });
    }

    const ai = new GoogleGenAI({ apiKey });
    const MODEL = "gemini-2.0-flash";

    // 3. Handle Actions
    if (action === "dashboard-insights") {
      const { metricas } = body.input || body;
      if (!metricas) return NextResponse.json({ error: "Métricas são obrigatórias" }, { status: 400 });

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `Você é um especialista em Growth e CRO (Otimização de Conversão) de infoprodutos.
Analise as seguintes métricas de um vendedor na plataforma Cartfy e forneça 3 insights acionáveis e curtos para aumentar o faturamento.

Métricas atuais:
- Faturamento Total: R$ ${metricas.faturamento}
- Vendas Aprovadas: ${metricas.vendasAprovadas}
- Conversão (Aprovação): ${metricas.taxaAprovacao}%
- Ticket Médio: R$ ${metricas.ticketMedio}

Regras para os insights:
- Seja direto, prático e focado em gerar mais dinheiro.
- Se a conversão estiver baixa (abaixo de 70%), sugira melhorias no checkout ou recuperação de PIX/Boleto.
- Se o ticket médio estiver baixo, sugira Order Bump ou Upsell.
- Use um tom encorajador, mas profissional.

Retorne um JSON contendo {"insights": ["insight 1", "insight 2", "insight 3"]}.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              insights: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["insights"]
          }
        }
      });
      return NextResponse.json(JSON.parse(response.text || '{}'));
    }

    if (action === "generate-ad") {
      const { config } = body.input || body;
      if (!config) return NextResponse.json({ error: "Configuração do produto obrigatória" }, { status: 400 });

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `Atue como um Copywriter especialista em anúncios de alta conversão para Facebook/Instagram.
O produto é:
Título: ${config.title}
Descrição: ${config.description}
Preço: R$ ${config.price}

A copy deve ter:
1. Gancho forte
2. História/Problema
3. Apresentação da solução
4. Chamada para Ação (CTA) baseada em urgência.

Retorne SOMENTE um JSON no formato {"adCopy": "texto da copy com quebras de linha"}. Não inclua markdown fora do JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: { adCopy: { type: Type.STRING } },
            required: ["adCopy"]
          }
        }
      });
      return NextResponse.json(JSON.parse(response.text || '{}'));
    }

    if (action === "generate-product" || action === "generate-checkout-product") {
      const { prompt } = body.input || body;
      if (!prompt) return NextResponse.json({ error: "Prompt obrigatório" }, { status: 400 });

      const response = await ai.models.generateContent({
        model: MODEL,
        contents: `Crie um modelo de infoproduto focado em altíssima conversão para a plataforma Cartfy baseado na seguinte ideia: "${prompt}".

        Devolva um JSON estrito com esta tipagem:
        {
          "produto": {
            "nome": "string (Nome foda e chamativo)",
            "tipo": "string (ex: Curso Online, Mentoria)",
            "preco": "number (Preço ideal de mercado, que termine em 7. Ex: 97, 197, 297)",
            "descricao": "string (Até 250 caracteres, muito copy, focada em dor e transformação)",
            "imagem": "string (Retorne 'https://picsum.photos/seed/' + uma palavra em inglês simples que represente o tema + '/800/600')",
            "afiliados": boolean
          }
        }`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              produto: {
                type: Type.OBJECT,
                properties: {
                  nome: { type: Type.STRING },
                  tipo: { type: Type.STRING },
                  preco: { type: Type.NUMBER },
                  descricao: { type: Type.STRING },
                  imagem: { type: Type.STRING },
                  afiliados: { type: Type.BOOLEAN }
                },
                required: ["nome", "tipo", "preco", "descricao", "imagem", "afiliados"]
              }
            },
            required: ["produto"]
          }
        }
      });
      return NextResponse.json(JSON.parse(response.text || '{}'));
    }

    return NextResponse.json({ error: "Ação inválida ou não suportada." }, { status: 400 });
  } catch (error: any) {
    console.error("Gemini Route Error:", error);
    return NextResponse.json({ error: "Ocorreu um erro ao processar sua requisição com IA. Tente novamente." }, { status: 500 });
  }
}
