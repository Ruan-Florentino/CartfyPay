import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { metricas } = await request.json();

    if (!metricas) {
      return NextResponse.json({ error: "Métricas são obrigatórias" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
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

Retorne um JSON com um array de 3 strings curtas (máximo 100 caracteres cada).
Exemplo: { "insights": ["Adicione um Order Bump de R$ 27 para aumentar o ticket médio.", "Sua conversão de PIX está baixa, ative a recuperação por WhatsApp."] }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insights: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["insights"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);

  } catch (error) {
    console.error("Error generating insights:", error);
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 });
  }
}
