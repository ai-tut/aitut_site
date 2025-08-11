import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { collections, modules } from './config/runtime';
import { MdxRenderer } from './components/MdxRenderer';
import { Button } from "@/components/ui/button";

// Komponent til at vise en specifik side fra en samling
const CollectionPage: React.FC = () => {
  const { collectionId, pageSlug } = useParams<{ collectionId: string; pageSlug: string }>();
  
  const collection = collections.find(c => c.id === collectionId);
  const page = collection?.pages?.find(p => p.slug === pageSlug);
  
  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Samling ikke fundet</h2>
          <p className="text-red-700">Samlingen "{collectionId}" kunne ikke findes.</p>
          <Link to="/" className="text-red-600 hover:text-red-800 underline mt-2 inline-block">
            ← Tilbage til forsiden
          </Link>
        </div>
      </div>
    );
  }
  
  if (!page) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h2 className="text-yellow-800 text-xl font-semibold mb-2">Side ikke fundet</h2>
          <p className="text-yellow-700">Siden "{pageSlug}" kunne ikke findes i samlingen "{collection.tocData?.title || collectionId}".</p>
          <Link to={`/${collectionId}`} className="text-yellow-600 hover:text-yellow-800 underline mt-2 inline-block">
            ← Tilbage til samlingen
          </Link>
        </div>
      </div>
    );
  }

  // Find den korrekte fil fra TOC-data (SSoT)
  const tocChapter = collection.tocData?.chapters?.find(ch => 
    ch.id === pageSlug
  );
  
  // Brug filnavnet fra TOC som SSoT
  const fileName = tocChapter?.file || `${pageSlug}.mdx`;

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
          Hjem
        </Link>
        <span className="mx-2 text-gray-500">›</span>
        <Link to={`/${collectionId}`} className="text-blue-600 hover:text-blue-800 underline">
          {collection.tocData?.title || collectionId}
        </Link>
        <span className="mx-2 text-gray-500">›</span>
        <span className="text-gray-700">{page.title}</span>
      </nav>
      
      <article className="max-w-4xl">
        <MdxRenderer 
          collectionId={collectionId!} 
          fileName={fileName} 
          className="prose prose-lg max-w-none"
        />
      </article>
    </div>
  );
};

// Komponent til at vise indholdsfortegnelsen for en samling
const CollectionToc: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  
  const collection = collections.find(c => c.id === collectionId);
  
  if (!collection) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h2 className="text-red-800 text-xl font-semibold mb-2">Samling ikke fundet</h2>
          <p className="text-red-700">Samlingen "{collectionId}" kunne ikke findes.</p>
          <Link to="/" className="text-red-600 hover:text-red-800 underline mt-2 inline-block">
            ← Tilbage til forsiden
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <nav className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
          Hjem
        </Link>
        <span className="mx-2 text-gray-500">›</span>
        <span className="text-gray-700">{collection.tocData?.title || collectionId}</span>
      </nav>
      
      <div className="max-w-4xl">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {collection.tocData?.title || collection.id}
          </h1>
          {collection.tocData?.description && (
            <p className="text-xl text-gray-600 mb-4">{collection.tocData.description}</p>
          )}
          {collection.tocData?.author && (
            <p className="text-gray-500">Af {collection.tocData.author}</p>
          )}
          {collection.tocData?.version && (
            <p className="text-sm text-gray-400">Version {collection.tocData.version}</p>
          )}
        </header>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Indholdsfortegnelse</h2>
            
            {collection.pages && collection.pages.length > 0 ? (
              <div className="space-y-4">
                {collection.pages.map((page, index) => (
                  <div key={page.slug} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-medium text-gray-900 mb-1">
                          <Link 
                            to={`/${collectionId}/${page.slug}`}
                            className="hover:text-blue-600 transition-colors"
                          >
                            {index + 1}. {page.title}
                          </Link>
                        </h3>
                        {page.description && (
                          <p className="text-gray-600 text-sm">{page.description}</p>
                        )}
                      </div>
                      <Link 
                        to={`/${collectionId}/${page.slug}`}
                        className="ml-4 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                      >
                        Læs
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">Ingen sider fundet i denne samling.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  // Hvis 'collections' er tom, er der noget galt med build-processen.
  if (!collections || collections.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Service Utilgængelig</h1>
          <p className="text-slate-500">
            Indholdet kunne ikke indlæses korrekt. Tjek venligst konfigurationen.
          </p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Indlæser...</div>}>
          <Routes>
            {/* Individuelle sider */}
            <Route path="/:collectionId/:pageSlug" element={<CollectionPage />} />
            
            {/* Samlings-TOC */}
            <Route path="/:collectionId" element={<CollectionToc />} />
            
            {/* Forside */}
            <Route 
              path="/" 
              element={
                <div className="container mx-auto px-4 py-8">
                  <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                      MFP Jamstack Orkestrator
                    </h1>
                    <p className="text-xl text-gray-600">
                      Velkommen til den digitale bogsamling
                    </p>
                  </div>

                  <div className="grid gap-8 md:grid-cols-2">
                    {/* Samlinger sektion */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Indholdssamlinger</h2>
                      
                      {collections && collections.length > 0 ? (
                        <div className="space-y-4">
                          {collections.map((collection) => (
                            <div key={collection.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    {collection.tocData?.title || collection.id}
                                  </h3>
                                  {collection.tocData?.description && (
                                    <p className="text-gray-600 text-sm mb-2">{collection.tocData.description}</p>
                                  )}
                                  {collection.tocData?.author && (
                                    <p className="text-gray-500 text-xs">Af {collection.tocData.author}</p>
                                  )}
                                </div>
                                <Link to={`/${collection.id}`}>
                                  <Button variant="outline" size="sm">
                                    Åbn
                                  </Button>
                                </Link>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Ingen samlinger konfigureret endnu</p>
                      )}
                    </div>

                    {/* Moduler sektion */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h2 className="text-2xl font-semibold text-gray-900 mb-6">Tilgængelige Moduler</h2>
                      
                      {modules && modules.length > 0 ? (
                        <ul className="space-y-3">
                          {modules.map((module) => (
                            <li key={module.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div>
                                <span className="font-medium text-gray-900">{module.name}</span>
                                <span className="text-sm text-gray-500 ml-2">{module.entry}</span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">Ingen moduler konfigureret endnu</p>
                      )}
                    </div>
                  </div>
                </div>
              } 
            />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
