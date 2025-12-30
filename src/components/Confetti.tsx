interface Props {
  trigger: boolean;
}

export function Confetti({ trigger }: Props) {
  if (!trigger) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="confetti-container">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="confetti-piece"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#FFD700'][Math.floor(Math.random() * 6)],
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>
    </div>
  );
}