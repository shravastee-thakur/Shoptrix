const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col items-center justify-center">
            <div className="text-4xl font-bold tracking-tight">Shoptrix</div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Get to Know Us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  About Shoptrix
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Careers
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Press Releases
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4"> Connect with us</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Facebook
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Twitter
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Instagram
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Let Us Help You</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Your Account
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Returns Centre
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  Recalls and Product Safety Alerts
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300 transition-colors">
                  100% Purchase Protection
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 py-4 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} Shravastee Thakur
        </div>
      </div>
    </footer>
  );
};

export default Footer;
