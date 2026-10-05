import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `You are an expert physics tutor specializing in the Stern-Gerlach experiment. You help college-level students (BSc/BTech) understand quantum mechanics concepts.

Your knowledge covers:
- The Stern-Gerlach experimental setup (oven, silver beam, inhomogeneous magnetic field, detector)
- Why silver atoms are used (single valence electron 5s1, L=0, S=1/2, J=1/2)
- Why a non-uniform (inhomogeneous) magnetic field is required (gradient creates net force, uniform field only causes precession)
- Space quantization and the 2J+1 rule
- Magnetic moment calculations: μ = -g_J × μ_B × J/ℏ, F_z = μ_z × dB/dz
- Pauli spin matrices (σ_x, σ_y, σ_z) and their eigenvalues
- The Bloch sphere representation of spin-1/2 states
- Sequential Stern-Gerlach experiments and the measurement problem
- Connection to superposition, wave function collapse, incompatible observables
- Applications: MRI, quantum computing (qubits), spintronics, atomic clocks, Rabi's method

Rules:
- Give clear, concise explanations suitable for undergraduates
- Use analogies but flag when they break down
- Include relevant equations when helpful
- Be encouraging and patient
- Keep responses focused and under 200 words unless the student asks for detail`;

export async function POST(request) {
  try {
    const { message, history } = await request.json();

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return Response.json(
        { reply: "The Gemini API key hasn't been configured yet. Add your key to the .env.local file and restart the server." },
        { status: 200 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const contents = [];

    // Add conversation history
    if (history && history.length > 0) {
      for (const msg of history) {
        contents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    // Add current message
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: {
        systemInstruction: SYSTEM_PROMPT,
        maxOutputTokens: 1024,
        temperature: 0.7,
      },
    });

    const reply = response.text || "I wasn't able to generate a response. Could you rephrase your question?";

    return Response.json({ reply });
  } catch (error) {
    console.error('Gemini API error:', error);
    return Response.json(
      { reply: "Something went wrong with the AI service. Please try again in a moment." },
      { status: 200 }
    );
  }
}
