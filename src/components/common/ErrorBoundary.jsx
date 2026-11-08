import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error, info) {
        // Keep the console useful during development without exposing internals in the UI.
        console.error('Unhandled UI error:', error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="flex min-h-screen items-center justify-center bg-bg-soft px-6">
                    <div className="max-w-md rounded-2xl border border-border bg-bg-main p-8 text-center shadow-card">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-950/40">
                            <AlertTriangle size={22} aria-hidden="true" />
                        </div>
                        <h1 className="mt-4 font-display text-xl font-bold">Une erreur est survenue</h1>
                        <p className="mt-2 text-sm text-text-soft">
                            L’interface n’a pas pu s’afficher correctement. Rechargez la page pour réessayer.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="btn btn-primary mt-6 w-full"
                        >
                            <RotateCcw size={16} aria-hidden="true" />
                            Recharger la page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
