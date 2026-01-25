// ErrorBoundary.jsx
import React, { Component } from 'react';
import { AlertTriangle, RefreshCw, Home, ArrowLeft } from 'lucide-react';

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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
          <div className="max-w-lg w-full bg-white rounded-xl sm:rounded-2xl shadow-lg sm:shadow-xl p-4 sm:p-6 md:p-8 border border-red-100">
            {/* Header */}
            <div className="flex items-start mb-4 sm:mb-6">
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg sm:rounded-xl mr-3 sm:mr-4 flex-shrink-0">
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-red-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-1">
                  ⚠️ Terjadi Kesalahan
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  Sistem mengalami masalah teknis
                </p>
              </div>
            </div>

            {/* Error Details */}
            <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 font-medium mb-2 text-sm sm:text-base">
                Detail Kesalahan:
              </p>
              <code className="text-xs sm:text-sm text-red-700 bg-red-100 p-2 sm:p-3 rounded block overflow-x-auto whitespace-pre-wrap break-words">
                {this.state.error?.toString()}
              </code>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <button 
                onClick={() => window.location.reload()}
                className="flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors flex-1 text-sm sm:text-base"
              >
                <RefreshCw className="w-4 h-4 mr-2 flex-shrink-0" />
                Muat Ulang
              </button>
              
              <button 
                onClick={() => window.history.back()}
                className="flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex-1 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4 mr-2 flex-shrink-0" />
                Kembali
              </button>

              <button 
                onClick={() => window.location.href = '/'}
                className="flex items-center justify-center px-4 py-2.5 sm:px-5 sm:py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors flex-1 text-sm sm:text-base"
              >
                <Home className="w-4 h-4 mr-2 flex-shrink-0" />
                Beranda
              </button>
            </div>

            {/* Try Again Button */}
            <button 
              onClick={this.handleReset}
              className="w-full mt-3 px-4 py-2.5 border-2 border-blue-600 text-blue-600 font-medium rounded-lg hover:bg-blue-50 transition-colors text-sm sm:text-base"
            >
              Coba Lagi
            </button>

            {/* Footer */}
            <p className="text-xs text-gray-500 mt-4 sm:mt-6 text-center leading-relaxed">
              Jika masalah berlanjut, hubungi administrator sistem.
              <br className="sm:hidden" />
              <span className="hidden sm:inline"> </span>
              Email: support@garmenttrackpro.com
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;