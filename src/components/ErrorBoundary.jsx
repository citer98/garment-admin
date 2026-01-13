// ErrorBoundary.jsx
import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-red-100">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-red-100 rounded-xl mr-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">⚠️ Terjadi Kesalahan</h2>
                <p className="text-gray-600">Sistem mengalami masalah teknis</p>
              </div>
            </div>

            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium mb-2">Detail Kesalahan:</p>
              <code className="text-sm text-red-700 bg-red-100 p-2 rounded block overflow-x-auto">
                {this.state.error?.toString()}
              </code>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-5 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Muat Ulang Halaman
              </button>
              
              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex-1"
              >
                <Home className="w-4 h-4 mr-2" />
                Kembali ke Halaman Utama
              </button>

              <button 
                onClick={this.handleReset}
                className="flex items-center justify-center px-5 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex-1"
              >
                Coba Lagi
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6 text-center">
              Jika masalah berlanjut, hubungi administrator sistem.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;