/**
 * Production-ready Structured Logger for Buzzing Brain
 * Ensures clean formatting and avoids console clutter in production.
 */

type LogLevel = 'DEBUG' | 'INFO' | 'WARN' | 'ERROR';

interface LogContext {
  [key: string]: unknown;
}

class ProductionLogger {
  private isDebugEnabled(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return window.localStorage?.getItem('bb_debug') === 'true' || window.location.search.includes('debug=true');
    } catch (_) {
      return false;
    }
  }

  private formatMessage(level: LogLevel, namespace: string, message: string, context?: LogContext): string {
    const timestamp = new Date().toISOString();
    const contextStr = context ? ` | ${JSON.stringify(context)}` : '';
    return `[${timestamp}] [${level}] [${namespace}]: ${message}${contextStr}`;
  }

  debug(namespace: string, message: string, context?: LogContext) {
    if (this.isDebugEnabled()) {
      console.debug(this.formatMessage('DEBUG', namespace, message, context));
    }
  }

  info(namespace: string, message: string, context?: LogContext) {
    if (this.isDebugEnabled()) {
      console.info(this.formatMessage('INFO', namespace, message, context));
    }
  }

  warn(namespace: string, message: string, context?: unknown) {
    if (this.isDebugEnabled()) {
      const contextObj = context instanceof Error ? { error: context.message } : (context as LogContext);
      console.warn(this.formatMessage('WARN', namespace, message, contextObj));
    }
  }

  error(namespace: string, message: string, error?: unknown, context?: LogContext) {
    // Only log unexpected critical errors
    if (this.isDebugEnabled()) {
      const errorDetails = error instanceof Error 
        ? { name: error.name, message: error.message, stack: error.stack?.split('\n').slice(0, 3).join('\n') }
        : error;
      console.error(this.formatMessage('ERROR', namespace, message, { ...context, error: errorDetails }));
    }
  }
}

export const logger = new ProductionLogger();
