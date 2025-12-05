import { Link } from 'react-router-dom';
import { 
  HeartPulse, 
  Calendar, 
  Users, 
  MapPin, 
  Stethoscope, 
  FileText,
  Activity,
  Phone,
  MessageCircle,
  MoreHorizontal,
  ChevronRight,
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  ExternalLink
} from 'lucide-react';
import HospitalBuilding from '../components/HospitalBuilding';
import HeartPlusLogo from '../components/HeartPlusLogo';
import DepartmentCard from '../components/DepartmentCard';
import { departments } from '../data/departments';

const Home = () => {
  const services = [
    {
      icon: <Calendar className="w-12 h-12" />,
      title: 'Book Appointment',
      link: '/register'
    },
    {
      icon: <Stethoscope className="w-12 h-12" />,
      title: 'Our Specialities',
      link: '/register'
    },
    {
      icon: <MapPin className="w-12 h-12" />,
      title: 'Our Locations',
      link: '/register'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Our Doctors',
      link: '/register'
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'View Medical Records',
      link: '/login'
    },
    {
      icon: <Activity className="w-12 h-12" />,
      title: 'Free Second Opinion',
      link: '/register'
    },
    {
      icon: <HeartPulse className="w-12 h-12" />,
      title: 'Health Checkup',
      link: '/register'
    },
    {
      icon: <Users className="w-12 h-12" />,
      title: 'Patient Care',
      link: '/register'
    },
    {
      icon: <FileText className="w-12 h-12" />,
      title: 'Lab Reports',
      link: '/login'
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Top Navigation */}
      <nav className="bg-white shadow-sm sticky top-0 z-50 animate-slideInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              {/* Heart + Logo */}
              <HeartPlusLogo className="w-12 h-12 animate-pulse" color="#6366F1" />
              <div>
                <div className="text-2xl font-bold text-indigo-700 leading-tight">
                  CHIKITSAMITRA
                </div>
                <div className="text-xs text-indigo-500 tracking-wider">HOSPITALS</div>
              </div>
            </div>
            <div className="flex items-center space-x-6">
              <a 
                href="tel:+918328075915"
                className="text-gray-600 hover:text-indigo-500 transition-colors"
                title="Call us: +91 8328075915"
              >
                <Phone className="w-5 h-5" />
              </a>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-500 transition-colors font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-6 py-2 rounded-full transition-colors font-medium shadow-md"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Hospital Building */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-50 via-white to-indigo-50/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left side - Text */}
            <div className="animate-slideInLeft">
              <h1 className="text-4xl md:text-6xl font-bold text-indigo-700 mb-6 leading-tight">
                Your Health is Our Priority
              </h1>
              <p className="text-xl text-gray-600 mb-4 leading-relaxed">
                Trusted care, compassionate hearts, healing hands
              </p>
              <p className="text-lg text-gray-500 mb-8 italic">
                "Where your wellness journey begins with excellence"
              </p>
              
              <div className="flex items-center space-x-4">
                <Link
                  to="/register"
                  className="bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  Get Started
                </Link>
                <Link
                  to="/login"
                  className="border-2 border-indigo-500 text-indigo-600 hover:bg-indigo-50 px-8 py-3 rounded-full font-semibold transition-all duration-300"
                >
                  Login
                </Link>
              </div>
            </div>

            {/* Right side - Animated Hospital Building */}
            <div className="animate-slideInRight delay-200">
              <HospitalBuilding />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Link
                key={index}
                to={service.link}
                className="group bg-white border-2 border-indigo-100 rounded-2xl p-8 hover:border-indigo-400 hover:shadow-xl hover:bg-indigo-50/30 transition-all duration-300 animate-slideInUp"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="text-indigo-400 group-hover:text-indigo-500 transform group-hover:scale-110 transition-all duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-medium text-indigo-700 group-hover:text-indigo-500 transition-colors">
                    {service.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 animate-fadeIn">
            <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-4">
              Our Specialities
            </h2>
            <p className="text-lg text-gray-600">
              Explore our world-class departments and find the right specialist for you
            </p>
          </div>

          {/* Departments Carousel */}
          <div className="relative">
            {/* Horizontal Scrollable Container */}
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
              {departments.map((department, index) => (
                <div
                  key={department.id}
                  className="snap-start"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <DepartmentCard department={department} />
                </div>
              ))}
            </div>

            {/* View All Button */}
            <div className="text-center mt-8">
              <Link
                to="/departments"
                className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                <span>View All Specialities</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fadeIn">
          <h2 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-6">
            About ChikitsaMitra
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            ChikitsaMitra has been providing quality healthcare for people in their diverse medical needs. 
            People trust us because of the strong relationships we've built with them over the years.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Under astute leadership and strong management, ChikitsaMitra has evolved as a centre of 
            excellence in medicine providing the highest quality standards of medical treatment to all sections 
            of the society. Our work has always been guided by the needs of patients and delivered by our 
            perfectly combined revolutionary technology, best medical expertise and advanced procedures.
          </p>
          <Link
            to="/register"
            className="inline-block bg-indigo-500 hover:bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Get Started Today
          </Link>
        </div>
      </section>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-2xl z-50 animate-slideInUp">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-5 gap-2 py-3">
            <Link
              to="/register"
              className="flex flex-col items-center justify-center space-y-1 hover:bg-indigo-600 rounded-lg p-2 transition-colors group"
            >
              <Calendar className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Appointment</span>
            </Link>
            <Link
              to="/register"
              className="flex flex-col items-center justify-center space-y-1 hover:bg-indigo-600 rounded-lg p-2 transition-colors group"
            >
              <Activity className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Second Opinion</span>
            </Link>
            <a
              href="https://wa.me/917013852533"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center space-y-1 hover:bg-indigo-600 rounded-lg p-2 transition-colors group"
              title="WhatsApp: +91 7013852533"
            >
              <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">WhatsApp</span>
            </a>
            <a
              href="tel:+917013852533"
              className="flex flex-col items-center justify-center space-y-1 hover:bg-indigo-600 rounded-lg p-2 transition-colors group"
              title="Call: +91 7013852533"
            >
              <Phone className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">Call</span>
            </a>
            <Link
              to="/register"
              className="flex flex-col items-center justify-center space-y-1 hover:bg-indigo-600 rounded-lg p-2 transition-colors group"
            >
              <MoreHorizontal className="w-6 h-6 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-medium">More</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Spacer for bottom nav */}
      <div className="h-20"></div>

      {/* Professional Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-indigo-900 to-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
            {/* Column 1: About */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <HeartPlusLogo className="w-10 h-10" color="#818CF8" />
                <span className="text-2xl font-bold">ChikitsaMitra</span>
              </div>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your trusted healthcare partner providing world-class medical services with compassion and excellence.
              </p>
              <div className="flex space-x-4">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-400 transition-colors">
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Column 2: Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-300">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/departments" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Our Specialities
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Book Appointment
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Patient Portal
                  </Link>
                </li>
                <li>
                  <Link to="/staff-login" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Staff Login
                  </Link>
                </li>
                <li>
                  <Link to="/inventory-login" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Inventory Manager
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Legal & Contact */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-300">Legal & Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/contact" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <ChevronRight className="w-4 h-4 mr-1" /> Terms & Conditions
                  </Link>
                </li>
                <li>
                  <a href="mailto:info@chikitsamitra.com" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center">
                    <Mail className="w-4 h-4 mr-2" /> info@chikitsamitra.com
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Contact & Location */}
            <div>
              <h3 className="text-lg font-semibold mb-4 text-indigo-300">Contact Us</h3>
              <ul className="space-y-3">
                <li className="flex items-start space-x-2">
                  <Phone className="w-4 h-4 mt-1 text-indigo-400" />
                  <div>
                    <a href="tel:+918328075915" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm block">
                      +91 8328075915
                    </a>
                    <a href="tel:+917013852533" className="text-gray-300 hover:text-indigo-400 transition-colors text-sm block">
                      +91 7013852533
                    </a>
                  </div>
                </li>
                <li className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-1 text-indigo-400" />
                  <div>
                    <a 
                      href="https://maps.app.goo.gl/d3z3mg6uqnDxB2ud6"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-300 hover:text-indigo-400 transition-colors text-sm flex items-center"
                    >
                      View on Google Maps
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                    <p className="text-gray-400 text-xs mt-1">
                      ChikitsaMitra Hospitals<br />
                      Hyderabad, Telangana
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="border-t border-gray-700 mt-8 pt-6">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <div className="text-gray-400 text-sm text-center md:text-left">
                © 2025 ChikitsaMitra Hospitals. All rights reserved.
              </div>
              <div className="flex items-center space-x-4 text-xs text-gray-400">
                <span>Made with ❤️ for better healthcare</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
