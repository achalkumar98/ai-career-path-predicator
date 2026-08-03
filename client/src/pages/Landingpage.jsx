import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router';
import * as echarts from 'echarts';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';

const Landingpage = () => {
    const [email, setEmail] = useState('');
  const [isAssessmentVisible, setIsAssessmentVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const careerChartRef = useRef(null);
  const statsRefs = useRef([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
    
    const questions = [
      {
        question: "Which work environment do you prefer?",
        options: ["Collaborative team setting", "Independent work", "Mix of both", "Leadership position"]
      },
      {
        question: "What skills would you like to develop?",
        options: ["Technical/coding", "Communication/presentation", "Creative/design", "Analytical/problem-solving"]
      },
      {
        question: "How do you prefer to learn?",
        options: ["Hands-on experience", "Structured courses", "Self-directed learning", "Mentorship"]
      }
    ];
  
    // Stats counter animation
    useEffect(() => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const target = entry.target;
            const targetValue = parseInt(target.getAttribute('data-target') || '0', 10);
            let count = 0;
            const interval = setInterval(() => {
              count += Math.ceil(targetValue / 30);
              if (count >= targetValue) {
                target.textContent = targetValue.toString();
                clearInterval(interval);
              } else {
                target.textContent = count.toString();
              }
            }, 30);
          }
        });
      }, { threshold: 0.5 });
  
      statsRefs.current.forEach(ref => {
        if (ref) observer.observe(ref);
      });
  
      return () => {
        statsRefs.current.forEach(ref => {
          if (ref) observer.unobserve(ref);
        });
      };
    }, []);
  
    // Career path visualization chart
    useEffect(() => {
      if (careerChartRef.current) {
        const chart = echarts.init(careerChartRef.current);
        
        const option = {
          animation: false,
          tooltip: {
            trigger: 'item',
            formatter: '{b}: {c}'
          },
          series: [
            {
              type: 'graph',
              layout: 'force',
              roam: true,
              label: {
                show: true,
                position: 'right',
                formatter: '{b}'
              },
              force: {
                repulsion: 100,
                edgeLength: 80
              },
              data: [
                { name: 'Skills Assessment', value: 'Start', symbolSize: 50, itemStyle: { color: '#8A2BE2' } },
                { name: 'Data Science', value: 'Career Path', symbolSize: 40, itemStyle: { color: '#4169E1' } },
                { name: 'UX Design', value: 'Career Path', symbolSize: 40, itemStyle: { color: '#20B2AA' } },
                { name: 'Software Engineering', value: 'Career Path', symbolSize: 40, itemStyle: { color: '#FF7F50' } },
                { name: 'Product Management', value: 'Career Path', symbolSize: 40, itemStyle: { color: '#9370DB' } },
                { name: 'ML Engineer', value: 'Role', symbolSize: 30, itemStyle: { color: '#4169E1' } },
                { name: 'Data Analyst', value: 'Role', symbolSize: 30, itemStyle: { color: '#4169E1' } },
                { name: 'UI Designer', value: 'Role', symbolSize: 30, itemStyle: { color: '#20B2AA' } },
                { name: 'UX Researcher', value: 'Role', symbolSize: 30, itemStyle: { color: '#20B2AA' } },
                { name: 'Frontend Dev', value: 'Role', symbolSize: 30, itemStyle: { color: '#FF7F50' } },
                { name: 'Backend Dev', value: 'Role', symbolSize: 30, itemStyle: { color: '#FF7F50' } },
                { name: 'Technical PM', value: 'Role', symbolSize: 30, itemStyle: { color: '#9370DB' } },
                { name: 'Growth PM', value: 'Role', symbolSize: 30, itemStyle: { color: '#9370DB' } }
              ],
              links: [
                { source: 'Skills Assessment', target: 'Data Science' },
                { source: 'Skills Assessment', target: 'UX Design' },
                { source: 'Skills Assessment', target: 'Software Engineering' },
                { source: 'Skills Assessment', target: 'Product Management' },
                { source: 'Data Science', target: 'ML Engineer' },
                { source: 'Data Science', target: 'Data Analyst' },
                { source: 'UX Design', target: 'UI Designer' },
                { source: 'UX Design', target: 'UX Researcher' },
                { source: 'Software Engineering', target: 'Frontend Dev' },
                { source: 'Software Engineering', target: 'Backend Dev' },
                { source: 'Product Management', target: 'Technical PM' },
                { source: 'Product Management', target: 'Growth PM' }
              ],
              lineStyle: {
                color: '#ccc',
                width: 2,
                curveness: 0.3
              }
            }
          ]
        };
        
        chart.setOption(option);
        
        const handleResize = () => {
          chart.resize();
        };
        
        window.addEventListener('resize', handleResize);
        
        return () => {
          chart.dispose();
          window.removeEventListener('resize', handleResize);
        };
      }
    }, []);
  
    const handleStartAssessment = () => {
      setIsAssessmentVisible(true);
      setCurrentQuestion(0);
      setAnswers({});
    };
    const handlestart = () => {
        if(token){
            navigate('/homePage');
        }else{
            navigate('/login');
        }
        
    };
  
    const handleAnswerSelect = (answer) => {
      setAnswers(prev => ({ ...prev, [currentQuestion]: answer }));
      
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Assessment completed
        setIsAssessmentVisible(false);
        // Here you would typically process the results
      }
    };
  
    const handleEmailSubmit = (e) => {
      e.preventDefault();
      // Process email signup
      setEmail('');
      // Show success message or redirect
    };
  
    return (
      <div className="min-h-screen  bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 text-white font-sans">
        {/* Hero Section */}
        <section className="relative min-h-[600px] overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 opacity-90"></div>
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: "url('https://readdy.ai/api/search-image?query=abstract%20futuristic%20technology%20background%20with%20glowing%20blue%20and%20purple%20digital%20elements%2C%20modern%20tech%20concept%20with%20network%20connections%20and%20flowing%20data%20visualization%2C%20high%20resolution%203D%20render&width=1440&height=600&seq=hero-bg-1&orientation=landscape')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          ></div>
          
          <div className="container mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center py-20">
            <div className="md:w-1/2 text-white mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                AI Career Navigator
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-100">
                Personalized skill-based guidance for your career journey
              </p>
              <button 
                onClick={handlestart}
                className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1 !rounded-button cursor-pointer whitespace-nowrap"
              >
                Start Your Career Discovery
              </button>
              
              <div className="mt-12 flex flex-wrap gap-8">
                <div className="flex flex-col items-center">
                  <span 
                    ref={el => statsRefs.current[0] = el} 
                    data-target="94" 
                    className="text-3xl font-bold text-purple-300"
                  >
                    0
                  </span>
                  <span className="text-sm">Career Paths</span>
                </div>
                <div className="flex flex-col items-center">
                  <span 
                    ref={el => statsRefs.current[1] = el} 
                    data-target="1250" 
                    className="text-3xl font-bold text-purple-300"
                  >
                    0
                  </span>
                  <span className="text-sm">Skills Analyzed</span>
                </div>
                <div className="flex flex-col items-center">
                  <span 
                    ref={el => statsRefs.current[2] = el} 
                    data-target="85" 
                    className="text-3xl font-bold text-purple-300"
                  >
                    0
                  </span>
                  <span className="text-sm">Success Rate</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <img 
                  src="https://readdy.ai/api/search-image?query=futuristic%20AI%20assistant%20avatar%20with%20glowing%20blue%20energy%2C%20digital%20particles%20forming%20a%20humanoid%20shape%2C%20advanced%20technology%20concept%2C%20holographic%20interface%20elements%2C%20high-quality%203D%20render%20on%20transparent%20background&width=500&height=500&seq=ai-avatar-1&orientation=squarish" 
                  alt="AI Career Navigator Avatar" 
                  className="w-full h-auto object-cover object-top transform hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute -bottom-4 -right-4 bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 p-3 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">AI Assistant Online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Features Grid */}
        <section className="py-20  bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How AI Career Navigator Works</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Our advanced AI analyzes your skills and preferences to create personalized career recommendations
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                    <i className="fas fa-brain text-2xl text-indigo-600"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Skill Assessment</h3>
                  <p className="text-gray-600">
                    Take our comprehensive assessment to identify your strengths, weaknesses, and hidden talents.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                    <i className="fas fa-route text-2xl text-purple-600"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Career Mapping</h3>
                  <p className="text-gray-600">
                    Our AI matches your profile with thousands of career paths to find your optimal professional journey.
                  </p>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <div className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                    <i className="fas fa-graduation-cap text-2xl text-blue-600"></i>
                  </div>
                  <h3 className="text-xl font-bold mb-3">Learning Roadmap</h3>
                  <p className="text-gray-600">
                    Get personalized recommendations for courses, certifications, and resources to achieve your goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
  
        {/* Interactive Assessment Section */}
        <section className="py-20  bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center">
              <div className="lg:w-1/2 mb-10 lg:mb-0">
                <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-2xl p-6 shadow-lg max-w-lg mx-auto">
                  {isAssessmentVisible ? (
                    <div className="py-6">
                      <div className="mb-8">
                        <div className="flex justify-between mb-2">
                          <span className="text-sm font-medium text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
                          <span className="text-sm font-medium text-indigo-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" 
                            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <h3 className="text-xl font-bold mb-6">{questions[currentQuestion].question}</h3>
                      
                      <div className="space-y-3">
                        {questions[currentQuestion].options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => handleAnswerSelect(option)}
                            className={`w-full bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-left p-4 rounded-lg border transition-all duration-200 hover:bg-indigo-50 hover:border-indigo-300 !rounded-button cursor-pointer whitespace-nowrap ${
                              answers[currentQuestion] === option 
                                ? 'bg-indigo-50 border-indigo-300' 
                                : 'bg-white border-gray-200'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10">
                      <img 
                        src="https://readdy.ai/api/search-image?query=modern%20skill%20assessment%20interface%20with%20charts%20and%20graphs%2C%20clean%20UI%20design%2C%20career%20aptitude%20test%20visualization%2C%20professional%20looking%20dashboard%20with%20purple%20and%20blue%20elements%2C%20high%20quality%20digital%20illustration&width=400&height=300&seq=assessment-preview-1&orientation=landscape" 
                        alt="Assessment Preview" 
                        className="w-full h-auto rounded-lg mb-6"
                      />
                      <h3 className="text-xl font-bold mb-2">Interactive Skill Assessment</h3>
                      <p className="text-gray-600 mb-6">Take our 3-minute assessment to discover your career path</p>
                      <button 
                        onClick={handleStartAssessment}
                        className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
                      >
                        Start Free Assessment
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="lg:w-1/2 lg:pl-16">
                <h2 className="text-3xl font-bold mb-6">Discover Your Ideal Career Path</h2>
                <p className="text-lg text-gray-700 mb-6">
                  Our AI-powered assessment analyzes your unique combination of skills, interests, and work preferences to identify career paths where you'll thrive.
                </p>
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <i className="fas fa-check-circle text-green-500 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">Personalized Insights</h4>
                      <p className="text-gray-600">Receive a detailed analysis of your strengths and growth areas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <i className="fas fa-check-circle text-green-500 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">Career Matches</h4>
                      <p className="text-gray-600">See which careers align with your unique skill profile</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <i className="fas fa-check-circle text-green-500 text-xl"></i>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-lg font-medium">Skill Gap Analysis</h4>
                      <p className="text-gray-600">Identify what you need to learn to reach your career goals</p>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={handleStartAssessment}
                  className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white px-8 py-4 rounded-lg text-lg font-semibold shadow-lg hover:shadow-xl transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
                >
                  Take Free Assessment
                </button>
              </div>
            </div>
          </div>
        </section>
  
        {/* Career Path Visualization */}
        <section className="py-20  bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Visualize Your Career Options</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Explore potential career paths based on your skills and see how different roles connect
              </p>
            </div>
            
            <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-2xl shadow-lg p-6 overflow-hidden">
              <div 
                ref={careerChartRef} 
                className="w-full h-[500px]"
              ></div>
            </div>
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-4 rounded-lg shadow">
                <div className="w-4 h-4 rounded-full bg-[#8A2BE2] mb-2"></div>
                <h4 className="font-medium">Assessment</h4>
                <p className="text-sm text-gray-600">Your starting point</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-4 rounded-lg shadow">
                <div className="w-4 h-4 rounded-full bg-[#4169E1] mb-2"></div>
                <h4 className="font-medium">Data Science</h4>
                <p className="text-sm text-gray-600">Analytics & ML paths</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-4 rounded-lg shadow">
                <div className="w-4 h-4 rounded-full bg-[#20B2AA] mb-2"></div>
                <h4 className="font-medium">Design</h4>
                <p className="text-sm text-gray-600">UX/UI career paths</p>
              </div>
              
              <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-4 rounded-lg shadow">
                <div className="w-4 h-4 rounded-full bg-[#FF7F50] mb-2"></div>
                <h4 className="font-medium">Engineering</h4>
                <p className="text-sm text-gray-600">Development roles</p>
              </div>
            </div>
          </div>
        </section>
  
        {/* Social Proof Section */}
        <section className="py-20 bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400">
  <div className="max-w-7xl mx-auto px-6">
    {/* Heading */}
    <div className="text-center mb-16">
      <h2 className="text-3xl md:text-4xl font-bold mb-4">Success Stories</h2>
      <p className="text-xl text-gray-600 max-w-3xl mx-auto">
        See how AI Career Navigator has helped professionals find their ideal career path
      </p>
    </div>

    {/* Grid Layout for Testimonials */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-xl p-6 h-full shadow-md">
        <div className="flex items-center mb-4">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20smiling%20young%20asian%20woman%20with%20shoulder%20length%20black%20hair%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photograph%2C%20natural%20lighting&width=80&height=80&seq=testimonial-1&orientation=squarish"
            alt="Sarah L."
            className="w-16 h-16 rounded-full object-cover object-top"
          />
          <div className="ml-4">
            <h4 className="font-bold">Sarah L.</h4>
            <p className="text-sm text-gray-600">Former Teacher, Now UX Designer</p>
          </div>
        </div>
        <p className="text-gray-700">
          "The assessment identified my hidden design talents that I never knew I had. After following the recommended learning path, I successfully transitioned from teaching to UX design in just 8 months."
        </p>
        <div className="mt-4 flex">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fas fa-star text-yellow-400"></i>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-xl p-6 h-full shadow-md">
        <div className="flex items-center mb-4">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20smiling%20african%20american%20man%20in%20his%2030s%20wearing%20a%20blue%20button%20up%20shirt%2C%20business%20casual%2C%20neutral%20background%2C%20high%20quality%20portrait%20photograph%2C%20natural%20lighting&width=80&height=80&seq=testimonial-2&orientation=squarish"
            alt="Marcus J."
            className="w-16 h-16 rounded-full object-cover object-top"
          />
          <div className="ml-4">
            <h4 className="font-bold">Marcus J.</h4>
            <p className="text-sm text-gray-600">Sales Rep to Data Analyst</p>
          </div>
        </div>
        <p className="text-gray-700">
          "I was stuck in a sales job I didn't enjoy. The AI Career Navigator showed me how my analytical skills could transfer to data analysis. Now I'm earning 40% more and loving my work!"
        </p>
        <div className="mt-4 flex">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fas fa-star text-yellow-400"></i>
          ))}
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-xl p-6 h-full shadow-md">
        <div className="flex items-center mb-4">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20smiling%20caucasian%20woman%20in%20her%2040s%20with%20shoulder%20length%20brown%20hair%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photograph%2C%20natural%20lighting&width=80&height=80&seq=testimonial-3&orientation=squarish"
            alt="Jennifer M."
            className="w-16 h-16 rounded-full object-cover object-top"
          />
          <div className="ml-4">
            <h4 className="font-bold">Jennifer M.</h4>
            <p className="text-sm text-gray-600">Marketing to Product Management</p>
          </div>
        </div>
        <p className="text-gray-700">
          "After 10 years in marketing, I felt stuck. The career path visualization showed me how my skills could transfer to product management. The transition was smoother than I expected!"
        </p>
        <div className="mt-4 flex">
          <i className="fas fa-star text-yellow-400"></i>
          <i className="fas fa-star text-yellow-400"></i>
          <i className="fas fa-star text-yellow-400"></i>
          <i className="fas fa-star text-yellow-400"></i>
          <i className="fas fa-star-half-alt text-yellow-400"></i>
        </div>
      </div>

      <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 rounded-xl p-6 h-full shadow-md">
        <div className="flex items-center mb-4">
          <img
            src="https://readdy.ai/api/search-image?query=professional%20headshot%20of%20a%20smiling%20latino%20man%20in%20his%20late%2020s%20with%20short%20black%20hair%2C%20business%20casual%20attire%2C%20neutral%20background%2C%20high%20quality%20portrait%20photograph%2C%20natural%20lighting&width=80&height=80&seq=testimonial-4&orientation=squarish"
            alt="Carlos R."
            className="w-16 h-16 rounded-full object-cover object-top"
          />
          <div className="ml-4">
            <h4 className="font-bold">Carlos R.</h4>
            <p className="text-sm text-gray-600">Customer Service to Software Developer</p>
          </div>
        </div>
        <p className="text-gray-700">
          "I never thought I could become a developer without a CS degree. The AI Navigator identified my logical thinking skills and created a learning roadmap that worked with my schedule."
        </p>
        <div className="mt-4 flex">
          {[...Array(5)].map((_, i) => (
            <i key={i} className="fas fa-star text-yellow-400"></i>
          ))}
        </div>
      </div>
    </div>

    {/* Stats Section */}
    <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
      <div>
        <h3 className="text-4xl font-bold text-indigo-600 mb-2">
          <span ref={el => statsRefs.current[3] = el} data-target="25000">0</span>+
        </h3>
        <p className="text-gray-600">Career Transitions</p>
      </div>
      <div>
        <h3 className="text-4xl font-bold text-indigo-600 mb-2">
          <span ref={el => statsRefs.current[4] = el} data-target="92">0</span>%
        </h3>
        <p className="text-gray-600">Satisfaction Rate</p>
      </div>
      <div>
        <h3 className="text-4xl font-bold text-indigo-600 mb-2">
          <span ref={el => statsRefs.current[5] = el} data-target="35">0</span>%
        </h3>
        <p className="text-gray-600">Average Salary Increase</p>
      </div>
      <div>
        <h3 className="text-4xl font-bold text-indigo-600 mb-2">
          <span ref={el => statsRefs.current[6] = el} data-target="6">0</span>
        </h3>
        <p className="text-gray-600">Months Average Transition</p>
      </div>
    </div>
  </div>
</section>


  
        {/* Call-to-Action Section */}
        <section className="py-20 bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 text-white">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Discover Your Ideal Career Path?</h2>
              <p className="text-xl mb-10">
                Join thousands of professionals who have found fulfilling careers with AI Career Navigator
              </p>
              
              <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-grow px-4 py-3 rounded-lg bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white border-none focus:outline-none focus:ring-2 "
                  required
                />
                <button 
                  type="submit"
                  className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
                >
                  Begin Now
                </button>
              </form>
              
              <p className="mt-4 text-sm text-indigo-200">
                Get your free personalized career report instantly
              </p>
            </div>
          </div>
        </section>
  
        {/* Footer */}
        <footer className="bg-gradient-to-br from-blue-600 via-teal-500 to-cyan-500 text-gray-300 py-16">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                <h3 className="text-xl font-bold text-white mb-4">AI Career Navigator</h3>
                <p className="mb-4">
                  Personalized skill-based guidance for effective career solutions
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-white hover:text-white transition-colors cursor-pointer">
                    <i className="fab fa-twitter text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-white transition-colors cursor-pointer">
                    <i className="fab fa-linkedin text-xl"></i>
                  </a>
                  <a href="#" className="text-white hover:text-white transition-colors cursor-pointer">
                    <i className="fab fa-instagram text-xl"></i>
                  </a>
                  <a href="#" className="text-white0 hover:text-white transition-colors cursor-pointer">
                    <i className="fab fa-facebook text-xl"></i>
                  </a>
                </div>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Resources</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Career Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Skill Guides</a></li>
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Industry Reports</a></li>
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Success Stories</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Company</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">About Us</a></li>
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy Policy</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="text-lg font-semibold text-white mb-4">Stay Updated</h4>
                <p className="mb-4">Subscribe to our newsletter for career tips and updates</p>
                <form className="flex">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="px-4 py-2 rounded-l-lg bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white border-none focus:outline-none focus:ring-2 focus:ring-indigo-500 w-full"
                  />
                  <button 
                    type="submit"
                    className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white px-4 py-2 rounded-r-lg hover:bg-indigo-700 transition duration-300 !rounded-button cursor-pointer whitespace-nowrap"
                  >
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-12 pt-8 text-sm text-center">
              <p>© 2025 AI Career Navigator. All rights reserved.</p>
              <div className="mt-4 flex justify-center space-x-6">
                <a href="#" className="hover:text-white transition-colors cursor-pointer">Terms</a>
                <a href="#" className="hover:text-white transition-colors cursor-pointer">Privacy</a>
                <a href="#" className="hover:text-white transition-colors cursor-pointer">Cookies</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
}

export default Landingpage;