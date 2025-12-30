interface Props {
  isNewRecord: boolean;
  isBaseline: boolean;
}

export function FeedbackMessage({ isNewRecord, isBaseline }: Props) {
  if (isNewRecord) {
    return (
      <div className="mb-4 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg text-center animate-pulse">
        <p className="text-lg font-bold">🎉 ¡Récord superado! 🎉</p>
        <p className="text-sm">¡Has batido tu mejor marca personal!</p>
      </div>
    );
  }

  if (isBaseline) {
    return (
      <div className="mb-4 p-4 bg-blue-500 text-white rounded-lg text-center">
        <p className="text-lg font-bold">¡Línea base establecida!</p>
        <p className="text-sm">Tu mejor marca personal ha sido guardada</p>
      </div>
    );
  }

  return null;
}