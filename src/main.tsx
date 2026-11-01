import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary';
import './index.css';

// Safely guard DOM Node operations against external mutation (Google Translate, Chrome extensions, Three.js unmounts)
if (typeof Node !== 'undefined' && Node.prototype) {
  const originalRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    try {
      if (child && child.parentNode !== this) {
        if (child.parentNode) {
          return originalRemoveChild.call(child.parentNode, child) as T;
        }
        return child;
      }
      return originalRemoveChild.call(this, child) as T;
    } catch (err) {
      // Gracefully prevent unhandled NotFoundError when node has already been removed or detached
      return child;
    }
  };

  const originalInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    try {
      if (referenceNode && referenceNode.parentNode !== this) {
        if (referenceNode.parentNode) {
          return originalInsertBefore.call(referenceNode.parentNode, newNode, referenceNode) as T;
        }
        return newNode;
      }
      return originalInsertBefore.call(this, newNode, referenceNode) as T;
    } catch (err) {
      return newNode;
    }
  };
}

// Safely suppress benign iframe noise (ResizeObserver loop, DOM translation removeChild, sandboxed ServiceWorker)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (e) => {
    if (
      e.message?.includes('ResizeObserver loop completed with undelivered notifications') ||
      e.message?.includes('ResizeObserver loop limit exceeded') ||
      e.message?.includes("Failed to execute 'removeChild' on 'Node'") ||
      e.message?.includes("Failed to execute 'insertBefore' on 'Node'") ||
      e.message?.includes('The node to be removed is not a child of this node')
    ) {
      e.stopImmediatePropagation();
      e.preventDefault();
      return true;
    }
  });

  window.addEventListener('unhandledrejection', (e) => {
    if (
      e.reason?.message?.includes('ResizeObserver') ||
      e.reason?.message?.includes('removeChild') ||
      e.reason?.message?.includes('The node to be removed is not a child of this node') ||
      e.reason?.message?.includes('The play() request was interrupted') ||
      e.reason?.name === 'AbortError' ||
      e.reason?.name === 'NotFoundError'
    ) {
      e.preventDefault();
    }
  });

  if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js', { scope: '/' }).catch(() => {
        // Gracefully handled for sandboxed/iframe preview contexts
      });
    });
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary fallbackTitle="Buzzing Brain Portal">
    <App />
  </ErrorBoundary>
);

