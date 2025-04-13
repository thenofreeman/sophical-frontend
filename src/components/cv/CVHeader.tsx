import { Github, Twitter, Linkedin, Mail, ExternalLink } from 'lucide-react';

interface SocialIconProps {
  name: string;
  size?: number;
}

const SocialIcon: React.FC<SocialIconProps> = ({ name, size = 20 }) => {
  switch (name) {
    case 'github':
      return <Github size={size} />;
    case 'twitter':
      return <Twitter size={size} />;
    case 'linkedin':
      return <Linkedin size={size} />;
    case 'mail':
      return <Mail size={size} />;
    default:
      return <ExternalLink size={size} />;
  }
};

interface SocialLink {
  icon: string;
  url: string;
  label: string;
}

interface HeaderSectionProps {
  name: string,
  bio: string,
  socialLinks?: SocialLink[]
};

export default function HeaderSection({ name, bio, socialLinks }: HeaderSectionProps): React.ReactElement {
  return (
    <header className="text-center mb-16">
      <h1 className="text-4xl font-bold mb-2">{name}</h1>
      <p className="text-lg mb-6 text-gray-700">{bio}</p>
      {socialLinks &&
        <div className="flex justify-center space-x-4">
          {socialLinks.map((link, index) => (
            <a
              key={index}
              href={link.url}
              className="hover:opacity-70 transition-opacity"
              aria-label={link.label}
            >
              <SocialIcon name={link.icon} />
            </a>
          ))}
        </div>
      }
    </header>
  );
}
