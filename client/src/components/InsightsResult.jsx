const InsightsResult = ({ result, loading }) => {
  if (!result || loading) return null;

  // Function to split and render content dynamically
  const splitContent = (content) => {
    const sections = content.split("\n\n"); // Split by paragraphs
    
    return sections.map((section, index) => {
      // Handle bullet points
      if (section.includes("*") || section.includes("-")) {
        const items = section.split("\n").filter(line => line.startsWith("*") || line.startsWith("-"));
        return (
          <ul key={index} className="list-disc pl-6">
            {items.map((item, i) => (
              <li key={i} className="text-gray-600">{item.replace(/^[-*]\s*/, '')}</li>
            ))}
          </ul>
        );
      }
      
      // Handle regular text
      return <p key={index} className="text-gray-600">{section}</p>;
    });
  };

  const sections = splitContent(result); // Process the result to split content

  return (
    <div className="mt-8 bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-6 rounded-xl border border-gray-200 animate__animated animate__fadeIn">
      <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">
        Your AI-Powered Career Insight 🚀
      </h2>

      {/* Render the dynamic sections */}
      {sections}
    </div>
  );
};

export default InsightsResult;
