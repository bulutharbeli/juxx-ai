import React from 'react';
import ReactDOM from 'react-dom/client';
import { LandingAccordionItem } from './components/ui/interactive-image-accordion.tsx';

// Mount the accordion into the specific container
const container = document.getElementById('accordion-root');
if (container) {
    ReactDOM.createRoot(container).render(
        <React.StrictMode>
            <LandingAccordionItem />
        </React.StrictMode>
    );
}
