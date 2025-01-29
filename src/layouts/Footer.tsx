const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6 mt-12">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-start">
          {/* About Section */}
          <div className="text-lg space-y-2">
            <p className="font-semibold text-xl">About Adaa Jaipur</p>
            <p>
              Adaa Jaipur offers the finest selection of stylish and
              comfortable footwear, blending traditional craftsmanship with
              modern design. Our products are crafted with care to provide both
              elegance and durability, ensuring that you stand out with every
              step.
            </p>
          </div>

          {/* Contact Section */}
          <div className="text-lg space-y-2">
            <p className="font-semibold text-xl">Contact Us</p>
            <p>📍 Address: 123 Adaa Street, Jaipur, Rajasthan, India</p>
            <p>📞 Phone: +91 123 456 7890</p>
            <p>✉️ Email: contact@adaa.com</p>
          </div>

        </div>

        {/* Social Media Links */}
        <div className="mt-4 text-center">
          <p>&copy; {new Date().getFullYear()} Adaa Jaipur. All rights reserved.</p>
        </div>
        <div className="mt-4 flex justify-center space-x-6">
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-400">
            Facebook
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:text-pink-400">
            Instagram
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300">
            Twitter
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
