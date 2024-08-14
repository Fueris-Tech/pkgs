import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";

export interface IPDFViewer {
    context: BaseWebPartContext;
    link: string;
    pdfHeight: string;
}

export const PDFViewer: React.FunctionComponent<IPDFViewer> = (props) => {
    const [pdfHeight, setPdfHeight] = React.useState<number | null>(null);
    const embedRef = React.useRef<HTMLObjectElement>(null);


    React.useEffect(() => {
        const embedElement = embedRef.current;

        const updatePdfHeight = () => {
            if (embedElement && embedElement.contentDocument) {
                const body = embedElement.contentDocument.body;
                if (body) {
                    const height = body.clientHeight;
                    setPdfHeight(height);
                } else {
                    console.log("Body element not found in PDF content.");
                }
            } else {
                console.log("ContentDocument not accessible on embed element.");
            }
        };

        if (embedElement) {
            // Check if PDF is already loaded
            if (embedElement.contentDocument && embedElement.contentDocument.readyState === 'complete') {
                updatePdfHeight();
            } else {
                // Add event listener for load event
                embedElement.addEventListener('load', updatePdfHeight);
            }

            // Cleanup: remove event listener
            return () => {
                embedElement.removeEventListener('load', updatePdfHeight);
            };
        }
    }, []);



    React.useEffect(() => {
        console.log("PDFViewer rendered with PDF link:", props.link);
    }, []); // Empty dependency array means effect runs once, after initial render

    React.useEffect(() => {
        console.log("PDF height updated:", pdfHeight);
    }, [pdfHeight]); // Log when pdfHeight changes

    return (
        <div className="flex justify-center items-center bg-gray-100" style={{ height: props.pdfHeight }}>
            <object
                data={props.link}
                type="application/pdf"
                className="w-full h-full"
                style={{ width: '100%', height: '100%' }}
            />
        </div>
    );
}
