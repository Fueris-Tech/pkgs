import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import { SPFx, spfi } from "@pnp/sp";
import * as React from "react";
import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from "keen-slider/react";
import "./../../../../tailwind.css";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { Icon } from "@fluentui/react";

export interface IPhotoGallery {
    context: BaseWebPartContext;
    count: number;
    link: string;
    detaillink: string;
    slides: number;
}
export const PhotoGallery: React.FunctionComponent<IPhotoGallery> = (props) => {

    const [galleries, setGalleries] = React.useState<any[]>([]);
    const [gallery, setGallery] = React.useState<any>({});
    const [slides, setSlides] = React.useState<any[]>();
    const [loading, setLoading] = React.useState<boolean>(false);

    const fetchGalleries = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any = await sp.web.lists
            .getByTitle("CBDGallery")
            .items
            .orderBy("Modified", false)
            .top(props.count)();
        setGalleries(p => [...p, ...results]);
        setGallery((p: any) => ({ ...p, ...results[0] }));
        setLoading(false);
    }

    const fetchSlider = async () => {
        setLoading(false);
        const sp = spfi().using(SPFx(props.context));
        const results: any[] = await sp.web.lists
            .getByTitle(gallery.GalleryList)
            .items.select(
                "Title",
                "FileRef",
                "FileLeafRef",
                "UniqueId"
            )
            .top(props.slides)
            .orderBy("Modified", false)();
        setSlides(results);
        setLoading(true);
    }

    const fetchAll = async () => {
        await fetchGalleries();
    }



    React.useEffect(() => {
        fetchAll();
    }, []);

    React.useEffect(() => {
        if (gallery && gallery.GalleryList && gallery.GalleryList.length > 0) {
            fetchSlider();
        }
    }, [gallery]);

    const [sliderRef] = useKeenSlider<HTMLDivElement>(
        {
            loop: false,
            mode: "snap",
            rtl: false,
            slides: { perView: "auto", spacing: 10 },
        })
    return (
        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto pt-10 pb-8 photogallery" style={{ "minHeight": "340px" }}>
            <div className="text-4xl text-gray1 font-bold px-2 py-8">Picture Gallery</div>
            {galleries && (
                <div className="flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                        <ul className="flex gap-2 items-center flex-wrap">
                            {galleries.map((g: any) => (
                                <li key={`galleries_${g.GalleryList}`} className="cursor-pointer">
                                    <a className={`block px-4 py-2 rounded-full border border-gray4 text-base ${gallery.GalleryList === g.GalleryList ? 'bg-primary text-white font-bold ' : 'text-primary bg-white'}`} onClick={() => setGallery((p: any) => ({ ...p, ...g }))}  >{g.Title}</a>
                                </li>
                            ))}
                        </ul>
                        <a className="w-fit font-bold text-base text-primary  flex-none flex gap-2 items-center" href={`${props.link}?env=WebView`} ><span>View All</span><Icon iconName="ChevronRight" /></a>
                    </div>
                    {loading && <div ref={sliderRef} className="keen-slider py-4">
                        {slides?.map((slide: any, index: number) => (
                            <div key={`slides_${index}`} className="keen-slider__slide h-340 " style={{ maxWidth: 225, minWidth: 225 }} >
                                {slides.length - 1 === index && <div className="absolute w-full h-full grid place-items-center bg-black bg-opacity-50">
                                    <a className="flex w-fit gap-2 " href={`${props.detaillink}?env=WebView&IId=${gallery.Id}`}><span className="text-base text-white font-bold">See All Photos</span><Icon iconName="ChevronRight" className="text-base text-white font-bold" /> </a></div>}

                                <img src={`${props.context.pageContext.site.absoluteUrl}/_layouts/15/getpreview.ashx?path=${slide.FileRef}&resolution=2`} className="w-full h-full object-cover rounded-lg" />
                            </div>
                        ))}
                    </div>
                    }
                </div>
            )}
        </div>
    )
}