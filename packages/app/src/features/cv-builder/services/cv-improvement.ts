import type { FormData } from "@quickcv/shared-schema";

export const generateCVImprovementPrompt = (wizardData: FormData): string => {
	const prompt = `You are an expert career advisor and resume optimization specialist. Analyze the following CV/resume data and provide detailed, actionable improvement suggestions.

## Data to Analyze:
\`\`\`json
${JSON.stringify(wizardData, null, 2)}
\`\`\`

## Analysis Framework:

### 1. Content Quality & Impact
- **Professional Summary**: Evaluate the "about" section for clarity, impact, and value proposition
- **Experience Descriptions**: Assess job descriptions for:
  - Quantifiable achievements and metrics
  - Action-oriented language and strong verbs
  - Relevance to target roles
  - Technical skills demonstration
- **Education Relevance**: Check if education entries add value or could be optimized

### 2. Structure & Completeness
- **Missing Critical Information**: Identify gaps in:
  - Contact information (email, phone, location)
  - Key skills section
  - Certifications or licenses
  - Notable projects or achievements
- **Section Balance**: Evaluate proportions and ordering of sections
- **Consistency**: Check date formats, location formats, and description styles

### 3. Professional Optimization
- **ATS Compatibility**: Suggest keyword improvements for applicant tracking systems
- **Industry Alignment**: Provide industry-specific recommendations based on the professional title: "${
		wizardData.generalInfo.professionalTitle
	}"
- **Career Progression**: Analyze if the career trajectory is clear and compelling
- **Professional Branding**: Evaluate consistency in professional positioning

### 4. Technical & Formatting
- **Rich Text Content**: Analyze description formatting and readability
- **Social Links**: Evaluate professional social media presence (${
		wizardData.socials.socials.length
	} links provided)
- **Photo Considerations**: Assess if photo usage is appropriate for target market

## Specific Context:
- **Name**: ${wizardData.generalInfo.fullName}
- **Role**: ${wizardData.generalInfo.professionalTitle}
- **Experience Count**: ${wizardData.experience.experiences.length} positions
- **Education Count**: ${wizardData.education.education.length} entries
- **Social Links**: ${wizardData.socials.socials.map((s) => s.name).join(", ")}

## Provide Specific Recommendations For:

1. **Immediate Improvements** (high-impact, easy fixes)
2. **Content Enhancements** (rewriting suggestions with examples)
3. **Missing Elements** (what should be added)
4. **Strategic Positioning** (how to better align with career goals)
5. **Industry Best Practices** (sector-specific advice for ${
		wizardData.generalInfo.professionalTitle
	})

## Output Format:
Structure your response with:
- **Overall Assessment** (1-2 sentences)
- **Priority Improvements** (top 3-5 critical changes)
- **Section-by-Section Analysis** (detailed feedback per section)
- **Content Suggestions** (specific rewrites where applicable)
- **Additional Recommendations** (skills, certifications, etc.)

Focus on actionable, specific advice that will measurably improve the resume's effectiveness in securing interviews and opportunities.`;

	return prompt;
};

export const sendToAIForImprovements = async (
	wizardData: FormData,
): Promise<string> => {
	const prompt = generateCVImprovementPrompt(wizardData);

	// This would be your API call to an AI service
	// Example implementation:
	try {
		const response = await fetch("/api/ai-improvements", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ prompt }),
		});

		if (!response.ok) {
			throw new Error("Failed to get AI improvements");
		}

		const result = await response.json();
		return result.improvements;
	} catch (error) {
		console.error("Error getting AI improvements:", error);
		throw error;
	}
};
