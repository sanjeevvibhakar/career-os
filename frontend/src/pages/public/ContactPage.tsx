import React from 'react';
import { Mail, ExternalLink, Briefcase } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';

export const ContactPage: React.FC = () => {
  return (
    <div className="py-20 px-4 max-w-7xl mx-auto w-full min-h-screen">
      <h1 className="text-4xl font-bold text-white mb-12">Contact</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Get in Touch</h2>
          <p className="text-[var(--text-secondary)] mb-8">
            I'm currently open for new opportunities. Whether you have a question or just want to say hi, I'll try my best to get back to you!
          </p>
          <div className="flex flex-col gap-4">
            <a href="mailto:contact@example.com" className="flex items-center gap-4 text-[var(--text-secondary)] hover:text-white transition-colors">
              <Mail size={24} /> contact@example.com
            </a>
            <a href="#" className="flex items-center gap-4 text-[var(--text-secondary)] hover:text-white transition-colors">
              <ExternalLink size={24} /> GitHub Profile
            </a>
            <a href="#" className="flex items-center gap-4 text-[var(--text-secondary)] hover:text-white transition-colors">
              <Briefcase size={24} /> LinkedIn Profile
            </a>
          </div>
        </div>

        <Card className="p-6">
          <form className="flex flex-col gap-4">
            <Input label="Name" placeholder="Your name" />
            <Input label="Email" type="email" placeholder="Your email address" />
            <Textarea label="Message" rows={5} placeholder="Your message..." />
            <Button className="w-full mt-4">Send Message</Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
