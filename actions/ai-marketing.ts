"use server";

// Mock AI function - in production, this would call OpenAI or similar
export async function generateProductCopy(productName: string, category: string = "General") {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const templates = [
        `Elevate your experience with the ${productName}. Meticulously crafted for those who demand excellence in ${category.toLowerCase()}.`,
        `Introducing ${productName}: Where innovation meets sophistication. The perfect addition to your ${category.toLowerCase()} collection.`,
        `Discover ${productName} - A masterpiece of modern design. Engineered for performance, styled for distinction.`,
        `The ${productName} redefines ${category.toLowerCase()}. Premium quality meets cutting-edge technology.`,
    ];

    return {
        description: templates[Math.floor(Math.random() * templates.length)],
    };
}
