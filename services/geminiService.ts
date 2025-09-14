import { GoogleGenAI, Type } from "@google/genai";
import type { GeneratedTask } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "Заголовок завдання українською мовою." },
    instructions: { type: Type.STRING, description: "Інструкція для учня українською мовою." },
    task: { type: Type.STRING, description: "Саме завдання у форматі простого тексту або markdown. Українською мовою." },
    key: { type: Type.STRING, description: "Відповідь або ключ для вчителя. Українською мовою." },
    interactiveHtml: {
      type: Type.STRING,
      description: "Повний, самодостатній HTML-код для інтерактивного завдання з використанням Tailwind CSS через CDN. Якщо інтерактивна версія неможлива, повернути null.",
      nullable: true
    },
  },
  required: ["title", "instructions", "task", "key"]
};

const interactiveHtmlInstructions = `
  IMPORTANT RULES FOR interactiveHtml GENERATION:
  1.  Generate a COMPLETE, SELF-CONTAINED HTML document string. It must start with <!DOCTYPE html> and end with </html>.
  2.  The language of the page must be Ukrainian: <html lang="uk">.
  3.  Include Tailwind CSS via the CDN: <script src="https://cdn.tailwindcss.com"></script> inside the <head>.
  4.  All custom styles MUST be in a <style> tag in the <head>. Use dark mode classes (e.g., dark:bg-gray-800) and prefer indigo/violet colors for accents (buttons, borders) to match the parent app's theme.
  5.  All JavaScript logic for interactivity MUST be in a <script> tag right before the closing </body> tag. Do NOT use external JS files. The JS code should not be minified.
  6.  The HTML should be aesthetically pleasing, responsive, and use a clear layout (e.g., flexbox, grid). All visible text MUST be in Ukrainian.
  7.  Provide clear feedback to the user (e.g., highlighting correct/incorrect answers, showing a success message in a dedicated element).

  SPECIFIC TASK INSTRUCTIONS:
  -   For "кросворд" (crossword):
      -   Create a CSS grid for the crossword layout. Use <div> or <table>. Empty cells should be styled differently.
      -   Each letter cell should be an <input type="text" maxlength="1"> with a fixed size.
      -   Include a "Перевірити" (Check) button.
      -   The JavaScript should validate all filled answers, coloring the input borders green for correct and red for incorrect.
  -   For "гра-відповідність" (matching game / drag-and-drop):
      -   Create two main columns (e.g., using flexbox). One with draggable elements and another with drop zones.
      -   Draggable elements must have 'draggable="true"' and an 'ondragstart' handler to set the data.
      -   Drop zones must have 'ondragover' (to prevent default) and 'ondrop' handlers to receive the data.
      -   The JavaScript must handle the logic of moving items and checking for correctness. When an item is dropped, it should stay in the drop zone.
      -   Include a "Перевірити" (Check) button that evaluates the matches and gives feedback by changing border colors or showing icons.
  -   For "речення з пропусками" (fill-in-the-blanks):
       -   Present sentences with <input type="text"> fields for the missing words.
       -   Include a "Перевірити" (Check) button with JavaScript to validate the answers and provide feedback (e.g., border colors).
`;

export const generateTask = async (topic: string, grade: string, taskType: string): Promise<GeneratedTask> => {
  const basePrompt = `
    Ти – генератор інтерактивних завдань з української мови для вчителів.
    Твоє завдання – створювати вправи для учнів 5–9 класів.
    Завдання мають бути варіативними, щоб їх можна було використовувати кілька разів.
    Для тестів завжди додавай правильну відповідь.
    Для кросвордів і квестів створюй невеликі підказки та пояснення.
    Уся відповідь має бути українською мовою.

    Вхідні дані:
    - Тема уроку: "${topic}"
    - Клас учнів: "${grade}"
  `;
  
  const taskPrompt = taskType === 'suggest' 
    ? `
    - Тип завдання: Користувач не обрав тип. Запропонуй найкращий тип завдання для цієї теми та класу з доступних варіантів ("тест", "кросворд", "гра-відповідність", "речення з пропусками", "знайди помилку") і згенеруй його.
    `
    : `
    - Тип завдання: "${taskType}"
    `;

  const fullPrompt = `${basePrompt}\n${taskPrompt}\n\n${interactiveHtmlInstructions}\n\nЗгенеруй завдання згідно з цими правилами.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.8,
      },
    });

    const parsedJson = JSON.parse(response.text) as GeneratedTask;
    return parsedJson;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Не вдалося згенерувати завдання. Можливо, запит містить неприйнятний контент або сталася помилка сервера.");
  }
};