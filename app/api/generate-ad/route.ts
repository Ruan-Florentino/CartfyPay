import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { config } = await request.json();

    if (!config) {
      return NextResponse.json({ error: "Config is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Você é um copywriter de elite especializado em Facebook Ads e Instagram Ads para infoprodutos.
Crie uma copy de anúncio de alta conversão para o seguinte produto:

Nome: ${config.productTitle}
Headline: ${config.headline}
Subheadline: ${config.subheadline}
Preço: R$ ${config.price}

A copy deve seguir a estrutura AIDA (Atenção, Interesse, Desejo, Ação).
Seja persuasivo, use gatilhos mentais (urgência, prova social, novidade) e inclua emojis adequados.
Não use hashtags.

Retorne um JSON com a seguinte estrutura:
{
  "adCopy": "O texto completo da copy do anúncio aqui, formatado com quebras de linha."
}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            adCopy: { type: Type.STRING }
          },
          required: ["adCopy"]
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
    console.error("Error generating ad:", error);
    return NextResponse.json({ error: "Failed to generate ad" }, { status: 500 });
  }
}
