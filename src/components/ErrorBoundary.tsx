import React from 'react';

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null; errorInfo: React.ErrorInfo | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("React Crash:", error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', background: '#000', color: '#ff4444', minHeight: '100vh', fontFamily: 'monospace' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚠️ App Crashed!</h1>
          <p>Please send this screenshot to the developer:</p>
          <pre style={{ background: '#222', padding: '1rem', overflow: 'auto', marginTop: '1rem' }}>
            {this.state.error?.toString()}
          </pre>
          <pre style={{ background: '#222', padding: '1rem', overflow: 'auto', marginTop: '1rem', fontSize: '10px' }}>
            {this.state.errorInfo?.componentStack}
          </pre>
          {(window as any).LAST_CRASH && (
            <div style={{ marginTop: '2rem', border: '1px dashed #444', padding: '1rem' }}>
              <h3 style={{ color: '#888', fontSize: '0.8rem' }}>Detalhes do Crash Global:</h3>
              <pre style={{ fontSize: '9px', color: '#666' }}>
                {JSON.stringify((window as any).LAST_CRASH, null, 2)}
              </pre>
            </div>
          )}

          <button 
            onClick={() => window.location.reload()} 
            style={{ marginTop: '2rem', padding: '0.5rem 1rem', background: '#fff', color: '#000', cursor: 'pointer', marginRight: '1rem', fontWeight: 'bold' }}
          >
            🔄 Recarregar Página
          </button>
          <button 
            onClick={() => {
              if (window.caches) {
                caches.keys().then(names => {
                  for (let name of names) caches.delete(name);
                });
              }
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = window.location.origin + '?clear_cache=' + Date.now();
            }} 
            style={{ marginTop: '2rem', padding: '0.5rem 1rem', background: '#ff4444', color: '#fff', cursor: 'pointer', border: 'none', fontWeight: 'bold' }}
          >
            🧹 Limpar Cache e Forçar Atualização
          </button>
          <p style={{ marginTop: '2rem', fontSize: '12px', color: '#666' }}>
            ID do Build Atual: {import.meta.env.MODE} | URL: {window.location.pathname}
          </p>

        </div>
      );
    }

    return this.props.children;
  }
}
