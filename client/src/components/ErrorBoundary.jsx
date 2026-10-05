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

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          backgroundColor: '#faf9f6',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#17221f',
          textAlign: 'center'
        }}>
          <div style={{
            maxWidth: '420px',
            width: '100%',
            backgroundColor: '#ffffff',
            border: '1px solid #e7e4dc',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#fdf2f2',
              color: '#9b1c1c',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              !
            </div>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', margin: '0 0 8px', color: '#0e3d34' }}>
              Something went wrong
            </h2>
            <p style={{ fontSize: '13px', color: '#687570', margin: '0 0 16px', lineHeight: '1.5' }}>
              An unexpected error occurred while loading this page.
            </p>
            <div style={{
              backgroundColor: '#f8f7f4',
              borderRadius: '8px',
              padding: '12px',
              fontSize: '11px',
              fontFamily: 'monospace',
              color: '#9b1c1c',
              textAlign: 'left',
              overflowX: 'auto',
              marginBottom: '16px',
              maxHeight: '120px'
            }}>
              {this.state.error?.message || String(this.state.error)}
            </div>
            <button
              onClick={() => window.location.reload()}
              style={{
                width: '100%',
                padding: '10px 16px',
                backgroundColor: '#0e3d34',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
