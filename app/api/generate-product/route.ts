import { GoogleGenAI, Type } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY });

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.1-pro-preview",
      contents: `Você é um especialista em marketing digital, copywriting e criação de produtos digitais de alta conversão.
O usuário quer criar um produto baseado nesta ideia: "${prompt}".

Sua tarefa é gerar uma configuração completa para o checkout builder do Cartfy.
O Cartfy é uma plataforma de vendas de produtos digitais.

Gere um JSON com a seguinte estrutura exata:
{
  "productTitle": "Nome forte e chamativo para o produto",
  "price": 97.00, // Preço sugerido em reais (número)
  "headline": "Headline principal de alta conversão",
  "subheadline": "Subheadline persuasiva que complementa a headline",
  "buttonText": "Texto de CTA forte (ex: QUERO COMEÇAR AGORA)",
  "primaryColor": "#FF5F00", // Sugira uma cor primária que combine com o nicho (hexadecimal)
  "backgroundColor": "#000000", // Sugira uma cor de fundo (hexadecimal, preferencialmente escura)
  "orderBump": {
    "enabled": true,
    "title": "Nome de um produto complementar (Order Bump)",
    "description": "Descrição curta e persuasiva do porquê levar isso junto",
    "price": 27.00 // Preço do order bump
  },
  "upsell": {
    "enabled": true,
    "title": "Oferta de Upsell Irrecusável",
    "description": "Descrição do upsell que será oferecido após a compra",
    "price": 197.00,
    "videoId": "" // Opcional, ID do vídeo do YouTube se houver
  },
  "sections": [
    // Retorne um array com as seções recomendadas para a página de vendas.
    // As seções disponíveis são: 'header', 'product', 'benefits', 'testimonials', 'guarantee', 'timer', 'payment', 'faq', 'bonus', 'urgency', 'social_proof'
    // Exemplo:
    { "id": "sec_1", "type": "header", "enabled": true },
    { "id": "sec_2", "type": "product", "enabled": true },
    { "id": "sec_3", "type": "benefits", "enabled": true },
    { "id": "sec_4", "type": "payment", "enabled": true },
    { "id": "sec_5", "type": "guarantee", "enabled": true }
  ]
}

Responda APENAS com o JSON válido.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            productTitle: { type: Type.STRING },
            price: { type: Type.NUMBER },
            headline: { type: Type.STRING },
            subheadline: { type: Type.STRING },
            buttonText: { type: Type.STRING },
            primaryColor: { type: Type.STRING },
            backgroundColor: { type: Type.STRING },
            orderBump: {
              type: Type.OBJECT,
              properties: {
                enabled: { type: Type.BOOLEAN },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.NUMBER },
              },
              required: ["enabled", "title", "description", "price"]
            },
            upsell: {
              type: Type.OBJECT,
              properties: {
                enabled: { type: Type.BOOLEAN },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                price: { type: Type.NUMBER },
                videoId: { type: Type.STRING },
              },
              required: ["enabled", "title", "description", "price"]
            },
            sections: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  type: { type: Type.STRING },
                  enabled: { type: Type.BOOLEAN }
                },
                required: ["id", "type", "enabled"]
              }
            }
          },
          required: ["productTitle", "price", "headline", "subheadline", "buttonText", "primaryColor", "backgroundColor", "orderBump", "upsell", "sections"]
        }
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const config = JSON.parse(text);
    return NextResponse.json({ config });

  } catch (error) {
    console.error("Error generating product:", error);
    return NextResponse.json({ error: "Failed to generate product" }, { status: 500 });
  }
}
