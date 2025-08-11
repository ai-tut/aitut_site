import React, { useState, useEffect } from 'react';

interface MdxRendererProps {
  collectionId: string;
  fileName: string;
  className?: string;
}

// Import alle MDX-filer statisk baseret på TOC.yml som SSoT
const mdxModules = {
  'lorem-ipsum-bog': {
    // Baseret på toc.yml file-felter
    '01-introduktion.mdx': () => import('../../../content/lorem-ipsum-bog/01-introduktion.mdx'),
    '02-klassisk-lorem.mdx': () => import('../../../content/lorem-ipsum-bog/02-klassisk-lorem.mdx'),
    '03-moderne-variationer.mdx': () => import('../../../content/lorem-ipsum-bog/03-moderne-variationer.mdx'),
    '04-teknisk-lorem.mdx': () => import('../../../content/lorem-ipsum-bog/04-teknisk-lorem.mdx'),
    '05-kreativ-lorem.mdx': () => import('../../../content/lorem-ipsum-bog/05-kreativ-lorem.mdx'),
    '06-konklusion.mdx': () => import('../../../content/lorem-ipsum-bog/06-konklusion.mdx'),
  }
};

export const MdxRenderer: React.FC<MdxRendererProps> = ({ 
  collectionId, 
  fileName, 
  className = "prose max-w-none" 
}) => {
  const [MdxComponent, setMdxComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMdxComponent = async () => {
      setLoading(true);
      
      try {
        // Tjek om samlingen og filen findes i vores statiske mapping
        const collection = mdxModules[collectionId as keyof typeof mdxModules];
        if (!collection) {
          throw new Error(`Ukendt samling: ${collectionId}`);
        }

        const moduleLoader = collection[fileName as keyof typeof collection];
        if (!moduleLoader) {
          throw new Error(`Ukendt fil: ${fileName} i samling ${collectionId}`);
        }

        // Indlæs MDX-modulet
        const module = await moduleLoader();
        setMdxComponent(() => module.default);
      } catch (err) {
        console.error('Fejl ved indlæsning af MDX-fil:', err);
        
        // Fallback komponent
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
                File: {fileName}{'\n'}
                Available collections: {Object.keys(mdxModules).join(', ')}{'\n'}
                Available files in collection: {collectionId in mdxModules ? Object.keys(mdxModules[collectionId as keyof typeof mdxModules]).join(', ') : 'N/A'}
              </pre>
            </details>
          </div>
        ));
      } finally {
        setLoading(false);
      }
    };

    loadMdxComponent();
  }, [collectionId, fileName]);

  if (loading) {
    return (
      <div className={className}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!MdxComponent) {
    return (
      <div className={className}>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h3 className="text-red-800 font-semibold mb-2">Indlæsningsfejl</h3>
          <p className="text-red-700">Komponenten kunne ikke indlæses.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <MdxComponent />
    </div>
  );
};