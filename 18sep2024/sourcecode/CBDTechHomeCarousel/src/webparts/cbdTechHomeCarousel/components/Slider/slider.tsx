import { BaseWebPartContext } from "@microsoft/sp-webpart-base";
import * as React from "react";

import 'keen-slider/keen-slider.min.css';
import { useKeenSlider } from "keen-slider/react";
import "./../../../../tailwind.css";
//import { SPFx, spfi } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { SPFx, spfi } from "@pnp/sp";

export interface ISlider {
    context: BaseWebPartContext;
    count: number;
    playspeed: number;
}
export const Slider: React.FunctionComponent<ISlider> = (props) => {

    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [slides, setSlides] = React.useState<any[]>();
    const [loading, setLoading] = React.useState<boolean>(false);

    let height = { "height": "340px" };
    if (window.screen.width > 1400) {
        height = { "height": "440px" };
    }

    const fetchSlider = async () => {

        const sp = spfi().using(SPFx(props.context));
        const results: any[] = await sp.web.lists
            .getByTitle("CBDTechCarousel")
            .items.select(
                "Title",
                "EncodedAbsUrl",
                "FileRef",
                "FileLeafRef",
                "ID",
                "NavigateUrl",
                "Summary",
                "IsNew"
            )
            .filter("ShowInPage eq 1")
            .top(props.count)
            .orderBy("Modified", false)();
        setSlides(results);

    }

    const fetchAll = async () => {
        setLoading(true);
        await fetchSlider();
        setLoading(false);
    }
    React.useEffect(() => {
        fetchAll();
    }, []);


    const [sliderRef, instanceRef] = useKeenSlider<HTMLDivElement>(
        {
            initial: 0,
            loop: true,
            renderMode: "performance",
            slides: {
                number: props.count,
                perView: 1,
                spacing: 20
            },
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel)
            },
        },
        [
            (slider) => {
                let timeout: ReturnType<typeof setTimeout>
                let mouseOver = false
                function clearNextTimeout() {
                    clearTimeout(timeout)
                }
                function nextTimeout() {
                    clearTimeout(timeout)
                    if (mouseOver) return
                    timeout = setTimeout(() => {
                        slider.next()
                    }, props.playspeed || 4000)
                }
                slider.on("created", () => {
                    slider.container.addEventListener("mouseover", () => {
                        mouseOver = true
                        clearNextTimeout()
                    })
                    slider.container.addEventListener("mouseout", () => {
                        mouseOver = false
                        nextTimeout()
                    })
                    nextTimeout()
                })
                slider.on("dragStarted", clearNextTimeout)
                slider.on("animationEnded", nextTimeout)
                slider.on("updated", nextTimeout)
            },
        ]
    )

    // const appendEnvToSharePointUrl = (url: string, IsNew: boolean): string => {
    //     if (!IsNew && url.indexOf(".aspx") !== -1 && url.indexOf("env=WebView") === -1) {
    //         if (url.indexOf("?") !== -1) {
    //             return `${url}&env=WebView`;
    //         } else {
    //             return `${url}?env=WebView`;
    //         }
    //     }
    //     return url;
    // }

    return (
        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto homecarousel" >
            {loading && (
                <div className="flex flex-col w-full  items-center justify-center" style={height}>
                    <div className='flex justify-center items-center gap-2'>
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
                        <div className='h-2 w-2 bg-primary rounded-full animate-bounce'></div>
                    </div>
                    <div className="text-xs text-gray3" >LOADING</div>
                </div>
            )}
            {slides && slides.length > -1 && (
                <div className="relative">
                    <div ref={sliderRef} className="keen-slider">
                        {slides?.map((slide: any, index: number) => (
                            <div key={`slides_${index}`} className="keen-slider__slide w-full rounded-lg " style={height}>

                                <div className="absolute  flex flex-col w-1/2 text-white h-full justify-center px-140 py-100 gap-2 laptop:p-140 laptop:gap-6">
                                    <p className="text-4xl font-bold">{slide.Title}</p>
                                    <p className="text-lg">{slide.Summary}</p>
                                </div>
                                <img src={slide.FileRef} alt={slide.Title} className="object-fill w-full imageSlider" />
                            </div>
                        ))}


                    </div><div className=" flex py-2 gap-2 justify-center absolute bottom-100 large:bottom-120 left-140 ">
                        {slides?.map((slide: any, index: number) => (
                            <button
                                key={index}
                                onClick={() => {
                                    instanceRef.current?.moveToIdx(index);
                                }}
                                className={`outline-none ring-0 focus:outline-none focus:ring-0  bg-white h-1 rounded-sm ${currentSlide === index ? 'w-16' : 'w-8 opacity-25'}`}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>



    );

}