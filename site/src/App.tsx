import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams } from 'react-router-dom';
import { collections, modules } from './config/runtime';
import { MdxRenderer } from './components/MdxRenderer';
import { Button } from './components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './components/ui/card';
import { Badge } from './components/ui/badge';
import type { CollectionConfig, PageConfig } from './types';

function CollectionPage({ collectionId, pageId }: { collectionId: string; pageId: string }) {
  const collection = collections.find(c => c.id === collectionId)
  
  if (!collection) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-destructive">Collection Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">The collection "{collectionId}" could not be found.</p>
          <Link to="/" className="text-primary hover:underline">
            ← Back to home
          </Link>
        </CardContent>
      </Card>
    )
  }

  const page = collection.pages && collection.pages.find(p => p.slug === pageId);
  const currentIndex = collection.pages ? collection.pages.findIndex(p => p.slug === pageId) : -1;

  const prevPage = currentIndex > 0 && collection.pages ? collection.pages[currentIndex - 1] : null;
  const nextPage = currentIndex < (collection.pages?.length || 0) - 1 && collection.pages ? collection.pages[currentIndex + 1] : null;
  if (!page) {
    return (
      <Card className="max-w-2xl mx-auto mt-8">
        <CardHeader>
          <CardTitle className="text-destructive">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            The page "{pageId}" could not be found in collection "{collection.tocData?.title || collectionId}".
          </p>
          <Link to={`/${collectionId}`} className="text-primary hover:underline">
            ← Back to collection
          </Link>
        </CardContent>
      </Card>
    )
  }

  // Find den korrekte fil fra TOC-data (SSoT)
  const tocChapter = collection.tocData?.chapters?.find(ch => 
    ch.id === pageId
  )
  
  // Brug filnavnet fra TOC som SSoT
  const fileName = tocChapter?.file || `${pageId}.mdx`

  return (
    <div className="max-w-4xl mx-auto">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="text-primary hover:underline">
          Home
        </Link>
        <span className="mx-2">›</span>
        <Link to={`/${collectionId}`} className="text-primary hover:underline">
          {collection.tocData?.title || collectionId}
        </Link>
        <span className="mx-2">›</span>
        <span>{page.title}</span>
      </nav>
      
      <article className="prose prose-slate dark:prose-invert max-w-none">
        <MdxRenderer 
          collectionId={collectionId} 
          fileName={fileName} 
        />
      </article>
      <div className="mt-8 flex justify-between">
        {prevPage ? (
          <Button asChild variant="outline">
            <Link to={`/${collectionId}/${prevPage.slug}`}>← {prevPage.title}</Link>
          </Button>
        ) : <div />} 
        {nextPage && (
          <Button asChild variant="outline">
            <Link to={`/${collectionId}/${nextPage.slug}`}>{nextPage.title} →</Link>
          </Button>
        )}
      </div>
    </div>
  )
}

function CollectionToc({ collection }: { collection: CollectionConfig }) {
  return (
    <div className="max-w-4xl mx-auto">
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="text-primary hover:underline">
          Home
        </Link>
        <span className="mx-2">›</span>
        <span>{collection.tocData?.title || collection.id}</span>
      </nav>
      
      <div>
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {collection.tocData?.title || collection.id}
          </h1>
          {collection.tocData?.description && (
            <p className="text-xl text-muted-foreground mb-4">{collection.tocData.description}</p>
          )}
          {collection.tocData?.author && (
            <p className="text-muted-foreground">By {collection.tocData.author}</p>
          )}
          {collection.tocData?.version && (
            <Badge variant="secondary" className="mt-2">Version {collection.tocData.version}</Badge>
          )}
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Table of Contents</CardTitle>
          </CardHeader>
          <CardContent>
            {collection.pages && collection.pages.length > 0 ? (
              <div className="space-y-4">
                {collection.pages.map((page: PageConfig, index: number) => (
                  <Card key={page.slug} className="border-l-4 border-l-primary">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium mb-1">
                            <Link 
                              to={`/${collection.id}/${page.slug}`}
                              className="text-primary hover:underline"
                            >
                              {index + 1}. {page.title}
                            </Link>
                          </h3>
                          {page.description && (
                            <CardDescription>{page.description}</CardDescription>
                          )}
                        </div>
                        <Button asChild size="sm">
                          <Link to={`/${collection.id}/${page.slug}`}>
                            Read
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No pages found in this collection.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

const CollectionPageWrapper = () => {
  const { collectionId, pageSlug } = useParams<{ collectionId: string; pageSlug: string }>();
  if (!collectionId || !pageSlug) {
    return <div>Error: Missing URL parameters.</div>;
  }
  return <CollectionPage collectionId={collectionId} pageId={pageSlug} />;
};

const CollectionTocWrapper = () => {
  const { collectionId } = useParams<{ collectionId: string }>();
  if (!collectionId) {
    return <div>Error: Missing collection ID.</div>;
  }
  const collection = collections.find(c => c.id === collectionId);
  if (!collection) {
    return <div>Collection not found.</div>;
  }
  return <CollectionToc collection={collection} />;
};

const HomePage = () => (
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
);

import { MainLayout } from './components/layout/main-layout';

const LayoutWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <MainLayout collections={collections} modules={modules}>
      {children}
    </MainLayout>
  );
};

import ErrorBoundary from './components/ErrorBoundary';

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
    <ErrorBoundary>
      <BrowserRouter>
        <Suspense fallback={<div className="flex justify-center items-center h-screen">Indlæser...</div>}>
          <Routes>
            {/* Individuelle sider */}
            <Route path="/:collectionId/:pageSlug" element={<LayoutWrapper><CollectionPageWrapper /></LayoutWrapper>} />
            
            {/* Samlings-TOC */}
            <Route path="/:collectionId" element={<LayoutWrapper><CollectionTocWrapper /></LayoutWrapper>} />
            
            {/* Forside */}
            <Route 
              path="/" 
              element={<LayoutWrapper><HomePage /></LayoutWrapper>}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;
