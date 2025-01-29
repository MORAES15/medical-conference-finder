import { Conference } from "@/types/conference";

const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

export async function processConferenceWithLLM(conference: Omit<Conference, 'relevanceScore' | 'categories'>): Promise<Pick<Conference, 'relevanceScore' | 'categories'>> {
  console.log('Processing conference with LLM:', conference);
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em análise de congressos médicos.
            Analise o congresso fornecido e:
            1. Atribua uma pontuação de relevância de 0 a 100
            2. Gere até 3 categorias relevantes em português
            Responda apenas em formato JSON com campos 'relevanceScore' e 'categories'.`
          },
          {
            role: 'user',
            content: `Analise este congresso médico:
            Nome: ${conference.name}
            Local: ${conference.location}
            Data: ${conference.day}/${conference.month}/${conference.year}`
          }
        ],
        temperature: 0.2,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha na chamada da API do LLM');
    }

    const data = await response.json();
    const result = JSON.parse(data.choices[0].message.content);

    console.log('LLM processing result:', result);

    return {
      relevanceScore: result.relevanceScore,
      categories: result.categories,
    };
  } catch (error) {
    console.error('Error processing conference with LLM:', error);
    return {
      relevanceScore: 0,
      categories: [],
    };
  }
}

export async function suggestTags(currentTags: string[]): Promise<string[]> {
  console.log('Suggesting tags based on:', currentTags);
  
  try {
    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.1-sonar-small-128k-online',
        messages: [
          {
            role: 'system',
            content: `Você é um assistente especializado em congressos médicos.
            Sugira 3 termos de busca adicionais em português baseados nos termos existentes.
            Responda apenas com um array JSON de strings.`
          },
          {
            role: 'user',
            content: `Termos atuais: ${currentTags.join(', ')}`
          }
        ],
        temperature: 0.3,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      throw new Error('Falha na chamada da API do LLM');
    }

    const data = await response.json();
    const suggestions = JSON.parse(data.choices[0].message.content);

    console.log('Tag suggestions:', suggestions);
    return suggestions;
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return [];
  }
}