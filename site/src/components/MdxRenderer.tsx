import React, { useState, useEffect } from 'react';
import { contentImports } from '@/config/content-imports';
import StyledH1 from './ui/StyledH1';

interface MdxRendererProps {
  collectionId: string;
  fileName: string;
  className?: string;
}

const mdxComponents = {
  h1: StyledH1,
};

// Define a type for the MDX component that accepts a 'components' prop
type MdxComponentType = React.ComponentType<{ components?: Record<string, React.ElementType> }>;

export const MdxRenderer: React.FC<MdxRendererProps> = ({ 
  collectionId, 
  fileName, 
  className = "prose max-w-none" 
}) => {
  const [MdxComponent, setMdxComponent] = useState<MdxComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMdxComponent = async () => {
      setLoading(true);
      try {
        const collection = contentImports[collectionId];
        if (!collection) {
          throw new Error(`Ukendt samling: ${collectionId}`);
        }

        const moduleLoader = collection[fileName];
        if (!moduleLoader) {
          throw new Error(`Ukendt fil: ${fileName} i samling ${collectionId}`);
        }

        const module = await moduleLoader();
        setMdxComponent(() => module.default);
      } catch (err) {
        console.error('Fejl ved indlæsning af MDX-fil:', err);
        setMdxComponent(() => () => (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-yellow-800 font-semibold mb-2">Indhold ikke fundet</h3>
            <p className="text-yellow-700">
              MDX-filen <code>{fileName}</code> kunne ikke indlæses fra samlingen <code>{collectionId}</code>.
            </p>
            <p className="text-yellow-600 text-sm mt-2">
              Fejl: {err instanceof Error ? err.message : 'Ukendt fejl'}
            </p>
            <details className="mt-2">
              <summary className="text-yellow-600 text-sm cursor-pointer">Debug info</summary>
              <pre className="text-xs mt-1 bg-yellow-100 p-2 rounded">
                Collection: {collectionId}{'\n'}
                File: {fileName}
              </pre>
            </details>
          </div>
        ));
      }
      setLoading(false);
    };

    loadMdxComponent();
  }, [collectionId, fileName]);

  if (loading) {
    return <div>Indlæser...</div>;
  }

  if (!MdxComponent) {
    return null;
  }

  return (
    <div className={className}>
      <MdxComponent components={mdxComponents} />
    </div>
  );
};