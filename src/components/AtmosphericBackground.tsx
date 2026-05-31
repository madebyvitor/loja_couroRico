/**
 * AtmosphericBackground
 * Blobs com blur extremo que flutuam lentamente em loop infinito,
 * simulando as luzes rebatidas de um estúdio fotográfico de luxo.
 * Posicionado em z-[-1], abaixo de todo conteúdo.
 *
 * Otimização: animações 100% CSS (@keyframes) — zero JavaScript no loop de render.
 */
export function AtmosphericBackground() {
  return (
    <>
      <style>{`
        @keyframes blob1 {
          0%,100% { transform: translate(0%, 0%); }
          33%      { transform: translate(12%, 10%); }
          66%      { transform: translate(4%, 18%); }
        }
        @keyframes blob2 {
          0%,100% { transform: translate(0%, 0%); }
          33%      { transform: translate(-15%, -12%); }
          66%      { transform: translate(-6%, -20%); }
        }
        @keyframes blob3 {
          0%,100% { transform: translate(-50%, -50%); }
          33%      { transform: translate(-42%, -58%); }
          66%      { transform: translate(-56%, -44%); }
        }
        .atm-blob {
          position: absolute;
          border-radius: 9999px;
          pointer-events: none;
          will-change: transform;
        }
      `}</style>

      <div
        className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        {/* Blob 1 — couro-brown, canto superior esquerdo */}
        <div
          className="atm-blob"
          style={{
            width: '45vw',
            height: '45vw',
            background: 'radial-gradient(circle, #2B1D16 0%, transparent 70%)',
            filter: 'blur(120px)',
            opacity: 0.18,
            top: '-10%',
            left: '-5%',
            animation: 'blob1 20s linear infinite',
          }}
        />

        {/* Blob 2 — couro-gold, canto inferior direito */}
        <div
          className="atm-blob"
          style={{
            width: '40vw',
            height: '40vw',
            background: 'radial-gradient(circle, #C8A96B 0%, transparent 70%)',
            filter: 'blur(140px)',
            opacity: 0.12,
            bottom: '-5%',
            right: '-10%',
            animation: 'blob2 17s linear infinite 3s',
          }}
        />

        {/* Blob 3 — couro-caramel, centro */}
        <div
          className="atm-blob"
          style={{
            width: '30vw',
            height: '30vw',
            background: 'radial-gradient(circle, #9A6A42 0%, transparent 70%)',
            filter: 'blur(160px)',
            opacity: 0.08,
            top: '35%',
            left: '35%',
            animation: 'blob3 15s linear infinite 7s',
          }}
        />
      </div>
    </>
  )
}

