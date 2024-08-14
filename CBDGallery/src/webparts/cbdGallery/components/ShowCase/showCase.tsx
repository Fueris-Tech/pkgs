import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import { SPFx, spfi } from "@pnp/sp";
import * as React from "react";
import "./../../../../tailwind.css";

export interface IShowCase {
    context: BaseWebPartContext;
    count: number;
    link: string;
    detaillink: string;
    slides: number;
}
export const ShowCase: React.FunctionComponent<IShowCase> = (props) => {

    const [galleries, setGalleries] = React.useState<any[]>([]);

    const fetchGalleries = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDGallery")
            .items
            .orderBy("Modified", false)
            .top(props.slides)();
        setGalleries(p => [...p, ...results]);
    }

    const fetchAll = async () => {
        await fetchGalleries();
    }



    React.useEffect(() => {
        fetchAll();
    }, []);

    return (
        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto py-20 photogallery flex flex-wrap gap-5 w-full">
            {galleries && galleries.map((gallery, index) => (
                <a key={`gallery_${index}`} className="flex gap-6 flex-col w-1453 h-1346" href={`${props.detaillink}?IId=${gallery.Id}`}>
                    <div className="w-full h-full relative">
                        <img src={`${props.context.pageContext.site.absoluteUrl}/_layouts/15/getpreview.ashx?path=${gallery.Thumbnail.Url}&resolution=2`} className="w-full h-full object-cover rounded-lg" />
                        <div className="absolute flex gap-2 text-white text-sm items-center bottom-40 right-40">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="16" viewBox="0 0 18 16" fill="none">
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.16797 0C2.50493 0 1.86904 0.263392 1.4002 0.732233C0.931361 1.20107 0.667969 1.83696 0.667969 2.5V10.8333C0.667969 11.2754 0.843563 11.6993 1.15612 12.0118C1.46868 12.3244 1.89261 12.5 2.33464 12.5V2.5C2.33464 2.27899 2.42243 2.06702 2.57871 1.91074C2.73499 1.75446 2.94695 1.66667 3.16797 1.66667H14.8346C14.8346 1.22464 14.659 0.800716 14.3465 0.488155C14.0339 0.175595 13.61 0 13.168 0H3.16797ZM3.16797 4.16667C3.16797 3.72464 3.34356 3.30072 3.65612 2.98816C3.96868 2.67559 4.39261 2.5 4.83464 2.5H15.668C16.11 2.5 16.5339 2.67559 16.8465 2.98816C17.159 3.30072 17.3346 3.72464 17.3346 4.16667V13.6108C17.3346 14.0529 17.159 14.4768 16.8465 14.7893C16.5339 15.1019 16.11 15.2775 15.668 15.2775H4.83464C4.39261 15.2775 3.96868 15.1019 3.65612 14.7893C3.34356 14.4768 3.16797 14.0529 3.16797 13.6108V4.16667ZM15.668 4.16667H4.83464V10.7067L8.0413 7.5C8.13803 7.40324 8.25288 7.32649 8.37928 7.27412C8.50568 7.22176 8.64115 7.19481 8.77797 7.19481C8.91479 7.19481 9.05026 7.22176 9.17666 7.27412C9.30306 7.32649 9.4179 7.40324 9.51464 7.5L12.2155 10.2L12.9521 9.46417C13.0489 9.36741 13.1637 9.29066 13.2901 9.23829C13.4165 9.18592 13.552 9.15897 13.6888 9.15897C13.8256 9.15897 13.9611 9.18592 14.0875 9.23829C14.2139 9.29066 14.3287 9.36741 14.4255 9.46417L15.668 10.7067V4.16667ZM14.0013 6.66667C14.0013 6.99819 13.8696 7.31613 13.6352 7.55055C13.4008 7.78497 13.0828 7.91667 12.7513 7.91667C12.4198 7.91667 12.1018 7.78497 11.8674 7.55055C11.633 7.31613 11.5013 6.99819 11.5013 6.66667C11.5013 6.33515 11.633 6.0172 11.8674 5.78278C12.1018 5.54836 12.4198 5.41667 12.7513 5.41667C13.0828 5.41667 13.4008 5.54836 13.6352 5.78278C13.8696 6.0172 14.0013 6.33515 14.0013 6.66667Z" fill="white" />
                            </svg>
                            <span>{gallery.PhotoCount}</span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
                                <path d="M3.33464 7.16669H1.66797V17.1667C1.66797 17.6087 1.84356 18.0326 2.15612 18.3452C2.46868 18.6578 2.89261 18.8334 3.33464 18.8334H13.3346V17.1667H3.33464V7.16669Z" fill="white" />
                                <path d="M16.6667 2.16667H6.66667C6.22464 2.16667 5.80072 2.34227 5.48816 2.65483C5.17559 2.96739 5 3.39131 5 3.83334V13.8333C5 14.2754 5.17559 14.6993 5.48816 15.0118C5.80072 15.3244 6.22464 15.5 6.66667 15.5H16.6667C17.1087 15.5 17.5326 15.3244 17.8452 15.0118C18.1577 14.6993 18.3333 14.2754 18.3333 13.8333V3.83334C18.3333 3.39131 18.1577 2.96739 17.8452 2.65483C17.5326 2.34227 17.1087 2.16667 16.6667 2.16667ZM9.16667 12.1667V5.50001L15 8.83334L9.16667 12.1667Z" fill="white" />
                            </svg>
                            <span>{gallery.VideoCount}</span>
                        </div>
                    </div>

                    <p className="font-bold text-xl text-gray1">{gallery.Title}</p>
                </a>
            ))}
        </div>
    );
}