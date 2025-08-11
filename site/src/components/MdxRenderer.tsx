import React, { useState, useEffect } from 'react';
import { contentImports } from '@/config/content-imports';
import StyledH1 from './ui/StyledH1';
import Callout from './ui/Callout';

import { Input } from './ui/input';

interface MdxRendererProps {
  collectionId: string;
  fileName: string;
  className?: string;
}

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
    const loadMdx = async () => {
      try {
        const collection = contentImports[collectionId];
        if (!collection) {
          throw new Error(`Content collection "${collectionId}" not found.`);
        }

        const importFn = collection[fileName];
        if (!importFn) {
          throw new Error(`File "${fileName}" not found in collection "${collectionId}".`);
        }

        const mdxModule = await importFn();
        setMdxComponent(() => mdxModule.default);
      } catch (error) {
        console.error("Error loading MDX file:", error);
      } finally {
        setLoading(false);
      }
    };

    loadMdx();
  }, [collectionId, fileName]);

  const mdxComponents = {
    h1: StyledH1,
    Callout: Callout,
    Input: Input,
  };

  if (loading) {
    return <div>Indlæser...</div>;
  }

  if (!MdxComponent) {
    return <div>Error: Kunne ikke indlæse indhold.</div>;
  }

  return (
    <div className={className}>
      <MdxComponent components={mdxComponents} />
    </div>
  );
};

export default MdxRenderer;