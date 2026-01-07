export default function Footer() {
  return (
    <footer className="bg-gray-950 border-t border-cyan-500/20 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img 
              src="https://public.readdy.ai/ai/img_res/7bf25753-0c8f-47ee-b845-4accd2087fb2.png" 
              alt="Escape Room Logo" 
              className="h-8 w-8 object-contain"
            />
            <span className="text-sm text-gray-400">© 2024 Escape Room. All rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6">
            <a href="https://readdy.ai/?ref=logo" target="_blank" rel="noopener noreferrer" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap">
              Made with Readdy
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap">
              이용약관
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer whitespace-nowrap">
              개인정보처리방침
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
