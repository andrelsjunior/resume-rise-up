
export interface AIGenerateRequest {
  fieldName: string;
  currentText: string;
  context?: string;
}

export interface AIGenerateResponse {
  generatedText: string;
}

export const generateWithAI = async (request: AIGenerateRequest): Promise<string> => {
  try {
    // Mock AI generation for now - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { fieldName, currentText } = request;
    
    // Mock responses based on field type
    const mockResponses: Record<string, string> = {
      fullName: "João Silva Santos",
      email: "joao.silva@email.com",
      phone: "(11) 99999-9999",
      location: "São Paulo, SP - Brasil",
      linkedIn: "linkedin.com/in/joao-silva",
      summary: "Profissional experiente com sólida formação em tecnologia e paixão por inovação. Demonstra excelentes habilidades de liderança, comunicação e resolução de problemas. Busca constantemente novos desafios e oportunidades de crescimento profissional.",
      skills: "JavaScript, React, Node.js, Python, SQL, Git, Agile, Scrum, Liderança, Comunicação, Resolução de Problemas",
      company: "Tech Solutions Ltda",
      position: "Desenvolvedor Full Stack Senior",
      description: "• Desenvolveu aplicações web modernas utilizando React e Node.js\n• Liderou equipe de 5 desenvolvedores em projetos estratégicos\n• Implementou práticas de CI/CD que reduziram o tempo de deploy em 60%\n• Colaborou com stakeholders para definir requisitos técnicos\n• Mentoreou desenvolvedores júnior e conduziu code reviews",
      institution: "Universidade de São Paulo",
      degree: "Bacharelado em Ciência da Computação",
      jobDescription: "Estamos buscando um profissional talentoso para integrar nossa equipe de desenvolvimento. O candidato ideal deve ter experiência sólida em tecnologias modernas de desenvolvimento web, capacidade de trabalhar em equipe e paixão por criar soluções inovadoras."
    };

    // If there's current text, enhance it, otherwise provide default
    if (currentText.trim()) {
      return `${currentText}\n\n[Conteúdo aprimorado pela AI: Este texto foi expandido e melhorado para maior impacto profissional]`;
    }

    return mockResponses[fieldName] || `Conteúdo gerado pela AI para ${fieldName}`;
  } catch (error) {
    console.error('Error generating AI content:', error);
    throw new Error('Falha ao gerar conteúdo com AI. Tente novamente.');
  }
};
