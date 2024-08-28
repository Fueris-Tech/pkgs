import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";
import "./../../../../tailwind.css";
import { SPFx, spfi } from "@pnp/sp";
import { Carousel, CarouselButtonsLocation, CarouselButtonsDisplay } from "@pnp/spfx-controls-react/lib/Carousel";
import { ImageFit } from "@fluentui/react/lib/Image";

export interface ISlideShow {
    context: BaseWebPartContext;
    count: number;
    link: string;
    detaillink: string;
    slides: number;
}

export const SlideShow: React.FunctionComponent<ISlideShow> = (props) => {

    const [gallery, setGallery] = React.useState<any>({});
    const [slides, setSlides] = React.useState<any[]>([]);

    const fetchGallery = async () => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('IId')) {
            const id = parseInt(params.get('IId') || '');
            try {

                const sp = spfi().using(SPFx(props.context));
                const result = await sp.web.lists.getByTitle("CBDGallery").items.select("*").getById(id)();
                setGallery((prev: any) => ({ ...prev, ...result }));
                await fetchSlider(result);

            } catch (error) {
                setGallery(null);
            }
        }
    }

    const fetchSlider = async (record: any) => {
        const sp = spfi().using(SPFx(props.context));
        const results: any[] = await sp.web.lists
            .getByTitle(record.GalleryList)
            .items.select(
                "Title",
                "FileRef",
                "FileLeafRef",
                "UniqueId"
            )
            .orderBy("Modified", false)();
        const s: any[] = [];
        results.map(r => {
            s.push({
                imageSrc: r.FileRef,
                //title: record.Title,
                //description: record.Title,
                //showDetailsOnHover: false,
                imageFit: ImageFit.cover

            })
        });
        setSlides(prev => [...prev, ...s]);

    }

    const fetchAll = async () => {
        await fetchGallery();
    }

    React.useEffect(() => {
        fetchAll();
    }, []);

    return (
        <div className="font-cairo m-auto max-w-mdmax py-20 photogallery">
            {gallery && slides && (
                <Carousel
                    buttonsLocation={CarouselButtonsLocation.center}
                    buttonsDisplay={CarouselButtonsDisplay.block}
                    indicators={false}
                    isInfinite={true}
                    pauseOnHover={true}
                    contentContainerStyles={"w-1600 h-1600 rounded-lg"}
                    element={slides}
                    interval={4000}

                />
            )}
        </div>
    );
}