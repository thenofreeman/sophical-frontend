import { ExternalLink } from 'lucide-react';
import { ItemWithTags } from '../../types/cv'

interface TimelineSectionProps {
  title: string;
  items: ItemWithTags[];
}

export default function TimelineSection({ title, items }: TimelineSectionProps): React.ReactElement {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-6 text-left border-b border-gray-200 pb-1">{title}</h2>

      {items.map((item, index) => (
        <div className="mb-8 flex" key={index}>
          <div className="w-1/5 pr-6 text-left text-gray-500 pt-1">
            {item.period || item.category}
          </div>
          <div className="w-4/5">
            {item.title && <h3 className="font-medium text-lg">{item.title}</h3>}
            {item.description && <p className="text-gray-700 my-2">{item.description}</p>}
            {item.link && (
              <div className="flex items-center gap-2 mt-1 text-gray-800">
                <ExternalLink size={16} />
                <a href={item.link.url} className="underline hover:no-underline">{item.link.text}</a>
              </div>
            )}
            {item.tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {item.tags.map((tag, i) => (
                  <span key={i} className="bg-gray-100 px-2 py-1 text-sm rounded-md">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}
    </section>
  );
}
