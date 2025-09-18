import React from 'react';
import { toast } from 'react-toastify';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    toast.error("An unexpected error occurred.");
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-base text-text p-6 text-center space-y-4">
          <h2 className="text-accent text-xl font-semibold">Something went wrong.</h2>
          <p className="text-muted">Please refresh the page or try again later.</p>
          <button
            onClick={this.handleReload}
            className="bg-accent text-white px-4 py-2 rounded-md hover:opacity-90 transition"
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
