import React from 'react';
import { AuthModal } from './AuthModal';

interface AuthWallModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSignIn?: () => void;
  title?: string;
  description?: string;
  onOpenLegal?: (tab: 'terms' | 'privacy') => void;
  initialMode?: 'signin' | 'signup';
}

export const AuthWallModal: React.FC<AuthWallModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  onOpenLegal,
  initialMode = 'signin',
}) => {
  return (
    <AuthModal
      isOpen={isOpen}
      onClose={onClose}
      initialMode={initialMode}
      customTitle={title}
      customDescription={description}
      onOpenLegal={onOpenLegal}
    />
  );
};
