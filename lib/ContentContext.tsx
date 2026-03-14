import React, { createContext, useContext, useState, useEffect } from 'react';

export interface ContentData {
    hero: {
        title: string;
        description: string;
        splineUrl: string;
    };
    sections: {
        portfolio: {
            badge: string;
            title: string;
        };
        capabilities: {
            badge: string;
            title: string;
            subtitle: string;
            description: string;
            label: string;
            buttonText: string;
        };
    };
    portfolio: Array<{
        id: number;
        title: string;
        category: string;
        year: string;
        imageUrl: string;
    }>;
    capabilities: Array<{
        id: number;
        title: string;
        imageUrl: string;
    }>;
    services: Array<{
        id: number;
        title: string;
        description: string;
    }>;
    logos: string[];
    footerAction: {
        headline: string;
        subheadline: string;
        videoUrl: string;
    };
    contact: {
        email: string;
        headline: string;
    };
}

interface ContentContextType {
    content: ContentData | null;
    updateContent: (newContent: ContentData) => void;
    resetContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const ContentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [content, setContent] = useState<ContentData | null>(null);

    const loadInitial = async () => {
        try {
            const res = await fetch('/content.json');
            if (!res.ok) throw new Error(`Status: ${res.status}`);
            const baseData = await res.json();

            const saved = localStorage.getItem('juxx_site_content');
            if (saved) {
                const parsed = JSON.parse(saved);
                // Simple migration/merge: ensure new fields from baseData exist in parsed
                const merged = { ...baseData, ...parsed };
                // Ensure array fields from baseData exist if not in parsed
                if (!parsed.services) merged.services = baseData.services;
                if (!parsed.portfolio) merged.portfolio = baseData.portfolio;
                if (!parsed.capabilities) merged.capabilities = baseData.capabilities;

                // Deep merge sections for reliability
                merged.sections = { ...baseData.sections, ...(parsed.sections || {}) };
                if (parsed.sections) {
                    merged.sections.portfolio = { ...baseData.sections.portfolio, ...(parsed.sections.portfolio || {}) };
                    merged.sections.capabilities = { ...baseData.sections.capabilities, ...(parsed.sections.capabilities || {}) };
                }
                setContent(merged);
            } else {
                setContent(baseData);
            }
        } catch (err) {
            console.error('Failed to load content engine:', err);
        }
    };

    useEffect(() => {
        loadInitial();
    }, []);

    const updateContent = (newContent: ContentData) => {
        setContent(newContent);
        localStorage.setItem('juxx_site_content', JSON.stringify(newContent));
    };

    const resetContent = () => {
        localStorage.removeItem('juxx_site_content');
        loadInitial();
    };

    return (
        <ContentContext.Provider value={{ content, updateContent, resetContent }}>
            {children}
        </ContentContext.Provider>
    );
};

export const useContent = () => {
    const context = useContext(ContentContext);
    if (!context) throw new Error('useContent must be used within a ContentProvider');
    return context;
};
