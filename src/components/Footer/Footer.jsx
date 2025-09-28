import { Link } from 'react-router-dom'
import Logo from '../Logo'

function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-12 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-500 p-2 rounded-lg">
                <Logo width="30px" />
              </div>
              <span className="text-xl font-bold text-yellow-400">MileSton</span>
            </div>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Share your stories and connect with readers. Join our community of writers and storytellers.
            </p>
            
            {/* Social links */}
            <div className="flex gap-3">
              <a href="#" className="bg-gray-800 hover:bg-blue-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                🐦
              </a>
              <a href="#" className="bg-gray-800 hover:bg-purple-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                💻
              </a>
              <a href="#" className="bg-gray-800 hover:bg-green-600 w-10 h-10 rounded-lg flex items-center justify-center transition-colors">
                💼
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Features</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Pricing</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Press Kit</Link></li>
            </ul>
          </div>

          {/* Support & Legal combined */}
          <div>
            <h3 className="font-semibold text-white mb-4">Support</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Help Center</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/" className="text-gray-300 hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 MileSton. All rights reserved by Rian.
          </p>
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <span>Made with</span>
            <span className="text-red-500">❤️</span>
            <span>for creators</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer