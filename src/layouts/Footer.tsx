import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="py-16 px-6 md:px-12 lg:px-24 bg-couro-black border-t border-couro-gold/10 z-10 relative text-couro-ivory/40 text-xs">
      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="font-serif text-lg tracking-[0.15em] text-couro-gold font-semibold">COURO RICO</span>
        <p>© 2026 COURO RICO. Todos os direitos reservados.</p>
        <div className="flex gap-6 uppercase tracking-widest text-[10px] text-couro-ivory/60 font-semibold font-mono">
          <Link to="/termos" className="hover:text-couro-gold transition-colors duration-300">Termos</Link>
          <Link to="/privacidade" className="hover:text-couro-gold transition-colors duration-300">Privacidade</Link>
        </div>
      </div>
    </footer>
  );
}
