import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { ArrowRight} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function App() {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <header className="relative overflow-hidden bg-gray-50">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80')] opacity-5 bg-cover bg-center" />
        <div className="container mx-auto px-6">
         

          <div className="z-50 py-24 md:py-32">
            <div className="max-w-4xl">
              <h1 className="z-50 text-5xl md:text-6xl font-light leading-tight mb-6">
                Transform Your <span className="font-semibold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">Hiring Process</span> Through Smart Referrals
              </h1>
              <p className="text-xl text-gray-600 mb-12 leading-relaxed max-w-2xl">
                Leverage your network's potential with our intelligent referral management platform. Connect with top talent through trusted recommendations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={()=>{navigate('/login')}} size="lg" className="z-50 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-12">
            {[
              { number: "93%", text: "Faster Hiring Process" },
              { number: "2.4x", text: "Better Retention Rate" },
              { number: "45%", text: "Cost Reduction" }
            ].map((stat, index) => (
              <Card key={index} className="text-center p-8 hover:shadow-lg transition-shadow">
                <CardContent>
                  <div className="text-4xl font-light text-purple-600 mb-2">{stat.number}</div>
                  <div className="text-gray-600">{stat.text}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

export default App;