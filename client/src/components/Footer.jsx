const Footer = () => {
    return (
      <footer className="bg-gray-900 text-white mt-12">
        <div className="container mx-auto px-6 py-10">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {/* About Section */}
            <div>
              <h2 className="text-lg font-semibold mb-4">About HypeBooks</h2>
              <p className="text-sm text-gray-400">
                HypeBooks is your trusted platform for managing your library effortlessly. Access, organize, and explore a wide range of books anytime.
              </p>
            </div>
  
            {/* Quick Links */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Quick Links</h2>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-gray-300">Home</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">Explore</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">Library</a>
                </li>
                <li>
                  <a href="#" className="hover:text-gray-300">Contact</a>
                </li>
              </ul>
            </div>
  
            {/* Contact Information */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Contact Us</h2>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>📍 Kigali, Rwanda</li>
                <li>📞 +250 788 123 456</li>
                <li>✉️ <a href="mailto:codewithsamniyo@gmail.com" className="hover:text-gray-300">shoppingrw1a@gmail.com</a></li>
              </ul>
            </div>
  
            {/* Social Media */}
            <div>
              <h2 className="text-lg font-semibold mb-4">Follow Us</h2>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-gray-300 text-xl">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 text-xl">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 text-xl">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-gray-300 text-xl">
                  <i className="fab fa-linkedin"></i>
                </a>
              </div>
            </div>
          </div>
  
          {/* Footer Bottom */}
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-sm text-gray-400">
            <p>&copy; {new Date().getFullYear()} HypeBooks. All rights reserved.</p>
          </div>
        </div>
      </footer>
    );
  };
  
  export default Footer;
  