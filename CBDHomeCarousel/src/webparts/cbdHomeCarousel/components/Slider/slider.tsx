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
import { Icon } from "@fluentui/react";

export interface ISlider {
    context: BaseWebPartContext;
    count: number;
    playspeed: number;
}
export const Slider: React.FunctionComponent<ISlider> = (props) => {

    const [currentSlide, setCurrentSlide] = React.useState(0)
    const [slides, setSlides] = React.useState<any[]>();

    let height = { "height": "340px" };
    if (window.screen.width > 1400) {
        height = { "height": "440px" };
    }

    const fetchSlider = async () => {
        const sp = spfi().using(SPFx(props.context));
        const results: any[] = await sp.web.lists
            .getByTitle("CBDCarousel")
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
        await fetchSlider();
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

    return (
        <div className="font-cairo max-w-xmdmax desktop:max-w-xlgmax large:max-w-lgmax  mx-auto">
            {slides === null || slides === undefined || slides && slides.length < 0 && (
                <div role="status" style={height}>
                    <svg aria-hidden="true" className="inline w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-green-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                    </svg>
                    <span className="sr-only">Loading...</span>
                </div>
            )}
            {slides && slides.length > -1 && (
                <div className="relative">
                    <div ref={sliderRef} className="keen-slider">
                        {slides?.map((slide: any, index: number) => (
                            <div key={`slides_${index}`} className="keen-slider__slide w-full rounded-lg  " style={height}>

                                <div className="absolute  flex flex-col w-1/2 text-white h-full justify-center p-140 gap-6">
                                    <p className="text-4xl font-bold">{slide.Title}</p>
                                    <p className="text-lg">{slide.Summary}</p>
                                    <div>
                                        <a className="py-2 px-4 border-2 border-white rounded-full hover:bg-white hover:text-primary hover:font-bold flex gap-2 w-fit" data-interception="off" rel="noopener noreferrer" target={slide.IsNew ? "_blank" : "_self"} href={slide.NavigateUrl} ><span>Click Here </span> <Icon iconName="ChevronRight" /> </a>
                                    </div>
                                </div>
                                <img src={slide.FileRef} alt={slide.Title} className="object-fill w-full h-full" />
                            </div>
                        ))}


                    </div><div className=" flex py-2 gap-2 justify-center absolute bottom-120 left-140 ">
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