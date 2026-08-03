import ResumeNLP from '../components/ResumeNLP';

const ResumeAnalyzer = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500  shadow-2xl rounded-3xl p-8 md:p-12 w-full max-w-3xl flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-center drop-shadow-lg">
          📄 Resume Analyzer
        </h1>
        
        <ResumeNLP />
      </div>
    </div>
  );
};

export default ResumeAnalyzer;
