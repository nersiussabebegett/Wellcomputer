import { GoogleGenAI, Type } from "@google/genai";

export const parseWhatsAppMessage = async (message: string, availableProducts: string[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  const prompt = `
    Analyze the following WhatsApp sales message and extract transaction details.
    Available Products List: ${availableProducts.join(', ')}

    Message to parse:
    "${message}"

    Rules:
    - Identify the customer name.
    - Match the product name to the closest one in the Available Products List.
    - Extract the price.
    - Identify the payment method (CASH, TRANSFER, or CREDIT).
    - If the message is not a sale record, return an error.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            success: { type: Type.BOOLEAN },
            customerName: { type: Type.STRING },
            productName: { type: Type.STRING },
            price: { type: Type.NUMBER },
            paymentMethod: { type: Type.STRING },
            error: { type: Type.STRING },
          },
          required: ["success"]
        }
      }
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim());
  } catch (error) {
    console.error("Gemini Parsing Error:", error);
    return { success: false, error: "System failed to parse message." };
  }
};