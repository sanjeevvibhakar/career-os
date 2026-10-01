import React from 'react';
import { Card } from '../../components/ui/Card';

export const ProfileEditPage: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-col gap-8">
      <h1 className="text-3xl font-bold text-white">Edit Portfolio</h1>
      <Card className="p-6">
        <p className="text-[var(--text-secondary)]">Profile editor forms go here.</p>
      </Card>
    </div>
  );
};
