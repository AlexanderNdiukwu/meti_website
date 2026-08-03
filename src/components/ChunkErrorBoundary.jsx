// FILE: ChunkErrorBoundary.jsx
// Place at: src/components/ChunkErrorBoundary.jsx
import { Component } from 'react';

// A stale chunk error only ever needs ONE reload to fix itself (the
// browser fetches the current index.html + current chunk hashes fresh).
// This flag stops an infinite reload loop if something else is genuinely
// broken and reload doesn't help.
const RELOAD_FLAG = 'meti-chunk-reload';

export default class ChunkErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    const isChunkError = /Failed to fetch dynamically imported module|Loading chunk .* failed|dynamically imported module/i.test(
      error?.message || ''
    );
    if (isChunkError && !sessionStorage.getItem(RELOAD_FLAG)) {
      sessionStorage.setItem(RELOAD_FLAG, '1');
      window.location.reload();
    }
  }

  render() {
    if (this.state.hasError) {
      // Shown for the split-second before the auto-reload kicks in —
      // never the raw error screen.
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-sm text-gray-400 font-semibold">Loading the latest version…</p>
        </div>
      );
    }
    return this.props.children;
  }
}