import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    try {
      localStorage.removeItem('cheburoom_active_order');
    } catch {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0E0E14] text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center text-2xl font-black mb-4">
            ⚠️
          </div>
          <h1 className="text-xl font-bold font-display mb-2">
            Виникла незначна помилка відображення
          </h1>
          <p className="text-xs text-zinc-400 max-w-sm mb-6">
            Ми автоматично зберегли всі дані вашого замовлення. Натисніть кнопку нижче, щоб оновити інтерфейс.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-6 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-zinc-950 font-black text-xs cursor-pointer shadow-lg transition-all active:scale-95"
          >
            🔄 Оновити сторінку
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
