export const processEventWithAI = async (text: string) => {
    console.log(`Processing with AI adapter for: "${text}"`);

    await new Promise(resolve => setTimeout(resolve, 50));

    return {
        summary: "Se detectó una actividad sospechosa relacionada con el dominio 'acme-scam.xyz'.",
        severity: "HIGH",
        suggestedAction: "Bloquear el dominio y notificar al equipo de seguridad."
    };
};