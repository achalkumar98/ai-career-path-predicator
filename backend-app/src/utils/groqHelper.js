const OpenAI = require('openai');

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

// Retry groq  with exponential backoff on 429
async function callGroqWithRetry(prompt, retries = 3, delayMs = 15001) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await groq.chat.completions.create({
        model: 'llama-3.3-70b-versatile', // check console.groq.com/docs/models for current options
        messages: [{ role: 'user', content: prompt }],
      });
      return result.choices[0].message.content.trim();
    } catch (err) {
      const is429 = err?.status === 429 || err?.message?.includes('429');
      if (is429 && attempt < retries) {
        const wait = delayMs * attempt;
        console.warn(`[Groq] 429 quota hit — retrying in ${wait / 1000}s (attempt ${attempt}/${retries})`);
        await new Promise(r => setTimeout(r, wait));
      } else {
        throw err;
      }
    }
 
  }
}

// Rule-based fallback when groq  is unavailable
function fallbackCareerInsight(skills = [], interests = []) {
  const s = skills.map(x => x.toLowerCase()).join(' ');
  const i = interests.map(x => x.toLowerCase()).join(' ');
  const combined = s + ' ' + i;

  if (combined.match(/data|ml|machine learning|ai|python|analytics/)) {
    return `Based on your skills in ${skills.join(', ')} and interests in ${interests.join(', ')}, you'd excel as a Data Scientist, ML Engineer, or AI Product Manager. These roles are in high demand and align perfectly with your analytical background. Consider building projects on Kaggle and contributing to open-source ML libraries to strengthen your portfolio.`;
  }
  if (combined.match(/web|react|javascript|frontend|backend|node|fullstack/)) {
    return `Your skills in ${skills.join(', ')} make you a strong candidate for Full Stack Developer, Frontend Engineer, or Technical Lead roles. The web ecosystem is evolving fast — focus on TypeScript, cloud-native architectures, and performance optimization to stand out in the job market.`;
  }
  if (combined.match(/design|ux|ui|figma|creative|product/)) {
    return `With your background in ${skills.join(', ')} and passion for ${interests.join(', ')}, UX Designer, Product Designer, or Design Systems Lead would be excellent fits. Companies are investing heavily in design-led product development — build a strong portfolio showcasing user research and end-to-end design thinking.`;
  }
  if (combined.match(/finance|accounting|business|management|strategy/)) {
    return `Your profile in ${skills.join(', ')} points toward careers in Financial Analyst, Business Strategist, or Product Manager. The intersection of business acumen and technology is highly valued — consider upskilling in data analysis and digital transformation to accelerate your growth.`;
  }
  if (combined.match(/marketing|content|social|seo|brand/)) {
    return `With skills in ${skills.join(', ')} and interests in ${interests.join(', ')}, you'd thrive as a Digital Marketing Manager, Growth Hacker, or Content Strategist. Focus on data-driven marketing, SEO mastery, and building measurable campaign results to advance your career.`;
  }
  return `Based on your skills in ${skills.join(', ')} and interests in ${interests.join(', ')}, you have a versatile profile suited for roles in consulting, project management, or emerging tech fields. Focus on building a strong portfolio, networking actively, and identifying the intersection of your skills with high-growth industries. Consider certifications in your area of interest to validate your expertise.`;
}

function fallbackPersonalityInsight(input = '') {
  const text = input.toLowerCase();
  if (text.match(/help|people|teach|support|care/)) {
    return `Your people-oriented personality is a tremendous asset in today's collaborative work environments. You'd thrive in roles like Career Counselor, HR Manager, UX Researcher, or Customer Success Manager. Your empathy and communication skills are rare — leverage them in roles where human connection drives outcomes. Consider exploring EdTech, healthcare tech, or social impact organizations where your values align with the mission.`;
  }
  if (text.match(/logic|problem|solve|analyze|data|research/)) {
    return `Your analytical mindset and love for problem-solving position you perfectly for high-impact technical roles. Data Analyst, Software Engineer, Systems Architect, or Research Scientist would leverage your strengths. The job market rewards people who can turn complex data into clear decisions — your profile is exactly what top tech companies look for. Build projects that demonstrate your problem-solving process, not just the outcome.`;
  }
  if (text.match(/creative|design|art|visual|write|story/)) {
    return `Your creative energy and expressive nature are powerful differentiators in a world that increasingly values storytelling and design thinking. UX Designer, Content Strategist, Brand Manager, or Creative Director roles would let you shine. The most successful creatives today combine artistic vision with data literacy — consider learning basic analytics to make your creative work measurable and impactful.`;
  }
  if (text.match(/lead|manage|team|organize|plan|strategy/)) {
    return `Your leadership instincts and strategic thinking make you a natural fit for management and executive tracks. Product Manager, Operations Lead, Startup Founder, or Business Development Manager would align with your strengths. Great leaders today are also great communicators and data-informed decision makers — invest in both soft skills and analytical tools to accelerate your path to senior roles.`;
  }
  return `Your unique combination of traits and interests positions you well for a fulfilling career journey. The key is to identify roles where your natural strengths create the most value. Consider taking a structured skills assessment, talking to professionals in fields that interest you, and building small projects that demonstrate your capabilities. Your career is a marathon, not a sprint — focus on consistent growth and authentic networking.`;
}

function fallbackChatReply(message = '') {
  const msg = message.toLowerCase();
  if (msg.match(/resume|cv/)) {
    return `A strong resume should be tailored to each job posting. Use the job description keywords, quantify your achievements (e.g., "increased sales by 30%"), keep it to 1-2 pages, and use a clean ATS-friendly format. Start each bullet with a strong action verb. Would you like specific tips for your industry?`;
  }
  if (msg.match(/interview/)) {
    return `For interviews, use the STAR method (Situation, Task, Action, Result) for behavioral questions. Research the company thoroughly, prepare 3-5 questions to ask the interviewer, and practice your answers out loud. For technical interviews, focus on problem-solving approach over perfect answers. Confidence and clarity matter as much as technical knowledge.`;
  }
  if (msg.match(/salary|pay|compensation/)) {
    return `When negotiating salary, always research market rates first using Glassdoor, LinkedIn Salary, and Levels.fyi. Never give the first number — let the employer anchor. Counter with data, not emotion. Consider the full compensation package: equity, benefits, PTO, and growth opportunities. It's always okay to ask for 24-48 hours to consider an offer.`;
  }
  if (msg.match(/switch|change|transition|career change/)) {
    return `Career transitions are more common than ever. Start by identifying transferable skills from your current role. Build a portfolio or side projects in your target field. Network with people already in that industry — informational interviews are gold. Consider a bridge role that combines your current experience with your target field. Most transitions take 6-18 months of intentional effort.`;
  }
  if (msg.match(/skill|learn|course|certification/)) {
    return `The most in-demand skills right now are: AI/ML fundamentals, data analysis, cloud computing (AWS/GCP/Azure), product management, and digital marketing. For learning, I recommend Coursera, edX, and LinkedIn Learning for structured courses. Build real projects alongside courses — employers value demonstrated skills over certificates alone.`;
  }
  if (msg.match(/job|find|search|apply/)) {
    return `For an effective job search: optimize your LinkedIn profile with keywords, set up job alerts on LinkedIn, Indeed, and Naukri. Apply within the first 24-48 hours of a posting going live. Aim for quality over quantity — 10 tailored applications beat 100 generic ones. Follow up after 5-7 business days. 70% of jobs are filled through networking, so prioritize building genuine professional relationships.`;
  }
  return `That's a great career question! As your AI career advisor, I'd suggest focusing on three things: (1) Identify your core strengths and how they create value for employers, (2) Research the specific roles and companies that align with your goals, and (3) Build a consistent personal brand across LinkedIn and your portfolio. Career growth is about strategic positioning, not just hard work. What specific aspect would you like to explore further?`;
}

module.exports = { callGroqWithRetry, fallbackCareerInsight, fallbackPersonalityInsight, fallbackChatReply };
