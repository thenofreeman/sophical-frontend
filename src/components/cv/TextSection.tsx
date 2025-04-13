
interface TextSectionProps {
  content: string;
}

export default function TextSection({ content }: TextSectionProps): React.ReactElement {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-semibold mb-4 text-left border-b border-gray-200 pb-1">Overview</h2>
      <p className="text-gray-800">{content}</p>
    </section>
  );
}
